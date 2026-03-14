package com.bench.ws.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.bench.ws.dto.DirectMessage;
import com.bench.ws.dto.DmPayload;
import com.bench.ws.repository.DirectMessageRepository;

// ─────────────────────────────────────────────────────────────────
// FIX SUMMARY — DirectMessageController
//
// Root cause of "DMs not working":
//   1. The frontend subscribes to /topic/dm.{username} on connect,
//      BUT the subscription happens BEFORE openDm() is called.
//      The subscription must be set up in onConnect, not lazily.
//      (Frontend fix also required — see WebSocketClient notes.)
//
//   2. DmPayload was missing null-checks; a missing type defaulted
//      to null which caused the entity save to fail silently.
//
//   3. The /dm/history endpoint lacked @CrossOrigin so preflight
//      CORS requests were rejected, making history load fail.
//
//   4. Added dm.typing endpoint so typing indicators work in DMs.
//
//   5. Added dm.delete and dm.edit endpoints for DM message actions.
// ─────────────────────────────────────────────────────────────────
@Controller
@CrossOrigin("*")
public class DirectMessageController {

    private final DirectMessageRepository  dmRepository;
    private final SimpMessagingTemplate    messagingTemplate;

    public DirectMessageController(DirectMessageRepository dmRepository,
                                   SimpMessagingTemplate messagingTemplate) {
        this.dmRepository      = dmRepository;
        this.messagingTemplate = messagingTemplate;
    }

    // ── WebSocket: send DM ─────────────────────────────────────
    @MessageMapping("/dm.send")
    public void handleDm(DmPayload payload) {
        // Guard: require both sender and recipient
        if (payload.getSender() == null || payload.getRecipient() == null) return;

        // Default type to TEXT if not specified
        String type = payload.getType() != null ? payload.getType() : "TEXT";

        DirectMessage dm = new DirectMessage(
            payload.getSender(),
            payload.getRecipient(),
            payload.getContent() != null ? payload.getContent() : "",
            type,
            payload.getFileUrl()
        );
        dmRepository.save(dm);

        // FIX: Deliver to BOTH participants so both see the message
        // in real time without needing to refresh.
        messagingTemplate.convertAndSend("/topic/dm." + payload.getRecipient(), dm);
        messagingTemplate.convertAndSend("/topic/dm." + payload.getSender(),    dm);
    }

    // ── WebSocket: mark DMs as seen ────────────────────────────
    @MessageMapping("/dm.seen")
    public void handleDmSeen(DmPayload payload) {
        if (payload.getSender() == null || payload.getRecipient() == null) return;

        List<DirectMessage> msgs = dmRepository.findConversation(
            payload.getSender(), payload.getRecipient());

        msgs.stream()
            .filter(m -> m.getRecipient().equals(payload.getSender()) && !m.isSeen())
            .forEach(m -> {
                m.setSeen(true);
                dmRepository.save(m);
            });

        messagingTemplate.convertAndSend(
            "/topic/dm.seen." + payload.getRecipient(), payload);
    }

    // ── WebSocket: typing indicator in DMs ────────────────────
    // FIX: Added dedicated DM typing topic so channel typing
    // indicators don't bleed into DM conversations.
    @MessageMapping("/dm.typing")
    public void handleDmTyping(DmPayload payload) {
        if (payload.getSender() == null || payload.getRecipient() == null) return;
        // Notify only the recipient
        messagingTemplate.convertAndSend(
            "/topic/dm.typing." + payload.getRecipient(), payload);
    }

    // ── WebSocket: edit DM ─────────────────────────────────────
    @MessageMapping("/dm.edit")
    public void handleDmEdit(DmPayload payload) {
        if (payload.getId() == null) return;
        dmRepository.findById(payload.getId()).ifPresent(dm -> {
            // Only the original sender can edit
            if (!dm.getSender().equals(payload.getSender())) return;
            // Only text messages are editable
            if (!"TEXT".equals(dm.getType())) return;
            dm.setContent(payload.getContent());
            dm.setEdited(true);
            dmRepository.save(dm);
            // Notify both participants
            messagingTemplate.convertAndSend("/topic/dm.edit." + dm.getRecipient(), dm);
            messagingTemplate.convertAndSend("/topic/dm.edit." + dm.getSender(),    dm);
        });
    }

    // ── WebSocket: delete DM ───────────────────────────────────
    @MessageMapping("/dm.delete")
    public void handleDmDelete(DmPayload payload) {
        if (payload.getId() == null) return;
        dmRepository.findById(payload.getId()).ifPresent(dm -> {
            if (!dm.getSender().equals(payload.getSender())) return;
            dm.setDeleted(true);
            dm.setContent("This message was deleted.");
            dmRepository.save(dm);
            messagingTemplate.convertAndSend("/topic/dm.delete." + dm.getRecipient(), dm);
            messagingTemplate.convertAndSend("/topic/dm.delete." + dm.getSender(),    dm);
        });
    }

    // ── REST: conversation history ─────────────────────────────
    // FIX: Added explicit @CrossOrigin and @ResponseBody so the
    // endpoint is reachable from the React frontend without CORS errors.
    @GetMapping("/dm/history")
    @ResponseBody
    public ResponseEntity<List<DirectMessage>> history(
            @RequestParam String userA,
            @RequestParam String userB) {
        return ResponseEntity.ok(dmRepository.findConversation(userA, userB));
    }
}