import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const svgBase = (size) => ({
  display: "block",
  width: size,
  height: size,
  overflow: "visible",
  flexShrink: 0,
});

function IcoSend({ size = 18, color = "#fff" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s}>
      <line x1="22" y1="2" x2="11" y2="13" style={{ stroke: color, strokeWidth: 2.2, strokeLinecap: "round" }} />
      <polygon points="22 2 15 22 11 13 2 9 22 2" style={{ fill: color, stroke: "none" }} />
    </svg>
  );
}

function IcoImage({ size = 20, color = "#8b6fd4" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <circle cx="8.5" cy="8.5" r="1.5" style={{ fill: color }} />
      <polyline points="21 15 16 10 5 21" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }} />
    </svg>
  );
}

function IcoPaperclip({ size = 20, color = "#8b6fd4" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }} />
    </svg>
  );
}

function IcoMic({ size = 20, color = "#8b6fd4" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <rect x="9" y="1" width="6" height="11" rx="3" style={{ stroke: color, strokeWidth: 1.9, fill: "none" }} />
      <path d="M5 10v2a7 7 0 0 0 14 0v-2" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <line x1="12" y1="19" x2="12" y2="23" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }} />
      <line x1="8" y1="23" x2="16" y2="23" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }} />
    </svg>
  );
}

function IcoMicOff({ size = 20, color = "#ef4444" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <line x1="1" y1="1" x2="23" y2="23" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }} />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <path d="M15 9.34V4a3 3 0 0 0-5.94-.6" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <path d="M17 16.95A7 7 0 0 1 5 12v-2" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <line x1="12" y1="19" x2="12" y2="23" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }} />
      <line x1="8" y1="23" x2="16" y2="23" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }} />
    </svg>
  );
}

function IcoPhone({ size = 20, color = "#8b6fd4" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s}>
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" style={{ fill: color, stroke: "none" }} />
    </svg>
  );
}

function IcoPhoneOff({ size = 22, color = "#fff" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45c1.12.45 2.3.7 3.53.7a2 2 0 0 1 2 2v3.5a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2h3.5a2 2 0 0 1 2 2c0 1.23.25 2.41.7 3.53a2 2 0 0 1-.45 2.11L10.68 13.31z" style={{ stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }} />
      <line x1="1" y1="1" x2="23" y2="23" style={{ stroke: color, strokeWidth: 2, strokeLinecap: "round" }} />
    </svg>
  );
}

function IcoVideo({ size = 20, color = "#8b6fd4" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <rect x="1" y="5" width="15" height="14" rx="2" style={{ stroke: color, strokeWidth: 1.9, fill: "none" }} />
      <polygon points="23 7 16 12 23 17 23 7" style={{ fill: color, stroke: "none" }} />
    </svg>
  );
}

function IcoVideoOff({ size = 20, color = "#ef4444" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <path d="M10.66 5H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <line x1="1" y1="1" x2="23" y2="23" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }} />
    </svg>
  );
}

function IcoInfo({ size = 20, color = "#8b6fd4" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <circle cx="12" cy="12" r="10" style={{ stroke: color, strokeWidth: 1.9, fill: "none" }} />
      <line x1="12" y1="16" x2="12" y2="12" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }} />
      <circle cx="12" cy="8" r="0.5" style={{ fill: color, stroke: color, strokeWidth: 1.5 }} />
    </svg>
  );
}

function IcoSearch({ size = 16, color = "#8b6fd4" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <circle cx="11" cy="11" r="8" style={{ stroke: color, strokeWidth: 2.2, fill: "none" }} />
      <line x1="21" y1="21" x2="16.65" y2="16.65" style={{ stroke: color, strokeWidth: 2.2, strokeLinecap: "round" }} />
    </svg>
  );
}

function IcoSun({ size = 16, color = "#d97706" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <circle cx="12" cy="12" r="5" style={{ stroke: color, strokeWidth: 2, fill: "none" }} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const r = (Math.PI * deg) / 180;
        return <line key={i} x1={12 + 8 * Math.cos(r)} y1={12 + 8 * Math.sin(r)} x2={12 + 11 * Math.cos(r)} y2={12 + 11 * Math.sin(r)} style={{ stroke: color, strokeWidth: 2, strokeLinecap: "round" }} />;
      })}
    </svg>
  );
}

function IcoMoon({ size = 16, color = "#fff" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" style={{ fill: color, stroke: "none" }} />
    </svg>
  );
}

function IcoFile({ size = 18, color = "#fff" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <polyline points="13 2 13 9 20 9" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }} />
    </svg>
  );
}

function IcoEdit({ size = 15, color = "#8b6fd4" }) {
  return <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} /></svg>;
}
function IcoTrash({ size = 15, color = "#fb7185" }) {
  return <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none"><polyline points="3 6 5 6 21 6" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }} /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} /><path d="M10 11v6M14 11v6" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }} /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} /></svg>;
}
function IcoPlus({ size = 16, color = "#8b6fd4" }) {
  return <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none"><line x1="12" y1="5" x2="12" y2="19" style={{ stroke: color, strokeWidth: 2.2, strokeLinecap: "round" }} /><line x1="5" y1="12" x2="19" y2="12" style={{ stroke: color, strokeWidth: 2.2, strokeLinecap: "round" }} /></svg>;
}
function IcoHash({ size = 16, color = "#8b6fd4" }) {
  return <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none"><line x1="4" y1="9" x2="20" y2="9" style={{ stroke: color, strokeWidth: 2, strokeLinecap: "round" }} /><line x1="4" y1="15" x2="20" y2="15" style={{ stroke: color, strokeWidth: 2, strokeLinecap: "round" }} /><line x1="10" y1="3" x2="8" y2="21" style={{ stroke: color, strokeWidth: 2, strokeLinecap: "round" }} /><line x1="16" y1="3" x2="14" y2="21" style={{ stroke: color, strokeWidth: 2, strokeLinecap: "round" }} /></svg>;
}
function IcoBack({ size = 18, color = "#8b6fd4" }) {
  return <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none"><polyline points="15 18 9 12 15 6" style={{ stroke: color, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" }} /></svg>;
}
function IcoScreen({ size = 20, color = "#8b6fd4" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <rect x="2" y="3" width="20" height="14" rx="2" style={{ stroke: color, strokeWidth: 1.9, fill: "none" }} />
      <line x1="8" y1="21" x2="16" y2="21" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }} />
      <line x1="12" y1="17" x2="12" y2="21" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }} />
    </svg>
  );
}

