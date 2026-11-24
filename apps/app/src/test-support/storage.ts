import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * AsyncStorage keys at or under `prefix` (a `DB_KEYS` root). Use it to assert a
 * cache wrote — or, with a "save locally" toggle off, did NOT write — to disk.
 *
 *   expect(await storedKeysUnder(DB_KEYS.quranEditionCache)).toEqual([]);
 */
export async function storedKeysUnder(prefix: string): Promise<string[]> {
  const keys = await AsyncStorage.getAllKeys();
  return keys.filter((k) => k === prefix || k.startsWith(`${prefix}/`));
}
