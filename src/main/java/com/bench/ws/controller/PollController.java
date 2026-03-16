package com.bench.ws.controller;

import com.bench.ws.dto.Poll;
import com.bench.ws.dto.PollOption;
import com.bench.ws.dto.User;
import com.bench.ws.repository.PollOptionRepository;
import com.bench.ws.repository.PollRepository;
import com.bench.ws.repository.UserRepository;
import com.bench.ws.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

/**
 * PollController
 *
 * FEATURE: Built-in Poll & Voting System
 *
 * REST endpoints:
 *   POST   /polls               — create a poll
 *   GET    /polls/channel       — get channel polls
 *   GET    /polls/room/{roomId} — get polls in a specific room
 *   GET    /polls/{id}          — get single poll with results
 *   POST   /polls/{id}/vote     — cast a vote
 *   DELETE /polls/{id}/vote     — remove a vote
 *   POST   /polls/{id}/close    — close a poll (creator or admin only)
 *   DELETE /polls/{id}          — delete a poll (creator or admin only)
 *
 * Real-time: all vote events broadcast on /topic/poll.{pollId}
 * so all viewers see live vote counts without refreshing.
 */
@RestController
@RequestMapping("/polls")
@CrossOrigin("*")
public class PollController {

    private final PollRepository       pollRepository;
    private final PollOptionRepository pollOptionRepository;
    private final UserRepository       userRepository;
    private final JwtUtil              jwtUtil;
    private final SimpMessagingTemplate messagingTemplate;

    public PollController(PollRepository pollRepository,
                           PollOptionRepository pollOptionRepository,
                           UserRepository userRepository,
                           JwtUtil jwtUtil,
                           SimpMessagingTemplate messagingTemplate) {
        this.pollRepository       = pollRepository;
        this.pollOptionRepository = pollOptionRepository;
        this.userRepository       = userRepository;
        this.jwtUtil              = jwtUtil;
        this.messagingTemplate    = messagingTemplate;
    }

