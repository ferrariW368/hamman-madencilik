/**
 * Builds the subsetted three.js "typeface JSON" font used by the carved text in
 * the intro scene (`src/components/intro/IntroCanvas.tsx`).
 *
 * Why this exists instead of loading the TTF at runtime:
 * three's `TTFLoader` cannot be imported in this project. In three@0.185.x its
 * line 5 is `import opentype from 'https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/+esm'`
 * — a bare URL import, which Next.js's webpack rejects with `UnhandledSchemeError`
 * and the build fails. `FontLoader` and `TextGeometry` are clean; only `TTFLoader`
 * is poisoned. So the TTF -> typeface-JSON conversion that `TTFLoader.parse()`
 * would do in the browser is done here instead, once, at authoring time, with
 * opentype.js as a devDependency. The result is a static asset that `FontLoader`
 * parses natively, so no font-parsing code ships to the client at all.
 *
 * The conversion below is a faithful port of `TTFLoader.parse()`'s `convert()`
 * (three r185, non-reversed path) — same scale factor, same command tokens, same
 * `resolution: 1000` — restricted to the characters CARVED_TEXT actually needs.
 * The full font has 1101 glyphs; the carved string needs 13.
 *
 * Run: node scripts/generate-carved-font.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_TTF = resolve(ROOT, "public/fonts/PlayfairDisplay-Bold.ttf");
const OUTPUT_JSON = resolve(ROOT, "public/fonts/playfair-display-bold-carved.typeface.json");

// Must stay in sync with CARVED_TEXT in src/components/intro/IntroCanvas.tsx.
// The Turkish glyphs I (U+0130) and S (U+015E) are the whole reason this is
// subsetted by hand rather than to plain A-Z: they must be real outlines.
const CARVED_TEXT = "HAMMAN MADENCİLİK A.Ş.";

const font = opentype.parse(toArrayBuffer(readFileSync(SOURCE_TTF)));

const round = Math.round;
const scale = 100000 / ((font.unitsPerEm || 2048) * 72);

const glyphs = {};
const missing = [];

for (const char of new Set(Array.from(CARVED_TEXT))) {
  const glyphIndex = font.charToGlyphIndex(char);
  if (!glyphIndex) {
    missing.push(`U+${char.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")} (${char})`);
    continue;
  }

  const glyph = font.glyphs.get(glyphIndex);
  let outline = "";

  for (const command of glyph.path.commands) {
    // opentype emits cubics as 'C'; typeface JSON spells them 'b'.
    const type = command.type.toLowerCase() === "c" ? "b" : command.type.toLowerCase();
    outline += `${type} `;
    if (command.x !== undefined && command.y !== undefined) {
      outline += `${round(command.x * scale)} ${round(command.y * scale)} `;
    }
    if (command.x1 !== undefined && command.y1 !== undefined) {
      outline += `${round(command.x1 * scale)} ${round(command.y1 * scale)} `;
    }
    if (command.x2 !== undefined && command.y2 !== undefined) {
      outline += `${round(command.x2 * scale)} ${round(command.y2 * scale)} `;
    }
  }

  glyphs[char] = {
    ha: round(glyph.advanceWidth * scale),
    // Empty glyphs (the space) carry no bounding box; three ignores these two
    // fields, but 0 keeps the JSON free of nulls.
    x_min: round((glyph.xMin ?? 0) * scale),
    x_max: round((glyph.xMax ?? 0) * scale),
    o: outline,
  };
}

if (missing.length > 0) {
  throw new Error(
    `PlayfairDisplay-Bold.ttf has no glyph for: ${missing.join(", ")}. ` +
      `The carved company name would render with holes — refusing to write the subset.`
  );
}

const typeface = {
  glyphs,
  familyName: font.getEnglishName("fullName"),
  ascender: round(font.ascender * scale),
  descender: round(font.descender * scale),
  underlinePosition: font.tables.post.underlinePosition,
  underlineThickness: font.tables.post.underlineThickness,
  boundingBox: {
    xMin: font.tables.head.xMin,
    xMax: font.tables.head.xMax,
    yMin: font.tables.head.yMin,
    yMax: font.tables.head.yMax,
  },
  resolution: 1000,
  original_font_information: font.tables.name,
};

writeFileSync(OUTPUT_JSON, JSON.stringify(typeface), "utf8");

const bytes = readFileSync(OUTPUT_JSON).length;
console.log(
  `Wrote ${OUTPUT_JSON}\n` +
    `  ${Object.keys(glyphs).length} glyphs (of ${font.glyphs.length} in the source font), ${bytes} bytes`
);

function toArrayBuffer(buffer) {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}
