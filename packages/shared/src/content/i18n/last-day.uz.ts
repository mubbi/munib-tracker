// Uzbek translation overlay for the Learn "The Last Day" content. Mirrors the order of
// its English source in ../last-day*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  LastDayHadithEntry,
  LastDayQuizQuestion,
  LastDayReferenceEntry,
  LastDayTimelineEvent,
  LastDayTopic,
  LastDayVerseEntry,
} from "../../types/last-day";
import type { DeepPartial } from "./localize";

export const LAST_DAY_TOPICS_UZ: DeepPartial<LastDayTopic>[] = [
  {
    title: "Kirish",
    summary: "Oxirat kuni nima va nega u bugungi hayotimizni o'zgartiradi?",
    body: [
      "Yavm al-qiyoma — Qiyomat, Qiyomat va Qiyomat kuni — har bir jon o'z amallari ko'rsatilib, so'nggi qarorgohi uchun Alloh huzuriga qaytadigan kundir. Bu uzoqdagi afsona yoki poetik obraz emas. Qur'on deyarli har bir sahifada bu haqda eslatib o'tilgan va Makkaning eng qadimgi suralarida aynan u hukmronlik qilgan, chunki unga ishonish insonning butun hayotini tartibga soladi. Haqiqatan ham Allohning huzurida turishni orzu qilganingizda, halollik, ibodat, mehribonlik va vazminlik ixtiyoriy bezak bo'lishni to'xtatadi va kimligingizning mazmuniga aylanadi.",
      "Ushbu modul sayohat bosqichini bosqichma-bosqich bosib o'tadi: o'lim va ruhning ketishi, qabrdagi barzax oralig'i, qiyomatdan oldingi kichik va katta alomatlar, sur chalinishi, jasadlarning tirilishi, bir keng tekislikka to'planishi, daftarlarning tarqatilishi, tarozi, payg'ambarning shafoati, shafoat va shafoat. Ko'prik va nihoyat ikkita abadiy uy - jannat va do'zax. Har bir bosqich Qur'on va sahih hadislardan olingan.",
      "Bu erda hamma narsani ikkita tamoyil boshqaradi. Birinchidan, bu voqealarning haqiqati aniq va aqida masalasidir; tirilish yoki hisob berishni inkor etish dinning o'zini inkor qilishdir. Ikkinchidan, qiyomatning aniq vaqti yolg'iz Allohga ma'lum - hech bir olim, taqvim yoki hisob uni bashorat qila olmaydi va sana haqidagi har bir da'vo yolg'ondir. Rasululloh sollallohu alayhi vasallam sahobalariga hech qachon ortga sanab o'tirmasdilar. ularga yashash uchun yo'l berdi. Demak, oxirat kunini o'rganishdan maqsad bashorat qilish emas, balki tayyorgarlikdir: belgilangan vaqt kelguncha yurakni yumshatish, ustuvorliklarni to'g'rilash va yaxshilik sari yugurish.",
      "Manbalar haqida eslatma: mashhur \"oxirzamon alomatlari\" suhbatlari zaif va hatto uydirma rivoyatlarga to'la. Ushbu modul faqat haqiqiy bo'lgan narsalarni o'z ichiga oladi va agar samimiy sunniy olimlar chinakamiga farq qilsalar - masalan, ba'zi asosiy belgilar tartibida - bu farq farq sifatida taqdim etiladi, silliqlashtirilmaydi yoki bo'rttirilmaydi.",
    ],
    quran: [
      {
        excerpt:
          "Qachonki, er oxirgi zilzila bilan silkinib, o'z yuklarini tashlab yuborsa va inson: \"Unda nima bor?\" O'sha kunda u o'z xabarini aytadi, chunki Robbing unga vahiy qilgan. O'sha kunda odamlar o'z amallari ko'rsatilmoq uchun guruhlarga bo'linib ketadilar. Kim zarrachalik yaxshilik qilsa, uni ko'radi, kim zarrachalik yomonlik qilsa, uni ko'radi.",
      },
      {
        excerpt:
          "U O'z bandalaridan kimni xohlasa, ular paydo bo'ladigan kunidan ogohlantirish uchun O'z amrining ilhomini vahiy qiladi. Bu kunda hukmronlik kimga tegishli? Yagona va g'olib Allohga.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nima uchun oxirat kuniga ishonish kerak?",
    summary: "Imonning oltita moddasidan biri - motivatsiya, umid va yakuniy adolat.",
    body: [
      "Qiyomat kuniga iymon keltirish iymonning olti moddasidan biri bo‘lib, Payg‘ambar alayhissalom farishta Jabroil alayhissalom dinni o‘rgatish uchun kelganlarida shunday nom berganlar: Allohga, Uning farishtalariga, kitoblariga, payg‘ambarlariga, oxirat kuniga va ilohiy hukmga, uning foydasi va zarariga iymon keltirish (Sahih Musulmon 8). Bu e'tiqodsiz hisob-kitobning butun tuzilishi buziladi, chunki agar Allohga qaytish bo'lmasa, zolim va avliyoning oxiri bir xil bo'ladi va har bir ibodat hech qanday yakuniy ma'nosiz odatga aylanadi.",
      "Qur'on oxirat kuni haqida ham axloqiy, ham aqliy jihatdan bahs yuritadi. Axloqiy jihatdan: bu adolatsizlikka javobdir, chunki zolimlar yotoqlarida bemalol o‘ladigan, mazlumlar esa qasossiz o‘ladigan dunyo, agar Alloh haqiqatdan ham adolatli bo‘lsa, bu voqeaning oxiri bo‘la olmaydi. Oqilona: Sizni birinchi marta yo'qdan yaratgan Zot sizni ikkinchi marta tiklashga qodir emas (Qur'on 36:78-79). Tirilish asl yaratilishdan qiyinroq emas, osonroqdir.",
      "Bu e'tiqod, shuningdek, yurakning ikki dvigatelini - qo'rquv va umidni tartibga soladi va ularni muvozanatda saqlaydi. Ogohlantirishlar haqiqiydir, shuning uchun mo'min kibr va g'aflatda qolmaydi; Allohning rahmati keng va tavba eshigi o'limgacha ochiq, shuning uchun mo'min hech qachon noumid bo'lmaydi. Qo'rquv va umid o'rtasida yashaydigan yurak - bu sinmasdan intilishda davom etadigan yurak.",
      "Darhaqiqat, oxirat kuni kuchsizlarga hurmat, kuchlilarga esa vazminlik beradi. Bu zulmga uchraganlarga Alloh taolo tomonidan hech qanday ozor unutmasligi, kuchlilarga esa hisob-kitob vaqtida hech qanday boylik, mavqe va ta’sir ularni himoya qilmasligini aytadi. Shuning uchun unga ishonish shaxsiy tasalli emas, balki bu dunyoda adolat, sabr va halollik manbaidir.",
    ],
    quran: [
      {
        excerpt:
          "Solihlik yuzlaringizni sharqqa yoki g‘arbga burishingiz emas, balki Allohga, oxirat kuniga, farishtalarga, kitobga va payg‘ambarlarga iymon keltirgan va mol-mulkni yaxshi ko‘rsa-da, qarindosh-urug‘larga, yetimlarga, miskinlarga, musofirlarga va so‘raganlarga bergan zot solihdir.",
      },
      {
        excerpt:
          "Allohni zolimlar qilayotgan amallardan g'ofil deb o'ylamang. U ularni faqat ko'zlar dahshatdan tikilgan kunga kechiktiradi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Iymon - Allohga, Uning farishtalariga, kitoblariga, payg'ambarlariga, oxirat kuniga ishonishingiz, ilohiy hukmga, uning foydasi va zarariga ishonishingizdir. — Jabroil alayhissalomning dinni o‘rgatgani kelganida hadisdan.",
      },
    ],
    actions: [
      "Har kuni niyatingni yangila: Mening amallarim Alloh uchun va men Unga ro'baro' bo'ladigan kun uchundir.",
      "Sizni adolatsizlik qiynasa va hech bir er yuzidagi sud javob bermasa, uni oxirat sudiga topshiring.",
      "Qo'rquv va umidni birga saqlang - na qo'rquv sizni tushkunlikka solmasin, na umid sizni e'tiborsizlikka solmasin.",
    ],
    appLinks: [{}],
  },
  {
    title: "O'lim",
    summary: "Har bir jon o'limni tatib ko'radi - husn al-hatima va marhumga nima foyda.",
    body: [
      "O'lim - bu hech kim o'tkazib yubormaydigan uchrashuv. Bu haqda Qur'onda ochiq-oydin bayon etilgan: Har bir jon o'limni tatib ko'r va to'liq mukofot faqat qiyomat kunida beriladi (Olima surasi, 185-oyat). O'lim yo'q qilish emas, balki o'tishdir - ruh tanani tark etadi va sayohatining keyingi bosqichiga o'tadi. Alloh tomonidan topshirilgan o'lim farishtasi jonni oladi, so'ngra Robbingizga qaytarilursiz (Qur'on 32:11).",
      "Chunki o'limning qiyofasi muhim bo'lgani uchun mo'min Alloh rozi bo'lgan holatda o'lishni umid qilib, sidqidildan tavba qilish, sobit ibodat va go'zal xulq bilan yaxshi oqibat - husn al-hatima yo'lida harakat qiladi. Gunohda davom etib, tavba qilmasdan yuz o'girgan kishi uchun yomon oqibat - su' al-hatima - qo'rqadi. Ammo buning rahmati juda katta: tavba eshigi o'lim shovqini bo'g'ziga yetguncha ochiq qoladi, shuning uchun hech kim nafas qolsa, juda kech, degan xulosaga kelmasin.",
      "Payg'ambarimiz sollallohu alayhi vasallam o'limni tez-tez zikr qilishni, ya'ni o'limni ma'nosida \"zavqlarni buzuvchini ko'p eslang\" (Jomi' at-Termiziy 2307, hasan) - bizni kasal qilish uchun emas, balki hushyor turishimiz uchun o'rgatgan. O'limni eslash bu dunyoning tutqichini qisqartiradi, g'azablarni yo'qotadi va aslida nima muhimligini qayta tartibga soladi. Faqat zaif hisobotlarda ko'rinadigan ruhning ketishi haqidagi tafsilotlarni chetga surib qo'yish yaxshiroqdir; haqiqiy material qo'rquv va tayyorlikni uyg'otish uchun etarli.",
      "O'lim ham amallar kitobini yopadi - uchta istisnodan tashqari. Rasululloh sollallohu alayhi vasallam aytdilarki, bir kishi vafot etganda, uchtasidan boshqa amali uziladi: doimiy sadaqa (sadaqa jariya), foydasi bor ilm va u uchun duo qiluvchi solih farzand (Sahih Musulmon 1631). Bu juda amaliy: tirikligida siz qurgan, o'rgatgan va ko'targan narsangiz siz ketganingizdan keyin ham uzoq vaqt davomida daromad keltirishi mumkinligini anglatadi.",
    ],
    quran: [
      {
        excerpt:
          "Har bir jon o'limni tatib ko'r va sizga qiyomat kuni to'liq to'lovlar beriladi. Bas, kim do'zaxdan uzoqlashtirilsa va jannatga kiritilsa, najot topdi. Bu dunyo hayoti esa faqat yolg'on zavqidir.",
      },
      {
        excerpt:
          "Ayting: «Sizga ishonib topshirilgan o'lim farishtasi sizni oladi. Keyin Robbingizga qaytarilursiz.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Biror kishi vafot etsa, uning amallari tugaydi, faqat uchtasi: doimiy sadaqa, foyda keltiradigan ilm yoki unga duo qiluvchi solih farzand.",
      },
      {
        excerpt: "Ko'pincha zavqlarni buzuvchi - o'limni eslang.",
      },
    ],
    actions: [
      "Istig'forni oshiring va namozni o'z vaqtida o'qing - ayniqsa sog'lom va band bo'lganingizda, nafaqat kasal bo'lganingizda.",
      "Kechiktirayotgan har bir narsa uchun bugun tavba qiling; ertaga qimor o'ynamang.",
      "Uchta doimiy amalga sarmoya kiriting: doimiy sadaqani barpo eting, foydali ilm tarqating va farzandlarni tavhid va go'zal xulq asosida tarbiyalang.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Barzax (qabrdagi hayot)",
    summary: "O'limdan keyin tirilishgacha bo'lgan vaqt oralig'i - so'roq va uning oqibatlari.",
    body: [
      "Barzax toʻsiq maʼnosida boʻlib, u kishining oʻlimidan qiyomatgacha boʻlgan butun oraliqning nomidir. Qur'onda o'lgan zolimning qaytarib yuborilishini so'raganida quyidagi so'z qo'llaniladi: \"Ularning orqalarida qayta tiriladigan kungacha to'siq (barzax) bordir\" (Qur'on 23:100) - bu hayotga qaytib bo'lmaydigan mustahkam devor. Tana ko'milsa ham, yondirilsa ham, cho'kib ketganmi yoki yo'qolganmi, ruh barzaxga kiradi; qabr shunchaki uning eng keng tarqalgan shakli va har bir inson uchun oxiratning birinchi bosqichidir.",
      "Haqiqiy xabarlar dafn etilgandan keyin so'roq qilishni tasvirlaydi. Ikkita farishta kelib, marhumga uchta savol beradi: Robbing kim? Sizning diningiz nima? Sizga yuborilgan bu odam kim? Alloh qat'iy qo'ygan mo'min: «Robbim Alloh, dinim Islom va bu Muhammad sollallohu alayhi vasallam», deb javob beradi. keyin qabr kengaytirilib, uning uchun yoritiladi. G'ofil bo'lgan kishi: «Ah, bilmayman», deydi va siqilishga duch keladi (Jomi' at-Termiziy 1071, hasan, bu erda ikki farishta Munkar va Nakir ismlaridir). Shuning uchun ham Qur'onda mo'minlarni «dunyoda ham, oxiratda ham sobit so'z bilan» mustahkam tutgani uchun Allohga hamd aytiladi (Qur'on 14:27).",
      "So‘ngra qabrda saodat yoki jazo keladi va sahih matnlarda tasdiqlanadi: “Qabr yo jannat bog‘laridan bir bog‘ yoki do‘zax chuqurlaridan bir chuqurdir” (Jomi’ at-Termiziy 2460, hasan sahih). Qur'onda Fir'avn qavmining qiyomat qolishidan oldin \"ertalab va kechqurun\" do'zaxga qo'yiladigan jazosi haqida ishora qilingan (Qur'on 40:46). Ahli sunnat qabr ajri va jazosining haqiqatini tasdiqlab, uning aniq mohiyatini Allohga qoldirgan, chunki u gʻaybga tegishli boʻlib, tiriklar uni idrok eta olmaydi.",
      "Qabr so'rashi va qabr saodati yoki azobi haqiqiy ekanligiga ijmo bor. olimlar, masalan, tanaga, ruhga yoki ikkalasiga tegadimi, va oddiy qabri bo'lmaganlarga qanday etib borishi kabi nozik jihatlarni muhokama qiladilar, bu savollarni nuqtadan chalg'itishga yo'l qo'ymaydi. Barzax buyuk turtkidir: qabrni yerdagi tuynukdan o‘z qilmishining ko‘zgusiga aylantiradi va oldinga yuborgan narsangiz sizni u yerda kutib olishini aniq ko‘rsatadi.",
    ],
    quran: [
      {
        excerpt:
          "Toki ulardan biriga o'lim kelganida: «Ey Robbim, meni qaytarib yuborgin, toki qoldirgan narsamda yaxshilik qilsam», deydi. Yo'q! U faqat bir so'z aytmoqda; Ularning orqalarida qayta tiriladigan kungacha to'siq bor.",
      },
      {
        excerpt:
          "Do'zax - ular ertalab va kechqurun unga duchor bo'lurlar. Qiyomat qoim bo'lgan kunda: «Fir'avn qavmini eng qattiq azobga kiritinglar», deyilur.",
      },
    ],
    hadith: [
      {
        excerpt: "Qabr yo jannat bog'laridan bir bog' yoki do'zax chuqurlaridan bir chuqurdir.",
      },
      {
        excerpt:
          "Marhum dafn etilganida ikki farishta kelib, undan so'raydi: Robbing kim? Sizning diningiz nima? Payg'ambaringiz kim? Mo'min aniq javob beradi va uning qabri kengayib, yoritiladi.",
      },
    ],
    misconceptions: [
      "Noto'g'ri tushuncha: Og'ir jazo hech qanday asosga ega bo'lmagan xalq e'tiqodidir. Tuzatish: Savol-javob, qabr saodati yoki azobining haqiqati sahih hadislarda sobit bo'lib, Qur'onda zikr qilingan; Bu sunniylik aqidasining qarorgohi.",
      "Noto'g'ri tushuncha: Biz farishtalarning aniq ko'rinishi va ismlari haqida bahslashishimiz kerak. Tuzatish: Munkar va Nakirning ismlari hasan hadisda keladi; asosiy e'tiqod so'roqning o'zi. Haqiqiy javob berishga tayyorgarlik uning tafsilotlarini muhokama qilishdan ko'ra muhimroqdir.",
    ],
    actions: [
      "Endi tavhid va sunnatni mahkam ushlang - qabrning javoblari u yerda yodlanmaydi, balki shu yerda yashang.",
      "Rasululloh sollallohu alayhi vasallam himoya va sabr-bardosh sifatida o'rgatgan ertalab va kechqurun zikrlarini saqlanglar.",
    ],
    appLinks: [{}],
  },
  {
    title: "Qiyomat Alomatlari",
    summary: "Kichik va katta alomatlar - soatning aniqligi, noma'lum vaqt.",
    body: [
      "Qiyomatning kelishi aniq, lekin uning vaqti Alloh taoloning o'ziga sir tutgan siridir. Hatto Payg'ambarimiz sollallohu alayhi vasallamdan qachon keladi, deb so'ralganda, so'ragan kishi so'ragandan boshqa narsani bilmaydi, uning ilmi yolg'iz Allohning huzuridadir (Qur'on 7:187). Shunday qilib, har qanday \"belgi\" ni o'rganishdan oldin hal qilish kerak bo'lgan birinchi narsa bu: belgilar bizni tayyorlash uchun berilgan, hech qachon sanani hisoblashimizga imkon bermaydi. Kim bir yilni qiyomat uchun nomlasa, Qur'onga ziddir.",
      "Ulamolar alomatlarni ikki turga birlashtiradilar. Kichik belgilar (al-'alamat as-sug'ro) oxirzamondan oldin uzoq asrlar davomida shakllanadigan asta-sekin ijtimoiy, axloqiy va dunyoviy o'zgarishlardir. Asosiy belgilar (al-'alamat al-kubro) eng oxirigacha bir-biriga yaqinlashadigan favqulodda, shubhasiz hodisalar to'plamidir. Qur'onda \"uning ba'zi alomatlari allaqachon kelgan\" (Qur'on 47:18) qayd etilgan - bu ishora Payg'ambar sollallohu alayhi vasallamning kelishi va oyning bo'linishini o'z ichiga oladi.",
      "Asosiy alomatlar uchun langar matn Huzayfa ibn Usaydning hadisi boʻlib, unda Paygʻambarimiz sollallohu alayhi vasallam oʻntasini sanab oʻtganlar: tutun (Duxon), Dajjol, yerning hayvoni (Dabbatul-Ard), quyoshning botgan joyidan chiqishi (gʻarbdan), Maryam va Yajugʻunning tushishi. Ma'juj) va uchta katta ko'chki - biri sharqda, biri g'arbda va biri Arabiston yarim orolida - odamlarni yig'iladigan joyga olib boradigan olov bilan muhrlangan (Sahih Musulmon 2901). Al-Mahdiy va Dajjol boshqa sahih rivoyatlarda kelgan va Iso alayhissalom tushishidan oldin keltirilgan.",
      "Halol olimlarning pozitsiyasi shundaki, har bir belgi tasdiqlangan bo'lsa-da, ularning aniq tartibi matnlar bilan to'liq o'rnatilmagan va nufuzli sunniy olimlar aniq ketma-ketlikda farq qiladilar. Bu farq an'ananing odatiy qismi bo'lib, tortishuvlarga sabab bo'lmaydi. Bularning barchasiga payg'ambarlik javobi qo'rquv yoki hozirgi voqealar haqida cheksiz taxminlar emas, balki iymonni oshirish, tavba qilish va foydali amallardir.",
    ],
    quran: [
      {
        excerpt:
          "Ular sendan qiyomat soati haqida so'raydilar: qachon keladi? Ayting: «Uning ilmi faqat Robbim huzuridadir. Uning vaqtini Undan boshqa hech kim oshkor qilmas. U osmonlaru erda og'ir yotadi. U sizga faqat kutilmaganda keladi.",
      },
      {
        excerpt:
          "Ular faqat qiyomatning to'satdan kelishini kutmoqdalarmi? Uning ba'zi belgilari allaqachon kelgan. Bas, ularga azob kelganda, ular qanday eslatma oladilar?",
      },
    ],
    hadith: [
      {
        excerpt:
          "O'zidan oldin o'nta alomatni ko'rmaguningizcha, qiyomat qolmaydi: tutun, Dajjol, hayvon, quyoshning g'arbdan chiqishi, Maryam o'g'li Isoning tushishi, Ya'juj va Ma'juj, uchta ko'chki - biri sharqda, biri g'arbda va biri Arabiston yarim orolida - va oxirgisi odamlarni o'zlariga o't qo'yishga undaydi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kichik belgilar",
    summary:
      "Rasululloh sollallohu alayhi vasallam ta'riflagan bosqichma-bosqich o'zgarishlar - vahima ustidagi tayyorgarlik.",
    body: [
      "Kichkina alomatlar jamiyatdagi sekin, jami o'zgarishlar, axloq va ilm holatidir, Payg'ambarimiz sollallohu alayhi vasallam qiyomat yaqinlashgan sari ortib boradi deb ta'riflaganlar. Ular juda ko'p va tabiatan ular bir dramatik lahzada emas, balki uzoq vaqt davomida ochiladi. Haqiqatan ham, eng katta kichik alomat allaqachon sodir bo'lgan: Payg'ambarimiz Muhammad sollallohu alayhi vasallamning ikki barmog'ini birlashtirib: «Men va qiyomat mana shu ikkisi kabi yuborilganmiz», dedilar, ya'ni oxirgi elchi va oxir zamon boshlandi.",
      "Sahih hadislarda qayd etilgan alomatlardan: omonatning yo'qolishi, ishlarning noloyiqlarga topshirilishi — «Agar omonat yo'qolsa, qiyomatni kuting» va «hokimiyat noloyiqlarga berilganida» (Sahih al-Buxoriy 6496). Jabroil alayhissalomning mashhur hadislarida Payg‘ambarimiz sollallohu alayhi vasallam ikkita yorqin alomatni aytib o‘tganlar: “Cori ayol o‘z xo‘jayini tug‘ishi va baland binolar qurishda yalangoyoq, yalang‘och, bechora cho‘ponlarni ko‘rasiz” (Sahih Musulmon 8).",
      "Boshqalar vaqtni his qilishning umumiy tezlashishi, zilzilalar va o'limlarning ko'payishi va bilimning yo'qolishini o'z ichiga oladi. Payg‘ambarimiz sollallohu alayhi vasallam ilmning mexanizmi haqida: “Ilm olib ketilmaguncha, zilzilalar ko‘paymaguncha, vaqt tez o‘tmaguncha, fitnalar paydo bo‘lmaguncha va o‘limlar ko‘paymaguncha qiyomat qolmaydi” (Sahih al-Buxoriy 1036) deganlar. Va u ilmning qanday ketishini tushuntirib berdi: «Alloh taolo ilmni odamlardan tortib olish bilan emas, balki olimlarni tortib olish bilan olib tashlaydi, toki hech kim qolmagunicha, odamlar johillarni so‘raladigan rahbar qilib olib, ilmsiz hukm chiqaradilar, shuning uchun ular adashib, boshqalarni ham yo‘ldan ozdiradilar» (Sahih al-Buxoriy 100). Shunday qilib, \"bilimni yo'qotish\" - bu ma'lumotlarning etishmasligi emas - yosh ma'lumotlarga botib ketishi mumkin - balki sog'lom olimlar va hayot tajribasini yo'qotishdir.",
      "Bu yerda hal qiluvchi intizom: ma'lum bir zamonaviy hodisani \"muayyan hadis\" deb e'lon qilish aniq emas, tafsirdir. Osmono'par binolar musobaqalari yoki jinoyatchilikning kuchayishi Payg'ambar so'zlariga mos kelishi mumkin, ammo sarlavhalarga ishonch bilan vahiy berish ehtiyotkor olimlarning yo'li emas. Har bir kichik belgiga to'g'ri javob botiniydir: uni Allohga qaytishga, dinni o'rganishga va unga amal qilishga, ishonchlilik va rostlikni mahkam ushlashga da'vat sifatida o'qing - tashvish yoki tomosha uchun material sifatida emas.",
    ],
    hadith: [
      {
        excerpt:
          "Ishonch yo'qolsa, qiyomatni kuting. Unga: “Qanday yo‘qoladi, yo Rasululloh?” deb so‘raldi. U zot: “Qachonki, hokimiyat unga loyiq bo‘lmaganlarga berilsa, qiyomatni kuting.",
      },
      {
        excerpt:
          "Qiyomat belgilaridan: cho'ri o'z xo'jayini tug'ishi va baland imoratlar qurishda yalangoyoq, yalang'och, bechora cho'ponlarni ko'rasiz. — Jabroil alayhissalom hadislaridan.",
      },
      {
        excerpt:
          "Alloh ilmni tortib olish bilan olib tashlamaydi, balki olimlarni olish bilan olib tashlaydi, toki hech kim qolmagunicha va odamlar ilmsiz hukm chiqaradigan johillarni rahbar qilib oladilar, shuning uchun ular adashadilar va boshqalarni yo'ldan ozdiradilar.",
      },
    ],
    disclaimer:
      "Muayyan hozirgi voqealarga aniq kichik belgilarni qo'llash talqin qilishdir, aniq emas. Ushbu modul sahih hadislarni taqdim etadi va qaysi zamonaviy hodisalar ularni to'liq bajarishini tasdiqlamaydi.",
    actions: [
      "Malakali o'qituvchilardan foydali bilimlarni izlang, unga amal qiling va uni o'tkazing - bu to'g'ridan-to'g'ri bilimning yo'qolishi belgisiga qarshi turadi.",
      "Nutqingizda, ishingizda va muomalangizda ishonchlilik va haqiqatni saqlang.",
      "Har bir belgini vahima yoki onlayn spekulyatsiya uchun yoqilg'i sifatida emas, balki tavba qilishga chaqiriq sifatida o'qing.",
    ],
  },
  {
    title: "Asosiy belgilar",
    summary: "Sahihi Muslimdagi o'nta asosiy alomat - Mahdiy, Dajjol, Iso va boshqalar.",
    body: [
      "Asosiy belgilar - bu oxir-oqibatda to'plangan buyuk, shubhasiz voqealar. Ularning nizomi Huzayfa ibn Usaydning hadisi: “Rasululloh sollallohu alayhi vasallam qiyomat haqida bahslashayotgan sahobalariga nazar tashlab, ular oʻnta alomatni koʻrmagunlaricha, soat kelmasligini aytdilar: tutun (Duxon), Dajjol, yerning hayvoni (Dabbatul-Ard), Yashabning gʻarbidan quyosh chiqishi va Marjusni Maryam. Ma'juj, uchta ko'chki (sharqda, g'arbda va Arabistonda) va nihoyat odamlarni yig'iladigan joyga olib boradigan olov (Sahih Musulmon 2901). Kichik belgilardan farqli o'laroq, ular boshlanganidan keyin ular bir-birini yaqindan kuzatib boradi.",
      "Al-Mahdiy Payg'ambar sollallohu alayhi vasallamning xonadonlaridan bo'lgan adolatli rahbar sifatida er yuzini zulm bilan to'ldirilganidek adolat bilan to'ldiradigan sahih xabarlarda keladi (Sunan Abi Dovud 4282, hasan). U qonun chiqaruvchi yoki yangi payg'ambar emas - u tiriltiradi, o'ylab topmaydi - va unga ishonishni Ahli sunnat tasdiqlaydi, zaif rivoyatlardagi ortiqcha tafsilotlar esa chetga suriladi.",
      "Dajjol (soxta masih) dunyodagi eng katta sinovdir. Rasululloh sollallohu alayhi vasallam an-Navvos ibn Sam'onning (Sahih Musulmon 2937) uzun hadislarida uni uzoq ta'riflaganlar: ko'zlari orasiga \"kofir\" yozuvi yozilgan bir ko'zli yolg'onchi, har bir payg'ambar o'z qavmini ogohlantirgan iymonni sinash uchun kuch ato etgan. Uning fitnasi bahs bilan emas, balki qat'iy e'tiqod bilan mag'lub bo'ladi va Payg'ambarimiz (s.a.v.) himoya sifatida Kahf surasining bosh oyatlarini yod olishni o'rgatganlar.",
      "Iso ibn Maryam (alayhissalom) sunniylik aqidasining mustahkam nuqtasi bo'lgan nozil bo'ladi. Rasululloh sollallohu alayhi vasallam: «Jonim qo'lida bo'lgan Zotga qasamki, yaqinda Maryam o'g'li sizlarning orangizda adolatli hukmdor bo'lib tushadi. xochni sindiradi, cho‘chqani o‘ldiradi, jizyani bekor qiladi, to uni hech kim qabul qilmagunicha mol-dunyo toshib ketadi» (Sahih al-Buxoriy 3448). U Muhammad sollallohu alayhi vasallamga ergashadi, ummat imomi ortida namoz o‘qiydi (Sahih al-Buxoriy 3439), Dajjolni o‘ldiradi va Muhammad sollallohu alayhi vasallamning shariatlari bilan hukmronlik qiladi. So'ngra Ya'juj va Ma'juj qo'yib yuboriladi, qolgan alomatlar esa insoniyatni to'playdigan olovgacha ochiladi.",
      "Halollikning ikki nuqtasi. Birinchidan, ulamolar o‘n belgili hadisdagi har bir alomatning haqiqati to‘g‘risida ixtilof qiladilar, lekin ularning aniq tartibida ixtilof qiladilar va bu farq qonuniy va eskidir. Ikkinchidan, “Duxon va hayvon” ushbu sahih hadisning bir qismidir; Ularni batafsil tavsiflovchi ba'zi boshqa rivoyatlar kuch jihatidan farq qiladi, shuning uchun bu modul zaifroq qo'shimchalarga emas, balki kuchli o'n belgili hisobotga asoslanadi.",
    ],
    hadith: [
      {
        excerpt:
          "O'nta alomatni ko'rmaguningizcha qiyomat qolmaydi: tutun, Dajjol, hayvon, quyoshning g'arbdan chiqishi, Maryam o'g'li Isoning tushishi, Ya'juj va Ma'juj va uchta ko'chki - biri sharqda, biri g'arbda va biri Arabiston yarim orolida - oxirgisi odamlarni o'zlariga olov olib boradigan olov.",
      },
      {
        excerpt:
          "Jonim qo'lida bo'lgan Zotga qasamki, yaqinda Maryam o'g'li sizlarning orangizda adolatli hukmdor bo'lib tushadi. U xochni sindiradi, cho‘chqani o‘ldiradi, jizyani bekor qiladi va boylik shunchalik ko‘payadiki, uni hech kim qabul qilmaydi.",
      },
      {
        excerpt:
          "Agar bu dunyodan bir kun qolsa, Alloh o'sha kunni uzaytirar edi, toki u mening oilamdan (Mahdiy) er yuzini zulm va zulmga to'lgandek adolatga to'ldiradigan bir kishini tiriltirdi.",
      },
    ],
    disclaimer:
      "Asosiy belgilarning haqiqati tasdiqlangan, ammo ularning aniq ketma-ketligi va vaqti olimlar tomonidan to'liq kelishilmagan. Sana belgilashdan saqlaning va hozirgi zamon shaxsini Mahdiy, Dajjol yoki Iso alayhissalom deb da'vo qilishdan saqlaning.",
    appLinks: [{}],
  },
  {
    title: "Surnay",
    summary: "Isrofil — birinchi portlash, ikkinchi portlash va tirilish.",
    body: [
      "Qachonki, Alloh oxiratni belgilaganida, surga ishonib topshirilgan farishta uni puflaydi. Unga Isrofil ism qo'yish ilmiy an'ana orqali keladi; Qur'on qat'iy belgilagan narsa bu voqeaning o'zi va uning dahshatidir. Rasululloh sollallohu alayhi vasallam: «Sur ko'taruvchi uni og'ziga qo'yib, peshonasini egib, chalinish amrini kutayotgan bo'lsa, men qanday xotirjam bo'laman?» — dedilar. — Bu sahobalarni xafa qilganda, ularga: «Bizga Allohning o'zi kifoya, U eng yaxshi vakildir», deyishni o'rgatdi (Jomi' at-Termiziy 2431, hasan).",
      "Ikki portlash bor, Qur'on ularni ajratib turadi. Birinchisi: «Sur chalinib, osmonlar va erdagi kimsalar o'lik bo'lurlar, magar Alloh xohlasalar», (Qur'on 39:68) — yaratilgan tartibni tugatuvchi vahima va o'lim portlashi. Keyin ikkinchisi keladi: “Keyin yana puflanadi va shu zahoti ular tik turib qarab turishadi” (xuddi shu oyat davom etadi) — tirilish portlashi, bunda butun mavjudot oʻlimdan tiriladi.",
      "Ko'pgina ulamolar xuddi shu oyat va qo'llab-quvvatlovchi rivoyatlardan mustasno, ya'ni \"Alloh hohlagan kishilar\" urilmaydiganlar - va ikki portlash orasidagi vaqt haqida gapiradilar, garchi uning uzunligi va tafsilotlari har xil kuchdagi xabarlarga asoslanadi va Allohga qoldiriladi. Ishonch - bu juft portlash: tugatish, keyin ko'tarilish. Bu \"Ogohlantirish kuni\" (Qur'on 50:20) deb nomlanadi, chunki bu oxirgi chaqiruv bo'lib, tayyorgarlik ko'rishga vaqt qolmaganida yangraydi - aynan shuning uchun chaqiruvga hozir javob berish kerak.",
    ],
    quran: [
      {
        excerpt:
          "Va sur chalinib, osmonlaru yerdagi kimsalar o'lik bo'lurlar, magar Alloh xohlasalar. Shunda u yana puflanadi va shu zahoti turib qarab turadilar.",
      },
      {
        excerpt: "Va sur chalinur. Bu ogohlantirish kunidir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Karnay ko‘taruvchisi uni og‘ziga qo‘yib, peshonasini egib, chalish amrini kutib turganda, men qanday xotirjam bo‘laman? Sahobalar g'amgin bo'lib: «Bizga Allohning o'zi kifoya, U eng yaxshi vakildir», deyishlarini buyurdi.",
      },
    ],
  },
  {
    title: "Tirilish",
    summary: "Qayta tiklangan tanalar - Alloh oldida turishning universalligi.",
    body: [
      "Ikkinchi portlashda o'liklar tiriladi, tana va jon, va tirilish nafaqat ruhiy, balki haqiqiy va jismoniydir. Qur'on shubhachining istehzosiga to'g'ri keladi: bir kishi parchalanib ketgan suyakni ko'tarib, unga kim hayot berishi mumkinligini so'raydi; Javob: “Ayting: “Uni birinchi marta yaratgan zot tiriltirur va U barcha maxluqotni biluvchi zotdir” (Qur’on 36:78–79). Agar sizni yo'qdan bor qilish Allohning qo'lida bo'lsa, sizni qayta tiklash qiyinroq emas.",
      "Tirilish umumbashariydir - birinchidan to oxirgisigacha har bir inson, har bir millat tiriladi. Payg'ambarimiz sollallohu alayhi vasallam odamlarning ko'tarilish holatini ta'riflaganlar: \"Odamlar yalangoyoq, yalang'och va sunnatsiz yig'iladilar\". Oisha (roziyallohu anho) vahima bilan erkaklar va ayollar bir-birlariga qarashadimi, deb so‘raganda, u kunning ishi hech kimni tashvishga solmaydigan darajada og‘irligini aytdi (Sahih al-Buxoriy 6527). Yana aytdilar: “Sizlar yalangoyoq, yalang‘och va sunnatsiz to‘planasizlar va qiyomat kunida birinchi bo‘lib kiyinadigan Ibrohimdir” (Sahih al-Buxoriy 3349).",
      "Doktrinaning maqsadi tomosha emas, balki u amalga oshiradigan mas'uliyatdir. Chunki Allohga qaytish aniqdir, hech bir amal maxfiy emas va hech bir o'lim chinakam qochish emas. “Qiyomat kelyapti, bunga shak-shubha yo'q va Alloh qabrdagilarni tiriltiradi” (Qur'on, 22:7). Tana tirilishiga ishonish bu hayotning axloqiy vaznini vaqtinchalik emas, balki haqiqiy qiladi.",
    ],
    quran: [
      {
        excerpt:
          'Va Bizga misol keltirdi va o\'zining yaratganini unutib: "Suyaklarni chirigan holida kim tiriltiradi?" Ayting: «Ularni birinchi marta yaratgan zot tiriltirur va U barcha maxluqotlarni biluvchi zotdir.',
      },
      {
        excerpt:
          "Va qiyomatning kelishini - bunga hech qanday shak-shubha yo'q - va Alloh qabrdagilarni qayta tiriltirishi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Sizlar yalangoyoq, yalang'och va sunnatsiz to'planasizlar. So'ngra: «Biz ilk maxluqotni boshlaganimizdek, uni yana qaytaramiz. Qiyomat kunida birinchi kiyinadiganlar esa Ibrohimdir.",
      },
      {
        excerpt:
          "Odamlar yalangoyoq, yalang'och va sunnatsiz yig'iladi. Oisha dedilar: Erkak va ayollar bir-birlariga qarashadimi? U: «Buning uchun ish juda og'ir bo'ladi», dedilar.",
      },
    ],
  },
  {
    title: "Uchrashuv (Mahshar)",
    summary: "Alloh oldida turish - quyosh yaqin, ter va odamlarning holati.",
    body: [
      "Tirilishdan so'ng, barcha mavjudotlar hukmni kutish uchun bitta keng va tekis tekislikka - Mahsharga suriladi. Yerning o‘zi o‘zgarib ketadi: “Kunda er va osmonlar ham o‘zga yer bilan almashtiriladi va ular yagona va g‘olib Alloh huzuriga chiqadilar” (Qur’on 14:48). Hech qanday diqqatga sazovor joylar, yashirinadigan olomon, suyanadigan maqom yo'q - faqat ochiq va kutayotgan har bir jon.",
      "Bunday turishning shartlari og'ir. Rasululloh sollallohu alayhi vasallam aytdilar: \"Qiyomat kuni quyosh odamlarga shunchalik yaqinlashtiriladiki, u bir chaqirim uzoqlikda bo'ladi va ular qilgan amallariga ko'ra terga botadilar - ba'zilari to'pig'igacha, ba'zilari tizzalarigacha, ba'zilari beliga, ba'zilari esa terlar jilovlaydi\" (Sahih Musulmon 2864). Shunga qaramay, xuddi shu rivoyatlar amallar orqali taqsimlangan rahm-shafqatni tasvirlaydi: Rasululloh sollallohu alayhi vasallam aytgan toifa Allohning Arshi soyasida Uning soyasidan boshqa soya bo'lmagan kunda soyalanadi, ular orasida adolatli rahbar, namozda o'sgan yoshlar va shu qadar yashirin sadaqa qilganning chap qo'li o'ng qo'li nima sarflaganini bilmas edi.",
      "Kutish uzoq - Qur'on \"o'lchovi ellik ming yil bo'lgan kun\" haqida gapiradi (Qur'on 70:4) - lekin uning uzunligi hamma uchun bir xil emas. Sahih xabarlarda aytilishicha, u mo'min uchun ikki namoz o'rtasidagi vaqt kabi qisqa bo'lib, boshqalarga og'ir bo'ladi. Shunday qilib, Mahshar hayotning shaxsiy kitobi ommaviy haqiqatga aylanadi: bir xil quyosh, bir xil tekislik va har bir kishi oldinga yuborgan narsadan butunlay boshqa tajribalar.",
    ],
    quran: [
      {
        excerpt:
          "O'sha kunda yer va osmonlar boshqa yer bilan almashtiriladi va ular yagona va g'olib Alloh huzuriga chiqadilar.",
      },
      {
        excerpt:
          "Farishtalar va Ruh Uning huzuriga o'lchovi ellik ming yil bo'lgan kunda ko'tariladi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Quyosh qiyomat kuni odamlarga bir chaqirim uzoqlikgacha yaqinlashtiriladi va ular qilgan amallariga ko'ra terga botadilar - ba'zilari to'pig'igacha, ba'zilari tizzalarigacha, ba'zilari bellarigacha, ba'zilari esa terlar jilovlaydi.",
      },
    ],
  },
  {
    title: "Shafoat (shafoat)",
    summary: "Faqat Allohning izni bilan - turlar va eng katta shafoat.",
    body: [
      "Shafoat - bu shafoat - bir tomonning Allohga boshqa birov nomidan gapirishi. Haqiqiy va rahm-shafqatdir, lekin u hech qachon mustaqil bo'lmaydi: hech kim faqat Allohning iznisiz va faqat U rozi bo'lgan kishiga shafoat qilmaydi. Qur'oni karimda ikki marta: «Uning huzurida faqat Uning iznisiz kim shafoatchi bo'la oladi?» deyilgan. (Baqara surasi, 255-oyat) va “Uning huzurida faqat U izn bergan kishiga shafoat foyda berur” (Qur’on 34:23). Islomiy shafoat ta’limotini uning har qanday buzg‘unchiliklaridan ajratib turadigan yagona shartdir.",
      "Ulardan eng ulug‘i, faqat Payg‘ambarimiz Muhammad sollallohu alayhi vasallamga xos bo‘lgan ash-Shafoa al-Uzmadir. Insoniyat uzoq vaqtdan beri ezilgan mahsharda payg'ambardan payg'ambarga - Odam, Ibrohim, Muso, Iso alayhissalomga o'tadi, to Muhammad sollallohu alayhi vasallamning huzurlariga kelishadi. Arsh ostiga sajda qiladi va unga: “Boshingni koʻtar, soʻra, senga beriladi, shafoat qil va shafoating qabul qilinadi”, deyiladi (Sahih al-Buxoriy 7440; Paygʻambarlarning toʻliq zanjiri Sahih Muslimda 195). Bu bilan u Allohdan hisob-kitobni boshlashini va o'rnidan turishini so'raydi - yolg'iz unga va'da qilingan hamd maqomi.",
      "Boshqa sahih shakllar quyidagilardan iborat: ba'zi mo'minlarning jannatga hisob-kitobsiz kirishlari uchun shafoat; martabalarni ko'taradigan shafoat; va eng avvalo, mo'minlar orasida katta gunohkorlar uchun shafoat bo'lsinki, odamlar Rasululloh sollallohu alayhi vasallam, boshqa payg'ambarlar, farishtalar, mo'minlarning shafoatlari va nihoyat rahmlilarning rahmli bo'lgan Allohning rahmati bilan do'zaxdan chiqariladi. Payg'ambarlar, shahidlar, solihlar va hatto yosh vafot etgan bolalar ham ruxsat bilan shafoat qilishlari mumkin, ammo shaxsiy xabarlarning kuchi har xil.",
      "Muhim ogohlantirish: oxiratda shafoat hech qachon o'lik yoki g'oyibdan yordam so'rashga ruxsat bermaydi. Qabrda bir payg‘ambar yoki avliyoni iltijo qilib, g‘am-g‘am-g‘am-g‘am-g‘am-g‘ussalarini yengil qilishini yoki ehtiyojini qondirishni so‘rash, Allohdan o‘zgaga ibodat qilish, ya’ni shirk bo‘lib, bu yerda bayon qilingan shafoatning teskarisi bo‘lib, Alloh o‘sha kuni O‘zi hohlagan kishiga ato etadigan ne’matdir. Shuningdek, u bu hayotdagi iymon va tavba ehtiyojini almashtirmaydi; Bu tavhidda yashab, vafot etganlarga Allohning rahmatidir.",
    ],
    quran: [
      {
        excerpt:
          "Kim Uning huzurida faqat Uning iznisiz shafoat qila oladi? U zot ularning oldilaridagini ham, keyingilarini ham biladir.",
      },
      {
        excerpt: "Va O'zi izn bergan kishigagina shafoat qilish Uning huzurida manfaat bermas.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Odamlar mening oldimga keladilar, men Allohga sajdaga yiqilib: “Ey Muhammad, boshingizni ko'taring. so'rang, sizga beriladi, shafoat qiling va shafoatingiz qabul qilinadi.",
      },
      {
        excerpt:
          "Insonlar Odam alayhissalomga, so‘ngra Ibrohimga, so‘ngra Muso alayhissalomga, so‘ngra Iso alayhissalomga boradilar va Muhammad sollallohu alayhi vasallamga kelgunlaricha uzr so‘raydilar va u zotga eng katta shafoat beriladi.",
      },
    ],
    misconceptions: [
      "Noto'g'ri tushuncha: Shafoat so'rash, Payg'ambar sollallohu alayhi vasallamga yoki solihlarga ibodat qilishdir. Tuzatish: Ibodat faqat Allohnikidir; Qiyomat kuni shafoat Allohning izni bilan bergan rahmatdir va bu hayotda o'liklarni duo qilishni oqlamaydi.",
    ],
  },
  {
    title: "Amallar daftarchasi",
    summary: "Yozuvchi farishtalar - o'ng qo'l, chap qo'l, hech narsa qoldirilmagan.",
    body: [
      "Har bir insonning o‘z amallarini yozib qo‘yuvchi ikkita oliyjanob ulamolari bor: “Ikki oluvchi qabul qilsa, o‘ng va chap tomonda o‘tirsa, hech bir so‘z aytmaydi, balki uning yonida yozib olishga tayyor bir kuzatuvchi bo‘ladi” (Qur’on 50:17-18). Qiyomat kuni bu yozuvlar topshiriladi va kitobni olishning o'zi birinchi hukm bo'ladi - muvaffaqiyat qozongan uchun o'ng qo'lda, chap qo'lda yoki vayron bo'lgan uchun orqadan (Qur'on 84:7-12; 69:19-37).",
      "Bu yozuvlardan hech narsa o'tkazib yuborilmaydi - eng kichik harakat ham, amalga aylangan o'tkinchi fikr ham. Zolimlar uning to'liqligidan hayratda qoladilar: «Ular: «Voy holimizga! Bu kitob nimaki, uni yozib qo'ygandan boshqa kichik yoki katta hech narsa qolmaydi? Va ular o'z oldilarida qilgan amallarini topadilar va Robbing hech kimga zulm qilmas» (Qur'on 18:49). Allohning rahmati bilan ezgu niyatlar va tark qilingan gunohlar ham mo‘minning foydasiga yoziladi.",
      "Chunki til va a’zolar varaqlarni to‘ldiradigan narsadir, ularni qo‘riqlash kitobni saqlashdir. Payg‘ambarimiz sollallohu alayhi vasallam tilni najotning o‘rtasiga qo‘yganlar: “Kimki menga jag‘lari va oyoqlari orasidagi narsaga kafolat bersa, men unga jannatni kafolatlayman” (Sahih al-Buxoriy 6474), ya’ni kimki o‘z so‘zini va iffatini saqlasa. Kundalik o'z-o'zini ko'rib chiqish odati - bugungi kunda kitobga nima qo'shilganini so'rash - imonli kishi tutishi mumkin bo'lgan eng aqlli va foydali amaliyotlardan biridir.",
    ],
    quran: [
      {
        excerpt:
          "Va kitob yozilur va jinoyatchilar undagi narsadan qo'rqib: «Voy holimizga! Bu kitob nimaki, uni yozib qo'ygandan boshqa kichik yoki katta hech narsa qolmaydi? Va ular qilgan amallarini topadilar va Robbing hech kimga zulm qilmas.",
      },
      {
        excerpt:
          "Kimning kitobi o'ng qo'liga berilgan bo'lsa, u: \"Mana, mening kitobimni o'qing!\" Men hisobim bilan uchrashishimga amin edim. Shunday qilib, u yoqimli hayotda bo'ladi. Kimning kitobi chap qo'liga berilgan bo'lsa: «Koshki menga kitobim berilmasa edi», deydi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim menga jag'lari va oyoqlari orasidagi narsaga kafolat bersa, men unga jannatni, ya'ni tilini va iffatini kafolatlayman.",
      },
    ],
    actions: [
      "Tilni deyarli hamma narsadan ustun qo'ying - yaxshilik yoki yomonlik rekordini to'ldiradigan narsalarning aksariyati undan o'tadi.",
      "Uxlashdan oldin kuningizni ko'rib chiqing: kitobingizda yozilgan narsalarni ko'rish uchun nimani xohlayotganingizni va nimadan qo'rqishingizni so'rang.",
    ],
    appLinks: [{}],
  },
  {
    title: "Tarozi (Mizan)",
    summary: "Amallar tortilgan — ixlos, xulq va zikr tarozilarni og‘irlashtiradi.",
    body: [
      "Mizon – amallar mutlaq adolat bilan tortiladigan tarozi: “Biz adolat tarozilarini qiyomat kuni uchun qo‘yamiz. Bas, hech bir jonga zulm qilinmas. Agar xantal doni og‘irligida bo‘lsa ham, Biz uni chiqarurmiz va hisobchi sifatida Biz kifoya qilurmiz” (Qur’on, 21:47). Ahli sunnat buni oddiy tashbeh emas, balki haqiqiy tarozi sifatida tasdiqlaydi - amallar yoki ularning yozuvlari chinakamiga tortiladi. Insonning taqdiri qaysi tovaga cho'ksa, tarozi og'ir bo'lgan kishi rohat hayotda bo'ladi. Kimning tarozisi engil bo'lsa, uning panohi tubsizlikdir» (Qur'on 101:6-9).",
      "Tarozini og'ir qiladigan narsa ishning ko'pligi emas, balki uning Alloh huzuridagi og'irligidir va vazn ixlosdandir. Rasululloh sollallohu alayhi vasallam zahmatsiz, lekin ulug‘ amallarga ishora qilib: “Ikki so‘z tilga yengil, tarozida og‘ir, Rohmanga mahbub: Subhanallohi va bihamdih, Subhanallohil-Azim” (Sahih al-Buxoriy 6406). Yana: «Qiyomat kuni mo‘minning tarozida go‘zal xulqdan og‘irroq narsa yo‘q», dedilar (Jomi' at-Termiziy 2002, sahih). Shunday qilib, chin dildan takrorlanadigan oddiy eslash yoki sabr-toqatli odob-axloq ko'rinishdagi tog'larni bosib o'tishi mumkin.",
      "Buning aksi bo'sh ishlarning xavfi. Odamlar ko'rish uchun qilingan (riyo) yoki ikkiyuzlamachilik bilan buzilgan harakatlar tarozida vaznsiz - tashqi ko'rinishi katta, ichi bo'sh bo'lishi mumkin. Shuning uchun ham ixlos ko'pchilikning bir fazilati emas, balki har bir amalning o'z vaznini beradigan narsadir. Dars, kunni kichik, samimiy, izchil harakatlar atrofida qurish va ko'rinadiganlar ortidagi niyatni tozalashdir.",
    ],
    quran: [
      {
        excerpt:
          "Biz qiyomat kuni uchun adolat tarozisini qo'yamiz. Bas, hech bir jonga zulm qilinmas. Agar xantal doni og'irligida bo'lsa, uni chiqarurmiz va hisobchi sifatida Biz kifoya qilurmiz.",
      },
      {
        excerpt:
          "Kimning tarozisi og'ir bo'lsa, u rohat hayotdadir. Kimning tarozisi engil bo'lsa, uning panohi tubsizlikdir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ikkita kalima tilga yengil, taroziga ogir, Rohmanga mahbub: SubhanAllohi va bihamdih, SubhanAllohil-Azim.",
      },
      {
        excerpt:
          "Qiyomat kuni mo'minning tarozida go'zal xulqdan og'irroq narsa yo'q. Darhaqiqat, go'zal xulqli kishi u bilan ro'za tutuvchi va namoz o'qiydigan kishi darajasiga yetadi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Hisobdorlik (Hisab)",
    summary: "Oson hisob-kitob, batafsil hisob-kitob va boshqalarga tegishli huquqlar.",
    body: [
      "Hisob - bu har bir inson o'z hayoti uchun hisob-kitob qilinadigan vaqt. Qur'onda uning ikki xil tajribasi tasvirlangan: «Kimning kitobi o'ng qo'liga berilsa, u oson hisob ila hukm qilinur va o'z qavmiga baxt-saodat bilan qaytadi. Lekin kitobi orqasidan berilgan kishi halokatga chorlaydi” (Qur’on 84:7–11). “Oson hisob” imtihondan qochmaslik emas, balki rahmatdir – Payg'ambar sollallohu alayhi vasallam so'roqning shiddatliligining o'zi bir jazo ekanligini ogohlantirganlar.",
      "Rasululloh sollallohu alayhi vasallamning o'z xotini asosiy farqni rivoyat qiladi. Oisha roziyallohu anho: «Kim hisob-kitob qilinsa, halok bo'ladi», dedilar. U: «Ammo Alloh: «U oson hisob bilan hukm qilinadi», demaydimi? U: «Bu faqat amallarning taqdimotidir. Kimki hisob-kitob bilan so'roq qilinsa, halok bo'ladi» (Sahih al-Buxoriy 6537). Shunday qilib, imonlining umidi har qanday tekshiruvdan qochib qutulish emas, balki o'z qilmishlarini ko'rsatish, gunohlarini qoplash va kechirilishidir.",
      "Qarzning shunday toifasi borki, hatto Allohning mag'firati ham oddiygina o'chirilmaydi: boshqa odamlarning haqlari (huquq al-ibad). Rasululloh sollallohu alayhi vasallam: «Kim bankrot ekanini bilasizmi?» — deb so‘radilar. Ular: «Pulsiz kishi», dedilar. Ummatimning muflisi qiyomat kuni namoz, ro‘za va zakot bilan kelgan, lekin birovni haqorat qilgan, birovning molini olib, birovning qonini to‘kgan kimsadir, shuning uchun uning yaxshiliklari o‘zlariga nasib etsa, qilgan yaxshiliklari tugagach, uning gunohlari do‘zaxga tashlanadi va musulmonlar ustiga tashlanadi», dedilar. 2581). Ibodat adolatsizlikni bekor qilmaydi; faqat adolatsizlikni bartaraf etish.",
      "Amaliy xulosa shoshilinch va aniq: to‘lanmagan qarzlar, o‘g‘irlangan boyliklar, tuhmatlar va buzilgan omonatlar bu hayotda – Allohga tavba qilish va o‘z o‘rnini qoplash va odamlardan kechirim so‘rash orqali o‘rnatilishi kerak, chunki o‘sha paytdagi yaxshilik valyutasiga qaraganda, hozir pul va tavoze bilan hisob-kitob qilish ancha arzon. Va bularning barchasi orqali Allohning adolati mukammaldir va Uning rahmati ixlos bilan jihod qilgan va tavba qilgan har bir kishini qamrab oladi.",
    ],
    quran: [
      {
        excerpt:
          "Kimning kitobi o'ng qo'liga berilsa, u oson hisob bilan hukm qilinib, o'z qavmiga baxt-saodat bilan qaytadi. Kimning kitobi orqasidan berilgan bo'lsa, halok bo'lish uchun faryod qiladi va do'zaxga kiradi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kim hisob-kitob qilinsa, halok bo'ladi. Oisha aytdilar: Alloh taolo “Oson hisob bilan hukm qilinadi”, demaydimi? U zot: «Bu faqat amallarning taqdimotidir», dedi. Lekin kimning hisobi haqida so'roq qilinsa, halok bo'ladi.",
      },
      {
        excerpt:
          "Kim bankrot ekanligini bilasizmi? U qiyomat kuni namoz, ro'za va zakot bilan kelgan, lekin kimni haqorat qilgan, tuhmat qilgan va zulm qilgan bo'lsa, shuning uchun uning yaxshiliklari ularga beriladi va ular tugagach, gunohlari o'ziga yuklanadi va do'zaxga tashlanadi.",
      },
    ],
    actions: [
      "Qarzlarni to'lang va nohaq olingan narsalarni, kichik bo'lsa ham, belgilangan kun kelishidan oldin qaytaring.",
      "So'zda, boylikda yoki qadr-qimmatda haqorat qilgan har qanday odamni qidirib toping va kechirim so'rang - endi restitusiya o'sha paytdagi tiklashdan ancha arzon.",
      "Allohga haqlari uchun tavba qiling va ikki kitobni - ilohiy va insoniy kitobni aniq saqlang.",
    ],
    appLinks: [{}],
  },
  {
    title: "Hovuz (Hawd)",
    summary: "Payg'ambar sollallohu alayhi vasallamning havzasi - kim ichadi va kim qaytariladi.",
    body: [
      "Havd - Payg'ambarimiz Muhammad sollallohu alayhi vasallamga qiyomat kunida berilgan ulug' havza, o'sha jazirama va mashaqqatli kunda chanqagan ummatlari uchun rahmatdir. Uning ta'riflari juda ko'p va sahihdir: \"Mening Hawd - bir oylik yo'l; Uning suvi sutdan oppoq, hidi mushkdan shirin, kosalari osmondagi yulduzlarga o'xshaydi. Kim undan ichsa, boshqa chanqamaydi” (Sahih al-Buxoriy 6579). Havdga bo'lgan e'tiqod sunniy e'tiqodining bir qismi bo'lib, ommaviy ravishda tarqatilgan xabarlar bilan asoslanadi.",
      "Rasululloh sollallohu alayhi vasallam o‘zlari u yerda o‘z tobelarini qabul qiladilar: “Men sizlardan oldin Havdga yetib boraman va sizlardan mening oldimga kelganlarni kuzatib turaman” (Sahih Musulmon 2292). Ummatini tahorat izlaridan yuzlari, qo‘l va oyoqlaridagi nurdan taniydi. Unga erishish - abadiy o'chirish; Kavsar daryosidan to'ydiriladi, Alloh O'z Payg'ambariga jannatda bergan.",
      "Ba'zilari esa Havddan haydaladilar. Rasululloh sollallohu alayhi vasallam ba'zi odamlarga: «Ular sizdan emas. Ular sizdan keyin dinni o'zgartirdilar va o'zgartirdilar», yoki undan keyin orqaga qaytdilar. Olimlar bunga ehtiyot bo'lishadi: bu hadisdagi ma'lum toifalarga ishora qiladi, masalan, murtadlik va qabr, aniq hidoyatdan so'ng dinga ataylab yangilik kiritish - va oddiy musulmonlar uchun bir-birlarini ayblash uchun ruxsatnoma emas. Havdga boradigan xavfsiz yo'l - sunnatga amal qilish, tahorat va namozni qo'riqlash, mo'minlarning birligini saqlashdir.",
    ],
    hadith: [
      {
        excerpt:
          "Mening Hawd bo'ylab bir oylik yo'l. Uning suvi sutdan oppoq, hidi mushkdan shirin, kosalari osmondagi yulduzlardek ko‘p. Kim undan ichsa, hech qachon chanqamaydi.",
      },
      {
        excerpt:
          "Men sizlardan oldin Havdga yetib boraman va sizlardan mening oldimga kelganlarni kuzatib turaman. Mendan ba'zi odamlar olib qo'yiladi va men aytaman: Robbim, mening hamrohlarim! Ular sizdan keyin nima bid'at qilganlarini bilmaysizlar.",
      },
    ],
    disclaimer:
      "Havddan yuz o'girganlar haqidagi xabarlarda hadisda zikr qilingan alohida toifalar, asosan, dindan qaytganlik va dindagi katta bid'at haqida so'z boradi. Ular musulmonlarning bir-birlarini yo'ldan ozdirishi uchun ruxsatnoma emas.",
  },
  {
    title: "Ko'prik (Sirot)",
    summary: "Jahannamdan o'tish - amal va rahm-shafqatga ko'ra tezlik.",
    body: [
      "Sirot jahannam tepasiga cho'zilgan ko'prik bo'lib, u orqali har bir kishi o'tishi kerak - mo'min va kofir. Qur’oni karim o‘tishni istisnosiz tasdiqlaydi: “Sizlardan birortangiz u yerga kelsa. Bu Parvardigoring zimmasidagi farzdir. So‘ngra Allohdan taqvo qilganlarga najot berurmiz va unda zolimlarni tiz cho‘kkan holida qoldiramiz” (Qur’on 19:71-72). O'tish universaldir; Olis tarafga eson-omon yetib kelish hamma narsadir va buni Alloh himoya qilgan bandalariga beradi.",
      "O'tish tartibini olib kelgan amallar belgilaydi. Rasululloh sollallohu alayhi vasallam buni ta'riflaganlar: \"Ko'prik do'zax ustidan qo'yiladi... va sizlardan birinchilaringiz chaqmoqdek, keyin shamol kabi, keyin qushlar kabi, so'ngra yugurayotgan odam kabi o'z qilmishlariga ko'ra o'tasizlar. Payg'ambaringiz esa ko'prik ustida turib: \"Yo Rabbiy, ularni o'z panohida asragin, asragin\", deydilar. Ba'zilari jarohatsiz najot topadi, ba'zilari tirnalgan va qo'yib yuborilgan, ba'zilari esa do'zaxga tashlanadi» (Sahih al-Buxoriy 6573). Ko'prikning yonida, xuddi shu hisobotda, ishonchlilik (amanah) va qarindoshlik rishtalari - bu omonat va oilaviy rishtalarga sodiqlik haqiqatda odamga hamroh bo'lgan ajoyib tasvir.",
      "Sirotdagi nur va tezlik bu hayotda orttirilgan. O'z vaqtida o'qilgan namoz, to'g'ri berilgan sadaqa, muomalada rostgo'ylik, yaxshi xulq-atvor insonni kesib o'tadigan tayanch va nurga aylanadi. Rasululloh sollallohu alayhi vasallam u yerda mo'minlar uchun shafoat qiladilar va Allohning rahmati bilan har kim boshqa tarafga yetib boradi.",
      "Boshqa ko'rinmas stantsiyalarda bo'lgani kabi, dono yo'l ko'prikning jismoniy o'lchamlari - qanchalik nozik, qanchalik o'tkir, qancha uzunligi - vahiyda aytilganidan tashqari, haqida o'ylash emas, balki to'liq o'tishni engillashtiradigan ishlarga e'tibor qaratishdir. Tasavvur qila olmaydigan narsaga tayyorlanishingiz mumkin.",
    ],
    quran: [
      {
        excerpt:
          "Va sizlardan birortangiz u erga keluvchidan boshqa yo'q. Bu Parvardigoring zimmasidagi farzdir. So'ngra Allohdan taqvo qilganlarga najot berurmiz va unda zolimlarni tiz cho'kib qoldiramiz.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Do‘zax ustidan ko‘prik o‘rnatiladi va men birinchi bo‘lib o‘taman. Odamlar o'z qilmishlariga ko'ra, yashin kabi, shamoldek, qushlar kabi, yugurayotgan odam kabi o'tib ketadilar, men esa: Yo Rabbiy, ularni o'z panohida asragin, saqlagin, deb aytaman. Ba'zilari najot topadi, ba'zilari tirnaladi va qo'yib yuboriladi va ba'zilari do'zaxga tushadi.",
      },
    ],
    actions: [
      "Besh vaqt namozni o'z vaqtida o'qing - namoz ko'prikdan o'tadigan nurdir.",
      "Kichik miqdorda bo'lsa ham, muntazam ravishda sadaqa bering.",
      "Qarindoshlik rishtalarini saqlang va omonatlaringizni saqlang - hadisda ular sirotning yonida turadilar.",
    ],
  },
  {
    title: "Jannat",
    summary: "Abadiy mukofot bu uning saodati va eng avvalo Allohni ko'rishdir.",
    body: [
      "Jannat Alloh taolo mo'minlar uchun tayyorlab qo'ygan mangu uydir, xayolga sig'maydigan haqiqatdir. Rasululloh sollallohu alayhi vasallam bu haqda Alloh taolo aytadilar: “Men solih bandalarim uchun hech bir ko‘z ko‘rmagan, hech bir quloq eshitmagan va hech bir inson qalbi o‘ylamagan narsalarni hozirlab qo‘ydim” (Sahih al-Buxoriy 3244). Uning daryolari, bog'lari, qasrlari va hamrohligi Qur'onda qalblarni jalb qilish uchun tasvirlangan, ammo ta'riflar ulardan to'liq oshib ketadigan quvonchga ishoradir.",
      "Uning savoblarining eng kattasi hech qanday bog' yoki daryo emas, balki Allohning rizoligi va Uning yuzini ko'rishdir. «U kunda yuzlar nurli, Robbilariga qaraydi» (Qur'on 75:22-23) - mo'minlar oxiratda Allohga qarashlari, jannatning tojini ko'rishlari, Uning ulug'vorligiga yarasha va yaratilishga o'xshamaydigan tarzda in'om etilgani deb tushuniladi. Alloh taolo: «Yaxshilik qilganlar uchun eng yaxshi ajr va undan ortiq mukofot bordir» (Qur'on 10:26) va «ko'proq» degani sahih hadislarda Uning ulug' yuzini ko'rishi sifatida bayon etilgan.",
      "Jannatga kirish Alloh taoloning rahmati bilan, iymon va solih amallar bilan bo'ladi - bu ikkisi hech qachon bir-biriga qarama-qarshi bo'lmaydi: rahmat sabab, amal esa Alloh unga bog'lab qo'ygan belgi va vositadir. Qiyomat kuni jannat ahli uchun hech qachon so'nmaydigan va tugamaydigan saodat bilan tugaydi. Ushbu modul jannatga nisbatan qisqacha munosabatda bo'ladi; to'liq jannatga sayohat qo'llanmasi uning eshiklari, darajalari, unga olib boradigan amallar va uning uchun qilingan duolarni chuqur qamrab oladi.",
    ],
    quran: [
      {
        excerpt:
          "Robbingizdan mag'firatga va kengligi osmonlaru yerdek bo'lgan jannatga shoshiling.",
      },
      {
        excerpt: "O'sha kunda yuzlar nurli bo'lib, Parvardigorlariga qarab turur.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Alloh taolo aytadi: Men solih bandalarim uchun hech bir ko‘z ko‘rmagan, hech bir quloq eshitmagan va hech bir inson qalbi o‘ylab topmagan narsalarni hozirlab qo‘ydim.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Jahannam",
    summary: "Haqiqiy ogohlantirish - haqiqiy jazo va tiriklikda qochish eshigi.",
    body: [
      "Jahannam - bu yomon ruhiy holatning ramzi yoki metaforasi emas, balki haqiqiy jazo maskani. Unga iymon keltirish g‘aybga va Allohning adolatiga ishonishning bir qismidir. Qur'oni karimda ochiq-oydin ogohlantiriladi: \"Robbiga kufr keltirganlarga do'zax azobi bordir va qayoqqa borar joy\" (Qur'on 67:6). Uning zo'ravonligi qiziqishni qondirish uchun emas, balki uyg'otish uchun tasvirlangan: \"Yoqilg'isi odamlar va toshlar bo'lgan olovdir\" (Qur'on 2:24), Allohning amrlariga itoat qilmaydigan qattiq farishtalar tomonidan qo'riqlanadi.",
      "Bu ogohlantirishlarning maqsadi rahm-shafqatdir. Ular takabburlikni sindirish, haqiqatni qat'iy rad etishni to'xtatish va juda kech bo'lmasdan odamni orqaga qaytarish uchun mavjud. Shuning uchun Qur'ondagi ogohlantirishlar deyarli har doim ochiq tavba eshigi bilan bog'langan - Do'zaxni tasvirlashning maqsadi odamlarning imkoni boricha undan qochishlari uchundir. Uning jazosi adolatlidir. Unga hech kim o'z ixtiyori bilangina kirar, magar hidoyatga ziddir. Alloh hech kimga zulm qilmas.",
      "Gunohlarni o'z zimmasiga olgan mo'minlar uchun sunniylik to'g'ri e'tiqodi qo'rquv va umid o'rtasidagi muvozanatdir: gunohkor Allohning irodasi ostidadir - U mag'firat qilishi yoki do'zaxda poklanishi va keyin yuqorida aytib o'tilgan shafoat va rahm-shafqat bilan zarracha iymoni bo'lgan har bir kishini undan chiqarib yuborishi mumkin. Ushbu modul Jahannamga ataylab qisqacha va o'lchovli davolanishni beradi. Uning ogohlantirishlari, katta gunohlari hamda tavba va rahm-shafqat eshiklarini toʻliqroq oʻrganish “Jahannamni tushunish” moduli va unga aloqador aqida mavzularida topilgan – har doim umid bilan, hech qachon umidsizlikka tushmaslik kerak.",
    ],
    quran: [
      {
        excerpt:
          "Parvardigorlariga kufr keltirganlar uchun esa jahannam azobi va naqadar yomon joy bordir.",
      },
      {
        excerpt:
          "Ayting: Ey o'zlariga zulm qilgan bandalarim, Allohning rahmatidan noumid bo'lmanglar. Albatta, Alloh barcha gunohlarni kechiradi. Albatta, U mag'firatli va rahmli zotdir.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kim hisob-kitobsiz kiradi?",
    summary: "Batafsil hisobni chetlab o'tganlar haqida sahih hadis - ilmiy munozara.",
    body: [
      "Bu ummatdan bir guruh jannatga hisob-kitobsiz kirishlari oxirat kunining rahmatlaridandir. Rasululloh sollallohu alayhi vasallam: “Ummatimdan yetmish ming kishi jannatga hisob-kitobsiz kirurlar”, boshqa bir iborada “har bir ming yetmish mingdan ko‘proq”, dedilar. Sahobalar ularning kimligidan hayron bo‘lganlarida, u zot ularga shunday ta’rif berdilar: “Ular boshqalardan ruqya so‘ramaydigan, yomon falokatga ishonmaydigan, o‘g‘irlamaydigan va Parvardigoriga tavakkul qiladigan zotlardir” (Sahih al-Buxoriy 6541).",
      "Bu ta'rifning qalbi tavakkul, ya'ni Allohga chuqur, faol tavakkal, xurofotdan va sabablarga tashvishli qaramlikdan xalos bo'lishdir. U ruxsat etilgan tibbiy davolanishga murojaat qilishni qoralamaydi; O'z ustida o'qiladigan rukya ham, halol tabobat ham sunnatda mustahkamlangan. Shunchalik tavakkul Allohga bo'lgan kishi maqtovga sazovordirki, ular atrofda aylanib yurmaydilar, ma'naviy joziba so'ramaydilar.",
      "Olimlar bu raqamning o'zini muhokama qiladilar: ba'zilari yetmish mingni to'g'ridan-to'g'ri deb hisoblaydilar, boshqalari bu qo'shimcha hisobotlar bilan ko'paytiriladi, va boshqalar bu sobit odam sonidan ko'ra, Allohning inoyatining cheksiz ko'pligidan dalolat beradi. Ularning fikriga qo'shilgan narsaning asosiy haqiqati - Allohning rahmati inson hisobi kutganidan ancha yuqori ekanligi va yakuniy najot ana shu rahm-shafqat tufaylidir.",
      "Bu umid stantsiyasi, dangasalik uchun bo'shliq emas. U mo'minni Allohga chin dildan tavakkal qilishga va xurofotdan uzoqlashishga undaydi, shu bilan birga ibodatda harakat qiladi. Hech kim amallarga beparvolik bilan erishmaydi; Unga joziba va qo'rquvdan ko'ra ixlos, ishonch va Allohga bog'langan qalb jalb qilinadi.",
    ],
    hadith: [
      {
        excerpt:
          "Ummatimdan yetmish ming kishi jannatga hisob-kitobsiz kiradilar: ular boshqalardan ruqya so‘ramaydigan, yomon falokatga ishonmaydigan, o‘g‘irlamaydigan va Parvardigoriga tavakkul qilgan zotlardir.",
      },
    ],
    disclaimer:
      "Ulamolar “hisobsiz” sobit yetmish ming yoki undan ham kattaroq, hisoblab bo‘lmaydigan sonni bildirishlari borasida ixtilof qiladilar. Yakuniy najot Allohning rahmati bilan ekaniga hamma yakdil bo‘lib, bu amallarni beparvo qilish uchun emas, balki umid uchun sababdir.",
  },
  {
    title: "Oxirgi kunga tayyorgarlik",
    summary: "Amaliy ibodat - har bir odatingizni Alloh bilan uchrashishingiz bilan bog'lang.",
    body: [
      "Butun sayohatni bosib o'tgandan so'ng - o'lim, qabr, alomatlar, karnay, yig'ilish, yozuvlar, tarozi, hisob, ko'prik va ikkita uy - yagona aqlli javob - tayyorgarlik ko'rishdir. Ammo tayyorgarlik vahima emas. Rasululloh sollallohu alayhi vasallam sahobalarini qo'rquv va falaj hollarida qoldirmadilar. ularni ishda qoldirdi. Bularning barchasining asosi tavhid va ixlos (ixlos)dir: amal faqat Alloh uchun va sunnatga muvofiq qilingan taqdirdagina qabul bo'ladi, shuning uchun ko'proq amal qo'shishdan avval o'zingda mavjud bo'lgan niyatingni tozala.",
      "Tarozida og'irlashtirilgan matnlar ustunlar ustiga kun qurish. Vaqtida namoz o'qish sirotning langari va nuridir. Qur'on - har kuni o'qiladi, eshitiladi va ustida fikr yuritiladi, hatto bir necha oyat - qalbni tirik saqlaydi. Tavba: «Ey mo'minlar, Allohga sidqidildan tavba qilinglar» (Qur'on 66:8). Sadaqa mol-mulkni poklaydi va sadaqa sadaqasi jariya kabi umringni uzaytiradi. Zikr tarozida tilni og'ir, so'z esa tilga engil bo'ladi. Rasululloh sollallohu alayhi vasallam yaxshi xulq esa taroziga qo'yilgan eng og'ir narsadir, dedilar.",
      "Rasululloh sollallohu alayhi vasallam jannatga to'g'ridan-to'g'ri bog'lab qo'ygan ikki narsani - tilni va iffatni (Sahih al-Buxoriy 6474) saqlanglar, chunki bular katta gunohlardan ham ko'ra ko'proq yozuvni to'ldiradigan yoki bankrot qiladigan narsalardir. Imkoniyatingiz bor ekan, odamlarning haqlarini hal qiling: qarzni to'lang, olingan narsani qaytaring, zarar uchun uzr so'rang va har bir ishda adolatli bo'ling, shunda siz hech qachon u zulm qilgan kimsalarning da'vosi bilan namozi yeb qo'yilgan «bankrot» bo'lib kelmayapsiz.",
      "Hamma narsa bir niyatga tayanadi, bu haqda Sahih al-Buxoriyning birinchi hadisi sharifida: “Amallar faqat niyatlarga ko‘radir”, deyilgan. Munibning izdoshlarini musobaqalash uchun hisob sifatida emas, balki bu odatlar - namoz, Qur'on, zikr, sadaqa, tavba - har biri jimgina kuningizni Alloh bilan uchrashuvga ko'rsatuvchi yumshoq iskala sifatida foydalaning. Bu butun maqsad: hozir chinakam Uning oldida turishni kutgan odam sifatida yashash.",
    ],
    quran: [
      {
        excerpt: "Men jin va insni faqat O'zimga ibodat qilishlari uchun yaratdim.",
      },
      {
        excerpt:
          "Ey iymon keltirganlar, Allohga sidqidildan tavba qilinglar. Shoyadki, Robbingiz sizlardan gunohlaringizni ketkazsa va ostidan anhorlar oqib turgan jannatlarga kiritsa.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Amallar faqat niyatga bog'liq va har bir inson faqat o'zi niyat qilgan narsaga ega bo'ladi.",
      },
      {
        excerpt:
          "Kim menga jag'lari va oyoqlari orasidagi narsaga - tiliga va iffatiga kafolat bersa, men unga jannatni kafolatlayman.",
      },
    ],
    actions: [
      "Besh vaqt namozni o'z vaqtida o'qing.",
      "Har kuni Qur'onni o'qing yoki tinglang - hatto bir nechta oyat.",
      "Ertalab va kechqurun adhkarni saqlang.",
      "Doimiy ravishda, hatto kichik miqdorda ham sadaqa bering.",
      "Har kuni tavba qiling va ixlos bilan kechirim so'rang.",
      "Til va iffatni saqlang va har bir va'da va omonatni bajaring.",
      "Oila, qo'shnilar va kreditorlar oldidagi huquqlarni bajaring.",
      "Namoz jurnalida hushu va niyatning samimiyligi haqida o'ylang.",
    ],
    appLinks: [{}, {}, {}, {}, {}, {}],
  },
];

export const LAST_DAY_HADITH_UZ: DeepPartial<LastDayHadithEntry>[] = [
  {
    hadith: {
      excerpt: "Ko'pincha zavqlarni buzuvchi - o'limni eslang.",
    },
    context:
      "O'limni muntazam ravishda eslash yurakni yumshatadi, g'azabni yo'qotadi va umidsizlikni keltirib chiqarmasdan ustuvorliklarni to'g'rilaydi.",
  },
  {
    hadith: {
      excerpt:
        "Sizlardan hech biringiz Allohning rahmati haqida yaxshi o'ylagan holdagina o'lmasin.",
    },
    context:
      "Xolis iymon, tavba va Allohdan umidvor bo'lish orqali yaxshi yakun (husn al-hatima) kutiladi.",
  },
  {
    hadith: {
      excerpt: "Qabr yo jannat bog'laridan bir bog' yoki do'zax chuqurlaridan bir chuqurdir.",
    },
    context:
      "Barzax qabrdagi mukofot yoki jazoni o'z ichiga oladi, Allohning hikmatiga ko'ra, qabr insonning o'z qilmishlarini aks ettiradi.",
  },
  {
    hadith: {
      excerpt:
        "Marhum dafn etilganida ikki farishta kelib, undan Parvardigori, dini va payg‘ambari haqida so‘rashadi.",
    },
    context:
      "Qabrda so'roq qilish sahih xabarlarda tasdiqlangan; bu rivoyatda ikki farishtaning ismlari Munkar va Nakirdir.",
  },
  {
    hadith: {
      excerpt:
        "Biror kishi vafot etsa, uning amallari tugaydi, faqat uchtasi: doimiy sadaqa, foyda keltiradigan ilm yoki unga duo qiluvchi solih farzand.",
    },
    context: "Marhumga foyda keltirayotgan narsa sahih hadislarda qayd etilgan.",
  },
  {
    hadith: {
      excerpt:
        "Sizlar yalangoyoq, yalang'och va sunnatsiz holda to'planasizlar va qiyomat kunida birinchi bo'lib kiyinadigan Ibrohimdir.",
    },
    context: "Yig'ilish kunida kamtarlik; Alloh kimni xohlasa, O'zi xoxlaganidek hurmat qiladi.",
  },
  {
    hadith: {
      excerpt:
        "Quyosh qiyomat kuni odamlarga bir chaqirim uzoqlikgacha yaqinlashtiriladi va ular qilgan amallariga yarasha terga botadilar.",
    },
    context: "Mahshar shartlari — sahih rivoyatlarda amallarga qarab jiddiylik farqlanadi.",
  },
  {
    hadith: {
      excerpt:
        "Odamlar mening oldimga keladilar, men Allohga sajda qilaman va: «Boshingni ko'tar! so'rang, sizga beriladi, shafoat qiling va shafoatingiz qabul qilinadi.",
    },
    context: "Eng katta shafoat - Rasululloh sollallohu alayhi vasallamga xos shafoat al-Uzmadir.",
  },
  {
    hadith: {
      excerpt:
        "Kim hisob-kitob qilinsa, halok bo'ladi. Oisha raziyallohu anho so'radilar: Alloh taolo oson hisob bilan hukm qilinadi, demaydimi? U zot: «Bu faqat amallarning taqdimotidir», dedi. Lekin kimning hisobi haqida so'roq qilinsa, halok bo'ladi.",
    },
    context:
      '"Oson hisob" - bu rahm-shafqatdir - odamning qilmishlari ko\'rsatilishi va kechirilishi.',
  },
  {
    hadith: {
      excerpt:
        "Mening ummatimning muflisi namoz, ro‘za va zakot bilan kelgan, lekin boshqalarni haqorat qilgan, tuhmat qilgan va zulm qilgan kishidir, shuning uchun uning yaxshiliklari ularga beriladi va gunohlari unga yuklanadi.",
    },
    context:
      "Odamlarning haq-huquqlari (huquq ul-ibad) shunchaki ibodat bilan bekor qilinmaydi; ular kunida hal qilinishi yoki to'lanishi kerak.",
  },
  {
    hadith: {
      excerpt:
        "Ummatimdan yetmish ming kishi jannatga hisob-kitobsiz kiradilar: o‘zgalardan ruqya so‘ramaydigan, yomon falokatga ishonmaydigan, o‘g‘irlamaydigan va Robbilariga tavakkul qilganlar.",
    },
    context:
      "Ulamolar bu raqamning to'g'ridan-to'g'ri ma'nosi yoki Allohning rahmatining cheksiz ko'pligini bildirishlari haqida ixtilof qiladilar.",
  },
  {
    hadith: {
      excerpt:
        "Mening Hawd bo'ylab bir oylik yo'l. Uning suvi sutdan oppoq, hidi mushkdan shirin, kosalari osmondagi yulduzlardek ko‘p. Kim undan ichsa, hech qachon chanqamaydi.",
    },
    context: "Hovuz — Muhammad sollallohu alayhi vasallam ummatlari uchun tashnalik kunida rahmat.",
  },
  {
    hadith: {
      excerpt:
        "Ko'prik jahannam ustiga o'rnatilgan. Odamlar o'z qilmishlariga ko'ra uni kesib o'tadilar - chaqmoq kabi, shamol kabi, qushlar kabi, yugurayotgan odam kabi - va ba'zilari tirnalib, qutqariladi, ba'zilari esa yiqilib tushadi.",
    },
    context: "O'tish tezligi imon va amallarni aks ettiradi; Allohning rahmati kengdir.",
  },
  {
    hadith: {
      excerpt:
        "O'nta alomatni ko'rmaguningizcha qiyomat qolmaydi: tutun, Dajjol, hayvon, quyoshning g'arbdan chiqishi, Maryam o'g'li Iso, Ya'juj va Ma'jujning tushishi, uchta ko'chki va odamlarni o'z yig'inlariga olib boradigan olov.",
    },
    context:
      "Huzayfa ibn Usayddan o'nta asosiy belgi. Olimlar har bir belgini tasdiqlaydilar, ammo aniq ketma-ketlikda farq qiladilar.",
  },
  {
    hadith: {
      excerpt:
        "Jonim qo'lida bo'lgan Zotga qasamki, yaqinda Maryam o'g'li sizlarning orangizda adolatli hukmdor bo'lib tushadi. u xochni sindiradi, cho'chqani o'ldiradi va jizyani bekor qiladi va uni hech kim qabul qilmaguncha to'lib toshadi.",
    },
    context:
      "Iso alayhissalomning kelib chiqishi sunniy aqidasining mustahkam nuqtasidir; Muhammad sollallohu alayhi vasallamning shariatlari bilan hukm qiladi.",
  },
  {
    hadith: {
      excerpt:
        "Ishonch yo'qolsa, qiyomatni kuting. Undan so'rashdi: Qanday qilib yo'qoladi? U zot dedilar: Qachonki hokimiyat bunga loyiq bo'lmaganlarga berilsa.",
    },
    context:
      "Taniqli kichik belgi - ishonchlilikni yo'qotish. Vahima emas, tayyorgarlikka e'tibor qarating.",
  },
  {
    hadith: {
      excerpt:
        "Alloh ilmni tortib olish bilan emas, balki olimlarni olish bilan olib tashlaydi, toki hech kim qolmagunicha va odamlar ilmsiz hukm chiqaradigan johillarni rahbar qilib olib, ular adashadilar va boshqalarni ham adashtiradilar.",
    },
    context:
      "\"Bilimni yo'qotish\" ma'lumot etishmasligi emas, balki sog'lom olimlar va hayot tajribasini yo'qotishdir.",
  },
];

export const LAST_DAY_VERSES_UZ: DeepPartial<LastDayVerseEntry>[] = [
  {
    excerpt:
      "Har bir jon o'limni tatib ko'r va sizga qiyomat kuni to'liq to'lovlar beriladi. Bas, kim do'zaxdan uzoqlashtirilsa va jannatga kiritilsa, najot topdi.",
    context:
      "O'lim universal va bu hayot vaqtinchalik; to'g'ri va yakuniy hisob-kitob faqat oxirat kuni keladi.",
    tafsirSummary:
      "Oyat muvaffaqiyatni qaytadan belgilaydi: bu yerda boylik yoki mavqe emas, balki do'zaxdan qutulish va u erda jannatga kiritilish.",
  },
  {
    excerpt:
      "O'sha kuni odamlar o'z amallarini ko'rsatish uchun alohida-alohida gurux bo'lib chiqib ketadilar. Kim zarrachalik yaxshilik qilsa, uni ko'radi, kim zarrachalik yomonlik qilsa, uni ko'radi.",
    context:
      "Mukammal va to'liq adolat - eng kichik ish, yaxshi yoki yomon, yozib olinadi va uni bajaruvchiga qaytariladi.",
    tafsirSummary:
      "Hech narsa hisoblash uchun juda kichik emas. Bu oyat “kichik” gunohlardan voz kechishdan bir umrlik ogohlantiruvchi va “kichik” xayrli ishlarga umrbod daldadir.",
  },
  {
    excerpt:
      "Biz qiyomat kuni uchun adolat tarozisini qo'yamiz. Bas, hech bir jonga zulm qilinmas. Garchi u xantal donasi og'irligida bo'lsa ham, Biz uni chiqarurmiz va Biz hisobchi sifatida yetarlimiz.",
    context: "Mizan (tarozi) haqiqiydir va uning adolati mutlaqdir.",
    tafsirSummary:
      "O'sha kunda hech kim bir xantal urug'i og'irligicha o'zgarmasdir. Allohning hisobi xatosizdir.",
  },
  {
    excerpt:
      "Kimning tarozisi og'ir bo'lsa, u rohat hayotda bo'ladi. Kimning tarozisi engil bo'lsa, uning panohi tubsizlikdir.",
    context: "Yakuniy oqibat tarozida qilgan solih amallarining og'irligiga aylanadi.",
    tafsirSummary:
      "Og'irlik katta hajmdan emas, samimiylikdan kelib chiqadi - oddiy zikr aytilishicha, ko'zga ko'ringan faoliyat tog'laridan ustun turadi.",
  },
  {
    excerpt: "Robbingizdan mag'firatga va kengligi osmonlaru yerdek bo'lgan jannatga shoshiling.",
    context:
      "Alloh bilan uchrashishdan oldin yaxshilik va mag'firat sari yugurishga to'g'ridan-to'g'ri amr.",
    tafsirSummary:
      "Jannat tasavvur qilib bo'lmaydigan darajada keng va unga boradigan yo'l - tavba va yaxshi amallarni kechiktirmaslikdir.",
  },
  {
    excerpt: "O'sha kunda yuzlar nurli bo'lib, Parvardigorlariga qarab turur.",
    context:
      "Jannatning eng katta mukofoti hech qanday bog' yoki daryo emas, balki Allohning yuziga qarashdir.",
    tafsirSummary:
      "Ahli sunnat mo'minlar oxiratda Robbilarini Uning ulug'vorligiga yarasha va hech qanday maxluqotga o'xshamasdan ko'rishlarini tasdiqlaydilar.",
  },
  {
    excerpt:
      "Parvardigorlariga kufr keltirganlar uchun esa jahannam azobi va naqadar yomon joy bordir.",
    context: "Do'zax haqiqiy va adolatli oqibat - ramz emas, balki haqiqiy yashash joyidir.",
    tafsirSummary:
      "Ogohlantirish, hali vaqt bor ekan, odamni orqaga qaytarishga qaratilgan rahm-shafqatdir; u Qur'onda doimo ochiq tavba eshigi bilan bog'langan.",
  },
  {
    excerpt:
      "Ayting: Ey o'zlariga zulm qilgan bandalarim, Allohning rahmatidan noumid bo'lmanglar. Albatta, Alloh barcha gunohlarni kechiradi. Albatta, U mag'firatli va rahmli zotdir.",
    context: "Qanchalik katta gunoh bo'lmasin, samimiy tavba eshigi o'limgacha ochiq qoladi.",
    tafsirSummary:
      "Allohning rahmatidan noumid bo'lishning o'zi shaytondandir. mo'min do'zax qo'rquvi bilan Allohning mag'firatiga umid bog'laydi.",
  },
  {
    excerpt:
      "Va qiyomatning kelishini - bunga hech qanday shak-shubha yo'q - va Alloh qabrdagilarni qayta tiriltirishi.",
    context: "Vaqti yashirin bo'lsa ham, tirilish aniqdir.",
    tafsirSummary:
      "Soat haqidagi aniqlik va uning vaqti haqidagi noaniqlik hozirgi zamonda ma'naviy javobgarlikni mustahkamlaydi.",
  },
  {
    excerpt:
      "Kim Uning huzurida faqat Uning iznisiz shafoat qila oladi? U zot ularning oldilaridagini ham, keyingilarini ham biladir.",
    context: "Shafoat (shafoat) haqiqiydir, lekin hech qachon Allohning iznisiz emas.",
    tafsirSummary:
      'Bu yagona shart - "Uning iznisiz" - haqiqiy shafoatni har qanday buzilishdan ajratib turadigan va bu hayotda o\'liklarni chaqirishni taqiqlovchi narsadir.',
  },
  {
    excerpt:
      "Allohni zolimlar qilayotgan amallardan g'ofil deb o'ylamang. U ularni faqat ko'zlar dahshatdan tikilgan kunga kechiktiradi.",
    context: "Mazlumlar uchun tasalli - adolatning kechikishi uning yo'qligi emas.",
    tafsirSummary:
      "Hech bir zulm Alloh tomonidan unutilmas. Zolimga hech narsa ko'rinmaydigan kungacha muhlat beriladi.",
  },
  {
    excerpt:
      "Va sizlardan birortangiz u erga keluvchidan boshqa yo'q. Bu Parvardigoring zimmasidagi farzdir. So'ngra Allohdan taqvo qilganlarga najot berurmiz va unda zolimlarni tiz cho'kib qoldiramiz.",
    context:
      "Sirotdan o'tish universaldir; eson-omon yetib kelish Allohning rahmati va taqvosi bilan berilgan.",
    tafsirSummary:
      "Hamma o'tish joyiga keladi; farq kim najot va kim yiqilib - oldin yuborilgan imon va amallar tomonidan qaror.",
  },
  {
    excerpt:
      "Ular sendan qiyomat soati haqida so'raydilar: qachon keladi? Ayting: «Uning ilmi faqat Robbim huzuridadir. Uning vaqtini Undan boshqa hech kim oshkor qilmas. U sizga faqat kutilmaganda keladi.",
    context: "Aniq vaqt faqat Allohga ma'lum - tayyorgarlik muhim, bashorat befoyda.",
    tafsirSummary:
      "Hatto Rasululloh sollallohu alayhi vasallamga ham xurmo berilmagan. har bir insonning bir yil yoki ortga hisoblash da'vosi bu oyatga zid keladi.",
  },
  {
    excerpt:
      "Kimning kitobi o'ng qo'liga berilgan bo'lsa, u: \"Mana, mening kitobimni o'qing!\" Men hisobimni kutib olishimga amin edim. Shunday qilib, u yoqimli hayotda bo'ladi.",
    context: "Kitobni olish usuli - o'ng yoki chap - bu birinchi hukmdir.",
    tafsirSummary:
      "Muvaffaqiyatlilarning quvonchi - mukofotlangan ishonch quvonchidir: ular hisob-kitobni kutish bilan yashadilar va bu zarba emas, balki yengillik sifatida keladi.",
  },
];

export const LAST_DAY_TIMELINE_UZ: DeepPartial<LastDayTimelineEvent>[] = [
  {
    title: "Bu dunyoda hayot",
    body: "Ishonish, ibodat qilish va tayyorgarlik ko'rish uchun qisqa vaqt. Bu dunyo oxirgi uy emas - bu amallar maydoni.",
  },
  {
    title: "O'lim",
    body: "Har bir jon o'limni tatib ko'r. Mo'min uni Allohning rahmatidan umid bilan kutib oladi; g'ofillik uni to'satdan va achchiq qiladi.",
  },
  {
    title: "Qabr",
    body: "Dafn etilgandan keyin ruh barzaxga kiradi. Qabr har bir inson uchun oxiratning birinchi bosqichidir.",
  },
  {
    title: "Barzax",
    body: "O'lim va tirilish o'rtasidagi hayot - so'roq, saodat yoki haqiqiy xabarlarga ko'ra jazo.",
  },
  {
    title: "Kichik belgilar",
    body: "Rasululloh sollallohu alayhi vasallam ta'riflagan asta-sekin ijtimoiy va axloqiy o'zgarishlar. Ko'pgina olimlarning ta'kidlashicha, bir nechtasi paydo bo'lgan; aniq vaqt faqat Allohga tegishli.",
  },
  {
    title: "Asosiy belgilar",
    body: "Oxir-oqibat dramatik voqealar, jumladan al-Mahdiy, Dajjol va sahih hadisda Iso (alayhissalom)ning qaytishi. Olimlar orasida ketma-ketlik tafsilotlari farqlanadi.",
  },
  {
    title: "Surnay",
    body: "Isrofil sur chaladi. Yaratilish birinchi portlashda o'ladi va ikkinchi portlashda tiriladi.",
  },
  {
    title: "Tirilish",
    body: "Tuproqdan tiklangan jismlar; butun maxluqot Allohning huzurida turadi.",
  },
  {
    title: "Uchrashuv (Mahshar)",
    body: "Hamma odamlar yalangoyoq, yalang'och va sunnatsiz holda yig'ilib, Alloh xohlasa, hukmni kutar edilar.",
  },
  {
    title: "Amallar daftarchasi",
    body: "O'ng qo'lda, chap qo'lda yoki orqada berilgan kitoblar. Yozib olinganlardan hech narsa chetlashtirilmagan.",
  },
  {
    title: "Tarozi (Mizan)",
    body: "Amallar mukammal adolat bilan tarozida. Og'ir tarozilar quvonch keltiradi; engil tarozilar yo'qotishlarni keltirib chiqaradi.",
  },
  {
    title: "Hisobdorlik (Hisab)",
    body: "Ba'zilar uchun oson hisob; boshqalar uchun batafsil so'rov. Odamlarning huquqlari e'tibordan chetda qolmaydi.",
  },
  {
    title: "Shafoat (shafoat)",
    body: "Allohning izni bilan - eng ulug'i Payg'ambarimiz Muhammad sollallohu alayhi vasallamnikidir.",
  },
  {
    title: "Hovuz (Hawd)",
    body: "Payg'ambar sollallohu alayhi vasallam ummatlari qiyomat kuni suv ichadigan keng havza.",
  },
  {
    title: "Ko'prik (Sirot)",
    body: "Har bir inson jahannamdan o'tadi - sahih rivoyatlarda tezlik iymon va amallarga qarab farq qiladi.",
  },
  {
    title: "Jannat yoki do'zax",
    body: "Mangu maskan — Allohning rahmati va solih amallari ila jannat; Jahannam haqiqiy ogohlantirish va adolatli oqibat sifatida.",
  },
  {
    title: "Abadiylik",
    body: "Oxiratdan keyin o'lim yo'q. Jannat ahli saodatda abadiy qoladilar; do'zax ahli Alloh hohlaganidek qoladilar.",
  },
];

export const LAST_DAY_QUIZ_UZ: DeepPartial<LastDayQuizQuestion>[] = [
  {
    prompt: "Oxirat kuniga iymon keltirish quyidagilardan biridir:",
    options: ["Islomning besh ustuni", "Oltita iymon (Iymon)", "Yetti osmon", "O'nta hamroh"],
    explanation:
      "Iymon Allohga, farishtalarga, kitoblarga, payg'ambarlarga, oxirat kuniga va ilohiy hukmga (qadr) ishonishni o'z ichiga oladi.",
  },
  {
    prompt: "Barzax eng yaxshi ta'riflangan:",
    options: [
      "Jahannam ustidagi ko'prik",
      "O'lim va tirilish o'rtasidagi hayot",
      "Amallar ko'lami",
      "Karnay chalindi",
    ],
    explanation: "Barzax - o'limdan keyin qiyomatgacha bo'lgan vaqt.",
  },
  {
    prompt:
      "To'g'ri yoki noto'g'ri: Olimlar qiyomatning barcha asosiy belgilarining aniq ketma-ketligi borasida bir fikrda.",
    options: ["To'g'ri", "Yolg'on"],
    explanation:
      "Asosiy alomatlar sahih hadislarda tasdiqlangan, biroq ulamolar ketma-ketlik tafsilotlari haqida ixtilof qiladilar. Qiyomat vaqti faqat Allohga ayondir.",
  },
  {
    prompt: "Qiyomat kunidagi Mizon (shkalasi) quyidagilarni bildiradi:",
    options: [
      "Jismoniy jismlarni tortish",
      "Amallarni mukammal adolat bilan tortish",
      "Qabrdagi vaqtni o'lchash",
      "Farishtalarni sanash",
    ],
    explanation: "Mizan amallarni tortadi - ixlos va solih amal tarozilarni og'irlashtiradi.",
  },
  {
    prompt: "Qiyomat kunidagi shafoat (shafoat):",
    options: [
      "Allohning iznisiz sodir bo'ladi",
      "Faqat Allohning izni bilan",
      "Imonga bo'lgan ehtiyojni almashtiradi",
      "Qur'onda rad etilgan",
    ],
    explanation: "Qur'on 2:255 va 20:109 faqat Allohning izni bilan shafoat qilishni tasdiqlaydi.",
  },
  {
    prompt: "Oxirat safarida qaysi biri birinchi bo'ladi?",
    options: ["Tirilish", "O'lim", "Yig'ilish", "Surnay"],
    explanation:
      "O'lim barzaxdan oldin, so'ngra - alomatlar va karnaydan keyin - tirilish va yig'ilishdan oldin.",
  },
  {
    prompt:
      "Alloh bilan uchrashishga tayyorgarlik ko'rish uchun bu hafta qaysi odatni kuchaytirasiz?",
    explanation:
      "Tayyorgarlik amaliydir: namoz, Qur'on, tavba, sadaqa, yaxshi xulq va boshqalarning haqlarini bajarish.",
  },
  {
    prompt: "To'g'ri yoki yolg'on: Qur'on 19:71 ga ko'ra, har bir inson Sirotdan o'tadi.",
    options: ["To'g'ri", "Yolg'on"],
    explanation:
      "Oyatda aytilishicha, hamma uning ustidan o'tadi; Alloh tafakkur qiluvchilarni qutqaradi. Olimlar kimning yiqilishi tafsilotlarini muhokama qilishadi.",
  },
];

export const LAST_DAY_REFERENCES_UZ: DeepPartial<LastDayReferenceEntry>[] = [
  {
    title: "Qur'on",
    note: "Tirilish, hisob-kitob, jannat, do'zax va ilohiy adolat uchun asosiy manba. Ushbu moduldagi oyatlar sura va oyat bilan keltiriladi.",
  },
  {
    title: "Sahihi Buxoriy va Sahihi Musulmon",
    note: "O'lim, qabr, oyat-belgilar, hisob, shafoat, Havd va sirot uchun kanonik hadislar to'plami.",
  },
  {
    title: "Sunan at-Termiziy va Sunan Abu Dovud",
    note: "Qabr va kichik belgilar bo'yicha qo'shimcha haqiqiy hisobotlar - tegishli joylarda qayd etilgan baholar.",
  },
  {
    title: "Ibn Kasir — tafsir",
    note: "Qur'on oyatlarining oxirat haqidagi mumtoz sharhi. Mustaqil dalil sifatida emas, qisqa tafsir xulosalari uchun ishlatiladi.",
  },
  {
    title: "Al-Aqida at-Tahoviyya",
    note: "Asosiy sunniy aqidasi tirilish, o'lchov, ko'prik, jannat va do'zaxni tasdiqlovchi.",
  },
  {
    title: "Ilmiy farqlar",
    note: "Olimlar farq qiladigan joyda - masalan. asosiy belgilar ketma-ketligi, Hawd tafsilotlari, toifalar hisob-kitobsiz kirish - bu modul yagona to'g'ri fikr sifatida bir qarashni da'vo qilmasdan farqni qayd etadi.",
  },
  {
    title: "Vahiy va talqin",
    note: "Ochiq Qur'on va mutavotir yoki sahih hadislar tafsir (ijtihod) va zaifroq rivoyatlardan farqlanadi.",
  },
];
