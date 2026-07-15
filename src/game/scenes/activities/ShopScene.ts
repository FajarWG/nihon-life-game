import * as Phaser from "phaser";
import { ITEM_MAP, SHOP_STOCK } from "@/data/items";
import { Bus } from "@/game/events";
import { sfx } from "@/game/audio/sfx";
import { G } from "@/game/state/gameState";
import { getShowKana, L, meaning } from "@/game/i18n";
import { COLOR, style } from "@/game/ui/theme";
import { flatPanel, PixelButton } from "@/game/ui/widgets";
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

const COLS = 3, ROWS = 4, PAGE_SIZE = COLS * ROWS;

export class ShopScene extends ActivityBase {
  private shop!: string;
  private stock: string[] = [];
  private cart: Record<string, number> = {};
  private listItems: string[] = [];
  private page = 0;
  private moneyText!: Phaser.GameObjects.Text;
  private listText!: Phaser.GameObjects.Text;
  private pageText!: Phaser.GameObjects.Text;
  private shelf!: Phaser.GameObjects.Container;
  private cartPanel!: Phaser.GameObjects.Container;
  private cartTotalText!: Phaser.GameObjects.Text;
  private cartListText!: Phaser.GameObjects.Text;
  private checkoutBtn!: PixelButton;
  private prevBtn!: PixelButton;
  private nextBtn!: PixelButton;

  constructor() { super("Shop"); }

  init(data: { shop: string }) { this.shop = data.shop ?? "konbini"; }

  create() {
    this.cart = {};
    this.page = 0;
    this.stock = (STOCKS[this.shop] ?? []).filter(id => ITEM_MAP[id]);
    this.chrome(TITLES[this.shop] ?? "Shop");

    this.listItems = [];
    if (this.shop === "konbini" || this.shop === "supermarket") {
      const ingredients = this.stock.filter(id => ITEM_MAP[id]?.category === "ingredient");
      const start = (G().day - 1) % Math.max(1, ingredients.length);
      this.listItems = [0, 1, 2].map(i => ingredients[(start + i) % ingredients.length]).filter(Boolean);
    }

    this.moneyText = this.add.text(PX + PW - 150, PY + 18, "", style(13, COLOR.accent));

    // shopping list
    if (this.listItems.length) {
      flatPanel(this, PX + 12, PY + 44, 246, 90, "light");
      this.add.text(PX + 22, PY + 50, L("買い物リスト", "Shopping list", "Daftar belanja"), style(12, COLOR.dim));
      this.listText = this.add.text(PX + 22, PY + 70, "", style(13));
    }

    // cart panel
    this.cartPanel = this.add.container(0, 0);
    const cartY = this.listItems.length ? PY + 144 : PY + 44;
    flatPanel(this, PX + 12, cartY, 246, 248, "dark");
    this.add.text(PX + 22, cartY + 10, L("カート", "Cart", "Keranjang"), style(14, COLOR.accent));
    this.cartListText = this.add.text(PX + 22, cartY + 38, "", style(12, COLOR.text, { lineSpacing: 6 }));
    this.cartTotalText = this.add.text(PX + 22, cartY + 216, "", style(14, COLOR.accent));

    this.checkoutBtn = new PixelButton(this, PX + 24, cartY + 188, L("会計する", "Check out", "Bayar"), () => this.checkout(), { w: 220, h: 34 });
    this.checkoutBtn.setVisible(false);

    // shelf grid
    this.shelf = this.add.container(0, 0);
    const pages = this.pages();
    this.prevBtn = new PixelButton(this, PX + 260, PY + PH - 52, "◀", () => { this.page--; this.renderShelf(); }, { w: 40, h: 30, size: 12 });
    this.nextBtn = new PixelButton(this, PX + PW - 76, PY + PH - 52, "▶", () => { this.page++; this.renderShelf(); }, { w: 40, h: 30, size: 12 });
    this.pageText = this.add.text(PX + 330 + (PW - 320 - 36) / 2, PY + PH - 37, "", style(11, COLOR.dim)).setOrigin(0.5);
    if (pages <= 1) { this.prevBtn.setVisible(false); this.nextBtn.setVisible(false); this.pageText.setVisible(false); }

    if (this.shop === "restaurant") {
      // restaurant: instant buy, no cart
      this.cartPanel.setVisible(false);
      this.cartTotalText.setVisible(false);
      this.cartListText.setVisible(false);
      this.checkoutBtn.setVisible(false);
    }

    this.renderShelf();
    this.refresh();
  }

