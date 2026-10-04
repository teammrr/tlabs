# TLab website: design spec (v1, single-page landing)

Status: draft for founder review. **Default language: English. Alternate language: Thai (via toggle).** Visual reference: `mockup.html` (serve it over http; open with `python3 -m http.server` in this folder).

## 1. Style source and how the blend was resolved

Read directly from designprompts.dev/monochrome and /organic (the full prompts, not the summaries).

The two styles contradict each other on the surface:

| | Monochrome says | Organic says |
|---|---|---|
| Color | Pure black/white, "no other colors. Ever." | Moss, terracotta, sand |
| Corners | 0px everywhere | Pills, blobs, asymmetric radii |
| Shadows | None | Soft, color-tinted |
| Texture | Hairlines, grid, noise | Paper grain at 3-4%, multiply |
| Type | Playfair + serif body + mono labels | Fraunces + rounded sans |
| Motion | Not specified | Gentle lift/scale, micro-rotation |

**Resolution: "rulers and stones."** Straight lines are rulers; shapes are stones.
- From **Monochrome**: strictly black-and-ink palette with no accent color, thick and hairline rules as the structural system, color inversion (ink section) for emphasis, no shadows, oversized serif headlines, dramatic whitespace, row-and-rule layouts instead of card grids.
- From **Organic**: blob shapes (one ink blob in the hero, one asymmetric card), pill buttons/nav, paper grain, a warm off-white instead of pure white, gentle hover motion, wabi-sabi imperfection (rotation, asymmetry).
- **Dropped:** moss/terracotta (violates "no accent"), tinted shadows (we use none), JetBrains Mono labels (no Thai glyphs, and mono small-caps labels read as a template tell).
- **Optional accent (off by default):** Moss `#5D7052` (5.0:1 on paper, AA) is the only color I'd allow, for link hover or focus only. Recommend leaving it out for v1.

The memorable element is the single large ink blob in the hero, slowly morphing. Everything else stays quiet.

## 2. Design tokens

### Color (all pairs checked for WCAG AA; ratios are approximate)
| Token | Hex | Use | Contrast |
|---|---|---|---|
| `paper` | `#FAF8F2` | page background | |
| `stone` | `#F0ECE2` | "Exploring" section background | |
| `ink` | `#17160F` | text, rules, blob, buttons, inverted sections | 16:1 on paper |
| `ink-soft` | `#5A574E` | secondary text | ~6.8:1 on paper |
| `rule-light` | `#D9D4C7` | decorative hairlines only, never text | n/a |
| `paper-soft` | `#B8B3A6` | secondary text on ink | ~8:1 on ink |

