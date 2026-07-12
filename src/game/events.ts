/** Tiny typed event bus connecting game systems, scenes and (rarely) React. */
type Handler = (...args: never[]) => void;

class EventBus {
  private handlers = new Map<string, Set<(...args: unknown[]) => void>>();

  on(event: string, fn: (...args: never[]) => void) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(fn as (...args: unknown[]) => void);
    return () => this.off(event, fn);
  }

  off(event: string, fn: Handler) {
    this.handlers.get(event)?.delete(fn as (...args: unknown[]) => void);
  }

  emit(event: string, ...args: unknown[]) {
    this.handlers.get(event)?.forEach(fn => fn(...args));
  }

  clear() {
    this.handlers.clear();
  }
}

/**
 * Events:
 *  toast(text, kind?)       — show HUD notification
 *  time(minutes)            — clock changed
 *  new-day(day)             — after sleep
 *  money(total)             — money changed
 *  xp(skill, amount)        — skill xp gained
 *  exam-ready(level)        — JLPT exam unlocked
 *  leveled-up(newLevel)     — passed exam
 *  quest-event(kind,target) — gameplay event for quest objectives
 *  quest-updated / quest-completed(questId)
 */
export const Bus = new EventBus();
