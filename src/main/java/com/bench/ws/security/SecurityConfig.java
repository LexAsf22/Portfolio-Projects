package com.bench.ws.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * SecurityConfig — updated to allow new feature endpoints:
 *
 * Public (no JWT required):
 *   /auth/**        — login, register, 2FA verify
 *   /ws/**          — WebSocket connections
 *   /upload/**      — file uploads
 *   /uploads/**     — serving uploaded files
 *
 * Authenticated (JWT required):
 *   /moderation/**  — ban, kick, timeout (role checked inside controller)
 *   /polls/**       — poll creation and voting
 *   /messages/**    — edit history
 *   /dm/**          — direct messages
 *   /rooms/**       — rooms
 *
 * Role enforcement is done in individual controllers, not here,
 * because Spring Security method-level @PreAuthorize would require
 * the roles to be in the JWT — our JWT only contains the username.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter,
                          CustomUserDetailsService userDetailsService) {
        this.jwtAuthFilter    = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/auth/login").permitAll()
                .requestMatchers("/auth/register").permitAll()
                .requestMatchers("/auth/2fa/verify").permitAll()  // 2FA verify is pre-auth
                .requestMatchers("/ws/**").permitAll()
                .requestMatchers("/upload/**").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                // All other /auth/** endpoints require a valid JWT
                .requestMatchers("/auth/**").authenticated()
                // New feature endpoints — authenticated
                .requestMatchers("/moderation/**").authenticated()
                .requestMatchers("/polls/**").authenticated()
                .requestMatchers("/messages/**").authenticated()
                .requestMatchers("/dm/**").permitAll()
                .requestMatchers("/rooms/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}