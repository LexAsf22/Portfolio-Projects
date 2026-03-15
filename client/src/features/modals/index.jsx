// features/modals/index.js
// Public API of the modals feature module.
// Chat.jsx imports exclusively from here.

// ─── Components ───────────────────────────────────────────────────────────────
export { default as CreateRoomModal } from "./CreateRoomModal";
export { default as ProfileModal }    from "./ProfileModal";
export { default as SettingsModal }   from "./SettingsModal";

// ─── Manager hook ─────────────────────────────────────────────────────────────
export { useModalManager } from "./modal.manager";

// ─── Constants ────────────────────────────────────────────────────────────────
export { MODAL_IDS, SETTINGS_TABS, ROOM_TEMPLATES } from "./modal.constants";