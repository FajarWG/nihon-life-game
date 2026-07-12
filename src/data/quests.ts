import type { QuestDef } from "@/core/types";

/** Sample quests — extend by following QuestDef. Main quests chain via `next`. */
export const QUESTS: QuestDef[] = [
  {
    id: "main-1", type: "main", title: "A New Life Begins", titleJp: "新しい生活",
    desc: "Settle into Sakura Town: study once at your desk and attend your first class.",
    descIdn: "Beradaptasi di Kota Sakura: belajar sekali di mejamu dan ikuti kelas pertamamu.",
    objectives: [
      { id: "study", desc: "Study grammar at your desk", event: "activity", target: "study", count: 1 },
      { id: "school", desc: "Attend a lesson at school", event: "activity", target: "school", count: 1 },
    ],
    reward: { money: 500, xp: { grammar: 10 } },
    next: "main-2",
  },
  {
    id: "main-2", type: "main", title: "First Errands", titleJp: "初めてのおつかい",
    desc: "Buy ingredients at a shop and cook your first meal at home.",
    descIdn: "Beli bahan di toko dan masak makanan pertamamu di rumah.",
    objectives: [
      { id: "shop", desc: "Buy something at a shop", event: "activity", target: "shopping", count: 1 },
      { id: "cook", desc: "Cook a meal in your kitchen", event: "activity", target: "cooking", count: 1 },
    ],
    reward: { money: 500, xp: { vocabulary: 10 } },
    next: "main-3",
  },
  {
    id: "main-3", type: "main", title: "The Interview", titleJp: "面接",
    desc: "Take the train to the IT company and complete your first work shift.",
    descIdn: "Naik kereta ke perusahaan IT dan selesaikan shift kerja pertamamu.",
    objectives: [
      { id: "train", desc: "Ride the train", event: "activity", target: "train", count: 1 },
      { id: "work", desc: "Complete a shift at the IT company", event: "activity", target: "work", count: 1 },
    ],
    reward: { money: 1000, xp: { reading: 10, kanji: 5 } },
  },
  {
    id: "side-yuki-1", type: "relationship", title: "Hanami Promise", titleJp: "花見の約束",
    desc: "Yuki wants handmade onigiri for hanami. Cook onigiri and bring it to her.",
    descIdn: "Yuki ingin onigiri buatan tangan untuk hanami. Masak onigiri dan berikan padanya.",
    giver: "yuki", prereq: [],
    objectives: [
      { id: "gift", desc: "Give Yuki a gift", event: "gift", target: "yuki", count: 1 },
    ],
    reward: { money: 0, friendship: { npc: "yuki", amount: 2 }, xp: { listening: 10 } },
  },
];

/** Daily quest templates — one is picked each morning. */
export const DAILY_TEMPLATES: Omit<QuestDef, "id">[] = [
  {
    type: "daily", title: "Morning Routine", titleJp: "朝の習慣",
    desc: "Study grammar this morning.", descIdn: "Belajar tata bahasa pagi ini.",
    objectives: [{ id: "d1", desc: "Study at your desk", event: "activity", target: "study", count: 1 }],
    reward: { money: 200, xp: { grammar: 5 } },
  },
  {
    type: "daily", title: "Social Butterfly", titleJp: "おしゃべり",
    desc: "Talk to two people in town.", descIdn: "Bicara dengan dua orang di kota.",
    objectives: [{ id: "d1", desc: "Talk to anyone (2)", event: "talk", count: 2 }],
    reward: { money: 200, xp: { listening: 5 } },
  },
  {
    type: "daily", title: "Balanced Diet", titleJp: "バランスのいい食事",
    desc: "Eat something today.", descIdn: "Makan sesuatu hari ini.",
    objectives: [{ id: "d1", desc: "Eat a food item", event: "eat", count: 1 }],
    reward: { money: 150, xp: { vocabulary: 5 } },
  },
];

export const QUEST_MAP: Record<string, QuestDef> = Object.fromEntries(QUESTS.map(q => [q.id, q]));
