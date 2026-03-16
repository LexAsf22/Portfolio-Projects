package com.bench.ws.dto;

/**
 * ScreenShareSignal
 *
 * FEATURE: Screen Sharing
 *
 * Used to relay WebRTC screen share signals between peers.
 * Screen sharing uses the same WebRTC offer/answer/ICE mechanism
 * as voice/video calls, but with a separate signal type and topic
 * so it doesn't interfere with ongoing calls.
 *
 * Signal types:
 *   SCREEN_START  — broadcaster announces they are sharing
 *   SCREEN_OFFER  — WebRTC offer from broadcaster to a specific viewer
 *   SCREEN_ANSWER — WebRTC answer from viewer to broadcaster
 *   SCREEN_ICE    — ICE candidate exchange
 *   SCREEN_STOP   — broadcaster stopped sharing
 *
 * The backend only relays these signals — all WebRTC negotiation
 * happens peer-to-peer in the browser.
 */
public class ScreenShareSignal {

    private String sender;
    private String target;      // peer to receive this signal (null = broadcast to all)
    private String type;        // SCREEN_START | SCREEN_OFFER | SCREEN_ANSWER | SCREEN_ICE | SCREEN_STOP
    private String roomId;      // channel or room context
    private String payload;     // JSON-encoded SDP or ICE candidate
    private String shareMode;   // "SCREEN" | "WINDOW" | "TAB" (informational only)

    public ScreenShareSignal() {}

    // ── Getters / Setters ──────────────────────────────────────
    public String getSender()                { return sender; }
    public void   setSender(String s)        { this.sender = s; }

    public String getTarget()                { return target; }
    public void   setTarget(String t)        { this.target = t; }

    public String getType()                  { return type; }
    public void   setType(String t)          { this.type = t; }

    public String getRoomId()                { return roomId; }
    public void   setRoomId(String r)        { this.roomId = r; }

    public String getPayload()               { return payload; }
    public void   setPayload(String p)       { this.payload = p; }

    public String getShareMode()             { return shareMode; }
    public void   setShareMode(String m)     { this.shareMode = m; }
}