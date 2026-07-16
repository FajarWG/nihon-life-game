import type {
  GrammarPoint, ItemDef, KanjiEntry, ListeningDrill, NpcDef, QuestDef,
  ReadingPassage, Recipe, Station, TrainLine, VocabEntry, WorkTask,
} from "@/core/types";
import { GRAMMAR } from "@/data/grammar";
import { ITEMS, ITEM_MAP } from "@/data/items";
import { NPCS, NPC_MAP } from "@/data/npcs";
import { QUESTS, QUEST_MAP } from "@/data/quests";
import { RECIPES, RECIPE_MAP } from "@/data/recipes";
import { LINES, STATIONS, STATION_MAP } from "@/data/stations";
import { LISTENINGS, READINGS } from "@/data/drills";
import { VOCABULARY } from "@/data/vocabulary";
import { WORK_TASKS } from "@/data/workTasks";
import { ALL_KANJI } from "@/data/kanji";
import { db } from "@/core/db";
import type { ContentType } from "./schema";

/**
 * Merges custom content packs (from /admin via Postgres) into the built-in
 * data arrays at boot. Also caches packs in IndexedDB so custom content
 * keeps working offline. Existing ids win — packs cannot overwrite built-ins.
 */

function mergeInto<T extends { id: string }>(target: T[], map: Record<string, T> | null, items: unknown[]) {
  for (const raw of items) {
    const item = raw as T;
    if (!item?.id || target.some(t => t.id === item.id)) continue;
    target.push(item);
    if (map) map[item.id] = item;
  }
}

export function mergePack(type: ContentType, items: unknown[]) {
  switch (type) {
    case "vocabulary": mergeInto<VocabEntry>(VOCABULARY, null, items); break;
    case "grammar": mergeInto<GrammarPoint>(GRAMMAR, null, items); break;
    case "items": mergeInto<ItemDef>(ITEMS, ITEM_MAP, items); break;
    case "recipes": mergeInto<Recipe>(RECIPES, RECIPE_MAP, items); break;
    case "stations": mergeInto<Station>(STATIONS, STATION_MAP, items); break;
    case "lines": mergeInto<TrainLine>(LINES, null, items); break;
    case "npcs": mergeInto<NpcDef>(NPCS, NPC_MAP, items); break;
    case "quests": mergeInto<QuestDef>(QUESTS, QUEST_MAP, items); break;
    case "workTasks": mergeInto<WorkTask>(WORK_TASKS, null, items); break;
    case "readings": mergeInto<ReadingPassage>(READINGS, null, items); break;
    case "listenings": mergeInto<ListeningDrill>(LISTENINGS, null, items); break;
    case "kanji": mergeInto<KanjiEntry>(ALL_KANJI, null, items); break;
  }
}

interface CachedPack { id: number; type: ContentType; items: unknown[] }

/**
 * Load packs from the server, falling back to the IndexedDB cache offline.
 * Called once from initializeRun before the Phaser game is created.
 */
export async function loadContentPacks() {
  let packs: CachedPack[] | null = null;
  try {
    const res = await fetch("/api/content");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.packs)) {
        packs = data.packs.map((p: CachedPack) => ({ id: p.id, type: p.type, items: p.items }));
        await db.packs.clear();
        await db.packs.bulkPut(packs!);
      }
    }
  } catch { /* offline — use the cache */ }
  if (!packs) {
    try { packs = (await db.packs.toArray()) as CachedPack[]; } catch { packs = []; }
  }
  for (const p of packs ?? []) mergePack(p.type, p.items);
}