function IcoSmile({ size = 20, color = "#8b6fd4" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <circle cx="12" cy="12" r="10" style={{ stroke: color, strokeWidth: 1.9, fill: "none" }} />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <circle cx="9" cy="10" r="0.8" style={{ fill: color }} />
      <circle cx="15" cy="10" r="0.8" style={{ fill: color }} />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   BACKGROUND CANVAS
───────────────────────────────────────────────────────── */
function BackgroundCanvas({ dark }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    let t = 0;
    const stars = Array.from({ length: 300 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + 0.2, spd: Math.random() * 0.0001 + 0.00003, op: Math.random() * 0.75 + 0.25, tw: Math.random() * 0.025 + 0.004, twOff: Math.random() * Math.PI * 2 }));
    const NEBULAS = [{ cx: 0.15, cy: 0.25, rx: 0.3, ry: 0.22, h: 260, s: 80 }, { cx: 0.75, cy: 0.6, rx: 0.32, ry: 0.26, h: 200, s: 70 }, { cx: 0.5, cy: 0.55, rx: 0.38, ry: 0.22, h: 300, s: 60 }, { cx: 0.88, cy: 0.18, rx: 0.22, ry: 0.18, h: 240, s: 75 }];
    const shoots = [];
    const shootInt = setInterval(() => shoots.push({ x: Math.random() * W, y: Math.random() * H * 0.45, len: Math.random() * 140 + 60, spd: Math.random() * 9 + 6, angle: Math.PI / 5 + (Math.random() - 0.5) * 0.3, life: 1, decay: Math.random() * 0.016 + 0.01 }), 2600);
    const clouds = Array.from({ length: 7 }, () => ({ x: Math.random(), y: 0.05 + Math.random() * 0.45, w: 0.12 + Math.random() * 0.18, h: 0.04 + Math.random() * 0.06, spd: 0.00004 + Math.random() * 0.00005, op: 0.55 + Math.random() * 0.35, puffs: Array.from({ length: 5 + Math.floor(Math.random() * 4) }, () => ({ ox: (Math.random() - 0.4) * 0.9, oy: (Math.random() - 0.5) * 0.5, rs: 0.4 + Math.random() * 0.7 })) }));
    const draw = () => {
      t += 0.01;
      if (dark) {
        ctx.fillStyle = "#03030a"; ctx.fillRect(0, 0, W, H);
        NEBULAS.forEach((n, i) => { const drift = Math.sin(t * 0.15 + i * 1.4) * 0.022; const cx = (n.cx + drift) * W, cy = n.cy * H, rx = n.rx * W, ry = n.ry * H; const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry)); g.addColorStop(0, `hsla(${n.h},${n.s}%,58%,0.14)`); g.addColorStop(0.5, `hsla(${n.h + 20},${n.s - 10}%,48%,0.06)`); g.addColorStop(1, `hsla(${n.h},${n.s}%,38%,0)`); ctx.save(); ctx.scale(1, ry / rx); ctx.beginPath(); ctx.arc(cx, cy * (rx / ry), rx, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill(); ctx.restore(); });
        stars.forEach((s) => { s.x += s.spd; if (s.x > 1) s.x -= 1; const tw = 0.45 + 0.55 * Math.sin(t * s.tw * 60 + s.twOff); const a = s.op * (0.35 + 0.65 * tw); ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(215,228,255,${a})`; ctx.fill(); });
        for (let i = shoots.length - 1; i >= 0; i--) { const s = shoots[i]; s.x += Math.cos(s.angle) * s.spd; s.y += Math.sin(s.angle) * s.spd; s.life -= s.decay; if (s.life <= 0 || s.x > W || s.y > H) { shoots.splice(i, 1); continue; } const tx = s.x - Math.cos(s.angle) * s.len, ty = s.y - Math.sin(s.angle) * s.len; const g = ctx.createLinearGradient(tx, ty, s.x, s.y); g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(1, `rgba(255,255,255,${s.life * 0.9})`); ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y); ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.stroke(); }
      } else {
        const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, "#2196f3"); sky.addColorStop(0.35, "#64b5f6"); sky.addColorStop(0.7, "#b3e5fc"); sky.addColorStop(1, "#e1f5fe"); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
        const sx = W * 0.8, sy = H * 0.12, sr = Math.min(W, H) * 0.065;
        const glow = ctx.createRadialGradient(sx, sy, sr * 0.3, sx, sy, sr * 4); glow.addColorStop(0, "rgba(255,245,80,0.55)"); glow.addColorStop(0.4, "rgba(255,220,40,0.16)"); glow.addColorStop(1, "rgba(255,200,0,0)"); ctx.beginPath(); ctx.arc(sx, sy, sr * 4, 0, Math.PI * 2); ctx.fillStyle = glow; ctx.fill();
        ctx.save(); ctx.translate(sx, sy);
        for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2 + t * 0.008; const r1 = sr * 1.35, r2 = sr * (1.9 + 0.12 * Math.sin(t * 1.2 + i)); ctx.beginPath(); ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); ctx.strokeStyle = `rgba(255,235,80,${0.4 + 0.2 * Math.sin(t + i)})`; ctx.lineWidth = 2.5; ctx.stroke(); }
        ctx.restore();
        const disk = ctx.createRadialGradient(sx - sr * 0.25, sy - sr * 0.25, 0, sx, sy, sr); disk.addColorStop(0, "#fff9c4"); disk.addColorStop(0.5, "#ffe033"); disk.addColorStop(1, "#ffb700"); ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fillStyle = disk; ctx.fill();
        clouds.forEach((c) => { c.x += c.spd; if (c.x > 1.3) c.x = -0.3; const cx2 = c.x * W, cy2 = c.y * H, rw = c.w * W, rh = c.h * H; c.puffs.forEach((p) => { const px = cx2 + p.ox * rw, py = cy2 + p.oy * rh, pr = p.rs * rh; const cg = ctx.createRadialGradient(px, py - pr * 0.2, 0, px, py, pr * 1.4); cg.addColorStop(0, `rgba(255,255,255,${c.op})`); cg.addColorStop(0.6, `rgba(240,245,255,${c.op * 0.7})`); cg.addColorStop(1, "rgba(220,230,255,0)"); ctx.beginPath(); ctx.arc(px, py, pr * 1.4, 0, Math.PI * 2); ctx.fillStyle = cg; ctx.fill(); }); });
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); clearInterval(shootInt); window.removeEventListener("resize", resize); };
  }, [dark]);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none", display: "block" }} />;
}

/* ─────────────────────────────────────────────────────────
   CALL OVERLAY
───────────────────────────────────────────────────────── */
function CallOverlay({ mode, myName, stompClient, onEnd, onMinimize }) {
  const peersRef = useRef({}); const streamsRef = useRef({}); const [remoteStreams, setRemoteStreams] = useState({}); const [remoteScreenStreams, setRemoteScreenStreams] = useState({}); const localStream = useRef(null); const screenStream = useRef(null); const signalSub = useRef(null); const localRef = useRef(null); const localScreenRef = useRef(null); const screenVideoRefs = useRef({});
  const [muted, setMuted] = useState(false); const [camOff, setCamOff] = useState(false); const [status, setStatus] = useState("Connecting…"); const [secs, setSecs] = useState(0); const [activeSpeaker, setActiveSpeaker] = useState(null); const [localScreenStream, setLocalScreenStream] = useState(null); const [screenSharing, setScreenSharing] = useState(false); const [screenShareRequested, setScreenShareRequested] = useState(false);
  const screenLocalRef = useRef(null);
  const screenStreamRef = useRef(null);
  const screenPeerRef = useRef({});
  const screenSubRef = useRef(null);
  const durTimer = useRef(null); const endTimeout = useRef(null);
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const ICE_CONFIG = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }, { urls: "stun:stun2.l.google.com:19302" }, { urls: "stun:stun3.l.google.com:19302" }, { urls: "stun:stun4.l.google.com:19302" }, { urls: "stun:stun.relay.metered.ca:80" }, { urls: "turn:standard.relay.metered.ca:80", username: "openrelayproject", credential: "openrelayproject" }, { urls: "turn:standard.relay.metered.ca:443", username: "openrelayproject", credential: "openrelayproject" }, { urls: "turn:standard.relay.metered.ca:443?transport=tcp", username: "openrelayproject", credential: "openrelayproject" }], iceTransportPolicy: "all", iceCandidatePoolSize: 10 };
  const publish = (payload) => { if (stompClient?.current?.connected) { stompClient.current.publish({ destination: "/app/call-signal", body: JSON.stringify(payload) }); } };
  const createPeer = (peerId, asInitiator) => {
    if (peersRef.current[peerId]?.pc) return peersRef.current[peerId].pc;
    const pc = new RTCPeerConnection(ICE_CONFIG);
    peersRef.current[peerId] = { pc, makingOffer: false, offerProcessing: false, answerSent: false, pendingCandidates: [], remoteDescSet: false };
    if (localStream.current) { localStream.current.getTracks().forEach(t => pc.addTrack(t, localStream.current)); }
    pc.ontrack = (e) => {
      if (!e.streams[0]) return;
      const isScreen = e.track.label?.toLowerCase().includes("screen") || e.track.contentHint === "detail" || e.track.label?.toLowerCase().includes("display");
      if (isScreen) {
        // Screen share track — keep camera stream untouched
        setRemoteScreenStreams(prev => ({ ...prev, [peerId]: e.streams[0] }));
        return;
      }
      // Camera/mic track
      streamsRef.current[peerId] = e.streams[0];
      setRemoteStreams(prev => ({ ...prev, [peerId]: e.streams[0] }));
      setStatus("Connected");
      if (!durTimer.current) { durTimer.current = setInterval(() => setSecs(s => s + 1), 1000); }
      try { const ctx = new AudioContext(); const src = ctx.createMediaStreamSource(e.streams[0]); const analyser = ctx.createAnalyser(); analyser.fftSize = 256; src.connect(analyser); const data = new Uint8Array(analyser.frequencyBinCount); const check = () => { analyser.getByteFrequencyData(data); const vol = data.reduce((a, b) => a + b, 0) / data.length; if (vol > 18) setActiveSpeaker(peerId); requestAnimationFrame(check); }; check(); } catch (_) {}
    };
    pc.onicecandidate = (e) => { if (e.candidate) { publish({ sender: myName, target: peerId, type: "ICE", callRoom: "channel1", payload: JSON.stringify(e.candidate) }); } };
    pc.oniceconnectionstatechange = () => { if (pc.iceConnectionState === "disconnected") { clearTimeout(endTimeout.current); endTimeout.current = setTimeout(() => { if (["disconnected", "failed"].includes(pc.iceConnectionState)) { removePeer(peerId); } }, 8000); if (asInitiator) pc.restartIce(); } else if (pc.iceConnectionState === "failed") { if (asInitiator) { pc.restartIce(); } else { removePeer(peerId); } } else if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") { clearTimeout(endTimeout.current); } };
    if (asInitiator) { (async () => { try { peersRef.current[peerId].makingOffer = true; const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: mode === "video" }); await pc.setLocalDescription(offer); publish({ sender: myName, target: peerId, type: "OFFER", callRoom: "channel1", payload: JSON.stringify(offer) }); } catch (err) { console.error("createOffer error:", err); } finally { if (peersRef.current[peerId]) peersRef.current[peerId].makingOffer = false; } })(); }
    return pc;
  };
  const removePeer = (peerId) => { peersRef.current[peerId]?.pc?.close(); delete peersRef.current[peerId]; delete streamsRef.current[peerId]; setRemoteStreams(prev => { const n = { ...prev }; delete n[peerId]; return n; }); };
  const handleSignal = async (sig) => {
    if (sig.sender === myName) return;
    if (sig.target && sig.target !== myName) return;
    const peerId = sig.sender;
    if (sig.type === "PEER_JOIN") { const shouldInitiate = myName > peerId; createPeer(peerId, shouldInitiate); if (!shouldInitiate) { publish({ sender: myName, target: peerId, type: "PEER_JOIN", callRoom: "channel1", payload: "" }); } return; }
    if (sig.type === "PEER_LEAVE") { removePeer(peerId); return; }
    if (sig.type === "OFFER") { const peerState = peersRef.current[peerId] || {}; if (peerState.offerProcessing) return; peerState.offerProcessing = true; peerState.answerSent = false; peersRef.current[peerId] = peerState; const pc = createPeer(peerId, false); try { const sdp = JSON.parse(sig.payload); await pc.setRemoteDescription(new RTCSessionDescription(sdp)); peerState.remoteDescSet = true; for (const c of (peerState.pendingCandidates || [])) { try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch (_) {} } peerState.pendingCandidates = []; const answer = await pc.createAnswer(); await pc.setLocalDescription(answer); peerState.answerSent = true; publish({ sender: myName, target: peerId, type: "ANSWER", callRoom: "channel1", payload: JSON.stringify(answer) }); } catch (err) { console.error("OFFER handling error:", err); } finally { peerState.offerProcessing = false; } return; }
    if (sig.type === "ANSWER") { const peerState = peersRef.current[peerId]; if (!peerState?.pc) return; if (peerState.pc.signalingState === "stable") return; try { await peerState.pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(sig.payload))); peerState.remoteDescSet = true; for (const c of (peerState.pendingCandidates || [])) { try { await peerState.pc.addIceCandidate(new RTCIceCandidate(c)); } catch (_) {} } peerState.pendingCandidates = []; } catch (err) { console.error("ANSWER error:", err); } return; }
    if (sig.type === "ICE") { const peerState = peersRef.current[peerId]; if (!peerState?.pc) return; const candidate = JSON.parse(sig.payload); if (peerState.remoteDescSet) { try { await peerState.pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch (_) {} } else { peerState.pendingCandidates = [...(peerState.pendingCandidates || []), candidate]; } return; }
    if (sig.type === "END") { removePeer(peerId); }
  };
  useEffect(() => {
    // Subscribe to screen share signals inside the call overlay
    if (stompClient?.current?.connected) {
      const screenSub = stompClient.current.subscribe("/topic/screen.signal.channel1", async (res) => {
        const sig = JSON.parse(res.body);
        if (sig.sender === myName) return;
        if (sig.target && sig.target !== myName) return;
        if (sig.type === "SCREEN_OFFER") {
          const ICE = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "turn:standard.relay.metered.ca:80", username: "openrelayproject", credential: "openrelayproject" }] };
          const pc = new RTCPeerConnection(ICE);
          screenPeerRef.current[sig.sender] = pc;
          pc.ontrack = (e) => {
            if (e.streams[0]) {
              const screenVid = document.getElementById("screen-share-video");
              if (screenVid) { screenVid.srcObject = e.streams[0]; screenVid.play().catch(() => {}); }
              document.getElementById("screen-share-banner")?.style && (document.getElementById("screen-share-banner").style.display = "flex");
            }
          };
          pc.onicecandidate = (e) => { if (e.candidate && stompClient?.current?.connected) { stompClient.current.publish({ destination: "/app/screen.share", body: JSON.stringify({ sender: myName, target: sig.sender, type: "SCREEN_ICE", roomId: "channel1", payload: JSON.stringify(e.candidate) }) }); } };
          await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(sig.payload)));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          stompClient.current.publish({ destination: "/app/screen.share", body: JSON.stringify({ sender: myName, target: sig.sender, type: "SCREEN_ANSWER", roomId: "channel1", payload: JSON.stringify(answer) }) });
        } else if (sig.type === "SCREEN_ANSWER") {
          const pc = screenPeerRef.current[sig.sender];
          if (pc && pc.signalingState !== "stable") { try { await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(sig.payload))); } catch (_) {} }
        } else if (sig.type === "SCREEN_ICE") {
          const pc = screenPeerRef.current[sig.sender];
          if (pc) { try { await pc.addIceCandidate(new RTCIceCandidate(JSON.parse(sig.payload))); } catch (_) {} }
        } else if (sig.type === "SCREEN_STOP") {
          const banner = document.getElementById("screen-share-banner");
          if (banner) banner.style.display = "none";
          const vid = document.getElementById("screen-share-video");
          if (vid) vid.srcObject = null;
        }
      });
      screenSubRef.current = screenSub;
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) { setStatus("Camera/mic unavailable — use HTTPS or localhost"); return; }
        const stream = await navigator.mediaDevices.getUserMedia(mode === "video" ? { audio: true, video: { width: 1280, height: 720, facingMode: "user" } } : { audio: true, video: false });
        if (!mounted) { stream.getTracks().forEach(t => t.stop()); return; }
        localStream.current = stream;
        if (mode === "video" && localRef.current) { localRef.current.srcObject = stream; localRef.current.play().catch(() => {}); }
        if (stompClient?.current?.connected) {
          signalSub.current = stompClient.current.subscribe("/topic/call-signal", msg => { handleSignal(JSON.parse(msg.body)); });
          publish({ sender: myName, type: "PEER_JOIN", callRoom: "channel1", payload: "" });
          setStatus("Waiting for others…");
        } else {
          setStatus("Not connected — reconnecting…");
          // Retry once after 3 seconds in case STOMP is still connecting
          setTimeout(() => {
            if (stompClient?.current?.connected) {
              signalSub.current = stompClient.current.subscribe("/topic/call-signal", msg => { handleSignal(JSON.parse(msg.body)); });
              publish({ sender: myName, type: "PEER_JOIN", callRoom: "channel1", payload: "" });
              setStatus("Waiting for others…");
            } else {
              setStatus("Not connected to server — check your token");
            }
          }, 3000);
        }
      } catch (err) { if (!mounted) return; setStatus(err.name === "NotAllowedError" ? "Permission denied" : "Error: " + err.message); }
    };
    init();
    return () => {
        mounted = false;
        clearInterval(durTimer.current);
        clearTimeout(endTimeout.current);
        Object.values(peersRef.current).forEach(({ pc }) => pc?.close());
        peersRef.current = {};
        if (localStream.current) { localStream.current.getTracks().forEach(t => t.stop()); localStream.current = null; }
        if (screenStreamRef.current) { screenStreamRef.current.getTracks().forEach(t => t.stop()); screenStreamRef.current = null; }
        Object.values(screenPeerRef.current).forEach(pc => pc?.close());
        screenPeerRef.current = {};
        screenSubRef.current?.unsubscribe();
        signalSub.current?.unsubscribe();
        if (stompClient?.current?.connected) { stompClient.current.publish({ destination: "/app/call-signal", body: JSON.stringify({ sender: myName, type: "PEER_LEAVE", callRoom: "channel1", payload: "" }) }); }
      };
  }, []); // eslint-disable-line
  const videoRefs = useRef({});
  useEffect(() => { Object.entries(remoteStreams).forEach(([peerId, stream]) => { const el = videoRefs.current[peerId]; if (el && el.srcObject !== stream) { el.srcObject = stream; el.play().catch(() => {}); } }); }, [remoteStreams]);
  // ✅ Assign local screen stream to its video element when it becomes available
  useEffect(() => {
    if (screenLocalRef.current && localScreenStream) {
      screenLocalRef.current.srcObject = localScreenStream;
      screenLocalRef.current.play().catch(() => {});
    }
    // ✅ When screen share stops, reattach camera to localRef
    if (!localScreenStream && localRef.current && localStream.current) {
      localRef.current.srcObject = localStream.current;
      localRef.current.play().catch(() => {});
    }
  }, [localScreenStream]);

  // ✅ Deferred getDisplayMedia — keeps call UI mounted during picker
  useEffect(() => {
    if (!screenShareRequested) return;
    setScreenShareRequested(false);
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: "always" }, audio: false });
        screenStreamRef.current = stream;
        setScreenSharing(true);
        setLocalScreenStream(stream);
        if (stompClient?.current?.connected) {
          stompClient.current.publish({
            destination: "/app/screen.start",
            body: JSON.stringify({ sender: myName, type: "SCREEN_START", roomId: "channel1", shareMode: "SCREEN", payload: "" })
          });
        }
        stream.getVideoTracks()[0].onended = () => {
          screenStreamRef.current = null;
          Object.values(screenPeerRef.current).forEach(pc => pc?.close());
          screenPeerRef.current = {};
          setScreenSharing(false);
          setLocalScreenStream(null);
          if (stompClient?.current?.connected) {
            stompClient.current.publish({
              destination: "/app/screen.stop",
              body: JSON.stringify({ sender: myName, type: "SCREEN_STOP", roomId: "channel1", payload: "" })
            });
          }
        };
        Object.keys(peersRef.current).forEach(peerId => {
          const ICE = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "turn:standard.relay.metered.ca:80", username: "openrelayproject", credential: "openrelayproject" }] };
          const pc = new RTCPeerConnection(ICE);
          screenPeerRef.current[peerId] = pc;
          stream.getTracks().forEach(t => pc.addTrack(t, stream));
          pc.onicecandidate = (e) => {
            if (e.candidate && stompClient?.current?.connected) {
              stompClient.current.publish({
                destination: "/app/screen.share",
                body: JSON.stringify({ sender: myName, target: peerId, type: "SCREEN_ICE", roomId: "channel1", payload: JSON.stringify(e.candidate) })
              });
            }
          };
          (async () => {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            stompClient.current.publish({
              destination: "/app/screen.share",
              body: JSON.stringify({ sender: myName, target: peerId, type: "SCREEN_OFFER", roomId: "channel1", payload: JSON.stringify(offer) })
            });
          })();
        });
      } catch (err) {
        if (err.name !== "NotAllowedError") alert("Screen share error: " + err.message);
      }
    })();
  }, [screenShareRequested]); // eslint-disable-line
  useEffect(() => { if (localRef.current && localStream.current && mode === "video") { localRef.current.srcObject = localStream.current; localRef.current.play().catch(() => {}); } }, [mode]);
  const toggleMute = () => { const nowMuted = !muted; localStream.current?.getAudioTracks().forEach(t => { t.enabled = !nowMuted; }); setMuted(nowMuted); };
  const toggleCam = () => { const nowOff = !camOff; localStream.current?.getVideoTracks().forEach(t => { t.enabled = !nowOff; }); setCamOff(nowOff); };
  const peers = Object.keys(remoteStreams);
  const totalParticipants = peers.length + 1;
  const cols = Math.ceil(Math.sqrt(totalParticipants));
  const rows = Math.ceil(totalParticipants / cols);
  const overlayStyle = { position: "fixed", inset: 0, zIndex: 100, fontFamily: "'Plus Jakarta Sans', sans-serif", background: "linear-gradient(135deg, #06030f 0%, #0d0520 40%, #030d1a 100%)", display: "flex", flexDirection: "column", overflow: "hidden" };
  const headerStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, zIndex: 2 };
  const gridStyle = { flex: 1, display: "flex", flexDirection: "column", gap: 8, padding: 12, minHeight: 0, overflow: "hidden" };
  const tileBase = (isActive) => ({ position: "relative", borderRadius: 16, overflow: "hidden", background: "rgba(255,255,255,0.04)", border: isActive ? "2px solid rgba(196,109,255,0.8)" : "1.5px solid rgba(255,255,255,0.07)", boxShadow: isActive ? "0 0 24px rgba(196,109,255,0.25), inset 0 0 0 1px rgba(196,109,255,0.15)" : "none", transition: "border-color 0.3s, box-shadow 0.3s", display: "flex", alignItems: "center", justifyContent: "center" });
  const nameTagStyle = { position: "absolute", bottom: 10, left: 12, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 6 };
  const avatarStyle = { width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#c46dff,#7b8cff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "#fff", boxShadow: "0 0 32px rgba(196,109,255,0.3)" };
  const ctrlBar = { display: "flex", alignItems: "center", justifyContent: "center", gap: 16, padding: "16px 24px", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 };
  const btn = (bg, size = 52) => ({ width: size, height: size, borderRadius: "50%", border: "none", background: bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.4)", transition: "transform 0.12s, opacity 0.12s, box-shadow 0.12s", flexShrink: 0 });
  return (
    <div style={overlayStyle}>
      <style>{`@keyframes callPulse { 0%,100%{opacity:1} 50%{opacity:0.5} } @keyframes speakRing { 0%,100%{box-shadow:0 0 0 0 rgba(196,109,255,0.6)} 50%{box-shadow:0 0 0 8px rgba(196,109,255,0)} } .call-ctrl-btn:hover { transform:scale(1.1) !important; } .call-ctrl-btn:active { transform:scale(0.93) !important; }`}</style>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", animation: "callPulse 2s infinite" }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{mode === "video" ? "📹" : "🔊"} Channel 1</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginLeft: 4 }}>{status === "Connected" || peers.length > 0 ? fmt(secs) : status}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{totalParticipants} participant{totalParticipants !== 1 ? "s" : ""}</span>
          {onMinimize && <button onClick={onMinimize} title="Minimize" style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: "rgba(255,255,255,0.08)", cursor: "pointer", color: "rgba(255,255,255,0.6)", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>↓</button>}
        </div>
      </div>
      {/* Screen share viewer — shown when someone else is sharing */}
      <div id="screen-share-banner" style={{ display: "none", background: "rgba(0,0,0,0.9)", borderBottom: "1px solid rgba(196,109,255,0.3)", padding: "8px 16px", flexDirection: "column", gap: 6, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>🖥️ Screen share active</span>
          <button onClick={() => { const b = document.getElementById("screen-share-banner"); if (b) b.style.display = "none"; }} style={{ marginLeft: "auto", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 6, color: "rgba(255,255,255,0.5)", fontSize: 11, padding: "3px 8px", cursor: "pointer" }}>Hide</button>
        </div>
        <video id="screen-share-video" autoPlay playsInline style={{ width: "100%", maxHeight: 260, borderRadius: 8, background: "#000", objectFit: "contain" }} />
      </div>
      {mode === "video" ? (
        <div style={gridStyle}>
          {localScreenStream ? (
            <>
              {/* Main screen share area */}
              <div style={{ flex: 1, position: "relative", borderRadius: 14, overflow: "hidden", background: "#000", border: "2px solid rgba(196,109,255,0.6)", boxShadow: "0 0 32px rgba(196,109,255,0.2)", minHeight: 0 }}>
                <video ref={screenLocalRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                <div style={{ position: "absolute", top: 10, left: 12, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>🖥️</span><span>{myName} — Screen Share</span>
                </div>
              </div>
              {/* Bottom strip: all camera tiles */}
              <div style={{ display: "flex", gap: 8, height: 120, flexShrink: 0 }}>
                <div style={{ ...tileBase(false), width: 160, height: 120, flexShrink: 0 }}>
                  <video ref={el => { localRef.current = el; if (el && localStream.current && el.srcObject !== localStream.current) { el.srcObject = localStream.current; el.play().catch(() => {}); } }} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: camOff ? "none" : "block", transform: "scaleX(-1)" }} />
                  {camOff && <div style={{ ...avatarStyle, width: 40, height: 40, fontSize: 16 }}>{myName[0]?.toUpperCase()}</div>}
                  <div style={{ ...nameTagStyle, fontSize: 10, padding: "3px 7px" }}>{muted && <span>🔇</span>}<span>{myName} (You)</span></div>
                </div>
                {peers.map(peerId => (
                  <div key={peerId} style={{ ...tileBase(activeSpeaker === peerId), width: 160, height: 120, flexShrink: 0 }}>
                    <video ref={el => { if (el) videoRefs.current[peerId] = el; }} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ ...nameTagStyle, fontSize: 10, padding: "3px 7px" }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: activeSpeaker === peerId ? "#22c55e" : "rgba(255,255,255,0.3)" }} /><span>{peerId}</span></div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Normal grid layout when no screen share */}
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, gap: 8, minHeight: 0 }}>
                <div style={tileBase(false)}>
                  <video ref={el => { localRef.current = el; if (el && localStream.current && el.srcObject !== localStream.current) { el.srcObject = localStream.current; el.play().catch(() => {}); } }} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: camOff ? "none" : "block", transform: "scaleX(-1)" }} />
                  {camOff && <div style={avatarStyle}>{myName[0]?.toUpperCase()}</div>}
                  <div style={nameTagStyle}>{muted && <span style={{ fontSize: 10 }}>🔇</span>}<span>{myName} (You)</span></div>
                </div>
                {peers.map(peerId => (
                  <div key={peerId} style={tileBase(activeSpeaker === peerId)}>
                    <video ref={el => { if (el) videoRefs.current[peerId] = el; }} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={nameTagStyle}><span style={{ width: 6, height: 6, borderRadius: "50%", background: activeSpeaker === peerId ? "#22c55e" : "rgba(255,255,255,0.3)", transition: "background 0.2s" }} /><span>{peerId}</span></div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div style={{ ...gridStyle }}>
          <div style={tileBase(false)}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{ ...avatarStyle, animation: "none" }}>{myName[0]?.toUpperCase()}</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{myName}</span>
              <span style={{ fontSize: 11, color: muted ? "#fb7185" : "#22c55e" }}>{muted ? "🔇 Muted" : "🎙 Speaking"}</span>
            </div>
          </div>
          {peers.map(peerId => (
            <div key={peerId} style={tileBase(activeSpeaker === peerId)}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ ...avatarStyle, animation: activeSpeaker === peerId ? "speakRing 1s infinite" : "none", background: `linear-gradient(135deg, ${["#c46dff","#06b6d4","#ec4899","#059669","#f59e0b"][peerId.charCodeAt(0) % 5]}, #7b8cff)` }}>{peerId[0]?.toUpperCase()}</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{peerId}</span>
                <span style={{ fontSize: 11, color: activeSpeaker === peerId ? "#22c55e" : "rgba(255,255,255,0.3)" }}>{activeSpeaker === peerId ? "🎙 Speaking" : "○ Silent"}</span>
              </div>
              <audio ref={el => { if (el && streamsRef.current[peerId] && el.srcObject !== streamsRef.current[peerId]) { el.srcObject = streamsRef.current[peerId]; el.play().catch(() => {}); } }} autoPlay style={{ display: "none" }} />
            </div>
          ))}
        </div>
      )}
      <div style={ctrlBar}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <button className="call-ctrl-btn" style={btn(muted ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.12)")} onClick={toggleMute}>{muted ? <IcoMicOff color="#1a0533" /> : <IcoMic color="#fff" />}</button>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{muted ? "Unmute" : "Mute"}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <button className="call-ctrl-btn" style={{ ...btn("#ef4444", 64), boxShadow: "0 4px 24px rgba(239,68,68,0.45)" }} onClick={() => onEnd(secs)}><IcoPhoneOff color="#fff" /></button>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Leave</span>
        </div>
        {mode === "video" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <button className="call-ctrl-btn" style={btn(camOff ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.12)")} onClick={toggleCam}>{camOff ? <IcoVideo color="#1a0533" /> : <IcoVideoOff color="#fff" />}</button>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{camOff ? "Cam on" : "Cam off"}</span>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <button className="call-ctrl-btn" style={btn(screenSharing ? "rgba(196,109,255,0.9)" : "rgba(255,255,255,0.12)")} onClick={() => {
            if (screenSharing) {
              if (screenStreamRef.current) { screenStreamRef.current.getTracks().forEach(t => t.stop()); screenStreamRef.current = null; }
              Object.values(screenPeerRef.current).forEach(pc => pc?.close());
              screenPeerRef.current = {};
              setScreenSharing(false);
              setLocalScreenStream(null);
              if (stompClient?.current?.connected) { stompClient.current.publish({ destination: "/app/screen.stop", body: JSON.stringify({ sender: myName, type: "SCREEN_STOP", roomId: "channel1", payload: "" }) }); }
            } else {
              // ✅ Set flag — useEffect handles getDisplayMedia to prevent navigation
              setScreenShareRequested(true);
            }
          }}><IcoScreen color={screenSharing ? "#1a0533" : "#fff"} size={20} /></button>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{screenSharing ? "Stop share" : "Share screen"}</span>
        </div>
        <div style={{ marginLeft: "auto", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "6px 16px", fontSize: 12, color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />{totalParticipants} in call
        </div>
      </div>
    </div>
  );
}

const EMOJIS = ["😀","😂","😍","😎","😭","😅","🤔","😤","🥰","😇","🤣","😊","😋","😜","🤩","🥳","😏","😒","😔","😳","👍","👎","👏","🙌","🤝","🙏","👋","💪","🤜","✌️","❤️","🧡","💛","💚","💙","💜","🖤","💔","💕","💯","🔥","⭐","✨","🎉","🎊","🎁","🏆","🎯","💡","🚀","😈","👻","💀","🤖","👽","🐶","🐱","🐭","🦊","🐻","🍕","🍔","🍟","🌮","🍜","🍣","🍩","🍪","☕","🧋","⚽","🏀","🎮","🎵","🎬","📸","💻","📱","🌈","🌙"];
const QUICK_REACTIONS = ["❤️","😂","😮","😢","😡","👍","👎","🔥"];

function ReactionPicker({ onSelect, style }) {
  return (
    <div style={{ position: "absolute", zIndex: 60, background: "var(--glass2)", border: "1px solid var(--glass-border)", borderRadius: 999, padding: "4px 8px", display: "flex", gap: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.35)", backdropFilter: "blur(20px)", ...style }}>
      {QUICK_REACTIONS.map((e, i) => <button key={i} onClick={() => onSelect(e)} style={{ width: 32, height: 32, border: "none", borderRadius: "50%", background: "transparent", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.1s" }} onMouseEnter={ev => ev.currentTarget.style.transform = "scale(1.3)"} onMouseLeave={ev => ev.currentTarget.style.transform = "scale(1)"}>{e}</button>)}
    </div>
  );
}

function EmojiPicker({ onSelect, emojiRef }) {
  return (
    <div ref={emojiRef} style={{ position: "absolute", bottom: 70, right: 20, zIndex: 50, width: 300, maxHeight: 220, overflowY: "auto", background: "var(--glass2)", border: "1px solid var(--glass-border)", borderRadius: 16, padding: 10, display: "flex", flexWrap: "wrap", gap: 2, boxShadow: "0 8px 32px rgba(0,0,0,0.35)", backdropFilter: "blur(20px)" }}>
      {EMOJIS.map((e, i) => <button key={i} onClick={() => onSelect(e)} style={{ width: 36, height: 36, border: "none", borderRadius: 8, background: "transparent", cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.1s" }} onMouseEnter={ev => ev.currentTarget.style.background = "var(--accent-soft)"} onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>{e}</button>)}
    </div>
  );
}

function CreateRoomModal({ onClose, onCreate }) {
  const [step, setStep] = useState("template");
  const [template, setTemplate] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState("public");
  const templates = [
    { id: "own", emoji: "🌟", label: "Create My Own", desc: "Start fresh with a blank room", color: "linear-gradient(135deg,#7c3aed,#a855f7)" },
    { id: "gaming", emoji: "🎮", label: "Gaming", desc: "A place for your gaming squad", color: "linear-gradient(135deg,#059669,#10b981)" },
    { id: "friends", emoji: "💖", label: "Friends", desc: "Hang out with your closest friends", color: "linear-gradient(135deg,#db2777,#ec4899)" },
    { id: "study", emoji: "📚", label: "Study Group", desc: "Collaborate and learn together", color: "linear-gradient(135deg,#d97706,#f59e0b)" },
    { id: "school", emoji: "🏫", label: "School Club", desc: "Organize your club or class", color: "linear-gradient(135deg,#2563eb,#3b82f6)" },
    { id: "sports", emoji: "⚽", label: "Sports", desc: "Cheer on your team together", color: "linear-gradient(135deg,#16a34a,#22c55e)" },
    { id: "music", emoji: "🎵", label: "Music", desc: "Share beats and discover new tracks", color: "linear-gradient(135deg,#7c3aed,#06b6d4)" },
    { id: "art", emoji: "🎨", label: "Art & Creative", desc: "A canvas for creators", color: "linear-gradient(135deg,#ea580c,#f97316)" },
    { id: "tech", emoji: "💻", label: "Tech & Dev", desc: "Build things and share ideas", color: "linear-gradient(135deg,#0891b2,#06b6d4)" },
    { id: "anime", emoji: "⛩️", label: "Anime & Manga", desc: "Discuss your favorite series", color: "linear-gradient(135deg,#9333ea,#ec4899)" },
    { id: "travel", emoji: "✈️", label: "Travel", desc: "Share adventures around the world", color: "linear-gradient(135deg,#0284c7,#38bdf8)" },
    { id: "food", emoji: "🍜", label: "Food & Cooking", desc: "Recipes, restaurants, and more", color: "linear-gradient(135deg,#b45309,#f59e0b)" },
  ];
  const selectedTemplate = templates.find(t => t.id === template);
  const handleTemplateSelect = (t) => { setTemplate(t.id); setRoomName(t.id === "own" ? "" : t.label + " Room"); setStep("configure"); };
  const handleCreate = () => { if (!roomName.trim()) return; onCreate({ name: roomName.trim(), template, emoji: selectedTemplate?.emoji || "🌟", type: roomType }); onClose(); };
  const overlay = { position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.15s", padding: 20 };
  const modal = { width: "100%", maxWidth: 460, background: "var(--glass2)", borderRadius: 20, border: "1px solid var(--glass-border)", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", overflow: "hidden", animation: "scalePop 0.2s cubic-bezier(0.34,1.56,0.64,1)" };
  const inputStyle = { width: "100%", background: "var(--input-bg)", border: "1.5px solid var(--glass-border)", borderRadius: 10, padding: "11px 14px", fontFamily: "inherit", fontSize: 14, color: "var(--text)", outline: "none" };
  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        <div style={{ padding: "24px 24px 0", textAlign: "center", position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "var(--btn-bg)", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", color: "var(--text-muted)", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          {step === "template" ? (
            <><div style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>Create Your Room</div><div style={{ fontSize: 13, color: "var(--text-sub)", lineHeight: 1.6, marginBottom: 20 }}>Your room is where you and your friends hang out.<br />Make yours and start talking.</div></>
          ) : (
            <><button onClick={() => setStep("template")} style={{ position: "absolute", top: 16, left: 16, background: "var(--btn-bg)", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", color: "var(--text-muted)", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button><div style={{ fontSize: 32, marginBottom: 8 }}>{selectedTemplate?.emoji}</div><div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>{selectedTemplate?.label}</div><div style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 20 }}>{selectedTemplate?.desc}</div></>
          )}
        </div>
        {step === "template" ? (
          <div style={{ maxHeight: 380, overflowY: "auto", padding: "0 16px 16px" }}>
            <div onClick={() => handleTemplateSelect(templates[0])} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 12, background: "var(--accent-soft)", border: "1.5px solid var(--accent)", cursor: "pointer", marginBottom: 16, transition: "transform 0.15s" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.01)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 40, height: 40, borderRadius: 12, background: templates[0].color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{templates[0].emoji}</div><div><div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{templates[0].label}</div><div style={{ fontSize: 12, color: "var(--text-sub)" }}>{templates[0].desc}</div></div></div>
              <span style={{ color: "var(--accent)", fontSize: 18 }}>›</span>
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8, paddingLeft: 4 }}>START FROM A TEMPLATE</div>
            {templates.slice(1).map(t => (
              <div key={t.id} onClick={() => handleTemplateSelect(t)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 10, cursor: "pointer", transition: "background 0.15s", marginBottom: 2 }} onMouseEnter={e => e.currentTarget.style.background = "var(--glass-border)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 36, height: 36, borderRadius: 10, background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{t.emoji}</div><div><div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{t.label}</div><div style={{ fontSize: 11, color: "var(--text-sub)" }}>{t.desc}</div></div></div>
                <span style={{ color: "var(--text-muted)", fontSize: 18 }}>›</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "0 24px 24px" }}>
            <div style={{ marginBottom: 16 }}><div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Room Name</div><input style={inputStyle} value={roomName} onChange={e => setRoomName(e.target.value)} placeholder="Enter room name" autoFocus onKeyDown={e => e.key === "Enter" && handleCreate()} /></div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Room Type</div>
              {[{ id: "public", emoji: "🌐", label: "Public", desc: "Anyone can join this room" }, { id: "private", emoji: "🔒", label: "Private", desc: "Only invited members can join" }].map(rt => (
                <div key={rt.id} onClick={() => setRoomType(rt.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${roomType === rt.id ? "var(--accent)" : "var(--glass-border)"}`, background: roomType === rt.id ? "var(--accent-soft)" : "transparent", cursor: "pointer", marginBottom: 8, transition: "all 0.15s" }}>
                  <div style={{ fontSize: 22 }}>{rt.emoji}</div><div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{rt.label}</div><div style={{ fontSize: 11, color: "var(--text-sub)" }}>{rt.desc}</div></div>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${roomType === rt.id ? "var(--accent)" : "var(--glass-border)"}`, background: roomType === rt.id ? "var(--accent)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>{roomType === rt.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}</div>
                </div>
              ))}
            </div>
            <button onClick={handleCreate} disabled={!roomName.trim()} style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: roomName.trim() ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "var(--btn-bg)", color: roomName.trim() ? "#fff" : "var(--text-muted)", fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: roomName.trim() ? "pointer" : "not-allowed", transition: "all 0.2s", boxShadow: roomName.trim() ? "0 4px 20px rgba(124,58,237,0.35)" : "none" }}>Create Room ✨</button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileModal({ onClose, authToken, user, onUpdate }) {
  const [displayName, setDisplayName] = useState(user?.displayName || user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);
  const save = async () => { setSaving(true); try { const res = await fetch(`http://192.168.100.127:8080/auth/profile`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` }, body: JSON.stringify({ displayName, bio }) }); const data = await res.json(); onUpdate(data); } catch { } setSaving(false); onClose(); };
  const uploadAvatar = async (file) => { const fd = new FormData(); fd.append("file", file); try { const res = await fetch(`http://192.168.100.127:8080/auth/profile/avatar`, { method: "POST", headers: { Authorization: `Bearer ${authToken}` }, body: fd }); const data = await res.json(); onUpdate({ avatarUrl: data.avatarUrl }); } catch { } };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: 400, background: "var(--glass2)", border: "1px solid var(--glass-border)", borderRadius: 22, padding: "36px 32px", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>Edit Profile</div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ position: "relative", cursor: "pointer" }} onClick={() => fileRef.current.click()}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--bubble-me)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: "#fff", overflow: "hidden" }}>
              {user?.avatarUrl ? <img src={user.avatarUrl.startsWith("http") ? user.avatarUrl : `http://192.168.100.127:8080${user.avatarUrl}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /> : (user?.username || "?")[0].toUpperCase()}
            </div>
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700 }}>+</div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) uploadAvatar(e.target.files[0]); }} />
        </div>
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>Display Name</label>
        <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your display name" style={{ width: "100%", background: "var(--input-bg)", border: "1.5px solid var(--glass-border)", borderRadius: 12, padding: "11px 14px", fontFamily: "inherit", fontSize: 14, color: "var(--text)", outline: "none", marginBottom: 14 }} />
        <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>Bio</label>
        <input value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell others about yourself" style={{ width: "100%", background: "var(--input-bg)", border: "1.5px solid var(--glass-border)", borderRadius: 12, padding: "11px 14px", fontFamily: "inherit", fontSize: 14, color: "var(--text)", outline: "none", marginBottom: 20 }} />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 12, border: "1.5px solid var(--glass-border)", background: "transparent", color: "var(--text-sub)", fontFamily: "inherit", fontSize: 14, cursor: "pointer" }}>Cancel</button>
          <button onClick={save} disabled={saving} style={{ flex: 1, padding: "11px", borderRadius: 12, border: "none", background: "var(--bubble-me)", color: "#fff", fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{saving ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}


function SettingsModal({ onClose, tab, setTab, dark, setDark, theme, setTheme, authToken, authUser, myProfile, onUpdateProfile, fontSize, setFontSize, notifSound, setNotifSound, compactMode, setCompactMode, privacyDm, setPrivacyDm, privacyFriend, setPrivacyFriend, onLogout, onEndCall, chatTheme, setChatTheme }) {
  const [currentPw, setCurrentPw] = useState(""); const [newPw, setNewPw] = useState(""); const [confirmPw, setConfirmPw] = useState(""); const [pwMsg, setPwMsg] = useState(null); const [emailMsg, setEmailMsg] = useState(null); const [email, setEmail] = useState(myProfile?.email || ""); const [displayName, setDisplayName] = useState(myProfile?.displayName || ""); const [bio, setBio] = useState(myProfile?.bio || ""); const [profileMsg, setProfileMsg] = useState(null); const fileRef = useRef(null);
  const BASE = "http://192.168.100.127:8080";
  const tabs = [{ id: "account", label: "👤 My Account", group: "USER SETTINGS" }, { id: "profile", label: "🪪 Profile", group: "USER SETTINGS" }, { id: "privacy", label: "🔒 Privacy & Safety", group: "USER SETTINGS" }, { id: "appearance", label: "🎨 Appearance", group: "APP SETTINGS" }, { id: "notifications", label: "🔔 Notifications", group: "APP SETTINGS" }, { id: "danger", label: "⚠️ Danger Zone", group: "ACCOUNT" }];
  const groups = [...new Set(tabs.map(t => t.group))];
  const [verifyCode, setVerifyCode] = useState(""); const [codeSent, setCodeSent] = useState(false); const [sendingCode, setSendingCode] = useState(false);
  const sendCode = async () => { setSendingCode(true); setPwMsg(null); try { const res = await fetch(`${BASE}/auth/send-code`, { method: "POST", headers: { Authorization: `Bearer ${authToken}` } }); const data = await res.json(); if (!res.ok) { setPwMsg({ ok: false, text: data.error }); setSendingCode(false); return; } setCodeSent(true); setPwMsg({ ok: true, text: data.message }); } catch { setPwMsg({ ok: false, text: "Server error" }); } setSendingCode(false); };
  const changePassword = async () => { if (!verifyCode || !newPw || !confirmPw) { setPwMsg({ ok: false, text: "Fill in all fields" }); return; } if (newPw !== confirmPw) { setPwMsg({ ok: false, text: "New passwords do not match" }); return; } if (newPw.length < 6) { setPwMsg({ ok: false, text: "Password must be at least 6 characters" }); return; } try { const res = await fetch(`${BASE}/auth/change-password`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` }, body: JSON.stringify({ code: verifyCode, newPassword: newPw }) }); const data = await res.json(); if (!res.ok) { setPwMsg({ ok: false, text: data.error }); return; } setPwMsg({ ok: true, text: "Password changed successfully!" }); setVerifyCode(""); setNewPw(""); setConfirmPw(""); setCodeSent(false); } catch { setPwMsg({ ok: false, text: "Server error" }); } };
  const saveEmail = async () => { setEmailMsg(null); if (!email.trim()) { setEmailMsg({ ok: false, text: "Email cannot be empty." }); return; } if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailMsg({ ok: false, text: "Please enter a valid email address." }); return; } try { const res = await fetch(`${BASE}/auth/update-email`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` }, body: JSON.stringify({ newEmail: email }) }); if (!res.ok) { setEmailMsg({ ok: false, text: "Failed to update email" }); return; } setEmailMsg({ ok: true, text: "Email updated!" }); onUpdateProfile({ email }); } catch { setEmailMsg({ ok: false, text: "Server error" }); } };
  const saveProfile = async () => { try { const res = await fetch(`${BASE}/auth/profile`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` }, body: JSON.stringify({ displayName, bio }) }); const data = await res.json(); onUpdateProfile(data); setProfileMsg({ ok: true, text: "Profile saved!" }); } catch { setProfileMsg({ ok: false, text: "Server error" }); } };
  const uploadAvatar = async (file) => { const fd = new FormData(); fd.append("file", file); try { const res = await fetch(`${BASE}/auth/profile/avatar`, { method: "POST", headers: { Authorization: `Bearer ${authToken}` }, body: fd }); const data = await res.json(); onUpdateProfile({ avatarUrl: data.avatarUrl }); } catch { } };
  const inputStyle = { width: "100%", background: "var(--input-bg)", border: "1.5px solid var(--glass-border)", borderRadius: 10, padding: "10px 14px", fontFamily: "inherit", fontSize: 14, color: "var(--text)", outline: "none", marginBottom: 10 };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 };
  const sectionTitle = { fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4, marginTop: 24 };
  const sectionDesc = { fontSize: 13, color: "var(--text-sub)", marginBottom: 16 };
  const msgStyle = (ok) => ({ fontSize: 13, padding: "8px 12px", borderRadius: 8, marginBottom: 12, background: ok ? "rgba(74,222,128,0.12)" : "rgba(251,113,133,0.12)", color: ok ? "#4ade80" : "#fb7185", border: `1px solid ${ok ? "rgba(74,222,128,0.3)" : "rgba(251,113,133,0.3)"}` });
  const saveBtn = { padding: "10px 22px", borderRadius: 10, border: "none", background: "var(--bubble-me)", color: "#fff", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" };
  const toggleStyle = (on) => ({ width: 44, height: 24, borderRadius: 999, border: "none", cursor: "pointer", position: "relative", background: on ? "var(--accent)" : "var(--btn-bg)", transition: "background 0.2s", flexShrink: 0 });
  const thumbStyle = (on) => ({ position: "absolute", top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" });
  const Toggle = ({ on, onChange }) => (<button style={toggleStyle(on)} onClick={() => onChange(!on)}><div style={thumbStyle(on)} /></button>);
  const Row = ({ label, desc, children }) => (<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--divider)", gap: 16 }}><div><div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{label}</div>{desc && <div style={{ fontSize: 12, color: "var(--text-sub)", marginTop: 3 }}>{desc}</div>}</div>{children}</div>);

  const renderContent = () => {
    if (tab === "account-email") return (<div><div style={sectionTitle}>Update Email Address</div><p style={sectionDesc}>This email is used for password reset verification codes.</p><div style={{ background: "var(--glass2)", borderRadius: 10, padding: 16 }}>{emailMsg && <div style={msgStyle(emailMsg.ok)}>{emailMsg.ok ? "✅" : "⚠️"} {emailMsg.text}</div>}<label style={labelStyle}>New Email Address</label><input type="email" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" /><div style={{ display: "flex", gap: 10, marginTop: 4 }}><button style={saveBtn} onClick={async () => { setEmailMsg(null); if (!email.trim()) { setEmailMsg({ ok: false, text: "Email cannot be empty." }); return; } if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailMsg({ ok: false, text: "Please enter a valid email address." }); return; } try { const res = await fetch(`${BASE}/auth/update-email`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` }, body: JSON.stringify({ newEmail: email }) }); const data = await res.json().catch(() => ({})); if (!res.ok) { setEmailMsg({ ok: false, text: data.error || data.message || `Error ${res.status}` }); return; } setEmailMsg({ ok: true, text: "Email updated successfully!" }); onUpdateProfile({ email }); setTimeout(() => setTab("account"), 1500); } catch { setEmailMsg({ ok: false, text: "Network error. Check your connection." }); } }}>Save Email</button><button style={{ ...saveBtn, background: "var(--btn-bg)", color: "var(--text-sub)" }} onClick={() => setTab("account")}>Cancel</button></div></div></div>);
    if (tab === "account-username") return (<div><div style={sectionTitle}>Change Username</div><p style={sectionDesc}>Choose a new unique username. You will be issued a new login token.</p><div style={{ background: "var(--glass2)", borderRadius: 10, padding: 16 }}>{pwMsg && <div style={msgStyle(pwMsg.ok)}>{pwMsg.ok ? "✅" : "⚠️"} {pwMsg.text}</div>}<label style={labelStyle}>New Username</label><input style={inputStyle} value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="Enter new username (3–32 chars, letters/numbers/_/.)" /><div style={{ display: "flex", gap: 10, marginTop: 4 }}><button style={saveBtn} onClick={async () => { setPwMsg(null); try { const res = await fetch(`${BASE}/auth/change-username`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` }, body: JSON.stringify({ newUsername: currentPw }) }); const data = await res.json(); if (!res.ok) { setPwMsg({ ok: false, text: data.error }); return; } setPwMsg({ ok: true, text: "Username changed! Please log in again." }); setTimeout(() => { onEndCall?.(); onLogout(); }, 1500); } catch { setPwMsg({ ok: false, text: "Server error" }); } }}>Save Username</button><button style={{ ...saveBtn, background: "var(--btn-bg)", color: "var(--text-sub)" }} onClick={() => setTab("account")}>Cancel</button></div></div></div>);
    if (tab === "account") return (<div><div style={{ background: "var(--bubble-me)", borderRadius: 12, padding: "40px 20px 20px", marginBottom: 24, position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(196,109,255,0.8),rgba(123,140,255,0.8))" }} /><div style={{ position: "relative", display: "flex", alignItems: "flex-end", gap: 16 }}><div style={{ position: "relative", cursor: "pointer" }} onClick={() => fileRef.current?.click()}><div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "4px solid var(--glass2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#fff", overflow: "hidden" }}>{myProfile?.avatarUrl ? <img src={myProfile.avatarUrl.startsWith("http") ? myProfile.avatarUrl : `http://192.168.100.127:8080${myProfile.avatarUrl}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : authUser?.[0]?.toUpperCase()}</div><div style={{ position: "absolute", bottom: 2, right: 2, width: 22, height: 22, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, border: "2px solid var(--glass2)" }}>✏️</div></div><input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) uploadAvatar(e.target.files[0]); }} /><div><div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{myProfile?.displayName || authUser}</div><div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>@{authUser}</div></div></div></div><div style={sectionTitle}>Account Information</div><div style={{ background: "var(--glass2)", borderRadius: 10, padding: "0 16px", marginBottom: 20 }}><Row label="Username" desc={`@${authUser}`}><button onClick={() => setTab("account-username")} style={{ ...saveBtn, fontSize: 12, padding: "6px 14px" }}>Change</button></Row><Row label="Email" desc={myProfile?.email || "No email set"}><button onClick={() => setTab("account-email")} style={{ ...saveBtn, fontSize: 12, padding: "6px 14px" }}>Edit</button></Row></div><div style={sectionTitle}>Change Password</div><div style={{ background: "var(--glass2)", borderRadius: 10, padding: 16, marginBottom: 20 }}>{pwMsg && <div style={msgStyle(pwMsg.ok)}>{pwMsg.ok ? "✅" : "⚠️"} {pwMsg.text}</div>}{!codeSent ? (<><div style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 14, lineHeight: 1.6 }}>A 6-digit verification code will be sent to your registered email address.{!myProfile?.email && <span style={{ color: "#fb7185" }}> You need to add an email address first.</span>}</div><button style={{ ...saveBtn, opacity: myProfile?.email ? 1 : 0.5, cursor: myProfile?.email ? "pointer" : "not-allowed" }} onClick={myProfile?.email ? sendCode : undefined} disabled={sendingCode}>{sendingCode ? "Sending…" : "Send Verification Code"}</button></>) : (<><label style={labelStyle}>Verification Code</label><input style={inputStyle} value={verifyCode} onChange={e => setVerifyCode(e.target.value)} placeholder="Enter 6-digit code" maxLength={6} /><label style={labelStyle}>New Password</label><input type="password" style={inputStyle} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Enter new password" /><label style={labelStyle}>Confirm New Password</label><input type="password" style={{ ...inputStyle, marginBottom: 14 }} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Confirm new password" /><div style={{ display: "flex", gap: 10 }}><button style={saveBtn} onClick={changePassword}>Change Password</button><button style={{ ...saveBtn, background: "var(--btn-bg)", color: "var(--text-sub)" }} onClick={() => { setCodeSent(false); setPwMsg(null); setVerifyCode(""); }}>Resend Code</button></div></>)}</div><div style={sectionTitle}>Email Address</div><div style={{ background: "var(--glass2)", borderRadius: 10, padding: 16 }}>{emailMsg && <div style={msgStyle(emailMsg.ok)}>{emailMsg.ok ? "✅" : "⚠️"} {emailMsg.text}</div>}<label style={labelStyle}>Email</label><input type="email" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" /><button style={saveBtn} onClick={saveEmail}>Save Email</button></div></div>);
    if (tab === "profile") return (<div><div style={sectionTitle}>Display Name</div><p style={sectionDesc}>This is how others see you in chat.</p>{profileMsg && <div style={msgStyle(profileMsg.ok)}>{profileMsg.ok ? "✅" : "⚠️"} {profileMsg.text}</div>}<div style={{ background: "var(--glass2)", borderRadius: 10, padding: 16, marginBottom: 20 }}><label style={labelStyle}>Display Name</label><input style={inputStyle} value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your display name" /><label style={labelStyle}>Bio</label><textarea style={{ ...inputStyle, height: 80, resize: "none" }} value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell others about yourself" /><button style={saveBtn} onClick={saveProfile}>Save Profile</button></div><div style={sectionTitle}>Avatar</div><div style={{ background: "var(--glass2)", borderRadius: 10, padding: 16, display: "flex", alignItems: "center", gap: 16 }}><div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--bubble-me)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: "#fff", overflow: "hidden", flexShrink: 0 }}>{myProfile?.avatarUrl ? <img src={myProfile.avatarUrl.startsWith("http") ? myProfile.avatarUrl : `http://192.168.100.127:8080${myProfile.avatarUrl}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : authUser?.[0]?.toUpperCase()}</div><div><div style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 10 }}>JPG, GIF or PNG. Max size 8MB.</div><div style={{ display: "flex", gap: 8 }}><button style={saveBtn} onClick={() => fileRef.current?.click()}>Change Avatar</button><input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) uploadAvatar(e.target.files[0]); }} /></div></div></div></div>);
    if (tab === "appearance") return (<div><div style={sectionTitle}>Planet Theme</div><p style={sectionDesc}>Each planet transforms the entire UI — colors, accents, and atmosphere.</p><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>{[{id:"galaxy",emoji:"🌌",label:"Galaxy"},{id:"mars",emoji:"🔴",label:"Mars"},{id:"neptune",emoji:"🔵",label:"Neptune"},{id:"venus",emoji:"🌕",label:"Venus"},{id:"blackhole",emoji:"⚫",label:"Black Hole"},{id:"nebula",emoji:"💜",label:"Nebula"}].map(th => (<button key={th.id} onClick={() => { setTheme(th.id); localStorage.setItem("theme", th.id); }} style={{ padding: "14px 8px", borderRadius: 12, border: `2px solid ${theme === th.id ? "var(--accent)" : "var(--glass-border)"}`, background: theme === th.id ? "var(--accent-soft)" : "var(--glass2)", color: "var(--text)", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transition: "all 0.15s" }}><span style={{ fontSize: 26 }}>{th.emoji}</span><span>{th.label}</span></button>))}</div>
      <div style={sectionTitle}>Font Size</div><p style={sectionDesc}>Scale the chat text to your preference.</p><div style={{ display: "flex", gap: 8, marginBottom: 24 }}>{["small", "medium", "large"].map(s => (<button key={s} onClick={() => { setFontSize(s); localStorage.setItem("fontSize", s); }} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `2px solid ${fontSize === s ? "var(--accent)" : "var(--glass-border)"}`, background: fontSize === s ? "var(--accent-soft)" : "var(--glass2)", color: "var(--text)", fontFamily: "inherit", fontSize: s === "small" ? 12 : s === "medium" ? 14 : 16, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{s}</button>))}</div><div style={{ background: "var(--glass2)", borderRadius: 10, padding: "0 16px" }}><Row label="Compact Mode" desc="Reduce spacing between messages"><Toggle on={compactMode} onChange={setCompactMode} /></Row></div></div>);
    if (tab === "notifications") return (<div><div style={sectionTitle}>Notifications</div><p style={sectionDesc}>Control how and when you get notified.</p><div style={{ background: "var(--glass2)", borderRadius: 10, padding: "0 16px" }}><Row label="Message Sound" desc="Play a sound when a message arrives"><Toggle on={notifSound} onChange={setNotifSound} /></Row><Row label="Desktop Notifications" desc="Show notifications outside the browser"><button style={{ ...saveBtn, fontSize: 12, padding: "6px 14px" }} onClick={() => Notification.requestPermission()}>{Notification.permission === "granted" ? "✅ Enabled" : "Enable"}</button></Row></div></div>);
    if (tab === "privacy") return (<div><div style={sectionTitle}>Privacy & Safety</div><p style={sectionDesc}>Control who can interact with you.</p><div style={{ background: "var(--glass2)", borderRadius: 10, padding: "0 16px", marginBottom: 20 }}><Row label="Who can DM me" desc="Control who can send you direct messages"><select value={privacyDm} onChange={e => setPrivacyDm(e.target.value)} style={{ background: "var(--input-bg)", border: "1.5px solid var(--glass-border)", borderRadius: 8, padding: "6px 12px", color: "var(--text)", fontFamily: "inherit", fontSize: 13, outline: "none" }}><option value="everyone">Everyone</option><option value="friends">Friends only</option><option value="nobody">Nobody</option></select></Row><Row label="Who can send friend requests" desc="Control who can add you as a friend"><select value={privacyFriend} onChange={e => setPrivacyFriend(e.target.value)} style={{ background: "var(--input-bg)", border: "1.5px solid var(--glass-border)", borderRadius: 8, padding: "6px 12px", color: "var(--text)", fontFamily: "inherit", fontSize: 13, outline: "none" }}><option value="everyone">Everyone</option><option value="nobody">Nobody</option></select></Row></div><div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>⚠️ Privacy settings are stored locally and enforced on the frontend only. Full server-side enforcement coming soon.</div></div>);
    if (tab === "danger") return (<div><div style={{ ...sectionTitle, color: "#fb7185" }}>⚠️ Danger Zone</div><p style={sectionDesc}>These actions are irreversible. Please be careful.</p><div style={{ background: "rgba(251,113,133,0.07)", border: "1px solid rgba(251,113,133,0.25)", borderRadius: 10, padding: 20, marginBottom: 16 }}><div style={{ fontSize: 15, fontWeight: 700, color: "#fb7185", marginBottom: 6 }}>Log Out</div><div style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 14 }}>Sign out of your account on this device.</div><button onClick={() => { onEndCall?.(); onLogout(); }} style={{ padding: "10px 22px", borderRadius: 10, border: "1px solid rgba(251,113,133,0.3)", background: "rgba(251,113,133,0.15)", color: "#fb7185", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Log Out</button></div><div style={{ background: "rgba(251,113,133,0.07)", border: "1px solid rgba(251,113,133,0.25)", borderRadius: 10, padding: 20 }}><div style={{ fontSize: 15, fontWeight: 700, color: "#fb7185", marginBottom: 6 }}>Delete Account</div><div style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 14 }}>Permanently delete your account and all your data. This cannot be undone.</div><button style={{ padding: "10px 22px", borderRadius: 10, border: "1px solid rgba(251,113,133,0.4)", background: "#fb7185", color: "#fff", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }} onClick={async () => { if (!window.confirm("Permanently delete your account? This CANNOT be undone.")) return; const confirmed = window.prompt('Type "DELETE" to confirm:'); if (confirmed !== "DELETE") return; try { const res = await fetch(`${BASE}/auth/delete-account`, { method: "DELETE", headers: { Authorization: `Bearer ${authToken}` } }); if (res.ok) { onEndCall?.(); onLogout(); } else { const d = await res.json(); alert("Error: " + (d.error || "Could not delete account")); } } catch { alert("Server error. Try again."); } }}>Delete Account</button></div></div>);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "stretch", justifyContent: "center", animation: "fadeIn 0.15s" }}>
      <div style={{ display: "flex", width: "100%", maxWidth: 900, margin: "auto", height: "min(680px, 90vh)", background: "var(--glass2)", borderRadius: 16, overflow: "hidden", border: "1px solid var(--glass-border)", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
        <div style={{ width: 220, background: "var(--glass2)", borderRight: "1px solid var(--divider)", display: "flex", flexDirection: "column", padding: "20px 8px", overflowY: "auto", flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--text-muted)", padding: "6px 10px 4px", marginBottom: 2 }}>Settings</div>
          {groups.map(group => (<div key={group}><div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--text-muted)", padding: "14px 10px 4px" }}>{group}</div>{tabs.filter(t => t.group === group).map(t => (<button key={t.id} onClick={() => setTab(t.id)} style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 8, border: "none", background: tab === t.id ? "var(--accent-soft)" : "transparent", color: tab === t.id ? "var(--accent)" : "var(--text-sub)", fontFamily: "inherit", fontSize: 13, fontWeight: tab === t.id ? 700 : 500, cursor: "pointer", marginBottom: 1, transition: "all 0.15s" }}>{t.label}</button>))}</div>))}
          <div style={{ flex: 1 }} />
          <button onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, border: "none", background: "transparent", color: "var(--text-muted)", fontFamily: "inherit", fontSize: 13, cursor: "pointer", marginTop: 8 }}>✕ Close Settings</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>{renderContent()}</div>
      </div>
    </div>
  );
}

function FriendsPage({ allUsers, onlineUsers, friends, friendReqs, incomingReqs, onSendReq, onAccept, onRemove, onDm, name }) {
  const [tab, setTab] = useState("online"); const [addUsername, setAddUsername] = useState(""); const [search, setSearch] = useState("");
  const avatarGradients = ["linear-gradient(135deg,#7c3aed,#a855f7)", "linear-gradient(135deg,#06b6d4,#7c3aed)", "linear-gradient(135deg,#ec4899,#a855f7)", "linear-gradient(135deg,#059669,#06b6d4)", "linear-gradient(135deg,#f59e0b,#ec4899)", "linear-gradient(135deg,#0284c7,#7c3aed)", "linear-gradient(135deg,#d97706,#f97316)"];
  const getGradient = (u) => avatarGradients[u.charCodeAt(0) % avatarGradients.length];
  const getList = () => {
    let list = [];
    if (tab === "online") list = friends.filter(u => onlineUsers.includes(u));
    else if (tab === "all") list = friends;
    else if (tab === "pending") list = incomingReqs;
    else return [];
    if (search.trim()) list = list.filter(u => u.toLowerCase().includes(search.toLowerCase()));
    return list;
  };
  const list = getList();
  const tabDefs = [
    { id: "online", label: "Online" },
    { id: "all", label: "All" },
    { id: "pending", label: "Pending", badge: incomingReqs.length },
    { id: "add", label: "Add Friend", primary: true },
  ];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0, background: "transparent" }}>
      {/* Discord-style top bar */}
      <div style={{ height: 48, borderBottom: "1px solid var(--divider)", display: "flex", alignItems: "center", padding: "0 16px", gap: 2, flexShrink: 0, background: "var(--glass2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 14, borderRight: "1px solid var(--divider)", marginRight: 6 }}>
          <span style={{ fontSize: 18 }}>👥</span>
          <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>Friends</span>
        </div>
        {tabDefs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setSearch(""); }} style={{ position: "relative", padding: "5px 12px", border: "none", borderRadius: 6, fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", background: t.primary ? "linear-gradient(135deg,#5865f2,#7b8cff)" : tab === t.id ? "rgba(255,255,255,0.12)" : "transparent", color: t.primary ? "#fff" : tab === t.id ? "var(--text)" : "var(--text-sub)", transition: "all 0.12s" }}>
            {t.label}
            {t.badge > 0 && <span style={{ marginLeft: 5, background: "#ed4245", color: "#fff", borderRadius: 999, fontSize: 10, fontWeight: 700, padding: "1px 5px" }}>{t.badge}</span>}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        {tab !== "add" && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--input-bg)", borderRadius: 6, padding: "4px 10px", minWidth: 160 }}>
            <span style={{ fontSize: 12, opacity: 0.4 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search" style={{ background: "transparent", border: "none", outline: "none", fontFamily: "inherit", fontSize: 13, color: "var(--text)", width: "100%" }} />
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 30px" }}>
          {tab === "add" ? (
            <div style={{ maxWidth: 480, paddingTop: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Add Friend</div>
              <div style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 16 }}>You can add friends with their username.</div>
              <div style={{ display: "flex", gap: 0, background: "var(--input-bg)", border: "1.5px solid var(--glass-border)", borderRadius: 10, padding: "4px 4px 4px 14px", transition: "border-color 0.2s" }}>
                <input value={addUsername} onChange={e => setAddUsername(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && addUsername.trim()) { onSendReq(addUsername.trim()); setAddUsername(""); } }} placeholder="Enter a username" style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "inherit", fontSize: 14, color: "var(--text)", padding: "7px 0" }} />
                <button disabled={!addUsername.trim()} onClick={() => { onSendReq(addUsername.trim()); setAddUsername(""); }} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: addUsername.trim() ? "linear-gradient(135deg,#5865f2,#7b8cff)" : "rgba(88,101,242,0.3)", color: "#fff", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: addUsername.trim() ? "pointer" : "not-allowed" }}>Send Friend Request</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>
                {tab === "online" ? `Online — ${list.length}` : tab === "all" ? `All Friends — ${list.length}` : `Pending — ${list.length}`}
              </div>
              {list.length === 0 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 100, gap: 16, color: "var(--text-muted)" }}>
                  <div style={{ fontSize: 80, opacity: 0.15 }}>{tab === "online" ? "😴" : tab === "pending" ? "📭" : "👋"}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-sub)" }}>
                    {tab === "online" ? "No one's online" : tab === "pending" ? "No pending requests" : "No friends yet"}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", maxWidth: 300, lineHeight: 1.6 }}>
                    {tab === "online" ? "There are no friends online at this time. Check back later!" : tab === "pending" ? "You have no pending friend requests." : "Widen your social circle by adding friends!"}
                  </div>
                </div>
              )}
              {list.map((user, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 12px", borderRadius: 10, transition: "background 0.12s", cursor: "default", marginBottom: 2 }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--hover)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ position: "relative", width: 40, height: 40, borderRadius: "50%", background: getGradient(user), flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff" }}>
                    {user[0]?.toUpperCase()}
                    <div style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, borderRadius: "50%", background: onlineUsers.includes(user) ? "#23a55a" : "rgba(255,255,255,0.2)", border: "2px solid var(--glass2)" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{user}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>{onlineUsers.includes(user) ? "Online" : "Offline"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {tab === "pending" ? (
                      <><button onClick={() => onAccept(user)} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(35,165,90,0.15)", color: "#23a55a", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✓</button>
                      <button onClick={() => onRemove(user)} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "rgba(237,66,69,0.15)", color: "#ed4245", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button></>
                    ) : (
                      <><button onClick={() => onDm(user)} title="Message" style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "var(--btn-bg)", color: "var(--text-sub)", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.12s" }} onMouseEnter={e => e.currentTarget.style.background="var(--accent-soft)"} onMouseLeave={e => e.currentTarget.style.background="var(--btn-bg)"}>💬</button>
                      <button onClick={() => onRemove(user)} title="More" style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "var(--btn-bg)", color: "var(--text-sub)", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.12s" }} onMouseEnter={e => e.currentTarget.style.background="var(--accent-soft)"} onMouseLeave={e => e.currentTarget.style.background="var(--btn-bg)"}>⋮</button></>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Active Now panel — right side like Discord */}
        <div style={{ width: 220, borderLeft: "1px solid var(--divider)", padding: "16px 14px", flexShrink: 0, overflowY: "auto" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 16 }}>Active Now</div>
          {onlineUsers.filter(u => u !== name && friends.includes(u)).length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 30 }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.2 }}>🌌</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-sub)", marginBottom: 6 }}>It's quiet for now...</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>When a friend is active, they'll appear here.</div>
            </div>
          ) : onlineUsers.filter(u => u !== name && friends.includes(u)).map((u, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--divider)" }}>
              <div style={{ position: "relative", width: 36, height: 36, borderRadius: "50%", background: getGradient(u), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                {u[0]?.toUpperCase()}
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: "#23a55a", border: "2px solid var(--glass2)", boxShadow: "0 0 6px #23a55a" }} />
              </div>
              <div><div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{u}</div><div style={{ fontSize: 11, color: "#23a55a" }}>Active now</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FriendsPanel({ onClose, allUsers, onlineUsers, friends, friendReqs, incomingReqs, onSendReq, onAccept, onRemove, onDm, name }) {
  const [tab, setTab] = useState("all");
  const tabStyle = (t) => ({ flex: 1, padding: "7px", border: "none", borderRadius: 8, fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer", background: tab === t ? "var(--bubble-me)" : "transparent", color: tab === t ? "#fff" : "var(--text-sub)", transition: "all 0.15s" });
  const others = allUsers.filter(u => u !== name);
  return (
    <div className="friends-panel">
      <div className="friends-hdr"><div className="friends-title">👥 People</div><button className="friends-close" onClick={onClose}>✕</button></div>
      <div style={{ display: "flex", gap: 3, padding: "10px 12px 0", background: "var(--glass2)" }}>
        <button style={tabStyle("all")} onClick={() => setTab("all")}>All Users</button>
        <button style={tabStyle("friends")} onClick={() => setTab("friends")}>Friends {friends.length > 0 && <span style={{ marginLeft: 4, opacity: 0.7 }}>({friends.length})</span>}</button>
        <button style={tabStyle("requests")} onClick={() => setTab("requests")}>Requests {incomingReqs.length > 0 && <span style={{ marginLeft: 4, opacity: 0.7 }}>({incomingReqs.length})</span>}</button>
      </div>
      <div className="friends-body">
        {tab === "all" && <>{<div className="friends-section">All Users — {others.length}</div>}{others.map((user, i) => (<div key={i} className="friend-item"><div className="friend-av">{user[0].toUpperCase()}{onlineUsers.includes(user) && <div className="c-online" />}</div><div className="friend-info"><div className="friend-name">{user}</div><div className="friend-status">{onlineUsers.includes(user) ? "🟢 Online" : "⚪ Offline"}</div></div><div className="friend-actions">{friends.includes(user) ? (<><button className="friend-btn primary" onClick={() => onDm(user)}>DM</button><button className="friend-btn danger" onClick={() => onRemove(user)}>Unfriend</button></>) : friendReqs.includes(user) ? (<button className="friend-btn danger" style={{ opacity: 0.6, cursor: "default" }}>Sent ✓</button>) : (<button className="friend-btn primary" onClick={() => onSendReq(user)}>+ Add</button>)}</div></div>))}</>}
        {tab === "friends" && <><div className="friends-section">Your Friends — {friends.length}</div>{friends.length === 0 && <div style={{ padding: "20px 6px", fontSize: 13, color: "var(--text-muted)" }}>No friends yet. Go to All Users to add some!</div>}{friends.map((user, i) => (<div key={i} className="friend-item"><div className="friend-av">{user[0].toUpperCase()}{onlineUsers.includes(user) && <div className="c-online" />}</div><div className="friend-info"><div className="friend-name">{user}</div><div className="friend-status">{onlineUsers.includes(user) ? "🟢 Online" : "⚪ Offline"}</div></div><div className="friend-actions"><button className="friend-btn primary" onClick={() => { onDm(user); onClose(); }}>DM</button><button className="friend-btn danger" onClick={() => onRemove(user)}>Remove</button></div></div>))}</>}
        {tab === "requests" && <><div className="friends-section">Incoming Requests — {incomingReqs.length}</div>{incomingReqs.length === 0 && <div style={{ padding: "20px 6px", fontSize: 13, color: "var(--text-muted)" }}>No pending requests.</div>}{incomingReqs.map((user, i) => (<div key={i} className="friend-item"><div className="friend-av">{user[0].toUpperCase()}</div><div className="friend-info"><div className="friend-name">{user}</div><div className="friend-status">Wants to be friends</div></div><div className="friend-actions"><button className="friend-btn accept" onClick={() => onAccept(user)}>Accept</button><button className="friend-btn danger" onClick={() => onRemove(user)}>Decline</button></div></div>))}<div className="friends-section">Sent Requests — {friendReqs.length}</div>{friendReqs.length === 0 && <div style={{ padding: "8px 6px", fontSize: 13, color: "var(--text-muted)" }}>No sent requests.</div>}{friendReqs.map((user, i) => (<div key={i} className="friend-item"><div className="friend-av">{user[0].toUpperCase()}</div><div className="friend-info"><div className="friend-name">{user}</div><div className="friend-status">Request pending…</div></div></div>))}</>}
      </div>
    </div>
  );
}

function RoomInfoPanel({ room, name, onClose, authToken, onUpdateRoom }) {
  const [editing, setEditing] = useState(false); const [roomName, setRoomName] = useState(room?.name || ""); const [roomDesc, setRoomDesc] = useState(room?.description || ""); const [saving, setSaving] = useState(false); const [msg, setMsg] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const iconInputRef = useRef(null);
  const BASE = "http://192.168.100.127:8080";
  const ROOM_EMOJIS = ["🌟","🎮","💖","📚","🏫","⚽","🎵","🎨","💻","⛩️","✈️","🍜","🔥","🌈","🚀","💎","🎯","🏆","👾","🤖","🐉","🌙","⚡","🎭","🎪","🛸","🌺","🎸","🏴‍☠️","🌊"];
  const save = async () => { setSaving(true); setMsg(null); try { const res = await fetch(`${BASE}/rooms/${room.id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` }, body: JSON.stringify({ name: roomName.trim(), description: roomDesc.trim() }) }); if (!res.ok) { setMsg({ ok: false, text: "Failed to save" }); setSaving(false); return; } const updated = await res.json(); onUpdateRoom(updated); setMsg({ ok: true, text: "Saved!" }); setEditing(false); } catch { setMsg({ ok: false, text: "Server error" }); } setSaving(false); };
  const uploadIcon = async (file) => { const fd = new FormData(); fd.append("file", file); try { const res = await fetch(`${BASE}/rooms/${room.id}/icon`, { method: "POST", headers: { Authorization: `Bearer ${authToken}` }, body: fd }); const data = await res.json(); onUpdateRoom({ ...room, iconUrl: data.iconUrl }); setMsg({ ok: true, text: "Icon updated!" }); } catch { setMsg({ ok: false, text: "Upload failed" }); } };
  const setEmoji = async (emoji) => { try { const res = await fetch(`${BASE}/rooms/${room.id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` }, body: JSON.stringify({ name: room.name, description: room.description, emoji }) }); const updated = await res.json(); onUpdateRoom(updated); setShowEmojiPicker(false); setMsg({ ok: true, text: "Emoji updated!" }); } catch { setMsg({ ok: false, text: "Server error" }); } };
  const gradients = ["#7c3aed","#06b6d4","#ec4899","#059669","#f59e0b"];
  const g = gradients[(room?.name || "").charCodeAt(0) % gradients.length];
  return (
    <div style={{ width: 280, borderLeft: "1px solid var(--divider)", height: "100%", background: "var(--glass2)", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden", animation: "slideInRight 0.2s cubic-bezier(0.16,1,0.3,1)" }}>
      <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--divider)", display: "flex", alignItems: "center", justifyContent: "space-between" }}><span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Room Info</span><button onClick={onClose} style={{ background: "var(--btn-bg)", border: "none", borderRadius: 8, width: 28, height: 28, cursor: "pointer", color: "var(--text-muted)", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button></div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 18px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: `linear-gradient(135deg, ${g}, #a855f7)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, marginBottom: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}>{room?.emoji || "🌟"}</div>
          {!editing ? (<><div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{room?.name}</div><div style={{ fontSize: 12, color: "var(--text-sub)", textAlign: "center", lineHeight: 1.5 }}>{room?.description || "No description"}</div></>) : (<div style={{ width: "100%", marginTop: 8 }}>{msg && <div style={{ fontSize: 12, padding: "7px 10px", borderRadius: 8, marginBottom: 10, background: msg.ok ? "rgba(74,222,128,0.12)" : "rgba(251,113,133,0.12)", color: msg.ok ? "#4ade80" : "#fb7185", border: `1px solid ${msg.ok ? "rgba(74,222,128,0.3)" : "rgba(251,113,133,0.3)"}` }}>{msg.text}</div>}<label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 5 }}>Room Name</label><input value={roomName} onChange={e => setRoomName(e.target.value)} style={{ width: "100%", background: "var(--input-bg)", border: "1.5px solid var(--glass-border)", borderRadius: 8, padding: "9px 12px", fontFamily: "inherit", fontSize: 13, color: "var(--text)", outline: "none", marginBottom: 10 }} /><label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 5 }}>Description</label><textarea value={roomDesc} onChange={e => setRoomDesc(e.target.value)} rows={3} style={{ width: "100%", background: "var(--input-bg)", border: "1.5px solid var(--glass-border)", borderRadius: 8, padding: "9px 12px", fontFamily: "inherit", fontSize: 13, color: "var(--text)", outline: "none", resize: "none", marginBottom: 12 }} /><div style={{ display: "flex", gap: 8 }}><button onClick={save} disabled={saving} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "none", background: "var(--bubble-me)", color: "#fff", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{saving ? "Saving…" : "Save"}</button><button onClick={() => { setEditing(false); setRoomName(room?.name || ""); setRoomDesc(room?.description || ""); setMsg(null); }} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1px solid var(--glass-border)", background: "transparent", color: "var(--text-sub)", fontFamily: "inherit", fontSize: 13, cursor: "pointer" }}>Cancel</button></div></div>)}
        </div>
        {!editing && <button onClick={() => setEditing(true)} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1.5px solid var(--glass-border)", background: "var(--btn-bg)", color: "var(--text)", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>✏️ Edit Room Info</button>}
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid var(--glass-border)", overflow: "hidden" }}>{[{ label: "Type", value: room?.roomType === "private" ? "🔒 Private" : "🌐 Public" }, { label: "Created by", value: room?.createdBy || "Unknown" }, { label: "Template", value: room?.template || "Custom" }].map((row, i, arr) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", borderBottom: i < arr.length - 1 ? "1px solid var(--divider)" : "none" }}><span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{row.label}</span><span style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>{row.value}</span></div>))}</div>
      </div>
    </div>
  );
}

const THEMES = {
  galaxy:    { accent:"#c46dff", accent2:"#7b8cff", accentGlow:"rgba(196,109,255,0.30)", accentSoft:"rgba(196,109,255,0.13)", bubbleMe:"linear-gradient(135deg,#c46dff 0%,#7b8cff 100%)", glass:"rgba(10,7,22,0.66)", glass2:"rgba(15,10,32,0.78)", glassBorder:"rgba(255,255,255,0.09)", divider:"rgba(255,255,255,0.07)", text:"#ede8ff", textSub:"#9080b8", textMuted:"#4e4268", bubbleOther:"rgba(28,18,52,0.88)", bubbleOb:"rgba(255,255,255,0.08)", inputBg:"rgba(18,12,38,0.72)", scrollbar:"rgba(196,109,255,0.22)", hover:"rgba(255,255,255,0.05)", btnBg:"rgba(255,255,255,0.07)", onlineBorder:"#0f0a20", storyBg:"#0b0810" },
  mars:      { accent:"#ff6b35", accent2:"#ff9f6b", accentGlow:"rgba(255,107,53,0.30)", accentSoft:"rgba(255,107,53,0.13)", bubbleMe:"linear-gradient(135deg,#ff6b35 0%,#c0392b 100%)", glass:"rgba(22,8,4,0.70)", glass2:"rgba(32,12,6,0.82)", glassBorder:"rgba(255,120,80,0.12)", divider:"rgba(255,100,60,0.10)", text:"#ffe8e0", textSub:"#c08070", textMuted:"#7a4030", bubbleOther:"rgba(40,16,8,0.90)", bubbleOb:"rgba(255,120,80,0.10)", inputBg:"rgba(30,10,5,0.75)", scrollbar:"rgba(255,107,53,0.22)", hover:"rgba(255,107,53,0.07)", btnBg:"rgba(255,107,53,0.10)", onlineBorder:"#1a0803", storyBg:"#1a0803" },
  neptune:   { accent:"#4fc3f7", accent2:"#81d4fa", accentGlow:"rgba(79,195,247,0.30)", accentSoft:"rgba(79,195,247,0.13)", bubbleMe:"linear-gradient(135deg,#0077b6 0%,#4fc3f7 100%)", glass:"rgba(0,15,30,0.70)", glass2:"rgba(0,20,40,0.82)", glassBorder:"rgba(79,195,247,0.12)", divider:"rgba(79,195,247,0.08)", text:"#e0f4ff", textSub:"#6aafc8", textMuted:"#2a5a70", bubbleOther:"rgba(0,25,50,0.90)", bubbleOb:"rgba(79,195,247,0.10)", inputBg:"rgba(0,15,32,0.75)", scrollbar:"rgba(79,195,247,0.22)", hover:"rgba(79,195,247,0.06)", btnBg:"rgba(79,195,247,0.09)", onlineBorder:"#000f1e", storyBg:"#000f1e" },
  venus:     { accent:"#f9a825", accent2:"#ffd54f", accentGlow:"rgba(249,168,37,0.30)", accentSoft:"rgba(249,168,37,0.13)", bubbleMe:"linear-gradient(135deg,#f9a825 0%,#ff7043 100%)", glass:"rgba(255,248,225,0.70)", glass2:"rgba(255,252,235,0.88)", glassBorder:"rgba(200,140,0,0.25)", divider:"rgba(0,0,0,0.08)", text:"#3e2000", textSub:"#7a5010", textMuted:"#b8900a", bubbleOther:"rgba(255,255,255,0.95)", bubbleOb:"rgba(200,140,0,0.20)", inputBg:"rgba(255,255,255,0.75)", scrollbar:"rgba(249,168,37,0.30)", hover:"rgba(249,168,37,0.08)", btnBg:"rgba(249,168,37,0.10)", onlineBorder:"#fff8e1", storyBg:"#fff8e1" },
  blackhole: { accent:"#a78bfa", accent2:"#7c3aed", accentGlow:"rgba(167,139,250,0.25)", accentSoft:"rgba(167,139,250,0.10)", bubbleMe:"linear-gradient(135deg,#1a0050 0%,#7c3aed 100%)", glass:"rgba(2,0,8,0.85)", glass2:"rgba(4,0,14,0.92)", glassBorder:"rgba(167,139,250,0.07)", divider:"rgba(255,255,255,0.04)", text:"#e8e0ff", textSub:"#6050a0", textMuted:"#2e2050", bubbleOther:"rgba(6,0,20,0.95)", bubbleOb:"rgba(167,139,250,0.07)", inputBg:"rgba(4,0,12,0.80)", scrollbar:"rgba(167,139,250,0.18)", hover:"rgba(167,139,250,0.04)", btnBg:"rgba(167,139,250,0.06)", onlineBorder:"#020008", storyBg:"#020008" },
  nebula:    { accent:"#f472b6", accent2:"#a78bfa", accentGlow:"rgba(244,114,182,0.28)", accentSoft:"rgba(244,114,182,0.12)", bubbleMe:"linear-gradient(135deg,#f472b6 0%,#a78bfa 100%)", glass:"rgba(15,5,25,0.68)", glass2:"rgba(20,8,35,0.80)", glassBorder:"rgba(244,114,182,0.10)", divider:"rgba(244,114,182,0.07)", text:"#ffe8f8", textSub:"#b070a0", textMuted:"#604058", bubbleOther:"rgba(25,10,40,0.88)", bubbleOb:"rgba(244,114,182,0.09)", inputBg:"rgba(15,5,28,0.72)", scrollbar:"rgba(244,114,182,0.20)", hover:"rgba(244,114,182,0.06)", btnBg:"rgba(244,114,182,0.08)", onlineBorder:"#0f0519", storyBg:"#0f0519" },
};

const buildCSS = (theme) => {
  const t = THEMES[theme] || THEMES.galaxy;
  const dark = ["galaxy","mars","blackhole","nebula","neptune"].includes(theme);
  return `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body, #root { width:100%; height:100%; overflow:hidden; font-family:'Plus Jakarta Sans',sans-serif; }
  :root {
    --accent:${t.accent}; --accent2:${t.accent2}; --accent-glow:${t.accentGlow}; --accent-soft:${t.accentSoft};
    --green:#4ade80; --red:#fb7185; --bubble-me:${t.bubbleMe};
    --spring:cubic-bezier(0.34,1.56,0.64,1); --out:cubic-bezier(0.16,1,0.3,1);
    --glass:${t.glass}; --glass2:${t.glass2}; --glass-border:${t.glassBorder}; --divider:${t.divider};
    --text:${t.text}; --text-sub:${t.textSub}; --text-muted:${t.textMuted};
    --bubble-other:${t.bubbleOther}; --bubble-ob:${t.bubbleOb};
    --input-bg:${t.inputBg}; --scrollbar:${t.scrollbar};
    --hover:${t.hover}; --btn-bg:${t.btnBg};
  }
`;};
const buildCSSBody = (theme) => {
  const t = THEMES[theme] || THEMES.galaxy;
  const dark = ["galaxy","mars","blackhole","nebula","neptune"].includes(theme);
  return `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body, #root { width:100%; height:100%; overflow:hidden; font-family:'Plus Jakarta Sans',sans-serif; }
  :root {
    --accent:${t.accent}; --accent2:${t.accent2}; --accent-glow:${t.accentGlow}; --accent-soft:${t.accentSoft};
    --green:#4ade80; --red:#fb7185; --bubble-me:${t.bubbleMe};
    --spring:cubic-bezier(0.34,1.56,0.64,1); --out:cubic-bezier(0.16,1,0.3,1);
    --glass:${t.glass}; --glass2:${t.glass2};
    --glass-border:${t.glassBorder}; --divider:${t.divider};
    --text:${t.text}; --text-sub:${t.textSub}; --text-muted:${t.textMuted};
    --bubble-other:${t.bubbleOther}; --bubble-ob:${t.bubbleOb};
    --input-bg:${t.inputBg}; --scrollbar:${t.scrollbar};
    --hover:${t.hover}; --btn-bg:${t.btnBg};
  }
  .page { position:fixed; inset:0; z-index:1; display:flex; align-items:center; justify-content:center; padding:0; }
  .theme-fab { position:fixed; top:10px; right:10px; z-index:999; width:44px; height:26px; border:none; cursor:pointer; padding:0; border-radius:999px; background:${dark ? "rgba(30,18,55,0.85)" : "rgba(255,255,255,0.85)"}; backdrop-filter:blur(14px); border:1.5px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(140,100,200,0.35)"}; box-shadow:0 3px 14px rgba(0,0,0,0.20); }
  .theme-thumb { position:absolute; top:3px; left:${dark ? "21px" : "3px"}; width:20px; height:20px; border-radius:50%; background:${dark ? "#c46dff" : "#ffe066"}; display:flex; align-items:center; justify-content:center; pointer-events:none; transition:left 0.3s var(--spring); box-shadow:0 1px 5px rgba(0,0,0,0.25); }
  @keyframes riseUp { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:none} }
  .join-card { width:440px; background:var(--glass2); backdrop-filter:blur(32px) saturate(160%); -webkit-backdrop-filter:blur(32px) saturate(160%); border:1px solid var(--glass-border); border-radius:28px; padding:54px 46px 50px; text-align:center; box-shadow:0 32px 80px rgba(0,0,0,0.36); animation:riseUp 0.45s var(--out) forwards; }
  .join-logo { width:70px; height:70px; border-radius:22px; background:var(--bubble-me); margin:0 auto 26px; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 28px var(--accent-glow); }
  .join-title { font-size:26px; font-weight:700; letter-spacing:-0.6px; color:var(--text); margin-bottom:7px; }
  .join-sub { font-size:14px; color:var(--text-sub); margin-bottom:38px; line-height:1.65; }
  .join-label { display:block; text-align:left; font-size:10.5px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--text-muted); margin-bottom:7px; }
  .join-input { width:100%; background:var(--input-bg); border:1.5px solid var(--glass-border); border-radius:14px; padding:14px 17px; font-family:inherit; font-size:15px; color:var(--text); outline:none; transition:border-color 0.2s,box-shadow 0.2s; margin-bottom:14px; }
  .join-input::placeholder { color:var(--text-muted); }
  .join-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft); }
  .join-btn { width:100%; background:var(--bubble-me); color:#fff; border:none; border-radius:14px; padding:14px; font-family:inherit; font-size:15px; font-weight:700; cursor:pointer; box-shadow:0 6px 24px var(--accent-glow); transition:transform 0.15s, opacity 0.15s; }
  .join-btn:hover { transform:translateY(-2px); opacity:0.92; }
  .join-btn:active { transform:none; }
  .chat-window { display:flex; flex-direction:row; width:100vw; height:100vh; min-width:0; overflow-x:hidden; background:var(--glass); backdrop-filter:blur(36px) saturate(180%); -webkit-backdrop-filter:blur(36px) saturate(180%); border:1px solid var(--glass-border); border-radius:0; overflow:hidden; box-shadow:0 40px 110px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05); animation:riseUp 0.42s var(--out) forwards; }
  .sidebar { width:300px; min-width:300px; height:100%; flex-direction:column; background:var(--glass2); backdrop-filter:blur(20px); border-right:1px solid var(--divider); flex-shrink:0; }
  .sb-top { padding:20px 16px 14px; border-bottom:1px solid var(--divider); }
  .sb-name { font-size:17px; font-weight:700; color:var(--text); letter-spacing:-0.4px; margin-bottom:13px; display:flex; align-items:center; gap:6px; }
  .sb-caret { color:var(--text-muted); font-size:11px; }
  .sb-search { display:flex; align-items:center; gap:9px; padding:9px 13px; background:var(--input-bg); border:1.5px solid var(--glass-border); border-radius:12px; transition:border-color 0.2s, box-shadow 0.2s; }
  .sb-search:focus-within { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft); }
  .sb-search input { flex:1; background:transparent; border:none; outline:none; font-family:inherit; font-size:13.5px; color:var(--text); }
  .sb-search input::placeholder { color:var(--text-muted); }
  .sb-section { padding:13px 16px 5px; font-size:9.5px; font-weight:700; letter-spacing:1.3px; text-transform:uppercase; color:var(--text-muted); }
  .contact-list { flex:1; overflow-y:auto; padding:4px 8px 8px; }
  .contact-list::-webkit-scrollbar { width:3px; }
  .contact-list::-webkit-scrollbar-thumb { background:var(--scrollbar); border-radius:3px; }
  .contact-item { display:flex; align-items:center; gap:11px; padding:10px; border-radius:14px; cursor:pointer; transition:background 0.15s; margin-bottom:2px; }
  .contact-item:hover { background:var(--hover); }
  .contact-item.active { background:var(--accent-soft); }
  .c-av { width:46px; height:46px; border-radius:50%; background:var(--bubble-me); flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:17px; font-weight:700; color:#fff; position:relative; }
  .c-av.story { box-shadow:0 0 0 2px ${dark ? "#0b0810" : "rgba(255,255,255,0.9)"}, 0 0 0 4px var(--accent); }
  .c-online { position:absolute; bottom:1px; right:1px; width:12px; height:12px; border-radius:50%; background:var(--green); border:2.5px solid ${dark ? "#0f0a20" : "#fff"}; }
  .c-info { flex:1; min-width:0; }
  .c-name { font-size:13.5px; font-weight:600; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .contact-item.active .c-name { color:var(--accent); }
  .c-last { font-size:12px; color:var(--text-sub); margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .c-meta { display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0; }
  .c-time { font-size:10px; color:var(--text-muted); font-family:'Fira Code',monospace; }
  .chat-panel { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; position:relative; }
  .chat-hdr { display:flex; align-items:center; gap:12px; padding:13px 20px; background:var(--glass2); backdrop-filter:blur(20px); border-bottom:1px solid var(--divider); flex-shrink:0; }
  .h-av { width:42px; height:42px; border-radius:50%; background:var(--bubble-me); display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:700; color:#fff; flex-shrink:0; box-shadow:0 0 0 2.5px var(--accent-glow); }
  .h-info { flex:1; }
  .h-name { font-size:15px; font-weight:700; color:var(--text); letter-spacing:-0.3px; }
  .h-status { font-size:12px; color:var(--green); display:flex; align-items:center; gap:5px; margin-top:2px; font-weight:500; }
  .h-dot { width:7px; height:7px; background:var(--green); border-radius:50%; box-shadow:0 0 6px var(--green); animation:blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.38} }
  .h-actions { display:flex; gap:5px; }
  .h-btn { width:38px; height:38px; border:none; border-radius:11px; cursor:pointer; background:var(--btn-bg); display:flex; align-items:center; justify-content:center; border:1px solid var(--divider); transition:background 0.15s, transform 0.1s; }
  .h-btn:hover { background:var(--accent-soft); transform:scale(1.06); }
  .h-btn:active { transform:scale(0.94); }
  .msgs { flex:1; overflow-y:auto; padding:20px 28px 12px; display:flex; flex-direction:column; gap:3px; background:transparent; }
  .msgs::-webkit-scrollbar { width:4px; }
  .msgs::-webkit-scrollbar-thumb { background:var(--scrollbar); border-radius:4px; }
  .empty-wrap { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:9px; padding-bottom:28px; }
  .empty-av { width:70px; height:70px; border-radius:50%; background:var(--bubble-me); display:flex; align-items:center; justify-content:center; font-size:26px; font-weight:700; color:#fff; box-shadow:0 8px 28px var(--accent-glow); margin-bottom:2px; }
  .empty-name { font-size:17px; font-weight:700; color:var(--text); }
  .empty-hint { font-size:13px; color:var(--text-sub); }
  .msg-group { display:flex; flex-direction:column; margin-bottom:6px; }
  .msg-group.me { align-items:flex-end; }
  .msg-group.other { align-items:flex-start; }
  .msg-sender { font-size:11px; font-weight:700; color:var(--accent); margin-bottom:3px; padding-left:38px; }
  .msg-row { display:flex; align-items:flex-end; gap:8px; max-width:66%; }
  .msg-group.me .msg-row { flex-direction:row-reverse; }
  .mini-av { width:28px; height:28px; border-radius:50%; flex-shrink:0; background:var(--bubble-me); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#fff; margin-bottom:1px; }
  @keyframes pop { from{opacity:0;transform:scale(0.84) translateY(5px)} to{opacity:1;transform:none} }
  .msg-bubble { padding:var(--bubble-padding,11px 15px); border-radius:var(--bubble-radius,22px); font-size:var(--bubble-font-size,14.5px); line-height:1.56; word-break:break-word; animation:pop 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards; transition:font-size 0.15s, padding 0.15s, border-radius 0.15s; }
  .msg-group.me .msg-bubble { background:var(--bubble-me); color:#fff; border-bottom-right-radius:var(--bubble-tail-radius,5px); box-shadow:0 3px 16px rgba(196,109,255,0.28); }
  .msg-group.other .msg-bubble { background:var(--bubble-other); color:var(--text); border-bottom-left-radius:var(--bubble-tail-radius,5px); border:1px solid var(--bubble-ob); backdrop-filter:blur(12px); }
  .msg-bubble.is-image { padding:0!important; background:none!important; border:none!important; box-shadow:none!important; backdrop-filter:none!important; }
  .msg-time { font-size:10px; font-family:'Fira Code',monospace; color:var(--text-muted); margin-top:3px; padding:0 2px; }
  .msg-group.other .msg-time { padding-left:36px; }
  .msg-group.me .msg-time { text-align:right; }
  .msg-img { max-width:260px; max-height:260px; border-radius:18px; display:block; object-fit:cover; box-shadow:0 5px 22px rgba(0,0,0,0.28); cursor:zoom-in; transition:transform 0.18s; }
  .msg-img:hover { transform:scale(1.03); }
  .msg-file { display:flex; align-items:center; gap:11px; padding:11px 15px; background:rgba(196,109,255,0.10); border-radius:16px; color:inherit; text-decoration:none; font-size:13.5px; font-weight:500; border:1px solid rgba(196,109,255,0.20); transition:background 0.15s; min-width:180px; }
  .msg-file:hover { background:rgba(196,109,255,0.18); }
  .msg-file-ic { width:36px; height:36px; border-radius:10px; background:var(--bubble-me); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .msg-audio { width:220px; height:36px; accent-color:var(--accent); }
  .input-area { padding:11px 20px 16px; background:var(--glass2); backdrop-filter:blur(20px); border-top:1px solid var(--divider); flex-shrink:0; }
  .input-row { display:flex; align-items:flex-end; gap:5px; background:var(--input-bg); border:1.5px solid var(--glass-border); border-radius:999px; padding:8px 8px 8px 18px; transition:border-color 0.2s, box-shadow 0.2s; }
  .input-row:focus-within { border-color:rgba(196,109,255,0.55); box-shadow:0 0 0 3px var(--accent-soft); }
  .msg-ta { flex:1; background:transparent; border:none; outline:none; font-family:inherit; font-size:14.5px; color:var(--text); resize:none; max-height:110px; line-height:1.52; padding:3px 0; scrollbar-width:none; }
  .msg-ta::placeholder { color:var(--text-muted); }
  .msg-ta::-webkit-scrollbar { display:none; }
  .input-icons { display:flex; align-items:flex-end; gap:1px; }
  .ico-btn { width:36px; height:36px; border:none; border-radius:50%; cursor:pointer; background:var(--btn-bg); display:flex; align-items:center; justify-content:center; transition:background 0.15s, transform 0.1s; flex-shrink:0; }
  .ico-btn:hover { background:var(--accent-soft); transform:scale(1.1); }
  .ico-btn:active { transform:scale(0.93); }
  .ico-btn.rec { background:rgba(251,113,133,0.18); }
  .send-btn { width:36px; height:36px; border:none; cursor:pointer; background:var(--bubble-me); border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 14px var(--accent-glow); transition:transform 0.1s, box-shadow 0.15s; flex-shrink:0; }
  .send-btn:hover { transform:scale(1.1); box-shadow:0 5px 20px var(--accent-glow); }
  .send-btn:active { transform:scale(0.93); }
  .rec-badge { display:flex; align-items:center; gap:6px; padding:6px 6px 0; font-size:12px; font-weight:500; color:var(--red); animation:fadeIn 0.2s; }
  .rec-dot { width:7px; height:7px; background:var(--red); border-radius:50%; animation:blink 1s infinite; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .sb-section { padding:13px 16px 5px; font-size:9.5px; font-weight:700; letter-spacing:1.3px; text-transform:uppercase; color:var(--text-muted); display:flex; align-items:center; justify-content:space-between; }
  .sb-add-btn { width:20px; height:20px; border:none; background:var(--btn-bg); border-radius:6px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
  .sb-add-btn:hover { background:var(--accent-soft); }
  .c-unread { min-width:18px; height:18px; border-radius:999px; background:var(--accent); color:#fff; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; padding:0 4px; }
  .msg-bubble.deleted { opacity:0.55; font-style:italic; font-size:13px; }
  .reactions-row { display:flex; flex-wrap:wrap; gap:4px; margin-top:5px; }
  .reaction-chip { display:flex; align-items:center; gap:3px; padding:2px 7px; border-radius:999px; background:var(--btn-bg); border:1px solid var(--glass-border); cursor:pointer; font-size:13px; transition:background 0.15s; }
  .reaction-chip:hover { background:var(--accent-soft); border-color:var(--accent); }
  .reaction-chip.mine { background:var(--accent-soft); border-color:var(--accent); }
  .reaction-count { font-size:11px; font-weight:700; color:var(--text-sub); }
  .msg-actions { position:absolute; top:-34px; display:flex; gap:3px; background:var(--glass2); border:1px solid var(--glass-border); border-radius:10px; padding:4px 6px; box-shadow:0 4px 16px rgba(0,0,0,0.3); opacity:0; pointer-events:none; transition:opacity 0.15s; z-index:10; }
  .msg-group.me .msg-actions { right:0; }
  .msg-group.other .msg-actions { left:34px; }
  .msg-row:hover .msg-actions { opacity:1; pointer-events:all; }
  .action-btn { width:26px; height:26px; border:none; background:transparent; border-radius:7px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.12s; }
  .action-btn:hover { background:var(--hover); }
  .edit-bar { display:flex; align-items:center; gap:8px; padding:5px 16px 0; font-size:12px; color:var(--accent); }
  .edit-bar button { background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:11px; font-family:inherit; padding:0; }
  .msg-search-bar { display:flex; align-items:center; gap:8px; padding:8px 16px; background:var(--glass2); border-bottom:1px solid var(--divider); animation:fadeIn 0.15s; }
  .msg-search-input { flex:1; background:var(--input-bg); border:1.5px solid var(--glass-border); border-radius:10px; padding:7px 12px; font-family:inherit; font-size:13px; color:var(--text); outline:none; }
  .msg-search-input:focus { border-color:var(--accent); }
  .msg-search-nav { display:flex; align-items:center; gap:4px; }
  .msg-search-btn { width:28px; height:28px; border:none; background:var(--btn-bg); border-radius:8px; cursor:pointer; color:var(--text-sub); font-size:14px; display:flex; align-items:center; justify-content:center; }
  .msg-search-btn:hover { background:var(--accent-soft); }
  .friends-panel { position:fixed; top:0; right:0; width:320px; height:100vh; z-index:150; background:var(--glass2); border-left:1px solid var(--divider); backdrop-filter:blur(24px); display:flex; flex-direction:column; box-shadow:-8px 0 40px rgba(0,0,0,0.3); animation:slideInRight 0.25s var(--out); }
  @keyframes slideInRight { from{transform:translateX(100%)} to{transform:none} }
  .friends-hdr { padding:20px 18px 14px; border-bottom:1px solid var(--divider); display:flex; align-items:center; gap:10px; }
  .friends-title { font-size:16px; font-weight:700; color:var(--text); flex:1; }
  .friends-close { width:30px; height:30px; border:none; background:var(--btn-bg); border-radius:8px; cursor:pointer; color:var(--text-sub); font-size:16px; display:flex; align-items:center; justify-content:center; }
  .friends-close:hover { background:var(--accent-soft); }
  .friends-body { flex:1; overflow-y:auto; padding:10px 12px; }
  .friends-section { font-size:9.5px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:var(--text-muted); padding:10px 6px 5px; }
  .friend-item { display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:12px; transition:background 0.15s; }
  .friend-item:hover { background:var(--hover); }
  .friend-av { width:38px; height:38px; border-radius:50%; background:var(--bubble-me); flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; color:#fff; position:relative; }
  .friend-info { flex:1; min-width:0; }
  .friend-name { font-size:13px; font-weight:600; color:var(--text); }
  .friend-status { font-size:11.5px; color:var(--text-sub); margin-top:1px; }
  .friend-actions { display:flex; gap:5px; }
  .friend-btn { padding:4px 10px; border-radius:8px; border:none; font-family:inherit; font-size:11px; font-weight:700; cursor:pointer; }
  .friend-btn.primary { background:var(--bubble-me); color:#fff; }
  .friend-btn.danger { background:rgba(251,113,133,0.15); color:#fb7185; border:1px solid rgba(251,113,133,0.3); }
  .friend-btn.accept { background:rgba(74,222,128,0.15); color:#4ade80; border:1px solid rgba(74,222,128,0.3); }
  .friend-req-badge { min-width:18px; height:18px; border-radius:999px; background:#fb7185; color:#fff; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; padding:0 4px; }
  .msg-search-count { font-size:12px; color:var(--text-muted); min-width:48px; text-align:center; font-family:'Fira Code',monospace; }
  .msg-highlight { background:rgba(196,109,255,0.35); border-radius:3px; padding:0 2px; }
  .msg-highlight.active { background:rgba(196,109,255,0.7); color:#fff; }
  .friends-page { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; background:transparent; }
  .sb-user { display:flex; align-items:center; gap:10px; margin-bottom:12px; cursor:pointer; padding:6px 8px; border-radius:12px; transition:background 0.15s; }
  .sb-user:hover { background:var(--hover); }
  .sb-user-av { width:36px; height:36px; border-radius:50%; background:var(--bubble-me); flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; color:#fff; overflow:hidden; }
  .sb-user-name { font-size:14px; font-weight:700; color:var(--text); flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
`;}

const getTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const initial = (n) => (n || "?")[0].toUpperCase();

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
   ↓ THE ONLY CHANGE FROM THE ORIGINAL FILE:
     function Chat → function WebSocketClient
───────────────────────────────────────────────────────── */
export default function WebSocketClient({ authUser, authToken, onLogout }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "galaxy");
  const [dark, setDark] = React.useState(["galaxy","mars","blackhole","nebula"].includes(theme));
  React.useEffect(() => { setDark(["galaxy","mars","blackhole","nebula"].includes(theme)); }, [theme]);
  const [chatTheme, setChatTheme] = useState(() => localStorage.getItem("chatTheme") || "default");
  const [name] = useState(authUser || "");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [flashIds,    setFlashIds]    = useState(new Set());
  const [view, setView] = useState(() => sessionStorage.getItem("view") || "channel");
  const [activeDmUser, setActiveDmUser] = useState(() => sessionStorage.getItem("activeDmUser") || null);
  const [dmMessages, setDmMessages] = useState({});
  const [activeRoom, setActiveRoom] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("activeRoom") || "null"); } catch { return null; }
  });
  const [rooms, setRooms] = useState([]);
  const [roomMessages, setRoomMessages] = useState({});
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [dmUnread, setDmUnread] = useState({});
  const [channelUnread, setChannelUnread] = useState(0);
  const [roomUnread, setRoomUnread] = useState({});
  const [callPresence, setCallPresence] = useState({});
  const [moodMap, setMoodMap] = useState({});
  const [myRole, setMyRole] = useState("MEMBER");
  const [myMood, setMyMood] = useState("ONLINE");
  const [friends, setFriends] = useState(() => { try { return JSON.parse(localStorage.getItem(`friends_${authUser}`) || "[]"); } catch { return []; } });
  const [friendReqs, setFriendReqs] = useState(() => { try { return JSON.parse(localStorage.getItem(`friendreqs_${authUser}`) || "[]"); } catch { return []; } });
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState("account");
  const [fontSize, setFontSize] = useState(() => localStorage.getItem("fontSize") || "medium");
  const [notifSound, setNotifSound] = useState(() => localStorage.getItem("notifSound") !== "false");
  const [compactMode, setCompactMode] = useState(() => localStorage.getItem("compactMode") === "true");
  const [privacyDm, setPrivacyDm] = useState(() => localStorage.getItem("privacyDm") || "everyone");
  const [privacyFriend, setPrivacyFriend] = useState(() => localStorage.getItem("privacyFriend") || "everyone");
  const [reactions, setReactions] = useState({});
  const [editingMsg, setEditingMsg] = useState(null);
  const [editText, setEditText] = useState("");
  const [recording, setRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [callMode, setCallMode] = useState(null);
  const [callKey, setCallKey] = useState(0);
  const [callMinimized, setCallMinimized] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const screenSubRef = useRef(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeout = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const dragCounter = useRef(0);
  const [showEmoji, setShowEmoji] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [showMsgSearch, setShowMsgSearch] = useState(false);
  const [msgSearchQ, setMsgSearchQ] = useState("");
  const [msgSearchIdx, setMsgSearchIdx] = useState(-1);
  const [msgSearchResults, setMsgSearchResults] = useState([]);
  const emojiRef = useRef(null);
  const msgRefs = useRef({});
  const stompClient = useRef(null);
  const messagesEnd = useRef(null);
  const inputRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const recordTimer = useRef(null);
  const recorderRef = useRef(null);
  const nameRef = useRef(name);
  const videoRefs = useRef({});
  const roomSubRef = useRef({});
  const localStreamRef = useRef(null);
  useEffect(() => { nameRef.current = name; }, [name]);

  useEffect(() => {
    if (authUser) {
      const token = authToken || localStorage.getItem("token");
      if (!token) { onLogout(); return; }

      connect();

      const authedFetch = (url) =>
        fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then(r => {
          if (r.status === 401 || r.status === 403) {
            console.warn("Auth fetch failed for", url, "— token may be expired");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            onLogout();
            throw new Error("Unauthorized");
          }
          return r.json();
        });

      authedFetch(`http://192.168.100.127:8080/auth/users`).then(setAllUsers).catch(() => {});
      authedFetch(`http://192.168.100.127:8080/auth/profile/${authUser}`).then(setMyProfile).catch(() => {});
      authedFetch(`http://192.168.100.127:8080/rooms`).then(setRooms).catch(() => {});
    }
  }, []); // eslint-disable-line

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const connect = () => {
    const token = authToken || localStorage.getItem("token");
    if (!token) {
      console.error("No auth token found — cannot connect WebSocket.");
      onLogout();
      return;
    }
    const client = new Client({
      webSocketFactory: () => new SockJS("http://192.168.100.127:8080/ws"),
      reconnectDelay: 5000,
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: async () => {
        try {
          const res = await fetch("http://192.168.100.127:8080/auth/history", { headers: { Authorization: `Bearer ${authToken}` } });
          const history = await res.json();
          setMessages(history.map((m) => ({ ...m, time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : getTime() })));
        } catch { /* ignore */ }

        client.subscribe("/topic/channel1", (res) => {
          const msg = JSON.parse(res.body);
          if (msg.type === "FRIEND_REQUEST") { if (msg.recipient === name) { const outKey = `friendreqs_out_${name}`; const existing = JSON.parse(localStorage.getItem(outKey) || "[]"); if (!existing.includes(msg.sender)) { localStorage.setItem(outKey, JSON.stringify([...existing, msg.sender])); setFriends(f => [...f]); } } return; }
          setMessages((prev) => [...prev, { ...msg, time: getTime() }]);
        });
        // call-notify subscription removed
        client.subscribe("/topic/presence", (res) => { const event = JSON.parse(res.body); setOnlineUsers(Array.from(event.onlineUsers || [])); });
        // Announce online immediately
        client.publish({ destination: "/app/presence", body: JSON.stringify({ sender: nameRef.current, status: "ONLINE" }) });
        // Heartbeat every 30s so server knows this tab is still alive
        const presenceHB = setInterval(() => {
          if (client.connected) client.publish({ destination: "/app/presence", body: JSON.stringify({ sender: nameRef.current, status: "ONLINE" }) });
        }, 30000);
        // Go offline when tab is hidden or closed
        const handleVisibility = () => {
          if (document.visibilityState === "hidden") client.publish({ destination: "/app/presence", body: JSON.stringify({ sender: nameRef.current, status: "OFFLINE" }) });
          else client.publish({ destination: "/app/presence", body: JSON.stringify({ sender: nameRef.current, status: "ONLINE" }) });
        };
        document.addEventListener("visibilitychange", handleVisibility);
        window.addEventListener("beforeunload", () => { client.publish({ destination: "/app/presence", body: JSON.stringify({ sender: nameRef.current, status: "OFFLINE" }) }); });
        // Store cleanup refs on the client object so the disconnect handler can reach them
        client._presenceHB = presenceHB;
        client._presenceVis = handleVisibility;
        client.subscribe("/topic/mood", (res) => { const event = JSON.parse(res.body); setMoodMap(prev => ({ ...prev, [event.username]: { mood: event.mood, emoji: event.emoji } })); });
        client.subscribe("/topic/moderation." + name, (res) => { const event = JSON.parse(res.body); if (event.type === "BANNED" || event.type === "KICKED") { alert("You have been " + event.type.toLowerCase() + ". Reason: " + event.reason); stompClient.current?.deactivate(); onLogout(); } else if (event.type === "MUTED" || event.type === "TIMEOUT") { alert("You have been timed out. Reason: " + event.reason); } });
        client.subscribe("/topic/role-update", (res) => { const event = JSON.parse(res.body); if (event.username === name) { setMyRole(event.newRole); } });
        client.subscribe("/topic/typing", (res) => {
          const event = JSON.parse(res.body);
          if (event.sender === nameRef.current) return;
          // Only show typing in channel view
          if (event.typing) { setTypingUsers(prev => prev.includes(event.sender) ? prev : [...prev, event.sender]); }
          else { setTypingUsers(prev => prev.filter(u => u !== event.sender)); }
        });
        client.subscribe(`/topic/dm.${name}`, (res) => { const msg = JSON.parse(res.body); const other = msg.sender === name ? msg.recipient : msg.sender; setDmMessages(prev => { const existing = prev[other] || []; if (msg.id && existing.some(m => m.id === msg.id)) return prev; return { ...prev, [other]: [...existing, { ...msg, time: getTime() }] }; }); if (msg.sender !== name) { setDmUnread(prev => ({ ...prev, [msg.sender]: (prev[msg.sender] || 0) + 1 })); if (Notification.permission === 'granted') { new Notification(`New message from ${msg.sender}`, { body: msg.content || '📎 Attachment' }); } } });
        client.subscribe(`/topic/dm.typing.${name}`, (res) => { const payload = JSON.parse(res.body); if (payload.sender === name) return; if (payload.typing) { setTypingUsers(prev => prev.includes(payload.sender) ? prev : [...prev, payload.sender]); } else { setTypingUsers(prev => prev.filter(u => u !== payload.sender)); } });
        client.subscribe(`/topic/dm.edit.${name}`, (res) => { const dm = JSON.parse(res.body); const other = dm.sender === name ? dm.recipient : dm.sender; setDmMessages(prev => ({ ...prev, [other]: (prev[other] || []).map(m => m.id === dm.id ? { ...m, content: dm.content, edited: true } : m) })); });
        client.subscribe(`/topic/dm.delete.${name}`, (res) => { const dm = JSON.parse(res.body); const other = dm.sender === name ? dm.recipient : dm.sender; setDmMessages(prev => ({ ...prev, [other]: (prev[other] || []).map(m => m.id === dm.id ? { ...m, content: 'This message was deleted.', deleted: true } : m) })); });
        client.subscribe("/topic/channel.notify", (res) => { setView(currentView => { if (currentView !== "channel") { setChannelUnread(prev => prev + 1); } return currentView; }); });
        client.subscribe("/topic/room.notify", (res) => { const event = JSON.parse(res.body); if (event.sender === name) return; setActiveRoom(currentRoom => { if (!currentRoom || currentRoom.id !== event.roomId) { setRoomUnread(prev => ({ ...prev, [event.roomId]: (prev[event.roomId] || 0) + 1 })); } return currentRoom; }); });
        client.subscribe("/topic/call-presence", (res) => { const event = JSON.parse(res.body); if (event.type === "JOIN") { setCallPresence(prev => ({ ...prev, [event.callRoom]: [...(prev[event.callRoom] || []).filter(u => u !== event.sender), event.sender] })); } else if (event.type === "LEAVE") { setCallPresence(prev => ({ ...prev, [event.callRoom]: (prev[event.callRoom] || []).filter(u => u !== event.sender) })); } });
        client.subscribe("/topic/reaction", (res) => { const event = JSON.parse(res.body); setReactions(prev => ({ ...prev, [event.messageId]: event.reactions || [] })); });
        client.subscribe("/topic/edit", (res) => { const event = JSON.parse(res.body); setMessages(prev => prev.map(m => m.id === event.messageId ? { ...m, content: event.newContent, edited: true, editCount: event.editCount || 1 } : m)); });
        client.subscribe("/topic/delete", (res) => { const event = JSON.parse(res.body); setMessages(prev => prev.map(m => m.id === event.messageId ? { ...m, content: "This message was deleted.", deleted: true } : m)); });

        
      },
      onStompError: (f) => {
        const msg = f.headers["message"] || "";
        console.error("STOMP error:", msg);
        if (
          msg.toLowerCase().includes("jwt") ||
          msg.toLowerCase().includes("expired") ||
          msg.toLowerCase().includes("unauthorized") ||
          msg.toLowerCase().includes("invalid")
        ) {
          console.warn("JWT rejected by server — logging out.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          stompClient.current?.deactivate();
          onLogout();
        }
      },
    });
    client.activate();
    stompClient.current = client;
  };

  const sendMessage = () => {
    if (editingMsg) { if (stompClient.current?.connected && editText.trim()) { stompClient.current.publish({ destination: "/app/edit", body: JSON.stringify({ messageId: editingMsg.id, newContent: editText.trim(), editor: name }) }); } setEditingMsg(null); setEditText(""); setMessage(""); return; }
    clearTimeout(typingTimeout.current);
    if (stompClient.current?.connected) stompClient.current.publish({ destination: "/app/typing", body: JSON.stringify({ sender: nameRef.current, typing: false }) });
    if (!stompClient.current?.connected || !message.trim()) return;
    if (view === "dm" && activeDmUser) { stompClient.current.publish({ destination: "/app/dm.send", body: JSON.stringify({ sender: name, recipient: activeDmUser, content: message.trim(), type: "TEXT" }) }); }
    else if (view === "room" && activeRoom) { stompClient.current.publish({ destination: "/app/room.send", body: JSON.stringify({ roomId: activeRoom.id, sender: name, content: message.trim(), type: "TEXT" }) }); }
    else { stompClient.current.publish({ destination: "/app/send", body: JSON.stringify({ sender: nameRef.current, content: message.trim() }) }); }
    setMessage("");
  };

  const openDm = (user) => { setActiveDmUser(user); setView("dm"); setTypingUsers([]); sessionStorage.setItem("view", "dm"); sessionStorage.setItem("activeDmUser", user); setDmUnread(prev => ({ ...prev, [user]: 0 })); setMessage(""); fetch(`http://192.168.100.127:8080/dm/history?userA=${name}&userB=${user}`, { headers: { Authorization: `Bearer ${authToken}` } }).then(r => r.json()).then(data => setDmMessages(prev => ({ ...prev, [user]: data.map(m => ({ ...m, time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : getTime() })) }))).catch(() => {}); };
  const openRoom = (room) => {
    setActiveRoom(room); setView("room"); setMessage(""); setShowRoomInfo(false); setTypingUsers([]); setTypingUsers([]);
    sessionStorage.setItem("view", "room"); sessionStorage.setItem("activeRoom", JSON.stringify(room));
    setRoomUnread(prev => ({ ...prev, [room.id]: 0 }));
    if (stompClient.current?.connected && !roomSubRef.current[room.id]) { roomSubRef.current[room.id] = stompClient.current.subscribe(`/topic/room.${room.id}`, (res) => { const msg = JSON.parse(res.body); setRoomMessages(prev => { const existing = prev[room.id] || []; if (existing.some(m => m.id === msg.id && msg.id)) return prev; return { ...prev, [room.id]: [...existing, { ...msg, time: getTime() }] }; }); }); }
    fetch(`http://192.168.100.127:8080/rooms/${room.id}/history`, { headers: { Authorization: `Bearer ${authToken}` } }).then(r => r.json()).then(data => setRoomMessages(prev => ({ ...prev, [room.id]: data.map(m => ({ ...m, time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : getTime() })) }))).catch(() => {});
  };

  const createRoom = async (roomData) => { const roomName = typeof roomData === "object" ? roomData.name : roomData; const desc = typeof roomData === "object" ? (roomData.template || "") : ""; const emoji = typeof roomData === "object" ? (roomData.emoji || "🌟") : "🌟"; const roomType = typeof roomData === "object" ? (roomData.type || "public") : "public"; try { const res = await fetch(`http://192.168.100.127:8080/rooms`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` }, body: JSON.stringify({ name: roomName, description: desc, emoji, roomType, createdBy: name }) }); const room = await res.json(); if (room.id) { setRooms(prev => [...prev, room]); setShowCreateRoom(false); openRoom(room); } } catch { } };

  const sendReaction = (messageId, emoji) => { if (!stompClient.current?.connected) return; stompClient.current.publish({ destination: "/app/react", body: JSON.stringify({ messageId, username: name, emoji }) }); };
  const startEdit = (msg) => { setEditingMsg(msg); setEditText(msg.content); setMessage(msg.content); setTimeout(() => inputRef.current?.focus(), 50); };
  const cancelEdit = () => { setEditingMsg(null); setEditText(""); setMessage(""); };
  const deleteMessage = (msgId) => { if (!stompClient.current?.connected) return; stompClient.current.publish({ destination: "/app/delete", body: JSON.stringify({ messageId: msgId, deletedBy: name }) }); };

  const getReactions = (msgId) => { const list = reactions[msgId] || []; const grouped = {}; list.forEach(r => { if (!grouped[r.emoji]) grouped[r.emoji] = { emoji: r.emoji, count: 0, users: [] }; grouped[r.emoji].count++; grouped[r.emoji].users.push(r.username); }); return Object.values(grouped); };

  const BASE_URL = "http://192.168.100.127:8080";
  const uploadFile = async (file, type) => {
    if (!stompClient.current?.connected) {
      alert("Not connected to server. Please wait and try again.");
      return;
    }
    try {
      const fd = new FormData(); fd.append("file", file);
      const token = authToken || localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/upload`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const rawUrl = await res.text();
      const fileUrl = rawUrl.startsWith("http") ? rawUrl : `${BASE_URL}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
      const payload = { sender: name, content: file.name || "", type, fileUrl };
      if (view === "dm" && activeDmUser) { stompClient.current.publish({ destination: "/app/dm.send", body: JSON.stringify({ ...payload, recipient: activeDmUser }) }); }
      else if (view === "room" && activeRoom) { stompClient.current.publish({ destination: "/app/room.send", body: JSON.stringify({ ...payload, roomId: activeRoom.id }) }); }
      else { stompClient.current.publish({ destination: "/app/send", body: JSON.stringify(payload) }); }
    } catch (err) { alert("Upload failed — is the server running?\n" + err.message); }
  };

  const handleImageChange = (e) => { const f = e.target.files[0]; if (f) uploadFile(f, "IMAGE"); e.target.value = ""; };
  const handleFileChange = (e) => { const f = e.target.files[0]; if (f) uploadFile(f, "FILE"); e.target.value = ""; };
  const handleVideoChange = (e) => { const f = e.target.files[0]; if (f) uploadFile(f, "VIDEO"); e.target.value = ""; };

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { alert("Your browser does not support microphone recording."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      const chunks = [];
      recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) { chunks.push(e.data); } };
      recorder.onstop = () => { stream.getTracks().forEach((track) => track.stop()); if (recordTimer.current) { clearInterval(recordTimer.current); } setRecording(false); setRecordSecs(0); const blob = new Blob(chunks, { type: "audio/webm" }); if (blob.size > 0) { const file = new File([blob], "voice.webm", { type: "audio/webm" }); uploadFile(file, "AUDIO"); } };
      recorder.start(); setRecording(true);
      let seconds = 0;
      recordTimer.current = setInterval(() => { seconds++; setRecordSecs(seconds); if (seconds >= 60 && recorder.state !== "inactive") { recorder.stop(); } }, 1000);
    } catch (error) { console.error("Microphone error:", error); alert("Microphone access denied or unavailable."); }
  };

  const stopRecording = () => { const recorder = recorderRef.current; if (recorder && recorder.state !== "inactive") { recorder.stop(); } };

  const joinVoiceChannel = () => { setCallMode("voice"); setCallKey(k => k + 1); };
  const startCall = mode => { setCallMode(mode); setCallKey(k => k + 1); };
  const endCall = (secs) => {
    if (localStreamRef.current) { localStreamRef.current.getTracks().forEach(t => t.stop()); localStreamRef.current = null; }
    if (secs > 0 && stompClient.current?.connected) { stompClient.current.publish({ destination: "/app/send", body: JSON.stringify({ sender: nameRef.current, content: `Call ended — ${Math.floor(secs / 60)}m ${secs % 60}s`, type: "CALL", callDuration: secs }) }); }
    setCallKey(k => k + 1); setCallMode(null); setCallMinimized(false);
    setCallPresence(prev => ({ ...prev, channel1: (prev.channel1 || []).filter(u => u !== name) }));
  };

  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const handleInput = e => {
    const val = e.target.value; setMessage(val); if (editingMsg) setEditText(val);
    e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 110) + "px";
    if (stompClient.current?.connected) { stompClient.current.publish({ destination: "/app/typing", body: JSON.stringify({ sender: nameRef.current, typing: true }) }); }
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => { if (stompClient.current?.connected) { stompClient.current.publish({ destination: "/app/typing", body: JSON.stringify({ sender: nameRef.current, typing: false }) }); } }, 2000);
  };

  const insertEmoji = (emoji) => { setMessage(prev => prev + emoji); inputRef.current?.focus(); };
  const handleDragOver = (e) => { e.preventDefault(); dragCounter.current++; setDragOver(true); };
  const handleDragLeave = (e) => { dragCounter.current--; if (dragCounter.current <= 0) { dragCounter.current = 0; setDragOver(false); } };
  const handleDrop = (e) => { e.preventDefault(); dragCounter.current = 0; setDragOver(false); const file = e.dataTransfer.files[0]; if (!file) return; if (file.type.startsWith("image/")) uploadFile(file, "IMAGE"); else if (file.type.startsWith("video/")) uploadFile(file, "VIDEO"); else if (file.type.startsWith("audio/")) uploadFile(file, "AUDIO"); else uploadFile(file, "FILE"); };

  const renderContent = (msg) => {
     if (msg.type === "POLL" && msg.pollData) {
      const poll = msg.pollData;
      const totalVotes = poll.totalVotes || 0;
      return (<div style={{ background: "var(--glass2)", border: "1px solid var(--glass-border)", borderRadius: 14, padding: "14px 16px", minWidth: 260, maxWidth: 340 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>📊 {poll.question}</div>
        {poll.options?.map(opt => { const pct = totalVotes > 0 ? Math.round((opt.voteCount / totalVotes) * 100) : 0; return (<div key={opt.id} style={{ marginBottom: 6 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}><span>{opt.text}</span><span style={{ color: "var(--text-muted)" }}>{pct}%</span></div><div style={{ height: 6, borderRadius: 3, background: "var(--glass-border)", overflow: "hidden" }}><div style={{ height: "100%", width: pct + "%", background: "var(--bubble-me)", transition: "width 0.3s" }} /></div></div>); })}
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>{totalVotes} vote{totalVotes !== 1 ? "s" : ""} · {poll.active ? "Open" : "Closed"}</div>
      </div>);
    }
    if (msg.deleted) return <span style={{ opacity: 0.6, fontStyle: "italic", fontSize: 13 }}>🚫 This message was deleted</span>;
    if (msg.type === "CALL") return (<div style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.85 }}><IcoPhone color={msg.sender === name ? "#fff" : "var(--accent)"} size={14} /><span style={{ fontSize: 13 }}>{msg.content}</span></div>);
    const resolveUrl = (url) => { if (!url) return ""; if (url.startsWith("http")) { const path = url.replace(/^https?:\/\/[^/]+/, ""); return `http://192.168.100.127:8080${path}`; } return `http://192.168.100.127:8080${url.startsWith("/") ? "" : "/"}${url}`; };
    if (msg.type === "IMAGE") return (<img src={resolveUrl(msg.fileUrl)} alt="img" className="msg-img" onError={(e) => { e.target.style.border = "2px solid red"; e.target.alt = "Failed: " + resolveUrl(msg.fileUrl); }} />);
    if (msg.type === "FILE") return (<a href={resolveUrl(msg.fileUrl)} target="_blank" rel="noreferrer" className="msg-file"><span className="msg-file-ic"><IcoFile color="#fff" size={18} /></span><span>{msg.content || "Download File"}</span></a>);
    if (msg.type === "AUDIO") return (<audio controls src={resolveUrl(msg.fileUrl)} className="msg-audio" />);
    if (msg.type === "VIDEO") { const msgKey = msg.id || msg.fileUrl; return (<div style={{ position: "relative", display: "inline-block" }}><video ref={el => { if (el) videoRefs.current[msgKey] = el; }} src={resolveUrl(msg.fileUrl)} controls preload="metadata" style={{ maxWidth: 280, maxHeight: 200, borderRadius: 14, display: "block", boxShadow: "0 5px 22px rgba(0,0,0,0.28)" }} /><button onClick={() => videoRefs.current[msgKey]?.requestFullscreen()} style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.55)", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, padding: "3px 7px", cursor: "pointer", lineHeight: 1 }} title="Fullscreen">⛶</button></div>); }
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = (msg.content || "").split(urlRegex);
    return <>{parts.map((part, i) => urlRegex.test(part) ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "underline" }}>{part}</a> : part)}{msg.edited && <span style={{ fontSize: 10, opacity: 0.5, marginLeft: 5, fontStyle: "italic" }}>(edited)</span>}</>;
  };

  useEffect(() => () => {
    if (stompClient.current) {
      if (stompClient.current.connected) stompClient.current.publish({ destination: "/app/presence", body: JSON.stringify({ sender: nameRef.current, status: "OFFLINE" }) });
      clearInterval(stompClient.current._presenceHB);
      document.removeEventListener("visibilitychange", stompClient.current._presenceVis);
      stompClient.current.deactivate();
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement.style;
    const fontSizeMap = { small: "12px", medium: "14.5px", large: "17px" };
    const paddingMap  = { small: "8px 12px", medium: "11px 15px", large: "13px 18px" };
    const scale = { small: 0.85, medium: 1, large: 1.18 }[fontSize] || 1;
    root.setProperty("--bubble-font-size", fontSizeMap[fontSize] || fontSizeMap.medium);
    root.setProperty("--bubble-padding",   compactMode ? "5px 10px" : (paddingMap[fontSize] || paddingMap.medium));
    root.setProperty("--bubble-radius",    "22px");
    root.setProperty("--bubble-tail-radius", "5px");
    root.setProperty("--chat-font-scale",  String(scale));
  }, [fontSize, compactMode]);

  const currentMessages = view === "dm" && activeDmUser ? (dmMessages[activeDmUser] || []) : view === "room" && activeRoom ? (roomMessages[activeRoom.id] || []) : messages;

  const saveFriends = (list) => { setFriends(list); localStorage.setItem(`friends_${authUser}`, JSON.stringify(list)); };
  const saveReqs = (list) => { setFriendReqs(list); localStorage.setItem(`friendreqs_${authUser}`, JSON.stringify(list)); };
  const sendFriendReq = (user) => { if (friends.includes(user) || friendReqs.includes(user)) return; const outKey = `friendreqs_out_${user}`; const existing = JSON.parse(localStorage.getItem(outKey) || "[]"); if (!existing.includes(authUser)) { localStorage.setItem(outKey, JSON.stringify([...existing, authUser])); } saveReqs([...friendReqs, user]); if (stompClient.current?.connected) { stompClient.current.publish({ destination: "/app/send", body: JSON.stringify({ sender: name, content: `__FRIEND_REQUEST__`, type: "FRIEND_REQUEST", recipient: user }) }); } };
  const acceptFriendReq = (user) => { saveFriends([...friends, user]); const incoming = JSON.parse(localStorage.getItem(`friendreqs_out_${authUser}`) || "[]"); localStorage.setItem(`friendreqs_out_${authUser}`, JSON.stringify(incoming.filter(u => u !== user))); };
  const removeFriend = (user) => saveFriends(friends.filter(u => u !== user));
  const incomingReqs = JSON.parse(localStorage.getItem(`friendreqs_out_${authUser}`) || "[]");
  const IC = dark ? "#a080d0" : "#7c4fbf";

  const runMsgSearch = (q) => { setMsgSearchQ(q); if (!q.trim()) { setMsgSearchResults([]); setMsgSearchIdx(-1); return; } const lower = q.toLowerCase(); const hits = currentMessages.map((m, i) => ({ i, m })).filter(({ m }) => m.content && m.content.toLowerCase().includes(lower)); setMsgSearchResults(hits.map(h => h.i)); setMsgSearchIdx(hits.length > 0 ? hits.length - 1 : -1); if (hits.length > 0) scrollToMsg(hits[hits.length - 1]); };
  const scrollToMsg = (idx) => { const el = msgRefs.current[idx]; if (el) el.scrollIntoView({ behavior: "smooth", block: "center" }); };
  const searchNext = () => { if (!msgSearchResults.length) return; const next = msgSearchIdx <= 0 ? msgSearchResults.length - 1 : msgSearchIdx - 1; setMsgSearchIdx(next); scrollToMsg(msgSearchResults[next]); };
  const searchPrev = () => { if (!msgSearchResults.length) return; const prev = msgSearchIdx >= msgSearchResults.length - 1 ? 0 : msgSearchIdx + 1; setMsgSearchIdx(prev); scrollToMsg(msgSearchResults[prev]); };

  useEffect(() => { if (!messages.length || !stompClient.current?.connected) return; messages.forEach(msg => { if (msg.sender !== name && msg.id && msg.status !== "SEEN") { stompClient.current.publish({ destination: "/app/seen", body: JSON.stringify({ messageId: msg.id, username: name }) }); } }); }, [messages]); // eslint-disable-line

  useEffect(() => { const handler = (e) => { if (emojiRef.current && !emojiRef.current.contains(e.target)) { setShowEmoji(false); } setShowProfilePopup(false); setShowStatusMenu(false); }; document.addEventListener("mousedown", handler); return () => document.removeEventListener("mousedown", handler); }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (editingMsg)     { setEditingMsg(null); setEditText(""); setMessage(""); return; }
      if (showSettings)   { setShowSettings(false); return; }
      if (showProfile)    { setShowProfile(false); return; }
      if (showCreateRoom) { setShowCreateRoom(false); return; }
      if (showMsgSearch)  { setShowMsgSearch(false); setMsgSearchQ(""); setMsgSearchResults([]); return; }
      if (showEmoji)      { setShowEmoji(false); return; }
      if (showMoodPicker) { setShowMoodPicker(false); return; }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editingMsg, showSettings, showProfile, showCreateRoom, showMsgSearch, showEmoji, showMoodPicker]);

  // video call rendered inline below
  return (
    <>
      <style>{buildCSSBody(theme)}</style>
      <BackgroundCanvas dark={dark} />
      
      <div className="page">
        <div className="chat-window">
          <div className="sidebar" style={{ flexDirection: "column", background: "var(--glass2)", borderRight: "1px solid var(--divider)", width: 240, minWidth: 240, maxWidth: 240, flexShrink: 0, overflow: "hidden", display: (window.innerWidth < 640 && view !== "channel" && view !== "friends") ? "none" : "flex" }}>
            <div style={{ padding: "0 10px", height: 48, borderBottom: "1px solid var(--divider)", flexShrink: 0, display: "flex", alignItems: "center", background: "var(--glass2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: dark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.08)", borderRadius: 6, padding: "5px 10px", flex: 1, cursor: "text" }} onClick={() => {}}>
                <IcoSearch color="var(--text-muted)" size={13} />
                <input placeholder="Find or start a conversation" value={searchQ} onChange={e => setSearchQ(e.target.value)} style={{ background: "transparent", border: "none", outline: "none", fontFamily: "inherit", fontSize: 13, color: "var(--text)", width: "100%" }} />
              </div>
            </div>
            <div className="contact-list" style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
              <div onClick={() => { setView("friends"); setMessage(""); sessionStorage.setItem("view", "friends"); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, cursor: "pointer", marginBottom: 2, background: view === "friends" ? "rgba(124,58,237,0.18)" : "transparent", transition: "background 0.15s", position: "relative" }} onMouseEnter={e => { if (view !== "friends") e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }} onMouseLeave={e => { if (view !== "friends") e.currentTarget.style.background = "transparent"; }}>
                {view === "friends" && <div style={{ position: "absolute", left: 0, top: "20%", height: "60%", width: 3, background: "var(--accent)", borderRadius: "0 3px 3px 0" }} />}
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bubble-me)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>👥</div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Friends</div></div>
                {incomingReqs.length > 0 && <div style={{ minWidth: 18, height: 18, borderRadius: 999, background: "var(--red)", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{incomingReqs.length}</div>}
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--accent)", opacity: 0.7, padding: "14px 10px 5px", display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 8, opacity: 0.6 }}>✦</span> Channels</div>
              <div onClick={() => { setView("channel"); setMessage(""); setChannelUnread(0); setTypingUsers([]); sessionStorage.setItem("view", "channel"); sessionStorage.removeItem("activeDmUser"); sessionStorage.removeItem("activeRoom"); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, cursor: "pointer", marginBottom: 2, background: view === "channel" ? "rgba(124,58,237,0.18)" : "transparent", transition: "background 0.15s", position: "relative" }} onMouseEnter={e => { if (view !== "channel") e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }} onMouseLeave={e => { if (view !== "channel") e.currentTarget.style.background = "transparent"; }}>
                {view === "channel" && <div style={{ position: "absolute", left: 0, top: "20%", height: "60%", width: 3, background: "var(--accent)", borderRadius: "0 3px 3px 0" }} />}
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IcoHash color="#a855f7" size={15} /></div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Channel 1</div><div style={{ fontSize: 11, color: "var(--text-sub)" }}>General chat</div></div>
                {channelUnread > 0 && <div style={{ minWidth: 18, height: 18, borderRadius: 999, background: "var(--accent)", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{channelUnread}</div>}
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "rgba(168,85,247,0.5)", padding: "14px 10px 5px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 8, opacity: 0.6 }}>✦</span> Rooms</span>
                <button onClick={() => setShowCreateRoom(true)} style={{ background: "var(--accent-soft)", border: "1px solid var(--glass-border)", borderRadius: 6, width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}><IcoPlus color="var(--accent)" size={11} /></button>
              </div>
              {rooms.map(room => (<div key={room.id} onClick={() => openRoom(room)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, cursor: "pointer", marginBottom: 2, background: view === "room" && activeRoom?.id === room.id ? "rgba(124,58,237,0.18)" : "transparent", transition: "background 0.15s", position: "relative" }} onMouseEnter={e => { if (!(view === "room" && activeRoom?.id === room.id)) e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }} onMouseLeave={e => { if (!(view === "room" && activeRoom?.id === room.id)) e.currentTarget.style.background = "transparent"; }}>
              
                <div style={{ width: 32, height: 32, borderRadius: 10, background: room.iconUrl ? "transparent" : `linear-gradient(135deg,${["#7c3aed","#06b6d4","#ec4899","#059669","#f59e0b"][room.id % 5]},${["#a855f7","#7c3aed","#a855f7","#06b6d4","#ec4899"][room.id % 5]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, overflow: "hidden" }}>{room.iconUrl ? <img src={room.iconUrl.startsWith("http") ? room.iconUrl : `http://192.168.100.127:8080${room.iconUrl}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} /> : (room.emoji || "🌟")}</div>
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{room.name}</div><div style={{ fontSize: 11, color: "var(--text-sub)" }}>{room.description || "Room"}</div></div>
                {roomUnread[room.id] > 0 && <div style={{ minWidth: 18, height: 18, borderRadius: 999, background: "var(--accent)", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{roomUnread[room.id]}</div>}
              </div>))}
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--accent)", opacity: 0.7, padding: "14px 10px 5px", display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 8, opacity: 0.6 }}>✦</span> Direct Messages</div>
              {friends.filter(u => u !== name && (!searchQ || u.toLowerCase().includes(searchQ.toLowerCase()))).map((user, i) => { const gradients = ["linear-gradient(135deg,#7c3aed,#a855f7)","linear-gradient(135deg,#06b6d4,#7c3aed)","linear-gradient(135deg,#ec4899,#a855f7)","linear-gradient(135deg,#059669,#06b6d4)","linear-gradient(135deg,#f59e0b,#ec4899)"]; const grad = gradients[user.charCodeAt(0) % gradients.length]; return (<div key={i} onClick={() => openDm(user)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, cursor: "pointer", marginBottom: 2, background: view === "dm" && activeDmUser === user ? "rgba(124,58,237,0.18)" : "transparent", transition: "background 0.15s", position: "relative" }} onMouseEnter={e => { if (!(view === "dm" && activeDmUser === user)) e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }} onMouseLeave={e => { if (!(view === "dm" && activeDmUser === user)) e.currentTarget.style.background = "transparent"; }}>{view === "dm" && activeDmUser === user && <div style={{ position: "absolute", left: 0, top: "20%", height: "60%", width: 3, background: "var(--accent)", borderRadius: "0 3px 3px 0" }} />}<div style={{ position: "relative", width: 32, height: 32, borderRadius: "50%", background: grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{user[0].toUpperCase()}<div style={{ position: "absolute", bottom: 0, right: 0, width: 9, height: 9, borderRadius: "50%", background: onlineUsers.includes(user) ? "#10b981" : "rgba(255,255,255,0.2)", border: "2px solid var(--glass2)", boxShadow: onlineUsers.includes(user) ? "0 0 5px #10b981" : "none" }} /></div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user}</div><div style={{ fontSize: 11, color: onlineUsers.includes(user) ? "#10b981" : "var(--text-sub)" }}>{onlineUsers.includes(user) ? "● Active" : "○ Offline"}</div></div>{dmUnread[user] > 0 && <div style={{ minWidth: 18, height: 18, borderRadius: 999, background: "var(--accent)", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{dmUnread[user]}</div>}</div>); })}
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--accent)", opacity: 0.7, padding: "14px 10px 5px", display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 8, opacity: 0.6 }}>✦</span> Online — {onlineUsers.filter(u => u !== name && friends.includes(u)).length}</div>
              {onlineUsers.filter(u => u !== name && friends.includes(u)).map((user, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, marginBottom: 2 }}><div style={{ position: "relative", width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{user[0].toUpperCase()}<div style={{ position: "absolute", bottom: 0, right: 0, width: 9, height: 9, borderRadius: "50%", background: "#10b981", border: "2px solid var(--glass2)", boxShadow: "0 0 5px #10b981" }} /></div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user}{user === name ? " (you)" : ""}</div><div style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}>
                {user === name ? <><span style={{ fontSize: 10 }}>🟢</span><span style={{ color: "#10b981", fontWeight: 600 }}>ONLINE</span></> : typingUsers.includes(user) ? <span style={{ color: "var(--accent)" }}>✍️ typing…</span> : <>
                  <span style={{ fontSize: 10 }}>{moodMap[user]?.emoji || "🟢"}</span>
                  <span style={{ color: ({ONLINE:"#10b981",FOCUSED:"#6366f1",GAMING:"#8b5cf6",STUDYING:"#f59e0b",BUSY:"#ef4444",CHILL:"#06b6d4",INVISIBLE:"#6b7280"})[moodMap[user]?.mood] || "#10b981", fontWeight: 600 }}>{moodMap[user]?.mood || "ONLINE"}</span>
                </>}
              </div></div></div>))}
            </div>
            <div style={{ padding: "8px 10px", borderTop: "1px solid var(--divider)", display: "flex", alignItems: "center", gap: 8, flexShrink: 0, background: "var(--glass2)", position: "relative" }}>
              {/* Discord-style profile popup */}
              {showProfilePopup && (
                <div style={{ position: "fixed", bottom: 68, left: 8, zIndex: 1000, width: 240, background: dark ? "#18141f" : "#f2f0ff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.7)", overflow: "hidden" }}>
                  {/* Banner + Avatar */}
                  <div style={{ height: 56, background: "linear-gradient(135deg,#5865f2,#7b8cff)", position: "relative", flexShrink: 0 }}>
                    <div style={{ position: "absolute", bottom: -22, left: 12, width: 50, height: 50, borderRadius: "50%", background: dark ? "#18141f" : "#f2f0ff", padding: 3, boxSizing: "border-box" }}>
                      <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "var(--bubble-me)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", position: "relative" }}>
                        {myProfile?.avatarUrl ? <img src={myProfile.avatarUrl.startsWith("http") ? myProfile.avatarUrl : `http://192.168.100.127:8080${myProfile.avatarUrl}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : name[0]?.toUpperCase()}
                        <div style={{ position: "absolute", bottom: 1, right: 1, width: 13, height: 13, borderRadius: "50%", background: ({ONLINE:"#23a55a",IDLE:"#f0b232",DND:"#ed4245",INVISIBLE:"#80848e"})[myMood] || "#23a55a", border: `3px solid ${dark ? "#18141f" : "#f2f0ff"}` }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "30px 12px 8px" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: dark ? "#fff" : "#111" }}>{myProfile?.displayName || name}</div>
                    <div style={{ fontSize: 12, color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{name}</div>
                  </div>
                  <div style={{ height: 1, background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", margin: "4px 0" }} />
                  <div style={{ padding: "4px 6px 8px" }}>
                    <button onClick={() => { setShowProfile(true); setShowProfilePopup(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, border: "none", background: "transparent", color: dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", fontFamily: "inherit", fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left" }} onMouseEnter={e => e.currentTarget.style.background=dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.06)"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                      ✏️ Edit Profile
                    </button>
                    <button onClick={() => setShowStatusMenu(v => !v)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, border: "none", background: "transparent", color: dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", fontFamily: "inherit", fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left" }} onMouseEnter={e => e.currentTarget.style.background=dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.06)"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                      <span style={{ width: 12, height: 12, borderRadius: "50%", background: ({ONLINE:"#23a55a",IDLE:"#f0b232",DND:"#ed4245",INVISIBLE:"#80848e"})[myMood] || "#23a55a", flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{({ONLINE:"Online",IDLE:"Idle",DND:"Do Not Disturb",INVISIBLE:"Invisible"})[myMood] || "Online"}</span>
                      <span style={{ opacity: 0.3, fontSize: 11 }}>›</span>
                    </button>
                    {showStatusMenu && (
                      <div style={{ background: dark ? "#111018" : "#eeeaf8", borderRadius: 8, margin: "2px 0 4px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)" }}>
                        {[
                          { v:"ONLINE",    label:"Online",          desc:"",                                            dot:"#23a55a" },
                          { v:"IDLE",      label:"Idle",             desc:"",                                            dot:"#f0b232" },
                          { v:"DND",       label:"Do Not Disturb",   desc:"You will not receive desktop notifications",  dot:"#ed4245" },
                          { v:"INVISIBLE", label:"Invisible",        desc:"You will appear offline",                     dot:"#80848e" },
                        ].map(s => (
                          <button key={s.v} onClick={() => { setMyMood(s.v); fetch(`http://192.168.100.127:8080/auth/mood`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` }, body: JSON.stringify({ mood: s.v }) }).catch(() => {}); if (stompClient.current?.connected) stompClient.current.publish({ destination: "/app/presence", body: JSON.stringify({ sender: nameRef.current, status: s.v === "INVISIBLE" ? "OFFLINE" : "ONLINE" }) }); setShowStatusMenu(false); setShowProfilePopup(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", border: "none", background: myMood === s.v ? "rgba(88,101,242,0.15)" : "transparent", color: dark ? "#fff" : "#111", fontFamily: "inherit", fontSize: 13, cursor: "pointer", textAlign: "left" }} onMouseEnter={e => { if (myMood !== s.v) e.currentTarget.style.background=dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)"; }} onMouseLeave={e => { if (myMood !== s.v) e.currentTarget.style.background="transparent"; }}>
                            <span style={{ width: 11, height: 11, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{s.label}</div>{s.desc && <div style={{ fontSize: 11, color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)", marginTop: 1 }}>{s.desc}</div>}</div>
                            {myMood === s.v && <span style={{ color: "#23a55a", fontSize: 14 }}>✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                    <div style={{ height: 1, background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", margin: "4px 0" }} />
                    <button onClick={() => { setShowSettings(true); setShowProfilePopup(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, border: "none", background: "transparent", color: dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", fontFamily: "inherit", fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left" }} onMouseEnter={e => e.currentTarget.style.background=dark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.06)"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                      ⚙️ Settings
                    </button>
                    <button onClick={() => { if (callMode) endCall(0); stompClient.current?.deactivate(); onLogout(); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, border: "none", background: "transparent", color: "#ed4245", fontFamily: "inherit", fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left" }} onMouseEnter={e => e.currentTarget.style.background="rgba(237,66,69,0.1)"} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                      🚪 Log Out
                    </button>
                  </div>
                </div>
              )}
              {/* Avatar button */}
              <div onClick={e => { e.stopPropagation(); setShowProfilePopup(v => !v); setShowStatusMenu(false); }} style={{ position: "relative", width: 34, height: 34, borderRadius: "50%", background: "var(--bubble-me)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", flexShrink: 0, overflow: "hidden" }}>
                {myProfile?.avatarUrl ? <img src={myProfile.avatarUrl.startsWith("http") ? myProfile.avatarUrl : `http://192.168.100.127:8080${myProfile.avatarUrl}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} /> : name[0]?.toUpperCase()}
                <div style={{ position: "absolute", bottom: 1, right: 1, width: 11, height: 11, borderRadius: "50%", background: ({ONLINE:"#23a55a",IDLE:"#f0b232",DND:"#ed4245",INVISIBLE:"#80848e"})[myMood] || "#23a55a", border: "2px solid var(--glass2)" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={e => { e.stopPropagation(); setShowProfilePopup(v => !v); setShowStatusMenu(false); }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{myProfile?.displayName || name}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>{name}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); setShowSettings(true); }} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 16, padding: "3px", opacity: 0.55, borderRadius: 6 }} title="Settings">⚙️</button>
            </div>'
          </div>

          {view === "friends" && (<FriendsPage allUsers={allUsers} onlineUsers={onlineUsers} friends={friends} friendReqs={friendReqs} incomingReqs={incomingReqs} onSendReq={sendFriendReq} onAccept={acceptFriendReq} onRemove={removeFriend} onDm={(user) => { openDm(user); }} name={name} />)}

          {view === "room" && showRoomInfo && activeRoom && (<RoomInfoPanel room={activeRoom} name={name} authToken={authToken} onClose={() => setShowRoomInfo(false)} onUpdateRoom={(updated) => { setActiveRoom(updated); setRooms(prev => prev.map(r => r.id === updated.id ? updated : r)); }} />)}

          {view !== "friends" && <div className="chat-panel" onDragOver={handleDragOver} style={{ display: (window.innerWidth < 640 && view === "channel") ? "none" : "flex", flex: 1, flexDirection: "column", overflow: "hidden", minWidth: 0, position: "relative" }} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            {dragOver && (<div style={{ position: "absolute", inset: 0, zIndex: 20, background: "rgba(196,109,255,0.13)", border: "2.5px dashed var(--accent)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}><div style={{ background: "var(--glass2)", borderRadius: 16, padding: "22px 36px", textAlign: "center", border: "1px solid var(--glass-border)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}><div style={{ fontSize: 36, marginBottom: 8 }}>📎</div><div style={{ fontSize: 15, fontWeight: 700, color: "var(--accent)" }}>Drop to send</div><div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Image, video, audio, or file</div></div></div>)}
            <div className="chat-hdr">
              {(view === "dm" || view === "room") && (<button className="h-btn" onClick={() => { setView("channel"); setMessage(""); sessionStorage.setItem("view", "channel"); sessionStorage.removeItem("activeDmUser"); sessionStorage.removeItem("activeRoom"); }} style={{ marginRight: 4 }}><IcoBack color={IC} size={18} /></button>)}
              <div className="h-av">{view === "room" ? <IcoHash color="#fff" size={16} /> : (view === "dm" ? activeDmUser?.[0]?.toUpperCase() : "C")}</div>
              <div className="h-info"><div className="h-name">{view === "dm" ? activeDmUser : view === "room" ? `# ${activeRoom?.name}` : "Channel 1"}</div><div className="h-status">{(view === "channel" || (view === "dm" && onlineUsers.includes(activeDmUser))) && <span className="h-dot" />}{view === "dm" ? (onlineUsers.includes(activeDmUser) ? "Online" : "Offline") : view === "room" ? (activeRoom?.description || "Room") : "Active now"}</div></div>
              <div className="h-actions">
                <button className="h-btn" title={callMode === "voice" ? "Leave voice channel" : "Join voice channel"} style={callMode === "voice" ? { color: "#22c55e" } : {}} onClick={() => callMode === "voice" ? endCall(0) : joinVoiceChannel()}><IcoPhone color={callMode === "voice" ? "#22c55e" : IC} size={19} /></button>
                <button className="h-btn" title={callMode === "video" ? "End video call" : "Start video call"} style={callMode === "video" ? { color: "#22c55e" } : {}} onClick={() => callMode === "video" ? endCall(0) : startCall("video")}><IcoVideo color={callMode === "video" ? "#22c55e" : IC} size={19} /></button>
                <button className="h-btn" title="Search messages" onClick={() => { setShowMsgSearch(v => !v); setMsgSearchQ(""); setMsgSearchResults([]); setMsgSearchIdx(-1); }}><IcoSearch color={IC} size={17} /></button>
                <button className="h-btn" title="Room Info" onClick={() => { if (view === "room" && activeRoom) setShowRoomInfo(v => !v); }}><IcoInfo color={view === "room" && showRoomInfo ? "var(--accent)" : IC} size={19} /></button>
              </div>
            </div>
            {showMsgSearch && (<div className="msg-search-bar"><input className="msg-search-input" placeholder="Search messages…" value={msgSearchQ} onChange={e => runMsgSearch(e.target.value)} autoFocus /><div className="msg-search-nav"><button className="msg-search-btn" onClick={searchPrev} title="Previous">▲</button><span className="msg-search-count">{msgSearchResults.length === 0 ? "0/0" : `${msgSearchResults.length - msgSearchIdx}/${msgSearchResults.length}`}</span><button className="msg-search-btn" onClick={searchNext} title="Next">▼</button></div><button className="msg-search-btn" onClick={() => { setShowMsgSearch(false); setMsgSearchQ(""); setMsgSearchResults([]); setMsgSearchIdx(-1); }}>✕</button></div>)}
            <div className="msgs" style={{ paddingBottom: (callMode && callMinimized) ? 52 : undefined }}>
              {currentMessages.length === 0 ? (
                <div className="empty-wrap"><div className="empty-av">{view === "room" ? "#" : view === "dm" ? activeDmUser?.[0]?.toUpperCase() : "C"}</div><div className="empty-name">{view === "dm" ? activeDmUser : view === "room" ? `# ${activeRoom?.name}` : "Channel 1"}</div><div className="empty-hint">No messages yet — say something! 👋</div></div>
              ) : (
                currentMessages.map((msg, i) => {
                  const me = msg.sender === name; const msgReactions = getReactions(msg.id); const isSearchHit = msgSearchResults.includes(i); const isActiveHit = msgSearchResults[msgSearchIdx] === i;
                  return (<div key={i} ref={el => msgRefs.current[i] = el} className={`msg-group ${me ? "me" : "other"}`} style={isActiveHit ? { outline: "2px solid var(--accent)", borderRadius: 14, outlineOffset: 2 } : isSearchHit ? { outline: "1px solid rgba(196,109,255,0.4)", borderRadius: 14, outlineOffset: 2 } : {}}>
                    {!me && <div className="msg-sender">{msg.sender}</div>}
                    <div className="msg-row">{!me && <div className="mini-av">{initial(msg.sender)}</div>}
                      <div className={`msg-bubble${msg.type === "IMAGE" ? " is-image" : ""}${msg.deleted ? " deleted" : ""}`}>
                        {renderContent(msg)}
                        {!msg.deleted && (<div className="msg-actions"><button className="action-btn" title="React" onClick={() => sendReaction(msg.id, "❤️")}><span style={{ fontSize: 13 }}>❤️</span></button><button className="action-btn" title="React 👍" onClick={() => sendReaction(msg.id, "👍")}><span style={{ fontSize: 13 }}>👍</span></button>{me && !msg.deleted && !msg.fileUrl && (!msg.type || msg.type === "TEXT") && (<button className="action-btn" title="Edit" onClick={() => startEdit(msg)}><IcoEdit color={IC} size={14} /></button>)}{me && !msg.deleted && <button className="action-btn" title="Delete" onClick={() => deleteMessage(msg.id)}><IcoTrash size={14} /></button>}</div>)}
                      </div>
                    </div>
                    {msgReactions.length > 0 && (<div className="reactions-row" style={{ paddingLeft: me ? 0 : 34 }}>{msgReactions.map((r, ri) => (<button key={ri} className={`reaction-chip${r.users.includes(name) ? " mine" : ""}`} onClick={() => sendReaction(msg.id, r.emoji)} title={r.users.join(", ")}>{r.emoji}<span className="reaction-count">{r.count}</span></button>))}</div>)}
                    <div className="msg-time">{msg.time}{me && view === "channel" && (<span style={{ marginLeft: 5, fontSize: 11 }}>{msg.status === "SEEN" ? <span style={{ color: "#60a5fa" }}>✓✓</span> : msg.status === "DELIVERED" ? <span style={{ color: "var(--text-muted)" }}>✓✓</span> : <span style={{ color: "var(--text-muted)" }}>✓</span>}</span>)}</div>
                  </div>);
                })
              )}
              {typingUsers.length > 0 && (<div className="msg-group other" style={{ marginBottom: 4 }}><div className="msg-row"><div className="mini-av">{typingUsers[0][0].toUpperCase()}</div><div className="msg-bubble" style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 5 }}><span style={{ fontSize: 12, color: "var(--text-sub)" }}>{typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing</span><span style={{ display: "flex", gap: 3, alignItems: "center" }}>{[0, 1, 2].map(i => (<span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--text-muted)", display: "inline-block", animation: `blink 1.2s infinite ${i * 0.2}s` }} />))}</span></div></div></div>)}
              <div ref={messagesEnd} />
            </div>
            <div className="input-area" style={{ position: "relative" }}>
              {editingMsg && (<div className="edit-bar">✏️ Editing message<button onClick={cancelEdit}>✕ Cancel</button></div>)}
              <div className="input-row">
                <textarea ref={inputRef} className="msg-ta" value={message} onChange={handleInput} onKeyDown={handleKeyDown} placeholder="Message…" rows={1} />
                <div className="input-icons">
                  <button className="ico-btn" title="Send photo" onClick={() => imageInputRef.current.click()}><IcoImage color={IC} size={20} /></button>
                  <button className="ico-btn" title="Attach file" onClick={() => fileInputRef.current.click()}><IcoPaperclip color={IC} size={20} /></button>
                  <button className="ico-btn" title="Send video" onClick={() => videoInputRef.current.click()}><IcoVideo color={IC} size={20} /></button>
                  <button className={`ico-btn${recording ? " rec" : ""}`} title={recording ? "Stop recording" : "Voice message"} onClick={recording ? stopRecording : startRecording}>{recording ? <IcoMicOff color="#ef4444" size={20} /> : <IcoMic color={IC} size={20} />}</button>
                  <button className="ico-btn" title="Emoji" onClick={(e) => { e.stopPropagation(); setShowEmoji(v => !v); }}><IcoSmile color={IC} size={20} /></button>
                  <button className="send-btn" title="Send" onClick={sendMessage}><IcoSend color="#fff" size={17} /></button>
                </div>
              </div>
              {recording && (<div className="rec-badge"><span className="rec-dot" /> Recording {recordSecs}s — tap mic to stop</div>)}
              {showEmoji && (<EmojiPicker onSelect={insertEmoji} emojiRef={emojiRef} />)}
            </div>
          </div>}
          <input type="file" accept="image/*" ref={imageInputRef} style={{ display: "none" }} onChange={handleImageChange} />
          <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
          <input type="file" accept="video/*" ref={videoInputRef} style={{ display: "none" }} onChange={handleVideoChange} />
        </div>
        {callMode && !callMinimized && (
          <CallOverlay key={callKey} mode={callMode} myName={name} stompClient={stompClient} onEnd={endCall} onMinimize={() => setCallMinimized(true)} />
        )}
        {callMode && callMinimized && (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200, background: "#1e1f22", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "0 16px", height: 52, display: "flex", alignItems: "center", gap: 12, fontFamily: "inherit" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#23a55a", boxShadow: "0 0 6px #23a55a", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#dbdee1" }}>{callMode === "video" ? "📹 Video Call" : "🔊 Voice Connected"}</div>
              <div style={{ fontSize: 11, color: "#949ba4" }}>Channel 1</div>
            </div>
            <button onClick={() => setCallMinimized(false)} title="Open call" style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: "rgba(255,255,255,0.08)", cursor: "pointer", color: "#dbdee1", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>↑</button>
            <button onClick={() => endCall(0)} style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: "#da373c", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><IcoPhoneOff color="#fff" size={16} /></button>
          </div>
        )}
      </div>
      {showSettings && (<SettingsModal onClose={() => setShowSettings(false)} tab={settingsTab} setTab={setSettingsTab} dark={dark} setDark={setDark} theme={theme} setTheme={setTheme} authToken={authToken} authUser={authUser} myProfile={myProfile} onUpdateProfile={(data) => setMyProfile(prev => ({ ...prev, ...data }))} fontSize={fontSize} setFontSize={(v) => { setFontSize(v); localStorage.setItem("fontSize", v); }} notifSound={notifSound} setNotifSound={(v) => { setNotifSound(v); localStorage.setItem("notifSound", String(v)); }} compactMode={compactMode} setCompactMode={(v) => { setCompactMode(v); localStorage.setItem("compactMode", String(v)); }} privacyDm={privacyDm} setPrivacyDm={(v) => { setPrivacyDm(v); localStorage.setItem("privacyDm", v); }} privacyFriend={privacyFriend} setPrivacyFriend={(v) => { setPrivacyFriend(v); localStorage.setItem("privacyFriend", v); }} onLogout={onLogout} onEndCall={() => { if (callMode) endCall(0); }} chatTheme={chatTheme} setChatTheme={(v) => { setChatTheme(v); localStorage.setItem("chatTheme", v); }} />)}
      {showCreateRoom && <CreateRoomModal onClose={() => setShowCreateRoom(false)} onCreate={createRoom} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} authToken={authToken} user={{ ...myProfile, username: name }} onUpdate={(data) => setMyProfile(prev => ({ ...prev, ...data }))} />}
    </>
  );
}