import type { MetadataRoute } from "next";
import { locales, localePath, type PageName } from "@/lib/i18n";
import { siteOrigin } from "@/lib/metadata";

export const dynamic = "force-static";

const pages: PageName[] = ["", "problem"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) => {
    const languages = Object.fromEntries(
      locales.map((l) => [l, `${siteOrigin}${localePath(l, page)}`]),
    );
    return locales.map((l) => ({
      url: `${siteOrigin}${localePath(l, page)}`,
      alternates: { languages },
    }));
  });
}
