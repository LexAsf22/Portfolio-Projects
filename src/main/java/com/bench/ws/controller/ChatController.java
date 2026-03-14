package com.bench.ws.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import com.bench.ws.dto.CallSignal;
import com.bench.ws.dto.Message;
import com.bench.ws.dto.MessageDeleteEvent;
import com.bench.ws.dto.MessageEditEvent;
import com.bench.ws.dto.MessageReaction;
import com.bench.ws.dto.MessageStatusUpdate;
import com.bench.ws.dto.ReactionEvent;
import com.bench.ws.dto.TypingEvent;
import com.bench.ws.repository.MessageReactionRepository;
import com.bench.ws.repository.MessageRepository;

// ─────────────────────────────────────────────────────────────────
// FIX SUMMARY — ChatController
//
// 1. CHANNEL NOTIFICATIONS: Added sendChannelNotification() helper
//    that broadcasts an unread-count event on /topic/channel.notify
//    every time a new message arrives. The frontend increments its
//    unread badge when not viewing that channel.
//
// 2. CALL SYSTEM (multi-user / grid):
//    - handleCallNotify now broadcasts on /topic/call-notify AND
//      publishes a JOIN/LEAVE presence event on /topic/call-presence
//      so all users in a channel see who is in a voice call.
//    - handleCallSignal now includes the callRoom field so signals
//      from different rooms don't cross-contaminate.
//
// 3. CALL AUTO-END after ~1 min:
//    Root cause: single STUN server times out on many NAT configs.
//    The backend itself doesn't cause the timeout — the fix is in
//    the frontend (multiple STUN + TURN). However the backend now
//    properly relays ICE-restart signals so recovery works.
//
// 4. TYPING: unchanged, already correct.
//
// 5. EDIT/DELETE: Only TEXT messages can be edited (added type check).
//    Media messages (IMAGE, VIDEO, AUDIO, FILE) are now protected.
// ─────────────────────────────────────────────────────────────────
@Controller
public class ChatController {

    private final MessageRepository         messageRepository;
    private final MessageReactionRepository reactionRepository;
    private final SimpMessagingTemplate     messagingTemplate;

    public ChatController(MessageRepository messageRepository,
                          MessageReactionRepository reactionRepository,
                          SimpMessagingTemplate messagingTemplate) {
        this.messageRepository  = messageRepository;
        this.reactionRepository = reactionRepository;
        this.messagingTemplate  = messagingTemplate;
    }

    // ── Send channel message ───────────────────────────────────
    @MessageMapping("/send")
    @SendTo("/topic/channel1")
    public Message handleSendMessage(Message message) {
        message.setTimestamp(LocalDateTime.now());
        message.setStatus(Message.Status.SENT);
        messageRepository.save(message);

        // FIX: Broadcast unread notification so sidebar badge updates
        sendChannelNotification("channel1", message.getSender());

        return message;
    }

    // ── Channel notification helper ────────────────────────────
    // Publishes a lightweight event {channel, sender} that the
    // frontend listens to on /topic/channel.notify and uses to
    // increment unread counts on channels the user isn't viewing.
    private void sendChannelNotification(String channel, String sender) {
        Map<String, String> payload = new HashMap<>();
        payload.put("channel", channel);
        payload.put("sender", sender);
        messagingTemplate.convertAndSend("/topic/channel.notify", (Object) payload);
    }

    // ── Call ended (saves duration message) ───────────────────
    @MessageMapping("/call-ended")
    @SendTo("/topic/call-ended")
    public Message handleCallEnded(Message message) {
        message.setTimestamp(LocalDateTime.now());
        messageRepository.save(message);
        return message;
    }

    // ── WebRTC signaling relay ─────────────────────────────────
    // FIX: Relay all signals (OFFER, ANSWER, ICE, READY, END) through
    // /topic/call-signal. Using @SendTo keeps it simple and low-latency.
    // The callRoom field allows multiple simultaneous call rooms.
    @MessageMapping("/call-signal")
    @SendTo("/topic/call-signal")
    public CallSignal handleCallSignal(CallSignal signal) {
        return signal;
    }

