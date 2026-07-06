import type {
  JahannamDuaEntry,
  JahannamGateEntry,
  JahannamHadithEntry,
  JahannamNameEntry,
  JahannamReferenceEntry,
  JahannamReflectionEntry,
  JahannamVerseEntry,
} from "../types/jahannam";

export const JAHANNAM_NAMES: JahannamNameEntry[] = [
  {
    id: "jahannam",
    name: "Jahannam",
    transliteration: "Jahannam",
    meaning: "The Fire — the most frequent Qur'anic name for Hell.",
    quran: {
      surah: 3,
      ayahFrom: 103,
      label: "Qur'an 3:103",
      excerpt: "Fear the Fire whose fuel is people and stones, prepared for the disbelievers.",
    },
    context:
      "Used throughout the Qur'an as the abode of punishment for those who reject faith and persist in wrongdoing.",
    tafsirNote:
      "Ibn Kathir notes Jahannam is the comprehensive name for the Fire prepared as a warning and consequence.",
    scholarlyNote:
      "Some scholars discuss whether Jahannam is the entire Hell or a specific level — views differ.",
  },
  {
    id: "jaheem",
    name: "Jaheem",
    transliteration: "Jaheem",
    meaning: "Blazing Fire — intense, fierce heat.",
    quran: {
      surah: 21,
      ayahFrom: 98,
      label: "Qur'an 21:98",
      excerpt: "You and what you worship besides Allah are fuel for Hell — you will enter it.",
    },
    context: "Describes the intensity of the Fire awaiting those who took rivals with Allah.",
    tafsirNote: "Al-Tabari relates jaheem to blazing, kindled fire that spares nothing.",
  },
  {
    id: "saqar",
    name: "Saqar",
    transliteration: "Saqar",
    meaning: "That which scorches or leaves nothing — severe heat.",
    quran: {
      surah: 74,
      ayahFrom: 26,
      ayahTo: 27,
      label: "Qur'an 74:26–27",
      excerpt: "I will drive him into Saqar. And what can make you know what Saqar is?",
    },
    context: "Mentioned in Surah al-Muddaththir regarding the one who turned away from revelation.",
    tafsirNote:
      "Classical tafsir describes Saqar as a level of Hell that burns intensely; details vary among scholars.",
    scholarlyNote:
      "Whether Saqar is a distinct level or a name for Hell overall is discussed in tafsir — not explicit in a single agreed text.",
  },
  {
    id: "sair",
    name: "Sa'ir",
    transliteration: "Sa'ir",
    meaning: "Blazing — kindled fire.",
    quran: {
      surah: 4,
      ayahFrom: 10,
      label: "Qur'an 4:10",
      excerpt: "They will be in Sa'ir — the blazing Fire.",
    },
    context: "Warning to those who consume orphan wealth unjustly.",
    tafsirNote: "The root conveys burning and kindling — emphasising active, consuming fire.",
  },
  {
    id: "hutamah",
    name: "Hutamah",
    transliteration: "Hutamah",
    meaning: "The Crusher — that which breaks and crushes.",
    quran: {
      surah: 104,
      ayahFrom: 4,
      ayahTo: 5,
      label: "Qur'an 104:4–5",
      excerpt: "He will be thrown into al-Hutamah. And what can make you know what al-Hutamah is?",
    },
    context:
      "Punishment for the one who backbites and hoards wealth, thinking it will make him immortal.",
    tafsirNote: "Ibn Kathir explains Hutamah crushes and consumes — a fire kindled by Allah.",
  },
  {
    id: "hawiyah",
    name: "Hawiyah",
    transliteration: "Hawiyah",
    meaning: "The abyss or pit — a deep fall.",
    quran: {
      surah: 101,
      ayahFrom: 8,
      ayahTo: 9,
      label: "Qur'an 101:8–9",
      excerpt: "As for one whose scales are light — his refuge will be Hawiyah.",
    },
    context: "The destination of those whose good deeds are too light on the Day of Judgment.",
    tafsirNote:
      "Described as a deep pit in the Fire; al-Tabari records views on its depth and severity.",
    scholarlyNote:
      "Some tafsir works list Hawiyah as a specific level — cite as scholarly interpretation.",
  },
  {
    id: "lazaa",
    name: "Lazaa",
    transliteration: "Lazaa",
    meaning: "Flame — blazing fire.",
    quran: {
      surah: 70,
      ayahFrom: 15,
      label: "Qur'an 70:15",
      excerpt: "By no means! It is the Flame of Allah, kindled.",
    },
    context: "Surah al-Ma'arij — warning those who deny the Hour.",
    tafsirNote:
      "Connected to the flame that strips away and burns — Lazaa emphasises active blazing.",
  },
];

