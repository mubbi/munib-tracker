/**
 * One-time migration to the app-wide `readingDisplay` preference (D13, §4.5.4).
 *
 * Translation / transliteration visibility used to live in four stores: the
 * Qur'an reader (`quranPrefs`), practice (`companion`), hadith (`hadithPrefs`)
 * and the dua/zikr `readingTextVisibility` blob. The merged value is seeded from
 * the Qur'an reader (the most used surface), then from `readingTextVisibility`;
 * the old fields are read here once and never written again.
 *
 * Storage-only (no store imports) so `preferences-store.ts` can run it on load.
 */
import type { ReadingDisplayPrefs, UserPreferences } from "@munib-tracker/shared/types";

import { DB_KEYS } from "@/db/keys";
import { readJSON, withKeyLock, writeJSON } from "@/db/store";

export const DEFAULT_READING_DISPLAY: ReadingDisplayPrefs = {
  showTranslation: true,
  showTransliteration: true,
};

function legacyPair(value: unknown): ReadingDisplayPrefs | null {
  if (value == null || typeof value !== "object" || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  if (typeof v.showTranslation !== "boolean" && typeof v.showTransliteration !== "boolean") {
    return null;
  }
  return {
    showTranslation: v.showTranslation !== false,
    showTransliteration: v.showTransliteration !== false,
  };
}

/** Pure seed rule: Qur'an reader prefs first, then the dua/zikr visibility blob, then on/on. */
export function legacyReadingDisplay(
  quranPrefs: unknown,
  readingTextVisibility: unknown,
): ReadingDisplayPrefs {
  return (
    legacyPair(quranPrefs) ?? legacyPair(readingTextVisibility) ?? { ...DEFAULT_READING_DISPLAY }
  );
}

/** Stored or default value (readers treat an unmigrated blob as both on). */
export function readingDisplayOf(prefs: Pick<UserPreferences, "readingDisplay">) {
  const rd = prefs.readingDisplay;
  return {
    showTranslation: rd?.showTranslation !== false,
    showTransliteration: rd?.showTransliteration !== false,
  } satisfies ReadingDisplayPrefs;
}

/**
 * Seeds `userPreferences.readingDisplay` from the legacy fields when it is unset.
 * Returns the seeded value, or `null` when nothing was written (already set).
 *
 * `updatedAt` is deliberately kept: the migration is derived data, so bumping
 * the last-write-wins stamp could clobber newer preferences from another device.
 */
export function migrateStoredReadingDisplay(): Promise<ReadingDisplayPrefs | null> {
  return withKeyLock(DB_KEYS.userPreferences, async () => {
    const stored = await readJSON<Partial<UserPreferences> | null>(DB_KEYS.userPreferences, null);
    if (stored?.readingDisplay) return null;
    const [quranPrefs, visibility] = await Promise.all([
      readJSON<unknown>(DB_KEYS.quranPrefs, null),
      readJSON<unknown>(DB_KEYS.readingTextVisibility, null),
    ]);
    const readingDisplay = legacyReadingDisplay(quranPrefs, visibility);
    await writeJSON(DB_KEYS.userPreferences, { ...(stored ?? {}), readingDisplay });
    return readingDisplay;
  });
}
