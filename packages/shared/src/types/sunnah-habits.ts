/**
 * Daily Sunnah habits (NF-3.5). A small, personal checklist of everyday sunnahs.
 * Catalog ids live in `content/sunnah-habits.ts`; linked habits (adhkar, istighfar
 * via the tasbeeh, sadaqah log) are derived from their own stores and are never
 * double-stored here.
 */

/** A user-defined habit (title only — it carries no evidence). */
export interface SunnahHabitCustom {
  /** `custom:<random>` — stable across devices. */
  id: string;
  title: string;
  /** Present ⇒ a count habit with this daily target; absent ⇒ a yes/no habit. */
  target?: number;
}

export interface SunnahHabitsState {
  /** Ordered habit ids the user follows (catalog or `custom:*`), max {@link SUNNAH_HABITS_MAX_SELECTED}. */
  selected: string[];
  custom: SunnahHabitCustom[];
  /** `${habitId}::${YYYY-MM-DD}` → 1 for a yes/no habit, n for a count habit. */
  checks: Record<string, number>;
  /**
   * `checks` key → ISO instant of its last write, including a clear (key absent
   * from `checks` + stamp = tombstone). Sync keeps the newest write per key, so
   * an untick / lowered count isn't restored by another device. Absent on data
   * written before stamps existed (treated as oldest).
   */
  checkStamps?: Record<string, string>;
  /** Local date (YYYY-MM-DD): checks dated before it were pruned and stay pruned after a merge. */
  prunedBefore?: string;
  /** habitId → last local date (YYYY-MM-DD) it was shown as the daily spotlight. */
  spotlightSeen: Record<string, string>;
  /** Daily target per count habit the user tunes (e.g. salawat). Unset ⇒ catalog default. */
  targets?: Record<string, number>;
  /** ISO instant `selected` / `custom` / `targets` last changed — LWW for the list in sync merges. */
  listUpdatedAt?: string;
}

/** Keep the list small — consistency over volume (Bukhari 6464). */
export const SUNNAH_HABITS_MAX_SELECTED = 12;
