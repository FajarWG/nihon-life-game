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
      {
        id: "tanaka-6", minFriendship: 6,
        lines: [
          { speaker: "tanaka", jp: "実は、私も昔エンジニアになりたかったんです。", kana: "じつは、わたしもむかしえんじにあになりたかったんです。", en: "Actually, I wanted to become an engineer too, once.", idn: "Sebenarnya, dulu aku juga ingin jadi engineer." },
          { speaker: "tanaka", jp: "でも、教えることのほうが好きで、この道を選びました。", kana: "でも、おしえることのほうがすきで、このみちをえらびました。", en: "But I loved teaching more, so I chose this path.", idn: "Tapi aku lebih suka mengajar, jadi aku pilih jalan ini." },
        ],
      },
      {
        id: "tanaka-8", minFriendship: 8,
        lines: [
          { speaker: "tanaka", jp: "メロンパンがなかったら、多分教師を辞めてたかもね。", kana: "めろんぱんがなかったら、たぶんきょうしをやめてたかもね。", en: "Without melon bread, I might've quit teaching, honestly.", idn: "Kalau tidak ada melonpan, mungkin aku sudah berhenti jadi guru, jujur." },
          { speaker: "tanaka", jp: "冗談ですよ！…半分だけ。", kana: "じょうだんですよ！…はんぶんだけ。", en: "Just kidding! …half kidding.", idn: "Bercanda kok! …setengah bercanda." },
        ],
      },
      {
        id: "tanaka-10", minFriendship: 10,
        lines: [
          { speaker: "tanaka", jp: "君は私の自慢の生徒です。これからもずっと。", kana: "きみはわたしのじまんのせいとです。これからもずっと。", en: "You're the student I'm most proud of. Now and always.", idn: "Kamu adalah murid yang paling kubanggakan. Sekarang dan seterusnya." },
          { speaker: "tanaka", jp: "日本での生活、これからも楽しんでくださいね。", kana: "にほんでのせいかつ、これからもたのしんでくださいね。", en: "Keep enjoying your life in Japan, okay?", idn: "Teruslah menikmati kehidupanmu di Jepang ya." },
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
      {
        id: "yuki-6", minFriendship: 6,
        lines: [
          { speaker: "yuki", jp: "韓国にいた時、友達とよく料理を教え合ったんだ。", kana: "かんこくにいたとき、ともだちとよくりょうりをおしえあったんだ。", en: "Back in Korea, my friends and I used to teach each other recipes.", idn: "Waktu di Korea, aku dan teman-teman sering saling mengajari resep masakan." },
          { speaker: "yuki", jp: "いつか自分のカフェで、その味を出したいな。", kana: "いつかじぶんのかふぇで、そのあじをだしたいな。", en: "Someday I want to serve those flavors in my own cafe.", idn: "Suatu hari nanti aku ingin menyajikan rasa itu di kafenya sendiri." },
        ],
      },
      {
        id: "yuki-8", minFriendship: 8,
        lines: [
          { speaker: "yuki", jp: "ねえ、大阪オープンしたら、最初の客は君ね。", kana: "ねえ、おおさかおーぷんしたら、さいしょのきゃくはきみね。", en: "Hey, when I open in Osaka, you'll be my first customer.", idn: "Eh, kalau sudah buka di Osaka, kamu jadi pelanggan pertamaku ya." },
          { speaker: "yuki", jp: "お金はちゃんと取るから安心して！", kana: "おかねはちゃんととるからあんしんして！", en: "Don't worry, I'll definitely charge you!", idn: "Tenang saja, aku akan tagih kok!" },
        ],
      },
      {
        id: "yuki-10", minFriendship: 10,
        lines: [
          { speaker: "yuki", jp: "本当に、君に会えてよかった。日本の生活、ずっと楽しかったよ。", kana: "ほんとうに、きみにあえてよかった。にほんのせいかつ、ずっとたのしかったよ。", en: "I'm really glad I met you. Life in Japan has been so much fun.", idn: "Sungguh, aku senang bertemu denganmu. Hidup di Jepang jadi sangat menyenangkan." },
          { speaker: "yuki", jp: "これからも、よろしくね。親友。", kana: "これからも、よろしくね。しんゆう。", en: "From here on too, take care of me. Best friend.", idn: "Mulai sekarang juga, tolong jaga aku ya. Sahabat." },
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
      {
        id: "yamada-6", minFriendship: 6,
        lines: [
          { speaker: "yamada", jp: "実は僕もね、最初は全然コードが書けなかったんだ。", kana: "じつはぼくもね、さいしょはぜんぜんこーどがかけなかったんだ。", en: "Honestly, I couldn't code at all when I started either.", idn: "Sebenarnya aku juga, awalnya tidak bisa coding sama sekali." },
          { speaker: "yamada", jp: "毎日ちょっとずつやれば、誰でも上手くなるよ。", kana: "まいにちちょっとずつやれば、だれでもうまくなるよ。", en: "Do a little every day, and anyone can get good.", idn: "Kerjakan sedikit setiap hari, siapa pun bisa jadi mahir." },
        ],
      },
      {
        id: "yamada-8", minFriendship: 8,
        lines: [
          { speaker: "yamada", jp: "デプロイ金曜日って…誰が決めたんだろうね？", kana: "でぷろいきんようびって…だれがきめたんだろうね？", en: "Deploy on Friday… who even decided that?", idn: "Deploy hari Jumat… siapa sih yang memutuskan itu?" },
          { speaker: "yamada", jp: "まあ、君となら残業も悪くないけどね。", kana: "まあ、きみとならざんぎょうもわるくないけどね。", en: "Well, overtime's not so bad when it's with you.", idn: "Yah, lembur juga tidak buruk kalau sama kamu sih." },
        ],
      },
      {
        id: "yamada-10", minFriendship: 10,
        lines: [
          { speaker: "yamada", jp: "君のおかげで、チーム全体が強くなったと思う。", kana: "きみのおかげで、ちーむぜんたいがつよくなったとおもう。", en: "Thanks to you, I think the whole team has gotten stronger.", idn: "Berkat kamu, aku rasa seluruh tim jadi lebih kuat." },
          { speaker: "yamada", jp: "これからも一緒に、いいプロダクトを作っていこう。", kana: "これからもいっしょに、いいぷろだくとをつくっていこう。", en: "Let's keep building great products together from here on.", idn: "Mulai sekarang, mari terus bangun produk hebat bersama." },
        ],
      },
    ],
  },
  {
    id: "sato", name: "Sato-san", nameJp: "佐藤さん", age: 45, occupation: "Konbini clerk",
    sprite: "npc-sato", bio: "Has worked at the konbini for 20 years. Knows everyone in town.",
    favoriteItems: ["greentea"],
    questId: "side-sato-1",
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
      {
        id: "sato-3", minFriendship: 3,
        lines: [
          { speaker: "sato", jp: "いつも来てくれてありがとうね。常連さん。", kana: "いつもきてくれてありがとうね。じょうれんさん。", en: "Thanks for always stopping by. You're a regular now.", idn: "Terima kasih selalu mampir. Kamu sudah jadi pelanggan tetap." },
          { speaker: "sato", jp: "田中先生もね、毎朝ここでメロンパンを買うんだよ。", kana: "たなかせんせいもね、まいあさここでめろんぱんをかうんだよ。", en: "Tanaka-sensei too, he buys melon bread here every morning.", idn: "Tanaka-sensei juga, setiap pagi beli melonpan di sini lho." },
        ],
      },
      {
        id: "sato-6", minFriendship: 6,
        lines: [
          { speaker: "sato", jp: "２０年もここで働いてるとね、町の人の人生が見えるんだ。", kana: "にじゅうねんもここではたらいてるとね、まちのひとのじんせいがみえるんだ。", en: "When you work here 20 years, you start seeing people's lives unfold.", idn: "Kalau sudah 20 tahun kerja di sini, kamu bisa melihat kehidupan orang-orang di kota ini." },
          { speaker: "sato", jp: "君もその一人だよ。来たばかりの頃、すごく緊張してたね。", kana: "きみもそのひとりだよ。きたばかりのころ、すごくきんちょうしてたね。", en: "You're one of those people. When you first arrived, you looked so nervous.", idn: "Kamu juga salah satunya. Waktu pertama datang, kamu kelihatan sangat gugup." },
        ],
      },
      {
        id: "sato-8", minFriendship: 8,
        lines: [
          { speaker: "sato", jp: "今日のおすすめは…あ、君にはいつものやつでいいよね？", kana: "きょうのおすすめは…あ、きみにはいつものやつでいいよね？", en: "Today's recommendation is… oh, you just want the usual, right?", idn: "Rekomendasi hari ini… oh, kamu mau yang biasa saja kan?" },
          { speaker: "sato", jp: "もう覚えちゃったよ。お茶とおにぎりだろ？", kana: "もうおぼえちゃったよ。おちゃとおにぎりだろ？", en: "I've already memorized it. Tea and onigiri, right?", idn: "Aku sudah hafal. Teh dan onigiri kan?" },
        ],
      },
      {
        id: "sato-10", minFriendship: 10,
        lines: [
          { speaker: "sato", jp: "君がこの町に来てくれて、本当によかった。", kana: "きみがこのまちにきてくれて、ほんとうによかった。", en: "I'm really glad you came to this town.", idn: "Aku sungguh senang kamu datang ke kota ini." },
          { speaker: "sato", jp: "コンビニのカウンターから見てるよ。君の物語をね。", kana: "こんびにのかうんたーからみてるよ。きみのものがたりをね。", en: "I'll be watching from behind this counter. Your story, that is.", idn: "Aku akan terus melihat dari balik konter ini. Kisah perjalananmu." },
        ],
      },
    ],
  },
  {
    id: "hana", name: "Hana", nameJp: "花", age: 26, occupation: "Librarian",
    sprite: "npc-hana", bio: "Runs the town library. Quiet, loves books, secretly writes novels after closing.",
    favoriteItems: ["jlptbook", "omamori"],
    questId: "side-hana-1",
    schedule: [
      { from: 9, to: 18, location: "library", x: 4, y: 4 },
    ],
    dialogues: [
      {
        id: "hana-0", minFriendship: 0,
        lines: [
          { speaker: "hana", jp: "静かにしてくださいね…あ、いらっしゃい。", kana: "しずかにしてくださいね…あ、いらっしゃい。", en: "Please keep it quiet... oh, welcome.", idn: "Tolong tenang ya... oh, selamat datang." },
          { speaker: "hana", jp: "何かおすすめの本、探しましょうか。", kana: "なにかおすすめのほん、さがしましょうか。", en: "Shall I help you find a recommended book?", idn: "Mau kubantu cari buku rekomendasi?" },
        ],
      },
      {
        id: "hana-3", minFriendship: 3,
        lines: [
          { speaker: "hana", jp: "最近、よく図書館に来てくれますね。", kana: "さいきん、よくとしょかんにきてくれますね。", en: "You've been coming to the library a lot lately.", idn: "Akhir-akhir ini kamu sering ke perpustakaan ya." },
          { speaker: "hana", jp: "本が好きな人、嫌いじゃないですよ。", kana: "ほんがすきなひと、きらいじゃないですよ。", en: "I don't dislike people who love books, you know.", idn: "Aku tidak benci orang yang suka buku, lho." },
        ],
      },
      {
        id: "hana-6", minFriendship: 6,
        lines: [
          { speaker: "hana", jp: "実は、昔ここで働く前は、小説家になりたかったんです。", kana: "じつは、むかしここではたらくまえは、しょうせつかになりたかったんです。", en: "Actually, before I worked here, I wanted to become a novelist.", idn: "Sebenarnya, sebelum bekerja di sini, aku ingin jadi novelis." },
          { speaker: "hana", jp: "今も、閉館後にこっそり書いてるんですよ。", kana: "いまも、へいかんごにこっそりかいてるんですよ。", en: "Even now, I secretly write after closing time.", idn: "Sampai sekarang, aku diam-diam menulis setelah tutup." },
        ],
      },
      {
        id: "hana-8", minFriendship: 8,
        lines: [
          { speaker: "hana", jp: "君の漢字、本当に読めるようになりましたね。", kana: "きみのかんじ、ほんとうによめるようになりましたね。", en: "You've really become able to read kanji, haven't you.", idn: "Kanji-mu benar-benar sudah bisa dibaca ya." },
          { speaker: "hana", jp: "いつか、私の小説も読んでくれますか。", kana: "いつか、わたしのしょうせつもよんでくれますか。", en: "Will you read my novel someday, too?", idn: "Suatu hari, maukah kamu baca novelku juga?" },
        ],
      },
      {
        id: "hana-10", minFriendship: 10,
        lines: [
          { speaker: "hana", jp: "君が来るこの図書館の時間、実は一番好きな時間なんです。", kana: "きみがくるこのとしょかんのじかん、じつはいちばんすきなじかんなんです。", en: "The time you spend here at the library is actually my favorite time.", idn: "Waktu kamu datang ke perpustakaan ini sebenarnya waktu favoritku." },
          { speaker: "hana", jp: "これからも、静かな場所で待ってますね。", kana: "これからも、しずかなばしょでまってますね。", en: "I'll keep waiting for you here in this quiet place.", idn: "Aku akan terus menunggumu di tempat yang tenang ini." },
        ],
      },
    ],
  },
  {
    id: "suzuki", name: "Suzuki-san", nameJp: "鈴木さん", age: 58, occupation: "Apartment landlady",
    sprite: "npc-suzuki", bio: "Manages the apartment building. Warm but keeps a close eye on the rent.",
    favoriteItems: ["flowers", "greentea"],
    questId: "side-suzuki-1",
    schedule: [
      { from: 7, to: 20, location: "town", x: 5, y: 5 },
    ],
    dialogues: [
      {
        id: "suzuki-0", minFriendship: 0,
        lines: [
          { speaker: "suzuki", jp: "あら、おはよう。今日も元気そうね。", kana: "あら、おはよう。きょうもげんきそうね。", en: "Oh, good morning. You look lively today too.", idn: "Oh, selamat pagi. Hari ini juga kamu kelihatan bersemangat." },
          { speaker: "suzuki", jp: "何か困ったことがあったら、いつでも言ってね。", kana: "なにかこまったことがあったら、いつでもいってね。", en: "If anything troubles you, tell me anytime.", idn: "Kalau ada masalah, bilang saja kapan pun." },
        ],
      },
      {
        id: "suzuki-3", minFriendship: 3,
        lines: [
          { speaker: "suzuki", jp: "この町に来たばかりの頃を思い出すわ。", kana: "このまちにきたばかりのころをおもいだすわ。", en: "It reminds me of when you'd just arrived in this town.", idn: "Ini mengingatkanku waktu kamu baru datang ke kota ini." },
          { speaker: "suzuki", jp: "家賃、いつもちゃんと払ってくれてありがとうね。", kana: "やちん、いつもちゃんとはらってくれてありがとうね。", en: "Thank you for always paying your rent properly.", idn: "Terima kasih selalu bayar sewa tepat waktu." },
        ],
      },
      {
        id: "suzuki-6", minFriendship: 6,
        lines: [
          { speaker: "suzuki", jp: "実はね、このアパート、もう三十年も管理してるのよ。", kana: "じつはね、このあぱーと、もうさんじゅうねんもかんりしてるのよ。", en: "Actually, I've been managing this apartment for 30 years now.", idn: "Sebenarnya, aku sudah mengurus apartemen ini selama 30 tahun." },
          { speaker: "suzuki", jp: "いろんな人が住んで、出て行ったけど、君のことはよく覚えておくわね。", kana: "いろんなひとがすんで、でていったけど、きみのことはよくおぼえておくわね。", en: "Many people have lived here and moved on, but I'll remember you well.", idn: "Banyak orang sudah tinggal dan pergi, tapi aku akan selalu ingat kamu." },
        ],
      },
      {
        id: "suzuki-8", minFriendship: 8,
        lines: [
          { speaker: "suzuki", jp: "最近、部屋から勉強する声が聞こえてくるのよ。", kana: "さいきん、へやからべんきょうするこえがきこえてくるのよ。", en: "Lately, I can hear the sound of you studying from your room.", idn: "Akhir-akhir ini, aku dengar suara kamu belajar dari kamarmu." },
          { speaker: "suzuki", jp: "頑張ってるのね。応援してるわよ。", kana: "がんばってるのね。おうえんしてるわよ。", en: "You're working hard, aren't you. I'm rooting for you.", idn: "Kamu sedang berusaha keras ya. Aku mendukungmu." },
        ],
      },
      {
        id: "suzuki-10", minFriendship: 10,
        lines: [
          { speaker: "suzuki", jp: "君みたいな店子は、なかなかいないわよ。", kana: "きみみたいなたなこは、なかなかいないわよ。", en: "Tenants like you are hard to come by.", idn: "Penyewa seperti kamu itu jarang ada lho." },
          { speaker: "suzuki", jp: "このアパートを、これからも大事にしてね。", kana: "このあぱーとを、これからもだいじにしてね。", en: "Please keep taking good care of this apartment.", idn: "Tolong terus jaga apartemen ini baik-baik ya." },
        ],
      },
    ],
  },
];

export const NPC_MAP: Record<string, NpcDef> = Object.fromEntries(NPCS.map(n => [n.id, n]));

