import { createStore } from "zustand/vanilla";
import type { JlptLevel, LocationId, SaveData, Season, SkillId, Weather } from "@/core/types";
import { ITEM_MAP } from "@/data/items";
import { Bus } from "@/game/events";

/** Minutes per in-game day tick while roaming (see WorldScene). */
export const DAY_START = 6 * 60 + 30; // 06:30
export const DAY_END = 24 * 60;       // forced sleep at midnight

export const MAX_ENERGY = 100;

/** Total skill XP needed before the next JLPT exam unlocks. */
export const LEVEL_XP: Partial<Record<JlptLevel, number>> = {
  N5: 300,  // to unlock N4 exam
  N4: 700,  // to unlock N3 exam
  N3: 1400, // future N2 (content not shipped yet)
};

export interface GameState extends SaveData {
  paused: boolean;

  // time & day
  advanceMinutes: (m: number) => void;
  sleep: (forced?: boolean) => { xpGained: number; forced: boolean };

  // economy & body
  addMoney: (n: number) => void;
  spendMoney: (n: number) => boolean;
  addEnergy: (n: number) => void;

  // learning
  addXp: (skill: SkillId, amount: number) => void;
  totalXp: () => number;
  examReady: () => boolean;
  passExam: () => void;
  learnGrammarPoint: (id: string) => void;

  // inventory
  addItem: (id: string, qty?: number) => void;
  removeItem: (id: string, qty?: number) => boolean;
  eatItem: (id: string) => boolean;

  // world
  setLocation: (loc: LocationId, x: number, y: number) => void;
  markActivity: (activity: string) => void;
  setPaused: (p: boolean) => void;

  // persistence
  toSave: () => SaveData;
  applySave: (s: SaveData) => void;
  resetNew: (playerName: string) => void;
}

export const NEXT_LEVEL: Partial<Record<JlptLevel, JlptLevel>> = { N5: "N4", N4: "N3", N3: "N2" };

function rollWeather(season: Season): Weather {
  const r = Math.random();
  if (season === "winter" && r < 0.2) return "snow";
  if (r < 0.22) return "rain";
  if (r < 0.5) return "cloudy";
  return "sunny";
}

export function seasonForDay(day: number): Season {
  const seasons: Season[] = ["spring", "summer", "autumn", "winter"];
  return seasons[Math.floor(((day - 1) % 112) / 28)];
}

const freshSave = (playerName: string): SaveData => ({
  version: 1,
  savedAt: Date.now(),
  playerName,
  day: 1,
  minutes: DAY_START,
  season: "spring",
  weather: "sunny",
  money: 3000,
  energy: MAX_ENERGY,
  jlpt: "N5",
  skills: { grammar: 0, vocabulary: 0, reading: 0, listening: 0, kanji: 0 },
  location: "apartment",
  posX: 5,
  posY: 6,
  inventory: { bread: 1, greentea: 1 },
  learnedGrammar: [],
  learnedVocab: [],
  activitiesDone: [],
  quests: { active: [], completed: [] },
  npcs: {},
  examPassed: [],
  flags: { introPlayed: false },
  vocabReview: {},
});

