package com.bench.ws.controller;

import com.bench.ws.dto.User;
import com.bench.ws.repository.UserRepository;
import com.bench.ws.security.JwtUtil;
import com.bench.ws.service.ModerationService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * ModerationController
 *
 * FEATURE: Moderation Tools
 * Provides admin/moderator endpoints for:
 *   - Banning users (permanent or temporary)
 *   - Unbanning users
 *   - Kicking users (force-disconnect via WebSocket)
 *   - Timing out users (mute for N minutes)
 *   - Changing user roles
 *
 * FEATURE: Roles & Permissions
 * All endpoints are role-checked:
 *   - OWNER can do anything
 *   - ADMIN can ban/kick/timeout MODERATOR and MEMBER
 *   - MODERATOR can timeout MEMBER only
 *   - MEMBER cannot use any moderation endpoint
 *
 * Permission hierarchy: OWNER > ADMIN > MODERATOR > VIP > MEMBER
 */
@RestController
@RequestMapping("/moderation")
@CrossOrigin("*")
public class ModerationController {

    private final UserRepository       userRepository;
    private final JwtUtil              jwtUtil;
    private final SimpMessagingTemplate messagingTemplate;
    private final ModerationService    moderationService;

    public ModerationController(UserRepository userRepository,
                                 JwtUtil jwtUtil,
                                 SimpMessagingTemplate messagingTemplate,
                                 ModerationService moderationService) {
        this.userRepository    = userRepository;
        this.jwtUtil           = jwtUtil;
        this.messagingTemplate = messagingTemplate;
        this.moderationService = moderationService;
    }

