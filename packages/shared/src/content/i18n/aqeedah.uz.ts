// Uzbek translation overlay for the Learn Aqeedah content. Mirrors the order of
// its English source in ../aqeedah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { AqeedahGlossaryTerm, AqeedahTopic } from "../../types/aqeedah";
import type { DeepPartial } from "./localize";

export const AQEDAH_TOPICS_UZ: DeepPartial<AqeedahTopic>[] = [
  {
    title: "Kirish",
    summary: "Aqida ibodat, xarakter va maqsadni shakllantiradigan iymon asosidir.",
    body: [
      "Aqida (ʿqydẗ) so'zi mahkam bog'lash yoki mahkam bog'lash ma'nosidagi ildizdan kelib chiqqan bo'lib, bu musulmonning shunday ishonch bilan ega bo'lgan e'tiqodlari majmui bo'lib, qalb ular bilan bog'langan va shubhalar bilan bezovta bo'lmaydi. Jabroil alayhissalomning mashhur hadislarida Rasululloh sollallohu alayhi vasallam buni oltita aqida sifatida jamlaganlar: Allohga, farishtalariga, kitoblariga, payg‘ambarlariga, oxirat kuniga va ilohiy hukmga, uning yaxshi va achchiqligiga.",
      "Sunniy musulmonlarning asosiy oqimi bo'lgan Ahli Sunna val-Jamoa uchun e'tiqod avval Qur'ondan, so'ngra Payg'ambarning sahobalari va ilk avlodlar (salaflar) yo'lida tushunilgan sahih sunnatdan olingan. Qaerda aql ishlatilsa, u vahiyni bekor qilishdan ko'ra vahiyga xizmat qiladi.",
      "Aqida mavhum seminar mavzusi emas; u butun ibodat va xarakter o'sib chiqadigan ildizdir. Insonning Allohning kimligi, nima uchun yaratilganligi va qayerga qarab ketayotgani haqidagi eʼtiqodlari uning qanday ibodat qilishi, boshqalarga qanday munosabatda boʻlishi, qiyinchilik va oʻlimga qanday duchor boʻlishini boshqaradi.",
      "To'g'ri e'tiqod qalbni ulug' ibodat holatlari - sevgi va qo'rquv, umid va qo'rquv, tavakkal va harakat, shukr va tavba o'rtasida muvozanatda ushlab turadi, shunda mo'min Allohning rahmatidan umidini uzmaydi va Uning hisob-kitobidan omon qolmaydi.",
    ],
    quran: [
      {
        excerpt:
          "Yaxshilik Allohga, oxirat kuniga, farishtalarga, kitobga va payg'ambarlarga iymon keltirishidir...",
      },
      {
        excerpt:
          "Ey iymon keltirganlar, Allohga, Uning payg‘ambariga, O‘z payg‘ambariga nozil qilgan kitobiga va avval nozil qilgan kitobiga iymon keltiringlar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Iymon - Allohga, farishtalariga, kitoblariga, payg'ambarlariga, oxirat kuniga ishonish, ilohiy hukmga, uning yaxshi va achchiqligiga ishonishdir. (Jibril hadis, Umar rivoyati).",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Aqida nima?",
    summary: "Aqida falsafa darsi emas; bu vahiyga asoslangan yashagan e'tiqoddir.",
    body: [
      "Aqida - bu faqat munozara uchun yodlangan nazariya emas, balki qalb aniq tasdiqlaydigan va keyin ibodat va xulq-atvorda namoyon bo'ladigan narsadir. Qur'onda qat'iy mo'minlar vahiy haqida: «Biz unga iymon keltirdik. Hammasi Parvardigorimiz tomonidandir» (3:7): Ular ochiq-oydin narsaga bo'ysunadilar va g'aybni Allohga topshiradilar.",
      "Ilk ulamolar ixcham aqida matnlarini (masalan, “al-Aqida at-Tahoviyya”) aynan mana shu ravshanlikni saqlab qolish uchun – oddiy mo‘minlarni ikki xavfdan himoya qilish uchun yozganlar: dinga qo‘shadigan mubolag‘a va Alloh tasdiqlagan narsani yo‘q qiladigan inkor.",
      "Ahli sunna ichida tan olingan ilohiyot maktablari, xususan, athoriy, ash’ariy va moturidiy yondashuvlari mavjud bo‘lib, ular iymonning zaruriy jihatlari bo‘yicha to‘liq rozi bo‘lib, ayrim masalalarni, xususan, ilohiy sifatlarni ifodalashning ba’zi texnik usullarida farq qiladi. Ularning umumiy asosi yagona va mustahkamdir: Allohning mutlaq birligi, vahiysining rostligi va oxiratda haqiqiy hisob-kitobi.",
      "Demak, aqida jonli e'tiqod sifatida eng yaxshi o'rganiladi: aqidaning har bir nuqtasi ibodat qilish usuli, xulq-atvori va tasalli manbai bilan bog'lanadi.",
    ],
    quran: [
      {
        excerpt:
          "Ilm egalari: «Biz unga iymon keltirdik. Bularning hammasi Robbimizdandir», dedilar.",
      },
    ],
    actions: [
      "Aqiydani ijtimoiy tarmoqlardagi bahslardan emas, ishonchli olimlar va asosiy matnlardan o'rganing.",
      "O'rganayotgan har bir e'tiqodingiz uchun so'rang: bu mening sajda qilish va yashashimni qanday o'zgartiradi?",
    ],
  },
  {
    title: "Nima uchun aqida muhim",
    summary:
      "Sog'lom e'tiqod ruhiy barqarorlikni beradi va haddan tashqari narsalardan himoya qiladi.",
    body: [
      "Qachonki iymon mustahkam va sobit bo'lsa, amallar ixlos va barqaror bo'ladi; e'tiqod chayqalganda, ibodat beqaror, sof hissiyotga aylanadi yoki istak va shubha bilan osongina silkinib ketadi. Alloh taolo \"iymon keltirganlarni sobit so'z bilan mustahkam qilishini\" va'da qiladi - bu hayotda ham, qabr va oxiratda ham.",
      "To'g'ri e'tiqod mo'minni butun umri davomida olib boradigan narsadir: qiyinchilikda Allohning amriga sabrli bo'lishga, ne'matga kamtarona shukr qilishga, noaniqlik va o'lim oldida xotirjamlikka o'rgatadi. Qadrga va oxiratga chinakam ishongan odam sinovdan o'tmaydi.",
      "Nihoyat, sog'lom aqida ixtilofda adabni - yaxshi xulq-atvorni o'rgatadi: samimiy ulamolar uzoq vaqt ixtilof qilgan ikkinchi darajali masalalarda aniq asoslarga qat'iy rioya qilish va hurmat va vazminlik ko'rsatish. E'tiqodni bilish kamtarlik va rahm-shafqatni oshirishi kerak, hech qachon takabburlik emas.",
    ],
    quran: [
      {
        excerpt:
          "Alloh iymon keltirganlarni dunyo hayotida ham, oxiratda ham mustahkam so'z bilan mustahkam qilur.",
      },
    ],
    hadith: [
      {
        excerpt:
          "O'zingizga foyda keltiradigan narsaga ishtiyoqli bo'ling, Allohdan yordam so'rang va nochor qolmang... (Abu Hurayra)",
      },
    ],
  },
  {
    title: "Iymonning olti maqomi",
    summary: "Rasululloh sollallohu alayhi vasallam iymonni oltita asosli aqidada jamlaganlar.",
    body: [
      "Oltita maqola Islomdagi eng muhim hadislardan biri bo'lgan Jabroil hadisidan olingan. Jabroil farishta odam qiyofasida kelib, sahobalar oldida Rasululloh sollallohu alayhi vasallamdan Islom, iymon va ehson haqida so‘radi. U iymon haqida so'raganida, Rasululloh sollallohu alayhi vasallam mana shu olti e'tiqod bilan javob berdilar - Jabroil uni tasdiqladi, so'ng odamlarga dinlarini o'rgatish uchun keldi.",
      "Oltitasi: Allohga iymon keltirish; Uning farishtalarida; Uning nozil kitoblarida; Uning payg'ambarlarida; oxiratda; va ilohiy hukmda (qadr) uning yaxshi va achchiqligi. Ulardan birortasini inkor etish haqiqiy iymondan chetda qolishdir, chunki ular bir matodir.",
      "Ular, shuningdek, bir-biriga chuqur bog'langan. Kitoblarga va payg'ambarlarga iymon keltirish oxirat kuni va hisob-kitobni bilishga olib keladi; Qiyomat kuniga iymon keltirish har bir amalni talon-taroj qiladi; Qadrga e'tiqod esa Allohga tavakkal qilishni va Uning hikmati oldida kamtarlikni o'rgatadi. Ularni tartib bilan o'rganish aniq va muvozanatli dunyoqarashni shakllantiradi.",
    ],
    hadith: [
      {
        excerpt:
          "...Allohga, farishtalariga, kitoblariga, payg‘ambarlariga, oxirat kuniga iymon keltirishingiz, hukmga, uning yaxshi va achchiqligiga iymon keltirishingiz. (Jibril hadisi sharif)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Allohga ishonish",
    summary:
      "Allohga iymon keltirish Uning rabbiligi, ibodat qilishdagi yagona haqqi, ism va sifatlarini qamrab oladi.",
    body: [
      "Allohga iymon barcha e'tiqodlarning eng ulug'i va qolganlarining ildizidir. U faqat hamma narsaning Yaratuvchisi, Egasi va qo'llab-quvvatlovchisi ekanligiga aminlik bilan boshlanadi - yagona haqiqiy Xudo, hech qanday sherigi, tengi yo'q va Uning ijodidan hech biriga muhtoj emas.",
      "Bundan kelib chiqadiki, faqat U har qanday shaklda ibodatga loyiqdir: namoz, duo, umid, qo'rquv, tavakkal, eng oliy ma'noda sevgi, qurbonlik va nazr Allohning haqlaridir, ularni O'zidan boshqa hech kimga qaratib bo'lmaydi. “Allohdan o‘zga iloh yo‘q” degan guvohlikning ma’nosi shu.",
      "Ahli sunnat Alloh taoloning Oʻziga va Rasuli sollallohu alayhi vasallamning U zot uchun tasdiqlagan goʻzal ismlari va yuksak sifatlarini Oʻzining ulugʻvorligiga yarasha tarzda tasdiqlaydilar, uni Oʻz ijodiga (taʼtil) oʻxshatmay, maʼno sifatlarini inkor etmay, boʻshatmay. Himoya qiluvchi oyat: “Unga oʻxshagan hech narsa yoʻq, U eshituvchi va koʻruvchidir” (42:11) – bu ham oʻxshashlikni inkor etadi, ham Uning eshitish va koʻrishini tasdiqlaydi.",
      "Allohni ismlari ila bilish — mehribon, o‘ta bilguvchi, barhayot tirik, podshoh, mag‘firat — qalb taomidir: Uni qanchalik ko‘p tanisang, shunchalik ko‘p sevasan, qo‘rq, Unga murojaat etasan.",
    ],
    quran: [
      {
        excerpt:
          "Ayting: «U Alloh yagonadir... U tug'ilmaydi va tug'ilmaydi va Unga teng keladigani yo'q.",
      },
      {
        excerpt: "Va eng go'zal ismlar Allohnikidir. Bas, ular bilan Unga duo qilinglar.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Farishtalarga ishonish",
    summary:
      "Farishtalar Allohning hurmatli, ko'rinmas bandalari bo'lib, hech qachon Unga osiy bo'lmaydilar.",
    body: [
      "Farishtalar (maloika) nurdan yaratilgan ulkan maxluqdir. Ularda itoatsizlik qilish ixtiyori yo'q: ular Allohga to'xtovsiz ibodat qiladilar va Uning har bir amrini mukammal bajaradilar, 'Alloh buyurgan narsalarida osiy bo'lmaydilar va buyurilgan narsalarni qiladilar'.",
      "Ularga ishonish, ko‘rinmas olam atrofimizdagi haqiqiy va faol ekanligiga ishonishdir. Farishtalar vahiy keltiradilar, odamlarni qo'riqlaydilar, har bir so'z va ishlarni yozib qo'yadilar, o'lim paytida jonlarni oladilar va Allohning izni bilan er va osmon ishlarini boshqaradilar.",
      "Matnlarda ma'lum rollar bilan bir nechta nom berilgan: Vahiy farishtasi Jibril; Mikoilga yomg'ir va rizq topshirilgan. Sur chaluvchi Isrofil; Malak al-Mavt, o'lim farishtasi; va har bir kishining amallarini yozib turuvchi oliyjanob ulamolar (Kiraman Katibin). Munkar va Nakir marhumni qabrda so‘roq qilishadi.",
    ],
    quran: [
      {
        excerpt:
          "Uning ustida Allohning amriga osiy bo'lmaydigan va buyurilgan narsani bajaradigan qattiqqo'l va qattiqqo'l farishtalar bor.",
      },
      {
        excerpt:
          "Ayting: Kim Jabroilga dushman bo'lsa, bas, u Allohning izni bilan uni qalbingga tushirgandir.",
      },
    ],
    actions: [
      "Yozuvchi farishtalar hech qachon biron bir so'z yoki harakatni o'tkazib yubormasligini anglab yashang.",
    ],
  },
  {
    title: "Ilohiy kitoblarga ishonish",
    summary:
      "Alloh hidoyat qilib kitoblarni yubordi. Qur'on ularni tasdiqlaydi va yakuniy mezon sifatida turadi.",
    body: [
      "Musulmonlar Alloh taolo O'z payg'ambarlariga hidoyat va rahmat sifatida Muqaddas Kitobni nozil qilganiga ishonishadi. Qur'onda bir nechta nomlar keltirilgan: Ibrohim va Musoning suhufi, Musoga berilgan Tavrat, Dovudga Zabur, Iso alayhissalomga Injil va nihoyat Muhammad sollallohu alayhi vasallamga Qur'on - yaxlit holda, asl nozil qilingan shaklda iymon keltirgan.",
      "Qur'on o'ziga xos darajaga ega. Bu oxirgi vahiy boʻlib, “oʻzidan oldingi narsalarni tasdiqlovchi va uning ustidan hukm qiluvchi” (5:48), yaʼni u hukm qiladi va toʻgʻrilaydi, chunki avvalgi kitoblar asl holida qolmagan, balki oʻzgartirilgan (tahrif) va avlodlar davomida yoʻqolib ketgan.",
      "Muqaddas kitoblar ichida yagona bo‘lib, Qur’oni karim buzg‘unchilikdan ilohiy himoyalangan: “Albatta, eslatmani Biz nozil qildik va, albatta, Biz uning qo‘riqchisimiz” (15:9). Demak, kitoblarga iymon keltirish vahiyni hurmat qilish, Qur'onni tafakkur bilan tilovat qilish va hayotda uning hidoyatiga bo'ysunish demakdir.",
    ],
    quran: [
      {
        excerpt:
          "Va Biz senga o'zidan oldingi kitobni tasdiqlovchi va uni ajratuvchi bo'lib haq kitobni nozil qildik.",
      },
      {
        excerpt: "Darhaqiqat, zikrni Biz nozil qildik va, albatta, Biz uni himoya qilguvchidirmiz.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Payg'ambarlarga iymon keltirish",
    summary:
      "Barcha payg'ambarlar bir xil asosiy haqiqatni yetkazganlar; Muhammad sollallohu alayhi vasallam oxirgi elchidir.",
    body: [
      "Musulmon Alloh taolo yuborgan barcha payg‘ambar va elchilarga ishonadi va ularning hech birini rad etadi. Odam alayhissalomdan Nuh, Ibrohim, Muso va Iso alayhissalomgacha Muhammad sollallohu alayhi vasallamgacha bir xil asosiy da'vatga chaqirdilar: yolg'iz Allohga ibodat qilinglar va to'g'ri yashanglar. Qur'onda yigirma beshtasining ismi bor; Ularning umumiy soni faqat Allohga ayon.",
      "Payg'ambarlar rostgo'ylik va ishonchlilik bo'yicha yaratilganlarning eng yaxshisidirlar, ular Alloh tomonidan xabar haqida yolg'on gapirishdan va katta gunohlardan himoyalangan - lekin ular ilohiy emas, balki inson bo'lib qoladilar va hech qachon ibodat qilinmaydilar. “Qat’iy” elchilar (ulu al-azm) sifatida besh kishi ajratilgan: Nuh, Ibrohim, Muso, Iso va Muhammad alayhissalom.",
      "Muhammad sollallohu alayhi vasallam payg'ambarlarning muhri (xotam an-nabiyyin): undan keyin hech bir payg'ambar kelmaydi va uning xabari umumbashariy bo'lib, qiyomatgacha butun insoniyatga yuboriladi. Unga ishonish, uni sevish, amrlariga bo'ysunish, xabarlariga ishonish va faqat u o'rgatgan yo'l bilan ibodat qilishni o'z ichiga oladi.",
    ],
    quran: [
      {
        excerpt: "...Biz Uning payg‘ambarlaridan birortasini farq qilmaymiz...",
      },
      {
        excerpt:
          "Muhammad birorta odamingizning otasi emas, balki Allohning rasuli va payg‘ambarlarning muhridir.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Oxirat kuniga iymon keltirish",
    summary:
      "Hayot Alloh bilan yakuniy uchrashuvga, mukammal adolatga va abadiy natijalarga olib keladi.",
    body: [
      "Qiyomat kuniga iymon keltirish o'limdan keyingi har bir narsaga: qabr so'rashiga va hayotiga (barzaxga), sur chalinishiga, barcha odamlarning tirilishiga, ulug' yig'ilishga, hisob-kitobga, amallarni tarozida tortishga, ko'prikdan o'tishga va ikki abadiy maskan - jannat va jahannamga ishonishdir.",
      "Bu e'tiqod har bir daqiqaga ma'naviy yuk beradi. Alloh taolo yashirinni ko‘rib, eng kichik amalni yozib qo‘ygani uchun hech qanday yaxshilik zoye ketmaydi va hech bir yomonlik ko‘zdan qochmaydi: “Kim zarrachalik yaxshilik qilsa, uni ko‘radi, kim zarrachalik yomonlik qilsa, uni ko‘radi”.",
      "Ahli sunnat bu voqeliklarning barchasini qat’iylik bilan tasdiqlab, ularga aynan xabar qilinganidek e’tiqod qiladilar, shu bilan birga, ulamolar o‘ziga xos hodisa va alomatlarning nozik tafsilotlarini talqin qilishda turlicha bo‘lishlarini e’tirof etadilar. E'tiqodning maqsadi taxmin emas, balki tayyorgarlikdir.",
    ],
    quran: [
      {
        excerpt:
          "...Bas, kim zarrachalik yaxshilik qilsa, uni ko'radi, kim zarrachalik yomonlik qilsa, uni ko'radi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qadrga iymon keltirish (Ilohiy farmon)",
    summary:
      "Allohning ilmi va hukmi to'liqdir, lekin insonlar haqiqatdan ham tanlaydilar va javob beradilar.",
    body: [
      "Qadrga iymon ko'pincha to'rt darajada umumlashtiriladi: Alloh hamma narsani abadiy biladi; Ularning hammasini yaratilishdan ellik ming yil avval lavhada yozganini; hech narsa Uning irodasi bilan sodir bo'lmaydi; U bor narsaning, jumladan, bandalarining xatti-harakatlarining ham Yaratuvchisi ekanligi.",
      "Shu bilan birga, insonlar Alloh ruxsat bergan narsada haqiqiy irodaga va haqiqiy tanlovga egadirlar - aynan shuning uchun amr va taqiqlar, ajr va jazo adolatli va mazmunlidir. Inson ibodat qilishni yoki yolg'on gapirishni tanlaydi va haqli ravishda javobgarlikka tortiladi; Tanlovni Allohning oldindan bilishi uni majburlamaydi.",
      "Ahli sunnat ikki xato o'rtasida yo'l tutadi: hukmni inkor etish (hodisalar Allohning ilmi va irodasidan qochgandek) va fatalizm (inson mas'uliyatini bekor qilish va gunohni kechirish uchun farmondan foydalanish). Mo'min vositani yaxshilik bilan oladi, so'ngra oqibatini Allohga topshiradi.",
      "Amalda, qadr - tinchlikning buyuk manbai: o'z burchingizni bajarganingizdan so'ng, sizga erishgan narsa sizni hech qachon o'tkazib yubormasligini va siz o'tkazib yuborgan narsa sizga hech qachon etib bormasligini bilishga dam olasiz.",
    ],
    hadith: [
      {
        excerpt:
          "…Agar senga biror narsa yetsa, “Agar shunday qilgan boʻlsam”, dema, balki “Alloh belgilab qoʻydi, xohlaganini qildi”, degin, chunki “Qaniydi” shaytonga eshikni ochadi. (Abu Hurayra)",
      },
    ],
    quran: [
      {
        excerpt: "Darhaqiqat, Biz har bir narsani o'lchov bilan yaratganmiz.",
      },
      {
        excerpt:
          "Darhaqiqat, bir qavm o'z nafsini o'zgartirmaguncha, Alloh ularning ahvolini o'zgartirmas.",
      },
    ],
    misconceptions: [
      "Noto'g'ri tushuncha: Agar hamma narsa belgilab qo'yilgan bo'lsa, urinish befoyda. Tuzatish: Islom sa'y-harakatlarni, rejalashtirishni, ibodat qilishni va tavba qilishni buyuradi - vositalarni olishning o'zi farmonning bir qismidir.",
      "Noto'g'ri tushuncha: Qadr, mening gunohim uchun Alloh aybdor degan ma'noni anglatadi. Tuzatish: xizmatkor tanlaydi va hisob beradi; farmon hech qachon itoatsizlik uchun bahona emas.",
      "Noto'g'ri tushuncha: Qiyinchilik Allohning mendan noroziligini isbotlaydi. Tuzatish: Sinovlar poklanish, martabani ko'tarish, ogohlantirish yoki qaytishga chaqirish bo'lishi mumkin - ko'pincha g'azab emas, g'amxo'rlik belgisi.",
    ],
    actions: [
      "Vasitani yaxshilik bilan ol, so'ngra Allohning hukmiga tavakkul qil.",
      '"Agar faqat ..." afsuslarini "Qaddar Alloh" bilan almashtiring va keyingi konstruktiv qadam.',
    ],
  },
  {
    title: "Tavhid tushuntirilgan",
    summary:
      "Tavhid Alloh taoloning Rabbiyligini, ibodat qilishdagi yagona haqqini, ism va sifatlarini birlashtiradi.",
    body: [
      "Tavhid (tuḥyd) - Allohning mutlaq yagonaligi - Islom qalbi va har bir payg'ambarning xabaridir. Bu faqat Allohga xos bo'lgan har bir narsada yolg'iz Allohni ajratib ko'rsatish va Uning mukammalligini O'zini O'zi ta'riflaganidek tasdiqlash demakdir.",
      "Olimlar tavhidni tushunish va himoya qilishni osonlashtirish uchun uni uchta bog'liq jihat orqali o'rgatishadi. Tavhid ar-Rububiyya: Allohning yolg'iz o'zi hamma narsani yaratuvchi, egalik qiluvchi va boshqaruvchidir. Tavhid al-Uluhiya: Allohning o'zi barcha ibodatlarga loyiqdir - bu payg'ambarlar eng ko'p ta'kidlagan va kofirlar eng ko'p qarshilik qilgan jihatdir. Tavhid al-Asmo' val-sifat: Alloh taoloning ism va sifatlarini nozil qilingan, buzib, inkor va o'xshatishsiz tasdiqlash.",
      "Bu uch qismli ramka bo'linish manbai emas, balki o'qitish vositasidir; uning maqsadi mo'minga ixlosni saqlashga yordam berish va birlik qayerda buzilishi mumkinligini aniqlashdir. Uning to'liqligi har bir musulmonning duosining birinchi duosida aks ettirilgan: \"Biz faqat Senga ibodat qilamiz va faqat Sendan yordam so'raymiz\".",
      "Muhim tushuncha: Allohning Yaratuvchi ekanligini tan olish (rububiya) o'z-o'zidan etarli emas. Payg'ambarlarni inkor etganlarning ko'plari hali ham Alloh osmonlar va erni yaratganini tan oldilar - ular yolg'iz Unga ibodat qilishdan bosh tortdilar (uluhiyya). Haqiqiy tavhid faqat kelib chiqishi haqidagi e'tiqodda emas, balki ibodatda isbotlangan.",
    ],
    quran: [
      {
        excerpt: "Sengagina ibodat qilamiz va faqat sendan yordam so'raymiz.",
      },
      {
        excerpt: "Alloh - Undan o'zga iloh yo'q. Eng go'zal ismlar Unikidir.",
      },
    ],
    misconceptions: [
      "Noto'g'ri tushuncha: Tavhid faqat bitta gapni aytadi. Tuzatish: Bu qalbning iymoni, tilning bayoni va ibodatda yashagan haqiqatdir.",
      "Noto'g'ri tushuncha: Allohni yaratuvchi deb ishonish butun tavhiddir. Tuzatish: Hatto ko'p kofirlar ham buni tasdiqladilar - bu sinov yolg'iz Allohga ibodat qilishdir.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shirk tushuntirildi",
    summary: "Shirk Allohning har qanday mutlaq huquqini Undan boshqa narsaga yo'naltirishdir.",
    body: [
      "Shirk (sẖrk) — Allohga shirk keltirish — tavhidning teskarisi bo'lib, Qur'onda tavba qilmasdan vafot etsa, kechirilmas deb ta'kidlagan gunoh: «Alloh O'ziga shirk keltirishni kechirmaydi, balki undan ozroq narsani O'zi xohlagan kishi uchun kechiradi».",
      "Katta shirk (al-shirk al-akbar) Allohdan boshqasiga ibodat qilish - faqat Alloh berishi mumkin bo'lgan narsa uchun o'lik yoki g'oyibni duo qilish, yaratilgan jonzotlarga qurbonlik qilish yoki nazr qilish yoki Allohni sevish va itoat qilish kerak bo'lgan narsani sevish va itoat qilishdir. Agar biror kishi tavba qilmasdan vafot etsa, Islomdan tashqariga chiqadi.",
      "Kichik shirk (ash-shirk al-asg'ar) Islomdan chiqarib yubormaydi, lekin o'ta xavflidir va amallarning savobini bekor qilishi mumkin. Uning eng aniq ko'rinishi riyo - odamlarga ko'rinadigan va maqtovga sazovor bo'lgan ibodatdir - Payg'ambar sollallohu alayhi vasallam o'z ummatlari uchun eng ko'p qo'rqadigan narsa deb atadilar. Allohdan boshqasiga ulug'lovchi tarzda qasam ichish ham shu yerga tushadi.",
      "Ahli sunnat til va hukmda ehtiyotkor bo‘ladi: umuman shirkdan ogohlantirish muhim va tushunarli, biroq muayyan shaxsni mushrik yoki kofir (takfir) deb e’lon qilish muhim masala bo‘lib, bilim, asosli dalillar va uzrlarni olib tashlashni talab qiladi – bu oddiy odamlarga yoki internetga emas, malakali olimlarga tegishlidir.",
    ],
    quran: [
      {
        excerpt:
          "Albatta, Alloh O'ziga shirk qo'shishni kechirmas, balki undan ozroq narsani O'zi xohlagan kishi uchun kechirur.",
      },
      {
        excerpt: "Ey o'g'lim, Allohga shirk keltirma. Darhaqiqat, uyushma katta zulmdir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Men siz uchun eng ko'p qo'rqadigan narsa kichik shirkdir. Bu nima, deb so'ralganda, u zot: \"O'zini ko'rsatish (riyo)\", dedilar. (Mahmud ibn Labid)",
      },
    ],
    misconceptions: [
      "Noto'g'ri tushuncha: Har bir tilning siljishi katta shirkdir. Tuzatish: Olimlar kattani kichikdan ajratadilar va har bir ishni dalillar bilan sinchkovlik bilan baholaydilar.",
      "Noto'g'ri tushuncha: Shirkdan ogohlantirish odamlarga nisbatan qattiqqo'llikni talab qiladi. Tuzatish: bashoratli yo'l haqiqatning ravshanligini rahm-shafqat va sabrli ta'limot bilan birlashtiradi.",
    ],
  },
  {
    title: "Samimiyat (Ixlos)",
    summary: "Faqat Alloh uchun qilingan amallar qabul qilinadi.",
    body: [
      "Ixlos (ḥkạlạṵ) – maqom, maqtov, boylik yoki odamlarga ta'sir o'tkazish emas, balki amal orqali faqat Allohning rizoligini izlashdir. Bu har bir amalning qabul qilinishi botiniy shartdir: Rasululloh sollallohu alayhi vasallam: “Amal faqat niyatga bog'liq va har bir kishi faqat niyat qilgan narsaga ega bo'ladi”, deganlar.",
      "Chunki savob niyatga bog'liq bo'lib, Alloh uchun ixlos bilan qilingan kichik, sokin amal, obro'-e'tibor uchun qilingan katta, oshkora amaldan ustun turadi. Xuddi shu zohiriy amal - sadaqa berish, namoz o'qish, o'rgatish - qalbning orqasiga qarab ibodat yoki bo'shlik bo'lishi mumkin.",
      "Samimiylik bir marta erishilmaydi, balki doimiy ravishda yangilanadi, chunki o'z-o'zini e'tiborga olishga moyil. Shuning uchun mo'minlar qayta-qayta niyatlarini poklaydilar va Allohdan ularni riyoning yashirin shirkidan va o'zlarini aldashdan saqlashini so'raydilar.",
    ],
    quran: [
      {
        excerpt: "Va ular faqat Allohga dinni xolis qilib ibodat qilishga buyurilgan edilar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Amallar faqat niyatga bog'liq va har bir inson faqat o'zi niyat qilgan narsaga ega bo'ladi. (Umar ibn al-Xattob)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Allohga muhabbat va qo'rquv",
    summary: "Sog'lom qalb sevgi, umid va ehtirom qo'rquvi qanotlarida Allohga ibodat qiladi.",
    body: [
      "Qalbga sig'inish uchta buyuk holatga tayanadi: sevgi (mahabbah), umid (raja') va hurmat qo'rquvi (xavf). Allohga bo'lgan muhabbat barcha ibodatlarning asosi va harakatlantiruvchi kuchi - mo'minlarning \"Allohga bo'lgan muhabbati hamma narsadan kuchliroqdir\" - Allohning noroziligidan qo'rqish esa qalbni gunoh va g'aflatdan qaytaradi.",
      "Ahli sunnat bular ikki qanot va bosh bilan uchayotgan qush kabi muvozanatda turishi kerak, deb taʼlim beradi. Sevgi va qo'rquvsiz umid beparvolik va Allohning rahmatini oddiy holga keltirishi mumkin; umidsiz qo'rquv tushkunlikka tushishi mumkin. Qur'on ularga qo'shiladi: \"Unga qo'rquv va umid bilan duo qilinglar\".",
      "Bu muvozanat shunchaki tuyg'u emas; amalda namoyon bo'ladi - namozni qo'riqlashda, tavba qilishga shoshilishda, boshqalarga xizmat qilishda, g'azabni tiyishda va uni hukm qilgan Zotga bo'lgan muhabbat tufayli qiyinchilikda sabr qilishda.",
    ],
    quran: [
      {
        excerpt: "...Iymon keltirganlarning Allohga muhabbati kuchliroqdir.",
      },
      {
        excerpt:
          "...Va Unga qo'rquv va umid bilan duo qiling. Albatta, Allohning rahmati yaxshilik qiluvchilarga yaqindir.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Umid va tavba",
    summary:
      "Chin tavba qilish va Allohning keng rahmatiga umid qilish uchun hech qanday gunoh katta emas.",
    body: [
      "Ahli sunnatning o'ziga xos e'tiqodi shundan iboratki, inson gunohi qanchalik katta bo'lmasin, Allohning rahmatidan umidini uzmasligi, qilgan yaxshiliklari qanchalik ko'p bo'lishidan qat'iy nazar, Allohning hisob-kitobidan o'zini xavfsiz his qilmasligi kerak. Umid ham, o'z-o'zini tuzatish ham imonlining hayotida uzluksiz davom etadi.",
      "Allohning da'vati hayratlanarli darajada saxovatlidir: «Ayting: Ey o'zlariga zulm qilgan bandalarim, Allohning rahmatidan noumid bo'lmanglar. Albatta, Alloh barcha gunohlarni mag'firat qilguvchidir». Tavba eshigi quyosh g'arbdan chiqmaguncha yoki shaxsning o'limi yaqinlashguncha ochiq qoladi.",
      "Samimiy tavba qilishning aniq shartlari bor: gunohni darhol tark etish, qilgani uchun chin dildan pushaymon bo'lish va hech qachon qaytib kelmaslikka qat'iy qaror qilish - va agar gunoh boshqa birovning huquqlari bilan bog'liq bo'lsa, bu huquqlarni tiklash yoki ulardan kechirim so'rash. Bular ro'yobga chiqqanda, Alloh taoloning javobi shunchaki qabul qilish emas, balki xursandchilik bo'ladi: U taqir cho'lda yo'qolgan tog'ini va rizqini qaytarib olgan odamdan ko'ra \"O'z bandasining tavbasidan ko'proq xursand bo'ladi\".",
    ],
    quran: [
      {
        excerpt:
          "Ayting: Ey o'zlariga zulm qilgan bandalarim, Allohning rahmatidan noumid bo'lmanglar. Albatta, Alloh barcha gunohlarni kechiradi.",
      },
      {
        excerpt: "Ey iymon keltirganlar, Allohga xolis tavba qilinglar.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Alloh taolo bandasining tavba-tavbasi bilan taqir yerda togʻini yoʻqotib, yegulik-ichimligini koʻtarib, keyin yana topib olgan kishidan koʻra koʻproq xursand boʻladi. (Ibn Mas'ud)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Jannat (Jannat)",
    summary:
      "Jannat Alloh taoloning rahmati bilan mo'minlar uchun tayyorlab qo'ygan abadiy mukofotidir.",
    body: [
      "Jannat haqiqiy, abadiy va inson aqli tasavvur qila olmaydigan narsadir. Rasululloh sollallohu alayhi vasallam Ollohning so'zlarini yetkazdilar: «Men solih bandalarim uchun hech bir ko'z ko'rmagan, quloq eshitmagan va qalb o'ylab topmagan narsalarni tayyorlab qo'ydim». Uning eng oliy mukofoti Allohning roziligi va yuzini ko'rishdir.",
      "Jannatga kirish oxir-oqibat Allohning rahmati bilan bo'ladi - hech kimning amali abadiy saodatga erisha olmaydi - lekin ixlos iymon va solih amal Alloh belgilab qo'ygan va qabul qiladigan vositadir. Ikkisi bir-biriga zid emas: rahm-shafqat sabab, iymon va amal esa unga ochgan yo‘ldir.",
      'Jannatga bo‘lgan e’tiqod insonning hozirgi yashash tarzini qayta shakllantiradi: u sabr-toqatni mashaqqat bilan, saxovatni boylik bilan, ibodatdagi matonatni kuchaytiradi, chunki mo‘min o‘tkinchi dunyoni mangu uyga almashtiradi. Qur\'on bizni unga "poyga" qilishga chaqiradi.',
    ],
    quran: [
      {
        excerpt:
          "Robbingizdan mag'firatga va kengligi osmonlaru yerdek bo'lgan taqvodorlar uchun tayyorlangan jannatga shoshiling.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Alloh taolo aytdi: «Men solih bandalarim uchun hech bir ko‘z ko‘rmagan, hech bir quloq eshitmagan va inson qalbi o‘ylab topmagan narsalarni tayyorlab qo‘ydim. (Abu Hurayra; Yana Sahih Musulmon 2824)",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Jahannam (Jahannam)",
    summary:
      "Jahannam chinakam ogohlantirish bo'lib, kech bo'lmasdan qalblarni Allohga qaytarish uchun mo'ljallangan.",
    body: [
      "Jahannamga iymon keltirish gʻaybga va Allohning mukammal adolatiga ishonishning bir qismidir. Bu haqiqiy jazo maskani bo'lib, Qur'on va Sunnatda odamlar xavf-xatarni jiddiy qabul qilishlari uchun yorqin ifodalar bilan tasvirlangan.",
      "Ogohlantirishlar rahm-shafqatli maqsadga xizmat qiladi: ular odamlarni o'zlari tasvirlagan oqibatlardan himoya qilish uchun mavjud - takabburlik, zulm va qat'iyatli, haqiqatni rad etishni bilish va eshik ochiq bo'lsa, g'aflatni tavba qilishga undash.",
      "Ahli sunnat ogohlantirishlar va rahmatni birga tutadi. Do‘q-po‘pisalar jiddiy va haqiqiydir, lekin Allohning rahmati Unga yuz o‘girgan kishiga keng bo‘lib qoladi – va tavhid ahlidan do‘zaxga kirgan gunohkorlar u yerda abadiy qolmaydilar, oxir oqibat Allohning rahmati va U izn bergan shafoati bilan chiqariladi.",
    ],
    quran: [
      {
        excerpt:
          "Ey iymon keltirganlar, o'zingizni va oilangizni yoqilg'isi odamlar va toshlar bo'lgan do'zaxdan saqlaning.",
      },
      {
        excerpt:
          "...Allohning rahmatidan noumid bo'lmang. Albatta, Alloh barcha gunohlarni kechiradi.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Tirilish",
    summary: "O'limdan so'ng barcha insonlar Alloh huzurida turish uchun jismonan tiriltiriladi.",
    body: [
      "Qayta tirilish (al-ba's) timsol yoki metafora emas, balki jismonan va haqiqiydir. Chirigan suyaklarning qayta yashashiga shubha qilganlarga Alloh taolo eng oddiy mantiq bilan javob beradi: ularni birinchi marta yo'qdan yaratgan Zot, albatta, ularni qayta tiklashi mumkin - va bizning tushunishimizcha, qayta yaratish paydo bo'lishdan osonroqdir.",
      "O'lim va tirilish o'rtasida barzax bor - qabrning oraliq hayoti, uning so'rovi va uning oson yoki qiyinligi bilan. So‘ngra sur chalinib, butun maxluqot tirilib, hisob-kitob uchun Alloh huzuriga to‘planadi.",
      "Bu e’tiqod inson hayotiga axloqiy jiddiylik baxsh etadi: tirilishsiz bemalol o‘lgan zolim ham, zulm qilinib o‘lgan mazlum ham xuddi shunday natijaga erishadi. U bilan har bir xatoga javob beriladi va har bir yaxshilikka ajr beriladi, sabr va adolatga ma'no beradi.",
    ],
    quran: [
      {
        excerpt:
          "U zot: «Suyaklarni chirigan hollarida kim tiriltiradi?» deydi. Ayting: «Ularni birinchi marta yaratgan zot tiriltirur...»",
      },
      {
        excerpt:
          "Darhaqiqat, qiyomat soati keladi, bunga shubha yo'q va Alloh qabrdagilarni tiriltirur.",
      },
    ],
  },
  {
    title: "Qiyomat kuni",
    summary: "Har bir jon Allohning huzurida turadi. Uning adolati mukammal va mukammaldir.",
    body: [
      "Qiyomat kunida har bir inson amali va niyati uchun, Allohning haqlari va boshqa odamlarning haqlari uchun shunchalik aniq adolat bilan, hatto zarrachalik ham «hech bir jonga zulm qilinmasligi» bilan hisob-kitob qilinadi.",
      "U kunda na nasl, na mol, na tabaqa, na millat va na dunyoviy martaba hech kimga foyda keltirmaydi; Alloh tomonidan qabul qilingan xolis iymon va solih amalgina foyda beradi. Yozuvlar tarqatiladi, amallar tortiladi, hatto odamlar o'rtasida qilingan yomonliklar ham yaxshi va yomon ishlarni ko'chirish yo'li bilan tugatiladi.",
      "Bu aniqlik hozir xarakterni o'zgartirish uchun mo'ljallangan: u mo'minni halollikka, ishonchlilikka, boshqalarning haqlarini himoya qilishga va yomonliklarni tuzatishga va qarzni pul bilan emas, balki amalda to'lanadigan Kundan oldin qaytarishga chaqiradi.",
    ],
    quran: [
      {
        excerpt:
          "Biz qiyomat kuni uchun adolat tarozisini qo'yamiz. Bas, hech bir jonga zulm qilinmas.",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Tarozi va sirot",
    summary: "Mizonga amallar tortiladi, odamlar sirotdan iymon va amallari bilan o‘tadilar.",
    body: [
      "Ahli sunnat Mizon (Tarozi) va Sirotni (Do'zax ustidagi ko'prik) oxiratning haqiqiy hodisalari deb tasdiqlaydilar, xuddi xabar qilinganidek ishonadilar. Tarozida amallar va ularni bajaruvchilar to'liq adolat bilan tortiladi: Kimning tarozisi og'ir bo'lsa, u rohat hayotdadir. Kimning tarozisi engil bo'lsa, uning panohi tubsizlikdir».",
      "Sirot jahannam ustidan cho'zilgan ko'prik bo'lib, hamma o'tishi kerak. Qurʼoni karimda “Sizlardan hech kim yoʻqki, undan oʻtib oʻtmas”, soʻngra “Allohga taqvo qilganlarga najot berurmiz”, deyilgan. Odamlar qilgan ishlariga ko'ra - kimdir yorug'lik yoki shamoldek tez, ba'zilari qiynalib, ba'zilari sirpanib - Allohning rahmati va adolati bilan kesib o'tadi.",
      "Bu haqiqatlar qo'rqitish uchun emas, balki jiddiylik tarbiyalash uchun aytiladi: kichik amallarning og'irligi haqida, ibodatning ixlosi haqida va boshqalarning haqlarini hurmat qilish haqida, chunki bularning barchasi tarozida bo'ladi.",
    ],
    quran: [
      {
        excerpt:
          "Kimning tarozisi og'ir bo'lsa, bas, u rohat hayotda bo'lur. Kimning tarozisi engil bo'lsa, uning panohi tubsizlikdir.",
      },
      {
        excerpt:
          "Sizlardan birortangiz u yerdan o'tib ketsa... So'ngra Allohdan qo'rqqanlarga najot berurmiz.",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Shafoat (shafoat)",
    summary: "Shafoat haqiqiydir, lekin Allohning izni bilan, U rozi bo'lgan kishilar uchundir.",
    body: [
      "Qiyomat kuni shafoat qilish (shafoat) Qur'on va Sunnatda qat'iy tasdiqlangan. Eng ulug‘i Payg‘ambarimiz Muhammad sollallohu alayhi vasallamga berilgan “Maqom al-mahmud”dir. U kishi jamlangan maxluqotga hisob-kitobni boshlash uchun shafoat qiladi va u zotning ummatlari orasida katta gunoh qilganlar uchun boshqa shafoatlari ham bo‘ladi.",
      "Lekin hech kim o'z vakolati bilan shafoat qilmaydi. Har bir sahih shafoat faqat «Uning izni bilan» va faqat Alloh rozi bo'lgan zotlar uchun bo'ladi: «Uning huzurida Uning iznisiz kim shafoat qila oladi?» Bu Allohning oqibatda mutlaq hukmronligini saqlaydi.",
      "Ulamolar shafoatning bir necha tasdiqlangan turlarini ta'riflaydilar - hisob-kitob boshlanishi, odamlarning jannatga kirishi, gunohkor mo'minlarning mag'firat qilinishi yoki do'zaxdan olib tashlanishi uchun - va yakuniy hukm doimo yolg'iz Allohga tegishli ekanligiga rozi bo'lishadi.",
    ],
    quran: [
      {
        excerpt: "Kim Uning huzurida faqat Uning iznisiz shafoat qila oladi?",
      },
      {
        excerpt:
          "O'sha kunda Rahmon izn bergan va so'zidan rozi bo'lgan kishigagina shafoat foyda berur.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Odamlar mening oldimga keladilar va men Robbimga sajda qilaman. keyin aytiladi: Boshingni ko'tar, so'ra, senga beriladi, shafoat qil va shafoating qabul qilinadi. (Abu Said — buyuk shafoat)",
      },
    ],
    misconceptions: [
      "Noto'g'ri tushuncha: Shafoat tavba qilish zaruratini yo'q qiladi. Tuzatish: Bu faqat Allohning izni bilan sodir bo'ladi va hech qachon gunohda davom etish uchun ruxsat bermaydi.",
      "Noto'g'ri tushuncha: Shafoat qilish uchun hozir payg'ambarlarni yoki solihlarni chaqirish mumkin. Tuzatish: Ibodat va duo faqat Alloh uchundir; Oxiratda shafoat qilish Uning amri ila, Uning roziligi uchun so'raladi.",
      "Noto'g'ri tushuncha: Shafoat Allohning adolatiga ziddir. Tuzatish: Bu Uning rahm-shafqatining bir ifodasi, Uning mukammal adolati doirasida va faqat Uning izni bilan amal qiladi.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qiyomat Alomatlari",
    summary:
      "Kichik va asosiy belgilar to'g'ri; donolar chayqovchilikdan ko'ra tayyorgarlikka e'tibor berishadi.",
    body: [
      "Sahih matnlarda qiyomatdan oldingi alomatlar (ularning ko'plari allaqachon paydo bo'lgan, masalan, Payg'ambar sollallohu alayhi vasallamning yuborilishi, jaholatning tarqalishi va g'aflatning keng tarqalishi kabi) va oxiratga yaqin sodir bo'ladigan asosiy alomatlarga guruhlangan holda tasvirlangan.",
      "Payg'ambarimiz sollallohu alayhi vasallamning hadislarida o'nta asosiy belgi birgalikda keltirilgan: Dajjolning paydo bo'lishi, Iso alayhissalomning tushishi, Ya'juj va Ma'jujning paydo bo'lishi, uchta katta ko'chki, tutun, quyoshning g'arbdan chiqishi va odamlarni so'nggi yig'ilishlariga olib boradigan olov.",
      "Baʼzida ulamolar baʼzi alomatlarning aniq ketma-ketligi borasida ixtilof qiladilar, lekin ular ikki narsada ixtilof qiladilar: qiyomatning kelishi aniq va uning aniq vaqtini Allohdan boshqa hech kim bilmaydi, hatto Jabroil alayhissalom soʻraganlarida ham Paygʻambar alayhissalomga ham maʼlum. Shuning uchun belgilarga bashoratli javob spekulyativ emas, amaliydir: cheksiz bashorat qilishdan ko'ra imon, tavba, adolat va foydali amallarni oshiring.",
    ],
    quran: [
      {
        excerpt:
          "Ular sendan qiyomat soati haqida so'raydilar: qachon keladi? Ayting: «Uning ilmi faqat Robbim huzuridadir.",
      },
      {
        excerpt:
          "Ular faqat qiyomatning to'satdan kelishini kutmoqdalarmi? Uning belgilari allaqachon paydo bo'lgan.",
      },
    ],
    hadith: [
      {
        excerpt:
          "O'nta alomatni ko'rmaguningizcha qiyomat qolmaydi: tutun, Dajjol, hayvon, quyosh g'arbdan chiqishi, Iso, Ya'juj va Ma'jujning tushishi va uchta ko'chki... (Huzayfa ibn Usayd).",
      },
    ],
    misconceptions: [
      "Noto'g'ri tushuncha: Har bir yirik jahon hodisasi, albatta, yakuniy belgidir. Tuzatish: Bunday da'volar sensatsiya emas, balki haqiqiy dalillar va ilmiy ehtiyotkorlikni talab qiladi.",
      "Noto'g'ri tushuncha: Alomatlarni bilish bizga soatni sanab berish imkonini beradi. Tuzatish: Aniq vaqt faqat Allohga ma'lum; belgilar bizni bashorat qilishga emas, balki tayyorlanishga chaqiradi.",
    ],
    appLinks: [{}],
  },
  {
    title: "Aqida haqida tez-tez so'raladigan savollar",
    summary: "Umumiy e'tiqod savollariga muvozanat, dalillar va yaxshi adab bilan javob berildi.",
    body: [
      "Savol: Sunniylar har bir aqidada bir xilmi? Javob: Ahli sunnat bir asosda bo‘lib, zaruriy masalalarda to‘liq rozidirlar; tan olingan diniy maktablar (Athari, Ash'ariy, Moturidiy) faqat ba'zi texnik formulalarda farqlanadi va bunga dushmanlik bilan emas, balki hurmat bilan o'rganish bilan yondashish kerak.",
      "Savol: To'g'ri aqidaga ega bo'lishim uchun ilg'or falsafa kerakmi? Javob: Yoʻq. Har bir musulmon oʻz ehtiyojiga koʻra zarur boʻlgan narsalarni – oltita moddasi va sof tavhidni oʻrganishi talab etiladi, chuqurroq oʻrganish esa malakali ustozlar qoʻlida foydalidir.",
      "Savol: Aqiydani bilish boshqalarga nisbatan qattiqqo‘llik qilishim kerakmi? Javob: Yo'q. Sog'lom e'tiqod kamtarlik, minnatdorchilik, rahm-shafqat va ehtiyotkor nutqni oshirishi kerak. Musulmonlarni kamsitish yoki takfirga shoshilish uchun aqidadan foydalanishning o'zi jiddiy xatodir.",
      "Savol: Iymon, islom va ehsonning farqi nimada? Javob: Jabroil alayhissalom hadislarida islom zohiriy ibodat, iymon botiniy aqida (olti moddasi), ehson esa har ikkisining kamoloti — Allohga Uni ko‘rgandek ibodat qilishdir.",
    ],
    actions: [
      "Bahsli texnik tafsilotlardan oldin aniq, kelishilgan asoslarga ustunlik bering.",
      "Murakkab e'tiqod muammosi amaliyotingizga ta'sir qilganda malakali mahalliy olimlar bilan maslahatlashing.",
    ],
  },
  {
    title: "Adabiyotlar va qo'shimcha tadqiqotlar",
    summary: "Qur'on va sahih sunnatdan boshlang, so'ngra ishonchli sunniy aqida asoslari.",
    body: [
      "E'tiqod uchun asosiy havola har doim Qur'on va sahih Sunnat bo'lib, ularni sahobalar va ahli sunnatning ilk ulamolari tushunganlaridek tushunadilar - matnlarga qayta o'qilgan keyingi oqimlar orqali emas.",
      "Foydali o'rganish ishonchli o'qituvchilar tomonidan sizning darajangizga mos tushuntirish bilan o'qitiladigan qisqacha klassik aqida asoslarini (al-Aqida at-Tahoviyya va ilk olimlarning asarlari kabi) o'z ichiga oladi.",
      "Qachonki, ulamolar ikkinchi darajali masalalarda ixtilof qilsalar, dalillarni tavoze bilan o'rganinglar va texnik kelishmovchiliklarni mazhab adovatiga aylantirishdan saqlaninglar - mo'minlarning asosiy narsalar ustida birlashishi dinning amridir.",
    ],
    disclaimer:
      "Ushbu modul o'quv va polemik emas. Shaxsiy qarorlar yoki nozik e'tiqod bilan bog'liq muammolar uchun siz ishonadigan malakali olimlar bilan maslahatlashing.",
    actions: [
      "O'qituvchi yoki ishonchli astar bilan har hafta bitta e'tiqod mavzusini o'rganing.",
      "Oltita iymon moddasini yod oling va har birini o'z so'zlaringiz bilan tushuntira oling.",
    ],
    appLinks: [{}, {}, {}],
  },
];

export const AQEDAH_GLOSSARY_UZ: DeepPartial<AqeedahGlossaryTerm>[] = [
  {
    term: "aqida",
    definition:
      "E'tiqod - musulmonning Allohga, farishtalariga, kitoblariga, payg'ambarlariga, oxirat kuniga va ilohiy hukmga ishonishi.",
  },
  {
    term: "Tavhid",
    definition: "Rabbiylik, ibodat va ism/sifatlarda Allohning yagonaligi - Islomning asosi.",
  },
  {
    term: "Shirk",
    definition:
      "Ibodatda yoki Allohgagina ega bo'lgan sifatlarda shirk keltirish tavhidning teskarisidir.",
  },
  {
    term: "Iymon",
    definition: "Iymon - qalbga ishonish, til bilan tasdiqlash va a'zolar bilan amal qilish.",
  },
  {
    term: "Qadr",
    definition:
      "Alloh taoloning barcha narsadagi azaliy ilmi va hukmi - yaxshilik va yomonlik Uning izni va hikmati bilan mavjuddir.",
  },
  {
    term: "Nabi",
    definition:
      "Payg'ambar - vahiy olgan va uni etkazishga buyurilgan; oldingi qonunga amal qilishi mumkin.",
  },
  {
    term: "Rasul",
    definition: "Payg'ambar - o'z qavmiga yangi kitob yoki qonun bilan yuborilgan payg'ambar.",
  },
  {
    term: "Sirot",
    definition:
      "Jahannam ustidagi ko'prik qiyomat kunida - mo'minlar qilgan amallariga ko'ra kesib o'tadilar.",
  },
];
