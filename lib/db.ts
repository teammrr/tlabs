import "server-only";
import postgres from "postgres";
import { databaseUrl } from "./db-url";

// Server-only. The connection string never reaches the browser.
let client: ReturnType<typeof postgres> | undefined;

export function getDb() {
  const url = databaseUrl();
  if (!url) return null;
  // max 1 + no prepared statements: right for serverless and for pooled
  // (transaction-mode) connection strings from Supabase / Neon.
  client ??= postgres(url, { max: 1, prepare: false, idle_timeout: 20, connect_timeout: 10 });
  return client;
}
