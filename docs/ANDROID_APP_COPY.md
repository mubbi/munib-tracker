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
>
> **Wear OS (quality item WO-G2, review blocker):** the Play full description must name the tiles and complications the watch ships. The full description is shared with [`IOS_APP_COPY.md`](./IOS_APP_COPY.md), which must never mention Wear OS (App Store 2.3.10), so append this paragraph **in Play Console only**, in each listing language (en / ar / ur below; other locales use the English one until translated):
>
> - **en:** On Wear OS: a Next Salah tile with a progress ring and one-tap marking, a Today tile with all five Salah, a Tasbeeh tile, Next Salah and daily-progress complications for your watch face, and a full tasbeeh counter with rotating-bezel counting and haptics. Marks sync to the phone app, even if your phone was out of reach.
> - **ar:** على Wear OS: بلاطة الصلاة القادمة مع حلقة التقدّم والتسجيل بلمسة، وبلاطة اليوم بالصلوات الخمس، وبلاطة التسبيح، ومضاعفات الصلاة القادمة وتقدّم اليوم لواجهة الساعة، وعدّاد تسبيح كامل بالتدوير والاهتزاز. يُرسل التسجيل إلى تطبيق الهاتف حتى لو كان بعيدًا.
> - **ur:** Wear OS پر: اگلی نماز کی ٹائل (پیش رفت کے دائرے اور ایک تھپتھپاہٹ سے درج کرنے کے ساتھ)، آج کی پانچوں نمازوں کی ٹائل، تسبیح ٹائل، واچ فیس کے لیے اگلی نماز اور آج کی پیش رفت کی کمپلیکیشنز، اور گھومنے والے بیزل اور ارتعاش کے ساتھ مکمل تسبیح کاؤنٹر۔ نماز کا اندراج فون ایپ تک پہنچ جاتا ہے، چاہے فون دور ہو۔
>
> Wear screenshots (WO-G5): at least one 1:1 watch screenshot without a device frame, plus a tile — see [`STORE_ASSETS.md`](./STORE_ASSETS.md#store-screenshot-status).

---

## Data safety — Qur'an practice

- **Audio (voice or sound recordings):** processed on the device only; not collected, not shared. `RECORD_AUDIO` purpose: Qur'an recitation practice and custom adhkar dictation.
- **Optional pronunciation drill (Quran Lab TajweedFormer SDK 4, D66):** after the learner agrees on the consent sheet, contacts Quran Lab to download its encrypted model and renew a per-install lease. The SDK **always** sends Quran Lab anonymous daily usage counts and crash/error reports (app diagnostics: never audio, text, names or device identifiers; not linked to the user, not used for tracking) — declare under Data safety → App info and performance (Crash logs, Diagnostics), collected by a third party, not shared for advertising. Install keys are attested with Android hardware attestation or Play Integrity (fraud prevention, not linked to the user). After a few takes the SDK's own sheet may ask (at most three times) whether to share recordings; audio is uploaded only after the learner says yes — declare Audio → Voice or sound recordings as optional, user-initiated; the learner can turn it off and delete it in Settings → Qur'an practice. Phones with an unlocked bootloader can't open the model. Owner action: add the Play app-signing and upload-key SHA-256 certificates on the Android key's page at sdk.quranlab.ai.
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
