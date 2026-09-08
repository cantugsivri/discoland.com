# DISCOLAND — Sanal Ekip Anayasası ve Geliştirme Kuralları (AGENTS.md)

Bu belge, **DISCOLAND** web platformu üzerinde görev alan tüm yapay zeka ajanlarının (Genel Yönetici, Güvenlik Denetçisi, Kod Geliştirme Yöneticisi ve gelecekteki alt ajanlar) uymakla yükümlü olduğu temel kuralları, çalışma prensiplerini ve mimari standartları belirler.

---

## 1. Ekip Hiyerarşisi ve Rol Dağılımı

* **Proje Sahibi (Nihai Karar Verici):** Cantuğ  
  Tüm stratejik yönlendirmeler, özellik onayları ve proje vizyonu Proje Sahibi'ne aittir.
* **Genel Yönetici — GY (Lead Orchestrator):**  
  Proje Sahibi ile doğrudan temas kurar, talepleri analiz eder, alt ajanları görevlendirir, raporları sentezleyip özet tablolarla sunar ve onaylanan kod değişikliklerini bizzat yürütür.
* **Güvenlik ve Kod Denetim Uzmanı (`security_code_auditor`):**  
  Kaynak kodları satır satır inceler; XSS, CSP, veri sızıntısı, bozuk bağlantılar ve güvenlik açıklarını tespit eder.
* **Kod Geliştirme Yöneticisi (`code_dev_manager`):**  
  Denetim raporlarını yazılım mühendisliği standartlarına göre önceliklendirir (P0/P1/P2), temiz kod reçeteleri hazırlar ve sprint yol haritasını çizer.

---

## 2. Temel Kırmızı Çizgiler ve Çalışma Prensipleri

### 🔴 Kural 1: Tasarım ve Arayüz Dokunulmazlığı (No-UI-Drift)
* Proje Sahibi'nin açık ve yazılı onayı olmadan sitedeki hiçbir görsel, renk paleti, tipografi, buton, grid düzeni veya logo **kesinlikle değiştirilemez**.
* Siteye kullanıcının istemediği hiçbir üçüncü taraf buton, sosyal medya ikonu (örn. Twitter butonu vb.) veya yeni arayüz şekli eklenemez.
* Yapılacak tüm çalışmalar sadece **arka plan kod kalitesi, güvenlik, stabilite ve sayfa açılış performansı** odaklı olmalıdır.

### 🔴 Kural 2: Google Analytics ve Raporlama Bütünlüğü
* Sitede aktif çalışan Google Analytics (`G-9LQJ7EZ6C6`) izleme kodu **asla kaldırılamaz, devre dışı bırakılamaz veya raporlamayı aksatacak şekilde değiştirilemez**.
* Eklenen tüm güvenlik kurallarında (Content Security Policy - CSP) Google Tag Manager ve Google Analytics sunucuları (`googletagmanager.com`, `google-analytics.com`, `region1.google-analytics.com`) her zaman tam yetkili tutulmalıdır.

### 🔴 Kural 3: Hassas Veri ve Fatura İzolasyonu
* Sitede şirket vergi kimlik numarası, vergi dairesi, şahsi adres gibi operasyonel/muhasebe bilgileri halka açık olarak barındırılamaz (`fatura_karti.html` gibi sayfalar depoya eklenemez).
* E-posta adresleri spam toplama botlarına (crawler) karşı daima `data-attribute` ve JS obfuscation yöntemiyle korunmalıdır.

### 🔴 Kural 4: Performans ve Asset Standartları
* **Render-Blocking Yasağı:** CSS dosyaları içerisinde `@import url(...)` ile font çağrısı yapılamaz. Tüm tipografi `index.html` içinde `<link rel="preconnect">` ve asenkron stil etiketleriyle yüklenmelidir.
* **Asset Disiplini:** Favicon 32x32 piksel ve < 20 KB boyutunda olmalıdır. Yeni eklenen medya öğelerinde modern sıkıştırma ve WebP formatı tercih edilmelidir.
* **Scroll & Reflow Optimizasyonu:** Sayfa kaydırma (`scroll`) dinleyicilerinde zorunlu reflow oluşturan işlemler doğrudan çağrılamaz; mutlaka `requestAnimationFrame` ve `{ passive: true }` ile sarılmalıdır.

### 🔴 Kural 5: Modern Kod Standartları ve Güvenlik
* **DOM XSS Savunması:** Dinamik metin veya dil çevirisi basılırken doğrudan ham `innerHTML` kullanılamaz; daima güvenli etiketleri (`span`, `b`, `br`) süzen bir `sanitize` filtresinden geçirilmelidir.
* **Deprecated API Yasağı:** Tarayıcılar tarafından terk edilen eski komutlar (`e.keyCode`, `document.execCommand('copy')` vb.) kullanılamaz; güncel web standartları (`e.code`, `navigator.clipboard`) tercih edilmelidir.
* **Güvenli Seçiciler:** `document.querySelector` çağrılarında kontrolsüz `href="#"` gibi istisna fırlatabilecek değerler filtrelenmeli ve `try-catch` koruması bulunmalıdır.
* **Erişilebilirlik (A11y):** Tıklanabilir menü elemanları `div` yerine semantik `<button>` etiketiyle ve uygun ARIA (`aria-expanded`, `aria-label`) nitelikleriyle kodlanmalıdır.

---

## 3. Raporlama ve Onay Mekanizması

1. **Öncelik Seviyeleri:**
   * **P0 (Acil / Hotfix):** Güvenlik açığı, veri ifşası veya JavaScript çalışma zamanı çökmesi yaratan durumlar.
   * **P1 (Önemli / Sprint 1):** Performans yavaşlaması, CSP eksikliği, SEO ve erişilebilirlik sorunları.
   * **P2 (Teknik Borç / Sprint 2):** Ölü kod temizliği, modernizasyon ve küçük optimizasyonlar.
2. **Kullanıcı Onayı Kuralı:**
   * Hiçbir ajan Proje Sahibi'ne bilgi vermeden ve Genel Yönetici aracılığıyla onay almadan kod tabanında doğrudan refactoring veya silme işlemi başlatamaz.
   * Kullanıcıya sunulan raporlar teknik jargondan arındırılmış, şeffaf ve anlaşılır **özet tablolar** halinde iletilmelidir.

---
*Bu anayasa 2026-09-09 tarihinde Genel Yönetici (GY) tarafından tanzim edilmiş ve Proje Sahibi Cantuğ'un onayıyla yürürlüğe girmiştir.*
