// features/chat/chat.handlers.js
// STOMP subscription factories and action helpers for all chat-related topics.
//
// Covers: channel messages, DMs (messages + typing + edit + delete),
// presence, typing, channel unread, seen receipts, edit/delete broadcast,
// voice recording, file upload, and the openDm action.

import { TOPICS }              from "../../shared/constants/api";
import {
  fetchChannelHistory,
  fetchDmHistory,
  uploadFile as apiUploadFile,
}                              from "../../shared/services/apiService";
import {
  publishDmMessage,
  publishRoomMessage,
  publishChannelMessage,
  publishFileMessage,
  publishTyping,
  publishEdit,
  publishDelete,
  publishSeen,
}                              from "../../shared/services/stompService";
import { resolveUrl, getTime } from "../../shared/utils/formatters";
import { TYPING_DEBOUNCE_MS, MAX_RECORD_SECS, MSG_TYPES } from "./chat.constants";
import { normaliseMessage, mergeDmMessage }               from "./chat.utils";
import { FRIEND_REQUEST_MSG_TYPE }                        from "../friends/friends.constants";
import { handleFriendRequestSignal }                      from "../friends/friends.handlers";

// ─── Channel subscription ─────────────────────────────────────────────────────

/**
 * Builds the handler for /topic/channel1.
 * Filters out FRIEND_REQUEST signals (delegates to friends feature),
 * then appends the message to the channel list.
 *
 * @param {Function} setMessages
 * @param {Function} setFriends   needed to trigger friend-request badge re-render
 * @param {string}   localName
 * @returns {(msg: StompMessage) => void}
 */
export const makeChannelHandler = (setMessages, setFriends, localName) => (msg) => {
  const parsed = JSON.parse(msg.body);
  // Delegate friend-request signals to the friends feature handler
  if (handleFriendRequestSignal(localName, setFriends)(parsed)) return;
  setMessages(prev => [...prev, { ...parsed, time: getTime() }]);
};

// ─── Channel unread ───────────────────────────────────────────────────────────

/**
 * Builds the handler for /topic/channel.notify.
 * Increments the channel unread badge only when the user is not on the channel view.
 *
 * @param {Function} getView          Returns the current view string
 * @param {Function} setChannelUnread
 * @returns {(msg: StompMessage) => void}
 */
export const makeChannelNotifyHandler = (getView, setChannelUnread) => () => {
  if (getView() !== "channel") setChannelUnread(prev => prev + 1);
};

// ─── Presence ─────────────────────────────────────────────────────────────────

/**
 * Builds the handler for /topic/presence.
 *
 * @param {Function} setOnlineUsers
 * @returns {(msg: StompMessage) => void}
 */
export const makePresenceHandler = (setOnlineUsers) => (msg) => {
  const event = JSON.parse(msg.body);
  setOnlineUsers(Array.from(event.onlineUsers || []));
};

// ─── Typing indicators ────────────────────────────────────────────────────────

/**
 * Builds the handler for /topic/typing (channel) and /topic/dm.typing.<user> (DMs).
 *
 * @param {string}   localName
 * @param {Function} setTypingUsers
 * @returns {(msg: StompMessage) => void}
 */
export const makeTypingHandler = (localName, setTypingUsers) => (msg) => {
  const event = JSON.parse(msg.body);
  if (event.sender === localName) return;
  setTypingUsers(prev =>
    event.typing
      ? prev.includes(event.sender) ? prev : [...prev, event.sender]
      : prev.filter(u => u !== event.sender)
  );
};

// ─── Edit / Delete broadcasts ─────────────────────────────────────────────────

/**
 * Builds the handler for /topic/edit.
 *
 * @param {Function} setMessages
 * @returns {(msg: StompMessage) => void}
 */
export const makeEditHandler = (setMessages) => (msg) => {
  const event = JSON.parse(msg.body);
  setMessages(prev =>
    prev.map(m =>
      m.id === event.messageId ? { ...m, content: event.newContent, edited: true } : m
    )
  );
};

/**
 * Builds the handler for /topic/delete.
 *
 * @param {Function} setMessages
 * @returns {(msg: StompMessage) => void}
 */
export const makeDeleteHandler = (setMessages) => (msg) => {
  const event = JSON.parse(msg.body);
  setMessages(prev =>
    prev.map(m =>
      m.id === event.messageId
        ? { ...m, content: "This message was deleted.", deleted: true }
        : m
    )
  );
};

// ─── DM subscriptions ────────────────────────────────────────────────────────

/**
 * Builds the handler for /topic/dm.<localName>.
 * Deduplicates by id and increments the DM unread badge for messages
 * from other users.  Also fires a desktop notification if permission granted.
 *
 * @param {string}   localName
 * @param {Function} setDmMessages
 * @param {Function} setDmUnread
 * @returns {(msg: StompMessage) => void}
 */
