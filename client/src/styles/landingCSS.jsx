// src/styles/landingCSS.js
// Generates the full CSS string for the landing page.
// Accepts `dark` boolean so CSS variables update correctly when the theme
// toggle is clicked, identical to the original buildCSS(dark) in Chat.jsx.
//
// Import: import { buildLandingCSS } from "../styles/landingCSS";
// Usage:  <style>{buildLandingCSS(dark)}</style>

export const buildLandingCSS = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root {
    width: 100%; height: 100%;
    font-family: 'Sora', sans-serif;
    overflow-x: hidden;
  }
  body { overflow-y: auto; }

  :root {
    --bg:           ${dark ? "#070510"                    : "#f0ecff"};
    --bg2:          ${dark ? "#0e0b1e"                    : "#e8e2ff"};
    --surface:      ${dark ? "rgba(255,255,255,0.04)"     : "rgba(255,255,255,0.75)"};
    --surface2:     ${dark ? "rgba(255,255,255,0.07)"     : "rgba(255,255,255,0.92)"};
    --border:       ${dark ? "rgba(255,255,255,0.08)"     : "rgba(120,80,220,0.18)"};
    --border2:      ${dark ? "rgba(255,255,255,0.13)"     : "rgba(120,80,220,0.30)"};
    --text:         ${dark ? "#f0ebff"                    : "#150a30"};
    --text2:        ${dark ? "#8a7aaa"                    : "#5a3e8a"};
    --text3:        ${dark ? "#4e4268"                    : "#9980bb"};
    --accent:       #7c3aed;
    --accent2:      #a855f7;
    --accent3:      #c084fc;
    --teal:         #06b6d4;
    --pink:         #ec4899;
    --green:        #10b981;
    --amber:        #f59e0b;
    --glow:         rgba(124,58,237,0.35);
    --glow2:        rgba(168,85,247,0.20);
    --input-bg:     ${dark ? "rgba(14,11,30,0.80)"        : "rgba(255,255,255,0.90)"};
    --card-bg:      ${dark ? "rgba(255,255,255,0.04)"     : "rgba(255,255,255,0.72)"};
    --shadow:       ${dark ? "0 24px 64px rgba(0,0,0,0.60)" : "0 24px 64px rgba(80,20,160,0.14)"};
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.30); border-radius: 8px; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:none; } }
  @keyframes fadeIn   { from { opacity:0; }                             to { opacity:1; } }
  @keyframes blink    { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
  @keyframes scalePop { from { opacity:0; transform:scale(0.88); }      to { opacity:1; transform:none; } }
  @keyframes gradMove { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
  @keyframes spin     { to { transform:rotate(360deg); } }

  .landing {
    position: relative; z-index: 1;
    min-height: 100vh;
    display: flex; flex-direction: column;
  }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; padding: 0 48px;
    height: 70px;
    background: ${dark ? "rgba(7,5,16,0.75)" : "rgba(240,236,255,0.82)"};
    backdrop-filter: blur(24px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo {
    display: flex; align-items: center; gap: 10px;
    font-size: 20px; font-weight: 800; color: var(--text);
    letter-spacing: -0.5px; text-decoration: none;
  }
  .nav-logo-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; box-shadow: 0 4px 16px var(--glow);
  }
  .nav-spacer  { flex: 1; }
  .nav-actions { display: flex; align-items: center; gap: 12px; }
  .nav-link {
    font-size: 14px; font-weight: 500; color: var(--text2);
    background: none; border: none; cursor: pointer;
    font-family: inherit; padding: 8px 16px; border-radius: 10px;
    transition: color 0.2s, background 0.2s;
  }
  .nav-link:hover { color: var(--text); background: var(--surface); }
  .nav-btn {
    font-size: 14px; font-weight: 600; color: #fff;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    border: none; cursor: pointer; font-family: inherit;
    padding: 9px 22px; border-radius: 10px;
    box-shadow: 0 4px 18px var(--glow);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .nav-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 24px var(--glow); }
  .theme-toggle {
    width: 40px; height: 24px; border-radius: 999px; border: none;
    background: ${dark ? "rgba(124,58,237,0.25)" : "rgba(124,58,237,0.15)"};
    border: 1.5px solid var(--border2);
    cursor: pointer; position: relative; transition: background 0.3s;
  }
  .theme-thumb {
    position: absolute; top: 2px; left: ${dark ? "17px" : "2px"};
    width: 18px; height: 18px; border-radius: 50%;
    background: ${dark ? "linear-gradient(135deg,#a855f7,#7c3aed)" : "linear-gradient(135deg,#fbbf24,#f59e0b)"};
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; transition: left 0.3s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 1px 6px rgba(0,0,0,0.25);
  }

  /* ── HERO ── */
  .hero {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 120px 24px 80px; text-align: center; position: relative;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 16px; border-radius: 999px;
    background: ${dark ? "rgba(124,58,237,0.15)" : "rgba(124,58,237,0.10)"};
    border: 1px solid rgba(124,58,237,0.30);
    font-size: 12.5px; font-weight: 600; color: var(--accent3);
    letter-spacing: 0.3px; margin-bottom: 32px;
    animation: fadeUp 0.6s ease forwards;
  }
  .hero-badge-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--green); animation: blink 2s infinite;
  }
  .hero-title {
    font-size: clamp(44px, 7vw, 82px);
    font-weight: 800; line-height: 1.07; letter-spacing: -2.5px;
    color: var(--text); margin-bottom: 24px;
    animation: fadeUp 0.6s 0.1s ease both;
  }
  .hero-title-grad {
    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 40%, #ec4899 80%, #f59e0b 100%);
    background-size: 200% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text; animation: gradMove 4s ease infinite;
    display: block;
  }
  .hero-sub {
    font-size: clamp(16px, 2.2vw, 20px); font-weight: 400;
    color: var(--text2); line-height: 1.7; max-width: 600px;
    margin: 0 auto 48px; animation: fadeUp 0.6s 0.2s ease both;
  }
  .hero-actions {
    display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
    animation: fadeUp 0.6s 0.3s ease both; margin-bottom: 80px;
  }
  .btn-primary {
    display: flex; align-items: center; gap: 8px;
    padding: 14px 32px; border-radius: 14px; border: none;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: #fff; font-family: inherit; font-size: 16px; font-weight: 700;
    cursor: pointer; box-shadow: 0 8px 32px var(--glow);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .btn-primary:hover  { transform: translateY(-2px); box-shadow: 0 12px 40px var(--glow); }
  .btn-secondary {
    display: flex; align-items: center; gap: 8px;
    padding: 14px 32px; border-radius: 14px;
    border: 1.5px solid var(--border2);
    background: var(--surface); color: var(--text);
    font-family: inherit; font-size: 16px; font-weight: 600;
    cursor: pointer; transition: background 0.2s, border-color 0.2s;
  }
  .btn-secondary:hover { background: var(--surface2); border-color: var(--accent); }

  /* ── MOCKUP ── */
  .hero-mockup {
    width: min(860px, 100%); margin: 0 auto;
    animation: fadeUp 0.7s 0.4s ease both; position: relative;
  }
  .mockup-glow {
    position: absolute; inset: -40px;
    background: radial-gradient(ellipse at 50% 60%, rgba(124,58,237,0.20) 0%, transparent 70%);
    pointer-events: none;
  }
  .mockup-frame {
    border-radius: 20px; overflow: hidden;
    border: 1px solid var(--border2);
    box-shadow: var(--shadow), 0 0 0 1px rgba(255,255,255,0.05);
    background: var(--card-bg); backdrop-filter: blur(20px);
  }
  .mockup-bar {
    display: flex; align-items: center; gap: 8px; padding: 14px 18px;
    background: ${dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.85)"};
    border-bottom: 1px solid var(--border);
  }
  .mockup-dot   { width: 11px; height: 11px; border-radius: 50%; }
  .mockup-title { flex: 1; text-align: center; font-size: 12px; font-weight: 600; color: var(--text3); font-family: 'JetBrains Mono', monospace; }
  .mockup-body  { display: flex; height: 340px; }
  .mockup-sidebar {
    width: 200px; border-right: 1px solid var(--border);
    padding: 16px 12px; display: flex; flex-direction: column; gap: 8px;
    background: ${dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.60)"};
  }
  .mockup-sb-label { font-size: 9px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--text3); padding: 0 6px 4px; }
  .mockup-contact  { display: flex; align-items: center; gap: 9px; padding: 9px 10px; border-radius: 11px; cursor: default; }
  .mockup-contact.active { background: rgba(124,58,237,0.14); }
  .mockup-av { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, #7c3aed, #a855f7); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; position: relative; }
  .mockup-av-dot { position: absolute; bottom: 0; right: 0; width: 9px; height: 9px; border-radius: 50%; background: #10b981; border: 2px solid ${dark ? "#0e0b1e" : "#fff"}; }
  .mockup-cinfo { flex: 1; min-width: 0; }
  .mockup-cname { font-size: 12px; font-weight: 600; color: var(--text); }
  .mockup-clast { font-size: 10.5px; color: var(--text3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
  .mockup-chat  { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .mockup-chat-hdr { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-bottom: 1px solid var(--border); background: ${dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.75)"}; }
  .mockup-msgs  { flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 10px; overflow: hidden; }
  .mockup-msg-row { display: flex; gap: 8px; align-items: flex-end; }
  .mockup-msg-row.me { flex-direction: row-reverse; }
  .mockup-mini-av { width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, #06b6d4, #7c3aed); font-size: 9px; font-weight: 700; color: #fff; display: flex; align-items: center; justify-content: center; }
  .mockup-bubble { padding: 9px 13px; border-radius: 16px; font-size: 11.5px; line-height: 1.5; max-width: 200px; }
  .mockup-bubble.other { background: ${dark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.95)"}; color: var(--text); border: 1px solid var(--border); border-bottom-left-radius: 4px; }
  .mockup-bubble.me    { background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; border-bottom-right-radius: 4px; }
  .mockup-input-row { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-top: 1px solid var(--border); background: ${dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.75)"}; }
  .mockup-input-bar { flex: 1; height: 32px; border-radius: 999px; background: ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}; border: 1px solid var(--border); display: flex; align-items: center; padding: 0 12px; font-size: 11px; color: var(--text3); }
  .mockup-send-btn  { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #a855f7); display: flex; align-items: center; justify-content: center; font-size: 12px; }

  /* ── STATS ── */
  .stats-row { display: flex; justify-content: center; gap: 48px; flex-wrap: wrap; padding: 48px 24px; animation: fadeUp 0.6s 0.5s ease both; }
  .stat-item { text-align: center; }
  .stat-num  { font-size: 36px; font-weight: 800; letter-spacing: -1.5px; background: linear-gradient(135deg, #7c3aed, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .stat-label { font-size: 13px; color: var(--text2); margin-top: 4px; font-weight: 500; }

  /* ── SECTIONS ── */
  .section         { padding: 100px 24px; position: relative; z-index: 1; }
  .section-label   { text-align: center; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--accent3); margin-bottom: 16px; }
  .section-title   { text-align: center; font-size: clamp(30px, 4vw, 48px); font-weight: 800; letter-spacing: -1.5px; color: var(--text); margin-bottom: 16px; line-height: 1.1; }
  .section-sub     { text-align: center; font-size: 17px; color: var(--text2); max-width: 560px; margin: 0 auto 64px; line-height: 1.65; }

  /* ── FEATURES ── */
  .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; max-width: 1100px; margin: 0 auto; }
  .feature-card  { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: 20px; padding: 32px; transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; cursor: default; }
  .feature-card:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 20px 48px ${dark ? "rgba(124,58,237,0.18)" : "rgba(124,58,237,0.12)"}; }
  .feature-icon  { width: 52px; height: 52px; border-radius: 14px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
  .feature-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 10px; }
  .feature-desc  { font-size: 14px; color: var(--text2); line-height: 1.7; }

  /* ── HOW IT WORKS ── */
  .steps-row { display: flex; justify-content: center; gap: 0; flex-wrap: wrap; max-width: 900px; margin: 0 auto; position: relative; }
  .step-item { display: flex; flex-direction: column; align-items: center; text-align: center; flex: 1; min-width: 200px; padding: 0 24px; position: relative; }
  .step-item:not(:last-child)::after { content: ''; position: absolute; top: 28px; right: -1px; width: 50%; height: 1px; background: linear-gradient(90deg, var(--accent), transparent); }
  .step-num  { width: 56px; height: 56px; border-radius: 50%; margin-bottom: 20px; background: linear-gradient(135deg, rgba(124,58,237,0.20), rgba(168,85,247,0.10)); border: 1.5px solid rgba(124,58,237,0.35); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; color: var(--accent3); font-family: 'JetBrains Mono', monospace; }
  .step-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
  .step-desc  { font-size: 13.5px; color: var(--text2); line-height: 1.65; }

  /* ── TESTIMONIALS ── */
  .testimonials-grid    { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; max-width: 1000px; margin: 0 auto; }
  .testimonial-card     { background: var(--card-bg); backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: 20px; padding: 28px; }
  .testimonial-stars    { font-size: 14px; margin-bottom: 14px; letter-spacing: 2px; }
  .testimonial-text     { font-size: 14.5px; color: var(--text2); line-height: 1.75; margin-bottom: 20px; font-style: italic; }
  .testimonial-author   { display: flex; align-items: center; gap: 12px; }
  .testimonial-av       { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; }
  .testimonial-name     { font-size: 14px; font-weight: 700; color: var(--text); }
  .testimonial-role     { font-size: 12px; color: var(--text3); margin-top: 2px; }

  /* ── CTA ── */
  .cta-section { padding: 100px 24px; text-align: center; position: relative; z-index: 1; }
  .cta-card    { max-width: 700px; margin: 0 auto; background: linear-gradient(135deg, rgba(124,58,237,0.18), rgba(168,85,247,0.10)); border: 1px solid rgba(124,58,237,0.30); border-radius: 28px; padding: 64px 48px; backdrop-filter: blur(20px); box-shadow: 0 0 80px rgba(124,58,237,0.12); }
  .cta-title   { font-size: clamp(28px, 4vw, 44px); font-weight: 800; letter-spacing: -1.5px; color: var(--text); margin-bottom: 16px; line-height: 1.1; }
  .cta-sub     { font-size: 17px; color: var(--text2); margin-bottom: 36px; line-height: 1.65; }

  /* ── FOOTER ── */
  .footer       { border-top: 1px solid var(--border); padding: 40px 48px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; position: relative; z-index: 1; }
  .footer-copy  { font-size: 13px; color: var(--text3); }
  .footer-links { display: flex; gap: 24px; }
  .footer-link  { font-size: 13px; color: var(--text2); background: none; border: none; cursor: pointer; font-family: inherit; transition: color 0.2s; }
  .footer-link:hover { color: var(--accent3); }

  /* ── AUTH MODAL ── */
  .auth-overlay {
    position: fixed; inset: 0; z-index: 200;
    display: flex; align-items: center; justify-content: center; padding: 20px;
    background: rgba(0,0,0,0.65); backdrop-filter: blur(10px);
    animation: fadeIn 0.2s ease;
  }
  .auth-modal {
    width: 100%; max-width: 460px;
    background: ${dark ? "rgba(12,9,26,0.97)" : "rgba(248,244,255,0.98)"};
    border: 1px solid var(--border2); border-radius: 28px;
    padding: 48px 44px 44px; text-align: center;
    box-shadow: 0 40px 100px rgba(0,0,0,0.50), 0 0 0 1px rgba(124,58,237,0.15);
    animation: scalePop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
    position: relative;
  }
  .auth-close  { position: absolute; top: 18px; right: 18px; width: 32px; height: 32px; border-radius: 50%; border: none; background: var(--surface); color: var(--text2); cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: background 0.2s, color 0.2s; }
  .auth-close:hover { background: var(--surface2); color: var(--text); }
  .auth-logo-wrap { width: 64px; height: 64px; border-radius: 18px; margin: 0 auto 24px; background: linear-gradient(135deg, #7c3aed, #a855f7); display: flex; align-items: center; justify-content: center; font-size: 26px; box-shadow: 0 8px 28px var(--glow); }
  .auth-title  { font-size: 26px; font-weight: 800; letter-spacing: -0.8px; color: var(--text); margin-bottom: 7px; }
  .auth-sub    { font-size: 14px; color: var(--text2); margin-bottom: 32px; line-height: 1.6; }
  .auth-tabs   { display: flex; gap: 4px; padding: 4px; background: var(--surface); border-radius: 12px; margin-bottom: 28px; }
  .auth-tab    { flex: 1; padding: 9px; border-radius: 9px; border: none; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; color: var(--text2); background: transparent; }
  .auth-tab.active { background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; box-shadow: 0 3px 12px var(--glow); }
  .auth-field  { text-align: left; margin-bottom: 16px; }
  .auth-label  { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: var(--text3); margin-bottom: 8px; }
  .auth-input-wrap { position: relative; }
  .auth-input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 16px; pointer-events: none; opacity: 0.5; }
  .auth-input  { width: 100%; padding: 13px 16px 13px 42px; background: var(--input-bg); border: 1.5px solid var(--border); border-radius: 12px; font-family: inherit; font-size: 15px; color: var(--text); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .auth-input::placeholder { color: var(--text3); }
  .auth-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }
  .auth-error   { font-size: 13px; color: #fb7185; margin-bottom: 16px; padding: 10px 14px; background: rgba(251,113,133,0.09); border-radius: 10px; border: 1px solid rgba(251,113,133,0.22); text-align: left; }
  .auth-success { font-size: 13px; color: #10b981; margin-bottom: 16px; padding: 10px 14px; background: rgba(16,185,129,0.09); border-radius: 10px; border: 1px solid rgba(16,185,129,0.22); text-align: left; }
  .auth-submit  { width: 100%; padding: 14px; background: linear-gradient(135deg, #7c3aed, #a855f7); color: #fff; border: none; border-radius: 12px; font-family: inherit; font-size: 15px; font-weight: 700; cursor: pointer; box-shadow: 0 6px 24px var(--glow); transition: transform 0.15s, box-shadow 0.15s; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .auth-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 32px var(--glow); }
  .auth-submit:disabled { opacity: 0.65; cursor: not-allowed; }
  .auth-terms  { font-size: 12px; color: var(--text3); margin-top: 16px; line-height: 1.6; }
  .auth-terms a { color: var(--accent3); text-decoration: none; }

  .spinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; animation: spin 0.7s linear infinite; }

  @media (max-width: 768px) {
    .nav { padding: 0 20px; }
    .mockup-sidebar { display: none; }
    .steps-row { gap: 32px; }
    .step-item::after { display: none; }
    .cta-card { padding: 40px 24px; }
    .footer { padding: 28px 20px; }
    .auth-modal { padding: 36px 24px 32px; }
    .stats-row { gap: 28px; }
  }
`;