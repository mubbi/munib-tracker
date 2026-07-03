import { runMigrations } from "./migrations";

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
