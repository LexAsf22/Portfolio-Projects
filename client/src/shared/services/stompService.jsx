// shared/services/stompService.js
// Thin wrappers around stompClient.current.publish().
//
// Why extract these?
//  • The raw publish pattern (`stompClient.current?.connected && publish(...)`)
//    was repeated inline across 15+ places in Chat.jsx.
//  • Each wrapper validates connection state, serialises the payload, and
//    targets the correct STOMP destination — so call-sites are one-liners.
//  • When the STOMP API changes (e.g. adding per-message metadata), there is
//    exactly one file to update.
//
// Usage:
//   import { publishMessage, publishTyping } from "shared/services/stompService";
//   publishMessage(stompClient, { sender, content });

import { DESTINATIONS } from "../constants/api";

// ─── Internal helper ──────────────────────────────────────────────────────────

/**
 * Publishes a JSON payload to a STOMP destination if the client is connected.
 *
 * @param {React.MutableRefObject} clientRef  stompClient ref from Chat.jsx
 * @param {string}                 destination
 * @param {object}                 payload
 */
const publish = (clientRef, destination, payload) => {
  if (clientRef?.current?.connected) {
    clientRef.current.publish({
      destination,
      body: JSON.stringify(payload),
    });
  }
};

// ─── Channel messages ─────────────────────────────────────────────────────────

export const publishChannelMessage = (clientRef, { sender, content }) =>
  publish(clientRef, DESTINATIONS.send, { sender, content });

// ─── Direct messages ──────────────────────────────────────────────────────────

export const publishDmMessage = (clientRef, { sender, recipient, content, type = "TEXT", fileUrl }) =>
  publish(clientRef, DESTINATIONS.dmSend, { sender, recipient, content, type, fileUrl });

// ─── Room messages ────────────────────────────────────────────────────────────

export const publishRoomMessage = (clientRef, { roomId, sender, content, type = "TEXT", fileUrl }) =>
  publish(clientRef, DESTINATIONS.roomSend, { roomId, sender, content, type, fileUrl });

// ─── File / media messages ────────────────────────────────────────────────────

/**
 * Publishes a file/media message to whichever destination is currently active
 * (channel, DM, or room).
 *
 * @param {React.MutableRefObject} clientRef
 * @param {"channel"|"dm"|"room"} view
 * @param {object} context   { sender, activeDmUser, activeRoomId }
 * @param {object} fileData  { content, type, fileUrl }
 */
export const publishFileMessage = (clientRef, view, context, fileData) => {
  const { sender, activeDmUser, activeRoomId } = context;
  const payload = { sender, ...fileData };

  if (view === "dm" && activeDmUser) {
    publish(clientRef, DESTINATIONS.dmSend, { ...payload, recipient: activeDmUser });
  } else if (view === "room" && activeRoomId) {
    publish(clientRef, DESTINATIONS.roomSend, { ...payload, roomId: activeRoomId });
  } else {
    publish(clientRef, DESTINATIONS.send, payload);
  }
};

// ─── Typing indicators ────────────────────────────────────────────────────────

export const publishTyping = (clientRef, sender, typing) =>
  publish(clientRef, DESTINATIONS.typing, { sender, typing });

// ─── Reactions ────────────────────────────────────────────────────────────────

export const publishReaction = (clientRef, { messageId, username, emoji }) =>
  publish(clientRef, DESTINATIONS.react, { messageId, username, emoji });

// ─── Edit / Delete ────────────────────────────────────────────────────────────

export const publishEdit = (clientRef, { messageId, newContent, editor }) =>
  publish(clientRef, DESTINATIONS.edit, { messageId, newContent, editor });

export const publishDelete = (clientRef, { messageId, deletedBy }) =>
  publish(clientRef, DESTINATIONS.delete, { messageId, deletedBy });

// ─── Seen receipts ────────────────────────────────────────────────────────────

export const publishSeen = (clientRef, { messageId, username }) =>
  publish(clientRef, DESTINATIONS.seen, { messageId, username });

// ─── Call signalling ──────────────────────────────────────────────────────────

export const publishCallNotify = (clientRef, payload) =>
  publish(clientRef, DESTINATIONS.callNotify, payload);

export const publishCallSignal = (clientRef, payload) =>
  publish(clientRef, DESTINATIONS.callSignal, payload);