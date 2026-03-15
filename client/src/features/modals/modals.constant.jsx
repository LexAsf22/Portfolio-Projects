// features/modals/modal.constants.js
// All magic values that are only meaningful inside the modals feature.

// ─── Modal identifiers ────────────────────────────────────────────────────────
// Used by modal.manager.js to key open/close state and by Chat.jsx
// keybind handler to know which modal to close on Escape.

export const MODAL_IDS = {
  SETTINGS:    "settings",
  PROFILE:     "profile",
  CREATE_ROOM: "createRoom",
};

// ─── Settings tab identifiers ─────────────────────────────────────────────────
// Every tab rendered inside SettingsModal has a stable ID so Chat.jsx
// can programmatically navigate to a specific tab (e.g. open straight
// to "account" after a username change).

export const SETTINGS_TABS = {
  ACCOUNT:      "account",
  ACCOUNT_EMAIL:"account-email",
  ACCOUNT_USERNAME: "account-username",
  PROFILE:      "profile",
  APPEARANCE:   "appearance",
  NOTIFICATIONS:"notifications",
  KEYBINDS:     "keybinds",
  PRIVACY:      "privacy",
  DANGER:       "danger",
};

// ─── Room template definitions ────────────────────────────────────────────────
// Used exclusively by CreateRoomModal to render the template picker.
// Kept here (not in shared) because template data is modal-specific UI config.

export const ROOM_TEMPLATES = [
  {
    id: "own", emoji: "🌟", label: "Create My Own",
    desc: "Start fresh with a blank room",
    color: "linear-gradient(135deg,#7c3aed,#a855f7)",
  },
  {
    id: "gaming", emoji: "🎮", label: "Gaming",
    desc: "A place for your gaming squad",
    color: "linear-gradient(135deg,#059669,#10b981)",
  },
  {
    id: "friends", emoji: "💖", label: "Friends",
    desc: "Hang out with your closest friends",
    color: "linear-gradient(135deg,#db2777,#ec4899)",
  },
  {
    id: "study", emoji: "📚", label: "Study Group",
    desc: "Collaborate and learn together",
    color: "linear-gradient(135deg,#d97706,#f59e0b)",
  },
  {
    id: "school", emoji: "🏫", label: "School Club",
    desc: "Organize your club or class",
    color: "linear-gradient(135deg,#2563eb,#3b82f6)",
  },
  {
    id: "sports", emoji: "⚽", label: "Sports",
    desc: "Cheer on your team together",
    color: "linear-gradient(135deg,#16a34a,#22c55e)",
  },
  {
    id: "music", emoji: "🎵", label: "Music",
    desc: "Share beats and discover new tracks",
    color: "linear-gradient(135deg,#7c3aed,#06b6d4)",
  },
  {
    id: "art", emoji: "🎨", label: "Art & Creative",
    desc: "A canvas for creators",
    color: "linear-gradient(135deg,#ea580c,#f97316)",
  },
  {
    id: "tech", emoji: "💻", label: "Tech & Dev",
    desc: "Build things and share ideas",
    color: "linear-gradient(135deg,#0891b2,#06b6d4)",
  },
  {
    id: "anime", emoji: "⛩️", label: "Anime & Manga",
    desc: "Discuss your favorite series",
    color: "linear-gradient(135deg,#9333ea,#ec4899)",
  },
  {
    id: "travel", emoji: "✈️", label: "Travel",
    desc: "Share adventures around the world",
    color: "linear-gradient(135deg,#0284c7,#38bdf8)",
  },
  {
    id: "food", emoji: "🍜", label: "Food & Cooking",
    desc: "Recipes, restaurants, and more",
    color: "linear-gradient(135deg,#b45309,#f59e0b)",
  },
];