import { ContactForm } from "@/components/ContactForm";
import { getIletisimBilgisi } from "@/sanity/queries";

export const metadata = {
  title: "İletişim — Hamman Madencilik",
};

export default async function IletisimPage() {
  const iletisim = await getIletisimBilgisi();

  return (
    <main className="grid grid-cols-1 gap-12 px-6 py-16 md:grid-cols-2 md:px-16">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">Bize Ulaşın</h1>
        {iletisim && (
          <dl className="mt-6 flex flex-col gap-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.08em] text-[color:var(--color-stone-bronze)]">Telefon</dt>
              <dd className="mt-1">{iletisim.telefon}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.08em] text-[color:var(--color-stone-bronze)]">E-posta</dt>
              <dd className="mt-1">{iletisim.eposta}</dd>
            </div>
          </dl>
        )}
      </div>
      <ContactForm />
    </main>
  );
}
