import { NextResponse } from "next/server";
import { addPack, dbConfigured, deletePack, listPacks } from "@/server/db";
import { CONTENT_TYPES, validatePackItems } from "@/features/content/schema";
import { isAdmin, userFromRequest } from "@/server/auth";

export const runtime = "nodejs";

/** Custom content packs (admin page writes, game reads at boot). */
export async function GET(req: Request) {
  const username = userFromRequest(req);
  if (!isAdmin(username)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!dbConfigured()) return NextResponse.json({ packs: [] });
  try {
    return NextResponse.json({ packs: await listPacks() });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "db error" }, { status: 502 });
  }
}

export async function POST(req: Request) {
  const username = userFromRequest(req);
  if (!isAdmin(username)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!dbConfigured()) return NextResponse.json({ error: "no database configured" }, { status: 503 });
  try {
    const body = await req.json();
    const type = String(body.type ?? "");
    if (!CONTENT_TYPES.includes(type as never)) {
      return NextResponse.json({ error: `unknown content type "${type}"` }, { status: 400 });
    }
    const result = validatePackItems(type, body.items);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    const id = await addPack(type, result.items);
    return NextResponse.json({ ok: true, id, count: result.items.length });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "db error" }, { status: 502 });
  }
}

export async function DELETE(req: Request) {
  const username = userFromRequest(req);
  if (!isAdmin(username)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!dbConfigured()) return NextResponse.json({ error: "no database configured" }, { status: 503 });
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id)) return NextResponse.json({ error: "bad id" }, { status: 400 });
  try {
    await deletePack(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "db error" }, { status: 502 });
  }
}
