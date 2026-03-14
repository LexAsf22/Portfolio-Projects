import { useState, useEffect, useRef } from "react";
import Chat from "./WebSocketClient";

const BASE_URL = "http://192.168.100.127:8080";

const buildCSS = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root {
    width: 100%; height: 100%;
    font-family: 'Sora', sans-serif;
    overflow-x: hidden;
  }
  body { overflow-y: auto; }

  :root {
    --bg:           ${dark ? "#070510" : "#f0ecff"};
    --bg2:          ${dark ? "#0e0b1e" : "#e8e2ff"};
    --surface:      ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.75)"};
    --surface2:     ${dark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.92)"};
    --border:       ${dark ? "rgba(255,255,255,0.08)" : "rgba(120,80,220,0.18)"};
    --border2:      ${dark ? "rgba(255,255,255,0.13)" : "rgba(120,80,220,0.30)"};
    --text:         ${dark ? "#f0ebff" : "#150a30"};
    --text2:        ${dark ? "#8a7aaa" : "#5a3e8a"};
    --text3:        ${dark ? "#4e4268" : "#9980bb"};
    --accent:       #7c3aed;
    --accent2:      #a855f7;
    --accent3:      #c084fc;
    --teal:         #06b6d4;
    --pink:         #ec4899;
    --green:        #10b981;
    --amber:        #f59e0b;
    --glow:         rgba(124,58,237,0.35);
    --glow2:        rgba(168,85,247,0.20);
    --input-bg:     ${dark ? "rgba(14,11,30,0.80)" : "rgba(255,255,255,0.90)"};
    --card-bg:      ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.72)"};
    --shadow:       ${dark ? "0 24px 64px rgba(0,0,0,0.60)" : "0 24px 64px rgba(80,20,160,0.14)"};
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.30); border-radius: 8px; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:none; } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes blink    { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
  @keyframes scalePop { from { opacity:0; transform:scale(0.88); } to { opacity:1; transform:none; } }
  @keyframes gradMove { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
  @keyframes spin     { to { transform:rotate(360deg); } }

  .bg-canvas {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    width: 100%; height: 100%;
  }

  .landing {
    position: relative; z-index: 1;
    min-height: 100vh;
    display: flex; flex-direction: column;
  }

  /* NAV */
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
  .nav-spacer { flex: 1; }
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

  /* HERO */
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
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px var(--glow); }
  .btn-secondary {
    display: flex; align-items: center; gap: 8px;
    padding: 14px 32px; border-radius: 14px;
    border: 1.5px solid var(--border2);
    background: var(--surface); color: var(--text);
    font-family: inherit; font-size: 16px; font-weight: 600;
    cursor: pointer; transition: background 0.2s, border-color 0.2s;
  }
  .btn-secondary:hover { background: var(--surface2); border-color: var(--accent); }

  /* MOCKUP */
  .hero-mockup {
    width: min(860px, 100%); margin: 0 auto;
    animation: fadeUp 0.7s 0.4s ease both;
    position: relative;
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
  .mockup-dot { width: 11px; height: 11px; border-radius: 50%; }
  .mockup-title {
    flex: 1; text-align: center; font-size: 12px; font-weight: 600;
    color: var(--text3); font-family: 'JetBrains Mono', monospace;
  }
  .mockup-body { display: flex; height: 340px; }
  .mockup-sidebar {
    width: 200px; border-right: 1px solid var(--border);
    padding: 16px 12px; display: flex; flex-direction: column; gap: 8px;
    background: ${dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.60)"};
  }
  .mockup-sb-label {
    font-size: 9px; font-weight: 700; letter-spacing: 1.2px;
    text-transform: uppercase; color: var(--text3); padding: 0 6px 4px;
  }
  .mockup-contact {
    display: flex; align-items: center; gap: 9px;
    padding: 9px 10px; border-radius: 11px; cursor: default;
  }
  .mockup-contact.active { background: rgba(124,58,237,0.14); }
  .mockup-av {
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #fff; position: relative;
  }
  .mockup-av-dot {
    position: absolute; bottom: 0; right: 0;
    width: 9px; height: 9px; border-radius: 50%;
    background: #10b981; border: 2px solid ${dark ? "#0e0b1e" : "#fff"};
  }
  .mockup-cinfo { flex: 1; min-width: 0; }
  .mockup-cname { font-size: 12px; font-weight: 600; color: var(--text); }
  .mockup-clast { font-size: 10.5px; color: var(--text3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
  .mockup-chat { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .mockup-chat-hdr {
    display: flex; align-items: center; gap: 10px; padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    background: ${dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.75)"};
  }
  .mockup-msgs { flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 10px; overflow: hidden; }
  .mockup-msg-row { display: flex; gap: 8px; align-items: flex-end; }
  .mockup-msg-row.me { flex-direction: row-reverse; }
  .mockup-mini-av {
    width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #06b6d4, #7c3aed);
    font-size: 9px; font-weight: 700; color: #fff;
    display: flex; align-items: center; justify-content: center;
  }
  .mockup-bubble {
    padding: 9px 13px; border-radius: 16px; font-size: 11.5px;
    line-height: 1.5; max-width: 200px;
  }
  .mockup-bubble.other {
    background: ${dark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.95)"};
    color: var(--text); border: 1px solid var(--border);
    border-bottom-left-radius: 4px;
  }
  .mockup-bubble.me {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: #fff; border-bottom-right-radius: 4px;
  }
  .mockup-input-row {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 14px; border-top: 1px solid var(--border);
    background: ${dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.75)"};
  }
  .mockup-input-bar {
    flex: 1; height: 32px; border-radius: 999px;
    background: ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"};
    border: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 12px;
    font-size: 11px; color: var(--text3);
  }
  .mockup-send-btn {
    width: 30px; height: 30px; border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    display: flex; align-items: center; justify-content: center; font-size: 12px;
  }

  /* STATS */
  .stats-row {
    display: flex; justify-content: center; gap: 48px; flex-wrap: wrap;
    padding: 48px 24px; animation: fadeUp 0.6s 0.5s ease both;
  }
  .stat-item { text-align: center; }
  .stat-num {
    font-size: 36px; font-weight: 800; letter-spacing: -1.5px;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .stat-label { font-size: 13px; color: var(--text2); margin-top: 4px; font-weight: 500; }

  /* FEATURES */
  .section { padding: 100px 24px; position: relative; z-index: 1; }
  .section-label {
    text-align: center; font-size: 11px; font-weight: 700; letter-spacing: 2px;
    text-transform: uppercase; color: var(--accent3); margin-bottom: 16px;
  }
  .section-title {
    text-align: center; font-size: clamp(30px, 4vw, 48px);
    font-weight: 800; letter-spacing: -1.5px; color: var(--text);
    margin-bottom: 16px; line-height: 1.1;
  }
  .section-sub {
    text-align: center; font-size: 17px; color: var(--text2);
    max-width: 560px; margin: 0 auto 64px; line-height: 1.65;
  }
  .features-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px; max-width: 1100px; margin: 0 auto;
  }
  .feature-card {
    background: var(--card-bg); backdrop-filter: blur(20px);
    border: 1px solid var(--border); border-radius: 20px;
    padding: 32px; transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    cursor: default;
  }
  .feature-card:hover {
    border-color: var(--accent); transform: translateY(-4px);
    box-shadow: 0 20px 48px ${dark ? "rgba(124,58,237,0.18)" : "rgba(124,58,237,0.12)"};
  }
  .feature-icon {
    width: 52px; height: 52px; border-radius: 14px; margin-bottom: 20px;
    display: flex; align-items: center; justify-content: center; font-size: 24px;
  }
  .feature-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 10px; }
  .feature-desc { font-size: 14px; color: var(--text2); line-height: 1.7; }

  /* HOW IT WORKS */
  .steps-row {
    display: flex; justify-content: center; gap: 0; flex-wrap: wrap;
    max-width: 900px; margin: 0 auto; position: relative;
  }
  .step-item {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; flex: 1; min-width: 200px; padding: 0 24px;
    position: relative;
  }
  .step-item:not(:last-child)::after {
    content: ''; position: absolute; top: 28px; right: -1px;
    width: 50%; height: 1px;
    background: linear-gradient(90deg, var(--accent), transparent);
  }
  .step-num {
    width: 56px; height: 56px; border-radius: 50%; margin-bottom: 20px;
    background: linear-gradient(135deg, rgba(124,58,237,0.20), rgba(168,85,247,0.10));
    border: 1.5px solid rgba(124,58,237,0.35);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; font-weight: 800; color: var(--accent3);
    font-family: 'JetBrains Mono', monospace;
  }
  .step-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
  .step-desc { font-size: 13.5px; color: var(--text2); line-height: 1.65; }

  /* TESTIMONIALS */
  .testimonials-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px; max-width: 1000px; margin: 0 auto;
  }
  .testimonial-card {
    background: var(--card-bg); backdrop-filter: blur(20px);
    border: 1px solid var(--border); border-radius: 20px; padding: 28px;
  }
  .testimonial-stars { font-size: 14px; margin-bottom: 14px; letter-spacing: 2px; }
  .testimonial-text { font-size: 14.5px; color: var(--text2); line-height: 1.75; margin-bottom: 20px; font-style: italic; }
  .testimonial-author { display: flex; align-items: center; gap: 12px; }
  .testimonial-av {
    width: 38px; height: 38px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: #fff;
  }
  .testimonial-name { font-size: 14px; font-weight: 700; color: var(--text); }
  .testimonial-role { font-size: 12px; color: var(--text3); margin-top: 2px; }

  /* CTA */
  .cta-section {
    padding: 100px 24px; text-align: center; position: relative; z-index: 1;
  }
  .cta-card {
    max-width: 700px; margin: 0 auto;
    background: linear-gradient(135deg, rgba(124,58,237,0.18), rgba(168,85,247,0.10));
    border: 1px solid rgba(124,58,237,0.30);
    border-radius: 28px; padding: 64px 48px;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 80px rgba(124,58,237,0.12);
  }
  .cta-title {
    font-size: clamp(28px, 4vw, 44px); font-weight: 800;
    letter-spacing: -1.5px; color: var(--text); margin-bottom: 16px; line-height: 1.1;
  }
  .cta-sub { font-size: 17px; color: var(--text2); margin-bottom: 36px; line-height: 1.65; }

  /* FOOTER */
  .footer {
    border-top: 1px solid var(--border); padding: 40px 48px;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 16px; position: relative; z-index: 1;
  }
  .footer-copy { font-size: 13px; color: var(--text3); }
  .footer-links { display: flex; gap: 24px; }
  .footer-link { font-size: 13px; color: var(--text2); background: none; border: none; cursor: pointer; font-family: inherit; transition: color 0.2s; }
  .footer-link:hover { color: var(--accent3); }

  /* AUTH MODAL */
  .auth-overlay {
    position: fixed; inset: 0; z-index: 200;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
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
  .auth-close {
    position: absolute; top: 18px; right: 18px;
    width: 32px; height: 32px; border-radius: 50%; border: none;
    background: var(--surface); color: var(--text2);
    cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, color 0.2s;
  }
  .auth-close:hover { background: var(--surface2); color: var(--text); }
  .auth-logo-wrap {
    width: 64px; height: 64px; border-radius: 18px; margin: 0 auto 24px;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; box-shadow: 0 8px 28px var(--glow);
  }
  .auth-title { font-size: 26px; font-weight: 800; letter-spacing: -0.8px; color: var(--text); margin-bottom: 7px; }
  .auth-sub   { font-size: 14px; color: var(--text2); margin-bottom: 32px; line-height: 1.6; }
  .auth-tabs {
    display: flex; gap: 4px; padding: 4px;
    background: var(--surface); border-radius: 12px; margin-bottom: 28px;
  }
  .auth-tab {
    flex: 1; padding: 9px; border-radius: 9px; border: none;
    font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer;
    transition: all 0.2s; color: var(--text2); background: transparent;
  }
  .auth-tab.active {
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: #fff; box-shadow: 0 3px 12px var(--glow);
  }
  .auth-field { text-align: left; margin-bottom: 16px; }
  .auth-label {
    display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.8px;
    text-transform: uppercase; color: var(--text3); margin-bottom: 8px;
  }
  .auth-input-wrap { position: relative; }
  .auth-input-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    font-size: 16px; pointer-events: none; opacity: 0.5;
  }
  .auth-input {
    width: 100%; padding: 13px 16px 13px 42px;
    background: var(--input-bg); border: 1.5px solid var(--border);
    border-radius: 12px; font-family: inherit; font-size: 15px; color: var(--text);
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .auth-input::placeholder { color: var(--text3); }
  .auth-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(124,58,237,0.15); }
  .auth-error {
    font-size: 13px; color: #fb7185; margin-bottom: 16px;
    padding: 10px 14px; background: rgba(251,113,133,0.09);
    border-radius: 10px; border: 1px solid rgba(251,113,133,0.22); text-align: left;
  }
  .auth-success {
    font-size: 13px; color: #10b981; margin-bottom: 16px;
    padding: 10px 14px; background: rgba(16,185,129,0.09);
    border-radius: 10px; border: 1px solid rgba(16,185,129,0.22); text-align: left;
  }
  .auth-submit {
    width: 100%; padding: 14px;
    background: linear-gradient(135deg, #7c3aed, #a855f7);
    color: #fff; border: none; border-radius: 12px;
    font-family: inherit; font-size: 15px; font-weight: 700;
    cursor: pointer; box-shadow: 0 6px 24px var(--glow);
    transition: transform 0.15s, box-shadow 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .auth-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 32px var(--glow); }
  .auth-submit:disabled { opacity: 0.65; cursor: not-allowed; }
  .auth-terms { font-size: 12px; color: var(--text3); margin-top: 16px; line-height: 1.6; }
  .auth-terms a { color: var(--accent3); text-decoration: none; }

  .spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
    animation: spin 0.7s linear infinite;
  }

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

/* ── ANIMATED BACKGROUND ── */
function AnimatedBackground({ dark }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, t = 0, raf;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.4 + 0.2,
      spd: Math.random() * 0.00008 + 0.00002, op: Math.random() * 0.6 + 0.2,
      tw: Math.random() * 0.02 + 0.004, twOff: Math.random() * Math.PI * 2,
    }));
    const orbs = [
      { x: 0.15, y: 0.2, r: 0.28, h: 255, spd: 0.08 },
      { x: 0.80, y: 0.65, r: 0.22, h: 290, spd: 0.06 },
      { x: 0.50, y: 0.85, r: 0.20, h: 210, spd: 0.10 },
    ];
    const clouds = Array.from({ length: 6 }, () => ({
      x: Math.random(), y: 0.05 + Math.random() * 0.5,
      w: 0.15 + Math.random() * 0.20, h: 0.05 + Math.random() * 0.06,
      spd: 0.00004 + Math.random() * 0.00004, op: 0.5 + Math.random() * 0.35,
      puffs: Array.from({ length: 5 + Math.floor(Math.random() * 4) }, () => ({
        ox: (Math.random() - 0.4) * 0.9, oy: (Math.random() - 0.5) * 0.5, rs: 0.4 + Math.random() * 0.7,
      })),
    }));
    const draw = () => {
      t += 0.008;
      if (dark) {
        ctx.fillStyle = "#070510"; ctx.fillRect(0, 0, W, H);
        orbs.forEach((o, i) => {
          const dx = Math.sin(t * o.spd + i) * 0.05, dy = Math.cos(t * o.spd * 0.7 + i) * 0.04;
          const cx = (o.x + dx) * W, cy = (o.y + dy) * H, r = o.r * Math.min(W, H);
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          g.addColorStop(0, `hsla(${o.h},80%,55%,0.09)`); g.addColorStop(0.5, `hsla(${o.h},70%,45%,0.04)`); g.addColorStop(1, `hsla(${o.h},60%,35%,0)`);
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        });
        stars.forEach(s => {
          s.x += s.spd; if (s.x > 1) s.x -= 1;
          const a = s.op * (0.4 + 0.6 * Math.sin(t * s.tw * 50 + s.twOff));
          ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220,215,255,${a})`; ctx.fill();
        });
      } else {
        const sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, "#e8e2ff"); sky.addColorStop(0.5, "#f0ecff"); sky.addColorStop(1, "#fdf8ff");
        ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
        orbs.forEach((o, i) => {
          const dx = Math.sin(t * o.spd + i) * 0.05, dy = Math.cos(t * o.spd * 0.7 + i) * 0.04;
          const cx = (o.x + dx) * W, cy = (o.y + dy) * H, r = o.r * Math.min(W, H);
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          g.addColorStop(0, `hsla(${o.h},70%,65%,0.22)`); g.addColorStop(1, `hsla(${o.h},60%,55%,0)`);
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        });
        clouds.forEach(c => {
          c.x += c.spd; if (c.x > 1.3) c.x = -0.3;
          const cx2 = c.x * W, cy2 = c.y * H, rw = c.w * W, rh = c.h * H;
          c.puffs.forEach(p => {
            const px = cx2 + p.ox * rw, py = cy2 + p.oy * rh, pr = p.rs * rh;
            const cg = ctx.createRadialGradient(px, py - pr * 0.2, 0, px, py, pr * 1.4);
            cg.addColorStop(0, `rgba(255,255,255,${c.op})`); cg.addColorStop(1, "rgba(230,220,255,0)");
            ctx.beginPath(); ctx.arc(px, py, pr * 1.4, 0, Math.PI * 2); ctx.fillStyle = cg; ctx.fill();
          });
        });
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [dark]);
  return <canvas ref={canvasRef} className="bg-canvas" />;
}

/* ── CHAT MOCKUP ── */
function ChatMockup() {
  const msgs = [
    { from: "A", text: "Hey team! Just pushed the new update 🚀", me: false },
    { from: "B", text: "Looks great! The real-time sync is super smooth now.", me: true },
    { from: "A", text: "Thanks! Voice calls are crystal clear too 🎙️", me: false },
    { from: "B", text: "Testing it right now — works perfectly!", me: true },
  ];
  const contacts = [
    { init: "A", name: "Alex Chen", last: "Just pushed the update", active: true },
    { init: "J", name: "Jordan M.", last: "See you tomorrow!", active: false },
    { init: "S", name: "Sam K.", last: "📎 shared a file", active: false },
  ];
  return (
    <div className="mockup-frame">
      <div className="mockup-bar">
        <div className="mockup-dot" style={{ background: "#ff5f57" }} />
        <div className="mockup-dot" style={{ background: "#febc2e" }} />
        <div className="mockup-dot" style={{ background: "#28c840" }} />
        <div className="mockup-title">CosmoChat — Channel 1</div>
      </div>
      <div className="mockup-body">
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

/* ── AUTH MODAL ── */
function AuthModal({ dark, initialMode, onClose, onAuth }) {
  const [mode, setMode] = useState(initialMode || "login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const reset = () => { setError(""); setSuccess(""); setPassword(""); setConfirm(""); };
  const switchMode = (m) => { setMode(m); reset(); };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) { setError("Please fill in all fields"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Invalid credentials"); setLoading(false); return; }
      onAuth({ token: data.token, username: data.username });
    } catch { setError("Cannot connect to server"); }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!username.trim() || !password.trim() || !confirm.trim()) { setError("Please fill in all fields"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password, email: email.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); setLoading(false); return; }
      // ← Switch to login tab instead of entering chat directly
      setSuccess("Account created! Please sign in.");
      setPassword(""); setConfirm("");
      setMode("login");
    } catch { setError("Cannot connect to server"); }
    setLoading(false);
  };

  const handleKey = (e) => { if (e.key === "Enter") mode === "login" ? handleLogin() : handleRegister(); };

  return (
    <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose}>✕</button>
        <div className="auth-logo-wrap">🌌</div>
        <h2 className="auth-title">{mode === "login" ? "Welcome back" : "Join CosmoChat"}</h2>
        <p className="auth-sub">
          {mode === "login" ? "Sign in to continue your conversations" : "Create your free account and start chatting"}
        </p>

        <div className="auth-tabs">
          <button className={`auth-tab ${mode === "login" ? "active" : ""}`} onClick={() => switchMode("login")}>Sign In</button>
          <button className={`auth-tab ${mode === "register" ? "active" : ""}`} onClick={() => switchMode("register")}>Register</button>
        </div>

        {error && <div className="auth-error">⚠️ {error}</div>}
        {success && <div className="auth-success">✅ {success}</div>}

        <div className="auth-field">
          <label className="auth-label">Username</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon">👤</span>
            <input className="auth-input" value={username}
              onChange={e => setUsername(e.target.value)} onKeyDown={handleKey}
              placeholder="your_username" autoFocus />
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-label">Password</label>
          <div className="auth-input-wrap">
            <span className="auth-input-icon">🔒</span>
            <input className="auth-input" type="password" value={password}
              onChange={e => setPassword(e.target.value)} onKeyDown={handleKey}
              placeholder="••••••••" />
          </div>
        </div>

        {mode === "register" && (
          <div className="auth-field">
            <label className="auth-label">Email (optional)</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">📧</span>
              <input className="auth-input" type="email" value={email}
                onChange={e => setEmail(e.target.value)} onKeyDown={handleKey}
                placeholder="your@email.com" />
            </div>
          </div>
        )}
        {mode === "register" && (
          <div className="auth-field">
            <label className="auth-label">Confirm Password</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">🔒</span>
              <input className="auth-input" type="password" value={confirm}
                onChange={e => setConfirm(e.target.value)} onKeyDown={handleKey}
                placeholder="••••••••" />
            </div>
          </div>
        )}

        <button className="auth-submit" onClick={mode === "login" ? handleLogin : handleRegister} disabled={loading}>
          {loading ? <><div className="spinner" /> Please wait…</> : mode === "login" ? "Sign in →" : "Create account →"}
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

/* ── MAIN APP ── */
export default function App() {
  const [dark, setDark] = useState(true);
  const [auth, setAuth] = useState(() => {
    try { return JSON.parse(localStorage.getItem("nexus_auth") || "null"); } catch { return null; }
  });
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const openLogin = () => { setAuthMode("login"); setShowAuth(true); };
  const openRegister = () => { setAuthMode("register"); setShowAuth(true); };
  const handleAuth = (data) => {
    localStorage.setItem("nexus_auth", JSON.stringify(data));
    setAuth(data);
    setShowAuth(false);
  };
  const handleLogout = () => {
    localStorage.removeItem("nexus_auth");
    setAuth(null);
    setAuthMode("login");
  };
  const features = [
    { icon: "⚡", bg: "rgba(124,58,237,0.12)", title: "Real-Time Messaging", desc: "Instant message delivery powered by WebSocket technology. No delays, no refresh — just seamless conversation." },
    { icon: "🎙️", bg: "rgba(6,182,212,0.12)", title: "Crystal-Clear Voice Calls", desc: "One-click voice calls with WebRTC. Talk in real time with high-quality audio, directly in your browser." },
    { icon: "📹", bg: "rgba(236,72,153,0.12)", title: "HD Video Calls", desc: "Face-to-face conversations with HD video calling. Picture-in-picture mode keeps you in the chat while you talk." },
    { icon: "🖼️", bg: "rgba(245,158,11,0.12)", title: "Rich Media Sharing", desc: "Share photos, files, and voice messages effortlessly. Drag, drop, and send — it's that simple." },
    { icon: "🔐", bg: "rgba(16,185,129,0.12)", title: "Secure Authentication", desc: "JWT-based authentication keeps your account safe. Your conversations are yours and yours alone." },
    { icon: "🌗", bg: "rgba(168,85,247,0.12)", title: "Dark & Light Mode", desc: "A stunning animated background that adapts to your preference — deep space dark or crisp sky light." },
  ];

  const testimonials = [
    { stars: "★★★★★", text: "CosmoChat transformed how our remote team communicates. The voice call quality is absolutely outstanding.", name: "Maria Santos", role: "Engineering Lead", av: "M", bg: "linear-gradient(135deg,#7c3aed,#a855f7)" },
    { stars: "★★★★★", text: "I love how clean and fast everything feels. Switching between chat and video calls is buttery smooth.", name: "James Park", role: "Product Designer", av: "J", bg: "linear-gradient(135deg,#06b6d4,#7c3aed)" },
    { stars: "★★★★★", text: "The dark mode with the star background is gorgeous. It actually makes me want to use it more!", name: "Priya Nair", role: "Frontend Developer", av: "P", bg: "linear-gradient(135deg,#ec4899,#a855f7)" },
  ];

  if (auth) {
    return <Chat authUser={auth.username} authToken={auth.token} onLogout={handleLogout} />;
  }

  return (
    <>
      <style>{buildCSS(dark)}</style>
      <AnimatedBackground dark={dark} />

      {showAuth && (
        <AuthModal dark={dark} initialMode={authMode} onClose={() => setShowAuth(false)} onAuth={handleAuth} />
      )}

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-icon">🌌</div>
          CosmoChat
        </div>
        <div className="nav-spacer" />
        <div className="nav-actions">
          <button className="theme-toggle" onClick={() => setDark(d => !d)} title="Toggle theme">
            <div className="theme-thumb">{dark ? "🌙" : "☀️"}</div>
          </button>
          <button className="nav-link" onClick={openLogin}>Sign in</button>
          <button className="nav-btn" onClick={openRegister}>Get started free</button>
        </div>
      </nav>

      <div className="landing">

        {/* HERO */}
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
            CosmoChat brings your team together with instant messaging, HD video calls, voice messages, and file sharing — all in one elegant interface.
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

        {/* STATS */}
        <div className="stats-row">
          {[
            { num: "< 50ms", label: "Message latency" },
            { num: "WebRTC", label: "Powered voice & video" },
            { num: "256-bit", label: "JWT token security" },
            { num: "∞", label: "Messages & history" },
          ].map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* FEATURES */}
        <section className="section">
          <div className="section-label">Features</div>
          <h2 className="section-title">Everything you need to connect</h2>
          <p className="section-sub">Built for teams and individuals who care about speed, quality, and a great experience.</p>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon" style={{ background: f.bg }}><span style={{ fontSize: 24 }}>{f.icon}</span></div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-label">How it works</div>
          <h2 className="section-title">Up and running in seconds</h2>
          <p className="section-sub">No downloads. No setup. Just open your browser and start talking.</p>
          <div className="steps-row">
            {[
              { n: "01", title: "Create your account", desc: "Register in seconds with just a username and password. No email required." },
              { n: "02", title: "Join a channel", desc: "Jump straight into Channel 1 or wait for others to join. It's instant." },
              { n: "03", title: "Chat, call, share", desc: "Send messages, make voice or video calls, share files — all from one place." },
            ].map((s, i) => (
              <div key={i} className="step-item">
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-label">Loved by users</div>
          <h2 className="section-title">What people are saying</h2>
          <p className="section-sub">Real feedback from real users who rely on CosmoChat every day.</p>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
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

        {/* CTA */}
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

        {/* FOOTER */}
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