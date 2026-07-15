import type { ReadingPassage, ListeningDrill } from "@/core/types";

/** Sample reading passages — used in school lessons. */
export const READINGS: ReadingPassage[] = [
  {
    id: "read-n5-1", level: "N5", title: "私の一日",
    text: [
      { jp: "私は毎朝七時に起きます。", kana: "わたしはまいあさしちじにおきます。", en: "I wake up at 7 every morning.", idn: "Aku bangun jam 7 setiap pagi." },
      { jp: "朝ご飯を食べて、学校に行きます。", kana: "あさごはんをたべて、がっこうにいきます。", en: "I eat breakfast and go to school.", idn: "Aku sarapan lalu berangkat sekolah." },
      { jp: "午後はコンビニで買い物をします。", kana: "ごごはこんびにでかいものをします。", en: "In the afternoon I shop at the konbini.", idn: "Sore harinya aku belanja di konbini." },
    ],
    question: "What does the writer do in the afternoon?",
    options: ["Shops at the konbini", "Goes to school", "Eats breakfast"],
    answer: "Shops at the konbini",
  },
  {
    id: "read-n4-1", level: "N4", title: "アルバイトの初日",
    text: [
      { jp: "今日からIT会社でアルバイトを始めました。", kana: "きょうからITがいしゃであるばいとをはじめました。", en: "Starting today, I began a part-time job at an IT company.", idn: "Mulai hari ini aku kerja paruh waktu di perusahaan IT." },
      { jp: "先輩はとても親切で、分からないことを教えてくれました。", kana: "せんぱいはとてもしんせつで、わからないことをおしえてくれました。", en: "My senpai was very kind and taught me the things I didn't understand.", idn: "Senior-ku sangat baik dan mengajari hal yang tidak kupahami." },
      { jp: "早く仕事を覚えたいです。", kana: "はやくしごとをおぼえたいです。", en: "I want to learn the job quickly.", idn: "Aku ingin cepat menguasai pekerjaannya." },
    ],
    question: "How was the senpai?",
    options: ["Kind and helpful", "Busy and strict", "Absent today"],
    answer: "Kind and helpful",
  },
  {
    id: "read-n3-1", level: "N3", title: "友達の引っ越し",
    text: [
      { jp: "先週、親友が大阪に引っ越しました。", kana: "せんしゅう、しんゆうがおおさかにひっこしました。", en: "Last week my best friend moved to Osaka.", idn: "Minggu lalu sahabatku pindah ke Osaka." },
      { jp: "引っ越しの準備を手伝いましたが、とても疲れました。", kana: "ひっこしのじゅんびをてつだいましたが、とてもつかれました。", en: "I helped with the moving preparations, but I got very tired.", idn: "Aku membantu persiapan pindahannya, tapi aku sangat lelah." },
      { jp: "遠くに住んでいても、関係は変わらないと思います。", kana: "とおくにすんでいても、かんけいはかわらないとおもいます。", en: "Even though we live far apart, I think our relationship won't change.", idn: "Meskipun tinggal berjauhan, kurasa hubungan kami tidak akan berubah." },
    ],
    question: "What did the writer help with?",
    options: ["Moving preparations", "Job interview", "Office report"],
    answer: "Moving preparations",
  },
  {
    id: "read-n3-2", level: "N3", title: "夕立と停電",
    text: [
      { jp: "昨日の夕方、急に空が暗くなって、強い夕立が降りました。", kana: "きのうのゆうがた、きゅうにそらがくらくなって、つよいゆうだちがふりました。", en: "Yesterday evening the sky suddenly darkened and a strong evening shower came.", idn: "Kemarin sore tiba-tiba langit jadi gelap dan hujan deras turun." },
      { jp: "その後、原因は分かりませんが、停電になってしまいました。", kana: "そのご、げんいんはわかりませんが、ていでんになってしまいました。", en: "After that, though I don't know the cause, the power went out.", idn: "Setelah itu, entah apa penyebabnya, listriknya mati." },
      { jp: "ろうそくの明かりで晩ご飯を食べるのは、少し面白い経験でした。", kana: "ろうそくのあかりでばんごはんをたべるのは、すこしおもしろいけいけんでした。", en: "Eating dinner by candlelight was a somewhat interesting experience.", idn: "Makan malam dengan cahaya lilin adalah pengalaman yang sedikit menyenangkan." },
    ],
    question: "What happened after the rain?",
    options: ["The power went out", "The train stopped", "The phone rang"],
    answer: "The power went out",
  },
  {
    id: "read-n3-3", level: "N3", title: "締め切りの朝",
    text: [
      { jp: "今週の金曜日が新しい機能の開発の締め切りです。", kana: "こんしゅうのきんようびがあたらしいきのうのかいはつのしめきりです。", en: "This Friday is the deadline for the new feature development.", idn: "Jumat minggu ini adalah tenggat pengembangan fitur baru." },
      { jp: "昨日、先輩に仕様の確認をしてもらいました。", kana: "きのう、せんぱいにしようのかくにんをしてもらいました。", en: "Yesterday I had my senpai confirm the specification.", idn: "Kemarin aku minta seniorku mengecek spesifikasinya." },
      { jp: "あと少し修正すれば、準備ができました。", kana: "あとすこししゅうせいすれば、じゅんびができました。", en: "After a few more fixes, the preparation is done.", idn: "Tinggal sedikit perbaikan lagi, persiapannya sudah siap." },
    ],
    question: "What is this Friday?",
    options: ["The development deadline", "A job interview", "The moving day"],
    answer: "The development deadline",
  },
  {
    id: "read-n3-4", level: "N3", title: "面接の結果",
    text: [
      { jp: "先月受けた会社の面接の結果が、今日届きました。", kana: "せんげつうけたかいしゃのめんせつのけっかが、きょうとどきました。", en: "The result of the company interview I took last month arrived today.", idn: "Hasil wawancara perusahaan yang kuikuti bulan lalu tiba hari ini." },
      { jp: "毎日努力して準備したので、いい結果だといいなと思います。", kana: "まいにちどりょくしてじゅんびしたので、いいけっかだといいなとおもいます。", en: "Since I prepared with daily effort, I hope it's a good result.", idn: "Karena sudah berusaha dan menyiapkan setiap hari, semoga hasilnya bagus." },
      { jp: "先輩が「いい経験だから、心配しなくていい」と言ってくれました。", kana: "せんぱいが「いいけいけんだから、しんぱいしなくていい」といってくれました。", en: "My senpai said, 'It's good experience, so don't worry.'", idn: "Seniorku bilang, 'ini pengalaman bagus, jadi nggak perlu khawatir.'" },
    ],
    question: "What arrived today?",
    options: ["Interview results", "A bug report", "A train schedule"],
    answer: "Interview results",
  },
  {
    id: "read-n3-5", level: "N3", title: "買い物の失敗",
    text: [
      { jp: "日曜日にスーパーで買い物をしました。", kana: "にちようびにすーぱーでかいものをしました。", en: "On Sunday I went shopping at the supermarket.", idn: "Hari Minggu aku belanja di supermarket." },
      { jp: "牛乳の賞味期限を確認するのを忘れて、期限切れを買ってしまいました。", kana: "ぎゅうにゅうのしょうみきげんをかくにんするのをわすれて、きげんぎれをかってしまいました。", en: "I forgot to check the milk's best-before date and bought an expired one.", idn: "Aku lupa mengecek tanggal kedaluwarsa susunya dan malah beli yang sudah lewat." },
      { jp: "次からは、買う前に必ず確認しようと思います。", kana: "つぎからは、かうまえにかならずかくにんしようとおもいます。", en: "Next time I'll definitely check before buying.", idn: "Lain kali aku pasti akan cek dulu sebelum beli." },
    ],
    question: "What mistake did the writer make?",
    options: ["Bought expired milk", "Lost the receipt", "Forgot to buy eggs"],
    answer: "Bought expired milk",
  },
];

