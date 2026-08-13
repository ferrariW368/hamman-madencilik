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
