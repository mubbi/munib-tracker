import AsyncStorage from "@react-native-async-storage/async-storage";

import { captureAppException } from "@/lib/sentry";

/**
 * Offline-first persistence built on AsyncStorage. AsyncStorage is already a
 * dependency, works on iOS/Android/Web, and needs no native rebuild — so the
 * whole data layer stays cross-platform without adding expo-sqlite.
 *
 * Android SQLite CursorWindow cannot read a single row larger than ~1–2 MB.
 * Large content caches must use {@link storageShardKey} (one value per entry)
 * rather than one growing JSON blob. {@link readJSON} drops rows that are
 * already too big so getItem does not fail on every launch.
 */

/**
 * Stay under Android's CursorWindow (~1–2 MB, UTF-8). JS string length is
 * UTF-16, so we measure `TextEncoder` bytes before writing cache values.
 */
export const MAX_SAFE_ASYNC_STORAGE_VALUE_BYTES = 1_000_000;

/** Keys that threw CursorWindow (or similar) and could not be deleted this session. */
const unreadableKeys = new Set<string>();

/** Bases whose legacy monolith has been split (or confirmed absent) this session. */
const migratedShardBases = new Set<string>();

export function isOversizedRowError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /Row too big to fit into CursorWindow/i.test(message);
}

function utf8ByteLength(value: string): number {
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(value).length;
  }
  return value.length;
}

/** Best-effort quarantine so a corrupt value is not silently treated as "empty". */
async function quarantineCorrupt(key: string, raw: string, error: unknown): Promise<void> {
  captureAppException(error, {
    tags: { area: "async-storage", key },
    extra: { rawLength: raw.length },
  });
  try {
    await AsyncStorage.setItem(`${key}__corrupt`, raw);
    await AsyncStorage.removeItem(key);
  } catch {
    // Quarantine is best-effort; callers still get the fallback.
  }
}

/**
 * Delete a row that AsyncStorage can no longer read. removeItem usually works
 * without loading the value; if it doesn't, overwrite with a tiny payload.
 */
async function dropUnreadableKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
    unreadableKeys.delete(key);
    return;
  } catch {
    // Fall through to overwrite.
  }
  try {
    await AsyncStorage.setItem(key, "null");
    unreadableKeys.delete(key);
  } catch {
    unreadableKeys.add(key);
  }
}

export async function readJSON<T>(key: string, fallback: T): Promise<T> {
  if (unreadableKeys.has(key)) return fallback;
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      await quarantineCorrupt(key, raw, error);
      return fallback;
    }
  } catch (error) {
    captureAppException(error, { tags: { area: "async-storage", key, phase: "getItem" } });
    if (isOversizedRowError(error)) {
      await dropUnreadableKey(key);
    }
    return fallback;
  }
}

export async function writeJSON<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

/**
 * Persist JSON only when the UTF-8 payload fits in a CursorWindow-safe row.
 * Returns false when skipped so callers can keep a session cache without
 * poisoning AsyncStorage.
 */
export async function writeJSONIfSafe<T>(key: string, value: T): Promise<boolean> {
  const raw = JSON.stringify(value);
  if (utf8ByteLength(raw) > MAX_SAFE_ASYNC_STORAGE_VALUE_BYTES) {
    return false;
  }
  await AsyncStorage.setItem(key, raw);
  return true;
}

export async function removeKey(key: string): Promise<void> {
  unreadableKeys.delete(key);
  await AsyncStorage.removeItem(key);
}

/** Shard id for a value stored under `${baseKey}/${encodeURIComponent(id)}`. */
export function storageShardKey(baseKey: string, id: string): string {
  return `${baseKey}/${encodeURIComponent(id)}`;
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

export async function listKeyTree(baseKey: string): Promise<string[]> {
  const keys = await AsyncStorage.getAllKeys();
  const prefix = `${baseKey}/`;
  return keys.filter((key) => key === baseKey || key.startsWith(prefix));
}

/**
 * Removes `baseKey` and every `${baseKey}/…` shard. Safe for unsharded keys
 * (only the exact key matches).
 */
export async function removeKeyTree(baseKey: string): Promise<void> {
  await withKeyLock(baseKey, async () => {
    migratedShardBases.delete(baseKey);
    unreadableKeys.delete(baseKey);
    const keys = await listKeyTree(baseKey);
    if (keys.length === 0) return;
    for (const key of keys) unreadableKeys.delete(key);
    await AsyncStorage.multiRemove(keys);
  });
}

/** Sum of UTF-16 string lengths of `baseKey` and its shards (approx. on-device size). */
export async function byteSizeOfKeyTree(baseKey: string): Promise<number> {
  const keys = await listKeyTree(baseKey);
  let bytes = 0;
  for (const key of keys) {
    if (unreadableKeys.has(key)) continue;
    try {
      const raw = await AsyncStorage.getItem(key);
      bytes += raw?.length ?? 0;
    } catch (error) {
      captureAppException(error, { tags: { area: "async-storage", key, phase: "getItem" } });
      if (isOversizedRowError(error)) {
        await dropUnreadableKey(key);
      }
    }
  }
  return bytes;
}

/**
 * Split a legacy `Record<id, value>` blob at `baseKey` into per-id shards, then
 * delete the blob. Unreadable (CursorWindow) blobs are dropped. Idempotent.
 */
export async function migrateMonolithToShards(baseKey: string): Promise<void> {
  if (migratedShardBases.has(baseKey)) return;
  await withKeyLock(baseKey, async () => {
    if (migratedShardBases.has(baseKey)) return;
    if (unreadableKeys.has(baseKey)) {
      await dropUnreadableKey(baseKey);
      migratedShardBases.add(baseKey);
      return;
    }
    let raw: string | null;
    try {
      raw = await AsyncStorage.getItem(baseKey);
    } catch (error) {
      captureAppException(error, {
        tags: { area: "async-storage", key: baseKey, phase: "getItem" },
      });
      if (isOversizedRowError(error)) {
        await dropUnreadableKey(baseKey);
      }
      migratedShardBases.add(baseKey);
      return;
    }
    if (raw == null) {
      migratedShardBases.add(baseKey);
      return;
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
          // The monolith just loaded, so each entry already fits CursorWindow.
          // `writeJSONIfSafe` is for *new* writes; using it here would skip a
          // 1.2 MB hadith book then delete the only readable copy.
          await writeJSON(storageShardKey(baseKey, id), value);
        }
      }
      await AsyncStorage.removeItem(baseKey);
    } catch (error) {
      captureAppException(error, {
        tags: { area: "async-storage", key: baseKey, phase: "migrate" },
      });
      await dropUnreadableKey(baseKey);
    }
    migratedShardBases.add(baseKey);
  });
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
