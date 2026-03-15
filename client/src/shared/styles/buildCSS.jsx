// shared/styles/buildCSS.js
// Generates the full application CSS string as a function of the `dark` flag.
// Extracted here because:
//  • It is a pure function (same input → same output).
//  • It is referenced by Chat.jsx's top-level <style> tag and will eventually
//    be needed by any feature component that renders its own full-page view.
//  • Keeping it separate means the 200-line CSS string doesn't inflate
//    the already-large Chat.jsx.

export const buildCSS = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body, #root { width:100%; height:100%; overflow:hidden; font-family:'Plus Jakarta Sans',sans-serif; }

  :root {
    --accent:       #c46dff;
    --accent2:      #7b8cff;
    --accent-glow:  rgba(196,109,255,0.30);
    --accent-soft:  rgba(196,109,255,0.13);
    --green:        #4ade80;
    --red:          #fb7185;
    --bubble-me:    linear-gradient(135deg,#c46dff 0%,#7b8cff 100%);
    --spring:       cubic-bezier(0.34,1.56,0.64,1);
    --out:          cubic-bezier(0.16,1,0.3,1);

    --glass:        ${dark ? "rgba(10,7,22,0.66)"     : "rgba(255,255,255,0.65)"};
    --glass2:       ${dark ? "rgba(15,10,32,0.78)"    : "rgba(255,255,255,0.88)"};
    --glass-border: ${dark ? "rgba(255,255,255,0.09)" : "rgba(160,130,210,0.30)"};
    --divider:      ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"};
    --text:         ${dark ? "#ede8ff"                : "#160830"};
    --text-sub:     ${dark ? "#9080b8"                : "#5a3e88"};
    --text-muted:   ${dark ? "#4e4268"                : "#9980bb"};
    --bubble-other: ${dark ? "rgba(28,18,52,0.88)"    : "rgba(255,255,255,0.95)"};
    --bubble-ob:    ${dark ? "rgba(255,255,255,0.08)" : "rgba(160,130,210,0.28)"};
    --input-bg:     ${dark ? "rgba(18,12,38,0.72)"    : "rgba(255,255,255,0.75)"};
    --scrollbar:    ${dark ? "rgba(196,109,255,0.22)" : "rgba(140,100,220,0.22)"};
    --hover:        ${dark ? "rgba(255,255,255,0.05)" : "rgba(120,80,200,0.08)"};
    --btn-bg:       ${dark ? "rgba(255,255,255,0.07)" : "rgba(120,80,200,0.10)"};
  }

  .page {
    position:fixed; inset:0; z-index:1;
    display:flex; align-items:center; justify-content:center; padding:0;
  }

  .theme-fab {
    position:fixed; top:10px; right:10px; z-index:999;
    width:44px; height:26px; border:none; cursor:pointer; padding:0;
    border-radius:999px; background:${dark ? "rgba(30,18,55,0.85)" : "rgba(255,255,255,0.85)"};
    backdrop-filter:blur(14px);
    border:1.5px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(140,100,200,0.35)"};
    box-shadow:0 3px 14px rgba(0,0,0,0.20);
  }
  .theme-thumb {
    position:absolute; top:3px; left:${dark ? "21px" : "3px"};
    width:20px; height:20px; border-radius:50%;
    background:${dark ? "#c46dff" : "#ffe066"};
    display:flex; align-items:center; justify-content:center;
    pointer-events:none; transition:left 0.3s var(--spring);
    box-shadow:0 1px 5px rgba(0,0,0,0.25);
  }

  @keyframes riseUp { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:none} }
  .join-card {
    width:440px; background:var(--glass2);
    backdrop-filter:blur(32px) saturate(160%); -webkit-backdrop-filter:blur(32px) saturate(160%);
    border:1px solid var(--glass-border); border-radius:28px;
    padding:54px 46px 50px; text-align:center;
    box-shadow:0 32px 80px rgba(0,0,0,0.36);
    animation:riseUp 0.45s var(--out) forwards;
  }
  .join-logo {
    width:70px; height:70px; border-radius:22px; background:var(--bubble-me);
    margin:0 auto 26px; display:flex; align-items:center; justify-content:center;
    box-shadow:0 8px 28px var(--accent-glow);
  }
  .join-title  { font-size:26px; font-weight:700; letter-spacing:-0.6px; color:var(--text); margin-bottom:7px; }
  .join-sub    { font-size:14px; color:var(--text-sub); margin-bottom:38px; line-height:1.65; }
  .join-label  { display:block; text-align:left; font-size:10.5px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--text-muted); margin-bottom:7px; }
  .join-input  {
    width:100%; background:var(--input-bg);
    border:1.5px solid var(--glass-border); border-radius:14px;
    padding:14px 17px; font-family:inherit; font-size:15px; color:var(--text); outline:none;
    transition:border-color 0.2s,box-shadow 0.2s; margin-bottom:14px;
  }
  .join-input::placeholder { color:var(--text-muted); }
  .join-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft); }
  .join-btn {
    width:100%; background:var(--bubble-me); color:#fff; border:none;
    border-radius:14px; padding:14px; font-family:inherit; font-size:15px; font-weight:700;
    cursor:pointer; box-shadow:0 6px 24px var(--accent-glow);
    transition:transform 0.15s, opacity 0.15s;
  }
  .join-btn:hover  { transform:translateY(-2px); opacity:0.92; }
  .join-btn:active { transform:none; }

  .chat-window {
    display:flex; flex-direction:row;
    width:100vw; height:100vh; min-width:0; overflow-x:hidden;
    background:var(--glass);
    backdrop-filter:blur(36px) saturate(180%); -webkit-backdrop-filter:blur(36px) saturate(180%);
    border:1px solid var(--glass-border); border-radius:0; overflow:hidden;
    box-shadow:0 40px 110px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05);
    animation:riseUp 0.42s var(--out) forwards;
  }

  .sidebar {
    width:300px; min-width:300px; height:100%; flex-direction:column;
    background:var(--glass2); backdrop-filter:blur(20px);
    border-right:1px solid var(--divider); flex-shrink:0;
  }
  .sb-top    { padding:20px 16px 14px; border-bottom:1px solid var(--divider); }
  .sb-name   { font-size:17px; font-weight:700; color:var(--text); letter-spacing:-0.4px; margin-bottom:13px; display:flex; align-items:center; gap:6px; }
  .sb-caret  { color:var(--text-muted); font-size:11px; }
  .sb-search {
    display:flex; align-items:center; gap:9px; padding:9px 13px;
    background:var(--input-bg); border:1.5px solid var(--glass-border); border-radius:12px;
    transition:border-color 0.2s, box-shadow 0.2s;
  }
  .sb-search:focus-within { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft); }
  .sb-search input { flex:1; background:transparent; border:none; outline:none; font-family:inherit; font-size:13.5px; color:var(--text); }
  .sb-search input::placeholder { color:var(--text-muted); }
  .sb-section { padding:13px 16px 5px; font-size:9.5px; font-weight:700; letter-spacing:1.3px; text-transform:uppercase; color:var(--text-muted); display:flex; align-items:center; justify-content:space-between; }
  .sb-add-btn { width:20px; height:20px; border:none; background:var(--btn-bg); border-radius:6px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
  .sb-add-btn:hover { background:var(--accent-soft); }
  .contact-list { flex:1; overflow-y:auto; padding:4px 8px 8px; }
  .contact-list::-webkit-scrollbar { width:3px; }
  .contact-list::-webkit-scrollbar-thumb { background:var(--scrollbar); border-radius:3px; }
  .contact-item { display:flex; align-items:center; gap:11px; padding:10px; border-radius:14px; cursor:pointer; transition:background 0.15s; margin-bottom:2px; }
  .contact-item:hover  { background:var(--hover); }
  .contact-item.active { background:var(--accent-soft); }
  .c-av  { width:46px; height:46px; border-radius:50%; background:var(--bubble-me); flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:17px; font-weight:700; color:#fff; position:relative; }
  .c-av.story { box-shadow:0 0 0 2px ${dark ? "#0b0810" : "rgba(255,255,255,0.9)"}, 0 0 0 4px var(--accent); }
  .c-online   { position:absolute; bottom:1px; right:1px; width:12px; height:12px; border-radius:50%; background:var(--green); border:2.5px solid ${dark ? "#0f0a20" : "#fff"}; }
  .c-info  { flex:1; min-width:0; }
  .c-name  { font-size:13.5px; font-weight:600; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .contact-item.active .c-name { color:var(--accent); }
  .c-last  { font-size:12px; color:var(--text-sub); margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .c-meta  { display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0; }
  .c-time  { font-size:10px; color:var(--text-muted); font-family:'Fira Code',monospace; }
  .c-unread { min-width:18px; height:18px; border-radius:999px; background:var(--accent); color:#fff; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; padding:0 4px; }

  .chat-panel { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; position:relative; }
  .chat-hdr {
    display:flex; align-items:center; gap:12px; padding:13px 20px;
    background:var(--glass2); backdrop-filter:blur(20px);
    border-bottom:1px solid var(--divider); flex-shrink:0;
  }
  .h-av { width:42px; height:42px; border-radius:50%; background:var(--bubble-me); display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:700; color:#fff; flex-shrink:0; box-shadow:0 0 0 2.5px var(--accent-glow); }
  .h-info   { flex:1; }
  .h-name   { font-size:15px; font-weight:700; color:var(--text); letter-spacing:-0.3px; }
  .h-status { font-size:12px; color:var(--green); display:flex; align-items:center; gap:5px; margin-top:2px; font-weight:500; }
  .h-dot    { width:7px; height:7px; background:var(--green); border-radius:50%; box-shadow:0 0 6px var(--green); animation:blink 2s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.38} }
  .h-actions { display:flex; gap:5px; }
  .h-btn { width:38px; height:38px; border:none; border-radius:11px; cursor:pointer; background:var(--btn-bg); display:flex; align-items:center; justify-content:center; border:1px solid var(--divider); transition:background 0.15s, transform 0.1s; }
  .h-btn:hover  { background:var(--accent-soft); transform:scale(1.06); }
  .h-btn:active { transform:scale(0.94); }

  .msgs { flex:1; overflow-y:auto; padding:20px 28px 12px; display:flex; flex-direction:column; gap:3px; background:transparent; }
  .msgs::-webkit-scrollbar { width:4px; }
  .msgs::-webkit-scrollbar-thumb { background:var(--scrollbar); border-radius:4px; }

  .empty-wrap { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:9px; padding-bottom:28px; }
  .empty-av   { width:70px; height:70px; border-radius:50%; background:var(--bubble-me); display:flex; align-items:center; justify-content:center; font-size:26px; font-weight:700; color:#fff; box-shadow:0 8px 28px var(--accent-glow); margin-bottom:2px; }
  .empty-name { font-size:17px; font-weight:700; color:var(--text); }
  .empty-hint { font-size:13px; color:var(--text-sub); }

  .msg-group       { display:flex; flex-direction:column; margin-bottom:6px; }
  .msg-group.me    { align-items:flex-end; }
  .msg-group.other { align-items:flex-start; }
  .msg-sender      { font-size:11px; font-weight:700; color:var(--accent); margin-bottom:3px; padding-left:38px; }
  .msg-row         { display:flex; align-items:flex-end; gap:8px; max-width:66%; }
  .msg-group.me    .msg-row { flex-direction:row-reverse; }
  .mini-av { width:28px; height:28px; border-radius:50%; flex-shrink:0; background:var(--bubble-me); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:#fff; margin-bottom:1px; }
  @keyframes pop { from{opacity:0;transform:scale(0.84) translateY(5px)} to{opacity:1;transform:none} }
  .msg-bubble { padding:11px 15px; border-radius:22px; font-size:14.5px; line-height:1.56; word-break:break-word; animation:pop 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards; transition: font-size 0.15s, padding 0.15s, border-radius 0.15s; }
  .msg-group.me    .msg-bubble { background:var(--bubble-me); color:#fff; border-bottom-right-radius:5px; box-shadow:0 3px 16px rgba(196,109,255,0.28); }
  .msg-group.other .msg-bubble { background:var(--bubble-other); color:var(--text); border-bottom-left-radius:5px; border:1px solid var(--bubble-ob); backdrop-filter:blur(12px); }
  .msg-bubble.is-image { padding:0!important; background:none!important; border:none!important; box-shadow:none!important; backdrop-filter:none!important; }
  .msg-time { font-size:10px; font-family:'Fira Code',monospace; color:var(--text-muted); margin-top:3px; padding:0 2px; }
  .msg-group.other .msg-time { padding-left:36px; }
  .msg-group.me    .msg-time  { text-align:right; }

  .msg-img   { max-width:260px; max-height:260px; border-radius:18px; display:block; object-fit:cover; box-shadow:0 5px 22px rgba(0,0,0,0.28); cursor:zoom-in; transition:transform 0.18s; }
  .msg-img:hover { transform:scale(1.03); }
  .msg-file  { display:flex; align-items:center; gap:11px; padding:11px 15px; background:rgba(196,109,255,0.10); border-radius:16px; color:inherit; text-decoration:none; font-size:13.5px; font-weight:500; border:1px solid rgba(196,109,255,0.20); transition:background 0.15s; min-width:180px; }
  .msg-file:hover { background:rgba(196,109,255,0.18); }
  .msg-file-ic { width:36px; height:36px; border-radius:10px; background:var(--bubble-me); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .msg-audio { width:220px; height:36px; accent-color:var(--accent); }

  .input-area { padding:11px 20px 16px; background:var(--glass2); backdrop-filter:blur(20px); border-top:1px solid var(--divider); flex-shrink:0; }
  .input-row { display:flex; align-items:flex-end; gap:5px; background:var(--input-bg); border:1.5px solid var(--glass-border); border-radius:999px; padding:8px 8px 8px 18px; transition:border-color 0.2s, box-shadow 0.2s; }
  .input-row:focus-within { border-color:rgba(196,109,255,0.55); box-shadow:0 0 0 3px var(--accent-soft); }
  .msg-ta { flex:1; background:transparent; border:none; outline:none; font-family:inherit; font-size:14.5px; color:var(--text); resize:none; max-height:110px; line-height:1.52; padding:3px 0; scrollbar-width:none; }
  .msg-ta::placeholder { color:var(--text-muted); }
  .msg-ta::-webkit-scrollbar { display:none; }
  .input-icons { display:flex; align-items:flex-end; gap:1px; }

  .ico-btn { width:36px; height:36px; border:none; border-radius:50%; cursor:pointer; background:var(--btn-bg); display:flex; align-items:center; justify-content:center; transition:background 0.15s, transform 0.1s; flex-shrink:0; }
  .ico-btn:hover  { background:var(--accent-soft); transform:scale(1.1); }
  .ico-btn:active { transform:scale(0.93); }
  .ico-btn.rec    { background:rgba(251,113,133,0.18); }

  .send-btn { width:36px; height:36px; border:none; cursor:pointer; background:var(--bubble-me); border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 14px var(--accent-glow); transition:transform 0.1s, box-shadow 0.15s; flex-shrink:0; }
  .send-btn:hover  { transform:scale(1.1); box-shadow:0 5px 20px var(--accent-glow); }
  .send-btn:active { transform:scale(0.93); }

  .rec-badge { display:flex; align-items:center; gap:6px; padding:6px 6px 0; font-size:12px; font-weight:500; color:var(--red); animation:fadeIn 0.2s; }
  .rec-dot   { width:7px; height:7px; background:var(--red); border-radius:50%; animation:blink 1s infinite; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  .msg-bubble.deleted { opacity:0.55; font-style:italic; font-size:13px; }
  .reactions-row { display:flex; flex-wrap:wrap; gap:4px; margin-top:5px; }
  .reaction-chip { display:flex; align-items:center; gap:3px; padding:2px 7px; border-radius:999px; background:var(--btn-bg); border:1px solid var(--glass-border); cursor:pointer; font-size:13px; transition:background 0.15s; }
  .reaction-chip:hover { background:var(--accent-soft); border-color:var(--accent); }
  .reaction-chip.mine { background:var(--accent-soft); border-color:var(--accent); }
  .reaction-count { font-size:11px; font-weight:700; color:var(--text-sub); }
  .msg-actions { position:absolute; top:-34px; display:flex; gap:3px; background:var(--glass2); border:1px solid var(--glass-border); border-radius:10px; padding:4px 6px; box-shadow:0 4px 16px rgba(0,0,0,0.3); opacity:0; pointer-events:none; transition:opacity 0.15s; z-index:10; }
  .msg-group.me    .msg-actions { right:0; }
  .msg-group.other .msg-actions { left:34px; }
  .msg-row:hover .msg-actions { opacity:1; pointer-events:all; }
  .action-btn { width:26px; height:26px; border:none; background:transparent; border-radius:7px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.12s; }
  .action-btn:hover { background:var(--hover); }
  .edit-bar { display:flex; align-items:center; gap:8px; padding:5px 16px 0; font-size:12px; color:var(--accent); }
  .edit-bar button { background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:11px; font-family:inherit; padding:0; }

  .msg-search-bar { display:flex; align-items:center; gap:8px; padding:8px 16px; background:var(--glass2); border-bottom:1px solid var(--divider); animation:fadeIn 0.15s; }
  .msg-search-input { flex:1; background:var(--input-bg); border:1.5px solid var(--glass-border); border-radius:10px; padding:7px 12px; font-family:inherit; font-size:13px; color:var(--text); outline:none; }
  .msg-search-input:focus { border-color:var(--accent); }
  .msg-search-nav { display:flex; align-items:center; gap:4px; }
  .msg-search-btn { width:28px; height:28px; border:none; background:var(--btn-bg); border-radius:8px; cursor:pointer; color:var(--text-sub); font-size:14px; display:flex; align-items:center; justify-content:center; }
  .msg-search-btn:hover { background:var(--accent-soft); }
  .msg-search-count { font-size:12px; color:var(--text-muted); min-width:48px; text-align:center; font-family:'Fira Code',monospace; }
  .msg-highlight { background:rgba(196,109,255,0.35); border-radius:3px; padding:0 2px; }
  .msg-highlight.active { background:rgba(196,109,255,0.7); color:#fff; }

  .friends-panel { position:fixed; top:0; right:0; width:320px; height:100vh; z-index:150; background:var(--glass2); border-left:1px solid var(--divider); backdrop-filter:blur(24px); display:flex; flex-direction:column; box-shadow:-8px 0 40px rgba(0,0,0,0.3); animation:slideInRight 0.25s var(--out); }
  @keyframes slideInRight { from{transform:translateX(100%)} to{transform:none} }
  .friends-hdr { padding:20px 18px 14px; border-bottom:1px solid var(--divider); display:flex; align-items:center; gap:10px; }
  .friends-title { font-size:16px; font-weight:700; color:var(--text); flex:1; }
  .friends-close { width:30px; height:30px; border:none; background:var(--btn-bg); border-radius:8px; cursor:pointer; color:var(--text-sub); font-size:16px; display:flex; align-items:center; justify-content:center; }
  .friends-close:hover { background:var(--accent-soft); }
  .friends-body { flex:1; overflow-y:auto; padding:10px 12px; }
  .friends-section { font-size:9.5px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:var(--text-muted); padding:10px 6px 5px; }
  .friend-item { display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:12px; transition:background 0.15s; }
  .friend-item:hover { background:var(--hover); }
  .friend-av { width:38px; height:38px; border-radius:50%; background:var(--bubble-me); flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; color:#fff; position:relative; }
  .friend-info { flex:1; min-width:0; }
  .friend-name { font-size:13px; font-weight:600; color:var(--text); }
  .friend-status { font-size:11.5px; color:var(--text-sub); margin-top:1px; }
  .friend-actions { display:flex; gap:5px; }
  .friend-btn { padding:4px 10px; border-radius:8px; border:none; font-family:inherit; font-size:11px; font-weight:700; cursor:pointer; }
  .friend-btn.primary { background:var(--bubble-me); color:#fff; }
  .friend-btn.danger  { background:rgba(251,113,133,0.15); color:#fb7185; border:1px solid rgba(251,113,133,0.3); }
  .friend-btn.accept  { background:rgba(74,222,128,0.15); color:#4ade80; border:1px solid rgba(74,222,128,0.3); }
  .friend-req-badge { min-width:18px; height:18px; border-radius:999px; background:#fb7185; color:#fff; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; padding:0 4px; }

  @keyframes scalePop { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:none} }
`;