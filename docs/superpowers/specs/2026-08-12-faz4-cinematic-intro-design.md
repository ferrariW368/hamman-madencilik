# Hamman Madencilik — Faz 4: Sinematik Scroll Girişi, Tasarım Dokümanı

**Tarih:** 2026-08-12
**Durum:** Onaylandı (kullanıcı tarafından, 2026-08-12)
**Kapsam:** Yeni, bağımsız bir faz. Faz 2 (3D tesis konum küresi) ve Faz 3 (çok dillilik) ile karışmasın diye **Faz 4** olarak adlandırıldı — sıralı öncelik anlamına gelmez, sadece numaralandırma çakışmasını önlemek içindir.

## Arka Plan ve İlham

Kullanıcı, [igloo.inc](https://www.igloo.inc) referans videosundaki gibi (fotogerçekçi 3D buz ev sahnesi, scroll ile kamera hareketi, holografik portföy kartları) sinematik bir scroll deneyimi istiyor. Kendi vizyonu: açılışta bir dağ/maden ocağı görünür, scroll ile mermer bloklara yaklaşılır, bir blok kesitine geçilir, ve son olarak blok döndüğünde üzerinde "HAMMAN MADENCİLİK A.Ş." yazısı kazınmış halde belirir.

Referans videonun fotogerçekçi kalitesi (gerçek 3D render/video prodüksiyonu) bu fazın kapsamı dışındadır — kullanıcı **stilize** bir versiyonla başlanmasını, tamamen kodla (dış 3D araç/varlık gerekmeden) üretilmesini onayladı. Fotogerçekçi bir versiyon istenirse (ileride) bir 3D sanatçıdan render veya AI video aracıyla üretilmiş bir video dosyası gerekecek — bu doküman o senaryoyu kapsamıyor.

## Hedefler

- Sitenin markasını güçlü, akılda kalıcı bir şekilde tanıtan bir "giriş anı" yaratmak
- Ürünlerini doğrudan aramak isteyen ziyaretçileri asla zorla bekletmemek — her zaman anında atlanabilir olmalı
- Mevcut Ana Sayfa'nın yükleme hızını/SEO'sunu etkilememek (ağır 3D kodu sadece bu ayrı deneyimde yüklenir)
- Masaüstü, iOS ve Android'de sorunsuz çalışmak; erişilebilirlik (reduced motion) ve düşük performanslı cihazlar için zarif bir yedek plan sunmak

## Kullanıcı Akışı

1. Bir ziyaretçi ilk kez `/` adresine gelir → istemci tarafında `sessionStorage`'da "intro görüldü" işareti yoksa otomatik `/tanitim` adresine yönlendirilir
2. `/tanitim`'de scroll ile 4 aşamalı animasyon oynar (aşağıda "Sahne Senaryosu")
3. Herhangi bir anda sağ üstteki **"Atla →"** butonuna basılabilir, ya da animasyon sonuna kadar izlenip beliren **"Ana Sayfaya Geç"** CTA'sına basılabilir — ikisi de aynı sonucu verir: `sessionStorage` işareti set edilir, `/`'ye yönlendirilir
4. Aynı oturumda `/`'ye tekrar gelindiğinde (veya biri direkt `/urunlerimiz` gibi başka bir sayfaya gelirse) `/tanitim`'e bir daha yönlendirme yapılmaz
5. Ana Sayfa'da küçük bir **"Tanıtımı İzle"** bağlantısı/butonu bulunur — bu, `sessionStorage` kontrolünü atlayarak her zaman `/tanitim`'e manuel gidilebilmesini sağlar

## Mimari

- **Route:** `src/app/tanitim/page.tsx` — ayrı bir sayfa, Ana Sayfa'nın bundle'ından izole
- **`IntroScene`** (`src/components/intro/IntroScene.tsx`) — dış kapsayıcı. ~400vh yüksekliğinde bir "hayalet" scroll alanı oluşturur; `position: sticky` ile sabitlenmiş bir canvas alanı içerir; native scroll + `requestAnimationFrame` ile 0→1 arası bir `progress` değeri hesaplar (küre prototipindeki `--depth` deseniyle aynı teknik, GSAP gibi ek kütüphane yok)
- **`IntroCanvas`** (`src/components/intro/IntroCanvas.tsx`) — `progress` prop'unu alan, Three.js sahnesini kuran ve her karede güncelleyen `"use client"` bileşeni
- **`introStages.ts`** (`src/components/intro/introStages.ts`) — sahnenin "senaryosu": scroll ilerlemesi aralıklarını kamera pozisyonu/hedefi, sis yoğunluğu, obje görünürlüğü gibi parametrelere eşleyen saf (framework'ten bağımsız) fonksiyonlar. Sahneyi ince ayar yapmak (örn. "dağ kısmı daha uzun sürsün") bu dosyayı değiştirmek anlamına gelir, Three.js koduna dokunmadan
- **`SkipButton`** (`src/components/intro/SkipButton.tsx`) — her zaman görünür, tıklanınca `sessionStorage` işaretini set edip `/`'ye yönlendirir
- **`IntroFallback`** (`src/components/intro/IntroFallback.tsx`) — WebGL desteklenmiyorsa veya `prefers-reduced-motion` açıksa gösterilen statik/animasyonsuz ekran (logo + kısa metin + "Ana Sayfaya Geç" butonu)

## Sahne Senaryosu (scroll ilerlemesi 0→1)

| Aralık | Aşama | Açıklama |
|---|---|---|
| 0.00–0.30 | Dağ manzarası | Sisli, düşük-poligonlu bir dağ/maden ocağı sahnesi; kamera yavaşça içeri doğru hareket eder (dolly) |
| 0.30–0.60 | Bloklara yaklaşma | Kamera, dağdan ayrılmış mermer bloklara doğru ilerler; sahne paleti soğuk gri-mavimsiden sitenin krem/bronz "Premium Doğal Taş" tonlarına yumuşakça geçer |
| 0.60–0.85 | Blok kesiti | Bir blok öne gelir, kesit/iç yapı efektiyle "içine bakılır" gibi bir geçiş yaşanır |
| 0.85–1.00 | Kazınmış yazı | Blok döner, yüzeyinde gerçekten 3 boyutlu kazınmış (2D doku değil, ayrı geometri, ışıkla gölgelenen) **"HAMMAN MADENCİLİK A.Ş."** yazısı belirir; ardından "Ana Sayfaya Geç" CTA'sı fade-in ile görünür |

## Görsel / Malzeme Yaklaşımı

- **Dağ:** Gürültü fonksiyonuyla (simplex noise) dalgalandırılmış düşük-poligonlu bir yüzey geometrisi; Three.js `Fog` ile atmosferik derinlik
- **Mermer blok:** Hafif yuvarlatılmış kenarlı kutu geometrisi; damar deseni çalışma zamanında bir `<canvas>` üzerine gürültü deseniyle çizilip doku (texture + roughness map) olarak uygulanır — dışarıdan görsel dosyası gerekmez. İleride amcadan gelecek gerçek mermer fotoğraflarıyla (bkz. materyal listesi PDF'i) değiştirilebilir bir yer tutucu olarak tasarlanır
- **Kazınmış yazı:** Playfair Display fontunun Three.js `TextGeometry` formatına (facetype.js ile) bir kerelik dönüştürülmesi gerekir; harfler ayrı, hafif gömülü bir geometri olarak bloğun yüzeyine yerleştirilir, gerçek ışık/gölge alır

## Performans, Mobil ve Erişilebilirlik (kesin gereklilik)

- **iOS Safari ve Android Chrome/Samsung Internet** dahil tüm modern mobil tarayıcılarda çalışmalı — WebGL desteği bu tarayıcılarda standarttır
- **Dokunmatik scroll** native scroll üzerinden otomatik çalışır, ayrı dokunma mantığı gerekmez
- **Ekran boyutuna göre sadeleştirme:** dar ekranlarda (mobil) poligon sayısı ve post-processing efektleri (gölge, bulanıklık) otomatik düşürülür
- **`prefers-reduced-motion` açıksa veya WebGL desteklenmiyorsa:** animasyon hiç oynatılmadan `IntroFallback` gösterilir — kimse zorla beklemez, erişilebilirlik ihlali olmaz
- **Yön değişikliği:** telefon döndürüldüğünde sahne otomatik yeniden boyutlanır, bozulma olmaz

## Test Yaklaşımı

- `introStages.ts` — saf fonksiyonlar, tam otomatik test edilir (görsel/DOM/WebGL gerektirmez)
- `SkipButton` — tıklama → `sessionStorage` set + yönlendirme davranışı Testing Library ile test edilir
- `IntroFallback` — koşullu render mantığı (WebGL yok / reduced motion) test edilir
- `IntroCanvas` (asıl Three.js render mantığı) otomatik test edilmez — build başarısı + gerçek tarayıcıda (masaüstü ve mobil genişlikte) görsel doğrulama ile kontrol edilir, Faz 1'deki veri-çekme sayfalarıyla aynı yaklaşım

## Kapsam Dışı (bu doküman için)

- Fotogerçekçi (igloo.inc seviyesi) görsel kalite — ayrı bir gelecek faz, gerçek 3D render veya AI-üretilmiş video gerektirir
- Gerçek mermer doku fotoğrafları ile entegrasyon — materyal listesi PDF'inde istendi, geldiğinde ayrı bir küçük görev olarak eklenir
- Ses/müzik — referans videoda "Sound: On/Off" seçeneği var ama bu fazda talep edilmedi, dahil değil
