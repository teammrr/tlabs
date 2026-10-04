import en from "@/content/en.json";
import th from "@/content/th.json";
import type { Locale } from "./i18n";

export type Content = typeof en;

// `satisfies` makes the build fail if th.json drifts from en.json.
const dictionaries = { en, th } satisfies Record<Locale, Content>;

export const getContent = (locale: Locale): Content => dictionaries[locale];
