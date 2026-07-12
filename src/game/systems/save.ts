import type { SaveData } from "@/core/types";
import { readSave, writeSave } from "@/core/db";
import { Bus } from "@/game/events";
import { G } from "@/game/state/gameState";

/** Fire-and-forget cloud sync — silently skipped offline / without a DB. */
function pushCloud(slot: string, data: SaveData) {
  fetch("/api/save", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slot, data }),
  }).catch(() => {});
}

/** Newest cloud copy for a slot, or null when offline / not configured. */
export async function pullCloud(slot: string): Promise<SaveData | null> {
  try {
    const res = await fetch(`/api/save?slot=${slot}`);
    if (!res.ok) return null;
    const row = await res.json();
    return (row?.data as SaveData) ?? null;
  } catch {
    return null;
  }
}

export async function autoSave() {
  const data = G().toSave();
  await writeSave("auto", data);
  pushCloud("auto", data);
  Bus.emit("toast", "Auto-saved", "info");
}

export async function manualSave() {
  const data = G().toSave();
  await writeSave("manual", data);
  pushCloud("manual", data);
  Bus.emit("toast", "Game saved", "success");
}

export async function loadSlot(slot: "auto" | "manual"): Promise<boolean> {
  const data = await readSave(slot);
  if (!data) return false;
  G().applySave(data);
  return true;
}
