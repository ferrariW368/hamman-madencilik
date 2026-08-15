import { getSirketBilgisi, getIletisimBilgisi, type UrunKategorisi } from "@/sanity/queries";
import { TanitimClient } from "./TanitimClient";

export const revalidate = 60;

export const metadata = {
  title: "Tanıtım — Hamman Madencilik",
  // This route renders a 600vh WebGL canvas: no headings, no body copy, nothing
  // a search result could usefully show. Indexing it would put an empty page in
  // front of people searching for the company's actual products.
  //
  // `follow: true` is deliberate — the crawler should still traverse out of here
  // (the intro's panels link to /hakkimizda and /urunlerimiz). We are declining
  // to index this page, not cutting it out of the link graph.
  //
  // This directive is also why nothing may automatically redirect to this route.
  // An earlier version had the homepage do exactly that; because Googlebot
  // renders client JS, the redirect ran during a crawl of `/` and this noindex
  // ended up applying to the document served at the homepage's own URL. See the
  // comment in src/app/page.tsx before adding any automatic navigation here.
  robots: { index: false, follow: true },
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
  // This is the boundary where `tanitimUrunleri`'s TWO holes are closed, and
  // both have to be, because they fail differently:
  //
  //  - The whole field is null when the CMS field was never set. IntroCanvas
  //    calls `urunler.map` at mount, so passing null through would be a hard
  //    crash rather than the empty-scene path the products stage handles.
  //    That is what `?? []` covers.
  //  - An individual ELEMENT is null when its referenced product has been
  //    deleted or merely unpublished — `[]->` dereferences to null in place.
  //    IntroCanvas's per-face material loop reads `urun.baslik` on every entry
  //    whose material index carries a label (see PRODUCT_LABEL_FACE_WIDTHS), so
  //    one null element throws a TypeError inside the mount effect. There is no
  //    error boundary on this route and the homepage redirects every first-time
  //    visitor here, so that took the whole route down. `.filter` covers it.
  //
  // The type predicate is what makes this a real narrowing rather than a cast:
  // `SirketBilgisi.tanitimUrunleri` is now `(UrunKategorisi | null)[] | null`,
  // so the compiler requires this filter and will require it again at any
  // future consumer. Everything downstream of here gets `UrunKategorisi[]`.
  const urunler = (sirket?.tanitimUrunleri ?? []).filter(
    (urun): urun is UrunKategorisi => urun !== null
  );

  return <TanitimClient sirket={sirket} urunler={urunler} iletisim={iletisim} />;
}
