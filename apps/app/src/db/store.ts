import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Offline-first persistence built on AsyncStorage. AsyncStorage is already a
 * dependency, works on iOS/Android/Web, and needs no native rebuild — so the
 * whole data layer stays cross-platform without adding expo-sqlite.
 */

export async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJSON<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeKey(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

/**
 * Per-key write serialization. AsyncStorage read-modify-write (read → mutate →
 * write) is not atomic, so two callers mutating the same key concurrently — e.g.
 * the sync engine applying a remote record while the user taps a prayer — can
 * read the same snapshot and clobber each other's change (a lost update). A
 * per-key promise chain forces every mutation of a given key to run one at a
 * time, regardless of which module triggered it.
 */
const writeChains = new Map<string, Promise<unknown>>();

export function withKeyLock<T>(key: string, task: () => Promise<T>): Promise<T> {
  const prev = writeChains.get(key) ?? Promise.resolve();
  const run = prev.then(task, task);
  // Keep the chain alive but swallow settlement so one failed write can't wedge
  // the key for every subsequent caller.
  writeChains.set(
    key,
    run.then(
      () => undefined,
      () => undefined,
    ),
  );
  return run;
}

/**
 * Atomic read-modify-write for a single AsyncStorage key. The updater receives
 * the current value (or `fallback` when absent) and returns the next value to
 * persist. Serialized per key via {@link withKeyLock}, so concurrent callers
 * can never lose a write. Prefer this over manual readJSON/writeJSON pairs.
 */
export async function updateJSON<T>(
  key: string,
  fallback: T,
  updater: (current: T) => T | Promise<T>,
): Promise<T> {
  return withKeyLock(key, async () => {
    const current = await readJSON<T>(key, fallback);
    const next = await updater(current);
    await writeJSON(key, next);
    return next;
  });
}

/**
 * A collection stored as a single `Record<string, T>` under one AsyncStorage
 * key. Suitable for the modest data volumes of a personal worship tracker.
 */
export class KeyedCollection<T> {
  constructor(private readonly storageKey: string) {}

  async getMap(): Promise<Record<string, T>> {
    return readJSON<Record<string, T>>(this.storageKey, {});
  }

  async getAll(): Promise<T[]> {
    return Object.values(await this.getMap());
  }

  async get(id: string): Promise<T | undefined> {
    return (await this.getMap())[id];
  }

  async upsert(id: string, value: T): Promise<T> {
    await updateJSON<Record<string, T>>(this.storageKey, {}, (map) => {
      map[id] = value;
      return map;
    });
    return value;
  }

  async remove(id: string): Promise<void> {
    await updateJSON<Record<string, T>>(this.storageKey, {}, (map) => {
      delete map[id];
      return map;
    });
  }

  /**
   * Atomically applies `mutate` to the whole collection map under the key lock.
   * Use for conditional writes (e.g. last-write-wins guards) that must read and
   * write the collection without another caller interleaving in between.
   */
  async mutate(mutate: (map: Record<string, T>) => void): Promise<void> {
    await updateJSON<Record<string, T>>(this.storageKey, {}, (map) => {
      mutate(map);
      return map;
    });
  }

  async clear(): Promise<void> {
    await removeKey(this.storageKey);
  }
}
