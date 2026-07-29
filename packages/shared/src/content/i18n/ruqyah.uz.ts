import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Uzbek translation overlay for the Learn ruqyah guide. Mirrors the order of
// RUQYAH_TOPICS in ../ruqyah.ts (index-aligned); untranslated entries fall back
// to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const RUQYAH_TOPICS_UZ: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Ruqya nima?",
    summary: "Shifo uchun Qur'on, Allohning ismlari yoki payg'ambar duolarini o'qish.",
    body: [
      "Ruqya — o'zi yoki boshqa bir kishi ustiga Qur'on, Allohning ism va sifatlarini, yoki sahih payg'ambar duolarini o'qish — ko'pincha yengil nafas bilan — faqat Allohdan shifo yoki himoya so'rash. Bu Islomdan oldin ham umumiy arab odati sifatida mavjud bo'lgan, va Payg'ambardan ﷺ bu ruxsat etilganligi haqida to'g'ridan-to'g'ri so'ralgan.",
      "Avf ibn Molik rivoyat qiladi, sahobalar dedilar: 'Biz johiliyat davrida ruqya qilardik; bu haqda fikringiz qanday?' Payg'ambar ﷺ javob berdi: 'Ruqyangizni menga ko'rsating — ruqyada shirk bo'lmasa, hech qanday zarar yo'q' (Sahih Muslim 2200). Ushbu bitta hadis shu qo'llanmadagi hamma narsaning asosidir: ruqyaning o'zi ruxsat etilgan; muhimi uning mazmunidir.",
    ],
    hadith: [
      {
        excerpt:
          "Biz johiliyat davrida ruqya qilardik va aytdik: Ey Allohning Rasuli, bu haqda fikringiz qanday? U dedi: Ruqyangizni menga ko'rsating — ruqyada shirk bo'lmasa, hech qanday zarar yo'q.",
      },
    ],
  },
  {
    title: "Halol va harom ruqya",
    summary: "Qur'on, Allohning ismlari, aniq duo — hech qachon shirk yoki g'ayb emas.",
    body: [
      "Halol ruqya olimlar hadisdan chiqargan shartlarga asoslanadi: u Qur'on, Allohning ism va sifatlarini, yoki sahih payg'ambar duosini ishlatadi; ma'nosi tushunarli tilda bo'ladi (noma'lum bo'g'in yoki ramzlar emas); va o'qiydigan va davolanadigan kishi ikkisi ham ruqyaning o'zida kuch yo'qligiga ishonadi — shifo faqat Allohdan, so'zlar esa U ruxsat bergan vositadir.",
      "Payg'ambar ﷺ buni shaxsan namoyish etdi: Oyisha rivoyat qiladi, u kasal bo'lganida Muavvizatni (oxirgi ikki surani) o'zi ustiga o'qib, dam olardi, oxirgi kasalligi og'irlashganda esa u ham xuddi shunday qilib, barakasini umid qilib, o'z qo'li bilan uning tanasini artardi (Buxoriy 5016). Bu ruqyaning eng aniq, eng sahih shaklidir.",
      "Ruqya shirkga o'tganda harom bo'ladi: Allohdan boshqasiga murojaat qilish, jinlardan yordam so'rash, ma'nosi noaniq bo'lgan noma'lum so'z yoki ramzlarni ishlatish, tumor yoki afsun taqish, yoki ruqya qiluvchining g'ayb ilmiga ega ekanligini yoki kafolatlangan shifo berishini da'vo qilish. U hech qachon besh vaqt namozning yoki tegishli tibbiy davolanish izlashning o'rnini bosmaydi — u ikkisini ham to'ldiradi, o'rnini bosmaydi.",
    ],
    hadith: [
      {
        excerpt:
          "Allohning Rasuli ﷺ har safar kasal bo'lganida Muavvizatni o'qib, so'ngra tanasiga dam olardi. U og'ir kasal bo'lganida men ularni o'qib, barakasini umid qilib, uning qo'li bilan tanasini artardim.",
      },
    ],
    disclaimer:
      "Ruqya ruhiy amaliyot, tibbiy davolanish emas. U jismoniy yoki ruhiy kasallik uchun malakali shifokorga murojaat qilishning o'rnini bosmaydi, besh vaqt namozning ham o'rnini bosmaydi.",
  },
  {
    title: "Ruqya sifatida Fotiha surasi",
    summary: "Ochilish surasi — aniq ruqya sifatida tasdiqlangan.",
    body: [
      "Abu Said al-Xudriy rivoyat qiladi, qabila boshlig'ini ilon chaqqanida, Payg'ambarning ﷺ sahobalaridan biri unga Fotiha surasini o'qidi va u shifo topdi. Sahobalar keyinroq Payg'ambardan ﷺ bu ruxsat etilganligini so'raganlarida, u kulib dedi: 'Buning ruqya ekanini qayerdan bildingiz?' — Fotiha, samimiy ishonch va tushunish bilan o'qilganda, o'zi haqiqiy ruqya ekanligini tasdiqlab (Buxoriy 5736).",
      "Ushbu ilovaning Qur'on o'qish qismi Fotihaning to'liq matni va tarjimasini o'z ichiga oladi; bu qo'llanma uni bu yerda qayta keltirmasdan faqat ruqya manbai sifatida ko'rsatadi.",
    ],
    quran: [{ excerpt: "Mehribon va Rahmli Allohning nomi bilan..." }],
    hadith: [
      {
        excerpt:
          "Ulardan biri Fotiha surasini o'qishni boshladi... bemor shifo topdi. Payg'ambardan ﷺ so'raganlarida, u kulib dedi: Fotihaning ruqya ekanini qayerdan bilasiz?",
      },
    ],
    appLinks: [{ label: "Fotihani o'qish" }],
  },
  {
    title: "Oyat al-Kursiy (2:255)",
    summary: "Taxt oyati — tunda Allohning himoyasi uchun o'qiladi.",
    body: [
      "Oyat al-Kursiy (Qur'on 2:255) Allohning mutlaq hukmronligini tasvirlaydi va ayniqsa uxlashdan oldin himoya uchun keng o'qiladi. Abu Hurayra rivoyat qiladi, u qo'riqlagan zakotdan o'g'irlik qilayotgan tungi mehmon unga dedi: 'Har safar yotishga borganingda, Oyat al-Kursiyni o'qi — Allohdan bir qo'riqchi sen bilan qoladi, va hech qanday shayton tonggacha senga yaqinlashmaydi.' Payg'ambar ﷺ buni eshitganda tasdiqladi: 'U senga rost aytdi, garchi u yolg'onchi bo'lsa ham — bu shayton edi' (Buxoriy 5010).",
      "Ushbu qo'llanmadagi boshqa oyatlar kabi, bu yerda faqat qisqa parcha berilgan; to'liq oyatni va uning tarjimasini ilovaning Qur'on o'qish qismida o'qing.",
    ],
    quran: [{ excerpt: "Alloh — Undan boshqa iloh yo'q, Abadiy Tirik, Borliqni Ushlab Turuvchi." }],
    hadith: [
      {
        excerpt:
          "Har safar yotishga borganingda, Oyat al-Kursiyni o'qi — Allohdan bir qo'riqchi seni butun tun himoya qiladi, va hech qanday shayton tonggacha senga yaqinlashmaydi.",
      },
    ],
    appLinks: [{ label: "Oyat al-Kursiyni o'qish" }],
  },
  {
    title: "Ixlos, Falaq va Nos (112–114)",
    summary: "Uchta yakuniy sura — Payg'ambarning ﷺ tungi ruqyasi.",
    body: [
      "Oyisha Payg'ambarning ﷺ tungi odatini tasvirladi: har kecha uxlashdan oldin u kaftlarini birlashtirar, Ixlos surasini, Falaq surasini, va Nos surasini o'qirdi, kaftlariga dam olardi, va ularni tanasiga artardi — bosh va yuzdan boshlab — buni uch marta takrorlardi (Buxoriy 5017). Xuddi shu uch sura (Ixlos Allohning yagonaligini tasdiqlaydi, ikki Muavvizat esa yovuzlikdan himoya so'raydi) u kasallik davomida o'zi ustiga o'qigan narsalar ham edi (Buxoriy 5016).",
      "Birgalikda ular mavjud eng sodda va eng sahih kunlik ruqya odatlaridan birini tashkil qiladi — yodlash uchun yetarlicha qisqa, va Sunnatda to'g'ridan-to'g'ri tasdiqlangan.",
    ],
    quran: [
      { excerpt: "Ayt: U Alloh, Yagonadir." },
      { excerpt: "Ayt: Tong Robbisidan panoh so'rayman." },
      { excerpt: "Ayt: Insonlar Robbisidan panoh so'rayman." },
    ],
    hadith: [
      {
        excerpt:
          "Payg'ambar ﷺ yotishga borganida, kaftlarini birlashtirar va Ixlos, Falaq va Nos suralarini o'qigandan so'ng ularga dam olardi, so'ngra qo'llari yeta oladigan tanasining qismlariga artardi, bosh va yuzdan boshlab. U buni uch marta qilardi.",
      },
    ],
    actions: [
      "Ixlos, Falaq, va Nosni yodlang.",
      "Payg'ambar ﷺ qilgani kabi, har kecha uxlashdan oldin ularni o'qing.",
    ],
    appLinks: [{ label: "Uch surani o'qish" }],
  },
  {
    title: "Kunlik himoya: ertalabki va kechki zikrlar",
    summary: "Himoya uchun ruqyaning davomiy, kunlik shakli.",
    body: [
      "Muayyan kasallik uchun ruqyadan tashqari, Payg'ambar ﷺ doimiy ruhiy himoya bo'lib xizmat qiladigan ertalabki va kechki zikrlar (adhkar) to'plamini o'rgatdi — ularning ko'pchiligi boshqa sahih duolar bilan birga bu qo'llanmada qamrab olingan xuddi shu oyatlardir (Oyat al-Kursiy, uchta yakuniy sura). Faqat biror narsa noto'g'ri his qilinganda ruqyaga murojaat qilish o'rniga ularni doimiy o'qish, har kuni Allohning himoyasini izlashning Sunnat yo'lidir.",
      "Ushbu ilovaning zikr kutubxonasi ertalabki va kechki zikrlarning to'liq, manbali to'plamini bir joyda saqlaydi, o'qish yoki kunlik kuzatish uchun tayyor.",
    ],
    actions: [
      "Bomdod namozidan keyin ertalabki zikrlarni o'qing.",
      "Shom/quyosh botishidan oldin kechki zikrlarni o'qing.",
    ],
    appLinks: [{ label: "Ertalabki va kechki zikrlar" }],
  },
  {
    title: "Folbin va bashoratchilardan saqlaning",
    summary: "Allohdan boshqa hech kimdan g'aybni izlash jiddiy ogohlantirishdir.",
    body: [
      "Islom sahih ruqya bilan folbinlar, bashoratchilar, munajjimlar, yoki g'aybni bilishini yoki islomiy bo'lmagan yo'llar bilan ruhiy azobni bartaraf etishini da'vo qiladigan har qanday kishiga murojaat qilish orasida qattiq chegara chizadi. Payg'ambar ﷺ ogohlantirdi: 'Kim bir folbinga (arraf) borib undan biror narsa haqida so'rasa, uning namozi qirq kecha qabul qilinmaydi' (Sahih Muslim 2230) — shunchaki qiziqish tufayli bunday da'volarni sinab ko'rishga qarshi ham qattiq ogohlantirish.",
      "Agar kishi folbinning g'ayb haqidagi da'volariga ham ishonsa, olimlar buni kufr masalasi deb hisoblaydi, chunki g'aybni faqat Alloh biladi (Qur'on 27:65). Insonni bunday kishini ko'rib chiqishga majbur qiladigan har qanday qiyinchilik bo'lishidan qat'i nazar, bu qo'llanma ta'limotiga ko'ra to'g'ri javob doim sahih ruqyaga, duoga, va ishonchli tibbiy yoki ilmiy yordamga murojaat qilishdir — hech qachon yashirin bilimga da'vo qiluvchilarga emas.",
    ],
    hadith: [
      {
        excerpt:
          "Kim bir folbinga (arraf) borib undan biror narsa haqida so'rasa, uning namozi qirq kecha qabul qilinmaydi.",
      },
    ],
    actions: [
      "Hech qachon folbinlar, munajjimlar, yoki g'aybni bilishini da'vo qiluvchilarga murojaat qilmang.",
    ],
  },
  {
    title: "Tavakkul — faqat Allohga ishonish",
    summary: "Ruqya bir vositadir; shifo va natija Allohga tegishlidir.",
    body: [
      "Bu qo'llanmadagi so'nggi va eng muhim eslatma tavakkuldir: U bergan ruxsat etilgan vositalarni ishlatgan holda Allohga samimiy ishonish. Ruqya o'qish, tibbiy yordam izlash, va boshqalardan siz uchun duo qilishlarini so'rash — barchasi qonuniy vositalardir — ammo qalbning ishonchi faqat Allohda qolishi kerak, o'qilgan so'zlarda yoki ularni o'qigan kishida emas. Bu bu qo'llanmadagi birinchi hadisdagi shartni aniq aks ettiradi: 'Ruqyada shirk bo'lmasa, hech qanday zarar yo'q' (Sahih Muslim 2200).",
      "Bu qo'llanma internetda keng tarqalgan xalq 'protokollarini' va alomatlar ro'yxatini ataylab qoldirib ketdi — ularning hech biri Qur'on yoki sahih Sunnatda kuchli asosga ega emas, va ularga tayanish kishining ishonchini sekin-asta Allohdan bir marosim yoki taxminlar ro'yxatiga siljitishi mumkin. Matn bilan asoslangan narsaga sodiq qoling, qolganini Allohning taqdiriga qoldiring.",
    ],
    hadith: [{ excerpt: "Ruqyada shirk bo'lmasa, hech qanday zarar yo'q." }],
    disclaimer:
      "Bu Qur'on va sahih hadisdan asosiy sunniy ta'limotni umumlashtiruvchi umumiy ta'lim mazmunidir. Bu fatvo emas, va tibbiy yoki psixologik davolash ham emas. Jiddiy yoki davomli azob uchun, malakali mahalliy olim va tegishli tibbiy mutaxassis bilan maslahatlashing.",
  },
];
