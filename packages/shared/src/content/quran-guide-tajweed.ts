import type { QuranGuideTajweedLesson } from "../types/quran-guide";

/** Core tajweed rules — explanations with examples (V2 adds audio & quizzes). */
export const QURAN_GUIDE_TAJWEED: QuranGuideTajweedLesson[] = [
  {
    id: "noon-sakin",
    title: "Noon Sakinah & Tanween",
    summary: "Rules for ن with sukun and tanween — izhar, idgham, iqlab, ikhfa.",
    explanation: [
      "When noon sakinah or tanween is followed by certain letters, one of four rules applies.",
      "Izhar: clear pronunciation before throat letters (ء ه ع ح غ خ).",
      "Idgham: merging into the next letter (with or without ghunnah).",
      "Iqlab: turning noon into meem before ب.",
      "Ikhfa: hiding with ghunnah before 15 letters.",
    ],
    examples: ["منْ عِلْم", "مِنْ رَبِّهِمْ", "مِنْ بَعْدِ", "أَنْتُمْ"],
    practice: "Recite Surah al-Fatiha slowly, identifying each noon sakinah rule.",
  },
  {
    id: "meem-sakin",
    title: "Meem Sakinah",
    summary: "Ikhfaa shafawi, idgham shafawi, and izhar shafawi for م with sukun.",
    explanation: [
      "Meem sakinah has three rules depending on the following letter.",
      "Idgham shafawi: meem + meem — merge with ghunnah.",
      "Ikhfa shafawi: meem + ب — hide with ghunnah.",
      "Izhar shafawi: all other letters — clear meem.",
    ],
    examples: ["لَهُمْ مَّا", "تَرْمِيهِمْ بِحِجَارَةٍ", "أَمْ لَمْ"],
    practice: "Practice on verses with frequent meem sakinah in Juz Amma.",
  },
  {
    id: "madd",
    title: "Madd (Elongation)",
    summary: "Natural, secondary, and necessary prolongation of vowels.",
    explanation: [
      "Madd asli (natural): two counts on alif, waw, or ya after the appropriate vowel.",
      "Madd far'i: caused by hamza or sukun — longer durations per riwayah.",
      "Stopping can change madd length — learn with a teacher for your recitation school.",
    ],
    examples: ["قَالَ", "السَّمَاء", "الْحُكْمُ"],
    practice: "Count 2-4-6 with a metronome for natural madd letters.",
  },
  {
    id: "ghunnah",
    title: "Ghunnah",
    summary: "Nasal sound accompanying noon and meem in idgham and ikhfa.",
    explanation: [
      "Ghunnah is a nasal resonance from the nose, lasting about two counts in standard recitation.",
      "Required in idgham with ghunnah, ikhfa, and iqlab.",
      "Not the same as singing — it is a controlled tajweed sound.",
    ],
    examples: ["مِنْ نُّور", "أَنْبِئْهُمْ"],
    practice: "Hold ghunnah evenly — record yourself and compare to a qualified reciter.",
  },
  {
    id: "qalqalah",
    title: "Qalqalah",
    summary: "Echoing bounce on ق ط ب ج د when sakin or when stopping on them.",
    explanation: [
      "Qalqalah occurs on five letters — remembered as قُطْبُ جَدٍ.",
      "Slight vibration without adding a full vowel when stopping.",
      "Stronger in the middle of a word when sakin (sughra), clearer when stopping (kubra).",
    ],
    examples: ["يَجْعَلُونَ", "الْحَقُّ", "أَحَدْ"],
    practice: "Stop on each qalqalah letter in 'Qul huwa Allahu ahad' and feel the bounce.",
  },
  {
    id: "waqf",
    title: "Waqf (Stopping)",
    summary: "Where to stop, breathe, and how stopping changes pronunciation.",
    explanation: [
      "Stopping (waqf) has symbols in the mushaf: م compulsory stop, لا do not stop, etc.",
      "Stopping can create sukun on the last letter — triggering qalqalah or madd.",
      "Never stop in a way that changes meaning — learn mu'anaq stops with a teacher.",
    ],
    examples: ["عِيسَى ابْنُ مَرْيَمَ — stopping points matter"],
    practice: "Use a mushaf with waqf marks; practice one page with a tajweed teacher's recording.",
  },
];
