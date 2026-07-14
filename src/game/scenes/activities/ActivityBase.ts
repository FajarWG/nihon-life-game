import * as Phaser from "phaser";
import type { SkillId } from "@/core/types";
import { sfx } from "@/game/audio/sfx";
import { G } from "@/game/state/gameState";
import { L, meaning } from "@/game/i18n";
import { COLOR, style } from "@/game/ui/theme";
import { dim, flatPanel, PixelButton } from "@/game/ui/widgets";

export const AW = 960, AH = 540;
/** main content panel bounds */
export const PX = 120, PY = 50, PW = 720, PH = 440;

export interface FinishOpts {
  activity?: string;           // marks activity done + fires quest event
  timeCost: number;            // minutes
  energyCost: number;
  xp?: Partial<Record<SkillId, number>>;
  money?: number;
  summary: string[];           // lines for the results screen
  title?: string;
}

/**
 * Base class for all activity scenes (study, school, work…).
 * Provides the pixel panel chrome and awaitable mini-game widgets so
 * activities read as simple sequential scripts.
 */
export abstract class ActivityBase extends Phaser.Scene {
  protected content!: Phaser.GameObjects.Container;
  private titleText!: Phaser.GameObjects.Text;

  protected chrome(title: string, cancellable = true) {
    dim(this, 0.65);
    flatPanel(this, PX, PY, PW, PH);
    this.titleText = this.add.text(PX + 20, PY + 14, title, style(16, COLOR.accent));
    if (cancellable) {
      new PixelButton(this, PX + PW - 46, PY + 10, "✕", () => this.cancel(), { w: 32, h: 26, size: 12 });
    }
    this.content = this.add.container(0, 0);
  }

  protected setTitle(t: string) { this.titleText.setText(t); }

  protected clearContent() {
    this.content.removeAll(true);
  }

  protected cancel() {
    sfx("cancel");
    this.close();
  }

  private close() {
    this.scene.stop();
    this.scene.resume("Map");
  }

  /** Apply costs/rewards and show the results screen. */
  protected finishActivity(opts: FinishOpts) {
    const g = G();
    g.advanceMinutes(opts.timeCost);
    g.addEnergy(-opts.energyCost);
    if (opts.money) g.addMoney(opts.money);
    if (opts.xp) for (const [skill, amt] of Object.entries(opts.xp)) {
      if (amt) g.addXp(skill as SkillId, amt);
    }
    if (opts.activity) g.markActivity(opts.activity);

    this.clearContent();
    const cy = PY + 90;
    this.content.add(this.add.text(AW / 2, cy, opts.title ?? `おつかれさま！ (${meaning("Good work!", "Kerja bagus!")})`, style(20, COLOR.good)).setOrigin(0.5));
    opts.summary.forEach((line, i) => {
      this.content.add(this.add.text(AW / 2, cy + 50 + i * 26, line, style(13)).setOrigin(0.5));
    });
    const rewards: string[] = [];
    if (opts.xp) for (const [s, a] of Object.entries(opts.xp)) if (a) rewards.push(`+${a} ${s}`);
    if (opts.money) rewards.push(`+¥${opts.money}`);
    if (rewards.length) {
      this.content.add(this.add.text(AW / 2, cy + 60 + opts.summary.length * 26, rewards.join("   "), style(13, COLOR.accent)).setOrigin(0.5));
    }
    sfx("success");
    this.content.add(new PixelButton(this, AW / 2 - 90, PY + PH - 70, L("つづける", "Continue", "Lanjut"), () => this.close(), { w: 180 }));
  }

  /* ── awaitable widgets ───────────────────────────────────────────────── */

  /** Multiple choice. Resolves true if correct (first try). */
  protected ask(question: string, options: string[], answer: string, subtitle?: string): Promise<boolean> {
    return new Promise(resolve => {
      this.clearContent();
      let y = PY + 70;
      this.content.add(this.add.text(AW / 2, y, question, style(14, COLOR.text, { wordWrap: { width: PW - 80 }, align: "center" })).setOrigin(0.5, 0));
      y += 46;
      if (subtitle) {
        this.content.add(this.add.text(AW / 2, y, subtitle, style(11, COLOR.dim, { wordWrap: { width: PW - 80 }, align: "center" })).setOrigin(0.5, 0));
        y += 34;
      }
      const shuffled = Phaser.Utils.Array.Shuffle([...options]);
      let first = true;
      shuffled.forEach((opt, i) => {
        const btn: PixelButton = new PixelButton(this, AW / 2 - 220, y + 14 + i * 48, opt, () => {
          if (opt === answer) {
            btn.flash(true); sfx("confirm");
            this.time.delayedCall(400, () => resolve(first));
          } else {
            btn.flash(false); sfx("fail");
            first = false;
          }
        }, { w: 440, h: 40 });
        this.content.add(btn);
      });
    });
  }

