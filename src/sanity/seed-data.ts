export type SeedHizmet = { baslik: string; aciklama: string; sira: number };
export type SeedUrun = { baslik: string; detaylar: string; kullanimAlani: string | null; sira: number };

export const hizmetler: SeedHizmet[] = [
  { baslik: "Mermer Ocak İşletmeciliği", aciklama: "Modern üretim teknikleri, yüksek tonajlı makine parkı ve deneyimli ekip ile mermer rezervlerinin profesyonel şekilde çıkarılmasını sağlıyoruz. Üretim alanımızda verimlilik, iş güvenliği ve çevresel sürdürülebilirlik en önemli önceliklerdir.", sira: 1 },
  { baslik: "Doğal Taş Üretimi", aciklama: "Farklı renk ve dokulardaki mermer çeşitlerini blok, plaka ve ebatlanmış ürünler halinde üretip hem yurtiçi hem yurtdışı müşterilerimize sunuyoruz.", sira: 2 },
  { baslik: "Blok Mermer Kesimi", aciklama: "Ocağımızdan çıkan büyük ebatlı bloklar, hassas kesim makineleri ile standart ya da özel ölçülere göre kesilerek sevkiyata hazır hale getirilir.", sira: 3 },
  { baslik: "Jeolojik Etüt & Ar-Ge", aciklama: "Ocak sahasının jeolojik analizleri yapılır, rezerv yapısı belirlenir, üretim planlaması bilimsel verilere dayandırılır. En verimli üretim yöntemleri Ar-Ge çalışmalarımızla sürekli geliştirilmektedir.", sira: 4 },
  { baslik: "Çevresel Etki Değerlendirme (ÇED)", aciklama: "ÇED raporu hazırlanması, çevre izni süreçleri, toz–gürültü kontrolü, rehabilitasyon planları ve sürdürülebilir ocak yönetimi konusunda danışmanlık ve uygulama hizmeti sunuyoruz.", sira: 5 },
  { baslik: "Proje Yönetimi", aciklama: "Yeni ocak açılışı, kapasite artırımı, altyapı yatırımları, saha planlaması ve üretim süreçlerinin uçtan uca profesyonel şekilde yönetilmesini sağlıyoruz.", sira: 6 },
  { baslik: "Lojistik & İhracat", aciklama: "Blok mermer, plaka ve işlenmiş taş ürünlerinin kara, deniz ve konteyner lojistiği uzman kadromuzla gerçekleştirilir. İhracat sürecindeki tüm resmi işlemler müşteriler adına takip edilir.", sira: 7 },
];

