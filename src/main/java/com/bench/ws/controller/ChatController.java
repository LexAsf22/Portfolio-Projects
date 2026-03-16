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
import com.bench.ws.dto.MessageEditHistory;
import com.bench.ws.dto.MessageReaction;
import com.bench.ws.dto.MessageStatusUpdate;
import com.bench.ws.dto.ReactionEvent;
import com.bench.ws.dto.TypingEvent;
import com.bench.ws.dto.User;
import com.bench.ws.repository.MessageEditHistoryRepository;
import com.bench.ws.repository.MessageReactionRepository;
import com.bench.ws.repository.MessageRepository;
import com.bench.ws.repository.UserRepository;
import com.bench.ws.service.ModerationService;

/**
 * ChatController — updated for new features:
 *
 * FEATURE: Moderation Tools
 *   - Banned users cannot send messages (returns MODERATION error event)
 *   - Muted/timed-out users cannot send messages
 *   - Blocked user messages are silently dropped for the recipient
 *   - Auto-moderation filters banned words before saving
 *
 * FEATURE: Message Editing History
 *   - Every edit saves the previous content to MessageEditHistory
 *   - Edit count is included in the broadcast so frontend can show
 *     "Edited 3 times" and allow viewing history
 *
 * FEATURE: Roles & Permissions
 *   - MODERATOR+ can delete any message
 *   - Regular users can only delete their own messages
 *
 * FEATURE: Message Timestamp
 *   - timestamp is set server-side and serialized as ISO-8601 via JacksonConfig
 */
@Controller
public class ChatController {

    private final MessageRepository          messageRepository;
    private final MessageReactionRepository  reactionRepository;
    private final MessageEditHistoryRepository editHistoryRepository;
    private final UserRepository             userRepository;
    private final SimpMessagingTemplate      messagingTemplate;
    private final ModerationService          moderationService;

    public ChatController(MessageRepository messageRepository,
                          MessageReactionRepository reactionRepository,
                          MessageEditHistoryRepository editHistoryRepository,
                          UserRepository userRepository,
                          SimpMessagingTemplate messagingTemplate,
                          ModerationService moderationService) {
        this.messageRepository      = messageRepository;
        this.reactionRepository     = reactionRepository;
        this.editHistoryRepository  = editHistoryRepository;
        this.userRepository         = userRepository;
        this.messagingTemplate      = messagingTemplate;
        this.moderationService      = moderationService;
    }

    // ── Send channel message ───────────────────────────────────
    @MessageMapping("/send")
    @SendTo("/topic/channel1")
    public Message handleSendMessage(Message message) {

        // FEATURE: Moderation — check if sender is banned or muted
        User sender = userRepository.findByUsername(message.getSender()).orElse(null);
        if (sender != null) {
            if (sender.isCurrentlyBanned()) {
                sendModerationError(message.getSender(), "BANNED",
                    "You are banned from this server.");
                return null; // @SendTo with null drops the message
            }
            if (sender.isCurrentlyMuted()) {
                sendModerationError(message.getSender(), "MUTED",
                    "You are timed out until " + sender.getMutedUntil());
                return null;
            }
        }

        // FEATURE: Auto-moderation — filter content
        if (message.getContent() != null) {
            String processed = moderationService.processMessage(message.getContent());
            if (processed == null) {
                // Message was blocked (pure spam etc.)
                sendModerationError(message.getSender(), "FILTERED",
                    "Your message was blocked by auto-moderation.");
                return null;
            }
            message.setContent(processed);
        }

        message.setTimestamp(LocalDateTime.now());
        message.setStatus(Message.Status.SENT);
        messageRepository.save(message);

        sendChannelNotification("channel1", message.getSender());
        return message;
    }

