import * as Phaser from "phaser";
import { grammarByLevel } from "@/data/grammar";
import { vocabByLevel } from "@/data/vocabulary";
import { READINGS } from "@/data/drills";
import { G, gameStore } from "@/game/state/gameState";
import { getShowRomaji } from "@/game/i18n";
import { COLOR, style } from "@/game/ui/theme";
import { ActivityBase, AW, PY } from "./ActivityBase";

/** The JLPT level-up exam: grammar + vocab + reading, pass with 4/6. */
export class ExamScene extends ActivityBase {
  constructor() { super("Exam"); }

  create() {
    this.chrome(`JLPT ${G().jlpt} — 模擬試験 (Level-up Exam)`, false);
    this.run();
  }

  private async run() {
    const s = G();
    let score = 0;
    const total = 6;

    await this.card(add => {
      add(this.add.text(AW / 2, PY + 100, `JLPT ${s.jlpt} 卒業試験`, style(22, COLOR.accent)).setOrigin(0.5));
      add(this.add.text(AW / 2, PY + 150, `6問中4問正解で合格です。\nAnswer 4 of 6 correctly to pass. がんばって！`, style(13, COLOR.text, { align: "center", lineSpacing: 8 })).setOrigin(0.5));
    }, "始める (Begin)");

    // 2 grammar fill questions
    const grammarPool = grammarByLevel(s.jlpt).flatMap(g =>
      g.exercises.filter(e => e.kind === "fill" && e.sentence && e.options && e.answer).map(e => ({ g, e })));
    Phaser.Utils.Array.Shuffle(grammarPool);
    for (const { e } of grammarPool.slice(0, 2)) {
      this.setTitle("文法 — Grammar");
      if (await this.ask(e.sentence!, e.options!, e.answer!, e.translation)) score++;
    }

    // 3 vocabulary questions
    const vocab = Phaser.Utils.Array.Shuffle([...vocabByLevel(s.jlpt)]);
    for (const v of vocab.slice(0, 3)) {
      this.setTitle("語彙 — Vocabulary");
      const wrong = vocab.filter(w => w.id !== v.id).slice(0, 2).map(w => w.en);
      const showRomaji = getShowRomaji();
      if (await this.ask(`「${v.jp}」（${v.kana}${showRomaji ? " — " + v.romaji : ""}）の意味は？`, [v.en, ...wrong], v.en)) score++;
    }

    // 1 reading
    const reading = READINGS.filter(r => r.level === s.jlpt)[0] ?? READINGS[0];
    this.setTitle("読解 — Reading");
    await this.card(add => {
      reading.text.forEach((line, i) => {
        add(this.add.text(AW / 2, PY + 110 + i * 40, line.jp, style(14)).setOrigin(0.5));
      });
    }, "質問へ");
    if (await this.ask(reading.question, reading.options, reading.answer)) score++;

    const passed = score >= 4;
    if (passed) s.passExam();
    else gameStore.setState(st => ({ flags: { ...st.flags, examFailedDay: st.day } }));

    this.finishActivity({
      timeCost: 90,
      energyCost: 15,
      xp: passed ? { grammar: 20, reading: 10 } : { grammar: 5 },
      title: passed ? `合格！ (PASSED!) — Welcome to ${G().jlpt}` : "不合格… (Not this time)",
      summary: [
        `Score: ${score}/${total}`,
        passed ? "New lessons, words and work tasks are unlocked!" : "Study a little more and try again — you're close.",
      ],
    });
  }
}
