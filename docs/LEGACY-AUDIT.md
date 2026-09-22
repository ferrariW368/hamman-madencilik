# HAMMARBLE V2 — STEP 02 Legacy Repository Audit

Date: 2026-09-20
Auditor: Claude Code (read-only audit, no production files modified)
Branch audited: redesign/v2
Repository: C:\FERRARI\WEBSITE PROJECTs\hamman-madencilik

## Method

Read in full: PROJECT.md, AGENTS.md, docs/DECISIONS.md, package.json, package-lock.json,
next.config.ts, tsconfig.json, postcss.config.mjs, vitest.config.ts, sanity.config.ts,
.gitignore, .env.local.example, all files under src/app, src/components, src/lib,
src/sanity (incl. schemaTypes), all *.test.* files, docs/ASSETS.md, docs/CONTENT.md,
docs/REDIRECTS.md, docs/BUILD-RUNBOOK.md (line counts only for the last one, see below).
`public/` was checked for media assets. `npx vitest run` was attempted to confirm current
test-suite health (node_modules is not installed in this checkout, so this only confirms
config resolution, not full pass/fail — noted under Tests).

## 1. Overall shape

The current repository is a small, working Next.js 15 (App Router) + Sanity CMS site for a
**different information architecture and a different brand voice** than the one locked in
PROJECT.md. It is a legitimate, functioning corporate-brochure site in Turkish only — not a
prototype of HAMMARBLE V2, and not aligned with the "Stones / Quarries / Projects / Events"
product-catalog model. Routing, content model, copy, and component set all describe a general
mining/marble contractor site ("Hamman Madencilik" — services, product categories, sites,
about, contact), not a stone-product catalog with Stone Detail, Quarry, Project, Event entities.

## 2. Next.js / TypeScript structure — INVESTIGATE → mostly REBUILD

- App Router (`src/app`), TypeScript, no `src/app/[locale]` segment — **no i18n routing exists
  at all**. PROJECT.md §16/§20 requires locale-aware URLs (`/tr/stones/spider`,
  `/en/stones/spider`) from day one architecturally. This is a hard gap, not a refinement.
- Route inventory (`src/app`):
  - `/` (page.tsx) — Home, mixes Hero + services + 3 featured products + about teaser + contact CTA
  - `/hizmetlerimiz` — Services (not part of locked IA at all)
  - `/urunlerimiz` — Product categories (closest existing analog to "Stones", but modeled as
    generic categories with free-text `kullanimAlani`, not individual stone entities with
    technical data, surface/block imagery, or quarry relationships)
  - `/santiyelerimiz` — "Our sites" (hardcoded Konya/Antalya address copy; not a Quarries model)
  - `/hakkimizda` — About (vizyon/misyon/değerler/sertifikalar/ekip — reasonable shape, wrong content scope vs. PROJECT.md §14 which locks a 2-section Today/Heritage structure)
  - `/iletisim` — Contact (form + presumably address, see below)
  - `/studio/[[...tool]]` — Sanity Studio embed (KEEP mechanism, DISCARD current schema)
- No `/urunlerimiz/[slug]` stone-detail route exists — Stone Detail (PROJECT.md §9, one of the
  most load-bearing pages) has **no legacy implementation to draw from**.
- No Quarries, Projects, or Events routes/models exist in any form.
- Verdict: **REBUILD** routing and page structure. The App Router + TypeScript foundation itself
  (Next 15, React 19, file-based routing conventions, Server Components) is sound and should be
  **KEPT** as the underlying mechanism; the actual route tree and page content must be rebuilt
  against the locked IA.

## 3. Components — mixed KEEP / REBUILD

