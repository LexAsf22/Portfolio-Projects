// features/room/room.handlers.js
// Factory functions that build the STOMP subscription callbacks used in
// Chat.jsx's connect() function for room-related topics, plus the
// action helpers for openRoom and createRoom.
//
// Keeps Chat.jsx's connect() block thin — each subscription becomes a
// one-liner that delegates here.

import { TOPICS }             from "../../shared/constants/api";
import { fetchRooms,
         createRoom  as apiCreateRoom,
         fetchRoomHistory }   from "../../shared/services/apiService";
import { getTime }            from "../../shared/utils/formatters";
import { normaliseRoomMessage,
         mergeRoomMessage }   from "./room.utils";

// ─── STOMP subscription factories ────────────────────────────────────────────

/**
 * Builds the handler for /topic/room.notify.
 * Increments the unread badge for any room that is not currently active.
 *
 * @param {string}   localName       The logged-in user's username
 * @param {Function} getActiveRoom   Returns the current activeRoom value
 * @param {Function} setRoomUnread   setState for roomUnread map
 * @returns {(msg: StompMessage) => void}
 */
export const makeRoomNotifyHandler = (localName, getActiveRoom, setRoomUnread) => (msg) => {
  const event = JSON.parse(msg.body);
  if (event.sender === localName) return;               // own message — no badge
  const currentRoom = getActiveRoom();
  if (!currentRoom || currentRoom.id !== event.roomId) {
    setRoomUnread(prev => ({
      ...prev,
      [event.roomId]: (prev[event.roomId] || 0) + 1,
    }));
  }
};

/**
 * Builds the per-room real-time message handler.
 * Subscribes to /topic/room.<roomId> and appends deduplicated messages
 * to the roomMessages state slice for that room.
 *
 * @param {number|string} roomId
 * @param {Function}      setRoomMessages   setState for roomMessages map
 * @returns {(msg: StompMessage) => void}
 */
export const makeRoomMessageHandler = (roomId, setRoomMessages) => (msg) => {
  const incoming = JSON.parse(msg.body);
  setRoomMessages(prev => {
    const existing = prev[roomId] || [];
    const merged   = mergeRoomMessage(existing, { ...incoming, time: getTime() });
    // mergeRoomMessage returns the same reference if nothing changed
    if (merged === existing) return prev;
    return { ...prev, [roomId]: merged };
  });
};

// ─── Room action helpers ───────────────────────────────────────────────────────

/**
 * Opens a room:
 *  1. Updates active room + view state
 *  2. Clears the unread badge for this room
 *  3. Subscribes to the room's real-time STOMP topic (once, guarded by roomSubRef)
 *  4. Fetches the message history from REST
 *
 * @param {object} options
 * @param {object}  options.room
 * @param {object}  options.stompClient       React ref
 * @param {object}  options.roomSubRef        React ref — { [roomId]: subscription }
 * @param {string}  options.authToken
 * @param {Function} options.setActiveRoom
 * @param {Function} options.setView
 * @param {Function} options.setMessage
 * @param {Function} options.setShowRoomInfo
 * @param {Function} options.setRoomUnread
 * @param {Function} options.setRoomMessages
 */
export const openRoom = ({
  room,
  stompClient,
  roomSubRef,
  authToken,
  setActiveRoom,
  setView,
  setMessage,
  setShowRoomInfo,
  setRoomUnread,
  setRoomMessages,
}) => {
  setActiveRoom(room);
  setView("room");
  setMessage("");
  setShowRoomInfo(false);
  setRoomUnread(prev => ({ ...prev, [room.id]: 0 }));

  // Subscribe to live messages for this room (only once per session)
  if (stompClient.current?.connected && !roomSubRef.current[room.id]) {
    roomSubRef.current[room.id] = stompClient.current.subscribe(
      TOPICS.room(room.id),
      makeRoomMessageHandler(room.id, setRoomMessages)
    );
  }

  // Fetch REST history
  fetchRoomHistory(authToken, room.id)
    .then(data =>
      setRoomMessages(prev => ({
        ...prev,
        [room.id]: data.map(normaliseRoomMessage),
      }))
    )
    .catch(() => {});
};

/**
 * Creates a new room via the API, adds it to the rooms list, closes the
 * CreateRoomModal, and immediately opens the new room.
 *
 * @param {object} options
 * @param {object}   options.roomData     Payload from CreateRoomModal's onCreate()
 * @param {string}   options.createdBy    The logged-in user's username
 * @param {string}   options.authToken
 * @param {Function} options.setRooms
 * @param {Function} options.openRoomFn   The openRoom action (bound version)
 * @param {Function} options.onModalClose Called to close CreateRoomModal
 */
export const createRoom = async ({
  roomData,
  createdBy,
  authToken,
  setRooms,
  openRoomFn,
  onModalClose,
}) => {
  const payload = {
    name:        typeof roomData === "object" ? roomData.name     : roomData,
    description: typeof roomData === "object" ? roomData.template : "",
    emoji:       typeof roomData === "object" ? roomData.emoji    : "🌟",
    roomType:    typeof roomData === "object" ? roomData.type     : "public",
    createdBy,
  };

  try {
    const room = await apiCreateRoom(authToken, payload);
    if (room.id) {
      setRooms(prev => [...prev, room]);
      onModalClose();
      openRoomFn(room);
    }
  } catch { /* ignore — server error, room was not created */ }
};

/**
 * Loads the full rooms list from the API on boot.
 *
 * @param {string}   authToken
 * @param {Function} setRooms
 */
export const loadRooms = (authToken, setRooms) =>
  fetchRooms(authToken).then(setRooms).catch(() => {});