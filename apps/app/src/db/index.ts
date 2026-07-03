import { DB_KEYS } from "./keys";
import { runMigrations } from "./migrations";
import { removeKey } from "./store";

export { createId } from "./id";
export { DB_KEYS } from "./keys";
export { HadithRepository } from "./repositories/hadith-repository";
export { PrayerRepository } from "./repositories/prayer-repository";
export { PreferencesRepository } from "./repositories/preferences-repository";
export { QazaRepository } from "./repositories/qaza-repository";
export { QuranCacheRepository } from "./repositories/quran-cache-repository";
export { QuranRepository } from "./repositories/quran-repository";
export { ZikrRepository } from "./repositories/zikr-repository";

let initPromise: Promise<void> | null = null;

/** Initializes the local database once per app session (runs pending migrations). */
export function initDatabase(): Promise<void> {
  if (!initPromise) {
    initPromise = runMigrations();
  }
  return initPromise;
}

/** Wipes all locally stored tracking data (used when deleting an account). */
export async function resetDatabase(): Promise<void> {
  await Promise.all(
    [
      DB_KEYS.prayerLogs,
      DB_KEYS.zikrProgress,
      DB_KEYS.qazaCounters,
      DB_KEYS.qazaDailyPlans,
      DB_KEYS.qazaRoza,
      DB_KEYS.userPreferences,
      DB_KEYS.syncMetadata,
      DB_KEYS.achievements,
      DB_KEYS.quranBookmarks,
      DB_KEYS.quranLastRead,
      DB_KEYS.quranReadingProgress,
      DB_KEYS.quranPrefs,
      DB_KEYS.quranEditionCache,
      DB_KEYS.hadithBookmarks,
      DB_KEYS.hadithBookCache,
    ].map((key) => removeKey(key)),
  );
}
