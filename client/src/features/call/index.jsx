// features/call/index.js
// Public API of the call feature module.
// Chat.jsx imports exclusively from here — never from internal files directly.

export { default as CallOverlay }       from "./CallOverlay";
export { default as IncomingCallBanner } from "./IncomingCallBanner";

export {
  makeCallNotifyHandler,
  makeCallPresenceHandler,
  joinVoiceChannel,
  startCall,
  endCall,
  acceptCall,
  rejectCall,
} from "./call.handlers";

export {
  CALL_ROOM,
  CALL_MODES,
  NOTIFY_TYPES,
  SIGNAL_TYPES,
  PEER_DISCONNECT_TIMEOUT_MS,
} from "./call.constants";