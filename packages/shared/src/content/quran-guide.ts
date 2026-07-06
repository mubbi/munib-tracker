import type { QuranGuideTopic } from "../types/quran-guide";

export { QURAN_GUIDE_APPLY_CHALLENGES } from "./quran-guide-apply";
export { QURAN_GUIDE_DAILY_LESSONS } from "./quran-guide-daily";
export { QURAN_GUIDE_READING_LEVELS } from "./quran-guide-learn-to-read";
export { QURAN_GUIDE_LETTERS } from "./quran-guide-letters";
export { QURAN_GUIDE_MEMORIZATION_PLANS } from "./quran-guide-memorization";
export { QURAN_GUIDE_PRONUNCIATION } from "./quran-guide-pronunciation";
export { QURAN_GUIDE_STORIES } from "./quran-guide-stories";
export { QURAN_GUIDE_STRUCTURE_LEVELS } from "./quran-guide-structure";
export { QURAN_GUIDE_TADABBUR_PROMPTS } from "./quran-guide-tadabbur";
export { QURAN_GUIDE_TAJWEED } from "./quran-guide-tajweed";
export { QURAN_GUIDE_THEMES } from "./quran-guide-themes";
export { QURAN_GUIDE_TIMELINE } from "./quran-guide-timeline";
export { QURAN_GUIDE_VOCABULARY } from "./quran-guide-vocabulary";

/**
 * Learn Qur'an — authentic knowledge journey: Read → Understand → Reflect →
 * Memorize → Practice → Live. Scholar-neutral; cites Qur'an, graded hadith,
 * and named tafsir. Bump version on content change.
 */
export const QURAN_GUIDE_CONTENT_VERSION = 1;

export const QURAN_GUIDE_JOURNEY_ORDER = [
  "read",
  "understand",
  "reflect",
  "memorize",
  "practice",
  "live",
  "evidence",
] as const;

