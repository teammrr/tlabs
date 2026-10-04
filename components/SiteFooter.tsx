import { siteConfig } from "@/site.config";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getContent(locale);
  const { legalEntity, privacyPolicyUrl } = siteConfig;
  return (
    <footer className="on-ink">
      <div className="wrap foot">
        <span>© 2026 TLab · {t.footer.made}</span>
        {legalEntity ? (
          <span className="small">{legalEntity}</span>
        ) : (
          <span className="small ph">{t.footer.legalPlaceholder}</span>
        )}
        <a className="small" href={localePath(locale, "problem")}>{t.nav.problem}</a>
        <a className="small" href={privacyPolicyUrl ?? "#"}>
          {t.footer.privacy}
          {privacyPolicyUrl ? "" : ` ${t.common.placeholder}`}
        </a>
      </div>
    </footer>
  );
}
