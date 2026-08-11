# Hamman Madencilik — Site Yenileme, Faz 1 Tasarım Dokümanı

**Tarih:** 2026-08-11
**Durum:** Onaylandı (kullanıcı tarafından, 2026-08-11)
**Kapsam:** Faz 1 — Temel site (CMS + modern tasarım + 3D küre entegrasyonu). Faz 2 (ürün temalı tema geçişi) ve Faz 3 (çok dillilik) bu dokümanın kapsamı dışındadır, ayrı spec'lerle ele alınacaktır.

## Arka Plan

Hamman Madencilik, Konya/Beyşehir merkezli bir mermer ocak işletmesi. Mevcut site (`hammanmadencilik.com`, WordPress tabanlı) tasarım olarak yenilenecek ve kod tabanı sıfırdan, modern bir stack ile yeniden kurulacak. Site sahibi kullanıcının amcasına ait; kullanıcı (yeğen) geliştirmeyi yürütüyor, amca ileride kendi başına içerik güncelleyebilmeli.

## Hedefler

- Mevcut sitedeki tüm içeriği (hizmetler, ürünler, hakkımızda, iletişim) koruyarak çok daha modern ve göze hitap eden bir tasarıma geçmek
- Amcanın kod bilmeden içerik (metin, fotoğraf) güncelleyebileceği bir sistem kurmak
- Daha önce ayrı bir oturumda prototiplenmiş 3D interaktif küre özelliğini (saha/tesis konumları) siteye entegre etmek
- Domain (`hammanmadencilik.com`) değişmeden, sadece DNS yönlendirmesiyle yeni siteye geçiş yapmak

## Kapsam Dışı (sonraki fazlar)

- **Faz 2:** Ürün kategorisine göre (mermer renk/doku çeşitleri) dinamik tema geçişi + scroll'da "derinleşme" efekti (küre prototipindeki `--depth` sistemi bu yönde genişletilebilir)
- **Faz 3:** Türkçe/İngilizce/Arapça (RTL)/Çince tam çok dillilik

## Mimari

- **Frontend:** Next.js (App Router) + TypeScript, Tailwind CSS
- **CMS:** Sanity — amcanın kullanacağı ayrı, sade bir Studio arayüzü (hizmetler, ürünler, galeri, hakkımızda metni, iletişim bilgileri buradan yönetilecek)
- **Hosting:** Vercel (Hobby plan)
- **Domain:** Mevcut `hammanmadencilik.com` korunur. Geliştirme boyunca geçici `*.vercel.app` adresi kullanılır; site onaylandıktan sonra domain sağlayıcısının panelinden DNS kayıtları (A/CNAME) Vercel'e yönlendirilir. Domain kaydı/mülkiyeti hiç taşınmaz, sadece DNS hedefi değişir.
- **Görseller:** Sanity CDN üzerinden otomatik optimize edilip servis edilir

## İçerik Modeli (Sanity)

Mevcut siteden çekilen tüm içerik `docs/reference/icerik-envanteri.xlsx` dosyasında (6 sekme: Genel Bilgi, Hizmetler, Ürünler, İletişim, Galeri-Görseller, Eksik-Netleştirilecek).

Sanity şemaları:
- **Hizmet** (title, açıklama, görsel) — 7 kayıt, `/hizmetlerimiz/` sayfasındaki güncel metinlerden
- **Ürün Kategorisi** (title, açıklama, alt-liste, kullanım alanı, görsel) — 10 kayıt
- **Şirket Bilgisi** (tekil doküman: profil, vizyon, misyon, değerler, sertifikalar, ekip metni)
- **İletişim Bilgisi** (tekil doküman: iki adres — Konya şantiye + Antalya ofis, telefon, e-posta)
- **Galeri Görseli** (görsel koleksiyonu — mevcut stok görseller yerine gerçek fotoğraflarla değiştirilecek)
- **Saha/Tesis** (Faz 2'nin küre özelliği için şimdiden şema olarak tanımlanır ama Faz 1'de boş/placeholder kalabilir: code, şehir, ülke, enlem/boylam, kaynak, durum, not)

