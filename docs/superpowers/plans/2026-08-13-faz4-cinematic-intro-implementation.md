# Hamman Madencilik — Faz 4: Sinematik Scroll Girişi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Model note:** dispatch every implementer and reviewer subagent for this plan (and the final whole-branch review) on the most capable available model (Opus), not the session default — this phase involves 3D scene architecture, scroll/raycasting logic, and multi-stage interaction design that warrants it.

**Goal:** Build a skippable, session-gated, cyclical, interactive Three.js cinematic intro at `/tanitim`: mountain → marble blocks → clickable carved-text company block → sequence of clickable featured-product blocks → a scroll-locked contact/social cube, looping back to the mountain on continued scroll.

**Architecture:** An isolated Next.js route (`/tanitim`) server-fetches `sirketBilgisi` (now including a `tanitimUrunleri` reference array) and `iletisimBilgisi` (now including social URLs), passes them to a client `IntroScene` that tracks scroll progress (native scroll + `requestAnimationFrame`, no scroll library) and renders either a static `IntroFallback` (no WebGL / reduced-motion) or an imperative Three.js `IntroCanvas`. Pure stage-timing and data-shaping logic (`introStages.ts`, `contactCubeFaces.ts`) is factored out of the Three.js code so it stays unit-testable. The Ana Sayfa gains a tiny client-only `IntroRedirectGate` (first-visit-only redirect) and a "Tanıtımı İzle" link.

**Tech Stack:** Next.js 15 (App Router) · TypeScript · Three.js (`three`, first integration in this codebase) · Tailwind v4 · Sanity · Vitest + React Testing Library

## Global Constraints

- The `/tanitim` route must stay isolated — no Three.js code may be imported by `src/app/page.tsx` or any other existing route, so the homepage bundle is unaffected.
- Skip must be possible at every stage, not just at an end — there is no hard end; the experience loops (mountain → … → contact cube → mountain).
- `sessionStorage` key `hamman_intro_seen` gates the first-visit auto-redirect from `/` to `/tanitim`; once set, `/` never redirects again in that browser session.
- Featured products for the intro come from a new Sanity reference-array field `sirketBilgisi.tanitimUrunleri` — never hardcode which products appear or how many.
- Social icons on the contact cube must only appear for platforms whose URL is actually filled in on `iletisimBilgisi`; mail/phone icons reuse the existing `eposta`/`telefon` fields, no new fields needed for those two.
- Must work on iOS Safari and Android Chrome. Must render `IntroFallback` (no animation) when `prefers-reduced-motion` is set or WebGL is unavailable.
- Do not unit-test Three.js rendering or raycasting — verify those via `npm run build` plus real-browser checks (desktop and mobile viewport). Do unit-test all pure logic (`introStages.ts`, `contactCubeFaces.ts`, session helpers, `shouldUseFallback`, and every plain React/DOM component: `SkipButton`, `InfoPanel`, `IntroFallback`, `IntroRedirectGate`).
- Design tokens only — reuse `--color-stone-cream/-ivory/-sand/-taupe/-ink/-bronze` and `--font-display`/`--font-body` from `src/app/globals.css`, no new hardcoded colors.
- Turkish-only UI copy, matching the rest of the site.

---

## File Structure

```
hamman-madencilik/
├── package.json                                    # + three, @types/three, @fontsource/playfair-display (Task 1)
├── public/fonts/PlayfairDisplay-Bold.ttf            # asset, committed (Task 1)
├── src/
│   ├── app/
│   │   ├── page.tsx                                 # modified: + IntroRedirectGate, + "Tanıtımı İzle" link (Task 14)
│   │   └── tanitim/
│   │       ├── page.tsx                             # server: fetch + render TanitimClient (Task 14)
│   │       └── TanitimClient.tsx                     # thin client wrapper (Task 14)
│   ├── components/
│   │   └── intro/
│   │       ├── introSession.ts (+ .test.ts)          # sessionStorage helpers (Task 6)
│   │       ├── SkipButton.tsx (+ .test.tsx)           # (Task 6)
│   │       ├── InfoPanel.tsx (+ .test.tsx)            # (Task 7)
│   │       ├── shouldUseFallback.ts (+ .test.ts)      # + detectWebGLSupport/detectPrefersReducedMotion (Task 8)
│   │       ├── IntroFallback.tsx (+ .test.tsx)        # (Task 8)
│   │       ├── introStages.ts (+ .test.ts)            # stage timing (Task 4)
│   │       ├── contactCubeFaces.ts (+ .test.ts)       # face list from contact data (Task 5)
│   │       ├── IntroScene.tsx                         # scroll progress, panel state, loop detection (Tasks 9, 11, 12, 13)
│   │       ├── IntroRedirectGate.tsx (+ .test.tsx)    # (Task 14)
│   │       └── IntroCanvas.tsx                         # Three.js scene (Tasks 10, 11, 12, 13)
│   └── sanity/
│       ├── queries.ts                                 # modified: new fields (Tasks 2, 3)
│       └── schemaTypes/
│           ├── iletisimBilgisi.ts                     # modified: + social URLs (Task 2)
│           └── sirketBilgisi.ts                       # modified: + tanitimUrunleri (Task 3)
```

---

### Task 1: Add Three.js Dependency + Carved-Text Font Asset

**Files:**
- Modify: `package.json`
- Create: `public/fonts/PlayfairDisplay-Bold.ttf` (binary asset, copied from an installed package)

**Interfaces:**
- Produces: the `three` package available for import; `/fonts/PlayfairDisplay-Bold.ttf` servable as a static asset at runtime, consumed by Task 11's `TTFLoader`.

- [ ] **Step 1: Install `three` and its types**

Run: `npm install three`
Run: `npm install --save-dev @types/three @fontsource/playfair-display`

Expected: `package.json` gains `"three"` under `dependencies` and `"@types/three"`, `"@fontsource/playfair-display"` under `devDependencies`. Versions will resolve to whatever is current — do not hand-edit the version strings npm writes.

- [ ] **Step 2: Locate and copy the bold TTF file**

Run: `ls node_modules/@fontsource/playfair-display/files/ | grep 700-normal`
Expected: a filename containing `playfair-display-latin-700-normal.ttf` (the regular, non-italic bold weight).

Run:
```bash
mkdir -p public/fonts
cp node_modules/@fontsource/playfair-display/files/playfair-display-latin-700-normal.ttf public/fonts/PlayfairDisplay-Bold.ttf
```

- [ ] **Step 3: Verify the asset**

Run: `ls -la public/fonts/PlayfairDisplay-Bold.ttf`
Expected: file exists, size > 0 bytes (typically 100–200 KB).

- [ ] **Step 4: Verify the project still builds**

