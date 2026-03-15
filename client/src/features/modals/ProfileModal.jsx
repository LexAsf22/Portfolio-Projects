// features/modals/ProfileModal.jsx
// Quick-edit modal for display name, bio, and avatar.
// Opened from the bottom user bar in the sidebar.

import React, { useState, useRef } from "react";

import { updateProfile, uploadAvatar } from "../../shared/services/apiService";
import { resolveUrl }                  from "../../shared/utils/formatters";
import {
  overlayStyle,
  inputStyle,
  primaryBtnStyle,
  secondaryBtnStyle,
} from "./modal.utils";

export default function ProfileModal({ onClose, authToken, user, onUpdate }) {
  const [displayName, setDisplayName] = useState(user?.displayName || user?.username || "");
  const [bio,         setBio]         = useState(user?.bio || "");
  const [saving,      setSaving]      = useState(false);

  const fileRef = useRef(null);

  const save = async () => {
    setSaving(true);
    try {
      const data = await updateProfile(authToken, { displayName, bio });
      onUpdate(data);
    } catch { /* ignore */ }
    setSaving(false);
    onClose();
  };

  const handleAvatarUpload = async (file) => {
    try {
      const data = await uploadAvatar(authToken, file);
      onUpdate({ avatarUrl: data.avatarUrl });
    } catch { /* ignore */ }
  };

  const avatarSrc = user?.avatarUrl ? resolveUrl(user.avatarUrl) : null;

  return (
    <div
      style={overlayStyle({ zIndex: 300 })}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        width: 400,
        background: "var(--glass2)",
        border: "1px solid var(--glass-border)",
        borderRadius: 22,
        padding: "36px 32px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>
          Edit Profile
        </div>

        {/* Avatar */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div
            style={{ position: "relative", cursor: "pointer" }}
            onClick={() => fileRef.current.click()}
          >
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "var(--bubble-me)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, fontWeight: 700, color: "#fff", overflow: "hidden",
            }}>
              {avatarSrc
                ? <img src={avatarSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => { e.target.style.display = "none"; }} />
                : (user?.username || "?")[0].toUpperCase()
              }
            </div>
            <div style={{
              position: "absolute", bottom: 0, right: 0,
              width: 22, height: 22, borderRadius: "50%",
              background: "var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 14, fontWeight: 700,
            }}>+</div>
          </div>
          <input
            ref={fileRef} type="file" accept="image/*"
            style={{ display: "none" }}
            onChange={e => { if (e.target.files[0]) handleAvatarUpload(e.target.files[0]); }}
          />
        </div>

        {/* Display name */}
        <label style={{
          display: "block", fontSize: 11, fontWeight: 700,
          letterSpacing: 1, textTransform: "uppercase",
          color: "var(--text-muted)", marginBottom: 6,
        }}>
          Display Name
        </label>
        <input
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          placeholder="Your display name"
          style={{ ...inputStyle(), marginBottom: 14 }}
        />

        {/* Bio */}
        <label style={{
          display: "block", fontSize: 11, fontWeight: 700,
          letterSpacing: 1, textTransform: "uppercase",
          color: "var(--text-muted)", marginBottom: 6,
        }}>
          Bio
        </label>
        <input
          value={bio}
          onChange={e => setBio(e.target.value)}
          placeholder="Tell others about yourself"
          style={{ ...inputStyle(), marginBottom: 20 }}
        />

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ ...secondaryBtnStyle(), flex: 1, padding: "11px" }}>
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            style={{ ...primaryBtnStyle(true), flex: 1, padding: "11px" }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}