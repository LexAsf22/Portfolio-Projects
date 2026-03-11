package com.bench.ws.dto;

public class MessageStatusUpdate {
    private Long messageId;
    private String username;
    private String status;

    public MessageStatusUpdate() {}

    public Long getMessageId()           { return messageId; }
    public void setMessageId(Long id)    { this.messageId = id; }
    public String getUsername()          { return username; }
    public void setUsername(String u)    { this.username = u; }
    public String getStatus()            { return status; }
    public void setStatus(String s)      { this.status = s; }
}