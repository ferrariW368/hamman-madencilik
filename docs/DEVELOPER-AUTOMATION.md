# Developer Automation Checkpoint

## Purpose

`npm run verify:preview` verifies the current V2 staging invariants without copying HTML into a chat. It is intentionally a small Node script with no runtime or development dependency.

## Run

After a preview deployment is Ready:

```powershell
$env:PREVIEW_URL = "https://your-preview.vercel.app"
npm run verify:preview
```

To create a preview and verify it in one local command (never production):

```powershell
npm run preview:deploy:verify
```

The script uses `npx vercel curl`, so Vercel Deployment Protection is handled by the developer's authenticated Vercel CLI session. It does not store or print a protection bypass secret.

## Checks

- `/` redirects to `/tr`.
- `/tr` and `/en` render with the correct raw HTML `lang` and `dir`, plus V2 header/footer chrome.
- TR and EN missing routes return a 404 and select the localized V2 404/header components in the streamed response.
- Stones collection and Spider detail routes render for both locales.
- Stones collection/detail canonical, TR/EN alternate, and Open Graph URL match their locale-aware route.
- Spider pages expose the Surface/Block control labels.

## GitHub Actions

No workflow is included yet. The repository is locally linked to Vercel, but `redesign/v2` is not present on the GitHub remote, and the inspected preview deployment did not expose Git commit metadata. A reliable remote workflow requires both:

1. Push `redesign/v2`, then confirm the Vercel project is connected to `ferrariW368/hamman-madencilik` and creates preview deployments for its pushes.
2. Add a GitHub Actions secret with a Vercel token permitted for this project (and, if Deployment Protection requires it, an approved non-logged protection strategy).

After that confirmation, a workflow can use the Vercel deployment URL from the deployment status/event and run this same script; no preview URL discovery should be guessed from branch names.
