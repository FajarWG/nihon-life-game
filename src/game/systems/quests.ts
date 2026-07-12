import type { QuestDef, QuestEventKind } from "@/core/types";
import { NPC_MAP } from "@/data/npcs";
import { DAILY_TEMPLATES, QUESTS, QUEST_MAP } from "@/data/quests";
import { Bus } from "@/game/events";
import { G, gameStore } from "@/game/state/gameState";

/** Runtime registry: static quests + generated dailies (daily defs live only for the day). */
const runtimeQuests = new Map<string, QuestDef>();

export function questDef(id: string): QuestDef | undefined {
  return QUEST_MAP[id] ?? runtimeQuests.get(id);
}

export function activeQuests() {
  return G().quests.active
    .map(a => ({ ...a, def: questDef(a.id) }))
    .filter((q): q is typeof q & { def: QuestDef } => !!q.def);
}

export function startQuest(id: string, def?: QuestDef) {
  const s = G();
  if (s.quests.active.some(q => q.id === id) || s.quests.completed.includes(id)) return;
  if (def) runtimeQuests.set(id, def);
  const d = questDef(id);
  if (!d) return;
  gameStore.setState(st => ({
    quests: { ...st.quests, active: [...st.quests.active, { id, progress: {} }] },
  }));
  Bus.emit("toast", `New quest: ${d.title}`, "quest");
  Bus.emit("quest-updated");
}

/** Called every morning: pick one daily quest template. */
export function rollDailyQuest(day: number) {
  // drop yesterday's unfinished daily
  gameStore.setState(st => ({
    quests: { ...st.quests, active: st.quests.active.filter(q => !q.id.startsWith("daily-")) },
  }));
  const t = DAILY_TEMPLATES[(day - 1) % DAILY_TEMPLATES.length];
  const id = `daily-${day}`;
  startQuest(id, { ...t, id });
}

/** Feed a gameplay event into all active quests. */
export function processQuestEvent(kind: QuestEventKind, target?: string) {
  const s = G();
  let changed = false;
  const completed: string[] = [];

  const active = s.quests.active.map(entry => {
    const def = questDef(entry.id);
    if (!def) return entry;
    const progress = { ...entry.progress };
    for (const obj of def.objectives) {
      if (obj.event !== kind) continue;
      if (obj.target && obj.target !== target) continue;
      const cur = progress[obj.id] ?? 0;
      if (cur >= obj.count) continue;
      progress[obj.id] = cur + 1;
      changed = true;
    }
    const done = def.objectives.every(o => (progress[o.id] ?? 0) >= o.count);
    if (done) completed.push(entry.id);
    return { ...entry, progress };
  });

  if (!changed) return;

  gameStore.setState(st => ({
    quests: {
      active: active.filter(q => !completed.includes(q.id)),
      completed: [...st.quests.completed, ...completed],
    },
  }));
  Bus.emit("quest-updated");
  for (const id of completed) grantReward(id);
}

function grantReward(questId: string) {
  const def = questDef(questId);
  if (!def) return;
  const s = G();
  if (def.reward.money) s.addMoney(def.reward.money);
  if (def.reward.xp) for (const [skill, amt] of Object.entries(def.reward.xp)) {
    s.addXp(skill as keyof typeof s.skills, amt!);
  }
  if (def.reward.items) def.reward.items.forEach(i => s.addItem(i));
  if (def.reward.friendship) adjustFriendship(def.reward.friendship.npc, def.reward.friendship.amount);
  Bus.emit("toast", `Quest complete: ${def.title}!`, "success");
  Bus.emit("quest-completed", questId);
  if (def.next && QUEST_MAP[def.next]) startQuest(def.next);
}

export function adjustFriendship(npcId: string, amount: number) {
  gameStore.setState(st => {
    const cur = st.npcs[npcId] ?? { friendship: 0, talkedToday: false, giftedToday: false };
    return { npcs: { ...st.npcs, [npcId]: { ...cur, friendship: Math.max(0, Math.min(10, cur.friendship + amount)) } } };
  });
  // Friendship milestone unlocks that NPC's relationship quest.
  const npc = NPC_MAP[npcId];
  if (npc?.questId && (G().npcs[npcId]?.friendship ?? 0) >= 3) {
    startQuest(npc.questId);
  }
}

/** Ensure the main quest chain is running (new game). */
export function ensureMainQuest() {
  const s = G();
  const anyMain = s.quests.active.some(q => q.id.startsWith("main-")) ||
    s.quests.completed.some(q => q.startsWith("main-"));
  if (!anyMain) startQuest(QUESTS[0].id);
}

// Wire the bus once (idempotent via module scope).
Bus.on("quest-event", ((kind: QuestEventKind, target?: string) => processQuestEvent(kind, target)) as never);
