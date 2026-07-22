import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// uz overlay for fidyah-guide. Index-aligned with FIDYAH_GUIDE_TOPICS in ../fidyah-guide.ts.
// Literary translation pack — untranslated nested fields fall back to English.
export const FIDYAH_GUIDE_TOPICS_UZ: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Qazomi, fidyami yoki kafforatmi?",
    summary: "Uch xil vosita - ularni aralashtirmang.",
    body: [
      "O'tkazib yuborilgan Ramazon ro'zalarining hammasi bir xil emas. Vaqtinchalik qobiliyatsizlik - tuzalishini kutayotgan kasallik, sayohat, homiladorlik yoki emizish paytida ro'za tutish zarar keltiradigan va shunga o'xshash uzrlar - boshqa kunlarda ro'za tutish (qazo) bilan keyin tutiladi. Qurʼoni karimda: “...Kim kasal boʻlsa yoki safarda boʻlsa, bas, boshqa kunlarning soniga teng” (Baqara surasi, 185-oyat) deyiladi.",
      "Fidya (kambag'allarni to'ydirish uchun to'lov) ro'za tutolmaydigan va tutgan kunini to'ldirishdan umidvor bo'lmaganlar uchun - klassik keksalar yoki surunkali kasallar uchundir, ular uchun ro'za doimiy mashaqqatdir. Qur'onda ro'za tutish juda og'ir bo'lganlar uchun fidya sifatida bir kambag'alni ovqatlantirish zikr qilingan (Baqara surasi, 184-oyat). Bu oyat sog'lom ro'za tutishga ruxsat bermaydi.",
      "Kafforat (kafforat) og'irroqdir. Bu, biror kishi qasddan Ramazon ro'zasini uzrsiz ochsa, maktablar tomonidan kafforat talab etiladigan usulda qo'llaniladi, ya'ni Ramazon oyining kunduzi jinsiy aloqa qilish, Sahih Muslimdagi mashhur rivoyatda bo'lgani kabi. Maqtablar ataylab yeb-ichish ham bir xil kafforatni vojib qilishi borasida ixtilof qiladilar. Bu yordamchi faqat miqdorlarni hisoblaydi; malakali mahalliy olim sizning ishingizni tasniflashi kerak.",
    ],
    actions: [
      "Agar siz keyinroq ro'za tutib, kunlarni qazo qila olsangiz, fidya emas, qazoni rejalashtiring.",
      "Agar ro'za tutishning iloji bo'lmasa, har bir o'tkazib yuborilgan kun uchun fidya haqida olimdan so'rang.",
      "Agar siz ataylab ro'za tutgan bo'lsangiz, ilova bahosiga tayanmang - qaysi hukm amal qilishini olimdan so'rang.",
    ],
    quran: [
      {
        excerpt:
          "...Kimki (ro‘za tutishga qodir bo‘lsa, lekin mashaqqat bilan) bir kambag‘alni to‘ydirish fidyasi... Va kim kasal yoki safarda bo‘lsa, boshqa kunlar soniga teng.",
      },
    ],
  },
  {
    title: "O'tkazib yuborilgan ro'za uchun fidya nima?",
    summary:
      "Bir kambag'alga qazo qilish mumkin bo'lmaganda o'tkazib yuborilgan kunga ovqat beriladi.",
    body: [
      "Doimiy mashaqqat bilan ro'za tuta olmaydiganlar uchun Qur'on fidyasi har kuni uchun bir kambag'alni ovqatlantirishdir (Baqara surasi, 184-oyat). Olimlar buni fidya birligi deb hisoblashadi: bir kunlik ro'za tutish bir muhtoj odamni to'ydirish (yoki sizning yashash joyingizda keng tarqalgan oziq-ovqat ekvivalentini berish) bilan mos keladi.",
      "Taomning aniq o'lchovi (mudd, so' yoki mahalliy taom) va naqd pul ekvivalenti qabul qilinadimi, maktabga va mahalliy fatvo kengashlarining amaliyotiga qarab farq qiladi. Ko'pgina jamoalar har yili bir kambag'alni boqish narxiga qarab fidya miqdorini nashr etadilar. Umumiy miqdorni baholash uchun yordamchiga ushbu mahalliy birlikni kiriting - bu majburiy baholash emas, balki rejalashtirish vositasi.",
      "Fidya tavbaning o‘rnini bosmaydi va kambag‘allarga kambag‘allikdan ortiq g‘amxo‘rlik qilmaydi. Ixlos bilan sadaqa bering, agar ro'za tutish qobiliyatingiz keyinroq qaytsa, olimdan sizning holatingizda boshqa qazo bor-yo'qligini so'rang.",
    ],
    actions: [
      "Ishingiz fidya ekanligini olim bilan tasdiqlang (faqat qazo emas).",
      "Mavjud bo'lganda, mahalliy masjidingiz yoki kengashning kunlik fidya tarifidan foydalaning.",
      "Rejalashtirish hisobi uchun kunlar × bir taom (yoki nashr etilgan fidya birligi) ko'paytiriladi.",
    ],
    quran: [
      {
        excerpt:
          "...Va [ro‘za tutishga qodir bo‘lganlarga, lekin mashaqqat bilan] bir kambag‘alni ovqatlantirish uchun fidya. Kim ixtiyoriy yaxshilik qilsa, o'zi uchun yaxshidir. Agar bilsangiz, ro‘za tutish sizlar uchun yaxshiroqdir.",
      },
    ],
  },
  {
    title: "Odatda fidyani kim to'laydi?",
    summary: "Doimiy qobiliyatsizlik - har bir ro'za o'tkazib yuborilmaydi.",
    body: [
      "Keyinchalik ro'za tutish o'rniga fidyaning klassik holatlari ro'za tutolmaydigan va qazo qilishni kuta olmaydiganlardir, masalan, keksa yoshdagi yoki ro'za doimiy zarar keltiradigan surunkali kasallik. Keyinchalik o'tadigan vaqtinchalik kasallik odatda boshqa kunlarda ro'za tutish bilan qoplanadi (Qur'on 2:185).",
      "Homiladorlik va emizish maktablar tomonidan ehtiyotkorlik bilan davolanadi: ba'zilari faqat qazo talab qiladi; boshqalar ro'za onaga yoki bolaga zarar keltirishi mumkin bo'lsa, qo'shimcha ravishda fidya haqida bahslashadi. Faqat kalkulyatordan qaror qilmang.",
      "Agar biror kishi Ramazon ro'zasini tutmagan holda vafot etsa, merosxo'rlar ularning nomidan ro'za tutishlari yoki sahih ma'lumotlar va ilmiy ma'lumotlarga ko'ra kambag'allarga ovqat berishlari mumkin (Marhumning ro'zasi haqida Buxoriy 1952 ga qarang). Oilangizning ishini olimdan so'rang.",
    ],
    disclaimer:
      "Homiladorlik, emizish va surunkali kasalliklarning tasnifi ilmiy hukmdir. Bu mavzu faqat tarbiyaviy ahamiyatga ega.",
    quran: [
      {
        excerpt:
          "...Bas, kim oyni [yangi oyni] ko'rsa, ro'za tutsin. Kim kasal bo'lsa yoki safarda bo'lsa, boshqa kunlardan bir xil miqdorda. Alloh sizlarga osonlikni xohlaydi, qiyinchilikni xohlamaydi...",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bir kishi: Onam ro'za tufayli vafot etdi. Uning nomidan ro'za tutsam bo'ladimi? Rasululloh sollallohu alayhi vasallam: «Ha, Allohning qarzi to'lashga haqliroqdir», dedilar.",
      },
    ],
  },
  {
    title: "Ro'zani ataylab buzganlik uchun kafforat",
    summary: "Qul ozod qilish yoki oltmishta ro‘za tutish yoki oltmishta miskinni to‘ydirish.",
    body: [
      "Abu Hurayra raziyallohu anhu rivoyat qiladilar: “Bir kishi Rasululloh sollallohu alayhi vasallamning huzurlariga kelib, Ramazon oyida ro‘za tutganida xotini bilan yaqinlik qilgani uchun halok bo‘lganini aytdi. Rasululloh sollallohu alayhi vasallam qul ozod qila olamanmi, deb so'radilar. keyin ikki oy ketma-ket ro'za tuta oladimi? so‘ng oltmishta kambag‘alni to‘yg‘aza olarmikin – va imkoni bo‘lmasa, yordam berdi (Sahih Muslim 1111; Yana Buxoriy 1936).",
      "Bu darajali kafforat Ramazon ro'zasida jinsiy aloqaning kafforati uchun matn asosidir. Rivoyatdagi tartib: ozod qilish, keyin oltmish kun ketma-ket ro'za tutish, so'ngra oltmishta miskinni ovqatlantirish. Har bir qadamda qobiliyatsizlik, maktablar hisobotni o'qishiga ko'ra, odamni keyingi variantga o'tkazadi.",
      "Qasddan uzrsiz yeb-ichish ham xuddi shu kafforatni farz qiladimi, mazhablar o'rtasida ma'lum farqli nuqtadir. Yordamchining \"kafforat\" bahosi har bir voqea birligida oltmishta kambag'alni (yoki oltmish kunlik ro'zani) to'ydirish modelini ko'rsatadi - faqat olim kafforat borligini aytganidan keyingina.",
    ],
    actions: [
      "Samimiy tavba qiling va gunohkor ishni darhol to'xtating.",
      "Malakali olimdan qaysi kafforat qarzingiz borligini so'rang.",
      "Agar oltmishta kambag'alni oziqlantirish siz bajarishingiz mumkin bo'lgan variant bo'lsa, rejalashtirish ko'rsatkichi sifatida mahalliy ovqatlanish narxi × 60 dan foydalaning.",
    ],
    hadith: [
      {
        excerpt:
          "Bir kishi: Men halok bo'ldim, ey Allohning Rasuli, Ramazon oyida xotinim bilan yaqinlik qildim. Undan bir qul ozod qilish, ikki oy ketma-ket ro‘za tutish va oltmishta miskinni to‘ydirish haqida so‘rashdi...",
      },
      {
        excerpt:
          "Biz Rasululloh sollallohu alayhi vasallam huzurlarida o‘tirganimizda bir kishi kelib: “Men halok bo‘ldim... U zot ro‘za tutganlarida xotini bilan yaqinlik qildilar...” dedi.",
      },
    ],
  },
  {
    title: "Ushbu yordamchidan qanday foydalanish kerak",
    summary: "Faqat hisob-kitoblar — mahalliy taom yoki fidya narxlarini kiriting.",
    body: [
      "Fidya hisob-kitobi kunlar sonini bir kambag'al odamni (yoki sizning e'lon qilingan mahalliy fidya birligingizni) boqish narxiga ko'paytiradi. Kafforat hisob-kitobi hodisa birligi uchun oltmishta taomga ko'payadi, bu Sahih Muslim 1111dagi ovqatlanish variantini aks ettiradi - yoki bu variant tanlangan bo'lsa, oltmish ketma-ket ro'za kunini ko'rsatadi.",
      "O'z valyutangizda summalarni kiriting. Joriy yil uchun ishonchli mahalliy masjid, Islom markazi yoki ilmiy kengash tomonidan e'lon qilingan fidya stavkasini afzal ko'ring. Agar hech kim nashr etilmasa, bitta muhtoj odam uchun asosiy oziqlantiruvchi taomning real narxi umumiy rejalashtirish proksi hisoblanadi - hali ham ilmiy tasdiqlanishi kerak.",
      "Hech qachon ekrandagi jami fatvo sifatida qaramang. Agar qazo, fidya, kafforat yoki tavbadan boshqa qarzingiz borligiga ishonchingiz komil bo'lmasa, kalkulyatorni to'xtatib turing va vaziyatingizni biladigan olimdan so'rang.",
    ],
    disclaimer:
      "Munib Tracker faqat ta'lim baholarini beradi. Islomiy huquqiy hukmlarni chiqarmaydi.",
    actions: [
      "Hisoblashdan oldin bu yilgi mahalliy fidya stavkasini ko'rib chiqing.",
      "O'z yozuvlaringiz uchun kunlar va miqdorlarni yozib oling.",
      "Kambag'allarga yetib boradigan ishonchli kanal orqali bering.",
    ],
  },
];