export const QURAN_GUIDE_TOPICS: QuranGuideTopic[] = [
  {
    id: "introduction",
    journey: "read",
    title: "Introduction",
    summary: "What is the Qur'an, why it was revealed, and virtues of recitation.",
    importance: "foundational",
    body: [
      "The Qur'an (literally 'recitation') is the speech of Allah revealed to Muhammad ﷺ through the angel Jibreel over approximately 23 years. It is the final scripture, confirming what came before and abrogating previous laws where Allah willed.",
      "It was revealed to guide humanity from darkness to light — calling to tawheed, moral excellence, and preparation for the Hereafter. Every prophet brought the same core message; Muhammad ﷺ brought its completion.",
      "Reciting the Qur'an is an act of worship. Each letter can carry reward — the believer is raised in rank. The Qur'an intercedes for its companion on the Day of Judgment.",
      "The Qur'an is not the same as hadith: the Qur'an is Allah's verbatim speech in Arabic; hadith are the Prophet's ﷺ words, actions, and approvals, preserved through chains of narration and graded by scholars.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 185,
        label: "Qur'an 2:185",
        excerpt: "The month of Ramadan in which the Qur'an was revealed as guidance for mankind…",
      },
      {
        surah: 17,
        ayahFrom: 88,
        label: "Qur'an 17:88",
        excerpt:
          "Say: If mankind and jinn gathered to produce the like of this Qur'an, they could not…",
      },
    ],
    hadith: [
      {
        collection: "Jami' at-Tirmidhi",
        citation: "Hadith 2910",
        grade: "hasan",
        excerpt:
          "Whoever recites a letter from the Book of Allah receives a hasanah, and the hasanah is multiplied by ten.",
      },
      {
        collection: "Sahih Muslim",
        citation: "Hadith 804",
        grade: "sahih",
        excerpt:
          "Read the Qur'an, for it will come as an intercessor for its companions on the Day of Resurrection.",
      },
    ],
    actions: [
      "Set a daily time for Qur'an — even five minutes builds barakah.",
      "Open Munib's Qur'an reader and continue where you left off.",
    ],
    appLinks: [
      { label: "Read Qur'an", route: "/quran" },
      { label: "Daily lesson", route: "/learn-quran/daily" },
    ],
  },
  {
    id: "revelation",
    journey: "read",
    title: "How the Qur'an was revealed",
    summary: "Cave of Hira, Jibreel, Makkan and Madinan periods, compilation, preservation.",
    importance: "foundational",
    body: [
      "Revelation began in Ramadan in Cave Hira when Jibreel brought the first verses of Surah al-Alaq. The Prophet ﷺ was distressed; Khadijah and Waraqah comforted him. Revelation paused briefly, then resumed with Surahs of comfort and warning.",
      "Makkan revelations (roughly 13 years) emphasise tawheed, resurrection, stories of prophets, and moral reform. Verses are often powerful and concise.",
      "After the Hijra (622 CE), the Muslim community in Madinah needed law and social order. Revelations grew longer — salah, zakat, fasting, family, war, and treaties.",
      "The Qur'an was memorised by companions, written on materials during the Prophet's ﷺ life, compiled into a single mushaf under Abu Bakr after Yamama, and standardised under Uthman to preserve one recitation text.",
      "Allah promised preservation: memorisation, writing, and unbroken qira'at chains protect the text. This is both a historical fact and a theological sign.",
    ],
    quran: [
      {
        surah: 15,
        ayahFrom: 9,
        label: "Qur'an 15:9",
        excerpt: "Indeed, We have sent down the Reminder and indeed, We will preserve it.",
      },
      {
        surah: 96,
        ayahFrom: 1,
        ayahTo: 5,
        label: "Qur'an 96:1–5",
        excerpt: "Read in the name of your Lord who created…",
      },
    ],
    appLinks: [
      { label: "Revelation timeline", route: "/learn-quran/revelation" },
      { label: "Seerah", route: "/seerah" },
    ],
  },
  {
    id: "structure",
    journey: "read",
    title: "Structure of the Qur'an",
    summary: "114 surahs, 30 juz, ayahs, Makki/Madani, order vs revelation.",
    importance: "foundational",
    body: [
      "The mus'haf contains 114 surahs arranged largely by length (with exceptions like Al-Baqarah and Al-Fatiha). This order is tawqifi — divinely taught to the Prophet ﷺ — not chronological.",
      "Scholars classify surahs as Makki (before Hijra) or Madani (after), with some containing both. Makki surahs often stress belief; Madani surahs add legislation.",
      "The Qur'an is also divided into 30 juz for monthly reading and 60 hizb for smaller portions. Ayah numbering helps reference — slight scholarly variation exists at surah ends.",
      "Knowing structure helps planning: khatm in Ramadan, hifz of Juz Amma, or thematic study across surahs.",
    ],
    quran: [
      {
        surah: 25,
        ayahFrom: 32,
        label: "Qur'an 25:32",
        excerpt: "…a Book whose verses are detailed, an Arabic Qur'an for a people who know.",
      },
    ],
    appLinks: [
      { label: "Structure visual", route: "/learn-quran/structure" },
      { label: "Browse surahs", route: "/quran" },
    ],
  },
  {
    id: "learn-to-read",
    journey: "practice",
    title: "Learn to read",
    summary: "Seven levels from alphabet to fluent recitation — for absolute beginners.",
    importance: "foundational",
    body: [
      "Most Muslims desire to read the Qur'an in Arabic even if they understand translation. This path moves from letters to fluent recitation with a teacher.",
      "Level 1–2: recognise letters and their shapes in words. Level 3: harakat. Level 4–5: join letters and read words. Level 6–7: verses and fluency with tajweed.",
      "Audio from qualified reciters is essential — mimic rhythm and pronunciation. Letter tracing (on paper or screen) builds muscle memory.",
      "A local teacher or online tajweed programme is strongly recommended; apps supplement but do not replace correction.",
    ],
    actions: [
      "Study the Arabic letters section daily — one letter at a time.",
      "Listen to Al-Fatiha repeated, following in a mushaf.",
    ],
    appLinks: [
      { label: "Reading levels", route: "/learn-quran/learn-to-read" },
      { label: "Arabic letters", route: "/learn-quran/letters" },
    ],
    comingSoon: false,
  },
  {
    id: "tajweed",
    journey: "practice",
    title: "Tajweed",
    summary: "Rules of beautiful and correct recitation — noon sakin, madd, waqf, and more.",
    importance: "highly-recommended",
    body: [
      "Tajweed means to make better — giving each letter its right and due in pronunciation, timing, and stopping.",
      "The Qur'an was revealed with tajweed; Jibreel recited to the Prophet ﷺ who recited to companions. Errors can change meanings — hence the science.",
      "Core topics: noon sakinah/tanween rules, meem sakinah, madd, qalqalah, ghunnah, and waqf. Each has definition, examples, and practice.",
      "V2 adds audio drills and quizzes; always pair with a teacher for ijazah-level accuracy.",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 4990",
        grade: "sahih",
        excerpt: "The Prophet ﷺ taught recitation to companions — recite as you were taught.",
      },
    ],
    appLinks: [{ label: "Tajweed lessons", route: "/learn-quran/tajweed" }],
  },
  {
    id: "arabic-letters",
    journey: "practice",
    title: "Arabic letters",
    summary: "Interactive alphabet — name, sound, examples for each of 28 letters.",
    importance: "foundational",
    body: [
      "Arabic has 28 letters. Qur'anic Arabic adds rules for hamza, madd letters, and sun/moon letters at word boundaries.",
      "Each letter card shows isolated form, name, transliteration, pronunciation tip, and Qur'anic examples.",
      "Practice daily: see, hear, say, write. Connect letters to words you already know (Allah, Rabb, Rahman).",
    ],
    appLinks: [
      { label: "Letter browser", route: "/learn-quran/letters" },
      { label: "Pronunciation guide", route: "/learn-quran/pronunciation" },
    ],
  },
  {
    id: "pronunciation",
    journey: "practice",
    title: "Pronunciation",
    summary: "Master difficult letters — ayn, ha, sad, dad, qaf, and emphatics.",
    importance: "recommended",
    body: [
      "Non-Arabic speakers often confuse similar letters. Emphatics (ṣ, ḍ, ṭ, ẓ) require tongue position Arabs learn from childhood.",
      "Ayn and ha are throat letters with no English equivalent — practise with a native or qualified teacher.",
      "Compare pairs side by side: س/ص, د/ض, ك/ق. Record yourself and compare to a slow murattal reciter.",
    ],
    appLinks: [{ label: "Letter comparisons", route: "/learn-quran/pronunciation" }],
  },
  {
    id: "vocabulary",
    journey: "understand",
    title: "Qur'anic vocabulary",
    summary: "High-frequency words — understand more every time you recite.",
    importance: "highly-recommended",
    body: [
      "Roughly 300 words cover a large percentage of Qur'anic text. Learning them transforms recitation from sound to meaning.",
      "Start with Allah, Rabb, Rahmah, Iman, Sabr, Taqwa, Dunya, Akhirah — then expand.",
      "Use spaced repetition: five new words per week reviewed daily beats cramming.",
    ],
    quran: [
      {
        surah: 54,
        ayahFrom: 17,
        label: "Qur'an 54:17",
        excerpt:
          "And We have certainly made the Qur'an easy for remembrance, so is there any who will remember?",
      },
    ],
    appLinks: [{ label: "Vocabulary list", route: "/learn-quran/vocabulary" }],
  },
  {
    id: "tafsir",
    journey: "understand",
    title: "Tafsir",
    summary: "Understanding revelation — overview, context, and recognised scholarly sources.",
    importance: "foundational",
    body: [
      "Tafsir is explanation of the Qur'an by the Qur'an, by the Sunnah, by companions, and by language — in that hierarchy of authority.",
      "Each surah has historical context (asbab al-nuzul where established), themes, key verses, and practical lessons. Avoid unqualified personal opinion.",
      "Recognised references include Tafsir Ibn Kathir (comprehensive, cites hadith), Tafsir al-Sa'di (clear contemporary Arabic), and al-Tabari (classical). Always note the source.",
      "Munib links to bundled and remote tafsir in the Qur'an reader. Use this hub for methodology; use the reader for verse-by-verse study.",
    ],
    sources: [
      "Tafsir Ibn Kathir — abridged English widely available",
      "Tafsir as-Sa'di — accessible summaries",
      "Asbab al-Nuzul by al-Wahidi — revelation occasions (verify authenticity per incident)",
    ],
    disclaimer:
      "Tafsir varies in depth. When scholars differ, note the difference without claiming certainty where Allah did not make it clear.",
    appLinks: [{ label: "Open Qur'an reader", route: "/quran" }],
  },
  {
    id: "themes",
    journey: "understand",
    title: "Themes of the Qur'an",
    summary: "Faith, prayer, patience, charity, prophets — verses grouped by topic.",
    importance: "recommended",
    body: [
      "The Qur'an is not a linear history book — themes repeat, deepen, and cross-reference. Studying by theme reveals unity.",
      "Each theme entry includes verses, supporting hadith where relevant, lessons, reflection prompts, and action items.",
      "Connect themes to your life: parents, business ethics, marriage, and justice are not abstract chapters but daily choices.",
    ],
    appLinks: [{ label: "Browse themes", route: "/learn-quran/themes" }],
  },
  {
    id: "stories",
    journey: "understand",
    title: "Stories in the Qur'an",
    summary: "Prophets from Adam to Muhammad ﷺ — lessons, locations, related verses.",
    importance: "recommended",
    body: [
      "The Qur'an says of its narratives: 'In their stories is a lesson for those of understanding.' Stories are not entertainment — they are instruction.",
      "Prophets faced rejection, loss, and triumph by Allah's will. Compare your trials to theirs without equating your rank — learn their patience and tawakkul.",
      "Surah Yusuf is called the best of stories — read it as one continuous narrative.",
    ],
    quran: [
      {
        surah: 12,
        ayahFrom: 111,
        label: "Qur'an 12:111",
        excerpt: "In their stories is certainly a lesson for those of understanding…",
      },
    ],
    appLinks: [{ label: "Prophet stories", route: "/learn-quran/stories" }],
  },
  {
    id: "miracles",
    journey: "understand",
    title: "Miracles of the Qur'an",
    summary: "Linguistic inimitability, preservation, prophecies — with scholarly caution.",
    importance: "recommended",
    body: [
      "The Qur'an challenges opponents to produce a surah like it — a challenge unmet for fourteen centuries. Its Arabic rhetoric, structure, and legal coherence are studied in ilm al-balagha.",
      "Preservation is both textual (memorisation and writing) and oral (qira'at through chains). This is established history, not speculation.",
      "Scientific signs (anatomy, cosmology) appear in verses — classical tafsir often read them differently from modern apologists. Distinguish established interpretation from contemporary hypotheses.",
      "Prophecies (e.g. Romans' victory, opening of Makkah) are cited by scholars — study them through tafsir, not viral clips.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 23,
        label: "Qur'an 2:23",
        excerpt: "Then produce a surah like it… if you are truthful.",
      },
    ],
    disclaimer:
      "Avoid overstated scientific miracle claims that embarrass the dawah when scrutinised. Lead with tawheed, morality, and the Qur'an's linguistic and historical proofs.",
  },
  {
    id: "memorization",
    journey: "memorize",
    title: "Memorization (Hifz)",
    summary: "Plans from Juz Amma to full hifz — revision, audio, daily goals.",
    importance: "highly-recommended",
    body: [
      "Hifz is a noble goal — the hafiz carries light and intercession. Start small: Al-Fatiha, then short surahs from the end.",
      "Revision (muraja'ah) is more important than new memorisation. The Prophet ﷺ compared forgetting Qur'an to a escaped camel.",
      "Use spaced repetition, listen to the same reciter, and track mistakes with a teacher. Munib's hifz tracker supports ayah-level progress.",
      "Plans: Beginner (Juz Amma), Intermediate (ten core surahs), Advanced (one juz), Hafiz journey (full Qur'an with sanad).",
    ],
    hadith: [
      {
        collection: "Sahih al-Bukhari",
        citation: "Hadith 5031",
        grade: "sahih",
        excerpt: "It will be said to the companion of the Qur'an: Recite and ascend…",
      },
    ],
    appLinks: [
      { label: "Memorization plans", route: "/learn-quran/memorization" },
      { label: "Hifz tracker", route: "/quran" },
    ],
  },
  {
    id: "daily-lessons",
    journey: "read",
    title: "Daily lessons",
    summary: "One verse, context, reflection, and action — each day.",
    importance: "recommended",
    body: [
      "Small daily doses build lifelong attachment. Each lesson includes Arabic, translation, historical context, a reflection question, and one action for today.",
      "Bookmark verses that strike your heart. Share with family to multiply reward.",
      "Consistency beats intensity — five minutes daily outweighs a rare hour.",
    ],
    appLinks: [{ label: "Today's lesson", route: "/learn-quran/daily" }],
  },
  {
    id: "tadabbur",
    journey: "reflect",
    title: "Reflection (Tadabbur)",
    summary: "Guided questions — what does Allah teach, and how will you live it?",
    importance: "foundational",
    body: [
      "Allah commands: 'Do they not reflect upon the Qur'an, or are there locks upon their hearts?' Tadabbur is not the same as tafsir — it is personal application with reverence.",
      "Ask: What does Allah teach here? How does this change my today? What habit must I improve?",
      "Keep private notes — Munib journal can store reflections. Do not invent meanings; let tafsir bound your understanding.",
    ],
    quran: [
      {
        surah: 47,
        ayahFrom: 24,
        label: "Qur'an 47:24",
        excerpt: "Do they not reflect upon the Qur'an, or are there locks upon their hearts?",
      },
      {
        surah: 4,
        ayahFrom: 82,
        label: "Qur'an 4:82",
        excerpt:
          "Then do they not reflect upon the Qur'an? If it had been from other than Allah, they would have found much contradiction in it.",
      },
    ],
    appLinks: [
      { label: "Tadabbur prompts", route: "/learn-quran/tadabbur" },
      { label: "Journal", route: "/journal" },
    ],
  },
  {
    id: "apply-the-quran",
    journey: "live",
    title: "Apply the Qur'an",
    summary: "Today's challenge from a verse — track completion, live the ayah.",
    importance: "highly-recommended",
    body: [
      "Reading without application was criticised even among Bani Isra'il. The Qur'an is a covenant — each ayah asks something of you.",
      "Each challenge links a verse to one behaviour: kind speech, charity, lowering gaze, forgiving a grudge.",
      "Mark completion honestly — not for show, but to build accountability with Allah.",
    ],
    quran: [
      {
        surah: 2,
        ayahFrom: 44,
        label: "Qur'an 2:44",
        excerpt:
          "Do you order righteousness of others and forget yourselves while you recite the Scripture?",
      },
    ],
    appLinks: [{ label: "Today's challenge", route: "/learn-quran/apply" }],
  },
  {
    id: "quiz",
    journey: "practice",
    title: "Qur'an quiz",
    summary: "MCQs, guess the surah, vocabulary — gamified review (V2).",
    importance: "recommended",
    comingSoon: true,
    body: [
      "Quizzes reinforce memory: surah names, verse completions, prophet stories, tajweed rules, and vocabulary.",
      "Gamification is a tool — not competition for spiritual rank. Use quizzes to find gaps, then study those topics.",
      "Coming in V2: categories, streaks, and integration with your learning progress dashboard.",
    ],
    appLinks: [{ label: "Quiz (preview)", route: "/learn-quran/quiz" }],
  },
  {
    id: "references",
    journey: "evidence",
    title: "References & sources",
    summary: "How we cite Qur'an, hadith, tafsir, and scholarly differences.",
    importance: "foundational",
    body: [
      "Every lesson should display: Qur'an references (surah:ayah), authentic hadith with collection and grade, tafsir source when explaining meaning, and notes when scholars differ.",
      "Established facts (five prayers, Qur'an preservation, major events in seerah) are stated clearly. Interpretive matters (eschatology details, scientific readings) are labelled as such.",
      "Recommended references: Qur'an translations (Pickthall, Sahih International), hadith collections (Bukhari, Muslim), tafsir (Ibn Kathir, Sa'di), and seerah (Ibn Hisham, ar-Raheeq al-Makhtum).",
      "For fiqh of recitation or tajweed ijazah, consult a local scholar — Munib educates but does not issue rulings.",
    ],
    sources: [
      "Qur'an — King Fahd Complex print / authenticated digital mushaf",
      "Hadith — sunnah.com grading cross-reference",
      "Tafsir Ibn Kathir (abridged Darussalam)",
      "Tafsir as-Sa'di (English)",
    ],
    disclaimer:
      "Munib aggregates open educational content. Verify critical matters with qualified scholars in your madhhab and locale.",
  },
];
