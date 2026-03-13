package com.bench.ws.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bench.ws.dto.DirectMessage;
import com.bench.ws.dto.DmPayload;
import com.bench.ws.repository.DirectMessageRepository;

@Controller
@CrossOrigin("*")
public class DirectMessageController {

    private final DirectMessageRepository dmRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public DirectMessageController(DirectMessageRepository dmRepository,
                                   SimpMessagingTemplate messagingTemplate) {
        this.dmRepository      = dmRepository;
        this.messagingTemplate = messagingTemplate;
    }

    // ── WebSocket send ─────────────────────────────────────────
    @MessageMapping("/dm.send")
    public void handleDm(DmPayload payload) {
        DirectMessage dm = new DirectMessage(
            payload.getSender(), payload.getRecipient(),
            payload.getContent(), payload.getType(), payload.getFileUrl()
        );
        dmRepository.save(dm);

        // Deliver to both sender and recipient
        messagingTemplate.convertAndSend("/topic/dm." + payload.getRecipient(), dm);
        messagingTemplate.convertAndSend("/topic/dm." + payload.getSender(),    dm);
    }

    // ── Mark DM as seen ───────────────────────────────────────
    @MessageMapping("/dm.seen")
    public void handleDmSeen(DmPayload payload) {
        List<DirectMessage> msgs = dmRepository.findConversation(
            payload.getSender(), payload.getRecipient()
        );
        msgs.stream()
            .filter(m -> m.getRecipient().equals(payload.getSender()) && !m.isSeen())
            .forEach(m -> { m.setSeen(true); dmRepository.save(m); });
        messagingTemplate.convertAndSend("/topic/dm.seen." + payload.getRecipient(), payload);
    }

    // ── REST: conversation history ─────────────────────────────
    @GetMapping("/dm/history")
    @ResponseBody
    public ResponseEntity<List<DirectMessage>> history(
            @RequestParam String userA, @RequestParam String userB) {
        return ResponseEntity.ok(dmRepository.findConversation(userA, userB));
    }
}