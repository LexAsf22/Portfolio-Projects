package com.bench.ws.dto;

public class RoomMessagePayload {
    private Long roomId;
    private String sender;
    private String content;
    private String type;
    private String fileUrl;

    public RoomMessagePayload() {}

    public Long getRoomId()                { return roomId; }
    public void setRoomId(Long r)          { this.roomId = r; }
    public String getSender()              { return sender; }
    public void setSender(String s)        { this.sender = s; }
    public String getContent()             { return content; }
    public void setContent(String c)       { this.content = c; }
    public String getType()                { return type; }
    public void setType(String t)          { this.type = t; }
    public String getFileUrl()             { return fileUrl; }
    public void setFileUrl(String u)       { this.fileUrl = u; }
}