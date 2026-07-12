import { NextResponse } from "next/server";
import { dbConfigured, getSave, putSave } from "@/server/db";

export const runtime = "nodejs";

/** Cloud save sync. Optional — clients treat any failure as "stay local". */
export async function GET(req: Request) {
  if (!dbConfigured()) return NextResponse.json({ error: "no database configured" }, { status: 503 });
  const slot = new URL(req.url).searchParams.get("slot") ?? "auto";
  try {
    const row = await getSave(slot);
    if (!row) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(row);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "db error" }, { status: 502 });
  }
}

export async function PUT(req: Request) {
  if (!dbConfigured()) return NextResponse.json({ error: "no database configured" }, { status: 503 });
  try {
    const body = await req.json();
    const slot = typeof body.slot === "string" ? body.slot : "auto";
    if (typeof body.data !== "object" || body.data === null) {
      return NextResponse.json({ error: "missing save data" }, { status: 400 });
    }
    await putSave(slot, body.data, Number(body.data.savedAt) || Date.now());
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "db error" }, { status: 502 });
  }
}
