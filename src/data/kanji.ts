import type { KanjiEntry, JlptLevel } from "@/core/types";

/**
 * Kanji curriculum — N5 level (~100 kanji).
 *
 * Priority: kanji already appearing in N5 vocabulary (linked via exampleVocabIds),
 * then standard N5 kanji that fill common categories not yet covered.
 *
 * Sources: standard JLPT N5 kanji lists widely published in educational materials.
 * Entries marked // VERIFY should be manually checked for accuracy.
 */
export const KANJI_N5: KanjiEntry[] = [
  // ═══ Numbers ══════════════════════════════════════════════════════════
  {
    id: "k5-ichi", character: "一", onyomi: ["イチ", "イツ"], kunyomi: ["ひと", "ひと.つ"],
    meaning: { en: "one", idn: "satu" }, strokeCount: 1, level: "N5", exampleVocabIds: ["v5-ichi", "v5-hitori"],
  },
  {
    id: "k5-ni", character: "二", onyomi: ["ニ"], kunyomi: ["ふた", "ふた.つ"],
    meaning: { en: "two", idn: "dua" }, strokeCount: 2, level: "N5", exampleVocabIds: ["v5-ni", "v5-futari"],
  },
  {
    id: "k5-san", character: "三", onyomi: ["サン"], kunyomi: ["み", "み.つ", "みっ.つ"],
    meaning: { en: "three", idn: "tiga" }, strokeCount: 3, level: "N5", exampleVocabIds: ["v5-san"],
  },
  {
    id: "k5-shi", character: "四", onyomi: ["シ"], kunyomi: ["よ", "よ.つ", "よっ.つ", "よん"],
    meaning: { en: "four", idn: "empat" }, strokeCount: 5, level: "N5", exampleVocabIds: ["v5-yon"],
  },
  {
    id: "k5-go", character: "五", onyomi: ["ゴ"], kunyomi: ["いつ", "いつ.つ"],
    meaning: { en: "five", idn: "lima" }, strokeCount: 4, level: "N5", exampleVocabIds: ["v5-go"],
  },
  {
    id: "k5-roku", character: "六", onyomi: ["ロク"], kunyomi: ["む", "む.つ", "むっ.つ", "むい"],
    meaning: { en: "six", idn: "enam" }, strokeCount: 4, level: "N5", exampleVocabIds: ["v5-roku"],
  },
  {
    id: "k5-shichi", character: "七", onyomi: ["シチ"], kunyomi: ["なな", "なな.つ", "なの"],
    meaning: { en: "seven", idn: "tujuh" }, strokeCount: 2, level: "N5", exampleVocabIds: ["v5-nana"],
  },
  {
    id: "k5-hachi", character: "八", onyomi: ["ハチ"], kunyomi: ["や", "や.つ", "やっ.つ", "よう"],
    meaning: { en: "eight", idn: "delapan" }, strokeCount: 2, level: "N5", exampleVocabIds: ["v5-hachi"],
  },
  {
    id: "k5-kyuu", character: "九", onyomi: ["キュウ", "ク"], kunyomi: ["ここの", "ここの.つ"],
    meaning: { en: "nine", idn: "sembilan" }, strokeCount: 2, level: "N5", exampleVocabIds: ["v5-kyuu"],
  },
  {
    id: "k5-juu", character: "十", onyomi: ["ジュウ", "ジッ"], kunyomi: ["とお", "と"],
    meaning: { en: "ten", idn: "sepuluh" }, strokeCount: 2, level: "N5", exampleVocabIds: ["v5-juu"],
  },
  {
    id: "k5-hyaku", character: "百", onyomi: ["ヒャク", "ビャク"], kunyomi: [],
    meaning: { en: "hundred", idn: "seratus" }, strokeCount: 6, level: "N5", exampleVocabIds: ["v5-hyaku"],
  },
  {
    id: "k5-sen", character: "千", onyomi: ["セン"], kunyomi: ["ち"],
    meaning: { en: "thousand", idn: "seribu" }, strokeCount: 3, level: "N5", exampleVocabIds: ["v5-sen"],
  },
  {
    id: "k5-man", character: "万", onyomi: ["マン", "バン"], kunyomi: [],
    meaning: { en: "ten thousand", idn: "sepuluh ribu" }, strokeCount: 3, level: "N5", exampleVocabIds: ["v5-man"],
  },
  {
    id: "k5-en", character: "円", onyomi: ["エン"], kunyomi: ["まる"],
    meaning: { en: "circle / yen", idn: "lingkaran / yen" }, strokeCount: 4, level: "N5", exampleVocabIds: [],
  },

  // ═══ Time & Days ══════════════════════════════════════════════════════
  {
    id: "k5-nichi", character: "日", onyomi: ["ニチ", "ジツ"], kunyomi: ["ひ", "か"],
    meaning: { en: "day / sun", idn: "hari / matahari" }, strokeCount: 4, level: "N5",
    exampleVocabIds: ["v5-nihongo", "v5-kyou", "v5-ashita", "v5-nichiyoubi", "v5-mainichi"],
  },
  {
    id: "k5-gatsu", character: "月", onyomi: ["ゲツ", "ガツ"], kunyomi: ["つき"],
    meaning: { en: "month / moon", idn: "bulan" }, strokeCount: 4, level: "N5",
    exampleVocabIds: ["v5-sengetsu"],
  },
  {
    id: "k5-ka", character: "火", onyomi: ["カ"], kunyomi: ["ひ"],
    meaning: { en: "fire", idn: "api" }, strokeCount: 4, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-mizu-kanji", character: "水", onyomi: ["スイ"], kunyomi: ["みず"],
    meaning: { en: "water", idn: "air" }, strokeCount: 4, level: "N5",
    exampleVocabIds: ["v5-mizu"],
  },
  {
    id: "k5-moku", character: "木", onyomi: ["ボク", "モク"], kunyomi: ["き"],
    meaning: { en: "tree / wood", idn: "pohon / kayu" }, strokeCount: 4, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-kin", character: "金", onyomi: ["キン", "コン"], kunyomi: ["かね"],
    meaning: { en: "gold / money", idn: "emas / uang" }, strokeCount: 8, level: "N5",
    exampleVocabIds: ["v5-okane", "v5-kinyoubi"],
  },
  {
    id: "k5-do", character: "土", onyomi: ["ド", "ト"], kunyomi: ["つち"],
    meaning: { en: "earth / soil", idn: "tanah" }, strokeCount: 3, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-nen", character: "年", onyomi: ["ネン"], kunyomi: ["とし"],
    meaning: { en: "year", idn: "tahun" }, strokeCount: 6, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-ji", character: "時", onyomi: ["ジ"], kunyomi: ["とき"],
    meaning: { en: "time / hour", idn: "waktu / jam" }, strokeCount: 10, level: "N5",
    exampleVocabIds: ["v5-jikan"],
  },
  {
    id: "k5-kan", character: "間", onyomi: ["カン", "ケン"], kunyomi: ["あいだ", "ま"],
    meaning: { en: "interval / between", idn: "selang / antara" }, strokeCount: 12, level: "N5",
    exampleVocabIds: ["v5-jikan"],
  },

  // ═══ Directions & Places ══════════════════════════════════════════════
  {
    id: "k5-ue", character: "上", onyomi: ["ジョウ", "ショウ"], kunyomi: ["うえ", "あ.げる", "のぼ.る"],
    meaning: { en: "above / up", idn: "atas / naik" }, strokeCount: 3, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-shita", character: "下", onyomi: ["カ", "ゲ"], kunyomi: ["した", "さ.げる", "くだ.る"],
    meaning: { en: "below / down", idn: "bawah / turun" }, strokeCount: 3, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-naka", character: "中", onyomi: ["チュウ"], kunyomi: ["なか"],
    meaning: { en: "middle / inside", idn: "tengah / dalam" }, strokeCount: 4, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-soto", character: "外", onyomi: ["ガイ", "ゲ"], kunyomi: ["そと", "ほか", "はず.す"],
    meaning: { en: "outside", idn: "luar" }, strokeCount: 5, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-mae", character: "前", onyomi: ["ゼン"], kunyomi: ["まえ"],
    meaning: { en: "before / front", idn: "sebelum / depan" }, strokeCount: 9, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-ato", character: "後", onyomi: ["ゴ", "コウ"], kunyomi: ["うし.ろ", "のち", "あと"],
    meaning: { en: "after / behind", idn: "sesudah / belakang" }, strokeCount: 9, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-higashi", character: "東", onyomi: ["トウ"], kunyomi: ["ひがし"],
    meaning: { en: "east", idn: "timur" }, strokeCount: 8, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-nishi", character: "西", onyomi: ["セイ", "サイ"], kunyomi: ["にし"],
    meaning: { en: "west", idn: "barat" }, strokeCount: 6, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-minami", character: "南", onyomi: ["ナン", "ナ"], kunyomi: ["みなみ"],
    meaning: { en: "south", idn: "selatan" }, strokeCount: 9, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-kita", character: "北", onyomi: ["ホク"], kunyomi: ["きた"],
    meaning: { en: "north", idn: "utara" }, strokeCount: 5, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-migi-kanji", character: "右", onyomi: ["ウ", "ユウ"], kunyomi: ["みぎ"],
    meaning: { en: "right", idn: "kanan" }, strokeCount: 5, level: "N5",
    exampleVocabIds: ["v5-migi"],
  },
  {
    id: "k5-hidari-kanji", character: "左", onyomi: ["サ"], kunyomi: ["ひだり"],
    meaning: { en: "left", idn: "kiri" }, strokeCount: 5, level: "N5",
    exampleVocabIds: ["v5-hidari"],
  },

  // ═══ People & Body ════════════════════════════════════════════════════
  {
    id: "k5-hito", character: "人", onyomi: ["ジン", "ニン"], kunyomi: ["ひと"],
    meaning: { en: "person", idn: "orang" }, strokeCount: 2, level: "N5",
    exampleVocabIds: ["v5-hitori", "v5-futari"],
  },
  {
    id: "k5-ko", character: "子", onyomi: ["シ", "ス"], kunyomi: ["こ"],
    meaning: { en: "child", idn: "anak" }, strokeCount: 3, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-onna", character: "女", onyomi: ["ジョ", "ニョ"], kunyomi: ["おんな", "め"],
    meaning: { en: "woman", idn: "perempuan" }, strokeCount: 3, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-otoko", character: "男", onyomi: ["ダン", "ナン"], kunyomi: ["おとこ"],
    meaning: { en: "man", idn: "laki-laki" }, strokeCount: 7, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-chichi", character: "父", onyomi: ["フ"], kunyomi: ["ちち"],
    meaning: { en: "father", idn: "ayah" }, strokeCount: 4, level: "N5",
    exampleVocabIds: ["v5-chichi"],
  },
  {
    id: "k5-haha", character: "母", onyomi: ["ボ"], kunyomi: ["はは"],
    meaning: { en: "mother", idn: "ibu" }, strokeCount: 5, level: "N5",
    exampleVocabIds: ["v5-haha"],
  },
  {
    id: "k5-tomo", character: "友", onyomi: ["ユウ"], kunyomi: ["とも"],
    meaning: { en: "friend", idn: "teman" }, strokeCount: 4, level: "N5",
    exampleVocabIds: ["v4-shinyuu"],
  },
  {
    id: "k5-saki", character: "先", onyomi: ["セン"], kunyomi: ["さき"],
    meaning: { en: "previous / ahead", idn: "sebelumnya / depan" }, strokeCount: 6, level: "N5",
    exampleVocabIds: ["v5-sensei", "v3-senpai", "v5-senshuu", "v5-sengetsu"],
  },
  {
    id: "k5-sei", character: "生", onyomi: ["セイ", "ショウ"], kunyomi: ["い.きる", "う.まれる", "なま"],
    meaning: { en: "life / birth", idn: "hidup / lahir" }, strokeCount: 5, level: "N5",
    exampleVocabIds: ["v5-sensei", "v5-gakusei"],
  },
  {
    id: "k5-ki", character: "気", onyomi: ["キ", "ケ"], kunyomi: ["いき"],
    meaning: { en: "spirit / energy", idn: "semangat / energi" }, strokeCount: 6, level: "N5",
    exampleVocabIds: ["v5-genki"],
  },

  // ═══ Verbs ════════════════════════════════════════════════════════════
  {
    id: "k5-tabe", character: "食", onyomi: ["ショク", "ジキ"], kunyomi: ["た.べる", "く.う"],
    meaning: { en: "eat / food", idn: "makan / makanan" }, strokeCount: 9, level: "N5",
    exampleVocabIds: ["v5-taberu"],
  },
  {
    id: "k5-nomu-kanji", character: "飲", onyomi: ["イン"], kunyomi: ["の.む"],
    meaning: { en: "drink", idn: "minum" }, strokeCount: 12, level: "N5",
    exampleVocabIds: ["v5-nomu"],
  },
  {
    id: "k5-iku-kanji", character: "行", onyomi: ["コウ", "ギョウ"], kunyomi: ["い.く", "おこな.う"],
    meaning: { en: "go", idn: "pergi" }, strokeCount: 6, level: "N5",
    exampleVocabIds: ["v5-iku", "v4-kyuukou"],
  },
  {
    id: "k5-kaeru-kanji", character: "帰", onyomi: ["キ"], kunyomi: ["かえ.る"],
    meaning: { en: "return home", idn: "pulang" }, strokeCount: 10, level: "N5",
    exampleVocabIds: ["v5-kaeru"],
  },
  {
    id: "k5-neru-kanji", character: "寝", onyomi: ["シン"], kunyomi: ["ね.る"],
    meaning: { en: "sleep", idn: "tidur" }, strokeCount: 13, level: "N5",
    exampleVocabIds: ["v5-neru"],
  },
  {
    id: "k5-mi", character: "見", onyomi: ["ケン"], kunyomi: ["み.る", "み.せる"],
    meaning: { en: "see / look", idn: "lihat" }, strokeCount: 7, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-ki-verb", character: "聞", onyomi: ["ブン", "モン"], kunyomi: ["き.く"],
    meaning: { en: "hear / ask", idn: "dengar / tanya" }, strokeCount: 14, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-yomi", character: "読", onyomi: ["ドク", "トク"], kunyomi: ["よ.む"],
    meaning: { en: "read", idn: "baca" }, strokeCount: 14, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-kaki", character: "書", onyomi: ["ショ"], kunyomi: ["か.く"],
    meaning: { en: "write", idn: "tulis" }, strokeCount: 10, level: "N5",
    exampleVocabIds: ["v5-toshokan", "v4-shorui"],
  },
  {
    id: "k5-hana", character: "話", onyomi: ["ワ"], kunyomi: ["はな.す", "はなし"],
    meaning: { en: "speak / story", idn: "bicara / cerita" }, strokeCount: 13, level: "N5",
    exampleVocabIds: ["v5-denwa"],
  },
  {
    id: "k5-kai", character: "買", onyomi: ["バイ"], kunyomi: ["か.う"],
    meaning: { en: "buy", idn: "beli" }, strokeCount: 12, level: "N5",
    exampleVocabIds: ["v5-kaimono"],
  },

  // ═══ School & Study ═══════════════════════════════════════════════════
  {
    id: "k5-gaku", character: "学", onyomi: ["ガク"], kunyomi: ["まな.ぶ"],
    meaning: { en: "study / learn", idn: "belajar" }, strokeCount: 8, level: "N5",
    exampleVocabIds: ["v5-gakko", "v5-gakusei"],
  },
  {
    id: "k5-kou", character: "校", onyomi: ["コウ"], kunyomi: [],
    meaning: { en: "school", idn: "sekolah" }, strokeCount: 10, level: "N5",
    exampleVocabIds: ["v5-gakko"],
  },
  {
    id: "k5-ben", character: "勉", onyomi: ["ベン"], kunyomi: [],
    meaning: { en: "diligence", idn: "ketekunan" }, strokeCount: 10, level: "N5",
    exampleVocabIds: ["v5-benkyou"],
  },
  {
    id: "k5-kyou", character: "強", onyomi: ["キョウ", "ゴウ"], kunyomi: ["つよ.い", "し.いる"],
    meaning: { en: "strong", idn: "kuat" }, strokeCount: 11, level: "N5",
    exampleVocabIds: ["v5-benkyou"],
  },
  {
    id: "k5-go-kanji", character: "語", onyomi: ["ゴ"], kunyomi: ["かた.る"],
    meaning: { en: "language / word", idn: "bahasa / kata" }, strokeCount: 14, level: "N5",
    exampleVocabIds: ["v5-nihongo"],
  },
  {
    id: "k5-bun", character: "文", onyomi: ["ブン", "モン"], kunyomi: ["ふみ"],
    meaning: { en: "sentence / literature", idn: "kalimat / sastra" }, strokeCount: 4, level: "N5",
    exampleVocabIds: [], // part of 日本語 context
  },

  // ═══ Places & Buildings ══════════════════════════════════════════════
  {
    id: "k5-eki-kanji", character: "駅", onyomi: ["エキ"], kunyomi: [],
    meaning: { en: "station", idn: "stasiun" }, strokeCount: 14, level: "N5",
    exampleVocabIds: ["v5-eki"],
  },
  {
    id: "k5-mise-kanji", character: "店", onyomi: ["テン"], kunyomi: ["みせ"],
    meaning: { en: "shop", idn: "toko" }, strokeCount: 8, level: "N5",
    exampleVocabIds: ["v5-mise"],
  },
  {
    id: "k5-kouen-kanji", character: "園", onyomi: ["エン"], kunyomi: ["その"],
    meaning: { en: "garden / park", idn: "taman" }, strokeCount: 13, level: "N5",
    exampleVocabIds: ["v5-kouen"],
  },
  {
    id: "k5-ie-kanji", character: "家", onyomi: ["カ", "ケ"], kunyomi: ["いえ", "や"],
    meaning: { en: "house / home", idn: "rumah" }, strokeCount: 10, level: "N5",
    exampleVocabIds: ["v5-ie", "v5-kazoku"],
  },

  // ═══ Nature & Weather ═════════════════════════════════════════════════
  {
    id: "k5-ten", character: "天", onyomi: ["テン"], kunyomi: [],
    meaning: { en: "heaven / sky", idn: "langit" }, strokeCount: 4, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-sora", character: "空", onyomi: ["クウ"], kunyomi: ["そら", "あ.く", "から"],
    meaning: { en: "sky / empty", idn: "langit / kosong" }, strokeCount: 8, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-yama", character: "山", onyomi: ["サン", "ザン"], kunyomi: ["やま"],
    meaning: { en: "mountain", idn: "gunung" }, strokeCount: 3, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-kawa", character: "川", onyomi: ["セン"], kunyomi: ["かわ"],
    meaning: { en: "river", idn: "sungai" }, strokeCount: 3, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-hana-flower", character: "花", onyomi: ["カ"], kunyomi: ["はな"],
    meaning: { en: "flower", idn: "bunga" }, strokeCount: 7, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-ame", character: "雨", onyomi: ["ウ"], kunyomi: ["あめ", "あま"],
    meaning: { en: "rain", idn: "hujan" }, strokeCount: 8, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-yuki", character: "雪", onyomi: ["セツ"], kunyomi: ["ゆき"],
    meaning: { en: "snow", idn: "salju" }, strokeCount: 11, level: "N5", exampleVocabIds: [],
  },

  // ═══ Animals ══════════════════════════════════════════════════════════
  {
    id: "k5-inu", character: "犬", onyomi: ["ケン"], kunyomi: ["いぬ"],
    meaning: { en: "dog", idn: "anjing" }, strokeCount: 4, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-neko", character: "猫", onyomi: ["ビョウ"], kunyomi: ["ねこ"],
    meaning: { en: "cat", idn: "kucing" }, strokeCount: 11, level: "N5", exampleVocabIds: [],
  },
  {
    id: "k5-sakana-kanji", character: "魚", onyomi: ["ギョ"], kunyomi: ["さかな", "うお"],
    meaning: { en: "fish", idn: "ikan" }, strokeCount: 11, level: "N5",
    exampleVocabIds: ["v5-sakana"],
  },

  // ═══ Food & Cooking ═══════════════════════════════════════════════════
  {
    id: "k5-niku-kanji", character: "肉", onyomi: ["ニク"], kunyomi: [],
    meaning: { en: "meat", idn: "daging" }, strokeCount: 6, level: "N5",
    exampleVocabIds: ["v5-niku"],
  },
  {
    id: "k5-tamago-kanji", character: "卵", onyomi: ["ラン"], kunyomi: ["たまご"],
    meaning: { en: "egg", idn: "telur" }, strokeCount: 7, level: "N5",
    exampleVocabIds: ["v5-tamago"],
  },
  {
    id: "k5-gyuu", character: "牛", onyomi: ["ギュウ"], kunyomi: ["うし"],
    meaning: { en: "cow", idn: "sapi" }, strokeCount: 4, level: "N5",
    exampleVocabIds: ["v5-gyunyu"],
  },
  {
    id: "k5-nyuu", character: "乳", onyomi: ["ニュウ"], kunyomi: ["ちち", "ち"],
    meaning: { en: "milk / breast", idn: "susu" }, strokeCount: 8, level: "N5",
    exampleVocabIds: ["v5-gyunyu"],
  },
  {
    id: "k5-ya", character: "野", onyomi: ["ヤ"], kunyomi: ["の"],
    meaning: { en: "field / wild", idn: "ladang / liar" }, strokeCount: 11, level: "N5",
    exampleVocabIds: ["v5-yasai"],
  },
  {
    id: "k5-sai", character: "菜", onyomi: ["サイ"], kunyomi: ["な"],
    meaning: { en: "vegetable", idn: "sayur" }, strokeCount: 11, level: "N5",
    exampleVocabIds: ["v5-yasai"],
  },
  {
    id: "k5-cha", character: "茶", onyomi: ["チャ", "サ"], kunyomi: [],
    meaning: { en: "tea", idn: "teh" }, strokeCount: 9, level: "N5",
    exampleVocabIds: ["v5-ocha"],
  },

  // ═══ Transportation ═══════════════════════════════════════════════════
  {
    id: "k5-den", character: "電", onyomi: ["デン"], kunyomi: [],
    meaning: { en: "electricity", idn: "listrik" }, strokeCount: 13, level: "N5",
    exampleVocabIds: ["v5-densha", "v5-denwa", "v3-teiden"],
  },
  {
    id: "k5-sha", character: "車", onyomi: ["シャ"], kunyomi: ["くるま"],
    meaning: { en: "car / vehicle", idn: "mobil / kendaraan" }, strokeCount: 7, level: "N5",
    exampleVocabIds: ["v5-densha"],
  },

  // ═══ Work & Business ══════════════════════════════════════════════════
  {
    id: "k5-kai-kanji", character: "会", onyomi: ["カイ", "エ"], kunyomi: ["あ.う"],
    meaning: { en: "meet / meeting", idn: "temu / rapat" }, strokeCount: 6, level: "N5",
    exampleVocabIds: ["v5-kaisha", "v4-kaigi", "v3-kaiketsu"],
  },
  {
    id: "k5-sha-kanji", character: "社", onyomi: ["シャ"], kunyomi: ["やしろ"],
    meaning: { en: "company / shrine", idn: "perusahaan" }, strokeCount: 7, level: "N5",
    exampleVocabIds: ["v5-kaisha", "v3-shain"],
  },
  {
    id: "k5-shi-kanji", character: "仕", onyomi: ["シ", "ジ"], kunyomi: ["つか.える"],
    meaning: { en: "serve / work", idn: "melayani / kerja" }, strokeCount: 5, level: "N5",
    exampleVocabIds: ["v5-shigoto"],
  },
  {
    id: "k5-jikan-kanji", character: "事", onyomi: ["ジ", "ズ"], kunyomi: ["こと"],
    meaning: { en: "thing / matter", idn: "hal / urusan" }, strokeCount: 8, level: "N5",
    exampleVocabIds: ["v5-shigoto"],
  },

  // ═══ Shopping & Money ═════════════════════════════════════════════════
  {
    id: "k5-mono", character: "物", onyomi: ["ブツ", "モツ"], kunyomi: ["もの"],
    meaning: { en: "thing / object", idn: "benda" }, strokeCount: 8, level: "N5",
    exampleVocabIds: ["v5-kaimono"],
  },
  {
    id: "k5-yasui-kanji", character: "安", onyomi: ["アン"], kunyomi: ["やす.い"],
    meaning: { en: "peaceful / cheap", idn: "tenang / murah" }, strokeCount: 6, level: "N5",
    exampleVocabIds: ["v5-yasui", "v4-anzen"],
  },
  {
    id: "k5-takai-kanji", character: "高", onyomi: ["コウ"], kunyomi: ["たか.い"],
    meaning: { en: "tall / expensive", idn: "tinggi / mahal" }, strokeCount: 10, level: "N5",
    exampleVocabIds: ["v5-takai"],
  },

  // ═══ Misc ═════════════════════════════════════════════════════════════
  {
    id: "k5-tsugi-kanji", character: "次", onyomi: ["ジ", "シ"], kunyomi: ["つ.ぐ", "つぎ"],
    meaning: { en: "next", idn: "berikutnya" }, strokeCount: 6, level: "N5",
    exampleVocabIds: ["v5-tsugi"],
  },
  {
    id: "k5-fu", character: "符", onyomi: ["フ"], kunyomi: [],
    meaning: { en: "token / mark", idn: "tanda" }, strokeCount: 11, level: "N5",
    exampleVocabIds: ["v5-kippu"],
  },
  {
    id: "k5-asa-kanji", character: "朝", onyomi: ["チョウ"], kunyomi: ["あさ"],
    meaning: { en: "morning", idn: "pagi" }, strokeCount: 12, level: "N5",
    exampleVocabIds: ["v5-asa"],
  },
  {
    id: "k5-yoru-kanji", character: "夜", onyomi: ["ヤ"], kunyomi: ["よる", "よ"],
    meaning: { en: "night", idn: "malam" }, strokeCount: 8, level: "N5",
    exampleVocabIds: ["v5-yoru"],
  },
  {
    id: "k5-ima-kanji", character: "今", onyomi: ["コン", "キン"], kunyomi: ["いま"],
    meaning: { en: "now", idn: "sekarang" }, strokeCount: 4, level: "N5",
    exampleVocabIds: ["v5-ima", "v5-konshuu"],
  },
  {
    id: "k5-gen", character: "元", onyomi: ["ゲン", "ガン"], kunyomi: ["もと"],
    meaning: { en: "origin", idn: "asal" }, strokeCount: 4, level: "N5",
    exampleVocabIds: ["v5-genki"],
  },
  {
    id: "k5-zu", character: "図", onyomi: ["ズ", "ト"], kunyomi: ["はか.る"],
    meaning: { en: "diagram / map", idn: "diagram / peta" }, strokeCount: 7, level: "N5",
    exampleVocabIds: ["v5-toshokan"],
  },
  {
    id: "k5-kan-kanji", character: "館", onyomi: ["カン"], kunyomi: ["やかた", "たて"],
    meaning: { en: "building / hall", idn: "gedung" }, strokeCount: 16, level: "N5",
    exampleVocabIds: ["v5-toshokan"],
  },
  {
    id: "k5-haku", character: "白", onyomi: ["ハク", "ビャク"], kunyomi: ["しろ", "しろ.い"],
    meaning: { en: "white", idn: "putih" }, strokeCount: 5, level: "N5", exampleVocabIds: ["v5-shiroi"],
  },
  {
    id: "k5-aka", character: "赤", onyomi: ["セキ", "シャク"], kunyomi: ["あか", "あか.い"],
    meaning: { en: "red", idn: "merah" }, strokeCount: 7, level: "N5", exampleVocabIds: ["v5-akai"],
  },
  {
    id: "k5-ao", character: "青", onyomi: ["セイ", "ショウ"], kunyomi: ["あお", "あお.い"],
    meaning: { en: "blue / green", idn: "biru / hijau" }, strokeCount: 8, level: "N5", exampleVocabIds: ["v5-aoi"],
  },
  {
    id: "k5-kuchi", character: "口", onyomi: ["コウ", "ク"], kunyomi: ["くち"],
    meaning: { en: "mouth", idn: "mulut" }, strokeCount: 3, level: "N5", exampleVocabIds: ["v5-kuchi"],
  },
  {
    id: "k5-me", character: "目", onyomi: ["モク", "ボク"], kunyomi: ["め"],
    meaning: { en: "eye", idn: "mata" }, strokeCount: 5, level: "N5", exampleVocabIds: ["v5-me"],
  },
  {
    id: "k5-mimi", character: "耳", onyomi: ["ジ"], kunyomi: ["みみ"],
    meaning: { en: "ear", idn: "telinga" }, strokeCount: 6, level: "N5", exampleVocabIds: ["v5-mimi"],
  },
  {
    id: "k5-te", character: "手", onyomi: ["シュ"], kunyomi: ["て"],
    meaning: { en: "hand", idn: "tangan" }, strokeCount: 4, level: "N5",
    exampleVocabIds: ["v4-tetsudau", "v5-te"],
  },
  {
    id: "k5-ashi", character: "足", onyomi: ["ソク"], kunyomi: ["あし", "た.りる"],
    meaning: { en: "foot / leg", idn: "kaki" }, strokeCount: 7, level: "N5", exampleVocabIds: ["v5-ashi"],
  },
  {
    id: "k5-kuro", character: "黒", onyomi: ["コク"], kunyomi: ["くろ", "くろ.い"],
    meaning: { en: "black", idn: "hitam" }, strokeCount: 11, level: "N5", exampleVocabIds: ["v5-kuroi"],
  },
  {
    id: "k5-zoku", character: "族", onyomi: ["ゾク"], kunyomi: [],
    meaning: { en: "family / tribe", idn: "keluarga / suku" }, strokeCount: 11, level: "N5",
    exampleVocabIds: ["v5-kazoku"],
  },
  {
    id: "k5-atama", character: "頭", onyomi: ["トウ", "ズ"], kunyomi: ["あたま"],
    meaning: { en: "head", idn: "kepala" }, strokeCount: 16, level: "N5", exampleVocabIds: ["v5-atama"],
  },
];

