# HAMMARBLE V2 — Build Runbook



Status: APPROVED EXECUTION PLAN

Version: 1.1

Branch: redesign/v2



PROJECT.md defines what the product must be.

This runbook defines the execution order.



Core loop:



READ → APPLY → RUN → SEE → VERIFY → FIX → COMMIT → NEXT



Do not skip a STEP because another tool or idea looks more interesting.



---



# DELIVERY PHASES



## Day 1 — Foundation + Staging



STEP 00–07.



Day 1 goal:



A working HAMMARBLE V2 skeleton where every primary route opens, mobile navigation works, TR/EN architecture exists, and a real staging URL can be tested from another device.



Do not attempt to complete Stones, Quarries, corporate proof or final cinematic work during the Day 1 target.



## Day 2+ — Core Product



STEP 08–12.



Includes:

- Stones

- Home body

- company material intake

- Quarries

- Projects

- Events

- About

- Contact



Material-dependent work may move between sessions depending on verified company input.



## Day 2+ — Cinematic



STEP 13–15.



Do not spend premium cinematic time before the functional product works.



## Release Pass



STEP 16–22.



Includes:

- mobile field QA

- desktop show QA

- technical/performance QA

- redirect/rollback safety

- release candidate

- production deploy

- memory closeout



---



# DAY 1 SUCCESS LINE



## GOLD



STEP 00–07 complete.



Staging is reachable from an external device.



Repository and project documentation are clean and coherent.



## SILVER



Site skeleton and staging work.



Minor foundation corrections remain.



## BRONZE



Primary navigation/routes work.



One known foundation or staging blocker remains.



## FAIL



Time was spent experimenting, but there is no navigable skeleton and no meaningful staging checkpoint.



BRONZE is better than FAIL.



---



# STEP 00 — MATERIAL REQUEST



WHERE:



WhatsApp / company contact.



ACTION:



Send the prepared HAMMARBLE material request.



Do not wait for the reply before beginning STEP 01.



Requested material:



1. Stones

&#x20;  - Spider

&#x20;  - all currently active stones

&#x20;  - correct trade names

&#x20;  - surface photography

&#x20;  - block photography

&#x20;  - vein/detail photography

&#x20;  - stone–quarry relationship



2. Quarries

&#x20;  - active quarry names

&#x20;  - city/country

&#x20;  - verified location or coordinates

&#x20;  - drone/general photography

&#x20;  - production/machinery footage

&#x20;  - stone relationships



3. Technical

&#x20;  - laboratory reports

&#x20;  - technical sheets

&#x20;  - available PDF documents



4. Projects

&#x20;  - important references

&#x20;  - stone used

&#x20;  - exact HAMMARBLE scope

&#x20;  - approximate/verified year

&#x20;  - approved photography



5. Events

&#x20;  - Egypt/Cairo

&#x20;  - Marble İzmir

&#x20;  - other trade fairs

&#x20;  - official event name/year

&#x20;  - original stand/team/media



6. Corporate

&#x20;  - HAMMARBLE vector logo

&#x20;  - catalogs

&#x20;  - brochures

&#x20;  - historical family/mining/quarry media



7. Contact

&#x20;  - verified office address

&#x20;  - phone

&#x20;  - email

&#x20;  - Sales/Export contact

&#x20;  - WhatsApp

&#x20;  - WeChat/QR if actually used



Priority:



Spider media → quarry media → quarry locations → technical reports → vector logo.



Large/original files should preferably arrive without messaging-app compression.



## Follow-Up Gate



Initial request does not block production work.



Follow-up cadence: PENDING EREN.



Second contact person: PENDING EREN.



No agent may invent reminder deadlines or escalation contacts.



DONE WHEN:



Initial request has been sent.



NEXT:



STEP 01.



---



# STEP 01 — PROJECT BOOTSTRAP



WHERE:



HAMMARBLE repository.



Repository:



ferrariW368/hamman-madencilik



Dedicated branch:



redesign/v2



Required project documentation:



- PROJECT.md

- AGENTS.md

- CLAUDE.md

- docs/BUILD-RUNBOOK.md

- docs/DECISIONS.md

- docs/CONTENT.md

- docs/ASSETS.md

- docs/LEGACY-AUDIT.md

- docs/REDIRECTS.md



Rules:



