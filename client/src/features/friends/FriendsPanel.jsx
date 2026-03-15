// features/friends/FriendsPanel.jsx
// Slide-in overlay panel (320 px wide) for quick friend management.
// Used on narrower viewports or as a quick-access overlay from the sidebar.

import React, { useState } from "react";
import { FRIENDS_PANEL_TABS } from "./friends.constants";

export default function FriendsPanel({
  onClose, allUsers, onlineUsers, friends, friendReqs, incomingReqs,
  onSendReq, onAccept, onRemove, onDm, name,
}) {
  const [tab, setTab] = useState(FRIENDS_PANEL_TABS.ALL);

  const tabStyle = (t) => ({
    flex: 1, padding: "7px", border: "none", borderRadius: 8,
    fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer",
    background: tab === t ? "var(--bubble-me)" : "transparent",
    color:      tab === t ? "#fff"             : "var(--text-sub)",
    transition: "all 0.15s",
  });

  const others = allUsers.filter(u => u !== name);

  return (
    <div className="friends-panel">
      <div className="friends-hdr">
        <div className="friends-title">👥 People</div>
        <button className="friends-close" onClick={onClose}>✕</button>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 3, padding: "10px 12px 0", background: "var(--glass2)" }}>
        <button style={tabStyle(FRIENDS_PANEL_TABS.ALL)}
          onClick={() => setTab(FRIENDS_PANEL_TABS.ALL)}>All Users</button>
        <button style={tabStyle(FRIENDS_PANEL_TABS.FRIENDS)}
          onClick={() => setTab(FRIENDS_PANEL_TABS.FRIENDS)}>
          Friends {friends.length > 0 && <span style={{ marginLeft: 4, opacity: 0.7 }}>({friends.length})</span>}
        </button>
        <button style={tabStyle(FRIENDS_PANEL_TABS.REQUESTS)}
          onClick={() => setTab(FRIENDS_PANEL_TABS.REQUESTS)}>
          Requests {incomingReqs.length > 0 && <span style={{ marginLeft: 4, opacity: 0.7 }}>({incomingReqs.length})</span>}
        </button>
      </div>

      <div className="friends-body">
        {/* ── All Users ── */}
        {tab === FRIENDS_PANEL_TABS.ALL && (
          <>
            <div className="friends-section">All Users — {others.length}</div>
            {others.map((user, i) => (
              <div key={i} className="friend-item">
                <div className="friend-av">
                  {user[0].toUpperCase()}
                  {onlineUsers.includes(user) && <div className="c-online" />}
                </div>
                <div className="friend-info">
                  <div className="friend-name">{user}</div>
                  <div className="friend-status">{onlineUsers.includes(user) ? "🟢 Online" : "⚪ Offline"}</div>
                </div>
                <div className="friend-actions">
                  {friends.includes(user) ? (
                    <>
                      <button className="friend-btn primary" onClick={() => onDm(user)}>DM</button>
                      <button className="friend-btn danger"  onClick={() => onRemove(user)}>Unfriend</button>
                    </>
                  ) : friendReqs.includes(user) ? (
                    <button className="friend-btn danger" style={{ opacity: 0.6, cursor: "default" }}>Sent ✓</button>
                  ) : (
                    <button className="friend-btn primary" onClick={() => onSendReq(user)}>+ Add</button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── Friends ── */}
        {tab === FRIENDS_PANEL_TABS.FRIENDS && (
          <>
            <div className="friends-section">Your Friends — {friends.length}</div>
            {friends.length === 0 && (
              <div style={{ padding: "20px 6px", fontSize: 13, color: "var(--text-muted)" }}>
                No friends yet. Go to All Users to add some!
              </div>
            )}
            {friends.map((user, i) => (
              <div key={i} className="friend-item">
                <div className="friend-av">
                  {user[0].toUpperCase()}
                  {onlineUsers.includes(user) && <div className="c-online" />}
                </div>
                <div className="friend-info">
                  <div className="friend-name">{user}</div>
                  <div className="friend-status">{onlineUsers.includes(user) ? "🟢 Online" : "⚪ Offline"}</div>
                </div>
                <div className="friend-actions">
                  <button className="friend-btn primary" onClick={() => { onDm(user); onClose(); }}>DM</button>
                  <button className="friend-btn danger"  onClick={() => onRemove(user)}>Remove</button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ── Requests ── */}
        {tab === FRIENDS_PANEL_TABS.REQUESTS && (
          <>
            <div className="friends-section">Incoming Requests — {incomingReqs.length}</div>
            {incomingReqs.length === 0 && (
              <div style={{ padding: "20px 6px", fontSize: 13, color: "var(--text-muted)" }}>
                No pending requests.
              </div>
            )}
            {incomingReqs.map((user, i) => (
              <div key={i} className="friend-item">
                <div className="friend-av">{user[0].toUpperCase()}</div>
                <div className="friend-info">
                  <div className="friend-name">{user}</div>
                  <div className="friend-status">Wants to be friends</div>
                </div>
                <div className="friend-actions">
                  <button className="friend-btn accept" onClick={() => onAccept(user)}>Accept</button>
                  <button className="friend-btn danger" onClick={() => onRemove(user)}>Decline</button>
                </div>
              </div>
            ))}

            <div className="friends-section">Sent Requests — {friendReqs.length}</div>
            {friendReqs.length === 0 && (
              <div style={{ padding: "8px 6px", fontSize: 13, color: "var(--text-muted)" }}>
                No sent requests.
              </div>
            )}
            {friendReqs.map((user, i) => (
              <div key={i} className="friend-item">
                <div className="friend-av">{user[0].toUpperCase()}</div>
                <div className="friend-info">
                  <div className="friend-name">{user}</div>
                  <div className="friend-status">Request pending…</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}