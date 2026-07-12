import { LINES, STATION_MAP } from "@/data/stations";
import { speakJapanese } from "@/game/audio/speech";
import { G } from "@/game/state/gameState";
import { COLOR, style } from "@/game/ui/theme";
import { PixelButton } from "@/game/ui/widgets";
import { ActivityBase, AW, PY } from "./ActivityBase";

/**
 * Riding the train = reading the board + understanding the announcement.
 * Success reaches the IT company quickly; mistakes cost time.
 */
export class TrainScene extends ActivityBase {
  constructor() { super("Train"); }

  create() {
    this.chrome("さくら線 — Train to Work");
    this.run();
  }

  private async run() {
    const line = LINES[0];
    const dest = STATION_MAP["minatominami"]; // company district
    const platform = 1 + ((G().day + 1) % 3); // rotates: 2,3,1…

    // route map card
    await this.card(add => {
      add(this.add.text(AW / 2, PY + 56, `${line.nameJp}（${line.nameEn}）`, style(15, "#e86ca4")).setOrigin(0.5));
      const y = PY + 130;
      const startX = AW / 2 - 300;
      add(this.add.rectangle(AW / 2, y, 600, 4, line.color));
      line.stations.forEach((sid, i) => {
        const st = STATION_MAP[sid];
        const x = startX + (600 / (line.stations.length - 1)) * i;
        add(this.add.rectangle(x, y, 10, 10, 0xffffff));
        add(this.add.text(x, y - 34, st.nameJp, style(12)).setOrigin(0.5));
        add(this.add.text(x, y - 16, st.kana, style(8, COLOR.kana)).setOrigin(0.5));
        add(this.add.text(x, y + 14, st.romaji, style(8, COLOR.dim)).setOrigin(0.5));
      });
      add(this.add.text(AW / 2, y + 60, `会社は「${dest.nameJp}」駅の近くです。(The company is near ${dest.romaji} station.)`, style(11, COLOR.dim)).setOrigin(0.5));
    }, "ホームへ (To the platform)");

    // announcement
    const announcement = `まもなく、${platform}ばんせんに、${dest.kana}ゆきの でんしゃが まいります。`;
    this.setTitle("アナウンス — Announcement");
    speakJapanese(announcement);
    await this.card(add => {
      add(this.add.text(AW / 2, PY + 90, "🔊 駅のアナウンス", style(13, COLOR.dim)).setOrigin(0.5));
      add(this.add.text(AW / 2, PY + 140, announcement, style(16, COLOR.text, { wordWrap: { width: 620 }, align: "center" })).setOrigin(0.5));
      add(new PixelButton(this, AW / 2 - 110, PY + 200, "▶ もう一度 (Replay)", () => speakJapanese(announcement), { w: 220 }));
    }, "分かった (Got it)");

    const okPlatform = await this.ask(
      "どのホームですか。(Which platform?)",
      ["1番線", "2番線", "3番線", "4番線"].slice(0, 4),
      `${platform}番線`,
    );
    const okDest = await this.ask(
      "電車はどこ行きですか。(Where is the train bound for?)",
      [STATION_MAP.minatominami.nameJp, STATION_MAP.kuko.nameJp, STATION_MAP.sakuramachi.nameJp],
      dest.nameJp,
    );

    const perfect = okPlatform && okDest;
    this.finishActivity({
      activity: "train",
      timeCost: perfect ? 30 : 60,
      energyCost: 5,
      xp: { reading: 5, listening: perfect ? 8 : 3, kanji: 4 },
      title: perfect ? "無事に到着！ (Arrived smoothly!)" : "遅れて到着… (Arrived late…)",
      summary: [
        perfect ? "You caught the right train on the first try." : "You got a little lost, but made it.",
        `Arrived at ${dest.nameJp}（${dest.romaji}）.`,
      ],
    });
  }

  /** On finish we relocate the player to the office district. */
  protected finishActivity(opts: Parameters<ActivityBase["finishActivity"]>[0]) {
    super.finishActivity(opts);
    // Replace the Map scene under us so "Continue" drops the player at the office.
    const map = this.scene.get("Map");
    G().setLocation("company", 7, 7);
    map.scene.restart({ mapId: "company", spawnX: 7, spawnY: 7 });
  }
}