- do not destroy existing production

- do not overwrite unknown local work

- verify Git status before every destructive action

- Second Brain stores historical context

- Graphify maps code relationships

- repository documentation is production truth



Before checkpoint:



- verify branch = redesign/v2

- verify documentation files exist

- verify documentation contains canonical content

- inspect git status

- perform Graphify baseline scan if available without turning it into a side project



Checkpoint:



docs: establish HAMMARBLE v2 project system



DONE WHEN:



Documentation baseline exists and repository state is understood.



NEXT:



STEP 02.



---



# STEP 02 — LEGACY REPOSITORY AUDIT



WHERE:



Claude Code / OmniRoute.



MODE:



Read-only production audit.



Claude must read:



1. PROJECT.md

2. AGENTS.md

3. docs/DECISIONS.md

4. package.json

5. repository architecture



Inspect:



- Next.js / TypeScript structure

- routing

- components

- styling

- responsive behavior

- animation implementation

- media handling

- Sanity

- content models

- tests

- scripts

- SEO

- dependencies

- dead code

- technical debt

- reusable assets/ideas



Classify relevant areas:



- KEEP

- REBUILD

- DISCARD

- INVESTIGATE



Claude must not:



- modify production code

- install packages

- refactor

- invent company facts

- redesign HAMMARBLE



OUTPUT:



docs/LEGACY-AUDIT.md



Audit must end with:



1. Recommended V2 technical foundation

2. Dependencies to retain

3. Dependencies to remove later

4. Highest-risk legacy areas

5. First recommended implementation action



After Claude finishes:



Run Git status.



If production files changed, STOP.



DONE WHEN:



LEGACY-AUDIT.md exists and production code was not modified.



NEXT:



STEP 03.



---



# STEP 03 — TECHNICAL DECISION GATE



INPUT:



- PROJECT.md

- docs/LEGACY-AUDIT.md

- package.json

- actual repository state



Resolve:



- Next.js foundation

- Sanity retention/removal

- styling approach

- motion implementation

- internationalization implementation

- content architecture

- testing approach

- media handling

- legacy code reuse



Do not choose architecture by preference alone.



Record every approved technical decision in:



docs/DECISIONS.md



Format:



Decision:

Reason:

Rejected:

Status:



DONE WHEN:



Codex does not need to invent the architecture during implementation.



NEXT:



STEP 04.



---



# STEP 04 — PRODUCTION FOUNDATION



OWNER:



Codex.



Read first:



- PROJECT.md

- AGENTS.md

- docs/DECISIONS.md

- docs/LEGACY-AUDIT.md

- docs/CONTENT.md



Build only the approved technical foundation.



Required capabilities:



- production-safe Next.js / TypeScript foundation

- strict typing where approved

- TR + EN

- ZH + AR-ready locale architecture

- RTL readiness

- logical layout behavior where practical

- design-token foundation

- responsive primitives

- typography foundation

- header/footer shells

- reduced-motion support

- Stone data model

- Quarry data model

- Project data model

- Event data model

- technical-spec model

- canonical unit storage

- metadata foundation

- media conventions



Do not:



- invent company content

- install unnecessary dependencies

- design final page experiences

- make unrelated refactors



Verification:



Inspect package.json before deciding which commands exist.



Run the checks supported by the approved stack.



Do not assume lint/typecheck scripts exist.



DONE WHEN:



Foundation runs, locale architecture exists, RTL readiness exists, and no company facts were invented.



NEXT:



STEP 05.



---



# STEP 05 — DESIGN FOUNDATION



Build:



- typography

- color system

- spacing

- grid/container

- header

- mobile navigation

- footer

- links/buttons

- focus states

- basic motion behavior



Direction:



Raw Premium / Industrial Elegance / Quarry First.



Avoid:



- final Hero

- glassmorphism

- gratuitous gradients

- generic SaaS styling

- random component-library browsing

- unnecessary card grids



Verify:



Desktop and realistic mobile viewport.



DONE WHEN:



HAMMARBLE has a coherent visual language and usable mobile navigation.



NEXT:



STEP 06.



---



# STEP 06 — COMPLETE SITE SKELETON



Required routes:



- Home

- Stones

- Stone Detail

- Quarries

- Projects

- Events

- About

- Contact



Requirements:



- every navigation target opens

- logo returns Home

