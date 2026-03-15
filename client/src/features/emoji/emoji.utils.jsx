// features/emoji/emoji.utils.js
// Pure, side-effect-free helpers that are specific to the emoji feature.
// No React, no API calls — safe to unit-test in isolation.
//
// groupReactions() lives in shared/utils/reactions.js because it is used
// by every message-rendering view (channel, DM, room).  The functions here
// are narrower: they are only relevant to how the emoji UI presents data.

import { groupReactions } from "../../shared/utils/reactions";
import { MAX_VISIBLE_REACTIONS } from "./emoji.constants";

// ─── Reaction helpers ─────────────────────────────────────────────────────────

/**
 * Given the raw reaction list for a message and the local username,
 * returns an object with everything the ReactionChips component needs:
 *  - `visible`  grouped reactions to display (capped at MAX_VISIBLE_REACTIONS)
 *  - `overflow` count of hidden reactions (0 if all fit)
 *  - `hasReacted` whether the local user has reacted at all
 *
 * @param {Array}  rawReactions   reactions[msgId] from Chat state
 * @param {string} localUsername
 * @returns {{ visible: GroupedReaction[], overflow: number, hasReacted: boolean }}
 */
export const buildReactionDisplay = (rawReactions = [], localUsername = "") => {
  const grouped  = groupReactions(rawReactions);
  const overflow = Math.max(0, grouped.length - MAX_VISIBLE_REACTIONS);
  const visible  = grouped.slice(0, MAX_VISIBLE_REACTIONS);
  const hasReacted = grouped.some(r => r.users.includes(localUsername));
  return { visible, overflow, hasReacted };
};

/**
 * Returns true if the local user has already reacted to a message with
 * a specific emoji.  Used to determine the "mine" chip highlight style.
 *
 * @param {GroupedReaction} groupedReaction
 * @param {string}          localUsername
 * @returns {boolean}
 */
export const isOwnReaction = (groupedReaction, localUsername) =>
  groupedReaction.users.includes(localUsername);

/**
 * Builds the tooltip string for a reaction chip showing who reacted.
 * Shows up to 3 names and abbreviates the rest with "and N others".
 *
 * @param {GroupedReaction} groupedReaction
 * @returns {string}  e.g. "alice, bob and 3 others"
 */
export const reactionTooltip = ({ users }) => {
  if (users.length <= 3) return users.join(", ");
  const shown  = users.slice(0, 3).join(", ");
  const others = users.length - 3;
  return `${shown} and ${others} other${others > 1 ? "s" : ""}`;
};

// ─── Emoji insertion ──────────────────────────────────────────────────────────

/**
 * Inserts an emoji string at the end of the current message draft.
 * Returns the new message string — the caller is responsible for calling
 * setMessage() with the result.
 *
 * Kept here (not inlined in Chat.jsx) so it can be reused by any
 * component that has a message input (channel, DM, room).
 *
 * @param {string} currentMessage  Current value of the message input
 * @param {string} emoji           Emoji character(s) to append
 * @returns {string}               Updated message string
 */
export const insertEmoji = (currentMessage, emoji) =>
  currentMessage + emoji;