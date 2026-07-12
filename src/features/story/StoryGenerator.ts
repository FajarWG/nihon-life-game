import type { StoryEvent } from "@/core/types";
import { buildPrompt, RetryableProviderError, type StoryContext, type StoryProvider } from "./StoryProvider";
import { GroqProvider } from "./providers/GroqProvider";
import { GeminiProvider } from "./providers/GeminiProvider";
import { validateStoryEvent } from "./validate";

/**
 * Walks the provider chain: Groq first, Gemini on rate-limit / quota /
 * timeout / empty responses. The rest of the game only sees StoryEvent.
 * Server-side only (API keys live in env).
 */
export class StoryGenerator {
  private providers: StoryProvider[];

  constructor(providers?: StoryProvider[]) {
    this.providers = providers ?? [new GroqProvider(), new GeminiProvider()];
  }

  configured(): boolean {
    return this.providers.some(p => p.available());
  }

  async generate(ctx: StoryContext): Promise<{ event: StoryEvent; provider: string }> {
    const prompt = buildPrompt(ctx);
    const errors: string[] = [];

    for (const provider of this.providers) {
      if (!provider.available()) continue;
      try {
        const raw = await provider.generateRaw(prompt, ctx);
        const event = validateStoryEvent(raw, ctx);
        return { event, provider: provider.name };
      } catch (e) {
        if (e instanceof RetryableProviderError) {
          errors.push(e.message);
          continue; // fall through to the next provider
        }
        // Validation failures also fall through — the next provider may do better.
        errors.push(e instanceof Error ? e.message : String(e));
        continue;
      }
    }
    throw new Error(`All story providers failed: ${errors.join(" | ") || "no provider configured"}`);
  }
}
