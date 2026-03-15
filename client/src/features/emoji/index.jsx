// features/emoji/index.js
// Public API of the emoji feature module.
// Chat.jsx imports exclusively from here — never from internal files directly.

// ─── Components ───────────────────────────────────────────────────────────────
export { default as EmojiPicker }    from "./EmojiPicker";
export { default as ReactionPicker } from "./ReactionPicker";
export { default as ReactionChips }  from "./ReactionChips";

// ─── Handlers ────────────────────────────────────────────────────────────────
export {
  makeReactionHandler,
  sendReaction,
  closeEmojiOnOutsideClick,
} from "./emoji.handlers";

// ─── Utils ───────────────────────────────────────────────────────────────────
export {
  buildReactionDisplay,
  isOwnReaction,
  reactionTooltip,
  insertEmoji,
} from "./emoji.utils";

// ─── Constants ───────────────────────────────────────────────────────────────
export {
  EMOJIS,
  QUICK_REACTIONS,
  EMOJI_CATEGORIES,
  MAX_VISIBLE_REACTIONS,
} from "./emoji.constants";