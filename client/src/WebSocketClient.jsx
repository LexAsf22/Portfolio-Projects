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
      <line
        x1="22"
        y1="2"
        x2="11"
        y2="13"
        style={{ stroke: color, strokeWidth: 2.2, strokeLinecap: "round" }}
      />
      <polygon
        points="22 2 15 22 11 13 2 9 22 2"
        style={{ fill: color, stroke: "none" }}
      />
    </svg>
  );
}

function IcoImage({ size = 20, color = "#8b6fd4" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        style={{
          stroke: color,
          strokeWidth: 1.9,
          strokeLinecap: "round",
          fill: "none",
        }}
      />
      <circle cx="8.5" cy="8.5" r="1.5" style={{ fill: color }} />
      <polyline
        points="21 15 16 10 5 21"
        style={{
          stroke: color,
          strokeWidth: 1.9,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          fill: "none",
        }}
      />
    </svg>
  );
}

function IcoPaperclip({ size = 20, color = "#8b6fd4" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <path
        d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
        style={{
          stroke: color,
          strokeWidth: 1.9,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          fill: "none",
        }}
      />
    </svg>
  );
}

function IcoMic({ size = 20, color = "#8b6fd4" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <rect
        x="9"
        y="1"
        width="6"
        height="11"
        rx="3"
        style={{ stroke: color, strokeWidth: 1.9, fill: "none" }}
      />
      <path
        d="M5 10v2a7 7 0 0 0 14 0v-2"
        style={{
          stroke: color,
          strokeWidth: 1.9,
          strokeLinecap: "round",
          fill: "none",
        }}
      />
      <line
        x1="12"
        y1="19"
        x2="12"
        y2="23"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }}
      />
      <line
        x1="8"
        y1="23"
        x2="16"
        y2="23"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }}
      />
    </svg>
  );
}

function IcoMicOff({ size = 20, color = "#ef4444" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <line
        x1="1"
        y1="1"
        x2="23"
        y2="23"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }}
      />
      <path
        d="M9 9v3a3 3 0 0 0 5.12 2.12"
        style={{
          stroke: color,
          strokeWidth: 1.9,
          strokeLinecap: "round",
          fill: "none",
        }}
      />
      <path
        d="M15 9.34V4a3 3 0 0 0-5.94-.6"
        style={{
          stroke: color,
          strokeWidth: 1.9,
          strokeLinecap: "round",
          fill: "none",
        }}
      />
      <path
        d="M17 16.95A7 7 0 0 1 5 12v-2"
        style={{
          stroke: color,
          strokeWidth: 1.9,
          strokeLinecap: "round",
          fill: "none",
        }}
      />
      <line
        x1="12"
        y1="19"
        x2="12"
        y2="23"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }}
      />
      <line
        x1="8"
        y1="23"
        x2="16"
        y2="23"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }}
      />
    </svg>
  );
}

function IcoPhone({ size = 20, color = "#8b6fd4" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s}>
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
        style={{ fill: color, stroke: "none" }}
      />
    </svg>
  );
}

function IcoPhoneOff({ size = 22, color = "#fff" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <path
        d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45c1.12.45 2.3.7 3.53.7a2 2 0 0 1 2 2v3.5a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2h3.5a2 2 0 0 1 2 2c0 1.23.25 2.41.7 3.53a2 2 0 0 1-.45 2.11L10.68 13.31z"
        style={{
          stroke: color,
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          fill: "none",
        }}
      />
      <line
        x1="1"
        y1="1"
        x2="23"
        y2="23"
        style={{ stroke: color, strokeWidth: 2, strokeLinecap: "round" }}
      />
    </svg>
  );
}

function IcoVideo({ size = 20, color = "#8b6fd4" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <rect
        x="1"
        y="5"
        width="15"
        height="14"
        rx="2"
        style={{ stroke: color, strokeWidth: 1.9, fill: "none" }}
      />
      <polygon
        points="23 7 16 12 23 17 23 7"
        style={{ fill: color, stroke: "none" }}
      />
    </svg>
  );
}

function IcoVideoOff({ size = 20, color = "#ef4444" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <path
        d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"
        style={{
          stroke: color,
          strokeWidth: 1.9,
          strokeLinecap: "round",
          fill: "none",
        }}
      />
      <path
        d="M10.66 5H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"
        style={{
          stroke: color,
          strokeWidth: 1.9,
          strokeLinecap: "round",
          fill: "none",
        }}
      />
      <line
        x1="1"
        y1="1"
        x2="23"
        y2="23"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }}
      />
    </svg>
  );
}

function IcoInfo({ size = 20, color = "#8b6fd4" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <circle
        cx="12"
        cy="12"
        r="10"
        style={{ stroke: color, strokeWidth: 1.9, fill: "none" }}
      />
      <line
        x1="12"
        y1="16"
        x2="12"
        y2="12"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }}
      />
      <circle
        cx="12"
        cy="8"
        r="0.5"
        style={{ fill: color, stroke: color, strokeWidth: 1.5 }}
      />
    </svg>
  );
}

function IcoSearch({ size = 16, color = "#8b6fd4" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <circle
        cx="11"
        cy="11"
        r="8"
        style={{ stroke: color, strokeWidth: 2.2, fill: "none" }}
      />
      <line
        x1="21"
        y1="21"
        x2="16.65"
        y2="16.65"
        style={{ stroke: color, strokeWidth: 2.2, strokeLinecap: "round" }}
      />
    </svg>
  );
}

function IcoSun({ size = 16, color = "#d97706" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <circle
        cx="12"
        cy="12"
        r="5"
        style={{ stroke: color, strokeWidth: 2, fill: "none" }}
      />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const r = (Math.PI * deg) / 180;
        return (
          <line
            key={i}
            x1={12 + 8 * Math.cos(r)}
            y1={12 + 8 * Math.sin(r)}
            x2={12 + 11 * Math.cos(r)}
            y2={12 + 11 * Math.sin(r)}
            style={{ stroke: color, strokeWidth: 2, strokeLinecap: "round" }}
          />
        );
      })}
    </svg>
  );
}

function IcoMoon({ size = 16, color = "#fff" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s}>
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        style={{ fill: color, stroke: "none" }}
      />
    </svg>
  );
}

