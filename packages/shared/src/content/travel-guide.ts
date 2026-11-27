import type { JannahHadithRef, JannahQuranRef } from "../types/jannah";
import type { PrayerId } from "../types/prayer";

/** Offline travel-prayer guide (NF-1.3). Scholar-neutral teaching content. */
export const TRAVEL_GUIDE_CONTENT_VERSION = 1;

export type TravelSectionKey =
  | "qasr"
  | "jam"
  | "jamTypes"
  | "when"
  | "distance"
  | "sunnah"
  | "witr";

/** Ordered teaching cards on the travel guide screen. */
export const TRAVEL_SECTIONS: readonly TravelSectionKey[] = [
  "qasr",
  "jam",
  "jamTypes",
  "when",
  "distance",
  "sunnah",
  "witr",
];

export type TravelRakatRow = {
  prayerId: PrayerId | "witr";
  /** Fard rakahs at home. */
  resident: number;
  /** Fard rakahs while travelling (Qasr). */
  travel: number;
};

/** Fard rakahs at home vs on a qualifying journey. */
export const TRAVEL_RAKATS: readonly TravelRakatRow[] = [
  { prayerId: "fajr", resident: 2, travel: 2 },
  { prayerId: "dhuhr", resident: 4, travel: 2 },
  { prayerId: "asr", resident: 4, travel: 2 },
  { prayerId: "maghrib", resident: 3, travel: 3 },
  { prayerId: "isha", resident: 4, travel: 2 },
  { prayerId: "witr", resident: 3, travel: 3 },
];

/** Curated Qur'an references — excerpts live in i18n (`travel.quran.{n}.excerpt`). */
export const TRAVEL_QURAN_REFS: Omit<JannahQuranRef, "excerpt">[] = [
  { surah: 4, ayahFrom: 101, label: "Qur'an 4:101" },
];

/** Curated hadith — excerpts live in i18n (`travel.hadith.{n}.excerpt`). */
/**
 * Paired by index with `travel.hadith.{n}.excerpt` (en.json, verbatim fawazahmed0 English).
 * Numbers and grades checked against the hadith-api dataset on 2026-11-27 (Tirmidhi 553:
 * al-Albani, Ahmad Shakir — sahih).
 */
export const TRAVEL_HADITH_REFS: Omit<JannahHadithRef, "excerpt">[] = [
  { collection: "Sahih al-Bukhari", citation: "1081", grade: "sahih" },
  { collection: "Sahih Muslim", citation: "705", grade: "sahih" },
  { collection: "Sahih Muslim", citation: "686", grade: "sahih" },
  { collection: "Jami' at-Tirmidhi", citation: "553", grade: "sahih" },
];

/** Number of obligation bullet keys: `travel.obligations.{n}`. */
export const TRAVEL_OBLIGATION_COUNT = 6;
