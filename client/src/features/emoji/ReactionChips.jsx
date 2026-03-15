// features/emoji/ReactionChips.jsx
// Renders the row of reaction chips beneath a message bubble.
// Previously this JSX was inlined inside Chat.jsx's message map —
// extracting it here makes the message renderer much leaner.

import React from "react";
import { isOwnReaction, reactionTooltip } from "./emoji.utils";

/**
 * @param {object}   props
 * @param {Array}    props.grouped       Output of buildReactionDisplay().visible
 * @param {string}   props.localUsername Current user — determines "mine" highlight
 * @param {Function} props.onReact       (emoji: string) => void
 * @param {boolean}  [props.alignRight]  true when message is from the local user
 */
export default function ReactionChips({ grouped, localUsername, onReact, alignRight = false }) {
  if (!grouped || grouped.length === 0) return null;

  return (
    <div
      className="reactions-row"
      style={{ paddingLeft: alignRight ? 0 : 34 }}
    >
      {grouped.map((r, i) => (
        <button
          key={i}
          className={`reaction-chip${isOwnReaction(r, localUsername) ? " mine" : ""}`}
          onClick={() => onReact(r.emoji)}
          title={reactionTooltip(r)}
        >
          {r.emoji}
          <span className="reaction-count">{r.count}</span>
        </button>
      ))}
    </div>
  );
}