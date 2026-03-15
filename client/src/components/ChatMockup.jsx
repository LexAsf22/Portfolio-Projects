// src/components/ChatMockup.jsx
// Static chat UI mockup rendered inside the landing page hero section.
// Pure presentational — no props, no state, no API calls.
// Extracted from Chat.jsx where it was defined inline.

export default function ChatMockup() {
  const msgs = [
    { from: "A", text: "Hey team! Just pushed the new update 🚀",      me: false },
    { from: "B", text: "Looks great! The real-time sync is super smooth now.", me: true  },
    { from: "A", text: "Thanks! Voice calls are crystal clear too 🎙️",  me: false },
    { from: "B", text: "Testing it right now — works perfectly!",        me: true  },
  ];

  const contacts = [
    { init: "A", name: "Alex Chen",  last: "Just pushed the update",  active: true  },
    { init: "J", name: "Jordan M.",  last: "See you tomorrow!",        active: false },
    { init: "S", name: "Sam K.",     last: "📎 shared a file",         active: false },
  ];

  return (
    <div className="mockup-frame">
      {/* Title bar */}
      <div className="mockup-bar">
        <div className="mockup-dot" style={{ background: "#ff5f57" }} />
        <div className="mockup-dot" style={{ background: "#febc2e" }} />
        <div className="mockup-dot" style={{ background: "#28c840" }} />
        <div className="mockup-title">CosmoChat — Channel 1</div>
      </div>

      <div className="mockup-body">
        {/* Sidebar */}
        <div className="mockup-sidebar">
          <div className="mockup-sb-label">Messages</div>
          {contacts.map((c, i) => (
            <div key={i} className={`mockup-contact ${c.active ? "active" : ""}`}>
              <div className="mockup-av">
                {c.init}
                {c.active && <div className="mockup-av-dot" />}
              </div>
              <div className="mockup-cinfo">
                <div className="mockup-cname">{c.name}</div>
                <div className="mockup-clast">{c.last}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat area */}
        <div className="mockup-chat">
          <div className="mockup-chat-hdr">
            <div className="mockup-av" style={{ width: 28, height: 28, fontSize: 11 }}>A</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>Alex Chen</div>
              <div style={{ fontSize: 10, color: "#10b981", marginTop: 1 }}>● Active now</div>
            </div>
            <div style={{ display: "flex", gap: 6, fontSize: 14 }}>📞 📹 ℹ️</div>
          </div>

          <div className="mockup-msgs">
            {msgs.map((m, i) => (
              <div key={i} className={`mockup-msg-row ${m.me ? "me" : ""}`}>
                {!m.me && <div className="mockup-mini-av">{m.from}</div>}
                <div className={`mockup-bubble ${m.me ? "me" : "other"}`}>{m.text}</div>
              </div>
            ))}
          </div>

          <div className="mockup-input-row">
            <div className="mockup-input-bar">Type a message…</div>
            <div style={{ display: "flex", gap: 5, fontSize: 14 }}>🖼️ 📎 🎤</div>
            <div className="mockup-send-btn">➤</div>
          </div>
        </div>
      </div>
    </div>
  );
}