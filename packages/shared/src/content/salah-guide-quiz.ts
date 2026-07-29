import type { SalahGuideQuizQuestion } from "../types/salah-guide";

/** Educational quiz — review knowledge, not spiritual ranking. Bump when questions change. */
export const SALAH_GUIDE_QUIZ_VERSION = 1;

export const SALAH_GUIDE_QUIZ: SalahGuideQuizQuestion[] = [
  {
    id: "rawatib-total",
    type: "multiple-choice",
    prompt: "How many sunnah rawatib rakahs are agreed upon each day?",
    options: ["8", "10", "12", "14"],
    correctIndex: 2,
    explanation:
      "The twelve rawatib are: 2 before Fajr, 4 before Dhuhr, 2 after Dhuhr, 2 after Maghrib, and 2 after Isha (Sahih Muslim 728).",
  },
  {
    id: "rawatib-fajr",
    type: "multiple-choice",
    prompt: "Before Fajr, the emphasised (mu'akkadah) sunnah is:",
    options: ["None", "2 rakahs", "4 rakahs", "2 rakahs after only"],
    correctIndex: 1,
    explanation:
      "Two rakahs before Fajr are sunnah mu'akkadah — the Prophet ﷺ never neglected them (Sahih al-Bukhari 1169; Sahih Muslim 724).",
  },
  {
    id: "rawatib-dhuhr",
    type: "multiple-choice",
    prompt: "The agreed rawatib around Dhuhr are:",
    options: ["2 before, 2 after", "4 before, 2 after", "4 before, 4 after", "2 before only"],
    correctIndex: 1,
    explanation:
      "Four before Dhuhr and two after are part of the twelve rawatib. Extra rakahs beyond these are recommended nafl, not fixed rawatib.",
  },
  {
    id: "asr-ghayr-muakkadah",
    type: "true-false",
    prompt: "True or false: Four rakahs before Asr are part of the fixed twelve daily rawatib.",
    options: ["True", "False"],
    correctIndex: 1,
    explanation:
      "Four before Asr are sunnah ghayr mu'akkadah (widely recommended) but are not counted among the twelve rawatib (Jami' at-Tirmidhi 430).",
  },
  {
    id: "witr-separate",
    type: "multiple-choice",
    prompt: "Why is Witr kept in its own category in the prayer tracker?",
    options: [
      "It is not mentioned in hadith",
      "Hanafis count it wajib while the majority count it sunnah mu'akkadah",
      "It is always prayed before Isha",
      "It has no set number of rakahs",
    ],
    correctIndex: 1,
    explanation:
      "Witr is strongly established, but scholars differ on whether it is wajib or sunnah mu'akkadah — so it is tracked separately from the twelve rawatib.",
  },
  {
    id: "jahri-fajr",
    type: "multiple-choice",
    prompt: "In congregational Fajr, the imam recites:",
    options: [
      "Silently in both rakahs",
      "Aloud in both rakahs",
      "Aloud in the first only",
      "Silently in the first, aloud in the second",
    ],
    correctIndex: 1,
    explanation:
      "Fajr is recited aloud (jahri) in both rakahs. Behind the imam you listen attentively.",
  },
  {
    id: "jahri-dhuhr-asr",
    type: "multiple-choice",
    prompt: "Dhuhr and Asr in congregation are recited:",
    options: [
      "Aloud in all rakahs",
      "Silently in all rakahs",
      "Aloud in the first two, silent after",
      "Silent in the first two, aloud after",
    ],
    correctIndex: 1,
    explanation:
      "Dhuhr and Asr are sirri (silent) throughout — the imam recites quietly and each worshipper recites for himself.",
  },
  {
    id: "jahri-maghrib",
    type: "multiple-choice",
    prompt: "In Maghrib, the imam recites aloud in:",
    options: [
      "All three rakahs",
      "The first two rakahs only",
      "The third rakah only",
      "None — Maghrib is fully silent",
    ],
    correctIndex: 1,
    explanation:
      "Maghrib is jahri in the first and second rakahs and sirri in the third — the same long/short pattern as other prayers.",
  },
  {
    id: "jahri-isha",
    type: "multiple-choice",
    prompt: "In Isha, when does audible recitation stop?",
    options: [
      "After the first rakah",
      "After the second rakah",
      "After the third rakah",
      "Never — all four are aloud",
    ],
    correctIndex: 1,
    explanation: "Isha is aloud in the first two rakahs and silent in the third and fourth.",
  },
  {
    id: "behind-imam-loud",
    type: "multiple-choice",
    prompt: "In loud prayers behind the imam, everyone agrees that you should:",
    options: [
      "Recite another surah aloud with the imam",
      "Listen attentively and not recite another surah aloud",
      "Leave the prayer after Al-Fatihah",
      "Recite only in the last rakah",
    ],
    correctIndex: 1,
    explanation:
      "Allah says: 'When the Qur'an is recited, listen to it attentively and remain silent' (Qur'an 7:204).",
  },
  {
    id: "fatihah-shafii",
    type: "multiple-choice",
    prompt: "According to the Shafi'i school, behind the imam in a loud prayer you:",
    options: [
      "Do not recite Al-Fatihah at all",
      "Recite Al-Fatihah in every rakah",
      "Recite only in the silent rakahs",
      "Recite aloud with the imam",
    ],
    correctIndex: 1,
    explanation:
      "The Shafi'i school holds that reciting Al-Fatihah is required for every worshipper in every rakah, citing 'There is no prayer for the one who does not recite the Opening of the Book' (Sahih al-Bukhari 756).",
  },
  {
    id: "fatihah-hanafi-loud",
    type: "multiple-choice",
    prompt: "According to the Hanafi school, in loud prayers behind the imam you:",
    options: [
      "Recite Al-Fatihah quietly in every rakah",
      "Listen attentively and do not recite Al-Fatihah",
      "Recite only the surah after Al-Fatihah",
      "Must recite Al-Fatihah aloud",
    ],
    correctIndex: 1,
    explanation:
      "The Hanafi relied-upon view is to listen in jahri prayers; the imam's recitation suffices. All four Sunni schools are valid positions.",
  },
  {
    id: "first-two-surah",
    type: "multiple-choice",
    prompt: "In the first two rakahs of Dhuhr, the Prophet ﷺ generally recited:",
    options: [
      "Only Al-Fatihah",
      "Al-Fatihah and another surah",
      "Nothing — it was fully silent",
      "Only tasbeeh",
    ],
    correctIndex: 1,
    explanation:
      "Abu Qatadah reported that the Prophet ﷺ recited Al-Fatihah and another surah in the first two rakahs of Dhuhr and Asr, and only Al-Fatihah in the last two (Sahih al-Bukhari 776; Sahih Muslim 451).",
  },
  {
    id: "alone-fajr",
    type: "multiple-choice",
    prompt: "When praying Fajr alone, it is sunnah to:",
    options: [
      "Recite silently only",
      "Recite aloud (though silent is still valid)",
      "Skip the surah after Al-Fatihah",
      "Pray only one rakah",
    ],
    correctIndex: 1,
    explanation:
      "Alone, you recite the same content as in congregation; in Fajr, Maghrib, and Isha it is sunnah to recite aloud.",
  },
  {
    id: "awwabin-disputed",
    type: "true-false",
    prompt:
      "True or false: Six fixed rakahs after Maghrib as Salat al-Awwabin is established sunnah with unanimous agreement.",
    options: ["True", "False"],
    correctIndex: 1,
    explanation:
      "General nafl after Maghrib is encouraged, but the famous specification of exactly six rakahs as Awwabin is disputed in authenticity — it should not be presented as fixed established sunnah.",
  },
];
