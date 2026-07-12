import { readSave } from "@/core/db";
import type { SaveData } from "@/core/types";
import { loadContentPacks } from "@/features/content/registry";
import { G } from "@/game/state/gameState";
import { ensureMainQuest, rollDailyQuest } from "@/game/systems/quests";
import { pullCloud } from "@/game/systems/save";

/** Options handed from the React shell to the Phaser boot scene. */
export interface LaunchOptions {
  mode: "new" | "continue";
  playerName: string;
}

let options: LaunchOptions = { mode: "new", playerName: "Player" };

export function setLaunchOptions(o: LaunchOptions) { options = o; }
export function getLaunchOptions(): LaunchOptions { return options; }

/**
 * Prepare the shared game state BEFORE the Phaser game is created.
 * Runs in the React shell; safe to call twice (dev StrictMode double-mount).
 */
export async function initializeRun(opts: LaunchOptions) {
  setLaunchOptions(opts);
  await loadContentPacks(); // custom content from /admin (offline-cached)
  if (opts.mode === "continue") {
    const candidates: SaveData[] = [];
    const manual = await readSave("manual");
    const auto = await readSave("auto");
    if (manual) candidates.push(manual);
    if (auto) candidates.push(auto);
    // cloud copies compete on savedAt; newest wins
    const cloudManual = await pullCloud("manual");
    const cloudAuto = await pullCloud("auto");
    if (cloudManual) candidates.push(cloudManual);
    if (cloudAuto) candidates.push(cloudAuto);
    const save = candidates.sort((a, b) => b.savedAt - a.savedAt)[0];
    if (save) G().applySave(save);
    else G().resetNew(opts.playerName || "Player");
  } else {
    G().resetNew(opts.playerName || "Player");
  }
  ensureMainQuest();
  if (!G().quests.active.some(q => q.id.startsWith("daily-"))) rollDailyQuest(G().day);
}
