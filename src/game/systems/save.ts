import { readSave, writeSave } from "@/core/db";
import { Bus } from "@/game/events";
import { G } from "@/game/state/gameState";

export async function autoSave() {
  await writeSave("auto", G().toSave());
  Bus.emit("toast", "Auto-saved", "info");
}

export async function manualSave() {
  await writeSave("manual", G().toSave());
  Bus.emit("toast", "Game saved", "success");
}

export async function loadSlot(slot: "auto" | "manual"): Promise<boolean> {
  const data = await readSave(slot);
  if (!data) return false;
  G().applySave(data);
  return true;
}
