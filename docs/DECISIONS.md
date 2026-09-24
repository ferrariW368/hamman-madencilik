# HAMMARBLE V2 — Decision Log



## D-001 — Brand Identity

Decision: HAMMARBLE is the customer-facing brand. Hamman Madencilik is the corporate/legal identity used where appropriate.

Reason: Keep market-facing identity clear while preserving the legal/corporate name where required.

Rejected: Mixing both names equally throughout the interface.

Status: LOCKED.



## D-002 — Home Starts With Product

Decision: After Hero, Home goes directly to Stones.

Reason: Product discovery is the primary user need.

Rejected: Generic Who We Are intro before product.

Status: LOCKED.



## D-003 — Silent Logo Reveal

Decision: Hero ends with HAMMARBLE logo only.

Reason: Preserve a restrained, physical brand tone.

Rejected: Invented slogan/marketing line.

Status: LOCKED.



## D-004 — Stones Collection + Focus

Decision: All stones remain visible; desktop focus may emphasize a selected stone; mobile remains direct/touch-first.

Reason: Preserve portfolio visibility without forcing interaction.

Rejected: Scroll-driven product selection.

Status: LOCKED.



## D-005 — Stone Detail Visual Priority

Decision: Polished/cut surface is the default inspection view with immediately accessible SURFACE | BLOCK.

Reason: Surface character is the fastest way to inspect a natural stone visually.

Rejected: Block-only or buried surface inspection.

Status: LOCKED.



## D-006 — Technical Detail Location

Decision: Detailed technical values belong on Stone Detail, not Home.

Reason: Keep Home visual and fast while preserving depth on product pages.

Rejected: Technical tables on Home.

Status: LOCKED.



## D-007 — Units

Decision: Store canonical values and convert for Metric/Imperial display. Persist preference. Unit control is contextual, not global navigation.

Reason: Avoid duplicate source values and keep technical controls near technical content.

Rejected: Separate metric/imperial datasets or global header unit control.

Status: LOCKED.



## D-008 — Languages

Decision: V1 publishes TR + EN. Architecture is ready for ZH + AR and RTL.

Reason: Ship realistic language scope without rebuilding internationalization later.

Rejected: Exposing incomplete ZH/AR in V1.

Status: LOCKED.



## D-009 — Responsive Product Strategy

Decision: Desktop = Showcase Mode. Mobile = Utility Mode.

Reason: Large screens and field/mobile usage have different priorities.

Rejected: Treating mobile as a scaled-down desktop presentation.

Status: LOCKED.



## D-010 — Logistics Positioning

Decision: Do not position shipping/logistics as HAMMARBLE's core service unless verified business information changes this.

Reason: Current product strategy centers stone, quarry source and direct business contact.

Rejected: Quarry-to-port/global delivery marketing narrative.

Status: LOCKED.



## D-011 — Quarry Experience

Decision: Navigate to Quarry is core. Visual presentation depends on verified quarry data/media.

Reason: Quarry information must remain useful even when rich media is unavailable.

Rejected: Forcing a globe/map experience before data quality is known.

Status: DATA-DEPENDENT.



## D-012 — Stone Authenticity

Decision: AI-generated stone textures must never represent a real HAMMARBLE stone.

Reason: Product appearance is factual product information.

Rejected: Synthetic product textures presented as real material.

Status: LOCKED.



## D-013 — Hero Production Sequence

Decision: Storyboard → browser prototype → approval → premium generation/asset selection → final integration.

Reason: Expensive cinematic production should follow validated timing and interaction.

Rejected: Generating final cinematic assets before the web experience is proven.

Status: LOCKED.



## D-014 — Agent Ownership

Decision: Codex owns primary production implementation. Claude primarily audits/researches/analyzes unless explicitly assigned otherwise.

Reason: Avoid overlapping code ownership and conflicting edits.

Rejected: Multiple agents autonomously editing the same production areas.

Status: LOCKED.



## D-015 — Project Memory

Decision: Git/code is production truth; PROJECT defines product contract; DECISIONS records rationale; CONTENT records factual truth; ASSETS records provenance; Second Brain stores history; Graphify maps code relationships.

Reason: Each system has one clear responsibility.

Rejected: Conversation memory or Graphify replacing repository documentation.

Status: LOCKED.



## D-016 — Technical Stack Is Provisional

Decision: Observed legacy dependencies are not automatically V2 choices. Final stack decisions occur after Legacy Audit in STEP 03.

