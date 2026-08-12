# Hamman Madencilik — Faz 1 Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship a working, content-complete Faz 1 of the new Hamman Madencilik site — a Next.js + Sanity CMS marketing site, styled in the approved "Premium Doğal Taş" direction, populated with the real content scraped from the old site, running locally against a real Sanity dataset.

**Architecture:** Next.js 15 App Router (TypeScript) renders server components that fetch content from Sanity via GROQ queries at request time (`useCdn: true` read client). Content is authored in an embedded Sanity Studio at `/studio`. A thin `/api/iletisim` route handler writes contact-form submissions back into Sanity as `mesaj` documents using a separate write-token client. Presentational pieces (Nav, Footer, Hero, ServiceStrip, ContactForm) are small, independently testable components; pages are thin composition + data-fetching shells.

**Tech Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 (`@theme` tokens, no `tailwind.config.ts`) · Sanity 3 + `next-sanity` (embedded Studio) · Vitest + React Testing Library + jsdom · npm

## Global Constraints

- All UI copy, labels, and content are in **Turkish only** — no i18n in this plan (Faz 3, out of scope).
- Do not touch or reference `docs/reference/globe-prototype.html` — it is Faz 2 scope. Do not build any 3D/globe UI in this plan.
- Do not build a marble-color/texture theme-switcher — it is Faz 2 scope.
- Color tokens (exact, from the approved design): background `#FBFAF7` / `#F5F2EC` / `#E8E2D6`, text `#2b2620`, accent `#8a6f3a`.
- Routes for Faz 1: `/`, `/hizmetlerimiz`, `/urunlerimiz`, `/hakkimizda`, `/santiyelerimiz`, `/iletisim` (six pages — the approved nav mockup showed a distinct "Şantiyeler" link, so it gets its own route separate from `/iletisim`, which carries the contact form).
- Real content (service descriptions, product categories, company profile, addresses) must be transcribed verbatim from `docs/superpowers/specs/2026-08-11-hamman-madencilik-faz1-design.md` and `docs/reference/icerik-envanteri.xlsx` — never placeholder/lorem ipsum text.
- **External prerequisite, blocks Task 4 onward:** this plan requires a Sanity.io project that only a human can create (no Sanity account exists yet for this project). Task 4's first step is a manual, non-automatable setup — do not attempt to script around it.
- Package manager: npm. Node.js 20+.

---

## File Structure

```
hamman-madencilik/
├── package.json, tsconfig.json, next.config.ts, postcss.config.mjs
├── vitest.config.ts, vitest.setup.ts
├── sanity.config.ts                        # Studio config (Task 4)
├── .env.local.example                      # Task 4
├── scripts/
│   └── seed-content.ts                     # writes seed data to Sanity (Task 6)
├── src/
│   ├── app/
│   │   ├── layout.tsx, globals.css, page.tsx      (Task 1, extended Task 3/8)
│   │   ├── hizmetlerimiz/page.tsx           (Task 9)
│   │   ├── urunlerimiz/page.tsx             (Task 10)
│   │   ├── hakkimizda/page.tsx              (Task 11)
│   │   ├── santiyelerimiz/page.tsx          (Task 12)
│   │   ├── iletisim/page.tsx                (Task 12)
│   │   ├── api/iletisim/route.ts            (Task 12)
│   │   └── studio/[[...tool]]/page.tsx      (Task 4)
│   ├── components/
│   │   ├── Nav.tsx (+ .test.tsx)            (Task 2)
│   │   ├── Footer.tsx (+ .test.tsx)         (Task 3)
│   │   ├── Hero.tsx (+ .test.tsx)           (Task 7)
│   │   ├── ServiceStrip.tsx (+ .test.tsx)   (Task 7)
│   │   └── ContactForm.tsx (+ .test.tsx)    (Task 12)
│   ├── lib/
│   │   └── cn.ts (+ .test.ts)               (Task 1)
│   └── sanity/
│       ├── env.ts                           (Task 4)
│       ├── client.ts                        (Task 5)
│       ├── writeClient.ts                   (Task 12)
│       ├── queries.ts (+ .test.ts)          (Task 5)
│       ├── seed-data.ts (+ .test.ts)        (Task 6)
│       └── schemaTypes/
│           ├── hizmet.ts, urunKategorisi.ts, sirketBilgisi.ts,
│           │   iletisimBilgisi.ts, galeriGorseli.ts, sahaTesis.ts   (Task 4)
│           ├── mesaj.ts                     (Task 12)
│           └── index.ts                     (Task 4, modified Task 12)
```

---

### Task 1: Project Scaffolding + `cn()` Utility

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- Create: `src/lib/cn.ts`
- Test: `src/lib/cn.test.ts`

**Interfaces:**
- Produces: `cn(...classes: Array<string | false | null | undefined>): string` — used by every later component task for conditional class joining.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "hamman-madencilik",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest",
    "seed": "tsx scripts/seed-content.ts"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-sanity": "^9.8.0",
    "sanity": "^3.68.0",
    "@sanity/vision": "^3.68.0",
    "styled-components": "^6.1.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "vitest": "^2.1.0",
    "@vitejs/plugin-react": "^4.3.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.5.0",
    "jsdom": "^25.0.0",
    "tsx": "^4.19.0",
    "@sanity/client": "^6.24.0",
    "dotenv": "^16.4.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: installs without error, creates `package-lock.json`.

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 5: Create `postcss.config.mjs`**

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 6: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 7: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 8: Write the failing test for `cn()`**

```ts
// src/lib/cn.test.ts
import { describe, it, expect } from "vitest";
import { cn } from "@/lib/cn";

describe("cn", () => {
  it("joins truthy class names with a space", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("filters out falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
});
```

- [ ] **Step 9: Run test to verify it fails**

Run: `npx vitest run src/lib/cn.test.ts`
Expected: FAIL — `Cannot find module '@/lib/cn'` (file doesn't exist yet).

- [ ] **Step 10: Implement `cn()`**

```ts
// src/lib/cn.ts
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
```

- [ ] **Step 11: Run test to verify it passes**

Run: `npx vitest run src/lib/cn.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 12: Create `src/app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-stone-cream: #FBFAF7;
  --color-stone-ivory: #F5F2EC;
  --color-stone-sand: #E8E2D6;
  --color-stone-ink: #2b2620;
  --color-stone-bronze: #8a6f3a;

  --font-display: "Playfair Display", Georgia, serif;
  --font-body: "Inter", Arial, sans-serif;
}

body {
  background-color: var(--color-stone-cream);
  color: var(--color-stone-ink);
}
```

- [ ] **Step 13: Create `src/app/layout.tsx` (minimal, extended in Task 3)**

```tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Hamman Madencilik",
  description: "Mermer ocak işletmeciliği ve doğal taş üretimi — Konya, Türkiye.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${playfair.variable} font-[family-name:var(--font-body)]`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 14: Create placeholder `src/app/page.tsx` (replaced fully in Task 8)**

```tsx
export default function HomePage() {
  return <main className="p-8">Hamman Madencilik — yapım aşamasında</main>;
}
```

- [ ] **Step 15: Verify the project builds**

