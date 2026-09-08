---
name: i18n-sync-validator
description: DISCOLAND web sitesinin TR ve EN dil sözlüklerinin senkronizasyonunu, eksik anahtarları ve index.html ile eşleşmesini denetleyen uzman skill.
---

# DISCOLAND Çeviri Senkronizasyon Skill'i (i18n-sync-validator)

Bu skill, `js/translations.js` dosyasındaki Türkçe (TR) ve İngilizce (EN) sözlükleri arasındaki senkronizasyonu denetlemek ve `index.html` içinde kullanılan tüm `data-i18n` ve `data-i18n-html` anahtarlarının geçerli olduğunu doğrulamak için kullanılır.

## Nasıl Kullanılır?

Ajan veya geliştirici aşağıdaki komut ile doğrulama betiğini doğrudan çalıştırabilir:

```bash
node .agents/skills/i18n-sync-validator/scripts/validate.js
```

## Denetim Kriterleri

1. **İki Yönlü Eşleşme:** Türkçe sözlükte tanımlanıp İngilizcesi unutulan veya İngilizceye eklenip Türkçede kalmayan tüm anahtarlar listelenir.
2. **HTML Bütünlüğü:** `index.html` sayfasında `data-i18n` etiketi ile çağrılan ancak sözlükte bulunmayan kırık anahtarlar tespit edilir.
3. **Sıfır Hata Politikası:** Herhangi bir anahtar eksikliği tespit edildiğinde betik hata koduyla sonlanır ve düzeltme önerisi sunar.