Reason: Existing packages indicate history, not approved architecture.

Rejected: Keeping or replacing dependencies by preference before audit.

Status: AUDIT-DEPENDENT.



## D-017 — Multi-Day Delivery Phasing

Decision: Day 1 is STEP 00–07 only; later product, cinematic and release work is separated into subsequent execution blocks.

Reason: Staging-first gives a verifiable product checkpoint without pretending data-heavy and cinematic work fits one day.

Rejected: Treating STEP 00–21 as a single-day completion target.

Status: LOCKED EXECUTION PLAN.



## D-018 — Contact Form Is an End-to-End System

Decision: The V1 Contact form is incomplete until delivery, validation, anti-spam, success/failure behavior, approved privacy handling and end-to-end testing are defined and verified.

Reason: A visible form without a verified delivery path is not a working B2B conversion path.

Rejected: UI-only contact form.

Status: LOCKED REQUIREMENT; implementation choices PENDING EREN/AUDIT.



## D-019 — Legal/Privacy Release Gate

Decision: Required TR/EN privacy/KVKK material and any legally required form/cookie controls must be approved before production.

Reason: Personal-data handling and production cookies/analytics require an explicit verified compliance path.

Rejected: Invented legal copy or silent data collection.

Status: LOCKED REQUIREMENT; legal text/mechanism PENDING.



## D-020 — Release Safety Before Cutover

Decision: Legacy URL inventory, redirect map, recoverable pre-V2 state and written rollback procedure are mandatory before production cutover.

Reason: Preserve discoverability and make deployment reversible.

Rejected: Replacing production without redirect/rollback preparation.

Status: LOCKED RELEASE GATE.



## D-021 — Missing Material Never Authorizes Fabrication

Decision: Data-dependent steps use truthful minimum/fallback versions when verified material is unavailable.

Reason: Delivery progress must not weaken factual or visual integrity.

Rejected: Fake stone/quarry/project data or documentary media.

Status: LOCKED; follow-up cadence PENDING EREN.



## D-022 — Performance Requires Recorded Measurement

Decision: Locked performance targets are evaluated with a repeatable recorded protocol on Home and Stone Detail at minimum.

Reason: A target without measurement evidence cannot function as a release gate.

Rejected: Visual/subjective performance approval only.

Status: LOCKED PROTOCOL; miss/exception policy PENDING EREN.



## D-023 — Controlled Merge and Release

Decision: Production merge requires STEP 18 QA, staging verification and Eren release approval; release safety must also be complete before production deploy.

Reason: Separate implementation completion from release authorization.

Rejected: Automatic merge/deploy at the end of the V2 branch.

Status: LOCKED GATE; branch/tag/hotfix conventions AUDIT-DEPENDENT.



## D-024 — Publication Rights Are Separate From Provenance

Decision: Production assets require usage_rights = OWNED or PERMITTED. UNKNOWN assets cannot ship.

Reason: Knowing where an asset came from does not establish permission to publish it.

Rejected: Treating provenance alone as publication approval.

Status: LOCKED.



## D-025 — V2 Technical Foundation



Decision: Retain Next.js 15 App Router, React 19, TypeScript, Sanity, Tailwind CSS v4 and Vitest/Testing Library as the V2 technical foundation.



Reason: The legacy audit found this stack current, internally consistent and already suitable for the approved V2 architecture.



Rejected: Full stack replacement without a demonstrated technical need.



Status: LOCKED.





## D-026 — Legacy UI Is Not the V2 Starting Point



Decision: Existing legacy routes, page markup, navigation, Hero, footer and content-domain UI are not to be incrementally restyled into V2. V2 routes and page experiences will be rebuilt against PROJECT.md.



Reason: The existing information architecture and content model represent a materially different website.



Rejected: Cosmetic redesign of the existing legacy site.



Status: LOCKED.





## D-027 — Styling System



Decision: Tailwind CSS v4 is the primary V2 styling system. styled-components will not be used for new V2 production code and may be removed once no retained legacy dependency requires it.



Reason: Tailwind is already active in the project while styled-components has no confirmed source usage.



Rejected: Maintaining two parallel styling systems without a requirement.



Status: LOCKED.





## D-028 — Locale Routing Architecture



Decision: V2 uses locale-aware App Router paths under src/app/\[locale]/ with TR and EN active in V1 and architecture prepared for ZH and AR.



Reason: Locale-aware URLs, hreflang, canonical metadata and RTL readiness are locked product requirements and are costly to retrofit later.



