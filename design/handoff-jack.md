# Handoff: TLab website, Anne to Jack

Read `design-spec.md` (tokens, layout, copy) and open `mockup.html` (serve via `python3 -m http.server` in this folder; file:// is blocked in some browsers). The mockup is the visual source of truth; the CSS custom properties in it map one-to-one to the tokens in the spec.

## Heads-up on the existing project
`/Users/suteemonv/Documents/tlab/website/` already has an `AGENTS.md` saying this Next.js version has breaking changes and to read `node_modules/next/dist/docs/` before writing code. Follow that.

## Build notes
1. **Single page, static.** No backend needed for v1. Contact is a `mailto:` link.
2. **Bilingual with real routes/URLs** (e.g. `/en` and `/th`) so each language is indexable and shareable in LINE. The mockup keeps both languages in the DOM and toggles with `html[data-lang]` only for prototyping; don't ship that. **Default language is English; Thai is the alternate** (founder decision). Serve English at `/` (or `/en`) and Thai at `/th`; toggle order is EN | ไทย. Set `<html lang>` correctly and add `hreflang` alternates.
3. **Fonts:** Fraunces (variable: wght 500-700, SOFT 50), Noto Serif Thai (500-700), IBM Plex Sans Thai (400/500/600). Self-host via the framework's font optimization, subset Thai + Latin, `display: swap`. Keep the display stack `Fraunces, "Noto Serif Thai", serif` so Thai glyphs fall back per glyph.
4. **Thai typography:** letter-spacing 0 for Thai; line-heights per spec; `text-wrap: balance` on headings. Check headline line breaks on a real phone and add `<wbr>`/no-break joins where a Thai word splits badly.
5. **LINE in-app browser:** test there and in Safari iOS / Chrome Android. Known risks: `backdrop-filter` on the nav (fall back to solid paper), the fixed grain overlay with `mix-blend-mode` (fall back to a static background image if scrolling janks), `100vh` quirks. Keep total JS minimal and LCP under ~2.5s on mobile 4G (targets to verify, not measured yet).
6. **Placeholders must stay visibly marked until filled:** contact email (`CONTACT_EMAIL_PLACEHOLDER`, `[email placeholder]`), legal entity/registration, privacy policy link, team name/role/photo. Use one config file so the founder can fill them in one place. Don't ship with placeholders live.
7. **Don't add anything we haven't been given:** no metrics, logos, testimonials, "trusted by", awards, pricing, brand names or product details. Team section stays a placeholder; nothing about the AI agent team.
8. **Accessibility:** keep AA contrast (see spec table), visible focus styles, skip link, `aria-pressed` on the language toggle, `prefers-reduced-motion` and `prefers-reduced-data` handling, touch targets at least 44px. Run an automated check (axe/Lighthouse) before sign-off.
9. **Privacy/PDPA:** no analytics or cookies in v1 unless the founder asks; if added, include a consent banner and a real privacy notice first.
10. **SEO/social:** title "TLab", Thai + English meta description, OG image placeholder (needs a design from me once the founder picks the lead line).
11. **Motion:** the hero blob morph is the only ambient animation. Don't add scroll-reveal effects.

## Tone update (from the founder via Top)
The site voice is now chill: relaxed, warm, a bit playful, a small crew that enjoys making things. Hero headline is "We build software for fun." (TH: เราทำซอฟต์แวร์เพราะมันสนุก). All final copy lives in `design-spec.md` section 5 and is already in `mockup.html`; use it verbatim and keep it in one content file per language. The visual system is unchanged; I only added small hover moments (logo dot spin, hero blob swell, card tilt). Hard promises such as "PDPA built in" were removed; do not add claims, metrics or clients.

## Open decisions (waiting on founder via Top)
Lead line choice (A/B/C) and Thai headline, real contact email, LINE OA link, legal entity + privacy policy, team visibility, optional moss accent, domain/logo. Thai copy needs a native-speaker review.


## Update: "What we're building" section (replaces the vague "What we're poking at" card)
The founder wants the site to show our two projects. In `mockup.html` the section (id `exploring`, anchor unchanged) now has a lead line and two cards: **Maa Laew (มาแล้ว)** and **Toh (โต๊ะ)**, both with the chip "In development" / "กำลังพัฒนา". Copy is in `design-spec.md` (section 5 "What we're building") and in the mockup; use it verbatim in `content/en.json` and `content/th.json`, and mark the Thai for the founder's native read.
- Layout: two cards side by side from 760px, stacked below; the second card has mirrored corners and a mirrored hover tilt.
- Marks: monochrome ink SVGs in a pebble-shaped outline (inline in the mockup; Maa Laew = pebble loop with bead, Toh = solid disc). Decorative, `aria-hidden`; the project name in the heading is the accessible name.
- **No links** to the prototypes (they only run locally). Cards are not interactive.
- **Public-copy rules:** no launch dates, user numbers, pricing, partner or brand names, "trusted by" or "PDPA compliant". Keep the status "In development". Toh copy uses only "table", "friends", "deposit"; never add nightlife, club, bar, party, drink or alcohol words or imagery anywhere on the site (Alcohol Control Act). Maa Laew copy says "training clubs", never HYROX.
- Section heading is renamed to "What we're building" / "สิ่งที่เรากำลังทำ". Update the site `<title>`/OG text only if they mention the old section.
