// features/friends/friends.constants.js
// All magic values that are only meaningful inside the friends feature.

// ─── Friend request signal type ───────────────────────────────────────────────
// The STOMP message type published on /topic/channel1 to notify a user
// that someone sent them a friend request in real time.
// Intentionally kept here (not in shared/constants/api.js) because it is
// an application-layer protocol used only by the friends feature.

export const FRIEND_REQUEST_MSG_TYPE = "FRIEND_REQUEST";
export const FRIEND_REQUEST_CONTENT  = "__FRIEND_REQUEST__";

// ─── Tabs used by FriendsPage ─────────────────────────────────────────────────

export const FRIENDS_TABS = {
  ONLINE:  "online",
  ALL:     "all",
  FRIENDS: "friends",
  PENDING: "pending",
  ADD:     "add",
};

// ─── Tabs used by FriendsPanel (slide-in overlay) ────────────────────────────

export const FRIENDS_PANEL_TABS = {
  ALL:      "all",
  FRIENDS:  "friends",
  REQUESTS: "requests",
};