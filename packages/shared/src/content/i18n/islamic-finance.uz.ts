import type { LearnGuideTopic } from "../../types/learn-guide";
import type { DeepPartial } from "./localize";

// uz overlay for islamic-finance. Index-aligned with ISLAMIC_FINANCE_TOPICS in ../islamic-finance.ts.
export const ISLAMIC_FINANCE_TOPICS_UZ: DeepPartial<LearnGuideTopic>[] = [
  {
    title: "Islomiy moliya nima?",
    summary:
      "Pulga axloqiy nazar, alohida mahsulot turi emas — bu qoʻllanma faqat taʼlimiy maqsadda.",
    body: [
      "Islomiy moliya investitsiya mahsulotining biror brendi emas; u pulning qanday topilishi, qarzga berilishi, sarflanishi va hadya qilinishiga islom axloqini tatbiq etishdir. Uning negizida bir nechta tamoyil yotadi: boylik oʻz-oʻzidan maqsad emas, balki Allohdan berilgan omonatdir; bitimlar ekspluatatsiya va haddan ortiq noaniqlikdan xoli boʻlishi kerak; foyda esa qarzga qoʻyiladigan kafolatlangan toʻlovga emas, real iqtisodiy faoliyat va birgalikda koʻtariladigan tavakkalga bogʻlanishi lozim.",
      "Bu qoʻllanma ushbu tamoyillarni umumiy, taʼlimiy darajada tanishtiradi: ribo (foiz/sudxoʻrlik) taqiqi, savdoda insof, zakot va ixtiyoriy sadaqa majburiyatlari hamda takofulning (hamkorlikka asoslangan sugʻurta) asosiy tushunchasi. U ataylab fondlarni saralamaydi, aksiyalar yoki ETFlar roʻyxatini bermaydi va biror muayyan mahsulot yoki provayderni tavsiya qilmaydi.",
      "Zamonaviy moliyaviy mahsulotlar (ipoteka, kredit kartalari, sugʻurta polislari, pensiya hisoblari va boshqalar) juda turli shakllarda tuzilgan va ular haqidagi hukmlar shartnomaning aniq shartlariga hamda yurisdiksiyangizga bogʻliq boʻlishi mumkin. Bu qoʻllanma sizga asosiy tamoyillarni beradi; oʻz vaziyatingiz boʻyicha hukm olish uchun malakali, sertifikatlangan islomiy moliya olimi yoki muassasasi bilan maslahatlashing.",
    ],
    disclaimer:
      "Faqat taʼlimiy mazmun — moliyaviy maslahat ham, fatvo ham emas. U biror muayyan fond, aksiya, provayder yoki moliyaviy mahsulotni tavsiya qilmaydi, saralamaydi va baholamaydi.",
  },
  {
    title: "Boylik — omonat",
    summary:
      "Mulkingizdagi hamma narsa aslida Allohniki — siz uning soʻnggi egasi emas, vakilisiz.",
    body: [
      "Qurʼonda takrorlanib turadigan mavzulardan biri shuki, boylik avvalo Allohga tegishli; inson esa uni maʼlum muddat saqlab turuvchi omonatdor boʻlib, u qanday topilgani va qanday ishlatilgani uchun javobgardir. Bu pulni sof shaxsiy mulkdan sizdan soʻraladigan narsaga — qayerdan kelgani va qayerga ketgani soʻraladigan narsaga aylantiradi.",
      "Bu omonatning boshqa odamlar bilan muomalada qanday namoyon boʻlishini ikki buyruq belgilaydi: shartnoma va kelishuvlarni toʻliq ado etish hamda hech qachon birovning molini zulm, aldov yoki ekspluatatsiya yoʻli bilan emas, faqat oʻzaro rozilikdagi halol savdo orqali olish.",
      "Birgalikda olinganda, aynan shu tamoyillar tufayli islomiy moliya axloqi doim bir necha savolga qaytadi: bu foyda haqiqiy mehnat, tavakkal va qiymat yaratish orqali topildimi? Ikkinchi tomonga toʻliq halollik bilan munosabatda boʻlindimi? Men olgan har bir majburiyat ado etilyaptimi?",
    ],
  },
  {
    title: "Ribo taqiqi",
    summary: "Ribo (foiz/sudxoʻrlik) Qurʼonda eng qattiq qoralangan bitimlardan biridir.",
    body: [
      "Ribo — odatda foiz yoki sudxoʻrlik deb tarjima qilinadi, keng maʼnoda qarzga qoʻyiladigan har qanday oldindan belgilangan, kafolatlangan ustama — Baqara surasining ketma-ket besh oyatida (2:275–279) gʻoyat keskin soʻzlar bilan taqiqlangan; bu Qurʼonda bitta mavzuga oid eng qattiq ogohlantirishlar qatoriga kiradi.",
      "Ushbu parcha ataylab qarama-qarshilik qoʻyadi: «…Holbuki, Alloh bayʼni halol, sudxoʻrlikni harom qilgan…» (2:275). Savdo — ikki tomon haqiqiy tavakkal va mehnatni baham koʻradigan oldi-sotdi va sarmoya — maqtaladi; ribo esa natijadan qatʼi nazar toʻlanadigan belgilangan ustama sifatida qoralanadi. Sura davomida moʻminlarga qolgan har qanday riboni butunlay tark etish buyuriladi, unda davom etganlarga jiddiy oqibatlar haqida ogohlantiriladi, tavba qilganlarga esa faqat asl sarmoyasi — ortiq ham emas, kam ham emas — qolishi vaʼda qilinadi.",
      "Bu har bir zamonaviy moliyaviy mahsulotni oʻzingiz tekshirib chiqishingiz uchun roʻyxat emas, balki bilib qoʻyish lozim boʻlgan asosiy taʼlimotdir. Muayyan shartnoma (ipoteka, kredit, jamgʻarma hisobi) amalda riboni oʻz ichiga oladimi-yoʻqmi, buni aniqlash uchun uning haqiqiy shartlarini islomiy moliya boʻyicha malakali mutaxassis bilan koʻrib chiqish zarur.",
    ],
  },
  {
    title: "Savdo foizdan nimasi bilan farq qiladi",
    summary:
      "Halol foyda tavakkal va mehnatga bogʻliq; ribo esa natijadan qatʼi nazar kafolatlangan ustamadir.",
    body: [
      "Bu farqni yodda tutishning oddiy usuli: savdoda yoki haqiqiy sarmoyada sarmoya yoki mol beruvchi kishi natijada sherik boʻladi — u foyda koʻrishi mumkin, ammo zarar ham koʻrishi mumkin, chunki u loyihaning real natijasiga bogʻliq. Riboga asoslangan qarzda esa qarz beruvchiga qarz oluvchining ishi muvaffaqiyatli boʻladimi, qiynaladimi yoki barbod boʻladimi — qatʼi nazar, belgilangan daromad kafolatlanadi.",
      "Klassik ulamolar buni adolat masalasi sifatida koʻradilar: zarurat ichida qarz olgan kishi olganidan ancha koʻp qaytarishga majbur boʻlib qolishi mumkin, bunda butun tavakkal unga, qarz beruvchiga esa hech narsa yuklanmaydi — Qurʼon aynan shu nomutanosiblikni «Alloh sudxoʻrlikning (foydasini) yoʻq qiladi va sadaqalarning (foydasini) ziyoda qiladi» (2:276) degan soʻzlarda qoralaydi; bu ekspluatatsiya orqali toʻplangan boylik bilan saxovat orqali koʻpaygan boylik oʻrtasidagi bevosita qarama-qarshilikdir.",
      "Bu biror muayyan vosita boʻyicha hukm emas, balki umumiy taʼlimiy qiyosdir (baʼzi zamonaviy tuzilmalar savdo va qarzni murakkab tarzda aralashtirib yuboradi). Muayyan mahsulot bu koʻlamning qayerida turishi — aynan faqat umumiy tamoyillar asosida hal qilmasdan, malakali islomiy moliya olimi yoki sertifikatlangan maslahatchiga olib boriladigan savoldir.",
    ],
  },
  {
    title: "Sunnat riboga qanchalik jiddiy qaraydi",
    summary:
      "Paygʻambar ﷺ ribo bitimiga aloqador har bir kishi uning gunohiga sherik ekanidan ogohlantirganlar.",
    body: [
      "Qurʼonning oʻz ogohlantirishlaridan tashqari, Paygʻambar ﷺ ribo uchun javobgarlik faqat uni bevosita undiradigan kishi bilan cheklanmasligini aniq bayon qilganlar. Sahih hadisda rivoyat qilinishicha, u zot ﷺ riboni yeguvchini, uni toʻlovchini, shartnomasini yozuvchini va unga guvoh boʻlgan ikki kishini laʼnatlaganlar va ularning barchasi bunda barobar ekanini aytganlar.",
      "Bundan odatda chiqariladigan saboq faqat shaxsiy aybdorlik emas, balki jamoaviy tiyilishdir: ribo butun bitim va unga bila turib aloqador boʻlgan har bir kishi uzoq turishi kerak boʻlgan narsa sifatida koʻriladi — u shunchaki qarz beruvchi bilan qarz oluvchi oʻrtasidagi xususiy masala emas.",
      "Qurʼon oyatlari singari, bu hadis ham tamoyilning jiddiyligini belgilaydi; u muayyan zamonaviy moliyaviy mahsulotni qanday tasniflashni oʻzi aytib bermaydi. Bu masalada qaror chiqarish haqiqiy shartnomani koʻrib chiqadigan malakali olimlarning ishidir.",
    ],
  },
  {
    title: "Savdoda halollik",
    summary: "Rostgoʻy va ishonchli savdogarga Oxiratda eng yuksak martabalardan biri beriladi.",
    body: [
      "Ribo haqidagi ogohlantirishlardan keskin farqli ravishda, halol savdo qayta-qayta maqtaladi. Paygʻambar Muhammad ﷺning oʻzlari paygʻambarlikdan oldin savdogar boʻlib ishlaganlar va paygʻambar sifatida tanilishlaridan ancha oldin savdo-sotiqdagi halolliklari uchun Makkada al-Amin — «Ishonchli» — laqabi bilan tanilgan edilar.",
      "U zot ﷺ keyinchalik «the truthful, trustworthy merchant will be with the prophets, the truthful, and the martyrs» (inglizcha maʼnosi) deb, rostgoʻy va ishonchli savdogar Qiyomat kunida paygʻambarlar, siddiqlar va shahidlar bilan birga boʻlishini oʻrgatganlar — bozordagi insofli muomaladek oddiy ishga berilgan gʻoyat yuksak martaba.",
      "Amalda insofli savdo quyidagilarni anglatadi: mol va xizmatlarni toʻgʻri taʼriflash, maʼlum nuqsonlarni yashirmay oshkor qilish, kelishilgan narx va shartlarga rioya qilish hamda aldov, yolgʻon reklama yoki xaridor yoxud sotuvchining bilmasligidan foydalanishdan saqlanish. Bular har qanday anʼanada yaxshi va barqaror tijoratni yuzaga keltiradigan fazilatlardir — Islom ularni abadiy mukofot bilan ham bogʻlaydi, xolos.",
    ],
  },
  {
    title: "Zamonaviy moliyaviy mahsulotlarda yoʻl topish",
    summary:
      "Ipoteka, kartalar va sugʻurta chindan murakkab — bu qoʻllanma tamoyillar bilan cheklanadi.",
    body: [
      "Zamonaviy moliyaviy hayotda ilk avlod musulmonlari hozirgi shaklida hech qachon duch kelmagan mahsulotlar bor: ipoteka, kredit kartalari, pensiya hisoblari, sugʻurta va turlicha tuzilgan investitsiya fondlari. Asrlar oldingi tamoyillarni ushbu mahsulotlarga tatbiq etish — haqiqiy, puxta ilmiy mehnat; buni bir necha umumiy oyatdan oʻzingiz xulosa chiqarib hal qilib boʻlmaydi.",
      "Shu sababli zamonaviy islomiy moliya muassasalari va sertifikatlangan olimlar aynan zamonaviy shartnomalarni ushbu tamoyillarga muvofiqligini tekshirishga ixtisoslashgan va koʻpincha muayyan mahsulotlar yoki tuzilmalar boʻyicha batafsil hukmlar chiqaradilar. Bunday ixtisoslashgan tekshiruv ushbu ilova doirasidan tashqarida.",
      "Agar siz haqiqiy moliyaviy qaror — uy sotib olish, qarz, sarmoya yoki sugʻurta polisi — ustida bosh qotirayotgan boʻlsangiz, masʼuliyatli keyingi qadam bu kabi umumiy taʼlimiy mazmunga tayanish emas, balki haqiqiy shartnoma shartlarini koʻrib chiqa oladigan malakali, sertifikatlangan islomiy moliya maslahatchisi yoki olimi bilan maslahatlashishdir.",
    ],
    disclaimer:
      "Ushbu ilova biror muayyan moliyaviy mahsulot, fond yoki provayderni baholamaydi, saralamaydi yoki tavsiya qilmaydi va bu qoʻllanma haqiqiy moliyangiz boʻyicha malakali mutaxassis yoki olim maslahatining oʻrnini bosmaydi.",
  },
  {
    title: "Zakot: mol bilan qilinadigan ibodat",
    summary: "Zakot — soʻz yoki harakat bilan emas, mol bilan ado etiladigan farz ibodatdir.",
    body: [
      "Zakot — eng kam miqdordan (nisob) ortiq zakotga tegishli mol-mulkdan har yili olinadigan belgilangan, majburiy ulush — Islomning besh ustunidan biri boʻlib, berishni ixtiyoriy saxovat deb emas, namoz va roʻza bilan bir qatorda koʻradi.",
      "Qurʼon zakotni doimo namoz bilan birga chin iymon belgisi sifatida zikr qiladi va namozni toʻkis ado etib, zakotni berganlarga shunday vaʼda beradi: «…Parvardigorlari huzurida ajr bor. Ular uchun hech qanday xavf-xatar yoʻq va ular gʻamgin boʻlmaydilar». Moliyaviy jihatdan u boylikni poklash mexanizmi vazifasini bajaradi — toʻplangan boylikning kichik, muntazam ulushini bir necha qoʻlda cheksiz bekor yotishiga yoʻl qoʻymay, muhtojlarga qayta taqsimlaydi.",
      "Hisob-kitob sizning aniq jamgʻarmangiz, mol-mulkingiz va mahalliy nisob qiymatlariga bogʻliq boʻlgani uchun ilovada maxsus Zakot qoʻllanmasi va kalkulyatori bor — bu yerdagi umumiy tamoyillar asosida taxmin qilish oʻrniga bevosita undan foydalaning.",
    ],
    appLinks: [{ label: "Zakot qoʻllanmasi va kalkulyatori" }],
  },
  {
    title: "Sadaqa: ixtiyoriy xayr-ehson",
    summary:
      "Farz zakotdan tashqari har qanday ixtiyoriy berish sadaqa deyiladi — va u aslida sizga hech qachon zarar keltirmaydi.",
    body: [
      "Sadaqa — zakotning belgilangan majburiyatidan tashqari, Alloh rizosi uchun istalgan miqdorda, istalgan vaqtda beriladigan ixtiyoriy xayr-ehsondir. U katta moliyaviy hadyalardan tortib shirin soʻz yoki birovning yoʻlidan ozor beruvchi narsani olib tashlashdek kichik ishlargacha boʻlishi mumkin — hadislarda bularning barchasi sadaqa turlari sifatida sanaladi.",
      "Berishga ikkilanayotgan har bir kishi uchun eng taskin beruvchi taʼlimotlardan biri — Paygʻambar ﷺning sadaqa molni kamaytirmasligi haqidagi soʻzlaridir; Qurʼon ham boshqa oʻrinlarda Alloh yoʻlida sarflashni shunchaki tugab qoladigan narsa emas, balki Alloh oʻrnini toʻldiradigan va mukofotlaydigan narsa sifatida taʼriflab, bu fikrni quvvatlaydi.",
      "Amalda bu saxovatga boshqacha qarashni oʻrgatadi: berish moliyaviy xavfsizligingiz bilan raqobatlashmaydi, balki uni har doim ham balansda koʻrinmaydigan yoʻllar bilan himoya qiluvchi va koʻpaytiruvchi narsa sifatida taqdim etiladi.",
    ],
    appLinks: [{ label: "Zakot va sadaqa qoʻllanmasi" }, { label: "Sadaqa maqsadlari" }],
  },
  {
    title: "Takoful: hamkorlikda tavakkalni baham koʻrish",
    summary: "Anʼanaviy sugʻurtaning islomiy muqobillari ortidagi tushunchaga umumiy nazar.",
    body: [
      "Takoful (oʻzaro kafillik maʼnosini beruvchi arabcha oʻzakdan) — sugʻurtaga oʻxshash himoyaga islomiy yondashuvlar ortidagi umumiy tushuncha: bir guruh ishtirokchilar umumiy fondga badal qoʻshadilar va bu fond qoplanadigan zarar koʻrgan aʼzolarga yordam berishga sarflanadi; ortib qolgan mablagʻ esa odatda alohida sugʻurtachining kafolatlangan foydasi sifatida qolmay, ishtirokchilar orasida taqsimlanadi yoki keyingi davrga oʻtkaziladi.",
      "Asosiy gʻoya — kafolatlangan badal evaziga tavakkalni boshqaga oʻtkazish emas, balki hamkorlikda tavakkalni baham koʻrishdir: ishtirokchilar bir-biriga oʻzaro yordam beruvchilar sifatida qaraladi, fond operatori esa odatda tavakkalni oʻzi koʻtaruvchi tomon emas, haq evaziga ishlaydigan boshqaruvchi yoki vakil boʻladi.",
      "Bu faqat umumiy, tushunchaviy taʼrif. Haqiqiy takoful mahsulotlari tuzilishi jihatidan provayderlar va mamlakatlar boʻyicha keskin farq qiladi va muayyan rejaning chindan shu tarzda tuzilganmi-yoʻqmi, buni baholash uchun uning haqiqiy shartlarini malakali islomiy moliya olimi yoki muassasasi bilan koʻrib chiqish kerak — ushbu ilova biror muayyan takoful (yoki sugʻurta) provayderi yoki rejasini tavsiya qilmaydi va baholamaydi.",
    ],
    disclaimer:
      "Faqat umumiy taʼlim. Bu takofulni anʼanaviy sugʻurtadan, yoki biror muayyan provayder yoxud rejani boshqasidan ustun qoʻyish tavsiyasi emas — oʻz vaziyatingiz boʻyicha malakali maslahatchiga murojaat qiling.",
  },
  {
    title: "Takoful va anʼanaviy sugʻurta: umumiy qiyos",
    summary:
      "Ikkalasining maqsadi bir — tavakkalni boshqarish, ammo bu tavakkalning tuzilishi farq qiladi.",
    body: [
      "Anʼanaviy sugʻurta odatda shartnoma sifatida tuziladi: polis egasi badal (premiya) toʻlaydi, sugʻurtachi esa alohida tijoriy tomon sifatida shu haq evaziga tavakkalni oʻz zimmasiga oladi va koʻpincha badallar fondini foizli vositalarni ham oʻz ichiga olishi mumkin boʻlgan yoʻllar bilan sarmoya qiladi. Baʼzi klassik olimlar bu tuzilma ribo, gʻarar (toʻlov borasidagi haddan ortiq noaniqlik) va tavakkalni baham koʻrish oʻrniga uni belgilangan haq evaziga boshqaga oʻtkazish masalalariga daxldor ekanidan xavotir bildirganlar.",
      "Umuman olganda, takoful aynan shu xavotirlarni oʻrniga oʻzaro, hamkorlikka asoslangan tuzilma orqali bartaraf etishga urinish sifatida ishlab chiqilgan — garchi qaysi tuzilmalar bu maqsadga toʻliq erishishi borasida olimlar va muassasalarning fikrlari farq qilsa-da, takoful provayderlarining oʻzlari ham tuzilishi jihatidan ancha farqlanadi.",
      "Xavotirlar ham, muqobil tuzilmalar ham haqiqiy texnik tafsilotlarni oʻz ichiga olgani sababli (shuningdek, joylashuv, qoplama ehtiyojlari va mavjud provayderlar kabi shaxsiy sharoitlar nihoyatda turlicha boʻlgani uchun), bu qiyos siz koʻrib chiqayotgan biror muayyan polis boʻyicha hukm sifatida emas, faqat umumiy maʼlumot sifatida taqdim etiladi.",
    ],
    disclaimer:
      "Faqat taʼlimiy qiyos; umuman sugʻurta yoki takoful, yoxud biror muayyan mahsulot boʻyicha fatvo emas. Olimlar zamonaviy sugʻurta tuzilmalari borasida turli fikrlarga ega; oʻz vaziyatingiz boʻyicha malakali maslahatchiga murojaat qiling.",
  },
  {
    title: "Savol-javob: bu moliyaviy maslahatmi?",
    summary:
      "Yoʻq — bu qoʻllanma faqat tamoyillarni oʻrgatadi va malakali maslahatning oʻrnini bosa olmaydi.",
    body: [
      "S: Ushbu qoʻllanmadan muayyan kredit, sarmoya yoki sugʻurta mahsuloti men uchun joizmi-yoʻqmi, hal qilishda foydalansam boʻladimi? J: Yoʻq. Bu qoʻllanma pul haqidagi umumiy islomiy tamoyillarni tushuntiradi — u shartnomalarni koʻrib chiqmaydi, mahsulot tavsiya qilmaydi va hukm chiqarmaydi. Muayyan moliyaviy qarorlar malakali moliya mutaxassisi bilan, joizlik masalalarida esa malakali islomiy moliya olimi bilan birga qabul qilinishi kerak.",
      "S: Bu ilova halol aksiyalar, fondlar yoki ETFlarni baholaydimi yoki roʻyxatini beradimi? J: Yoʻq, va bu qoʻllanma doirasida hech qachon bermaydi — fondlarni saralash va investitsiya tavsiyalari uning doirasidan tashqarida boʻlib, bu mazmun bera olmaydigan litsenziyali moliyaviy malakani talab qiladi.",
      "S: Bu qoʻllanma fatvomi? J: Yoʻq. Fatvo — malakali olim tomonidan muayyan savol va vaziyatga javoban chiqariladigan aniq diniy hukm. Bu qoʻllanma faqat umumiy tamoyillarni oʻrgatadi; oʻz vaziyatingiz boʻyicha haqiqiy hukm uchun bevosita malakali, ishonchli olimga murojaat qiling.",
    ],
    disclaimer:
      "Ushbu qoʻllanmaning butun mazmuni taʼlimiy boʻlib, moliyaviy maslahat ham, fatvo ham emas. Oʻz pulingiz boʻyicha qarorlar uchun doimo malakali moliya va din mutaxassislari bilan maslahatlashing.",
  },
  {
    title: "Savol-javob: shariatga mos variantlarni qanday topaman?",
    summary: "Roʻyxat emas, sertifikatlangan malakani izlang — bu ilova ataylab roʻyxat bermaydi.",
    body: [
      "S: Halol banklar, fondlar yoki investitsiya platformalari roʻyxatini qayerdan topsam boʻladi? J: Bu ilovada emas, va bu ataylab shunday — mahsulotlar roʻyxati doimo oʻzgarib turadi, mamlakatlarga qarab keskin farq qiladi va faqat ixtisoslashgan muassasalar toʻgʻri yurita oladigan doimiy muvofiqlik nazoratini talab qiladi. Buning oʻrniga haqiqiy, nomlari maʼlum shariat kuzatuv kengashiga va eʼlon qilingan muvofiqlik metodologiyasiga ega muassasalarni izlang.",
      "S: Olim yoki sertifikat haqiqiy ekanini qanday bilaman? J: Norasmiy onlayn daʼvolarga emas, balki mintaqangizda yoki xalqaro miqyosda tan olingan islomiy moliya standartlarini belgilovchi tashkilotlar tomonidan eʼtirof etilgan olimlar yoki kengashlarga eʼtibor bering. Obroʻli muassasa oʻz mahsulotlarini kim va qanday tekshirishi haqida ochiq maʼlumot beradi.",
      "S: Yashayotgan joyimda hech qanday islomiy moliya varianti topa olmasam, nima qilishim kerak? J: Bu real va keng tarqalgan holat. Buni bilimli mahalliy imom yoki olim bilan muhokama qiling — ular sizning aniq sharoitingiz uchun mavjud variantlarni tarozuga solishda yordam berishlari mumkin, chunki bu boradagi yoʻl-yoʻriq siz uchun haqiqatan qanday muqobillar mavjudligiga katta darajada bogʻliq boʻlishi mumkin.",
    ],
    actions: [
      "Reklama daʼvolariga tayanmay, nomlari maʼlum va shaffof shariat kuzatuv kengashiga ega muassasalarni izlang.",
    ],
  },
  {
    title: "Savol-javob: ipoteka, kartalar va kreditlar",
    summary: "Aynan shu savollar umumiy qoʻllanmani emas, malakali olimni talab qiladi.",
    body: [
      "S: Ipoteka har doim ribomi? J: Tuzilmalar turlicha — baʼzi anʼanaviy ipotekalar foizga asoslangan qarzlardir, baʼzi provayderlar esa foizdan qochishga moʻljallangan muqobil tuzilmalarni (masalan, kamayib boruvchi sheriklik yoki ijara orqali mulkka egalik modellari) taklif qiladi. Muayyan mahsulot amalda bunga erishadimi-yoʻqmi — bu uning haqiqiy shartnomasi haqidagi ilmiy savol boʻlib, uni u yoki bu tarzda oʻzicha taxmin qilib boʻlmaydi.",
      "S: Agar qarzni har doim toʻliq toʻlab, hech qachon foiz toʻlamasam, kredit kartasidan foydalansam boʻladimi? J: Olimlar bu borada turli fikrlarga ega, qisman shuning uchunki, siz amalda uni hech qachon ishga tushirmasangiz ham, asosiy shartnomada texnik jihatdan foiz bandi boʻlishi mumkin. Bu malakali olimlar fikri chindan farq qiladigan masala — yagona umumiy javob bor deb oʻylamay, ishonchli olimdan soʻrang.",
      "S: Baʼzi vaziyatlarda chetlab oʻtib boʻlmaydigan talaba kreditlari yoki boshqa qarzlar-chi? J: Zarurat va qiyinchilik olimlar puxta tarozuga soladigan real omillardir va fikrlar vaziyat hamda yurisdiksiyaga qarab farq qiladi. Agar shunday qaror oldida turgan boʻlsangiz, uni faqat umumiy oʻqish asosida hal qilishga urinmay, aniq vaziyatingizni malakali olimga olib boring.",
    ],
    disclaimer:
      "Bular chindan ixtilofli, shartnomaga bogʻliq savollardir. Bu savol-javob faqat har bir savol qanday turdagi savol ekanini koʻrsatadi — u ularning birortasiga ham sizning vaziyatingiz uchun javob bermaydi.",
  },
];