Run: `npm run build`
Expected: build succeeds with 0 type errors (ignore font-fetch network warnings if offline — those don't fail the build).

- [ ] **Step 16: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs vitest.config.ts vitest.setup.ts src/lib/cn.ts src/lib/cn.test.ts src/app/layout.tsx src/app/globals.css src/app/page.tsx
git commit -m "feat: scaffold Next.js + Tailwind v4 + Vitest project"
```

---

### Task 2: `Nav` Component

**Files:**
- Create: `src/components/Nav.tsx`
- Test: `src/components/Nav.test.tsx`

**Interfaces:**
- Consumes: nothing (static links).
- Produces: `Nav` — a default-exportable named component `export function Nav()`, no props. Later consumed by `layout.tsx` in Task 3.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/Nav.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Nav } from "./Nav";

describe("Nav", () => {
  it("renders a link for each of the 5 main sections", () => {
    render(<Nav />);

    expect(screen.getByRole("link", { name: "HİZMETLER" })).toHaveAttribute("href", "/hizmetlerimiz");
    expect(screen.getByRole("link", { name: "ÜRÜNLER" })).toHaveAttribute("href", "/urunlerimiz");
    expect(screen.getByRole("link", { name: "ŞANTİYELER" })).toHaveAttribute("href", "/santiyelerimiz");
    expect(screen.getByRole("link", { name: "HAKKIMIZDA" })).toHaveAttribute("href", "/hakkimizda");
    expect(screen.getByRole("link", { name: "İLETİŞİM" })).toHaveAttribute("href", "/iletisim");
  });

  it("renders the company name linking home", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /HAMMAN/ })).toHaveAttribute("href", "/");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Nav.test.tsx`
Expected: FAIL — `Cannot find module './Nav'`.

- [ ] **Step 3: Implement `Nav`**

```tsx
// src/components/Nav.tsx
import Link from "next/link";

const NAV_LINKS = [
  { href: "/hizmetlerimiz", label: "Hizmetler" },
  { href: "/urunlerimiz", label: "Ürünler" },
  { href: "/santiyelerimiz", label: "Şantiyeler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export function Nav() {
  return (
    <header className="flex items-center justify-between border-b border-[color:var(--color-stone-sand)] px-6 py-4 md:px-16">
      <Link href="/" className="font-[family-name:var(--font-display)] text-lg tracking-wide">
        HAMMAN{" "}
        <span className="font-[family-name:var(--font-body)] text-xs tracking-[0.1em] text-[color:var(--color-stone-bronze)]">
          MADENCİLİK
        </span>
      </Link>
      <nav aria-label="Ana menü">
        <ul className="flex gap-5 text-xs tracking-[0.06em]">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label.toLocaleUpperCase("tr-TR")}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Nav.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.tsx src/components/Nav.test.tsx
git commit -m "feat: add Nav component with 5 section links"
```

---

### Task 3: `Footer` Component + Wire Nav/Footer into Layout

**Files:**
- Create: `src/components/Footer.tsx`
- Test: `src/components/Footer.test.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `Footer` — `export function Footer()`, no props.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/Footer.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders the current year and company name", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    expect(screen.getByText(/Hamman Madencilik/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Footer.test.tsx`
Expected: FAIL — `Cannot find module './Footer'`.

- [ ] **Step 3: Implement `Footer`**

```tsx
// src/components/Footer.tsx
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[color:var(--color-stone-sand)] px-6 py-8 text-xs text-[color:var(--color-stone-ink)]/70 md:px-16">
      <p>© {year} Hamman Madencilik. Tüm hakları saklıdır.</p>
    </footer>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Footer.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Wire `Nav` and `Footer` into the root layout**

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Hamman Madencilik",
  description: "Mermer ocak işletmeciliği ve doğal taş üretimi — Konya, Türkiye.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${playfair.variable} font-[family-name:var(--font-body)]`}>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Verify the project still builds**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/components/Footer.tsx src/components/Footer.test.tsx src/app/layout.tsx
git commit -m "feat: add Footer, wire Nav+Footer into root layout"
```

---

### Task 4: Sanity Project Setup + Content Schemas + Embedded Studio

**⚠️ Manual prerequisite before Step 1 — cannot be automated:**
1. Go to https://www.sanity.io/manage and create a free account/project (or ask the project owner to do this and share the Project ID).
2. Note the **Project ID** shown on the project's overview page.
3. In that project, confirm a dataset named `production` exists (Sanity creates one by default).
4. Under **API → Tokens**, create a token named "Website Write" with **Editor** permissions, and copy it somewhere safe (shown only once).

**Files:**
- Create: `.env.local.example`, `.env.local` (not committed — already gitignored)
- Create: `src/sanity/env.ts`
- Create: `src/sanity/schemaTypes/hizmet.ts`, `urunKategorisi.ts`, `sirketBilgisi.ts`, `iletisimBilgisi.ts`, `galeriGorseli.ts`, `sahaTesis.ts`, `index.ts`
- Create: `sanity.config.ts`
- Create: `src/app/studio/[[...tool]]/page.tsx`

**Interfaces:**
- Produces: `apiVersion`, `dataset`, `projectId` exports from `src/sanity/env.ts` — consumed by Task 5's `client.ts` and Task 12's `writeClient.ts`.
- Produces: Sanity document types `hizmet`, `urunKategorisi`, `sirketBilgisi`, `iletisimBilgisi`, `galeriGorseli`, `sahaTesis` — field names consumed by Task 5's GROQ queries.

- [ ] **Step 1: Create `.env.local.example`**

```bash
# .env.local.example
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-01-01
SANITY_API_WRITE_TOKEN=your-editor-token
```

- [ ] **Step 2: Create `.env.local` with real values**

Copy `.env.local.example` to `.env.local` and fill in the real Project ID, dataset (`production`), and the write token from the manual prerequisite above.

- [ ] **Step 3: Create `src/sanity/env.ts`**

```ts
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-01-01";

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
);
```

- [ ] **Step 4: Create the six schema files**

```ts
// src/sanity/schemaTypes/hizmet.ts
import { defineField, defineType } from "sanity";

export const hizmet = defineType({
  name: "hizmet",
  title: "Hizmet",
  type: "document",
  fields: [
    defineField({ name: "baslik", title: "Başlık", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "aciklama", title: "Açıklama", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
    defineField({ name: "gorsel", title: "Görsel", type: "image", options: { hotspot: true } }),
    defineField({ name: "sira", title: "Sıra", type: "number", validation: (Rule) => Rule.required() }),
  ],
  orderings: [{ title: "Sıra", name: "siraAsc", by: [{ field: "sira", direction: "asc" }] }],
  preview: { select: { title: "baslik", subtitle: "aciklama" } },
});
```

```ts
// src/sanity/schemaTypes/urunKategorisi.ts
import { defineField, defineType } from "sanity";

export const urunKategorisi = defineType({
  name: "urunKategorisi",
  title: "Ürün Kategorisi",
  type: "document",
  fields: [
    defineField({ name: "baslik", title: "Başlık", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "detaylar", title: "Detaylar", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
    defineField({ name: "kullanimAlani", title: "Kullanım Alanı", type: "text", rows: 2 }),
    defineField({ name: "gorsel", title: "Görsel", type: "image", options: { hotspot: true } }),
    defineField({ name: "sira", title: "Sıra", type: "number", validation: (Rule) => Rule.required() }),
  ],
  orderings: [{ title: "Sıra", name: "siraAsc", by: [{ field: "sira", direction: "asc" }] }],
  preview: { select: { title: "baslik", subtitle: "detaylar" } },
});
```

```ts
// src/sanity/schemaTypes/sirketBilgisi.ts
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
  ],
  preview: { prepare: () => ({ title: "Şirket Bilgisi (tekil)" }) },
});
```

```ts
// src/sanity/schemaTypes/iletisimBilgisi.ts
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
  ],
  preview: { prepare: () => ({ title: "İletişim Bilgisi (tekil)" }) },
});
```

```ts
// src/sanity/schemaTypes/galeriGorseli.ts
import { defineField, defineType } from "sanity";

