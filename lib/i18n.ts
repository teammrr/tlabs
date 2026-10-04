export const locales = ["en", "th"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export type PageName = "" | "problem";

// English is served at "/", Thai at "/th/". Sub-pages: "/problem/", "/th/problem/".
export const localePath = (locale: Locale, page: PageName = "") =>
  `${locale === "en" ? "/" : "/th/"}${page ? `${page}/` : ""}`;
