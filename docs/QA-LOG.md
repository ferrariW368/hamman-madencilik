# HAMMARBLE V2 QA Log

## 2026-09-30 — Local Lighthouse Mobile Lab

Status: PENDING EREN (onay bekliyor). This is a local production-build measurement, not a production-release approval.

| Page | URL | Performance | LCP | CLS | INP |
| --- | --- | ---: | ---: | ---: | --- |
| Home TR | `http://localhost:3103/tr` | 94 | 2,936 ms | 0 | Unavailable in lab |
| Spider TR | `http://localhost:3103/tr/stones/spider` | 94 | 2,723 ms | 0 | Unavailable in lab |

- Tool: Lighthouse 13.5.0 / Chrome, mobile form factor, simulated throttling, performance category only.
- Build: local production build `0DzcZ7fQsMHiRl6YmcQts`.
- Target comparison: both LCP results exceed the locked 2,500 ms target; CLS is within the locked 0.1 target.
- Field data: unavailable; not fabricated.
- Remediation: TODO (yapılacak). Repeat against the protected Vercel Preview after optimizing or approving an exception. Do not treat this local run as a release gate pass.

Raw machine-generated reports are ignored at `reports/lighthouse/`.
