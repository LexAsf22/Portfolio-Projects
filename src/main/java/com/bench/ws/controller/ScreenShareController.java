package com.bench.ws.controller;

import com.bench.ws.dto.ScreenShareSignal;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;

/**
 * ScreenShareController
 *
 * FEATURE: Screen Sharing
 *
 * Pure WebSocket signal relay — the backend does NOT process
 * any video/screen data. It only passes WebRTC negotiation
 * signals between peers (offer, answer, ICE candidates).
 *
 * WebSocket endpoints:
 *   /app/screen.share    — relay all screen share signals
 *   /app/screen.start    — announce start (broadcasts to room)
 *   /app/screen.stop     — announce stop (broadcasts to room)
 *
 * Frontend subscribes to:
 *   /topic/screen.signal.{roomId}  — all signals for a room/channel
 *   /topic/screen.presence         — who is currently sharing
 *
 * Screen sharing options supported (set by frontend via shareMode):
 *   - "SCREEN"  — full screen
 *   - "WINDOW"  — specific application window
 *   - "TAB"     — specific browser tab
 */
@Controller
public class ScreenShareController {

    private final SimpMessagingTemplate messagingTemplate;

    public ScreenShareController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // ── Relay screen share WebRTC signal ───────────────────────
    /**
     * Relays SCREEN_OFFER, SCREEN_ANSWER, SCREEN_ICE signals
     * to the specific target peer, or broadcasts to the room
     * if no target is specified.
     */
    @MessageMapping("/screen.share")
    public void handleScreenSignal(ScreenShareSignal signal) {
        String roomId = signal.getRoomId() != null ? signal.getRoomId() : "channel1";

        // Broadcast to all subscribers of this room's screen share topic
        messagingTemplate.convertAndSend(
            "/topic/screen.signal." + roomId, (Object) signal);
    }

    // ── Announce screen share started ──────────────────────────
    /**
     * Sent by the user who starts sharing.
     * Broadcasts to the room so other users see "Alice is sharing screen".
     */
    @MessageMapping("/screen.start")
    public void handleScreenStart(ScreenShareSignal signal) {
        String roomId = signal.getRoomId() != null ? signal.getRoomId() : "channel1";

        // Build presence event
        Map<String, Object> presence = new HashMap<>();
        presence.put("type",      "SCREEN_START");
        presence.put("sender",    signal.getSender());
        presence.put("roomId",    roomId);
        presence.put("shareMode", signal.getShareMode() != null ? signal.getShareMode() : "SCREEN");

        // Notify room that screen share started
        messagingTemplate.convertAndSend("/topic/screen.presence", (Object) presence);

        // Also relay as a signal so viewers can initiate WebRTC connection
        messagingTemplate.convertAndSend(
            "/topic/screen.signal." + roomId, (Object) signal);
    }

    // ── Announce screen share stopped ──────────────────────────
    /**
     * Sent when the user stops sharing (closes the stream or navigates away).
     */
    @MessageMapping("/screen.stop")
    public void handleScreenStop(ScreenShareSignal signal) {
        String roomId = signal.getRoomId() != null ? signal.getRoomId() : "channel1";

        Map<String, Object> presence = new HashMap<>();
        presence.put("type",   "SCREEN_STOP");
        presence.put("sender", signal.getSender());
        presence.put("roomId", roomId);

        messagingTemplate.convertAndSend("/topic/screen.presence", (Object) presence);
        messagingTemplate.convertAndSend(
            "/topic/screen.signal." + roomId, (Object) signal);
    }
}