    // ── Edit a message — with history ─────────────────────────
    @MessageMapping("/edit")
    public void handleEdit(MessageEditEvent event) {
        Optional<Message> opt = messageRepository.findById(event.getMessageId());
        if (opt.isEmpty()) return;

        Message msg = opt.get();

        // Only original sender can edit
        if (!msg.getSender().equals(event.getEditor())) return;

        // Only TEXT messages are editable
        if (msg.getType() != null && !msg.getType().equals("TEXT")) {
            Map<String, Object> denied = new HashMap<>();
            denied.put("messageId", event.getMessageId());
            denied.put("reason", "Only text messages can be edited.");
            messagingTemplate.convertAndSend("/topic/edit-denied", (Object) denied);
            return;
        }

        // FEATURE: Message Editing History — save previous version before overwriting
        int editCount = editHistoryRepository
            .countByMessageIdAndMessageType(msg.getId(), "CHANNEL");

        editHistoryRepository.save(new MessageEditHistory(
            msg.getId(),
            "CHANNEL",
            msg.getContent(),         // save the OLD content
            event.getEditor(),
            editCount + 1             // this is the N-th edit
        ));

        // Now update to the new content
        msg.setContent(event.getNewContent());
        msg.setEdited(true);
        messageRepository.save(msg);

        // Include edit count in the broadcast so frontend shows "Edited N times"
        Map<String, Object> editPayload = new HashMap<>();
        editPayload.put("messageId",  event.getMessageId());
        editPayload.put("newContent", event.getNewContent());
        editPayload.put("editor",     event.getEditor());
        editPayload.put("editCount",  editCount + 1);
        messagingTemplate.convertAndSend("/topic/edit", (Object) editPayload);
    }

    // ── Delete a message ───────────────────────────────────────
    @MessageMapping("/delete")
    public void handleDelete(MessageDeleteEvent event) {
        Optional<Message> opt = messageRepository.findById(event.getMessageId());
        if (opt.isEmpty()) return;

        Message msg = opt.get();

        // FEATURE: Roles & Permissions — MODERATOR+ can delete any message
        User deleter = userRepository.findByUsername(event.getDeletedBy()).orElse(null);
        boolean isModerator = deleter != null &&
            (deleter.getRole().equals("MODERATOR") ||
             deleter.getRole().equals("ADMIN") ||
             deleter.getRole().equals("OWNER"));

        if (!msg.getSender().equals(event.getDeletedBy()) && !isModerator) return;

        msg.setDeleted(true);
        msg.setContent("This message was deleted.");
        messageRepository.save(msg);
        messagingTemplate.convertAndSend("/topic/delete", event);
    }

    // ── Call ended ─────────────────────────────────────────────
    @MessageMapping("/call-ended")
    @SendTo("/topic/call-ended")
    public Message handleCallEnded(Message message) {
        message.setTimestamp(LocalDateTime.now());
        messageRepository.save(message);
        return message;
    }

    // ── WebRTC signaling relay ─────────────────────────────────
    @MessageMapping("/call-signal")
    @SendTo("/topic/call-signal")
    public CallSignal handleCallSignal(CallSignal signal) {
        return signal;
    }

    // ── Call ring / join / leave notifications ─────────────────
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

    // ── Presence re-announce ──────────────────────────────────
    @MessageMapping("/presence")
    public void handlePresence(Map<String, String> payload) {
        // Re-broadcast presence so newly connected devices get the online list
        // The actual broadcast is handled by PresenceEventListener
        // This endpoint is called by the frontend on reconnect
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

    // ── Helpers ────────────────────────────────────────────────

    private void sendChannelNotification(String channel, String sender) {
        Map<String, String> payload = new HashMap<>();
        payload.put("channel", channel);
        payload.put("sender",  sender);
        messagingTemplate.convertAndSend("/topic/channel.notify", (Object) payload);
    }

    /** Sends a moderation error to the specific user's personal topic. */
    private void sendModerationError(String username, String type, String reason) {
        Map<String, Object> event = Map.of(
            "type",   type,
            "reason", reason
        );
        messagingTemplate.convertAndSend(
            "/topic/moderation." + username, (Object) event);
    }
}