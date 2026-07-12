import type { WorkTask } from "@/core/types";
import { WORK_TASKS } from "@/data/workTasks";
import { G } from "@/game/state/gameState";
import { M } from "@/game/i18n";
import { COLOR, style } from "@/game/ui/theme";
import { ActivityBase, AW, PY } from "./ActivityBase";

/** A shift as a junior frontend dev: two tickets, all in Japanese. */
export class WorkScene extends ActivityBase {
  constructor() { super("Work"); }

  create() {
    this.chrome("IT会社 — Your Shift", true);
    this.run();
  }

  private pickTasks(): WorkTask[] {
    const s = G();
    const order = ["N5", "N4", "N3"];
    const eligible = WORK_TASKS.filter(t => order.indexOf(t.level) <= order.indexOf(s.jlpt));
    const start = ((s.day - 1) * 2) % Math.max(1, eligible.length);
    return [eligible[start % eligible.length], eligible[(start + 1) % eligible.length]].filter(Boolean);
  }

  private async run() {
    const tasks = this.pickTasks();
    let pay = 0;
    let solved = 0;

    for (const [i, task] of tasks.entries()) {
      this.setTitle(`チケット ${i + 1}/${tasks.length} — ${task.title}`);

      // ticket briefing
      await this.card(add => {
        add(this.add.text(AW / 2, PY + 60, `【${task.title}】`, style(16, COLOR.accent)).setOrigin(0.5));
        add(this.add.text(AW / 2, PY + 84, task.titleEn, style(10, COLOR.dim)).setOrigin(0.5));
        task.body.forEach((line, li) => {
          const y = PY + 130 + li * 52;
          add(this.add.text(AW / 2, y, line.jp, style(14, COLOR.text, { wordWrap: { width: 620 }, align: "center" })).setOrigin(0.5));
          add(this.add.text(AW / 2, y + 20, M(line), style(10, COLOR.dim)).setOrigin(0.5));
        });
      }, "作業する (Work on it)");

      let ok = false;
      if (task.kind === "ui-label" && task.pairs) {
        ok = (await this.pairs(task.question, task.pairs)) === 0;
      } else if (task.kind === "git-order" && task.tiles) {
        ok = (await this.order(task.question, task.tiles)) === 0;
      } else if (task.options && task.answer) {
        ok = await this.ask(task.question, task.options, task.answer);
      }
      if (ok) { pay += task.pay; solved++; }
      else pay += Math.round(task.pay / 2); // partial pay — senpai helped you fix it
    }

    this.finishActivity({
      activity: "work",
      timeCost: 240,
      energyCost: 20,
      money: pay,
      xp: { reading: 6 + solved * 4, kanji: 4 + solved * 2, vocabulary: 4 },
      title: solved === tasks.length ? "完璧な仕事！ (Perfect work!)" : "お疲れ様でした (Shift finished)",
      summary: [
        `Tickets closed: ${solved}/${tasks.length}${solved < tasks.length ? " (Yamada-san helped with the rest)" : ""}`,
        `Salary: ¥${pay.toLocaleString()}`,
      ],
    });
  }
}
