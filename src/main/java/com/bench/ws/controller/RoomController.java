package com.bench.ws.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.*;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.bench.ws.dto.*;
import com.bench.ws.repository.*;

@Controller
@CrossOrigin("*")
public class RoomController {

    private final RoomRepository roomRepository;
    private final RoomMessageRepository roomMessageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public RoomController(RoomRepository roomRepository,
                          RoomMessageRepository roomMessageRepository,
                          SimpMessagingTemplate messagingTemplate) {
        this.roomRepository        = roomRepository;
        this.roomMessageRepository = roomMessageRepository;
        this.messagingTemplate     = messagingTemplate;
    }

    // ── REST: list all rooms ───────────────────────────────────
    @GetMapping("/rooms")
    @ResponseBody
    public ResponseEntity<List<Room>> listRooms() {
        return ResponseEntity.ok(roomRepository.findAll());
    }

    // ── REST: create room ──────────────────────────────────────
    @PostMapping("/rooms")
    @ResponseBody
    public ResponseEntity<?> createRoom(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String desc = body.getOrDefault("description", "");
        String user = body.get("createdBy");
        if (roomRepository.existsByName(name))
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Room name already taken"));
        Room room = new Room(name, desc, user);
        return ResponseEntity.ok(roomRepository.save(room));
    }

    // ── REST: join room ────────────────────────────────────────
    @PostMapping("/rooms/{id}/join")
    @ResponseBody
    public ResponseEntity<?> joinRoom(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Room room = roomRepository.findById(id).orElse(null);
        if (room == null) return ResponseEntity.notFound().build();
        room.getMembers().add(body.get("username"));
        roomRepository.save(room);
        messagingTemplate.convertAndSend("/topic/room.members." + id, room.getMembers());
        return ResponseEntity.ok(room);
    }

    // ── REST: leave room ──────────────────────────────────────
    @PostMapping("/rooms/{id}/leave")
    @ResponseBody
    public ResponseEntity<?> leaveRoom(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Room room = roomRepository.findById(id).orElse(null);
        if (room == null) return ResponseEntity.notFound().build();
        room.getMembers().remove(body.get("username"));
        roomRepository.save(room);
        messagingTemplate.convertAndSend("/topic/room.members." + id, room.getMembers());
        return ResponseEntity.ok(room);
    }

    // ── REST: room message history ─────────────────────────────
    @GetMapping("/rooms/{id}/history")
    @ResponseBody
    public ResponseEntity<List<RoomMessage>> roomHistory(@PathVariable Long id) {
        return ResponseEntity.ok(roomMessageRepository.findByRoomIdOrderByTimestampAsc(id));
    }

    // ── WebSocket: send room message ───────────────────────────
    @MessageMapping("/room.send")
    public void handleRoomMessage(RoomMessagePayload payload) {
        RoomMessage msg = new RoomMessage(
            payload.getRoomId(), payload.getSender(),
            payload.getContent(), payload.getType(), payload.getFileUrl()
        );
        roomMessageRepository.save(msg);
        messagingTemplate.convertAndSend("/topic/room." + payload.getRoomId(), msg);
    }
}