// shared/constants/api.js
// All server addresses and API-level configuration in one place.
// Change BASE_URL here and every fetch / WebSocket in the app updates.

export const BASE_URL = "http://192.168.108.132:8080";

export const WS_URL = `${BASE_URL}/ws`;

export const API_ROUTES = {
  // Auth
  history:        `${BASE_URL}/auth/history`,
  users:          `${BASE_URL}/auth/users`,
  profile:        (username) => `${BASE_URL}/auth/profile/${username}`,
  updateProfile:  `${BASE_URL}/auth/profile`,
  uploadAvatar:   `${BASE_URL}/auth/profile/avatar`,
  updateEmail:    `${BASE_URL}/auth/update-email`,
  changeUsername: `${BASE_URL}/auth/change-username`,
  changePassword: `${BASE_URL}/auth/change-password`,
  sendCode:       `${BASE_URL}/auth/send-code`,
  deleteAccount:  `${BASE_URL}/auth/delete-account`,

  // Upload
  upload: `${BASE_URL}/upload`,

  // Rooms
  rooms:        `${BASE_URL}/rooms`,
  room:         (id) => `${BASE_URL}/rooms/${id}`,
  roomHistory:  (id) => `${BASE_URL}/rooms/${id}/history`,

  // DMs
  dmHistory: (userA, userB) =>
    `${BASE_URL}/dm/history?userA=${userA}&userB=${userB}`,
};

// STOMP destination topics (subscribe)
export const TOPICS = {
  channel:       "/topic/channel1",
  callNotify:    "/topic/call-notify",
  callSignal:    "/topic/call-signal",
  callPresence:  "/topic/call-presence",
  presence:      "/topic/presence",
  typing:        "/topic/typing",
  channelNotify: "/topic/channel.notify",
  roomNotify:    "/topic/room.notify",
  reaction:      "/topic/reaction",
  edit:          "/topic/edit",
  delete:        "/topic/delete",
  dm:            (username) => `/topic/dm.${username}`,
  dmTyping:      (username) => `/topic/dm.typing.${username}`,
  dmEdit:        (username) => `/topic/dm.edit.${username}`,
  dmDelete:      (username) => `/topic/dm.delete.${username}`,
  room:          (roomId)   => `/topic/room.${roomId}`,
};

// STOMP destination endpoints (publish / send)
export const DESTINATIONS = {
  send:         "/app/send",
  dmSend:       "/app/dm.send",
  roomSend:     "/app/room.send",
  typing:       "/app/typing",
  callNotify:   "/app/call-notify",
  callSignal:   "/app/call-signal",
  react:        "/app/react",
  edit:         "/app/edit",
  delete:       "/app/delete",
  seen:         "/app/seen",
};