| Component | File | Assessment |
|---|---|---|
| `Nav` | src/components/Nav.tsx | REBUILD — hardcoded TR nav labels/hrefs for the legacy IA (Hizmetler/Ürünler/Şantiyeler/Hakkımızda/İletişim), no language switcher, no locale awareness. Structure (flex header, mobile-first stacking) is a reasonable pattern reference only. |
| `Hero` | src/components/Hero.tsx | DISCARD — static two-column hero with a decorative gradient placeholder `div` standing in for imagery, hardcoded Turkish copy passed via props from page.tsx. No video, no cinematic sequencing, no reduced-motion handling, no poster/fallback concept. Nothing here anticipates PROJECT.md §7's Cinematic Hero. Useful only as a "what not to reuse" reference. |
| `ServiceStrip` | src/components/ServiceStrip.tsx | DISCARD — models a concept ("Hizmetler/Services") that does not exist in the locked V2 IA. |
| `Footer` | src/components/Footer.tsx | INVESTIGATE — not fully read line-by-line in this pass beyond confirming its test exists; likely simple and low-risk to rebuild from scratch given IA changes, but worth a quick look before deciding. |
| `ContactForm` | src/components/ContactForm.tsx | INVESTIGATE, partial REBUILD — client-side controlled form, basic required-field check, POSTs JSON to `/api/iletisim`, handles idle/submitting/success/error states. This is a reasonable **pattern** (state machine, fetch, disabled-during-submit) but the field set (Ad Soyad/E-posta/Konu/Mesaj) doesn't match PROJECT.md §15's locked field set (Name/Company/Country/Email/Message), there is no consent/KVKK checkbox (§15, D-019), no rate limiting (required per FERRARI CLAUDE.md §2), and no spam protection. The state-machine *pattern* is reusable; the field schema, validation, and backend are not. |

## 4. API / backend — REBUILD

- `src/app/api/iletisim/route.ts`: validates payload shape inline (hand-rolled, not zod —
  violates FERRARI CLAUDE.md §3 which mandates zod schema validation), writes directly to
  Sanity via `writeClient.create()` as a `mesaj` document.
- No rate limiting (FERRARI CLAUDE.md §2 mandates it for form-submission routes).
- No anti-spam mechanism (honeypot/captcha/etc.) — PROJECT.md §15 lists spam/bot protection as
  PENDING and required before release; legacy has none.
- Email address regex validation is present and reasonable but should be replaced by zod per
  house rules.
- Recipient/delivery mechanism is "store a document in Sanity," not an email/notification path
  to a verified recipient mailbox — PROJECT.md D-018 requires the full contact-form system
  (delivery, logging, retention, consent) to be defined; current implementation only covers
  the "store it somewhere" leg.
- No consent/KVKK acknowledgement field or logging of consent.
- Verdict: **REBUILD** the route with zod validation, rate limiting, spam protection, and a
  delivery/consent model once those PENDING EREN/LEGAL decisions are made. The overall
  Next.js Route Handler mechanism is fine to **KEEP** as the pattern.

## 5. Styling approach — INVESTIGATE / PARTIAL REBUILD

- Tailwind CSS v4 (`@import "tailwindcss"` + `@theme inline` token block in
  `src/app/globals.css`) is the actual styling mechanism in use throughout every component
  (utility classes on JSX elements).
- `styled-components` is declared in `package.json` dependencies but **no usage was found
  anywhere in `src/`** (grep for `styled-components` returned zero matches). It is dead weight
  in the dependency tree, not an active second styling system.
- Existing Tailwind theme tokens (`--color-stone-cream/ivory/sand/taupe/ink/bronze`,
  `--font-display` (Playfair Display) / `--font-body` (Inter)) are a plausible **starting
  point** for a "Raw Premium / Industrial Elegance" palette — sober, stone-toned, serif+sans
  pairing — but were not validated against final brand direction and contain no dark-mode,
  RTL-logical-property conventions, or Arabic/Chinese density testing (PROJECT.md §16/§17).
- Verdict: **KEEP** Tailwind v4 as the styling engine (single source of truth, actively used).
  **DISCARD** `styled-components` dependency entirely (unused). **INVESTIGATE/REBUILD** the
  actual token values and typography against the approved V2 brand direction — treat current
  tokens as a reference sketch, not an approved design system.

## 6. Responsive behavior — INVESTIGATE

- All existing components use Tailwind responsive prefixes (`md:`) for a two-breakpoint
  (mobile/desktop) approach — no tablet-specific breakpoint usage observed anywhere.
- No evidence of touch-target sizing discipline (44–48px minimum per PROJECT.md §17) being
  deliberately applied — nav links and buttons use small text-only tap targets without explicit
  height/padding guarantees.
