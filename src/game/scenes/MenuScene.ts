import * as Phaser from "phaser";
import { ITEM_MAP } from "@/data/items";
import { sfx, setMuted, isMuted } from "@/game/audio/sfx";
import { Bus } from "@/game/events";
import { manualSave } from "@/game/systems/save";
import { activeQuests, questDef } from "@/game/systems/quests";
import { G } from "@/game/state/gameState";
import { getMeaningLang, getShowKana, getShowMeaning, getShowRomaji, getUiLang, L, meaning, setMeaningLang, setShowKana, setShowMeaning, setShowRomaji, setUiLang } from "@/game/i18n";
import type { UiLang } from "@/game/i18n";
import { COLOR, style } from "@/game/ui/theme";
import { dim, flatPanel, PixelButton } from "@/game/ui/widgets";

const W = 960, H = 540;
const MX = 160, MY = 60, MW = 640, MH = 420;

export type Tab = "menu" | "inventory" | "quests" | "settings";

const PAGE_SIZE = 8; // 2 cols × 4 taller, readable rows

export class MenuScene extends Phaser.Scene {
  private tab: Tab = "menu";
  private page = 0;
  private content!: Phaser.GameObjects.Container;

  constructor() { super("Menu"); }

  init(data: { tab?: Tab }) { this.tab = data.tab ?? "menu"; this.page = 0; }

  create() {
    dim(this, 0.6);
    flatPanel(this, MX, MY, MW, MH);
    this.content = this.add.container(0, 0);

    const tabs: [Tab, string][] = [["menu", L("メニュー", "Menu", "Menu")], ["inventory", L("かばん", "Bag", "Tas")], ["quests", L("クエスト", "Quests", "Misi")], ["settings", "⚙"]];
    tabs.forEach(([t, label], i) => {
      new PixelButton(this, MX + 16 + i * 122, MY + 12, label, () => { this.tab = t; this.render(); }, { w: 112, h: 34, size: 13 });
    });
    new PixelButton(this, MX + MW - 46, MY + 12, "✕", () => this.close(), { w: 32, h: 30, size: 12 });

    // ESC is handled centrally by UIScene (open/close toggle) so there's only
    // one listener deciding whether a press should open, switch tab, or
    // close — having a second ESC listener here used to fire alongside
    // UIScene's on the same keypress once the menu was already open.
    this.render();
  }

  /** Called by UIScene when a shortcut (I/Q/ESC) is pressed while the menu is already open. */
  setTab(tab: Tab) {
    this.tab = tab;
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
    else if (this.tab === "quests") this.renderQuests();
    else this.renderSettings();
  }

  private renderMenu() {
    const s = G();
    const add = (go: Phaser.GameObjects.GameObject) => this.content.add(go);
    add(this.add.text(W / 2, MY + 70, `${s.playerName} · Day ${s.day} · JLPT ${s.jlpt}`, style(16, COLOR.accent)).setOrigin(0.5));

    const skills = Object.entries(s.skills);
    skills.forEach(([skill, xp], i) => {
      add(this.add.text(MX + 90 + (i % 3) * 170, MY + 108 + Math.floor(i / 3) * 28, `${skill}: ${xp}`, style(13, COLOR.dim)));
    });

    // button list used to start at a fixed offset sized for a single stat
    // row; with 5 skills (2 rows of 3) the 2nd row got covered by the first
    // button. Start below however many stat rows there actually are.
    const statRows = Math.ceil(skills.length / 3);
    const buttonsY = MY + 108 + statRows * 28 + 14;

    const buttons: [string, () => void][] = [
      [L("つづける", "Resume", "Lanjut"), () => this.close()],
      [L("セーブ", "Save game", "Simpan"), async () => { await manualSave(); }],
      [isMuted() ? L("音を出す", "Unmute", "Bunyikan") : L("ミュート", "Mute", "Bisukan"), () => { setMuted(!isMuted()); this.render(); }],
      [L("表示設定", "Language & Display", "Bahasa & Tampilan"), () => { this.tab = "settings"; this.render(); }],
      [L("タイトルへ", "Quit to title", "Keluar ke judul"), () => { window.location.href = "/"; }],
    ];
    buttons.forEach(([label, cb], i) => {
      this.content.add(new PixelButton(this, W / 2 - 130, buttonsY + i * 34, label, cb, { w: 260, h: 30 }));
    });
  }