export const gameStore = createStore<GameState>()((set, get) => ({
  ...freshSave("Player"),
  paused: false,

  advanceMinutes: (m) => {
    set(s => ({ minutes: Math.min(s.minutes + m, DAY_END) }));
    Bus.emit("time", get().minutes);
  },

  sleep: (forced = false) => {
    const s = get();
    const xpGained = (s.flags["xpToday"] as number) ?? 0;
    const day = s.day + 1;
    set({
      day,
      minutes: DAY_START,
      season: seasonForDay(day),
      weather: rollWeather(seasonForDay(day)),
      energy: forced ? Math.round(MAX_ENERGY * 0.6) : MAX_ENERGY,
      activitiesDone: [],
      npcs: Object.fromEntries(Object.entries(s.npcs).map(([id, n]) => [id, { ...n, talkedToday: false, giftedToday: false }])),
      flags: { ...s.flags, xpToday: 0 },
    });
    Bus.emit("new-day", day);
    return { xpGained, forced };
  },

  addMoney: (n) => {
    set(s => ({ money: Math.max(0, s.money + n) }));
    Bus.emit("money", get().money);
  },
  spendMoney: (n) => {
    if (get().money < n) return false;
    set(s => ({ money: s.money - n }));
    Bus.emit("money", get().money);
    return true;
  },
  addEnergy: (n) => set(s => ({ energy: Math.max(0, Math.min(MAX_ENERGY, s.energy + n)) })),

  addXp: (skill, amount) => {
    set(s => ({
      skills: { ...s.skills, [skill]: Math.max(0, s.skills[skill] + amount) },
      flags: { ...s.flags, xpToday: ((s.flags["xpToday"] as number) ?? 0) + amount },
    }));
    Bus.emit("xp", skill, amount);
    if (get().examReady()) Bus.emit("exam-ready", get().jlpt);
  },
  totalXp: () => Object.values(get().skills).reduce((a, b) => a + b, 0),
  examReady: () => {
    const s = get();
    const need = LEVEL_XP[s.jlpt];
    const next = NEXT_LEVEL[s.jlpt];
    // Only N5→N4 and N4→N3 exams ship with content; N2/N1 come later.
    return need !== undefined && (next === "N4" || next === "N3") && s.totalXp() >= need;
  },
  passExam: () => {
    const cur = get().jlpt;
    const next = NEXT_LEVEL[cur];
    if (!next || next === "N2" || next === "N1") {
      // N2/N1 slots exist in the type system but ship without content yet
      set(s => ({ examPassed: [...s.examPassed, cur] }));
      return;
    }
    set(s => ({ jlpt: next, examPassed: [...s.examPassed, cur] }));
    Bus.emit("leveled-up", next);
  },
  learnGrammarPoint: (id) =>
    set(s => (s.learnedGrammar.includes(id) ? s : { learnedGrammar: [...s.learnedGrammar, id] })),

  addItem: (id, qty = 1) =>
    set(s => ({ inventory: { ...s.inventory, [id]: (s.inventory[id] ?? 0) + qty } })),
  removeItem: (id, qty = 1) => {
    const have = get().inventory[id] ?? 0;
    if (have < qty) return false;
    set(s => {
      const inv = { ...s.inventory };
      inv[id] = have - qty;
      if (inv[id] <= 0) delete inv[id];
      return { inventory: inv };
    });
    return true;
  },
  eatItem: (id) => {
    const def = ITEM_MAP[id];
    if (!def?.energy) return false;
    if (!get().removeItem(id)) return false;
    get().addEnergy(def.energy);
    Bus.emit("quest-event", "eat", id);
    return true;
  },

  setLocation: (loc, x, y) => set({ location: loc, posX: x, posY: y }),
  markActivity: (activity) => {
    set(s => (s.activitiesDone.includes(activity) ? s : { activitiesDone: [...s.activitiesDone, activity] }));
    Bus.emit("quest-event", "activity", activity);
  },
  setPaused: (p) => set({ paused: p }),

  toSave: () => {
    const s = get();
    return {
      version: 1, savedAt: Date.now(),
      playerName: s.playerName, day: s.day, minutes: s.minutes, season: s.season,
      weather: s.weather, money: s.money, energy: s.energy, jlpt: s.jlpt,
      skills: s.skills, location: s.location, posX: s.posX, posY: s.posY,
      inventory: s.inventory, learnedGrammar: s.learnedGrammar, learnedVocab: s.learnedVocab,
      activitiesDone: s.activitiesDone, quests: s.quests, npcs: s.npcs,
      examPassed: s.examPassed, flags: s.flags, vocabReview: s.vocabReview,
    };
  },
  applySave: (save) => set({ ...save }),
  resetNew: (playerName) => set({ ...freshSave(playerName) }),
}));

/** Convenience accessor used across scenes. */
export const G = () => gameStore.getState();
