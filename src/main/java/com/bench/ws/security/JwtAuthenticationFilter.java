package com.bench.ws.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil,
                                   CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        if (path.equals("/auth/login")      ||
            path.equals("/auth/register")   ||
            path.equals("/auth/2fa/verify") ||
            path.startsWith("/ws")          ||
            path.startsWith("/upload")      ||
            path.startsWith("/uploads")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ FIXED: Only skip truly public endpoints.
        // Do NOT skip all of /auth/** — protected auth routes need JWT processing.
        boolean isPublic =
            path.equals("/auth/login")       ||
            path.equals("/auth/register")    ||
            path.equals("/auth/2fa/verify")  ||
            path.startsWith("/ws")           ||
            path.startsWith("/upload")       ||
            path.startsWith("/uploads");

        if (isPublic) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                if (jwtUtil.validateToken(token)) {
                    String username = jwtUtil.extractUsername(token);
                    UserDetails userDetails =
                            userDetailsService.loadUserByUsername(username);

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                // Token is invalid/expired — SecurityContext stays null,
                // Spring Security will return 401/403 as configured
                logger.warn("JWT validation failed for path " + path + ": " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}