"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasSeenIntro } from "./introSession";

/**
 * Sends a first-time visitor from the home page to the cinematic intro, once
 * per browser session.
 *
 * The decision is deliberately made in an effect rather than during render:
 * `hasSeenIntro()` reads `sessionStorage`, which does not exist on the server,
 * so it always returns `false` there. Branching on it during render would make
 * the server and the first client render disagree for anyone who has already
 * seen the intro — a hydration mismatch. Rendering `null` unconditionally and
 * deciding after mount keeps both renders identical.
 *
 * IMPORTANT: this file must never gain a transitive import of `IntroScene`,
 * `IntroCanvas` or `three`. It is mounted on `/`, and any such import would
 * pull the entire Three.js bundle into the home page's First Load JS. Only
 * `introSession` (a ~10-line sessionStorage wrapper) is imported from the intro
 * folder.
 */
export function IntroRedirectGate() {
  const router = useRouter();

  useEffect(() => {
    if (!hasSeenIntro()) {
      router.replace("/tanitim");
    }
  }, [router]);

  return null;
}
