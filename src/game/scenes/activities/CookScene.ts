import { ITEM_MAP } from "@/data/items";
import { RECIPES } from "@/data/recipes";
import { Bus } from "@/game/events";
import { G } from "@/game/state/gameState";
import { getShowKana, getShowMeaning, L, M, meaning } from "@/game/i18n";
import { COLOR, style } from "@/game/ui/theme";
import { flatPanel, PixelButton } from "@/game/ui/widgets";
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
    this.content.add(this.add.text(AW / 2, PY + 56, `何を作りますか。(${meaning("What will you cook?", "Mau masak apa?")})`, style(14)).setOrigin(0.5));

    RECIPES.forEach((r, i) => {
      const have = r.ingredients.every(id => (s.inventory[id] ?? 0) > 0);
      const x = PX + 40 + (i % 3) * 220, y = PY + 100 + Math.floor(i / 3) * 150;
      const p = flatPanel(this, x, y, 200, 160, "light");
      this.content.add(p);
      this.content.add(this.add.image(x + 100, y + 28, "icons", ITEM_MAP[r.result]?.icon ?? "default").setScale(2.4));
      this.content.add(this.add.text(x + 100, y + 56, r.nameJp, style(14)).setOrigin(0.5));
      this.content.add(this.add.text(x + 100, y + 74, getShowKana() ? `${r.kana} — ${r.nameEn}` : r.nameEn, style(10, COLOR.kana)).setOrigin(0.5));
      const missing = r.ingredients.filter(id => !(s.inventory[id] ?? 0));
      if (have) {
        this.content.add(new PixelButton(this, x + 30, y + 106, L("作る", "Cook!", "Masak!"), () => this.cook(r.id), { w: 140, h: 32 }));
      } else {
        const missingLabel = this.add.text(x + 100, y + 96, `${meaning("Missing", "Kurang")}: ${missing.map(id => ITEM_MAP[id]?.nameJp ?? id).join("、")}`,
          style(9, "#ffcc77", { wordWrap: { width: 170 }, align: "center", lineSpacing: 2 })).setOrigin(0.5, 0);
        const mask = this.make.graphics().fillRect(x + 5, y + 5, 190, 155).createGeometryMask();
        missingLabel.setMask(mask);
        this.content.add(missingLabel);
      }
    });
  }

  private async cook(recipeId: string) {
    const r = RECIPES.find(x => x.id === recipeId)!;
    const s = G();

    // read the recipe
    await this.card(add => {
      add(this.add.text(AW / 2, PY + 56, `${r.nameJp}（${getShowKana() ? r.kana : ""}）`, style(18, COLOR.accent)).setOrigin(0.5));
      add(this.add.text(AW / 2, PY + 82, `レシピをよく読んでください。(${meaning("Read the recipe carefully!", "Baca resepnya baik-baik!")})`, style(12, COLOR.dim)).setOrigin(0.5));
      r.steps.forEach((step, i) => {
        const y = PY + 120 + i * (getShowMeaning() ? 50 : 30);
        add(this.add.text(AW / 2 - 300, y, `${i + 1}. ${step.jp}`, style(14)));
        if (getShowMeaning()) add(this.add.text(AW / 2 - 300, y + 18, `   ${M(step)}`, style(11, COLOR.dim)));
      });
    }, L("作り始める", "Start cooking", "Mulai memasak"));

    // order the steps from memory
    const mistakes = await this.order(
      `順番にタップしてください。(${meaning("Tap the steps in order.", "Ketuk langkah sesuai urutan.")})`,
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
        meaning("Added to your bag — eat it to restore energy.", "Masuk ke tasmu — makan untuk memulihkan energi."),
      ],
    });
  }
}
