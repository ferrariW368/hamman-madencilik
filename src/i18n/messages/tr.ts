import type { Messages } from "./types";
export const trSkeleton: Messages["skeleton"] = {
  home: { label: "HAMMARBLE", title: "HAMMARBLE", description: "V2 ana sayfa yapısı geliştirme aşamasındadır." },
  stones: { label: "Taşlar", title: "Taşlar", description: "Güncel portföy ve malzeme ayrıntıları doğrulama sonrasında eklenecektir.", spiderLink: "Spider detayı" },
  spider: { label: "Taşlar", title: "Spider", description: "Bu, geliştirme amaçlı nötr ayrıntı rota yer tutucusudur.", availabilityNotice: "Görsel, teknik veri, menşei ve satış bilgileri henüz yayınlanmamıştır.", backToStones: "Taşlara dön", contactLink: "İletişime git" },
  quarries: { label: "Ocaklar", title: "Ocaklar", description: "Ocak bilgileri doğrulanmış konum ve malzeme ilişkileri ile eklenecektir." },
  projects: { label: "Projeler", title: "Projeler", description: "Proje referansları ve kapsamları doğrulandıktan sonra eklenecektir." },
  events: { label: "Etkinlikler", title: "Etkinlikler", description: "Etkinlik kayıtları doğrulanmış tarih ve medya ile eklenecektir." },
  about: { label: "Hakkımızda", title: "Hakkımızda", description: "Kurumsal tarihçe ve bilgiler doğrulama sonrasında eklenecektir." },
  contact: { label: "İletişim", title: "İletişim", description: "Doğrulanmış iletişim kanalları ve form altyapısı henüz yayında değildir." },
  notFound: { label: "404", title: "Sayfa bulunamadı", description: "İstediğiniz V2 sayfası bulunamadı.", homeLink: "Ana sayfaya dön" },
};
export const tr: Omit<Messages, "skeleton"> = { foundation: { accessibleName: "HAMMARBLE", navigationLabel: "Ana menü", openMenuLabel: "Menüyü aç", closeMenuLabel: "Menüyü kapat", languageLabel: "Dil", localeNames: { tr: "Türkçe", en: "English" }, navigation: { stones: "Taşlar", quarries: "Ocaklar", projects: "Projeler", events: "Etkinlikler", about: "Hakkımızda", contact: "İletişim" }, footer: { copyright: "Telif hakkı" } } };
