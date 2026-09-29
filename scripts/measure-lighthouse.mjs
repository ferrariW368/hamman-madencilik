import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

const baseArgument = process.argv[2] ?? process.env.PREVIEW_URL;

if (!baseArgument || baseArgument === "--help" || baseArgument === "-h") {
  console.log("Usage: PREVIEW_URL=https://<deployment>.vercel.app npm run lighthouse:mobile");
  console.log("   or: npm run lighthouse:mobile -- http://localhost:3103");
  process.exit(baseArgument ? 0 : 1);
}

let baseUrl;
try {
  baseUrl = new URL(baseArgument);
  if (!['http:', 'https:'].includes(baseUrl.protocol)) throw new Error("URL must use HTTP or HTTPS.");
} catch (error) {
  console.error(`Invalid PREVIEW_URL: ${error.message}`);
  process.exit(1);
}

const reportDirectory = resolve("reports", "lighthouse");
const runId = new Date().toISOString().replace(/[:.]/g, "-");
const paths = ["/tr", "/tr/stones/spider"];
const results = [];

await mkdir(reportDirectory, { recursive: true });

for (const path of paths) {
  const url = new URL(path, baseUrl).toString();
  const label = path === "/tr" ? "home-tr" : "stone-spider-tr";
  const reportPath = resolve(reportDirectory, `${runId}-${label}.json`);
  const args = [
    resolve("node_modules", "lighthouse", "cli", "index.js"),
    url,
    "--only-categories=performance",
    "--preset=perf",
    "--form-factor=mobile",
    "--throttling-method=simulate",
    "--output=json",
    `--output-path=${reportPath}`,
    "--quiet",
  ];

  const exitCode = await new Promise((resolveExit, reject) => {
    const child = spawn(process.execPath, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("close", resolveExit);
  });

  if (exitCode !== 0) {
    console.error(`Lighthouse failed for ${url}.`);
    process.exit(exitCode ?? 1);
  }

  const report = JSON.parse(await readFile(reportPath, "utf8"));
  const audits = report.audits;
  results.push({
    url,
    report: reportPath,
    performanceScore: Math.round(report.categories.performance.score * 100),
    lcpMs: Math.round(audits['largest-contentful-paint'].numericValue),
    cls: Number(audits['cumulative-layout-shift'].numericValue.toFixed(3)),
    inp: audits['interaction-to-next-paint']?.numericValue ? Math.round(audits['interaction-to-next-paint'].numericValue) : "unavailable",
  });
}

const manifestPath = resolve(reportDirectory, `${runId}-summary.json`);
await writeFile(manifestPath, `${JSON.stringify({
  measuredAt: new Date().toISOString(),
  profile: "Lighthouse mobile / simulated throttling / performance category",
  baseUrl: baseUrl.origin,
  results,
}, null, 2)}\n`);

for (const result of results) {
  console.log(`${result.url}: score ${result.performanceScore}; LCP ${result.lcpMs} ms; CLS ${result.cls}; INP ${result.inp}`);
}
console.log(`Saved measurement record: ${manifestPath}`);
