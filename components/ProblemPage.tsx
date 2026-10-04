import { siteConfig } from "@/site.config";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { ProblemForm } from "./ProblemForm";
import { SiteFooter } from "./SiteFooter";
import { SiteNav } from "./SiteNav";

export function ProblemPage({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const t = content.problem;
  // Only the Thai copy carries a "native-speaker review pending" marker.
  const reviewNote = (t as { draftNote?: string }).draftNote;
  const { problemForm, contactEmail, privacyPolicyUrl } = siteConfig;

  return (
    <>
      <a className="skip" href="#main">{content.common.skip}</a>
      <SiteNav locale={locale} page="problem" />
      <main id="main">
        <section className="hero">
          <div className="wrap">
            <div className="hero-copy">
              <h1>{t.title}</h1>
              <p className="lead">{t.lead}</p>
              {reviewNote && <p className="small"><span className="ph">{reviewNote}</span></p>}
            </div>
          </div>
        </section>

        <hr className="rule-thick" />

        <section className="form-section">
          <div className="wrap">
            <ProblemForm
              t={t}
              locale={locale}
              homeHref={localePath(locale)}
              config={{
                retention: problemForm.dataRetention?.[locale] ?? null,
                storage: problemForm.storageLocation?.[locale] ?? null,
                consentReviewed: problemForm.consentReviewed,
                contactEmail,
                privacyUrl: privacyPolicyUrl,
                emailPlaceholder: content.contact.emailPlaceholder,
                privacyPlaceholder: content.common.placeholder,
              }}
            />
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
