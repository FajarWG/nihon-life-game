import { GRAMMAR } from "@/data/grammar";
import { ITEMS } from "@/data/items";
import { NPCS } from "@/data/npcs";
import { QUESTS } from "@/data/quests";
import { RECIPES } from "@/data/recipes";
import { LINES, STATIONS } from "@/data/stations";
import { LISTENINGS, READINGS } from "@/data/drills";
import { VOCABULARY } from "@/data/vocabulary";
import { WORK_TASKS } from "@/data/workTasks";
import type { ContentType } from "./schema";

/**
 * Builds copy-paste prompts for generating new content with any AI chat.
 * Each prompt embeds the exact TypeScript shape plus the ids that already
 * exist, so generated packs slot in without collisions.
 */

const SHAPES: Record<ContentType, string> = {
  vocabulary: `{
  "id": "v5-xxx",            // unique, prefix v5-/v4-/v3- by level
  "level": "N5" | "N4" | "N3",
  "jp": "水",                 // written form (kanji where natural)
  "kana": "みず",
  "romaji": "mizu",
  "en": "water",
  "idn": "air",                // Indonesian gloss
  "category": "school" | "food" | "shopping" | "train" | "work" | "daily" | "time" | "place"
}`,
  grammar: `{
  "id": "g5-xxx",
  "level": "N5" | "N4" | "N3",
  "title": "〜たいです",
  "meaning": "want to do",
  "meaningIdn": "ingin melakukan",
  "explanation": "1-3 friendly english sentences",
  "examples": [ { "jp": "...", "kana": "...", "en": "...", "idn": "..." } ],   // 2 examples
  "exercises": [                                                  // 2-3 exercises
    { "kind": "order", "prompt": "english meaning", "tiles": ["私","は","学生","です"], "translation": "私は学生です。" },
    { "kind": "fill", "prompt": "instruction", "sentence": "田中さんは先生___。", "options": ["です","ます","だます"], "answer": "です", "translation": "..." }
  ]
}`,
  items: `{
  "id": "kebab-id",
  "nameJp": "卵", "kana": "たまご", "nameEn": "Egg",
  "category": "ingredient" | "food" | "drink" | "gift" | "book",
  "price": 120,               // yen, 0 = not sold
  "icon": "egg",              // reuse an existing icon key (see list below)
  "energy": 15,               // optional, restored when eaten
  "desc": "short flavor text"
}`,
  recipes: `{
  "id": "r-xxx",
  "nameJp": "味噌汁", "kana": "みそしる", "nameEn": "Miso Soup",
  "level": "N5" | "N4" | "N3",
  "ingredients": ["tofu", "miso"],          // existing item ids
  "steps": [ { "jp": "...", "kana": "...", "en": "...", "idn": "..." } ],  // 4-6 ordered steps
  "result": "meal-xxx"                       // item id of the cooked meal (add it via an items pack!)
}`,
  stations: `{
  "id": "kebab-id",
  "nameJp": "桜町", "kana": "さくらまち", "romaji": "Sakuramachi",
  "lines": ["sakura"]                        // existing line ids
}`,
  lines: `{
  "id": "kebab-id",
  "nameJp": "さくら線", "nameEn": "Sakura Line",
  "color": 15232164,                         // decimal RGB
  "stations": ["station-id", "..."]          // ordered station ids
}`,
  npcs: `{
  "id": "kebab-id",
  "name": "Tanaka-sensei", "nameJp": "田中先生",
  "age": 38, "occupation": "Japanese teacher",
  "sprite": "npc-<id>",                      // any new key gets a generated sprite
  "bio": "one line",
  "favoriteItems": ["melonpan"],             // existing item ids
  "schedule": [ { "from": 8, "to": 17, "location": "school", "x": 7, "y": 2 } ],
  "dialogues": [ { "id": "<id>-0", "minFriendship": 0, "lines": [ { "speaker": "<id>", "jp": "...", "kana": "...", "en": "...", "idn": "..." } ] } ],
  "questId": "optional-quest-id"             // starts at friendship >= 3
}`,
  quests: `{
  "id": "kebab-id",
  "type": "main" | "daily" | "side" | "school" | "work" | "cooking" | "relationship" | "festival",
  "title": "English Title", "titleJp": "日本語タイトル",
  "desc": "what to do", "descIdn": "deskripsi bahasa Indonesia",
  "objectives": [ { "id": "o1", "desc": "...", "event": "talk|gift|buy|cook|eat|activity|visit", "target": "optional-id", "count": 1 } ],
  "reward": { "money": 300, "xp": { "reading": 5 } },
  "prereq": ["optional-quest-ids"], "next": "optional-next-main-quest"
}`,
  workTasks: `{
  "id": "w-xxx",
  "kind": "bug-css" | "bug-js" | "ui-label" | "git-order" | "code-review" | "meeting" | "docs",
  "level": "N5" | "N4" | "N3",
  "title": "日本語のチケット名", "titleEn": "english",
  "body": [ { "jp": "...", "en": "...", "idn": "..." } ],
  "question": "what the player must decide",
  "options": ["a","b","c"], "answer": "a",   // for choice kinds
  "tiles": ["step1","step2"],                // for git-order instead of options
  "pairs": [["ログイン","Log in"]],           // for ui-label instead of options
  "pay": 800
}`,
  readings: `{
  "id": "read-n5-x",
  "level": "N5" | "N4" | "N3",
  "title": "私の一日",
  "text": [ { "jp": "...", "kana": "...", "en": "...", "idn": "..." } ],   // 3-4 short lines
  "question": "english comprehension question",
  "options": ["a","b","c"], "answer": "a"
}`,
  listenings: `{
  "id": "lis-n5-x",
  "level": "N5" | "N4" | "N3",
  "audioJp": "つぎは、さくらまち、さくらまちです。",   // ALL KANA (spoken by TTS)
  "question": "english question",
  "options": ["a","b","c"], "answer": "a"
}`,
};

