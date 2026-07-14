import { GRAMMAR, grammarByLevel } from "@/data/grammar";
import { G } from "@/game/state/gameState";
import { getShowKana, getShowMeaning, L, M, meaning } from "@/game/i18n";
import { COLOR, style } from "@/game/ui/theme";
import { ActivityBase, AW, PY } from "./ActivityBase";

/** Morning grammar study at the apartment desk. */
export class StudyScene extends ActivityBase {
  constructor() { super("Study"); }

  create() {
    this.chrome("朝の勉強 — Grammar Study");
    this.run();
  }

  private pickGrammar() {
    const s = G();
    const pool = grammarByLevel(s.jlpt);
    const fresh = pool.find(g => !s.learnedGrammar.includes(g.id));
    return fresh ?? pool[(s.day - 1) % pool.length] ?? GRAMMAR[0];
  }

  private async run() {
    const g = this.pickGrammar();
    const s = G();

    // 1. lesson card
    await this.card(add => {
      add(this.add.text(AW / 2, PY + 60, g.title, style(26, COLOR.accent)).setOrigin(0.5));
      add(this.add.text(AW / 2, PY + 98, meaning(g.meaning, g.meaningIdn), style(14, COLOR.kana)).setOrigin(0.5));
      add(this.add.text(AW / 2, PY + 140, meaning(g.explanation, g.explanationIdn), style(13, COLOR.text, { wordWrap: { width: 620 }, align: "center", lineSpacing: 6 })).setOrigin(0.5, 0));
      g.examples.forEach((ex, i) => {
        const y = PY + 215 + i * (getShowKana() || getShowMeaning() ? 58 : 36);
        add(this.add.text(AW / 2, y, ex.jp, style(16)).setOrigin(0.5));
        if (getShowKana()) add(this.add.text(AW / 2, y + 22, ex.kana ?? "", style(11, COLOR.kana)).setOrigin(0.5));
        if (getShowMeaning()) {
          const meaningY = y + (getShowKana() ? 38 : 22);
          add(this.add.text(AW / 2, meaningY, M(ex), style(11, COLOR.dim)).setOrigin(0.5));
        }
      });
    }, L("練習する", "Practice", "Latihan"));

    // 2. exercises
    let score = 0;
    let total = 0;
    for (const ex of g.exercises) {
      total++;
      if (ex.kind === "order" && ex.tiles) {
        const mistakes = await this.order(`「${ex.prompt}」— build the sentence`, ex.tiles, ex.translation);
        if (mistakes === 0) score++;
      } else if (ex.kind === "fill" && ex.sentence && ex.options && ex.answer) {
        const ok = await this.ask(ex.sentence, ex.options, ex.answer, `${ex.prompt} — ${ex.translation}`);
        if (ok) score++;
      }
    }

    s.learnGrammarPoint(g.id);
    const xp = 10 + score * 5;
    this.finishActivity({
      activity: "study",
      timeCost: 60,
      energyCost: 10,
      xp: { grammar: xp },
      summary: [
        `${meaning("Learned", "Dipelajari")}: ${g.title} — ${meaning(g.meaning, g.meaningIdn)}`,
        `Exercises: ${score}/${total} perfect`,
      ],
    });
  }
}
