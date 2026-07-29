import type { WhiteDaysChecklistItem } from "../types/white-days";

/**
 * White Days (Ayyām al-Bīḍ) monthly fasting checklist — the 13th, 14th and 15th
 * of the current Hijri month. Titles/hints live in app i18n
 * (`tracker.whiteDays.items.<id>.*`); this corpus only carries stable ids, the
 * Hijri day each row maps to, and a classical citation label. Progress is
 * scoped to the Hijri month and synced as blob entity `white_days_checklist`.
 */
export const WHITE_DAYS_CHECKLIST: WhiteDaysChecklistItem[] = [
  { id: "day13", hijriDay: 13, reference: "Nasa'i 2422" },
  { id: "day14", hijriDay: 14, reference: "Abu Dawud 2449" },
  { id: "day15", hijriDay: 15, reference: "Tirmidhi 761" },
];
