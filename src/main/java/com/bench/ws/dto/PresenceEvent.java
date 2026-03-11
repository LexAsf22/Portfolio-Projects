package com.bench.ws.dto;

import java.util.Set;

public class PresenceEvent {
    private Set<String> onlineUsers;

    public PresenceEvent() {}
    public PresenceEvent(Set<String> onlineUsers) {
        this.onlineUsers = onlineUsers;
    }

    public Set<String> getOnlineUsers()           { return onlineUsers; }
    public void setOnlineUsers(Set<String> users) { this.onlineUsers = users; }
}