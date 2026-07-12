import * as Phaser from "phaser";
import { sfx } from "@/game/audio/sfx";
import { autoSave } from "@/game/systems/save";
import { rollDailyQuest } from "@/game/systems/quests";
import { G } from "@/game/state/gameState";
import { COLOR, style } from "@/game/ui/theme";
import { panel, PixelButton } from "@/game/ui/widgets";

const W = 960, H = 540;

/** End-of-day transition: sleep, summary, autosave, new morning. */
export class SleepScene extends Phaser.Scene {
  private forced = false;

  constructor() { super("Sleep"); }

  init(data: { forced?: boolean }) { this.forced = !!data.forced; }

  create() {
    const cover = this.add.rectangle(0, 0, W, H, 0x0c0a14, 0).setOrigin(0);
    sfx("sleep");
    this.tweens.add({
      targets: cover, alpha: 1, duration: 900,
      onComplete: () => this.endDay(),
    });
    if (this.forced) {
      this.add.text(W / 2, H / 2, "もう夜中だ…！ (It's midnight…!)", style(16, "#f0c040")).setOrigin(0.5).setDepth(5);
    }
  }

  private async endDay() {
    const g = G();
    const { xpGained, forced } = g.sleep(this.forced);
    rollDailyQuest(g.day);
    await autoSave();

    const s = G();
    panel(this, W / 2 - 220, H / 2 - 150, 440, 300);
    this.add.text(W / 2, H / 2 - 118, `Day ${s.day - 1} → Day ${s.day}`, style(18, COLOR.accent)).setOrigin(0.5);
    const lines = [
      `今日のXP (XP today): ${xpGained}`,
      `所持金 (Money): ¥${s.money.toLocaleString()}`,
      `JLPT: ${s.jlpt} · Total XP: ${s.totalXp()}`,
      forced ? "You collapsed into bed — low energy this morning." : "You slept well. Energy restored!",
      s.weather === "rain" ? "☔ It's raining today." : s.weather === "snow" ? "❄ It's snowing today." : s.weather === "cloudy" ? "☁ Cloudy skies today." : "☀ A beautiful morning.",
    ];
    lines.forEach((l, i) => this.add.text(W / 2, H / 2 - 70 + i * 30, l, style(12)).setOrigin(0.5));

    new PixelButton(this, W / 2 - 110, H / 2 + 92, "おはよう！ (Good morning!)", () => {
      this.scene.stop();
      const map = this.scene.get("Map");
      G().setLocation("apartment", 2, 2);
      map.scene.restart({ mapId: "apartment", spawnX: 2, spawnY: 2 });
    }, { w: 220 });
  }
}
