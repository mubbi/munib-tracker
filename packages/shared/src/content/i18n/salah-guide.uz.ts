// Uzbek translation overlay for the Learn Salah guide content. Mirrors the order of
// its English source in ../salah-guide*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type {
  SalahGuidePhrase,
  SalahGuideQuizQuestion,
  SalahGuideTopic,
} from "../../types/salah-guide";
import type { DeepPartial } from "./localize";

export const SALAH_GUIDE_TOPICS_UZ: DeepPartial<SalahGuideTopic>[] = [
  {
    title: "Saloh nima?",
    summary: "Islomning ikkinchi ustuni - sizning har kuni Alloh bilan uchrashuvingiz.",
    body: [
      "Namoz Alloh taoloning har bir mo'min uchun belgilab qo'ygan rasmiy ibodatidir: tik turish (qiyom), ruku (ruku) va sajda (sjud)ning tartibli ketma-ketligi, har kuni belgilangan besh vaqtda o'qiladigan hamd, Qur'on va duoga qo'shilishi. Saloh so'zi arabcha ildizdan kelib chiqqan bo'lib, bog'lanish va iltijo degan ma'noni anglatadi - bu mo'minning Yaratguvchiga to'g'ridan-to'g'ri, vositasiz liniyasi bo'lib, hech qanday ruhoniy va shafoatchiga muhtoj emas.",
      "Namozning to'liq bir ravati, ya'ni ikkinchi sajdaga qadar turib, rakat deyiladi. Namozlar rakatda sanaladi: bomdod ikki, shom uch, peshin, asr va xufton to'rt. Farz namozlariga farz deyiladi; Rasululloh sollallohu alayhi vasallamning muntazam o'qiladigan namozlari sunnat, nafl namozlari esa nafldir.",
      "Ustunlar orasida o'ziga xos jihati shundaki, namoz yerga tushayotgan farishta orqali nozil bo'lmagan, balki Payg'ambarimiz sollallohu alayhi vasallam tungi safarda (al-Isro' va al-me'roj) osmonga ko'tarilganlarida to'g'ridan-to'g'ri farz qilinganlar. Avval ellik vaqt namoz farz qilindi, so'ngra Payg'ambar sollallohu alayhi vasallam ummatlariga qulaylik izlab qayta-qayta qaytib kelishlari bilan beshta namozga kamaytirilib, ellik savob saqlanib qolindi.",
      "Shuning uchun namoz islom hayotining markazida turadi: har kuni besh marta takrorlanadi, u mehnat, dam olish va bo'sh vaqtni to'xtatib, qalbni Allohga qayta bog'laydi va bu bandaning Qiyomat kuni hisob-kitob qilinadigan birinchi amalidir. Agar ovoz topilsa, qolgan yozuvlar unga ergashishga intiladi.",
    ],
    quran: [
      {
        excerpt:
          "Ular g‘aybga iymon keltirurlar, namozni to‘kis ado eturlar va Biz rizq qilib bergan narsalardan infoq qilurlar.",
      },
      {
        excerpt:
          "Kitobdan senga vahiy qilingan narsani tilovat qil va namozni to'kis ado et. Darhaqiqat, namoz fahsh va yomonlikdan saqlaydi va Allohni zikr qilish ulug‘roqdir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Tun safarida Alloh ellik vaqt namozni farz qildi. Rasululloh sollallohu alayhi vasallam ular besh yoshga to'lgunlaricha yengillik so'rab qaytib keldilar: \"Bular besh, bular ellik, chunki Mendagi so'z o'zgarmaydi\". (Shuningdek, Sahih Musulmon 162)",
      },
      {
        excerpt:
          "Qiyomatda bandaning birinchi hisob-kitobi uning namozidir; Agar sog'lom bo'lsa, qolgan amallari ham sodiqdir. (shuningdek, Abu Dovud 864, Nasoiy 3991)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Nega Saloh?",
    summary: "Besh vaqt namozning ma'naviy, axloqiy, ruhiy va abadiy mevalari.",
    body: [
      "Namoz Alloh bilan bevosita suhbatdir. Siz Unga O'zining vahiy so'zlari orqali murojaat qilasiz; sajdada - juda kamtarlik holatida - siz Unga eng yaqinsiz va ijobat bo'lishi mumkin. Boshqa hech qanday ibodat bunchalik tez-tez yoki yaqindan takrorlanmaydi.",
      "Uning birinchi mevasi - vazmin, intizomli ruh. Alloh taoloning O'zi namoz to'g'ri o'rnatilgan bo'lsa, \"fasod va yomonlikdan saqlaydi\" (29:45): Allohning huzurida har kuni besh marta to'g'ridan-to'g'ri tursa, gunohga yaqinlashish qiyinroq bo'lishini aytadi. Bu ham takroriy poklanishdir - Rasululloh sollallohu alayhi vasallam besh vaqt namozni har kuni besh marta cho'miladigan, hech qanday kir qoldirmaydigan oqayotgan daryoga qiyoslaganlar.",
      "Uning ikkinchi mevasi ichki tinchlikdir. Qur'onda qalblar Allohni zikr qilish bilan orom topishiga va'da qilingan va Rasululloh sollallohu alayhi vasallam tashvishli lahzalarida namozga chaqirib: «Bu bilan bizga taskin ber, ey Bilol», der edilar. Namozga qo'yilgan ko'zlari zavqini ta'rifladi.",
      "Uning ijtimoiy va abadiy mevalari manzarani to'ldiradi: jamoat namozi boy va kambag'allarni bir qatorga qo'yib, birodarlikni mustahkamlaydi, namozni qo'riqlash esa Allohning mag'firati va jannatga olib boradigan eng ishonchli yo'llardandir. Rasululloh sollallohu alayhi vasallam bomdod va asrning ikki salqin namozini saqlasa, jannatni va'da qilganlar.",
    ],
    quran: [
      {
        excerpt:
          "Albatta, men Allohman. Mendan o'zga iloh yo'q. Bas, Menga ibodat qil va Meni zikr qilish uchun namozni to'kis ado et.",
      },
      {
        excerpt: "Albatta, mo'minlar, ya'ni namozlarida xokisor bo'lganlar najot topdilar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "— Agar sizlardan biringizning eshigi oldida daryo bo'lsa, u kuniga besh marta cho'milsa, uning ustida kir qolarmidi? Ular: «Yo'q», dedilar. Rasululloh sollallohu alayhi vasallam: «Besh vaqt namozning misoli shuki, Alloh ular bilan gunohlarni o'chiradi», dedilar. (Shuningdek, Sahih Musulmon 667)",
      },
      {
        excerpt: "Kim ikki salqin namozni - bomdod va asr namozini o'qisa, jannatga kiradi.",
      },
      {
        excerpt:
          "Menga dunyongizdan ayollar va xushbo'y atirlar mahbub qilingan va ko'zlarimning sovuqligi ibodatda bo'lgan.",
      },
    ],
    actions: [
      "Bugun faqat bitta namozni o'z vaqtida o'qing - birinchi maqsad mukammallik emas, izchillikdir.",
      "Keyingi namozdan oldin Fotiha surasining ma'nosini bir marta o'qing va sizga javob berilayotganini his qiling.",
      "Namoz oynasi e'tiborsiz o'tib ketmasligi uchun azon eslatmalarini yoqing.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Uning Islomdagi mavqei",
    summary: "Dinning ustuni va e'tibordan chetda qoladigan eng og'ir ish.",
    body: [
      "Rasululloh sollallohu alayhi vasallam Islom besh ustun ustiga qurilgan, namoz esa iymonning ikki guvohligidan so'ng ikkinchi ustun ekanligini o'rgatgan. Guvohlik sizni Islomga qabul qiladi. namoz guvohlik sizning yuragingizda yashashining doimiy dalilidir. Shuning uchun ham ulamolar namozni «dinning ustuni» — markaziy ustuni qulab tushmaydigan uy, deyishadi.",
      "Uning og'irligi matnlarda uni e'tiborsiz qoldirish haqida gapirganda ko'rinadi. Qur'on \"namozni tark etib, havoyi nafsga ergashgan\" avlod haqida ogohlantirib, ularning halokatini bashorat qilgan va Payg'ambarimiz sollallohu alayhi vasallam namozni iymonni kufrdan ajratib turuvchi ahd deb ta'riflaganlar.",
      "Namozni tark etgan kishining hukmi borasida sunniy ulamolar orasida taniqli va hurmatli ixtilof bor. Ba'zilar, uni ataylab butunlay tark etish - bu farz ekanligini tasdiqlagan holda - odamni Islomdan chiqarib yuboradigan katta kufrdir, deb hisoblaydilar. ko'pchilik (Hanafiy, Molikiy, Shofe'iylar) bunday kishi, agar uning farzligini inkor etmasa, eng katta gunohlardan birini qilgan gunohkor musulmon bo'lib qoladi, deb hisoblaydi. Namozni tark etish falokat ekanligiga hamma ijmo bo‘lgan, kimki uning farzligini inkor etsa, ijmo bilan Islomni tark etgan bo‘ladi.",
      "Amaliy saboq har bir qarashda bir xil: besh vaqt namozni qo'riqlash mo'min uchun ixtiyoriy yoki kelishib bo'lmaydi. Keyin nafl namozlar (sunnat va nafl) qiyomat kunidagi farz namozlardagi kamchiliklarni o‘rnini to‘ldirib, xavfsizlik tarmog‘i vazifasini bajaradi.",
    ],
    quran: [
      {
        excerpt:
          "Namozlarni va o'rta namozni ehtiyot qiling va Alloh huzurida toat-ibodat qilib turing.",
      },
      {
        excerpt:
          "Ulardan keyin namozni tark etgan va havoyi nafsga ergashgan o'rinbosarlar keldi. Bas, ular yovuzlikka duch kelishadi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Islom besh asosga qurilgan: Allohdan o'zga iloh yo'qligiga va Muhammad Uning rasuli ekanligiga guvohlik berish, namozni to'kis ado etish, zakot berish, haj qilish va ramazon ro'zasini tutish. (Shuningdek, Sahihi Buxoriy 8)",
      },
      {
        excerpt:
          "Biz bilan ular orasidagi ahd namozdir. Kim uni tark etsa, kufrga kirdi. (Burayda; yana an-Nasoiy, Ibn Moja 1079)",
      },
      {
        excerpt: "Inson bilan kufr va butparastlik o'rtasida namozni tark etish turadi. (Jobir)",
      },
    ],
    disclaimer:
      "Namozni dangasalik (ko‘pchilik uchun katta gunoh; boshqalar uchun kufr) va farzni inkor qiluvchi (ijmo‘ bilan kufr) tufayli namozni tark etganning aniq hukmi borasida ulamolar ixtilof qilganlar. Ushbu ilova biron bir shaxsga nisbatan hukm chiqarmaydi - shaxsiy ishlar uchun malakali olim bilan maslahatlashing.",
  },
  {
    title: "Kim ibodat qilishi kerak?",
    summary:
      "Har bir aqli raso, voyaga yetgan musulmon - aniq belgilangan imtiyozlar va imtiyozlar bilan.",
    body: [
      "Har bir aqli raso va balog'at yoshiga etgan musulmonga namoz farz bo'ladi. Uch guruh javobgarlikdan butunlay sahih tamoyil bilan olib tashlanadi: uxlab yotgan odam uyg'onguncha, bola etuk bo'lgunga qadar va aqli zaif odam sog'lom aql qaytguncha.",
      "Bolalar hali majburiy emas, lekin ular asta-sekin o'qitiladi. Payg'ambar sollallohu alayhi vasallam bolalarni yetti yoshdan namozga buyurib, o'n yoshida uni e'tiborsiz qoldirganliklari uchun muloyimlik bilan tarbiyalashni buyurdilar, shunda balog'at namozi to'satdan paydo bo'ladigan yuk emas, balki o'rnashib qolgan odat bo'lib qoladi.",
      "Hayz ko'rgan yoki tug'ruqdan keyingi qon (nifos) ko'rgan ayollar bu vaqtda namoz o'qimaydilar; keyin o'tkazib yuborilgan farz namozlari qazo qilinmaydi - rahmat va ulamolar kelishilgan hukm. (O'tkazib yuborilgan ro'zalar, namozdan farqli o'laroq, qazo qilinadi.) Ayol qon ketishi tugagach va g'usl bilan poklanganidan keyin namozni qayta o'qiydi.",
      "Haqiqiy qobiliyatsizlik imtiyozga olib keladi, hech qachon bekor bo'lmaydi: og'ir kasallik, behushlik va haddan tashqari qo'rquv odamni bir muncha vaqt kechirishi mumkin va kasallar o'z qobiliyatiga qarab ibodat qilishadi - o'tirish, yolg'on gapirish yoki hatto imo-ishoralar bilan. Sayohat namozni olib tashlamaydi, balki uni qisqartirish (qasr) va murabbo (jam') orqali osonlashtiradi, bu haqda Sayohat qo'llanmasida keltirilgan.",
    ],
    hadith: [
      {
        excerpt:
          "Farzandlaringizni yetti yoshda namoz o‘qishga buyuring, ularni o‘n yoshda namoz o‘qishga buyuring va uxlash joylarini ajrating. (Amr ibn Shuayb otasidan bobosidan)",
      },
    ],
    quran: [
      {
        excerpt: "Va oilangni namozga buyur va unda sabr qil.",
      },
    ],
    appLinks: [{}, {}, {}],
  },
  {
    title: "Namozdan oldingi shartlar",
    summary: "Namozning to'g'ri bo'lishi uchun bo'lishi kerak bo'lgan to'qqizta shart (shurut).",
    body: [
      "Namoz to'g'ri bo'lishidan oldin, ba'zi shartlar (shurut as-namoz) bajarilishi kerak. Shart ustundan farq qiladi: shartlar siz boshlashdan oldin keladigan va davom etadigan shartlardir, ustunlar (arkan) esa namozning o'zidir. Agar zarur shart bo'lmasa, qanchalik yaxshi o'qilsa ham namoz qabul bo'lmaydi.",
      "Ushbu to'qqiztasini parvozdan oldingi nazorat ro'yxati sifatida tasavvur qiling. Ko'pchilik ushbu qo'llanmaning boshqa joylarida to'liqroq darsga ulanadi - har birini chuqur o'rganish uchun bosing. Ulardan ikkitasi (qiblaga qaragan va to'g'ri vaqt) haqiqiy qobiliyatsizlikda uzr bo'lishi mumkin; Qolganlari esa imkoni boricha qat'iy talab qilinadi.",
    ],
    steps: [
      {
        title: "Islom",
        body: "Namoz musulmonning amalidir; Musulmon bo'lmaganlar Islomga kirgunlaricha haqiqiy emas va ularga farz ham emas.",
      },
      {
        title: "Sog'lom aql ('aql)",
        body: "Odam aqlli bo'lishi kerak. Aqlini yo'qotgan kishi o'sha holatda javobgarlikka tortilmaydi.",
      },
      {
        title: "Aql-idrok (tamyiz)",
        body: "Ajratish qobiliyati yetti yoshga yetdi - bu bolalarga ibodat qilishni buyuradigan yoshga.",
      },
      {
        title: "Kichik va katta nopoklikni (hadisdan tahoratni) olib tashlash.",
        body: "To'g'ri tahorat yoki katta najosatdan keyin g'usl yoki suvdan foydalanish mumkin bo'lmaganda tayammum.",
      },
      {
        title: "Nopoklikni yo'qotish (najosa)",
        body: "Badan, kiyim va namoz o'qiladigan joy siydik, miqdoriy qon va boshqa sanab o'tilgan moddalar kabi marosim iflosligidan toza bo'lishi kerak.",
      },
      {
        title: "Avratni yopish",
        body: "Yopilishi kerak bo'lgan qismlar toza, shaffof bo'lmagan kiyim bilan qoplangan - Kiyim va avrat darsiga qarang.",
      },
      {
        title: "Namoz vaqti kirdi",
        body: "Har bir namozning belgilangan oynasi bor; vaqti kirmasdan turib namoz o'qish noto'g'ridir. Jadvalingiz va eslatmalaringizdan foydalaning.",
      },
      {
        title: "Qibla tomonga qarab",
        body: "Ka'ba tomon o'zingiz qaror qilganingizcha yaqinroq burilishingiz - faqat chinakam qobiliyatsizlik uchun uzr.",
      },
      {
        title: "Niyat (niyat)",
        body: "Qaysi namozni o'qimoqchi ekanligingizni qalbda hal qilish. Bu ichki harakat bo'lib, baland ovozda aytilmaydi.",
      },
    ],
    appLinks: [{}, {}, {}],
    disclaimer:
      "Maktablar shartlarni bir oz boshqacha so'zlaydi va hisoblaydi (ba'zilari shartlar emas, balki ustunlar orasida niyohni sanashadi). Mavzu bo'yicha kelishilgan.",
  },
  {
    title: "Poklanish (Tahara)",
    summary: "O'z-o'zini, kiyim-kechak va joyning pokligi - har bir ibodatning eshigi.",
    body: [
      "Tahorat, Allohning huzurida poklik bilan turishingiz uchun marosimdagi nopoklikni ko'tarishdir. Alloh taolo poklanganlarni yaxshi ko'radi va Payg'ambarimiz sollallohu alayhi vasallam: «Poklanish iymonning yarmidir», deb o'rgatganlar. Busiz hech bir duo qabul qilinmaydi.",
      "Nopoklik ikki xil bo'ladi. Hojatxonadan foydalanish yoki shamol o'tkazish kabi narsalardan bo'lgan kichik najosat (hadas asg'ar) tahorat bilan olib tashlanadi. Katta nopokliklar (hadas akbar yoki janabah) - yaqinlik, ajralish yoki hayz va tug'ruqdan keyingi qon ketishdan keyin - to'liq g'usl (g'usl) bilan olib tashlanadi.",
      "Ushbu marosim holatlaridan alohida, siydik, axlat, oqayotgan qon va shunga o'xshash narsalarni tanadan, kiyimdan va namoz o'qiyotgan joydan jismonan olib tashlash kerak. To'g'ri tahorat bo'lishi mumkin, lekin namoz o'qishdan oldin kiyimdagi dog'ni tozalash kerak.",
      "Suv asosiy tozalash vositasidir. Agar suv haqiqatan ham mavjud bo'lmasa yoki kasallik yoki qattiq sovuq tufayli sizga zarar etkazsa, Islom butunlay o'rnini bosuvchi tayammum - toza tuproq yordamida quruq tozalashga ruxsat beradi. Poklanish hech qachon qiyinchilik bo'lmasligi kerak; yaqinlashish vositasidir.",
    ],
    hadith: [
      {
        excerpt: "Poklanish iymonning yarmidir... (Abu Molik al-Ash’ariy).",
      },
    ],
    quran: [
      {
        excerpt: "Albatta, Alloh tavba qiluvchilarni sevadi va poklanganlarni sevadi.",
      },
    ],
    actions: [
      "Keyingi namozdan oldin tahoratni bosqichma-bosqich o'rganing, shunda har bir a'zo to'g'ri yuviladi.",
      "Agar iflos muhitda ishlayotgan bo'lsangiz, namoz uchun toza kiyimni ajratib qo'ying.",
      "To'shakni qo'yishdan oldin, ko'rinadigan ifloslik uchun ibodat joyingizga bir nazar tashlang.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "tahorat — tahorat",
    summary: "Kichkina nopoklikni olib tashlaydigan va namozga tayyorlaydigan farmon yuvinish.",
    body: [
      "Tahorat - bu mayda nopoklikni olib tashlaydigan yuvinish marosimidir. Bu har bir namozdan oldin talab qilinadi, agar siz hali ham avvalgi namozdan to'g'ri bo'lmasangiz, va ko'pchilik ulamolarning fikriga ko'ra - Qur'onning jismoniy matniga tegmasdan oldin. Uning to'rtta farz yuvilishi Qur'onda to'g'ridan-to'g'ri nomlanadi (5:6): yuz, qo'llarni tirsaklargacha, boshga masx qilish va oyoqlarni to'piqlargacha.",
      "Rasululloh sollallohu alayhi vasallam belgilangan tartibda yuvilgan a'zolar uchun uch marta yaxshilab, lekin suvni isrof qilmasdan tahorat oldilar - hatto oqayotgan daryoda ham isrofgarchilikdan ogohlantirdilar. To'rt farzdan tashqari, og'iz va burunni chayish, avval qo'l yuvish, misvok ishlatish tahoratni to'liq va ziynatlovchi sobit sunnatlardir.",
      "Uning ajri juda katta: Payg'ambarimiz sollallohu alayhi vasallam mo'min kishi har bir a'zosini yuvsa, uning qilgan gunohlari suv bilan birga, hatto tirnoq ostidan ham tushib ketishini va u pok bo'lib chiqishini ta'kidlagan. Shuning uchun tahorat shunchaki rasmiyatchilik emas, balki har bir namozdan oldin kichik bir kechirimdir.",
      "Tahorat shaxsiy yo'llardan chiqqan har qanday narsa (siydik, axlat, shamol), ongni yo'qotadigan chuqur uyqu va ongni yo'qotish bilan buziladi. Namoz vaqtida buzilsa, to'xtab, tahoratni yangilab, yana namozni boshlash kerak.",
    ],
    steps: [
      {
        title: "Niyat va Bismilloh",
        body: "Qalbingizda tahoratga niyat qiling va “Bismillah” bilan boshlang. Niyat ichkarida va uni aytish shart emas.",
        tip: "Imkoniyatingiz bo'lsa, misvokni oldindan ishlating - bu Payg'ambar sollallohu alayhi vasallam yaxshi ko'rgan va farz qilgan sunnatdir.",
      },
      {
        title: "Qo'llarni yuving",
        body: "Ikkala qo'lni bilaklargacha uch marta yuving, barmoqlar orasiga suv quying.",
      },
      {
        title: "Og'izni yuving",
        body: "Og'izga suv oling, uni aylantiring va chiqarib tashlang - uch marta.",
      },
      {
        title: "Burunni yuving",
        body: "O'ng qo'l bilan burun teshigiga suv torting va chap bilan - uch marta chiqarib tashlang.",
      },
      {
        title: "Yuzni yuvish (farz)",
        body: "Soch chizig'idan jag'iga va quloqdan quloqqa qadar butun yuzni bir martadan uch marta yuving; bir kishi qalin soqolini ho'l barmoqlarini yuguradi.",
      },
      {
        title: "Qo'llarni yuvish (farz)",
        body: "O'ng qo'lni, so'ngra chapni, barmoq uchidan tirsaklargacha yuving - har biri uch marta.",
      },
      {
        title: "Boshga masxara qilish (farz)",
        body: "Ho'l qo'llar bilan boshni bir marta oldindan orqaga va yana orqaga arting, so'ngra quloqlarning ichki va orqa qismini bir xil nam bilan arting.",
      },
      {
        title: "Oyoqlarni yuvish (farz)",
        body: "O'ng oyoqni, so'ngra chapni, to'piqlarga qadar yuving - har biri uch marta, barmoqlar orasidagi barmoqlarni o'tkazing.",
      },
      {
        title: "Imonning guvohligi",
        body: "“Ashhadu an la ilaha illalloh...” duosi bilan toʻldiring. Kim tahoratdan keyin aytsa, jannatning sakkiz eshigi ochiladi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Agar banda tahoratda yuzini yuvsa, ko‘z bilan qaragan har bir gunohi suv bilan birga chiqib ketadi... to gunohdan pok bo‘lib chiqmaguncha.",
      },
    ],
    quran: [
      {
        excerpt:
          "Ey iymon keltirganlar, namozga tursangiz, yuzlaringizni va bilaklaringizni tirsakgacha yuving, boshingizga masx qiling, oyoqlaringizni to‘pig‘igacha yuving.",
      },
    ],
    actions: [
      "Har bir qadamni ovoz chiqarib o'qiyotganda, tirsaklar va tovonlarni tekshirib, asta-sekin bir marta tahorat oling.",
      "Tahoratdan keyin qisqa duolarni yod oling — qarang: Namoz so'zlari.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tayammum — dry purification",
    summary: "When water cannot be used, clean earth lifts impurity so prayer is not delayed.",
    body: [
      "Tayammum is the dry purification Allah legislated when water is genuinely unavailable, or when using it would cause harm because of illness or severe cold. It is not a lesser workaround for convenience — it is a complete substitute that lifts minor or major impurity for prayer until water can be used again.",
      "The Qur'an names it in the same verse as wudu and ghusl (5:6): wipe the face and hands with clean earth after striking it. The Prophet ﷺ taught the companions this concession as mercy, not as a loophole to skip searching for water when it is reasonably available.",
      "Practically: intend tayammum, say Bismillah, strike clean earth once (or twice according to some schools), wipe the face, then wipe the hands to the wrists (many scholars include up to the elbows in continuity with wudu). What breaks wudu or ghusl also ends the corresponding tayammum; finding usable water ends the concession and you return to ordinary purification.",
      "If you prayed validly with tayammum and only found water afterward, the majority hold that the completed prayer need not be repeated. If water appears before you pray, you must use it. For casts, wounds, and illness, combine wiping over dressings with tayammum as your school and doctor advise — see the full Taharah guide for detail.",
    ],
    steps: [
      {
        title: "Confirm the need",
        body: "Search reasonably for usable water, or confirm that using water would harm you (illness, severe cold, medical advice).",
      },
      {
        title: "Intention & Bismillah",
        body: "Intend tayammum in place of wudu or ghusl, and begin with Bismillah.",
        transliteration: "Bismillah",
      },
      {
        title: "Strike clean earth",
        body: "Strike clean earth (or a clean dusty surface) with both hands once — some schools strike twice.",
      },
      {
        title: "Wipe the face",
        body: "Wipe the entire face with the dust remaining on the hands.",
      },
      {
        title: "Wipe the hands",
        body: "Wipe the hands — at minimum to the wrists; many scholars wipe to the elbows.",
      },
    ],
    quran: [
      {
        excerpt:
          "…and you find no water, then perform tayammum with clean earth and wipe your faces and your hands with it.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Reported in the chapters of tayammum: the concession to purify with clean earth in the absence of usable water.",
      },
    ],
    actions: [
      "Know when tayammum applies before travel or illness so prayer is never skipped for lack of water.",
      "Open the full Taharah tayammum lessons for school differences on striking and wiping.",
    ],
    disclaimer:
      "Schools differ on details (one strike vs two, wrists vs elbows, renewing per prayer). This is a mainstream educational summary — follow reliable local scholarship for your practice.",
  },
  {
    title: "Kiyim va avrat",
    summary: "Qoplanishi kerak bo'lgan narsalarni yoping - toza, kamtarona va hurmat bilan.",
    body: [
      "Avratni, ya'ni tananing yashirin bo'lishi kerak bo'lgan qismlarini yopish - Alloh taoloning \"Har bir namozda ziynatingizni oling\" buyrug'idan kelib chiqqan holda, to'g'ri namozning shartidir (7:31). Kiyim najosatdan toza bo'lishi va terining rangi ko'rinmaydigan darajada shaffof bo'lishi kerak.",
      "Erkaklar uchun namozdagi avrat kamida kindikdan tizzagacha bo'ladi. Biroq kiyim-kechak bo'lsa, ko'kragini yalang'och o'qish makruhdir; Rasululloh sollallohu alayhi vasallam erkak kishi yelkasida bo‘lmagan bir kiyimda namoz o‘qimasligini buyurdilar.",
      "Ayollar uchun ko'pchilik ulamolarning fikricha, namozda yuz va qo'llardan boshqa butun vujudi avratdir; ayol sochini, bo'yni va oyoqlarini, odatda, keng kiyim va ro'mol bilan qoplaydi. Olimlar oyoqlarda farq qiladilar, ba'zilari ularni ko'rsatilishi mumkin bo'lgan narsalarga kiritilgan deb hisoblaydilar - ular bilan namoz o'qish xavfsizroq va ko'pchilik amaliyotidir.",
      "Namoz tashqarisida ham ikkita kiyinish hukmi amal qiladi: ipak va tilla erkaklar uchun harom qilingan (ayollar uchun ruxsat etilgan) va kiyim juda qattiq, shaffof va e'tiborni talab qiladigan darajada bo'lmasligi kerak. Qoidaga ko'ra, tungi kiyim yoki plyaj kiyimida emas, balki o'zingiz hurmat qiladigan odam bilan uchrashish uchun nima kiysangiz, ibodat qiling.",
    ],
    quran: [
      {
        excerpt: "Ey Odam bolalari, har bir namozgohda ziynatingizni oling.",
      },
    ],
    actions: [
      "Har doim tayyor bo'lish uchun bitta toza, kamtarona kiyim yoki maxsus ibodat kiyimini ajratib qo'ying.",
      "Agar biror narsa etarli darajada qoplaganiga ishonchingiz komil bo'lmasa, kamroq emas, balki ko'proq yoping.",
    ],
    disclaimer:
      "Avrat tafsilotlari (ayniqsa, ayolning oyoqlari) hurmatli ilmiy farq nuqtasidir. Siz farq qiladigan ishonchli mahalliy stipendiyalarga rioya qiling.",
  },
  {
    title: "Namoz vaqtlari",
    summary: "Kundalik beshta oyna - har bir namozning boshlanishi, oxiri va afzal vaqti bor.",
    body: [
      "Alloh taolo namozlarni «belgilangan vaqtlarda» (4:103) belgilab, kun va tunni quyosh harakati bilan bog'langan beshta oynaga ajratdi. Deraza ochilishidan oldin namoz o'qish noto'g'ri; Namozni deraza oldida uzrsiz kechiktirish katta gunohdir. Imkon bo'lsa, deraza oldida namozni erta o'qing - Rasululloh sollallohu alayhi vasallam birinchi marta namozni Allohga eng sevimli amallardan deb atadilar.",
      "Beshta darcha: Bomdod, tong otgandan to tong otguncha; Peshin, quyosh zenitdan o'tib, biror narsaning soyasi o'z uzunligiga teng bo'lgunga qadar; Asr, peshin oxiridan to quyosh botguncha (eng yaxshisi quyosh sarg'ayguncha o'qiladi); Shom, quyosh botgandan to qizil qorong'u tushguncha; va Isha, alacakaranlık tushganidan to tong otguncha (yaxshisi yarim tundan oldin ibodat qilingan).",
      "Ibodatni quyoshga sig'inish bilan chalkashtirib yubormaslik uchun uchta qisqa vaqt borki, ularda ixtiyoriy namoz harom bo'ladi: quyosh to'liq chiqqunga qadar, peshin chog'ida to'liq o'z cho'qqisida turganda va to'liq botib ketguncha. Qazo qilingan farz namozini qazo qilish bu taqiqdan mustasnodir.",
      "Soatning aniq vaqtlari sizning kenglik va faslingizga qarab har kuni o'zgarib turadi, shuning uchun Payg'ambar sollallohu alayhi vasallam ularni belgilangan soatga emas, balki tabiiy belgilarga bog'lagan. Ilova ularni joylashuvingiz uchun hisoblab chiqadi - lekin asosiy belgilarni bilish texnologiya mavjud bo'lmaganda sizni asosli qiladi.",
    ],
    steps: [
      {
        title: "Bomdod — 2 rakat farz",
        body: "Quyosh chiqqunga qadar haqiqiy tong. Oldinda kuchli ta'kidlangan 2 rakat sunnat.",
      },
      {
        title: "Peshin — 4 rakat farz",
        body: "Quyosh o'z cho'qqisidan o'tgandan keyin asr soyasigacha. Oldin va keyin 4 ta sunnat.",
      },
      {
        title: "Asr — 4 rakat farz",
        body: "Peshinning oxiridan to quyosh botguncha; quyosh sarg'ayguncha ibodat qiling. Ko'pincha 2:238 ning \"o'rta ibodati\" bilan belgilanadi.",
      },
      {
        title: "Shom — 3 rakat farz",
        body: "Quyosh botgandan to alacakaranlık yo'qolguncha; zudlik bilan ibodat qiling. 2 sunnatdan keyin.",
      },
      {
        title: "Xufton — 4 rakat farz",
        body: "Alacakaranlık so'lishidan to tong otguncha; eng yaxshisi yarim tundan oldin. Keyin Witr.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Payg'ambarimiz sollallohu alayhi vasallam bizlarni namoz o'qishdan qaytargan uch vaqt bor: quyosh chiqquncha to to'xtaguncha, peshin vaqtida turganda va botganda botguncha. (Uqba ibn Omir)",
      },
    ],
    quran: [
      {
        excerpt: "Darhaqiqat, namoz mo'minlarga vaqtlari farz qilindi.",
      },
      {
        excerpt:
          "Kunning ikki chetida va kechasi yaqinida namozni ado et. Darhaqiqat, yaxshi amallar yomonliklarni ketkazadi.",
      },
    ],
    appLinks: [{}, {}],
    disclaimer:
      "Asr boshlanishida ikkita fikr bildirilgan (soya ob'ekt uzunligiga teng yoki ikki marta). Ikkalasi ham amal qiladi; mahalliy hisob-kitob va jamoangizga rioya qiling.",
  },
  {
    title: "Qibla tomonga qarab",
    summary: "Makkadagi Baytul Harom tomon buriling - ummatni birlashtiruvchi yo'nalish.",
    body: [
      "Qibla Makkadagi Masjidul Harom ichidagi Ka'baning yo'nalishidir. Unga yuz tutish to'g'ri namozning shartidir. Islomning ilk davrlarida musulmonlar Quddus tomon ibodat qilishgan; keyin Alloh taolo Masjidul Harom tomon burilishni amrini nozil qildi va o'sha vaqtdan beri dunyoning ibodat qiluvchilarini yagona yo'nalish birlashtirib keldi - bir Robbga yuzlangan bir jamoatning kundalik, jismoniy ifodasi.",
      "Sayohat paytida kompas, masjid mehrobi, ishonchli ilova yoki quyosh va yulduzlar yordamida siz qiblaga aniq qarab turishingiz talab qilinadi. Kichkina, muqarrar og'ish kechiriladi; muhimi, to'g'ri yo'nalish sari sidqidildan harakat qilishdir.",
      "Agar siz haqiqatan ham yo'nalishni aniqlay olmasangiz - dengizda, bulutda, tunda notanish mamlakatda - siz uni ishlab chiqishga intilasiz va keyin eng yaxshi qaroringiz uchun ibodat qilasiz; Namoz keyinroq bir oz o'chirilgan bo'lsa ham to'g'ri bo'ladi. Farz namoz uchun qiblaga yuzlanib o'qish mumkin bo'lmagan harakatlanuvchi mashina yoki samolyotda qo'lingdan kelganicha yuzma-yuz bo'lasan, chunki Alloh taolo jonni o'z kuchidan ortiq yuklamaydi.",
    ],
    quran: [
      {
        excerpt:
          "Bas, yuzingni Masjidul Harom tomonga buring. Qaerda bo'lsangiz ham, yuzlaringizni u tomonga buring.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Namozga tursang, yaxshi tahorat olib, keyin qiblaga yuzlanib, takbir ayt. (yomon namoz o'qigan kishining hadisidan)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Azon - azonga chaqirish",
    summary:
      "Ummatni chaqiruvchi so'zlar, ularning ma'nosi va ularga qanday javob berish kerakligi.",
    body: [
      "Azon - namoz vaqti kirganligini bildiruvchi azon. Besh vaqt namoz (hayit yoki janoza namozi uchun emas) uchun jamoat sunnatidir, shuning uchun jamoat namozga yig'ilishi uchun baland joydan o'qiladi. Undan keyin, namoz boshlanishidan oldin, ikkinchi, qisqaroq chaqiriq - iqomat qilinadi.",
      "Azonni eshitganingizda, har bir iborani muazzindan keyin takrorlash sunnatdir, faqat “Hayya ala as-saloh” va “Hayya al-falah”dan tashqari, “La havla va la quvvata illa billah” (Allohdan boshqa kuch ham, kuch ham yo‘q) deysiz. Bomdod azonida azonchi “As-salotu xayrun min an-navm” (namoz uyqudan afzaldir) deb qo‘shadi.",
      "Azon tugagandan so'ng, Payg'ambar sollallohu alayhi vasallamga salovot ayting, so'ngra Allohdan unga maqtovli mavqeni (al-vasila) berishini so'rab, belgilangan duoni o'qing - Rasululloh sollallohu alayhi vasallam uni aytgan kishiga shafoat qilishlarini va'da qilganlar. Azon va iqomat orasidagi vaqt duo qaytarilmaydigan vaqtdir, shuning uchun duoni erkin o'qing.",
    ],
    steps: [
      {
        title: "Allohu Akbar (×4)",
        body: "Alloh eng buyukdir - sizni chalg'itishi mumkin bo'lgan har qanday narsadan buyukroqdir.",
      },
      {
        title: "Ashhadu an la ilaha illalloh (×2)",
        body: "Allohdan o'zga iloh yo'qligiga guvohlik beraman.",
      },
      {
        title: "Ashhadu anna Muhammadan rosululloh (×2)",
        body: "Guvohlik beramanki, Muhammad Allohning elchisidir.",
      },
      {
        title: "Hayya ala as-saloh (×2)",
        body: "Namozga keling. Javob: La havla va la quvvata illa billah.",
      },
      {
        title: "Hayya ala al-falah (×2)",
        body: "Muvaffaqiyatga keling. Javob: La havla va la quvvata illa billah.",
      },
      {
        title: "Allohu Akbar (×2)",
        body: "Alloh eng buyukdir.",
      },
      {
        title: "La ilaha illalloh",
        body: "Allohdan o'zga iloh yo'q - da'vat o'zi ochilgan so'z bilan yopiladi.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Kimki nidoni eshitib: “Ey, bu komil ato va barkamol namozning Robbisi, Muhammadga vasila va fazilat bergin...” desa, mening shafoatim qiyomat kuni ungadir. (Jobir)",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Bosqichma-bosqich namoz",
    summary: "Rakaatning to'liq ketma-ketligi — har bir o'qilgan ibora, hukmi bilan.",
    body: [
      "Har bir namoz bir takrorlanuvchi rakatdan qurilgan: siz turasiz va o'qiysiz, ruku qilasiz, turasiz, ikki marta sajda qilasiz va (namoz oxirida) tashahhudga o'tirasiz va salom berasiz. Bir rak'atni yaxshi o'rganing va har qanday namozni o'qishingiz mumkin, chunki uzoqroq o'qiladigan namozlar bu birlikni takrorlaydi. Quyidagi qadamlar har bir harakatni tartibda, arab tilida aytilishi kerak bo'lgan aniq so'zlarni ularning ma'nosi bilan va harakatning ustun, talab qilinadigan yoki tavsiya etilganligini ko'rsatadigan kichik tegni beradi.",
      "Ulamolar namozning amallarini uch darajaga ajratadilar. Farz (ustun / rukn) muhim: uni tark eting, hatto xato bo'lsa ham, namoz yoki o'sha rakat o'qilgunga qadar noto'g'ri bo'ladi. Vojib (vojib) vojibdir, lekin uni unutib qo'ysangiz, namozni qayta o'qigandan ko'ra, unutish sajdasi (sujud as-sahv) bilan tuzatasiz. Sunnat tavsiya qilinadi va savob beriladi, usiz namoz to'liq va to'g'ridir. Fiqh maktablari harakatni boshqa toifaga joylashtirganda, maslahatlar buni ta'kidlaydi - bu uch martalik chegaraning o'zi ilmiy farqning klassik sohalaridan biridir.",
      "Butun vaqt davomida hech qachon yo'qolmasligi kerak bo'lgan yagona xususiyat bu tuma'ninah - sukunat: harakat qilishdan oldin har bir holatga to'liq joylashish, oyoq-qo'llar dam olish. Rasululloh sollallohu alayhi vasallam shosha-pisha namoz o‘qigan bir kishini uch marta namoz o‘qishga jo‘natib: “Orqaga qaytib namoz o‘q, chunki namoz o‘qimading”, dedilar. “Ollohu akbar” takbirini aytib turlar orasini siljiting, nigohingizni sajda qilingan joyga qaramang.",
      "Qancha rakat va qaerda o'tirasiz: ikki rak'at namoz (bomdod va juma) bir o'tirishga ega - ikkinchi rakatdan keyin oxirgi tashahhud - keyin salom. Uch rakat namoz (shom) va to‘rt rakat namoz (Pshin, asr, xufton) ikkinchi rakatdan keyin birinchi, qisqaroq tashahhudga o‘tiradi, so‘ngra qolgan rakat(lar)ga turib, ularda faqat Fotiha surasini o‘qib, sura qo‘shmasdan, yana oxirgi tashahhud va salomga o‘tiriladi.",
      "Ovozli yoki ovozsiz: Bomdod, Juma va shom va xuftonning dastlabki ikki rakatlarida Fotiha va sura ovoz chiqarib (jahriy) o‘qiladi; peshin va asrda, shomning uchinchi rakatida, xuftonning uchinchi va to‘rtinchi rakatlarida ovozsiz (sirri) o‘qiladi. Namozning boshqa har bir iborasi — ruku va sujud tasbihi, tashahhud va hokazolar jimgina aytiladi. Namozni yolg'iz o'qiyotgan kishi baland ovozda o'qishi yoki past tutishi mumkin; imomning orqasida turgan ergashuvchi imom baland ovozda qiroat qilayotganda shunchaki tinglaydi.",
      "Ba'zi qo'shimchalar alohida ibodatlar yoki daqiqalarga tegishli. Vitr namozida ko'pchilik oxirgi rakatda qunut o'qiydi - hidoyat va himoya so'rash uchun qo'llarni ko'tarib duo qiladi (ma'lum ibora \"Allohumma-hdini fiman hadayt...\" deb boshlanadi). Qiyin paytlarda farz namozlariga qunut an-nazila qo'shilishi mumkin va maktablar bomdodda turgan kunutda farqlanadi. Agar siz jamoatga kech qo'shsangiz (masbuq), imom bilan nima tutsangiz, hisob bo'ladi va salom berganidan keyin o'tkazib yuborgan rakatlaringizni qazo qilasiz. Agar biror narsani noto'g'ri qo'shsangiz yoki tashlab qo'ysangiz, \"Sujud as-sahv\"ga qarang.",
    ],
    steps: [
      {
        title: "1. Niyat va turish (niyyah va qiyom)",
        body: "Yuzing qiblaga yuzlan, tik tur. Kim qodir bo'lsa, tik turish har bir farz namozning ustunidir. Qaysi namozni o'qimoqchi ekanligingizni qalbingizga joylang; niyat botiniy qaror, ovoz chiqarib aytilgan gap emas.",
        tip: "Ko'zlaringizni sujud qilingan joyga tikib qo'ying. Haqiqatan ham turolmaydigan odam o'tirib namoz o'qiydi, keyin yolg'on gapiradi - namozning o'zi hech qachon to'xtatilmaydi.",
      },
      {
        title: "2. Takbirni ochish (Takbirat ul-Ihrom).",
        body: "Qo'llaringizni yelkaga yoki quloq bo'shlig'iga ko'taring va takbir ayting, so'ngra o'ng qo'lni ko'kragiga chapga qo'ying. Shu bilan namoz boshlanadi va oddiy nutq va harakat endi salomga qadar taqiqlanadi.",
        translation: "Alloh eng buyukdir.",
        tip: "Takbir bilan qo'l ko'tarish (rof'ul-yadayn) ustun emas, tasdiqlangan sunnatdir.",
      },
      {
        title: "3. Ochilish duosi (Istiftoh duosi)",
        body: "Allohning so'zlari oldida qalbni tinchlantirish uchun qisqa duoni ohista o'qing. Bir nechta haqiqiy so'zlar xabar qilinadi; bu eng keng tarqalganlardan biri.",
        translation:
          "Allohim, senga pok va hamdlar bo'lsin. Sening isming muborakdir va ulug'vorligingdir. Sendan o'zga iloh yo'q.",
      },
      {
        title: "4. Taavud va basmala",
        body: "Shaytondan Allohdan panoh so'rang, so'ngra Fotihadan oldin Basmala bilan boshlang. Har ikkisi ham ovoz chiqarib o'qiladigan namozlarda ham jimgina aytiladi.",
        translation:
          "Men la’nati shaytondan Allohdan panoh tilayman. Mehribon va rahmli Alloh nomi bilan.",
      },
      {
        title: "5. “Fotiha” surasini o‘qing",
        body: "Har bir rakatda kitobning ochilishini o'qing - \"Kitobning ochilishini o'qimaganning namozi yo'q\". Imom va yolg‘iz namozxon ovoz chiqarib o‘qiydigan namozda; aks holda u jim o'qiladi.",
        translation:
          "Mehribon va rahmli Alloh nomi bilan. Hamd olamlarning Parvardigori, rahmli, rahmli, qiyomat kunining sohibi Allohga bo'lsin. Senga ibodat qilamiz va Sendan yordam so'raymiz. Bizni to'g'ri yo'lga hidoyat qilgin - O'zing ne'mat bergan zotlar yo'liga, g'azabga uchraganlar yoki adashganlarning yo'liga.",
        tip: "Undan keyin (baland ovoz bilan o'qiydigan namozda) \"Omin\" deng. Hanafiylar toifasi Qur'onni ustun qilib, Fotihani alohida vojib qilib o'qish; ko'pchilik Fotiha surasining o'zi har bir rakatda ustundir.",
      },
      {
        title: "6. Bir sura yoki ba'zi oyatlarni o'qing",
        body: "Faqat dastlabki ikki rakatda Fotiha surasiga qisqa sura yoki bir necha oyat bilan ergashing, masalan, Al-Ixlos surasi («Qul huva Allohu ahad...»). Uchinchi va to‘rtinchi rakatlarda faqat Fotiha surasini o‘qing.",
        tip: "Yolg'iz namozxon va imomga tavsiya etiladi; izdosh tinglaydi. Hanafiylar dastlabki ikki rakatga sura qo'shishni vojib deb biladilar.",
      },
      {
        title: "7. Ruku (ruku)",
        body: "“Allohu akbar” deng va bir tekis orqaga, qoʻllaringizni tizzalaringizni ushlab ruku qilingiz va shoshmasdan Robbingizga uch yoki undan ortiq tasbih ayting.",
        translation: "Ulug‘ Robbim pokdir.",
        tip: "Sukunat bilan tutilgan kamonning o'zi ustundir; unda aytiladigan tasbih sunnatdir (ba'zi maktablarda vojib).",
      },
      {
        title: "8. Rukudan turish (i'tidal)",
        body: "To'liq tik turing - imom va yolg'iz namozxon tasmi' aytadi va hamma tahmid aytadi - va tushishdan oldin butunlay jim turing.",
        translation: "Alloh kimga hamd aytsa, eshitadi. Robbimiz, senga hamd bo'lsin.",
        tip: "To'g'ri va bemalol tik turish ustundir - bu erga joylashguningizcha sujudga botib ketmang.",
      },
      {
        title: "9. Sajda qilish (sujud)",
        body: "“Ollohu akbar” deng va yetti suyakka – peshona bilan burun, ikkala kaft, ikkala tizza va ikki oyoq barmoqlariga sajda qilib, uch marta va undan ortiq tasbih ayting. Bu Alloh taologa eng yaqin holatdir, shuning uchun tasbihdan keyin duo qiling.",
        translation: "Ulug‘ Robbim pokdir.",
        tip: "Bilaklarni erdan ko'tarib, yon tomonlardan uzoqroq tuting, qorinni esa sonlardan uzoqroq tuting.",
      },
      {
        title: "10. Ikki sajda orasida o‘tirish (jalsah)",
        body: "Birinchi sajdadan “Allohu akbar” deb turib, xotirjam va tik o‘tiring va yana sajda qilishdan oldin Parvardigoringizdan mag‘firat so‘rang.",
        translation: "Rabbim, meni kechir.",
        tip: "O'zingizga qulay bo'lguningizcha o'tiring - bu qisqa o'tirish, sukunat bilan, o'ziga xos ustundir.",
      },
      {
        title: "11. Ikkinchi sajda",
        body: "“Allohu akbar” deb ayting va xuddi birinchi sajdaga o'xshab, xuddi shu tasbih va bir xil sukunat bilan ikkinchi marta sajda qiling. Shu bilan bir rakat tamom bo'ladi.",
        translation: "Ulug‘ Robbim pokdir.",
      },
      {
        title: "12. Keyingi rakatga tur",
        body: "“Allohu akbar” deng va turingiz, keyin “Fotiha”dan takrorlang. Uchinchi va to'rtinchi rakatlarda faqat Fotiha surasini qo'shimcha surasiz o'qing.",
        tip: "Ikki rakat namozda ikkinchi rakatdan keyin turmaysiz - oxirgi tashahhudga o'tirasiz.",
      },
      {
        title: "13. Birinchi tashahhud (3 va 4 rakat namozlarda)",
        body: "Shom, peshin, asr yoki xuftonning ikkinchi rakatlaridan keyin oʻtirib “Tahiyyat”ni oʻqing, soʻngra qolgan rakat(lar)ga turing. Ikki rakat namozning birinchi tashahhudi yo'q.",
        translation:
          "Barcha salomlar, duolar va sof so‘zlar Alloh uchundir. Assalomu alaykum, ey payg‘ambar, Allohning rahmati va barakotlari. Bizga va Allohning solih bandalariga salom bo'lsin. Guvohlik beramanki, Allohdan o'zga iloh yo'q va Muhammad Uning quli va rasuli ekanligiga guvohlik beraman.",
        tip: "O'tirishda o'ng ko'rsatkich barmog'ini ko'taring. Agar siz birinchi tashahhudni unutib, tik turishni boshlagan bo'lsangiz, salom berishdan oldin davom eting va sahv sujudini o'tkazing - orqaga o'tirmang.",
      },
      {
        title: "14. Yakuniy tashahhud",
        body: "Har bir namozning oxirgi majlisida yuqorida ko'rsatilgan At-Tahiyotni o'qing. Oxirgi tashahhudga o‘tirish va uni o‘qish namozning ruknidir.",
      },
      {
        title: "15. Payg‘ambar sollallohu alayhi vasallamga salovot ayting.",
        body: "Yakuniy at-Tahiyyatdan keyin Payg'ambar sollallohu alayhi vasallamga sahobalariga o'rgatgan so'zlari bilan salovot ayting.",
        translation:
          "Allohim, Ibrohimga va Ibrohimning oilasiga baraka berganingdek, Muhammadga va Muhammadning oilasiga salovotlar yubor. Albatta, Sen maqtovga sazovor va ulug' zotsan. Allohim, Ibrohimga va Ibrohimning oilasiga ne'mat berganingdek, Muhammadga va Muhammadning oilasiga marhamat qil. Albatta, Sen maqtovga sazovor va ulug' zotsan.",
        tip: "Shofe'iy va Hanbaliy mazhabi oxirgi majlisda salovot o'qishni farz deb biladi.",
      },
      {
        title: "16. Salomdan oldin duo qiling",
        body: "Tugatishdan oldin to'rtta fitnadan Allohdan panoh so'rang - so'ngra dunyo va oxirat uchun xohlagan duoni arab tilida yoki o'z tilingizda qiling.",
        translation:
          "Allohim, men Sendan qabr azobidan, do'zax azobidan, hayot va o'lim fitnasidan va Soxta Masih (Dajjol) fitnasining yomonligidan panoh so'rayman.",
      },
      {
        title: "17. Yakunlovchi salom (Taslim)",
        body: "Namozni har safar salom berib, yuzni o'ngga, so'ngra chapga burish bilan yakunlang. Salom bilan namoz tamom bo'ladi.",
        translation: "Assalomu alaykum va rahmatullohi alayh.",
        tip: "Birinchi taslim (o'ngda) ustundir; ikkinchisi (chapda) ba'zi maktablarda sunnatdir.",
      },
    ],
    hadith: [
      {
        excerpt: "Meni namoz o‘qiyotganimni ko‘rganingizdek namoz o‘qing. (Molik ibn al-Huvayris)",
      },
      {
        excerpt:
          "“Orqaga qaytib namoz o‘qing, chunki namoz o‘qimagansiz”, deb uch marta takrorlab, so‘ng: takbir ayt, Qur’ondan qo‘lingdan kelganicha o‘q, so‘ng o‘zingga qulay bo‘lguncha ruku qil, tik turguncha sajda qil... (Yomon namoz o‘qigan kishi; Yana Sahih Musulmon 397).",
      },
      {
        excerpt:
          "Kitobning ochilishini o'qimaganning namozi yo'q. (Uboda ibn as-Somit; Yana Sahihi Musulmon 394)",
      },
    ],
    appLinks: [
      {},
      {
        label: "Ovoz chiqarib va ichida o‘qish",
      },
      {},
      {},
      {},
    ],
  },
  {
    title: "Ovoz chiqarib va ichida o‘qish",
    summary:
      "Imom qaysi rakatlarda ovoz chiqarib, qaysilarida ichida o‘qiydi va siz uning ortida yoki yolg‘iz namozda nima qilasiz.",
    body: [
      "Eng ko‘p beriladigan savollardan biri — yangi musulmonlar uchun ham, umr bo‘yi namoz o‘qiganlar uchun ham — ikki tamoyilni tushunganda osonlashadi: ayrim namozlar ovoz chiqarib (jahriy), ayrimlari esa ichida (sirriy) o‘qiladi. Payg‘ambar ﷺ ikkala usulda ham namoz o‘qiganlar, sahobalar bu tartibni rivoyat qilganlar va u asosiy hadis to‘plamlarida sobitdir.",
      "Har bir namozning dastlabki ikki rakati «uzun rakatlar»dir: Fotiha, so‘ng yana bir sura yoki oyatlar o‘qiladi. Uch yoki to‘rt rakatli namozlarning qolgan rakatlarida Payg‘ambar ﷺ odatda faqat Fotihani o‘qiganlar. Shuning uchun shom va xuftonda ovozli qiroat ikkinchi rakatdan keyin tugaydi, peshin va asr esa boshidan oxirigacha ichida o‘qiladi.",
      "Alloh ayrim namozlarning nega ovozli, boshqalarining esa ichida o‘qilishini ochiq bayon qilmagan. Ulamolar hikmatlarni zikr qiladilar — tungi namozlarga ovozli qiroat mosligi, kunduzgi mashg‘ulotlar va namozlarni bir-biridan ajratish — ammo musulmonlar bu tartibga sunnat bo‘lgani uchun amal qiladilar. Alloh aytadi: «Albatta, sizlar uchun Allohning Rasulida go‘zal namuna bordir» (33:21).",
      "Imom ortida ovozli namozda Qur’on qiroat qilinayotganda tinglash va boshqa surani ovoz chiqarib o‘qimaslik borasida ittifoq bor. Imom o‘qiyotganda Fotihani ichida o‘qish esa to‘rt mazhab orasidagi mashhur ixtiloflardan biridir — barchasi e’tiborli qarashlardir. Ichida o‘qiladigan namozlarda imom ham ichida o‘qiydi va har bir namozxon mazhabiga ko‘ra o‘zi uchun qiroat qiladi.",
      "Yolg‘iz namoz o‘qisangiz: har rakatda Fotihani, dastlabki ikki rakatda esa qo‘shimcha surani o‘qing; keyingi rakatlarda faqat Fotiha o‘qiladi. Ovozli namozlarda yolg‘iz kishi uchun eshitilarli ovozda o‘qish mustahab, ammo ichida o‘qisa ham namozi sahihdir.",
    ],
    steps: [
      {
        title: "Bomdod — ikki rakat ham ovozli",
        body: "Imom ikkala rakatda ovoz chiqarib o‘qiydi. Uning ortida tinglang va boshqa surani ovoz chiqarib o‘qimang. Fotiha masalasi uchun mazhablar haqidagi qadamga qarang.",
      },
      {
        title: "Peshin — to‘rt rakat ham ichida",
        body: "Imom har rakatda ichida o‘qiydi. Uning ortida mazhabingizga ko‘ra Fotiha va surani o‘zingiz uchun ichingizda o‘qing.",
      },
      {
        title: "Asr — to‘rt rakat ham ichida",
        body: "Peshin kabi — imom to‘liq ichida o‘qiydi; har bir namozxon uning ortida ichida qiroat qiladi.",
      },
      {
        title: "Shom — avval ovozli, so‘ng ichida",
        body: "Birinchi va ikkinchi rakat ovozli, uchinchi rakat ichida o‘qiladi. Imom ortida dastlabki ikkitasini tinglang; uchinchisida mazhabingizga ko‘ra o‘zingiz o‘qing.",
      },
      {
        title: "Xufton — avval ovozli, so‘ng ichida",
        body: "Birinchi va ikkinchi rakat ovozli, uchinchi va to‘rtinchi rakat ichida o‘qiladi. Dastlabki ikkitasida tinglang; keyingi ikkitasida o‘zingiz uchun o‘qing.",
      },
      {
        title: "Nega faqat dastlabki ikki rakat?",
        body: "Abu Qatoda rivoyat qilganlar: Payg‘ambar ﷺ peshin va asrning dastlabki ikki rakatida Fotiha va surani, keyingi ikki rakatida esa faqat Fotihani o‘qiganlar. Bu uzun va qisqa rakatlar tuzilishini tushuntiradi.",
      },
      {
        title: "Ovozli qiroatda imom ortida — ittifoq",
        body: "Qur’on ovoz chiqarib o‘qilganda tinglang. Imom bilan bellashmang va uning ustidan ovoz chiqarib sura o‘qimang. Alloh aytadi: «Qur’on qiroat qilinganda, unga quloq soling va jim turing, shoyad rahm qilinsangiz» (7:204).",
      },
      {
        title: "Imom ortida Fotiha — to‘rt mazhab",
        body: "Hanafiylar: ovozli qiroatda Fotiha o‘qilmaydi, tinglanadi. Molikiylar: odatda ovozli qiroatda tinglanadi. Shofi’iylar: har rakatda, hatto imom ortida ham Fotiha o‘qiladi. Hanbaliylarda ikki rivoyat bor; ko‘plari imkon topilganda o‘qishni mustahab deydilar. Bularning barchasi e’tiborli sunniy mazhablardir.",
        tip: "Ishonchli ustozdan o‘rgangan mazhabingiz ko‘rsatmasiga amal qiling. Hech bir mazhab imomning ovozli qiroati ustidan surani ovoz chiqarib o‘qishga ruxsat bermaydi.",
      },
      {
        title: "Ichida o‘qiladigan namozda imom ortida",
        body: "Hanafiylar (mu’tamad): Fotiha o‘qimasdan ichida sano va zikr aytiladi — imomning qiroati kifoya. Molikiylar: yengil zikr, holatga qarab farqlanadi. Shofi’iylar va hanbaliylar: har rakatda Fotihani ichida o‘qiydi.",
      },
      {
        title: "Yolg‘iz namoz o‘qish",
        body: "O‘qiladigan matn o‘zgarmaydi — faqat ovoz balandligi o‘zgaradi. Har rakatda Fotiha; dastlabki ikkitasida qo‘shimcha sura; keyingilarida faqat Fotiha. Bomdod, shom va xuftonda ovoz chiqarib o‘qish mustahab; peshin va asr ichida o‘qiladi.",
      },
    ],
    quran: [
      {
        excerpt: "Albatta, sizlar uchun Allohning Rasulida go‘zal namuna bordir.",
      },
      {
        excerpt:
          "Qur’on qiroat qilinganda, unga quloq soling va jim turing, shoyad rahm qilinsangiz.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Payg‘ambar ﷺ peshin va asrning dastlabki ikki rakatida Fotiha va surani, keyingi ikki rakatida esa faqat Fotihani o‘qiganlar. (Abu Qatoda; Sahih Muslim 451)",
      },
      {
        excerpt:
          "Fotiha surasini o‘qimagan kishining namozi yo‘q. (Uboda ibn Somit; Sahih Muslim 394)",
      },
      {
        excerpt:
          "U zot peshin va asrning dastlabki ikki rakatida uzunroq, keyingi ikki rakatida esa qisqaroq qiroat qilayotganlarini sezdirardilar. (Abu Qatoda)",
      },
    ],
    actions: [
      "Keyingi jamoat namozingizda imom qaysi rakatlarda ovoz chiqarib o‘qishiga e’tibor bering.",
      "Mazhabingizdagi ustozdan so‘rang: ovozli qiroatda imom ortida Fotihani o‘qiysizmi?",
      "Yolg‘iz namoz o‘qiganda, ovozli qiroat sunnatini his qilish uchun bomdodda ovoz chiqarib o‘qib ko‘ring.",
    ],
    appLinks: [
      {
        label: "Namoz bosqichma-bosqich",
      },
      {
        label: "Jamoat namozi",
      },
      {
        label: "So‘zlar va ma’nolar",
      },
    ],
    disclaimer:
      "To‘rt mazhab ovozli va ichida o‘qiladigan namozlarda imom ortida Fotihani o‘qish masalasida farqlanadi. Bu dars har bir mazhab qarashini birini yagona to‘g‘ri deb e’lon qilmasdan bayon qiladi. Mazhabingiz tafsilotlarini malakali ustozdan o‘rganing.",
  },
  {
    title: "Har bir pozitsiya",
    summary: "Namozning har bir pozitsiyasida tanangizni qanday qilib to'g'ri ushlab turish kerak.",
    body: [
      "Namozdagi har bir holatning Rasululloh sollallohu alayhi vasallam ko'rsatgan va sahobalari saqlab qolgan tana shakli bor. To'g'ri shaklni o'rganish ibodatingizni umumiy jismoniy xatolardan himoya qiladi va tanani undan chalg'itmasdan, yurakning kamtarligini qo'llab-quvvatlashga yordam beradi.",
      "Sajdaning yaqinligi alohida e'tiborga loyiqdir: Rasululloh sollallohu alayhi vasallam: «Bandaning Parvardigoriga eng yaqin keladigani sajda qilgan paytidir, shuning uchun ko'p duo qiling», dedilar. Sukunat va ixlos bilan qilingan sajda mo'minlar davridagi eng kuchli lahzalardandir.",
    ],
    steps: [
      {
        title: "Tik (qiyom)",
        body: "Tik, oyoqlari taxminan yelka kengligida, vazni muvozanatli, sujud joyiga qara, o'ng qo'l ko'kragida chap.",
      },
      {
        title: "Qo'llarni ko'tarish (rof' al-yadayn)",
        body: "Kaftlar qiblaga qaragan holda, yelkalar yoki quloq chig'anoqlari bilan bir tekisda - ochilish takbirida va (ko'pchilik tomonidan) rukuga kirish va undan ko'tarilish.",
      },
      {
        title: "Ruku (ruku)",
        body: "Orqa tekis va tekis, bosh ko'tarilmaydi yoki cho'kmaydi, barmoqlar tizzalarni ushlaydi, qo'llar yon tomonlardan uzoqda.",
      },
      {
        title: "Sajda (sujud)",
        body: "Peshona va burun yerda, kaftlar yelkaga yoki quloqqa yaqin, tirsaklar ko‘tarilgan va erdan, tizzalar pastga, oyoq barmoqlari qiblaga bukilgan.",
      },
      {
        title: "O'tirish (iftirash)",
        body: "Ikki sajda orasida va birinchi tashahhudda: o'ng oyoqni tik qo'ygan holda chap oyoqqa, qo'llarni sonlarga qo'yib o'tirish.",
      },
      {
        title: "Yakuniy majlis (tavarruk)",
        body: "3 yoki 4 rakat namozning oxirgi tashahhudida (shofeiy va hanbaliy mazhabining sunnatlaridan): chap oyoqni o‘ng oyoq ostidan o‘tkazib, yerga o‘tirish.",
      },
      {
        title: "Salom uchun boshni burish (taslim)",
        body: "Yuzni to'liq o'ngga, so'ngra chapga, tinchlik so'zlari bilan aylantiring - har bir yelkada farishtalarga salom berganingizda, namozni tugating.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bandaning Parvardigoriga eng yaqin keladigani sajda qilgan paytidir. Bas, ko‘p duo qiling. (Abu Hurayra)",
      },
    ],
    disclaimer:
      "Qo'llarni joylashtirish, o'tirish va qo'llarni ko'tarishdagi kichik farqlar haqiqiy hisobotlarga asoslangan; maktablarning har biri to'g'ri rivoyatga amal qiladi. Hech kim birovning namozini buzmaydi.",
  },
  {
    title: "Umumiy xatolar",
    summary: "Namozni jimgina zaiflashtiradigan xatolar - va har birini qanday tuzatish kerak.",
    body: [
      "Namozdagi xatolarning aksariyati qalb gunohlari emas, balki shoshqaloqlik va e'tiborsizlik odatlaridir. Ularni nomlash ularni tuzatish uchun birinchi qadamdir; Rasululloh sollallohu alayhi vasallamning o'zlari sahobaning namozini sabr bilan va to'g'ridan-to'g'ri to'g'rilaganlar, bu bizga bu xatolar keng tarqalgan va tuzatilishi mumkinligini o'rgatadi.",
      "Eng qabr shoshib - sukunatsiz ruku va sjud o'qiyapti. Tumaninah (sokinlik) ko'pchilik ulamolar uchun namozning ustunidir, shuning uchun shoshilinch namoz nafaqat nomukammal, balki noto'g'ri bo'lishi mumkin. Bir vaqtning o'zida bitta odat bo'yicha quyidagi ro'yxatni ko'rib chiqing.",
    ],
    steps: [
      {
        title: "Juda tez namoz o'qish",
        body: "Ruku yoki sujudda zo'rg'a to'xtash. Tanangiz qotib qolguncha turing va shoshilmasdan kamida uch marta zikr aytishingiz mumkin.",
      },
      {
        title: "To'liq bo'lmagan tahorat",
        body: "To'piqlarda, to'piqlarda, tirsaklarda yoki barmoqlar orasidagi quruq yamoqlar. Rasululloh sollallohu alayhi vasallam: «Do'zaxdan tovonlarga voy!» deb ogohlantirdilar. Sekin va yaxshilab yuvib tashlang.",
      },
      {
        title: "Rukuda orqaga egilib, sujudda cho'kib",
        body: "Dumaloq orqa bilan ta'zim qilish yoki peshonani burunsiz qo'yish yoki bilaklarni erga tekis qilib qo'yish. Orqa darajani va tirsaklarni ko'tarib turing.",
      },
      {
        title: "Adashgan ko'zlar va yurak",
        body: "Atrofga qarash yoki telefonni tekshirish. Nazoratni sujud qilingan joyga qaratib, sukunat qiling yoki takbirdan oldin telefoningizni olib tashlang.",
      },
      {
        title: "Imomdan oldinda poyga",
        body: "Jamoat bilan, imomdan oldin ruku yoki sujudga o'tish. Unga ergashing - hech qachon undan oldin bo'lmang - faqat undan keyin harakatlaning.",
      },
      {
        title: "Gapirish, ovqatlanish yoki kulish",
        body: "Qasddan qilingan har qanday nutq, yeb-ichish, ovozli kulish namozni buzadi. Namoz yolg'iz Alloh bilan suhbatdir.",
      },
      {
        title: "Fotiha surasini noto'g'ri o'qish",
        body: "So'zlarni o'tkazib yuborish yoki ma'noni o'zgartiradigan xatolar qilish. Uni mukammal harf bilan o'rganing - butun ibodat unga bog'liq.",
      },
    ],
    actions: [
      "Bugun bir namozni odatdagi tezligingizning yarmida o'qing va u qanchalik boshqacha ekanligini ko'ring.",
      "Ochilish takbirini aytishdan oldin telefoningizni o'chiring yoki boshqa xonada qoldiring.",
      "Biror bilimdondan ibodatlaringizdan birini ko'rishini va o'z holatingizni tuzatishini so'rang.",
    ],
    appLinks: [{}],
  },
  {
    title: "Sunnat amallari",
    summary:
      "Nabiy sollallohu alayhi vasallam namozni ziynatlaydigan va savobini ziyoda qiladigan amallarni tavsiya qilganlar.",
    body: [
      "Rasululloh sollallohu alayhi vasallam farzlardan tashqari, namoz atrofida ko'plab tavsiya etilgan amallarni (sunanlarni) namuna qilib olganlar. Ular shart emas, shuning uchun birini tark etish namozni buzmaydi, lekin har biri sizni Allohga yaqinlashtiradi, qo'shimcha savob oladi va farz namozlaridagi kamchiliklarni tuzatadi.",
      "Ularning eng asosiysi farzdan oldin va keyin o'qiladigan muntazam sunnat namozlari (sunan ravotib). Har bir ixtiyoriy namoz bir xil vaznga ega emas: olimlar sunnat muakkadani (ta'kidlangan, Payg'ambar s. Farqni bilish har kuni nimaga e'tibor berish kerakligini aniqlashga yordam beradi.",
      "Eng kuchli dalilga ega bo'lgan eng aniq kun tartibi o'n ikki ravotibdir: bomdoddan oldin ikkita, peshindan oldin to'rtta, peshindan keyin ikkita, shomdan keyin ikkita va xuftondan keyin ikki rakaat - savobi jannatda qurilgan uydir. Dalillar bilan namozning to'liq tavsifi uchun Namoz darsining turlariga qarang.",
    ],
    actions: [
      "Misvokni tahorat va namozdan oldin qo'llang - Rasululloh sollallohu alayhi vasallam buni farz qilishlariga sal qoldi.",
      "Masjidga xotirjam va erta boring - har bir qadam martabani oshiradi va gunohni o'chiradi.",
      "Jannatdagi va'da qilingan uy uchun o'n ikki rakat sunnat ravobini qo'riqla.",
      "Masjidga o'ng oyoq bilan kiring va chap oyoq bilan chiqing, har birining duosi bor.",
      "Har bir namozdan keyin belgilangan azorni o'qing - Namozdan keyin qarang.",
    ],
    hadith: [
      {
        excerpt:
          "Agar ummatimga og‘irlik qilmaganimda, har namozdan oldin misvok ishlatishni buyurgan bo‘lardim. (Abu Hurayra; shuningdek Sahih Muslim 252)",
      },
      {
        excerpt:
          "Rasululloh sollallohu alayhi vasallam bomdod namozidan oldin ikki rakat namozni hech qachon tark etmasdilar. (Oisha; shuningdek Sahih Muslim 724)",
      },
      {
        excerpt:
          "Kim kechasi va kunduzi o'n ikki rakat namoz o'qisa, Alloh unga jannatda bir uy quradi - bomdoddan oldin ikkita, peshindan oldin to'rtta, peshindan keyin ikkita, shomdan keyin ikkita va xuftondan keyin ikkita. (Ummu Habiba)",
      },
    ],
    appLinks: [
      {
        label: "Namoz turlari - ravotib qo'llanma",
      },
      {
        label: "Sunnat va namozdan keyingi zikr",
      },
      {
        label: "Masjid duolari",
      },
    ],
  },
  {
    title: "Xushu - yurakning mavjudligi",
    summary: "Butun sayohatdan maqsad: Allohni ko'rgandek ibodat qilish.",
    body: [
      "Xushu - bu kamtarlik, diqqatni jamlash va siz haqiqatan ham Alloh oldida turganligingizni anglashdir. Bu ibodatning jismoniy harakatlarini haqiqiy ibodatga aylantiradigan narsadir. Rasululloh sollallohu alayhi vasallam ehsonni “Allohga go‘yo Uni ko‘rayotgandek ibodat qilish, chunki sen Uni ko‘rmasang ham, U seni albatta ko‘rib turuvchidir”, deb ta’riflaganlar va bu namozdan ko‘ra to‘g‘ridan-to‘g‘ri amalga oshirilmaydi.",
      "Alloh taolo u bilan muvaffaqiyatli mo‘minlarning ta’rifini ochdi: “Ular namozlarida tavozelidirlar” (23:1–2). Va uning teskarisi — «namoz o'qiganlarga voy bo'lsin, lekin ularning namozidan g'ofil» — qalblari g'oyib bo'lgan holda tanalari qimirlaydiganlarga tanbeh bo'lishidan qattiq ogohlantirdi.",
      "Xushu qurilgan, orzu qilingan emas. O'qiyotganingizning ma'nosini bilib oling, shunda so'zlar sizni harakatga keltiradi. Takbirdan oldin chalg'itadigan narsalarni olib tashlang. Sekinlashtiring va har bir holatga o'z jimligini bering. Siz murojaat qilayotgan Zotning buyukligi va bu ibodat sizning oxirgi bo'lishi mumkinligi haqida o'ylab ko'ring. Rasululloh sollallohu alayhi vasallam tavsiya qilganidek, har bir namozni vidolashuv namozi sifatida o'qing.",
      "Adashgan fikrlardan tushkunlikka tushmang - hatto sahobalar ham ular bilan kurashgan. E'tiboringizni qayta-qayta qaytarish uchun kurashning o'zi ibodatning bir qismidir. Xushu umr bo'yi o'sadi; izchillik uni tarbiyalaydi.",
    ],
    quran: [
      {
        excerpt: "Albatta, mo'minlar, ya'ni namozlarida xokisor bo'lganlar najot topdilar.",
      },
      {
        excerpt: "Bas, namoz o'qiydiganlarning holiga voy, ularning namozidan g'ofil bo'lganlar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Ehson Allohga go‘yo Uni ko‘rayotgandek ibodat qilishdir, chunki siz Uni ko‘rmasangiz ham, U sizni ko‘rib turuvchidir. (Jibril, Umar hadislari)",
      },
    ],
    actions: [
      "Bu hafta har bir namozdan oldin Namoz so'zlaridan bitta iboraning ma'nosini o'qing.",
      "Harakat qilishdan oldin har bir holatda uch soniya davomida to'xtab turing.",
      "Namozdan keyin jurnalda e'tibor darajasiga e'tibor bering va naqsh o'zgarishini kuzating.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ustunlar va bekor qiluvchilar",
    summary: "Namoz nimasiz mavjud bo'lolmaydi - va uni nima bekor qiladi.",
    body: [
      "Namozlar uch darajaga bo'linadi. Ustunlar (arkan) muhim qismlardandir: birovni qasddan tark qilish namozni buzadi, birovni unutib qoldirish esa unga qaytish bilan tuzatilishi kerak. Farz amallar (vojibat) kerak, lekin unutilsa, unutish sajdasi bilan tuzatiladi (sujud as-sahv). Sunnat amallar namozni to'liq va go'zal qiladi va ularni tark etishning hech qanday jazosi yo'q.",
      "Ushbu ierarxiyani bilish sizni ikkita ekstremal holatdan himoya qiladi: kichik e'tiborsizlikni halokatli deb hisoblash yoki haqiqiy ustunni ixtiyoriy deb hisoblash. Ustun haqida shak-shubhada bo‘lsa, namoz to‘la bo‘lmagunicha sahih bo‘lmaydi.",
      "Alohida-alohida, ba'zi narsalar sodir bo'lgan paytda namozni bekor qiladi - chunki ular namozning o'ziga ziddir. Boshqalar esa tahoratni buzadi, bu esa namozni tugatadi. Ikkalasidan ehtiyot bo'ling, shunda siz hech qachon noto'g'ri holatda namoz o'qimaysiz.",
    ],
    steps: [
      {
        title: "Ustunlar (arkan)",
        body: "Imkoniyati bo'lsa tik turish, takbir ochish, Fotiha o'qish, ruku qilish, undan turish, ikki sajda qilish, ularning orasiga o'tirish, oxirgi o'tirish, tashahhud, salom, tuma'ninah, har birida to'g'ri tartibni saqlash.",
      },
      {
        title: "Farz amallar (vojibat)",
        body: "Masalan, boshqa takbirlar, ruku va sujuddagi zikr so'zlari va birinchi tashahhud unutilsa, sahv sujudi bilan tuzatiladi (hanbaliy tafsilotiga ko'ra; maktablar turlicha).",
      },
      {
        title: "Tahoratni buzuvchilar",
        body: "Old yoki orqa yo'llardan chiqadigan har qanday narsa, chuqur uyqu, ongni yo'qotish - va ba'zi olimlar tomonidan to'g'ridan-to'g'ri shaxsiy qismlarga tegishi. Bularning har biri namozni tugatadi.",
      },
      {
        title: "Namozni bekor qiluvchilar",
        body: "Qasddan so'zlash, qasddan yeb-ichish, ko'p uzluksiz keraksiz harakatlar, ovoz chiqarib kulish, ko'krakni qibladan ataylab burish va avratni ochish.",
      },
    ],
    appLinks: [{}],
    disclaimer:
      "To'rt mazhab ba'zi amallarni turlicha tasniflaydi - masalan, birinchi tashahhud vojibmi yoki sunnatmi yoki sujudi sahvni talab qiladigan narsalarning aniq ro'yxati. Maktabingizning tafsilotlarini malakali o'qituvchidan bilib oling.",
  },
  {
    title: "Sujud as-Sahv - xatolarni tuzatish",
    summary: "Namozda sirni tuzatuvchi unutish sajdasi.",
    body: [
      "Namozda unutish hech kimdan holi emas - hatto Payg'ambarimiz (s.a.v.) ham unutib qo'yib, keyin: «Men ham siz kabi bir insonman. Siz unutganingizdek men ham unutaman, agar unutsam, menga eslating. Uning misolidan o'rnatilgan dori paydo bo'ladi: \"Sujud as-sahv\" (unutish sajdasi) deb ataladigan ikkita qo'shimcha sajda, namozni takrorlamaslik uchun kichik xatolarni tuzatadi.",
      "U uchta keng holatda chaqiriladi: qo'shimcha (qo'shimcha rakat namoz o'qish yoki noto'g'ri holatda turish), tark qilish (birinchi tashahhud kabi vojibni qoldirish) yoki shubha (nech rakat namoz o'qiganligingizni bilmaslik). Bu sunnatni tark qilish uchun ham, ataylab qilingan xatolar uchun ham kerak emas - ularning o'z hukmlari bor.",
      "Agar chinakam shubhangiz bo'lsa, asosiy qoida: shubhani tark eting, ishonchingiz komil bo'lgan narsaga (kichikroq raqam) asoslang, namozni to'liq o'qing va keyin ikki sajda qiling. Bu chalkashlikni tashvishli taxminga emas, balki qaror qilingan, to'g'ri ibodatga aylantiradi.",
      "Amaliy: xuddi odatdagi sujudingiz kabi ikki sajda qiling, avval va keyin takbir, so'ngra salom. Ulamolar xato turiga qarab salomdan oldin yoki keyin kelishi borasida ixtilof qilganlar - har ikkisi ham sahih rivoyat qilingan, shuning uchun ikkalasi ham maqbuldir va namozni buzmaydi.",
    ],
    hadith: [
      {
        excerpt:
          "Agar sizlardan biringiz namozida ishonchsiz bo'lsa va qancha namoz o'qiganini bilmasa - uch yoki to'rtta - shak-shubhani tashlab, ishonchi komil bo'lgan narsaga asoslanib, so'ngra ikki marta salomga sajda qilsin. (Abu Said al-Xudriy)",
      },
      {
        excerpt:
          "Agar sizlardan biringiz namozida shak-shubhaga uchrasa, to'g'ri va to'liqligini izlasin, so'ngra salom berib, ikki marta sajda qilsin. (Ibn Mas'ud; Yana Sahih Musulmon 572)",
      },
    ],
    actions: [
      "Shubha uchun qoidani yodlang: kichikroq songa asoslang, tugating, keyin ikki marta sajda qiling.",
      "Namoz o'rtasida birinchi tashahhudni tark etganingizni tushunsangiz, davom eting va oxirida sahv sujud qiling.",
    ],
    appLinks: [{}],
    disclaimer:
      "Ikki sajdaning salomdan oldin yoki keyin tushishi xatoga bog'liq bo'lib, mazhablar turlicha. Ikkalasi ham sunnatdandir; Bu erda noaniqlik sizni ibodat qilishdan to'xtatib qo'ymasin.",
  },
  {
    title: "Namoz turlari",
    summary:
      "Farz, sunnat muakkada, sunnat g'ayri muakkada, vitr va umumiy nafl — har biri uchun sahih dalillar bilan.",
    body: [
      "Ibodatlar majburiyat bilan baholanadi. Besh vaqt namoz o'qish farzdir - har bir hisobdor musulmon uchun qattiq farz. Ularning atrofida Payg'ambarimiz sollallohu alayhi vasallam Ollohga yaqinroq bo'lgan ixtiyoriy namozning boy dunyosi joylashganki, bu orqali biz ham qila olamiz.",
      "To'g'ri o'rganish uchun to'rtta ixtiyoriy toifani ajratib ko'rsating: Muakkada sunnasi (Rasululloh sollallohu alayhi vasallam ta'kidlangan ravotib kamdan-kam hollarda qoldirgan), sunnat g'ayri muakkada (tavsiya etilgan, lekin kamroq ta'kidlangan), vitr (hanafiylar buni vojib deb hisoblagani uchun o'z toifasida saqlanadi) va umumiy sunnatni nafs deb hisoblaydilar. (belgilangan, shubhasiz hisobsiz ixtiyoriy ibodatlar). Agar ulamolar ma'lum miqdorda ixtilof qilgan bo'lsa, masalan, shom namozidan keyin olti rak'at, avvobin namozi kabi - biz ixtilofli sanoqni sobit sunnat deb hisoblamasdan, umumiy da'vatni keltiramiz.",
      "Nafl namozlari ikki sababga ko'ra ahamiyatlidir: mo'minning martabasini ko'taradigan sevimli amallar va farz namozlarini tuzatadilar, chunki farzdagi har qanday kamchilik qiyomat kuni insonning nafl namozidan tugallanadi.",
      "Quyidagi o'n ikki ravotib kunlik sunnatlarning eng aniq jadvali bo'lib, eng kuchli ijmo'dir. Namozni o'rganish markazidagi rak'atlar jadvali bu o'n ikki ta'kidlangan rak'atlarni kuzatib boradi; Naflni asrdan oldin, shomdan oldin yoki xuftondan keyin ixtiyoriy nafl dalil mavjud bo'lgan joyda rag'batlantiriladi, lekin bu sobit hisobga kiritilmaydi.",
    ],
    steps: [
      {
        title: "Besh kunlik farz",
        body: "Bomdod, peshin, asr, shom, xufton - farz poydevor, hech qachon tark etilmaydi.",
      },
      {
        title: "Bomdod - 2 oldin (sunnat muakkada)",
        body: "Bomdod farzidan oldin ikki rakat sunnat muakkadadir - Payg'ambarimiz sollallohu alayhi vasallam ularni hech qachon e'tiborsiz qoldirmadilar. Bomdoddan keyin sahih muntazam sunnat yo'q; Odatda bomdoddan keyin quyosh chiqqunga qadar nafl namoz o‘qish taqiqlanadi.",
      },
      {
        title: "Peshin - 4 oldin va keyin 2 (sunnat muakkada)",
        body: "Peshindan oldin to'rt rakat va undan keyin ikki rakat namoz o'n ikki ravotib (sunnat muakkada)dandir. Ummu Habiba roziyallohu anhuning xabar berishicha, kim peshindan oldin to'rt va undan keyin to'rt namoz o'qisa, Alloh uni do'zaxdan qaytaradi, shuning uchun ikki ravotibdan keyin qo'shimcha ikki rakat o'qish nafl tavsiya qilinadi va ba'zi ulamolar jami olti namozdan oldin ikkita qo'shimcha o'qishni tavsiya qiladilar.",
      },
      {
        title: "Asr - 4 oldin (sunnat g'ayri muakkada)",
        body: "Asrdan oldin to'rt rakat o'qish keng tavsiya etilgan (sunnat g'ayri muakkada). Asrdan keyin sahih muntazam sunnat yo'q; Asrdan keyin quyosh botguncha nafl namoz o'qish taqiqlanadi.",
      },
      {
        title: "Shom - 2 oldin va 2 keyin",
        body: "Shom namozidan keyin ikki rakat namoz muakkada (o'n ikki ravotibning bir qismi) sunnatdir. Rasululloh sollallohu alayhi vasallam shomdan oldin ikki marta “Shomdan oldin namoz o‘qing” dedilar, so‘ng “kim xohlasalar uchun” deb qo‘shib qo‘ydilar, shuning uchun oldingi ikkitasi nafl nafldir, sobit ravotib emas. Shom namozidan keyin umumiy nafl namozni o'qish tavsiya qilinadi, ammo olti rakat namozning avvobin namozi ekanligining sahihligi ixtilof qilinadi; sobit oltitani sunnat sifatida ko'rsatma.",
      },
      {
        title: "Isha - 2 keyin va ixtiyoriy oldin",
        body: "Xuftondan keyin ikki rakat namoz muakkada (o'n ikki ravotibning bir qismi) sunnatdir. Xuftondan oldin “Har ikki azon orasida namoz bor” hadisi sharifda azon va iqomat oʻrtasida ikki yoki toʻrt rakat oʻqish joiz, yaʼni ravotib sunnat emas, umumiy nafl. Xuftondan keyin qo'shimcha ixtiyoriy namoz o'qish joizdir, lekin hech bir sahih sobit sunnatda odatdagi ravotibdan tashqari ikkita qo'shimcha namoz belgilanmagan.",
      },
      {
        title: "Vitr - alohida toifa",
        body: "Vitr namozi xuftondan keyin toq sonda o'qiladi (1, 3, 5, 7, 9, 11...). Ko'p sonli sahih hadis amr va uni rag'batlantirish. Hanafiylar buni vojib deb bilishadi; ko'pchilik buni sunnat muakkada deb biladi. Uning shariiy hukmidagi fikr xilma-xilligi sababli o'n ikki ravotibdan alohida saqlanadi.",
      },
      {
        title: "O'n ikki ravotib - kelishilgan jadval",
        body: "Bomdoddan oldin: 2. Peshindan oldin: 4. Peshindan keyin: 2. Shomdan keyin: 2. Xuftondan keyin: 2. Jami: 12 rakat. Kim ularni muntazam ravishda namoz o'qisa, Alloh taolo jannatda uy quradi.",
      },
      {
        title: "Tavsiya etilgan nafl - sobit ravotib emas",
        body: "Asrdan oldin: 4 (hasan). Shomdan oldin: 2 ta ixtiyoriy (sahih). Xuftondan oldin: azon va iqomat orasida 2 yoki 4 (sahih). Peshindan oldin qo'shimcha: 2 ta tavsiya. Peshindan keyingi ortiqcha: 2 (hasan/sahih). Shom va xuftondan keyin: umumiy nafl rag'batlantiriladi - bahsli sobit hisobsiz.",
      },
      {
        title: "Tahajjud (qiyom al-layl)",
        body: "Kechaning oxirgi uchdan birida tungi namoz - eng yaxshi ixtiyoriy ibodat va solihlarning odati.",
      },
      {
        title: "Duha",
        body: "Bomdod namozi (2-8 rakat) - har bir bo'g'im uchun har kuni to'lanadigan sadaqa.",
      },
      {
        title: "Tarovih",
        body: "Ramazonning jamoat bilan kechasi namozi - muborak oyning kechalarini jonlantirish.",
      },
      {
        title: "Ikki hayit",
        body: "Ikki rakat Ramazon hayiti va Qurbon hayiti, so‘ng xutba o‘qiladi.",
      },
      {
        title: "Istixora",
        body: "Qaror qabul qilishdan oldin Allohdan hidoyat so‘rab ikki rakat namoz.",
      },
      {
        title: "Janoza",
        body: "Janoza namozi — ruku va sujudsiz, tik turgan holda o'qiladigan jamoat farzi (farzi kifoya).",
      },
    ],
    hadith: [
      {
        excerpt:
          "Rasululloh sollallohu alayhi vasallam bomdod namozidan oldin ikki rakat namozni hech qachon tark etmasdilar. (Oisha; shuningdek Sahih Muslim 724)",
      },
      {
        excerpt:
          "Kim kechasi va kunduzi o'n ikki rakat namoz o'qisa, Alloh unga jannatda bir uy quradi - bomdoddan oldin ikkita, peshindan oldin to'rtta, peshindan keyin ikkita, shomdan keyin ikkita va xuftondan keyin ikkita. (Ummu Habiba)",
      },
      {
        excerpt:
          "Kim peshindan oldin to'rt rakat va keyin to'rt rakat namoz o'qisa, Alloh uni do'zaxdan qaytaradi. (Ummu Habiba; ko‘p olimlar tomonidan sahih deb baholangan)",
      },
      {
        excerpt: "Asrdan oldin to'rt rakat namoz o'qigan kishini Alloh rahmatiga olsin.",
      },
      {
        excerpt:
          "Shomdan oldin namoz o'qing, shomdan oldin namoz o'qing, keyin aytdilar: kim xohlasa. (Ibn Umar)",
      },
      {
        excerpt:
          "Har ikki azon (azon va iqomat) orasida namoz bor. (Anas ibn Molik; shuningdek Sahih Muslim 838)",
      },
      {
        excerpt:
          "Vitr farz (haq), kim hohlasa besh namoz o'qisin, kim xohlasa uch namoz o'qisin, kim xohlasa bir namoz o'qisin. (Ibn Umar)",
      },
      {
        excerpt: "Farz namozlaridan keyingi eng afzal namoz xuftondir. (Abu Hurayra)",
      },
      {
        excerpt:
          "Men uni yaxshi ko'rmagunimcha bandam ixtiyoriy amallar bilan Menga yaqinlashadi. (Hadis Qudsiy)",
      },
    ],
    actions: [
      "O'n ikki ravotibdan boshlang - ixtiyoriy naflni qo'shishdan oldin odat hosil qiling.",
      "Har bir farz atrofidagi ta'kidlangan sunnatni kuzatish uchun ushbu markazdagi rak'atlar jadvalidan foydalaning.",
      "Quyidagi dalillar kartalarini o'qing va qayta ko'rib chiqmoqchi bo'lgan hadisni belgilang.",
    ],
    appLinks: [
      {
        label: "Sunnat amallari",
      },
      {
        label: "Tahajjud yo'riqnomasi",
      },
      {
        label: "Rakatlar stoli",
      },
    ],
    disclaimer:
      "Vitrning shariiy hukmi (vojib va sunnat muakkada), xuftondan oldingi nafl rakatlarning aniq sanasi va shomdan keyin avvobin namozlarining aniq soni ilmiy ixtilof masalasidir. Ushbu darsda faqat haqiqiy matn asosiga ega bo'lgan narsalar ko'rsatilgan va u mavjud bo'lgan joyda kelishmovchiliklar qayd etilgan.",
  },
  {
    title: "Juma - juma namozi",
    summary: "Jamiyatni to'playdigan va juma kuni peshin o'rnini bosadigan haftalik majburiyat.",
    body: [
      "Juma har juma peshindan keyin jamoat bilan o‘qiladigan namoz bo‘lib, Qur’oni Karimda “Juma kuni namozga azon aytilsa, Allohning zikriga shoshilinglar va savdo-sotiqni tark etinglar” deb buyurilgan alohida farzdir. U ikki qismdan iborat xutba va undan keyin imomning orqasida ovoz chiqarib o'qiladigan ikki rakat namozdan iborat bo'lib, peshin o'rnini egallaydi.",
      "Bu har bir ozod, voyaga yetgan, muqim va qodir musulmon kishining shaxsiy farzidir. Rasululloh sollallohu alayhi vasallam: «Jamoatdagi har bir musulmon zimmasidagi farzdir, faqat to'rt kishidan boshqasi: qul, ayol, bola yoki kasal bo'lgan kishi», dedilar. Ayollar, yo'lovchilar va kasallar uzrli bo'lib, o'rniga peshin namozini o'qiydilar, lekin agar xohlasalar, qatnashishlari mumkin.",
      "Unga e'tibor bermaslik katta xavfdir: Rasululloh sollallohu alayhi vasallam ogohlantirganlarki, kim g'aflatda uch jumani tark qilsa, Alloh uning qalbini muhrlab qo'yadi. Ammo uning savoblari ham birdek buyukdir - Juma kuni quyosh chiqadigan eng yaxshi kundir va duo ijobat bo'ladigan bir soatni o'tkazadi.",
      "Unga Payg‘ambarimiz sollallohu alayhi vasallam kabi hozir bo‘linglar: g‘usl qilinglar, eng yaxshi pokiza kiyimlaringizni kiyinglar, xushbo‘y hid suringlar, erta boringlar va jim bo‘lib xutbani diqqat bilan tinglanglar (uning vaqtida behuda gaplar savobni zoe qiladi). Juma kuni Kahf surasini o‘qish ikki juma o‘rtasida nur olib keladi.",
    ],
    quran: [
      {
        excerpt:
          "Ey iymon keltirganlar, qachon juma kuni azon aytilsa, Allohni zikr qilishga shoshiling va savdo-sotiqni qoldiring. Agar bilsangiz, bu sizlar uchun yaxshiroqdir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Juma namozini jamoat bilan o'qish har bir musulmonga farzdir, faqat to'rt kishidan tashqari: qul, ayol, bola yoki kasal. (Toriq ibn Shihob)",
      },
      {
        excerpt:
          "Kim g'aflatda uch juma namozini tark qilsa, Alloh uning qalbiga muhr bosadi. (Abu al-Jad; yana Abu Dovud 1052, at-Termiziy 500)",
      },
      {
        excerpt:
          "Juma kuni g'usl qilish balog'atga etgan har bir kishiga farzdir. (Abu Said al-Xudriy)",
      },
    ],
    actions: [
      "G'usl qiling, toza kiyim va xushbo'y hid kiying va erta keling - eng erta kelganlar eng katta savobga ega bo'ladilar.",
      "Ikki juma o'rtasida nur bo'lishi uchun Juma kunida Kahf surasini o'qing.",
      "Xutba o'qiyotganda to'liq jim va diqqatli bo'ling; telefonni uzoqroq tuting.",
    ],
    appLinks: [{}],
    disclaimer:
      "Ishtirokchilarning eng kam soni va g'usl farzmi yoki kuchli sunnatmi, ilmlar farqi bor. Mahalliy hamjamiyatingizning ishonchli amaliyotiga amal qiling.",
  },
  {
    title: "Jamoat namozi",
    summary: "Imom ortida namoz o'qish - savob yigirma yetti marta ko'payadi.",
    body: [
      "Besh vaqt namozni jamoat (jamoat) bilan o'qish, ayniqsa, erkaklar uchun qattiq ta'kidlangan va tirik musulmon jamiyatining o'ziga xos belgisidir. Rasululloh sollallohu alayhi vasallam jamoat bilan o'qiladigan namoz yolg'iz o'qilgan namozdan yigirma yetti baravar ko'p savob bo'lishini, har bir kishining sa'y-harakati bilan tenglasha olmasligini ta'kidlaganlar.",
      "Jamoat to'g'ri, bo'shliqsiz qatorlarda, yelkama-elka, imomga aniq ergashib turadi: siz har bir harakatni faqat u qilgandan keyin boshlaysiz, hech qachon undan oldin va hech qachon aynan bir lahzada. Satrlarni to'g'rilashning o'zi namozni to'ldirishning bir qismidir.",
      "Agar siz imom boshlanganidan keyin kelsangiz (kech kelgan kishi masbuq deb ataladi), uni topsangiz, darhol qo'shiling - bu qism hali ham u bilan namoz o'qigan hisoblanadi. Oxirgi salom berganida, turib, o'tkazib yuborgan rakatlaringizni o'zingiz to'ldiring, so'ngra tugating.",
      "Jamoat faqat masjidda emas: ikki kishi birga namoz o'qisa, jamoat tuzadi, shuning uchun ota bolasi bilan yoki ikki do'sti safarda bo'lsa, uning savobiga erishadi. Ayollar jamoat bilan namoz o'qishlari va tegishli sharoit mavjud bo'lgan masjidga borishlari mumkin, ammo uyda namoz o'qishlari ham katta savobga ega.",
    ],
    hadith: [
      {
        excerpt:
          "Jamoat bilan o'qilgan namoz yolg'iz o'qilgan namozdan yigirma yetti daraja afzaldir. (Ibn Umar; Yana Sahihi Musulmon 650).",
      },
    ],
    quran: [
      {
        excerpt: "Va namozni ado eting, zakot bering va ruku qiluvchilar bilan birga ruku qiling.",
      },
    ],
    actions: [
      "Bugun masjidda hech bo'lmaganda bir marta namoz o'qing yoki uy ahlini uyda to'plang.",
      "Kechikkan bo'lsa nima qilish kerakligini bilib oling: birdaniga qo'shiling, so'ng imom salomidan keyin o'tkazib yuborilgan rakatlaringizni to'ldiring.",
    ],
  },
  {
    title: "Qazo namozlari",
    summary: "O'tkazib yuborilgan narsalarni to'ldirish - Allohning rahmat eshigi ochiq qoladi.",
    body: [
      "Agar farz namozi ko‘p uxlash, unutish yoki (Alloh asrasin) beparvolik tufayli o‘tkazib yuborilgan bo‘lsa, farz shunchaki yo‘qolmaydi. Qazo qilish kerak va Payg'ambarimiz sollallohu alayhi vasallam: «Kimki bir namozni unutib qo'ysa yoki uxlab qolsa, uning kafforati eslaganda o'qishidir», dedilar. Buning uchun duo qilishdan boshqa fidya yo'q.",
      "Qazo namozi asli bilan bir xil shaklda o'qiladi: to'rt rakat o'tkazib yuborilgan peshin namozi kechasi yoki safarda bo'lsa ham to'rt rakat qilib o'qiladi. Uzr tufayli namozni o'tkazib yuborgan kishi (chuqur uyqu kabi) kechikishi uchun gunoh qilmaydi. ularni ataylab tark etgan kishi, ularni chin dildan, shoshilinch tavba qilish bilan birga to'ldirishi kerak.",
      "Ulamolar qazolarni yig'ib qo'ymasdan, iloji bo'lsa, darhol va tartib bilan qazo qilishni tavsiya qiladilar - chunki vaqt va kechikish bilan yuk og'irlashadi. Agar ko'p son yillar davomida o'tkazib yuborilgan bo'lsa, unga umidsizlikdan ko'ra real kunlik reja bilan yondashing; Allohning qaytish eshigi doimo ochiq.",
    ],
    hadith: [
      {
        excerpt:
          "Kimki bir namozni unutib qo'ysa yoki uxlab qolsa, uning kafforati esga tushganda o'qishdir. (Anas; Yana Sahih Musulmon 684)",
      },
    ],
    actions: [
      "Qancha ibodat qilish kerakligini aniq hisoblang va kundalik bo'yanish uchun haqiqiy maqsadni belgilang.",
      "Har bir farz namozni bitta qazo namozi bilan qoplang.",
      "Hech qachon eski namozni qazo qilish uchun kechiktirmang - bugungi namozni o'z vaqtida o'qing.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Namozdan keyin",
    summary: "Har bir namozning savobini muhrlab qo'yuvchi azor va duolar.",
    body: [
      "Rasululloh sollallohu alayhi vasallam namozdan to'satdan turmasdilar. U o‘tirgan joyida Allohdan mag‘firat so‘rab, zikr bilan mashg‘ul bo‘lar va farz namozdan keyingi vaqt duo eng oson ijobat bo‘ladigan vaqtlardan biri ekanligini o‘rgatgan. Darhol tark etish ibodatning eng katta samarasini yo'qotadi.",
      'Namozdan keyin o\'rnatilgan tartib oddiy va salmoqlidir: uch marta "Astag\'firulloh" deyish; keyin tavhid va hamd so‘zlari; So\'ngra o\'ttiz uch martadan "Subhanalloh", "Alhamdulillah" va "Allohu Akbar" so\'zlarini o\'qib, yuzinchi qismini "La ilaha illalloh..." bilan muhrlab qo\'yadi.',
      "Har bir farz namozdan keyin Oyatul-Kursiy surasini o'qish, Payg'ambarimiz sollallohu alayhi vasallam va'da qilganidek, inson va jannat o'rtasida faqat o'limni olib tashlaydi. Unga uchta Qul (Ixlos, Al-Falaq, An-Nos) bilan amal qiling va ular qo'llaniladigan joyda bomdoddan keyin bomdodni, asr yoki shomdan keyin kechki zikrni qo'shing.",
    ],
    hadith: [
      {
        excerpt:
          "Kim har namozdan keyin o‘ttiz uch marta Allohga tasbeh aytsa, hamd aytsa va ulug‘lasa... va yuztasini tavhid kalimalari bilan to‘ldirsa, uning gunohlari dengiz ko‘pikidek bo‘lsa ham mag‘firat qilinadi. (Abu Hurayra)",
      },
      {
        excerpt:
          "Kim har bir farz namozdan keyin Oyatul Kursiyni o‘qisa, u bilan jannatga kirish o‘rtasida o‘limdan boshqa narsa turmaydi. (Abu Umoma; al-Alboniy sahih deb baholagan)",
      },
    ],
    actions: [
      "Bu hafta namozdan keyingi tasbihni (33/33/33+tahlil) yod oling.",
      "Turishdan oldin Oyatul Kursiy va uchta Qulni o‘qing.",
      "Har bir farz namozidan keyin bir daqiqa shaxsiy duoga o'tiring.",
    ],
    appLinks: [{}, {}],
  },
];

export const SALAH_GUIDE_PHRASES_UZ: DeepPartial<SalahGuidePhrase>[] = [
  {
    title: "Tahorat olgach",
    when: "Darhol tahorat olgach, namoz oldidan.",
    translation:
      "Guvohlik beramanki, yolg'iz Allohdan o'zga iloh yo'q, sherigi yo'q va guvohlik beramanki, Muhammad Uning quli va rasulidir.",
    meaning:
      "Sizning tanangiz yangi poklangan paytda imon guvohligini yangilang. Rasululloh sollallohu alayhi vasallam kim tahoratdan keyin bu gapni aytsa, unga jannatning sakkiz eshigi ochilib, xohlagan joyidan kirishiga va'da berdilar.",
  },
  {
    title: "Takbirat al-Ihrom",
    when: "Namozning boshida va pozitsiyalar o'rtasida harakatlanayotganda.",
    translation: "Alloh eng buyukdir.",
    meaning:
      "Namoz shu yerdan boshlanadi — “al-ehrom” bu dunyo ishlarini (gapirish, ovqatlanish, yuz o'girish) sizga harom qilish demakdir. Siz Allohni sizni chalg'itadigan har qanday narsadan buyukroq deb e'lon qilasiz va Uning huzuriga to'liq qadam qo'yasiz. Unga ergashgan har bir takbir o'sha taslimni yangilaydi.",
  },
  {
    title: "Duo al-Istifto (ochuvchi duo)",
    when: "Ochilgan takbirdan keyin, Fotihadan oldin jim.",
    translation:
      "Allohim, senga pok va hamdlar bo'lsin. Sening isming muborakdir va ulug'vorligingdir. Sendan o'zga iloh yo'q.",
    meaning:
      "Suhbatni Allohga tasbih va hamd aytish va Uning birligini tasdiqlash, kalimalarini tilovat qilishdan avval o‘rgatish bilan ochasiz. Bir nechta haqiqiy ochilish iltijolari mavjud - bu eng ko'p ishlatiladiganlardan biridir.",
  },
  {
    title: "Fotiha surasi",
    when: "Har bir rakatda turish - ustun bo'lmasa, rakat noto'g'ri bo'ladi.",
    translation:
      "Mehribon va rahmli Alloh nomi bilan. Hamd olamlarning Parvardigori, rahmli, rahmli, qiyomat kunining sohibi Allohga bo'lsin. Senga ibodat qilamiz va Sendan yordam so'raymiz. Bizni to'g'ri yo'lga hidoyat qilgin - O'zing ne'mat bergan zotlar yo'liga, g'azabga uchraganlar yoki adashganlarning yo'liga.",
    meaning:
      "\"Kitobning onasi\": yarmi Allohga hamd va yarmi hidoyat uchun duo, \"Biz Senga ibodat qilamiz\" ular o'rtasida bo'g'in qilib. Alloh taolo bu surani O'zi va bandasi o'rtasida bo'lib qo'yganini aytdi - har bir satrni o'qisangiz, U javob beradi. Rasululloh sollallohu alayhi vasallam aytdilarki, uni o'qimagan kishiga namoz yo'q.",
  },
  {
    title: "Rukuda zikr",
    when: "Ta'zim paytida, bir tekis bilan, orqa o'rnashib.",
    translation: "Ulug‘ Robbim pokdir.",
    meaning:
      "Ruku - ehtirom holatidir, shuning uchun siz Allohning ulug'vorligini tasbeh qilasiz, - dedi uch yoki undan ko'p marta shoshilmasdan. Rasululloh sollallohu alayhi vasallam rukuda Rabbimizni ulug'laymiz, duoing ijobat bo'lishini umid qil, dedilar.",
  },
  {
    title: "Rukudan ko'tarilish",
    when: "Taʼzimdan keyin toʻliq tik turish.",
    translation: "Alloh kimga hamd aytsa, eshitadi. Robbimiz, senga hamd bo'lsin.",
    meaning:
      "Alloh taolo O'ziga hamd aytayotganni chindan ham eshitishini tasdiqlaysiz, so'ngra hamma hamdni Unga qaytaring. Rasululloh sollallohu alayhi vasallam aytdilarki, imom shunday desa va odamlar javob bersa, kimning so‘zi farishtalarnikiga to‘g‘ri kelsa, uning o‘tgan gunohlari kechiriladi.",
  },
  {
    title: "Sujudda zikr",
    when: "Sajdada - Allohga eng yaqin joy.",
    translation: "Ulug‘ Robbim pokdir.",
    meaning:
      "Eng past jismoniy nuqtada siz Xudoyi Taoloni ulug'laysiz - ibodatning markazidagi paradoks. Rasululloh sollallohu alayhi vasallam aytdilarki, banda Parvardigoriga sajdada eng yaqinroqdir, shuning uchun zikrdan keyin duoni shu yerda to‘kib tashlang.",
  },
  {
    title: "Ikki sajda orasida",
    when: "Har rakatning birinchi va ikkinchi sujudlari orasida xotirjam o'tirish.",
    translation: "Rabbim, meni kechir. Rabbim, meni kechir.",
    meaning:
      "Har bir rakatda qisqa, ammo to'g'ridan-to'g'ri kechirim so'rash - biz o'rta namozda ham Allohning kechirimiga muhtoj ekanligimizni eslatadi. Ikkinchi sajdadan oldin xotirjam bo'lguningizcha o'tiring.",
  },
  {
    title: "At-Tahiyot (Tashahhud)",
    when: "Namozning o'rtasi va oxirgi majlisida.",
    translation:
      "Barcha salomlar, duolar va sof so‘zlar Alloh uchundir. Assalomu alaykum, ey payg‘ambar, Allohning rahmati va barakotlari. Bizga va Allohning solih bandalariga salom bo'lsin. Guvohlik beramanki, Allohdan o'zga iloh yo'q va Muhammad Uning quli va rasuli ekanligiga guvohlik beraman.",
    meaning:
      "Namozning qalbi: har qanday ibodatni yolg'iz Alloh uchun qilursiz, Payg'ambarimiz sollallohu alayhi vasallamga va solihlarga salom aytasiz va ikki guvohlikni qayta aytasiz. Ibn Mas'ud buni Rasululloh sollallohu alayhi vasallamdan so'zma-so'z o'rgangan, xuddi sura o'rgangandek.",
  },
  {
    title: "Ibrohimiyya salavotlari",
    when: "Yakuniy tashahhudda, “At-Tahiyot”dan keyin.",
    translation:
      "Allohim, Ibrohimga va Ibrohimning oilasiga baraka berganingdek, Muhammadga va Muhammadning oilasiga salovotlar yubor. Albatta, Sen maqtovga sazovor va ulug' zotsan. Allohim, Ibrohimga va Ibrohimning oilasiga ne'mat berganingdek, Muhammadga va Muhammadning oilasiga marhamat qil. Albatta, Sen maqtovga sazovor va ulug' zotsan.",
    meaning:
      "Sahobalar u zotga qanday salovot aytishni so‘raganlarida, Payg‘ambar sollallohu alayhi vasallam ularga mana shu aniq so‘zlarni - sunnatdagi eng sahih salovotni o‘rgatdilar. Alloh buyurganidek, Rasululloh sollallohu alayhi vasallamni hurmat qilasizlar, namozingizni o‘rgatgan zotga muhabbat bilan yakunlaysizlar.",
  },
  {
    title: "Salom oldidan panoh izlash",
    when: "Oxirgi tashahhud va salovotdan so'ng, namoz tugashidan oldin.",
    translation:
      "Allohim, men Sendan qabr azobidan, do'zax azobidan, hayot va o'lim fitnasidan va Soxta Masih (Dajjol) fitnasining yomonligidan panoh so'rayman.",
    meaning:
      "Rasululloh sollallohu alayhi vasallam oxirgi tashahhuddan keyin salom berishdan oldin mana shu to'rt xavfdan panoh so'rashini buyurdilar - namozning oxirgi duosi dunyo hayotini, qabrni, do'zaxni va eng katta fitnani qamrab oladi.",
  },
  {
    title: "Taslim (yakunlovchi salom)",
    when: "Namozni tugatish - yuzni o'ngga, keyin chapga burish.",
    translation: "Assalomu alaykum va rahmatullohi alayh.",
    meaning:
      "Namozni muhtaramlar safidan chiqqandek tark etasiz - har bir yelkangizda yozilgan farishtalarga va yoningizda namoz o'qiyotganlarga salom berib. Salom ustundir; u bilan namoz to'liq bo'ladi.",
  },
];

export const SALAH_GUIDE_QUIZ_UZ: DeepPartial<SalahGuideQuizQuestion>[] = [
  {
    prompt: "Har kuni kelishilgan sunnat ravotib necha rakat?",
    options: ["8", "10", "12", "14"],
    explanation:
      "O'n ikki ravotib: bomdoddan oldin 2, peshindan oldin 4, peshindan keyin 2, shomdan keyin 2 va xuftondan keyin 2 (Sahih Muslim 728).",
  },
  {
    prompt: "Bomdoddan oldin ta'kidlangan (mu'akkada) sunnat:",
    options: ["Yo'q", "2 rakat", "4 rakat", "Faqat keyin 2 rakat"],
    explanation:
      "Bomdoddan oldin ikki rakat sunnat mu'akkadadir — Rasululloh sollallohu alayhi vasallam ularni hech qachon tark etmas edi (Sahih al-Buxoriy 1169; Sahih Muslim 724).",
  },
  {
    prompt: "Peshin atrofidagi kelishilgan ravotib:",
    options: ["Oldin 2, keyin 2", "Oldin 4, keyin 2", "Oldin 4, keyin 4", "Faqat oldin 2"],
    explanation:
      "Peshindan oldin to'rt va keyin ikki rakat o'n ikki ravotibning bir qismidir. Bulardan ortiq rakatlar tavsiya etilgan nafl, sobit ravotib emas.",
  },
  {
    prompt:
      "To'g'ri yoki noto'g'ri: Asrdan oldin to'rt rakat har kungi o'n ikki ravotibning bir qismidir.",
    options: ["To'g'ri", "Noto'g'ri"],
    explanation:
      "Asrdan oldin to'rt rakat sunnat g'ayr mu'akkada (keng tavsiya etiladi), lekin o'n ikki ravotibga kirmaydi (Jami' at-Tirmidhiy 430).",
  },
  {
    prompt: "Nima uchun Vitr namoz kuzatuvchida alohida toifada saqlanadi?",
    options: [
      "Hadislarda zikr qilinmagan",
      "Hanafiylar buni vojib, ko'pchilik sunnat mu'akkada deb biladi",
      "U doimo xuftondan oldin o'qiladi",
      "Rakat soni belgilanmagan",
    ],
    explanation:
      "Vitr kuchli dalillar bilan sabit, lekin ulamolar uning vojib yoki sunnat mu'akkada ekanligi haqida ixtilof qiladi — shuning uchun o'n ikki ravotibdan alohida kuzatiladi.",
  },
  {
    prompt: "Jamoat bomdodida imom qiroat qiladi:",
    options: [
      "Ikkala rakatda ham sirri",
      "Ikkala rakatda ham jahriy",
      "Faqat birinchi rakatda jahriy",
      "Birinchi sirri, ikkinchi jahriy",
    ],
    explanation:
      "Bomdod ikkala rakatda ham jahriy o'qiladi. Imom orqasida diqqat bilan tinglaysiz.",
  },
  {
    prompt: "Jamoatda peshin va asr qiroati:",
    options: [
      "Barcha rakatlarda jahriy",
      "Barcha rakatlarda sirri",
      "Birinchi ikkita jahriy, keyin sirri",
      "Birinchi ikkita sirri, keyin jahriy",
    ],
    explanation:
      "Peshin va asr butunlay sirri — imom past ovozda o'qiydi va har bir namoz o'quvchi o'zi uchun o'qiydi.",
  },
  {
    prompt: "Shomda imom qaysi rakatlarda jahriy o'qiydi:",
    options: [
      "Uch rakatning hammasida",
      "Faqat birinchi ikki rakatda",
      "Faqat uchinchi rakatda",
      "Hech qayerda — shom to'liq sirri",
    ],
    explanation:
      "Shom birinchi va ikkinchi rakatda jahriy, uchinchisida sirri — boshqa namozlardagi uzun/qisqa rakat naqshiga o'xshash.",
  },
  {
    prompt: "Xuftonda baland ovozda qiroat qachon to'xtaydi?",
    options: [
      "Birinchi rakatdan keyin",
      "Ikkinchi rakatdan keyin",
      "Uchinchi rakatdan keyin",
      "Hech qachon — to'rt rakat ham jahriy",
    ],
    explanation:
      "Xufton birinchi ikki rakatda jahriy, uchinchi va to'rtinchi rakatda sirri o'qiladi.",
  },
  {
    prompt: "Jahriy namozlarda imom orqasida hamma kelishadi:",
    options: [
      "Imom bilan birga baland ovozda boshqa sura o'qish kerak",
      "Diqqat bilan tinglash va baland ovozda boshqa sura o'qimaslik",
      "Fotiha o'qilgach namozdan chiqish",
      "Faqat oxirgi rakatda o'qish",
    ],
    explanation:
      "Alloh taolo: «Qur'on o'qilganda, uni diqqat bilan tinglang va jim turing» (Qur'on 7:204).",
  },
  {
    prompt: "Shofi'iylikka ko'ra, jahriy namozda imom orqasida:",
    options: [
      "Fotiha umuman o'qilmaydi",
      "Har rakatda Fotiha o'qiladi",
      "Faqat sirri rakatlarda o'qiladi",
      "Imom bilan birga baland ovozda o'qiladi",
    ],
    explanation:
      "Shofi'iylik har bir namoz o'quvchidan har rakatda Fotiha o'qishni talab qiladi: «Kitobning boshidan o'qimagan kishining namozi yo'q» (Sahih al-Buxoriy 756).",
  },
  {
    prompt: "Hanafiylikka ko'ra, jahriy namozda imom orqasida:",
    options: [
      "Har rakatda past ovozda Fotiha o'qish",
      "Diqqat bilan tinglash va Fotiha o'qimaslik",
      "Faqat Fotiha'dan keyingi surani o'qish",
      "Fotihani baland ovozda o'qish shart",
    ],
    explanation:
      "Hanafiylarning asosiy qarashiga ko'ra jahriy namozlarda tinglash kerak; imomning qiroati yetarli. To'rt sunniy mazhabning hammasi haqli pozitsiyalardir.",
  },
  {
    prompt: "Peshinning birinchi ikki rakatida Payg'ambar ﷺ odatda o'qigan:",
    options: ["Faqat Fotiha", "Fotiha va boshqa sura", "Hech narsa — to'liq sirri", "Faqat tasbih"],
    explanation:
      "Abu Qatoda rivoyat qilganidek, Payg'ambar ﷺ peshin va asrning birinchi ikki rakatida Fotiha va boshqa sura, oxirgi ikkitasida faqat Fotiha o'qigan (Sahih al-Buxoriy 776; Sahih Muslim 451).",
  },
  {
    prompt: "Bomdodni yolg'iz o'qiganda sunnat:",
    options: [
      "Faqat sirri o'qish",
      "Jahriy o'qish (sirri ham to'g'ri)",
      "Fotiha'dan keyingi surani tark etish",
      "Faqat bir rakat o'qish",
    ],
    explanation:
      "Yolg'iz o'qiganda jamoatdagidek o'qiydi; bomdod, shom va xuftonda jahriy o'qish sunnatdir.",
  },
  {
    prompt:
      "To'g'ri yoki noto'g'ri: Shomdan keyin Salat al-Awwabin sifatida aniq olti rakat barcha ulamolar ijmosi bilan sobit sunnatdir.",
    options: ["To'g'ri", "Noto'g'ri"],
    explanation:
      "Shomdan keyin umumiy nafl rag'batlantiriladi, lekin aynan olti rakatni Awwabin deb belgilash sahihligi borasida ixtilofli — uni sobit sunnat sifatida ko'rsatmaslik kerak.",
  },
];