const EXISTING: Record<ContentType, () => string[]> = {
  vocabulary: () => VOCABULARY.map(v => v.id),
  grammar: () => GRAMMAR.map(g => g.id),
  items: () => ITEMS.map(i => i.id),
  recipes: () => RECIPES.map(r => r.id),
  stations: () => STATIONS.map(s => s.id),
  lines: () => LINES.map(l => l.id),
  npcs: () => NPCS.map(n => n.id),
  quests: () => QUESTS.map(q => q.id),
  workTasks: () => WORK_TASKS.map(w => w.id),
  readings: () => READINGS.map(r => r.id),
  listenings: () => LISTENINGS.map(l => l.id),
};

const EXTRA_NOTES: Partial<Record<ContentType, string>> = {
  items: `Available icon keys: ${[...new Set(ITEMS.map(i => i.icon))].join(", ")} (or "default").`,
  recipes: `Existing item ids for ingredients: ${ITEMS.filter(i => i.category === "ingredient").map(i => i.id).join(", ")}.`,
  npcs: `Locations & sizes: town(46x32) apartment(11x8) school(14x10) konbini(12x9) supermarket(14x10) station(14x9) company(16x10) restaurant(12x9) library(12x9). Pick x/y INSIDE walls on a floor tile.`,
  quests: `Quest events: talk/gift target = npc id · buy/eat target = item id · cook target = recipe id · activity target = study|school|shopping|train|work|cooking · visit target = location id.`,
};

export function buildPrompt(type: ContentType, count: number, level: string): string {
  const existing = EXISTING[type]();
  return `You are generating game content for "Nihon Life", a cozy pixel-art RPG that teaches Japanese (JLPT ${level}) through daily life in Japan (school, konbini, trains, an IT job, cooking).

Generate ${count} new "${type}" entries as a pure JSON array. No markdown, no commentary — ONLY the JSON array.

Each entry must follow EXACTLY this shape:
${SHAPES[type]}

Rules:
- Target JLPT level: ${level}. Japanese must be level-appropriate (short simple sentences for N5).
- Every Japanese string needs correct kana readings where the shape includes them.
- Warm, everyday, culturally authentic content. No violence or romance.
- Fill every "idn" field with a natural Bahasa Indonesia translation (the game shows meanings in Indonesian).
- ids must be unique and MUST NOT collide with these existing ids:
${existing.join(", ") || "(none yet)"}
${EXTRA_NOTES[type] ? "- " + EXTRA_NOTES[type] : ""}

Return only the JSON array of ${count} entries.`;
}
