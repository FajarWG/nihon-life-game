"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

/**
 * Title screen (website side — plain React/Tailwind is fine here;
 * everything inside /play is rendered by Phaser).
 */
export default function TitlePage() {
  const router = useRouter();
  const [hasSave, setHasSave] = useState(false);
  const [name, setName] = useState("");
  const [naming, setNaming] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    import("@/core/db").then(({ hasAnySave }) => hasAnySave().then(setHasSave)).catch(() => {});
    fetch("/api/auth")
      .then(async res => {
        if (res.ok) setUser((await res.json()).username);
        else if (res.status === 401) setNeedsLogin(true); // DB present but not logged in
      })
      .catch(() => {}); // offline → guest
  }, []);

  const logout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    }).catch(() => {});
    setUser(null);
    setNeedsLogin(true);
  };

  const startNew = () => {
    const n = name.trim() || "Alex";
    router.push(`/play?mode=new&name=${encodeURIComponent(n)}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="text-sm tracking-[0.4em] text-[#9ad0f0] mb-3">にほんライフ</div>
        <h1 className="font-pixel text-4xl md:text-6xl font-bold text-[var(--accent)] drop-shadow-[3px_3px_0_#000]">
          Nihon Life
        </h1>
        <p className="mt-2 text-lg text-[#a89e8c]">Live · Learn · Work</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="pixel-panel p-8 flex flex-col items-center gap-4 w-full max-w-md"
      >
        <div className="text-xs text-[#a89e8c] -mt-2 mb-1">
          {user ? (
            <span>👤 {user} · <button className="underline hover:text-[var(--accent)]" onClick={logout}>logout</button></span>
          ) : needsLogin ? (
            <a href="/login" className="underline hover:text-[var(--accent)]">🔑 ログイン (Log in to play)</a>
          ) : (
            <span>guest mode (local saves)</span>
          )}
        </div>
        {!naming ? (
          <>
            <button
              className="pixel-btn w-64"
              onClick={() => (needsLogin ? router.push("/login") : setNaming(true))}
            >
              ▶ はじめから (New Game)
            </button>
            <button
              className="pixel-btn w-64"
              disabled={!hasSave && !user}
              onClick={() => (needsLogin ? router.push("/login") : router.push("/play?mode=continue"))}
            >
              つづきから (Continue)
            </button>
            <div className="text-xs text-[#a89e8c] mt-2 text-center leading-relaxed">
              Move: WASD / arrows · Interact: E · Menu: ESC
              <br />
              A cozy life-sim for JLPT N5–N3 learners.
            </div>
          </>
        ) : (
          <>
            <label className="text-sm text-[#a89e8c]">お名前は？ (Your name?)</label>
            <input
              autoFocus
              value={name}
              maxLength={16}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && startNew()}
              placeholder="Alex"
              className="bg-[#181420] border-2 border-[var(--border)] px-4 py-2 text-center text-lg outline-none focus:border-[var(--border-light)] w-64"
            />
            <button className="pixel-btn w-64" onClick={startNew}>
              日本へ出発！ (Depart for Japan!)
            </button>
            <button className="text-xs text-[#a89e8c] hover:text-[var(--text)]" onClick={() => setNaming(false)}>
              ← back
            </button>
          </>
        )}
      </motion.div>

      <p className="text-[10px] text-[#5a5266] max-w-md text-center">
        Optional: set GROQ_API_KEY / GEMINI_API_KEY on the server to enable AI-generated
        story events. The game is fully playable offline without them.
      </p>
      <a href="/admin" className="text-xs text-[#a89e8c] hover:text-[var(--accent)] underline underline-offset-4">
        🛠 Content Workshop (admin)
      </a>
    </main>
  );
}
