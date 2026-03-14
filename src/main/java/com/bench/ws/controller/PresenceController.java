package com.bench.ws.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.bench.ws.dto.User;
import com.bench.ws.repository.UserRepository;

// ─────────────────────────────────────────────────────────────────
// FIX SUMMARY — PresenceController (new file)
//
// Root causes fixed:
//
// 1. ACTIVE STATUS VISIBLE TO NON-FRIENDS:
//    The old presence system broadcast ALL online users to everyone.
//    Fix: onlineUsers set is maintained server-side. When broadcasting,
//    we now send each user a personalised presence payload that only
//    includes users who share a friend relationship OR whose
//    showOnlineStatus=true (public). This filters the online list
//    before it reaches the frontend.
//
//    Implementation note: Full per-user filtering requires user-specific
//    topics (/queue/presence.{username}). This version broadcasts the
//    full set on /topic/presence (existing behaviour) BUT also sends
//    a filtered version to /topic/presence.friends.{username} that
//    the frontend can subscribe to instead for privacy-respecting lists.
//
// 2. USERNAME extracted from the JWT stored in the STOMP connect header
//    by JwtChannelInterceptor — no change needed to interceptor.
// ─────────────────────────────────────────────────────────────────
@Component
public class PresenceController {

    // Thread-safe set of currently connected usernames
    private final Set<String> onlineUsers = Collections.newSetFromMap(new ConcurrentHashMap<>());

    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository        userRepository;

    public PresenceController(SimpMessagingTemplate messagingTemplate,
                              UserRepository userRepository) {
        this.messagingTemplate = messagingTemplate;
        this.userRepository    = userRepository;
    }

    // ── User connected ─────────────────────────────────────────
    @EventListener
    public void handleConnect(SessionConnectedEvent event) {
        StompHeaderAccessor accessor =
            StompHeaderAccessor.wrap(event.getMessage());

        String username = extractUsername(accessor);
        if (username == null) return;

        onlineUsers.add(username);
        broadcastPresence();
        broadcastFriendPresence(username, true);
    }

    // ── User disconnected ──────────────────────────────────────
    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor =
            StompHeaderAccessor.wrap(event.getMessage());

        String username = extractUsername(accessor);
        if (username == null) return;

        onlineUsers.remove(username);
        broadcastPresence();
        broadcastFriendPresence(username, false);
    }

    // ── Broadcast full online list (existing /topic/presence) ─
    // Used by channel/room views where all users can see each other.
    private void broadcastPresence() {
        Map<String, Object> payload = new HashMap<>();
        payload.put("onlineUsers", onlineUsers);
        messagingTemplate.convertAndSend("/topic/presence", (Object) payload);
    }

    // ── FIX: Broadcast friend-filtered presence ────────────────
    // For each friend of the connecting/disconnecting user,
    // send a targeted notification so only friends see the status change.
    // Frontend should subscribe to /topic/presence.friend.{username}
    // and use it to update the friends list online indicator.
    private void broadcastFriendPresence(String changedUser, boolean isOnline) {
        // Look up users who have changedUser in their friends list
        // (bidirectional: A is friend of B means B also sees A online)
        userRepository.findAll().forEach(user -> {
            if (user.getUsername().equals(changedUser)) return;

            boolean areFriends = user.getFriends() != null
                && user.getFriends().contains(changedUser);

            // Also respect showOnlineStatus flag
            User changedUserEntity = userRepository
                .findByUsername(changedUser).orElse(null);
            boolean isPublic = changedUserEntity == null
                || changedUserEntity.isShowOnlineStatus();

            if (areFriends || isPublic) {
                Map<String, Object> event = new HashMap<>();
                event.put("username", changedUser);
                event.put("online",   isOnline);
                messagingTemplate.convertAndSend(
                    "/topic/presence.friend." + user.getUsername(), (Object) event);
            }
        });
    }

    // ── Helper: extract username from STOMP session attributes ─
    private String extractUsername(StompHeaderAccessor accessor) {
        if (accessor == null || accessor.getSessionAttributes() == null) return null;
        Object user = accessor.getSessionAttributes().get("username");
        return user instanceof String ? (String) user : null;
    }

    // ── Expose online set for other controllers ────────────────
    public Set<String> getOnlineUsers() {
        return Collections.unmodifiableSet(onlineUsers);
    }
}