import * as Phaser from "phaser";
import { ITEM_MAP, SHOP_STOCK } from "@/data/items";
import { Bus } from "@/game/events";
import { sfx } from "@/game/audio/sfx";
import { G } from "@/game/state/gameState";
import { L, meaning } from "@/game/i18n";
import { COLOR, style } from "@/game/ui/theme";
import { panel, PixelButton } from "@/game/ui/widgets";
import { ActivityBase, PX, PY, PW, PH } from "./ActivityBase";

const STOCKS: Record<string, string[]> = {
  ...SHOP_STOCK,
  vending: ["coffee", "greentea"],
  restaurant: ["bento", "meal-curry", "meal-yakisoba", "meal-miso"],
};

const TITLES: Record<string, string> = {
  konbini: "コンビニ — Convenience Store",
  supermarket: "スーパー — Supermarket",
  vending: "自動販売機 — Vending Machine",
  restaurant: "レストラン — Restaurant",
};

/** Shelf grid: 4 columns × 3 rows per page, so any stock size fits the panel. */
const COLS = 4, ROWS = 3, PAGE_SIZE = COLS * ROWS;

/**
 * Shopping is reading practice: labels are Japanese-first.
 * A daily shopping list (in Japanese) gives a vocabulary bonus when completed.
 */
export class ShopScene extends ActivityBase {
  private shop!: string;
  private stock: string[] = [];
  private bought: string[] = [];
  private listItems: string[] = [];
  private page = 0;
  private moneyText!: Phaser.GameObjects.Text;
  private listText!: Phaser.GameObjects.Text;
  private pageText!: Phaser.GameObjects.Text;
  private shelf!: Phaser.GameObjects.Container;
  private prevBtn!: PixelButton;
  private nextBtn!: PixelButton;

  constructor() { super("Shop"); }

  init(data: { shop: string }) { this.shop = data.shop ?? "konbini"; }

  create() {
    this.bought = [];
    this.page = 0;
    this.stock = (STOCKS[this.shop] ?? []).filter(id => ITEM_MAP[id]);
    this.chrome(TITLES[this.shop] ?? "Shop");

    // daily shopping list (ingredients only, konbini/super)
    this.listItems = [];
    if (this.shop === "konbini" || this.shop === "supermarket") {
      const ingredients = this.stock.filter(id => ITEM_MAP[id]?.category === "ingredient");
      const start = (G().day - 1) % Math.max(1, ingredients.length);
      this.listItems = [0, 1, 2].map(i => ingredients[(start + i) % ingredients.length]).filter(Boolean);
    }

    this.moneyText = this.add.text(PX + PW - 150, PY + 18, "", style(13, COLOR.accent));
    if (this.listItems.length) {
      panel(this, PX + 16, PY + 44, 240, 96, true);
      this.add.text(PX + 28, PY + 52, L("買い物リスト", "Shopping list", "Daftar belanja"), style(10, COLOR.dim));
      this.listText = this.add.text(PX + 28, PY + 72, "", style(12));
    }

    this.shelf = this.add.container(0, 0);

    // pager (only shown when needed)
    const pages = this.pages();
    this.prevBtn = new PixelButton(this, PX + 280, PY + PH - 52, "◀", () => { this.page--; this.renderShelf(); }, { w: 40, h: 30, size: 12 });
    this.nextBtn = new PixelButton(this, PX + PW - 76, PY + PH - 52, "▶", () => { this.page++; this.renderShelf(); }, { w: 40, h: 30, size: 12 });
    this.pageText = this.add.text(PX + 280 + (PW - 280 - 36) / 2, PY + PH - 37, "", style(11, COLOR.dim)).setOrigin(0.5);
    if (pages <= 1) { this.prevBtn.setVisible(false); this.nextBtn.setVisible(false); this.pageText.setVisible(false); }

    new PixelButton(this, PX + 20, PY + PH - 56, L("会計する", "Check out", "Bayar"), () => this.checkout(), { w: 200 });

    this.renderShelf();
    this.refresh();
  }

  private pages() { return Math.max(1, Math.ceil(this.stock.length / PAGE_SIZE)); }

  private renderShelf() {
    const pages = this.pages();
    this.page = Phaser.Math.Clamp(this.page, 0, pages - 1);
    this.shelf.removeAll(true);

    this.stock
      .slice(this.page * PAGE_SIZE, this.page * PAGE_SIZE + PAGE_SIZE)
      .forEach((id, i) => {
        const def = ITEM_MAP[id];
        const col = i % COLS, row = Math.floor(i / COLS);
        const x = PX + 280 + col * 112, y = PY + 48 + row * 106;
        this.shelf.add(panel(this, x, y, 102, 96, true));
        this.shelf.add(this.add.image(x + 51, y + 20, "icons", def.icon).setScale(2));
        this.shelf.add(this.add.text(x + 51, y + 42, def.nameJp, style(12)).setOrigin(0.5));
        this.shelf.add(this.add.text(x + 51, y + 57, def.kana, style(9, COLOR.kana)).setOrigin(0.5));
        const buyBtn: PixelButton = new PixelButton(this, x + 10, y + 66, `¥${def.price}`, () => this.buy(id, buyBtn), { w: 82, h: 24, size: 11 });
        this.shelf.add(buyBtn);
      });

    this.pageText.setText(`${this.page + 1} / ${pages}`);
    this.prevBtn.setDisabled(this.page === 0);
    this.nextBtn.setDisabled(this.page >= pages - 1);
  }

  private buy(id: string, btn: PixelButton) {
    const def = ITEM_MAP[id];
    const g = G();
    if (!g.spendMoney(def.price)) {
      sfx("fail");
      btn.flash(false);
      Bus.emit("toast", `お金が足りません… (${meaning("Not enough money", "Uangnya kurang")})`, "warn");
      return;
    }
    sfx("coin");
    if (this.shop === "restaurant") {
      // eat-in: food is enjoyed on the spot
      g.addEnergy(def.energy ?? 10);
      Bus.emit("quest-event", "eat", id);
      Bus.emit("toast", `${def.nameJp}を食べました！(+${def.energy ?? 10} energy)`, "success");
    } else {
      g.addItem(id);
      Bus.emit("toast", `${def.nameJp}（${def.nameEn}）を買いました`, "info");
    }
    this.bought.push(id);
    Bus.emit("quest-event", "buy", id);
    this.refresh();
  }

  private refresh() {
    this.moneyText.setText(`¥${G().money.toLocaleString()}`);
    if (this.listItems.length && this.listText) {
      this.listText.setText(this.listItems.map(id => {
        const d = ITEM_MAP[id];
        return `${this.bought.includes(id) ? "✓" : "・"} ${d.nameJp}（${d.kana}）`;
      }).join("\n"));
    }
  }

  private checkout() {
    if (!this.bought.length) { this.cancel(); return; }
    const listDone = this.listItems.length > 0 && this.listItems.every(id => this.bought.includes(id));
    const uniqueWords = new Set(this.bought).size;
    this.finishActivity({
      activity: "shopping",
      timeCost: 30,
      energyCost: 5,
      xp: { vocabulary: Math.min(10, uniqueWords * 2) + (listDone ? 6 : 0), reading: listDone ? 4 : 0 },
      summary: [
        `Bought ${this.bought.length} item(s).`,
        listDone ? "Shopping list complete! ✓" : this.listItems.length ? "Shopping list not finished." : " ",
      ],
    });
  }
}