- temporary Spider detail route exists

- TR route works

- EN route works

- direct URL navigation works

- useful 404 exists

- mobile navigation works



Do not build final cinematic Hero here.



Do not invent company content.



DONE WHEN:



The complete website can be navigated even with placeholder content.



NEXT:



STEP 07.



---



# STEP 07 — FIRST STAGING DEPLOY



Goal:



Deploy before polishing.



This is not production release.



Verify from another device:



- staging URL opens

- Home opens

- Stones opens

- Stone Detail opens

- Quarries opens

- Projects opens

- Events opens

- About opens

- Contact opens

- mobile navigation works

- TR works

- EN works



OUTPUT:



Recorded staging URL.



DONE WHEN:



A real external staging deployment is reachable.



NEXT:



STEP 08.



---



# STEP 08 — STONES SYSTEM



FOCUS LOCK:



Only work on Stones.



Do not jump into:

- cinematic generation

- Quarries

- Events

- random UI experiments



Build:



Collection + Focus experience.



Desktop:

- all stones visible

- focus may emphasize selected stone

- names/origin shown appropriately



Mobile:

- touch-first

- visible names

- direct navigation

- no hover dependency



Stone Detail:



- polished/cut surface default

- SURFACE | BLOCK

- touch/mobile zoom

- desktop inspection behavior where appropriate

- technical section

- Metric / Imperial

- persistent unit preference

- technical-document area

- quarry/origin path

- Contact path



Rules:



- only VERIFIED technical values

- real Spider media if available

- never generate fake Spider texture



## No-Material Minimum



If final stone media/data is unavailable:



- complete functional Stone architecture

- use clearly neutral TEMPORARY placeholders

- do not fake technical data

- do not fake origin

- do not publish placeholder material as factual production content



Field Test:



Home → Spider → Surface/Block → Technical → Document → Contact.



DONE WHEN:



The flow can be completed without explanation.



NEXT:



STEP 09.



---



# STEP 09 — HOME BODY



Order:



1. Stones

2. Quarry Preview

3. Projects

4. Events

5. Heritage

6. Contact



Do not build final cinematic Hero yet.



The site must remain useful if Hero is never completed.



Use only verified company claims.



NEXT:



STEP 10.



---



# STEP 10 — COMPANY MATERIAL INTAKE



Separate received material into:



- Stones

- Quarries

- Technical

- Projects

- Events

- Corporate

- History

- Contact

- Legal



Update:



docs/CONTENT.md



with:

- VERIFIED

- PENDING

- DO NOT CLAIM



Update:



docs/ASSETS.md



for every candidate production asset.



Record:



- source

- provenance

- class

- usage_rights

- rights evidence

- approval status

- master location

- derivatives

- usage



## Rights Check



For project/event/team/customer/third-party imagery ask:



- who owns it?

- who supplied it?

- can HAMMARBLE publish it?

- are there restrictions?

- is permission documented?



Allowed:



usage_rights = OWNED



or



usage_rights = PERMITTED



UNKNOWN assets must remain out of production.



Preserve original files.



Do not dump originals randomly into production directories.



NEXT:



STEP 11.



---



# STEP 11 — QUARRY DECISION GATE



Choose presentation according to VERIFIED material.



## Level A



Strong:

- coordinates

- photography

- video

- stone relationships



May support a richer quarry experience.



## Level B



Verified coordinates + usable photography but limited rich media.



Use:

- map

- quarry profiles



## Level C



Limited verified data.



Use:

- clean quarry listing

- truthful navigation/information



Core requirement:



Navigate to Quarry.



Map choice:



- Turkey map

- world map

- hybrid

- no map



must be based on verified quarry data.



Record decision in docs/DECISIONS.md.



## No-Material Minimum



Never invent:

- quarry identity

- coordinates

- map pins

- quarry–stone relationships

- quarry photography



If navigation cannot be verified, mark it PENDING.



NEXT:



STEP 12.



---



# STEP 12 — PROJECTS / EVENTS / ABOUT / CONTACT



## Projects



Use only verified references.



Need:

- name

- location

- year

- stone

- exact HAMMARBLE scope

- approved media

- publication rights



## Events



Use only verified events.



Need:

- official name

- location

- date/year

- approved media

- publication rights



## About



Structure:



1. HAMMARBLE Today

