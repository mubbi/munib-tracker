import type { QuranGuideQuizQuestion } from "../types/quran-guide";

/**
 * Learn Qur'an review quiz — surah names, structure, revelation, recitation,
 * tajweed, vocabulary, and prophet stories. Answers stay consistent with the
 * hub's own lessons. Educational review, not a spiritual score. Bump
 * QURAN_GUIDE_QUIZ_VERSION on content change.
 */
export const QURAN_GUIDE_QUIZ_VERSION = 1;

export const QURAN_GUIDE_QUIZ: QuranGuideQuizQuestion[] = [
  {
    id: "surah-count",
    category: "structure",
    type: "multiple-choice",
    prompt: "How many surahs (chapters) are there in the Qur'an?",
    options: ["99", "114", "124", "144"],
    correctIndex: 1,
    explanation:
      "The Qur'an has 114 surahs, ranging from three verses to 286. Their order in the mus'haf was fixed by revelation (tawqifi).",
  },
  {
    id: "juz-count",
    category: "structure",
    type: "multiple-choice",
    prompt: "Into how many equal parts (juz) is the Qur'an divided for daily reading?",
    options: ["7", "12", "30", "60"],
    correctIndex: 2,
    explanation:
      "Thirty juz. Reciting one juz a day completes the whole Qur'an in a month — the classic way to finish a khatm during Ramadan.",
  },
  {
    id: "longest-surah",
    category: "structure",
    type: "multiple-choice",
    prompt: "Which is the longest surah in the Qur'an, with 286 verses?",
    options: ["Al-Fatihah", "Al-Baqarah", "Ya-Sin", "An-Nas"],
    correctIndex: 1,
    explanation:
      "Surah al-Baqarah is the longest, with 286 verses. It is a Madani surah rich in law and guidance.",
  },
  {
    id: "makki-madani",
    category: "structure",
    type: "true-false",
    prompt: "True or false: A Makki surah is one revealed before the Hijra to Madinah.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "Makki surahs were revealed before the Hijra and often focus on belief and tawhid; Madani surahs came after and often add law and community guidance.",
  },
  {
    id: "first-revelation",
    category: "revelation",
    type: "multiple-choice",
    prompt: "Which surah contains the very first verses revealed to the Prophet ﷺ in Cave Hira?",
    options: ["Al-Fatihah", "Al-'Alaq (Iqra)", "Al-Baqarah", "Al-Ikhlas"],
    correctIndex: 1,
    explanation:
      "The first revelation was the opening verses of Surah al-'Alaq (96): 'Iqra' — Read, in the name of your Lord who created.'",
  },
  {
    id: "revelation-years",
    category: "revelation",
    type: "multiple-choice",
    prompt: "Over roughly how many years was the Qur'an revealed?",
    options: ["3 years", "10 years", "23 years", "40 years"],
    correctIndex: 2,
    explanation:
      "The Qur'an was revealed gradually over about 23 years — 13 in Makkah and 10 in Madinah — responding to events and needs.",
  },
  {
    id: "revelation-month",
    category: "revelation",
    type: "true-false",
    prompt:
      "True or false: The Qur'an began to be revealed in the month of Ramadan, on Laylat al-Qadr.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation:
      "Allah says the Qur'an was sent down in Ramadan (2:185) on the Night of Decree (97:1). Seeking that night is a great virtue.",
  },
  {
    id: "fatihah-in-salah",
    category: "recitation",
    type: "multiple-choice",
    prompt: "Which surah is recited in every rakah of the daily salah?",
    options: ["Al-Ikhlas", "Al-Fatihah", "Al-Kawthar", "An-Nasr"],
    correctIndex: 1,
    explanation:
      "Surah al-Fatihah — seven verses — is recited in every unit of prayer. 'There is no prayer for the one who does not recite the Opening of the Book.'",
  },
  {
    id: "no-bismillah",
    category: "recitation",
    type: "multiple-choice",
    prompt: "Which is the one surah that does not begin with 'Bismillah ir-Rahman ir-Raheem'?",
    options: ["Al-Fatihah", "At-Tawbah", "Al-Ikhlas", "An-Nas"],
    correctIndex: 1,
    explanation: "Surah at-Tawbah (9) is the only surah that does not open with the Basmala.",
  },
  {
    id: "tajweed-madd",
    category: "tajweed",
    type: "multiple-choice",
    prompt: "In tajweed, what does the rule of Madd govern?",
    options: [
      "Merging two letters together",
      "Stretching (elongating) a vowel sound",
      "The echoing bounce on certain letters",
      "Where to stop and breathe",
    ],
    correctIndex: 1,
    explanation:
      "Madd means stretching a vowel sound on the madd letters — alif (ا), waw (و), and ya (ي) — for a set number of counts.",
  },
  {
    id: "tajweed-qalqalah",
    category: "tajweed",
    type: "multiple-choice",
    prompt:
      "Qalqalah is the light echoing 'bounce' given to which set of letters when they carry a sukun?",
    options: ["ي ر م ل و ن", "ق ط ب ج د", "ء ه ع ح غ خ", "ا و ي"],
    correctIndex: 1,
    explanation:
      "The five qalqalah letters are collected in the phrase قُطْبُ جَدٍ — ق ط ب ج د — given a clean rebound when they carry a sukun.",
  },
  {
    id: "vocab-rabb",
    category: "vocabulary",
    type: "multiple-choice",
    prompt: "The frequent Qur'anic word 'Rabb' (رَبّ) means:",
    options: ["Mercy", "Lord, Master, Sustainer", "Book", "Garden"],
    correctIndex: 1,
    explanation:
      "'Rabb' means Lord, Master, and Sustainer — the One who creates, owns, nurtures, and governs. 'Rabbana' means 'Our Lord'.",
  },
  {
    id: "vocab-jannah",
    category: "vocabulary",
    type: "multiple-choice",
    prompt: "The word 'Jannah' (جَنَّة) refers to:",
    options: ["The Fire", "The Garden of Paradise", "Prayer", "Fasting"],
    correctIndex: 1,
    explanation:
      "'Jannah' means Garden — the eternal abode of reward, 'gardens beneath which rivers flow'.",
  },
  {
    id: "story-kabah",
    category: "stories",
    type: "multiple-choice",
    prompt:
      "Which prophet raised the foundations of the Ka'bah in Makkah together with his son Isma'il?",
    options: ["Nuh", "Musa", "Ibrahim", "Yusuf"],
    correctIndex: 2,
    explanation:
      "Ibrahim (Khalilullah, the friend of Allah) and Isma'il built the Ka'bah, praying 'Our Lord, accept this from us' (2:127).",
  },
  {
    id: "story-musa",
    category: "stories",
    type: "multiple-choice",
    prompt:
      "Which prophet spoke directly to Allah, confronted Pharaoh, and led Bani Isra'il across the parted sea?",
    options: ["Isa", "Musa", "Adam", "Yunus"],
    correctIndex: 1,
    explanation:
      "Musa (Kalimullah) spoke with Allah, was sent to Pharaoh, and by Allah's command the sea parted so his people crossed safely.",
  },
  {
    id: "reflection-next",
    category: "vocabulary",
    type: "reflection",
    prompt:
      "Which one surah or short passage will you set out to understand and memorize next, in shaa Allah?",
    explanation:
      "Small consistent steps build a lifelong bond with the Book of Allah. Choose your portion, learn its meaning, and revise it often.",
  },
];
