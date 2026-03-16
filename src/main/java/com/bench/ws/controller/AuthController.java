package com.bench.ws.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.bench.ws.dto.LoginRequest;
import com.bench.ws.dto.Message;
import com.bench.ws.dto.RegisterRequest;
import com.bench.ws.dto.User;
import com.bench.ws.repository.DirectMessageRepository;
import com.bench.ws.repository.MessageRepository;
import com.bench.ws.repository.UserRepository;
import com.bench.ws.security.JwtUtil;
import com.bench.ws.service.EmailService;

/**
 * AuthController — updated for new features:
 *
 * FEATURE: Security — 2FA during login
 *   - login() now checks if 2FA is enabled
 *   - If enabled, returns { requiresTwoFactor: true } instead of a JWT
 *   - Frontend then prompts for the 6-digit code → POST /auth/2fa/verify
 *
 * FEATURE: Moderation — ban check on login
 *   - Banned users receive a clear error message and cannot log in
 *   - Temporary bans show the expiry time
 *
 * FEATURE: Mood Status — reset to ONLINE on login
 *   - When user logs in, mood is set back to ONLINE (from OFFLINE/INVISIBLE)
 *
 * FIX: update-email endpoint now correctly reads "newEmail" from body
 *   (was reading "email" which caused null on some client versions)
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthenticationManager    authenticationManager;
    private final JwtUtil                  jwtUtil;
    private final UserRepository           userRepository;
    private final PasswordEncoder          passwordEncoder;
    private final MessageRepository        messageRepository;
    private final DirectMessageRepository  dmRepository;
    private final EmailService             emailService;

    // In-memory verification code store (use Redis in production)
    private final ConcurrentHashMap<String, String>  verificationCodes = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Instant> codeExpiry        = new ConcurrentHashMap<>();

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          MessageRepository messageRepository,
                          DirectMessageRepository dmRepository,
                          EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil               = jwtUtil;
        this.userRepository        = userRepository;
        this.passwordEncoder       = passwordEncoder;
        this.messageRepository     = messageRepository;
        this.dmRepository          = dmRepository;
        this.emailService          = emailService;
    }

    // ── Login ──────────────────────────────────────────────────
    /**
     * FEATURE: Moderation — banned users are rejected at login
     * FEATURE: Security  — 2FA users get a challenge instead of a JWT
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername(), request.getPassword()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid credentials"));
        }

        // FEATURE: Moderation — check ban status before issuing token
        User user = userRepository.findByUsername(request.getUsername()).orElse(null);
        if (user != null && user.isCurrentlyBanned()) {
            String banMsg = user.getBannedUntil() != null
                ? "You are temporarily banned until " + user.getBannedUntil()
                : "You are permanently banned from this server.";
            String reason = user.getBanReason() != null
                ? " Reason: " + user.getBanReason()
                : "";
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", banMsg + reason));
        }

        // FEATURE: Security — if 2FA is enabled, return a challenge
        if (user != null && user.isTwoFactorEnabled()) {
            return ResponseEntity.ok(Map.of(
                "requiresTwoFactor", true,
                "username",          request.getUsername(),
                "message",           "Enter your 6-digit authenticator code at /auth/2fa/verify"
            ));
        }

        // FEATURE: Mood — reset to ONLINE on login
        if (user != null && "OFFLINE".equals(user.getMoodStatus())) {
            user.setMoodStatus("ONLINE");
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(request.getUsername());
        return ResponseEntity.ok(Map.of(
            "token",    token,
            "username", request.getUsername()));
    }

    // ── Register ───────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername()))
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "Username already taken"));

        User user = new User(request.getUsername(),
                             passwordEncoder.encode(request.getPassword()));
        if (request.getEmail() != null && !request.getEmail().isBlank())
            user.setEmail(request.getEmail());

        // New users start as MEMBER
        user.setRole("MEMBER");
        user.setMoodStatus("ONLINE");

        userRepository.save(user);
        String token = jwtUtil.generateToken(request.getUsername());
        return ResponseEntity.ok(Map.of(
            "token",    token,
            "username", request.getUsername()));
    }

    // ── Message history ────────────────────────────────────────
    @GetMapping("/history")
    public ResponseEntity<List<Message>> history() {
        return ResponseEntity.ok(
            messageRepository.findAllByOrderByTimestampAsc());
    }

    // ── Search messages ────────────────────────────────────────
    @GetMapping("/search")
    public ResponseEntity<List<Message>> searchMessages(@RequestParam String q) {
        return ResponseEntity.ok(
            messageRepository.findByContentContainingIgnoreCaseOrderByTimestampAsc(q));
    }

    // ── Get all usernames ──────────────────────────────────────
    @GetMapping("/users")
    public ResponseEntity<List<String>> getAllUsers() {
        return ResponseEntity.ok(
            userRepository.findAll().stream()
                .map(User::getUsername)
                .collect(Collectors.toList()));
    }

    // ── Get profile by username ────────────────────────────────
    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getProfile(@PathVariable String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        user.setPassword(null);
        user.setTwoFactorSecret(null); // never expose the 2FA secret
        return ResponseEntity.ok(user);
    }

    // ── Update display name + bio ──────────────────────────────
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody Map<String, String> update,
            @RequestHeader("Authorization") String token) {
        try {
            String username = jwtUtil.extractUsername(token.substring(7));
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

            if (update.containsKey("displayName"))
                user.setDisplayName(update.get("displayName"));
            if (update.containsKey("bio"))
                user.setBio(update.get("bio"));

            userRepository.save(user);
            user.setPassword(null);
            user.setTwoFactorSecret(null);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Change username ────────────────────────────────────────
    @PutMapping("/change-username")
    public ResponseEntity<?> changeUsername(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        try {
            String currentUsername = jwtUtil.extractUsername(authHeader.substring(7));
            String newUsername     = body.get("newUsername");

            if (newUsername == null || newUsername.isBlank())
                return ResponseEntity.status(400)
                    .body(Map.of("error", "New username cannot be empty"));

            if (newUsername.length() < 3 || newUsername.length() > 32)
                return ResponseEntity.status(400)
                    .body(Map.of("error", "Username must be between 3 and 32 characters"));

            if (!newUsername.matches("^[a-zA-Z0-9_.]+$"))
                return ResponseEntity.status(400)
                    .body(Map.of("error", "Username can only contain letters, numbers, underscores, and dots"));

            if (userRepository.existsByUsername(newUsername))
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Username already taken"));

            User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

            user.setUsername(newUsername);
            userRepository.save(user);

            String newToken = jwtUtil.generateToken(newUsername);
            return ResponseEntity.ok(Map.of(
                "message",  "Username changed successfully",
                "token",    newToken,
                "username", newUsername));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Upload avatar ──────────────────────────────────────────
    @PostMapping("/profile/avatar")
    public ResponseEntity<?> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String token) throws IOException {
        String username = jwtUtil.extractUsername(token.substring(7));
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        Files.createDirectories(Paths.get("uploads/"));
        String filename = "avatar_" + username + "_" + UUID.randomUUID()
                          + getExtension(file.getOriginalFilename());
        Files.write(Paths.get("uploads/" + filename), file.getBytes());

        user.setAvatarUrl("/uploads/" + filename);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("avatarUrl", user.getAvatarUrl()));
    }

    // ── Send email verification code ───────────────────────────
    @PostMapping("/send-code")
    public ResponseEntity<?> sendVerificationCode(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String username = jwtUtil.extractUsername(authHeader.substring(7));
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getEmail() == null || user.getEmail().isBlank())
                return ResponseEntity.status(400)
                    .body(Map.of("error", "No email address on file. Please add one first."));

            String code = String.valueOf((int)(Math.random() * 900000) + 100000);
            verificationCodes.put(username, code);
            codeExpiry.put(username, Instant.now().plusSeconds(600));

            emailService.sendVerificationCode(user.getEmail(), code);
            return ResponseEntity.ok(Map.of("message", "Code sent to " + maskEmail(user.getEmail())));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Change password ────────────────────────────────────────
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        try {
            String username    = jwtUtil.extractUsername(authHeader.substring(7));
            String code        = body.get("code");
            String newPassword = body.get("newPassword");

            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

            String  savedCode = verificationCodes.get(username);
            Instant expiry    = codeExpiry.get(username);

            if (savedCode == null || expiry == null)
                return ResponseEntity.status(400)
                    .body(Map.of("error", "No verification code found. Request one first."));

            if (Instant.now().isAfter(expiry))
                return ResponseEntity.status(400)
                    .body(Map.of("error", "Verification code expired."));

            if (!savedCode.equals(code))
                return ResponseEntity.status(400)
                    .body(Map.of("error", "Incorrect verification code."));

            if (newPassword == null || newPassword.length() < 6)
                return ResponseEntity.status(400)
                    .body(Map.of("error", "Password must be at least 6 characters."));

            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            verificationCodes.remove(username);
            codeExpiry.remove(username);

            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Update email ───────────────────────────────────────────
    // FIX: reads both "newEmail" and "email" keys for compatibility
    @PutMapping("/update-email")
    public ResponseEntity<?> updateEmail(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        try {
            String username = jwtUtil.extractUsername(authHeader.substring(7));
            // Accept both "newEmail" (new) and "email" (legacy) keys
            String newEmail = body.containsKey("newEmail") ? body.get("newEmail") : body.get("email");

            if (newEmail == null || newEmail.isBlank())
                return ResponseEntity.status(400)
                    .body(Map.of("error", "Email cannot be empty"));

            if (!newEmail.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$"))
                return ResponseEntity.status(400)
                    .body(Map.of("error", "Invalid email format"));

            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

            user.setEmail(newEmail);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Email updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Delete account ─────────────────────────────────────────
    @Transactional
    @DeleteMapping("/delete-account")
    public ResponseEntity<?> deleteAccount(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String username = jwtUtil.extractUsername(authHeader.substring(7));
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

            messageRepository.deleteBySender(username);
            dmRepository.deleteBySenderOrRecipient(username, username);
            userRepository.delete(user);

            verificationCodes.remove(username);
            codeExpiry.remove(username);

            return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Edit history for a message ─────────────────────────────
    @GetMapping("/messages/{messageId}/history")
    public ResponseEntity<?> getEditHistory(@PathVariable Long messageId) {
        // Delegate to the repository through the message endpoint
        return ResponseEntity.ok(Map.of(
            "messageId", messageId,
            "note",      "Use GET /messages/{id}/history endpoint"
        ));
    }

    // ── Helpers ────────────────────────────────────────────────
    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf("."));
    }

    private String maskEmail(String email) {
        int atIdx = email.indexOf('@');
        if (atIdx <= 2) return email;
        return email.substring(0, 2) + "**" + email.substring(atIdx);
    }
}