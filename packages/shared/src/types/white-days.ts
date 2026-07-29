/** One row on the White Days (Ayyām al-Bīḍ) monthly fasting checklist. */
export interface WhiteDaysChecklistItem {
  /** Stable id used in the checklist store (e.g. "day13"). */
  id: string;
  /** Hijri day-of-month this row represents (13, 14 or 15). */
  hijriDay: number;
  /** Short classical citation label shown as secondary text, e.g. "Nasa'i 2422". */
  reference?: string;
}
