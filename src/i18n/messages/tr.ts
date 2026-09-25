import type { Messages } from "./types";
export const trStonesExperience: Messages["stonesExperience"] = {
  collection: { label: "Taşlar", title: "Taşlar", description: "Malzeme portföyü, doğrulanmış kayıtlar geldikçe burada yayımlanacaktır.", pendingPortfolio: "Portföy doğrulama sürecindedir.", detailsLink: "Malzemeyi incele", detailsPending: "Ayrıntılar doğrulama bekliyor", mediaPending: "Doğrulanmış malzeme görseli henüz yok" },
  detail: { label: "Taşlar", overview: "Malzeme genel görünümü", overviewPending: "Doğrulanmış açıklama henüz yayımlanmadı.", inspection: "Yüzey inceleme", surface: "Yüzey", block: "Blok", mediaPending: "Bu görünüm için doğrulanmış medya henüz yayımlanmadı.", technical: "Teknik bilgi", technicalPending: "Doğrulanmış teknik bilgi henüz yayımlanmadı.", quarry: "Ocak / kaynak", quarryPending: "Doğrulanmış ocak veya kaynak ilişkisi henüz yayımlanmadı.", documents: "Dokümanlar", documentsPending: "Doğrulanmış teknik doküman henüz yayımlanmadı.", inquiry: "Talep", inquiryDescription: "Doğrulanmış iletişim kanalları yayımlandığında buradan doğrudan talep iletilebilir.", inquiryLink: "İletişim alanına git", backToCollection: "Taşlara dön" },
};
export const trSkeleton: Messages["skeleton"] = {
  home: { label: "HAMMARBLE", title: "HAMMARBLE", description: "V2 ana sayfa yapısı geliştirme aşamasındadır." },
  stones: { label: "Taşlar", title: "Taşlar", description: "Güncel portföy ve malzeme ayrıntıları doğrulama sonrasında eklenecektir.", spiderLink: "Spider detayı" },
  spider: { label: "Taşlar", title: "Spider", description: "Bu, geliştirme amaçlı nötr ayrıntı rota yer tutucusudur.", availabilityNotice: "Görsel, teknik veri, menşei ve satış bilgileri henüz yayınlanmamıştır.", backToStones: "Taşlara dön", contactLink: "İletişime git" },
  quarries: { label: "Ocaklar", title: "Ocaklar", description: "Ocak bilgileri doğrulanmış konum ve malzeme ilişkileri ile eklenecektir.", regionLabel: "Onaylanan şehir düzeyi kaynak bölgesi", region: "Beyşehir / Konya, Türkiye", detailsPending: "Ocak kimliği, kesin konum/koordinat, taş ilişkisi ve navigasyon bağlantısı doğrulama bekliyor." },
  projects: { label: "Projeler", title: "Projeler", description: "Proje referansları ve kapsamları doğrulandıktan sonra eklenecektir." },
  events: { label: "Etkinlikler", title: "Etkinlikler", description: "Etkinlik kayıtları doğrulanmış tarih ve medya ile eklenecektir." },
  about: { label: "Hakkımızda", title: "Hakkımızda", description: "Kurumsal tarihçe ve bilgiler doğrulama sonrasında eklenecektir." },
  contact: { label: "İletişim", title: "İletişim", description: "Doğrulanmış iletişim kanalları ve form altyapısı henüz yayında değildir." },
  notFound: { label: "404", title: "Sayfa bulunamadı", description: "İstediğiniz V2 sayfası bulunamadı.", homeLink: "Ana sayfaya dön" },
};
export const trHomeBody: Messages["homeBody"] = {
  sections: [
    { key: "stones", label: "01", title: "Taşlar", description: "Doğrulanan malzeme kayıtlarını ve Spider ayrıntı rotasını inceleyin.", linkLabel: "Taşları incele" },
    { key: "quarries", label: "02", title: "Ocaklar", description: "Doğrulanmış ocak konumları ve malzeme ilişkileri yayımlandığında burada yer alacaktır.", linkLabel: "Ocaklar alanına git" },
    { key: "projects", label: "03", title: "Projeler", description: "Referanslar, kapsamları doğrulandıktan sonra yayımlanacaktır.", linkLabel: "Projeler alanına git" },
    { key: "events", label: "04", title: "Etkinlikler", description: "Doğrulanmış tarih ve medya ile etkinlik kayıtları burada yer alacaktır.", linkLabel: "Etkinlikler alanına git" },
    { key: "about", label: "05", title: "Miras", description: "Kurumsal tarihçe, doğrulanmış kaynaklar hazır olduğunda yayımlanacaktır.", linkLabel: "Hakkımızda alanına git" },
    { key: "contact", label: "06", title: "İletişim", description: "Doğrulanmış iletişim kanalları yayımlandığında doğrudan iletişim burada kurulacaktır.", linkLabel: "İletişim alanına git" },
  ],
};
export const trHeroPrototype: Messages["heroPrototype"] = {
  eyebrow: "HAMMARBLE / WEB PROTOTYPE",
  description: "Sinematik açılışın medya bağımsız prototipi. Onaylı kaynak görüntüleri geldiğinde bu yapı gerçek görüntülerle güncellenecektir.",
  status: "DEMO — doğrulanmış şirket görüntüsü kullanılmıyor",
  exploreStones: "Taş alanını aç",
  stages: [
    { label: "01", title: "Kaynak" },
    { label: "02", title: "Yaklaşım" },
    { label: "03", title: "Çıkarım" },
    { label: "04", title: "Hareket" },
    { label: "05", title: "Duraklama" },
    { label: "06", title: "HAMMARBLE" },
  ],
};
export const tr: Omit<Messages, "skeleton" | "homeBody" | "heroPrototype" | "stonesExperience"> = { foundation: { accessibleName: "HAMMARBLE", navigationLabel: "Ana menü", openMenuLabel: "Menüyü aç", closeMenuLabel: "Menüyü kapat", languageLabel: "Dil", localeNames: { tr: "Türkçe", en: "English" }, navigation: { stones: "Taşlar", quarries: "Ocaklar", projects: "Projeler", events: "Etkinlikler", about: "Hakkımızda", contact: "İletişim" }, footer: { copyright: "Telif hakkı" } } };
