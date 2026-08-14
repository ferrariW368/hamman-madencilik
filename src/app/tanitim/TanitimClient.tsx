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
    <IntroScene sirket={sirket} urunler={urunler} iletisim={iletisim} onFinish={handleFinish} />
  );
}
