// features/room/room.utils.js
// Pure, side-effect-free helpers that are only relevant to the room feature.
// No React, no API calls — safe to unit-test in isolation.

import { formatTimestamp } from "../../shared/utils/formatters";

// ─── Message normalisation ────────────────────────────────────────────────────

/**
 * Normalises a raw room-message object from the REST history endpoint into
 * the same shape used for real-time STOMP messages.
 * Both paths now produce identical objects, so the renderer doesn't need
 * to branch on how the message arrived.
 *
 * @param {object} rawMessage  Raw message from fetchRoomHistory()
 * @returns {object}           Normalised message with a `time` string
 */
export const normaliseRoomMessage = (rawMessage) => ({
  ...rawMessage,
  time: formatTimestamp(rawMessage.timestamp),
});

// ─── Deduplication ────────────────────────────────────────────────────────────

/**
 * Merges a new real-time message into an existing room message array,
 * skipping it if a message with the same `id` already exists.
 * Prevents duplicates that can appear when both REST history and
 * the live STOMP subscription deliver the same message.
 *
 * @param {object[]} existing  Current messages for this room
 * @param {object}   incoming  New real-time message
 * @returns {object[]}         Updated array (same reference if no change)
 */
export const mergeRoomMessage = (existing, incoming) => {
  if (incoming.id && existing.some(m => m.id === incoming.id)) {
    return existing;
  }
  return [...existing, incoming];
};

// ─── Room lookup ──────────────────────────────────────────────────────────────

/**
 * Finds a room object in the rooms array by id.
 * Returns undefined if not found.
 *
 * @param {object[]} rooms
 * @param {number|string} roomId
 * @returns {object|undefined}
 */
export const findRoom = (rooms, roomId) =>
  rooms.find(r => r.id === roomId);

/**
 * Replaces a room in the rooms array with an updated version.
 * Returns a new array — does not mutate the original.
 *
 * @param {object[]} rooms
 * @param {object}   updated  Must have an `id` field
 * @returns {object[]}
 */
export const replaceRoom = (rooms, updated) =>
  rooms.map(r => r.id === updated.id ? updated : r);