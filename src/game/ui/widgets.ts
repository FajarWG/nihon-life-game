import * as Phaser from "phaser";
import { PAL } from "@/game/gfx/palette";
import { COLOR, style } from "./theme";
import { sfx } from "@/game/audio/sfx";

/** 9-slice pixel panel. */
export function panel(scene: Phaser.Scene, x: number, y: number, w: number, h: number, light = false) {
  return scene.add.nineslice(x, y, light ? "panel-light" : "panel", undefined, w, h, 6, 6, 6, 6).setOrigin(0);
}

/** Flat rectangle panel — clean border, no 9-slice texture. Used for E-key menus. */
export function flatPanel(
  scene: Phaser.Scene,
  x: number, y: number, w: number, h: number,
  theme: "dark" | "light" = "dark",
) {
  const bg = theme === "light" ? "#3a2f4c" : "#2a2138";
  const border = theme === "light" ? "#c8b888" : "#8a7a5c";
  const panel = scene.add.rectangle(x, y, w, h, 0, 0).setOrigin(0).setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(border).color);
  panel.setFillStyle(Phaser.Display.Color.HexStringToColor(bg).color);
  return panel;
}

export interface ButtonOpts {
  w?: number;
  h?: number;
  size?: number;
  color?: string;
  disabled?: boolean;
}

export class PixelButton extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.NineSlice;
  private label: Phaser.GameObjects.Text;
  private cb: () => void;
  disabled: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string, cb: () => void, opts: ButtonOpts = {}) {
    super(scene, x, y);
    const w = opts.w ?? 180;
    const h = opts.h ?? 34;
    this.cb = cb;
    this.disabled = !!opts.disabled;
    this.bg = scene.add.nineslice(0, 0, "panel-light", undefined, w, h, 6, 6, 6, 6).setOrigin(0);
    this.label = scene.add.text(w / 2, h / 2, text, style(opts.size ?? 13, opts.color ?? COLOR.text, { align: "center", wordWrap: { width: w - 16 } })).setOrigin(0.5);
    if (this.disabled) { this.bg.setTint(0x666666); this.label.setColor(COLOR.dim); }
    this.add([this.bg, this.label]);
    this.setSize(w, h);
    this.bg.setInteractive({ useHandCursor: true })
      .on("pointerover", () => !this.disabled && this.bg.setTint(0x9a86c8))
      .on("pointerout", () => !this.disabled && this.bg.clearTint())
      .on("pointerdown", () => {
        if (this.disabled) return;
        sfx("click");
        this.cb();
      });
    scene.add.existing(this);
  }

  setText(t: string) { this.label.setText(t); return this; }
  setDisabled(d: boolean) {
    this.disabled = d;
    if (d) { this.bg.setTint(0x666666); this.label.setColor(COLOR.dim); }
    else { this.bg.clearTint(); this.label.setColor(COLOR.text); }
    return this;
  }
  flash(ok: boolean) {
    this.bg.setTint(ok ? 0x4caf50 : 0xc0392b);
    this.scene.time.delayedCall(350, () => this.bg?.clearTint());
  }
}

/** Simple horizontal stat bar (energy etc.). */
export class Bar extends Phaser.GameObjects.Container {
  private fill: Phaser.GameObjects.Rectangle;
  private barWidth: number;

  constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number, color: number) {
    super(scene, x, y);
    this.barWidth = w;
    const bg = scene.add.rectangle(0, 0, w, h, 0x181420).setOrigin(0);
    const border = scene.add.rectangle(-1, -1, w + 2, h + 2).setOrigin(0).setStrokeStyle(1, 0x8a7a5c);
    this.fill = scene.add.rectangle(1, 1, w - 2, h - 2, color).setOrigin(0);
    this.add([bg, border, this.fill]);
    scene.add.existing(this);
  }

  set(ratio: number) {
    this.fill.width = Math.max(0, (this.barWidth - 2) * Math.min(1, ratio));
  }
}

/** Typewriter text used by the dialogue window. */
export class Typewriter {
  private timer?: Phaser.Time.TimerEvent;
  done = true;

  constructor(private scene: Phaser.Scene, private target: Phaser.GameObjects.Text) {}

  play(full: string, cps = 40, onDone?: () => void) {
    this.stop();
    this.done = false;
    let i = 0;
    this.target.setText("");
    this.timer = this.scene.time.addEvent({
      delay: 1000 / cps,
      repeat: full.length - 1,
      callback: () => {
        i++;
        this.target.setText(full.slice(0, i));
        if (i >= full.length) { this.done = true; onDone?.(); }
      },
    });
  }

  /** Skip to the end of the current line. */
  finish(full: string) {
    this.stop();
    this.target.setText(full);
    this.done = true;
  }

  stop() { this.timer?.remove(); this.timer = undefined; }
}

export const dim = (scene: Phaser.Scene, alpha = 0.6) =>
  scene.add.rectangle(0, 0, scene.scale.width, scene.scale.height, 0x100c18, alpha).setOrigin(0).setInteractive();

export { PAL };
