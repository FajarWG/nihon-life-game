/**
 * Core domain types for Nihon Life: Live, Learn, Work.
 * All game content is JSON-shaped: data files are plain object literals
 * validated against these types at compile time.
 */

// ── JLPT & skills ────────────────────────────────────────────────────────────

export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";

/** Ordered from beginner to advanced. N2/N1 slots exist but ship without content. */
export const JLPT_ORDER: JlptLevel[] = ["N5", "N4", "N3", "N2", "N1"];

export type SkillId = "grammar" | "vocabulary" | "reading" | "listening" | "kanji";

export const SKILL_IDS: SkillId[] = ["grammar", "vocabulary", "reading", "listening", "kanji"];

export type SkillProgress = Record<SkillId, number>;

// ── Language content ─────────────────────────────────────────────────────────

export interface JpText {
  jp: string;
  kana?: string;
  romaji?: string;
  en: string;
}

export interface VocabEntry {
  id: string;
  level: JlptLevel;
  jp: string;         // written form (kanji where natural)
  kana: string;
  romaji: string;
  en: string;
  category: "school" | "food" | "shopping" | "train" | "work" | "daily" | "time" | "place";
}

export interface GrammarExercise {
  /** "order": arrange tiles into a sentence. "fill": pick the word for the blank. */
  kind: "order" | "fill";
  prompt: string;          // instruction / english meaning of target sentence
  tiles?: string[];        // for "order": correct sequence (shuffled at runtime)
  sentence?: string;       // for "fill": sentence with ___
  options?: string[];      // for "fill": choices
  answer?: string;         // for "fill": correct choice
  translation: string;
}

export interface GrammarPoint {
  id: string;
  level: JlptLevel;
  title: string;           // e.g. "〜たいです"
  meaning: string;         // short english gloss
  explanation: string;     // friendly 1-3 sentence explanation
  examples: JpText[];
  exercises: GrammarExercise[];
}

// ── Items, shops, recipes ────────────────────────────────────────────────────

export type ItemCategory = "ingredient" | "food" | "drink" | "gift" | "book" | "key";

export interface ItemDef {
  id: string;
  nameJp: string;
  kana: string;
  nameEn: string;
  category: ItemCategory;
  price: number;           // yen; 0 = not sold
  icon: string;            // key into the generated icon spritesheet
  energy?: number;         // restored when eaten (food/drink)
  desc: string;
}

export interface Recipe {
  id: string;
  nameJp: string;
  kana: string;
  nameEn: string;
  level: JlptLevel;             // language difficulty of the recipe text
  ingredients: string[];        // item ids
  steps: JpText[];              // correct order; the cooking mini-game shuffles these
  result: string;               // item id of the cooked meal
}

// ── Train ────────────────────────────────────────────────────────────────────

export interface Station {
  id: string;
  nameJp: string;
  kana: string;
  romaji: string;
  lines: string[];         // line ids
}

export interface TrainLine {
  id: string;
  nameJp: string;
  nameEn: string;
  color: number;           // hex color for the route map
  stations: string[];      // ordered station ids
}

// ── NPCs & dialogue ──────────────────────────────────────────────────────────

export interface DialogueLine {
  speaker: string;         // npc id, "player", or "narrator"
  jp: string;
  kana?: string;
  en: string;
}

/** A short predefined conversation. Higher tiers unlock with friendship. */
export interface DialogueSet {
  id: string;
  minFriendship: number;   // 0..10
  lines: DialogueLine[];
}

export interface ScheduleSlot {
  from: number;            // hour (0-23)
  to: number;
  location: LocationId;
  x: number;               // tile position within that map
  y: number;
}

export interface NpcDef {
  id: string;
  name: string;            // display name (romaji)
  nameJp: string;
  age: number;
  occupation: string;
  sprite: string;          // character spritesheet key
  bio: string;
  favoriteItems: string[]; // item ids; gifting these raises friendship faster
  schedule: ScheduleSlot[];
  dialogues: DialogueSet[];
  questId?: string;        // relationship quest unlocked at friendship >= 3
}

// ── World ────────────────────────────────────────────────────────────────────

export type LocationId =
  | "town"
  | "apartment"
  | "school"
  | "station"
  | "konbini"
  | "supermarket"
  | "company"
  | "park"
  | "restaurant"
  | "library";

export const LOCATION_NAMES: Record<LocationId, { jp: string; en: string }> = {
  town: { jp: "さくら町", en: "Sakura Town" },
  apartment: { jp: "アパート", en: "Apartment" },
  school: { jp: "日本語学校", en: "Language School" },
  station: { jp: "駅", en: "Train Station" },
  konbini: { jp: "コンビニ", en: "Convenience Store" },
  supermarket: { jp: "スーパー", en: "Supermarket" },
  company: { jp: "IT会社", en: "IT Company" },
  park: { jp: "公園", en: "Park" },
  restaurant: { jp: "レストラン", en: "Restaurant" },
  library: { jp: "図書館", en: "Library" },
};

