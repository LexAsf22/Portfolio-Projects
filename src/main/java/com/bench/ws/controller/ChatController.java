package com.bench.ws.controller;

import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import com.bench.ws.dto.*;
import com.bench.ws.repository.*;

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

    @MessageMapping("/send")
    @SendTo("/topic/channel1")
    public Message handleSendMessage(Message message) {
        message.setTimestamp(LocalDateTime.now());
        message.setStatus(Message.Status.SENT);
        messageRepository.save(message);
        return message;
    }

    @MessageMapping("/call-ended")
    @SendTo("/topic/call-ended")
    public Message handleCallEnded(Message message) {
        message.setTimestamp(LocalDateTime.now());
        messageRepository.save(message);
        return message;
    }

    @MessageMapping("/call-signal")
    @SendTo("/topic/call-signal")
    public CallSignal handleCallSignal(CallSignal signal) { return signal; }

    @MessageMapping("/call-notify")
    @SendTo("/topic/call-notify")
    public CallSignal handleCallNotify(CallSignal signal) { return signal; }

    @MessageMapping("/typing")
    @SendTo("/topic/typing")
    public TypingEvent handleTyping(TypingEvent event) { return event; }

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
                new MessageReaction(event.getMessageId(), event.getUsername(), event.getEmoji()));
            event.setAction("ADD");
        }

        event.setReactions(reactionRepository.findByMessageId(event.getMessageId()));
        messagingTemplate.convertAndSend("/topic/reaction", event);
    }

    // ── Edit a message ─────────────────────────────────────────
    @MessageMapping("/edit")
    public void handleEdit(MessageEditEvent event) {
        Optional<Message> opt = messageRepository.findById(event.getMessageId());
        if (opt.isPresent()) {
            Message msg = opt.get();
            if (!msg.getSender().equals(event.getEditor())) return; // only owner
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
            if (!msg.getSender().equals(event.getDeletedBy())) return; // only owner
            msg.setDeleted(true);
            msg.setContent("This message was deleted.");
            messageRepository.save(msg);
            messagingTemplate.convertAndSend("/topic/delete", event);
        }
    }
}