export const JAHANNAM_GATES: JahannamGateEntry[] = [
  {
    id: "gate-1",
    label: "Gate 1",
    quranNote:
      "Allah states Hell has seven gates; each gate has an assigned portion of those who enter (15:44).",
    scholarlyNote:
      "Some later tafsir works associate gates with categories of sinners. These assignments are not uniform in early sources — present as interpretation.",
  },
  {
    id: "gate-2",
    label: "Gate 2",
    quranNote:
      "The Qur'an affirms seven gates collectively; it does not name each gate in explicit revelation.",
    scholarlyNote: "Ibn Kathir discusses that the division is by Allah's wisdom and justice.",
  },
  {
    id: "gate-3",
    label: "Gate 3",
    quranNote:
      "Seven gates — a clear textual fact. Details of each gate's occupants are largely scholarly discussion.",
  },
  {
    id: "gate-4",
    label: "Gate 4",
    quranNote:
      "The verse emphasises proportionate assignment — each gate has its designated share.",
  },
  {
    id: "gate-5",
    label: "Gate 5",
    quranNote:
      "Believers are warned so they may avoid what leads to these gates through repentance.",
  },
  {
    id: "gate-6",
    label: "Gate 6",
    quranNote:
      "Hell is prepared — the warning is real. Protection is through faith and righteous deeds.",
  },
  {
    id: "gate-7",
    label: "Gate 7",
    quranNote:
      "Seven gates, one Fire — unity of warning with diversity in how sinners are grouped by divine wisdom.",
    scholarlyNote:
      "Avoid teaching specific sin-to-gate mappings as prophetic fact unless citing a named scholarly work.",
  },
];

export const JAHANNAM_VERSES: JahannamVerseEntry[] = [
  {
    id: "v-3-131",
    theme: "warnings",
    label: "Qur'an 3:131",
    surah: 3,
    ayahFrom: 131,
    excerpt: "Fear the Fire prepared for the disbelievers.",
    context: "Addressed to believers — fear as motivation toward obedience.",
    tafsirSummary: "Ibn Kathir: a call to taqwa paired with obedience to the Messenger.",
  },
  {
    id: "v-39-53",
    theme: "mercy",
    label: "Qur'an 39:53",
    surah: 39,
    ayahFrom: 53,
    excerpt: "Do not despair of the mercy of Allah. Indeed, Allah forgives all sins.",
    context: "Revealed to comfort those who feared their sins were too great.",
    tafsirSummary: "A cornerstone verse of hope — mercy is vast for those who turn back.",
  },
  {
    id: "v-66-8",
    theme: "repentance",
    label: "Qur'an 66:8",
    surah: 66,
    ayahFrom: 8,
    excerpt:
      "Repent to Allah with sincere repentance — perhaps your Lord will remove your misdeeds.",
    context: "Command to believers after guidance on family and conduct.",
    tafsirSummary: "Nasuh tawbah — sincere repentance without return to the sin.",
  },
  {
    id: "v-6-132",
    theme: "accountability",
    label: "Qur'an 6:132",
    surah: 6,
    ayahFrom: 132,
    excerpt: "For all there will be degrees according to what they did.",
    context: "Divine justice — reward and punishment in proportion to deeds.",
    tafsirSummary: "Degrees apply to both Paradise and Hell.",
  },
  {
    id: "v-4-40",
    theme: "justice",
    label: "Qur'an 4:40",
    surah: 4,
    ayahFrom: 40,
    excerpt: "Allah does not wrong the people at all, but the people wrong themselves.",
    context: "Reassurance that divine judgment is perfectly fair.",
  },
  {
    id: "v-2-201",
    theme: "hope",
    label: "Qur'an 2:201",
    surah: 2,
    ayahFrom: 201,
    excerpt:
      "Our Lord, give us good in both worlds and protect us from the punishment of the Fire.",
    context: "The du'a of those who combine worldly and otherworldly good.",
    tafsirSummary: "A prophetic supplication taught in the Qur'an — balance of dunya and akhirah.",
  },
  {
    id: "v-15-44",
    theme: "warnings",
    label: "Qur'an 15:44",
    surah: 15,
    ayahFrom: 44,
    excerpt: "Hell has seven gates; for every gate is a portion assigned.",
    context: "Addressed in the context of Ibrahim's debate with his people.",
    tafsirSummary: "Explicit mention of seven gates — details of assignment are divine wisdom.",
  },
  {
    id: "v-25-70",
    theme: "repentance",
    label: "Qur'an 25:70",
    surah: 25,
    ayahFrom: 70,
    excerpt:
      "Except those who repent, believe, and do righteous deeds — Allah will replace evil with good.",
    context: "Exception after listing grave sins.",
    tafsirSummary: "Hope for the repentant — deeds can be transformed by mercy.",
  },
  {
    id: "v-67-6",
    theme: "warnings",
    label: "Qur'an 67:6",
    surah: 67,
    ayahFrom: 6,
    excerpt:
      "For those who disbelieved in their Lord is the punishment of Hell — an evil destination.",
    context: "Surah al-Mulk — reminder of the unseen.",
  },
  {
    id: "v-11-114",
    theme: "hope",
    label: "Qur'an 11:114",
    surah: 11,
    ayahFrom: 114,
    excerpt: "Indeed, good deeds remove evil deeds.",
    context: "Command to establish prayer at both ends of the day.",
    tafsirSummary: "Encouragement that consistent worship erases past slips.",
  },
  {
    id: "v-3-16",
    theme: "hope",
    label: "Qur'an 3:16",
    surah: 3,
    ayahFrom: 16,
    excerpt: "Our Lord, forgive us our sins and protect us from the punishment of the Fire.",
    context: "Description of the muttaqin (God-conscious).",
  },
  {
    id: "v-101-8",
    theme: "accountability",
    label: "Qur'an 101:8–9",
    surah: 101,
    ayahFrom: 8,
    ayahTo: 9,
    excerpt: "As for one whose scales are light — his refuge will be Hawiyah.",
    context: "Surah al-Qari'ah — the weighing of deeds.",
  },
];

