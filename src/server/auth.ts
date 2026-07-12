import { createHmac, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";

/**
 * Minimal username/password auth.
 * Sessions are stateless: an HMAC-signed cookie `nihon_session` = "user.sig".
 * Secret comes from AUTH_SECRET (fallback: derived from DATABASE_URL).
 */

const COOKIE = "nihon_session";

function secret(): string {
  return process.env.AUTH_SECRET || `nihon-life:${process.env.DATABASE_URL ?? "dev"}`;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

function sign(username: string): string {
  return createHmac("sha256", secret()).update(username).digest("hex").slice(0, 32);
}

export function sessionCookieName() { return COOKIE; }

export function makeSessionValue(username: string): string {
  return `${encodeURIComponent(username)}.${sign(username)}`;
}

/** Returns the username for a valid session cookie value, else null. */
export function readSessionValue(value: string | undefined | null): string | null {
  if (!value) return null;
  const dot = value.lastIndexOf(".");
  if (dot <= 0) return null;
  const username = decodeURIComponent(value.slice(0, dot));
  const sig = value.slice(dot + 1);
  const expected = sign(username);
  if (sig.length !== expected.length) return null;
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  return username;
}

/** Extract the logged-in username from a Request's cookies, else null. */
export function userFromRequest(req: Request): string | null {
  const header = req.headers.get("cookie") ?? "";
  const match = header.split(/;\s*/).find(c => c.startsWith(`${COOKIE}=`));
  return readSessionValue(match ? match.slice(COOKIE.length + 1) : null);
}

export function validUsername(u: unknown): u is string {
  return typeof u === "string" && /^[a-zA-Z0-9_-]{3,24}$/.test(u);
}

export function validPassword(p: unknown): p is string {
  return typeof p === "string" && p.length >= 4 && p.length <= 72;
}
