// shared/components/icons.jsx
// Every SVG icon used anywhere in the app.
//
// Rules:
//  • Named exports only — consumers import exactly what they need.
//  • Each icon accepts `size` (px number) and `color` (CSS string).
//  • Zero external dependencies — no hooks, no context, no constants.
//  • svgBase() is file-private; it is NOT exported.

import React from "react";

// ─── Private helper ───────────────────────────────────────────────────────────

const svgBase = (size) => ({
  display: "block",
  width: size,
  height: size,
  overflow: "visible",
  flexShrink: 0,
});

// ─── Icons ────────────────────────────────────────────────────────────────────

export function IcoSend({ size = 18, color = "#fff" }) {
  return (
    <svg viewBox="0 0 24 24" style={svgBase(size)}>
      <line x1="22" y1="2" x2="11" y2="13"
        style={{ stroke: color, strokeWidth: 2.2, strokeLinecap: "round" }} />
      <polygon points="22 2 15 22 11 13 2 9 22 2"
        style={{ fill: color, stroke: "none" }} />
    </svg>
  );
}

export function IcoImage({ size = 20, color = "#8b6fd4" }) {
  return (
    <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <circle cx="8.5" cy="8.5" r="1.5" style={{ fill: color }} />
      <polyline points="21 15 16 10 5 21"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }} />
    </svg>
  );
}

export function IcoPaperclip({ size = 20, color = "#8b6fd4" }) {
  return (
    <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none">
      <path
        d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }} />
    </svg>
  );
}

export function IcoMic({ size = 20, color = "#8b6fd4" }) {
  return (
    <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none">
      <rect x="9" y="1" width="6" height="11" rx="3"
        style={{ stroke: color, strokeWidth: 1.9, fill: "none" }} />
      <path d="M5 10v2a7 7 0 0 0 14 0v-2"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <line x1="12" y1="19" x2="12" y2="23"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }} />
      <line x1="8" y1="23" x2="16" y2="23"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }} />
    </svg>
  );
}

export function IcoMicOff({ size = 20, color = "#ef4444" }) {
  return (
    <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none">
      <line x1="1" y1="1" x2="23" y2="23"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }} />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <path d="M15 9.34V4a3 3 0 0 0-5.94-.6"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <path d="M17 16.95A7 7 0 0 1 5 12v-2"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <line x1="12" y1="19" x2="12" y2="23"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }} />
      <line x1="8" y1="23" x2="16" y2="23"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }} />
    </svg>
  );
}

export function IcoPhone({ size = 20, color = "#8b6fd4" }) {
  return (
    <svg viewBox="0 0 24 24" style={svgBase(size)}>
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
        style={{ fill: color, stroke: "none" }} />
    </svg>
  );
}

export function IcoPhoneOff({ size = 22, color = "#fff" }) {
  return (
    <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none">
      <path
        d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45c1.12.45 2.3.7 3.53.7a2 2 0 0 1 2 2v3.5a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2h3.5a2 2 0 0 1 2 2c0 1.23.25 2.41.7 3.53a2 2 0 0 1-.45 2.11L10.68 13.31z"
        style={{ stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }} />
      <line x1="1" y1="1" x2="23" y2="23"
        style={{ stroke: color, strokeWidth: 2, strokeLinecap: "round" }} />
    </svg>
  );
}

export function IcoVideo({ size = 20, color = "#8b6fd4" }) {
  return (
    <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none">
      <rect x="1" y="5" width="15" height="14" rx="2"
        style={{ stroke: color, strokeWidth: 1.9, fill: "none" }} />
      <polygon points="23 7 16 12 23 17 23 7"
        style={{ fill: color, stroke: "none" }} />
    </svg>
  );
}

export function IcoVideoOff({ size = 20, color = "#ef4444" }) {
  return (
    <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none">
      <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <path d="M10.66 5H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <line x1="1" y1="1" x2="23" y2="23"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }} />
    </svg>
  );
}

