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
  if (activePanel !== null && (activePanel.stage !== activeStageId || staleProductPanel)) {
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
    if (face.external) {
      // Called synchronously from the canvas click handler, which is itself
      // inside a real user gesture — so this is not treated as a popup.
      window.open(face.href, "_blank", "noopener,noreferrer");
    } else {
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
          pointer-events-none so it never eats a click meant for the cube. */}
      {activeStageId === "contact" && contactFaces.length > 1 && (
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