Rejected: Building non-localized routes first and adding i18n after the site is complete.



Status: LOCKED.





## D-029 — Internationalization Implementation



Decision: Use a lightweight repository-controlled dictionary/message architecture for V1 unless implementation evidence during STEP 04 demonstrates a concrete need for an additional i18n dependency.



Reason: V1 requires TR and EN with ZH/AR-ready architecture, but dependency growth must be justified rather than automatic.



Rejected: Installing an i18n package solely by convention before the required behavior is demonstrated.



Status: LOCKED DIRECTION; exact implementation may be adjusted only with documented technical reason.





## D-030 — Sanity Strategy



Decision: Retain Sanity infrastructure and integration patterns, but rebuild V2 content schemas around Stone, Quarry, Project, Event, technical data and required provenance/rights metadata.



Reason: The existing Sanity mechanism is reusable, while the existing content domain does not model the V2 product.



Rejected: Reusing legacy content schemas simply because they already exist.



Status: LOCKED.





## D-031 — Testing Strategy



Decision: Retain Vitest and Testing Library. V2 tests should focus on high-value behavior such as locale routing, navigation, unit conversion/persistence, contact states and other critical interactive logic rather than broad low-value snapshot coverage.



Reason: The existing testing stack is suitable and already integrated.



Rejected: Replacing the test stack without technical necessity or relying primarily on snapshots.



Status: LOCKED.





## D-032 — SEO Architecture



Decision: V2 SEO is rebuilt using the Next.js Metadata API with locale-aware metadata, canonical URLs, hreflang, OpenGraph, sitemap, robots and useful 404 handling.



Reason: The legacy audit found the current SEO implementation materially incomplete against PROJECT.md requirements.



Rejected: Carrying forward the current minimal static metadata as the V2 SEO implementation.



Status: LOCKED.





## D-033 — Media Strategy



Decision: Use Next.js production media capabilities and explicit approved remote-source configuration. Production media must also satisfy docs/ASSETS.md provenance and usage-rights gates.



Reason: Technical image delivery and publication permission are separate requirements and both must be satisfied.



Rejected: Unrestricted remote media, undocumented third-party assets or bypassing the asset registry.



Status: LOCKED.





## D-034 — Contact Form Architecture



Decision: The existing ContactForm and /api/iletisim implementation may be used only as a structural reference. Its current validation, delivery and protection behavior is not approved as the V2 production contact system.



Reason: The audit identified missing delivery verification, anti-spam/rate limiting, legal/privacy handling and production-grade validation.



Rejected: Extending the legacy contact endpoint as if it were already production-ready.



Status: LOCKED; backend, recipient, anti-spam, logging, retention and legal choices remain PENDING EREN.





## D-035 — Dependency Changes



Decision: No new V2 dependency is installed until a concrete STEP 04 implementation need exists and the dependency's purpose is documented. styled-components removal is allowed after confirming no retained code depends on it.



Reason: Avoid unnecessary package growth while preserving deliberate architectural decisions.



Rejected: Installing libraries speculatively during foundation work.



Status: LOCKED.



## D-036 — Quarry No-Material Fallback

Decision: Until a quarry identity, location or coordinates, stone relationship, media provenance and publication rights are VERIFIED, V2 uses the Level C fallback: a clean locale-aware quarry route with no map, pin, navigation destination or factual quarry listing.

Reason: The current public website and repository contain no verified quarry record suitable for V2 publication. A map or location treatment would create a factual claim that cannot yet be supported.

Rejected: Level A rich quarry experience, Level B map/profile treatment, or inferred quarry locations from legacy/public copy.

Status: LOCKED TEMPORARY; revisit only after verified quarry material passes STEP 10 intake.



## D-037 — Corporate No-Material Fallback

Decision: Until project, event, corporate-history and contact records are VERIFIED, the V2 Projects, Events, About and Contact routes remain locale-aware truthful placeholder screens. No public-site copy, project imagery, event imagery, contact address, contact channel or contact form delivery path is promoted into V2.

Reason: The current intake has no verified project/event/history material, and the existing public site contains conflicting contact-address candidates. A visible form without a confirmed delivery, anti-spam and legal path would be misleading.

Rejected: Migrating generic legacy claims, publishing unverified contact details, or presenting a UI-only contact form as a working conversion path.

Status: LOCKED TEMPORARY; revisit each area only when its STEP 10 record is VERIFIED.
