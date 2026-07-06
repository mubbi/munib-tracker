import type { JannahHadithRef, JannahQuranRef } from "../types/jannah";

/** Offline zakat guide (NF-2.2). Scholar-neutral teaching content. */
export const ZAKAT_GUIDE_CONTENT_VERSION = 2;

/** Gold nisab weight in grams (~7.5 tola / 87.48 g — widely cited in Hanafi texts). */
export const GOLD_NISAB_GRAMS = 87.48;

/** Silver nisab weight in grams (~52.5 tola / 612.36 g). */
export const SILVER_NISAB_GRAMS = 612.36;

/** Standard rate on qualifying monetary wealth (1/40). */
export const ZAKAT_WEALTH_RATE = 0.025;

export type ZakatGuideSectionKey =
  | "basics"
  | "purpose"
  | "hawl"
  | "nisab"
  | "zakatable"
  | "exempt"
  | "debts"
  | "recipients"
  | "otherRates"
  | "mistakes";

/** Ordered teaching cards on the zakat screen. */
export const ZAKAT_GUIDE_SECTIONS: readonly ZakatGuideSectionKey[] = [
  "basics",
  "purpose",
  "hawl",
  "nisab",
  "zakatable",
  "exempt",
  "debts",
  "recipients",
  "otherRates",
  "mistakes",
];

/**
 * Curated Qur'an references — excerpts live in i18n (`zakat.quran.{n}.excerpt`).
 * 9:60 (eight recipients), 9:103 (charity purifies), 2:267 (spend from the good),
 * 2:277 (the reward of those who give zakat).
 */
export const ZAKAT_QURAN_REFS: Omit<JannahQuranRef, "excerpt">[] = [
  { surah: 9, ayahFrom: 60, label: "Qur'an 9:60" },
  { surah: 9, ayahFrom: 103, label: "Qur'an 9:103" },
  { surah: 2, ayahFrom: 267, label: "Qur'an 2:267" },
  { surah: 2, ayahFrom: 277, label: "Qur'an 2:277" },
];

/**
 * Curated hadith — excerpts live in i18n (`zakat.hadith.{n}.excerpt`).
 * All citations re-verified: pillars of Islam (Bukhari 8 / Muslim 16); Mu'adh sent to
 * Yemen, "taken from their rich and given to their poor" (Bukhari 1395); the warning to
 * the one who withholds gold and silver (Muslim 987); nisab of 200 dirhams and the hawl
 * condition (Abu Dawud 1573, narrated by 'Ali, graded sahih).
 */
export const ZAKAT_HADITH_REFS: Omit<JannahHadithRef, "excerpt">[] = [
  { collection: "Sahih al-Bukhari", citation: "8", grade: "sahih" },
  { collection: "Sahih al-Bukhari", citation: "1395", grade: "sahih" },
  { collection: "Sahih Muslim", citation: "987", grade: "sahih" },
  { collection: "Sunan Abi Dawud", citation: "1573", grade: "sahih" },
];

/** Number of checklist bullet keys: `zakat.checklist.{n}`. */
export const ZAKAT_CHECKLIST_COUNT = 6;
