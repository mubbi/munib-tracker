import { redisNamespace } from "../redis/cacheKeys";
import { getRedisClient } from "../redis/redisClient";
import { cacheGetJson, cacheSetJson } from "../redis/redisJsonCache";

/**
 * Per-cell / per-element cache for the masjids proxy (NF-3.11). Redis when
 * configured (durable, shared across instances), with a small in-memory
 * fallback so local/dev and Redis outages still avoid hammering Overpass.
 * Entries are kept for {@link STALE_MAX_MS} and are "fresh" for {@link FRESH_TTL_MS}.
 */

export const FRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const STALE_MAX_MS = 30 * 24 * 60 * 60 * 1000;
const MEMORY_MAX_ENTRIES = 500;
const LOCK_TTL_MS = 30_000;

export interface CachedEntry<T> {
  /** ISO time the upstream data was fetched. */
  fetchedAt: string;
  value: T;
}

const memory = new Map<string, CachedEntry<unknown>>();

export function masjidCellKey(cell: string): string {
  return `${redisNamespace()}:masjids:cell:v1:${cell}`;
}

export function masjidElementKey(osmType: string, osmId: string): string {
  return `${redisNamespace()}:masjids:el:v1:${osmType}:${osmId}`;
}

export function entryAgeMs(entry: CachedEntry<unknown>, now = Date.now()): number {
  const at = Date.parse(entry.fetchedAt);
  return Number.isFinite(at) ? now - at : Number.POSITIVE_INFINITY;
}

export function isFresh(entry: CachedEntry<unknown> | null, now = Date.now()): boolean {
  return !!entry && entryAgeMs(entry, now) < FRESH_TTL_MS;
}

export function isUsableStale(entry: CachedEntry<unknown> | null, now = Date.now()): boolean {
  return !!entry && entryAgeMs(entry, now) < STALE_MAX_MS;
}

export async function readEntry<T>(key: string): Promise<CachedEntry<T> | null> {
  const fromRedis = await cacheGetJson<CachedEntry<T>>(key);
  if (fromRedis && typeof fromRedis.fetchedAt === "string") return fromRedis;
  return (memory.get(key) as CachedEntry<T> | undefined) ?? null;
}

export async function writeEntry<T>(key: string, value: T, now = Date.now()): Promise<void> {
  const entry: CachedEntry<T> = { fetchedAt: new Date(now).toISOString(), value };
  if (memory.size >= MEMORY_MAX_ENTRIES && !memory.has(key)) {
    const oldest = memory.keys().next().value;
    if (oldest !== undefined) memory.delete(oldest);
  }
  memory.set(key, entry);
  await cacheSetJson(key, entry, Math.ceil(STALE_MAX_MS / 1000));
}

/**
 * Cross-instance cold-miss lock. Returns true when this instance should fetch
 * (lock acquired, or Redis unavailable — in-process de-duplication still applies).
 */
export async function tryLock(key: string): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis?.isOpen) return true;
  try {
    const ok = await redis.set(`${key}:lock`, "1", { PX: LOCK_TTL_MS, NX: true });
    return ok === "OK";
  } catch {
    return true;
  }
}

export async function unlock(key: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis?.isOpen) return;
  try {
    await redis.del(`${key}:lock`);
  } catch {
    /* lock expires on its own */
  }
}

// ── Known refs (M10) ────────────────────────────────────────────────────────
// Every masjid a cached cell listed. A detail lookup for a ref on this list is
// already known to be a masjid; any other id is "unverified" and is charged to
// a much smaller upstream budget, so random ids can't drain Overpass.

const KNOWN_MEMORY_MAX = 20_000;
const knownMemory = new Map<string, number>();

export function masjidKnownRefKey(osmType: string, osmId: string): string {
  return `${redisNamespace()}:masjids:known:v1:${osmType}:${osmId}`;
}

/** Records the refs a fetched cell listed (kept as long as stale cell data is). */
export async function rememberMasjidRefs(
  refs: ReadonlyArray<{ osmType: string; osmId: string }>,
  now = Date.now(),
): Promise<void> {
  const expiresAt = now + STALE_MAX_MS;
  for (const ref of refs) {
    const key = masjidKnownRefKey(ref.osmType, ref.osmId);
    knownMemory.delete(key);
    knownMemory.set(key, expiresAt);
  }
  while (knownMemory.size > KNOWN_MEMORY_MAX) {
    const oldest = knownMemory.keys().next().value;
    if (oldest === undefined) break;
    knownMemory.delete(oldest);
  }
  const redis = getRedisClient();
  if (!redis?.isOpen) return;
  const ttl = Math.ceil(STALE_MAX_MS / 1000);
  try {
    await Promise.all(
      refs.map((ref) => redis.set(masjidKnownRefKey(ref.osmType, ref.osmId), "1", { EX: ttl })),
    );
  } catch {
    /* memory copy still answers on this instance */
  }
}

/** True when a cached cell listed this ref within the last {@link STALE_MAX_MS}. */
export async function isKnownMasjidRef(
  osmType: string,
  osmId: string,
  now = Date.now(),
): Promise<boolean> {
  const key = masjidKnownRefKey(osmType, osmId);
  const expiresAt = knownMemory.get(key);
  if (expiresAt != null && expiresAt > now) return true;
  const redis = getRedisClient();
  if (!redis?.isOpen) return false;
  try {
    return (await redis.get(key)) != null;
  } catch {
    return false;
  }
}

/** Test helper. */
export function resetMasjidMemoryCache(): void {
  memory.clear();
  knownMemory.clear();
}
