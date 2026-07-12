import { buildPrompt, RetryableProviderError, type StoryContext, type StoryProvider } from "../StoryProvider";

const URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

export class GroqProvider implements StoryProvider {
  readonly name = "groq";

  available() { return !!process.env.GROQ_API_KEY; }

  async generateRaw(prompt: string, _ctx: StoryContext): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);
    try {
      const res = await fetch(URL, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          response_format: { type: "json_object" },
          temperature: 0.9,
          messages: [
            { role: "system", content: "You output only valid JSON. Never markdown. Never HTML." },
            { role: "user", content: prompt },
          ],
        }),
      });
      if (res.status === 429 || res.status === 402 || res.status >= 500) {
        throw new RetryableProviderError(`HTTP ${res.status}`, this.name);
      }
      if (!res.ok) throw new Error(`[groq] HTTP ${res.status}: ${await res.text()}`);
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
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

export { buildPrompt };
