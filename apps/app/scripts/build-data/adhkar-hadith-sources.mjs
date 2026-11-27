// Source hadith(s) for every zikr in packages/shared/src/content/zikr.ts — mapping only.
// Hadith text (Arabic + translations) is fetched from fawazahmed0/hadith-api at build time:
//   https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/{lang}-{collection}/{N}.json
// `hadithNumber` = the API's `hadithnumber` (Muslim: sequential, NOT Abdul Baqi — see `ref`).
// Decimal numbers (e.g. Tirmidhi 3604.02) have no file of their own: fetch
// `{Math.floor(n)}.json` and pick the record whose `hadithnumber === n`.
// `marker` = Arabic substring present in the `ara-*` text after normalisation (harakat/tatweel
// stripped, أإآٱ→ا, ى→ي, ة→ه). `grade` = what the API reports (Al-Albani unless noted).
// Verified 2026-11-20 against both ara- and eng- editions.

/** zikrId → source hadith(s), ordered most relevant first. Verified against fawazahmed0/hadith-api. */
export const ZIKR_HADITH_SOURCES = {
  // ── Anytime ────────────────────────────────────────────────────────────────
  "anytime-subhanallah-bihamdihi": [
    {
      collection: "bukhari",
      hadithNumber: 6405,
      ref: "Sahih al-Bukhari 6405",
      marker: "من قال سبحان الله وبحمده",
      grade: "Sahih",
    },
    {
      collection: "muslim",
      hadithNumber: 6842,
      ref: "Sahih Muslim 2691",
      marker: "ومن قال سبحان الله وبحمده",
      grade: "Sahih",
    },
  ],
  "anytime-tahlil": [
    {
      collection: "bukhari",
      hadithNumber: 6403,
      ref: "Sahih al-Bukhari 6403",
      marker: "كانت له عدل عشر رقاب",
      grade: "Sahih",
    },
    {
      collection: "muslim",
      hadithNumber: 6842,
      ref: "Sahih Muslim 2691",
      marker: "كانت له عدل عشر رقاب",
      grade: "Sahih",
    },
  ],
  "anytime-istighfar": [
    {
      collection: "muslim",
      hadithNumber: 6858,
      ref: "Sahih Muslim 2702",
      marker: "لاستغفر الله في اليوم مائه مره",
      grade: "Sahih",
    },
    {
      collection: "bukhari",
      hadithNumber: 6307,
      ref: "Sahih al-Bukhari 6307",
      marker: "اكثر من سبعين مره",
      grade: "Sahih",
    },
  ],
  "anytime-hawqala": [
    {
      collection: "bukhari",
      hadithNumber: 6384,
      ref: "Sahih al-Bukhari 6384",
      marker: "كنز من كنوز الجنه",
      grade: "Sahih",
    },
    {
      collection: "muslim",
      hadithNumber: 6862,
      ref: "Sahih Muslim 2704",
      marker: "لا حول ولا قوه الا بالله",
      grade: "Sahih",
    },
  ],
  "anytime-tasbih-set": [
    {
      collection: "muslim",
      hadithNumber: 5601,
      ref: "Sahih Muslim 2137",
      marker: "احب الكلام الي الله اربع",
      grade: "Sahih",
    },
    {
      collection: "nasai",
      hadithNumber: 1350,
      ref: "Sunan an-Nasa'i 1350",
      marker: "فاجعلوها خمسا وعشرين",
      grade: "Sahih",
    },
  ],
  "anytime-kalimatan": [
    {
      collection: "bukhari",
      hadithNumber: 6406,
      ref: "Sahih al-Bukhari 6406",
      marker: "كلمتان خفيفتان علي اللسان",
      grade: "Sahih",
    },
    {
      collection: "muslim",
      hadithNumber: 6846,
      ref: "Sahih Muslim 2694",
      marker: "كلمتان خفيفتان علي اللسان",
      grade: "Sahih",
    },
  ],

  // ── After prayer ───────────────────────────────────────────────────────────
  "after_prayer-tasbih": [
    {
      collection: "muslim",
      hadithNumber: 1352,
      ref: "Sahih Muslim 597",
      marker: "من سبح الله في دبر كل صلاه ثلاثا وثلاثين",
      grade: "Sahih",
    },
    {
      collection: "bukhari",
      hadithNumber: 843,
      ref: "Sahih al-Bukhari 843",
      marker: "خلف كل صلاه ثلاثا وثلاثين",
      grade: "Sahih",
    },
  ],
  "after_prayer-tahmid": [
    {
      collection: "muslim",
      hadithNumber: 1352,
      ref: "Sahih Muslim 597",
      marker: "وحمد الله ثلاثا وثلاثين",
      grade: "Sahih",
    },
    {
      collection: "bukhari",
      hadithNumber: 843,
      ref: "Sahih al-Bukhari 843",
      marker: "خلف كل صلاه ثلاثا وثلاثين",
      grade: "Sahih",
    },
  ],
  "after_prayer-takbir": [
    {
      collection: "muslim",
      hadithNumber: 1352,
      ref: "Sahih Muslim 597",
      marker: "وكبر الله ثلاثا وثلاثين",
      grade: "Sahih",
    },
    {
      collection: "muslim",
      hadithNumber: 1349,
      ref: "Sahih Muslim 596",
      marker: "واربع وثلاثون تكبيره",
      grade: "Sahih",
    },
  ],
  "after_prayer-tahlil-hundred": [
    {
      collection: "muslim",
      hadithNumber: 1352,
      ref: "Sahih Muslim 597",
      marker: "وقال تمام المائه لا اله الا الله",
      grade: "Sahih",
    },
  ],
  "after_prayer-tahlil-ten": [
    {
      collection: "tirmidhi",
      hadithNumber: 3534,
      ref: "Jami' at-Tirmidhi 3534",
      marker: "عشر مرات علي اثر المغرب",
      grade: "Hasan Sahih",
    },
    {
      collection: "tirmidhi",
      hadithNumber: 3474,
      ref: "Jami' at-Tirmidhi 3474",
      marker: "في دبر صلاه الفجر وهو ثاني رجليه",
      grade: "Daif (Al-Albani); Hasan Sahih (Bashar Awad)",
    },
  ],
  "after_prayer-ajirni-min-an-nar": [
    {
      collection: "abudawud",
      hadithNumber: 5079,
      ref: "Sunan Abi Dawud 5079",
      marker: "فقل اللهم اجرني من النار",
      grade: "Daif",
    },
  ],
  "after_prayer-muadh-dhikr-shukr": [
    {
      collection: "abudawud",
      hadithNumber: 1522,
      ref: "Sunan Abi Dawud 1522",
      marker: "اللهم اعني علي ذكرك وشكرك وحسن عبادتك",
      grade: "Sahih",
    },
    {
      collection: "nasai",
      hadithNumber: 1303,
      ref: "Sunan an-Nasa'i 1303",
      marker: "رب اعني علي ذكرك وشكرك وحسن عبادتك",
      grade: "Sahih",
    },
  ],
  "after_prayer-nur": [
    {
      collection: "muslim",
      hadithNumber: 1799,
      ref: "Sahih Muslim 763",
      marker: "اللهم اجعل في قلبي نورا وفي لساني نورا",
      grade: "Sahih",
    },
    {
      collection: "bukhari",
      hadithNumber: 6316,
      ref: "Sahih al-Bukhari 6316",
      marker: "اللهم اجعل في قلبي نورا",
      grade: "Sahih",
    },
  ],
  "after_prayer-kaffarat-al-majlis": [
    {
      collection: "tirmidhi",
      hadithNumber: 3433,
      ref: "Jami' at-Tirmidhi 3433",
      marker: "سبحانك اللهم وبحمدك اشهد ان لا اله الا انت استغفرك واتوب اليك",
      grade: "Sahih",
    },
    {
      collection: "nasai",
      hadithNumber: 1344,
      ref: "Sunan an-Nasa'i 1344",
      marker: "كان اذا جلس مجلسا او صلي",
      grade: "Sahih",
    },
  ],
  "after_prayer-malik-quddus": [
    {
      collection: "nasai",
      hadithNumber: 1732,
      ref: "Sunan an-Nasa'i 1732",
      marker: "ويرفع صوته بالثالثه",
      grade: "Sahih",
    },
    {
      collection: "nasai",
      hadithNumber: 1699,
      ref: "Sunan an-Nasa'i 1699",
      marker: "ثلاث مرات يطيل في اخرهن",
      grade: "Sahih",
    },
  ],
  // Thawban: on finishing the salah he ﷺ sought forgiveness three times (Muslim 591).
  "after_prayer-istighfar-three": [
    {
      collection: "muslim",
      hadithNumber: 1334,
      ref: "Sahih Muslim 591",
      marker: "استغفر ثلاثا",
      grade: "Sahih",
    },
  ],
  "after_prayer-allah-the-giver-of-peace": [
    {
      collection: "muslim",
      hadithNumber: 1334,
      ref: "Sahih Muslim 591",
      marker: "اللهم انت السلام ومنك السلام",
      grade: "Sahih",
    },
    {
      collection: "nasai",
      hadithNumber: 1337,
      ref: "Sunan an-Nasa'i 1337",
      marker: "اللهم انت السلام ومنك السلام",
      grade: "Sahih",
    },
  ],
  "after_prayer-allah-the-preventer-and-the-giver-of-all-things": [
    {
      collection: "bukhari",
      hadithNumber: 844,
      ref: "Sahih al-Bukhari 844",
      marker: "اللهم لا مانع لما اعطيت",
      grade: "Sahih",
    },
    {
      collection: "muslim",
      hadithNumber: 1338,
      ref: "Sahih Muslim 593",
      marker: "اللهم لا مانع لما اعطيت",
      grade: "Sahih",
    },
  ],
  "after_prayer-allah-the-possessor-of-all-and-the-only-one-wort": [
    {
      collection: "muslim",
      hadithNumber: 1343,
      ref: "Sahih Muslim 594",
      marker: "لا اله الا الله ولا نعبد الا اياه",
      grade: "Sahih",
    },
  ],
  "after_prayer-ayat-al-kursi": [],
  "after_prayer-al-ikhlas": [
    {
      collection: "abudawud",
      hadithNumber: 1523,
      ref: "Sunan Abi Dawud 1523",
      marker: "ان اقرا بالمعوذات دبر كل صلاه",
      grade: "Sahih",
    },
    {
      collection: "tirmidhi",
      hadithNumber: 3575,
      ref: "Jami' at-Tirmidhi 3575",
      marker: "والمعوذتين حين تمسي وتصبح ثلاث مرات",
      grade: "Hasan",
    },
  ],
  "after_prayer-al-falaq": [
    {
      collection: "abudawud",
      hadithNumber: 1523,
      ref: "Sunan Abi Dawud 1523",
      marker: "ان اقرا بالمعوذات دبر كل صلاه",
      grade: "Sahih",
    },
    {
      collection: "tirmidhi",
      hadithNumber: 3575,
      ref: "Jami' at-Tirmidhi 3575",
      marker: "والمعوذتين حين تمسي وتصبح ثلاث مرات",
      grade: "Hasan",
    },
  ],
  "after_prayer-an-nas": [
    {
      collection: "abudawud",
      hadithNumber: 1523,
      ref: "Sunan Abi Dawud 1523",
      marker: "ان اقرا بالمعوذات دبر كل صلاه",
      grade: "Sahih",
    },
    {
      collection: "tirmidhi",
      hadithNumber: 3575,
      ref: "Jami' at-Tirmidhi 3575",
      marker: "والمعوذتين حين تمسي وتصبح ثلاث مرات",
      grade: "Hasan",
    },
  ],
  "after_prayer-supplication-for-beneficial-knowledge-good-provi": [
    {
      collection: "ibnmajah",
      hadithNumber: 925,
      ref: "Sunan Ibn Majah 925",
      marker: "اللهم اني اسالك علما نافعا",
      grade: "Sahih",
    },
  ],

  // ── Morning / evening ──────────────────────────────────────────────────────
  "morning-tasbih-hundred": [
    {
      collection: "muslim",
      hadithNumber: 6843,
      ref: "Sahih Muslim 2692",
      marker: "من قال حين يصبح وحين يمسي سبحان الله وبحمده مائه مره",
      grade: "Sahih",
    },
  ],
  "evening-tasbih-hundred": [
    {
      collection: "muslim",
      hadithNumber: 6843,
      ref: "Sahih Muslim 2692",
      marker: "من قال حين يصبح وحين يمسي سبحان الله وبحمده مائه مره",
      grade: "Sahih",
    },
  ],
  "morning-protection": [
    {
      collection: "abudawud",
      hadithNumber: 5088,
      ref: "Sunan Abi Dawud 5088",
      marker: "بسم الله الذي لا يضر مع اسمه شيء",
      grade: "Sahih",
    },
    {
      collection: "tirmidhi",
      hadithNumber: 3388,
      ref: "Jami' at-Tirmidhi 3388",
      marker: "بسم الله الذي لا يضر مع اسمه شيء",
      grade: "Hasan Sahih",
    },
  ],
  "evening-protection": [
    {
      collection: "abudawud",
      hadithNumber: 5088,
      ref: "Sunan Abi Dawud 5088",
      marker: "بسم الله الذي لا يضر مع اسمه شيء",
      grade: "Sahih",
    },
    {
      collection: "tirmidhi",
      hadithNumber: 3388,
      ref: "Jami' at-Tirmidhi 3388",
      marker: "بسم الله الذي لا يضر مع اسمه شيء",
      grade: "Hasan Sahih",
    },
  ],
  "morning-asking-for-protection-from-all-harms": [
    {
      collection: "abudawud",
      hadithNumber: 5088,
      ref: "Sunan Abi Dawud 5088",
      marker: "بسم الله الذي لا يضر مع اسمه شيء",
      grade: "Sahih",
    },
    {
      collection: "tirmidhi",
      hadithNumber: 3388,
      ref: "Jami' at-Tirmidhi 3388",
      marker: "بسم الله الذي لا يضر مع اسمه شيء",
      grade: "Hasan Sahih",
    },
  ],
  "morning-radeetu": [
    {
      collection: "abudawud",
      hadithNumber: 1529,
      ref: "Sunan Abi Dawud 1529",
      marker: "من قال رضيت بالله ربا وبالاسلام دينا",
      grade: "Sahih",
    },
    {
      collection: "ibnmajah",
      hadithNumber: 3870,
      ref: "Sunan Ibn Majah 3870",
      marker: "يقول حين يمسي وحين يصبح رضيت بالله ربا",
      grade: "Daif",
    },
  ],
  "evening-refuge": [
    {
      collection: "tirmidhi",
      hadithNumber: 3604.02,
      ref: "Jami' at-Tirmidhi 3604",
      marker: "من قال حين يمسي ثلاث مرات اعوذ بكلمات الله التامات",
      grade: "Hasan (at-Tirmidhi; no API grade)",
    },
    {
      collection: "muslim",
      hadithNumber: 6880,
      ref: "Sahih Muslim 2709",
      marker: "لو قلت حين امسيت اعوذ بكلمات الله التامات",
      grade: "Sahih",
    },
  ],
  "evening-amsayna": [
    {
      collection: "muslim",
      hadithNumber: 6907,
      ref: "Sahih Muslim 2723",
      marker: "امسينا وامسي الملك لله والحمد لله",
      grade: "Sahih",
    },
    {
      collection: "abudawud",
      hadithNumber: 5071,
      ref: "Sunan Abi Dawud 5071",
      marker: "امسينا وامسي الملك لله والحمد لله",
      grade: "Sahih",
    },
  ],
  "morning-upon-entering-the-morning-by-asking-for-protecti": [
    {
      collection: "muslim",
      hadithNumber: 6908,
      ref: "Sahih Muslim 2723",
      marker: "واذا اصبح قال ذلك ايضا",
      grade: "Sahih",
    },
    {
      collection: "tirmidhi",
      hadithNumber: 3390,
      ref: "Jami' at-Tirmidhi 3390",
      marker: "اصبحنا واصبح الملك لله",
      grade: "Sahih",
    },
  ],
  "morning-upon-entering-the-morning-with-the-grace-of-alla": [
    {
      collection: "abudawud",
      hadithNumber: 5068,
      ref: "Sunan Abi Dawud 5068",
      marker: "اللهم بك اصبحنا وبك امسينا وبك نحيا وبك نموت واليك النشور",
      grade: "Sahih",
    },
    {
      collection: "tirmidhi",
      hadithNumber: 3391,
      ref: "Jami' at-Tirmidhi 3391",
      marker: "اللهم بك اصبحنا وبك امسينا",
      grade: "Sahih",
    },
  ],
  "evening-entering-the-evening-by-seeking-allah-s-mercy": [
    {
      collection: "ibnmajah",
      hadithNumber: 3868,
      ref: "Sunan Ibn Majah 3868",
      marker: "اللهم بك امسينا وبك اصبحنا وبك نحيي وبك نموت واليك المصير",
      grade: "Sahih",
    },
    {
      collection: "tirmidhi",
      hadithNumber: 3391,
      ref: "Jami' at-Tirmidhi 3391",
      marker: "اللهم بك امسينا وبك اصبحنا",
      grade: "Sahih",
    },
  ],
  "morning-sayyid-al-istighfar": [
    {
      collection: "bukhari",
      hadithNumber: 6306,
      ref: "Sahih al-Bukhari 6306",
      marker: "سيد الاستغفار",
      grade: "Sahih",
    },
  ],
  "morning-dua-for-protection-and-good-health": [
    {
      collection: "abudawud",
      hadithNumber: 5090,
      ref: "Sunan Abi Dawud 5090",
      marker: "اللهم عافني في بدني",
      grade: "Hasan Isnaad",
    },
  ],
  "morning-dua-for-salvation-in-the-world-and-hereafter": [
    {
      collection: "abudawud",
      hadithNumber: 5074,
      ref: "Sunan Abi Dawud 5074",
      marker: "اسالك العفو والعافيه في ديني ودنياي",
      grade: "Sahih",
    },
    {
      collection: "ibnmajah",
      hadithNumber: 3871,
      ref: "Sunan Ibn Majah 3871",
      marker: "اسالك العفو والعافيه في ديني ودنياي",
      grade: "Sahih",
    },
  ],
  "morning-dua-for-protection-from-shaytan-whispers": [
    {
      collection: "tirmidhi",
      hadithNumber: 3392,
      ref: "Jami' at-Tirmidhi 3392",
      marker: "اللهم عالم الغيب والشهاده فاطر السموات والارض",
      grade: "Sahih",
    },
    {
      collection: "abudawud",
      hadithNumber: 5067,
      ref: "Sunan Abi Dawud 5067",
      marker: "فاطر السموات والارض عالم الغيب والشهاده",
      grade: "Sahih",
    },
  ],
  "morning-asking-allah-for-guidance": [],
  "morning-entering-the-morning-upon-the-natural-religion-o": [],
  "evening-entering-the-evening-on-the-natural-disposition-": [],
  "morning-read-tasbih": [
    {
      collection: "muslim",
      hadithNumber: 6913,
      ref: "Sahih Muslim 2726",
      marker: "سبحان الله وبحمده عدد خلقه",
      grade: "Sahih",
    },
  ],
  "morning-istighfar-100x-a-day": [
    {
      collection: "bukhari",
      hadithNumber: 6307,
      ref: "Sahih al-Bukhari 6307",
      marker: "لاستغفر الله واتوب اليه في اليوم",
      grade: "Sahih",
    },
    {
      collection: "muslim",
      hadithNumber: 6859,
      ref: "Sahih Muslim 2702",
      marker: "فاني اتوب في اليوم اليه مائه مره",
      grade: "Sahih",
    },
  ],

  // ── Adhan ──────────────────────────────────────────────────────────────────
  "after_azan-salawat": [
    {
      collection: "muslim",
      hadithNumber: 849,
      ref: "Sahih Muslim 384",
      marker: "ثم صلوا علي فانه من صلي علي صلاه صلي الله عليه بها عشرا",
      grade: "Sahih",
    },
    {
      collection: "muslim",
      hadithNumber: 912,
      ref: "Sahih Muslim 408",
      marker: "من صلي علي واحده صلي الله عليه عشرا",
      grade: "Sahih",
    },
  ],
  "after_azan-wasila": [
    {
      collection: "bukhari",
      hadithNumber: 614,
      ref: "Sahih al-Bukhari 614",
      marker: "اللهم رب هذه الدعوه التامه",
      grade: "Sahih",
    },
  ],
  "after_azan-repeat": [
    {
      collection: "muslim",
      hadithNumber: 850,
      ref: "Sahih Muslim 385",
      marker: "اذا قال المؤذن الله اكبر الله اكبر",
      grade: "Sahih",
    },
    {
      collection: "muslim",
      hadithNumber: 851,
      ref: "Sahih Muslim 386",
      marker: "من قال حين يسمع المؤذن اشهد ان لا اله الا الله",
      grade: "Sahih",
    },
  ],

  // ── Before prayer ──────────────────────────────────────────────────────────
  "before_prayer-intention": [],
  "before_prayer-taawwudh": [
    {
      collection: "abudawud",
      hadithNumber: 775,
      ref: "Sunan Abi Dawud 775",
      marker: "اعوذ بالله السميع العليم من الشيطان الرجيم",
      grade: "Sahih",
    },
    {
      collection: "muslim",
      hadithNumber: 5738,
      ref: "Sahih Muslim 2203",
      marker: "فاذا احسسته فتعوذ بالله منه",
      grade: "Sahih",
    },
  ],
  "before_prayer-salawat": [
    {
      collection: "muslim",
      hadithNumber: 912,
      ref: "Sahih Muslim 408",
      marker: "من صلي علي واحده صلي الله عليه عشرا",
      grade: "Sahih",
    },
  ],

  // ── Before sleep ───────────────────────────────────────────────────────────
  "before_sleep-ayat-kursi": [
    {
      collection: "bukhari",
      hadithNumber: 5010,
      ref: "Sahih al-Bukhari 5010",
      marker: "اذا اويت الي فراشك فاقرا ايه الكرسي",
      grade: "Sahih (mu'allaq)",
    },
  ],
  "before_sleep-baqarah-end": [
    {
      collection: "bukhari",
      hadithNumber: 5009,
      ref: "Sahih al-Bukhari 5009",
      marker: "من قرا بالايتين من اخر سوره البقره",
      grade: "Sahih",
    },
    {
      collection: "muslim",
      hadithNumber: 1878,
      ref: "Sahih Muslim 807",
      marker: "الايتان من اخر سوره البقره",
      grade: "Sahih",
    },
  ],
  "before_sleep-ikhlas": [
    {
      collection: "bukhari",
      hadithNumber: 5017,
      ref: "Sahih al-Bukhari 5017",
      marker: "جمع كفيه ثم نفث فيهما",
      grade: "Sahih",
    },
  ],
  "before_sleep-sajdah": [
    {
      collection: "tirmidhi",
      hadithNumber: 3404,
      ref: "Jami' at-Tirmidhi 3404",
      marker: "لا ينام حتي يقرا بتنزيل السجده وبتبارك",
      grade: "Sahih",
    },
    {
      collection: "tirmidhi",
      hadithNumber: 2892,
      ref: "Jami' at-Tirmidhi 2892",
      marker: "كان لا ينام حتي يقرا",
      grade: "Daif Maqtu (Al-Albani)",
    },
  ],
  "before_sleep-mulk": [
    {
      collection: "tirmidhi",
      hadithNumber: 2891,
      ref: "Jami' at-Tirmidhi 2891",
      marker: "ثلاثون ايه شفعت لرجل حتي غفر له",
      grade: "Hasan",
    },
    {
      collection: "tirmidhi",
      hadithNumber: 3404,
      ref: "Jami' at-Tirmidhi 3404",
      marker: "لا ينام حتي يقرا بتنزيل السجده وبتبارك",
      grade: "Sahih",
    },
  ],
  "before_sleep-name": [
    {
      collection: "bukhari",
      hadithNumber: 6324,
      ref: "Sahih al-Bukhari 6324",
      marker: "باسمك اللهم اموت واحيا",
      grade: "Sahih",
    },
    {
      collection: "bukhari",
      hadithNumber: 6314,
      ref: "Sahih al-Bukhari 6314",
      marker: "اللهم باسمك اموت واحيا",
      grade: "Sahih",
    },
  ],
  "before_sleep-tasbih-fatimah": [
    {
      collection: "bukhari",
      hadithNumber: 3705,
      ref: "Sahih al-Bukhari 3705",
      marker: "تكبرا اربعا وثلاثين",
      grade: "Sahih",
    },
    {
      collection: "muslim",
      hadithNumber: 6915,
      ref: "Sahih Muslim 2727",
      marker: "تكبرا الله اربعا وثلاثين",
      grade: "Sahih",
    },
  ],
};

