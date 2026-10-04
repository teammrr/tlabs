// The one place to fill in launch details. `null` / empty = still a placeholder,
// shown visibly on the page. Run `npm run check:launch` before going live.
// None of these are secrets; all of them end up in the public HTML.

export const siteConfig = {
  // Production origin, e.g. "https://tlab.example". Needed for canonical, OG and sitemap URLs.
  siteUrl: null as string | null,
  // e.g. "hello@tlab.example"
  contactEmail: null as string | null,
  // Optional LINE Official Account URL. Leave null to hide the LINE button.
  lineOaUrl: null as string | null,
  // Legal entity name and registration number.
  legalEntity: null as string | null,
  // Link to the PDPA privacy policy.
  privacyPolicyUrl: null as string | null,
  // Leave empty to show the team placeholder. Add people once the founder confirms.
  team: [] as { name: { en: string; th: string }; role: { en: string; th: string } }[],

  // "Got a problem?" form. Submissions go to POST /api/problem/ and are stored in Postgres
  // (see README, "Founder setup"). The connection string lives in env vars, never here.
  problemForm: {
    // Shown in the PDPA consent text. Founder / counsel decide both.
    // Keep `retentionMonths` and the wording in `dataRetention` in sync.
    // A daily Vercel Cron (/api/cron/cleanup/) deletes rows older than retentionMonths.
    retentionMonths: 12,
    dataRetention: { en: "12 months", th: "12 เดือน" } as { en: string; th: string } | null,
    // Founder chose a Singapore-region database: say so, and mention it in the privacy policy.
    storageLocation: {
      en: "In a database in Singapore (Asia-Pacific).",
      th: "ในฐานข้อมูลที่สิงคโปร์ (เอเชียแปซิฟิก)",
    } as { en: string; th: string } | null,
    // Flip to true only after the founder or counsel has approved the consent copy
    // in content/*.json (problem.consent). Until then it is marked on the page.
    consentReviewed: false,
  },
};
