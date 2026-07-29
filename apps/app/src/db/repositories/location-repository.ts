import { DEFAULT_LOCATION, type StoredLocation } from "@/lib/location";

import { DB_KEYS } from "../keys";
import { readJSON, writeJSON } from "../store";

/** Fills any missing fields from the default so older/partial records stay valid. */
function withDefaults(stored: Partial<StoredLocation>): StoredLocation {
  return { ...DEFAULT_LOCATION, ...stored };
}

/**
 * Persists the user's last known location + prayer-calculation settings so the
 * home screen renders instantly and offline on the next launch, before (or
 * without) a fresh GPS fix.
 */
export const LocationRepository = {
  async get(): Promise<StoredLocation> {
    const stored = await readJSON<Partial<StoredLocation>>(DB_KEYS.location, {});
    return withDefaults(stored);
  },

  async update(patch: Partial<StoredLocation>): Promise<StoredLocation> {
    const current = await this.get();
    const next = withDefaults({ ...current, ...patch });
    await writeJSON(DB_KEYS.location, next);
    return next;
  },
};

export type LocationRepositoryType = typeof LocationRepository;
