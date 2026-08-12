import { getUrunler } from "@/sanity/queries";

export const metadata = {
  title: "Ürünlerimiz — Hamman Madencilik",
};

export default async function UrunlerimizPage() {
  const urunler = await getUrunler();

  return (
    <main className="px-6 py-16 md:px-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">Ürünlerimiz</h1>
      <ul className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        {urunler.map((urun) => (
          <li key={urun._id} className="border-t border-[color:var(--color-stone-sand)] pt-4">
            <h2 className="text-lg">{urun.baslik}</h2>
            <p className="mt-2 text-sm text-[color:var(--color-stone-ink)]/80">{urun.detaylar}</p>
            {urun.kullanimAlani && (
              <p className="mt-2 text-xs uppercase tracking-[0.06em] text-[color:var(--color-stone-bronze)]">
                {urun.kullanimAlani}
              </p>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
