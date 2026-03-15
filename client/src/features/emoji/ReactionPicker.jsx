// features/emoji/ReactionPicker.jsx
// Quick 8-emoji reaction bar that floats above a message on hover.
// Only renders the QUICK_REACTIONS subset, not the full emoji list.

import React from "react";
import { QUICK_REACTIONS } from "./emoji.constants";

/**
 * @param {object}               props
 * @param {(emoji: string) => void} props.onSelect  Called with the chosen emoji
 * @param {object}               [props.style]      Extra inline styles for positioning
 */
export default function ReactionPicker({ onSelect, style }) {
  return (
    <div style={{
      position:   "absolute",
      zIndex:     60,
      background: "var(--glass2)",
      border:     "1px solid var(--glass-border)",
      borderRadius: 999,
      padding:    "4px 8px",
      display:    "flex",
      gap:        2,
      boxShadow:  "0 4px 20px rgba(0,0,0,0.35)",
      backdropFilter: "blur(20px)",
      ...style,
    }}>
      {QUICK_REACTIONS.map((emoji, i) => (
        <button
          key={i}
          onClick={() => onSelect(emoji)}
          style={{
            width:      32,
            height:     32,
            border:     "none",
            borderRadius: "50%",
            background: "transparent",
            cursor:     "pointer",
            fontSize:   18,
            display:    "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.1s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.3)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}