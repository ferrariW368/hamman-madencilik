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
        <IntroCanvas progress={progress} />
      </div>
      <SkipButton />
    </div>
  );
}
