package com.bench.ws.websocket;

import java.security.Principal;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.bench.ws.dto.PresenceEvent;

@Component
public class PresenceEventListener {

    private final OnlineUserRegistry userRegistry;
    private final SimpMessagingTemplate messagingTemplate;

    public PresenceEventListener(OnlineUserRegistry userRegistry,  // ← updated type
                              SimpMessagingTemplate messagingTemplate) {
            this.userRegistry = userRegistry;
            this.messagingTemplate = messagingTemplate;
    }   

    @EventListener
    public void handleConnect(SessionConnectedEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal user = accessor.getUser();
        String sessionId = accessor.getSessionId();

        if (user != null && sessionId != null) {
            userRegistry.register(sessionId, user.getName());
            broadcast();
        }
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();

        if (sessionId != null) {
            userRegistry.remove(sessionId);
            broadcast();
        }
    }

    private void broadcast() {
        messagingTemplate.convertAndSend(
            "/topic/presence",
            new PresenceEvent(userRegistry.getOnlineUsers())
        );
    }
}