package com.bench.ws.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.bench.ws.dto.LoginRequest;
import com.bench.ws.dto.Message;
import com.bench.ws.dto.RegisterRequest;
import com.bench.ws.dto.User;
import com.bench.ws.repository.MessageRepository;
import com.bench.ws.repository.UserRepository;
import com.bench.ws.security.JwtUtil;
import com.bench.ws.service.EmailService;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil               jwtUtil;
    private final UserRepository        userRepository;
    private final PasswordEncoder       passwordEncoder;
    private final MessageRepository     messageRepository;
    private final EmailService          emailService;
    private final ConcurrentHashMap<String, String>  verificationCodes = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Instant> codeExpiry        = new ConcurrentHashMap<>();

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          MessageRepository messageRepository,
                          EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil               = jwtUtil;
        this.userRepository        = userRepository;
        this.passwordEncoder       = passwordEncoder;
        this.messageRepository     = messageRepository;
        this.emailService          = emailService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
        String token = jwtUtil.generateToken(request.getUsername());
        return ResponseEntity.ok(Map.of("token", token, "username", request.getUsername()));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername()))
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Username already taken"));
        User user = new User(request.getUsername(), passwordEncoder.encode(request.getPassword()));
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        userRepository.save(user);
        String token = jwtUtil.generateToken(request.getUsername());
        return ResponseEntity.ok(Map.of("token", token, "username", request.getUsername()));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Message>> history() {
        return ResponseEntity.ok(messageRepository.findAllByOrderByTimestampAsc());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Message>> searchMessages(@RequestParam String q) {
        return ResponseEntity.ok(
            messageRepository.findByContentContainingIgnoreCaseOrderByTimestampAsc(q));
    }

    @GetMapping("/users")
    public ResponseEntity<List<String>> getAllUsers() {
        return ResponseEntity.ok(
            userRepository.findAll().stream()
                .map(User::getUsername)
                .collect(java.util.stream.Collectors.toList()));
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getProfile(@PathVariable String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody Map<String, String> update,
            @RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.substring(7));
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        if (update.containsKey("displayName")) user.setDisplayName(update.get("displayName"));
        if (update.containsKey("bio"))         user.setBio(update.get("bio"));
        userRepository.save(user);
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

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

    @PostMapping("/send-code")
    public ResponseEntity<?> sendVerificationCode(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String username = jwtUtil.extractUsername(authHeader.substring(7));
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            if (user.getEmail() == null || user.getEmail().isBlank())
                return ResponseEntity.status(400).body(Map.of("error", "No email address on your account. Please add one first."));
            String code = String.valueOf((int)(Math.random() * 900000) + 100000);
            verificationCodes.put(username, code);
            codeExpiry.put(username, Instant.now().plusSeconds(600));
            emailService.sendVerificationCode(user.getEmail(), code);
            return ResponseEntity.ok(Map.of("message", "Code sent to " + user.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        try {
            String username = jwtUtil.extractUsername(authHeader.substring(7));
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            String code = body.get("code");
            String newPassword = body.get("newPassword");
            String savedCode = verificationCodes.get(username);
            Instant expiry = codeExpiry.get(username);
            if (savedCode == null || expiry == null)
                return ResponseEntity.status(400).body(Map.of("error", "No verification code found. Please request one first."));
            if (Instant.now().isAfter(expiry))
                return ResponseEntity.status(400).body(Map.of("error", "Verification code has expired. Please request a new one."));
            if (!savedCode.equals(code))
                return ResponseEntity.status(400).body(Map.of("error", "Incorrect verification code."));
            if (newPassword == null || newPassword.length() < 6)
                return ResponseEntity.status(400).body(Map.of("error", "New password must be at least 6 characters"));
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            verificationCodes.remove(username);
            codeExpiry.remove(username);
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/update-email")
    public ResponseEntity<?> updateEmail(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        try {
            String username = jwtUtil.extractUsername(authHeader.substring(7));
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            user.setEmail(body.get("email"));
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "Email updated"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf("."));
    }
}