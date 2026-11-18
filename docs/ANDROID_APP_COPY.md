# Android App Copy — Munib Tracker

> **Last updated:** July 2026
>
> **Package name:** `app.munibtracker` · **Play listing:** https://play.google.com/store/apps/details?id=app.munibtracker
>
> **Short description only** (Google Play, 80 characters max). Covers all **24 app-shipped locales** plus **6 optional ASO-only locales** (de, es, pt-BR, ja, vi, zh). Full description, keywords, and URLs: [`IOS_APP_COPY.md`](./IOS_APP_COPY.md).
>
> **Play policy tip:** Avoid ranking-style words in the short description (e.g. `first`, `best`, `#1`) — Google may reject superlative claims.
>
> **Android TV / Fire TV:** Same package (`app.munibtracker`) with `EXPO_TV=1` Leanback build. Banner/icon: `apps/app/assets/images/tv/`. Fire TV store banner/icons (`firetv-*`) are Amazon console uploads, not APK. Screenshots: `pnpm screenshots:android-tv` validates; `RUN_CAPTURE=1` writes 1080p PNGs — see [`TV.md`](./TV.md) and [`STORE_ASSETS.md`](./STORE_ASSETS.md#apple-tv--android-tv-assets). Phone short descriptions below apply until a TV-specific listing is created.

---

## Data safety — Qur'an practice

- **Audio (voice or sound recordings):** processed on the device only; not collected, not shared. `RECORD_AUDIO` purpose: Qur'an recitation practice and custom adhkar dictation.
- **Optional pronunciation drill (Quran Lab SDK):** contacts Quran Lab to download and activate its model; usage statistics are turned off in the app. The SDK may request a Play Integrity verdict when Quran Lab's config asks (fraud prevention, not linked to the user). Recitation audio is shared only if the learner agrees on Quran Lab's own sheet (not offered by the app on Android); the learner can turn it off and delete it in Settings → Qur'an practice.
- Review the merged manifest of the release build: the SDK adds `INTERNET`, `ACCESS_NETWORK_STATE`, and WorkManager's `WAKE_LOCK`, `RECEIVE_BOOT_COMPLETED`, `FOREGROUND_SERVICE`.

## en-US

Free offline companion for salah, Qur'an, zikr, qaza, prayer times, and worship.

_79/80_

---

## ar-SA

رفيق مجاني للصلاة والقرآن والذكر والقضاء وأوقات الصلاة — يعمل بدون إنترنت.

_72/80_

---

## ur-PK

نماز، قرآن، ذکر اور قضا کے لیے مفت آف لائن ساتھی — اوقاتِ نماز اور قبلہ سمت۔

_79/80_

---

## id-ID

Teman ibadah offline gratis: salat, Al-Qur'an, dzikir, qadha, waktu salat & kiblat.

_80/80_

---

## tr-TR

Ücretsiz çevrimdışı ibadet arkadaşı: namaz, Kur'an, zikir, kaza, vakitler ve kıble.

_80/80_

---

## fr-FR

Compagnon gratuit hors ligne : prière, Coran, dhikr, qada, horaires et qibla.

_76/80_

---

## ru-RU

Бесплатный офлайн-компаньон: намаз, Коран, зикр, када, намаз-вакты и кибла.

_76/80_

---

## bn-BD

বিনামূল্যে অফলাইন সঙ্গী: সালাত, কুরআন, যিকর, কাজা, নামাজের সময় ও কিবলা।

_80/80_

---

## ms-MY

Rakan ibadah luar talian percuma: solat, Quran, zikir, qada, waktu solat & kiblat.

_80/80_

---

## fa-IR

همراه رایگان آفلاین: نماز، قرآن، ذکر، قضا، اوقات شرعی و قبله.

_58/80_

---

## de-DE

Kostenloser Offline-Begleiter für Salah, Qur'an, Dhikr, Qaza, Gebetszeiten & Qibla.

_80/80_

---

## es-ES / es-MX

Compañero gratuito sin conexión: salat, Corán, dhikr, qadha, horarios y qibla.

_78/80_

---

## hi-IN

मुफ़्त ऑफ़लाइन साथी: नमाज़, क़ुरआन, ज़िक्र, क़ज़ा, नमाज़ के समय और क़िबला।

_80/80_

---

## pt-BR

Companheiro gratuito offline: salat, Alcorão, dhikr, qadha, horários e qibla.

_76/80_

---

## ja-JP

無料のオフライン礼拝コンパニオン。礼拝・クルアーン・ズィクル・カダー・礼拝時間・キブラ。

_48/80_

---

## vi-VN

Bạn đồng hành miễn phí ngoại tuyến: cầu nguyện, Qur'an, dhikr, qadha, giờ & hướng.

_80/80_

---

## zh-CN

免费离线礼拜伴侣：礼拜追踪、古兰经、记念、还补、礼拜时间与朝向。

_32/80_

---

## ha-NG

Abokin ibada offline kyauta: sallah, Alkur'ani, zikiri, kaza, lokutan sallah & qibla.

_80/80_

---

## sw-TZ

Rafiki wa ibada nje ya mtandao: swala, Qur'an, dhikr, qadha, nyakati za swala & qibla.

_80/80_

---

## az-AZ

Oflayn ibadət yoldaşı: namaz, Qur'an, zikr, qəza, namaz vaxtları və qiblə — pulsuz.

_78/80_

---

## ps-AF

آفلاین ملګری: لمونځ، قرآن، ذکر، قضا، د لمونځ وختونه او قبله — وړیا، پرته له اعلاناتو.

_80/80_

---

## so-SO

Saaxiib offline oo bilaash ah: salaadda, Qur'aanka, xuska, qadha, waqtiyada & qibla.

_78/80_

---

## uz-UZ

Oflayn ibodat hamrohi: namoz, Qur'on, zikr, qazo, namoz vaqtlari va qibla — bepul.

_76/80_

---

## kk-KZ

Офлайн серіктес: намаз, Құран, зікір, қаза, намаз уақыттары мен қибла — тегін.

_72/80_

---

## ku

هاوڕێی ئۆفلاین: نوێژ، قورئان، زیکر، قەزا، کاتەکانی نوێژ و قیبلە — بەخۆڕایی.

_72/80_

---

## bs-BA

Offline pratilac: namaz, Kur'an, zikr, kaza, vremena namaza i kibla — besplatno.

_72/80_

---

## sq-AL

Shoqërues offline: namazi, Kurani, dhikri, kaza, koha e namazit dhe kibla — falas.

_76/80_

---

## ky-KG

Офлайн шерик: намаз, Коран, зикр, каза, намаз убактысы жана кибла — акысыз.

_68/80_

---

## tg-TJ

Ҳамроҳи офлайн: намоз, Қуръон, зикр, қазо, вақти намоз ва қибла — ройгон.

_62/80_

---

## tk-TM

Awtonom ýoldaş: namaz, Kuran, zikr, kaza, namaz wagty we kibla — mugt, reklamasyz.

_72/80_

---

## Optional ASO-only (no in-app UI catalog)

de-DE, es-ES, hi-IN, pt-BR, ja-JP, vi-VN, zh-CN — see sections above. Full listings in [`IOS_APP_COPY.md`](./IOS_APP_COPY.md) §11–17.
