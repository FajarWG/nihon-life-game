"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CONTENT_TYPES, validatePackItems, type ContentType } from "@/features/content/schema";
import { buildPrompt } from "@/features/content/prompts";

interface Pack { id: number; type: string; items: unknown[]; created_at: string }

const TYPE_LABELS: Record<ContentType, string> = {
  vocabulary: "語彙 Vocabulary", grammar: "文法 Grammar", items: "アイテム Items",
  recipes: "レシピ Recipes", stations: "駅 Stations", lines: "路線 Lines",
  npcs: "NPC", quests: "クエスト Quests", workTasks: "仕事 Work Tasks",
  readings: "読解 Readings", listenings: "聴解 Listenings",
};

/** Content workshop — lives outside the game, manages custom packs in Postgres. */
export default function AdminPage() {
  const [type, setType] = useState<ContentType>("vocabulary");
  const [count, setCount] = useState(10);
  const [level, setLevel] = useState("N5");
  const [json, setJson] = useState("");
  const [packs, setPacks] = useState<Pack[] | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ kind: "ok" | "err" | "info"; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/content");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setPacks(data.packs ?? []);
      setDbError(null);
    } catch (e) {
      setPacks([]);
      setDbError(e instanceof Error ? e.message : "cannot reach database");
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const validation = useMemo(() => {
    if (!json.trim()) return null;
    try {
      // tolerate accidental markdown fences from AI output
      const cleaned = json.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
      const parsed = JSON.parse(cleaned);
      const r = validatePackItems(type, parsed);
      return r.ok ? { ok: true as const, count: r.items.length, items: r.items } : { ok: false as const, error: r.error };
    } catch (e) {
      return { ok: false as const, error: `Invalid JSON: ${e instanceof Error ? e.message : e}` };
    }
  }, [json, type]);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(buildPrompt(type, count, level));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const save = async () => {
    if (!validation?.ok) return;
    setStatus({ kind: "info", text: "Saving…" });
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, items: validation.items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setStatus({ kind: "ok", text: `Saved pack #${data.id} (${data.count} items). The game merges it on next launch.` });
      setJson("");
      refresh();
    } catch (e) {
      setStatus({ kind: "err", text: e instanceof Error ? e.message : "save failed" });
    }
  };

  const remove = async (id: number) => {
    await fetch(`/api/content?id=${id}`, { method: "DELETE" }).catch(() => {});
    refresh();
  };

  return (
    <main className="min-h-screen p-6 md:p-10 max-w-5xl mx-auto">
      <header className="mb-8 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-pixel text-3xl text-[var(--accent)]">Content Workshop</h1>
          <p className="text-sm text-[#a89e8c] mt-1">
            Generate game content with any AI: copy a prompt → paste the JSON back → save.
            The game merges packs at launch (and caches them for offline play).
          </p>
        </div>
        <a href="/" className="pixel-btn text-sm">← Title</a>
      </header>

      {dbError && (
        <div className="pixel-panel p-4 mb-6 text-sm text-[#e05555]">
          Database unavailable: {dbError}. Set DATABASE_URL in .env and make sure Postgres is running.
        </div>
      )}

      {/* type selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CONTENT_TYPES.map(t => (
          <button
            key={t}
            onClick={() => { setType(t); setStatus(null); }}
            className={`px-3 py-1.5 text-sm border-2 transition-colors ${
              t === type
                ? "border-[var(--border-light)] bg-[#3a2f4c] text-[var(--accent)]"
                : "border-[var(--border)] bg-[var(--panel)] text-[var(--text)] hover:border-[var(--border-light)]"
            }`}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* step 1: prompt */}
        <section className="pixel-panel p-5">
          <h2 className="text-lg text-[var(--accent)] mb-3">1 · Copy the prompt</h2>
          <div className="flex gap-3 mb-4 text-sm items-center flex-wrap">
            <label className="flex items-center gap-2">
              Count
              <input
                type="number" min={1} max={100} value={count}
                onChange={e => setCount(Math.max(1, Math.min(100, Number(e.target.value) || 10)))}
                className="w-20 bg-[#181420] border-2 border-[var(--border)] px-2 py-1"
              />
            </label>
            <label className="flex items-center gap-2">
              Level
              <select
                value={level} onChange={e => setLevel(e.target.value)}
                className="bg-[#181420] border-2 border-[var(--border)] px-2 py-1"
              >
                {["N5", "N4", "N3"].map(l => <option key={l}>{l}</option>)}
              </select>
            </label>
          </div>
          <button className="pixel-btn w-full" onClick={copyPrompt}>
            {copied ? "✓ Copied!" : "📋 Copy prompt to clipboard"}
          </button>
          <p className="text-xs text-[#a89e8c] mt-3">
            Paste it into ChatGPT / Claude / Gemini / Groq — the prompt includes the exact JSON
            shape and all existing ids so nothing collides.
          </p>
        </section>

        {/* step 2: paste + save */}
        <section className="pixel-panel p-5">
          <h2 className="text-lg text-[var(--accent)] mb-3">2 · Paste the JSON &amp; save</h2>
          <textarea
            value={json}
            onChange={e => { setJson(e.target.value); setStatus(null); }}
            placeholder='[ { "id": "...", ... } ]'
            spellCheck={false}
            className="w-full h-48 bg-[#181420] border-2 border-[var(--border)] p-3 text-xs font-mono outline-none focus:border-[var(--border-light)] resize-y"
          />
          <div className="mt-3 text-sm min-h-6">
            {validation === null && <span className="text-[#a89e8c]">Waiting for JSON…</span>}
            {validation?.ok && <span className="text-[#7cc35c]">✓ Valid — {validation.count} {type} item(s) ready.</span>}
            {validation && !validation.ok && <span className="text-[#e05555]">✗ {validation.error}</span>}
          </div>
          <button className="pixel-btn w-full mt-2" disabled={!validation?.ok || !!dbError} onClick={save}>
            💾 Save pack
          </button>
          {status && (
            <p className={`text-sm mt-3 ${status.kind === "ok" ? "text-[#7cc35c]" : status.kind === "err" ? "text-[#e05555]" : "text-[#a89e8c]"}`}>
              {status.text}
            </p>
          )}
        </section>
      </div>

      {/* saved packs */}
      <section className="pixel-panel p-5 mt-6">
        <h2 className="text-lg text-[var(--accent)] mb-3">Saved packs</h2>
        {packs === null ? (
          <p className="text-sm text-[#a89e8c]">Loading…</p>
        ) : packs.length === 0 ? (
          <p className="text-sm text-[#a89e8c]">No custom packs yet. Built-in sample content is always available.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#a89e8c] border-b border-[var(--border)]">
                <th className="py-2 pr-4">#</th><th className="pr-4">Type</th>
                <th className="pr-4">Items</th><th className="pr-4">Created</th><th></th>
              </tr>
            </thead>
            <tbody>
              {packs.map(p => (
                <tr key={p.id} className="border-b border-[#3a2f4c]">
                  <td className="py-2 pr-4">{p.id}</td>
                  <td className="pr-4">{TYPE_LABELS[p.type as ContentType] ?? p.type}</td>
                  <td className="pr-4">{Array.isArray(p.items) ? p.items.length : "?"}</td>
                  <td className="pr-4 text-[#a89e8c]">{new Date(p.created_at).toLocaleString()}</td>
                  <td className="text-right">
                    <button className="text-[#e05555] hover:underline" onClick={() => remove(p.id)}>delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
