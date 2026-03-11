import { useState } from "react";
import WebSocketClient from "./WebSocketClient";

const BASE_URL = "http://192.168.100.127:8080";

const buildCSS = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body, #root { width:100%; height:100%; overflow:hidden; font-family:'Plus Jakarta Sans',sans-serif; }

  :root {
    --accent: #c46dff;
    --accent-glow: rgba(196,109,255,0.30);
    --accent-soft: rgba(196,109,255,0.13);
    --bubble-me: linear-gradient(135deg,#c46dff 0%,#7b8cff 100%);
    --out: cubic-bezier(0.16,1,0.3,1);
    --spring: cubic-bezier(0.34,1.56,0.64,1);
    --glass2:       ${dark ? "rgba(15,10,32,0.78)"      : "rgba(255,255,255,0.88)"};
    --glass-border: ${dark ? "rgba(255,255,255,0.09)"   : "rgba(160,130,210,0.30)"};
    --text:         ${dark ? "#ede8ff"                  : "#160830"};
    --text-sub:     ${dark ? "#9080b8"                  : "#5a3e88"};
    --text-muted:   ${dark ? "#4e4268"                  : "#9980bb"};
    --input-bg:     ${dark ? "rgba(18,12,38,0.72)"      : "rgba(255,255,255,0.75)"};
  }

  @keyframes riseUp {
    from { opacity:0; transform:translateY(24px) scale(0.97); }
    to   { opacity:1; transform:none; }
  }

  .auth-page {
    position:fixed; inset:0; z-index:1;
    display:flex; align-items:center; justify-content:center; padding:14px;
  }
  .auth-card {
    width:440px; background:var(--glass2);
    backdrop-filter:blur(32px) saturate(160%);
    border:1px solid var(--glass-border); border-radius:28px;
    padding:54px 46px 50px; text-align:center;
    box-shadow:0 32px 80px rgba(0,0,0,0.36);
    animation:riseUp 0.45s var(--out) forwards;
  }
  .auth-logo {
    width:70px; height:70px; border-radius:22px;
    background:var(--bubble-me); margin:0 auto 26px;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 8px 28px var(--accent-glow); font-size:28px;
  }
  .auth-title { font-size:26px; font-weight:700; letter-spacing:-0.6px; color:var(--text); margin-bottom:7px; }
  .auth-sub   { font-size:14px; color:var(--text-sub); margin-bottom:32px; line-height:1.65; }
  .auth-label {
    display:block; text-align:left; font-size:10.5px; font-weight:700;
    letter-spacing:1px; text-transform:uppercase; color:var(--text-muted); margin-bottom:7px;
  }
  .auth-input {
    width:100%; background:var(--input-bg);
    border:1.5px solid var(--glass-border); border-radius:14px;
    padding:14px 17px; font-family:inherit; font-size:15px;
    color:var(--text); outline:none;
    transition:border-color 0.2s, box-shadow 0.2s; margin-bottom:14px;
  }
  .auth-input::placeholder { color:var(--text-muted); }
  .auth-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft); }
  .auth-btn {
    width:100%; background:var(--bubble-me); color:#fff; border:none;
    border-radius:14px; padding:14px; font-family:inherit;
    font-size:15px; font-weight:700; cursor:pointer;
    box-shadow:0 6px 24px var(--accent-glow);
    transition:transform 0.15s, opacity 0.15s; margin-bottom:12px;
  }
  .auth-btn:hover  { transform:translateY(-2px); opacity:0.92; }
  .auth-btn:active { transform:none; }
  .auth-btn.secondary {
    background:transparent; color:var(--accent);
    border:1.5px solid var(--glass-border); box-shadow:none;
  }
  .auth-btn.secondary:hover { background:var(--accent-soft); }
  .auth-error {
    font-size:13px; color:#fb7185; margin-bottom:14px;
    padding:10px 14px; background:rgba(251,113,133,0.10);
    border-radius:10px; border:1px solid rgba(251,113,133,0.25);
  }
  .auth-switch { font-size:13px; color:var(--text-sub); margin-top:6px; }
  .auth-switch button {
    background:none; border:none; color:var(--accent);
    font-weight:700; cursor:pointer; font-family:inherit; font-size:13px;
  }
