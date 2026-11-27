# What's New in This Version — store release notes

> **Release:** the app release after **1.4.0** (expected **1.5.0** from Release Please), covering
> 173 commits from 2026-11-19 to 2026-11-27 (`0798ec61..7d26c6ab`).
>
> **Field:** App Store Connect → _What's New in This Version_ (**4,000 characters max**). Every
> language below is under the limit; counts are Unicode characters, as Apple counts them.
>
> **Languages:** all **24 app-shipped locales** from
> [`packages/shared/src/i18n/locale-registry.ts`](../packages/shared/src/i18n/locale-registry.ts).
> Store locale codes match [`IOS_APP_COPY.md`](./IOS_APP_COPY.md). The optional ASO-only locales
> (de, es, pt-BR, ja, vi, zh) can reuse the English text.
>
> **Policy:** the text is platform-neutral, so it is safe for the App Store (no price or "free",
> guideline 2.3.7; no Android / Wear OS / Google Play, guideline 2.3.10).
>
> **Google Play:** the Play _Release notes_ field is limited to **500 characters per language**,
> so Play gets its own short version — see [Google Play release notes](#google-play-release-notes-500-chars)
> at the end. The short version leaves out Salah focus lock until the Play filings are done.
>
> **Before submitting:** once the Play focus-lock filings in
> [`FOCUS_LOCK_FILINGS.md`](./FOCUS_LOCK_FILINGS.md) are done, a focus-lock bullet can be added to
> the Play notes if it still fits under 500 characters.
>
> **Terminology** follows each locale's in-app catalog (`apps/app/src/i18n/<code>.json`) so the
> notes match what users see in the app. Translations are AI-written; a native-speaker read is
> welcome before submitting.

# App Store — What's New (4,000 chars)

## Quick-reference index

| #   | Language                      | App locale | Store locale | Chars |
| --- | ----------------------------- | ---------- | ------------ | ----- |
| 1   | English                       | `en`       | `en-US`      | 2,864 |
| 2   | Arabic — العربية              | `ar`       | `ar-SA`      | 2,634 |
| 3   | Urdu — اردو                   | `ur`       | `ur-PK`      | 2,910 |
| 4   | Indonesian — Bahasa Indonesia | `id`       | `id-ID`      | 3,302 |
| 5   | Turkish — Türkçe              | `tr`       | `tr-TR`      | 3,052 |
| 6   | Bengali — বাংলা                 | `bn`       | `bn-BD`      | 2,836 |
| 7   | Malay — Bahasa Melayu         | `ms`       | `ms-MY`      | 3,292 |
| 8   | Persian — فارسی               | `fa`       | `fa-IR`      | 2,803 |
| 9   | French — Français             | `fr`       | `fr-FR`      | 3,649 |
| 10  | Hausa                         | `ha`       | `ha-NG`      | 3,206 |
| 11  | Swahili — Kiswahili           | `sw`       | `sw-TZ`      | 3,321 |
| 12  | Russian — Русский             | `ru`       | `ru-RU`      | 3,145 |
| 13  | Azerbaijani — Azərbaycanca    | `az`       | `az-AZ`      | 3,039 |
| 14  | Pashto — پښتو                 | `ps`       | `ps-AF`      | 2,827 |
| 15  | Somali — Soomaali             | `so`       | `so-SO`      | 3,633 |
| 16  | Uzbek — Oʻzbekcha             | `uz`       | `uz-UZ`      | 3,326 |
| 17  | Kazakh — Қазақша              | `kk`       | `kk-KZ`      | 3,172 |
| 18  | Kurdish (Sorani) — کوردی      | `ku`       | `ku`         | 3,120 |
| 19  | Bosnian — Bosanski            | `bs`       | `bs-BA`      | 3,074 |
| 20  | Hindi — हिन्दी                 | `hi`       | `hi-IN`      | 2,879 |
| 21  | Albanian — Shqip              | `sq`       | `sq-AL`      | 3,338 |
| 22  | Kyrgyz — Кыргызча             | `ky`       | `ky-KG`      | 3,195 |
| 23  | Tajik — Тоҷикӣ                | `tg`       | `tg-TJ`      | 3,077 |
| 24  | Turkmen — Türkmençe           | `tk`       | `tk-TM`      | 3,181 |

---

## 1. English (`en-US`)

```text
Our biggest update yet — new ways to worship, a fresh design, and a quieter, more reliable app.

NEW IN WORSHIP
• Guided adhkar sessions: every zikr of a set on one screen with the counter built in, logged per Salah, with "Why we recite this" showing the full source hadith and its grade.
• After-Salah tasbeeh (33/33/34) and hands-free tasbeeh: teach any zikr by saying it three times and the counter follows your voice, on your device only.
• Sunnah rawatib under each fard in the tracker, a voluntary fasting planner, daily Sunnah habits, and step-by-step Dhul-Hijjah and Umrah companions.
• New tasbeeh designs: ring, misbaha beads, clicker, pebbles, finger counting and more, with click sounds and haptics.
• Salah focus lock: set distracting apps aside during Salah, in gentle, firm or strict mode.

QUR'AN
• Recite along on any ayah range, and find a verse just by reciting it.
• A pronunciation check that points out skipped or unclear words, plus tajweed coaching drills.
• Ayah notes with colour highlights and tags, and Arabic root-word search.
• Practice now counts toward your reading log and khatm, with recitation stats and achievements.
• Calligraphic surah names and refreshed surah cards.

PRIVATE SELF-ACCOUNTABILITY
• Nightly muhasabah, family ties, a debts and trusts record, a guided wasiyyah builder and a gentle weekly coach, kept in an encrypted vault with optional private sync.
• An inheritance (mirath) calculator for all four schools, and a "My madhhab" setting that applies your school across guides and calculators.

TOGETHER
• Circles for family, an accountability partner and group khatm. Join someone nearby with a short code and their approval.
• Kids mode with a guided recite screen.
• Masjid finder with a home masjid, and import its timetable from a photo.

A FRESH LOOK
• Every screen redesigned for clarity, with one-tap Salah marking from Home and the tracker.
• Redesigned statistics, achievements, duas and zikr screens; adhkar sets that are due now come first.
• Seasonal app icons, a searchable settings panel and Hijri date adjustment.

WIDGETS, WATCH & TV
• Widgets and Live Activities follow the current Salah, with new adhkar and Islamic events widgets.
• On the watch, only the Salah that is due can be marked, with undo, and your tasbeeh count is kept.
• On TV: home-screen rows and voice search.

FIXES & POLISH
• Adhkar recited after midnight are logged under the night they belong to (Fajr to Fajr).
• Zikr counts sync right after you record them.
• Reminders no longer fire twice, and prayer names no longer break mid-word.
• Verified repetition counts for every zikr, and full Qur'anic recitations restored in the adhkar.
• Translations reviewed across all 24 languages.
• Security and privacy hardening throughout.

Jazakum Allahu khayran for using Munib Tracker. Feedback: https://munibtracker.app/contact
```

_2,864/4,000 chars_

---

## 2. Arabic — العربية (`ar-SA`)

_Right-to-left — paste as is._

```text
أكبر تحديث لنا حتى الآن — طرق جديدة للعبادة، وتصميم متجدد، وتطبيق أهدأ وأكثر موثوقية.

جديد في العبادة
• جلسات الأذكار الموجَّهة: جميع أذكار المجموعة في شاشة واحدة مع عدّاد مدمج، وتُسجَّل لكل صلاة، مع قسم «لماذا نردّد هذا الذكر» الذي يعرض الحديث المصدر كاملًا ودرجته.
• تسبيح دبر الصلاة (33/33/34) والتسبيح دون استخدام اليدين: علِّم التطبيق أي ذكر بترديده ثلاث مرات فيتبع العدّاد صوتك، على جهازك فقط.
• السنن الرواتب تحت كل فرض في شاشة المتابعة، ومخطِّط لصيام التطوع، وعادات السنة اليومية، ومرافق خطوة بخطوة لذي الحجة وآخر للعمرة.
• تصاميم جديدة للتسبيح: الحلقة، وخرز المسبحة، والعدّاد اليدوي، والحصى، والعدّ بالأصابع وغيرها، مع أصوات النقر والاهتزاز.
• قفل التركيز للصلاة: أبعِد التطبيقات المشتّتة جانبًا أثناء الصلاة، بالوضع اللطيف أو الحازم أو الصارم.

القرآن
• «اقرأ مع المستمع» على أي نطاق من الآيات، وابحث عن الآية بمجرد تلاوتها.
• فحص النطق الذي ينبّهك إلى الكلمات المتروكة أو غير الواضحة، إضافةً إلى تمارين للتدرّب على التجويد.
• ملاحظات على الآيات مع تظليل ملوّن ووسوم، وبحث بالجذور العربية.
• أصبح التدرّب يُحتسب في سجل القراءة والختمة، مع إحصاءات التلاوة والإنجازات.
• أسماء السور بخط عربي فني، وبطاقات سور متجددة.

المحاسبة الذاتية الخاصة
• محاسبة النفس الليلية، وصلة الرحم، وسجل الديون والأمانات، ومُنشئ موجَّه للوصية، ومرشد أسبوعي لطيف، كلها محفوظة في خزنة مشفّرة مع مزامنة خاصة اختيارية.
• حاسبة الميراث للمذاهب الأربعة، وإعداد «مذهبي» الذي يطبّق مذهبك في الأدلة والحاسبات.

معًا
• حلقات للعائلة ولرفيق المتابعة وللختمة الجماعية. انضم إلى شخص قريب منك برمز قصير وبموافقته.
• وضع الأطفال مع شاشة تلاوة موجَّهة.
• البحث عن المساجد مع تحديد مسجدك المعتاد، واستيراد جدول أوقاته من صورة.

مظهر جديد
• إعادة تصميم كل الشاشات لمزيد من الوضوح، مع تسجيل الصلاة بلمسة واحدة من الرئيسية وشاشة المتابعة.
• شاشات جديدة للإحصاءات والإنجازات والأدعية والأذكار؛ وتظهر أولًا مجموعات الأذكار التي حان وقتها.
• أيقونات موسمية للتطبيق، ولوحة إعدادات قابلة للبحث، وتعديل التاريخ الهجري.

الأدوات والساعة والتلفاز
• تتابع أدوات الشاشة الرئيسية والأنشطة المباشرة الصلاةَ الحالية، مع أدوات جديدة للأذكار والمناسبات الإسلامية.
• على الساعة، لا يمكن تسجيل إلا الصلاة التي حان وقتها، مع إمكانية التراجع، ويُحفظ عدد تسبيحك.
• على التلفاز: صفوف على الشاشة الرئيسية وبحث صوتي.

إصلاحات وتحسينات
• الأذكار المقروءة بعد منتصف الليل تُسجَّل في الليلة التي تنتمي إليها (من الفجر إلى الفجر).
• تتزامن أعداد الأذكار فور تسجيلها.
• لم تعد التذكيرات تصل مرتين، ولم تعد أسماء الصلوات تنقسم في منتصف الكلمة.
• أعداد تكرار موثَّقة لكل ذكر، واستعادة التلاوات القرآنية كاملة في الأذكار.
• مراجعة الترجمات في جميع اللغات الـ24.
• تعزيز الأمان والخصوصية في كل أرجاء التطبيق.

جزاكم الله خيرًا على استخدام Munib Tracker. لملاحظاتكم: https://munibtracker.app/contact
```

_2,634/4,000 chars_

---

## 3. Urdu — اردو (`ur-PK`)

_Right-to-left — paste as is._

```text
اب تک کی ہماری سب سے بڑی اپ ڈیٹ — عبادت کے نئے طریقے، نیا ڈیزائن، اور زیادہ پُرسکون اور قابلِ اعتماد ایپ۔

عبادت میں نیا
• رہنما اذکار نشستیں: ایک مجموعے کے تمام اذکار ایک ہی اسکرین پر، بلٹ اِن کاؤنٹر کے ساتھ، ہر نماز کے حساب سے درج، اور «یہ ذکر کیوں پڑھتے ہیں» میں ماخذ حدیث مکمل متن اور درجے کے ساتھ۔
• نماز کے بعد کی تسبیح (33/33/34) اور بغیر ہاتھ لگائے تسبیح: کوئی بھی ذکر تین بار پڑھ کر سکھائیں، پھر کاؤنٹر آپ کی آواز کے ساتھ چلے گا — صرف آپ کی ڈیوائس پر۔
• ٹریکر میں ہر فرض کے نیچے سنتِ مؤکدہ (رواتب)، نفلی روزوں کا منصوبہ ساز، روزانہ کی سنت کی عادات، اور ذوالحجہ و عمرہ کے لیے قدم بہ قدم رہنما۔
• تسبیح کے نئے ڈیزائن: دائرہ، مسبحہ کے دانے، کلکر، کنکریاں، انگلیوں پر گنتی اور بہت کچھ، کلک کی آواز اور ارتعاش کے ساتھ۔
• نماز فوکس لاک: نماز کے دوران توجہ ہٹانے والی ایپس کو ایک طرف رکھیں — نرم، مضبوط یا سخت موڈ میں۔

قرآن
• کسی بھی آیات کے حصے پر ساتھ ساتھ پڑھیں، اور صرف تلاوت کر کے آیت تلاش کریں۔
• تلفظ کی جانچ جو چھوٹے ہوئے یا غیر واضح الفاظ کی نشاندہی کرتی ہے، ساتھ ہی تجوید کی تربیتی مشقیں۔
• آیات پر نوٹس، رنگین نمایاں کاری اور ٹیگز کے ساتھ، اور عربی مادّوں سے تلاش۔
• مشق اب آپ کے تلاوت کے ریکارڈ اور ختم میں شمار ہوتی ہے، تلاوت کے اعداد و شمار اور کامیابیوں کے ساتھ۔
• سورتوں کے خطاطی والے نام اور نئے انداز کے سورہ کارڈز۔

نجی خود احتسابی
• رات کا محاسبہ، صلہ رحمی، قرض اور امانتوں کا ریکارڈ، وصیت تیار کرنے کا رہنما، اور نرم ہفتہ وار رہنما — سب ایک انکرپٹڈ والٹ میں، اختیاری نجی سنک کے ساتھ۔
• چاروں مسالک کے لیے وراثت (میراث) کیلکولیٹر، اور «میرا مسلک» کی ترتیب جو رہنماؤں اور کیلکولیٹرز میں آپ کا مسلک لاگو کرتی ہے۔

مل کر
• خاندان، احتساب کے ساتھی اور اجتماعی ختم کے لیے حلقے۔ قریب موجود کسی شخص کے ساتھ مختصر کوڈ اور اس کی منظوری سے شامل ہوں۔
• بچوں کا موڈ، رہنمائی کے ساتھ تلاوت کی اسکرین سمیت۔
• مسجد تلاش، اپنی مسجد منتخب کرنے کے ساتھ، اور اس کا نظام الاوقات تصویر سے درآمد کریں۔

نیا انداز
• ہر اسکرین وضاحت کے لیے نئے سرے سے ڈیزائن کی گئی، ہوم اور ٹریکر سے ایک ٹیپ میں نماز درج کرنے کی سہولت کے ساتھ۔
• اعداد و شمار، کامیابیوں، دعاؤں اور ذکر کی اسکرینوں کا نیا ڈیزائن؛ جن اذکار کا وقت ہو چکا ہو وہ سب سے پہلے۔
• موسمی ایپ آئیکنز، قابلِ تلاش ترتیبات کا پینل، اور ہجری تاریخ کی تصحیح۔

وجیٹس، واچ اور ٹی وی
• وجیٹس اور لائیو ایکٹیویٹیز موجودہ نماز کے ساتھ چلتی ہیں، اذکار اور اسلامی مواقع کے نئے وجیٹس کے ساتھ۔
• واچ پر صرف وہی نماز درج کی جا سکتی ہے جس کا وقت ہو، واپس لینے کی سہولت کے ساتھ، اور آپ کی تسبیح کی گنتی محفوظ رہتی ہے۔
• ٹی وی پر: ہوم اسکرین کی قطاریں اور آواز سے تلاش۔

اصلاحات اور بہتری
• آدھی رات کے بعد پڑھے گئے اذکار اسی رات میں درج ہوتے ہیں جس سے وہ تعلق رکھتے ہیں (فجر سے فجر تک)۔
• ذکر کی گنتی درج کرتے ہی فوراً سنک ہو جاتی ہے۔
• یاددہانیاں اب دو بار نہیں آتیں، اور نمازوں کے نام اب لفظ کے بیچ سے نہیں ٹوٹتے۔
• ہر ذکر کی تصدیق شدہ تکرار کی تعداد، اور اذکار میں مکمل قرآنی تلاوتیں بحال۔
• تمام 24 زبانوں میں تراجم کا جائزہ۔
• پوری ایپ میں سیکیورٹی اور پرائیویسی کی مضبوطی۔

Munib Tracker استعمال کرنے پر جزاکم اللہ خیراً۔ رائے کے لیے: https://munibtracker.app/contact
```

_2,910/4,000 chars_

---

## 4. Indonesian — Bahasa Indonesia (`id-ID`)

```text
Pembaruan terbesar kami sejauh ini — cara baru beribadah, tampilan baru, serta aplikasi yang lebih tenang dan andal.

IBADAH BARU
• Sesi zikir terpandu: seluruh zikir dalam satu rangkaian tampil di satu layar dengan penghitung bawaan, tercatat per salat, dilengkapi "Mengapa kita membaca ini" yang menampilkan hadis sumber lengkap beserta derajatnya.
• Tasbih setelah salat (33/33/34) dan tasbih tanpa sentuh: ajarkan zikir apa pun dengan mengucapkannya tiga kali, lalu penghitung mengikuti suara Anda — hanya di perangkat Anda.
• Sunah rawatib di bawah setiap salat fardu pada pelacak, perencana puasa sunah, kebiasaan sunah harian, serta pendamping langkah demi langkah untuk Zulhijah dan umrah.
• Desain tasbih baru: cincin, butir tasbih, klik digital, kerikil, hitungan jari, dan lainnya, dengan suara klik dan getaran.
• Kunci fokus salat: singkirkan aplikasi yang mengganggu selama salat, dengan mode lembut, tegas, atau ketat.

AL-QUR'AN
• Baca bersama pada rentang ayat mana pun, dan temukan ayat cukup dengan membacanya.
• Pemeriksaan pelafalan yang menandai kata yang terlewat atau kurang jelas, ditambah latihan bimbingan tajwid.
• Catatan ayat dengan sorotan warna dan tag, serta pencarian akar kata Arab.
• Latihan kini dihitung dalam catatan bacaan dan khatam Anda, lengkap dengan statistik bacaan dan pencapaian.
• Nama surah berkaligrafi dan kartu surah yang diperbarui.

EVALUASI DIRI SECARA PRIBADI
• Muhasabah malam, silaturahmi, catatan utang & amanah, panduan menyusun wasiat, dan pendamping mingguan yang lembut — tersimpan dalam brankas terenkripsi dengan sinkronisasi pribadi opsional.
• Kalkulator warisan (faraid) untuk keempat mazhab, serta pengaturan "Mazhab saya" yang menerapkan mazhab Anda di seluruh panduan dan kalkulator.

BERSAMA
• Lingkaran untuk keluarga, rekan akuntabilitas, dan khatam bersama. Bergabunglah dengan orang di dekat Anda menggunakan kode singkat dan persetujuannya.
• Mode anak dengan layar membaca terpandu.
• Pencari masjid dengan masjid utama, serta impor jadwalnya dari foto.

TAMPILAN BARU
• Setiap layar didesain ulang agar lebih jelas, dengan penandaan salat sekali ketuk dari Beranda dan pelacak.
• Layar statistik, pencapaian, doa, dan zikir didesain ulang; rangkaian zikir yang sudah waktunya tampil paling atas.
• Ikon aplikasi musiman, panel pengaturan yang bisa dicari, dan penyesuaian tanggal Hijriah.

WIDGET, JAM TANGAN & TV
• Widget dan Aktivitas Langsung mengikuti salat yang sedang berlangsung, dengan widget baru untuk zikir dan hari besar Islam.
• Di jam tangan, hanya salat yang sudah waktunya yang bisa ditandai, dengan opsi urungkan, dan hitungan tasbih Anda tetap tersimpan.
• Di TV: baris di layar utama dan pencarian suara.

PERBAIKAN & PENYEMPURNAAN
• Zikir yang dibaca setelah tengah malam tercatat pada malam yang semestinya (Subuh ke Subuh).
• Hitungan zikir langsung tersinkron setelah Anda mencatatnya.
• Pengingat tidak lagi berbunyi dua kali, dan nama salat tidak lagi terpotong di tengah kata.
• Jumlah pengulangan terverifikasi untuk setiap zikir, dan bacaan ayat Al-Qur'an yang lengkap dalam zikir telah dipulihkan.
• Terjemahan ditinjau di seluruh 24 bahasa.
• Penguatan keamanan dan privasi di seluruh aplikasi.

Jazakumullahu khairan telah menggunakan Munib Tracker. Masukan: https://munibtracker.app/contact
```

_3,302/4,000 chars_

---

## 5. Turkish — Türkçe (`tr-TR`)

```text
Şimdiye kadarki en büyük güncellememiz: ibadet için yeni yollar, yenilenen tasarım ve daha sakin, daha güvenilir bir uygulama.

İBADETTE YENİLER
• Rehberli zikir oturumları: bir setin tüm zikirleri, yerleşik sayaçla tek ekranda; her namaz için ayrı kaydedilir. "Bunu neden okuruz" bölümü kaynak hadisin tamamını ve derecesini gösterir.
• Namaz sonrası tesbih (33/33/34) ve eller serbest tesbih: herhangi bir zikri üç kez söyleyerek öğretin, sayaç sesinizi takip etsin; yalnızca cihazınızda.
• Takip ekranında her farzın altında revatib sünnetler, nafile oruç planlayıcısı, günlük sünnet alışkanlıkları ve adım adım Zilhicce ile Umre rehberleri.
• Yeni tesbih tasarımları: halka, tesbih taneleri, zikirmatik, çakıl taşları, parmakla sayma ve daha fazlası; tık sesleri ve titreşimle.
• Namaz odak kilidi: namaz sırasında dikkat dağıtan uygulamaları bir kenara bırakın; nazik, kararlı veya katı modda.

KUR'AN
• Dilediğiniz ayet aralığında "Dinleyiciyle oku" ve sadece okuyarak ayet bulma.
• Atlanan veya net okunmayan kelimeleri gösteren telaffuz kontrolü ve tecvid çalışma alıştırmaları.
• Renkli vurgular ve etiketlerle ayet notları, Arapça kök araması.
• Alıştırmalar artık okuma kaydınıza ve hatminize sayılıyor; tilavet istatistikleri ve başarılarla birlikte.
• Hat sanatıyla sure adları ve yenilenen sure kartları.

ÖZEL NEFİS MUHASEBESİ
• Gece muhasebesi, akraba bağları, borçlar ve emanetler kaydı, rehberli vasiyet hazırlayıcı ve nazik haftalık koç; hepsi şifreli bir kasada, isteğe bağlı özel eşitlemeyle.
• Dört mezhep için miras hesaplayıcı ve mezhebinizi rehberlerde ve hesaplayıcılarda uygulayan "Mezhebim" ayarı.

BİRLİKTE
• Aile, hesap ortağı ve grup hatmi için halkalar. Yakınınızdaki birine kısa bir kod ve onun onayıyla katılın.
• Rehberli okuma ekranıyla çocuk modu.
• Kendi caminizi seçebildiğiniz cami bulucu; caminin vakit çizelgesini bir fotoğraftan içe aktarın.

YENİ GÖRÜNÜM
• Netlik için baştan tasarlanan tüm ekranlar; Ana Sayfa ve Takip ekranından tek dokunuşla namaz işaretleme.
• Yeniden tasarlanan istatistik, başarı, dua ve zikir ekranları; vakti gelen zikir setleri en üstte.
• Mevsimsel uygulama simgeleri, aranabilir ayarlar paneli ve Hicri tarih düzeltmesi.

WIDGET'LAR, SAAT VE TV
• Widget'lar ve Canlı Etkinlikler o anki namazı takip eder; zikir ve İslami günler için yeni widget'lar.
• Saatte yalnızca vakti gelen namaz işaretlenebilir, geri alma imkânıyla; tesbih sayınız korunur.
• TV'de: ana ekran satırları ve sesli arama.

DÜZELTMELER VE İYİLEŞTİRMELER
• Gece yarısından sonra okunan zikirler ait oldukları geceye kaydedilir (sabah namazından sabah namazına).
• Zikir sayıları kaydettiğiniz anda eşitlenir.
• Hatırlatıcılar artık iki kez çalmıyor, namaz adları da artık kelime ortasında bölünmüyor.
• Her zikir için doğrulanmış tekrar sayıları; zikirlerdeki Kur'an tilavetleri eksiksiz hâline kavuştu.
• 24 dilin tamamında çeviriler gözden geçirildi.
• Uygulama genelinde güvenlik ve gizlilik güçlendirildi.

Munib Tracker'ı kullandığınız için Allah razı olsun. Geri bildirim: https://munibtracker.app/contact
```

_3,052/4,000 chars_

---

## 6. Bengali — বাংলা (`bn-BD`)

```text
এখন পর্যন্ত আমাদের সবচেয়ে বড় আপডেট — ইবাদতের নতুন উপায়, নতুন ডিজাইন, আর আরও শান্ত ও নির্ভরযোগ্য অ্যাপ।

ইবাদতে নতুন
• নির্দেশিত আজকার সেশন: একটি সেটের সব জিকির এক স্ক্রিনে, সঙ্গে বিল্ট-ইন কাউন্টার; প্রতি নামাজ অনুযায়ী লগ হয়, আর "কেন আমরা এটি পড়ি" অংশে পূর্ণ উৎস-হাদিস ও তার মান দেখা যায়।
• নামাজের পরের তাসবিহ (33/33/34) এবং হ্যান্ডস-ফ্রি তাসবিহ: যেকোনো জিকির তিনবার বলে শিখিয়ে দিন, কাউন্টার আপনার কণ্ঠ অনুসরণ করবে — শুধু আপনার ডিভাইসেই।
• ট্র্যাকারে প্রতিটি ফরজের নিচে সুন্নতে রাওয়াতিব, নফল রোজার পরিকল্পনা, দৈনিক সুন্নাহ অভ্যাস, এবং ধাপে ধাপে জিলহজ ও উমরাহর সহায়িকা।
• তাসবিহর নতুন ডিজাইন: রিং, তাসবিহর দানা, ক্লিকার, নুড়িপাথর, আঙুলে গণনা ও আরও অনেক কিছু, সঙ্গে ক্লিকের শব্দ ও কম্পন।
• নামাজ ফোকাস লক: নামাজের সময় মনোযোগ নষ্টকারী অ্যাপগুলো সরিয়ে রাখুন — কোমল, দৃঢ় বা কঠোর মোডে।

কুরআন
• যেকোনো আয়াত-পরিসরে সাথে সাথে তিলাওয়াত করুন, আর শুধু তিলাওয়াত করেই আয়াত খুঁজে নিন।
• উচ্চারণ যাচাই, যা বাদ পড়া বা অস্পষ্ট শব্দ চিহ্নিত করে, সঙ্গে তাজবিদ অনুশীলনের প্রশিক্ষণ।
• রঙিন হাইলাইট ও ট্যাগসহ আয়াত-নোট, এবং আরবি মূলধাতু দিয়ে অনুসন্ধান।
• অনুশীলন এখন আপনার পাঠের লগ ও খতমে গণ্য হয়, সঙ্গে তিলাওয়াতের পরিসংখ্যান ও অর্জন।
• ক্যালিগ্রাফিক সূরার নাম ও নতুন রূপের সূরা কার্ড।

ব্যক্তিগত আত্মজবাবদিহি
• রাতের মুহাসাবা, আত্মীয়তার বন্ধন, ঋণ ও আমানতের হিসাব, নির্দেশিত ওসিয়ত প্রস্তুতকারী এবং সাপ্তাহিক কোমল সহায়ক — সবই এনক্রিপ্টেড ভল্টে, ঐচ্ছিক ব্যক্তিগত সিঙ্কসহ।
• চার মাযহাবের জন্য উত্তরাধিকার (মিরাস) ক্যালকুলেটর, এবং "আমার মাযহাব" সেটিং, যা নির্দেশিকা ও ক্যালকুলেটরজুড়ে আপনার মাযহাব প্রয়োগ করে।

একসাথে
• পরিবার, জবাবদিহি সঙ্গী ও সম্মিলিত খতমের জন্য সার্কেল। কাছের কারও সঙ্গে একটি ছোট কোড ও তাঁর অনুমোদনে যুক্ত হোন।
• নির্দেশিত তিলাওয়াত স্ক্রিনসহ শিশু মোড।
• নিজের মসজিদ নির্ধারণের সুবিধাসহ মসজিদ খোঁজা, আর ছবি থেকে সেই মসজিদের সময়সূচি আমদানি।

নতুন রূপ
• স্পষ্টতার জন্য প্রতিটি স্ক্রিন নতুন করে ডিজাইন করা হয়েছে; হোম ও ট্র্যাকার থেকে এক ট্যাপে নামাজ চিহ্নিত করুন।
• পরিসংখ্যান, অর্জন, দোয়া ও জিকিরের স্ক্রিন নতুন ডিজাইনে; যে আজকারের সময় হয়েছে সেগুলো আগে দেখায়।
• মৌসুমি অ্যাপ আইকন, খোঁজা যায় এমন সেটিংস প্যানেল এবং হিজরি তারিখ সংশোধন।

উইজেট, ঘড়ি ও টিভি
• উইজেট ও লাইভ অ্যাক্টিভিটি চলমান নামাজ অনুসরণ করে; সঙ্গে আজকার ও ইসলামি দিবসসমূহের নতুন উইজেট।
• ঘড়িতে শুধু যে নামাজের সময় হয়েছে সেটিই চিহ্নিত করা যায়, পূর্বাবস্থায় ফেরানোর সুবিধাসহ; আর আপনার তাসবিহর গণনা সংরক্ষিত থাকে।
• টিভিতে: হোম স্ক্রিনের সারি ও ভয়েস অনুসন্ধান।

সমাধান ও পরিমার্জন
• মধ্যরাতের পরে পড়া আজকার সঠিক রাতের অধীনেই লগ হয় (ফজর থেকে ফজর)।
• জিকিরের গণনা রেকর্ড করার সঙ্গে সঙ্গেই সিঙ্ক হয়।
• রিমাইন্ডার আর দুবার বাজে না, এবং নামাজের নাম আর শব্দের মাঝখানে ভেঙে যায় না।
• প্রতিটি জিকিরের যাচাইকৃত পুনরাবৃত্তি-সংখ্যা, এবং আজকারে কুরআনের পূর্ণ তিলাওয়াত পুনরুদ্ধার।
• সব 24টি ভাষায় অনুবাদ পর্যালোচনা।
• সর্বত্র নিরাপত্তা ও গোপনীয়তা জোরদার।

Munib Tracker ব্যবহার করার জন্য জাযাকুমুল্লাহু খাইরান। মতামত: https://munibtracker.app/contact
```

_2,836/4,000 chars_

---

## 7. Malay — Bahasa Melayu (`ms-MY`)

```text
Kemas kini terbesar kami setakat ini — cara baharu beribadah, reka bentuk baharu, dan aplikasi yang lebih tenang serta lebih boleh diharap.

IBADAH BAHARU
• Sesi zikir berpandu: setiap zikir dalam satu set dipaparkan pada satu skrin dengan pembilang terbina dalam, direkodkan mengikut solat, dengan "Mengapa kita membaca ini" yang memaparkan hadis sumber penuh beserta darjahnya.
• Tasbih selepas solat (33/33/34) dan tasbih tanpa sentuh: ajarkan apa-apa zikir dengan menyebutnya tiga kali dan pembilang akan mengikut suara anda, hanya pada peranti anda.
• Sunat rawatib di bawah setiap solat fardu dalam penjejak, perancang puasa sunat, amalan sunnah harian, serta panduan langkah demi langkah untuk Zulhijjah dan umrah.
• Reka bentuk tasbih baharu: gelang, manik tasbih, pembilang digital, batu kerikil, kiraan jari dan banyak lagi, dengan bunyi klik dan getaran.
• Kunci fokus solat: ketepikan aplikasi yang mengganggu semasa solat, dalam mod lembut, tegas atau ketat.

AL-QURAN
• Baca bersama bagi mana-mana julat ayat, dan cari ayat hanya dengan membacanya.
• Semakan sebutan yang menunjukkan perkataan yang tertinggal atau kurang jelas, serta latihan bimbingan tajwid.
• Nota ayat dengan serlahan warna dan tag, serta carian akar kata Arab.
• Latihan kini dikira dalam log bacaan dan khatam anda, bersama statistik bacaan dan pencapaian.
• Nama surah berkaligrafi dan kad surah yang diperbaharui.

MUHASABAH DIRI SECARA PERIBADI
• Muhasabah malam, silaturahim, rekod hutang dan amanah, panduan menyediakan wasiat dan pembimbing mingguan yang lembut — disimpan dalam peti besi tersulit dengan penyegerakan peribadi pilihan.
• Kalkulator faraid (pusaka) untuk keempat-empat mazhab, dan tetapan "Mazhab saya" yang menerapkan mazhab anda dalam semua panduan dan kalkulator.

BERSAMA
• Kumpulan untuk keluarga, rakan akauntabiliti dan khatam berkumpulan. Sertai seseorang yang berdekatan dengan kod pendek dan kelulusannya.
• Mod kanak-kanak dengan skrin bacaan berpandu.
• Pencari masjid dengan masjid utama, dan import jadual waktunya daripada foto.

WAJAH BAHARU
• Setiap skrin direka semula supaya lebih jelas, dengan tanda solat sekali ketik dari Utama dan penjejak.
• Skrin statistik, pencapaian, doa dan zikir direka semula; set zikir yang tiba masanya dipaparkan dahulu.
• Ikon aplikasi bermusim, panel tetapan yang boleh dicari dan pelarasan tarikh Hijrah.

WIDGET, JAM TANGAN & TV
• Widget dan Aktiviti Langsung mengikut solat semasa, dengan widget baharu untuk zikir dan hari kebesaran Islam.
• Pada jam tangan, hanya solat yang tiba masanya boleh ditanda, dengan pilihan buat asal, dan kiraan tasbih anda dikekalkan.
• Pada TV: baris skrin utama dan carian suara.

PEMBETULAN & PENAMBAHBAIKAN
• Zikir yang dibaca selepas tengah malam direkodkan di bawah malam yang sepatutnya (Subuh ke Subuh).
• Kiraan zikir disegerakkan sejurus selepas anda merekodkannya.
• Peringatan tidak lagi berbunyi dua kali, dan nama solat tidak lagi terputus di tengah perkataan.
• Bilangan ulangan yang disahkan untuk setiap zikir, dan bacaan ayat al-Quran yang lengkap dipulihkan dalam zikir.
• Terjemahan disemak dalam kesemua 24 bahasa.
• Pengukuhan keselamatan dan privasi di seluruh aplikasi.

Jazakumullahu khairan kerana menggunakan Munib Tracker. Maklum balas: https://munibtracker.app/contact
```

_3,292/4,000 chars_

---

## 8. Persian — فارسی (`fa-IR`)

_Right-to-left — paste as is._

```text
بزرگ‌ترین به‌روزرسانی ما تا امروز — راه‌های تازه برای عبادت، طراحی نو و برنامه‌ای آرام‌تر و قابل‌اعتمادتر.

تازه‌های عبادت
• جلسه‌های راهنمای اذکار: همهٔ اذکار یک مجموعه در یک صفحه با شمارندهٔ داخلی، ثبت‌شده برای هر نماز، همراه با «چرا این ذکر را می‌خوانیم» که حدیث منبع را به‌طور کامل و با درجهٔ آن نشان می‌دهد.
• تسبیح پس از نماز (33/33/34) و تسبیح صوتی: هر ذکری را با سه بار گفتن به برنامه بیاموزید تا شمارنده صدای شما را دنبال کند؛ فقط روی دستگاه خودتان.
• سنت‌های راتبه زیر هر فرض در ردیاب، برنامه‌ریز روزه‌های مستحبی، عادت‌های روزانهٔ سنت، و همراه گام‌به‌گام برای ذی‌الحجه و عمره.
• طرح‌های تازهٔ تسبیح: حلقه، دانه‌های مسبحه، شمارندهٔ دستی، سنگریزه، شمارش با انگشتان و موارد دیگر، با صدای کلیک و لرزش.
• قفل تمرکز نماز: برنامه‌های حواس‌پرت‌کن را هنگام نماز کنار بگذارید، در حالت ملایم، محکم یا سخت‌گیرانه.

قرآن
• همراه‌خوانی در هر بازه‌ای از آیات، و یافتن آیه تنها با تلاوت آن.
• بررسی تلفظ که واژه‌های جاافتاده یا نامفهوم را نشان می‌دهد، به‌همراه تمرین‌های آموزشی تجوید.
• یادداشت‌های آیه با برجسته‌سازی رنگی و برچسب، و جست‌وجو بر اساس ریشه‌های عربی.
• تمرین اکنون در گزارش تلاوت و ختم شما حساب می‌شود، همراه با آمار تلاوت و دستاوردها.
• نام سوره‌ها به خط خوشنویسی و کارت‌های سورهٔ نوشده.

خودحسابرسی خصوصی
• محاسبهٔ شبانه، صلهٔ رحم، دفتر بدهی‌ها و امانت‌ها، سازندهٔ راهنمای وصیت‌نامه و مربی هفتگی مهربان، همه در گاوصندوقی رمزگذاری‌شده با همگام‌سازی خصوصی اختیاری.
• ماشین‌حساب ارث (میراث) برای هر چهار مذهب، و تنظیم «مذهب من» که مذهب شما را در راهنماها و ماشین‌حساب‌ها اعمال می‌کند.

با هم
• حلقه‌ها برای خانواده، همراه پاسخ‌گویی و ختم گروهی. با یک کد کوتاه و با تأیید شخصِ نزدیکتان به او بپیوندید.
• حالت کودک با صفحهٔ تلاوت راهنما.
• مسجدیاب با امکان انتخاب مسجد محل، و وارد کردن جدول اوقات آن از روی عکس.

ظاهری تازه
• همهٔ صفحه‌ها برای وضوح بیشتر بازطراحی شده‌اند، با ثبت نماز با یک لمس از خانه و ردیاب.
• بازطراحی صفحه‌های آمار، دستاوردها، دعاها و ذکر؛ مجموعه‌های اذکاری که وقتشان رسیده، نخست نمایش داده می‌شوند.
• آیکون‌های مناسبتی برنامه، پنل تنظیمات قابل جست‌وجو و تنظیم تاریخ هجری.

ابزارک‌ها، ساعت و تلویزیون
• ابزارک‌ها و فعالیت‌های زنده نماز جاری را دنبال می‌کنند، با ابزارک‌های تازه برای اذکار و مناسبت‌های اسلامی.
• در ساعت، فقط نمازی که وقتش رسیده قابل ثبت است، با امکان واگرد، و شمار تسبیح شما حفظ می‌شود.
• در تلویزیون: ردیف‌های صفحهٔ اصلی و جست‌وجوی صوتی.

رفع اشکال و بهبودها
• اذکاری که پس از نیمه‌شب خوانده می‌شوند، برای همان شبی ثبت می‌شوند که به آن تعلق دارند (از فجر تا فجر).
• شمار ذکرها بلافاصله پس از ثبت همگام‌سازی می‌شود.
• یادآوری‌ها دیگر دو بار نمی‌آیند و نام نمازها دیگر در میانهٔ واژه شکسته نمی‌شود.
• تعداد تکرار تأییدشده برای هر ذکر، و بازگرداندن تلاوت‌های کامل قرآنی در اذکار.
• بازبینی ترجمه‌ها در هر 24 زبان.
• تقویت امنیت و حریم خصوصی در سراسر برنامه.

از اینکه از Munib Tracker استفاده می‌کنید، جزاکم‌الله خیراً. بازخورد: https://munibtracker.app/contact
```

_2,803/4,000 chars_

---

## 9. French — Français (`fr-FR`)

```text
Notre plus grande mise à jour à ce jour : de nouvelles façons d'adorer, un design repensé et une app plus discrète et plus fiable.

NOUVEAUTÉS POUR L'ADORATION
• Séances guidées d'adhkar : tous les zikr d'une série sur un seul écran, avec le compteur intégré, enregistrés pour chaque Salah, et « Pourquoi le réciter » qui affiche le hadith source complet et son degré.
• Tasbeeh après la Salah (33/33/34) et tasbeeh mains libres : apprenez n'importe quel zikr en le prononçant trois fois, et le compteur suit votre voix, uniquement sur votre appareil.
• Les Sunnah rawatib sous chaque fard dans le suivi, un planificateur de jeûne surérogatoire, des habitudes de la Sunnah au quotidien et des accompagnements pas à pas pour Dhul-Hijjah et l'Omra.
• Nouveaux designs de tasbeeh : anneau, perles de misbaha, compteur, cailloux, comptage sur les doigts et plus encore, avec sons de clic et vibrations.
• Verrou de concentration Salah : mettez de côté les apps qui vous distraient pendant la Salah, en mode doux, ferme ou strict.

CORAN
• Récitez avec suivi sur n'importe quelle plage de versets, et trouvez un verset simplement en le récitant.
• Une vérification de la prononciation qui signale les mots omis ou peu clairs, ainsi que des exercices d'accompagnement en tajweed.
• Notes sur les versets avec surlignage en couleur et étiquettes, et recherche par racine arabe.
• La pratique compte désormais dans votre journal de lecture et votre khatm, avec statistiques de récitation et réalisations.
• Noms des sourates en calligraphie et cartes de sourates rafraîchies.

REDDITION DE COMPTES PERSONNELLE ET PRIVÉE
• Muhasabah du soir, liens familiaux, registre des dettes et dépôts, rédaction guidée de la wasiyyah et un coach hebdomadaire bienveillant, conservés dans un coffre chiffré avec synchronisation privée facultative.
• Un calculateur d'héritage (mirath) pour les quatre écoles, et un réglage « Mon madhhab » qui applique votre école dans les guides et les calculateurs.

ENSEMBLE
• Des cercles pour la famille, un partenaire de suivi et le khatm collectif. Rejoignez une personne à proximité avec un code court et son accord.
• Mode enfants avec un écran de récitation guidée.
• Recherche de masjids avec votre masjid de référence, et import de son calendrier depuis une photo.

UN NOUVEAU LOOK
• Chaque écran a été repensé pour plus de clarté, avec le marquage de la Salah en un geste depuis l'Accueil et le suivi.
• Statistiques, réalisations, duas et écrans de zikr redessinés ; les séries d'adhkar à réciter maintenant apparaissent en premier.
• Icônes d'app saisonnières, un panneau de réglages avec recherche et l'ajustement de la date hégirienne.

WIDGETS, MONTRE ET TV
• Les widgets et les Activités en direct suivent la Salah en cours, avec de nouveaux widgets d'adhkar et d'événements islamiques.
• Sur la montre, seule la Salah due peut être marquée, avec possibilité d'annuler, et votre compte de tasbeeh est conservé.
• Sur la TV : rangées sur l'écran d'accueil et recherche vocale.

CORRECTIONS ET FINITIONS
• Les adhkar récités après minuit sont enregistrés sous la nuit à laquelle ils appartiennent (de Fajr à Fajr).
• Les comptes de zikr se synchronisent dès que vous les enregistrez.
• Les rappels ne se déclenchent plus en double, et les noms des prières ne sont plus coupés au milieu d'un mot.
• Nombres de répétitions vérifiés pour chaque zikr, et récitations coraniques complètes rétablies dans les adhkar.
• Traductions révisées dans les 24 langues.
• Sécurité et confidentialité renforcées partout.

Merci d'utiliser Munib Tracker, qu'Allah vous récompense par le bien. Vos retours : https://munibtracker.app/contact
```

_3,649/4,000 chars_

---

## 10. Hausa (`ha-NG`)

```text
Babban sabuntawarmu zuwa yanzu — sababbin hanyoyin ibada, sabon zane, da manhaja mafi natsuwa kuma abin dogaro.

SABBI A IBADA
• Zaman azkar mai jagora: kowane zikiri na saiti a allo ɗaya tare da ma'auni a ciki, ana rubutawa bisa kowace Sallah, tare da "Me ya sa muke karanta wannan" da ke nuna cikakken hadisin tushe da darajarsa.
• Tasbihi bayan Sallah (33/33/34) da tasbihi ba tare da hannu ba: koyar da kowane zikiri ta hanyar faɗarsa sau uku, ma'aunin zai bi muryarka — a na'urarka kaɗai.
• Sunnonin rawatib ƙarƙashin kowace farilla a bibiya, mai tsara azumin nafila, ɗabi'un Sunnah na yau da kullum, da jagorori mataki-mataki na Zul-Hijja da Umra.
• Sababbin zanen tasbihi: zobe, ƙwayar carbi, mai dannawa, tsakuwa, ƙirga da yatsu da sauransu, tare da sautin danna da girgiza.
• Kulle mayar da hankali na Sallah: ajiye manhajoji masu ɗauke hankali a lokacin Sallah, a yanayin mai laushi, mai ƙarfi ko mai tsauri.

ALƘUR'ANI
• Karanta tare a kowane jerin ayoyi, kuma ka nemo aya ta hanyar karanta ta kawai.
• Duba furuci da ke nuna kalmomin da aka tsallake ko waɗanda ba su fita sarai ba, da atisayen koyar da tajwidi.
• Bayanai kan ayoyi tare da haskaka launi da alamomi, da binciken tushen kalmomin Larabci.
• Atisaye yanzu yana shiga cikin rajistar karatunka da saukarka, tare da ƙididdigar tilawa da nasarori.
• Sunayen surori a rubutun ado da sabbin katunan surori.

BINCIKEN KAI NA SIRRI
• Muhasabar dare, zumunta, rajistar basussuka da amana, jagorar rubuta wasiyya, da mai shiryarwa mai tausayi na mako-mako — a cikin ma'aji mai ɓoyewa, tare da daidaitawa ta sirri idan ka so.
• Na'urar lissafin gado (mirasi) ga mazhabobi huɗu, da saitin "Mazhabata" da ke amfani da mazhabarka a cikin jagorori da na'urorin lissafi.

TARE
• Da'irori don iyali, abokin ƙarfafawa da saukar rukuni. Shiga tare da wani da ke kusa ta gajeriyar lamba da amincewarsa.
• Yanayin yara tare da allon karatu mai jagora.
• Neman masallaci tare da masallacin gida, da shigo da jadawalinsa daga hoto.

SABON KAMANNI
• An sake zana kowane allo don ƙarin haske, tare da yi wa Sallah alama da taɓawa ɗaya daga Gida da bibiya.
• An sake zana allunan ƙididdiga, nasarori, addu'o'i da zikiri; saitin azkar da lokacinsu ya yi suna zuwa farko.
• Alamomin manhaja na lokaci-lokaci, allon saituna mai bincike, da gyaran kwanan watan Hijira.

WIJET, AGOGO DA TALABIJIN
• Wijet da Live Activity suna bin Sallar da ake ciki, tare da sababbin wijet na azkar da ranakun Musulunci.
• A agogo, Sallar da lokacinta ya yi kaɗai ake iya yi wa alama, tare da zaɓin Mayar, kuma ana adana ƙirgar tasbihinka.
• A talabijin: layuka a allon gida da binciken murya.

GYARE-GYARE DA INGANTAWA
• Azkar da aka karanta bayan tsakar dare ana rubuta su a ƙarƙashin daren da suka dace (daga Asuba zuwa Asuba).
• Ƙirgar zikiri tana daidaitawa nan take bayan ka rubuta ta.
• Tunatarwa ba ta sake yin ƙara sau biyu, kuma sunayen salloli ba sa sake karyewa a tsakiyar kalma.
• Tabbatattun adadin maimaitawa ga kowane zikiri, kuma an dawo da cikakkun karatun Alƙur'ani a cikin azkar.
• An duba fassarori a dukkan harsuna 24.
• Ƙarfafa tsaro da sirri a ko'ina.

Allah Ya saka muku da alheri bisa amfani da Munib Tracker. Ra'ayoyi: https://munibtracker.app/contact
```

_3,206/4,000 chars_

---

## 11. Swahili — Kiswahili (`sw-TZ`)

```text
Sasisho letu kubwa zaidi hadi sasa — njia mpya za ibada, muundo mpya, na programu tulivu zaidi na ya kutegemewa zaidi.

MAPYA KATIKA IBADA
• Vikao vya adhkari vinavyoongozwa: kila dhikri ya seti kwenye skrini moja pamoja na kihesabu kilichojengewa ndani, hurekodiwa kwa kila Swala, na "Kwa nini tunasoma hili" huonyesha hadithi chanzo kamili na daraja lake.
• Tasbihi baada ya Swala (33/33/34) na Tasbihi bila kugusa: fundisha dhikri yoyote kwa kuitamka mara tatu na kihesabu kitafuata sauti yako, kwenye kifaa chako pekee.
• Sunna za rawatib chini ya kila faradhi katika kifuatiliaji, mpangaji wa funga za hiari, mazoea ya Sunna ya kila siku, na miongozo ya hatua kwa hatua ya Dhul-Hijja na Umra.
• Miundo mipya ya Tasbihi: pete, shanga za tasbihi, kibofyo, vijiwe, kuhesabu kwa vidole na mengineyo, pamoja na sauti za kubofya na mtetemo.
• Kufuli ya umakini wa Swala: weka kando programu zinazovuruga wakati wa Swala, kwa hali ya upole, imara au kali.

QUR'ANI
• Soma pamoja kwenye safu yoyote ya aya, na pata aya kwa kuisoma tu.
• Ukaguzi wa matamshi unaoonyesha maneno yaliyorukwa au yasiyo wazi, pamoja na mazoezi ya kufundisha tajweed.
• Madokezo ya aya yenye rangi za kuangazia na lebo, na utafutaji kwa mizizi ya maneno ya Kiarabu.
• Mazoezi sasa yanahesabiwa katika kumbukumbu yako ya usomaji na khitma, pamoja na takwimu za visomo na mafanikio.
• Majina ya sura kwa hati za kaligrafia na kadi za sura zilizoboreshwa.

KUJIHASIBU KWA FARAGHA
• Muhasaba ya usiku, kuunga udugu, kumbukumbu ya madeni na amana, mwongozo wa kuandaa wasia, na mwongozo mpole wa kila wiki — vyote katika sefu iliyosimbwa, pamoja na usawazishaji wa faragha ukipenda.
• Kikokotoo cha mirathi kwa madhehebu yote manne, na mpangilio wa "Madhehebu yangu" unaotumia madhehebu yako katika miongozo na vikokotoo vyote.

PAMOJA
• Duara za familia, mshirika wa kuhimizana na khitma ya kikundi. Jiunge na mtu aliye karibu kwa msimbo mfupi na idhini yake.
• Hali ya watoto yenye skrini ya kusoma inayoongozwa.
• Kitafutaji cha misikiti chenye msikiti wako wa nyumbani, na uingize ratiba yake kutoka kwenye picha.

MWONEKANO MPYA
• Kila skrini imesanifiwa upya kwa uwazi, pamoja na kuweka alama ya Swala kwa mguso mmoja kutoka Nyumbani na kifuatiliaji.
• Skrini mpya za takwimu, mafanikio, dua na dhikri; seti za adhkari zilizofika wakati wake hutangulia.
• Aikoni za msimu za programu, paneli ya mipangilio inayotafutika na marekebisho ya tarehe ya Hijria.

WIJETI, SAA NA TV
• Wijeti na Live Activity hufuata Swala ya sasa, pamoja na wijeti mpya za adhkari na siku za Kiislamu.
• Kwenye saa, ni Swala iliyofika wakati wake pekee inayoweza kuwekewa alama, pamoja na Tendua, na hesabu yako ya Tasbihi huhifadhiwa.
• Kwenye TV: safu za skrini ya mwanzo na utafutaji kwa sauti.

MAREKEBISHO NA MABORESHO
• Adhkari zinazosomwa baada ya saa sita usiku hurekodiwa katika usiku husika (kutoka Alfajiri hadi Alfajiri).
• Hesabu za dhikri husawazishwa mara tu unapozirekodi.
• Vikumbusho havilii tena mara mbili, na majina ya Swala hayakatiki tena katikati ya neno.
• Idadi za marudio zilizothibitishwa kwa kila dhikri, na visomo kamili vya Qur'ani vimerejeshwa katika adhkari.
• Tafsiri zimepitiwa katika lugha zote 24.
• Usalama na faragha vimeimarishwa kila mahali.

Allah awalipe kheri kwa kutumia Munib Tracker. Maoni: https://munibtracker.app/contact
```

_3,321/4,000 chars_

---

## 12. Russian — Русский (`ru-RU`)

```text
Наше самое большое обновление — новые возможности для поклонения, свежий дизайн и более спокойное и надёжное приложение.

НОВОЕ В ПОКЛОНЕНИИ
• Сеансы азкаров: все зикры набора на одном экране со встроенным счётчиком и отметкой по каждому намазу, а в разделе «Зачем мы читаем этот зикр» — полный хадис-источник и его степень достоверности.
• Тасбих после намаза (33/33/34) и тасбих без рук: научите приложение любому зикру, произнеся его трижды, — счётчик будет следовать за вашим голосом, и всё это только на вашем устройстве.
• Сунна-раватиб под каждым фардом в трекере, планировщик добровольного поста, ежедневные привычки сунны и пошаговые помощники на Зуль-хиджу и умру.
• Новые дизайны тасбиха: кольцо, бусины мисбахи, кликер, камешки, счёт на пальцах и другие — со звуком щелчка и вибрацией.
• Фокус на намазе: отложите отвлекающие приложения на время намаза в мягком, твёрдом или строгом режиме.

КОРАН
• Чтение с сопровождением на любом отрезке аятов и поиск аята просто по его чтению.
• Проверка произношения отмечает пропущенные или нечёткие слова; добавлены упражнения по таджвиду.
• Заметки к аятам с цветными выделениями и метками, поиск по арабским корням.
• Практика теперь засчитывается в журнал чтения и хатм, со статистикой чтения и достижениями.
• Каллиграфические названия сур и обновлённые карточки сур.

ЛИЧНЫЙ САМООТЧЁТ
• Вечерняя мухасаба, родственные связи, учёт долгов и аманатов, пошаговое составление васыйи и мягкий еженедельный наставник — всё в зашифрованном хранилище с необязательной личной синхронизацией.
• Калькулятор наследства (мирас) для всех четырёх мазхабов и настройка «Мой мазхаб», которая применяет ваш мазхаб во всех руководствах и калькуляторах.

ВМЕСТЕ
• Круги для семьи, партнёра по взаимному контролю и совместного хатма. Присоединяйтесь к тому, кто рядом, по короткому коду с его согласия.
• Детский режим с экраном чтения под руководством.
• Поиск мечетей с выбором своей мечети и импортом её расписания по фото.

НОВЫЙ ОБЛИК
• Каждый экран переработан для ясности; отмечайте намаз одним касанием на Главной и в трекере.
• Обновлены экраны статистики, достижений, дуа и зикров; наборы азкаров, время которых наступило, теперь идут первыми.
• Сезонные значки приложения, поиск по настройкам и корректировка даты по хиджре.

ВИДЖЕТЫ, ЧАСЫ И ТВ
• Виджеты и Live Activity следуют за текущим намазом; новые виджеты азкаров и исламских дат.
• На часах можно отметить только тот намаз, время которого наступило, с возможностью отмены; счёт тасбиха сохраняется.
• На ТВ: подборки на главном экране и голосовой поиск.

ИСПРАВЛЕНИЯ И УЛУЧШЕНИЯ
• Азкары, прочитанные после полуночи, записываются в ту ночь, к которой они относятся (от Фаджра до Фаджра).
• Счёт зикров синхронизируется сразу после записи.
• Напоминания больше не приходят дважды, а названия намазов не разрываются посреди слова.
• Проверенное число повторений для каждого зикра и восстановленные полные чтения аятов Корана в азкарах.
• Переводы проверены на всех 24 языках.
• Безопасность и конфиденциальность усилены во всём приложении.

Джазакумуллаху хайран за то, что пользуетесь Munib Tracker. Отзывы: https://munibtracker.app/contact
```

_3,145/4,000 chars_

---

## 13. Azerbaijani — Azərbaycanca (`az-AZ`)

```text
İndiyədək ən böyük yeniləməmiz — ibadət üçün yeni imkanlar, təzə dizayn və daha sakit, daha etibarlı tətbiq.

İBADƏTDƏ YENİLİKLƏR
• Bələdçili zikr seansları: dəstin bütün zikrləri daxili sayğacla bir ekranda, hər namaz üzrə qeyd olunur; "Bunu niyə oxuyuruq" bölməsi mənbə hədisin tam mətnini və dərəcəsini göstərir.
• Namazdan sonra təsbeh (33/33/34) və əllərsiz təsbeh: istənilən zikri üç dəfə deyərək öyrədin, sayğac səsinizi izləsin — yalnız öz cihazınızda.
• İzləyicidə hər fərzin altında rəvatib sünnələr, nafilə oruc planlayıcısı, gündəlik sünnə vərdişləri, Zilhiccə və Ümrə üçün addım-addım bələdçilər.
• Yeni təsbeh dizaynları: halqa, misbaha dənələri, sayğac, çınqıllar, barmaqla saymaq və digərləri — klik səsi və titrəmə ilə.
• Namaz fokus kilidi: namaz zamanı diqqəti yayındıran tətbiqləri kənara qoyun — yumşaq, möhkəm və ya sərt rejimdə.

QURAN
• İstənilən ayə aralığında dinləyici ilə oxuyun və ayəni sadəcə oxuyaraq tapın.
• Buraxılmış və ya aydın olmayan sözləri göstərən tələffüz yoxlaması, həmçinin təcvid məşqləri.
• Rəngli vurğulama və etiketlərlə ayə qeydləri, ərəb kökü üzrə axtarış.
• Məşq artıq oxu qeydinizə və xətminizə sayılır; tilavət statistikası və nailiyyətlər əlavə olundu.
• Xəttatlıqla yazılmış surə adları və yenilənmiş surə kartları.

ŞƏXSİ MÜHASİBƏ
• Gecə mühasibəsi, qohumluq əlaqələri, borclar və əmanətlər qeydi, bələdçili vəsiyyət tərtibçisi və həlim həftəlik məşqçi — hamısı şifrəli seyfdə, istəyə bağlı məxfi sinxronizasiya ilə.
• Dörd məzhəbin hamısı üçün miras (irs) kalkulyatoru və məzhəbinizi bələdçilərə və kalkulyatorlara tətbiq edən "Məzhəbim" ayarı.

BİRLİKDƏ
• Ailə üçün halqalar, hesabatlılıq tərəfdaşı və qrup xətmi. Yaxınlığınızdakı birinə qısa kod və onun razılığı ilə qoşulun.
• Bələdçili oxu ekranı ilə uşaq rejimi.
• Məhəllə məscidi seçimi ilə məscid axtarışı; məscidin vaxt cədvəlini fotodan idxal edin.

TƏZƏ GÖRÜNÜŞ
• Hər ekran aydınlıq üçün yenidən hazırlandı; Əsas ekrandan və izləyicidən namazı bir toxunuşla qeyd edin.
• Yenilənmiş statistika, nailiyyətlər, dualar və zikr ekranları; vaxtı çatmış zikr dəstləri ilk sırada göstərilir.
• Mövsümi tətbiq ikonları, axtarışlı parametrlər paneli və hicri tarix düzəlişi.

VİDJETLƏR, SAAT VƏ TV
• Vidjetlər və Live Activities cari namazı izləyir; yeni zikr və İslami günlər vidjetləri əlavə olundu.
• Saatda yalnız vaxtı çatmış namaz qeyd edilə bilər, geri qaytarma imkanı ilə; təsbeh sayınız isə qorunur.
• TV-də: əsas ekranda sıralar və səsli axtarış.

DÜZƏLİŞLƏR VƏ TƏKMİLLƏŞDİRMƏLƏR
• Gecə yarısından sonra oxunan zikrlər aid olduğu gecənin altında qeyd edilir (sübhdən sübhə qədər).
• Zikr sayları qeyd etdiyiniz anda sinxronlaşır.
• Xatırlatmalar artıq iki dəfə gəlmir, namaz adları isə sözün ortasında bölünmür.
• Hər zikr üçün təsdiqlənmiş təkrar sayları; zikrlərdə Quran ayələrinin tam tilavəti bərpa edildi.
• Bütün 24 dildə tərcümələr nəzərdən keçirildi.
• Hər yerdə təhlükəsizlik və məxfilik gücləndirildi.

Munib Tracker-dən istifadə etdiyiniz üçün Allah sizdən razı olsun. Rəy üçün: https://munibtracker.app/contact
```

_3,039/4,000 chars_

---

## 14. Pashto — پښتو (`ps-AF`)

_Right-to-left — paste as is._

```text
تر اوسه زموږ تر ټولو لوی تازه‌والی — د عبادت نوې لارې، نوی ډیزاین، او یو ارام او ډېر باوري اپ.

په عبادت کې نوي
• لارښوونکې اذکار ناستې: د یوې ټولګې ټول اذکار په یوه پرده کې له جوړ شوي شمېرونکي سره، د هر لمانځه لپاره ثبتېږي، او «ولې دا ذکر وایو» برخه د سرچینې بشپړ حدیث او د هغه درجه ښيي.
• له لمانځه وروسته تسبیح (33/33/34) او په غږ تسبیح: هر ذکر درې ځله په ویلو سره اپ ته وروښیئ، بیا شمېرونکی ستاسو غږ تعقیبوي — یوازې ستاسو په وسیله کې.
• په تعقیب کې د هر فرض لاندې راتبه سنتونه، د نفلي روژو پلان جوړونکی، ورځني د سنتو عادتونه، او د ذوالحجې او عمرې لپاره ګام په ګام ملګری.
• د تسبیح نوي ډیزاینونه: کړۍ، د مسبحې دانې، کلیکر، شګې، په ګوتو شمېرل او نور، د کلیک غږ او لړزې سره.
• د لمانځه د تمرکز قلف: د لمانځه پر مهال ذهن اړوونکي اپونه یوې خوا ته کړئ، په نرم، ټینګ یا سخت حالت کې.

قرآن
• د آیتونو پر هره برخه «له اورېدونکي سره ولولئ»، او یوازې په تلاوت سره آیت ومومئ.
• د تلفظ کتنه چې پرېښودل شوي یا ناڅرګند ټکي په ګوته کوي، او د تجوید د روزنې تمرینونه.
• پر آیتونو یادښتونه د رنګه روښانه کولو او ټګونو سره، او د عربي ریښو له مخې لټون.
• تمرین اوس ستاسو د لوست په ثبت او ختم کې حسابېږي، د تلاوت له احصائیې او لاسته راوړنو سره.
• د سورتونو خطاطي شوي نومونه او نوي شوي د سورتونو کارتونه.

شخصي ځان‌محاسبه
• د شپې محاسبه، صله رحمي، د پورونو او امانتونو ثبت، د وصیت جوړولو لارښود، او نرم اونیز لارښود — ټول په یوه کوډ شوې خزانه کې، له اختیاري خصوصي همغږۍ سره.
• د څلورو واړو مذهبونو لپاره د میراث (وراثت) حسابونکی، او د «زما مذهب» ترتیب چې ستاسو مذهب په لارښودونو او حسابونکو کې پلي کوي.

یوځای
• د کورنۍ، د ژمنې ملګري او ډله‌ییز ختم لپاره حلقې. له نږدې کس سره په لنډ کوډ او د هغه په اجازه یوځای شئ.
• د ماشومانو حالت له لارښوونکې تلاوت پردې سره.
• د جوماتونو موندونکی، د خپل جومات ټاکلو امکان سره، او د هغه مهالویش له عکس څخه راوړئ.

نوې بڼه
• هره پرده د روښانتیا لپاره له سره ډیزاین شوې، له کور او تعقیب څخه په یوه ټک د لمانځه ثبتولو سره.
• د احصائیې، لاسته راوړنو، دعاګانو او ذکر پردې له سره ډیزاین شوې؛ هغه اذکار چې وخت یې رارسېدلی، لومړی ښودل کېږي.
• موسمي اپ آیکنونه، د لټون وړ د تنظیماتو تخته، او د هجري نېټې سمون.

وېجټونه، ساعت او ټلوېزیون
• وېجټونه او ژوندي فعالیتونه اوسنی لمونځ تعقیبوي، د اذکارو او اسلامي ورځو لپاره له نویو وېجټونو سره.
• په ساعت کې یوازې هغه لمونځ ثبتېدای شي چې وخت یې دی، د بېرته کولو امکان سره، او ستاسو د تسبیح شمېر ساتل کېږي.
• په ټلوېزیون کې: د کور پردې قطارونه او د غږ لټون.

سمونونه او ښه‌والی
• هغه اذکار چې له نیمې شپې وروسته ویل کېږي، د هماغې شپې لپاره ثبتېږي چې پورې اړه لري (له سهار تر سهاره).
• د ذکر شمېر سمدستي له ثبت وروسته همغږي کېږي.
• یادونې نور دوه ځله نه راځي، او د لمونځونو نومونه نور د کلمې په منځ کې نه ماتېږي.
• د هر ذکر لپاره تایید شوې د تکرار شمېر، او په اذکارو کې د قرآن بشپړ تلاوتونه بیا راګرځول شوي.
• په ټولو 24 ژبو کې د ژباړو بیاکتنه.
• په ټول اپ کې د امنیت او محرمیت پیاوړتیا.

د Munib Tracker د کارولو لپاره جزاکم الله خیراً. نظرونه: https://munibtracker.app/contact
```

_2,827/4,000 chars_

---

## 15. Somali — Soomaali (`so-SO`)

```text
Cusboonaysiintayadii ugu weyneyd ilaa hadda — habab cusub oo cibaadada, naqshad cusub, iyo app ka deggan oo ka kalsoonaan badan.

CUSUB XAGGA CIBAADADA
• Fadhiyada adkaarta ee la hagayo: dikri kasta oo koox ka mid ah hal shaashad ayuu ku jiraa iyadoo tiriyuhu ku dhex jiro, waxaana lagu diiwaangeliyaa Salaad kasta. "Maxaan u akhrinnaa" waxay muujisaa xadiiska asalka ah oo dhammaystiran iyo darajadiisa.
• Tasbiixda Salaadda kadib (33/33/34) iyo tasbiix gacan la'aan ah: bar dikri kasta adigoo saddex jeer ku celinaya, tiriyuhuna wuxuu raacayaa codkaaga — qalabkaaga oo keliya.
• Sunnooyinka rawaatib oo ka hooseeya faral kasta raadraaca, qorsheeyaha soonka sunnada ah, caadooyinka sunnada maalinlaha ah, iyo hagayaal tallaabo-tallaabo ah oo Dul-Xijo iyo Cumrada.
• Naqshado cusub oo tasbiix: giraan, kuusha misbaxa, tiriye, quruurux, ku tirinta farahaa iyo kuwo kale, oo leh codka gujinta iyo gariir.
• Qufulka diiradda salaadda: inta aad tukanayso dhinac dhig app-yada ku mashquuliya, hab jilicsan, adag ama aad u adag.

QUR'AANKA
• Akhri adigoo la socda dhegeystaha qayb kasta oo aayado ah, oo aayad ku hel adigoo akhrinaya oo keliya.
• Hubinta dhawaaqa oo tilmaamaysa erayada la booday ama aan caddayn, iyo tababarro tajwiid.
• Qoraallo aayadaha ah oo leh iftiimin midabeysan iyo summado, iyo raadinta xididka Carabiga.
• Ku tababarka hadda waxaa lagu xisaabiyaa diiwaanka akhriskaaga iyo khatmigaaga, oo leh tirakoobka akhriska iyo guulo.
• Magacyada suuradaha oo far qurxoon ah iyo kaararka suuradaha oo la cusboonaysiiyay.

ISXISAABIN GAAR AH
• Muxaasabada habeenka, xiriirka qaraabada, diiwaanka deymaha iyo amaanooyinka, dejiyaha wasiyadda oo la hagayo, iyo hage naxariis leh oo toddobaadle ah — dhammaantood khasnad sir ah ku jira, oo leh isku-xidh gaar ah oo ikhtiyaari ah.
• Xisaabiyaha dhaxalka (Mirath) ee afarta madhab oo dhan, iyo dejinta "Madhabkayga" oo madhabkaaga ku dabaqda hagayaasha iyo xisaabiyeyaasha.

WADAJIR
• Goobaabinno qoyska, saaxiibka dhiirrigelinta iyo khatmi koox. Ku biir qof kuu dhow adigoo isticmaalaya koodh gaaban iyo oggolaanshihiisa.
• Habka carruurta oo leh shaashad akhris la hagayo.
• Raadiyaha masaajidda oo leh masjidkaaga, iyo soo gelinta jadwalkiisa adigoo sawir ka qaadaya.

MUUQAAL CUSUB
• Shaashad kasta ayaa dib loo naqshadeeyay si ay u caddaato, iyadoo Salaadda lagu calaamadeyn karo hal taabasho Guriga iyo raadraaca.
• Shaashadaha tirakoobka, guulaha, ducooyinka iyo dikriga oo dib loo naqshadeeyay; kooxaha adkaarta ee wakhtigoodu yimid ayaa marka hore soo baxa.
• Astaamaha app-ka ee xilliyeedka, guddi dejin ah oo la raadin karo, iyo hagaajinta taariikhda Hijriga.

WIDGET-YADA, SAACADDA & TV
• Widget-yada iyo Hawlgallada tooska ah waxay raacaan Salaadda hadda, oo leh widget-yo cusub oo adkaarta iyo maalmaha Islaamka ah.
• Saacadda, waxaa la calaamadeyn karaa oo keliya Salaadda wakhtigeedu yimid, oo leh ka noqosho, tirada tasbiixdaaduna way kaydsan tahay.
• TV-ga: safaf shaashadda guriga ah iyo cod raadin.

HAGAAJIN & SIXITAANNO
• Adkaarta la akhriyo saqda dhexe kadib waxaa lagu diiwaangeliyaa habeenkii ay ka tirsan yihiin (Subax ilaa Subax).
• Tirada dikriga ayaa isla markiiba la isku xidhaa marka aad diiwaangeliso.
• Xusuusinnadu mar dambe laba jeer ma dhacaan, magacyada salaadahuna mar dambe eray dhexdiisa kalama jabaan.
• Tirooyin ku celin oo la hubiyay dikri kasta, iyo akhrisyo Qur'aan oo dhammaystiran oo dib loogu soo celiyay adkaarta.
• Tarjumaadaha ayaa dib loo eegay dhammaan 24 luqadood.
• Amniga iyo asturnaanta ayaa meel kasta lagu xoojiyay.

Jazaakumullaahu khayran inaad isticmaashaan Munib Tracker. Ra'yigaaga: https://munibtracker.app/contact
```

_3,633/4,000 chars_

---

## 16. Uzbek — Oʻzbekcha (`uz-UZ`)

```text
Eng katta yangilanishimiz — ibodat uchun yangi imkoniyatlar, yangi dizayn hamda yanada sokin va ishonchli ilova.

IBODATDAGI YANGILIKLAR
• Zikrlar seanslari: to'plamdagi barcha zikrlar bitta ekranda, ichki hisoblagich bilan, har bir namoz bo'yicha qayd etiladi; “Buni nega o'qiymiz” bo'limida manba hadisning to'liq matni va uning darajasi ko'rsatiladi.
• Namozdan keyingi tasbeh (33/33/34) va qo'lsiz tasbeh: istalgan zikrni uch marta aytib o'rgating — hisoblagich ovozingizga ergashadi, faqat qurilmangizda.
• Kuzatuvchida har bir farz ostida ravotib sunnatlar, nafl ro'za rejalashtirgichi, kundalik sunnat odatlari hamda Zulhijja va Umra uchun bosqichma-bosqich yo'riqnomalar.
• Yangi tasbeh dizaynlari: halqa, misbaha donalari, klikker, toshchalar, barmoqda sanash va boshqalar — chertish ovozi va tebranish bilan.
• Namoz fokus qulfi: namoz vaqtida chalg'ituvchi ilovalarni yumshoq, qat'iy yoki qattiq rejimda chetga qo'ying.

QUR'ON
• Istalgan oyatlar oralig'ida birga o'qish va oyatni shunchaki o'qib topish.
• Tushib qolgan yoki noaniq so'zlarni ko'rsatadigan talaffuz tekshiruvi hamda tajvid mashqlari.
• Rangli belgilashlar va teglar bilan oyat eslatmalari, arabcha o'zaklar bo'yicha qidiruv.
• Mashq endi tilovat jurnali va xatmga hisoblanadi; tilovat statistikasi va yutuqlar qo'shildi.
• Sura nomlarining xattotlik yozuvi va yangilangan sura kartochkalari.

SHAXSIY O'Z-O'ZINI HISOBGA TORTISH
• Kechki muhosaba, silai rahm, qarzlar va omonatlar daftari, bosqichma-bosqich vasiyatnoma tuzuvchi va yumshoq haftalik murabbiy — barchasi shifrlangan xazinada, ixtiyoriy shaxsiy sinxronlash bilan.
• To'rt mazhabning barchasi uchun meros (faroiz) kalkulyatori hamda mazhabingizni qo'llanmalar va kalkulyatorlarda qo'llaydigan “Mening mazhabim” sozlamasi.

BIRGALIKDA
• Oila, mas'uliyat hamrohi va guruh xatmi uchun halqalar. Yaqin atrofdagi kishiga qisqa kod orqali, uning roziligi bilan qo'shiling.
• Yo'naltirilgan tilovat ekraniga ega bolalar rejimi.
• Mahalla masjidini tanlash imkoniyati bilan masjid qidiruvi va uning vaqtlar jadvalini suratdan import qilish.

YANGI KO'RINISH
• Har bir ekran tushunarli bo'lishi uchun qayta ishlandi; namozni Bosh sahifa va kuzatuvchidan bir bosishda belgilang.
• Statistika, yutuqlar, duolar va zikrlar ekranlari yangilandi; vaqti kelgan zikrlar to'plamlari endi birinchi chiqadi.
• Mavsumiy ilova belgilari, qidiruvli sozlamalar paneli va hijriy sanani sozlash.

VIDJETLAR, SOAT VA TV
• Vidjetlar va jonli faollik (Live Activities) joriy namozga ergashadi; zikrlar va islomiy kunlar uchun yangi vidjetlar.
• Soatda faqat vaqti kelgan namozni belgilash mumkin, uni bekor qilsa ham bo'ladi; tasbeh hisobingiz saqlanadi.
• TV'da: bosh ekrandagi qatorlar va ovozli qidiruv.

TUZATISHLAR VA SAYQALLAR
• Yarim tundan keyin o'qilgan zikrlar o'zi tegishli bo'lgan tunga yoziladi (bomdoddan bomdodgacha).
• Zikrlar soni qayd etilgan zahoti sinxronlanadi.
• Eslatmalar endi ikki marta kelmaydi, namoz nomlari esa so'z o'rtasida bo'linib qolmaydi.
• Har bir zikr uchun tekshirilgan takrorlar soni va zikrlarda Qur'on oyatlarining to'liq tilovati tiklandi.
• Barcha 24 tildagi tarjimalar qayta ko'rib chiqildi.
• Xavfsizlik va maxfiylik har tomonlama kuchaytirildi.

Munib Tracker'dan foydalanayotganingiz uchun Alloh sizdan rozi bo'lsin! Fikr-mulohazalar: https://munibtracker.app/contact
```

_3,326/4,000 chars_

---

## 17. Kazakh — Қазақша (`kk-KZ`)

```text
Ең ауқымды жаңартуымыз — ғибадатқа арналған жаңа мүмкіндіктер, жаңа дизайн және тынышырақ, сенімдірек қолданба.

ҒИБАДАТТАҒЫ ЖАҢАЛЫҚТАР
• Зікір сессиялары: жиындағы барлық зікір бір экранда, ішкі санағышпен, әр намаз бойынша белгіленеді; «Мұны неге оқимыз» бөлімінде дереккөз хадистің толық мәтіні мен дәрежесі көрсетіледі.
• Намаздан кейінгі тәспі (33/33/34) және қолсыз тәспі: кез келген зікірді үш рет айтып үйретіңіз — санағыш дауысыңызға ілеседі, бәрі тек құрылғыңызда.
• Трекердегі әр фарздың астында раватиб сүннеттер, нәпіл ораза жоспарлағышы, күнделікті сүннет әдеттері және Зұлхижжа мен умраға арналған қадамдық көмекшілер.
• Тәспінің жаңа дизайндары: сақина, мисбаха моншақтары, кликер, тастар, саусақпен санау және басқалар — шерту дыбысы мен дірілмен.
• Намаз фокусы: намаз кезінде алаңдататын қолданбаларды жұмсақ, берік немесе қатаң режимде шетке қойыңыз.

ҚҰРАН
• Кез келген аяттар аралығында бірге оқу және аятты жай ғана оқып табу.
• Өткізіп алған немесе анық емес сөздерді көрсететін айтылуды тексеру, сондай-ақ тәжуид жаттығулары.
• Түрлі түсті белгілеулер мен тегтері бар аят жазбалары және араб түбірлері бойынша іздеу.
• Жаттығу енді оқу журналы мен хатымға есептеледі; қираат статистикасы мен жетістіктер қосылды.
• Сүре атауларының каллиграфиялық жазуы және жаңартылған сүре карточкалары.

ЖЕКЕ ӨЗІН-ӨЗІ ЕСЕПКЕ АЛУ
• Кешкі мұхасаба, туыстық байланыс, қарыздар мен аманаттар есебі, қадамдық өсиет құрастырғыш және апталық жұмсақ кеңесші — бәрі шифрланған қоймада, қалауыңызша жеке синхрондаумен.
• Төрт мәзһабтың бәріне арналған мұра (фараиз) калькуляторы және мәзһабыңызды нұсқаулықтар мен калькуляторларда қолданатын «Менің мәзһабым» баптауы.

БІРГЕ
• Отбасы, жауапкершілік серіктесі және топтық хатым үшін шеңберлер. Жақын жердегі адамға қысқа код арқылы, оның рұқсатымен қосылыңыз.
• Бағытталған оқу экраны бар балалар режимі.
• Өз мешітіңізді таңдауға болатын мешіт іздеу және оның кестесін фотосуреттен импорттау.

ЖАҢА КЕЛБЕТ
• Әр экран түсінікті болу үшін қайта жасалды; намазды Басты беттен және трекерден бір түртумен белгілеңіз.
• Статистика, жетістіктер, дұға және зікір экрандары жаңартылды; уақыты келген зікір жиындары енді бірінші шығады.
• Маусымдық қолданба белгішелері, іздеуі бар баптаулар панелі және һижри күнін түзету.

ВИДЖЕТТЕР, САҒАТ ЖӘНЕ ТЕЛЕДИДАР
• Виджеттер мен тікелей белсенділік (Live Activities) ағымдағы намазға ілеседі; зікір және исламдық күндер виджеттері қосылды.
• Сағатта тек уақыты келген намазды белгілеуге болады, оны болдырмауға да болады; тәспі саныңыз сақталады.
• Теледидарда: басты экрандағы жолдар және дауыстық іздеу.

ТҮЗЕТУЛЕР МЕН ЖЕТІЛДІРУЛЕР
• Түн ортасынан кейін оқылған зікірлер өзі тиесілі түнге жазылады (таң намазынан келесі таң намазына дейін).
• Зікір сандары жазылған бойда синхрондалады.
• Еске салғыштар енді екі рет келмейді, ал намаз атаулары сөз ортасынан бөлінбейді.
• Әр зікір үшін тексерілген қайталау сандары, зікірлерге Құран аяттарының толық қирааты қайтарылды.
• Барлық 24 тілдегі аудармалар қайта қаралды.
• Қауіпсіздік пен құпиялылық барлық жерде күшейтілді.

Munib Tracker қолданбасын пайдаланғаныңыз үшін Алла разы болсын! Пікір қалдыру: https://munibtracker.app/contact
```

_3,172/4,000 chars_

---

## 18. Kurdish (Sorani) — کوردی (`ku`)

_Right-to-left — paste as is._

```text
گەورەترین نوێکردنەوەمان تا ئێستا — ڕێگای نوێ بۆ پەرستن، دیزاینێکی تازە، و ئەپێکی ئارامتر و جێی متمانەتر.

نوێ لە پەرستندا
• دانیشتنی ڕێنماییکراوی ئەزکار: هەموو زیکرەکانی کۆمەڵەیەک لە یەک شاشەدا لەگەڵ ژمێرەری ناوخۆیی، بۆ هەر نوێژێک تۆمار دەکرێت، لەگەڵ «بۆچی ئەمە دەخوێنینەوە» کە فەرموودەی سەرچاوە بە تەواوی و پلەکەی پیشان دەدات.
• تەسبیحی دوای نوێژ (33/33/34) و تەسبیحی بێدەست: هەر زیکرێک بە سێ جار گوتنی فێری ئەپەکە بکە و ژمێرەرەکە دوای دەنگت دەکەوێت، تەنها لەسەر ئامێرەکەت.
• سوننەتە ڕاتیبەکان لە ژێر هەر فەرزێک لە شوێنپێهەڵگردا، پلاندانەری ڕۆژووی سوننەت، خووە سوننەتە ڕۆژانەکان، و هاوەڵی هەنگاو بە هەنگاو بۆ زولحیججە و عومرە.
• دیزاینی نوێی تەسبیح: بازنە، دەنکی مەسبەحە، کلیکەر، وردە بەرد، ژماردن بە پەنجە و زیاتر، لەگەڵ دەنگی کرتە و لەرینەوە.
• قوفڵی سەرنجی نوێژ: لە کاتی نوێژدا ئەپە سەرنجبەرەکان لابدە، بە دۆخی نەرم، پتەو یان توند.

قورئان
• «لەگەڵ گوێگر بخوێنە» لەسەر هەر بەشێک لە ئایەتەکان، و دۆزینەوەی ئایەت تەنها بە خوێندنەوەی.
• پشکنینی گۆکردن کە وشە بەجێهێڵراو یان ناڕوونەکان دەستنیشان دەکات، لەگەڵ ڕاهێنانی فێرکاریی تەجوید.
• تێبینی لەسەر ئایەتەکان لەگەڵ دیارکردنی ڕەنگاوڕەنگ و تاگ، و گەڕان بە ڕەگە عەرەبییەکان.
• ڕاهێنان ئێستا لە تۆماری خوێندنەوە و خەتمەکەتدا هەژمار دەکرێت، لەگەڵ ئاماری تیلاوەت و دەستکەوتەکان.
• ناوی سوورەتەکان بە خۆشنووسی و کارتی نوێکراوەی سوورەتەکان.

لێپرسینەوەی تایبەتی خود
• خۆلێپرسینەوەی شەوانە، سیلەی ڕەحم، تۆماری قەرز و ئەمانەتەکان، دروستکەری ڕێنماییکراوی وەسیەت و ڕاهێنەرێکی نەرمی هەفتانە، هەمووی لە سندووقێکی شفرەکراودا لەگەڵ هاوکاتکردنی تایبەتی ئارەزوومەندانە.
• ژمێرەری میرات (میراث) بۆ هەر چوار مەزهەب، و ڕێکخستنی «مەزهەبەکەم» کە مەزهەبەکەت لە ڕێنمایی و ژمێرەرەکاندا جێبەجێ دەکات.

پێکەوە
• بازنەکان بۆ خێزان، هاوڕێی لێپرسینەوە و خەتمی گرووپی. بە کۆدێکی کورت و بە ڕەزامەندیی خۆی، بەشداری کەسێکی نزیکت بکە.
• دۆخی منداڵان لەگەڵ شاشەیەکی ڕێنماییکراوی خوێندنەوە.
• مزگەوت دۆزەرەوە لەگەڵ دیاریکردنی مزگەوتی گەڕەک، و هێنانی خشتەی کاتەکانی لە وێنەیەکەوە.

ڕووخسارێکی تازە
• هەموو شاشەکان بۆ ڕوونی زیاتر نوێ دیزاین کراونەتەوە، لەگەڵ نیشانکردنی نوێژ بە یەک دەستلێدان لە سەرەکی و شوێنپێهەڵگرەوە.
• شاشەکانی ئامار، دەستکەوتەکان، دوعاکان و زیکر نوێ دیزاین کراونەتەوە؛ ئەو کۆمەڵە ئەزکارانەی کاتیان هاتووە یەکەم دەردەکەون.
• ئایکۆنی وەرزیی ئەپ، پانێڵی ڕێکخستنی گەڕانپێکراو، و ڕێکخستنی بەرواری کۆچی.

ویجێت، کاتژمێر و تەلەفزیۆن
• ویجێتەکان و چالاکییە ڕاستەوخۆکان دوای نوێژی ئێستا دەکەون، لەگەڵ ویجێتی نوێ بۆ ئەزکار و بۆنە ئیسلامییەکان.
• لەسەر کاتژمێر، تەنها ئەو نوێژەی کاتی هاتووە دەتوانرێت نیشان بکرێت، لەگەڵ گەڕاندنەوە، و ژمارەی تەسبیحەکەت دەپارێزرێت.
• لەسەر تەلەفزیۆن: ڕیزەکانی شاشەی سەرەکی و گەڕانی دەنگی.

چاکسازی و باشترکردن
• ئەو ئەزکارانەی دوای نیوەشەو دەخوێنرێن، بۆ ئەو شەوە تۆمار دەکرێن کە سەر بەوێن (لە فەجرەوە بۆ فەجر).
• ژمارەی زیکرەکان یەکسەر دوای تۆمارکردن هاوکات دەکرێن.
• بیرخستنەوەکان چیتر دوو جار نایەن، و ناوی نوێژەکان چیتر لە ناوەڕاستی وشەدا ناپچڕێن.
• ژمارەی دووبارەکردنەوەی پشتڕاستکراوە بۆ هەر زیکرێک، و گەڕاندنەوەی تیلاوەتە تەواوەکانی قورئان لە ئەزکاردا.
• پێداچوونەوەی وەرگێڕانەکان لە هەموو 24 زمانەکەدا.
• بەهێزکردنی ئاسایش و تایبەتێتی لە سەرانسەری ئەپەکەدا.

خوا پاداشتی خێرتان بداتەوە بۆ بەکارهێنانی Munib Tracker. ڕا و بۆچوون: https://munibtracker.app/contact
```

_3,120/4,000 chars_

---

## 19. Bosnian — Bosanski (`bs-BA`)

```text
Naše najveće ažuriranje do sada — novi načini ibadeta, svjež dizajn i mirnija, pouzdanija aplikacija.

NOVO U IBADETU
• Vođene sesije ezkara: svi zikrovi jedne cjeline na jednom ekranu s ugrađenim brojačem, bilježe se za svaki namaz, a „Zašto ovo učimo“ prikazuje cijeli izvorni hadis i njegov stepen.
• Tesbih nakon namaza (33/33/34) i tesbih bez ruku: naučite aplikaciju bilo koji zikr tako što ćete ga izgovoriti tri puta, a brojač prati vaš glas — samo na vašem uređaju.
• Revatib sunneti ispod svakog farza u praćenju, planer dobrovoljnog posta, svakodnevne sunnet navike te vodiči korak po korak za zul-hidždžu i umru.
• Novi dizajni tesbiha: prsten, zrna misbahe, brojač, kamenčići, brojanje na prstima i drugo, sa zvukom klika i vibracijom.
• Zaključavanje za fokus u namazu: tokom namaza sklonite aplikacije koje vam odvlače pažnju, u blagom, čvrstom ili strogom režimu.

KUR'AN
• Učite uz slušaoca bilo koji raspon ajeta i pronađite ajet samo tako što ćete ga proučiti.
• Provjera izgovora koja ukazuje na preskočene ili nejasne riječi, uz vježbe tedžvida.
• Bilješke uz ajete s isticanjem u boji i oznakama, te pretraga po arapskom korijenu.
• Vježba se sada računa u vaš dnevnik učenja i hatmu, uz statistiku učenja i dostignuća.
• Kaligrafski nazivi sura i osvježene kartice sura.

LIČNO, PRIVATNO PREISPITIVANJE
• Večernja muhasaba, rodbinske veze, evidencija dugova i emaneta, vođena izrada vasijjeta i blagi sedmični savjetnik — sve u šifrovanom sefu s opcionalnom privatnom sinhronizacijom.
• Kalkulator nasljedstva (miras) za sva četiri mezheba i postavka „Moj mezheb“ koja primjenjuje vaš mezheb u vodičima i kalkulatorima.

ZAJEDNO
• Krugovi za porodicu, partnera za podršku i grupnu hatmu. Pridružite se nekome u blizini kratkim kodom i uz njegovo odobrenje.
• Dječiji način s ekranom za vođeno učenje.
• Pretraga džamija s vašom džamijom i uvoz njene vaktije iz fotografije.

NOVI IZGLED
• Svaki ekran je redizajniran radi preglednosti, s označavanjem namaza jednim dodirom s Početne i iz praćenja.
• Redizajnirani ekrani statistike, dostignuća, dova i zikra; cjeline ezkara kojima je sada vrijeme prikazuju se prve.
• Sezonske ikone aplikacije, panel postavki s pretragom i prilagodba hidžretskog datuma.

WIDGETI, SAT I TV
• Widgeti i Aktivnosti uživo prate trenutni namaz, uz nove widgete za ezkar i islamske dane.
• Na satu se može označiti samo namaz kojem je vrijeme, uz mogućnost poništavanja, a vaš broj tesbiha se čuva.
• Na TV-u: redovi na početnom ekranu i glasovna pretraga.

ISPRAVKE I DORADE
• Ezkar proučen nakon ponoći bilježi se pod noć kojoj pripada (od sabaha do sabaha).
• Broj zikrova se sinhronizuje odmah nakon što ga zabilježite.
• Podsjetnici se više ne oglašavaju dvaput, a nazivi namaza se više ne prelamaju usred riječi.
• Provjeren broj ponavljanja za svaki zikr i vraćena potpuna učenja kur'anskih ajeta u ezkaru.
• Prijevodi pregledani na svih 24 jezika.
• Pojačana sigurnost i privatnost u cijeloj aplikaciji.

Allah vas nagradio dobrom što koristite Munib Tracker. Povratne informacije: https://munibtracker.app/contact
```

_3,074/4,000 chars_

---

## 20. Hindi — हिन्दी (`hi-IN`)

```text
अब तक का हमारा सबसे बड़ा अपडेट — इबादत के नए तरीक़े, नया डिज़ाइन और पहले से ज़्यादा शांत व भरोसेमंद ऐप।

इबादत में नया
• निर्देशित अज़कार सत्र: एक सेट का हर ज़िक्र एक ही स्क्रीन पर, साथ में बिल्ट-इन काउंटर; हर नमाज़ के हिसाब से दर्ज, और "हम यह क्यों पढ़ते हैं" में पूरी स्रोत हदीस और उसका दर्जा।
• नमाज़ के बाद की तस्बीह (33/33/34) और हैंड्स-फ़्री तस्बीह: कोई भी ज़िक्र तीन बार पढ़कर सिखाएँ और काउंटर आपकी आवाज़ के साथ चलेगा — सिर्फ़ आपके डिवाइस पर।
• ट्रैकर में हर फ़र्ज़ के नीचे सुन्नत-ए-रवातिब, नफ़्ल रोज़ों की योजना, रोज़ाना की सुन्नत आदतें, और ज़िलहिज्जा व उमरा के लिए क़दम-ब-क़दम साथी।
• तस्बीह के नए डिज़ाइन: वलय, तस्बीह के दाने, क्लिकर, कंकड़, उँगलियों पर गिनती और भी बहुत कुछ, क्लिक की आवाज़ और कंपन के साथ।
• नमाज़ फ़ोकस लॉक: नमाज़ के दौरान ध्यान भटकाने वाले ऐप्स को किनारे रखें — नरम, दृढ़ या सख़्त मोड में।

क़ुरआन
• किसी भी आयत-श्रृंखला पर साथ-साथ तिलावत करें, और सिर्फ़ तिलावत करके आयत खोजें।
• उच्चारण जाँच, जो छूटे या अस्पष्ट शब्द बताती है, साथ में तजवीद सिखाने वाले अभ्यास।
• रंगीन हाइलाइट और टैग के साथ आयत नोट्स, और अरबी मूल-शब्द से खोज।
• अभ्यास अब आपके पढ़ने के रिकॉर्ड और ख़त्म में गिना जाता है, तिलावत के आँकड़ों और उपलब्धियों के साथ।
• सुलेख में सूरह के नाम और नए रूप में सूरह कार्ड।

निजी आत्म-जवाबदेही
• रात का मुहासबा, रिश्तेदारी, क़र्ज़ और अमानतों का रिकॉर्ड, निर्देशित वसीयत निर्माता और साप्ताहिक नरम मार्गदर्शक — सब एन्क्रिप्टेड वॉल्ट में, वैकल्पिक निजी सिंक के साथ।
• चारों मसलकों के लिए विरासत (मीरास) कैलकुलेटर, और "मेरा मसलक" सेटिंग जो गाइड और कैलकुलेटर में आपका मसलक लागू करती है।

साथ मिलकर
• परिवार, जवाबदेही साथी और सामूहिक ख़त्म के लिए सर्कल। पास मौजूद किसी व्यक्ति से छोटे कोड और उनकी मंज़ूरी के साथ जुड़ें।
• निर्देशित तिलावत स्क्रीन के साथ बच्चों का मोड।
• मुख्य मस्जिद के साथ मस्जिद खोजें, और फ़ोटो से उसकी समय-सारणी आयात करें।

नया रूप
• हर स्क्रीन को स्पष्टता के लिए नए सिरे से डिज़ाइन किया गया; होम और ट्रैकर से एक टैप में नमाज़ दर्ज करें।
• आँकड़े, उपलब्धियाँ, दुआएँ और ज़िक्र की स्क्रीनें नए डिज़ाइन में; जिन अज़कार का वक़्त हो चुका है, वे सबसे पहले।
• मौसमी ऐप आइकन, खोजने योग्य सेटिंग्स पैनल और हिजरी तारीख़ में सुधार।

विजेट, घड़ी और टीवी
• विजेट और लाइव एक्टिविटी मौजूदा नमाज़ के साथ चलते हैं; अज़कार और इस्लामी दिनों के नए विजेट भी।
• घड़ी पर सिर्फ़ वही नमाज़ दर्ज की जा सकती है जिसका वक़्त है, "वापस लें" विकल्प के साथ; और आपकी तस्बीह की गिनती सुरक्षित रहती है।
• टीवी पर: होम स्क्रीन की पंक्तियाँ और आवाज़ से खोज।

सुधार और निखार
• आधी रात के बाद पढ़े गए अज़कार उसी रात में दर्ज होते हैं जिससे वे जुड़े हैं (फ़ज्र से फ़ज्र तक)।
• ज़िक्र की गिनती दर्ज करते ही सिंक हो जाती है।
• रिमाइंडर अब दो बार नहीं बजते, और नमाज़ों के नाम अब शब्द के बीच में नहीं टूटते।
• हर ज़िक्र की पुष्ट दोहराव-संख्या, और अज़कार में क़ुरआन की पूरी तिलावतें बहाल।
• सभी 24 भाषाओं में अनुवादों की समीक्षा।
• हर जगह सुरक्षा और निजता को और मज़बूत किया गया।

Munib Tracker इस्तेमाल करने के लिए जज़ाकुमुल्लाहु ख़ैरन। सुझाव: https://munibtracker.app/contact
```

_2,879/4,000 chars_

---

## 21. Albanian — Shqip (`sq-AL`)

```text
Përditësimi ynë më i madh deri më sot — mënyra të reja adhurimi, dizajn i ri dhe një aplikacion më i qetë e më i besueshëm.

TË REJA NË ADHURIM
• Seanca të udhëzuara ezkaresh: çdo dhikër i një grupi në një ekran të vetëm, me numëruesin të integruar, i regjistruar për çdo namaz, ndërsa „Pse e recitojmë këtë“ shfaq hadithin burimor të plotë dhe shkallën e tij.
• Tesbih pas namazit (33/33/34) dhe tesbih pa duar: mësojini aplikacionit çdo dhikër duke e thënë tri herë dhe numëruesi ndjek zërin tuaj — vetëm në pajisjen tuaj.
• Sunetet ravatib nën çdo farz te gjurmuesi, planifikues për agjërimin vullnetar, zakone ditore nga Suneti dhe udhërrëfyes hap pas hapi për Dhul-Hixhxhen dhe Umren.
• Dizajne të reja tesbihu: unazë, rruaza misbahaje, numërues, guralecë, numërim me gishta e të tjera, me tingull klikimi dhe dridhje.
• Kyçja e fokusit për namaz: lini mënjanë aplikacionet që ju shpërqendrojnë gjatë namazit, në mënyrë të butë, të vendosur ose të rreptë.

KUR'ANI
• Lexoni me ndjekje çdo varg ajetesh dhe gjeni një ajet thjesht duke e recituar.
• Kontroll i shqiptimit që tregon fjalët e kapërcyera ose të paqarta, si dhe ushtrime trajnimi në texhvid.
• Shënime për ajetet me theksime me ngjyra dhe etiketa, si dhe kërkim sipas rrënjës arabe.
• Ushtrimi tani llogaritet në regjistrin e leximit dhe në hatmen tuaj, me statistika recitimi dhe arritje.
• Emra kaligrafikë të sureve dhe karta të rifreskuara të sureve.

LLOGARIDHËNIE PERSONALE DHE PRIVATE
• Muhasebeja e mbrëmjes, lidhjet familjare, regjistri i borxheve dhe emaneteve, hartues i udhëzuar i vasijetit dhe një trajner i butë javor — të ruajtura në një kasafortë të enkriptuar, me sinkronizim privat opsional.
• Llogaritës i trashëgimisë (mirathit) për të katër medhhebet dhe cilësimi „Medhhebi im“, që zbaton medhhebin tuaj në udhërrëfyes dhe llogaritës.

SË BASHKU
• Rrethe për familjen, partnerin për llogaridhënie dhe hatmen në grup. Bashkohuni me dikë afër me një kod të shkurtër dhe me miratimin e tij.
• Modaliteti për fëmijë me një ekran recitimi të udhëzuar.
• Gjetësi i xhamive me xhaminë tuaj kryesore, si dhe importimi i takvimit të saj nga një foto.

PAMJE E RE
• Çdo ekran u ridizajnua për qartësi, me shënimin e namazit me një prekje nga Kryefaqja dhe gjurmuesi.
• Ekrane të ridizajnuara për statistikat, arritjet, duatë dhe dhikrin; grupet e ezkareve që u ka ardhur koha shfaqen të parat.
• Ikona sezonale të aplikacionit, panel cilësimesh me kërkim dhe rregullimi i datës hixhrije.

WIDGET-ET, ORA DHE TV
• Widget-et dhe Aktivitetet e drejtpërdrejta ndjekin namazin aktual, me widget-e të reja për ezkaret dhe ditët islame.
• Në orë mund të shënohet vetëm namazi që i ka ardhur koha, me mundësi zhbërjeje, dhe numri i tesbihut ruhet.
• Në TV: rreshta në ekranin kryesor dhe kërkim me zë.

RREGULLIME DHE PËRMIRËSIME
• Ezkaret e recituara pas mesnatës regjistrohen nën natën së cilës i përkasin (nga sabahu në sabah).
• Numrat e dhikrit sinkronizohen menjëherë pasi i regjistroni.
• Kujtesat nuk bien më dy herë dhe emrat e namazeve nuk ndahen më në mes të fjalës.
• Numra të verifikuar përsëritjesh për çdo dhikër dhe recitime të plota kur'anore të rikthyera në ezkare.
• Përkthimet u rishikuan në të 24 gjuhët.
• Siguria dhe privatësia u forcuan kudo.

Allahu ju shpërbleftë me të mira që përdorni Munib Tracker. Komente: https://munibtracker.app/contact
```

_3,338/4,000 chars_

---

## 22. Kyrgyz — Кыргызча (`ky-KG`)

```text
Эң чоң жаңыртуубуз — ибадат үчүн жаңы мүмкүнчүлүктөр, жаңы дизайн жана тынчыраак, ишенимдүүрөөк колдонмо.

ИБАДАТТАГЫ ЖАҢЫЛЫКТАР
• Зикир сеанстары: топтомдогу бардык зикирлер бир экранда, орнотулган эсептегич менен, ар бир намаз боюнча белгиленет; «Муну эмне үчүн окуйбуз» бөлүмүндө булак хадистин толук тексти жана анын даражасы көрсөтүлөт.
• Намаздан кийинки тасбих (33/33/34) жана колсуз тасбих: каалаган зикирди үч жолу айтып үйрөтүңүз — эсептегич үнүңүздү ээрчийт, баары түзмөгүңүздө гана.
• Трекерде ар бир парздын астында раватиб сүннөттөр, нафил орозо пландагычы, күнүмдүк сүннөт адаттар жана Зул-Хижжа менен умра үчүн кадам-кадам жардамчылар.
• Тасбихтин жаңы дизайндары: шакек, мисбаха мончоктору, кликер, таштар, манжа менен эсептөө жана башкалар — чыкылдак үнү жана дирилдөө менен.
• Намаз фокусу: намаз учурунда алаксыткан колдонмолорду жумшак, бекем же катуу режимде четке коюңуз.

КУРАН
• Каалаган аяттар аралыгында кошо окуу жана аятты жөн гана окуп табуу.
• Калтырылган же так эмес сөздөрдү көрсөткөн айтылыш текшерүүсү, ошондой эле тажвид машыгуулары.
• Түстүү белгилөөлөр жана тегдер менен аят жазмалары, араб уңгулары боюнча издөө.
• Машыгуу эми окуу журналына жана хатмга эсептелет; кыраат статистикасы жана жетишкендиктер кошулду.
• Каллиграфиялык сүрө аталыштары жана жаңыланган сүрө карточкалары.

ЖЕКЕ ӨЗҮН-ӨЗҮ ЭСЕПКЕ АЛУУ
• Кечки мухасаба, тууганчылык, карыздар жана аманаттар эсеби, кадам-кадам керээз (осуят) түзгүч жана апталык жумшак кеңешчи — баары шифрленген сактагычта, каалооңуз боюнча жеке шайкештирүү менен.
• Төрт мазхабдын баары үчүн мурас (фараиз) калькулятору жана мазхабыңызды көрсөтмөлөрдө жана калькуляторлордо колдонгон «Менин мазхабым» жөндөөсү.

БИРГЕ
• Үй-бүлө, жоопкерчилик өнөктөшү жана топтук хатм үчүн топтор. Жакын жердеги адамга кыска код аркылуу, анын макулдугу менен кошулуңуз.
• Жетектелген окуу экраны бар балдар режими.
• Негизги мечитти тандоого мүмкүн болгон мечит издөө жана анын жадыбалын сүрөттөн импорттоо.

ЖАҢЫ КӨРҮНҮШ
• Ар бир экран түшүнүктүү болушу үчүн кайра иштелип чыкты; намазды Башкы беттен жана трекерден бир басуу менен белгилеңиз.
• Статистика, жетишкендиктер, дубалар жана зикир экрандары жаңыланды; убагы келген зикир топтомдору эми биринчи чыгат.
• Мезгилдик колдонмо сүрөтчөлөрү, издөөсү бар жөндөөлөр панели жана хижрий датаны оңдоо.

ВИДЖЕТТЕР, СААТ ЖАНА СЫНАЛГЫ
• Виджеттер жана Live Activity учурдагы намазды ээрчийт; зикирлер жана ислам күндөрү үчүн жаңы виджеттер.
• Саатта убагы келген намазды гана белгилөөгө болот, аны кайтарууга да болот; тасбих санагыңыз сакталат.
• Сыналгыда: башкы экрандагы катарлар жана үн менен издөө.

ОҢДООЛОР ЖАНА ЖАКШЫРТУУЛАР
• Түн жарымынан кийин айтылган зикирлер өзү таандык болгон түнгө жазылат (багымдаттан багымдатка чейин).
• Зикир сандары жазылгандан кийин дароо шайкештирилет.
• Эскертмелер эми эки жолу келбейт, намаз аталыштары сөздүн ортосунан бөлүнбөйт.
• Ар бир зикир үчүн текшерилген кайталоо сандары жана зикирлерге Куран аяттарынын толук кырааты кайтарылды.
• Бардык 24 тилдеги котормолор кайра каралды.
• Коопсуздук жана купуялуулук бардык жерде күчөтүлдү.

Munib Tracker колдонгонуңуз үчүн Алла ыраазы болсун! Пикир калтыруу: https://munibtracker.app/contact
```

_3,195/4,000 chars_

---

## 23. Tajik — Тоҷикӣ (`tg-TJ`)

```text
Бузургтарин навсозии мо — имкониятҳои нав барои ибодат, тарҳи тоза ва барномаи ороментару боэътимодтар.

НАВИҲО ДАР ИБОДАТ
• Ҷаласаҳои азкор: ҳамаи зикрҳои маҷмӯа дар як экран бо ҳисобкунаки дарунсохт ва сабт барои ҳар намоз; дар «Чаро инро мехонем» матни пурраи ҳадиси манбаъ ва дараҷаи он нишон дода мешавад.
• Тасбеҳи баъди намоз (33/33/34) ва тасбеҳи бе даст: ҳар зикрро се бор гуфта омӯзонед — ҳисобкунак овози шуморо пайгирӣ мекунад, танҳо дар дастгоҳи шумо.
• Суннатҳои ротиба зери ҳар фарз дар пайгирӣ, нақшакаши рӯзаи нафл, одатҳои ҳаррӯзаи суннат ва роҳнамоҳои қадам ба қадам барои Зулҳиҷҷа ва умра.
• Тарҳҳои нави тасбеҳ: ҳалқа, донаҳои мисбаҳа, кликер, сангчаҳо, шумориш бо ангуштон ва ғайра — бо садои клик ва ларзиш.
• Тамаркуз ба намоз: барномаҳои парешонкунандаро ҳангоми намоз дар реҷаи нарм, қатъӣ ё сахт як сӯ гузоред.

ҚУРЪОН
• Якҷоя хондан дар ҳар қисмати оятҳо ва ёфтани оят танҳо бо хондани он.
• Санҷиши талаффуз, ки калимаҳои партофташуда ё норавшанро нишон медиҳад, инчунин машқҳои таҷвид.
• Ёддоштҳо ба оятҳо бо ҷудокуниҳои рангӣ ва барчаспҳо, ҷустуҷӯ аз рӯи решаҳои арабӣ.
• Машқ акнун ба дафтари хониш ва хатм ҳисоб мешавад, бо омори тиловат ва дастовардҳо.
• Номҳои хаттотии сураҳо ва кортҳои навшудаи сураҳо.

ХУДҲИСОБДИҲИИ ШАХСӢ
• Муҳосибаи шабона, силаи раҳм, сабти қарзҳо ва амонатҳо, тартибдиҳии қадам ба қадами васият ва мураббии ҳалими ҳафтаина — ҳама дар анбори рамзгузоришуда бо ҳамоҳангсозии шахсии ихтиёрӣ.
• Ҳисобкунаки мерос (фароиз) барои ҳар чор мазҳаб ва танзими «Мазҳаби ман», ки мазҳаби шуморо дар ҳамаи роҳнамоҳо ва ҳисобкунакҳо татбиқ мекунад.

ЯКҶОЯ
• Ҳалқаҳо барои оила, шарики масъулият ва хатми гурӯҳӣ. Ба шахси наздик бо рамзи кӯтоҳ ва бо розигии ӯ ҳамроҳ шавед.
• Реҷаи кӯдакон бо экрани хониши роҳнамо.
• Масҷидёб бо интихоби масҷиди маҳалла ва воридоти ҷадвали он аз акс.

НАМУДИ НАВ
• Ҳар экран барои равшанӣ аз нав тарҳрезӣ шуд; намозро дар саҳифаи Асосӣ ва пайгирӣ бо як ламс қайд кунед.
• Экранҳои омор, дастовардҳо, дуоҳо ва зикр нав шуданд; маҷмӯаҳои азкоре, ки ҳоло вақташон расидааст, аввал меоянд.
• Нишонаҳои мавсимии барнома, панели танзимот бо ҷустуҷӯ ва танзими санаи ҳиҷрӣ.

ВИҶЕТҲО, СОАТ ВА ТЕЛЕВИЗОР
• Виҷетҳо ва фаъолияти зинда (Live Activities) намози ҷориро пайгирӣ мекунанд; виҷетҳои нави азкор ва рӯзҳои исломӣ.
• Дар соат танҳо намозе қайд мешавад, ки вақташ расидааст, бо имкони бекор кардан; шумори тасбеҳ нигоҳ дошта мешавад.
• Дар телевизор: сатрҳо дар экрани асосӣ ва ҷустуҷӯи овозӣ.

ИСЛОҲОТ ВА БЕҲБУДИҲО
• Азкоре, ки баъд аз нисфи шаб хонда мешавад, ба ҳамон шабе сабт мешавад, ки ба он тааллуқ дорад (аз бомдод то бомдод).
• Шумори зикрҳо дарҳол пас аз сабт ҳамоҳанг мешавад.
• Ёдраскуниҳо дигар ду бор намеоянд ва номҳои намозҳо дар мобайни калима канда намешаванд.
• Шумори санҷидашудаи такрор барои ҳар зикр ва барқарор шудани тиловати пурраи оятҳои Қуръон дар азкор.
• Тарҷумаҳо дар ҳамаи 24 забон аз назар гузаронида шуданд.
• Амният ва махфият дар ҳама ҷо мустаҳкам карда шуданд.

Ҷазокумуллоҳу хайран барои истифодаи Munib Tracker. Фикру мулоҳизаҳо: https://munibtracker.app/contact
```

_3,077/4,000 chars_

---

## 24. Turkmen — Türkmençe (`tk-TM`)

```text
Iň uly täzelenmämiz — ybadat üçin täze mümkinçilikler, täze dizaýn we has asuda, has ygtybarly programma.

YBADATDAKY TÄZELIKLER
• Zikir sessiýalary: toplumdaky ähli zikirler bir ekranda, içerki sanaýjy bilen, her namaz boýunça bellenýär; “Muny näme üçin okaýarys” bölüminde çeşme hadysyň doly teksti we onuň derejesi görkezilýär.
• Namazdan soňky tesbih (33/33/34) we elsiz tesbih: islendik zikri üç gezek aýdyp öwrediň — sanaýjy sesiňize eýerýär, diňe enjamyňyzda.
• Yzarlaýjyda her parzyň aşagynda rawatib sünnetler, nepil oraza meýilnamaçysy, gündelik sünnet endikleri hem-de Zülhijje we Umra üçin ädimme-ädim gollanmalar.
• Täze tesbih dizaýnlary: halka, misbaha dänejikleri, kliker, daşjagazlar, barmak bilen sanamak we başgalar — çyrt sesi we titreme bilen.
• Namaz ünsi gulpy: namaz wagtynda ünsüňizi sowýan programmalary ýumşak, berk ýa-da gaty tertipde bir gyra goýuň.

KURAN
• Islendik aýat aralygynda bilelikde okamak we aýaty diňe okap tapmak.
• Taşlanan ýa-da düşnüksiz sözleri görkezýän telaffuz barlagy, şeýle hem täjwid türgenleşikleri.
• Reňkli bellemeler we bellikler bilen aýat ýazgylary, arap kökleri boýunça gözleg.
• Türgenleşik indi okalyş ýazgyňyza we hatyma hasaplanýar; tilawet statistikasy we üstünlikler goşuldy.
• Süre atlarynyň hat sungaty görnüşi we täzelenen süre kartoçkalary.

ŞAHSY ÖZ-ÖZÜŇI HASABA ÇEKMEK
• Gijeki muhasaba, garyndaşlyk gatnaşyklary, bergiler we amanatlar ýazgysy, ädimme-ädim wesýetnama düzüji we hepdelik mylakatly tälimçi — ählisi şifrlenen ammarda, islege görä şahsy sinhronlama bilen.
• Dört mezhebiň hemmesi üçin miras (faraiz) kalkulýatory we mezhebiňizi gollanmalarda hem kalkulýatorlarda ulanýan “Meniň mezhebim” sazlamasy.

BILELIKDE
• Maşgala, jogapkärçilik ýoldaşy we topar hatymy üçin toparlar. Golaýdaky adama gysga kod arkaly, onuň razylygy bilen goşulyň.
• Ugrukdyryjy okamak ekranly çagalar tertibi.
• Öz metjidiňizi saýlap bolýan metjit gözlegi we onuň wagt tertibini suratdan import etmek.

TÄZE KEŞP
• Her ekran düşnükli bolar ýaly täzeden işlenildi; namazy Baş sahypadan we yzarlaýjydan bir basyşda belläň.
• Statistika, üstünlikler, dogalar we zikir ekranlary täzelendi; wagty gelen zikir toplumlary indi ilki çykýar.
• Möwsümleýin programma nyşanlary, gözlegli sazlamalar paneli we Hijri sene düzedişi.

WIDJETLER, SAGAT WE TELEWIZOR
• Widjetler we göni işjeňlik (Live Activities) häzirki namaza eýerýär; zikir we Yslam günleri üçin täze widjetler.
• Sagatda diňe wagty gelen namazy bellemek bolýar, ony yzyna almak hem mümkin; tesbih sanyňyz saklanýar.
• Telewizorda: baş ekrandaky hatarlar we ses gözlegi.

DÜZEDIŞLER WE KÄMILLEŞDIRMELER
• Ýary gijeden soň okalan zikirler özüniň degişli bolan gijesine ýazylýar (ertir namazyndan ertir namazyna çenli).
• Zikir sanlary ýazga alnan badyna sinhronlanýar.
• Ýatlatmalar indi iki gezek gelmeýär, namaz atlary hem sözüň ortasyndan bölünmeýär.
• Her zikir üçin barlanan gaýtalama sanlary we zikirlerde Kuran aýatlarynyň doly tilaweti dikeldildi.
• Ähli 24 dildäki terjimeler gaýtadan gözden geçirildi.
• Howpsuzlyk we gizlinlik her tarapdan berkidildi.

Munib Tracker-den peýdalanýandygyňyz üçin Alla razy bolsun! Pikirleriňiz: https://munibtracker.app/contact
```

_3,181/4,000 chars_

---

# Google Play release notes (500 chars)

Play Console → release → _Release notes_, one block per language. Each is ≤ 500 characters.

## Play quick-reference index

| #   | Language                      | App locale | Play locale | Chars |
| --- | ----------------------------- | ---------- | ----------- | ----- |
| 1   | English                       | `en`       | `en-US`     | 407   |
| 2   | Arabic — العربية              | `ar`       | `ar-SA`     | 407   |
| 3   | Urdu — اردو                   | `ur`       | `ur-PK`     | 386   |
| 4   | Indonesian — Bahasa Indonesia | `id`       | `id-ID`     | 436   |
| 5   | Turkish — Türkçe              | `tr`       | `tr-TR`     | 440   |
| 6   | Bengali — বাংলা                 | `bn`       | `bn-BD`     | 399   |
| 7   | Malay — Bahasa Melayu         | `ms`       | `ms-MY`     | 448   |
| 8   | Persian — فارسی               | `fa`       | `fa-IR`     | 395   |
| 9   | French — Français             | `fr`       | `fr-FR`     | 488   |
| 10  | Hausa                         | `ha`       | `ha-NG`     | 458   |
| 11  | Swahili — Kiswahili           | `sw`       | `sw-TZ`     | 469   |
| 12  | Russian — Русский             | `ru`       | `ru-RU`     | 422   |
| 13  | Azerbaijani — Azərbaycanca    | `az`       | `az-AZ`     | 424   |
| 14  | Pashto — پښتو                 | `ps`       | `ps-AF`     | 395   |
| 15  | Somali — Soomaali             | `so`       | `so-SO`     | 486   |
| 16  | Uzbek — Oʻzbekcha             | `uz`       | `uz-UZ`     | 422   |
| 17  | Kazakh — Қазақша              | `kk`       | `kk-KZ`     | 404   |
| 18  | Kurdish (Sorani) — کوردی      | `ku`       | `ku`        | 447   |
| 19  | Bosnian — Bosanski            | `bs`       | `bs-BA`     | 428   |
| 20  | Hindi — हिन्दी                 | `hi`       | `hi-IN`     | 398   |
| 21  | Albanian — Shqip              | `sq`       | `sq-AL`     | 487   |
| 22  | Kyrgyz — Кыргызча             | `ky`       | `ky-KG`     | 409   |
| 23  | Tajik — Тоҷикӣ                | `tg`       | `tg-TJ`     | 401   |
| 24  | Turkmen — Türkmençe           | `tk`       | `tk-TM`     | 410   |

---

### P1. English (`en-US`)

```text
Our biggest update yet:
• Guided adhkar sessions and hands-free tasbeeh
• Sunnah rawatib, voluntary fasting, Dhul-Hijjah and Umrah companions
• Qur'an: recite along, find a verse by reciting it, ayah notes
• Encrypted vault: muhasabah, debts, wasiyyah, mirath
• Circles, group khatm and masjid finder
• Every screen redesigned; smarter widgets, watch and TV
• Fixes: reliable reminders and instant zikr sync
```

_407/500 chars_

---

### P2. Arabic — العربية (`ar-SA`)

_Right-to-left — paste as is._

```text
أكبر تحديث لنا حتى الآن:
• جلسات الأذكار الموجَّهة والتسبيح دون استخدام اليدين
• السنن الرواتب وصيام التطوع ومرافق لذي الحجة والعمرة
• القرآن: «اقرأ مع المستمع»، والبحث عن الآية بتلاوتها، وملاحظات على الآيات
• خزنة مشفّرة: محاسبة النفس، والديون، والوصية، والميراث
• الحلقات والختمة الجماعية والبحث عن المساجد
• إعادة تصميم كل الشاشات؛ وأدوات وساعة وتلفاز أذكى
• إصلاحات: تذكيرات موثوقة ومزامنة فورية للأذكار
```

_407/500 chars_

---

### P3. Urdu — اردو (`ur-PK`)

_Right-to-left — paste as is._

```text
اب تک کی ہماری سب سے بڑی اپ ڈیٹ:
• رہنما اذکار نشستیں اور بغیر ہاتھ لگائے تسبیح
• سنتِ مؤکدہ (رواتب)، نفلی روزے، ذوالحجہ اور عمرہ کے رہنما
• قرآن: ساتھ ساتھ پڑھیں، تلاوت کر کے آیت تلاش کریں، آیات پر نوٹس
• انکرپٹڈ والٹ: محاسبہ، قرض، وصیت، میراث
• حلقے، اجتماعی ختم اور مسجد تلاش
• ہر اسکرین کا نیا ڈیزائن؛ بہتر وجیٹس، واچ اور ٹی وی
• اصلاحات: قابلِ اعتماد یاددہانیاں اور ذکر کا فوری سنک
```

_386/500 chars_

---

### P4. Indonesian — Bahasa Indonesia (`id-ID`)

```text
Pembaruan terbesar kami:
• Sesi zikir terpandu dan tasbih tanpa sentuh
• Sunah rawatib, puasa sunah, pendamping Zulhijah dan umrah
• Al-Qur'an: baca bersama, temukan ayat dengan membacanya, catatan ayat
• Brankas terenkripsi: muhasabah, utang, wasiat, warisan
• Lingkaran, khatam bersama, dan pencari masjid
• Semua layar didesain ulang; widget, jam tangan, dan TV lebih cerdas
• Perbaikan: pengingat andal dan sinkronisasi zikir instan
```

_436/500 chars_

---

### P5. Turkish — Türkçe (`tr-TR`)

```text
Şimdiye kadarki en büyük güncellememiz:
• Rehberli zikir oturumları ve eller serbest tesbih
• Revatib sünnetler, nafile oruç, Zilhicce ve Umre rehberleri
• Kur'an: "Dinleyiciyle oku", okuyarak ayet bulma, ayet notları
• Şifreli kasa: muhasebe, borçlar, vasiyet, miras
• Halkalar, grup hatmi ve cami bulucu
• Tüm ekranlar yeniden tasarlandı; daha akıllı widget'lar, saat ve TV
• Düzeltmeler: güvenilir hatırlatıcılar ve anında zikir eşitleme
```

_440/500 chars_

---

### P6. Bengali — বাংলা (`bn-BD`)

```text
আমাদের সবচেয়ে বড় আপডেট:
• নির্দেশিত আজকার সেশন ও হ্যান্ডস-ফ্রি তাসবিহ
• সুন্নতে রাওয়াতিব, নফল রোজা, জিলহজ ও উমরাহর সহায়িকা
• কুরআন: সাথে সাথে তিলাওয়াত, তিলাওয়াত করে আয়াত খোঁজা, আয়াত-নোট
• এনক্রিপ্টেড ভল্ট: মুহাসাবা, ঋণ, ওসিয়ত, মিরাস
• সার্কেল, সম্মিলিত খতম ও মসজিদ খোঁজা
• প্রতিটি স্ক্রিন নতুন ডিজাইনে; আরও স্মার্ট উইজেট, ঘড়ি ও টিভি
• সমাধান: নির্ভরযোগ্য রিমাইন্ডার ও তাৎক্ষণিক জিকির সিঙ্ক
```

_399/500 chars_

---

### P7. Malay — Bahasa Melayu (`ms-MY`)

```text
Kemas kini terbesar kami:
• Sesi zikir berpandu dan tasbih tanpa sentuh
• Sunat rawatib, puasa sunat, panduan Zulhijjah dan umrah
• Al-Quran: baca bersama, cari ayat dengan membacanya, nota ayat
• Peti besi tersulit: muhasabah, hutang, wasiat, faraid
• Kumpulan, khatam berkumpulan dan pencari masjid
• Setiap skrin direka semula; widget, jam tangan dan TV lebih pintar
• Pembetulan: peringatan yang boleh diharap dan penyegerakan zikir serta-merta
```

_448/500 chars_

---

### P8. Persian — فارسی (`fa-IR`)

_Right-to-left — paste as is._

```text
بزرگ‌ترین به‌روزرسانی ما تا امروز:
• جلسه‌های راهنمای اذکار و تسبیح صوتی
• سنت‌های راتبه، روزه‌های مستحبی، همراه ذی‌الحجه و عمره
• قرآن: همراه‌خوانی، یافتن آیه با تلاوت، یادداشت‌های آیه
• گاوصندوق رمزگذاری‌شده: محاسبه، بدهی‌ها، وصیت‌نامه، میراث
• حلقه‌ها، ختم گروهی و مسجدیاب
• بازطراحی همهٔ صفحه‌ها؛ ابزارک‌ها، ساعت و تلویزیون هوشمندتر
• رفع اشکال: یادآوری‌های قابل‌اعتماد و همگام‌سازی فوری ذکر
```

_395/500 chars_

---

### P9. French — Français (`fr-FR`)

```text
Notre plus grande mise à jour à ce jour :
• Séances guidées d'adhkar et tasbeeh mains libres
• Sunnah rawatib, jeûne surérogatoire, accompagnements Dhul-Hijjah et Omra
• Coran : réciter avec suivi, trouver un verset en le récitant, notes sur les versets
• Coffre chiffré : muhasabah, dettes, wasiyyah, mirath
• Cercles, khatm collectif et recherche de masjids
• Chaque écran repensé ; widgets, montre et TV plus intelligents
• Corrections : rappels fiables et synchro instantanée des zikr
```

_488/500 chars_

---

### P10. Hausa (`ha-NG`)

```text
Babban sabuntawarmu zuwa yanzu:
• Zaman azkar mai jagora da tasbihi ba tare da hannu ba
• Sunnonin rawatib, azumin nafila, jagororin Zul-Hijja da Umra
• Alƙur'ani: karanta tare, nemo aya ta hanyar karanta ta, bayanai kan ayoyi
• Ma'aji mai ɓoyewa: muhasaba, basussuka, wasiyya, mirasi
• Da'irori, saukar rukuni da neman masallaci
• An sake zana kowane allo; wijet, agogo da talabijin mafi wayo
• Gyare-gyare: tunatarwa abin dogaro da daidaita zikiri nan take
```

_458/500 chars_

---

### P11. Swahili — Kiswahili (`sw-TZ`)

```text
Sasisho letu kubwa zaidi hadi sasa:
• Vikao vya adhkari vinavyoongozwa na Tasbihi bila kugusa
• Sunna za rawatib, funga za hiari, miongozo ya Dhul-Hijja na Umra
• Qur'ani: soma pamoja, pata aya kwa kuisoma, madokezo ya aya
• Sefu iliyosimbwa: muhasaba, madeni, wasia, mirathi
• Duara, khitma ya kikundi na kitafutaji cha misikiti
• Kila skrini imesanifiwa upya; wijeti, saa na TV mahiri zaidi
• Marekebisho: vikumbusho vya kutegemewa na usawazishaji wa dhikri papo hapo
```

_469/500 chars_

---

### P12. Russian — Русский (`ru-RU`)

```text
Наше самое большое обновление:
• Сеансы азкаров и тасбих без рук
• Сунна-раватиб, добровольный пост, помощники на Зуль-хиджу и умру
• Коран: чтение с сопровождением, поиск аята по чтению, заметки к аятам
• Зашифрованное хранилище: мухасаба, долги, васыйя, мирас
• Круги, совместный хатм и поиск мечетей
• Каждый экран обновлён; умнее виджеты, часы и ТВ
• Исправления: надёжные напоминания и мгновенная синхронизация зикров
```

_422/500 chars_

---

### P13. Azerbaijani — Azərbaycanca (`az-AZ`)

```text
İndiyədək ən böyük yeniləməmiz:
• Bələdçili zikr seansları və əllərsiz təsbeh
• Rəvatib sünnələr, nafilə oruc, Zilhiccə və Ümrə bələdçiləri
• Quran: dinləyici ilə oxu, ayəni oxuyaraq tap, ayə qeydləri
• Şifrəli seyf: mühasibə, borclar, vəsiyyət, miras
• Halqalar, qrup xətmi və məscid axtarışı
• Hər ekran yeniləndi; daha ağıllı vidjetlər, saat və TV
• Düzəlişlər: etibarlı xatırlatmalar və zikrlərin dərhal sinxronizasiyası
```

_424/500 chars_

---

### P14. Pashto — پښتو (`ps-AF`)

_Right-to-left — paste as is._

```text
تر اوسه زموږ تر ټولو لوی تازه‌والی:
• لارښوونکې اذکار ناستې او په غږ تسبیح
• راتبه سنتونه، نفلي روژې، د ذوالحجې او عمرې ملګری
• قرآن: «له اورېدونکي سره ولولئ»، په تلاوت آیت موندل، پر آیتونو یادښتونه
• کوډ شوې خزانه: محاسبه، پورونه، وصیت، میراث
• حلقې، ډله‌ییز ختم او د جوماتونو موندونکی
• هره پرده له سره ډیزاین شوې؛ هوښیار وېجټونه، ساعت او ټلوېزیون
• سمونونه: باوري یادونې او د ذکر سمدستي همغږي
```

_395/500 chars_

---

### P15. Somali — Soomaali (`so-SO`)

```text
Cusboonaysiintayadii ugu weyneyd ilaa hadda:
• Adkaar la hagayo iyo tasbiix gacan la'aan ah
• Sunnooyinka rawaatib, soon sunno ah, hagayaasha Dul-Xijo iyo Cumrada
• Qur'aanka: akhri la socda dhegeystaha, aayad ku hel akhris, qoraal aayadeed
• Khasnad sir ah: muxaasabo, deymo, wasiyad, dhaxal
• Goobaabinno, khatmi koox iyo raadiyaha masaajidda
• Shaashad kasta waa cusub; widget-yo, saacad iyo TV ka caqli badan
• Hagaajin: xusuusinno kalsooni leh iyo dikri isla markiiba la isku xidho
```

_486/500 chars_

---

### P16. Uzbek — Oʻzbekcha (`uz-UZ`)

```text
Eng katta yangilanishimiz:
• Zikrlar seanslari va qo'lsiz tasbeh
• Ravotib sunnatlar, nafl ro'za, Zulhijja va Umra yo'riqnomalari
• Qur'on: birga o'qish, oyatni o'qib topish, oyat eslatmalari
• Shifrlangan xazina: muhosaba, qarzlar, vasiyat, meros
• Halqalar, guruh xatmi va masjid qidiruvi
• Har bir ekran yangilandi; aqlliroq vidjetlar, soat va TV
• Tuzatishlar: ishonchli eslatmalar va zikrlarning darhol sinxronlanishi
```

_422/500 chars_

---

### P17. Kazakh — Қазақша (`kk-KZ`)

```text
Ең ауқымды жаңартуымыз:
• Зікір сессиялары және қолсыз тәспі
• Раватиб сүннеттер, нәпіл ораза, Зұлхижжа мен умра көмекшілері
• Құран: бірге оқу, аятты оқып табу, аят жазбалары
• Шифрланған қойма: мұхасаба, қарыздар, өсиет, мұра
• Шеңберлер, топтық хатым және мешіт іздеу
• Әр экран жаңартылды; ақылдырақ виджеттер, сағат және теледидар
• Түзетулер: сенімді еске салғыштар және зікірдің лезде синхрондалуы
```

_404/500 chars_

---

### P18. Kurdish (Sorani) — کوردی (`ku`)

_Right-to-left — paste as is._

```text
گەورەترین نوێکردنەوەمان تا ئێستا:
• دانیشتنی ڕێنماییکراوی ئەزکار و تەسبیحی بێدەست
• سوننەتە ڕاتیبەکان، ڕۆژووی سوننەت، هاوەڵی زولحیججە و عومرە
• قورئان: «لەگەڵ گوێگر بخوێنە»، دۆزینەوەی ئایەت بە خوێندنەوە، تێبینیی ئایەت
• سندووقی شفرەکراو: خۆلێپرسینەوە، قەرز، وەسیەت، میرات
• بازنەکان، خەتمی گرووپی و مزگەوت دۆزەرەوە
• هەموو شاشەکان نوێ دیزاین کراون؛ ویجێت، کاتژمێر و تەلەفزیۆنی زیرەکتر
• چاکسازی: بیرخستنەوەی جێی متمانە و هاوکاتکردنی دەستبەجێی زیکر
```

_447/500 chars_

---

### P19. Bosnian — Bosanski (`bs-BA`)

```text
Naše najveće ažuriranje do sada:
• Vođene sesije ezkara i tesbih bez ruku
• Revatib sunneti, dobrovoljni post, vodiči za zul-hidždžu i umru
• Kur'an: učenje uz slušaoca, pronalazak ajeta učenjem, bilješke uz ajete
• Šifrovani sef: muhasaba, dugovi, vasijjet, miras
• Krugovi, grupna hatma i pretraga džamija
• Svaki ekran redizajniran; pametniji widgeti, sat i TV
• Ispravke: pouzdani podsjetnici i trenutna sinhronizacija zikra
```

_428/500 chars_

---

### P20. Hindi — हिन्दी (`hi-IN`)

```text
अब तक का हमारा सबसे बड़ा अपडेट:
• निर्देशित अज़कार सत्र और हैंड्स-फ़्री तस्बीह
• सुन्नत-ए-रवातिब, नफ़्ल रोज़े, ज़िलहिज्जा और उमरा के साथी
• क़ुरआन: साथ-साथ तिलावत, तिलावत करके आयत खोजें, आयत नोट्स
• एन्क्रिप्टेड वॉल्ट: मुहासबा, क़र्ज़, वसीयत, मीरास
• सर्कल, सामूहिक ख़त्म और मस्जिद खोज
• हर स्क्रीन नए डिज़ाइन में; ज़्यादा स्मार्ट विजेट, घड़ी और टीवी
• सुधार: भरोसेमंद रिमाइंडर और तुरंत ज़िक्र सिंक
```

_398/500 chars_

---

### P21. Albanian — Shqip (`sq-AL`)

```text
Përditësimi ynë më i madh deri më sot:
• Seanca të udhëzuara ezkaresh dhe tesbih pa duar
• Sunetet ravatib, agjërim vullnetar, udhërrëfyes për Dhul-Hixhxhen dhe Umren
• Kur'ani: lexo me ndjekje, gjej një ajet duke e recituar, shënime për ajetet
• Kasafortë e enkriptuar: muhasebe, borxhe, vasijet, mirath
• Rrethe, hatme në grup dhe gjetësi i xhamive
• Çdo ekran i ridizajnuar; widget-e, orë dhe TV më të zgjuar
• Rregullime: kujtesa të besueshme dhe sinkronizim i menjëhershëm i dhikrit
```

_487/500 chars_

---

### P22. Kyrgyz — Кыргызча (`ky-KG`)

```text
Эң чоң жаңыртуубуз:
• Зикир сеанстары жана колсуз тасбих
• Раватиб сүннөттөр, нафил орозо, Зул-Хижжа жана умра жардамчылары
• Куран: кошо окуу, аятты окуп табуу, аят жазмалары
• Шифрленген сактагыч: мухасаба, карыздар, керээз, мурас
• Топтор, топтук хатм жана мечит издөө
• Ар бир экран жаңыланды; акылдуураак виджеттер, саат жана сыналгы
• Оңдоолор: ишенимдүү эскертмелер жана зикирдин заматта шайкештирилиши
```

_409/500 chars_

---

### P23. Tajik — Тоҷикӣ (`tg-TJ`)

```text
Бузургтарин навсозии мо:
• Ҷаласаҳои азкор ва тасбеҳи бе даст
• Суннатҳои ротиба, рӯзаи нафл, роҳнамоҳои Зулҳиҷҷа ва умра
• Қуръон: якҷоя хондан, ёфтани оят бо хондан, ёддоштҳо ба оятҳо
• Анбори рамзгузоришуда: муҳосиба, қарзҳо, васият, мерос
• Ҳалқаҳо, хатми гурӯҳӣ ва масҷидёб
• Ҳар экран нав шуд; виҷетҳо, соат ва телевизори оқилонатар
• Ислоҳот: ёдраскуниҳои боэътимод ва ҳамоҳангсозии фаврии зикр
```

_401/500 chars_

---

### P24. Turkmen — Türkmençe (`tk-TM`)

```text
Iň uly täzelenmämiz:
• Zikir sessiýalary we elsiz tesbih
• Rawatib sünnetler, nepil oraza, Zülhijje we Umra gollanmalary
• Kuran: bilelikde okamak, aýaty okap tapmak, aýat ýazgylary
• Şifrlenen ammar: muhasaba, bergiler, wesýet, miras
• Toparlar, topar hatymy we metjit gözlegi
• Her ekran täzelendi; has akylly widjetler, sagat we telewizor
• Düzedişler: ygtybarly ýatlatmalar we zikiriň derrew sinhronlanmagy
```

_410/500 chars_