## Sayfa Yapısı

- **Ana Sayfa** — hero (metin + mermer dokulu görsel panel), 4 kalemlik hizmet şeridi, öne çıkan ürünler, hakkımızda özeti, iletişim CTA
- **Hizmetlerimiz** — 7 hizmetin tam listesi
- **Ürünlerimiz** — 10 ürün kategorisi
- **Hakkımızda** — profil, vizyon/misyon, değerler, sertifikalar
- **İletişim** — iki adres, telefon, e-posta, basit iletişim formu (ad-soyad, e-posta, konu, mesaj)

## Tasarım Yönü — "Premium Doğal Taş"

Görsel companion üzerinden 3 yön sunuldu (Koyu Endüstriyel, Premium Doğal Taş, Modern Kurumsal); kullanıcı **Premium Doğal Taş** yönünü, **sıcak altın/bronz** vurgu paletiyle onayladı.

- **Palet:** Krem/mermer zemin (`#FBFAF7`, `#F5F2EC`, `#E8E2D6`), koyu kahve metin (`#2b2620`), bronz/altın vurgu (`#8a6f3a`)
- **Tipografi:** Başlıklarda ince serif (Georgia benzeri), gövde metninde sade sans-serif (Arial/Inter benzeri)
- **Nav:** Hizmetler / Ürünler / Şantiyeler / Hakkımızda / İletişim
- **Hero:** Solda metin + CTA'lar ("Ürünlerimiz", "Bizi Tanıyın"), sağda mermer damar dokulu görsel panel
- **Hizmet şeridi:** 4 kalemlik, numaralı (01–04), ince ayraçlı kart düzeni

Onaylanan mockuplar `docs/superpowers/brainstorm/` altında (varsa) veya bu doküman ekinde referans olarak durur; nihai piksel-detaylar implementasyon sırasında netleşecek.

## Faz 2 Referansı — 3D Küre

`docs/reference/globe-prototype.html` — daha önce ayrı bir oturumda hazırlanmış, çalışan bir Three.js prototipi: sürüklenebilir küre, saha pinleri, tıklanınca detay paneli, scroll'a bağlı "derinlik" vinyet efekti. Faz 1'de bu dosya olduğu gibi projeye referans olarak taşındı; Faz 2'de gerçek saha verisiyle entegre edilip açık palete (Premium Doğal Taş) uyacak şekilde yeniden renklendirilecek. Prototipteki saha verileri (Zonguldak, Şili, Avustralya vb.) tamamen placeholder — gerçek veri amcadan alınacak.

## Açık Noktalar / Amcadan Alınması Gerekenler

(Detaylar `docs/reference/icerik-envanteri.xlsx` → "Eksik-Netlestirilecek" sekmesinde)

1. Gerçek ocak/şantiye/ürün/ekip fotoğrafları (mevcut galeri görselleri muhtemelen stok)
2. Sertifika taramaları (ÇED, ISO 9001, ISO 14001, İSG, İhracat Yetki Belgesi)
3. Gerçek sosyal medya hesap linkleri (şu an placeholder/boş)
4. Hero slider'ın 2. ve 3. slayt metinleri (sadece 1. slayt statik okunabildi)
5. Faz 2 için gerçek saha/tesis konum listesi (şehir, koordinat, kaynak, durum)
6. Domain DNS paneline erişim bilgileri — sadece son adımda (canlıya alma) gerekli, şimdi değil

## Kabul Kriterleri

- Site `*.vercel.app` üzerinde çalışır durumda, mevcut sitedeki tüm metin içeriği (hizmetler, ürünler, hakkımızda, iletişim) doğru şekilde yer alır
- Amca, Sanity Studio üzerinden bir hizmet/ürün metnini veya görselini kod bilmeden güncelleyebilir
- Site mobilde ve masaüstünde düzgün görüntülenir, Premium Doğal Taş tasarım yönüne uygun
- İletişim formu çalışır (en azından bir e-posta bildirimi/servis entegrasyonu ile)
- Domain henüz yönlendirilmemiş olsa da yönlendirmeye hazır (Vercel custom domain ekleme adımları belgelenmiş)
