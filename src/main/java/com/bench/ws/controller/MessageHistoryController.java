package com.bench.ws.controller;

import com.bench.ws.dto.MessageEditHistory;
import com.bench.ws.repository.MessageEditHistoryRepository;
import com.bench.ws.repository.MessageRepository;
import com.bench.ws.repository.RoomMessageRepository;
import com.bench.ws.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * MessageHistoryController
 *
 * FEATURE: Message Editing History
 *
 * GET /messages/{id}/history?type=CHANNEL   — channel message edit history
 * GET /messages/{id}/history?type=ROOM      — room message edit history
 * GET /messages/{id}/history?type=DM        — DM edit history
 *
 * Returns a list of all previous versions, sorted oldest-first.
 * Each entry contains: previousContent, editedBy, editedAt, editNumber
 *
 * The frontend uses this to show a "View edit history" popup
 * when the user clicks "(edited)" on a message.
 */
@RestController
@RequestMapping("/messages")
@CrossOrigin("*")
public class MessageHistoryController {

    private final MessageEditHistoryRepository editHistoryRepository;
    private final JwtUtil                      jwtUtil;

    public MessageHistoryController(MessageEditHistoryRepository editHistoryRepository,
                                     JwtUtil jwtUtil) {
        this.editHistoryRepository = editHistoryRepository;
        this.jwtUtil               = jwtUtil;
    }

    /**
     * GET /messages/{id}/history?type=CHANNEL
     *
     * Returns all edit history entries for a message.
     * Example response:
     * [
     *   { "editNumber": 1, "previousContent": "Hello world",
     *     "editedBy": "alice", "editedAt": "2025-01-15T10:30:00" },
     *   { "editNumber": 2, "previousContent": "Hello wrold",
     *     "editedBy": "alice", "editedAt": "2025-01-15T10:35:00" }
     * ]
     *
     * The CURRENT content is in the message itself.
     * The history shows what it USED to say before each edit.
     */
    @GetMapping("/{id}/history")
    public ResponseEntity<?> getEditHistory(
            @PathVariable Long id,
            @RequestParam(defaultValue = "CHANNEL") String type,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Auth check — must be a valid user
            jwtUtil.extractUsername(authHeader.substring(7));

            List<MessageEditHistory> history = editHistoryRepository
                .findByMessageIdAndMessageTypeOrderByEditNumberAsc(id, type.toUpperCase());

            if (history.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                    "messageId",  id,
                    "editCount",  0,
                    "history",    List.of(),
                    "message",    "This message has not been edited"
                ));
            }

            return ResponseEntity.ok(Map.of(
                "messageId",  id,
                "editCount",  history.size(),
                "history",    history
            ));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
}