package com.bench.ws.controller;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.bench.ws.dto.CallSignal;
import com.bench.ws.dto.Message;
import com.bench.ws.dto.MessageStatusUpdate;
import com.bench.ws.dto.TypingEvent;
import com.bench.ws.repository.MessageRepository;

@Controller
public class ChatController {

    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(MessageRepository messageRepository,
                          SimpMessagingTemplate messagingTemplate) {
        this.messageRepository = messageRepository;
        this.messagingTemplate = messagingTemplate;
    }

    // ── Chat messages ──────────────────────────────────────────
    @MessageMapping("/send")
    @SendTo("/topic/channel1")
    public Message handleSendMessage(Message message) {
        message.setTimestamp(LocalDateTime.now());
        message.setStatus(Message.Status.SENT);
        messageRepository.save(message);
        return message;
    }

    // ── Call ended ─────────────────────────────────────────────
    @MessageMapping("/call-ended")
    @SendTo("/topic/call-ended")
    public Message handleCallEnded(Message message) {
        message.setTimestamp(LocalDateTime.now());
        messageRepository.save(message);
        return message;
    }

    // ── WebRTC signalling ──────────────────────────────────────
    @MessageMapping("/call-signal")
    @SendTo("/topic/call-signal")
    public CallSignal handleCallSignal(CallSignal signal) {
        return signal;
    }

    // ── Call ring / reject ─────────────────────────────────────
    @MessageMapping("/call-notify")
    @SendTo("/topic/call-notify")
    public CallSignal handleCallNotify(CallSignal signal) {
        return signal;
    }

    // ── Typing indicator ───────────────────────────────────────
    @MessageMapping("/typing")
    @SendTo("/topic/typing")
    public TypingEvent handleTyping(TypingEvent event) {
        return event;
    }

    // ── Mark message as seen ───────────────────────────────────
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
}