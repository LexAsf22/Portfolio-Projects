package com.bench.ws.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "messages")
public class Message {

    public enum Status { SENT, DELIVERED, SEEN }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sender;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String type;

    @Column(columnDefinition = "TEXT")
    private String fileUrl;

    private LocalDateTime timestamp;

    private Integer callDuration;

    @Enumerated(EnumType.STRING)
    private Status status = Status.SENT;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "message_seen_by", joinColumns = @JoinColumn(name = "message_id"))
    @Column(name = "username")
    private List<String> seenBy = new ArrayList<>();

    public Message() {}

    public Message(String sender, String content, String type, String fileUrl) {
        this.sender    = sender;
        this.content   = content;
        this.type      = type;
        this.fileUrl   = fileUrl;
        this.timestamp = LocalDateTime.now();
        this.status    = Status.SENT;
    }

    public Long getId()                          { return id; }
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
    public Integer getCallDuration()             { return callDuration; }
    public void setCallDuration(Integer d)       { this.callDuration = d; }
    public Status getStatus()                    { return status; }
    public void setStatus(Status s)              { this.status = s; }
    public List<String> getSeenBy()              { return seenBy; }
    public void setSeenBy(List<String> s)        { this.seenBy = s; }

    private boolean edited = false;
    private boolean deleted = false;

    public boolean isEdited()        { return edited; }
    public void setEdited(boolean e) { this.edited = e; }
    public boolean isDeleted()       { return deleted; }
    public void setDeleted(boolean d){ this.deleted = d; }
}