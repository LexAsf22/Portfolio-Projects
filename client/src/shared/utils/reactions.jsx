// shared/utils/reactions.js
// Reaction aggregation logic extracted from Chat.jsx's getReactions().
//
// Kept in shared/utils because:
//  • It is pure data transformation with no UI concern.
//  • It will be needed by every view that renders messages
//    (channel, DMs, rooms) once those are split into separate components.
//  • It is independently unit-testable.

/**
 * @typedef {Object} RawReaction
 * @property {string} emoji
 * @property {string} username
 */

/**
 * @typedef {Object} GroupedReaction
 * @property {string}   emoji
 * @property {number}   count
 * @property {string[]} users  — usernames who reacted with this emoji
 */

/**
 * Groups a flat list of reaction objects by emoji, summing counts and
 * collecting the list of users per emoji.
 *
 * Input (from the server / reactions state):
 *   [{ emoji: "❤️", username: "alice" }, { emoji: "❤️", username: "bob" }, ...]
 *
 * Output (ready to render as reaction chips):
 *   [{ emoji: "❤️", count: 2, users: ["alice", "bob"] }, ...]
 *
 * @param {RawReaction[]} reactions
 * @returns {GroupedReaction[]}
 */
export const groupReactions = (reactions = []) => {
  const map = {};
  reactions.forEach(({ emoji, username }) => {
    if (!map[emoji]) map[emoji] = { emoji, count: 0, users: [] };
    map[emoji].count++;
    map[emoji].users.push(username);
  });
  return Object.values(map);
};