  private pages() { return Math.max(1, Math.ceil(this.stock.length / PAGE_SIZE)); }

  private renderShelf() {
    const pages = this.pages();
    this.page = Phaser.Math.Clamp(this.page, 0, pages - 1);
    this.shelf.removeAll(true);

    const startX = PX + 276;
    const showKana = getShowKana();

    this.stock
      .slice(this.page * PAGE_SIZE, this.page * PAGE_SIZE + PAGE_SIZE)
      .forEach((id, i) => {
        const def = ITEM_MAP[id];
        const col = i % COLS, row = Math.floor(i / COLS);
        const x = startX + col * 142, y = PY + 40 + row * 114;
        flatPanel(this, x, y, 132, 104, "light");
        this.shelf.add(this.add.image(x + 66, y + 18, "icons", def.icon).setScale(2));
        this.shelf.add(this.add.text(x + 66, y + 40, def.nameJp, style(13)).setOrigin(0.5));
        if (showKana) this.shelf.add(this.add.text(x + 66, y + 54, def.kana, style(10, COLOR.kana)).setOrigin(0.5));

        const qty = this.cart[id] ?? 0;
        if (this.shop === "restaurant") {
          const buyBtn = new PixelButton(this, x + 16, y + 74, `¥${def.price}`, () => this.buyInstant(id, buyBtn), { w: 100, h: 24, size: 11 });
          this.shelf.add(buyBtn);
        } else {
          const addBtn = new PixelButton(this, x + 16, y + 74, `＋ ¥${def.price}`, () => this.addToCart(id), { w: 100, h: 24, size: 11 });
          this.shelf.add(addBtn);
          if (qty > 0) {
            this.shelf.add(this.add.text(x + 120, y, `${qty}`, style(12, "#ff6666", { backgroundColor: "#000000aa", padding: { x: 4, y: 2 } })));
          }
        }
      });

    this.pageText.setText(`${this.page + 1} / ${pages}`);
    this.prevBtn.setDisabled(this.page === 0);
    this.nextBtn.setDisabled(this.page >= pages - 1);
  }

  private addToCart(id: string) {
    const def = ITEM_MAP[id];
    const g = G();
    const cartTotal = this.getCartTotal();
    if (g.money < cartTotal + def.price) {
      sfx("fail");
      Bus.emit("toast", `お金が足りません… (${meaning("Not enough money", "Uangnya kurang")})`, "warn");
      return;
    }
    sfx("click");
    this.cart[id] = (this.cart[id] ?? 0) + 1;
    this.renderShelf();
    this.renderCart();
  }

  private removeFromCart(id: string) {
    if (!this.cart[id]) return;
    sfx("click");
    this.cart[id]--;
    if (this.cart[id] <= 0) delete this.cart[id];
    this.renderShelf();
    this.renderCart();
  }

  private getCartTotal(): number {
    let total = 0;
    for (const [id, qty] of Object.entries(this.cart)) {
      total += (ITEM_MAP[id]?.price ?? 0) * qty;
    }
    return total;
  }

  private cartRowObjs: Phaser.GameObjects.GameObject[] = [];

