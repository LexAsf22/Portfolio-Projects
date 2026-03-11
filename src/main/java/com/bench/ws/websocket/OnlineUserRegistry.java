package com.bench.ws.websocket;

import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

@Component
public class OnlineUserRegistry {  // ← renamed

    private final Map<String, String> sessions = new ConcurrentHashMap<>();

    public void register(String sessionId, String username) {
        sessions.put(sessionId, username);
    }

    public void remove(String sessionId) {
        sessions.remove(sessionId);
    }

    public Set<String> getOnlineUsers() {
        return Collections.unmodifiableSet(new HashSet<>(sessions.values()));
    }

    public String getUsername(String sessionId) {
        return sessions.get(sessionId);
    }
}