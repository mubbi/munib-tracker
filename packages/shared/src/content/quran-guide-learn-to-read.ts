import type { QuranGuideReadingLevel } from "../types/quran-guide";

/**
 * Seven-level path from alphabet to fluent recitation. Bump
 * QURAN_GUIDE_READING_LEVELS_VERSION on content change.
 */
export const QURAN_GUIDE_READING_LEVELS_VERSION = 3;

export const QURAN_GUIDE_READING_LEVELS: QuranGuideReadingLevel[] = [
  {
    level: 1,
    title: "Arabic alphabet",
    summary:
      "Learn to recognise all 28 letters in their isolated form and know each by name. This is pure familiarity — seeing a letter and instantly naming its sound — and it is the foundation everything else builds on.",
    topics: ["Letter names", "Basic shapes", "Right-to-left direction"],
  },
  {
    level: 2,
    title: "Letter shapes",
    summary:
      "Discover that most letters change shape depending on their position — beginning, middle, or end of a word — because Arabic is joined like cursive. Learn which few letters never connect to the one after them.",
    topics: ["Connected writing", "Non-connecting letters", "Alif, waw, ya variants"],
  },
  {
    level: 3,
    title: "Harakat (vowels)",
    summary:
      "Master the small marks that give each letter its vowel: fatha (a), kasra (i), damma (u), the vowel-less sukun, the doubling shaddah, and the tanween endings. These marks are what turn silent letters into readable words.",
    topics: ["Short vowels", "Sukun", "Shaddah doubling", "Tanween"],
  },
  {
    level: 4,
    title: "Joining letters",
    summary:
      "Put it together: blend letters and their harakat into syllables and short words, reading right to left. Meet the sun and moon letter rule that decides how the 'al-' at the start of a word is pronounced.",
    topics: ["CV patterns", "Common prefixes", "Sun and moon letters"],
  },
  {
    level: 5,
    title: "Reading words",
    summary:
      "Begin decoding real Qur'anic vocabulary slowly and correctly — starting with Bismillah and the words of al-Fatiha you recite in every prayer — so that reading connects to worship from the very start.",
    topics: ["High-frequency words", "Bismillah", "Al-Fatiha words"],
    practiceAudio: { surah: 1, ayah: 1 },
  },
  {
    level: 6,
    title: "Reading verses",
    summary:
      "Move up to short complete ayahs from Juz Amma, adding awareness of basic tajweed and where to pause for breath (waqf), always reading alongside a reciter so your ear guides your tongue.",
    topics: ["Juz Amma surahs", "Waqf marks", "Following a reciter"],
    practiceAudio: { surah: 114, ayah: 1 },
  },
  {
    level: 7,
    title: "Reading fluently",
    summary:
      "Reach smooth, confident recitation with the tajweed rules applied naturally. Sustain a daily portion and keep a teacher or qualified reciter checking you, since fluency is polished through ongoing correction, not achieved once and left.",
    topics: ["Daily portion", "Tajweed rules applied", "Teacher feedback"],
    practiceAudio: { surah: 1, ayah: 1 },
  },
];
