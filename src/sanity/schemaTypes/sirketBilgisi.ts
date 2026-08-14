import { defineField, defineType } from "sanity";

export const sirketBilgisi = defineType({
  name: "sirketBilgisi",
  title: "Şirket Bilgisi",
  type: "document",
  fields: [
    defineField({ name: "profil", title: "Şirket Profili", type: "text", rows: 4 }),
    defineField({ name: "vizyon", title: "Vizyon", type: "text", rows: 3 }),
    defineField({ name: "misyon", title: "Misyon", type: "text", rows: 3 }),
    defineField({ name: "degerler", title: "Değerlerimiz", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "sertifikalar", title: "Belgeler & Sertifikalar", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "ekipMetni", title: "Ekibimiz", type: "text", rows: 3 }),
    defineField({
      name: "tanitimUrunleri",
      title: "Tanıtımda Gösterilecek Ürünler",
      // The old help text promised that leaving this empty removes the section
      // from the intro. It does not: the products stage occupies a fixed slice
      // of the scroll track (0.45–0.85 of a 600vh page), so an empty list ships
      // roughly 1.6 screen-heights of empty cream fog with nothing to see and
      // nothing to click. Making the promise true would mean deriving the stage
      // ranges from the content, which is a change to introStages.ts and out of
      // this field's reach — so the text now describes what actually happens.
      description:
        "Sinematik giriş animasyonunda hangi ürünlerin, hangi sırayla gösterileceğini seçin. En az bir ürün seçin: boş bırakılırsa bu bölüm kaldırılmaz, ziyaretçi tanıtımın ortasında boş bir sahneyi kaydırmak zorunda kalır.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "urunKategorisi" }] }],
      // A warning, not an error: the field is legitimately optional and the
      // scene handles an empty list without crashing. This nudges the editor
      // without blocking a publish.
      validation: (Rule) =>
        Rule.custom((urunler?: unknown[]) =>
          urunler && urunler.length > 0
            ? true
            : "En az bir ürün seçmeniz önerilir. Boş bırakırsanız tanıtımın ürün bölümü boş bir sahne olarak gösterilir."
        ).warning(),
    }),
  ],
  preview: { prepare: () => ({ title: "Şirket Bilgisi (tekil)" }) },
});
