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

class NihonLifeDB extends Dexie {
  saves!: EntityTable<SaveRow, "slot">;
  stories!: EntityTable<StoryRow, "id">;

  constructor() {
    super("nihon-life");
    this.version(1).stores({
      saves: "slot",
      stories: "id, played",
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
