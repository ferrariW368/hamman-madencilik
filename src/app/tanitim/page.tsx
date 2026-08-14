import { getSirketBilgisi, getIletisimBilgisi } from "@/sanity/queries";
import { TanitimClient } from "./TanitimClient";

export const revalidate = 60;

export const metadata = {
  title: "Tanıtım — Hamman Madencilik",
};

export default async function TanitimPage() {
  const [sirket, iletisim] = await Promise.all([getSirketBilgisi(), getIletisimBilgisi()]);
  // Fetched once on the server and handed down as plain props — deliberately no
  // client-side refetch, live preview or visual editing on this route.
  // IntroCanvas captures `urunler` and `iletisim` at mount while IntroScene
  // keeps reading the live copies; if the two ever diverged mid-session, a click
  // on the 3D scene would fire the *old* list's href while the panel showed the
  // new one, navigating the visitor somewhere they did not choose.
  //
  // `tanitimUrunleri` is `UrunKategorisi[] | null` — null whenever the CMS field
  // is left empty. IntroCanvas calls `urunler.map` at mount, so passing null
  // through would be a hard crash on mount rather than the empty-scene path the
  // products stage handles gracefully. `?? []` is the real fallback, not a cast.
  const urunler = sirket?.tanitimUrunleri ?? [];

  return <TanitimClient sirket={sirket} urunler={urunler} iletisim={iletisim} />;
}