export const urunler: SeedUrun[] = [
  { baslik: "Blok Mermer", detaylar: "Ocaktan çıkarılan doğal bloklar. İhracata uygun, 1. sınıf kalite sınıflandırması. Renk, damar yapısı ve homojenlik kriterlerine göre ayrılmış blok çeşitleri.", kullanimAlani: "Yurt içi ve yurt dışı fabrikalara sevkiyat, büyük ölçekli mimari projeler.", sira: 1 },
  { baslik: "Plaka Mermer (Slab)", detaylar: "2–3 cm kalınlıklarda. Cila, honlama, kumlama, patinato yüzey seçenekleri. Modern plaka kesim hatlarında hazırlanmış geniş ebatlı plakalar.", kullanimAlani: "Mutfak tezgahları, zemin kaplama, merdiven, duvar kaplama, iç mimari projeler.", sira: 2 },
  { baslik: "Ebatlı Mermer Ürünleri", detaylar: "Ölçüler: 30×60, 60×60, 40×80, 45×90, projeye özel ölçüler. Yüzey seçenekleri: cilalı, honlu, eskitme, fırçalı, kumlamalı.", kullanimAlani: null, sira: 3 },
  { baslik: "Mermer Fayans", detaylar: "İnce işçilikle hazırlanmış standart karo ölçüleri. Seramik alternatifi fakat tamamen doğal taş görünümü.", kullanimAlani: "Zemin, duvar, banyo, otel ve konut projeleri.", sira: 4 },
  { baslik: "Özel Tasarım Mermer Ürünleri", detaylar: "Mermer lavabo, mermer masa–sehpa, mermer dekoratif objeler, mermer şömine, mermer merdiven basamak ve denizlikleri.", kullanimAlani: null, sira: 5 },
  { baslik: "Mermer Basamak & Kaplama Ürünleri", detaylar: "Merdiven basamak, denizlik, pencere söve, kapı eşik mermeri, dış cephe özel kaplama levha ürünleri.", kullanimAlani: null, sira: 6 },
  { baslik: "Split Face (Kırma Yüzey) Taşlar", detaylar: "Duvar kaplamalarında kullanılan dekoratif yüzey. İç ve dış mimari için doğal taş görünümü.", kullanimAlani: null, sira: 7 },
  { baslik: "Patlatma Mermer", detaylar: "Küçük ebatlı dekoratif taş ürünleri. Farklı renk ve damar yapılarında seçenekler.", kullanimAlani: null, sira: 8 },
  { baslik: "Mermer Mozaik", detaylar: "Küçük parçaların birleştirilmesiyle oluşturulan dekoratif yüzeyler. Altıgen, kare, şerit, merdiven bordürü gibi özel tasarımlar.", kullanimAlani: null, sira: 9 },
  { baslik: "Projeye Özel Kesim ve Uygulama", detaylar: "Mimar ve proje sahiplerinin istediği özel ölçülere göre üretim. CNC kesim. Waterjet desen çalışmaları. Özel yüzey işlemleri.", kullanimAlani: null, sira: 10 },
];

export const sirketBilgisi = {
  _id: "sirketBilgisi-singleton",
  _type: "sirketBilgisi" as const,
  profil: "Firmamız, mermer madenciliği alanında uzmanlaşmış, yüksek üretim kapasitesine sahip, teknolojiyi yakından takip eden bir mermer ocak işletmesidir. Üretim süreçlerimizin her aşamasında kalite, güvenlik ve sürdürülebilirlik ilkelerini benimseyerek yerli ve uluslararası pazara hizmet veriyoruz.",
  vizyon: "Türkiye'nin en güvenilir, çevresel duyarlılık standartlarına uyan ve yenilikçi mermer üretim şirketleri arasında lider konuma ulaşmak.",
  misyon: "Doğal kaynakları en doğru şekilde değerlendirerek yüksek kaliteli mermer ürünleri üretmek; müşteri memnuniyetini, güvenliği ve çevreyi ön planda tutmak.",
  degerler: ["Sürdürülebilir üretim", "Güvenli çalışma ortamı", "Dürüst ticaret", "Teknolojik gelişime açık yapı", "Müşteri memnuniyeti", "Çevreye saygı"],
  sertifikalar: ["ÇED Raporu", "İşletme Ruhsatı", "ISO 9001 Kalite Yönetim Sistemi", "ISO 14001 Çevre Yönetim Sistemi", "İSG Yönetim Sertifikaları", "İhracat Yetki Belgesi"],
  ekipMetni: "Alanında uzman mühendisler, jeologlar, saha yöneticileri, operatörler ve deneyimli lojistik ekibimiz ile üretimden sevkiyata kadar tüm süreçleri profesyonel bir şekilde yönetiyoruz.",
};

export const iletisimBilgisi = {
  _id: "iletisimBilgisi-singleton",
  _type: "iletisimBilgisi" as const,
  santiyeAdresi: "Yeni Mahalle 41360. Sokak Beyparkgold Sitesi B1 Blok No:9 Beyşehir / KONYA",
  ofisAdresi: "Altınkum Mahallesi 423. Sokak Kaya Plaza Sitesi, Kaya Plaza Blok No:35 Konyaaltı / ANTALYA",
  telefon: "+90.532.151 42 37",
  eposta: "info@hammanmadencilik.com.tr",
};
