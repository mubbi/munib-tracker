// Uzbek translation overlay for the Learn Taharah content. Mirrors the order of
// its English source in ../taharah*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { TaharahChecklistItem, TaharahTopic } from "../../types/taharah";
import type { DeepPartial } from "./localize";

export const TAHARAH_TOPICS_UZ: DeepPartial<TaharahTopic>[] = [
  {
    title: "Taharaga kirish",
    summary: "Poklanish ibodatga kirish eshigi va mo'minning iymonining yarmidir.",
    body: [
      "Tahara (ṷhạrẗ) poklanishni anglatadi - musulmon kishi Allohning huzurida U rozi bo'lgan holatda turishi uchun tanani, kiyimni va namoz o'qiladigan joyni marosim va jismoniy nopoklikdan tozalash. Ibodat tolibi birinchi bo'lib o'rganadigan narsadir, chunki usiz namoz sahih bo'lmaydi: Nabiy sollallohu alayhi vasallam: \"Namozning kaliti poklanishdir\", dedilar.",
      "Islomda poklanish ikki jihatga ega. Tashqi ko'rinadigan poklik - yuvish, iflos narsalarni olib tashlash, toza saqlash. Ichida yuvinish uyg'otish uchun mo'ljallangan kamtarlik, aql va qalbning tayyorligidir. Rasululloh sollallohu alayhi vasallam poklikni «iymonning yarmi» deb ataganlarida, jismonan poklik bilan qalbning gunohdan poklanishini qo‘shib, ikkalasini bir-biriga bog‘laganlar.",
      "Ushbu modul butun mavzuni tartibda ko'rib chiqadi: tozalagan suv, tahorat (kichik tahorat), g'usl (to'liq hammom), tayammum (suvdan foydalanish mumkin bo'lmaganda quruq tozalash), najosa (jismoniy iflosliklarni olib tashlash) va alohida holatlar va imtiyozlar. Buni bir marta o'rganing va ibodat shubha bilan emas, balki ishonch bilan kirishingiz mumkin bo'lgan narsaga aylanadi.",
    ],
    quran: [
      {
        excerpt:
          "Ey iymon keltirganlar, namozga tursangiz, yuzlaringizni va bilaklaringizni tirsakgacha yuving, boshingizga masx qiling, oyoqlaringizni to‘pig‘igacha yuving.",
      },
      {
        excerpt: "Albatta, Alloh tavba qiluvchilarni sevadi va poklanganlarni sevadi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ibodatning kaliti poklanishdir; uning boshlanishi takbir, oxiri esa taslimdir. (Ali; shuningdek, Jomiy at-Termiziy 3)",
      },
    ],
    actions: [
      "Poklanishni shoshilinch ish emas, balki Alloh bilan uchrashishga tayyorgarlik sifatida qabul qiling.",
      "Butun oqim tabiiy bo'lguncha har kuni bitta taxara mavzusini o'rganing.",
    ],
    appLinks: [{}],
  },
  {
    title: "Poklikning ahamiyati",
    summary: "Poklik namozning qat'iy sharti va mo'minning belgisidir.",
    body: [
      "Poklanish ko'pchilikning bir varianti emas - bu ibodatning to'g'riligining shartidir. Alloh taolo namozi nopok bo‘lgan kishining namozini poklanmaguncha qabul qilmaydi. Shuning uchun tahoratsiz va g'uslsiz o'qilgan namoz qanchalik ixlos bilan bo'lsa ham takrorlanishi kerak.",
      "Rasululloh sollallohu alayhi vasallam poklikni mo'minning xislatiga ko'tarib, uni \"iymonning yarmi\" deb ataganlar. Muntazam poklanish insonni tarbiyalaydi, uni deyarli doimiy ibodatga tayyor holatda ushlab turadi va - hadisda aytilishicha - kichik gunohlarni suv bilan yuvib tashlaydi.",
      "Namozni saqlagani uchun tahorat mo'minni beparvolik tufayli noto'g'ri namoz o'qish gunohidan ham saqlaydi. Shuning uchun uning hukmlarini yaxshi o'rganish Islomdagi eng ulug' amallardan biri bo'lgan himoyadir.",
    ],
    hadith: [
      {
        excerpt: "Poklanish iymonning yarmidir. (Abu Molik al-Ash’ariy)",
      },
      {
        excerpt:
          "Alloh taolo poklanmagan namozni ham, o‘g‘irlangan zakotni ham qabul qilmaydi. (Ibn Umar)",
      },
    ],
    actions: [
      "Har bir namozdan oldin, boshlashdan oldin pokligingizni tasdiqlang.",
      "Oddiy aqliy nazorat ro'yxatini saqlang: tana, kiyim, joy va tahorat.",
    ],
  },
  {
    title: "Poklik turlari",
    summary: "Uch holatni bilish kerak: kichik najosat, katta harom va jismoniy najosat.",
    body: [
      "Islom shariati sizni poklashingiz kerak bo'lgan uchta narsani ajratib ko'rsatadi va har birining o'z chorasi bor. Qaysi vaziyatda ekanligingizni bilish to'g'ri usulni tanlashning kalitidir.",
      "Kichkina marosim nopokligi (hadas asg'ar) hojatxonadan foydalanish, shamol o'tkazish yoki chuqur uyqu kabi oddiy hodisalardan kelib chiqadi. Tahorat bilan yoki suvdan foydalanish mumkin bo'lmaganda tayammum bilan ko'tariladi.",
      "Katta nopoklik (hadas akbar, janob deb ham ataladi) yaqinlik, jinsiy aloqa va hayz ko'rishning tugashi yoki tug'ruqdan keyingi qon ketishidan kelib chiqadi. G'usl bilan ko'tariladi, ya'ni to'liq badanni hammom bilan ko'taradi - suv bo'lmagan yoki zararli bo'lsa, yana tayammum bilan almashtiriladi.",
      "Siydik, najas yoki oqayotgan qon kabi jismoniy iflosliklar (najosa) alohida masala: marosim holatidan qat'i nazar, tanadan, kiyimdan va namozgohdan jismonan olib tashlanishi kerak. To'rtta sunniy mazhablar bu uch toifaga rozi bo'lib, ular faqat poklikni bekor qiladigan narsa yoki qanday iz miqdori uzrli ekanligi haqidagi ba'zi tafsilotlarda farq qiladi.",
    ],
    quran: [
      {
        excerpt:
          "Agar janob bo'lsangiz, pok bo'ling. Agar kasal bo'lsangiz yoki safarda bo'lsangiz... suv topmasangiz, toza tuproq bilan tayammum qiling.",
      },
    ],
    actions: [
      "Avval holatingizni aniqlang (kichik, katta yoki iflos), keyin to'g'ri usulni qo'llang.",
      "Tafsilotlar haqida ishonchingiz komil bo'lmaganda, doimiy ravishda taniqli maktabdagi malakali o'qituvchini kuzatib boring.",
    ],
  },
  {
    title: "Islomda suv",
    summary:
      "Toza suv asosiy tozalash vositasidir - yaxshilab ishlatiladi, lekin hech qachon isrof qilinmaydi.",
    body: [
      "Oddiy tozalash vositasi suvdir. Alloh taolo yomg'irni \"pok\" (tahur) tushirilgan, ham poklashga, ham ibodat qilish uchun foydalanishga qodir, deb ta'riflaydi. Har qanday tabiiy toza suv - yomg'ir, daryo, dengiz, buloq, quduq yoki jo'mrak - agar uning rangi, ta'mi yoki hidi unga aralashgan nopoklik bilan o'zgarmasa, tozalanadi.",
      "Faqihlar suvni batafsil (sof va poklovchi, sof, lekin tozalanmaydigan va harom) toifalarga ajratadilar, ammo kundalik hayotning amaliy qoidasi oddiy: suv tahorat va g'usl uchun mos bo'lib qoladi, agar najosat uni aniq o'zgartirmasa. Mavjud toza muqobil bilan chinakam shubhangiz bo'lsa, muqobildan foydalaning.",
      "Islom isrofgarchiliksiz puxtalikka o'rgatadi. Rasululloh sollallohu alayhi vasallam to'liq yuvindilar, lekin juda oz suv iste'mol qildilar - tahorat uchun bir mudd (ikki hovuch hovuch), to'liq g'usl uchun esa bir so' (taxminan to'rtta). Suv ko'p bo'lsa ham isrof qilishdan qaytariladi, chunki me'yorning o'zi ham ibodat odoblaridandir.",
    ],
    quran: [
      {
        excerpt: "Va osmondan pokiza suv tushirdik.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Rasululloh sollallohu alayhi vasallam bir mudd suv bilan tahorat, besh muddgacha so' bilan g'usl olar edilar. (Anas; shuningdek, Sahihi Musulmon 325 - mo''tadil sunnat)",
      },
    ],
    actions: [
      "To'liq yuvish uchun etarli miqdorda suvdan foydalaning, lekin jo'mrakni pastga aylantiring va ortiqcha suvdan saqlaning.",
      "Agar suv manbai ifloslik bilan o'zgargan ko'rinsa yoki hidlansa, eng yaqin toza manbani qidiring.",
    ],
    disclaimer:
      "Ko'p iqtibos keltirgan \"Oqib turgan daryoda ham suvni isrof qilmang\" (Ibn Moja 425) rivoyati ko'pchilik olimlar tomonidan zaif (da'if) deb baholangan; o'rniga mo''tadil sunnati yuqoridagi mudd/sa' hadis bilan mustahkamlangan.",
  },
  {
    title: "Vudu nima?",
    summary: "Ibodatdan oldin mayda nopoklikni olib tashlaydigan tahorat.",
    body: [
      "Tahorat (wḶwạ) - bu a'zolarni ma'lum tartibda yuvib, mayda nopokliklarni olib tashlash. Uning to'rtta farz yuvilishi Qur'onda to'g'ridan-to'g'ri nomlanadi (5:6): yuz, bilaklarni tirsaklargacha, boshga masxara qilish va oyoqlarni to'piqlarigacha.",
      "Har bir namozdan oldin, agar avvalgi namozdan so'ng to'g'ri bo'lmasangiz, va ko'pchilik ulamolarning fikriga ko'ra, Ka'ba atrofida tavof qilishdan oldin va Qur'onning jismoniy matniga (mushaf) tegmasdan oldin talab qilinadi.",
      "Tahorat o'ziga xos bir ibodatdir, shunchaki oldindan emas. Rasululloh sollallohu alayhi vasallam: “Sizlardan birortangiz yana tahorat olmaguncha, tahoratini buzgan namozni Alloh qabul qilmaydi”, deb ogohlantirdilar.",
    ],
    hadith: [
      {
        excerpt:
          "Alloh taolo sizlardan biringizning tahoratini buzgan namozini tahorat qilmaguncha qabul qilmaydi. (Abu Hurayra)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Yaroqli tahorat olish shartlari",
    summary: "Niyat, toza suv va to'siqsiz teri - sog'lom tahoratning sharti.",
    body: [
      "Tahorat hisoblanishi uchun ma'lum shartlar (shurut) bo'lishi kerak. Inson ibodat (niyyah) uchun poklanishni niyat qilgan, aqli raso musulmon bo'lishi kerak. Ba'zi maktablar niyatni harakatning ustuni, boshqalari esa shart sifatida tasniflaydi, ammo hamma bu mukofot uchun va ko'pchilik uchun haqiqiyligi uchun zarurligiga rozi.",
      "Ishlatilgan suv toza va toza bo'lishi kerak. Eng muhimi, u haqiqatan ham teriga etib borishi kerak - shuning uchun oyoq-qo'l ustidagi suv o'tkazmaydigan to'siqni (qalin bo'yoq, tirnoq, mum, elim) birinchi navbatda olib tashlash kerak, aks holda uning ostidagi yuvish yaroqsiz. Suvni to'sib qo'ymaydigan oddiy axloqsizlik yoki xina dog'i muammo emas.",
      "Shofe'iy va Hanbaliy mazhabi ham yuvishni Qur'on tartibida va oyoq-qo'llarni quritadigan uzoq vaqt to'xtatmasdan (muvalat) qilishni talab qiladi. Hanafiy va Molikiyning qat'iy ketma-ketlik va davomiylik haqidagi pozitsiyalari ba'zi holatlarda yumshoqroqdir. Muvofiqlik uchun bitta maktab uslubiga amal qiling.",
    ],
    quran: [
      {
        excerpt:
          "Yuzlaringizni va bilaklaringizni tirsaklaringizgacha yuving, boshingizni arting va oyoqlaringizni to'piqgacha yuving.",
      },
    ],
    actions: [
      "Tahoratdan oldin tirnoq bo'yog'ini, suvni ushlab turadigan halqalarni va terini yopishtiruvchi narsalarni olib tashlang.",
      "Hech bir a'zo o'tkazib yuborilmasligi yoki qurib qolmasligi uchun bir oqimda tinchgina tahorat qiling.",
    ],
  },
  {
    title: "Tahoratning farzlari",
    summary: "Qur'on ustunlari (faraid), ularsiz tahorat yaroqsizdir.",
    body: [
      "Tahoratning vojiblari (uning faraidlari) Alloh taolo oyatda zikr qilgan qismlardir: butun yuzni yuvish; ikkala qo'lni tirsaklargacha yuvish; boshni artish; ikki oyog'ini to'pig'igacha yuvish. Bulardan birortasini o'tkazib yuborsa, tahorati to'liq bo'lmaydi.",
      "Bularga mazhablar sunnat va fiqhiy fikrdan qo'shimcha farzlarni qo'shadilar. Ko‘pchilik mazhablarda niyat farzdir (hanafiylar uni kichik nopoklikni ko‘tarish uchun qattiq ta’kidlangan sunnat deb tasniflaydilar). Tartib (tartib) va davomiylik (muvolot) shofiiy va hanbaliylarga farzdir. Molikiylar a'zolarni (dalk) ishqalashni farz qilib qo'shadilar.",
      "Bulardan tashqari hamma narsa - og'iz va burunni chayish, avval qo'l yuvish, uch marta yuvish - farz emas, balki tavsiya (sunnat)dir. Farqni bilish, tahoratning noto'g'ri ekanligini va haqiqiy noto'g'ri ekanligini aniqlay olasiz.",
    ],
    quran: [
      {
        excerpt:
          "Yuzlaringizni va bilaklaringizni tirsaklaringizgacha yuving, boshingizni arting va oyoqlaringizni to'piqgacha yuving.",
      },
    ],
    disclaimer:
      "Faraidlarning aniq ro'yxati (masalan, niyat, tartib va ​​ishqalanish vojibmi) to'rt mazhabda farq qiladi. Doimiy ravishda bitta ishonchli maktabni o'rganing va qo'llang.",
  },
  {
    title: "Tahoratning sunnat amallari",
    summary: "Tavsiya etilgan amallar tahoratning savobini komil va ko'paytiradi.",
    body: [
      "Rasululloh sollallohu alayhi vasallam tahoratni to'liq va go'zal qiladigan ko'plab tavsiya etilgan amallarni (sunanlarni) qilganlar. Birovni tark etish tahoratni buzmaydi, balki qo'shib qo'yish qo'shimcha savob oladi va undan to'liqroq o'rnak oladi.",
      "Sobit sunnat amallarga quyidagilar kiradi: boshida “Bismillah” deyish; boshlashdan oldin qo'llarni uch marta yuvish; og'iz (madmada) va burunni (istinshoq) chayish; ho‘l barmoqlarni qalin soqoldan o‘tkazib, barmoqlar va oyoq barmoqlari orasidan yugurish (tahlil); har bir juft oyoq-qo'lni o'ngdan boshlash; va har bir yuvishni uch martagacha takrorlang.",
      "Ikkita sunnatni alohida ta'kidlab o'tish joiz: Payg'ambarimiz sollallohu alayhi vasallam deyarli farz qilgan misvokni oldindan qo'llash va tugatgandan so'ng iymon shahodatini o'qish, buni aytgan kishiga jannatning sakkiz eshigini ochadi.",
    ],
    hadith: [
      {
        excerpt:
          "Kim yaxshi tahorat olib, keyin «Guvohlik beramanki, Allohdan o‘zga iloh yo‘q... va Muhammad uning bandasi va rasulidir», desa, unga jannatning sakkiz eshigi ochiladi. (Umar ibn al-Xattob)",
      },
    ],
    actions: [
      "To'liq sunnat ketma-ketligi sizning tabiiy tartibingizga aylanmaguncha mashq qiling.",
      "Har safar tahoratdan keyingi shahodatni o'qing.",
    ],
    appLinks: [{}],
  },
  {
    title: "Bosqichma-bosqich tahorat",
    summary: "Niyatdan tortib duoga qadar to'liq bashoratli ketma-ketlik.",
    body: [
      "Rasululloh sollallohu alayhi vasallam tahoratni farzlarni sunnat amallari bilan to'qadigan ketma-ketlik sifatida o'rgatganlar. Bu Usmon ibn Affon roziyallohu anhuning odamlarga ko'rsatgan usuli bo'lib, keyin Rasululloh sollallohu alayhi vasallamning xuddi shunday tahorat olayotganlarini ko'rganini va kimki shunday qilsa va ikki rakat namozni to'liq o'qisa, uning o'tgan gunohlari kechiriladi, dedi.",
      "Har bir qadamni shoshilmasdan bajaring, suv har bir talab qilinadigan joyga etib borishiga ishonch hosil qiling. Yuvilgan oyoq-qo'llar (yuz, qo'llar, oyoqlar) yuviladi; bosh faqat artiladi.",
    ],
    steps: [
      {
        title: "Poklanishni niyat qilib, Bismillohni ayting",
        body: "Tahorat niyatini qalbingizga joylang va Alloh nomi bilan boshlang.",
        tip: "Niyat ichkarida - og'zaki formula talab qilinmaydi.",
      },
      {
        title: "Ikki qo'lni uch marta yuving",
        body: "Barmoqlar orasiga suv o'tkazib, bilaklarni yuving.",
      },
      {
        title: "Og'izni uch marta yuving",
        body: "Og'izga suv oling, uni aylantiring va chiqarib tashlang.",
      },
      {
        title: "Burunni uch marta yuving",
        body: "Burun teshigiga muloyimlik bilan suv torting va uni puflang.",
      },
      {
        title: "Yuzni uch marta yuvish (farz)",
        body: "Soch chizig'idan jag'ning ostiga va quloqdan quloqqa.",
      },
      {
        title: "O'ng qo'lni, keyin chap qo'lni yuving (farz)",
        body: "Har biri barmoq uchidan tirsakgacha, shu jumladan, uch martagacha.",
      },
      {
        title: "Boshga bir marta mash torting (farz)",
        body: "Ho'l qo'llar bilan old tomondan orqaga arting va orqaga qayting, so'ngra quloqlarni bir xil nam bilan artib oling.",
      },
      {
        title: "O'ng oyoqni, keyin chapni (farzni) yuving.",
        body: "Har biri to'piqdan, shu jumladan, barmoqlarni oyoq barmoqlari orasiga o'tkazish.",
        tip: "To'piq va to'piqlarga e'tibor bering - eng ko'p o'tkazib yuborilgan joylar.",
      },
      {
        title: "Yakunlovchi duoni o'qing",
        body: "Jannat eshiklarini ochish uchun iymon shahodatini ayt.",
        tip: "Qisqa, lekin katta savobli sunnat.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Usmon roziyallohu anhu Rasululloh sollallohu alayhi vasallamni ko'rganlaridek har bir a'zosini uch marta yuvdilar, so'ng: Kim shunday tahorat olib, ikki rakat namozni to'liq o'qisa, uning o'tgan gunohlari kechiriladi, dedilar. (Humron, Usmondan.)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tahorat bilan bog'liq duolar",
    summary: "Tahoratdan oldin va keyin sahih rivoyat qilingan duolar.",
    body: [
      'Tahorat atrofidagi eng kuchli zikrlar ikkitadir: boshida "Bismillah" aytish va uni tugatgandan keyin iymonga guvohlik berish. Yakunlovchi shahodatga Alloh taolodan: “Meni tavba qiluvchilardan qilgin va poklanuvchilardan qilgin”, deb so\'raladi.',
      "Shuni bilish kerakki, ba'zi risolalarda kelgan har bir a'zo uchun duo (qo'l, yuz, qo'l va hokazolarni yuvishda aytiladigan maxsus duo) Payg'ambarimiz sollallohu alayhi vasallamning sahihligi bilan tasdiqlanmagan. Ulamolar tahoratda Allohni umumiy zikr qilishning zarari yo'q bo'lsa-da, bularni sunnat deb hisoblamaslikni tavsiya qiladilar.",
      "Ishning mohiyati hozir bo'lishdir: har bir a'zoning gunohlari ketayotganini bilgan holda yuving va amalni o'z maqsadi bilan bog'laydigan shahodat bilan yakunlang - yolg'iz Allohga iymon.",
    ],
    hadith: [
      {
        excerpt:
          "Kim yaxshi tahorat olib, keyin iymonga guvohlik bersa, unga jannatning sakkiz eshigi ochilib, xohlaganidan kirishi mumkin. (Umar)",
      },
    ],
    actions: [
      "Tahoratdan keyingi shahodatni yodlamagan bo'lsangiz.",
      "Har bir a'zoda tasdiqlanmagan formulalarni sunnat bo'lgandek o'qishdan saqlaning.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tahoratni nima buzadi?",
    summary: "Tahoratni bekor qiluvchilar - va shubhada bo'lganida aniqlik hukmi.",
    body: [
      "Ilmiy kelishuvga ko'ra, tahorat ikkita shaxsiy yo'ldan chiqadigan har qanday narsa - siydik, axlat, shamol yoki boshqa oqindi - shuningdek, odamning ongini yo'qotadigan chuqur uyqu va hushidan ketish yoki mastlik tufayli ongni yo'qotish bilan buziladi.",
      "Boshqa masalalarda maktablar o'rtasida hurmatli farq bor: avratga to'g'ridan-to'g'ri teginish va qarama-qarshi jinsdagi nomahram bilan teriga teginish ba'zi maktablarda bir xil matnlarni turli xil o'qish asosida bekor qiladi, boshqalari esa bekor qiladi.",
      "Hayotiy boshqaruv tamoyili sizni doimiy tashvish (vasvas)dan himoya qiladi: ishonch shubha bilan olib tashlanmaydi. Agar siz tahorat olgan bo'lsangiz va uni buzganingizga ishonchingiz komil bo'lmasa, siz tahoratli bo'lganingizga ishonchingiz komil bo'lmaguningizcha tahorat olgan hisoblanasiz. Rasululloh sollallohu alayhi vasallam bu tuyg'udan bezovta bo'lgan kishiga: «To tovush eshitmagunicha yoki hid topmagunicha namozni tark etma», dedilar.",
    ],
    hadith: [
      {
        excerpt:
          "To tovush eshitmagunicha yoki hid topmagunicha (namozini) tark etmasin. (Abbod ibn Tamim amakisidan)",
      },
    ],
    disclaimer:
      "Qarama-qarshi jinsga tegish yoki avratga tegish tahoratni buzadimi, maktablarda farq qiladi. Malakali mahalliy o'qituvchi va bitta maktab uslubiga amal qiling.",
  },
  {
    title: "Umumiy tahorat xatolari",
    summary: "Savobni kamaytiruvchi yoki tahoratni butunlay bekor qiladigan tez-tez xatolar.",
    body: [
      "Ko'pchilik tahoratdagi xatolar shoshqaloqlikdan kelib chiqadi. Suv butun a'zoga - tovon, to'piq, tirsagi yoki barmoqlar va oyoq barmoqlari orasidagi quruq yamoqqa etib bormasligi uchun shoshilish tahoratni buzadi, chunki u erda Qur'on yuvinish tugallanmagan.",
      "Rasululloh sollallohu alayhi vasallam bir kuni tovonlari suv yetib kelmagani uchun quruq qolgan odamlarni ko'rib: «Do'zaxdan poshnalarga voy!» deb qattiq ogohlantirdilar. To'piqlar, to'piqlar va yuzning burchaklari eng ko'p e'tiborga olinmaydigan joylardir.",
      "Qarama-qarshi xato ortiqcha: uch martadan ko'proq yuvish yoki suvni isrof qilish, bu me'yor sunnatiga ziddir. Boshqalar esa tahoratni qayta-qayta takrorlab, vasvasga (obsesif shubhaga) tushib qoladilar - bu ham xatodir, chunki shubha bilan aniqlik buzilmaydi.",
    ],
    hadith: [
      {
        excerpt:
          "Do'zaxdan poshnalarga voy! — dedi tahoratda quruq qolgan poshnalarini ko'rib. (Abu Hurayra)",
      },
    ],
    actions: [
      "Har bir yuvilgan oyoq-qo'lning, ayniqsa to'piq va tirsaklarning to'liq qoplanishini sekinlashtiring va ongli ravishda tasdiqlang.",
      "O'rtacha suvdan foydalaning; obsesif shubha sizni keraksiz takrorlashga majburlamasin.",
    ],
  },
  {
    title: "Tahoratning fazilatlari",
    summary:
      "Tahorat gunohlarni o'chiradi, martabalarini ko'taradi va qiyomat kuni mo'minlarni nurlantiradi.",
    body: [
      "Tahorat gunohlarni qayta-qayta yuvishdir. Payg'ambarimiz sollallohu alayhi vasallam mo'min kishi har bir a'zosini yuvsa, u a'zoning qilgan noto'g'ri amallari ko'zlari, qo'llari, oyoqlari bilan suv bilan birga o'tib ketishini, to toki inson gunohdan pok bo'lib chiqmaguncha, o'rgatgan. Shunday qilib, tahorat oldidan o'qilgan namoz yangi mag'firatga ega bo'ladi.",
      "Bu keyingi hayotda ham alohida sharafdir. Payg'ambarimiz sollallohu alayhi vasallam qiyomat kuni o'z tarafdorlarini yuzlari, qo'llari va oyoqlaridagi tahorat izlaridan taniydilar - bu ummatga xos nur bo'lib, \"al-g'urr al-muhajjalun\" deb ataladi.",
      "Ana shu fazilatlari tufayli tahoratli bo'lish tavsiya etilgan odatdir: har bir namozda uni yangilash va tahorat ustida uxlash mo'minning himoya ishlaridandir.",
    ],
    hadith: [
      {
        excerpt:
          "Mening ummatim qiyomat kuni tahorat izidan yuzlari yorug‘, qo‘l va oyoqlari bilan chaqiriladilar. (Abu Hurayra)",
      },
    ],
    actions: [
      "Imkoniyatingiz bo'lgan har bir namoz oynasi uchun tahoratni yangilang.",
      "Tahorat bilan uxlashni kechaning sunnatiga aylantiring.",
    ],
    appLinks: [{}],
  },
  {
    title: "G'usl nima?",
    summary: "Katta nopoklikni (janabah) olib tashlaydigan to'liq tanadagi marosim hammomi.",
    body: [
      "G'usl - katta nopoklikni (janabah) olib tashlash niyatida butun vujudni yuvish marosimidir. Agar tahorat kichik nopoklikka qaratilgan bo'lsa, g'usl yaqinlik, jinsiy aloqa, hayz ko'rish yoki tug'ruqdan keyingi qon ketishdan keyingi kattaroq holatga murojaat qiladi.",
      "Uning mohiyati shundaki, suv tashqi tananing har bir qismiga etib boradi - quruq nuqta qolmasligi mumkin, shu jumladan soch ildizlari, teri burmalari, quloq orqasi, kindik va oyoq barmoqlari orasiga. Og'iz va burunni chayish ko'p ulamolar tomonidan g'uslga kiritilgan.",
      "Janobni ko‘tarish niyatida qilingan bir g‘usl ham kichik najosatni ketkazadi, shuning uchun g‘uslni tamomlagan kishi alohida tahoratsiz namoz o‘qishi mumkin (garchi g‘usl ichida tahorat olish sunnatdir).",
    ],
    quran: [
      {
        excerpt: "Agar janob bo'lsangiz, pok bo'ling.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "G'usl kerak bo'lganda",
    summary: "To'liq marosim hammomini majburiy yoki tavsiya qiladigan holatlar.",
    body: [
      "G'usl bir necha aniq hollarda vojib bo'ladi (farz): shahvat bilan jinsiy suyuqlik chiqishi (uyg'onish yoki ho'l tush orqali); Jinsiy aloqaning o'zi, hatto jinsiy aloqada bo'lsa ham - Rasululloh sollallohu alayhi vasallam ikkalasi qo'shilsa, g'usl qilish kerak, dedilar. va hayz (hayd) yoki tug'ruqdan keyingi qon ketish (nifos) tugashi. O'lim ham o'lganning tirikga g'uslini farz qiladi.",
      "Farz emas, balki boshqa g'usllar tavsiya qilingan (mustahab)dir: Juma kunidan oldin juma kuni g'usl olish juda qattiq targ'ib qilinganki, Payg'ambarimiz sollallohu alayhi vasallam buni har bir balog'atga etgan kishiga farz deb atadilar. ikki hayit uchun g'usl; va haj yoki umradan oldin ehrom gusli.",
      "Yangi musulmonga Islomga kirgandan so'ng g'usl qilish buyuriladi - ba'zi ulamolar tomonidan farz qilingan va boshqalar tomonidan qat'iy tavsiya etilgan.",
    ],
    hadith: [
      {
        excerpt:
          "Erkak xotinining to‘rt a’zosi orasiga o‘tirsa va u bilan yaqinlik qilsa, g‘usl vojib bo‘ladi. (Abu Hurayra; Yana Sahih Musulmon 348)",
      },
      {
        excerpt:
          "Juma kuni g'usl olish balog'at yoshiga etgan har bir kishiga farzdir. (Abu Said al-Xudriy; Yana Sahih Musulmon 846)",
      },
    ],
    disclaimer:
      "Juma va g'usl farzmi yoki qat'iy tavsiya qilinadimi, maktab va sharoitga qarab farq qiladi.",
    appLinks: [{}],
  },
  {
    title: "Bosqichma-bosqich g'usl",
    summary: "Payg'ambarlik usuli - minimal farz va to'liq sunnat.",
    body: [
      "Oisha roziyallohu anho Rasululloh sollallohu alayhi vasallamning g'usllarini batafsil bayon qilganlar va undan ulamolar eng kam g'uslni ham, to'liqroq sunnat usulini ham chiqarib olishgan. Minimal oddiygina: niyat va suv butun tanaga etib borishi (ko'pchilik uchun og'iz va burunni yuvish bilan). Quyida Rasululloh sollallohu alayhi vasallamning o'zlari buni qanday qilgani to'liq ko'rsatilgan.",
      "Buni shoshilmasdan bajaring, hech narsa quruq qolmasligi uchun teri bo'ylab suvni ishqalang.",
    ],
    steps: [
      {
        title: "Niyatni shakllantirish",
        body: "Qalbingizda katta marosim nopokligini (janabah) olib tashlashni niyat qiling.",
      },
      {
        title: "Bismillah ayting va qo'lingizni yuving",
        body: "Alloh nomi bilan boshlang va ikki qo'lingizni yuving.",
      },
      {
        title: "Shaxsiy maydonni yuving",
        body: "Avrat joylarini chap qo'l bilan olib tashlang.",
      },
      {
        title: "To'liq tahorat qiling",
        body: "Namozdagidek tahorat qiling. Agar to'plangan suvda tursangiz, oyoqlarni yuvishni oxirigacha kechiktirishingiz mumkin.",
      },
      {
        title: "Boshiga uch marta suv quying",
        body: "Suvni bosh terisi va soch ildizlariga surting.",
      },
      {
        title: "O'ng tomonni, keyin chap tomonni yuving",
        body: "O'ngdan boshlab butun tanaga suv quying va ishqalang.",
      },
      {
        title: "To'liq qamrovni ta'minlang",
        body: "Hech qanday quruq joy qoldirmang - qo'ltiq osti, kindik, tizza va quloq orqasida va oyoq barmoqlari orasida.",
        tip: "Ayollarga suvning bosh terisiga yetib borishi sharti bilan o'rilgan sochlarini yechishga hojat yo'q.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Rasululloh sollallohu alayhi vasallam janobdan cho'milganda, qo'llarini yuvar, namoz uchun tahorat olar, barmoqlarini sochlariga o'tkazar, so'ngra uch marta boshlariga suv quyib, badanlarining qolgan qismiga suv quyib, namozga qo'yardilar. (Oisha)",
      },
    ],
  },
  {
    title: "G'usl qilishda keng tarqalgan xatolar",
    summary: "Quruq joylardan, yomon niyatdan va dushni g'usl bilan adashtirishdan saqlaning.",
    body: [
      "Eng asosiy xato oddiy dushga g'usl sifatida qarashdir. G'usl uchun katta najosatni ko'tarish niyati bo'ladi; usiz, qancha vaqt yuvsangiz, marosim holati ko'tarilmaydi. Boshlashdan oldin niyatni shakllantiring.",
      "Ikkinchi keng tarqalgan xato quruq dog'larni qoldirishdir. Farz shundaki, suv butun tanaga tegib tursa, boshning ildizlari, quloqlari, kindiklari, orqa qismining kichik qismi yoki oyoq barmoqlari orasiga e'tibor bermaslik g'uslni to'liq bo'lmaydi. Ishonch hosil qilish uchun suvni bu joylarga surting.",
      "Sochlar uchun: sochi o‘ralgan ayolning sochi o‘ralgan bo‘lsa, sochini yechmasligi shart emas, agar suv bosh terisi ildiziga yetib borsa, — Payg‘ambarimiz sollallohu alayhi vasallam Ummu Salamaga boshiga uch hovuch quyishning o‘zi kifoya, dedilar. Erkakning sochlari, odatda, bo'shashmasdan, suv ildizlariga etib borishi uchun ishlov berilishi kerak.",
    ],
    hadith: [
      {
        excerpt:
          "Boshingizga uchta hovuch suv quyishingiz kifoya, keyin o'zingizga suv quying va siz poklanasiz - ortiqcha oro bermay iplaringizni yechishingiz shart emas. (Ummu Salama)",
      },
    ],
    actions: [
      "Birinchi quyishdan oldin niyat ayting, shuning uchun yuvish g'usl hisoblanadi.",
      "Osonlik bilan o'tkazib yuborilgan joylarni suv bilan ishqalang; noaniq bo'lsa, shubha bilan tugatgandan ko'ra, qismni qayta yuving.",
    ],
  },
  {
    title: "Tayammum nima?",
    summary: "Suvdan foydalanish mumkin bo'lmaganda toza tuproq bilan quruq tozalash.",
    body: [
      "Tayammum (timm) - suv haqiqatan mavjud bo'lmaganda yoki undan foydalanish mumkin bo'lmaganda tahorat yoki g'uslning o'rnini bosuvchi rahmdil. Yuvish o'rniga, kaftlar bilan toza tuproqqa uriladi va yuz va qo'llarga artiladi va bu suvni tozalash o'rnini to'liq egallaydi va to'g'ri namoz o'qishga imkon beradi.",
      "Tayammum, xususan, bu ummatga tuhfadir: Rasululloh sollallohu alayhi vasallam: “Yer men uchun namozgoh va poklanish vositasi qilib qo‘yildi”, dedilar va uni avvalgi payg‘ambarlarga emas, balki o‘ziga berilgan imtiyozlar qatoriga kiritdilar. Bu dinning asosiy tamoyilini o'zida mujassam etgan - majburiyat saqlanib qoladi, ammo qiyinchilik ko'tariladi.",
      "Bu vaqtinchalik chora: suv mavjud va foydalanishga yaroqli bo'lgach, suv bilan oddiy tozalash qayta boshlanadi. Ba'zi mazhablarga ko'ra, kishi har bir namoz uchun tayammumni yangilashi kerak bo'lishi mumkin.",
    ],
    quran: [
      {
        excerpt:
          "...va suv topmasangiz, toza tuproq bilan tayammum qiling va u bilan yuzlaringizni va qo'llaringizni arting.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Yer men uchun namozgoh va poklanish vositasi qilib berildi. (Jobir - Rasululloh sollallohu alayhi vasallamga berilgan besh narsadan)",
      },
    ],
  },
  {
    title: "Tayammumga ruxsat berilganda",
    summary:
      "Suv yo'q bo'lganda, zararli yoki omon qolish uchun zudlik bilan zarur bo'lganda ruxsat etiladi.",
    body: [
      "Tayammum uchta keng holatda joizdir. Birinchidan, oqilona qidiruvdan keyin suv topilmaganda - cho'lda sayohatchi yoki haqiqatan ham kirish imkoni bo'lmagan har qanday odam. Ikkinchidan, suvdan foydalanganda zarar keltirishi mumkin: yaralari yoki kasalligi kuchaygan bemorlar uchun yoki suvni isitish uchun hech qanday vosita bo'lmagan qattiq sovuqda va haqiqiy zarar xavfi.",
      "Uchinchidan, mavjud bo'lgan ozroq suv zarur bo'lganda, masalan, ichish, o'ziniki yoki boshqasi yoki hayvonning hayotini saqlab qolish uchun kerak bo'ladi. Har bir holatda shariat hayot va salomatlikni saqlashni afzal ko'rgan poklanish usulidan ustun qo'yadi.",
      "Huquqshunoslar nozik chegaralar bo'yicha farq qiladilar - suvni qanchalik uzoqdan izlash kerak, zarardan qo'rqish qanchalik etarli - lekin ular asosiy rahm-shafqat haqida bir ovozdan: ibodat hech qachon to'xtatilmaydi, faqat osonlashtiriladi.",
    ],
    hadith: [
      {
        excerpt:
          "Tayammum boblarida rivoyat qilingan: Foydalanishga yaroqli suv bo'lmaganda toza tuproq bilan poklanishga imtiyoz.",
      },
    ],
    actions: [
      "Tayammum qilishdan oldin suvni oqilona qidiring.",
      "Agar shifokor yara yoki kasallikni quruq saqlashni tavsiya qilsa, unga amal qiling va tayammum qiling.",
    ],
  },
  {
    title: "Bosqichma-bosqich tayammum",
    summary: "To'g'ri quruq tozalash uchun qisqa, oddiy ketma-ketlik.",
    body: [
      "Tayammum ataylab qisqacha bo'lib, uning maqsadini qiyinchilikda yengillik sifatida aks ettiradi. U toza, tabiiy tuproq yuzasi bilan amalga oshiriladi: tuproq, qum, tosh yoki chang. Uning mohiyati, Rasululloh sollallohu alayhi vasallamning o'z namoyishlaridan tortib, Ammor ibn Yosirga qadar, kaftlarni toza yerga bir marta urish, so'ngra yuz va qo'llarni artishdir.",
      "Bu tahoratdan ko'ra engilroq, shuning uchun unga asoratlar qo'shmang.",
    ],
    steps: [
      {
        title: "Niyatni shakllantirish",
        body: "Ibodat qilish uchun marosimdagi nopoklikni ko'tarishga niyat qiling.",
      },
      {
        title: "Bismilloh deng",
        body: "Alloh nomi bilan boshlang.",
      },
      {
        title: "Ikki kaft bilan toza yerga bir marta uring",
        body: "Xurmolarni toza, changli, tabiiy yuzaga ozgina qo'ying.",
      },
      {
        title: "Yuzni arting",
        body: "Ikki qo'l bilan butun yuzni bir marta artib oling.",
      },
      {
        title: "Qo'llarni artib oling",
        body: "Qo'llarning orqa qismini artib oling - ko'pchilik olimlar tomonidan bilaklargacha.",
        tip: "Bitta maktab usuliga (bilaklar va bilaklar) izchil amal qiling.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Rasululloh sollallohu alayhi vasallam yerga kaftlari bilan urdilar, so'ng yuzlari va qo'llarini artdilar va Ammorga buning o'zi kifoya ekanini aytdilar. (Ammar ibn Yosir)",
      },
    ],
  },
  {
    title: "Tayammumni nima buzadi?",
    summary:
      "Odatiy tahoratni buzuvchilar bilan - va foydalanishga yaroqli suvni qaytarish bilan bekor qilinadi.",
    body: [
      "Tahorat o'rniga qilingan tayammum tahoratni buzadigan har bir narsa bilan buziladi: yengillik, shamol o'tkazish, chuqur uyqu va hokazo. G'usl o'rniga tayammum esa katta najosatga sabab bo'ladigan har qanday narsa bilan qo'shimcha ravishda buziladi.",
      "Tayammumning o'ziga xos tomoni shundaki, tayammum uning sababini yo'q qilish, ya'ni foydalanishga yaroqli suvga ega bo'lish bilan ham tugaydi. Suv topilsa va foydalanish mumkin bo'lsa, imtiyoz tugaydi va tahorat yoki g'uslga qaytadi.",
      "Amaliy rahm-shafqat: agar siz to'g'ri tayammum bilan namoz o'qigan bo'lsangiz va shundan keyingina suv topsangiz, ko'pchilik tugallangan namozni takrorlash shart emas, deb hisoblaydi - bu o'sha paytda amal qilgan hukm bo'yicha to'g'ri o'qilgan. Ammo namozdan oldin suv paydo bo'lsa, uni ishlatish kerak.",
    ],
    actions: [
      "Har bir namoz vaqtining boshida suv borligini qayta tekshiring.",
      "Suvdan foydalanish mumkin bo'lgandan so'ng, kechiktirmasdan suv bilan tozalashga qayting.",
    ],
    disclaimer:
      "Ba'zi tafsilotlar, masalan, o'z vaqtida suv topilgandan keyin namoz takrorlanadimi yoki yo'qmi - maktabga qarab farq qiladi.",
  },
  {
    title: "Nopokliklar (najosa)",
    summary:
      "Tanadan, kiyimdan va ibodat joyidan olib tashlanishi kerak bo'lgan jismoniy iflosliklar.",
    body: [
      "Najosa (njạsẗ) hadisning marosim holatlaridan ajralib turadigan aniq marosim iflosligidir. Kelishilgan aniq misollar orasida inson siydigi va axlati, oqayotgan qon, cho'chqa go'shti va oqishi, itning tupurig'i (bu maxsus yuvishni talab qiladi). Tanadagi najosatni, kiygan kiyimni va namoz joyini olib tashlash namozning to'g'ri bo'lishi uchun shartdir.",
      "Nopoklik ko'rinadigan joyda suv bilan olib tashlanadi, modda va uning izlari yo'qolguncha yuviladi. Islom dini najosat manbalariga ham jiddiy munosabatda bo'ladi: Payg'ambarimiz (s.a.v.) qabr azobining ko'p qismi siydik bilan ehtiyotsizlik - undan sachratish va noto'g'ri tozalashdan kelib chiqishi haqida ogohlantirganlar.",
      "Maktablar ba'zi moddalarni tasniflashda (masalan, oz miqdorda ma'lum suyuqliklar kechiriladimi yoki yo'qmi) va qanday iz miqdoriga yo'l qo'yilishi bo'yicha farq qiladi. Kundalik hayotning amaldagi printsipi: yaxshilab tozalang va ifloslik isboti bo'lmagan joyda poklikka shubha qilmang.",
    ],
    hadith: [
      {
        excerpt:
          "Rasululloh sollallohu alayhi vasallam ikkita qabrning yonidan o'tib, ulardagilar jazolanayotganini aytdilar: biri tuhmat tarqatgani uchun, ikkinchisi esa siydikdan saqlamagani uchun. (Ibn Abbos; Yana Sahihi Musulmon 292)",
      },
    ],
  },
  {
    title: "Kiyimlarni nopoklikdan tozalash",
    summary: "Kiyimni qanday yuvish kerakki, unda namoz o'qish to'g'ri bo'ladi.",
    body: [
      "Najosa kiyimga kirsa, moddaning o'zi va uning ko'rinadigan izi yo'qolguncha zararlangan joyni suv bilan yuving. Rasululloh sollallohu alayhi vasallam kiyimi hayz qoni bo'lgan ayolga uni qirib tashlashni, so'ngra suv bilan surtishni, keyin yuvib, namoz o'qishni buyurdilar.",
      "Agar samimiy va sinchkovlik bilan harakat qilgandan so'ng, xira rangdagi dog 'yoki engil hid qolsa, u chiqmaydi, ko'pchilik olimlar olib tashlash haqiqatan ham qiyin bo'lgan narsani kechiradilar - majburiyat beg'ubor bo'yoqni kafolatlash emas, balki moddani olib tashlashdir.",
      "Ba'zi holatlarning o'ziga xos tafsilotlari bor, masalan, ko'krak suti bilan boqiladigan chaqaloqning siydigi (ma'lum qilingan imtiyozda to'liq yuvilgan emas, balki sepiladi) - shuning uchun siz haqiqatda duch keladigan vaziyatlar uchun maktabingizning amaliy qoidalarini bilib oling.",
    ],
    hadith: [
      {
        excerpt:
          "Kiyimdagi hayz qoni haqida: uni qirib tashlang, so'ngra suv bilan surting, keyin yuving va unda namoz o'qing. (Asmo binti Abu Bakr)",
      },
    ],
    actions: [
      "Namoz uchun kamida bitta toza kiyimni ajratib qo'ying.",
      "Agar uydan uzoqda kiyimingizga kir tegsa, iloji boricha yuving va iloji boricha o'zgartiring.",
    ],
  },
  {
    title: "Tanani tozalash",
    summary: "Tanadagi iflosliklarni olib tashlash, istinja va gigiena odobi.",
    body: [
      "Namozdan oldin tanadagi kirlarni o'z imkoniyatiga qarab yuvish kerak. Eng tez-tez uchraydigan holat bu hojatxonadan foydalangandan keyin o'zingizni tozalashdir - istinja - bu joy toza bo'lgunga qadar suv yoki tegishli quruq material bilan amalga oshiriladi. Rasululloh sollallohu alayhi vasallam yengillikdan keyin ehtiyotkorlik bilan tozalashni o‘rgatgan va buning uchun o‘ng qo‘lni ishlatishdan qaytarganlar.",
      "Nopoklikni yo'qotishdan tashqari, Islom tanani toza va ibodat qilishga tayyor bo'lishini ta'minlaydigan tabiiy gigiena (fitra) asoslarini tavsiya qiladi: tirnoqlarni kesish, qo'ltiq ostidagi va qo'ltiq ostidagi tuklarni olib tashlash va shunga o'xshash narsalarni muntazam ravishda.",
      "Bu amallar shunchaki madaniy go'zalliklar emas, balki mo'minning ibodatda Alloh huzurida namoyon bo'ladigan hurmat va poklikning bir qismidir.",
    ],
    hadith: [
      {
        excerpt:
          "Rasululloh sollallohu alayhi vasallam yengillikdan keyin suv bilan tozalar erdilar. (Anas)",
      },
    ],
    actions: [
      "Hojatxonadan chiqqandan keyin tahorat oldidan har doim istijani to'ldiring.",
      "Sayohat paytida ro'molcha va iloji bo'lsa, suv vositasini olib yuring.",
    ],
  },
  {
    title: "Namoz o'qiladigan joylarni tozalash",
    summary: "Namoz joyi ma'lum ifloslikdan toza bo'lishi kerak - hech qanday shubhasiz.",
    body: [
      "Namoz o'qiladigan joy ma'lum najosatdan xoli bo'lishi kerak. Payg'ambarimiz sollallohu alayhi vasallam buni aniq ta'lim berganlar: bir badaviy masjid burchagiga idrar qilganda, sahobalarni qattiq tanbeh qilishdan to'xtatib, gapini tugatib, so'ng joyiga bir chelak suv quyib berishni buyurib, poklikni ham, muloyimlikni ham o'rgatadi.",
      "Boshqaruv qoidasi aniqlikdir. Yer odatda ibodat qilinadigan joy bo'lgan, shuning uchun sizda ifloslik haqida aniq dalillar bo'lmasa, sirt toza hisoblanadi. Agar nopoklik borligini bilsangiz, uni olib tashlang yoki toza joyga o'ting; Agar u erda bo'lishi mumkinligini tasavvur qilsangiz, shivirlashga e'tibor bermang va davom eting.",
      "Bu muvozanat soqchilari ikki ekstremal sig'inadilar: aniq iflos tuproqda beparvolik bilan ibodat qilish va har bir yuzaga asossiz shubha bilan falaj bo'lish.",
    ],
    hadith: [
      {
        excerpt:
          "Bir badaviy masjidda siydik qilganida, Rasululloh sollallohu alayhi vasallam masjidga bir chelak suv quyishni buyurdilar. (Abu Hurayra)",
      },
    ],
    actions: [
      "Namozdan oldin to'shak va polga bir nazar tashlang.",
      "Nopoklikning haqiqiy dalillarisiz, asossiz shubhalardan voz keching va ibodat qiling.",
    ],
  },
  {
    title: "Hayd va poklik",
    summary: "Hayz ko'rish va tug'ruqdan keyingi qon ketishning o'ziga xos tozalash hukmlari bor.",
    body: [
      "Hayz (hayd) va tug‘ruqdan keyingi qon (nifos) vaqtida ayol namoz o‘qimaydi, din rahmatiga ko‘ra, o‘sha vaqtda o‘tkazib yuborilgan namozlari keyin ham qazo qilinmaydi. Oisha roziyallohu anhodan nega hayz ko'rgan ayol namozini emas, ro'zasini tutadi, deb so'ralganda, u ularga shunday buyurilganligini tasdiqladi.",
      "Ro'za boshqacha: hayz ko'rganligi sababli Ramazon oyida tutilgan ro'zalar keyinroq tutiladi, namoz esa shunchaki ko'tariladi. Qon oqishi tugab, poklik alomati paydo bo‘lgach, ayol g‘usl qilib namoz va ro‘zani davom ettiradi.",
      "Hayd va nifosning aniq minimal va maksimal muddatlari, poklikning chegara belgilarini qanday o'qish, maktablar bir-biridan batafsil farq qiladigan masalalardir. Ayollar malakali o'qituvchi bilan bitta ishonchli maktabning amaliy hukmlarini o'rganishdan foyda olishadi.",
    ],
    hadith: [
      {
        excerpt:
          "Oisha roziyallohu anho nega hayz ko'rgan ayol ro'za tutadi, namoz o'qiysiz, degan savolga: «Biz ro'za tutishga buyurilganmiz, namozni qazo qilishga buyurilmaganmiz. (Muozha, Oisha roziyallohu anhodan; Yana Sahihi Musulmon 335).",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Tez-tez so'raladigan savollar",
    summary: "Eng keng tarqalgan tozalash tashvishlari va shubhalariga qisqa javoblar.",
    body: [
      "Shubha tahoratimni buzadimi? Yo'q. Agar siz tahorat olgan bo'lsangiz va uni buzganingizga ishonchingiz komil bo'lmasa, tahoratingiz bekor bo'lganiga amin bo'lguningizcha davom etadi. Gumon ustidan aniqlik asosida harakat qilish sizni obsesif shubhadan (vasvasdan) saqlaydigan bashoratli tamoyildir.",
      "Gipslar, bintlar va yaralar haqida nima deyish mumkin? Imtiyozlar bor. Yopiq a'zoni yuvish zararli bo'lsa, uning o'rniga kiyimni (mash'ala al-jabira) arting, tayammum esa etib bo'lmaydigan narsalarni qoplaydi - tafsilotlar maktab va vaziyatga qarab farq qiladi.",
      "Agar men suvdan umuman foydalana olmasam nima bo'ladi? Toza tuproq bilan tayammum suvdan foydalanish qobiliyati qaytgunga qadar to'liq amal qiladi.",
      "Surunkali holatlar - doimiy qon ketish (istihod) yoki o'zini tuta olmaslik haqida nima deyish mumkin? Kishiga doimiy uzr (ma'dur) bilan munosabatda bo'ladi: ular tozalanadilar va har bir namoz vaqti uchun tahorat oladilar, keyin oqindi davom etsa ham namoz o'qiydilar va bu namozni buzmaydi.",
    ],
    actions: [
      "Doimiy shubhalar ibodatingizni to'sib qo'yishiga yo'l qo'ymang - shubhaga emas, aniqlikka ergashing.",
      "Surunkali holatlar yoki murakkab holatlar uchun malakali olimdan shaxsiy qaror qabul qiling.",
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Ushbu tez-tez beriladigan savollarga javoblar shaxsiy fatvo emas, balki ta'lim mazmuni bo'yicha xulosalardir. Murakkab yoki surunkali holatlar mahalliy olim bilan ko'rib chiqilishi kerak.",
  },
  {
    title: "Adabiyotlar va qo'shimcha tadqiqotlar",
    summary: "Qur'onning asosiy oyatlari va poklanish haqidagi hadis boblari.",
    body: [
      "Qur'oni Karimning poklanish uchun asos bo'lgan matni tahorat, g'usl va tayammumni birgalikda bayon qilgan tahorat oyati Moida surasi 5:6; Uning yonida 2:222 (“Alloh taolo poklanganlarni sevadi”) va suvning pokligi haqidagi oyatlar (25:48) mavzuni o‘z ichiga oladi.",
      "Sunnatda asosiy manbalar “Sahih al-Buxoriy” va “Sahihi Musulmon”ni ochadigan “Tahorat kitoblari” (Tahorat/al-Vudu/al-Gusl/al-Hayd), so‘ngra to‘rtta sunanning bir xil boblari (Abu Dovud, at-Termiziy, an-Nasoiy, Ibgradiy ibnlar)dir.",
      "Amaliy hukmlar uchun to'rtta sunniy mazhablarning klassik fiqh qo'llanmalarida batafsil pozitsiyalar berilgan - va ularning farqlari nuqson emas, balki an'ananing qonuniy qismidir. Ushbu moduldan tuzilgan umumiy ko'rinish uchun foydalaning, so'ngra malakali o'qituvchi va asosiy matnlar bilan o'rganishingizni chuqurlashtiring.",
    ],
    quran: [{}, {}],
    hadith: [
      {
        excerpt:
          "To'plamni ochadigan tahorat, g'usl, tayammum va hayd haqidagi keng qamrovli boblar.",
      },
      {
        excerpt:
          "Poklanish kitobi — tahorat hukmlari, odoblari va tamoyillari haqidagi sahih xabarlar.",
      },
    ],
    actions: [
      "Tarqalgan qarorlardan chalkashmaslik uchun bitta ishonchli o'quv dasturiga amal qiling.",
      "Amaliy ishonch barqaror bo'lgunga qadar ushbu mavzularni vaqti-vaqti bilan qayta ko'rib chiqing.",
    ],
    appLinks: [{}, {}],
  },
];

export const TAHARAH_CHECKLIST_UZ: DeepPartial<TaharahChecklistItem>[] = [
  {
    title: "Bomdoddan oldin tahorat",
    hint: "Iloji bo'lsa kunni poklik holatida boshlang.",
  },
  {
    title: "Misvok / tish cho'tkasi",
    hint: "Tahoratdan oldin va namozdan oldin sunnat.",
  },
  {
    title: "Namoz kiyimlari najosatsiz",
    hint: "Namozdan oldin ko'rinadigan nopoklikni tekshiring.",
  },
  {
    title: "Toza namozgoh",
    hint: "Ibodat qilayotgan joyingizdan harom narsalarni olib tashlang.",
  },
  {
    title: "Tahoratni bekor qiluvchilardan keyin yangilang",
    hint: "Shamol, uyqu, hojatxona - tahoratni buzadigan narsalarni biling.",
  },
  {
    title: "Zarur bo'lganda g'usl",
    hint: "Katta nopoklikdan keyin hayz ko'rish tugaydi yoki tug'ruqdan keyingi qon ketish.",
  },
];
