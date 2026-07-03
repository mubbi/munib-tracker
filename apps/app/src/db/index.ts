import { DB_KEYS } from "./keys";
import { runMigrations } from "./migrations";
import { removeKey } from "./store";

export { createId } from "./id";
export { DB_KEYS } from "./keys";
export { PrayerRepository } from "./repositories/prayer-repository";
export { PreferencesRepository } from "./repositories/preferences-repository";
export { QazaRepository } from "./repositories/qaza-repository";
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
    ].map((key) => removeKey(key)),
  );
}