  /** Arrange tiles in order. Resolves number of mistakes. */
  protected order(prompt: string, tiles: string[], translation?: string): Promise<number> {
    return new Promise(resolve => {
      this.clearContent();
      this.content.add(this.add.text(AW / 2, PY + 66, prompt, style(13, COLOR.text, { wordWrap: { width: PW - 80 }, align: "center" })).setOrigin(0.5, 0));

      let next = 0;
      let mistakes = 0;
      const placed: string[] = [];
      const answerText = this.add.text(AW / 2, PY + 130, "＿".repeat(Math.min(tiles.length * 2, 20)), style(18, COLOR.accent)).setOrigin(0.5);
      this.content.add(answerText);

      const shuffled = Phaser.Utils.Array.Shuffle(tiles.map((t, i) => ({ t, i })));
      const perRow = 4;
      shuffled.forEach((tile, idx) => {
        const col = idx % perRow, row = Math.floor(idx / perRow);
        const w = 160;
        const btn: PixelButton = new PixelButton(
          this,
          AW / 2 - (perRow * (w + 10)) / 2 + col * (w + 10),
          PY + 190 + row * 52,
          tile.t,
          () => {
            if (btn.disabled) return;
            if (tile.i === next) {
              placed.push(tile.t);
              next++;
              btn.setDisabled(true);
              answerText.setText(placed.join(" "));
              sfx("click");
              if (next >= tiles.length) {
                sfx("confirm");
                if (translation) this.content.add(this.add.text(AW / 2, PY + 158, translation, style(11, COLOR.dim)).setOrigin(0.5));
                this.time.delayedCall(700, () => resolve(mistakes));
              }
            } else {
              btn.flash(false); sfx("fail");
              mistakes++;
            }
          },
          { w, h: 42 },
        );
        this.content.add(btn);
      });
    });
  }

  /** Match JP↔EN pairs. Resolves number of mistakes. */
  protected pairs(prompt: string, pairsList: [string, string][]): Promise<number> {
    return new Promise(resolve => {
      this.clearContent();
      this.content.add(this.add.text(AW / 2, PY + 60, prompt, style(13, COLOR.text, { align: "center" })).setOrigin(0.5, 0));

      let selectedLeft: { idx: number; btn: PixelButton } | null = null;
      let matched = 0;
      let mistakes = 0;

      const left = pairsList.map(p => p[0]);
      const right = Phaser.Utils.Array.Shuffle(pairsList.map(p => p[1]));

      left.forEach((jp, i) => {
        const btn: PixelButton = new PixelButton(this, AW / 2 - 330, PY + 110 + i * 52, jp, () => {
          if (btn.disabled) return;
          selectedLeft?.btn.setDisabled(false);
          selectedLeft = { idx: i, btn };
          btn.setDisabled(true); // acts as "selected" highlight
          sfx("click");
        }, { w: 300, h: 42 });
        this.content.add(btn);
      });

      right.forEach((en, i) => {
        const btn: PixelButton = new PixelButton(this, AW / 2 + 30, PY + 110 + i * 52, en, () => {
          if (btn.disabled || !selectedLeft) return;
          const jp = left[selectedLeft.idx];
          const correct = pairsList.some(p => p[0] === jp && p[1] === en);
          if (correct) {
            btn.setDisabled(true);
            btn.flash(true);
            selectedLeft = null;
            matched++;
            sfx("confirm");
            if (matched >= pairsList.length) this.time.delayedCall(500, () => resolve(mistakes));
          } else {
            btn.flash(false); sfx("fail");
            mistakes++;
            selectedLeft.btn.setDisabled(false);
            selectedLeft = null;
          }
        }, { w: 300, h: 42 });
        this.content.add(btn);
      });
    });
  }

  /** Info card with a continue button. */
  protected card(build: (add: (go: Phaser.GameObjects.GameObject) => void) => void, buttonLabel?: string): Promise<void> {
    return new Promise(resolve => {
      this.clearContent();
      build(go => this.content.add(go));
      this.content.add(new PixelButton(this, AW / 2 - 90, PY + PH - 70, buttonLabel ?? L("つぎへ", "Next", "Berikutnya"), () => resolve(), { w: 180 }));
    });
  }
}
