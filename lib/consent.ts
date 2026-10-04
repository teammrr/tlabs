import "server-only";
import { createHash } from "node:crypto";
import { siteConfig } from "@/site.config";
import { getContent } from "./content";
import type { Locale } from "./i18n";

// The version changes automatically whenever the consent wording, the retention
// period or the storage location shown to the user changes. It is stored with
// every consented submission. To see exactly what a version said, check out the
// repo at the time of that submission (git history of content/*.json, site.config.ts).
export function consentTextVersion(locale: Locale): string {
  const { dataRetention, storageLocation } = siteConfig.problemForm;
  const shown = {
    consent: getContent(locale).problem.consent,
    retention: dataRetention?.[locale] ?? null,
    storage: storageLocation?.[locale] ?? null,
  };
  const hash = createHash("sha256").update(JSON.stringify(shown)).digest("hex").slice(0, 10);
  return `${locale}-${hash}`;
}
