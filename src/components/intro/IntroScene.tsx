"use client";

import { useEffect, useRef, useState } from "react";
import { IntroCanvas } from "./IntroCanvas";
import { IntroFallback } from "./IntroFallback";
import { InfoPanel } from "./InfoPanel";
import { SkipButton } from "./SkipButton";
import { getActiveStage } from "./introStages";
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
  // A panel is named after the stage that opens it, and lives exactly as long as
  // that stage. Tasks 12-13 widen this union with "products" / "contact" and
  // inherit the dismissal below unchanged, because the rule is keyed on the
  // stage changing rather than on any particular stage.
  const [activePanel, setActivePanel] = useState<"company" | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  // Scrolling out of a panel's stage dismisses it. Without this the panel stays
  // pinned to the viewport for the rest of the intro — there is no backdrop and
  // no scroll lock, so the page keeps scrolling underneath it — and IntroCanvas'
  // stage-gated click handler can only stop new opens, never close an open one.
  // Adjusting during render rather than in an effect means the stale panel is
  // never committed, so it cannot flash for a frame on a fast scroll.
  const activeStageId = getActiveStage(progress).id;
  if (activePanel !== null && activePanel !== activeStageId) {
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
          onSelectCompany={() => setActivePanel("company")}
        />
      </div>
      <SkipButton />
      {activePanel === "company" && sirket && (
        <InfoPanel
          title="Hamman Madencilik A.Ş."
          description={sirket.profil}
          fullPageHref="/hakkimizda"
          onClose={() => setActivePanel(null)}
        />
      )}
    </div>
  );
}
