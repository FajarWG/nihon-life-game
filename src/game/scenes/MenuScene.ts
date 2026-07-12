import * as Phaser from "phaser";
import { ITEM_MAP } from "@/data/items";
import { sfx, setMuted, isMuted } from "@/game/audio/sfx";
import { Bus } from "@/game/events";
import { manualSave } from "@/game/systems/save";
import { activeQuests, questDef } from "@/game/systems/quests";
import { G } from "@/game/state/gameState";
import { COLOR, style } from "@/game/ui/theme";
import { dim, panel, PixelButton } from "@/game/ui/widgets";

const W = 960, H = 540;
const MX = 160, MY = 60, MW = 640, MH = 420;

type Tab = "menu" | "inventory" | "quests";

export class MenuScene extends Phaser.Scene {
  private tab: Tab = "menu";
  private content!: Phaser.GameObjects.Container;

  constructor() { super("Menu"); }

  init(data: { tab?: Tab }) { this.tab = data.tab ?? "menu"; }

  create() {
    dim(this, 0.6);
    panel(this, MX, MY, MW, MH);
    this.content = this.add.container(0, 0);

    const tabs: [Tab, string][] = [["menu", "メニュー"], ["inventory", "かばん (Bag)"], ["quests", "クエスト"]];
    tabs.forEach(([t, label], i) => {
      new PixelButton(this, MX + 16 + i * 150, MY + 12, label, () => { this.tab = t; this.render(); }, { w: 140, h: 30, size: 11 });
    });
    new PixelButton(this, MX + MW - 46, MY + 12, "✕", () => this.close(), { w: 32, h: 30, size: 12 });

    this.input.keyboard!.on("keydown-ESC", () => this.close());
    this.render();
  }

  private close() {
    sfx("cancel");
    this.scene.stop();
    this.scene.resume("Map");
  }

  private render() {
    this.content.removeAll(true);
    if (this.tab === "menu") this.renderMenu();
    else if (this.tab === "inventory") this.renderInventory();
    else this.renderQuests();
  }

  private renderMenu() {
    const s = G();
    const add = (go: Phaser.GameObjects.GameObject) => this.content.add(go);
    add(this.add.text(W / 2, MY + 70, `${s.playerName} · Day ${s.day} · JLPT ${s.jlpt}`, style(14, COLOR.accent)).setOrigin(0.5));

    const skills = Object.entries(s.skills);
    skills.forEach(([skill, xp], i) => {
      add(this.add.text(MX + 90 + (i % 3) * 170, MY + 110 + Math.floor(i / 3) * 26, `${skill}: ${xp}`, style(11, COLOR.dim)));
    });

    const buttons: [string, () => void][] = [
      ["つづける (Resume)", () => this.close()],
      ["セーブ (Save game)", async () => { await manualSave(); }],
      [isMuted() ? "🔇 音を出す (Unmute)" : "🔊 ミュート (Mute)", () => { setMuted(!isMuted()); this.render(); }],
      ["タイトルへ (Quit to title)", () => { window.location.href = "/"; }],
    ];
    buttons.forEach(([label, cb], i) => {
      this.content.add(new PixelButton(this, W / 2 - 130, MY + 180 + i * 52, label, cb, { w: 260 }));
    });
  }

  private renderInventory() {
    const s = G();
    const add = (go: Phaser.GameObjects.GameObject) => this.content.add(go);
    add(this.add.text(MX + 24, MY + 60, `¥${s.money.toLocaleString()}`, style(14, COLOR.accent)));

    const entries = Object.entries(s.inventory);
    if (!entries.length) {
      add(this.add.text(W / 2, H / 2, "かばんは空です。(Your bag is empty.)", style(12, COLOR.dim)).setOrigin(0.5));
      return;
    }
    entries.slice(0, 12).forEach(([id, qty], i) => {
      const def = ITEM_MAP[id];
      if (!def) return;
      const col = i % 2, row = Math.floor(i / 2);
      const x = MX + 24 + col * 300, y = MY + 92 + row * 52;
      add(panel(this, x, y, 288, 46, true));
      add(this.add.image(x + 24, y + 23, "icons", def.icon).setScale(2));
      add(this.add.text(x + 46, y + 8, `${def.nameJp} ×${qty}`, style(11)));
      add(this.add.text(x + 46, y + 26, def.nameEn, style(8, COLOR.dim)));
      if (def.energy) {
        this.content.add(new PixelButton(this, x + 208, y + 8, `食べる +${def.energy}`, () => {
          if (G().eatItem(id)) {
            sfx("confirm");
            Bus.emit("toast", `${def.nameJp}を食べました (+${def.energy} energy)`, "success");
            this.render();
          }
        }, { w: 72, h: 28, size: 8 }));
      }
    });
  }

  private renderQuests() {
    const add = (go: Phaser.GameObjects.GameObject) => this.content.add(go);
    const quests = activeQuests();
    let y = MY + 62;
    if (!quests.length) add(this.add.text(W / 2, H / 2, "No active quests.", style(12, COLOR.dim)).setOrigin(0.5));
    for (const q of quests.slice(0, 5)) {
      add(this.add.text(MX + 24, y, `【${q.def.type}】${q.def.title}${q.def.titleJp ? `（${q.def.titleJp}）` : ""}`, style(12, COLOR.accent)));
      y += 22;
      add(this.add.text(MX + 36, y, q.def.desc, style(10, COLOR.dim, { wordWrap: { width: MW - 80 } })));
      y += 20;
      for (const obj of q.def.objectives) {
        const done = (q.progress[obj.id] ?? 0) >= obj.count;
        add(this.add.text(MX + 36, y, `${done ? "☑" : "☐"} ${obj.desc} (${q.progress[obj.id] ?? 0}/${obj.count})`, style(10, done ? COLOR.good : COLOR.text)));
        y += 18;
      }
      y += 12;
    }
    const completed = G().quests.completed.length;
    add(this.add.text(MX + 24, MY + MH - 34, `Completed quests: ${completed}`, style(10, COLOR.dim)));
  }
}
