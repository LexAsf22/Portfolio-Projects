// features/modals/CreateRoomModal.jsx
// Two-step modal: first pick a template, then configure name + type.
// Calls onCreate({ name, template, emoji, type }) when the user confirms.

import React, { useState } from "react";

import {
  overlayStyle,
  modalCardStyle,
  inputStyle,
  primaryBtnStyle,
} from "./modal.utils";
import { ROOM_TEMPLATES } from "./modal.constants";

export default function CreateRoomModal({ onClose, onCreate }) {
  const [step,     setStep]     = useState("template"); // "template" | "configure"
  const [template, setTemplate] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState("public");

  const selectedTemplate = ROOM_TEMPLATES.find(t => t.id === template);

  const handleTemplateSelect = (t) => {
    setTemplate(t.id);
    setRoomName(t.id === "own" ? "" : t.label + " Room");
    setStep("configure");
  };

  const handleCreate = () => {
    if (!roomName.trim()) return;
    onCreate({
      name:     roomName.trim(),
      template,
      emoji:    selectedTemplate?.emoji || "🌟",
      type:     roomType,
    });
    onClose();
  };

  return (
    <div
      style={overlayStyle()}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={modalCardStyle()}>

        {/* ── Header ── */}
        <div style={{ padding: "24px 24px 0", textAlign: "center", position: "relative" }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 16, right: 16,
              background: "var(--btn-bg)", border: "none", borderRadius: "50%",
              width: 30, height: 30, cursor: "pointer",
              color: "var(--text-muted)", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>

          {step === "template" ? (
            <>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 8 }}>
                Create Your Room
              </div>
              <div style={{ fontSize: 13, color: "var(--text-sub)", lineHeight: 1.6, marginBottom: 20 }}>
                Your room is where you and your friends hang out.<br />
                Make yours and start talking.
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep("template")}
                style={{
                  position: "absolute", top: 16, left: 16,
                  background: "var(--btn-bg)", border: "none", borderRadius: "50%",
                  width: 30, height: 30, cursor: "pointer",
                  color: "var(--text-muted)", fontSize: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >←</button>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{selectedTemplate?.emoji}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>
                {selectedTemplate?.label}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 20 }}>
                {selectedTemplate?.desc}
              </div>
            </>
          )}
        </div>

        {/* ── Content ── */}
        {step === "template" ? (
          <div style={{ maxHeight: 380, overflowY: "auto", padding: "0 16px 16px" }}>

            {/* Featured "Create My Own" */}
            <div
              onClick={() => handleTemplateSelect(ROOM_TEMPLATES[0])}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px", borderRadius: 12,
                background: "var(--accent-soft)", border: "1.5px solid var(--accent)",
                cursor: "pointer", marginBottom: 16, transition: "transform 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.01)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: ROOM_TEMPLATES[0].color,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>
                  {ROOM_TEMPLATES[0].emoji}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                    {ROOM_TEMPLATES[0].label}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-sub)" }}>
                    {ROOM_TEMPLATES[0].desc}
                  </div>
                </div>
              </div>
              <span style={{ color: "var(--accent)", fontSize: 18 }}>›</span>
            </div>

            {/* Template list */}
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
              textTransform: "uppercase", color: "var(--text-muted)",
              marginBottom: 8, paddingLeft: 4,
            }}>
              START FROM A TEMPLATE
            </div>

            {ROOM_TEMPLATES.slice(1).map(t => (
              <div
                key={t.id}
                onClick={() => handleTemplateSelect(t)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 14px", borderRadius: 10,
                  cursor: "pointer", transition: "background 0.15s", marginBottom: 2,
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--glass-border)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: t.color,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                  }}>
                    {t.emoji}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{t.label}</div>
                    <div style={{ fontSize: 11, color: "var(--text-sub)" }}>{t.desc}</div>
                  </div>
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: 18 }}>›</span>
              </div>
            ))}
          </div>

        ) : (
          <div style={{ padding: "0 24px 24px" }}>

            {/* Room name */}
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: 1,
                textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8,
              }}>
                Room Name
              </div>
              <input
                style={inputStyle()}
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
                placeholder="Enter room name"
                autoFocus
                onKeyDown={e => e.key === "Enter" && handleCreate()}
              />
            </div>

            {/* Room type */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: 1,
                textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8,
              }}>
                Room Type
              </div>
              {[
                { id: "public",  emoji: "🌐", label: "Public",  desc: "Anyone can join this room" },
                { id: "private", emoji: "🔒", label: "Private", desc: "Only invited members can join" },
              ].map(rt => (
                <div
                  key={rt.id}
                  onClick={() => setRoomType(rt.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", borderRadius: 10,
                    border: `1.5px solid ${roomType === rt.id ? "var(--accent)" : "var(--glass-border)"}`,
                    background: roomType === rt.id ? "var(--accent-soft)" : "transparent",
                    cursor: "pointer", marginBottom: 8, transition: "all 0.15s",
                  }}
                >
                  <div style={{ fontSize: 22 }}>{rt.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{rt.label}</div>
                    <div style={{ fontSize: 11, color: "var(--text-sub)" }}>{rt.desc}</div>
                  </div>
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    border: `2px solid ${roomType === rt.id ? "var(--accent)" : "var(--glass-border)"}`,
                    background: roomType === rt.id ? "var(--accent)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {roomType === rt.id && (
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Create button */}
            <button
              onClick={handleCreate}
              disabled={!roomName.trim()}
              style={{
                ...primaryBtnStyle(!!roomName.trim()),
                width: "100%", padding: "13px", borderRadius: 12, fontSize: 14,
              }}
            >
              Create Room ✨
            </button>
          </div>
        )}
      </div>
    </div>
  );
}