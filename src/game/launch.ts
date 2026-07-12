import { readSave } from "@/core/db";
import { G } from "@/game/state/gameState";
import { ensureMainQuest, rollDailyQuest } from "@/game/systems/quests";

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
  if (opts.mode === "continue") {
    const manual = await readSave("manual");
    const auto = await readSave("auto");
    const save = (manual?.savedAt ?? 0) >= (auto?.savedAt ?? 0) ? manual ?? auto : auto ?? manual;
    if (save) G().applySave(save);
    else G().resetNew(opts.playerName || "Player");
  } else {
    G().resetNew(opts.playerName || "Player");
  }
  ensureMainQuest();
  if (!G().quests.active.some(q => q.id.startsWith("daily-"))) rollDailyQuest(G().day);
}
