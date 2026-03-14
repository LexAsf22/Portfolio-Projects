package com.bench.ws.dto;

// ─────────────────────────────────────────────────────────────────
// FIX SUMMARY — DmPayload.java
//
// Added fields required by the new dm.edit and dm.delete endpoints:
//
//   id      — the DirectMessage PK, needed to look up the record
//   typing  — boolean flag for dm.typing indicator endpoint
// ─────────────────────────────────────────────────────────────────
public class DmPayload {

    private Long   id;          // FIX: DM primary key for edit/delete/seen
    private String sender;
    private String recipient;
    private String content;
    private String type;        // TEXT | IMAGE | VIDEO | AUDIO | FILE
    private String fileUrl;
    private boolean typing;     // FIX: for dm.typing indicator

    public DmPayload() {}

    // ── Getters / Setters ──────────────────────────────────────
    public Long    getId()                   { return id; }
    public void    setId(Long id)            { this.id = id; }

    public String  getSender()               { return sender; }
    public void    setSender(String s)       { this.sender = s; }

    public String  getRecipient()            { return recipient; }
    public void    setRecipient(String r)    { this.recipient = r; }

    public String  getContent()              { return content; }
    public void    setContent(String c)      { this.content = c; }

    public String  getType()                 { return type; }
    public void    setType(String t)         { this.type = t; }

    public String  getFileUrl()              { return fileUrl; }
    public void    setFileUrl(String u)      { this.fileUrl = u; }

    public boolean isTyping()                { return typing; }
    public void    setTyping(boolean t)      { this.typing = t; }
}