2. Heritage



Do not invent history, influence, scale or leadership claims.



## Contact



Direct verified human contact comes first.



Form fields:



- Name

- Company

- Country

- Email

- Message



### Contact Form Gate



Before form is considered production-ready resolve:



- backend / delivery mechanism — PENDING

- verified recipient mailbox — PENDING

- anti-spam approach — PENDING

- validation

- success state

- failure state

- duplicate/retry behavior

- logging policy — PENDING

- retention policy — PENDING

- privacy/KVKK disclosure — PENDING LEGAL

- acknowledgement/consent behavior — PENDING LEGAL

- end-to-end delivery test



Do not invent:

- email address

- service

- retention period

- legal text

- consent requirement



If backend/legal decisions are unresolved:



Direct verified contact information may remain visible.



Do not present an unverified form as a functioning production lead channel.



## No-Material Minimum



Projects/Events/About may only display VERIFIED records.



Missing factual sections may be reduced or omitted.



Do not manufacture references to fill visual space.



NEXT:



STEP 13.



---



# STEP 13 — HERO WEB PROTOTYPE



Do not use premium generation yet.



Approved storyboard:



1. aerial quarry

2. approach

3. block extraction

4. heavy block handling

5. dust

6. HAMMARBLE logo



Prototype with:

- real existing footage where usable

- TEMPORARY proxy assets where necessary



Test:



- navigation immediately accessible

- intro skippable/not mandatory

- no scroll trap

- mobile lightweight

- reduced-motion behavior

- failed-video fallback

- site remains functional without cinematic media



DONE WHEN:



Timing and interaction are approved.



NEXT:



STEP 14.



---



# STEP 14 — HIGGSFIELD PRODUCTION



Only begin after STEP 13 approval.



For each shot define:



- purpose

- duration

- framing

- camera

- reference

- transition

- start frame

- end frame



Generation rule:



1 direction → maximum approximately 3 controlled variants → choose 1 winner.



Register AI media in docs/ASSETS.md.



AI footage must never silently represent itself as documentary evidence.



NEXT:



STEP 15.



---



# STEP 15 — FINAL CINEMATIC INTEGRATION



Prepare:



- desktop version

- tablet/light version

- mobile-light version

- poster/fallback



Test:



- slow network

- desktop

- mobile

- reduced motion

- video failure

- navigation during media loading



No autoplay audio.



Cinematic media must never block core site use.



NEXT:



STEP 16.



---



# STEP 16 — MOBILE FIELD PASS



Test on a real phone.



Verify:



- navigation

- Stones

- Spider

- Surface/Block

- zoom

- technical specs

- Metric/Imperial

- technical documents

- quarry navigation

- Projects

- Events

- Contact

- language

- back navigation

- orientation changes



Look for:



- tiny touch targets

- scroll traps

- layout shift

- video lag

- horizontal overflow

- state loss

- unusable forms



If decoration harms field usability, simplify the decoration.



NEXT:



STEP 17.



---



# STEP 17 — DESKTOP SHOW PASS



Test on a large desktop display.



Inspect:



- Hero

- typography

- stone imagery

- whitespace

- rhythm

- transitions

- image quality

- navigation

- footer



Question:



Does this look like a serious international natural-stone company or a web-design demo?



Fix presentation problems without sacrificing field usability.



NEXT:



STEP 18.



---



# STEP 18 — TECHNICAL QA



First inspect the approved stack and package scripts.



Do not assume commands exist.



Verify:



- supported lint/check commands

- type checking

- tests

- production build

- internal links

- external links

- assets

- console

- responsive behavior

- video fallback

- reduced motion

- keyboard/focus

- TR

- EN

- ZH architecture smoke check

- AR/RTL architecture smoke check

- unit persistence

- metadata

- canonical

- hreflang

- OpenGraph

- 404

- performance



## Performance Protocol



Locked targets:



- LCP ≤ 2.5s

- CLS ≤ 0.1

- INP ≤ 200ms



Minimum pages:



- Home

- one Stone Detail



Record:



- date

- tested URL/build

- device/profile

- throttling/network condition

- tool

- LCP

- CLS

- INP or unavailable

- findings

- remediation status



Use repeatable Lighthouse mobile lab testing.



Record PageSpeed/field data when available.



Do not fabricate unavailable field data.



