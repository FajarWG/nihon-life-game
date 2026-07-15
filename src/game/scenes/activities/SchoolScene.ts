import * as Phaser from "phaser";
import { LISTENINGS, READINGS } from "@/data/drills";
import { vocabByLevel } from "@/data/vocabulary";
import { speakJapanese } from "@/game/audio/speech";
import { getShowKana, getShowRomaji, M } from "@/game/i18n";
import { G, gameStore } from "@/game/state/gameState";
import { COLOR, style } from "@/game/ui/theme";
import { PixelButton } from "@/game/ui/widgets";
import { ActivityBase, AW, PY } from "./ActivityBase";

/** Leitner box intervals (days). */
const BOX_INTERVALS = [0, 1, 2, 4, 8, 16]; // index 1-5, index 0 unused

/** A full lesson: vocabulary, reading, listening. */
export class SchoolScene extends ActivityBase {
  constructor() { super("School"); }

  create() {
    this.chrome("日本語学校 — Today's Lesson");
    this.run();
  }

  private async run() {
    const s = G();
    const level = s.jlpt;
    const today = s.day;

    // 1. vocabulary matching — Leitner-aware selection
    const pool = vocabByLevel(level);
    const review = s.vocabReview;

    // find learned words due for review
    const due = s.learnedVocab.filter(id => {
      const r = review[id];
      if (!r) return false;
      const interval = BOX_INTERVALS[r.box] ?? 16;
      return today >= r.lastSeenDay + interval;
    });
    const dueSample = Phaser.Utils.Array.Shuffle(due).slice(0, 2);

    // fill remaining slots with new words (not yet learned)
    const newWords = pool.filter(v => !s.learnedVocab.includes(v.id));
    const needed = Math.max(0, 4 - dueSample.length);
    const offset = ((today - 1) * needed) % Math.max(1, newWords.length - needed);
    const newSample = newWords.slice(offset, offset + needed);

    const todays = [...dueSample.map(id => pool.find(v => v.id === id)!).filter(Boolean), ...newSample];
    let vocabMistakes = 0;

    if (todays.length >= 2) {
      this.setTitle("語彙 — Vocabulary");
      vocabMistakes = await this.pairs(
        "先生：「今日の言葉です。意味を合わせてください。」(Match today's words.)",
        todays.map(v => {
          const showRomaji = getShowRomaji();
          return [`${v.jp}（${v.kana}${showRomaji ? " — " + v.romaji : ""}）`, M(v)] as [string, string];
        }),
      );

      // update Leitner boxes
      const reviewUpdate = { ...review };
      const learnedUpdate = [...new Set([...s.learnedVocab, ...todays.map(v => v.id)])];
      for (const v of todays) {
        const existing = reviewUpdate[v.id];
        if (vocabMistakes === 0) {
          // perfect: promote to next box (starting at 1 for new words)
          const newBox = Math.min(5, (existing?.box ?? 0) + 1);
          reviewUpdate[v.id] = { box: newBox, lastSeenDay: today };
        } else {
          // mistakes: reset to box 1
          reviewUpdate[v.id] = { box: 1, lastSeenDay: today };
        }
      }

      gameStore.setState({ learnedVocab: learnedUpdate, vocabReview: reviewUpdate });
    }

    // 2. reading
    const readings = READINGS.filter(r => r.level === level);
    const reading = readings[(s.day - 1) % Math.max(1, readings.length)] ?? READINGS[0];
    this.setTitle("読解 — Reading");
    await this.card(add => {
      add(this.add.text(AW / 2, PY + 60, reading.title, style(18, COLOR.accent)).setOrigin(0.5));
      reading.text.forEach((line, i) => {
        const showKana = getShowKana();
        const y = PY + 110 + i * (showKana ? 65 : 45);
        add(this.add.text(AW / 2, y, line.jp, style(17)).setOrigin(0.5));
        if (showKana) add(this.add.text(AW / 2, y + 24, line.kana ?? "", style(12, COLOR.kana)).setOrigin(0.5));
      });
    }, "質問へ (To the question)");
    const readOk = await this.ask(reading.question, reading.options, reading.answer);

    // 3. listening
    const drills = LISTENINGS.filter(l => l.level === level);
    const drill = drills[(s.day - 1) % Math.max(1, drills.length)] ?? LISTENINGS[0];
    this.setTitle("聴解 — Listening");
    const listenOk = await new Promise<boolean>(resolve => {
      this.clearContent();
      this.content.add(this.add.text(AW / 2, PY + 70, "Listen and answer. 🔊", style(14)).setOrigin(0.5));
      this.content.add(new PixelButton(this, AW / 2 - 110, PY + 110, "▶ もう一度聞く (Play audio)", () => speakJapanese(drill.audioJp), { w: 220 }));
      speakJapanese(drill.audioJp);
      this.time.delayedCall(600, async () => {
        // keep the play button visible while asking below it
        const ok = await this.askBelow(drill.question, drill.options, drill.answer, drill.audioJp);
        resolve(ok);
      });
    });

    const xpVocab = Math.max(4, 12 - vocabMistakes * 2);
    this.finishActivity({
      activity: "school",
      timeCost: 180,
      energyCost: 15,
      xp: {
        vocabulary: xpVocab,
        reading: readOk ? 10 : 4,
        listening: listenOk ? 10 : 4,
        kanji: 3,
      },
      summary: [
        `Vocabulary: ${vocabMistakes === 0 ? "perfect!" : `${vocabMistakes} slips`}`,
        `Reading: ${readOk ? "correct" : "reviewed"} · Listening: ${listenOk ? "correct" : "reviewed"}`,
      ],
    });
  }

  /** Like ask(), but keeps existing content (used under the listening play button). */
  private askBelow(question: string, options: string[], answer: string, audioJp: string): Promise<boolean> {
    return new Promise(resolve => {
      const y = PY + 170;
      this.content.add(this.add.text(AW / 2, y, question, style(13)).setOrigin(0.5));
      let first = true;
      Phaser.Utils.Array.Shuffle([...options]).forEach((opt, i) => {
        const btn: PixelButton = new PixelButton(this, AW / 2 - 190, y + 30 + i * 48, opt, () => {
          if (opt === answer) {
            btn.flash(true);
            this.content.add(this.add.text(AW / 2, y + 30 + options.length * 48 + 8, audioJp, style(12, COLOR.kana)).setOrigin(0.5));
            this.time.delayedCall(900, () => resolve(first));
          } else {
            btn.flash(false);
            first = false;
          }
        }, { w: 380, h: 40 });
        this.content.add(btn);
      });
    });
  }
}