export const makeDmHandler = (localName, setDmMessages, setDmUnread) => (msg) => {
  const parsed = JSON.parse(msg.body);
  const other  = parsed.sender === localName ? parsed.recipient : parsed.sender;

  setDmMessages(prev => {
    const existing = prev[other] || [];
    const merged   = mergeDmMessage(existing, { ...parsed, time: getTime() });
    if (merged === existing) return prev;
    return { ...prev, [other]: merged };
  });

  if (parsed.sender !== localName) {
    setDmUnread(prev => ({ ...prev, [parsed.sender]: (prev[parsed.sender] || 0) + 1 }));
    if (Notification.permission === "granted") {
      new Notification(`New message from ${parsed.sender}`, {
        body: parsed.content || "📎 Attachment",
      });
    }
  }
};

/**
 * Builds the handler for /topic/dm.edit.<localName>.
 *
 * @param {string}   localName
 * @param {Function} setDmMessages
 * @returns {(msg: StompMessage) => void}
 */
export const makeDmEditHandler = (localName, setDmMessages) => (msg) => {
  const dm    = JSON.parse(msg.body);
  const other = dm.sender === localName ? dm.recipient : dm.sender;
  setDmMessages(prev => ({
    ...prev,
    [other]: (prev[other] || []).map(m =>
      m.id === dm.id ? { ...m, content: dm.content, edited: true } : m
    ),
  }));
};

/**
 * Builds the handler for /topic/dm.delete.<localName>.
 *
 * @param {string}   localName
 * @param {Function} setDmMessages
 * @returns {(msg: StompMessage) => void}
 */
export const makeDmDeleteHandler = (localName, setDmMessages) => (msg) => {
  const dm    = JSON.parse(msg.body);
  const other = dm.sender === localName ? dm.recipient : dm.sender;
  setDmMessages(prev => ({
    ...prev,
    [other]: (prev[other] || []).map(m =>
      m.id === dm.id
        ? { ...m, content: "This message was deleted.", deleted: true }
        : m
    ),
  }));
};

// ─── openDm action ────────────────────────────────────────────────────────────

/**
 * Opens a DM conversation with `targetUser`:
 *  1. Sets active DM user + view
 *  2. Clears the unread badge
 *  3. Fetches message history from REST
 *
 * @param {object} options
 */
export const openDm = ({
  targetUser, localName, authToken,
  setActiveDmUser, setView, setMessage,
  setDmUnread, setDmMessages,
}) => {
  setActiveDmUser(targetUser);
  setView("dm");
  setMessage("");
  setDmUnread(prev => ({ ...prev, [targetUser]: 0 }));

  fetchDmHistory(authToken, localName, targetUser)
    .then(data =>
      setDmMessages(prev => ({
        ...prev,
        [targetUser]: data.map(normaliseMessage),
      }))
    )
    .catch(() => {});
};

// ─── Channel history loader ───────────────────────────────────────────────────

/**
 * Loads channel message history on connect.
 *
 * @param {string}   authToken
 * @param {Function} setMessages
 */
export const loadChannelHistory = (authToken, setMessages) =>
  fetchChannelHistory(authToken)
    .then(history => setMessages(history.map(normaliseMessage)))
    .catch(() => {});

// ─── sendMessage action ───────────────────────────────────────────────────────

/**
 * Sends the current message draft (or commits an edit).
 * Handles channel, DM, and room views.
 *
 * @param {object} options
 */
export const sendMessage = ({
  message, editingMsg, editText,
  view, activeDmUser, activeRoom,
  name, stompClient,
  setMessage, setEditingMsg, setEditText,
  typingTimeoutRef, nameRef,
}) => {
  // Commit edit
  if (editingMsg) {
    if (editText.trim()) {
      publishEdit(stompClient, {
        messageId:  editingMsg.id,
        newContent: editText.trim(),
        editor:     name,
      });
    }
    setEditingMsg(null); setEditText(""); setMessage("");
    return;
  }

  // Stop typing indicator
  clearTimeout(typingTimeoutRef.current);
  publishTyping(stompClient, nameRef.current, false);

  if (!stompClient.current?.connected || !message.trim()) return;

  if (view === "dm" && activeDmUser) {
    publishDmMessage(stompClient, {
      sender: name, recipient: activeDmUser, content: message.trim(), type: MSG_TYPES.TEXT,
    });
  } else if (view === "room" && activeRoom) {
    publishRoomMessage(stompClient, {
      roomId: activeRoom.id, sender: name, content: message.trim(), type: MSG_TYPES.TEXT,
    });
  } else {
    publishChannelMessage(stompClient, { sender: nameRef.current, content: message.trim() });
  }

  setMessage("");
};

