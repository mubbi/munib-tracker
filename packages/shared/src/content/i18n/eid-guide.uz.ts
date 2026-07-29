import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// Uzbek translation overlay for the Learn Eid guide. Mirrors the order of
// EID_GUIDE_TOPICS in ../eid-guide.ts (index-aligned); untranslated entries fall
// back to English. Only human-readable text is translated — ids, routes,
// surah/ayah numbers, collections, citations and grades stay in the English source.
export const EID_GUIDE_TOPICS_UZ: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Ramazon hayiti — ro'zani ochish bayrami",
    summary: "Shavvol oyining birinchi kuni, Ramazon ro'zasi nihoyasi.",
    body: [
      "Ramazon hayiti Shavvol oyining 1-kunida, Ramazondan darhol keyin nishonlanadi va butun oy davomida ro'za tutish va ibodat qilishga muvaffaq bo'lganlik uchun quvonch va shukr kunidir. Qur'on ro'zaning tugashini bevosita zikr va shukr bilan bog'laydi: '...sanoqni to'ldirishingiz va sizni to'g'ri yo'lga solgani uchun Allohni ulug'lashingiz, shukr qilishingiz uchundir' (Baqara, 2:185).",
      "Bu kunda ro'za tutish shunchaki yoqtirilmagan emas, balki qat'iyan man etilgan — Payg'ambar ﷺ, Qurbon hayiti bilan birga, bu kunni musulmonlarga ro'za tutish o'rniga ovqatlanish buyurilgan ikki kundan biri deb ta'kidlagan (Buxoriy 1990). Kun fitr sadaqasi va hayit namozi bilan boshlanadi, qarindoshlarni ziyorat qilish, tabriklar almashish va shariat chegarasida umumiy shodlik bilan davom etadi.",
    ],
    quran: [
      {
        excerpt:
          "...sanoqni to'ldirishingiz va sizni to'g'ri yo'lga solgani uchun Allohni ulug'lashingiz, shukr qilishingiz uchundir.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bu ikki kun, Alloh Rasuli ﷺ ro'za tutishni man etgan kunlardir: ro'zangizni ochadigan kun (Ramazondan), va qurboningizdan yeydigan kun.",
      },
    ],
  },
  {
    title: "Qurbon hayiti — qurbonlik bayrami",
    summary: "Zulhijja oyining 10-kuni, Ibrohimning qurbonligi xotirasi.",
    body: [
      "Qurbon hayiti Zulhijja oyining 10-kunida, haj davomidagi Qurbon qilish kunida nishonlanadi va Ibrohimning Allohga itoat qilib o'g'lini qurbon qilishga tayyorligini, Allohning uni buning o'rniga buyuk qurbonlik bilan qutqargan rahmatini xotirlaydi (Qur'on, 37:102–107). Ko'p olimlarning fikricha, bu ikki hayitning kattasidir va haj qiluvchilar uchun hajning yakunlanishiga to'g'ri keladi.",
      "Ramazon hayiti kabi, bu kunda ham ro'za tutish man etilgan (Buxoriy 1990). Uning asosiy qo'shimcha ibodati qurbonlikdir (udhiya), buni qodir bo'lganlar Ibrohimning itoatkorligi xotirasiga, ibodat va sadaqani birlashtirgan amal sifatida taqdim etadilar.",
    ],
    quran: [
      {
        excerpt:
          "U (bola) u bilan birga yura oladigan yoshga yetganda, [Ibrohim] dedi: Ey o'g'lim! Men tushimda seni so'yayotganimni ko'rdim... Va Biz uni buyuk bir qurbonlik bilan qutqardik.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Bu ikki kun, Alloh Rasuli ﷺ ro'za tutishni man etgan kunlardir: ro'zangizni ochadigan kun (Ramazondan), va qurboningizdan yeydigan kun.",
      },
    ],
  },
  {
    title: "Hayit namozi qanday o'qiladi",
    summary: "Azon va qomatsiz, qo'shimcha takbirlar bilan ikki rakat.",
    body: [
      "Hayit namozi ikki rakatdan iborat bo'lib, jamoat bo'lib, oldindan azon va qomatsiz o'qiladi — Jobir ibn Abdulloh va Ibn Abbos ikkalasi ham Payg'ambar ﷺ zamonida ikkala hayit uchun ham namozga chaqiruv bo'lmaganini tasdiqlagan (Sahih Muslim 886). Namozdan keyin xutba o'qiladi, xutba avval keladigan Juma namozidan farqli o'laroq.",
      "Har bir rakatda qiroatdan oldin, namozning odatiy takbirlaridan tashqari qo'shimcha takbirlar ('Allohu akbar' deyish) qo'shiladi. Oisha rivoyat qiladiki, Payg'ambar ﷺ ikkala hayitda ham birinchi rakatda yetti, ikkinchi rakatda besh marta takbir aytgan (Abu Dovud 1149), bu son Abdulloh ibn Amrdan ham rivoyat qilingan (Abu Dovud 1151).",
    ],
    hadith: [
      {
        excerpt:
          "Ramazon hayiti kunida imom chiqqanda ham, chiqqandan keyin ham azon bo'lmagan; o'sha kuni qomat, chaqiruv yoki shunga o'xshash hech narsa bo'lmagan.",
      },
      {
        excerpt:
          "Alloh Rasuli ﷺ ro'za ochish kunida va qurbonlik kunida birinchi rakatda yetti, ikkinchi rakatda besh marta takbir aytardi.",
      },
    ],
    madhhabNote:
      "Mazhablar qo'shimcha takbirlarning aniq soni bo'yicha farqlanadi. Shofiy, moliki va hanbaliy faqihlar yetti-besh rivoyatiga amal qiladi (Abu Dovud 1149/1151) — moliki va hanbaliylar boshlang'ich takbirni yettiga qo'shib hisoblab, olti-besh deydi. Hanafiy mazhabi esa birinchi rakatda qiroatdan oldin 3 va ikkinchi rakatda ruku'dan oldin 3 qo'shimcha takbir (jami 6) fikridadir — bu Kufa faqihlarining alohida isbotlangan marfu' hadisi bo'lmagan qarashidir; jamoatingiz imomining takbir soniga amal qiling.",
    actions: [
      "Vaqtida keling — namoz boshlanishini bildiruvchi azon yoki qomat yo'q.",
      "Imomingizning takbir soniga amal qiling; har ikki mazhab amaliyoti ham to'g'ri.",
      "Namozdan keyin xutbani tinglash uchun qoling.",
    ],
  },
  {
    title: "Hayit kunidagi sunnatlar",
    summary: "G'usl, eng yaxshi kiyim, namozdan oldin/keyin ovqatlanish va ikki xil yo'l.",
    body: [
      "Hayit namozidan oldin va keyin bir nechta kichik sunnatlar tavsiya etiladi. Ramazon hayitida Payg'ambar ﷺ bir necha xurmoni, toq sonda yemasdan namozga chiqmagan (Buxoriy 953) — Qurbon hayitida esa, aksincha, namozdan qaytgandan keyin qurbonlik go'shtidan yeyishni kutish tavsiya etiladi.",
      "Bu munosabat bilan g'usl qilish va eng yaxshi (toza, odobli) kiyimni kiyish sunnatdir, ikkala hayitda ham sahobalarning umumiy amaliyotiga amal qilib, garchi bu aniq rivoyat bu yerdagi boshqalarga qaraganda kamroq mustahkam isbotlangan bo'lsa-da, va bu bitta sahih darajali hadisdan ko'ra keng qo'llaniladigan amaliyotdir.",
      "O'ziga xos sunnat borgan yo'ldan farqli yo'l bilan qaytishdir. Jobir ibn Abdulloh rivoyat qiladi: 'Hayit kuni Payg'ambar ﷺ (hayit namozini o'qigandan keyin) borgan yo'lidan farqli yo'l bilan qaytardi' (Buxoriy 986) — bu odatda uning ibodatiga guvoh bo'lgan joylarni ko'paytirish va Islom shiorlarini kengroq namoyish etish sifatida izohlanadi.",
    ],
    hadith: [
      {
        excerpt:
          "Payg'ambar ﷺ Ramazon hayiti kunida bir necha xurmoni, toq sonda yemasdan hech qachon (namozga) chiqmagan.",
      },
      {
        excerpt:
          "Hayit kuni Payg'ambar ﷺ (hayit namozini o'qigandan keyin) borgan yo'lidan farqli yo'l bilan qaytardi.",
      },
    ],
    actions: [
      "G'usl qiling va eng yaxshi odobli kiyimingizni kiying.",
      "Ramazon hayiti namozidan oldin toq sonda xurmo yeng; Qurbon hayiti namozidan keyingacha yeyishni kutib turing.",
      "Namozga borgan yo'lingizdan farqli yo'l bilan qaytib keling.",
    ],
  },
  {
    title: "Fitr sadaqasi — asoslari",
    summary: "Ramazon hayiti namozidan oldin ado etilishi lozim bo'lgan kichik vojib sadaqa.",
    body: [
      "Fitr sadaqasi (sadaqatul-fitr) boylikka asoslangan zakotdan alohida, kichikroq sadaqa bo'lib, har bir musulmon uchun vojibdir — yosh yoki katta, erkak yoki ayol, erkin yoki qarovi ostidagi — va uni oila boshlig'i ular nomidan to'laydi. Ibn Umar rivoyat qiladiki, Payg'ambar ﷺ har bir musulmonga bir so' (taxminan 2–3 kg) xurmo yoki arpani vojib qildi, bu odamlar hayit namoziga chiqishdan oldin to'lanishi kerak (Buxoriy 1503).",
      "Uning maqsadi sunnatda aniq bayon qilingan: 'ro'za tutuvchini behuda va yaramas gaplardan poklash, va kambag'allar uchun oziq-ovqat' (Abu Dovud 1609). Uni hayit namozidan oldin to'lash aynan shu zakotni ado etish hisoblanadi; namozdan keyin to'lash umumiy sadaqa hisoblanadi, ammo vaqtga bog'liq maxsus mukofotni yo'qotadi.",
      "Bugungi kunda ko'pchilik jamiyatlar xurmo yoki arpani to'g'ridan-to'g'ri tarqatish o'rniga, mahalliy olimlar va zakot muassasalarining hozirgi asosiy oziq-ovqat qiymatlari bo'yicha yo'l-yo'rig'iga amal qilib, qiymatni mahalliy pulda hisoblaydi — bu amaliy moslashuv, asosiy majburiyatning o'zgarishi emas.",
    ],
    hadith: [
      {
        excerpt:
          "Alloh Rasuli ﷺ har bir musulmon uchun, qul yoki erkin, erkak yoki ayol, yosh yoki katta, bir So' xurmo yoki bir So' arpani Fitr sadaqasi sifatida vojib qildi va odamlar hayit namoziga chiqishdan oldin to'lanishini buyurdi.",
      },
      {
        excerpt:
          "Alloh Rasuli ﷺ Fitr sadaqasini ro'za tutuvchini behuda va yaramas gaplardan poklash, va kambag'allar uchun oziq-ovqat sifatida vojib qildi. Kim uni namozdan oldin to'lasa, bu qabul qilingan zakotdir; kim namozdan keyin to'lasa, bu (odatiy) sadaqadir.",
      },
    ],
    actions: [
      "O'zingiz va qaramog'ingizdagilar uchun Fitr sadaqasini hisoblab, ajratib qo'ying.",
      "Iloji bo'lsa, Ramazon hayiti namoziga borishdan oldin to'lang.",
    ],
    appLinks: [{ label: "Zakot kalkulyatori" }],
  },
  {
    title: "Qurbonlik (udhiya) — asoslari",
    summary:
      "Qurbon hayitida keltiriladigan, kambag'allar bilan bo'lishiladigan hayvon qurbonligi.",
    body: [
      "Qurbonlik — Qurbon hayiti va undan keyingi Tashriq kunlarida shartlarga javob beradigan hayvonni (qo'y, echki, sigir yoki tuya, yosh va sog'liq shartlariga javob beradigan) so'yishdir, Ibrohimning qurbonligi xotirasiga. Anas rivoyat qiladiki, Payg'ambar ﷺ o'z qo'llari bilan ikkita qora-oq qo'chqorni so'yib, ular ustida Allohning ismini aytib, takbir keltirdi (Buxoriy 5558) — bu, imkoni bo'lganda so'yishni o'zi bajarish afzalroq amal ekanligini, ammo boshqasiga vakil qilish ham to'g'ri ekanligini tasdiqlaydi.",
      "Qur'on qurbonlikni to'g'ridan-to'g'ri uning go'shtini bo'lishish bilan bog'laydi: '...ulardan yeng va muhtoj va so'rovchini boqing' (Qur'on, 22:36). Go'sht odatda o'z oilasi, qarindosh-urug'lari va do'stlari, va kambag'allar orasida bo'lishiladi, shunday qilib bu tadbir ibodat, saxovat va shukrni birlashtiradi.",
      "So'yish hayit namozidan keyin, oldin emas, bo'lishi kerak — erta so'ygan bir sahobaga Payg'ambar ﷺ buni qaytarishni aytdi, chunki namozdan oldin taqdim etilgan qurbonlik udhiya hisoblanmaydi. Aynan kimga vojib ekanligi va aniq vaqt oralig'i haqidagi hukmlar mazhablarga ko'ra farq qiladi; vaziyatingiz uchun malakali mahalliy olimga murojaat qiling.",
    ],
    quran: [
      {
        excerpt:
          "...ularda sizlar uchun yaxshilik bor. Ularni [qurbonlik uchun] saf tortib turgan holda Allohning ismini yod eting; yonboshlari yerga tushganda esa ulardan yeng va muhtojni va so'rovchini boqing.",
      },
    ],
    hadith: [
      {
        excerpt:
          "Payg'ambar ﷺ ikkita qora-oq qo'chqorni so'ydi, men uning oyog'ini ularning yonboshlariga qo'yib, Allohning Ismini aytib takbir keltirganini ko'rdim. So'ngra ularni o'z qo'llari bilan so'ydi.",
      },
    ],
    actions: [
      "Imkoningiz bo'lsa va sizga vojib bo'lsa, qurbonligingizni Qurbon hayitidan oldin tashkil qiling.",
      "So'yish hayit namozidan keyin, oldin emasligiga ishonch hosil qiling.",
      "Go'shtni oilangiz, qarindosh-do'stlaringiz va kambag'allar orasida bo'lishtiring.",
    ],
    disclaimer:
      "Aynan kimga qurbonlik vojib ekanligi va so'yish uchun to'g'ri vaqt oralig'i, mazhablarga ko'ra farq qiluvchi batafsil fiqh masalalaridir. Bu umumiy ta'lim mazmuni, fatvo emas — vaziyatingiz uchun malakali mahalliy olimga murojaat qiling.",
  },
];
