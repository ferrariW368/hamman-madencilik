# HAMMARBLE V2 — Asset Registry



## Asset Classes



REAL — authentic company/product/quarry/project/event media.



AI-GENERATED — synthetic production asset; never documentary evidence.



TEMPORARY — layout/prototype placeholder.



ARCHIVE — historical/reference asset not automatically approved for production.



## Rules



\- Preserve original/master files.

\- Create web derivatives separately.

\- Never represent AI-generated stone texture as a real product.

\- Never silently represent AI-generated documentary-looking footage as real company footage.

\- Record provenance before final production use.

\- Avoid destructive compression of marble vein detail.

\- Provenance and publication permission are separate concerns.

\- UNKNOWN usage rights must never ship to production.

\- Project, event, team/customer and third-party imagery requires a verified usage-rights status before publication.



## Usage Rights



Allowed values:



OWNED — HAMMARBLE/company owns the asset and may publish it.



PERMITTED — publication permission has been verified.



UNKNOWN — permission has not been verified.



Production rule:



Only OWNED or PERMITTED assets may ship.



UNKNOWN assets remain out of production until verified.



## Naming



Prefer:



category-subject-purpose-sequence.ext



AI assets:



ai-category-subject-purpose-sequence.ext



Examples:



stone-spider-surface-01.jpg



quarry-beysehir-drone-01.mp4



project-rize-artvin-exterior-01.jpg



event-cairo-stand-01.jpg



ai-hero-quarry-dust-01.mp4



## Registry Fields



For every candidate production asset record:



\- filename

\- subject

\- class

\- source

\- source date if known

\- provenance notes

\- usage\_rights: OWNED / PERMITTED / UNKNOWN

\- rights\_source / evidence

\- rights\_notes / restrictions

\- approval status

\- master location

\- web derivatives

\- used in

\- notes



## Approval Status



Suggested states:



PENDING — not yet reviewed for production.



APPROVED — content, provenance and usage rights are verified.



REJECTED — must not be used.



Production use requires:

\- appropriate asset class

\- verified provenance

\- usage\_rights = OWNED or PERMITTED

\- approval status = APPROVED



## Current Intake

### AI Hero Concept — ai-hero-quarry-concept-01.png

Status: PENDING — Preview-only demo asset.

\- filename: ai-hero-quarry-concept-01.png
\- subject: stylized quarry and raw stone-block concept
\- class: AI-GENERATED
\- source: OpenAI image generation via Codex, 2026-09-25
\- provenance notes: deliberately non-documentary concept image; it must not represent a HAMMARBLE quarry, stone or location
\- usage_rights: UNKNOWN
\- rights_source / evidence: not recorded for production use
\- approval status: PENDING
\- master location: C:\\Users\\muham\\.codex\\generated_images\\01a0d049-b449-7042-8a25-6fb17edc7ac2\\exec-d846e161-6093-44c6-9368-ccada6f0ad63.png
\- web derivative: public/media/ai/ai-hero-quarry-concept-01.png
\- used in: V2 Preview Hero only
\- restrictions: visible AI-GENERATED disclosure is required; do not deploy to production or use as documentary/company evidence

### HAMMARBLE Quarry Reference — user supplied 2026-09-29

Status: APPROVED — permitted visual reference for AI-assisted Hero development.

\- filename: codex-clipboard-4af48dd2-c6ed-4be4-b9f5-f1498c3df179.png
\- subject: original HAMMARBLE quarry overview supplied by the project owner
\- class: ORIGINAL COMPANY REFERENCE
\- source: project owner upload, 2026-09-29
\- provenance notes: project owner confirms it is an original quarry photograph and authorizes publication plus AI-reference use
\- usage_rights: PERMITTED
\- rights_source / evidence: project owner confirmation in this work thread, 2026-09-29
\- approval status: APPROVED for reference and publication
\- SHA-256: EEFCA14C020027E53FEC5AA34E43711CEA430346BE45E62CCD11C8518A8911D4
\- master location: C:\\Users\\muham\\AppData\\Local\\Temp\\codex-clipboard-4af48dd2-c6ed-4be4-b9f5-f1498c3df179.png
\- used in: STEP 14 cinematic Hero reference input; not yet embedded in V2
\- restrictions: use for visual continuity only. Do not reproduce readable site text, warnings, vehicle/company marks, or any unverified operational claim in generated media.



### HAMMARBLE Hero Shot 02 — Higgsfield Cinema Studio

Status: PREVIEW ONLY — AI-GENERATED cinematic derivative; not yet integrated into V2.

