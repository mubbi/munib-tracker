import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Persisted recent search queries for the universal search screen. Kept as a
 * tiny, self-contained AsyncStorage helper (no global store needed — only the
 * search screen reads it) with a most-recent-first, de-duplicated, capped list.
 */

const STORAGE_KEY = "search:recent:v1";
const MAX_ENTRIES = 8;

export async function loadRecentSearches(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry): entry is string => typeof entry === "string")
      .slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

/** Add a query to the front (case-insensitive de-dupe) and return the new list. */
export async function pushRecentSearch(query: string): Promise<string[]> {
  const trimmed = query.trim();
  if (!trimmed) return loadRecentSearches();
  const existing = await loadRecentSearches();
  const lower = trimmed.toLowerCase();
  const next = [trimmed, ...existing.filter((entry) => entry.toLowerCase() !== lower)].slice(
    0,
    MAX_ENTRIES,
  );
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // best-effort persistence; the in-memory list is still returned
  }
  return next;
}

export async function clearRecentSearches(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
