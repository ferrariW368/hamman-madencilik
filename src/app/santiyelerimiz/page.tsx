import { getIletisimBilgisi } from "@/sanity/queries";

export const revalidate = 60;

export const metadata = {
  title: "Şantiyelerimiz — Hamman Madencilik",
};

export default async function SantiyelerimizPage() {
  const iletisim = await getIletisimBilgisi();

  return (
    <main className="px-6 py-16 md:px-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">Şantiyelerimiz</h1>
      {iletisim && (
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-lg">Konya Şantiyesi</h2>
            <p className="mt-2 text-sm text-[color:var(--color-stone-ink)]/80">{iletisim.santiyeAdresi}</p>
          </div>
          <div>
            <h2 className="text-lg">Antalya Ofisi</h2>
            <p className="mt-2 text-sm text-[color:var(--color-stone-ink)]/80">{iletisim.ofisAdresi}</p>
          </div>
        </div>
      )}
    </main>
  );
}
