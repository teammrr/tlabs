import "server-only";
import { createHmac } from "node:crypto";
import type { getDb } from "./db";

type Db = NonNullable<ReturnType<typeof getDb>>;

const limit = Number(process.env.PROBLEM_RATE_LIMIT_PER_HOUR ?? 5);
const hour = 60 * 60 * 1000;
const memory = new Map<string, number>(); // fallback when RATE_LIMIT_SALT is not set

// Returns true if this visitor may submit. The raw IP is never stored or logged:
// we keep an HMAC of it (keyed with RATE_LIMIT_SALT) plus the current hour.
export async function allowSubmission(db: Db, ip: string): Promise<boolean> {
  const bucket = Math.floor(Date.now() / hour);
  const salt = process.env.RATE_LIMIT_SALT;

  if (!salt) {
    // Per-instance only: fine for local dev, weak on serverless. Set RATE_LIMIT_SALT in production.
    const key = `${ip}:${bucket}`;
    const hits = (memory.get(key) ?? 0) + 1;
    memory.set(key, hits);
    if (memory.size > 1000) memory.clear();
    return hits <= limit;
  }

  const key = `${createHmac("sha256", salt).update(ip).digest("hex")}:${bucket}`;
  const [row] = await db<{ hits: number }[]>`
    insert into problem_rate_limits (key) values (${key})
    on conflict (key) do update set hits = problem_rate_limits.hits + 1
    returning hits`;
  if (Math.random() < 0.05) {
    await db`delete from problem_rate_limits where created_at < now() - interval '1 day'`;
  }
  return row.hits <= limit;
}
