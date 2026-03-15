// features/call/call.constants.js
// All magic values that are only meaningful inside the call feature.
// ICE_CONFIG lives in shared/constants/webrtc.js because it's pure
// infrastructure config. Everything here is call-flow logic.

// The only call room name used in this app.
// Referenced by every signal payload so it lives as a constant.
export const CALL_ROOM = "channel1";

// How long (ms) to wait after an ICE "disconnected" event before
// treating the peer as truly gone and tearing down the connection.
export const PEER_DISCONNECT_TIMEOUT_MS = 8000;

// Maximum voice recording length before auto-stop (seconds).
export const MAX_RECORD_SECS = 60;

// Signal type strings exchanged over STOMP /topic/call-signal
export const SIGNAL_TYPES = {
  OFFER:      "OFFER",
  ANSWER:     "ANSWER",
  ICE:        "ICE",
  PEER_JOIN:  "PEER_JOIN",
  PEER_LEAVE: "PEER_LEAVE",
  END:        "END",
};

// Notification type strings exchanged over STOMP /topic/call-notify
export const NOTIFY_TYPES = {
  RING:  "RING",
  JOIN:  "JOIN",
  LEAVE: "LEAVE",
};

// Call modes
export const CALL_MODES = {
  VOICE: "voice",
  VIDEO: "video",
};