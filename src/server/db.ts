import { Pool } from "pg";

/**
 * Server-side Postgres access (saves + content packs).
 * Lazy singleton pool; schema is created on first use.
 * Every caller must tolerate `null` (no DATABASE_URL / DB down) —
 * the game is offline-first by design.
 */

let pool: Pool | null = null;
let schemaReady = false;

export function dbConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}

async function getPool(): Promise<Pool | null> {
  if (!dbConfigured()) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      connectionTimeoutMillis: 4000,
    });
  }
  if (!schemaReady) {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS saves (
        slot TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        saved_at BIGINT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS content_packs (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        items JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
    schemaReady = true;
  }
  return pool;
}

export async function putSave(slot: string, data: unknown, savedAt: number) {
  const p = await getPool();
  if (!p) throw new Error("db not configured");
  await p.query(
    `INSERT INTO saves (slot, data, saved_at) VALUES ($1, $2, $3)
     ON CONFLICT (slot) DO UPDATE SET data = $2, saved_at = $3`,
    [slot, JSON.stringify(data), savedAt],
  );
}

export async function getSave(slot: string): Promise<{ data: unknown; savedAt: number } | null> {
  const p = await getPool();
  if (!p) throw new Error("db not configured");
  const r = await p.query("SELECT data, saved_at FROM saves WHERE slot = $1", [slot]);
  if (!r.rows.length) return null;
  return { data: r.rows[0].data, savedAt: Number(r.rows[0].saved_at) };
}

export interface PackRow {
  id: number;
  type: string;
  items: unknown[];
  created_at: string;
}

export async function listPacks(): Promise<PackRow[]> {
  const p = await getPool();
  if (!p) throw new Error("db not configured");
  const r = await p.query("SELECT id, type, items, created_at FROM content_packs ORDER BY id");
  return r.rows;
}

export async function addPack(type: string, items: unknown[]): Promise<number> {
  const p = await getPool();
  if (!p) throw new Error("db not configured");
  const r = await p.query(
    "INSERT INTO content_packs (type, items) VALUES ($1, $2) RETURNING id",
    [type, JSON.stringify(items)],
  );
  return r.rows[0].id;
}

export async function deletePack(id: number) {
  const p = await getPool();
  if (!p) throw new Error("db not configured");
  await p.query("DELETE FROM content_packs WHERE id = $1", [id]);
}
