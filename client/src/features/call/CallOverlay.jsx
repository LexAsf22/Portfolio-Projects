// features/call/CallOverlay.jsx
// Full-screen overlay rendered during an active call.
// Handles both "video" mode (grid of video tiles) and "voice" mode
// (avatar grid with audio elements).
//
// WebRTC peer management is delegated to CallService.
// Signal publishing is delegated to stompService.
// All pure helpers live in call.utils.js.

import React, { useState, useEffect, useRef } from "react";

import { ICE_CONFIG }       from "../../shared/constants/webrtc";
import { IcoMic, IcoMicOff, IcoVideo, IcoVideoOff, IcoPhoneOff }
  from "../../shared/components/icons";
import { formatDuration }   from "../../shared/utils/formatters";
import { publishCallSignal } from "../../shared/services/stompService";

import { CallService }      from "./call.service";
import { SIGNAL_TYPES, CALL_ROOM, NOTIFY_TYPES } from "./call.constants";
import { calcGridDimensions, getMediaConstraints } from "./call.utils";

export default function CallOverlay({ mode, myName, isCaller, stompClient, onEnd }) {
  const [remoteStreams,  setRemoteStreams]  = useState({});
  const [muted,          setMuted]          = useState(false);
  const [camOff,         setCamOff]         = useState(false);
  const [status,         setStatus]         = useState("Connecting…");
  const [secs,           setSecs]           = useState(0);
  const [activeSpeaker,  setActiveSpeaker]  = useState(null);

  const localRef    = useRef(null);
  const videoRefs   = useRef({});
  const signalSub   = useRef(null);
  const localStream = useRef(null);
  const durTimer    = useRef(null);
  const endTimeout  = useRef(null);

  // ── CallService instance ──────────────────────────────────────────────────
  const serviceRef = useRef(null);

  // ── Publish helper (wraps stompService) ──────────────────────────────────
  const publish = (payload) => publishCallSignal(stompClient, payload);

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    // Instantiate CallService
    serviceRef.current = new CallService({
      myName,
      mode,
      publish,
      onRemoteStream: (peerId, stream) => {
        setRemoteStreams(prev => ({ ...prev, [peerId]: stream }));
      },
      onPeerRemoved: (peerId) => {
        setRemoteStreams(prev => { const n = { ...prev }; delete n[peerId]; return n; });
      },
      onSpeaking: (peerId) => setActiveSpeaker(peerId),
      onFirstConnect: () => {
        setStatus("Connected");
        if (!durTimer.current) {
          durTimer.current = setInterval(() => setSecs(s => s + 1), 1000);
        }
      },
    });

    const init = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setStatus("Camera/mic unavailable — use HTTPS or localhost");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia(
          getMediaConstraints(mode)
        );
        if (!mounted) { stream.getTracks().forEach(t => t.stop()); return; }

        localStream.current = stream;
        serviceRef.current.setLocalStream(stream);

        if (mode === "video" && localRef.current) {
          localRef.current.srcObject = stream;
          localRef.current.play().catch(() => {});
        }

        if (stompClient?.current?.connected) {
          // Subscribe to call signals
          signalSub.current = stompClient.current.subscribe(
            "/topic/call-signal",
            msg => serviceRef.current?.handleSignal(JSON.parse(msg.body))
          );

          // Announce presence to everyone already in the call
          publish({ sender: myName, type: SIGNAL_TYPES.PEER_JOIN, callRoom: CALL_ROOM, payload: "" });
          setStatus("Waiting for others…");
        } else {
          setStatus("Not connected to server");
        }
      } catch (err) {
        if (!mounted) return;
        setStatus(
          err.name === "NotAllowedError"
            ? "Permission denied"
            : "Error: " + err.message
        );
      }
    };

    init();

    return () => {
      mounted = false;
      clearInterval(durTimer.current);
      clearTimeout(endTimeout.current);

      serviceRef.current?.destroyAll();

      localStream.current?.getTracks().forEach(t => t.stop());
      localStream.current = null;

      signalSub.current?.unsubscribe();

      // Notify others we left
      if (stompClient?.current?.connected) {
        stompClient.current.publish({
          destination: "/app/call-signal",
          body: JSON.stringify({
            sender:   myName,
            type:     SIGNAL_TYPES.PEER_LEAVE,
            callRoom: CALL_ROOM,
            payload:  "",
          }),
        });
      }
    };
  }, []); // eslint-disable-line

  // ── Attach remote streams to video/audio elements ─────────────────────────
  useEffect(() => {
    Object.entries(remoteStreams).forEach(([peerId, stream]) => {
      const el = videoRefs.current[peerId];
      if (el && el.srcObject !== stream) {
        el.srcObject = stream;
        el.play().catch(() => {});
      }
    });
  }, [remoteStreams]);

  // Attach local stream when localRef mounts
  useEffect(() => {
    if (localRef.current && localStream.current && mode === "video") {
      localRef.current.srcObject = localStream.current;
      localRef.current.play().catch(() => {});
    }
  }, [mode]);

  // ── Controls ──────────────────────────────────────────────────────────────
  const toggleMute = () => {
    const nowMuted = !muted;
    localStream.current?.getAudioTracks().forEach(t => { t.enabled = !nowMuted; });
    setMuted(nowMuted);
  };

  const toggleCam = () => {
    const nowOff = !camOff;
    localStream.current?.getVideoTracks().forEach(t => { t.enabled = !nowOff; });
    setCamOff(nowOff);
  };

  // ── Grid ──────────────────────────────────────────────────────────────────
  const peers             = Object.keys(remoteStreams);
  const totalParticipants = peers.length + 1;
  const { cols, rows }    = calcGridDimensions(totalParticipants);

  // ── Styles ────────────────────────────────────────────────────────────────
  const overlayStyle = {
    position: "fixed", inset: 0, zIndex: 100,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    background: "linear-gradient(135deg, #06030f 0%, #0d0520 40%, #030d1a 100%)",
    display: "flex", flexDirection: "column", overflow: "hidden",
  };
  const headerStyle = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 24px",
    background: "rgba(255,255,255,0.03)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    flexShrink: 0, zIndex: 2,
  };
  const gridStyle = {
    flex: 1, display: "grid",
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows:    `repeat(${rows}, 1fr)`,
    gap: 8, padding: 12, minHeight: 0,
  };
  const tileBase = (isActive) => ({
    position: "relative", borderRadius: 16, overflow: "hidden",
    background: "rgba(255,255,255,0.04)",
    border: isActive
      ? "2px solid rgba(196,109,255,0.8)"
      : "1.5px solid rgba(255,255,255,0.07)",
    boxShadow: isActive
      ? "0 0 24px rgba(196,109,255,0.25), inset 0 0 0 1px rgba(196,109,255,0.15)"
      : "none",
    transition: "border-color 0.3s, box-shadow 0.3s",
    display: "flex", alignItems: "center", justifyContent: "center",
  });
  const nameTagStyle = {
    position: "absolute", bottom: 10, left: 12,
    background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
    borderRadius: 8, padding: "4px 10px",
    fontSize: 12, fontWeight: 600, color: "#fff",
    display: "flex", alignItems: "center", gap: 6,
  };
  const avatarStyle = {
    width: 64, height: 64, borderRadius: "50%",
    background: "linear-gradient(135deg,#c46dff,#7b8cff)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 24, fontWeight: 700, color: "#fff",
    boxShadow: "0 0 32px rgba(196,109,255,0.3)",
  };
  const ctrlBar = {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 16, padding: "16px 24px",
    background: "rgba(0,0,0,0.4)", backdropFilter: "blur(20px)",
    borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
  };
  const btn = (bg, size = 52) => ({
    width: size, height: size, borderRadius: "50%",
    border: "none", background: bg, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    transition: "transform 0.12s, opacity 0.12s, box-shadow 0.12s",
    flexShrink: 0,
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={overlayStyle}>
      <style>{`
        @keyframes callPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes speakRing {
          0%,100%{box-shadow:0 0 0 0 rgba(196,109,255,0.6)}
          50%{box-shadow:0 0 0 8px rgba(196,109,255,0)}
        }
        .call-ctrl-btn:hover  { transform:scale(1.1)  !important; }
        .call-ctrl-btn:active { transform:scale(0.93) !important; }
      `}</style>

      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#22c55e", boxShadow: "0 0 8px #22c55e",
            animation: "callPulse 2s infinite",
          }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
            {mode === "video" ? "📹" : "🔊"} Channel 1
          </span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: 4 }}>
            {status === "Connected" || peers.length > 0 ? formatDuration(secs) : status}
          </span>
        </div>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          {totalParticipants} participant{totalParticipants !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid */}
      {mode === "video" ? (
        <div style={gridStyle}>
          {/* Self tile */}
          <div style={tileBase(false)}>
            <video
              ref={localRef} autoPlay muted playsInline
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                display: camOff ? "none" : "block", transform: "scaleX(-1)",
              }}
            />
            {camOff && <div style={avatarStyle}>{myName[0]?.toUpperCase()}</div>}
            <div style={nameTagStyle}>
              {muted && <span style={{ fontSize: 10 }}>🔇</span>}
              <span>{myName} (You)</span>
            </div>
          </div>

          {/* Remote tiles */}
          {peers.map(peerId => (
            <div key={peerId} style={tileBase(activeSpeaker === peerId)}>
              <video
                ref={el => { if (el) videoRefs.current[peerId] = el; }}
                autoPlay playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={nameTagStyle}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: activeSpeaker === peerId ? "#22c55e" : "rgba(255,255,255,0.3)",
                  transition: "background 0.2s",
                }} />
                <span>{peerId}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Voice-only avatar grid */
        <div style={gridStyle}>
          {/* Self */}
          <div style={tileBase(false)}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={avatarStyle}>{myName[0]?.toUpperCase()}</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{myName}</span>
              <span style={{ fontSize: 11, color: muted ? "#fb7185" : "#22c55e" }}>
                {muted ? "🔇 Muted" : "🎙 Speaking"}
              </span>
            </div>
          </div>

          {/* Remote peers */}
          {peers.map(peerId => (
            <div key={peerId} style={tileBase(activeSpeaker === peerId)}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{
                  ...avatarStyle,
                  animation: activeSpeaker === peerId ? "speakRing 1s infinite" : "none",
                  background: `linear-gradient(135deg,${
                    ["#c46dff","#06b6d4","#ec4899","#059669","#f59e0b"][peerId.charCodeAt(0) % 5]
                  },#7b8cff)`,
                }}>
                  {peerId[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{peerId}</span>
                <span style={{ fontSize: 11, color: activeSpeaker === peerId ? "#22c55e" : "rgba(255,255,255,0.3)" }}>
                  {activeSpeaker === peerId ? "🎙 Speaking" : "○ Silent"}
                </span>
              </div>
              <audio
                ref={el => {
                  if (el && remoteStreams[peerId] && el.srcObject !== remoteStreams[peerId]) {
                    el.srcObject = remoteStreams[peerId];
                    el.play().catch(() => {});
                  }
                }}
                autoPlay style={{ display: "none" }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Control bar */}
      <div style={ctrlBar}>
        {/* Mute */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <button
            className="call-ctrl-btn"
            style={btn(muted ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.12)")}
            onClick={toggleMute}
          >
            {muted ? <IcoMicOff color="#1a0533" /> : <IcoMic color="#fff" />}
          </button>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{muted ? "Unmute" : "Mute"}</span>
        </div>

        {/* End call */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <button
            className="call-ctrl-btn"
            style={{ ...btn("#ef4444", 64), boxShadow: "0 4px 24px rgba(239,68,68,0.45)" }}
            onClick={() => onEnd(secs)}
          >
            <IcoPhoneOff color="#fff" />
          </button>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Leave</span>
        </div>

        {/* Camera (video only) */}
        {mode === "video" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <button
              className="call-ctrl-btn"
              style={btn(camOff ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.12)")}
              onClick={toggleCam}
            >
              {camOff ? <IcoVideo color="#1a0533" /> : <IcoVideoOff color="#fff" />}
            </button>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{camOff ? "Cam on" : "Cam off"}</span>
          </div>
        )}

        {/* Participant count */}
        <div style={{
          marginLeft: "auto", background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999,
          padding: "6px 16px", fontSize: 12, color: "rgba(255,255,255,0.5)",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
          {totalParticipants} in call
        </div>
      </div>
    </div>
  );
}