export const JAHANNAM_HADITH: JahannamHadithEntry[] = [
  {
    id: "h-tirmidhi-2572",
    theme: "protection",
    hadith: {
      collection: "Jami' at-Tirmidhi",
      citation: "2572",
      grade: "sahih",
      excerpt:
        "Whoever asks Allah for Paradise three times, Paradise says: O Allah, admit him into Paradise. Whoever seeks refuge from the Fire three times, the Fire says: O Allah, protect him from the Fire.",
    },
    context: "Encouragement to make regular du'a for Jannah and refuge from Jahannam.",
  },
  {
    id: "h-6309",
    theme: "mercy",
    hadith: {
      collection: "Sahih al-Bukhari",
      citation: "6309",
      grade: "sahih",
      excerpt:
        "Allah is more pleased with the repentance of His servant than one of you who finds his lost mount in a barren land.",
    },
  },
  {
    id: "h-6467",
    theme: "mercy",
    hadith: {
      collection: "Sahih al-Bukhari",
      citation: "6467",
      grade: "sahih",
      excerpt:
        "None of you will enter Paradise by his deeds alone — not even me, unless Allah covers me with His mercy.",
    },
    context: "Balance: strive in deeds but rely on mercy.",
  },
  {
    id: "h-3265",
    theme: "warning",
    hadith: {
      collection: "Sahih al-Bukhari",
      citation: "3265",
      grade: "sahih",
      excerpt:
        "Your fire is one part of seventy parts of the fire of Hell, each part being like its heat.",
    },
  },
  {
    id: "h-tirmidhi-2621",
    theme: "warning",
    hadith: {
      collection: "Jami' at-Tirmidhi",
      citation: "2621",
      grade: "sahih",
      excerpt:
        "The covenant between us and them is prayer; whoever abandons it has committed disbelief.",
    },
    context: "Severity of neglecting salah — among the gravest warnings.",
  },
  {
    id: "h-2581",
    theme: "accountability",
    hadith: {
      collection: "Sahih Muslim",
      citation: "2581",
      grade: "sahih",
      excerpt:
        "The bankrupt one comes with prayer, fasting, and charity — but he insulted, slandered, consumed wealth unlawfully, and shed blood.",
    },
    context: "Rights of people may be settled before deeds on Judgment Day.",
  },
  {
    id: "h-2759",
    theme: "repentance",
    hadith: {
      collection: "Sahih Muslim",
      citation: "2759",
      grade: "sahih",
      excerpt:
        "Allah extends His hand by night to accept the repentance of the sinner of the day, and extends His hand by day to accept the repentance of the sinner of the night.",
    },
  },
  {
    id: "h-6018",
    theme: "warning",
    hadith: {
      collection: "Sahih al-Bukhari",
      citation: "6018",
      grade: "sahih",
      excerpt: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
    },
    context: "Guarding the tongue — daily accountability.",
  },
];

