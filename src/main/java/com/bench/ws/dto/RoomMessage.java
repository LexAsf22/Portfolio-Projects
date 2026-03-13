package com.bench.ws.dto;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "room_messages")
public class RoomMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long roomId;
    private String sender;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String type;

    @Column(columnDefinition = "TEXT")
    private String fileUrl;

    private LocalDateTime timestamp;
    private boolean edited = false;
    private boolean deleted = false;

    public RoomMessage() {}

    public RoomMessage(Long roomId, String sender, String content, String type, String fileUrl) {
        this.roomId    = roomId;
        this.sender    = sender;
        this.content   = content;
        this.type      = type;
        this.fileUrl   = fileUrl;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId()                          { return id; }
    public Long getRoomId()                      { return roomId; }
    public void setRoomId(Long r)                { this.roomId = r; }
    public String getSender()                    { return sender; }
    public void setSender(String s)              { this.sender = s; }
    public String getContent()                   { return content; }
    public void setContent(String c)             { this.content = c; }
    public String getType()                      { return type; }
    public void setType(String t)                { this.type = t; }
    public String getFileUrl()                   { return fileUrl; }
    public void setFileUrl(String u)             { this.fileUrl = u; }
    public LocalDateTime getTimestamp()          { return timestamp; }
    public void setTimestamp(LocalDateTime t)    { this.timestamp = t; }
    public boolean isEdited()                    { return edited; }
    public void setEdited(boolean e)             { this.edited = e; }
    public boolean isDeleted()                   { return deleted; }
    public void setDeleted(boolean d)            { this.deleted = d; }
}