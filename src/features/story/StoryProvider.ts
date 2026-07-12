/**
 * Story generation provider abstraction.
 * The game never talks to a vendor directly: it asks the StoryGenerator,
 * which walks a provider chain (Groq → Gemini). Providers return raw JSON
 * text; validation happens in one place (validate.ts).
 */

export interface StoryContext {
  playerName: string;
  level: string;       // JLPT level, e.g. "N5"
  day: number;
  season: string;
  weather: string;
  kind?: string;       // daily | season | festival | quest | holiday | encounter
}

/** Errors that should trigger a fallback to the next provider. */
export class RetryableProviderError extends Error {
  constructor(message: string, readonly provider: string) {
    super(`[${provider}] ${message}`);
  }
}

export interface StoryProvider {
  readonly name: string;
  /** true when the required API key is configured */
  available(): boolean;
  /** Returns the model's raw JSON string. Throws RetryableProviderError on rate-limit/quota/timeout. */
  generateRaw(prompt: string, ctx: StoryContext): Promise<string>;
}

export function buildPrompt(ctx: StoryContext): string {
  return `You write tiny slice-of-life story events for a Japanese-learning RPG set in a small Japanese town.
Player: an international student named ${ctx.playerName}, JLPT level ${ctx.level}, day ${ctx.day}, season ${ctx.season}, weather ${ctx.weather}.
Event kind: ${ctx.kind ?? "daily"}.

Return ONLY a JSON object (no markdown, no commentary) with EXACTLY this shape:
{
  "kind": "${ctx.kind ?? "daily"}",
  "title": "short english title",
  "titleJp": "short japanese title",
  "level": "${ctx.level}",
  "setting": "one english sentence describing the scene",
  "lines": [
    { "speaker": "narrator|player|<character name>", "jp": "japanese line", "kana": "full-kana reading", "en": "english translation" }
  ],
  "vocabulary": [ { "jp": "word", "en": "meaning" } ],
  "grammarFocus": "one grammar point used, e.g. ~てもいい",
  "choice": { "prompt": "english question for the player", "options": [ { "text": "option in simple japanese", "reply": "short japanese reply + english in parentheses" } ] },
  "reward": { "money": 100, "xp": { "reading": 5, "listening": 3 } }
}

Rules:
- 6 to 9 lines. Japanese strictly appropriate for JLPT ${ctx.level} (short sentences for N5).
- Every line MUST include jp, kana and en.
- 3-5 vocabulary items actually used in the lines.
- Warm, cozy Stardew-Valley-like tone. No violence, no romance beyond friendship.
- reward.money between 0 and 300; xp values between 2 and 8.`;
}
