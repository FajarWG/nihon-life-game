import * as Phaser from "phaser";
import type { DialogueLine, NpcDef } from "@/core/types";
import { ITEM_MAP } from "@/data/items";
import { Bus } from "@/game/events";
import { sfx } from "@/game/audio/sfx";
import { adjustFriendship, questDef } from "@/game/systems/quests";
import { NPC_MAP } from "@/data/npcs";
import { G, gameStore, MAX_ENERGY } from "@/game/state/gameState";
import { COLOR, style } from "@/game/ui/theme";
import { Bar, panel, PixelButton, Typewriter } from "@/game/ui/widgets";

const W = 960, H = 540;
const WEEKDAYS = ["月", "火", "水", "木", "金", "土", "日"];
const SEASON_JP = { spring: "春", summer: "夏", autumn: "秋", winter: "冬" } as const;

interface DialogueOpts {
  name?: string;
  onDone?: () => void;
  choices?: { text: string; cb: () => void }[];
}

export class UIScene extends Phaser.Scene {
  private clockText!: Phaser.GameObjects.Text;
  private dayText!: Phaser.GameObjects.Text;
  private moneyText!: Phaser.GameObjects.Text;
  private jlptText!: Phaser.GameObjects.Text;
  private energyBar!: Bar;
  private weatherIcon!: Phaser.GameObjects.Image;
  private questText!: Phaser.GameObjects.Text;
  private toastY = 70;

  // dialogue
  private dlgBox!: Phaser.GameObjects.Container;
  private dlgName!: Phaser.GameObjects.Text;
  private dlgJp!: Phaser.GameObjects.Text;
  private dlgKana!: Phaser.GameObjects.Text;
  private dlgEn!: Phaser.GameObjects.Text;
  private dlgMore!: Phaser.GameObjects.Text;
  private typer!: Typewriter;
  private dlgLines: DialogueLine[] = [];
  private dlgIndex = 0;
  private dlgOpts: DialogueOpts = {};
  private dlgOpenAt = 0;
  private dlgChoiceButtons: PixelButton[] = [];
  private unsubs: (() => void)[] = [];

  constructor() { super("UI"); }

  create() {
    this.buildHud();
    this.buildDialogue();

    this.input.keyboard!.on("keydown-SPACE", () => this.advanceDialogue());
    this.input.keyboard!.on("keydown-Z", () => this.advanceDialogue());
    this.input.keyboard!.on("keydown-ENTER", () => this.advanceDialogue());
    this.input.keyboard!.on("keydown-ESC", () => this.openMenu());
    this.input.keyboard!.on("keydown-I", () => this.openMenu("inventory"));
    this.input.keyboard!.on("keydown-Q", () => this.openMenu("quests"));

    this.unsubs = [
      Bus.on("time", (() => this.refreshHud()) as never),
      Bus.on("money", (() => this.refreshHud()) as never),
      Bus.on("new-day", (() => this.refreshHud()) as never),
      Bus.on("map-changed", (() => this.refreshHud()) as never),
      Bus.on("quest-updated", (() => this.refreshQuests()) as never),
      Bus.on("toast", ((text: string, kind?: string) => this.toast(text, kind)) as never),
      Bus.on("xp", ((skill: string, amt: number) => this.toast(`+${amt} ${skill} XP`, "xp")) as never),
      Bus.on("exam-ready", (() => this.toast("JLPT exam unlocked! Visit the library desk.", "success")) as never),
      Bus.on("leveled-up", ((lv: string) => { sfx("levelup"); this.toast(`You passed! Welcome to ${lv}!`, "success"); this.refreshHud(); }) as never),
    ];
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => { this.unsubs.forEach(u => u()); this.unsubs = []; });

