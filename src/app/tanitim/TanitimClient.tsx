"use client";

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

  // `onFinish` is reached only from IntroFallback's "Ana Sayfaya Geç" button —
  // the WebGL experience loops rather than ending, so on that path SkipButton is
  // the only exit. The two exits must therefore behave identically, and
  // SkipButton does `markIntroSeen()` then `router.push("/")`. Without the
  // `markIntroSeen()` here the fallback exit would land on `/` with the session
  // flag still unset, IntroRedirectGate would immediately send the visitor back
  // to `/tanitim`, and the fallback would render again: an infinite loop with no
  // way off the intro for exactly the users (reduced motion, no WebGL) the
  // fallback exists to serve.
  function handleFinish() {
    markIntroSeen();
    router.push("/");
  }

  return (
    <IntroScene sirket={sirket} urunler={urunler} iletisim={iletisim} onFinish={handleFinish} />
  );
}
