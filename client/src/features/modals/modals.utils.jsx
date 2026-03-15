// features/modals/modal.utils.js
// Pure helper functions used only within the modals feature.
// No React, no side-effects — safe to unit-test in isolation.

// ─── Shared inline style objects ─────────────────────────────────────────────
// These style factories are used identically across CreateRoomModal,
// ProfileModal, and SettingsModal.  Centralising them here removes the
// duplication and makes visual tweaks a single-line change.

/**
 * Base overlay backdrop style.
 * Pass extra keys to override (e.g. alignItems for top-aligned modals).
 *
 * @param {object} overrides
 * @returns {object} inline style
 */
export const overlayStyle = (overrides = {}) => ({
  position: "fixed", inset: 0, zIndex: 400,
  background: "rgba(0,0,0,0.75)",
  backdropFilter: "blur(8px)",
  display: "flex", alignItems: "center", justifyContent: "center",
  animation: "fadeIn 0.15s",
  padding: 20,
  ...overrides,
});

/**
 * Base modal card style.
 *
 * @param {object} overrides
 * @returns {object} inline style
 */
export const modalCardStyle = (overrides = {}) => ({
  width: "100%", maxWidth: 460,
  background: "var(--glass2)",
  borderRadius: 20,
  border: "1px solid var(--glass-border)",
  boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
  overflow: "hidden",
  animation: "scalePop 0.2s cubic-bezier(0.34,1.56,0.64,1)",
  ...overrides,
});

/**
 * Standard text input style used across all modals.
 *
 * @param {object} overrides
 * @returns {object} inline style
 */
export const inputStyle = (overrides = {}) => ({
  width: "100%",
  background: "var(--input-bg)",
  border: "1.5px solid var(--glass-border)",
  borderRadius: 10,
  padding: "11px 14px",
  fontFamily: "inherit",
  fontSize: 14,
  color: "var(--text)",
  outline: "none",
  ...overrides,
});

/**
 * Uppercase section label used above input groups in all modals.
 *
 * @returns {object} inline style
 */
export const sectionLabelStyle = () => ({
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: "var(--text-muted)",
  marginBottom: 6,
});

/**
 * Primary action button used in all modals (Save, Create, etc.).
 *
 * @param {boolean} enabled  — false renders a disabled/greyed style
 * @returns {object} inline style
 */
export const primaryBtnStyle = (enabled = true) => ({
  padding: "10px 22px",
  borderRadius: 10,
  border: "none",
  background: enabled ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "var(--btn-bg)",
  color: enabled ? "#fff" : "var(--text-muted)",
  fontFamily: "inherit",
  fontSize: 14,
  fontWeight: 700,
  cursor: enabled ? "pointer" : "not-allowed",
  transition: "all 0.2s",
  boxShadow: enabled ? "0 4px 20px rgba(124,58,237,0.35)" : "none",
});

/**
 * Secondary / cancel button used in all modals.
 *
 * @returns {object} inline style
 */
export const secondaryBtnStyle = () => ({
  padding: "10px 22px",
  borderRadius: 10,
  border: "1.5px solid var(--glass-border)",
  background: "transparent",
  color: "var(--text-sub)",
  fontFamily: "inherit",
  fontSize: 14,
  cursor: "pointer",
});

// ─── Status message helpers ───────────────────────────────────────────────────

/**
 * Inline style for success / error feedback messages inside modals.
 *
 * @param {boolean} ok  — true = success (green), false = error (red)
 * @returns {object} inline style
 */
export const msgStyle = (ok) => ({
  fontSize: 13,
  padding: "8px 12px",
  borderRadius: 8,
  marginBottom: 12,
  background: ok ? "rgba(74,222,128,0.12)" : "rgba(251,113,133,0.12)",
  color:      ok ? "#4ade80"               : "#fb7185",
  border:    `1px solid ${ok ? "rgba(74,222,128,0.3)" : "rgba(251,113,133,0.3)"}`,
});

/**
 * Prefix icon for a status message.
 *
 * @param {boolean} ok
 * @returns {string}  emoji string
 */
export const msgIcon = (ok) => (ok ? "✅" : "⚠️");

// ─── Toggle (on/off switch) helpers ──────────────────────────────────────────
// Used in SettingsModal rows.

export const toggleTrackStyle = (on) => ({
  width: 44, height: 24,
  borderRadius: 999,
  border: "none",
  cursor: "pointer",
  position: "relative",
  background: on ? "var(--accent)" : "var(--btn-bg)",
  transition: "background 0.2s",
  flexShrink: 0,
});

export const toggleThumbStyle = (on) => ({
  position: "absolute",
  top: 3,
  left: on ? 23 : 3,
  width: 18, height: 18,
  borderRadius: "50%",
  background: "#fff",
  transition: "left 0.2s",
  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
});

// ─── Validation helpers ───────────────────────────────────────────────────────

/**
 * Returns true if the string looks like a valid email address.
 * Deliberately simple — a full RFC-5322 regex is not needed here.
 *
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);