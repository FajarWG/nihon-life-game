import { NextResponse } from "next/server";
import { createUser, dbConfigured, getUserHash } from "@/server/db";
import {
  hashPassword, makeSessionValue, sessionCookieName,
  userFromRequest, validPassword, validUsername, verifyPassword,
} from "@/server/auth";

export const runtime = "nodejs";

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

/** GET /api/auth — who am I? 200 {username} | 401 (login needed) | 503 (no DB configured). */
export async function GET(req: Request) {
  if (!dbConfigured()) return NextResponse.json({ error: "no database" }, { status: 503 });
  const username = userFromRequest(req);
  if (username) return NextResponse.json({ username });
  return NextResponse.json({ error: "not logged in" }, { status: 401 });
}

/** POST /api/auth — {action: "register"|"login"|"logout", username?, password?, confirmPassword?} */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad json" }, { status: 400 }); }
  const action = String(body.action ?? "");

  if (action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(sessionCookieName(), "", { ...COOKIE_OPTS, maxAge: 0 });
    return res;
  }

  if (!dbConfigured()) {
    return NextResponse.json({ error: "No database configured. Cannot authenticate." }, { status: 503 });
  }
  const { username, password, confirmPassword } = body;
  if (!validUsername(username)) {
    return NextResponse.json({ error: "Username: 3-24 chars, letters/numbers/_/- only." }, { status: 400 });
  }
  if (!validPassword(password)) {
    return NextResponse.json({ error: "Password: at least 4 characters." }, { status: 400 });
  }

  try {
    if (action === "register") {
      const cp = typeof confirmPassword === "string" ? confirmPassword : "";
      if (password !== cp) return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
      const created = await createUser(username, hashPassword(password));
      if (!created) return NextResponse.json({ error: "Username already taken." }, { status: 409 });
    } else if (action === "login") {
      const hash = await getUserHash(username);
      if (!hash || !verifyPassword(password, hash)) {
        return NextResponse.json({ error: "Wrong username or password." }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
    }
    const res = NextResponse.json({ ok: true, username });
    res.cookies.set(sessionCookieName(), makeSessionValue(username), COOKIE_OPTS);
    return res;
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "db error" }, { status: 502 });
  }
}
