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

Decision: Production assets require usage\_rights = OWNED or PERMITTED. UNKNOWN assets cannot ship.

Reason: Knowing where an asset came from does not establish permission to publish it.

Rejected: Treating provenance alone as publication approval.

Status: LOCKED.
