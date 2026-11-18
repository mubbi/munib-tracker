import { DB_KEYS } from "@/db/keys";
import { readJSON, updateJSON } from "@/db/store";
import { coercePrefs, DEFAULT_COMPANION_PREFS } from "@/lib/quran-companion/prefs";
import type { QuranCompanionPrefs } from "@/lib/quran-companion/types";

/**
 * Qur'an practice prefs (§9.5 Cards 2–3, plus listener choices). One blob,
 * whole-value last-write-wins in sync, with an `isPristine` guard (§10).
 */
export const QuranCompanionPrefsRepository = {
  async get(): Promise<QuranCompanionPrefs> {
    const raw = await readJSON<unknown>(DB_KEYS.quranCompanionPrefs, null);
    // A blob from a newer schema is read as defaults but never overwritten here.
    return coercePrefs(raw) ?? { ...DEFAULT_COMPANION_PREFS };
  },

  /** Merge a patch into the stored prefs. Refuses to touch a newer-schema blob. */
  async update(patch: Partial<QuranCompanionPrefs>): Promise<QuranCompanionPrefs> {
    let result: QuranCompanionPrefs = { ...DEFAULT_COMPANION_PREFS };
    await updateJSON<unknown>(DB_KEYS.quranCompanionPrefs, null, (current) => {
      const prefs = coercePrefs(current);
      if (!prefs) {
        result = { ...DEFAULT_COMPANION_PREFS, ...patch };
        return current;
      }
      result = { ...prefs, ...patch, schemaVersion: 1 };
      return result;
    });
    return result;
  },
};
