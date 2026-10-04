// Fails while any launch placeholder is still unfilled.
// Not part of `npm run build`: the site builds with placeholders so we can preview it.
// Needs Node >= 22.18 (runs .ts without a flag).
import { readFileSync } from "node:fs";
import { siteConfig } from "../site.config.ts";

const missing = [];
for (const key of ["siteUrl", "contactEmail", "legalEntity", "privacyPolicyUrl"]) {
  if (!siteConfig[key]) missing.push(`site.config.ts: ${key}`);
}
if (siteConfig.team.length === 0) missing.push("site.config.ts: team (placeholder block still showing)");

const form = siteConfig.problemForm;
if (!form.dataRetention) missing.push("site.config.ts: problemForm.dataRetention (PDPA consent text)");
if (!form.storageLocation) missing.push("site.config.ts: problemForm.storageLocation (PDPA consent text)");
if (!form.consentReviewed) missing.push("site.config.ts: problemForm.consentReviewed (consent copy not yet approved)");

for (const lang of ["en", "th"]) {
  const content = JSON.parse(readFileSync(new URL(`../content/${lang}.json`, import.meta.url), "utf8"));
  if (content.problem?.draftNote) missing.push(`content/${lang}.json: problem.draftNote (review marker; remove once reviewed)`);
}

if (missing.length) {
  console.error("Not ready to launch. Still placeholders:");
  for (const item of missing) console.error(`  - ${item}`);
  process.exit(1);
}
console.log("No launch placeholders left.");
