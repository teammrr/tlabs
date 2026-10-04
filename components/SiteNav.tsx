import { getContent } from "@/lib/content";
import { localePath, type Locale, type PageName } from "@/lib/i18n";
import { LangToggle } from "./LangToggle";

// `page` = the page we're on, so the language toggle stays on the same page.
export function SiteNav({ locale, page = "" }: { locale: Locale; page?: PageName }) {
  const t = getContent(locale);
  const home = localePath(locale);
  return (
    <header className="nav">
      <div className="nav-inner">
        <a className="logo" href={home} aria-label="TLab">
          <i aria-hidden="true" />TLab
        </a>
        <div className="nav-actions">
          <a
            className="nav-link"
            href={localePath(locale, "problem")}
            aria-current={page === "problem" ? "page" : undefined}
          >
            {t.nav.problem}
          </a>
          <LangToggle current={locale} page={page} label={t.nav.languageLabel} />
          <a className="btn" href={page === "" ? "#contact" : `${home}#contact`}>
            {t.nav.contact}
          </a>
        </div>
      </div>
    </header>
  );
}
