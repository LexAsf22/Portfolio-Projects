// features/emoji/EmojiPicker.jsx
// Full emoji grid shown above the input bar when the user clicks the smile
// icon.  Renders all emojis from the EMOJIS constant in a scrollable grid.

import React from "react";
import { EMOJIS } from "./emoji.constants";

/**
 * @param {object}              props
 * @param {(emoji: string) => void} props.onSelect  Called with the chosen emoji
 * @param {React.RefObject}     props.emojiRef      Ref for outside-click detection
 */
export default function EmojiPicker({ onSelect, emojiRef }) {
  return (
    <div
      ref={emojiRef}
      style={{
        position:   "absolute",
        bottom:     70,
        right:      20,
        zIndex:     50,
        width:      300,
        maxHeight:  220,
        overflowY:  "auto",
        background: "var(--glass2)",
        border:     "1px solid var(--glass-border)",
        borderRadius: 16,
        padding:    10,
        display:    "flex",
        flexWrap:   "wrap",
        gap:        2,
        boxShadow:  "0 8px 32px rgba(0,0,0,0.35)",
        backdropFilter: "blur(20px)",
      }}
    >
      {EMOJIS.map((emoji, i) => (
        <button
          key={i}
          onClick={() => onSelect(emoji)}
          style={{
            width:      36,
            height:     36,
            border:     "none",
            borderRadius: 8,
            background: "transparent",
            cursor:     "pointer",
            fontSize:   20,
            display:    "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.1s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-soft)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}