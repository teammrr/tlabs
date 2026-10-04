# TLab website

Next.js 16 (App Router) + TypeScript, hand-written CSS from Anne's design tokens. Deployed as a normal Next.js app on Vercel: every marketing page is prerendered (static); only `POST /api/problem/` and the cleanup cron run on the server. English at `/` (default), Thai at `/th/`.

## Run locally

```bash
npm install
npm run dev            # http://localhost:3000  (Thai: /th/)
npm run build && npm start
npm run check:launch   # lists placeholders still unfilled (fails until launch-ready)
```

### Try the problem form with a local database (no Docker, no account)

```bash
npm run db:dev         # starts a throwaway Postgres on :5433 and applies db/migrations
cp .env.example .env.local   # then set DATABASE_URL to the line db:dev prints
npm run dev
```

Without `DATABASE_URL` the form still renders; submitting shows "That didn't go through" with the mailto fallback.

## Where things live

- `site.config.ts` **launch details**: site URL, contact email, LINE OA link, legal entity, privacy policy URL, team, and the problem-form consent settings (retention, storage location, reviewed flag). `null` = visible placeholder on the page.
- `content/en.json`, `content/th.json` all copy; the build fails if the two drift apart.
- `app/(en)/` and `app/(th)/th/` English and Thai layouts and pages (separate root layouts so `<html lang>` is right), including `problem/`.
- `app/api/problem/route.ts` form submission. `app/api/cron/cleanup/route.ts` retention job.
- `lib/problem-schema.ts` (zod validation), `lib/db.ts` (server-only connection), `lib/rate-limit.ts`, `lib/consent.ts`.
- `db/migrations/*.sql` schema. `scripts/migrate.mjs` applies them.
- `design/` Anne's spec and mockup (not part of the app).

## How the problem form works

Browser POSTs JSON to `/api/problem/`. The server validates with zod (length caps, category allow-list, email format, contact details require consent), drops honeypot hits silently, rejects cross-origin requests, rate-limits, then inserts one row into `problem_submissions`. The database connection string is read from env vars on the server only.

- **Rate limit:** 5 submissions per visitor per hour (`PROBLEM_RATE_LIMIT_PER_HOUR`). We store an HMAC of the IP (keyed by `RATE_LIMIT_SALT`) plus the hour, never the IP; rows are pruned after a day. No `RATE_LIMIT_SALT` = in-memory fallback, which is weak on serverless. Set it in production.
- **Consent:** contact details (nickname, email, LINE ID) are only stored with `consent_given = true`; the database enforces this too. Each consented row stores `consent_text_version`, a hash of the consent wording + retention + storage text shown to that person. It changes automatically when any of them change.
- **No analytics, no cookies, no user-agent or IP stored.**

## Founder setup (once)

Nothing here is done yet. Don't paste secrets into the repo or into chat; they go in Vercel's settings.

1. **Create the Vercel project.** Import this repo into Vercel (the repo has to be on GitHub/GitLab/Bitbucket, or deploy with the Vercel CLI). If the repo root is the `tlab` folder, set the project's *Root Directory* to `website`. Framework preset: Next.js (auto-detected).
2. **Add the database from the Marketplace.** In the Vercel project: *Storage* → create a Postgres database from the Marketplace (we recommend **Supabase**; Neon also works), region **Singapore (ap-southeast-1)**, connect it to this project for Production and Preview. Vercel adds `POSTGRES_URL` (or `DATABASE_URL`) automatically. The code reads either.
3. **Set two more env vars** in *Settings → Environment Variables*:
   - `RATE_LIMIT_SALT`: output of `openssl rand -hex 32`
   - `CRON_SECRET`: another `openssl rand -hex 32`
4. **Run the migrations.** Easiest: open the database's SQL editor (Supabase: *SQL Editor*) and run `db/migrations/001_problem_submissions.sql`, then `002_weekly_review_view.sql`. Or from this folder: `vercel env pull .env.local` then `npm run db:migrate` (both files are safe to re-run).
5. **Fill `site.config.ts`**: `siteUrl`, `contactEmail`, `legalEntity`, `privacyPolicyUrl`, `team`. Run `npm run check:launch`.
6. **Deploy**, then test on the live URL: submit the form once from your phone (ideally inside LINE), and confirm the row shows up in the database dashboard (Supabase: *Table Editor → problem_submissions*).
7. **Check the cron.** *Settings → Cron Jobs* should list `/api/cron/cleanup/` (daily). `vercel.json` also pins functions to Singapore (`sin1`); if your Vercel plan rejects that, set the function region to Singapore in *Settings → Functions* instead.

I tested everything against a local Postgres (PGlite, Postgres 17) and `next start`, not against live Supabase or Neon, so treat the first deploy as the real test. Two things to watch: the connection string must be the **pooled** one (the code already disables prepared statements for that), and Supabase's Vercel integration adds a `supa=...` parameter that the code strips.

## Reading submissions

For v1 the database dashboard is the inbox. There is no admin page.

```sql
-- Weekly review: new submissions from the last 7 days
select * from problem_submissions_new_this_week;

-- Everything still marked new
select created_at, locale, problem, who_has_it, current_workaround, category
from problem_submissions where status = 'new' order by created_at desc;

-- After reading them
update problem_submissions set status = 'reviewed' where status = 'new' and created_at < now() - interval '7 days';
```

Supabase's table editor can also filter, sort and export CSV, which is the easiest way to hand a batch to Trendy and Matty.

## PDPA and data handling (for founder / counsel review)

- **Retention:** 12 months. A daily Vercel Cron (`/api/cron/cleanup/`, secured by `CRON_SECRET`) deletes older rows. `site.config.ts` holds both `retentionMonths` and the wording shown to users; keep them in step. Manual run: `delete from problem_submissions where created_at < now() - interval '12 months';`
- **Cross-border transfer:** submissions are stored in Singapore, outside Thailand. The privacy policy must say so, along with what we collect, why, how long we keep it, who processes it (Vercel and the database provider), and how to ask for access, correction, deletion or withdrawal of consent. Counsel should confirm this against the PDPA.
- **Consent wording is not approved yet.** It is marked on the page and `consentReviewed` is `false`. Counsel should also check the rights line and the controller identity and contact details. After approval, set `consentReviewed: true`.
- **Free text:** the problem box can contain personal data about other people. The hint asks people not to, but it can't stop them.
- **Deleting one person's data** (when someone asks): verify they own the contact detail, then:

  ```sql
  delete from problem_submissions where lower(email) = lower('them@example.com');
  delete from problem_submissions where line_id = 'their-line-id';
  -- a nickname alone isn't unique; find the row first, then delete by id
  delete from problem_submissions where id = '...';
  ```

  Anonymous submissions can't be linked to a person, so they can't be looked up or deleted by request, which is worth saying in the privacy policy.

## Rules

- No invented content: no metrics, logos, testimonials, pricing or brand names. Nothing about the AI agent team.
- No secrets in the repo. `.env.local` is gitignored; `.env.example` lists the variable names only.
- Not deployed anywhere yet. Domain, hosting, database and accounts are the founder's call.
