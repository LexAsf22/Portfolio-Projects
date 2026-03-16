package com.bench.ws.dto;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Poll entity
 *
 * FEATURE: Built-in Poll & Voting System
 *
 * A poll belongs to a channel, room, or DM conversation.
 * Options are stored as a separate PollOption entity.
 *
 * Fields:
 *   - question:      The poll question text
 *   - createdBy:     Username of who created it
 *   - contextType:   "CHANNEL" | "ROOM" | "DM"
 *   - contextId:     null for channel, roomId for rooms, recipientUsername for DMs
 *   - anonymous:     If true, votes are not tied to usernames publicly
 *   - multiChoice:   If true, users can vote for multiple options
 *   - expiresAt:     null = no expiry, non-null = auto-closes at this time
 *   - closed:        Manually or automatically closed poll
 */
@Entity
@Table(name = "polls")
public class Poll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String question;

    @Column(nullable = false)
    private String createdBy;

    // "CHANNEL" | "ROOM" | "DM"
    @Column(nullable = false)
    private String contextType = "CHANNEL";

    // roomId as string, or DM recipient username, or null for channel
    private String contextId;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean anonymous = false;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean multiChoice = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // null = no expiry
    private LocalDateTime expiresAt;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean closed = false;

    // Poll options (1:many relationship)
    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<PollOption> options = new ArrayList<>();

    public Poll() {
        this.createdAt = LocalDateTime.now();
    }

    // ── Getters / Setters ──────────────────────────────────────
    public Long             getId()                         { return id; }

    public String           getQuestion()                   { return question; }
    public void             setQuestion(String q)           { this.question = q; }

    public String           getCreatedBy()                  { return createdBy; }
    public void             setCreatedBy(String c)          { this.createdBy = c; }

    public String           getContextType()                { return contextType; }
    public void             setContextType(String t)        { this.contextType = t; }

    public String           getContextId()                  { return contextId; }
    public void             setContextId(String c)          { this.contextId = c; }

    public boolean          isAnonymous()                   { return anonymous; }
    public void             setAnonymous(boolean a)         { this.anonymous = a; }

    public boolean          isMultiChoice()                 { return multiChoice; }
    public void             setMultiChoice(boolean m)       { this.multiChoice = m; }

    public LocalDateTime    getCreatedAt()                  { return createdAt; }

    public LocalDateTime    getExpiresAt()                  { return expiresAt; }
    public void             setExpiresAt(LocalDateTime e)   { this.expiresAt = e; }

    public boolean          isClosed()                      { return closed; }
    public void             setClosed(boolean c)            { this.closed = c; }

    public List<PollOption> getOptions()                    { return options; }
    public void             setOptions(List<PollOption> o)  { this.options = o; }

    /** Returns true if the poll has expired. */
    public boolean isExpired() {
        return expiresAt != null && LocalDateTime.now().isAfter(expiresAt);
    }

    /** Returns true if the poll is still active (not closed, not expired). */
    public boolean isActive() {
        return !closed && !isExpired();
    }
}