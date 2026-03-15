// features/emoji/emoji.constants.js
// All emoji-feature-specific constants.
//
// Note on split with shared/constants/ui.js:
//  EMOJIS and QUICK_REACTIONS are re-exported from here so every part of
//  the app imports from one place — features/emoji — rather than reaching
//  into shared directly for emoji data. shared/constants/ui.js keeps them
//  as the single source of truth; this file is the feature-level public
//  surface that also adds the category definitions used by EmojiPicker.

export { EMOJIS, QUICK_REACTIONS } from "../../shared/constants/ui";

// ─── Emoji categories ─────────────────────────────────────────────────────────
// Defines the display order and label of each category tab in EmojiPicker.
// Category keys are indices into the EMOJIS array (10 emojis per category).

export const EMOJI_CATEGORIES = [
  { label: "😀 Smileys",  start: 0  },
  { label: "👍 Gestures", start: 20 },
  { label: "❤️ Hearts",   start: 30 },
  { label: "🔥 Symbols",  start: 40 },
  { label: "👾 Fun",      start: 50 },
  { label: "🍕 Food",     start: 60 },
  { label: "⚽ Activities",start: 70 },
];

// ─── Reaction display limits ───────────────────────────────────────────────────

// Maximum number of unique reaction emojis shown on a single message.
// Additional reactions are hidden behind a "+N more" chip.
export const MAX_VISIBLE_REACTIONS = 8;

// Volume threshold for the active-speaker highlight (reused from call feature
// but also used here for the speaking indicator on reaction chips).
// Kept here rather than imported from call because emoji/reaction rendering
// has no dependency on the call feature.
export const REACTION_ANIMATION_MS = 200;