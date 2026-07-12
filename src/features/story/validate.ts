import type { DialogueLine, JlptLevel, StoryEvent } from "@/core/types";
import type { StoryContext } from "./StoryProvider";

const KINDS = new Set(["daily", "season", "festival", "quest", "holiday", "encounter"]);
const LEVELS = new Set(["N5", "N4", "N3", "N2", "N1"]);

/**
 * Hard validation of AI output. The model returns JSON only; anything that
 * doesn't match the schema is rejected so bad data can never enter a save.
 */
export function validateStoryEvent(raw: string, ctx: StoryContext): StoryEvent {
  let data: unknown;
  try {
    // tolerate accidental markdown fences
    const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
    data = JSON.parse(cleaned);
  } catch {
    throw new Error("story: response is not valid JSON");
  }
  if (typeof data !== "object" || data === null) throw new Error("story: not an object");
  const o = data as Record<string, unknown>;

  const title = str(o.title, "title");
  const titleJp = str(o.titleJp, "titleJp");
  const setting = str(o.setting, "setting");
  const grammarFocus = str(o.grammarFocus, "grammarFocus");

  if (!Array.isArray(o.lines) || o.lines.length < 3 || o.lines.length > 15) {
    throw new Error("story: lines must be an array of 3–15 entries");
  }
  const lines: DialogueLine[] = o.lines.map((l, i) => {
    const lo = l as Record<string, unknown>;
    return {
      speaker: str(lo.speaker, `lines[${i}].speaker`),
      jp: str(lo.jp, `lines[${i}].jp`),
      kana: typeof lo.kana === "string" ? lo.kana : undefined,
      en: str(lo.en, `lines[${i}].en`),
    };
  });

  const vocabulary = Array.isArray(o.vocabulary)
    ? o.vocabulary.slice(0, 8).flatMap(v => {
        const vo = v as Record<string, unknown>;
        return typeof vo.jp === "string" && typeof vo.en === "string" ? [{ jp: vo.jp, en: vo.en }] : [];
      })
    : [];

  const rewardIn = (o.reward ?? {}) as Record<string, unknown>;
  const money = clamp(num(rewardIn.money, 0), 0, 500);
  const xpIn = (rewardIn.xp ?? {}) as Record<string, unknown>;
  const xp: Record<string, number> = {};
  for (const skill of ["grammar", "vocabulary", "reading", "listening", "kanji"]) {
    const v = num(xpIn[skill], 0);
    if (v > 0) xp[skill] = clamp(v, 1, 10);
  }

  return {
    id: `story-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    kind: (KINDS.has(String(o.kind)) ? o.kind : "daily") as StoryEvent["kind"],
    title, titleJp,
    level: (LEVELS.has(String(o.level)) ? o.level : ctx.level) as JlptLevel,
    setting, lines, vocabulary, grammarFocus,
    reward: { money, xp },
    createdAt: Date.now(),
  };
}

function str(v: unknown, field: string): string {
  if (typeof v !== "string" || !v.trim()) throw new Error(`story: missing ${field}`);
  return v.trim();
}
function num(v: unknown, dflt: number): number {
  return typeof v === "number" && Number.isFinite(v) ? v : dflt;
}
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, Math.round(v))); }
