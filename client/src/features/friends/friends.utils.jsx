// features/friends/friends.utils.js
// Pure, side-effect-free helpers specific to the friends feature.
// No React, no API calls — safe to unit-test in isolation.

import { lsGet, lsSet } from "../../shared/utils/storage";
import { LS_KEYS }      from "../../shared/constants/ui";

// ─── Persistent friend list helpers ──────────────────────────────────────────

/**
 * Reads the local user's friend list from localStorage.
 *
 * @param {string} authUser
 * @returns {string[]}
 */
export const loadFriends = (authUser) =>
  lsGet(LS_KEYS.friends(authUser), []);

/**
 * Reads the outgoing friend request list from localStorage.
 * These are users that the local user has sent requests to but who
 * have not yet accepted.
 *
 * @param {string} authUser
 * @returns {string[]}
 */
export const loadFriendReqs = (authUser) =>
  lsGet(LS_KEYS.friendReqs(authUser), []);

/**
 * Reads incoming friend requests for the local user.
 * These are stored under the key `friendreqs_out_<authUser>` because
 * a sender writes their own name into the recipient's "out" bucket.
 *
 * @param {string} authUser
 * @returns {string[]}
 */
export const loadIncomingReqs = (authUser) =>
  lsGet(LS_KEYS.friendReqsOut(authUser), []);

/**
 * Persists an updated friend list to localStorage.
 *
 * @param {string}   authUser
 * @param {string[]} list
 */
export const saveFriends = (authUser, list) =>
  lsSet(LS_KEYS.friends(authUser), list);

/**
 * Persists an updated outgoing request list to localStorage.
 *
 * @param {string}   authUser
 * @param {string[]} list
 */
export const saveFriendReqs = (authUser, list) =>
  lsSet(LS_KEYS.friendReqs(authUser), list);

/**
 * Persists an updated incoming request list to localStorage.
 *
 * @param {string}   authUser
 * @param {string[]} list
 */
export const saveIncomingReqs = (authUser, list) =>
  lsSet(LS_KEYS.friendReqsOut(authUser), list);

// ─── Relationship query helpers ───────────────────────────────────────────────

/**
 * Returns true if `targetUser` is in the local user's friend list.
 *
 * @param {string[]} friends
 * @param {string}   targetUser
 * @returns {boolean}
 */
export const isFriend = (friends, targetUser) =>
  friends.includes(targetUser);

/**
 * Returns true if the local user has already sent a friend request to
 * `targetUser` and it is still pending.
 *
 * @param {string[]} friendReqs  Outgoing requests
 * @param {string}   targetUser
 * @returns {boolean}
 */
export const hasSentRequest = (friendReqs, targetUser) =>
  friendReqs.includes(targetUser);