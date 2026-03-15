// features/emoji/emoji.handlers.js
// STOMP subscription factory and action helpers for emoji reactions.
//
// Keeps Chat.jsx's connect() block thin — each subscription is a one-liner.
// All action wrappers follow the same pattern as call.handlers.js and
// room.handlers.js so the whole codebase stays consistent.

import { TOPICS }           from "../../shared/constants/api";
import { publishReaction }  from "../../shared/services/stompService";

// ─── STOMP subscription factory ───────────────────────────────────────────────

/**
 * Builds the handler for /topic/reaction.
 * Updates the reactions state map whenever any message receives or loses
 * a reaction.
 *
 * The server sends the full updated reaction list for that message, so we
 * simply replace the existing entry rather than merging.
 *
 * @param {Function} setReactions  setState for reactions map: { [msgId]: RawReaction[] }
 * @returns {(msg: StompMessage) => void}
 */
export const makeReactionHandler = (setReactions) => (msg) => {
  const event = JSON.parse(msg.body);
  setReactions(prev => ({
    ...prev,
    [event.messageId]: event.reactions || [],
  }));
};

// ─── Reaction action helper ───────────────────────────────────────────────────

/**
 * Toggles a reaction on a message.
 * Publishes to /app/react via STOMP — the server handles add/remove logic
 * and broadcasts the updated list back on /topic/reaction.
 *
 * @param {React.MutableRefObject} stompClient
 * @param {string}                 messageId
 * @param {string}                 emoji
 * @param {string}                 username      The local user's name
 */
export const sendReaction = (stompClient, messageId, emoji, username) =>
  publishReaction(stompClient, { messageId, username, emoji });

// ─── Emoji picker outside-click handler ──────────────────────────────────────

/**
 * Attaches a mousedown listener that closes the emoji picker when the user
 * clicks outside the picker element.  Returns a cleanup function.
 *
 * Used inside a useEffect in Chat.jsx:
 *   useEffect(() => closeEmojiOnOutsideClick(emojiRef, setShowEmoji), []);
 *
 * @param {React.RefObject} emojiRef      ref attached to the picker container
 * @param {Function}        setShowEmoji  setState to hide the picker
 * @returns {() => void}                  cleanup function for useEffect
 */
export const closeEmojiOnOutsideClick = (emojiRef, setShowEmoji) => {
  const handler = (e) => {
    if (emojiRef.current && !emojiRef.current.contains(e.target)) {
      setShowEmoji(false);
    }
  };
  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
};