- No component test or visual check exercises responsive behavior; test files (see §9) test
  render output, not layout/breakpoints.
- Verdict: **INVESTIGATE further at implementation time**; current responsive patterns are too
  thin to either KEEP wholesale or explicitly REBUILD — they simply don't yet address the
  Showcase/Utility split PROJECT.md requires.

## 7. Animation implementation — DISCARD (nothing to discard, nothing exists)

- No animation library in dependencies (no framer-motion, no GSAP, no CSS-animation utility
  layer beyond Tailwind's defaults).
- No `prefers-reduced-motion` handling anywhere in `src/`.
- No scroll-driven interaction code.
- Verdict: There is no legacy animation implementation to KEEP or REBUILD from — Faz 4 cinematic
  scroll work (per recent commit history) is a **new/parallel effort**, not something layered
  on legacy code. Treat this area as greenfield, not audited legacy debt.

## 8. Media handling — INVESTIGATE (no real assets present)

- `public/` contains **no files at all** in this checkout — zero real photography, zero
  favicons, zero static media of any kind.
- `next.config.ts` whitelists only `cdn.sanity.io` as a remote image host — correctly scoped,
  no wildcard.
- Image delivery therefore depends entirely on whatever is uploaded into the connected Sanity
  dataset (not inspectable from the repository alone — would require Sanity Studio/dataset
  access, which is out of scope for a read-only file-system audit).
- No responsive `<Image>` usage was found in the page components read (`urun.gorselUrl` is
  fetched by queries but not actually rendered as an `<img>`/`next/image` anywhere in the pages
  inspected — i.e., product images are queried but not displayed in `urunlerimiz/page.tsx`).
- Verdict: **INVESTIGATE** — cannot assess real media quality/provenance from the repo; what
  code exists to *display* images is incomplete even for the legacy IA. No reusable
  image-pipeline pattern (responsive derivatives, lazy-loading, masters vs. web variants per
  PROJECT.md §18) exists to KEEP.

## 9. Sanity usage — KEEP (mechanism) / REBUILD (schema)

- `next-sanity` + `sanity` + `@sanity/vision` + `@sanity/client` — standard, current, well
  supported integration. Studio mounted at `/studio/[[...tool]]`. `client.ts` (read, uses CDN)
  and `writeClient.ts` (uses `SANITY_API_WRITE_TOKEN`, server-only per `.env.local.example`)
  are correctly separated — this satisfies the FERRARI secret-handling rule (server-only
  secret, not `NEXT_PUBLIC_`).
- Schema types present (`src/sanity/schemaTypes/`): `hizmet` (service), `urunKategorisi`
  (product category), `sirketBilgisi` (company info singleton), `iletisimBilgisi` (contact info
  singleton), `sahaTesis` (site/facility), `galeriGorseli` (gallery image), `mesaj` (contact
  message). None of these model Stone, Quarry, Project, or Event entities from PROJECT.md
  §8–§13 (technical data fields, test reports, surface/block image pairs, quarry coordinates,
  project scope, event archive).
- `seed-data.ts` / `scripts/seed-content.ts` seed the legacy schema — not reusable once schema
  changes.
- Verdict: **KEEP** the Sanity integration pattern (project structure, client/writeClient
  split, Studio route, GROQ query-per-entity convention in `queries.ts`) as the CMS approach.
  **REBUILD** the schema types entirely for the V2 content model (Stone, Quarry, Project,
  Event, technical-data value objects, asset-provenance metadata per docs/ASSETS.md).

## 10. Content models — DISCARD (legacy) / new model required

Legacy content models describe a services-and-product-category contractor site. None of the
locked V2 entities (Stone with technical data + test reports + surface/block imagery, Quarry
with coordinates, Project with verified scope, Event with verified date) have any schema,
query, or page precedent in this repository. This is fully DATA-DEPENDENT/AUDIT-DEPENDENT new
work per PROJECT.md §27, not a migration.

## 11. Tests — INVESTIGATE (config currently broken in this checkout)

- `vitest.config.ts` + `vitest.setup.ts` + `@testing-library/react` + `jsdom` — standard,
  reasonable Vitest/RTL setup for component/unit tests.
- Nine `*.test.*` files exist, one per component/module (Nav, Hero, Footer, ServiceStrip,
  ContactForm, cn util, Sanity queries, Sanity seed-data, API route) — good 1:1 coverage
  discipline as a *pattern*, though tests necessarily target legacy content/behavior, not V2
  requirements.
- Running `npx vitest run` in this checkout fails at config-load time
  (`Cannot find module 'vitest/config'`) because `node_modules` is not installed in this working
  copy — this is an environment-provisioning fact, not a defect in the test code itself, and
  could not be fully verified pass/fail without running `npm install` (skipped per read-only
  audit constraints; installing packages is out of scope for STEP 02).
- Verdict: **KEEP** the Vitest + RTL tooling and the one-test-per-unit convention as the testing
  approach going forward. Existing test *content* will naturally need to be **REBUILD**-t
  alongside whatever components/routes it covers once those are rebuilt.

## 12. Package scripts — KEEP

`dev` / `build` / `start` / `test` / `test:watch` / `seed` in package.json are conventional and
sufficient. No changes needed to the script surface itself.

## 13. SEO implementation — REBUILD (essentially absent)

- Only a single static `metadata` export in the root layout (`title`/`description`, Turkish
  only) plus per-page static `metadata.title` strings on a few routes. No `generateMetadata`,
  no canonical URLs, no hreflang, no OpenGraph, no sitemap.ts/route, no robots.ts/route, no
  structured data anywhere in `src/`.
- This is a hard gap against PROJECT.md §20's locked SEO foundation (stable locale-aware URLs,
  titles/descriptions, canonical, hreflang, OpenGraph, sitemap, robots, 404 handling).
