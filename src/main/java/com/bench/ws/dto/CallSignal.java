package com.bench.ws.dto;

// ─────────────────────────────────────────────────────────────────
// FIX SUMMARY — CallSignal.java
//
// Added fields required by the fixed ChatController and RoomController:
//
//   callRoom — identifies which channel/room the call belongs to.
//              Prevents ICE signals from one call bleeding into another.
//
//   mode     — "voice" or "video". Used by the incoming call banner
//              and the call-presence broadcast.
//
//   payload  — already existed (SDP / ICE candidate JSON string)
//
//   type     — RING | READY | OFFER | ANSWER | ICE | END | JOIN | LEAVE
// ─────────────────────────────────────────────────────────────────
public class CallSignal {

    private String sender;
    private String target;     // peer-addressed: only that peer processes this signal
    private String callId;
    private String callRoom;   // which channel/room this call belongs to
    private String type;       // RING | READY | OFFER | ANSWER | ICE | END | JOIN | LEAVE | PEER_JOIN | PEER_LEAVE
    private String mode;       // "voice" | "video"
    private String payload;    // JSON-encoded SDP or ICE candidate

    public CallSignal() {}

    // ── Getters / Setters ──────────────────────────────────────
    public String getSender()              { return sender; }
    public void   setSender(String s)      { this.sender = s; }

    public String getTarget()              { return target; }
    public void   setTarget(String t)      { this.target = t; }

    public String getCallId()              { return callId; }
    public void   setCallId(String c)      { this.callId = c; }

    public String getCallRoom()            { return callRoom; }
    public void   setCallRoom(String r)    { this.callRoom = r; }

    public String getType()                { return type; }
    public void   setType(String t)        { this.type = t; }

    public String getMode()                { return mode; }
    public void   setMode(String m)        { this.mode = m; }

    public String getPayload()             { return payload; }
    public void   setPayload(String p)     { this.payload = p; }
}
