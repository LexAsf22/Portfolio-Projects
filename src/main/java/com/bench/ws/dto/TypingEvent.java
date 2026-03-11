package com.bench.ws.dto;

public class TypingEvent {
    private String sender;
    private boolean typing;

    public TypingEvent() {}

    public String getSender()        { return sender; }
    public void setSender(String s)  { this.sender = s; }
    public boolean isTyping()        { return typing; }
    public void setTyping(boolean t) { this.typing = t; }
}