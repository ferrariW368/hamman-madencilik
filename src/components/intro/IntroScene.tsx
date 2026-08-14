"use client";

import { useEffect, useRef, useState } from "react";
import { IntroCanvas } from "./IntroCanvas";
import { IntroFallback } from "./IntroFallback";
import { InfoPanel } from "./InfoPanel";
import { SkipButton } from "./SkipButton";
import { getActiveStage, getProductStageSlice } from "./introStages";
import { shouldUseFallback, detectWebGLSupport, detectPrefersReducedMotion } from "./shouldUseFallback";
import type { SirketBilgisi, UrunKategorisi, IletisimBilgisi } from "@/sanity/queries";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

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
          onSelectCompany={() => setActivePanel({ stage: "company" })}
          onSelectProduct={(urun) => setActivePanel({ stage: "products", urun })}
        />
      </div>
      <SkipButton />
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
