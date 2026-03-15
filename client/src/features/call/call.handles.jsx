// features/call/call.handlers.js
// Factory functions that build the STOMP subscription callbacks used in
// Chat.jsx's connect() function for call-related topics.
//
// Why a separate file?
//  • connect() was growing a deeply nested wall of callbacks.
//  • These handlers have no UI concern — they only update React state
//    and delegate to stompService.
//  • Extracted here they are readable, individually testable, and
//    reusable if a second component ever needs to subscribe to call events.
//
// Each factory receives the minimum state-setter(s) it needs and returns
// the raw callback that gets passed to client.subscribe().

import { NOTIFY_TYPES }    from "./call.constants";
import { publishCallNotify } from "../../shared/services/stompService";

// ─── /topic/call-notify ───────────────────────────────────────────────────────

/**
 * Handles inbound call notifications (RING events from a caller).
 * Ignores events we sent ourselves.
 *
 * @param {React.MutableRefObject} nameRef   ref to the local username
 * @param {Function} setIncoming             setState for incomingCall
 * @returns {(msg: StompMessage) => void}
 */
export const makeCallNotifyHandler = (nameRef, setIncoming) => (msg) => {
  const sig = JSON.parse(msg.body);
  if (sig.type === NOTIFY_TYPES.RING && sig.sender !== nameRef.current) {
    setIncoming({ from: sig.sender, mode: sig.mode });
  }
};

// ─── /topic/call-presence ─────────────────────────────────────────────────────

/**
 * Handles call-presence join/leave events, maintaining the list of
 * usernames currently in each voice channel.
 *
 * @param {Function} setCallPresence   setState for callPresence map
 * @returns {(msg: StompMessage) => void}
 */
export const makeCallPresenceHandler = (setCallPresence) => (msg) => {
  const event = JSON.parse(msg.body);
  if (event.type === "JOIN") {
    setCallPresence(prev => ({
      ...prev,
      [event.callRoom]: [
        ...(prev[event.callRoom] || []).filter(u => u !== event.sender),
        event.sender,
      ],
    }));
  } else if (event.type === "LEAVE") {
    setCallPresence(prev => ({
      ...prev,
      [event.callRoom]: (prev[event.callRoom] || []).filter(u => u !== event.sender),
    }));
  }
};

// ─── Call action helpers (used by Chat.jsx event handlers) ────────────────────

/**
 * Joins the voice channel silently (Discord-style — no ring).
 * Updates caller state and publishes a JOIN notification.
 *
 * @param {React.MutableRefObject} stompClient
 * @param {React.MutableRefObject} nameRef
 * @param {Function} setIsCaller
 * @param {Function} setCallMode
 * @param {string}   callRoom
 */
export const joinVoiceChannel = (stompClient, nameRef, setIsCaller, setCallMode, callRoom) => {
  publishCallNotify(stompClient, {
    sender:   nameRef.current,
    type:     NOTIFY_TYPES.JOIN,
    mode:     "voice",
    callRoom,
  });
  setIsCaller(true);
  setCallMode("voice");
};

/**
 * Starts a video (or voice) call with a ring notification.
 *
 * @param {React.MutableRefObject} stompClient
 * @param {React.MutableRefObject} nameRef
 * @param {"voice"|"video"}        mode
 * @param {Function}               setIsCaller
 * @param {Function}               setCallMode
 * @param {string}                 callRoom
 */
export const startCall = (stompClient, nameRef, mode, setIsCaller, setCallMode, callRoom) => {
  publishCallNotify(stompClient, {
    sender:   nameRef.current,
    type:     NOTIFY_TYPES.RING,
    mode,
    callRoom,
  });
  setIsCaller(true);
  setCallMode(mode);
};

/**
 * Ends the active call:
 *  1. Stops local media tracks
 *  2. Publishes a LEAVE notification
 *  3. Optionally posts a "call ended" system message to the channel
 *  4. Resets all call state
 *
 * @param {object} options
 */
export const endCall = ({
  stompClient,
  nameRef,
  localStreamRef,
  callRoom,
  secs,
  name,
  setCallKey,
  setCallMode,
  setIsCaller,
  setCallPresence,
  publishChannelMessage,
}) => {
  // Stop camera / mic
  localStreamRef.current?.getTracks().forEach(t => t.stop());
  localStreamRef.current = null;

  // Notify others
  publishCallNotify(stompClient, {
    sender:   nameRef.current,
    type:     NOTIFY_TYPES.LEAVE,
    callRoom,
  });

  // Post duration message to channel
  if (secs > 0) {
    publishChannelMessage(stompClient, {
      sender:       nameRef.current,
      content:      `Call ended — ${Math.floor(secs / 60)}m ${secs % 60}s`,
      type:         "CALL",
      callDuration: secs,
    });
  }

  // Reset state
  setCallKey(k => k + 1);
  setCallMode(null);
  setIsCaller(false);
  setCallPresence(prev => ({
    ...prev,
    [callRoom]: (prev[callRoom] || []).filter(u => u !== name),
  }));
};

/**
 * Accepts an incoming call.
 *
 * @param {object} incomingCall   { from, mode }
 * @param {Function} setCallKey
 * @param {Function} setIsCaller
 * @param {Function} setCallMode
 * @param {Function} setIncoming
 */
export const acceptCall = (incomingCall, setCallKey, setIsCaller, setCallMode, setIncoming) => {
  setCallKey(k => k + 1);
  setIsCaller(false);
  setCallMode(incomingCall?.mode || "voice");
  setIncoming(null);
};

/**
 * Rejects an incoming call.
 *
 * @param {Function} setIncoming
 */
export const rejectCall = (setIncoming) => setIncoming(null);