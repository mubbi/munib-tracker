// Uzbek translation overlay for the Learn Battles content. Mirrors the order of
// its English source in ../battles*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  BattlesFigure,
  BattlesGlossaryTerm,
  BattlesLessonCard,
  BattlesTimelineEvent,
  BattlesTopic,
  BattlesVerse,
} from "../../types/battles";
import type { DeepPartial } from "./localize";

export const BATTLES_TOPICS_UZ: DeepPartial<BattlesTopic>[] = [
  {
    title: "Kirish",
    summary: "Tarixiy ma'lumotlar, ta'qiblar, hijrat va qachon jangga ruxsat berilgan.",
    body: [
      "Makkada vahiyning dastlabki o'n uch yilida musulmonlar zulmlarga sabr bilan chidashga buyurilgan - jang qilishga ruxsat berilmagan. Sahobalar oʻzlarini himoya qilishni soʻraganlarida, javob: “Qoʻllaringizni tiyinglar, namozni toʻkis ado etinglar va zakot beringlar” (Qur'on, 4:77). Ilk jamoa zulmga qurolli isyon bilan emas, sabr-toqat, hijrat va ibodat bilan javob bergan.",
      "Madinaga hijrat (622 milodiy / 1 hijriy) jamiyatning tamoyillarini emas, balki ahvolini o'zgartirdi. Yasribda musulmonlar Madina Konstitutsiyasiga, ya'ni shahardagi yahudiy qabilalari bilan o'zaro mudofaa va birga yashashga oid yozma ahdga bog'liq bo'lgan o'troq jamiyatga aylandilar. Rasululloh sollallohu alayhi vasallam endi hujum qilishlari mumkin bo'lgan va shuning uchun o'zlarini qonuniy himoya qila oladigan davlatning boshlig'i edilar.",
      "Shundan keyingina, yillar davom etgan zulmdan so‘ng, jang qilish uchun birinchi ruxsat tushdi - buning sababi mo‘minlarning “Robbimiz Allohdir” (Qur’on 22:39–40) deganlari uchun zulm qilinib, uylaridan haydalganligi edi. Ruxsat mudofaa va diniy erkinlikni himoya qilish uchun bo'lgan - xuddi shu oyatda \"monastirlar, cherkovlar, sinagogalar va masjidlar\" ning xavfsizligini bunday janglar saqlagan narsa deb ataydi - bosib olish, majburan diniy o'zgartirish yoki talon-taroj qilish uchun emas.",
      "Qur'on bu ruxsat atrofida doimiy chegara belgilab qo'ygan: \"Sizlar bilan jang qilganlar bilan Alloh yo'lida jang qilinglar, lekin haddan oshib ketmanglar\" (Baqara surasi, 190-oyat). Jang jamiyatga qarshi tajovuz bilan bog'liq edi va u hech qachon adolat chegarasidan chiqmasligi kerak edi.",
      "Bu yurishlar tarixdir: ular VII asrda arablarning qabila urushi, buzilgan shartnomalar va qamal sharoitida sodir bo'lgan. Tinchlik, adolat, rahm-shafqat va qo'shnichilik haqidagi umumiy islom ta'limotlari ramka; Bu janglarning tafsilotlari undan yirtilgan shiorlarga aylanib qolmasdan, shu ramka ichida o'qilishi kerak.",
    ],
    quran: [
      {
        excerpt:
          "O'z yurtlaridan nohaq haydalganlarga, zulmga uchragani uchun urushayotganlarga, albatta, Alloh g'alaba qozonishga qodirdir. Agar Alloh odamlarning bir qismini ba'zilari bilan daf qilmaganida edi, Allohning nomi ko'p zikr qilingan monastirlar, cherkovlar, sinagogalar va masjidlar vayron qilingan bo'lar edi.",
      },
      {
        excerpt:
          "Sizlar bilan urushayotganlar bilan Alloh yo'lida jang qilinglar, lekin haddan oshib ketmanglar. Albatta, Alloh zolimlarni sevmas.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nima uchun janglar sodir bo'ldi",
    summary: "Ta'qiblar, shartnomalarni buzish va jamiyatni himoya qilish - tajovuz emas.",
    body: [
      "Bu janglarning mazmuni va sababi musulmonlarning urushga bo'lgan ishtahasi emas, balki doimiy dushmanlik kampaniyasi edi. Makkada Quraysh zaiflarni qiynab, butun qavmni ochlik yoqasiga boykot qilgan, muhojirlardan qolgan mol-mulkni tortib olgan va hatto Payg'ambarimiz sollallohu alayhi vasallamga suiqasd uyushtirgan edi. Madinaga hijrat qilish tahdidni tugatmadi; uni boshqa joyga ko'chirdi.",
      "Badr (2 hijriy) o‘sha hal qilinmagan to‘qnashuvdan o‘sib chiqdi. Muhojirlardan tortib olingan mol-mulkni ko'targan katta Quraysh karvoni Suriyadan qaytayotgani xabari kelganida, Payg'ambar alayhissalom uni ushlab qolish uchun yo'lga chiqdilar. Karvon qochishga muvaffaq bo‘ldi, lekin Quraysh mingga yaqin qo‘shin yig‘ib, baribir yo‘lga chiqdi va yosh jamoani kuch bilan tor-mor etishga ahd qildi. Buning natijasi Badr quduqlari yonidagi jang bo'ldi.",
      "Madinada omon qolish shartnomalarga bog'liq edi va shartnomalar qayta-qayta buzildi. Shahar ahdiga binoan o'zaro mudofaa qilishga va'da bergan guruhlar o'rniga dushman bilan til biriktirdilar - Madinani Xandaqda (5-hijriy) qamal qilgan konfederatsiyalar musulmonlarni butunlay yo'q qilish uchun aniq to'plandilar.",
      "Shartnomani buzish oxirigacha hal qiluvchi bo'lib qoldi. Aynan Quraysh ittifoqchilari musulmonlarning ittifoqchilari bo'lmish Banu Xuzoaga hujum qilib, Hudaybiya shartnomasini bekor qildilar va Makkani qirg'inga emas, deyarli qonsiz ochilishiga olib keldilar.",
      "Bularning barchasida maqsadlar izchil edi: hayot va dinni himoya qilish, zaiflarni himoya qilish va tavhidni ta'qiblarsiz amalga oshirish mumkin bo'lgan xavfsizlikni ta'minlash. Maqsad hech qachon o'z manfaati uchun cheksiz kengayish bo'lmagan va manbalarda Rasululloh sollallohu alayhi vasallam dushman tinchlikka moyil bo'lganda sulh va ahdni afzal ko'rganliklarini qayd etadilar.",
    ],
    hadith: [
      {
        excerpt:
          "Menga odamlar Allohdan o‘zga iloh yo‘qligiga va Muhammad Allohning rasuli ekanligiga guvohlik bergunlaricha, namozni to‘kis ado etgunlaricha va zakot bergunlaricha ular bilan jang qilishga buyurildim. Agar shunday qilsalar, ularning jonlari va mollari mendan faqat Islomning haqqi bo‘lmasa, himoya qilinadi va ularning hisobi Allohning huzuridadir. - Klassik olimlar “xalq”ni Arabistonning o'ziga xos butparastlari, so'ngra ularga xabar yetib borganidan keyin Islomga qarshi urush olib borayotganlar deb o'qidilar; Bu Qur'on 2:256 to'g'ridan-to'g'ri man etilgan tinch musulmon bo'lmaganlarga hujum qilish yoki e'tiqodni majburlash uchun ruxsatnoma emas, balki dushman jangchilar haqidagi bayonotdir.",
      },
    ],
    quran: [
      {
        excerpt: "Dinda majburlash yo'q. To'g'ri yo'l xatodan ajralib turdi.",
      },
    ],
    disclaimer:
      "Yuqoridagi hadis ko'pincha o'z joyidan olib tashlanadi. Mumtoz ulamolar buni o'z davrining o'ziga xos dushmanliklari doirasida va Qur'onning dinda majburlashni taqiqlash (2:256) va jang faqat siz bilan jang qilganlarga qarshi bo'lgan chegara (2:190) bilan birga joylashtirdilar.",
    appLinks: [{}],
  },
  {
    title: "Islomda urush etikasi",
    summary:
      "Hech qanday tajovuz, tinch aholini qattiq himoya qilish va insoniy xatti-harakatlar Qur'on va Sunnatga asoslangan.",
    body: [
      "Islomning urush qonuni (siyar) to'g'ridan-to'g'ri Qur'on chegaralaridan va Payg'ambarning amaliyotidan kelib chiqqan. Uning asosi hamma narsani boshqaradigan yagona qoidadir: “Sizlar bilan urushayotganlarga qarshi jang qilinglar, lekin haddan oshib ketmanglar” (Baqara surasi, 190-oyat). Jang - bu tajovuzga javob, adolat bilan chegaralangan va dushman to'xtagan paytda to'xtashi kerak.",
      "Jangovar bo'lmaganlar qat'iy himoyalangan. Bir g'azotdan keyin o'ldirilgan ayol topilgach, Rasululloh sollallohu alayhi vasallam ayollar va bolalarni o'ldirishni to'g'ridan-to'g'ri man qildilar. Huquqshunoslar buni keksalarga, o'z kameralarida yolg'iz qolgan rohiblar va ibodat qiluvchilarga, qishloq xo'jaligi ishchilari va yollanma ishchilarga, shuningdek, urushda qatnashmaydigan har bir kishiga tarqatdilar. Ularni o'ldirish ruxsat etilgan ortiqcha narsa emas - bu taqiqlangan.",
      "Hatto faol jangchilarga qarshi ham, masala qilichdan oldin taklif edi. Rasululloh sollallohu alayhi vasallam qo'mondon tayinlaganlarida, avval boshqa tomonni Islomga, so'ngra rad etilsa, sulhga, agar ikkalasi ham rad etilgan bo'lsa, urushga, hech qachon iymonni buzmaslikka, jasadni o'ldirmaslikka va bolani o'ldirmaslikka buyurdilar (Sahih Musulmon 1731).",
      "Xiyonat qat'iyan man etiladi: shartnomalar o'z muddatiga rioya qilishlari kerak va dushmanga xiyonat qilishdan ko'ra adolatli ogohlantirish kerak. Jang maydonida \"urush yolg'ondir\" degan ruxsat faqat taktik hiyla-nayranglar, ajablanish, noto'g'ri yo'nalish - hech qachon ahdni buzmaslik yoki himoyalangan tomonga yolg'on gapirishni anglatadi.",
      "Mulk va yerning o'zi himoyalangan. Umumiy ko'rsatmalar mevali daraxtlarni behuda kesish, ekinlarni yoqish va zaruratdan tashqari chorva mollarini so'yishni taqiqlagan. Qamoqqa olinganlar yeb-ichganlaridek, mahbuslar ovqatlantirilishi va kiyinishlari kerak edi; Qur'on Allohning sevgisi uchun asirni boqadiganlarni maqtaydi (76:8) va ko'plari to'lov, ayirboshlash yoki oddiy rahm-shafqat bilan ozod qilindilar - ba'zilari Badrda musulmonlarga o'qishni o'rgatish evaziga ozod qilindi.",
      "Bu dinning me'yoriy ta'limotlari. Tarix bo'ylab ularni buzgan musulmonlar Islomni ta'riflamasdan, uni buzganlar - xuddi har qanday e'tiqod tarafdorlari tomonidan qilingan buzilishlar bu e'tiqod buyurgan narsalarni qayta yozmagani kabi.",
    ],
    quran: [
      {
        excerpt:
          "Sizlar bilan urushayotganlar bilan Alloh yo'lida jang qilinglar, lekin haddan oshib ketmanglar.",
      },
      {
        excerpt:
          "Agar ular tinchlikka moyil bo'lsalar, unga ham mayl qilinglar va Allohga tavakkal qilinglar. Albatta, U eshitguvchi va bilguvchi zotdir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ibn Umar raziyallohu anhu rivoyat qiladilar: «Rasululloh sollallohu alayhi vasallamning g‘azotlaridan birida bir ayol o‘ldirilgan holda topilib, ayollar va bolalarni o‘ldirishdan qaytardilar.",
      },
      {
        excerpt:
          "Rasululloh sollallohu alayhi vasallam bir qoʻshinga qoʻmondon etib tayinlaganlarida, unga buyurdilar: “Alloh nomi bilan jang qil... oʻljani oʻzlashtirma, ahdingni buzma, bolani oʻldirma. Dushmanga duch kelsangiz, avvalo ularni Islomga da’vat qiling; Agar rad etsalar, ularga tinchlik taklif qiling; Agar ikkalasi ham rad qilsalar, jang qilinglar.",
      },
      {
        excerpt:
          "Cholni ham, yosh bolani ham, ayolni ham o‘ldirmang. — Aynan shu lafzning baʼzi zanjirlari zaif deb baholangan, ammo u aytilgan hukm yuqoridagi sahih rivoyat va fiqhlar ijmosi bilan tasdiqlangan.",
      },
    ],
    actions: [
      "Islom nima amr qilgani va tarixdagi har qanday armiya aslida nima qilganini aniq ajrating.",
      "Har qanday jangovar hikoyadan oldin ushbu axloq bo'limini o'qing - boshqaruv tamoyillarisiz tarix tushunmovchilikni keltirib chiqaradi.",
      "Agar manba ushbu qoidalarga zid bo'lgan harakatni yozsa, xulosa chiqarishdan oldin uning mazmuni va haqiqiyligi haqida so'rang.",
    ],
    appLinks: [{}],
  },
  {
    title: "Badr jangi",
    summary: "17 ramazon 2 hijriy — birinchi yirik jang, ikkov kuni.",
    body: [
      "Mazmun va sabab: Hijratdan keyin Quraysh Makkada qolgan muhojirlarning uy-joylari va boyliklarini tortib olib, tahdidlarini davom ettirdi. Madinaga Abu Sufyon boy karvonni Suriyadan qaytib kelayotgani xabari yetib kelganida, Rasululloh sollallohu alayhi vasallam urush qilish uchun emas, balki mol-mulkni ushlab qolish niyatida yengil qo‘shin — taxminan 313 kishi bilan yo‘lga chiqdilar.",
      "Voqea sodir bo'ldi: Abu Sufyon qirg'oq bo'ylab sirg'alib o'tib ketdi, lekin u allaqachon Makkaga yordam so'rab yuborgan edi va Quraysh mingga yaqin jangchi, otliq qo'shin va rizq bilan musulmonlarga o'rnak bo'lishga qaror qildi. Badr quduqlarida jang bo'lishi muqarrar bo'lib, u erda al-Hubob ibn al-Munzirning maslahatiga ko'ra, musulmonlar birinchi bo'lib suvni tortib olishdi va uni dushmanga rad etishdi.",
      "O'sha kechada Rasululloh sollallohu alayhi vasallam tong otguncha namozda turdilar. O‘zidan uch barobar ko‘p qo‘shin bilan yuzma-yuz bo‘lib, qo‘llarini ko‘tarib, Parvardigoriga shunchalik astoydil duo qildiki, ridosi yelkasidan sirg‘alib ketdi: “Allohim, agar bu mo‘minlar guruhi halok bo‘lsa, senga yer yuzida ibodat qilinmas”, dedi. Qur'oni karimda Alloh taolo farishtalar orqali ijobat qilgani va mo'minlarning qalblariga xotirjamlik kiritgani qayd etilgan.",
      "Har ikki tomondan uchta chempion o'rtasidagi yakka kurashdan keyin qo'shinlar to'qnash kelishdi. Quraysh buzildi. Ularning yetmishga yaqin boshliqlari o'ldirildi, ular orasida Abu Jahl ham jamiyatning eng qattiq ta'qibchisi bo'lgan va yetmishga yaqini asirga olindi; o‘n to‘rt musulmon shahid bo‘ldi. Asirlarga hurmat bilan munosabatda bo'lishdi va ba'zilari musulmon bolalariga o'qish va yozishni o'rgatish orqali o'z ozodligini sotib oldilar.",
      "Asosiy shaxslar: Rasululloh sollallohu alayhi vasallamning yonida Abu Bakr, Umar, Ali va amakilari Hamza turishardi; Al-Hubobning quduqlar bo'yicha maslahati va Sa'd ibn Muozning strategiya bo'yicha maslahati g'alaba va'da qilingan taqdirda ham maslahat orqali etakchilikni ko'rsatadi.",
      "Qur'on butun yarim orol oldida haqiqatni botildan ajratgani uchun bu kunni yavm al-furqon - Furqon kuni deb ataydi. Undan doimiy saboq shundan iboratki, Allohga to'liq tavakkal qilish uchun sidqidildan harakat qilish va to'liq tayyorgarlik ko'rish kerak: mo'minlar saflarini tartibga soldilar, o'z joylarini tanladilar va duo qildilar va g'alaba ularning soniga emas, balki Allohga nasib etdi.",
    ],
    battleDetails: {
      location: "Madinaning janubi-g‘arbidagi Badr quduqlari",
      modernLocation: "Zamonaviy Badr yaqinida, Saudiya Arabistoni",
      hijriDate: "17 Ramazon 2 hijriy",
      muslimForces: "~313 jangchi, bir nechta ot va tuyalar (hisobotlar biroz farq qiladi)",
      opposingForces: "~1000 Quraysh, yaxshi qurollangan va otliq",
      muslimCommander: "Payg'ambar Muhammad s.a.v",
      opposingCommander: "Amr ibn Hishom (Abu Jahl), jangda o'ldirilgan",
      weather:
        "Kechagi yomg'ir musulmonlar uchun qumni mustahkamladi. suvga kirish hal qiluvchi ahamiyatga ega edi",
      outcome: "Musulmonlarning hal qiluvchi g'alabasi",
      keyEvents: [
        "Al-Hubob ibn al-Munzir suvni nazorat qilib, birinchi navbatda quduqlarda qarorgoh qurishni maslahat berdi.",
        "Rasululloh sollallohu alayhi vasallam tun bo'yi namoz o'qib, ko'p mo'minlar uchun Allohga iltijo qildilar.",
        "Uch Quraysh chempionini Hamza, Ali va Ubayda yakkakurashda kutib oldi.",
        "Alloh taolo mo'minlarni farishtalar bilan quvvatladi (Qur'on 8:9) va Qurayshning asosiy rahbarlarini yiqitdi.",
        "Dushmanning 70 ga yaqini o‘ldirildi, 70 nafari asirga olindi; asirlarga insoniy munosabatda bo‘lgan.",
      ],
      leadershipLesson:
        "Puxta tayyorgarlik ko'ring, ilm egalari bilan maslahatlashing, so'ngra to'liq Allohga tavakkal qiling.",
      spiritualLesson:
        "Ilohiy yordamga ega bo'lgan kichik bir samimiy guruh dunyoviy qiyinchiliklarni bartaraf eta oladi - g'alaba Allohdandir.",
      facts: [
        "Badr nomi Qur'onda boshqa har qanday nishonga qaraganda (Anfol surasi) ko'proq aytilgan va tasvirlangan.",
        "Madinalik bolalarga savod o‘rgatish evaziga ba’zi asirlar ozod qilindi.",
      ],
    },
    quran: [
      {
        excerpt:
          "O'shanda sizlar Robbingizdan yordam so'ragan edingiz va U sizlarga javob berdi: Men sizlarni bir-biringizga ergashgan mingta farishta bilan quvvatlayman.",
      },
      {
        excerpt:
          "To'qnash kelgan ikki lashkarda sizlar uchun oyat-belgi bor edi: biri Alloh yo'lida, biri kofirlardandir.",
      },
      {
        excerpt:
          "Ularni siz o'ldirmadingiz, balki Alloh ularni o'ldirgan. Otganingda ham tashlamading, balki Alloh tashlagandir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Umar raziyallohu anhu rivoyat qiladirlar: «Rasululloh sollallohu alayhi vasallam Badr kuni sahobalari uch yuzdan sal oshiqroq bo‘lganlarida mingta dushmanga qaradilar, so‘ng qiblaga qarab qo‘llarini cho‘zdilar va Parvardigoriga duo qildilar: «Allohim, menga va’da qilganingni vafo qilgin. Allohim, agar bu mo'minlar guruhi halok bo'lsa, Senga yer yuzida ibodat qilinmaydi. Toki ridosi yelkasidan tushgunicha yolvorib turdi va Abu Bakr uni o‘rniga qo‘yib: “Bo‘ldi, ey Allohning payg‘ambari, Alloh senga bergan va’dasini vafo qiladi”, dedi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Uhud jangi",
    summary: "Hijriy 3 Shavvol - itoat, intizom va sabr-toqatda qimmatli dars.",
    body: [
      "Mazmun va sabab: Badrdan bir yil o'tgach, Quraysh o'liklari uchun qasos olish uchun qaytib keldi va 3000 ga yaqin jangchini to'pladi - o'sha paytda hali ham dushman bo'lgan Xolid ibn al-Volid boshchiligidagi otliq qo'shinlar va ayollar nog'ora va elegiyalar bilan erkaklarni da'vat qilishdi. Taxminan 700 nafar musulmonlar orqaga chekinib, Uhud tog'iga o'rnashib oldilar.",
      "Nabiy sollallohu alayhi vasallam ellikta kamonchini qo'shinning orqa tomonini qo'riqlab turgan tepalikka qo'yib, ularga ta'kidlash uchun: \"Bizni qushlar tomonidan tortib ketayotganimizni ko'rsangiz ham, men sizlarga odam yubormagunimcha, bu joydan ketmanglar\", deb buyurdilar. Dastlab bu reja to‘liq amalga oshdi — musulmonlar Qurayshni ortga haydab, dushman qocha boshladi.",
      "Dushmanning tarqalib ketganini va o'ljalarning ochiq yotganini ko'rgan kamonchilarning ko'pchiligi jangda g'alaba qozonganiga amin bo'lib, buyruqqa zid ravishda tepalikni tark etishdi. Xolid ibn Valid shu lahzadan foydalanib, otliq askarini himoyalanmagan bo‘shliqdan o‘tkazib, musulmonlarni orqasidan urib yubordi. Tartib tartibsizlikka tushib ketdi.",
      "Asosiy raqamlar va xarajat: “Allohning arsloni” Hamza ibn Abdulmuttalib yetmish nafarga yaqin sahobalari bilan shahid bo‘ldi. Payg'ambar sollallohu alayhi vasallamning o'zi yaralangan edi - tishlari singan va yuzlari kesilgan - va uning o'ldirilganligi haqidagi mish-mishlar tarqaldi. Mo‘minlar uning tirikligini ko‘rgach, tog‘ yonbag‘rida uning oldiga to‘planishdi va Quraysh ularni tugata olmay, orqaga chekindi.",
      "Qur’oni karim Oli Imron surasida bu kun haqida keng qamrovli bo‘lib, mas’uliyatni iymonsiz yoki Allohning va’dasini buzganligi uchun emas, balki ba’zilarning itoatsizligi zimmasiga yuklaydi: “Albatta, Alloh sizlarga bergan va’dasini vafo qilgan edi... toki sizlar jasoratingizni qo‘ldan boy bermaguningizcha, buyruq ustida tortishmaguningizcha va sizga yaxshi ko‘rgan narsalaringizni ko‘rsatgandan keyin itoatsizlik qilganingizcha” (3:152). Shunga qaramay, xuddi shu parcha yarador jamoaga taskin beradi va umidsizlikdan qaytaradi.",
      "Shuning uchun Uhud islomning mag'lubiyati emas, balki saqlanib qolgan saboqdir: avval berilgan g'alaba intizom buzilgan paytda bekor qilingan, aniq buyruqlar jasorat kabi muhim va sinovlar jamoani tozalaydi - tavba qilib, qattiqqo'l bo'lganlar uchun mag'lubiyat o'sish urug'iga aylanadi.",
    ],
    battleDetails: {
      location: "Madina shimolidagi Uhud tog'ining yon bag'irlari",
      modernLocation: "Uhud, Madina viloyati, Saudiya Arabistoni",
      hijriDate: "Shavvol 3 hijriy",
      muslimForces: "~ 700 (jang oldidan ba'zilari chekinganidan keyin)",
      opposingForces: "~3000 quraysh va ittifoqchilar otliq askar bilan",
      muslimCommander: "Payg'ambar Muhammad s.a.v",
      opposingCommander:
        "Abu Sufyon ibn Harb; Xolid ibn al-Volid qanotdagi otliqlarga boshchilik qildi",
      outcome:
        "Qurayshning taktik maydon ustunligi; musulmon jamiyati buzilmagan holda omon qoladi",
      keyEvents: [
        "Rasululloh sollallohu alayhi vasallam 50 ta kamonchini bir tepalikka qo'yib, undan hech qachon chiqmaslikni buyurdilar.",
        "Musulmonlar dushman chizig‘ini buzib tashlashdi, lekin kamonchilarning ko‘pchiligi o‘lja yig‘ish uchun o‘z postini tashlab ketishdi.",
        "Xolid ibn Valid otliqlari bo‘shliqdan foydalanib, orqadan zarba berdi.",
        "Hamza va 70 ga yaqin sahobalari shahid bo‘ldilar; Rasululloh sollallohu alayhi vasallam yaralandilar.",
        "Payg'ambarning o'limi haqidagi yolg'on mish-mish tarqaldi; mo'minlar uni tirik ko'rib, yig'ilishdi.",
      ],
      leadershipLesson:
        "Aniq buyruqlar va intizomli bajarish jasorat kabi muhimdir; postingizdan voz kechish g'alabani bekor qilishi mumkin.",
      spiritualLesson:
        "Sinovlar imonlilarni tozalaydi; muvaffaqiyatsizlik tavba bilan uchrashdi va mustahkamlik o'sishga olib keladi.",
    },
    quran: [
      {
        excerpt:
          "Albatta, siz ularni O'zining izni bilan o'ldirayotganingizda, Alloh sizga bergan va'dasini vafo qilgan edi, toki sizlar yaxshi ko'rgan narsalaringizni ko'rsatgandan keyin jasoratingizni yo'qotib, amr ustida tortishib, osiy bo'ldingiz.",
      },
      {
        excerpt:
          "Bas, zaiflashmang va xafa bo'lmang, chunki agar haqiqiy mo'min bo'lsangiz, sizlar ustun bo'lasiz.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Rasululloh sollallohu alayhi vasallam Uhud kuni Abdulloh ibn Jubayrni ellikta kamonchiga tayinladilar va dedilar: Agar bizni qushlar olib ketayotganini ko'rsangiz ham, men sizni chaqirmagunimcha uni tark etmangiz - va agar biz ularni mag'lub qilganimizni ko'rsangiz ham, men sizni chaqirmagunimcha ketmang. Dushman tor-mor etib, o‘ljalarni ko‘rgan kamonchilar: “O‘lja! va o'z lavozimini tark etdilar - bizdan yetmish kishi halok bo'ldi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Xandaq jangi",
    summary:
      "5-hijriy shavvol — konfederatsiyalar Madinani qamal qilishdi; xandaq va shamol ularni buzadi.",
    body: [
      "Kontekst va sabab: G'azvat al-Ahzob (Konfederatsiyalar jangi) deb ham ataladigan bu dushmanning Islomni butunlay yo'q qilishga qaratilgan eng katta harakatlari edi. Oldin xiyonat qilgani uchun haydalgan Banu Nodir qabilasining boshliqlari Makkaga va G‘atafonaga otlandilar va koalitsiya — Quraysh, G‘atafonlar va boshqa qabilalarni yig‘dilar, hisob-kitoblarga ko‘ra, 10 000 dan 24 000 kishigacha. Musulmonlar soni 3000 ga yaqin edi va xavf mavjud edi.",
      "Nima bo'ldi: Birorta arab shahri ochiq jangda bardosh bera olmaydigan qamalga duch kelganida, Payg'ambarimiz (s.a.v.) sahobalari bilan maslahatlashdilar. Salmon al-Forisi arab urushiga noma'lum bo'lgan forscha taktikani taklif qildi - ochiq shimol tomonda chuqur xandaq qazish, lava maydonlari, bog'lar yoki mustahkam uylar bilan himoyalanmagan yagona tomon. Rasululloh sollallohu alayhi vasallam ro'za azobiga qarshi o'z bellarida tuproq ko'tarib, qorinlariga tosh bog'lab, qattiq sovuq va ochlikda kunlarcha qazishdi.",
      "Xandaq ishladi. Katta mezbon yetib kelganida, u o'ta olmadi; uni sakrab tushgan bir necha otliq orqaga haydaldi. Qamal ikki-to'rt haftalik sovuq, keskinlik va to'qnashuvlarga o'tdi.",
      "Jamiyat o'z mohiyatiga ko'ra sinovdan o'tdi. Munofiqlar uzr so'rab, sirg'alib ketishga intildilar; Shahar ichidagi Banu Qurayza qabilasi dushmanga qarab ikkilanib qoldi. Qur'onda qalblarning tomoqqa yetib borishi tasvirlangan. Shunga qaramay, mo'minlar ushlab turdilar va Nu'aym ibn Mas'ud - yangi musulmon bo'lgan - yashirincha - ittifoqchilar o'rtasida ishonchsizlik sepib, ular bir-birlariga to'qnash kelishdi.",
      "Keyin yengillik qilichdan emas, Allohdan keldi. Qattiq, sovuq shamol dushman qarorgohini yirtib tashladi, olov va chodirlarni ag'darib yubordi va ko'rinmas qo'shinlar ularni dahshatga to'ldirdi. Allaqachon parchalanib ketgan va ta'minoti kam bo'lgan koalitsiya parchalanib, kechasi chiqib ketdi. Keyin Payg'ambar sollallohu alayhi vasallam ittifoqchilarni yolg'iz Alloh mag'lub etdi, dedilar.",
      "Barqaror saboqlar: sog'lom maslahat qayerdan kelgan bo'lsa, qabul qilinishi kerak - bu erda forsga o'tgandan; vositalar o'z chegarasiga olinishi kerak - xandaq qazilgan, saflar tutilgan; So'ngra oqibat Allohga topshiriladi, U esa qo'shinni shamol bilan qaytara oladi. Ahzob surasi butun sinov va uning yengilligini saqlaydi.",
    ],
    battleDetails: {
      location: "Shimol taraflari Madinaga yaqinlashadi",
      modernLocation: "Madina, Saudiya Arabistoni",
      hijriDate: "Shavvol 5 hijriy",
      muslimForces: "~3000",
      opposingForces:
        "Konfederatsiya koalitsiyasi (~10 000–24 000; raqamlar manbalarda farqlanadi)",
      muslimCommander: "Payg'ambar Muhammad s.a.v",
      opposingCommander:
        "Abu Sufyon Qurayshga boshchilik qildi; gatafanning ittifoqchi boshliqlari va boshqalar",
      weather: "Qazish paytida qattiq sovuq; shiddatli ilohiy shamol qamalni tugatdi",
      outcome: "Qattiq jangsiz musulmonlarning g'alabasi; koalitsiya tarqaladi",
      keyEvents: [
        "Salmon al-Forisi zaif shimoliy koridor bo'ylab xandaq qazishni taklif qildi.",
        "Rasululloh sollallohu alayhi vasallam tuproq ko'tarib, ochlikka tosh bog'lab, mehnatga sherik bo'lganlar.",
        "Xandaq keng qo'shinni to'xtatib, ochiq jang o'rniga qamal qilishga majbur qildi.",
        "Nu'aym ibn Mas'ud ittifoqchi ittifoqchilarni parchalab tashlagan nifoqni sochdi.",
        "Sovuq shamol va ko'rinmas qo'shinlar (Qur'on 33:9) dushman qarorgohini parchalab tashladi; chekindilar.",
      ],
      leadershipLesson:
        "Kelib chiqishidan qat'i nazar, keng ko'lamli maslahatlashing va yaxshi g'oyalarni qabul qiling; jamiyatning qiyinchiliklariga o'zingiz sherik bo'ling.",
      spiritualLesson:
        "Qamalda qattiq turing va natijani Allohga topshiring, U lashkarni shamol bilan qaytara oladi.",
    },
    quran: [
      {
        excerpt:
          "Ey mo'minlar, Allohning sizga bergan ne'matini eslang, o'shanda sizlarga qo'shinlar kelganda, Biz ularga shamol va siz ko'rmagan qo'shinlarni yubordik... U erda mo'minlar imtihon qilindi va qattiq larzaga tushdi.",
      },
      {
        excerpt:
          "Mo'minlar ittifoqchilarni ko'rganlarida: \"Bu Alloh va Uning Rasuli bizga va'da qilgan narsadir\", dedilar va bu ularning iymon va bo'ysunishlarini oshirdi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Rasululloh sollallohu alayhi vasallam Ahzob kuni ittifoqchilarga duo qilib: “Ey, kitobni nozil qiluvchi, hisobda tez bo‘lgan Allohim, ittifoqchilarni mag‘lub et”, dedilar. Allohim, ularni mag'lub et va ularni silkit.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Banu Qurayza",
    summary:
      "5 hijriy — qamal paytida xiyonat qilingan shartnoma; kelishilgan hakam tomonidan hukm.",
    body: [
      "Mazmun va sabab: Banu Qurayza Madinadagi yahudiy qabilasi boʻlib, shaharning oʻzaro mudofaa ahdiga binoan musulmonlar bilan bogʻlangan. Xandaq balandligida, ittifoqchilar Madinaga qo'ng'iroq qilib, jamoaning omon qolishi ipga osilganida, Banu Nodir boshlig'i Qurayza boshliqlarini bu ahdni buzib, shahar ichidan ikkinchi jabha ochishga ko'ndiradi. O'sha paytda bu shaxsiy nizo emas, Madinadagi hammani vayron qilishi mumkin bo'lgan qamal paytidagi xiyonat edi.",
      "Nima bo'ldi: Birlashmalar chekingach, Rasululloh sollallohu alayhi vasallam Banu Qurayza qavmiga qarshi harakat qildilar, ular o'zlarining qal'alariga qamab qo'yishdi. Qamal yigirma besh kun davom etdi, toki ular taslim boʻlishga rozi boʻldilar, lekin ular oʻz taqdirlarini Rasululloh sollallohu alayhi vasallam toʻgʻridan-toʻgʻri emas, balki oʻzlari tanlagan hakam: Avs qabilasining boshligʻi Saʼd ibn Muoz, oʻzlarining azaliy ittifoqchilari hal qilishlarini soʻrashdi.",
      "Hukm: Sa'd - o'zi Xandaqda olgan yarasidan vafot etar ekan - xiyonat qilgan jangchilarni qatl qilish, ayollar va bolalarni asirga olish haqida hukm chiqardi. Rasululloh sollallohu alayhi vasallam Sa'd Allohning hukmi bilan hukm qildilar, dedilar.",
      "Qanday qilib uni diqqat bilan o'qish kerak: Bu jamiyatning eng zaif vaqtida mudofaa shartnomasini buzgan jangchilar tomonidan urush davridagi xiyonatning o'ziga xos harakati uchun jazo edi - bu xalqning e'tiqodi uchun hukm emas va musulmonlarning yahudiylarga yoki biron bir diniy jamoaga nisbatan qanday munosabatda bo'lishining namunasi emas. Qur'on va Sunnat tinch-totuv g'ayridinlarga nisbatan adolat va yaxshi muomala qilishni buyuradi (Qur'on 60:8) va Madinaning boshqa yahudiy qabilalari va imonli odamlari hech qachon zarar ko'rmagan. Asosiy stipendiya buni xiyonat qonunining cheklangan tarixiy epizodi sifatida ko'radi va ba'zi keyingi olimlar hatto uzatilgan raqamlarning tafsilotlarini shubha ostiga qo'yishdi.",
      "Qur'on \"Ahzob\" surasidagi konfederatsiya urushining natijasi sifatida g'alaba qozonmagan epizodga ishora qiladi. Doimiy saboq - ahdni buzishning og'irligi - umumiy xavf-xatarli daqiqada ishonchga xiyonat qilish eng og'ir vaznga ega - hatto dushman ham nazoratsiz qasos olishdan ko'ra kelishilgan va xolis hakam tomonidan hukm qilish huquqiga ega degan tamoyildan tashqari.",
    ],
    battleDetails: {
      location: "Madina chekkasidagi Banu Qurayza qal’alari",
      modernLocation: "Madina, Saudiya Arabistoni",
      hijriDate: "Zulqa'da 5 hijriy (xandaqdan keyin)",
      muslimForces: "Madina qo'shini, Xandaq qamal qilingandan so'ng darhol",
      opposingForces: "Banu Qurayza, o'z istehkomlari ichida mustahkamlangan",
      muslimCommander: "Payg'ambar Muhammad s.a.v",
      outcome:
        "Qamaldan keyin taslim bo'lish; qabilaning o'zi tanlagan hakami tomonidan chiqarilgan hukm",
      keyEvents: [
        "Banu Qurayza qo‘shinlari qo‘shinlar qamalida Madina ahdini buzdilar.",
        "Konfederatsiyalar chekingandan so'ng, musulmonlar ularning qal'alarini taxminan 25 kun davomida qamal qilishdi.",
        "Bu qabila o'zlarining uzoq yillik ittifoqchilari bo'lgan Avs qabilasining boshlig'i Sa'd ibn Muoz tomonidan hukm qilinishini so'radi.",
        "Sa'd qamalda xiyonat qilgani uchun zamonning urush qonuni bilan hukmronlik qildi; Rasululloh sollallohu alayhi vasallam hukmni tasdiqladilar.",
      ],
      leadershipLesson:
        "Hatto dushmanga qarshi ham, nazoratsiz qasos olishdan ko'ra, kelishilgan, xolis hakam hukmiga ruxsat bering.",
      spiritualLesson:
        "Umumiy xavf-xatar paytida o'zaro himoya ahdini buzish xiyonatning eng og'irlaridan biridir.",
    },
    quran: [
      {
        excerpt:
          "Va u kitob ahlidan o'zlariga yordam bergan va qalblariga qo'rquv solgan kimsalarni, o'zingiz o'ldirgan toifani va sizlar asir olgan toifani tushirdi. Va sizlarga ularning yerlarini va uylarini voris qildi.",
      },
      {
        excerpt:
          "Alloh sizlarni din tufayli sizlar bilan urushmagan va sizlarni o'z yurtlaringizdan chiqarib yubormagan kimsalarga yaxshilik qilishdan va ularga nisbatan adolatli bo'lishdan qaytarmaydi. Albatta, Alloh adolat qiluvchilarni sevadi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Banu Qurayza Sa’d ibn Muozning hukmini qabul qilishga rozi bo‘lgach, Rasululloh sollallohu alayhi vasallam uni chaqirtirdilar. U keldi, Rasululloh sollallohu alayhi vasallam: «Boshlig'ingga turinglar», dedilar. Sa'd ularning jangchilari o'ldirilishi va ayollari va bolalari asirga olinishi haqida hukm qildi. Rasululloh sollallohu alayhi vasallam: «Sizlar Allohning hukmi bilan hukm qildingiz yoki podshohning hukmi bilan hukm qildingiz», dedilar.",
      },
    ],
    disclaimer:
      "Bu qabila o'zi tanlagan hakam tomonidan hukm qilingan jangchilar tomonidan urush davridagi xiyonat uchun jazo edi. Bu hech bir xalqning diniga qarshi hukm emas va Islom adolat va mehribonlik bilan muomala qilishni buyurgan yahudiylar yoki diniy jamoalar bilan munosabatlar uchun namuna emas (Qur'on 60:8). Keyinchalik ba'zi olimlar uzatilgan raqamlarning tafsilotlarini shubha ostiga qo'yishdi.",
  },
  {
    title: "Hudaybiya shartnomasi",
    summary:
      "6-hijriy - sulh bo'lib ko'ringan muvaffaqiyatsizlikka o'xshardi va aniq g'alabaga aylandi.",
    body: [
      "Mazmun va sabab: Rasululloh sollallohu alayhi vasallam 6-hijriy yilda 1400 ga yaqin sahobalari bilan qurolsiz, ammo yoʻlovchilarning qilichlari bilan yoʻlga chiqdilar, jang qilish uchun emas, faqat Ka’bani kichikroq umra ziyoratini ado etish niyatida edilar. Quraysh musulmonlarni Makkaga kiritayotganini ko'rishni istamay, muqaddas chegaradagi Hudaybiya degan joyda yo'lni to'sdi.",
      "Ridvon bay’ati: “Quraysh payg‘ambarning elchisi Usmon ibn Affonni o‘ldirgan”, degan mish-mish lagerga yetib borgach, Payg‘ambarimiz (s.a.v.) sahobalarni qochmasliklari uchun akasiya daraxti ostida bay’at qilishga chaqirdilar. Taxminan o'n to'rt yuz kishi bu bay'at - Bay'at ar-Ridvon, Ilohiy rozilik bay'ati - berdilar va Qur'on keyinroq: \"Mo'minlar daraxt tagida senga bay'at qilganlarida Alloh ulardan rozi bo'ldi\" (48:18). Usmon tirik ekani ko'rindi va Quraysh bu qarordan xavotirga tushib, muzokaraga jo'natdi.",
      "Nima bo'ldi: sulh shartlari kamsituvchidek tuyuldi. Musulmonlar bu yil umrasiz ortga qaytishadi va faqat keyingi yil qaytishlari mumkin edi. O'n yillik tinchlik bo'lardi. Qurayshdan musulmonlarga qochgan har bir kishi qaytarilar edi, lekin teskarisi emas - bu tishlagan band. Aynan shu band ostida kishanlangan musulmon Abu Jandal ularning ko'z o'ngida sudralib kelinganida, sahobalar sinib ketish arafasida edilar. Umar buni ochiqdan-ochiq so'radi va Rasulullohga tavakkal qilishni muloyimlik bilan eslatdi.",
      "Nima uchun bu g'alaba edi: Quraysh birinchi marta yozma shartnomada musulmonlarga teng kuch sifatida qaragan. O'n yillik tinchlik yo'llarni ochdi; Islom sulh davrida tez va tinch tarqaldi - bu ikki yil ichida Islomga avvalgi yillardagidan ko'ra ko'proq kirdi. Quraysh jabhasidan ozod boʻlgan Paygʻambarimiz sollallohu alayhi vasallam Xaybarga yuzlanib, podshohlar va qabilalarni Islomga daʼvat qiluvchi maktublar yuborishlari mumkin edi. Qaytishda: «Albatta, Biz senga ochiq-oydin g'alabani berdik», deb boshlanuvchi Fath surasi nozil bo'ldi.",
      "Barqaror saboqlar: Bu nafsga sabr-toqatning va qarorning hikmati hali ko'rinmasa, Alloh va Uning Rasuliga ishonishning eng oliy namunasidir. Sahobalar birinchi marta mag'lubiyatga uchragan narsani Qur'on aniq g'alaba deb atagan va ikki yil ichida Makkaning o'ziga yo'l ochgan. Qattiq tinchlikni qabul qilish, shartnomani hurmat qilish va kutishga tayyorlik bu erda zaiflik emas, balki kuch sifatida namoyon bo'ladi.",
    ],
    battleDetails: {
      location: "Hudaybiya, Makka yaqinidagi muqaddas chegarada",
      modernLocation: "Makka yaqinidagi Al-Shumaysi, Saudiya Arabistoni",
      hijriDate: "Zulqa’da 6 hijriy",
      muslimForces: "~1400 ziyoratchi, urush uchun jihozlanmagan",
      opposingForces: "Makka yo'lini to'sgan Quraysh",
      muslimCommander: "Payg'ambar Muhammad s.a.v",
      outcome: "O'n yillik sulh; jang yo'q; keyinchalik Qur'onda ochiq-oydin g'alaba deb atalgan",
      keyEvents: [
        "Musulmonlar jang uchun emas, umra uchun yo‘lga tushdilar va Hudaybiyada to‘xtatildi.",
        "Usmonning o'limi haqidagi yolg'on xabarda ~ 1400 kishi daraxt tagida Ridvon bay'atini berdi.",
        "Sahobalar achchiq deb topilgan shartlar asosida o'n yillik sulh imzolandi (qaytish bandi, Abu Jandal).",
        "Islom tinchlik davrida tez tarqaldi; Fath surasi shartnomani ochiq-oydin g'alaba deb atadi.",
      ],
      leadershipLesson:
        "Qattiq tinchlikni qabul qiling va uni hurmat qiling; bugungi dono yon berish ertaga kattaroq eshikni ochishi mumkin.",
      spiritualLesson:
        "Qarorning hikmati yashirin bo'lsa, Allohga va Uning Rasuliga ishoning - sabr eng haqiqiy g'alaba bo'lishi mumkin.",
    },
    quran: [
      {
        excerpt:
          "Darhaqiqat, Alloh sizning oldingi va keyingi gunohlaringizni mag'firat qilishi, sizga bo'lgan ne'matini to'ldirishi va sizni to'g'ri yo'lga hidoyat qilishi uchun sizga ochiq-oydin g'alabani berdik.",
      },
      {
        excerpt:
          "Albatta, Alloh mo'minlar daraxt tagida senga bay'at qilganlarida ulardan rozi bo'ldi va ularning qalblaridagi narsani bildi, bas, ularga xotirjamlik tushirdi va ularni yaqinlashib kelayotgan g'alaba bilan mukofotladi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Jobir ibn Abdulloh aytadilar: “Hudaybiyya kuni biz o‘n to‘rt yuz kishi edik. Daraxt tagida Rasululloh sollallohu alayhi vasallamga bay’at qildik, u zot odamlarning eng yaxshisi edi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Xaybar ekspeditsiyasi",
    summary:
      "7 hijriy - Konfederatsiyalarni qo'llab-quvvatlagan mustahkam istehkomlar bo'ysundirildi.",
    body: [
      "Mazmun va sabab: Xaybar Madina shimolidagi unumdor voha qal'alari bo'lib, unda ilgari xiyonat qilgani uchun quvilgan qabilalar, jumladan, Xandaqda konfederatsiya koalitsiyasini tashkil qilgan Banu Nodir boshliqlari joylashgan. U yerdan Madinaga qarshi dushmanlarni to'plashda davom etdilar. Quraysh jabhasi Hudaybiya tomonidan muzlatib qoʻyilgandan soʻng, Rasululloh sollallohu alayhi vasallam bu qolgan dushmanlik bazasini zararsizlantirish uchun harakat qildilar.",
      "Nima bo'ldi: Musulmonlar - 1600 ga yaqin - qal'alarga birin-ketin yurishdi. Kampaniya qiyin va bir necha hafta davom etdi. Bir og‘ir kunlarda Rasululloh sollallohu alayhi vasallam: “Ertaga bayroqni Alloh va Uning Rasulini yaxshi ko‘radigan, Alloh va Uning Rasuli yaxshi ko‘radigan, uning qo‘li bilan Alloh g‘alaba qozonadigan kishiga beraman”, dedilar. Ertasi kuni ertalab u ko'zlari og'riyotgan Ali ibn Abu Tolibni chaqirib, tuzalib ketguniga qadar uning ustidan duo qildi va unga bayroqni berdi. kalit qal'a qulab tushdi.",
      "Aholi punkti: Qal'alar olinganda, aholi quvib chiqarilmadi. Ular qolib, erni dehqonchilik qilishni va musulmonlarga hosildan ulush berishni so'rashdi va Rasululloh sollallohu alayhi vasallam rozi bo'ldilar. Bu tartib - zabt etilgan dehqonlar o'z erlarida hosil bo'lish shartnomasi bo'yicha ushlab turilgan - keyingi islom shartnomalari va soliq qonunlarida o'rganilgan dastlabki pretsedent bo'ldi.",
      "Muhim raqamlar: kampaniya, avvalambor, Alining roli va bayroq hadislarida ifodalangan axloqi bilan esda qoladi - rahbarlik faqat martaba yoki kuch emas, balki samimiylik va Allohga muhabbat asosida ishonib topshiriladi.",
      "G'amxo'rlik haqida eslatma: Xaybar ba'zida ancha keyingi siyosiy bahslarga tortiladi. Bu erda u qat'iy ravishda klassik sierada qayd etilgan VII asr ekspeditsiyasi sifatida tasvirlangan - faol dushman bazaga javob, ommaviy haydash bilan emas, balki muzokaralar yo'li bilan yakunlangan.",
    ],
    battleDetails: {
      location: "Xaybar vohasi, Madina shimoli",
      modernLocation: "Xaybar, Saudiya Arabistoni",
      hijriDate: "Muharram – Safar 7 hijriy",
      muslimForces: "Taxminan 1600",
      opposingForces: "Bir nechta qal'alar bo'ylab mustahkamlangan garnizonlar",
      muslimCommander:
        "Payg'ambar Muhammad s.a.v.; Hal qiluvchi hujumni Ali ibn Abu Tolib boshqardi",
      outcome: "Qal'alarning musulmonlar nazorati; mahsulot taqsimoti bo'yicha kelishuv",
      keyEvents: [
        "Bir necha haftalik qamalda qal'alar birin-ketin qisqartirildi.",
        "Bayroq Payg'ambarimiz sollallohu alayhi vasallam duolari bilan ko'zlari shifo topgan Aliga berildi.",
        "Chempion Marhobni yengib, kalit qal’a qulab tushdi.",
        "Aholi o'z yerlarida hosilni taqsimlash shartnomasi bo'yicha dehqon sifatida qolishgan.",
      ],
      leadershipLesson:
        "Mas'uliyatni eng mos bo'lganlarga va qalblari Allohga ixlos qilganlarga topshiring.",
      spiritualLesson:
        "Uzoq davom etgan mashaqqatlarga sabr qilish, ixlosga qo'shilish Allohning yordamini keltiradi.",
    },
    hadith: [
      {
        excerpt:
          "Xaybar kuni Rasululloh sollallohu alayhi vasallam aytdilar: Ertaga men bu bayroqni Alloh va Uning Rasulini sevadigan, Alloh va Uning Rasuli yaxshi ko‘radigan va uning qo‘li bilan Alloh g‘alaba qozonadigan kishiga beraman. Ertasi kuni ko'zlari og'riyotgan Alini chaqirdi; uning ko'zlariga tupurib duo qildi va Ali hech qachon kasal bo'lmagandek tuzalib ketdi va unga bayroq berildi.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Mu'ta jangi",
    summary:
      "Jumada al-Ula 8 hijriy - chegara g'azoti, unda uchta qo'mondon navbat bilan shahid bo'ladi.",
    body: [
      "Mazmun va sabab: Payg'ambarimiz sollallohu alayhi vasallam Vizantiyaga qo'shilgan shimolga elchi jo'natgan edilar va elchi o'ldirildi - bu jiddiy buzilish, chunki elchilar xalqlar qonuni bilan himoyalangan edi. Bunga javoban u taxminan 3000 kishilik qoʻshinni Iordaniyaning sharqidagi Rim chegarasi yaqinidagi Mu'ta shahriga joʻnatdi.",
      "Buyruqlar zanjiri: Ular yo‘lga chiqishdan oldin Rasululloh sollallohu alayhi vasallam bir qatorni – Zayd ibn Horisani, agar u yiqilsa, Ja’far ibn Abu Tolibni, yiqilib tushsa, Abdulloh ibn Ravohani tayinladilar.",
      "Nima bo'ldi: Mu'tada musulmonlar Vizantiyaliklar va ittifoqdosh arab qabilalarining ancha katta kuchini uchratishdi - manbalarda o'n minglab kishilar haqida gap boradi, ammo raqamlar noaniq va bo'rttirilgan. Zayd yiqildi, so'ngra ikki qo'llari uzilgangacha bayroqni ushlab turgan Ja'far, so'ngra Abdulloh ibn Ravoha, xuddi Payg'ambar sollallohu alayhi vasallam qo'ygan tartibda yiqildi.",
      "Chiqib ketish: Har uch tayinlangan qo'mondon shahid bo'lgach, sahobalar bayroqni Hudaybiyadan keyin yangi musulmon bo'lgan Xolid ibn al-Volidga berishdi. Bir qator manevrlar va qo'shinlarni qayta joylashtirish orqali u soni ko'p bo'lgan qo'shinni bo'shatdi va uni uyiga deyarli butun holda olib keldi - bu Rasululloh sollallohu alayhi vasallam sharaflagan bu jasoratni keyinchalik Xolidni \"Allohning qilichlari orasidagi qilich\" deb atadi. Madinada Rasululloh sollallohu alayhi vasallam Zayd, Ja'far va Ibn Ravohalar uchun yig'lab yubordilar va hech bir payg'ambar kelmasidan oldin ularga shahid bo'lishlarini aytdilar.",
      "Bardoshli saboqlar: xavfdan oldin vorislarni nomlash - etakchilik uzluksizligi - armiyani tom ma'noda qutqardi; O'z hayotini saqlab qoladigan intizomli chekinish sharmandalik emas, balki donolikdir. Alloh yo'lida shahid bo'lish siyosiy mag'lubiyat emas, sharafdir va jang musulmonlarni Xolidning sovg'alari bilan tanishtirdi va tez orada butunlay iymon xizmatiga aylandi.",
    ],
    battleDetails: {
      location: "Mu'ta, Iordan daryosining sharqida",
      modernLocation: "Iordaniya, Karak yaqinida",
      hijriDate: "Jumada ul-ula 8 hijriy",
      muslimForces: "~3000",
      opposingForces:
        "Vizantiya va ittifoqdosh arab kuchlari (juda kattaroq; raqamlari manbalarda noaniq)",
      muslimCommander: "Zayd ibn Horisa, keyin Ja’far, keyin Ibn Ravoha, keyin Xolid ibn al-Volid.",
      outcome:
        "Musulmonlarning tartib bilan chekinishi; og'ir shahidlik lekin armiya saqlanib qoldi",
      keyEvents: [
        "Rasululloh sollallohu alayhi vasallam jo'nab ketishdan oldin o'rinbosarlari bo'yicha uchta qo'mondonni nomladilar.",
        "Uchalasi ham bashorat qilinganidek, Mu'taga navbatma-navbat yiqildi.",
        "Xolid ibn Valid qo‘mondonlikni o‘z qo‘liga oldi va qo‘shinni xavfsiz joyga olib chiqdi.",
        "Payg‘ambarimiz sollallohu alayhi vasallam Madinada yig‘lab, shahidlar haqida xabar kelguncha e’lon qildilar.",
      ],
      leadershipLesson:
        "Xavf kelishidan oldin vorislarni nomlang - aniq etakchilik uzluksizligi hayotni saqlab qoladi.",
      spiritualLesson:
        "Alloh yo'lida shahidlik sharafdir. armiyani qutqaradigan dono chekinish mag'lubiyat emas.",
    },
    appLinks: [{}],
  },
  {
    title: "Makkani fath qilish",
    summary: "Ramazon 8 hijriy - umumiy amnistiya ostida Makkaning deyarli qonsiz ochilishi.",
    body: [
      "Mazmun va sabab: Hudaybiya sulhi Qurayshning ittifoqchilari Banu Bakr musulmonlarning ittifoqchilari bo'lmish Banu Xuzoa qabilasiga hujum qilib, hatto muqaddas hududda ham ba'zilarini o'ldirib, Quraysh yashirincha qurol-yarog' bilan ta'minlaguncha davom etdi. Bu sulhni buzdi. Qurayshning uni tuzatishga urinishi muvaffaqiyatsizlikka uchragach, Makkaga yo'l ochilib qoldi.",
      "Nima bo'ldi: Rasululloh sollallohu alayhi vasallam 10 000 ga yaqin sahobalari bilan shu qadar tez va yashirin harakat qildilarki, Qurayshning qarshilik ko'rsatishga vaqti yo'q edi. Qadimgi Quraysh qo‘mondoni Abu Sufyon kirib kelish arafasida chiqib Islomni qabul qildi. Armiya Makkaga bir necha tomondan deyarli jangsiz kirdi - faqat bitta kolonna qisqa qurolli qarshilikka duch keldi; Rasululloh sollallohu alayhi vasallam o'z qo'mondonlariga faqat o'zlari bilan urushganlarga qarshi urushmaslikni buyurgan edilar.",
      "Amnistiya: Bu fathni belgilaydigan moment. Rasululloh sollallohu alayhi vasallam uni qiynoqqa solgan, boykot qilgan va quvib chiqargan shahar bilan Ka'ba oldida turib, Qurayshdan nima kutishlarini so'radilar, so'ngra Yusuf payg'ambarning unga zulm qilgan birodarlariga aytgan so'zlarini takrorlab: \"Bugun sizlarga ayb yo'q. Boringlar, chunki siz ozodsiz\", dedilar. Umumiy amnistiya aholini qamrab oldi; faqat bir hovuch muayyan jinoyatlar uchun istisno qilingan va hatto ularning ko'plari uning oldiga kelganlarida afv etilgan.",
      "Poklanish: Rasululloh sollallohu alayhi vasallam Ka’bani 360 ta butdan tozalab, “Haq keldi va botil yo‘qoldi” (Qur’on 17:81) deb tilovat qildilar. Bir paytlar o'sha shaharda qullik qiynoqlariga uchragan Bilol ibn Raboh Ka'ba tepasiga chiqib, Makka ustida azon aytdi. Nasr surasi - \"Allohning g'alabasi va fathi kelganda\" - bu ochilish va uning olomonining iymonga kirishiga ishoradir.",
      "Bardoshli saboqlar: bu hokimiyatda amalga oshirilgan bashoratli xarakterning eng katta namoyishlaridan biridir. G'alabadagi mardlik har qanday jazodan ko'ra ko'proq qalblarni zabt etdi; Maqsad qasos olish emas, balki yo'l-yo'riq edi va kuch o'z-o'zidan emas, balki xabarga xizmat qilish uchun yaratilgan. U Fath Makka deb nomlanadi - Ochilish - qop emas.",
    ],
    battleDetails: {
      location: "Makka",
      modernLocation: "Makka, Saudiya Arabistoni",
      hijriDate: "Ramazon 8 hijriy",
      muslimForces: "~10 000",
      opposingForces: "Quraysh (deyarli jangsiz taslim bo'ldi)",
      muslimCommander: "Payg'ambar Muhammad s.a.v",
      outcome: "Makka deyarli qonsiz ochildi; umumiy amnistiya e'lon qilindi",
      keyEvents: [
        "Quraysh musulmonlarning ittifoqchilari bo'lmish Xuzoga hujumni qo'llab-quvvatlaganida sulh buzildi.",
        "Abu Sufyon qo‘shin kirib kelishidan oldin Islomni qabul qildi; uning uyi xavfsiz joy deb e'lon qilindi.",
        "Rasululloh sollallohu alayhi vasallam umumiy amnistiya qildilar: Bugun sizga hech qanday ayb yo'q, boring, ozodsiz.",
        "Ka'ba o'z butlaridan poklandi; Bilol uning tepasidan azon aytdi.",
        "Sobiq dushmanlar ko'p bo'lib Islomni qabul qildilar.",
      ],
      leadershipLesson:
        "G'alabadagi mardlik qalblarni qo'rquv yoki qasosdan ko'ra uzoqroq zabt etadi.",
      spiritualLesson:
        "Maqsad qasos emas, yo'l-yo'riq edi - kuch o'z-o'ziga emas, xabarga xizmat qilish uchun yaratilgan.",
    },
    quran: [
      {
        excerpt:
          "Qachon Allohning g‘alabasi va g‘alabasi kelganda va odamlarning ko‘p bo‘lib Allohning diniga kirganlarini ko‘rsangiz, Robbingizga hamd aytib, tasbeh ayting va Undan mag‘firat so‘rang. Albatta, U tavbalarni qabul qilguvchidir.",
      },
      {
        excerpt:
          "U zot: «Bugun sizlarga ayb yo'q», dedilar. Alloh sizni mag'firat qilsin, U rahmlilarning eng mehribonidir. - Yusuf payg'ambarning so'zlari, Payg'ambarimiz sollallohu alayhi vasallam Qurayshni fath kunida takrorladilar.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Hunayn jangi",
    summary:
      "8 hijriy shavvol — Makkadan keyin pistirma; ishonch sinovdan o'tdi, keyin g'alaba berildi.",
    body: [
      "Mazmun va sabab: Makka ochilganidan deyarli ikki hafta o'tgach, Havazin va Saqifning kuchli qabilalari yangi hukmronlik o'rnatilmasdan oldin musulmonlarga zarba berish uchun to'planishdi. Rasululloh sollallohu alayhi vasallam ko'p sonli qo'shin - 12 000 ga yaqin, shu jumladan yaqinda Makkaga qaytganlar - hozirgacha to'plangan eng katta musulmon qo'shinlari bilan yo'lga chiqdilar. Uning o'lchamiga ko'ra, ba'zi erkaklar notanish ishonchni his qilishdi va xabarlarga ko'ra, kimdir ularni raqamlar etishmasligi uchun mag'lub bo'lolmasligini ta'kidlagan.",
      "Voqea sodir bo‘ldi: Dushman Hunaynning tor vodiysida pistirma qo‘ygan edi. Musulmonlar yarim shafaqda pastga tushar ekanlar, tepalikdan ularga o‘qlar bo‘roni tushib, avangard sinib ketdi. Vahima tarqaldi va katta armiyaning ko'p qismi o'girildi va qochib ketdi - ishonchni uyg'otgan raqamlar endi mag'lubiyatga uchradi.",
      "Burilish nuqtasi: Xaosda Rasululloh qochmadilar. U xachirini oldinga bosib, dushmanga qarab: “Men Payg‘ambarman, bu yolg‘on emas, men Abdulmuttalibning o‘g‘liman”, deb chaqirdi. Muhojir va ansorlarning bir qismi - Abbos sahobalarni ismlari bilan chaqirib, uning atrofida to'plandi. Musulmonlar qayta tuzdilar, pistirmachilarni yo'q qildilar va ularni tor-mor qildilar; asirlar va katta o‘ljalar olindi.",
      "Natija: Kampaniya Toifni qamal qilishgacha davom etdi, u birdaniga qulab tushmadi. Keyinchalik, Havazinlar o'z qavmlarini izlab kelganlarida, Payg'ambar alayhissalom asirlarni qaytarib berdilar - o'ljalarni saqlashdan ko'ra yarashuv va qalblarni yumshatishni afzal ko'rdilar va yangi Makkaga kirganlarni iymonga bog'lash uchun saxovatlilik qildilar.",
      "Qur'on bu kunga to'g'ridan-to'g'ri murojaat qilib, raqamlarga tayanish xavfini aytadi: \"Va Hunayn kunida sizlarning ko'pligingiz sizga yoqsa-da, hech qanday foyda bermaganda... Alloh taolo O'zining xotirjamligini nozil qildi\" (9:25-26). Doimiy saboq aniq - hech qachon raqamlarga, boylikka yoki yaqinda erishilgan muvaffaqiyatlarga tayanmang; g'alaba faqat Allohning sovg'asidir - va uning izdoshlari vahima tushganda mustahkam turish va ko'rinadigan etakchining egizak fazilati.",
    ],
    battleDetails: {
      location: "Hunayn vodiysi, Makka va Toif o'rtasidagi",
      modernLocation: "Toif yaqinida, Saudiya Arabistoni",
      hijriDate: "8 hijriy shavvol",
      muslimForces: "~12 000 (shu jumladan Makkalik yangi qabul qilinganlar)",
      opposingForces: "Havozin va Saqif",
      muslimCommander: "Payg'ambar Muhammad s.a.v",
      outcome: "Dastlabki mag'lubiyatdan keyin musulmon g'alabasi",
      keyEvents: [
        "Eng katta musulmon armiyasi jangdan oldin o'z soniga ishonch hosil qilgan.",
        "Vodiydagi tong pistirmasi avangardni tarqatib yubordi va keng vahima uyg'otdi.",
        "Rasululloh sollallohu alayhi vasallam sobit turdilar va mo'minlarni ortga chaqirdilar. uning atrofida bir yadro to'plandi.",
        "Musulmonlar yana tuzdilar va dushmanni tor-mor qildilar; ortidan Toif qamal qilindi.",
        "Keyinroq asirlar yarashuv ishorasi sifatida qaytarildi.",
      ],
      leadershipLesson:
        "Izdoshlar vahima tushganda lider ko'rinadigan va barqaror bo'lishi kerak - borligi saflarni oshiradi.",
      spiritualLesson:
        "Hech qachon raqamlarga yoki so'nggi muvaffaqiyatlarga tayanmang; g'alaba va osoyishtalik faqat Allohdandir.",
    },
    quran: [
      {
        excerpt:
          "Alloh sizlarni ko'p hududlarda g'alaba qildi va Hunayn kunida ko'pligingiz sizga yoqsa-da, hech qanday foyda bermaganda, yer kengligi bilan sizlarni o'rab oldi va siz orqaga qaytdingiz. So‘ngra Alloh taolo O‘z payg‘ambariga va mo‘minlarga sokinlikni nozil qildi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Al-Baro ibn Ozibdan Hunayn kuni qochdilarmi, deb so‘rashdi. Rasululloh sollallohu alayhi vasallam qochmadilar, dedilar. Odamlar orqaga qaytishdi, Rasululloh sollallohu alayhi vasallam oq xachirlariga minib: «Men Payg'ambarman, bu yolg'on emas. Men Abdulmuttalibning o‘g‘liman.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Tabuk ekspeditsiyasi",
    summary:
      "Rajab 9 hijriy - eng og'ir yurish, yoz jaziramasida, jangsiz imonni sinovdan o'tkazish.",
    body: [
      "Kontekst va sabab: Madinaga shimoliy chegarada katta Vizantiya safarbarligi haqida xabarlar yetib keldi. Rasululloh sollallohu alayhi vasallam Tabukga yurish qilishga chaqirdilar va g'ayrioddiy tarzda manzilni yashirish o'rniga ochiq nomladilar, chunki yurish shunchalik uzoq va mashaqqatli bo'lar ediki, hamma halol tayyorgarlik ko'rishi kerak edi. U yozning shiddatli jaziramasida, o'rim-yig'im davrida, sayohat va xarajatlar eng og'ir bo'lgan paytda tushdi - bu \"qiyinchilik ekspeditsiyasi\" sifatida mashhur bo'ldi.",
      "Fidoyilik imtihoni: da’vat jamoat qalbini ochdi. Usmon qo'shinning katta qismini o'z boyligidan jihozladi; Abu Bakr o'ziga tegishli hamma narsani berdi; Umar yarmini berdi. Ishtirok eta olmay yig'lagan bechora sahobalar yig'ladilar - Qur'onda ularning ko'z yoshlari yozilgan (9:92). Ularning qarshisida qolish uchun bahonalar o'ylab topgan va Tavba surasi uzoq vaqt fosh qiladigan munofiqlar turdilar.",
      "Nima bo'ldi: Rasululloh sollallohu alayhi vasallam boshchiligidagi eng katta qo'shin, ehtimol 30 000 kishilik qo'shin mashaqqatli yurishdan so'ng Tabukga yetib keldi. Hech qanday Vizantiya qo'shinlari jangga kirishmadi. Ekspeditsiya bo'sh natija emas, balki shimoldagi chegara qabilalari va hukmdorlari bilan shartnomalar tuzdi, jamoa xavfsizligini kengaytirdi va o'zi bosqinchilikni to'xtatishga tayyorligini ko'rsatdi.",
      "Ortda qolgan uchtasi: Qolganlar orasida uchta sodiq mo'min - Ka'b ibn Molik, Hilol ibn Umayya va Murora ibn Rabi' bor edi. Tavbalari qabul bo'lgunga qadar va Qur'on ularning mag'firatini e'lon qilgunicha, ellik kunga boykot qilindilar, yer «keng bo'lsa» ham ularning ustiga yopildi (9:118). Ularning sinov paytidagi halolligi siyratdagi eng ta'sirli epizodlardan biridir.",
      "Bardoshli saboqlar: jamiyatni himoya qilishga tayyor bo'lishning o'zi qilich tortilmagan taqdirda ham imon amalidir; darhol, ko'rinadigan mukofotsiz qurbonlik eng yuqori sinovlardan biridir; Rostgo'ylik - Ka'bning yolg'on bilan o'zini qutqarishdan bosh tortishi - Alloh uchun qulay bo'lgan yolg'ondan ko'ra sevimliroqdir. Tavba surasi butun ekspeditsiyani shu mavzular atrofida quradi.",
    ],
    battleDetails: {
      location: "Tabuk, Vizantiya chegarasi tomon yo'lda",
      modernLocation: "Tabuk, Saudiya Arabistoni",
      hijriDate: "Rajab 9 hijriy",
      muslimForces:
        "~30 000 (Rasululloh sollallohu alayhi vasallam boshchiligidagi eng katta qo'shin)",
      opposingForces: "Vizantiya qo'shinlari haqida xabar berildi, ammo jangga kelmadi",
      muslimCommander: "Payg'ambar Muhammad s.a.v",
      weather: "Yozning haddan tashqari issiqligi, o'rim-yig'im davrida",
      outcome:
        "Jang yo'q; shimoliy shartnomalar ta'minlandi; jamoa sinovdan o'tkazdi va elakdan o'tkazdi",
      keyEvents: [
        "Rasululloh sollallohu alayhi vasallam yurish mashaqqatli bo'lgani uchun uzoq manzilni ochiq aytdilar.",
        "Usmon, Abu Bakr, Umar va boshqalar saxiylik qildilar; eng kambag'al, beradigan hech narsasi yo'qligidan yig'ladi.",
        "Munofiqlar ortda qolish uchun uzr so'raydilar va Tavba surasida fosh qilindilar.",
        "Hech qanday dushman yo'q; shimoliy qabilalar va hukmdorlar bilan shartnomalar tuzildi.",
        "Uchta rostgo'y mo'minlar tavbalari qabul bo'lgunga qadar 50 kun davomida boykot qilindi (Qur'on 9:118).",
      ],
      leadershipLesson:
        "Qiyinchilik va uning narxi haqida halol bo'ling; oshkoralik ishonchni mustahkamlaydi va irodalilarni tayyorlaydi.",
      spiritualLesson:
        "Ko‘zga ko‘rinmas ajrsiz qurbonlik va sinovda rostgo‘ylik iymonning eng oliy sinovlaridandir.",
    },
    quran: [
      {
        excerpt:
          "Orqada qolganlar esa, Rasululloh sollallohu alayhi vasallamdan orqada qolishlaridan xursand bo‘lib, mollari va jonlari bilan Alloh yo‘lida jihod qilishni yoqtirmay, «Issiqda urushga chiqmanglar», dedilar. Ayting: «Agar ular tushunib yetsalar, jahannam olovi issiqroqdir.",
      },
      {
        excerpt:
          "Va Alloh taolodan o'zga panoh yo'qligiga amin bo'lgunicha, er yuzlari keng bo'lsa ham, ularning ustiga o'z jonlari ham qamalib qolib ketguncha, qolgan uch kishini mag'firat qildi. So'ngra tavba qilishlari uchun ularga rahmat qilib tavba qildi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ka'b ibn Molik uzrsiz Tabukdan qolib, yolg'on gapirmasligini aytdi. Rasululloh sollallohu alayhi vasallam mo'minlarga ellik kecha davomida u va uning ikki sahobasi bilan gaplashmaslikni buyurdilar, to ular uchun yer tor bo'ldi, keyin ularning mag'firatlari vahiy keldi va u zotning hayotining eng baxtli kunlaridan edi.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "G'azavot va Saraya",
    summary: "Katta kampaniyalar va kichik otryadlar o'rtasidagi farq.",
    body: [
      "G'azva - Rasululloh sollallohu alayhi vasallamning shaxsan ishtirok etgan g'azotidir - yigirma yetti ulamo, jumladan, Badr, Uhud, Xandaq, Hudaybiya, Xaybar, Makka, Hunayn va Tabuk fathlari.",
      "Sariyya (ko'plik saroy) - Rasululloh sollallohu alayhi vasallam qo'shilmagan holda nomli qo'mondon qo'mondonligi ostida yuborilgan otryad - bu kabi ellikka yaqin missiyalar razvedka qilish, bosqinlarga javob berish, kuzatib borish yoki qabilalarni Islomga taklif qilish uchun yozilgan.",
      "Ko'pchilik sarayalar umuman jang qilmadi - ular diplomatiya, patrul yoki kuch namoyishi edi, bu esa jangni keraksiz qildi. Boshqalar, xuddi Mu'taga yurish kabi, jiddiy janglar va og'ir yo'qotishlarni boshdan kechirdilar.",
      "Bu farqni tushunish, islomning ilk davridagi \"janglar\" sonini bo'rttirib yuborishdan saqlaydi. Taxminan o'n yil davomida haqiqiy janglar kam edi; Aksariyat yurishlar profilaktika, diplomatik yoki qonsiz bo'lib, manbalar butun bashorat davrini o'z davri uchun hayotni yo'qotishning ajoyib darajada engil deb hisoblaydi.",
    ],
    actions: [
      "Qaysi voqealar janglar, qaysilari qamal va qaysilari jangsiz yurishlar bo'lganini ko'rish uchun vaqt jadvalini ko'rib chiqing.",
      "Kategoriyalarni aniq saqlash uchun g'azva va sariyya uchun lug'at yozuvlarini o'qing.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Rasululloh sollallohu alayhi vasallamdan keyingi janglar",
    summary:
      "To'g'ri yo'l-yo'riqli xalifalar davridagi asosiy harakatlar payg'ambarlik davridan farq qiladi.",
    body: [
      "Rasululloh sollallohu alayhi vasallam 11-hijriy (milodiy 632) yilda vafot etganlaridan soʻng, Ridda (murtadlik) urushlari, Sosoniy Fors va Vizantiya Suriyasigacha kengayish va oxir-oqibat ichki fitna orqali jamoaga xalifalar Abu Bakr, Umar, Usmon va Ali (Alloh ulardan rozi boʻlsin) boshchilik qildilar.",
      "Bu voqealar islom tarixiga tegishli, lekin ular Payg'ambarning o'z harakatlari kabi sunnat emas. Ularni tarix asboblari bilan va musulmon ulamolarining o'zlari ularning tafsilotlari, motivlari va saboqlari haqida bahslashayotganini anglagan holda o'rganish kerak.",
      "Al-Qadisiyya jangi (taxminan 636 yil): Sa'd ibn Abi Vaqqos musulmon qo'shinlarini Iroqdagi sosoniylar qo'shiniga qarshi boshqargan - bu Forsni ochgan burilish nuqtasi.",
      "Yarmuk jangi (milodiy 636): qo'mondonlar, shu jumladan Xolid ibn al-Valid Suriyadagi Vizantiya bilan Levantdagi yirik dala hokimiyatini tugatgan hal qiluvchi yurishda uchrashdilar - bashoratli sunnat sifatida emas, balki harbiy tarix sifatida o'rganildi.",
      "Nahovand jangi (taxminan milodiy 642 yil): arab manbalarida “G‘alabalar g‘alabasi” nomi bilan eslab o‘tilgan sosoniylarning qolgan qarshiligini sindirdi. Sanalar va qo'shin raqamlari tarixchilar orasida farq qiladi.",
    ],
    actions: [
      "Avval bashoratli janglarni o'rganing - ular asosiy axloqiy va huquqiy ma'lumotnomadir.",
      "Keyingi fathlarga nuance bilan yondashing; urushni madh etmang va murakkab tarixni shiorlarga aylantirmang.",
    ],
    disclaimer:
      "Payg'ambarlikdan keyingi fathlarning raqamlari, motivlari va axloqiy baholari tarixchilar o'rtasida bahs-munozaralarga sabab bo'ladi. Ushbu sharh polemik emas, balki orientatsiya uchun.",
  },
  {
    title: "Etakchilik darslari",
    summary: "Sabr, sho'ro, rahm-shafqat va Allohga tavakkal - shunchaki taktika emas.",
    body: [
      "Qarama-qarshilikdagi etakchilikning bashoratli modeli xarakterni zukkolikdan ustun qo'yadi. Muhim qarorlar maslahat (shuro) yo'li bilan qabul qilindi - Badrdagi quduqlar, Konfederatsiya qamalidagi xandaklar, Hudaybiyadagi shartlar - hattoki vahiy keyinchalik natijani tasdiqlaydigan joylarda ham. Rahbariyat harakat qilishdan oldin tingladi.",
      "Sabr har bir g'alabaning yoyini shakllantirgan. Hudaybiyaning og'ir tinchligi ikki yil ichida Makkaning ochilishiga olib keldi. Makkadagi rahm-shafqat - \"Boring, siz ozodsiz\" - jamoatni quvg'in qilgan odamlar ustidan g'alaba qozondi. Uhudda o'rganilgan achchiq intizom bu falokatning takrorlanishining oldini oldi.",
      "Jasorat qilichda bo'lgani kabi ko'rsatildi: qo'shin Hunaynda qochib ketganida mustahkam turib, ko'rinib turardi; qazuvchilar bilan birga xandaqda tuproqni tashish; va eng qiyini - bir paytlar sizni uyingizdan haydab yuborganlarni to'liq quvvat soatida kechirish.",
      "Allohga tavakkal qilish (tavakkul qilish) hech qachon vositalardan voz kechishni anglatmaydi. Skautlar yuborildi, yer tanlandi, zirhlar kiyildi, xandaklar qazildi, vorislar nomlandi va shartnomalar hurmat qilindi. Mo'minlar qo'llaridan kelgan hamma narsani qildilar va natijani Allohga topshirdilar - bu to'liq harakat va to'liq tayanch birligi namunaning qalbidir.",
    ],
    actions: [
      "Og'ir qaror qabul qilishdan oldin so'rang: men haqiqatan ham bilimdonlar bilan maslahatlashdimmi?",
      "Muvaffaqiyatga erishganingizdan so'ng, so'rang: men rahm-shafqat qilyapmanmi yoki bu mag'rurlikga aylandimi?",
      "Muvaffaqiyatsizlikda so'rang: to'g'rilash uchun itoatsizlik bormi yoki Alloh menga o'rganishim kerak bo'lgan saboqmi?",
    ],
    appLinks: [{}],
  },
  {
    title: "Janglar haqida sahih hadislar",
    summary:
      "Baho bilan tanlangan rivoyatlar - xatti-harakatlar, sabr-toqat va asosiy voqealar haqida.",
    body: [
      "G'azot haqidagi hadislarga tayanishdan oldin ularning ishonchliligi tekshirilishi kerak. Quyidagi rivoyatlar “Sahih” to‘plamlaridan olingan bo‘lib, bu kampaniyalarning o‘tkazilishi va ruhiga taalluqlidir; har biri o'z darajasini oladi.",
      "Muayyan mashg'ulot bilan bog'liq rivoyatlar uchun ushbu jangning o'z mavzusiga qarang. Toʻliq zanjirlarni oʻqish va kontekst boʻyicha baholash uchun Munibning hadis brauzeridan foydalaning.",
    ],
    hadith: [
      {
        excerpt:
          "Dushman bilan uchrashishni hohlamang va Allohdan omonlik so'rang. Ularga duch kelganingizda sabr qiling va bilingki, jannat qilichlar soyasi ostidadir.",
      },
      {
        excerpt:
          "Rasululloh sollallohu alayhi vasallam aytdilar: Urush makkorlikdir. — Olimlar buni jangda taktik strategiyaga ruxsat (fiintlar, kutilmagan hodisalar, notoʻgʻri yoʻnalish), hech qachon shartnomani buzish yoki himoyalangan tomonga xiyonat qilish uchun ruxsatnoma sifatida tushuntiradilar.",
      },
      {
        excerpt:
          "Rasululloh sollallohu alayhi vasallam unga qo'mondon tayinlaganlarida Allohdan qo'rqishni, jang qilishdan oldin dushmanni Islomga da'vat qilishni, bay'atni buzmaslikni, o'ldirmaslikni va bolani o'ldirmaslikni buyurdilar.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Adabiyotlar va manbalar",
    summary: "Klassik seerah ishlari va ularni qanday qilib tanqidiy o'qish kerak.",
    body: [
      "Ibn Ishoqning “Sira” (Ibn Hishom orqali saqlanib qolgan), Voqidiyning “Kitob al-Mag‘oziy”, Ibn Sa’dning “Tabaqat”i, Ibn Kasirning “Al-Bidoya van-Nihoya” asari asosiy sira manbalariga kiradi. Har birining kuchli tomonlari va ilmiy ogohlantirishlari bor.",
      "Ibn Ishoq (Ibn Hishom orqali) asosli rivoyat; al-Voqidiy jang haqida juda ko'p ma'lumot beradi, lekin uning ba'zi xabarlari hadis tanqidchilari tomonidan bahsli; Ibn Kasir tarixni hadis tanqidi bilan sintez qiladi va baho berishda ehtiyotkor bo‘ladi.",
      "Bu voqealar haqidagi Qur'on oyatlari eng nufuzli matndir. Xulq-atvor, huquq va axloq masalalarida al-Buxoriy va Muslimning sahih hadislari tasdiqlanmagan sira xabarlaridan ustun turadi.",
      "Tarixchilar bir-biridan farq qiladigan joyda - aniq qo'shinlar soni, ba'zi sanalar va bashoratdan keyingi ba'zi kampaniyalarni axloqiy baholash - bu modul aniqlikni o'ylab topishdan ko'ra noaniqlikni ta'kidlaydi. Bu yerda keltirilgan har bir hadis to'plamlar soni va darajasi bo'yicha tekshirildi.",
    ],
    actions: [
      "Avval Qur'onga qarshi kurashning har qanday tafsilotini, keyin sahih hadisni, keyin esa sirani o'zaro tekshiring.",
      "Fatvo yoki zamonaviy qo'llash bo'yicha har qanday savol uchun malakali olimlar bilan maslahatlashing - bu modul hukm emas, balki tarbiyaviydir.",
    ],
    appLinks: [{}, {}],
  },
];

export const BATTLES_VERSES_UZ: DeepPartial<BattlesVerse>[] = [
  {
    excerpt:
      "Jang qilganlarga zulmga uchragani uchun izn berildi... Agar Alloh bir guruh qavmni boshqasi bilan tekshirmaganida edi, monastirlar, cherkovlar, sinagogalar va masjidlar vayron bo'lar edi.",
    context:
      "Jang qilish uchun birinchi umumiy ruxsat - Makkada yillar davomida qurolsiz ta'qiblardan keyin.",
  },
  {
    excerpt:
      "Sizlar bilan urushayotganlar bilan Alloh yo'lida jang qilinglar, lekin haddan oshib ketmanglar. Albatta, Alloh zolimlarni sevmas.",
    context: "Asosiy chegara: faqat mudofaa, chegaradan oshib ketishni qat'iy taqiqlash.",
  },
  {
    excerpt:
      "Robbingdan madad so‘raganingda, U: «Men seni darajama-bosqich mingta farishta bilan quvvatlayman», dedi.",
    context: "Badr haqida nozil bo'lgan - ko'p mo'minlarga ilohiy yordam.",
  },
  {
    excerpt:
      "Sizlar uchun to'qnash kelgan ikki lashkarda oyat-mo''jiza bor edi: biri Alloh yo'lida urushayotgan, ikkinchisi kofirlar bo'lib, ularni ko'zlari bilan ikki baravar ko'rar ekan.",
    context:
      "Alloh taolo musulmonlarni Badrda dushmanga kattaroq qilib, qalblarni mustahkam qildi.",
  },
  {
    excerpt:
      "Albatta, siz ularni O'zining izni bilan o'ldirayotganingizda, Alloh sizga bergan va'dasini vafo qilgan edi, toki sizlar yaxshi ko'rgan narsalaringizni ko'rsatganidan keyin jasoratingiz qolmadi va buyruq haqida tortishuvga tushdingiz.",
    context: "Kamonchilarning itoatsizligi va Uhuddagi burilish nuqtasiga murojaat qiladi.",
  },
  {
    excerpt:
      "Ey iymon keltirganlar, Allohning sizga bergan ne'matini eslang, o'shanda sizlarga qo'shinlar kelganda, Biz ularga shamol va siz ko'rmagan qo'shinlarni yubordik.",
    context: "Konfederativ qamal va ilohiy yordam haqida Ahzob surasi.",
  },
  {
    excerpt:
      "Va u kitob ahlidan o'zlariga yordam bergan va qalblariga qo'rquv solgan kimsalarni, o'zingiz o'ldirgan toifani va sizlar asir olgan toifani tushirdi. Va sizlarga ularning yerlarini va uylarini voris qildi.",
    context:
      "Qamal paytida ahdni buzgan Banu Qurayza haqida Ahzob surasi - urush davridagi xiyonatning chegaralangan epizodi, dinga qarshi hukm emas.",
  },
  {
    excerpt:
      "Darhaqiqat, Alloh sizning oldingi va keyingi gunohlaringizni mag'firat qilishi, sizga bo'lgan ne'matini to'ldirishi va sizni to'g'ri yo'lga hidoyat qilishi uchun sizga ochiq-oydin g'alabani berdik.",
    context:
      "Hudaybiyyadan qaytishda nozil bo'ldi - sahobalar birinchi bo'lib achchiq murosa sifatida his qilgan narsani ochiq g'alaba deb nomlash.",
  },
  {
    excerpt:
      "Albatta, Alloh mo'minlar daraxt tagida senga bay'at qilganlarida ulardan rozi bo'ldi va ularning qalblaridagi narsani bildi, bas, ularga xotirjamlik tushirdi va ularni yaqinlashib kelayotgan g'alaba bilan mukofotladi.",
    context:
      "Ridvon bay’ati — 1400 ga yaqin sahobalar akas daraxti ostida qochmaslikka ahd qildilar va Alloh taolo ulardan roziligini bildirdi.",
  },
  {
    excerpt:
      "Qachon Allohning g‘alabasi va g‘alabasi kelganda va odamlarning ko‘p bo‘lib Allohning diniga kirganlarini ko‘rsangiz, Robbingizga hamd aytib, tasbeh ayting va Undan mag‘firat so‘rang. Albatta, U tavbalarni qabul qilguvchidir.",
    context:
      "Makka ochilishida Nasr surasi - zafar bilan emas, balki maqtov toji kiygan, mag'firat so'rab, ko'pchilikning iymonga kirishi.",
  },
  {
    excerpt:
      "Alloh sizga ko'p hududlarda g'alaba berdi... So'ngra Alloh O'z payg'ambariga va mo'minlarga osoyishtaligini nozil qildi.",
    context:
      "Alloh taolo mo‘minlarga g‘alaba Uning ne’mati ekanini eslatadi, son bilan maqtanishning natijasi emas.",
  },
  {
    excerpt:
      "Orqada qolganlar esa, Rasululloh sollallohu alayhi vasallamdan orqada qolishlaridan xursand bo'lib, Alloh yo'lida mollari va jonlari bilan jihod qilishni yoqtirmasdilar.",
    context: "Tavba surasi og'ir Tabuk yurishidan uzr so'raganlarga murojaat qiladi.",
  },
];

export const BATTLES_TIMELINE_UZ: DeepPartial<BattlesTimelineEvent>[] = [
  {
    title: "Birinchi vahiy",
    body: "Payg‘ambarimiz sollallohu alayhi vasallam Hiro g‘orida “Alaq” surasining birinchi oyatlarini oladilar. Yillar davomida qo'ng'iroq tinch - jang qilish uchun ruxsat yo'q.",
    location: "Makka",
  },
  {
    title: "Ommaviy chaqiriq va ta'qib",
    body: "Ochiq va'z qiynoq, boykot va shahidlik keltiradi. Musulmonlar qurolli qasossiz sabr qiladilar - sabr-toqat va migratsiya o'rgatilgan javoblardir.",
    location: "Makka",
  },
  {
    title: "Madinaga hijrat",
    body: "Musulmonlar jamoasi Yasribda (Madina) hokimiyat o‘rnatadi. Yahudiy qabilalari bilan tuzilgan shartnomalar va Madina konstitutsiyasi birgalikda yashash qoidalarini belgilab berdi.",
    location: "Madina",
  },
  {
    title: "Badr jangi",
    body: "17 Ramazonda taxminan 313 musulmon Quraysh armiyasini mag'lub etdi - birinchi yirik jang va hal qiluvchi ma'naviy g'alaba.",
    location: "Badr",
  },
  {
    title: "Uhud jangi",
    body: "Musulmonlar dastlab ustunlikka erishadilar, ammo kamonchilar o'z postlarini tark etishlari og'riqli muvaffaqiyatsizlikka olib keladi. Qur'on o'sha kunning saboqlariga murojaat qiladi.",
    location: "Uhud tog'i",
  },
  {
    title: "Xandaq jangi",
    body: "Konfederatsiya qoʻshini Madinani qamal qiladi. Xandaq qazish - Salmonning taklifi - qamalni jangsiz buzadi.",
    location: "Madina",
  },
  {
    title: "Banu Qurayza",
    body: "Qamal paytida Madina ahdini buzgan Banu Qurayza taslim bo'lib, o'zlari tanlagan hakam Sa'd ibn Muoz tomonidan hukm qilinishini so'rashadi.",
    location: "Madina",
  },
  {
    title: "Hudaybiya shartnomasi",
    body: "O'n yillik murosasiz bo'lib ko'ringan sulh Qur'on ta'biri bilan aytganda, ochiq-oydin g'alabaga aylandi - daraxt ostida Ridvon bay'ati berildi, dinni qabul qilish tarqaldi va Makkaga yo'l ochildi.",
    location: "Hudaybiya",
  },
  {
    title: "Mu'ta jangi",
    body: "Rim chegarasiga ekspeditsiya; Xolid ibn al-Volid qo'shinni eson-omon olib chiqib ketgunga qadar, tayinlangan uchta qo'mondon ketma-ket shahid bo'ladi.",
    location: "Mu'ta",
  },
  {
    title: "Xaybar ekspeditsiyasi",
    body: "Madinadan shimolda dushmanlik ko'targan yahudiy qal'alari bo'ysundirildi. Abu Bakr va Umar sudlangandan keyin bayroq Ali ibn Abu Tolibga beriladi.",
    location: "Xaybar",
  },
  {
    title: "Makkani fath qilish",
    body: "Quraysh ahdni buzdi; Rasululloh sollallohu alayhi vasallam o'n ming sahobalari bilan yurib, Makkaga deyarli qon to'kilmay kirdilar - umumiy amnistiya e'lon qilindi.",
    location: "Makka",
  },
  {
    title: "Hunayn jangi",
    body: "Havozin va Saqif Makkadan keyin musulmonlarni pistirma qilishdi. Payg'ambar sollallohu alayhi vasallam mo'minlarni o'z atrofida birlashishga chaqirganda, dastlabki vahima g'alabaga o'tadi.",
    location: "Hunayn",
  },
  {
    title: "Tabuk ekspeditsiyasi",
    body: "Rim chegarasi tomon og'ir yoz yurishi. Hech qanday jang bo'lmaydi, lekin riyokorlik fosh qilinadi va Tavba surasi orqada qolganlarga xitob qilinadi.",
    location: "Tabuk",
  },
  {
    title: "Xayr ziyorati",
    body: "Rasululloh sollallohu alayhi vasallam haj qiladilar va vidolashuv xutbasini aytadilar. Ko'p o'tmay u Madinada vafot etadi - bashoratli janglar davri yopiladi.",
    location: "Makka",
  },
];

export const BATTLES_FIGURES_UZ: DeepPartial<BattlesFigure>[] = [
  {
    name: "Abu Bakr Siddiq",
    epithet: "Alloh u kishidan rozi bo'lsin",
    summary:
      "Payg'ambar alayhissalomning eng yaqin sahobasi, birinchi balog'atga etgan mo'min erkak va hijratdagi hamrohi.",
    role: "Dastlabki kampaniyalarda maslahatchi, jangchi va bayroqdor.",
    lesson:
      "Bosim ostida sodiqlik va rostgo'ylik - u har qanday g'alabadan oldin quvg'in qilingan musulmonlarni ozod qilish uchun o'z boyligini sarfladi.",
  },
  {
    name: "Umar ibn al-Xattob",
    epithet: "Alloh u kishidan rozi bo'lsin",
    summary: "Quvg‘in yillarida Islomga kirib, iymonning kuchli himoyachilaridan biriga aylandi.",
    role: "Jangchi va keyinchalik ikkinchi xalifa sifatida adolat me'mori.",
    lesson:
      "Jasorat va mas'uliyat bilan bog'liq - u Hudaybiyada Payg'ambarning fikridan farq qilganda, u nasihatni omma oldida qabul qildi.",
  },
  {
    name: "Ali ibn Abu Tolib",
    epithet: "Alloh u kishidan rozi bo'lsin",
    summary:
      "Rasululloh sollallohu alayhi vasallamning amakivachchalari va kuyovlari; islomni qabul qilgan birinchi bolalardan.",
    role: "Yakkakurash bo'yicha chempion va Xaybarda bayroq ko'taruvchisi.",
    lesson:
      "Kamtarlik bilan jasorat - u hijrat kechasi Payg'ambar to'shaklarida uxlab, missiyani davom ettirish uchun hayotini xavf ostiga qo'ydi.",
  },
  {
    name: "Hamza ibn Abdulmuttalib",
    epithet: "Alloh u kishidan rozi bo'lsin",
    summary:
      "Payg'ambar alayhissalomning amakilari Islomni qabul qilganlaridan keyin Asadulla (Allohning arsloni) nomi bilan tanilgan.",
    role: "Badr va Uhuddagi elita jangchi va ruhiy yetakchi.",
    lesson:
      "Shahidlik mag'lubiyat emas - uning Uhuddagi o'limi Payg'ambarni chuqur qayg'uga soldi, ammo missiyani yakunlash qarorini mustahkamladi.",
  },
  {
    name: "Xolid ibn al-Valid",
    epithet: "Alloh u kishidan rozi bo'lsin",
    summary:
      "Hudaybiyyadan keyin Islomni qabul qilib, Sayfullaga (Allohning qilichi) aylangan yorqin Quraysh sarkardasi.",
    role: "Islomdan oldin Uhudda musulmonlarga qarshi qanot otliq qo'shinlarini boshqargan; keyinchalik Mu'ta qo'mondonligini o'z qo'liga oldi va xalifalik yurishlarida hal qiluvchi rol o'ynadi.",
    lesson:
      "O'tmishdagi qarshiliklar chin dildan tavba qilish uchun hech qanday to'siq bo'la olmaydi - Uhudda musulmonlarni hayratga solgan mahorat uning qalbiga iymon kirib kelganida, butunlay Alloh yo'liga yo'naltirilgan edi.",
  },
  {
    name: "Sa'd ibn Abu Vaqqos",
    epithet: "Alloh u kishidan rozi bo'lsin",
    summary: "Va'da qilingan o'nta jannatdan biri; jamiyatning mashhur kamonchisi.",
    role: "Uhuddagi kamonchi; keyinchalik xalifa Umar boshchiligidagi Qodisiyyadagi musulmon qoʻshinlariga boshchilik qildi.",
    lesson:
      "O'z rolida intizom - kamondan otish uning xizmatini belgilab berdi; u keyinchalik bu aniqlikni xalqning etakchiligiga olib keldi.",
  },
  {
    name: "Salmon al-Forisi",
    epithet: "Alloh u kishidan rozi bo'lsin",
    summary:
      "Uzoq ma'naviy sayohatdan so'ng Madinadagi musulmonlar safiga qo'shilgan Forsdan izlovchi.",
    role: "Xandaq qazish taklif qilingan - bu arablarga noma'lum bo'lgan fors taktikasi.",
    lesson:
      "Hikmat har qanday kelib chiqishi mumkin - sho'ro, Alloh taolo qaerda bo'lmasin, tajribani eshitish demakdir.",
  },
  {
    name: "Zayd ibn Horisa",
    epithet: "Alloh u kishidan rozi bo'lsin",
    summary:
      "Rasululloh sollallohu alayhi vasallamning ozod qilingan odami va sevikli sahobasi va musulmonlar qo'shiniga tayinlangan birinchi qo'mondon.",
    role: "Mu'ta safariga boshchilik qildi; nomlari ko'rsatilgan uchta qo'mondonning birinchisi sifatida u erda shahid bo'ldi.",
    lesson:
      "Nasabdan ustunlik - u yuqori qabila darajasidagi odamlar ishtirok etganda rahbarlik qilish uchun tanlangan.",
  },
  {
    name: "Sa'd ibn Muoz",
    epithet: "Alloh u kishidan rozi bo'lsin",
    summary:
      "Madinai Avs qabilasining boshlig‘i, ansorlarning eng qadimgi va eng hurmatlilaridan biri.",
    role: "Xandaqda yaralangan; Banu Qurayza o‘z taqdiriga hakam etib sayladi.",
    lesson:
      "Kelishilgan sudya orqali adolat - hatto mag'lub bo'lgan dushmanga ham nazoratsiz qasos olishdan ko'ra xolis hakamlik qilishga ruxsat berildi; ko'p o'tmay olgan jarohatidan vafot etdi.",
  },
];

export const BATTLES_LESSON_CARDS_UZ: DeepPartial<BattlesLessonCard>[] = [
  {
    battleTitle: "Badr jangi",
    lesson: "To'liq tayyorlanayotganda Allohga tavakkal qiling.",
    detail:
      "Rasululloh sollallohu alayhi vasallamning soni uchdan birga ko'p bo'lsa-da, haligacha quduqlar yonida joy tanlab, saflarini tartibga solib duo qildilar. Sa'y-harakat va tayanch birga, g'alaba esa Allohga nasib etdi.",
  },
  {
    battleTitle: "Uhud jangi",
    lesson: "Amrga itoat qilish jamiyatni himoya qiladi.",
    detail:
      "O'lja olish uchun o'z postini tashlab ketgan kamonchilar qanot ochishdi va bu armiyani deyarli yo'q qilishdi. Qur'oni karimda buni har bir avlod uchun tarbiya haqida saboq sifatida qayd etgan.",
  },
  {
    battleTitle: "Xandaq jangi",
    lesson: "Rejalashtirish va maslahat kuchni oshiradi.",
    detail:
      "Salmonning xandaq g‘oyasi, payg‘ambarning sho‘rosi va mo‘minlarning mehnati bilan qo‘shilib, himoyachilardan ancha katta koalitsiyani zararsizlantirdi.",
  },
  {
    battleTitle: "Hudaybiya shartnomasi",
    lesson: "Sabr eng haqiqiy g'alaba bo'lishi mumkin.",
    detail:
      "Sahobalar sulhni xorlik deb bilishdi va Umar buni ochiqdan-ochiq so'radi; Fath surasi buni ochiq g'alaba deb atadi. O'n yillik tinchlik yo'llarni ochdi, Islom har qachongidan ham tezroq tarqaldi va ikki yil ichida Makkaga yo'l ochildi.",
  },
  {
    battleTitle: "Banu Qurayza",
    lesson: "Himoya ahdini buzish eng og'ir xiyonatlardan biridir.",
    detail:
      "Banu Qurayza Madina ahdini ittifoqchilar shaharni qamal qilgan paytda buzdi. Shunday bo'lsa ham, Payg'ambarimiz sollallohu alayhi vasallam ularni o'zlari tanlagan hakam tomonidan hukm qilishlariga ruxsat berdilar - o'zaro intiqom emas, balki kelishilgan qozi orqali adolat.",
  },
  {
    battleTitle: "Makkani fath qilish",
    lesson: "G'alabadan keyin rahm-shafqat g'olibni yuksaltiradi.",
    detail:
      "Rasululloh sollallohu alayhi vasallam Yusuf payg'ambarning: «Bugun senga ayb yo'q, bor, ozodsan», degan so'zlarini qiynoqqa solib, haydab yuborgan shaharga ham o'z rahmatiga oldilar. Umumiy amnistiya qasos o'rnini egalladi va hech qanday jazo yutib bo'lmaydigan yuraklar zabt etildi.",
  },
  {
    battleTitle: "Hunayn jangi",
    lesson: "Raqamlar va so'nggi muvaffaqiyatlar g'alabani kafolatlamaydi.",
    detail:
      "Makkadan keyin qo'shinning kattaligidan g'ururlanish dastlabki vahima qo'zg'atdi. Mo'minlar Payg'ambar sollallohu alayhi vasallamga va Allohga qaytganlaridagina to'planishdi.",
  },
  {
    battleTitle: "Tabuk ekspeditsiyasi",
    lesson: "Qiyinchilikda qurbonlik haqiqiy iymonni ochib beradi.",
    detail:
      "Marsh kuchli dushmanga qarshi jazirama issiqda sodir bo'ldi. Molini berganlar ham, kambag‘allikka qaramay yurish qilganlar ham maqtovga sazovor bo‘ldilar.",
  },
  {
    battleTitle: "Mu'ta jangi",
    lesson: "Rahbarlik vorisligi rejalashtirilgan bo'lishi kerak.",
    detail:
      "Rasululloh sollallohu alayhi vasallam uchta qo'mondonni navbatma-navbat bilan nomladilar. Uchalasi ham yiqilganida, Xolid chekinishni qayta tashkil qildi - armiyani qutqarishning o'zi g'alaba edi.",
  },
];

export const BATTLES_GLOSSARY_UZ: DeepPartial<BattlesGlossaryTerm>[] = [
  {
    term: "G'azva",
    definition:
      "Rasululloh sollallohu alayhi vasallamning o'zlari qatnashgan harbiy yurish. Masalan, Badr, Uhud va Tabuk.",
  },
  {
    term: "Sariyya",
    definition:
      "Rasululloh sollallohu alayhi vasallam yurishga qo'shilmagan holda qo'mondon qo'l ostida yuborilgan otryad. O'nlab razvedka, diplomatiya yoki reydlarga javob berish uchun sodir bo'ldi.",
  },
  {
    term: "Muhojirun",
    definition:
      "Alloh uchun Makkadan Madinaga chiqqan muhojirlar. Ular ansorlar bilan birga ilk musulmonlar jamoasining o‘zagini tashkil qilganlar.",
  },
  {
    term: "Ansor",
    definition:
      "Yordamchilar - muhojirlarni qabul qilgan, boyliklarini baham ko'rgan va shaharni birinchi yillarida himoya qilgan Madina musulmonlari.",
  },
  {
    term: "Shura",
    definition:
      "Muhim qarorlar qabul qilishdan oldin o'zaro maslahatlashish. Xandaq strategiyasi va Uhudga tayyorgarlik payg'ambarlik namunasidagi maslahatlashuvni tasvirlaydi.",
  },
  {
    term: "Bay'at",
    definition:
      "Sadoqat garovi - rahbarga siyosiy va ma'naviy itoatkorlik. Aqaba bay’ati hijratdan oldin bo‘lgan.",
  },
  {
    term: "Hijrat",
    definition:
      "Alloh uchun hijrat - Makkadan Madinaga payg'ambarlik mazmunida. Hijriy 1-yil ana shu hijrat bilan boshlanadi.",
  },
  {
    term: "Amir",
    definition:
      "Armiya yoki ekspeditsiya uchun tayinlangan qo'mondon yoki rahbar. Rasululloh sollallohu alayhi vasallam saroyga raislar tayinladilar va agar ular yiqilsa, ularga o'rinbosarlarni tayinladilar.",
  },
  {
    term: "Rayah",
    definition:
      "Armiya boshida ko'tariladigan standart yoki bayroq. Payg‘ambarimiz bayrog‘ini ko‘tarib yurish sharaf va mas’uliyat belgisi edi.",
  },
  {
    term: "Liva",
    definition:
      "Kattaroq armiya standarti, ba'zan shaxsiy rayahdan farq qiladi. Liva rahbariyati katta kuchga qo'mondonlikni ko'rsatdi.",
  },
  {
    term: "Jihod",
    definition:
      "Alloh yo'lida jihod qilish - bu, birinchi navbatda, ruhning kurashi va uning tartibga solinadigan harbiy shaklida, himoya qilish va tayinlanganda tajovuzni bartaraf etish.",
  },
  {
    term: "Fi sabilillah",
    definition:
      "Alloh yo'lida - qonuniy kurashni qabilaviy qasos yoki dunyoviy fathdan ajratib turadigan niyat.",
  },
  {
    term: "Omon",
    definition:
      "Elchilar, savdogarlar yoki jangovar ishtirokchilarga beriladigan xavfsizlik yoki xavfsiz xatti-harakatlar. Omonni buzish islom urush qonunida man etilgan.",
  },
  {
    term: "Sulh",
    definition:
      "Sulh yoki tinchlik kelishuvi. Hudaybiya shartnomasi tinchlikni tanlashning eng yaxshi namunasi bo'lib, u katta manfaatlarga xizmat qiladi.",
  },
  {
    term: "Fath",
    definition:
      "Ochilish yoki fath - ko'pincha zo'ravonlik bilan qamal qilishdan ko'ra Makkani (Fath Makka) tinch yo'l bilan ochish uchun ishlatiladi.",
  },
];
