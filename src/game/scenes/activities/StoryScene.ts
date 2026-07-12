import type { StoryEvent } from "@/core/types";
import { markStoryPlayed, storeStory, unplayedStory } from "@/core/db";
import { G } from "@/game/state/gameState";
import { COLOR, style } from "@/game/ui/theme";
import { PixelButton } from "@/game/ui/widgets";
import { ActivityBase, AW, PY, PH } from "./ActivityBase";

/**
 * Story time at the apartment table. Plays AI-generated story events.
 * Fully optional: with no API keys the game simply says so and moves on.
 */
export class StoryScene extends ActivityBase {
  constructor() { super("Story"); }

  create() {
    this.chrome("ものがたり — Story Time");
    this.start();
  }

  private async start() {
    const pending = await unplayedStory().catch(() => undefined);
    if (pending) { this.play(pending); return; }

    this.clearContent();
    this.content.add(this.add.text(AW / 2, PY + 120, "新しい物語を作りますか。\n(Generate a new story with AI?)", style(14, COLOR.text, { align: "center", lineSpacing: 8 })).setOrigin(0.5));
    this.content.add(this.add.text(AW / 2, PY + 180, "Requires GROQ_API_KEY / GEMINI_API_KEY on the server.\nThe rest of the game works fully offline.", style(9, COLOR.dim, { align: "center" })).setOrigin(0.5));
    this.content.add(new PixelButton(this, AW / 2 - 130, PY + 230, "✨ 作る (Generate)", () => this.generate(), { w: 260 }));
  }

  private async generate() {
    this.clearContent();
    const spinner = this.add.text(AW / 2, PY + PH / 2, "物語を書いています… (Writing your story…)", style(13, COLOR.kana)).setOrigin(0.5);
    this.content.add(spinner);
    this.tweens.add({ targets: spinner, alpha: 0.4, yoyo: true, repeat: -1, duration: 500 });

    const s = G();
    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: s.playerName, level: s.jlpt, day: s.day,
          season: s.season, weather: s.weather, kind: "daily",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      await storeStory(data.event as StoryEvent);
      this.play(data.event as StoryEvent);
    } catch (e) {
      this.clearContent();
      this.content.add(this.add.text(AW / 2, PY + 140, "物語が届きませんでした…\n(Couldn't reach the storyteller.)", style(13, COLOR.bad, { align: "center", lineSpacing: 8 })).setOrigin(0.5));
      this.content.add(this.add.text(AW / 2, PY + 200, e instanceof Error ? e.message : "unknown error", style(9, COLOR.dim, { wordWrap: { width: 600 }, align: "center" })).setOrigin(0.5));
      this.content.add(new PixelButton(this, AW / 2 - 90, PY + 260, "閉じる (Close)", () => this.cancel(), { w: 180 }));
    }
  }

  private async play(event: StoryEvent) {
    await markStoryPlayed(event.id).catch(() => {});
    this.setTitle(`${event.titleJp} — ${event.title}`);

    // intro card
    await this.card(add => {
      add(this.add.text(AW / 2, PY + 110, event.titleJp, style(22, COLOR.accent)).setOrigin(0.5));
      add(this.add.text(AW / 2, PY + 146, event.title, style(12, COLOR.dim)).setOrigin(0.5));
      add(this.add.text(AW / 2, PY + 200, event.setting, style(11, COLOR.text, { wordWrap: { width: 560 }, align: "center" })).setOrigin(0.5));
      add(this.add.text(AW / 2, PY + 250, `文法: ${event.grammarFocus} · JLPT ${event.level}`, style(10, COLOR.kana)).setOrigin(0.5));
    }, "はじめる (Begin)");

    // play lines one card at a time
    for (const line of event.lines) {
      await this.card(add => {
        add(this.add.text(AW / 2, PY + 90, line.speaker === "narrator" ? "" : `— ${line.speaker} —`, style(11, COLOR.dim)).setOrigin(0.5));
        add(this.add.text(AW / 2, PY + 150, line.jp, style(18, COLOR.text, { wordWrap: { width: 620 }, align: "center", lineSpacing: 6 })).setOrigin(0.5));
        add(this.add.text(AW / 2, PY + 210, line.kana ?? "", style(11, COLOR.kana, { wordWrap: { width: 620 }, align: "center" })).setOrigin(0.5));
        add(this.add.text(AW / 2, PY + 250, line.en, style(11, COLOR.dim, { wordWrap: { width: 620 }, align: "center", fontStyle: "italic" })).setOrigin(0.5));
      }, "▼");
    }

    // vocabulary recap
    if (event.vocabulary.length) {
      await this.card(add => {
        add(this.add.text(AW / 2, PY + 80, "今日の言葉 (Today's words)", style(14, COLOR.accent)).setOrigin(0.5));
        event.vocabulary.forEach((v, i) => {
          add(this.add.text(AW / 2, PY + 130 + i * 32, `${v.jp} — ${v.en}`, style(13)).setOrigin(0.5));
        });
      }, "おわり (Finish)");
    }

    this.finishActivity({
      timeCost: 30,
      energyCost: 5,
      money: event.reward.money,
      xp: event.reward.xp,
      title: "いい話だった… (What a nice story…)",
      summary: [`${event.titleJp} — ${event.title}`],
    });
  }
}
