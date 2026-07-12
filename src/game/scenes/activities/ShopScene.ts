import * as Phaser from "phaser";
import { ITEM_MAP, SHOP_STOCK } from "@/data/items";
import { Bus } from "@/game/events";
import { sfx } from "@/game/audio/sfx";
import { G } from "@/game/state/gameState";
import { COLOR, style } from "@/game/ui/theme";
import { panel, PixelButton } from "@/game/ui/widgets";
import { ActivityBase, AW, PX, PY, PW } from "./ActivityBase";

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

/**
 * Shopping is reading practice: labels are Japanese-first.
 * A daily shopping list (in Japanese) gives a vocabulary bonus when completed.
 */
export class ShopScene extends ActivityBase {
  private shop!: string;
  private bought: string[] = [];
  private listItems: string[] = [];
  private moneyText!: Phaser.GameObjects.Text;
  private listText!: Phaser.GameObjects.Text;

  constructor() { super("Shop"); }

  init(data: { shop: string }) { this.shop = data.shop ?? "konbini"; }

  create() {
    this.bought = [];
    this.chrome(TITLES[this.shop] ?? "Shop");
    const stock = STOCKS[this.shop] ?? [];

    // daily shopping list (ingredients only, konbini/super)
    this.listItems = [];
    if (this.shop === "konbini" || this.shop === "supermarket") {
      const ingredients = stock.filter(id => ITEM_MAP[id]?.category === "ingredient");
      const start = (G().day - 1) % Math.max(1, ingredients.length);
      this.listItems = [0, 1, 2].map(i => ingredients[(start + i) % ingredients.length]).filter(Boolean);
    }

    this.moneyText = this.add.text(PX + PW - 150, PY + 18, "", style(13, COLOR.accent));
    if (this.listItems.length) {
      panel(this, PX + 16, PY + 44, 240, 86, true);
      this.add.text(PX + 28, PY + 52, "買い物リスト (Shopping list)", style(10, COLOR.dim));
      this.listText = this.add.text(PX + 28, PY + 70, "", style(12));
    }

    // shelves grid
    const cols = 4;
    stock.forEach((id, i) => {
      const def = ITEM_MAP[id];
      if (!def) return;
      const col = i % cols, row = Math.floor(i / cols);
      const x = PX + 280 + col * 112, y = PY + 60 + row * 86;
      panel(this, x, y, 102, 76, true);
      this.add.image(x + 51, y + 18, "icons", def.icon).setScale(2);
      this.add.text(x + 51, y + 40, def.nameJp, style(10)).setOrigin(0.5);
      this.add.text(x + 51, y + 52, def.kana, style(7, COLOR.kana)).setOrigin(0.5);
      const buyBtn = new PixelButton(this, x + 14, y + 58, `¥${def.price}`, () => this.buy(id, buyBtn), { w: 74, h: 16, size: 9 });
    });

    new PixelButton(this, PX + 20, PY + 400 - 14, "会計する (Check out)", () => this.checkout(), { w: 200 });
    this.refresh();
  }

  private buy(id: string, btn: PixelButton) {
    const def = ITEM_MAP[id];
    const g = G();
    if (!g.spendMoney(def.price)) {
      sfx("fail");
      btn.flash(false);
      Bus.emit("toast", "お金が足りません… (Not enough money)", "warn");
      return;
    }
    sfx("coin");
    g.addItem(id);
    this.bought.push(id);
    Bus.emit("quest-event", "buy", id);
    Bus.emit("toast", `${def.nameJp}（${def.nameEn}）を買いました`, "info");
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
