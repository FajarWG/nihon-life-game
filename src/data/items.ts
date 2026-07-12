import type { ItemDef } from "@/core/types";

export const ITEMS: ItemDef[] = [
  // ingredients (sold at konbini / supermarket)
  { id: "rice", nameJp: "米", kana: "こめ", nameEn: "Rice", category: "ingredient", price: 300, icon: "rice", desc: "A small bag of Japanese rice." },
  { id: "egg", nameJp: "卵", kana: "たまご", nameEn: "Egg", category: "ingredient", price: 120, icon: "egg", desc: "A pack of fresh eggs." },
  { id: "milk", nameJp: "牛乳", kana: "ぎゅうにゅう", nameEn: "Milk", category: "ingredient", price: 180, icon: "milk", desc: "Hokkaido milk." },
  { id: "bread", nameJp: "パン", kana: "ぱん", nameEn: "Bread", category: "ingredient", price: 150, icon: "bread", desc: "Fluffy shokupan." },
  { id: "meat", nameJp: "肉", kana: "にく", nameEn: "Meat", category: "ingredient", price: 400, icon: "meat", desc: "Thin-sliced pork." },
  { id: "fish", nameJp: "魚", kana: "さかな", nameEn: "Fish", category: "ingredient", price: 350, icon: "fish", desc: "Fresh salmon fillet." },
  { id: "carrot", nameJp: "にんじん", kana: "にんじん", nameEn: "Carrot", category: "ingredient", price: 80, icon: "carrot", desc: "A crunchy carrot." },
  { id: "potato", nameJp: "じゃがいも", kana: "じゃがいも", nameEn: "Potato", category: "ingredient", price: 90, icon: "potato", desc: "A hearty potato." },
  { id: "onion", nameJp: "玉ねぎ", kana: "たまねぎ", nameEn: "Onion", category: "ingredient", price: 70, icon: "onion", desc: "Don't cry." },
  { id: "cabbage", nameJp: "キャベツ", kana: "きゃべつ", nameEn: "Cabbage", category: "ingredient", price: 150, icon: "cabbage", desc: "A whole cabbage." },
  { id: "tofu", nameJp: "豆腐", kana: "とうふ", nameEn: "Tofu", category: "ingredient", price: 100, icon: "tofu", desc: "Silken tofu." },
  { id: "miso", nameJp: "味噌", kana: "みそ", nameEn: "Miso Paste", category: "ingredient", price: 250, icon: "miso", desc: "Fermented soybean paste." },
  { id: "soysauce", nameJp: "醤油", kana: "しょうゆ", nameEn: "Soy Sauce", category: "ingredient", price: 200, icon: "soysauce", desc: "Essential seasoning." },
  { id: "nori", nameJp: "海苔", kana: "のり", nameEn: "Nori Seaweed", category: "ingredient", price: 180, icon: "nori", desc: "Dried seaweed sheets." },
  { id: "curryroux", nameJp: "カレールー", kana: "かれーるー", nameEn: "Curry Roux", category: "ingredient", price: 220, icon: "curryroux", desc: "Medium-spicy curry blocks." },
  { id: "noodles", nameJp: "麺", kana: "めん", nameEn: "Noodles", category: "ingredient", price: 160, icon: "noodles", desc: "Fresh yakisoba noodles." },
  { id: "sauce", nameJp: "ソース", kana: "そーす", nameEn: "Worcester Sauce", category: "ingredient", price: 190, icon: "sauce", desc: "Sweet-savory sauce." },
  { id: "dashi", nameJp: "だし", kana: "だし", nameEn: "Dashi Stock", category: "ingredient", price: 210, icon: "dashi", desc: "Soup stock powder." },
  { id: "greenonion", nameJp: "ねぎ", kana: "ねぎ", nameEn: "Green Onion", category: "ingredient", price: 60, icon: "greenonion", desc: "Chopped and ready." },
  { id: "sugar", nameJp: "砂糖", kana: "さとう", nameEn: "Sugar", category: "ingredient", price: 130, icon: "sugar", desc: "White sugar." },

  // ready-to-eat (konbini) & cooked meals
  { id: "onigiri-shop", nameJp: "おにぎり（鮭）", kana: "おにぎり", nameEn: "Salmon Onigiri", category: "food", price: 140, icon: "onigiri", energy: 15, desc: "Konbini classic." },
  { id: "bento", nameJp: "お弁当", kana: "おべんとう", nameEn: "Bento Box", category: "food", price: 480, icon: "bento", energy: 35, desc: "A balanced lunch box." },
  { id: "sandwich", nameJp: "サンドイッチ", kana: "さんどいっち", nameEn: "Sandwich", category: "food", price: 260, icon: "sandwich", energy: 20, desc: "Egg salad sandwich." },
  { id: "coffee", nameJp: "コーヒー", kana: "こーひー", nameEn: "Canned Coffee", category: "drink", price: 130, icon: "coffee", energy: 10, desc: "Programmer fuel." },
  { id: "greentea", nameJp: "お茶", kana: "おちゃ", nameEn: "Green Tea", category: "drink", price: 110, icon: "greentea", energy: 5, desc: "Unsweetened, refreshing." },
  { id: "melonpan", nameJp: "メロンパン", kana: "めろんぱん", nameEn: "Melon Bread", category: "food", price: 160, icon: "melonpan", energy: 15, desc: "Doesn't taste like melon." },
  { id: "pocky", nameJp: "ポッキー", kana: "ぽっきー", nameEn: "Chocolate Sticks", category: "gift", price: 180, icon: "pocky", energy: 5, desc: "Great for sharing." },
  { id: "meal-curry", nameJp: "カレーライス", kana: "かれーらいす", nameEn: "Curry Rice", category: "food", price: 0, icon: "curry", energy: 55, desc: "Homemade curry. Smells amazing." },
  { id: "meal-miso", nameJp: "味噌汁", kana: "みそしる", nameEn: "Miso Soup", category: "food", price: 0, icon: "misosoup", energy: 30, desc: "Comfort in a bowl." },
  { id: "meal-onigiri", nameJp: "手作りおにぎり", kana: "てづくりおにぎり", nameEn: "Handmade Onigiri", category: "food", price: 0, icon: "onigiri", energy: 35, desc: "Shaped with care." },
  { id: "meal-tamagoyaki", nameJp: "卵焼き", kana: "たまごやき", nameEn: "Tamagoyaki", category: "food", price: 0, icon: "tamagoyaki", energy: 40, desc: "Sweet rolled omelette." },
  { id: "meal-yakisoba", nameJp: "焼きそば", kana: "やきそば", nameEn: "Yakisoba", category: "food", price: 0, icon: "yakisoba", energy: 50, desc: "Festival-style fried noodles." },
  { id: "meal-nikujaga", nameJp: "肉じゃが", kana: "にくじゃが", nameEn: "Nikujaga", category: "food", price: 0, icon: "nikujaga", energy: 60, desc: "Mom's taste, they say." },

  // gifts & books
  { id: "flowers", nameJp: "花", kana: "はな", nameEn: "Flowers", category: "gift", price: 350, icon: "flowers", desc: "A small seasonal bouquet." },
  { id: "manga", nameJp: "漫画", kana: "まんが", nameEn: "Manga Volume", category: "gift", price: 500, icon: "manga", desc: "Latest volume of a popular series." },
  { id: "techbook", nameJp: "技術書", kana: "ぎじゅつしょ", nameEn: "Tech Book", category: "book", price: 1200, icon: "techbook", desc: "『はじめてのReact』— React for beginners." },
  { id: "jlptbook", nameJp: "JLPT問題集", kana: "もんだいしゅう", nameEn: "JLPT Workbook", category: "book", price: 900, icon: "jlptbook", desc: "Practice makes perfect." },
  { id: "omamori", nameJp: "お守り", kana: "おまもり", nameEn: "Lucky Charm", category: "gift", price: 400, icon: "omamori", desc: "For passing exams." },
];

export const ITEM_MAP: Record<string, ItemDef> = Object.fromEntries(ITEMS.map(i => [i.id, i]));

/** What each shop stocks. */
export const SHOP_STOCK: Record<string, string[]> = {
  konbini: ["onigiri-shop", "bento", "sandwich", "coffee", "greentea", "melonpan", "pocky", "egg", "milk", "bread", "nori"],
  supermarket: ["rice", "egg", "milk", "bread", "meat", "fish", "carrot", "potato", "onion", "cabbage", "tofu", "miso", "soysauce", "nori", "curryroux", "noodles", "sauce", "dashi", "greenonion", "sugar", "flowers", "pocky"],
};
