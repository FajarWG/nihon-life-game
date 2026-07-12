import { RetryableProviderError, type StoryContext, type StoryProvider } from "../StoryProvider";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

export class GeminiProvider implements StoryProvider {
  readonly name = "gemini";

  available() { return !!process.env.GEMINI_API_KEY; }

  async generateRaw(prompt: string, _ctx: StoryContext): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);
    try {
      const res = await fetch(url, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.9,
          },
        }),
      });
      if (res.status === 429 || res.status >= 500) {
        throw new RetryableProviderError(`HTTP ${res.status}`, this.name);
      }
      if (!res.ok) throw new Error(`[gemini] HTTP ${res.status}: ${await res.text()}`);
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new RetryableProviderError("empty response", this.name);
      return text;
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        throw new RetryableProviderError("timeout", this.name);
      }
      throw e;
    } finally {
      clearTimeout(timeout);
    }
  }
}
