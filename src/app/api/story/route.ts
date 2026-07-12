import { NextResponse } from "next/server";
import { StoryGenerator } from "@/features/story/StoryGenerator";

export const runtime = "nodejs";

/**
 * POST /api/story — generate a new story event.
 * Body: { playerName, level, day, season, weather, kind? }
 * AI is optional: without API keys this returns 503 and the game plays on.
 */
export async function POST(req: Request) {
  const generator = new StoryGenerator();
  if (!generator.configured()) {
    return NextResponse.json(
      { error: "No AI provider configured. Set GROQ_API_KEY and/or GEMINI_API_KEY." },
      { status: 503 },
    );
  }
  try {
    const body = await req.json();
    const { event, provider } = await generator.generate({
      playerName: String(body.playerName ?? "Player").slice(0, 40),
      level: ["N5", "N4", "N3"].includes(body.level) ? body.level : "N5",
      day: Number(body.day) || 1,
      season: String(body.season ?? "spring"),
      weather: String(body.weather ?? "sunny"),
      kind: typeof body.kind === "string" ? body.kind : "daily",
    });
    return NextResponse.json({ event, provider });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "generation failed" },
      { status: 502 },
    );
  }
}