/** zikrId → verified repetition count (every id). */
export const ZIKR_TARGET_COUNTS = {
  "after_prayer-istighfar-three": 3,
  "anytime-subhanallah-bihamdihi": 100,
  "anytime-tahlil": 100,
  "anytime-istighfar": 100,
  "anytime-hawqala": 1,
  "anytime-tasbih-set": 25,
  "anytime-kalimatan": 1,
  "after_prayer-tasbih": 33,
  "after_prayer-tahmid": 33,
  "after_prayer-takbir": 33,
  "after_prayer-tahlil-hundred": 1,
  "after_prayer-tahlil-ten": 10,
  "after_prayer-ajirni-min-an-nar": 7,
  "after_prayer-muadh-dhikr-shukr": 1,
  "after_prayer-nur": 1,
  "after_prayer-kaffarat-al-majlis": 1,
  "after_prayer-malik-quddus": 3,
  "after_prayer-allah-the-giver-of-peace": 1,
  "after_prayer-allah-the-preventer-and-the-giver-of-all-things": 1,
  "after_prayer-allah-the-possessor-of-all-and-the-only-one-wort": 1,
  "after_prayer-ayat-al-kursi": 1,
  "after_prayer-al-ikhlas": 1,
  "after_prayer-al-falaq": 1,
  "after_prayer-an-nas": 1,
  "after_prayer-supplication-for-beneficial-knowledge-good-provi": 1,
  "morning-tasbih-hundred": 100,
  "evening-tasbih-hundred": 100,
  "morning-protection": 3,
  "evening-protection": 3,
  "morning-asking-for-protection-from-all-harms": 3,
  "morning-radeetu": 1,
  "evening-refuge": 3,
  "evening-amsayna": 1,
  "morning-upon-entering-the-morning-by-asking-for-protecti": 1,
  "morning-upon-entering-the-morning-with-the-grace-of-alla": 1,
  "evening-entering-the-evening-by-seeking-allah-s-mercy": 1,
  "morning-sayyid-al-istighfar": 1,
  "morning-dua-for-protection-and-good-health": 3,
  "morning-dua-for-salvation-in-the-world-and-hereafter": 1,
  "morning-dua-for-protection-from-shaytan-whispers": 1,
  "morning-asking-allah-for-guidance": 1,
  "morning-entering-the-morning-upon-the-natural-religion-o": 1,
  "evening-entering-the-evening-on-the-natural-disposition-": 1,
  "morning-read-tasbih": 3,
  "morning-istighfar-100x-a-day": 100,
  "after_azan-salawat": 1,
  "after_azan-wasila": 1,
  "after_azan-repeat": 1,
  "before_prayer-intention": 1,
  "before_prayer-taawwudh": 1,
  "before_prayer-salawat": 1,
  "before_sleep-ayat-kursi": 1,
  "before_sleep-baqarah-end": 1,
  "before_sleep-ikhlas": 3,
  "before_sleep-sajdah": 1,
  "before_sleep-mulk": 1,
  "before_sleep-name": 1,
  "before_sleep-tasbih-fatimah": 100,
};

