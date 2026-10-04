import { getDb } from "@/lib/db";
import { consentTextVersion } from "@/lib/consent";
import { problemSchema } from "@/lib/problem-schema";
import { allowSubmission } from "@/lib/rate-limit";

export const runtime = "nodejs";

const maxBodyBytes = 20_000;
const json = (body: object, status: number) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  // Same-origin only: a browser form on our site always sends a matching Origin.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) {
    return json({ error: "forbidden" }, 403);
  }

  const raw = await request.text();
  if (raw.length > maxBodyBytes) return json({ error: "too_large" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "invalid" }, 400);
  }

  const parsed = problemSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: "invalid", fields: parsed.error.issues.map((i) => i.path.join(".")) }, 400);
  }
  const data = parsed.data;

  // Honeypot: bots fill it. Pretend it worked and store nothing.
  if (data.company_website) return json({ ok: true }, 201);

  const db = getDb();
  if (!db) return json({ error: "not_configured" }, 503);

  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";
    if (!(await allowSubmission(db, ip))) return json({ error: "rate_limited" }, 429);

    const hasContact = Boolean(data.nickname || data.email || data.lineId);
    await db`
      insert into problem_submissions
        (locale, problem, who_has_it, current_workaround, category,
         nickname, email, line_id, consent_given, consent_text_version)
      values
        (${data.language}, ${data.problem}, ${data.who}, ${data.today}, ${db.array(data.category)},
         ${data.nickname}, ${data.email}, ${data.lineId},
         ${data.consent && hasContact}, ${data.consent && hasContact ? consentTextVersion(data.language) : null})`;
    return json({ ok: true }, 201);
  } catch (error) {
    // Log the error type only: never the submission, which may contain personal data.
    console.error("problem submit failed:", error instanceof Error ? error.name : "unknown");
    return json({ error: "server" }, 500);
  }
}