    this.refreshHud();
    this.refreshQuests();
  }

  /* ── HUD ─────────────────────────────────────────────────────────────── */

  private buildHud() {
    panel(this, 8, 8, 172, 52);
    this.dayText = this.add.text(18, 15, "", style(12, COLOR.accent));
    this.clockText = this.add.text(18, 34, "", style(14));
    this.weatherIcon = this.add.image(158, 34, "wx-sunny").setScale(1.6);

    panel(this, W - 188, 8, 180, 74);
    this.moneyText = this.add.text(W - 176, 15, "", style(13, COLOR.accent));
    this.jlptText = this.add.text(W - 60, 15, "", style(13, "#9ad0f0"));
    this.add.text(W - 176, 38, "体力", style(9, COLOR.dim));
    this.energyBar = new Bar(this, W - 176, 52, 156, 10, 0x7cc35c);

    this.questText = this.add.text(14, 68, "", style(9, "#d8d2c4", { lineSpacing: 4, wordWrap: { width: 240 } }));

    this.add.text(W - 10, H - 8, "[E] interact · [I] bag · [Q] quests · [ESC] menu", style(9, COLOR.dim)).setOrigin(1);
  }

  refreshHud() {
    const s = G();
    const wd = WEEKDAYS[(s.day - 1) % 7];
    this.dayText.setText(`Day ${s.day}（${wd}）· ${SEASON_JP[s.season]}`);
    const hh = Math.floor(s.minutes / 60), mm = s.minutes % 60;
    this.clockText.setText(`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
    this.moneyText.setText(`¥${s.money.toLocaleString()}`);
    this.jlptText.setText(s.jlpt);
    this.energyBar.set(s.energy / MAX_ENERGY);
    this.weatherIcon.setTexture(`wx-${s.weather}`);
  }

  private refreshQuests() {
    const s = G();
    const lines: string[] = [];
    for (const q of s.quests.active.slice(0, 3)) {
      const def = questDef(q.id);
      if (!def) continue;
      const objs = def.objectives.map(o => `${(q.progress[o.id] ?? 0)}/${o.count}`).join(" ");
      lines.push(`▸ ${def.title}  ${objs}`);
    }
    this.questText.setText(lines.join("\n"));
  }

  toast(text: string, kind = "info") {
    const colors: Record<string, string> = {
      info: COLOR.text, success: COLOR.good, warn: "#f0c040", quest: "#9ad0f0", xp: "#c8a8f0",
    };
    const t = this.add.text(W / 2, this.toastY, text, style(12, colors[kind] ?? COLOR.text, {
      backgroundColor: "#201a2ee6", padding: { x: 10, y: 5 },
    })).setOrigin(0.5, 0).setDepth(100).setAlpha(0);
    this.toastY += 26;
    this.tweens.add({ targets: t, alpha: 1, y: t.y + 4, duration: 180 });
    this.time.delayedCall(2600, () => {
      this.tweens.add({ targets: t, alpha: 0, duration: 300, onComplete: () => { t.destroy(); this.toastY -= 26; } });
    });
  }

  /* ── dialogue ────────────────────────────────────────────────────────── */

  private buildDialogue() {
    this.dlgBox = this.add.container(0, 0).setDepth(200).setVisible(false);
    const bg = panel(this, 20, H - 158, W - 40, 138);
    this.dlgName = this.add.text(38, H - 172, "", style(12, "#181420", { backgroundColor: "#c8b888", padding: { x: 8, y: 3 } }));
    this.dlgJp = this.add.text(40, H - 138, "", style(17, COLOR.text, { wordWrap: { width: W - 90 }, lineSpacing: 4 }));
    this.dlgKana = this.add.text(40, H - 106, "", style(10, COLOR.kana, { wordWrap: { width: W - 90 } }));
    this.dlgEn = this.add.text(40, H - 82, "", style(11, COLOR.dim, { wordWrap: { width: W - 90 }, fontStyle: "italic" }));
    this.dlgMore = this.add.text(W - 44, H - 36, "▼", style(13, COLOR.accent));
    this.dlgBox.add([bg, this.dlgName, this.dlgJp, this.dlgKana, this.dlgEn, this.dlgMore]);
    this.typer = new Typewriter(this, this.dlgJp);
    bg.setInteractive().on("pointerdown", () => this.advanceDialogue());
  }

  startDialogue(lines: DialogueLine[], opts: DialogueOpts = {}) {
    if (!lines.length) return;
    this.dlgLines = lines;
    this.dlgIndex = 0;
    this.dlgOpts = opts;
    this.dlgOpenAt = this.time.now;
    G().setPaused(true);
    this.dlgBox.setVisible(true);
    this.showLine();
  }

  private speakerName(line: DialogueLine): string {
    if (this.dlgOpts.name) return this.dlgOpts.name;
    if (line.speaker === "player") return G().playerName;
    if (line.speaker === "narrator") return "";
    return NPC_MAP[line.speaker]?.nameJp ?? line.speaker;
  }

  private showLine() {
    const line = this.dlgLines[this.dlgIndex];
    const name = this.speakerName(line);
    this.dlgName.setText(name).setVisible(!!name);
    this.dlgKana.setText("");
    this.dlgEn.setText("");
    this.dlgMore.setVisible(false);
    this.typer.play(line.jp, 40, () => {
      this.dlgKana.setText(line.kana ?? "");
      this.dlgEn.setText(line.en);
      this.dlgMore.setVisible(true);
    });
  }

  private advanceDialogue() {
    if (!this.dlgBox.visible) return;
    if (this.time.now - this.dlgOpenAt < 250) return;
    if (this.dlgChoiceButtons.length) return; // waiting for a choice
    const line = this.dlgLines[this.dlgIndex];
    if (!this.typer.done) {
      this.typer.finish(line.jp);
      this.dlgKana.setText(line.kana ?? "");
      this.dlgEn.setText(line.en);
      this.dlgMore.setVisible(true);
      return;
    }
    sfx("click");
    if (this.dlgIndex < this.dlgLines.length - 1) {
      this.dlgIndex++;
      this.showLine();
      return;
    }
    if (this.dlgOpts.choices?.length) {
      this.showChoices(this.dlgOpts.choices);
      return;
    }
    this.closeDialogue();
  }

  private showChoices(choices: { text: string; cb: () => void }[]) {
    const x = W - 300, yBase = H - 170 - choices.length * 40;
    choices.forEach((c, i) => {
      const btn = new PixelButton(this, x, yBase + i * 40, c.text, () => {
        this.clearChoices();
        this.closeDialogue();
        c.cb();
      }, { w: 270, h: 34 });
      btn.setDepth(210);
      this.dlgChoiceButtons.push(btn);
    });
  }

  private clearChoices() {
    this.dlgChoiceButtons.forEach(b => b.destroy());
    this.dlgChoiceButtons = [];
  }

  private closeDialogue() {
    this.dlgBox.setVisible(false);
    this.typer.stop();
    G().setPaused(false);
    const done = this.dlgOpts.onDone;
    this.dlgOpts = {};
    done?.();
  }

  /* ── NPC talk & gifts ────────────────────────────────────────────────── */

  talkToNpc(npc: NpcDef) {
    const s = G();
    const rec = s.npcs[npc.id] ?? { friendship: 0, talkedToday: false, giftedToday: false };
    const sets = npc.dialogues
      .filter(d => d.minFriendship <= rec.friendship)
      .sort((a, b) => b.minFriendship - a.minFriendship);
    const set = sets[0] ?? npc.dialogues[0];

    const giftables = Object.keys(s.inventory).filter(id => {
      const def = ITEM_MAP[id];
      return def && (def.category === "gift" || def.category === "food" || def.category === "drink" || def.category === "book");
    }).slice(0, 3);

    const choices = !rec.giftedToday && giftables.length
      ? [
          ...giftables.map(id => ({
            text: `Give ${ITEM_MAP[id].nameJp}（${ITEM_MAP[id].nameEn}）`,
            cb: () => this.giveGift(npc, id),
          })),
          { text: "またね (See you)", cb: () => {} },
        ]
      : undefined;

    this.startDialogue(set.lines, {
      choices,
      onDone: () => {
        if (!rec.talkedToday) {
          adjustFriendship(npc.id, 1);
          gameStore.setState(st => ({
            npcs: { ...st.npcs, [npc.id]: { ...(st.npcs[npc.id] ?? { friendship: 1, giftedToday: false }), talkedToday: true } },
          }));
        }
        Bus.emit("quest-event", "talk", npc.id);
      },
    });
  }

  private giveGift(npc: NpcDef, itemId: string) {
    const s = G();
    if (!s.removeItem(itemId)) return;
    const fav = npc.favoriteItems.includes(itemId);
    adjustFriendship(npc.id, fav ? 2 : 1);
    gameStore.setState(st => ({
      npcs: { ...st.npcs, [npc.id]: { ...(st.npcs[npc.id] ?? { friendship: 0, talkedToday: false }), giftedToday: true } },
    }));
    sfx("success");
    this.toast(fav ? `${npc.name} loves it! ♥♥` : `${npc.name} is happy! ♥`, "success");
    Bus.emit("quest-event", "gift", npc.id);
  }

  /* ── menu ────────────────────────────────────────────────────────────── */

  private openMenu(tab: string = "menu") {
    if (this.dlgBox.visible) return;
    if (this.scene.isActive("Menu")) return;
    const map = this.scene.get("Map");
    if (map.scene.isActive()) map.scene.pause();
    this.scene.launch("Menu", { tab });
  }
}
