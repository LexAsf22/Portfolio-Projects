package com.bench.ws.controller;

import com.bench.ws.dto.User;
import com.bench.ws.repository.UserRepository;
import com.bench.ws.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

/**
 * MoodController
 *
 * FEATURE: Mood Status System
 *
 * Allows users to set their mood status which is displayed next to
 * their name in the sidebar, friends list, and online presence list.
 *
 * Valid moods: ONLINE, FOCUSED, GAMING, STUDYING, BUSY, CHILL, OFFLINE, INVISIBLE
 *
 * INVISIBLE: user appears offline to others but can still use the app.
 *
 * When a mood changes, broadcasts a mood-update event on /topic/mood
 * so all connected clients update their UI without refreshing.
 */
@RestController
@RequestMapping("/auth/mood")
@CrossOrigin("*")
public class MoodController {

    private static final Set<String> VALID_MOODS = Set.of(
        "ONLINE", "FOCUSED", "GAMING", "STUDYING", "BUSY", "CHILL", "OFFLINE", "INVISIBLE"
    );

    private final UserRepository       userRepository;
    private final JwtUtil              jwtUtil;
    private final SimpMessagingTemplate messagingTemplate;

    public MoodController(UserRepository userRepository,
                           JwtUtil jwtUtil,
                           SimpMessagingTemplate messagingTemplate) {
        this.userRepository    = userRepository;
        this.jwtUtil           = jwtUtil;
        this.messagingTemplate = messagingTemplate;
    }

    // ── Set mood ───────────────────────────────────────────────
    /**
     * PUT /auth/mood
     * Body: { "mood": "GAMING", "emoji": "🎮" }
     * emoji is optional — custom emoji displayed next to the username.
     */
    @PutMapping
    public ResponseEntity<?> setMood(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        try {
            String username = jwtUtil.extractUsername(authHeader.substring(7));
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

            String mood  = body.get("mood");
            String emoji = body.get("emoji"); // optional

            if (mood == null || !VALID_MOODS.contains(mood.toUpperCase())) {
                return ResponseEntity.status(400).body(Map.of(
                    "error", "Invalid mood. Valid values: " + VALID_MOODS
                ));
            }

            user.setMoodStatus(mood.toUpperCase());
            if (emoji != null) {
                user.setMoodEmoji(emoji);
            }
            userRepository.save(user);

            // Broadcast to all connected clients so sidebars update live
            Map<String, Object> event = Map.of(
                "type",      "MOOD_UPDATE",
                "username",  username,
                "mood",      mood.toUpperCase(),
                "emoji",     emoji != null ? emoji : ""
            );
            messagingTemplate.convertAndSend("/topic/mood", (Object) event);

            return ResponseEntity.ok(Map.of(
                "username",   username,
                "moodStatus", user.getMoodStatus(),
                "moodEmoji",  user.getMoodEmoji() != null ? user.getMoodEmoji() : ""
            ));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Get mood ───────────────────────────────────────────────
    @GetMapping("/{username}")
    public ResponseEntity<?> getMood(@PathVariable String username) {
        return userRepository.findByUsername(username)
            .map(user -> ResponseEntity.ok(Map.of(
                "username",   user.getUsername(),
                "moodStatus", user.getMoodStatus() != null ? user.getMoodStatus() : "ONLINE",
                "moodEmoji",  user.getMoodEmoji()  != null ? user.getMoodEmoji()  : ""
            )))
            .orElse(ResponseEntity.notFound().build());
    }

    // ── Mood display helpers (static, for frontend reference) ──
    /**
     * GET /auth/mood/list
     * Returns the full list of valid moods with display labels and default emojis.
     * The frontend uses this to populate the mood picker dropdown.
     */
    @GetMapping("/list")
    public ResponseEntity<?> getMoodList() {
        return ResponseEntity.ok(java.util.List.of(
            Map.of("value", "ONLINE",    "label", "Online",    "emoji", "🟢", "color", "#10b981"),
            Map.of("value", "FOCUSED",   "label", "Focused",   "emoji", "🎯", "color", "#3b82f6"),
            Map.of("value", "GAMING",    "label", "Gaming",    "emoji", "🎮", "color", "#8b5cf6"),
            Map.of("value", "STUDYING",  "label", "Studying",  "emoji", "📚", "color", "#f59e0b"),
            Map.of("value", "BUSY",      "label", "Busy",      "emoji", "🔴", "color", "#ef4444"),
            Map.of("value", "CHILL",     "label", "Chill",     "emoji", "😎", "color", "#06b6d4"),
            Map.of("value", "OFFLINE",   "label", "Offline",   "emoji", "⚫", "color", "#6b7280"),
            Map.of("value", "INVISIBLE", "label", "Invisible", "emoji", "👻", "color", "#9ca3af")
        ));
    }
}