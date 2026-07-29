import type { PilgrimageChecklistItem } from "../../types/hajj-guide";
import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// UZ overlay for Hajj & Umrah Learn topics + rite checklists.
// Index-aligned with English sources; only human-readable text is translated.

export const HAJJ_GUIDE_TOPICS_UZ: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Qabul qilingan haj mukofoti",
    summary: "Haj mabrur gunohlarni yo'q qiladi, mukofoti jannatdir.",
    body: [
      "Abu Hurayra rivoyat qilganidek, Rasululloh ﷺ shunday dedi: «Kim Alloh uchun haj qilsa va jinsiy aloqa ham, gunoh ham qilmasa, onasi uni tug'ilgan kunidagi kabi qaytadi» (Sahih al-Bukhari 1521; Sahih Muslim 1350).",
      "U yana dedi: «Qabul qilingan haj (haj mabrur)ning mukofoti jannatdan boshqa narsa emas» (Sahih al-Bukhari 1773; Sahih Muslim 1349). Qabul qilinishi samimiyat va hajni fohisha va gunohdan asrash bilan bog'liq — faqat tashqi amallarni bajarish bilan emas.",
    ],
    hadith: [
      {
        excerpt:
          "Kim Alloh uchun haj qilsa va jinsiy aloqa ham, gunoh ham qilmasa, onasi uni tug'ilgan kunidagi kabi qaytadi.",
      },
      {
        excerpt:
          "Kim Alloh uchun haj qilsa va jinsiy aloqa ham, gunoh ham qilmasa, onasi uni tug'ilgan kunidagi kabi qaytadi.",
      },
      { excerpt: "Qabul qilingan hajning mukofoti jannatdan boshqa narsa emas." },
      { excerpt: "Qabul qilingan hajning mukofoti jannatdan boshqa narsa emas." },
    ],
    actions: [
      "Hajni faqat Alloh uchun niyat qiling — butun safarda til va xulq-atvoringizni asrang.",
      "Ilovadagi haj ro'yxatidan faqat eslatma sifatida foydalaning; qalbingizni qabul qilinishga qaratib turing.",
    ],
    appLinks: [{ label: "Haj marosimlari ro'yxati" }],
  },
  {
    title: "Umra fazilati",
    summary: "Umradan umragacha bo'lgan gunohlar kefforat bo'ladi.",
    body: [
      "Abu Hurayra rivoyat qilganidek, Payg'ambar ﷺ dedi: «Umra qilish avvalgisidan keyingi gunohlarga kefforatdir, qabul qilingan hajning mukofoti esa jannatdan boshqa narsa emas» (Sahih al-Bukhari 1773; Sahih Muslim 1349).",
      "Umra yilning istalgan vaqtida bajariladi. Hajdan qisqaroq, lekin baribir katta ibodat: ihram, tavof, sa'y va soch olish yoki qisqartirish.",
    ],
    hadith: [
      {
        excerpt:
          "Umra qilish avvalgisidan keyingi gunohlarga kefforatdir, qabul qilingan hajning mukofoti esa jannatdan boshqa narsa emas.",
      },
      {
        excerpt:
          "Umra qilish avvalgisidan keyingi gunohlarga kefforatdir, qabul qilingan hajning mukofoti esa jannatdan boshqa narsa emas.",
      },
    ],
    actions: ["Marosimlarni tartib bilan bajarishga tayyor bo'lganingizda umra ro'yxatini oching."],
    appLinks: [{ label: "Umra marosimlari ro'yxati" }],
  },
  {
    title: "Arofa kuni",
    summary: "Arofada turish hajning qalbidir — va duo uchun buyuk kun.",
    body: [
      "Abdurrahmon ibn Ya'mar rivoyat qilganidek, Payg'ambar ﷺ dedi: «Haj — Arofa» (Sunan Abi Dawud 1949; Jami' at-Tirmidhi 889). Arofa chegarasida o'z vaqtida turishni qoldirgan o'sha yil hajini qoldirgan bo'ladi.",
      "Hajda bo'lmaganlar uchun Arofa kunida ro'za tutish qattiq tavsiya etiladi: Abu Qatoda rivoyat qilganidek, Arofa ro'zasi o'tgan va kelgusi yil gunohlarini kefforat qiladi (Sahih Muslim 1162). Hojilar esa duo uchun kunning o'ziga berilib, ro'za tutmaydi.",
    ],
    hadith: [
      { excerpt: "Haj — Arofa." },
      { excerpt: "Haj — Arofa." },
      {
        excerpt:
          "Arofa kunida ro'za tutish — Allohdan o'tgan va kelgusi yil gunohlarini kefforat qilishni umid qilaman.",
      },
    ],
  },
  {
    title: "Haj — beshinchi rukn",
    summary: "Hayotida bir marta har qanday qodir muslimga farz.",
    body: [
      "Alloh aytdi: «Odamlarga Uydan (Ka'ba) haj farz — yo'l topa oladigan har bir kishi uchun. Kim kufr qilsa — Alloh olamlardan g'oniydir» (Qur'on 3:97).",
      "Odamlarga haj e'lon qilindi: «Odamlarga haj e'lon qil; ular piyoda va har xil otliq bilan senga keladi; har uzoq yo'l bo'ylab keladi» (Qur'on 22:27).",
      "Ibn Umar rivoyat qilganidek, Payg'ambar ﷺ dedi: Islom beshta asosga qurilgan: shohodat, namoz, zakat, Ramazon ro'zasi va qodir bo'lganlar uchun Uyga haj (Sahih al-Bukhari 8; Sahih Muslim 16). Ulama shartlar bajarilganda hayotda bir marta farz ekaniga kelishdi; takrorlash ixtiyoriy fazilatdir.",
    ],
    quran: [
      { excerpt: "Odamlarga Uydan haj farz — yo'l topa oladigan har bir kishi uchun..." },
      { excerpt: "Odamlarga haj e'lon qil; ular piyoda va har xil otliq bilan senga keladi..." },
    ],
    hadith: [
      {
        excerpt:
          "Islom beshta asosga qurilgan: Allohdan boshqa iloh yo'q va Muhammad Allohning Rasuli, namoz o'qish, zakat berish, Ramazon ro'zasi va yo'l topa oladiganlar uchun Uyga haj.",
      },
      { excerpt: "Islom beshta asosga qurilgan... va yo'l topa oladiganlar uchun Uyga haj." },
    ],
  },
  {
    title: "Istito'at (qodirlik)",
    summary: "Salomatlik, halol mol va xavfsiz yo'l — bularsiz haj hali farz emas.",
    body: [
      "Qur'on 3:97 dagi shart istito'atdir. Klassik ulama buni quyidagicha jamlaydi: safarga chidamli jismoniy salomatlik, safar va yo'q paytda qaramog'idagilar ehtiyojlarini qoplash uchun yetarli halol mol, va xavfsiz ochiq yo'l.",
      "Bu yil bu imkoniyatlardan mahrum bo'lgan kechiktirish uchun gunohkor emas, qodir bo'lguncha kutishi mumkin. Istito'at holat bo'yicha baholanadi — kasallik, to'lanishi shart bo'lgan qarz yoki xavfsiz bo'lmagan safar darhol farzni olib tashlashi mumkin. Vaziyatingiz noaniq bo'lsa, malakali olimdan so'rang.",
    ],
    quran: [{ excerpt: "...yo'l topa oladigan har bir kishi uchun." }],
    actions: [
      "Bron qilishdan oldin farz qarzlarni to'lang va qaramog'idagilar ta'minotini tartibga soling.",
      "Paketlarni faqat rasmiy kanallar orqali tekshiring (tayyorgarlik mavzulariga qarang).",
    ],
  },
  {
    title: "Ayolning haj safar",
    summary:
      "Ko'pchilik mahram talab qiladi; ba'zi keyingi fikrlar xavfsiz ishonchli guruhga ruxsat beradi.",
    body: [
      "Ibn Abbos rivoyat qilganidek, Payg'ambar ﷺ dedi: ayol mahramsiz safar qilmasin, erkak ham mahram bo'lmaguncha unga kirmasin (Sahih al-Bukhari 1862; Sahih Muslim 1341). Ko'p ulama buni haj va umra safariga qo'llaydi.",
      "Ba'zi keyingi ulama — xavfsizlik, zarurat va zamonaviy transportni hisobga olib — mahram bo'lmaganda ayolga farz haj uchun ishonchli guruhda safar qilishga ruxsat beradi. Bu hali fiqh masalasida bahsli.",
    ],
    hadith: [
      { excerpt: "Ayol mahramsiz safar qilmasin, erkak ham mahram bo'lmaguncha unga kirmasin." },
      {
        excerpt:
          "Alloh va Oxirat kuniga iymon keltirgan ayolga bir kun va tun mahramsiz safar qilish halol emas.",
      },
    ],
    madhhabNote:
      "Ko'pchilik ayol haj safarida mahram kerak deb hisoblaydi. Ba'zi keyingi ulama farz haj uchun xavfsiz ayollar guruhi bilan safarga ruxsat beradi. Ishonadigan olimingiz va haj idorasi qoidalariga amal qiling.",
  },
  {
    title: "Hajning uch turi",
    summary: "Ifrod, Qiron va Tamattu' — ihramga kirishdan oldin turini tanlang.",
    body: [
      "Ifrod: faqat haj uchun ihram, shu ihramda alohida umra yo'q, marosimlarni birlashtirish tufayli qurbonlik talab qilinmaydi.",
      "Qiron: umra va hajni bir ihramda birlashtirish, haj tugaguncha ihramda qolish. Qurbonlik (hady) talab qilinadi.",
      "Tamattu': haj oylarida to'liq umra bajarish, ihramdan chiqish, keyin 8 zul-hijjada haj uchun qayta ihram. Bugun ko'pchilik hojilar shuni qiladi; bu ham hady talab qiladi.",
      "Alloh marosimlarni birlashtirganlar haqida aytdi: «...Kim umradan hajga foydalanib foydalansa, oson topiladigan qurbon hayvonlari...» topa olmaganlar hajda uch kun, qaytganida yetti kun ro'za tutadi (Qur'on 2:196).",
    ],
    quran: [
      {
        excerpt:
          "Haj va umrani Alloh uchun to'liq bajaring... Kim umradan hajga foydalanib foydalansa, oson topiladigan qurbon hayvonlari. Topa olmagan — hajda uch kun, qaytganingizda yetti kun ro'za...",
      },
    ],
    actions: [
      "Miqotdan oldin guruh rahbaringiz bilan turini hal qiling.",
      "Tamattu' qilsangiz, haj uchun qayta ihramdan oldin umrani to'liq bajaring.",
    ],
    appLinks: [{ label: "Umra ro'yxati" }, { label: "Haj ro'yxati" }],
  },
  {
    title: "Beshta miqot",
    summary: "Haj yoki umra uchun ihram kirmasdan Makkaga yo'l oladigan miqotni kesib o'tmang.",
    body: [
      "Ibn Abbos rivoyat qilganidek, Payg'ambar ﷺ odamlar uchun miqotlarni belgiladi: Madina uchun Zul-Hulayfa, Sham uchun Al-Juhfa, Najd uchun Qarn al-Manazil, Yemen uchun Yalamlam; va Iroq uchun Zat 'Irq. U dedi: bular o'sha joylar aholisi va ulardan haj yoki umra niyatida o'tadiganlar uchun; chegaralar ichida yashovchi esa qayerdan yo'l olsa shu joydan ihram kiritadi, hatto Makka aholisi Makkadan (Sahih al-Bukhari 1524; Sahih Muslim 1181).",
      "Zamonaviy aeroport va portlarda mos ihram nuqtalari yoki e'lon qilingan tartiblar bor — tashuvchi va Haj va Umra vazirligi ko'rsatmalariga amal qiling, chegarani ihramsiz o'tmang.",
    ],
    hadith: [
      {
        excerpt:
          "Rasululloh ﷺ Madina aholisi uchun Zul-Hulayfa, Sham aholisi uchun Al-Juhfa, Najd aholisi uchun Qarn al-Manazil, Yemen aholisi uchun Yalamlam belgiladi... Bu miqotlar o'sha joylar va haj yoki umra niyatida ulardan o'tadiganlar uchun...",
      },
      {
        excerpt:
          "Rasululloh ﷺ miqotlarni belgiladi... Chegaralar ichida yashovchi qayerdan yo'l olsa shu joydan ihram kiritadi...",
      },
    ],
  },
  {
    title: "Ihramga kirish",
    summary: "G'usl, kiyim, niyat va talbiya muqaddas holatni boshlaydi.",
    body: [
      "Ihram haj yoki umra niyati bilan kiriladigan muqaddas holat. Payg'ambar ﷺ ihramdan oldin g'usl qilishni tavsiya qilgan. Erkaklar ikkita tikilmagan oq mato kiyadi; ayol oddiy yopiq kiyimda qoladi, yuzni yopmasin yoki ihram kiyimi sifatida qo'l qopqoqlarini kiymasin (niqob va qo'l qopqoqlari fiqh masalasi).",
      "Erkak ihramdan oldin tanasiga atir surtishi mumkin, holatga kirgandan keyin ihram matolariga emas (Sahih al-Bukhari 1539). Keyin niyat qiling va talbiyani boshlang.",
      "Payg'ambar ﷺ o'rgatgan talbiya: «Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak» — umra tavof boshlanguncha yoki hajda mashhur amal bo'yicha Jamrat al-Aqaba tosh tashlanguncha (Sahih al-Bukhari 1549; Sahih Muslim 1184).",
    ],
    hadith: [
      { excerpt: "Oyisha dedi: Men Rasululloh ﷺ ni ihramdan oldin atir surtardim..." },
      {
        excerpt:
          "Labbayk Allahumma labbayk, labbayka la sharika laka labbayk, inna al-hamda wan-ni'mata laka wal-mulk, la sharika lak.",
      },
      { excerpt: "Payg'ambar ﷺ talbiyani baland ovozda aytdi: Labbayk Allahumma labbayk..." },
    ],
    actions: [
      "Erkaklar uchun kamida ikki to'plam ihram oling; atirsiz toza vositalarni tayyorlang.",
      "Safardan oldin talbiyani mashq qiling, yo'lda oson aytish uchun.",
    ],
  },
  {
    title: "Ihram taqiqlari",
    summary: "Muhrim muqaddas holatdan chiqgunga qadar nimalardan saqlanishi kerak.",
    body: [
      "Ihramda quyidagilardan saqlaning: erkaklar — tikilgan mos kiyim va bosh yopish; atir; soch yoki tirnoq kesish; yer hayvonini ov qilish; nikoh tuzish yoki o'tkazish; jinsiy aloqa. Ayol atir va boshqa umumiy taqiqlardan saqlanadi, yopiq kiyimda qoladi.",
      "Taqiqni buzish fidya talab qilishi mumkin — odatda ro'za, kambag'allarni ovqatlantirish yoki qurbonlik — qilingan ishga qarab. Mazhablar tafsilotlarni farq qiladi. Taqiqlarga qattiq rioya qiling; kutilmagan holat bo'lsa, malakali yo'riqnoma so'rang.",
    ],
    actions: ["Ihramda atir, tirnoq qirqgich va qaychi qo'l ostida bo'lmasin."],
    madhhabNote:
      "Buzilishlar va fidya ro'yxatlari mazhab bo'yicha farq qiladi. Buni amaliy ogohlantirish deb oling, keyin mazhabingiz yoki haj yo'riqnomasi bilan tafsilotni tasdiqlang.",
  },
  {
    title: "Umra — ihram va talbiya",
    summary:
      "Miqotda yoki undan oldin muqaddas holatga kiring, keyin Alloh chaqirig'iga javob bering.",
    body: [
      "Miqotda yoki undan oldin, imkon bo'lsa g'usl qiling, ihram kiyimini kiying, umra niyatini qiling va talbiyani boshlang. Muqaddas holat shu niyat bilan boshlanadi.",
      "Makkaga yo'l olayotganda tavof boshlanguncha talbiyani tez-tez takrorlang. Bu Alloh chaqirig'iga yolg'iz javob berish ekaningizni bildiradi.",
    ],
    actions: ["Har bir marosimni bajarganda belgilash uchun umra ro'yxatidan foydalaning."],
    appLinks: [{ label: "Umra ro'yxati" }],
  },
  {
    title: "Ka'ba tavofi",
    summary: "Qora Tosh burchagidan boshlab soat yo'nalishiga qarshi yetti aylana.",
    body: [
      "Ka'bani yetti marta soat yo'nalishiga qarshi aylaning, Qora Tosh burchagidan boshlab va tugatib. Olomon bo'lsa busang, tegish yoki takbir bilan ishora qiling — Payg'ambar ﷺ amaliga amal qilib, boshqalarga zarar yetkazmang.",
      "Erkaklar birinchi uch aylanada raml (tez qadam) va bu kelish umra tavofida idtiba' (o'ng yelka ochiq) qiladi, mashhur sunnat bo'yicha.",
      "Yaman burchagi va Qora Tosh orasida aytilishi tavsiya etiladi: «Rabbimiz, bizga dunyoda yaxshilik va oxiratda yaxshilik ber, do'zax azobidan asra» (Qur'on 2:201).",
    ],
    quran: [
      {
        excerpt:
          "Rabbimiz, bizga dunyoda yaxshilik va oxiratda yaxshilik ber, do'zax azobidan asra.",
      },
    ],
  },
  {
    title: "Ikki rakat va Zamzam",
    summary: "Imkon bo'lsa Maqom Ibrohim ortida namoz o'qing, keyin Zamzam iching.",
    body: [
      "Tavofdan keyin, joy bo'lsa Maqom Ibrohim ortida ikki rakat o'qing, olomon bo'lsa masjidning boshqa joyida — Alloh so'ziga amal: «...Ey iymon keltirganlar, Ibrohim turgan joydan namoz o'qish joyi qiling...» (Qur'on 2:125).",
      "Keyin Zamzam suvini iching. Jabirning Payg'ambar ﷺ haj tasvirida tavofdan keyin Zamzam ichish bor; Payg'ambar ﷺ dedi Zamzam niyat qilingan narsa uchun ichiladi (keyingi ulama to'plagan sahih rivoyatlar; niyat va duo tavsiya etiladi).",
    ],
    quran: [
      { excerpt: "...Ey iymon keltirganlar, Ibrohim turgan joydan namoz o'qish joyi qiling..." },
    ],
  },
  {
    title: "Safa va Marva orasida sa'y",
    summary: "Hojar suv izlashini yodga olgan yetti saf.",
    body: [
      "Alloh aytdi: «Albatta, Safa va Marva Allohning alomatlaridandir. Kim Uyga haj yoki umra qilsa — ular orasida yurishida gunoh yo'q...» (Qur'on 2:158).",
      "Safa va Marva orasida yetti marta yuring, Safadan boshlab. Safada Ka'baga qarab, Payg'ambar ﷺ qilganidek qo'llarni takbir va duo uchun ko'taring. Erkaklar yashil belgilar orasida yuguradi.",
    ],
    quran: [
      {
        excerpt:
          "Albatta, Safa va Marva Allohning alomatlaridandir. Kim Uyga haj yoki umra qilsa — ular orasida yurishida gunoh yo'q...",
      },
    ],
  },
  {
    title: "Halq yoki taqsir — umrani tugatish",
    summary:
      "Erkaklar qirqadi yoki qisqartiradi; ayollar barmoq uchi qadar qisqartiradi — keyin ihram ochiladi.",
    body: [
      "Erkak boshni halq qiladi — Payg'ambar ﷺ uch marta duo qildi — yoki teng qisqartiradi (taqsir). Ayol sochlarini yig'ib barmoq uchi qadar qisqartiradi. Shunda umra tugaydi va ihram cheklovlari ochiladi.",
      "Abdulloh ibn Umar rivoyat qilganidek, Rasululloh ﷺ dedi: «Allohim, qirqilganlarga rahm qil». Dedilar: «Qisqartirilganlarga ham, ey Rasululloh?» Dedilar: «Allohim, qirqilganlarga rahm qil». Yana dedilar: «Qisqartirilganlarga ham?» Uchinchi marta dedi: «Va qisqartirilganlarga» (Sahih al-Bukhari 1727; Sahih Muslim 1301).",
    ],
    hadith: [
      { excerpt: "Allohim, qirqilganlarga rahm qil... uchinchi marta: va qisqartirilganlarga." },
      {
        excerpt:
          "Allohim, qirqilganlarni kefforat qil... uchinchi marta dedi: va qisqartirilganlarni.",
      },
    ],
  },
  {
    title: "8 zul-hijja — Tarviya kuni",
    summary: "Haj uchun ihram kiring va kunni Mina'da o'tkazing.",
    body: [
      "Tamattu' hojilar: haj niyatini qiling va Makkadagi turar joyingizdan qayta ihram kiring, talbiyani yangilang. Ifrod va Qiron hojilar allaqachon ihramda.",
      "Mina'ga boring va Zuhur, Asr, Mag'rib, Isha va keyingi Fajrni har biri o'z vaqtida ikki rakatga qisqartirib o'qing, Jabir rivoyat qilgan Veda haj amaliga amal (Sahih Muslim 1218). Kun va tunni ibodatda, Arofani kutib o'tkazing.",
    ],
    hadith: [
      {
        excerpt:
          "Jabirning Payg'ambar ﷺ Veda hajining uzoq rivoyati — Mina'da tunash va marosimlar ketma-ketligi.",
      },
    ],
    actions: ["8-kun ertalab haj ro'yxatini oching."],
    appLinks: [{ label: "Haj ro'yxati" }],
  },
  {
    title: "9 zul-hijja — Arofa kuni",
    summary: "Quyosh botgunga qadar Arofa ichida turing; keyin Muzdalifaga o'ting.",
    body: [
      "Arofa chegarasida tushdan keyin quyosh botgunga qadar duo, zikr va tavbada qoling. Payg'ambar ﷺ dedi «Haj — Arofa» (Sunan Abi Dawud 1949). Qiblaga qarab, qo'llarni ko'taring va Allohdan iltijo qiling — duo uchun eng buyuk vaqtlardan.",
      "Zuhur va Asrni Zuhur vaqtida birlashtirib qisqartirib o'qing (jam' taqdim), qolgan kunni ixtiyoriy namoz o'rniga duoga bag'ishlang — Payg'ambar ﷺ amali (Sahih Muslim 1218).",
      "Quyosh botgach, tinch Muzdalifaga boring. Mag'rib va Ishani birlashtiring (Isha qisqartirilgan), tunni dam oling va tosh tashlash uchun toshlar yig'ing. Zaiflar va ayollar mashhur sunnat ruxsati bilan yarim tundan keyin Mina'ga ketishi mumkin.",
    ],
    hadith: [
      { excerpt: "Haj — Arofa." },
      {
        excerpt:
          "Payg'ambar ﷺ Arofada Zuhur va Asrni birlashtirdi, keyin quyosh botgach Muzdalifaga yo'l oldi...",
      },
    ],
  },
  {
    title: "10 zul-hijja — Nahru kuni",
    summary: "Tosh tashlash, qurbonlik, soch va Tavof al-Ifoda.",
    body: [
      "Mina tomonga qayting va Jamrat al-Aqaba (katta ustun)ga yetti tosh tashlang, har tashlashda Allahu akbar — Veda haj ketma-ketligida kunning birinchi amali.",
      "Tamattu' va Qiron uchun talab qilinadigan qurbonlikni bering (Qur'on 2:196) yoki ishonchli idora orqali tartiblang. Go'sht yeyiladi va kambag'allarga beriladi.",
      "Halq yoki taqsir; ayol barmoq uchi qadar qisqartiradi. Tosh tashlash va halq/taqsirdan keyin birinchi tahallul — ihram cheklovlarining ko'pi ochiladi, jinsiy aloqadan tashqari.",
      "Makka'ga Tavof al-Ifoda — haj rukni — va tamattu' hojilar uchun sa'y. Ifrod/Qiron kelish tavofi bilan sa'y qilganlar mazhab hukmiga amal qiladi. Bu to'liq ihramdan chiqishni tugatadi.",
    ],
    quran: [
      {
        excerpt:
          "...Kim umradan hajga foydalanib foydalansa, oson topiladigan qurbon hayvonlari...",
      },
    ],
    madhhabNote:
      "Nahru kuni amallari ketma-ketligida sunnatda moslashuv bor; mazhablar aniq tartib va har haj turi uchun sa'y vaqtida farq qiladi. Guruh yo'riqnomasiga amal qiling.",
  },
  {
    title: "11–13 zul-hijja — Tashriq kunlari",
    summary: "Mina'da tunlar, har kuni uch Jamrat tosh tashlash, keyin vidolash tavofi.",
    body: [
      "11, 12 (va erta ketmasangiz 13) tunlarini Mina'da o'tkazing. Bu kunlar yeyish, ichish va Allohni yod etish kunlari.",
      "Har kuni Zuhurdan keyin uch ustunga tartib bilan yetti tosh — kichik, o'rta, katta — har tashlashda takbir. Shoshiluvchi 12-kun tosh tashlagach ketishi mumkin (Qur'on 2:203).",
      "Makkadan ketishdan oldin Tavof al-Vada qiling, Uy bilan oxirgi aloqa vidolash bo'lsin. Ibn Abbos rivoyat qilganidek, odamlarga oxirgi marosim Uyda bo'lishi buyurilgan, hayzli ayol uchun yengillashtirilgan (Sahih al-Bukhari 1755; Sahih Muslim 1328).",
    ],
    quran: [
      {
        excerpt:
          "Allohni sanalgan kunlarda yod eting. Kim ikki kunda shoshilsa — gunoh yo'q; kim kechiktirsa — gunoh yo'q — Allohdan qo'rqqanlar uchun...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Odamlarga Ka'ba vidolash tavofi oxirgi marosim qilib buyurilgan, hayzli ayol kechiktirilgan.",
      },
      {
        excerpt:
          "Odamlarga oxirgi marosim Uyda bo'lishi buyurilgan, hayzli ayol uchun yengillashtirilgan.",
      },
    ],
  },
  {
    title: "Ruknlar va vajiblar",
    summary: "Qoldirilsa hajni bekor qiladigan va qurbonlik bilan kefforat qilinadigan narsalar.",
    body: [
      "Ruknlar (arkan) hajning mohiyati. Rukn qoldirilsa, haj bekor va faqat qurbonlik tuzatmaydi — bajarilishi shart. Ko'pchilik odatda sanaydi: ihram (niyat), Arofada turish, Tavof al-Ifoda va sa'y.",
      "Vajiblar (vajibat): miqotdan ihram, Muzdalifada tunash, Jamrat tosh tashlash, Tashriq tunlarini Mina'da o'tkazish va Vidolash tavofi. Vajibni qoldirish hajni bekor qilmaydi, lekin mazhablarda dam (qurbonlik) bilan kefforat qilinadi.",
    ],
    madhhabNote:
      "Aniq arkan va vajibat ro'yxatlari to'rt mazhabda farq qiladi. Mazhabingiz uchun malakali yo'riqnoma bilan tasdiqlang — ayniqsa olomon bosimi ostida narsa qoldirilsa.",
  },
  {
    title: "Adab va samimiyat",
    summary: "Til va a'zolarni asrang — qabul qilinish xulq-atvorga bog'liq.",
    body: [
      "Gunohsiz qaytish hadisi (Buxoriy 1521; Muslim 1350) hajni fohisha (rafast), fisoq va bahslash buzishini ko'rsatadi. Sabr, muloyimlik va boshqa hojilarga yordam ibodat qismidir.",
      "Telefon va behuda gap Arofa va masjidni bosmasin. Tavofda yo'l bering; Qora Toshga itarilmang. Qabul qilingan haj jannat hamrohi — butun safarda yaxshi xulq-atvor intil.",
    ],
    hadith: [
      {
        excerpt:
          "Kim Alloh uchun haj qilsa va jinsiy aloqa ham, gunoh ham qilmasa, onasi uni tug'ilgan kunidagi kabi qaytadi.",
      },
    ],
    actions: ["Kunlik niyat qiling: bir mehribonlik va olomondan yuqori bir samimiy duo."],
  },
  {
    title: "Viza va ro'yxatdan o'tish",
    summary: "Rasmiy kanallardan foydalaning — Nusuk va milliy haj idorangiz.",
    body: [
      "Nusuk (nusuk.sa) Saudiya Arabistonining rasmiy haj va umra platformasi — vizalar, turar joy, transport va ro'yxatdan o'tgan paketlar. Norasmiy vositachilar firibgarlikning keng manbai.",
      "Har mamlakat yillik haj kvotasiga ega; ko'pchilik milliy haj idorasi yoki litsenziyali agent orqali ariza beradi. Umra kvotasi yo'q va yilning ko'p qismida tasdiqlangan kanallar orqali tashkil etiladi.",
    ],
    actions: [
      "Mavsum ochilganda erta ariza bering.",
      "Faqat Nusuk ro'yxatidagi agentlar yoki milliy idora orqali bron qiling.",
      "Pul o'tkazishdan oldin to'lov kanallarini tekshiring.",
    ],
  },
  {
    title: "Nima olib ketish kerak",
    summary: "Ihram, atirsiz toza vositalar, hujjatlar va yurish qulayligi.",
    body: [
      "Erkaklar: kamida ikki to'plam tikilmagan ihram va hujjatlar uchun kamar. Ayollar: keng yopiq kiyim. Oson kiyiladigan ochiq sandal; kichik ryukzak va suv idishi.",
      "Atirsiz sovun va quyosh kremi oling — ihramda atir taqiqlangan. Pasport, viza nusxasi, emlash yozuvlari va favqulodda aloqalarni ing qopchada saqlang. Power bank va mahalliy SIM yoki eSIM olomon ichida yordam beradi.",
    ],
    actions: [
      "Ro'yxat: ihram ×2, sandal, atirsiz vositalar, hujjat qopchasi, dori, power bank.",
      "Poyabzal yarasi plastirlarini oling — hojilar uzoq yuradi.",
    ],
  },
  {
    title: "Muqaddas joylar qisqacha",
    summary: "Makka, Madina, Mina, Arofa va Muzdalifa — amaliy eslatmalar.",
    body: [
      "Masjid al-Haram Ka'bani o'rab oladi — tavof va sa'y joyi; katta olomon kuting. Madinadagi Masjid an-Nabaviy hajning o'zi emas, lekin ko'pchilik ziyorat qiladi; Ravda kirishi rasmiy ilovalar orqali vaqt belgilanadi.",
      "Mina 8 va 11–13 zul-hijja tunlari uchun chodir shahar. Arofa ochiq tekislik — 9-kunda suv va soy muhim. Muzdalifa hojilar ochiq osmon ostida dam olib tosh yig'adigan joy — imkoniyatlar atayin kam.",
    ],
    actions: ["Safardan oldin Mina–Arofa–Muzdalifa oddiy xaritasini o'rganing."],
  },
  {
    title: "Rasmiy manbalar",
    summary: "Nusuk, milliy idorangiz va Visit Saudi.",
    body: [
      "Vizalar, paketlar, Ravda ruxsatlari va olomon yo'riqnomasi uchun Nusukdan boshlang. Mamlakat haj vazirligidan kvota va sog'liq qoidalarini oling. Visit Saudi umumiy kirish va safar maslahatlarini e'lon qiladi.",
      "Kelishuv g'ayrioddiy arzon ko'rinsa yoki vositachi rasmiy kanallardan tashqari to'lov so'rasa, to'lashdan oldin to'g'ridan-to'g'ri vazirlik portali orqali tekshiring.",
    ],
    actions: [
      "nusuk.sa va milliy haj idorasi saytini xatcho'pga qo'shing.",
      "Guruh rahbarining favqulodda aloqalarini saqlang.",
    ],
  },
];

