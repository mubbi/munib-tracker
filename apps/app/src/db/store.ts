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
    const map = await this.getMap();
    map[id] = value;
    await writeJSON(this.storageKey, map);
    return value;
  }

  async remove(id: string): Promise<void> {
    const map = await this.getMap();
    if (id in map) {
      delete map[id];
      await writeJSON(this.storageKey, map);
    }
  }

  async clear(): Promise<void> {
    await removeKey(this.storageKey);
  }
}
