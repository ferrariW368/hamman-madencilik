"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { IntroCanvas } from "./IntroCanvas";
import { IntroFallback } from "./IntroFallback";
import { InfoPanel } from "./InfoPanel";
import { SkipButton } from "./SkipButton";
import { getActiveStage, getProductStageSlice } from "./introStages";
import { buildContactFaces, type ContactFace } from "./contactCubeFaces";
import { shouldUseFallback, detectWebGLSupport, detectPrefersReducedMotion } from "./shouldUseFallback";
import type { SirketBilgisi, UrunKategorisi, IletisimBilgisi } from "@/sanity/queries";

// How close to the end counts as "the end". Progress is a float derived from
// scrollY against a 600vh container, so it reaches exactly 1 only when the
// browser reports the last pixel; sub-pixel device ratios routinely land on
// 0.9997. Anything at or past this is the bottom.
const LOOP_BACK_THRESHOLD = 0.999;

// A guard window, not an animation duration. One downward flick emits a burst
// of wheel events over several hundred milliseconds, and each one would
// re-issue window.scrollTo and fight the smooth scroll already running. The
// window only has to outlast that burst plus the couple of frames before
// progress starts falling — once progress drops below LOOP_BACK_THRESHOLD the
// condition itself stops matching and this stops mattering. It is deliberately
// a cooldown rather than a latch that clears on arrival: if the browser
// cancels the programmatic smooth scroll (which user scroll input does), a
// latch would leave the loop-back permanently dead, whereas a cooldown simply
// lets the next flick try again.
const LOOP_BACK_COOLDOWN_MS = 1000;

// Downward swipe distance, in CSS pixels, that counts as "keep going" on touch.
const LOOP_BACK_TOUCH_THRESHOLD_PX = 40;

/**
 * Development-only assertion that this component owns the whole page.
 *
 * `updateProgress` divides document-level `window.scrollY` by *this element's*
 * scrollable height. That is only the same coordinate system while the scroll
 * track is the first and only thing in the document flow. Anything rendered
 * above it offsets `window.scrollY` from the track's own top, so every stage
 * boundary lands early; anything below it lets the page keep scrolling after
 * progress has already saturated at 1, unpinning the sticky canvas and
 * scrolling the scene off screen. Neither throws, neither logs, and neither is
 * visible in a unit test — the numbers are simply wrong, which is why this
 * check exists at all: it is the loudest cheap signal available for a failure
 * that is otherwise entirely silent.
 *
 * Compiled out of production builds: `process.env.NODE_ENV` is inlined at build
 * time, so the whole body is dead code the minifier drops.
 */
function warnIfMiscalibrated(el: HTMLDivElement) {
  if (process.env.NODE_ENV === "production") return;
  const above = el.offsetTop;
  const below = document.documentElement.scrollHeight - el.scrollHeight - above;
  // A pixel of tolerance, not an exact match. `offsetTop` and both
  // `scrollHeight`s are integers rounded from independently computed layout
  // boxes, so at fractional browser zoom (110%, 125% — ordinary settings) the
  // two can round apart by 1px on a page that is in fact perfectly calibrated.
  // Exact equality made that fire a paragraph-long warning describing a
  // catastrophic mis-calibration that had not happened. This is the only
  // detector the branch has for its highest-consequence silent failure, and a
  // guard that cries wolf is one developers learn to scroll past — so the
  // tolerance protects the signal. It is far below the real failure's
  // magnitude: site chrome cost 61px above and 81px below when it was live.
  if (Math.abs(above) <= 1 && Math.abs(below) <= 1) return;
  console.warn(
    `[IntroScene] Scroll progress is mis-calibrated: ${above}px of layout above the ` +
      `scroll track and ${below}px below it. Progress is computed from this element's ` +
      `own height against document-level window.scrollY, so the stage boundaries are ` +
      `now offset and the sticky canvas will unpin before the page bottom — silently, ` +
      `with no error. The cause is almost always site chrome on a route that is ` +
      `supposed to be bare: add this route to CHROMELESS_ROUTES in ` +
      `src/components/SiteChrome.tsx so the header and footer are not rendered, or ` +
      `remove whatever else shares the page with IntroScene.`
  );
}

/**
 * True only for an absolute `http:`/`https:` URL.
 *
 * `window.open` in `handleSelectContact` is the only outbound sink in the whole
 * branch, and the string it is handed comes from Sanity verbatim —
 * `buildContactFaces` passes it through untouched. The schema's `type: "url"`
 * validation is a Studio-side form check: it does not cover documents written
 * through the API, imported content, or documents that predate the field's
 * validation rule, so it cannot be the only gate. Anything that is not
 * absolute http(s) — `javascript:`, `data:`, a bare relative path, a malformed
 * string — is rejected here and falls back to the panel.
 *
 * Parsed with `URL` rather than string-matched: a prefix test on the raw string
 * is easy to write in a way that a leading space, a tab or a mixed-case scheme
 * slips past, and `URL` normalises all three before reporting the protocol. No
 * base is passed, so a relative href throws rather than inheriting the site's
 * own origin and looking safe.
 */
