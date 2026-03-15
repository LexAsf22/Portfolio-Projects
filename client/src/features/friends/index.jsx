// features/friends/index.js
// Public API of the friends feature module.
// Chat.jsx imports exclusively from here.

// ─── Components ───────────────────────────────────────────────────────────────
export { default as FriendsPage  } from "./FriendsPage";
export { default as FriendsPanel } from "./FriendsPanel";

// ─── State hook ───────────────────────────────────────────────────────────────
export { useFriendsState } from "./friends.state";

// ─── Handlers ────────────────────────────────────────────────────────────────
export {
  handleFriendRequestSignal,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
} from "./friends.handlers";

// ─── Constants ───────────────────────────────────────────────────────────────
export {
  FRIEND_REQUEST_MSG_TYPE,
  FRIEND_REQUEST_CONTENT,
  FRIENDS_TABS,
  FRIENDS_PANEL_TABS,
} from "./friends.constants";

// ─── Utils ───────────────────────────────────────────────────────────────────
export {
  loadFriends,
  loadFriendReqs,
  loadIncomingReqs,
  saveFriends,
  saveFriendReqs,
  saveIncomingReqs,
  isFriend,
  hasSentRequest,
} from "./friends.utils";