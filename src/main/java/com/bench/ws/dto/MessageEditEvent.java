package com.bench.ws.dto;

public class MessageEditEvent {
    private Long messageId;
    private String newContent;
    private String editor;

    public MessageEditEvent() {}

    public Long getMessageId()               { return messageId; }
    public void setMessageId(Long m)         { this.messageId = m; }
    public String getNewContent()            { return newContent; }
    public void setNewContent(String c)      { this.newContent = c; }
    public String getEditor()                { return editor; }
    public void setEditor(String e)          { this.editor = e; }
}