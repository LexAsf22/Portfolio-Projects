// features/modals/SettingsModal.jsx
// Full settings panel — sidebar nav + tabbed content area.
// Tabs: account, profile, privacy, appearance, notifications, keybinds, danger.

import React, { useState, useRef } from "react";

import {
  updateProfile, uploadAvatar,
  updateEmail, changeUsername,
  sendVerificationCode, changePassword,
  deleteAccount,
}                             from "../../shared/services/apiService";
import { resolveUrl }         from "../../shared/utils/formatters";
import {
  inputStyle, sectionLabelStyle, msgStyle, msgIcon,
  toggleTrackStyle, toggleThumbStyle, primaryBtnStyle,
  isValidEmail,
}                             from "./modal.utils";
import { SETTINGS_TABS }      from "./modal.constants";

// ─── Sub-components (private to this file) ────────────────────────────────────

function Toggle({ on, onChange }) {
  return (
    <button style={toggleTrackStyle(on)} onClick={() => onChange(!on)}>
      <div style={toggleThumbStyle(on)} />
    </button>
  );
}

function Row({ label, desc, children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 0", borderBottom: "1px solid var(--divider)", gap: 16,
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: "var(--text-sub)", marginTop: 3 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );
}

function KeybindRow({ label, hint, value, onChange, style: rowStyle }) {
  const [listening, setListening] = useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 16px", ...rowStyle,
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{label}</div>
        {hint && <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{hint}</div>}
      </div>
      <button
        style={{
          minWidth: 80, padding: "6px 14px", borderRadius: 8,
          border: listening ? "1px solid var(--accent)" : "1px solid var(--glass-border)",
          background: listening ? "var(--accent-soft)" : "var(--input-bg)",
          color: listening ? "var(--accent)" : "var(--text)",
          fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "monospace",
          letterSpacing: "0.5px",
        }}
        onClick={() => setListening(true)}
        onBlur={() => setListening(false)}
        onKeyDown={e => {
          if (!listening) return;
          e.preventDefault(); e.stopPropagation();
          const key = e.key === " " ? "Space" : e.key;
          if (key !== "Tab") { onChange(key); setListening(false); }
        }}
      >
        {listening ? "Press a key…" : (value || "—")}
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SettingsModal({
  onClose, tab, setTab,
  dark, setDark,
  authToken, authUser, myProfile, onUpdateProfile,
  fontSize, setFontSize,
  bubbleStyle, setBubbleStyle,
  notifSound, setNotifSound,
  compactMode, setCompactMode,
  privacyDm, setPrivacyDm,
  privacyFriend, setPrivacyFriend,
  onLogout, onEndCall,
  keybinds, saveKeybinds,
}) {
  // ── Local form state ──────────────────────────────────────────────────────
  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [pwMsg,      setPwMsg]      = useState(null);
  const [emailMsg,   setEmailMsg]   = useState(null);
  const [email,      setEmail]      = useState(myProfile?.email || "");
  const [displayName,setDisplayName]= useState(myProfile?.displayName || "");
  const [bio,        setBio]        = useState(myProfile?.bio || "");
  const [profileMsg, setProfileMsg] = useState(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [codeSent,   setCodeSent]   = useState(false);
  const [sendingCode,setSendingCode]= useState(false);

  const fileRef = useRef(null);

  // ── Shared style shortcuts ────────────────────────────────────────────────
  const label    = sectionLabelStyle();
  const saveBtn  = { ...primaryBtnStyle(true), padding: "10px 22px", fontSize: 13 };
  const sTitle   = { fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4, marginTop: 24 };
  const sDesc    = { fontSize: 13, color: "var(--text-sub)", marginBottom: 16 };

  const avatarSrc = myProfile?.avatarUrl ? resolveUrl(myProfile.avatarUrl) : null;

  // ── API actions ───────────────────────────────────────────────────────────
  const handleSendCode = async () => {
    setSendingCode(true); setPwMsg(null);
    try {
      const data = await sendVerificationCode(authToken);
      setCodeSent(true);
      setPwMsg({ ok: true, text: data.message });
    } catch (err) {
      setPwMsg({ ok: false, text: err.message });
    }
    setSendingCode(false);
  };

  const handleChangePassword = async () => {
    if (!verifyCode || !newPw || !confirmPw) {
      setPwMsg({ ok: false, text: "Fill in all fields" }); return;
    }
    if (newPw !== confirmPw) {
      setPwMsg({ ok: false, text: "New passwords do not match" }); return;
    }
    if (newPw.length < 6) {
      setPwMsg({ ok: false, text: "Password must be at least 6 characters" }); return;
    }
    try {
      await changePassword(authToken, { code: verifyCode, newPassword: newPw });
      setPwMsg({ ok: true, text: "Password changed successfully!" });
      setVerifyCode(""); setNewPw(""); setConfirmPw(""); setCodeSent(false);
    } catch (err) {
      setPwMsg({ ok: false, text: err.message });
    }
  };

  const handleSaveEmail = async () => {
    setEmailMsg(null);
    if (!email.trim()) { setEmailMsg({ ok: false, text: "Email cannot be empty." }); return; }
    if (!isValidEmail(email)) { setEmailMsg({ ok: false, text: "Please enter a valid email address." }); return; }
    try {
      await updateEmail(authToken, email);
      setEmailMsg({ ok: true, text: "Email updated!" });
      onUpdateProfile({ email });
    } catch (err) {
      setEmailMsg({ ok: false, text: err.message });
    }
  };

  const handleSaveProfile = async () => {
    try {
      const data = await updateProfile(authToken, { displayName, bio });
      onUpdateProfile(data);
      setProfileMsg({ ok: true, text: "Profile saved!" });
    } catch (err) {
      setProfileMsg({ ok: false, text: err.message });
    }
  };

  const handleUploadAvatar = async (file) => {
    try {
      const data = await uploadAvatar(authToken, file);
      onUpdateProfile({ avatarUrl: data.avatarUrl });
    } catch { /* ignore */ }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Permanently delete your account? This CANNOT be undone.")) return;
    if (window.prompt('Type "DELETE" to confirm:') !== "DELETE") return;
    try {
      await deleteAccount(authToken);
      onEndCall?.(); onLogout();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleChangeUsername = async () => {
    setPwMsg(null);
    try {
      await changeUsername(authToken, currentPw);
      setPwMsg({ ok: true, text: "Username changed! Please log in again." });
      setTimeout(() => { onEndCall?.(); onLogout(); }, 1500);
    } catch (err) {
      setPwMsg({ ok: false, text: err.message });
    }
  };

  // ── Tab definitions ───────────────────────────────────────────────────────
  const tabs = [
    { id: SETTINGS_TABS.ACCOUNT,      label: "👤 My Account",       group: "USER SETTINGS" },
    { id: SETTINGS_TABS.PROFILE,      label: "🪪 Profile",           group: "USER SETTINGS" },
    { id: SETTINGS_TABS.PRIVACY,      label: "🔒 Privacy & Safety",  group: "USER SETTINGS" },
    { id: SETTINGS_TABS.APPEARANCE,   label: "🎨 Appearance",        group: "APP SETTINGS"  },
    { id: SETTINGS_TABS.NOTIFICATIONS,label: "🔔 Notifications",     group: "APP SETTINGS"  },
    { id: SETTINGS_TABS.KEYBINDS,     label: "⌨️ Keybinds",          group: "APP SETTINGS"  },
    { id: SETTINGS_TABS.DANGER,       label: "⚠️ Danger Zone",       group: "ACCOUNT"       },
  ];
  const groups = [...new Set(tabs.map(t => t.group))];

  // ── Tab content renderer ──────────────────────────────────────────────────
  const renderContent = () => {

    // ── account-email sub-tab ──────────────────────────────────────────────
    if (tab === SETTINGS_TABS.ACCOUNT_EMAIL) return (
      <div>
        <div style={sTitle}>Update Email Address</div>
        <p style={sDesc}>This email is used for password reset verification codes.</p>
        <div style={{ background: "var(--glass2)", borderRadius: 10, padding: 16 }}>
          {emailMsg && <div style={msgStyle(emailMsg.ok)}>{msgIcon(emailMsg.ok)} {emailMsg.text}</div>}
          <label style={label}>New Email Address</label>
          <input type="email" style={{ ...inputStyle(), marginBottom: 4 }}
            value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button style={saveBtn} onClick={handleSaveEmail}>Save Email</button>
            <button style={{ ...saveBtn, background: "var(--btn-bg)", color: "var(--text-sub)" }}
              onClick={() => setTab(SETTINGS_TABS.ACCOUNT)}>Cancel</button>
          </div>
        </div>
      </div>
    );

    // ── account-username sub-tab ───────────────────────────────────────────
    if (tab === SETTINGS_TABS.ACCOUNT_USERNAME) return (
      <div>
        <div style={sTitle}>Change Username</div>
        <p style={sDesc}>Choose a new unique username. You will be issued a new login token.</p>
        <div style={{ background: "var(--glass2)", borderRadius: 10, padding: 16 }}>
          {pwMsg && <div style={msgStyle(pwMsg.ok)}>{msgIcon(pwMsg.ok)} {pwMsg.text}</div>}
          <label style={label}>New Username</label>
          <input style={{ ...inputStyle(), marginBottom: 4 }}
            value={currentPw} onChange={e => setCurrentPw(e.target.value)}
            placeholder="Enter new username (3–32 chars, letters/numbers/_/.)" />
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button style={saveBtn} onClick={handleChangeUsername}>Save Username</button>
            <button style={{ ...saveBtn, background: "var(--btn-bg)", color: "var(--text-sub)" }}
              onClick={() => setTab(SETTINGS_TABS.ACCOUNT)}>Cancel</button>
          </div>
        </div>
      </div>
    );

    // ── account tab ────────────────────────────────────────────────────────
    if (tab === SETTINGS_TABS.ACCOUNT) return (
      <div>
        {/* Profile card banner */}
        <div style={{
          background: "var(--bubble-me)", borderRadius: 12,
          padding: "40px 20px 20px", marginBottom: 24,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(196,109,255,0.8),rgba(123,140,255,0.8))" }} />
          <div style={{ position: "relative", display: "flex", alignItems: "flex-end", gap: 16 }}>
            <div style={{ position: "relative", cursor: "pointer" }} onClick={() => fileRef.current?.click()}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                border: "4px solid var(--glass2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, fontWeight: 700, color: "#fff", overflow: "hidden",
              }}>
                {avatarSrc
                  ? <img src={avatarSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : authUser?.[0]?.toUpperCase()
                }
              </div>
              <div style={{
                position: "absolute", bottom: 2, right: 2,
                width: 22, height: 22, borderRadius: "50%",
                background: "var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 12, border: "2px solid var(--glass2)",
              }}>✏️</div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => { if (e.target.files[0]) handleUploadAvatar(e.target.files[0]); }} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>
                {myProfile?.displayName || authUser}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>@{authUser}</div>
            </div>
          </div>
        </div>

        <div style={sTitle}>Account Information</div>
        <div style={{ background: "var(--glass2)", borderRadius: 10, padding: "0 16px", marginBottom: 20 }}>
          <Row label="Username" desc={`@${authUser}`}>
            <button onClick={() => setTab(SETTINGS_TABS.ACCOUNT_USERNAME)}
              style={{ ...saveBtn, fontSize: 12, padding: "6px 14px" }}>Change</button>
          </Row>
          <Row label="Email" desc={myProfile?.email || "No email set"}>
            <button onClick={() => setTab(SETTINGS_TABS.ACCOUNT_EMAIL)}
              style={{ ...saveBtn, fontSize: 12, padding: "6px 14px" }}>Edit</button>
          </Row>
        </div>

        <div style={sTitle}>Change Password</div>
        <div style={{ background: "var(--glass2)", borderRadius: 10, padding: 16, marginBottom: 20 }}>
          {pwMsg && <div style={msgStyle(pwMsg.ok)}>{msgIcon(pwMsg.ok)} {pwMsg.text}</div>}
          {!codeSent ? (
            <>
              <div style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 14, lineHeight: 1.6 }}>
                A 6-digit verification code will be sent to your registered email address.
                {!myProfile?.email && <span style={{ color: "#fb7185" }}> You need to add an email address first.</span>}
              </div>
              <button
                style={{ ...saveBtn, opacity: myProfile?.email ? 1 : 0.5, cursor: myProfile?.email ? "pointer" : "not-allowed" }}
                onClick={myProfile?.email ? handleSendCode : undefined}
                disabled={sendingCode}
              >
                {sendingCode ? "Sending…" : "Send Verification Code"}
              </button>
            </>
          ) : (
            <>
              <label style={label}>Verification Code</label>
              <input style={inputStyle()} value={verifyCode}
                onChange={e => setVerifyCode(e.target.value)} placeholder="Enter 6-digit code" maxLength={6} />
              <label style={{ ...label, marginTop: 10 }}>New Password</label>
              <input type="password" style={inputStyle()} value={newPw}
                onChange={e => setNewPw(e.target.value)} placeholder="Enter new password" />
              <label style={{ ...label, marginTop: 10 }}>Confirm New Password</label>
              <input type="password" style={{ ...inputStyle(), marginBottom: 14 }} value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)} placeholder="Confirm new password" />
              <div style={{ display: "flex", gap: 10 }}>
                <button style={saveBtn} onClick={handleChangePassword}>Change Password</button>
                <button style={{ ...saveBtn, background: "var(--btn-bg)", color: "var(--text-sub)" }}
                  onClick={() => { setCodeSent(false); setPwMsg(null); setVerifyCode(""); }}>
                  Resend Code
                </button>
              </div>
            </>
          )}
        </div>

        <div style={sTitle}>Email Address</div>
        <div style={{ background: "var(--glass2)", borderRadius: 10, padding: 16 }}>
          {emailMsg && <div style={msgStyle(emailMsg.ok)}>{msgIcon(emailMsg.ok)} {emailMsg.text}</div>}
          <label style={label}>Email</label>
          <input type="email" style={inputStyle()} value={email}
            onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
          <button style={{ ...saveBtn, marginTop: 10 }} onClick={handleSaveEmail}>Save Email</button>
        </div>
      </div>
    );

    // ── profile tab ────────────────────────────────────────────────────────
    if (tab === SETTINGS_TABS.PROFILE) return (
      <div>
        <div style={sTitle}>Display Name</div>
        <p style={sDesc}>This is how others see you in chat.</p>
        {profileMsg && <div style={msgStyle(profileMsg.ok)}>{msgIcon(profileMsg.ok)} {profileMsg.text}</div>}
        <div style={{ background: "var(--glass2)", borderRadius: 10, padding: 16, marginBottom: 20 }}>
          <label style={label}>Display Name</label>
          <input style={inputStyle()} value={displayName}
            onChange={e => setDisplayName(e.target.value)} placeholder="Your display name" />
          <label style={{ ...label, marginTop: 10 }}>Bio</label>
          <textarea style={{ ...inputStyle(), height: 80, resize: "none" }} value={bio}
            onChange={e => setBio(e.target.value)} placeholder="Tell others about yourself" />
          <button style={{ ...saveBtn, marginTop: 10 }} onClick={handleSaveProfile}>Save Profile</button>
        </div>

        <div style={sTitle}>Avatar</div>
        <div style={{
          background: "var(--glass2)", borderRadius: 10, padding: 16,
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "var(--bubble-me)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, fontWeight: 700, color: "#fff", overflow: "hidden", flexShrink: 0,
          }}>
            {avatarSrc
              ? <img src={avatarSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : authUser?.[0]?.toUpperCase()
            }
          </div>
          <div>
            <div style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 10 }}>
              JPG, GIF or PNG. Max size 8MB.
            </div>
            <button style={saveBtn} onClick={() => fileRef.current?.click()}>Change Avatar</button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => { if (e.target.files[0]) handleUploadAvatar(e.target.files[0]); }} />
          </div>
        </div>
      </div>
    );

    // ── appearance tab ─────────────────────────────────────────────────────
    if (tab === SETTINGS_TABS.APPEARANCE) return (
      <div>
        <div style={sTitle}>Theme</div>
        <p style={sDesc}>Choose how CosmoChat looks to you.</p>
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          {[{ id: "dark", label: "🌙 Dark" }, { id: "light", label: "☀️ Light" }].map(t => (
            <button key={t.id} onClick={() => setDark(t.id === "dark")}
              style={{
                flex: 1, padding: "16px", borderRadius: 12,
                border: `2px solid ${(dark ? "dark" : "light") === t.id ? "var(--accent)" : "var(--glass-border)"}`,
                background: (dark ? "dark" : "light") === t.id ? "var(--accent-soft)" : "var(--glass2)",
                color: "var(--text)", fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={sTitle}>Font Size</div>
        <p style={sDesc}>Scale the chat text to your preference.</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {["small", "medium", "large"].map(s => (
            <button key={s} onClick={() => setFontSize(s)}
              style={{
                flex: 1, padding: "12px", borderRadius: 10, textTransform: "capitalize",
                border: `2px solid ${fontSize === s ? "var(--accent)" : "var(--glass-border)"}`,
                background: fontSize === s ? "var(--accent-soft)" : "var(--glass2)",
                color: "var(--text)", fontFamily: "inherit",
                fontSize: s === "small" ? 12 : s === "medium" ? 14 : 16,
                fontWeight: 600, cursor: "pointer",
              }}>
              {s}
            </button>
          ))}
        </div>

        <div style={sTitle}>Message Bubble Style</div>
        <p style={sDesc}>Change how message bubbles look.</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {["rounded", "sharp", "minimal"].map(s => (
            <button key={s} onClick={() => setBubbleStyle(s)}
              style={{
                flex: 1, padding: "12px", borderRadius: 10, textTransform: "capitalize",
                border: `2px solid ${bubbleStyle === s ? "var(--accent)" : "var(--glass-border)"}`,
                background: bubbleStyle === s ? "var(--accent-soft)" : "var(--glass2)",
                color: "var(--text)", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>
              {s}
            </button>
          ))}
        </div>

        <div style={{ background: "var(--glass2)", borderRadius: 10, padding: "0 16px" }}>
          <Row label="Compact Mode" desc="Reduce spacing between messages">
            <Toggle on={compactMode} onChange={setCompactMode} />
          </Row>
        </div>
      </div>
    );

    // ── keybinds tab ───────────────────────────────────────────────────────
    if (tab === SETTINGS_TABS.KEYBINDS) {
      const actions = [
        { key: "sendMessage",  label: "Send message",     hint: "Enter / Shift+Enter for newline" },
        { key: "toggleMute",   label: "Mute/unmute mic",  hint: "In call" },
        { key: "toggleCamera", label: "Toggle camera",    hint: "In video call" },
        { key: "leaveCall",    label: "Leave call",       hint: "" },
        { key: "closeModal",   label: "Close modal",      hint: "" },
        { key: "openSettings", label: "Open settings",    hint: "When not typing" },
      ];
      return (
        <div>
          <div style={sTitle}>Keyboard Shortcuts</div>
          <p style={sDesc}>Click a binding and press a key to change it.</p>
          <div style={{ background: "var(--glass2)", borderRadius: 10, overflow: "hidden" }}>
            {actions.map(({ key, label: lbl, hint }, i) => (
              <KeybindRow
                key={key} label={lbl} hint={hint} value={keybinds[key]}
                onChange={newKey => saveKeybinds({ ...keybinds, [key]: newKey })}
                style={{ borderBottom: i < actions.length - 1 ? "1px solid var(--divider)" : "none" }}
              />
            ))}
          </div>
          <button
            style={{ ...saveBtn, marginTop: 16, background: "rgba(255,255,255,0.08)" }}
            onClick={() => saveKeybinds({
              sendMessage: "Enter", toggleMute: "m", toggleCamera: "v",
              leaveCall: "Escape", closeModal: "Escape", openSettings: ",",
            })}
          >
            Reset to defaults
          </button>
        </div>
      );
    }

    // ── notifications tab ──────────────────────────────────────────────────
    if (tab === SETTINGS_TABS.NOTIFICATIONS) return (
      <div>
        <div style={sTitle}>Notifications</div>
        <p style={sDesc}>Control how and when you get notified.</p>
        <div style={{ background: "var(--glass2)", borderRadius: 10, padding: "0 16px" }}>
          <Row label="Message Sound" desc="Play a sound when a message arrives">
            <Toggle on={notifSound} onChange={setNotifSound} />
          </Row>
          <Row label="Desktop Notifications" desc="Show notifications outside the browser">
            <button style={{ ...saveBtn, fontSize: 12, padding: "6px 14px" }}
              onClick={() => Notification.requestPermission()}>
              {Notification.permission === "granted" ? "✅ Enabled" : "Enable"}
            </button>
          </Row>
        </div>
      </div>
    );

    // ── privacy tab ────────────────────────────────────────────────────────
    if (tab === SETTINGS_TABS.PRIVACY) return (
      <div>
        <div style={sTitle}>Privacy & Safety</div>
        <p style={sDesc}>Control who can interact with you.</p>
        <div style={{ background: "var(--glass2)", borderRadius: 10, padding: "0 16px", marginBottom: 20 }}>
          <Row label="Who can DM me" desc="Control who can send you direct messages">
            <select value={privacyDm} onChange={e => setPrivacyDm(e.target.value)}
              style={{
                background: "var(--input-bg)", border: "1.5px solid var(--glass-border)",
                borderRadius: 8, padding: "6px 12px", color: "var(--text)",
                fontFamily: "inherit", fontSize: 13, outline: "none",
              }}>
              <option value="everyone">Everyone</option>
              <option value="friends">Friends only</option>
              <option value="nobody">Nobody</option>
            </select>
          </Row>
          <Row label="Who can send friend requests" desc="Control who can add you as a friend">
            <select value={privacyFriend} onChange={e => setPrivacyFriend(e.target.value)}
              style={{
                background: "var(--input-bg)", border: "1.5px solid var(--glass-border)",
                borderRadius: 8, padding: "6px 12px", color: "var(--text)",
                fontFamily: "inherit", fontSize: 13, outline: "none",
              }}>
              <option value="everyone">Everyone</option>
              <option value="nobody">Nobody</option>
            </select>
          </Row>
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
          ⚠️ Privacy settings are stored locally and enforced on the frontend only. Full server-side enforcement coming soon.
        </div>
      </div>
    );

    // ── danger tab ─────────────────────────────────────────────────────────
    if (tab === SETTINGS_TABS.DANGER) return (
      <div>
        <div style={{ ...sTitle, color: "#fb7185" }}>⚠️ Danger Zone</div>
        <p style={sDesc}>These actions are irreversible. Please be careful.</p>

        <div style={{
          background: "rgba(251,113,133,0.07)",
          border: "1px solid rgba(251,113,133,0.25)",
          borderRadius: 10, padding: 20, marginBottom: 16,
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fb7185", marginBottom: 6 }}>Log Out</div>
          <div style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 14 }}>
            Sign out of your account on this device.
          </div>
          <button
            onClick={() => { onEndCall?.(); onLogout(); }}
            style={{
              padding: "10px 22px", borderRadius: 10,
              border: "1px solid rgba(251,113,133,0.3)",
              background: "rgba(251,113,133,0.15)", color: "#fb7185",
              fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}
          >
            Log Out
          </button>
        </div>

        <div style={{
          background: "rgba(251,113,133,0.07)",
          border: "1px solid rgba(251,113,133,0.25)",
          borderRadius: 10, padding: 20,
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fb7185", marginBottom: 6 }}>Delete Account</div>
          <div style={{ fontSize: 13, color: "var(--text-sub)", marginBottom: 14 }}>
            Permanently delete your account and all your data. This cannot be undone.
          </div>
          <button
            onClick={handleDeleteAccount}
            style={{
              padding: "10px 22px", borderRadius: 10,
              border: "1px solid rgba(251,113,133,0.4)",
              background: "#fb7185", color: "#fff",
              fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}
          >
            Delete Account
          </button>
        </div>
      </div>
    );
  };

  // ── Layout ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 400,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "stretch", justifyContent: "center",
      animation: "fadeIn 0.15s",
    }}>
      <div style={{
        display: "flex", width: "100%", maxWidth: 900,
        margin: "auto", height: "min(680px, 90vh)",
        background: "var(--glass2)", borderRadius: 16, overflow: "hidden",
        border: "1px solid var(--glass-border)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
      }}>
        {/* Sidebar nav */}
        <div style={{
          width: 220,
          background: dark ? "rgba(10,7,22,0.95)" : "rgba(240,236,255,0.98)",
          borderRight: "1px solid var(--divider)",
          display: "flex", flexDirection: "column",
          padding: "20px 8px", overflowY: "auto", flexShrink: 0,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
            textTransform: "uppercase", color: "var(--text-muted)",
            padding: "6px 10px 4px", marginBottom: 2,
          }}>
            Settings
          </div>

          {groups.map(group => (
            <div key={group}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 1.2,
                textTransform: "uppercase", color: "var(--text-muted)",
                padding: "14px 10px 4px",
              }}>
                {group}
              </div>
              {tabs.filter(t => t.group === group).map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "9px 12px", borderRadius: 8, border: "none",
                    background: tab === t.id ? "var(--accent-soft)" : "transparent",
                    color: tab === t.id ? "var(--accent)" : "var(--text-sub)",
                    fontFamily: "inherit", fontSize: 13,
                    fontWeight: tab === t.id ? 700 : 500,
                    cursor: "pointer", marginBottom: 1, transition: "all 0.15s",
                  }}>
                  {t.label}
                </button>
              ))}
            </div>
          ))}

          <div style={{ flex: 1 }} />
          <button onClick={onClose}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "9px 12px", borderRadius: 8, border: "none",
              background: "transparent", color: "var(--text-muted)",
              fontFamily: "inherit", fontSize: 13, cursor: "pointer", marginTop: 8,
            }}>
            ✕ Close Settings
          </button>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}