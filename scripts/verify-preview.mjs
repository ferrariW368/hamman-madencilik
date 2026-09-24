import { spawn } from "node:child_process";

const deployRequested = process.argv.includes("--deploy");
const previewArgument = process.argv.slice(2).find((argument) => argument !== "--deploy") ?? process.env.PREVIEW_URL;

if ((!previewArgument && !deployRequested) || previewArgument === "--help" || previewArgument === "-h") {
  console.log("Usage: PREVIEW_URL=https://<deployment>.vercel.app npm run verify:preview");
  console.log("   or: npm run verify:preview -- https://<deployment>.vercel.app");
  console.log("   or: npm run preview:deploy:verify");
  process.exit(previewArgument ? 0 : 1);
}

let deployedPreview;
if (deployRequested) {
  console.log("Creating a Vercel preview deployment...");
  const deployment = await new Promise((resolve, reject) => {
    const child = spawn("npx", ["vercel", "--yes"], { shell: process.platform === "win32" });
    let output = "";
    child.stdout.on("data", (chunk) => { output += chunk; });
    child.stderr.on("data", (chunk) => { output += chunk; });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve(output) : reject(new Error(output.trim())));
  });
  const urls = deployment.match(/https:\/\/[^\s\]]+\.vercel\.app/g) ?? [];
  deployedPreview = urls.at(-1);
  if (!deployedPreview) {
    console.error("Vercel completed without a preview URL in its output.");
    process.exit(1);
  }
}

let preview;
try {
  const parsed = new URL(previewArgument ?? deployedPreview);
  if (parsed.protocol !== "https:") throw new Error("Preview URL must use HTTPS.");
  preview = parsed.origin;
} catch (error) {
  console.error(`Invalid PREVIEW_URL: ${error.message}`);
  process.exit(1);
}

const localized = (locale, path, marker) => ({
  path,
  status: 200,
  checks: [
    [`html lang/dir is ${locale}/ltr`, (html) => new RegExp(`<html[^>]+lang="${locale}"[^>]+dir="ltr"`, "i").test(html)],
    ["V2 chrome is rendered", (html) => /<header\b/i.test(html) && /<footer\b/i.test(html) && html.includes("HAMMARBLE")],
    [`body marker: ${marker}`, (html) => html.includes(marker)],
  ],
});

const metadata = (path, locale) => [
  [`canonical is ${path}`, (html) => html.includes(`<link rel="canonical" href="${path}"`)],
  [`TR alternate is /tr${path.slice(3)}`, (html) => html.includes(`<link rel="alternate" hrefLang="tr" href="/tr${path.slice(3)}"`)],
  [`EN alternate is /en${path.slice(3)}`, (html) => html.includes(`<link rel="alternate" hrefLang="en" href="/en${path.slice(3)}"`)],
  [`Open Graph URL is ${path}`, (html) => html.includes(`<meta property="og:url" content="${path}"`)],
];

const routes = [
  { path: "/", status: 307, headers: [["Location is /tr", (headers) => /^location:\s*\/tr\s*$/im.test(headers)]] },
  localized("tr", "/tr", "V2 ana sayfa yapısı geliştirme aşamasındadır."),
  localized("en", "/en", "The V2 home page structure is under development."),
  localized("tr", "/tr/quarries", "Ocak bilgileri doğrulanmış konum ve malzeme ilişkileri ile eklenecektir."),
  localized("en", "/en/quarries", "Quarry information will be added with verified locations and stone relationships."),
  { path: "/tr/preview-verification-missing", status: 404, checks: [["TR localized V2 404 is selected", (html) => html.includes("V2LocalizedNotFound") && html.includes("V2Header") && html.includes('"locale\\":\\"tr\\"')]] },
  { path: "/en/preview-verification-missing", status: 404, checks: [["EN localized V2 404 is selected", (html) => html.includes("V2LocalizedNotFound") && html.includes("V2Header") && html.includes('"locale\\":\\"en\\"')]] },
  { ...localized("tr", "/tr/stones", "Spider"), checks: [...localized("tr", "/tr/stones", "Spider").checks, ...metadata("/tr/stones", "tr")] },
  { ...localized("en", "/en/stones", "Spider"), checks: [...localized("en", "/en/stones", "Spider").checks, ...metadata("/en/stones", "en")] },
  { ...localized("tr", "/tr/stones/spider", "Yüzey"), checks: [...localized("tr", "/tr/stones/spider", "Yüzey").checks, ["Block control is rendered", (html) => html.includes("Blok")], ...metadata("/tr/stones/spider", "tr")] },
  { ...localized("en", "/en/stones/spider", "Surface"), checks: [...localized("en", "/en/stones/spider", "Surface").checks, ["Block control is rendered", (html) => html.includes("Block")], ...metadata("/en/stones/spider", "en")] },
];

function request(path) {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["vercel", "curl", path, "--deployment", preview, "--", "--silent", "--show-error", "--include"], {
      shell: process.platform === "win32",
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) return reject(new Error((stderr || stdout).trim()));
      const divider = stdout.search(/\r?\n\r?\n/);
      if (divider < 0) return reject(new Error(`No HTTP headers returned. ${stdout.trim()}`));
      const headerText = stdout.slice(0, divider);
      const body = stdout.slice(divider).replace(/^\r?\n\r?\n/, "");
      const status = Number(headerText.match(/^HTTP\/\S+\s+(\d{3})/m)?.[1]);
      if (!status) return reject(new Error(`No HTTP status returned. ${headerText.trim()}`));
      resolve({ status, headers: headerText, body });
    });
  });
}

console.log(`Preview verification: ${preview}`);
let failures = 0;
const results = [];
for (const route of routes) {
  try {
    const response = await request(route.path);
    const assertions = [
      [`status is ${route.status}`, () => response.status === route.status],
      ...(route.headers ?? []).map(([label, check]) => [label, () => check(response.headers)]),
      ...(route.checks ?? []).map(([label, check]) => [label, () => check(response.body)]),
    ];
    const failed = assertions.filter(([, check]) => !check());
    results.push(failed.length ? { route, response, failed } : { route, response, failed: [] });
  } catch (error) {
    results.push({ route, error });
  }
}

for (const result of results) {
  if (result.error) {
    failures += 1;
    console.error(`FAIL ${result.route.path}: ${result.error.message}`);
  } else if (result.failed.length) {
    failures += result.failed.length;
    console.error(`FAIL ${result.route.path} (received ${result.response.status}): ${result.failed.map(([label]) => label).join("; ")}`);
  } else {
    console.log(`PASS ${result.route.path}`);
  }
}

if (failures) {
  console.error(`Preview verification failed: ${failures} check(s).`);
  process.exit(1);
}

console.log("Preview verification passed.");