// ─── handleInput action ───────────────────────────────────────────────────────

/**
 * Handles textarea input: resizes the element, updates state, and
 * publishes a typing indicator with debounce.
 *
 * @param {object} options
 */
export const handleInput = ({
  e, editingMsg,
  setMessage, setEditText,
  stompClient, nameRef,
  typingTimeoutRef,
}) => {
  const val = e.target.value;
  setMessage(val);
  if (editingMsg) setEditText(val);

  // Auto-resize textarea
  e.target.style.height = "auto";
  e.target.style.height = Math.min(e.target.scrollHeight, 110) + "px";

  publishTyping(stompClient, nameRef.current, true);
  clearTimeout(typingTimeoutRef.current);
  typingTimeoutRef.current = setTimeout(
    () => publishTyping(stompClient, nameRef.current, false),
    TYPING_DEBOUNCE_MS
  );
};

// ─── Edit / delete message actions ───────────────────────────────────────────

/**
 * Starts editing a message — populates the edit draft and focuses the input.
 *
 * @param {object} msg
 * @param {Function} setEditingMsg
 * @param {Function} setEditText
 * @param {Function} setMessage
 * @param {React.RefObject} inputRef
 */
export const startEdit = (msg, setEditingMsg, setEditText, setMessage, inputRef) => {
  setEditingMsg(msg);
  setEditText(msg.content);
  setMessage(msg.content);
  setTimeout(() => inputRef.current?.focus(), 50);
};

/**
 * Cancels an in-progress edit.
 */
export const cancelEdit = (setEditingMsg, setEditText, setMessage) => {
  setEditingMsg(null); setEditText(""); setMessage("");
};

/**
 * Publishes a delete request for a message.
 *
 * @param {string} msgId
 * @param {string} deletedBy
 * @param {React.MutableRefObject} stompClient
 */
export const deleteMessage = (msgId, deletedBy, stompClient) =>
  publishDelete(stompClient, { messageId: msgId, deletedBy });

// ─── Seen receipts ────────────────────────────────────────────────────────────

/**
 * Marks all unseen messages from others as seen.
 * Called inside a useEffect whenever the messages array changes.
 *
 * @param {object[]} messages
 * @param {string}   localName
 * @param {React.MutableRefObject} stompClient
 */
export const markMessagesSeen = (messages, localName, stompClient) => {
  messages.forEach(msg => {
    if (msg.sender !== localName && msg.id && msg.status !== "SEEN") {
      publishSeen(stompClient, { messageId: msg.id, username: localName });
    }
  });
};

// ─── File upload action ───────────────────────────────────────────────────────

/**
 * Uploads a file and publishes the resulting URL as a chat message.
 *
 * @param {object} options
 */
export const uploadAndPublish = async ({
  file, type, name, view, activeDmUser, activeRoom, stompClient,
}) => {
  try {
    const rawUrl  = await apiUploadFile(file);
    const fileUrl = resolveUrl(rawUrl);
    publishFileMessage(stompClient, view, {
      sender: name,
      activeDmUser,
      activeRoomId: activeRoom?.id,
    }, {
      content: file.name || "",
      type,
      fileUrl,
    });
  } catch (err) {
    alert("Upload failed — is the server running?\n" + err.message);
  }
};

// ─── Voice recording actions ──────────────────────────────────────────────────

/**
 * Starts a voice recording session.
 * Resolves/rejects based on microphone permission.
 *
 * @param {object} options
 */
export const startRecording = async ({
  setRecording, setRecordSecs,
  recorderRef, recordTimerRef,
  onComplete,   // called with the recorded File when done
}) => {
  if (!navigator.mediaDevices?.getUserMedia) {
    alert("Your browser does not support microphone recording."); return;
  }
  try {
    const stream   = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;
    const chunks = [];

    recorder.ondataavailable = (e) => { if (e.data?.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      clearInterval(recordTimerRef.current);
      setRecording(false); setRecordSecs(0);
      const blob = new Blob(chunks, { type: "audio/webm" });
      if (blob.size > 0) onComplete(new File([blob], "voice.webm", { type: "audio/webm" }));
    };

    recorder.start();
    setRecording(true);

    let secs = 0;
    recordTimerRef.current = setInterval(() => {
      secs++;
      setRecordSecs(secs);
      if (secs >= MAX_RECORD_SECS && recorder.state !== "inactive") recorder.stop();
    }, 1000);
  } catch {
    alert("Microphone access denied or unavailable.");
  }
};

/**
 * Stops the current voice recording.
 *
 * @param {React.RefObject} recorderRef
 */
export const stopRecording = (recorderRef) => {
  const r = recorderRef.current;
  if (r && r.state !== "inactive") r.stop();
};