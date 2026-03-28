package com.bench.ws.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    // FIX: Validate key length on first use — fails fast if secret is too short
    private Key getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalStateException(
                "JWT secret must be at least 32 characters. Current length: " + keyBytes.length);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // FIX: Added token type claim to prevent token confusion attacks
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .claim("type", "access")         // token type claim
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // FIX: extractUsername now also validates token type
    public String extractUsername(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        // Reject tokens that aren't access tokens
        String type = (String) claims.get("type");
        if (!"access".equals(type)) {
            throw new JwtException("Invalid token type");
        }

        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // FIX: Explicitly check expiry (parseClaimsJws throws if expired,
            // but this makes the intent clear and guards future refactors)
            if (claims.getExpiration().before(new Date())) {
                return false;
            }

            // FIX: Reject tokens without the correct type claim
            String type = (String) claims.get("type");
            return "access".equals(type);

        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // FIX: Separate method to check expiry without throwing
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return true; // treat invalid tokens as expired
        }
    }
}