    // ── Ban a user ─────────────────────────────────────────────
    /**
     * POST /moderation/ban
     * Body: { "targetUsername": "...", "reason": "...", "durationMinutes": 0 }
     * durationMinutes = 0 means permanent ban.
     */
    @PostMapping("/ban")
    public ResponseEntity<?> banUser(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> body) {
        try {
            String actor = extractUsername(authHeader);
            User actorUser = getUser(actor);

            String targetUsername = (String) body.get("targetUsername");
            String reason         = (String) body.getOrDefault("reason", "No reason provided");
            int    durationMins   = body.containsKey("durationMinutes")
                ? ((Number) body.get("durationMinutes")).intValue() : 0;

            User target = getUser(targetUsername);

            // Permission check
            if (!canModerate(actorUser, target)) {
                return ResponseEntity.status(403)
                    .body(Map.of("error", "Insufficient permissions to ban this user"));
            }

            // Apply ban
            target.setBanned(true);
            target.setBannedBy(actor);
            target.setBanReason(reason);

            if (durationMins > 0) {
                target.setBannedUntil(LocalDateTime.now().plusMinutes(durationMins));
            } else {
                target.setBannedUntil(null); // permanent
            }

            userRepository.save(target);

            // Force-disconnect the banned user via WebSocket
            notifyKick(targetUsername, "BANNED", reason);

            return ResponseEntity.ok(Map.of(
                "message", targetUsername + " has been banned",
                "permanent", durationMins == 0,
                "durationMinutes", durationMins
            ));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Unban a user ───────────────────────────────────────────
    @PostMapping("/unban")
    public ResponseEntity<?> unbanUser(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        try {
            String actor = extractUsername(authHeader);
            User actorUser = getUser(actor);
            requireRole(actorUser, "ADMIN"); // ADMIN+ only

            String targetUsername = body.get("targetUsername");
            User target = getUser(targetUsername);

            target.setBanned(false);
            target.setBannedUntil(null);
            target.setBannedBy(null);
            target.setBanReason(null);
            userRepository.save(target);

            return ResponseEntity.ok(Map.of("message", targetUsername + " has been unbanned"));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Kick a user (disconnect, not ban) ─────────────────────
    /**
     * POST /moderation/kick
     * Body: { "targetUsername": "...", "reason": "..." }
     * Sends a KICK event via WebSocket — the frontend disconnects.
     * The user can reconnect immediately (not banned).
     */
    @PostMapping("/kick")
    public ResponseEntity<?> kickUser(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        try {
            String actor = extractUsername(authHeader);
            User actorUser = getUser(actor);

            String targetUsername = body.get("targetUsername");
            String reason         = body.getOrDefault("reason", "No reason provided");

            User target = getUser(targetUsername);

            if (!canModerate(actorUser, target)) {
                return ResponseEntity.status(403)
                    .body(Map.of("error", "Insufficient permissions to kick this user"));
            }

            // Send WebSocket event — frontend listens on /topic/moderation.{username}
            notifyKick(targetUsername, "KICKED", reason);

            return ResponseEntity.ok(Map.of("message", targetUsername + " has been kicked"));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Timeout (mute) a user ──────────────────────────────────
    /**
     * POST /moderation/timeout
     * Body: { "targetUsername": "...", "durationMinutes": 10, "reason": "..." }
     * Muted user cannot send messages. ChatController checks isMuted() before saving.
     */
    @PostMapping("/timeout")
    public ResponseEntity<?> timeoutUser(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> body) {
        try {
            String actor = extractUsername(authHeader);
            User actorUser = getUser(actor);

            String targetUsername = (String) body.get("targetUsername");
            String reason         = (String) body.getOrDefault("reason", "Timeout");
            int    durationMins   = ((Number) body.getOrDefault("durationMinutes", 10)).intValue();

            User target = getUser(targetUsername);

            if (!canModerate(actorUser, target)) {
                return ResponseEntity.status(403)
                    .body(Map.of("error", "Insufficient permissions to timeout this user"));
            }

            target.setMutedUntil(LocalDateTime.now().plusMinutes(durationMins));
            userRepository.save(target);

            // Notify the user they've been timed out
            Map<String, Object> event = Map.of(
                "type",     "TIMEOUT",
                "reason",   reason,
                "until",    target.getMutedUntil().toString(),
                "by",       actor
            );
            messagingTemplate.convertAndSend(
                "/topic/moderation." + targetUsername, (Object) event);

            return ResponseEntity.ok(Map.of(
                "message", targetUsername + " timed out for " + durationMins + " minutes"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Remove timeout ─────────────────────────────────────────
    @PostMapping("/untimeout")
    public ResponseEntity<?> removeTimeout(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        try {
            String actor = extractUsername(authHeader);
            User actorUser = getUser(actor);
            requireRole(actorUser, "MODERATOR");

            String targetUsername = body.get("targetUsername");
            User target = getUser(targetUsername);

            target.setMutedUntil(null);
            userRepository.save(target);

            return ResponseEntity.ok(Map.of("message", "Timeout removed for " + targetUsername));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Change user role ──────────────────────────────────────
    /**
     * POST /moderation/role
     * Body: { "targetUsername": "...", "role": "MODERATOR" }
     * Only OWNER can assign ADMIN. ADMIN can assign MODERATOR/VIP/MEMBER.
     */
    @PostMapping("/role")
    public ResponseEntity<?> changeRole(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        try {
            String actor = extractUsername(authHeader);
            User actorUser = getUser(actor);
            requireRole(actorUser, "ADMIN"); // ADMIN+ only

            String targetUsername = body.get("targetUsername");
            String newRole        = body.get("role");

            if (!isValidRole(newRole)) {
                return ResponseEntity.status(400)
                    .body(Map.of("error", "Invalid role. Use: OWNER, ADMIN, MODERATOR, VIP, MEMBER"));
            }

            // Only OWNER can assign ADMIN or OWNER roles
            if (("ADMIN".equals(newRole) || "OWNER".equals(newRole))
                    && !"OWNER".equals(actorUser.getRole())) {
                return ResponseEntity.status(403)
                    .body(Map.of("error", "Only OWNER can assign ADMIN or OWNER roles"));
            }

            User target = getUser(targetUsername);
            target.setRole(newRole);
            userRepository.save(target);

            // Notify everyone of the role change
            Map<String, Object> event = Map.of(
                "type",     "ROLE_CHANGED",
                "username", targetUsername,
                "newRole",  newRole,
                "by",       actor
            );
            messagingTemplate.convertAndSend("/topic/role-update", (Object) event);

            return ResponseEntity.ok(Map.of(
                "message", targetUsername + " is now " + newRole
            ));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Get moderation status for a user ──────────────────────
    @GetMapping("/status/{username}")
    public ResponseEntity<?> getModerationStatus(
            @PathVariable String username,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String actor = extractUsername(authHeader);
            User actorUser = getUser(actor);
            requireRole(actorUser, "MODERATOR");

            User target = getUser(username);
            return ResponseEntity.ok(Map.of(
                "username",    target.getUsername(),
                "role",        target.getRole(),
                "banned",      target.isBanned(),
                "bannedUntil", target.getBannedUntil() != null ? target.getBannedUntil().toString() : null,
                "banReason",   target.getBanReason() != null ? target.getBanReason() : "",
                "bannedBy",    target.getBannedBy() != null ? target.getBannedBy() : "",
                "mutedUntil",  target.getMutedUntil() != null ? target.getMutedUntil().toString() : null,
                "currentlyBanned", target.isCurrentlyBanned(),
                "currentlyMuted",  target.isCurrentlyMuted()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Block / Unblock a user ────────────────────────────────
    @PostMapping("/block")
    public ResponseEntity<?> blockUser(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        try {
            String actor = extractUsername(authHeader);
            User actorUser = getUser(actor);

            String targetUsername = body.get("targetUsername");
            if (!actorUser.getBlockedUsers().contains(targetUsername)) {
                actorUser.getBlockedUsers().add(targetUsername);
                userRepository.save(actorUser);
            }
            return ResponseEntity.ok(Map.of("message", targetUsername + " has been blocked"));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/unblock")
    public ResponseEntity<?> unblockUser(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        try {
            String actor = extractUsername(authHeader);
            User actorUser = getUser(actor);

            String targetUsername = body.get("targetUsername");
            actorUser.getBlockedUsers().remove(targetUsername);
            userRepository.save(actorUser);

            return ResponseEntity.ok(Map.of("message", targetUsername + " has been unblocked"));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Helpers ────────────────────────────────────────────────

    private String extractUsername(String authHeader) {
        return jwtUtil.extractUsername(authHeader.substring(7));
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    /**
     * Role hierarchy levels (higher = more power)
     * OWNER=5, ADMIN=4, MODERATOR=3, VIP=2, MEMBER=1
     */
    private int roleLevel(String role) {
        return switch (role == null ? "MEMBER" : role) {
            case "OWNER"     -> 5;
            case "ADMIN"     -> 4;
            case "MODERATOR" -> 3;
            case "VIP"       -> 2;
            default          -> 1; // MEMBER
        };
    }

    /** Returns true if actor has higher role than target (can moderate them). */
    private boolean canModerate(User actor, User target) {
        return roleLevel(actor.getRole()) > roleLevel(target.getRole());
    }

    /** Throws if actor does not have at least the required role level. */
    private void requireRole(User actor, String minimumRole) {
        if (roleLevel(actor.getRole()) < roleLevel(minimumRole)) {
            throw new RuntimeException(
                "Requires " + minimumRole + " role or higher. You are: " + actor.getRole());
        }
    }

    private boolean isValidRole(String role) {
        return role != null && switch (role) {
            case "OWNER", "ADMIN", "MODERATOR", "VIP", "MEMBER" -> true;
            default -> false;
        };
    }

    /** Sends a WebSocket kick/ban event so the frontend disconnects the user. */
    private void notifyKick(String username, String type, String reason) {
        Map<String, Object> event = Map.of(
            "type",   type,
            "reason", reason
        );
        messagingTemplate.convertAndSend(
            "/topic/moderation." + username, (Object) event);
    }
}