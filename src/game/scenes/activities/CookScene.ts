import { ITEM_MAP } from "@/data/items";
import { RECIPES } from "@/data/recipes";
import { Bus } from "@/game/events";
import { G } from "@/game/state/gameState";
import { COLOR, style } from "@/game/ui/theme";
import { panel, PixelButton } from "@/game/ui/widgets";
import { ActivityBase, AW, PX, PY, PW } from "./ActivityBase";

/** Read the recipe (Japanese), then put the steps in the right order. */
export class CookScene extends ActivityBase {
  constructor() { super("Cook"); }

  create() {
    this.chrome("料理 — Cooking");
    this.showRecipeSelect();
  }

  private showRecipeSelect() {
    this.clearContent();
    const s = G();
    this.content.add(this.add.text(AW / 2, PY + 56, "何を作りますか。(What will you cook?)", style(14)).setOrigin(0.5));

    RECIPES.forEach((r, i) => {
      const have = r.ingredients.every(id => (s.inventory[id] ?? 0) > 0);
      const x = PX + 40 + (i % 3) * 220, y = PY + 100 + Math.floor(i / 3) * 150;
      const p = panel(this, x, y, 200, 128, true);
      this.content.add(p);
      this.content.add(this.add.image(x + 100, y + 26, "icons", ITEM_MAP[r.result]?.icon ?? "default").setScale(2.4));
      this.content.add(this.add.text(x + 100, y + 52, r.nameJp, style(13)).setOrigin(0.5));
      this.content.add(this.add.text(x + 100, y + 68, `${r.kana} — ${r.nameEn}`, style(8, COLOR.kana)).setOrigin(0.5));
      const missing = r.ingredients.filter(id => !(s.inventory[id] ?? 0));
      if (have) {
        this.content.add(new PixelButton(this, x + 30, y + 86, "作る (Cook!)", () => this.cook(r.id), { w: 140, h: 30 }));
      } else {
        this.content.add(this.add.text(x + 100, y + 96, `足りない: ${missing.map(id => ITEM_MAP[id]?.nameJp ?? id).join("、")}`,
          style(8, COLOR.bad, { wordWrap: { width: 180 }, align: "center" })).setOrigin(0.5));
      }
    });
  }

  private async cook(recipeId: string) {
    const r = RECIPES.find(x => x.id === recipeId)!;
    const s = G();

    // read the recipe
    await this.card(add => {
      add(this.add.text(AW / 2, PY + 56, `${r.nameJp}（${r.kana}）`, style(18, COLOR.accent)).setOrigin(0.5));
      add(this.add.text(AW / 2, PY + 82, "レシピをよく読んでください。(Read the recipe carefully!)", style(10, COLOR.dim)).setOrigin(0.5));
      r.steps.forEach((step, i) => {
        const y = PY + 120 + i * 50;
        add(this.add.text(AW / 2 - 300, y, `${i + 1}. ${step.jp}`, style(13)));
        add(this.add.text(AW / 2 - 300, y + 18, `   ${step.en}`, style(9, COLOR.dim)));
      });
    }, "作り始める (Start cooking)");

    // order the steps from memory
    const mistakes = await this.order(
      "順番にタップしてください。(Tap the steps in order.)",
      r.steps.map(st => st.jp),
    );

    r.ingredients.forEach(id => s.removeItem(id));
    s.addItem(r.result);
    Bus.emit("quest-event", "cook", r.id);

    const perfect = mistakes === 0;
    this.finishActivity({
      activity: "cooking",
      timeCost: 45,
      energyCost: 10,
      xp: { reading: perfect ? 10 : 5, vocabulary: 5 },
      title: perfect ? "おいしそう！ (Looks delicious!)" : "まあまあかな… (Not bad…)",
      summary: [
        `${r.nameJp} (${r.nameEn}) is ready!`,
        `Added to your bag — eat it to restore energy.`,
      ],
    });
  }
}
