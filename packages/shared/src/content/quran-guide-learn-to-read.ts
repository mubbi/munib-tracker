import type { QuranGuideReadingLevel } from "../types/quran-guide";

/** Seven-level path from alphabet to fluent recitation. */
export const QURAN_GUIDE_READING_LEVELS: QuranGuideReadingLevel[] = [
  {
    level: 1,
    title: "Arabic alphabet",
    summary: "Recognise all 28 letters in isolated form.",
    topics: ["Letter names", "Basic shapes", "Right-to-left direction"],
  },
  {
    level: 2,
    title: "Letter shapes",
    summary: "Initial, medial, and final forms — letters change shape in words.",
    topics: ["Connected writing", "Non-connecting letters", "Alif, waw, ya variants"],
  },
  {
    level: 3,
    title: "Harakat (vowels)",
    summary: "Fatha, kasra, damma, sukun, shaddah, and tanween.",
    topics: ["Short vowels", "Sukun", "Shaddah doubling", "Tanween"],
  },
  {
    level: 4,
    title: "Joining letters",
    summary: "Read syllables and short words with correct vowelling.",
    topics: ["CV patterns", "Common prefixes", "Sun and moon letters"],
  },
  {
    level: 5,
    title: "Reading words",
    summary: "Decode vocabulary from the Qur'an with slow recitation.",
    topics: ["High-frequency words", "Bismillah", "Al-Fatiha words"],
  },
  {
    level: 6,
    title: "Reading verses",
    summary: "Short ayahs with tajweed awareness and breathing points.",
    topics: ["Juz Amma surahs", "Waqf marks", "Following a reciter"],
  },
  {
    level: 7,
    title: "Reading fluently",
    summary: "Smooth recitation with a teacher or qualified app recording.",
    topics: ["Daily portion", "Tajweed rules applied", "Teacher feedback"],
  },
];