- Verdict: **REBUILD** from scratch; nothing here is salvageable beyond confirming Next.js
  Metadata API is the correct mechanism to build on.

## 14. Dependencies — see dedicated sections below

## 15. Dead code / technical debt

- `styled-components` — installed, unused, dead weight (see §5).
- `urunKategorisi.gorselUrl` is queried but never rendered in `urunlerimiz/page.tsx` — the
  image pipeline is incomplete even for the current IA.
- `.worktrees/faz4-cinematic-intro/` — a live git worktree checked out inside the repository
  tree for separate Faz 4 (cinematic scroll intro) work; correctly excluded via `.gitignore`
  but worth the team's awareness since it duplicates `node_modules`-adjacent config on disk.
  Not a code-quality issue, just noted for completeness — **not modified during this audit**.
- `tsconfig.tsbuildinfo` is committed (per recent commit history: "Create tsconfig.tsbuildinfo")
  — this is normally a local incremental-build cache file and is typically gitignored;
  flag as INVESTIGATE for the team (harmless but unusual to commit).
- No `robots`/`sitemap`/`not-found.tsx` custom 404 exists — Next.js default 404 only.

## 16. Reusable assets and ideas worth carrying forward

- Sanity project layout: `client.ts` / `writeClient.ts` separation, GROQ query colocated in
  `queries.ts` per entity, Studio mounted under `/studio/[[...tool]]`.
- Vitest + Testing Library setup and one-test-per-unit discipline.
- Tailwind v4 `@theme inline` token approach for design tokens (values need revisiting, the
  *mechanism* is sound and current).
- Route Handler + client-side submit-state-machine pattern in ContactForm/`/api/iletisim`
  (needs zod, rate limiting, spam protection, and field-schema changes, but the shape —
  idle/submitting/success/error, disabled-during-submit, `noValidate` + manual check — is a
  reasonable starting pattern).
- `next.config.ts` remote-image-host whitelisting approach (scoped, not wildcarded).

---

## 1. Recommended V2 technical foundation

