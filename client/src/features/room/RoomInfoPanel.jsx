// features/room/RoomInfoPanel.jsx
// Slide-in panel on the right side of the chat window showing room details.
// Allows the room creator to edit the name and description in-place.

import React, { useState } from "react";

import { updateRoom }       from "../../shared/services/apiService";
import { getRoomIconColor } from "./room.constants";
import { replaceRoom }      from "./room.utils";

export default function RoomInfoPanel({ room, onClose, authToken, onUpdateRoom }) {
  const [editing,  setEditing]  = useState(false);
  const [roomName, setRoomName] = useState(room?.name        || "");
  const [roomDesc, setRoomDesc] = useState(room?.description || "");
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState(null);  // { ok: bool, text: string }

  const iconColor = getRoomIconColor(room?.name);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const updated = await updateRoom(authToken, room.id, {
        name:        roomName.trim(),
        description: roomDesc.trim(),
      });
      onUpdateRoom(updated);
      setMsg({ ok: true, text: "Saved!" });
      setEditing(false);
    } catch {
      setMsg({ ok: false, text: "Failed to save" });
    }
    setSaving(false);
  };

  const cancelEdit = () => {
    setEditing(false);
    setRoomName(room?.name        || "");
    setRoomDesc(room?.description || "");
    setMsg(null);
  };

  // ── Shared inline styles ──────────────────────────────────────────────────
  const inputSt = {
    width: "100%",
    background: "var(--input-bg)",
    border: "1.5px solid var(--glass-border)",
    borderRadius: 8,
    padding: "9px 12px",
    fontFamily: "inherit",
    fontSize: 13,
    color: "var(--text)",
    outline: "none",
    marginBottom: 10,
  };

  const labelSt = {
    display: "block",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: 5,
  };

  const msgSt = (ok) => ({
    fontSize: 12,
    padding: "7px 10px",
    borderRadius: 8,
    marginBottom: 10,
    background: ok ? "rgba(74,222,128,0.12)"  : "rgba(251,113,133,0.12)",
    color:      ok ? "#4ade80"                : "#fb7185",
    border:    `1px solid ${ok ? "rgba(74,222,128,0.3)" : "rgba(251,113,133,0.3)"}`,
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      width: 280,
      borderLeft: "1px solid var(--divider)",
      height: "100%",
      background: "var(--glass2)",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      overflow: "hidden",
      animation: "slideInRight 0.2s cubic-bezier(0.16,1,0.3,1)",
    }}>

      {/* Header */}
      <div style={{
        padding: "16px 18px",
        borderBottom: "1px solid var(--divider)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>Room Info</span>
        <button onClick={onClose} style={{
          background: "var(--btn-bg)", border: "none", borderRadius: 8,
          width: 28, height: 28, cursor: "pointer",
          color: "var(--text-muted)", fontSize: 15,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 18px" }}>

        {/* Room icon + name/desc */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: `linear-gradient(135deg, ${iconColor}, #a855f7)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, marginBottom: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          }}>
            {room?.emoji || "🌟"}
          </div>

          {!editing ? (
            <>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                {room?.name}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-sub)", textAlign: "center", lineHeight: 1.5 }}>
                {room?.description || "No description"}
              </div>
            </>
          ) : (
            <div style={{ width: "100%", marginTop: 8 }}>
              {msg && <div style={msgSt(msg.ok)}>{msg.text}</div>}

              <label style={labelSt}>Room Name</label>
              <input
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
                style={inputSt}
              />

              <label style={labelSt}>Description</label>
              <textarea
                value={roomDesc}
                onChange={e => setRoomDesc(e.target.value)}
                rows={3}
                style={{ ...inputSt, resize: "none", marginBottom: 12 }}
              />

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={save}
                  disabled={saving}
                  style={{
                    flex: 1, padding: "9px", borderRadius: 8,
                    border: "none", background: "var(--bubble-me)",
                    color: "#fff", fontFamily: "inherit",
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={cancelEdit}
                  style={{
                    flex: 1, padding: "9px", borderRadius: 8,
                    border: "1px solid var(--glass-border)",
                    background: "transparent", color: "var(--text-sub)",
                    fontFamily: "inherit", fontSize: 13, cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Edit button (shown when not editing) */}
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            style={{
              width: "100%", padding: "10px", borderRadius: 10,
              border: "1.5px solid var(--glass-border)",
              background: "var(--btn-bg)", color: "var(--text)",
              fontFamily: "inherit", fontSize: 13, fontWeight: 600,
              cursor: "pointer", marginBottom: 20,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            ✏️ Edit Room Info
          </button>
        )}

        {/* Room details table */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: 10,
          border: "1px solid var(--glass-border)",
          overflow: "hidden",
        }}>
          {[
            { label: "Type",       value: room?.roomType === "private" ? "🔒 Private" : "🌐 Public" },
            { label: "Created by", value: room?.createdBy || "Unknown" },
            { label: "Template",   value: room?.template  || "Custom"  },
          ].map((row, i, arr) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "11px 14px",
              borderBottom: i < arr.length - 1 ? "1px solid var(--divider)" : "none",
            }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
                {row.label}
              </span>
              <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}