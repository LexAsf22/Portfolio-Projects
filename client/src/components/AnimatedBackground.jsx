// src/components/AnimatedBackground.jsx
// Animated canvas background — dark mode renders a star field with nebula orbs,
// light mode renders a pastel gradient with drifting clouds.
// Extracted from Chat.jsx (was called AnimatedBackground there).

import { useEffect, useRef } from "react";

export default function AnimatedBackground({ dark }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, t = 0, raf;

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 180 }, () => ({
      x:     Math.random(),
      y:     Math.random(),
      r:     Math.random() * 1.4 + 0.2,
      spd:   Math.random() * 0.00008 + 0.00002,
      op:    Math.random() * 0.6 + 0.2,
      tw:    Math.random() * 0.02 + 0.004,
      twOff: Math.random() * Math.PI * 2,
    }));

    const orbs = [
      { x: 0.15, y: 0.20, r: 0.28, h: 255, spd: 0.08 },
      { x: 0.80, y: 0.65, r: 0.22, h: 290, spd: 0.06 },
      { x: 0.50, y: 0.85, r: 0.20, h: 210, spd: 0.10 },
    ];

    const clouds = Array.from({ length: 6 }, () => ({
      x:   Math.random(),
      y:   0.05 + Math.random() * 0.5,
      w:   0.15 + Math.random() * 0.20,
      h:   0.05 + Math.random() * 0.06,
      spd: 0.00004 + Math.random() * 0.00004,
      op:  0.5 + Math.random() * 0.35,
      puffs: Array.from({ length: 5 + Math.floor(Math.random() * 4) }, () => ({
        ox: (Math.random() - 0.4) * 0.9,
        oy: (Math.random() - 0.5) * 0.5,
        rs: 0.4 + Math.random() * 0.7,
      })),
    }));

    const draw = () => {
      t += 0.008;

      if (dark) {
        ctx.fillStyle = "#070510";
        ctx.fillRect(0, 0, W, H);

        // Nebula orbs
        orbs.forEach((o, i) => {
          const dx = Math.sin(t * o.spd + i) * 0.05;
          const dy = Math.cos(t * o.spd * 0.7 + i) * 0.04;
          const cx = (o.x + dx) * W, cy = (o.y + dy) * H;
          const r  = o.r * Math.min(W, H);
          const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          g.addColorStop(0,   `hsla(${o.h},80%,55%,0.09)`);
          g.addColorStop(0.5, `hsla(${o.h},70%,45%,0.04)`);
          g.addColorStop(1,   `hsla(${o.h},60%,35%,0)`);
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        });

        // Stars
        stars.forEach(s => {
          s.x += s.spd;
          if (s.x > 1) s.x -= 1;
          const a = s.op * (0.4 + 0.6 * Math.sin(t * s.tw * 50 + s.twOff));
          ctx.beginPath();
          ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220,215,255,${a})`;
          ctx.fill();
        });

      } else {
        // Light-mode sky gradient
        const sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0,   "#e8e2ff");
        sky.addColorStop(0.5, "#f0ecff");
        sky.addColorStop(1,   "#fdf8ff");
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        // Soft coloured orbs
        orbs.forEach((o, i) => {
          const dx = Math.sin(t * o.spd + i) * 0.05;
          const dy = Math.cos(t * o.spd * 0.7 + i) * 0.04;
          const cx = (o.x + dx) * W, cy = (o.y + dy) * H;
          const r  = o.r * Math.min(W, H);
          const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          g.addColorStop(0, `hsla(${o.h},70%,65%,0.22)`);
          g.addColorStop(1, `hsla(${o.h},60%,55%,0)`);
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        });

        // Drifting clouds
        clouds.forEach(c => {
          c.x += c.spd;
          if (c.x > 1.3) c.x = -0.3;
          const cx2 = c.x * W, cy2 = c.y * H;
          const rw  = c.w * W, rh  = c.h * H;
          c.puffs.forEach(p => {
            const px = cx2 + p.ox * rw, py = cy2 + p.oy * rh, pr = p.rs * rh;
            const cg = ctx.createRadialGradient(px, py - pr * 0.2, 0, px, py, pr * 1.4);
            cg.addColorStop(0, `rgba(255,255,255,${c.op})`);
            cg.addColorStop(1, "rgba(230,220,255,0)");
            ctx.beginPath();
            ctx.arc(px, py, pr * 1.4, 0, Math.PI * 2);
            ctx.fillStyle = cg;
            ctx.fill();
          });
        });
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [dark]);

  return (
    <canvas
      ref={canvasRef}
      className="bg-canvas"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}
    />
  );
}