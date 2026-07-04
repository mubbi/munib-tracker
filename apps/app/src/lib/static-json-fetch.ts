import { Platform } from "react-native";

/**
 * In-memory cache for immutable CDN JSON (Qur'an editions, hadith corpora).
 * Scripture data never changes — once fetched in-process, skip the network.
 */

const memory = new Map<string, unknown>();

/** @internal Test helper — reset the in-memory JSON cache. */
export function clearStaticJsonCache(): void {
  memory.clear();
}

/**
 * Fetch JSON from a static CDN URL. Returns a cached value when this process
 * has already fetched the same URL. On web, also asks the browser HTTP cache
 * to reuse prior responses (`cache: "force-cache"`).
 */
export async function fetchStaticJson<T>(url: string): Promise<T> {
  const hit = memory.get(url);
  if (hit !== undefined) return hit as T;

  const init: RequestInit = Platform.OS === "web" ? { cache: "force-cache" } : {};

  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);

  const data = (await res.json()) as T;
  memory.set(url, data);
  return data;
}
