package com.bench.ws.dto;

public class CallSignal {
    private String sender;
    private String type;
    private String payload;
    private String mode;
    private String callId;

    public CallSignal() {}

    public String getSender()          { return sender; }
    public void setSender(String s)    { this.sender = s; }
    public String getType()            { return type; }
    public void setType(String t)      { this.type = t; }
    public String getPayload()         { return payload; }
    public void setPayload(String p)   { this.payload = p; }
    public String getMode()            { return mode; }
    public void setMode(String m)      { this.mode = m; }
    public String getCallId()          { return callId; }
    public void setCallId(String id)   { this.callId = id; }
}