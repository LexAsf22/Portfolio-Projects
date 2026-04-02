// src/pages/LandingPage.jsx
// Full marketing / landing page shown to unauthenticated visitors.
// Owns: CSS variables, nav, hero, stats, features, how-it-works,
//       testimonials, CTA, footer, and the animated background.
// Delegates auth forms to AuthModal (imported from components/).

import { useState } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import ChatMockup from "../components/ChatMockup";
import AuthModal from "../components/AuthModal";
import { buildLandingCSS } from "../styles/landingCSS";

// ── Static data ───────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: "⚡", bg: "rgba(124,58,237,0.12)", title: "Real-Time Messaging",
    desc: "Instant message delivery powered by WebSocket technology. No delays, no refresh — just seamless conversation."
  },
  {
    icon: "🎙️", bg: "rgba(6,182,212,0.12)", title: "Crystal-Clear Voice Calls",
    desc: "One-click voice calls with WebRTC. Talk in real time with high-quality audio, directly in your browser."
  },
  {
    icon: "📹", bg: "rgba(236,72,153,0.12)", title: "HD Video Calls",
    desc: "Face-to-face conversations with HD video calling. Picture-in-picture mode keeps you in the chat while you talk."
  },
  {
    icon: "🖼️", bg: "rgba(245,158,11,0.12)", title: "Rich Media Sharing",
    desc: "Share photos, files, and voice messages effortlessly. Drag, drop, and send — it's that simple."
  },
  {
    icon: "🔐", bg: "rgba(16,185,129,0.12)", title: "Secure Authentication",
    desc: "JWT-based authentication keeps your account safe. Your conversations are yours and yours alone."
  },
  {
    icon: "🌗", bg: "rgba(168,85,247,0.12)", title: "Dark & Light Mode",
    desc: "A stunning animated background that adapts to your preference — deep space dark or crisp sky light."
  },
];

const TESTIMONIALS = [
  { stars: "★★★★★", text: "CosmoChat transformed how our remote team communicates. The voice call quality is absolutely outstanding.", name: "Maria Santos", role: "Engineering Lead", av: "M", bg: "linear-gradient(135deg,#7c3aed,#a855f7)" },
  { stars: "★★★★★", text: "I love how clean and fast everything feels. Switching between chat and video calls is buttery smooth.", name: "James Park", role: "Product Designer", av: "J", bg: "linear-gradient(135deg,#06b6d4,#7c3aed)" },
  { stars: "★★★★★", text: "The dark mode with the star background is gorgeous. It actually makes me want to use it more!", name: "Priya Nair", role: "Frontend Developer", av: "P", bg: "linear-gradient(135deg,#ec4899,#a855f7)" },
];

const STATS = [
  { num: "< 50ms", label: "Message latency" },
  { num: "WebRTC", label: "Powered voice & video" },
  { num: "256-bit", label: "JWT token security" },
  { num: "∞", label: "Messages & history" },
];

