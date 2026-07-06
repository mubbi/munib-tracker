import type { QuranGuideMemorizationPlan } from "../types/quran-guide";

/** Memorization tiers — connect to Munib hifz tracker in V4. */
export const QURAN_GUIDE_MEMORIZATION_PLANS: QuranGuideMemorizationPlan[] = [
  {
    id: "beginner",
    title: "Beginner — Juz Amma",
    summary: "Start with short surahs from Surah An-Nas backward to An-Naba.",
    surahs: ["An-Nas", "Al-Falaq", "Al-Ikhlas", "Al-Masad", "An-Nasr", "Al-Kafirun", "Al-Kawthar"],
    tip: "One ayah per day with 10 repetitions listening to a murattal reciter.",
  },
  {
    id: "intermediate",
    title: "Intermediate — Ten core surahs",
    summary: "Add Al-Fatiha, Al-Mulk, Ya-Sin, Ar-Rahman, Al-Waqi'ah, and Al-Kahf.",
    surahs: [
      "Al-Fatiha",
      "Al-Mulk",
      "Ya-Sin",
      "Ar-Rahman",
      "Al-Waqi'ah",
      "Al-Kahf",
      "Al-Jumu'ah",
      "Al-Hashr",
    ],
    tip: "Link new memorisation to morning or after-Fajr routine for consistency.",
  },
  {
    id: "advanced",
    title: "Advanced — One juz",
    summary: "Complete any juz with strong revision of prior portions.",
    surahs: ["Choose a juz — many start with Juz 29 or 30 then expand"],
    tip: "Never add new ayahs without revising old — the Prophet ﷺ compared hifz to a lost camel.",
  },
  {
    id: "hafiz",
    title: "Hafiz journey",
    summary: "Full Qur'an memorisation with a qualified teacher and sanad.",
    surahs: ["Entire mushaf — typically 3–7 years with daily revision"],
    tip: "Use Munib's hifz tracker; pair with a local hafiz for listening and correction.",
  },
];
