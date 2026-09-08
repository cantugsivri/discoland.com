---
name: disco-perf-guardian
description: DISCOLAND web sitesinin sayfa açılış hızını, görsel ağırlıklarını, render-blocking öğelerini ve Core Web Vitals hazır bulunuşluğunu denetleyen uzman skill.
---

# DISCOLAND Performans Koruyucusu (disco-perf-guardian)

Bu skill, sitede yapılan her görsel, stil ve script değişikliği sonrasında web sitesinin 95+ performans standardını ve bütçe sınırlarını korumasını denetler.

## Nasıl Kullanılır?

Ajan veya geliştirici aşağıdaki komut ile performans denetimini doğrudan çalıştırabilir:

```bash
node .agents/skills/disco-perf-guardian/scripts/check_perf.js
```

## Denetlenen Standartlar

1. **Render-Blocking Kontrolü:** `style.css` içerisinde yavaşlatan `@import` bulunmadığı teyit edilir.
2. **Font & Bağlantı Hızı:** `index.html` dosyasında Google Fonts için `preconnect` ve async bağlantıların kurulu olduğu doğrulanır.
3. **Scroll & 60 FPS Akıcılığı:** `js/main.js` içerisinde kaydırma dinleyicilerinin `requestAnimationFrame` ve `{ passive: true }` ile donatıldığı teyit edilir.
4. **Asset & Görsel Bütçesi:** Favicon'un < 25 KB olduğu ve hiçbir görselin 500 KB sınırını aşmadığı kontrol edilir.
