package com.bench.ws.controller;

import com.bench.ws.dto.User;
import com.bench.ws.repository.UserRepository;
import com.bench.ws.security.JwtUtil;
import com.bench.ws.service.TwoFactorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * TwoFactorController
 *
 * FEATURE: Security — Two-Factor Authentication (TOTP)
 *
 * Endpoints:
 *   POST /auth/2fa/setup    — generate a new TOTP secret + QR URI
 *   POST /auth/2fa/enable   — confirm the code and activate 2FA
 *   POST /auth/2fa/disable  — deactivate 2FA (requires current code)
 *   POST /auth/2fa/verify   — verify a TOTP code (called during login)
 *
 * Login flow with 2FA:
 *   1. User submits username + password → server issues a short-lived
 *      "pending" JWT (or returns requiresTwoFactor: true)
 *   2. Frontend prompts for the 6-digit code
 *   3. POST /auth/2fa/verify with the code → server issues full JWT
 *
 * This controller adds the setup/enable/disable endpoints.
 * The login flow 2FA check is handled in AuthController.login().
 */
@RestController
@RequestMapping("/auth/2fa")
@CrossOrigin("*")
public class TwoFactorController {

    private final UserRepository    userRepository;
    private final JwtUtil           jwtUtil;
    private final TwoFactorService  twoFactorService;

    public TwoFactorController(UserRepository userRepository,
                                JwtUtil jwtUtil,
                                TwoFactorService twoFactorService) {
        this.userRepository   = userRepository;
        this.jwtUtil          = jwtUtil;
        this.twoFactorService = twoFactorService;
    }

    // ── Step 1: Generate secret + QR code URI ─────────────────
    /**
     * POST /auth/2fa/setup
     * Returns the otpauth:// URI for QR code display.
     * Does NOT activate 2FA yet — user must confirm with /enable.
     */
    @PostMapping("/setup")
    public ResponseEntity<?> setup(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String username = extractUsername(authHeader);
            User user = getUser(username);

            // Generate a new secret (overwrites any existing pending secret)
            String secret = twoFactorService.generateSecret();
            user.setTwoFactorSecret(secret);
            // 2FA is not enabled yet — user must confirm with /enable
            userRepository.save(user);

            String otpauthUri = twoFactorService.buildOtpauthUri(
                username, secret, "CosmoChat");

            return ResponseEntity.ok(Map.of(
                "secret",     secret,
                "otpauthUri", otpauthUri,
                "message",    "Scan the QR code with your authenticator app, then call /enable with the code"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Step 2: Confirm code and activate 2FA ─────────────────
    /**
     * POST /auth/2fa/enable
     * Body: { "code": "123456" }
     * Activates 2FA only if the code is valid.
     */
    @PostMapping("/enable")
    public ResponseEntity<?> enable(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        try {
            String username = extractUsername(authHeader);
            User user = getUser(username);

            if (user.getTwoFactorSecret() == null) {
                return ResponseEntity.status(400)
                    .body(Map.of("error", "Run /setup first to generate a secret"));
            }

            String code = body.get("code");
            if (!twoFactorService.validateCode(user.getTwoFactorSecret(), code)) {
                return ResponseEntity.status(400)
                    .body(Map.of("error", "Invalid code. Make sure your authenticator app is synced."));
            }

            user.setTwoFactorEnabled(true);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                "message",          "Two-factor authentication is now enabled",
                "twoFactorEnabled", true
            ));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Disable 2FA ────────────────────────────────────────────
    /**
     * POST /auth/2fa/disable
     * Body: { "code": "123456" }
     * Requires the current valid code to prevent unauthorized disabling.
     */
    @PostMapping("/disable")
    public ResponseEntity<?> disable(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        try {
            String username = extractUsername(authHeader);
            User user = getUser(username);

            if (!user.isTwoFactorEnabled()) {
                return ResponseEntity.status(400)
                    .body(Map.of("error", "Two-factor authentication is not enabled"));
            }

            String code = body.get("code");
            if (!twoFactorService.validateCode(user.getTwoFactorSecret(), code)) {
                return ResponseEntity.status(400)
                    .body(Map.of("error", "Invalid code. Cannot disable 2FA without a valid code."));
            }

            user.setTwoFactorEnabled(false);
            user.setTwoFactorSecret(null);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                "message",          "Two-factor authentication has been disabled",
                "twoFactorEnabled", false
            ));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Verify code during login ───────────────────────────────
    /**
     * POST /auth/2fa/verify
     * Body: { "username": "alice", "code": "123456" }
     * Used when login returns { "requiresTwoFactor": true }.
     * Returns a full JWT if the code is valid.
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> body) {
        try {
            String username = body.get("username");
            String code     = body.get("code");

            User user = getUser(username);

            if (!user.isTwoFactorEnabled()) {
                return ResponseEntity.status(400)
                    .body(Map.of("error", "This account does not have 2FA enabled"));
            }

            if (!twoFactorService.validateCode(user.getTwoFactorSecret(), code)) {
                return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid authentication code"));
            }

            // Issue full JWT
            String token = jwtUtil.generateToken(username);
            return ResponseEntity.ok(Map.of(
                "token",    token,
                "username", username,
                "message",  "Two-factor authentication successful"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ── Get 2FA status ─────────────────────────────────────────
    @GetMapping("/status")
    public ResponseEntity<?> status(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String username = extractUsername(authHeader);
            User user = getUser(username);
            return ResponseEntity.ok(Map.of(
                "twoFactorEnabled", user.isTwoFactorEnabled()
            ));
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
}