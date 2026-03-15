// features/friends/friends.handlers.js
// Action helpers and STOMP signal handler for the friends feature.
//
// All functions follow the same factory / action pattern established in
// call.handlers.js and room.handlers.js so the codebase stays consistent.

import { publishChannelMessage }  from "../../shared/services/stompService";
import { lsGet, lsSet }           from "../../shared/utils/storage";
import { LS_KEYS }                from "../../shared/constants/ui";
import {
  FRIEND_REQUEST_MSG_TYPE,
  FRIEND_REQUEST_CONTENT,
}                                 from "./friends.constants";
import {
  loadIncomingReqs,
  saveIncomingReqs,
  isFriend,
  hasSentRequest,
}                                 from "./friends.utils";

// ─── STOMP subscription factory ───────────────────────────────────────────────

/**
 * Handles incoming FRIEND_REQUEST messages on /topic/channel1.
 * When a request arrives for the local user, adds the sender to the
 * incoming-requests localStorage bucket and forces a re-render by
 * touching the friends state.
 *
 * Returns early (no-op) for all other message types — this is called
 * inside the main channel subscription handler.
 *
 * @param {string}   localName     The logged-in user's username
 * @param {Function} setFriends    forces a re-render (touches friends array)
 * @returns {(msg: object) => boolean}  true if the message was consumed
 */
export const handleFriendRequestSignal = (localName, setFriends) => (msg) => {
  if (msg.type !== FRIEND_REQUEST_MSG_TYPE) return false;

  if (msg.recipient === localName) {
    const existing = loadIncomingReqs(localName);
    if (!existing.includes(msg.sender)) {
      saveIncomingReqs(localName, [...existing, msg.sender]);
      // Touch friends state to trigger re-render of the badge counter
      setFriends(f => [...f]);
    }
  }
  return true; // consumed — caller should not render this in the chat
};

// ─── Friend action helpers ────────────────────────────────────────────────────

/**
 * Sends a friend request to `targetUser`.
 *  1. Guards against duplicate / existing friend requests.
 *  2. Writes the local user's name into the target's "incoming" localStorage bucket.
 *  3. Appends target to the local user's outgoing request list.
 *  4. Publishes a real-time FRIEND_REQUEST signal over STOMP.
 *
 * @param {object} options
 * @param {string}   options.localName
 * @param {string}   options.authUser
 * @param {string}   options.targetUser
 * @param {string[]} options.friends
 * @param {string[]} options.friendReqs
 * @param {Function} options.setFriendReqs
 * @param {React.MutableRefObject} options.stompClient
 */
export const sendFriendRequest = ({
  localName,
  authUser,
  targetUser,
  friends,
  friendReqs,
  setFriendReqs,
  stompClient,
}) => {
  if (isFriend(friends, targetUser) || hasSentRequest(friendReqs, targetUser)) return;

  // Write our name into the target's incoming bucket
  const existing = lsGet(LS_KEYS.friendReqsOut(targetUser), []);
  if (!existing.includes(authUser)) {
    lsSet(LS_KEYS.friendReqsOut(targetUser), [...existing, authUser]);
  }

  // Update our own outgoing list
  setFriendReqs([...friendReqs, targetUser]);

  // Notify the target in real time
  publishChannelMessage(stompClient, {
    sender:    localName,
    content:   FRIEND_REQUEST_CONTENT,
    type:      FRIEND_REQUEST_MSG_TYPE,
    recipient: targetUser,
  });
};

/**
 * Accepts an incoming friend request from `fromUser`.
 *  1. Adds them to the local friend list.
 *  2. Removes them from the local incoming-request bucket.
 *
 * @param {object} options
 * @param {string}   options.authUser
 * @param {string}   options.fromUser
 * @param {string[]} options.friends
 * @param {Function} options.setFriends
 */
export const acceptFriendRequest = ({ authUser, fromUser, friends, setFriends }) => {
  setFriends([...friends, fromUser]);

  // Remove from incoming bucket
  const incoming = loadIncomingReqs(authUser);
  saveIncomingReqs(authUser, incoming.filter(u => u !== fromUser));
};

/**
 * Removes a friend (or declines an incoming request) for `targetUser`.
 *
 * @param {object} options
 * @param {string[]} options.friends
 * @param {Function} options.setFriends
 * @param {string}   options.targetUser
 */
export const removeFriend = ({ friends, setFriends, targetUser }) => {
  setFriends(friends.filter(u => u !== targetUser));
};