Run: `npm run build`
Expected: succeeds (three.js isn't imported by any code yet, so this only confirms nothing broke).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json public/fonts/PlayfairDisplay-Bold.ttf
git commit -m "feat: add three.js dependency and Playfair Display TTF asset for Faz 4 intro"
```

---

### Task 2: Sanity Schema — Social URLs on İletişim Bilgisi

**Files:**
- Modify: `src/sanity/schemaTypes/iletisimBilgisi.ts`
- Modify: `src/sanity/queries.ts`
- Test: `src/sanity/queries.test.ts` (modify existing `getIletisimBilgisi` test)

**Interfaces:**
- Produces: `IletisimBilgisi` type gains `instagramUrl`, `facebookUrl`, `xUrl`, `youtubeUrl: string | null` — consumed by Task 5's `contactCubeFaces.ts` and Task 13's contact stage.

- [ ] **Step 1: Read the current test to see the existing pattern**

Read `src/sanity/queries.test.ts`'s `getIletisimBilgisi` test block before editing — match its existing style (mocked `client.fetch`, field-list `stringContaining` assertion).

- [ ] **Step 2: Update the failing test first**

In `src/sanity/queries.test.ts`, find the `getIletisimBilgisi` test and change its fake object and its `stringContaining` assertion to include the new fields:

```ts
it("getIletisimBilgisi returns the fetched value", async () => {
  const fake = {
    santiyeAdresi: "...",
    ofisAdresi: "...",
    telefon: "...",
    eposta: "...",
    instagramUrl: null,
    facebookUrl: null,
    xUrl: null,
    youtubeUrl: null,
  };
  vi.mocked(client.fetch).mockResolvedValueOnce(fake);

  const result = await getIletisimBilgisi();

  expect(result).toEqual(fake);
  expect(client.fetch).toHaveBeenCalledWith(
    expect.stringContaining(
      "santiyeAdresi, ofisAdresi, telefon, eposta, instagramUrl, facebookUrl, xUrl, youtubeUrl"
    )
  );
});
```

(Keep whatever the test's current name/wrapping `describe` block already is — only change the fake object and assertion content.)

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/sanity/queries.test.ts`
Expected: FAIL — the real query string doesn't contain the new fields yet.

- [ ] **Step 4: Add the schema fields**

In `src/sanity/schemaTypes/iletisimBilgisi.ts`, add four fields after `eposta`:

```ts
import { defineField, defineType } from "sanity";

export const iletisimBilgisi = defineType({
  name: "iletisimBilgisi",
  title: "İletişim Bilgisi",
  type: "document",
  fields: [
    defineField({ name: "santiyeAdresi", title: "Şantiye Adresi (Konya)", type: "text", rows: 2 }),
    defineField({ name: "ofisAdresi", title: "Ofis Adresi (Antalya)", type: "text", rows: 2 }),
    defineField({ name: "telefon", title: "Telefon", type: "string" }),
    defineField({ name: "eposta", title: "E-posta", type: "string" }),
    defineField({ name: "instagramUrl", title: "Instagram Linki", type: "url" }),
    defineField({ name: "facebookUrl", title: "Facebook Linki", type: "url" }),
    defineField({ name: "xUrl", title: "X (Twitter) Linki", type: "url" }),
    defineField({ name: "youtubeUrl", title: "YouTube Linki", type: "url" }),
  ],
  preview: { prepare: () => ({ title: "İletişim Bilgisi (tekil)" }) },
});
```

- [ ] **Step 5: Update the type and query in `src/sanity/queries.ts`**

Change:

```ts
export type IletisimBilgisi = {
  santiyeAdresi: string;
  ofisAdresi: string;
  telefon: string;
  eposta: string;
};
```

to:

```ts
export type IletisimBilgisi = {
  santiyeAdresi: string;
  ofisAdresi: string;
  telefon: string;
  eposta: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  xUrl: string | null;
  youtubeUrl: string | null;
};
```

Change:

```ts
const ILETISIM_QUERY = `*[_type == "iletisimBilgisi"][0]{
  santiyeAdresi, ofisAdresi, telefon, eposta
}`;
```

to:

```ts
const ILETISIM_QUERY = `*[_type == "iletisimBilgisi"][0]{
  santiyeAdresi, ofisAdresi, telefon, eposta, instagramUrl, facebookUrl, xUrl, youtubeUrl
}`;
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run src/sanity/queries.test.ts`
Expected: PASS.

- [ ] **Step 7: Run the full suite and build**

Run: `npx vitest run` — expect all existing tests still pass (nothing else references `IletisimBilgisi`'s shape strictly).
Run: `npm run build` — expect success (the İletişim page destructures specific fields off this type, adding optional fields doesn't break it).

- [ ] **Step 8: Commit**

```bash
git add src/sanity/schemaTypes/iletisimBilgisi.ts src/sanity/queries.ts src/sanity/queries.test.ts
git commit -m "feat: add social media URL fields to İletişim Bilgisi"
```

---

### Task 3: Sanity Schema — Tanıtım Ürünleri on Şirket Bilgisi

**Files:**
- Modify: `src/sanity/schemaTypes/sirketBilgisi.ts`
- Modify: `src/sanity/queries.ts`
- Test: `src/sanity/queries.test.ts` (modify existing `getSirketBilgisi` test)

**Interfaces:**
- Produces: `SirketBilgisi` type gains `tanitimUrunleri: UrunKategorisi[]` (dereferenced, ordered as selected in Studio) — consumed by Task 14's `/tanitim` route and Task 12's product stage.

- [ ] **Step 1: Update the failing test first**

In `src/sanity/queries.test.ts`, find the `getSirketBilgisi` test and update:

```ts
it("getSirketBilgisi returns the fetched value", async () => {
  const fake = {
    profil: "...",
    vizyon: "...",
    misyon: "...",
    degerler: ["a"],
    sertifikalar: ["b"],
    ekipMetni: "...",
    tanitimUrunleri: [
      { _id: "urun-1", baslik: "Blok Mermer", detaylar: "...", kullanimAlani: null, gorselUrl: null, sira: 1 },
    ],
  };
  vi.mocked(client.fetch).mockResolvedValueOnce(fake);

  const result = await getSirketBilgisi();

  expect(result).toEqual(fake);
  expect(client.fetch).toHaveBeenCalledWith(
    expect.stringContaining(
      'tanitimUrunleri[]->{ _id, baslik, detaylar, kullanimAlani, "gorselUrl": gorsel.asset->url, sira }'
    )
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/sanity/queries.test.ts`
Expected: FAIL.

- [ ] **Step 3: Add the schema field**

In `src/sanity/schemaTypes/sirketBilgisi.ts`, add one field after `ekipMetni`:

```ts
import { defineField, defineType } from "sanity";

export const sirketBilgisi = defineType({
  name: "sirketBilgisi",
  title: "Şirket Bilgisi",
  type: "document",
  fields: [
    defineField({ name: "profil", title: "Şirket Profili", type: "text", rows: 4 }),
    defineField({ name: "vizyon", title: "Vizyon", type: "text", rows: 3 }),
    defineField({ name: "misyon", title: "Misyon", type: "text", rows: 3 }),
    defineField({ name: "degerler", title: "Değerlerimiz", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "sertifikalar", title: "Belgeler & Sertifikalar", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "ekipMetni", title: "Ekibimiz", type: "text", rows: 3 }),
    defineField({
      name: "tanitimUrunleri",
      title: "Tanıtımda Gösterilecek Ürünler",
      description:
        "Sinematik giriş animasyonunda hangi ürünlerin, hangi sırayla gösterileceğini seçin. Boş bırakılırsa bu bölüm hiç gösterilmez.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "urunKategorisi" }] }],
    }),
  ],
  preview: { prepare: () => ({ title: "Şirket Bilgisi (tekil)" }) },
});
```

- [ ] **Step 4: Update the type and query in `src/sanity/queries.ts`**

Change:

```ts
export type SirketBilgisi = {
  profil: string;
  vizyon: string;
  misyon: string;
  degerler: string[];
  sertifikalar: string[];
  ekipMetni: string;
};
```

to:

```ts
export type SirketBilgisi = {
  profil: string;
  vizyon: string;
  misyon: string;
  degerler: string[];
  sertifikalar: string[];
  ekipMetni: string;
  tanitimUrunleri: UrunKategorisi[];
};
```

Change:

```ts
const SIRKET_QUERY = `*[_type == "sirketBilgisi"][0]{
  profil, vizyon, misyon, degerler, sertifikalar, ekipMetni
}`;
```

to:

```ts
const SIRKET_QUERY = `*[_type == "sirketBilgisi"][0]{
  profil, vizyon, misyon, degerler, sertifikalar, ekipMetni,
  tanitimUrunleri[]->{ _id, baslik, detaylar, kullanimAlani, "gorselUrl": gorsel.asset->url, sira }
}`;
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/sanity/queries.test.ts`
Expected: PASS.

- [ ] **Step 6: Run full suite and build**

Run: `npx vitest run` — expect all tests pass. Note: `src/app/page.tsx` and `src/app/hakkimizda/page.tsx` both destructure `SirketBilgisi` fields; adding an extra field doesn't break their existing field access, but confirm with `npm run build` that TypeScript is still happy.
Run: `npm run build` — expect success.

- [ ] **Step 7: Commit**

```bash
git add src/sanity/schemaTypes/sirketBilgisi.ts src/sanity/queries.ts src/sanity/queries.test.ts
git commit -m "feat: add tanitimUrunleri reference list to Şirket Bilgisi"
```

---

### Task 4: `introStages.ts` — Scroll-Progress-to-Scene-Stage Logic

**Files:**
- Create: `src/components/intro/introStages.ts`
- Test: `src/components/intro/introStages.test.ts`

**Interfaces:**
- Produces:
  - `type StageId = "mountain" | "approach" | "company" | "products" | "contact"`
  - `type Stage = { id: StageId; start: number; end: number }`
  - `STAGES: Stage[]`
  - `getActiveStage(progress: number): Stage`
  - `getStageProgress(progress: number, stage: Stage): number` (0–1 within that stage)
  - `getProductStageSlice(progress: number, productCount: number): { index: number; localProgress: number }`
  - Consumed by Task 10–13's `IntroCanvas` and Task 9's `IntroScene`.

- [ ] **Step 1: Write the failing tests**

```ts
// src/components/intro/introStages.test.ts
import { describe, it, expect } from "vitest";
import { STAGES, getActiveStage, getStageProgress, getProductStageSlice } from "./introStages";

describe("STAGES", () => {
  it("covers 0 to 1 with no gaps, in order", () => {
    expect(STAGES[0].start).toBe(0);
    expect(STAGES[STAGES.length - 1].end).toBe(1);
    for (let i = 1; i < STAGES.length; i++) {
      expect(STAGES[i].start).toBe(STAGES[i - 1].end);
    }
  });
});

describe("getActiveStage", () => {
  it("returns mountain at progress 0", () => {
    expect(getActiveStage(0).id).toBe("mountain");
  });

  it("returns approach at progress 0.2", () => {
    expect(getActiveStage(0.2).id).toBe("approach");
  });

  it("returns company at progress 0.35", () => {
    expect(getActiveStage(0.35).id).toBe("company");
  });

  it("returns products at progress 0.6", () => {
    expect(getActiveStage(0.6).id).toBe("products");
  });

  it("returns contact at progress 0.9 and at progress 1", () => {
    expect(getActiveStage(0.9).id).toBe("contact");
    expect(getActiveStage(1).id).toBe("contact");
  });

  it("clamps out-of-range progress", () => {
    expect(getActiveStage(-0.5).id).toBe("mountain");
    expect(getActiveStage(1.5).id).toBe("contact");
  });
});

describe("getStageProgress", () => {
  it("returns 0 at the stage's start and ~1 at its end", () => {
    const stage = getActiveStage(0.2);
    expect(getStageProgress(stage.start, stage)).toBe(0);
    expect(getStageProgress(stage.end, stage)).toBe(1);
  });

  it("returns 0.5 at the stage's midpoint", () => {
    const stage = getActiveStage(0.2);
    const mid = (stage.start + stage.end) / 2;
    expect(getStageProgress(mid, stage)).toBeCloseTo(0.5);
  });
});

describe("getProductStageSlice", () => {
  it("divides the products stage evenly across 4 products", () => {
    const productsStage = STAGES.find((s) => s.id === "products")!;
    const quarter = productsStage.start + (productsStage.end - productsStage.start) * 0.125;
    const { index, localProgress } = getProductStageSlice(quarter, 4);
    expect(index).toBe(0);
    expect(localProgress).toBeCloseTo(0.5, 1);
  });

  it("returns the last index at the very end of the products stage", () => {
    const productsStage = STAGES.find((s) => s.id === "products")!;
    const { index } = getProductStageSlice(productsStage.end - 0.001, 4);
    expect(index).toBe(3);
  });

  it("returns index -1 when there are no products", () => {
    const productsStage = STAGES.find((s) => s.id === "products")!;
    const { index } = getProductStageSlice(productsStage.start, 0);
    expect(index).toBe(-1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/intro/introStages.test.ts`
Expected: FAIL — `Cannot find module './introStages'`.

- [ ] **Step 3: Implement `introStages.ts`**

```ts
export type StageId = "mountain" | "approach" | "company" | "products" | "contact";

export type Stage = {
  id: StageId;
  start: number;
  end: number;
};

export const STAGES: Stage[] = [
  { id: "mountain", start: 0, end: 0.15 },
  { id: "approach", start: 0.15, end: 0.3 },
  { id: "company", start: 0.3, end: 0.45 },
  { id: "products", start: 0.45, end: 0.85 },
  { id: "contact", start: 0.85, end: 1 },
];

export function getActiveStage(progress: number): Stage {
  const clamped = Math.min(1, Math.max(0, progress));
  const found = STAGES.find((s) => clamped >= s.start && clamped < s.end);
  return found ?? STAGES[STAGES.length - 1];
}

export function getStageProgress(progress: number, stage: Stage): number {
  const span = stage.end - stage.start;
  if (span <= 0) return 0;
  const clamped = Math.min(1, Math.max(0, progress));
  return Math.min(1, Math.max(0, (clamped - stage.start) / span));
}

export function getProductStageSlice(
  progress: number,
  productCount: number
): { index: number; localProgress: number } {
  const productsStage = STAGES.find((s) => s.id === "products")!;
  const within = getStageProgress(progress, productsStage);
  if (productCount <= 0) return { index: -1, localProgress: 0 };
  const slice = 1 / productCount;
  const index = Math.min(productCount - 1, Math.floor(within / slice));
  const localProgress = Math.min(1, Math.max(0, (within - index * slice) / slice));
  return { index, localProgress };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/intro/introStages.test.ts`
Expected: PASS (all cases).

- [ ] **Step 5: Commit**

```bash
git add src/components/intro/introStages.ts src/components/intro/introStages.test.ts
git commit -m "feat: add scroll-progress-to-stage mapping logic for Faz 4 intro"
```

---

### Task 5: `contactCubeFaces.ts` — Contact/Social Face List

**Files:**
- Create: `src/components/intro/contactCubeFaces.ts`
- Test: `src/components/intro/contactCubeFaces.test.ts`

**Interfaces:**
- Produces:
  - `type ContactFaceKind = "instagram" | "facebook" | "x" | "youtube" | "email" | "phone"`
  - `type ContactFace = { kind: ContactFaceKind; label: string; href: string; external: boolean }`
  - `buildContactFaces(input: ContactCubeInput): ContactFace[]`
  - Consumed by Task 13's contact stage.

- [ ] **Step 1: Write the failing tests**

```ts
// src/components/intro/contactCubeFaces.test.ts
import { describe, it, expect } from "vitest";
import { buildContactFaces } from "./contactCubeFaces";

describe("buildContactFaces", () => {
  it("returns an empty list when nothing is filled in", () => {
    expect(buildContactFaces({})).toEqual([]);
  });

  it("includes only email and phone when only those are filled", () => {
    const faces = buildContactFaces({ eposta: "info@hammanmadencilik.com.tr", telefon: "+90.532.151 42 37" });
    expect(faces).toEqual([
      { kind: "email", label: "E-posta", href: "mailto:info@hammanmadencilik.com.tr", external: false },
      { kind: "phone", label: "Telefon", href: "tel:+90.532.1514237", external: false },
    ]);
  });

  it("includes only the social platforms whose URL is filled in", () => {
    const faces = buildContactFaces({
      instagramUrl: "https://instagram.com/hammanmadencilik",
      xUrl: "https://x.com/hammanmadencilik",
      facebookUrl: null,
      youtubeUrl: null,
    });
    expect(faces.map((f) => f.kind)).toEqual(["instagram", "x"]);
    expect(faces[0]).toEqual({
      kind: "instagram",
      label: "Instagram",
      href: "https://instagram.com/hammanmadencilik",
      external: true,
    });
  });

  it("includes all six faces in a fixed order when everything is filled", () => {
    const faces = buildContactFaces({
      instagramUrl: "https://instagram.com/x",
      facebookUrl: "https://facebook.com/x",
      xUrl: "https://x.com/x",
      youtubeUrl: "https://youtube.com/x",
      eposta: "info@example.com",
      telefon: "+90 532 000 00 00",
    });
    expect(faces.map((f) => f.kind)).toEqual([
      "instagram",
      "facebook",
      "x",
      "youtube",
      "email",
      "phone",
    ]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/intro/contactCubeFaces.test.ts`
Expected: FAIL — `Cannot find module './contactCubeFaces'`.

- [ ] **Step 3: Implement `contactCubeFaces.ts`**

```ts
export type ContactFaceKind = "instagram" | "facebook" | "x" | "youtube" | "email" | "phone";

export type ContactFace = {
  kind: ContactFaceKind;
  label: string;
  href: string;
  external: boolean;
};

export type ContactCubeInput = {
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  xUrl?: string | null;
  youtubeUrl?: string | null;
  eposta?: string | null;
  telefon?: string | null;
};

export function buildContactFaces(input: ContactCubeInput): ContactFace[] {
  const faces: ContactFace[] = [];

  if (input.instagramUrl) {
    faces.push({ kind: "instagram", label: "Instagram", href: input.instagramUrl, external: true });
  }
  if (input.facebookUrl) {
    faces.push({ kind: "facebook", label: "Facebook", href: input.facebookUrl, external: true });
  }
  if (input.xUrl) {
    faces.push({ kind: "x", label: "X", href: input.xUrl, external: true });
  }
  if (input.youtubeUrl) {
    faces.push({ kind: "youtube", label: "YouTube", href: input.youtubeUrl, external: true });
  }
  if (input.eposta) {
    faces.push({ kind: "email", label: "E-posta", href: `mailto:${input.eposta}`, external: false });
  }
  if (input.telefon) {
    faces.push({
      kind: "phone",
      label: "Telefon",
      href: `tel:${input.telefon.replace(/\s+/g, "")}`,
      external: false,
    });
  }

  return faces;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/intro/contactCubeFaces.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/intro/contactCubeFaces.ts src/components/intro/contactCubeFaces.test.ts
git commit -m "feat: add contact cube face-list logic"
```

---

### Task 6: `introSession.ts` + `SkipButton`

**Files:**
- Create: `src/components/intro/introSession.ts`
- Test: `src/components/intro/introSession.test.ts`
- Create: `src/components/intro/SkipButton.tsx`
- Test: `src/components/intro/SkipButton.test.tsx`

**Interfaces:**
- Produces: `hasSeenIntro(): boolean`, `markIntroSeen(): void` — consumed by Task 14's `IntroRedirectGate` and `TanitimClient`/`IntroFallback`.
- Produces: `SkipButton()` component — consumed by Task 9's `IntroScene`.

- [ ] **Step 1: Write the failing test for `introSession`**

```ts
// src/components/intro/introSession.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { hasSeenIntro, markIntroSeen } from "./introSession";

describe("introSession", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("returns false before markIntroSeen is called", () => {
    expect(hasSeenIntro()).toBe(false);
  });

  it("returns true after markIntroSeen is called", () => {
    markIntroSeen();
    expect(hasSeenIntro()).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/intro/introSession.test.ts`
Expected: FAIL — `Cannot find module './introSession'`.

- [ ] **Step 3: Implement `introSession.ts`**

```ts
const INTRO_SEEN_KEY = "hamman_intro_seen";

export function hasSeenIntro(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
}

export function markIntroSeen(): void {
  window.sessionStorage.setItem(INTRO_SEEN_KEY, "1");
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/intro/introSession.test.ts`
Expected: PASS.

- [ ] **Step 5: Write the failing test for `SkipButton`**

```tsx
// src/components/intro/SkipButton.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SkipButton } from "./SkipButton";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe("SkipButton", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    pushMock.mockClear();
  });

  it("marks the intro as seen and navigates home when clicked", () => {
    render(<SkipButton />);

    fireEvent.click(screen.getByRole("button", { name: /atla/i }));

    expect(window.sessionStorage.getItem("hamman_intro_seen")).toBe("1");
    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/components/intro/SkipButton.test.tsx`
Expected: FAIL — `Cannot find module './SkipButton'`.

- [ ] **Step 7: Implement `SkipButton.tsx`**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { markIntroSeen } from "./introSession";

export function SkipButton() {
  const router = useRouter();

  function handleSkip() {
    markIntroSeen();
    router.push("/");
  }

  return (
    <button
      type="button"
      onClick={handleSkip}
      className="fixed right-6 top-6 z-50 border border-[color:var(--color-stone-cream)]/40 px-4 py-2 text-xs uppercase tracking-[0.08em] text-[color:var(--color-stone-cream)]"
    >
      Atla →
    </button>
  );
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/components/intro/SkipButton.test.tsx`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/components/intro/introSession.ts src/components/intro/introSession.test.ts src/components/intro/SkipButton.tsx src/components/intro/SkipButton.test.tsx
git commit -m "feat: add intro session tracking and Skip button"
```

---

### Task 7: `InfoPanel`

**Files:**
- Create: `src/components/intro/InfoPanel.tsx`
- Test: `src/components/intro/InfoPanel.test.tsx`

**Interfaces:**
- Produces: `InfoPanel(props: { title: string; description: string; fullPageHref?: string; onClose: () => void })` — consumed by Task 9's `IntroScene`.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/intro/InfoPanel.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { InfoPanel } from "./InfoPanel";

describe("InfoPanel", () => {
  it("renders the title and description", () => {
    render(<InfoPanel title="Blok Mermer" description="Ocaktan çıkarılan doğal bloklar." onClose={() => {}} />);

    expect(screen.getByText("Blok Mermer")).toBeInTheDocument();
    expect(screen.getByText("Ocaktan çıkarılan doğal bloklar.")).toBeInTheDocument();
  });

  it("does not render a full-page link when fullPageHref is omitted", () => {
    render(<InfoPanel title="X" description="Y" onClose={() => {}} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders a full-page link when fullPageHref is provided", () => {
    render(<InfoPanel title="X" description="Y" fullPageHref="/hakkimizda" onClose={() => {}} />);
    expect(screen.getByRole("link", { name: /tüm sayfayı gör/i })).toHaveAttribute("href", "/hakkimizda");
  });

  it("calls onClose when the Kapat button is clicked", () => {
    const onClose = vi.fn();
    render(<InfoPanel title="X" description="Y" onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: /kapat/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/intro/InfoPanel.test.tsx`
Expected: FAIL — `Cannot find module './InfoPanel'`.

- [ ] **Step 3: Implement `InfoPanel.tsx`**

```tsx
type InfoPanelProps = {
  title: string;
  description: string;
  fullPageHref?: string;
  onClose: () => void;
};

export function InfoPanel({ title, description, fullPageHref, onClose }: InfoPanelProps) {
  return (
    <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-xl border border-[color:var(--color-stone-cream)]/20 bg-[color:var(--color-stone-ink)]/90 p-6 text-[color:var(--color-stone-cream)] md:inset-x-auto md:right-10 md:top-1/2 md:bottom-auto md:-translate-y-1/2">
      <button
        type="button"
        onClick={onClose}
        aria-label="Paneli kapat"
        className="absolute right-4 top-4 text-xs uppercase tracking-[0.08em]"
      >
        Kapat
      </button>
      <h3 className="font-[family-name:var(--font-display)] text-xl">{title}</h3>
      <p className="mt-3 text-sm text-[color:var(--color-stone-cream)]/80">{description}</p>
      {fullPageHref && (
        <a
          href={fullPageHref}
          className="mt-4 inline-block text-xs uppercase tracking-[0.08em] text-[color:var(--color-stone-bronze)]"
        >
          Tüm Sayfayı Gör →
        </a>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/intro/InfoPanel.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/intro/InfoPanel.tsx src/components/intro/InfoPanel.test.tsx
git commit -m "feat: add InfoPanel component for intro block details"
```

---

### Task 8: `shouldUseFallback` + `IntroFallback`

**Files:**
- Create: `src/components/intro/shouldUseFallback.ts`
- Test: `src/components/intro/shouldUseFallback.test.ts`
- Create: `src/components/intro/IntroFallback.tsx`
- Test: `src/components/intro/IntroFallback.test.tsx`

**Interfaces:**
- Produces: `shouldUseFallback(options: { prefersReducedMotion: boolean; hasWebGL: boolean }): boolean`, `detectWebGLSupport(): boolean`, `detectPrefersReducedMotion(): boolean` — consumed by Task 9's `IntroScene`. Only `shouldUseFallback` is unit-tested (pure); the two `detect*` functions are thin browser-API probes, exercised only via manual browser verification (Task 15).
- Produces: `IntroFallback(props: { onContinue: () => void })` — consumed by Task 9's `IntroScene`.

- [ ] **Step 1: Write the failing test for `shouldUseFallback`**

```ts
// src/components/intro/shouldUseFallback.test.ts
import { describe, it, expect } from "vitest";
import { shouldUseFallback } from "./shouldUseFallback";

describe("shouldUseFallback", () => {
  it("is false when motion is fine and WebGL is supported", () => {
    expect(shouldUseFallback({ prefersReducedMotion: false, hasWebGL: true })).toBe(false);
  });

  it("is true when reduced motion is preferred, even with WebGL", () => {
    expect(shouldUseFallback({ prefersReducedMotion: true, hasWebGL: true })).toBe(true);
  });

  it("is true when WebGL is unsupported, even without reduced motion", () => {
    expect(shouldUseFallback({ prefersReducedMotion: false, hasWebGL: false })).toBe(true);
  });

  it("is true when both conditions apply", () => {
    expect(shouldUseFallback({ prefersReducedMotion: true, hasWebGL: false })).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/intro/shouldUseFallback.test.ts`
Expected: FAIL — `Cannot find module './shouldUseFallback'`.

- [ ] **Step 3: Implement `shouldUseFallback.ts`**

```ts
export function shouldUseFallback(options: { prefersReducedMotion: boolean; hasWebGL: boolean }): boolean {
  return options.prefersReducedMotion || !options.hasWebGL;
}

export function detectWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export function detectPrefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/intro/shouldUseFallback.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Write the failing test for `IntroFallback`**

```tsx
// src/components/intro/IntroFallback.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { IntroFallback } from "./IntroFallback";

describe("IntroFallback", () => {
  it("renders the company name and calls onContinue when clicked", () => {
    const onContinue = vi.fn();
    render(<IntroFallback onContinue={onContinue} />);

    expect(screen.getByText("Hamman Madencilik")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /ana sayfaya geç/i }));

    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/components/intro/IntroFallback.test.tsx`
Expected: FAIL — `Cannot find module './IntroFallback'`.

- [ ] **Step 7: Implement `IntroFallback.tsx`**

```tsx
type IntroFallbackProps = {
  onContinue: () => void;
};

export function IntroFallback({ onContinue }: IntroFallbackProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[color:var(--color-stone-ink)] px-6 text-center text-[color:var(--color-stone-cream)]">
      <p className="font-[family-name:var(--font-display)] text-2xl">Hamman Madencilik</p>
      <p className="max-w-sm text-sm text-[color:var(--color-stone-cream)]/70">
        Doğanın taşına, ustanın dokunuşu.
      </p>
      <button
        type="button"
        onClick={onContinue}
        className="border border-[color:var(--color-stone-cream)]/40 px-6 py-3 text-xs uppercase tracking-[0.08em]"
      >
        Ana Sayfaya Geç
      </button>
    </div>
  );
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/components/intro/IntroFallback.test.tsx`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/components/intro/shouldUseFallback.ts src/components/intro/shouldUseFallback.test.ts src/components/intro/IntroFallback.tsx src/components/intro/IntroFallback.test.tsx
git commit -m "feat: add WebGL/reduced-motion detection and static IntroFallback screen"
```

---

### Task 9: `IntroScene` — Scroll Progress Container + Fallback Gate

**Files:**
- Create: `src/components/intro/IntroScene.tsx`
- Create: `src/components/intro/IntroCanvas.tsx` (minimal stub in this task, filled in by Tasks 10–13)

**Interfaces:**
- Consumes: `shouldUseFallback`, `detectWebGLSupport`, `detectPrefersReducedMotion` (Task 8), `IntroFallback` (Task 8), `SkipButton` (Task 6), `SirketBilgisi`/`UrunKategorisi`/`IletisimBilgisi` types (Tasks 2–3).
- Produces: `IntroScene(props: { sirket: SirketBilgisi | null; urunler: UrunKategorisi[]; iletisim: IletisimBilgisi | null; onFinish: () => void })` — consumed by Task 14's `TanitimClient`. Also produces the `IntroCanvas` component signature that Tasks 10–13 extend: `IntroCanvas(props: { progress: number })` for now (more props added in later tasks).

No automated test for this task — it's a scroll/DOM-timing container with no pure logic left to extract (the pure parts already live in `introStages.ts`/`shouldUseFallback.ts`, already tested). Verified via `npm run build` and a manual dev-server scroll check in Task 15.

- [ ] **Step 1: Create a minimal `IntroCanvas.tsx` stub**

```tsx
// src/components/intro/IntroCanvas.tsx
"use client";

type IntroCanvasProps = {
  progress: number;
};

export function IntroCanvas({ progress }: IntroCanvasProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[color:var(--color-stone-ink)] text-[color:var(--color-stone-cream)]">
      <p className="font-mono text-xs">progress: {progress.toFixed(2)}</p>
    </div>
  );
}
```

This stub exists only so `IntroScene` has something to render; Task 10 replaces it with the real Three.js scene.

- [ ] **Step 2: Implement `IntroScene.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { IntroCanvas } from "./IntroCanvas";
import { IntroFallback } from "./IntroFallback";
import { SkipButton } from "./SkipButton";
import { shouldUseFallback, detectWebGLSupport, detectPrefersReducedMotion } from "./shouldUseFallback";
import type { SirketBilgisi, UrunKategorisi, IletisimBilgisi } from "@/sanity/queries";

type IntroSceneProps = {
  sirket: SirketBilgisi | null;
  urunler: UrunKategorisi[];
  iletisim: IletisimBilgisi | null;
  onFinish: () => void;
};

export function IntroScene({ sirket, urunler, iletisim, onFinish }: IntroSceneProps) {
  const [progress, setProgress] = useState(0);
  const [useFallback, setUseFallback] = useState(false);
  const [ready, setReady] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    setUseFallback(
      shouldUseFallback({
        prefersReducedMotion: detectPrefersReducedMotion(),
        hasWebGL: detectWebGLSupport(),
      })
    );
    setReady(true);
  }, []);

  useEffect(() => {
    if (useFallback || !ready) return;

    function updateProgress() {
      const el = scrollRef.current;
      if (!el) return;
      const scrollable = el.scrollHeight - window.innerHeight;
      const value = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      setProgress(value);
      rafId.current = null;
    }

    function onScroll() {
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(updateProgress);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    updateProgress();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [useFallback, ready]);

  if (!ready) return null;

  if (useFallback) {
    return <IntroFallback onContinue={onFinish} />;
  }

  return (
    <div ref={scrollRef} style={{ height: "600vh" }} className="relative bg-[color:var(--color-stone-ink)]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <IntroCanvas progress={progress} />
      </div>
      <SkipButton />
    </div>
  );
}
```

- [ ] **Step 3: Verify the project builds**

Run: `npm run build`
Expected: succeeds (nothing imports `IntroScene` yet, so this only confirms no syntax/type errors).

- [ ] **Step 4: Commit**

```bash
git add src/components/intro/IntroScene.tsx src/components/intro/IntroCanvas.tsx
git commit -m "feat: add IntroScene scroll-progress container with fallback gate"
```

---

### Task 10: `IntroCanvas` — Mountain + Block-Approach Stages

**Files:**
- Modify: `src/components/intro/IntroCanvas.tsx` (replace the Task 9 stub)

**Interfaces:**
- Consumes: `getActiveStage`, `getStageProgress` (Task 4).
- Produces: `IntroCanvas(props: { progress: number })` still (unchanged signature from Task 9) — renders the `mountain` and `approach` stages. Later tasks (11–13) extend the props and the scene, not the signature established here for `progress`.

No automated test — Three.js rendering. Verified via build + manual browser check (Step 3 below), and again in Task 15's full pass.

- [ ] **Step 1: Replace `IntroCanvas.tsx`**

```tsx
// src/components/intro/IntroCanvas.tsx
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { getActiveStage, getStageProgress } from "./introStages";

type IntroCanvasProps = {
  progress: number;
};

function createMarbleTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#F5F2EC";
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "rgba(138, 111, 58, 0.35)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 14; i++) {
    ctx.beginPath();
    const startX = Math.random() * size;
    ctx.moveTo(startX, 0);
    let x = startX;
    for (let y = 0; y <= size; y += 16) {
      x += (Math.random() - 0.5) * 24;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createMountain(): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(40, 40, 60, 60);
  geometry.rotateX(-Math.PI / 2);
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const z = position.getZ(i);
    const dist = Math.sqrt(x * x + z * z);
    const ridge = Math.sin(x * 0.3) * Math.cos(z * 0.25) * 2.2;
    const falloff = Math.max(0, 1 - dist / 22);
    const height = ridge * falloff + Math.sin(dist * 0.5) * 0.4 * falloff;
    position.setY(i, height);
  }
  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({ color: 0x4b5560, roughness: 1, flatShading: true });
  return new THREE.Mesh(geometry, material);
}

function createBlock(marbleTexture: THREE.Texture): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(2, 1.4, 1.4);
  const material = new THREE.MeshStandardMaterial({ map: marbleTexture, roughness: 0.5, metalness: 0.05 });
  return new THREE.Mesh(geometry, material);
}

export function IntroCanvas({ progress }: IntroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x4b5560, 8, 30);

    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 3, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, container.clientWidth < 640 ? 1.5 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const sun = new THREE.DirectionalLight(0xffffff, 0.8);
    sun.position.set(5, 8, 5);
    scene.add(sun);

    const mountain = createMountain();
    mountain.position.y = -1.5;
    scene.add(mountain);

    const marbleTexture = createMarbleTexture();
    const approachBlocks: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const block = createBlock(marbleTexture);
      block.position.set((i - 2) * 1.6, -0.5, -2 - i * 0.4);
      block.visible = false;
      scene.add(block);
      approachBlocks.push(block);
    }

    function render() {
      const p = progressRef.current;
      const stage = getActiveStage(p);

      if (stage.id === "mountain") {
        const local = getStageProgress(p, stage);
        camera.position.set(0, 3 - local * 1.5, 14 - local * 6);
        camera.lookAt(0, 0, 0);
        mountain.visible = true;
        approachBlocks.forEach((b) => (b.visible = false));
      } else if (stage.id === "approach") {
        const local = getStageProgress(p, stage);
        camera.position.set(0, 1.5 - local * 0.5, 8 - local * 5);
        camera.lookAt(0, 0, -2);
        mountain.visible = local < 0.6;
        approachBlocks.forEach((b) => (b.visible = true));
        const fogColorFrom = new THREE.Color(0x4b5560);
        const fogColorTo = new THREE.Color(0xf5f2ec);
        (scene.fog as THREE.Fog).color.copy(fogColorFrom).lerp(fogColorTo, local);
      } else {
        mountain.visible = false;
        approachBlocks.forEach((b) => (b.visible = false));
      }

      renderer.render(scene, camera);
    }

    let frameId: number;
    function animate() {
      frameId = requestAnimationFrame(animate);
      render();
    }
    animate();

    function handleResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}
```

- [ ] **Step 2: Verify the project builds**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Manual browser check**

Run `npm run dev`, temporarily render `<IntroScene sirket={null} urunler={[]} iletisim={null} onFinish={() => {}} />` from a scratch route or directly visit once Task 14 wires `/tanitim` (if Task 14 isn't done yet, add a throwaway `src/app/tanitim-preview/page.tsx` client page that renders `<IntroScene sirket={null} urunler={[]} iletisim={null} onFinish={() => {}} />` just for this check, then delete it before committing — do not commit a throwaway route). Scroll from top: confirm a foggy grey mountain silhouette appears and, further down, five marble-textured blocks fade into view as fog shifts toward cream. Stop the dev server when done.

- [ ] **Step 4: Commit**

```bash
git add src/components/intro/IntroCanvas.tsx
git commit -m "feat: implement mountain and block-approach stages in IntroCanvas"
```

---

### Task 11: `IntroCanvas` — Company Stage (Carved Text + Click)

**Files:**
- Modify: `src/components/intro/IntroCanvas.tsx`
- Modify: `src/components/intro/IntroScene.tsx`

**Interfaces:**
- Consumes: `/fonts/PlayfairDisplay-Bold.ttf` (Task 1), `SirketBilgisi` (Task 2/existing).
- Produces: `IntroCanvas` gains props `sirket: SirketBilgisi | null` and `onSelectCompany: () => void`. `IntroScene` gains local panel state and renders `InfoPanel` for the company block.

- [ ] **Step 1: Extend `IntroCanvas`'s props and add the company block**

In `src/components/intro/IntroCanvas.tsx`, add these imports at the top:

```ts
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader.js";
import { Font } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import type { SirketBilgisi } from "@/sanity/queries";
```

Change the props type to:

```ts
type IntroCanvasProps = {
  progress: number;
  sirket: SirketBilgisi | null;
  onSelectCompany: () => void;
};
```

Update the component signature: `export function IntroCanvas({ progress, sirket, onSelectCompany }: IntroCanvasProps) {` — and keep a ref for the latest callback so the effect (which only runs once) always calls the current one:

```ts
const onSelectCompanyRef = useRef(onSelectCompany);
onSelectCompanyRef.current = onSelectCompany;
```

Inside the main `useEffect`, after the `approachBlocks` setup block, add the company block and font loading:

```ts
const companyBlock = createBlock(marbleTexture);
companyBlock.position.set(0, 0, 0);
companyBlock.visible = false;
scene.add(companyBlock);

const ttfLoader = new TTFLoader();
ttfLoader.load("/fonts/PlayfairDisplay-Bold.ttf", (ttfData) => {
  const font = new Font(ttfData);
  const textGeometry = new TextGeometry("HAMMAN MADENCİLİK A.Ş.", {
    font,
    size: 0.16,
    depth: 0.03,
    curveSegments: 4,
  });
  textGeometry.center();
  const textMesh = new THREE.Mesh(
    textGeometry,
    new THREE.MeshStandardMaterial({ color: 0x2b2620, roughness: 0.85 })
  );
  textMesh.position.z = 0.71;
  companyBlock.add(textMesh);
});
```

- [ ] **Step 2: Animate the company stage and wire up raycasting**

In the `render()` function, add a branch for the `company` stage (alongside the existing `mountain`/`approach`/`else` branches — replace the bare `else` with an explicit `company` branch and keep a final `else` for `products`/`contact`, which stay invisible until Tasks 12–13 add them):

```ts
} else if (stage.id === "company") {
  const local = getStageProgress(p, stage);
  companyBlock.visible = true;
  companyBlock.rotation.y = local * Math.PI * 0.6;
  camera.position.set(0, 0.3, 3.5);
  camera.lookAt(0, 0, 0);
  mountain.visible = false;
  approachBlocks.forEach((b) => (b.visible = false));
} else {
  companyBlock.visible = false;
  mountain.visible = false;
  approachBlocks.forEach((b) => (b.visible = false));
}
```

After the `animate()` call and before `window.addEventListener("resize", ...)`, add click handling:

```ts
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function handleClick(event: MouseEvent) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  if (getActiveStage(progressRef.current).id === "company" && companyBlock.visible) {
    const hits = raycaster.intersectObject(companyBlock, true);
    if (hits.length > 0) {
      onSelectCompanyRef.current();
    }
  }
}
renderer.domElement.addEventListener("click", handleClick);
```

Add `renderer.domElement.removeEventListener("click", handleClick);` to the cleanup function alongside the existing `removeEventListener("resize", ...)`.

- [ ] **Step 3: Wire `IntroScene` to show the company `InfoPanel`**

In `src/components/intro/IntroScene.tsx`, add:

```ts
import { InfoPanel } from "./InfoPanel";
```

Add state: `const [activePanel, setActivePanel] = useState<"company" | null>(null);`

Pass the new props to `IntroCanvas`:

```tsx
<IntroCanvas
  progress={progress}
  sirket={sirket}
  onSelectCompany={() => setActivePanel("company")}
/>
```

After the `<SkipButton />` line, render the panel conditionally:

```tsx
{activePanel === "company" && sirket && (
  <InfoPanel
    title="Hamman Madencilik A.Ş."
    description={sirket.profil}
    fullPageHref="/hakkimizda"
    onClose={() => setActivePanel(null)}
  />
)}
```

- [ ] **Step 4: Verify the project builds**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 5: Manual browser check**

Using the same throwaway-route technique as Task 10 (pass a real or fake `sirket` object this time, e.g. `{ profil: "Test profili", vizyon: "", misyon: "", degerler: [], sertifikalar: [], ekipMetni: "", tanitimUrunleri: [] }`), scroll to roughly 35% and confirm: a block appears with "HAMMAN MADENCİLİK A.Ş." carved into a visible face (readable, not a blank/black box — if the text doesn't appear, the TTF path or `TextGeometry` import is wrong, stop and fix before continuing), the block rotates as you scroll further, and clicking it opens the info panel showing `sirket.profil` with a working "Tüm Sayfayı Gör" link. Confirm Turkish characters (İ, Ş) render correctly in the carved text, not as missing-glyph boxes. Delete the throwaway route afterward if you created one.

- [ ] **Step 6: Commit**

```bash
git add src/components/intro/IntroCanvas.tsx src/components/intro/IntroScene.tsx
git commit -m "feat: add clickable carved-text company block to intro"
```

---

### Task 12: `IntroCanvas` — Featured Product Stage

**Files:**
- Modify: `src/components/intro/IntroCanvas.tsx`
- Modify: `src/components/intro/IntroScene.tsx`

**Interfaces:**
- Consumes: `getProductStageSlice` (Task 4), `UrunKategorisi` (existing).
- Produces: `IntroCanvas` gains props `urunler: UrunKategorisi[]` and `onSelectProduct: (urun: UrunKategorisi) => void`. `IntroScene`'s `activePanel` state gains a `{ type: "product"; urun: UrunKategorisi }` variant.

- [ ] **Step 1: Extend `IntroCanvas` for the product stage**

Add to the imports: `import { getProductStageSlice } from "./introStages";` (alongside the existing `introStages` import — combine into one import statement) and `import type { UrunKategorisi } from "@/sanity/queries";` (alongside the existing `SirketBilgisi` import).

Update the props type:

```ts
type IntroCanvasProps = {
  progress: number;
  sirket: SirketBilgisi | null;
  urunler: UrunKategorisi[];
  onSelectCompany: () => void;
  onSelectProduct: (urun: UrunKategorisi) => void;
};
```

Update the function signature to destructure `urunler` and `onSelectProduct`, and add a ref for the latter (same pattern as `onSelectCompanyRef`):

```ts
const onSelectProductRef = useRef(onSelectProduct);
onSelectProductRef.current = onSelectProduct;
```

After the `companyBlock`/font-loading setup, add the product blocks (one `Mesh` per product, all sharing the marble texture):

```ts
const productBlocks: THREE.Mesh[] = urunler.map(() => {
  const block = createBlock(marbleTexture);
  block.visible = false;
  scene.add(block);
  return block;
});
```

- [ ] **Step 2: Animate the products stage**

Replace the `render()` function's final `else` branch (which currently hides everything for `products`/`contact`) with:

```ts
} else if (stage.id === "products") {
  companyBlock.visible = false;
  mountain.visible = false;
  approachBlocks.forEach((b) => (b.visible = false));
  const { index, localProgress } = getProductStageSlice(p, urunler.length);
  productBlocks.forEach((b, i) => {
    b.visible = i === index;
    if (i === index) {
      b.position.set(0, 0, 0);
      b.rotation.y = localProgress * Math.PI * 0.5;
    }
  });
  camera.position.set(0, 0.3, 3.5);
  camera.lookAt(0, 0, 0);
} else {
  companyBlock.visible = false;
  mountain.visible = false;
  approachBlocks.forEach((b) => (b.visible = false));
  productBlocks.forEach((b) => (b.visible = false));
}
```

- [ ] **Step 3: Extend the click handler**

In `handleClick`, after the existing company-block check, add:

```ts
if (getActiveStage(progressRef.current).id === "products") {
  const visibleProduct = productBlocks.find((b) => b.visible);
  if (visibleProduct) {
    const hits = raycaster.intersectObject(visibleProduct, true);
    if (hits.length > 0) {
      const index = productBlocks.indexOf(visibleProduct);
      const urun = urunlerRef.current[index];
      if (urun) onSelectProductRef.current(urun);
    }
  }
}
```

`urunler` is a prop that could change identity across renders in principle, but the effect only runs once — add `const urunlerRef = useRef(urunler); urunlerRef.current = urunler;` near the other refs at the top of the component, alongside `progressRef`.

- [ ] **Step 4: Wire `IntroScene`'s product panel**

In `src/components/intro/IntroScene.tsx`, widen the panel state type:

```ts
type ActivePanel = { type: "company" } | { type: "product"; urun: UrunKategorisi } | null;
```

(Import `UrunKategorisi` from `@/sanity/queries` alongside the existing type imports.) Change `useState<"company" | null>(null)` to `useState<ActivePanel>(null)`.

Update the `<IntroCanvas>` call to pass the new props and update the company callback's shape to match:

```tsx
<IntroCanvas
  progress={progress}
  sirket={sirket}
  urunler={urunler}
  onSelectCompany={() => setActivePanel({ type: "company" })}
  onSelectProduct={(urun) => setActivePanel({ type: "product", urun })}
/>
```

Update the panel rendering:

```tsx
{activePanel?.type === "company" && sirket && (
  <InfoPanel
    title="Hamman Madencilik A.Ş."
    description={sirket.profil}
    fullPageHref="/hakkimizda"
    onClose={() => setActivePanel(null)}
  />
)}
{activePanel?.type === "product" && (
  <InfoPanel
    title={activePanel.urun.baslik}
    description={
      activePanel.urun.kullanimAlani
        ? `${activePanel.urun.detaylar} ${activePanel.urun.kullanimAlani}`
        : activePanel.urun.detaylar
    }
    fullPageHref="/urunlerimiz"
    onClose={() => setActivePanel(null)}
  />
)}
```

- [ ] **Step 5: Verify the project builds**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 6: Manual browser check**

With the throwaway-route technique, pass a non-empty `urunler` array (2–3 fake `UrunKategorisi` objects) and a `sirket` with a matching `tanitimUrunleri` if testing via the real route. Scroll through the 45%–85% range and confirm: a new block appears for each product in turn (not all at once), each rotates slightly, and clicking the currently-visible one opens the correct product's info panel. Confirm the block sequence never shows two products' blocks simultaneously.

- [ ] **Step 7: Commit**

```bash
git add src/components/intro/IntroCanvas.tsx src/components/intro/IntroScene.tsx
git commit -m "feat: add clickable featured-product block sequence to intro"
```

---

### Task 13: `IntroCanvas` — Contact/Social Cube + Loop-Back

**Files:**
- Modify: `src/components/intro/IntroCanvas.tsx`
- Modify: `src/components/intro/IntroScene.tsx`

**Interfaces:**
- Consumes: `buildContactFaces`, `ContactFace` (Task 5), `IletisimBilgisi` (Task 2/existing).
- Produces: `IntroCanvas` gains props `iletisim: IletisimBilgisi | null`, `activeFaceIndex: number`, `onSelectContact: (face: ContactFace) => void`. `IntroScene` gains face-navigation state, arrow-button UI, and loop-back-on-continued-scroll behavior.

- [ ] **Step 1: Extend `IntroCanvas` for the contact cube**

Add imports: `import { buildContactFaces, type ContactFace } from "./contactCubeFaces";` and `import type { IletisimBilgisi } from "@/sanity/queries";` (alongside existing type imports).

Update the props type:

```ts
type IntroCanvasProps = {
  progress: number;
  sirket: SirketBilgisi | null;
  urunler: UrunKategorisi[];
  iletisim: IletisimBilgisi | null;
  activeFaceIndex: number;
  onSelectCompany: () => void;
  onSelectProduct: (urun: UrunKategorisi) => void;
  onSelectContact: (face: ContactFace) => void;
};
```

Destructure the new props, and add refs (same pattern as before):

```ts
const onSelectContactRef = useRef(onSelectContact);
onSelectContactRef.current = onSelectContact;
const activeFaceIndexRef = useRef(activeFaceIndex);
activeFaceIndexRef.current = activeFaceIndex;
```

Compute the face list once per mount (it only depends on `iletisim`, which doesn't change after initial load in this route):

```ts
const contactFaces = buildContactFaces({
  instagramUrl: iletisim?.instagramUrl,
  facebookUrl: iletisim?.facebookUrl,
  xUrl: iletisim?.xUrl,
  youtubeUrl: iletisim?.youtubeUrl,
  eposta: iletisim?.eposta,
  telefon: iletisim?.telefon,
});
```

Add the cube mesh after the product blocks setup:

```ts
const contactCube = new THREE.Mesh(
  new THREE.BoxGeometry(1.6, 1.6, 1.6),
  new THREE.MeshStandardMaterial({ map: marbleTexture, roughness: 0.4 })
);
contactCube.visible = false;
scene.add(contactCube);
```

- [ ] **Step 2: Animate the contact stage**

Replace the final `else` branch in `render()` (which now only needs to hide product blocks in non-matching stages) with a `contact` branch, keeping a smaller final `else`:

```ts
} else if (stage.id === "contact") {
  companyBlock.visible = false;
  mountain.visible = false;
  approachBlocks.forEach((b) => (b.visible = false));
  productBlocks.forEach((b) => (b.visible = false));
  contactCube.visible = true;
  const faceCount = Math.max(1, contactFaces.length);
  const targetRotation = (activeFaceIndexRef.current / faceCount) * Math.PI * 2;
  contactCube.rotation.y += (targetRotation - contactCube.rotation.y) * 0.1;
  camera.position.set(0, 0, 4);
  camera.lookAt(0, 0, 0);
} else {
  companyBlock.visible = false;
  mountain.visible = false;
  approachBlocks.forEach((b) => (b.visible = false));
  productBlocks.forEach((b) => (b.visible = false));
  contactCube.visible = false;
}
```

- [ ] **Step 3: Extend the click handler**

In `handleClick`, after the products check, add:

```ts
if (getActiveStage(progressRef.current).id === "contact" && contactCube.visible) {
  const hits = raycaster.intersectObject(contactCube, true);
  if (hits.length > 0) {
    const face = contactFaces[activeFaceIndexRef.current];
    if (face) onSelectContactRef.current(face);
  }
}
```

- [ ] **Step 4: Wire `IntroScene`'s face navigation, contact panel, and loop-back**

In `src/components/intro/IntroScene.tsx`:

Import `ContactFace` and `buildContactFaces` from `./contactCubeFaces`, and `IletisimBilgisi` (already imported).

Widen `ActivePanel`:

```ts
type ActivePanel =
  | { type: "company" }
  | { type: "product"; urun: UrunKategorisi }
  | { type: "contact"; face: ContactFace }
  | null;
```

Add face-navigation state and compute the face count:

```ts
const [activeFaceIndex, setActiveFaceIndex] = useState(0);
const contactFaces = buildContactFaces({
  instagramUrl: iletisim?.instagramUrl,
  facebookUrl: iletisim?.facebookUrl,
  xUrl: iletisim?.xUrl,
  youtubeUrl: iletisim?.youtubeUrl,
  eposta: iletisim?.eposta,
  telefon: iletisim?.telefon,
});

function handleSelectContact(face: ContactFace) {
  if (face.external) {
    window.open(face.href, "_blank", "noopener,noreferrer");
  } else {
    setActivePanel({ type: "contact", face });
  }
}

function navigateFace(direction: 1 | -1) {
  if (contactFaces.length === 0) return;
  setActiveFaceIndex((current) => (current + direction + contactFaces.length) % contactFaces.length);
}
```

Add the loop-back effect (alongside the existing scroll-progress effect):

```ts
useEffect(() => {
  if (useFallback || !ready) return;

  function loopBack() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleWheel(event: WheelEvent) {
    if (progress >= 0.999 && event.deltaY > 0) loopBack();
  }

  let touchStartY = 0;
  function handleTouchStart(event: TouchEvent) {
    touchStartY = event.touches[0]?.clientY ?? 0;
  }
  function handleTouchMove(event: TouchEvent) {
    const currentY = event.touches[0]?.clientY ?? touchStartY;
    if (progress >= 0.999 && touchStartY - currentY > 40) loopBack();
  }

  window.addEventListener("wheel", handleWheel, { passive: true });
  window.addEventListener("touchstart", handleTouchStart, { passive: true });
  window.addEventListener("touchmove", handleTouchMove, { passive: true });
  return () => {
    window.removeEventListener("wheel", handleWheel);
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchmove", handleTouchMove);
  };
}, [useFallback, ready, progress]);
```

Update the `<IntroCanvas>` call:

```tsx
<IntroCanvas
  progress={progress}
  sirket={sirket}
  urunler={urunler}
  iletisim={iletisim}
  activeFaceIndex={activeFaceIndex}
  onSelectCompany={() => setActivePanel({ type: "company" })}
  onSelectProduct={(urun) => setActivePanel({ type: "product", urun })}
  onSelectContact={handleSelectContact}
/>
```

Add arrow-navigation buttons and the contact panel, rendered after `<SkipButton />`:

```tsx
{getActiveStage(progress).id === "contact" && contactFaces.length > 1 && (
  <div className="pointer-events-none fixed inset-x-0 top-1/2 z-40 flex -translate-y-1/2 justify-between px-6">
    <button
      type="button"
      onClick={() => navigateFace(-1)}
      aria-label="Önceki"
      className="pointer-events-auto border border-[color:var(--color-stone-cream)]/40 px-3 py-2 text-[color:var(--color-stone-cream)]"
    >
      ←
    </button>
    <button
      type="button"
      onClick={() => navigateFace(1)}
      aria-label="Sonraki"
      className="pointer-events-auto border border-[color:var(--color-stone-cream)]/40 px-3 py-2 text-[color:var(--color-stone-cream)]"
    >
      →
    </button>
  </div>
)}
{activePanel?.type === "contact" && (
  <InfoPanel
    title={activePanel.face.label}
    description={activePanel.face.href.replace(/^mailto:|^tel:/, "")}
    onClose={() => setActivePanel(null)}
  />
)}
```

Add `import { getActiveStage } from "./introStages";` alongside the existing imports (used above to gate the arrow buttons to the `contact` stage only).

- [ ] **Step 5: Verify the project builds**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 6: Manual browser check**

With the throwaway-route technique, pass an `iletisim` object with at least `telefon`/`eposta` filled and one or two social URLs. Scroll to the 85%+ range and confirm: a cube appears, arrow buttons let you navigate between faces without the page scrolling further, clicking a social face opens a new tab, clicking the mail/phone face opens an info panel with the value shown, and — the key behavior — after reaching the very bottom, scrolling/swiping down again smoothly returns you to the mountain scene at the top rather than doing nothing. Also confirm `SkipButton` still works from this stage.

- [ ] **Step 7: Commit**

```bash
git add src/components/intro/IntroCanvas.tsx src/components/intro/IntroScene.tsx
git commit -m "feat: add contact/social cube stage with scroll-loop-back"
```

---

### Task 14: `/tanitim` Route + Ana Sayfa Wiring

**Files:**
- Create: `src/app/tanitim/page.tsx`
- Create: `src/app/tanitim/TanitimClient.tsx`
- Create: `src/components/intro/IntroRedirectGate.tsx`
- Test: `src/components/intro/IntroRedirectGate.test.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `getSirketBilgisi`, `getIletisimBilgisi` (Tasks 2–3), `IntroScene` (Tasks 9–13), `hasSeenIntro` (Task 6).

- [ ] **Step 1: Write the failing test for `IntroRedirectGate`**

```tsx
// src/components/intro/IntroRedirectGate.test.tsx
import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { IntroRedirectGate } from "./IntroRedirectGate";

const replaceMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

describe("IntroRedirectGate", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    replaceMock.mockClear();
  });

  it("redirects to /tanitim when the intro hasn't been seen", () => {
    render(<IntroRedirectGate />);
    expect(replaceMock).toHaveBeenCalledWith("/tanitim");
  });

  it("does not redirect when the intro has already been seen", () => {
    window.sessionStorage.setItem("hamman_intro_seen", "1");
    render(<IntroRedirectGate />);
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("renders nothing", () => {
    const { container } = render(<IntroRedirectGate />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/intro/IntroRedirectGate.test.tsx`
Expected: FAIL — `Cannot find module './IntroRedirectGate'`.

- [ ] **Step 3: Implement `IntroRedirectGate.tsx`**

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasSeenIntro } from "./introSession";

export function IntroRedirectGate() {
  const router = useRouter();

  useEffect(() => {
    if (!hasSeenIntro()) {
      router.replace("/tanitim");
    }
  }, [router]);

  return null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/intro/IntroRedirectGate.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Create `TanitimClient.tsx`**

```tsx
// src/app/tanitim/TanitimClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { IntroScene } from "@/components/intro/IntroScene";
import type { SirketBilgisi, UrunKategorisi, IletisimBilgisi } from "@/sanity/queries";

type TanitimClientProps = {
  sirket: SirketBilgisi | null;
  urunler: UrunKategorisi[];
  iletisim: IletisimBilgisi | null;
};

export function TanitimClient({ sirket, urunler, iletisim }: TanitimClientProps) {
  const router = useRouter();

  return (
    <IntroScene
      sirket={sirket}
      urunler={urunler}
      iletisim={iletisim}
      onFinish={() => router.push("/")}
    />
  );
}
```

- [ ] **Step 6: Create the route at `src/app/tanitim/page.tsx`**

```tsx
import { getSirketBilgisi, getIletisimBilgisi } from "@/sanity/queries";
import { TanitimClient } from "./TanitimClient";

export const metadata = {
  title: "Tanıtım — Hamman Madencilik",
};

export default async function TanitimPage() {
  const [sirket, iletisim] = await Promise.all([getSirketBilgisi(), getIletisimBilgisi()]);
  const urunler = sirket?.tanitimUrunleri ?? [];

  return <TanitimClient sirket={sirket} urunler={urunler} iletisim={iletisim} />;
}
```

- [ ] **Step 7: Wire the redirect gate and "Tanıtımı İzle" link into `src/app/page.tsx`**

Add the import at the top, alongside the existing imports:

```ts
import { IntroRedirectGate } from "@/components/intro/IntroRedirectGate";
```

Change the opening of the returned JSX from:

```tsx
    <main>
      <Hero
```

to:

```tsx
    <main>
      <IntroRedirectGate />
      <Hero
```

Add a third link to the existing CTA row (the `<div className="flex flex-wrap gap-x-6 gap-y-2 px-6 md:px-16">` block that currently contains "ÜRÜNLERİMİZ" and "BİZİ TANIYIN"), so it reads:

```tsx
      <div className="flex flex-wrap gap-x-6 gap-y-2 px-6 md:px-16">
        <Link
          href="/urunlerimiz"
          className="text-xs tracking-[0.08em] text-[color:var(--color-stone-bronze)]"
        >
          ÜRÜNLERİMİZ
        </Link>
        <Link
          href="/hakkimizda"
          className="text-xs tracking-[0.08em] text-[color:var(--color-stone-bronze)]"
        >
          BİZİ TANIYIN
        </Link>
        <Link
          href="/tanitim"
          className="text-xs tracking-[0.08em] text-[color:var(--color-stone-bronze)]"
        >
          TANITIMI İZLE
        </Link>
      </div>
```

- [ ] **Step 8: Verify the project builds**

Run: `npm run build`
Expected: succeeds; route table now lists `/tanitim`.

- [ ] **Step 9: Manual browser check**

Run `npm run dev`. In a fresh private/incognito window (empty sessionStorage): visit `/`, confirm you're immediately redirected to `/tanitim`, scroll through the whole experience once, click Skip partway through, confirm you land on `/`. Reload `/` again in the same window: confirm you now stay on `/` (no redirect). Click the "TANITIMI İZLE" link: confirm it takes you back to `/tanitim` even though the session flag is set. Stop the dev server when done.

- [ ] **Step 10: Commit**

```bash
git add src/app/tanitim src/components/intro/IntroRedirectGate.tsx src/components/intro/IntroRedirectGate.test.tsx src/app/page.tsx
git commit -m "feat: add /tanitim route with first-visit redirect and Tanıtımı İzle link"
```

---

### Task 15: Final Integration, Mobile, and Fallback Verification

**Files:** none (verification only).

- [ ] **Step 1: Run the full test suite**

Run: `npx vitest run`
Expected: all tests pass, including every test added in Tasks 2–14.

- [ ] **Step 2: Run a production build**

Run: `npm run build`
Expected: succeeds; confirm `/tanitim` is listed in the route table and that its First Load JS is meaningfully larger than the other routes (evidence the Three.js bundle is isolated there, not leaking into `/`'s bundle — compare `/`'s First Load JS size against the pre-Faz-4 baseline noted in `docs/superpowers/plans/2026-08-11-faz1-site-implementation.md`'s Task 13 output; it should be materially unchanged).

- [ ] **Step 3: Populate real Sanity data for a full check**

In Sanity Studio (`/studio`), on the Şirket Bilgisi singleton, select 3–5 products in "Tanıtımda Gösterilecek Ürünler". On the İletişim Bilgisi singleton, fill in at least one social URL (or leave all blank to test the "only mail/phone" path) — use placeholder URLs if real ones aren't available yet, e.g. `https://instagram.com/hammanmadencilik`.

- [ ] **Step 4: Full desktop walkthrough**

Start `npm run dev`, open `/` in a fresh session, let the redirect happen, and scroll through the entire experience start to loop-back once, using `preview_start`/`computer`/`read_console_messages` to confirm: no console errors, mountain → blocks → clickable carved company block (correct Turkish text) → each selected product block clickable with correct info → contact cube arrow navigation and click-through (external links open new tabs, mail/phone opens a panel) → continued scroll after the cube loops back to the mountain. Confirm Skip works from at least two different stages.

- [ ] **Step 5: Mobile viewport walkthrough**

Use `resize_window` with the `mobile` preset, reload `/tanitim` fresh, and repeat the key checks: touch-drag scroll advances stages, tapping a block opens its panel, the contact-stage arrow buttons are tappable and correctly sized, no horizontal overflow (`document.documentElement.scrollWidth` should equal the viewport width, checked the same way Faz 1's final review verified this).

- [ ] **Step 6: Fallback path check**

In dev tools (or via `resize_window`'s `colorScheme`/emulation if available, otherwise via the browser's rendering-emulation panel), force `prefers-reduced-motion: reduce` and reload `/tanitim`. Expected: `IntroFallback` renders immediately (no canvas, no scroll-jacking), and its "Ana Sayfaya Geç" button navigates to `/`.

- [ ] **Step 7: Fix anything found, then commit**

If any issue was found and fixed:

```bash
git add -A
git commit -m "fix: address issues found in Faz 4 integration pass"
```

If nothing needed fixing, no commit is required for this task.

---

## Self-Review Notes

- **Spec coverage:** every scene stage (mountain, approach, company, products, contact) has a task (10–13); the skip/session/loop requirements are covered by Tasks 6 and 13–14; the two new Sanity fields are covered by Tasks 2–3; mobile/iOS/Android and reduced-motion/WebGL-fallback requirements are covered by Task 8 (logic) and Task 15 (verification); test-what's-testable vs. build-and-browser-check-the-rest is applied consistently task by task, matching the spec's own Test Yaklaşımı section.
- **Type consistency checked:** `IntroCanvas`'s prop surface grows additively and consistently across Tasks 9–13 (`progress` → `+ sirket, onSelectCompany` → `+ urunler, onSelectProduct` → `+ iletisim, activeFaceIndex, onSelectContact`); `ActivePanel`'s variants in `IntroScene` match exactly what Tasks 11–13 dispatch into `setActivePanel`; `ContactFace`'s shape from Task 5 is consumed unchanged through Task 13.
- **No placeholder content:** all UI copy is real Turkish copy; the carved text is the client-confirmed exact string "HAMMAN MADENCİLİK A.Ş."; test fixtures use realistic (if fictional) data, never "TODO" values.
