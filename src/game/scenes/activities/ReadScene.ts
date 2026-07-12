import { READINGS } from "@/data/drills";
import { vocabByLevel } from "@/data/vocabulary";
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

    // kanji corner: match kanji words to their readings
    const kanjiPool = vocabByLevel(s.jlpt).filter(v => v.jp !== v.kana);
    let kanjiMistakes = -1;
    if (kanjiPool.length >= 3) {
      const start = (s.day * 3) % kanjiPool.length;
      const three = [0, 1, 2].map(i => kanjiPool[(start + i) % kanjiPool.length]);
      this.setTitle("漢字コーナー — Kanji Corner");
      kanjiMistakes = await this.pairs(
        "漢字の読み方を選んでください。(Match each kanji to its reading.)",
        three.map(v => [v.jp, v.kana] as [string, string]),
      );
    }

    this.finishActivity({
      timeCost: 40,
      energyCost: 8,
      xp: {
        reading: ok ? 8 : 3,
        kanji: kanjiMistakes === 0 ? 8 : kanjiMistakes > 0 ? 4 : 2,
      },
      summary: [
        ok ? "Understood perfectly." : "A tricky one — you'll get it next time.",
        kanjiMistakes === 0 ? "Kanji corner: perfect!" : kanjiMistakes > 0 ? "Kanji corner: keep practicing." : " ",
      ],
    });
  }
}
