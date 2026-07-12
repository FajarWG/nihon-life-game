"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

/** Simple username/password gate. With no database configured, guest play is offered. */
export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guestOk, setGuestOk] = useState(false);

  const submit = async (action: "login" | "register") => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, username: username.trim(), password }),
      });
      const data = await res.json();
      // 503 = no DB configured, 502 = DB configured but unreachable → offer guest play
      if ((res.status === 503 && data.guest) || res.status === 502) {
        setGuestOk(true);
        setError(res.status === 502 ? "Database unreachable — you can still play as guest." : data.error);
        return;
      }
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="text-sm tracking-[0.4em] text-[#9ad0f0] mb-2">ログイン</div>
        <h1 className="text-4xl text-[var(--accent)] drop-shadow-[3px_3px_0_#000]">Nihon Life</h1>
      </motion.div>

      <form
        className="pixel-panel p-8 flex flex-col gap-4 w-full max-w-sm"
        onSubmit={e => { e.preventDefault(); submit("login"); }}
      >
        <label className="text-sm text-[#a89e8c]">
          ユーザー名 (Username)
          <input
            autoFocus value={username} maxLength={24}
            onChange={e => setUsername(e.target.value)}
            className="mt-1 w-full bg-[#181420] border-2 border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--border-light)]"
          />
        </label>
        <label className="text-sm text-[#a89e8c]">
          パスワード (Password)
          <input
            type="password" value={password} maxLength={72}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 w-full bg-[#181420] border-2 border-[var(--border)] px-3 py-2 outline-none focus:border-[var(--border-light)]"
          />
        </label>

        {error && <p className="text-sm text-[#e05555]">{error}</p>}

        <button type="submit" disabled={busy} className="pixel-btn w-full">
          ログイン (Log in)
        </button>
        <button type="button" disabled={busy} className="pixel-btn w-full" onClick={() => submit("register")}>
          新規登録 (Register)
        </button>

        {guestOk && (
          <button type="button" className="text-sm text-[#9ad0f0] hover:underline" onClick={() => router.push("/?guest=1")}>
            → Play as guest (local saves only)
          </button>
        )}
      </form>

      <a href="/" className="text-xs text-[#a89e8c] hover:text-[var(--accent)]">← Back to title</a>
    </main>
  );
}
