import type { GrammarPoint } from "@/core/types";

/**
 * Grammar curriculum. One point is taught per in-game morning (study desk),
 * then reinforced at school. Points cycle once exhausted.
 */
export const GRAMMAR: GrammarPoint[] = [
  // ═══ N5 ═══════════════════════════════════════════════════════════════
  {
    id: "g5-desu", level: "N5", title: "〜です", meaning: "to be (polite)", meaningIdn: "adalah (bentuk sopan)",
    explanation: "です politely states what something is. Put it after a noun or na-adjective. The negative is じゃありません.",
    explanationIdn: "です menyatakan sesuatu dengan sopan. Letakkan setelah kata benda atau kata sifat -na. Bentuk negatifnya adalah じゃありません.",
    examples: [
      { jp: "私は学生です。", kana: "わたしはがくせいです。", en: "I am a student." },
      { jp: "これはパンです。", kana: "これはパンです。", en: "This is bread." },
    ],
    exercises: [
      { kind: "order", prompt: "I am a student.", tiles: ["私", "は", "学生", "です"], translation: "私は学生です。" },
      { kind: "fill", prompt: "Choose the polite copula.", sentence: "田中さんは先生___。", options: ["です", "ます", "だます"], answer: "です", translation: "Tanaka-san is a teacher." },
      { kind: "order", prompt: "This is water.", tiles: ["これ", "は", "水", "です"], translation: "これは水です。" },
    ],
  },
  {
    id: "g5-masu", level: "N5", title: "〜ます", meaning: "polite verb ending", meaningIdn: "akhiran kata kerja sopan",
    explanation: "ます makes verbs polite: 食べる→食べます. Negative is ません, past is ました.",
    explanationIdn: "ます membuat kata kerja menjadi sopan: 食べる→食べます. Bentuk negatifnya ません, bentuk lampaunya ました.",
    examples: [
      { jp: "毎朝パンを食べます。", kana: "まいあさパンをたべます。", en: "I eat bread every morning." },
      { jp: "水を飲みます。", kana: "みずをのみます。", en: "I drink water." },
    ],
    exercises: [
      { kind: "order", prompt: "I study Japanese.", tiles: ["日本語", "を", "勉強", "します"], translation: "日本語を勉強します。" },
      { kind: "fill", prompt: "Make it polite.", sentence: "明日学校に行き___。", options: ["ます", "です", "ました"], answer: "ます", translation: "I will go to school tomorrow." },
      { kind: "order", prompt: "I go home by train.", tiles: ["電車", "で", "家", "に", "帰ります"], translation: "電車で家に帰ります。" },
    ],
  },
  {
    id: "g5-wa-ga", level: "N5", title: "は・が", meaning: "topic and subject particles", meaningIdn: "partikel topik dan subjek",
    explanation: "は marks the topic (what we're talking about). が marks the subject, often for new information or emphasis: 私は学生です / 猫がいます.",
    explanationIdn: "は menandai topik (hal yang sedang dibicarakan). が menandai subjek, sering untuk informasi baru atau penekanan: 私は学生です / 猫がいます.",
    examples: [
      { jp: "私は留学生です。", kana: "わたしはりゅうがくせいです。", en: "I am an international student." },
      { jp: "公園に犬がいます。", kana: "こうえんにいぬがいます。", en: "There is a dog in the park." },
    ],
    exercises: [
      { kind: "fill", prompt: "Mark the topic.", sentence: "今日___いい天気です。", options: ["は", "が", "を"], answer: "は", translation: "As for today, the weather is nice." },
      { kind: "fill", prompt: "New information appears!", sentence: "あ、電車___来ました。", options: ["が", "は", "に"], answer: "が", translation: "Ah, the train has come." },
    ],
  },
  {
    id: "g5-o", level: "N5", title: "〜を", meaning: "direct object particle", meaningIdn: "partikel objek",
    explanation: "を marks what the action is done to: パンを食べます (I eat bread).",
    explanationIdn: "を menandai objek yang dikenai tindakan: パンを食べます (saya makan roti).",
    examples: [
      { jp: "卵を買います。", kana: "たまごをかいます。", en: "I buy eggs." },
      { jp: "本を読みます。", kana: "ほんをよみます。", en: "I read a book." },
    ],
    exercises: [
      { kind: "fill", prompt: "Mark the object.", sentence: "牛乳___飲みます。", options: ["を", "は", "で"], answer: "を", translation: "I drink milk." },
      { kind: "order", prompt: "I buy vegetables at the supermarket.", tiles: ["スーパー", "で", "野菜", "を", "買います"], translation: "スーパーで野菜を買います。" },
    ],
  },
  {
    id: "g5-ni-de", level: "N5", title: "〜に・〜で", meaning: "place and destination particles", meaningIdn: "partikel tempat & tujuan",
    explanation: "に marks destination or location of existence (学校に行く、家にいる). で marks where an action happens (図書館で勉強する).",
    explanationIdn: "に menandai tujuan atau lokasi keberadaan (学校に行く、家にいる). で menandai tempat berlangsungnya aksi (図書館で勉強する).",
    examples: [
      { jp: "駅に行きます。", kana: "えきにいきます。", en: "I go to the station." },
      { jp: "図書館で勉強します。", kana: "としょかんでべんきょうします。", en: "I study at the library." },
    ],
    exercises: [
      { kind: "fill", prompt: "Where the action happens.", sentence: "レストラン___ご飯を食べます。", options: ["で", "に", "を"], answer: "で", translation: "I eat a meal at the restaurant." },
      { kind: "fill", prompt: "Destination!", sentence: "会社___行きます。", options: ["に", "で", "が"], answer: "に", translation: "I go to the company." },
    ],
  },
  {
    id: "g5-tai", level: "N5", title: "〜たい", meaning: "want to do", meaningIdn: "ingin melakukan",
    explanation: "Attach たい to the verb stem to say you want to do something: 食べたい (want to eat). It conjugates like an i-adjective.",
    explanationIdn: "Tempelkan たい ke bentuk dasar kata kerja untuk menyatakan keinginan: 食べたい (ingin makan). Pola perubahannya seperti kata sifat -i.",
    examples: [
      { jp: "日本で働きたいです。", kana: "にほんではたらきたいです。", en: "I want to work in Japan." },
      { jp: "ラーメンを食べたいです。", kana: "ラーメンをたべたいです。", en: "I want to eat ramen." },
    ],
    exercises: [
      { kind: "order", prompt: "I want to become an engineer.", tiles: ["エンジニア", "に", "なりたい", "です"], translation: "エンジニアになりたいです。" },
      { kind: "fill", prompt: "Express desire.", sentence: "水を飲み___です。", options: ["たい", "ます", "ましょう"], answer: "たい", translation: "I want to drink water." },
    ],
  },
  {
    id: "g5-tekudasai", level: "N5", title: "〜てください", meaning: "please do…", meaningIdn: "tolong lakukan…",
    explanation: "Te-form + ください politely asks someone to do something: 見てください (please look).",
    explanationIdn: "Bentuk -te + ください untuk meminta seseorang melakukan sesuatu dengan sopan: 見てください (tolong lihat).",
    examples: [
      { jp: "ここに名前を書いてください。", kana: "ここになまえをかいてください。", en: "Please write your name here." },
      { jp: "もう一度言ってください。", kana: "もういちどいってください。", en: "Please say it one more time." },
    ],
    exercises: [
      { kind: "order", prompt: "Please wait a moment.", tiles: ["ちょっと", "待って", "ください"], translation: "ちょっと待ってください。" },
      { kind: "fill", prompt: "Ask politely.", sentence: "ボタンを押して___。", options: ["ください", "います", "たいです"], answer: "ください", translation: "Please press the button." },
    ],
  },
  {
    id: "g5-arimasu", level: "N5", title: "あります・います", meaning: "existence (things / living)", meaningIdn: "keberadaan (benda / makhluk hidup)",
    explanation: "あります = inanimate things exist. います = people and animals exist. 机があります / 猫がいます.",
    explanationIdn: "あります = benda mati ada. います = orang dan hewan ada. 机があります / 猫がいます.",
    examples: [
      { jp: "コンビニに卵があります。", kana: "コンビニにたまごがあります。", en: "There are eggs at the convenience store." },
      { jp: "教室に先生がいます。", kana: "きょうしつにせんせいがいます。", en: "The teacher is in the classroom." },
    ],
    exercises: [
      { kind: "fill", prompt: "A cat exists!", sentence: "公園に猫が___。", options: ["います", "あります", "です"], answer: "います", translation: "There is a cat in the park." },
      { kind: "fill", prompt: "Money exists…?", sentence: "財布にお金が___。", options: ["あります", "います", "します"], answer: "あります", translation: "There is money in the wallet." },
    ],
  },
  {
    id: "g5-mashita", level: "N5", title: "〜ました", meaning: "polite past tense", meaningIdn: "bentuk lampau sopan",
    explanation: "ました is the past of ます: 食べました (ate). Negative past is ませんでした.",
    explanationIdn: "ました adalah bentuk lampau dari ます: 食べました (sudah makan). Negatif lampaunya ませんでした.",
    examples: [
      { jp: "昨日、勉強しました。", kana: "きのう、べんきょうしました。", en: "I studied yesterday." },
      { jp: "朝ご飯を食べました。", kana: "あさごはんをたべました。", en: "I ate breakfast." },
    ],
    exercises: [
      { kind: "order", prompt: "I bought a ticket at the station.", tiles: ["駅", "で", "切符", "を", "買いました"], translation: "駅で切符を買いました。" },
      { kind: "fill", prompt: "Talk about yesterday.", sentence: "昨日、映画を見___。", options: ["ました", "ます", "たい"], answer: "ました", translation: "I watched a movie yesterday." },
    ],
  },
  {
    id: "g5-adj", level: "N5", title: "い形容詞・な形容詞", meaning: "i- and na-adjectives", meaningIdn: "kata sifat -i dan -na",
    explanation: "i-adjectives end in い and connect directly (安い店). na-adjectives need な before a noun (元気な人).",
    explanationIdn: "Kata sifat -i berakhiran い dan langsung menempel (安い店). Kata sifat -na butuh な sebelum kata benda (元気な人).",
    examples: [
      { jp: "この店は安いです。", kana: "このみせはやすいです。", en: "This shop is cheap." },
      { jp: "元気な学生ですね。", kana: "げんきながくせいですね。", en: "What an energetic student." },
    ],
    exercises: [
      { kind: "fill", prompt: "Connect the na-adjective.", sentence: "静か___公園ですね。", options: ["な", "い", "の"], answer: "な", translation: "What a quiet park." },
      { kind: "order", prompt: "This bread is delicious.", tiles: ["この", "パン", "は", "おいしい", "です"], translation: "このパンはおいしいです。" },
    ],
  },

  // ═══ N4 ═══════════════════════════════════════════════════════════════
  {
    id: "g4-potential", level: "N4", title: "可能形 〜られる/〜える", meaning: "potential form (can do)", meaningIdn: "bentuk potensial (bisa)",
    explanation: "Ru-verbs: 食べる→食べられる. U-verbs: 書く→書ける. する→できる. The object often takes が: 日本語が話せます.",
    explanationIdn: "Kata kerja -ru: 食べる→食べられる. Kata kerja -u: 書く→書ける. する→できる. Objek sering memakai が: 日本語が話せます.",
    examples: [
      { jp: "漢字が読めますか。", kana: "かんじがよめますか。", en: "Can you read kanji?" },
      { jp: "私は日本語が少し話せます。", kana: "わたしはにほんごがすこしはなせます。", en: "I can speak a little Japanese." },
    ],
    exercises: [
      { kind: "fill", prompt: "Can you eat natto?", sentence: "納豆が___か。", options: ["食べられます", "食べます", "食べたいです"], answer: "食べられます", translation: "Can you eat natto?" },
      { kind: "order", prompt: "I can write code.", tiles: ["コード", "が", "書けます"], translation: "コードが書けます。" },
    ],
  },
  {
    id: "g4-volitional", level: "N4", title: "意向形 〜よう", meaning: "volitional (let's / shall we)", meaningIdn: "bentuk ajakan (ayo)",
    explanation: "The casual 'let's': 行こう (let's go), 食べよう (let's eat). Polite version is ましょう.",
    explanationIdn: "Bentuk ajakan santai: 行こう (ayo pergi), 食べよう (ayo makan). Versi sopannya adalah ましょう.",
    examples: [
      { jp: "一緒に帰ろう。", kana: "いっしょにかえろう。", en: "Let's go home together." },
      { jp: "そろそろ始めましょう。", kana: "そろそろはじめましょう。", en: "Let's begin soon." },
    ],
    exercises: [
      { kind: "fill", prompt: "Suggest going together.", sentence: "公園に___。", options: ["行こう", "行った", "行けば"], answer: "行こう", translation: "Let's go to the park." },
      { kind: "order", prompt: "Let's cook curry tonight.", tiles: ["今夜", "カレー", "を", "作ろう"], translation: "今夜カレーを作ろう。" },
    ],
  },
  {
    id: "g4-teiru", level: "N4", title: "〜ている", meaning: "ongoing state / continuous", meaningIdn: "sedang berlangsung / keadaan",
    explanation: "Te-form + いる: an action in progress (食べている = is eating) or a continuing state (結婚している = is married, 知っている = know).",
    explanationIdn: "Bentuk -te + いる: aksi yang sedang berlangsung (食べている = sedang makan) atau keadaan yang berlanjut (結婚している = sudah menikah, 知っている = tahu).",
    examples: [
      { jp: "今、レポートを書いています。", kana: "いま、レポートをかいています。", en: "I am writing a report now." },
      { jp: "田中さんを知っていますか。", kana: "たなかさんをしっていますか。", en: "Do you know Tanaka-san?" },
    ],
    exercises: [
      { kind: "fill", prompt: "Action in progress.", sentence: "山田さんは今、電話___います。", options: ["して", "する", "した"], answer: "して", translation: "Yamada-san is on the phone now." },
      { kind: "order", prompt: "It is raining.", tiles: ["雨", "が", "降って", "います"], translation: "雨が降っています。" },
    ],
  },
  {
    id: "g4-temoii", level: "N4", title: "〜てもいい・〜てはいけない", meaning: "permission and prohibition", meaningIdn: "izin dan larangan",
    explanation: "てもいい = it's okay to do. てはいけない = you must not. Essential for offices and trains!",
    explanationIdn: "てもいい = boleh melakukan. てはいけない = tidak boleh. Penting di kantor dan kereta!",
    examples: [
      { jp: "ここで写真を撮ってもいいですか。", kana: "ここでしゃしんをとってもいいですか。", en: "May I take photos here?" },
      { jp: "電車の中で電話してはいけません。", kana: "でんしゃのなかででんわしてはいけません。", en: "You must not talk on the phone in the train." },
    ],
    exercises: [
      { kind: "fill", prompt: "Ask permission to go home early.", sentence: "早く帰っ___いいですか。", options: ["ても", "ては", "たら"], answer: "ても", translation: "May I go home early?" },
      { kind: "fill", prompt: "Rule at the library.", sentence: "図書館で食べ___いけません。", options: ["ては", "ても", "たり"], answer: "ては", translation: "You must not eat in the library." },
    ],
  },
  {
    id: "g4-nakereba", level: "N4", title: "〜なければならない", meaning: "must / have to", meaningIdn: "harus / wajib",
    explanation: "Negative stem + なければならない: 行かなければならない (must go). Casual speech shortens it to なきゃ.",
    explanationIdn: "Bentuk negatif dasar + なければならない: 行かなければならない (harus pergi). Versi santainya disingkat jadi なきゃ.",
    examples: [
      { jp: "明日までに宿題を出さなければなりません。", kana: "あしたまでにしゅくだいをださなければなりません。", en: "I must hand in the homework by tomorrow." },
      { jp: "もう帰らなきゃ。", kana: "もうかえらなきゃ。", en: "I've gotta go home." },
    ],
    exercises: [
      { kind: "fill", prompt: "Obligation!", sentence: "毎日漢字を勉強し___なりません。", options: ["なければ", "ても", "ながら"], answer: "なければ", translation: "I must study kanji every day." },
      { kind: "order", prompt: "I must go to work.", tiles: ["仕事", "に", "行かなければ", "なりません"], translation: "仕事に行かなければなりません。" },
    ],
  },
  {
    id: "g4-hikaku", level: "N4", title: "〜より・〜のほうが", meaning: "comparisons", meaningIdn: "perbandingan",
    explanation: "AよりBのほうが〜 = B is more ~ than A. 電車のほうがバスより速いです.",
    explanationIdn: "AよりBのほうが〜 = B lebih ~ daripada A. 電車のほうがバスより速いです.",
    examples: [
      { jp: "急行のほうが普通より速いです。", kana: "きゅうこうのほうがふつうよりはやいです。", en: "The express is faster than the local." },
      { jp: "今日は昨日より寒いです。", kana: "きょうはきのうよりさむいです。", en: "Today is colder than yesterday." },
    ],
    exercises: [
      { kind: "order", prompt: "The supermarket is cheaper than the konbini.", tiles: ["スーパー", "のほうが", "コンビニ", "より", "安いです"], translation: "スーパーのほうがコンビニより安いです。" },
      { kind: "fill", prompt: "Compare!", sentence: "犬___猫のほうが好きです。", options: ["より", "ほど", "だけ"], answer: "より", translation: "I like cats more than dogs." },
    ],
  },
  {
    id: "g4-sou", level: "N4", title: "〜そうです", meaning: "looks like / I heard", meaningIdn: "kelihatannya / katanya",
    explanation: "Stem + そう = looks like (おいしそう = looks tasty). Plain form + そう = I heard (雨が降るそうです = I heard it will rain).",
    explanationIdn: "Bentuk dasar + そう = kelihatannya (おいしそう = kelihatan enak). Bentuk biasa + そう = katanya (雨が降るそうです = katanya besok hujan).",
    examples: [
      { jp: "このケーキはおいしそうですね。", kana: "このケーキはおいしそうですね。", en: "This cake looks delicious." },
      { jp: "明日は雨が降るそうです。", kana: "あしたはあめがふるそうです。", en: "I heard it will rain tomorrow." },
    ],
    exercises: [
      { kind: "fill", prompt: "It looks heavy.", sentence: "その荷物は重___ですね。", options: ["そう", "らしい", "みたい"], answer: "そう", translation: "That luggage looks heavy." },
      { kind: "fill", prompt: "You heard a rumor.", sentence: "山田さんは忙しい___です。", options: ["そう", "たい", "ほう"], answer: "そう", translation: "I hear Yamada-san is busy." },
    ],
  },
  {
    id: "g4-tara", level: "N4", title: "〜たら", meaning: "if / when", meaningIdn: "kalau / ketika",
    explanation: "Past form + ら: conditional. 安かったら買います (if it's cheap, I'll buy it). Also 'when': 家に帰ったら電話します.",
    explanationIdn: "Bentuk lampau + ら: pengandaian. 安かったら買います (kalau murah, saya beli). Juga berarti 'ketika': 家に帰ったら電話します.",
    examples: [
      { jp: "仕事が終わったら、買い物に行きます。", kana: "しごとがおわったら、かいものにいきます。", en: "When work is over, I'll go shopping." },
      { jp: "分からなかったら、聞いてください。", kana: "わからなかったら、きいてください。", en: "If you don't understand, please ask." },
    ],
    exercises: [
      { kind: "fill", prompt: "Conditional.", sentence: "駅に着い___、連絡してください。", options: ["たら", "ても", "ながら"], answer: "たら", translation: "When you arrive at the station, please contact me." },
      { kind: "order", prompt: "If it rains, I will study at home.", tiles: ["雨", "が", "降ったら", "家で", "勉強します"], translation: "雨が降ったら家で勉強します。" },
    ],
  },
  {
    id: "g4-nagara", level: "N4", title: "〜ながら", meaning: "while doing", meaningIdn: "sambil",
    explanation: "Verb stem + ながら = doing two things at once: 音楽を聞きながら勉強します.",
    explanationIdn: "Bentuk dasar kata kerja + ながら = melakukan dua hal sekaligus: 音楽を聞きながら勉強します (belajar sambil dengar musik).",
    examples: [
      { jp: "音楽を聞きながら走ります。", kana: "おんがくをききながらはしります。", en: "I run while listening to music." },
      { jp: "働きながら日本語を勉強しています。", kana: "はたらきながらにほんごをべんきょうしています。", en: "I'm studying Japanese while working." },
    ],
    exercises: [
      { kind: "order", prompt: "I watch TV while eating.", tiles: ["テレビ", "を", "見ながら", "食べます"], translation: "テレビを見ながら食べます。" },
      { kind: "fill", prompt: "Two things at once.", sentence: "コーヒーを飲み___、コードを書きます。", options: ["ながら", "たら", "そうで"], answer: "ながら", translation: "I write code while drinking coffee." },
    ],
  },
  {
    id: "g4-agekure", level: "N4", title: "あげる・くれる・もらう", meaning: "giving and receiving", meaningIdn: "memberi dan menerima",
    explanation: "あげる = I give to others. くれる = someone gives to me. もらう = I receive. The direction matters!",
    explanationIdn: "あげる = saya memberi ke orang lain. くれる = orang lain memberi ke saya. もらう = saya menerima. Arah pemberian sangat penting!",
    examples: [
      { jp: "先生が辞書をくれました。", kana: "せんせいがじしょをくれました。", en: "The teacher gave me a dictionary." },
      { jp: "友達にお土産をあげます。", kana: "ともだちにおみやげをあげます。", en: "I give my friend a souvenir." },
    ],
    exercises: [
      { kind: "fill", prompt: "Senpai gave YOU advice.", sentence: "先輩がアドバイスを___ました。", options: ["くれ", "あげ", "やり"], answer: "くれ", translation: "My senpai gave me advice." },
      { kind: "fill", prompt: "You received a gift.", sentence: "友達にプレゼントを___ました。", options: ["もらい", "あげ", "くれ"], answer: "もらい", translation: "I received a present from my friend." },
    ],
  },

  // ═══ N3 ═══════════════════════════════════════════════════════════════
  {
    id: "g3-passive", level: "N3", title: "受身形 〜られる", meaning: "passive voice", meaningIdn: "bentuk pasif",
    explanation: "食べられる (is eaten), 言われる (is told). Also used for the 'suffering passive': 雨に降られた (I got rained on).",
    explanationIdn: "食べられる (dimakan), 言われる (dikatakan). Juga dipakai untuk 'pasif merugikan': 雨に降られた (saya kehujanan).",
    examples: [
      { jp: "このアプリは多くの人に使われています。", kana: "このアプリはおおくのひとにつかわれています。", en: "This app is used by many people." },
      { jp: "部長に呼ばれました。", kana: "ぶちょうによばれました。", en: "I was called by the department manager." },
    ],
    exercises: [
      { kind: "fill", prompt: "The site is viewed by many users.", sentence: "このサイトは多くのユーザーに見___います。", options: ["られて", "させて", "たがって"], answer: "られて", translation: "This site is viewed by many users." },
      { kind: "order", prompt: "I was praised by my senpai.", tiles: ["先輩", "に", "褒められました"], translation: "先輩に褒められました。" },
    ],
  },
  {
    id: "g3-causative", level: "N3", title: "使役形 〜させる", meaning: "causative (make / let someone do)", meaningIdn: "kausatif (menyuruh / membiarkan)",
    explanation: "食べさせる = make/let someone eat. In offices you'll hear 確認させてください (please let me confirm).",
    explanationIdn: "食べさせる = menyuruh/membiarkan seseorang makan. Di kantor kamu akan dengar 確認させてください (tolong izinkan saya konfirmasi).",
    examples: [
      { jp: "少し考えさせてください。", kana: "すこしかんがえさせてください。", en: "Please let me think a little." },
      { jp: "先生は学生に漢字を書かせました。", kana: "せんせいはがくせいにかんじをかかせました。", en: "The teacher made the students write kanji." },
    ],
    exercises: [
      { kind: "fill", prompt: "Ask to be allowed to confirm.", sentence: "仕様を確認___ください。", options: ["させて", "されて", "らせて"], answer: "させて", translation: "Please let me confirm the specification." },
      { kind: "order", prompt: "Please let me introduce myself.", tiles: ["自己紹介", "を", "させて", "ください"], translation: "自己紹介をさせてください。" },
    ],
  },
  {
    id: "g3-causpass", level: "N3", title: "使役受身 〜させられる", meaning: "causative-passive (be made to do)", meaningIdn: "kausatif-pasif (dipaksa melakukan)",
    explanation: "The 'I was forced to' form: 残業させられた (I was made to work overtime). Expresses reluctance.",
    explanationIdn: "Bentuk 'saya dipaksa': 残業させられた (saya disuruh lembur). Mengekspresikan keterpaksaan.",
    examples: [
      { jp: "昨日、残業させられました。", kana: "きのう、ざんぎょうさせられました。", en: "Yesterday I was made to work overtime." },
      { jp: "子供の時、野菜を食べさせられました。", kana: "こどものとき、やさいをたべさせられました。", en: "As a child, I was made to eat vegetables." },
    ],
    exercises: [
      { kind: "fill", prompt: "You were forced to wait.", sentence: "1時間も待た___ました。", options: ["させられ", "させ", "られ"], answer: "させられ", translation: "I was made to wait a whole hour." },
    ],
  },
  {
    id: "g3-younaru", level: "N3", title: "〜ようになる", meaning: "come to be able / start doing", meaningIdn: "menjadi bisa / mulai terbiasa",
    explanation: "Describes a change over time: 日本語が話せるようになりました (I've become able to speak Japanese).",
    explanationIdn: "Menggambarkan perubahan seiring waktu: 日本語が話せるようになりました (saya sudah jadi bisa bicara bahasa Jepang).",
    examples: [
      { jp: "漢字が読めるようになりました。", kana: "かんじがよめるようになりました。", en: "I've become able to read kanji." },
      { jp: "毎日自炊するようになりました。", kana: "まいにちじすいするようになりました。", en: "I've started cooking for myself every day." },
    ],
    exercises: [
      { kind: "order", prompt: "I became able to write React components.", tiles: ["コンポーネント", "が", "書ける", "ように", "なりました"], translation: "コンポーネントが書けるようになりました。" },
      { kind: "fill", prompt: "Change over time.", sentence: "電車の放送が分かる___なりました。", options: ["ように", "ことに", "そうに"], answer: "ように", translation: "I've become able to understand train announcements." },
    ],
  },
  {
    id: "g3-kotonisuru", level: "N3", title: "〜ことにする・〜ことになる", meaning: "decide to / it was decided", meaningIdn: "memutuskan / diputuskan",
    explanation: "ことにする = my decision (毎日勉強することにした). ことになる = it was decided by circumstances (東京で働くことになりました).",
    explanationIdn: "ことにする = keputusan sendiri (毎日勉強することにした). ことになる = diputuskan oleh keadaan (東京で働くことになりました).",
    examples: [
      { jp: "来月から東京の会社で働くことになりました。", kana: "らいげつからとうきょうのかいしゃではたらくことになりました。", en: "It's been decided I'll work at a Tokyo company from next month." },
      { jp: "甘い物を食べないことにしました。", kana: "あまいものをたべないことにしました。", en: "I decided not to eat sweets." },
    ],
    exercises: [
      { kind: "fill", prompt: "Your own decision.", sentence: "毎朝走る___しました。", options: ["ことに", "ことが", "ように"], answer: "ことに", translation: "I decided to run every morning." },
      { kind: "fill", prompt: "Decided by others.", sentence: "新しいプロジェクトを担当する___なりました。", options: ["ことに", "ものに", "ばかりに"], answer: "ことに", translation: "It was decided that I'll be in charge of the new project." },
    ],
  },
  {
    id: "g3-keigo", level: "N3", title: "敬語の基本", meaning: "basic honorific & humble speech", meaningIdn: "dasar bahasa hormat",
    explanation: "尊敬語 raises others (いらっしゃる、おっしゃる). 謙譲語 lowers yourself (参る、申す、いたす). Crucial for the office!",
    explanationIdn: "尊敬語 meninggikan orang lain (いらっしゃる、おっしゃる). 謙譲語 merendahkan diri sendiri (参る、申す、いたす). Sangat penting di kantor!",
    examples: [
      { jp: "部長はもういらっしゃいますか。", kana: "ぶちょうはもういらっしゃいますか。", en: "Is the manager already here? (honorific)" },
      { jp: "明日、御社に伺います。", kana: "あした、おんしゃにうかがいます。", en: "I will visit your company tomorrow. (humble)" },
    ],
    exercises: [
      { kind: "fill", prompt: "Humble form of 行く.", sentence: "明日、そちらに___ます。", options: ["伺い", "いらっしゃい", "行かれ"], answer: "伺い", translation: "I will (humbly) visit you tomorrow." },
      { kind: "fill", prompt: "Honorific: the client says…", sentence: "お客様がそう___ました。", options: ["おっしゃい", "申し", "言われされ"], answer: "おっしゃい", translation: "The customer said so. (honorific)" },
    ],
  },
  {
    id: "g3-ba", level: "N3", title: "〜ば", meaning: "ba-conditional", meaningIdn: "pengandaian bentuk ~ba",
    explanation: "行けば、食べれば、安ければ… A neutral 'if': 練習すれば上手になります (if you practice, you'll improve).",
    explanationIdn: "行けば、食べれば、安ければ… Pengandaian netral: 練習すれば上手になります (kalau kamu latihan, kamu akan mahir).",
    examples: [
      { jp: "毎日練習すれば、上手になりますよ。", kana: "まいにちれんしゅうすれば、じょうずになりますよ。", en: "If you practice daily, you'll get good." },
      { jp: "分からなければ、先輩に聞けばいい。", kana: "わからなければ、せんぱいにきけばいい。", en: "If you don't understand, just ask your senpai." },
    ],
    exercises: [
      { kind: "fill", prompt: "If you read the docs…", sentence: "ドキュメントを読め___、分かります。", options: ["ば", "たら", "と"], answer: "ば", translation: "If you read the documentation, you'll understand." },
      { kind: "order", prompt: "If it's cheap, I'll buy two.", tiles: ["安ければ", "二つ", "買います"], translation: "安ければ二つ買います。" },
    ],
  },
  {
    id: "g3-hazu-beki", level: "N3", title: "〜はず・〜べき", meaning: "should (expectation / duty)", meaningIdn: "seharusnya (dugaan / kewajiban)",
    explanation: "はず = logical expectation (来るはずです = he should come). べき = moral duty (謝るべきだ = you ought to apologize).",
    explanationIdn: "はず = dugaan logis (来るはずです = seharusnya dia datang). べき = kewajiban moral (謝るべきだ = kamu harusnya minta maaf).",
    examples: [
      { jp: "会議は3時に終わるはずです。", kana: "かいぎはさんじにおわるはずです。", en: "The meeting should end at 3." },
      { jp: "早く報告するべきでした。", kana: "はやくほうこくするべきでした。", en: "I should have reported it sooner." },
    ],
    exercises: [
      { kind: "fill", prompt: "Logical expectation.", sentence: "荷物は今日届く___です。", options: ["はず", "べき", "ばかり"], answer: "はず", translation: "The package should arrive today." },
      { kind: "fill", prompt: "Duty!", sentence: "バグはすぐ直す___だ。", options: ["べき", "はず", "まま"], answer: "べき", translation: "Bugs ought to be fixed right away." },
    ],
  },
  {
    id: "g3-bakari", level: "N3", title: "〜ばかり", meaning: "just did / nothing but", meaningIdn: "baru saja / melulu",
    explanation: "たばかり = just did (来たばかり = just arrived). てばかり = doing nothing but (遊んでばかりいる).",
    explanationIdn: "たばかり = baru saja (来たばかり = baru datang). てばかり = kerjanya cuma (遊んでばかりいる = main terus kerjanya).",
    examples: [
      { jp: "日本に来たばかりです。", kana: "にほんにきたばかりです。", en: "I just came to Japan." },
      { jp: "弟はゲームをしてばかりいます。", kana: "おとうとはゲームをしてばかりいます。", en: "My little brother does nothing but play games." },
    ],
    exercises: [
      { kind: "fill", prompt: "You just started this job.", sentence: "この仕事を始めた___です。", options: ["ばかり", "ところが", "はず"], answer: "ばかり", translation: "I just started this job." },
    ],
  },
  {
    id: "g3-uchini", level: "N3", title: "〜うちに", meaning: "while / before it changes", meaningIdn: "selagi / sebelum berubah",
    explanation: "Do something while a state lasts: 熱いうちに食べてください (eat it while it's hot), 忘れないうちにメモする.",
    explanationIdn: "Lakukan sesuatu selagi keadaan masih berlangsung: 熱いうちに食べてください (makanlah selagi panas), 忘れないうちにメモする (catat sebelum lupa).",
    examples: [
      { jp: "温かいうちに食べてください。", kana: "あたたかいうちにたべてください。", en: "Please eat it while it's warm." },
      { jp: "忘れないうちにメモしておきます。", kana: "わすれないうちにメモしておきます。", en: "I'll jot it down before I forget." },
    ],
    exercises: [
      { kind: "order", prompt: "Let's practice while we're young.", tiles: ["若い", "うちに", "練習しましょう"], translation: "若いうちに練習しましょう。" },
      { kind: "fill", prompt: "Before it rains…", sentence: "雨が降らない___、帰りましょう。", options: ["うちに", "ながら", "ばかり"], answer: "うちに", translation: "Let's head home before it rains." },
    ],
  },
];

export const grammarByLevel = (level: string) => GRAMMAR.filter(g => g.level === level);
