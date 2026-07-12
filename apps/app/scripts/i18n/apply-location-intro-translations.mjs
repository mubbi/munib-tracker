#!/usr/bin/env node
/**
 * Apply translations for onboarding location/notifications intro keys
 * across all non-English catalogs, and sync into ui-polish-patches.json.
 *
 * Usage: node apps/app/scripts/i18n/apply-location-intro-translations.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const I18N_DIR = join(__dirname, "../../src/i18n");
const PATCHES_PATH = join(__dirname, "ui-polish-patches.json");

/** @type {Record<string, Record<string, string>>} */
const TRANSLATIONS = {
  id: {
    "onboarding.locationEyebrow": "Lokasi & pengingat",
    "onboarding.locationTitle": "Waktu sholat dan pengingat lembut",
    "onboarding.locationBody":
      "Munib Tracker memakai lokasi Anda untuk waktu sholat dan kiblat yang akurat, serta dapat mengirim pengingat opsional untuk Sholat, Zikir, dan Qaza. Keduanya bisa diubah nanti di pengaturan.",
    "onboarding.locationHighlight1": "Waktu sholat sesuai kota Anda",
    "onboarding.locationHighlight2": "Kompas kiblat dari posisi Anda",
    "onboarding.locationHighlight3": "Pengingat opsional untuk Sholat, Zikir, dan Qaza",
    "onboarding.locationHighlight4":
      "Lewati kapan saja — atur lokasi atau aktifkan notifikasi nanti",
    "onboarding.locationPrivacyTitle": "Pribadi di perangkat Anda",
    "onboarding.locationPrivacyBody":
      "Koordinat Anda tetap di perangkat ini untuk waktu sholat dan kiblat. Notifikasi adalah pengingat lokal — kami tidak melacak pergerakan Anda atau menjual data Anda.",
    "onboarding.locationAllow": "Izinkan lokasi & notifikasi",
    "onboarding.locationLocating": "Menyiapkan…",
    "onboarding.locationSkip": "Atur nanti",
    "seo.introLocation.title": "Lokasi & pengingat",
    "seo.introLocation.description":
      "Izinkan lokasi dan notifikasi untuk waktu sholat akurat, kiblat, dan pengingat opsional — atau atur nanti.",
  },
  ms: {
    "onboarding.locationEyebrow": "Lokasi & peringatan",
    "onboarding.locationTitle": "Waktu solah dan peringatan lembut",
    "onboarding.locationBody":
      "Munib Tracker menggunakan lokasi anda untuk waktu solah dan kiblat yang tepat, serta boleh menghantar peringatan pilihan untuk Solah, Zikir, dan Qaza. Kedua-duanya boleh diubah kemudian dalam tetapan.",
    "onboarding.locationHighlight1": "Waktu solah mengikut bandar anda",
    "onboarding.locationHighlight2": "Kompas kiblat dari kedudukan anda",
    "onboarding.locationHighlight3": "Peringatan pilihan untuk Solah, Zikir, dan Qaza",
    "onboarding.locationHighlight4":
      "Langkau bila-bila masa — tetapkan lokasi atau dayakan pemberitahuan kemudian",
    "onboarding.locationPrivacyTitle": "Peribadi pada peranti anda",
    "onboarding.locationPrivacyBody":
      "Koordinat anda kekal pada peranti ini untuk waktu solah dan kiblat. Pemberitahuan ialah peringatan tempatan — kami tidak menjejak pergerakan anda atau menjual data anda.",
    "onboarding.locationAllow": "Benarkan lokasi & pemberitahuan",
    "onboarding.locationLocating": "Menyediakan…",
    "onboarding.locationSkip": "Sediakan kemudian",
    "seo.introLocation.title": "Lokasi & peringatan",
    "seo.introLocation.description":
      "Benarkan lokasi dan pemberitahuan untuk waktu solah tepat, kiblat, dan peringatan pilihan — atau sediakan kemudian.",
  },
  tr: {
    "onboarding.locationEyebrow": "Konum ve hatırlatmalar",
    "onboarding.locationTitle": "Namaz vakitleri ve nazik hatırlatmalar",
    "onboarding.locationBody":
      "Munib Tracker, doğru namaz vakitleri ve kıble için konumunuzu kullanır; Namaz, Zikir ve Kaza için isteğe bağlı hatırlatmalar da gönderebilir. İkisini de daha sonra ayarlardan değiştirebilirsiniz.",
    "onboarding.locationHighlight1": "Şehrinize uygun namaz vakitleri",
    "onboarding.locationHighlight2": "Bulunduğunuz yerden kıble pusulası",
    "onboarding.locationHighlight3": "Namaz, Zikir ve Kaza için isteğe bağlı hatırlatmalar",
    "onboarding.locationHighlight4":
      "İstediğiniz zaman atlayın — konumu veya bildirimleri sonra ayarlayın",
    "onboarding.locationPrivacyTitle": "Cihazınızda gizli",
    "onboarding.locationPrivacyBody":
      "Koordinatlarınız namaz vakitleri ve kıble için bu cihazda kalır. Bildirimler yerel hatırlatmalardır — hareketlerinizi izlemez veya verilerinizi satmayız.",
    "onboarding.locationAllow": "Konuma ve bildirimlere izin ver",
    "onboarding.locationLocating": "Hazırlanıyor…",
    "onboarding.locationSkip": "Sonra ayarla",
    "seo.introLocation.title": "Konum ve hatırlatmalar",
    "seo.introLocation.description":
      "Doğru namaz vakitleri, kıble ve isteğe bağlı hatırlatmalar için konum ve bildirimlere izin verin — veya sonra ayarlayın.",
  },
  bn: {
    "onboarding.locationEyebrow": "অবস্থান ও অনুস্মারক",
    "onboarding.locationTitle": "নামাজের সময় ও নরম অনুস্মারক",
    "onboarding.locationBody":
      "Munib Tracker সঠিক নামাজের সময় ও কিবলার জন্য আপনার অবস্থান ব্যবহার করে, এবং নামাজ, জিকির ও কাজার ঐচ্ছিক অনুস্মারক পাঠাতে পারে। দুটোই পরে সেটিংস থেকে বদলাতে পারবেন।",
    "onboarding.locationHighlight1": "আপনার শহর অনুযায়ী নামাজের সময়",
    "onboarding.locationHighlight2": "আপনার অবস্থান থেকে কিবলা কম্পাস",
    "onboarding.locationHighlight3": "নামাজ, জিকির ও কাজার ঐচ্ছিক অনুস্মারক",
    "onboarding.locationHighlight4": "যখন খুশি এড়িয়ে যান — পরে অবস্থান বা বিজ্ঞপ্তি চালু করুন",
    "onboarding.locationPrivacyTitle": "আপনার ডিভাইসে ব্যক্তিগত",
    "onboarding.locationPrivacyBody":
      "আপনার স্থানাঙ্ক নামাজের সময় ও কিবলার জন্য এই ডিভাইসেই থাকে। বিজ্ঞপ্তি স্থানীয় অনুস্মারক — আমরা আপনার চলাচল ট্র্যাক করি না বা ডেটা বিক্রি করি না।",
    "onboarding.locationAllow": "অবস্থান ও বিজ্ঞপ্তির অনুমতি দিন",
    "onboarding.locationLocating": "প্রস্তুত হচ্ছে…",
    "onboarding.locationSkip": "পরে সাজান",
    "seo.introLocation.title": "অবস্থান ও অনুস্মারক",
    "seo.introLocation.description":
      "সঠিক নামাজের সময়, কিবলা ও ঐচ্ছিক অনুস্মারকের জন্য অবস্থান ও বিজ্ঞপ্তির অনুমতি দিন — অথবা পরে সাজান।",
  },
  fa: {
    "onboarding.locationEyebrow": "موقعیت و یادآورها",
    "onboarding.locationTitle": "اوقات نماز و یادآورهای ملایم",
    "onboarding.locationBody":
      "Munib Tracker از موقعیت شما برای اوقات نماز و قبلهٔ دقیق استفاده می‌کند و می‌تواند یادآورهای اختیاری برای نماز، ذکر و قضا بفرستد. هر دو را بعداً در تنظیمات می‌توانید تغییر دهید.",
    "onboarding.locationHighlight1": "اوقات نماز متناسب با شهر شما",
    "onboarding.locationHighlight2": "قطب‌نمای قبله از جای شما",
    "onboarding.locationHighlight3": "یادآورهای اختیاری برای نماز، ذکر و قضا",
    "onboarding.locationHighlight4":
      "هر وقت خواستید رد شوید — بعداً موقعیت یا اعلان‌ها را تنظیم کنید",
    "onboarding.locationPrivacyTitle": "خصوصی روی دستگاه شما",
    "onboarding.locationPrivacyBody":
      "مختصات شما برای اوقات نماز و قبله روی همین دستگاه می‌ماند. اعلان‌ها یادآورهای محلی‌اند — ما حرکت شما را ردیابی نمی‌کنیم و داده نمی‌فروشیم.",
    "onboarding.locationAllow": "اجازهٔ موقعیت و اعلان‌ها",
    "onboarding.locationLocating": "در حال آماده‌سازی…",
    "onboarding.locationSkip": "بعداً تنظیم کنید",
    "seo.introLocation.title": "موقعیت و یادآورها",
    "seo.introLocation.description":
      "برای اوقات نماز دقیق، قبله و یادآورهای اختیاری به موقعیت و اعلان‌ها اجازه دهید — یا بعداً تنظیم کنید.",
  },
  fr: {
    "onboarding.locationEyebrow": "Localisation et rappels",
    "onboarding.locationTitle": "Horaires de Salah et rappels doux",
    "onboarding.locationBody":
      "Munib Tracker utilise votre localisation pour des horaires de Salah et une qibla précis, et peut envoyer des rappels optionnels pour la Salah, le Zikr et le Qaza. Vous pourrez tout modifier plus tard dans les paramètres.",
    "onboarding.locationHighlight1": "Horaires de Salah adaptés à votre ville",
    "onboarding.locationHighlight2": "Boussole qibla depuis votre position",
    "onboarding.locationHighlight3": "Rappels optionnels pour Salah, Zikr et Qaza",
    "onboarding.locationHighlight4":
      "Ignorez à tout moment — définissez la localisation ou activez les notifications plus tard",
    "onboarding.locationPrivacyTitle": "Privé sur votre appareil",
    "onboarding.locationPrivacyBody":
      "Vos coordonnées restent sur cet appareil pour les horaires de Salah et la qibla. Les notifications sont des rappels locaux — nous ne suivons pas vos déplacements ni ne vendons vos données.",
    "onboarding.locationAllow": "Autoriser la localisation et les notifications",
    "onboarding.locationLocating": "Configuration…",
    "onboarding.locationSkip": "Configurer plus tard",
    "seo.introLocation.title": "Localisation et rappels",
    "seo.introLocation.description":
      "Autorisez la localisation et les notifications pour des horaires de Salah précis, la qibla et des rappels optionnels — ou configurez-les plus tard.",
  },
  ha: {
    "onboarding.locationEyebrow": "Wuri da tunatarwa",
    "onboarding.locationTitle": "Lokutan sallah da tunatarwa mai sauƙi",
    "onboarding.locationBody":
      "Munib Tracker yana amfani da wurinku don ingantattun lokutan sallah da qibla, kuma zai iya aika zaɓaɓɓun tunatarwa na Sallah, Zikir, da Qaza. Kuna iya canza kowanne daga baya a cikin saituna.",
    "onboarding.locationHighlight1": "Lokutan sallah da suka dace da garinku",
    "onboarding.locationHighlight2": "Kamfas ɗin qibla daga inda kuke tsaye",
    "onboarding.locationHighlight3": "Zaɓaɓɓun tunatarwa na Sallah, Zikir, da Qaza",
    "onboarding.locationHighlight4":
      "Tsallake kowane lokaci — saita wuri ko kunna sanarwa daga baya",
    "onboarding.locationPrivacyTitle": "Sirri a kan na'urarku",
    "onboarding.locationPrivacyBody":
      "Mahangar wurinku tana kan wannan na'ura don lokutan sallah da qibla. Sanarwa tunatarwa ne na gida — ba ma bin ƙafar ku ko sayar da bayanan ku.",
    "onboarding.locationAllow": "Bada izinin wuri da sanarwa",
    "onboarding.locationLocating": "Ana shiryawa…",
    "onboarding.locationSkip": "Saita daga baya",
    "seo.introLocation.title": "Wuri da tunatarwa",
    "seo.introLocation.description":
      "Bada izinin wuri da sanarwa don ingantattun lokutan sallah, qibla, da zaɓaɓɓun tunatarwa — ko saita daga baya.",
  },
  sw: {
    "onboarding.locationEyebrow": "Mahali na vikumbusho",
    "onboarding.locationTitle": "Nyakati za swala na vikumbusho laini",
    "onboarding.locationBody":
      "Munib Tracker hutumia mahali pako kwa nyakati sahihi za swala na qibla, na inaweza kutuma vikumbusho vya hiari kwa Swala, Zikr, na Qaza. Unaweza kubadilisha yoyote baadaye kwenye mipangilio.",
    "onboarding.locationHighlight1": "Nyakati za swala zinazolingana na mji wako",
    "onboarding.locationHighlight2": "Dira ya qibla kutoka unaposimama",
    "onboarding.locationHighlight3": "Vikumbusho vya hiari kwa Swala, Zikr, na Qaza",
    "onboarding.locationHighlight4": "Ruka wakati wowote — weka mahali au washa arifa baadaye",
    "onboarding.locationPrivacyTitle": "Faragha kwenye kifaa chako",
    "onboarding.locationPrivacyBody":
      "Kuratibu zako zinabaki kwenye kifaa hiki kwa nyakati za swala na qibla. Arifa ni vikumbusho vya ndani — hatufuatilii harakati zako wala hatuuuzi data yako.",
    "onboarding.locationAllow": "Ruhusu mahali na arifa",
    "onboarding.locationLocating": "Inaandaa…",
    "onboarding.locationSkip": "Weka baadaye",
    "seo.introLocation.title": "Mahali na vikumbusho",
    "seo.introLocation.description":
      "Ruhusu mahali na arifa kwa nyakati sahihi za swala, qibla, na vikumbusho vya hiari — au weka baadaye.",
  },
  ru: {
    "onboarding.locationEyebrow": "Местоположение и напоминания",
    "onboarding.locationTitle": "Время намаза и мягкие напоминания",
    "onboarding.locationBody":
      "Munib Tracker использует ваше местоположение для точного времени намаза и киблы и может отправлять необязательные напоминания о намазе, зикре и каза. И то и другое можно изменить позже в настройках.",
    "onboarding.locationHighlight1": "Время намаза по вашему городу",
    "onboarding.locationHighlight2": "Компас киблы с вашего места",
    "onboarding.locationHighlight3": "Необязательные напоминания о намазе, зикре и каза",
    "onboarding.locationHighlight4":
      "Пропустите в любой момент — настройте местоположение или уведомления позже",
    "onboarding.locationPrivacyTitle": "Только на вашем устройстве",
    "onboarding.locationPrivacyBody":
      "Ваши координаты остаются на этом устройстве для времени намаза и киблы. Уведомления — локальные напоминания: мы не отслеживаем ваши перемещения и не продаём ваши данные.",
    "onboarding.locationAllow": "Разрешить местоположение и уведомления",
    "onboarding.locationLocating": "Настройка…",
    "onboarding.locationSkip": "Настроить позже",
    "seo.introLocation.title": "Местоположение и напоминания",
    "seo.introLocation.description":
      "Разрешите местоположение и уведомления для точного времени намаза, киблы и необязательных напоминаний — или настройте позже.",
  },
  az: {
    "onboarding.locationEyebrow": "Məkan və xatırlatmalar",
    "onboarding.locationTitle": "Namaz vaxtları və yumşaq xatırlatmalar",
    "onboarding.locationBody":
      "Munib Tracker dəqiq namaz vaxtları və qiblə üçün məkanınızdan istifadə edir və Namaz, Zikr və Qaza üçün istəyə bağlı xatırlatmalar göndərə bilər. Hər ikisini sonra parametrlərdən dəyişə bilərsiniz.",
    "onboarding.locationHighlight1": "Şəhərinizə uyğun namaz vaxtları",
    "onboarding.locationHighlight2": "Olduğunuz yerdən qiblə kompası",
    "onboarding.locationHighlight3": "Namaz, Zikr və Qaza üçün istəyə bağlı xatırlatmalar",
    "onboarding.locationHighlight4":
      "İstədiyiniz vaxt keçin — məkanı və ya bildirişləri sonra qurun",
    "onboarding.locationPrivacyTitle": "Cihazınızda şəxsi",
    "onboarding.locationPrivacyBody":
      "Koordinatlarınız namaz vaxtları və qiblə üçün bu cihazda qalır. Bildirişlər yerli xatırlatmalardır — hərəkətlərinizi izləmirik və məlumatlarınızı satmırıq.",
    "onboarding.locationAllow": "Məkan və bildirişlərə icazə ver",
    "onboarding.locationLocating": "Hazırlanır…",
    "onboarding.locationSkip": "Sonra qur",
    "seo.introLocation.title": "Məkan və xatırlatmalar",
    "seo.introLocation.description":
      "Dəqiq namaz vaxtları, qiblə və istəyə bağlı xatırlatmalar üçün məkan və bildirişlərə icazə verin — və ya sonra qurun.",
  },
  ps: {
    "onboarding.locationEyebrow": "ځای او یادونې",
    "onboarding.locationTitle": "د لمونځ وختونه او نرم یادونې",
    "onboarding.locationBody":
      "Munib Tracker ستاسو ځای د دقیقو لمونځ وختونو او قبلې لپاره کاروي، او د لمونځ، ذکر او قضا لپاره اختیاري یادونې استولی شي. دواړه وروسته په ترتیباتو کې بدلولی شئ.",
    "onboarding.locationHighlight1": "ستاسو ښار ته سم د لمونځ وختونه",
    "onboarding.locationHighlight2": "له ستاسو موقعیت څخه د قبلې قطب‌نما",
    "onboarding.locationHighlight3": "د لمونځ، ذکر او قضا اختیاري یادونې",
    "onboarding.locationHighlight4": "هر وخت پرېږدئ — وروسته ځای یا خبرتیاوې فعال کړئ",
    "onboarding.locationPrivacyTitle": "په ستاسو وسیله کې خصوصي",
    "onboarding.locationPrivacyBody":
      "ستاسو مختصات د لمونځ وختونو او قبلې لپاره په دې وسیله کې پاتې کېږي. خبرتیاوې محلي یادونې دي — موږ ستاسو حرکت نه تعقیبوو او معلومات نه پلورو.",
    "onboarding.locationAllow": "ځای او خبرتیاوو ته اجازه ورکړئ",
    "onboarding.locationLocating": "چمتو کېږي…",
    "onboarding.locationSkip": "وروسته تنظیم کړئ",
    "seo.introLocation.title": "ځای او یادونې",
    "seo.introLocation.description":
      "د دقیقو لمونځ وختونو، قبلې او اختیاري یادونو لپاره ځای او خبرتیاوو ته اجازه ورکړئ — یا وروسته تنظیم کړئ.",
  },
  so: {
    "onboarding.locationEyebrow": "Goobta & xusuusin",
    "onboarding.locationTitle": "Waqtiyada salaadda iyo xusuusin khafiif ah",
    "onboarding.locationBody":
      "Munib Tracker wuxuu isticmaalaa goobtaada waqtiyo sax ah oo salaad iyo qibla ah, wuxuuna diri karaa xusuusin ikhtiyaari ah oo Salaad, Zikr, iyo Qaza. Labadaba waxaad ka beddeli kartaa goor dambe settings-ka.",
    "onboarding.locationHighlight1": "Waqtiyada salaadda ee ku habboon magaaladaada",
    "onboarding.locationHighlight2": "Compass-ka qibla meesha aad taagan tahay",
    "onboarding.locationHighlight3": "Xusuusin ikhtiyaari ah oo Salaad, Zikr, iyo Qaza",
    "onboarding.locationHighlight4": "Ka bood waqti kasta — goobta ama ogeysiisyada dambe deji",
    "onboarding.locationPrivacyTitle": "Gaar ah qalabkaaga",
    "onboarding.locationPrivacyBody":
      "Isku-duweyntaadu waxay ku sii jirtaa qalabkan waqtiyada salaadda iyo qibla. Ogeysiisyadu waa xusuusin maxalli ah — ma raadino dhaqdhaqaaqaaga mana iibino xogtaada.",
    "onboarding.locationAllow": "Oggolow goobta & ogeysiisyada",
    "onboarding.locationLocating": "Waa la diyaarinayaa…",
    "onboarding.locationSkip": "Dambe deji",
    "seo.introLocation.title": "Goobta & xusuusin",
    "seo.introLocation.description":
      "Oggolow goobta iyo ogeysiisyada waqtiyo sax ah oo salaad, qibla, iyo xusuusin ikhtiyaari ah — ama dambe deji.",
  },
  uz: {
    "onboarding.locationEyebrow": "Joylashuv va eslatmalar",
    "onboarding.locationTitle": "Namoz vaqtlari va yumshoq eslatmalar",
    "onboarding.locationBody":
      "Munib Tracker aniq namoz vaqtlari va qibla uchun joylashuvingizdan foydalanadi va Namoz, Zikr va Qazo uchun ixtiyoriy eslatmalar yuborishi mumkin. Ikkalasini ham keyin sozlamalardan o‘zgartirish mumkin.",
    "onboarding.locationHighlight1": "Shahringizga mos namoz vaqtlari",
    "onboarding.locationHighlight2": "Turgan joyingizdan qibla kompasi",
    "onboarding.locationHighlight3": "Namoz, Zikr va Qazo uchun ixtiyoriy eslatmalar",
    "onboarding.locationHighlight4":
      "Istalgan vaqtda o‘tkazing — joylashuv yoki bildirishnomalarni keyin sozlang",
    "onboarding.locationPrivacyTitle": "Qurilmangizda shaxsiy",
    "onboarding.locationPrivacyBody":
      "Koordinatalaringiz namoz vaqtlari va qibla uchun shu qurilmada qoladi. Bildirishnomalar mahalliy eslatmalar — harakatlaringizni kuzatmaymiz va ma’lumotlaringizni sotmaymiz.",
    "onboarding.locationAllow": "Joylashuv va bildirishnomalarga ruxsat bering",
    "onboarding.locationLocating": "Tayyorlanmoqda…",
    "onboarding.locationSkip": "Keyin sozlash",
    "seo.introLocation.title": "Joylashuv va eslatmalar",
    "seo.introLocation.description":
      "Aniq namoz vaqtlari, qibla va ixtiyoriy eslatmalar uchun joylashuv va bildirishnomalarga ruxsat bering — yoki keyin sozlang.",
  },
  kk: {
    "onboarding.locationEyebrow": "Орналасу және еске салғыштар",
    "onboarding.locationTitle": "Намаз уақыттары және жұмсақ еске салғыштар",
    "onboarding.locationBody":
      "Munib Tracker дәл намаз уақыттары мен қыбла үшін орналасуыңызды пайдаланады және Намаз, Зікір мен Қаза үшін қосымша еске салғыштар жібере алады. Екеуін де кейін параметрлерден өзгертуге болады.",
    "onboarding.locationHighlight1": "Қалаңызға сай намаз уақыттары",
    "onboarding.locationHighlight2": "Тұрған жеріңізден қыбла компасы",
    "onboarding.locationHighlight3": "Намаз, Зікір және Қаза үшін қосымша еске салғыштар",
    "onboarding.locationHighlight4":
      "Кез келген уақытта өткізіп жіберіңіз — орналасуды немесе хабарландыруларды кейін баптаңыз",
    "onboarding.locationPrivacyTitle": "Құрылғыңызда құпия",
    "onboarding.locationPrivacyBody":
      "Координаттарыңыз намаз уақыттары мен қыбла үшін осы құрылғыда қалады. Хабарландырулар — жергілікті еске салғыштар: қозғалысыңызды бақыламаймыз және деректеріңізді сатпаймыз.",
    "onboarding.locationAllow": "Орналасу мен хабарландыруларға рұқсат беру",
    "onboarding.locationLocating": "Дайындалуда…",
    "onboarding.locationSkip": "Кейін баптау",
    "seo.introLocation.title": "Орналасу және еске салғыштар",
    "seo.introLocation.description":
      "Дәл намаз уақыттары, қыбла және қосымша еске салғыштар үшін орналасу мен хабарландыруларға рұқсат беріңіз — немесе кейін баптаңыз.",
  },
  ku: {
    "onboarding.locationEyebrow": "Cih û bîranîn",
    "onboarding.locationTitle": "Demên nimêjê û bîranînên nerm",
    "onboarding.locationBody":
      "Munib Tracker cihê te ji bo demên nimêjê û qiblê yên rast bikar tîne, û dikare bîranînên vebijarkî ji bo Nimêj, Zikr û Qaza bişîne. Herdu jî paşê di mîhengan de diguherînin.",
    "onboarding.locationHighlight1": "Demên nimêjê li gorî bajarê te",
    "onboarding.locationHighlight2": "Kompasa qiblê ji cihê te",
    "onboarding.locationHighlight3": "Bîranînên vebijarkî ji bo Nimêj, Zikr û Qaza",
    "onboarding.locationHighlight4": "Her dem derbas bike — cih an agahdariyan paşê saz bike",
    "onboarding.locationPrivacyTitle": "Taybet li ser amûra te",
    "onboarding.locationPrivacyBody":
      "Koordinatên te ji bo demên nimêjê û qiblê li ser vê amûrê dimînin. Agahdarî bîranînên herêmî ne — em tevgera te nagrin û daneyên te nafiroşin.",
    "onboarding.locationAllow": "Destûrê bide cih û agahdariyan",
    "onboarding.locationLocating": "Tê amadekirin…",
    "onboarding.locationSkip": "Paşê saz bike",
    "seo.introLocation.title": "Cih û bîranîn",
    "seo.introLocation.description":
      "Ji bo demên nimêjê yên rast, qiblê û bîranînên vebijarkî destûrê bide cih û agahdariyan — an paşê saz bike.",
  },
  bs: {
    "onboarding.locationEyebrow": "Lokacija i podsjetnici",
    "onboarding.locationTitle": "Vremena namaza i blagi podsjetnici",
    "onboarding.locationBody":
      "Munib Tracker koristi vašu lokaciju za tačna vremena namaza i kible, te može slati opcionalne podsjetnike za namaz, zikr i kazu. Oboje možete kasnije promijeniti u postavkama.",
    "onboarding.locationHighlight1": "Vremena namaza prema vašem gradu",
    "onboarding.locationHighlight2": "Kompas kible s vaše pozicije",
    "onboarding.locationHighlight3": "Opcionalni podsjetnici za namaz, zikr i kazu",
    "onboarding.locationHighlight4":
      "Preskočite bilo kada — lokaciju ili obavještenja podesite kasnije",
    "onboarding.locationPrivacyTitle": "Privatno na vašem uređaju",
    "onboarding.locationPrivacyBody":
      "Vaše koordinate ostaju na ovom uređaju za vremena namaza i kible. Obavještenja su lokalni podsjetnici — ne pratimo vaše kretanje niti prodajemo vaše podatke.",
    "onboarding.locationAllow": "Dozvoli lokaciju i obavještenja",
    "onboarding.locationLocating": "Priprema…",
    "onboarding.locationSkip": "Podesi kasnije",
    "seo.introLocation.title": "Lokacija i podsjetnici",
    "seo.introLocation.description":
      "Dozvolite lokaciju i obavještenja za tačna vremena namaza, kible i opcionalne podsjetnike — ili podesite kasnije.",
  },
  sq: {
    "onboarding.locationEyebrow": "Vendndodhja dhe rikujtimet",
    "onboarding.locationTitle": "Oraret e namazit dhe rikujtime të buta",
    "onboarding.locationBody":
      "Munib Tracker përdor vendndodhjen tuaj për orare të sakta namazi dhe kiblë, dhe mund të dërgojë rikujtime opsionale për Namaz, Zikr dhe Kaza. Të dyja mund t’i ndryshoni më vonë te cilësimet.",
    "onboarding.locationHighlight1": "Orare namazi të përshtatura me qytetin tuaj",
    "onboarding.locationHighlight2": "Busulla e kiblës nga vendi ku jeni",
    "onboarding.locationHighlight3": "Rikujtime opsionale për Namaz, Zikr dhe Kaza",
    "onboarding.locationHighlight4":
      "Anashkaloje kur të duash — vendose vendndodhjen ose njoftimet më vonë",
    "onboarding.locationPrivacyTitle": "Private në pajisjen tuaj",
    "onboarding.locationPrivacyBody":
      "Koordinatat tuaja mbeten në këtë pajisje për oraret e namazit dhe kiblën. Njoftimet janë rikujtime lokale — nuk ndjekim lëvizjet tuaja dhe nuk shesim të dhënat tuaja.",
    "onboarding.locationAllow": "Lejo vendndodhjen dhe njoftimet",
    "onboarding.locationLocating": "Duke u përgatitur…",
    "onboarding.locationSkip": "Vendos më vonë",
    "seo.introLocation.title": "Vendndodhja dhe rikujtimet",
    "seo.introLocation.description":
      "Lejoni vendndodhjen dhe njoftimet për orare të sakta namazi, kiblë dhe rikujtime opsionale — ose vendosini më vonë.",
  },
  ky: {
    "onboarding.locationEyebrow": "Жайгашуу жана эскертүүлөр",
    "onboarding.locationTitle": "Намаз убакыттары жана жумшак эскертүүлөр",
    "onboarding.locationBody":
      "Munib Tracker так намаз убакыттары жана кыбла үчүн жайгашууңузду колдонот жана Намаз, Зикр жана Каза үчүн кошумча эскертүүлөрдү жөнөтө алат. Экөөнү тең кийин жөндөөлөрдөн өзгөртсөңүз болот.",
    "onboarding.locationHighlight1": "Шаарыңызга ылайык намаз убакыттары",
    "onboarding.locationHighlight2": "Турган жериңизден кыбла компасы",
    "onboarding.locationHighlight3": "Намаз, Зикр жана Каза үчүн кошумча эскертүүлөр",
    "onboarding.locationHighlight4":
      "Каалаган убакта өткөрүп жибериңиз — жайгашууну же билдирмелерди кийин жөндөңүз",
    "onboarding.locationPrivacyTitle": "Түзмөгүңүздө жекече",
    "onboarding.locationPrivacyBody":
      "Координаттарыңыз намаз убакыттары жана кыбла үчүн ушул түзмөктө калат. Билдирмелер — жергиликтүү эскертүүлөр: кыймылыңызды көзөмөлдөбөйбүз жана маалыматыңызды сатпайбыз.",
    "onboarding.locationAllow": "Жайгашуу жана билдирмелерге уруксат берүү",
    "onboarding.locationLocating": "Даярдалууда…",
    "onboarding.locationSkip": "Кийин жөндөө",
    "seo.introLocation.title": "Жайгашуу жана эскертүүлөр",
    "seo.introLocation.description":
      "Так намаз убакыттары, кыбла жана кошумча эскертүүлөр үчүн жайгашуу менен билдирмелерге уруксат бериңиз — же кийин жөндөңүз.",
  },
  tg: {
    "onboarding.locationEyebrow": "Ҷойгиршавӣ ва ёдраскуниҳо",
    "onboarding.locationTitle": "Вақтҳои намоз ва ёдраскуниҳои нарм",
    "onboarding.locationBody":
      "Munib Tracker ҷойгиршавии шуморо барои вақтҳои дақиқи намоз ва қибла истифода мебарад ва метавонад ёдраскуниҳои ихтиёрӣ барои Намоз, Зикр ва Қазо фиристад. Ҳар дуро дертар дар танзимот тағйир додан мумкин аст.",
    "onboarding.locationHighlight1": "Вақтҳои намоз мувофиқи шаҳри шумо",
    "onboarding.locationHighlight2": "Қутбнамои қибла аз ҷои шумо",
    "onboarding.locationHighlight3": "Ёдраскуниҳои ихтиёрӣ барои Намоз, Зикр ва Қазо",
    "onboarding.locationHighlight4":
      "Ҳар вақт гузаред — ҷойгиршавӣ ё огоҳиномаҳоро дертар танзим кунед",
    "onboarding.locationPrivacyTitle": "Хусусӣ дар дастгоҳи шумо",
    "onboarding.locationPrivacyBody":
      "Координатҳои шумо барои вақтҳои намоз ва қибла дар ҳамин дастгоҳ мемонанд. Огоҳиномаҳо ёдраскуниҳои маҳаллӣ ҳастанд — ҳаракати шуморо пайгирӣ намекунем ва маълумотро намефурӯшем.",
    "onboarding.locationAllow": "Иҷозати ҷойгиршавӣ ва огоҳиномаҳо",
    "onboarding.locationLocating": "Омода мешавад…",
    "onboarding.locationSkip": "Дертар танзим кунед",
    "seo.introLocation.title": "Ҷойгиршавӣ ва ёдраскуниҳо",
    "seo.introLocation.description":
      "Барои вақтҳои дақиқи намоз, қибла ва ёдраскуниҳои ихтиёрӣ ба ҷойгиршавӣ ва огоҳиномаҳо иҷозат диҳед — ё дертар танзим кунед.",
  },
  tk: {
    "onboarding.locationEyebrow": "Ýerleşiş we ýatladyjylar",
    "onboarding.locationTitle": "Namaz wagtlary we ýumşak ýatladyjylar",
    "onboarding.locationBody":
      "Munib Tracker takyk namaz wagtlary we gyla üçin ýerleşişiňizi ulanýar we Namaz, Zikr we Kaza üçin islege bagly ýatladyjylary iberip biler. Ikisini hem soň sazlamalardan üýtgedip bilersiňiz.",
    "onboarding.locationHighlight1": "Şäheriňize laýyk namaz wagtlary",
    "onboarding.locationHighlight2": "Durýan ýeriňizden gyla kompasy",
    "onboarding.locationHighlight3": "Namaz, Zikr we Kaza üçin islege bagly ýatladyjylar",
    "onboarding.locationHighlight4":
      "Islän wagtyňyz geçiriň — ýerleşişi ýa-da bildirişleri soň sazlaň",
    "onboarding.locationPrivacyTitle": "Enjamyňyzda şahsy",
    "onboarding.locationPrivacyBody":
      "Koordinatalaryňyz namaz wagtlary we gyla üçin şu enjamda galýar. Bildirişler ýerli ýatladyjylar — hereketleriňizi yzarlamaýarys we maglumatlaryňyzy satmaýarys.",
    "onboarding.locationAllow": "Ýerleşişe we bildirişlere rugsat beriň",
    "onboarding.locationLocating": "Taýýarlanýar…",
    "onboarding.locationSkip": "Soň sazla",
    "seo.introLocation.title": "Ýerleşiş we ýatladyjylar",
    "seo.introLocation.description":
      "Takyk namaz wagtlary, gyla we islege bagly ýatladyjylar üçin ýerleşişe we bildirişlere rugsat beriň — ýa-da soň sazlaň.",
  },
};

function setByPath(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!(p in cur) || typeof cur[p] !== "object" || cur[p] === null) cur[p] = {};
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
}

const patches = JSON.parse(readFileSync(PATCHES_PATH, "utf8"));
let catalogCount = 0;
let patchCount = 0;

for (const [loc, strings] of Object.entries(TRANSLATIONS)) {
  const file = join(I18N_DIR, `${loc}.json`);
  const catalog = JSON.parse(readFileSync(file, "utf8"));
  for (const [key, value] of Object.entries(strings)) {
    setByPath(catalog, key, value);
    catalogCount++;
  }
  writeFileSync(file, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

  if (!patches[loc]) patches[loc] = {};
  Object.assign(patches[loc], strings);
  patchCount += Object.keys(strings).length;
}

writeFileSync(PATCHES_PATH, `${JSON.stringify(patches, null, 2)}\n`, "utf8");
console.log(
  `Applied ${catalogCount} catalog strings across ${Object.keys(TRANSLATIONS).length} locales; synced ${patchCount} polish patch entries.`,
);
