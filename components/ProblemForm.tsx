"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Content } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export type ProblemFormConfig = {
  retention: string | null;
  storage: string | null;
  consentReviewed: boolean;
  contactEmail: string | null;
  privacyUrl: string | null;
  emailPlaceholder: string;
  privacyPlaceholder: string;
};

type Status = "idle" | "sending" | "success" | "error";
type ErrorKey = "problem" | "email" | "consent";
type Errors = Partial<Record<ErrorKey, string>>;

const fieldId: Record<ErrorKey, string> = {
  problem: "f-problem",
  email: "f-email",
  consent: "f-consent",
};

const endpoint = "/api/problem/";
const timeoutMs = 15_000;

export function ProblemForm({
  t,
  locale,
  homeHref,
  config,
}: {
  t: Content["problem"];
  locale: Locale;
  homeHref: string;
  config: ProblemFormConfig;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [draft, setDraft] = useState("");
  const [hasContact, setHasContact] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const failedRef = useRef<HTMLDivElement>(null);
  const thanksRef = useRef<HTMLHeadingElement>(null);
  const errorKeys = Object.keys(errors) as ErrorKey[];

  useEffect(() => {
    if (errorKeys.length) summaryRef.current?.focus();
  }, [errors]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (status === "success") thanksRef.current?.focus();
    if (status === "error") failedRef.current?.focus();
  }, [status]);

  function syncContact(event: FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget);
    setHasContact(["nickname", "email", "line_id"].some((name) => String(data.get(name) ?? "").trim()));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const data = new FormData(event.currentTarget);
    const text = (name: string) => String(data.get(name) ?? "").trim();

    // Honeypot: real people never see this field. Pretend it worked, send nothing.
    if (text("company_website")) {
      setStatus("success");
      return;
    }

    const problem = text("problem");
    const email = text("email");
    const hasContact = Boolean(text("nickname") || email || text("line_id"));
    const next: Errors = {};
    if (!problem) next.problem = t.errors.problemRequired;
    if (email && !/^\S+@\S+\.\S+$/.test(email)) next.email = t.errors.emailInvalid;
    if (hasContact && !data.get("consent")) next.consent = t.errors.consentRequired;
    setErrors(next);
    if (Object.keys(next).length) return;

    const payload = {
      problem,
      who: text("who"),
      today: text("today"),
      category: data.getAll("category"),
      nickname: text("nickname"),
      email,
      lineId: text("line_id"),
      consent: hasContact,
      language: locale,
    };

    setDraft(
      [problem, text("who") && `${t.who.label} ${text("who")}`, text("today") && `${t.today.label} ${text("today")}`]
        .filter(Boolean)
        .join("\n\n"),
    );

    setStatus("sending");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    } finally {
      clearTimeout(timer);
    }
  }

  if (status === "success") {
    return (
      <div className="thanks">
        <h2 ref={thanksRef} tabIndex={-1}>{t.success.title}</h2>
        <p className="lead">{t.success.body}</p>
        <div className="hero-cta">
          <a className="btn" href={homeHref}>{t.success.home}</a>
          <button type="button" className="btn btn--ghost" onClick={() => setStatus("idle")}>
            {t.success.again}
          </button>
        </div>
      </div>
    );
  }

  const mailto = `mailto:${config.contactEmail ?? "CONTACT_EMAIL_PLACEHOLDER"}?subject=${encodeURIComponent(
    t.failed.mailSubject,
  )}&body=${encodeURIComponent(draft)}`;
  const placeholder = (text: string) => <span className="ph">{text}</span>;
  const email = config.contactEmail ?? placeholder(config.emailPlaceholder);

  return (
    <form className="problem-form" onSubmit={onSubmit} onInput={syncContact} noValidate>
      {errorKeys.length > 0 && (
        <div className="notice" role="alert" tabIndex={-1} ref={summaryRef}>
          <strong>{t.errors.summary}</strong>
          <ul>
            {errorKeys.map((key) => (
              <li key={key}>
                <a href={`#${fieldId[key]}`}>{errors[key]}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {status === "error" && (
        <div className="notice" role="alert" tabIndex={-1} ref={failedRef}>
          <strong>{t.failed.title}</strong>
          <p>{t.failed.body}</p>
          <a className="btn btn--ghost" href={mailto}>{t.failed.mailto}</a>
        </div>
      )}

      <div className="field">
        <label htmlFor="f-problem">{t.problem.label}</label>
        <p className="hint" id="h-problem">{t.problem.hint}</p>
        <textarea
          className="input textarea"
          id="f-problem"
          name="problem"
          rows={6}
          maxLength={2000}
          required
          aria-required="true"
          aria-invalid={errors.problem ? "true" : undefined}
          aria-describedby={`h-problem${errors.problem ? " e-problem" : ""}`}
        />
        {errors.problem && <p className="error" id="e-problem">{errors.problem}</p>}
      </div>

      <div className="field">
        <label htmlFor="f-who">{t.who.label}</label>
        <p className="hint" id="h-who">{t.who.hint}</p>
        <input className="input" id="f-who" name="who" type="text" maxLength={200} aria-describedby="h-who" />
      </div>

      <div className="field">
        <label htmlFor="f-today">{t.today.label}</label>
        <p className="hint" id="h-today">{t.today.hint}</p>
        <input className="input" id="f-today" name="today" type="text" maxLength={300} aria-describedby="h-today" />
      </div>

      <fieldset className="field">
        <legend>{t.category.label}</legend>
        <p className="hint">{t.category.hint}</p>
        <div className="chips">
          {t.category.options.map((option) => (
            <label className="choice" key={option.value}>
              <input type="checkbox" name="category" value={option.value} />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend>{t.follow.label}</legend>
        <p className="hint">{t.follow.hint}</p>
        <div className="follow-grid">
          <div className="field">
            <label htmlFor="f-nickname">{t.follow.nickname}</label>
            <input className="input" id="f-nickname" name="nickname" type="text" maxLength={80} autoComplete="nickname" />
          </div>
          <div className="field">
            <label htmlFor="f-email">{t.follow.email}</label>
            <input
              className="input"
              id="f-email"
              name="email"
              type="email"
              inputMode="email"
              maxLength={200}
              autoComplete="email"
              aria-invalid={errors.email ? "true" : undefined}
              aria-describedby={errors.email ? "e-email" : undefined}
            />
            {errors.email && <p className="error" id="e-email">{errors.email}</p>}
          </div>
          <div className="field">
            <label htmlFor="f-line">{t.follow.line}</label>
            <input className="input" id="f-line" name="line_id" type="text" maxLength={80} autoComplete="off" autoCapitalize="none" />
          </div>
        </div>
      </fieldset>

      <div className="consent">
        {(hasContact || errors.consent) && (
          <div className="consent-check">
            <label className="check">
              <input
                id="f-consent"
                type="checkbox"
                name="consent"
                value="yes"
                aria-invalid={errors.consent ? "true" : undefined}
                aria-describedby={`h-consent${errors.consent ? " e-consent" : ""}`}
              />
              <span>{t.consent.label}</span>
            </label>
            <p className="hint" id="h-consent">{t.consent.hint}</p>
            {errors.consent && <p className="error" id="e-consent">{errors.consent}</p>}
          </div>
        )}
        <dl className="consent-terms">
          <div><dt>{t.consent.collectTitle}</dt><dd>{t.consent.collect}</dd></div>
          <div><dt>{t.consent.whyTitle}</dt><dd>{t.consent.why}</dd></div>
          <div>
            <dt>{t.consent.keepTitle}</dt>
            <dd>
              {t.consent.keepBefore}
              {config.retention ?? placeholder(t.consent.retentionPlaceholder)}
              {t.consent.keepAfter}
            </dd>
          </div>
          <div>
            <dt>{t.consent.whereTitle}</dt>
            <dd>{config.storage ?? placeholder(t.consent.storagePlaceholder)}</dd>
          </div>
          <div>
            <dt>{t.consent.rightsTitle}</dt>
            <dd>{t.consent.rightsBefore}{email}{t.consent.rightsAfter}</dd>
          </div>
        </dl>
        <p className="small">
          <a href={config.privacyUrl ?? "#"}>
            {t.consent.privacy}
            {config.privacyUrl ? "" : ` ${config.privacyPlaceholder}`}
          </a>
        </p>
        {!config.consentReviewed && <p className="small"><span className="ph">{t.consent.reviewNote}</span></p>}
      </div>

      {/* Honeypot: off-screen, skipped by keyboard and screen readers. */}
      <div className="hp" aria-hidden="true">
        <label>
          Website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="form-actions">
        <button className="btn" type="submit" disabled={status === "sending"}>
          {status === "sending" ? t.sending : t.submit}
        </button>
      </div>
    </form>
  );
}
