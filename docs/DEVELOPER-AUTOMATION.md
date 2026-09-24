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

`.github/workflows/verify-v2-preview.yml` runs on every `redesign/v2` push. It queries Vercel for the deployment whose `githubCommitSha` matches the pushed commit, waits until that Preview is Ready, then runs this verifier against the returned URL.

The GitHub repository must contain the `VERCEL_TOKEN` Actions secret. The workflow reads it only as an environment variable; it is never written to the repository or logs.

The workflow does not deploy production and does not infer a Preview URL from a branch name.
