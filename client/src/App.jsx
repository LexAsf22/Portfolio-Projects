// App.jsx
// Root router only. No business logic, no CSS, no auth forms.
// Reads persisted auth from localStorage on boot, then delegates
// everything to the appropriate page component.

import { useState } from "react";
import WebSocketClient from "./WebSocketClient";
import LandingPage     from "./pages/LandingPage";

export default function App() {
  const [dark, setDark] = useState(true);

  // Persist auth across page refreshes — same key as the original file
  const [auth, setAuth] = useState(() => {
    try { return JSON.parse(localStorage.getItem("nexus_auth") || "null"); }
    catch { return null; }
  });

  // LandingPage shows the auth modal internally; it calls these two callbacks
  const handleAuth = (data) => {
    localStorage.setItem("nexus_auth", JSON.stringify(data));
    setAuth(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("nexus_auth");
    setAuth(null);
  };

  // ── Authenticated ─────────────────────────────────────────────────────────
  if (auth) {
    return (
      <WebSocketClient
        authUser={auth.username}
        authToken={auth.token}
        onLogout={handleLogout}
      />
    );
  }

  // ── Unauthenticated ───────────────────────────────────────────────────────
  return (
    <LandingPage
      dark={dark}
      onToggleDark={() => setDark(d => !d)}
      onAuth={handleAuth}
    />
  );
}