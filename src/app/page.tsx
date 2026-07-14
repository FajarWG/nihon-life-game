"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function TitlePage() {
  const router = useRouter();
  const [hasSave, setHasSave] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  // auth form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register" | "pick">("pick");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    import("@/core/db").then(({ hasAnySave }) => hasAnySave().then(setHasSave)).catch(() => {});
    fetch("/api/auth")
      .then(async res => {
        if (res.ok) setUser((await res.json()).username);
      })
      .catch(() => setError("Server unreachable — try again later."))
      .finally(() => setChecking(false));
  }, []);

  const logout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    }).catch(() => {});
    setUser(null);
  };

  const submit = async (action: "login" | "register") => {
    setBusy(true);
    setError(null);
    try {
      if (action === "register" && password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, username: username.trim(), password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      if (action === "register") {
        router.push(`/play?mode=new&name=${encodeURIComponent(username.trim())}`);
      } else {
        router.push("/play?mode=continue");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  };

  const newGame = () => {
    if (!user) { setMode("pick"); return; }
    router.push(`/play?mode=new&name=${encodeURIComponent(user)}`);
  };

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-[#a89e8c]">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="text-sm tracking-[0.4em] text-[#9ad0f0] mb-3">にほんライフ</div>
        <h1 className="text-4xl md:text-6xl font-bold text-[var(--accent)] drop-shadow-[3px_3px_0_#000]">
          Nihon Life
        </h1>
        <p className="mt-2 text-lg text-[#a89e8c]">Live · Learn · Work</p>
      </motion.div>

      {user ? (
        /* ── Logged in ── */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="pixel-panel p-8 flex flex-col items-center gap-4 w-full max-w-md"
        >
          <div className="text-sm text-[#a89e8c]">
            👤 {user} ·{" "}
            <button className="underline hover:text-[var(--accent)]" onClick={logout}>
              logout
            </button>
          </div>
          <button className="pixel-btn w-64" onClick={newGame}>
            ▶ はじめから (New Game)
          </button>
          <button
            className="pixel-btn w-64"
            disabled={!hasSave}
            onClick={() => router.push("/play?mode=continue")}
          >
            つづきから (Continue)
          </button>
          <div className="text-xs text-[#a89e8c] mt-2 text-center leading-relaxed">
            Move: WASD / arrows · Interact: E · Menu: ESC
            <br />A cozy life-sim for JLPT N5–N3 learners.
          </div>
        </motion.div>
      ) : mode === "pick" ? (
        /* ── Pick Login or Register ── */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="pixel-panel p-8 flex flex-col items-center gap-4 w-full max-w-sm"
        >
          <button className="pixel-btn w-64" onClick={() => { setMode("login"); setError(null); }}>
            ログイン (Login)
          </button>
          <button className="pixel-btn w-64" onClick={() => { setMode("register"); setError(null); }}>
            新規登録 (Register)
          </button>
        </motion.div>
      ) : (
        /* ── Login / Register form ── */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="pixel-panel p-8 flex flex-col gap-4 w-full max-w-sm"
        >
          <p className="text-sm text-[var(--accent)] text-center">
            {mode === "register" ? "新規登録 (Register)" : "ログイン (Login)"}
          </p>

          <form
            className="flex flex-col gap-3"
            onSubmit={e => { e.preventDefault(); submit(mode); }}
          >
            <label className="text-sm text-[#a89e8c]">
              ユーザー名 (Username)
              <input
                autoFocus
                value={username}
                maxLength={24}
                onChange={e => setUsername(e.target.value)}
                className="mt-1 w-full bg-[#181420] border-2 border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--border-light)]"
              />
            </label>
            <label className="text-sm text-[#a89e8c]">
              パスワード (Password)
              <input
                type="password"
                value={password}
                maxLength={72}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 w-full bg-[#181420] border-2 border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--border-light)]"
              />
            </label>
            {mode === "register" && (
              <label className="text-sm text-[#a89e8c]">
                パスワード確認 (Confirm Password)
                <input
                  type="password"
                  value={confirmPassword}
                  maxLength={72}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full bg-[#181420] border-2 border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--border-light)]"
                />
              </label>
            )}

            {error && <p className="text-sm text-[#e05555]">{error}</p>}

            <button type="submit" disabled={busy} className="pixel-btn w-full">
              {mode === "register" ? "登録して始める (Register & Start)" : "ログイン (Login)"}
            </button>
          </form>

          <button
            className="text-xs text-[#a89e8c] hover:text-[var(--text)]"
            onClick={() => { setMode("pick"); setError(null); setUsername(""); setPassword(""); setConfirmPassword(""); }}
          >
            ← back
          </button>
        </motion.div>
      )}

      <a href="/admin" className="text-xs text-[#a89e8c] hover:text-[var(--accent)] underline underline-offset-4">
        🛠 Content Workshop (admin)
      </a>
    </main>
  );
}