If a performance target fails:



STOP at the release gate until the approved exception/blocker policy is applied.



Performance miss policy:



PENDING EREN.



NEXT:



STEP 19.



---



# STEP 19 — RELEASE SAFETY / REDIRECT / ROLLBACK



Before production cutover:



## Legacy URL Inventory



Inventory currently live/indexable URLs.



Update:



docs/REDIRECTS.md



For each important URL:



legacy URL → V2 destination → action → verification.



Avoid:

- redirect loops

- unnecessary redirect chains

- sending unrelated URLs blindly to Home



## Recovery Point



Record the currently working production state.



Determine after technical audit whether recovery requires:



- Git state

- hosting deployment

- CMS/content backup

- database backup

- environment/config references

- media state



## Rollback



Write exact rollback steps before production deploy.



Rollback documentation must answer:



- trigger

- authorization

- previous state to restore

- restore/redeploy steps

- verification

- redirects

- investigation preservation



Unresolved redirect/rollback safety blocks production deployment.



NEXT:



STEP 20.



---



# STEP 20 — RELEASE CANDIDATE



FEATURE DEVELOPMENT STOPS.



Allowed changes:



- P0 bugs

- P1 usability issues

- factual content corrections

- performance regressions

- release/legal/safety corrections



Confirm:



- STEP 18 QA complete

- STEP 19 release safety complete

- staging verified

- required legal/privacy content approved

- mandatory verified content ready

- asset rights gate passed

- Contact production path ready

- Eren release approval ready



Production merge requires Eren approval.



Production branch name: PENDING AUDIT.



Merge method: PENDING AUDIT.



Release tag convention: PENDING EREN/AUDIT.



Hotfix workflow: PENDING EREN/AUDIT.



NEXT:



STEP 21.



---



# STEP 21 — PRODUCTION DEPLOY



Only deploy after release gates pass.



Verify:



- production domain

- HTTPS

- routes

- assets

- TR

- EN

- Contact

- Contact form where enabled

- legal/privacy pages

- technical documents

- metadata

- redirects

- mobile

- desktop



Keep the recoverable previous production state until V2 is verified externally.



If rollback criteria are met:



Use the documented rollback procedure.



Do not improvise.



DONE WHEN:



Production has been verified from external devices.



NEXT:



STEP 22.



---



# STEP 22 — MEMORY CLOSEOUT



Update:



- PROJECT.md

- docs/DECISIONS.md

- docs/CONTENT.md

- docs/ASSETS.md

- docs/REDIRECTS.md

- README where appropriate



Second Brain:



Record concise project/session summary.



Graphify:



Run post-V2 scan if useful.



Git:



Verify working tree is clean.



Record:

- release identifier

- tag if approved

- production URL

- unresolved P2/P3 follow-ups

- deferred parking-lot work



DONE WHEN:



Production state and project memory agree.



---



# PARKING LOT



Not required for V1 completion:



- globe

- machinery showcase

- Chinese typography polish

- full Chinese content

- full Arabic content

- WeChat/QR unless verified and prioritized

- advanced cinematic experiments

- extra animations

- experimental UI components

- advanced analytics

- nonessential CMS perfection



---



# 30-MINUTE BLOCKER RULE



If a problem remains unresolved for approximately 30 minutes:



Do not random-walk through libraries.



Package:



- expected behavior

- actual behavior

- error/output

- relevant files

- attempted fixes

- current blocker



Then:



- hand it to the appropriate agent

- simplify the feature

- or explicitly defer it



Do not hide blockers.



---



# OPEN EREN / COMPANY DECISIONS



1. Material follow-up cadence.

2. Second material contact person.

3. Contact form backend/delivery path.

4. Contact form recipient mailbox.

5. Anti-spam approach.

6. Submission logging policy.

7. Submission retention period.

8. KVKK/privacy source and approver.

9. Form acknowledgement/consent behavior.

10. Analytics/cookie usage.

11. Performance-target miss/exception policy.

12. Production branch and merge strategy after audit.

13. Release tag convention.

14. Hotfix workflow.

15. Final production-release approval responsibility.

16. Image publication-rights approver.

17. Legacy production backup/recovery owner.



These decisions must not be filled by agent assumption.



---



One STEP.

One owner.

One measurable output.



Finish → verify → then continue.