export function IcoInfo({ size = 20, color = "#8b6fd4" }) {
  return (
    <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none">
      <circle cx="12" cy="12" r="10"
        style={{ stroke: color, strokeWidth: 1.9, fill: "none" }} />
      <line x1="12" y1="16" x2="12" y2="12"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }} />
      <circle cx="12" cy="8" r="0.5"
        style={{ fill: color, stroke: color, strokeWidth: 1.5 }} />
    </svg>
  );
}

export function IcoSearch({ size = 16, color = "#8b6fd4" }) {
  return (
    <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none">
      <circle cx="11" cy="11" r="8"
        style={{ stroke: color, strokeWidth: 2.2, fill: "none" }} />
      <line x1="21" y1="21" x2="16.65" y2="16.65"
        style={{ stroke: color, strokeWidth: 2.2, strokeLinecap: "round" }} />
    </svg>
  );
}

export function IcoSun({ size = 16, color = "#d97706" }) {
  return (
    <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none">
      <circle cx="12" cy="12" r="5"
        style={{ stroke: color, strokeWidth: 2, fill: "none" }} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const r = (Math.PI * deg) / 180;
        return (
          <line key={i}
            x1={12 + 8 * Math.cos(r)} y1={12 + 8 * Math.sin(r)}
            x2={12 + 11 * Math.cos(r)} y2={12 + 11 * Math.sin(r)}
            style={{ stroke: color, strokeWidth: 2, strokeLinecap: "round" }} />
        );
      })}
    </svg>
  );
}

export function IcoMoon({ size = 16, color = "#fff" }) {
  return (
    <svg viewBox="0 0 24 24" style={svgBase(size)}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        style={{ fill: color, stroke: "none" }} />
    </svg>
  );
}

export function IcoFile({ size = 18, color = "#fff" }) {
  return (
    <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <polyline points="13 2 13 9 20 9"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }} />
    </svg>
  );
}

export function IcoEdit({ size = 15, color = "#8b6fd4" }) {
  return (
    <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
    </svg>
  );
}

export function IcoTrash({ size = 15, color = "#fb7185" }) {
  return (
    <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none">
      <polyline points="3 6 5 6 21 6"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }} />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <path d="M10 11v6M14 11v6"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round" }} />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
    </svg>
  );
}

export function IcoPlus({ size = 16, color = "#8b6fd4" }) {
  return (
    <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none">
      <line x1="12" y1="5" x2="12" y2="19"
        style={{ stroke: color, strokeWidth: 2.2, strokeLinecap: "round" }} />
      <line x1="5" y1="12" x2="19" y2="12"
        style={{ stroke: color, strokeWidth: 2.2, strokeLinecap: "round" }} />
    </svg>
  );
}

export function IcoHash({ size = 16, color = "#8b6fd4" }) {
  return (
    <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none">
      <line x1="4" y1="9" x2="20" y2="9"   style={{ stroke: color, strokeWidth: 2, strokeLinecap: "round" }} />
      <line x1="4" y1="15" x2="20" y2="15"  style={{ stroke: color, strokeWidth: 2, strokeLinecap: "round" }} />
      <line x1="10" y1="3" x2="8" y2="21"   style={{ stroke: color, strokeWidth: 2, strokeLinecap: "round" }} />
      <line x1="16" y1="3" x2="14" y2="21"  style={{ stroke: color, strokeWidth: 2, strokeLinecap: "round" }} />
    </svg>
  );
}

export function IcoBack({ size = 18, color = "#8b6fd4" }) {
  return (
    <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none">
      <polyline points="15 18 9 12 15 6"
        style={{ stroke: color, strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" }} />
    </svg>
  );
}

export function IcoSmile({ size = 20, color = "#8b6fd4" }) {
  return (
    <svg viewBox="0 0 24 24" style={svgBase(size)} fill="none">
      <circle cx="12" cy="12" r="10"
        style={{ stroke: color, strokeWidth: 1.9, fill: "none" }} />
      <path d="M8 14s1.5 2 4 2 4-2 4-2"
        style={{ stroke: color, strokeWidth: 1.9, strokeLinecap: "round", fill: "none" }} />
      <circle cx="9" cy="10" r="0.8" style={{ fill: color }} />
      <circle cx="15" cy="10" r="0.8" style={{ fill: color }} />
    </svg>
  );
}