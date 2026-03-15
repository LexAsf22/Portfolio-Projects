// features/room/room.constants.js
// All magic values that are only meaningful inside the room feature.

// ─── Room types ────────────────────────────────────────────────────────────────
// Matches the roomType values the backend stores and returns.

export const ROOM_TYPES = {
  PUBLIC:  "public",
  PRIVATE: "private",
};

// ─── Room view identifiers ─────────────────────────────────────────────────────
// The `view` state string Chat.jsx uses when a room is active.

export const ROOM_VIEW = "room";

// ─── Avatar colour pool ────────────────────────────────────────────────────────
// Used by RoomInfoPanel to deterministically colour the room icon
// based on the room's name — separate from the user-avatar gradients
// in shared/constants/ui.js because rooms use a different, flatter palette.

export const ROOM_ICON_COLORS = [
  "#7c3aed",
  "#06b6d4",
  "#ec4899",
  "#059669",
  "#f59e0b",
];

/**
 * Returns a deterministic colour for a room based on its name.
 *
 * @param {string} roomName
 * @returns {string}  hex colour string
 */
export const getRoomIconColor = (roomName = "") =>
  ROOM_ICON_COLORS[(roomName || "").charCodeAt(0) % ROOM_ICON_COLORS.length];

// ─── Room gradient pool ────────────────────────────────────────────────────────
// Used by the sidebar room list to colour room tiles.
// Each entry pairs with the icon colours above.

export const ROOM_GRADIENTS = [
  ["#7c3aed", "#a855f7"],
  ["#06b6d4", "#7c3aed"],
  ["#ec4899", "#a855f7"],
  ["#059669", "#06b6d4"],
  ["#f59e0b", "#ec4899"],
];

/**
 * Returns a CSS gradient string for a room tile in the sidebar.
 *
 * @param {number} roomId
 * @returns {string}  CSS linear-gradient string
 */
export const getRoomGradient = (roomId) => {
  const [from, to] = ROOM_GRADIENTS[roomId % ROOM_GRADIENTS.length];
  return `linear-gradient(135deg,${from},${to})`;
};