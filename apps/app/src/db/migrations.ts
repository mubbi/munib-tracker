import { DB_KEYS } from "./keys";
import { readJSON, removeKey, writeJSON } from "./store";

/** Bump when a migration is added. */
export const DB_VERSION = 2;

type Migration = () => Promise<void>;

/**
 * Versioned migrations. Each index N migrates the store from version N to N+1.
 * Index 0 (0→1) is a no-op placeholder for the initial schema stamp.
 */
const MIGRATIONS: Migration[] = [
  async () => {
    // 0 → 1: initial schema — nothing to transform.
  },
  async () => {
    // 1 → 2: prefs fast-path used to advance `lastPushedAt`, which could skip
    // older tracking/settings deltas on the next full sync. Clear the push
    // watermark (keep the pull cursor) so the next signed-in sync re-offers
    // local data without forcing a full re-pull.
    const meta = await readJSON<Record<string, unknown>>(DB_KEYS.syncMetadata, {});
    if (!("lastPushedAt" in meta)) return;
    const { lastPushedAt: _dropped, ...rest } = meta;
    if (Object.keys(rest).length === 0) {
      await removeKey(DB_KEYS.syncMetadata);
    } else {
      await writeJSON(DB_KEYS.syncMetadata, rest);
    }
  },
];

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
