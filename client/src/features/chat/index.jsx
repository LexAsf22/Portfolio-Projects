// features/chat/index.js
// Public API of the chat feature module.
// Chat.jsx imports exclusively from here.

// ─── State hooks ─────────────────────────────────────────────────────────────
export { useChatState }  from "./chat.state";
export { useChatSearch } from "./chat.search";

// ─── STOMP subscription factories ────────────────────────────────────────────
export {
  makeChannelHandler,
  makeChannelNotifyHandler,
  makePresenceHandler,
  makeTypingHandler,
  makeEditHandler,
  makeDeleteHandler,
  makeDmHandler,
  makeDmEditHandler,
  makeDmDeleteHandler,
} from "./chat.handlers";

// ─── Action helpers ───────────────────────────────────────────────────────────
export {
  loadChannelHistory,
  openDm,
  sendMessage,
  handleInput,
  startEdit,
  cancelEdit,
  deleteMessage,
  markMessagesSeen,
  uploadAndPublish,
  startRecording,
  stopRecording,
} from "./chat.handlers";

// ─── Pure utils ───────────────────────────────────────────────────────────────
export {
  normaliseMessage,
  searchMessages,
  mergeDmMessage,
  selectCurrentMessages,
} from "./chat.utils";

// ─── Constants ───────────────────────────────────────────────────────────────
export {
  VIEWS,
  MSG_TYPES,
  TYPING_DEBOUNCE_MS,
  MAX_RECORD_SECS,
} from "./chat.constants";