export const HAJJ_CHECKLIST_UZ: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Haj uchun ihram",
    hint: "Haj niyatini qiling va ihram kiring (tamattu' uchun Makkadan); talbiyani yangilang.",
    day: "8 zul-hijja",
  },
  {
    title: "Mina'ga boring",
    hint: "Mina'da Zuhurdan Fajrgacha har namozni o'z vaqtida qisqartirib o'qing.",
    location: "Mina",
    day: "8 zul-hijja",
  },
  {
    title: "Arofada turing",
    hint: "Arofa ichida tushdan keyin quyosh botgunga qadar duo va zikrda qoling.",
    location: "Arofa",
    day: "9 zul-hijja",
  },
  {
    title: "Zuhur va Asrni birlashtiring",
    hint: "Zuhur va Asrni Zuhur vaqtida birlashtirib qisqartirib o'qing, keyin duoga qaratiling.",
    location: "Arofa",
    day: "9 zul-hijja",
  },
  {
    title: "Muzdalifaga o'ting",
    hint: "Quyosh botgach Mag'rib va Ishani birlashtiring, dam oling va toshlar yig'ing.",
    location: "Muzdalifa",
    day: "9 zul-hijja",
  },
  {
    title: "Jamrat al-Aqaba tosh tashlash",
    hint: "Katta ustunga yetti tosh tashlang, har tashlashda takbir.",
    location: "Mina",
    day: "10 zul-hijja",
  },
  {
    title: "Qurbonlik bering",
    hint: "Tamattu' va qiron uchun talab — o'zingiz yoki ishonchli idora orqali.",
    day: "10 zul-hijja",
  },
  {
    title: "Halq yoki taqsir",
    hint: "Erkaklar qirqadi yoki qisqartiradi; ayol barmoq uchi (birinchi tahallul).",
    day: "10 zul-hijja",
  },
  {
    title: "Tavof al-Ifoda",
    hint: "Tavof al-Ifoda va tamattu' uchun sa'y — haj rukni.",
    location: "Masjid al-Haram",
    day: "10 zul-hijja",
  },
  {
    title: "Mina'da tunash",
    hint: "11, 12 (va erta ketmasangiz 13) tunlarini Mina'da o'tkazing.",
    location: "Mina",
    day: "11–13 zul-hijja",
  },
  {
    title: "Uch Jamrat tosh tashlash",
    hint: "Har kuni Zuhurdan keyin kichik, o'rta, keyin katta — har biriga yetti.",
    location: "Mina",
    day: "11–13 zul-hijja",
  },
  {
    title: "Vidolash tavofi",
    hint: "Makkadan ketishdan oldin Tavof al-Vada (hayzli ayol kechiktirilgan).",
    location: "Masjid al-Haram",
    day: "Ketish",
  },
];

export const UMRAH_CHECKLIST_UZ: DeepPartial<PilgrimageChecklistItem>[] = [
  {
    title: "Ihramga kirish",
    hint: "Miqotda yoki undan oldin: g'usl, ihram kiyimi, umra niyati, talbiya.",
    location: "Miqot",
  },
  { title: "Talbiyani o'qing", hint: "Tavof boshlanguncha Labbayk... ni tez-tez takrorlang." },
  {
    title: "Ka'ba tavofi",
    hint: "Qora Toshdan boshlab yetti aylana soat yo'nalishiga qarshi; erkaklar: raml va idtiba'.",
    location: "Masjid al-Haram",
  },
  {
    title: "Ikki rakat o'qing",
    hint: "Imkon bo'lsa Maqom Ibrohim ortida, keyin Zamzam iching.",
    location: "Masjid al-Haram",
  },
  {
    title: "Safa va Marva orasida sa'y",
    hint: "Safadan boshlab yetti saf; erkaklar yashil belgilar orasida yuguradi.",
    location: "Masjid al-Haram",
  },
  {
    title: "Halq yoki taqsir",
    hint: "Erkaklar qirqadi yoki qisqartiradi; ayol barmoq uchi — umra tugadi.",
  },
];
