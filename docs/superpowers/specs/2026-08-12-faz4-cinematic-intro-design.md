# Hamman Madencilik — Faz 4: Sinematik Scroll Girişi, Tasarım Dokümanı

**Tarih:** 2026-08-12 (güncellendi: 2026-08-13)
**Durum:** Onaylandı (kullanıcı tarafından, 2026-08-12; genişletilmiş kapsam onaylandı 2026-08-13)
**Kapsam:** Yeni, bağımsız bir faz. Faz 2 (3D tesis konum küresi) ve Faz 3 (çok dillilik) ile karışmasın diye **Faz 4** olarak adlandırıldı — sıralı öncelik anlamına gelmez, sadece numaralandırma çakışmasını önlemek içindir.

## Arka Plan ve İlham

Kullanıcı, [igloo.inc](https://www.igloo.inc) referans videolarındaki gibi (fotogerçekçi 3D buz ev sahnesi, scroll ile kamera hareketi, holografik portföy kartları, parçacık bulutundan beliren sosyal medya seçici) sinematik bir scroll deneyimi istiyor. İki referans video incelendi:

- **Video 1:** Sisli dağda buz ev, kamera yörüngesi, bloklara ayrılma, holografik "PORTFOLIO_CO_01" kartlarına geçiş
- **Video 2:** Her bloğa tıklayınca açılan "Summary" bilgi paneli (Kapat butonlu), sıradaki bloğa geçiş, ve en sonda parçacık bulutundan beliren sosyal medya isimleri (LinkedIn, X/Twitter) arasında ok/sürükleme ile gezinme, tıklayınca ilgili hesaba yönlenme

Kullanıcının kendi vizyonu: açılışta bir dağ/maden ocağı görünür, scroll ile mermer bloklara yaklaşılır, bir blok kesitine geçilir, blok döndüğünde üzerinde "HAMMAN MADENCİLİK A.Ş." yazısı kazınmış halde belirir ve **tıklanabilir** olup şirket tarihçesini açar; ardından öne çıkan ürünler sırayla blok kesitleri halinde gelir (her biri tıklanınca bilgilendirme açar); en sonda küp şeklinde bir blok üzerinde sosyal medya ikonları arasında gezinilip tıklanan hesaba yönlenilir.

Referans videoların fotogerçekçi kalitesi (gerçek 3D render/video prodüksiyonu) bu fazın kapsamı dışındadır — kullanıcı **stilize** bir versiyonla başlanmasını, tamamen kodla (dış 3D araç/varlık gerekmeden) üretilmesini onayladı. Fotogerçekçi bir versiyon istenirse (ileride) bir 3D sanatçıdan render veya AI video aracıyla üretilmiş bir video dosyası gerekecek — bu doküman o senaryoyu kapsamıyor.

## Hedefler

- Sitenin markasını güçlü, akılda kalıcı bir şekilde tanıtan, **etkileşimli** bir "giriş anı" yaratmak — sadece izlenen değil, keşfedilen bir deneyim
- Ürünlerini doğrudan aramak isteyen ziyaretçileri asla zorla bekletmemek — her zaman anında atlanabilir olmalı
- Şirket tarihçesi ve öne çıkan ürünler için **ayrı içerik yazmaya gerek kalmadan**, zaten Sanity'de var olan verileri (Hakkımızda, Ürünler) yeniden kullanmak
- Mevcut Ana Sayfa'nın yükleme hızını/SEO'sunu etkilememek (ağır 3D kodu sadece bu ayrı deneyimde yüklenir)
- Masaüstü, iOS ve Android'de sorunsuz çalışmak; erişilebilirlik (reduced motion) ve düşük performanslı cihazlar için zarif bir yedek plan sunmak

## Kullanıcı Akışı

1. Bir ziyaretçi ilk kez `/` adresine gelir → istemci tarafında `sessionStorage`'da "intro görüldü" işareti yoksa otomatik `/tanitim` adresine yönlendirilir
2. `/tanitim`'de scroll ile 4 aşamalı, yer yer etkileşimli bir deneyim oynar (aşağıda "Sahne Senaryosu")
3. Herhangi bir anda sağ üstteki **"Atla →"** butonuna basılabilir, ya da deneyim sonuna kadar gidilip beliren **"Ana Sayfaya Geç"** CTA'sına basılabilir — ikisi de aynı sonucu verir: `sessionStorage` işareti set edilir, `/`'ye yönlendirilir
4. Aynı oturumda `/`'ye tekrar gelindiğinde (veya biri direkt `/urunlerimiz` gibi başka bir sayfaya gelirse) `/tanitim`'e bir daha yönlendirme yapılmaz
5. Ana Sayfa'da küçük bir **"Tanıtımı İzle"** bağlantısı/butonu bulunur — bu, `sessionStorage` kontrolünü atlayarak her zaman `/tanitim`'e manuel gidilebilmesini sağlar

## Mimari

- **Route:** `src/app/tanitim/page.tsx` — ayrı bir sayfa, Ana Sayfa'nın bundle'ından izole. Sunucu tarafında `getSirketBilgisi()`, öne çıkan ürünler ve `getIletisimBilgisi()` (sosyal linkler için) çekilip istemci bileşenine prop olarak geçirilir — Sanity sorgu mantığı zaten var olan `src/sanity/queries.ts`'e eklenir, tekrar yazılmaz
- **`IntroScene`** — dış kapsayıcı. ~600vh yüksekliğinde bir "hayalet" scroll alanı oluşturur (ek etkileşimli aşamalar nedeniyle Faz 4'ün ilk tasarımındaki 400vh'den uzatıldı); `position: sticky` ile sabitlenmiş bir canvas alanı içerir; native scroll + `requestAnimationFrame` ile 0→1 arası bir `progress` değeri hesaplar (küre prototipindeki `--depth` deseniyle aynı teknik, GSAP gibi ek kütüphane yok)
- **`IntroCanvas`** — `progress` prop'unu alan, Three.js sahnesini kuran ve her karede güncelleyen `"use client"` bileşeni
- **`introStages.ts`** — sahnenin "senaryosu": scroll ilerlemesi aralıklarını kamera pozisyonu/hedefi, sis yoğunluğu, obje görünürlüğü gibi parametrelere eşleyen saf (framework'ten bağımsız) fonksiyonlar
- **`InfoPanel`** (yeni) — tıklanabilir bir blok/nesne seçildiğinde açılan, yarı saydam koyu zeminli bilgi paneli (igloo'daki "Summary" panelinin karşılığı): başlık, açıklama metni, "Kapat" butonu, ve (sadece şirket paneli için) "Tüm Sayfayı Gör" linki. Sade bir React bileşeni, Three.js'ten bağımsız — DOM üzerinde canvas'ın üstüne bindirilir
- **`SocialCubeStage`** (yeni) — deneyimin son aşaması: küp şeklinde blok, ok butonları veya sürükleme ile yüzler arasında gezinme, aktif yüzdeki sosyal ikon tıklanınca `target="_blank"` ile ilgili hesaba gider. Bu aşamada sayfa scroll'u geçici olarak kilitlenir (kullanıcı artık scroll ile değil, ok/sürükleme ile gezinir) — igloo'nun "Sound/pre-load" tarzı sabit-ekran etkileşimiyle aynı mantık
- **`SkipButton`** — her zaman görünür, tıklanınca `sessionStorage` işaretini set edip `/`'ye yönlendirir
- **`IntroFallback`** — WebGL desteklenmiyorsa veya `prefers-reduced-motion` açıksa gösterilen statik/animasyonsuz ekran (logo + kısa metin + "Ana Sayfaya Geç" butonu)

## Sahne Senaryosu (scroll ilerlemesi 0→1)

| Aralık | Aşama | Açıklama |
|---|---|---|
| 0.00–0.15 | Dağ manzarası | Sisli, düşük-poligonlu bir dağ/maden ocağı sahnesi; kamera yavaşça içeri doğru hareket eder (dolly) |
| 0.15–0.30 | Bloklara yaklaşma | Kamera, dağdan ayrılmış mermer bloklara doğru ilerler; sahne paleti soğuk gri-mavimsiden sitenin krem/bronz "Premium Doğal Taş" tonlarına yumuşakça geçer |
| 0.30–0.45 | Şirket bloğu | Bir blok öne gelir, kesit efektiyle döner, yüzeyinde 3 boyutlu kazınmış **"HAMMAN MADENCİLİK A.Ş."** yazısı belirir. **Tıklanınca:** `InfoPanel` açılır, Sanity'deki şirket profili özetini gösterir, "Tüm Sayfayı Gör" ile `/hakkimizda`'ya gidilebilir, "Kapat" ile scroll'a devam edilir |
| 0.45–0.85 | Öne çıkan ürünler | Sanity'de Şirket Bilgisi'nde seçilmiş ürün listesi kadar (bkz. Veri Modeli), sırayla ayrı blok kesitleri olarak belirir. Her biri **tıklanabilir**: `InfoPanel` o ürünün başlığı/açıklaması/kullanım alanını gösterir. Ürün adedine göre bu aralık otomatik eşit parçalara bölünür |
| 0.85–1.00 | Sosyal medya finali | Scroll kilitlenir, küp şeklinde blok belirir; ok/sürükleme ile yüzler gezinilir, her yüzde bir sosyal ikon (sadece Sanity'de linki dolu olan platformlar gösterilir). Tıklanınca ilgili hesap yeni sekmede açılır; deneyim başa döner (loop) ve "Ana Sayfaya Geç" CTA'sı her zaman görünür kalır |

## Veri Modeli (Sanity şema değişiklikleri)

Yeni içerik yazmaya gerek yok — var olan verinin yeniden kullanımı ve iki küçük şema eklemesi yeterli:

- **`iletisimBilgisi`** şemasına opsiyonel sosyal medya URL alanları eklenir: `instagramUrl`, `facebookUrl`, `xUrl`, `youtubeUrl` (hepsi opsiyonel `url` tipi). Boş bırakılan platformlar `SocialCubeStage`'de hiç gösterilmez
- **`sirketBilgisi`** şemasına `tanitimUrunleri` adında bir **referans listesi** alanı eklenir (`array of reference to urunKategorisi`). Kullanıcı Studio'da hangi ürünlerin tanıtımda gösterileceğini VE sırasını (listede sürükle-bırak ile) birlikte seçer — ayrı bir "adet" alanına gerek yok, gösterilecek ürün sayısı = seçilen ürün adedi. Boş bırakılırsa bu aşama atlanır (ürün blokları hiç gösterilmez, doğrudan sosyal medya finaline geçilir)

## Etkileşim Modeli

- **Scroll-tetiklemeli aşamalar** (dağ, bloklara yaklaşma, şirket bloğu, ürün blokları): normal scroll ile ilerler, `InfoPanel` açıkken de scroll devam edebilir (panel kapanmaz, sadece üstte durur) — kullanıcı isterse paneli kapatmadan okumaya devam edebilir
- **Tıklama ile bilgi:** Şirket bloğu ve her ürün bloğu tıklanabilir nesnelerdir (Three.js raycasting ile fare/dokunma konumundan hangi nesneye tıklandığı tespit edilir — küre prototipindeki pin tıklama mantığıyla aynı teknik)
- **Sosyal medya finali:** Bu tek aşamada scroll yerine yatay ok/sürükleme ile gezinme aktif olur — kullanıcıya küçük bir "→ / ←" ipucu gösterilir

## Görsel / Malzeme Yaklaşımı

- **Dağ:** Gürültü fonksiyonuyla (simplex noise) dalgalandırılmış düşük-poligonlu bir yüzey geometrisi; Three.js `Fog` ile atmosferik derinlik
- **Mermer blok:** Hafif yuvarlatılmış kenarlı kutu geometrisi; damar deseni çalışma zamanında bir `<canvas>` üzerine gürültü deseniyle çizilip doku (texture + roughness map) olarak uygulanır — dışarıdan görsel dosyası gerekmez. İleride amcadan gelecek gerçek mermer fotoğraflarıyla (bkz. materyal listesi PDF'i) değiştirilebilir bir yer tutucu olarak tasarlanır
- **Kazınmış yazı:** Playfair Display fontunun Three.js `TextGeometry` formatına (facetype.js ile) bir kerelik dönüştürülmesi gerekir; harfler ayrı, hafif gömülü bir geometri olarak bloğun yüzeyine yerleştirilir, gerçek ışık/gölge alır
- **Sosyal ikonlar:** Basit düzlem (plane) geometriler üzerine SVG/ikon dokusu olarak yerleştirilir, küpün her yüzünde bir tane

## Performans, Mobil ve Erişilebilirlik (kesin gereklilik)

- **iOS Safari ve Android Chrome/Samsung Internet** dahil tüm modern mobil tarayıcılarda çalışmalı — WebGL desteği bu tarayıcılarda standarttır
- **Dokunmatik scroll ve dokunma ile tıklama** native davranışlarla çalışır; sosyal medya finalindeki yatay gezinme dokunmatik sürüklemeyi de destekler
- **Ekran boyutuna göre sadeleştirme:** dar ekranlarda (mobil) poligon sayısı ve post-processing efektleri (gölge, bulanıklık) otomatik düşürülür
- **`prefers-reduced-motion` açıksa veya WebGL desteklenmiyorsa:** animasyon hiç oynatılmadan `IntroFallback` gösterilir — kimse zorla beklemez, erişilebilirlik ihlali olmaz
- **Yön değişikliği:** telefon döndürüldüğünde sahne otomatik yeniden boyutlanır, bozulma olmaz

## Test Yaklaşımı

- `introStages.ts` — saf fonksiyonlar, tam otomatik test edilir (görsel/DOM/WebGL gerektirmez)
- `SkipButton` — tıklama → `sessionStorage` set + yönlendirme davranışı Testing Library ile test edilir
- `IntroFallback` — koşullu render mantığı (WebGL yok / reduced motion) test edilir
- `InfoPanel` — props'a göre doğru başlık/metin render ettiği ve "Kapat"/"Tüm Sayfayı Gör" davranışları Testing Library ile test edilir
- `SocialCubeStage`'in link filtreleme mantığı (sadece dolu URL'li platformları göstermesi) saf bir fonksiyon olarak ayrıştırılıp test edilir
- `IntroCanvas` (asıl Three.js render mantığı, raycasting tıklama tespiti dahil) otomatik test edilmez — build başarısı + gerçek tarayıcıda (masaüstü ve mobil genişlikte, gerçek tıklama/dokunma denemeleriyle) görsel doğrulama ile kontrol edilir

## Kapsam Dışı (bu doküman için)

- Fotogerçekçi (igloo.inc seviyesi) görsel kalite — ayrı bir gelecek faz, gerçek 3D render veya AI-üretilmiş video gerektirir
- Gerçek mermer doku fotoğrafları ile entegrasyon — materyal listesi PDF'inde istendi, geldiğinde ayrı bir küçük görev olarak eklenir
- Ses/müzik — referans videolarda "Sound: On/Off" seçeneği var ama bu fazda talep edilmedi, dahil değil
- Ürün blok sahnelerinde gerçek ürün fotoğrafı kullanımı — şimdilik prosedürel doku, gerçek fotoğraflar geldiğinde ayrı görev
