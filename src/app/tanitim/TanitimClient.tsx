"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IntroScene } from "@/components/intro/IntroScene";
import { markIntroSeen } from "@/components/intro/introSession";
import type { SirketBilgisi, UrunKategorisi, IletisimBilgisi } from "@/sanity/queries";

type TanitimClientProps = {
  sirket: SirketBilgisi | null;
  urunler: UrunKategorisi[];
  iletisim: IletisimBilgisi | null;
};

export function TanitimClient({ sirket, urunler, iletisim }: TanitimClientProps) {
  const router = useRouter();

  // The session flag means "this session has been shown the intro", not "this
  // session pressed one of two specific buttons" — so it is set on arrival,
  // before the visitor does anything.
  //
  // Setting it only on the explicit exits left a reachable bounce-back: the
  // intro's own InfoPanel offers a plain `<a href>` ("Tüm Sayfayı Gör" →
  // /hakkimizda or /urunlerimiz) with no onClick, so leaving the intro that way
  // never ran markIntroSeen(). Those pages carry the full site chrome, whose
  // logo is a <Link href="/">; clicking it put the visitor back on / with the
  // flag still unset, and IntroRedirectGate threw them into the intro they had
  // just watched *and interacted with*. Marking on mount closes that path, the
  // back-button path and the typed-/tanitim-URL path at once.
  //
  // It does not disable the deliberate "TANITIMI İZLE" link: the gate only
  // guards /, so /tanitim stays reachable however many times the visitor wants.
  useEffect(() => {
    markIntroSeen();
  }, []);

  // `onFinish` is reached only from IntroFallback's "Ana Sayfaya Geç" button —
  // the WebGL experience loops rather than ending, so on that path SkipButton is
  // the only exit. The two exits must therefore behave identically, and
  // SkipButton does `markIntroSeen()` then `router.push("/")`. Without the
  // `markIntroSeen()` here the fallback exit would land on `/` with the session
  // flag still unset, IntroRedirectGate would immediately send the visitor back
  // to `/tanitim`, and the fallback would render again: an infinite loop with no
  // way off the intro for exactly the users (reduced motion, no WebGL) the
  // fallback exists to serve.
  //
  // The mount effect above already sets the flag, so this call is now redundant
  // — kept deliberately as belt and braces, so this exit stays correct on its
  // own terms and does not silently depend on a distant effect.
  function handleFinish() {
    markIntroSeen();
    router.push("/");
  }

  return (
    // An ink ground that is in the prerendered HTML, behind everything
    // IntroScene renders.
    //
    // IntroScene returns `null` until a mount effect sets `ready` — correct, and
    // deliberately so, because the fallback decision reads matchMedia and a
    // WebGL context and neither exists on the server, so rendering anything
    // before that would be a hydration mismatch. The consequence was that
    // /tanitim's prerendered HTML contained no scene markup and no background,
    // and the body's default is cream: every first-time visitor — this is the
    // route the homepage redirects them to — got a blank CREAM page while ~311 kB
    // of First Load JS downloaded, parsed and hydrated. That was the literal
    // first impression of the site.
    //
    // Ink is the right colour rather than an arbitrary one: it is what
    // IntroScene's own 600vh track and IntroFallback both paint, so whichever
    // path resolves, the visitor sees the same ground before and after hydration
    // and there is no flash between them.
    //
    // A plain, unpositioned wrapper on purpose. IntroScene's dev calibration
    // guard asserts `offsetTop === 0` and `documentElement.scrollHeight ===
    // track.scrollHeight`; this div is the first thing in the flow, adds no
    // margin or padding, and `min-h-dvh` is far shorter than the 600vh child, so
    // it contributes nothing to either measurement. Verified silent in dev.
    <div className="min-h-dvh bg-[color:var(--color-stone-ink)]">
      <IntroScene sirket={sirket} urunler={urunler} iletisim={iletisim} onFinish={handleFinish} />
    </div>
  );
}
