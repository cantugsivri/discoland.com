---
name: disco-code-auditor
description: DISCOLAND web sitesinin kaynak kodlarını, XSS/CSP güvenlik açıklarını, performansını ve modern web standartlarını denetleyen uzman skill.
---

# DISCOLAND Güvenlik ve Kod Denetim Skill'i

Bu skill, DISCOLAND projesinde yapılacak her geliştirme veya değişiklik sonrasında sitenin güvenliğini ve kalitesini denetlemek için kullanılır.

## Denetim Kontrol Listesi

1. **Güvenlik & Gizlilik (Security & Privacy):**
   - Sitede hassas şirket, vergi no veya şahıs iletişim verisi sızıyor mu?
   - `index.html` dosyasındaki Content Security Policy (CSP) meta etiketi Google Tag Manager, Google Analytics ve YouTube izinlerini eksiksiz kapsıyor mu?
   - `[data-i18n-html]` veya dinamik DOM manipülasyonlarında `sanitizeTranslationHtml` fonksiyonu devrede mi?

2. **Performans & Asset Standartları:**
   - `style.css` içerisinde render-blocking `@import` bulunuyor mu?
   - Fontlar `index.html` `<head>` içerisinde `preconnect` ile mi çağrılıyor?
   - Sayfa kaydırma (`scroll`) dinleyicilerinde `requestAnimationFrame` ve `{ passive: true }` kullanılıyor mu?
   - Favicon veya görseller optimize edilmiş mi (aşırı KB yükü var mı)?

3. **Çalışma Zamanı & Kararlılık (Runtime Stability):**
   - Sayfadaki linkler (`a[href^="#"]`) `#` olduğunda JavaScript konsol hatası fırlatıyor mu?
   - Deprecated API (`e.keyCode`, `execCommand`) kullanımı var mı?
   - Hamburger menü semantik `<button>` ve ARIA niteliklerine sahip mi?

4. **Raporlama Formatı:**
   - Tüm bulgular P0 (Acil), P1 (Önemli), P2 (Teknik Borç) formatında Genel Yönetici'ye (GY) özet tablo olarak sunulmalıdır.
