// features/room/room.state.js
// React hook that owns all room-related state for Chat.jsx.
//
// Why a hook?
//  • Chat.jsx had eight room-related useState calls scattered through
//    a 300-line state block — impossible to see them as a group.
//  • Extracting them here makes it obvious exactly what state the room
//    feature needs, and Chat.jsx's state block shrinks to one import.
//  • The hook is a plain useState wrapper — no side-effects, no subscriptions —
//    so it composes cleanly with Chat.jsx's existing useEffect calls.
//
// Usage in Chat.jsx:
//
//   const [roomState, roomSetters] = useRoomState();
//
//   roomState.rooms            // object[]
//   roomState.activeRoom       // object | null
//   roomState.roomMessages     // { [roomId]: message[] }
//   roomState.roomUnread       // { [roomId]: number }
//   roomState.showRoomInfo     // boolean
//
//   roomSetters.setRooms(...)
//   roomSetters.setActiveRoom(...)
//   etc.

import { useState } from "react";

/**
 * @typedef {object} RoomState
 * @property {object[]}                   rooms
 * @property {object|null}                activeRoom
 * @property {{ [roomId]: object[] }}     roomMessages
 * @property {{ [roomId]: number }}       roomUnread
 * @property {boolean}                    showRoomInfo
 */

/**
 * @typedef {object} RoomSetters
 * @property {Function} setRooms
 * @property {Function} setActiveRoom
 * @property {Function} setRoomMessages
 * @property {Function} setRoomUnread
 * @property {Function} setShowRoomInfo
 */

/**
 * Hook that manages all room-related React state.
 *
 * @returns {[RoomState, RoomSetters]}
 */
export const useRoomState = () => {
  const [rooms,        setRooms]        = useState([]);
  const [activeRoom,   setActiveRoom]   = useState(null);
  const [roomMessages, setRoomMessages] = useState({});   // { [roomId]: message[] }
  const [roomUnread,   setRoomUnread]   = useState({});   // { [roomId]: unreadCount }
  const [showRoomInfo, setShowRoomInfo] = useState(false);

  const state = {
    rooms,
    activeRoom,
    roomMessages,
    roomUnread,
    showRoomInfo,
  };

  const setters = {
    setRooms,
    setActiveRoom,
    setRoomMessages,
    setRoomUnread,
    setShowRoomInfo,
  };

  return [state, setters];
};