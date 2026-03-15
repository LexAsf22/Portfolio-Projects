// features/call/IncomingCallBanner.jsx
// Slide-down banner shown when a remote peer initiates a call.
// Purely presentational — accept/reject callbacks come from Chat.jsx.

import React, { useState, useEffect } from "react";
import { IcoPhone, IcoPhoneOff } from "../../shared/components/icons";

export default function IncomingCallBanner({ from, mode, onAccept, onReject }) {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 800);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: 20, left: "50%",
      transform: "translateX(-50%)",
      zIndex: 200,
      minWidth: 340,
      background: "linear-gradient(135deg, rgba(12,6,28,0.98), rgba(8,4,20,0.98))",
      backdropFilter: "blur(32px)",
      border: "1px solid rgba(196,109,255,0.3)",
      borderRadius: 22,
      padding: "18px 20px",
      display: "flex", alignItems: "center", gap: 14,
      boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(196,109,255,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      color: "#fff",
      animation: "slideDown 0.35s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <style>{`
        @keyframes slideDown {
          from { opacity:0; transform:translateX(-50%) translateY(-16px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
        @keyframes ringPulse {
          0%,100% { box-shadow:0 0 0 0 rgba(196,109,255,0.5); }
          50%      { box-shadow:0 0 0 14px rgba(196,109,255,0); }
        }
      `}</style>

      {/* Pulsing avatar */}
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        background: "linear-gradient(135deg,#c46dff,#7b8cff)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, fontWeight: 700, flexShrink: 0,
        animation: "ringPulse 1.5s infinite",
      }}>
        {(from || "?")[0].toUpperCase()}
      </div>

      {/* Caller info */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{from}</div>
        <div style={{
          fontSize: 12, color: "rgba(255,255,255,0.5)",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: pulse ? "#c46dff" : "transparent",
            transition: "background 0.3s",
          }} />
          Incoming {mode === "video" ? "video" : "voice"} call…
        </div>
      </div>

      {/* Reject */}
      <button
        onClick={onReject}
        style={{
          width: 42, height: 42, borderRadius: "50%",
          background: "rgba(239,68,68,0.15)",
          border: "1px solid rgba(239,68,68,0.3)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#ef4444"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; }}
      >
        <IcoPhoneOff color="#ef4444" size={18} />
      </button>

      {/* Accept */}
      <button
        onClick={onAccept}
        style={{
          width: 42, height: 42, borderRadius: "50%",
          background: "rgba(34,197,94,0.15)",
          border: "1px solid rgba(34,197,94,0.3)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#22c55e"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(34,197,94,0.15)"; }}
      >
        <IcoPhone color="#22c55e" size={18} />
      </button>
    </div>
  );
}