  private renderCart() {
    this.cartRowObjs.forEach(o => o.destroy());
    this.cartRowObjs = [];

    const entries = Object.entries(this.cart).filter(([, qty]) => qty > 0);
    const cartY = this.listItems.length ? PY + 144 : PY + 44;
    const total = this.getCartTotal();

    entries.forEach(([id, qty], i) => {
      const def = ITEM_MAP[id];
      const rowY = cartY + 38 + i * 38;
      const nameText = this.add.text(PX + 22, rowY, `${def.nameJp}`, style(11, COLOR.text));
      const qtyText = this.add.text(PX + 130, rowY, `×${qty}`, style(11, COLOR.accent));
      const priceText = this.add.text(PX + 168, rowY, `¥${def.price * qty}`, style(10, COLOR.dim));
      const minusBtn = new PixelButton(this, PX + 96, rowY - 2, "−", () => this.removeFromCart(id), { w: 26, h: 22, size: 9 });
      this.cartRowObjs.push(nameText, qtyText, priceText, minusBtn);
    });

    this.cartListText.setText(entries.length === 0 ? L("カートは空です", "Cart is empty", "Keranjang kosong") : "");
    if (entries.length === 0) {
      this.cartListText.setPosition(PX + 22, cartY + 50);
    }
    this.cartTotalText.setText(`¥${total.toLocaleString()}`);

    const hasItems = entries.length > 0;
    this.checkoutBtn.setVisible(hasItems);
    this.checkoutBtn.setDepth(10);
  }

  private buyInstant(id: string, btn: PixelButton) {
    const def = ITEM_MAP[id];
    const g = G();
    if (!g.spendMoney(def.price)) {
      sfx("fail");
      btn.flash(false);
      Bus.emit("toast", `お金が足りません… (${meaning("Not enough money", "Uangnya kurang")})`, "warn");
      return;
    }
    sfx("coin");
    g.addEnergy(def.energy ?? 10);
    Bus.emit("quest-event", "eat", id);
    Bus.emit("toast", `${def.nameJp}を食べました！(+${def.energy ?? 10} energy)`, "success");
    Bus.emit("quest-event", "buy", id);
    this.refresh();
  }

  private refresh() {
    this.moneyText.setText(`¥${G().money.toLocaleString()}`);
    if (this.listItems.length && this.listText) {
      this.listText.setText(this.listItems.map(id => {
        const d = ITEM_MAP[id];
        return `・ ${d.nameJp}（${d.kana}）`;
      }).join("\n"));
    }
  }

  private checkout() {
    const total = this.getCartTotal();
    if (total <= 0) { this.cancel(); return; }
    const g = G();
    if (!g.spendMoney(total)) {
      Bus.emit("toast", `お金が足りません… (${meaning("Not enough money", "Uangnya kurang")})`, "warn");
      return;
    }
    sfx("coin");

    let count = 0;
    for (const [id, qty] of Object.entries(this.cart)) {
      g.addItem(id, qty);
      Bus.emit("quest-event", "buy", id);
      count += qty;
    }
    const boughtIds = Object.keys(this.cart);
    this.cart = {};

    // hide shop UI so results screen is visible
    this.moneyText.setVisible(false);
    this.listText?.setVisible(false);
    this.cartPanel.setVisible(false);
    this.cartListText.setVisible(false);
    this.cartTotalText.setVisible(false);
    this.checkoutBtn.setVisible(false);
    this.shelf.setVisible(false);
    this.prevBtn.setVisible(false);
    this.nextBtn.setVisible(false);
    this.pageText.setVisible(false);
    this.cartRowObjs.forEach(o => o.destroy());
    this.cartRowObjs = [];

    const listDone = this.listItems.length > 0 && this.listItems.every(id => boughtIds.includes(id));
    const uniqueWords = new Set(boughtIds).size;

    this.finishActivity({
      activity: "shopping",
      timeCost: 30,
      energyCost: 5,
      xp: { vocabulary: Math.min(10, uniqueWords * 2) + (listDone ? 6 : 0), reading: listDone ? 4 : 0 },
      summary: [
        `Bought ${count} item(s).`,
        listDone ? "Shopping list complete! ✓" : this.listItems.length ? "Shopping list not finished." : " ",
      ],
    });
  }
}
