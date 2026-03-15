// shared/utils/formatters.js
// Pure transformation functions — no React, no side-effects, no imports
// from the rest of the app except constants.
// Safe to unit-test in isolation.

import { BASE_URL, AVATAR_GRADIENTS } from "../constants";

// ─── Time ─────────────────────────────────────────────────────────────────────

/**
 * Returns the current wall-clock time formatted as "HH:MM".
 * Used when a message arrives without a server-provided timestamp.
 */
export const getTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/**
 * Converts a raw ISO / epoch timestamp from the server into the same
 * "HH:MM" format used across the whole message list.
 * Falls back to getTime() when the value is null / undefined.
 *
 * @param {string | number | null | undefined} timestamp
 * @returns {string}
 */
export const formatTimestamp = (timestamp) =>
  timestamp
    ? new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : getTime();

/**
 * Formats a call duration (seconds) as a zero-padded "MM:SS" string.
 * Used in the CallOverlay timer and the "call ended" chat message.
 *
 * @param {number} totalSeconds
 * @returns {string}  e.g. 75 → "01:15"
 */
export const formatDuration = (totalSeconds) =>
  `${String(Math.floor(totalSeconds / 60)).padStart(2, "0")}:${String(
    totalSeconds % 60
  ).padStart(2, "0")}`;

// ─── Strings ──────────────────────────────────────────────────────────────────

/**
 * Returns the uppercased first character of a name string.
 * Used for avatar fallback initials throughout the app.
 *
 * @param {string | null | undefined} name
 * @returns {string}  e.g. "alice" → "A"
 */
export const initial = (name) => (name || "?")[0].toUpperCase();

// ─── URL resolution ───────────────────────────────────────────────────────────

/**
 * Normalises any file URL returned by the backend into a fully qualified
 * URL pointing at BASE_URL.
 *
 * Three cases handled:
 *  1. Already absolute (http/https) — strips the embedded host and
 *     re-prefixes with BASE_URL so staging/prod env swaps are transparent.
 *  2. Relative path with leading "/"  → BASE_URL + path
 *  3. Relative path without "/"      → BASE_URL + "/" + path
 *
 * Previously this logic was copy-pasted inline inside renderContent().
 *
 * @param {string | null | undefined} url
 * @returns {string}
 */
export const resolveUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) {
    const path = url.replace(/^https?:\/\/[^/]+/, "");
    return `${BASE_URL}${path}`;
  }
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

/**
 * Resolves an avatar URL the same way resolveUrl() does, but also handles
 * the case where avatarUrl is already a full URL — which can happen when
 * the server echoes back the URL it stored.
 *
 * @param {string | null | undefined} avatarUrl
 * @returns {string}
 */
export const resolveAvatarUrl = (avatarUrl) => resolveUrl(avatarUrl);

// ─── Avatar colours ───────────────────────────────────────────────────────────

/**
 * Returns a deterministic CSS gradient string for a given username.
 * Uses the char-code of the first character to index into AVATAR_GRADIENTS.
 * Same username always gets the same colour — across page reloads and
 * across every component that renders an avatar.
 *
 * @param {string} username
 * @returns {string}  CSS gradient string
 */
export const getAvatarGradient = (username = "") =>
  AVATAR_GRADIENTS[username.charCodeAt(0) % AVATAR_GRADIENTS.length];