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

// ROWS=4 used to overflow past the shop panel's bottom edge (and even the
// canvas edge), covering the pagination buttons; 3 rows keeps everything
// inside PH.
const COLS = 3, ROWS = 3, PAGE_SIZE = COLS * ROWS;

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
  /** Restaurant only: eat on the spot (instant energy) vs. pack it for later (inventory). */
  private eatHere = true;
  private eatHereBtn?: PixelButton;

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
    const cartBg = flatPanel(this, PX + 12, cartY, 246, 248, "dark");
    const cartHeader = this.add.text(PX + 22, cartY + 10, L("カート", "Cart", "Keranjang"), style(14, COLOR.accent));
    // total sits in the header row (right-aligned) instead of a fixed offset
    // near the bottom — that fixed offset used to land right inside the
    // checkout button's own bounds and get covered by it.
    this.cartTotalText = this.add.text(PX + 12 + 246 - 10, cartY + 10, "", style(14, COLOR.accent)).setOrigin(1, 0);
    this.cartPanel.add([cartBg, cartHeader, this.cartTotalText]);
    this.cartListText = this.add.text(PX + 22, cartY + 38, "", style(12, COLOR.text, { lineSpacing: 6 }));

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
      // restaurant: instant buy, no cart — but let the player choose whether
      // to eat on the spot (energy now) or take the meal away (goes to inventory).
      this.cartPanel.setVisible(false);
      this.cartTotalText.setVisible(false);
      this.cartListText.setVisible(false);
      this.checkoutBtn.setVisible(false);
      this.eatHereBtn = new PixelButton(this, PX + 16, PY + 44, "", () => {
        this.eatHere = !this.eatHere;
        this.updateEatHereBtn();
      }, { w: 246, h: 30, size: 12 });
      this.updateEatHereBtn();
    }

    this.renderShelf();
    this.renderCart();
    this.refresh();
  }

  private updateEatHereBtn() {
    this.eatHereBtn?.setText(this.eatHere
      ? L("🍽 ここで食べる", "Eat here", "Makan di sini")
      : L("🥡 持ち帰り", "Take away", "Bawa pulang"));
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
        // add the background into the same container as its content (and add
        // it FIRST) — otherwise flatPanel's rectangle lands in the scene's
        // root display list, added after `this.shelf`, and renders on top of
        // the icon/name/price it's supposed to sit behind.
        const cellBg = flatPanel(this, x, y, 132, 104, "light");
        this.shelf.add(cellBg);
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

    // Cart panel height is fixed, but some shops stock a LOT of distinct
    // items (supermarket alone has 22) — with no cap, enough unique items in
    // the cart pushed rows straight through the checkout button and off the
    // bottom of the screen. Cap visible rows to what actually fits and fold
    // the rest into a "+N more" line; the real cart/total/checkout still use
    // the full `this.cart` regardless of what's shown here.
    const ROW_H = 24;
    const listTop = cartY + 38;
    const listBottom = cartY + 178; // leaves a gap above the checkout button
    const maxRows = Math.max(1, Math.floor((listBottom - listTop) / ROW_H));
    const overflow = entries.length > maxRows;
    const shown = overflow ? entries.slice(0, maxRows - 1) : entries;

    shown.forEach(([id, qty], i) => {
      const def = ITEM_MAP[id];
      const rowY = listTop + i * ROW_H;
      const nameText = this.add.text(PX + 22, rowY, `${def.nameJp}`, style(11, COLOR.text));
      const qtyText = this.add.text(PX + 130, rowY, `×${qty}`, style(11, COLOR.accent));
      const priceText = this.add.text(PX + 168, rowY, `¥${def.price * qty}`, style(10, COLOR.dim));
      const minusBtn = new PixelButton(this, PX + 96, rowY - 3, "−", () => this.removeFromCart(id), { w: 24, h: 20, size: 9 });
      this.cartRowObjs.push(nameText, qtyText, priceText, minusBtn);
    });

    if (overflow) {
      const hidden = entries.length - shown.length;
      this.cartRowObjs.push(this.add.text(
        PX + 22, listTop + shown.length * ROW_H,
        `+${hidden} ${meaning("more item(s)", "barang lainnya")}`,
        style(10, COLOR.dim, { fontStyle: "italic" }),
      ));
    }

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
    Bus.emit("quest-event", "buy", id);
    if (this.eatHere) {
      g.addEnergy(def.energy ?? 10);
      Bus.emit("quest-event", "eat", id);
      Bus.emit("toast", `${def.nameJp}を食べました！(+${def.energy ?? 10} energy)`, "success");
    } else {
      g.addItem(id);
      Bus.emit("toast", `${def.nameJp}を持ち帰りました。(${meaning("Packed for later", "Dibawa pulang untuk nanti")})`, "success");
    }
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