`;

function StarBackground({ dark }) {
  return (
    <canvas
      ref={el => {
        if (!el) return;
        const ctx = el.getContext("2d");
        let W, H, t = 0, raf;
        const resize = () => { W = el.width = window.innerWidth; H = el.height = window.innerHeight; };
        resize();
        window.addEventListener("resize", resize);
        const stars = Array.from({ length: 300 }, () => ({
          x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + 0.2,
          spd: Math.random() * 0.0001 + 0.00003, op: Math.random() * 0.75 + 0.25,
          tw: Math.random() * 0.025 + 0.004, twOff: Math.random() * Math.PI * 2,
        }));
        const draw = () => {
          t += 0.01;
          if (dark) {
            ctx.fillStyle = "#03030a"; ctx.fillRect(0, 0, W, H);
            stars.forEach(s => {
              s.x += s.spd; if (s.x > 1) s.x -= 1;
              const a = s.op * (0.35 + 0.65 * Math.sin(t * s.tw * 60 + s.twOff));
              ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(215,228,255,${a})`; ctx.fill();
            });
          } else {
            const sky = ctx.createLinearGradient(0, 0, 0, H);
            sky.addColorStop(0, "#2196f3"); sky.addColorStop(1, "#e1f5fe");
            ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
          }
          raf = requestAnimationFrame(draw);
        };
        draw();
        el._cleanup = () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
      }}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}
    />
  );
}

export default function App() {
  const [dark,     setDark]     = useState(true);
  const [mode,     setMode]     = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [auth,     setAuth]     = useState(null);

  const reset = () => { setError(""); setPassword(""); setConfirm(""); };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) { setError("Please fill in all fields"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Invalid credentials"); setLoading(false); return; }
      setAuth({ token: data.token, username: data.username });
    } catch {
      setError("Cannot connect to server");
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!username.trim() || !password.trim() || !confirm.trim()) { setError("Please fill in all fields"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); setLoading(false); return; }
      setAuth({ token: data.token, username: data.username });
    } catch {
      setError("Cannot connect to server");
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") mode === "login" ? handleLogin() : handleRegister();
  };

  if (auth) {
    return <WebSocketClient authUser={auth.username} authToken={auth.token} onLogout={() => setAuth(null)} />;
  }

  return (
    <>
      <style>{buildCSS(dark)}</style>
      <StarBackground dark={dark} />

      <button onClick={() => setDark(d => !d)} style={{
        position: "fixed", top: 18, right: 18, zIndex: 10,
        width: 44, height: 26, border: "none", cursor: "pointer", padding: 0,
        borderRadius: 999,
        background: dark ? "rgba(30,18,55,0.85)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(14px)",
        outline: `1.5px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(140,100,200,0.35)"}`,
        boxShadow: "0 3px 14px rgba(0,0,0,0.20)",
      }}>
        <div style={{
          position: "absolute", top: 3, left: dark ? 21 : 3,
          width: 20, height: 20, borderRadius: "50%",
          background: dark ? "#c46dff" : "#ffe066",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, transition: "left 0.3s",
        }}>
          {dark ? "🌙" : "☀️"}
        </div>
      </button>

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">💬</div>
          <h1 className="auth-title">{mode === "login" ? "Welcome back" : "Create account"}</h1>
          <p className="auth-sub">
            {mode === "login"
              ? "Sign in to continue your conversations"
              : "Join and start chatting instantly"}
          </p>

          {error && <div className="auth-error">{error}</div>}

          <label className="auth-label">Username</label>
          <input className="auth-input" value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. alex_rivera" autoFocus />

          <label className="auth-label">Password</label>
          <input className="auth-input" type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="••••••••" />

          {mode === "register" && (
            <>
              <label className="auth-label">Confirm Password</label>
              <input className="auth-input" type="password" value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••" />
            </>
          )}

          <button className="auth-btn"
            onClick={mode === "login" ? handleLogin : handleRegister}
            disabled={loading}>
            {loading ? "Please wait…" : mode === "login" ? "Sign in →" : "Create account →"}
          </button>

          <div className="auth-switch">
            {mode === "login" ? (
              <>Don't have an account?{" "}
                <button onClick={() => { setMode("register"); reset(); }}>Register</button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => { setMode("login"); reset(); }}>Sign in</button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}