/**
 * Kanji curriculum — N4 level (~80 kanji).
 *
 * Does NOT repeat kanji already listed in KANJI_N5. Only new characters
 * that appear in N4 vocabulary or are standard N4 kanji.
 */
export const KANJI_N4: KanjiEntry[] = [
  // ═══ Food & Cooking (N4) ═════════════════════════════════════════════
  {
    id: "k4-ryou", character: "料", onyomi: ["リョウ"], kunyomi: [],
    meaning: { en: "ingredients / fee", idn: "bahan / biaya" }, strokeCount: 10, level: "N4",
    exampleVocabIds: ["v4-ryouri", "v4-zairyou", "v3-kyuuryou"],
  },
  {
    id: "k4-ri", character: "理", onyomi: ["リ"], kunyomi: ["ことわり"],
    meaning: { en: "reason / principle", idn: "alasan / prinsip" }, strokeCount: 11, level: "N4",
    exampleVocabIds: ["v4-ryouri"],
  },
  {
    id: "k4-zai", character: "材", onyomi: ["ザイ"], kunyomi: [],
    meaning: { en: "material / lumber", idn: "bahan / material" }, strokeCount: 7, level: "N4",
    exampleVocabIds: ["v4-zairyou"],
  },
  {
    id: "k4-aji-kanji", character: "味", onyomi: ["ミ"], kunyomi: ["あじ", "あじ.わう"],
    meaning: { en: "taste / flavor", idn: "rasa" }, strokeCount: 8, level: "N4",
    exampleVocabIds: ["v4-aji", "v4-imi"],
  },

  // ═══ Daily Life ══════════════════════════════════════════════════════
  {
    id: "k4-yaku", character: "約", onyomi: ["ヤク"], kunyomi: [],
    meaning: { en: "promise / approximately", idn: "janji / kira-kira" }, strokeCount: 9, level: "N4",
    exampleVocabIds: ["v4-yakusoku", "v3-keiyaku"],
  },
  {
    id: "k4-soku", character: "束", onyomi: ["ソク"], kunyomi: ["たば"],
    meaning: { en: "bundle / bind", idn: "ikat / bundel" }, strokeCount: 7, level: "N4",
    exampleVocabIds: ["v4-yakusoku"],
  },
  {
    id: "k4-yo", character: "予", onyomi: ["ヨ"], kunyomi: ["あらかじ.め"],
    meaning: { en: "beforehand / reserve", idn: "sebelumnya / cadangan" }, strokeCount: 4, level: "N4",
    exampleVocabIds: ["v4-yotei"],
  },
  {
    id: "k4-tei", character: "定", onyomi: ["テイ", "ジョウ"], kunyomi: ["さだ.める"],
    meaning: { en: "determine / fixed", idn: "menentukan / tetap" }, strokeCount: 8, level: "N4",
    exampleVocabIds: ["v4-yotei"],
  },
  {
    id: "k4-tsukau-kanji", character: "使", onyomi: ["シ"], kunyomi: ["つか.う"],
    meaning: { en: "use", idn: "menggunakan" }, strokeCount: 8, level: "N4",
    exampleVocabIds: ["v4-tsukau"],
  },
  {
    id: "k4-erabu-kanji", character: "選", onyomi: ["セン"], kunyomi: ["えら.ぶ"],
    meaning: { en: "choose / select", idn: "memilih" }, strokeCount: 15, level: "N4",
    exampleVocabIds: ["v4-erabu", "v3-yuusen"],
  },
  {
    id: "k4-todokeru-kanji", character: "届", onyomi: ["カイ"], kunyomi: ["とど.ける", "とど.く"],
    meaning: { en: "deliver / reach", idn: "mengantar / sampai" }, strokeCount: 8, level: "N4",
    exampleVocabIds: ["v4-todokeru"],
  },
  {
    id: "k4-tetsudau-kanji", character: "伝", onyomi: ["デン"], kunyomi: ["つた.える", "つた.わる"],
    meaning: { en: "transmit / tell", idn: "menyampaikan" }, strokeCount: 6, level: "N4",
    exampleVocabIds: ["v4-tetsudau"],
  },
  {
    id: "k4-shou", character: "招", onyomi: ["ショウ"], kunyomi: ["まね.く"],
    meaning: { en: "invite / beckon", idn: "mengundang" }, strokeCount: 8, level: "N4",
    exampleVocabIds: ["v4-shoutai"],
  },
  {
    id: "k4-tai-kanji", character: "待", onyomi: ["タイ"], kunyomi: ["ま.つ"],
    meaning: { en: "wait", idn: "menunggu" }, strokeCount: 9, level: "N4",
    exampleVocabIds: ["v4-shoutai"],
  },
  {
    id: "k4-riyuu", character: "由", onyomi: ["ユ", "ユウ", "ユイ"], kunyomi: ["よし"],
    meaning: { en: "reason / cause", idn: "alasan / sebab" }, strokeCount: 5, level: "N4",
    exampleVocabIds: ["v4-riyuu"],
  },
  {
    id: "k4-keiken", character: "経", onyomi: ["ケイ", "キョウ"], kunyomi: ["へ.る"],
    meaning: { en: "pass through / manage", idn: "melalui / mengelola" }, strokeCount: 11, level: "N4",
    exampleVocabIds: ["v4-keiken"],
  },
  {
    id: "k4-ken-kanji", character: "験", onyomi: ["ケン", "ゲン"], kunyomi: ["ためし"],
    meaning: { en: "test / verification", idn: "uji / verifikasi" }, strokeCount: 18, level: "N4",
    exampleVocabIds: ["v4-keiken", "v4-shiken"],
  },
  {
    id: "k4-zen", character: "全", onyomi: ["ゼン"], kunyomi: ["すべ.て", "まった.く"],
    meaning: { en: "all / whole", idn: "seluruh / sepenuhnya" }, strokeCount: 6, level: "N4",
    exampleVocabIds: ["v4-anzen"],
  },

  // ═══ Shopping (N4) ════════════════════════════════════════════════════
  {
    id: "k4-ne", character: "値", onyomi: ["チ"], kunyomi: ["ね", "あたい"],
    meaning: { en: "price / value", idn: "harga / nilai" }, strokeCount: 10, level: "N4",
    exampleVocabIds: ["v4-nedan"],
  },
  {
    id: "k4-dan", character: "段", onyomi: ["ダン"], kunyomi: [],
    meaning: { en: "step / stage", idn: "tingkat / tahap" }, strokeCount: 9, level: "N4",
    exampleVocabIds: ["v4-nedan"],
  },
  {
    id: "k4-uri", character: "売", onyomi: ["バイ"], kunyomi: ["う.る"],
    meaning: { en: "sell", idn: "menjual" }, strokeCount: 7, level: "N4",
    exampleVocabIds: ["v4-uriba"],
  },
  {
    id: "k4-ba", character: "場", onyomi: ["ジョウ"], kunyomi: ["ば"],
    meaning: { en: "place / location", idn: "tempat" }, strokeCount: 12, level: "N4",
    exampleVocabIds: ["v4-uriba"],
  },
  {
    id: "k4-wari", character: "割", onyomi: ["カツ"], kunyomi: ["わ.る", "わり"],
    meaning: { en: "divide / split", idn: "membagi / diskon" }, strokeCount: 12, level: "N4",
    exampleVocabIds: ["v4-waribiki"],
  },
  {
    id: "k4-hi", character: "引", onyomi: ["イン"], kunyomi: ["ひ.く", "ひ.き"],
    meaning: { en: "pull / subtract", idn: "tarik / potong" }, strokeCount: 4, level: "N4",
    exampleVocabIds: ["v4-waribiki", "v3-hikkoshi"],
  },
  {
    id: "k4-tsuri", character: "釣", onyomi: ["チョウ"], kunyomi: ["つ.る"],
    meaning: { en: "fishing / change (money)", idn: "pancing / kembalian" }, strokeCount: 11, level: "N4",
    exampleVocabIds: ["v4-otsuri"],
  },
  {
    id: "k4-fukuro-kanji", character: "袋", onyomi: ["タイ"], kunyomi: ["ふくろ"],
    meaning: { en: "bag / sack", idn: "kantong" }, strokeCount: 11, level: "N4",
    exampleVocabIds: ["v4-fukuro"],
  },

  // ═══ Train/Transport (N4) ═════════════════════════════════════════════
  {
    id: "k4-kyuu", character: "急", onyomi: ["キュウ"], kunyomi: ["いそ.ぐ"],
    meaning: { en: "urgent / hurry", idn: "mendesak / cepat" }, strokeCount: 9, level: "N4",
    exampleVocabIds: ["v4-kyuukou"],
  },
  {
    id: "k4-fu", character: "普", onyomi: ["フ"], kunyomi: [],
    meaning: { en: "common / ordinary", idn: "umum / biasa" }, strokeCount: 12, level: "N4",
    exampleVocabIds: ["v4-futsuu"],
  },
  {
    id: "k4-tsuu", character: "通", onyomi: ["ツウ", "ツ"], kunyomi: ["とお.る", "かよ.う"],
    meaning: { en: "pass through / commute", idn: "lewat / lalu-lalang" }, strokeCount: 10, level: "N4",
    exampleVocabIds: ["v4-futsuu"],
  },
  {
    id: "k4-jou", character: "乗", onyomi: ["ジョウ"], kunyomi: ["の.る"],
    meaning: { en: "ride / board", idn: "naik (kendaraan)" }, strokeCount: 9, level: "N4",
    exampleVocabIds: ["v4-norikae"],
  },
  {
    id: "k4-kae-kanji", character: "換", onyomi: ["カン"], kunyomi: ["か.える"],
    meaning: { en: "exchange / transfer", idn: "tukar / transfer" }, strokeCount: 12, level: "N4",
    exampleVocabIds: ["v4-norikae"],
  },
  {
    id: "k4-okureru-kanji", character: "遅", onyomi: ["チ"], kunyomi: ["おく.れる", "おそ.い"],
    meaning: { en: "late / slow", idn: "terlambat" }, strokeCount: 12, level: "N4",
    exampleVocabIds: ["v4-okureru"],
  },
  {
    id: "k4-shutsu", character: "出", onyomi: ["シュツ", "スイ"], kunyomi: ["で.る", "だ.す"],
    meaning: { en: "exit / put out", idn: "keluar / mengeluarkan" }, strokeCount: 5, level: "N4",
    exampleVocabIds: ["v4-shuppatsu", "v3-shorui2"],
  },
  {
    id: "k4-hatsu", character: "発", onyomi: ["ハツ", "ホツ"], kunyomi: [],
    meaning: { en: "depart / emit", idn: "berangkat / mengeluarkan" }, strokeCount: 9, level: "N4",
    exampleVocabIds: ["v4-shuppatsu", "v3-kaihatsu"],
  },
  {
    id: "k4-tou", character: "到", onyomi: ["トウ"], kunyomi: ["いた.る"],
    meaning: { en: "arrive", idn: "tiba" }, strokeCount: 8, level: "N4",
    exampleVocabIds: ["v4-touchaku"],
  },
  {
    id: "k4-chaku", character: "着", onyomi: ["チャク", "ジャク"], kunyomi: ["き.る", "つ.く"],
    meaning: { en: "arrive / wear", idn: "tiba / memakai" }, strokeCount: 12, level: "N4",
    exampleVocabIds: ["v4-touchaku"],
  },

  // ═══ School/Study (N4) ════════════════════════════════════════════════
  {
    id: "k4-ju", character: "授", onyomi: ["ジュ"], kunyomi: ["さず.ける"],
    meaning: { en: "grant / teach", idn: "memberi / mengajar" }, strokeCount: 11, level: "N4",
    exampleVocabIds: ["v4-jugyou"],
  },
  {
    id: "k4-gyou", character: "業", onyomi: ["ギョウ", "ゴウ"], kunyomi: ["わざ"],
    meaning: { en: "work / profession", idn: "pekerjaan / profesi" }, strokeCount: 13, level: "N4",
    exampleVocabIds: ["v4-jugyou", "v3-zangyou"],
  },
  {
    id: "k4-shi-test", character: "試", onyomi: ["シ"], kunyomi: ["こころ.みる", "ため.す"],
    meaning: { en: "try / test", idn: "mencoba / uji" }, strokeCount: 13, level: "N4",
    exampleVocabIds: ["v4-shiken"],
  },
  {
    id: "k4-shuku", character: "宿", onyomi: ["シュク"], kunyomi: ["やど"],
    meaning: { en: "lodge / inn", idn: "penginapan" }, strokeCount: 11, level: "N4",
    exampleVocabIds: ["v4-shukudai"],
  },
  {
    id: "k4-dai", character: "題", onyomi: ["ダイ"], kunyomi: [],
    meaning: { en: "topic / subject", idn: "topik / soal" }, strokeCount: 18, level: "N4",
    exampleVocabIds: ["v4-shukudai"],
  },
  {
    id: "k4-fuku", character: "復", onyomi: ["フク"], kunyomi: ["また"],
    meaning: { en: "return / repeat", idn: "kembali / ulang" }, strokeCount: 12, level: "N4",
    exampleVocabIds: ["v4-fukushuu"],
  },
  {
    id: "k4-shuu", character: "習", onyomi: ["シュウ"], kunyomi: ["なら.う"],
    meaning: { en: "learn / practice", idn: "belajar / latihan" }, strokeCount: 11, level: "N4",
    exampleVocabIds: ["v4-fukushuu"],
  },
  {
    id: "k4-imi-kanji", character: "意", onyomi: ["イ"], kunyomi: [],
    meaning: { en: "idea / intention", idn: "maksud / ide" }, strokeCount: 13, level: "N4",
    exampleVocabIds: ["v4-imi"],
  },

  // ═══ Work/Business (N4) ═══════════════════════════════════════════════
  {
    id: "k4-gi", character: "議", onyomi: ["ギ"], kunyomi: [],
    meaning: { en: "discussion / deliberation", idn: "diskusi / musyawarah" }, strokeCount: 20, level: "N4",
    exampleVocabIds: ["v4-kaigi"],
  },
  {
    id: "k4-ren", character: "連", onyomi: ["レン"], kunyomi: ["つ.れる", "つら.なる"],
    meaning: { en: "link / connect", idn: "hubung / sambung" }, strokeCount: 10, level: "N4",
    exampleVocabIds: ["v4-renraku"],
  },
  {
    id: "k4-raku", character: "絡", onyomi: ["ラク"], kunyomi: ["から.む", "から.まる"],
    meaning: { en: "entwine / contact", idn: "jalin / kontak" }, strokeCount: 12, level: "N4",
    exampleVocabIds: ["v4-renraku"],
  },
  {
    id: "k4-tan", character: "担", onyomi: ["タン"], kunyomi: ["かつ.ぐ", "にな.う"],
    meaning: { en: "carry / bear", idn: "memikul / menanggung" }, strokeCount: 8, level: "N4",
    exampleVocabIds: ["v4-tantou"],
  },
  {
    id: "k4-tou-kanji", character: "当", onyomi: ["トウ"], kunyomi: ["あ.たる", "まさ.に"],
    meaning: { en: "hit / appropriate", idn: "tepat / kena" }, strokeCount: 6, level: "N4",
    exampleVocabIds: ["v4-tantou"],
  },
  {
    id: "k4-rui", character: "類", onyomi: ["ルイ"], kunyomi: ["たぐ.い"],
    meaning: { en: "category / type", idn: "jenis / tipe" }, strokeCount: 18, level: "N4",
    exampleVocabIds: ["v4-shorui"],
  },
  {
    id: "k4-ga", character: "画", onyomi: ["ガ", "カク"], kunyomi: ["えが.く"],
    meaning: { en: "picture / stroke", idn: "gambar / coret" }, strokeCount: 8, level: "N4",
    exampleVocabIds: ["v4-gamen"],
  },
  {
    id: "k4-men", character: "面", onyomi: ["メン"], kunyomi: ["おも", "つら"],
    meaning: { en: "face / surface", idn: "wajah / permukaan" }, strokeCount: 9, level: "N4",
    exampleVocabIds: ["v4-gamen", "v3-mensetsu"],
  },
  {
    id: "k4-osu-kanji", character: "押", onyomi: ["オウ"], kunyomi: ["お.す"],
    meaning: { en: "push / press", idn: "menekan" }, strokeCount: 8, level: "N4",
    exampleVocabIds: ["v4-osu"],
  },
  {
    id: "k4-naosu-kanji", character: "直", onyomi: ["チョク", "ジキ"], kunyomi: ["なお.す", "ただ.ちに"],
    meaning: { en: "fix / straight", idn: "perbaiki / lurus" }, strokeCount: 8, level: "N4",
    exampleVocabIds: ["v4-naosu"],
  },
  {
    id: "k4-nyuu", character: "入", onyomi: ["ニュウ"], kunyomi: ["い.る", "い.れる", "はい.る"],
    meaning: { en: "enter / insert", idn: "masuk / memasukkan" }, strokeCount: 2, level: "N4",
    exampleVocabIds: ["v4-nyuuryoku"],
  },
  {
    id: "k4-ryoku", character: "力", onyomi: ["リョク", "リキ"], kunyomi: ["ちから"],
    meaning: { en: "power / strength", idn: "kekuatan / tenaga" }, strokeCount: 2, level: "N4",
    exampleVocabIds: ["v4-nyuuryoku"],
  },
  {
    id: "k4-ho", character: "保", onyomi: ["ホ", "ホウ"], kunyomi: ["たも.つ"],
    meaning: { en: "protect / maintain", idn: "lindungi / pertahankan" }, strokeCount: 9, level: "N4",
    exampleVocabIds: ["v4-hozon"],
  },
  {
    id: "k4-zon", character: "存", onyomi: ["ソン", "ゾン"], kunyomi: [],
    meaning: { en: "exist / suppose", idn: "ada / anggap" }, strokeCount: 6, level: "N4",
    exampleVocabIds: ["v4-hozon"],
  },

  // ═══ Standard N4 Kanji (not yet in vocab) ═════════════════════════════
  // ── Verbs ──
  {
    id: "k4-aru", character: "歩", onyomi: ["ホ", "ブ", "フ"], kunyomi: ["ある.く", "あゆ.む"],
    meaning: { en: "walk", idn: "berjalan" }, strokeCount: 8, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-hashi", character: "走", onyomi: ["ソウ"], kunyomi: ["はし.る"],
    meaning: { en: "run", idn: "berlari" }, strokeCount: 7, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-tomaru", character: "止", onyomi: ["シ"], kunyomi: ["と.まる", "と.める"],
    meaning: { en: "stop", idn: "berhenti" }, strokeCount: 4, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-kaesu", character: "返", onyomi: ["ヘン"], kunyomi: ["かえ.す", "かえ.る"],
    meaning: { en: "return / reply", idn: "mengembalikan / balas" }, strokeCount: 7, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-hajime", character: "始", onyomi: ["シ"], kunyomi: ["はじ.める", "はじ.まる"],
    meaning: { en: "begin / start", idn: "mulai" }, strokeCount: 8, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-owari", character: "終", onyomi: ["シュウ"], kunyomi: ["お.わる", "お.える"],
    meaning: { en: "end / finish", idn: "selesai / akhir" }, strokeCount: 11, level: "N4",
    exampleVocabIds: ["v4-owaru"],
  },
  {
    id: "k4-tsukuri", character: "作", onyomi: ["サク", "サ"], kunyomi: ["つく.る"],
    meaning: { en: "make / produce", idn: "membuat" }, strokeCount: 7, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-shirabe", character: "調", onyomi: ["チョウ"], kunyomi: ["しら.べる", "ととの.う"],
    meaning: { en: "investigate / adjust", idn: "selidiki / atur" }, strokeCount: 15, level: "N4", exampleVocabIds: [],
  },

  // ── Transport/Direction ──
  {
    id: "k4-mawari", character: "回", onyomi: ["カイ", "エ"], kunyomi: ["まわ.る", "まわ.す"],
    meaning: { en: "rotate / times (counter)", idn: "putar / kali (penghitung)" }, strokeCount: 6, level: "N4", exampleVocabIds: [],
  },

  // ── People/Family ──
  {
    id: "k4-shin", character: "親", onyomi: ["シン"], kunyomi: ["おや", "した.しい"],
    meaning: { en: "parent / intimate", idn: "orang tua / akrab" }, strokeCount: 16, level: "N4",
    exampleVocabIds: ["v4-shinyuu"],
  },
  {
    id: "k4-kyou-kanji", character: "兄", onyomi: ["ケイ", "キョウ"], kunyomi: ["あに"],
    meaning: { en: "older brother", idn: "kakak laki-laki" }, strokeCount: 5, level: "N4",
    exampleVocabIds: ["v5-ani"],
  },
  {
    id: "k4-ane", character: "姉", onyomi: ["シ"], kunyomi: ["あね"],
    meaning: { en: "older sister", idn: "kakak perempuan" }, strokeCount: 8, level: "N4",
    exampleVocabIds: ["v5-ane"],
  },
  {
    id: "k4-otouto", character: "弟", onyomi: ["テイ", "ダイ", "デ"], kunyomi: ["おとうと"],
    meaning: { en: "younger brother", idn: "adik laki-laki" }, strokeCount: 7, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-imouto", character: "妹", onyomi: ["マイ"], kunyomi: ["いもうと"],
    meaning: { en: "younger sister", idn: "adik perempuan" }, strokeCount: 8, level: "N4", exampleVocabIds: [],
  },

  // ── Places ──
  {
    id: "k4-byouin", character: "病", onyomi: ["ビョウ", "ヘイ"], kunyomi: ["や.む", "やまい"],
    meaning: { en: "sick / illness", idn: "sakit / penyakit" }, strokeCount: 10, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-in", character: "院", onyomi: ["イン"], kunyomi: [],
    meaning: { en: "institution / hospital", idn: "institusi / rumah sakit" }, strokeCount: 10, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-yuubin", character: "郵", onyomi: ["ユウ"], kunyomi: [],
    meaning: { en: "mail / postal", idn: "pos" }, strokeCount: 11, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-bin", character: "便", onyomi: ["ビン", "ベン"], kunyomi: ["たよ.り", "すなわち"],
    meaning: { en: "convenience / mail", idn: "kemudahan / pos" }, strokeCount: 9, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-ginkou", character: "銀", onyomi: ["ギン"], kunyomi: ["しろがね"],
    meaning: { en: "silver / bank", idn: "perak / bank" }, strokeCount: 14, level: "N4", exampleVocabIds: [],
  },

  // ── Time/Dates ──
  {
    id: "k4-shuu-week", character: "週", onyomi: ["シュウ"], kunyomi: [],
    meaning: { en: "week", idn: "minggu" }, strokeCount: 11, level: "N4",
    exampleVocabIds: ["v5-senshuu", "v5-konshuu"],
  },
  {
    id: "k4-you", character: "曜", onyomi: ["ヨウ"], kunyomi: [],
    meaning: { en: "day of week", idn: "hari (dalam seminggu)" }, strokeCount: 18, level: "N4",
    exampleVocabIds: ["v5-kinyoubi", "v5-nichiyoubi"],
  },
  {
    id: "k4-han", character: "半", onyomi: ["ハン"], kunyomi: ["なか.ば"],
    meaning: { en: "half", idn: "setengah" }, strokeCount: 5, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-bun", character: "分", onyomi: ["ブン", "フン", "ブ"], kunyomi: ["わ.ける", "わ.かる"],
    meaning: { en: "minute / divide", idn: "menit / bagi" }, strokeCount: 4, level: "N4", exampleVocabIds: [],
  },

  // ── Misc ──
  {
    id: "k4-shi", character: "市", onyomi: ["シ"], kunyomi: ["いち"],
    meaning: { en: "city / market", idn: "kota / pasar" }, strokeCount: 5, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-daigaku", character: "大", onyomi: ["ダイ", "タイ"], kunyomi: ["おお", "おお.きい"],
    meaning: { en: "big / great", idn: "besar" }, strokeCount: 3, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-chiisai", character: "小", onyomi: ["ショウ"], kunyomi: ["ちい.さい", "こ", "お"],
    meaning: { en: "small / little", idn: "kecil" }, strokeCount: 3, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-atarashii", character: "新", onyomi: ["シン"], kunyomi: ["あたら.しい", "あら.た", "にい"],
    meaning: { en: "new", idn: "baru" }, strokeCount: 13, level: "N4",
    exampleVocabIds: ["v5-atarashii"],
  },
  {
    id: "k4-furui", character: "古", onyomi: ["コ"], kunyomi: ["ふる.い", "いにしえ"],
    meaning: { en: "old / ancient", idn: "lama / kuno" }, strokeCount: 5, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-hayai", character: "早", onyomi: ["ソウ", "サッ"], kunyomi: ["はや.い", "はや"],
    meaning: { en: "early / fast", idn: "cepat / awal" }, strokeCount: 6, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-nagai", character: "長", onyomi: ["チョウ"], kunyomi: ["なが.い"],
    meaning: { en: "long / leader", idn: "panjang / pemimpin" }, strokeCount: 8, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-mijikai", character: "短", onyomi: ["タン"], kunyomi: ["みじか.い"],
    meaning: { en: "short", idn: "pendek" }, strokeCount: 12, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-akarui", character: "明", onyomi: ["メイ", "ミョウ"], kunyomi: ["あか.るい", "あ.かり"],
    meaning: { en: "bright / clear", idn: "terang / jelas" }, strokeCount: 8, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-kurai", character: "暗", onyomi: ["アン"], kunyomi: ["くら.い"],
    meaning: { en: "dark / gloomy", idn: "gelap / suram" }, strokeCount: 13, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-meshi", character: "飯", onyomi: ["ハン"], kunyomi: ["めし"],
    meaning: { en: "meal / cooked rice", idn: "makanan / nasi" }, strokeCount: 12, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-bunka", character: "化", onyomi: ["カ", "ケ"], kunyomi: ["ば.ける"],
    meaning: { en: "change / chemistry", idn: "berubah / kimia" }, strokeCount: 4, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-do", character: "度", onyomi: ["ド", "ト", "タク"], kunyomi: ["たび"],
    meaning: { en: "degree / time (occurrence)", idn: "derajat / kali" }, strokeCount: 9, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-kaze", character: "風", onyomi: ["フウ", "フ"], kunyomi: ["かぜ"],
    meaning: { en: "wind / style", idn: "angin / gaya" }, strokeCount: 9, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-tokoro", character: "所", onyomi: ["ショ"], kunyomi: ["ところ", "どころ"],
    meaning: { en: "place", idn: "tempat" }, strokeCount: 8, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-shinpai", character: "心", onyomi: ["シン"], kunyomi: ["こころ"],
    meaning: { en: "heart / mind", idn: "hati / pikiran" }, strokeCount: 4, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-omoi", character: "思", onyomi: ["シ"], kunyomi: ["おも.う"],
    meaning: { en: "think", idn: "berpikir" }, strokeCount: 9, level: "N4",
    exampleVocabIds: ["v4-omou"],
  },
  {
    id: "k4-kao", character: "顔", onyomi: ["ガン"], kunyomi: ["かお"],
    meaning: { en: "face", idn: "wajah" }, strokeCount: 18, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-chizu", character: "地", onyomi: ["チ", "ジ"], kunyomi: [],
    meaning: { en: "ground / earth", idn: "tanah / bumi" }, strokeCount: 6, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-iro", character: "色", onyomi: ["ショク", "シキ"], kunyomi: ["いろ"],
    meaning: { en: "color", idn: "warna" }, strokeCount: 6, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-ongaku", character: "音", onyomi: ["オン", "イン"], kunyomi: ["おと", "ね"],
    meaning: { en: "sound", idn: "suara" }, strokeCount: 9, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-tabi", character: "旅", onyomi: ["リョ"], kunyomi: ["たび"],
    meaning: { en: "travel / trip", idn: "perjalanan" }, strokeCount: 10, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-hataraku", character: "働", onyomi: ["ドウ"], kunyomi: ["はたら.く"],
    meaning: { en: "work (physical)", idn: "bekerja" }, strokeCount: 13, level: "N4", exampleVocabIds: [],
  },
  {
    id: "k4-okiru", character: "起", onyomi: ["キ"], kunyomi: ["お.きる", "お.こる"],
    meaning: { en: "wake up / occur", idn: "bangun / terjadi" }, strokeCount: 10, level: "N4", exampleVocabIds: [],
  },
];

