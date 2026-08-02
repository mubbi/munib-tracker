// Uzbek translation overlay for the Learn "Journey to Jannah" content. Mirrors the order of
// its English source in ../jannah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  JannahDuaEntry,
  JannahGate,
  JannahPromisedEntry,
  JannahTopic,
  JannahVerseEntry,
} from "../../types/jannah";
import type { DeepPartial } from "./localize";

export const JANNAH_TOPICS_UZ: DeepPartial<JannahTopic>[] = [
  {
    title: "Jannat nima?",
    summary: "Alloh solihlar uchun tayyorlab qo'ygan abadiy jannat.",
    body: [
      "Jannat Alloh taolo O'ziga iymon keltirgan va solih amallar qilgan zotlar uchun tayyorlab qo'ygan abadiy ajr uyidir. Bu soʻz tom maʼnoda yam-yashil, soyali bogʻ degan maʼnoni bildiradi — lekin Qurʼon uni yerdagi har qanday bogʻdan koʻra buyukroq haqiqat uchun ishlatadi: daryolar, mevalar, qasrlar va doʻstliklardan iborat boʻlib, u yerda moʻmin Robbisining roziligi bilan abadiy yashaydi. Bu har bir payg'ambar odamlarni da'vat qilgan maqsad va bu butun sayohatning maqsadidir.",
      "Jannatdagi hayot bu dunyodagi hech narsaga o'xshamaydi, chunki u erdagi baxtga putur etkazadigan har qanday nuqsonlardan xoli. O'lim, kasallik, qarilik, qo'rquv, qayg'u va charchoq yo'q. Uning odamlari hech qachon bahslashmaydi, charchamaydi va sevgan narsasini yo'qotmaydi. Qalb nima istasa, ijobat bo'ladi va Alloh O'z saxiyligidan yana ziyoda qiladi: \"Ular uchun u erda xohlagan narsalari bordir va Bizning huzurimizda ko'proqdir\" (Qur'on 50:35).",
      "Jannatning ne'matlari inson tasavvuriga sig'maydi. Hadisi qudsiyda Alloh taolo O'zining solih bandalari uchun hech bir ko'z ko'rmagan, hech bir quloq eshitmagan va qalb o'ylab topmagan narsalarni tayyorlab qo'yganini aytadi. Shuning uchun ham Qur'on jannatni tanish suratlarda - bog'lar, daryolar va soyalarda tasvirlab, haqiqat har qanday ta'rifdan buyukroq ekanligini eslatadi. Eng ulug‘ mukofot bu bog‘larning o‘zi emas, balki Allohning rizoligi va oliy martabalari uchun Uning ulug‘ yuziga qarash sharafidir.",
      "Mo'min ikki haqiqatni birlashtirib turishi kerak. Birinchidan, jannat haqiqiy, yaqin va har qanday sa'y-harakatlarga arziydi - Qur'on bizga unga \"poyga\" borishimizni aytadi (Qur'on 3:133). Ikkinchidan, hech kim jannatga faqat amali bilan erishmaydi; Oxir oqibat, kirish Allohning rahmati bilan bo'lib, ixlos iymon va yaxshi amallar U tanlagan vositadir. Bu muvozanat umidni mag'rurlikka olib kelmasdan saqlab qoladi: biz bor kuchimizni ishga solamiz, so'ngra o'zimizni Uning rahm-shafqatiga bag'ishlaymiz.",
      "Amalda, kundalik tanlovlaringizni Jannat haqiqati shakllantirsin. Agar ibodat og'ir bo'lsa yoki vasvasa kuchli bo'lsa, nima kutayotganini va nima xavf ostida ekanligini eslang. Allohdan tez-tez jannatni so'rang, u uchun kichik barqaror yo'llar bilan doimiy ravishda harakat qiling va bu o'tkinchi hayotda unga intilish qalbingizni yumshatsin.",
    ],
    quran: [
      {
        excerpt:
          "Parvardigoringiz tomonidan mag'firat va kengligi osmonlaru yerdek bo'lgan, taqvodorlar uchun tayyorlangan jannatga yuguring.",
      },
      {
        excerpt:
          "Alloh mo'min va mo'mina ayollarga ostidan anhorlar oqib turadigan, ular abadiy qoladigan jannatlarni va abadiy jannatlardan go'zal maskanlarni va'da qildi. Lekin Allohning rizosi kattaroqdir.",
      },
      {
        excerpt:
          "Ularga qilgan amallarining mukofoti sifatida nima yashiringanini hech bir jon bilmas.",
      },
      {
        excerpt: "Ularga u yerda xohlagan narsalari bordir. Bizning huzurimizda ko'proq narsa bor.",
      },
      {
        excerpt: "Iymon keltirgan va solih amallar qilgan zotlar uchun panoh jannatlari bordir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Alloh taolo aytdi: «Men solih bandalarim uchun hech bir ko‘z ko‘rmagan, quloq eshitmagan va qalb o‘ylab ko‘rmagan narsalarni tayyorlab qo‘ydim.",
      },
      {
        excerpt:
          "Alloh taolo aytadi: “Men solih bandalarim uchun hech bir ko‘z ko‘rmagan, hech bir quloq eshitmagan va hech bir inson qalbi sezmagan narsalarni hozirlab qo‘ydim.",
      },
    ],
  },
  {
    title: "Jannatdagi darajalar",
    summary: "Jannatning ko'p darajalari bor - etti zinapoya emas.",
    body: [
      "Jannat bitta tekis joy emas; Uning ko'p darajalari bo'lib, ular darajat deb ataladi va mo'minlar uning ichida iymon va amallariga ko'ra ko'tariladilar. Juda keng tarqalgan noto'g'ri tushuncha - jannatning roppa-rosa etti darajasi bor. Bu ikki xil narsani chalkashtirib yuboradi: Qur'onda jannatning yetti qat'iy darajasi emas, yetti osmon (samovat) - ustimizdagi yaratilgan osmon haqida so'z boradi. Matnlar hech qachon jannatni yetti daraja bilan cheklamaydi.",
      "Haqiqiy manbalar bizga aytadigan narsa shundaki, saflar juda ko'p va keng. Rasululloh sollallohu alayhi vasallam jannatda Alloh yo‘lida jihod qiluvchilar uchun yuzta daraja tayyorlab qo‘yilgan bo‘lib, bir daraja bilan ikkinchi daraja o‘rtasidagi masofa osmon bilan yer orasidagi masofadek ekanini aytdilar. Hatto bu raqam biz katakchalarni belgilab ko'tarilishimiz mumkin bo'lgan qattiq zinapoyadan ko'ra ulkanlikka ishora qiladi.",
      "Alloh taolo har bir mo‘minni iymonining mustahkamligiga, niyatining ixlosiga va amallarining og‘irligiga qarab yuksaltiradi — “Hamma uchun qilgan amaliga yarasha darajalar bordir” (6:132). Har bir insonning aniq martabasi faqat Allohga ma'lum. Vahiy ataylab bizga \"N darajasiga erishish uchun X amalni bajaring\" mexanik nazorat ro'yxatini bermaydi, chunki ibodat daraja hisoblash bilan emas, balki sevgi va samimiylik bilan boshqarilishi kerak.",
      "Bunda hikmat go'zal. Agar biz o'z joyimizni aniq bilsak, ba'zilar o'z-o'zidan mamnun bo'lardi, boshqalari esa umidsizlikka tushishadi. Buning o'rniga ko'zimizni Allohga qaratish, harakat qilish va umid qilishni davom ettirish o'rgatilgan. Mo'min yaxshilik bilan raqobatlashadi - \"buning uchun raqobatchilar raqobatlashsin\" - yakuniy bahoni eng adolatliga qoldiradi.",
      "Demak, sanoqli darajani maqsad qilgandan ko'ra, eng yuqori darajani maqsad qilib qo'ying va Alloh sizni xohlagan joyiga qo'ysin. Rasululloh sollallohu alayhi vasallam sahobalarga oddiy so'rov bilan kifoyalanmaslikni, balki jannatning eng cho'qqisi bo'lgan Firdavsni maxsus so'rashni o'rgatganlar.",
    ],
    quran: [
      {
        excerpt: "Hammaga qilgan amallariga yarasha darajalar bordir.",
      },
      {
        excerpt:
          "Qarangki, Biz ulardan ba'zilarini ba'zilaridan qanday ustun qo'yganimizni, oxirat esa darajalari kattaroq va farqi ulug'roqdir.",
      },
      {
        excerpt:
          "Kim Allohga va Payg'ambarga itoat qilsa, bas, ular Alloh ne'mat ato etgan zotlar: payg'ambarlar, rostgo'ylar, shahidlar va solihlar bilan birga bo'lurlar. Ular qanday ajoyib hamrohlar!",
      },
    ],
    hadith: [
      {
        excerpt:
          "Jannatda Alloh O'z yo'lida jang qiluvchilar uchun tayyorlab qo'ygan yuzta daraja bor. Har ikki daraja orasidagi masofa osmon bilan yer orasidagi masofaga tengdir. Bas, Allohdan so'rasangiz, Firdavsni so'rang, chunki u jannatning eng yaxshi va eng oliy joyidir.",
      },
      {
        excerpt:
          "Allohdan so'rasangiz, Firdavsni so'rang, chunki u jannatning eng baland joyi va jannatning o'rtasidir va undan jannat daryolari oqib chiqadi va uning tepasida Rahmonning Arshi bor.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Al-Firdavs - eng yuqori",
    summary: "Jannat cho'qqisi, Arshga eng yaqin.",
    body: [
      "Al-Firdavs sahih sunnatda nom olgan jannatning eng oliy va eng zoʻr darajasidir. Rasululloh sollallohu alayhi vasallam uni jannatning eng yaxshisi va uning o'rtasi, ya'ni qalbi, jannat daryolari undan kelib chiqadi va uning tepasida Rahmonning Arshi bor, deb ta'riflaganlar. “Al-Firdavs”ga yetish, har qanday maxluqot kabi Allohga yaqin bo'lishdir.",
      "Bu mavzuni juda amaliy qiladigan narsa - bu payg'ambarlik yo'l-yo'riqlari: biz jannatga duo qilganimizda, biz past niyat qilmasligimiz kerak. Rasululloh sollallohu alayhi vasallam sahobalarga Allohdan jannat so‘raganda, kichikroq so‘rov bilan o‘tirmay, alohida Firdavsni so‘rashlarini o‘rgatganlar. Allohning saxiyligi cheksizdir, shuning uchun Undan faqat minimal narsani so'rash o'ziga xos kamchilikdir. Bu bizga ibodatda shuhratparastlikni o'rgatadi: cho'qqiga intiling va Alloh O'z rahmati bilan sizni qayerga joylashtirishga qaror qilsin.",
      "Qanday qilib xizmatkor bunday martabaga nomzod bo'ladi? Vositalar ham jannatning o'ziga olib boradigan va poklik ila intiluvchi vositalardir: ixlos bilan qilingan sog'lom iymon (tavhid), Alloh buyurgan farzlarni sidqidildan bajarish, so'ngra ularning ustiga o'sib borayotgan nafl ibodatlar - tungi namoz, ro'za tutish, zikr, sadaqa va go'zal xulq. Mashhur hadis qudsiyda Alloh taolo bandaning nafl amallari bilan yaqinlashishini Alloh taolo uni sevmaguncha bayon qiladi.",
      "Ammo oxirgi va hal qiluvchi sovg'a hamisha Allohning rahmatidir. Xuddi shu nafasda biz yuksaklikka intilamiz, Payg'ambarimiz sollallohu alayhi vasallamning o'z so'zlarini eslaymiz: hech kim jannatga faqat o'z amali bilan kirmaydi, hatto Payg'ambar sollallohu alayhi vasallam ham, faqat Alloh uni O'z rahmatiga o'rab oladi. Bu mo'minning mukammal muvozanatidir: bir tomonda ko'tarilgan umid va shuhratparastlik, boshqa tomondan samimiy kamtarlik.",
      "Bas, Firdavsni sajdada, kechaning oxirgi uchdan birida va uyqudan oldin duolaringizning bir qismiga aylantiring, holbuki, har kuni qo'lingizdan kelganicha jimgina ish tutib, qolganlarida esa Parvardigoringizning rahmatiga suyaning.",
    ],
    hadith: [
      {
        excerpt:
          "Allohdan so'rasangiz, Firdavsni so'rang, chunki u jannatning eng baland joyi va jannatning o'rtasidir va undan jannat daryolari oqib chiqadi va uning tepasida Rahmonning Arshi bor.",
      },
      {
        excerpt:
          "Sizlardan hech biringiz o'z amali bilan jannatga kirmaydi. Ular: «Siz ham emasmisiz, ey Allohning Rasuli?» dedilar. U: «Magar Alloh meni O'zining rahmati bilan qamrab olmasa, men ham emasman», dedi.",
      },
    ],
    actions: [
      "Duoda, ayniqsa sajdada va uxlashdan oldin Allohdan Firdavsni so'rang.",
      "O'zingga farz bo'lgan narsalarni mukammal qil, so'ngra nafl ibodatni ko'paytir.",
      "Tavbani tez-tez yangilang va faqat amallaringizga emas, Allohning rahmatiga tavakkal qiling.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Oxiratga xavf soladigan narsa",
    summary:
      "Katta gunohlar chin dildan tavba qilishni talab qiladi; Allohning mag'firati kengdir.",
    body: [
      "Bu bo'lim sizni tushkunlikka solib qo'rqitish uchun mo'ljallanmagan - buning aksi. Alloh taolo O‘ziga ixlos bilan qaytgan kimsaning barcha gunohlarini mag‘firat qiladi va buni eng qattiq tilda e’lon qiladi: “Ayting: Ey o‘zlariga tajovuz qilgan bandalarim, Allohning rahmatidan noumid bo‘lmanglar. Albatta, Alloh barcha gunohlarni mag'firat qilguvchidir» (Qur'on 39:53). Bu erda maqsad shunchaki matnlar nimadan ogohlantirayotganini bilishdir, shunda biz xavfni anglab, kech bo'lmasdan Unga qaytishga shoshilamiz.",
      "Boshqa gunohlardan ajralib turadigan bitta gunoh bor: shirk — ibodatda Allohga shirk keltirish. Bu yagona gunohdir, agar biror kishi tavba qilmasdan o'lsa, Alloh kechirmaydi, buni Qur'on 4:48 da ochiq-oydin bayon qilgan. Qolgan hamma narsa “U zot undan ozroq narsani O'zi xohlagan kishi uchun kechiradi” ostidadir. Shuning uchun ham har bir qabul qilingan amalning tagida to‘g‘ri tavhid asos bo‘ladi: yorilgan poydevor ustiga qurilgan uy turolmaydi.",
      "Shirkdan keyin matnlar namozni tark etishga alohida ahamiyat beradi. Besh vaqt namozni doimiy ravishda va uzrsiz tark qilish sunnatdagi eng og‘ir ogohlantirishlardandir – Payg‘ambarimiz sollallohu alayhi vasallam namozni mo‘minni ajratib turuvchi ahd deb ataganlarki, uni tark etish kufrga yaqinlashadi. Boshqa katta gunohlar - nohaq odam o'ldirish, nohaq munosabatlar, foiz iste'mol qilish, yetimning molini yeyish va qattiq zulm - chin dildan tavba qilishni talab qiladigan og'ir ishlar bo'lib, agar Alloh kechirmasa, jazosi bo'lishi mumkin.",
      '"Kichikroq" deb ataladigan gunohlar ham muhim va ularni hech qachon engillashtirmaslik kerak. G‘iybat, yolg‘on, takabburlik, oila rishtalarini buzish, g‘aflat sekin-asta qalb va xulq-atvorni buzadi. Rasululloh sollallohu alayhi vasallam yig‘ilgan mayda tayoqlar butun bir taom tayyorlaganidek, yig‘ilgan mayda gunohlar ham odamni halok qilishi haqida ogohlantirganlar. Ularning har biri Allohga qaytishga muhtojdir.',
      "Olib tashlash - bu harakatdagi umid: hech qachon gunohning kattaligi sizni tavba qilishning ma'nosizligiga ishontirmasin. Tushungan lahzada Allohga qayting, yomon ishni o'chirish uchun yaxshilik bilan ergashing va har kuni istig'for eshigini ochiq tuting. Uning rahmati har doim sizning xatolaringizdan kattaroqdir.",
    ],
    quran: [
      {
        excerpt:
          "Albatta, Alloh O'ziga shirk qo'shishni kechirmas, balki undan ozroq narsani O'zi xohlagan kishi uchun kechirur.",
      },
      {
        excerpt:
          "Ayting: Ey o'zlariga zulm qilgan bandalarim, Allohning rahmatidan noumid bo'lmanglar. Albatta, Alloh barcha gunohlarni kechiradi.",
      },
    ],
    hadith: [
      {
        excerpt: "Biz bilan ular orasidagi ahd namozdir. Kim uni tark etsa, kufrga kirdi.",
      },
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Fiqhdagi katta gunohlar ro'yxati olimga qarab farqlanadi va shaxslarga oid hukmlar malakali kishilarga tegishlidir. Bu tavba qilish uchun umumiy eslatmadir - shaxsiy hukm emas. Vaziyatingiz uchun ishonchli olim bilan maslahatlashing.",
  },
  {
    title: "Matnlarda hurmatga sazovor bo'lganlar",
    summary:
      "Jannat haqida Rasululloh sollallohu alayhi vasallamning nomlarini bergan odamlar va guruhlar.",
    body: [
      "Qur'on va Sunnatda ayrim shaxslar, mo'minlar toifalari va jannat xushxabari bilan bog'liq amallar alohida ko'rsatilgan. Bularni to'g'ri o'qish juda muhim: ular o'sha aniq odamlar yoki tavsiflar to'g'risidagi halol xabarlardir - ular shunchaki ularning ismlarini eshitgan yoki ularga qoyil qolgan har bir kishi uchun o'tkazilmaydigan kafolat emas. Xushxabar ularning iymonlari va amallariga tayanadi va xuddi shunday eshiklar bizga xuddi shu vositalar orqali ochiqdir.",
      "Ulardan eng mashhuri o‘nta va’da qilingan jannat (al-Ashara al-Mubashshara) bo‘lib, uni Payg‘ambarimiz sollallohu alayhi vasallam bir rivoyatda jamlaganlar: Abu Bakr, Umar, Usmon, Ali, Talha, Zubayr, Abdurrahmon ibn Avf, Sa’d ibn Abu Vaqqos, Sa’id ibn Abu Vaqqos, Said ibn Al-Zaybar (r.a.) hammasidan mamnun). Bular Payg'ambarimiz sollallohu alayhi vasallamning sahobalarining eng yaqinlari va eng fidoyilari edilar va ahli sunnat ularning barchasini sevib, hech birini kamsitmasdan, hurmat qiladilar.",
      "Matnlarda nomlari zikr etilgan shaxslardan tashqari, xushxabar berilgan toifalar ham tasvirlangan: rostgo‘ylar va sabrlilar, Islom shariatiga ko‘ra Alloh yo‘lida haqiqiy shahid bo‘lib vafot etganlar va bu hayotdagi so‘nggi so‘zlari iymon guvohligi bo‘lganlar, la ilaha illalloh. Har bir ta'rif nafaqat zohiriy belgi emas, balki ichki haqiqatga - samimiyatga, qurbonlikka yoki oxirgi nafasda Allohga bog'langan qalbga ishora qiladi.",
      "Biz uchun saboq, birlashish orqali o'zini xavfsiz his qilish yoki o'zimiz uchun bu darajalarga da'vo qilish emas, balki ilhom olishdir. Ularning o'rnaklari bizni yuqoriga tortsin: ular sevgan narsasini seving, ular harakat qilganda intiling va bu hayratni duo va amalga aylantiring, eng avvalo Allohdan husn-ul-hatima so'rang - yaxshi yakun.",
    ],
    hadith: [
      {
        excerpt:
          "Abu Bakr jannatda, Umar jannatda, Usmon jannatda, Ali jannatda, Talha jannatda, Zubayr jannatda, Abdurrahmon ibn Avf jannatda, Sa'd jannatda, Said ibn Zayd jannatda va Abu al-Ubayda jannatdadir.",
      },
      {
        excerpt: "Kimning oxirgi so'zi \"La iloh yo'q Alloh\" bo'lsa, jannatga kiradi.",
      },
    ],
    disclaimer:
      "Hadislardagi xushxabar, zikr qilinganlar yoki tavsiflangan toifalarga tegishlidir. Ular insonning o'z e'tiqodi, amali va yaxshi oxiriga bo'lgan ehtiyojni almashtirmaydi. Alloh bilguvchidir.",
  },
  {
    title: "Tavhid - to'g'ri e'tiqod",
    summary: "Ixlos tavhidsiz hech bir amal qabul qilinmaydi.",
    body: [
      "Tavhid, yolg'iz Allohni ibodat uchun tanlab aytishni anglatadi - U yolg'iz Parvardigor va Yaratuvchi ekanligiga, faqat Ugina ibodat qilishga loyiq ekanligiga va O'zining ismlari va sifatlarida yagona ekanligiga ishonishdir. Bu har bir payg'ambar yuborilgan xabar va insonning Islomga kirgan birinchi narsasidir. Chunki u biz topinayotgan Zotga tegishli bo'lib, u butun din binosi ustida turgan poydevordir.",
      "Uning ahamiyatini ortiqcha ta'riflab bo'lmaydi: Alloh taolo O'ziga shirk keltirgan kishidan hech qanday amalni qabul qilmaydi. “Agar Allohga shirk keltirsangiz, amallaringiz barbod bo‘lur” (39:65). Shirk ustiga qurilgan bir tog' qiyomatda hech qanday og'irlik qilmaydi, sof tavhid asosida qurilgan eng kichik amal esa nihoyatda og'ir bo'lishi mumkin. Shuning uchun iymon-e’tiqodni saqlash amallarni ko‘paytirishdan ham dolzarbroqdir.",
      "Tavhid, shuningdek, ixlos deb ataladigan ixlosni, ya'ni Allohga \"dinda xolis bo'lgan holda\" ibodat qilishni talab qiladi (Qur'on 98:5). Bu erda nozik xavf - riyo, odamlar ko'rish va maqtash uchun ibodat qilishdir. Rasululloh sollallohu alayhi vasallam hatto yashirin ko'z-ko'zchilik ham ishni tinchgina buzishi mumkinligini ogohlantirganlar. Buning chorasi - niyatni yangilab turish: men buni kim uchun qilyapman? Samimiylik oddiy harakatni qadrli sadoqatga aylantiradi.",
      "Tavhidni asos qilishning hikmati shundaki, u qalbni ozod qiladi. Yolg'iz Allohgagina ibodat qilgan kishi maxluq qo'rquvidan, hammaning roziligini ta'qib qilishdan, ko'p ustozlarga xizmat qilishdan charchashdan xalos bo'ladi. Uning hayoti yagona, aniq yo'nalishga ega bo'ladi: uni yaratganni rozi qilish.",
      "Ishonchli ulamolardan amalda toʻgʻri eʼtiqodni oʻrganing, ibodatingizni shirk va munofiqlikdan tozalang va amal qilishdan avval niyatingizni tekshiring. Bu birinchi qadam ixtiyoriy yoki ilg'or emas - bu erda jannatga boradigan barcha yo'llar boshlanadi.",
    ],
    quran: [
      {
        excerpt:
          "Senga va sendan oldingilarga vahiy qilindiki: “Agar Allohga shirk keltirsang, amallaring barbod bo'lur va albatta ziyon ko'ruvchilardan bo'lursan.",
      },
      {
        excerpt: "Ular faqat Allohga dinda xolis bo'lib ibodat qilishga buyurilgan edilar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Amallar faqat niyatga bog'liq va har bir kishi faqat niyat qilgan narsaga ega bo'ladi.",
      },
    ],
    actions: [
      "Tavhid asoslarini ishonchli ulamolardan o'rganing.",
      "Ibodatlardan oldin niyatingizni yangilang.",
      "Yashirin ko'rinish uchun kechirim so'rang (riya).",
    ],
  },
  {
    title: "Saloh - ustun",
    summary: "Besh vaqt namozni saqlash eng ulug‘ amallardandir.",
    body: [
      "Namoz - besh vaqt namoz - Islomning ikkinchi ustuni va kundalik ibodatning markaziy harakatidir. Rasululloh sollallohu alayhi vasallam namozni dinning ustuni deb taʼriflaganlar: Kim uni barpo etsa, dinni barpo etgan boʻladi, kimki unga beparvolik qilsa, uni ushlab turgan narsaning koʻpini buzgan boʻladi. Bu mo'minning har kuni Parvardigori huzurida turgan, ruku va sajdada bo'lgan besh kuni Alloh bilan to'g'ridan-to'g'ri bog'lanishdir.",
      "Payg'ambarimiz sollallohu alayhi vasallamning qiyomat kuni haqida aytganlari bois, uning amaldagi amaldagi darajasi tengsizdir: bandaning birinchi hisob-kitobi namozdir. Agar u sog'lom bo'lsa, qolgan amallar sog'lom bo'ladi; agar u etishmasa, qolganlari xavf ostida. Bu hayotda ham namoz poklanish vositasidir — Rasululloh sollallohu alayhi vasallam besh vaqt namozni o‘z eshigidan oqib turgan daryoga qiyoslaganlar: kimki unda besh vaqt yuvinsa, kir qolmaydi, shuning uchun namoz kichik gunohlarni yuvib yuboradi.",
      "Ammo ibodat jismoniy harakatlardan ko'ra ko'proq bo'lishi kerak. Qurʼon “namozlarida kamtar boʻlganlarni” (Qurʼon 23:1–2) maqtaydi va “namozlarida doimiy boʻlganlarni” ulugʻlaydi (Qurʼon 70:22–23). Ikkita fazilat eng muhimi: hushu - Alloh huzurida turganini biladigan hozirgi, kamtar yurak - va har bir namozni o'z vaqtida saqlaydigan izchillik. Imkoniyati borlar uchun jamoat bilan namoz o'qish savobni ko'p barobar oshiradi.",
      "Namozning chuqur hikmati o'zgarishdir. To'g'ri o'qilgan namoz insonni fahsh va yomon ishlardan saqlaydi; Bu band kun davomida qalbni Allohga qaytaradigan takroriy qayta tiklashdir. Shuning uchun uzrsiz o'qishni o'tkazib yuborish sidqidildan tavba qilishni va qazo qilishni talab qiladigan jiddiy masaladir. Nafl va ravotib - farzlardan oldin va keyin o'qiladigan muntazam sunnat namozlari - nur qo'shib, martabani ko'taradi.",
      "Amaliy: besh vaqt namozni o'z vaqtida o'qishni mutlaq ustuvorligingiz sifatida saqlang, o'tkazib yuborganlaringizning qazosini o'qing va davom etishingiz mumkin bo'lgan sunnat namozlarini qo'shing. Agar namozingiz yaxshilansa, ibodatingizdagi hamma narsa u bilan yaxshilanishga intiladi.",
    ],
    quran: [
      {
        excerpt: "Albatta, mo'minlar, ya'ni namozlarida xokisor bo'lganlar najot topdilar.",
      },
      {
        excerpt: "Namoz o'qiydiganlar bundan mustasno.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qiyomatda bandaning birinchi hisob-kitobi uning namozidir. Agar u sog'lom bo'lsa, u muvaffaqiyatga erishdi; agar u nuqsonli bo'lsa, u muvaffaqiyatsizlikka uchradi va yo'qotdi.",
      },
      {
        excerpt:
          "Agar sizlardan biringizning eshigi oldida kuniga besh marta cho'miladigan daryo bo'lsa, uning ustida kir qolarmidi? Ular: «Yo'q», dedilar. U: «Bu besh vaqt namozning misolidir. Alloh ular bilan gunohlarni o'chiradi», dedilar.",
      },
    ],
    actions: [
      "Besh vaqt namozni o'z vaqtida o'qing.",
      "Qazolarni ixlos bilan o'qing.",
      "Imkoniyatingiz bo'lsa, farzdan oldin va keyin sunnat namozlarini qo'shing.",
    ],
    appLinks: [{}, {}, {}, {}],
  },
  {
    title: "Samimiy tavba",
    summary: "Alloh taolo O'ziga doimo qaytguvchilarni sevadi.",
    body: [
      "Tavba gunohdan keyin Allohga qaytishdir. Samimiy tavbaning (tavba nosuh) aniq ustunlari bor: qilgan ishidan qalbda chin dildan pushaymon bo'lish, gunohni darhol to'xtatish va unga hech qachon qaytmaslikka qat'iy qaror qilish - va agar gunoh boshqa birovga zulm qilish, uning haqini tiklash yoki kechirim so'rash bilan bog'liq bo'lsa. Bu bir voqea emas, balki bir umrlik qaytish, Alloh har bir mo'min uchun ochiq qoladigan eshikdir.",
      "Uning ahamiyati shundaki, hech bir inson gunohdan xoli emas, shuning uchun tavba gunohkorlar uchun emas, balki hamma uchundir. Rasululloh sollallohu alayhi vasallam har bir Odam farzandi gunoh qiladi, gunoh qiluvchilarning eng yaxshisi tavba qiluvchilardir, dedilar. Alloh taolo bandaning tavbasini to jon o‘lim chog‘ida tomoqqa yetgunicha qabul qiladi, hatto g‘arbdan chiqayotgan quyosh ham dunyo uchun muhlatdir — shu paytgacha da’vat turadi.",
      "Ajablanarlisi shundaki, Alloh taolo qaytgan bandasiga shunchaki sabr qilmaydi, balki quvonadi. Rasululloh sollallohu alayhi vasallam bandasining tavbasidan Alloh taoloni taqir sahroda adashib, tuyasi bor ovqati va suvi bilan sarson-sargardon bo‘lgach, hayotdan umidini uzib, to‘satdan yana topib olgan odamdan ko‘ra ko‘proq xursand ekanini ta’riflaganlar. Bu ulkan quvonch tasviri bizga tavba qilgan bandaning Rabbiysi uchun qanchalik suyukli ekanligini ko'rsatadi.",
      "Hikmat juda chuqur: gunoh insonning hikoyasining oxiri bo'lishi shart emas. «Alloh ularning yomonliklarini yaxshilik bilan almashtiradi» (Qur'on 25:70) — chin dildan tavba qilish muvaffaqiyatsizlik rekordini muvaffaqiyatga aylantiradi va qulash insonni Allohga avvalgidan ham yaqinroq qiladigan yangi boshlanishga aylantirishi mumkin. Gunohdan keyin umidsizlikning o'zi shaytonning tuzog'idir. Allohning rahmatiga umid qilish mo'minning javobidir.",
      "Amalda: tavbani bir kunga ham qoldirmang - sirg'alib ketgan vaqtingizni qaytaring. Har bir yomonlikni o'chirish uchun bir yaxshilik bilan ergashing va Payg'ambarimiz sollallohu alayhi vasallam mag'firat qilinganiga qaramay, har kuni istig'forni ko'p marta so'raganlaridek, kun davomida tilingizga istig'for ayting.",
    ],
    quran: [
      {
        excerpt:
          "Ey iymon keltirganlar, Allohga sidqidildan tavba qilinglar, shoyadki Robbingiz sizlardan gunohlaringizni ketkazsa va ostidan anhorlar oqib turgan jannatlarga kiritsa.",
      },
      {
        excerpt:
          "Magar tavba qilgan, iymon keltirgan va solih amallarni qilgan zotlargina, Alloh ularning yomonliklarini yaxshilik bilan almashtirib qo'yadi va Alloh mag'firatli va rahmlidir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Alloh taolo bandasining tavbasidan sizlardan biringiz tuyasini taqir yerda yo‘qotib qo‘yib, uni to‘satdan topib olgandan ko‘ra ko‘proq rozi bo‘ladi.",
      },
    ],
    actions: [
      "Gunoh qilganingizda darhol tavba qiling - kechiktirmang.",
      "Gunohni o'chirish uchun yaxshilik bilan ergashing.",
      "Kun davomida istig'for ayting.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qur'on",
    summary: "Allohning kitobini tilovat qiling, yod oling va unga amal qiling.",
    body: [
      "Qur'on Allohning so'zi bo'lib, qalblarga hidoyat, rahmat va shifo sifatida nozil qilingan. U bilan munosabat o‘rnatish — uni tilovat qilish, ma’nolarini tafakkur qilish, amrlariga amal qilish va boshqalarga o‘rgatish mo‘minning bir umrini bag‘ishlashi mumkin bo‘lgan eng ulug‘ va savobli ibodatlardandir. Bu Allohning arqonidir. Kim uni mahkam tutsa, to'g'ri yo'lga hidoyat qilur.",
      "Unga biriktirilgan mukofotlar favqulodda. Rasululloh sollallohu alayhi vasallam Alloh taolo O'z Kitobini tilovat qilib, namozni to'kis ado etgan zotga hech qachon bitmaydigan buyuk ajr berishini (Qur'on 35:29-30) va har bir tilovat qilingan harf uchun o'n barobar ajr berishini o'rgatganlar. Hatto so'z ustida qiynalib, qoqilgan odam ham, agar u harakat qilsa, ikki baravar savobga ega bo'ladi - biri qiroat uchun, ikkinchisi esa harakat uchun.",
      "Qur'on ham insonning keyingi hayotidagi martabasini to'g'ridan-to'g'ri va yorqin tarzda ko'taradi. Payg‘ambarimiz sollallohu alayhi vasallam qiyomat kunida Qur’on sahobasiga: “O‘qing va ko‘tarilingiz va dunyoda o‘qiganingizdek o‘qing, chunki sizning martabangiz oxirgi o‘qigan oyatingizda bo‘ladi”, dedilar. Boshqacha qilib aytganda, insonning jannatdagi mavqei Kitobdan o'z ulushi bilan bir pog'ona ko'tariladi - yodlash va tadqiq qilish uchun ajoyib dalda.",
      "Ammo chuqurroq maqsad o'z-o'zidan tilovat qilish emas, balki o'zgartirishdir. Alloh taolo bizga \"Qur'onni o'lchov bilan o'qishni\" (Qur'on 73:4) buyuradi, shuning uchun ma'nolar bizning fikrlash, his qilish va xatti-harakatlarimizni o'z ichiga oladi va o'zgartiradi. Qur'on faqat tilovat qilish uchun emas, balki yashash uchun yuborilgan; sahobalar o'n oyatni o'rganib, ularni tushunib, amal qilmagunlaricha harakat qilmas edilar.",
      "Amalda: har kuni bir qismini, hatto bir nechta oyatlarni o'qing, lekin ularni mulohaza bilan o'qing. Yangi suralarni yodlang yoki bilganingizni saqlang va eng muhimi ko'proq o'rganishga shoshilmasdan oldin o'rgangan narsangizga amal qiling.",
    ],
    quran: [
      {
        excerpt:
          "Allohning Kitobini tilovat qilganlar, namozni to'kis ado etadigan va Biz rizq qilib bergan narsalarimizdan infoq-ehson qilganlar, albatta, ajrlarini to'liq berishini va O'z fazlidan ziyoda qilishini hech qachon bitmaydigan savdoni umid qiladilar.",
      },
      {
        excerpt: "Va Qur'onni o'lchov bilan tilovat qiling.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qur'on sahobasiga aytiladi: O'qing va ko'tarilingiz va dunyoda o'qiganingizdek o'qing, chunki sizning darajangiz oxirgi o'qigan oyatda bo'ladi.",
      },
    ],
    actions: [
      "Har kuni o'qing - hatto bir nechta oyatlarni o'ylab ko'ring.",
      "Yangi suralarni yodlang yoki bilganlaringizni saqlang.",
      "Ko'proq izlashdan oldin o'rgangan narsangizga amal qiling.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Zikr — zikr",
    summary: "Tilda engil, tarozida og'ir.",
    body: [
      "Zikr Allohni zikr qilish - tasbeh (Subhanalloh), hamd (Alhamdulillah), ulug'lash (Allohu Akbar), Uning birligini tasdiqlash (La ilaha illalloh) va istig'for (istig'for) so'zlari bilan Uni qalbda va tilda saqlashni anglatadi. Jannatga olib boradigan barcha yo'llar ichida zikr qilish eng oson, ammo savob jihatidan eng kattalaridan biridir, chunki u har qanday joyda, har qanday holatda va har qanday vaqtda amalga oshirilishi mumkin.",
      "Alloh taoloning O'zi unga saxiylik bilan buyuradi: \"Ey mo'minlar, Allohni ko'p zikr qilinglar\" (Qur'on 33:41-42) - va unga betakror meva: qalb oromini va'da qiladi. “Albatta, qalblar Allohni zikr qilish bilan orom topur” (Qur’on 13:28). Bezovta, tashvishli dunyoda bu zikrning eng katta ne'matlaridan biridir. Rasululloh sollallohu alayhi vasallam ham uning savobini o‘ylab, tilga yengil, tarozida og‘ir va Rohmanga suyukli ikki kalima Subhanallohi va bihamdihi, Subhanallohil-Azimdir, dedilar.",
      "Ertalab va kechki azizlarning alohida toifasi - Rasululloh sollallohu alayhi vasallam kunning ikki chegarasi uchun o'rgatgan sahih duolardir. Bular mo'minni balolardan saqlaydigan, Allohning himoyasi va roziligini tushiruvchi ruhiy qal'a vazifasini bajaradi. Har bir kunning boshida va oxirida faqat bir necha daqiqa, borligi bilan aytdi, vaqt o'tishi bilan yurakni jimgina qayta shakllantiring.",
      "Zikrning hikmati shundaki, u rasmiy ibodatlar orasida Alloh bilan aloqani saqlab qoladi. Zikr bilan namlangan til va eng muhimi, kundalik tanlovlarida Allohni zikr qiladigan qalb – g‘azabdan oldin, xarid qilishdan oldin, qaror qabul qilishdan oldin to‘xtab turish – asl maqsaddir. Zikr labda qolish uchun emas; bu hayotni boshqarish uchun mo'ljallangan.",
      "Amaliy: ertalab va kechqurun zikr qilishni kundalik odatga aylantiring, bo'sh vaqtlarda tasbeh, istig'for yoki salovotning oddiy qismini oqib turmang, ayniqsa, uxlashdan oldin va uyg'onganingizda Allohni zikr qiling. Ko'p yorilishdan ko'ra, bir oz barqarorlik yaxshiroqdir.",
    ],
    quran: [
      {
        excerpt:
          "Iymon keltirgan va qalblari Allohning zikri bilan orom topgan zotlar, albatta, qalblar Allohning zikri bilan orom topur.",
      },
      {
        excerpt:
          "Ey iymon keltirganlar, Allohni ko'p zikr qilingiz va ertalab va kechqurun Unga tasbih ayting.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ikkita kalima tilga yengil, taroziga ogir va Rahmonga mahbubdir: SubhanAllohi va bihamdihi, SubhanAllohil-Azim.",
      },
    ],
    actions: [
      "Har kuni ertalab va kechqurun adhkarni to'liq bajaring.",
      "Istig'for yoki salovot uchun tasbeh hisoblagichidan foydalaning.",
      "Uyqudan oldin va uyg'ongandan keyin Allohni zikr qiling.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sadaqa va zakot",
    summary: "Alloh senga bergan narsadan yashirin va oshkora infoq qil.",
    body: [
      "Islom dini mo‘minni Alloh taolo omonat qilib qo‘ygan moldan ham farz, ham ixtiyoriy ravishda berishga buyuradi. Zakot - islomning besh arkonidan biri bo'lgan boylik uchun yillik majburiy to'lov bo'lib, uning shartlariga rioya qilganlar uchun ixtiyoriy emas. Undan tashqari sadaqa turadi: Alloh roziligi uchun har qanday miqdorda, xohlagan vaqtda ixtiyoriy ravishda berish.",
      "Alloh yo'lida infoq-ehson qilishning savoblari oddiy hisobdan ham ko'payadi. Alloh taolo O‘z yo‘lida infoq-ehson qiluvchini yetti boshoq o‘sadigan, har bir boshoqda yuzta don beradigan donga qiyoslaydi – “Alloh O‘zi xohlagan kishiga ko‘paytirur” (Baqara surasi, 261-oyat). Sadaqa molni kamaytirmaydi, uni poklaydi va barakani oshiradi, suv olovni o'chirganidek gunohlarni o'chiradi.",
      "Xayriyaning ikkita shakli alohida e'tiborga loyiqdir. Birinchisi, yashirin sadaqa bo'lib, shunday yashirincha beriladiki, Payg'ambar sollallohu alayhi vasallam ta'riflaganidek, chap qo'l o'ng qo'l nima berganini bilmaydi - bu ixlos Alloh taologa ayniqsa sevimli bo'lib, qiyomat kuni insonga soya soladi. Ikkinchisi, sadaqa jariya bo'lib, o'limdan keyin ham foydasi davom etuvchi sadaqadir. Rasululloh sollallohu alayhi vasallam aytdilarki, odam o'lsa, uchtadan boshqa amali tugaydi: doimiy sadaqa, foyda keltiradigan ilm va unga duo qiluvchi solih farzand.",
      "Sadaqaning hikmati shundaki, u beruvchiga ham, oluvchiga ham ishlaydi. Bu qalbdagi ochko‘zlik changalini bo‘shatadi, mehr-oqibat uyg‘otadi, jamiyat rishtalarini mustahkamlaydi, badavlat kishilarga haqiqiy mulkdor emas, ishonchli shaxs ekanligini eslatadi. Islomda esa sadaqa ta'rifini kengaytirib, hech kim chetda qoldirmaydi: Rasululloh sollallohu alayhi vasallam birodaringizga tabassum qilish, foydali so'z aytish, hatto yo'ldan zararli narsalarni olib tashlash ham sadaqadir, deb o'rgatganlar.",
      "Amaliy: zakot uchun javobgar bo'lsangiz, uni to'g'ri hisoblab chiqing va to'lang; oz bo'lsada muntazam sadaqa bering, toki berish hodisa emas, balki odat bo'lib qoladi; Talabaga homiylik qilish, quduqni moliyalashtirish yoki masjidni qo'llab-quvvatlash - siz ketganingizdan keyin ham sizga mukofot beradigan doimiy sadaqa jariyasini qidiring.",
    ],
    quran: [
      {
        excerpt:
          "Mollarini Alloh yo'lida sarflaydiganlarning misoli, har bir boshoqda yuz donadan yetti boshoq o'sadigan donga o'xshaydi. Alloh kimga xohlasa, ko'paytirur.",
      },
      {
        excerpt:
          "Sizlardan biringizga o'lim kelsa, u: «Ey Robbim, agar meni bir oz muddatga kechiktirsangiz, sadaqa berib, solihlardan bo'lsam», deyishidan oldin, Biz sizga rizq qilib bergan narsalardan infoq qiling.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Biror kishi vafot etsa, uning amallari tugaydi, faqat uchtasi: doimiy sadaqa, foydali ilm yoki unga duo qiluvchi solih farzand.",
      },
    ],
    actions: [
      "Agar javobgar bo'lsangiz, zakotni hisoblang va bering.",
      "Kichik bo'lsa ham muntazam sadaqa qiling.",
      "Sadaqa jariya imkoniyatlarini qidiring.",
    ],
    appLinks: [{}],
  },
  {
    title: "Yaxshi xarakter",
    summary: "Tarozidagi eng og'ir narsa ajoyib odob bo'lishi mumkin.",
    body: [
      "Go'zal xulq (husn al-xuluq) - mo'minning Alloh taoloning yaratgan narsalariga munosabatda ko'rsatadigan olijanob fazilatlari: rostgo'ylik, sabr-toqat, kamtarlik, rahm-shafqat, saxovat, yumshoqlik va va'daga vafo qilish. Islom dini nafaqat ijtimoiy nafislik emas, balki fe'l-atvorni iymonning asosiy o'lchovi va qiyomat kunigacha ko'tarishi mumkin bo'lgan eng og'ir amallardan biri sifatida qaraydi.",
      "Uning darajasi eng aniq ifodalangan. Rasululloh sollallohu alayhi vasallam taroziga go'zal xulqdan og'irroq narsa qo'yilmaydi, mo'minlarning iymoni eng mukammal bo'lganlar esa go'zal xulqlilardir, dedilar. U hatto o'z missiyasini mukammal olijanob xarakterga yuborilganligini aytib, umumlashtirdi. Bu shuni anglatadiki, ota-onangizga, turmush o'rtog'ingizga, farzandlaringizga, qo'shnilaringizga va hatto begonalarga qanday munosabatda bo'lishingiz sizning ibodatingizdan alohida emas - bu uning markaziy qismidir.",
      "Nabiy sollallohu alayhi vasallam va'da qilgan narsaga erisha oladi, chunki go'zal xulq kuchlidir: uning go'zal xulq-atvori bilan mo'min kun bo'yi ro'za tutgan va kechasi bilan namoz o'qigan kishi darajasiga etadi. Boshqacha qilib aytganda, zo'r fe'l-atvor oddiy odamni eng sodiq ibodat qiluvchilar darajasiga ko'tarishi mumkin, chunki u qiyin, doimiy va har qadamda nafsni sinab ko'radi - g'azabni tiyish, haqoratni kechirish va qattiqqo'llik osonroq bo'lganda yumshoqlikni tanlash.",
      "Hikmat shundan iboratki, Islom faqat inson va Alloh o'rtasidagi shaxsiy munosabatlar emas; bu odamning atrofidagi barchaga qanday munosabatda bo'lishini to'ldirish uchun mo'ljallangan. Duosi ishi yumshatmaydigan namozxon fikrni o'tkazib yuborgan bo'lsa, go'zal xulqning o'zi da'vat bo'lib, jonli ibrat bilan odamlarni iymonga tortadi. Shuning uchun ham matnlar Allohga ibodatni Uning yaratilishidagi ustunlik bilan qayta-qayta birlashtiradi.",
      "Amalda: bir vaqtning o'zida bitta xususiyat ustida ishlang - g'azablansa, tilingizni tuting, sizni xafa qilganlarni kechiring, buzilgan munosabatlarni o'zgartiring va va'dalar sizga qimmatga tushganda ham bajaring. O'sha kuni odamlarga qanday munosabatda bo'lganingiz haqida namozdan keyin har kuni qisqacha fikr yuritish - barqaror o'sishning oddiy usuli.",
    ],
    quran: [
      {
        excerpt: "Darhaqiqat, siz buyuk va olijanob xulq egasisiz.",
      },
      {
        excerpt:
          "Osonlik va qiyinchilikda infoq-ehson qiluvchilar, g'azablarini bosuvchi va odamlarni mag'firat qilguvchilardir va Alloh yaxshilik qiluvchilarni sevadi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Qiyomat kuni mo'minning tarozida go'zal xulqdan og'irroq narsa yo'qdir. Albatta, Alloh fahsh va qo'pol odamni yomon ko'radi.",
      },
      {
        excerpt:
          "Mo'minlarning iymoni eng mukammali yaxshi xulqlilaridir va sizlarning eng yaxshilaringiz xotinlariga yaxshi munosabatda bo'lganlaringizdir.",
      },
    ],
    actions: [
      "G'azablansa, sabr qiling.",
      "Boshqalarni kechiring va buzilgan munosabatlarni tuzating.",
      "Kundalik jurnalda namozdan keyin xarakteringiz haqida o'ylang.",
    ],
    appLinks: [
      {},
      {
        label: "Sins against others",
      },
    ],
    characterTraits: [
      {
        title: "Rostgo'ylik",
        summary: "So'z va amalda rost bo'lish.",
        quran: {
          excerpt: "Allohdan qo'rqinglar va rostgo'ylar bilan bo'linglar.",
        },
      },
      {
        title: "Sabr",
        summary: "Sinovda bardoshli bo'lish.",
        quran: {
          excerpt: "Albatta, Alloh sabr qiluvchilar bilan.",
        },
      },
      {
        title: "G'azabni boshqarish",
        summary: "G'azabda o'zini tiyish.",
        hadith: {
          excerpt: "Kuchli kishi g'azabda o'zini tuta olgan kishidir.",
        },
      },
      {
        title: "Kechirim",
        summary: "Odamlarning xatosini kechirish.",
        quran: {
          excerpt: "Kechirsinlar va o'tib ketsinlar.",
        },
      },
      {
        title: "Kamtarlik",
        summary: "O'zini ulug' ko'rmaslik.",
        hadith: {
          excerpt: "Kim Alloh uchun kamtar bo'lsa, Alloh uni yuksaltiradi.",
        },
      },
      {
        title: "Omonatdorlik",
        summary: "Ishonib topshirilgan narsani asrash.",
        quran: {
          excerpt: "Ular omonat va ahdlariga rioya qiladilar.",
        },
      },
      {
        title: "Ota-onaga yaxshilik",
        summary: "Hurmat va g'amxo'rlik.",
        quran: {
          excerpt: "Ularga «uf» ham demang.",
        },
      },
      {
        title: "Yaxshi so'z",
        summary: "Yaxshilikni aytish yoki jim turish.",
        hadith: {
          excerpt: "Yaxshi so'z aytsin yoki jim tursin.",
        },
      },
      {
        title: "Tabassum",
        summary: "Birodarga ochiq chehra ko'rsatish.",
        hadith: {
          excerpt: "Birodaringizga tabassum qilish sadaqadir.",
        },
      },
      {
        title: "Adolat",
        summary: "Hamma bilan adolatli bo'lish.",
        quran: {
          excerpt: "Adolat qilinglar, bu taqvoga yaqinroqdir.",
        },
      },
    ],
    characterDestroyers: [
      {
        title: "Yolg'on",
      },
      {
        title: "G'iybat",
      },
      {
        title: "Chaqqonlik",
      },
      {
        title: "Kibr",
      },
      {
        title: "Zulm",
      },
      {
        title: "Va'dani buzish",
      },
      {
        title: "Mazax qilish",
      },
      {
        title: "Qo'pollik",
      },
    ],
  },
  {
    title: "Bilim izlash",
    summary: "Alloh ilm talab qilgan kishiga jannat yo'lini oson qiladi.",
    body: [
      "Foydali ilm talab qilish, ya'ni Alloh va Rasuli sollallohu alayhi vasallam o'rgatgan narsalarni o'rganish, so'ngra unga amal qilish va uni o'tkazish har bir musulmon zimmasidagi ibodatdandir. Bu iymonni oydinlashtiruvchi, ibodatni poklovchi, to‘g‘rini botildan ajratuvchi muqaddas ilmdir; ko'z-ko'z qilish uchun bilim emas, balki harakatni boshqaradigan nurdir.",
      "Rasululloh sollallohu alayhi vasallam bu izlanishni butun safardan maqsad bilan bog'laganlar: «Kimki ilm izlab yo'lga tushsa, Alloh unga jannat yo'lini oson qilib qo'yadi». \"Yo'l\" ham to'g'ridan-to'g'ri, ham majoziy ma'noda - Alloh izlovchining bu hayotida yo'lini oson qiladi va keyingi hayotda jannat yo'lini osonlashtiradi. Shuningdek, farishtalar ilm tolibi roziligi uchun qanotlarini pastga tushirishlarini, osmonlaru erdagi barcha narsalar, hatto dengizdagi baliqlar ham yaxshilikka o'rgatuvchi uchun mag'firat so'rashini o'rgatgan.",
      "Ilm ham insonga o‘limdan keyin ham savob berib turadigan nodir amallardandir. Rasululloh sollallohu alayhi vasallam savobi qabrda davom etadigan uch narsadan, sadaqa va solih farzand bilan birga foydali ilmni nomladilar. Demak, bitta foydali ishni o‘rgatish – kimgadir to‘g‘ri namoz o‘qishni o‘rganishga yordam berish, sahih hadisni aytish yoki insonni haqiqatga yo‘naltirish – yillar, hatto avlodlar davomida oqib kelayotgan savob oqimiga aylanishi mumkin.",
      "Hikmat shundan iboratki, ilmsiz ish ko'r, amalsiz bilim samarasizdir. To‘g‘ri bilim insonni bid’at va zalolatdan saqlaydi, ixlosni chuqurlashtiradi, o‘ziga foyda keltirmay, boshqalarga ham foyda keltirish qobiliyatini beradi. Islom ulamolari har doim ikki xavfdan ogohlantirganlar: johillik bilan amal qilish va amal qilmasdan bilish.",
      "Amalda: foydali narsalarni muntazam ravishda o'rganishga ahd qiling - oyat, hadis, kundalik ibodatingiz uchun zarur bo'lgan hukm. E'tiqod, namoz, poklanish va asosiy taqiqlardan boshlang, keyin asta-sekin chuqurlashtiring. O'rganganlaringizni kamtarlik bilan baham ko'ring va har doim birinchi navbatda o'zingizga amal qiling.",
    ],
    quran: [
      {
        excerpt:
          "Ayting: «Biladiganlar bilan bilmaydiganlar barobarmi? Faqat aql egalarigina ibrat oladilar.",
      },
      {
        excerpt: "Va ayt: Robbim, ilmimni ziyoda qil.",
      },
    ],
    hadith: [
      {
        excerpt: "Kim ilm izlab yo'lga tushsa, Alloh unga jannat yo'lini oson qilib qo'yadi.",
      },
      {
        excerpt:
          "Biror kishi vafot etsa, uning amallari tugaydi, faqat uchtasi: doimiy sadaqa, foydali ilm yoki unga duo qiluvchi solih farzand.",
      },
    ],
    actions: [
      "Har hafta foydali narsalarni o'rganing.",
      "Takabburliksiz bilimlarni baham ko'ring.",
      "Ko'proq to'plashdan oldin o'rgangan narsangizni qo'llang.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Ixtiyoriy ibodat",
    summary: "Farzdan ortiq nafl bilan Allohga yaqinlashing.",
    body: [
      "Ixtiyoriy ibodat (nafl) deganda, mo'minning Alloh farz qilganidan tashqari qo'shimcha ibodatlar, qo'shimcha ro'zalar, qo'shimcha sadaqa va zikrlarni bildiradi. Majburiyatlar birinchi o'rinda turadi va kelishib bo'lmaydi, lekin ular bajarilgandan so'ng, nafl - bu banda zarur bo'lgan minimal darajadan oshib ketadigan sevgi, yaqinlik va sog'inch izhor qiladigan joy.",
      "Unga ajoyib va'da qo'shilgan. Hadisi qudsiyda Alloh taolo marhamat qiladi: «Bandam Menga farz qilganimdan ham sevimliroq narsa bilan yaqinlashmaydi. Men uni yaxshi ko‘rmagunimcha, u ixtiyoriy amallar bilan Menga yaqinlashishda davom etadi” – va Alloh taolo bandani yaxshi ko‘rgandan so‘ng, uning duosi ijobat bo‘lib, ishlari to‘g‘ri bo‘ladi. Demak, ixtiyoriy sajda qilish shunchaki itoatkorlikdan ilohiy sevgi sari ko'tariluvchi yaqinlik narvonidir.",
      "Sunnat uning qulay shakllariga boy: kechaning oxirgi qismidagi xufton (tahajjud), peshin namozi (duha), farzlardan oldin va keyin o'qiladigan sunnat namozlari, dushanba va payshanba yoki har oyning oq kunlari kabi nafl ro'zalar. Nafl ibodati ham kamchiliklarimizni jimgina yopadi - Payg'ambarimiz sollallohu alayhi vasallam farz namozlaridagi har qanday kamchilik qiyomat kuni insonning nafl namozi bilan tugatilishini o'rgatganlar.",
      "Hikmat shundaki, nafl iymonni yashab, o'stirib boradi. Majburiyatlar asosni saqlaydi, ammo ixtiyoriy harakatlar yurakning cho'zilgan joyidir, hech kim ko'rmaydigan shaxsiy ibodat samimiyatni mustahkamlaydi va inson o'zini hayotning qiyin sinovlariga tayyorlaydi. Bu ishlarning ixtiyoriyligi ham rahmatdir - Alloh har bir inson o'ziga mos keladiganidan o'tishi uchun ko'p eshiklarni ochadi.",
      "Amalda, asosiysi intensivlik emas, balki barqarorlikdir. Rasululloh sollallohu alayhi vasallam Ollohga eng sevimli amallar kichik bo'lsa ham, eng izchili ekanligini ta'kidlaganlar. Bir necha kun ichida yonib ketadigan shijoatli portlashdan ko'ra, chin dildan bajarishingiz mumkin bo'lgan bir nechta ixtiyoriy amallarni tanlang - ikki rakat tahajjud, haftada bir ro'za, Qur'onning belgilangan qismi.",
    ],
    quran: [
      {
        excerpt:
          "Parvardigorlariga qo'rquv va umid bilan duo qilganlarida yon tomonlari to'shaklarini tashlab qo'yadi va Biz ularga rizq qilib bergan narsalardan infoq qilurlar. Qilgan amallarining mukofoti sifatida ular uchun qanday tasalli yashiringanini hech bir jon bilmas.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mening bandam Menga farz qilganimdan ham sevimliroq narsa bilan Menga yaqinlashmaydi. Mening bandam esa uni yaxshi ko‘rmagunimcha, ixtiyoriy amallar bilan Menga yaqinlashishda davom etadi.",
      },
    ],
    actions: [
      "Ikki rakat bo'lsa ham tahajjud namozini o'qing.",
      "Mumkin bo'lganda tez ixtiyoriy kunlar.",
      "Farzdan oldin / keyin izchil sunnat namozlarini qo'shing.",
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Sabr va minnatdorchilik",
    summary: "Alloh sabrli va shukr qiluvchilarni sevadi.",
    body: [
      "Sabr (sabr) va shukr (shukr) mo'minning hayotda uchadigan ikki qanotidir. Sabr uch sohada sobit bo'lishdir: Allohga itoatda sobit bo'lish, itoatsizlikdan tiyilish va Uning amriga shikoyat qilmasdan hayot sinovlariga chidash. Minnatdorchilik har bir ne’matni Alloh taolodan ekanini anglab, qalbda, tilda va itoatkor amal bilan shukr qilishdir. Ular birgalikda mo‘minning qiyinchilikka ham, yengillikka ham javobini qamrab oladi.",
      "Ularning ahamiyati shundaki, ular imonlining u bilan sodir bo'lgan hamma narsaga qanday javob berishini belgilaydilar. Rasululloh sollallohu alayhi vasallam mo‘minning barcha ishi yaxshi ekanligidan hayratda qoldilar: unga yaxshilik yetsa, shukr qiladi va u o‘zi uchun yaxshidir, qiyinchilik yetsa, sabr qiladi va bu ham uning uchun yaxshidir – bu faqat mo‘minga berilgan ne’matdir. Demak, nima kelsa, mo‘minning savob yo‘li bor.",
      "Sabr-toqatning mukofoti cheksizdir. Ko'pgina amallar o'lchov bilan barobar bo'lsa-da, Alloh taolo aytadi: \"Sabrlilarga ajrlari hisobsiz beriladi\" (Qur'on 39:10). Va shukrning o'ziga xos va'dasi bor: \"Agar shukr qilsangiz, albatta sizni ziyoda qilaman\" (Qur'on 14:7). Demak, shukronalik nafaqat ne'matlarga to'g'ri javob berish, balki ularning o'sishiga sabab bo'lgan narsadir.",
      "Bu erdagi donolik azob-uqubatlarni butunlay qayta aks ettiradi. Sinovlar avtomatik ravishda jazo emas; yaxshi javob bergan mo'min uchun ular gunohlarni o'chiruvchi poklanish va martabani ko'taruvchi yuksalish bo'lishi mumkin. Rasululloh sollallohu alayhi vasallam musulmonning boshiga hech qanday charchoq, kasallik, tashvish va hatto tikan sanchishi ham yetmaydi, Alloh taolo u orqali uning ba'zi gunohlarini o'chirmasin, deb o'rgatganlar. Bu hayotning eng og'ir daqiqalarini sof yo'qotishdan ko'ra imkoniyatlarga aylantiradi.",
      "Amalda: musibat yetsa, Alloh o‘rgatgan “Inna lillahi va inna ilayhi rojiun” (Albatta, biz Allohnikimiz va Unga qaytuvchimiz) so‘zlari bilan javob bering va Uning amrini rad etuvchi shikoyatdan tilingizni tiying. Yaxshi kunlarda ne'matlaringizni ovoz chiqarib sanang va har kuni ulardan bir nechtasi uchun Allohga shukr qiling; ularni nomlash qalbni yumshoq va minnatdorchilik bilan saqlaydi.",
    ],
    quran: [
      {
        excerpt:
          "Sabr qilguvchilarga xushxabar berki, ular falokat yetganda: «Albatta, biz Allohnikimiz va albatta, biz Unga qaytguvchimiz», derlar. Ularga Robbilaridan salovot va rahmat bor. Ana o'shalar hidoyat topguvchilardir.",
      },
      {
        excerpt:
          "Agar shukr qilsangiz, albatta sizni ziyoda qilurman. Agar yolg'onchi qilsangiz, albatta, Mening azobim qattiqdir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Mo'minning ishi ajoyibdir, chunki uning barcha ishlari yaxshidir. Agar osonlik kelsa, shukr qiladi va bu uning uchun yaxshidir. Agar qiyinchilik kelsa, sabr qiladi va bu uning uchun yaxshidir. Bu mo'minlardan boshqa hech kim uchun emas.",
      },
    ],
    actions: [
      "Sinov paytida “inna lillahi va inna ilayhi rojiun” deng.",
      "Har kuni uchta ne'mat uchun Allohga baland ovoz bilan shukr qiling.",
      "Allohning hukmini rad etuvchi tarzda shikoyat qilmang.",
    ],
  },
  {
    title: "Allohga da'vat qilish",
    summary: "Kim boshqasiga hidoyat qilsa, unga ergashgandek ajr oladi.",
    body: [
      "Da'vat boshqalarni Allohga da'vat qilish - Islom da'vatini baham ko'rish, insonni namozga o'rgatish, yaxshilikka undash, yomonlikdan yumshoqlik bilan qaytarish yoki kurashayotgan musulmonning itoatga qaytishiga yordam berishdir. Bu har bir payg'ambarning vazifasi bo'lib, har biri o'z qobiliyati va bilimiga ko'ra jamoaning umumiy mas'uliyatidir. U olimlar uchun ajratilmagan; Kim bitta foydali narsani yetkazsa, Allohga da'vat qilgan bo'ladi.",
      "Uning ajri Islomdagi eng saxovatlilaridan biridir. Rasululloh sollallohu alayhi vasallam aytdilarki, kim birovni yaxshilikka hidoyat qilsa, unga amal qilgandek ajr bordir va boshqa bir rivoyatda kim hidoyatga chorlasa, unga ergashganlarning ajrini oladi, ularning ajri zarracha kamaymaydi. Bu shuni anglatadiki, siz yo'lga qo'ygan yaxshilik, siz harakat qilganingizdan keyin uzoq vaqt davomida teginadigan har bir kishi orqali mukofotingizni ko'paytirishda davom etishi mumkin.",
      "Ammo da'vatning muvaffaqiyatga erishishi uchun ulug'lanishi kerak bo'lgan adab bor. Alloh taolo: “Robbingning yo‘liga hikmat va go‘zal pand-nasihat bilan da’vat et va ular bilan go‘zal tarzda bahslash” (Qur’oni karim, 16:125) buyurgan. Donolik - to'g'ri, to'g'ri odamga, to'g'ri yo'l va vaqtda aytish; qattiqqo'llik, takabburlik va ball to'plash odamlarni uzoqlashtiradi va maqsadga xiyonat qiladi. Da'vat qiluvchining ishi yolg'iz Allohga tegishli bo'lgan qalblarni majburlash emas, etkazish va ekishdir.",
      "Bunday ulkan savobni boshqalarga yo'l ko'rsatishga bog'lashning hikmati shundaki, u har bir mo'minni doimiy yaxshilik manbai qiladi. Shuningdek, u da'vat qiluvchining o'z e'tiqodini himoya qiladi: boshqalarni namozga, halollikka va ibodatga chorlash o'zini ularni mahkam ushlab turishni eslatishdir. Va u jamiyatni o'zaro e'tiborsizlikdan ko'ra o'zaro g'amxo'rlikda birlashtiradi.",
      "Amalda, uydan boshlang. O'z oilangizni yaxshilang va o'rgating - turmush o'rtog'ingiz, farzandingiz, aka-ukangiz, chunki ular sizning birinchi va eng doimiy mas'uliyatingizdir. Foydali bilimlarni mehribonlik bilan baham ko'ring, kimgadir namoz o'qish yoki Qur'on o'qishni o'rganishga yordam bering va yaxshi xulqli hayot va sobit ibodat ko'pincha eng ishonarli da'vat ekanligini unutmang.",
    ],
    quran: [
      {
        excerpt:
          "Robbingning yo'liga hikmat va go'zal pand-nasihat bilan da'vat et va ular bilan eng go'zal tarzda bahslash.",
      },
      {
        excerpt:
          "Allohga da'vat qiluvchi, solih amallarni qilgan va: «Albatta, men musulmonlardanman», degan kimsadan ham go'zal so'zli kim bor?",
      },
    ],
    hadith: [
      {
        excerpt: "Kim birovni yaxshilikka hidoyat qilsa, unga amal qilgandek ajr beriladi.",
      },
    ],
    actions: [
      "Foydali bilimlarni mehr bilan baham ko'ring.",
      "Kimgadir ibodat qilishni yoki Qur'on o'qishni o'rganishga yordam bering.",
      "Jamoat oldida yaxshi xulq-atvor namunasi bo'ling.",
    ],
  },
  {
    title: "Umr davomidagi asosiy ishlar",
    summary: "Haj, oila va doimiy xayriya.",
    body: [
      "Kundalik va haftalik ibodatlar bilan bir qatorda, Islom mo'minni bir hovuch katta, umrbod amallar - savoblari juda katta va ba'zi hollarda hech qachon tugamaydigan yirik sarmoyalarga qaratadi. Bular atrofdagi hayotni rejalashtirishga arziydigan loyihalardir: ziyorat qilish, solih oilani tarbiyalash va doimiy xayrli ishlarni qurish.",
      "Ulardan eng avvalo, islomning beshinchi ustuni bo‘lgan, jismoniy va moddiy imkoniyati bo‘lgan har bir musulmonga umrida bir marta farz bo‘lgan hajdir — “Bay’atni haj qilish – yo‘l topishga qodir bo‘lgan kishilar uchun Allohning burchidir” (Qur’on 3:97). Uning savobi to'liq poklanishdir: Payg'ambarimiz sollallohu alayhi vasallam aytdilarki, kim Alloh uchun haj qilsa, fahsh va gunohlardan saqlansa, onasi tug'ilgan kundagidek pokiza gunohsiz qaytadi. Qabul qilingan hajning ajri jannatdan kam bo'lmaydi, dedilar. Umra, ya'ni kichik haj ham katta savob olib, bir umra bilan ikkinchi umra orasidagi gunohlarni o'chiradi.",
      "Ikkinchi katta sarmoya sadaqa jariyadir - o'limdan keyin ham mukofot beradigan doimiy xayriya. Rasululloh sollallohu alayhi vasallam buni qabrdagi kishiga foydali ilm va u uchun duo qiluvchi solih farzand bilan birga foyda beradigan uchta narsadan biri deb ataganlar. Farzandlarni iymon va yaxshi xulq asosida tarbiyalash, ehtimol, bularning eng kattasi, lekin masjid qurish yoki uni saqlash, quduq qazish, yetimga homiylik qilish, daraxt ekish yoki ta'limni moliyalashtirish - har biri ehson qiluvchidan uzoqroq mukofot oqimidir.",
      "Bu amallarning hikmati shundaki, ular insonning hisobini umridan ortiqroqqa cho‘zadi. Mo'minning faol yillari qisqa, lekin qazigan qudug'i yoki yaxshi tarbiyalagan farzandi unga asrlar davomida savob berib turishi mumkin. Shunday qilib, Islom uzoqni ko'rishga undaydi: nafaqat bugungi ibodat haqida, balki siz ketganingizdan keyin ham sizdan qanday yaxshiliklar oqishi haqida o'ylang.",
      "Amalda: agar imkoningiz bo'lsa, Haj yoki Umra ziyoratini cheksiz qoldirmasdan, jiddiy reja tuzing. Oilangizning e'tiqodi va fe'l-atvoriga haqiqiy kuch sarflang, chunki ular sizning eng abadiy merosingizdir. Va sizning xayrli ishlaringiz o'limdan keyin davom etishi uchun kamida bitta doimiy xayriya loyihasini - bilim, suv, boshpana yoki etimni qo'llab-quvvatlang.",
    ],
    quran: [
      {
        excerpt:
          "Baytullohni haj qilish esa unga yo'l topa oladigan kishilarning Alloh taoloning farzidir.",
      },
      {
        excerpt:
          "Va odamlarga hajni e'lon qiling. Ular o'zlari uchun manfaatga guvoh bo'lishlari uchun har bir uzoq dovondan piyoda va har bir ozg'in tuyada kelishadi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim Alloh uchun haj qilsa, fahsh va fahsh qilmasa, xuddi onasi dunyoga keltirgan kun kabi gunohsiz qaytadi.",
      },
      {
        excerpt:
          "Biror kishi vafot etsa, uning amallari tugaydi, faqat uchtasi: doimiy sadaqa, foydali ilm yoki unga duo qiluvchi solih farzand.",
      },
    ],
    actions: [
      "Imkoniyatingiz bo'lsa, haj yoki umrani rejalashtiring.",
      "Oilangizning e'tiqodi va xarakteriga sarmoya kiriting.",
      "Doimiy xayriya loyihasini qo'llab-quvvatlang.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Allohning rahmati - oxirgi so'z",
    summary: "Amallar vositadir; kirish Uning rahmati bilandir.",
    body: [
      "Mo‘min barcha amallar, barcha intilishlar va barcha yo‘llardan so‘ng bu yo‘lda so‘nggi so‘z bo‘lmish xokisor bir haqiqatga erishadi: hech kim jannatga yolg‘iz o‘z amali tufayli kirmaydi. Rasululloh sollallohu alayhi vasallam o'zlari haqida, ya'ni Alloh taologa eng sevimlisi bo'lib, u ham o'z amali bilan jannatga kirmasligini, magar Alloh uni O'z rahmatiga o'rab olishini aytdilar. Agar u uchun shunday bo'lsa, biz uchun ham shundaydir.",
      "Bu hech qachon ibodatni e'tiborsiz qoldirish uchun litsenziya sifatida noto'g'ri tushunilmasligi kerak. Amallar Alloh tanlagan va buyurgan vosita bo'lib qoladi; U O'z rahmatini iymon va solih amallarga bog'lab qo'ygan va ularni tark etish kamtarlik emas, balki g'aflatdir. To'g'ri ma'nosi mutanosiblikdir: amallarimiz qanchalar ko'p bo'lmasin, Alloh taoloning bizga bergan ne'matlarining zarrasini ham qaytara olmaydi va abadiy jannatni ham sotib olmaydi. Shunday qilib, biz sevgi va itoatkorlik belgisi sifatida amallarimizni taklif qilamiz, keyin ularni qabul qilish va bizni tan olish uchun Uning inoyatiga to'liq tayanamiz.",
      "Bu rahm-shafqat doirasi hayratlanarli. Rasululloh sollallohu alayhi vasallam aytdilarki, Alloh rahmatni yuz qismga ajratdi. Butun maxluqotga faqat bir qismini nozil qildi – va shu bilan ona bolaga mehribon, hayvonlar esa bolalariga mehribon bo‘ladi – qolgan to‘qson to‘qqiz qismini esa qiyomat kuni bandalariga ehson qilish uchun O‘z huzurida saqladi. Bu dunyoda biz guvoh bo'lgan har qanday rahm-shafqat yuzning bir qismining bir qismidir.",
      "Shuning uchun ham muvozanatli mo‘min ikki qanotli qushdek, umid va qo‘rquv orasida yashaydi. U Allohning adolatidan qo'rqadi va gunohga qo'l urmaydi va gunohga qo'l urmaydi va qanchalik adashgan bo'lsa ham Allohning rahmatidan umidini uzmaydi. To'liq qo'rquvga moyillik umidsizlikni keltirib chiqaradi; butunlay umidga moyillik takabburlikni keltirib chiqaradi. Allohning ismlari - Ar-Rahmon (Rahmon), Ar-Rohim (Rahmli), Al-G'afur (G'afur) - umid qanotini mustahkamlaydi.",
      "Shunday qilib, har kuni yopadigan ruhingiz shunday bo'lsin: Allohdan Firdavsni so'rang, qo'lingizdan kelganini qiling, kamchiliklaringiz uchun tavba qiling, so'ngra oxirgi martabangizni Odil va Rahmonga topshiring - o'sha kun uchun to'qson to'qqiz qism rahmatni saqlagan zot O'ziga intilib, umid qilib kelgan bandasini qaytarmasligiga ishoning.",
    ],
    quran: [
      {
        excerpt:
          "Mening rahmatim hamma narsani qamrab olgan. Bas, uni taqvodorlar, zakot beruvchilar va oyatlarimizga iymon keltirganlar uchun belgilayman.",
      },
      {
        excerpt:
          "Ayting: Ey o'zlariga zulm qilgan bandalarim, Allohning rahmatidan noumid bo'lmanglar. Albatta, Alloh barcha gunohlarni kechiradi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sizlardan hech biringiz o'z amali bilan jannatga kirmaydi. Ular: «Siz ham emasmisiz, ey Allohning Rasuli?» dedilar. U zot: «Men ham, Alloh taolo meni o'z rahmatiga o'rab olmasa», dedi.",
      },
      {
        excerpt:
          "Allohning rahmati yuz qismdir. U jinlar, odamlar, hayvonlar va hasharotlar orasida bir-birlariga rahm-shafqatli bo'lgan bir qismini tushirdi. va to'qson to'qqiz qismni O'zi huzurida saqladi, qiyomatda bandalariga rahm qiladi.",
      },
    ],
    actions: [
      "Allohdan qo'rqish bilan Uning rahmatidan umidvor bo'ling.",
      "Gunohdan keyin hech qachon umidsizlikka tushmang - tavba qiling va harakatda davom eting.",
      "Allohdan Firdavsni va yaxshi oxiratni so'rang.",
    ],
    appLinks: [{}, {}],
  },
];

export const JANNAH_GATES_UZ: DeepPartial<JannahGate>[] = [
  {
    name: "Ibodat darvozasi",
    deedSummary: "Besh vaqt namozni qo'riqlab o'qiganlar uchun.",
    hadith: [
      {
        excerpt:
          "Kim Alloh yo'lida bir juft nafaqa qilsa, jannat eshiklaridan chaqiriladi. Kim namoz ahlidan bo'lsa, namoz eshigidan chaqiriladi.",
      },
    ],
  },
  {
    name: "Xayriya darvozasi",
    deedSummary: "Alloh uchun ixlos bilan sadaqa qilganlar uchun.",
    hadith: [
      {
        excerpt: "Kim sadaqa ahlidan bo'lsa, sadaqa eshigidan chaqiriladi.",
      },
    ],
  },
  {
    name: "Ar-Rayyon darvozasi",
    deedSummary: "Ro'za tutganlar uchun ajratilgan - faqat ular kiradigan darvoza.",
    hadith: [
      {
        excerpt:
          "Jannatda “Ar-Rayyon” degan eshik borki, qiyomat kuni undan faqat ro‘zadorlar kiradi. Ularning oxirgisi kirganida, u yopiladi.",
      },
    ],
  },
  {
    name: "Jihod darvozasi",
    deedSummary: "Alloh yo'lida ixlos bilan jihod qilganlar uchun.",
    hadith: [
      {
        excerpt: "Kim jihod ahlidan bo'lsa, jihod eshigidan chaqiriladi.",
      },
    ],
  },
  {
    name: "Hajning mukofoti",
    deedSummary: "Sof haj qilganlar, gunohsiz qaytganlar uchun.",
    hadith: [
      {
        excerpt:
          "Kim Alloh uchun haj qilsa, fahsh va fahsh qilmasa, xuddi onasi dunyoga keltirgan kun kabi gunohsiz qaytadi.",
      },
    ],
  },
  {
    name: "Har bir darvozadan chaqiriladi",
    deedSummary: "Abu Bakr kabi ba'zilar barcha eshiklardan kirishga chaqiriladi.",
    hadith: [
      {
        excerpt:
          "Abu Bakr: “Bu eshiklardan birov chaqiriladimi?” deb so‘radi. U zot: «Ha, sen ham ulardan bo'lasan», dedilar.",
      },
    ],
  },
];

export const JANNAH_VERSES_UZ: DeepPartial<JannahVerseEntry>[] = [
  {
    excerpt:
      "Robbingiz tomonidan mag'firat va kengligi osmonlaru yerdek bo'lgan taqvodorlar uchun tayyorlangan jannatga yuguring.",
  },
  {
    excerpt:
      "Ostidan anhorlar oqib turuvchi jannatlar va abadiy jannatlarda go'zal maskanlardir. Lekin Allohning rizosi kattaroqdir.",
  },
  {
    excerpt: "Iymon keltirgan va yaxshi amallar qilgan zotlar uchun panoh jannatlaridir.",
  },
  {
    excerpt:
      "Qilgan amallarining mukofoti sifatida ular uchun qanday tasalli yashiringanini hech bir jon bilmas.",
  },
  {
    excerpt: "Ularga u yerda xohlagan narsalari bordir. Bizning huzurimizda ko'proq narsa bor.",
  },
  {
    excerpt: "Hammaga qilgan amallariga yarasha darajalar bordir.",
  },
  {
    excerpt:
      "Ular Alloh huzurida darajalardir. Alloh ularning qilayotgan amallarini ko'rib turuvchidir.",
  },
  {
    excerpt:
      "Ey Robbimiz, bizga bu dunyoda ham, oxiratda ham yaxshilik ato et va bizni do'zax azobidan saqla.",
  },
  {
    excerpt:
      "Allohning rahmatidan noumid bo'lmang, albatta, Alloh barcha gunohlarni mag'firat qiladi.",
  },
  {
    excerpt: "Ey bandalarim, bugun sizlarga qo'rquv yo'q va sizlar xafa bo'lmaysizlar.",
  },
  {
    excerpt: "Va oldingilar, oldingilar - ana o'shalar yaqin qilinganlardir.",
  },
  {
    excerpt:
      "Bas, Alloh ularni o‘sha kunning yomonligidan saqlaydi va ularga nur va baxt-saodat beradi.",
  },
];

export const JANNAH_DUAS_UZ: DeepPartial<JannahDuaEntry>[] = [
  {
    context: "Ikki dunyoda yaxshilik va do'zaxdan himoya qilish uchun keng qamrovli duo.",
  },
  {
    context: "Tashahhuddan keyin ixcham duo: Jannatni so'ra va do'zaxdan panoh.",
  },
  {
    context: "Tashahhuddan keyin Allohning go'zal ismlaridan foydalanib, jannatni so'rang.",
  },
  {
    context: "Allohni ko'rishning shirinligini va u bilan uchrashishni orzu qiling.",
  },
];

export const JANNAH_PROMISED_UZ: DeepPartial<JannahPromisedEntry>[] = [
  {
    name: "O'nta va'da qilingan jannat",
    summary:
      "Abu Bakr, Umar, Usmon, Ali, Talha, Zubayr, Abdurrahmon ibn Avf, Sa'd, Said ibn Zayd, Abu Ubayda (r.a.)",
    note: "“Sunan at-Termiziy”da (3747, sahih) hadisda birgalikda nom berilgan.",
  },
  {
    name: "Rostgo'y va sabrli",
    summary: "Alloh taolo iymonda rostgo‘y, itoat va fitnalarda sabr qiluvchilarni maqtaydi.",
    note: "Qur'on 4:69 va as-sodiqin va as-sobirin haqidagi ko'plab oyatlarga qarang.",
  },
  {
    name: "Alloh yo'lida shahidlar",
    summary:
      "Islom shariati asosida Islomni himoya qilib vafot etganlarga jannat bilan xushxabar beriladi.",
    note: "Ulamolar shahodatni aniq belgilaydilar; jangdagi har bir o'lim avtomatik ravishda mos kelmaydi.",
  },
  {
    name: "Oxirgi so'zlari tavhid bo'lganlar",
    summary: "Kimning oxirgi so'zi \"La ilaha illalloh\" bo'lsa, jannatga kiradi.",
    note: "Sunan Abu Dovud 3116 (sahih). Yaxshi yakun bir umrlik izlanishdir.",
  },
  {
    name: "Payg'ambarlar",
    summary: "Har bir payg‘ambar Alloh taoloning amri bilan jannatning eng yuqori darajalaridadir.",
    note: "Ularning stantsiyasiga oddiy ishlar bilan erishib bo'lmaydi - ular tanlangan va himoyalangan.",
  },
];
