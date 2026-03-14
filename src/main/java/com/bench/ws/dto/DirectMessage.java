package com.bench.ws.dto;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// ─────────────────────────────────────────────────────────────────
// FIX SUMMARY — DirectMessage.java
//
// 1. Added `edited` boolean field — needed by the new /dm.edit
//    WebSocket endpoint in DirectMessageController.
//
// 2. Added `deleted` boolean field — needed by /dm.delete.
//    When deleted=true, content is replaced with a tombstone string.
//
// 3. Added `id` exposure in JSON — the frontend needs the DM's id
//    to reference it for edit/delete/seen operations.
//    (getId() already existed but ensured it is not @JsonIgnore'd)
// ─────────────────────────────────────────────────────────────────
@Entity
@Table(name = "direct_messages")
public class DirectMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sender;
    private String recipient;

    @Column(columnDefinition = "TEXT")
    private String content;

    // TEXT | IMAGE | VIDEO | AUDIO | FILE
    private String type;

    @Column(columnDefinition = "TEXT")
    private String fileUrl;

    private LocalDateTime timestamp;

    private boolean seen    = false;

    // FIX: New flags for edit/delete support
    // columnDefinition ensures existing rows get default=false during ALTER TABLE
    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean edited  = false;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean deleted = false;

    public DirectMessage() {}

    public DirectMessage(String sender, String recipient,
                         String content, String type, String fileUrl) {
        this.sender    = sender;
        this.recipient = recipient;
        this.content   = content;
        this.type      = type;
        this.fileUrl   = fileUrl;
        this.timestamp = LocalDateTime.now();
    }

    // ── Getters / Setters ──────────────────────────────────────
    public Long          getId()                       { return id; }

    public String        getSender()                   { return sender; }
    public void          setSender(String s)           { this.sender = s; }

    public String        getRecipient()                { return recipient; }
    public void          setRecipient(String r)        { this.recipient = r; }

    public String        getContent()                  { return content; }
    public void          setContent(String c)          { this.content = c; }

    public String        getType()                     { return type; }
    public void          setType(String t)             { this.type = t; }

    public String        getFileUrl()                  { return fileUrl; }
    public void          setFileUrl(String u)          { this.fileUrl = u; }

    public LocalDateTime getTimestamp()                { return timestamp; }
    public void          setTimestamp(LocalDateTime t) { this.timestamp = t; }

    public boolean       isSeen()                      { return seen; }
    public void          setSeen(boolean s)            { this.seen = s; }

    public boolean       isEdited()                    { return edited; }
    public void          setEdited(boolean e)          { this.edited = e; }

    public boolean       isDeleted()                   { return deleted; }
    public void          setDeleted(boolean d)         { this.deleted = d; }
}