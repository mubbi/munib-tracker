import type { QuranGuideVocabEntry } from "../types/quran-guide";

/**
 * High-frequency Qur'anic vocabulary — foundation for understanding recitation.
 * Bump QURAN_GUIDE_VOCABULARY_VERSION on content change.
 */
export const QURAN_GUIDE_VOCABULARY_VERSION = 2;

export const QURAN_GUIDE_VOCABULARY: QuranGuideVocabEntry[] = [
  {
    id: "allah",
    arabic: "الله",
    transliteration: "Allah",
    meaning: "The one true God — the proper name encompassing all beautiful names.",
    frequency: "2,700+ occurrences",
    example: "Bismillah — In the name of Allah",
    quranRef: {
      surah: 1,
      ayahFrom: 1,
      label: "Qur'an 1:1",
      excerpt: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    },
  },
  {
    id: "rabb",
    arabic: "رَبّ",
    transliteration: "Rabb",
    meaning: "Lord, Master, Sustainer — the one who creates, owns, nurtures, and governs.",
    frequency: "Very frequent",
    example: "Rabbana — Our Lord",
    quranRef: {
      surah: 1,
      ayahFrom: 2,
      label: "Qur'an 1:2",
      excerpt: "All praise is due to Allah, Lord of the worlds.",
    },
  },
  {
    id: "rahma",
    arabic: "رَحْمَة",
    transliteration: "Rahmah",
    meaning: "Mercy, compassion, tenderness from Allah and among creation.",
    frequency: "Common root ر-ح-م",
    example: "Ar-Rahman, Ar-Rahim",
  },
  {
    id: "jannah",
    arabic: "جَنَّة",
    transliteration: "Jannah",
    meaning: "Garden, Paradise — eternal abode of reward.",
    frequency: "Frequent",
    example: "Gardens beneath which rivers flow",
  },
  {
    id: "nar",
    arabic: "نَار",
    transliteration: "Nar",
    meaning: "Fire — refers to Jahannam as warning and consequence.",
    frequency: "Frequent",
    example: "Fear the Fire prepared for disbelievers",
  },
  {
    id: "iman",
    arabic: "إِيمَان",
    transliteration: "Iman",
    meaning: "Faith, belief, trust in Allah and acceptance of His message.",
    frequency: "Very frequent",
    example: "O you who believe (ya ayyuha alladhina amanu)",
  },
  {
    id: "sabr",
    arabic: "صَبْر",
    transliteration: "Sabr",
    meaning: "Patience, steadfastness, endurance for Allah's sake.",
    frequency: "Frequent",
    example: "Indeed Allah is with the patient",
  },
  {
    id: "shukr",
    arabic: "شُكْر",
    transliteration: "Shukr",
    meaning: "Gratitude — acknowledging blessings with heart, tongue, and limbs.",
    frequency: "Frequent",
    example: "If you are grateful, I will surely increase you",
  },
  {
    id: "taqwa",
    arabic: "تَقْوَى",
    transliteration: "Taqwa",
    meaning: "God-consciousness, piety, guarding oneself from sin out of fear of Allah.",
    frequency: "Very frequent",
    example: "The most noble of you in the sight of Allah is the most righteous",
  },
  {
    id: "rizq",
    arabic: "رِزْق",
    transliteration: "Rizq",
    meaning: "Provision, sustenance — what Allah decrees for each soul.",
    frequency: "Frequent",
    example: "Allah is the best of providers",
  },
  {
    id: "nur",
    arabic: "نُور",
    transliteration: "Nur",
    meaning: "Light — guidance, revelation, and illumination of the heart.",
    frequency: "Frequent",
    example: "Allah is the Light of the heavens and the earth",
    quranRef: {
      surah: 24,
      ayahFrom: 35,
      label: "Qur'an 24:35",
      excerpt: "Allah is the Light of the heavens and the earth…",
    },
  },
  {
    id: "dunya",
    arabic: "دُنْيَا",
    transliteration: "Dunya",
    meaning:
      "This worldly life — literally 'the lower/nearer' life. In the Qur'an it is temporary and a test, contrasted with the lasting akhirah, and never the believer's true home.",
    frequency: "Frequent",
    example: "The life of this world (al-hayat ad-dunya) is but amusement and diversion",
  },
  {
    id: "akhira",
    arabic: "آخِرَة",
    transliteration: "Akhirah",
    meaning:
      "The Hereafter — the eternal life after death, including resurrection, judgment, Paradise, and Hell. It is the real and lasting life the Qur'an urges believers to work for.",
    frequency: "Frequent",
    example: "And the Hereafter (al-akhirah) is better and more lasting",
  },
  {
    id: "salat",
    arabic: "صَلَاة",
    transliteration: "Salah",
    meaning:
      "The ritual prayer, second pillar of Islam, performed five times daily. The word also carries the sense of connection and supplication to Allah.",
    frequency: "Very frequent",
    example: "Establish prayer (aqim as-salah) for My remembrance",
  },
  {
    id: "kitab",
    arabic: "كِتَاب",
    transliteration: "Kitab",
    meaning:
      "Book or scripture — most often the Qur'an itself ('that is the Book'), but also the earlier revealed scriptures and the record of deeds. Rooted in k-t-b, to write.",
    frequency: "Very frequent",
    example: "This is the Book (dhalika al-kitab) about which there is no doubt",
  },
];
