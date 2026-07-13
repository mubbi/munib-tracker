// Uzbek translation overlay for the Learn Hajj & Umrah guide. Mirrors the order of
// its English source in ../hajj-guide.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { HajjGuideSection } from "../../types/hajj-guide";
import type { DeepPartial } from "./localize";

export const HAJJ_GUIDE_SECTIONS_UZ: DeepPartial<HajjGuideSection>[] = [
  {
    day: "Ketishdan oldin",
    title: "Majburiyat va shartlar",
    summary: "Nima uchun haj farz va kimga farz bo'ladi.",
    steps: [
      {
        title: "Beshinchi ustun",
        body: "Haj islomning beshinchi ustuni bo'lib, har bir qodir musulmonga umrida bir marta farz qilinadi. Alloh taolo aytadi: “Odamlardan Allohning huzurida, kim unga yo‘l topa olsa, uyga haj bordir” (Olima surasi, 97-oyat). Hamma odamlarga e'lon qilindi: \"Odamlarga hajni e'lon qiling, ular sizning oldingizga piyoda va har bir ozg'in tuyada keladilar\" (Qur'on 22:27).",
      },
      {
        title: "Qobiliyat (istitaah)",
        body: "Haj faqat qodir bo'lgan kishilarga farzdir: safar uchun jismoniy sog'lik, safarni to'lash uchun halol mol-mulk va uzoqda bo'lgan qaramog'idagilar va xavfsiz, ochiq yo'l. Bu yil kimning imkoni yo'q bo'lsa, qodir bo'lgunga qadar kechiktirsa gunohkor bo'lmaydi.",
      },
      {
        title: "Ayol sayohati",
        body: "Aksariyat ulamolarning fikricha, ayol kishi mahrami (eri yoki nikohsiz qarindoshi) bilan Hajga boradi; Ba'zi keyingi olimlar xavfsiz, ishonchli ayollar guruhi ichida sayohat qilishga ruxsat berishadi. O'zingiz ishongan malakali olimning hukmiga va Haj vakolatingizning qoidalariga amal qiling.",
      },
    ],
  },
  {
    day: "Ketishdan oldin",
    title: "Hajning uch turi",
    summary: "Ifrod, Qiron va Tamattu' - ehromga kirishdan oldin tanlang.",
    steps: [
      {
        title: "Ifrad",
        body: "Hoji yolg‘iz haj uchun ehromga kiradi, alohida umra qilmaydi va uning hisobidan qurbonlik solmaydi. Nahr kunigacha ehromda qoladi.",
      },
      {
        title: "Qiron",
        body: "Ziyoratchi umra va hajni bir ehromda birlashtirib, umra amallarini bajaradi va haj tamom bo‘lgunga qadar ehromda qoladi. Tamattu' kabi qurbonlik (hady) talab qiladi.",
      },
      {
        title: "Tamattu'",
        body: "Hoji Haj oylarida to‘liq umra ado etadi, ehromdan chiqadi, so‘ngra 8 Zulhijjada haj uchun ehromga qayta kiradi. Ko'pchilik ziyoratchilar shunday qilishadi; Qurbonlik so'yish yoki Hajda uch kun, qaytib kelganda esa yetti kun ro'za tutish kerak bo'ladi (Qur'on 2:196).",
      },
    ],
  },
  {
    day: "Ketishdan oldin",
    title: "Miqot va Ehrom",
    summary: "Muqaddas davlat qaerdan boshlanadi va u nimani taqiqlaydi.",
    steps: [
      {
        title: "Besh mavoqit",
        body: "Rasululloh sollallohu alayhi vasallam besh miqatni belgilab qo'yganlar: ehromsiz o'tish mumkin bo'lmagan chegara nuqtalari: Zul-hulayfa (Madina uchun), Al-Juhfa (Suriya/Misr uchun), Qarn al-Manazil (Najd uchun), Yalamlam (Yaman uchun) va Zat-Irq (Iroq uchun). Ichkaridagilar esa turgan joyidan ehromga kiradilar.",
        location: "Miqat",
      },
      {
        title: "Ehrom nima",
        body: "Ehrom – niyat va talbiya bilan kiradigan muqaddas holat. Erkaklar ikkita tikilmagan oq choyshab kiyishadi; ayollar oddiy kamtarona kiyinishni davom ettiradilar. U g'usldan keyin, erkaklar uchun esa oldindan badanga (kiyimga emas) xushbo'y surtishdan keyin kiritiladi.",
        location: "Miqat",
      },
      {
        title: "Ehromning taqiqlari",
        body: "Ehromda bo'lganingizda: tikilgan kiyim va boshni yopish (erkaklar uchun), xushbo'y hiddan, soch yoki tirnoq kesishdan, ov qilishdan, nikoh yoki nikohdan va har qanday yaqinlikdan saqlaning. Bularni buzish kafforatni (fidyani) talab qilishi mumkin, shuning uchun ularni ehtiyot qiling.",
        location: "Miqat",
      },
    ],
  },
  {
    title: "Umra",
    summary: "Kichik ziyorat - yilning istalgan vaqtida amalga oshirilishi mumkin.",
    steps: [
      {
        title: "Ehromga kiring",
        body: "Miqotda yoki undan oldin g'usl qiling, ehrom kiying, umra niyatini qiling va talbiyani boshlang. Qalbda niyat qilinadi, muqaddas holat shu daqiqadan boshlanadi.",
        location: "Miqat",
      },
      {
        title: "Talbiya ayting",
        body: "Makkaga safar qilayotganingizda “Labbayk Allohumma labbayk, labbayka la sharika laka labbayk...” soʻzini tez-tez takrorlang - bu Allohning da'vatiga yolgʻiz javob berishingizni bildirish - tavofni boshlaguningizcha davom eting.",
      },
      {
        title: "Ka'bani tavof qilish",
        body: "Ka'bani soat miliga teskari yo'nalishda yetti marta aylanib, Qora tosh burchagidan boshlab va tugaydi, u erda siz uni o'pasiz, tegizasiz yoki shunchaki takbir bilan unga ishora qilasiz. Erkaklar dastlabki uchta aylanishda raml (tez sur'atda) va idtiba (o'ng yelkasini ochib) bajaradilar. Yaman burchagi va Qora tosh orasida: “Ey Robbimiz, bizga bu dunyoda ham, oxiratda ham yaxshilik ato et va bizni do‘zax azobidan saqla” (Baqara surasi, 201-oyat) kabi tilovat qilinadi.",
        location: "Masjid al-Harom",
      },
      {
        title: "Ikki rakat namoz o'qing",
        body: "Tavofdan so'ng, iloji bo'lsa, Maqom Ibrohimning orqasida ikki rakat namoz o'qing (yoki olomon bo'lsa, masjidning istalgan joyida), so'ngra zamzam suvini bemalol iching, chunki Rasululloh sollallohu alayhi vasallam zamzam nima ichilsa, u uchundir, dedilar.",
        location: "Masjid al-Harom",
      },
      {
        title: "Safo va Marva orasidagi sa'y",
        body: "Hajarning o'g'li Ismoilga suv izlaganini eslab, Safodan boshlab Safo va Marva o'rtasida yetti marta yuring. Alloh taolo aytadi: “Albatta, as-Safo va al-Marva Allohning ramzlaridandir” (Baqara surasi, 158-oyat). Safoda Ka'baga yuzlaning va duo va takbirda qo'llaringizni ko'taring; erkaklar yashil belgilar orasida yugurishadi.",
        location: "Masjid al-Harom",
      },
      {
        title: "Halq yoki taqsir",
        body: "Erkaklar sochni qirqishadi (halq, savob ko'proq) yoki uni bir tekis qirqadilar (taqsir); ayollar sochlarini yig'ib, barmoq uchi uzunligini qirqishadi. Shu bilan umra tamom bo'ladi va ehrom cheklovlari bekor qilinadi.",
      },
    ],
  },
  {
    day: "8 Zulhijja",
    title: "Tarviya kuni - Mino",
    summary: "Haj boshlanadi; kun Minoda o'tadi.",
    steps: [
      {
        title: "Haj uchun ehromga kiring",
        body: "Hajga niyat qiling va talbiyani yangilab, ehromga kiring. Bu yana muqaddas holatni boshlaydi, shuning uchun ehrom taqiqlari yana bir bor amal qiladi.",
      },
      {
        title: "Minoga sayohat",
        body: "Minoga borib, Payg'ambarimiz sollallohu alayhi vasallamning sunnatlariga amal qilib, peshin, asr, shom, xufton va keyingi bomdod namozlarini o'qing, har biri o'z vaqtida ikki rakatga qisqartiriladi. Kechayu kunduzni ibodat bilan o'tkaz, Arafada turishni kut.",
        location: "Mina",
      },
    ],
  },
  {
    day: "9 Zulhijja",
    title: "Arafa kuni",
    summary: "Hajning eng ulug' kuni - Arafada turish.",
    steps: [
      {
        title: "Arafada turing",
        body: "Peshindan keyin quyosh botguncha duo, zikr va tavba bilan Arafa chegarasida qoling. Rasululloh sollallohu alayhi vasallam: “Haj – arafadir”, dedilar (Termiziy 889, Abu Dovud 1949, hasan sahih): Kim bu tura olmagan bo‘lsa, hajni o‘tkazib yuborgan bo‘ladi. Qiblaga yuzlaning, qo'llaringizni ko'taring va Allohga iltijo qiling - bu duo uchun eng ulug' kundir.",
        location: "Arafa",
      },
      {
        title: "Peshin va asrni birlashtiring",
        body: "Peshin va asr namozlarini birga va peshin vaqtida qisqartirib o'qing, so'ngra kunning qolgan qismini ortiqcha namozga emas, balki duoga bag'ishlang.",
        location: "Arafa",
      },
      {
        title: "Muzdalifaga ko‘ch",
        body: "Quyosh botgandan so'ng, Muzdalifaga xotirjamlik bilan sayohat qiling, shom va xuftonni birlashtiring (isho qisqartirildi), tunni dam oling va toshbo'ron qilish uchun tosh yig'ing. Zaiflar va ayollar ezilmaslik uchun yarim tundan keyin Minoga jo'nab ketishlari mumkin.",
        location: "Muzdalifa",
      },
    ],
  },
  {
    day: "10 Zulhijja",
    title: "Nahr kuni — Qurbon hayiti",
    summary: "Toshbo'ron qilish, qurbonlik qilish va asosiy tavof.",
    steps: [
      {
        title: "Jamrat al-Aqaba tosh",
        body: "Minoga qayting va katta ustunga (Jamrat ul-Aqaba) yettita tosh otib, har otishda “Allohu akbar” deng. Bu Ibrohimning shaytonni rad etishini qayta tiklaydi va kunning birinchi marosimidir.",
        location: "Mina",
      },
      {
        title: "Qurbonlik qiling",
        body: "Qurbonlik jonivorini so'ying yoki uni tamattu' va qiron ziyoratchilari uchun talab qilinganidek ishonchli idora orqali so'ying (Qur'on 2:196). Uning go‘shti yeb, kambag‘allarga beriladi.",
      },
      {
        title: "Halq yoki taqsir",
        body: "Sochni tarash (halq) yoki qirqish (taqsir); ayollar barmoq uchi uzunligini qisqartiradilar. Toshbo'ron qilish va soqol olishdan keyin birinchi ozodlik (tahallul-avval) qo'llaniladi - turmush o'rtog'i bilan yaqinlikdan tashqari barcha ehrom cheklovlari olib tashlanadi.",
      },
      {
        title: "Tavof al-Ifoda",
        body: "Makkaga boring, tavof al-ifada - haj ustuni - va sa'iy (tamattu' uchun). Bu ehromdan toʻliq ozod boʻlishni tugatadi va fahsh va gunohdan qochgan kishi “onasi tugʻgan kundek qaytadi” (Buxoriy 1521, Musulmon 1350).",
        location: "Masjid al-Harom",
      },
    ],
  },
  {
    day: "11–13 Zulhijja",
    title: "Tashrik kunlari - Mino",
    summary: "Minodagi tunlar va har kuni uchta ustunni toshbo'ron qilish.",
    steps: [
      {
        title: "Minoda bir kechada qoling",
        body: "11, 12 (va erta ketmasangiz 13) kechalarini Minoda o'tkazing. Bu kunlar yeb-ichish, Allohni zikr qilish, ibodat va takbir bilan o‘tkaziladigan kunlardir.",
        location: "Mina",
      },
      {
        title: "Uchta Jamaratni toshbo'ron qiling",
        body: "Har peshindan keyin peshindan keyin uchta ustunning har biriga navbatma-navbat yettita tosh oting - kichik, keyin o'rta, keyin katta - har otishda takbir. Kim shoshilsa, 12-da toshbo'ron qilgandan keyin ketishi mumkin (Qur'on 2:203).",
        location: "Mina",
      },
      {
        title: "Alvido Tavof",
        body: "Makkani tark etishdan oldin tavof ul-vadani oxirgi marosim sifatida bajaring, shunda hajning oxirgi amali Baytullohida bo'lsin. Hayz ko'rgan ayollar bundan mustasno.",
        location: "Masjid al-Harom",
      },
    ],
  },
  {
    day: "Tugatish va qarorlar",
    title: "Ustunlar, majburiyatlar va mukofotlar",
    summary: "Hajni nima sahih qiladi, nima to'lanadi va uning ajri.",
    steps: [
      {
        title: "Ustunlar (arkan)",
        body: "Ustunlar hajning mohiyatidir: ehromga kirish, arafada turish, tavof ul-ifada va sa'iy (ko'pchilikning fikricha). Agar biron bir ustun o'tkazib yuborilsa, haj noto'g'ri bo'lib, qurbonlik bilan tutib bo'lmaydi - uni takrorlash kerak.",
      },
      {
        title: "Majburiyatlar (vojibat)",
        body: "Miqotdan ehromga kirish, Muzdalifada turish, Jamoratni toshbo'ron qilish, Minoda tashriq kechalarini o'tkazish, Vidolashuv tavofi kabilar farzlarga kiradi. Farzni tark etish hajni buzmaydi, balki to'g'on (qurbonlik) bilan to'lanadi. Mazhablar aniq ro'yxatlarda farqlanadi; malakali gid bilan maslahatlashing.",
      },
      {
        title: "Mabrur hajning ajri",
        body: "Qabul qilingan haj (mabrur haj) - gunohdan xoli va ixlos bilan qilingan - o'tgan gunohlarni o'chiradi va uning mukofoti jannatning o'zidir. Rasululloh sollallohu alayhi vasallam: “Qabul qilingan hajning ajri jannatdan o‘zga yo‘q”, dedilar (Buxoriy 1773, Musulmon 1349). Ajoyib xarakter va muloyimlikka intiling.",
      },
      {
        title: "Fatvo emas, amaliy qo'llanma",
        body: "Bu marosimlarni tartibda bajarishga yordam beradigan amaliy sharh. Mazhablar ko'p tafsilotlarda hurmat bilan farq qiladi va har bir ziyoratchining ahvoli har xil - har doim malakali olim yoki rasmiy Haj yo'riqnomangiz bilan muayyan hukmlar va kutilmagan holatlar uchun maslahatlashing.",
      },
    ],
  },
  {
    day: "Yo'lga chiqishdan oldin",
    title: "Viza va ro'yxatdan o'tish",
    summary:
      "Ziyoratchilar rasmiy kanallar orqali qanday ro'yxatdan o'tib, Haj yoki Umra vizasini oladi.",
    steps: [
      {
        title: "Nusuk platformasi",
        body: "Nusuk (nusuk.sa) — Saudiya Arabistonining Haj va Umra uchun rasmiy platformasi bo'lib, u orqali viza, turar joy, transport va ro'yxatdan o'tgan sayohat paketlarini band qilish mumkin. Faqat Nusuk yoki uning orqali litsenziyalangan agentliklardan foydalaning; norasmiy vositachilar ko'pincha firibgarlik va bekor qilingan sayohatlarning manbaidir.",
      },
      {
        title: "Haj vizalari va davlat kvotalari",
        body: "Har bir davlat yillik Haj kvotasini oladi, shuning uchun ziyoratchilarning ko'pchiligi yakka tartibda emas, balki o'z milliy Haj idorasi yoki litsenziyalangan mahalliy agent orqali murojaat qiladi. Haj mavsumi ochilgan yilning boshida erta murojaat qiling — kvotalar va paket o'rinlari oylar oldin to'lib qoladi.",
      },
      {
        title: "Umra vizalari",
        body: "Hajdan farqli o'laroq, Umraning kvotasi yo'q va yilning istalgan vaqtida bajarilishi mumkin. Ko'pchilik fuqarolar to'g'ridan-to'g'ri Nusuk yoki tasdiqlangan sayohat agenti orqali Umra vizasiga murojaat qilishi mumkin, odatda parvoz va mehmonxona bandini bilan birga.",
      },
    ],
  },
  {
    day: "Yo'lga chiqishdan oldin",
    title: "Yuk yig'ish ro'yxati",
    summary: "Sayohatdan oldin yig'ib olishingiz kerak bo'lgan amaliy zarur narsalar.",
    steps: [
      {
        title: "Ehrom kiyimlari",
        body: "Erkaklar kamida ikki to'plam tikilmagan ehrom kiyimini (bel matosi va yelka matosi) va pul va hujjatlar uchun keng, teridan bo'lmagan ehrom kamarini olishi kerak. Ayollar keng, oddiy, bezaksiz tashqi kiyim olishi kerak.",
      },
      {
        title: "Poyabzal va qulaylik",
        body: "Osongina kiyilib-yechiladigan ochiq sandallar zarur, chunki to'piqni yopadigan poyabzal erkaklar uchun ehromda taqiqlanadi. Uzoq kutish uchun yengil ryukzak, to'ldiriladigan suv butilkasi va kichik namoz gilamchasini olib boring.",
      },
      {
        title: "Hidsiz gigiyena vositalari",
        body: "Hidsiz sovun, quyoshdan himoya kremi va ho'l salfetkalar olib boring — hidli mahsulotlar ehromda taqiqlangan. Kichik birinchi yordam to'plami, shifokor tavsiyasi bilan shaxsiy dorilar va ko'p yurish tufayli pufakchalar uchun leykoplastir qo'shimcha og'irlikka arziydi.",
      },
      {
        title: "Hujjatlar va zarur narsalar",
        body: "Pasportingizni, viza chiqarmasini, emlash sertifikatini (odatda meningit talab qilinadi) va favqulodda aloqa raqamlarini kiyim ostida kiyiladigan yupqa cho'ntakda saqlang. Ko'chma quvvat banki va mahalliy SIM yoki eSIM to'lqinli joylarda yo'l topishni ancha osonlashtiradi.",
      },
    ],
  },
  {
    day: "Yo'lga chiqishdan oldin",
    title: "Muqaddas joylar yo'nalishnomasi",
    summary: "Tashrif buyuradigan asosiy joylar haqida qisqa amaliy izohlar.",
    steps: [
      {
        title: "Masjid al-Harom, Makka",
        body: "Ka'bani o'rab turgan Buyuk Masjid — tavof va sa'iy joyi. U kecha-kunduz ishlaydi; Qora tosh yaqinida va besh kunlik namoz vaqtida, ayniqsa Ramazonning oxirgi o'n kechasida va Haj kunlarida juda katta izdihomni kutish kerak.",
        location: "Makka",
      },
      {
        title: "Masjid an-Nabaviy, Madina",
        body: "Payg'ambar ﷺ masjidi, Ravza va u kishining dafn etilgan joyini o'z ichiga oladi, Hajning o'zi qismi emas, lekin deyarli barcha ziyoratchilar Hajdan oldin yoki keyin Madinaga tashrif buyuradi. Ravzaga kirish uchun Nusuk yoki Ravza dasturi orqali band qilingan vaqtli kirish ruxsatnomasi kerak.",
        location: "Madina",
      },
      {
        title: "Mina",
        body: "Makkadan bir necha kilometr uzoqlikdagi chodirlar shahri, u yerda ziyoratchilar Zulhijjaning 8, 11, 12 (va 13) kechalarini o'tkazadi. Konditsionerli, olovga chidamli chodir lagerlari sayyohlik operatori tomonidan tayinlanadi; asosiy umumiy sharoitlar va Jamarotgacha uzoq yurishlarni kutish kerak.",
        location: "Mina",
      },
      {
        title: "Arafot",
        body: "Makkadan taxminan 20 km uzoqlikdagi ochiq tekislik, Hajning eng muhim yagona marosimi — 9-Zulhijjadagi turishning joyi. Soyabon inshootlar va suv nuqtalari taqdim etiladi, ammo kunduzgi issiqlik kuchli; suv ichish va quyoshdan himoyalanish juda muhim.",
        location: "Arafot",
      },
      {
        title: "Muzdalifa",
        body: "Arafot va Mina orasidagi ochiq maydon, u yerda ziyoratchilar 9-10-Zulhijja kechasini ochiq osmon ostida o'tkazadi va toshbo'ron uchun mayda toshlar to'playdi. Sharoitlar ataylab minimal — gilamcha olib boring va sovuq kecha havosi uchun kiyinib boring.",
        location: "Muzdalifa",
      },
    ],
  },
  {
    day: "Yo'lga chiqishdan oldin",
    title: "Rasmiy manbalar",
    summary: "Ishonchli va yangilangan rasmiy ma'lumotni qayerdan topish mumkin.",
    steps: [
      {
        title: "Nusuk (nusuk.sa)",
        body: "Saudiya Haj va Umra vazirligining viza, akkreditlangan paketlar, Ravza tashrif ruxsatnomalari va real vaqtdagi izdiham va transport bo'yicha yo'riqnoma uchun rasmiy portali va dasturi — har qanday rasmiy savol uchun birinchi manzil.",
      },
      {
        title: "Mamlakatingizning Haj idorasi",
        body: "Ko'pchilik davlatlar yillik kvotani boshqaradigan, mahalliy agentlarni tekshiradigan va ketish jadvallari va sog'liq talablarini e'lon qiladigan milliy Haj idorasi yoki vazirlik bo'limini yuritadi — har qanday xususiy agent orqali band qilishdan oldin uni tekshiring.",
      },
      {
        title: "Visit Saudi (visitsaudi.com)",
        body: "Qirollikning rasmiy sayyohlik sayti kirish talablarini, munosib fuqarolar uchun elektron viza ma'lumotlarini va Makka, Madina va Saudiya Arabistoni ichida keyingi sayohat uchun amaliy sayohat maslahatlarini o'z ichiga oladi.",
      },
      {
        title: "To'lashdan oldin tekshiring",
        body: "Faqat Nusukda ro'yxatga olingan agentliklar yoki milliy Haj idorangiz orqali band qiling. Agar taklif g'ayrioddiy arzon ko'rinsa yoki vositachi rasmiy kanallardan tashqarida to'lov talab qilsa, buni ogohlantiruvchi belgi deb bilib, to'g'ridan-to'g'ri vazirlik portali orqali tekshiring.",
      },
    ],
  },
];