/** Free-text notes for ids with no six-book source, weak-only sources, or data issues found. */
export const ZIKR_SOURCE_NOTES = {
  "anytime-hawqala":
    "No count in the hadith (Bukhari 6384 / Muslim 2704: 'a treasure of Paradise'); previous target 33 had no basis → 1.",
  "anytime-kalimatan":
    "No count in the hadith (Bukhari 6406 / Muslim 2694); previous target 10 had no basis → 1.",
  "anytime-tasbih-set":
    "Muslim 2137 gives no count. 25× each comes from Nasa'i 1350 (Zayd b. Thabit, sahih), where it is an approved alternative to 33/33/34 AFTER EVERY PRAYER — the count fits an after-prayer item better than 'anytime'.",
  "after_prayer-takbir":
    "Muslim 597 = 33/33/33 + tahlil completing 100 (the virtue text quoted is this hadith). Muslim 596 = 33/33/34 with no tahlil. With the separate tahlil-hundred item, 34 gave 101 (mixes the two); set to 33. Use 34 only if the tahlil item is dropped.",
  "after_prayer-tahlil-ten":
    "Maghrib ×10: Tirmidhi 3534 (hasan). Fajr ×10: Tirmidhi 3474 — weak: true (Al-Albani Daif; Bashar Awad Hasan Sahih). Fajr wording adds 'while his feet are still folded, before speaking'. The current virtue text ('raises ten degrees… protection from every disliked thing') is from the Fajr hadith (3474) only.",
  "after_prayer-ajirni-min-an-nar":
    "weak: true — only narration in the six books is Abu Dawud 5079 (Al-Albani, Abdul Hamid, Arnaut: Daif; Zubair Ali Zai: Hasan). 'Before speaking to anyone' is from Abu Dawud 5080, also Daif. Count 7 is from the hadith.",
  "after_prayer-nur":
    "Not an after-Fajr dhikr: in Muslim 763 / Bukhari 6316 the Prophet ﷺ said it while going out to the Fajr prayer after the adhan (other narrations: in his prayer/prostration). The 'after Fajr' label is inaccurate.",
  "after_prayer-kaffarat-al-majlis":
    "Virtue text credits 'A'ishah but the forgiveness wording is Abu Hurayrah's (Tirmidhi 3433). 'A'ishah's narration is Nasa'i 1344 (said after a sitting OR a prayer; shorter wording, no 'ashhadu an la ilaha illa anta').",
  "after_prayer-malik-quddus":
    "Three times: Nasa'i 1699 (prolonging the last) + 1732 (raising the voice on the third). The 'Rabbil-mala'ikati war-ruh' addition in the virtue text is NOT in Nasa'i's Sunan (it is from outside the six books).",
  "after_prayer-ayat-al-kursi":
    "No six-book source: the 'after every prayer' virtue is an-Nasa'i, as-Sunan al-Kubra 9848 ('Amal al-Yawm wal-Laylah), not in the Mujtaba. Bukhari 5010 is about bedtime, not after salah.",
  "after_prayer-al-ikhlas":
    "After every salah = once (Abu Dawud 1523 / Nasa'i 1336, 'al-mu'awwidhat', which scholars take to include al-Ikhlas). 3× applies only to morning/evening (Abu Dawud 5082 / Tirmidhi 3575), i.e. after Fajr & Maghrib. Ref 'an-Nasa'i 1337' is wrong (1337 = Thawban's 'Allahumma anta as-salam') → 1336. Virtue text is the morning/evening hadith, not the after-prayer one.",
  "after_prayer-al-falaq":
    "Same as al-Ikhlas: once after every salah (Abu Dawud 1523); 3× only after Fajr & Maghrib (Tirmidhi 3575). Ref Nasa'i 1337 → 1336.",
  "after_prayer-an-nas":
    "Same as al-Ikhlas: once after every salah (Abu Dawud 1523); 3× only after Fajr & Maghrib (Tirmidhi 3575). Ref Nasa'i 1337 → 1336.",
  "after_prayer-supplication-for-beneficial-knowledge-good-provi":
    "Ibn Majah 925: said after the salam of Fajr (Al-Albani Sahih; Zubair Ali Zai Daif). The virtue text is commentary, not from the hadith.",
  "morning-asking-for-protection-from-all-harms":
    "Duplicate of morning-protection (same dhikr, same hadith).",
  "morning-radeetu":
    "No count in any six-book narration: the morning/evening versions (Abu Dawud 5072, Tirmidhi 3389, Ibn Majah 3870) are all weak: true (Al-Albani Daif); the '×3' is from narrations outside the six books. Same words without a time are sahih in Abu Dawud 1529 ('Paradise becomes due') and Muslim 386 (after the adhan). Count set to 1.",
  "evening-refuge":
    "Count 3 from Tirmidhi 3604 (2nd hadith, API number 3604.02 — inside file 3604.json; at-Tirmidhi: hasan; no API grade). Muslim 2709 (scorpion story) has no count. Muslim duplicate record 6879 lacks an arabicnumber — use 6880.",
  "evening-entering-the-evening-by-seeking-allah-s-mercy":
    "App wording (evening, ending 'wa ilaykal-masir') matches Ibn Majah 3868. Tirmidhi 3391 has the endings swapped (morning al-masir, evening an-nushur); Abu Dawud 5068 evening omits 'bika asbahna'.",
  "morning-dua-for-protection-and-good-health":
    "Abu Dawud 5090: Abu Bakrah repeated it 3× morning and 3× evening following the Sunnah (Al-Albani Hasan al-isnad; Zubair Ali Zai Daif).",
  "morning-asking-allah-for-guidance":
    "No six-book source for this full morning/evening du'a (Anas to Fatimah; an-Nasa'i 'Amal al-Yawm 575 / al-Hakim). Only the opening 'Ya Hayyu ya Qayyum, bi-rahmatika astaghith' is in Tirmidhi 3524 (Al-Albani Hasan) as a du'a in distress, not as a morning dhikr — not mapped.",
  "morning-entering-the-morning-upon-the-natural-religion-o":
    "No six-book source (Ahmad, ad-Darimi, Ibn as-Sunni; an-Nasa'i al-Kubra).",
  "evening-entering-the-evening-on-the-natural-disposition-":
    "No six-book source (Ahmad, ad-Darimi, Ibn as-Sunni; an-Nasa'i al-Kubra).",
  "morning-read-tasbih":
    "Muslim 2726: said 3× after Fajr (Juwayriyah). Arabic in app has 'خَلْقَهِ' — should be 'خَلْقِهِ'.",
  "morning-istighfar-100x-a-day":
    "Not morning-specific ('in a day'). Overlaps anytime-istighfar (same hadiths). Exact wording 'astaghfirullaha wa atubu ilayh' is Bukhari 6307 (>70×/day); 100×/day is Muslim 2702.",
  "anytime-istighfar":
    "Virtue text (>70×, Bukhari 6307) does not match the target (100×, Muslim 2702) — both authentic; 100 kept.",
  "after_azan-salawat":
    "Count is 1: 'whoever sends one salah upon me, Allah sends ten upon him' (Muslim 384/408). Previous target 10 confused the reward with the count.",
  "after_azan-repeat":
    "Muslim 385: respond phrase by phrase to the mu'adhdhin (Paradise for the one who does so sincerely); Muslim 386: saying the shahadah on hearing it → sins forgiven. Also Bukhari 611 ('say what the mu'adhdhin says').",
  "before_prayer-intention": "Qur'an 4:103 only — a reminder, not a dhikr with a hadith source.",
  "before_prayer-taawwudh":
    "Ta'awwudh before recitation in salah: Abu Dawud 775 (wording 'A'udhu billahis-Sami'il-'Alim min ash-shaytanir-rajim…', in night prayer). Muslim 2203: seek refuge when Shaytan disturbs the prayer.",
  "before_prayer-salawat":
    "No hadith prescribes salawat ×3 'before standing' for salah; Muslim 408 is the general virtue (once → ten blessings). Previous target 3 had no basis → 1.",
  "before_sleep-ayat-kursi":
    "Bukhari 5010 is mu'allaq (ta'liq from 'Uthman b. al-Haytham) inside Sahih al-Bukhari; the full story is Bukhari 2311.",
  "before_sleep-sajdah":
    "Reference 'Tirmidhi 2892' is graded Daif Maqtu by Al-Albani in the API (Zubair Ali Zai Daif); the same Jabir hadith at Tirmidhi 3404 is graded Sahih (Al-Albani, Shakir) — use 3404.",
  "before_sleep-mulk":
    "Intercession virtue: Tirmidhi 2891 / Abu Dawud 1400 (hasan). Bedtime practice: Tirmidhi 3404.",
};