  private renderInventory() {
    const s = G();
    const add = (go: Phaser.GameObjects.GameObject) => this.content.add(go);
    add(this.add.text(MX + 24, MY + 58, `¥${s.money.toLocaleString()}`, style(16, COLOR.accent)));

    const entries = Object.entries(s.inventory);
    if (!entries.length) {
      add(this.add.text(W / 2, H / 2, `かばんは空です。(${meaning("Your bag is empty.", "Tasmu kosong.")})`, style(14, COLOR.dim)).setOrigin(0.5));
      return;
    }
    const pages = Math.ceil(entries.length / PAGE_SIZE);
    this.page = Math.min(this.page, pages - 1);
    if (pages > 1) {
      add(this.add.text(W / 2, MY + 66, `${this.page + 1} / ${pages}`, style(11, COLOR.dim)).setOrigin(0.5));
      if (this.page > 0) this.content.add(new PixelButton(this, MX + MW - 200, MY + 52, "◀", () => { this.page--; this.render(); }, { w: 40, h: 28, size: 11 }));
      if (this.page < pages - 1) this.content.add(new PixelButton(this, MX + MW - 150, MY + 52, "▶", () => { this.page++; this.render(); }, { w: 40, h: 28, size: 11 }));
    }
    entries.slice(this.page * PAGE_SIZE, this.page * PAGE_SIZE + PAGE_SIZE).forEach(([id, qty], i) => {
      const def = ITEM_MAP[id];
      if (!def) return;
      const col = i % 2, row = Math.floor(i / 2);
      const x = MX + 24 + col * 300, y = MY + 92 + row * 64;
      add(flatPanel(this, x, y, 288, 58, "light"));
      add(this.add.image(x + 26, y + 29, "icons", def.icon).setScale(2.4));
      add(this.add.text(x + 50, y + 10, `${def.nameJp} ×${qty}`, style(14)));
      add(this.add.text(x + 50, y + 33, def.nameEn, style(11, COLOR.dim)));
      if (def.energy) {
        this.content.add(new PixelButton(this, x + 190, y + 11, `食べる +${def.energy}`, () => {
          if (G().eatItem(id)) {
            sfx("confirm");
            Bus.emit("toast", `${def.nameJp}を食べました (+${def.energy} energy)`, "success");
            this.render();
          }
        }, { w: 92, h: 36, size: 11 }));
      }
    });
  }

  private renderQuests() {
    const add = (go: Phaser.GameObjects.GameObject) => this.content.add(go);
    const quests = activeQuests();
    let y = MY + 62;
    if (!quests.length) add(this.add.text(W / 2, H / 2, meaning("No active quests.", "Belum ada misi aktif."), style(14, COLOR.dim)).setOrigin(0.5));
    for (const q of quests.slice(0, 4)) {
      add(this.add.text(MX + 24, y, `【${q.def.type}】${q.def.title}${q.def.titleJp ? `（${q.def.titleJp}）` : ""}`, style(14, COLOR.accent)));
      y += 26;
      add(this.add.text(MX + 36, y, meaning(q.def.desc, q.def.descIdn), style(12, COLOR.dim, { wordWrap: { width: MW - 80 } })));
      y += 24;
      for (const obj of q.def.objectives) {
        const done = (q.progress[obj.id] ?? 0) >= obj.count;
        add(this.add.text(MX + 36, y, `${done ? "☑" : "☐"} ${obj.desc} (${q.progress[obj.id] ?? 0}/${obj.count})`, style(12, done ? COLOR.good : COLOR.text)));
        y += 22;
      }
      y += 14;
    }
    const completed = G().quests.completed.length;
    add(this.add.text(MX + 24, MY + MH - 36, `${meaning("Completed quests", "Misi selesai")}: ${completed}`, style(12, COLOR.dim)));
  }

  private renderSettings() {
    const add = (go: Phaser.GameObjects.GameObject) => this.content.add(go);
    add(this.add.text(W / 2, MY + 68, "表示設定 — Language & Display", style(16, COLOR.accent)).setOrigin(0.5));

    const uiLangName: Record<string, string> = { "ja-en": "日本語+Arti", ja: "日本語のみ", en: "Arti saja" };
    const meaningName: Record<string, string> = { idn: "Bahasa Indonesia", en: "English" };
    const currentUi = getUiLang();
    const currentMeaning = getMeaningLang();

    const rows: [string, () => void, string?][] = [
      [
        `UI: ${uiLangName[currentUi]}`,
        () => {
          const order: UiLang[] = ["ja-en", "ja", "en"];
          setUiLang(order[(order.indexOf(getUiLang()) + 1) % order.length]);
          this.render();
        },
        "Feature labels: Japanese+EN, Japanese-only, or translation-only",
      ],
      [
        `${meaning("Meaning", "Arti")}: ${meaningName[currentMeaning]}`,
        () => {
          setMeaningLang(currentMeaning === "idn" ? "en" : "idn");
          this.render();
        },
        "Translations of Japanese text shown in this language",
      ],
      [
        `${getShowKana() ? "☑" : "☐"} ${meaning("Show Kana", "Tampilkan Kana")}`,
        () => { setShowKana(!getShowKana()); this.render(); },
        "Furigana / reading above kanji",
      ],
      [
        `${getShowMeaning() ? "☑" : "☐"} ${meaning("Show Translation", "Tampilkan Terjemahan")}`,
        () => { setShowMeaning(!getShowMeaning()); this.render(); },
        "Inline translation below Japanese text",
      ],
      [
        `${getShowRomaji() ? "☑" : "☐"} ${meaning("Show Romaji", "Tampilkan Romaji")}`,
        () => { setShowRomaji(!getShowRomaji()); this.render(); },
        "Latin alphabet reading (a, i, u, e, o)",
      ],
    ];

    rows.forEach(([label, cb, hint], i) => {
      const y = MY + 108 + i * 58;
      this.content.add(new PixelButton(this, W / 2 - 180, y, label, cb, { w: 360, h: 36 }));
      if (hint) add(this.add.text(W / 2, y + 40, hint, style(9, COLOR.dim)).setOrigin(0.5, 0));
    });
  }
}
