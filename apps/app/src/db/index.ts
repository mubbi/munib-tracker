import { DB_KEYS } from "./keys";
import { runMigrations } from "./migrations";
import { removeKey } from "./store";

export { createId } from "./id";
export { DB_KEYS } from "./keys";
export { ContinueRepository } from "./repositories/continue-repository";
export { HadithRepository } from "./repositories/hadith-repository";
export { LocationRepository } from "./repositories/location-repository";
export { PrayerRepository } from "./repositories/prayer-repository";
export { PreferencesRepository } from "./repositories/preferences-repository";
export { QazaRepository } from "./repositories/qaza-repository";
export { QuranCacheRepository } from "./repositories/quran-cache-repository";
export { QuranRepository } from "./repositories/quran-repository";
export { TombstoneRepository } from "./repositories/tombstone-repository";
export { WeatherCacheRepository } from "./repositories/weather-cache-repository";
export { ZikrRepository } from "./repositories/zikr-repository";

let initPromise: Promise<void> | null = null;

/** Initializes the local database once per app session (runs pending migrations). */
export function initDatabase(): Promise<void> {
  if (!initPromise) {
    initPromise = runMigrations().catch((error) => {
      // Don't cache a failed migration — clearing the promise lets the next
      // caller retry instead of permanently bricking every store's load().
      initPromise = null;
      throw error;
    });
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
      DB_KEYS.qazaSchedule,
      DB_KEYS.qazaDailyProgress,
      DB_KEYS.qazaRoza,
      DB_KEYS.userPreferences,
      DB_KEYS.location,
      DB_KEYS.syncMetadata,
      DB_KEYS.achievements,
      DB_KEYS.quranBookmarks,
      DB_KEYS.quranLastRead,
      DB_KEYS.quranReadingProgress,
      DB_KEYS.quranPrefs,
      DB_KEYS.quranEditionCache,
      DB_KEYS.hadithBookmarks,
      DB_KEYS.hadithBookCache,
      DB_KEYS.continueActivity,
      DB_KEYS.duaFavorites,
      DB_KEYS.tombstones,
      DB_KEYS.weatherCache,
    ].map((key) => removeKey(key)),
  );
}
