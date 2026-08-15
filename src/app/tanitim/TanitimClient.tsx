"use client";

import { useRouter } from "next/navigation";
import { IntroScene } from "@/components/intro/IntroScene";
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
  // the only exit. Both simply return to the homepage.
  //
  // There is no session bookkeeping here any more. It existed to stop a
  // first-visit redirect from firing again, and that redirect has been removed
  // (see the comment in src/app/page.tsx): with the intro reachable only through
  // a deliberate link, "has this visitor seen it" is not a question anything
  // needs to ask.
  function handleFinish() {
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
