import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// uz overlay for janazah-guide. Index-aligned with JANAZAH_GUIDE_TOPICS in ../janazah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const JANAZAH_GUIDE_TOPICS_UZ: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Kommunal majburiyat",
    summary: "Janoza farzi kifoyadir - jamoat uni bajarishi kerak.",
    body: [
      "Janoza namozi jamoat farzi (farzi kifoya): agar jamoatdan bir qismi o'qisa, qolganlaridan farz olib tashlanadi; hech kim qilmasa, hamma aybni o'rtoqlashadi. Ruku yoki sujudsiz tik turgan holda o'qiladi - namozlar orasida o'ziga xos shakl.",
      "Abu Hurayra raziyallohu anhu rivoyat qiladilar: «Rasululloh sollallohu alayhi vasallam: «Kimki janozaga namoz o‘qilgunga qadar qatnashsa, unga bir qirot (savob) bo‘ladi, kimki dafn etgunicha qatnashsa, ikki qirot (savob) bo‘ladi», dedilar. U zotdan qirot nima, deb so‘ralganda: «Ikki ulug‘ tog‘dek», dedilar (Sahih al-Buxoriy 1325; Sahih Muslim 945).",
      "Janozadan keyin yuvinish va dafn qilishda yordam berish, o'lik uchun duo qilish musulmonning boshqa bir zimmasidagi haqlaridandir. Badanga hurmat bilan munosabatda bo'ling va dalilsiz isrofgarchilik yoki amaliyotlardan qoching.",
    ],
    actions: [
      "Jamiyatingizda dafn marosimi e'lon qilinganida tezda javob bering.",
      "Ijtimoiy ko'rinish uchun emas, Alloh rizoligi uchun namoz va tashrifga niyat qiling.",
      "Agar hurmat bilan qila olsangiz, oilaning amaliy ehtiyojlariga yordam bering.",
    ],
    hadith: [
      {
        excerpt:
          "Kim janoza namozini o‘qigunicha qatnashsa, bir qirot, kimki dafn etgunga qadar qatnashsa, ikki qirot – har biri ulug‘ tog‘dek bo‘ladi.",
      },
      {
        excerpt:
          "Kim bir musulmonning janozasiga iymon va savob uchun ergashsa va namoz o‘qilib, dafn nihoyasiga yetguncha tursa, ikki qirot bilan qaytadi...",
      },
    ],
  },
  {
    title: "Yuvish va o'rash",
    summary: "Marhumning g'usli va oddiy kafan - isrofgarchiliksiz izzat.",
    body: [
      "O'lgan musulmonlar (mumtoz hukmida jang maydoni shahidlaridan tashqari) tozalovchi yuvinish bilan yuviladi, so'ngra toza oq mato bilan kafanlanadi. Ummu Atiyya raziyallohu anhu rivoyat qiladilar: “Rasululloh sollallohu alayhi vasallam qizining yuvilishi haqida: “Uni uch yoki besh marta, agar mos deb bilsangiz, suv va sidr bilan yuving va oxirgisiga kofur yoki bir oz kofur qo‘ying”, dedilar (Sahih al-Buxoriy 1253).",
      "Oisha raziyallohu anho rivoyat qiladilar: Rasululloh sollallohu alayhi vasallam uchta oq Yaman paxta kiyimida kafanlangan edilar, ular orasida na ko‘ylak, na salla bor edi (Sahih al-Buxoriy 1264; Sahih Muslim 941). Oddiylik sunnatdir; qimmat namoyishlar bashoratli misolga ziddir.",
      "Kim kimni yuvadi, erkak va ayol uchun qancha mato va shunga bog'liq ma'lumotlarda mazhab farqlari bor. Oilalar maktab amaliyotini biladigan bilimdon mahalliy yo'riqnoma yoki dafn marosimiga amal qilishlari kerak - bu umumiy ko'rinish yuvish uchun qo'llanma emas.",
    ],
    actions: [
      "Iloji bo'lsa, marhum bilan bir xil jinsdagi ishonchli odamlarni tayinlang.",
      "Kafanni oddiy va toza tuting - oq mato bashoratli namunadir.",
      "Zaruratsiz tanani suratga olish yoki fosh qilishdan saqlaning.",
    ],
    hadith: [
      {
        excerpt:
          "Uni uch marta, agar kerak bo'lsa, besh yoki undan ko'p marta suv va sidr bilan yuving va oxirgi yuvishda kofur yoki bir oz kofur qo'ying.",
      },
      {
        excerpt:
          "Rasululloh sollallohu alayhi vasallam uchta oq Yaman paxta kiyimida kafanlandilar. ular orasida na ko'ylak, na salla bor edi.",
      },
    ],
  },
  {
    title: "Marhumning ko'zlarini yumganda",
    summary: "O'lim paytidagi bashoratli duo.",
    body: [
      "Ummu Salama raziyallohu anhu rivoyat qiladilar: «Rasululloh sollallohu alayhi vasallam Abu Salamaning huzurlariga ko‘zlari tikilgan paytda keldilar. U zot ularni yopdilar va: «Jon olinsa, ko'z o'ngiga ergashadi», dedi va xonadonidagilar yig'ladilar. So‘ngra ularga faqat yaxshi so‘z aytishni o‘rgatdi, chunki farishtalar ularning aytganlariga “amin” deyishdi va Abu Salamaga duo qildilar (Sahih Muslim 920).",
      "Quyidagi to'plamdagi Hisnul Muslim yozuvida ko'z yumishda ishlatiladigan so'z saqlanib qolgan. Yumshoq gapiring, Rasululloh sollallohu alayhi vasallam man qilgan yig'lashdan saqlaning, tilni yaxshi so'z va istig'for bilan band qiling.",
    ],
    actions: [
      "Ko'zlaringizni muloyimlik bilan yoping va haqiqiy duo qiling.",
      "Oilaga yaxshi gapirishni eslatib turing.",
    ],
    hadith: [
      {
        excerpt:
          "Abu Salama roziyallohu anhuning ko'zlari qadalganida, Rasululloh sollallohu alayhi vasallam ularni yopdilar va ruh olinsa, ko'rish unga ergashishini, so'ngra xonadon ahlini faqat yaxshi so'z aytishni o'rgatishlarini aytdilar.",
      },
    ],
  },
  {
    title: "Janoza namozini qanday o'qish kerak",
    summary: "To'rt takbir bilan tik turib namoz - ruku va sujudsiz.",
    body: [
      "Janoza namozi tik turgan holda o‘qiladi. Ruku ham, sujud ham, azon ham, iqomat ham yo‘q. Imom, Anas va Samuradan (qarang: Abu Dovud 3194 va tegishli rivoyatlarga) ko'ra, erkak marhumning boshida yoki ayolning o'rtasida turadi va jamoat orqasida saf tortadi.",
      "Namoz to'rt takbirdan iborat. Birinchisidan keyin Fotiha surasi o‘qiladi (Buxoriy 1335). Keyingi takbirlardan so‘ng Payg‘ambarimiz sollallohu alayhi vasallamga salovot aytiladi va marhumga duo qilinadi. Namoz taslim bilan tugaydi. Jobir raziyallohu anhu rivoyat qiladilar: «Rasululloh sollallohu alayhi vasallam Najoshiyga (Habash podshosi) janoza namozini o‘qib, to‘rtta takbir aytdilar (Sahih al-Buxoriy 1334).",
      "Takbirni o'tkazib yuborganlar imomga ergashishlari va o'tkazib yuborganlarini maktab qoidalariga muvofiq bajarishlari kerak - agar ishonchingiz komil bo'lmasa, imomdan yoki mahalliy o'qituvchidan so'rang.",
    ],
    actions: [
      "Qatorlarda turish; ruku va sajda qilmanglar.",
      "Imom bilan to‘rtta takbir ayting.",
      "Tegishli takbirdan keyin marhum uchun xolis duo qiling.",
    ],
    hadith: [
      {
        excerpt:
          "Rasululloh sollallohu alayhi vasallam Najoshiyning janoza namozini o‘qib, to‘rtta takbir aytdilar.",
      },
      {
        excerpt:
          "Ibn Abbos janoza namozini o‘qib, sunnatdan ekanini aytib, Fotiha surasini o‘qidi.",
      },
    ],
  },
  {
    title: "Janoza namozidagi duolar (kattalar)",
    summary: "Marhum uchun haqiqiy Hisnul musulmon so'zlari.",
    body: [
      "Takbirlardan so'ng, Janozaning qalbi marhum uchun duo bo'lib, Allohdan ularni mag'firat qilishini, rahm-shafqatini ko'rsatishini va ularga jannatni berishini so'rashdir. “Hisnul Muslim”da Payg‘ambarimiz sollallohu alayhi vasallamdan bir qancha sahih lug‘atlar saqlanib qolgan.",
      "Arabcha, transliteratsiya va maʼnoda oʻqish uchun quyidagi bogʻlangan duoni oching. Siz bir nechta haqiqiy so'zlarni o'rganishingiz mumkin; samimiylik uzunlikdan ko'ra muhimroqdir.",
    ],
    actions: [
      "Kamida bitta sahih Janoza duosini yodlang.",
      "Qachonki barcha musulmon o'lganlar uchun umumiy duo qiling.",
    ],
  },
  {
    title: "Yana janoza duolari",
    summary: "Hisnul Muslimdan qo'shimcha sahih so'zlar.",
    body: [
      "Hisnul Muslim Rasululloh sollallohu alayhi vasallamdan o'rgatilgan boshqa janoza namozlarini saqlab qolgan. Ulardan navbatma-navbat foydalaning yoki hamjamiyatingiz eng yaxshi biladiganini o'rganing.",
      "Vafot etgan bola uchun o'ziga xos duolar Allohdan bolani ota-onasi uchun oldingi va saqlangan mukofot bo'lishini so'raydi - keyingi mavzuga qarang.",
    ],
  },
  {
    title: "Janoza duosi #3",
    summary: "Voyaga etgan marhum uchun yana bir haqiqiy so'z.",
    body: [
      "Janoza namozi uchun yana bir Hisnul Muslim lafzi. Imomingizning amaliyoti imkon berganidek, tegishli takbirdan keyin ayting.",
    ],
  },
  {
    title: "Janoza duosi #4",
    summary: "Sunnatdan to'rtinchi sahih lug'at.",
    body: [
      "Hisnul Muslim ushbu qo'shimcha janoza duosini o'z ichiga oladi. Har bir so'zni bir vaqtning o'zida to'plashdan ko'ra, haqiqiylikni va yurakning mavjudligini tanlang.",
    ],
  },
  {
    title: "O'lgan bola uchun duolar",
    summary: "Marhum bolaligida maxsus bashoratli duolar.",
    body: [
      "Marhum bola bo'lsa, sahih duolar Alloh taolodan bolani to'plangan xazina, peshvo va ota-ona uchun ijobat bo'lgan shafoatchi qilishini so'raydi. Quyidagi Hisnul Muslim yozuvlari bu iboralarni saqlab qolgan.",
      "O'ylab topilgan urf-odatlardan qochgan holda, Allohning rahmatidan umid qilib, oila a'zolarini taskinlang. Xuddi shu to'rt takbirli Janoza tuzilishi amal qiladi; duo mazmuni o'zgargan narsadir.",
    ],
    actions: [
      "Zarur bo'lganda, bolaga xos duolardan foydalaning.",
      "G'amgin ota-onalarni huzur va halol yordam bilan qo'llab-quvvatlang.",
    ],
  },
  {
    title: "Bolaning dafn duosi №2",
    summary: "O'lgan bola uchun ikkinchi hisnul musulmon lafzi.",
    body: ["Bolaning janoza namozi uchun yana bir sahih lug'at Hisnul Muslimda saqlanib qolgan."],
  },
  {
    title: "Dafn va qabr",
    summary: "Badanni pastga tushirish, qiblaga qaratish va dafn qilingandan keyin duo qilish.",
    body: [
      "Marhum yerga qiblaga qaragan holda, izzat-ikrom va tayyorgarlik talab qiladigan darajada kechiktirmasdan dafn etiladi. Rasululloh sollallohu alayhi vasallam: «Janozada tez bo‘l...», dedilar (Sahih al-Buxoriy 1315 — Janozani tezlashtirish).",
      "Marhumni qabrga qo'yishda Hisnul Muslimda sahih duo saqlanadi. Rasululloh sollallohu alayhi vasallam dafn etilgandan keyin qabr boshida turib: “Birodaring uchun mag‘firat so‘rang va sobit bo‘lishini so‘rang, chunki u hozir so‘roq qilinmoqda”, der edilar (Sunan Abu Dovud 3221 — keyingi ko‘plab olimlar, jumladan, Alboniy sahih deb baholagan).",
      "Qabrlar ustiga bezakli inshootlar qurish, ularni bezash uchun suvoq qilish yoki mubolag'a qilishga undaydigan yozuvlardan sahih xabarlarda ogohlantiriladi. Qonun va mahalliy urf-odatlar identifikatsiyalashga imkon beradigan joyda belgini oddiy saqlang.",
    ],
    hadith: [
      {
        excerpt:
          "Dafn marosimida shoshilinch bo'ling: agar u solih bo'lsa, siz uni yaxshilikka tezlashtirasiz. agar bo'lmasa, bo'yningizdan yomonlikni tushirasiz.",
      },
      {
        excerpt:
          "Birodaringiz uchun mag'firat so'rang va sabrli bo'lishini so'rang, chunki u hozir so'roq qilinmoqda.",
      },
    ],
  },
  {
    title: "Marhumni dafn qilgandan keyin",
    summary: "Qabrda sabr qilish uchun duo.",
    body: [
      "Dafn qilingandan keyin qisqa vaqt turib, marhum uchun mag‘firat va sabr-toqat so‘rash Payg‘ambarimiz sollallohu alayhi vasallamdan rivoyat qilingan (Abu Dovud 3221). Quyidagi Hisnul Muslim lafzi dafn etilgandan keyin.",
      "Doimiy xayr-ehson qilish, duo qilish va marhumning qonuniy vasiyatlarini bajarish Allohning izni bilan ularga foyda keltiradi - dalilsiz yillik marosimlarni o'ylab topmasdan.",
    ],
    actions: [
      "Dafn qilingandan keyin qabrda duo qiling.",
      "Marhum uchun shaxsiy duo va sadaqalarni davom ettiring.",
    ],
  },
  {
    title: "Qabrlarni ziyorat qilish",
    summary: "Qabrlarni ziyorat qilishda bashoratli salom.",
    body: [
      "Qabrlarni ziyorat qilish oxirat hayotini eslatadi. Burayda raziyallohu anhu rivoyat qiladilar: «Rasululloh sollallohu alayhi vasallam qabristonga chiqqanlarida: «Alloh xohlasa, biz ham ularga qo‘shilamiz», deb, mo‘minlar va musulmonlar orasidan o‘z xonadonlari ahliga salom ayting va biz va ularning holidan xabar so‘rashni o‘rgatar edilar (Sahih Muslim 975-Ibn, Ibn Ibn).",
      "Quyidagi Hisnul Muslim yozuvi bu salomlashishni saqlaydi. Tashriflarni yig'lashdan, o'liklardan yordam so'rashdan yoki dalilsiz marosimlardan ozod qiling.",
    ],
    actions: [
      "Qabr ahliga sahih so'zlar bilan salom ayting.",
      "O'lim haqida o'ylang va solih ishlarni yangilang.",
    ],
    hadith: [
      {
        excerpt:
          "Assalomu alaykum, ey mo'minlar va musulmonlar o'rtasidagi uy ahli. Alloh xohlasa sizlarga qo'shilamiz. Allohdan o'zimizga ham, sizlarga ham omonlik tilaymiz.",
      },
    ],
  },
  {
    title: "Eslatmalar va keng tarqalgan xatolar",
    summary: "Yig'lamaslik, namoyishni kechiktirish va asossiz marosimlardan saqlaning.",
    body: [
      "Rasululloh sollallohu alayhi vasallam o'liklarni yig'lab yig'lashni man qilganlar. Abdulloh ibn Umar raziyallohu anhu rivoyat qiladilar: “Sa’d ibn Uboda janozada yig‘lagan edi, Rasululloh sollallohu alayhi vasallam Alloh taolo ko‘z yoshlari yoki qalb qayg‘usi uchun emas, balki buning uchun jazolashini tushuntirib, tiliga ishora qildilar (Sahih al-Buxoriy 1304).",
      "Obro'li yig'inlar uchun dafn qilishni kechiktirmang va kambag'allarni e'tiborsiz qoldirib, kafan va ziyofatga pul sarflamang. Dafn marosimiga taalluqli yangiliklarni haqiqiy asossiz tilovat qilmang yoki amalda qilmang. Ta’ziya, sokin duo, oilaga amaliy yordam berish sunnat yo‘lidir.",
      "Ayollarning namoz va dafn marosimida qatnashishi maktablar va davrlar bo'yicha nuance bilan ko'rib chiqiladi; shafqat va bashorat chegaralarini hurmat qiladigan ishonchli mahalliy yo'l-yo'riqlarga amal qiling.",
    ],
    disclaimer:
      "Ta'lim haqida umumiy ma'lumot - dafn direktorining qo'llanmasi yoki fatvo emas. Yuvish, kafanlash va qabriston qoidalari bo'yicha mahalliy maktab amaliyoti malakali odamlar bilan tasdiqlanishi kerak.",
    actions: [
      "Yig'lamasdan yoki taqiqlangan nutqsiz qayg'uring.",
      "Hurmatli dafn qilishni tezlashtiring.",
      "Oilani isrofgarchilik bilan yuklamasdan, ularga oziq-ovqat va ishlarda yordam bering.",
    ],
    hadith: [
      {
        excerpt:
          "Alloh taolo ko‘z yoshlari va qalb qayg‘usi uchun jazolamaydi, balki buning uchun jazolaydi yoki rahm qiladi – va tiliga ishora qildi.",
      },
    ],
  },
  // --- v2 appended topics (keep index-aligned with English) ---
  {
    title: "Takbirma-takbir — namoz qadamlari",
    summary: "To‘rt takbir va ular orasidagi amallarning amaliy ro‘yxati.",
    body: [
      "Birinchi takbir: qo‘llarni ko‘taring (mazhabingizga ko‘ra), «Allohu akbar» deng, so‘ng «al-Fotiha» surasini o‘qing. Ibn Abbos janoza namozida «al-Fotiha»ni o‘qib, uning sunnatdan ekanini aytgan (Sahih al-Buxoriy 1335).",
      "Ikkinchi takbir: Payg‘ambarimiz ﷺga salovot yuboring — tashahhudda qo‘llaniladigan Ibrohimiy salovot shu qadamda keng o‘rgatiladi. Uchinchi takbir: marhum uchun xolis duo qiling (ushbu qo‘llanmadagi Hisnul Muslim lafzlari). To‘rtinchi takbir: ko‘p olimlar qisqa umumiy duo qiladilar, so‘ng o‘ngga (va mazhabga ko‘ra chapga) taslim bilan yakunlaydilar.",
      "Ruku, sujud yoki o‘tirish yo‘q. Butun vaqt turing. Bir necha janoza bo‘lsa, ko‘p jamoatlarda barchaga bir niyat bilan bitta janoza o‘qiladi — imomga ergashing. Salovot va duoning o‘rni mazhabga ko‘ra biroz o‘zgarishi mumkin; to‘rt takbirli ramka umumiy.",
    ],
    madhhabNote:
      "Hanafiy, molikiy, shofe’iy va hanbaliy kitoblar har takbirda qo‘l ko‘tarilishi va duo aynan qachon aytilishi bo‘yicha farq qiladi. Oldingizdagi imomga ergashing.",
    actions: [
      "To‘rt takbir ketma-ketligini kerak bo‘lguncha o‘rganing.",
      "Fotihani, salovotni va kamida bitta janoza duosini yodlang.",
    ],
    hadith: [
      {
        excerpt:
          "Ibn Abbos janoza namozini o‘qib, «al-Fotiha»ni o‘qidi va uning sunnatdan ekanini aytdi.",
      },
    ],
  },
  {
    title: "Erkaklar, ayollar va bolalar uchun duolar",
    summary: "Xuddi shu payg‘ambarona lafzlar — arab olmoshlarini marhumga moslashtiring.",
    body: [
      "Hisnul Muslim (va klassik hadis to‘plamlari) janoza duolarini asosan erkak shaklida yozadi. Bu ayollar uchun alohida «o‘ylab topilgan» duo degani emas. Asosiy olimlar erkak lafzni shaxsga niyat bilan qoldirishga, yoki — afzalroq va ko‘pincha — grammatikani marhumga mos o‘zgartirishga o‘rgatadilar: لَهُ / هُ / هِ → لَهَا / هَا; عَبْدُكَ → أَمَتُكَ; ابْنُ أَمَتِكَ → ابْنَةُ أَمَتِكَ; va qiz bola uchun اجْعَلْهُ → اجْعَلْهَا, شَفِيعًا مُجَابًا → شَفِيعَةً مُجَابَةً.",
      "Vafot etgan ayol uchun ba’zi olimlar «eridan yaxshiroq juft» (زَوْجًا خَيْرًا مِنْ زَوْجِهَا) iborasiga ehtiyot bo‘lishni maslahat beradilar — u jannatda eri bilan qayta uchrashishi mumkin; o‘sha bandni tashlab qo‘yishingiz yoki umumiy lafzni saqlashingiz mumkin. Bolalar uchun faqat kattalarning mag‘firatga yo‘naltirilgan matnlariga emas, bolaga xos Hisnul yozuvlarini (hisn-160, hisn-161) ishlating.",
      "«Erkaklarimiz va ayollarimizni mag‘firat qil» degan jamoaviy lafz (hisn-157) ikkala jinsni ham o‘zgartirmasdan qamrab oladi. Biz haqiqiy matnlarning grammatik moslashuvidan tashqari yangi arabcha o‘ylab topmaymiz — bog‘langan kattalar duosini asos qilib oching va yuqoridagi olmosh xaritasini qo‘llang.",
    ],
    madhhabNote:
      "Erkak shakllarni niyat bilan saqlash ham, ayol shakllariga moslashtirish ham asosiy olimlar orasida qabul qilingan. Ishonchingiz komil bo‘lmasa, hisn-157 (erkaklar va ayollar) ishlating yoki imomdan so‘rang.",
    actions: [
      "Yodlaydigan duongiz uchun ayol olmoshlarini almashtirishni mashq qiling.",
      "Balog‘atga yetmaganlar uchun bolaga xos duolarni ishlating.",
      "Uzun isbotlanmagan risolalardan ko‘ra haqiqiylikni afzal ko‘ring.",
    ],
    appLinks: [{ label: "Kattalar janoza duosi №1" }],
  },
  {
    title: "Shahidlar, tushik va maxsus holatlar",
    summary: "Yuvish yoki janoza hukmlari odatiydan farq qilganda.",
    body: [
      "Jangda vafot etgan jang maydoni shahidlari Uhuddan olingan klassik hukmda odatiy g‘uslsiz kiyimlari bilan dafn etiladi; Rasululloh ﷺ Uhud shahidlarini qonlari bilan yuvmasdan dafn etishni buyurganlar (Sahih al-Buxoriy 1346). Savobda «shahid» deyiladigan boshqa toifalar (masalan, vabo, cho‘kish) odatda yuviladi va janoza o‘qiladi — chegara holatlarda olimdan so‘rang.",
      "Tushik yoki o‘lik tug‘ilgan chaqaloq uchun maktablar janoza namozi va to‘liq yuvish qachon qo‘llanilishi bo‘yicha farq qiladi (ko‘pincha taniladigan shakl yoki ruh puflash bosqichi bo‘lganmi degan bahoga bog‘liq). Bir hadis tushik ustida namoz o‘qishni va ota-onaga mag‘firat va rahmat tilashni rag‘batlantiradi (Abu Dovud 3180). Taxmin qilish o‘rniga mazhabingizning janoza qo‘mitasiga amal qiling.",
      "Musulmon bo‘lmagan qarindoshlarga musulmon janoza namozi o‘qilmaydi; mehr, qonuniy dafn yordami (qo‘llaniladigan joyda) va shaxsiy qayg‘u — mo‘minlarning ibodat namozidan alohida. Maxsus holatlarni har doim malakali mahalliy yo‘riqnoma bilan tasdiqlang.",
    ],
    madhhabNote:
      "Jang maydoni shahidligi, tushik bosqichlari va o‘lik tug‘ilgan chaqaloq ustida namoz ta’riflari maktabga ko‘ra farq qiladi. Bu mavzu masalalarni belgilaydi — u fatvo emas.",
    disclaimer:
      "Maxsus hukmlar nozik. Harakat qilishdan oldin malakali olim yoki jamoatingizning janoza xizmati bilan tasdiqlang.",
    actions: [
      "Olim ko‘rsatmasiga zid ravishda jang maydoni shahidini yuvmang.",
      "Tushik yoki o‘lik tug‘ilish holatlari haqida janoza qo‘mitasidan so‘rang.",
    ],
    hadith: [
      {
        excerpt:
          "Rasululloh ﷺ Uhud shahidlarini qonlari bilan dafn etishni buyurdilar va ular yuvilmadi.",
      },
      {
        excerpt: "Tushik ustida janoza namozi o‘qiladi va ota-onaga mag‘firat va rahmat tilanadi.",
      },
    ],
  },
  {
    title: "G‘oyibona janoza",
    summary: "Rasululloh ﷺ jasad uzoqda bo‘lganida Najoshiy uchun namoz o‘qidilar.",
    body: [
      "Jobir rivoyat qiladilar: Rasululloh ﷺ sahobalariga chiqdilar, ularni safga turdirdilar va chet elda vafot etgan Habash podshosi Najoshiy (al-Najoshiy) uchun to‘rt takbir o‘qidilar (Sahih al-Buxoriy 1334; Sahih Muslim 952). Bu g‘oyibona janoza namozining (alā al-ghā'ib) asosiy dalilidir.",
      "Maktablar bu namunani qanchalik keng qo‘llash bo‘yicha farq qiladi: ba’zilari uni Najoshiy kabi holatlar bilan cheklaydi (mahalliy musulmon namozi bo‘lmaganda), boshqalari jasad uzoqda bo‘lganda kengroq ruxsat beradi. Jasad bor va jamoat namoz o‘qiy olganda mahalliy janozani o‘tkazib yubormang. Mazhabingizda g‘oyibona namoz qachon o‘rinli ekanini ishonchli mahalliy olimdan so‘rang.",
      "Shakli — xuddi shu to‘rt takbirli namoz; niyat — g‘oyib marhum uchun. Xuddi shu haqiqiy duolarni ishlating, jinsni kerakicha moslashtiring.",
    ],
    madhhabNote:
      "G‘oyibona janoza doirasi ma’lum farq nuqtasidir. Jamoatingizdagi malakali imomlar amaliyotini afzal ko‘ring.",
    actions: [
      "Jasad bor bo‘lganda har doim mahalliy namoz o‘qing.",
      "G‘oyibona janozani ommaviy tadbir sifatida tashkil etishdan oldin so‘rang.",
    ],
    hadith: [
      {
        excerpt: "Rasululloh ﷺ Najoshiy uchun janoza namozini o‘qib, to‘rt takbir aytdilar.",
      },
      {
        excerpt:
          "Allohning Elchisi ﷺ sahobalarni safga turdirdilar va Najoshiy uchun to‘rt takbir bilan namoz o‘qidilar.",
      },
    ],
  },
  {
    title: "O‘lim to‘shagida — so‘nggi so‘zlar",
    summary: "O‘limga yaqin kishini muloyimlik bilan «la ilaha illalloh» demaga undang.",
    body: [
      "Rasululloh ﷺ: «O‘limga yaqinlaringizni «la ilaha illalloh» demaga undalang» dedilar (Sahih Muslim 916; Abu Dovud 3117). Hisnul Muslim kimning so‘nggi so‘zlari «Allohdan boshqa ibodatga loyiq hech kim yo‘q» bo‘lsa, u jannatga kirishi haqidagi ko‘rsatmani saqlaydi (hisn-153, Abu Dovud 3116 dan).",
      "Muloyim va qattiqqo‘lliksiz undang; majburlamang va bahslashmang. O‘limga yaqinlarni Hisnul Muslimda saqlangan umid so‘zlari bilan ham taskinlash mumkin (hisn-150–152). Jon olinganda ko‘zlarni yumib, ko‘z yumish duosini ishlating (oldingi mavzu).",
      "Baland yig‘lashdan va Allohni g‘azablantiradigan so‘zdan saqlaning. Xonadon yaxshini aytishi kerak, chunki farishtalar ularning so‘zlariga omin deyishadi (Sahih Muslim 920).",
    ],
    actions: [
      "O‘limga yaqin kishiga shahodatni muloyim eslatib turing.",
      "Xonani tinch tuting va yaxshi so‘z bilan to‘ldiring.",
    ],
    hadith: [
      {
        excerpt: "O‘limga yaqinlaringizni: la ilaha illalloh demaga undalang.",
      },
      {
        excerpt:
          "Kimning so‘nggi so‘zlari «Allohdan boshqa ibodatga loyiq hech kim yo‘q» bo‘lsa, u jannatga kiradi.",
      },
    ],
    appLinks: [{ label: "Hayot umidi duolari" }, { label: "Ko‘zlarni yumish" }],
  },
  {
    title: "Ta’ziya va motam tutganlar",
    summary: "Tiriklarni payg‘ambarona musibat duosi bilan taskinlang.",
    body: [
      "Ummu Salama rivoyat qiladilar: Allohning Elchisi ﷺ: «Hech bir musulmon musibatga duch kelib, Alloh buyurganini aytmasa — «Biz Allohnikimiz va Unga qaytamiz. Ey Alloh, musibatimda menga savob ber va uni menga yaxshiroq bilan almashtir» — Alloh uni ularga yaxshiroq bilan almashtiradi» dedilar (Sahih Muslim 918). Hisnul Muslim bu lafzni saqlaydi (hisn-154).",
      "Qisqa, rostgo‘y so‘zlar bilan ta’ziya bildiring; oilani mehmondo‘stlik yukiga solmasdan, marhum oilasiga ovqat tayyorlang (Abu Dovud 3132 — Ja’far oilasi haqidagi xabar). Dalilsiz belgilangan kunlik bid’at marosimlardan saqlaning, shaxsiy duo, sadaqa va mehrni davom ettiring.",
      "Ko‘z yoshlari bilan qayg‘u ruxsat etilgan; yig‘lash, yuzga urish va kiyim yirtish man etilgan. Dafndan keyin bevalar, yetimlar va qaramog‘idagilarga qonuniy yordam ko‘rsating.",
    ],
    actions: [
      "Motam tutganlarga musibat duosini o‘rgating.",
      "Ziyofat kutish o‘rniga ovqat va ishlarda yordam bering.",
      "Marhum uchun tinch duo va sadaqani davom ettiring.",
    ],
    hadith: [
      {
        excerpt:
          "Hech bir musulmon musibatga duch kelib, Allohga qaytish haqidagi buyurilgan so‘zlarni aytib, yaxshiroq bilan almashtirishni so‘ramasa, Alloh uni yaxshiroq bilan almashtiradi.",
      },
    ],
    appLinks: [{ label: "Sadaqa maqsadlari" }],
  },
];
