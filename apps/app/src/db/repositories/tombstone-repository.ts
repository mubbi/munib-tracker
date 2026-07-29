import { DB_KEYS } from "../keys";
import { readJSON, removeKey, updateJSON } from "../store";

/** A locally-originated deletion awaiting propagation to the server on push. */
export interface Tombstone {
  entity: string;
  /** The sync record id (matches the id `buildSyncRecords` emits for this entity). */
  id: string;
  /** ISO datetime the record was deleted locally. */
  deletedAt: string;
}

function tombstoneKey(entity: string, id: string): string {
  return `${entity}::${id}`;
}

/**
 * Records locally-originated deletions so the sync engine can emit `deletedAt`
 * records for them. Without a tombstone, a deleted entity silently resurrects
 * when the next pull re-applies the still-present server copy.
 */
export const TombstoneRepository = {
  async getAll(): Promise<Tombstone[]> {
    const map = await readJSON<Record<string, Tombstone>>(DB_KEYS.tombstones, {});
    return Object.values(map);
  },

  async record(entity: string, id: string, deletedAt: string): Promise<void> {
    await updateJSON<Record<string, Tombstone>>(DB_KEYS.tombstones, {}, (map) => {
      map[tombstoneKey(entity, id)] = { entity, id, deletedAt };
      return map;
    });
  },

  /** Drops the given tombstones after they have been successfully pushed. */
  async clear(entries: { entity: string; id: string }[]): Promise<void> {
    if (entries.length === 0) return;
    await updateJSON<Record<string, Tombstone>>(DB_KEYS.tombstones, {}, (map) => {
      for (const { entity, id } of entries) delete map[tombstoneKey(entity, id)];
      return map;
    });
  },

  async clearAll(): Promise<void> {
    await removeKey(DB_KEYS.tombstones);
  },
};

export type TombstoneRepositoryType = typeof TombstoneRepository;
