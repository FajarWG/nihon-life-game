import type { Recipe } from "@/core/types";

/** Sample recipes — extend by following the Recipe type. Steps are shown in JP and shuffled in the cooking mini-game. */
export const RECIPES: Recipe[] = [
  {
    id: "r-misosoup", nameJp: "味噌汁", kana: "みそしる", nameEn: "Miso Soup", level: "N5",
    ingredients: ["tofu", "miso", "dashi", "greenonion"],
    steps: [
      { jp: "お湯を沸かします。", kana: "おゆをわかします。", en: "Boil water.", idn: "Rebus air." },
      { jp: "だしを入れます。", kana: "だしをいれます。", en: "Add the dashi stock.", idn: "Masukkan kaldu dashi." },
      { jp: "豆腐を切って入れます。", kana: "とうふをきっていれます。", en: "Cut the tofu and add it.", idn: "Potong tahu lalu masukkan." },
      { jp: "味噌を溶かします。", kana: "みそをとかします。", en: "Dissolve the miso.", idn: "Larutkan miso." },
      { jp: "ねぎをのせて、完成です。", kana: "ねぎをのせて、かんせいです。", en: "Top with green onion. Done!", idn: "Taburi daun bawang. Selesai!" },
    ],
    result: "meal-miso",
  },
  {
    id: "r-curry", nameJp: "カレーライス", kana: "かれーらいす", nameEn: "Curry Rice", level: "N5",
    ingredients: ["rice", "curryroux", "carrot", "potato", "onion", "meat"],
    steps: [
      { jp: "野菜と肉を切ります。", kana: "やさいとにくをきります。", en: "Cut the vegetables and meat.", idn: "Potong sayuran dan daging." },
      { jp: "鍋で肉を炒めます。", kana: "なべでにくをいためます。", en: "Fry the meat in a pot.", idn: "Tumis daging di panci." },
      { jp: "野菜と水を入れて、煮ます。", kana: "やさいとみずをいれて、にます。", en: "Add vegetables and water, then simmer.", idn: "Masukkan sayuran dan air, lalu rebus." },
      { jp: "カレールーを入れます。", kana: "かれーるーをいれます。", en: "Add the curry roux.", idn: "Masukkan blok kari." },
      { jp: "ご飯にかけて、完成です。", kana: "ごはんにかけて、かんせいです。", en: "Pour over rice. Done!", idn: "Siram di atas nasi. Selesai!" },
    ],
    result: "meal-curry",
  },
  {
    id: "r-tamagoyaki", nameJp: "卵焼き", kana: "たまごやき", nameEn: "Tamagoyaki", level: "N4",
    ingredients: ["egg", "sugar", "soysauce"],
    steps: [
      { jp: "卵を割って、よく混ぜます。", kana: "たまごをわって、よくまぜます。", en: "Crack the eggs and mix well.", idn: "Pecahkan telur lalu kocok rata." },
      { jp: "砂糖と醤油を少し加えます。", kana: "さとうとしょうゆをすこしくわえます。", en: "Add a little sugar and soy sauce.", idn: "Tambahkan sedikit gula dan kecap asin." },
      { jp: "フライパンで薄く焼きます。", kana: "ふらいぱんでうすくやきます。", en: "Cook a thin layer in the pan.", idn: "Masak selapis tipis di wajan." },
      { jp: "巻きながら焼いて、完成です。", kana: "まきながらやいて、かんせいです。", en: "Roll it as it cooks. Done!", idn: "Gulung sambil dimasak. Selesai!" },
    ],
    result: "meal-tamagoyaki",
  },
  {
    id: "r-yakisoba", nameJp: "焼きそば", kana: "やきそば", nameEn: "Yakisoba", level: "N4",
    ingredients: ["noodles", "cabbage", "meat", "sauce"],
    steps: [
      { jp: "肉とキャベツを切ります。", kana: "にくとキャベツをきります。", en: "Cut the meat and cabbage.", idn: "Potong daging dan kubis." },
      { jp: "フライパンで肉を炒めます。", kana: "ふらいぱんでにくをいためます。", en: "Fry the meat in a pan.", idn: "Tumis daging di wajan." },
      { jp: "キャベツを加えて、一緒に炒めます。", kana: "キャベツをくわえて、いっしょにいためます。", en: "Add the cabbage and fry together.", idn: "Tambahkan kubis, tumis bersama." },
      { jp: "麺を入れて、混ぜます。", kana: "めんをいれて、まぜます。", en: "Add the noodles and mix.", idn: "Masukkan mi, aduk rata." },
      { jp: "ソースをかけて、完成です。", kana: "そーすをかけて、かんせいです。", en: "Pour the sauce over it. Done!", idn: "Siram dengan saus. Selesai!" },
    ],
    result: "meal-yakisoba",
  },
  {
    id: "r-nikujaga", nameJp: "肉じゃが", kana: "にくじゃが", nameEn: "Nikujaga", level: "N3",
    ingredients: ["meat", "potato", "onion", "carrot", "soysauce", "sugar"],
    steps: [
      { jp: "じゃがいもと人参を切ります。", kana: "じゃがいもとにんじんをきります。", en: "Cut the potatoes and carrots.", idn: "Potong kentang dan wortel." },
      { jp: "鍋で肉と玉ねぎを炒めます。", kana: "なべでにくとたまねぎをいためます。", en: "Fry the meat and onion in a pot.", idn: "Tumis daging dan bawang bombay di panci." },
      { jp: "じゃがいもと人参を加えて、水を入れます。", kana: "じゃがいもとにんじんをくわえて、みずをいれます。", en: "Add the potatoes and carrots, then add water.", idn: "Tambahkan kentang dan wortel, lalu masukkan air." },
      { jp: "醤油と砂糖で味付けします。", kana: "しょうゆとさとうであじつけします。", en: "Season with soy sauce and sugar.", idn: "Bumbui dengan kecap asin dan gula." },
      { jp: "弱火でじっくり煮て、完成です。", kana: "よわびでじっくりにて、かんせいです。", en: "Simmer slowly on low heat. Done!", idn: "Rebus perlahan dengan api kecil. Selesai!" },
    ],
    result: "meal-nikujaga",
  },
];

export const RECIPE_MAP: Record<string, Recipe> = Object.fromEntries(RECIPES.map(r => [r.id, r]));
