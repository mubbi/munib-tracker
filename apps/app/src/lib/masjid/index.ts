/**
 * NF-3.11 masjid layer — the small API other features use:
 *
 * - `getHomeMasjid()` / `useHomeMasjid()` — the user's home masjid (or null).
 * - `iqamahFor(date, prayer)` — "HH:mm" from the user's private times, then a
 *   licence-cleared public source, else null (fall back to the adhan time).
 *   Used by NF-3.13 focus lock (iqamah window) and the rawatib tahiyyat hint.
 * - `ensureHomeMasjidLoaded()` — load the backing stores outside React.
 * - `saveImportedTimetable()` / `TIMETABLE_IMPORT_ROUTE` — the NF-3.12 OCR slot.
 */
export {
  ensureHomeMasjidLoaded,
  getHomeIqamahTimetable,
  getHomeMasjid,
  iqamahFor,
  requestIqamahReschedule,
  setHomeMasjid,
  useHomeIqamahTimetable,
  useHomeMasjid,
} from "./home-masjid";
export { dateKeyOf, iqamahOn } from "./iqamah-on";
export { saveImportedTimetable, TIMETABLE_IMPORT_ROUTE } from "./timetable-import";

/** Evidence rendered by reference (docs/proofs/masjid-finder.md; Muslim uses the corpus id). */
export const MASJID_EVIDENCE = {
  /** Congregational salah is 27 degrees better. */
  congregation: { kind: "hadith", collection: "bukhari", number: "645" },
  /** Steps to the masjid (plan "Muslim 666" = corpus muslim:1521, arabicnumber 666). */
  steps: { kind: "hadith", collection: "muslim", number: "1521" },
  /** Tahiyyat al-masjid: two rakahs before sitting. */
  tahiyyat: { kind: "hadith", collection: "bukhari", number: "444" },
} as const;
