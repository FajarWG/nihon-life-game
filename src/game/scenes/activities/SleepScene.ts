import * as Phaser from "phaser";
import { sfx } from "@/game/audio/sfx";
import { Bus } from "@/game/events";
import { autoSave } from "@/game/systems/save";
import { rollDailyQuest } from "@/game/systems/quests";
import { G } from "@/game/state/gameState";
import { meaning } from "@/game/i18n";
import { COLOR, style } from "@/game/ui/theme";
import { flatPanel, PixelButton } from "@/game/ui/widgets";

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
    this.prefetchStory();

    const s = G();
    flatPanel(this, W / 2 - 220, H / 2 - 150, 440, 300);
    this.add.text(W / 2, H / 2 - 118, `Day ${s.day - 1} → Day ${s.day}`, style(18, COLOR.accent)).setOrigin(0.5);
    const lines = [
      `今日のXP (XP today): ${xpGained}`,
      `所持金 (Money): ¥${s.money.toLocaleString()}`,
      `JLPT: ${s.jlpt} · Total XP: ${s.totalXp()}`,
      forced ? meaning("You collapsed into bed — low energy this morning.", "Kamu ambruk ke kasur — energi pagi ini rendah.") : meaning("You slept well. Energy restored!", "Tidurmu nyenyak. Energi pulih!"),
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

  /**
   * Overnight, quietly ask the storyteller for tomorrow's tale.
   * Fully optional: silently skipped when no AI keys are configured.
   */
  private async prefetchStory() {
    try {
      const { unplayedStory, storeStory } = await import("@/core/db");
      if (await unplayedStory()) return; // one pending story is enough
      const s = G();
      const kind = (s.day % 28 === 14) ? "festival" : (s.day % 7 === 0) ? "encounter" : "daily";
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: s.playerName, level: s.jlpt, day: s.day, season: s.season, weather: s.weather, kind }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.event) {
        await storeStory(data.event);
        Bus.emit("toast", "新しい物語が届きました！(A story awaits at your table)", "quest");
      }
    } catch { /* offline is fine */ }
  }
}
