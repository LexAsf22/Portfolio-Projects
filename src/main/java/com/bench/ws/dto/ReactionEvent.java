package com.bench.ws.dto;

import java.util.List;

public class ReactionEvent {
    private Long messageId;
    private String emoji;
    private String username;
    private String action; // "ADD" or "REMOVE"
    private List<MessageReaction> reactions;

    public ReactionEvent() {}

    public Long getMessageId()                       { return messageId; }
    public void setMessageId(Long m)                 { this.messageId = m; }
    public String getEmoji()                         { return emoji; }
    public void setEmoji(String e)                   { this.emoji = e; }
    public String getUsername()                      { return username; }
    public void setUsername(String u)                { this.username = u; }
    public String getAction()                        { return action; }
    public void setAction(String a)                  { this.action = a; }
    public List<MessageReaction> getReactions()      { return reactions; }
    public void setReactions(List<MessageReaction> r){ this.reactions = r; }
}