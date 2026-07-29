// Uzbek translation overlays for the Learn Qur'an content.
// Each overlay mirrors the order of its English source array in ../quran-guide*.ts
// (index-aligned); untranslated entries fall back to English. Only human-readable
// text is translated — ids, routes, surah/ayah numbers, collections, citations,
// grades, and Qur'an verse-reference labels stay in the English source.
import type {
  QuranGuideApplyChallenge,
  QuranGuideDailyLesson,
  QuranGuideLetter,
  QuranGuideMemorizationPlan,
  QuranGuidePronunciationPair,
  QuranGuideQuizQuestion,
  QuranGuideReadingLevel,
  QuranGuideStory,
  QuranGuideStructureLevel,
  QuranGuideTadabburPrompt,
  QuranGuideTajweedLesson,
  QuranGuideTheme,
  QuranGuideTimelineEvent,
  QuranGuideTopic,
  QuranGuideVocabEntry,
} from "../../types/quran-guide";
import type { DeepPartial } from "./localize";

export const QURAN_GUIDE_TOPICS_UZ: DeepPartial<QuranGuideTopic>[] = [
  {
    title: "Kirish",
    summary: "Qur'on nima, u nima uchun nozil qilingan, tilovatning fazilatlari.",
    body: [
      "Qur'on so'zi arabcha qara'a o'zidan kelib chiqqan bo'lib, o'qish yoki ovoz chiqarib o'qish ma'nosini bildiradi - shuning uchun Kitob o'z nomi bilan o'z maqsadiga ega: u tilda va qalbda qayta-qayta o'qilishi uchun mo'ljallangan. Sunniylikning asosiy e'tiqodida Qur'on Allohning so'zma-so'z, yaratilmagan nutqi bo'lib, Muhammad payg'ambarga Jabroil farishta orqali, taxminan 23 yil davomida, ya'ni Hiro g'oridagi birinchi so'zlardan to Rasululloh sollallohu alayhi vasallam vafotigacha aniq arab tilida nozil qilingan.",
      "U Muso, Dovud va Iso (alayhissalom)ga kelgan avvalgi vahiylardagi haqiqatni tasdiqlovchi va ular yetkazgan xabarni yakunlovchi insoniyatga yuborilgan oxirgi kitobdir. Alloh taolo uning maqsadini ochiq-oydin bayon qiladi: “Odamlar uchun hidoyat”, ya’ni odamlarni chalkashlik va butparastlik zulmatidan tavhid nuriga chiqarish, yolg‘iz Allohga ixlos bilan ibodat qilish, to‘g‘ri xulq va oxiratga jiddiy tayyorgarlik ko‘rish uchun nozil qilingan. Har bir payg'ambar o'sha o'zaga da'vat qilgan; Qur'on uning oxirgi, himoyalangan shaklidir.",
      "Qur'on tilovat qilishning o'zi faqat ma'lumot o'qish emas, balki ibodatdir. Rasululloh sollallohu alayhi vasallam har bir o'qilgan har bir harf yaxshilik keltiradi va har bir yaxshilik kamida o'n barobar ko'paytiriladi, deb o'rgatganlar - shuning uchun hatto bir satrni yangi boshlovchi ham allaqachon savob to'plagan bo'ladi. Qiyomat kuni Qur'on shafoatchi bo'lib keladi va bu hayotda o'zi bilan birga bo'lganlar nomidan iltijo qiladi. Uni ravon o‘qigan kishi olijanob farishta ulamolari safida bo‘lib, ilm olishga qiynalib, qoqilib qolgan kishi mehnatiga ikki baravar savob oladi.",
      "Bu Qur'on nima emasligini tushunishga yordam beradi. Qur'on Alloh taoloning arab tilidagi so'zma-so'z so'zlari bo'lib, nozil qilinganidan beri o'zgarmagan. Hadislar - Payg'ambar sollallohu alayhi vasallamning so'zlari, xatti-harakatlari va so'zsiz roziliklari - alohida: ular Qur'onni tushuntiradi va ko'rsatadi, lekin Rasululloh sollallohu alayhi vasallamning ifodasi bo'lib, rivoyatlar zanjirida saqlangan va ulamolar tomonidan sahih (sahih), hasan (yaxshi) yoki zoif (zaif) deb baholangan. Ikkalasi ham vahiy, ikkalasi ham majburiydir, lekin ibodatda ibodat sifatida faqat Qur'on o'qiladi va faqat Qur'on Allohning mo''jizaviy, betakror kalomidir.",
    ],
    quran: [
      {
        excerpt: "Ramazon oyi, unda insoniyatga hidoyat bo'lib Qur'on nozil qilingan...",
      },
      {
        excerpt:
          "Ayting: «Agar insonlar va jinlar ushbu Qur'onga o'xshashni keltirish uchun to'plansalar, bas, qila olmadilar...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim Allohning Kitobidan bir harf o'qisa, unga hasana bo'ladi va hasana o'nga ko'paytiriladi.",
      },
      {
        excerpt: "Qur'on o'qing, chunki u qiyomat kuni o'z sahobalariga shafoatchi bo'lib keladi.",
      },
      {
        excerpt:
          "Qur'onni yaxshi bilgan zot oliyjanob, solih ulamolar bilan birga bo'ladi va uni qiyinchilik bilan, duduqlanib o'qigan kishi ikki barobar ajr oladi.",
      },
    ],
    actions: [
      "Qur'on uchun qat'iy kunlik vaqtni belgilang - hatto besh daqiqa ham baraka va mustahkamlikni mustahkamlaydi.",
      "Hech bo'lmaganda bitta satrni ma'no bilan o'qing: arabchani o'qing, keyin tarjimani sekin o'qing.",
      "Munibning Qur'on o'quvchisini oching va to'xtagan joyingizdan davom eting.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qur'on qanday nozil qilingan",
    summary: "Hiro g'ori, Jabroil, Makka va Madina davrlari, yig'ish, saqlash.",
    body: [
      "Ramazon oyida Ramazon oyida Payg'ambarimiz sollallohu alayhi vasallam qirq yoshda bo'lib, yolg'izlik va fikr yuritish uchun Makka tashqarisidagi tog'dagi Hiro g'origa chekinishganlarida boshlangan. U yerda Jabroil farishta kelib: «O‘qing!» — dedi. Rasululloh sollallohu alayhi vasallam o'qimagan va yozmagan bo'lsa, farishta uni quchoqlab, \"Alaq\" surasining dastlabki besh oyatini yetkazmaguncha: \"Yaratgan Parvardigoringiz nomi bilan o'qing\", - deb javob berdilar. Shunda u uyiga xotini Xadicha roziyallohu anhuning huzuriga qaytib keldi va u uni tinchlantirib, qarindoshi Varaqa ibn Navfalning oldiga olib bordi.",
      "Keyin vahiyda (fatratda) bir oz to'xtab qoldi, bu sukunat davri Payg'ambar sollallohu alayhi vasallamni ko'proq narsani xohlardi. keyin yana davom etdi va umrining oxirigacha bosqichma-bosqich davom etdi. Vahiy birdaniga nozil bo'lmagan, balki voqealar, savollar va jamiyatning o'sib borayotgan ehtiyojlariga javoban nozil qilingan - Alloh taolo Payg'ambar sollallohu alayhi vasallamning qalblarini mustahkamlash va Kitobni odamlar hayotiga engillashtirish deb ta'riflagan bosqichma-bosqich usul.",
      "Makka davri taxminan o'n uch yil davom etdi. Uning suralari ko'pincha qisqa, ritmik va kuchli; Ular asoslarni - Ollohning yagonaligini, qayta tirilish va hisob-kitobning aniqligini, rad etilgan payg'ambarlarning keyin oqlangan hikoyalarini va butparastlik va adolatsizlikka botgan jamiyatda axloqiy islohotga da'vatni mustahkamlaydi.",
      "Milodiy 622 yilda Madinaga hijrat qilingandan so'ng, musulmonlar endi quvg'inga uchragan ozchilik emas, balki jamiyat quruvchi jamoa edi. Madinalik vahiylar, odatda, uzoqroq va batafsilroq bo‘lib, yangi ummatga zarur bo‘lgan qonun va ijtimoiy tartibni belgilab beradi: namoz, zakot, ro‘za, meros, nikoh va ajralish, shartnomalar, urushlar va ahdnomalarning o‘ziga xos xususiyatlari hamda jamiyatni ichdan izdan chiqargan munofiqlar uchun qattiq so‘zlar.",
      "Matnning saqlanishi Payg'ambar sollallohu alayhi vasallamning hayotlik davrida boshlangan. Sahobalar vahiy kelganda yod olishdi, ulamolar esa Payg'ambar sollallohu alayhi vasallamning bevosita nazorati ostida pergament, xurmo poyalari, suyak va toshlarga yozib qo'yishdi. Yamoma jangida ko‘plab hofizlar shahid bo‘lgach, Abu Bakr Zayd ibn Sobitga yozma Qur’onni bir to‘plamga (suhuf) to‘plashni buyurdi. Keyinchalik, imperiya keng tarqalib, shevalar xilma-xil bo'lganligi sababli, Usmon quraysh lahjasida nufuzli nusxalarini tayyorladi va yirik shaharlarga yuborilib, butun ummat uchun bitta yozma matnni standartlashtirdi.",
      "Alloh taoloning O‘zi Qur’oni karimning himoyasiga kafolat bergan: “Albatta, eslatmani Biz nozil qildik va, albatta, Biz uni saqlaguvchimiz”. Bu va'da bir-biriga bog'langan uchta kafolat orqali amalga oshdi: har bir avlodda ommaviy yodlash, diqqat bilan yozma ravishda etkazish va Payg'ambarimiz sollallohu alayhi vasallamga etib boruvchi uzluksiz o'qituvchidan shogirdga qiroat zanjiri. Mo'min uchun bu ilohiy belgidir; tarixchi uchun bu hujjatlashtirilgan fakt: bugun tilovat qilinayotgan Qur'on o'n to'rt asr oldin nozil qilingan matndir.",
    ],
    quran: [
      {
        excerpt: "Albatta, zikrni Biz nozil qildik va, albatta, Biz uni saqlaguvchimiz.",
      },
      {
        excerpt: "Yaratgan Robbing nomi bilan o'qing...",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qur'onning tuzilishi",
    summary: "114 sura, 30 juz, oyat, Makkiy/Madaniy, tartib va ​​vahiy.",
    body: [
      "Mus'haf - Qur'onning jismoniy nusxasi - har biri o'z nomiga ega bo'lgan 114 surani (bobni) o'z ichiga oladi, odatda undagi ajoyib so'zdan olingan. Ular asosan eng uzundan eng qisqasiga qarab tartiblangan, lekin qat'iy bo'lmasa-da: Al-Fotiha, ya'ni qisqa bosh bo'lim Kitobga kirish eshigi sifatida birinchi o'rinda turadi, undan keyin esa uzun Al-Baqara. Bu tartib tavqifidir - tartib Payg'ambar alayhissalomga Jabroil tomonidan o'rgatilgan va oyatlarning nozil bo'lish tartibi emas. Demak, siz mus'hafda o'qigan ketma-ketlik xronologik emas, ataylab va ilohiy sobitdir.",
      "Har bir sura Makkiy (hijratdan oldin nozil qilingan) yoki Madaniy (undan keyin nozil qilingan) deb tasniflanadi va bir nechtasi ikkalasining oyatlarini o'z ichiga oladi. Qoida tariqasida, Makkiy suralarida e'tiqod - tavhid, tirilish va payg'ambarlar hikoyalari - qisqaroq, shoshilinchroq bo'laklarga e'tibor qaratiladi, Madaniy suralar esa o'rnashgan jamiyat uchun zarur bo'lgan batafsil qonunchilik va jamoat rahbarligini qo'shadi. Qaysi biri ekanligini bilish surani to'g'ri o'qishga yordam beradi.",
      "Boshqariladigan o'qish uchun Qur'on ham juz (ko'plik ajza') deb ataladigan 30 ta teng qismga va har bir juz hizb deb ataladigan ikki qismga bo'lingan va jami 60 ta hizb beradi. Qur'onni bir oyda to'liq nihoyasiga yetkazish - Ramazon xatmi shunchalik tabiiyki: kuniga bir juz Kitobni o'ttiz kunda tugatadi va kuniga ikki marta yarim juz ham yumshoqroqdir. Har bir sura ichidagi oyatlar (oyatlar) raqamlangan bo'lib, har qanday parchani aniq sura sifatida keltirish mumkin: oyat; Madinaning standart soni 6236 oyatni tashkil etadi, faqat bir nechta oyat chegaralari qanday raqamlanganligi bo'yicha kichik, yaxshi hujjatlashtirilgan farqlar bilan - matnning o'zi bir xil.",
      "Ushbu tuzilmani tushunish noaniq niyatlarni aniq rejaga aylantiradi. Siz kunlik belgilangan qismni belgilashingiz mumkin, yod olish uchun Juz Ammani (oxirgi, oʻttizinchi qism, qisqa suralarga toʻla) nishonlashingiz, bir nechta suralar boʻylab sabr kabi bir mavzuga amal qilishingiz yoki Ramazon oyi atrofida toʻliq oʻqishni rejalashtirishingiz mumkin. Tuzilish Qur'on bilan umrbod munosabatlarga erishish mumkin bo'lgan iskaladir.",
    ],
    quran: [
      {
        excerpt: "...Oyatlari mufassal kitob, biladigan qavm uchun arabcha Qur'ondir.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "O'qishni o'rganing",
    summary: "Alifbodan ravon tilovatgacha yetti daraja - mutlaqo yangi boshlanuvchilar uchun.",
    body: [
      "Deyarli har bir musulmon Qur'onni asl arab tilida o'qishni orzu qiladi va bu har qanday yoshda to'liq erisha oladigan maqsaddir - arab tilini bilmagan son-sanoqsiz kattalar ravon qiroat qilishni o'rganadilar. Tarjimani tushunish qimmatlidir, lekin haqiqiy arabcha so'zlarni o'qishning o'zi ibodatdir va bu harakatga arziydi. Bu yo'l sizni bir harfni tanimaslikdan to to'g'ri talaffuz bilan misralarni o'qishgacha bosqichma-bosqich olib boradi.",
      "Sayohat ettita tabiiy bosqichdan o'tadi. 1 va 2-darajalar harflarni tanib olishni rivojlantiradi - avval 28 ta harf alohida shaklda, so'ngra ularning shakllari so'z boshida, o'rtasida va oxirida qanday o'zgaradi. 3-darajali harakat, kichik belgilar (fatha, kasra, damma, sukun, shaddah, tanvin) bilan tanishtiriladi, ular sizga har bir harf qaysi unlini olib borishini bildiradi. 4 va 5 darajalar bosiladi: siz harflarni bo'g'inlarga birlashtirasiz va \"al-\" aniq artikli uchun quyosh va oy harflari qoidalarini o'z ichiga olgan holda butun so'zlarni ovoz chiqarib aytasiz. 6 va 7-darajalar qisqa oyatlarga o'tadi va keyin tajvidning asosiy qoidalari qo'llaniladigan silliq, ravon tilovatga o'tadi.",
      "Ikki odat hamma narsani tezlashtiradi. Birinchidan, doimiy ravishda malakali qorilarni tinglang va aniq taqlid qiling - Qur'on quloqdan, og'izdan og'izga o'tgan, shuning uchun qulog'ingiz sizning eng yaxshi ustozingizdir; har bir tovushning ritmini, unlilarning uzunligini va shaklini nusxalash. Ikkinchidan, qog'oz yoki ekranda harflarni kuzatib boring va yozing, chunki qo'l ko'z va til o'rganayotgan narsalarni mustahkamlaydi.",
      "Bitta ogohlantirish: ilovalar va yozuvlar juda yaxshi yordamdir, lekin ular sizni odam kabi tuzata olmaydi. Rasululloh sollallohu alayhi vasallam Qur'onni to'g'ridan-to'g'ri Jabroil alayhissalomdan o'rganganlar va uni sahobalarga yuzma-yuz o'rgatganlar va to'g'ri qiroat doimo saqlanib qolgan. Sizni tinglash va o'zingiz eshita olmaydigan xatolaringizni tuzatish uchun mahalliy o'qituvchi yoki tuzilgan onlayn tajvid dasturini toping.",
    ],
    actions: [
      "Arab harflari bo'limida kuniga bitta harfni o'rganing - ko'ring, eshiting, ayting, yozing.",
      "Mushafdagi so'zlarga amal qilgan holda Fotiha surasini takror tinglang.",
      "Har hafta o'qiyotganingizni eshitish va tuzatish uchun mahalliy yoki onlayn o'qituvchini tayinlang.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tajvid",
    summary: "Go'zal va to'g'ri qiroat qoidalari - peshin sokin, madd, vaqf va boshqalar.",
    body: [
      "Tajvid biror narsani zo'r yoki go'zal qilish ma'nosini anglatadi. Bu fan sifatida har bir harfga o'z haqini berish - uning og'iz yoki bo'g'izdagi to'g'ri bo'g'in nuqtasi (maxraj), uning o'ziga xos xususiyatlari (sifati), unlilar va pauzalarning to'g'ri vaqtini bildiradi. Xulosa qilib aytadigan bo‘lsak, tajvid Qur’onni nozil qilinganidek o‘qish san’atidir.",
      "Bu juda muhim, chunki Qur'on tasodifiy o'qiladigan matn emas. U allaqachon o'rnatilgan tajvid bilan tushdi: Jabroil alayhissalom uni Rasululloh sollallohu alayhi vasallamga aniq talaffuz bilan o'qidilar, Payg'ambar alayhissalom sahobalarga xuddi shunday o'qidilar va ular buzilmagan holda bizga yetkazdilar. Harfni noto'g'ri yozish kichik narsa emas - harfni noto'g'ri talaffuz qilish so'zni butunlay o'zgartirishi mumkin (masalan, ta'kidlangan ḵ ni oddiy s yoki bo'g'iz harflarini ʿ va ḥ bilan chalkashtirib yuborish) va ba'zi joylarda Alloh taoloning kalimalarining ma'nosini o'zgartiradi. Tajvid ilmi aynan bundan himoya qilish uchun mavjud.",
      "Bir vaqtning o'zida hamma narsani o'zlashtirishingiz shart emas. Asosiy qoidalar tartib bilan o'rganiladi: peshin sakina va tanvin (izhor, idg'om, iqlob, ixfo) hukmlari, miim sukina hukmlari, turli xil madd (cho'zilish), qalqalah (yorug'lik ma'lum harflarga tegishi), g'unna (burun jarangi) va vaqf (qaerda va qanday to'xtash). Ularning har birida aniq ta'rif, kundalik misollar va mashq qilish uchun biror narsa bor va bu markaz ularni birma-bir bosib o'tadi.",
      "Qat'iy qoida: tajvidni faqat kitoblar yoki ilovalardan emas, balki malakali o'qituvchidan o'rganing. Xatolaringizni eshitadigan va ularni tuzatadigan odamga tilovat qiling - tajvid har doim shunday o'rgatilgan va bu haqiqiy aniqlikka va oxir-oqibat ijazaga (tasdiqlangan tilovat zanjiri) yagona ishonchli yo'ldir.",
    ],
    hadith: [
      {
        excerpt: "Sizlarning eng yaxshilaringiz Qur'onni o'rgangan va uni o'rgatuvchidir.",
      },
      {
        excerpt:
          "Qur'onni yaxshi bilgan zot oliyjanob, solih ulamolar bilan birga bo'ladi va uni qiyinchilik bilan, duduqlanib o'qigan kishi ikki barobar ajr oladi.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Arab harflari",
    summary: "Interaktiv alifbo — 28 ta harfning har biri uchun ism, tovush, misollar.",
    body: [
      "Arab alifbosi 28 ta harfdan iborat boʻlib, oʻngdan chapga yoziladi va oʻqiladi. Ingliz tilidan farqli o'laroq, aksariyat harflar yonidagi harflarga bog'lanadi, shuning uchun bitta harf yolg'iz turishi yoki so'z boshida, o'rtasida yoki oxirida o'tirishiga qarab biroz boshqacha shaklga ega bo'lishi mumkin. Xuddi shu harfni turli shakllarda aniqlashni o'rganish birinchi haqiqiy yutuqlardan biridir.",
      "Qur'on arab tilida asosiy harflar ustiga bir nechta qo'shimcha xususiyatlar qo'yilgan: hamza (glottal to'xtash), tovushni cho'zuvchi uzun unli alif, vav va ya harflari va \"al-\" aniq artiklidagi \"l\" ning talaffuz qilinishi yoki keyingi harfga ovozsiz qo'shilishini hal qiluvchi quyosh va oy harflari qoidasi. Haqiqiy so'zlar bilan uchrashganingizda, bu oddiy.",
      "Ushbu bo'limdagi har bir harf kartasi sizga harfning ajratilgan shaklini, uning nomini, transliteratsiyasini, amaliy talaffuz maslahatini va haqiqiy Qur'on misollarini beradi, shuning uchun siz tovushni abstraktda emas, balki kontekstda o'rganasiz. Eng samarali tartib - bu har bir harf uchun to'rt bosqichli tsikl: uni ko'ring, o'qilganini eshiting, o'zingiz ovoz chiqarib ayting, keyin yozing.",
      "Har bir yangi harfni siz allaqachon tanish bo'lgan so'zlarga bog'lang - Alloh, Rabbiy (Rabbiy), ar-Rahmon (Rahmon), Bismillah. Notanish shakllarni tanish ma'noga bog'lash ularni harflarni alohida burg'ilashdan ko'ra tezroq yopishtiradi.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Talaffuz",
    summary: "Qiyin harflarni o'zlashtiring - ayn, ha, sad, dad, qof va urg'u.",
    body: [
      "Arab tilida ingliz tilida aniq ekvivalenti bo'lmagan bir nechta tovushlar mavjud va bu erda ona tili bo'lmaganlar ko'pincha sirg'alib ketadi. Eng keng tarqalgan chalkashliklar o'qitilmagan quloqqa o'xshash, ammo og'iz yoki tomoqning turli joylaridan talaffuz qilinadigan harflar o'rtasida bo'ladi va ularni aralashtirish so'zning ma'nosini o'zgartirishi mumkin, shuning uchun ular maxsus amaliyotga loyiqdir.",
      "ṣ (ḍ), ḍ (ṭ), ṭ (ṭ) va ẓ (ẓ) ta'kidlangan harflar engilroq harflarning \"og'ir\" versiyalaridir. Ularni ishlab chiqarish uchun siz tilning orqa qismini ko'tarib, og'izni to'liqroq, chuqurroq tovush bilan to'ldirasiz, bu ona tilida so'zlashuvchilar bolaligida singdiriladi, lekin o'quvchilar ongli ravishda qurishlari kerak. Har bir urg‘uni to‘g‘ridan-to‘g‘ri yorug‘lik nisbati bilan solishtiring: s ga qarshi ḵ, d ạ ga, t ga ḱ, d ạ.",
      "Tomoq harflari boshqa katta to'siqdir. Ayn (ʿ) - tomoqning o'rtasidan kelgan ovozli siqilish va ha (ḭ) - kuchli, nafas oladigan ishqalanish - ingliz tilida ikkalasi ham mavjud emas va hech qanday yozma ta'rif ularni eshitishning o'rnini bosa olmaydi. Qof (q) tilning orqa qismidagi chuqur “k” boʻlib, oldingi kafdan (k) farqlanadi.",
      "Ishonchli usul - juftlarni yonma-yon solishtirish, keyin o'zingizni sekin, aniq murattal qiroatga qarshi tekshirish. Qisqa so'zni aytib o'z ovozingizni yozib oling, uni o'quvchiga qarshi o'ynang va sozlang. Yaxshisi, malakali o'qituvchi tinglang - ba'zi xatolarni o'zingizning yozuvingizda ushlash deyarli mumkin emas.",
    ],
    appLinks: [{}],
  },
  {
    title: "Qur'on lug'ati",
    summary: "Yuqori chastotali so'zlar - har safar o'qiganingizda ko'proq tushunasiz.",
    body: [
      "Bu dalda beruvchi fakt: yuqori chastotali so'zlarning nisbatan kichik to'plami - bir necha yuzlab so'zlar - Qur'on matnining juda katta qismini tashkil qiladi, chunki bir xil kalit so'zlar qayta-qayta takrorlanadi. Ushbu asosiy lug'atni o'rganish siz bajarishingiz mumkin bo'lgan eng yuqori ta'sirli qadamdir, chunki u qiroatni tovush oqimidan o'qiyotganingizda tushunadigan so'zlarga aylantiradi.",
      "Siz Qur'onni so'zma-so'z tarjima qilmaysiz - bu tafsir va tarjima ishi - lekin siz o'qish vaqtida Allohning ismlarini, amrlarini, va'dalarini va ogohlantirishlarini jonli ravishda taniy boshlaysiz. Eng ko'p ko'rinadigan va eng og'ir so'zlardan boshlang: Alloh, Robb (Robbim), rahma (rahm-shafqat), iymon (iymon), sabr (sabr), taqvo (xudoni bilish), dunyo (bu dunyo) va oxirat (oxirat). Ushbu langar to'plamidan bir vaqtning o'zida tashqariga qarab kengaytiring.",
      "Qiyinchilikdan ko'ra intervalgacha takrorlashdan foydalaning. Haftada beshta yangi so'zni o'rganish va ularning barchasini har kuni ko'rib chiqish sizni bir o'tirishda ellikta so'zni yodlab olib, ularni unutishdan ko'ra bir yilda ancha uzoqqa olib boradi. Alloh taolo Qur'onni qalbga oson qilib qo'yganini va'da qiladi - uning lug'atiga qat'iy yaqinlashing va bu osonlikni o'zingiz his qilasiz.",
    ],
    quran: [
      {
        excerpt: "Albatta, Biz Qur'onni zikr uchun oson qildik. Bas, zikr qiluvchi bormi?",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Tafsir",
    summary: "Vahiyni tushunish - umumiy ko'rinish, kontekst va tan olingan ilmiy manbalar.",
    body: [
      "Tafsir Qur'onning izohi va tafsirini anglatadi - oyat nimani anglatishini, nima uchun nozil bo'lganini va qanday amal qilishini tushuntirish. Bu Allohning so'zlari bo'lgani uchun ulamolar Qur'onni qanday izohlash borasida qat'iy tartib o'rnatdilar va unda qolish sizni xatodan saqlaydi.",
      "Eng to'g'ri tafsir bu Qur'onning o'zini o'zi tushuntiruvchisidir: bir joyda qisqa bo'lgan oyat ko'pincha boshqa joyda kengaytiriladi, shuning uchun Qur'on o'zining eng yaxshi tafsiridir. Keyinchalik sunnat bilan tushuntirish keladi, chunki Payg'ambar sollallohu alayhi vasallam vahiyni aniq qilish uchun yuborilgan va uning so'zlari va amaliyoti bizga uning qanday yashaganligini ko'rsatadi. Shundan so‘ng vahiyga guvoh bo‘lgan va uning mazmunini bevosita bilgan sahobalarning tushunchasi keladi, keyin esa ulardan keyin kelgan buyuk allomalar keladi. Oxirgi va eng pasti arab tilining o'zi tomonidan talqin qilinadi. Hech qanday o'rin yo'q - bu noto'g'ri shaxsiy fikr - matnda o'z g'oyalaringizni o'qish.",
      "Tafsirda asosiy vosita asbob al-nuzul, nozil bo'lish holatlaridir: oyatni qo'zg'atgan voqea yoki savolni bilish ko'pincha uning ma'nosini ochadi. Ammo bu xabarlarning o'zlari tasdiqlanishi kerak, chunki har bir rivoyat qilingan \"hodisalar\" ishonchli emas. Har bir sura uchun yaxshi tafsir o'zining tarixiy muhitini, uning asosiy mavzularini, asosiy oyatlarini va olib borish uchun amaliy saboqlarni beradi.",
      "Eng taniqli va ishonchli manbalar qatorida Ibn Kasir tafsiri (hadislar va dastlabki avlodlar so'zlaridan iqtibos keltirishda keng qamrovli va ehtiyotkorlik bilan), Tafsir as-Sa'diy (aniq, zamonaviy va amaliy ko'rsatmalarga qaratilgan) va klassik tafsir at-Tabariy (entsiklopedik, e'tiborli sharhlar) bor. Ma'noni o'rganganingizda, u qaysi manbadan kelganiga e'tibor bering. Ushbu markaz metodologiyani o'rgatadi; Oyatma-oyat o'rganish uchun to'plangan va masofaviy tafsirni bog'laydigan Munibning Qur'on o'quvchisidan foydalaning.",
    ],
    sources: [
      "Tafsir Ibn Kasir - qisqartirilgan inglizcha keng tarqalgan",
      "Tafsir as-Sa'diy — mavjud xulosalar",
      "Al-Vohidiyning Asbob an-Nuzul - vahiy holatlari (har bir voqeaning haqiqiyligini tekshirish)",
    ],
    disclaimer:
      "Tafsirning chuqurligi turlicha. Olimlar ixtilof qilganda, Alloh aniq aytmagan joyda aniqlik da'vo qilmasdan, farqga e'tibor bering.",
    appLinks: [{}],
  },
  {
    title: "Qur'on mavzulari",
    summary: "Iymon, ibodat, sabr, sadaqa, payg'ambarlar - mavzular bo'yicha guruhlangan oyatlar.",
    body: [
      "Qur'on darslik kabi tuzilgan emas, har bir bobda bitta mavzu. Buning o'rniga uning buyuk mavzulari - Allohning birligi, namoz, sabr-toqat, sadaqa, payg'ambarlar, oxirat, adolat, oila - ko'plab suralar bo'ylab, har safar yangi rakursda paydo bo'lib, qayta tiklanadi. Avvaliga takrorlash kabi ko'rinadigan narsa aslida mustahkamlashdir: mavzu kiritiladi, keyin chuqurlashtiriladi, so'ngra butun xabar bitta izchil chaqiruv bo'lmaguncha boshqasiga ulanadi.",
      "Qur'onni mavzu bo'yicha o'rganish ana shu birlikni namoyon qiladi. Qur'onda aytilgan, aytilgan, shukr qilish yoki Allohga tavakkal qilish haqida suralarini to'plaganingizda, alohida oyatlar bir-birini yoritadi va saboq yorqin va to'liq bo'ladi. Ushbu markazdagi har bir mavzu yozuvi tegishli oyatlarni birlashtiradi va sahih hadislarni qo'llab-quvvatlaydi, bu erda ular aniqlik, asosiy saboqlar va aniq harakatlarni qo'shadi, shuning uchun bilim nazariy bo'lib qolmaydi.",
      "Eng muhimi, mavzularni o'z hayotingiz bilan bog'lang. Ota-onaga mehribonlik, biznesda halollik, nikohda adolatlilik, o'z manfaatingizga qarshi bo'lsa ham adolat tarafdori bo'lish - bu mavhum boblar emas, balki Qur'on sizdan har kuni qabul qilishingizni so'ragan qarorlardir. Har bir mavzuni shaxsan sizga qaratilgan savol sifatida o'qing: bu mening bugungi ishimni qanday o'zgartiradi?",
    ],
    appLinks: [{}],
  },
  {
    title: "Qur'ondagi hikoyalar",
    summary:
      "Odam Atodan Muhammad alayhissalomgacha bo'lgan payg'ambarlar - darslar, joylar, tegishli oyatlar.",
    body: [
      "Qur'onda Odam alayhissalom, Nuh, Ibrohim, Yusuf, Muso, Iso va boshqa ko'plab payg'ambarlarning qissalari bayon etilgan va buning sababini ochiq-oydin bayon qilib: \"Ularning qissalarida aql egalari uchun ibrat bordir\". Bu hisoblar folklor yoki o'yin-kulgi emas. Ular iymon, sabr va har zamonda takrorlanadigan sinovlarga qanday dosh berishni o'rgatish uchun Alloh tomonidan tanlangan va aytilgan ko'rsatmadir.",
      "Ular orqali o'tadigan naqshga e'tibor bering. Payg'ambarlar qavmlarini yolg'iz Allohga ibodat qilishga chaqirdilar; ularni masxara qilishdi, qarshilik qilishdi va ko'pincha haydab chiqarishdi; Allohga tavakkul qilib, sabr-toqat bilan sabr qildilar. Oqibatda Allohning va'dasi ro'yobga chiqdi. Ularning qiyinchiliklarini o'qiyotganingizda, ularning qanday javob berganidan kuch oling - sizning darajangiz ularnikiga tengligini hech qachon tasavvur qilmasdan. Gap ularning mustahkamligi va ishonchini singdirish, maqomni solishtirish emas.",
      "Qur'onning o'zi bitta qissani ajratib ko'rsatadi: Alloh taolo uni \"qissalarning eng yaxshisi\" deb atagan Yusuf surasi. G'ayrioddiy tarzda, u bir surada boshidan oxirigacha aytiladi, shuning uchun uni bir o'tirishda davomiy sayohat sifatida o'qing - xiyonat, qullik va zindonda sabr-toqat, va nihoyat, kechirim va uchrashuv - va Allohning rejasi ko'rinadigan baxtsizliklar ortida qanday sodir bo'lishini tomosha qiling.",
    ],
    quran: [
      {
        excerpt: "Albatta, ularning qissalarida aql egalari uchun ibrat bordir...",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Qur'on mo'jizalari",
    summary: "Tilning takrorlanmasligi, saqlanishi, bashorati - ilmiy ehtiyotkorlik bilan.",
    body: [
      "Qur'onning markaziy mo''jizasi Qur'onning o'zidir. Arab she’riyatining eng fasodiy davrida savodsiz odamga nozil bo‘lgan bu asar o‘zining eng ashaddiy raqiblari – til ustalarini unga o‘xshagan bitta sura ham yaratishga ochiq da’vat qildi. O'n to'rt asr o'tgach, bu qiyinchilik hal qilinmadi. Uning ritorik kuchi, tuzilishi, mavzularining bir-biriga bog‘langanligi, yo‘l-yo‘riq va qonun-qoidalarining uyg‘unligi mumtoz fasohat ilmida (ilm al-baloga) o‘rganiladi va ular Qur’onning o‘z da’vosiga ko‘ra beqiyos bo‘lib qoladi.",
      "Uning saqlanishi ikkinchi, tekshirilishi mumkin bo'lgan belgidir. Matn yozma shaklda ham, puxta o‘tkazilgan qo‘lyozmalar orqali ham, og‘zaki ham qiroat orqali himoyalangan – qorilarning uzilmagan zanjirlari uni yodlab, avloddan-avlodga o‘rgatib kelmoqda. Bu taqvoning taxmini emas, hujjatlashtirilgan tarixdir va bu Allohning zikrni saqlash haqidagi va'dasini amalga oshiradi.",
      "Shuningdek, siz \"ilmiy mo''jizalar\" haqida eshitasiz - embrionning bosqichlari, koinotning kengayishi va shunga o'xshash oyatlar. Bularga ehtiyotkorlik bilan munosabatda bo'ling. Klassik tafsir ko'pincha bunday oyatlarni zamonaviy apologistlardan butunlay farqli tarzda tushungan va Qur'onni har bir o'zgaruvchan ilmiy farazga moslashtirishga majburlash, nazariyalar o'zgarganda teskari natija berishi mumkin. O'rnatilgan talqin va zamonaviy taxmin o'rtasidagi farqni aniqlang.",
      "Tarixiy bashoratlar ham olimlar tomonidan keltiriladi - rimliklarning bashorat qilingan g'alabasi, Makkaning tinch ochilishi - va ular o'rganishga arziydi, ammo shov-shuvli videokliplar emas, balki hushyor tafsir va sira orqali. Qur'on uchun eng kuchli dalil uning tavhidi, xalqning axloqiy o'zgarishi, tengsiz tili va saqlanishi bo'lgan.",
    ],
    quran: [
      {
        excerpt: "Agar rostgo'y bo'lsangiz, unga o'xshash sura keltiring.",
      },
    ],
    disclaimer:
      "Tekshirilganda da'vatni sharmanda qiladigan ilmiy mo''jizaviy da'volardan saqlaning. Tavhid, axloq va Qur’onning lisoniy va tarixiy dalillari bilan yetaklang.",
  },
  {
    title: "Yodlash (Hifz)",
    summary:
      "Juz Ammadan to'liq hifzga qadar rejalar — qayta ko'rib chiqish, audio, kundalik maqsadlar.",
    body: [
      "Qur'onni yod olish (hifz) mo'minning hayotidagi eng ezgu ishlardan biri bo'lib, u olimlar yoki bolalar uchun ajratilmagan - kattalar ham uni to'ldirishadi. Payg'ambarimiz sollallohu alayhi vasallam qiyomat kunida Qur'on ko'targan kishiga \"O'q va ko'taril\", deyiladi, har bir oyat bilan martaba ko'tariladi, deb o'rgatganlar. Hamma boshlanadigan joydan boshlang: siz allaqachon har bir namozda o'qigan Fotiha surasi, so'ngra mus'hafning eng oxiridagi qisqa suralar orqaga qarab ishlaydi.",
      "Hifzdagi eng muhim saboq qarama-qarshilikdir: murojaat yangi material qo'shishdan ko'ra muhimroqdir. Rasululloh sollallohu alayhi vasallam yodlangan Qur'on bog'langan tuya singanidan tezroq sirg'alib ketadi, uni qayta ko'rib chiqmay qo'yinglar va u yo'q bo'lib ketadi, deb ogohlantirdilar. Shunday qilib, qoida oddiy va qat'iy: siz allaqachon ushlab turgan narsani qat'iy qayta ko'rib chiqmaguningizcha, hech qachon yangi qism qo'shmang. Bir oz yodlangan qattiq uradi, bo'sh yodlangan ko'p.",
      "Amaliy usul: intervalgacha takrorlashdan foydalaning, bitta o'quvchiga yopishib oling, shunda kuyning o'zi sizning xotirangizga ishora qiladi, faqat o'qishdan ko'ra har kuni xotiradan ayting va o'qituvchiga tinglang va xatolaringizni belgilang - o'zingiz eshita olmaydigan xatolar. Munibning hifz kuzatuvchisi individual oyatgacha bo'lgan taraqqiyotni qayd etadi, shuning uchun siz har doim qayta ko'rib chiqish uchun nima kerakligini bilib olasiz.",
      "Sahnangizga mos keladigan rejani tanlang. Boshlovchi: Juz Ammani yod oling, oxirgi qism, qisqa suralarga to'la. O'rta: al-Mulk, Ya-Sin va al-Kahf kabi tez-tez o'qiladigan o'nta surani qo'shing. Murakkab: toʻliq juzni oldingi hamma narsani kuchli qayta koʻrib chiqish bilan yakunlang. Hofiz safari: malakali ustoz bilan yodlangan butun mus'haf va ideal holda sanad - Payg'ambarimiz sollallohu alayhi vasallamga etkazishning tasdiqlangan zanjiri.",
    ],
    hadith: [
      {
        excerpt:
          "Qur'on sahobasiga aytiladi: Dunyoda o'qiganingizdek o'qing va ko'tariling, chunki sizning darajangiz oxirgi o'qigan oyatdadir.",
      },
      {
        excerpt:
          "Qur'onning hamrohi misoli bog'langan tuya egasining misolidir: agar uni boqsa, uni saqlaydi, qo'yib yuborsa, uni yo'qotadi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kundalik darslar",
    summary: "Har kuni bitta oyat, kontekst, mulohaza va harakat.",
    body: [
      "Qur'onga umrbod bog'liqlik har qanday chuqur odat qanday shakllangan bo'lsa, xuddi shunday shakllanadi - ozgina, har kuni, albatta. Rasululloh sollallohu alayhi vasallam Ollohga eng sevimli amallar kichik bo'lsa ham izchil bajariladigan amallar ekanligini va bu tamoyil kundalik darsning butun g'oyasi ekanligini o'rgatganlar. Ularning har biri sizga arab tilidagi bitta oyat, uning tarjimasi, tarixiy konteksti haqida eslatma, o'tirish uchun savol va kuningizda amalga oshirishingiz kerak bo'lgan aniq harakatlarni beradi.",
      "Ushbu oyatlarni o'qishdan o'tmasdan emas, balki jonli rahbarlik sifatida qabul qiling. Yuragingizni hayratda qoldirganlarni belgilang, ularga qayting va sizni hayajonga solgan narsalarni oilangiz bilan baham ko'ring - siz o'tkazgan yaxshilikni kimdir boshqa qilsa, uning mukofoti sizga ham yetadi, shuning uchun o'rgatish foydani ko'paytiradi.",
      "Kichik o'lcham sizni aldashiga yo'l qo'ymang. Mustahkamlik har safar shiddatlilikni oshiradi: har kuni Qur'on bilan besh halol daqiqa sizni oyda bir marta kamdan-kam uchraydigan qahramonlik soatidan ko'ra ko'proq o'zgartiradi. Har kuni ko'ring va kunlar to'planib qolsin.",
    ],
    appLinks: [{}],
  },
  {
    title: "Mulohaza (Tadabbur)",
    summary: "Yo'naltiruvchi savollar - Alloh nimani o'rgatadi va siz u bilan qanday yashaysiz?",
    body: [
      "Tadabbur Qur'onni chuqur mulohaza yuritish, bir oyatni qalbda o'zgartirishga undaguncha o'girishni anglatadi. Bu to'g'ridan-to'g'ri buyruqdir, ixtiyoriy qo'shimcha emas: Alloh taolo: «Ular Qur'on haqida fikr yuritmaydilarmi yoki qalblarida qulf bormi?» deb so'raydi. Qiroat qilishdan maqsad hech qachon oddiy bo'lmagan - bu yurakka etib borish va hayotni o'zgartirish edi.",
      "Tadabbur tafsir bilan bir xil emas. Tafsir - oyat nimani anglatishini ilmiy izohlash; tadabbur - bu ma'noni tushunganingizdan keyin sizning shaxsiy, hurmatli javobingiz. Ikkisi birga ishlaydi: avval tafsirdan tovush ma’nosini o‘rganasiz, keyin u bilan o‘tirib, siz bilan qanday gaplashayotganini so‘raysiz. Foydali ramka uchta savoldan iborat: Alloh menga bu erda nimani o'rgatadi? Bu bugungi ishimni qanday o'zgartiradi? Buning uchun qanday odatni yaratishim yoki yo'q qilishim kerak?",
      "Bitta qat'iy chegara tadabburni xavfsiz saqlaydi: oyat sizdan nimani so'rayotgani haqida o'ylang, lekin matnning o'zi uchun hech qachon yangi ma'nolarni o'ylab topmang. Haqiqiy tafsir tafsir chegaralarini belgilab qo'ysin va shaxsiy mulohazalaringizni o'z o'rnida saqlang - Munib jurnali kabi shaxsiy jurnal oyat sizni hayajonga solgan narsalarni yozib olish va unga keyinroq qaytish uchun ideal.",
    ],
    quran: [
      {
        excerpt: "Ular Qur'on haqida fikr yuritmaydilarmi yoki qalblarida qulf bormi?",
      },
      {
        excerpt:
          "Bas, ular Qur'on haqida fikr yuritmaydilarmi? Agar u Allohdan o'zga tomonidan bo'lganida edi, unda juda ko'p ziddiyat topgan bo'lur edilar.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qur'onga amal qiling",
    summary: "Bir oyatdan bugungi muammo - trekni yakunlash, oyatni yashash.",
    body: [
      "Qur'on ilmi amalga aylanishi nazarda tutilgan. Alloh taolo bizdan oldin kitob o'qigan, lekin unga qarshi yashayotgan kimsalarni qattiq tanqid qildi: \"Sizlar kitob o'qiyotganingizda, boshqalarga yaxshilikka buyurib, o'zingizni unutasizmi?\" Qur'on siz bilan Rabbingiz o'rtasidagi ahddir va har bir oyat sizdan jimgina bir narsani so'raydi - savol javob beradimi?",
      "Bu qiyinchiliklar aynan shu maqsadda. Ularning har biri ma’lum bir oyatni bugungi kun uchun amalga oshirilishi mumkin bo‘lgan yagona xatti-harakat bilan bog‘laydi: tilingizni yaxshi so‘z bilan asrang, sokin sadaqa bering, haromdan ko‘zingizni tiying, o‘zingizda ko‘tarilgan g‘azabni qo‘ying. Bitta oyat, bitta harakat - aslida qilish uchun etarlicha kichik, sizni o'zgartirish uchun etarlicha real.",
      "Mashg'ulotni chinakam bajarganingizdan keyingina tugallanganligini belgilang. Kuzatishning maqsadi ko'rsatish emas - bu maqsadni yo'q qiladi - lekin boshqalar ko'rmagan narsani ko'radigan Alloh oldida halol hisob berishdir. Vaqt o'tishi bilan misrama-yara qiroat shunday xarakterga aylanadi.",
    ],
    quran: [
      {
        excerpt:
          "Muqaddas Kitobni tilovat qilib, boshqalarga yaxshilikka buyurib, o'zingizni unutasizmi?",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Qur'on viktorina",
    summary: "Suraning nomlari, tuzilishi, tajvid, lug'at va hikoyalarni ko'rib chiqing.",
    body: [
      "O'z-o'zini sinab ko'rish - bilimlarni mustahkam qilishning eng samarali usullaridan biri - javobni eslab qolish xotirani shunchaki qayta o'qishdan ko'ra ko'proq mustahkamlaydi. Bu viktorina hubdagi barcha narsalarga asoslanadi: suralar va juzlar soni, birinchi vahiy va Qur'onning qanday saqlanganligi, madd va qalqala kabi tajvid qoidalari, yuqori chastotali lug'at va Qur'on hikoyalari bayon qilingan payg'ambarlar.",
      "Niyatni to'g'ri tuting. Bal faqat o'rganishingiz uchun ko'zgudir - u hech qachon yolg'iz Unga tegishli bo'lgan Alloh huzuridagi darajangizning o'lchovi emas. Har bir savoldan zaif nuqtani aniqlash uchun foydalaning, keyin mos keladigan darsga qayting va raqamni ta'qib qilishdan ko'ra aynan shu mavzuni o'rganing.",
      "Yakuniy so'rov baholi savol emas, balki mulohazadir: keyingisini tushunish va yodlash uchun bitta sura yoki parchani tanlang, shuning uchun sharhingiz har doim sizni Kitobning o'ziga qaytarish bilan yakunlanadi.",
    ],
    appLinks: [{}],
  },
  {
    title: "Ma'lumotnomalar va manbalar",
    summary: "Qur'on, hadis, tafsir va ilmiy farqlarni qanday keltiramiz.",
    body: [
      "Sog'lom islomiy ta'lim shaffof dalillarga asoslanadi, shuning uchun ushbu markazdagi har bir dars o'z ishini ko'rsatishga qaratilgan. Qur'on haqidagi da'vo sura:ayah; Sunnat da'vosida to'plam nomi (Buxoriy, Musulmon, Termiziy va boshqalar), hadis raqami va uning darajasi (sahih, hasan yoki zaifroq); oyatning ma'nosi haqidagi da'vo u kelgan tafsirni nomlaydi; va olimlar chinakam farq qiladigan joyda, farq yashirin emas, balki qayd qilinadi.",
      "Bundan tashqari, aniq bo'lgan narsani sharhlovchidan farqlash muhimdir. Aniq dalillar - besh vaqt namoz, Qur'onning saqlanishi, siyratning asosiy voqealari - ochiq-oydin bayon etilgan. Esxatologiyaning nozik tafsilotlari yoki ilmiy ishoralarni o'qish kabi samimiy olimlar uzoq vaqtdan beri bir-biridan farq qilgan masalalar aniq ishonch sifatida emas, balki talqin sifatida taqdim etiladi. Ishonch dalillarning kuchiga mos kelishi kerak.",
      "Chuqurroq oʻrganish uchun ishonchli manbalarga tayaning: ishonchli Qurʼon tarjimalari (masalan, Sahih International yoki Pickthall), asosiy hadis toʻplamlari (asosan Sahih al-Buxoriy va Sahihi Musulmon), muhtaram tafsir (Ibn Kasir va as-Saʼdiy) va ishonchli sira (Ibn Hishom klassikasi va ar-Maxlid, ar-Raxlid, ar-Maxled). zamonaviy hikoya).",
      "Nihoyat, ilovaning chegaralarini bilib oling. Munib sizni o'rgatadi va manbalarga ishora qiladi, lekin diniy hukmlar chiqarmaydi. Qiroat fiqhi, tajvid ijozi yoki ibodat yoki hayot qarorlaringizga ta'sir qiladigan har qanday savol uchun o'z maktabingiz va hududingizdagi malakali olim bilan maslahatlashing.",
    ],
    sources: [
      "Qur'on — Qirol Fahd majmuasi bosma / haqiqiyligi tasdiqlangan raqamli mushaf",
      "Hadis — sunnah.com baholash o'zaro havola",
      "Tafsir Ibn Kasir (qisqartirilgan Dorussalom)",
      "Tafsir as-Sa'diy (inglizcha)",
    ],
    disclaimer:
      "Munib ochiq ta'lim mazmunini birlashtiradi. Muhim masalalarni mazhabingiz va mintaqangizdagi malakali olimlar bilan tekshiring.",
  },
];

export const QURAN_GUIDE_STRUCTURE_LEVELS_UZ: DeepPartial<QuranGuideStructureLevel>[] = [
  {
    count: "1 Kitob",
    detail:
      "Bitta kitob — kalom Alloh, Allohning so'zma-so'z nutqi bo'lib, Muhammad alayhissalomga Jabroil farishta orqali aniq arab tilida, taxminan 23 yil davomida asta-sekin nozil qilingan. Bu dunyoning hamma joyida bir xil matn.",
  },
  {
    count: "114",
    detail:
      "Qur'on atigi 3 oyatdan 286 tagacha bo'lgan 114 ta suraga bo'lingan. Har birining nomi bor, odatda uning ichidagi kalit so'zdan olingan va Makkiy yoki Madaniy deb tasniflanadi. Ularning mus'hafdagi tartibi vahiy (tavqifi) bilan sobit bo'lgan va vahiy tartibidan farq qiladi.",
  },
  {
    count: "30",
    detail:
      "O'qishni boshqarish uchun mo'ljallangan o'ttizta teng qism. Kuniga bir juz o'qish butun Qur'onni bir oyda tugatadi - bu Ramazon oyida xatmni tugatishning klassik usuli.",
  },
  {
    count: "60",
    detail:
      "Har bir juz ikkita hizbga bo'linadi, jami 60 tadan, har bir hizb esa choraklarga bo'linadi. Bu kichikroq birliklar sizga yumshoq kundalik qismni - yarim yoki chorak hizbni belgilashga va doimiy odatni saqlashga imkon beradi.",
  },
  {
    count: "6236",
    detail:
      "Ayrim oyatlar, shunday raqamlanganki, har qanday parcha aniq sura: oyat sifatida keltirilishi mumkin. 6,236 - standart Madina soni; boshqa tarixiy sanash usullari faqat bir nechta oyat chegaralari qanday belgilanganligi bilan farq qiladi - so'zlarning o'zi bir xil.",
  },
  {
    count: "2 davr",
    detail:
      "Har bir sura ikki nozil davrdan biriga tegishlidir. Makkiy (hijratdan oldingi) suralar ko'pincha qisqaroq bo'lib, e'tiqod, tavhid va oxiratga qaratilgan. Madaniy (hijratdan keyin) suralar ko'pincha uzunroq bo'lib, ularga qonun va jamoat yo'l-yo'riqlari qo'shiladi. Bir necha suralarda ikkalasidan ham oyatlar bor.",
  },
  {
    count: "Ko'pchilik",
    detail:
      "Qur'on mavzu bo'yicha tartibga solingan emas, balki takrorlanadigan mavzular atrofida to'qilgan. Tavhid, namoz, payg'ambarlar qissalari, oila, sadaqa, sabr va oxirat Kitobda ko'plab suralarda bir-birini mustahkamlab turadi.",
  },
];

export const QURAN_GUIDE_TIMELINE_UZ: DeepPartial<QuranGuideTimelineEvent>[] = [
  {
    title: "Vahiydan oldin hayot",
    body: "Payg'ambarlikdan oldingi yillarda Muhammad sollallohu alayhi vasallam Makka jamiyatining butparastligi va adolatsizligidan bezovtalanib, yolg'izlik va tafakkur kunlari uchun Hiro g'origa chekinar edilar. Garchi uning atrofidagi dunyo butlarga sig'inmagan bo'lsa-da, u hech qachon bunday qilmagan va uning xalqi unga shunchalik to'liq ishonishganki, u o'zini payg'ambar deb da'vo qilishdan ancha oldin uni al-Amin - ishonchli - deb atashgan.",
    location: "Makka",
  },
  {
    title: "Hira g'ori",
    body: "Ramazon oyida, qirq yoshga kirganlarida, Jabroil farishta g‘orga birgina amr bilan keldi: “O‘qing!”. Rasululloh sollallohu alayhi vasallam o‘qishni ham, yozishni ham bilmas edilar, deb javob berdilar. Farishta uni uch marta mahkam quchoqlab, so‘ng “Alaq” surasining birinchi so‘zlarini yetkazdi: “Yaratgan Robbing nomi bilan o‘qing”. U qaltirab uyiga shoshilib xotini Xadichaning oldiga bordi, u uni choponga o‘rab, tinchlantirdi.",
    location: "Jabal an-Nur, Makka",
  },
  {
    title: "Birinchi vahiy — Alaq surasi",
    body: "O'qish amri payg'ambarlik va Qur'onning nozil bo'lishining boshlanishi edi. Xadicha uni o'zining ilmli qarindoshi Varaqa ibn Navfalning oldiga olib bordi. U farishtani Muso alayhissalomga kelgan o'sha elchi ekanligini bilib, Payg'ambar alayhissalomning qavmi uni haydab chiqarishlarini bashorat qildi. Keyingi Makka vahiylari Allohning yagonaligi, oxiratning aniqligi va axloqiy islohotga da'vatga qaratilgan edi.",
  },
  {
    title: "Erta Makka davri",
    body: "Birinchi yillarda qo'ng'iroq shaxsiy, keyin esa ommaviy edi. Quraysh kuchaygani sari quvg'inga o'tib, mo'minlarning zaif va qullarini qiynoqqa solib, oxir-oqibat Payg'ambar alayhissalomning Banu Hoshim qabilalariga qarshi uch yillik qattiq boykot e'lon qildi. Shafqatsizlikdan qutulish uchun bir guruh musulmonlar Habashistonga hijrat qilishdi va u erda adolatli nasroniy podshoh ularga boshpana berdi. Bu davrdagi suralar odatda qisqa, kuchli, ritmik oyatlarda gapiriladi.",
    location: "Makka",
  },
  {
    title: "Madinaga hijrat",
    body: "Yillar davom etgan quvg‘inlardan so‘ng, Xadicha va amakilari Abu Tolibdan ayrilgan “qayg‘u yili”dan so‘ng, Payg‘ambarimiz sollallohu alayhi vasallam sahobalari bilan Madinaga hijrat qildilar. Bu hijrat shu qadar muhim ediki, keyinchalik u islom taqvimining boshlanishiga aylandi. Madinada musulmonlar endi ovlangan ozchilik emas, balki jamiyatni barpo etuvchi jamoa edilar va endi vahiy qonun, oila, iqtisod va ahli kitoblar bilan aloqalarni ko'rib chiqa boshladi.",
    location: "Madina",
  },
  {
    title: "Madina davri",
    body: "Madinalik suralar, odatda, uzoqroq va batafsilroq bo'lib, o'troq jamiyatga zarur bo'lgan qonunlarni belgilaydi: namoz, zakot, ro'za, nikoh va ajralish, meros, shartnoma va bitimlarning o'ziga xos xususiyatlari. Bu davrda ham yirik janglar - Badr, Uhud va ittifoqchilar - Qur'on mo'minlarning sinovlari va munofiqlarning hiyla-nayranglariga aniqlik bilan murojaat qilgan.",
    location: "Madina",
  },
  {
    title: "Xayr ziyorati",
    body: "Hijratning o‘ninchi yilida Rasululloh sollallohu alayhi vasallam o‘zlarining yagona hajlarini ado etib, Arafotdagi keng yig‘ilish oldidan “Vidolashuv xutbasini” o‘qidilar va ummatga jon va mulkning muqaddasligini, ayollarning haq-huquqlarini, irqidan qat’i nazar, barcha insonlar tengligini, Qur’on va Sunnatni mahkam tutish burchini eslatib o‘tdilar. Shu yerda: “Bugun sizlar uchun diningizni mukammal qildim”, degan oyat nozil bo‘ldi.",
    location: "Arafat / Mino",
  },
  {
    title: "Abu Bakr davridagi to'plam",
    body: "Rasululloh sollallohu alayhi vasallam vafotlaridan ko'p o'tmay, Yamoma jangida Qur'onni to'liq yod olgan ko'plab sahobalar halok bo'ldilar. Umar huffazni yo'qotishdan qo'rqib, xalifa Abu Bakrni Qur'onni bir joyga yig'ishga undaydi. Abu Bakr ishonchli kotib Zayd ibn Sobitni sahobalarning xotiralari bilan tasdiqlangan yozma vahiylarni bir varaq (suhuf) qilib to'plagan holda tayinladi.",
  },
  {
    title: "Standartlashtirilgan mushaf — Usmon",
    body: "Islom ko'plab mamlakatlarga tarqalgach, yangi musulmonlar o'rtasida qiroatdagi tafovutlar nizolarni keltirib chiqara boshladi. Ummatni bir yozma matn ustida birlashtirish uchun xalifa Usmon Abu Bakrning suhufidan Quraysh shevasidagi nufuzli nusxalarga ega bo'lib, boshqa shaxsiy nusxalarni ajratib qo'yishni so'rab, yirik shaharlarga jo'natgan. Bu Usmoniy mushaf o'shandan beri butun musulmon olami amal qilgan standartdir.",
  },
  {
    title: "Bugungi kungacha saqlanib qolgan",
    body: "O'n to'rt asrdan beri Qur'on o'zgarishsiz qolmoqda va bir-biriga bog'langan uchta vosita bilan himoyalangan: har bir avlodda ommaviy yodlash (hifz), sodiq yozma naql va Payg'ambarimiz sollallohu alayhi vasallamga yetib boruvchi uzilmagan ustozdan shogirdga qiroat zanjirlari. Bu Allohning: «Albatta, eslatmani Biz nozil qildik va albatta, Biz uni saqlaguvchimiz», degan va'dasini amalga oshiradi.",
  },
];

export const QURAN_GUIDE_STORIES_UZ: DeepPartial<QuranGuideStory>[] = [
  {
    prophetName: "Odam",
    title: "Odam - insoniyatning birinchi payg'ambari va otasi",
    summary: "Yaratilish, farishtalarning sajdasi, daraxtning sinovi, tavbasi qabul.",
    body: [
      "Alloh taolo birinchi inson bo'lgan Odam alayhissalomni o'z qo'li bilan loydan yaratdi, unga o'z ruhidan pufladi va unga hech bir jonzot nasib etmagan sovg'ani berdi: U Odamga hamma narsaning ismlarini o'rgatdi. Alloh bu ilmni namoyon qilganda, farishtalar o'z chegaralarini tan olishdi va Odam Atoning sha'ni ayon bo'ldi - ilmning o'zi insoniyatni ajratib turadigan narsaning bir qismi edi.",
      "Alloh taolo farishtalarga Odam alayhissalomga sajda qilishlarini buyurdi va jinlardan bo'lgan Iblisdan boshqa hammasi itoat qildilar. U o'zini olovdan, Odam alayhissalom loydan yaratilganligini va shuning uchun o'zini ustun deb hisoblab, takabburlik bilan rad etdi. Bu g‘urur, jaholat emas, uning halokati bo‘lib, Odam alayhissalomning avlodlarini yo‘ldan ozdirishga qasam ichgan.",
      "Odam Ato va uning xotini Havva jannatga joylashtirildi va ularga hamma narsadan bemalol bahramand bo'lishlari mumkin, lekin bitta daraxtga yaqinlashmasliklari kerakligini aytishdi. Shayton ularga pichirlab o'tirdi, toki ular undan yedilar. Shu zahotiyoq ularning yalang'ochliklari ko'rinib qoldi va ular o'zlarining xatolarini his qilishdi. Ular noumid bo'lish yoki uzr so'rashdan ko'ra: «Ey Robbimiz, biz o'zimizga zulm qildik, agar bizni mag'firat qilmasang va rahm qilmasang, albatta, ziyon ko'rganlardan bo'lamiz», dedilar.",
      "Alloh taolo ularning tavbalarini qabul qildi va ularni o'zboshimchalik bilan jazo sifatida emas, balki insoniy imtihonning boshlanishi sifatida, hidoyat va'dasi bilan birga yerga tushirdi: \"Kim Mening hidoyatimga ergashsa, zalolatga ham, qashshoqlikka ham duchor bo'lmaydi\". Shunday qilib, Odam Atoning hikoyasi har bir insonning hikoyasidir: sharaf bilan yaratilgan, sinovdan o'tgan, xato qilishga qodir va har doim qaytishga qodir.",
    ],
    lessons: [
      "Tavba eshigi hamisha ochiq — Odam alayhissalomning uzrsiz va kechiktirmasdan qilingan tavbasi har bir gunohkorga ibratdir.",
      "Takabburlik halokatning ildizidir: Iblis haqiqatni bilar edi, lekin mag'rurlikdan bosh tortdi va kamtarliksiz bilim halokatga olib kelishini ko'rsatdi.",
      "Shaytonning usuli kuch bilan emas, doimiy shivirlashdir - uning takliflarini tan olish ularga qarshilik ko'rsatishning yarmidir.",
      "Inson qadr-qimmati ilmga va Allohga qaytishga bog'liq, gunohsiz bo'lish emas - bu bizni aniqlaydigan xatoga javobdir.",
    ],
    quran: [
      {
        excerpt: "Odam Atoning yaratilishi va farishtalarning sajdasi.",
      },
      {
        excerpt: "Sinov, yiqilish va tavba.",
      },
    ],
    location: "Jannat, keyin yer",
  },
  {
    prophetName: "Nuh",
    title: "Nuh - asrlar davomida rad etilgan sabr",
    summary: "950 yil da'vat, Ark va to'fon ilohiy hukm sifatida.",
    body: [
      "Nuh alayhissalom butga sig'inib qolgan qavmga yuborilgan va u ularni hayratlanarli vaqt yolg'iz Allohga ibodat qilishga chaqirgan edi - Qur'onda u ular orasida ming yildan ellik yil kam bo'lgani aytilgan. Ularni kechayu kunduz, oshkora va yashirincha chaqirib, barcha sabablarni taklif qildi: mag'firat, yomg'ir, boylik, bolalar va bog'lar. Shunga qaramay, avloddan-avlodga yuz o'girdi, Uni masxara qildi va quloqlarini to'xtatdi.",
      "Boshqa hech kim iymon keltirmasligi aniq bo'lgach, Alloh taolo Nuh alayhissalomga kema qurishni buyurdi, qavmi uni dengizdan uzoqda katta kema yasagani uchun masxara qilishdi, lekin u buni tushunadigan kun keladi, deb javob berdi. Tandirdan suv otilib chiqqanda belgi keldi; Nuh mo'minlarni, faqat bir nechtasini va har xil hayvonlarning juftlarini o'z kemasiga oldi.",
      "To'fon ko'tarilib, rad etuvchilarni g'arq qildi. Hikoyaning eng dahshatli daqiqalaridan birida Nuhning o'g'li suvdan qochish uchun toqqa chiqishni ta'kidlab, kemaga chiqishdan bosh tortdi va u cho'kib ketganlar orasida edi - otaning qayg'usi o'g'ilning ishonchsizligini bartaraf eta olmadi. Nuh alayhissalom unga iltijo qilganlarida, Alloh taolo bolaning zulmi ular orasidagi iymon rishtasini uzib qo‘yganini o‘rgatdi.",
      "Buyruq kelganda, suvlar chekindi va Ark Judi tog'iga to'xtadi. Alloh taolo mo'minlarni qanday qutqarishi va sabr qanday oqlanishi haqida fikr yuritadigan har bir kishi uchun Qur'on butun hisobni \"alomat\" sifatida saqlaydi.",
    ],
    lessons: [
      "Kam sonli izdoshlari bo'lgan uzoq va qiyin missiya muvaffaqiyatsizlikka uchramaydi - Nuh asrlar davomida va'z qilgan va uning soni emas, balki samimiyligi Allohga ma'qul kelgan.",
      "Hech bir oila rishtasi iymonsiz odamni qutqara olmaydi: Nuhning o'g'li suvga cho'kib ketdi, bu hidoyat meros emasligini isbotladi.",
      "Har doim masxara qilishga qarshi ham Allohga da'vat qilishda sabr-toqat qilishning o'zi ham ibodatdir.",
      "Allohning najoti belgilangan vaqtda keladi - mo'min va'daga ishonib, to'fondan oldin itoat kemasini quradi.",
    ],
    quran: [
      {
        excerpt: "Nuhning hikoyasi batafsil.",
      },
      {
        excerpt: "Nuhning qavmiga iltijosi.",
      },
    ],
    location: "Qadimgi Mesopotamiya (ilmiy baholar)",
  },
  {
    prophetName: "Ibrohim",
    title: "Ibrohim - Allohning do'sti (Xalilulloh)",
    summary: "Butlarni sindirib, olov salqin qildi, Ismoilni qurbon qildi, Ka'bani qurdi.",
    body: [
      "Ibrohim yoshligida ham qavmi va otasi o‘yib, sig‘inadigan butlarni rad etib, tavhidga yo‘l ochgan. U ular bilan bahslashdi, so'ng harakat qildi: ular bayramda bo'lganlarida, u ularning barcha butlarini sindirdi, lekin eng kattasi, va ular tushuntirishni talab qilganda, u katta butning o'zidan so'rashlarini aytdi - ular topinadigan narsaning nochorligini ochib berdi. Ular g'azablanib, katta olov yoqdilar va uni ichkariga tashladilar, lekin Alloh taolo: \"Ey olov, Ibrohimga salqin va omon bo'l\", deb amr qildi va u sog'-salomat chiqib ketdi.",
      "Alloh taoloning amri bilan Ibrohim xotini Hojar va go‘dak o‘g‘li Ismoilni Makkaning taqir vodiysida qoldirdi. Ularning suvi tugagach, Hajar umidsizlikda Safo va Marva tepaliklari o'rtasida yordam izlab yugurdi - musulmonlar haj sa'yida qidiruvni qayta tikladilar - chaqaloqning oyog'i ostidan Zamzam bahori otilib chiqmaguncha. Oradan yillar o‘tib, Ibrohim tushida sevikli o‘g‘lini qurbon qilishini ko‘rdi. Ota va o'g'il Allohning irodasiga bo'ysundilar. Ibrohim buni amalga oshirmoqchi bo'lganida, Alloh taolo Ismoilni har yili Qurbon hayitida nishonlanadigan ajoyib qo'chqor bilan to'ladi.",
      "Ibrohim va voyaga yetgan Ismoil birgalikda Makkada Ka’ba poydevorini ko‘tarib: “Ey Robbimiz, buni bizdan qabul qil”, deb duo qilishdi. Ibrohim ham ularning avlodlaridan bir payg'ambar yetishib chiqishini so'rab duo qilgan - bu duoga asrlar o'tib Payg'ambar Muhammad sollallohu alayhi vasallam javob bergan. Alloh taolo o'zining cheksiz sadoqati uchun Ibrohim alayhissalomni o'ziga xos unvon bilan ulug'ladi: Allohning do'sti Xalilulloh.",
    ],
    lessons: [
      "Tavhid, hatto butparastlik mashhur, meros bo'lib qolgan va unga qarshi turish xavfli bo'lsa ham, yolg'on rishtalarni buzishni talab qiladi.",
      "Allohga to'liq tavakkal Uning buyrug'i eng og'ir bo'lganida yorqinroq bo'ladi - Ibrohim hatto o'g'lini qurbon qilishga ham bo'ysundi va Alloh sinovni rahmat bilan almashtirdi.",
      "Allohga tavakkul passivlik degani emas: Hojar yugurib izladi, Zamzam keldi — harakat va tavakkul birga.",
      "Samimiy sadoqat amallari avlodlar osha aks sado beradi; haj marosimlari va Ka’baning izzati Ibrohim alayhissalomning itoatkorligiga borib taqaladi.",
    ],
    quran: [
      {
        excerpt: "Ibrohim, Ismoil va qurbonlik.",
      },
      {
        excerpt: "Ahd va meros.",
      },
    ],
    location: "Iroq, Levant, Makka",
  },
  {
    prophetName: "Yusuf",
    title: "Yusuf - sabr go'zalligi (sabr jameel)",
    summary: "Xiyonat, qullik, qamoq, hokimiyatga ko'tarilish - har bir sinov orqali ishonch.",
    body: [
      "Bolaligida Yusuf tushida o‘n bir yulduz, quyosh va oyning unga sajda qilayotganini ko‘rdi – bu buyuk kelajakning belgisidir. O'zi payg'ambar bo'lgan otasi Yoqub unga buni hasadgo'y akalaridan yashirishni buyurgan. Ularning hasadlari kuchayib, Yusufni quduq tubiga tashlab, otalariga bo'ri yutib yuborganini aytishdi. O‘tkinchi karvon bolani topib, Misrda sotib yubordi.",
      "Bir zodagonning uyida u ko'zga ko'rinadigan go'zallik va sofdil odam bo'lib o'sdi. Aslzodaning xotini uni yo‘ldan ozdirmoqchi bo‘lganida, Yusuf: “Allohdan panoh so‘rayman”, deb rozi bo‘lmadi va unga tahdid qilganda gunohdan ko‘ra zindonni tanladi. Aybsiz bo'lsa-da, u ko'p yillar qamoqda edi. U yerda mahbusdoshlarini tavhidga chaqirib, Allohning izni bilan tushlarini ta’bir qildi.",
      "Podshoh tushida yettita oriq sigir yetti semiz sigir yeb ketayotganini ko‘rib, bezovtalansa, Yusuf buni yetti yil mo‘l-ko‘llik, keyin yetti ocharchilik deb ta’bir qilib, don saqlashni maslahat beradi. Oxir-oqibat o'zining donoligi va ishonchliligi bilan e'tirof etilib, u Misrning omborlariga mas'ul etib tayinlandi.",
      "Oxir-oqibat ocharchilik uning aka-ukalarini Misrga oziq-ovqat izlab, oldingi qudratli vazirni tanimay haydab yubordi. Yusuf ularni sinagandan so'ng, o'zini oshkor qildi va qasos olish o'rniga ularni butunlay kechirdi: \"Bugun sizlarga hech qanday ayb yo'q. Alloh sizni mag‘firat qilsin”. Oila yana birlashdi, ota-onasi izzat-ikromga sazovor bo‘ldi, bolalik orzusi ushaldi.",
    ],
    lessons: [
      "Sabr jamil - go'zal sabr - odamlarga achchiq va shikoyat qilmasdan qiyinchiliklarga chidash, Yaqub kabi g'am-g'ussani faqat Allohga olish demakdir.",
      "Iffat har qanaqa qimmatga tushsa arziydi: Yusuf gunohdan ko‘ra zindonni tanladi, Alloh taolo shu tufayli uning darajasini ko‘tardi.",
      "Allohning rejasi ko'pincha yillar davomida ko'rinadigan baxtsizliklar ortida yashirinadi - quduq, qullik va zindon Yusufning sha'ni sari qadamlar edi.",
      "Kuchlilar mag'firat bilan kuchini ko'rsatadilar: Yusuf qudrati cho'qqisida o'ziga zulm qilganlarni kechirdi.",
    ],
    quran: [
      {
        excerpt: "Hikoyalarning eng yaxshisi - bir surada aytilgan.",
      },
    ],
    location: "Kan'on, Misr",
  },
  {
    prophetName: "Muso",
    title: "Muso - Alloh bilan gaplashdi va Fir'avnga yuzlandi",
    summary:
      "Yonayotgan buta, Fir'avn, Chiqish, Tavrot va sarson-sargardon xalqqa qarshi belgilar.",
    body: [
      "Muso Fir'avnning Isroil o'g'illarini o'ldirishidan qutqarish uchun onasi uni daryoga qo'yganidan so'ng, Allohning rejasi bilan Fir'avnning saroyida ulg'aygan. Yoshligida u qotillikdan so'ng Misrdan qochib ketdi va yillar o'tib, cho'ldan qaytib, Tur tog'ida olovni ko'rdi. U yerda Alloh taolo u bilan to'g'ridan-to'g'ri gaplashdi - bu sharaf Musoga Alloh bilan gaplashgan Kalimulloh unvoniga sazovor bo'lib: \"Albatta, men sizning Robbingizman\", dedi. U zolim Fir'avnning huzuriga ukasi Horunni qo'llab-quvvatlab: Bani Isroilni qo'yib yuboring, degan talab bilan yuborildi.",
      "Fir'avn o'zini xudo deb da'vo qilib, rad etdi. Alloh Muso alayhissalomga aniq oyat-belgilar berdi: tayog‘i tirik ilonga aylanib, qo‘li oppoq nur sochardi. Fir'avn uni obro'sizlantirish uchun o'zining eng mohir sehrgarlarini chaqirdi, lekin Musoning tayog'i o'z xayollarini yutib yuborgach, sehrgarlar yolg'iz nayrangdan haqiqiy haqiqatni anglab, sajdaga tushib, Muso va Horunning Robbiga iymon keltirishdi - hatto Fir'avn ularni o'lim bilan qo'rqitgandek. Birin-ketin o'latlar keldi, lekin Fir'avn faqat qotib qoldi.",
      "Nihoyat, Alloh Muso alayhissalomga qavmini kechasi tashqariga chiqarishni buyurdi. Fir'avn ularni dengizgacha ta'qib qildi. Muso uni tayog‘i bilan urdi va suv ikkiga bo‘linib, mo‘minlarni quruqlikda o‘tkazdi. Fir'avn va uning qo'shini orqasidan ergashganda, dengiz ularning ustidan yopildi va ular cho'kib ketishdi. Keyin Muso Tavrotni oldi, lekin Bani Isroil o'jar bo'ldi - u yo'qligida oltin buzoqqa sig'indi va va'da qilingan erga kirishdan bosh tortdi - va natijada qirq yil sarson bo'ldi.",
    ],
    lessons: [
      "To'liq Allohga tayangan holda zulmga haqiqatni gapiring - Muso o'z davridagi eng qudratli odamga faqat iymon bilan qurollangan holda duch keldi.",
      "Hatto samimiy imonlilar ham ikkilanishlari mumkin: Musoga qarshi chiqqan sehrgarlar bir lahzada mo''jizalarni ko'rgan butun xalqdan ko'ra mustahkamroq bo'lib qolishdi.",
      "Mo''jizalarga guvoh bo'lish o'z-o'zidan iymon keltirmaydi - hidoyat - bu Allohning qaysarga emas, balki kamtar qalbga bergan in'omidir.",
      "Alloh mazlumlarni qutqaradi va mutakabbirlarni qanchalik kuchli ko'rinsalar ham hisob-kitob qiladi.",
    ],
    quran: [
      {
        excerpt: "Muso Turda va Fir'avndan oldin.",
      },
      {
        excerpt: "Tug'ilish va tarbiya.",
      },
    ],
    location: "Misr, Sinay",
  },
  {
    prophetName: "Iso",
    title: "Iso ibn Maryam — Allohning kalomi va ruhi",
    summary:
      "Mo''jizaviy tug'ilish, alomatlar, Allohga ko'tarilgan - Qur'on bo'yicha o'ldirilmagan va xochga mixlanmagan.",
    body: [
      "Alloh taolo o‘z zamonasining eng yaxshi ayollari deb tanlagan iffatli va taqvodor ayol Maryam o‘z oilasidan uzoqlashib, sharqdagi bir joyga ketdi. U yerda Jabroil farishta unga erkak qiyofasida zohir bo‘lib, unga hech kim tegmagan bo‘lsa-da, Alloh taolo unga pokiza o‘g‘il berishini e’lon qildi. U Ollohning “Bo‘l” so‘zi bilan homilador bo‘ldi va Iso yaratildi – Qur’on uning yaratilishini Odam alayhissalomga qiyoslab, otasiz yaratilgan va Alloh O‘zi xohlagancha yaratishini ko‘rsatadi.",
      "U chaqaloqni ko'tarib qaytib kelganida, uning odamlari uni ayblashdi. Uning himoyasida go‘dak Iso beshikdan turib o‘zini kitob berilgan Allohning bandasi deb e’lon qildi va payg‘ambar qildi – mo‘jiza bilan onasining sha’nini tozaladi. Bani Isroilga payg‘ambar bo‘lgan Isoga Allohning izni bilan aniq oyat-belgilar berildi: u ko‘r va moxovni davoladi, o‘liklarni tiriltirdi va loydan uchuvchi qush yaratdi – bularning hech qachon o‘z kuchi bilan emas “Allohning izni bilan” ekanligini doimo ta’kidlab turdi.",
      "Qur'onda Isoning o'ldirilgani ham, xochga mixlanmagani ham ochiq aytilgan; Balki u dushmanlariga shunday ko'rsatildi va Alloh uni O'ziga ko'tardi. Sunniylarning asosiy e'tiqodi, u oxirat kunidan oldin qaytib keladi. Eng muhimi, Qur'on Iso alayhissalom insoniy payg'ambar va Allohning quli bo'lgan, ilohiy emas va Xudoning o'g'li emasligini ta'kidlaydi - bu xabarni uning o'zi beshikdan oxirigacha e'lon qilgan.",
    ],
    lessons: [
      "Alloh xohlaganicha yaratadi — Iso alayhissalomning otasiz tug'ilishi, xuddi Odam Atoning tuproqdan yaratilgani kabi, Uning qudrati hech qanday dunyoviy sababga bog'liq emasligini ko'rsatadi.",
      "Iso alayhissalom ko'rsatgan har bir mo''jiza ochiq-oydin \"Allohning izni bilan\" bo'lib, payg'ambarlar Allohning qudratini yo'naltiradi, ular bunga ega emasligini o'rgatadi.",
      "Payg'ambarlar Allohning sharafli bandalari bo'lib, ularga hech qachon sig'inmaslik kerak - Qur'on Isoning haqiqiy mavqeini mubolag'alardan saqlaydi.",
      "Maryamning iffati, sabr-toqati va ishonchi uni barcha mo‘minlar, ayollar va erkaklar uchun iymon namunasi qiladi.",
    ],
    quran: [
      {
        excerpt: "Tug'ilish va beshik nutqi.",
      },
      {
        excerpt: "O'ldirilmagan va xochga mixlanmagan; ko'tarilgan.",
      },
    ],
    location: "Falastin",
  },
  {
    prophetName: "Muhammad s.a.v",
    title: "Muhammad sollallohu alayhi vasallam - payg'ambarlarning muhri",
    summary: "Yakuniy xabarchi; Qur'on 23 yil davomida nozil qilingan; olamlarga rahmat.",
    body: [
      "Muhammad sollallohu alayhi vasallam Makkada taxminan milodiy 570 yilda Quraysh qabilasida tug‘ilganlar. Yetim qolgan yosh - otasi tug'ilmasdan oldin vafot etgan, onasi olti yoshida - u avval bobosi, keyin amakisi Abu Tolibning qo'lida tarbiyalangan. Payg'ambarlikdan ancha oldin u o'zining rostgo'yligi uchun shunchalik ishonganki, qavmi uni al-Amin, \"ishonchli\" deb atagan. Qirq yoshida Hiro g‘orida mulohaza yuritar ekan, Jabroil farishta orqali birinchi Qur’on nozil bo‘ldi.",
      "Makkada o'n uch yil davomida u odamlarni yolg'iz Allohga ibodat qilishga chaqirdi va qattiq ta'qiblarga duch keldi: masxara qilish, o'z tarafdorlari orasida zaiflarni qiynoqqa solish va o'z urug'iga ijtimoiy va iqtisodiy boykot qilish. Birgina \"qayg'u yili\"da u sevikli xotini Xadicha va himoyachisi Abu Tolibni yo'qotdi va yaqin atrofdagi Toifda yordam so'raganida uni haydab, toshbo'ron qilishdi - lekin u halok bo'lishdan ko'ra, ularning hidoyatini so'rab duo qildi.",
      "Madinaga hijrat qilgandan keyin bir jamoa qurdi va uni Badr, Uhud va ittifoqchilar sinovlaridan o'tkazdi. Nihoyat, katta kuch bilan Makkani fath qilish uchun qaytib kelganida, uni qiynoqlarga solgan va haydab yuborganlardan qasos olmadi. Ularni kechirib: “Boringlar, ozodsizlar”, dedi. Qur'on o'zining vazifasini birgina jumlada - \"olamlarga rahmat\" bilan ifodalaydi va uning vazifasini hech kimni iymonga majburlamaslik, ochiq-oydin etkazish ekanligini aniqlab beradi.",
    ],
    lessons: [
      "Inson ega bo'lishi mumkin bo'lgan eng go'zal fe'l-atvor bu Rasululloh sollallohu alayhi vasallamning xislatlaridir - u zotning siyratlarini diqqat bilan o'rganing va uni kundalik hayotda gavdalantirishga harakat qiling.",
      "Rahm-shafqat va kechirimlilik zaiflik emas, kuchdir: qudrati cho'qqisida u eng yomon dushmanlarini kechirdi.",
      "Allohga da'vat qiluvchi ixlos va sabr bilan xabarni yetkazadi, lekin oqibatini Allohga qoldiradi.",
      "Sinovlar payg'ambarlar yo'lidir; Alloh uchun mashaqqatlarga toqat qilganidek, haqiqiy iymonning belgisidir.",
    ],
    quran: [
      {
        excerpt: "Biz seni faqat olamlarga rahmat qilib yubordik.",
      },
      {
        excerpt: "O'zaro mehribon, kofirlarga qattiqqo'l.",
      },
    ],
    appLinks: [{}],
  },
];

export const QURAN_GUIDE_THEMES_UZ: DeepPartial<QuranGuideTheme>[] = [
  {
    title: "Iymon (Iymon)",
    summary:
      "Allohga, Uning farishtalariga, kitoblariga, payg'ambarlariga, oxirat kuniga va ilohiy hukmga iymon keltirish.",
    lessons: [
      "Iymon Qur'on bir joyda jamlangan oltita moddaga tayanadi: Allohga, Uning farishtalariga, nozil qilingan kitoblariga, Payg'ambarlariga, oxirat kuniga va ilohiy hukmga - uning yaxshi va yomoniga iymon keltirish.",
      "Iymon sobit, bir martalik tasdiq emas. Sunniylikning asosiy e'tiqodida u itoat va zikr bilan kuchayadi va gunoh va g'aflat bilan kamayadi, shuning uchun imon siz faol ravishda rivojlantiradigan narsadir.",
      "Payg'ambarimiz sollallohu alayhi vasallam iymonning yetmishdan ortiq shoxlari borligini, eng ulug'i - Allohdan o'zga iloh yo'qligiga shahodat berishdan tortib, yo'ldan zararni olib tashlashgacha bo'lgan kichik yaxshilik ham iymonning bir qismi ekanligini ko'rsatib berganlar.",
      "Haqiqiy iymon tildan avval qalbning ishi: Allohni chinakam bilish, Uni hamma narsadan ko‘ra sevish, Uning g‘azabidan qo‘rqish va to‘liq Unga tavakkul qilishdir.",
    ],
    quran: [
      {
        excerpt:
          "Payg'ambar o'ziga Robbidan nozil qilingan narsaga iymon keltirdi, mo'minlar ham...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Imonning yetmishdan ortiq shoxlari bor; eng yuqorisi «Allohdan o'zga iloh yo'q» deyish, eng pasti esa yo'ldan zararli narsani olib tashlash, hayo esa iymonning bir shoxidir.",
      },
    ],
    actions: [
      "Bugun shahodatingizni oddiy ibora sifatida emas, balki nimani anglatishini to'liq e'tibor bilan yangilang.",
      "Allohning ismlaridan birini o'rganing, uni tushunib oling va duolaringiz bilan Unga duo qiling.",
    ],
  },
  {
    title: "Namoz (namoz)",
    summary:
      "Qiyomat kuni haqida so'raladigan birinchi amal - bandani Rabbiy bilan bog'laydigan ustun.",
    lessons: [
      "Namoz Islomning ikkinchi ustuni bo'lib, banda qiyomat kunida so'roq qilinadigan birinchi amaldir - agar u sog'lom bo'lsa, qolgan amallar amal qiladi.",
      "Qur'onda aytilishicha, chin qalb bilan o'qilgan namoz insonni fahsh va yomon ishlardan qaytaradi; bu shunchaki marosim emas, balki kuniga besh marta takrorlanadigan ruhni tiklashdir.",
      "Er yuzida nozil qilingan boshqa farzlardan farqli o'laroq, namoz Payg'ambar sollallohu alayhi vasallam (al-Isro val-Me'roj) davrida ummatga farz qilingan bo'lib, uni o'ziga xos sovg'a va mo'minning Allohga ko'tarilish vositasi sifatida belgilagan.",
      "Namoz har kuni besh marta takrorlanganligi sababli, namoz bir amal bilan keyingi ibodat o'rtasida iymonni saqlab turuvchi barqaror ritmdir.",
    ],
    quran: [
      {
        excerpt:
          "Darhaqiqat, namoz fahsh va yomon ishlardan qaytaradi va Allohni zikr qilish ulug‘roqdir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qiyomat kuni bandaning birinchi hukm qilinadigan amali uning namozi bo‘ladi; Agar u sog'lom bo'lsa, u muvaffaqiyatga erishdi va agar u nuqsonli bo'lsa, u muvaffaqiyatsizlikka uchradi va yutqazdi.",
      },
    ],
    actions: [
      "Bugun Fotiha surasini o'qiyotganingizda ularni tushunib, sekin bir marta namoz o'qing.",
      "Ibodatingizning bir qismini mustahkamlash uchun Munibning Namozni o'rganish qo'llanmasini oching.",
    ],
  },
  {
    title: "Ota-onalar",
    summary:
      "Ota-onaga mehribonlik Allohga ibodat bilan qo'shiladi - shirkdan keyin ularga noshukurlikdan ogohlantiriladi.",
    lessons: [
      "Alloh taolo o‘sha oyatda ota-onaga mehr-muruvvatni bevosita O‘ziga sig‘inish bilan bog‘lagan, bu ularning islomdagi haqlari naqadar salmoqli ekanligidan dalolatdir.",
      "Qur'on eng kichik achchiqlanishni ham taqiqlaydi: ularga \"uf\" deyish yoki qattiq gapirish emas, balki ularga yumshoq, hurmatli so'zlar bilan murojaat qilish.",
      "Buyruq ota-onalar sabr-toqatga muhtoj bo'lgan keksalikda cho'qqisiga chiqadi: ular bir paytlar sizga g'amxo'rlik qilganidek, ularga ham g'amxo'rlik qiling va ularga rahm-shafqat bilan kamtarlik qanotini tushiring.",
      "Sadoqat o'lim bilan tugamaydi - ota-ona uchun duo qilishda, ular nomidan sadaqa berishda, do'stlari va va'dalarini hurmat qilishda davom etuvchi sadoqat amallaridir.",
    ],
    quran: [
      {
        excerpt:
          "Parvardigoringiz faqat Unga ibodat qilishingizni va ota-onaga yaxshilik qilishingizni amr qildi...",
      },
    ],
    actions: [
      "Bugun ota-onangizga qo'ng'iroq qiling yoki xabar bering.",
      "Ota-onangizning nomi bilan duo qiling.",
    ],
  },
  {
    title: "Sabr (Sabr)",
    summary: "Itoatda sobitlik, gunohlardan tiyilish va sinovlarni qabul qilish.",
    lessons: [
      "Ulamolar sabrni uch shaklda ta'riflaydilar: Allohga itoat qilishda sabr, gunohdan uzoqlashishda sabr va fitna kelganda Uning hukmini qabul qilishda sabr.",
      "Sabr - passiv umidsizlik yoki alohida holda tishlarini g'ijirlatish emas - Qur'on yordam manbai sifatida uni ibodat bilan bog'laydi, shuning uchun sabr faol bo'lib, sizni uzoqlashtirmaydi, Allohga qaratadi.",
      "Alloh taolo O'zini \"sabrlilar bilan birga\" deb e'lon qiladi va sabrlilarga ularning ajrini hisobsiz va'da qiladi.",
      "Payg'ambarlar odamlarning eng og'ir sinovlari bo'lgan va Qur'on ularning sabrini - kasallikda Ayyub, qayg'uda Yaqub, xiyonat va zindonda Yusufni taqlid qilish uchun namuna sifatida ko'rsatadi.",
    ],
    quran: [
      {
        excerpt:
          "Ey mo'minlar, sabr va namoz bilan yordam so'rang. Albatta, Alloh sabr qilguvchilar bilandir.",
      },
    ],
    actions: [
      "Bugun g'azab ko'tarilsa, javob berishdan oldin pauza qiling, nafas oling va \"Inna lillahi va inna ilayhi roji'un\" deb ayting.",
      "Bu haftadagi bir lahzalik mashaqqatni shikoyat o‘rniga ikki rakat namozga aylantiring.",
    ],
  },
  {
    title: "Sadaqa va zakot",
    summary: "Boylikni poklash va muhtojlarni boqish - haqiqiy imon belgisi.",
    lessons: [
      "Zakot - mol-dunyoning yillik poklovchi sadaqasi - Islomning uchinchi ustuni va farz, sadaqa esa yuqori chegarasiz va cheksiz shakllarsiz ixtiyoriy berishdir.",
      "Qur'oni karimda Alloh rizosi uchun sarflangan mol-dunyoning yo'qolib ketmasligi, balki ko'paytirilishi va'da qilingan: bitta urug'dek yetti boshoq o'sadi, har birida yuzta don beradi va Alloh O'zi xohlagan kishiga ko'paytiradi.",
      "Xayriya faqat pul emas. Rasululloh sollallohu alayhi vasallam birodaringni yuzida tabassum bilan uchratish ham sadaqadir, shuning uchun hech kim kambag'al emasligini aytdilar.",
      "Sadaqa molni ham, beruvchini ham poklaydi, hirs changalini bo'shatadi va rahm-shafqatni rivojlantiradi - shuning uchun zakot so'zining o'zi poklanish va o'sish degan ma'noni anglatadi.",
    ],
    quran: [
      {
        excerpt:
          "Alloh yo'lida infoq-ehson qiluvchilarning misoli yetti boshoq o'sgan donga o'xshaydi...",
      },
    ],
    actions: [
      "Bugun biror narsa bering - pul, vaqtingiz yoki chinakam yoqimli so'z - hatto kichik va ko'rinmas bo'lsa ham.",
      "Munibdagi zakot majburiyatlaringizni ko'rib chiqing va keyingi to'lov qachon kelishiga e'tibor bering.",
    ],
  },
  {
    title: "Tavba (tavba)",
    summary: "Alloh tavba qiluvchilarni yaxshi ko'radi - qalb tomog'iga yetguncha eshik ochiq.",
    lessons: [
      "Samimiy tavbaning aniq shartlari bor: gunoh uchun chin dildan pushaymon bo'lish, uni darhol to'xtatish va hech qachon qaytmaslikka qat'iy qaror qilish - va agar gunoh boshqa birovga zulm qilgan bo'lsa, uning huquqini tiklash.",
      "Alloh tavba qilishga izn bermaydi. U O'ziga qayta-qayta qaytadiganlarni yaxshi ko'radi. Bas, bir zulmdan keyin qaytishning o'zi U uchun sevimlidir, sizga qarshi belgi emas.",
      "Rahmat eshigi hayratlanarli darajada kengdir: Alloh taolo o'zlariga qattiq zulm qilganlarga ham noumid bo'lmanglar, chunki chin dildan tavba qilganning barcha gunohlarini mag'firat qiladi, deydi.",
      "Tavba katta gunohlar yoki dahshatli lahzalar uchun ajratilmaydi - kun bo'yi istig'for (istig'for) qalbni yumshoq va hisobni toza qiladi.",
    ],
    quran: [
      {
        excerpt:
          "Ayting: Ey oʻzlariga zulm qilgan bandalarim, Allohning rahmatidan noumid boʻlmanglar...",
      },
    ],
    actions: [
      "Bugun 100 marta \"Astag'firulloh\" deb ayting va og'irlikni ko'taring.",
      "Allohni yoqtirmaydigan odatlardan birini ayting va undan voz kechish uchun birinchi aniq qadamni qo'ying.",
    ],
  },
  {
    title: "Jannat (Jannat)",
    summary:
      "Muttaqin uchun tayyorlangan abadiy mukofot - yorqin, rag'batlantiruvchi batafsil tasvirlangan.",
    lessons: [
      "Qur'on jannatni jonli, rag'batlantiruvchi tafsilot - ostidan daryolar oqib turgan jannatlar, abadiy yengillik va solihlar bilan uchrashish - mo'minni unga intilish va harakat qilish uchun tasvirlab beradi.",
      "Jannatga kirish faqat amal bilan emas, Allohning rahmati bilandir. imon va sidqidildan harakat qilish vositadir, lekin hech kimning ishi Uning inoyatisiz abadiy mukofotga erisha olmaydi.",
      "Qur'on mo'minlarni mag'firat va \"kengligi osmonlaru yerdek bo'lgan\" jannat sari musobaqalashishga va shoshilishga undaydi.",
      "Eng katta mukofot bu bog'lar yoki daryolar emas, balki Allohning yuzini ko'rish - jannat ahliga va'da qilingan eng katta quvonchdir.",
    ],
    quran: [
      {
        excerpt:
          "Robbingizdan mag'firatga va kengligi osmonlaru yerdek bo'lgan jannatga shoshiling...",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Do'zax olovi (Jahannam)",
    summary:
      "Haqiqiy ogohlantirish - imonlilarni umidsizlikka tushirish uchun emas, balki diqqatni uyg'otish uchun.",
    lessons: [
      "Jahannam - bu metafora emas, balki haqiqiy ogohlantirishdir - Qur'on buni odamlar xavfni jiddiy qabul qilishlari va imkoni boricha yo'llarini o'zgartirishlari uchun ochiq-oydin tasvirlaydi.",
      "Do'zaxdan qo'rqish Allohning rahmatiga umid qilish bilan birga harakat qilishdir: mo'min xavf (qo'rquv) va raja (umid) o'rtasida yuradi, shuning uchun na umidsizlik va na yolg'on xavfsizlik o'z zimmasiga oladi.",
      "Qur'onda kechirilmas deb ko'rsatgan gunoh, agar biror kishi uning ustida vafot etsa, bu shirk, ya'ni Allohga shirk keltirishdir. Undan boshqa hamma narsani O'zi xohlagan kishi uchun mag'firat qilur.",
      "Alloh tavba qilganni ezmaslik uchun odamlarni O'ziga qaytarish uchun ogohlantiradi - har bir ogohlantirish Qur'onda qaytishga ochiq da'vat bilan bog'langan.",
    ],
    quran: [
      {
        excerpt:
          "Albatta, Alloh O'ziga shirk qo'shishni kechirmas, balki undan ozroq narsani O'zi xohlagan kishi uchun kechirur.",
      },
    ],
    actions: [
      "Bugun har bir namozdan keyin Allohdan sizni do'zaxdan saqlashini chin dildan so'rang.",
      "Tavhidingizni yangilang: Jahannamdan eng ishonchli himoya - yolg'iz Allohga ibodat qilish haqida fikr yuriting.",
    ],
  },
  {
    title: "Adolat",
    summary: "Hatto o'zingizga yoki qarindoshlaringizga qarshi adolat uchun mahkam turing.",
    lessons: [
      "Qur'onda adolat murosasizdir: haqiqat o'zingga, ota-onangga yoki eng yaqin qarindoshlaringga qarshi bo'lsa ham, unga sobit bo'l.",
      "Alloh taolo bir qavmga bo'lgan nafrat sizni hech qachon zulmga undamasligini buyuradi. Bu yaxshilikka (taqvoga) yaqinroqdir», demak, hatto dushmanlarga ham adolat lozimdir.",
      "Zulm (zulm)dan qattiq ogohlantiriladi; Payg'ambarimiz sollallohu alayhi vasallam zolimning qiyomat kunida zulmat bo'lib ko'rinishini ta'kidlaganlar.",
      "Adolat faqat sudyalar va hukmdorlar uchun emas, balki u halol so'zda, adolatli muomalada, so'zda va har bir kishiga o'z huquqini berishda yashaydi.",
    ],
    quran: [
      {
        excerpt:
          "O'zingizga, ota-onangiz va qarindoshlaringizga qarshi bo'lsa ham, Alloh uchun guvoh bo'ling.",
      },
    ],
    actions: [
      "Bugun kimgadir o'z huquqini bering - adolatli ish haqi, halol javob yoki unga qarzdor bo'lgan kredit.",
      "Bir lahzada tarafkashlik sizni adolatsizlikka vasvasaga soladi va buning o'rniga adolatni tanlang.",
    ],
  },
  {
    title: "Bilim",
    summary: "O'qing, tafakkur qiling va «Robbim, ilmimni ziyoda qil», deb ayt.",
    lessons: [
      "Qur'ondan nozil bo'lgan birinchi so'z \"O'qing\" edi - Islom dini marosim bilan emas, balki aqlning savodini ham, qalb bilimini ham ulug'laydigan o'rganishga amr bilan ochildi.",
      "Alloh hatto Payg'ambarimiz sollallohu alayhi vasallamga ham ko'proq so'rashni buyurgan: \"Robbim, ilmimni ziyoda qilgin\" - Qur'on uni ko'paytirishni talab qilgan yagona narsadir.",
      "Foydali bilim amal qilish va o'tkazish uchun mo'ljallangan; Rasululloh sollallohu alayhi vasallam olimlar payg'ambarlarning merosxo'rlari bo'lib, boylik emas, ilm merosxo'rlar, deb ta'lim berganlar.",
      "Muqaddas ilmga intilishning o'zi ibodatdir va Qur'on biladiganlar va bilmaydiganlar o'rtasida ochiq-oydin ajratilgan - \"ular tengmi?\"",
    ],
    quran: [
      {
        excerpt: "Va ayt: Robbim, ilmimni ziyoda qil.",
      },
    ],
    actions: [
      "Bugun Qur'ondan bir yangi narsa - oyat, so'z yoki hukmni o'rganing va uni kimgadir o'rgating.",
      '"Rabbi zidni ilmo" duosini yod oling va o\'rganishdan oldin ayting.',
    ],
  },
  {
    title: "Payg'ambarlar",
    summary:
      "Yo'l-yo'riq, sinov va ilohiy yordam haqidagi hikoyalar - o'yin-kulgi emas, balki ko'rsatma.",
    lessons: [
      "Qur'oni karimda hech bir qavm hidoyatsiz qolmagani haqida ta'lim beradi: \"Hech bir ummat yo'qki, ular orasida ogohlantiruvchi o'tmasin\" - hamma joyda bir xil tavhid xabari yuborilgan.",
      "Barcha payg'ambarlar bitta asosiy da'vatni keltirdilar - yolg'iz Allohga ibodat qilinglar va ularning hikoyalari o'z-o'zidan tarix sifatida emas, balki \"aql egalari\" uchun ko'rsatma sifatida hikoya qilinadi.",
      "Muhammad sollallohu alayhi vasallam payg'ambarlarning muhri, oxirgi elchisidir va musulmon o'zidan oldingi barcha payg'ambarlarga - Nuh, Ibrohim, Muso, Iso va boshqa payg'ambarlarga iymon keltirishi kerak - ular orasida farq qilmasdan.",
      "Payg'ambarlar inson va Allohning bandalari edilar, ilohiy emaslar; Qur'on ularni ulug'laydi, lekin ularni maxluq tomonida mahkam tutadi, hech qachon Yaratgan bilan birga sig'inmaydi.",
    ],
    quran: [
      {
        excerpt: "Ularning hikoyalarida aql egalari uchun ibrat bor...",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ayollar",
    summary: "Huquqlar, qadr-qimmat va ma'naviy tenglik - Maryam ayollarning eng yaxshisidir.",
    lessons: [
      "Qur'on erkak va ayolning Alloh huzuridagi ma'naviy tengligini o'rgatadi: \"Mo'min erkaklar va mo'mina ayollar\" uchun bir xil iymon, bir xil amal va bir xil ajr va'da qilingan.",
      "Ayollar va erkaklar mulk sifatida emas, balki imonda bir-birlarining sheriklari va himoyachilari sifatida tasvirlangan - to'rtinchi sura, an-Niso ('Ayollar') asosan ularning huquqlarini, qadr-qimmatini, merosini va muomalasini himoya qilishga bag'ishlangan.",
      "Qur'on Iso alayhissalomning onasi Maryamni barcha mo'minlar uchun namuna qilib ko'rsatadi va onalarni shunday ulug'laydiki, mashhur ta'limot jannatni ularning oyoqlari ostiga qo'yadi.",
      'Ikkala jins ham bir kelib chiqishiga borib taqaladi - "sizlarni bir jondan yaratgan" - Niso surasining birinchi oyatidan boshlab umumiy insoniylik va qadr-qimmatni o\'rnatadi.',
    ],
    quran: [
      {
        excerpt: "Sizlarni bir jondan yaratgan va undan juftini yaratgan Robbingizdan qo'rqing...",
      },
    ],
    actions: [
      "Bugun hayotingizdagi ayolni - onani, xotinini, opa-singilni yoki qizini - o'ziga tegishli huquq yoki mehribonlik bilan hurmat qiling.",
    ],
  },
  {
    title: "Bolalar",
    summary: "Omonat (amana) - tavhid va mehribonlik asosida tarbiyalanish.",
    lessons: [
      "Farzandlar omonat — Alloh taoloning omonatidir va Qurʼoni karim ota-onaga ularning tarbiyasi uchun masʼuliyat yuklaydi: “Oʻzingizni va oilangizni doʻzaxdan asrang” ularga tavhid va goʻzal xulqni oʻrgatish bilan boshlanadi.",
      "Payg'ambarimiz sollallohu alayhi vasallam Qur'onni o'rgatish va o'rganishni amallarning eng yaxshisi deb hisoblaganlar, shuning uchun bolani ozgina bo'lsa ham o'qishga yo'naltirish, ajri ota-onaga qaytariladigan abadiy yaxshilik hosil qiladi.",
      "Ota-onalarning ko'p takrorlanadigan donoligi bolalarni o'z bosqichida uchratishni maslahat beradi - ular bilan dastlabki yillarda o'ynash, keyin ularni o'rgatish va muloyimlik bilan tarbiyalash, so'ngra ular etuk bo'lganda ular bilan do'stlashish.",
      "Solih farzandni tarbiyalash bu hayotdan tashqari sarmoyadir: ota-ona uchun ibodat qilgan solih avlod o'limidan keyin ham ularga foyda keltiradi.",
    ],
    quran: [
      {
        excerpt: "Ey mo'minlar, o'zingizni va oilangizni do'zaxdan saqlaning...",
      },
    ],
    actions: [
      "Farzandingizga bugun sabr-toqat va dalda bilan qisqa oyat yoki bitta yaxshi xulqni o'rgating.",
      "Farzandlaringiz (yoki qaramog'ingizdagi bolalar) Alloh taologa to'g'ri va suyukli bo'lishlari uchun nomlarini aytib duo qilinglar.",
    ],
  },
];

export const QURAN_GUIDE_TAJWEED_UZ: DeepPartial<QuranGuideTajweedLesson>[] = [
  {
    title: "Tush Sakina va Tanvin",
    summary: "Sukun va tanvin bilan n uchun qoidalar — izhor, idg'om, iqlab, ixfa.",
    explanation: [
      "Peshin sakinasi — sukunni (unlisiz) olib yuruvchi n harfi; tanween - so'z oxiridagi tush bilan bir xil tovushli qo'sh unli (an, in, un). Ikkalasi ham bir xil to'rtta qoidaga amal qiladi, ular butunlay keyingi harf bilan belgilanadi.",
      "Izhar (aniq talaffuz): oltita boʻgʻiz harfidan biri (ạ h ʿ ḥ gẖ kẮ) kelganda, tushni aniq va aniq talaffuz qiling, burun qorishtirmasdan.",
      "Idg‘om (qo‘shilish): “yarmalun” (y r m l w n) so‘zining harflaridan oldin peshin keyingi harfga qo‘shiladi — y n m w uchun g‘unna (burun tovushi) bilan, l r uchun g‘unnasiz.",
      "Iqlab (konversiya): b dan keyin tushlik g'unna bilan birga yashirin mim tovushiga aylanadi.",
      "Ixfo (yashirish): qolgan o'n besh harfdan oldin peshin to'liq talaffuz qilinmaydi va to'liq qo'shilmaydi - til keyingi harfga tayyorlanayotganda engil burun g'unna bilan \"yashirin\".",
    ],
    practice:
      "Fotiha surasini sekin o'qing va har safar peshin sakinasi yoki tanviniga duch kelganingizda, to'rtta qoidadan qaysi biri va nima uchun amal qilishini aytish uchun to'xtab turing.",
  },
  {
    title: "Mim Sakina",
    summary: "Sukun bilan m uchun Ikhfoa shafaviy, idgham shafaviy va izhor shafaviy.",
    explanation: [
      "Mim sakinah - bu sukun olib yuruvchi m harfi. Uning uchta qoidasi bor, har biri \"shafaviy\" (labial) deb nomlanadi, chunki miim lablar bilan hosil bo'ladi va qaysi biri qo'llanilishi faqat keyingi harfga bog'liq.",
      "Idg'om shafaviy (labial qo'shilish): miim sakinasidan keyin boshqa mim kelsa, ikkalasi g'unna bilan o'tkaziladigan bir urg'uli mimga birlashadi.",
      "Ixfo shafaviy (labni yashirish): b kelsa, mim engil yashirin bo'ladi - lablar yaqinlashadi, lekin to'liq bosilmaydi - g'unna bilan birga.",
      "Izhar shafaviy (labial tiniqlik): har bir boshqa harfdan oldin mim aniq talaffuz qilinadi. W va f harflari oldiga alohida e'tibor bering, bu erda o'quvchilar uni xiralashtirishga moyil.",
    ],
    practice:
      "Juz Ammadan bir nechta qisqa suralarni o'qing va so'zni o'qishdan oldin har bir mim sakinasini belgilab, uning qoidasini nomlang.",
  },
  {
    title: "Madd (cho'zilish)",
    summary: "Unli tovushlarning tabiiy, ikkilamchi va zaruriy cho‘zilishi.",
    explanation: [
      "Madd unli tovushni cho'zish degan ma'noni bildiradi va bu uchta madd harfida - alif (ạ), vav (w) va ya (y)da sodir bo'ladi, ular o'z unlilarini olib yurmaydilar va o'zlariga mos keladigan qisqa unlilarga ergashadilar.",
      "Madd asli (tabiiy madd) - ikki sanoqdan iborat asosiy cho'zilish bo'lib, har bir joyda madd harfi paydo bo'lganda, undan keyin hech qanday maxsus sababsiz mavjud. Har bir o'quvchi uni bir tekis ushlab turadi.",
      "Madd far'i (ikkinchi darajali madd) keyingi hamza yoki sukun tomonidan qo'zg'atiladi va uzoqroq saqlanadi - odatda to'rt yoki olti sana. Aniq uzunlik madd turiga va siz amal qiladigan qiroatga (rivoyaga) bog'liq.",
      "So'z oxirida to'xtash sukun yaratishi mumkinligi sababli, u maddni ham uzaytirishi mumkin - bu muddatlarni taxmin qilishdan ko'ra malakali o'qituvchidan quloq orqali o'rganishning yana bir sababi.",
    ],
    practice:
      'O\'zingizga tanish qisqa surani tanlang va vaqtingizni bir tekisda tutib, har bir tabiiy madd uchun "1-2" va ikkinchi darajali maddlarda "1-2-3-4" ni ohista hisoblang.',
  },
  {
    title: "Gunna",
    summary: "Idg'om va ixfoda peshin va mimga hamrohlik qiluvchi burun tovushi.",
    explanation: [
      "G'unna - burun orqali hosil bo'ladigan burun rezonansi, peshin (n) va miem (m) harflarining o'ziga xos xususiyati. Standart tilovatda u taxminan ikki marta o'tkaziladi.",
      "Bu siz ko'rgan bir nechta qoidalarda talab qilinadi va eng aniq talaffuz qilinadi: g'unna, ixfo, iqlob bilan idg'om va har bir peshin yoki mim shaddani olib yursa.",
      "Ovoz silliq va boshqariladigan bo'lishi kerak - bu qo'shiq aytish yoki kuylash emas, balki burunning to'g'ri uzunlikdagi barqaror ohangidir.",
      "Oddiy test: g'unna harfini chiqarayotganda burningizni biroz chimchilab qo'ying; agar tovush bloklangan bo'lsa, rezonans haqiqatan ham kerak bo'lganda burun orqali keladi.",
    ],
    practice:
      "Tush yoki mimda shaddah bilan so'z o'qing, g'unnani ikki marta ushlab turing, so'ng o'zingizni yozib oling va malakali qori bilan solishtiring.",
  },
  {
    title: "Qalqalah",
    summary: "Sakin yoki ular ustida toʻxtaganda q ṷ b j d ustida aks sado.",
    explanation: [
      "Qalqalah - beshta harfga berilgan engil aks-sado beruvchi \"sakrash\" - qūṭ̊bu jādu iborasida yig'ilgan, ya'ni q ṷ b j d - ular sukun olib yurganlarida.",
      "Bog'lanish - artikulyatsiya nuqtasining engil tebranishi; harfdan keyin toʻliq unlini qoʻshmaslik kerak, faqat uni “qaytarib” qoʻying.",
      "Harf so‘z o‘rtasida sukun bo‘lsa, engilroq (sughra), so‘z oxirida esa shu harfga to‘xtasangiz, kuchliroq va aniqroq (kubra) bo‘ladi.",
      "Sakrashni neytral tuting — uni “a”, “i” yoki “u” tovushi tomon egmang; Bu atrofdagi unlilardan qat'i nazar, bir xil tiniq aks sado.",
    ],
    practice:
      '"Ixlos" surasini o\'qing va har bir qalqalah harfi - "ahad" va "yulad" d harfi ustida to\'xtab, toza tiklanishni his eting.',
  },
  {
    title: "Vaqf (To'xtash)",
    summary: "Qayerda to'xtash, nafas olish va to'xtash talaffuzni qanday o'zgartiradi.",
    explanation: [
      "Vaqf qayerda va qanday qilib pauza qilish san'atidir. Mushaf to'xtash nuqtalarini kichik belgilar bilan belgilaydi - masalan, kerakli to'xtash uchun m, ruxsat etilgan to'xtash uchun ṭ va j, va lạ ma'nosi bu erda to'xtamaydi - o'quvchini boshqarish uchun.",
      "To'xtash odatda oxirgi unlini o'chiradi, oxirgi harfni sukunga aylantiradi. Keyin bu o'zgarish boshqa qoidalarni, masalan, qalqalah yoki cho'zilgan maddni keltirib chiqarishi mumkin, shuning uchun siz to'xtaganingizda so'z davom etayotganingizdan farq qilishi mumkin.",
      "To'xtash joyi ma'noga ta'sir qilishi mumkin, shuning uchun hech qachon o'rtadagi iborani buzadigan tarzda buzmang. Alohida holat uch nuqta bilan belgilangan mu'anaqa (quchoqlash) vaqf bo'lib, ikki nuqtadan birida to'xtashingiz mumkin, lekin ikkala nuqtada ham emas.",
      "To'g'ri to'xtashlarni o'rganishning eng xavfsiz usuli bu malakali qori bilan birga vaqf belgilarini ko'rsatadigan mushafdir, shuning uchun pauzalaringiz uzatilgan tilovatga mos keladi.",
    ],
    practice:
      "Vaqf belgilari bilan bitta sahifani oling va tajvid o'qituvchisi yozib olganidan keyin, belgilar ko'rsatilgan joyda to'xtab, uni ovoz chiqarib o'qing.",
  },
  {
    title: "Hamzat Wasl",
    summary:
      "The connecting hamza that is pronounced only when starting, and dropped when joining.",
    explanation: [
      "Hamzat wasl (ٱ) is a connecting hamza written with a small saddah-like mark above an alif. It appears at the start of many nouns, verbs, and particles — including the definite article ال.",
      "When you begin recitation on a word that starts with hamzat wasl, you pronounce it with a clear hamza sound so the word can open cleanly.",
      "When the word is joined to what comes before it, the hamzat wasl is silent — you glide from the previous letter straight into the following letter and do not sound a separate hamza.",
      "Recognizing hamzat wasl helps you avoid inserting an extra glottal stop mid-phrase, which is a common beginner habit when reading the mushaf slowly.",
    ],
    practice:
      "Recite the basmalah and Surah al-Fatiha, pausing at each ٱ to decide whether you are starting (pronounce) or joining (drop).",
  },
  {
    title: "Lam Shamsiyah",
    summary: "Sun letters that assimilate the لام of ال, versus moon letters that keep it clear.",
    explanation: [
      "When the definite article ال is attached to a noun, the لام may be pronounced clearly or assimilated, depending on the following letter.",
      "Sun letters (huruf shamsiyah) cause the لام to be silent and the next letter to be doubled with a shaddah — as in ٱلرَّحْمَٰن where the ر absorbs the لام.",
      "Moon letters (huruf qamariyah) keep the لام clear — as in ٱلْقَمَر — so you hear both the لام and the following letter.",
      "Learning the sun and moon sets by heart (or by ear from a teacher) prevents over-pronouncing silent لام and under-pronouncing clear لام.",
    ],
    practice:
      "Open Juz Amma and mark ten nouns with ال: for each, name whether the لام is shamsiyah (silent) or qamariyah (clear) before you recite.",
  },
  {
    title: "Silent Letters",
    summary: "Letters written in the mushaf that are not pronounced in continuous recitation.",
    explanation: [
      "Some letters appear in the Uthmani script for historical or orthographic reasons but are not sounded when you recite — they are marked silent in tajweed colorings.",
      "Common cases include certain alifs that are written but not elongated, and letters that are assimilated into a following shaddah so they leave no separate sound.",
      "Silent marking is a reading aid: it keeps the written mushaf faithful while guiding the tongue not to invent an extra sound.",
      "When in doubt, follow a colored tajweed mushaf or a qualified reciter — the goal is fidelity to the transmitted reading, not guessing from spelling alone.",
    ],
    practice:
      "With tajweed colors on, read one page slowly and whisper only the colored (sounded) letters — skip every silent-marked letter deliberately.",
  },
];

export const QURAN_GUIDE_VOCABULARY_UZ: DeepPartial<QuranGuideVocabEntry>[] = [
  {
    meaning: "Yagona haqiqiy Xudo - barcha go'zal ismlarni o'z ichiga olgan to'g'ri ism.",
    frequency: "2700+ hodisa",
    example: "Bismilloh - Alloh nomi bilan",
    quranRef: {
      excerpt: "Mehribon va rahmli Alloh nomi bilan.",
    },
  },
  {
    meaning:
      "Rabbiy, Ustoz, Qo'llab-quvvatlovchi - yaratuvchi, egalik qiluvchi, tarbiyalovchi va boshqaruvchi.",
    frequency: "Juda tez-tez",
    example: "Rabbana - Rabbimiz",
    quranRef: {
      excerpt: "Hamd olamlarning Robbi Allohga bo'lsin.",
    },
  },
  {
    meaning: "Allohdan va maxluqotlar orasidan rahmat, rahm-shafqat, mehr.",
    frequency: "Umumiy ildiz r-ḭ-m",
    example: "Ar-Rahmon, Ar-Rahim",
  },
  {
    meaning: "Bog', jannat - abadiy mukofot maskani.",
    frequency: "Tez-tez",
    example: "Ostidan daryolar oqib turgan jannatlar",
  },
  {
    meaning: "Yong'in - Jahannamni ogohlantirish va oqibat sifatida anglatadi.",
    frequency: "Tez-tez",
    example: "Kofirlar uchun tayyorlangan do'zaxdan qo'rqing",
  },
  {
    meaning: "Allohga iymon, iymon, tavakkal va Uning xabarini qabul qilish.",
    frequency: "Juda tez-tez",
    example: "Ey iymon keltirganlar (ya ayyuha alladhina omonu)",
  },
  {
    meaning: "Alloh uchun sabr, sabr, sabr.",
    frequency: "Tez-tez",
    example: "Albatta, Alloh sabr qilguvchilar bilandir",
  },
  {
    meaning: "Minnatdorchilik - ne'matlarni qalb, til va a'zolar bilan tan olish.",
    frequency: "Tez-tez",
    example: "Agar shukr qilsangiz, albatta sizni ziyoda qilaman",
  },
  {
    meaning: "Allohni bilish, taqvodorlik, Allohdan qo‘rqib gunohdan saqlanmoq.",
    frequency: "Juda tez-tez",
    example: "Alloh nazdida sizlarning eng azizingiz eng solihingizdir",
  },
  {
    meaning: "Rizq, rizq - Alloh har bir jon uchun belgilagan narsa.",
    frequency: "Tez-tez",
    example: "Alloh rizq beruvchilarning eng yaxshisidir",
  },
  {
    meaning: "Nur - hidoyat, vahiy va qalbning yoritilishi.",
    frequency: "Tez-tez",
    example: "Alloh osmonlaru yerning nuridir",
    quranRef: {
      excerpt: "Alloh osmonlaru yerning nuridir...",
    },
  },
  {
    meaning:
      "Bu dunyo hayoti - tom ma'noda \"pastki/yaqinroq\" hayot. Qur'onda bu vaqtinchalik va sinov bo'lib, doimiy oxiratga qarama-qarshidir va hech qachon mo'minning haqiqiy uyi emas.",
    frequency: "Tez-tez",
    example: "Bu dunyo hayoti (al-hayot ad-dunyo) faqat o'yin-kulgidan boshqa narsa emas",
  },
  {
    meaning:
      "Oxirat - o'limdan keyingi abadiy hayot, jumladan tirilish, hukm, jannat va do'zax. Qur'on mo'minlarni mehnat qilishga undagan haqiqiy va doimiy hayotdir.",
    frequency: "Tez-tez",
    example: "Oxirat esa yaxshiroq va boqiyroqdir",
  },
  {
    meaning:
      "Islomning ikkinchi ustuni bo'lgan marosim namozi kuniga besh marta o'qiladi. Bu soʻz Allohga bogʻlanish va iltijo maʼnosini ham oʻz ichiga oladi.",
    frequency: "Juda tez-tez",
    example: "Mening zikrim uchun namozni to'kis ado et",
  },
  {
    meaning:
      "Kitob yoki oyat - ko'pincha Qur'onning o'zi (\"bu Kitob\"), shuningdek, ilgari nozil qilingan oyatlar va amallar yozuvi. Ildiz k-t-b, yozish uchun.",
    frequency: "Juda tez-tez",
    example: "Bu kitob (Zalikaul kitob)dir, unda hech qanday shubha yo'q",
  },
];

export const QURAN_GUIDE_LETTERS_UZ: DeepPartial<QuranGuideLetter>[] = [
  {
    name: "Alif",
    pronunciation: 'Uzun /a/ "ota"dagi kabi (hamza yoki madd ko\'targanda)',
  },
  {
    name: "Ba",
    pronunciation: 'Ingliz tilidagi "b" kabi',
  },
  {
    name: "Ta",
    pronunciation: 'Ingliz tilidagi "t" kabi',
  },
  {
    name: "Tha",
    pronunciation: '"o\'ylash"dagi "th" kabi',
  },
  {
    name: "Jim",
    pronunciation: '"Jam"dagi "j" kabi',
  },
  {
    name: "Ha",
    pronunciation: 'Tomoqdan o\'tkir nafasli h - inglizcha "h" emas',
  },
  {
    name: "Xa",
    pronunciation: 'Shotlandiya "loch" kabi - tomoqdagi ishqalanish',
  },
  {
    name: "Dal",
    pronunciation: 'Inglizcha "d" kabi',
  },
  {
    name: "Dhal",
    pronunciation: '"Bu" dagi "th" kabi',
  },
  {
    name: "Ra",
    pronunciation: "Rolled/trilled 'r'",
  },
  {
    name: "Zay",
    pronunciation: 'Ingliz tilidagi "z" kabi',
  },
  {
    name: "Gunoh",
    pronunciation: "Ingliz tilidagi kabi",
  },
  {
    name: "Shin",
    pronunciation: '"Kema"dagi "sh" kabi',
  },
  {
    name: "Achinarli",
    pronunciation: "Emfatik 's' - til ko'tarilgan, to'liqroq tovush",
  },
  {
    name: "Dada",
    pronunciation: "Emfatik 'd' — arabchaga xos",
  },
  {
    name: "Ta (ta'kidlangan)",
    pronunciation: 'Emfatik "t" - og\'izda chuqurroq',
  },
  {
    name: "Za (ta'kidlangan)",
    pronunciation: '"Dh" tovushining ta\'kidlangan versiyasi',
  },
  {
    name: "Ayn",
    pronunciation:
      "Tomoqning o'rtasidan ovozli siqilish - inglizcha ekvivalenti yo'q; uni qiroatchiga taqlid qilib o'rganing",
  },
  {
    name: "Gayn",
    pronunciation: 'Frantsuzcha "r" yoki "gh" chayqash kabi',
  },
  {
    name: "Fa",
    pronunciation: 'Inglizcha "f" kabi',
  },
  {
    name: "Qof",
    pronunciation: 'Tilning orqa tarafidagi chuqur "k" - inglizcha "k" emas',
  },
  {
    name: "Kaf",
    pronunciation: 'Ingliz tilidagi "k" kabi (og\'izda oldinga)',
  },
  {
    name: "Lam",
    pronunciation: 'Ingliz tilidagi "l" kabi',
  },
  {
    name: "Mim",
    pronunciation: 'Inglizcha "m" kabi',
  },
  {
    name: "rohiba",
    pronunciation: 'Ingliz "n" kabi',
  },
  {
    name: "Ha (yorug'lik)",
    pronunciation: 'So\'z oxirida yumshoq "h"',
  },
  {
    name: "Vay",
    pronunciation: '"w" yoki uzun "oo" kabi',
  },
  {
    name: "Ya",
    pronunciation: '"y" yoki uzun "ee" kabi',
  },
];

export const QURAN_GUIDE_PRONUNCIATION_UZ: DeepPartial<QuranGuidePronunciationPair>[] = [
  {
    title: "Ayn Haga qarshi",
    tip: "Ikkalasi ham tomoqdan keladi, lekin ovozda farqlanadi. Ayn (ʿ) - tomoqning o'rtasidan ovozli siqilish - ovoz paychalarining tebranishi. Ha (ḭ) — tebranishsiz ogʻir xoʻrsinish kabi kuchli, ovozsiz nafasli ishqalanish. Ingliz tilida ikkalasi ham mavjud emas, shuning uchun ularni o'quvchidan quloq bilan o'rganing.",
  },
  {
    title: "Ha vs Kha",
    tip: 'Ha keskinroq va engilroq; Xa ko\'proq ishqalanish bilan chuqurroq - "loch" kabi.',
  },
  {
    title: "Gunoh va qayg'u",
    tip: "Sin (s) ingliz tilidagi «ko'rish» kabi engil, ingichka «s»dir. Sad (ᵵ) uning og'ir, urg'uli egizakidir: tilning orqa qismini ko'taring, og'izni biroz aylantiring va tovush chuqurlashadi. Ularni aralashtirish so'zlarni o'zgartirishi mumkin - sabr (sabr) va yorug'lik o'qishi.",
  },
  {
    title: "Dal dadamga qarshi",
    tip: 'Dal (d) - oddiy "d". Dad (Ḷ) arab tiliga xos og‘ir, urg‘uli “d” belgisidir — tilning yon tomonini yuqori molarlarga bosing va ovoz og‘izni to‘ldiradi. Arab tili hatto bu o\'ziga xos harf tufayli "otaning tili" laqabini oldi.',
  },
  {
    title: "Ta vs Ta (ta'kidlangan)",
    tip: "Emfatik ṭ chuqurroq; faqat inglizcha 't' bilan almashtirmang.",
  },
  {
    title: "Dhal va Za (ta'kidlangan)",
    tip: "Har ikkisi ham 'th' tovushlarini o'z ichiga oladi; ạ og'irroq va urg'ulidir.",
  },
  {
    tip: 'Kaf (k) inglizcha "kalit" kabi oldinga "k" dir. Qaf (q) ancha orqada qilingan — tilning orqa qismi uvulaga tegib, inglizcha ekvivalenti yo‘q, chuqur, ichak tutuvchi “k” ni beradi. Ularni ajratib turing: qalb (yurak) kalb (it) emas.',
    title: "Kaf Qafga qarshi",
  },
  {
    title: "Gayn Khaga qarshi",
    tip: "Gaynning ovozi bor; Kha ovozsiz ishqalanishdir.",
  },
];

export const QURAN_GUIDE_MEMORIZATION_PLANS_UZ: DeepPartial<QuranGuideMemorizationPlan>[] = [
  {
    title: "Boshlovchi - Juz Amma",
    summary:
      "Hamma uchun tabiiy boshlanish nuqtasi. Mus'haf oxirida juda qisqa suralardan boshlang - an-Nosdan orqaga qarab - ular oson, tez savobli va har bir namozda foydalidir.",
    surahs: ["An-Nas", "Al-Falaq", "Al-Ixlos", "Al-Masad", "An-Nasr", "Al-Kofirun", "Al-Kavsar"],
    tip: "Kuniga atigi bitta oyatni yodlang: murattal qorini tinglang, uni taxminan o'n marta takrorlang, uni oqmaguncha baland ovozda takrorlang, so'ngra davom etishdan oldin uni ushlab turgan narsangizga qo'shing.",
  },
  {
    title: "O'rta - o'n asosiy sura",
    summary:
      "Qisqa suralar mustahkam bo'lgandan so'ng, buyuk fazilatga ega bo'lgan va ko'pincha juma va tunda o'qiladigan, yaxshi ko'radigan uzunroq boblarni oling - ular orasida al-Mulk, Ya-Sin, ar-Rahmon, al-Voqiya va al-Kahf.",
    surahs: [
      "Al-Fotiha",
      "Al-Mulk",
      "Ya-Sin",
      "Ar-Rahmon",
      "Al-Voqiya",
      "Al-Kahf",
      "Al-Juma",
      "Al-Hashr",
    ],
    tip: "Yangi yodlashni belgilangan kunlik vaqtga - bomdod namozidan keyingi sokin, tiniq vaqtga o'rnating, shuning uchun ham og'ir yuklarni ko'tarish izchillik bilan amalga oshiriladi.",
  },
  {
    title: "Murakkab — Bir juz",
    summary:
      "To'liq juzni to'ldirishga va'da bering, shu bilan birga hamma narsani qattiq ushlab turing. Ko'pchilik suralarini qisman biladigan 29 yoki 30 Juz bilan boshlanadi, keyin esa bir vaqtning o'zida bir juz tashqariga tarqaladi.",
    surahs: ["Juzni tanlang - ko'pchilik Juz 29 yoki 30 bilan boshlanadi, keyin kengaytiriladi"],
    tip: "Eskisi qat'iy qayta ko'rib chiqilmaguncha, hech qachon yangi qism qo'shmang. Rasululloh sollallohu alayhi vasallam yodlangan Qur'on bog'langan tuyaning uzilishidan tezroq sirg'alib ketishidan ogohlantirdilar.",
  },
  {
    title: "Hofiz sayohati",
    summary:
      "Qur'onni to'liq yod olish - uni ko'targan kishini va Allohning marhamati bilan ularning ota-onalarini tarbiyalaydigan bir umrlik sharafdir. Bu jiddiy majburiyat bo'lib, odatda bir necha yillik kundalik yangi yodlash va intizomli qayta ko'rib chiqishni o'z ichiga oladi.",
    surahs: ["Butun mushaf - odatda kundalik qayta ko'rib chiqish bilan 3-7 yil"],
    tip: "Buni yolg'iz o'zi sinab ko'rmang: qayta ko'rib chiqish jadvalingizni boshqarish uchun Munibning hifz trekeridan foydalaning va xatolaringizni aniqlay oladigan va tuzatadigan malakali hofiz yoki o'qituvchiga muntazam ravishda tilovat qiling.",
  },
];

export const QURAN_GUIDE_DAILY_LESSONS_UZ: DeepPartial<QuranGuideDailyLesson>[] = [
  {
    translation:
      "Ey mo'minlar, sabr va namoz bilan yordam so'rang. Albatta, Alloh sabr qilguvchilar bilandir.",
    context:
      "Madinada nozil qilingan Baqara surasidan. Alloh taolo qiyinchilikka duchor bo‘lgan mo‘min uchun ikki quvvat manbasini – sabr-toqat va namozga yuzlanishni juft qilib qo‘ygan va mustahkam bo‘lganlarga O‘zining maxsus sherikligini va’da qilgan.",
    reflection:
      "Bu oyat menga ko'rsatgan sabr va ibodat o'rniga tezroq qochish uchun qo'l cho'zayotganimda hozir qanday sinovga duch kelyapman?",
    action:
      "Bugun shoshilmasdan bir namoz o'qing va sajdangizda boshdan kechirayotgan muayyan sinovda Allohdan sabr so'rang.",
  },
  {
    translation: "Mening rahmatim hamma narsani qamrab olgan.",
    context:
      "Muso va uning qavmi misolida aytilgan A'rof surasidan. Alloh taolo O'zining rahmatini hamma narsani qamrab oluvchi, deb ta'riflaydi - rahmati shunchalik kattaki, u O'zining jazosidan oldinroq va ustundir.",
    reflection:
      "O'zim Allohning cheksiz rahmatiga bog'liq bo'lsam ham, kimning xatosini kechirishdan bosh tortyapman?",
    action:
      "O'zingiz xafa bo'lgan bir kishini tanlang, ularni bugun qalbingizda chin dildan kechiring va Allohdan ularni ham hidoyat va kechirishini so'rab qisqa duo qiling.",
  },
  {
    translation: "Agar shukr qilsangiz, albatta sizni ziyoda qilaman.",
    context:
      "Ibrohim surasidan, Musoning Bani Isroilga eslatmasidan. Alloh taolo O'zining ko'payishini to'g'ridan-to'g'ri shukr bilan bog'laydi - ne'matga shukr qilish uning o'sishiga sabab bo'ladi, noshukrlik esa uni yo'qotishga chorlaydi.",
    reflection:
      "Alloh bergan ne'matlardan qaysi biri - sog'ligim, oilam, iymonim yoki rizqim - bu haftani oddiy va menga qarzdor deb bila boshladim?",
    action:
      "Kechasi uxlashdan oldin uchta aniq ne'mat uchun \"Alhamdulillah\" deb ovoz chiqarib ayting va har biriga nom bering, shunda shukr avtomatik emas, ongli bo'lsin.",
  },
  {
    translation: "Va odamlarga yaxshi so'zlarni ayting.",
    context:
      "Isro surasidan. Alloh taolo mo'minlar o'zlarini qanday tutishlari kerakligi haqida ko'rsatma berib, odamlarga - barcha odamlarga eng yaxshi tarzda gapirishni buyuradi, chunki qattiq so'zlar shayton bo'linish uchun eshiklardan biridir.",
    reflection:
      "Bugun ortga nazar tashlaydigan bo'lsak, mening so'zlarim ko'pincha odamlarni ko'paytirdimi yoki ularni yo'q qildimi - va hatto men qiyin bo'lganlarga ham \"yaxshi so'zlarni\" aytdimmi?",
    action:
      "Bugun hech qanday yashirin tanqidsiz bir odamni chin dildan rag'batlantiring yoki minnatdorchilik bildiring va siz aytishga vasvasaga tushgan bir qattiq so'zni ushlab turing.",
  },
  {
    translation: "Kim Allohga tavakkul qilsa, bas, U zot unga kifoyadir.",
    context:
      "Taloq surasidan, ajralish va ta'minlashga oid hukmlar qatorida - odamlar moliyaviy jihatdan eng ko'p tashvishlanayotgan joyda. U erda Alloh kim Undan qo'rqsa, O'zi o'ylamagan joydan rizq berishini va kim Unga tavakkul qilsa, uni yetarlicha topishini va'da qiladi.",
    reflection:
      "Men qayerda puxta rejalar tuzyapman, lekin Allohni ulardan chetda qoldirib yoki duoda hech qachon Unga murojaat qilmasdan odamlarning yordamiga suyanibman?",
    action:
      "Sizni tashvishga solayotgan bitta qarorni qabul qiling, ikki rakat istixora namozini o'qing yoki uning ustidan chin dildan duo qiling, so'ngra natijasini Allohga ishoning.",
  },
  {
    translation: "Robbim, ilmimni ziyoda qilgin.",
    context:
      "Toha surasidan. Bu Qur'onda Alloh taolo Payg'ambarimiz sollallohu alayhi vasallamga ko'proq narsani so'rashni buyurgan yagona narsa - ilm - bu ilmning qanchalik qadrli ekanligini va hech kim, qanchalik ilmli bo'lsa ham, uni izlab tugatmasligini ko'rsatadi.",
    reflection:
      "Bugun bo'sh vaqtimning qancha qismi cheksiz varaqlashga o'tdi va uning o'rniga bir oyat yoki bitta hadis o'rganishga uning bir qismi ham sarflanishi mumkinmi?",
    action:
      "“Rabbi zidni ilma” degan qisqa duoni yod oling va kunni boshlashdan oldin bomdoddan keyin aytishni odat qiling.",
  },
  {
    translation:
      "Mollarini Alloh yo'lida infoq qiluvchilarning misoli, yetti boshoq o'sgan urug'ga o'xshaydi...",
    context:
      "Baqara surasidan. Alloh taolo sadaqaning qanday o'sishini yorqin tasvirlab beradi: bitta urug' yetti boshoq o'sib chiqadi, har biri yuzta don beradi - yetti yuz barobar qaytaradi va O'zi xohlagan kishiga yana ko'paytirur. Uning roziligi uchun berilgan boylik hech qachon yo'qolmaydi.",
    reflection:
      "Men bersam, Alloh roziligi uchun jimgina qilinadimi yoki boshqalarning buning uchun meni maqtashini xohlaymanmi?",
    action:
      "Bugun bir oz sadaqa bering, agar imkoningiz bo'lsa, yashirincha bering - bu faqat siz bilan Alloh o'rtasidadir.",
  },
];

export const QURAN_GUIDE_APPLY_CHALLENGES_UZ: DeepPartial<QuranGuideApplyChallenge>[] = [
  {
    verseExcerpt: "Va odamlarga yaxshi so'zlarni ayting.",
    challenge:
      "Kun bo'yi birorta qo'pol, kinoyali yoki masxara qiluvchi so'zsiz - hatto hazilda ham, g'azablansa ham.",
    habit:
      "Bezovtalik kuchayganda, javob berishdan oldin pauza qiling va sukunat yoki yoqimli so'zni tanlang.",
  },
  {
    verseExcerpt: "Mo‘min erkaklarga ayt, ko‘zlarini to‘ssinlar...",
    challenge:
      "Ko'zlaringizni qasddan Alloh ta'qiqlagan narsalardan - ekraningizda, lavhangizda va jamoat joylaridan uzoqroq tuting.",
    habit:
      "Har safar o'zingizni ushlaganingizda, o'sha lahzani besh daqiqalik Qur'onga yo'naltiring.",
  },
  {
    verseExcerpt: "Ularga “uf” demang...",
    challenge:
      "Bugun ota-onangiz yoki oqsoqolingiz bilan ko'zga ko'rinadigan yumshoqlik va sabr-toqat bilan gapiring, hech qanday g'azablanmang va ularga xizmat qilish uchun biror narsa qiling.",
    habit:
      "Agar ular tirik bo'lsa, muntazam qo'ng'iroq qiling yoki tashrif buyuring; bo'lmasa, ular uchun duo qiling.",
  },
  {
    verseExcerpt: "Rostgo'ylar bilan birga bo'l.",
    challenge:
      "Oq yolg'on, mubolag'asiz va g'iybatsiz kun bo'yi haqiqatni ayting - hatto hazilda ham.",
    habit:
      "Agar sirg'alib ketsangiz, darhol tavba qiling va so'zlaringiz ta'sir qilgan narsani tuzating.",
  },
  {
    verseExcerpt: "Alloh sabr qiluvchilar bilandir.",
    challenge:
      "Keyingi safar biror narsa sizni xafa qilganda, javob berishdan oldin har bir qattiq so'zni oltmish soniya ushlab turing.",
    habit:
      "Iloji bo'lsa, asabiylashayotgan daqiqalarni zikrga yoki ikki rakat namozga aylantiring.",
  },
  {
    verseExcerpt: "Agar shukr qilsangiz, sizni ziyoda qilaman.",
    challenge: "Bugun siz uchun qilgan aniq bir ishi uchun uch xil odamga rahmat ayting.",
    habit: "Har kechani Munib jurnalingizdagi bitta barakani qayd etish bilan yakunlang.",
  },
  {
    verseExcerpt: "Kim kechirsa va yarashtirsa, uning mukofoti Allohning huzuridadir.",
    challenge:
      "O'zingiz ko'targan bitta g'azabdan xalos bo'ling - uni chin dildan, hech bo'lmaganda o'z yuragingizda qoldiring.",
    habit: "Sizga zulm qilgan kishi uchun ozoringizni takrorlash o'rniga, tinchgina duo qiling.",
  },
];

export const QURAN_GUIDE_TADABBUR_PROMPTS_UZ: DeepPartial<QuranGuideTadabburPrompt>[] = [
  {
    question: "Bu oyatda Alloh menga nimani o'rgatadi?",
    hint: "Oyatni sekin o'qing va uning qurilish qismlariga e'tibor bering: Alloh amr, ogohlantirish, va'da beradimi yoki hikoya qiladimi? U qaysi ismlardan foydalanadi va bu ism U biz bilan bu yerda qanday munosabatda bo'lishi haqida nimani ochib beradi?",
  },
  {
    question: "Buni bugungi kunda qanday qilib bitta aniq harakatda qo'llashim mumkin?",
    hint: "Noaniq o'lchamlar yo'qoladi; aniqlari yopishadi. Oyatni bitta bajarilishi mumkin bo'lgan qadamga aylantiring - bitta suhbat qurish, boshlash uchun bitta odat, kun tugashidan oldin bitta tanlov qilish.",
  },
  {
    question: "Ushbu oyat tufayli qaysi odatni yaxshilashim yoki olib tashlashim kerak?",
    hint: "Oyatni kundalik ishingizga - uyquga, nutqingizga, sarf-xarajatingizga, ibodatingizga, munosabatlaringizga tushiring. Bu misra jimgina qaysi biriga barmoq qo'yadi?",
  },
  {
    question:
      "Bu oyat meni Allohning rahmatiga umid qilishga yoki Uning adolatidan qo'rqishga undaydimi - va bu ikkalasi nima uchun muhim?",
    hint: "Mo'min kishi xavf (Allohning azobidan qo'rqish) va raja (Uning rahmatidan umid qilish) orasida ikki qanotdek yuradi. Bu oyat hozir sizda qaysi birini kuchaytirayotganini va qalbingiz bunga ko'proq muhtojmi yoki yo'qligini so'rang.",
  },
  {
    question: "Rasululloh sollallohu alayhi vasallam bu oyatni qanday yashaganlar?",
    hint: "Payg'ambar sollallohu alayhi vasallamni \"yuruvchi Qur'on\" deb ta'riflaganlar. Sahih sira va tafsirga qarang - Ibn Kasir ko'pincha qanday qilib oyatni gavdalantirganini keltiradi - va amaliy namuna sifatida undan namuna oling.",
  },
  {
    question: "Bu oyat qaysi duoni ilhomlantiradi?",
    hint: "Oyat duoga aylansin. Sajda paytida o'z so'zlaringiz bilan Allohdan so'rang, oyat nima qo'zg'atgan bo'lsa - ogohlantirishdan himoya qilish, va'dadan ulush olish yoki buyruqni bajarishga yordam berish.",
  },
];

export const QURAN_GUIDE_READING_LEVELS_UZ: DeepPartial<QuranGuideReadingLevel>[] = [
  {
    title: "Arab alifbosi",
    summary:
      "Barcha 28 harfni alohida shaklda tanib olishni va har birini nomi bilan bilishni o'rganing. Bu aniq tanishlik - xatni ko'rish va uning tovushini darhol nomlash - va bu hamma narsaning asosidir.",
    topics: ["Harf nomlari", "Asosiy shakllar", "O'ngdan chapga yo'nalish"],
  },
  {
    title: "Harf shakllari",
    summary:
      "Ko'pgina harflar so'zning boshi, o'rtasi yoki oxiriga qarab shakli o'zgarishini bilib oling, chunki arab tili kursiv kabi birlashtiriladi. Qaysi bir nechta harflar o'zidan keyingi harf bilan bog'lanmasligini bilib oling.",
    topics: ["Bog'langan yozish", "Bir-biriga bog'lanmagan harflar", "Alif, vav, ya variantlari"],
  },
  {
    title: "Harakat (unlilar)",
    summary:
      "Har bir harfga oʻz unlisini beradigan kichik belgilarni oʻzlashtiring: fatha (a), kasra (i), damma (u), unlisiz sukun, ikkilamchi shaddah va tanvin oxiri. Bu belgilar jim harflarni o'qilishi mumkin bo'lgan so'zlarga aylantiradi.",
    topics: ["Qisqa unlilar", "Sukun", "Shaddah ikki barobar", "Tanvin"],
  },
  {
    title: "Birlashtiruvchi harflar",
    summary:
      "Uni birlashtiring: harflarni va ularning harakatini bo'g'inlarga va qisqa so'zlarga aralashtirib, o'ngdan chapga o'qing. So'z boshida \"al-\" qanday talaffuz qilinishini belgilovchi quyosh va oy harflari qoidasi bilan tanishing.",
    topics: ["CV shakllari", "Umumiy prefikslar", "Quyosh va oy harflari"],
  },
  {
    title: "So'zlarni o'qish",
    summary:
      "Haqiqiy Qur'on lug'atini asta-sekin va to'g'ri dekodlashni boshlang - Bismillah va har bir namozda o'qigan al-Fotiha so'zlaridan boshlab - o'qish boshidanoq ibodat bilan bog'lanishi uchun.",
    topics: ["Yuqori chastotali so'zlar", "Bismilloh", "Al-Fotiha so'zlari"],
  },
  {
    title: "She'rlarni o'qish",
    summary:
      "Juz Ammadan qisqa toʻliq oyatlarga oʻting, asosiy tajvid va nafas olish uchun toʻxtab turish (vaqf) haqida maʼlumotni qoʻshib, har doim qori bilan birga oʻqing, shunda qulogʻingiz tilingizni boshqaradi.",
    topics: ["Juz Amma suralari", "Vaqf belgilari", "Qiroatchiga ergashish"],
  },
  {
    title: "Ravon o'qish",
    summary:
      "Tabiiy ravishda qo'llaniladigan tajvid qoidalari bilan silliq, ishonchli qiroatga erishing. Kundalik qismni ushlab turing va o'qituvchi yoki malakali o'quvchi sizni tekshirishini davom ettiring, chunki ravonlik doimiy tuzatish orqali sayqallanadi, lekin bir marta erishilmaydi va keyin qoladi.",
    topics: ["Kundalik qism", "Tajvid qoidalari qo'llaniladi", "O'qituvchining fikr-mulohazasi"],
  },
];

export const QURAN_GUIDE_QUIZ_UZ: DeepPartial<QuranGuideQuizQuestion>[] = [
  {
    prompt: "Qur'onda nechta sura (bob) bor?",
    options: ["99", "114", "124", "144"],
    explanation:
      "Qur'onda 114 ta sura mavjud bo'lib, ular uch oyatdan 286 tagacha. Ularning mus'hafdagi tartibi vahiy (tavqifi) bilan belgilangan.",
  },
  {
    prompt: "Kundalik o'qish uchun Qur'on necha teng qismga (juz) bo'lingan?",
    options: ["7", "12", "30", "60"],
    explanation:
      "O'ttiz juz. Kuniga bir juz o'qish butun Qur'onni bir oyda tugatadi - bu Ramazon oyida xatmni tugatishning klassik usuli.",
  },
  {
    prompt: "Qur'ondagi eng uzun sura qaysi 286 oyatdan iborat?",
    options: ["Al-Fotiha", "Al-Baqara", "Ya-Sin", "An-Nas"],
    explanation:
      "Baqara surasi eng uzuni, 286 oyatdan iborat. Bu shariat va hidoyatga boy Madaniy suradir.",
  },
  {
    prompt: "To'g'ri yoki yolg'on: Makkiy sura Madinaga hijratdan oldin nozil qilingan suradir.",
    options: ["To'g'ri", "Yolg'on"],
    explanation:
      "Makkiy suralar hijratdan oldin nozil bo'lgan va ko'pincha e'tiqod va tavhidga qaratilgan; Madaniy suralar keyin kelgan va ko'pincha qonun va jamoat yo'l-yo'riqlarini qo'shadi.",
  },
  {
    prompt:
      "Qaysi surada Payg'ambarimiz sollallohu alayhi vasallamga Hiro g'orida nozil qilingan birinchi oyatlar bor?",
    options: ["Al-Fotiha", "Al-Alaq (Iqro)", "Al-Baqara", "Al-Ixlos"],
    explanation:
      "Birinchi vahiy “Alaq” (96) surasining “Iqro” – yaratgan Parvardigoringiz nomi bilan o‘qing” degan bosh oyatlari edi.",
  },
  {
    prompt: "Qur'on taxminan necha yil davomida nozil bo'lgan?",
    options: ["3 yil", "10 yil", "23 yil", "40 yil"],
    explanation:
      "Qur'on taxminan 23 yil davomida - 13 yil Makkada va 10 yil Madinada - voqealar va ehtiyojlarga javob beruvchi bosqichma-bosqich nozil bo'lgan.",
  },
  {
    prompt: "To'g'ri yoki yolg'on: Qur'on Ramazon oyida, Qadr kechasida nozil bo'la boshlagan.",
    options: ["To'g'ri", "Yolg'on"],
    explanation:
      "Alloh taolo Qur'on Ramazon oyida (2:185) Qadr kechasida (97:1) nozil qilinganligini aytadi. O'sha tunni izlash buyuk fazilatdir.",
  },
  {
    prompt: "Kundalik namozning har rakatida qaysi sura o'qiladi?",
    options: ["Al-Ixlos", "Al-Fotiha", "Al-Kavsar", "An-Nasr"],
    explanation:
      "Har bir namozda Fotiha surasi — yetti oyat o‘qiladi. «Kitobning ochilishini o'qimaganning namozi yo'q».",
  },
  {
    prompt: "“Bismillah ir-rahmon ir-rohim” bilan boshlanmagan sura qaysi?",
    options: ["Al-Fotiha", "Tavba", "Al-Ixlos", "An-Nas"],
    explanation: "Tavba surasi (9) Basmala bilan ochilmaydigan yagona suradir.",
  },
  {
    prompt: "Tajvidda Madd hukmronligi nimani boshqaradi?",
    options: [
      "Ikki harfni birlashtirish",
      "Unli tovushni cho'zish (cho'zish).",
      "Ba'zi harflarda aks sado paydo bo'ladi",
      "Qaerda to'xtash va nafas olish kerak",
    ],
    explanation:
      "Madd ma'lum sonlar uchun alif (ạ), vav (w) va ya (y) — madd harflariga unli tovushni cho'zish demakdir.",
  },
  {
    prompt:
      "Qalqalah qaysi harflar to'plamiga sukun olib kelganda berilgan yorug'lik aks-sadosi \"sakrash\" hisoblanadi?",
    options: ["ي ر م ل و ن", "ق ط ب ج د", "ء ه ع ح غ خ", "ا و ي"],
    explanation:
      "Beshta qalqalah harfi qūṭ̊bu jādu - q ṷ b j d iborasida to'plangan - ular sukunni ko'targanda toza rebound berilgan.",
  },
  {
    prompt: "Qur'onda tez-tez uchraydigan \"Rabb\" so'zi (rabu) ma'nosini bildiradi:",
    options: ["Mehr", "Rabbiy, ustoz, qo'llab-quvvatlovchi", "Kitob", "Bog'"],
    explanation:
      '"Rabb" - Rabbiy, Ustoz va qo\'llab-quvvatlovchi - yaratuvchi, egalik qiluvchi, tarbiyalovchi va boshqaruvchi degan ma\'noni anglatadi. "Rabbana" "Rabbimiz" degan ma\'noni anglatadi.',
  },
  {
    prompt: "\"Jannah\" (janãẗ) so'zi quyidagi ma'noni anglatadi:",
    options: ["Olov", "Jannat bog'i", "Namoz", "Ro'za"],
    explanation:
      "“Jannat” jannat – abadiy ajr maskani, “ostidan daryolar oqib turgan bog‘lar” degan ma’noni anglatadi.",
  },
  {
    prompt: "Qaysi payg‘ambar o‘g‘li Ismoil bilan Makkada Ka’ba poydevorini ko‘targan?",
    options: ["Nuh", "Muso", "Ibrohim", "Yusuf"],
    explanation:
      "Ibrohim (Allohning do‘sti Xalilulloh) va Ismoil alayhissalom: “Ey Robbimiz, bizdan buni qabul qilgin”, deb duo qilib, Ka’bani qurdirdilar (2:127).",
  },
  {
    prompt:
      "Qaysi payg'ambar Alloh bilan to'g'ridan-to'g'ri gaplashib, Fir'avnga duch keldi va Bani Isroilni ajralgan dengizdan o'tkazdi?",
    options: ["Iso", "Muso", "Odam", "Yunus"],
    explanation:
      "Muso (Kalimulloh) Alloh bilan gaplashdi, Fir'avnga yuborildi va Allohning amri bilan dengiz yorilib, uning qavmi omon-eson o'tib ketdi.",
  },
  {
    prompt: "Qaysi sura yoki qisqa parchani tushunib, yod olishga intilasiz, in shaa Alloh?",
    explanation:
      "Kichkina izchil qadamlar Allohning Kitobi bilan umrboqiy aloqani o'rnatadi. O'z qismingizni tanlang, uning ma'nosini bilib oling va uni tez-tez qayta ko'rib chiqing.",
  },
];