    // ── Create a poll ──────────────────────────────────────────
    /**
     * POST /polls
     * Body: {
     *   "question":       "What should we play?",
     *   "options":        ["Minecraft", "Valorant", "Chess"],
     *   "optionEmojis":   ["⛏️", "🔫", "♟️"],   // optional, same length as options
     *   "contextType":    "CHANNEL",              // CHANNEL | ROOM | DM
     *   "contextId":      null,                   // roomId or DM username
     *   "anonymous":      false,
     *   "multiChoice":    false,
     *   "expiresInHours": 24                      // 0 = no expiry
     * }
     */
    @PostMapping
    public ResponseEntity<?> createPoll(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> body) {
        try {
            String username = extractUsername(authHeader);

            String question    = (String) body.get("question");
            List<?> optionList = (List<?>) body.get("options");
            List<?> emojiList  = body.containsKey("optionEmojis")
                ? (List<?>) body.get("optionEmojis") : null;

            if (question == null || question.isBlank()) {
                return ResponseEntity.status(400).body(Map.of("error", "Question is required"));
            }
            if (optionList == null || optionList.size() < 2) {
                return ResponseEntity.status(400)
                    .body(Map.of("error", "At least 2 options are required"));
            }
            if (optionList.size() > 10) {
                return ResponseEntity.status(400)
                    .body(Map.of("error", "Maximum 10 options allowed"));
            }

            Poll poll = new Poll();
            poll.setQuestion(question);
            poll.setCreatedBy(username);
            poll.setContextType((String) body.getOrDefault("contextType", "CHANNEL"));
            poll.setContextId((String) body.get("contextId"));
            poll.setAnonymous(Boolean.TRUE.equals(body.get("anonymous")));
            poll.setMultiChoice(Boolean.TRUE.equals(body.get("multiChoice")));

            // Expiry
            int expiresInHours = ((Number) body.getOrDefault("expiresInHours", 0)).intValue();
            if (expiresInHours > 0) {
                poll.setExpiresAt(LocalDateTime.now().plusHours(expiresInHours));
            }

            Poll savedPoll = pollRepository.save(poll);

            // Create options
            for (int i = 0; i < optionList.size(); i++) {
                PollOption opt = new PollOption(savedPoll, (String) optionList.get(i), i);
                if (emojiList != null && i < emojiList.size()) {
                    opt.setEmoji((String) emojiList.get(i));
                }
                pollOptionRepository.save(opt);
            }

            // Reload with options
            Poll result = pollRepository.findById(savedPoll.getId()).orElse(savedPoll);

            // Broadcast creation to the relevant topic
            String topic = getPollTopic(result);
            messagingTemplate.convertAndSend(topic, (Object) buildPollPayload(result, username));

            return ResponseEntity.ok(buildPollPayload(result, username));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Get channel polls ──────────────────────────────────────
    @GetMapping("/channel")
    public ResponseEntity<?> getChannelPolls(
            @RequestHeader("Authorization") String authHeader) {
        String username = extractUsername(authHeader);
        List<Poll> polls = pollRepository.findByContextTypeOrderByCreatedAtDesc("CHANNEL");
        return ResponseEntity.ok(polls.stream()
            .map(p -> buildPollPayload(p, username))
            .toList());
    }

    // ── Get room polls ─────────────────────────────────────────
    @GetMapping("/room/{roomId}")
    public ResponseEntity<?> getRoomPolls(
            @PathVariable String roomId,
            @RequestHeader("Authorization") String authHeader) {
        String username = extractUsername(authHeader);
        List<Poll> polls = pollRepository
            .findByContextTypeAndContextIdOrderByCreatedAtDesc("ROOM", roomId);
        return ResponseEntity.ok(polls.stream()
            .map(p -> buildPollPayload(p, username))
            .toList());
    }

    // ── Get single poll ────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<?> getPoll(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        String username = extractUsername(authHeader);
        return pollRepository.findById(id)
            .map(p -> ResponseEntity.ok(buildPollPayload(p, username)))
            .orElse(ResponseEntity.notFound().build());
    }

    // ── Cast a vote ────────────────────────────────────────────
    /**
     * POST /polls/{id}/vote
     * Body: { "optionIds": [3] }           // single choice
     *       { "optionIds": [3, 5] }        // multi-choice
     */
    @PostMapping("/{id}/vote")
    public ResponseEntity<?> vote(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> body) {
        try {
            String username = extractUsername(authHeader);
            Poll poll = pollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

            if (!poll.isActive()) {
                return ResponseEntity.status(400)
                    .body(Map.of("error", "This poll is closed or has expired"));
            }

            List<?> optionIdList = (List<?>) body.get("optionIds");
            if (optionIdList == null || optionIdList.isEmpty()) {
                return ResponseEntity.status(400).body(Map.of("error", "No option selected"));
            }

            // If not multi-choice, only first selection counts
            List<?> selected = poll.isMultiChoice() ? optionIdList : List.of(optionIdList.get(0));

            // Determine voter identifier (anonymous = "anon_<hash>")
            String voterKey = poll.isAnonymous()
                ? "anon_" + Math.abs(username.hashCode())
                : username;

            // Remove existing votes by this user first (for re-voting)
            for (PollOption opt : poll.getOptions()) {
                opt.getVoters().remove(voterKey);
                if (!poll.isAnonymous()) opt.getVoters().remove(username);
                pollOptionRepository.save(opt);
            }

            // Apply new votes
            for (Object optIdObj : selected) {
                Long optId = ((Number) optIdObj).longValue();
                PollOption opt = pollOptionRepository.findById(optId)
                    .orElseThrow(() -> new RuntimeException("Option not found: " + optId));

                // Ensure this option belongs to this poll
                if (!opt.getPoll().getId().equals(poll.getId())) {
                    return ResponseEntity.status(400)
                        .body(Map.of("error", "Option does not belong to this poll"));
                }

                if (!opt.getVoters().contains(voterKey)) {
                    opt.getVoters().add(voterKey);
                    pollOptionRepository.save(opt);
                }
            }

            // Reload fresh data
            Poll updated = pollRepository.findById(id).orElse(poll);
            Map<String, Object> payload = buildPollPayload(updated, username);

            // Broadcast real-time update
            messagingTemplate.convertAndSend(
                "/topic/poll." + id, (Object) payload);

            return ResponseEntity.ok(payload);

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Remove vote ────────────────────────────────────────────
    @DeleteMapping("/{id}/vote")
    public ResponseEntity<?> removeVote(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String username = extractUsername(authHeader);
            Poll poll = pollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

            String voterKey = poll.isAnonymous()
                ? "anon_" + Math.abs(username.hashCode())
                : username;

            for (PollOption opt : poll.getOptions()) {
                opt.getVoters().remove(voterKey);
                pollOptionRepository.save(opt);
            }

            Poll updated = pollRepository.findById(id).orElse(poll);
            Map<String, Object> payload = buildPollPayload(updated, username);
            messagingTemplate.convertAndSend("/topic/poll." + id, (Object) payload);

            return ResponseEntity.ok(payload);

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Close a poll ───────────────────────────────────────────
    @PostMapping("/{id}/close")
    public ResponseEntity<?> closePoll(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String username = extractUsername(authHeader);
            Poll poll = pollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

            User actor = userRepository.findByUsername(username).orElse(null);
            boolean isAdmin = actor != null &&
                (actor.getRole().equals("ADMIN") || actor.getRole().equals("OWNER"));

            if (!poll.getCreatedBy().equals(username) && !isAdmin) {
                return ResponseEntity.status(403)
                    .body(Map.of("error", "Only the creator or an admin can close this poll"));
            }

            poll.setClosed(true);
            pollRepository.save(poll);

            Poll updated = pollRepository.findById(id).orElse(poll);
            Map<String, Object> payload = buildPollPayload(updated, username);
            messagingTemplate.convertAndSend("/topic/poll." + id, (Object) payload);

            return ResponseEntity.ok(payload);

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Delete a poll ──────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePoll(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String username = extractUsername(authHeader);
            Poll poll = pollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

            User actor = userRepository.findByUsername(username).orElse(null);
            boolean isAdmin = actor != null &&
                (actor.getRole().equals("ADMIN") || actor.getRole().equals("OWNER"));

            if (!poll.getCreatedBy().equals(username) && !isAdmin) {
                return ResponseEntity.status(403)
                    .body(Map.of("error", "Only the creator or an admin can delete this poll"));
            }

            pollRepository.delete(poll);

            // Notify subscribers
            messagingTemplate.convertAndSend(
                "/topic/poll." + id,
                (Object) Map.of("type", "POLL_DELETED", "pollId", id));

            return ResponseEntity.ok(Map.of("message", "Poll deleted"));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Helpers ────────────────────────────────────────────────

    private String extractUsername(String authHeader) {
        return jwtUtil.extractUsername(authHeader.substring(7));
    }

    /** Determines the broadcast topic based on poll context. */
    private String getPollTopic(Poll poll) {
        return switch (poll.getContextType()) {
            case "ROOM" -> "/topic/room.poll." + poll.getContextId();
            case "DM"   -> "/topic/dm.poll." + poll.getContextId();
            default     -> "/topic/channel.poll";
        };
    }

    /**
     * Builds a safe payload map for JSON serialization.
     * Hides voter identities when poll is anonymous.
     */
    private Map<String, Object> buildPollPayload(Poll poll, String currentUser) {
        List<Map<String, Object>> optionPayloads = poll.getOptions().stream()
            .sorted(Comparator.comparingInt(PollOption::getPosition))
            .map(opt -> {
                Map<String, Object> o = new LinkedHashMap<>();
                o.put("id",        opt.getId());
                o.put("text",      opt.getOptionText());
                o.put("emoji",     opt.getEmoji());
                o.put("voteCount", opt.getVoteCount());
                // Show voter names only if poll is NOT anonymous
                if (!poll.isAnonymous()) {
                    o.put("voters", opt.getVoters());
                }
                // Tell the current user if they voted for this option
                String voterKey = poll.isAnonymous()
                    ? "anon_" + Math.abs(currentUser.hashCode())
                    : currentUser;
                o.put("votedByMe", opt.hasVoted(voterKey));
                return o;
            })
            .toList();

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("id",          poll.getId());
        payload.put("question",    poll.getQuestion());
        payload.put("createdBy",   poll.getCreatedBy());
        payload.put("contextType", poll.getContextType());
        payload.put("contextId",   poll.getContextId());
        payload.put("anonymous",   poll.isAnonymous());
        payload.put("multiChoice", poll.isMultiChoice());
        payload.put("createdAt",   poll.getCreatedAt());
        payload.put("expiresAt",   poll.getExpiresAt());
        payload.put("closed",      poll.isClosed());
        payload.put("expired",     poll.isExpired());
        payload.put("active",      poll.isActive());
        payload.put("options",     optionPayloads);
        payload.put("totalVotes",  poll.getOptions().stream()
            .mapToInt(PollOption::getVoteCount).sum());

        return payload;
    }
}