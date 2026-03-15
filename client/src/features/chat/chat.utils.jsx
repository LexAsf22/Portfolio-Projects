// features/chat/chat.utils.js
// Pure, side-effect-free helpers specific to the chat feature.
// No React, no API calls — safe to unit-test in isolation.

import { formatTimestamp } from "../../shared/utils/formatters";

// ─── Message normalisation ────────────────────────────────────────────────────

/**
 * Normalises a raw message object from the REST history endpoint into
 * the same shape used for real-time STOMP messages, adding a `time` string.
 *
 * Used by both channel history and DM history loaders so both code paths
 * produce identical message shapes.
 *
 * @param {object} rawMessage
 * @returns {object}
 */
export const normaliseMessage = (rawMessage) => ({
  ...rawMessage,
  time: formatTimestamp(rawMessage.timestamp),
});

// ─── Message search ───────────────────────────────────────────────────────────

/**
 * Searches a message list for all indices whose `content` field contains
 * the query string (case-insensitive).
 *
 * Returns an array of indices into the messages array, sorted ascending
 * (oldest first) — the search UI navigates from newest to oldest so the
 * caller reverses the active pointer direction.
 *
 * @param {object[]} messages
 * @param {string}   query
 * @returns {number[]}
 */
export const searchMessages = (messages, query) => {
  if (!query.trim()) return [];
  const lower = query.toLowerCase();
  return messages
    .map((m, i) => ({ i, m }))
    .filter(({ m }) => m.content?.toLowerCase().includes(lower))
    .map(({ i }) => i);
};

// ─── DM message deduplication ─────────────────────────────────────────────────

/**
 * Merges a new real-time DM message into an existing array, skipping it
 * if a message with the same `id` already exists.
 *
 * @param {object[]} existing
 * @param {object}   incoming
 * @returns {object[]}
 */
export const mergeDmMessage = (existing, incoming) => {
  if (incoming.id && existing.some(m => m.id === incoming.id)) return existing;
  return [...existing, incoming];
};

// ─── Active messages selector ─────────────────────────────────────────────────

/**
 * Returns the message array for the currently active view.
 * Centralises the three-way branch that was repeated in Chat.jsx.
 *
 * @param {object} params
 * @param {string}   params.view
 * @param {string|null} params.activeDmUser
 * @param {object|null} params.activeRoom
 * @param {object[]} params.messages       Channel messages
 * @param {object}   params.dmMessages     { [user]: message[] }
 * @param {object}   params.roomMessages   { [roomId]: message[] }
 * @returns {object[]}
 */
export const selectCurrentMessages = ({
  view, activeDmUser, activeRoom,
  messages, dmMessages, roomMessages,
}) => {
  if (view === "dm"   && activeDmUser) return dmMessages[activeDmUser]    || [];
  if (view === "room" && activeRoom)   return roomMessages[activeRoom.id] || [];
  return messages;
};