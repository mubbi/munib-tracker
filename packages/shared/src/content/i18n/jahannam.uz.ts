// Uzbek translation overlay for the Learn "Jahannam" content. Mirrors the order of
// its English source in ../jahannam*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  JahannamDuaEntry,
  JahannamGateEntry,
  JahannamHadithEntry,
  JahannamNameEntry,
  JahannamReferenceEntry,
  JahannamReflectionEntry,
  JahannamTopic,
  JahannamVerseEntry,
} from "../../types/jahannam";
import type { DeepPartial } from "./localize";

export const JAHANNAM_CORE_TOPICS_UZ: DeepPartial<JahannamTopic>[] = [
  {
    title: "Kirish",
    summary:
      "Alloh taolo jahannam haqida bizga umidsizlik uchun emas, balki hidoyat uchun xabar beradi.",
    body: [
      "Jahannam - ko'pincha do'zax yoki do'zax deb tarjima qilinadi - Alloh Qur'onda va Rasuli sollallohu alayhi vasallam orqali tasvirlangan oxiratdagi jazo maskanidir. U bizga yurakni qo'rquv bilan ezib tashlamaslikni, balki eshik hali ochiq turganda qalblar uyg'onishi, orqaga qaytishi va rahmat yo'lini tanlashi uchun aytadi.",
      "Bu rahmdil Rabbiy nima uchun umuman olov haqida gapirayotganini tushunishga yordam beradi. Ogohlantirishning o'zi rahm-shafqatdir: zulmatda oldinda qoya borligi aytilgan odamga tahdid emas, balki sovg'a qilingan. Jahannam haqidagi har bir oyat Alloh taolo O'z mehribonligi bilan bandalarini qaytish vaqti o'tmasdan qaytarib chaqiradi.",
      "Shuning uchun ham ogohlantirishlar vahiy davomida tavbaga, mag'firatga va Allohning keng rahmatiga umid qilishga da'vatlar bilan birlashtirilgan. Qur'onda do'zax kamdan-kam zikr qilinadi, uning yonida, jannat, ochiq tavba eshigi va Allohning qaytuvchilarga muhabbati zikr qilinadi. Maqsad - solihlikka olib boradigan javobgarlik - hech qachon umidsizlikka tushmang.",
      "Jahannamga iymon keltirish g‘aybga (al-g‘aybga), ilohiy adolatga va oxirat kunining haqiqatiga ishonishning bir qismidir. Bu bizning tanlovlarimizga vazn beradi va jannatdagi umidni gunohga nisbatan jiddiylik bilan muvozanatlashtiradi, shunda mo'min umid va qo'rquv o'rtasida - Allohning rahmatidan umidvor bo'lib, o'z kamchiliklaridan ehtiyot bo'ladi.",
      "Sunniylik e'tiqodining asosiy tasalli nuqtasi ushbu modul orqali o'tadi: yolg'iz Allohga ishongan holda vafot etganlar, hatto gunohga duchor bo'lsalar ham, do'zaxda abadiy qolmaydilar. Allohning rahmati va O'zi izn bergan shafoati bilan gunohkor mo'minlar oxir-oqibat chiqarib yuboriladi. faqat iymonni inkor qilib o'lganlar qoladi. Demak, Jahannamni o'rganish mo'min uchun oxir-oqibat rahm-shafqatga qanday erishishni o'rganishdir.",
      "Ushbu modul matnlarda aniq bayon qilingan narsalarni taqdim etadi, olimlarning ixtilof qilgan joylarini halol qayd etadi, faqat sahih dalillarni keltiradi va sizni doimiy ravishda tavbaga, yaxshi amallarga va Allohga tavakkal qilishga yo'naltiradi.",
    ],
    quran: [
      {
        excerpt:
          "Kofirlar uchun tayyorlangan do'zaxdan qo'rqinglar va Allohga va Payg'ambarga itoat qilinglar, shoyad rahm qilinsangiz.",
      },
      {
        excerpt:
          "Ayting: Ey o'zlariga zulm qilgan bandalarim, Allohning rahmatidan noumid bo'lmanglar. Albatta, Alloh barcha gunohlarni kechiradi.",
      },
      {
        excerpt:
          "Ey iymon keltirganlar, Allohga chin tavba bilan tavba qilinglar, shoyadki, Robbingiz sizlardan gunohlaringizni ketkazsa va jannatlarga kiritsa.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Alloh nega Jahannamni yaratdi",
    summary: "Ilohiy adolat, javobgarlik va erkin tanlovning oqibatlari.",
    body: [
      "Jahannam Alloh taoloning komil adolati (adl)ning namoyoni sifatida mavjuddir. Zolim va mazlum, ixlos va xiyonat bir xil bo‘lgan koinot adolatli bo‘lmaydi. Alloh taolo odil zot bo‘lgani uchun har bir xatoga javob berilib, har bir yaxshilik taqdir qilinadigan joyda oxirgi hisob bo‘lishi kerak.",
      "Asosiysi, Alloh hech kimga zulm qilmaydi. Do'zaxga kirgan har bir jon o'z qarori bilan, tavba-tazarru qilmagan holda kiradi, hech qachon o'zboshimchalik bilan emas. Qur'onda: «Alloh odamlarga zulm qilmas, balki odamlar o'zlariga zulm qilurlar» (4:40) ta'kidlangan. Hech kim qilmagan ishi uchun ham, loyiq bo'lmagani uchun ham jazolanmaydi.",
      "Insonlar zulmatda qolmagan. Alloh ularga aql berdi, payg'ambarlar yubordi va aniq hidoyatni nozil qildi, so'ngra ularni qabul qilish yoki rad etish erkinligi bilan ulug'ladi: «Kim xohlasa, iymon keltirsin. Kim xohlasa, kofir bo'lsin» (18:29). Haqiqatni rad etishda, zulm qilishda yoki katta gunohda tavba qilmasdan turib qolish oxiratda oqibatlarga olib keladi, chunki tanlov haqiqatan o'ziniki edi.",
      "Ammo bu erda ham rahm-shafqat adolatni belgilaydi. Alloh taolo hukm qilishdan oldin ogohlantiradi, hisobni qaytarish uchun joy qoldirishni kechiktiradi, so'ralganda tezda mag'firat qiladi va bir gunohni bitta qilib yozgan holda bir yaxshilikni ko'p marta mukofotlaydi. Uning adolati hech qachon Uning rahmatidan ajralib turmaydi.",
      "Jahannam nima uchun borligi haqida mulohaza yuritish, taqvoni (xudoga bo'lgan ongni) oshirishi va tavba qilish imkoniyati bo'lgan hayotning har bir kuni uchun minnatdorchilikni chuqurlashtirishi kerak. Bu yurakni bir vaqtning o'zida jiddiy va umidvor qilish uchun mo'ljallangan - uni hech qachon umidsizlik bilan falaj qilmaslik.",
    ],
    quran: [
      {
        excerpt: "Albatta, Alloh odamlarga zulm qilmas, balki odamlar o'zlariga zulm qiladilar.",
      },
      {
        excerpt: "U qilgan ishlaridan so'ralmaydi, balki ular so'roq qilinadilar.",
      },
      {
        excerpt:
          "Kim xohlasa, iymon keltirsin. Kim xohlasa, kufr keltirsin. Biz zolimlar uchun do'zax tayyorlab qo'yganmiz.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sizlardan hech biringiz o'z amali bilan jannatga kirmaydi. Ular: «Siz ham emasmisiz, ey Allohning Rasuli?» dedilar. U zot: «Men ham, Alloh meni o'z rahmati bilan qamrab olmasa», dedi.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Oxirat haqiqati",
    summary: "O'limdan hukmgacha - har bir bosqich haqiqiy va aqida bilan bog'liq.",
    body: [
      "Jahonnamni to'g'ri tushunish uchun u kattaroq sayohatda qayerda o'tirganini ko'rishga yordam beradi. Islom o'limdan keyin aniq ketma-ketlikni o'rgatadi: ruh tanadan chiqib ketadi, so'ngra barzax (qabrning oraliq umri) boshlanadi, so'ngra jasadlar tirilishida qiyomat, butun mavjudotning yig'ilishi, amallar tekshiriladigan qiyomat, amallarni tarozida tortish (al-Mizon), har bir ko'prikni kesib o'tish va oxir-oqibat, har bir ko'prikdan o'tish va har bir ko'prikdan kesish Jannat yoki do'zax - hammasi Allohning hukmi, adolati va rahmati bilan.",
      "Ushbu bosqichlarning har biri asosiy sunniy aqidada Qur'on va sahih sunnat asosida tasdiqlangan. Bu vaqt jadvali ramz yoki hikoya emas; Qiyomat kuniga iymon keltirishning bir qismi sifatida e'tiqod qilinishi haqiqatdir va uni bila turib inkor etish faqat amalda emas, balki aqida masalasidir.",
      "Butun yo'lni ko'rish, shuningdek, olovni qaytadan qoplaydi. Bu har bir ruh allaqachon sayohat qilgan sayohat oxirida mumkin bo'lgan manzildir - bu bugungi tanlov mavhum emasligini anglatadi. Ular bu yo'l bo'ylab qadamlar va ular hali ham biznikidir.",
      "Bu ketma-ketlikni bilish mo'minga qo'rquvdan ko'ra tayyorlanishga yordam beradi: o'limni sog'lom zikr qilish (zikr ul-mavt) bilan yashashga, xatolarni yig'ilishga olib bormasdan oldin tuzatishga va amal eshigi hali ochiq bo'lganida yaxshi amallar hisobini to'ldirishga yordam beradi. O'lim bu eshikni yopadi; undan keyin hech narsa qo'shib bo'lmaydi.",
    ],
    quran: [
      {
        excerpt:
          "Albatta, bundan keyin o'lasizlar. So'ngra, albatta, qiyomat kunida qayta tiriltirilursiz.",
      },
      {
        excerpt:
          "Kimning tarozisi og'ir bo'lsa, u rohat hayotda bo'lur. Kimning tarozisi engil bo'lsa, uning panohi tubsizlikdir.",
      },
    ],
    actions: [
      "Aqidani o'rganishning har bir bosqichini o'rganing va e'tiqodni kundalik tanlovlar bilan bog'lang.",
      "Rahmat umidini e'tiborsiz qoldirmasdan, o'limni zikr qilishni (zikr al-mavt) ko'paytiring.",
    ],
    appLinks: [{}, {}, {}, {}, {}, {}],
  },
  {
    title: "Jahannam nomlari",
    summary:
      "Qur'ondagi ma'noli ismlar - har biri alohida daraja ekanligi haqida ulamolar ixtilof qiladilar.",
    body: [
      "Qur'on do'zaxni bir necha nomlar bilan tilga oladi va bu shunchaki takrorlash emas. Arab tilida ism ko'pincha uning ichida yorqin ta'rifga ega, shuning uchun har bir ism o'zi ko'rsatadigan haqiqat haqida nimanidir o'rgatadi. Jahannam, Johim, Saqar, Soir, al-Hutama, al-Haviyya va Lazoa shular jumlasidandir.",
      "Har bir ism jiddiylikning boshqa tomoniga oyna ochadi. Johim va Sa'ir shiddatli alangali olovni uyg'otadi; Saqar, kuydiruvchi va hech narsa qoldirmaydigan narsa; al-Hutama, unga nima tashlansa, sindiruvchi; al-Haviya, chuqur tubsizlik bo'lib, unga tushadi; va Lazaa, sof, yalang'och alanga. Ismlarni birgalikda o'qish, yurak osonlikcha e'tiborsiz qoldirib bo'lmaydigan hushyor tasvirni yaratadi.",
      "Ibn Kasir va at-Tabariy kabi mumtoz tafsir olimlari bu nomlarni arabcha ildizlaridan kelib chiqib izohlaydilar va har birini qat’iy texnik ro‘yxat sifatida ko‘rib chiqmasdan, u kelgan oyat kontekstida muhokama qiladilar.",
      "Bu erda bir so'z bilan ehtiyot bo'lishga arziydi. Keyinchalik ba'zi yozuvchilar har bir ismni do'zaxning alohida, tartiblangan \"darajasi\" sifatida, ba'zan esa batafsil diagrammalar bilan taqdim etadilar. Bu Qur'onda yoki kelishilgan hadislarda aytilgan aniq nazorat ro'yxati emas, balki ilmiy talqindir. Muvozanatli yondashuv matnlar aslida beradigan ma'nolarni o'rganish va spekulyativ xaritalarni aniqlik sifatida taqdim etishdan qochishdir.",
      "Ismlarni o'rganishdan maqsad qiziquvchanlikni qondirish emas, balki yurakni yumshatish va uni ushbu modul ko'rsatayotgan rahm-shafqat sari harakatlantirishdir. Har bir ismning Qur'ondagi hodisasi, konteksti va tafsir xulosasi uchun to'liq ismlar to'plamini ko'rib chiqing.",
    ],
    quran: [
      {
        excerpt: "Jahannam oromgoh bo'lsa kifoya - Jahannam.",
      },
      {
        excerpt: "U Hutamaga - ezuvchi do'zaxga tashlanadi.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Jahannam darajalari",
    summary: "Jazoning turli darajalari - matnlarda aniq tuzilma to'liq tavsiflanmagan.",
    body: [
      "Qur'onda ochiq-oydin bayon qilingan qoida shundaki, jazo mutanosibdir: Do'zaxdagi hamma ham uni bir xil darajada boshdan kechirmaydi. “Hamma uchun qilgan amallariga yarasha darajalar bordir” (6:132). Bu o'zi adolat ifodasidir - oz zulm qilgan odamga ko'p zulm qilgandek munosabatda bo'lmaydi.",
      "Sahih sunnat ham xuddi shu tamoyilni ko'rsatadi. Rasululloh sollallohu alayhi vasallam do‘zaxning eng oz azobini oyoqlari ostiga ikki cho‘g qo‘yib, miyasi qaynaydigan, shu bilan birga, jahannam ahlining azobida eng yengili deb ta’riflaganlar (Sahih al-Buxoriy 6562). Agar bu eng kichik bo'lsa, ong katta darajalar qanchalik jiddiy bo'lishi kerakligini va bugun orqaga qaytish uchun qancha sabab borligini tushunadi.",
      "Shu bilan birga, vahiy imonlilarga yod olishlari shart bo'lgan jahannam tuzilishining to'liq, raqamlangan xaritasini bermaydi. Olimlar turli oyatlar va xabarlardan olingan darajalar, chuqurliklar va toifalarni muhokama qildilar, ammo bularning aksariyati kelishilgan, aniq matn emas, balki talqin bo'lib qolmoqda.",
      "Biroq, ikkita narsa aniq. Birinchidan, o'sha zulm (zulm), shirk va tavbasiz davom etadigan katta gunohlar qattiq ogohlantirishdir. Ikkinchidan, va hech qachon unutmaslik kerakki, Allohning rahmati va mag'firati O'ziga sidqidildan qaytgan har bir kishi uchun o'lim lahzasigacha ochiq qoladi. Darajalar haqida o'rganishning maqsadi tanlov qolganda engilroq yo'lni tanlashdir.",
      "Amalda, bu \"etti daraja\" yoki shunga o'xshash sxemalarning batafsil ro'yxatini qat'iy ta'limot emas, balki ilmiy fikr sifatida ko'rib chiqish va aslida himoya qiladigan narsaga e'tibor berishni anglatadi: imon, tavba va solih amallar.",
    ],
    quran: [
      {
        excerpt: "Hammaga qilgan amallariga yarasha darajalar bordir.",
      },
      {
        excerpt:
          "Albatta, munofiqlar do'zaxning eng past tubidadirlar va sen ularga hech qachon yordamchi topa olmassan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Do'zax ahlining eng oz azobi oyog'i ostiga ikki cho'g' qo'yilgan, miyasi qaynaydigan kishidir.",
      },
    ],
    disclaimer:
      "Ba'zi kitoblarda topilgan do'zax darajalarining diagrammalari bir ovozdan emas, balki ilmiy talqinni aks ettiradi.",
  },
  {
    title: "Jahannam eshiklari",
    summary: "Etti darvoza - Qur'onda aytilgan narsa va talqini turlicha.",
    body: [
      "Jahannam haqida bir tafsilot Qur'oni Karimda ochiq va aniq bayon qilingan: «Albatta, do'zaxning yetti eshigi bor. Har bir darvoza uchun ularning bir qismi bordir” (15:44). Shunday qilib, yetti darvozaga ishonish taxminlarga emas, balki aniq vahiyga tayanadi.",
      "Oyat ikki narsani tasdiqlaydi: yetti eshik borligi va kirganlar ular orasida taqsimlangan. Klassik tafsir olimlari taqsimlash nimani anglatishini muhokama qiladilar - bu odamlar toifalariga ishora qiladimi, amallarga mos keladigan jazo darajalariga yoki ikkalasiga ham ishora qiladi. Bo'linishning hikmati Allohga tegishli bo'lib, Uning adolati har bir jonni o'z joyiga joylashtiradi.",
      "Aniqlik qayerda tugashiga e'tibor berish muhimdir. Ba'zi keyingi ishlar har bir o'ziga xos eshikni ma'lum bir gunoh yoki guruhga tayinlaydi. Bu maxsus topshiriqlar eng qadimgi manbalarda bir xilda o'rnatilmagan, shuning uchun ular bashoratli spetsifikatsiya sifatida emas, balki alohida olimlarning qarashlari sifatida taqdim etilgan.",
      "Darvozalar sabog‘i me’moriy emas, balki axloqiydir: Do‘zaxga olib boradigan eshiklar ko‘p va ulardan omon qolishning yo‘li bir – samimiy iymon, katta gunohlardan saqlanish, sirpanib qolganda tez tavba qilish.",
    ],
    quran: [
      {
        excerpt:
          "Va, albatta, jahannam ularning barchasiga va'da qilingan joydir. Uning ettita darvozasi bor; Har bir darvoza uchun bir qism ajratilgan.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Jahannamning tavsiflari",
    summary:
      "Olov, issiqlik, zanjirlar, pushaymonlik - sensatsiya emas, balki hurmat bilan taqdim etilgan.",
    body: [
      "Qur'on va sahih Sunnat Jahonnomni jonli va aniq til bilan tasvirlaydi va ular buni bir sababga ko'ra qiladilar: inson qalbi mavhum g'oyalardan ko'ra ko'proq tasvirlashi mumkin bo'lgan tasvirlar bilan harakat qiladi. Ta'riflar - kuchli olov, chidab bo'lmas issiqlik, cheklangan oziq-ovqat va ichimliklar, zanjirlar, qorong'ulik va chuqur pushaymonlik - bizni undan uzoqlashtirish uchun xavfni haqiqiy qilish uchun mo'ljallangan.",
      "Qaynoq suvdan ichish, achchiq zakkum daraxti taom sifatida, olovdan kesilgan kiyim-kechak, inson tayangan har qanday qulaylikdan ajralish ta'riflari orasida. Rasululloh sollallohu alayhi vasallam bu issiqlik biz bilgan barcha narsadan qanchalik ustun ekanligini aytib, bu dunyoda biz yoqadigan olov oxirat olovining yetmish qismidan faqat bir qismidir, dedilar (Sahih al-Buxoriy 3265).",
      "Bu ta'riflar oxiratni bo'shatib qo'yadigan tashbeh emas, balki haqiqiy ogohlantirishdir. Sunniy ulamolar g'aybning aniq modalligini Allohning ilmiga qoldirib, o'zlarining haqiqatlarini tasdiqlaydilar; mo'minning vazifasi ogohlantirishni parchalash emas, balki yurakka olishdir.",
      "Bunday parchalarni o‘qishning odobi (adab) bor. Ularga kamtarlik, Allohdan qo'rqish va darhol tavba qilish va panoh so'rashga intilish bilan yaqinlashadi - bu maftunkorlik bilan emas va hech qachon umidsizlik bilan emas, chunki ogohlantirishning maqsadi shundaki, biz undan qochishga hali vaqtimiz bor.",
      "Ehtimol, bu tavsiflardagi eng og'ir mavzu afsuslanishdir. Harakat vaqti allaqachon yopilganida, \"Menda bo'lsa edi ...\" deb aytiladi. Endi bu afsus haqida eshitishning rahm-shafqati shundaki, biz bugungi kunda \"agar\" bo'lsa ham harakat qila olamiz, ammo bu bizning oxiratimizni o'zgartirishi mumkin.",
    ],
    quran: [
      {
        excerpt:
          "Uning oldida jahannam bor va unga iflos suv ichiladi. U yutadi, lekin yutib yubormaydi.",
      },
      {
        excerpt: "Ular uchun olovdan kiyimlar kesiladi va boshlaridan qaynoq suv quyiladi.",
      },
      {
        excerpt:
          "O'sha Kunda jahannam chiqarilur. O'sha kunda inson eslaydi, lekin zikrdan unga nima foyda?",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sizning olovingiz jahannam olovining yetmish qismidan bir qismidir. Shunda: “Yo Rasululloh, mana shu olov yetarli bo‘lardi”, deyildi. U zot: «Unga undan oltmish to‘qqiz qism kuchliroq berilgan, har bir qismi uning issiqligidekdir», dedilar.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Kim Ogohlantiriladi?",
    summary: "Qur'on va Sunnatdagi toifalar - shaxslar ustidan hukm emas.",
    body: [
      "Qur'onni sinchiklab o'qigan kishi, uning ogohlantirishlari ismli shaxslarga emas, balki xatti-harakatlar va xulq-atvorga qaratilganligini payqaydi. Haq ularga ayon bo‘lgandan keyin kufrda davom etayotganlarni, iymonni botinda inkor etib, zohirda iymon keltiruvchi munofiqlarni, birovning haqqini oyoq osti qiluvchi zolimlarni, bo‘ysunishda mag‘rur kimsalarni va katta gunoh evaziga tavba qilmay vafot etganlarni ogohlantiradi.",
      "Shaxslarga emas, balki toifalarga e'tibor berish qasddan va rahmdildir. Qaytish eshigi har bir tirik odam uchun, o'tmishi qanday bo'lishidan qat'i nazar, ochiq qoladi, chunki hech kimning fayli o'limgacha yopilmaydi. Ogohlantirish yo'lni ta'riflaydi, shuning uchun u erda yurgan har bir kishi chiqib ketishi mumkin.",
      "Shuning uchun ham Islom dini biror bir shaxsning oxirat taqdirini e'lon qilishga, ya'ni \"bu odam do'zaxdadir\" deyishimizga ruxsat bermaydi - faqat Alloh yoki Rasuli sollallohu alayhi vasallam buni sahih vahiyda aniq bayon qilgan hollar bundan mustasno. Qalblar va oxiratlarni hukm qilish faqat Allohnikidir. bizning vazifamiz o'zimizning hisobimiz.",
      "Demak, har bir ogohlantirishni o'qishning to'g'ri yo'li uni ichkariga aylantirishdir: \"bu kimni tasvirlaydi?\" lekin \"bularning birortasi meni tasvirlaydimi va men bugun nimani o'zgartiraman?\" Siz kim bo'lishingizdan qat'iy nazar, Allohga qaytishga da'vat hozirda ochiq - va ertaga hech kimga va'da qilinmagan.",
    ],
    quran: [
      {
        excerpt: "Munofiqlar do'zaxning eng past tubidadirlar.",
      },
      {
        excerpt:
          "Kimki gunoh ish qilsa va uni o'rab olgan bo'lsa, ana o'shalar do'zax egalari bo'lib, abadiy qolurlar.",
      },
      {
        excerpt:
          "Allohni zolimlar qilayotgan amallardan g'ofil deb o'ylamang. U ularni faqat ko'zlar tikiladigan kunga kechiktiradi.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Katta gunohlar",
    summary: "Kaboir — xolis tavbani talab qiladigan katta gunohlar.",
    body: [
      "Olimlar gunohlarni ikki toifaga bo‘lishadi va farqni tushunish ham jiddiylik, ham yengillik keltiradi. Katta gunohlar (al-kabo'ir) Alloh yoki Uning Rasuli sollallohu alayhi vasallamning do'zax tahdidi, la'nat, Allohning g'azabi yoki jazosi tayinlangan shirk, qotillik va foizni iste'mol qilish kabi qattiq oqibatlarga bog'laganlaridir. Kichik gunohlar (as-sag'iyr) bu ostonaga yetmagan kichikroq sirg'alardir.",
      "Yengillik bu ikkisining munosabatiga bog'liq. Alloh taolo mo‘min katta gunohlardan saqlansa, kichiklari oddiy ibodatlar bilan o‘chirilishini va’da qiladi: “Agar sizlarga man etilgan katta gunohlardan saqlansangiz, kichik gunohlaringizni ketkazamiz” (4:31). Namozgacha namoz, juma bilan juma va ramazondan ramazon o'rtasida bo'lgan narsalarni kafforat qiladi, toki katta gunohlardan saqlansa.",
      "Shuning uchun ham katta gunohlar diqqat markazida bo'lishga arziydi: ular kundalik ibodatlar oqimida shunchaki yuvilmaydi, balki qasddan, samimiy tavbaga (tavbaga) chaqiradi. Orqaga qaytmasdan turib, ular ruhni xavf ostiga qo'yadi; tark qilingan va tavba qilganlar, ular kechiriladi.",
      "Va buning hammasi ustidan ufq bor: faqat shirk bilan o'lish bundan mustasno, har bir katta yoki kichik gunoh, agar xohlasa, Allohning mag'firatiga tushadi. «Albatta, Alloh O'ziga shirk qo'shishni kechirmas, balki undan ozroq narsani O'zi xohlagan kishi uchun kechirur» (4:48). Hech bir mo'min o'zlarining katta gunohlari ularni rahm-shafqatdan tashqarida qoldiradi, degan xulosaga kelmasligi kerak.",
      "Ushbu moduldagi har bir katta gunoh mavzusi o'zining ta'rifini, dalillarini, nima uchun jiddiy ekanligini va tavba qilish va qochishning aniq yo'lini beradi - har doim o'sha ochiq eshikda tugaydi.",
    ],
    quran: [
      {
        excerpt:
          "Agar man qilingan katta gunohlardan saqlansangiz, kichik gunohlaringizni ketkazamiz va sizni ulug‘ dargohga kiritamiz.",
      },
      {
        excerpt:
          "Albatta, Alloh O'ziga shirk qo'shishni kechirmas, balki undan ozroq narsani O'zi xohlagan kishi uchun kechirur.",
      },
      {
        excerpt:
          "Katta gunohlardan va fahsh ishlardan saqlanuvchilar, faqat kichik gunohlardan saqlansalar, albatta, Robbing mag'firat qiluvchidir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Katta gunohlarning eng kattalari: Allohga shirk keltirish, jon o‘ldirish, ota-onaga osiylik, yolg‘on guvohlik berishdir.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tilning gunohlari",
    summary: "G'iybat, yolg'on, masxara qilish - qilish oson va qaytarish qiyin bo'lgan gunohlar.",
    body: [
      "Til kichik, ammo uning oqibatlari juda katta; bir necha so'z bilan odam ishonchni mustahkamlashi yoki obro'sini yo'q qilishi, yurakni yupatishi yoki uni chuqur jarohatlashi mumkin. Shuning uchun ham Qur'on va Sunnat ko'pincha so'z gunohlariga qaytadi: g'iybat (g'iybat), tuhmat (buhton), ertak ko'rsatish (namima), yolg'on gapirish, masxara qilish va yolg'on qasamlar.",
      "G'iybat degani, akangiz yoki opa-singilingiz haqida, garchi bu haqiqat bo'lsa ham, ular yoqtirmaydigan narsani zikr qilish demakdir, chunki agar u yolg'on bo'lsa, bu tuhmatning eng katta gunohi bo'lar edi. Qur'on unga o'zining eng ajoyib suratlaridan birini beradi: uni o'lgan birodarining go'shtini yeyishga o'xshatadi (49:12). Shu tarzda tuzilgan gunoh o'zining tasodifiyligini yo'qotadi.",
      "Bu gunohlarni shunchalik xavfli qiladigan narsa ularning qanchalik oson va odatiy ekanligidir. Odamlar o'ylab o'tirmasdan oddiy suhbatga kirishib ketadilar, shuning uchun ham Payg'ambar sollallohu alayhi vasallam iymonni saqlovchi so'z bilan bog'laganlar: \"Kim Allohga va oxirat kuniga iymon keltirsa, yaxshi gapirsin yoki jim tursin\". Gapirishdan oldin oddiy pauza haqiqiy ibodatdir.",
      "Tilning gunohidan tavba qilish odatiy shartlarga amal qiladi - to'xtash, pushaymon bo'lish, qaytmaslikka qaror qilish - boshqa birovning huquqi ishtirok etganda qo'shimcha o'lchov bilan. Agar ularning nomini tozalash yoki kechirim so'rash kattaroq zarar keltirmasdan amalga oshirilishi mumkin bo'lsa, bu tavbaning bir qismidir; Ularni xabardor qilish jarohatni yanada chuqurlashtirgan bo'lsa, ulamolar ular haqida yaxshi gapirishni, ular yo'qligida ularni himoya qilishni va mag'firat so'rashni maslahat berishadi.",
    ],
    quran: [
      {
        excerpt:
          "Bir-biringizni g'iybat qilmang. Sizlardan biringiz o'lgan birodarining go'shtini eyishni xohlaydimi?",
      },
      {
        excerpt: "Har bir masxara qiluvchi va masxara qiluvchining holiga voy!",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim Allohga va oxirat kuniga iymon keltirgan bo'lsa, yaxshi gapirsin yoki jim tursin.",
      },
    ],
    actions: [
      "Gapirishdan oldin so'rang: bu haqiqatmi? Bu kerakmi? Bu mehribonmi?",
      "Agar kimnidir g'iybat qilsangiz, u uchun duo qiling va imkoni boricha mag'firat so'rang.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Boshqalarga qarshi gunohlar",
    summary:
      "Odamlarning haq-huquqlari faqat Allohga tavba qilish emas, balki qayta tiklashni talab qiladi.",
    body: [
      "Islom biz haqlarimizni ikkiga bo'ladi: Allohning haqlari (huquq Alloh) va odamlarning haqlari (huquq al-ibad). Zulm, zulm, omonatni buzish, savdo-sotiqda xiyonat qilish, maoshni ushlab qolish, to'lanmagan qarzlar, qarindosh-urug'larni uzish - bularning barchasi oxiratda alohida jiddiylik kasb etadi.",
      "Sababi hushyor hadisda ko'rsatilgan. Rasululloh sollallohu alayhi vasallam chinakam muflisni qiyomat kuniga namoz, ro‘za va sadaqa bilan yetib kelgan, lekin haqorat qilgan, tuhmat qilgan, nohaq mol olib, qon to‘kgan kishi deb ta’riflaganlar. Qurbonlariga qilgan yaxshiliklari tugagunicha ajr beriladi, so‘ngra gunohlari uning zimmasiga yuklanadi va u do‘zaxga tashlanadi (Sahih Musulmon 2581). Inson ibodatda boy bo'lishi mumkin va boshqalarga qanday munosabatda bo'lganligi tufayli baribir halok bo'lishi mumkin.",
      "Bu tavba haqida muhim saboq beradi: Allohga murojaat qilish zarur, lekin inson huquqi buzilganida, bu o'z-o'zidan etarli emas. Zulm qilingan kishining da'vosi hal qilinmaguncha yoki kechirilmaguncha qoladi. Bu erda tavba qilish to'xtash, pushaymon bo'lish va hal qilishdan tashqari to'rtinchi shartga ega - qarzni qaytarish.",
      "Amalda bu olingan narsani yoki uning qiymatini qaytarish, qarzlarni asta-sekinlik bilan to'lash, buzilgan obro'ni tiklash va uzilgan qarindoshlar bilan yarashishni anglatadi. Bunda ham rahm-shafqat bor: to'lovning har bir qadami o'z-o'zidan savobdir va Alloh singan narsani tuzatishga kirishgan ixlos qalbini yengillashtiradi.",
    ],
    quran: [
      {
        excerpt:
          "Agar riboni to'xtatmasangiz, Alloh va Uning Rasuli tomonidan bo'lgan urushni biling.",
      },
      {
        excerpt: "Allohning ahdini buzganlar va U buyurgan narsani buzadiganlar qo'shildilar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bankrot kimligini bilasizmi? Namoz, ro'za va sadaqa bilan kelgan, lekin haqorat qilgan, tuhmat qilgan, mol-mulkini harom iste'mol qilgan va qon to'kgan kishining yaxshiliklari boshqalarga beriladi.",
      },
    ],
    actions: [
      "Xato qilgan bo'lishingiz mumkin bo'lgan har bir kishining ro'yxatini tuzing va bu hafta tuzatishga qadam qo'ying.",
      "To'lanmagan qarzlarni hatto kichik bo'lib to'lang, agar bu sizning boshqarishingiz mumkin bo'lsa.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ikkiyuzlamachilik",
    summary:
      "E'tiqoddagi asosiy ikkiyuzlamachilik - va xulq-atvordagi ikkiyuzlamachilik xususiyatlari.",
    body: [
      "Olimlar riyokorlikning ikki turini ajratib ko‘rsatadilar va ularni bir-biridan ajratib turish yolg‘on tasallini ham, yolg‘on vahima qo‘yishni ham oldini oladi. Birinchisi, iymonning katta munofiqligi (nifaq e'tiqodi): Islomni zohirda ko'rsatish, botinda esa iymonni inkor etish. Bu Qur'on eng qattiq ogohlantirgan ikkiyuzlamachilikdir, bunday odamlarni \"do'zaxning eng tubiga\" qo'yadi (4:145), chunki ular aslida niqob ostida kofir bo'lib vafot etganlar.",
      "Ikkinchisi kichikroq, xulq-atvori munofiqligi (nifaq amali): hatto iymoni haqiqiy bo'lgan odamda ham munofiqlarning xulq-atvoriga o'xshab ketadigan xislatlar. Rasululloh sollallohu alayhi vasallam mashhur oyatlarni nomladilar: “Qachon gapirsa yolg‘on gapiradi, va’da qilsa vafo qiladi, omonat berilsa xiyonat qiladi” va boshqa bir rivoyatda ixtilofdagi fasodni qo‘shgan. Mo'min bularga tushib qolishi va hali ham imonli bo'lishi mumkin, ammo ular ehtiyot bo'lish uchun jiddiy ogohlantirishdir.",
      "Bu farq mavzudan qanday foydalanishimiz uchun juda muhimdir. Xulq-atvor belgilari boshqalarga yopishtirish uchun emas, balki o'zi uchun ko'zgu sifatida beriladi. Rasululloh sollallohu alayhi vasallam va uning sahobalari o'zlarida munofiqlikdan qo'rqdilar, chunki qalb yashirin va o'zgarishi mumkin.",
      "Demak, sog'lom javob botiniydir: o'z rostini, va'dasiga sodiqligini, ishonchliligini tekshirish va Allohdan ixlos so'rash. Insonning ichida nima borligini faqat Olloh biladi va aniq shaxslarni munofiqlikda ayblashning o'zi ularga nisbatan katta gunohdir.",
    ],
    quran: [
      {
        excerpt: "Munofiqlar do'zaxning eng past tubidadirlar.",
      },
      {
        excerpt:
          "Qachonki, munofiqlar huzuringizga kelsalar: «Guvohlik beramizki, sen Allohning payg‘ambarisan, Alloh ularning yolg‘onchi ekanini biladi», derlar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Munofiqning alomati uchtadir: gapirsa yolg'on gapiradi, va'da qilsa vafo qiladi va omonat berilsa xiyonat qiladi.",
      },
    ],
    disclaimer:
      "Odamlarni nifoqda ayblamang. Matnlar jamiyatni ogohlantiradi; poklanish o'zidan boshlanadi.",
  },
  {
    title: "Qayd etilgan jazolar",
    summary: "Matnlarda tasvirlangan narsa - Allohdan qo'rqib, Uning rahmatiga umid qilib o'qing.",
    body: [
      "Qur'on va Sunnatda riboni yeydiganlar, pokiza ayollarga tuhmat qilganlar, mol-dunyo yig'ib, haqini to'xtatadiganlar, namozni tark etganlar va katta gunohda davom etadiganlar uchun aniq oqibatlar keltiriladi. O'ziga xoslik aniqlik shaklidir: bu hech kimga ular qilayotgan ishi haqida ogohlantirilmaganligini aytishga qodir emas.",
      'Bu oqibatlarning ba\'zilari qabrda (adhab al-qabr), boshqalari esa "Jahannam"ning o\'zida tasvirlangan. Asosiy sunniy aqida ikkalasining ham haqiqatini tasdiqlaydi, shu bilan birga bu g\'ayb masalalarning aniq "qanday"ligini inson tasavvuriga emas, balki Allohning ilmiga ishonib topshiradi.',
      "Mo'minning bularning barchasiga qanday munosabatda bo'lishi muhim. Maqsad hech qachon grafik tafsilotlarga e'tibor bermaslik yoki yurakni cho'ktirishga yo'l qo'ymaslik; bu ogohlantirishni qabul qilish, tegishli bo'lgan narsalardan tavba qilish va keyin energiyani haqiqatda himoya qiladigan ishlarga aylantirishdir. Shuning uchun bu modul qasddan jazodan ko'ra himoya, tavba va rahm-shafqatga ko'proq joy beradi.",
      "Muxtasar qilib aytganda, aytilgan har qanday jazodan to'g'ri olib tashlash qo'rquv emas, balki savoldir: \"Men buni qilyapmanmi - va agar shunday bo'lsa, qanday qilib to'xtatib, uni to'g'rilashim kerak?\" Bugun halol javob berdi, ogohlantirish allaqachon o'zining rahm-shafqatli ishini qildi.",
    ],
    quran: [
      {
        excerpt:
          "Pokiza ayollarni ayblab, to'rtta guvoh keltirmaganlarni sakson tayoq bilan uringlar.",
      },
      {
        excerpt:
          "Oltin-kumush jamg'argan va ularni Alloh yo'lida sarf qilmaganlarga alamli azob bilan xushxabar ber.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Do'zaxdan himoya",
    summary: "Tavhid, namoz, tavba, sadaqa, Qur'on va duo - bu modulning yuragi.",
    body: [
      "Barcha ogohlantirishlardan so‘ng, masalaning mohiyati shu: Jahonnam insonni himoya qilish uchun mo‘ljallangan narsadir va Islom bu himoya vositalariga to‘la. Ulardan eng ulug'i, Allohdan o'zga hech narsa bo'lmagan holda yolg'iz Allohga ibodat qilishdir. Boshqa har bir amal mana shu asos bilan qabul qilinadi va tarozida tortiladi, shuning uchun ham iymonni saqlash hamma narsadan ustundir.",
      "Bu asosda amaliy qalqonlar juda ko'p va qo'l keladi: besh vaqt namozni o'qish, ixlos tavba qilish, sadaqa berish - Payg'ambarimiz sollallohu alayhi vasallam aytganlaridek, suv olovni o'chirganidek gunohni o'chiradi - ro'za tutish, Qur'on tilovat qilish va unga amal qilish, yaxshi xulq-atvor, boshqalarga rahm-shafqat, doimiy zikr (zikr) ko'rish va doimiy ziroat. Bularning hech biri katta boylik yoki bilim talab qilmaydi; ular hamma uchun ochiq.",
      "Rasululloh sollallohu alayhi vasallam do'zaxdan panoh so'rash uchun to'g'ridan-to'g'ri duo qilishni ham o'rgatganlar va bizni tez-tez so'rashga undaganlar. Kim Allohdan uch marta jannat so‘rasa, jannatning o‘zi uning kirishi uchun duo qiladi, kim uch marta do‘zaxdan panoh so‘rasa, do‘zaxning o‘zi undan saqlansin deb duo qiladi, dedilar (Jomi' at-Termiziy 2572). Bu duolar namozda salom berishdan oldin, ertalab va kechqurun azizlarida alohida o'rin tutadi.",
      "Shariat ta'sir qiladigan muvozanatga e'tibor bering. Himoya vositalari halokat sabablaridan ko'ra ko'p, ta'kidlangan va erishish mumkin - va buning o'zi ham Allohning rahmatidan dalolatdir. Yo'qolib ketishdan ko'ra najot topish osonroq.",
      "Ushbu bo'lim qasddan modulning eng katta qismidir, chunki Islomning o'zi bu masalani shunday tarozida ko'radi: ogohlantirish har doim umid bilan bog'langan va hech qachon aniq harakatlardan ajratilmagan odam bugun boshlashi mumkin.",
    ],
    quran: [
      {
        excerpt:
          "«Ey Robbimiz, iymon keltirdik, bizni gunohlarimizni mag‘firat qil va bizni do‘zax azobidan saqlagin», deganlar.",
      },
      {
        excerpt:
          "Ey Robbimiz, bizga bu dunyoda ham, oxiratda ham yaxshilik ato et va bizni do'zax azobidan saqla.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim Allohdan uch marta jannat so‘rasa, jannat: Allohim, uni jannatga kiritgin, deydi. Kim uch marta do'zaxdan panoh so'rasa, do'zax aytadi: Allohim, uni do'zaxdan saqla.",
      },
    ],
    actions: [
      "Namozda salom berishdan oldin jahannamdan panoh tilagan duoni yod oling.",
      "Besh vaqt namozni o'z vaqtida o'qing - eng kuchli qalqonlardan.",
      "Doimiy ravishda, hatto kichik miqdorda ham sadaqa bering.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Tavba (tavba)",
    summary:
      "Alloh chin dildan tavbani qabul qiladi - o'limdan oldin hech qanday gunoh katta emas.",
    body: [
      "Tavba - tavba - Alloh taolo dinga hech qanday gunoh doimiy bo'lmasligi uchun o'rnatgan mexanizmdir. Uning zamirida qalbning Allohga burilishi yotadi va ulamolar uning shartlarini Qur'on va Sunnatdan olishadi: gunohni sidqidildan to'xtating, unga chin afsusda bo'ling va hech qachon qaytmaslikka qat'iy qaror qildingiz. Agar gunoh boshqa shaxsning huquqiga tegishli bo'lsa, to'rtinchi shart qo'shiladi - bu huquqni tiklash yoki kechirim so'rash.",
      "Tavbani bunchalik umidvor qiladigan narsa Alloh taolo uni qabul qilishidir. U faqat qaytib kelgan xizmatkorga toqat qilmaydi; U quvonadi. Rasululloh sollallohu alayhi vasallam aytdilarki, Alloh taolo bandasining tavbasidan tog‘ini butun rizq-ro‘zligi bilan bepoyon sahroda yo‘qotib qo‘yib, to‘satdan uning oldida turganini ko‘rgan odamdan ham xursandroqdir (Sahih al-Buxoriy 6309). Bu ortga qaytgan har bir kishini kutib turgan marhamatdir.",
      "Bundan tashqari, uning eshigi umr bo'yi hech qachon yopilmaydi. Rasululloh sollallohu alayhi vasallam aytdilarki, Alloh taolo kunduzgi gunohkorning tavbasini qabul qilish uchun kechasi qoʻlini choʻzadi va kechasi gunohkorning tavbasini qabul qilish uchun kunduzi qoʻlini choʻzadi (Sahih Musulmon 2759). Tavba, o'limda ruhi tomoqqa yetguncha va insoniyat uchun quyosh g'arbdan chiqmaguncha qabul qilinadi - shuning uchun uni kechiktirishga hech qachon sabab yo'q.",
      "Bu hatto ko'p marta yiqilgan va tavba qilgan kishi uchun ham amal qiladi. Qaytish har safar ixlos bilan bo'lsa, Alloh qabul qiladi. noumidlik dindan emas, shaytondandir. O'limdan oldin hal qilinishi kerak bo'lgan yagona narsa shirkdir, chunki u bilan o'lgan kishi tavba talab qiladigan iymonsiz vafot etadi - aynan shuning uchun ham faqat Allohga to'liq tavba qilish barchaning eng shoshilinch qaytishidir.",
      "Amaliy yo'l oddiy: hozir tavba qiling, tez-tez tavba qiling va hech qachon gunohning kattaligi yoki o'tganlar sonining kamayib ketishiga qaytib kelishingiz haqida bahslashmasin. Taklif har doim ochiq.",
    ],
    quran: [
      {
        excerpt:
          "Allohning rahmatidan noumid bo'lmang. Albatta, Alloh barcha gunohlarni kechiradi. U mag'firatli va rahmli zotdir.",
      },
      {
        excerpt:
          "Magar tavba qilgan, iymon keltirgan va solih amallarni qilganlarning yomonliklarini Alloh yaxshilikka almashtiradi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Alloh taolo bandasining tavbasidan sizlardan biringiz adashgan tog'ini taqir yerdan topib olgandan ko'ra ko'proq rozi bo'ladi.",
      },
      {
        excerpt:
          "Alloh taolo kunduzgi gunohkorning tavbasini qabul qilish uchun kechasi qoʻlini choʻzadi va kechasi gunohkorning tavbasini qabul qilish uchun kunduzi qoʻlini choʻzadi, to quyosh gʻarbdan chiqqunga qadar.",
      },
    ],
    actions: [
      "Kun bo'yi Astag'firullohni ayting - nafaqat katta sliplardan keyin ham mustahkamlikka intiling.",
      "Sayyid al-Istig'forni o'rganing va ertalab va kechqurun o'qing.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Allohning rahmatidan umid qiling",
    summary:
      "Hech qachon umidsizlikka tushmang - yaxshi ishlar gunohlarni o'chiradi; izchillik muhim ahamiyatga ega.",
    body: [
      "Ushbu moduldagi hamma narsa shu yerga ishora qiladi. Alloh taolo ar-Rahmon ar-Rohim, rahmdildir va U bizga Uning rahmati g'azabidan ustun ekanligini va \"hamma narsani qamrab olgan\"ligini aytdi (7:156). Mo'min qushning ikki qanoti kabi umid va qo'rquv o'rtasida yashashga mo'ljallangan: hushyor turish uchun gunohdan qo'rqish, hech qachon taslim bo'lmaslik uchun kechirimga umid qilish.",
      "Shu sababli, umidsizlikning o'zi yo'q. Inson qanchalik adashganini his qilmasin, orqa eshik ochiq va kech bo'lganini Alloh emas, shayton pichirlaydi. Rahmatdan noumid bo‘lish, Rahmonni kam o‘ylashdir; samimiy yurakning ishi shunchaki qaytishdir.",
      "Bu erda sunniylarning olov haqidagi e'tiqodining katta tasalli yotadi. Kufr bilan vafot etganlar uchun jahannam boqiydir. Ammo yolg'iz Allohni tasdiqlagan holda vafot etgan mo'min, garchi katta gunohlari og'ir bo'lsa ham, unda abadiy qolmaydi. Rasululloh sollallohu alayhi vasallam odamlar do'zaxdan shafoat bilan chiqariladi, so'ngra Allohning rahmati bilan - jannatning chetidagi Hayot daryosiga tashlanadi, u erda qayta tiklanadi va unga kiradi, deb o'rgatganlar (Sahih al-Buxoriy 7439). Qalbida xantal urug‘idek iymon bo‘lgan hech kim do‘zaxda qolmaydi, dedilar (Sahih Musulmon 183). Shuning uchun monoteist uchun olov - agar u umuman kiritilgan bo'lsa - hech qachon hikoyaning oxiri bo'lmaydi.",
      "Shu bilan birga, mehr-oqibat kundalik hayotga o'rnatiladi: yaxshi amallar yomonlarni yo'q qiladi (11:114), kichik, izchil ibodat - o'z vaqtida o'qilgan namoz, bir sokin sadaqa, Alloh uchun qilingan bir lahzalik sabr - insonni doimiy ravishda Unga yaqinlashtiradi va yomonlikdan uzoqlashtiradi. Mustahkamlik intensivlikdan ko'ra muhimroqdir.",
      "Shunday qilib, bu sizning tadqiqotingizning xulosasi bo'lsin: ogohlantirishni jiddiy qabul qiling, ammo umid qo'rquvdan ko'ra balandroq bo'lsin. Xavfni bil, rahm-shafqat yo'lini tanla va u bilan qadamma-qadam yurib, har kuni Allohga duch kelguningizcha.",
    ],
    quran: [
      {
        excerpt: "Mening rahmatim hamma narsani qamrab olgan.",
      },
      {
        excerpt:
          "Ayting: Ey o'zlariga zulm qilgan bandalarim, Allohning rahmatidan noumid bo'lmanglar. Albatta, Alloh barcha gunohlarni kechiradi.",
      },
      {
        excerpt:
          "Darhaqiqat, yaxshi amallar yomonliklarni ketkazadi. Bu eslovchilar uchun eslatmadir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Alloh taolo aytadi: Farishtalar shafoat qildilar, payg‘ambarlar shafoat qildilar, mo‘minlar shafoat qildilar, faqat rahmlilarning rahmli zoti qolur. U do'zaxdan bir hovuch olib, yaxshilik qilmagan qavmlarni chiqaradi.",
      },
      {
        excerpt: "Kimning qalbida xantal donidek iymon bo'lsa, do'zaxdan chiqariladi.",
      },
    ],
    actions: [
      "Har bir kunni istig'for va har bir ne'matga shukr bilan yakunla.",
      "Ushbu modulni Jannatga sayohat - ogohlantirish va umid bilan bog'lang.",
    ],
    appLinks: [{}, {}, {}],
  },
];

export const JAHANNAM_MAJOR_SIN_TOPICS_UZ: DeepPartial<JahannamTopic>[] = [
  {
    title: "Shirk",
    summary: "Allohga shirk keltirish - bitta gunoh, agar u tufayli o'lsa, kechirilmaydi.",
    body: [
      "Ta'rif: Shirk - Allohga shirk qo'shish - yolg'iz Unga tegishli bo'lgan har qanday amalni (ibodat, to'liq muhabbat, qo'rquv, umid, tavakkal yoki qonun chiqarish huquqi) Undan o'zga narsaga yoki kimgadir yo'naltirishdir. Bu tavhidning mutlaqo teskarisi bo'lib, u maxluqotning bor maqsadini ko'rsatadi: yolg'iz Allohga ibodat qilish.",
      "Nima uchun bu barcha gunohlarning eng og'iridir: boshqa har qanday gunoh haqiqiy Rabbiyni tan olgan holda qilingan noto'g'ridir, lekin shirk to'g'ridan-to'g'ri Unga qarshi qilingan noto'g'ri ish bo'lib, yaratilishni Yaratgan deb adashtiradi. Shuning uchun Qur’on buni “katta zulm” deb ataydi (31:13). U tavba qilmay vafot etsa, kechirilmaydigan yagona gunohdir: «Albatta, Alloh O'ziga shirk qo'shishni kechirmas, balki undan ozroq narsani O'zi xohlagan kishi uchun kechirur» (4:48). Bu shiddatlilik ichida ham yashirin rahm-shafqat shundan iboratki, shirkdan boshqa hamma narsa Allohning mag'firati ostida qoladi.",
      "Uning shakllari: olimlar katta shirkni ajratadilar - butlarga, o'liklarga, avliyolarga yoki yaratilgan narsalarga sig'inish; Allohdan o'zgani faqat U beradigan narsaga duo qilish; va qurbonlik yoki nazrni Undan boshqasiga yo'naltirish - tavba qilmasa, insonni Islomdan tashqariga olib chiqadi. Ibodatda (riyoda) koʻz-koʻz qilish, Allohdan oʻzga nomiga qasam ichish, afsun va afsunga tayanish kabi kichikroq va yashirin shirk ham borki, bu ogʻir gunoh boʻlsa-da, lekin oʻz-oʻzidan dindan chiqarib yubormaydi.",
      "Undan uzoqlashuvchi yo'l: tavhidni o'rganish, yolg'iz Allohga ibodat qilish va niyatlarni poklash bilan qo'riqlang va mustahkamlang, toki amallar odamlarning ko'ziga emas, U uchun bo'lsin. Kim shirkga kirgan bo'lsa, uni chin dildan tark etib, yolg'iz Allohning ibodatiga qaytsa, tavba qiladi va u qaytish eshigi umri davomida ochiq qoladi.",
    ],
    quran: [
      {
        excerpt:
          "Albatta, Alloh O'ziga shirk qo'shishni kechirmas, balki undan ozroq narsani O'zi xohlagan kishi uchun kechirur.",
      },
      {
        excerpt:
          "Ey o'g'lim, Allohga hech narsani sherik qilma. Darhaqiqat, ittifoq qilish katta gunohdir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Katta gunohlarning eng kattalari: Allohga shirk keltirish, jon o‘ldirish, ota-onaga osiylik, yolg‘on guvohlik berishdir.",
      },
    ],
    actions: [
      "Aqida va Allohning 99 ismini o'rganing orqali tavhidni o'rganing.",
      "Ibodatda niyatlarni poklash - har kuni Allohdan ixlos so'rang.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qotillik",
    summary: "Noqonuniy ravishda begunoh hayotni olish - eng og'ir qonunbuzarliklardan.",
    body: [
      "Ta'rif: Bu yerda qotillik Alloh taolo muqaddas qilgan jonni noqonuniy, qasddan o'ldirishni anglatadi. Islom qonuniy ishlarni, masalan, tegishli hokimiyat tomonidan amalga oshiriladigan qonuniy qisalarni (qonuniy qasos) tan oladi, ammo begunoh qalbni adolatsiz o'ldirish eng og'ir jinoyatlardan biridir.",
      "Nega bunchalik og‘ir: Qur’oni karim birgina nohaq o‘ldirishni butun insoniyat tarozida tortadi: “Kim bir jonni o‘ldirsa... go‘yo butun insoniyatni o‘ldirgandek bo‘ladi” (5:32), chunki bir jonni yo‘q qilish har bir jonni himoya qiluvchi muqaddaslikni buzishdir. Odam alayhissalom farzandlari o‘rtasida sodir etilgan birinchi gunoh qotillik bo‘lib, unga vahiy oxiratni buzuvchi sifatida qayta-qayta qaytadi.",
      "Ikki tomonlama xato: qotillik bir vaqtning o'zida hayotning muqaddasligi ustidan huquqlari toptalgan Allohga qarshi gunoh va odamlarga - qurbonga va ular qoldirganlarga qarshi gunohdir. Shuning uchun ham uning tavbasi ko‘pchilikdan og‘irroqdir: Allohga tavba qilish zarur, ammo zulm qilganning haqqi ham o‘rinli bo‘ladi va agar davlat qonuni yoki Islom shariati qon puli (diyah) yoki boshqa oqibatlarni belgilab qo‘ygan bo‘lsa, bularni to‘g‘ri yo‘llar va malakali ulamolar orqali hal qilish kerak.",
      "Undan uzoqlashadigan yo'l: har bir hayotni muqaddas tuting, g'azab va adovatni ular qattiqlashishidan oldin yo'q qiling va nizolarni zo'ravonlik bilan emas, balki sabr va adolat bilan hal qiling. Odamlarga qilingan bu eng katta jinoyat ham chin dildan tavba qilgan, imkoni boricha haqlarini bo'shatgan va hech qachon bunday yo'lga qaytmagan kishi uchun Allohning rahmatidan tashqarida emas.",
    ],
    quran: [
      {
        excerpt:
          "Kim bir jonni jon uchun yoki er yuzida buzg'unchilik uchun o'ldirsa, go'yo barcha odamlarni o'ldirgandek bo'ladi.",
      },
      {
        excerpt:
          "Kim bir mo‘minni qasddan o‘ldirsa, uning jazosi jahannam bo‘lib, unda abadiy qolur.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Katta gunohlarning eng kattalari: Allohga shirk keltirish, jon o‘ldirish, ota-onaga osiylik, yolg‘on guvohlik berishdir.",
      },
    ],
    actions: ["Har bir hayotni qadrlang; nizolarni sabr va adolat bilan hal qiling."],
    appLinks: [{}],
  },
  {
    title: "Zina",
    summary: "Noqonuniy jinsiy aloqa - bu ruh va jamiyatga qarshi halokatli gunoh.",
    body: [
      "Ta'rif: Zina - bu haqiqiy nikohdan tashqari har qanday noqonuniy jinsiy aloqa bo'lib, zinoni (turmushga chiqmaganlar o'rtasidagi) va zinoni (turmushdagi kishi ishtirokida) qamrab oladi. Islom buni shaxsiy masala sifatida emas, balki keng ziyon keltiradigan qonunbuzarlik sifatida ko'radi.",
      "Nima uchun bu og'ir: zino sog'lom jamiyat quradigan narsalarni - nasl-nasabni, er-xotin o'rtasidagi ishonchni, farzandlar xavfsizligini va insonni ulug'laydigan iffatni buzadi. Qur'on ta'rifining o'zi ibratlidir: u amalni faqat man etmaydi, balki unga \"yaqinlashmang\" (17:32), unga qarash, shaxsiy hayot va unga olib boradigan qadamlardan ogohlantiradi. Yondashuvni taqiqlash rahm-shafqatdir, chunki u vasvasa kuchayib ketishidan oldin insonni himoya qiladi.",
      "To'siqlardagi hikmat: islom odamlarni nafsga qarshi kurashga qo'yib yuborishdan ko'ra, ularni oldingi himoya bilan o'rab oladi - ko'zni pastga tushirish, kiyim va xulq-atvorda uyatchanlik, qarama-qarshi jins bilan yolg'iz qolishdan qochish va nikohni bu ehtiyojlar uchun qonuniy, hurmatli kanal sifatida rag'batlantirish. Ushbu chegaralarni oldindan qurish chekkada qarshilik ko'rsatishdan ko'ra osonroqdir.",
      "Orqaga yo'l: yiqilgan har bir kishi uchun chiqish yo'li xolis tavba - gunohni butunlay tark etish, pushaymon bo'lish, qaytmaslikka qaror qilish va o'tmishini oshkor qilishdan ko'ra yashirishdir. Zino katta gunohdir, lekin Alloh taolo tavba qilgan kishini mag'firat qiladigan zotlardandir. umidsizlikka joy yo'q va har doim yangi boshlanish mavjud.",
    ],
    quran: [
      {
        excerpt: "Noqonuniy jinsiy aloqaga yaqinlashmang. Albatta, u fahsh va yomon yo'ldir.",
      },
      {
        excerpt:
          "Jinsiy aloqa qilmaganlar esa... tavba qilib, iymon keltirgan va solih amallarni qilganlardan boshqasi, Alloh ularning yomonliklarini yaxshilik bilan almashtirur.",
      },
    ],
    actions: [
      "Ko'zlarni va ijtimoiy media iste'molini saqlang.",
      "Agar nikohsiz bo'lsa, solih turmush o'rtog'i uchun duo qiling.",
    ],
    appLinks: [{}],
  },
  {
    title: "Riba",
    summary: "Foiz va sudxo'rlik - Qur'onda uning amaldorlariga qarshi e'lon qilingan urush.",
    body: [
      "Ta'rif: Ribo - bu ma'lum moliyaviy operatsiyalarning noqonuniy ravishda ko'payishi - eng mashhur kreditlar bo'yicha olinadigan yoki to'langan foizlar, shu bilan birga o'xshash tovarlarning o'ziga xos teng bo'lmagan yoki kechiktirilgan almashinuvini ham o'z ichiga oladi. Uning mohiyati boshqa birovning hisobidan haqiqiy qiymat va xavf-xatarsiz boylikka erishishdir.",
      "Nima uchun u juda og'ir: Qur'on unga qarshi ishlatadigan tilda moliyaviy gunohlar orasida ribo yagonadir. Alloh taolo O'zi va Rasuli sollallohu alayhi vasallamdan bunda sabr qilganlarga urush e'lon qiladi (2:279) - boshqa hech qanday gunoh uchun ishlatilmaydigan ibora - chunki riba muhtojlikdan foydalanadi, boylikni ozchilikning qo'lida to'playdi va iqtisod ko'rsatishi kerak bo'lgan rahm-shafqatni bo'shatadi. Rasululloh sollallohu alayhi vasallam uni har qanday holatda ham qilmaslikdan qattiq ogohlantirdilar.",
      "Donolik va rahm-shafqat: taqiq odamlarni haqiqiy savdoga, umumiy tavakkalchilikka va xayriyaga yo'naltiradi va zaiflarni qarzga botib ketishdan himoya qiladi. Vaholanki, bu yerda ham Allohning rahmati bor: amri kelganda, u o'tgan foizlarni qaytarib olishni talab qilmadi, balki mo'minlarga faqat qolganini tark etishni buyurdi - \"o'zing asosiy qarzing bor\" (2:279) - undan yuz o'girganlar uchun osonlik.",
      "Undan uzoqlashadigan yo'l: foizlarga asoslangan mahsulotlar uchun moliyangizni tekshirib ko'ring, halol muqobillarni qidiring va musulmon bo'lmagan mamlakatlardagi ipoteka kabi chinakam qiyin ishlar bo'yicha malakali olimlar bilan maslahatlashing. Riboni tark etish qiyin moliyaviy tanlovni anglatishi mumkin, ammo qalb xavfsizligi har qanday vaqtinchalik foydadan ustundir - va Alloh taolo O'zidan qo'rqqan kishini kutmagan joydan rizqlantirishni va'da qiladi.",
    ],
    quran: [
      {
        excerpt:
          "Ey mo'minlar, agar mo'min bo'lsangiz, Allohdan qo'rqingiz va riboni tark eting. Agar shunday qilmasangiz, Alloh va Uning Rasuli tomonidan bo'ladigan urush haqida xabar bering. Agar tavba qilsang, senga zulm qilinmagan va hech qanday yomonlik qilmaysan.",
      },
      {
        excerpt: "Alloh foizni yo'q qiladi va sadaqalarni ziyoda qiladi.",
      },
    ],
    actions: [
      "Foizlarga asoslangan mahsulotlar uchun moliyaviy audit.",
      "Ipoteka va qarzlar bo'yicha malakali olim bilan maslahatlashing.",
    ],
    appLinks: [{}],
  },
  {
    title: "Yolg'on guvohlik",
    summary: "Qasam ostida yolg'on gapirish yoki yolg'on guvohlik berish - adolatni yo'q qiladi.",
    body: [
      "Ta'rif: Yolg'on guvohlik (shahodat al-zur) haqiqatga to'g'ri kelmaydigan narsaga guvohlik berish - va kengroq aytganda, qasam ichib yolg'on gapirish, ayblovlar uydirish yoki adolat bunga bog'liq bo'lsa, rost guvohlik berishdir.",
      "Nima uchun bu jiddiy: u adolatni amalga oshiradigan vositani buzadi. Bitta yolg'on guvoh begunoh odamni halokatga yuborishi, mulkining qonuniy egasini mahrum qilishi yoki zolimni ozod qilishi mumkin - shuning uchun yolg'on hech qachon yolg'onchiga sig'maydi; u haqiqiy odamlarni va adolatning butun tartibini jarohatlaydi. Rasululloh sollallohu alayhi vasallam buni katta gunohlarning eng kattasi sanab, bir rivoyatda undan ogohlantirishni shu qadar qattiqroq takrorladilarki, sahobalari u zotdan xavotirlanib, to'xtashni xohladilar.",
      "Uning til bilan aloqasi: yolg'on guvohlik - nutqning kengroq gunohlarining eng o'tkir tomoni. Chunki so‘zni aytish arzon, bu gunohga qo‘l qo‘yish xavfli darajada oson – imzo, mubolag‘a, qulay sukunat – va shunga qaramay, qiyomat kunida uning og‘irligi juda katta bo‘lib, odamlarning oyoq-qo‘llari va tili ularga qarshi haq guvohlik beradi.",
      "Undan uzoqlashadigan yo'l: qimmatga tushsa ham yoki o'z manfaatingizga zid bo'lsa ham haqiqatni mahkam tuting, har qanday yolg'onga so'z berishdan bosh torting va kerak bo'lganda adolatli guvohlik bilan gapiring. Yolg‘on guvohlik bergan kishi imkoni boricha yolg‘ondan voz kechib, zulm qilingan kimsaning zararini bartaraf etishga va haqlarini tiklashga harakat qilib, Allohga chin dildan pushaymon bo‘lib, tavba qiladi.",
    ],
    quran: [
      {
        excerpt:
          "Va yolg'onga guvohlik bermaganlar va yomon so'zlarning oldidan o'tib ketsalar, sharaf bilan o'tib ketadilar.",
      },
      {
        excerpt: "Bas, butlarning nopokligidan saqlaning va yolg'on gaplardan saqlaning.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sizlarga eng katta gunohlarning xabarini beraymi? Allohga shirk keltirish, ota-onaga itoatsizlik va yolg'on guvohlik berish va yolg'on guvohlik berish.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Sehrgarlik",
    summary: "Sehrgarlik, sehrgarlarni izlash va yashirin amaliyotlar - asosiy shakllarda kufr.",
    body: [
      "Ta'rif: Sihr (sehrgarlik yoki sehr) odamlarga yoki hodisalarga ta'sir qilish uchun taqiqlangan vositalardan foydalanish - ko'pincha shaytonlarga tayanish yoki g'ayb ustidan hokimiyatga da'vo qilishni o'z ichiga oladi. Unga amal qilish, o'rganish, boshqalardan izlash va buni da'vo qilganlarga ishonish bu gunohga kiradi.",
      "Nega bunchalik og'ir: ko'p sihrlarni shaytonlarga yaqinlashish yoki Qur'onni tahqirlash kabi kufrlarsiz bajarilmaydi, shuning uchun ham Qur'on o'z ilmini kufrga bog'laydi. Alloh taolo Sulaymon zamonida o‘rganilgan sehr haqida gapirar ekan, shaytonlar va u ikki farishta buni faqat fitna uchun o‘rgatib, “kofir bo‘lmanglar” (Baqara, 102) deb ogohlantiradi. E'tiqodiy xavfdan tashqari, sihr haqiqiy odamlarga zarar etkazadi - er-xotinlar o'rtasida bo'linishni keltirib chiqaradi, qo'rquvni tarqatadi va umidsizlarni ekspluatatsiya qiladi.",
      "Tegishli amaliyotlar: xuddi shu ogohlantirish folbinlik, munajjimlikka g'aybning ma'lum bilimi sifatida munosabatda bo'lish va shirkni olib yuruvchi tumor va jozibalarga ham tegishli. Yashirin kelajak haqidagi ilmni da'vo qilish yolg'iz Allohnikidir va uni da'vo qilganlarga murojaat qilish tavhidning ildiziga putur etkazadi.",
      "Undan uzoqlashuvchi yo'l: bu amallarga aralashgan kishi uchun tavba ularni butunlay tark etish, harom narsalarni yo'q qilish, ular bilan shug'ullanuvchilar bilan aloqani uzish, xolis tavhid va yolg'iz Allohga tavakkal qilishni yangilash demakdir. Himoya iymonda, kundalik zikrda va Allohdan panoh so'rashda topiladi va Uning mag'firati rostdan qaytgan kishi uchun ochiqdir.",
    ],
    quran: [
      {
        excerpt:
          "Ular Sulaymon davrida shaytonlar o‘qigan narsaga ergashdilar... va o‘zlariga nima foyda, nima zarar keltirishini bilib oldilar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim folbin huzuriga kelib, uning aytganiga ishonsa, Muhammadga nozil qilingan narsaga kufr keltirgan bo‘ladi.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Yetimning boyligini iste'mol qilish",
    summary: "Yetimlarning mol-mulkini nohaq tortib olish yoki isrof qilish.",
    body: [
      "Ta'rif: Bu gunoh etim bolalar - otasidan ayrilgan va o'z manfaatlarini himoya qila olmagan bolalarning mol-mulkini tortib olish, isrof qilish yoki noto'g'ri ishlatishdir. Valiy ularning mol-mulkini omonat sifatida saqlaydi, hech qachon egalik qilmaydi.",
      "Nima uchun bu og'ir: u ikkita xatoni birlashtiradi - muqaddas ishonchga xiyonat va eng himoyasizlarga zulm. Qur'onning tasviri shiddatli: yetimlarning molini nohaq iste'mol qilganlar \"qorinlariga faqat olovni iste'mol qiladilar\" (4:10), bir lahzalik ochko'zlikni o'z-o'zidan azobga aylantiradi. O'zlari uchun gapiradigan hech kimni suiiste'mol qilish adolatsizlikning eng xunuk shakllaridan biridir, shuning uchun ogohlantirish juda keskin va o'tkir va rahmdil bo'lib, qo'riqchilarni undan uzoqlashtiradi.",
      "U nimani o'z ichiga oladi: nafaqat ochiq o'g'irlik, balki nozikroq shakllar - chiziqni xiralashtirish uchun etimning mulkini o'ziniki bilan aralashtirib yuborish, etim voyaga etganida uni qaytarishni kechiktirish yoki uni investitsiya qilish yoki nohaq sarflash. Alloh taolo buning aksini buyuradi: “Yetimlarning mollarini beringlar, yomonni yaxshilikka almashtirmanglar” (4:2).",
      "Undan uzoqlashuvchi yo'l: yetimlarning molini ehtiyotkorlik bilan saqlang, ularni alohida va hisob-kitob qiling, balog'atga yetganida to'liq topshiring va kim kam bo'lsa, tavba qiling, qarzini ko'paytirib qaytaring va zulm qilinganlarning mag'firatini so'rang. Sog'lom qalbdan boshqa hech qanday boylik va nasl yordam bera olmaydigan kunda bunday omonatni tiklashning o'zi qadrli amaldir.",
    ],
    quran: [
      {
        excerpt: "Yetimlarning molini zulm bilan yeydiganlar qorinlarida faqat olovni yeydilar.",
      },
      {
        excerpt:
          "Yetimlarning mol-mulkini bering, yomonni yaxshiga almashtirmang va ularning mollarini molingiz bilan yemang.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Ota-onalarga bo'ysunmaslik",
    summary: "Uquq — shirkdan keyingi katta gunohlardan.",
    body: [
      "Ta’rif: “Uququl-validayn” – ota-onaga qattiq itoatsizlik va yomon munosabatda bo‘lish – ularga ozor berish, ularga nafrat bilan munosabatda bo‘lish, muhtojlikda e’tiborsiz qoldirish, ularni so‘z yoki ish bilan yaralashdir. Bu islom buyurgan ezgu ezgulik birr al-validaynning teskarisi.",
      "Nega bunchalik jiddiy: Alloh taolo oyat ortidan oyatda Unga ibodat qilish amrini ota-onaga yaxshilik qilish amri bilan juft qilib qo‘yadi, xuddi “Allohga ibodat qiling... va ota-onaga yaxshilik qiling” (4:36) kabi – ularning haqlarini O‘z haqlaridan keyin qo‘yib. Ota-ona Allohdan keyin insonning borlig'i va tarbiyasining eng yaqin manbaidir, shuning uchun ularga nisbatan noshukurlik bir xil noshukurlikdir. Rasululloh sollallohu alayhi vasallam ularning zulmlarini shirkdan keyingi eng katta gunohlar qatoriga kiritdilar.",
      "Muhim muvozanat: taqvodorlik Allohga itoatsizlikda ota-onaga itoat qilishni anglatmaydi - Yaratganga gunoh qilishda hech bir maxluq itoat etilmaydi. Ammo rad etish kerak bo'lgan joyda ham bu muloyimlik, hurmat va doimiy mehribonlik bilan amalga oshiriladi. Qur'on eng kichik g'azablanish so'zini ham man qiladi: \"Ularga \"uf\" dema\" (17:23).",
      "Qaytish yo'li: bu erda rahm-shafqat shundaki, ota-onalar odatda hali ham qo'lida. Kamchilikka uchragan kishi uchun tavba qilish ko'p jihatdan amaliydir - yaxshilik qilishni davom ettiring, ulardan kechirim so'rang, ularga xizmat qiling va ular uchun duo qiling, ayniqsa ular tirikligida. Agar ota-ona vafot etgan bo'lsa, ular uchun duo qilish, sadaqa qilish, rishtalari va do'stlarini hurmat qilish bilan davom etadi.",
    ],
    quran: [
      {
        excerpt:
          "Parvardigoringiz faqat Unga ibodat qilishingizni va ota-onaga yaxshi muomala qilishingizni amr qildi. Ularga «uf» demang va ularni daf qilmang, balki ularga yaxshi so'z ayting.",
      },
      {
        excerpt:
          "Allohga ibodat qilinglar va Unga hech narsani sherik qilmanglar va ota-onaga yaxshilik qilinglar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sizlarga eng katta gunohlarning xabarini beraymi? Allohga shirk keltirish, ota-onaga itoatsizlik.",
      },
    ],
    actions: ["Bu hafta ota-onalarga yaxshi so'z bilan qo'ng'iroq qiling yoki tashrif buyuring."],
    appLinks: [{}],
  },
  {
    title: "O'g'irlik",
    summary:
      "Boshqalarning mulkini noqonuniy ravishda olish - ishonchni buzadi va jazoga chorlaydi.",
    body: [
      "Ta'rif: O'g'irlik (sariqat) - o'g'irlik, o'zlashtirish, firibgarlik yoki hech qanday da'vosi bo'lmagan narsalarni yashirin ravishda tortib olish yo'li bilan - o'zgalarning mol-mulkini yoki mulkini haqsiz olib qo'yishdir.",
      "Nima uchun bu jiddiy: bu odamlarning huquqlarini ham, jamoat hayoti bog'liq bo'lgan ishonchni ham buzadi. Uning jiddiyligi Qur'onda saralash holatlari uchun belgilangan jazo bilan ta'kidlangan (5:38) - qattiq shartlar va yuqori dalillar standartlari bilan himoyalangan jazo, shuning uchun uning jiddiyligi asosan odamlarning mulkini himoya qiladigan kuchli to'xtatuvchi vosita bo'lib xizmat qiladi. Islomning maqsadi insonlar o'z mol-mulki bilan o'zlarini xavfsiz his qiladigan jamiyatdir.",
      "Uning zamonaviy yuzlari: o'g'irlik faqat uyga bostirib kirish bilan cheklanmaydi. Bu ish beruvchidan olish, biznesda aldash, ishchilarning ish haqini ushlab qolish, raqamli qaroqchilik, plagiat va qonuniy ravishda o'ziga tegishli bo'lmagan narsalardan foyda olishni o'z ichiga oladi. Odamlardan yashirin bo'lgan narsa, har bir shaxsiy ishni ko'radigan Allohga sir bo'lmaydi.",
      "Qaytish yo'li: insonning haqqi bo'lgani uchun tavba qilish Alloh huzurida pushaymonlikdan ham ko'proq narsani talab qiladi. O'g'irlangan narsaning o'zini yoki uning qiymatini qonuniy egasiga qaytarish va iloji bo'lsa, ulardan kechirim so'rash; agar egasi topilmasa, ulamolar bu miqdorni ularning nomidan sadaqa qilishni maslahat beradilar. Shu tarzda bo'shatilgan, hatto o'g'irlik ham qaytib kelgan bandani sevuvchi tomonidan to'liq kechiriladi.",
    ],
    quran: [
      {
        excerpt: "O'g'ri erkak va urg'ochi o'z qilgan amallari uchun qo'llarini kesib olinglar.",
      },
    ],
    actions: [
      "O'g'irlangan narsalarni yoki ularning qiymatini qaytarish; zulm qilinganlardan kechirim so'rang.",
    ],
    appLinks: [{}],
  },
  {
    title: "Mast qiluvchi moddalar",
    summary:
      "Sharob va mast qiluvchi moddalar - Qur'onda asta-sekin va qat'iy ravishda taqiqlangan.",
    body: [
      "Ta'rif: Xamr - aqlni mast qiluvchi va xira qiladigan narsa - sharob va har qanday spirtli ichimliklar va Payg'ambar sollallohu alayhi vasallamning o'z tamoyillariga ko'ra, har qanday mast qiluvchi moddaning shakli va nomidan qat'i nazar. «Har bir mast qiluvchi narsa xamrdir va harom haromdir».",
      "Nima uchun u og'ir: aql bu qobiliyatdirki, u orqali inson Allohni taniydi, yaxshi-yomonni ajratadi va boshqa har qanday mas'uliyatni saqlaydi. Mast qiluvchi moddalar aynan mana shu narsani yo'q qiladi, shuning uchun Qur'on ularni butlar va qimor bilan qavs qilib, «shaytonning ishidan haromdir», deb buyuradi va «ulardan saqlaning» (5:90). Insondan tashqari, ular salomatlik, oila va xavfsizlikni buzadi va hushyor odam hech qachon yaqinlasha olmaydigan gunohlar uchun eshikni ochadi.",
      "Qanday qilib harom qilinganligining hikmati: Alloh taolo hamrni bir martalik zarb bilan ta'qiqlamadi, balki uni bosqichma-bosqich harom qildi va ilk ummatni chuqur ildiz otgan odatlaridan yumshoqlik bilan ajratdi. Bu asta-sekinlik o'zi rahm-shafqat saboqidir va bugungi kunda uni tark etish uchun kurashayotgan har bir kishi uchun umid namunasidir.",
      "Qaytish yo'li, rahm-shafqat bilan: giyohvandlikka duchor bo'lganlar nafratlanmaydi, balki qo'llab-quvvatlanadi. Tavba, moddani tark etishga qaror qilish, uni va uning qo'zg'atuvchilarini hayotidan olib tashlash, uyalmasdan yordam va davolash so'rash, bo'shliqni yaxshi suhbat, zikr va ibodat bilan to'ldirishdir. Allohning eshigi keng ochiq, mastlikdan uzoqlashgan har bir ixlos bilan qadami U qabul qilgan qadamdir.",
    ],
    quran: [
      {
        excerpt:
          "Ey iymon keltirganlar, albatta, sharob, qimor, butlar va fol ochuvchi o‘qlar shaytonning ishidan haromdir, ulardan saqlaning.",
      },
    ],
    hadith: [
      {
        excerpt: "Har bir mast qiluvchi narsa hamr, har bir hamr haromdir.",
      },
    ],
    actions: [
      "Agar kerak bo'lsa, yordam so'rang; odatni zikr va yaxshi muloqot bilan almashtiring.",
    ],
    appLinks: [{}],
  },
];

export const JAHANNAM_NAMES_UZ: DeepPartial<JahannamNameEntry>[] = [
  {
    name: "Jahannam",
    meaning: "Olov - Qur'onda do'zaxning eng ko'p uchraydigan nomi.",
    quran: {
      excerpt:
        "Yonilg'isi odamlar va toshlar bo'lgan, kofirlar uchun tayyorlangan do'zaxdan qo'rqinglar.",
    },
    context:
      "Butun Qur'onda iymonni inkor etgan va zulm qilishda davom etganlar uchun jazo maskani sifatida ishlatilgan.",
    tafsirNote:
      "Ibn Kasirning qayd etishicha, Jahannam ogohlantirish va oqibat sifatida tayyorlangan olovning keng qamrovli nomidir.",
    scholarlyNote:
      "Ba'zi olimlar Jahannam butun jahannammi yoki ma'lum bir darajami, deb muhokama qilishadi - qarashlar turlicha.",
  },
  {
    name: "Jahim",
    meaning: "Yonayotgan olov - kuchli, qattiq issiqlik.",
    quran: {
      excerpt:
        "Siz va Allohdan o'zga ibodat qilayotgan narsalaringiz do'zax uchun yoqilg'isiz, unga kirasiz.",
    },
    context: "Allohga dushman bo'lganlarni kutayotgan do'zaxning shiddati tasvirlangan.",
    tafsirNote:
      "At-Tabariy johimni hech narsani ayamaydigan alangali, alangali olov bilan bog'laydi.",
  },
  {
    name: "Saqar",
    meaning: "Kuydiradigan yoki hech narsa qoldirmaydigan narsa - qattiq issiqlik.",
    quran: {
      excerpt: "Men uni Saqarga haydab yuboraman. Saqar nima ekanligini senga nima yordam beradi?",
    },
    context: "Muddassir surasida vahiydan yuz o‘girgan kishi haqida zikr qilingan.",
    tafsirNote:
      "Klassik tafsir Saqarni jahannamning kuchli yonadigan darajasi sifatida tasvirlaydi; Tafsilotlar olimlar orasida farq qiladi.",
    scholarlyNote:
      "Saqar alohida darajami yoki jahannam nomimi, tafsirda muhokama qilinadi - bir kelishilgan matnda aniq emas.",
  },
  {
    name: "Sa'ir",
    meaning: "Yonayotgan - yonayotgan olov.",
    quran: {
      excerpt: "Ular So'irda - alangali do'zaxdadirlar.",
    },
    context: "Yetimlarning molini nohaq iste'mol qiluvchilarga ogohlantirish.",
    tafsirNote:
      "Ildiz yonish va yoqishni bildiradi - faol, iste'mol qilinadigan olovni ta'kidlaydi.",
  },
  {
    name: "Hutama",
    meaning: "Maydalagich - buzadigan va ezadigan narsa.",
    quran: {
      excerpt: "U Hutamaga tashlanadi. Al-Hutama nima ekanligini senga nimadan bera oladi?",
    },
    context: "G'iybatchi va boylikni o'lmas qiladi, deb o'ylagan kishining jazosi.",
    tafsirNote:
      "Ibn Kasir Hutamaning Alloh tomonidan yoqqan olovni ezish va iste'mol qilishini tushuntiradi.",
  },
  {
    name: "Haviyya",
    meaning: "tubsizlik yoki chuqur - chuqur tushish.",
    quran: {
      excerpt: "Kimning tarozisi engil bo'lsa, uning panohi Haviyadir.",
    },
    context: "Qiyomat kunida yaxshiliklari yengil bo'lganlarning borar joyi.",
    tafsirNote:
      "Olovdagi chuqur chuqur sifatida tasvirlangan; at-Tabariy uning chuqurligi va jiddiyligi haqidagi qarashlarni qayd etadi.",
    scholarlyNote:
      "Ba'zi tafsir asarlarida Haviyani ma'lum bir daraja sifatida ko'rsatadi - ilmiy tafsir sifatida keltiriladi.",
  },
  {
    name: "Lazaa",
    meaning: "Olov - yonayotgan olov.",
    quran: {
      excerpt: "Hech qanday holatda! U Allohning alangasidir.",
    },
    context: "Maorij surasi - qiyomatni yolg'onga chiqarganlarni ogohlantiruvchi.",
    tafsirNote:
      "Chiqib ketadigan va yonib ketadigan olovga ulangan - Lazaa faol yonishni ta'kidlaydi.",
  },
];

export const JAHANNAM_GATES_UZ: DeepPartial<JahannamGateEntry>[] = [
  {
    quranNote:
      "Alloh taolo do'zaxning ettita eshigi borligini aytadi. Har bir darvozaga kiradiganlarning bir qismi bor (15:44).",
    scholarlyNote:
      "Keyinchalik ba'zi tafsir asarlarida eshiklar gunohkorlar toifalari bilan bog'langan. Ushbu topshiriqlar dastlabki manbalarda bir xil emas - talqin sifatida mavjud.",
  },
  {
    quranNote:
      "Qur'on yetti eshikni birgalikda tasdiqlaydi; u ochiq-oydin vahiyda har bir darvoza nomini aytmaydi.",
    scholarlyNote:
      "Ibn Kasir raziyallohu anhu bo'linish Allohning hikmati va adolati bilan bo'lganini muhokama qiladi.",
  },
  {
    quranNote:
      "Etti darvoza - aniq matnli fakt. Har bir darvoza yo'lovchilarining tafsilotlari asosan ilmiy munozaradir.",
  },
  {
    quranNote: "Oyat mutanosib topshiriqni ta'kidlaydi - har bir darvoza o'z ulushiga ega.",
  },
  {
    quranNote:
      "Mo'minlar tavba qilish orqali bu eshiklarga olib boradigan narsalardan qochishlari uchun ogohlantiriladi.",
  },
  {
    quranNote:
      "Jahannam tayyorlangan - ogohlantirish haqiqiydir. Himoya iymon va solih amallar orqalidir.",
  },
  {
    quranNote:
      "Etti darvoza, bitta olov - gunohkorlar ilohiy donolik bilan qanday guruhlanganligining xilma-xilligi bilan ogohlantirish birligi.",
    scholarlyNote:
      "Agar nomli ilmiy asarga iqtibos keltirmasa, bashoratli haqiqat sifatida aniq gunoh-darvoza xaritalarini o'rgatishdan saqlaning.",
  },
];

export const JAHANNAM_VERSES_UZ: DeepPartial<JahannamVerseEntry>[] = [
  {
    excerpt: "Kofirlar uchun tayyorlangan do'zaxdan qo'rqing.",
    context: "Imonlilarga murojaat - qo'rquv itoatkorlik uchun turtki sifatida.",
    tafsirSummary: "Ibn Kasir: Rasulullohga itoat bilan qo'shilgan taqvoga da'vat.",
  },
  {
    excerpt: "Allohning rahmatidan noumid bo'lmang. Albatta, Alloh barcha gunohlarni kechiradi.",
    context: "Gunohlaridan qo'rqqanlarga tasalli berish uchun vahiy qilingan.",
    tafsirSummary: "Umidning burchak toshi - rahm-shafqat orqaga qaytganlar uchun kengdir.",
  },
  {
    excerpt: "Allohga chin tavba bilan tavba qiling, shoyadki, Robbingiz gunohlaringizni ketkazar.",
    context: "Oila va xulq-atvorda hidoyatdan keyin mo'minlarga amr.",
    tafsirSummary: "Nasuh tavba - gunohga qaytmasdan chin dildan tavba qilish.",
  },
  {
    excerpt: "Hammaga qilgan amallariga yarasha darajalar bordir.",
    context: "Ilohiy adolat - ishlarga mutanosib ravishda mukofot va jazo.",
    tafsirSummary: "Darajalar jannatga ham, do‘zaxga ham tegishli.",
  },
  {
    excerpt: "Alloh odamlarga zulm qilmas, balki odamlar o'zlariga zulm qiladilar.",
    context: "Ilohiy hukmning mutlaqo adolatli ekanligiga ishonch.",
  },
  {
    excerpt: "Ey Robbimiz, bizga ikki dunyoda yaxshilik ato et va bizni do'zax azobidan saqla.",
    context: "Dunyoviy va dunyoviy yaxshilikni birlashtirganlarning duosi.",
    tafsirSummary: "Qur'onda o'rgatilgan bashoratli duo - dunyo va oxirat muvozanati.",
  },
  {
    excerpt: "Do'zaxning ettita eshigi bor; Har bir darvoza uchun bir qism ajratilgan.",
    context: "Ibrohim alayhissalomning o‘z qavmi bilan bo‘lgan bahsi kontekstida murojaat qilgan.",
    tafsirSummary: "Etti eshikni aniq zikr qilish - topshiriqning tafsilotlari ilohiy hikmatdir.",
  },
  {
    excerpt:
      "Magar tavba qilgan, iymon keltirgan va solih amallarni qilgan zotlargina Alloh yomonlikni yaxshilikka almashtiradi.",
    context: "Katta gunohlarni sanab o'tgandan keyin istisno.",
    tafsirSummary: "Tavba qilganlarga umid - rahm-shafqat bilan amallar o'zgarishi mumkin.",
  },
  {
    excerpt: "Robbilariga kufr keltirganlar uchun jahannam azobi bordir.",
    context: "Mulk surasi — gʻaybni eslatuvchi.",
  },
  {
    excerpt: "Darhaqiqat, yaxshi amallar yomonliklarni ketkazadi.",
    context: "Kunning ikki chetida namoz o'qishga buyuring.",
    tafsirSummary: "Izchil topinish o'tmishdagi sirlarni o'chiradi, degan dalda.",
  },
  {
    excerpt: "Ey Robbimiz, gunohlarimizni mag'firat qil va bizni do'zax azobidan saqla.",
    context: "Muttaqinning ta'rifi.",
  },
  {
    excerpt: "Kimning tarozisi engil bo'lsa, uning panohi Haviyadir.",
    context: "Qori'a surasi — amallarni tortish.",
  },
];

export const JAHANNAM_HADITH_UZ: DeepPartial<JahannamHadithEntry>[] = [
  {
    hadith: {
      excerpt:
        "Kim Allohdan uch marta jannat so‘rasa, jannat: Allohim, uni jannatga kiritgin, deydi. Kim uch marta do'zaxdan panoh so'rasa, do'zax aytadi: Allohim, uni do'zaxdan saqla.",
    },
    context: "Jannat uchun muntazam duo qilishga va jahannamdan panoh olishga undash.",
  },
  {
    hadith: {
      excerpt:
        "Alloh taolo bandasining tavbasidan sizlardan biringiz adashgan tog'ini taqir yerdan topib olgandan ko'ra ko'proq rozi bo'ladi.",
    },
  },
  {
    hadith: {
      excerpt:
        "Sizlardan hech biringiz jannatga faqat o'z amali bilan kira olmaysiz, hatto men ham, Alloh meni rahmati bilan qoplamaguncha.",
    },
    context: "Muvozanat: amalda harakat qiling, lekin rahm-shafqatga tayan.",
  },
  {
    hadith: {
      excerpt:
        "Sizning olovingiz jahannam olovining yetmish qismidan bir qismidir, har bir qismi uning issiqligidekdir.",
    },
  },
  {
    hadith: {
      excerpt: "Biz bilan ular o'rtasidagi ahd ibodatdir. Kim uni tark etsa, kufrga kirdi.",
    },
    context: "Namozni e'tiborsiz qoldirishning og'irligi - eng og'ir ogohlantirishlardan.",
  },
  {
    hadith: {
      excerpt:
        "Muflis namoz, ro'za va sadaqa bilan keladi - lekin u haqorat qildi, tuhmat qildi, mol-mulkini noqonuniy iste'mol qildi va qon to'kdi.",
    },
    context: "Odamlarning haq-huquqlari qiyomat kuni amallar oldida hal qilinishi mumkin.",
  },
  {
    hadith: {
      excerpt:
        "Alloh taolo kunduzgi gunohkorning tavbasini qabul qilish uchun kechasi qoʻlini choʻzadi va kechasi gunohkorning tavbasini qabul qilish uchun kunduzi qoʻlini choʻzadi.",
    },
  },
  {
    hadith: {
      excerpt:
        "Kim Allohga va oxirat kuniga iymon keltirgan bo'lsa, yaxshi gapirsin yoki jim tursin.",
    },
    context: "Tilni himoya qilish - kundalik javobgarlik.",
  },
];

export const JAHANNAM_REFLECTIONS_UZ: DeepPartial<JahannamReflectionEntry>[] = [
  {
    question: "Bugun men kimgadir zulm qildimmi - nutqda, harakatda yoki e'tiborsizlikda?",
  },
  {
    question: "Men bugun chin dildan va qayta-qayta Allohdan kechirim so'radimmi?",
  },
  {
    question: "Men tilimni g‘iybat, yolg‘on va masxara qilishdan saqladimmi?",
  },
  {
    question: "Namozni o‘z vaqtida va huzurida o‘qidimmi?",
  },
  {
    question: "Men o'zimdan uzoqlashgan inson bilan yarashish uchun qadam tashladimmi?",
  },
  {
    question: "Men bugun sadaqa yoki mehribonlik qildimmi - hatto kichik bir narsa?",
  },
  {
    question: "Bugun Qur'on o'qidimmi yoki tingladimmi?",
  },
];

export const JAHANNAM_REFERENCES_UZ: DeepPartial<JahannamReferenceEntry>[] = [
  {
    title: "Qur'on",
    note: "Ismlar, ogohlantirishlar, rahm-shafqat va tavba uchun asosiy manba. Tarjimalar turlicha; aniqlik uchun arab tiliga murojaat qiling.",
  },
  {
    title: "Sahihi Buxoriy va Sahihi Musulmon",
    note: "Ushbu modul davomida keltirilgan kanonik hadis to'plamlari sahih baholanadi.",
  },
  {
    title: "Tafsir Ibn Kasir",
    note: "Do'zax nomlari va asosiy ogohlantirish oyatlari haqidagi kontekstga havola qilingan - ilmiy talqin.",
  },
  {
    title: "Tafsir at-Tabariy",
    note: "Ilk keng qamrovli tafsir — Jahonnam haqidagi klassik qarashlarni tushunish uchun foydali.",
  },
  {
    title: "Olimlar farq qiladigan joyda",
    note: "Do'zaxning aniq darajalari, darvoza topshiriqlari va ba'zi ismlarning ma'nolari olimlar orasida muhokama qilinadi - vahiyda har doim ham aniq emas.",
  },
];

export const JAHANNAM_DUAS_UZ: DeepPartial<JahannamDuaEntry>[] = [
  {
    context: "Ikki dunyoda yaxshilikni so'rang va do'zaxdan saqlaning — Qur'on duosi.",
  },
  {
    context: "Tashahhuddan keyin: Jannatni so'ra va do'zaxdan panoh.",
  },
  {
    context: "Ertalabki zikr: qabr va do'zax azobidan panoh.",
  },
];

export const JAHANNAM_REFUGE_DUA_UZ: { translation: string } = {
  translation:
    "Allohim, do'zax azobidan, qabr azobidan, hayot va o'lim fitnasidan va Soxta Masihning yomon fitnasidan Sendan panoh so'rayman.",
};
