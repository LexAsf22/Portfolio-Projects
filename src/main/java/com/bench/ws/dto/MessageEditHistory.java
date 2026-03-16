package com.bench.ws.dto;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * MessageEditHistory
 *
 * Every time a message is edited, the OLD content is saved here before
 * being overwritten. This allows users to view the full edit history
 * ("Edited 3 times" → click → see all previous versions).
 *
 * Works for both channel messages and room messages.
 * messageType: "CHANNEL" | "ROOM" | "DM"
 */
@Entity
@Table(name = "message_edit_history")
public class MessageEditHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ID of the message that was edited
    @Column(nullable = false)
    private Long messageId;

    // "CHANNEL" | "ROOM" | "DM"
    @Column(nullable = false)
    private String messageType;

    // The content BEFORE this edit (the old version)
    @Column(columnDefinition = "TEXT", nullable = false)
    private String previousContent;

    // Who made the edit
    @Column(nullable = false)
    private String editedBy;

    // When was this edit made
    @Column(nullable = false)
    private LocalDateTime editedAt;

    // Which edit number this is (1st edit, 2nd edit, etc.)
    @Column(nullable = false)
    private int editNumber;

    public MessageEditHistory() {}

    public MessageEditHistory(Long messageId, String messageType,
                               String previousContent, String editedBy, int editNumber) {
        this.messageId       = messageId;
        this.messageType     = messageType;
        this.previousContent = previousContent;
        this.editedBy        = editedBy;
        this.editedAt        = LocalDateTime.now();
        this.editNumber      = editNumber;
    }

    // ── Getters / Setters ──────────────────────────────────────
    public Long          getId()                         { return id; }

    public Long          getMessageId()                  { return messageId; }
    public void          setMessageId(Long m)            { this.messageId = m; }

    public String        getMessageType()                { return messageType; }
    public void          setMessageType(String t)        { this.messageType = t; }

    public String        getPreviousContent()            { return previousContent; }
    public void          setPreviousContent(String c)    { this.previousContent = c; }

    public String        getEditedBy()                   { return editedBy; }
    public void          setEditedBy(String e)           { this.editedBy = e; }

    public LocalDateTime getEditedAt()                   { return editedAt; }
    public void          setEditedAt(LocalDateTime t)    { this.editedAt = t; }

    public int           getEditNumber()                 { return editNumber; }
    public void          setEditNumber(int n)            { this.editNumber = n; }
}