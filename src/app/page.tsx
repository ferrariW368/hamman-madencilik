import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ServiceStrip } from "@/components/ServiceStrip";
import { getHizmetler, getSirketBilgisi, getUrunler } from "@/sanity/queries";

export const revalidate = 60;

export default async function HomePage() {
  const [hizmetler, sirket, urunler] = await Promise.all([
    getHizmetler(),
    getSirketBilgisi(),
    getUrunler(),
  ]);
  const oneCikanUrunler = urunler.slice(0, 3);

  return (
    <main>
      {/* The intro is reached through the TANITIMI İZLE link below, never by an
          automatic redirect. A client-side redirect from here to /tanitim was
          built and then removed: Googlebot renders JS, so it followed the
          redirect on every crawl of this page, and because /tanitim is marked
          noindex the directive ended up applying to the document served at THIS
          url — risking the homepage itself dropping out of the index. Making
          the intro opt-in removes that whole class of problem. If the automatic
          reveal is ever wanted back, /tanitim needs real server-rendered copy
          and its noindex removed first. */}
      <Hero
        eyebrow="Konya & Antalya · 1985'ten Bu Yana"
        title="Doğanın taşına,"
        emphasis="ustanın dokunuşu."
        description="Mermer ocak işletmeciliğinden ihracata, üretimin her aşamasında kalite ve sürdürülebilirlik."
      />
      <div className="flex flex-wrap gap-x-6 gap-y-2 px-6 md:px-16">
        <Link
          href="/urunlerimiz"
          className="text-xs tracking-[0.08em] text-[color:var(--color-stone-bronze)]"
        >
          ÜRÜNLERİMİZ
        </Link>
        <Link
          href="/hakkimizda"
          className="text-xs tracking-[0.08em] text-[color:var(--color-stone-bronze)]"
        >
          BİZİ TANIYIN
        </Link>
        <Link
          href="/tanitim"
          className="text-xs tracking-[0.08em] text-[color:var(--color-stone-bronze)]"
        >
          TANITIMI İZLE
        </Link>
      </div>
      <ServiceStrip items={hizmetler} />
      {oneCikanUrunler.length > 0 && (
        <section className="border-t border-[color:var(--color-stone-sand)] px-6 py-16 md:px-16">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Öne Çıkan Ürünler</h2>
          <ul className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            {oneCikanUrunler.map((urun) => (
              <li key={urun._id} className="border-t border-[color:var(--color-stone-sand)] pt-4">
                <h3 className="text-lg">{urun.baslik}</h3>
                <p className="mt-2 text-sm text-[color:var(--color-stone-ink)]/80">{urun.detaylar}</p>
              </li>
            ))}
          </ul>
          <Link
            href="/urunlerimiz"
            className="mt-6 inline-block text-xs tracking-[0.08em] text-[color:var(--color-stone-bronze)]"
          >
            TÜM ÜRÜNLER →
          </Link>
        </section>
      )}
      {sirket && (
        <section className="px-6 py-16 md:px-16">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Hakkımızda</h2>
          <p className="mt-4 max-w-2xl text-sm text-[color:var(--color-stone-ink)]/80">{sirket.profil}</p>
          <Link
            href="/hakkimizda"
            className="mt-4 inline-block text-xs tracking-[0.08em] text-[color:var(--color-stone-bronze)]"
          >
            DEVAMINI OKU →
          </Link>
        </section>
      )}
      <section className="border-t border-[color:var(--color-stone-sand)] px-6 py-16 md:px-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">Bize Ulaşın</h2>
        <Link
          href="/iletisim"
          className="mt-4 inline-block text-xs tracking-[0.08em] text-[color:var(--color-stone-bronze)]"
        >
          İLETİŞİM →
        </Link>
      </section>
    </main>
  );
}
