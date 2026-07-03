import { DB_KEYS } from "./keys";
import { readJSON, writeJSON } from "./store";

/** Bump when a migration is added. */
export const DB_VERSION = 1;

type Migration = () => Promise<void>;

/**
 * Versioned migrations. Each index N migrates the store from version N to N+1.
 * The initial schema needs no migration, so the list is currently empty.
 */
const MIGRATIONS: Migration[] = [];

/** Runs any pending migrations and records the current schema version. */
export async function runMigrations(): Promise<void> {
  const current = await readJSON<number>(DB_KEYS.version, 0);
  for (let version = current; version < DB_VERSION; version += 1) {
    const migrate = MIGRATIONS[version];
    if (migrate) await migrate();
  }
  if (current !== DB_VERSION) {
    await writeJSON(DB_KEYS.version, DB_VERSION);
  }
}
