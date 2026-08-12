import { getHizmetler } from "@/sanity/queries";

export const metadata = {
  title: "Hizmetlerimiz — Hamman Madencilik",
};

export default async function HizmetlerimizPage() {
  const hizmetler = await getHizmetler();

  return (
    <main className="px-6 py-16 md:px-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl">Hizmetlerimiz</h1>
      <ul className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        {hizmetler.map((hizmet) => (
          <li key={hizmet._id} className="border-t border-[color:var(--color-stone-sand)] pt-4">
            <h2 className="text-lg">{hizmet.baslik}</h2>
            <p className="mt-2 text-sm text-[color:var(--color-stone-ink)]/80">{hizmet.aciklama}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
