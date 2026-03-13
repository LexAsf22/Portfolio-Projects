package com.bench.ws.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "message_reactions",
       uniqueConstraints = @UniqueConstraint(columnNames = {"message_id", "username", "emoji"}))
public class MessageReaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long messageId;
    private String username;
    private String emoji;

    public MessageReaction() {}

    public MessageReaction(Long messageId, String username, String emoji) {
        this.messageId = messageId;
        this.username  = username;
        this.emoji     = emoji;
    }

    public Long getId()                  { return id; }
    public Long getMessageId()           { return messageId; }
    public void setMessageId(Long m)     { this.messageId = m; }
    public String getUsername()          { return username; }
    public void setUsername(String u)    { this.username = u; }
    public String getEmoji()             { return emoji; }
    public void setEmoji(String e)       { this.emoji = e; }
}