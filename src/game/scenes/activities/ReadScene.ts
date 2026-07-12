import { READINGS } from "@/data/drills";
import { G } from "@/game/state/gameState";
import { COLOR, style } from "@/game/ui/theme";
import { ActivityBase, AW, PY } from "./ActivityBase";

/** Quiet reading practice at the library. Repeatable. */
export class ReadScene extends ActivityBase {
  constructor() { super("Read"); }

  create() {
    this.chrome("図書館 — Reading Practice");
    this.run();
  }

  private async run() {
    const s = G();
    const pool = READINGS.filter(r => r.level === s.jlpt);
    const passage = pool[(s.day + s.minutes) % Math.max(1, pool.length)] ?? READINGS[0];

    await this.card(add => {
      add(this.add.text(AW / 2, PY + 60, passage.title, style(16, COLOR.accent)).setOrigin(0.5));
      passage.text.forEach((line, i) => {
        const y = PY + 110 + i * 58;
        add(this.add.text(AW / 2, y, line.jp, style(15)).setOrigin(0.5));
        add(this.add.text(AW / 2, y + 20, line.kana ?? "", style(9, COLOR.kana)).setOrigin(0.5));
      });
    }, "質問へ (To the question)");

    const ok = await this.ask(passage.question, passage.options, passage.answer);

    this.finishActivity({
      timeCost: 40,
      energyCost: 8,
      xp: { reading: ok ? 8 : 3, kanji: 2 },
      summary: [ok ? "Understood perfectly." : "A tricky one — you'll get it next time."],
    });
  }
}
