/**
 * Content-pack plumbing shared by the API route, the /admin page and the game.
 * A pack = { type, items[] } where items follow the types in core/types.ts.
 * Validation is intentionally structural (required keys, sane sizes) —
 * deep game-logic validation happens when the pack merges at boot.
 */

export const CONTENT_TYPES = [
  "vocabulary", "grammar", "items", "recipes", "stations",
  "lines", "npcs", "quests", "workTasks", "readings", "listenings",
  "kanji", "stories",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

/** Required top-level keys per item, used for cheap structural validation. */
const REQUIRED_KEYS: Record<ContentType, string[]> = {
  vocabulary: ["id", "level", "jp", "kana", "romaji", "en", "category"],
  grammar: ["id", "level", "title", "meaning", "explanation", "examples", "exercises"],
  items: ["id", "nameJp", "kana", "nameEn", "category", "price", "icon", "desc"],
  recipes: ["id", "nameJp", "kana", "nameEn", "level", "ingredients", "steps", "result"],
  stations: ["id", "nameJp", "kana", "romaji", "lines"],
  lines: ["id", "nameJp", "nameEn", "color", "stations"],
  npcs: ["id", "name", "nameJp", "age", "occupation", "sprite", "bio", "favoriteItems", "schedule", "dialogues"],
  quests: ["id", "type", "title", "desc", "objectives", "reward"],
  workTasks: ["id", "kind", "level", "title", "titleEn", "body", "question", "pay"],
  readings: ["id", "level", "title", "text", "question", "options", "answer"],
  listenings: ["id", "level", "audioJp", "question", "options", "answer"],
  kanji: ["id", "character", "onyomi", "kunyomi", "meaning", "strokeCount", "level", "exampleVocabIds"],
  stories: ["id", "kind", "title", "titleJp", "level", "setting", "lines", "vocabulary", "grammarFocus", "reward", "createdAt"],
};

export function validatePackItems(type: string, items: unknown):
  | { ok: true; items: Record<string, unknown>[] }
  | { ok: false; error: string } {
  if (!Array.isArray(items)) return { ok: false, error: "items must be a JSON array" };
  if (items.length === 0) return { ok: false, error: "items array is empty" };
  if (items.length > 500) return { ok: false, error: "max 500 items per pack" };
  const required = REQUIRED_KEYS[type as ContentType];
  if (!required) return { ok: false, error: `unknown type "${type}"` };
  const out: Record<string, unknown>[] = [];
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (typeof it !== "object" || it === null || Array.isArray(it)) {
      return { ok: false, error: `item ${i} is not an object` };
    }
    const o = it as Record<string, unknown>;
    for (const k of required) {
      if (!(k in o)) return { ok: false, error: `item ${i} ("${String(o.id ?? "?")}") missing "${k}"` };
    }
    out.push(o);
  }
  const ids = new Set<string>();
  for (const o of out) {
    const id = String(o.id);
    if (ids.has(id)) return { ok: false, error: `duplicate id "${id}" inside the pack` };
    ids.add(id);
  }
  return { ok: true, items: out };
}
