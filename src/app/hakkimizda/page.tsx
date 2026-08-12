import { getSirketBilgisi } from "@/sanity/queries";

export const revalidate = 60;

export const metadata = {
  title: "Hakkımızda — Hamman Madencilik",
};

export default async function HakkimizdaPage() {
  const sirket = await getSirketBilgisi();

  if (!sirket) {
    return (
      <main className="px-6 py-16 md:px-16">
        <p>İçerik yakında eklenecek.</p>
      </main>
    );
  }

  return (
    <main className="px-6 py-16 md:px-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">Hakkımızda</h1>
      <p className="mt-6 max-w-2xl text-sm text-[color:var(--color-stone-ink)]/80">{sirket.profil}</p>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-lg">Vizyon</h2>
          <p className="mt-2 text-sm text-[color:var(--color-stone-ink)]/80">{sirket.vizyon}</p>
        </div>
        <div>
          <h2 className="text-lg">Misyon</h2>
          <p className="mt-2 text-sm text-[color:var(--color-stone-ink)]/80">{sirket.misyon}</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg">Değerlerimiz</h2>
        <ul className="mt-2 flex flex-wrap gap-2 text-xs">
          {sirket.degerler.map((deger) => (
            <li key={deger} className="border border-[color:var(--color-stone-sand)] px-3 py-1">
              {deger}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="text-lg">Belgeler & Sertifikalar</h2>
        <ul className="mt-2 flex flex-wrap gap-2 text-xs">
          {sirket.sertifikalar.map((belge) => (
            <li key={belge} className="border border-[color:var(--color-stone-sand)] px-3 py-1">
              {belge}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="text-lg">Ekibimiz</h2>
        <p className="mt-2 text-sm text-[color:var(--color-stone-ink)]/80">{sirket.ekipMetni}</p>
      </div>
    </main>
  );
}