Warm-tinted black/white is deliberate (Organic's "rice paper" warmth) and is the one place the blend departs from Monochrome's pure `#000/#FFF`.

### Typography
| Role | Family | Notes |
|---|---|---|
| Display (EN + TH) | **Fraunces** (SOFT 50, opsz auto) + **Noto Serif Thai** | Fraunces has no Thai glyphs, so the stack falls back per glyph to Noto Serif Thai. Latin inside Thai text stays Fraunces. Weight 600. |
| Body, UI (EN + TH) | **IBM Plex Sans Thai** | Includes Latin. Weights 400/500/600. Clean at small mobile sizes. |

Scale (fluid, mobile to desktop):
| Step | EN | TH | Line-height EN / TH |
|---|---|---|---|
| h1 | `clamp(2.4rem, 9.5vw, 5.75rem)` | `clamp(2.1rem, 8.2vw, 4.75rem)` | 1.04 / **1.3** |
| h2 | `clamp(1.75rem, 5vw, 3.25rem)` | `clamp(1.6rem, 4.6vw, 2.9rem)` | 1.12 / **1.38** |
| h3 | `clamp(1.25rem, 2.4vw, 1.6rem)` | same | 1.25 / **1.45** |
| lead | `clamp(1.0625rem, 2.4vw, 1.3rem)` | same | 1.75 / 1.8 |
| body | 1rem | 1rem | 1.75 / 1.8 |
| small | .875rem | .875rem | |

Thai rules (non-negotiable):
- **Letter-spacing `0` for Thai.** Negative tracking (used on EN display) breaks Thai vowel/tone stacking.
- Thai leading is 1.3-1.45 even on display sizes so tone marks never collide.
- Use `text-wrap: balance` on headings and `pretty` on paragraphs. Thai has no spaces, so a browser can split a word like "คนไทย" across lines; for tricky headlines Jack should insert `<wbr>` / non-breaking joins at phrase boundaries after checking on a real phone.
- Sentence case everywhere. No all-caps labels, no mono labels.

### Spacing and layout
- Gutter 20px mobile; content max-width 1160px.
- Section vertical padding `clamp(72px, 12vw, 160px)`.
- Split layout breakpoint at 900px (5fr/7fr). Three-up values at 800px.
- Touch targets minimum 44px (language toggle 40px inner + 2px padding, nav pill height 44px).

### Radii and shape
- Pills (`999px`): nav, buttons, chips, language toggle.
- Blob A `60% 40% 30% 70% / 60% 30% 70% 40%`, B `30% 70% 70% 30% / 30% 30% 70% 70%`, C `45% 55% 40% 60% / 65% 35% 65% 35%`.
- Card shape: `4rem 1.5rem 3rem 1.5rem` (one asymmetric card; do not repeat it across every element).
- Rules: 4px ink between hero and body, 1px ink for row dividers, 1px `rule-light` for quiet dividers. Never radius on rules.

### Shadows
None. Depth comes from inversion, rule weight, scale and the blob. (Both styles' shadow rules are dropped on purpose.)

### Texture
- Paper grain: one fixed `body::before` layer, SVG `feTurbulence` data-URI, `opacity: .05`, `mix-blend-mode: multiply`, `pointer-events: none`. Static image, never animated. Disabled under `prefers-reduced-data`.
- Test on a low-end Android in LINE's browser; if the fixed blend layer scrolls poorly, drop it to a static background-image on `body` instead.

### Motion
- One orchestrated moment: the hero blob morphs between blob shapes (22s, ease-in-out, alternate, plus an 8° rotation). No scroll-in animations on sections.
- Interaction motion only: buttons lift 2px and scale 1.03 on hover (scale .97 on press); the project cards lift 4px and tilt 1deg on hover (opposite directions). 350-500ms, cubic-bezier(.2,.8,.2,1).
- `prefers-reduced-motion: reduce` disables all animation and transitions.

### Focus and accessibility
- `:focus-visible`: 2px ink outline, 4px offset (paper outline on ink sections).
- Skip link, language buttons with `aria-pressed`, `lang` attribute swapped on `<html>`, decorative blobs `aria-hidden`.

## 3. Layout per section

Mobile first. Desktop notes follow.

**Nav.** Sticky floating pill, 12px from top, 1px ink border, paper at 88% with backdrop blur (no shadow). Left: blob dot + "TLab" wordmark. Right: TH/EN toggle, "Say hi" button (hidden under 480px; the toggle stays).

**Hero.** Mobile: headline, lead (max 36ch), two buttons (primary "Get in touch", ghost "What we do"), then the ink blob below, bleeding off the right edge. Desktop (900+): 7fr/5fr grid, headline left, blob right bleeding off edge, vertically centered. Left-aligned.

**4px ink rule.**

**What we do.** Mobile: h2 statement, then three rows. Desktop: 5fr/7fr split, statement left, rows right. Each row: h3 (left) + paragraph (right on 640+), separated by 1px ink top borders. These are rows, not cards. Items are not a sequence, so there are no numbers.

**What we're building (stone background, id `exploring`).** Replaces "What we're poking at". h2 and a one-line lead ("Two things on our bench right now. Both are in development, with nothing to try yet."), then **two project cards** side by side from 760px (stacked on mobile), max two, no links. Each card: a 72x68px pebble-outlined mark (1px ink outline in a blob shape; the second card uses the mirrored blob and mirrored card corners for asymmetry), the "In development" chip, the project name in the display face (with the Thai name beside it in Thai mode only), and one sentence. The marks are **monochrome ink**: the site has no accent colors, and putting Maa Laew's moss or Toh's ice on this page would add the only colors on it. Maa Laew's mark is the pebble loop with its bead; Toh's is a solid disc (the tabletop, matching its wordmark's "o"). Below: the text link "Got a problem we should look at? Tell us." to the contact section. The cards are not links: the prototypes only run locally.

**How we work.** h2, then three columns (stacked on mobile) with 1px ink top rule; 1px `rule-light` vertical dividers on desktop.

**1px quiet rule.**

**The crew (placeholder).** h2, a dashed blob portrait placeholder, `[Name]` / `[Role]` with dashed outline marking them as unfilled, and "Team introductions coming soon." Nothing about the AI agent team (pending founder's decision via Top).

**Contact (inverted ink).** h2 "Say hi", lead paragraph, primary button "Say hi by email" (`mailto:` placeholder), the address as `[email placeholder]`, faint paper-colored blob in the corner at 7% opacity. Optional LINE OA ghost button is commented out in the markup.

**Footer (ink, continued).** `© 2026 TLab`, `[Legal entity name / registration no.]` placeholder, privacy policy link placeholder.

## 4. Component list
1. `SiteNav` (logo, `LangToggle`, `Button`)
2. `LangToggle` (pressed-state pill group)
3. `Button` (primary, ghost; both themes: paper and ink)
4. `Hero` (headline, lead, CTAs, `Blob`)
5. `Blob` (shape variant prop A/B/C, optional morph animation, `aria-hidden`)
6. `RuleRow` (title + body, used in What we do)
7. `ExploreCard` (status chip, title, body)
8. `StatusChip`
9. `ValueColumn`
10. `TeamPlaceholder` (portrait blob, name, role)
11. `ContactBand` (inverted section)
12. `Footer`
13. `GrainOverlay`

## 5. Copy (EN default / TH alternate)

**Voice:** relaxed, warm, a bit playful. A small crew that enjoys making things, not a startup pitch. Short sentences, plain words, sentence case. Playful in micro-copy and hover moments, but nothing invented: no metrics, clients, claims or hard promises. Thai matches the casual register (founder to review).

Hero H1 (founder-set):
- EN: We build software for fun.
- TH (primary): เราทำซอฟต์แวร์เพราะมันสนุก
- TH alternates: ทำซอฟต์แวร์เล่น ๆ แต่จริงจังกับปัญหา / เราชอบทำซอฟต์แวร์ แล้วก็ชอบแก้ปัญหาด้วย

Hero lead (grounds the fun in what we actually do). Mockup uses A.
- A, EN: TLab is a small Thai crew. We make software for the fun of it, and to fix the everyday Thai problems nobody has gotten around to yet.
- A, TH: TLab เป็นทีมเล็ก ๆ ของคนไทย เราทำซอฟต์แวร์เพราะสนุก และเพื่อแก้ปัญหาจุกจิกในชีวิตคนไทยที่ยังไม่มีใครมีเวลาไปแก้
- B, EN: A small Thai team making useful things. We start with the problems closest to home.
- B, TH: ทีมเล็ก ๆ ของคนไทยที่ชอบทำของที่มีประโยชน์ เริ่มจากปัญหาใกล้ตัวที่สุด
- C, EN: Fun is how we work. Fixing real Thai problems is why.
- C, TH: ความสนุกคือวิธีทำงาน การแก้ปัญหาจริงของคนไทยคือเหตุผล

Buttons / nav: "Say hi" / ทักทายกัน (hero primary); "What we're up to" / เราทำอะไรอยู่ (ghost); nav "Say hi" / ทักมาได้.

What we do
- H2: "We find everyday problems and build small things to fix them." / เราหาปัญหาจุกจิกในชีวิตประจำวัน แล้วลงมือสร้างของเล็ก ๆ มาแก้
- Spot the gap / มองหาช่องว่าง: "We look for corners of Thai life the big platforms skip, especially the ones starting to grow." / เรามองหามุมเล็ก ๆ ในชีวิตคนไทยที่แพลตฟอร์มใหญ่ยังไม่สนใจ โดยเฉพาะมุมที่เริ่มโตขึ้น
- One thing at a time / ทีละอย่าง: "One simple product at a time. We ship early, listen, and tweak." / ทำของง่าย ๆ ทีละชิ้น ปล่อยไว ฟังคนใช้ แล้วค่อยปรับ
- Made for here / ทำมาเพื่อที่นี่: "Thai language, LINE, PromptPay. The stuff people here actually use." / ภาษาไทย LINE PromptPay ของที่คนที่นี่ใช้กันจริง ๆ

What we're building / สิ่งที่เรากำลังทำ (renamed from "What we're poking at"; keep the `#exploring` anchor)
- Lead: "Two things on our bench right now. Both are in development, with nothing to try yet." / สองอย่างที่เรากำลังลงมือทำอยู่ตอนนี้ ทั้งสองอย่างยังอยู่ระหว่างพัฒนา ยังไม่เปิดให้ลองใช้
- Chip (both): In development / กำลังพัฒนา
- Maa Laew (มาแล้ว): "Show up, check in, keep the streak. Run and training clubs in Bangkok, all in one calendar." / มาวิ่ง เช็กอิน รักษาสตรีค คลับวิ่งและคลับเทรนนิ่งในกรุงเทพฯ รวมอยู่ในปฏิทินเดียว
- Toh (โต๊ะ): "Book a table with friends and split the deposit. The table's yours when everyone's paid." / จองโต๊ะกับเพื่อนและหารมัดจำกัน เมื่อทุกคนจ่ายครบ โต๊ะก็เป็นของพวกคุณ
- Link: "Got a problem we should look at? Tell us." / มีปัญหาที่เราควรดูไหม? เล่าให้ฟังหน่อย
Public-copy rules for this section: no launch dates, user numbers, pricing, partner or brand names, "trusted by" or "PDPA compliant"; status stays "In development"; no links to the prototypes. Toh is described only as group table booking and split payment (no nightlife, club, bar, party, drink or alcohol words or imagery, per the Alcohol Control Act); Maa Laew says "training clubs", never HYROX. Thai copy for these cards is my draft and needs the founder's native read.

How we like to work / เราชอบทำงานแบบนี้
- Talk first / คุยก่อน: "We chat with the people who live the problem before writing any code." / เราคุยกับคนที่เจอปัญหาจริงก่อนเขียนโค้ดสักบรรทัด
- Stay small / เล็กแต่ไว: "If a feature doesn't help the main thing, it can wait." / ฟีเจอร์ไหนไม่ช่วยเรื่องหลัก ก็รอก่อน
- Keep it plain / พูดกันตรง ๆ: "Clear prices, no jargon. We take your data seriously (PDPA, done properly)." / ราคาชัด ไม่ใช้ศัพท์ยาก เราจริงจังกับข้อมูลของคุณ (PDPA ทำให้ถูกต้อง)
  (Softened from "PDPA built in". If the founder or counsel is uneasy even with this, drop the parenthetical.)

The crew / ทีมของเรา: "Introductions coming soon." / เร็ว ๆ นี้จะมาแนะนำตัว (placeholder only; AI team hidden)

Say hi / ทักมาได้เลย
- "Whether you run a brand, a community or a team, or you're just curious, drop us a line. We like meeting new people." / จะเป็นแบรนด์ คอมมูนิตี้ ทีมงาน นักลงทุน หรือแค่อยากรู้จักกัน ส่งข้อความมาได้เลย เราชอบเจอคนใหม่ ๆ
- Button: "Say hi by email" / ทักมาทางอีเมล

Footer: © 2026 TLab · Made in Thailand / ทำที่ประเทศไทย · [Legal entity name / registration no.] · Privacy policy (placeholder)

Playful hover moments (visual system unchanged): the nav blob dot spins and morphs on hover, the hero blob swells slightly, the exploring card tilts -1deg. Still no scroll-reveal animation, no shadows.

Thai is the alternate language and still needs a native-speaker read before launch. Toggle order is EN | ไทย, with EN selected by default.

## 6. Open items for the founder
1. Name: using **TLab** (CLAUDE.md), not "TLabs".
2. Hero headline is set: "We build software for fun." Pick the lead line (A, B or C) and a Thai headline (primary or alternates).
3. Contact email address; optional LINE OA URL.
4. Legal entity name/registration number and a privacy policy (PDPA) before launch.
5. Whether to show the AI agent team: nothing shown for now.
6. Whether to allow one muted moss accent (recommend no).
7. Domain and logo: the wordmark is plain "TLab" text in Fraunces with a small blob dot; there is no real logo yet.
8. The softened line "We take your data seriously (PDPA, done properly)" is still a public claim; confirm with the founder, or drop it.
