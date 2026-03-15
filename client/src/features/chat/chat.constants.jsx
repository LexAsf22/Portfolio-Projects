// features/chat/chat.constants.js
// All magic values specific to the chat feature.

// ─── View identifiers ─────────────────────────────────────────────────────────
// The `view` string in Chat.jsx — centralised so every feature that
// needs to switch views uses a constant, not a raw string.

export const VIEWS = {
  CHANNEL: "channel",
  DM:      "dm",
  ROOM:    "room",
  FRIENDS: "friends",
};

// ─── Message types ────────────────────────────────────────────────────────────
// Matches the `type` field the server sends and expects on every message.

export const MSG_TYPES = {
  TEXT:           "TEXT",
  IMAGE:          "IMAGE",
  FILE:           "FILE",
  AUDIO:          "AUDIO",
  VIDEO:          "VIDEO",
  CALL:           "CALL",
  FRIEND_REQUEST: "FRIEND_REQUEST",
};

// ─── Typing indicator ─────────────────────────────────────────────────────────

// How long (ms) after the user stops typing before the "typing…" indicator
// is cleared on the server.
export const TYPING_DEBOUNCE_MS = 2000;

// ─── Voice recording ─────────────────────────────────────────────────────────

// Maximum recording length in seconds before auto-stop.
export const MAX_RECORD_SECS = 60;

// ─── Message search ───────────────────────────────────────────────────────────

// The CSS class added to a message row that matches the search query.
export const SEARCH_HIT_CLASS    = "msg-highlight";
export const SEARCH_ACTIVE_CLASS = "msg-highlight active";