/** Sample listening drills — audioJp is spoken with ja-JP speech synthesis. */
export const LISTENINGS: ListeningDrill[] = [
  {
    id: "lis-n5-1", level: "N5",
    audioJp: "つぎは、さくらまち、さくらまちです。",
    question: "What is the next station?",
    options: ["Sakuramachi", "Gakuen-mae", "Chūō"],
    answer: "Sakuramachi",
  },
  {
    id: "lis-n4-1", level: "N4",
    audioJp: "きゅうこうでんしゃは、にばんせんから、しゅっぱつします。",
    question: "Which platform does the express leave from?",
    options: ["Platform 2", "Platform 1", "Platform 4"],
    answer: "Platform 2",
  },
  {
    id: "lis-n3-1", level: "N3",
    audioJp: "ゆうだちで、でんしゃがおくれています。うんてんをみあわせています。",
    question: "What is happening with the train?",
    options: ["Service is suspended", "It arrived early", "Fare adjustment needed"],
    answer: "Service is suspended",
  },
  {
    id: "lis-n3-2", level: "N3",
    audioJp: "あさのえきは、とてもこんざつしています。でんしゃもおくれるかもしれません。",
    question: "What is the situation at the station?",
    options: ["It is crowded", "It is empty", "It is closed"],
    answer: "It is crowded",
  },
  {
    id: "lis-n3-3", level: "N3",
    audioJp: "かいぎのほうこくをかくにんしました。しゅうせいは、せんぱいにそうだんしてください。",
    question: "What should you do with the report?",
    options: ["Consult your senpai", "Delete it", "Send it immediately"],
    answer: "Consult your senpai",
  },
  {
    id: "lis-n3-4", level: "N3",
    audioJp: "りょうしゅうしょを、ほぞんしてください。けいやくのかくにんにつかいます。",
    question: "Why should receipts be saved?",
    options: ["To confirm the contract", "To calculate salary", "To fix a bug"],
    answer: "To confirm the contract",
  },
  {
    id: "lis-n3-5", level: "N3",
    audioJp: "ひっこしのてつづきがおわりました。なにかしんぱいなことがあれば、そうだんしてください。",
    question: "What has been completed?",
    options: ["Moving paperwork", "A job interview", "A bug fix"],
    answer: "Moving paperwork",
  },
];
