import { siteConfig } from "@/site.config";
import { getContent } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import { SiteFooter } from "./SiteFooter";
import { SiteNav } from "./SiteNav";

export function Landing({ locale }: { locale: Locale }) {
  const t = getContent(locale);
  const { contactEmail, lineOaUrl, team } = siteConfig;

  return (
    <>
      <a className="skip" href="#main">{t.common.skip}</a>

      <SiteNav locale={locale} />

      <main id="main">
        <section className="hero" id="top">
          <div className="wrap">
            <div className="hero-copy">
              <h1>{t.hero.title}</h1>
              <p className="lead">{t.hero.lead}</p>
              <div className="hero-cta">
                <a className="btn" href="#contact">{t.hero.primary}</a>
                <a className="btn btn--ghost" href="#what-we-do">{t.hero.secondary}</a>
              </div>
            </div>
            <div className="blob" aria-hidden="true" />
          </div>
        </section>

        <hr className="rule-thick" />

        <section id="what-we-do">
          <div className="wrap split">
            <h2>{t.what.title}</h2>
            <div className="rows">
              {t.what.items.map((item) => (
                <div key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="explore" id="exploring">
          <div className="wrap">
            <div className="explore-head">
              <h2>{t.exploring.title}</h2>
              <p className="lead">{t.exploring.lead}</p>
            </div>
            <div className="projects">
              {t.exploring.projects.map((project) => (
                <article className="card" key={project.id}>
                  <div className="picon" role="img" aria-label={project.iconAlt}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/${project.id}-icon.svg`} width={88} height={88} alt="" aria-hidden="true" />
                  </div>
                  <span className="chip">{t.exploring.chip}</span>
                  <div className="pname">
                    <h3>{project.name}</h3>
                    {project.altName ? <span className="alt" lang="th">{project.altName}</span> : null}
                  </div>
                  <p>{project.body}</p>
                </article>
              ))}
            </div>
            <p className="explore-note">
              {t.exploring.noteBefore}
              <a href={localePath(locale, "problem")}>{t.exploring.noteLink}</a>
              {t.exploring.noteAfter}
            </p>
          </div>
        </section>

        <section id="how-we-work">
          <div className="wrap">
            <h2>{t.how.title}</h2>
            <div className="values">
              {t.how.items.map((item) => (
                <div key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="rule-hair" />

        <section id="team">
          <div className="wrap">
            <h2>{t.team.title}</h2>
            {team.length === 0 ? (
              <>
                <div className="team-row">
                  <div className="ph-portrait" role="img" aria-label={t.team.photoAlt} />
                  <div className="ph-meta">
                    <strong className="ph">{t.team.namePlaceholder}</strong>
                    <span className="small ph">{t.team.rolePlaceholder}</span>
                  </div>
                </div>
                <p className="small team-note">{t.team.soon}</p>
              </>
            ) : (
              <ul className="team-list">
                {team.map((person) => (
                  <li key={person.name.en}>
                    <strong>{person.name[locale]}</strong>
                    <span className="small">{person.role[locale]}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="on-ink contact" id="contact">
          <div className="contact-blob" aria-hidden="true" />
          <div className="wrap">
            <h2>{t.contact.title}</h2>
            <p className="lead">{t.contact.lead}</p>
            <div className="hero-cta">
              <a className="btn" href={`mailto:${contactEmail ?? "CONTACT_EMAIL_PLACEHOLDER"}`}>
                {t.contact.button}
              </a>
              <a className="btn btn--ghost" href={localePath(locale, "problem")}>
                {t.contact.problemCta}
              </a>
              {lineOaUrl && (
                <a className="btn btn--ghost" href={lineOaUrl} rel="noopener">
                  {t.contact.line}
                </a>
              )}
            </div>
            {contactEmail ? (
              <a className="mail" href={`mailto:${contactEmail}`}>{contactEmail}</a>
            ) : (
              <p className="small"><span className="ph">{t.contact.emailPlaceholder}</span></p>
            )}
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}