export const galeriGorseli = defineType({
  name: "galeriGorseli",
  title: "Galeri Görseli",
  type: "document",
  fields: [
    defineField({ name: "baslik", title: "Başlık", type: "string" }),
    defineField({ name: "gorsel", title: "Görsel", type: "image", options: { hotspot: true }, validation: (Rule) => Rule.required() }),
    defineField({ name: "sira", title: "Sıra", type: "number" }),
  ],
  orderings: [{ title: "Sıra", name: "siraAsc", by: [{ field: "sira", direction: "asc" }] }],
  preview: { select: { title: "baslik", media: "gorsel" } },
});
```

```ts
// src/sanity/schemaTypes/sahaTesis.ts
// NOTE: schema only, for Faz 2 (the globe). No documents are seeded against this
// type in Faz 1 — do not build any UI consuming it yet.
import { defineField, defineType } from "sanity";

export const sahaTesis = defineType({
  name: "sahaTesis",
  title: "Saha / Tesis (Faz 2)",
  type: "document",
  fields: [
    defineField({ name: "kod", title: "Kod", type: "string" }),
    defineField({ name: "sehir", title: "Şehir", type: "string" }),
    defineField({ name: "ulke", title: "Ülke", type: "string" }),
    defineField({ name: "enlem", title: "Enlem", type: "number" }),
    defineField({ name: "boylam", title: "Boylam", type: "number" }),
    defineField({ name: "kaynak", title: "Kaynak", type: "string" }),
    defineField({ name: "durum", title: "Durum", type: "string" }),
    defineField({ name: "not", title: "Not", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "sehir", subtitle: "kod" } },
});
```

```ts
// src/sanity/schemaTypes/index.ts
import type { SchemaTypeDefinition } from "sanity";
import { hizmet } from "./hizmet";
import { urunKategorisi } from "./urunKategorisi";
import { sirketBilgisi } from "./sirketBilgisi";
import { iletisimBilgisi } from "./iletisimBilgisi";
import { galeriGorseli } from "./galeriGorseli";
import { sahaTesis } from "./sahaTesis";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [hizmet, urunKategorisi, sirketBilgisi, iletisimBilgisi, galeriGorseli, sahaTesis],
};
```

- [ ] **Step 5: Create `sanity.config.ts` at the project root**

```ts
// sanity.config.ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";

export default defineConfig({
  name: "hamman-madencilik-studio",
  title: "Hamman Madencilik",
  projectId,
  dataset,
  basePath: "/studio",
  schema,
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
});
```

- [ ] **Step 6: Create the embedded Studio route**

```tsx
// src/app/studio/[[...tool]]/page.tsx
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

- [ ] **Step 7: Verify the Studio loads**

Run: `npm run dev`, open `http://localhost:3000/studio` in a browser.
Expected: Sanity Studio loads showing the 6 document types (Hizmet, Ürün Kategorisi, Şirket Bilgisi, İletişim Bilgisi, Galeri Görseli, Saha / Tesis) in the sidebar, no console errors.

- [ ] **Step 8: Commit**

```bash
git add .env.local.example sanity.config.ts src/sanity/env.ts src/sanity/schemaTypes src/app/studio
git commit -m "feat: add Sanity schemas and embedded Studio at /studio"
```

---

### Task 5: Sanity Read Client + Typed Query Helpers

**Files:**
- Create: `src/sanity/client.ts`
- Create: `src/sanity/queries.ts`
- Test: `src/sanity/queries.test.ts`

**Interfaces:**
- Consumes: `apiVersion`, `dataset`, `projectId` from `src/sanity/env.ts` (Task 4).
- Produces: `getHizmetler(): Promise<Hizmet[]>`, `getUrunler(): Promise<UrunKategorisi[]>`, `getSirketBilgisi(): Promise<SirketBilgisi | null>`, `getIletisimBilgisi(): Promise<IletisimBilgisi | null>` — consumed by every page task (8–12). Types `Hizmet`, `UrunKategorisi`, `SirketBilgisi`, `IletisimBilgisi` are also exported for reuse.

- [ ] **Step 1: Create `src/sanity/client.ts`**

```ts
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
```

- [ ] **Step 2: Write the failing tests for the query helpers**

```ts
// src/sanity/queries.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getHizmetler, getUrunler } from "./queries";
import { client } from "./client";

vi.mock("./client", () => ({
  client: { fetch: vi.fn() },
}));

describe("queries", () => {
  beforeEach(() => {
    vi.mocked(client.fetch).mockReset();
  });

  it("getHizmetler returns the fetched list", async () => {
    const fake = [{ _id: "1", baslik: "Test Hizmet", aciklama: "...", gorselUrl: null, sira: 1 }];
    vi.mocked(client.fetch).mockResolvedValueOnce(fake);

    const result = await getHizmetler();

    expect(result).toEqual(fake);
    expect(client.fetch).toHaveBeenCalledTimes(1);
  });

  it("getUrunler returns the fetched list", async () => {
    const fake = [{ _id: "1", baslik: "Blok Mermer", detaylar: "...", kullanimAlani: null, gorselUrl: null, sira: 1 }];
    vi.mocked(client.fetch).mockResolvedValueOnce(fake);

    const result = await getUrunler();

    expect(result).toEqual(fake);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/sanity/queries.test.ts`
Expected: FAIL — `Cannot find module './queries'`.

- [ ] **Step 4: Implement `src/sanity/queries.ts`**

```ts
import { client } from "./client";

export type Hizmet = {
  _id: string;
  baslik: string;
  aciklama: string;
  gorselUrl: string | null;
  sira: number;
};

export type UrunKategorisi = {
  _id: string;
  baslik: string;
  detaylar: string;
  kullanimAlani: string | null;
  gorselUrl: string | null;
  sira: number;
};

export type SirketBilgisi = {
  profil: string;
  vizyon: string;
  misyon: string;
  degerler: string[];
  sertifikalar: string[];
  ekipMetni: string;
};

export type IletisimBilgisi = {
  santiyeAdresi: string;
  ofisAdresi: string;
  telefon: string;
  eposta: string;
};

const HIZMET_QUERY = `*[_type == "hizmet"] | order(sira asc){
  _id, baslik, aciklama, "gorselUrl": gorsel.asset->url, sira
}`;

const URUN_QUERY = `*[_type == "urunKategorisi"] | order(sira asc){
  _id, baslik, detaylar, kullanimAlani, "gorselUrl": gorsel.asset->url, sira
}`;

const SIRKET_QUERY = `*[_type == "sirketBilgisi"][0]{
  profil, vizyon, misyon, degerler, sertifikalar, ekipMetni
}`;

const ILETISIM_QUERY = `*[_type == "iletisimBilgisi"][0]{
  santiyeAdresi, ofisAdresi, telefon, eposta
}`;

export async function getHizmetler(): Promise<Hizmet[]> {
  return client.fetch(HIZMET_QUERY);
}

export async function getUrunler(): Promise<UrunKategorisi[]> {
  return client.fetch(URUN_QUERY);
}

export async function getSirketBilgisi(): Promise<SirketBilgisi | null> {
  return client.fetch(SIRKET_QUERY);
}

export async function getIletisimBilgisi(): Promise<IletisimBilgisi | null> {
  return client.fetch(ILETISIM_QUERY);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/sanity/queries.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add src/sanity/client.ts src/sanity/queries.ts src/sanity/queries.test.ts
git commit -m "feat: add Sanity read client and typed query helpers"
```

