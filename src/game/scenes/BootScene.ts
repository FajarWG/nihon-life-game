import * as Phaser from "phaser";
import { generateCharSheet, generateIcons, generateTileset, generateUiTextures } from "@/game/gfx/textures";
import { ITEMS } from "@/data/items";
import { NPCS } from "@/data/npcs";
import { readSave } from "@/core/db";
import { G } from "@/game/state/gameState";
import { ensureMainQuest, rollDailyQuest } from "@/game/systems/quests";
import { getLaunchOptions } from "@/game/launch";

const CHAR_COLORS: Record<string, { hair: string; shirt: string; pants: string }> = {
  player: { hair: "#4a3428", shirt: "#4a7ab8", pants: "#3a3a4a" },
  "npc-tanaka": { hair: "#2a2a34", shirt: "#7a5a8a", pants: "#4a4a54" },
  "npc-yuki": { hair: "#c87850", shirt: "#e88098", pants: "#5a6a8a" },
  "npc-yamada": { hair: "#3a3040", shirt: "#3a8a6a", pants: "#3a3a4a" },
  "npc-sato": { hair: "#6a6a74", shirt: "#4a90d9", pants: "#4a4a54" },
};

export class BootScene extends Phaser.Scene {
  constructor() { super("Boot"); }

  create() {
    generateTileset(this);
    generateUiTextures(this);
    generateIcons(this, ITEMS.map(i => i.icon));
    for (const [key, colors] of Object.entries(CHAR_COLORS)) {
      generateCharSheet(this, key, colors);
      this.createWalkAnims(key);
    }
    // NPCs without explicit colors get a default sheet
    for (const npc of NPCS) {
      if (!this.textures.exists(npc.sprite)) {
        generateCharSheet(this, npc.sprite, { hair: "#5a4632", shirt: "#8a6a4a", pants: "#3a3a4a" });
        this.createWalkAnims(npc.sprite);
      }
    }
    this.boot();
  }

  private createWalkAnims(key: string) {
    const dirs = ["down", "left", "right", "up"];
    dirs.forEach((dir, d) => {
      this.anims.create({
        key: `${key}-walk-${dir}`,
        frames: [1, 0, 2, 0].map(f => ({ key, frame: d * 3 + f })),
        frameRate: 8,
        repeat: -1,
      });
    });
  }

  private async boot() {
    const opts = getLaunchOptions();
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

    // wait for the pixel font so Phaser text renders crisp
    try { await document.fonts.ready; } catch { /* fallback fonts are fine */ }

    const s = G();
    this.scene.launch("UI");
    this.scene.start("Map", { mapId: s.location, spawnX: s.posX, spawnY: s.posY });
  }
}
