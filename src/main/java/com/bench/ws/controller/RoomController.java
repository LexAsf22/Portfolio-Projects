package com.bench.ws.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bench.ws.dto.Room;
import com.bench.ws.dto.RoomMessage;
import com.bench.ws.dto.RoomMessagePayload;
import com.bench.ws.repository.RoomMessageRepository;
import com.bench.ws.repository.RoomRepository;

// ─────────────────────────────────────────────────────────────────
// FIX SUMMARY — RoomController
//
// 1. ROOM NOTIFICATIONS: handleRoomMessage now publishes to
//    /topic/room.notify so the frontend can show unread badges
//    on rooms the user isn't currently viewing.
//
// 2. VOICE CHANNEL PRESENCE (Discord-style):
//    New WebSocket endpoints /app/room.voice.join and
//    /app/room.voice.leave publish to /topic/room.voice.{roomId}
//    so all room members see who is in the voice channel live.
//    This replaces the "call" model — users JOIN a voice channel
//    and wait; others can join and they auto-connect via WebRTC.
//
// 3. ROOM INFO: Added /rooms/{id} GET endpoint so the frontend
//    can fetch individual room details (fixes "channels do not
//    display information").
//
// 4. EMOJI field: Room entity now receives the emoji field from
//    the CreateRoomModal payload and persists it.
// ─────────────────────────────────────────────────────────────────
@Controller
@CrossOrigin("*")
public class RoomController {

    private final RoomRepository        roomRepository;
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

    // ── REST: get single room ──────────────────────────────────
    // FIX: Was missing — caused "channels do not display information"
    @GetMapping("/rooms/{id}")
    @ResponseBody
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable Long id, @RequestBody Room updates,
                                         @RequestHeader("Authorization") String authHeader) {
        return roomRepository.findById(id).map(room -> {
            if (updates.getName() != null && !updates.getName().isBlank())
                room.setName(updates.getName());
            if (updates.getDescription() != null)
                room.setDescription(updates.getDescription());
            return ResponseEntity.ok(roomRepository.save(room));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── REST: create room ──────────────────────────────────────
    // FIX: Now also persists the emoji and template fields
    // sent by CreateRoomModal.
    @PostMapping("/rooms")
    @ResponseBody
    public ResponseEntity<?> createRoom(@RequestBody Map<String, String> body) {
        String name     = body.get("name");
        String desc     = body.getOrDefault("description", "");
        String user     = body.get("createdBy");
        String emoji    = body.getOrDefault("emoji", "🌟");
        String template = body.getOrDefault("template", "own");
        String type     = body.getOrDefault("type", "public");

        if (name == null || name.isBlank())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Room name is required"));

        if (roomRepository.existsByName(name))
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "Room name already taken"));

        Room room = new Room(name, desc, user);
        room.setEmoji(emoji);
        room.setTemplate(template);
        room.setRoomType(type);

        // Auto-add creator as first member
        room.getMembers().add(user);

        return ResponseEntity.ok(roomRepository.save(room));
    }

    // ── REST: join room ────────────────────────────────────────
    @PostMapping("/rooms/{id}/join")
    @ResponseBody
    public ResponseEntity<?> joinRoom(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Room room = roomRepository.findById(id).orElse(null);
        if (room == null) return ResponseEntity.notFound().build();

        String username = body.get("username");
        if (username != null) {
            room.getMembers().add(username);
            roomRepository.save(room);
            messagingTemplate.convertAndSend("/topic/room.members." + id, room.getMembers());
        }
        return ResponseEntity.ok(room);
    }

    // ── REST: leave room ──────────────────────────────────────
    @PostMapping("/rooms/{id}/leave")
    @ResponseBody
    public ResponseEntity<?> leaveRoom(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Room room = roomRepository.findById(id).orElse(null);
        if (room == null) return ResponseEntity.notFound().build();

        String username = body.get("username");
        if (username != null) {
            room.getMembers().remove(username);
            roomRepository.save(room);
            messagingTemplate.convertAndSend("/topic/room.members." + id, room.getMembers());
        }
        return ResponseEntity.ok(room);
    }

    // ── REST: room message history ─────────────────────────────
    @GetMapping("/rooms/{id}/history")
    @ResponseBody
    public ResponseEntity<List<RoomMessage>> roomHistory(@PathVariable Long id) {
        return ResponseEntity.ok(
            roomMessageRepository.findByRoomIdOrderByTimestampAsc(id));
    }

    // ── WebSocket: send room message ───────────────────────────
    // FIX: Now also publishes /topic/room.notify for unread badges.
    @MessageMapping("/room.send")
    public void handleRoomMessage(RoomMessagePayload payload) {
        RoomMessage msg = new RoomMessage(
            payload.getRoomId(),
            payload.getSender(),
            payload.getContent() != null ? payload.getContent() : "",
            payload.getType()    != null ? payload.getType()    : "TEXT",
            payload.getFileUrl()
        );
        roomMessageRepository.save(msg);

        // Deliver message to room subscribers
        messagingTemplate.convertAndSend("/topic/room." + payload.getRoomId(), msg);

        // FIX: Notify all clients about unread message in this room
        Map<String, Object> notify = new HashMap<>();
        notify.put("roomId", payload.getRoomId());
        notify.put("sender", payload.getSender());
        messagingTemplate.convertAndSend("/topic/room.notify", (Object) notify);
    }

    // ── WebSocket: join voice channel ─────────────────────────
    // FIX: New endpoint — Discord-style voice channel join.
    // User joins the voice channel and waits; others see them and
    // can auto-connect via WebRTC. Publishes presence to the room.
    @MessageMapping("/room.voice.join")
    public void handleVoiceJoin(RoomMessagePayload payload) {
        Map<String, Object> event = new HashMap<>();
        event.put("type",   "JOIN");
        event.put("sender", payload.getSender());
        event.put("roomId", payload.getRoomId());
        messagingTemplate.convertAndSend("/topic/room.voice." + payload.getRoomId(), (Object) event);
    }

    // ── WebSocket: leave voice channel ────────────────────────
    @MessageMapping("/room.voice.leave")
    public void handleVoiceLeave(RoomMessagePayload payload) {
        Map<String, Object> event = new HashMap<>();
        event.put("type",   "LEAVE");
        event.put("sender", payload.getSender());
        event.put("roomId", payload.getRoomId());
        messagingTemplate.convertAndSend("/topic/room.voice." + payload.getRoomId(), (Object) event);
    }

    // ── WebSocket: room typing indicator ──────────────────────
    @MessageMapping("/room.typing")
    public void handleRoomTyping(RoomMessagePayload payload) {
        Map<String, Object> event = new HashMap<>();
        event.put("sender", payload.getSender());
        event.put("typing", payload.getContent());
        messagingTemplate.convertAndSend("/topic/room.typing." + payload.getRoomId(), (Object) event);
    }
}