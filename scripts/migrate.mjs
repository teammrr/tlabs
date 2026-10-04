// Applies every file in db/migrations in order. Each file is idempotent, so re-running is safe.
// Usage: DATABASE_URL=... npm run db:migrate   (reads .env.local if present)
import { readdirSync, readFileSync } from "node:fs";
import postgres from "postgres";
import { databaseUrl } from "../lib/db-url.ts";

const url = databaseUrl();
if (!url) {
  console.error("Set DATABASE_URL (or POSTGRES_URL) first.");
  process.exit(1);
}
const dir = new URL("../db/migrations/", import.meta.url);
const sql = postgres(url, { max: 1, prepare: false, connect_timeout: 10 });
try {
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    await sql.unsafe(readFileSync(new URL(file, dir), "utf8"));
    console.log("applied", file);
  }
} finally {
  await sql.end();
}
