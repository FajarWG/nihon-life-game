import type { NpcDef } from "@/core/types";

/** Sample NPCs — extend by following NpcDef. Schedules use 24h hours and tile coords in the target map. */
export const NPCS: NpcDef[] = [
  {
    id: "tanaka", name: "Tanaka-sensei", nameJp: "田中先生", age: 38, occupation: "Japanese teacher",
    sprite: "npc-tanaka", bio: "Warm but strict teacher at the language school. Loves melon bread.",
    favoriteItems: ["melonpan", "greentea"],
    schedule: [
      { from: 8, to: 17, location: "school", x: 7, y: 2 },
      { from: 17, to: 20, location: "town", x: 5, y: 17 },
    ],
    dialogues: [
      {
        id: "tanaka-0", minFriendship: 0,
        lines: [
          { speaker: "tanaka", jp: "おはようございます。今日も頑張りましょう。", kana: "おはようございます。きょうもがんばりましょう。", en: "Good morning. Let's do our best today too.", idn: "Selamat pagi. Hari ini juga mari semangat." },
          { speaker: "tanaka", jp: "毎日少しずつ勉強してくださいね。", kana: "まいにちすこしずつべんきょうしてくださいね。", en: "Please study a little bit every day.", idn: "Belajarlah sedikit demi sedikit setiap hari ya." },
        ],
      },
      {
        id: "tanaka-3", minFriendship: 3,
        lines: [
          { speaker: "tanaka", jp: "最近、日本語が上手になりましたね。", kana: "さいきん、にほんごがじょうずになりましたね。", en: "Your Japanese has gotten really good lately.", idn: "Akhir-akhir ini bahasa Jepangmu makin bagus ya." },
          { speaker: "tanaka", jp: "エンジニアの夢、応援していますよ。", kana: "えんじにあのゆめ、おうえんしていますよ。", en: "I'm rooting for your engineer dream.", idn: "Aku mendukung cita-citamu jadi engineer lho." },
        ],
      },
    ],
  },
  {
    id: "yuki", name: "Yuki", nameJp: "ゆき", age: 21, occupation: "Classmate (from Korea)",
    sprite: "npc-yuki", bio: "Your cheerful classmate. Dreams of opening a cafe in Osaka.",
    favoriteItems: ["pocky", "flowers"],
    questId: "side-yuki-1",
    schedule: [
      { from: 8, to: 13, location: "school", x: 4, y: 6 },
      { from: 13, to: 18, location: "town", x: 33, y: 20 },
    ],
    dialogues: [
      {
        id: "yuki-0", minFriendship: 0,
        lines: [
          { speaker: "yuki", jp: "あ、おはよう！宿題やった？", kana: "あ、おはよう！しゅくだいやった？", en: "Oh, morning! Did you do the homework?", idn: "Oh, pagi! Sudah kerjakan PR?" },
          { speaker: "yuki", jp: "私はまだ…一緒にやらない？", kana: "わたしはまだ…いっしょにやらない？", en: "I haven't yet... wanna do it together?", idn: "Aku belum… mau kerjakan bareng?" },
        ],
      },
      {
        id: "yuki-3", minFriendship: 3,
        lines: [
          { speaker: "yuki", jp: "ねえ、週末に公園でお花見しない？", kana: "ねえ、しゅうまつにこうえんでおはなみしない？", en: "Hey, wanna do hanami in the park this weekend?", idn: "Eh, akhir pekan mau hanami di taman nggak?" },
          { speaker: "yuki", jp: "おにぎり作ってきてよ！", kana: "おにぎりつくってきてよ！", en: "Make some onigiri and bring them!", idn: "Buatkan onigiri dan bawa ya!" },
        ],
      },
    ],
  },
  {
    id: "yamada", name: "Yamada-san", nameJp: "山田さん", age: 29, occupation: "Senior frontend engineer",
    sprite: "npc-yamada", bio: "Your mentor at the IT company. Reviews your code kindly but thoroughly.",
    favoriteItems: ["coffee", "techbook"],
    schedule: [
      { from: 10, to: 19, location: "company", x: 10, y: 5 },
    ],
    dialogues: [
      {
        id: "yamada-0", minFriendship: 0,
        lines: [
          { speaker: "yamada", jp: "お疲れ様です。今日のタスク、確認しましたか。", kana: "おつかれさまです。きょうのたすく、かくにんしましたか。", en: "Good work. Did you check today's tasks?", idn: "Terima kasih kerja kerasnya. Sudah cek tugas hari ini?" },
          { speaker: "yamada", jp: "分からなかったら、いつでも聞いてください。", kana: "わからなかったら、いつでもきいてください。", en: "If you don't understand, ask me anytime.", idn: "Kalau ada yang tidak paham, tanya saja kapan pun." },
        ],
      },
      {
        id: "yamada-3", minFriendship: 3,
        lines: [
          { speaker: "yamada", jp: "君のコード、きれいになってきたね。", kana: "きみのこーど、きれいになってきたね。", en: "Your code is getting cleaner.", idn: "Kode-mu makin rapi ya." },
          { speaker: "yamada", jp: "この調子なら、正社員も夢じゃないよ。", kana: "このちょうしなら、せいしゃいんもゆめじゃないよ。", en: "At this rate, a full-time position isn't just a dream.", idn: "Kalau begini terus, jadi karyawan tetap bukan cuma mimpi." },
        ],
      },
    ],
  },
  {
    id: "sato", name: "Sato-san", nameJp: "佐藤さん", age: 45, occupation: "Konbini clerk",
    sprite: "npc-sato", bio: "Has worked at the konbini for 20 years. Knows everyone in town.",
    favoriteItems: ["greentea"],
    schedule: [
      { from: 7, to: 22, location: "konbini", x: 6, y: 3 },
    ],
    dialogues: [
      {
        id: "sato-0", minFriendship: 0,
        lines: [
          { speaker: "sato", jp: "いらっしゃいませ！", kana: "いらっしゃいませ！", en: "Welcome!", idn: "Selamat datang!" },
          { speaker: "sato", jp: "新しいおにぎり、入りましたよ。", kana: "あたらしいおにぎり、はいりましたよ。", en: "We got new onigiri in stock.", idn: "Onigiri baru sudah masuk lho." },
        ],
      },
    ],
  },
];

export const NPC_MAP: Record<string, NpcDef> = Object.fromEntries(NPCS.map(n => [n.id, n]));