export type Weather = "sunny" | "cloudy" | "rain" | "snow";

export type Season = "spring" | "summer" | "autumn" | "winter";

// ── Quests ───────────────────────────────────────────────────────────────────

export type QuestType =
  | "main" | "daily" | "side" | "school" | "work"
  | "cooking" | "relationship" | "festival" | "story";

/**
 * Objectives advance from gameplay events (see QuestEvent). `count` is how many
 * matching events are needed; `target` optionally narrows the match
 * (e.g. talk:yuki, buy:egg, activity:school).
 */
export interface QuestObjective {
  id: string;
  desc: string;
  descJp?: string;
  event: QuestEventKind;
  target?: string;
  count: number;
}

export type QuestEventKind =
  | "talk"          // target: npc id
  | "gift"          // target: npc id
  | "buy"           // target: item id
  | "cook"          // target: recipe id
  | "eat"           // target: item id
  | "activity"      // target: study | school | shopping | train | work | cooking
  | "skill"         // target: skill id, count = xp threshold delta
  | "reach-level"   // target: JlptLevel
  | "visit";        // target: LocationId

export interface QuestReward {
  money?: number;
  xp?: Partial<SkillProgress>;
  items?: string[];        // item ids
  friendship?: { npc: string; amount: number };
}

export interface QuestDef {
  id: string;
  type: QuestType;
  title: string;
  titleJp?: string;
  desc: string;
  giver?: string;          // npc id
  level?: JlptLevel;       // minimum JLPT level to receive it
  prereq?: string[];       // quest ids that must be completed first
  objectives: QuestObjective[];
  reward: QuestReward;
  /** main-quest ordering; next main quest auto-starts when this completes */
  next?: string;
}

// ── Work (IT company mini-games) ─────────────────────────────────────────────

export type WorkTaskKind =
  | "bug-css"       // read JP bug report, choose the correct CSS fix
  | "bug-js"        // read JP bug report, choose the correct JS/React fix
  | "ui-label"      // match JP UI labels to their english/meaning
  | "git-order"     // arrange git workflow steps
  | "code-review"   // read JP review comment, pick the offending line
  | "meeting"       // read JP schedule/notice, answer a question
  | "docs";         // read simple JP documentation, answer a question

export interface WorkTask {
  id: string;
  kind: WorkTaskKind;
  level: JlptLevel;
  title: string;                 // ticket title, japanese
  titleEn: string;
  body: JpText[];                // the bug report / doc / meeting notice
  question: string;              // what the player must decide (english framing ok)
  options?: string[];            // for choice-based kinds
  answer?: string;               // correct option
  tiles?: string[];              // for git-order: correct sequence
  pairs?: [string, string][];    // for ui-label: [jp, en]
  pay: number;                   // yen on success
}

// ── School lessons ───────────────────────────────────────────────────────────

export interface ReadingPassage {
  id: string;
  level: JlptLevel;
  title: string;
  text: JpText[];              // short paragraph, line by line
  question: string;
  options: string[];
  answer: string;
}

export interface ListeningDrill {
  id: string;
  level: JlptLevel;
  audioJp: string;             // spoken via speech synthesis (ja-JP)
  question: string;
  options: string[];
  answer: string;
}

// ── AI stories ───────────────────────────────────────────────────────────────

/** The only thing AI generates. Validated hard before it touches the game. */
export interface StoryEvent {
  id: string;
  kind: "daily" | "season" | "festival" | "quest" | "holiday" | "encounter";
  title: string;
  titleJp: string;
  level: JlptLevel;
  setting: string;                       // short scene description
  lines: DialogueLine[];
  vocabulary: { jp: string; en: string }[];
  grammarFocus: string;
  choice?: { prompt: string; options: { text: string; reply: string }[] };
  reward: { money?: number; xp?: Partial<SkillProgress> };
  createdAt: number;
}

// ── Save data ────────────────────────────────────────────────────────────────

export interface SaveData {
  version: 1;
  savedAt: number;
  playerName: string;
  day: number;
  minutes: number;             // minutes since 00:00, day starts 06:30
  season: Season;
  weather: Weather;
  money: number;
  energy: number;
  jlpt: JlptLevel;
  skills: SkillProgress;
  location: LocationId;
  posX: number;
  posY: number;
  inventory: Record<string, number>;
  learnedGrammar: string[];    // grammar point ids studied
  learnedVocab: string[];
  activitiesDone: string[];    // activity ids done today (reset daily)
  quests: {
    active: { id: string; progress: Record<string, number> }[];
    completed: string[];
  };
  npcs: Record<string, { friendship: number; talkedToday: boolean; giftedToday: boolean }>;
  examPassed: JlptLevel[];
  flags: Record<string, boolean | number | string>;
}
