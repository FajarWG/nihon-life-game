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
];