\\- asset_id: b2833fbd-6bf4-4d59-bfcd-eb008c1d0797
\\- subject: restrained approach shot over pale stepped quarry faces
\\- source: Higgsfield Cinema Studio 4.0, generated 2026-09-29
\\- input_reference: HAMMARBLE Quarry Reference — user supplied 2026-09-29
\\- provenance notes: generated from the approved original quarry reference; prompt explicitly excludes readable signage, warnings, vehicles, containers, logos and operational claims
\\- usage_rights: platform-generated preview; final publication approval pending
\\- approval status: PENDING for publication; APPROVED for STEP 14 review only
\\- master location: C:\\\\Users\\\\muham\\\\Downloads\\\\af68696c-f3d2-4320-ae5d-4df5cc8b197c.tmp
\\- format: 5s video, 1080p, 16:9, sound Off
\\- used in: STEP 14 cinematic Hero variant review; not embedded in V2
\\- restrictions: retain visible AI-GENERATED disclosure if published; do not present as documentary quarry footage or use before final asset approval

### Spider



Status: PENDING



Awaiting:

\- original polished/cut surface media

\- block media

\- close-up vein media

\- source/provenance

\- publication-rights confirmation



### Quarries



Status: PENDING



Awaiting:

\- original photo

\- original video/drone media

\- verified location

\- quarry identity

\- stone relationship

\- publication-rights confirmation



### Projects



Status: PENDING



Awaiting:

\- approved project photography

\- exact project scope

\- source/provenance

\- publication-rights confirmation



Project/location imagery from clients, architects, contractors, photographers or third parties must not be assumed publishable.



### Events



Status: PENDING



Awaiting:

\- original stand imagery

\- team imagery

\- customer/visitor imagery

\- event identity/date

\- source/provenance

\- publication-rights confirmation



People appearing in event imagery require appropriate publication-rights handling.



### Corporate / History



Status: PENDING



Awaiting:

\- vector HAMMARBLE logo

\- catalogs

\- brochures

\- historical media

\- company/family/quarry photography

\- provenance

\- publication-rights confirmation



## Material Intake Rights Check



For each received asset ask:



1\. Who created or owns this asset?

2\. Where was it received from?

3\. Is HAMMARBLE allowed to publish it on the website?

4\. Are there restrictions on commercial/web use?

5\. Does it contain identifiable customers, staff or third parties?

6\. Is there documented permission or another reliable rights source?

7\. Is it the original/master or a derivative?



If the answer to publication permission is unclear:



usage\_rights = UNKNOWN



Do not ship it.



## Real vs AI Integrity



REAL:

\- may represent actual company/product/quarry/project/event facts when verified



AI-GENERATED:

\- may support approved cinematic/art-direction work

\- must not serve as documentary evidence

\- must not invent a real product's stone pattern

\- must be clearly registered as synthetic



TEMPORARY:

\- development/prototype only

\- must be replaceable

\- must not become a production fact by accident



ARCHIVE:

\- historical/reference only until production approval is explicit



## Hero Pipeline



Storyboard



→ proxy / authentic reference media



→ browser prototype



→ approved shot list



→ real footage and/or clearly registered AI-generated cinematic assets



→ rights/provenance verification



→ optimized desktop/tablet/mobile derivatives



→ production integration



## Production Asset Gate



Before release, every production media file must answer:



\- What is it?

\- Where did it come from?

\- Is it real, AI-generated, temporary or archive?

\- Who owns it or permitted its publication?

\- Is permission verified?

\- Is it approved?

\- Where is the master?

\- Which derivative is used in production?



If any required answer is unknown, keep the asset out of production.

## Existing Public Website Candidates — 2026-09-24

Source: https://www.hammanmadencilik.com/

Status: PENDING — source audit only; no files were downloaded or copied into this repository.

| Candidate group | Class | Provenance | usage_rights | Approval | Master location | V2 use |
| --- | --- | --- | --- | --- | --- | --- |
| Gallery images labelled `granit` through `granit-6` | ARCHIVE | Existing public website; original creator and capture context unknown | UNKNOWN | PENDING | Unknown; publicly served derivative only | Do not use |
| Logo images labelled `hamman_logo_B` and `hamman_logo_1` through `hamman_logo_5` | ARCHIVE | Existing public website; source/vector master unknown | UNKNOWN | PENDING | Unknown; publicly served derivative only | Do not use |
| Homepage/service/product-page images | ARCHIVE | Existing public website; subject, creator and original files unknown | UNKNOWN | PENDING | Unknown; publicly served derivative only | Do not use |

Required before any V2 use:

\- original/master file or approved web derivative
\- source and provenance confirmation
\- publication-rights evidence from HAMMARBLE
\- subject/stone/quarry/project identification where the image represents a company fact
\- explicit approval status = APPROVED