const STEPS = [
  { n: "01", title: "Create your account", desc: "Register in seconds with just a username and password. No email required." },
  { n: "02", title: "Join a channel", desc: "Jump straight into Channel 1 or wait for others to join. It's instant." },
  { n: "03", title: "Chat, call, share", desc: "Send messages, make voice or video calls, share files — all from one place." },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function LandingPage({ dark, onToggleDark, onAuth }) {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem("cosmo_intro_done"));

  const openLogin = () => { setAuthMode("login"); setShowAuth(true); };
  const openRegister = () => { setAuthMode("register"); setShowAuth(true); };

  const dismissIntro = () => {
    sessionStorage.setItem("cosmo_intro_done", "1");
    setShowIntro(false);
  };

  const INSIDE = [
    { icon: "💬", label: "Real-time channels & DMs", desc: "Instant messaging with full history, rooms, and direct messages" },
    { icon: "🎙️", label: "Voice & video calls", desc: "WebRTC peer-to-peer calls with mute, camera toggle & screen share" },
    { icon: "📎", label: "File & media sharing", desc: "Images, audio messages, files — drag, drop, and send" },
    { icon: "👥", label: "Friends & presence", desc: "Friend requests, online status, and typing indicators" },
    { icon: "🌌", label: "6 planet themes", desc: "Galaxy, Mars, Neptune, Venus, Black Hole, Nebula" },
    { icon: "🔔", label: "Live notifications", desc: "Unread badges, desktop push, and real-time updates" },
  ];

  const STACK = ["React", "Spring Boot", "WebSocket", "WebRTC", "JWT Auth", "REST API"];

  const introOverlay = showIntro && (
    <div
      onClick={e => e.target === e.currentTarget && dismissIntro()}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(3,1,15,0.88)",
        backdropFilter: "blur(14px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        @keyframes introRise {
          from { opacity:0; transform:translateY(28px) scale(0.97); }
          to   { opacity:1; transform:none; }
        }
        @keyframes introPulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes introSpin {
          from { transform:rotate(0deg) translateX(36px) rotate(0deg); }
          to   { transform:rotate(360deg) translateX(36px) rotate(-360deg); }
        }
        .ibox {
          width: 700px; max-width: 97vw;
          display: flex; flex-direction: column;
          background: linear-gradient(160deg,rgba(18,8,38,0.98),rgba(8,4,22,0.99));
          border: 1px solid rgba(196,109,255,0.2);
          border-radius: 26px; overflow: hidden;
          box-shadow: 0 36px 100px rgba(0,0,0,0.8);
          animation: introRise 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
          font-family: 'Plus Jakarta Sans', sans-serif;
          max-height: 92vh;
          overflow-y: auto;
        }
        .ibox-left {
          width: 100%;
          padding: 44px 40px 0 40px;
          display: flex; flex-direction: column;
        }
        .ibox-right {
          width: 100%;
          padding: 0 40px 44px 40px;
          display: flex; flex-direction: column;
        }
        .ibox-left::-webkit-scrollbar,
        .ibox-right::-webkit-scrollbar { width: 4px; }
        .ibox-left::-webkit-scrollbar-thumb,
        .ibox-right::-webkit-scrollbar-thumb { background: rgba(196,109,255,0.25); border-radius: 4px; }
        .ipill {
          display: inline-block; padding: 6px 14px; border-radius: 999px;
          font-size: 12px; font-weight: 700;
          background: rgba(196,109,255,0.1);
          border: 1px solid rgba(196,109,255,0.25);
          color: #c46dff;
        }
        .icta {
          width: 100%; padding: 18px; border-radius: 14px; border: none;
          background: linear-gradient(135deg,#c46dff,#7b8cff);
          color: #fff; font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: 17px; font-weight: 700; cursor: pointer;
          box-shadow: 0 6px 28px rgba(196,109,255,0.45);
          transition: transform 0.15s, box-shadow 0.15s;
          margin-top: auto;
          flex-shrink: 0;
        }
        .icta:hover { transform:translateY(-2px); box-shadow:0 12px 36px rgba(196,109,255,0.6); }
        .icta:active { transform:none; }
        .idivider {
          height: 1px; margin: 26px 0;
          background: linear-gradient(90deg,transparent,rgba(196,109,255,0.22),transparent);
          flex-shrink: 0;
        }
        .feat-row {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 14px 14px; border-radius: 12px;
          transition: background 0.15s;
        }
        .feat-row:hover { background: rgba(196,109,255,0.08); }
      `}</style>

      <div className="ibox">

        {/* ── LEFT COLUMN ── */}
        <div className="ibox-left">

          {/* App header */}
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28, flexShrink:0 }}>
            <div style={{ position:"relative", width:66, height:66, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg,#c46dff,#7b8cff)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, boxShadow:"0 0 32px rgba(196,109,255,0.5)" }}>🌌</div>
              <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1.5px dashed rgba(196,109,255,0.35)", animation:"introSpin 5s linear infinite" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#c46dff", position:"absolute", top:-4, left:"50%", transform:"translateX(-50%)" }} />
              </div>
            </div>
            <div>
              <div style={{ fontSize:30, fontWeight:800, color:"#fff", letterSpacing:"-0.5px", lineHeight:1.1 }}>CosmoChat</div>
              <div style={{ fontSize:12, color:"rgba(196,109,255,0.75)", fontWeight:700, letterSpacing:1.8, textTransform:"uppercase", marginTop:5 }}>Real-Time Chat Platform</div>
            </div>
          </div>

          {/* About developer label */}
          <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:18, flexShrink:0 }}>
            <div style={{ width:9, height:9, borderRadius:"50%", background:"#4ade80", boxShadow:"0 0 8px #4ade80", animation:"introPulse 2s infinite" }} />
            <span style={{ fontSize:13, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"rgba(196,109,255,0.7)" }}>About the Developer</span>
          </div>

          {/* Developer card */}
          <div style={{ display:"flex", gap:18, alignItems:"flex-start", background:"rgba(196,109,255,0.07)", border:"1px solid rgba(196,109,255,0.16)", borderRadius:16, padding:"20px", marginBottom:0, flexShrink:0 }}>
            <div style={{ position:"relative", flexShrink:0 }}>
              <img
                src="/src/pictures/profile.jfif"
                alt="Developer"
                style={{ width:120, height:148, borderRadius:14, objectFit:"cover", objectPosition:"top", border:"2.5px solid rgba(196,109,255,0.55)", boxShadow:"0 6px 22px rgba(196,109,255,0.38)", display:"block" }}
                onError={e => { e.target.style.display="none"; }}
              />
              <div style={{ position:"absolute", bottom:-9, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#c46dff,#7b8cff)", borderRadius:999, padding:"3px 13px", fontSize:11, fontWeight:700, color:"#fff", whiteSpace:"nowrap", boxShadow:"0 2px 10px rgba(196,109,255,0.4)" }}>Developer</div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:21, fontWeight:800, color:"#fff", marginBottom:4, lineHeight:1.2 }}>Van Phillip T. Tamayo</div>
              <div style={{ fontSize:12, color:"#c46dff", fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", marginBottom:12 }}>2nd Year BSIT Student</div>
              <div style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.8, marginBottom:14 }}>
                CosmoChat is my solo project — a full-stack real-time chat app I designed and built from scratch, applying everything I've learned in my BSIT journey.
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {["React","Spring Boot","WebSocket","WebRTC","JWT Auth","REST API"].map((t,i) => (
                  <span key={i} className="ipill">{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="idivider" />

          {/* Special Dedication */}
          <div style={{ textAlign:"center", flexShrink:0 }}>
            <div style={{ fontSize:13, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"rgba(196,109,255,0.65)", marginBottom:18 }}>💜 Special Dedication</div>

            {/* Photos */}
            <div style={{ display:"flex", gap:8, marginBottom:18, justifyContent:"center", alignItems:"center" }}>
              {["image1.jfif","image2.jfif","image3.jfif"].map((img,i) => (
                <div key={i} style={{ position:"relative", flexShrink:0, width:i===1?168:124, height:i===1?108:86 }}>
                  <img
                    src={`/src/pictures/${img}`}
                    alt={`memory ${i+1}`}
                    style={{
                      width:"100%", height:"100%",
                      borderRadius:11, objectFit:"cover", objectPosition:"center",
                      border:i===1?"2.5px solid #c46dff":"1.5px solid rgba(196,109,255,0.3)",
                      boxShadow:i===1?"0 0 22px rgba(196,109,255,0.55)":"0 4px 12px rgba(0,0,0,0.45)",
                      transform:i===0?"rotate(-3deg)":i===2?"rotate(3deg)":"none",
                      display:"block",
                    }}
                    onError={e => { e.target.style.opacity="0"; }}
                  />
                  {i===1 && <div style={{ position:"absolute", top:-8, right:-8, width:22, height:22, borderRadius:"50%", background:"linear-gradient(135deg,#c46dff,#7b8cff)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, boxShadow:"0 2px 8px rgba(196,109,255,0.5)" }}>💜</div>}
                </div>
              ))}
            </div>

            <div style={{ fontSize:15, color:"rgba(255,255,255,0.78)", lineHeight:1.88, fontStyle:"italic" }}>
              "The name <span style={{ color:"#c46dff", fontWeight:700, fontStyle:"normal" }}>CosmoChat</span> is inspired by my best friend, <span style={{ color:"#c46dff", fontWeight:700, fontStyle:"normal" }}>Clyde Chyna</span>. 🌸"
            </div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)", lineHeight:1.88, marginTop:12 }}>
              She helped with designs, cheered me up every time I felt burnt out, and never stopped believing in this project. When the code was breaking and my motivation was fading — she was always there, my biggest supporter and loudest cheerleader. 🎉
            </div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.32)", lineHeight:1.88, marginTop:10, fontStyle:"italic" }}>
              Best friends are the people who turn your hardest days into your best memories. Every late night, every "I give up" moment — she turned it all into fuel. 🔥 Thank you, Chyna — for making this journey feel less like work and more like an adventure we shared together. 💜✨
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="ibox-right">

          <div style={{ fontSize:13, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"rgba(196,109,255,0.7)", marginBottom:12, flexShrink:0 }}>What is CosmoChat?</div>
          <div style={{ fontSize:16, color:"rgba(255,255,255,0.55)", lineHeight:1.85, marginBottom:30, flexShrink:0 }}>
            A Discord-inspired messaging platform with real-time channels, HD voice &amp; video calls, friend systems, file sharing, and beautiful cosmic themes — all running in your browser with zero downloads.
          </div>

          <div style={{ fontSize:13, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:"rgba(196,109,255,0.7)", marginBottom:16, flexShrink:0 }}>What's inside</div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:30 }}>
            {[
              { icon:"💬", label:"Real-time channels & DMs",   desc:"Instant messaging with full history, rooms, and direct messages" },
              { icon:"🎙️", label:"Voice & video calls",         desc:"WebRTC peer-to-peer calls with mute, camera toggle & screen share" },
              { icon:"📎", label:"File & media sharing",        desc:"Images, audio messages, files — drag, drop, and send" },
              { icon:"👥", label:"Friends & presence",          desc:"Friend requests, online status, and typing indicators" },
              { icon:"🌌", label:"6 planet themes",             desc:"Galaxy, Mars, Neptune, Venus, Black Hole, Nebula" },
              { icon:"🔔", label:"Live notifications",          desc:"Unread badges, desktop push, and real-time updates" },
            ].map((item,i) => (
              <div key={i} className="feat-row">
                <span style={{ fontSize:24, flexShrink:0, marginTop:2 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:"#fff", marginBottom:5 }}>{item.label}</div>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,0.42)", lineHeight:1.65 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="icta" onClick={dismissIntro}>
            🚀 &nbsp;Explore CosmoChat
          </button>
          <div style={{ textAlign:"center", marginTop:10, fontSize:12, color:"rgba(255,255,255,0.2)", flexShrink:0 }}>
            Click anywhere outside to dismiss
          </div>

        </div>
      </div>
    </div>
  );

  return (
    <>
      {introOverlay}
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
          <button className="nav-btn" onClick={openRegister}>Get started free</button>
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
            <button className="btn-primary" onClick={openRegister}>🚀 Start chatting — it's free</button>
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
              <button className="btn-primary" onClick={openRegister}>Create free account →</button>
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