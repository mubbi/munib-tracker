import type { QuranGuideMemorizationPlan } from "../types/quran-guide";

/**
 * Memorization tiers — connect to Munib hifz tracker. Bump
 * QURAN_GUIDE_MEMORIZATION_VERSION on content change.
 */
export const QURAN_GUIDE_MEMORIZATION_VERSION = 2;

export const QURAN_GUIDE_MEMORIZATION_PLANS: QuranGuideMemorizationPlan[] = [
  {
    id: "beginner",
    title: "Beginner — Juz Amma",
    summary:
      "The natural starting point for everyone. Begin with the very short surahs at the end of the mus'haf — from an-Nas working backwards — which are easy, quickly rewarding, and useful in every prayer.",
    surahs: ["An-Nas", "Al-Falaq", "Al-Ikhlas", "Al-Masad", "An-Nasr", "Al-Kafirun", "Al-Kawthar"],
    tip: "Memorise just one ayah a day: listen to a murattal reciter repeat it about ten times, echo it aloud until it flows, then join it to what you already hold before moving on.",
  },
  {
    id: "intermediate",
    title: "Intermediate — Ten core surahs",
    summary:
      "Once the short surahs are solid, take on the well-loved longer chapters that carry great virtue and are often recited on Fridays and at night — al-Mulk, Ya-Sin, ar-Rahman, al-Waqi'ah, and al-Kahf among them.",
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
    tip: "Anchor new memorisation to a fixed daily slot — the calm, clear-minded time just after Fajr is ideal — so consistency does the heavy lifting.",
  },
  {
    id: "advanced",
    title: "Advanced — One juz",
    summary:
      "Commit to completing a full juz while keeping everything before it rock-solid. Many begin with Juz 29 or 30, whose surahs they already partly know, then expand outward one juz at a time.",
    surahs: ["Choose a juz — many start with Juz 29 or 30, then expand"],
    tip: "Never add a new portion until the old is firmly revised. The Prophet ﷺ warned that the memorised Qur'an slips away faster than a tethered camel breaks loose.",
  },
  {
    id: "hafiz",
    title: "Hafiz journey",
    summary:
      "Memorising the entire Qur'an — a lifelong honour that raises the one who carries it and, by Allah's grace, their parents. It is a serious commitment, typically spanning several years of daily new memorisation and disciplined revision.",
    surahs: ["Entire mushaf — typically 3–7 years with daily revision"],
    tip: "Do not attempt it alone: use Munib's hifz tracker to manage your revision schedule, and recite regularly to a qualified hafiz or teacher who can catch and correct your mistakes.",
  },
];
