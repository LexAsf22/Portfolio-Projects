// features/friends/FriendsPage.jsx
// Full-page friends view shown when the user clicks "Friends" in the sidebar.
// Tabs: Online · All · Friends · Pending · + Add Friend
// Right panel: Active Now + Cosmos Status stats.

import React, { useState } from "react";

import { getAvatarGradient } from "../../shared/utils/formatters";
import { FRIENDS_TABS }      from "./friends.constants";

export default function FriendsPage({
  allUsers, onlineUsers, friends, friendReqs, incomingReqs,
  onSendReq, onAccept, onRemove, onDm, name,
}) {
  const [tab,         setTab]         = useState(FRIENDS_TABS.ALL);
  const [addUsername, setAddUsername] = useState("");
  const [search,      setSearch]      = useState("");

  const others = allUsers.filter(u => u !== name);

  const tabs = [
    { id: FRIENDS_TABS.ONLINE,  label: "Online"                                           },
    { id: FRIENDS_TABS.ALL,     label: "All"                                              },
    { id: FRIENDS_TABS.FRIENDS, label: "Friends"                                          },
    { id: FRIENDS_TABS.PENDING, label: "Pending", badge: incomingReqs.length             },
    { id: FRIENDS_TABS.ADD,     label: "+ Add Friend", primary: true                     },
  ];

  const getList = () => {
    let list = [];
    if (tab === FRIENDS_TABS.ONLINE)  list = others.filter(u => onlineUsers.includes(u) && friends.includes(u));
    else if (tab === FRIENDS_TABS.ALL)     list = friends;
    else if (tab === FRIENDS_TABS.FRIENDS) list = friends;
    else if (tab === FRIENDS_TABS.PENDING) list = incomingReqs;
    else return [];
    if (search.trim()) list = list.filter(u => u.toLowerCase().includes(search.toLowerCase()));
    return list;
  };

  const list = getList();

  const sectionLabel = () => {
    if (tab === FRIENDS_TABS.ONLINE)  return `Online — ${list.length}`;
    if (tab === FRIENDS_TABS.ALL)     return `All Friends — ${list.length}`;
    if (tab === FRIENDS_TABS.FRIENDS) return `All Friends — ${list.length}`;
    if (tab === FRIENDS_TABS.PENDING) return `Pending — ${list.length}`;
    return "";
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

      {/* ── Top bar ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "0 20px", height: 60,
        background: "var(--glass2)", borderBottom: "1px solid var(--divider)", flexShrink: 0,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          paddingRight: 16, borderRight: "1px solid var(--divider)", marginRight: 4,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "linear-gradient(135deg,#7c3aed,#a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
          }}>👥</div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>Friends</span>
        </div>

        {tabs.map(t => (
          <button key={t.id}
            onClick={() => { setTab(t.id); setSearch(""); }}
            style={{
              position: "relative", padding: "5px 14px",
              border: "none", borderRadius: 8, fontFamily: "inherit",
              fontSize: 13, fontWeight: 600, cursor: "pointer", marginRight: 2,
              background: t.primary
                ? "linear-gradient(135deg,#7c3aed,#a855f7)"
                : tab === t.id ? "rgba(124,58,237,0.18)" : "transparent",
              color: t.primary ? "#fff" : tab === t.id ? "#c084fc" : "var(--text-sub)",
              boxShadow: t.primary ? "0 2px 12px rgba(124,58,237,0.35)" : "none",
              transition: "all 0.15s",
            }}>
            {t.label}
            {t.badge > 0 && (
              <span style={{
                marginLeft: 5, background: "#fb7185", color: "#fff",
                borderRadius: 999, fontSize: 10, fontWeight: 700, padding: "1px 5px",
              }}>{t.badge}</span>
            )}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        {[FRIENDS_TABS.ALL, FRIENDS_TABS.FRIENDS, FRIENDS_TABS.ONLINE].includes(tab) && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--input-bg)", border: "1px solid var(--glass-border)",
            borderRadius: 8, padding: "6px 12px", minWidth: 180,
          }}>
            <span style={{ fontSize: 12, opacity: 0.4 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search"
              style={{
                background: "transparent", border: "none", outline: "none",
                fontFamily: "inherit", fontSize: 13, color: "var(--text)", width: "100%",
              }} />
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Friends list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {tab === FRIENDS_TABS.ADD ? (
            <div style={{ maxWidth: 500 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>
                Add a Friend
              </div>
              <div style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 20, lineHeight: 1.6 }}>
                You can add friends by their exact username. It's case sensitive!
              </div>
              <div style={{
                display: "flex", gap: 10, alignItems: "center",
                background: "var(--input-bg)",
                border: "1.5px solid rgba(124,58,237,0.3)",
                borderRadius: 12, padding: "4px 4px 4px 16px",
                boxShadow: "0 0 0 4px rgba(124,58,237,0.06)",
              }}>
                <input value={addUsername}
                  onChange={e => setAddUsername(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && addUsername.trim()) {
                      onSendReq(addUsername.trim()); setAddUsername("");
                    }
                  }}
                  placeholder="Enter a username"
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    fontFamily: "inherit", fontSize: 14, color: "var(--text)", padding: "8px 0",
                  }} />
                <button
                  disabled={!addUsername.trim()}
                  onClick={() => { onSendReq(addUsername.trim()); setAddUsername(""); }}
                  style={{
                    padding: "9px 18px", borderRadius: 9, border: "none",
                    background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff",
                    fontFamily: "inherit", fontSize: 13, fontWeight: 700,
                    cursor: addUsername.trim() ? "pointer" : "not-allowed",
                    opacity: addUsername.trim() ? 1 : 0.5,
                    boxShadow: "0 2px 12px rgba(124,58,237,0.3)",
                  }}>
                  Send Request
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
                textTransform: "uppercase", color: "rgba(168,85,247,0.6)",
                paddingBottom: 10, borderBottom: "1px solid var(--divider)", marginBottom: 4,
              }}>
                {sectionLabel()}
              </div>

              {list.length === 0 && (
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", paddingTop: 80, gap: 12, color: "var(--text-muted)",
                }}>
                  <div style={{ fontSize: 56, opacity: 0.3 }}>
                    {tab === FRIENDS_TABS.ONLINE ? "😴" : tab === FRIENDS_TABS.FRIENDS ? "👋" : "📭"}
                  </div>
                  <div style={{ fontSize: 14 }}>
                    {tab === FRIENDS_TABS.ONLINE   ? "No one's online right now."
                     : tab === FRIENDS_TABS.FRIENDS ? "No friends yet — add some!"
                     : tab === FRIENDS_TABS.PENDING ? "No pending requests."
                     : "No users found."}
                  </div>
                </div>
              )}

              {list.map((user, i) => (
                <div key={i}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "10px 14px", borderRadius: 12,
                    transition: "all 0.15s", cursor: "default", marginBottom: 2,
                    border: "1px solid transparent",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background     = "rgba(124,58,237,0.08)";
                    e.currentTarget.style.borderColor    = "rgba(124,58,237,0.15)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background  = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                  }}>

                  {/* Avatar */}
                  <div style={{
                    position: "relative", width: 42, height: 42, borderRadius: "50%",
                    background: getAvatarGradient(user), flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, fontWeight: 700, color: "#fff",
                  }}>
                    {user[0]?.toUpperCase()}
                    <div style={{
                      position: "absolute", bottom: 1, right: 1,
                      width: 12, height: 12, borderRadius: "50%",
                      background: onlineUsers.includes(user) ? "#10b981" : "rgba(255,255,255,0.15)",
                      border: "2.5px solid var(--glass2)",
                      boxShadow: onlineUsers.includes(user) ? "0 0 6px #10b981" : "none",
                    }} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{user}</div>
                    <div style={{
                      fontSize: 12, marginTop: 2,
                      color: onlineUsers.includes(user) ? "#10b981" : "var(--text-sub)",
                    }}>
                      {onlineUsers.includes(user) ? "● Active now" : "○ Offline"}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {tab === FRIENDS_TABS.PENDING ? (
                      <>
                        <button onClick={() => onAccept(user)} title="Accept" style={{
                          width: 36, height: 36, borderRadius: "50%", border: "none",
                          background: "rgba(74,222,128,0.15)", color: "#4ade80",
                          fontSize: 16, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>✓</button>
                        <button onClick={() => onRemove(user)} title="Decline" style={{
                          width: 36, height: 36, borderRadius: "50%", border: "none",
                          background: "rgba(251,113,133,0.15)", color: "#fb7185",
                          fontSize: 16, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>✕</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => onDm(user)} title="Message" style={{
                          width: 36, height: 36, borderRadius: "50%", border: "none",
                          background: "rgba(124,58,237,0.12)", color: "#c084fc",
                          fontSize: 17, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.15s",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.25)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "rgba(124,58,237,0.12)"; }}
                        >💬</button>

                        {friends.includes(user) ? (
                          <button onClick={() => onRemove(user)} title="Remove friend" style={{
                            width: 36, height: 36, borderRadius: "50%", border: "none",
                            background: "rgba(251,113,133,0.1)", color: "#fb7185",
                            fontSize: 17, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.15s",
                          }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(251,113,133,0.2)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(251,113,133,0.1)"; }}
                          >⋮</button>
                        ) : friendReqs.includes(user) ? (
                          <button style={{
                            height: 32, padding: "0 12px", borderRadius: 8,
                            border: "1px solid var(--glass-border)", background: "transparent",
                            color: "var(--text-muted)", fontSize: 11, cursor: "default",
                            display: "flex", alignItems: "center",
                          }}>Sent</button>
                        ) : (
                          <button onClick={() => onSendReq(user)} title="Add Friend" style={{
                            height: 32, padding: "0 14px", borderRadius: 8, border: "none",
                            background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff",
                            fontSize: 12, fontWeight: 700, cursor: "pointer",
                            display: "flex", alignItems: "center", transition: "all 0.15s",
                            boxShadow: "0 2px 10px rgba(124,58,237,0.3)", fontFamily: "inherit",
                          }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.5)"; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 10px rgba(124,58,237,0.3)"; }}
                          >+ Add</button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* ── Right panel: Active Now + Cosmos Status ── */}
        <div style={{
          width: 240, borderLeft: "1px solid var(--divider)",
          padding: "20px 16px", flexShrink: 0,
          display: "flex", flexDirection: "column", gap: 20, overflowY: "auto",
        }}>
          {/* Active Now */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
              textTransform: "uppercase", color: "rgba(168,85,247,0.6)", marginBottom: 12,
            }}>Active Now</div>

            {onlineUsers.filter(u => u !== name && friends.includes(u)).length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>🌌</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-sub)", marginBottom: 4 }}>
                  It's quiet for now...
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  When a friend goes active, you'll see them here
                </div>
              </div>
            ) : (
              onlineUsers.filter(u => u !== name && friends.includes(u)).map((u, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "7px 0", borderBottom: "1px solid var(--divider)",
                }}>
                  <div style={{
                    position: "relative", width: 32, height: 32, borderRadius: "50%",
                    background: getAvatarGradient(u), flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, color: "#fff",
                  }}>
                    {u[0]?.toUpperCase()}
                    <div style={{
                      position: "absolute", bottom: 0, right: 0,
                      width: 9, height: 9, borderRadius: "50%",
                      background: "#10b981", border: "2px solid var(--glass2)",
                      boxShadow: "0 0 6px #10b981",
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 12, fontWeight: 600, color: "var(--text)",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>{u}</div>
                    <div style={{ fontSize: 11, color: "#10b981" }}>Active now</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cosmos Status */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
              textTransform: "uppercase", color: "rgba(168,85,247,0.6)", marginBottom: 12,
            }}>Cosmos Status</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { color: "#10b981", text: `${onlineUsers.filter(u => u !== name).length} in your orbit` },
                { color: "#a855f7", text: `${friends.length} friends total` },
                { color: "#fb7185", text: `${incomingReqs.length} pending requests` },
              ].map(({ color, text }, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 10px", borderRadius: 8,
                  background: `${color}0f`,
                  border: `1px solid ${color}1f`,
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: color, boxShadow: `0 0 6px ${color}`, flexShrink: 0,
                  }} />
                  <div style={{ fontSize: 12, color: "var(--text-sub)" }}>
                    <span style={{ fontWeight: 700, color: "var(--text)" }}>
                      {text.split(" ")[0]}
                    </span>{" "}
                    {text.split(" ").slice(1).join(" ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}