// src/pages/LandingPage.jsx
// Full marketing / landing page shown to unauthenticated visitors.
// Owns: CSS variables, nav, hero, stats, features, how-it-works,
//       testimonials, CTA, footer, and the animated background.
// Delegates auth forms to AuthModal (imported from components/).

import { useState }      from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import ChatMockup         from "../components/ChatMockup";
import AuthModal          from "../components/AuthModal";
import { buildLandingCSS } from "../styles/landingCSS";

// ── Static data ───────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: "⚡", bg: "rgba(124,58,237,0.12)", title: "Real-Time Messaging",
    desc: "Instant message delivery powered by WebSocket technology. No delays, no refresh — just seamless conversation." },
  { icon: "🎙️", bg: "rgba(6,182,212,0.12)", title: "Crystal-Clear Voice Calls",
    desc: "One-click voice calls with WebRTC. Talk in real time with high-quality audio, directly in your browser." },
  { icon: "📹", bg: "rgba(236,72,153,0.12)", title: "HD Video Calls",
    desc: "Face-to-face conversations with HD video calling. Picture-in-picture mode keeps you in the chat while you talk." },
  { icon: "🖼️", bg: "rgba(245,158,11,0.12)", title: "Rich Media Sharing",
    desc: "Share photos, files, and voice messages effortlessly. Drag, drop, and send — it's that simple." },
  { icon: "🔐", bg: "rgba(16,185,129,0.12)", title: "Secure Authentication",
    desc: "JWT-based authentication keeps your account safe. Your conversations are yours and yours alone." },
  { icon: "🌗", bg: "rgba(168,85,247,0.12)", title: "Dark & Light Mode",
    desc: "A stunning animated background that adapts to your preference — deep space dark or crisp sky light." },
];

const TESTIMONIALS = [
  { stars: "★★★★★", text: "CosmoChat transformed how our remote team communicates. The voice call quality is absolutely outstanding.", name: "Maria Santos", role: "Engineering Lead", av: "M", bg: "linear-gradient(135deg,#7c3aed,#a855f7)" },
  { stars: "★★★★★", text: "I love how clean and fast everything feels. Switching between chat and video calls is buttery smooth.", name: "James Park", role: "Product Designer", av: "J", bg: "linear-gradient(135deg,#06b6d4,#7c3aed)" },
  { stars: "★★★★★", text: "The dark mode with the star background is gorgeous. It actually makes me want to use it more!", name: "Priya Nair", role: "Frontend Developer", av: "P", bg: "linear-gradient(135deg,#ec4899,#a855f7)" },
];

const STATS = [
  { num: "< 50ms",  label: "Message latency" },
  { num: "WebRTC",  label: "Powered voice & video" },
  { num: "256-bit", label: "JWT token security" },
  { num: "∞",       label: "Messages & history" },
];

const STEPS = [
  { n: "01", title: "Create your account",  desc: "Register in seconds with just a username and password. No email required." },
  { n: "02", title: "Join a channel",       desc: "Jump straight into Channel 1 or wait for others to join. It's instant." },
  { n: "03", title: "Chat, call, share",    desc: "Send messages, make voice or video calls, share files — all from one place." },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function LandingPage({ dark, onToggleDark, onAuth }) {
  const [showAuth,  setShowAuth]  = useState(false);
  const [authMode,  setAuthMode]  = useState("login");

  const openLogin    = () => { setAuthMode("login");    setShowAuth(true); };
  const openRegister = () => { setAuthMode("register"); setShowAuth(true); };

  return (
    <>
      <style>{buildLandingCSS(dark)}</style>
      <AnimatedBackground dark={dark} />

      {showAuth && (
        <AuthModal
          dark={dark}
          initialMode={authMode}
          onClose={() => setShowAuth(false)}
          onAuth={onAuth}
        />
      )}

      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-icon">🌌</div>
          CosmoChat
        </div>
        <div className="nav-spacer" />
        <div className="nav-actions">
          <button className="theme-toggle" onClick={onToggleDark} title="Toggle theme">
            <div className="theme-thumb">{dark ? "🌙" : "☀️"}</div>
          </button>
          <button className="nav-link" onClick={openLogin}>Sign in</button>
          <button className="nav-btn"  onClick={openRegister}>Get started free</button>
        </div>
      </nav>

      <div className="landing">

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Real-time · Secure · Beautiful
          </div>
          <h1 className="hero-title">
            Chat smarter,
            <span className="hero-title-grad"> connect faster.</span>
          </h1>
          <p className="hero-sub">
            CosmoChat brings your team together with instant messaging, HD video calls,
            voice messages, and file sharing — all in one elegant interface.
          </p>
          <div className="hero-actions">
            <button className="btn-primary"   onClick={openRegister}>🚀 Start chatting — it's free</button>
            <button className="btn-secondary" onClick={openLogin}>Sign in to your account →</button>
          </div>
          <div className="hero-mockup">
            <div className="mockup-glow" />
            <ChatMockup />
          </div>
        </section>

        {/* ── STATS ── */}
        <div className="stats-row">
          {STATS.map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── FEATURES ── */}
        <section className="section">
          <div className="section-label">Features</div>
          <h2 className="section-title">Everything you need to connect</h2>
          <p className="section-sub">Built for teams and individuals who care about speed, quality, and a great experience.</p>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon" style={{ background: f.bg }}>
                  <span style={{ fontSize: 24 }}>{f.icon}</span>
                </div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-label">How it works</div>
          <h2 className="section-title">Up and running in seconds</h2>
          <p className="section-sub">No downloads. No setup. Just open your browser and start talking.</p>
          <div className="steps-row">
            {STEPS.map((s, i) => (
              <div key={i} className="step-item">
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-label">Loved by users</div>
          <h2 className="section-title">What people are saying</h2>
          <p className="section-sub">Real feedback from real users who rely on CosmoChat every day.</p>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">{t.stars}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-av" style={{ background: t.bg }}>{t.av}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section">
          <div className="cta-card">
            <div style={{ fontSize: 48, marginBottom: 20 }}>🌌</div>
            <h2 className="cta-title">Ready to start the conversation?</h2>
            <p className="cta-sub">Join CosmoChat today. Free, fast, and beautiful on every device.</p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-primary"   onClick={openRegister}>Create free account →</button>
              <button className="btn-secondary" onClick={openLogin}>I already have an account</button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="nav-logo-icon" style={{ width: 28, height: 28, fontSize: 14 }}>🌌</div>
            <span className="footer-copy">© 2026 CosmoChat. Built with ❤️ and WebSockets.</span>
          </div>
          <div className="footer-links">
            <button className="footer-link" onClick={openLogin}>Sign in</button>
            <button className="footer-link" onClick={openRegister}>Register</button>
          </div>
        </footer>

      </div>
    </>
  );
}