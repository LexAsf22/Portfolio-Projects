package com.bench.ws.websocket;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.bench.ws.security.CustomUserDetailsService;
import com.bench.ws.security.JwtUtil;

@Component
public class JwtChannelInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;
    // FIX: Inject UserDetailsService so WebSocket users get real authorities
    private final CustomUserDetailsService userDetailsService;

    public JwtChannelInterceptor(JwtUtil jwtUtil,
                                 CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        // FIX: Null guard — accessor can be null for non-STOMP frames
        if (accessor == null || accessor.getCommand() == null) {
            return message;
        }

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String authHeader = accessor.getFirstNativeHeader("Authorization");

            // FIX: Specific error messages help debugging without leaking internals
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new MessageDeliveryException(
                    "WebSocket connection rejected: missing Authorization header");
            }

            String token = authHeader.substring(7);

            if (!jwtUtil.validateToken(token)) {
                throw new MessageDeliveryException(
                    "WebSocket connection rejected: invalid or expired token");
            }

            String username = jwtUtil.extractUsername(token);

            // FIX: Load real UserDetails so authorities (roles) are correct
            // Previously used List.of() which gave the user NO authorities
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()); // real roles now

            accessor.setUser(authentication);
        }

        return message;
    }
}