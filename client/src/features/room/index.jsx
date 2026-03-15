// features/room/index.js
// Public API of the room feature module.
// Chat.jsx imports exclusively from here — never from internal files directly.

// ─── Component ────────────────────────────────────────────────────────────────
export { default as RoomInfoPanel } from "./RoomInfoPanel";

// ─── State hook ───────────────────────────────────────────────────────────────
export { useRoomState } from "./room.state";

// ─── Action handlers ──────────────────────────────────────────────────────────
export {
  makeRoomNotifyHandler,
  makeRoomMessageHandler,
  openRoom,
  createRoom,
  loadRooms,
} from "./room.handlers";

// ─── Constants ────────────────────────────────────────────────────────────────
export {
  ROOM_TYPES,
  ROOM_VIEW,
  ROOM_ICON_COLORS,
  ROOM_GRADIENTS,
  getRoomIconColor,
  getRoomGradient,
} from "./room.constants";

// ─── Utils ────────────────────────────────────────────────────────────────────
export {
  normaliseRoomMessage,
  mergeRoomMessage,
  findRoom,
  replaceRoom,
} from "./room.utils";