---

### Task 6: Seed Data + Seed Script

**Files:**
- Create: `src/sanity/seed-data.ts`
- Test: `src/sanity/seed-data.test.ts`
- Create: `scripts/seed-content.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `hizmetler: SeedHizmet[]`, `urunler: SeedUrun[]`, `sirketBilgisi`, `iletisimBilgisi` — consumed only by `scripts/seed-content.ts` in this task.

- [ ] **Step 1: Write the failing tests for the seed data**

```ts
// src/sanity/seed-data.test.ts
import { describe, it, expect } from "vitest";
import { hizmetler, urunler, sirketBilgisi, iletisimBilgisi } from "./seed-data";

describe("seed-data", () => {
  it("has exactly 7 hizmetler with sequential sira 1-7", () => {
    expect(hizmetler).toHaveLength(7);
    expect(hizmetler.map((h) => h.sira)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("has exactly 10 urunler with sequential sira 1-10", () => {
    expect(urunler).toHaveLength(10);
    expect(urunler.map((u) => u.sira)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("every hizmet has a non-empty baslik and aciklama", () => {
    for (const h of hizmetler) {
      expect(h.baslik.length).toBeGreaterThan(0);
      expect(h.aciklama.length).toBeGreaterThan(0);
    }
  });

  it("sirketBilgisi has 6 değerler and 6 sertifikalar", () => {
    expect(sirketBilgisi.degerler).toHaveLength(6);
    expect(sirketBilgisi.sertifikalar).toHaveLength(6);
  });

  it("iletisimBilgisi has both addresses populated", () => {
    expect(iletisimBilgisi.santiyeAdresi.length).toBeGreaterThan(0);
    expect(iletisimBilgisi.ofisAdresi.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/sanity/seed-data.test.ts`
Expected: FAIL — `Cannot find module './seed-data'`.

- [ ] **Step 3: Implement `src/sanity/seed-data.ts`** (verbatim content from the design spec / content inventory)

```ts
export type SeedHizmet = { baslik: string; aciklama: string; sira: number };
export type SeedUrun = { baslik: string; detaylar: string; kullanimAlani: string | null; sira: number };

export const hizmetler: SeedHizmet[] = [
  { baslik: "Mermer Ocak İşletmeciliği", aciklama: "Modern üretim teknikleri, yüksek tonajlı makine parkı ve deneyimli ekip ile mermer rezervlerinin profesyonel şekilde çıkarılmasını sağlıyoruz. Üretim alanımızda verimlilik, iş güvenliği ve çevresel sürdürülebilirlik en önemli önceliklerdir.", sira: 1 },
  { baslik: "Doğal Taş Üretimi", aciklama: "Farklı renk ve dokulardaki mermer çeşitlerini blok, plaka ve ebatlanmış ürünler halinde üretip hem yurtiçi hem yurtdışı müşterilerimize sunuyoruz.", sira: 2 },
  { baslik: "Blok Mermer Kesimi", aciklama: "Ocağımızdan çıkan büyük ebatlı bloklar, hassas kesim makineleri ile standart ya da özel ölçülere göre kesilerek sevkiyata hazır hale getirilir.", sira: 3 },
  { baslik: "Jeolojik Etüt & Ar-Ge", aciklama: "Ocak sahasının jeolojik analizleri yapılır, rezerv yapısı belirlenir, üretim planlaması bilimsel verilere dayandırılır. En verimli üretim yöntemleri Ar-Ge çalışmalarımızla sürekli geliştirilmektedir.", sira: 4 },
  { baslik: "Çevresel Etki Değerlendirme (ÇED)", aciklama: "ÇED raporu hazırlanması, çevre izni süreçleri, toz–gürültü kontrolü, rehabilitasyon planları ve sürdürülebilir ocak yönetimi konusunda danışmanlık ve uygulama hizmeti sunuyoruz.", sira: 5 },
  { baslik: "Proje Yönetimi", aciklama: "Yeni ocak açılışı, kapasite artırımı, altyapı yatırımları, saha planlaması ve üretim süreçlerinin uçtan uca profesyonel şekilde yönetilmesini sağlıyoruz.", sira: 6 },
  { baslik: "Lojistik & İhracat", aciklama: "Blok mermer, plaka ve işlenmiş taş ürünlerinin kara, deniz ve konteyner lojistiği uzman kadromuzla gerçekleştirilir. İhracat sürecindeki tüm resmi işlemler müşteriler adına takip edilir.", sira: 7 },
];

export const urunler: SeedUrun[] = [
  { baslik: "Blok Mermer", detaylar: "Ocaktan çıkarılan doğal bloklar. İhracata uygun, 1. sınıf kalite sınıflandırması. Renk, damar yapısı ve homojenlik kriterlerine göre ayrılmış blok çeşitleri.", kullanimAlani: "Yurt içi ve yurt dışı fabrikalara sevkiyat, büyük ölçekli mimari projeler.", sira: 1 },
  { baslik: "Plaka Mermer (Slab)", detaylar: "2–3 cm kalınlıklarda. Cila, honlama, kumlama, patinato yüzey seçenekleri. Modern plaka kesim hatlarında hazırlanmış geniş ebatlı plakalar.", kullanimAlani: "Mutfak tezgahları, zemin kaplama, merdiven, duvar kaplama, iç mimari projeler.", sira: 2 },
  { baslik: "Ebatlı Mermer Ürünleri", detaylar: "Ölçüler: 30×60, 60×60, 40×80, 45×90, projeye özel ölçüler. Yüzey seçenekleri: cilalı, honlu, eskitme, fırçalı, kumlamalı.", kullanimAlani: null, sira: 3 },
  { baslik: "Mermer Fayans", detaylar: "İnce işçilikle hazırlanmış standart karo ölçüleri. Seramik alternatifi fakat tamamen doğal taş görünümü.", kullanimAlani: "Zemin, duvar, banyo, otel ve konut projeleri.", sira: 4 },
  { baslik: "Özel Tasarım Mermer Ürünleri", detaylar: "Mermer lavabo, mermer masa–sehpa, mermer dekoratif objeler, mermer şömine, mermer merdiven basamak ve denizlikleri.", kullanimAlani: null, sira: 5 },
  { baslik: "Mermer Basamak & Kaplama Ürünleri", detaylar: "Merdiven basamak, denizlik, pencere söve, kapı eşik mermeri, dış cephe özel kaplama levha ürünleri.", kullanimAlani: null, sira: 6 },
  { baslik: "Split Face (Kırma Yüzey) Taşlar", detaylar: "Duvar kaplamalarında kullanılan dekoratif yüzey. İç ve dış mimari için doğal taş görünümü.", kullanimAlani: null, sira: 7 },
  { baslik: "Patlatma Mermer", detaylar: "Küçük ebatlı dekoratif taş ürünleri. Farklı renk ve damar yapılarında seçenekler.", kullanimAlani: null, sira: 8 },
  { baslik: "Mermer Mozaik", detaylar: "Küçük parçaların birleştirilmesiyle oluşturulan dekoratif yüzeyler. Altıgen, kare, şerit, merdiven bordürü gibi özel tasarımlar.", kullanimAlani: null, sira: 9 },
  { baslik: "Projeye Özel Kesim ve Uygulama", detaylar: "Mimar ve proje sahiplerinin istediği özel ölçülere göre üretim. CNC kesim. Waterjet desen çalışmaları. Özel yüzey işlemleri.", kullanimAlani: null, sira: 10 },
];

export const sirketBilgisi = {
  _id: "sirketBilgisi-singleton",
  _type: "sirketBilgisi" as const,
  profil: "Firmamız, mermer madenciliği alanında uzmanlaşmış, yüksek üretim kapasitesine sahip, teknolojiyi yakından takip eden bir mermer ocak işletmesidir. Üretim süreçlerimizin her aşamasında kalite, güvenlik ve sürdürülebilirlik ilkelerini benimseyerek yerli ve uluslararası pazara hizmet veriyoruz.",
  vizyon: "Türkiye'nin en güvenilir, çevresel duyarlılık standartlarına uyan ve yenilikçi mermer üretim şirketleri arasında lider konuma ulaşmak.",
  misyon: "Doğal kaynakları en doğru şekilde değerlendirerek yüksek kaliteli mermer ürünleri üretmek; müşteri memnuniyetini, güvenliği ve çevreyi ön planda tutmak.",
  degerler: ["Sürdürülebilir üretim", "Güvenli çalışma ortamı", "Dürüst ticaret", "Teknolojik gelişime açık yapı", "Müşteri memnuniyeti", "Çevreye saygı"],
  sertifikalar: ["ÇED Raporu", "İşletme Ruhsatı", "ISO 9001 Kalite Yönetim Sistemi", "ISO 14001 Çevre Yönetim Sistemi", "İSG Yönetim Sertifikaları", "İhracat Yetki Belgesi"],
  ekipMetni: "Alanında uzman mühendisler, jeologlar, saha yöneticileri, operatörler ve deneyimli lojistik ekibimiz ile üretimden sevkiyata kadar tüm süreçleri profesyonel bir şekilde yönetiyoruz.",
};

export const iletisimBilgisi = {
  _id: "iletisimBilgisi-singleton",
  _type: "iletisimBilgisi" as const,
  santiyeAdresi: "Yeni Mahalle 41360. Sokak Beyparkgold Sitesi B1 Blok No:9 Beyşehir / KONYA",
  ofisAdresi: "Altınkum Mahallesi 423. Sokak Kaya Plaza Sitesi, Kaya Plaza Blok No:35 Konyaaltı / ANTALYA",
  telefon: "+90.532.151 42 37",
  eposta: "info@hammanmadencilik.com.tr",
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/sanity/seed-data.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Implement `scripts/seed-content.ts`**

```ts
import { createClient } from "@sanity/client";
import "dotenv/config";
import { hizmetler, urunler, sirketBilgisi, iletisimBilgisi } from "../src/sanity/seed-data";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET or SANITY_API_WRITE_TOKEN in .env.local"
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-01-01",
  token,
  useCdn: false,
});

async function seed() {
  console.log("Hizmetler ekleniyor...");
  for (const hizmet of hizmetler) {
    await client.create({ _type: "hizmet", ...hizmet });
  }

  console.log("Ürünler ekleniyor...");
  for (const urun of urunler) {
    await client.create({ _type: "urunKategorisi", ...urun });
  }

  console.log("Şirket bilgisi ekleniyor...");
  await client.createOrReplace(sirketBilgisi);

  console.log("İletişim bilgisi ekleniyor...");
  await client.createOrReplace(iletisimBilgisi);

  console.log("Tamamlandı.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 6: Run the seed script against the real Sanity dataset**

Run: `npm run seed`
Expected: prints each step and "Tamamlandı." with no errors. Verify in `http://localhost:3000/studio` that 7 Hizmet, 10 Ürün Kategorisi documents exist, plus one Şirket Bilgisi and one İletişim Bilgisi document.

- [ ] **Step 7: Commit**

```bash
git add src/sanity/seed-data.ts src/sanity/seed-data.test.ts scripts/seed-content.ts
git commit -m "feat: add seed data and seed script, populate Sanity with real content"
```

---

### Task 7: `Hero` + `ServiceStrip` Components

**Files:**
- Create: `src/components/Hero.tsx`, `src/components/Hero.test.tsx`
- Create: `src/components/ServiceStrip.tsx`, `src/components/ServiceStrip.test.tsx`

**Interfaces:**
- Produces: `Hero(props: { eyebrow: string; title: string; emphasis: string; description: string })` and `ServiceStrip(props: { items: Array<{ _id: string; baslik: string }> })` — both consumed by the Ana Sayfa in Task 8.

- [ ] **Step 1: Write the failing test for `Hero`**

```tsx
// src/components/Hero.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders the eyebrow, title, emphasis and description", () => {
    render(
      <Hero
        eyebrow="Konya & Antalya · 1985'ten Bu Yana"
        title="Doğanın taşına,"
        emphasis="ustanın dokunuşu."
        description="Mermer ocak işletmeciliğinden ihracata."
      />
    );

    expect(screen.getByText("Konya & Antalya · 1985'ten Bu Yana")).toBeInTheDocument();
    expect(screen.getByText("Doğanın taşına,")).toBeInTheDocument();
    expect(screen.getByText("ustanın dokunuşu.")).toBeInTheDocument();
    expect(screen.getByText("Mermer ocak işletmeciliğinden ihracata.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Hero.test.tsx`
Expected: FAIL — `Cannot find module './Hero'`.

- [ ] **Step 3: Implement `Hero`**

```tsx
// src/components/Hero.tsx
type HeroProps = {
  eyebrow: string;
  title: string;
  emphasis: string;
  description: string;
};

export function Hero({ eyebrow, title, emphasis, description }: HeroProps) {
  return (
    <section className="flex min-h-[70vh] flex-col justify-center gap-4 px-6 py-16 md:flex-row md:items-center md:gap-12 md:px-16">
      <div className="max-w-xl">
        <p className="mb-3 text-xs uppercase tracking-[0.16em] text-[color:var(--color-stone-bronze)]">
          {eyebrow}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl leading-tight md:text-5xl">
          {title}
          <br />
          <em className="not-italic text-[color:var(--color-stone-bronze)]">{emphasis}</em>
        </h1>
        <p className="mt-4 max-w-md text-sm text-[color:var(--color-stone-ink)]/80">{description}</p>
      </div>
      <div
        aria-hidden="true"
        className="h-64 w-full rounded-sm bg-gradient-to-br from-white via-[color:var(--color-stone-sand)] to-[#C9BFA6] md:h-80 md:flex-1"
      />
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Hero.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Write the failing test for `ServiceStrip`**

```tsx
// src/components/ServiceStrip.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ServiceStrip } from "./ServiceStrip";

const items = [
  { _id: "1", baslik: "Mermer Ocak İşletmeciliği" },
  { _id: "2", baslik: "Blok & Plaka Üretimi" },
  { _id: "3", baslik: "Lojistik & İhracat" },
  { _id: "4", baslik: "ÇED & Sürdürülebilirlik" },
  { _id: "5", baslik: "Beşinci Hizmet" },
];

describe("ServiceStrip", () => {
  it("renders only the first 4 items, numbered 01-04", () => {
    render(<ServiceStrip items={items} />);

    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();
    expect(screen.queryByText("05")).not.toBeInTheDocument();
    expect(screen.getByText("Mermer Ocak İşletmeciliği")).toBeInTheDocument();
    expect(screen.queryByText("Beşinci Hizmet")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/components/ServiceStrip.test.tsx`
Expected: FAIL — `Cannot find module './ServiceStrip'`.

- [ ] **Step 7: Implement `ServiceStrip`**

```tsx
// src/components/ServiceStrip.tsx
type ServiceStripItem = {
  _id: string;
  baslik: string;
};

type ServiceStripProps = {
  items: ServiceStripItem[];
};

export function ServiceStrip({ items }: ServiceStripProps) {
  const visible = items.slice(0, 4);

  return (
    <ul className="grid grid-cols-1 gap-px bg-[color:var(--color-stone-sand)] sm:grid-cols-2 md:grid-cols-4">
      {visible.map((item, index) => (
        <li key={item._id} className="bg-[color:var(--color-stone-cream)] p-6">
          <span className="text-xs tracking-[0.08em] text-[color:var(--color-stone-bronze)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="mt-1 text-sm">{item.baslik}</p>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/components/ServiceStrip.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 9: Commit**

```bash
git add src/components/Hero.tsx src/components/Hero.test.tsx src/components/ServiceStrip.tsx src/components/ServiceStrip.test.tsx
git commit -m "feat: add Hero and ServiceStrip components"
```

---

### Task 8: Ana Sayfa (Home Page)

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `Hero`, `ServiceStrip` (Task 7); `getHizmetler`, `getSirketBilgisi` (Task 5).

- [ ] **Step 1: Replace `src/app/page.tsx`**

```tsx
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ServiceStrip } from "@/components/ServiceStrip";
import { getHizmetler, getSirketBilgisi } from "@/sanity/queries";

export default async function HomePage() {
  const [hizmetler, sirket] = await Promise.all([getHizmetler(), getSirketBilgisi()]);

  return (
    <main>
      <Hero
        eyebrow="Konya & Antalya · 1985'ten Bu Yana"
        title="Doğanın taşına,"
        emphasis="ustanın dokunuşu."
        description="Mermer ocak işletmeciliğinden ihracata, üretimin her aşamasında kalite ve sürdürülebilirlik."
      />
      <ServiceStrip items={hizmetler} />
      {sirket && (
        <section className="px-6 py-16 md:px-16">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Hakkımızda</h2>
          <p className="mt-4 max-w-2xl text-sm text-[color:var(--color-stone-ink)]/80">{sirket.profil}</p>
          <Link
            href="/hakkimizda"
            className="mt-4 inline-block text-xs tracking-[0.08em] text-[color:var(--color-stone-bronze)]"
          >
            DEVAMINI OKU →
          </Link>
        </section>
      )}
      <section className="border-t border-[color:var(--color-stone-sand)] px-6 py-16 md:px-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">Bize Ulaşın</h2>
        <Link
          href="/iletisim"
          className="mt-4 inline-block text-xs tracking-[0.08em] text-[color:var(--color-stone-bronze)]"
        >
          İLETİŞİM →
        </Link>
      </section>
    </main>
  );
}
```

This is an async server component fetching live Sanity data — not practical to unit-test with jsdom/RTL. Its test cycle is the build + a manual browser check (folded into Task 13, which checks all pages together).

- [ ] **Step 2: Verify the project builds**

Run: `npm run build`
Expected: build succeeds; note that build-time data fetching requires `.env.local` to be present with valid Sanity credentials (from Task 4).

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: build Ana Sayfa from live Sanity content"
```

---

### Task 9: Hizmetlerimiz Page

**Files:**
- Create: `src/app/hizmetlerimiz/page.tsx`

**Interfaces:**
- Consumes: `getHizmetler` (Task 5).

- [ ] **Step 1: Implement the page**

```tsx
import { getHizmetler } from "@/sanity/queries";

export const metadata = {
  title: "Hizmetlerimiz — Hamman Madencilik",
};

export default async function HizmetlerimizPage() {
  const hizmetler = await getHizmetler();

  return (
    <main className="px-6 py-16 md:px-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">Hizmetlerimiz</h1>
      <ul className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        {hizmetler.map((hizmet) => (
          <li key={hizmet._id} className="border-t border-[color:var(--color-stone-sand)] pt-4">
            <h2 className="text-lg">{hizmet.baslik}</h2>
            <p className="mt-2 text-sm text-[color:var(--color-stone-ink)]/80">{hizmet.aciklama}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

- [ ] **Step 2: Verify the project builds**

Run: `npm run build`
Expected: build succeeds, `/hizmetlerimiz` route listed in the output.

- [ ] **Step 3: Commit**

```bash
git add src/app/hizmetlerimiz/page.tsx
git commit -m "feat: add Hizmetlerimiz page"
```

---

### Task 10: Ürünlerimiz Page

**Files:**
- Create: `src/app/urunlerimiz/page.tsx`

**Interfaces:**
- Consumes: `getUrunler` (Task 5).

- [ ] **Step 1: Implement the page**

```tsx
import { getUrunler } from "@/sanity/queries";

export const metadata = {
  title: "Ürünlerimiz — Hamman Madencilik",
};

export default async function UrunlerimizPage() {
  const urunler = await getUrunler();

  return (
    <main className="px-6 py-16 md:px-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">Ürünlerimiz</h1>
      <ul className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        {urunler.map((urun) => (
          <li key={urun._id} className="border-t border-[color:var(--color-stone-sand)] pt-4">
            <h2 className="text-lg">{urun.baslik}</h2>
            <p className="mt-2 text-sm text-[color:var(--color-stone-ink)]/80">{urun.detaylar}</p>
            {urun.kullanimAlani && (
              <p className="mt-2 text-xs uppercase tracking-[0.06em] text-[color:var(--color-stone-bronze)]">
                {urun.kullanimAlani}
              </p>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
```

- [ ] **Step 2: Verify the project builds**

Run: `npm run build`
Expected: build succeeds, `/urunlerimiz` route listed in the output.

- [ ] **Step 3: Commit**

```bash
git add src/app/urunlerimiz/page.tsx
git commit -m "feat: add Ürünlerimiz page"
```

---

### Task 11: Hakkımızda Page

**Files:**
- Create: `src/app/hakkimizda/page.tsx`

**Interfaces:**
- Consumes: `getSirketBilgisi` (Task 5).

- [ ] **Step 1: Implement the page**

```tsx
import { getSirketBilgisi } from "@/sanity/queries";

export const metadata = {
  title: "Hakkımızda — Hamman Madencilik",
};

export default async function HakkimizdaPage() {
  const sirket = await getSirketBilgisi();

  if (!sirket) {
    return (
      <main className="px-6 py-16 md:px-16">
        <p>İçerik yakında eklenecek.</p>
      </main>
    );
  }

  return (
    <main className="px-6 py-16 md:px-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">Hakkımızda</h1>
      <p className="mt-6 max-w-2xl text-sm text-[color:var(--color-stone-ink)]/80">{sirket.profil}</p>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-lg">Vizyon</h2>
          <p className="mt-2 text-sm text-[color:var(--color-stone-ink)]/80">{sirket.vizyon}</p>
        </div>
        <div>
          <h2 className="text-lg">Misyon</h2>
          <p className="mt-2 text-sm text-[color:var(--color-stone-ink)]/80">{sirket.misyon}</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg">Değerlerimiz</h2>
        <ul className="mt-2 flex flex-wrap gap-2 text-xs">
          {sirket.degerler.map((deger) => (
            <li key={deger} className="border border-[color:var(--color-stone-sand)] px-3 py-1">
              {deger}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="text-lg">Belgeler & Sertifikalar</h2>
        <ul className="mt-2 flex flex-wrap gap-2 text-xs">
          {sirket.sertifikalar.map((belge) => (
            <li key={belge} className="border border-[color:var(--color-stone-sand)] px-3 py-1">
              {belge}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="text-lg">Ekibimiz</h2>
        <p className="mt-2 text-sm text-[color:var(--color-stone-ink)]/80">{sirket.ekipMetni}</p>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify the project builds**

Run: `npm run build`
Expected: build succeeds, `/hakkimizda` route listed in the output.

- [ ] **Step 3: Commit**

```bash
git add src/app/hakkimizda/page.tsx
git commit -m "feat: add Hakkımızda page"
```

---

### Task 12: Şantiyelerimiz + İletişim Pages, `ContactForm`, and Submit API Route

**Files:**
- Create: `src/sanity/schemaTypes/mesaj.ts`
- Modify: `src/sanity/schemaTypes/index.ts`
- Create: `src/sanity/writeClient.ts`
- Create: `src/components/ContactForm.tsx`, `src/components/ContactForm.test.tsx`
- Create: `src/app/api/iletisim/route.ts`, `src/app/api/iletisim/route.test.ts`
- Create: `src/app/santiyelerimiz/page.tsx`
- Create: `src/app/iletisim/page.tsx`

**Interfaces:**
- Consumes: `getIletisimBilgisi` (Task 5), `writeClient` (this task).
- Produces: `POST /api/iletisim` — accepts `{ adSoyad, eposta, konu, mesaj }`, returns `{ ok: true }` (200) or `{ error }` (400).

- [ ] **Step 1: Add the `mesaj` schema and register it**

```ts
// src/sanity/schemaTypes/mesaj.ts
import { defineField, defineType } from "sanity";

export const mesaj = defineType({
  name: "mesaj",
  title: "İletişim Formu Mesajı",
  type: "document",
  fields: [
    defineField({ name: "adSoyad", title: "Ad Soyad", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "eposta", title: "E-posta", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "konu", title: "Konu", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "mesaj", title: "Mesaj", type: "text", rows: 4 }),
    defineField({ name: "gonderimTarihi", title: "Gönderim Tarihi", type: "datetime" }),
  ],
  preview: { select: { title: "adSoyad", subtitle: "konu" } },
});
```

```ts
// src/sanity/schemaTypes/index.ts
import type { SchemaTypeDefinition } from "sanity";
import { hizmet } from "./hizmet";
import { urunKategorisi } from "./urunKategorisi";
import { sirketBilgisi } from "./sirketBilgisi";
import { iletisimBilgisi } from "./iletisimBilgisi";
import { galeriGorseli } from "./galeriGorseli";
import { sahaTesis } from "./sahaTesis";
import { mesaj } from "./mesaj";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [hizmet, urunKategorisi, sirketBilgisi, iletisimBilgisi, galeriGorseli, sahaTesis, mesaj],
};
```

- [ ] **Step 2: Create the write client**

```ts
// src/sanity/writeClient.ts
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  throw new Error("Missing environment variable: SANITY_API_WRITE_TOKEN");
}

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});
```

- [ ] **Step 3: Write the failing tests for the API route**

```ts
// src/app/api/iletisim/route.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { writeClient } from "@/sanity/writeClient";

vi.mock("@/sanity/writeClient", () => ({
  writeClient: { create: vi.fn() },
}));

describe("POST /api/iletisim", () => {
  beforeEach(() => {
    vi.mocked(writeClient.create).mockReset();
  });

  it("returns 400 when required fields are missing", async () => {
    const request = new Request("http://localhost/api/iletisim", {
      method: "POST",
      body: JSON.stringify({ adSoyad: "", eposta: "", konu: "", mesaj: "" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(writeClient.create).not.toHaveBeenCalled();
  });

  it("creates a mesaj document and returns ok for valid input", async () => {
    vi.mocked(writeClient.create).mockResolvedValueOnce({} as never);
    const request = new Request("http://localhost/api/iletisim", {
      method: "POST",
      body: JSON.stringify({
        adSoyad: "Test Kullanıcı",
        eposta: "test@example.com",
        konu: "Bilgi talebi",
        mesaj: "Merhaba",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
    expect(writeClient.create).toHaveBeenCalledWith(
      expect.objectContaining({ _type: "mesaj", adSoyad: "Test Kullanıcı" })
    );
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npx vitest run src/app/api/iletisim/route.test.ts`
Expected: FAIL — `Cannot find module './route'`.

- [ ] **Step 5: Implement the route handler**

```ts
// src/app/api/iletisim/route.ts
import { NextResponse } from "next/server";
import { writeClient } from "@/sanity/writeClient";

type IletisimPayload = {
  adSoyad: string;
  eposta: string;
  konu: string;
  mesaj: string;
};

function isValidPayload(value: unknown): value is IletisimPayload {
  if (typeof value !== "object" || value === null) return false;
  const payload = value as Record<string, unknown>;
  return (
    typeof payload.adSoyad === "string" &&
    payload.adSoyad.trim().length > 0 &&
    typeof payload.eposta === "string" &&
    payload.eposta.trim().length > 0 &&
    typeof payload.konu === "string" &&
    payload.konu.trim().length > 0 &&
    typeof payload.mesaj === "string"
  );
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Geçersiz form verisi." }, { status: 400 });
  }

  await writeClient.create({
    _type: "mesaj",
    adSoyad: body.adSoyad,
    eposta: body.eposta,
    konu: body.konu,
    mesaj: body.mesaj,
    gonderimTarihi: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run src/app/api/iletisim/route.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 7: Write the failing tests for `ContactForm`**

```tsx
// src/components/ContactForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ContactForm } from "./ContactForm";

describe("ContactForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("shows a validation error and does not call fetch when required fields are empty", async () => {
    render(<ContactForm />);

    fireEvent.click(screen.getByRole("button", { name: /gönder/i }));

    expect(await screen.findByText(/zorunludur/i)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("submits the form and shows a success message on a successful response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 200 }));
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/ad soyad/i), { target: { value: "Test Kullanıcı" } });
    fireEvent.change(screen.getByLabelText(/e-posta/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/konu/i), { target: { value: "Bilgi talebi" } });

    fireEvent.click(screen.getByRole("button", { name: /gönder/i }));

    await waitFor(() => {
      expect(screen.getByText(/mesajınız alındı/i)).toBeInTheDocument();
    });
    expect(fetch).toHaveBeenCalledWith("/api/iletisim", expect.objectContaining({ method: "POST" }));
  });

  it("shows an error message when the request fails", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500 }));
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/ad soyad/i), { target: { value: "Test Kullanıcı" } });
    fireEvent.change(screen.getByLabelText(/e-posta/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/konu/i), { target: { value: "Bilgi talebi" } });

    fireEvent.click(screen.getByRole("button", { name: /gönder/i }));

    await waitFor(() => {
      expect(screen.getByText(/gönderilemedi/i)).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 8: Run test to verify it fails**

Run: `npx vitest run src/components/ContactForm.test.tsx`
Expected: FAIL — `Cannot find module './ContactForm'`.

- [ ] **Step 9: Implement `ContactForm`**

```tsx
// src/components/ContactForm.tsx
"use client";

import { useState, type FormEvent } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setErrorMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      adSoyad: String(formData.get("adSoyad") ?? "").trim(),
      eposta: String(formData.get("eposta") ?? "").trim(),
      konu: String(formData.get("konu") ?? "").trim(),
      mesaj: String(formData.get("mesaj") ?? "").trim(),
    };

    if (!payload.adSoyad || !payload.eposta || !payload.konu) {
      setState("error");
      setErrorMessage("Ad Soyad, E-posta ve Konu alanları zorunludur.");
      return;
    }

    try {
      const response = await fetch("/api/iletisim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("İstek başarısız oldu");
      }

      setState("success");
      form.reset();
    } catch {
      setState("error");
      setErrorMessage("Mesajınız gönderilemedi, lütfen daha sonra tekrar deneyin.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="adSoyad" className="text-xs uppercase tracking-[0.08em]">
          Ad Soyad *
        </label>
        <input id="adSoyad" name="adSoyad" type="text" required className="border border-[color:var(--color-stone-sand)] px-3 py-2 text-sm" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="eposta" className="text-xs uppercase tracking-[0.08em]">
          E-posta *
        </label>
        <input id="eposta" name="eposta" type="email" required className="border border-[color:var(--color-stone-sand)] px-3 py-2 text-sm" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="konu" className="text-xs uppercase tracking-[0.08em]">
          Konu *
        </label>
        <input id="konu" name="konu" type="text" required className="border border-[color:var(--color-stone-sand)] px-3 py-2 text-sm" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="mesaj" className="text-xs uppercase tracking-[0.08em]">
          Mesajınız
        </label>
        <textarea id="mesaj" name="mesaj" rows={4} className="border border-[color:var(--color-stone-sand)] px-3 py-2 text-sm" />
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="self-start bg-[color:var(--color-stone-ink)] px-6 py-3 text-xs uppercase tracking-[0.08em] text-[color:var(--color-stone-cream)] disabled:opacity-50"
      >
        {state === "submitting" ? "Gönderiliyor..." : "Gönder"}
      </button>

      {state === "success" && <p className="text-xs text-green-700">Mesajınız alındı, teşekkürler.</p>}
      {state === "error" && errorMessage && <p className="text-xs text-red-700">{errorMessage}</p>}
    </form>
  );
}
```

- [ ] **Step 10: Run test to verify it passes**

Run: `npx vitest run src/components/ContactForm.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 11: Create the Şantiyelerimiz page**

```tsx
// src/app/santiyelerimiz/page.tsx
import { getIletisimBilgisi } from "@/sanity/queries";

export const metadata = {
  title: "Şantiyelerimiz — Hamman Madencilik",
};

export default async function SantiyelerimizPage() {
  const iletisim = await getIletisimBilgisi();

  return (
    <main className="px-6 py-16 md:px-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">Şantiyelerimiz</h1>
      {iletisim && (
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-lg">Konya Şantiyesi</h2>
            <p className="mt-2 text-sm text-[color:var(--color-stone-ink)]/80">{iletisim.santiyeAdresi}</p>
          </div>
          <div>
            <h2 className="text-lg">Antalya Ofisi</h2>
            <p className="mt-2 text-sm text-[color:var(--color-stone-ink)]/80">{iletisim.ofisAdresi}</p>
          </div>
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 12: Create the İletişim page**

```tsx
// src/app/iletisim/page.tsx
import { ContactForm } from "@/components/ContactForm";
import { getIletisimBilgisi } from "@/sanity/queries";

export const metadata = {
  title: "İletişim — Hamman Madencilik",
};

export default async function IletisimPage() {
  const iletisim = await getIletisimBilgisi();

  return (
    <main className="grid grid-cols-1 gap-12 px-6 py-16 md:grid-cols-2 md:px-16">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Bize Ulaşın</h1>
        {iletisim && (
          <dl className="mt-6 flex flex-col gap-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.08em] text-[color:var(--color-stone-bronze)]">Telefon</dt>
              <dd className="mt-1">{iletisim.telefon}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.08em] text-[color:var(--color-stone-bronze)]">E-posta</dt>
              <dd className="mt-1">{iletisim.eposta}</dd>
            </div>
          </dl>
        )}
      </div>
      <ContactForm />
    </main>
  );
}
```

- [ ] **Step 13: Verify the project builds**

Run: `npm run build`
Expected: build succeeds, `/santiyelerimiz`, `/iletisim`, and `/api/iletisim` all listed in the output.

- [ ] **Step 14: Commit**

```bash
git add src/sanity/schemaTypes/mesaj.ts src/sanity/schemaTypes/index.ts src/sanity/writeClient.ts src/components/ContactForm.tsx src/components/ContactForm.test.tsx src/app/api/iletisim src/app/santiyelerimiz/page.tsx src/app/iletisim/page.tsx
git commit -m "feat: add Şantiyelerimiz + İletişim pages, ContactForm, and /api/iletisim"
```

---

### Task 13: Final Integration and Responsive Verification

**Files:** none (verification only).

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all tests pass (Nav, Footer, Hero, ServiceStrip, ContactForm, queries, seed-data, route — roughly 17 tests across 8 files).

- [ ] **Step 2: Run a production build**

Run: `npm run build`
Expected: succeeds, lists all 6 page routes + the `/studio` catch-all + `/api/iletisim`.

- [ ] **Step 3: Start the dev server and open it in the Browser pane**

Run: `npm run dev`, then use `preview_start` with `{ url: "http://localhost:3000" }`.

- [ ] **Step 4: Visually check every route at desktop width**

Navigate to `/`, `/hizmetlerimiz`, `/urunlerimiz`, `/hakkimizda`, `/santiyelerimiz`, `/iletisim`. For each: confirm the cream/bronze palette renders, the Nav shows all 5 links plus the wordmark, the Footer shows the current year, and the real content (not placeholder text) appears — e.g. `/hizmetlerimiz` shows all 7 services, `/urunlerimiz` shows all 10 product categories.

- [ ] **Step 5: Resize to mobile width and re-check**

Use `resize_window` with the `mobile` preset, reload each route, confirm no horizontal overflow and the layouts stack to one column.

- [ ] **Step 6: Exercise the contact form end-to-end**

On `/iletisim`, fill in Ad Soyad / E-posta / Konu, submit, confirm the "Mesajınız alındı" success message appears. Then open `/studio`, find the new "İletişim Formu Mesajı" document, and confirm the submitted values are there.

- [ ] **Step 7: Fix anything found, then commit**

If any visual or functional issue was found and fixed:

```bash
git add -A
git commit -m "fix: address issues found in Faz 1 integration pass"
```

If nothing needed fixing, no commit is required for this task.

---

## Self-Review Notes

- **Spec coverage:** every "Sayfa Yapısı" item in the design spec has a task (Ana Sayfa → Task 8, Hizmetlerimiz → 9, Ürünlerimiz → 10, Hakkımızda → 11, Şantiyelerimiz/İletişim → 12); the CMS requirement is Tasks 4–6; the design tokens are wired in Task 1 and used throughout; Faz 2/3 items are explicitly excluded per Global Constraints.
- **Type consistency checked:** `Hizmet`/`UrunKategorisi`/`SirketBilgisi`/`IletisimBilgisi` types from Task 5 are used with matching field names in every consuming page (Tasks 8–12) and in `seed-data.ts` (Task 6, matching schema field names from Task 4).
- **No placeholder content:** all seeded text is transcribed verbatim from the approved design spec / content inventory, not lorem ipsum.
