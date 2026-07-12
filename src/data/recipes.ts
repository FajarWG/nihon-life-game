import type { Recipe } from "@/core/types";

/** Sample recipes — extend by following the Recipe type. Steps are shown in JP and shuffled in the cooking mini-game. */
export const RECIPES: Recipe[] = [
  {
    id: "r-misosoup", nameJp: "味噌汁", kana: "みそしる", nameEn: "Miso Soup", level: "N5",
    ingredients: ["tofu", "miso", "dashi", "greenonion"],
    steps: [
      { jp: "お湯を沸かします。", kana: "おゆをわかします。", en: "Boil water." },
      { jp: "だしを入れます。", kana: "だしをいれます。", en: "Add the dashi stock." },
      { jp: "豆腐を切って入れます。", kana: "とうふをきっていれます。", en: "Cut the tofu and add it." },
      { jp: "味噌を溶かします。", kana: "みそをとかします。", en: "Dissolve the miso." },
      { jp: "ねぎをのせて、完成です。", kana: "ねぎをのせて、かんせいです。", en: "Top with green onion. Done!" },
    ],
    result: "meal-miso",
  },
  {
    id: "r-curry", nameJp: "カレーライス", kana: "かれーらいす", nameEn: "Curry Rice", level: "N5",
    ingredients: ["rice", "curryroux", "carrot", "potato", "onion", "meat"],
    steps: [
      { jp: "野菜と肉を切ります。", kana: "やさいとにくをきります。", en: "Cut the vegetables and meat." },
      { jp: "鍋で肉を炒めます。", kana: "なべでにくをいためます。", en: "Fry the meat in a pot." },
      { jp: "野菜と水を入れて、煮ます。", kana: "やさいとみずをいれて、にます。", en: "Add vegetables and water, then simmer." },
      { jp: "カレールーを入れます。", kana: "かれーるーをいれます。", en: "Add the curry roux." },
      { jp: "ご飯にかけて、完成です。", kana: "ごはんにかけて、かんせいです。", en: "Pour over rice. Done!" },
    ],
    result: "meal-curry",
  },
  {
    id: "r-tamagoyaki", nameJp: "卵焼き", kana: "たまごやき", nameEn: "Tamagoyaki", level: "N4",
    ingredients: ["egg", "sugar", "soysauce"],
    steps: [
      { jp: "卵を割って、よく混ぜます。", kana: "たまごをわって、よくまぜます。", en: "Crack the eggs and mix well." },
      { jp: "砂糖と醤油を少し加えます。", kana: "さとうとしょうゆをすこしくわえます。", en: "Add a little sugar and soy sauce." },
      { jp: "フライパンで薄く焼きます。", kana: "ふらいぱんでうすくやきます。", en: "Cook a thin layer in the pan." },
      { jp: "巻きながら焼いて、完成です。", kana: "まきながらやいて、かんせいです。", en: "Roll it as it cooks. Done!" },
    ],
    result: "meal-tamagoyaki",
  },
];

export const RECIPE_MAP: Record<string, Recipe> = Object.fromEntries(RECIPES.map(r => [r.id, r]));