function IcoFile({ size = 18, color = "#fff" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <path
        d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
        style={{
          stroke: color,
          strokeWidth: 1.9,
          strokeLinecap: "round",
          fill: "none",
        }}
      />
      <polyline
        points="13 2 13 9 20 9"
        style={{
          stroke: color,
          strokeWidth: 1.9,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          fill: "none",
        }}
      />
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
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    let t = 0;

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.2,
      spd: Math.random() * 0.0001 + 0.00003,
      op: Math.random() * 0.75 + 0.25,
      tw: Math.random() * 0.025 + 0.004,
      twOff: Math.random() * Math.PI * 2,
    }));
    const NEBULAS = [
      { cx: 0.15, cy: 0.25, rx: 0.3, ry: 0.22, h: 260, s: 80 },
      { cx: 0.75, cy: 0.6, rx: 0.32, ry: 0.26, h: 200, s: 70 },
      { cx: 0.5, cy: 0.55, rx: 0.38, ry: 0.22, h: 300, s: 60 },
      { cx: 0.88, cy: 0.18, rx: 0.22, ry: 0.18, h: 240, s: 75 },
    ];
    const shoots = [];
    const shootInt = setInterval(
      () =>
        shoots.push({
          x: Math.random() * W,
          y: Math.random() * H * 0.45,
          len: Math.random() * 140 + 60,
          spd: Math.random() * 9 + 6,
          angle: Math.PI / 5 + (Math.random() - 0.5) * 0.3,
          life: 1,
          decay: Math.random() * 0.016 + 0.01,
        }),
      2600,
    );

    const clouds = Array.from({ length: 7 }, () => ({
      x: Math.random(),
      y: 0.05 + Math.random() * 0.45,
      w: 0.12 + Math.random() * 0.18,
      h: 0.04 + Math.random() * 0.06,
      spd: 0.00004 + Math.random() * 0.00005,
      op: 0.55 + Math.random() * 0.35,
      puffs: Array.from({ length: 5 + Math.floor(Math.random() * 4) }, () => ({
        ox: (Math.random() - 0.4) * 0.9,
        oy: (Math.random() - 0.5) * 0.5,
        rs: 0.4 + Math.random() * 0.7,
      })),
    }));

    const draw = () => {
      t += 0.01;
      if (dark) {
        ctx.fillStyle = "#03030a";
        ctx.fillRect(0, 0, W, H);
        NEBULAS.forEach((n, i) => {
          const drift = Math.sin(t * 0.15 + i * 1.4) * 0.022;
          const cx = (n.cx + drift) * W,
            cy = n.cy * H,
            rx = n.rx * W,
            ry = n.ry * H;
          const g = ctx.createRadialGradient(
            cx,
            cy,
            0,
            cx,
            cy,
            Math.max(rx, ry),
          );
          g.addColorStop(0, `hsla(${n.h},${n.s}%,58%,0.14)`);
          g.addColorStop(0.5, `hsla(${n.h + 20},${n.s - 10}%,48%,0.06)`);
          g.addColorStop(1, `hsla(${n.h},${n.s}%,38%,0)`);
          ctx.save();
          ctx.scale(1, ry / rx);
          ctx.beginPath();
          ctx.arc(cx, cy * (rx / ry), rx, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
          ctx.restore();
        });
        stars.forEach((s) => {
          s.x += s.spd;
          if (s.x > 1) s.x -= 1;
          const tw = 0.45 + 0.55 * Math.sin(t * s.tw * 60 + s.twOff);
          const a = s.op * (0.35 + 0.65 * tw);
          ctx.beginPath();
          ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(215,228,255,${a})`;
          ctx.fill();
        });
        for (let i = shoots.length - 1; i >= 0; i--) {
          const s = shoots[i];
          s.x += Math.cos(s.angle) * s.spd;
          s.y += Math.sin(s.angle) * s.spd;
          s.life -= s.decay;
          if (s.life <= 0 || s.x > W || s.y > H) {
            shoots.splice(i, 1);
            continue;
          }
          const tx = s.x - Math.cos(s.angle) * s.len,
            ty = s.y - Math.sin(s.angle) * s.len;
          const g = ctx.createLinearGradient(tx, ty, s.x, s.y);
          g.addColorStop(0, "rgba(255,255,255,0)");
          g.addColorStop(1, `rgba(255,255,255,${s.life * 0.9})`);
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(s.x, s.y);
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }
      } else {
        const sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, "#2196f3");
        sky.addColorStop(0.35, "#64b5f6");
        sky.addColorStop(0.7, "#b3e5fc");
        sky.addColorStop(1, "#e1f5fe");
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);
        const sx = W * 0.8,
          sy = H * 0.12,
          sr = Math.min(W, H) * 0.065;
        const glow = ctx.createRadialGradient(sx, sy, sr * 0.3, sx, sy, sr * 4);
        glow.addColorStop(0, "rgba(255,245,80,0.55)");
        glow.addColorStop(0.4, "rgba(255,220,40,0.16)");
        glow.addColorStop(1, "rgba(255,200,0,0)");
        ctx.beginPath();
        ctx.arc(sx, sy, sr * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        ctx.save();
        ctx.translate(sx, sy);
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2 + t * 0.008;
          const r1 = sr * 1.35,
            r2 = sr * (1.9 + 0.12 * Math.sin(t * 1.2 + i));
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
          ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
          ctx.strokeStyle = `rgba(255,235,80,${0.4 + 0.2 * Math.sin(t + i)})`;
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
        ctx.restore();
        const disk = ctx.createRadialGradient(
          sx - sr * 0.25,
          sy - sr * 0.25,
          0,
          sx,
          sy,
          sr,
        );
        disk.addColorStop(0, "#fff9c4");
        disk.addColorStop(0.5, "#ffe033");
        disk.addColorStop(1, "#ffb700");
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fillStyle = disk;
        ctx.fill();
        clouds.forEach((c) => {
          c.x += c.spd;
          if (c.x > 1.3) c.x = -0.3;
          const cx2 = c.x * W,
            cy2 = c.y * H,
            rw = c.w * W,
            rh = c.h * H;
          c.puffs.forEach((p) => {
            const px = cx2 + p.ox * rw,
              py = cy2 + p.oy * rh,
              pr = p.rs * rh;
            const cg = ctx.createRadialGradient(
              px,
              py - pr * 0.2,
              0,
              px,
              py,
              pr * 1.4,
            );
            cg.addColorStop(0, `rgba(255,255,255,${c.op})`);
            cg.addColorStop(0.6, `rgba(240,245,255,${c.op * 0.7})`);
            cg.addColorStop(1, "rgba(220,230,255,0)");
            ctx.beginPath();
            ctx.arc(px, py, pr * 1.4, 0, Math.PI * 2);
            ctx.fillStyle = cg;
            ctx.fill();
          });
        });
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      clearInterval(shootInt);
      window.removeEventListener("resize", resize);
    };
  }, [dark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────
   CALL OVERLAY  — WebRTC + STOMP
   isCaller=true  → sends OFFER after subscribing
   isCaller=false → waits for OFFER, sends ANSWER
───────────────────────────────────────────────────────── */
function CallOverlay({ mode, myName, isCaller, stompClient, onEnd }) {
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const pcRef = useRef(null);
  const localStream = useRef(null);
  const signalSub = useRef(null);
  const endTimeout = useRef(null);
  const remoteStreamRef = useRef(null);

  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [status, setStatus] = useState(isCaller ? "Calling…" : "Connecting…");
  const [secs, setSecs] = useState(0);
  const durTimer = useRef(null);
  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // Re-attach remote stream whenever it arrives or video element mounts
  useEffect(() => {
    if (remoteRef.current && remoteStreamRef.current) {
      if (remoteRef.current.srcObject !== remoteStreamRef.current) {
        remoteRef.current.srcObject = remoteStreamRef.current;
        remoteRef.current.play().catch(() => { });
      }
    }
  }, [status]); // status changes when connected, triggering re-attach
  useEffect(() => {
    let mounted = true;
    let pc;
    let callStarted = false;
    let endListenReady = false;
    let pendingCandidates = [];
    let remoteDescSet = false;
    let makingOffer = false;
    let answerSent = false;
    let offerProcessing = false;
    const callId = `${myName}-${Date.now()}`;
    let activeCallId = null;
    let readyInterval = null;

    const init = async () => {
      if (!mounted) return;
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setStatus("Camera/mic unavailable — use HTTPS or localhost");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia(
          mode === "video"
            ? {
              audio: true,
              video: { width: 1280, height: 720, facingMode: "user" },
            }
            : { audio: true, video: false },
        );
        localStream.current = stream;

        if (mode === "video") {
          const attachLocal = () => {
            if (localRef.current) {
              localRef.current.srcObject = stream;
              localRef.current.play().catch(() => { });
            } else {
              setTimeout(attachLocal, 100);
            }
          };
          attachLocal();
        }

        pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
          iceTransportPolicy: "all",
          iceCandidatePoolSize: 10,
        });
        pcRef.current = pc;

        stream.getTracks().forEach((t) => {
          console.log("Adding track:", t.kind);
          pc.addTrack(t, stream);
        });

        pc.ontrack = (e) => {
          console.log("Got remote track:", e.track.kind);
          if (!e.streams[0]) return;
          const remoteStream = e.streams[0];

          if (mode === "video") {
            remoteStreamRef.current = remoteStream;
            const tryAttach = () => {
              if (remoteRef.current) {
                remoteRef.current.srcObject = remoteStream;
                remoteRef.current.play().catch(() => { });
              } else {
                setTimeout(tryAttach, 100);
              }
            };
            tryAttach();
          } else {
            // Voice call — route audio to a plain Audio element
            const audio = new Audio();
            audio.srcObject = remoteStream;
            audio.autoplay = true;
            audio.play().catch(() => { });
          }
          callStarted = true;
          setStatus("Connected");
          clearInterval(durTimer.current);
          durTimer.current = setInterval(() => setSecs((s) => s + 1), 1000);
        };

        pc.onicecandidate = (e) => {
          if (e.candidate && stompClient?.current?.connected) {
            stompClient.current.publish({
              destination: "/app/call-signal",
              body: JSON.stringify({
                sender: myName,
                callId: isCaller ? callId : activeCallId,
                type: "ICE",
                payload: JSON.stringify(e.candidate),
              }),
            });
          }
        };

        pc.oniceconnectionstatechange = () => {
          console.log("ICE state:", pc.iceConnectionState);

          if (pc.iceConnectionState === "disconnected") {
            setStatus("Reconnecting…");

            // Caller triggers ICE restart to attempt recovery
            if (isCaller && pcRef.current) {
              pcRef.current.restartIce();
              // Reset answerSent on callee side via a flag so the new offer is accepted
              makingOffer = false;
            }

            // Give 8 seconds to recover before declaring the call ended
            clearTimeout(endTimeout.current);
            endTimeout.current = setTimeout(() => {
              if (
                pcRef.current &&
                ["disconnected", "failed"].includes(
                  pcRef.current.iceConnectionState,
                )
              ) {
                setStatus("Call ended");
                clearInterval(durTimer.current);
                onEnd(secs);
              }
            }, 8000);
          } else if (pc.iceConnectionState === "failed") {
            clearTimeout(endTimeout.current);

            // Try one ICE restart before giving up
            if (isCaller && pcRef.current) {
              console.log("ICE failed — attempting restart");
              makingOffer = false;
              answerSent = false;
              pcRef.current.restartIce();

              // If still failed after 5 more seconds, end the call
              endTimeout.current = setTimeout(() => {
                if (
                  pcRef.current &&
                  ["failed", "disconnected"].includes(
                    pcRef.current.iceConnectionState,
                  )
                ) {
                  setStatus("Call ended");
                  clearInterval(durTimer.current);
                  onEnd(secs);
                }
              }, 5000);
            } else {
              setStatus("Call ended");
              clearInterval(durTimer.current);
              onEnd(secs);
            }
          } else if (pc.iceConnectionState === "closed") {
            clearTimeout(endTimeout.current);
            setStatus("Call ended");
            clearInterval(durTimer.current);
          } else if (
            pc.iceConnectionState === "connected" ||
            pc.iceConnectionState === "completed"
          ) {
            clearTimeout(endTimeout.current);
            setStatus(
              callStarted ? "Connected" : "Connected — waiting for media…",
            );
          }
        };

        pc.onconnectionstatechange = () => {
          console.log("Connection state:", pc.connectionState);
        };

        const setRemoteAndFlush = async (sdp) => {
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          remoteDescSet = true;
          console.log(
            "Remote desc set, flushing",
            pendingCandidates.length,
            "buffered candidates",
          );
          for (const c of pendingCandidates) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(c));
            } catch (_) { }
          }
          pendingCandidates = [];
        };

        if (stompClient?.current?.connected) {
          signalSub.current = stompClient.current.subscribe(
            "/topic/call-signal",
            async (msg) => {
              const sig = JSON.parse(msg.body);
              if (sig.sender === myName) return;

              // Drop ICE from completely different sessions only
              if (
                sig.type === "ICE" &&
                sig.callId &&
                activeCallId &&
                sig.callId !== activeCallId
              )
                return;

              if (sig.type === "READY" && isCaller) {
                // Received READY from callee — send OFFER if not already doing so
                if (makingOffer || pc.signalingState !== "stable") return;
                try {
                  makingOffer = true;
                  const offer = await pc.createOffer({
                    offerToReceiveAudio: true,
                    offerToReceiveVideo: mode === "video",
                  });
                  await pc.setLocalDescription(offer);
                  stompClient.current.publish({
                    destination: "/app/call-signal",
                    body: JSON.stringify({
                      sender: myName,
                      callId,
                      type: "OFFER",
                      payload: JSON.stringify(offer),
                    }),
                  });
                } catch (err) {
                  setStatus("Error: " + err.message);
                } finally {
                  makingOffer = false;
                }
              } else if (sig.type === "OFFER" && !isCaller) {
                // Stop sending READY the instant we get an OFFER
                if (readyInterval) {
                  clearInterval(readyInterval);
                  readyInterval = null;
                }
                // Drop duplicate OFFERs while we're already processing one
                if (offerProcessing) return;
                const isIceRestart =
                  pc.iceConnectionState === "disconnected" ||
                  pc.iceConnectionState === "checking" ||
                  pc.iceConnectionState === "failed";
                if (pc.signalingState !== "stable" && !isIceRestart) return;
                offerProcessing = true;
                activeCallId = sig.callId;
                answerSent = false;
                try {
                  await setRemoteAndFlush(JSON.parse(sig.payload));
                  const answer = await pc.createAnswer();
                  await pc.setLocalDescription(answer);
                  answerSent = true;
                  stompClient.current.publish({
                    destination: "/app/call-signal",
                    body: JSON.stringify({
                      sender: myName,
                      callId: activeCallId,
                      type: "ANSWER",
                      payload: JSON.stringify(answer),
                    }),
                  });
                } catch (err) {
                  console.error("Answer error:", err);
                  setStatus("Error: " + err.message);
                } finally {
                  offerProcessing = false;
                }
              } else if (sig.type === "ANSWER" && isCaller) {
                console.log(
                  "Caller received ANSWER, signalingState:",
                  pc.signalingState,
                  "callId match:",
                  sig.callId === callId,
                );
                if (pc.signalingState === "stable") {
                  console.warn("Dropping ANSWER — already stable");
                  return;
                }
                try {
                  await setRemoteAndFlush(JSON.parse(sig.payload));
                  console.log("ANSWER applied successfully");
                } catch (err) {
                  console.error("Set answer error:", err);
                }
              } else if (sig.type === "ICE") {
                const candidate = JSON.parse(sig.payload);
                if (remoteDescSet) {
                  try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                  } catch (_) { }
                } else {
                  pendingCandidates.push(candidate);
                }
              } else if (sig.type === "END" && endListenReady) {
                onEnd(0);
              }
            },
          );

          setTimeout(() => {
            endListenReady = true;
          }, 1500);

          if (!isCaller) {
            // Callee: send READY immediately, then repeat every 2s
            // until we receive an OFFER (answerSent will be true then)
            const sendReady = () => {
              if (answerSent || offerProcessing) return;
              stompClient.current.publish({
                destination: "/app/call-signal",
                body: JSON.stringify({
                  sender: myName,
                  type: "READY",
                  payload: "",
                }),
              });
            };
            sendReady();
            readyInterval = setInterval(() => {
              if (answerSent || offerProcessing || !readyInterval) {
                clearInterval(readyInterval);
                readyInterval = null;
                return;
              }
              sendReady();
            }, 2000);
          }
        } else {
          setStatus("Not connected to server");
        }
      } catch (err) {
        setStatus(
          err.name === "NotAllowedError"
            ? "Permission denied"
            : "Error: " + err.message,
        );
      }
    };

    init();

    return () => {
      mounted = false;
      clearInterval(durTimer.current);
      clearTimeout(endTimeout.current);
      if (readyInterval) clearInterval(readyInterval);
      localStream.current?.getTracks().forEach((t) => t.stop());
      pcRef.current?.close();
      signalSub.current?.unsubscribe();
      if (callStarted && stompClient?.current?.connected) {
        stompClient.current.publish({
          destination: "/app/call-signal",
          body: JSON.stringify({ sender: myName, type: "END", payload: "" }),
        });
      }
    };
  }, []); // eslint-disable-line

  const toggleMute = () => {
    const nowMuted = !muted;
    localStream.current?.getAudioTracks().forEach((t) => {
      t.enabled = !nowMuted;
    });
    pcRef.current?.getSenders().forEach((sender) => {
      if (sender.track?.kind === "audio") {
        sender.track.enabled = !nowMuted;
      }
    });
    setMuted(nowMuted);
  };

  const toggleCam = () => {
    const nowOff = !camOff;
    localStream.current?.getVideoTracks().forEach((t) => {
      t.enabled = !nowOff;
    });
    pcRef.current?.getSenders().forEach((sender) => {
      if (sender.track?.kind === "video") {
        sender.track.enabled = !nowOff;
      }
    });
    setCamOff(nowOff);
  };

  const callBtnSt = (bg, size = 52) => ({
    width: size,
    height: size,
    borderRadius: "50%",
    border: "none",
    background: bg,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
    transition: "transform 0.12s, opacity 0.12s",
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        background:
          mode === "video"
            ? "#000"
            : "linear-gradient(135deg,#160330 0%,#0a1535 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{`@keyframes callPulse{0%,100%{box-shadow:0 0 0 0 rgba(196,109,255,0.5)}70%{box-shadow:0 0 0 20px rgba(196,109,255,0)}}`}</style>

      {/* Remote video — full screen */}
      {mode === "video" && (
        <video
          ref={remoteRef}
          autoPlay
          playsInline
          muted={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            background: "#000",
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom,rgba(0,0,0,0.5) 0%,transparent 40%,transparent 55%,rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Local video — picture in picture */}
      {mode === "video" && (
        <video
          ref={localRef}
          autoPlay
          muted
          playsInline
          style={{
            position: "absolute",
            bottom: 90,
            right: 20,
            width: 160,
            height: 110,
            borderRadius: 12,
            objectFit: "cover",
            zIndex: 2,
            background: "#111",
            border: "2px solid rgba(255,255,255,0.25)",
            boxShadow: "0 8px 28px rgba(0,0,0,0.5)",
          }}
        />
      )}

      <div
        style={{
          position: "relative",
          zIndex: 3,
          textAlign: "center",
          color: "#fff",
          marginBottom: 44,
        }}
      >
        {mode !== "video" && (
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: "50%",
              margin: "0 auto 20px",
              background: "linear-gradient(135deg,#c46dff,#7b8cff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 700,
              animation: "callPulse 1.8s infinite",
            }}
          >
            C
          </div>
        )}
        <div style={{ fontSize: 22, fontWeight: 700 }}>Channel 1</div>
        <div
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.55)",
            marginTop: 6,
          }}
        >
          {status === "Connected" ? fmt(secs) : status}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 3,
          display: "flex",
          gap: 22,
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <button
            style={callBtnSt(
              muted ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.18)",
            )}
            onClick={toggleMute}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {muted ? <IcoMicOff color="#1a0533" /> : <IcoMic color="#fff" />}
          </button>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
            {muted ? "Unmute" : "Mute"}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <button
            style={callBtnSt("#ef4444", 64)}
            onClick={() => onEnd(secs)}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <IcoPhoneOff color="#fff" />
          </button>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
            End
          </span>
        </div>

        {mode === "video" ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <button
              style={callBtnSt(
                camOff ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.18)",
              )}
              onClick={toggleCam}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {camOff ? (
                <IcoVideo color="#1a0533" />
              ) : (
                <IcoVideoOff color="#fff" />
              )}
            </button>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
              {camOff ? "Cam on" : "Cam off"}
            </span>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <button
              style={callBtnSt("rgba(255,255,255,0.18)")}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <IcoInfo color="#fff" />
            </button>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
              Speaker
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   INCOMING CALL BANNER
───────────────────────────────────────────────────────── */
function IncomingCallBanner({ from, mode, onAccept, onReject }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 200,
        minWidth: 320,
        background: "rgba(18,10,38,0.97)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(196,109,255,0.35)",
        borderRadius: 20,
        padding: "16px 22px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          flexShrink: 0,
          background: "linear-gradient(135deg,#c46dff,#7b8cff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 17,
          fontWeight: 700,
        }}
      >
        {(from || "?")[0].toUpperCase()}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{from}</div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.55)",
            marginTop: 2,
          }}
        >
          Incoming {mode === "video" ? "video" : "voice"} call…
        </div>
      </div>
      <button
        onClick={onReject}
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          border: "none",
          background: "#ef4444",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IcoPhoneOff color="#fff" size={18} />
      </button>
      <button
        onClick={onAccept}
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          border: "none",
          background: "#22c55e",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IcoPhone color="#fff" size={18} />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CSS  — no reliance on color inheritance for icons
───────────────────────────────────────────────────────── */

const EMOJIS = [
  "😀", "😂", "😍", "😎", "😭", "😅", "🤔", "😤", "🥰", "😇",
  "🤣", "😊", "😋", "😜", "🤩", "🥳", "😏", "😒", "😔", "😳",
  "👍", "👎", "👏", "🙌", "🤝", "🙏", "👋", "💪", "🤜", "✌️",
  "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "💔", "💕", "💯",
  "🔥", "⭐", "✨", "🎉", "🎊", "🎁", "🏆", "🎯", "💡", "🚀",
  "😈", "👻", "💀", "🤖", "👽", "🐶", "🐱", "🐭", "🦊", "🐻",
  "🍕", "🍔", "🍟", "🌮", "🍜", "🍣", "🍩", "🍪", "☕", "🧋",
  "⚽", "🏀", "🎮", "🎵", "🎬", "📸", "💻", "📱", "🌈", "🌙",
];

function EmojiPicker({ onSelect, emojiRef }) {
  return (
    <div ref={emojiRef} style={{
      position: "absolute",
      bottom: 70,
      right: 20,
      zIndex: 50,
      width: 300,
      maxHeight: 220,
      overflowY: "auto",
      background: "var(--glass2)",
      border: "1px solid var(--glass-border)",
      borderRadius: 16,
      padding: 10,
      display: "flex",
      flexWrap: "wrap",
      gap: 2,
      boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
      backdropFilter: "blur(20px)",
    }}>
      {EMOJIS.map((e, i) => (
        <button key={i} onClick={() => onSelect(e)} style={{
          width: 36, height: 36, border: "none", borderRadius: 8,
          background: "transparent", cursor: "pointer", fontSize: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.1s",
        }}
          onMouseEnter={ev => ev.currentTarget.style.background = "var(--accent-soft)"}
          onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}
        >
          {e}
        </button>
      ))}
    </div>
  );
}

function IcoSmile({ size = 20, color = "#8b6fd4" }) {
  const s = svgBase(size);
  return (
    <svg viewBox="0 0 24 24" style={s} fill="none">
      <circle cx="12" cy="12" r="10"
        style={{ stroke: color, strokeWidth: 1.9, fill: "none" }} />
      <path d="M8 14s1.5 2 4 2 4-2 4-2"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <circle cx="9" cy="10" r="0.8" style={{ fill: color }} />
      <circle cx="15" cy="10" r="0.8" style={{ fill: color }} />
    </svg>
  );
}

const buildCSS = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body, #root { width:100%; height:100%; overflow:hidden; font-family:'Plus Jakarta Sans',sans-serif; }

  :root {
    --accent:       #c46dff;
    --accent2:      #7b8cff;
    --accent-glow:  rgba(196,109,255,0.30);
    --accent-soft:  rgba(196,109,255,0.13);
    --green:        #4ade80;
    --red:          #fb7185;
    --bubble-me:    linear-gradient(135deg,#c46dff 0%,#7b8cff 100%);
    --spring:       cubic-bezier(0.34,1.56,0.64,1);
    --out:          cubic-bezier(0.16,1,0.3,1);

    --glass:        ${dark ? "rgba(10,7,22,0.66)" : "rgba(255,255,255,0.65)"};
    --glass2:       ${dark ? "rgba(15,10,32,0.78)" : "rgba(255,255,255,0.88)"};
    --glass-border: ${dark ? "rgba(255,255,255,0.09)" : "rgba(160,130,210,0.30)"};
    --divider:      ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"};
    --text:         ${dark ? "#ede8ff" : "#160830"};
    --text-sub:     ${dark ? "#9080b8" : "#5a3e88"};
    --text-muted:   ${dark ? "#4e4268" : "#9980bb"};
    --bubble-other: ${dark ? "rgba(28,18,52,0.88)" : "rgba(255,255,255,0.95)"};
    --bubble-ob:    ${dark ? "rgba(255,255,255,0.08)" : "rgba(160,130,210,0.28)"};
    --input-bg:     ${dark ? "rgba(18,12,38,0.72)" : "rgba(255,255,255,0.75)"};
    --scrollbar:    ${dark ? "rgba(196,109,255,0.22)" : "rgba(140,100,220,0.22)"};
    --hover:        ${dark ? "rgba(255,255,255,0.05)" : "rgba(120,80,200,0.08)"};
    --btn-bg:       ${dark ? "rgba(255,255,255,0.07)" : "rgba(120,80,200,0.10)"};
  }

  .page {
    position:fixed; inset:0; z-index:1;
    display:flex; align-items:center; justify-content:center; padding:14px;
  }

  /* ── THEME TOGGLE ── */
  .theme-fab {
    position:fixed; top:18px; right:18px; z-index:10;
    width:44px; height:26px; border:none; cursor:pointer; padding:0;
    border-radius:999px; background:${dark ? "rgba(30,18,55,0.85)" : "rgba(255,255,255,0.85)"};
    backdrop-filter:blur(14px);
    border:1.5px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(140,100,200,0.35)"};
    box-shadow:0 3px 14px rgba(0,0,0,0.20);
  }
  .theme-thumb {
    position:absolute; top:3px; left:${dark ? "21px" : "3px"};
    width:20px; height:20px; border-radius:50%;
    background:${dark ? "#c46dff" : "#ffe066"};
    display:flex; align-items:center; justify-content:center;
    pointer-events:none; transition:left 0.3s var(--spring);
    box-shadow:0 1px 5px rgba(0,0,0,0.25);
  }

  /* ── JOIN ── */
  @keyframes riseUp { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:none} }
  .join-card {
    width:440px; background:var(--glass2);
    backdrop-filter:blur(32px) saturate(160%); -webkit-backdrop-filter:blur(32px) saturate(160%);
    border:1px solid var(--glass-border); border-radius:28px;
    padding:54px 46px 50px; text-align:center;
    box-shadow:0 32px 80px rgba(0,0,0,0.36);
    animation:riseUp 0.45s var(--out) forwards;
  }
  .join-logo {
    width:70px; height:70px; border-radius:22px; background:var(--bubble-me);
    margin:0 auto 26px; display:flex; align-items:center; justify-content:center;
    box-shadow:0 8px 28px var(--accent-glow);
  }
  .join-title  { font-size:26px; font-weight:700; letter-spacing:-0.6px; color:var(--text); margin-bottom:7px; }
  .join-sub    { font-size:14px; color:var(--text-sub); margin-bottom:38px; line-height:1.65; }
  .join-label  { display:block; text-align:left; font-size:10.5px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--text-muted); margin-bottom:7px; }
  .join-input  {
    width:100%; background:var(--input-bg);
    border:1.5px solid var(--glass-border); border-radius:14px;
    padding:14px 17px; font-family:inherit; font-size:15px; color:var(--text); outline:none;
    transition:border-color 0.2s,box-shadow 0.2s; margin-bottom:14px;
  }
  .join-input::placeholder { color:var(--text-muted); }
  .join-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft); }
  .join-btn {
    width:100%; background:var(--bubble-me); color:#fff; border:none;
    border-radius:14px; padding:14px; font-family:inherit; font-size:15px; font-weight:700;
    cursor:pointer; box-shadow:0 6px 24px var(--accent-glow);
    transition:transform 0.15s, opacity 0.15s;
  }
  .join-btn:hover  { transform:translateY(-2px); opacity:0.92; }
  .join-btn:active { transform:none; }

  /* ── CHAT WINDOW ── */
  .chat-window {
    display:flex; flex-direction:row;
    width:min(1300px, calc(100vw - 28px));
    height:min(840px, calc(100vh - 28px));
    background:var(--glass);
    backdrop-filter:blur(36px) saturate(180%); -webkit-backdrop-filter:blur(36px) saturate(180%);
    border:1px solid var(--glass-border); border-radius:22px; overflow:hidden;
    box-shadow:0 40px 110px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05);
    animation:riseUp 0.42s var(--out) forwards;
  }

  /* ── SIDEBAR ── */
  .sidebar {
    width:300px; min-width:300px; height:100%;
    display:flex; flex-direction:column;
    background:var(--glass2); backdrop-filter:blur(20px);
    border-right:1px solid var(--divider); flex-shrink:0;
  }
  .sb-top    { padding:20px 16px 14px; border-bottom:1px solid var(--divider); }
  .sb-name   { font-size:17px; font-weight:700; color:var(--text); letter-spacing:-0.4px; margin-bottom:13px; display:flex; align-items:center; gap:6px; }
  .sb-caret  { color:var(--text-muted); font-size:11px; }
  .sb-search {
    display:flex; align-items:center; gap:9px; padding:9px 13px;
    background:var(--input-bg); border:1.5px solid var(--glass-border); border-radius:12px;
    transition:border-color 0.2s, box-shadow 0.2s;
  }
  .sb-search:focus-within { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft); }
  .sb-search input { flex:1; background:transparent; border:none; outline:none; font-family:inherit; font-size:13.5px; color:var(--text); }
  .sb-search input::placeholder { color:var(--text-muted); }
  .sb-section { padding:13px 16px 5px; font-size:9.5px; font-weight:700; letter-spacing:1.3px; text-transform:uppercase; color:var(--text-muted); }
  .contact-list { flex:1; overflow-y:auto; padding:4px 8px 8px; }
  .contact-list::-webkit-scrollbar { width:3px; }
  .contact-list::-webkit-scrollbar-thumb { background:var(--scrollbar); border-radius:3px; }
  .contact-item { display:flex; align-items:center; gap:11px; padding:10px; border-radius:14px; cursor:pointer; transition:background 0.15s; margin-bottom:2px; }
  .contact-item:hover  { background:var(--hover); }
  .contact-item.active { background:var(--accent-soft); }
  .c-av  {
    width:46px; height:46px; border-radius:50%; background:var(--bubble-me); flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    font-size:17px; font-weight:700; color:#fff; position:relative;
  }
  .c-av.story { box-shadow:0 0 0 2px ${dark ? "#0b0810" : "rgba(255,255,255,0.9)"}, 0 0 0 4px var(--accent); }
  .c-online   { position:absolute; bottom:1px; right:1px; width:12px; height:12px; border-radius:50%; background:var(--green); border:2.5px solid ${dark ? "#0f0a20" : "#fff"}; }
  .c-info  { flex:1; min-width:0; }
  .c-name  { font-size:13.5px; font-weight:600; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .contact-item.active .c-name { color:var(--accent); }
  .c-last  { font-size:12px; color:var(--text-sub); margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .c-meta  { display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0; }
  .c-time  { font-size:10px; color:var(--text-muted); font-family:'Fira Code',monospace; }

  /* ── CHAT PANEL ── */
  .chat-panel { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; position:relative; }
  .chat-hdr {
    display:flex; align-items:center; gap:12px; padding:13px 20px;
    background:var(--glass2); backdrop-filter:blur(20px);
    border-bottom:1px solid var(--divider); flex-shrink:0;
  }
  .h-av {
    width:42px; height:42px; border-radius:50%; background:var(--bubble-me);
    display:flex; align-items:center; justify-content:center;
    font-size:16px; font-weight:700; color:#fff; flex-shrink:0;
    box-shadow:0 0 0 2.5px var(--accent-glow);
  }
  .h-info   { flex:1; }
  .h-name   { font-size:15px; font-weight:700; color:var(--text); letter-spacing:-0.3px; }
  .h-status { font-size:12px; color:var(--green); display:flex; align-items:center; gap:5px; margin-top:2px; font-weight:500; }
  .h-dot    { width:7px; height:7px; background:var(--green); border-radius:50%; box-shadow:0 0 6px var(--green); animation:blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.38} }
  .h-actions { display:flex; gap:5px; }
  .h-btn {
    width:38px; height:38px; border:none; border-radius:11px; cursor:pointer;
    background:var(--btn-bg);
    display:flex; align-items:center; justify-content:center;
    border:1px solid var(--divider);
    transition:background 0.15s, transform 0.1s;
  }
  .h-btn:hover  { background:var(--accent-soft); transform:scale(1.06); }
  .h-btn:active { transform:scale(0.94); }

  /* ── MESSAGES ── */
  .msgs {
    flex:1; overflow-y:auto; padding:20px 28px 12px;
    display:flex; flex-direction:column; gap:3px; background:transparent;
  }
  .msgs::-webkit-scrollbar { width:4px; }
  .msgs::-webkit-scrollbar-thumb { background:var(--scrollbar); border-radius:4px; }

  .empty-wrap { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:9px; padding-bottom:28px; }
  .empty-av   { width:70px; height:70px; border-radius:50%; background:var(--bubble-me); display:flex; align-items:center; justify-content:center; font-size:26px; font-weight:700; color:#fff; box-shadow:0 8px 28px var(--accent-glow); margin-bottom:2px; }
  .empty-name { font-size:17px; font-weight:700; color:var(--text); }
  .empty-hint { font-size:13px; color:var(--text-sub); }

  .msg-group       { display:flex; flex-direction:column; margin-bottom:6px; }
  .msg-group.me    { align-items:flex-end; }
  .msg-group.other { align-items:flex-start; }
  .msg-sender      { font-size:11px; font-weight:700; color:var(--accent); margin-bottom:3px; padding-left:38px; }
  .msg-row         { display:flex; align-items:flex-end; gap:8px; max-width:66%; }
  .msg-group.me    .msg-row { flex-direction:row-reverse; }
  .mini-av {
    width:28px; height:28px; border-radius:50%; flex-shrink:0;
    background:var(--bubble-me); display:flex; align-items:center; justify-content:center;
    font-size:11px; font-weight:700; color:#fff; margin-bottom:1px;
  }
  @keyframes pop { from{opacity:0;transform:scale(0.84) translateY(5px)} to{opacity:1;transform:none} }
  .msg-bubble {
    padding:11px 15px; border-radius:22px;
    font-size:14.5px; line-height:1.56; word-break:break-word;
    animation:pop 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards;
  }
  .msg-group.me    .msg-bubble { background:var(--bubble-me); color:#fff; border-bottom-right-radius:5px; box-shadow:0 3px 16px rgba(196,109,255,0.28); }
  .msg-group.other .msg-bubble { background:var(--bubble-other); color:var(--text); border-bottom-left-radius:5px; border:1px solid var(--bubble-ob); backdrop-filter:blur(12px); }
  .msg-bubble.is-image { padding:0!important; background:none!important; border:none!important; box-shadow:none!important; backdrop-filter:none!important; }
  .msg-time { font-size:10px; font-family:'Fira Code',monospace; color:var(--text-muted); margin-top:3px; padding:0 2px; }
  .msg-group.other .msg-time { padding-left:36px; }
  .msg-group.me    .msg-time  { text-align:right; }

  .msg-img   { max-width:260px; max-height:260px; border-radius:18px; display:block; object-fit:cover; box-shadow:0 5px 22px rgba(0,0,0,0.28); cursor:zoom-in; transition:transform 0.18s; }
  .msg-img:hover { transform:scale(1.03); }
  .msg-file  { display:flex; align-items:center; gap:11px; padding:11px 15px; background:rgba(196,109,255,0.10); border-radius:16px; color:inherit; text-decoration:none; font-size:13.5px; font-weight:500; border:1px solid rgba(196,109,255,0.20); transition:background 0.15s; min-width:180px; }
  .msg-file:hover { background:rgba(196,109,255,0.18); }
  .msg-file-ic { width:36px; height:36px; border-radius:10px; background:var(--bubble-me); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .msg-audio { width:220px; height:36px; accent-color:var(--accent); }

  /* ── INPUT ── */
  .input-area { padding:11px 20px 16px; background:var(--glass2); backdrop-filter:blur(20px); border-top:1px solid var(--divider); flex-shrink:0; }
  .input-row {
    display:flex; align-items:flex-end; gap:5px;
    background:var(--input-bg); border:1.5px solid var(--glass-border); border-radius:999px;
    padding:8px 8px 8px 18px;
    transition:border-color 0.2s, box-shadow 0.2s;
  }
  .input-row:focus-within { border-color:rgba(196,109,255,0.55); box-shadow:0 0 0 3px var(--accent-soft); }
  .msg-ta {
    flex:1; background:transparent; border:none; outline:none;
    font-family:inherit; font-size:14.5px; color:var(--text);
    resize:none; max-height:110px; line-height:1.52; padding:3px 0; scrollbar-width:none;
  }
  .msg-ta::placeholder { color:var(--text-muted); }
  .msg-ta::-webkit-scrollbar { display:none; }
  .input-icons { display:flex; align-items:flex-end; gap:1px; }

  /* Icon buttons — always have a visible tinted background */
  .ico-btn {
    width:36px; height:36px; border:none; border-radius:50%; cursor:pointer;
    background:var(--btn-bg);
    display:flex; align-items:center; justify-content:center;
    transition:background 0.15s, transform 0.1s; flex-shrink:0;
  }
  .ico-btn:hover  { background:var(--accent-soft); transform:scale(1.1); }
  .ico-btn:active { transform:scale(0.93); }
  .ico-btn.rec    { background:rgba(251,113,133,0.18); }

  .send-btn {
    width:36px; height:36px; border:none; cursor:pointer;
    background:var(--bubble-me); border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 3px 14px var(--accent-glow);
    transition:transform 0.1s, box-shadow 0.15s; flex-shrink:0;
  }
  .send-btn:hover  { transform:scale(1.1); box-shadow:0 5px 20px var(--accent-glow); }
  .send-btn:active { transform:scale(0.93); }

  .rec-badge { display:flex; align-items:center; gap:6px; padding:6px 6px 0; font-size:12px; font-weight:500; color:var(--red); animation:fadeIn 0.2s; }
  .rec-dot   { width:7px; height:7px; background:var(--red); border-radius:50%; animation:blink 1s infinite; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
`;

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const initial = (n) => (n || "?")[0].toUpperCase();

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function Chat({ authUser, authToken, onLogout }) {
  const [dark, setDark] = useState(true);
  const [name, setName] = useState(authUser || "");
  const [joined, setJoined] = useState(!!authUser);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [callMode, setCallMode] = useState(null);
  const [isCaller, setIsCaller] = useState(false);
  const [incomingCall, setIncoming] = useState(null);
  const [callKey, setCallKey] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeout = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef(null);

  const stompClient = useRef(null);
  const messagesEnd = useRef(null);
  const inputRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const recordTimer = useRef(null);
  const recorderRef = useRef(null);
  const nameRef = useRef(name);
  useEffect(() => {
    nameRef.current = name;
  }, [name]);

  useEffect(() => {
    if (authUser) connect();
  }, []); // eslint-disable-line

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ── CONNECT ── */
  const connect = () => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://192.168.100.127:8080/ws"),
      reconnectDelay: 5000,
      connectHeaders: {
        // ← ADD THIS
        Authorization: `Bearer ${authToken}`, // ← ADD THIS
      }, // ← ADD THIS
      onConnect: async () => {
        // Load message history
        try {
          const res = await fetch("http://192.168.100.127:8080/auth/history", {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          const history = await res.json();
          setMessages(
            history.map((m) => ({
              ...m,
              time: m.timestamp
                ? new Date(m.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : getTime(),
            })),
          );
        } catch {
          /* ignore */
        }

        client.subscribe("/topic/channel1", (res) => {
          const msg = JSON.parse(res.body);
          setMessages((prev) => [...prev, { ...msg, time: getTime() }]);
        });
        client.subscribe("/topic/call-notify", (res) => {
          const sig = JSON.parse(res.body);
          if (sig.type === "RING" && sig.sender !== nameRef.current) {
            setIncoming({ from: sig.sender, mode: sig.mode });
          }
        });

        client.subscribe("/topic/presence", (res) => {
          const event = JSON.parse(res.body);
          setOnlineUsers(Array.from(event.onlineUsers || []));
        });

        client.subscribe("/topic/typing", (res) => {
          const event = JSON.parse(res.body);
          if (event.sender === nameRef.current) return;
          if (event.typing) {
            setTypingUsers(prev =>
              prev.includes(event.sender) ? prev : [...prev, event.sender]
            );
          } else {
            setTypingUsers(prev => prev.filter(u => u !== event.sender));
          }
        });

        client.subscribe("/topic/seen", (res) => {
          const update = JSON.parse(res.body);
          setMessages(prev => prev.map(m =>
            m.id === update.messageId ? { ...m, status: "SEEN" } : m
          ));
        });
      },
      onStompError: (f) => console.error("STOMP:", f.headers["message"]),
    });
    client.activate();
    stompClient.current = client;
  };

  const sendMessage = () => {
    clearTimeout(typingTimeout.current);
    if (stompClient.current?.connected) {
      stompClient.current.publish({
        destination: "/app/typing",
        body: JSON.stringify({ sender: nameRef.current, typing: false }),
      });
    }
    if (stompClient.current?.connected && message.trim()) {
      stompClient.current.publish({
        destination: "/app/send",
        body: JSON.stringify({
          sender: nameRef.current,
          content: message.trim(),
        }),
      });
      setMessage("");
    }
  };

  /* ── UPLOAD ── */
  const BASE_URL = "http://192.168.100.127:8080";

  const uploadFile = async (file, type) => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("HTTP " + res.status);

      const rawUrl = await res.text();

      // Ensure we always store a full absolute URL
      const fileUrl = rawUrl.startsWith("http")
        ? rawUrl
        : `${BASE_URL}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;

      stompClient.current.publish({
        destination: "/app/send",
        body: JSON.stringify({
          sender: name,
          content: file.name || "",
          type,
          fileUrl,
        }),
      });
    } catch (err) {
      alert("Upload failed — is the server running?\n" + err.message);
    }
  };

  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (f) uploadFile(f, "IMAGE");
    e.target.value = "";
  };
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) uploadFile(f, "FILE");
    e.target.value = "";
  };
  const handleVideoChange = (e) => {
    const f = e.target.files[0];
    if (f) uploadFile(f, "VIDEO");
    e.target.value = "";
  };

  /* ── VOICE RECORDING ── */
  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser does not support microphone recording.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());

        if (recordTimer.current) {
          clearInterval(recordTimer.current);
        }

        setRecording(false);
        setRecordSecs(0);

        const blob = new Blob(chunks, { type: "audio/webm" });
        if (blob.size > 0) {
          const file = new File([blob], "voice.webm", { type: "audio/webm" });
          uploadFile(file, "AUDIO");
        }
      };

      recorder.start();
      setRecording(true);

      let seconds = 0;
      recordTimer.current = setInterval(() => {
        seconds++;
        setRecordSecs(seconds);
        if (seconds >= 60 && recorder.state !== "inactive") {
          recorder.stop();
        }
      }, 1000);
    } catch (error) {
      console.error("Microphone error:", error);
      alert("Microphone access denied or unavailable.");
    }
  };

  /* ── STOP RECORDING ── */
  const stopRecording = () => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
  };

  /* ── CALLS ── */
  const startCall = (mode) => {
    if (stompClient.current?.connected) {
      stompClient.current.publish({
        destination: "/app/call-notify", // server endpoint
        body: JSON.stringify({ sender: nameRef.current, type: "RING", mode }),
      });
    }
    setIsCaller(true);
    setCallMode(mode);
  };

  const acceptCall = () => {
    setCallKey((k) => k + 1); // ← ADD
    setIsCaller(false);
    setCallMode(incomingCall?.mode || "voice");
    setIncoming(null);
  };

  const rejectCall = () => setIncoming(null);
  const endCall = (secs) => {
    if (secs > 0 && stompClient.current?.connected) {
      stompClient.current.publish({
        destination: "/app/send",
        body: JSON.stringify({
          sender: nameRef.current,
          content: `Call ended — ${Math.floor(secs / 60)}m ${secs % 60}s`,
          type: "CALL",
          callDuration: secs,
        }),
      });
    }
    setCallKey((k) => k + 1); // ← ADD — forces full remount next call
    setCallMode(null);
    setIsCaller(false);
  };

  /* ── INPUT HELPERS ── */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const handleInput = e => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 110) + "px";

    if (stompClient.current?.connected) {
      stompClient.current.publish({
        destination: "/app/typing",
        body: JSON.stringify({ sender: nameRef.current, typing: true }),
      });
    }

    // Clear typing after 2 seconds of no input
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      if (stompClient.current?.connected) {
        stompClient.current.publish({
          destination: "/app/typing",
          body: JSON.stringify({ sender: nameRef.current, typing: false }),
        });
      }
    }, 2000);
  };

  const insertEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
    inputRef.current?.focus();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.type.startsWith("image/")) uploadFile(file, "IMAGE");
    else if (file.type.startsWith("video/")) uploadFile(file, "VIDEO");
    else if (file.type.startsWith("audio/")) uploadFile(file, "AUDIO");
    else uploadFile(file, "FILE");
  };

  /* ── RENDER MESSAGE ── */
  const renderContent = (msg) => {
    if (msg.type === "CALL") {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: 0.85,
          }}
        >
          <IcoPhone
            color={msg.sender === name ? "#fff" : "var(--accent)"}
            size={14}
          />
          <span style={{ fontSize: 13 }}>{msg.content}</span>
        </div>
      );
    }
    const resolveUrl = (url) => {
      if (!url) return "";
      // Strip any embedded host and re-prefix with current server
      if (url.startsWith("http")) {
        const path = url.replace(/^https?:\/\/[^/]+/, "");
        return `http://192.168.100.127:8080${path}`;
      }
      return `http://192.168.100.127:8080${url.startsWith("/") ? "" : "/"}${url}`;
    };

    if (msg.type === "IMAGE") {
      return (
        <img
          src={resolveUrl(msg.fileUrl)}
          alt="img"
          className="msg-img"
          onError={(e) => {
            e.target.style.border = "2px solid red";
            e.target.alt = "Failed: " + resolveUrl(msg.fileUrl);
          }}
        />
      );
    }
    if (msg.type === "FILE") {
      return (
        <a
          href={resolveUrl(msg.fileUrl)}
          target="_blank"
          rel="noreferrer"
          className="msg-file"
        >
          <span className="msg-file-ic">
            <IcoFile color="#fff" size={18} />
          </span>
          <span>{msg.content || "Download File"}</span>
        </a>
      );
    }
    if (msg.type === "AUDIO") {
      return (
        <audio controls src={resolveUrl(msg.fileUrl)} className="msg-audio" />
      );
    }
    if (msg.type === "VIDEO") {
      return (
        <video controls src={resolveUrl(msg.fileUrl)} style={{ maxWidth: 280, maxHeight: 200, borderRadius: 14, display: "block", boxShadow: "0 5px 22px rgba(0,0,0,0.28)" }} />
      );
    }
    return msg.content;
  };

  useEffect(() => () => stompClient.current?.deactivate(), []);

  /* icon color for header/input buttons — dark vs light */
  const IC = dark ? "#a080d0" : "#7c4fbf";

  /* last preview for sidebar */
  const lastMsg = messages.slice(-1)[0];
  const lastPreview = !lastMsg
    ? "No messages yet"
    : lastMsg.type === "IMAGE"
      ? "📷 Photo"
      : lastMsg.type === "AUDIO"
        ? "🎤 Voice message"
        : lastMsg.type === "VIDEO"
          ? "🎬 Video"
          : lastMsg.type === "FILE"
            ? "📎 File"
            : lastMsg.content;

  useEffect(() => {
    if (!messages.length || !stompClient.current?.connected) return;

    // Mark all messages from others as seen when they appear
    messages.forEach(msg => {
      if (msg.sender !== name && msg.id && msg.status !== "SEEN") {
        stompClient.current.publish({
          destination: "/app/seen",
          body: JSON.stringify({ messageId: msg.id, username: name }),
        });
      }
    });
  }, [messages]); // eslint-disable-line


  useEffect(() => {
    const handler = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── THEME TOGGLE ── */
  const ThemeToggle = () => (
    <button
      className="theme-fab"
      onClick={() => setDark((d) => !d)}
      title="Toggle theme"
    >
      <div className="theme-thumb">
        {dark ? (
          <IcoMoon color="#fff" size={14} />
        ) : (
          <IcoSun color="#b45309" size={14} />
        )}
      </div>
    </button>
  );

  /* ════ JOIN ════ — removed, login handled by App.jsx */
  /* ════ CALL ════ */
  if (callMode)
    return (
      <>
        <style>{buildCSS(dark)}</style>
        <CallOverlay
          key={callKey} // ← ADD — forces full destroy/recreate
          mode={callMode}
          myName={name}
          isCaller={isCaller}
          stompClient={stompClient}
          onEnd={endCall}
        />
      </>
    );

  /* ════ CHAT ════ */
  return (
    <>
      <style>{buildCSS(dark)}</style>
      <BackgroundCanvas dark={dark} />
      <ThemeToggle />

      {incomingCall && (
        <IncomingCallBanner
          from={incomingCall.from}
          mode={incomingCall.mode}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}

      <div className="page">
        <div className="chat-window">
          {/* ── SIDEBAR ── */}
          <div className="sidebar">
            <div className="sb-top">
              <div className="sb-name">
                {name}
                <span className="sb-caret">▾</span>
                <button
                  onClick={onLogout}
                  style={{
                    marginLeft: "auto",
                    background: "rgba(251,113,133,0.15)",
                    border: "1px solid rgba(251,113,133,0.3)",
                    borderRadius: 8,
                    color: "#fb7185",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Logout
                </button>
              </div>
              <div className="sb-search">
                <IcoSearch color={IC} size={16} />
                <input placeholder="Search" />
              </div>
            </div>
            <div className="sb-section">
              Online — {onlineUsers.length}
            </div>
            <div className="contact-list">
              {onlineUsers.length === 0 ? (
                <div style={{ padding: "12px 10px", fontSize: 12, color: "var(--text-muted)" }}>
                  No users online
                </div>
              ) : onlineUsers.map((user, i) => (
                <div key={i} className={`contact-item ${user === name ? "active" : ""}`}>
                  <div className="c-av">
                    {user[0].toUpperCase()}
                    <div className="c-online" />
                  </div>
                  <div className="c-info">
                    <div className="c-name">{user} {user === name ? "(you)" : ""}</div>
                    <div className="c-last">
                      {typingUsers.includes(user) ? "✍️ typing..." : "Online"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CHAT PANEL ── */}
          <div
            className="chat-panel"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {dragOver && (
              <div style={{
                position: "absolute", inset: 0, zIndex: 20,
                background: "rgba(196,109,255,0.13)",
                border: "2.5px dashed var(--accent)",
                borderRadius: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
                pointerEvents: "none",
              }}>
                <div style={{
                  background: "var(--glass2)", borderRadius: 16,
                  padding: "22px 36px", textAlign: "center",
                  border: "1px solid var(--glass-border)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📎</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--accent)" }}>Drop to send</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Image, video, audio, or file</div>
                </div>
              </div>
            )}
            {/* Header */}
            <div className="chat-hdr">
              <div className="h-av">C</div>
              <div className="h-info">
                <div className="h-name">Channel 1</div>
                <div className="h-status">
                  <span className="h-dot" />
                  Active now
                </div>
              </div>
              <div className="h-actions">
                <button
                  className="h-btn"
                  title="Voice call"
                  onClick={() => startCall("voice")}
                >
                  <IcoPhone color={IC} size={19} />
                </button>
                <button
                  className="h-btn"
                  title="Video call"
                  onClick={() => startCall("video")}
                >
                  <IcoVideo color={IC} size={19} />
                </button>
                <button className="h-btn" title="Info">
                  <IcoInfo color={IC} size={19} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="msgs">
              {messages.length === 0 ? (
                <div className="empty-wrap">
                  <div className="empty-av">C</div>
                  <div className="empty-name">Channel 1</div>
                  <div className="empty-hint">
                    No messages yet — say something! 👋
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const me = msg.sender === name;
                  return (
                    <div key={i} className={`msg-group ${me ? "me" : "other"}`}>
                      {!me && <div className="msg-sender">{msg.sender}</div>}
                      <div className="msg-row">
                        {!me && (
                          <div className="mini-av">{initial(msg.sender)}</div>
                        )}
                        <div
                          className={`msg-bubble${msg.type === "IMAGE" ? " is-image" : ""}`}
                        >
                          {renderContent(msg)}
                        </div>
                      </div>
                      <div className="msg-time">
                        {msg.time}
                        {msg.sender === name && (
                          <span style={{ marginLeft: 5, fontSize: 11 }}>
                            {msg.status === "SEEN"
                              ? <span style={{ color: "#60a5fa" }}>✓✓</span>
                              : msg.status === "DELIVERED"
                                ? <span style={{ color: "var(--text-muted)" }}>✓✓</span>
                                : <span style={{ color: "var(--text-muted)" }}>✓</span>}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {typingUsers.length > 0 && (
                <div className="msg-group other" style={{ marginBottom: 4 }}>
                  <div className="msg-row">
                    <div className="mini-av">{typingUsers[0][0].toUpperCase()}</div>
                    <div className="msg-bubble" style={{
                      padding: "10px 16px",
                      display: "flex", alignItems: "center", gap: 5,
                    }}>
                      <span style={{ fontSize: 12, color: "var(--text-sub)" }}>
                        {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing
                      </span>
                      <span style={{ display: "flex", gap: 3, alignItems: "center" }}>
                        {[0, 1, 2].map(i => (
                          <span key={i} style={{
                            width: 5, height: 5, borderRadius: "50%",
                            background: "var(--text-muted)",
                            display: "inline-block",
                            animation: `blink 1.2s infinite ${i * 0.2}s`,
                          }} />
                        ))}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEnd} />
            </div>

            {/* Input */}
            <div className="input-area" style={{ position: "relative" }}>
              <div className="input-row">
                <textarea
                  ref={inputRef}
                  className="msg-ta"
                  value={message}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Message…"
                  rows={1}
                />
                <div className="input-icons">
                  <button
                    className="ico-btn"
                    title="Send photo"
                    onClick={() => imageInputRef.current.click()}
                  >
                    <IcoImage color={IC} size={20} />
                  </button>
                  <button
                    className="ico-btn"
                    title="Attach file"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <IcoPaperclip color={IC} size={20} />
                  </button>
                  <button
                    className="ico-btn"
                    title="Send video"
                    onClick={() => videoInputRef.current.click()}
                  >
                    <IcoVideo color={IC} size={20} />
                  </button>
                  <button
                    className={`ico-btn${recording ? " rec" : ""}`}
                    title={recording ? "Stop recording" : "Voice message"}
                    onClick={recording ? stopRecording : startRecording}
                  >
                    {recording ? (
                      <IcoMicOff color="#ef4444" size={20} />
                    ) : (
                      <IcoMic color={IC} size={20} />
                    )}
                  </button>
                  <button
                    className="ico-btn"
                    title="Emoji"
                    onClick={(e) => { e.stopPropagation(); setShowEmoji(v => !v); }}
                  >
                    <IcoSmile color={IC} size={20} />
                  </button>
                  <button
                    className="send-btn"
                    title="Send"
                    onClick={sendMessage}
                  >
                    <IcoSend color="#fff" size={17} />
                  </button>
                </div>
              </div>
              {recording && (
                <div className="rec-badge">
                  <span className="rec-dot" /> Recording {recordSecs}s — tap mic
                  to stop
                </div>
              )}
              {showEmoji && (
                <EmojiPicker onSelect={insertEmoji} emojiRef={emojiRef} />
              )}
            </div>
          </div>
        <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <input
            type="file"
            accept="video/*"
            ref={videoInputRef}
            style={{ display: "none" }}
            onChange={handleVideoChange}
          />
        </div>
      </div>
    </>
  );
}