function isHttpUrl(href: string): boolean {
  try {
    const { protocol } = new URL(href);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

// A panel is owned by the stage that opened it and lives exactly as long as
// that stage is active. The owning stage is stored *on* the panel rather than
// inferred from the panel's value, because the two stop coinciding here: the
// `products` stage is sub-divided per product, so its panel carries a product
// and cannot be spelled the same as its StageId. Comparing the panel value
// itself against the active stage id — which is what this did while `"company"`
// happened to be both the panel and the stage name — would then never match,
// and the product panel would be cleared on the render right after it opened.
// TypeScript would not have caught it: `{ type: … } !== "products"` is a legal
// comparison. One rule, keyed on an explicit field; Task 13 adds
// `{ stage: "contact" }` and inherits it unchanged.
type ActivePanel =
  | { stage: "company" }
  | { stage: "products"; urun: UrunKategorisi }
  | { stage: "contact"; face: ContactFace }
  | null;

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
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [activeFaceIndex, setActiveFaceIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  // The loop-back listeners must see the current progress, but they must not be
  // torn down and re-registered every time it changes — progress updates once
  // per animation frame while scrolling, so a `progress` dependency would mean
  // three removeEventListener/addEventListener pairs per frame for the whole
  // intro. Same ref-instead-of-dep pattern IntroCanvas uses.
  const progressRef = useRef(progress);
  progressRef.current = progress;
  // Timestamp of the last loop-back we issued; see LOOP_BACK_COOLDOWN_MS.
  const lastLoopBackAt = useRef(0);

  // Rebuilt only when the CMS data changes, not on every progress tick.
  const contactFaces = useMemo(
    () =>
      buildContactFaces({
        instagramUrl: iletisim?.instagramUrl,
        facebookUrl: iletisim?.facebookUrl,
        xUrl: iletisim?.xUrl,
        youtubeUrl: iletisim?.youtubeUrl,
        eposta: iletisim?.eposta,
        telefon: iletisim?.telefon,
      }),
    [iletisim]
  );

  // Scrolling out of a panel's stage dismisses it. Without this the panel stays
  // pinned to the viewport for the rest of the intro — there is no backdrop and
  // no scroll lock, so the page keeps scrolling underneath it — and IntroCanvas'
  // stage-gated click handler can only stop new opens, never close an open one.
  // Adjusting during render rather than in an effect means the stale panel is
  // never committed, so it cannot flash for a frame on a fast scroll.
  const activeStageId = getActiveStage(progress).id;
  // The products stage is sub-divided one slice per product, so for a product
  // panel the owner is the *slice*, not merely the stage: scrolling from one
  // product's slice into the next must retire the previous product's panel, or
  // it would sit open describing a product whose block has left the screen.
  // Same rule as the stage check, applied at the granularity that stage owns.
  const staleProductPanel =
    activePanel?.stage === "products" &&
    urunler[getProductStageSlice(progress, urunler.length).index]?._id !== activePanel.urun._id;
  // Same rule again, at the granularity the contact stage owns. Its subject is
  // not the stage but the *selected face*, and unlike the products stage that
  // selection changes without any scrolling — pressing an arrow turns a new
  // channel to camera while the panel still describes the old one. Leaving it
  // open would put "Telefon" and its number on screen next to the Instagram
  // face, which is precisely the wrong-channel confusion the labels exist to
  // prevent. Compared on `href` rather than object identity, so a re-render
  // that rebuilds the face list does not spuriously close the panel.
  const staleContactPanel =
    activePanel?.stage === "contact" &&
    contactFaces[activeFaceIndex]?.href !== activePanel.face.href;
  if (
    activePanel !== null &&
    (activePanel.stage !== activeStageId || staleProductPanel || staleContactPanel)
  ) {
    setActivePanel(null);
  }

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
      if (!el) {
        rafId.current = null;
        return;
      }
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
    window.addEventListener("resize", onScroll);
    updateProgress();
    if (scrollRef.current) warnIfMiscalibrated(scrollRef.current);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      rafId.current = null;
    };
  }, [useFallback, ready]);

  // The plan's headline behaviour: there is no hard end. Scrolling (or swiping)
  // onward at the bottom returns to the mountain instead of doing nothing, so
  // the experience is a cycle rather than a dead end.
  //
  // It listens for *input* rather than for progress reaching 1, because at the
  // bottom the page cannot scroll any further: the wheel and touchmove events
  // still arrive, but they produce no scroll and therefore no progress change.
  // A progress-driven trigger would fire the moment the user first touched the
  // bottom and yank the page away from them.
  useEffect(() => {
    if (useFallback || !ready) return;

    function loopBack() {
      const now = Date.now();
      if (now - lastLoopBackAt.current < LOOP_BACK_COOLDOWN_MS) return;
      lastLoopBackAt.current = now;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function atEnd() {
      return progressRef.current >= LOOP_BACK_THRESHOLD;
    }

    function handleWheel(event: WheelEvent) {
      if (atEnd() && event.deltaY > 0) loopBack();
    }

    let touchStartY = 0;
    function handleTouchStart(event: TouchEvent) {
      touchStartY = event.touches[0]?.clientY ?? 0;
    }
    function handleTouchMove(event: TouchEvent) {
      const currentY = event.touches[0]?.clientY ?? touchStartY;
      if (atEnd() && touchStartY - currentY > LOOP_BACK_TOUCH_THRESHOLD_PX) loopBack();
    }

    // Passive: none of these call preventDefault, and the page must keep
    // scrolling normally everywhere except at the very bottom.
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [useFallback, ready]);

  function handleSelectContact(face: ContactFace) {
    if (face.external && isHttpUrl(face.href)) {
      // Called synchronously from the canvas click handler, which is itself
      // inside a real user gesture — so this is not treated as a popup.
      window.open(face.href, "_blank", "noopener,noreferrer");
    } else {
      // Either a mail/phone channel, or a social URL that failed the scheme
      // check. Showing it in the panel is the right degradation for both: the
      // visitor still sees the value the CMS holds and can act on it, instead of
      // a click that either does nothing or does something unintended.
      setActivePanel({ stage: "contact", face });
    }
  }

  function navigateFace(direction: 1 | -1) {
    if (contactFaces.length === 0) return;
    setActiveFaceIndex((current) => (current + direction + contactFaces.length) % contactFaces.length);
  }

  if (!ready) return null;

  if (useFallback) {
    return <IntroFallback onContinue={onFinish} />;
  }

  return (
    <div ref={scrollRef} style={{ height: "600vh" }} className="relative bg-[color:var(--color-stone-ink)]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <IntroCanvas
          progress={progress}
          sirket={sirket}
          urunler={urunler}
          iletisim={iletisim}
          activeFaceIndex={activeFaceIndex}
          onSelectCompany={() => setActivePanel({ stage: "company" })}
          onSelectProduct={(urun) => setActivePanel({ stage: "products", urun })}
          onSelectContact={handleSelectContact}
        />
      </div>
      <SkipButton />
      {/* Only worth showing when there is more than one channel to turn between:
          with zero faces the cube is not even rendered, and with one the arrows
          would be two controls that visibly do nothing. The wrapper is
          pointer-events-none so it never eats a click meant for the cube.

          z-50, above InfoPanel's z-40: on desktop the panel sits at right-10 and
          is up to max-w-xl wide, so it overlaps the right arrow, and at equal
          z-index the panel won the stacking order (it comes later in the DOM)
          and made that arrow unclickable while a panel was open. Raising the
          arrows keeps every control reachable, and the ink background keeps them
          legible over whatever they land on. Same layer as SkipButton, which is
          in the opposite corner and overlaps neither. */}
      {activeStageId === "contact" && contactFaces.length > 1 && (
        <div className="pointer-events-none fixed inset-x-0 top-1/2 z-50 flex -translate-y-1/2 justify-between px-6">
          <button
            type="button"
            onClick={() => navigateFace(-1)}
            aria-label="Önceki"
            className="pointer-events-auto border border-[color:var(--color-stone-cream)]/40 bg-[color:var(--color-stone-ink)]/85 px-3 py-2 text-[color:var(--color-stone-cream)]"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => navigateFace(1)}
            aria-label="Sonraki"
            className="pointer-events-auto border border-[color:var(--color-stone-cream)]/40 bg-[color:var(--color-stone-ink)]/85 px-3 py-2 text-[color:var(--color-stone-cream)]"
          >
            →
          </button>
        </div>
      )}
      {activePanel?.stage === "contact" && (
        <InfoPanel
          title={activePanel.face.label}
          description={activePanel.face.href.replace(/^mailto:|^tel:/, "")}
          onClose={() => setActivePanel(null)}
        />
      )}
      {activePanel?.stage === "company" && sirket && (
        <InfoPanel
          title="Hamman Madencilik A.Ş."
          description={sirket.profil}
          fullPageHref="/hakkimizda"
          onClose={() => setActivePanel(null)}
        />
      )}
      {activePanel?.stage === "products" && (
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
    </div>
  );
}
