# HAMMARBLE V2 — Agent Rules

## Before Any Production Task
1. Read PROJECT.md completely.
2. Read relevant entries in docs/DECISIONS.md.
3. Read docs/CONTENT.md before using company facts.
4. Read docs/ASSETS.md before using media.
5. Inspect the existing implementation before editing.
6. Stay inside the assigned scope.

## Source of Truth
1. Repository / production code
2. PROJECT.md
3. docs/DECISIONS.md
4. docs/CONTENT.md
5. docs/ASSETS.md
6. Historical conversation/session context

Conversation memory is not production truth.

## Factual Integrity
Only VERIFIED facts in docs/CONTENT.md may be presented as confirmed company facts.
PENDING information may be modeled but not asserted.
DO NOT CLAIM items must not appear as factual production copy.
Technical stone values require verified source documents.
Never invent stone properties, quarry locations, project scope, dates, certifications or company claims.

## Design Guardrails
Direction: Raw Premium / Industrial Elegance / Quarry First.
Avoid generic AI/SaaS aesthetics, glassmorphism, gratuitous gradients, glowing UI, card overload, constant animation and scroll-jacking.
Stone and real quarry imagery take priority over effects.
Do not invent a slogan.

## Interaction Guardrails
Scroll advances the site; it is not required to operate the site.
No critical hover-only interaction.
No mandatory cinematic intro.
Mobile is utility-first.
Important touch controls should be comfortably sized, approximately 44–48px minimum.

## Internationalization
V1 publishes TR + EN.
Architecture must remain ready for ZH + AR.
Preserve RTL readiness and logical layout behavior.
Avoid unnecessary hardcoded UI strings.

## Engineering
One production task has one code owner.
Do not install dependencies without a concrete requirement.
Do not perform unrelated refactors.
Do not autonomously redesign approved behavior.
Missing factual information is a blocker, not permission to invent.
Use the approved stack recorded after Legacy Audit.

## Task Completion
After implementation:
- run the checks available/required by the approved stack
- report files changed
- report behavior implemented
- report verification performed
- report blockers or unresolved risks

Then stop.
