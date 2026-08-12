import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ServiceStrip } from "@/components/ServiceStrip";
import { getHizmetler, getSirketBilgisi } from "@/sanity/queries";

export default async function HomePage() {
  const [hizmetler, sirket] = await Promise.all([getHizmetler(), getSirketBilgisi()]);

  return (
    <main>
      <Hero
        eyebrow="Konya & Antalya · 1985'ten Bu Yana"
        title="Doğanın taşına,"
        emphasis="ustanın dokunuşu."
        description="Mermer ocak işletmeciliğinden ihracata, üretimin her aşamasında kalite ve sürdürülebilirlik."
      />
      <ServiceStrip items={hizmetler} />
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
