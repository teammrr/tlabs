import { getDb } from "@/lib/db";
import { siteConfig } from "@/site.config";

export const runtime = "nodejs";

// Runs daily from Vercel Cron (see vercel.json). Vercel sends
// "Authorization: Bearer $CRON_SECRET". Without CRON_SECRET set, this refuses every call.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const db = getDb();
  if (!db) return Response.json({ error: "not_configured" }, { status: 503 });

  const months = siteConfig.problemForm.retentionMonths;
  try {
    const deleted = await db`
      delete from problem_submissions
      where created_at < now() - make_interval(months => ${months})`;
    await db`delete from problem_rate_limits where created_at < now() - interval '1 day'`;
    return Response.json({ deletedSubmissions: deleted.count }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("cleanup failed:", error instanceof Error ? error.name : "unknown");
    return Response.json({ error: "server" }, { status: 500 });
  }
}
