// Uzbek translation overlay for the Learn "Prophets" content. Mirrors the order of
// its English source in ../prophets*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { ProphetsTimelineEvent, ProphetsTopic } from "../../types/prophets";
import type { DeepPartial } from "./localize";

export const PROPHETS_TOPICS_UZ: DeepPartial<ProphetsTopic>[] = [
  {
    title: "Payg'ambarlar bilan tanishtirish",
    summary: "Nega Alloh payg'ambarlarni yubordi va ularning hikoyalari nega endi muhim?",
    body: [
      "Alloh taolo marhamat, hidoyat va dalil sifatida payg‘ambarlarni yubordi, toki odamlar Uni bilishlari, Unga to‘g‘ri ibodat qilishlari, adolat va maqsad bilan yashashlari uchundir.",
      "Ularning Qur'ondagi hikoyalari faqat uzoq tarix emas; ular iymon, sabr, oilaviy hayot, etakchilik va tavba qilish uchun amaliy saboqlardir.",
      "Barcha payg‘ambarlarga iymon keltirish iymonning bir qismidir. Musulmonlar ularning barchasini hurmat qiladilar, mubolag'a qilishdan saqlaydilar va Muhammad sollallohu alayhi vasallamning so'nggi xabarlariga amal qiladilar.",
    ],
    quran: [
      {
        excerpt:
          "Payg'ambarlar xushxabar keltiruvchi va ogohlantiruvchi bo'lib, odamlar Payg'ambarlardan keyin Allohga qarshi hech qanday dalil bo'lmasin.",
      },
      {
        excerpt:
          "Batahqiq, Biz har bir ummatga: Allohga ibodat qilinglar va botildan qochinglar, Paygambar yubordik.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Islomda payg'ambar nima?",
    summary: "Vahiy olgan va odamlarni Allohga chorlovchi tanlangan inson.",
    body: [
      "Payg'ambar - vahiy olish va odamlarni tavhidga, ibodatga va solih amallarga yo'naltirish uchun Alloh tomonidan tanlangan insondir.",
      "Payg'ambarlar ilohiy emas va hech qachon ibodat qilinmaydi. Ular toatda, xulqda va omonatda Allohning bandalari bo'lib qolavergan holda yaratilganlarning eng yaxshisidirlar.",
      "Ularning vazifasi birdir: yolg'iz Allohga ibodat qiling. Muayyan huquqiy tafsilotlar Allohning hikmatiga ko'ra jamoalarda farq qilishi mumkin.",
    ],
    quran: [
      {
        excerpt:
          "Payg'ambarlari ularga dedilar: \"Biz ham sizlarga o'xshagan insonlarmiz, lekin Alloh bandalaridan kimni xohlasa, marhamat qiladi\".",
      },
      {
        excerpt:
          "Biz sendan oldin biron bir payg‘ambar yuborganimiz, magar unga: “Mendan o‘zga iloh yo‘q. Bas, Menga ibodat qilinglar”, deb vahiy qilganmiz.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nabi Rasulga qarshi",
    summary: "Ilm-fanda foydali farq, ikkalasi ham sharafli payg'ambarlar.",
    body: [
      "Islom ilmida umumiy farq shundaki, har bir rasul nabiydir, lekin har bir nabiy ham rasul emas. Rasul ko'pincha odamlarga aniq topshiriq bilan yuborilgan deb ta'riflanadi, nabiy esa vahiy orqali hidoyatni davom ettiradi.",
      "Qur'on ikkala atamani hurmat bilan ishlatadi va musulmonlar hech kimni rad etmasdan barcha payg'ambar va elchilarga ishonishadi.",
      "Aniq texnik ta'riflar ilmiy iboralar bilan farq qilishi mumkin, ammo amaliy dars izchil: vahiyni kamtarlik bilan qabul qiling va Allohning yo'l-yo'rig'iga ergashing.",
    ],
    quran: [
      {
        excerpt: "U saylangan va u elchi va payg'ambar edi.",
      },
      {
        excerpt: "Biz Uning payg'ambarlari orasida farq qilmaymiz.",
      },
    ],
    disclaimer:
      "Terminologiya tafsilotlari keng, olimlar uchun neytral tarzda taqdim etiladi; ilg'or teologik tasniflar uchun malakali o'qituvchilar bilan maslahatlashing.",
    appLinks: [{}],
  },
  {
    title: "Payg'ambarlardan umumiy saboqlar",
    summary: "Takroriy mavzular: tavhid, sabr, tavba va axloqiy jasorat.",
    body: [
      "Payg'ambarlar avlodlar bo'ylab bir asosga chaqirdilar: yolg'iz Allohga ibodat qilinglar va har qanday shirkdan saqlaninglar. Bu vahiyning o'zgarmas yadrosidir.",
      "Ularning hayoti ham rad etilganda sabrni, noaniqlikda Allohga tavakkal qilishni, donolik va jasorat bilan jamiyatni isloh qilishga tayyorligini ko'rsatadi.",
      "Ularni o'rganish chidamlilikni oshiradi: imonlilar tezda tavba qilishni, axloqiy yo'l tutishni va haqiqat mashhur bo'lmagan taqdirda ham printsipial bo'lib qolishni o'rganadilar.",
    ],
    quran: [
      {
        excerpt: "Ularning qissalarida aql egalari uchun ibrat bor.",
      },
      {
        excerpt: "Ular Alloh hidoyat qilgan zotlardir. Bas, ularning hidoyatiga ergash.",
      },
    ],
    actions: [
      "Har hafta bitta bashoratli darsni tanlang va uni ataylab qo'llang.",
      "Namozdan keyin qayerda ko'proq sabr yoki tavba qilish kerakligini o'ylab ko'ring.",
      "Doimiy ravishda oilangiz yoki do'stlaringizga bitta haqiqiy bashoratli hikoyani o'rgating.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Mo'jizalar va payg'ambarlik alomatlari",
    summary: "Mo''jizalar Allohning izni bilan haqiqatni tasdiqlaydi, lekin iymonga majburlamaydi.",
    body: [
      "Alloh taolo payg'ambarlarga o'z ummatlariga mos keluvchi aniq oyatlarni berdi: Nuhning kemasi, Musoning Fir'avn oldidagi alomatlari, Isoning Allohning izni bilan ko'rsatgan mo''jizalari va Muhammad sollallohu alayhi vasallam uchun Qur'on.",
      "Mo''jizalar payg'ambarlarning mustaqil kuchlari emas; Ular Allohning irodasi bilan vahiyni qo'llab-quvvatlash va dalilni to'g'rilash uchun yuzaga keladi.",
      "Qur'on shuni ko'rsatadiki, ba'zilar oyat-mo''jizalarga qaramay hamon inkor etar ekan, hidoyatni isbotlash faqat tomoshaga emas, ixlos va bo'ysunishga bog'liqdir.",
    ],
    quran: [
      {
        excerpt:
          "Biz Payg'ambarlarimizni ochiq-oydin hujjatlar bilan yubordik va ular bilan birga Kitob va tarozini tushirdik.",
      },
      {
        excerpt:
          "Ayting: «Allohning oyat-belgilari faqat Allohning huzuridadir... Senga ularga tilovat qilingan Kitobni nozil qilganimiz ularga yetarli emasmi?!",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Payg'ambarlar haqida Qur'on sharhi",
    summary:
      "Qur'onda yigirma beshta payg'ambarning ismlari keltirilgan va bitta izchil xabar keltirilgan.",
    body: [
      "Qur'onda to'g'ridan-to'g'ri yigirma beshta payg'ambarning ismlari keltirilgan va yana ko'plab payg'ambarlarga ishora qilingan. Ularning hikoyalari tafakkur va yo'l-yo'riq uchun suralar bo'ylab tarqatiladi.",
      "Sozlamalar har xil bo'lsa-da, ularning da'vati bitta: tavhid, solihlik, javobgarlik va tavba orqali rahm-shafqat.",
      "Ushbu modul Qur'onga asoslangan bo'lib qoladi va ishonchli dalillar bilan tasdiqlanmasa, ikkinchi darajali tarixiy tafsilotlarni qisqacha saqlaydi.",
    ],
    quran: [
      {
        excerpt:
          "Biz sendan oldin ham Payg'ambarlar yuborganmiz. Ulardan senga hikoya qilganimiz ham bor, senga aytmaganimiz ham bor.",
      },
      {
        excerpt:
          "Biz Allohga, nozil qilingan narsaga... Muso, Iso va payg'ambarlarga Robbilari tomonidan berilgan narsaga iymon keltirdik.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Adabiyotlar va o'qish usuli",
    summary: "Payg'ambarlarni haqiqiylik, muvozanat va foyda bilan qanday o'rganish kerak.",
    body: [
      "Qur'on parchalari bilan boshlang, keyin sahih hadisni o'qing, so'ngra kontekst uchun ishonchli tafsir bilan maslahatlashing. Bu tartib vahiyga asoslangan o'rganishni davom ettiradi.",
      "Qur'on tamoyillari yoki payg'ambarlik qadr-qimmatiga zid keladigan shov-shuvli yoki zaif xabarlardan saqlaning. Har bir mashhur hikoyaning ishonchli dalillari mavjud emas.",
      "Faqat tarixiy faktlarni to'plash uchun emas, balki o'z ibodat va xarakteringizni isloh qilish uchun bashoratli biografiyalardan foydalaning.",
    ],
    quran: [
      {
        excerpt:
          "So'zga quloq solib, uning eng go'zaliga ergashganlar, ana o'shalar Alloh hidoyat qilgan zotlardir.",
      },
    ],
    hadith: [
      {
        excerpt: "Kim ilm izlab yo'lga chiqsa, Alloh unga jannat yo'lini oson qiladi.",
      },
    ],
    actions: [
      "Har hafta to'g'ridan-to'g'ri Qur'ondan bir payg'ambar hikoyasini o'qing.",
      "Faqat vaqt jadvalidagi faktlarni emas, balki amaliy mashg'ulotlarni ham yozib oling.",
      "Ikkinchi darajali rivoyatlarni ishonchli olimlar bilan tasdiqlang.",
    ],
    disclaimer:
      "Tarixiy sanalar va aniq joylar manbalarda farq qilishi mumkin; bu markaz kelishilgan, matnga asoslangan ko'rsatmalarga ustuvor ahamiyat beradi.",
    appLinks: [{}, {}],
  },
];

export const PROPHETS_BIO_TOPICS_UZ: DeepPartial<ProphetsTopic>[] = [
  {
    title: "Odam alayhissalom",
    summary:
      "Ilm bilan ulug'langan va itoat bilan sinovdan o'tgan birinchi inson va birinchi payg'ambar.",
    body: [
      "Odam alayhissalom insoniyat tarixi va payg'ambarlik boshlangan joydir. Alloh taolo uni o'z qo'li bilan loydan yaratdi, unga O'z ruhidan pufladi va unga hamma narsaning ismlarini o'rgatdi. Farishtalar Odam alayhissalomga sajda qilishlari buyurilganida, ular itoat qildilar, lekin Iblis takabburlik bilan rad etdi va shu paytdan boshlab uning Odam alayhissalomga va uning avlodlariga dushmanligi e'lon qilindi. Ushbu ochilish sahnasi har bir inson hayotining asosiy dramasini o'rnatadi: kamtar itoatkorlik va mag'rur isyon o'rtasidagi tanlov (Qur'on 2:30–39).",
      "Alloh taolo Odam alayhissalom va uning xotini Havvani jannatga joylashtirdi va ularga bitta daraxtdan boshqa hamma narsani halol qildi. Shaytonning pichirlashi bilan ular undan yedilar. Ammo ular bilan Iblis o‘rtasidagi farqga e’tibor bering: Iblis o‘z gunohini oqladi, Odam va Havva esa darhol pushaymon bo‘lib, Alloh taologa ularga o‘rgatgan “Robbimiz, biz o‘zimizga zulm qildik, agar bizni mag‘firat qilmasang va bizga rahm qilmasang, albatta ziyon ko‘rguvchilardan bo‘lamiz” (Qur’oni karim, 7:23). Alloh taolo ularning tavbalarini qabul qildi va ergashuvchilar uchun hidoyat va'dasi bilan ularni yerga yubordi.",
      "Odam Atoning sabog'i umid sabog'idir: inson hurmatli va hurmatli, ammo sinovdan o'tadi va sirpanadi. Mo'minni belgilaydigan narsa gunohsiz bo'lish emas - faqat Alloh mukammaldir - tavbaga tez va samimiy qaytishdir. Odam alayhissalomning hikoyasi, shuningdek, shaytonning e'lon qilingan, ochiq dushman ekanligini, uning yagona quroli shivirlash ekanligini o'rgatadi; javob Allohni zikr qilish va Undan mag'firat so'rashdir. Odam Atodan boshlab yerga tushish jazo emas, balki insoniyatning haqiqiy sinov bosqichidir.",
    ],
    profile: {
      nation: "Erta insoniyat",
      location: "Jannat keyin yer",
      era: "Insoniyat tarixining boshlanishi",
      mission: "Birinchi odamlarga tavhid va Allohga itoat qilishni o'rgating.",
      challenges: [
        "Iblisning dushmanligi",
        "Yerga tushgandan keyin hayot",
        "Birinchi insoniyat oilasiga rahbarlik qilish",
      ],
      miracles: [
        "Allohning amri bilan ota-onasiz yaratilish",
        "Hamma narsaning nomlarini o'rgatish",
      ],
      majorEvents: [
        "Odam Atoning yaratilishi va ismlarning ta'limoti",
        "Farishtalarning sajdasi va Iblisning rad etishi",
        "Jannatdagi sirpanish, chin tavba va yerga tushish",
      ],
      lessons: [
        "Inson sharafi mas'uliyat bilan birga keladi",
        "Samimiy tavba har qanday xatodan keyin eshikni qayta ochadi",
        "Shayton ochiq va doimiy dushmandir",
      ],
      facts: [
        "Odam alayhissalom birinchi inson va birinchi payg'ambardir",
        "Uning tavbasi Qur'onning tavbaning birinchi namunasidir",
      ],
    },
    quran: [
      {
        excerpt:
          "Robbing farishtalarga: «Men er yuzida bir-birini to'g'rilab berurman», deganini [eslang.",
      },
      {
        excerpt:
          "Ular: «Ey Robbimiz, biz o'zimizga zulm qildik, agar bizni mag'firat qilmasang va rahm qilmasang, albatta ziyon ko'rguvchilardan bo'lamiz», dedilar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qiyomat kuni odamlar Odam alayhissalomning oldiga kelib: Sen odamlarning otasisan. Robbing huzurida biz uchun shafoat qil.",
      },
      {
        excerpt:
          "Odam Ato bilan Muso bahslashdilar. Muso: «Sen Alloh O'z qo'li bilan yaratgan zotsan», dedi. Odam alayhissalom: «Alloh meni yaratishdan oldin men uchun belgilab qo'ygan ishda meni ayblaysanmi?» dedi. Bas, Odam tortishuvda Musodan ustun keldi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Idris (a.s.)",
    summary:
      "Rostgo'y payg'ambar sabri uchun maqtalgan va Alloh tomonidan yuksak darajaga ko'tarilgan.",
    body: [
      "Idris (alayhissalom) Qur'oni karimda qisqagina zikr qilingan, lekin u zot haqidagi har bir so'z maqtovdir. Alloh taolo uni «haqiqat sohibi, payg'ambar» (Qur'on 19:56) deb ataydi va uni Ismoil va Zul-Kifl bilan birga sabrli va solihlar qatoriga qo'ydi (Qur'on 21:85-86). Uning hikoyasidan ko‘rinib turibdiki, Alloh nazdida insonning fe’l-atvori – rostgo‘yligi, sabri, sobitqadamligi uning tarjimai holidan ko‘ra muhimroqdir.",
      "Alloh taolo u haqida: “Biz uni yuksak darajaga ko‘tardik” (Qur’on, 19:57). Ulamolar buni uning Alloh huzuridagi yuksak martabasini nazarda tutganlar. Qur'on va sahih xabarlar tasdiqlagan narsadan tashqari, Idrisga bog'langan mashhur ertaklar (masalan, qalam bilan birinchi bo'lib yozgan yoki ma'lum dunyoviy kasblar) ishonchli dalillar bilan tasdiqlanmagan, shuning uchun ehtiyotkor mo'min vahiyni bezashdan ko'ra tasdiqlagan narsaga amal qiladi.",
      "Idris alayhissalomning saboqlari shuki, Allohga yaqinlik shon-shuhrat yoki uzun hikoya bilan emas, balki ixlos va izchillik bilan o‘lchanadi. Sokin, rostgo'y, sobit banda Allohning huzuridagi mavqeini tarixda eslab qoladigan ko'pchilikdan balandroq tuta oladi.",
    ],
    profile: {
      era: "Odam Atodan keyingi ilk avlodlar",
      mission: "Odamlarni Allohga rost va solihlik ila ibodat qilishga chaqiring.",
      lessons: [
        "Rostlik banda martabasini oshiradi",
        "Har bir payg'ambarning hikoyasi batafsil emas - va bu dizayn bo'yicha",
        "Barqaror, sodiq mustahkamlik Allohga sevimlidir",
      ],
      facts: [
        "Qur'onda rostgo'y va payg'ambar deb atalgan",
        "Alloh tomonidan yuksak darajaga ko'tarilgan deb ta'riflangan",
      ],
    },
    quran: [
      {
        excerpt:
          "Va kitobda Idrisni zikr et. Darhaqiqat, u haq so‘zli va payg‘ambar edi. Va uni yuksak maqomga ko'tardik.",
      },
      {
        excerpt:
          "Ismoil, Idris va Zul-Kifl ham sabrlilardan edilar. Va ularni O'z rahmatimizga kiritdik. Albatta, ular solihlardan edilar.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nuh (a.s.)",
    summary: "To'fondan oldin asrlar davomida o'z xalqini chaqirgan favqulodda sabr xabarchisi.",
    body: [
      "Nuh (alayhissalom) tavhidni tark etib, butlarga sig'inishga o'tgan qavmga yuborilgan. U zotning yagona va o'zgarmas xabari: “Ey qavmim, Allohga ibodat qiling! Sizlar uchun Undan o'zga iloh yo'qdir” (Qur'on 7:59). Qur'on Nuh surasidagi vazifa haqida o'zining shaxsiy ma'lumotlarini saqlagan: U ularni kechayu kunduz, oshkora va yashirincha chaqirib, ham dalda va ham ogohlantirib, Allohga qaytish yomg'ir, boylik, bolalar va bog'lar olib kelishini eslatdi. Ammo avloddan-avlodga ko'pchiligi yuz o'girib, barmoqlarini quloqlariga tiqib, takabbur bo'lib qoldilar (Qur'on 71:1-28).",
      "Qur'on uning sabr-toqatining uzoqligini ta'kidlaydi: u ular orasida \"ellikdan ming yil kamroq\" qoldi (Qur'on 29:14) va haligacha faqat bir nechtasi iymon keltirdi. Endi iymonni qabul qilmasligi ayon bo'lgach, Alloh taolo unga kofirlar masxara qilayotgan paytda ilohiy ko'rsatma bilan kema qurishni buyurdi. Keyin hukm sifatida suv toshqinlari keldi. Nuhning o'g'li otasining ogohlantirishi bilan tog'ga ishonib, kemaga chiqishdan bosh tortdi va cho'kib ketganlar orasida edi - bu qon rishtalari imonning o'rnini bosa olmasligini eslatib turadi (Qur'on 11:42-46).",
      "Nuh qissasi Qur'onning da'vatdagi mahorat darsidir: da'vatchining vazifasi ixlos, sabr-toqat, aniq yetkazib berishdir - natija faqat Allohnikidir. Shuningdek, hidoyat nasl-nasabga emas, qalbga bog‘liq: payg‘ambarning o‘g‘li yo‘qolishi mumkin, begonalar esa qutqarilishi mumkin. Kemaga chiqqan mo'minlar yangilangan insoniyatning urug'i bo'ldilar va Nuh qat'iy qaror (ulul-azm)ning besh buyuk elchisidan biri sifatida ulug'lanadi.",
    ],
    profile: {
      nation: "To'fondan oldin uning xalqi",
      location: "Qadimgi Mesopotamiya mintaqasi (keng tarqalgan)",
      era: "Juda erta antik davr",
      mission: "Qavmini tavhidga va tavbaga chaqir.",
      challenges: [
        "Rahbarlar va elitadan masxara",
        "Bir necha imonlilar bilan asrlar davomida rad etish",
        "O'z o'g'lining ishonmasligi va cho'kib ketishi",
      ],
      miracles: [
        "Ilohiy ko'rsatma bilan qurilgan kema",
        "To'fon orqali imonlilarning qutqarilishi",
      ],
      majorEvents: [
        "Ming yilga yaqin davom etadigan tavhid da'vati",
        "Allohning amri bilan kema qurish",
        "To'fon va imonlilar uchun yangi boshlanish",
      ],
      lessons: [
        "Natijani Allohga qoldirish, da'vatda davom etish",
        "Oilaviy aloqalar imon o'rnini bosa olmaydi",
        "Alloh doim ixloslilarni asrasin",
      ],
      facts: [
        "Besh qat'iy azm elchisidan biri (ulul-azm)",
        "Uning hikoyasi ko'plab suralarda, jumladan, uning nomi bilan atalgan suralarda uchraydi",
      ],
    },
    quran: [
      {
        excerpt:
          "Va Nuhga vahiy qilindiki, qavmingdan faqat iymon keltirganlardan boshqa hech kim iymon keltirmas. Bas, ularning qilayotgan amallaridan siqilma.",
      },
      {
        excerpt:
          "U: «Ey Robbim, men qavmimni kechayu kunduz da'vat qildim, lekin mening da'vatim ularni faqat uchishda ziyoda qildi», dedi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Odamlar Nuhning huzuriga kelib: «Ey Nuh, sen er yuziga yuborilgan birinchi payg'ambarsan va Alloh seni shukr qiluvchi banda deb atadi. biz uchun shafoat qil.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Hud (a.s.)",
    summary: "Od qavmiga qudratli va kuchli qavm yuborildi.",
    body: [
      "Hud (alayhissalom) Od qavmiga yuborilgan bo'lib, Qur'on jismonan qudratli va baland va takomillashgan inshootlar qurish bilan mashhur bo'lgan, \"er yuzida bunaqasi hech qachon yaratilmagan\" (Qur'on 89:6-8). Bu mag'rur qavmga Hud alayhissalom har bir payg'ambarga o'xshab: «Ey qavmim, Allohga ibodat qilinglar! Sizning Undan o'zga iloh yo'qdir. Undan qo'rqmaysizlarmi? (Qur'on, 7:65). U o‘zlaridan edi, hech qanday ajr so‘ramas, faqat shukr qilishga chaqirar, zulmdan uzoqlashardi.",
      "Ularning rahbarlari masxara bilan javob berib, uni ahmoqlik va yolg'onchilikda ayblab, ota-bobolarining butlariga yopishib olishdi. Ular hech qanday kuch ularning kuchiga teng kela olmasligiga ishonchlari komil bo'lib, u ogohlantirgan jazoni keltirishi uchun uni chaqirishdi (Qur'on 46:21-25). Hud ularni ochiq-oydin ogohlantirganki, dunyoviy qudrat va buyuk tamaddun Allohning oyatlarini inkor etuvchi va yer yuzida mutakabbirlik qiladigan hech kimni asramaydi.",
      "Hukm shiddatli va uvillagan shamol bo'lib keldiki, Alloh taolo \"birin-ketin yetti kechayu sakkiz kunduz ularga buyurdi\" (Qur'on 69:6-7), bir vaqtlar qudratli qavmni ichi bo'sh tanasi kabi qulab tushdi, Hud va mo'minlar esa Allohning rahmati bilan najot topdilar. Od qavmining hikoyasi butun Qur'onda doimiy ogohlantirish sifatida takrorlanadi: kuch, boylik va muvaffaqiyat mag'rurlik emas, balki kamtarlik va minnatdorchilik bilan kutib olinadigan sovg'alardir. Qanchalik ilg'or bo'lmasin, millat Alloh oldida javob beradi.",
    ],
    profile: {
      nation: "Od qavmi",
      location: "Al-Ahqof viloyati (klassik tafsirda janubiy Arabiston hududi)",
      era: "Nuhdan keyin",
      mission: "Od qavmida tavhid, shukr va adolatni tikla.",
      challenges: [
        "Kollektiv takabburlik kuch va boylikka asoslangan",
        "Vahiy va payg'ambarni masxara qilish",
        "Zudlik bilan jazolash talabi",
      ],
      miracles: ["Jazo paytida mo'minlarning himoyasi"],
      majorEvents: [
        "Tavba va minnatdorchilikka da'vat",
        "Kuchli shamol haqida ogohlantirish",
        "Od qavmining halokati yetti kechayu sakkiz kunduz",
      ],
      lessons: [
        "Kamtarliksiz kuch halokatga olib keladi",
        "Millatlar va tsivilizatsiyalar Alloh taolo oldida javob beradilar",
        "Payg'ambarlik ogohlantirishlari hukmdan oldin yuborilgan rahmatdir",
      ],
      facts: [
        "Od qavmining hikoyasi Qur'onda keyingi jamoalar uchun ogohlantirish sifatida takrorlanadi",
      ],
    },
    quran: [
      {
        excerpt:
          "Od qavmiga ham birodarlari Hudni yubordik. U: «Ey qavmim, Allohga ibodat qiling. Sizning Undan o'zga iloh yo'qdir. Undan qo'rqmaysizlarmi?",
      },
      {
        excerpt:
          "Bas, qachonki uni vodiylariga bulut yaqinlashayotganini ko'rganlarida: «Bu bizga yomg'ir yog'diruvchi bulutdir», dedilar. Balki bu siz sabr qilganingizdan alamli azob bordir.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Solih (a.s.)",
    summary:
      "Samud qavmiga yuborildi, ularga tuyaning mo''jizasi berildi va ular so'ragan belgini buzdilar.",
    body: [
      "Solih (alayhissalom) Od qavmidan keyin tog‘larga ulug‘ uylar o‘yib, farovon hayot kechirishlari bilan mashhur bo‘lgan Samud qavmiga yuborildi (Qur’on 7:74). Ularni o'z birodarlaridek yolg'iz Allohga ibodat qilishga va boshliqlarining fitnasidan voz kechishga chaqirdi. Ular uning rostligini isbotlash uchun oyat-mo''jiza talab qilganlarida, Alloh ochiq va oshkora bir tuyani berdi: u bir kunda, ular boshqa kuni ichishlari uchun belgilab qo'yilgan bir tuya (Qur'on 26:155-156).",
      "Solih ularni ochiq-oydin ogohlantirdi: «Unga yomonlik qilmanglar, aks holda sizlarni yaqin azob tutadi» (Qur'on, 26:156). Bu alomat vazminlik sinovi edi - ular Alloh belgilagan chegarani bajara oladilarmi? Lekin ularning eng zo'ravonlari ochiq isyonda tuyani paypaslab, o'ldirdilar, so'ngra Solihni va'da qilingan azobni keltirishga chaqirdilar (Qur'on 7:77). Tuyaning o'ldirilishi kambag'allarning qilmishi deb nomlanadi, lekin butun xalq rozi bo'lib jinoyatga sherik bo'ladi.",
      "Jazo uch kun ichida yetdi: ularni uylarida kuchli portlash va zilzila tutdi, Samud esa jonsiz qoldi, Alloh Solih va iymon keltirganlarni qutqardi (Qur'on 7:78-79; 91:14). Dars o'tkir: mo''jizalar qaysar yurakni yumshata olmaydi; ular faqat javobgarlik ulushini oshiradi. So'ralgan va keyin rad etilgan belgi uni talab qilganlarga qarshi bahsga aylanadi. Yovuzlik oldida sukut saqlash betaraflik emas - bir necha kishining qilmishi uchun butun bir xalq javobgar edi.",
    ],
    profile: {
      nation: "Samud qavmi",
      location: "Al-Hijr / Arabistonning shimoli-g'arbiy qismi",
      era: "E'londan keyin",
      mission: "Samudni butparastlik va buzg'unchilikdan tavhidga chaqiring.",
      challenges: [
        "Mo''jizani talab qilish, keyin uni rad etish",
        "Aniq belgi berilganidan keyin ochiq qarshilik ko'rsatish",
        "Solih va mo'minlarga tahdidlar",
      ],
      miracles: ["Ollohdan ko'rinib turgan bir dalil sifatida yuborilgan tuya"],
      majorEvents: [
        "U tuyaning ko'rinishi va umumiy suv",
        "U tuyaning sonini bog'lash va o'ldirish",
        "Rad etuvchilarni yo'q qilgan portlash",
      ],
      lessons: [
        "Mo''jizalar qaysar yurakka foyda keltirmaydi",
        "Alloh belgilagan chegarani buzish haqiqiy oqibatlarga olib keladi",
        "Yomonlikka rozilik uning aybiga sherik bo'ladi",
      ],
      facts: ["Samud qavmi tog'larga chiroyli uylar yasash bilan mashhur edi"],
    },
    quran: [
      {
        excerpt:
          "Bu Allohning tuyasi sizlar uchun oyat-belgidir. Bas, uni Allohning diyorida yeyishi uchun qo'yib yuboringlar va unga yomonlik tegmanglar, balki sizni alamli azob tutadi.",
      },
      {
        excerpt:
          "Samud ularning eng badbaxtlari yuborilganida, zulmlari sababli yolg'onga chiqardilar... Bas, Robbilari ularga gunohlari uchun halokat tushirdi va ularni bir tekis qilib qo'ydi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ibrohim (a.s.)",
    summary:
      "Allohning do‘sti, sof tavhid namunasi bo‘lgan Xalilulloh har bir sinovda sinovdan o‘tgan va zafar qozongan.",
    body: [
      "Ibrohim (alayhissalom) tafakkur va jasorat bilan erishilgan sof tavhidning Qur'onning yuksak namunasidir. Butlarga sig‘inishda g‘arq bo‘lgan jamiyatdagi yosh yigit sifatida u o‘z xalqi, otasi va hatto podshoh bilan ochiqchasiga mulohaza yuritdi: quyosh, oy va yulduzlar botib, so‘nadi, qanday qilib ular xudo bo‘lishi mumkin? (Quron 6:75–79). Butlarning kuchsizligini fosh qilish uchun, u eng kattalaridan boshqa hammasini sindirib tashladi va o'z xalqiga nima bo'lganini butlarning o'zidan so'rashni buyurdi - ularni xudolari na gapira, na o'zlarini himoya qila olmasligini tan olishga majbur qildi (Qur'on 21:57-67).",
      "Bu turganligi uchun u alangali olovga tashlandi, lekin Alloh taolo: «Ey olov, Ibrohimga salqin va omon bo'l!» (Qur'on 21:69) buyurdi va u sog'-salomat chiqdi. Uning hayoti sinovlar zanjiriga aylanib, to‘liq taslim bo‘ldi: Alloh yo‘lida vatanini tark etdi, keksalik chog‘ida solih zurriyotlar tilab duo qildi, Ismoil va Ishoq nasib etdi, sevikli o‘g‘lini qurbon qilish amri bilan imtihon qilindi – Alloh bolani fido qilishdan oldin ota ham, o‘g‘il ham taslim bo‘lishga rozi bo‘ldi – Makkada Ismoil xalqining poydevorini ko‘tardi. va ularning orasiga Payg'ambar yuborilishi uchun (Qur'on 2:124–129; 37:100–107).",
      "Ana shunday beqiyos fidoyiligi tufayli Alloh taolo Ibrohimni o‘zlariga o‘z do‘sti, ya’ni yaqin do‘sti qilib oldi (Qur’on 4:125) va uni butun insoniyatga imom, yetakchi qilib qo‘ydi (Qur’on 2:124). Uning merosi o'z naslidan bo'lgan payg'ambarlar, haj marosimlari va \"haqiqatga moyil Ibrohim diniga\" ergashishga buyurilgan musulmonning shaxsi orqali o'tadi (Qur'on 3:95). Uning hikoyasi eng og‘ir sinovlarda tavakkul qilishga, chinakam rahbarlik qurbonlikka asoslanishini va samimiy e’tiqod butun avlodlarni qayta shakllantira olishini o‘rgatadi.",
    ],
    profile: {
      nation: "Mesopotamiya va Levant jamoalari",
      location: "Iroq, Levant va Makka",
      era: "O'rta antik davr",
      mission: "Sof tavhidni jonlantiring va bo‘ysunish merosini mustahkamlang.",
      challenges: [
        "Butparastlarga, o'z otasiga va zolim podshohga qarshi turish",
        "Olloh uchun vatanidan hijrat qilish",
        "Sevimli o'g'lini qurbon qilish sinovi",
      ],
      miracles: [
        "Olov Allohning amri bilan salqin va xavfsiz bo'ldi",
        "Keksalikda berilgan solih nasl",
      ],
      majorEvents: [
        "Munozara va butlarni buzish",
        "Olovga tashlangan va topshirilgan",
        "Ismoil bilan Ka'bani qurish va qurbonlikning buyuk sinovi",
      ],
      lessons: [
        "Eng og'ir sinovlarda Tavakkul (Allohga tavakkal).",
        "Haqiqiy etakchilik qurbonlikni talab qiladi",
        "Samimiy e'tiqod avlodlarni qayta shakllantirishi mumkin",
      ],
      facts: [
        "Allohning yaqin do'sti Xalilulloh nomi bilan tanilgan",
        "Ismoil va Ishoq orqali payg'ambarlarning ajdodlari",
      ],
    },
    quran: [
      {
        excerpt:
          "Ibrohimni Parvardigori amrlar bilan imtihon qilganini va u ularni bajo keltirganini [eslang. U: «Albatta, men seni odamlarga peshvo qilurman», dedi.",
      },
      {
        excerpt:
          "Biz: «Ey olov, Ibrohimga salqin va omon bo‘l», dedik. Va ular unga yomonlik qilishni xohladilar. Lekin Biz ularni eng ko'p ziyon ko'rguvchilarga aylantirdik.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sizlar yalangoyoq, yalang'och va sunnatsiz to'planasizlar. Qiyomatda birinchi kiyinadigan kishi Ibrohimdir.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Lut (a.s.)",
    summary:
      "O'z qavmini o'zlaridan oldin hech bir qavm qilmagan katta axloqsizlikdan ogohlantirgan payg'ambar.",
    body: [
      "Lut (alayhissalom) Ibrohimning zamondoshi va qarindoshi bo‘lib, u bilan birga hijrat qilgan va keyin Sadom va unga yaqin shaharlarga yuborilgan. Uning qavmi yolg'iz Allohgagina ibodat qilishga da'vat qilish bilan birga, Qur'onda aytilishicha, \"Butun dunyoda hech kim ilgari qilmagan\", ya'ni ayollar o'rniga erkaklarga yaqinlashish va ularning yig'ilishlarida ochiqchasiga fahsh qilishda aybdor edi (Qur'on 7:80-81; 29:28-29). Lut ularni ixlos bilan poklikka va Alloh belgilagan tabiiy chegaralarga chaqirdi.",
      "Ular uning islohotini bahs-munozara bilan emas, balki dushmanlik bilan qarshi oldilar, uni haydab chiqarish bilan qo'rqitib, odobga da'vatini masxara qilishdi: «Ularni shahringizdan haydab yuboring. Ular o'zlarini pok tutadigan odamlardir! (Qur'on, 7:82). Hatto o'z xonadonida ham sinov og'ir kechdi - uning xotini buzuqlar tomonida bo'ldi va ishonmadi, bu hidoyat Alloh tomonidan berilganligini va nikoh yoki qon orqali meros emasligini yana bir bor isbotladi (Qur'on 66:10).",
      "Farmon kelgach, Alloh taolo farishtalarni mehmon qiyofasida yubordi. Odamlar hatto ularga zarar yetkazishga shoshildilar va farishtalar ularning kimligini oshkor etib, tunda mo'minlar bilan birga ketishni buyurmaguncha, Lut o'zini ojiz his qildi. Tong otishi bilan shaharlar ag'darilib, toshbo'ron qilindi (Qur'on 11:77-83). Lutning hikoyasi axloqiy haqiqat o'zgarmasligi, chunki jamiyat gunohni ma'qullaydi va uni omma oldida normallashtiradi va Alloh har doim samimiylarni, ular kam bo'lmasin, qutqaradi, degan aniq ogohlantirishdir.",
    ],
    profile: {
      nation: "Sado‘m va qo‘shni shaharlar aholisi",
      location: "O'lik dengiz mintaqasi (keng tarqalgan)",
      era: "Ibrohim davri",
      mission: "Uning qavmini ochiq fahsh va kufrdan tavhid va poklikka chaqir.",
      challenges: [
        "Ommaviy axloqsizlikning mustahkamlanishi",
        "Masxara va haydash tahdidi",
        "O'z xotinining ishonchsizligi",
      ],
      majorEvents: [
        "Axloqsizlikka qarshi doimiy ogohlantirishlar",
        "Mehmon sifatida niqoblangan farishtalarning tashrifi",
        "Shaharlarning ag'darilishi",
      ],
      lessons: [
        "Axloqiy haqiqat ijtimoiy ma'qullash bilan o'zgarmaydi",
        "Imonlilar juda oz bo'lishi mumkin",
        "Alloh xolislarni umumiy halokatdan qutqaradi",
      ],
      facts: ["Ibrohimning qarindoshi, u bilan birga hijrat qilgan va Sado'mga yuborilgan"],
    },
    quran: [
      {
        excerpt:
          "Sizlar olamlarning erkaklariga yaqinlashib, Robbingiz sizlar uchun yaratgan narsalarni juft qilib qoldirasizmi? Balki siz zolim qavmsiz.",
      },
      {
        excerpt:
          "Qachonki amrimiz kelganida, shaharlarning eng baland qismini eng past qilib qo'ydik va ularning ustiga qattiq loydan toshlar yog'dirdik.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ismoil (a.s.)",
    summary:
      "O'z so'zida sodiq payg'ambar, imtihonda sabrli va otasi Ibrohim bilan Ka'bani quruvchi.",
    body: [
      "Ismoil (alayhissalom) Ibrohim alayhissalomning keksalik chog‘ida berilgan to‘ng‘ich o‘g‘li edi. Uning hayoti hayratlanarli ishonch imtihonidan boshlandi: Ibrohim Allohning amri bilan go‘dak Ismoil va onasi Hojarni Makkaning taqir vodiysiga tashlab ketdi, u yerda ekin o‘smaydigan, suv ham oqmasdi. Hajar Safo va Marva tepaliklari orasidan suv izlab yugurib yurganida, Alloh taolo Zamzam bulog‘ini otilib chiqishiga sabab bo‘ldi, bu Hajar avlodlari va har bir ziyoratchining haj va umra sa’ylarida shu kungacha qaytadan ko‘rishini ta’minladi.",
      "Ismoil yoshligida otasi bilan birga eng katta imtihonga duch keldi: Ibrohim unga qurbonlik qilish haqidagi vahiyni aytganida, Ismoil hayratlanarli bo'ysunish bilan javob berdi: «Ey otajon, senga buyurilganini qil! Agar Alloh xohlasa, meni sabrlilardan topasiz” (37:102). Ikkalasi ham to‘liq taslim bo‘ldilar va Alloh ularning itoatini abadiy hurmat qilib, Ismoilni katta qurbonlik bilan to‘ladi. Keyin ota va o‘g‘il birgalikda Ka’ba poydevorini ko‘tarib: “Ey Robbimiz, buni bizdan qabul qil! Albatta, Sen eshitguvchi va bilguvchi zotsan” (Baqara surasi, 127-oyat).",
      "Qur’oni karimda uning fe’l-atvorini yod olishga arzigulik bir satr bilan ifodalaydi: “U o‘z va’dasiga sodiq edi, elchi va payg‘ambar edi. U zot ahlini namozga va zakotga buyurar va Parvardigorini rozi qilardi» (Qur'on, 19:54-55). Ismoil alayhissalomning hayoti so'zda turish, sodiq ibodat va Allohga toatda hamkorlik qilishning go'zalligini o'rgatadi. U orqali arablarning payg'ambarlik nasli oxir-oqibat oxirgi payg'ambar Muhammad sollallohu alayhi vasallamga yetib bordi.",
    ],
    profile: {
      nation: "Makka viloyatining ilk odamlari",
      location: "Makka",
      era: "Ibrohim hijrat qilgandan keyin",
      mission: "Tavhid va ibodatni qo'llab-quvvatla, oilasini namozga va zakotga buyur.",
      challenges: [
        "Taqir vodiyda hayotning og'ir boshlanishi",
        "Qurbonlikning sinovi",
        "Ibodatga asoslangan hayot va muqaddas ishonchni saqlash",
      ],
      miracles: ["Cho'lda taqdim etilgan zamzam bulog'i", "Alloh tomonidan qurbonlikdan qutulgan"],
      majorEvents: [
        "Onasi Hajar bilan Makka vodiysida qoldi",
        "Qurbonlikning sinovi to'liq bo'ysunish bilan kutib olindi",
        "Ibrohim bilan Ka'bani qurish",
      ],
      lessons: [
        "Va'dalaringizni sodiqlik bilan bajaring",
        "Oila ibodat va toatda hamkorlik qilishi mumkin",
        "Muqaddas meros kuchli xarakter talab qiladi",
      ],
      facts: [
        "Qur'onda o'z va'dasiga sodiq deb ta'riflangan",
        "Arab qabilalarining ajdodlari va oxirgi bashoratli nasl",
      ],
    },
    quran: [
      {
        excerpt:
          "Va kitobda Ismoilni zikr et. Darhaqiqat, u o'z va'dasiga sodiq bo'lib, payg'ambar va payg'ambar edi. U zot ahlini namozga va zakotga buyurar va Parvardigorini rozi qilardi.",
      },
      {
        excerpt:
          "Qachonki Ibrohim Baytullohi va Ismoilning poydevorini ko‘tarayotgan edilar: “Ey Robbimiz, buni bizdan qabul qilgin. Albatta, Sen eshituvchi va bilguvchisan.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Ishoq (a.s.)",
    summary: "Ya'qubning otasi Ibrohimga xushxabar berilgan muborak payg'ambar.",
    body: [
      "Ishoq (alayhissalom) Ibrohim va uning rafiqasi Soraga keksalik chog‘larida dunyoga keldilar — tug‘ilish yoshidan o‘tgan Sora hayratdan kulib yuborganida, farishtalar tomonidan bu tug‘ilish xushxabar sifatida e’lon qilindi. Qur'onda bu lahzalar qayd etilgan: \"Biz unga Ishoq va Ishoqdan keyin Ya'qub bilan xushxabar berdik\" (Qur'on 11:71). Uning tug'ilishi Allohning qudrati va marhamati oddiy insoniy chegaralar bilan chegaralanmaganligidan dalolat, qiyin umidda kutayotgan har bir mo'min uchun tasalli edi.",
      "Qur'on doimiy ravishda Ishoqni solih, tanlangan va olijanob payg'ambarlar qatoriga qo'yib, unga va Ya'qubga \"ibodatda va ko'rishda quvvat\" berilganini ta'riflaydi (Qur'on 38:45–47). Ishoq orqali Ya'qub (Isroil) keldi va Ya'qubdan Bani Isroilga yuborilgan uzun payg'ambarlar zanjiri tushdi - shuning uchun Ishoq payg'ambarlik otasi, avlodlar o'rtasidagi hidoyatning davomi bo'lgan halqa sifatida turadi.",
      "Uning hikoyasi, garchi qisqacha aytilgan bo'lsa-da, ikkita doimiy saboqni o'z ichiga oladi: Alloh biz kutganimizdan ham ortiq sovg'alar uchun minnatdorchilik va solih nasl omonat ekanligini anglash - iymon nafaqat meros bo'lib o'tishi kerak. Ibrohim alayhissalomning xonadoniga qo'yilgan ne'matni Allohga sodiq bandalar olib yurgani uchun saqlanib qolgan.",
    ],
    profile: {
      nation: "Levant jamoalari",
      location: "Levant (Shom)",
      era: "Ibrohimdan keyin",
      mission: "Ibrohimning muborak naslida bashoratli yo'l-yo'riqni davom ettiring.",
      miracles: ["Keksa ota-onalarga tug'ilish xushxabar sifatida e'lon qilindi"],
      majorEvents: [
        "Ibrohim va Soraga berilgan xushxabar",
        "Ya'qub orqali payg'ambarlik naslning davomi",
      ],
      lessons: [
        "Alloh inson kutganidan ham ko'proq narsani beradi",
        "Solih nasl – saqlanib qoladigan omonatdir",
        "Sodiq vorislik yo'l-yo'riqni saqlab qoladi",
      ],
      facts: [
        "Ya'qubning otasi",
        "Tanlangan oila sifatida Ibrohim va Ya'qub bilan birga ism qo'yilgan",
      ],
    },
    quran: [
      {
        excerpt:
          "Xotini esa tik turgan edi, u kulib yubordi. So'ngra unga Ishoq va Ishoqdan keyin Ya'qub bilan xushxabar berdik.",
      },
      {
        excerpt:
          "Qudratli va ko‘ruvchi bandalarimiz Ibrohim, Ishoq va Ya’qubni esla. Darhaqiqat, Biz ularni fazilat uchun tanladik: Uyni zikr qilish.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ya'qub (a.s.)",
    summary:
      "Shuningdek, Isroil payg'ambar deb ham ataladi, uning go'zal sabri qayg'u orqali Allohga bo'lgan ishonchni o'rgatadi.",
    body: [
      "Ya'qub (alayhissalom) Isroil deb ham ataladi, Ishoqning o'g'li va Bani Isroil qabilasidan bo'lgan o'n ikki kishining otasi edi, jumladan Yusuf ham. Farzandlarini tavhid asosida tarbiyalagan, o‘lim to‘shagida ulardan olgan ahdini Qur’on saqlagan: “Mendan keyin nimaga ibodat qilasiz?”. Ular javob berdilar: “Sening Xudongga va ota-bobolaringning Xudosiga ibodat qilamiz... bir iloh va biz Unga bo‘ysunuvchimiz” (Baqara surasi, 132–133). Uning eng chuqur tashvishi oxirigacha kelajak avlodning e'tiqodi edi.",
      "Uning katta sinovi Yusuf qissasi doirasida sodir bo'ladi. O'g'illari Yusufning ko'ylagi va uni bo'ri yutib yubordi, degan yolg'on da'vo bilan qaytganlarida, Ya'qub bu hiyla-nayrangni ko'rib qoldi va g'azab bilan emas, balki vazminlik bilan javob berdi: \"Bas, sabr qilish eng munosibdir va siz vasf qilgan narsaga qarshi Allohdan yordam so'raladigan zotdir\" (Qur'on 12:18). U uzoq yillar davomida ayriliq uchun qayg'u chekdi, Qur'on achchiq tarzda aytganidek, ko'zlari qayg'udan oqarib ketdi - lekin u qayg'usini bosdi va hech qachon umidsizlikka tushmadi (Qur'on 12:84).",
      "Ya'qub alayhissalom misolining qalbi bir jumladan iborat: «Allohning rahmatidan noumid bo'lmang. Albatta, Allohning rahmatidan kofir qavmlardan boshqa hech kim noumid bo'lur» (Qur'on, 12:87). Uning sabr jamil namunasi - go'zal sabr - bu passiv taslim bo'lish emas, balki faol va umidvor ishonch bo'lib, Allohning hikmati o'z vaqtida paydo bo'ladi. Nihoyat, Yusufning huzuriga qaytib, ko‘zlari tiklanganda, sabri oqlandi. Ya'qub har bir qayg'uli mo'minga qayg'uni ham, ishonchni ham bir qalbda saqlashni o'rgatadi.",
    ],
    profile: {
      nation: "Bani Isroilning kelib chiqishi",
      location: "Levant, Misrga ko'chish bilan",
      era: "Yusuf avlodi",
      mission: "Uning xonadoni va avlodlarini tavhidda hidoyat qiling.",
      challenges: [
        "O'g'illari orasidagi keskinlik va hasad",
        "Yusuf bilan uzoq ajralish",
        "Umidni yo'qotmasdan chuqur qayg'uga chidash",
      ],
      majorEvents: [
        "O‘g‘illariga bergan nasihati va tavhid ahdi",
        "Yusuf uchun uzoq yillar sabr g'ami",
        "Misrda Yusuf bilan quvonchli uchrashuv",
      ],
      lessons: [
        "Go'zal sabr (sabr jamil) - faol, umidvor iymon",
        "Ota-onalar farzandlarining imon merosini shakllantiradilar",
        "Allohning rahmatidan hech qachon noumid bo'lmang",
      ],
      facts: ["Isroil deb ham ataladi", "Yusufning otasi va Bani Isroil qabilalari"],
    },
    quran: [
      {
        excerpt:
          "U zot: Balki, nafslaringiz sizni biror narsaga vasvasaga soldi. Shunday qilib, sabr-toqat eng mos keladi. Shoyadki, Alloh ularning hammasini mening oldimga keltirar.",
      },
      {
        excerpt:
          "Ular: «Sening ilohingga hamda ota-bobolaring Ibrohim, Ismoil va Ishoqning ilohiga — bir ilohga ibodat qilamiz va biz Unga bo'yinsunuvchimiz», dedilar.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yusuf (a.s.)",
    summary:
      "Quduqdan Misr taxtigacha bo'lgan sayohati poklikka, sabr-toqatga va kechirimlilikka o'rgatgan payg'ambar.",
    body: [
      "Yusuf (alayhissalom) Qur'onning eng to'liq rivoyati - Alloh taolo \"qissalarning eng yaxshisi\" deb atagan Yusuf surasining mavzusidir (Qur'on 12:3). Bolaligida u o'n bir yulduz, quyosh va oyning unga sajda qilayotganini ko'rdi. Hasadgo‘y akalari uni quduqqa tashlab, Misrga qul qilib sotishdi va u yerda kuchli amaldorning uyiga sotib olishdi. Yusuf o'z iymonini va sofdilligini har bir teskari o'zgarishlarda saqladi.",
      "Xo'jayinining xotini uni yo'ldan ozdirmoqchi bo'lganida uning pokligi sinovdan o'tdi. “Allohdan panoh so‘rayman”, deb rad etdi va zindonni gunohdan afzal ko‘rdi: “Men uchun zindon ular meni chaqirgan narsadan ham sevimliroqdir” (Qur’on 12:33). U begunoh bo‘lsa-da, yillar davomida qamalgan va hatto o‘sha yerda ham mahbuslarini tavhidga chaqirib, tushlarini ta’bir qilgan. Podshohning yetti yillik ocharchilik haqidagi tushi saroyni hayratda qoldirganida, Yusufning Xudo bergan talqin in’omi uni shoh huzuriga olib keldi va uni Misr xazinasiga mas’ul etib tayinladi. U xalqni hikmat va adolat bilan ocharchilik orqali boshqargan.",
      "Hikoyaning eng yuqori nuqtasi kuch emas, balki kechirimdir. Ochlikdan haydagan akalari uni tanimay ro‘parasida turganlarida, Yusuf o‘zini oshkor qilib: “Bugun senga ayb yo‘q. Alloh sizlarni mag'firat qiladi va U rahmlilarning eng rahmlisidir» (Qur'on 12:92). U zot har bir yaxshilik uchun Allohga hisob berib, uni zindondan chiqarib, oilani birlashtirganda Parvardigorim mehribon bo‘lganini aytdi. Yusuf iffat va taqvo mo'minni himoya qilishini, Allohning rejasi har bir insonning hiyla-nayrangini osoyishtalik bilan bartaraf etishini va qasos emas, kechirimlilik - oliyjanoblik belgisi ekanligini o'rgatadi.",
    ],
    profile: {
      nation: "Misrdagi Bani Isroil avlodi",
      location: "Kan'on va Misr",
      era: "Musodan oldin",
      mission: "Jamiyatga xizmat qila turib, tavhid, poklik va adolatni himoya qiling.",
      challenges: [
        "Ukalarining xiyonati",
        "Vasvasa va yolg'on tuhmat",
        "Aybsizligiga qaramay uzoq muddat qamoq",
      ],
      miracles: ["Haqiqiy tush talqinining Xudo tomonidan berilgan sovg'asi"],
      majorEvents: [
        "Quduq va otasidan ajralish",
        "Qamoq yillari",
        "Misrda hokimiyatga ko'tarilib, uning oilasi bilan birlashing",
      ],
      lessons: [
        "Poklik va poklik iymonni himoya qiladi",
        "Kechirimlilik oilalarni davolaydi",
        "Allohning rejasi har bir insonning hiylasidan ustundir",
      ],
      facts: [
        "Qissalarning eng yaxshisi deb atalgan Yusuf surasi hammasi uning hayotiga qaratilgan",
      ],
    },
    quran: [
      {
        excerpt:
          "U zot: «Bugun sizlarga ayb yo'q», dedilar. Alloh sizni kechirsin; U rahmlilarning eng rahmlisidir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Aslzoda, zodagon o‘g‘li, zodagon o‘g‘li, zodagon o‘g‘li: Yusuf, Ya’qub o‘g‘li, Ishoq o‘g‘li, Ibrohim o‘g‘li.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shuayb (a.s.)",
    summary:
      "Savdoda iymonni halollikka bog'lagan va Madyanni firibgarlik va adolatsizlikdan ogohlantirgan payg'ambar.",
    body: [
      "Shu'ayb (alayhissalom) Madyan ahliga, ya'ni aldov yo'li bilan iqtisodini buzgan, o'lchab va vaznini kalta qilish, odamlarning mollarini o'g'irlash va er yuzida zulm tarqatish orqali yuborilgan edi. Uning xabari odamlar ko'pincha ajratishga harakat qiladigan iymonning ikki yarmini - ibodat va axloqni birlashtirdi: “Ey qavmim, Allohga ibodat qiling! Sizning Undan o'zga iloh yo'qdir. Oʻlchov va tarozini adolat bilan toʻliq bajaring va odamlarni haqlaridan mahrum qilmang” (11:84-85).",
      "Uning xalqi qarshilik ko'rsatib, uning ibodatlari otalarining yolg'on odatlaridan voz kechishlarini va o'z boyliklari bilan xohlaganini qilishlarini talab qiladimi yoki yo'qligini kinoya bilan so'rashdi (Qur'on 11:87). Uni masxara qilishdi, uni va mo‘minlarni haydash bilan qo‘rqitib, hatto yo‘llarni to‘sib qo‘yishdi. Shuayb rahm-shafqat va ravshan eslatmalar bilan davom etib, qo'lidan kelgancha isloh qilishini va muvaffaqiyati yolg'iz Allohdan ekanini ta'kidladi: «Mening muvaffaqiyatim faqat Alloh taolo orqalidir. Unga tavakkul qildim va Unga qaytguvchiman” (Qur’on 11:88). U o‘z xalqini da’vat qilishda o‘zining notiqligi bilan yodda qolgan.",
      "Qachonki ular inkor qilishda davom etganlarida, azob keldi va zolimlarni tutdi, Alloh esa Shuaybni va mo'minlarni qutqardi (Qur'on 7:91-93). Uning tarjimai holi ko'pincha e'tibordan chetda qoladigan saboq beradi: iqtisodiy halollik dindan alohida emas - bu uning bir qismidir. Bozorda aldash, zaiflarni suiiste'mol qilish va chora ko'rish iymon masalasidir va adolatsizlikni qonuniylashtirgan jamiyat Allohning hukmiga chorlaydi.",
    ],
    profile: {
      nation: "Madyan ahli",
      location: "Shimoli-g'arbiy Arabiston/Levantin savdo hududi",
      era: "Ibrohimning avlodlaridan keyin",
      mission: "Savdoda tavhidga, halollik va adolatga chorla.",
      challenges: ["Bozordagi korruptsiya", "Elitadan masxara", "Chiqib ketish tahdidlari"],
      majorEvents: [
        "To'liq o'lchov va adolatli muomalaga chaqirish",
        "Ommaviy qarshilik va tahdidlar",
        "Doimiy rad etuvchilarning jazosi",
      ],
      lessons: [
        "Ishonch biznesda halollikni talab qiladi",
        "Ommaviy adolatsizlik ilohiy hukmni taklif qiladi",
        "Payg'ambarlar faqat marosim emas, balki ijtimoiy va iqtisodiy axloqqa murojaat qilishadi",
      ],
      facts: ["Faqat og'irlik va o'lchovlarni ta'kidlash uchun tanilgan"],
    },
    quran: [
      {
        excerpt:
          "Ey qavmim, Allohga ibodat qiling. Sizning Undan o'zga iloh yo'qdir. O'lchov va tarozini to'liq bering va odamlarning haqlarini kamaytirmang va er yuzida buzg'unchilik qilmang.",
      },
      {
        excerpt:
          "Muvaffaqiyatim esa Alloh orqali emas. Unga tavakkul qildim va Unga qaytguvchiman.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ayyub (a.s.)",
    summary:
      "Qur'onning sabr namunasi: uzoq davom etgan kasallik va yo'qotish tufayli sadoqatda o'zgarmas.",
    body: [
      "Ayyub (alayhissalom) — Ayub — Qurʼondagi sabr ramzidir. U salomatlik, boylik va oila bilan barakali, keyin ularni yo'qotish va uzoq va og'riqli kasallik bilan sinovdan o'tgan payg'ambar edi. Bularning barchasi orqali u hech qachon xafa bo'lmadi va Rabbiysini adolatsizlikda ayblamadi; minnatdorchilik va zikrni mahkam ushladi. Qur'oni karimda uni butun qissasini qamrab oluvchi so'zlar bilan maqtagan: «Albatta, Biz uni sabrli va go'zal banda sifatida topdik. Darhaqiqat, u Allohga qayta-qayta qaytuvchi zotdir” (Qur’on 38:44).",
      "Nihoyat, mashaqqat kuchayib ketganida, uning duosining mukammal odobiga (adabiga) e'tibor bering. Alloh taoloning hukmini talab qilmadi va shikoyat qilmadi; U Robbisi huzurida sodda va tavoze bilan o‘z holini aytdi: “Albatta, menga musibat yetdi. Sen rahmlilarning eng rahmlisisan” (Qur’on, 21:83). Allohning rahmatini so'rashning o'zidayoq tasdiqladi. Alloh unga javob berib: «Oyog'ingni yerga ur. Bu salqin cho'milish va ichimlikdir», dedi va O'zidan rahmat va namozxonlar uchun eslatma bo'lishi uchun (Qur'on 21:84; 38:41-43).",
      "Ayyub sabr-toqatni passiv sabr-toqat emas, balki faol ibodat shakli - sinov paytida Allohga doimiy qaytish ekanligini o'rgatadi. U zotning misoli, shuningdek, qanday qilib duo qilishimizni aniqlaydi: tavoze bilan, farmonga shikoyat qilmasdan va Allohning rahmatiga ishonch bilan. Uning nihoyasi esa har bir sinovdan o'tgan mo'minni ishontiradiki, iymon bilan qilingan sinovlar banda martabasini ko'tarishi va Alloh taoloning vaqtida yengillik bo'lishi mumkin.",
    ],
    profile: {
      era: "Ibrohimdan keyingi bashorat davri (keng kontekst)",
      mission: "Qiyinchilikda sabr va ibodatni o'zida mujassam etgan holda qavmini hidoyat qil.",
      challenges: [
        "Uzoq va og'riqli kasallik",
        "Boylik va oilani yo'qotish",
        "Uzoq muddatli sinov ostida chidamlilik",
      ],
      miracles: [
        "Allohning amri bilan shifo va yengillik",
        "Sinovdan keyin oilani tiklash va baraka",
      ],
      majorEvents: ["Qiyinchilikda kamtarona duosi", "Ilohiy yengillik, shifo va tiklanish"],
      lessons: [
        "Sabr ibodatning faol shaklidir",
        "Duo kamtar va shikoyatsiz bo'lganda eng go'zaldir",
        "Iymon bilan qilingan sinovlar insonning martabasini ko'tarishi mumkin",
      ],
      facts: ["Islom anʼanalarida sabr namunasi sifatida keltirilgan"],
    },
    quran: [
      {
        excerpt: "Ayyubni ham Robbisiga duo qilganida: «Albatta, menga musibat yetdi.",
      },
      {
        excerpt:
          "Albatta, Biz uni sabrli, zo'r banda deb topdik. Darhaqiqat, u Allohga qayta-qayta qaytguvchilardan edi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Zul-Kifl (a.s.)",
    summary: "Solih payg'ambar sabrlilar qatoriga kirgan, hikoyasi qisqa bo'lsa-da ulug'langan.",
    body: [
      "Zul-Kifl (alayhissalom) Qur’oni Karimda ikki marta, har ikkisida ham ulug‘ payg‘ambarlar safida tilga olingan. Alloh taolo uni Ismoil va Idris bilan birga sanaydi. Hammasi sabr qilguvchilardan edi. Va ularni O'z rahmatimizga kiritdik. Darhaqiqat, ular solihlardan edilar» (Qur'on 21:85-86) - va yana uni Ismoil va Yasa bilan birga eng zo'rlar qatorida zikr qiladi (Qur'on 38:48). Har bir eslatma maqtovdir, garchi batafsil hikoya qilinmasa ham.",
      "Qur'on va sahih sunnat uning hayotini kengaytirmaganligi sababli, klassik olimlar hatto asosiy tafsilotlar bo'yicha ham farq qiladilar - ba'zilari u payg'ambarmi yoki solih odammi deb hisoblashgan, garchi u asosiy musulmonlar ro'yxatida payg'ambarlar qatoriga kiritilgan. Ehtiyotkor mo'min sukunatni tasdiqlanmagan ertaklar bilan to'ldirishga qarshilik qiladi va Alloh tasdiqlagan narsaga amal qiladi: u sabrli va solih edi, buning o'zi ham sharafdir.",
      "Uning qo'shilishi sokin saboq beradi: Alloh taoloning har bir suyukli bandasi ortda mashhur hikoya qoldirmaydi. Doimiy, sodiq xizmat - tarixda hech qachon qayd etilmagan, lekin Allohga to'liq ma'lum bo'lgan xizmat - Uning rahmatiga sazovor bo'lgan xizmatdir. Yashirin mustahkamlik kam emas; bu solih hayotning mazmunidir.",
    ],
    profile: {
      era: "Keyinchalik Iso payg'ambarlik davri (keng tarqalgan)",
      mission: "Uning qavmini itoat va adolatga chorla.",
      lessons: [
        "Sabr bashoratli xarakterning asosidir",
        "Cheklangan tafsilot hali ham kuchli ko'rsatmalarga ega",
        "Sodiq, ko'rinmas xizmat Allohga sevimlidir",
      ],
      facts: [
        "Bemorlar orasida Ismoil va Idris bilan nomlanadi",
        "Musulmonlarning asosiy ro'yxatidagi payg'ambarlar qatoriga kiritilgan",
      ],
    },
    quran: [
      {
        excerpt:
          "Ismoil, Idris va Zul-Kifl ham sabrlilardan edilar. Va ularni O'z rahmatimizga kiritdik. Albatta, ular solihlardan edilar.",
      },
      {
        excerpt: "Ismoilni, Al-Yasa'ni va Zul-Kiflni esla, ularning barchasi ulug'lardandir.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Muso (a.s.)",
    summary:
      "Fir'avnning zulmiga qarshi chiqqan va Tavrotni olgan Bani Isroilga kelgan ulug' elchi.",
    body: [
      "Muso (alayhissalom) Qurʼonda eng koʻp zikr etilgan paygʻambar boʻlib, uning qissalari batafsil bayon etilgan. Fir'avnning Bani Isroil o'g'illarini o'ldirish buyrug'iga binoan tug'ilgan, u go'dakligida onasi tomonidan Nil daryosi bo'yidagi savatga qo'yilgan - Allohning ilhomi bilan - va Allohning rejasi bilan Fir'avnning o'z saroyida tarbiyalangan (Qur'on 28:7-13). Yillar o‘tib, Misrdan chiqib Madyanga uylanganidan so‘ng, Alloh taolo uni muqaddas Tuva vodiysiga chaqirib, u yerda Alloh taolo u bilan to‘g‘ridan-to‘g‘ri gaplashib, aso va qo‘lning ishorasini ko‘rsatib, ukasi Horun bilan birga zolim Fir’avn huzuriga jo‘natdi (Qur’on 20:9–36).",
      "Uning vazifasi ikki narsani yetkazish edi: yolg'iz Allohga ibodat qilishga da'vat va Isroilning mazlum bolalarini ozod qilish talabi. O'zini xudo deb da'vo qilgan Fir'avn uni itoatkorlik bilan kutib oldi va hatto bir qator aniq alomatlardan keyin - ilonga aylangan va sehrgarlarning hiyla-nayranglarini yutib yuborgan aso va balolar - u bo'ysunishdan bosh tortdi. Muso Bani Isroilni olib chiqqanida, Fir'avn ularni dengizga quvib yetdi. U yerda Alloh taolo: «Asoing bilan dengizni ur», deb amr qildi va dengiz ikkiga bo‘linib ketdi va mo‘minlar Fir’avn va uning qo‘shini g‘arq bo‘lgan holda quruqlikka o‘tishdi (Qur’on 26:63-66).",
      "Ammo ozodlik faqat boshlanishi edi. Keyin Muso qiyin va ko'pincha noshukur xalqni boshqarishning og'irroq va uzoq sinovini boshdan kechirdi: u tog'da Tavrotni oldi, faqat qaytib kelib, ular oltin buzoqqa sig'inayotganini ko'rdi; u ularning shikoyatlari, talablari va sabr-toqatli, qat'iy rahbarlikka bo'ysunmasliklariga duch keldi. Musoning hayoti ikkita buyuk mavzuni birlashtiradi - adolatsizlik va zulmga qarshi turish uchun jasorat va odamlar ozod bo'lgandan keyin itoatkorlikka yo'naltirish uchun zarur bo'lgan chidamlilik. U ulul-azmlardan biri sifatida jamiyatning ham islohotchisi, ham cho'ponining namunasidir.",
    ],
    profile: {
      nation: "Bani Isroil (Fir'avn qavmiga da'vat bilan)",
      location: "Misr va Sinay",
      era: "Dovud va Sulaymondan oldin",
      mission: "Tavhidga chaqiring, Fir'avnning zulmiga qarshi turing va Tavrotni yetkazing.",
      challenges: [
        "Ilohiylikni da'vo qilgan Fir'avnga qarshi turish",
        "Chidamli va noshukur odamlarga rahbarlik qilish",
        "Doimiy bosim ostida barqaror etakchilik",
      ],
      miracles: [
        "Ilonga aylangan aso",
        "Allohning amri bilan dengizning yorilishi",
        "Fir'avn oldida ko'rsatilgan ko'plab belgilar",
      ],
      majorEvents: [
        "Alloh u bilan muqaddas vodiyda gaplashmoqda",
        "Fir'avn va sehrgarlar bilan to'qnashuv",
        "Chiqish va Tavrotning nozil bo'lishi",
      ],
      lessons: [
        "Zulmga qarshi jasorat bilan turing",
        "Odamlar ustidan etakchilik katta sabr-toqatni talab qiladi",
        "Erkinlik Allohga itoat qilish uchun qo'shilishi kerak",
      ],
      facts: [
        "Besh qat'iy azm elchisidan biri (ulul-azm)",
        "Kalimulloh deb atalgan - Alloh u bilan bevosita gaplashgan kishi",
      ],
    },
    quran: [
      {
        excerpt:
          "Va men seni tanladim, bas, vahiy qilingan narsaga quloq tut. Albatta, men Allohman. Mendan o'zga iloh yo'q. Bas, Menga ibodat qil va Meni zikr qilish uchun namozni to'kis ado et.",
      },
      {
        excerpt:
          "Musoning onasiga: «Uni emiz, agar undan qo'rqsangiz, uni daryoga tashlang va qo'rqmang va qayg'urmang», deb vahiy qildik. Albatta, Biz uni senga qaytarurmiz.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Musoga o'lim farishtasi yuborildi. Uning oldiga kelganida Muso uni urdi va Alloh uning ko'zini tikladi va o'lim vaqtini tanlash imkoniyatini berdi.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Horun (as)",
    summary:
      "Fir'avn huzurida o'ziga yordamchi payg'ambar qilib tayinlangan Musoning so'zgo'y ukasi.",
    body: [
      "Horun (alayhissalom) Muso alayhissalomning akasi va oʻziga xos paygʻambar edi. Alloh taolo Musoni Fir’avn huzuriga yuborganida, Muso alayhissalom: «Menga oilamdan bir vazirni — ukam Horunni tayinlang. U orqali kuchimni oshirgin va u mening vazifamga sherik bo'lsin” (Qur'on 20:29-32). Alloh bu iltijoni qabul qildi va Qur'onda Uning javobi qayd etilgan: \"Birodaring orqali qo'lingni mustahkamlaymiz\" (Qur'on 28:35). Muso alayhissalomning yonida tog'utga Alloh taoloning xabarini etkazayotgan Horunning so'zi yanada fasohatli edi.",
      "Uning eng sinovli vaqti Musoning yo'qligida bo'ldi. Muso alayhissalom Tavrotni qabul qilish uchun tog'ga borganlarida, Bani Isroil oltin buzoqqa sig'inib qolishdi. Horun ularni ushlab turmoqchi bo‘lib: “Ey qavmim, sizlar u bilan sinayapsizlar, albatta, Robbingiz rahmlidir, menga ergashinglar va mening amrimga itoat qilinglar”, deb ogohlantirdi, lekin ular uning hokimiyatini yengib, unga zarar yetkazishlariga oz qoldi (Qur’on 20:90-94). Muso g'azablanib qaytganida, Horun Muso qaytib kelgunga qadar kuchliroq harakat qilish jamoani urushayotgan guruhlarga bo'lishdan qo'rqqanini tushuntirdi (Qur'on 7:150).",
      "Horunning tarjimai holi Alloh taologa xizmat qilishda jamoaviy ish qilishning ahamiyatini ta'kidlaydi - ikki kishining missiyasi bittadan kuchliroqdir - va haqiqatni hech qachon buzmasdan birlikni saqlashning nozik donoligi. Ba'zan sodiq etakchilik, nizolarni to'g'irlagunga qadar, parchalanib ketgan jamoani birlashtirish va zararni cheklashni anglatadi. Horun Qur'onda hidoyat topuvchilar orasida hurmatga sazovor bo'lib, Alloh unga va Musoga keyingi avlodlar orasida abadiy hamd qoldirdi (Qur'on 37:119-122).",
    ],
    profile: {
      nation: "Bani Isroil",
      location: "Misr va Sinay",
      era: "Muso davri",
      mission: "Musoga tavhidga da'vat qilishda va Bani Isroilni hidoyat qilishda yordam bering.",
      challenges: [
        "Fir'avn rejimiga qarshi turish",
        "Muso yo'qligida jamiyatni boshqarish",
        "Odamlar o'rtasida bo'linishning oldini olish",
      ],
      majorEvents: [
        "Vazir etib tayinlash va Musoga yordam berish",
        "Fir'avn oldidagi missiya",
        "Oltin buzoqning sinovi",
      ],
      lessons: [
        "Birgalikda ishlash Allohga da'vatni kuchaytiradi",
        "Etakchilik ba'zan inqirozda odamlarni birga ushlab turishni anglatadi",
        "Haqiqatni hech qachon buzmasdan birlikni saqlang",
      ],
      facts: ["Musoning akasi", "Qur’oni karimda uning fasohati uchun maqtalgan"],
    },
    quran: [
      {
        excerpt:
          "Va menga oilamdan bir vazir tayinlang, uka Horunni. U orqali mening kuchimni oshiring va u mening vazifam bilan bo'lishsin.",
      },
      {
        excerpt:
          "U aytdi: «Onamning o'g'li, albatta, odamlar meni mag'lub etdilar va meni o'ldirmoqchi edilar, dushmanlar mendan xursand bo'lmasin.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Dovud (a.s.)",
    summary:
      "Payg'ambar-podshoh hikmat, adolat va zaburni bergan va ibodatga asoslangan rahbarlik namunasini bergan.",
    body: [
      "Dovud (alayhissalom) - Dovud yoshligida Talut (Shoul) qo'shinida zolim Jolutga (G'oliyot) qarshi kurashgan. Jolutni Dovud urdi va «Alloh unga hukmronlik va hikmat berdi va unga O'zi xohlagan narsadan o'rgatdi» (Baqara surasi, 251-oyat). Keyin Alloh taolo unga podshohlik, payg‘ambarlik va nozil kitob bo‘lmish Zabur (Zabur)ni ato etib, uni ixlosmand bo‘lgan hukmdorning nodir namunasi qilib qo‘ydi.",
      "Alloh unga ajoyib sovg'alar berdi: tog'lar va qushlar unga qo'shilib, Allohni tasbeh aytar edilar va uning qo'llarida temir yumshoq qilib qo'yilgan edi, shunda u zirh yasaydi (Qur'on 21:79; 34:10-11). Shunga qaramay, Dovud bunchalik qudratiga qaramay, o'ta kamtar va fidoyi bo'lib qoldi. U zotning ibodatlari shu qadar shiddatli ediki, Payg'ambar sollallohu alayhi vasallam Dovudning ro'zasini, ya'ni har kuni tutgan ro'zasini Alloh taologa eng sevimli ro'za, tungi namozini esa eng sevimli namoz, deb ta'riflaganlar. Qur'on shuningdek, Dovudni muloyimlik bilan tuzatgan, darhol sajdaga yiqilib, mag'firat so'ragan va Parvardigoriga qaytgan (Qur'on 38:24) - uning kuchi uni hech qachon javobgarlikdan ustun qo'ymagan hukm epizodini taqdim etadi.",
      "Dovudning hayoti hokimiyat imtiyoz emas, omonat ekanligini o‘rgatadi. Alloh taolo unga to‘g‘ridan-to‘g‘ri xitob qiladi: “Ey Dovud, Biz seni yer yuzida xalifa qildik. Bas, odamlar o‘rtasida haq bilan hukm qil va havoyi nafsga ergashma!” (Qur’on 38:26). Adolat, Allohni doimo zikr qilish, tez tavba qilish va ibodatning tartibli hayoti solih rahbarlikni qo'llab-quvvatlaydi. Kuch eng ko'p ta'zim qilganning qo'lidadir.",
    ],
    profile: {
      nation: "Bani Isroil",
      location: "Quddus mintaqasi",
      era: "Sulaymon hukmronligidan oldin",
      mission: "Adolat bilan boshla, haq bilan hukm qil va qavmini Allohga da'vat et.",
      challenges: [
        "Sud mas'uliyatining og'irligi",
        "Kamtarlik bilan kuchni muvozanatlash",
        "Rahbariyatda jamoatchilik javobgarligi",
      ],
      miracles: [
        "U bilan birga Allohni tasbih qilayotgan tog'lar va qushlar",
        "Allohning izni bilan uning qo'llarida temir yumshab qoldi",
      ],
      majorEvents: [
        "Jolutning yoshligidagi mag‘lubiyati",
        "Shohlik, payg‘ambarlik va Zaburning nozil bo‘lishi",
        "Meros o‘g‘li Sulaymonga o‘tgan",
      ],
      lessons: [
        "Adolat adolatli boshqaruvning markazidir",
        "Har qanday xatodan keyin tezda tavba qiling",
        "Ibodatning tartibli hayoti etakchilikni mustahkamlaydi",
      ],
      facts: ["Zaburni oluvchi (Zabur)", "Jalutni (G‘oliyot) yoshligida mag‘lub etdi"],
    },
    quran: [
      {
        excerpt:
          "Ey Dovud, darhaqiqat, Biz seni yer yuzida xalifa qildik. Bas, odamlar o‘rtasida haq bilan hukm qil va nafsga ergashma, chunki u seni Allohning yo‘lidan adashtiradi.",
      },
      {
        excerpt:
          "Dovud bilan birga tog'larni ham, qushlarni ham tasbih qilish uchun bo'ysundirdik... Va unga dushmanlaringizdan himoya qilish uchun zirh yasashni o'rgatganmiz.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Alloh taologa eng sevimli namoz Dovud alayhissalomning namozidir, Alloh uchun eng sevimli ro‘za esa Dovud alayhissalomning ro‘zasidir: bir kuni ro‘za tutib, bir kuni iftor qilardi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sulaymon (a.s.)",
    summary:
      "Payg'ambar-podshohga tengsiz hokimiyat berilgan, ammo minnatdorchilik va donolikka asoslangan.",
    body: [
      "Sulaymon (alayhissalom) — Sulaymon — otasi Dovuddan podshohlik va paygʻambarlikni meros qilib olgan va Qurʼonda uni “Allohga qayta-qayta yuzlanuvchi zoʻr banda” deb maqtadi (Qur'on 38:30). U o'zidan keyin keladigan hech kimga o'xshamaydigan podshohlik so'rab duo qildi va Alloh unga ajoyib imkoniyat berdi: Uning buyrug'i bilan yuradigan shamolga boshqaruv; Allohning izni bilan qurgan va unga kabutar qilgan jinlarning xizmati; qushlar va boshqa mavjudotlarning nutqini tushunish (Qur'on 21:81–82; 34:12–13; 27:16).",
      "Ikki sahna uning xarakterini aks ettiradi. Chumoli o'z koloniyasini Sulaymonning qo'shini ularni bilmagan holda tor-mor etmasligi uchun panoh topishi haqida ogohlantirganda, Sulaymon jilmayib, Allohga tushunish ne'mati uchun shukr qildi, shukur va solih bo'lish uchun ibodat qildi (Qur'on 27:18-19) - kuch uni kamtarroq qildi, kamtar qildi. Saba malikasi (Sabo') va uning qavmi quyoshga sig'inayotganini eshitgach, ularni zo'rlik bilan mag'lub qilmadi, balki ularni Allohga bo'ysunishga chaqirdi va oxir-oqibat hikmat va Alloh unga bergan narsalarni ko'rsatish orqali uni iymonga tortdi (Qur'on 27:22-44). Hatto o'zining ulkan ne'matlarini ham imtihon sifatida ko'rsatdi: \"Bu Rabbimning ne'matidandirki, meni sinash uchun shukr qilamanmi yoki noshukr qilaman\" (Qur'on 27:40).",
      "Sulaymon kuch eng og‘ir sinovlardan biri, shukr (shukr) esa uning davosi, deb o‘rgatadi. Mo'minga boylik, qobiliyat yoki hokimiyat berilganidan uni adolat uchun ishlatish va boshqalarni Allohga da'vat qilish nazarda tutiladi, hech qachon mag'rurlik uchun emas. Uning butun saltanati, barcha mo''jizalari bilan, uni bergan Zotga ishora qiladi - va bu yuksaltiruvchi ne'mat va buzuvchi ne'mat o'rtasidagi farqdir.",
    ],
    profile: {
      nation: "Bani Isroil va uning atrofidagi saltanatlar",
      location: "Quddus va kengroq mintaqa",
      era: "Dovuddan keyin",
      mission: "Adolat bilan hukm qiling va xalqlarni Allohga ibodat qilishga chaqiring.",
      challenges: [
        "Keng qirollikni boshqarish",
        "Katta kuch-qudrat ichida minnatdorchilikni saqlab qolish",
        "Turli kuchlarni mas'uliyat bilan boshqarish",
      ],
      miracles: [
        "Allohning izni bilan shamolga amr qiling",
        "Qurilish va sho'ng'ishda jinlarning xizmati",
        "Qushlar va chumolilarning nutqini tushunish",
      ],
      majorEvents: [
        "Dovudning podshohligi va payg'ambarligi meros bo'lib",
        "Chumoli va uning minnatdorchiligi epizodi",
        "Sheba malikasi bilan yozishmalar va uning e'tiqodi",
      ],
      lessons: [
        "Quvvat - bu chuqur sinov",
        "Minnatdorchilik takabburlikdan himoya qiladi",
        "Donolik va da'vat qalblarni kuchdan ko'ra yaxshiroq aylantira oladi",
      ],
      facts: ["Qur'onda eng to'liq tasvirlangan payg'ambar podshohlar qatorida"],
    },
    quran: [
      {
        excerpt:
          "U zot tabassum qildi va uning gapidan zavqlanib: «Ey Robbim, menga va ota-onamga bergan ne'matingga shukr qilishimga va O'zing rozi bo'lgan solih amallar qilishga meni nasib et», dedi.",
      },
      {
        excerpt:
          "Va Sulaymonga shamolni (bo'ysundirdik) — ertalabki yo'li bir oylik, peshindan keyin esa bir oylik yo'l.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ilyos (a.s.)",
    summary: "Ba'l butiga sig'inishga qarshi chiqqan va qavmini Allohga qaytargan payg'ambar.",
    body: [
      "Ilyos (alayhissalom) Ilyos alayhissalom butparastlikka tushib qolgan Bani Isroil qavmiga yuborilgan edilar, ularning asosiy butlari Ba'l edi. Uning to'g'ridan-to'g'ri da'vosi Qur'onda qayd etilgan: «Allohdan qo'rqmaysizmi? Sizlar Ba'lga duo qilib, yaratuvchilarning eng yaxshisini — o'z Robbingiz va ota-bobolaringizning Robbi Allohni tark etasizmi? (Qur’on 37:124–126). Uning chaqiruvi abadiy bashoratli da'vat edi: soxta xudolarni yo'q qiling va faqat Yaratguvchiga sajda qiling.",
      "Qur'on uning missiyasini tanish bashorat namunasi - aniq taklif, ko'pchilik tomonidan rad etish va samimiylar uchun saqlanib qolgan hurmat bilan umumlashtiradi. «Ular uni yolg'onga chiqardilar, bas, albatta, Allohning tanlangan bandalarigina (jazoga) keltirilurlar» (Qur'on 37:127-128). Alloh taolo uni solihlar qatoriga qo‘yib, unga abadiy salom va hamdu sano qo‘yadi: “Ilyosga salomlar bo‘lsin” (Qur’on 37:129–130) va uni Zakariyo, Yahyo va Iso bilan birga hidoyat topuvchilar qatoriga qo‘yadi (Quron, 6:85).",
      "Ilyos alayhissalomning saboqlari shundan iboratki, haqiqiy islohot ibodatni tuzatishdan boshlanadi. Jamiyatni soxta narsalarga - tom ma'nodagi butlarga yoki zamonaviy istak, boylik va mavqe butlariga yo'naltirgan holda tuzatib bo'lmaydi. Tavhid barcha doimiy axloqiy yangilanishlar asosida qurilgan poydevordir va hatto sodiq guruh oz va ko'p bo'lsa ham, Alloh haqiqatni tutganlarni hurmat qiladi.",
    ],
    profile: {
      nation: "Bani Isroil o'rtasidagi jamoa",
      location: "Levant mintaqasi",
      era: "Keyinchalik isroilliklarning bashoratli davrlari",
      mission: "Qavmini Ba'l ibodatidan tavhidga chaqir.",
      challenges: ["Chuqur ildiz otgan butga sig'inish", "Rahbariyat tomonidan qarshilik"],
      majorEvents: [
        "Xalq Ba'lga sig'inishga qarshi chaqirmoqda",
        "Ko'pchilik tomonidan rad etish va mo'minlarni saqlab qolish",
      ],
      lessons: [
        "Tavhid barcha islohotlarning asosidir",
        "Kichik bir sodiq guruh hali ham Alloh uchun muhim",
        "Payg'ambarlar mashhur xatoga qarshi gapiradilar, u bilan emas",
      ],
      facts: ["Solihlar qatorida nom olgan", "Ba'l butiga sig'inish bilan yuzma-yuz keldi"],
    },
    quran: [
      {
        excerpt:
          "Qavmlariga: Allohdan qo'rqmaysizlarmi? Siz Ba'lni chaqirib, eng yaxshi ijodkorni tark etasizmi?",
      },
      {
        excerpt: "Zakariyo, Yahyo, Iso va Ilyos ham solihlardan edilar.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Al-Yasa' (a.s.)",
    summary: "Isroil naslidan bo'lgan solih payg'ambar, Qur'onda nomlari mashhurlar qatorida.",
    body: [
      "Al-Yasa' (alayhissalom) — Ilyos alayhissalom — Qurʼonning ikki joyida paygʻambarlar qatorida zikr qilingan va ikkalasida ham u zot maqtovga sazovor boʻlgan. U Alloh “olamlardan ustun qo‘ygan” Ismoil, Yunus va Lut bilan birga hidoyat topuvchilar qatorida (Qur’on 6:86–87) va yana Ismoil va Zul-Kifl bilan birga (Qur’on 38:48) ko‘zga ko‘ringanlardandir. Matn batafsil hikoyani aytib berishdan ko'ra, uning darajasini oshiradi.",
      "Vahiy u haqida ataylab qisqacha bo'lganligi sababli, musulmonlar aniq narsani - u o'z qavmida yolg'iz Allohga ibodat qilishga da'vatni qo'llab-quvvatlagan haqiqiy payg'ambar ekanligini tasdiqlaydilar va unga asosli bo'lmagan ertaklarni bog'lashdan saqlaydilar. Bu cheklovning o'zi ham sog'lom e'tiqodning bir qismidir: biz payg'ambarni atrofida hikoyalar o'ylab emas, balki u haqidagi haqiqatga rioya qilish orqali hurmat qilamiz.",
      "Uning zikri Alloh taolo ko‘plab payg‘ambarlar yuborganini va payg‘ambarning qadr-qimmati uning hikoyasi qancha vaqt saqlanib qolgani bilan emas, balki risoladagi sodiqligi bilan o‘lchanganini eslatadi. Qur'onning boshqa o'rinlarida aytganidek, \"Biz senga hikoyalarini aytib bergan Payg'ambarlar va biz hikoyalarini bayon qilmagan Payg'ambarlar\" (Qur'on 40:78) bor edi va ularning hammasiga, ma'lum va noma'lum bo'lsa, iymon keltirish musulmonning iymonidandir.",
    ],
    profile: {
      nation: "Bani Isroil",
      location: "Levant mintaqasi",
      era: "Keyinchalik isroilliklarning bashoratli davrlari",
      mission: "Uning qavmi orasida tavhidga da'vatni davom ettir.",
      lessons: [
        "Barcha payg‘ambarlarni e’tiqodda birdek hurmat qilinglar",
        "Qur'onning qisqa zikri hali ham haqiqiy hidoyatni bildiradi",
        "Adolatli davomiylik e'tiqod jamoalarini saqlaydi",
      ],
      facts: ["To'g'ridan-to'g'ri Qur'onda taniqli va tanlanganlar qatorida nom berilgan"],
    },
    quran: [
      {
        excerpt: "Ismoil, Yasa, Yunus va Lutni ham olamlardan afzal qildik.",
      },
      {
        excerpt: "Ismoilni, Al-Yasa'ni va Zul-Kiflni esla, ularning barchasi ulug'lardandir.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Yunus (a.s.)",
    summary: "Zulmatda tavba qilish umidda abadiy saboq bo'lgan kit payg'ambari.",
    body: [
      "Yunus (alayhissalom) — Yunus (alayhissalom) Nineviya aholisiga yuborilgan edi, lekin ular uning daʼvatini rad etishganida, Alloh taolo unga ketishga izn bermasdan turib, gʻazablanib, ularni tark etdi. Qur'onda keyingi voqealar tasvirlangan: «Va baliq odamini [eslang], o'shanda u g'azablanib ketib, Biz unga [qiyinchilikni] hukm qilmaymiz, deb o'yladi» (Qur'on 21:87). Kemaga o'tirib, u dengizga tashlandi va katta baliq tomonidan yutib yuborildi, qorong'ulik qatlamlariga - tunning zulmatiga, dengizga va baliqning qorniga sho'ng'idi.",
      "Yunus alayhissalom o'sha zulmatda islomdagi eng sevimli duolardan biriga aylangan so'zlar bilan shunday deb nido qildilar: “Sendan o'zga iloh yo'q. Senga shon-sharaflar bo'lsin. Albatta, men zolimlardan bo'ldim» (Qur'on 21:87). U umidsizlikka tushmadi; Allohning kamolini tasdiqladi va o'z aybiga iqror bo'ldi. Alloh taolo: «Bas, Biz uning duosini qabul qildik va uni g'amdan qutqardik. Biz mo'minlarga mana shunday najot berurmiz» (Qur'on, 21:88). Baliq uni qirg'oqqa uloqtirdi va Alloh uning zaiflashgan tanasini panoh qilish uchun o'simlik o'stirdi.",
      "So'ngra ajoyib yakun keldi: Yunus o'z qavmiga qaytdi va Qur'ondagi deyarli barcha qavmlardan farqli o'laroq, ular iymon keltirdilar va tirik qoldilar - \"Bas, Biz ularni bir muddatgacha bahramand qildik\" (Qur'on 37:147-148; 10:98). Uning hikoyasi bir-biriga bog'langan ikkita saboq beradi: zulmat qanchalik chuqur bo'lmasin, Allohning rahmatidan hech qachon noumid bo'lmang, chunki samimiy tavba yo'qolgan narsani tiklaydi; Yunus alayhissalomning duosi esa musibatga duchor bo‘lgan har bir mo‘min uchun tirgakdir. Rasululloh sollallohu alayhi vasallam hech bir musulmon u bilan duo qilmasin, magar Alloh uni ijobat qiladi, deb o'rgatganlar.",
    ],
    profile: {
      nation: "Nineviya aholisi",
      location: "Mesopotamiya mintaqasi",
      era: "Iso payg'ambarlik davri",
      mission: "Qavmini tavhidga va tavbaga chaqir.",
      challenges: [
        "Da'vatda doimiy rad etishning keskinligi",
        "Dengiz zulmatidagi shaxsiy sud",
        "Tuzatishdan keyin missiyaga qaytish",
      ],
      miracles: [
        "Baliq ichidan qutqaring",
        "Uning ustida o'stirilgan boshpana o'simlik",
        "Uning butun xalqining ishonchi",
      ],
      majorEvents: [
        "O'z xalqini va dengiz sinovini tark etish",
        "Uch zulmatda duo",
        "Qaytish va Naynavoga ishonish",
      ],
      lessons: [
        "Allohning rahmatidan hech qachon noumid bo'lmang",
        "Samimiy tavba missiyani tiklaydi",
        "Qiyinchilikdagi duo o'zgartiruvchidir",
      ],
      facts: ["Qur'onda Zun-Nun (baliq odami) deb ham ataladi"],
    },
    quran: [
      {
        excerpt:
          "Va zulmatlar ichida nido qildi: Sendan boshqa iloh yo'q. Senga shon-sharaflar bo'lsin. Albatta, men zolimlardan bo'ldim.",
      },
      {
        excerpt:
          "Yunus qavmidan boshqa iymon keltirgan va iymoni o'ziga foyda bergan shahar yo'qmi? Qachonki ular iymon keltirganlarida, Biz ulardan xorlik azobini ketkazdik.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Zun-nun baliqning qornidan Allohga duo qilganda duosi: La ilaha illa Anta, subhanaka, inni kuntu minaz-zalimin. Hech bir musulmon u bilan hech narsa uchun duo qilmaydi, magar Alloh uni ijobat qiladi.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Zakariyya (a.s.)",
    summary:
      "Keksalik chog'ida solih merosxo'r so'rab duo qilgan va Yahyo bilan ijobat qilingan solih payg'ambar.",
    body: [
      "Zakariyo (alayhissalom) — Zakariyo — Bani Isroilning taqvodor payg‘ambari va Maryamning valiysi edi. Qachonki u ayolning namozxonasiga kirsa, undan rizq topib, qanday kelganini so'rar, u: «Bu Allohdandir», deb javob berardi. Albatta, Alloh O'zi xohlagan kishiga hisobsiz rizq beradi» (Olima surasi, 37-oyat). Allohning Maryamga bergan rizqiga guvoh bo'lish, uning Alloh taolo insoniyatga imkonsiz bo'lib tuyulgan narsani berishiga umidini qaytadan uyg'otdi.",
      "Garchi u qarigan va xotini tug‘magan bo‘lsa ham, Zakariyo sokin va samimiy duoda Allohga yuzlandi: «Ey Robbim, albatta, mening suyaklarim zaiflashdi, boshim oqga to‘ldi va men Senga duo qilishimdan hech qachon norozi bo‘lmaganman» (Qur’on 19:4). U boylik yoki dunyoviy manfaatni emas, balki payg'ambarlik vazifasini bajaruvchi va Allohga ibodatni saqlaydigan solih merosxo'rni so'radi. Alloh taolo Yahyo ismli o'g'il haqida xushxabar bilan javob berdi, Alloh aytdiki, ilgari hech kimga ism berilmagan (Qur'on 19:7). Buning belgisi sifatida Zakariyya uch kun davomida odamlarga faqat imo-ishora bilan gapirishdan o‘zini tiyib, tilini Allohning zikriga bag‘ishlashi lozim edi (Qur’on 19:10–11).",
      "Zakariyoning hayoti mo'minga duo qilishdan to'xtamaslikni, garchi ijobat bo'lmasa ham, Allohdan solih oila in'omini va iymonning bardavomligini so'rashni o'rgatadi. Uning eng katta tashvishi o'zi emas, balki undan keyin haqiqatni kim olib yurishi edi. Uning hikoyasi ham ziyoratgohlardagi sokin xizmatni olijanob va sevimli amal sifatida ulug‘laydi.",
    ],
    profile: {
      nation: "Bani Isroil",
      location: "Quddus mintaqasi",
      era: "Isodan oldin",
      mission: "Uning xalqini boshqaring va payg'ambarlik ibodatini saqlang.",
      challenges: [
        "Farzandsiz keksalikka yetishish",
        "Imonning vorisligi haqida qayg'urish",
        "Taranglashgan jamiyatda ibodatni saqlab qolish",
      ],
      miracles: [
        "Yahyoning keksalikdagi xushxabari",
        "Uch kun davomida nutqni to'xtatib turish belgisi",
      ],
      majorEvents: [
        "Maryamning vasiyligi va uning rizqiga guvohlik",
        "Voris uchun chin yurakdan iltijo",
        "Ijobiy duo va Yahyoning tug'ilishi",
      ],
      lessons: [
        "Duodan hech qachon umidingizni yo'qotmang",
        "Allohdan solih oila va nasl so'rang",
        "Ibodatda sodiq xizmat sharaflidir",
      ],
      facts: ["Maryamning qo'riqchisi", "Yahyo alayhissalomning duosini ijobat qilgan otasi"],
    },
    quran: [
      {
        excerpt:
          "U yerda Zakariyo Parvardigoriga duo qilib: «Ey Robbim, menga O'z huzuringdan pokiza zurriyot bergin», dedi. Albatta, Sen duoni eshitguvchisan.",
      },
      {
        excerpt:
          "U zot: Parvardigorim, albatta, suyaklarim zaiflashdi, boshim oqga to‘ldi va Senga duo qilishimdan hech qachon norozi bo‘lmaganman, ey Robbim.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Yahyo (a.s.)",
    summary:
      "Pokiza, dono payg'ambar yoshligidan solihlik berilgan va Alloh tomonidan tinchlik bilan ulug'langan.",
    body: [
      "Yahyo (alayhissalom) — Yahyo — otasi Zakariyoning duosiga ijobat bo'lib, u tug'ilishidan oldin Alloh tomonidan ism qo'yilgan. Alloh taolo unga to'g'ridan-to'g'ri murojaat qildi: \"Ey Yahyo, kitobni qat'iyat bilan ol!\" Va “Unga bolaligida donolik berdi” (Qur'on 19:12) - bu uning erta ma'naviy etukligini ko'rsatadigan noyob ta'rif. U yoshligidan Allohga yoshidan ham jiddiylik bilan ixlosmand bo'lgan.",
      "Qur’oni karimda uning fe’l-atvori go‘zal ketma-ketlikda maqtalgan: Alloh unga “O‘z huzurimizdan noziklik va poklik ato etdi, u Allohdan qo‘rqqan, ota-onasiga taqvodor, zolim va osiy bo‘lmagan” (Qur’on, 19:13–14). U pokiza va taqvodor edi, solihlar orasida eslanadi. U o‘z qavmini itoatga va haqiqatga chorladi va Isodan oldin bo‘ldi, Allohning kalomini tasdiqladi va qalblarni hidoyatga tayyorladi (Olim surasi, 39-oyat).",
      "Alloh taolo Yahyoni hayotning eng zaif uch vaqtida tinchlik bilan ulug‘lagan: “Unga tug‘ilgan kunida, o‘lgan kunida va qayta tiriladigan kunida salomlar bo‘lsin” (Qur’on 19:15). Uning tarjimai holi yoshu qari uchun bir xabardir: Allohga yaqinlik keyingi yillarga qoldirilmaydi. Qalb pokligi, ibodatda jiddiylik, ota-onaga mehribonlik insonning yoshligida gullab-yashnashi mumkin - va bunday hayot Allohga sevimlidir.",
    ],
    profile: {
      nation: "Bani Isroil",
      location: "Levant mintaqasi",
      era: "Zakariyya bilan zamondosh va Iso alayhissalom davriga yaqin",
      mission: "Solihlikka chaqiring va qalblarni hidoyatga tayyorlang.",
      challenges: [
        "Axloqiy jihatdan taranglashgan sharoitda davlat islohoti",
        "Poklik va printsipni saqlash",
      ],
      majorEvents: [
        "Uning ijobat qilingan duosi sifatida tug'ilishi",
        "Yoshligida hikmat berilgan",
        "Uning pokligi va fidoyiligi uchun e'tirof",
      ],
      lessons: [
        "Yoshlar solihlikka yo'l ko'rsatishi mumkin",
        "Yurak pokligi haqiqiy kuchdir",
        "Ota-onaga yaxshilik qilish taqvoning bir qismidir",
      ],
      facts: [
        "U tug'ilishidan oldin Alloh tomonidan ism qo'yilgan",
        "Tug'ilishda, o'limda va tirilishda tinchlik bilan ulug'lanadi",
      ],
    },
    quran: [
      {
        excerpt:
          "Ey Yahyo, Muqaddas Kitobni qat'iyat bilan ol. Biz unga bolaligida hikmat, o'zimizdan mehribonlik va poklik berdik va u Allohdan qo'rqardi.",
      },
      {
        excerpt:
          "Alloh sizlarga Allohning so'zini tasdiqlovchi, hurmatli, tiyiladigan va solihlardan bir payg'ambar bo'lgan Yahyoning xushxabarini beradi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Iso ibn Maryam (a.s.)",
    summary:
      "Maryamdan mo''jizaviy tarzda tug'ilgan, Allohga ochiq-oydin oyat-mo''jizalar bilan chaqiruvchi qudratli elchi - ilohiy emas, xizmatkor.",
    body: [
      "Iso (alayhissalom) — Iso alayhissalom Allohning amri bilan Maryamdan otasiz tug‘ilganlar, Uning mutlaq qudratiga dalolatdir: “Albatta, Isoning Alloh huzuridagi misoli Odam alayhissalomning misoli kabidir. Uni tuproqdan yaratdi, so'ng unga: «Bo'l», dedi, u bo'ldi» (Olima surasi, 59-oyat). Maryam yangi tug'ilgan chaqaloqni qavmining oldiga olib kelganida, ular uni ayblaganlarida, chaqaloq Iso beshikdan turib uni himoya qilib: «Albatta, men Allohning bandasiman. U menga kitob berdi va meni payg‘ambar qildi” (Qur’on 19:30). Bu birinchi bayonot uning butun missiyasining ohangini belgilab berdi - u Allohning bandasi edi.",
      "Iso alayhissalom o‘zidan oldingi Tavrotni tasdiqlash va Injilni keltirish uchun Bani Isroilga yuborildi. Alloh taolo O'z izni bilan uni ochiq-oydin mo''jizalar bilan qo'llab-quvvatladi: u ko'r va moxovga shifo berdi, o'liklarni tiriltirdi va Allohning izni bilan loydan uchadigan qushni yaratdi (Olima surasi, 49-oyat). Uning rivoyati odamlarni “Mening Robbim va sizning Parvardigoringiz Allohga” ibodat qilishga, ixlos va to‘g‘rilikka chaqirdi. Uning yaqin shogirdlari Havoriyyunlar unga ishonib, qo‘llab-quvvatladilar.",
      "Qur'on Iso haqidagi ikkita haddan tashqari narsani to'g'rilaydi. Uni rad etgan va uni o'ldirishga qasd qilganlarga qarshi, u o'ldirilgani ham, xochga mixlanmagani ham e'lon qilinadi. Balki u shunday zohir bo'ldi va Alloh uni O'ziga ko'tardi (Qur'on 4:157-158). Mubolag'a qilganlarga qarshi, u Alloh yoki Allohning o'g'li emas, balki ulug' payg'ambar va elchi ekanligini ta'kidlaydi - \"Masih ibn Maryam, faqat elchi emas edi\" (Qur'on 5:75). Sunniylik e'tiqodida u oxiratdan oldin qaytadi. Uning hikoyasida Allohning qudrati barcha tabiiy sabablardan ustun ekani, payg‘ambarlar mo‘tabar bandalar ekani va hech qachon ilohiy emasligi, haqiqatni ham inkordan, ham mubolag‘adan himoya qilish lozimligi o‘rgatiladi.",
    ],
    profile: {
      nation: "Bani Isroil",
      location: "Levant",
      era: "Milodiy 1-asr",
      mission: "Tavhidni yangilang, Tavrotni tasdiqlang va yaxshilikka chaqiring.",
      challenges: [
        "Uni rad etganlarning qarshiligi va fitnasi",
        "Uning maqomini keyinroq bo'rttirish",
        "Sof monoteizmni himoya qilish",
      ],
      miracles: [
        "Otasiz tug'ilish",
        "Beshikda gapirish",
        "Allohning izni bilan shifo va hayot berish",
      ],
      majorEvents: [
        "Uning mo''jizaviy tug'ilishi va onasining himoyasi",
        "Aniq belgilar bilan ommaviy chaqiruv",
        "Ollohga ko'tarilish, o'ldirish emas",
      ],
      lessons: [
        "Allohning qudrati oddiy sabablardan ham ustundir",
        "Payg'ambarlar Allohning hurmatli bandalaridir, hech qachon ilohiy emas",
        "Haqiqatni ham inkordan, ham mubolag'adan saqlash kerak",
      ],
      facts: ["Injil (Injil) berilgan", "Sunniy aqidada qiyomatdan oldin qaytadi"],
    },
    quran: [
      {
        excerpt:
          "(Iso dedi): «Albatta, Alloh mening ham, sizning ham Robbingizdir. Bas, Unga ibodat qiling. Bu to'g'ri yo'ldir.",
      },
      {
        excerpt:
          "Ular uni o‘ldirmadilar va xochga mixlamadilar. Lekin u ularga shunday ko'rsatildi... Balki Alloh uni O'ziga ko'tardi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Men Maryam ibn Isoga odamlarning eng yaqiniman. Payg'ambarlar har xil onalarning aka-ukalari, lekin dinlari bir, oramizda payg'ambar bo'lmagan.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Muhammad s.a.v",
    summary: "Butun olamlarga rahmat qilib yuborilgan oxirgi elchi va payg'ambarlik muhri.",
    body: [
      "Muhammad sollallohu alayhi vasallam bir qavmga emas, balki butun insoniyatga yuborilgan payg'ambarlarning oxirgisi bo'lib, Qur'on oxirgi va saqlanib qolgan vahiydir. Alloh taolo o‘zining vazifasini bir oyatda bayon qiladi: “Biz seni olamlarga faqat rahmat qilib yubordik” (Qur’oni karim, 21:107). Makkada tug‘ilib, qirq yoshida Hiro g‘orida ilk vahiyni oldi va keyingi yigirma uch yil davomida odamlarni yolg‘iz Allohga ibodat qilishga, qalblarini poklashga, adolat va rahm-shafqat bilan yashashga chaqirdi – o‘zidan oldingi har bir payg‘ambarning xabarini to‘ldirib, tasdiqladi.",
      "Uning yo'li doimiy qurbonliklardan biri edi. Makkada u va ilk imonlilar masxara, qiynoqlar va yillar davomida boykotga chidadilar. Keyin hijrat, Madinaga hijrat keldi, u yerda birinchi musulmon jamiyatini qurdi - namoz o'rnatdi, muhojirlar va yordamchilar o'rtasida birodarlik, shartnomalar va tavhidga asoslangan jamiyat qurdi. Yillar davomida qiyinchilik va g'alaba qozonish paytida uning xarakteri hech qachon o'zgarmadi; Qur'on guvohlik beradi: \"Albatta, sen buyuk axloq egasisan\" (Qur'on 68:4) va uning o'zi olijanob xulq-atvorni mukammal qilish uchun yuborilganligini aytdi.",
      "Alloh taolo uni «Allohning Rasuli va payg'ambarlarning muhri» deb e'lon qiladi (Qur'on 33:40) — Undan keyin payg'ambar yo'q. Uning eng katta mo''jizasi Qur'onning o'zi bo'lib, u haligacha milliardlab odamlarga yo'l-yo'riq ko'rsatuvchi doimiy alomat bo'lib, u isro va me'roj, tungi sayohat va ko'tarilish bilan sharaflangan. Mo'min uchun u uswah hasana - go'zal namunadir (Qur'on 33:21) - uning sunnati iymonning amaliy yo'lidir. Musulmonlar hayotining zamirida uni sevish, hidoyatiga ergashish va unga salovot aytish yotadi.",
    ],
    profile: {
      nation: "Butun insoniyat",
      location: "Makka va Madina",
      era: "Milodiy 7-asr",
      mission: "Yakuniy vahiyni etkazing va barcha xalqlar uchun bashoratli xabarni to'ldiring.",
      challenges: [
        "Makkadagi zulm va boykot",
        "Mojaro va adolatli jamiyat qurish",
        "Umumjahon xabarini qabilalar va xalqlar o'rtasida etkazish",
      ],
      miracles: [
        "Qur'on abadiy mo''jiza sifatida",
        "Isro va Me'roj (tungi sayohat va ko'tarilish)",
        "Allohning izni bilan berilgan ko'plab alomatlar",
      ],
      majorEvents: [
        "Makkada vahiy boshlanishi",
        "Madinaga hijrat",
        "Xabar va vidolashuv xutbasining tugashi",
      ],
      lessons: [
        "Rahbarlikdagi rahm-shafqat va olijanob xarakter",
        "Bosim ostida barqarorlik",
        "Vahiy va sunnatga birga amal qiling",
      ],
      facts: ["Payg'ambarlarning muhri", "Mo'minlar uchun eng yaxshi namuna (usva hasana)."],
    },
    quran: [
      {
        excerpt:
          "Muhammad sizning erkaklaringizning otasi emas, balki u Allohning elchisi va payg'ambarlarning muhridir.",
      },
      {
        excerpt: "Biz seni faqat olamlarga rahmat qilib yubordik.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mening misolim va mendan oldingi payg‘ambarlarning misoli, bir g‘isht o‘rnidan boshqa uyni go‘zal va mukammal qurgan odamning misolidir. Men o‘sha g‘ishtman, payg‘ambarlarning muhriman.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
];

export const PROPHETS_TIMELINE_UZ: DeepPartial<ProphetsTimelineEvent>[] = [
  {
    era: "Boshlanish",
    title: "Odam - birinchi payg'ambar",
    body: "Alloh taolo Odam alayhissalomni yaratdi, unga ismlarni o'rgatdi va uni yerdagi o'zining noibi qildi.",
  },
  {
    era: "Antik davr",
    title: "Idris, Nuh va ilk qavmlar",
    body: "Ilk payg‘ambarlar o‘z qavmlarini tavhidga chaqirganlar. Nuh asrlar davomida va'z qilgan; rad etish davom etganda, to'fon keldi va kema imonlilarni alomat sifatida qutqardi.",
  },
  {
    era: "Mesopotamiya / Levant",
    title: "Ibrohim va uning oilasi",
    body: "Allohning do‘sti Xalilulloh: butlarni sindirib tashladi, olovdan qutuldi, Ismoil bilan Ka’ba qurdi, Ismoil va Ishoq orqali payg‘ambarlar avlodi tug‘ildi.",
  },
  {
    era: "Misr va Sinay",
    title: "Muso va Bani Isroil",
    body: "Fir'avndan ozod bo'lish, Tavrot nozil qilingan, Bani Isroilgacha bo'lgan payg'ambarlar qatori.",
  },
  {
    era: "Misr",
    title: "Yusuf Misrda",
    body: "Xiyonat, qamoq va hokimiyatga ko'tarilish orqali sabr-toqat - ishonch namunasi.",
  },
  {
    era: "Quddus",
    title: "Dovud va Sulaymon",
    body: "Shohlik, hikmat, Zabur, Qur’onda maqtalgan saltanat.",
  },
  {
    era: "Milodiy 1-asr",
    title: "Iso ibn Maryam",
    body: "Mo''jizaviy tarzda tug'ilgan, beshikda gapirgan, Alloh uchun ko'tarilgan - Qur'on bo'yicha xochda o'ldirilmagan.",
  },
  {
    era: "Milodiy 7-asr",
    title: "Muhammad sollallohu alayhi vasallam - payg'ambarlar muhri",
    body: "Butun insoniyatga oxirgi xabarchi; Qur'on oxiratgacha saqlanib qolgan.",
  },
];
