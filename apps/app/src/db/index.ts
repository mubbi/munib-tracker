import { RESET_KEYS } from "./keys";
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
export { QuranStudyCacheRepository } from "./repositories/quran-study-cache-repository";
export { ReverseGeocodeCacheRepository } from "./repositories/reverse-geocode-cache-repository";
export { TombstoneRepository } from "./repositories/tombstone-repository";
export { WeatherCacheRepository } from "./repositories/weather-cache-repository";
export { ZakatCalculatorRepository } from "./repositories/zakat-calculator-repository";
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

/**
 * Wipes all locally stored data (used when deleting an account). Derives the key
 * list from {@link RESET_KEYS} so every persisted key except the schema marker is
 * cleared automatically as new features are added — no key can be forgotten here.
 */
export async function resetDatabase(): Promise<void> {
  await Promise.all(RESET_KEYS.map((key) => removeKey(key)));
}
