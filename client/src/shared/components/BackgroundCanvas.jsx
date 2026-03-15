// shared/components/BackgroundCanvas.jsx
// Animated canvas that renders behind the whole app.
// Extracted to shared/components because it has no dependency on any
// feature state — it only reads the `dark` prop and manages its own
// canvas animation lifecycle.

import React, { useRef, useEffect } from "react";

export default function BackgroundCanvas({ dark }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    let W, H;

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;

    // ── Night-sky assets ──────────────────────────────────────────────────────
    const stars = Array.from({ length: 300 }, () => ({
      x:     Math.random(),
      y:     Math.random(),
      r:     Math.random() * 1.6 + 0.2,
      spd:   Math.random() * 0.0001 + 0.00003,
      op:    Math.random() * 0.75 + 0.25,
      tw:    Math.random() * 0.025 + 0.004,
      twOff: Math.random() * Math.PI * 2,
    }));

    const NEBULAS = [
      { cx: 0.15, cy: 0.25, rx: 0.30, ry: 0.22, h: 260, s: 80 },
      { cx: 0.75, cy: 0.60, rx: 0.32, ry: 0.26, h: 200, s: 70 },
      { cx: 0.50, cy: 0.55, rx: 0.38, ry: 0.22, h: 300, s: 60 },
      { cx: 0.88, cy: 0.18, rx: 0.22, ry: 0.18, h: 240, s: 75 },
    ];

    const shoots = [];
    const shootInt = setInterval(
      () =>
        shoots.push({
          x:     Math.random() * W,
          y:     Math.random() * H * 0.45,
          len:   Math.random() * 140 + 60,
          spd:   Math.random() * 9 + 6,
          angle: Math.PI / 5 + (Math.random() - 0.5) * 0.3,
          life:  1,
          decay: Math.random() * 0.016 + 0.01,
        }),
      2600,
    );

    // ── Day-sky assets ────────────────────────────────────────────────────────
    const clouds = Array.from({ length: 7 }, () => ({
      x:     Math.random(),
      y:     0.05 + Math.random() * 0.45,
      w:     0.12 + Math.random() * 0.18,
      h:     0.04 + Math.random() * 0.06,
      spd:   0.00004 + Math.random() * 0.00005,
      op:    0.55 + Math.random() * 0.35,
      puffs: Array.from({ length: 5 + Math.floor(Math.random() * 4) }, () => ({
        ox: (Math.random() - 0.4) * 0.9,
        oy: (Math.random() - 0.5) * 0.5,
        rs: 0.4 + Math.random() * 0.7,
      })),
    }));

    // ── Draw loop ─────────────────────────────────────────────────────────────
    const draw = () => {
      t += 0.01;

      if (dark) {
        // Night sky
        ctx.fillStyle = "#03030a";
        ctx.fillRect(0, 0, W, H);

        NEBULAS.forEach((n, i) => {
          const drift = Math.sin(t * 0.15 + i * 1.4) * 0.022;
          const cx    = (n.cx + drift) * W;
          const cy    = n.cy * H;
          const rx    = n.rx * W;
          const ry    = n.ry * H;
          const g     = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
          g.addColorStop(0,   `hsla(${n.h},${n.s}%,58%,0.14)`);
          g.addColorStop(0.5, `hsla(${n.h + 20},${n.s - 10}%,48%,0.06)`);
          g.addColorStop(1,   `hsla(${n.h},${n.s}%,38%,0)`);
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
          const a  = s.op * (0.35 + 0.65 * tw);
          ctx.beginPath();
          ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(215,228,255,${a})`;
          ctx.fill();
        });

        for (let i = shoots.length - 1; i >= 0; i--) {
          const s = shoots[i];
          s.x    += Math.cos(s.angle) * s.spd;
          s.y    += Math.sin(s.angle) * s.spd;
          s.life -= s.decay;
          if (s.life <= 0 || s.x > W || s.y > H) { shoots.splice(i, 1); continue; }
          const tx = s.x - Math.cos(s.angle) * s.len;
          const ty = s.y - Math.sin(s.angle) * s.len;
          const g  = ctx.createLinearGradient(tx, ty, s.x, s.y);
          g.addColorStop(0, "rgba(255,255,255,0)");
          g.addColorStop(1, `rgba(255,255,255,${s.life * 0.9})`);
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(s.x, s.y);
          ctx.strokeStyle = g;
          ctx.lineWidth   = 1.6;
          ctx.stroke();
        }
      } else {
        // Day sky
        const sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0,    "#2196f3");
        sky.addColorStop(0.35, "#64b5f6");
        sky.addColorStop(0.7,  "#b3e5fc");
        sky.addColorStop(1,    "#e1f5fe");
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        const sx = W * 0.8;
        const sy = H * 0.12;
        const sr = Math.min(W, H) * 0.065;

        const glow = ctx.createRadialGradient(sx, sy, sr * 0.3, sx, sy, sr * 4);
        glow.addColorStop(0,   "rgba(255,245,80,0.55)");
        glow.addColorStop(0.4, "rgba(255,220,40,0.16)");
        glow.addColorStop(1,   "rgba(255,200,0,0)");
        ctx.beginPath();
        ctx.arc(sx, sy, sr * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.save();
        ctx.translate(sx, sy);
        for (let i = 0; i < 12; i++) {
          const a  = (i / 12) * Math.PI * 2 + t * 0.008;
          const r1 = sr * 1.35;
          const r2 = sr * (1.9 + 0.12 * Math.sin(t * 1.2 + i));
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
          ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
          ctx.strokeStyle = `rgba(255,235,80,${0.4 + 0.2 * Math.sin(t + i)})`;
          ctx.lineWidth   = 2.5;
          ctx.stroke();
        }
        ctx.restore();

        const disk = ctx.createRadialGradient(sx - sr * 0.25, sy - sr * 0.25, 0, sx, sy, sr);
        disk.addColorStop(0,   "#fff9c4");
        disk.addColorStop(0.5, "#ffe033");
        disk.addColorStop(1,   "#ffb700");
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fillStyle = disk;
        ctx.fill();

        clouds.forEach((c) => {
          c.x += c.spd;
          if (c.x > 1.3) c.x = -0.3;
          const cx2 = c.x * W;
          const cy2 = c.y * H;
          const rw  = c.w * W;
          const rh  = c.h * H;
          c.puffs.forEach((p) => {
            const px = cx2 + p.ox * rw;
            const py = cy2 + p.oy * rh;
            const pr = p.rs * rh;
            const cg = ctx.createRadialGradient(px, py - pr * 0.2, 0, px, py, pr * 1.4);
            cg.addColorStop(0,   `rgba(255,255,255,${c.op})`);
            cg.addColorStop(0.6, `rgba(240,245,255,${c.op * 0.7})`);
            cg.addColorStop(1,   "rgba(220,230,255,0)");
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