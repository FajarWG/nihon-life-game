import Dexie, { type EntityTable } from "dexie";
import type { SaveData, StoryEvent } from "./types";

interface SaveRow {
  slot: string; // "auto" | "manual"
  data: SaveData;
}

interface StoryRow {
  id: string;
  event: StoryEvent;
  played: boolean;
}

interface PackRow {
  id: number;
  type: string;
  items: unknown[];
}

class NihonLifeDB extends Dexie {
  saves!: EntityTable<SaveRow, "slot">;
  stories!: EntityTable<StoryRow, "id">;
  packs!: EntityTable<PackRow, "id">;

  constructor() {
    super("nihon-life");
    this.version(1).stores({
      saves: "slot",
      stories: "id, played",
    });
    // v2: offline cache of custom content packs
    this.version(2).stores({
      saves: "slot",
      stories: "id, played",
      packs: "id, type",
    });
    // v3: vocabReview added to SaveData (Leitner box)
    this.version(3).stores({
      saves: "slot",
      stories: "id, played",
      packs: "id, type",
    });
  }
}

export const db = new NihonLifeDB();

export async function writeSave(slot: string, data: SaveData) {
  await db.saves.put({ slot, data });
}

export async function readSave(slot: string): Promise<SaveData | undefined> {
  const row = await db.saves.get(slot);
  return row?.data;
}

/** Newest save across slots, used by "Continue". */
export async function newestSave(): Promise<SaveData | undefined> {
  const rows = await db.saves.toArray();
  if (!rows.length) return undefined;
  return rows.sort((a, b) => b.data.savedAt - a.data.savedAt)[0].data;
}

export async function hasAnySave(): Promise<boolean> {
  return (await db.saves.count()) > 0;
}

export async function clearSaves() {
  await db.saves.clear();
}

export async function storeStory(event: StoryEvent) {
  await db.stories.put({ id: event.id, event, played: false });
}

export async function unplayedStory(): Promise<StoryEvent | undefined> {
  const row = await db.stories.filter(s => !s.played).first();
  return row?.event;
}

export async function markStoryPlayed(id: string) {
  await db.stories.update(id, { played: true });
}

export async function getPlayedStoryIds(): Promise<Set<string>> {
  const rows = await db.stories.filter(s => s.played).toArray();
  return new Set(rows.map(r => r.id));
}

export async function hasPlayedStory(id: string): Promise<boolean> {
  const row = await db.stories.get(id);
  return !!row?.played;
}
