// shared/services/apiService.js
// All HTTP calls to the backend in one place.
//
// Why a service layer?
//  • fetch() calls were duplicated across Chat.jsx, SettingsModal, ProfileModal,
//    RoomInfoPanel etc., each re-implementing the same Authorization header.
//  • Centralising them means: change the auth scheme once, rotate the base
//    URL once, add global error handling once.
//  • Each function is independently mockable in tests.
//
// Convention:
//  • Every function accepts `authToken` as its last argument.
//  • Functions return the parsed JSON body on success.
//  • On a non-OK HTTP status they throw an Error whose message comes from
//    the server's `error` or `message` field (or a generic fallback).

import { API_ROUTES } from "../constants/api";

// ─── Internal helpers ─────────────────────────────────────────────────────────

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

const jsonHeaders = (token) => ({
  "Content-Type": "application/json",
  ...authHeaders(token),
});

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `HTTP ${res.status}`);
  }
  return data;
}

// ─── Auth / User ──────────────────────────────────────────────────────────────

export const fetchAllUsers = (token) =>
  fetch(API_ROUTES.users, { headers: authHeaders(token) }).then(handleResponse);

export const fetchProfile = (username, token) =>
  fetch(API_ROUTES.profile(username), { headers: authHeaders(token) }).then(handleResponse);

export const updateProfile = (token, { displayName, bio }) =>
  fetch(API_ROUTES.updateProfile, {
    method: "PUT",
    headers: jsonHeaders(token),
    body: JSON.stringify({ displayName, bio }),
  }).then(handleResponse);

export const uploadAvatar = (token, file) => {
  const fd = new FormData();
  fd.append("file", file);
  return fetch(API_ROUTES.uploadAvatar, {
    method: "POST",
    headers: authHeaders(token),
    body: fd,
  }).then(handleResponse);
};

export const updateEmail = (token, newEmail) =>
  fetch(API_ROUTES.updateEmail, {
    method: "PUT",
    headers: jsonHeaders(token),
    body: JSON.stringify({ newEmail }),
  }).then(handleResponse);

export const changeUsername = (token, newUsername) =>
  fetch(API_ROUTES.changeUsername, {
    method: "PUT",
    headers: jsonHeaders(token),
    body: JSON.stringify({ newUsername }),
  }).then(handleResponse);

export const sendVerificationCode = (token) =>
  fetch(API_ROUTES.sendCode, {
    method: "POST",
    headers: authHeaders(token),
  }).then(handleResponse);

export const changePassword = (token, { code, newPassword }) =>
  fetch(API_ROUTES.changePassword, {
    method: "POST",
    headers: jsonHeaders(token),
    body: JSON.stringify({ code, newPassword }),
  }).then(handleResponse);

export const deleteAccount = (token) =>
  fetch(API_ROUTES.deleteAccount, {
    method: "DELETE",
    headers: authHeaders(token),
  }).then(handleResponse);

// ─── Message history ──────────────────────────────────────────────────────────

export const fetchChannelHistory = (token) =>
  fetch(API_ROUTES.history, { headers: authHeaders(token) }).then(handleResponse);

export const fetchDmHistory = (token, userA, userB) =>
  fetch(API_ROUTES.dmHistory(userA, userB), {
    headers: authHeaders(token),
  }).then(handleResponse);

// ─── Rooms ────────────────────────────────────────────────────────────────────

export const fetchRooms = (token) =>
  fetch(API_ROUTES.rooms, { headers: authHeaders(token) }).then(handleResponse);

export const createRoom = (token, roomData) =>
  fetch(API_ROUTES.rooms, {
    method: "POST",
    headers: jsonHeaders(token),
    body: JSON.stringify(roomData),
  }).then(handleResponse);

export const updateRoom = (token, roomId, { name, description }) =>
  fetch(API_ROUTES.room(roomId), {
    method: "PUT",
    headers: jsonHeaders(token),
    body: JSON.stringify({ name, description }),
  }).then(handleResponse);

export const fetchRoomHistory = (token, roomId) =>
  fetch(API_ROUTES.roomHistory(roomId), {
    headers: authHeaders(token),
  }).then(handleResponse);

// ─── File upload ──────────────────────────────────────────────────────────────

/**
 * Uploads any file to the generic /upload endpoint.
 * Returns the raw text URL string the server responds with.
 *
 * @param {File} file
 * @returns {Promise<string>}  Absolute file URL
 */
export const uploadFile = async (file, token) => {
  const fd = new FormData();
  fd.append("file", file);
  const headers = {};
  const resolvedToken = token || localStorage.getItem("token");
  if (resolvedToken) headers.Authorization = `Bearer ${resolvedToken}`;
  const res = await fetch(API_ROUTES.upload, { method: "POST", headers, body: fd });
  if (res.status === 401 || res.status === 403) throw new Error("Unauthorized — token may be expired");
  if (!res.ok) throw new Error(`Upload failed — HTTP ${res.status}`);
  return res.text();
};