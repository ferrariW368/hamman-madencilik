# HAMMARBLE V2 — Redirect & Rollback Registry



## Legacy URL Inventory



Status: PENDING



Before production cutover, capture the currently live and indexable legacy URLs.



For each URL, record:

\- current URL

\- current page purpose

\- V2 destination

\- redirect action

\- verification status

\- notes



| Legacy URL | V2 Destination | Action | Verification |

| --- | --- | --- | --- |

| PENDING | PENDING | PENDING | PENDING |



## Redirect Rules



Use a permanent redirect where a meaningful legacy URL has a clear V2 replacement.



Do not:

\- redirect unrelated pages to Home

\- create redirect loops

\- create unnecessary redirect chains

\- silently drop important indexable URLs

\- invent destination pages that do not exist



If a legacy page is intentionally retired, record that decision explicitly.



## Verification



Before production release, verify:

\- important legacy URLs

\- expected destination

\- HTTP redirect behavior

\- no redirect loops

\- no unnecessary multi-hop chains

\- locale-aware destination where applicable

\- destination page returns successfully



Record verification evidence before cutover.



## Pre-V2 Recovery Point



Status: PENDING



Record before production cutover:



\- current production URL

\- current production version/build identifier — PENDING

\- hosting/deployment platform — PENDING

\- current production branch — PENDING

\- content/CMS/database dependency — PENDING AFTER AUDIT

\- backup requirement — PENDING AFTER AUDIT

\- backup location/reference — PENDING

\- recovery owner — PENDING

\- recovery access verified — PENDING



Do not assume that Git alone is sufficient if production depends on external content, CMS, database, media or hosting state.



## Backup Gate



Before replacing production, determine what must be preserved:



\- source code state

\- deployed production build/version

\- environment/config references

\- CMS/content state if applicable

\- database state if applicable

\- required production media/assets

\- domain/DNS configuration references where relevant



Exact requirements remain AUDIT-DEPENDENT.



## Rollback Procedure



Status: PENDING until hosting/CMS architecture is confirmed.



The final rollback procedure must state:



1\. What condition triggers rollback?

2\. Who authorizes rollback?

3\. What previous production state is restored?

4\. Exact restore/redeploy procedure.

5\. Required environment/config verification.

6\. Redirect behavior during/after rollback.

7\. Production verification steps.

8\. How the failed V2 release is preserved for investigation.



No production deploy should rely on an improvised rollback process.



## Minimum Rollback Verification



After rollback, verify:



\- production domain responds

\- HTTPS works

\- critical routes load

\- contact paths work

\- important assets load

\- previous production behavior is restored

\- no obvious redirect loop/broken routing remains



## Production Cutover Gate



Production cutover is blocked until:



\- legacy URL inventory is complete

\- redirect mapping is reviewed

\- critical redirect behavior is verified

\- recoverable pre-V2 production state exists

\- rollback procedure is written

\- rollback owner/access is confirmed

\- STEP 18 Technical QA is complete

\- staging is verified

\- Eren approves release



## Open Items



PENDING:

\- production branch name

\- hosting/deploy workflow

\- CMS/content backup requirements

\- database backup requirements

\- rollback owner

\- rollback authorization rule

\- final release tag convention

\- hotfix workflow
