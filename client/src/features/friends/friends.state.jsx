// features/friends/friends.state.js
// React hook that owns all friends-related state for Chat.jsx.
//
// Replaces four separate useState + localStorage.getItem calls that were
// scattered through Chat.jsx's state block.  The hook initialises each
// slice from localStorage on mount so the UI never starts empty.

import { useState } from "react";
import {
  loadFriends,
  loadFriendReqs,
  loadIncomingReqs,
  saveFriends,
  saveFriendReqs,
} from "./friends.utils";

/**
 * @typedef {object} FriendsState
 * @property {string[]} friends       Accepted friends
 * @property {string[]} friendReqs    Outgoing pending requests
 * @property {string[]} incomingReqs  Incoming pending requests (derived from localStorage)
 */

/**
 * @typedef {object} FriendsActions
 * @property {(list: string[]) => void} setFriends
 * @property {(list: string[]) => void} setFriendReqs
 * @property {(authUser: string) => string[]} getIncomingReqs  Re-reads from localStorage
 */

/**
 * Hook that manages all friend-list React state and keeps it in sync
 * with localStorage automatically.
 *
 * @param {string} authUser  The logged-in user's username
 * @returns {[FriendsState, FriendsActions]}
 */
export const useFriendsState = (authUser) => {
  const [friends,    setFriendsRaw]    = useState(() => loadFriends(authUser));
  const [friendReqs, setFriendReqsRaw] = useState(() => loadFriendReqs(authUser));

  // incomingReqs is derived — re-read from localStorage rather than held in
  // React state because it is written by other "users" (simulated via ls keys).
  const incomingReqs = loadIncomingReqs(authUser);

  // Wrappers that keep React state and localStorage in sync atomically.
  const setFriends = (list) => {
    saveFriends(authUser, list);
    setFriendsRaw(list);
  };

  const setFriendReqs = (list) => {
    saveFriendReqs(authUser, list);
    setFriendReqsRaw(list);
  };

  const state   = { friends, friendReqs, incomingReqs };
  const actions = { setFriends, setFriendReqs };

  return [state, actions];
};