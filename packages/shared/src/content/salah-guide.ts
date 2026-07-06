import type { PrayerRakatSummary, SalahGuideTopic } from "../types/salah-guide";

export { SALAH_GUIDE_PHRASES } from "./salah-guide-phrases";

/**
 * Learn Salah — educational content from first steps to consistent practice.
 * Scholar-neutral; claims cite Qur'an or authentic hadith. Where schools differ,
 * differences are noted respectfully. Bump the version when content changes.
 */
export const SALAH_GUIDE_CONTENT_VERSION = 2;

/** Ordered journey phases shown on the hub. */
export const SALAH_GUIDE_JOURNEY_ORDER = [
  "why",
  "prepare",
  "learn",
  "practice",
  "perfect",
  "consistency",
] as const;

export const SALAH_GUIDE_TOPICS: SalahGuideTopic[] = [
  // ── Why Pray ──────────────────────────────────────────────────────────────
  {
    id: "introduction",
    journey: "why",
    title: "What is Salah?",
    summary: "The second pillar of Islam — your daily meeting with Allah.",
    importance: "foundational",
    body: [
      "Salah (Islamic prayer) is the ritual worship Allah prescribed for every believer — standing, bowing, and prostrating with specific words at fixed times each day.",
      "It was made obligatory on the Night Journey (Isra and Mi'raj) and is the first deed a person will be asked about on the Day of Judgment.",
      "Through salah you remember Allah, seek His guidance, and renew your covenant with Him five times a day — a rhythm that shapes your entire life.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 3,
        label: "Qur'an 2:3",
        excerpt:
          "Who believe in the unseen, establish prayer, and spend from what We have provided.",
      },
      {
        surah: 29,
        ayahFrom: 45,
        label: "Qur'an 29:45",
        excerpt:
          "Recite what has been revealed to you of the Book and establish prayer. Indeed, prayer prohibits immorality and wrongdoing.",
      },
    ],
    hadith: [
      {
        collection: "al-Tirmidhi",
        citation: "Hadith 413",
        grade: "hasan",
        excerpt:
          "The first thing for which a person will be brought to account on the Day of Resurrection is his prayer.",
      },
    ],
    appLinks: [
      { label: "Journey to Jannah", route: "/jannah/salah" },
      { label: "Prayer tracker", route: "/tracker" },
    ],
  },
  {
    id: "why-salah",
    journey: "why",
    title: "Why Salah?",
    summary: "Spiritual, mental, social, and eternal benefits of the five daily prayers.",
    importance: "foundational",
    body: [
      "Salah is your direct connection with Allah — no intermediary. In prostration you are nearest to Him, and in standing you converse through His own words.",
      "It purifies the heart from heedlessness, disciplines the soul against sin, and brings tranquillity that the Qur'an promises for those who remember Allah.",
      "Praying in congregation builds brotherhood and equality; preserving prayer is among the greatest deeds that lead to forgiveness and Paradise.",
    ],
    quran: [
      {
        surah: 20,
        ayahFrom: 14,
        label: "Qur'an 20:14",
        excerpt: "Establish prayer for My remembrance.",
      },
      {
        surah: 23,
        ayahFrom: 1,
        ayahTo: 2,
        label: "Qur'an 23:1–2",
        excerpt: "Successful indeed are the believers — those who are humble in their prayer.",
      },
    ],
    actions: [
      "Start with one prayer on time today — consistency matters more than perfection at first.",
      "Read the meaning of Al-Fatihah before your next salah to deepen khushu.",
      "Set a reminder so you never miss the adhan window.",
    ],
    appLinks: [{ label: "Prayer reminders", route: "/settings/notifications" }],
  },
  {
    id: "importance",
    journey: "why",
    title: "Importance in Islam",
    summary: "A pillar of Islam — abandoning it deliberately is a grave matter.",
    importance: "obligatory",
    body: [
      "The Prophet ﷺ said Islam is built on five pillars, and salah is the second — after the testimony of faith.",
      "Voluntary prayers (sunnah, nafl) draw you closer to Allah and make up for shortcomings in the obligatory prayers.",
      "Scholars unanimously agree that deliberately abandoning the five daily prayers is a major sin. Some hold it amounts to disbelief; others treat it as the gravest of major sins short of kufr. Either way, preserving prayer is non-negotiable for a believer.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 238,
        label: "Qur'an 2:238",
        excerpt:
          "Guard strictly the prayers, especially the middle prayer, and stand before Allah in devotion.",
      },
      {
        surah: 19,
        ayahFrom: 59,
        label: "Qur'an 19:59",
        excerpt:
          "There came after them a generation who neglected prayer and followed desires — they will meet ruin.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "Hadith 16",
        grade: "sahih",
        excerpt: "The covenant between us and them is prayer; whoever abandons it has disbelieved.",
      },
    ],
    disclaimer:
      "Scholars differ on the exact ruling for one who abandons prayer out of laziness versus denial. Consult a qualified teacher for personal guidance.",
  },
  {
    id: "who-must-pray",
    journey: "why",
    title: "Who must pray?",
    summary: "Every sane, adult Muslim — with recognised exemptions.",
    body: [
      "Salah is obligatory on every Muslim who has reached puberty and is of sound mind.",
      "Children should be encouraged to pray from age seven and disciplined gently from age ten, as the Prophet ﷺ taught — but the full obligation begins at puberty.",
      "Women in menstruation (hayd) or postnatal bleeding (nifas) do not pray or fast until purity returns. The missed prayers are not made up.",
      "Severe illness, unconsciousness, and extreme fear may excuse a person temporarily. Travel brings concessions (qasr and jam') detailed in the travel guide.",
    ],
    hadith: [
      {
        collection: "Abu Dawud",
        citation: "Hadith 495",
        grade: "sahih",
        excerpt: "Command your children to pray at seven and discipline them for it at ten.",
      },
    ],
    appLinks: [
      { label: "Hayd guide", route: "/hayd" },
      { label: "Travel prayer", route: "/travel" },
    ],
  },

  // ── Prepare ─────────────────────────────────────────────────────────────────
  {
    id: "conditions",
    journey: "prepare",
    title: "Conditions before salah",
    summary: "Nine prerequisites — each one opens a deeper lesson.",
    importance: "obligatory",
    body: [
      "Before salah is valid, certain conditions (shurut) must be in place. Think of them as a checklist — if any is missing, the prayer is not accepted.",
      "Most conditions link to other lessons in this guide. Tap through each topic below to learn the details.",
    ],
    steps: [
      { title: "Islam", body: "Salah is only obligatory upon a Muslim." },
      {
        title: "Sanity",
        body: "A person must be of sound mind. The insane are not held accountable.",
      },
      {
        title: "Intention (niyyah)",
        body: "Intend in your heart which prayer you are performing. It need not be spoken aloud.",
      },
      {
        title: "Purification (taharah)",
        body: "Valid wudu, ghusl, or tayammum — see the Taharah and Wudu lessons.",
      },
      {
        title: "Clean clothes",
        body: "Clothing must be free of najasah (ritual impurity).",
      },
      {
        title: "Clean body",
        body: "No ritual impurity on the skin.",
      },
      {
        title: "Clean place",
        body: "Pray on ground free of najasah.",
      },
      {
        title: "Facing the qiblah",
        body: "Turn toward the Ka'bah. Use the app's qibla compass when unsure.",
      },
      {
        title: "Correct prayer time",
        body: "Each salah has a defined window. Use your prayer schedule and reminders.",
      },
    ],
    appLinks: [
      { label: "Qibla compass", route: "/qibla" },
      { label: "Prayer schedule", route: "/schedule" },
    ],
  },
  {
    id: "taharah",
    journey: "prepare",
    title: "Purification (Taharah)",
    summary: "Purity of body, clothing, and place — the foundation of worship.",
    body: [
      "Taharah means removing ritual impurity so you may stand before Allah in a state of cleanliness.",
      "There are two types: minor impurity (hadath) removed by wudu or tayammum, and major impurity (janabah) removed by ghusl.",
      "Physical dirt (najasah) must also be removed from body, clothes, and prayer place — urine, blood (in specified amounts), and other listed substances.",
      "Water is the primary means of purification. If water is unavailable or harmful to use, tayammum with clean earth is permitted.",
    ],
    actions: [
      "Learn wudu step by step before your next prayer.",
      "Keep a spare clean garment for salah if you work in an unclean environment.",
      "Check your prayer spot for impurities before placing a prayer mat.",
    ],
    appLinks: [{ label: "Wudu lesson", route: "/salah-guide/wudu" }],
  },
  {
    id: "wudu",
    journey: "prepare",
    title: "Wudu — ablution",
    summary: "The ordered steps of ablution before every prayer.",
    importance: "obligatory",
    body: [
      "Wudu is the ritual washing that removes minor impurity. It is required before touching the Qur'an (by most scholars) and before every salah unless you remain in wudu from the previous prayer.",
      "The Prophet ﷺ performed wudu in a fixed order and taught his ummah to be thorough without wasting water.",
      "If you break wudu during salah — by passing wind, using the toilet, deep sleep, or other nullifiers — you must renew wudu and repeat the prayer.",
    ],
    steps: [
      {
        title: "Intention & Bismillah",
        body: "Intend wudu in your heart and say 'Bismillah' before washing.",
        transliteration: "Bismillah",
        tip: "Intention is in the heart — you do not need to say it aloud.",
      },
      {
        title: "Wash the hands",
        body: "Wash both hands up to the wrists three times, including between the fingers.",
      },
      {
        title: "Rinse the mouth",
        body: "Take water into the mouth, swish, and spit out — three times.",
        tip: "Use siwak (miswak) before wudu when possible — a sunnah the Prophet ﷺ loved.",
      },
      {
        title: "Rinse the nose",
        body: "Sniff water into the nostrils and blow it out — three times.",
      },
      {
        title: "Wash the face",
        body: "Wash the entire face from hairline to chin and ear to ear — three times.",
      },
      {
        title: "Wash the arms",
        body: "Wash the right arm then the left, from fingertips to and including the elbow — three times each.",
      },
      {
        title: "Wipe the head",
        body: "Wipe the head once with wet hands (from front to back or back to front). Wipe the ears with the same water.",
      },
      {
        title: "Wash the feet",
        body: "Wash the right foot then the left, up to and including the ankles — three times each, including between the toes.",
      },
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "Hadith 244",
        grade: "sahih",
        excerpt:
          "When the Muslim servant makes wudu and washes his face, his wrong actions leave with the water.",
      },
    ],
    actions: [
      "Practice wudu slowly once while reading each step aloud.",
      "Memorise the dua after wudu — see Words of Salah.",
    ],
    appLinks: [
      { label: "Wudu duas", route: "/dua/prayer" },
      { label: "Words of salah", route: "/salah-guide/phrases" },
    ],
  },
  {
    id: "clothing",
    journey: "prepare",
    title: "Clothing & awrah",
    summary: "Cover what must be covered — cleanly and modestly.",
    body: [
      "Your awrah (parts that must be covered in salah) differs by gender. Clothing must be opaque, clean of najasah, and not excessively tight or decorative in ways that distract from worship.",
      "For men, the awrah is from the navel to the knee. Shoulders should be covered in congregation per the sunnah of covering the shoulders.",
      "For women, the entire body is awrah except the face and hands according to the majority of scholars. Some scholars include the feet; others exclude them.",
      "Silk and gold are prohibited for men in ordinary dress; women have no such restriction. Pray in clothing you would wear in public — not pyjamas or swimwear.",
    ],
    actions: [
      "Set aside a clean, modest outfit or prayer garment.",
      "If unsure about a garment, cover more rather than less.",
    ],
  },
  {
    id: "prayer-times",
    journey: "prepare",
    title: "Prayer times",
    summary: "Five daily windows — each salah has a beginning and an end.",
    importance: "obligatory",
    body: [
      "Allah divided the day and night into five prayer windows. Each begins at a defined event (dawn, noon, afternoon, sunset, night) and ends at the next prayer's time (with specific rules for each).",
      "Fajr begins at true dawn and ends at sunrise. Dhuhr begins after the sun passes its zenith. Asr begins when the shadow of an object equals its length (with scholarly variation). Maghrib begins at sunset. Isha begins when twilight fades.",
      "It is forbidden to pray during three periods: after Fajr until sunrise, at zenith just before Dhuhr, and after Asr until Maghrib — except making up missed prayers.",
    ],
    steps: [
      { title: "Fajr", body: "Two rak'ahs — dawn until sunrise." },
      { title: "Dhuhr", body: "Four rak'ahs — midday until Asr enters." },
      { title: "Asr", body: "Four rak'ahs — afternoon until the sun yellows (majority view)." },
      { title: "Maghrib", body: "Three rak'ahs — sunset until Isha enters." },
      { title: "Isha", body: "Four rak'ahs — night until Fajr." },
    ],
    appLinks: [
      { label: "Prayer schedule", route: "/schedule" },
      { label: "Reminder settings", route: "/settings/notifications" },
    ],
  },
  {
    id: "qiblah",
    journey: "prepare",
    title: "Facing the qiblah",
    summary: "Turn toward the Sacred House in Makkah.",
    body: [
      "The qiblah is the direction of the Ka'bah in Masjid al-Haram. Every salah must be performed facing it as closely as possible.",
      "Use a qiblah compass, mosque app, or the sun's position when travelling. A small deviation is forgiven; do your reasonable best.",
      "If you are on a plane or train and cannot determine direction, pray facing wherever you face — the obligation is lifted in genuine inability.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 144,
        label: "Qur'an 2:144",
        excerpt:
          "Turn your face toward al-Masjid al-Haram. Wherever you are, turn your faces toward it.",
      },
    ],
    appLinks: [{ label: "Qibla compass", route: "/qibla" }],
  },

  // ── Learn ─────────────────────────────────────────────────────────────────
  {
    id: "adhan",
    journey: "learn",
    title: "Adhan — the call to prayer",
    summary: "Words of the call, their meaning, and how to respond.",
    body: [
      "The adhan calls Muslims to salah. Repeat what the mu'adhdhin says except at 'hayya 'ala as-salah' and 'hayya 'ala al-falah' — respond with 'La hawla wa la quwwata illa billah'.",
      "After the adhan, send salawat on the Prophet ﷺ and recite the established supplication. The adhan is a sunnah for the five daily prayers, not Eid or Janazah.",
    ],
    steps: [
      {
        title: "Allahu Akbar (×4)",
        body: "Allah is the Greatest.",
        arabic: "اللَّهُ أَكْبَرُ",
        transliteration: "Allahu Akbar",
      },
      {
        title: "Ashhadu an la ilaha illallah (×2)",
        body: "I bear witness that there is no god except Allah.",
        arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ",
        transliteration: "Ashhadu an la ilaha illallah",
      },
      {
        title: "Ashhadu anna Muhammadan rasulullah (×2)",
        body: "I bear witness that Muhammad is the Messenger of Allah.",
        arabic: "أَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ",
        transliteration: "Ashhadu anna Muhammadan rasulullah",
      },
      {
        title: "Hayya 'ala as-salah (×2)",
        body: "Come to prayer. Respond: La hawla wa la quwwata illa billah.",
        arabic: "حَيَّ عَلَى الصَّلَاةِ",
        transliteration: "Hayya 'ala as-salah",
      },
      {
        title: "Hayya 'ala al-falah (×2)",
        body: "Come to success. Respond: La hawla wa la quwwata illa billah.",
        arabic: "حَيَّ عَلَى الْفَلَاحِ",
        transliteration: "Hayya 'ala al-falah",
      },
      {
        title: "Allahu Akbar (×2)",
        body: "Allah is the Greatest.",
        arabic: "اللَّهُ أَكْبَرُ",
        transliteration: "Allahu Akbar",
      },
      {
        title: "La ilaha illallah",
        body: "There is no god except Allah.",
        arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",
        transliteration: "La ilaha illallah",
      },
    ],
    appLinks: [
      { label: "Listen to adhan", route: "/salah-guide/adhan" },
      { label: "Adhan duas", route: "/dua/prayer" },
    ],
  },
  {
    id: "how-to-pray",
    journey: "learn",
    title: "Step-by-step salah",
    summary: "The sequence of one rak'ah — the centerpiece of this guide.",
    importance: "obligatory",
    body: [
      "Every salah follows the same core movements: standing, bowing, prostrating, and sitting — with specific recitations at each stage.",
      "A two-rak'ah prayer (like Fajr) ends with tashahhud and salam after the second rak'ah. A four-rak'ah prayer sits for tashahhud after the second rak'ah, stands for the third and fourth, then sits for the final tashahhud.",
      "Go slowly. Tranquillity (tuma'ninah) in each position is a pillar according to the majority — rushing invalidates the prayer for many scholars.",
    ],
    steps: [
      {
        title: "Stand & intention",
        body: "Face the qiblah, stand upright, and intend the specific prayer in your heart.",
        tip: "Look at the place of sujud — do not look around.",
      },
      {
        title: "Takbirat al-Ihram",
        body: "Raise your hands (to shoulders or earlobes) and say 'Allahu Akbar', then place the right hand over the left on the chest.",
        arabic: "اللَّهُ أَكْبَرُ",
        transliteration: "Allahu Akbar",
      },
      {
        title: "Opening supplication & Al-Fatihah",
        body: "Optionally say the opening dua, then recite Al-Fatihah. In the first two rak'ahs add a short surah or verses after it.",
        tip: "Al-Fatihah is a pillar — without it the rak'ah is invalid.",
      },
      {
        title: "Ruku",
        body: "Say 'Allahu Akbar', bow with a straight back, hands on knees, and say 'Subhana Rabbiyal-'Adheem' three or more times.",
        arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
        transliteration: "Subhana Rabbiyal-'Adheem",
      },
      {
        title: "Rise from ruku",
        body: "Rise saying 'Sami'Allahu liman hamidah', then 'Rabbana wa lakal-hamd' while standing upright.",
        transliteration: "Sami'Allahu liman hamidah, Rabbana wa lakal-hamd",
      },
      {
        title: "Sujud",
        body: "Say 'Allahu Akbar' and prostrate on seven points: forehead (with nose), palms, knees, and toes. Say 'Subhana Rabbiyal-A'la' three or more times.",
        arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَىٰ",
        transliteration: "Subhana Rabbiyal-A'la",
        tip: "Keep elbows away from the sides and abdomen away from the thighs.",
      },
      {
        title: "Sit between two sujud",
        body: "Rise saying 'Allahu Akbar', sit briefly (iftirash), then prostrate again with the same dhikr.",
      },
      {
        title: "Stand for next rak'ah",
        body: "Say 'Allahu Akbar' and rise for the second rak'ah. Repeat the standing recitations.",
      },
      {
        title: "Tashahhud",
        body: "After the last rak'ah of a sitting, recite At-Tahiyyat, then the salawat on the Prophet ﷺ.",
        tip: "Point the index finger during tashahhud — a confirmed sunnah.",
      },
      {
        title: "Salam",
        body: "Turn right saying 'As-salamu 'alaykum wa rahmatullah', then left with the same words.",
        arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ",
        transliteration: "As-salamu 'alaykum wa rahmatullah",
      },
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 631",
        grade: "sahih",
        excerpt: "Pray as you have seen me praying.",
      },
    ],
    appLinks: [
      { label: "Words & meanings", route: "/salah-guide/phrases" },
      { label: "Practice tracker", route: "/tracker" },
    ],
  },
  {
    id: "positions",
    journey: "learn",
    title: "Every position",
    summary: "How to stand, bow, prostrate, and sit correctly.",
    body: [
      "Each posture in salah has a form the Prophet ﷺ demonstrated. Learning them protects your prayer from common errors.",
    ],
    steps: [
      {
        title: "Standing (qiyam)",
        body: "Feet shoulder-width apart, looking at the sujud spot, hands over chest (right over left).",
      },
      {
        title: "Takbir",
        body: "Raise hands with palms facing qiblah — level with shoulders or earlobes.",
      },
      {
        title: "Ruku",
        body: "Back parallel to the ground, fingers spread on knees, head in line with the back.",
      },
      {
        title: "Sujud",
        body: "Forehead and nose on the ground, toes pointing to qiblah, arms away from the body.",
      },
      {
        title: "Sitting (iftirash / tawarruk)",
        body: "Between sujud: sit on the left foot, right foot upright. Final sitting in a two-rak'ah prayer uses tawarruk (left foot under right leg) where comfortable.",
      },
      {
        title: "Taslim",
        body: "Turn the head to the right, then the left, with the salam.",
      },
    ],
  },

  // ── Practice ────────────────────────────────────────────────────────────────
  {
    id: "common-mistakes",
    journey: "practice",
    title: "Common mistakes",
    summary: "Errors beginners make — and how to fix them.",
    body: [
      "Many new Muslims rush through salah, skip tranquillity, or perform wudu incompletely. Recognising these habits is the first step to correcting them.",
    ],
    steps: [
      {
        title: "Incomplete wudu",
        body: "Missing fingers, toes, or wiping the full head. Go slowly and follow each step.",
      },
      {
        title: "Praying too fast",
        body: "Barely pausing in ruku or sujud. Stay until your body settles — at least one 'Subhan Allah'.",
      },
      {
        title: "Improper ruku or sujud",
        body: "Curved back in ruku; praying on raised toes or with elbows flat on the ground.",
      },
      {
        title: "Looking around",
        body: "Eyes should stay on the sujud place. Phone notifications destroy khushu.",
      },
      {
        title: "Talking or laughing",
        body: "Salah is a conversation with Allah only. Speaking intentionally breaks the prayer.",
      },
      {
        title: "Eating or drinking",
        body: "Even a small bite nullifies salah if done knowingly.",
      },
    ],
    actions: [
      "Pray one salah today at half your usual speed and notice the difference.",
      "Put your phone on silent or in another room before takbir.",
    ],
  },
  {
    id: "sunnah-practices",
    journey: "practice",
    title: "Sunnah practices",
    summary: "Recommended acts that beautify your salah.",
    body: [
      "Beyond the obligatory, the Prophet ﷺ modelled many acts that draw you closer to Allah and perfect your prayer.",
    ],
    actions: [
      "Use siwak before wudu or salah.",
      "Walk to the mosque calmly — each step erases a sin and raises a rank.",
      "Pray the sunnah rawatib (regular sunnah prayers) before and after fard where possible.",
      "Recite the established adhkar after salah — see After Salah.",
      "Enter the mosque with the right foot and leave with the left, with their duas.",
    ],
    appLinks: [
      { label: "Sunnah adhkar", route: "/zikr" },
      { label: "Mosque duas", route: "/dua/prayer" },
    ],
  },

  // ── Perfect ─────────────────────────────────────────────────────────────────
  {
    id: "khushu",
    journey: "perfect",
    title: "Khushu — presence of heart",
    summary: "The flagship goal: praying as though you see Allah.",
    importance: "highly-recommended",
    body: [
      "Khushu is humility, focus, and awareness that you stand before Allah. It is what transforms mechanical movements into true worship.",
      "The hypocrites were rebuked for praying without khushu — rushing through salah while their hearts were elsewhere.",
      "Build khushu by learning meanings, removing distractions, slowing down, and reflecting on the greatness of the One you address.",
    ],
    quran: [
      {
        surah: 23,
        ayahFrom: 2,
        label: "Qur'an 23:2",
        excerpt: "Successful indeed are the believers — those who are humble in their prayer.",
      },
      {
        surah: 107,
        ayahFrom: 4,
        label: "Qur'an 107:4",
        excerpt: "So woe to those who pray but are heedless of their prayer.",
      },
    ],
    actions: [
      "Read one phrase meaning from Words of Salah before each prayer this week.",
      "Rate your khushu in the journal after salah — notice patterns.",
      "Pause three seconds in each position before moving.",
    ],
    appLinks: [{ label: "Khushu journal", route: "/journal" }],
  },
  {
    id: "pillars-nullifiers",
    journey: "perfect",
    title: "Pillars & nullifiers",
    summary: "What salah cannot do without — and what breaks it.",
    importance: "obligatory",
    body: [
      "Arkan (pillars) are essential parts — if one is omitted deliberately, the salah is invalid. Wajibat (obligatory acts) must be made up with sujud al-sahw if forgotten, according to many scholars.",
      "Nullifiers break wudu or the prayer itself. Knowing them protects you from praying in an invalid state.",
    ],
    steps: [
      {
        title: "Pillars (arkan)",
        body: "Standing (if able), opening takbir, reciting Al-Fatihah, ruku, rising, sujud, final sitting, salam, tranquillity, and proper order.",
      },
      {
        title: "Common nullifiers of wudu",
        body: "Anything exiting from the front or back passages, deep sleep, loss of consciousness, touching private parts directly (scholarly difference).",
      },
      {
        title: "Nullifiers of salah",
        body: "Intentional speech, intentional eating or drinking, excessive movement, breaking wudu, turning away from qiblah deliberately, uncovering awrah.",
      },
    ],
    disclaimer:
      "The four Sunni schools differ on some details (e.g. whether saying 'ameen' aloud is sunnah or wajib). Learn your school's view from a qualified teacher.",
  },

  // ── Consistency ─────────────────────────────────────────────────────────────
  {
    id: "prayer-types",
    journey: "consistency",
    title: "Types of salah",
    summary: "Fard, sunnah, witr, Eid, and voluntary prayers.",
    body: [
      "Beyond the five daily fard prayers, Islam offers many voluntary prayers that draw you nearer to Allah.",
    ],
    steps: [
      { title: "Five daily fard", body: "The obligatory foundation — never abandon them." },
      { title: "Sunnah rawatib", body: "Regular sunnah before/after fard — strongly emphasised." },
      {
        title: "Witr",
        body: "Odd-numbered prayer after Isha — sunnah mu'akkadah (wajib in Hanafi fiqh).",
      },
      {
        title: "Tahajjud",
        body: "Night prayer in the last third of the night — among the best voluntary prayers.",
      },
      { title: "Duha", body: "Mid-morning prayer — charity for every joint." },
      { title: "Tarawih", body: "Congregational night prayer in Ramadan." },
      { title: "Eid", body: "Two rak'ahs on Eid al-Fitr and Eid al-Adha." },
      { title: "Istikhara", body: "Prayer of consultation when making a decision." },
    ],
    appLinks: [{ label: "Rakats table", route: "/salah-guide" }],
  },
  {
    id: "congregational",
    journey: "consistency",
    title: "Congregational prayer",
    summary: "Praying behind an imam — rewards multiplied.",
    body: [
      "Praying in congregation is emphatically encouraged for men. The reward of praying in the mosque is multiplied many times over praying alone.",
      "Stand in straight rows, shoulder to shoulder, following the imam without preceding him in any action.",
      "If you arrive late (masbuq), join immediately, complete your rak'ahs after the imam gives salam, and make up what you missed.",
      "Women may pray in congregation at home or in the mosque; the majority permit mosque attendance when proper facilities exist.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 645",
        grade: "sahih",
        excerpt: "The prayer of a person in congregation is multiplied over his prayer alone.",
      },
    ],
  },
  {
    id: "qada",
    journey: "consistency",
    title: "Missed (qada) salah",
    summary: "Make up what you missed — Allah's door of mercy stays open.",
    importance: "obligatory",
    body: [
      "If you miss a fard prayer — by oversleeping, forgetfulness, or negligence — you must make it up (qada) as soon as you remember.",
      "Missed prayers are offered in the same form as the original: a missed four-rak'ah Dhuhr is prayed as four rak'ahs, even during travel.",
      "Plan consistently: use a qaza tracker, set a daily target, and seek Allah's forgiveness for delays.",
    ],
    hadith: [
      {
        collection: "Sahih Muslim",
        citation: "Hadith 1563",
        grade: "sahih",
        excerpt:
          "Whoever forgets a prayer or sleeps through it — let him pray it when he remembers.",
      },
    ],
    actions: [
      "Count how many prayers you owe and set a realistic daily make-up target.",
      "Never let qaza pile up — the burden grows heavier with time.",
    ],
    appLinks: [
      { label: "Qaza tracker", route: "/qaza" },
      { label: "Qaza history", route: "/qaza/history" },
    ],
  },
  {
    id: "after-salah",
    journey: "consistency",
    title: "After salah",
    summary: "Adhkar, tasbih, and supplications that follow prayer.",
    body: [
      "The Prophet ﷺ did not leave salah abruptly — he followed it with remembrance and dua. These moments are among the most accepted for supplication.",
      "Recite Ayat al-Kursi, the three Quls, and the morning/evening adhkar where applicable. Say 'Astaghfirullah' three times and the established post-salah tasbih.",
    ],
    actions: [
      "Memorise one post-salah dhikr this week.",
      "Stay seated for a minute of dua before standing up.",
    ],
    appLinks: [
      { label: "Post-salah adhkar", route: "/zikr" },
      { label: "Prayer duas", route: "/dua/prayer" },
    ],
  },
];

/** Fard + common sunnah rakats per prayer, aligned with the app's tracked prayers. */
export const PRAYER_RAKATS: PrayerRakatSummary[] = [
  { prayerId: "fajr", fard: 2, sunnahBefore: 2, sunnahAfter: 0 },
  { prayerId: "dhuhr", fard: 4, sunnahBefore: 4, sunnahAfter: 2 },
  { prayerId: "asr", fard: 4, sunnahBefore: 0, sunnahAfter: 0 },
  { prayerId: "maghrib", fard: 3, sunnahBefore: 0, sunnahAfter: 2 },
  { prayerId: "isha", fard: 4, sunnahBefore: 0, sunnahAfter: 2 },
  {
    prayerId: "witr",
    fard: 0,
    sunnahBefore: 0,
    sunnahAfter: 0,
    note: "Prayed after Isha — sunnah mu'akkadah (wajib in the Hanafi school).",
  },
];
