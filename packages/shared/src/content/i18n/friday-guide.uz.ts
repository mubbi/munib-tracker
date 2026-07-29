import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Uzbek translation overlay for the Learn Friday (Jumu'ah) guide. Mirrors the order of
// FRIDAY_GUIDE_TOPICS in ../friday-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const FRIDAY_GUIDE_TOPICS_UZ: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Juma kunining fazilatlari",
    summary:
      "Quyosh chiqadigan eng yaxshi kun — Odamning yaratilishi va ikki juma orasidagi kechirim.",
    body: [
      "Juma (Yavmul-Jum'a) — bu ummatning haftalik yig'ilish kuni. Abu Hurayra rivoyat qilishicha, Allohning Rasuli ﷺ shunday dedi: 'Quyosh chiqqan kunlarning eng yaxshisi jumadir; shu kunda Odam yaratildi, shu kunda u Jannatga kiritildi, shu kunda u u yerdan chiqarildi va Qiyomat kuni ham faqat juma kunida bo'ladi' (Sahih Muslim 854).",
      "Uning ibodati doimiy kechirim va'dasini ham o'z ichiga oladi. Abu Hurayra rivoyat qilishicha, Payg'ambar ﷺ shunday dedi: 'Kim juma kuni g'usl qilsa, so'ng juma namoziga kelsa, imom xutba o'qiyotganda tinglab, jim tursa, uning shu juma bilan keyingi juma orasidagi gunohlari, yana uch kun bilan birga kechiriladi' (Sahih Muslim 857).",
      "Bu fazilatlar oldindan tayyorlanish, diqqat bilan tinglash va jumani ishdan dam olish kuni sifatida emas, balki haftalik ruhiy yangilanish sifatida qabul qilishga chorlashdir.",
    ],
    hadith: [
      {
        excerpt:
          "Quyosh chiqqan kunlarning eng yaxshisi jumadir; shu kunda Odam yaratildi, shu kunda u Jannatga kiritildi, shu kunda u u yerdan chiqarildi va Qiyomat kuni ham faqat juma kunida bo'ladi.",
      },
      {
        excerpt:
          "Kim juma kuni g'usl qilsa, so'ng juma namoziga kelsa, imom xutba o'qiyotganda tinglab, jim tursa, uning shu juma bilan keyingi juma orasidagi gunohlari, yana uch kun bilan birga kechiriladi.",
      },
    ],
    actions: [
      "Juma ertalabidan niyat qiling: g'usl, eng yaxshi kiyim va erta kelish.",
      "Xutbani ibodat sifatida qabul qiling — jimlik va e'tibor ham savobning bir qismidir.",
    ],
  },
  {
    title: "Juma — haftalik farz",
    summary:
      "Qur'onda farz qilingan jamoat bilan o'qiladigan juma namozi, unda qatnashuvchilar uchun peshin namozining o'rnini bosadi.",
    body: [
      "Alloh juma namozini o'z nomi bilan farz qiladi: 'Ey imon keltirganlar! Juma kuni namozga chaqirilganda, Allohni zikr qilishga shoshiling va savdo-sotiqni tashlab qo'ying. Agar bilsangiz, bu siz uchun yaxshiroqdir' (Qur'on, 62:9). Keyingi oyatlar namozdan keyin yer yuzida tarqalish va Allohning ne'matini izlashga ruxsat beradi (Qur'on, 62:10–11).",
      "Juma ikki qismli xutbadan va so'ngra imom orqasida ovoz chiqarib o'qiladigan ikki rakatdan iborat bo'lib, unda qatnashuvchilar uchun peshin namozining o'rnini bosadi. Toriq ibn Shihob rivoyat qilishicha, Payg'ambar ﷺ jamoat bilan o'qiladigan juma namozi har bir musulmonga farz ekanligini, to'rt kishidan tashqari: qul, ayol, bola yoki kasal kishi (Abu Dovud Sunani 1067).",
      "Uni e'tiborsiz qoldirish og'ir ogohlantirishdir: Abul-Ja'd rivoyat qilishicha, kim beparvolik tufayli uch juma namozini tark etsa, Alloh uning qalbiga muhr bosadi (Nasoiy Sunani 1369). Xutba paytida keraksiz gapirish savobni yo'qotadi — Abu Hurayra rivoyat qilishicha, agar siz do'stingizga imom xutba o'qiyotganda 'Jim bo'l' desangiz, siz o'zingiz behuda gapirgan bo'lasiz (Sahih Buxoriy 934).",
      "Jumadan keyin to'rt rakat o'qish tavsiya etiladi: Abu Hurayra rivoyat qilishicha, Payg'ambar ﷺ shunday dedi, 'Sizlardan biri juma namozini o'qiganda, undan keyin to'rt (rakat) o'qisin' (Sahih Muslim 881).",
    ],
    quran: [
      {
        excerpt:
          "Ey imon keltirganlar! Juma kuni namozga chaqirilganda, Allohni zikr qilishga shoshiling va savdo-sotiqni tashlab qo'ying. Agar bilsangiz, bu siz uchun yaxshiroqdir. Namoz tugagach, yer yuzida tarqalib, Allohning fazlidan izlang...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Jamoat bilan o'qiladigan juma namozi har bir musulmonga farz, to'rt kishidan tashqari: qul, ayol, bola yoki kasal kishi.",
      },
      {
        excerpt:
          "Kim beparvolik tufayli uch juma namozini tark etsa, Alloh uning qalbiga muhr bosadi.",
      },
      {
        excerpt:
          "Agar siz do'stingizga juma kuni imom xutba o'qiyotganda 'Jim bo'l' desangiz, siz o'zingiz behuda (lag'v) gapirgan bo'lasiz.",
      },
      { excerpt: "Sizlardan biri juma namozini o'qiganda, undan keyin to'rt (rakat) o'qisin." },
    ],
    actions: [
      "Xutba boshlanishidan oldin masjidga yetib borish uchun yo'lingizni rejalashtiring.",
      "Telefonlaringizni ovozsiz qilib qo'ying va xutba paytida gaplashishdan saqlaning.",
      "Iloji bo'lsa, jumadan keyin to'rt rakat o'qing.",
    ],
    appLinks: [{ label: "Namozni o'rganish — juma darsi" }, { label: "Kuzatuvchini ochish" }],
    disclaimer:
      "Juma to'g'ri hisoblanishi uchun zarur bo'lgan minimal qatnashuvchilar soni, shuningdek ayollar va yo'lovchilarning qatnashishga rag'batlantirilishi — bu mazhablar va mahalliy urf-odatlarga qarab farq qiladigan batafsil fiqh masalalari. Qatnashmagan ayollar, yo'lovchilar va kasallar o'rniga peshin namozini o'qiydilar. Bu ta'limiy mazmun, fatvo emas.",
  },
  {
    title: "Jumaga tayyorgarlik",
    summary: "G'usl, toza kiyim, xushbo'y hid va erta kelish eng katta savob uchun.",
    body: [
      "Tayyorgarlik juma sunnatining bir qismidir. Abu Said al-Xudriy rivoyat qilishicha, Allohning Rasuli ﷺ shunday dedi: 'Juma kuni g'usl qilish balog'atga yetgan har bir kishiga farzdir' (Sahih Muslim 846). Sahih Buxoriydagi (877) o'xshash hadis ham juma g'uslini balog'atga yetganlar bilan bog'laydi.",
      "G'usldan tashqari, Payg'ambar ﷺ imkon qadar yaxshi ko'rinishga undadi. Salmon al-Foriy rivoyat qilishicha, Payg'ambar ﷺ shunday dedi: 'Kim juma kuni g'usl qilib, imkon qadar tozalanib, so'ng soch moyi yoki xushbo'y hid ishlatib, so'ng chiqib, ikki kishi orasidan o'tmasdan o'z joyiga o'tirsa, imom tugaguncha tinglasa, so'ng o'ziga farz qilingan namozni o'qisa — uning shu juma bilan keyingi juma orasidagi gunohlari kechiriladi' (Sahih Buxoriy 883).",
      "Erta kelish savobni ko'paytiradi. Abu Hurayra rivoyat qilishicha, kim birinchi soatda borsa, tuya qurbonlik qilgan kishi kabidir, so'ng sigir, so'ng qo'y, so'ng tovuq, so'ng tuxum — imom chiqganda, farishtalar yozuvlarini yig'ib, eslatmani tinglaydilar (Sahih Buxoriy 881).",
    ],
    hadith: [
      { excerpt: "Juma kuni g'usl qilish balog'atga yetgan har bir kishiga farzdir." },
      { excerpt: "Juma kuni g'usl qilish balog'atga yetgan har bir musulmon erkakka farzdir." },
      {
        excerpt:
          "Kim juma kuni g'usl qilib, imkon qadar tozalanib, so'ng soch moyi yoki xushbo'y hid ishlatib, so'ng chiqib, ikki kishi orasidan o'tmasdan o'z joyiga o'tirsa, imom tugaguncha tinglasa, so'ng o'ziga farz qilingan namozni o'qisa — uning shu juma bilan keyingi juma orasidagi gunohlari kechiriladi.",
      },
      {
        excerpt:
          "Kim juma kuni g'usl qilib, so'ng erta borsa, tuya qurbonlik qilgan kishi kabidir... so'ng sigir... so'ng qo'y... so'ng tovuq... so'ng tuxum. Imom chiqganda, farishtalar eslatmani tinglash uchun keladilar.",
      },
    ],
    actions: [
      "Juma ertalabi (yoki masjidga borishdan oldin) g'usl qiling.",
      "Eng yaxshi va toza kiyimingizni kiying, imkon bo'lsa yengil xushbo'y hid ishlating.",
      "Erta boring — eng erta boradiganlar eng katta savobni oladilar.",
    ],
    appLinks: [{ label: "Tozalikni o'rganish — G'usl" }],
    disclaimer:
      "Juma g'uslining qattiq farz yoki qattiq tavsiya etilgan sunnat ekanligi mazhablar orasidagi klassik farqdir. Hamma uning katta fazilati haqida kelishadi; jamoatingizning qabul qilingan amaliyotiga amal qiling.",
  },
  {
    title: "Juma kunida Kahf surasi",
    summary: "Ikki juma orasidagi nur va birinchi o'n oyatdagi himoya.",
    body: [
      "Kahf surasini (Qur'on 18) juma kuni o'qish sevimli haftalik amaliyotdir. Abu Said al-Xudriy rivoyat qilishicha, Payg'ambar ﷺ shunday dedi: 'Kim juma kuni Kahf surasini o'qisa, unga ikki juma orasida nur yog'iladi.' Bu hadis al-Hokim va al-Bayhaqiy orqali rivoyat qilingan va Shayx al-Albaniy sahih deb baholagan; ko'p jamoalar buni o'rnashib qolgan juma sunnati sifatida davom ettiradilar.",
      "Bundan tashqari, Kahf surasining birinchi o'n oyati Dajjol fitnasidan himoyadir. Abu Dardo rivoyat qilishicha, Payg'ambar ﷺ shunday dedi: 'Kim Kahf surasining birinchi o'n oyatini yodlab olsa, Dajjoldan himoyalanadi' (Sahih Muslim 809).",
      "Payshanba kechasi va juma kuni quyosh botishi orasida vaqt toping, surani o'qish uchun — hatto butun bo'limni tugatolmasangiz ham, birinchi oyatlardan boshlang va imkon qadar ko'p qayting.",
    ],
    quran: [
      {
        excerpt:
          "Barcha hamd bandasiga Kitobni tushirgan va unda hech qanday qiyshiqlik qo'ymagan Allohga xosdir... Yoki siz g'or va yozuv egalarini Bizning ajoyib belgilarimizdan deb o'yladingizmi?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim juma kuni Kahf surasini o'qisa, unga ikki juma orasida nur yog'iladi. (Shayx al-Albaniy sahih deb baholagan)",
      },
      { excerpt: "Kim Kahf surasining birinchi o'n oyatini yodlab olsa, Dajjoldan himoyalanadi." },
    ],
    actions: [
      "Juma kuni Kahf surasini ochib, imkon qadar diqqat bilan o'qing.",
      "Dajjoldan himoyalanish uchun birinchi o'n oyatni yodlab oling yoki takrorlang.",
    ],
    appLinks: [{ label: "Kahf surasini o'qish" }],
    disclaimer:
      "'Ikki juma orasidagi nur' hadisi Olti asosiy kitobda topilmaydi; u keyinroq keng qabul qilingan rivoyatga asoslangan. Birinchi o'n oyatning himoyasi (Muslim 809) bahssiz sahihdir.",
  },
  {
    title: "Juma kunida Payg'ambarga ﷺ salovat",
    summary: "Haftaning eng yaxshi kunida, Payg'ambarga ﷺ salovatni ko'paytiring.",
    body: [
      "Juma ko'proq salovat uchun ajratilgan. Avs ibn Avs rivoyat qilishicha, Payg'ambar ﷺ shunday dedi: 'Kunlaringizning eng yaxshilaridan biri jumadir; shuning uchun shu kunda menga salovatni ko'paytiring, chunki sizning salovatlaringiz menga yetkaziladi.' Ular so'radilar: 'Ey Allohning Rasuli, sen tuproq bo'lganda bizning salovatlarimiz senga qanday yetkaziladi?' U javob berdi: 'Alloh yerga payg'ambarlarning tanalarini yeyishni harom qilgan' (Abu Dovud Sunani 1047).",
      "Har qanday ishonchli salovat formulasi qabul qilinadi — namozda o'rgatilgan salovatlar bo'lsin yoki Sunnatdan kelgan uzunroq shakllar bo'lsin. Muhimi juma kunida takror va samimiylikdir, qat'iy son emas.",
    ],
    hadith: [
      {
        excerpt:
          "Kunlaringizning eng yaxshilaridan biri jumadir; shuning uchun shu kunda menga salovatni ko'paytiring, chunki sizning salovatlaringiz menga yetkaziladi.",
      },
    ],
    actions: [
      "Juma kuni uchun shaxsiy salovat maqsadingizni belgilang — kichik son bo'lsa ham, doimiy bo'lsin.",
      "Tayyor formula xohlasangiz, ilovadagi salovatlar to'plamidan foydalaning.",
    ],
    appLinks: [{ label: "Salovat" }],
  },
  {
    title: "Qabul bo'lish soati",
    summary: "Juma kunida ibodat rad etilmaydigan bir soat — buni ayniqsa asrdan keyin izlang.",
    body: [
      "Abu Hurayra rivoyat qilishicha, Allohning Rasuli ﷺ jumani zikr qilib shunday dedi: 'Juma kunida bir soat bor, agar musulman banda o'sha soatda turib Allohdan biror narsa so'rasa, U unga beradi' — va qo'li bilan uning qisqa ekanligini ko'rsatdi (Sahih Buxoriy 935; shuningdek Sahih Muslim 852).",
      "Olimlar bu soat aynan qachon ekanligi haqida turlicha fikrda. Kuchli bir qarash uni juma kunining asrdan keyingi so'nggi qismiga qo'yadi: Jobir ibn Abdulloh rivoyat qilishicha, Payg'ambar ﷺ shunday dedi: 'Juma o'n ikki soatdan iborat va unda bir soat bor, agar musulman banda Allohdan biror narsa so'rasa, U unga beradi — shuning uchun buni asrdan keyingi so'nggi soatda izlang' (Abu Dovud Sunani 1048).",
      "Qaysi qarashga amal qilsangiz ham, juma kunini — ayniqsa kunning so'nggi qismini — samimiy duo, istig'for va salovat bilan to'ldiring, Allohning javob berish va'dasiga ishonib.",
    ],
    hadith: [
      {
        excerpt:
          "Juma kunida bir soat bor, agar musulman banda o'sha soatda turib Allohdan biror narsa so'rasa, U unga beradi — va qo'li bilan uning qisqa ekanligini ko'rsatdi.",
      },
      {
        excerpt:
          "Juma kunida bir soat bor, agar musulman namozda turib Allohdan biror narsa so'rasa, U unga beradi.",
      },
      {
        excerpt:
          "Juma o'n ikki soatdan iborat va unda bir soat bor, agar musulman banda Allohdan biror narsa so'rasa, U unga beradi — shuning uchun buni asrdan keyingi so'nggi soatda izlang.",
      },
    ],
    actions: [
      "Juma kuni asrdan keyin, qisqa duolar ro'yxati bilan o'tirib, samimiylik bilan so'rang.",
      "Duoni salovat bilan birlashtiring — ikkisi ham shu kunda alohida tavsiya etiladi.",
    ],
    appLinks: [{ label: "Duolar to'plami" }],
    disclaimer:
      "Qabul bo'lish soatining aniq vaqti olimlar orasida bahsli masaladir (xutba paytida, asrdan keyin va boshqa qarashlar). Soatning o'zi mavjudligi Buxoriy va Muslimda bahssiz sahihdir.",
  },
];