/**
 * Kanji curriculum — N3 level (~75 kanji).
 *
 * Does NOT repeat kanji already listed in KANJI_N5 or KANJI_N4.
 * Heavily skewed toward work/business vocabulary (matching the N3 word pool).
 */
export const KANJI_N3: KanjiEntry[] = [
  // ═══ Work/Business (N3 vocab) ════════════════════════════════════════
  {
    id: "k3-kai", character: "開", onyomi: ["カイ"], kunyomi: ["ひら.く", "あ.く", "あ.ける"],
    meaning: { en: "open / develop", idn: "buka / kembangkan" }, strokeCount: 12, level: "N3",
    exampleVocabIds: ["v3-kaihatsu"],
  },
  {
    id: "k3-setsu", character: "設", onyomi: ["セツ"], kunyomi: ["もう.ける"],
    meaning: { en: "establish / design", idn: "mendirikan / merancang" }, strokeCount: 11, level: "N3",
    exampleVocabIds: ["v3-sekkei"],
  },
  {
    id: "k3-kei", character: "計", onyomi: ["ケイ"], kunyomi: ["はか.る"],
    meaning: { en: "measure / plan", idn: "ukur / rencana" }, strokeCount: 9, level: "N3",
    exampleVocabIds: ["v3-sekkei"],
  },
  {
    id: "k3-fu", character: "不", onyomi: ["フ", "ブ"], kunyomi: [],
    meaning: { en: "not / un-", idn: "tidak / bukan" }, strokeCount: 4, level: "N3",
    exampleVocabIds: ["v3-fuguai"],
  },
  {
    id: "k3-gu", character: "具", onyomi: ["グ"], kunyomi: ["そな.える"],
    meaning: { en: "tool / ingredient", idn: "alat / perlengkapan" }, strokeCount: 8, level: "N3",
    exampleVocabIds: ["v3-fuguai"],
  },
  {
    id: "k3-gou", character: "合", onyomi: ["ゴウ", "ガッ", "カッ"], kunyomi: ["あ.う", "あ.わせる"],
    meaning: { en: "fit / combine", idn: "cocok / gabung" }, strokeCount: 6, level: "N3",
    exampleVocabIds: ["v3-fuguai"],
  },
  {
    id: "k3-shuu-kanji", character: "修", onyomi: ["シュウ", "シュ"], kunyomi: ["おさ.める"],
    meaning: { en: "repair / correct", idn: "perbaiki / betulkan" }, strokeCount: 10, level: "N3",
    exampleVocabIds: ["v3-shuusei"],
  },
  {
    id: "k3-sei-kanji", character: "正", onyomi: ["セイ", "ショウ"], kunyomi: ["ただ.しい", "まさ"],
    meaning: { en: "correct / right", idn: "benar / tepat" }, strokeCount: 5, level: "N3",
    exampleVocabIds: ["v3-shuusei"],
  },
  {
    id: "k3-kaku", character: "確", onyomi: ["カク", "コウ"], kunyomi: ["たし.か"],
    meaning: { en: "certain / confirm", idn: "pasti / konfirmasi" }, strokeCount: 15, level: "N3",
    exampleVocabIds: ["v3-kakunin"],
  },
  {
    id: "k3-nin", character: "認", onyomi: ["ニン"], kunyomi: ["みと.める"],
    meaning: { en: "recognize / acknowledge", idn: "mengakui" }, strokeCount: 14, level: "N3",
    exampleVocabIds: ["v3-kakunin"],
  },
  {
    id: "k3-kan", character: "環", onyomi: ["カン"], kunyomi: ["わ"],
    meaning: { en: "ring / environment", idn: "lingkaran / lingkungan" }, strokeCount: 17, level: "N3",
    exampleVocabIds: ["v3-kankyou"],
  },
  {
    id: "k3-kyou-kanji", character: "境", onyomi: ["キョウ", "ケイ"], kunyomi: ["さかい"],
    meaning: { en: "boundary / environment", idn: "batas / lingkungan" }, strokeCount: 14, level: "N3",
    exampleVocabIds: ["v3-kankyou"],
  },
  {
    id: "k3-ki", character: "機", onyomi: ["キ"], kunyomi: ["はた"],
    meaning: { en: "machine / opportunity", idn: "mesin / kesempatan" }, strokeCount: 16, level: "N3",
    exampleVocabIds: ["v3-kinou"],
  },
  {
    id: "k3-nou", character: "能", onyomi: ["ノウ"], kunyomi: [],
    meaning: { en: "ability / function", idn: "kemampuan / fungsi" }, strokeCount: 10, level: "N3",
    exampleVocabIds: ["v3-kinou"],
  },
  {
    id: "k3-tei", character: "提", onyomi: ["テイ", "チョウ"], kunyomi: ["さ.げる"],
    meaning: { en: "propose / present", idn: "mengusulkan" }, strokeCount: 12, level: "N3",
    exampleVocabIds: ["v3-teian"],
  },
  {
    id: "k3-an", character: "案", onyomi: ["アン"], kunyomi: [],
    meaning: { en: "plan / proposal", idn: "rencana / usulan" }, strokeCount: 10, level: "N3",
    exampleVocabIds: ["v3-teian"],
  },
  {
    id: "k3-tei-kanji", character: "締", onyomi: ["テイ"], kunyomi: ["し.める"],
    meaning: { en: "tighten / close", idn: "mengencangkan / menutup" }, strokeCount: 15, level: "N3",
    exampleVocabIds: ["v3-shime"],
  },
  {
    id: "k3-kiri", character: "切", onyomi: ["セツ", "サイ"], kunyomi: ["き.る", "き.り"],
    meaning: { en: "cut / deadline", idn: "potong / batas" }, strokeCount: 4, level: "N3",
    exampleVocabIds: ["v3-shime", "v3-ryoushuu"],
  },
  {
    id: "k3-you-kanji", character: "様", onyomi: ["ヨウ"], kunyomi: ["さま"],
    meaning: { en: "manner / style", idn: "cara / gaya" }, strokeCount: 14, level: "N3",
    exampleVocabIds: ["v3-shiyou"],
  },
  {
    id: "k3-zan", character: "残", onyomi: ["ザン"], kunyomi: ["のこ.る", "のこ.す"],
    meaning: { en: "remain / leftover", idn: "tersisa" }, strokeCount: 10, level: "N3",
    exampleVocabIds: ["v3-zangyou"],
  },
  {
    id: "k3-kei-kanji", character: "契", onyomi: ["ケイ"], kunyomi: ["ちぎ.る"],
    meaning: { en: "pledge / contract", idn: "janji / kontrak" }, strokeCount: 9, level: "N3",
    exampleVocabIds: ["v3-keiyaku"],
  },
  {
    id: "k3-setsu-kanji", character: "接", onyomi: ["セツ", "ショウ"], kunyomi: ["つ.ぐ"],
    meaning: { en: "connect / interview", idn: "sambung / wawancara" }, strokeCount: 11, level: "N3",
    exampleVocabIds: ["v3-mensetsu"],
  },
  {
    id: "k3-doryoku", character: "努", onyomi: ["ド"], kunyomi: ["つと.める"],
    meaning: { en: "strive / effort", idn: "berusaha" }, strokeCount: 7, level: "N3",
    exampleVocabIds: ["v3-doryoku"],
  },
  {
    id: "k3-seichou", character: "成", onyomi: ["セイ", "ジョウ"], kunyomi: ["な.る", "な.す"],
    meaning: { en: "become / accomplish", idn: "menjadi / mencapai" }, strokeCount: 6, level: "N3",
    exampleVocabIds: ["v3-seichou"],
  },
  {
    id: "k3-kan-kankei", character: "関", onyomi: ["カン"], kunyomi: ["せき", "かか.わる"],
    meaning: { en: "relation / barrier", idn: "hubungan / gerbang" }, strokeCount: 14, level: "N3",
    exampleVocabIds: ["v3-kankei"],
  },
  {
    id: "k3-kei-kankei", character: "係", onyomi: ["ケイ"], kunyomi: ["かか.る", "かかり"],
    meaning: { en: "connection / charge", idn: "hubungan / penanggung jawab" }, strokeCount: 9, level: "N3",
    exampleVocabIds: ["v3-kankei"],
  },
  {
    id: "k3-taido", character: "態", onyomi: ["タイ"], kunyomi: ["わざ.と"],
    meaning: { en: "attitude / state", idn: "sikap / keadaan" }, strokeCount: 14, level: "N3",
    exampleVocabIds: ["v3-taido"],
  },
  {
    id: "k3-jou", character: "常", onyomi: ["ジョウ"], kunyomi: ["つね", "とこ"],
    meaning: { en: "usual / always", idn: "biasa / selalu" }, strokeCount: 11, level: "N3",
    exampleVocabIds: ["v3-joushiki"],
  },
  {
    id: "k3-shiki", character: "識", onyomi: ["シキ"], kunyomi: [],
    meaning: { en: "knowledge / discrimination", idn: "pengetahuan" }, strokeCount: 19, level: "N3",
    exampleVocabIds: ["v3-joushiki"],
  },
  {
    id: "k3-rei", character: "礼", onyomi: ["レイ", "ライ"], kunyomi: [],
    meaning: { en: "gratitude / etiquette", idn: "terima kasih / tata krama" }, strokeCount: 5, level: "N3",
    exampleVocabIds: ["v3-reigi"],
  },
  {
    id: "k3-gi-kanji", character: "儀", onyomi: ["ギ"], kunyomi: [],
    meaning: { en: "ceremony / manners", idn: "upacara / tata krama" }, strokeCount: 15, level: "N3",
    exampleVocabIds: ["v3-reigi"],
  },
  {
    id: "k3-zoku", character: "続", onyomi: ["ゾク", "ショク"], kunyomi: ["つづ.く", "つづ.ける"],
    meaning: { en: "continue / procedure", idn: "lanjut / prosedur" }, strokeCount: 13, level: "N3",
    exampleVocabIds: ["v3-shorui2"],
  },
  {
    id: "k3-gen", character: "原", onyomi: ["ゲン"], kunyomi: ["はら"],
    meaning: { en: "origin / field", idn: "asal / padang" }, strokeCount: 10, level: "N3",
    exampleVocabIds: ["v3-genin"],
  },
  {
    id: "k3-genin", character: "因", onyomi: ["イン"], kunyomi: ["よ.る"],
    meaning: { en: "cause / factor", idn: "penyebab / faktor" }, strokeCount: 6, level: "N3",
    exampleVocabIds: ["v3-genin"],
  },
  {
    id: "k3-ketsu", character: "結", onyomi: ["ケツ", "ケチ"], kunyomi: ["むす.ぶ", "ゆ.う"],
    meaning: { en: "tie / result", idn: "ikat / hasil" }, strokeCount: 12, level: "N3",
    exampleVocabIds: ["v3-kekka"],
  },
  {
    id: "k3-ka", character: "果", onyomi: ["カ"], kunyomi: ["は.たす", "は.て"],
    meaning: { en: "fruit / result", idn: "buah / hasil" }, strokeCount: 8, level: "N3",
    exampleVocabIds: ["v3-kekka"],
  },
  {
    id: "k3-kyou-kanji2", character: "況", onyomi: ["キョウ"], kunyomi: ["いわ.んや", "まし.て"],
    meaning: { en: "condition / situation", idn: "kondisi / situasi" }, strokeCount: 8, level: "N3",
    exampleVocabIds: ["v3-joukyou"],
  },
  {
    id: "k3-kaiketsu-ka", character: "解", onyomi: ["カイ", "ゲ"], kunyomi: ["と.く", "と.ける"],
    meaning: { en: "solve / untie", idn: "selesaikan / lepaskan" }, strokeCount: 13, level: "N3",
    exampleVocabIds: ["v3-kaiketsu"],
  },
  {
    id: "k3-ketsu-kanji", character: "決", onyomi: ["ケツ"], kunyomi: ["き.める", "き.まる"],
    meaning: { en: "decide / resolve", idn: "putuskan / selesaikan" }, strokeCount: 7, level: "N3",
    exampleVocabIds: ["v3-kaiketsu"],
  },
  {
    id: "k3-jun", character: "準", onyomi: ["ジュン"], kunyomi: ["じゅん.じる"],
    meaning: { en: "standard / preparation", idn: "standar / persiapan" }, strokeCount: 13, level: "N3",
    exampleVocabIds: ["v3-junbi"],
  },
  {
    id: "k3-bi", character: "備", onyomi: ["ビ"], kunyomi: ["そな.える"],
    meaning: { en: "equip / prepare", idn: "siapkan / lengkapi" }, strokeCount: 12, level: "N3",
    exampleVocabIds: ["v3-junbi"],
  },
  {
    id: "k3-yuu", character: "優", onyomi: ["ユウ", "ウ"], kunyomi: ["やさ.しい", "すぐ.れる"],
    meaning: { en: "excellent / priority", idn: "unggul / prioritas" }, strokeCount: 17, level: "N3",
    exampleVocabIds: ["v3-yuusen"],
  },
  {
    id: "k3-hou", character: "報", onyomi: ["ホウ"], kunyomi: ["むく.いる"],
    meaning: { en: "report / inform", idn: "lapor / beri tahu" }, strokeCount: 12, level: "N3",
    exampleVocabIds: ["v3-houkoku"],
  },
  {
    id: "k3-koku", character: "告", onyomi: ["コク"], kunyomi: ["つ.げる"],
    meaning: { en: "tell / announce", idn: "beri tahu / umumkan" }, strokeCount: 7, level: "N3",
    exampleVocabIds: ["v3-houkoku"],
  },
  {
    id: "k3-sou", character: "相", onyomi: ["ソウ", "ショウ"], kunyomi: ["あい"],
    meaning: { en: "mutual / aspect", idn: "saling / aspek" }, strokeCount: 9, level: "N3",
    exampleVocabIds: ["v3-soudan"],
  },
  {
    id: "k3-dan", character: "談", onyomi: ["ダン"], kunyomi: [],
    meaning: { en: "discuss / consultation", idn: "diskusi / konsultasi" }, strokeCount: 15, level: "N3",
    exampleVocabIds: ["v3-soudan"],
  },
  {
    id: "k3-in", character: "員", onyomi: ["イン"], kunyomi: [],
    meaning: { en: "member / employee", idn: "anggota / karyawan" }, strokeCount: 10, level: "N3",
    exampleVocabIds: ["v3-shain"],
  },
  {
    id: "k3-hai", character: "輩", onyomi: ["ハイ"], kunyomi: ["ともがら", "やから"],
    meaning: { en: "comrade / colleague", idn: "rekan / kolega" }, strokeCount: 15, level: "N3",
    exampleVocabIds: ["v3-senpai"],
  },
  {
    id: "k3-tei-kanji2", character: "停", onyomi: ["テイ"], kunyomi: ["と.める"],
    meaning: { en: "stop / halt", idn: "berhenti / hentikan" }, strokeCount: 11, level: "N3",
    exampleVocabIds: ["v3-teiden"],
  },
  {
    id: "k3-un", character: "運", onyomi: ["ウン"], kunyomi: ["はこ.ぶ"],
    meaning: { en: "carry / luck", idn: "angkut / nasib" }, strokeCount: 12, level: "N3",
    exampleVocabIds: ["v3-unten"],
  },
  {
    id: "k3-ten", character: "転", onyomi: ["テン"], kunyomi: ["ころ.がる", "ころ.げる"],
    meaning: { en: "revolve / transfer", idn: "putar / pindah" }, strokeCount: 11, level: "N3",
    exampleVocabIds: ["v3-unten"],
  },
  {
    id: "k3-kon", character: "混", onyomi: ["コン"], kunyomi: ["ま.じる", "ま.ざる"],
    meaning: { en: "mix / crowd", idn: "campur / ramai" }, strokeCount: 11, level: "N3",
    exampleVocabIds: ["v3-konzatsu"],
  },
  {
    id: "k3-zatsu", character: "雑", onyomi: ["ザツ", "ゾウ"], kunyomi: ["まじ.える"],
    meaning: { en: "miscellaneous / rough", idn: "campur aduk / kasar" }, strokeCount: 14, level: "N3",
    exampleVocabIds: ["v3-konzatsu"],
  },
  {
    id: "k3-seisan", character: "精", onyomi: ["セイ", "ショウ"], kunyomi: [],
    meaning: { en: "refined / precise", idn: "teliti / cermat" }, strokeCount: 14, level: "N3",
    exampleVocabIds: ["v3-seisan"],
  },
  {
    id: "k3-san", character: "算", onyomi: ["サン"], kunyomi: ["そろ"],
    meaning: { en: "calculate / fare", idn: "hitung / tarif" }, strokeCount: 14, level: "N3",
    exampleVocabIds: ["v3-seisan"],
  },
  {
    id: "k3-seki", character: "夕", onyomi: ["セキ"], kunyomi: ["ゆう"],
    meaning: { en: "evening", idn: "sore" }, strokeCount: 3, level: "N3",
    exampleVocabIds: ["v3-yuudachi"],
  },
  {
    id: "k3-ritsu", character: "立", onyomi: ["リツ", "リュウ"], kunyomi: ["た.つ", "た.てる"],
    meaning: { en: "stand / rise", idn: "berdiri / bangun" }, strokeCount: 5, level: "N3",
    exampleVocabIds: ["v3-yuudachi"],
  },
  {
    id: "k3-shou", character: "賞", onyomi: ["ショウ"], kunyomi: ["ほ.める"],
    meaning: { en: "prize / praise", idn: "hadiah / pujian" }, strokeCount: 15, level: "N3",
    exampleVocabIds: ["v3-shoumi"],
  },
  {
    id: "k3-ki-kanji", character: "期", onyomi: ["キ", "ゴ"], kunyomi: [],
    meaning: { en: "period / term", idn: "periode / jangka" }, strokeCount: 12, level: "N3",
    exampleVocabIds: ["v3-shoumi"],
  },
  {
    id: "k3-gen-kanji", character: "限", onyomi: ["ゲン"], kunyomi: ["かぎ.る"],
    meaning: { en: "limit / boundary", idn: "batas" }, strokeCount: 9, level: "N3",
    exampleVocabIds: ["v3-shoumi"],
  },
  {
    id: "k3-ryou", character: "領", onyomi: ["リョウ"], kunyomi: ["えり"],
    meaning: { en: "territory / receive", idn: "wilayah / terima" }, strokeCount: 14, level: "N3",
    exampleVocabIds: ["v3-ryoushuu"],
  },
  {
    id: "k3-shuu", character: "収", onyomi: ["シュウ"], kunyomi: ["おさ.める"],
    meaning: { en: "collect / income", idn: "kumpul / terima" }, strokeCount: 4, level: "N3",
    exampleVocabIds: ["v3-ryoushuu"],
  },
  {
    id: "k3-koshi", character: "越", onyomi: ["エツ", "オツ"], kunyomi: ["こ.す", "こ.える"],
    meaning: { en: "cross / exceed", idn: "lewati / melampaui" }, strokeCount: 12, level: "N3",
    exampleVocabIds: ["v3-hikkoshi"],
  },
  {
    id: "k3-kyuuryou", character: "給", onyomi: ["キュウ"], kunyomi: ["たま.う"],
    meaning: { en: "supply / salary", idn: "pasok / gaji" }, strokeCount: 12, level: "N3",
    exampleVocabIds: ["v3-kyuuryou"],
  },
  {
    id: "k3-kubaru", character: "配", onyomi: ["ハイ"], kunyomi: ["くば.る"],
    meaning: { en: "distribute / worry", idn: "bagikan / khawatir" }, strokeCount: 10, level: "N3",
    exampleVocabIds: ["v3-shinpai"],
  },

  // ═══ Standard N3 Kanji (not yet in vocab) ═════════════════════════════
  {
    id: "k3-hatsu", character: "初", onyomi: ["ショ"], kunyomi: ["はじ.め", "はつ"],
    meaning: { en: "first / beginning", idn: "pertama / awal" }, strokeCount: 7, level: "N3", exampleVocabIds: [],
  },
  {
    id: "k3-byou", character: "秒", onyomi: ["ビョウ"], kunyomi: [],
    meaning: { en: "second (time unit)", idn: "detik" }, strokeCount: 9, level: "N3", exampleVocabIds: [],
  },
  {
    id: "k3-kanji", character: "感", onyomi: ["カン"], kunyomi: [],
    meaning: { en: "feeling / sense", idn: "perasaan" }, strokeCount: 13, level: "N3", exampleVocabIds: [],
  },
  {
    id: "k3-jouhou", character: "情", onyomi: ["ジョウ", "セイ"], kunyomi: ["なさ.け"],
    meaning: { en: "feeling / information", idn: "perasaan / informasi" }, strokeCount: 11, level: "N3", exampleVocabIds: [],
  },
  {
    id: "k3-seiji", character: "政", onyomi: ["セイ", "ショウ"], kunyomi: ["まつりごと"],
    meaning: { en: "government / politics", idn: "pemerintahan / politik" }, strokeCount: 9, level: "N3", exampleVocabIds: [],
  },
  {
    id: "k3-kyouiku", character: "教", onyomi: ["キョウ"], kunyomi: ["おし.える", "おそ.わる"],
    meaning: { en: "teach / education", idn: "ajar / pendidikan" }, strokeCount: 11, level: "N3", exampleVocabIds: [],
  },
  {
    id: "k3-rekishi", character: "歴", onyomi: ["レキ"], kunyomi: [],
    meaning: { en: "history / career", idn: "sejarah / riwayat" }, strokeCount: 14, level: "N3", exampleVocabIds: [],
  },
  {
    id: "k3-shi", character: "史", onyomi: ["シ"], kunyomi: [],
    meaning: { en: "history", idn: "sejarah" }, strokeCount: 5, level: "N3", exampleVocabIds: [],
  },
  {
    id: "k3-kenkyuu", character: "研", onyomi: ["ケン"], kunyomi: ["と.ぐ"],
    meaning: { en: "research / sharpen", idn: "riset / asah" }, strokeCount: 9, level: "N3", exampleVocabIds: [],
  },
  {
    id: "k3-kyuu", character: "究", onyomi: ["キュウ"], kunyomi: ["きわ.める"],
    meaning: { en: "research / master", idn: "teliti / kuasai" }, strokeCount: 7, level: "N3", exampleVocabIds: [],
  },
  {
    id: "k3-hyou", character: "表", onyomi: ["ヒョウ"], kunyomi: ["おもて", "あらわ.す"],
    meaning: { en: "surface / express", idn: "permukaan / ungkapkan" }, strokeCount: 8, level: "N3", exampleVocabIds: [],
  },
  {
    id: "k3-juu", character: "住", onyomi: ["ジュウ", "チュウ"], kunyomi: ["す.む", "す.まう"],
    meaning: { en: "live / reside", idn: "tinggal" }, strokeCount: 7, level: "N3",
    exampleVocabIds: ["v4-sumu"],
  },
  {
    id: "k3-kyaku", character: "客", onyomi: ["キャク", "カク"], kunyomi: [],
    meaning: { en: "guest / customer", idn: "tamu / pelanggan" }, strokeCount: 9, level: "N3", exampleVocabIds: [],
  },
  {
    id: "k3-eigyou", character: "営", onyomi: ["エイ"], kunyomi: ["いとな.む"],
    meaning: { en: "manage / operate", idn: "kelola / operasikan" }, strokeCount: 12, level: "N3", exampleVocabIds: [],
  },
  {
    id: "k3-tsutomeru", character: "勤", onyomi: ["キン", "ゴン"], kunyomi: ["つと.める"],
    meaning: { en: "work / serve", idn: "bekerja / mengabdi" }, strokeCount: 12, level: "N3", exampleVocabIds: [],
  },
  {
    id: "k3-mamoru", character: "守", onyomi: ["シュ", "ス"], kunyomi: ["まも.る", "もり"],
    meaning: { en: "protect / guard", idn: "lindungi / jaga" }, strokeCount: 6, level: "N3", exampleVocabIds: [],
  },
  {
    id: "k3-wasureru", character: "忘", onyomi: ["ボウ"], kunyomi: ["わす.れる"],
    meaning: { en: "forget", idn: "lupa" }, strokeCount: 7, level: "N3",
    exampleVocabIds: ["v4-wasureru"],
  },
  {
    id: "k3-oboeru", character: "覚", onyomi: ["カク"], kunyomi: ["おぼ.える", "さ.ます", "さ.める"],
    meaning: { en: "remember / wake up", idn: "ingat / bangun" }, strokeCount: 12, level: "N3", exampleVocabIds: [],
  },
  {
    id: "k3-naosu", character: "治", onyomi: ["ジ", "チ"], kunyomi: ["おさ.める", "なお.る", "なお.す"],
    meaning: { en: "govern / heal", idn: "memerintah / sembuh" }, strokeCount: 8, level: "N3", exampleVocabIds: [],
  },
  {
    id: "k3-okuru", character: "送", onyomi: ["ソウ"], kunyomi: ["おく.る"],
    meaning: { en: "send / escort", idn: "kirim / antar" }, strokeCount: 9, level: "N3", exampleVocabIds: [],
  },
  {
    id: "k3-kawaru", character: "変", onyomi: ["ヘン"], kunyomi: ["か.わる", "か.える"],
    meaning: { en: "change / unusual", idn: "berubah / aneh" }, strokeCount: 9, level: "N3",
    exampleVocabIds: ["v4-kawaru"],
  },
  {
    id: "k3-kimi", character: "君", onyomi: ["クン"], kunyomi: ["きみ"],
    meaning: { en: "you (familiar) / ruler", idn: "kamu / penguasa" }, strokeCount: 7, level: "N3", exampleVocabIds: [],
  },
  {
    id: "k3-mono", character: "者", onyomi: ["シャ"], kunyomi: ["もの"],
    meaning: { en: "person / -er (suffix)", idn: "orang (akhiran pelaku)" }, strokeCount: 8, level: "N3", exampleVocabIds: [],
  },
  {
    id: "k3-gou-sign", character: "号", onyomi: ["ゴウ"], kunyomi: [],
    meaning: { en: "number / sign", idn: "nomor / tanda" }, strokeCount: 5, level: "N3", exampleVocabIds: [],
  },
];

export const ALL_KANJI: KanjiEntry[] = [...KANJI_N5, ...KANJI_N4, ...KANJI_N3];

export const kanjiByLevel = (level: JlptLevel) => ALL_KANJI.filter(k => k.level === level);