export const JAHANNAM_REFLECTIONS: JahannamReflectionEntry[] = [
  {
    id: "wronged",
    question: "Have I wronged anyone today — in speech, action, or neglect?",
    appLink: { label: "Journal", route: "/journal" },
  },
  {
    id: "istighfar",
    question: "Have I sought forgiveness from Allah today — sincerely and repeatedly?",
    appLink: { label: "Adhkar & istighfar", route: "/zikr" },
  },
  {
    id: "tongue",
    question: "Did I guard my tongue from backbiting, lying, and mockery?",
    appLink: { label: "Sins of the tongue", route: "/jahannam/sins-of-tongue" },
  },
  {
    id: "salah",
    question: "Did I pray on time and with presence?",
    appLink: { label: "Salah tracker", route: "/tracker" },
  },
  {
    id: "reconcile",
    question: "Did I take a step to reconcile with someone I have estranged?",
    appLink: { label: "Sins against others", route: "/jahannam/sins-against-others" },
  },
  {
    id: "charity",
    question: "Did I give charity or kindness today — even something small?",
    appLink: { label: "Journey to Jannah", route: "/jannah/charity" },
  },
  {
    id: "quran",
    question: "Did I read or listen to the Qur'an today?",
    appLink: { label: "Qur'an", route: "/quran" },
  },
];

export const JAHANNAM_REFERENCES: JahannamReferenceEntry[] = [
  {
    id: "quran",
    title: "The Qur'an",
    note: "Primary source for names, warnings, mercy, and repentance. Translations vary; consult Arabic for precision.",
  },
  {
    id: "bukhari-muslim",
    title: "Sahih al-Bukhari & Sahih Muslim",
    note: "Canonical hadith collections cited throughout this module where graded sahih.",
  },
  {
    id: "ibn-kathir",
    title: "Tafsir Ibn Kathir",
    note: "Referenced for context on names of Hell and major warning verses — scholarly interpretation.",
  },
  {
    id: "tabari",
    title: "Tafsir al-Tabari",
    note: "Early comprehensive tafsir — useful for understanding classical views on Jahannam.",
  },
  {
    id: "scholarly-difference",
    title: "Where scholars differ",
    note: "Exact levels of Hell, gate assignments, and some name meanings are discussed among scholars — not always explicit in revelation.",
  },
];

export const JAHANNAM_DUAS: JahannamDuaEntry[] = [
  {
    id: "dua-hasanah",
    context: "Ask for good in both worlds and protection from the Fire — Qur'anic du'a.",
    duaId: "quranic-hasanah",
  },
  {
    id: "dua-nar",
    context: "After tashahhud: ask for Paradise and refuge from the Fire.",
    duaId: "hisn-61",
  },
  {
    id: "dua-grave-fire",
    context: "Morning remembrance: refuge from the punishment of the grave and the Fire.",
    duaId: "hisn-60",
  },
];

/** Featured salah du'a seeking refuge from Jahannam (not in Hisnul bundle as standalone). */
export const JAHANNAM_REFUGE_DUA = {
  arabic:
    "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ",
  transliteration:
    "Allahumma inni a'udhu bika min 'adhabi jahannam, wa min 'adhabil-qabr, wa min fitnatil-mahya wal-mamat, wa min sharri fitnatil-masihid-dajjal",
  translation:
    "O Allah, I seek refuge in You from the punishment of Hell, from the punishment of the grave, from the trials of life and death, and from the evil trial of the False Messiah.",
  reference: "Sahih al-Bukhari 1377; Sahih Muslim 588",
};