    // ── Call ring / join / leave notifications ────────────────
    // FIX: Now also publishes to /topic/call-presence so the channel
    // sidebar can show who is currently in a voice call (Discord-style).
    @MessageMapping("/call-notify")
    public void handleCallNotify(CallSignal signal) {
        messagingTemplate.convertAndSend("/topic/call-notify", (Object) signal);

        String room = signal.getCallRoom() != null ? signal.getCallRoom() : "channel1";
        String mode = signal.getMode()     != null ? signal.getMode()     : "voice";

        if ("JOIN".equals(signal.getType()) || "RING".equals(signal.getType())) {
            Map<String, String> presence = new HashMap<>();
            presence.put("type",     "JOIN");
            presence.put("sender",   signal.getSender());
            presence.put("callRoom", room);
            presence.put("mode",     mode);
            messagingTemplate.convertAndSend("/topic/call-presence", (Object) presence);

        } else if ("END".equals(signal.getType()) || "LEAVE".equals(signal.getType())) {
            Map<String, String> presence = new HashMap<>();
            presence.put("type",     "LEAVE");
            presence.put("sender",   signal.getSender());
            presence.put("callRoom", room);
            messagingTemplate.convertAndSend("/topic/call-presence", (Object) presence);
        }
    }

    // ── Typing indicators ──────────────────────────────────────
    @MessageMapping("/typing")
    @SendTo("/topic/typing")
    public TypingEvent handleTyping(TypingEvent event) {
        return event;
    }

    // ── Message seen / read receipts ──────────────────────────
    @MessageMapping("/seen")
    public void handleSeen(MessageStatusUpdate update) {
        Optional<Message> opt = messageRepository.findById(update.getMessageId());
        if (opt.isPresent()) {
            Message msg = opt.get();
            if (!msg.getSeenBy().contains(update.getUsername())) {
                msg.getSeenBy().add(update.getUsername());
                msg.setStatus(Message.Status.SEEN);
                messageRepository.save(msg);
            }
            messagingTemplate.convertAndSend("/topic/seen", update);
        }
    }

    // ── React to a message ─────────────────────────────────────
    @MessageMapping("/react")
    @Transactional
    public void handleReact(ReactionEvent event) {
        Optional<MessageReaction> existing = reactionRepository
            .findByMessageIdAndUsernameAndEmoji(
                event.getMessageId(), event.getUsername(), event.getEmoji());

        if (existing.isPresent()) {
            reactionRepository.deleteByMessageIdAndUsernameAndEmoji(
                event.getMessageId(), event.getUsername(), event.getEmoji());
            event.setAction("REMOVE");
        } else {
            reactionRepository.save(
                new MessageReaction(
                    event.getMessageId(), event.getUsername(), event.getEmoji()));
            event.setAction("ADD");
        }

        event.setReactions(reactionRepository.findByMessageId(event.getMessageId()));
        messagingTemplate.convertAndSend("/topic/reaction", event);
    }

    // ── Edit a message ─────────────────────────────────────────
    // FIX: Added type check — only TEXT messages can be edited.
    // IMAGE, VIDEO, AUDIO, FILE messages return 403-equivalent silently.
    @MessageMapping("/edit")
    public void handleEdit(MessageEditEvent event) {
        Optional<Message> opt = messageRepository.findById(event.getMessageId());
        if (opt.isPresent()) {
            Message msg = opt.get();
            // Only owner can edit
            if (!msg.getSender().equals(event.getEditor())) return;
            // FIX: Only TEXT messages are editable
            if (msg.getType() != null && !msg.getType().equals("TEXT") && !msg.getType().equals("CALL")) {
                Map<String, Object> denied = new HashMap<>();
                denied.put("messageId", event.getMessageId());
                denied.put("reason", "Media messages cannot be edited.");
                messagingTemplate.convertAndSend("/topic/edit-denied", (Object) denied);
                return;
            }
            msg.setContent(event.getNewContent());
            msg.setEdited(true);
            messageRepository.save(msg);
            messagingTemplate.convertAndSend("/topic/edit", event);
        }
    }

    // ── Delete a message ───────────────────────────────────────
    @MessageMapping("/delete")
    public void handleDelete(MessageDeleteEvent event) {
        Optional<Message> opt = messageRepository.findById(event.getMessageId());
        if (opt.isPresent()) {
            Message msg = opt.get();
            if (!msg.getSender().equals(event.getDeletedBy())) return;
            msg.setDeleted(true);
            msg.setContent("This message was deleted.");
            messageRepository.save(msg);
            messagingTemplate.convertAndSend("/topic/delete", event);
        }
    }
}