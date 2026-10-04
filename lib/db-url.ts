// Vercel's Supabase integration adds a non-standard `supa=...` query parameter
// that Postgres drivers can reject. Drop it; keep everything else.
export function databaseUrl(env: Record<string, string | undefined> = process.env): string | null {
  const raw = env.DATABASE_URL ?? env.POSTGRES_URL;
  if (!raw) return null;
  try {
    const url = new URL(raw);
    url.searchParams.delete("supa");
    return url.toString();
  } catch {
    return raw;
  }
}
