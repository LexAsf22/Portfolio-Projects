package com.bench.ws.dto;

public class DmPayload {
    private String sender;
    private String recipient;
    private String content;
    private String type;
    private String fileUrl;

    public DmPayload() {}

    public String getSender()              { return sender; }
    public void setSender(String s)        { this.sender = s; }
    public String getRecipient()           { return recipient; }
    public void setRecipient(String r)     { this.recipient = r; }
    public String getContent()             { return content; }
    public void setContent(String c)       { this.content = c; }
    public String getType()                { return type; }
    public void setType(String t)          { this.type = t; }
    public String getFileUrl()             { return fileUrl; }
    public void setFileUrl(String u)       { this.fileUrl = u; }
}