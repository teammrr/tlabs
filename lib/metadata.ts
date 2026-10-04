import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { getContent } from "./content";
import { localePath, type Locale, type PageName } from "./i18n";

const fallbackOrigin = "http://localhost:3000";

export const siteOrigin = (siteConfig.siteUrl ?? fallbackOrigin).replace(/\/$/, "");

export function localeMetadata(
  locale: Locale,
  page: PageName = "",
  override?: { title: string; description: string },
): Metadata {
  const meta = override ?? getContent(locale).meta;
  const url = localePath(locale, page);
  return {
    metadataBase: new URL(siteOrigin),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: {
        en: localePath("en", page),
        th: localePath("th", page),
        "x-default": localePath("en", page),
      },
    },
    openGraph: {
      type: "website",
      siteName: "TLab",
      title: meta.title,
      description: meta.description,
      url,
      locale: locale === "en" ? "en_US" : "th_TH",
      alternateLocale: locale === "en" ? "th_TH" : "en_US",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "TLab: We build software for fun." }],
    },
    twitter: { card: "summary_large_image", images: ["/og-image.png"] },
  };
}
