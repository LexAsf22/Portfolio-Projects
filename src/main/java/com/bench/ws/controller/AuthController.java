package com.bench.ws.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bench.ws.dto.LoginRequest;
import com.bench.ws.dto.Message;
import com.bench.ws.dto.RegisterRequest;
import com.bench.ws.dto.User;
import com.bench.ws.repository.MessageRepository;
import com.bench.ws.repository.UserRepository;
import com.bench.ws.security.JwtUtil;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MessageRepository messageRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          MessageRepository messageRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil               = jwtUtil;
        this.userRepository        = userRepository;
        this.passwordEncoder       = passwordEncoder;
        this.messageRepository     = messageRepository;
    }

    // ── LOGIN ──────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(
            @RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
            );
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }

        String token = jwtUtil.generateToken(request.getUsername());
        return ResponseEntity.ok(Map.of(
                "token",    token,
                "username", request.getUsername()
        ));
    }

    // ── REGISTER ───────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(
            @RequestBody RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Username already taken"));
        }

        User user = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword())
        );
        userRepository.save(user);

        String token = jwtUtil.generateToken(request.getUsername());
        return ResponseEntity.ok(Map.of(
                "token",    token,
                "username", request.getUsername()
        ));
    }

    // ── MESSAGE HISTORY ────────────────────────────────────────
    @GetMapping("/history")
    public ResponseEntity<List<Message>> history() {
        return ResponseEntity.ok(
                messageRepository.findAllByOrderByTimestampAsc()
        );
    }

    // ── SEARCH MESSAGES ────────────────────────────────────────
    @GetMapping("/search")
    public ResponseEntity<List<Message>> searchMessages(
            @RequestParam String q) {
        return ResponseEntity.ok(
            messageRepository
                .findByContentContainingIgnoreCaseOrderByTimestampAsc(q));
    }

    // ── LIST ALL USERS ─────────────────────────────────────────
    @GetMapping("/users")
    public ResponseEntity<List<String>> getAllUsers() {
        return ResponseEntity.ok(
            userRepository.findAll()
                .stream()
                .map(u -> u.getUsername())
                .collect(java.util.stream.Collectors.toList()));
    }
}