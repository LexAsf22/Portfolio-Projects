// src/components/AuthModal.jsx
// Combined login + register modal. Shown over the landing page when the user
// clicks "Sign in" or "Get started free".
// Calls /auth/login and /auth/register, then passes { token, username }
// up to App.jsx via onAuth().

import { useState } from "react";

const BASE_URL = "http://192.168.108.132:8080";

export default function AuthModal({ dark, initialMode, onClose, onAuth }) {
  const [mode,     setMode]     = useState(initialMode || "login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [email,    setEmail]    = useState("");
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [loading,  setLoading]  = useState(false);

  const reset = () => { setError(""); setSuccess(""); setPassword(""); setConfirm(""); };

  const switchMode = (m) => { setMode(m); reset(); };

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) { setError("Please fill in all fields"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const res  = await fetch(`${BASE_URL}/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Invalid credentials"); setLoading(false); return; }
      onAuth({ token: data.token, username: data.username });
    } catch {
      setError("Cannot connect to server");
    }
    setLoading(false);
  };

  // ── Register ───────────────────────────────────────────────────────────────
  const handleRegister = async () => {
    if (!username.trim() || !password.trim() || !confirm.trim()) {
      setError("Please fill in all fields"); return;
    }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters"); return; }

    setLoading(true); setError(""); setSuccess("");
    try {
      const res  = await fetch(`${BASE_URL}/auth/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username: username.trim(), password, email: email.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); setLoading(false); return; }
      // Switch to login tab after successful registration
      setSuccess("Account created! Please sign in.");
      setPassword(""); setConfirm("");
      setMode("login");
    } catch {
      setError("Cannot connect to server");
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") mode === "login" ? handleLogin() : handleRegister();
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose}>✕</button>

        <div className="auth-logo-wrap">🌌</div>
        <h2 className="auth-title">
          {mode === "login" ? "Welcome back" : "Join CosmoChat"}
        </h2>
        <p className="auth-sub">
          {mode === "login"
            ? "Sign in to continue your conversations"
            : "Create your free account and start chatting"}
        </p>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => switchMode("login")}
          >Sign In</button>
          <button
            className={`auth-tab ${mode === "register" ? "active" : ""}`}
            onClick={() => switchMode("register")}
          >Register</button>
        </div>

        {error   && <div className="auth-error">⚠️ {error}</div>}
        {success && <div className="auth-success">✅ {success}</div>}

        {/* Username */}
        <div className="auth-field">
          <label className="auth-label">Username</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon">👤</span>
            <input
              className="auth-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={handleKey}
              placeholder="your_username"
              autoFocus
            />
          </div>
        </div>

        {/* Password */}
        <div className="auth-field">
          <label className="auth-label">Password</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon">🔒</span>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKey}
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Register-only fields */}
        {mode === "register" && (
          <>
            <div className="auth-field">
              <label className="auth-label">Email (optional)</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">📧</span>
                <input
                  className="auth-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="auth-field">
              <label className="auth-label">Confirm Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  className="auth-input"
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </>
        )}

        {/* Submit */}
        <button
          className="auth-submit"
          onClick={mode === "login" ? handleLogin : handleRegister}
          disabled={loading}
        >
          {loading
            ? <><div className="spinner" /> Please wait…</>
            : mode === "login" ? "Sign in →" : "Create account →"}
        </button>

        {mode === "register" && (
          <p className="auth-terms">
            By creating an account you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        )}
      </div>
    </div>
  );
}