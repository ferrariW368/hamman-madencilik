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
      description:
        "Sinematik giriş animasyonunda hangi ürünlerin, hangi sırayla gösterileceğini seçin. Boş bırakılırsa bu bölüm hiç gösterilmez.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "urunKategorisi" }] }],
    }),
  ],
  preview: { prepare: () => ({ title: "Şirket Bilgisi (tekil)" }) },
});
