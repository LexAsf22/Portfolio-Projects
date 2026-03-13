package com.bench.ws.dto;

public class MessageDeleteEvent {
    private Long messageId;
    private String deletedBy;

    public MessageDeleteEvent() {}

    public Long getMessageId()               { return messageId; }
    public void setMessageId(Long m)         { this.messageId = m; }
    public String getDeletedBy()             { return deletedBy; }
    public void setDeletedBy(String d)       { this.deletedBy = d; }
}