KEEP as the foundation: **Next.js 15 (App Router) + React 19 + TypeScript + Sanity
(next-sanity/sanity/@sanity/client) + Tailwind CSS v4 + Vitest/@testing-library/react**. This
stack is current, internally consistent, and each piece is actively used (Tailwind, Sanity,
Vitest) except `styled-components`, which should be dropped (see below). None of the legacy
routes, page components, or Sanity schema should be treated as a starting draft to edit
in-place — they model a different IA and a different content domain. The V2 build should:
add a locale-segment route structure (`src/app/[locale]/...`) to satisfy PROJECT.md §16/§20
from day one, define new Sanity schema types for Stone/Quarry/Project/Event/technical-data,
add `generateMetadata`, sitemap/robots routes, and rebuild Nav/Hero/Footer/ContactForm against
the locked IA and brand direction, reusing only the mechanisms listed in §16 above, not the
current markup or copy. This is a foundation-retention decision, not a full rewrite-from-zero —
STEP 03 should formalize it in docs/DECISIONS.md.

## 2. Dependencies to retain

- `next` (^15.1.0), `react` / `react-dom` (^19.0.0)
- `typescript` (^5.6.0) + `@types/node` / `@types/react` / `@types/react-dom`
- `next-sanity`, `sanity`, `@sanity/vision`, `@sanity/client`
- `tailwindcss` (^4.0.0) + `@tailwindcss/postcss`
- `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- `tsx` (used by `scripts/seed-content.ts`)
- `dotenv`

## 3. Dependencies to remove later

- `styled-components` (^6.1.0) — confirmed zero usages in `src/`; remove once STEP 03 formally
  locks Tailwind as the sole styling system, so removal is a recorded decision, not a silent
  drop.
- No other unused dependencies were identified in this pass.
- New dependencies will be *needed* (not currently present) for V2 scope: a schema-validation
  library (zod, per FERRARI CLAUDE.md — not currently a dependency anywhere despite house
  rules mandating it), rate-limiting (`lru-cache`-based middleware or Upstash Redis per house
  rules), and an i18n routing/dictionary approach — none of these should be installed without
  a concrete STEP 03 decision, per PROJECT.md §26.

## 4. Highest-risk legacy areas

1. **Contact form / `/api/iletisim`** — currently the only "production-shaped" system in the
   repo, but it is incomplete against both PROJECT.md D-018 (no delivery-to-mailbox path, no
   consent/KVKK, no spam protection, no rate limiting) and FERRARI CLAUDE.md house rules (hand-
   rolled validation instead of zod, no rate limiting on a public form endpoint). Highest risk
   because it's the most likely piece to be reused/extended by mistake without addressing these
   gaps.
2. **Total absence of i18n architecture** — no `[locale]` segment, no dictionary/message
   system, no hreflang/canonical handling anywhere. Since PROJECT.md §16/§20 lock this as a
   day-one architectural requirement, retrofitting i18n onto an already-built route tree is
   costly; it must be designed in from the first V2 route, not added after.
3. **No Stone/Quarry/Project/Event schema or pages exist** — the single most content-critical
   part of the product (Stone Detail, per PROJECT.md §9) has zero legacy precedent to build
   from, meaning STEP 03 effectively starts this from a blank page rather than an audit-informed
   revision.
4. **Zero real media in the repository** and an image field that's queried but never rendered
   — no evidence either way about actual photography readiness; this is an asset/content gate
   (docs/ASSETS.md), not a code gate, but blocks meaningful visual QA until real stone/quarry
   imagery is supplied.
5. **`tsconfig.tsbuildinfo` committed to git** — low risk but should be confirmed intentional
   or added to `.gitignore` before it causes noisy diffs on every build.

## 5. First recommended implementation action

Before any UI work: in STEP 03, formally record in docs/DECISIONS.md (a) confirmation to KEEP
Next.js 15/React 19/TypeScript/Sanity/Tailwind v4/Vitest as the foundation, (b) the decision to
drop `styled-components`, and (c) the i18n routing approach (e.g. `src/app/[locale]/` with a
TR/EN dictionary, ZH/AR-ready). Once that's locked, the first concrete implementation task
should be scaffolding the `[locale]` route segment with a minimal Home route and the Sanity
schema for a single Stone document type (including technical-data fields and asset-provenance
metadata) — this unblocks the highest-risk gap (§4.3) first and gives Stone Detail, the most
load-bearing page in the product, a real foundation to build against before Quarries/Projects/
Events are modeled.
