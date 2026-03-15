// shared/constants/ui.js
// Static UI data: emoji sets, avatar colours, default settings, storage keys.
// None of these values change at runtime, so they live here as constants
// rather than inside component state.

// ─── Emoji ────────────────────────────────────────────────────────────────────

export const EMOJIS = [
  "😀", "😂", "😍", "😎", "😭", "😅", "🤔", "😤", "🥰", "😇",
  "🤣", "😊", "😋", "😜", "🤩", "🥳", "😏", "😒", "😔", "😳",
  "👍", "👎", "👏", "🙌", "🤝", "🙏", "👋", "💪", "🤜", "✌️",
  "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "💔", "💕", "💯",
  "🔥", "⭐", "✨", "🎉", "🎊", "🎁", "🏆", "🎯", "💡", "🚀",
  "😈", "👻", "💀", "🤖", "👽", "🐶", "🐱", "🐭", "🦊", "🐻",
  "🍕", "🍔", "🍟", "🌮", "🍜", "🍣", "🍩", "🍪", "☕", "🧋",
  "⚽", "🏀", "🎮", "🎵", "🎬", "📸", "💻", "📱", "🌈", "🌙",
];

export const QUICK_REACTIONS = ["❤️", "😂", "😮", "😢", "😡", "👍", "👎", "🔥"];

// ─── Avatar gradients ─────────────────────────────────────────────────────────
// Ordered list used to assign a deterministic gradient per username.
// getAvatarGradient() in utils/formatters.js picks from this list.

export const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#7c3aed,#a855f7)",
  "linear-gradient(135deg,#06b6d4,#7c3aed)",
  "linear-gradient(135deg,#ec4899,#a855f7)",
  "linear-gradient(135deg,#059669,#06b6d4)",
  "linear-gradient(135deg,#f59e0b,#ec4899)",
  "linear-gradient(135deg,#0284c7,#7c3aed)",
  "linear-gradient(135deg,#d97706,#f97316)",
];

// ─── Keyboard shortcuts ───────────────────────────────────────────────────────
// These are the factory-default keybinds.  The user can override them in
// Settings; the overrides are persisted under LS_KEYS.keybinds.

export const DEFAULT_KEYBINDS = {
  sendMessage:  "Enter",
  toggleMute:   "m",
  toggleCamera: "v",
  leaveCall:    "Escape",
  closeModal:   "Escape",
  openSettings: ",",
};

// ─── localStorage keys ────────────────────────────────────────────────────────
// Centralised so a key-name typo is caught in one place rather than
// scattered across six different components.

export const LS_KEYS = {
  // Per-user (call the factory with authUser)
  friends:       (u) => `friends_${u}`,
  friendReqs:    (u) => `friendreqs_${u}`,
  friendReqsOut: (u) => `friendreqs_out_${u}`,

  // Global app preferences
  fontSize:      "fontSize",
  bubbleStyle:   "bubbleStyle",
  notifSound:    "notifSound",
  compactMode:   "compactMode",
  privacyDm:     "privacyDm",
  privacyFriend: "privacyFriend",
  keybinds:      "keybinds",
};