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
    // The ink background is not decoration — it is what makes this control
    // visible at all for most of the intro. Cream text with a cream/40 border and
    // no background reads fine over the grey mountain fog, but from p = 0.3
    // onward every stage sets the fog (and therefore `scene.background`, which is
    // aliased to it) to FOG_CREAM #F5F2EC, so the sky behind this corner is cream
    // for the last 70% of the experience: measured 1.07:1 against a 4.5:1
    // requirement. Since the WebGL path loops rather than ending, this button is
    // the ONLY exit, so "a persistent Skip button exits at any stage" was a
    // requirement the button could not meet while it was invisible. ink/85 is the
    // same treatment IntroScene gives the contact arrows and InfoPanel gives its
    // surface, for the same reason — every other overlay control already had one.
    //
    // The focus ring is drawn INSIDE the button (negative outline-offset) rather
    // than around it. An outline outside sits on the scene, which is grey for the
    // first 30% and cream for the rest, so no single ring colour could clear 3:1
    // against both. Inside, it lands on this button's own ink background, where
    // cream clears the 3:1 requirement in every stage: 9.1:1 where the sky is
    // cream (the 70% this fix exists for) and 13.1:1 over the grey mountain fog.
    // Verified with getComputedStyle in a real browser, not assumed from the
    // utility names.
    <button
      type="button"
      onClick={handleSkip}
      className="fixed right-6 top-6 z-50 border border-[color:var(--color-stone-cream)]/40 bg-[color:var(--color-stone-ink)]/85 px-4 py-2 text-xs uppercase tracking-[0.08em] text-[color:var(--color-stone-cream)] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[color:var(--color-stone-cream)]"
    >
      Atla →
    </button>
  );
}
