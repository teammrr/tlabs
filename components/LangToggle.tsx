import { localePath, type Locale, type PageName } from "@/lib/i18n";

const options: { locale: Locale; label: string }[] = [
  { locale: "en", label: "EN" },
  { locale: "th", label: "ไทย" },
];

// Real links, so each language is a crawlable, shareable URL. Order: EN | ไทย.
// aria-current (not aria-pressed): these navigate, they don't toggle state.
export function LangToggle({
  current,
  label,
  page = "",
}: {
  current: Locale;
  label: string;
  page?: PageName;
}) {
  return (
    <div className="lang" role="group" aria-label={label}>
      {options.map(({ locale, label: text }) => (
        <a
          key={locale}
          href={localePath(locale, page)}
          lang={locale}
          hrefLang={locale}
          aria-current={locale === current ? "true" : undefined}
        >
          {text}
        </a>
      ))}
    </div>
  );
}
