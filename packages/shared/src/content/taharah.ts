import type { TaharahTopic } from "../types/taharah";

export { TAHARAH_CHECKLIST } from "./taharah-checklist";

/**
 * Learn Purification (Taharah) — educational guidance on ritual purity for
 * worship. Scholar-neutral; claims cite Qur'an or authentic hadith. Where
 * Sunni schools differ on details, that is noted briefly. Bump version on change.
 */
export const TAHARAH_CONTENT_VERSION = 1;

export const TAHARAH_SECTION_ORDER = [
  "intro",
  "water",
  "wudu",
  "ghusl",
  "tayammum",
  "najasah",
  "exceptions",
  "reference",
] as const;

export const TAHARAH_TOPICS: TaharahTopic[] = [
  // ── Intro ────────────────────────────────────────────────────────────────
  {
    id: "introduction",
    section: "intro",
    title: "Introduction to Taharah",
    summary: "Purification is the gateway to valid worship and daily discipline.",
    importance: "foundational",
    body: [
      "Taharah means ritual and physical purification that allows a Muslim to pray and perform worship in a state pleasing to Allah.",
      "Purification in Islam is not only about visible cleanliness; it also cultivates inward humility, obedience, and readiness for standing before Allah.",
      "The Prophet ﷺ taught purification as a practical daily habit: use clean water, remove impurities, and keep body, clothing, and prayer place clean.",
    ],
    quran: [
      {
        surah: 5,
        ayahFrom: 6,
        label: "Qur'an 5:6",
        excerpt:
          "O you who believe, when you rise for prayer, wash your faces and your hands up to the elbows...",
      },
      {
        surah: 2,
        ayahFrom: 222,
        label: "Qur'an 2:222",
        excerpt: "Indeed, Allah loves those who repent and loves those who purify themselves.",
      },
    ],
    actions: [
      "Treat purification as preparation for meeting Allah, not a rushed routine.",
      "Review one taharah topic each day until the full flow feels natural.",
    ],
    appLinks: [{ label: "Learn Salah hub", route: "/salah-guide" }],
  },
  {
    id: "importance-of-purity",
    section: "intro",
    title: "Importance of Purity",
    summary: "Purity is a condition for salah and a means of spiritual refinement.",
    importance: "obligatory",
    body: [
      "Salah is not accepted without purification from minor or major ritual impurity.",
      "Purity protects worship from invalidation and protects the believer from neglecting the limits Allah set for sacred acts.",
      "The Messenger of Allah ﷺ described purification as half of faith, showing its central role in Muslim life.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "Hadith 223",
        grade: "sahih",
        excerpt: "Purification is half of faith.",
      },
      {
        collection: "Sahih Muslim",
        citation: "Hadith 224",
        grade: "sahih",
        excerpt: "Allah does not accept prayer without purification.",
      },
    ],
    actions: [
      "Before each prayer, confirm your state of purity before beginning.",
      "Keep a small personal checklist for wudu, clothing, and prayer place.",
    ],
  },
  {
    id: "types-of-purity",
    section: "intro",
    title: "Types of Purity",
    summary: "Understand minor impurity, major impurity, and physical najasah.",
    body: [
      "Minor ritual impurity (hadath asghar) is removed by wudu, and if water cannot be used, by tayammum.",
      "Major ritual impurity (hadath akbar, such as janabah) is removed by ghusl; tayammum substitutes when water is unavailable or harmful.",
      "Physical impurity (najasah) on the body, clothing, or place of prayer must be removed for valid prayer.",
      "The four Sunni madhabs agree on these categories while differing in some details of what counts as nullifiers or tolerated traces.",
    ],
    quran: [
      {
        surah: 5,
        ayahFrom: 6,
        label: "Qur'an 5:6",
        excerpt:
          "If you are in a state of janabah, then purify yourselves. If you find no water, then perform tayammum with clean earth.",
      },
    ],
    actions: [
      "Learn to identify your state first, then apply the correct purification method.",
      "When unsure about details, follow a qualified teacher from your madhab consistently.",
    ],
  },

  // ── Water ────────────────────────────────────────────────────────────────
  {
    id: "water-in-islam",
    section: "water",
    title: "Water in Islam",
    summary: "Water is the primary means of purification and should not be wasted.",
    importance: "foundational",
    body: [
      "Pure, naturally clean water is the basis for wudu and ghusl in Islamic law.",
      "Islam encourages cleanliness while forbidding waste, even when water seems abundant.",
      "Scholars discuss categories of water in legal manuals; practically, water remains purifying unless clearly altered by impurity in color, smell, or taste.",
    ],
    quran: [
      {
        surah: 25,
        ayahFrom: 48,
        label: "Qur'an 25:48",
        excerpt: "And We send down pure water from the sky.",
      },
    ],
    hadith: [
      {
        collection: "Sunan Ibn Majah",
        citation: "Hadith 425",
        grade: "hasan",
        excerpt: "Do not waste water, even if you are at a flowing river.",
      },
    ],
    actions: [
      "Use enough water to wash thoroughly, but avoid excess.",
      "If water quality is doubtful, seek the nearest clearly clean source.",
    ],
  },

  // ── Wudu ─────────────────────────────────────────────────────────────────
  {
    id: "what-is-wudu",
    section: "wudu",
    title: "What is Wudu?",
    summary: "Ritual ablution that removes minor impurity before worship.",
    importance: "obligatory",
    body: [
      "Wudu is an act of worship with specific limbs and order taught by the Prophet ﷺ.",
      "It removes minor ritual impurity and is required for salah and for tawaf according to the majority of scholars.",
      "Many jurists also require wudu for touching the mushaf directly, while some allow with conditions.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 6954",
        grade: "sahih",
        excerpt: "Allah does not accept the prayer of one who breaks wudu until he performs wudu.",
      },
    ],
    appLinks: [{ label: "Salah preparation", route: "/salah-guide/wudu" }],
  },
  {
    id: "wudu-conditions",
    section: "wudu",
    title: "Conditions for Valid Wudu",
    summary: "Intention, pure water, removal of barriers, and proper completion.",
    importance: "obligatory",
    body: [
      "The person must be Muslim, sane, and intending purification for worship.",
      "Water must reach the required limbs, so barriers like thick paint or wax must be removed.",
      "Wudu is valid only when the obligatory elements are fulfilled in proper sequence and continuity according to most scholars.",
      "Madhabs differ on some specifics, such as whether intention is a pillar or condition and the strictness of uninterrupted sequence.",
    ],
    quran: [
      {
        surah: 5,
        ayahFrom: 6,
        label: "Qur'an 5:6",
        excerpt:
          "Wash your faces and your hands up to the elbows, wipe your heads, and wash your feet up to the ankles.",
      },
    ],
    actions: [
      "Check rings, watches, and sleeves so water reaches skin properly.",
      "Do wudu calmly and in one flow to avoid missing limbs.",
    ],
  },
  {
    id: "wudu-obligatory",
    section: "wudu",
    title: "Obligatory Acts of Wudu",
    summary: "Core pillars that must be present for wudu to count.",
    importance: "obligatory",
    body: [
      "The core obligations are washing the face, washing both arms to and including elbows, wiping the head, and washing both feet to and including ankles.",
      "Intention is obligatory in most schools; the Hanafi school treats intention as sunnah for lifting ritual impurity though still highly emphasized for reward.",
      "Sequence and continuity are required by the Shafi'i and Hanbali schools, while Hanafi and Maliki discussions are more nuanced in some scenarios.",
    ],
    quran: [
      {
        surah: 5,
        ayahFrom: 6,
        label: "Qur'an 5:6",
        excerpt:
          "Wash your faces and your hands up to the elbows, wipe your heads, and wash your feet up to the ankles.",
      },
    ],
    disclaimer:
      "Details of faraid (obligatory elements) vary slightly among madhabs. Learn and apply one reliable school consistently.",
  },
  {
    id: "wudu-sunnah",
    section: "wudu",
    title: "Sunnah Acts of Wudu",
    summary: "Recommended practices that perfect and beautify wudu.",
    importance: "recommended",
    body: [
      "Saying Bismillah, washing hands first, rinsing mouth and nose, beginning with the right side, and repeating washes up to three times are established sunnah practices.",
      "Using siwak before wudu and making dua after wudu are also strongly recommended in prophetic guidance.",
      "These acts do not replace obligatory pillars but complete the quality and reward of purification.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "Hadith 234",
        grade: "sahih",
        excerpt:
          "Whoever performs wudu and does it well, then says the testimony, the gates of Paradise are opened for him.",
      },
    ],
    actions: [
      "Practice the sunnah sequence until it becomes your natural routine.",
      "After wudu, recite the shahadah dua consistently.",
    ],
    appLinks: [{ label: "Duas after wudu", route: "/dua/prayer" }],
  },
  {
    id: "wudu-steps",
    section: "wudu",
    title: "Step-by-Step Wudu",
    summary: "Complete sequence from intention to the closing supplication.",
    importance: "obligatory",
    body: [
      "The Prophet ﷺ taught wudu as a practical sequence that combines obligations and sunnah elements.",
      "Perform each step carefully and ensure water reaches all required areas.",
    ],
    steps: [
      {
        title: "Intend purification and say Bismillah",
        body: "Make intention in your heart for wudu and begin with the name of Allah.",
        transliteration: "Bismillah",
        tip: "Intention is in the heart; no spoken formula is required.",
      },
      {
        title: "Wash both hands three times",
        body: "Wash hands up to the wrists, including between fingers.",
      },
      {
        title: "Rinse mouth three times",
        body: "Take water into the mouth, rinse, and expel.",
      },
      {
        title: "Rinse nose three times",
        body: "Gently inhale water into nostrils and expel it.",
      },
      {
        title: "Wash the face three times",
        body: "Wash from hairline to chin and from ear to ear.",
      },
      {
        title: "Wash right arm then left arm",
        body: "Wash each arm from fingertips to and including elbows, up to three times.",
      },
      {
        title: "Wipe the head once",
        body: "With wet hands, wipe over the head once; include the ears.",
      },
      {
        title: "Wash right foot then left foot",
        body: "Wash each foot to and including ankles, including between toes.",
      },
      {
        title: "Recite the dua after wudu",
        body: "Say the shahadah and ask Allah to make you among the purified.",
        transliteration:
          "Ashhadu an la ilaha illa Allah, wahdahu la sharika lah, wa ashhadu anna Muhammadan 'abduhu wa rasuluh.",
        tip: "This closing dhikr is a strong sunnah with great reward.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 164",
        grade: "sahih",
        excerpt: "The Prophet ﷺ performed ablution by washing each limb up to three times.",
      },
    ],
    appLinks: [
      { label: "Wudu in Salah guide", route: "/salah-guide/wudu" },
      { label: "Wudu dua", route: "/learn-dua/wudu-prayer" },
    ],
  },
  {
    id: "wudu-duas",
    section: "wudu",
    title: "Duas Related to Wudu",
    summary: "Supplications before and after wudu from authentic reports.",
    importance: "highly-recommended",
    body: [
      "The strongest narrated adhkar around wudu include saying Bismillah at the start and shahadah after completion.",
      "Some commonly shared detailed duas per limb are not established with strong authenticity; scholars advise caution in attributing them to the Prophet ﷺ.",
      "Keep to authentic adhkar and maintain presence of heart while washing.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "Hadith 234",
        grade: "sahih",
        excerpt:
          "Whoever performs wudu and says: Ashhadu an la ilaha illa Allah... the gates of Paradise are opened for him.",
      },
    ],
    actions: [
      "Memorize the post-wudu shahadah if you have not yet done so.",
      "Avoid reciting unverified formulas as established sunnah.",
    ],
    appLinks: [
      { label: "Prayer duas", route: "/dua/prayer" },
      { label: "Learn wudu dua", route: "/learn-dua/wudu-prayer" },
    ],
  },
  {
    id: "wudu-breakers",
    section: "wudu",
    title: "What Breaks Wudu?",
    summary: "Know the nullifiers to protect prayer validity.",
    importance: "obligatory",
    body: [
      "Anything exiting from the private passages, deep sleep that removes awareness, and loss of consciousness nullify wudu by scholarly agreement.",
      "Touching private parts directly and touching a non-mahram differ by madhab in whether they nullify wudu.",
      "When in doubt after possible nullification, follow certainty: existing purity remains until certain of nullifier.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 137",
        grade: "sahih",
        excerpt: "No one should leave prayer unless he hears a sound or finds a smell.",
      },
    ],
    disclaimer:
      "Nullifier details differ among schools, especially touching and bleeding. Follow a qualified local teacher and one school's method.",
  },
  {
    id: "wudu-mistakes",
    section: "wudu",
    title: "Common Wudu Mistakes",
    summary: "Frequent errors that reduce reward or invalidate ablution.",
    body: [
      "Rushing and missing parts of limbs is a common cause of invalid wudu.",
      "Some people over-wash excessively, while others skip required areas like heels, elbows, or between fingers and toes.",
      "Speaking loudly, wasting water, and treating wudu as mechanical reduce mindfulness and adab.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "Hadith 241",
        grade: "sahih",
        excerpt: "Woe to the heels from the Fire — warning against leaving parts unwashed in wudu.",
      },
    ],
    actions: [
      "Slow down and consciously verify full coverage of required limbs.",
      "Use moderate water and focus on intention and remembrance.",
    ],
  },
  {
    id: "virtues-of-wudu",
    section: "wudu",
    title: "Virtues of Wudu",
    summary: "Wudu erases sins, raises ranks, and marks believers on Judgment Day.",
    importance: "highly-recommended",
    body: [
      "Authentic hadith describe sins falling from limbs during complete wudu.",
      "Those who maintain wudu regularly are promised special honor and recognition by the traces of ablution on the Day of Judgment.",
      "Wudu before prayer and before sleep are among the believer's protective habits.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "Hadith 246",
        grade: "sahih",
        excerpt:
          "My ummah will come on the Day of Resurrection with bright faces, hands, and feet from the traces of wudu.",
      },
    ],
    actions: [
      "Renew wudu before each prayer window where possible.",
      "Keep wudu before sleeping as a nightly sunnah routine.",
    ],
    appLinks: [{ label: "Track your salah", route: "/salah-guide" }],
  },

  // ── Ghusl ────────────────────────────────────────────────────────────────
  {
    id: "what-is-ghusl",
    section: "ghusl",
    title: "What is Ghusl?",
    summary: "Full-body ritual purification from major impurity.",
    importance: "obligatory",
    body: [
      "Ghusl is complete washing of the body with intention to lift major ritual impurity.",
      "It becomes obligatory in specific cases such as janabah and after menstruation or postnatal bleeding ends.",
      "A valid ghusl includes ensuring water reaches the entire body, including roots of hair and hidden skin folds.",
    ],
    quran: [
      {
        surah: 5,
        ayahFrom: 6,
        label: "Qur'an 5:6",
        excerpt: "If you are in a state of janabah, then purify yourselves.",
      },
    ],
    appLinks: [{ label: "Salah prep overview", route: "/salah-guide" }],
  },
  {
    id: "ghusl-when",
    section: "ghusl",
    title: "When Ghusl is Required",
    summary: "Cases that make full ritual bath obligatory.",
    importance: "obligatory",
    body: [
      "Ghusl is required after sexual discharge with desire, after marital relations, and after menstruation or nifas ends.",
      "Ghusl for Jumu'ah is strongly recommended by many scholars; some held it obligatory for those attending when needed due to cleanliness concerns.",
      "Converts to Islam are recommended or required to perform ghusl according to differing juristic positions.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 248",
        grade: "sahih",
        excerpt:
          "When one sits between the four parts and intercourse occurs, ghusl becomes obligatory.",
      },
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 877",
        grade: "sahih",
        excerpt: "Ghusl on Friday is due on every adult (interpreted with juristic detail).",
      },
    ],
    disclaimer: "Jumu'ah ghusl and convert ghusl rulings differ by madhab and circumstance.",
    appLinks: [{ label: "Hayd guide", route: "/hayd" }],
  },
  {
    id: "ghusl-steps",
    section: "ghusl",
    title: "Step-by-Step Ghusl",
    summary: "Prophetic method for complete purification from major impurity.",
    importance: "obligatory",
    body: [
      "The Prophet's ﷺ ghusl combined minimal obligations with complete sunnah etiquette.",
      "At minimum, intention and full-body water coverage are required; the full sunnah method is best.",
    ],
    steps: [
      {
        title: "Form intention",
        body: "Intend in your heart to remove major ritual impurity.",
      },
      {
        title: "Say Bismillah and wash hands",
        body: "Begin in Allah's name and wash hands thoroughly.",
      },
      {
        title: "Wash private area",
        body: "Clean any impurity from private parts first.",
      },
      {
        title: "Perform wudu",
        body: "Perform a full wudu like for prayer; many scholars allow delaying foot washing if standing in pooled water.",
      },
      {
        title: "Pour water over head three times",
        body: "Ensure water reaches scalp and hair roots.",
      },
      {
        title: "Wash right side then left side",
        body: "Pour and rub water across entire body, beginning with the right side.",
      },
      {
        title: "Ensure full body coverage",
        body: "Do not leave dry spots such as underarms, navel, behind knees, and between toes.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 248",
        grade: "sahih",
        excerpt:
          "Aishah (RA) described the Prophet's ghusl: he washed hands, private parts, performed wudu, then poured water over his body.",
      },
    ],
  },
  {
    id: "ghusl-mistakes",
    section: "ghusl",
    title: "Common Ghusl Mistakes",
    summary: "Avoid dry areas, missing intention, and confusion with normal bathing.",
    body: [
      "A ritual bath is not identical to ordinary bathing unless intention and full body coverage are present.",
      "Common mistakes include missing scalp roots, leaving skin folds dry, and assuming quick rinsing is enough.",
      "People with thick hair should ensure water reaches roots; braids need not be fully undone if water reaches the scalp according to many scholars.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "Hadith 330",
        grade: "sahih",
        excerpt: "The Prophet ﷺ instructed ensuring water reaches hair roots in ghusl.",
      },
    ],
    actions: [
      "Rub water over body to confirm all areas are covered.",
      "When uncertain, repeat sections rather than finishing with doubt.",
    ],
  },

  // ── Tayammum ─────────────────────────────────────────────────────────────
  {
    id: "what-is-tayammum",
    section: "tayammum",
    title: "What is Tayammum?",
    summary: "Dry ablution using clean earth when water cannot be used.",
    importance: "obligatory",
    body: [
      "Tayammum is a lawful substitute for wudu or ghusl when water is unavailable or harmful.",
      "It reflects Islamic ease: obligations remain, but hardship is lifted through a valid alternative.",
      "When water becomes available and usable again, normal purification with water resumes.",
    ],
    quran: [
      {
        surah: 5,
        ayahFrom: 6,
        label: "Qur'an 5:6",
        excerpt:
          "If you do not find water, then perform tayammum with clean earth and wipe your faces and hands.",
      },
    ],
  },
  {
    id: "tayammum-when",
    section: "tayammum",
    title: "When Tayammum is Allowed",
    summary: "Permitted in absence of water or risk of harm from water use.",
    body: [
      "Tayammum is allowed when water cannot be found after reasonable search or when use of water causes harm due to illness or severe cold without means to warm water.",
      "It is also permitted when available water is needed for urgent survival use, such as drinking.",
      "Jurists differ on specific edge cases, such as distance to water and fear thresholds, but all uphold hardship-based facilitation.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 344",
        grade: "sahih",
        excerpt: "Clean earth has been made for me a place of prayer and a means of purification.",
      },
    ],
    actions: [
      "Search reasonably for water before moving to tayammum.",
      "If medically advised to avoid water, follow that guidance and perform tayammum.",
    ],
  },
  {
    id: "tayammum-steps",
    section: "tayammum",
    title: "Step-by-Step Tayammum",
    summary: "Simple prophetic sequence for valid dry purification.",
    importance: "obligatory",
    body: [
      "Tayammum is brief and should be done with clean earth-like material such as dust, sand, or natural soil.",
      "Its minimum form is lighter than wudu, reflecting mercy in hardship.",
    ],
    steps: [
      {
        title: "Form intention",
        body: "Intend in your heart to lift impurity for worship.",
      },
      {
        title: "Say Bismillah",
        body: "Begin in Allah's name.",
      },
      {
        title: "Strike or touch clean earth once",
        body: "Touch clean dusty surface with both palms lightly.",
      },
      {
        title: "Wipe the face",
        body: "Wipe your full face once with both hands.",
      },
      {
        title: "Wipe the hands",
        body: "Wipe both hands according to your school's method (to wrists by many; to elbows in some discussions).",
        tip: "Follow one madhab's method consistently to avoid confusion.",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 338",
        grade: "sahih",
        excerpt:
          "The Prophet ﷺ showed tayammum by striking the earth and wiping the face and hands.",
      },
    ],
  },
  {
    id: "tayammum-breakers",
    section: "tayammum",
    title: "What Breaks Tayammum?",
    summary: "Nullified by regular wudu breakers and by regained water access.",
    body: [
      "Anything that breaks wudu also breaks tayammum taken in place of wudu.",
      "Tayammum taken in place of ghusl is broken by causes of major impurity and by ability to use water.",
      "When water is found and usable before prayer, perform wudu or ghusl; if found after praying validly with tayammum, prayer does not need repetition according to the majority.",
    ],
    actions: [
      "Reassess water availability before each prayer time.",
      "Once able, return to water purification without delay.",
    ],
    disclaimer:
      "Some details around repeating prayer after regaining water differ by juristic school and timing.",
  },

  // ── Najasah ──────────────────────────────────────────────────────────────
  {
    id: "impurities-najasah",
    section: "najasah",
    title: "Impurities (Najasah)",
    summary: "Physical impurities must be removed from body, clothing, and place.",
    importance: "obligatory",
    body: [
      "Najasah includes substances identified in fiqh, such as urine, feces, flowing blood (with detail), and other designated impurities.",
      "Salah requires removal of najasah from body, garments, and prayer surface within practical ability.",
      "Madhabs differ in classifying some substances and in tolerated trace amounts; the practical principle is to clean thoroughly and avoid doubtful impurity where possible.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 227",
        grade: "sahih",
        excerpt:
          "The Prophet ﷺ instructed cleaning impurity and warned against negligence in protection from urine.",
      },
    ],
  },
  {
    id: "cleaning-clothes",
    section: "najasah",
    title: "Cleaning Clothes from Impurity",
    summary: "How to wash garments so prayer in them is valid.",
    body: [
      "Visible impurity should be removed by washing until its traces are gone as much as possible.",
      "If color or faint smell remains after effort, many scholars excuse what is difficult to remove.",
      "For infant urine and other special cases, juristic details differ; learn your school's practical rulings.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "Hadith 291",
        grade: "sahih",
        excerpt:
          "The Prophet ﷺ instructed washing menstrual blood from clothes before praying in them.",
      },
    ],
    actions: [
      "Keep at least one clean prayer garment ready.",
      "If impurity occurs outside home, rinse what you can and replace when possible.",
    ],
  },
  {
    id: "cleaning-body",
    section: "najasah",
    title: "Cleaning the Body",
    summary: "Remove physical impurity and maintain personal hygiene for worship.",
    body: [
      "Body impurities must be washed away before salah within one's ability.",
      "Istinja (cleaning private parts after relief) is essential before wudu and prayer.",
      "Personal hygiene practices such as trimming nails and maintaining cleanliness support taharah and prophetic etiquette.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 162",
        grade: "sahih",
        excerpt: "The Prophet ﷺ taught thorough cleaning after relieving oneself.",
      },
    ],
    actions: [
      "Always complete istinja before wudu after restroom use.",
      "Carry tissues and water access options while traveling.",
    ],
  },
  {
    id: "cleaning-prayer-places",
    section: "najasah",
    title: "Cleaning Prayer Places",
    summary: "Prayer area should be free from known impurity.",
    body: [
      "A prayer area must be free of known najasah; certainty is required before judging impurity.",
      "If impurity is known, remove it or pray in another clean place.",
      "Islam made the earth generally a place of prayer, so excessive doubt without evidence should be avoided.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 220",
        grade: "sahih",
        excerpt:
          "When a Bedouin urinated in the mosque, the Prophet ﷺ ordered a bucket of water over it.",
      },
    ],
    actions: [
      "Inspect your prayer mat and floor quickly before salah.",
      "If uncertain without evidence, avoid baseless misgivings and continue worship.",
    ],
  },

  // ── Exceptions ───────────────────────────────────────────────────────────
  {
    id: "hayd-purity",
    section: "exceptions",
    title: "Hayd and Purity",
    summary: "Menstruation and postnatal bleeding have specific taharah rulings.",
    importance: "obligatory",
    body: [
      "During menstruation (hayd) and postnatal bleeding (nifas), salah is not performed and does not require make-up afterward.",
      "When bleeding ends and signs of purity appear, ghusl is performed before resuming salah and fasting.",
      "Duration ranges and detailed indicators differ among madhabs; women should learn practical rules with a qualified teacher.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 321",
        grade: "sahih",
        excerpt:
          "Women in menstruation do not pray or fast during that period; fasting is made up later, prayer is not.",
      },
    ],
    appLinks: [{ label: "Hayd module", route: "/hayd" }],
  },
  {
    id: "faq",
    section: "exceptions",
    title: "Frequently Asked Questions",
    summary: "Short answers to common purification concerns and doubts.",
    body: [
      "Doubt after completing wudu does not invalidate it unless certainty of nullification appears.",
      "Medical dressings, casts, or ongoing conditions have concessions in fiqh, including wiping over coverings where applicable.",
      "If you cannot use water safely, tayammum remains valid until ability returns.",
      "For chronic excuses (continuous bleeding, incontinence), scholars provide specific prayer-time purification routines.",
    ],
    actions: [
      "Do not let constant doubt block worship; follow certainty over suspicion.",
      "For chronic conditions, seek a personalized ruling from a qualified scholar.",
    ],
    appLinks: [
      { label: "Salah guide", route: "/salah-guide" },
      { label: "Purification and women", route: "/hayd" },
    ],
    disclaimer:
      "FAQ answers are educational summaries, not personal fatwa. Complex cases should be reviewed with local scholars.",
  },

  // ── Reference ────────────────────────────────────────────────────────────
  {
    id: "references",
    section: "reference",
    title: "References and Further Study",
    summary: "Foundational Qur'an passages and authentic hadith collections on taharah.",
    importance: "foundational",
    body: [
      "Core Qur'anic texts for purification include Surah al-Ma'idah (5:6) and related verses on cleanliness and worship readiness.",
      "Major hadith references include chapters of taharah in Sahih al-Bukhari and Sahih Muslim, then Sunan collections with hadith grading review.",
      "Classical fiqh manuals from the four Sunni madhabs provide detailed rulings; differences are part of valid juristic tradition.",
      "Use this module for structured learning, then deepen through teachers and primary texts.",
    ],
    quran: [
      {
        surah: 5,
        ayahFrom: 6,
        label: "Qur'an 5:6",
      },
      {
        surah: 2,
        ayahFrom: 222,
        label: "Qur'an 2:222",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Book of Wudu",
        grade: "sahih",
        excerpt: "Comprehensive narrations on wudu, ghusl, and purification practice.",
      },
      {
        collection: "Sahih Muslim",
        citation: "Book of Purification",
        grade: "sahih",
        excerpt: "Authentic reports on taharah rulings, etiquette, and legal principles.",
      },
    ],
    actions: [
      "Follow one trusted curriculum to avoid confusion from scattered rulings.",
      "Review purification topics periodically until practical confidence is steady.",
    ],
    appLinks: [
      { label: "Salah learning path", route: "/salah-guide" },
      { label: "Prayer duas", route: "/dua/prayer" },
    ],
  },
];
