// Uzbek translation overlay for the Learn Dua content. Mirrors the order of
// its English source in ../learn-dua*.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes, surah/ayah
// numbers, collections, citations and grades stay in the English source.
import type { LearnDuaOccasion, LearnDuaTopic } from "../../types/learn-dua";
import type { DeepPartial } from "./localize";

export const LEARN_DUA_TOPICS_UZ: DeepPartial<LearnDuaTopic>[] = [
  {
    title: "Duo nima?",
    summary:
      "Duo - bu ibodatdir: Allohga to'g'ridan-to'g'ri, kamtarlik va umid bilan iltijo qilish.",
    body: [
      "Duo (dʿạʾ) Allohga iltijo qilish - Undan foyda, mag'firat, hidoyat va himoya so'rash va muhtojlikda Unga murojaat qilishdir. Rasululloh sollallohu alayhi vasallam kichikroq amal bo'lmay, «Duo ibodatdir», dedilar, so'ngra Alloh taoloning «Menga duo qilinglar», degan amrini o'qidilar. Men sizga javob beraman. Allohdan so'rashning o'zi sof tavhid amalidir, chunki u barcha natijalarni faqat U eshitishini, egaligini va nazorat qilishini tan oladi.",
      "Ikki xil duo birga oqadi: duo al-mas'alah, Allohdan biror narsa so'rash va duo al-iboda, Unga namoz, zikr va itoat bilan ibodat qilish - chunki har bir ibodat, mohiyatan, Uning qabul qilinishi va ajrini so'zsiz so'rashdir. Shuning uchun ham Allohdan o'zgaga duo qilish shirkning bir ko'rinishi bo'lib, faqat Unga tegishli narsani boshqasiga beradi.",
      "Mo'min osonlik va qiyinchilikda, ovoz chiqarib va ​​yashirin duo qiladi, albatta, Alloh har bir chaqiriqni eshitadi va xolisni quruq qo'l bilan qaytarmaydi. U shu qadar yaqinki, U: «Dovotchining chaqirig'iga, qachon Menga duo qilsa, ijobat qilaman», deydi.",
      "Javob Rasululloh sollallohu alayhi vasallam o'rgatgan uchta shakldan birini oladi: Alloh so'ragan narsani beradi; Yoki uni to'xtatib qo'yadi va oxirat uchun teng yoki kattaroq ajrni saqlaydi. Yoki unga teng zararni qaytarur. Shunday qilib, samimiy duo hech qachon javobsiz qolmaydi - ba'zida eng katta rahm-shafqat biz ko'rmaydigan javobdadir.",
    ],
    quran: [{}, {}],
    hadith: [{}],
    appLinks: [{}],
  },
  {
    title: "Duo qilish odoblari",
    summary:
      "Hamd bilan boshlang, salovot yuboring, chin dildan so'rang va hech qachon taslim bo'lmang.",
    body: [
      "Duoning Payg'ambarimiz sollallohu alayhi vasallam o'rgatgan va o'rnak qilgan odoblari (adablari) borki, unga rioya qilish qabul qilinishi ehtimolini oshiradi. Allohni go'zal ismlari bilan ulug'lashdan boshlang, so'ngra Payg'ambar sollallohu alayhi vasallamga salovotlar ayting - u namoz o'qigan kishi ikkalasini ham qilmaguncha duo \"to'xtatiladi\" deb o'rgatgan - va shundan keyingina iltimosingizni bildiring.",
      "Alloh taologa uchta botiniy sifat bilan duo qiling: tavoze, Uning ijobat qila olishiga va ijobat etishiga ishonch va U haqida yaxshi fikrda bo'lish (husn al-zann). Imkoniyatingiz bo'lgan joyda qiblaga yuzlaning, qo'l ko'taring, muborak vaqtlarni tanlab, dunyo va oxirat ishlarini so'rang. Muhim so'rovlarni takrorlash va boshlaganingizdek - maqtov va salovot bilan yakunlash tavsiya etiladi.",
      "Eng muhimi, shoshilmang. Rasululloh sollallohu alayhi vasallam: «Qo‘ng‘iroq qildim, qo‘ng‘iroq qildim, ammo javob bermadi», desa, duo ijobat bo‘ladi, deb ogohlantirganlar. So'rashda davom etishning o'zi ibodatdir va Alloh taolo o'z eshigini taqillatgan bandasini yaxshi ko'radi.",
    ],
    hadith: [{}, {}],
    actions: [
      "Har bir duoni Alhamdulillah bilan oching va Payg'ambarimiz sollallohu alayhi vasallamga salovot ayting.",
      "Allohdan o'zingizga eng munosib ismlar bilan so'rang (masalan, rizqni Ya Razzoq, mag'firatni Ya G'afur).",
      "Duoni kundalik odatga aylantiring - har namozdan keyin, sajdada va uxlashdan oldin.",
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Qabul qilingan duo shartlari",
    summary: "Ixlos, halol topib, gunohdan qaytish javob eshiklarini ochadi.",
    body: [
      "Odobdan tashqari, ba'zi shartlar duoning qabul qilinishiga kuchli ta'sir qiladi. Eng asosiysi ixlos - yolg'iz Allohga bo'lgan ixlos, Undan o'zgalarga iltijo qilmaslik. Haqiqatan ham duoda mavjud bo'lgan yurak mexanik tarzda o'qiydigan tildan qimmatroqdir.",
      "Halol rizq – kuchli kalit. Rasululloh sollallohu alayhi vasallam qoʻllarini osmonga koʻtarib: “Yo Rabbiy, yo Parvardigorim”, deb yigʻlayotgan bir yoʻlovchini taʼriflaganlar: “Uning taomi harom, ichganligi harom, kiyimi harom va haromdan oziqlangan boʻlsa, unga qanday javob berish mumkin?”. Daromadni asrash, gunohdan tavba qilish, biror gunohni so‘ramaslik, qarindosh-urug‘ rishtalarini uzish duo va uning qabul qilinishi o‘rtasidagi to‘siqlarni olib tashlaydi.",
      "Shunday bo'lsa ham, qabul qilish biz nazorat qiladigan savdo emas, oxir oqibat Allohning rahmatidir. Shuning uchun mo'min o'zining eng yaxshi sa'y-harakatlarini - ixlos, halol yashash, tavbani kamtar ishonch bilan birlashtiradi va agar javob kechiktirilsa, hech qachon umidsizlikka tushmaydi. Zaiflik va o'tmishdagi gunohlar so'rashni to'xtatish uchun sabab emas; Ular Rohmanga qaytishga ko'proq sababdir.",
    ],
    hadith: [{}, {}],
    actions: [
      "Daromad va xarajatlaringizni qonuniylik uchun ko'rib chiqing - bu sizning duoingizga bevosita ta'sir qiladi.",
      "Uzoq duolardan oldin istig'for va sidqidildan tavba qiling.",
      "Hech qachon yomonlik, gunoh yoki adolatsizlik so'rash uchun duo aytmang.",
    ],
  },
  {
    title: "Duo qilish uchun eng yaxshi vaqt va joylar",
    summary: "Ba'zi lahzalar duoning qabul bo'lishi uchun ayniqsa muborakdir.",
    body: [
      "Duo har qanday vaqtda ijobat bo'lsa-da, Rasululloh sollallohu alayhi vasallam ba'zi lahzalarni ajratib ko'rsatdilar va eng ko'p umid qilinadigan vaqtni aytdilar. Faqat inqirozni kutmasdan, so'rovlaringizni ularga bog'lang.",
      "Eng kuchlilari quyidagilardir: kechaning oxirgi uchdan bir qismi, Alloh taolo eng past osmonga tushsa va: «Kim Mendan so'raydi, unga bersam?», deb nido qiladi; namozdagi sajda, Allohga eng yaqin joy; azon va iqomat orasidagi vaqt; bir kishi ro'za tutayotgan paytda, ayniqsa iftorlik paytida; yomg'ir paytida; va quyosh botishidan oldin jumaning oxirgi soati, unda duo rad etilmaydigan soat bor.",
      "Muborak joylar va hollar qatoriga hajda Arafada turish, harom hovlida bo'lish, musofirning ota-onaning farzandi uchun duosi va zulmga uchragan kishining duosi kiradi. Doimiy iltijo qilish uchun ularni sobit langar sifatida foydalaning.",
    ],
    hadith: [{}, {}],
    appLinks: [{}, {}],
  },
  {
    title: "Ertalab va kechqurun adhkar",
    summary: 'Kundalik "musulmon qal\'asi" - kunning har ikki tomonida himoya va aloqa.',
    body: [
      "Ertalab va kechki adhkar sunnatda eng ko'p ta'kidlangan kundalik zikrlardan biridir - mo'min har kuni boshida va oxirida yangilanadigan ruhiy qal'a. Alloh taolo mo‘minlarga “Allohni ko‘p zikr qilinglar va ertalab va kechqurun Uni tasbeh aytinglar” (33:41–42)ni buyurgan.",
      "Doimiy tilovat qilinsa, ular zarar va shaytonning vasvasalaridan saqlaydilar, Allohga tavakkulni yangilaydilar (tavakkul qiladilar) va kunning o'zgaruvchan sharoitlarida qalbni Unga bog'laydilar. Eng muhimlaridan ikkitasi quyida keltirilgan; ilovaning adhkar to'plami to'liq to'plamni o'z ichiga oladi.",
    ],
    phrases: [
      {
        title: "Sayyid al-Istig'for (mag'firat so'rash boshlig'i)",
        when: "Har kuni ertalab va kechqurun bir marta",
      },
      {
        title: "Hasbiyallohu la ilaha illa huva",
        when: "Har kuni ertalab va kechqurun etti marta",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Uyg'ongandan keyin va uxlashdan oldin",
    summary: "Kunning birinchi va oxirgi so'zlaringizni Alloh bilan bog'lang.",
    body: [
      "Rasululloh sollallohu alayhi vasallam uyg'onish va yotish uchun alohida zikrlarni o'rgatganlar, shunda mo'minning har kuni birinchi ongli so'zlari shukr, oxirgisi esa taslim bo'lishdir. U o'rgatgan uyqu \"kichik o'lim\", uyg'onish esa kichik tirilishdir - shuning uchun adkor Allohni bilishda butun davrni tartibga soladi.",
      "Ularni muntazam ravishda o'qish ruhiy barqarorlikni rivojlantiradi: uyg'onganda shukr qilish va uxlashdan oldin qalbni Allohga topshirish tartibi. Uxlashdan oldin Rasululloh sollallohu alayhi vasallam Oyat al-Kursiyni o'qishni alohida targ'ib qilib, tilovat qiluvchining yonida Allohdan valiy bo'lishini va ertalabgacha shayton yaqinlashmasligini va'da qildilar.",
    ],
    phrases: [
      {
        title: "Uyg'onganda duo",
        when: "Uyg'ongandan so'ng darhol",
      },
      {
        title: "Uyqudan oldin duo",
        when: "Uxlash uchun yotganda",
      },
      {
        title: "Oyat al-Kursiy uyqudan oldin",
        when: "Uxlashdan oldin",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Uy va masjid duolari",
    summary: "Uyingiz va masjidga kirganingizda va chiqayotganingizda zikr qiling.",
    body: [
      "Rasululloh sollallohu alayhi vasallam hayotning kundalik ostonalariga qisqa duolarni biriktirdilar. Uydan chiqayotganda va uyga kirayotganda Allohning ismini zikr qilish himoya va baraka olib keladi va shaytonga eshikni yopadi; U kishi Allohni zikr qilib ichkariga kirsa, shayton sahobalariga: “Sizlar bu yerda tunashga joyingiz yoʻq”, deb aytadi.",
      "Masjidning o‘ziga xos odobi bor: o‘ng oyoq bilan rahmat eshiklarini so‘rab kirish, chap oyoq bilan Allohdan fazl so‘rab chiqish – masjidning Alloh huzurida rahmat, tarbiya va tavoze maskani ekanligini eslatib turadi.",
    ],
    phrases: [
      {
        title: "Uydan chiqayotganda duo",
        when: "Uydan chiqayotganda",
      },
      {
        title: "Masjidga kirayotgan duo",
        when: "Kirganda, o'ng oyoq bilan qadam qo'yish",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ovqatlanish va ichish uchun duolar",
    summary: "Har bir taomga baraka va shukr keltiruvchi qisqa adhkar.",
    body: [
      "Islom dini zikr orqali oddiy ovqatlanishni ibodatga aylantiradi. “Bismillah” bilan boshlang, ya’ni barakaga chorlovchi va shaytonni taomga sherik bo‘lishdan qaytaradi – va Allohga hamd bilan yakunlang, qalbni kuniga bir necha marta shukronalik va esdalikka o‘rgating.",
      "Sunnatda hatto unutuvchanlikni tuzatish ham berilgan: agar boshida “Bismillah” aytishni unutib qo‘ysangiz, eslaganingizda “Bismillahi avvalohu va oxirahu” (boshida va oxirida Allohning nomi bilan) ayting.",
    ],
    phrases: [
      {
        title: "Ovqatlanishdan oldin",
        when: "Ovqatlanish boshida",
      },
      {
        title: "Ovqatdan keyin",
        when: "Ovqatni tugatayotganda",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Tahorat va namoz atrofidagi duolar",
    summary: "Tahoratdan oldin va keyin, namozning o'zida o'qiladigan duolar.",
    body: [
      "Tahorat va namoz qabul qilingan zikr uchun eng katta kundalik ochilishdir, shuning uchun sunnat ularni duo bilan to'ldiradi. Iymon shahodati bilan tahorat olish jannatning sakkiz eshigini ochadi; va namoz ichida - sujudda va oxirgi salom oldidan - imonlilar kunida eng ko'p qabul qilingan ikki daqiqadir.",
      "Ushbu lahzalar uchun haqiqiy iboralarni o'rganish marosim harakatlarini Alloh bilan ongli suhbatga aylantiradi.",
    ],
    phrases: [
      {
        title: "Tahoratdan keyin",
        when: "Tahorat olgach, darhol",
      },
      {
        title: "Namozda salom berishdan oldin",
        when: "Oxirgi tashahhudda, namozni tugatishdan oldin",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Azon va iqomatda duo",
    summary:
      "Da'vatga javob bering, Allohdan Payg'ambar sollallohu alayhi vasallamning mavqelarini so'rang, so'ngra duo qiling.",
    body: [
      "Azon aytilsa, muazzindan so'ng sunnat takrorlanadi, so'ngra Payg'ambar sollallohu alayhi vasallamga salovot aytiladi, so'ngra Allohdan unga al-Vasila berishini so'rab duo o'qiladi.",
      "Azon va iqomat orasidagi oyna shaxsiy duo uchun qabul qilingan vaqtlardan biridir; Rasululloh sollallohu alayhi vasallam aytdilarki, o'shanda qilingan duo qaytarilmaydi, shuning uchun uni Allohdan o'z ehtiyojlaringiz uchun so'rang.",
    ],
    phrases: [
      {
        title: "Azondan keyin duo",
        when: "Azon tugagach",
      },
    ],
    hadith: [{}],
    appLinks: [{}, {}],
  },
  {
    title: "Xavotir va qayg'u",
    summary:
      "Qalbni tavakkul va Rasululloh sollallohu alayhi vasallamning duolari bilan mahkamlang.",
    body: [
      "Islom mashaqqatni amaliy ruhiy vositalar: duo, zikr, ibodat va Allohning hukmiga tavakkal qilish bilan qarshi oladi. Rasululloh sollallohu alayhi vasallam o'zlari qayg'u va qiyinchilikka duchor bo'lib, tashvish (hamm), g'am (hazon) va qo'rquv uchun aniq duolarni o'rgatganlar.",
      "Ushbu duolar qonuniy yo'llar bilan yordam so'rashning o'rnini bosa olmaydi, shu jumladan zarur bo'lganda tibbiy yoki professional yordam. Balki ular o'sha vositalar bilan birga qalbni mustahkamlaydilar, mo'minga nafosat yolg'iz Allohning huzurida ekanini eslatib turadilar.",
    ],
    phrases: [
      {
        title: "Xavotir va qayg'u uchun duo",
        when: "Qiyinchilikda, tashvishda yoki haddan tashqari qayg'uda",
      },
      {
        title: "Bizga Alloh yetarli",
        when: "Qo'rqib ketganda yoki haddan tashqari ko'tarilganda",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kasallik va qo'rquv",
    summary: "Davolanishning halol vositalarini olib, Allohdan shifo so'rang.",
    body: [
      "Sunnat duo bilan davolanishga qo'shiladi: Payg'ambarimiz sollallohu alayhi vasallam: “Har bir dardning davosi bor”, deb ta'lim berganlar va davo izlashga buyurganlar, shu bilan birga ruqya orqali qalblar va tanalarni davolaganlar - Qur'on tilovat qilib, bemorga sahih duolar qilganlar. Mo'min ikkalasini ham qiladi: dorini oladi va Tabibga murojaat qiladi.",
      "Taʼsir qiluvchi sababning nomi muhim: Alloh ash-Shofidir, shifo beruvchidir va dori faqat U yaratgan vositadir. Qo'rquvda ham qalb Unga omonlik va mustahkamlik so'rab murojaat qiladi, chunki O'zigina omonlikni beradi.",
    ],
    phrases: [
      {
        title: "Shifo uchun duo",
        when: "Kasal bo'lganida yoki kasal bo'lgan kishi uchun ibodat qilish",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Kechirim va yo'l-yo'riq",
    summary: "Doim kechirim, sabr va to'g'ri hidoyat so'rang.",
    body: [
      "Mag'firat so'rash (istig'for) katta gunohlardan keyin saqlanmaydi - bu mo'minning kundalik ritmidir. Allaqachon kechirilgan Payg'ambar sollallohu alayhi vasallam bir kunda yetmish martadan ortiq Allohdan mag'firat so'rab, qalbni doimo sayqallash kerakligini o'rgatgan.",
      "Yo'l-yo'riq, xuddi shunday, bir martalik emas, doimiy ehtiyojdir. Hatto qattiq amal qiluvchi mo'minlar ham Allohdan qalblarini to'g'ri saqlashini so'raydilar, chunki qalblar aylanadi va ularni qaytaruvchi ham Allohdir. Rasululloh sollallohu alayhi vasallam qalblari dinda mustahkam bo‘lishi uchun ko‘p duo qilar edilar.",
    ],
    phrases: [
      {
        title: "Tez-tez tavba qilish",
        when: "Takroriy ravishda, kun davomida",
      },
      {
        title: "Sobit yurak uchun duo",
        when: "Zalolatdan yoki ikkilanishdan qo'rqqaningizda",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Sayohat va yomg'ir duolari",
    summary: "Yo'lga chiqish uchun duolar, yomg'irning rahmati uchun.",
    body: [
      "Sayohat ham zaif, ham ma’qul bo‘ladigan holatdir – Payg‘ambarimiz sollallohu alayhi vasallam yo‘lovchining duosi ijobat bo‘lishini o‘rgatganlar va Allohning qudratini va Unga qaytishimizni tan oladigan mashinaga chiqish va yo‘lga chiqish uchun duo qilganlar.",
      "Yomg'ir Alloh taolodan nozil bo'lgan rahmatdir, yog'ish vaqti esa duo qilish vaqtidir. Rasululloh sollallohu alayhi vasallam yomg'irni qisqa duo bilan kutib olardilar, uning zarar keltirmasligini, foyda keltirishini so'rardilar.",
    ],
    phrases: [
      {
        title: "Sayohatga chiqishda duo",
        when: "Transportni o'rnatish va ketishda",
      },
      {
        title: "Yomg'ir yog'sa duo",
        when: "Yomg'irning boshida",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Ta'minot va oila",
    summary: "Allohdan halol rizq va xonadonda yaxshilikni so'rang.",
    body: [
      "Rizq faqat Allohdandir. mo'min tuyasini bog'laydi - ishlab va topadi - keyin rizq beruvchidan halol rizq, topganidan barakot, qarzdan xalos bo'lish va boshqalarga muhtojlikdan mustaqil bo'lishni so'raydi. Rasululloh sollallohu alayhi vasallam aynan shuni so'raydigan go'zal duoni o'rgatganlar.",
      "Uy uchun Qur'onning o'zi solihlarning duosini o'rgatadi: \"ko'zlarga taskin\" bo'lgan turmush o'rtoqlar va farzandlar berish va imon, ibodat va rahm-shafqat bilan bog'langan xonadonni boshqarish.",
    ],
    quran: [{}],
    phrases: [
      {
        title: "Qonuniy ta'minlash uchun duo",
        when: "Ertalab, namozdan keyin va moliyaviy tanglikda",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Qur'on duolari",
    summary: "Qur'onda Allohning O'zi o'rgatgan duolar.",
    body: [
      "Qur'ondagi duolar Alloh taoloning payg'ambarlar va mo'minlar tiliga qo'ygan, so'ngra biz takrorlashimiz uchun saqlab qo'ygan so'zlaridir - qisqa, keng qamrovli va yaxshilash mumkin emas. Ko'pchilik \"Rabbana\" (Rabbimiz) bilan boshlanadi va ular yodlash va doimiy tilovat qilish uchun idealdir.",
      "Ular oʻrtasida moʻminning barcha ehtiyojlarini qamrab oladi: magʻfirat, hidoyat, sabr, rahm-shafqat, solih oila, doʻzaxdan himoya va ikki dunyoda muvaffaqiyat. Allohning so'zi bilan ibodat qilish duoning eng ishonchli shakllaridan biridir.",
    ],
    phrases: [
      {
        title: "Ikki dunyoda ham yaxshi",
        when: "Rasululloh sollallohu alayhi vasallamning umumiy, har tomonlama duosi",
      },
      {
        title: "Imondagi sobitlik",
        when: "Og'ishdan qo'rqqaningizda yoki hidoyat qilinganidan keyin",
      },
    ],
    appLinks: [{}, {}],
  },
  {
    title: "Payg'ambarlik duolari",
    summary: "Payg'ambarimiz Muhammad sollallohu alayhi vasallam tomonidan o'rgatilgan duolar.",
    body: [
      "Payg'ambarimiz sollallohu alayhi vasallamga \"eng keng qamrovli nutq\" (javomi' al-kalim) berilgan bo'lib, uning duolari uni aks ettiradi: qisqa so'z, ma'nosi keng va dunyo va keyingi hayot ehtiyojlari o'rtasida mukammal mutanosiblik. Ular hidoyat, qalb pokligi, sog'lik, mag'firat, himoya va go'zal xulq so'raydilar.",
      "Asosiy printsip: ishonchli to'plamlardan haqiqiy, yaxshi tasdiqlangan duolarga rioya qiling va o'ylab topilgan mukofotlar bilan zaif yoki uydirma duolarni tarqatishdan saqlaning. Haqiqiy sunnat xazinasi yetarlichadir.",
    ],
    phrases: [
      {
        title: "To'rtlikning keng qamrovli duosi",
        when: "Umumiy kundalik duo",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Zikr va tasbeh",
    summary: "Katta vazn va mukofot haqida qisqacha eslatmalar.",
    body: [
      "Zikr — Allohni zikr qilish — tasbeh (Subhanalloh), tahmid (Alhamdulillah), tahlil (La ilaha illalloh), takbir (Allohu Akbar) va istig‘forni o‘z ichiga oladi. Bular tildagi eng yengil so'zlardan bo'lib, tarozida eng og'ir bo'lib, tirik qalbning g'aflatdan himoyasidir.",
      "Payg‘ambarimiz sollallohu alayhi vasallam “Tilga yengil, taroziga og‘ir, Rohmanga mahbub” iboralarini ta’riflab, har kuni yuz marta “Subhanallohi va bihamdih” desa, uning gunohlari dengiz ko‘pikiga o‘xshab ketsa ham, o‘chiriladi, deb o‘rgatganlar. Namozdan keyin va kun bo'yi to'xtatilgan zikr iymonni saqlaydi.",
    ],
    phrases: [
      {
        title: "Sevimli va gunohlarni o'chiruvchi so'zlar",
        when: "Kun davomida; 100 marta gunohlarni o'chiradi",
      },
      {
        title: "Tarozida og'ir ikki so'z",
        when: "Istalgan vaqtda",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Payg'ambar sollallohu alayhi vasallamga salovotlar",
    summary: "Rasululloh sollallohu alayhi vasallamga salovot aytish har kungi rahmat bulog‘idir.",
    body: [
      "Payg'ambar sollallohu alayhi vasallamga salovot aytishni Alloh taolo Qur'onda buyurgan: \"Albatta, Alloh va Uning farishtalari Payg'ambarga salovot aytadilar. Ey mo'minlar, u zotga salovot va salom aytinglar\" - va boshqa hech bir duo bunday kafolatli qaytarilmaydi: Payg'ambarimiz sollallohu alayhi vasallam aytdilarki, kim unga bir salovot aytsa, Alloh o'sha kishiga o'nta salovot yuboradi\".",
      "Tez-tez salovot o'qish rahm-shafqat keltiradi, martabalarni ko'taradi, gunohlarni o'chiradi va qiyomat kuni Rasululloh sollallohu alayhi vasallamga yaqinroq bo'ladi. Quyidagi to'liq Ibrohim qiyofasi - u sahobalari unga qanday salovat aytishni so'raganlarida o'rgatgan - har bir namozning tashahhudida o'qiladi va kun davomida tilda saqlash uchun ajoyibdir.",
    ],
    quran: [{}],
    phrases: [
      {
        title: "To'liq salavot Ibrohimiya",
        when: "Namozning tashahhudida va kun davomida",
      },
    ],
    appLinks: [{}],
  },
  {
    title: "Manbalar va haqiqiylik",
    summary: "Qur'on va sahih hadislarni aniq iqtibos bilan birinchi o'ringa qo'ying.",
    body: [
      "Ushbu modul ta'limga asoslangan va partiyaviy emas, to'liq Qur'on va keng qabul qilingan sahih (sahih/hasan) hadislar asosida qurilgan bo'lib, har birida kuzatilishi mumkin bo'lgan havolalar mavjud. Kundalik duolarning oltin standarti aynan shunday: ma'lum manba bilan tasdiqlangan matn.",
      "Duoga jiddiy e'tibor berish kerak: Internetda ko'plab duolar o'ylab topilgan so'zlar va bo'rttirilgan mukofotlar bilan tarqaladi (\"buni o'qing va barcha gunohlaringiz yo'qoladi\"). Uydirma hadis jiddiy masala, shuning uchun uni qabul qilish yoki yuborishdan oldin notanish rivoyatni tekshiring.",
      "Yodlash va kundalik mashq qilish uchun uzoq vaqtdan ko'ra chin dildan davom eta oladigan qisqa, sahih duolarni afzal ko'ring - doimiylik Allohga hajmdan ko'ra sevimliroqdir. Maktablar bir-biridan farq qiladigan joylarda malakali mahalliy olimdan o'rganing.",
    ],
    actions: [
      "Uni baham ko'rishdan oldin har qanday notanish duo manbasini tekshiring.",
      "Bir nechta ixcham haqiqiy duolarni tanlang va ularni har kuni ushlab turolmaydigan ko'p duolardan ko'ra saqlang.",
      "Har bir darsni haqiqiy amaliyot bilan bog'lash uchun ilovaning mavzu havolalaridan foydalaning.",
    ],
    disclaimer:
      "Ta'lim mazmuni shaxsiylashtirilgan fiqh maslahatlarini almashtirmaydi. Muayyan ishlar bo'yicha hukmlarni malakali olimlardan so'rang.",
    appLinks: [{}, {}, {}, {}],
  },
];

export const LEARN_DUA_OCCASIONS_UZ: DeepPartial<LearnDuaOccasion>[] = [
  {
    title: "Xayrli tong",
    summary: "Kunni eslash bilan boshlang",
  },
  {
    title: "Kechqurun",
    summary: "Kechqurun himoya qilish",
  },
  {
    title: "Uyg'ongandan keyin",
    summary: "Uyg'onganingizdagi birinchi so'zlar",
  },
  {
    title: "Uyqudan oldin",
    summary: "Kecha uchun duo va zikr",
  },
  {
    title: "Uyga kirish",
    summary: "Bismilloh va salom",
  },
  {
    title: "Uydan chiqish",
    summary: "Tashqariga chiqayotganda tavakkul",
  },
  {
    title: "Masjid",
    summary: "Masjidga kirish va chiqish",
  },
  {
    title: "Ovqatdan oldin va keyin",
    summary: "Ovqatlanishda minnatdorchilik",
  },
  {
    title: "tahorat",
    summary: "Tahoratdan oldin va keyin",
  },
  {
    title: "Namoz",
    summary: "Namozdan oldin, davomida va keyin",
  },
  {
    title: "Xavotir va tashvish",
    summary: "Duo bilan qalbni tinchlantir",
  },
  {
    title: "Kasallik",
    summary: "Shifo va sabr",
  },
  {
    title: "Kechirim",
    summary: "Istig'for va tavba",
  },
  {
    title: "Sayohat",
    summary: "Yo'lga chiqish va qaytish",
  },
  {
    title: "Ta'minlash",
    summary: "Allohdan halol rizq so'rash",
  },
  {
    title: "Qur'on duolari",
    summary: "Allohning Kitobidan duolar",
  },
];
