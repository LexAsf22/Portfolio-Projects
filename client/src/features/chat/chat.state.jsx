// features/chat/chat.state.js
// React hook that owns all core chat state for Chat.jsx.
//
// Replaces the 10+ separate useState calls in Chat.jsx's state block that
// had no clear grouping.  Splitting them here makes the boundary between
// "chat" and "UI shell" state obvious.

import { useState } from "react";

/**
 * @typedef {object} ChatState
 * @property {string}   message          Current input draft
 * @property {object[]} messages         Channel messages
 * @property {string}   view             "channel" | "dm" | "room" | "friends"
 * @property {string|null} activeDmUser  Currently open DM recipient
 * @property {object}   dmMessages       { [username]: message[] }
 * @property {number}   channelUnread    Unread badge for the channel
 * @property {object}   dmUnread         { [username]: number }
 * @property {object[]} onlineUsers      Usernames currently online
 * @property {string[]} typingUsers      Usernames currently typing
 * @property {object|null} editingMsg    Message being edited, or null
 * @property {string}   editText         Current edit draft
 * @property {object}   reactions        { [msgId]: RawReaction[] }
 */

/**
 * Hook that manages all core chat-related React state.
 *
 * @returns {[ChatState, object]}  [state, setters]
 */
export const useChatState = () => {
  const [message,       setMessage]       = useState("");
  const [messages,      setMessages]      = useState([]);
  const [view,          setView]          = useState("channel");
  const [activeDmUser,  setActiveDmUser]  = useState(null);
  const [dmMessages,    setDmMessages]    = useState({});
  const [channelUnread, setChannelUnread] = useState(0);
  const [dmUnread,      setDmUnread]      = useState({});
  const [onlineUsers,   setOnlineUsers]   = useState([]);
  const [typingUsers,   setTypingUsers]   = useState([]);
  const [editingMsg,    setEditingMsg]    = useState(null);
  const [editText,      setEditText]      = useState("");
  const [reactions,     setReactions]     = useState({});

  const state = {
    message, messages, view, activeDmUser, dmMessages,
    channelUnread, dmUnread, onlineUsers, typingUsers,
    editingMsg, editText, reactions,
  };

  const setters = {
    setMessage, setMessages, setView, setActiveDmUser, setDmMessages,
    setChannelUnread, setDmUnread, setOnlineUsers, setTypingUsers,
    setEditingMsg, setEditText, setReactions,
  };

  return [state, setters];
};