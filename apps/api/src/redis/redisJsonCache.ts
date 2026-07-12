import { redisNamespace } from "./cacheKeys";
import { getRedisClient } from "./redisClient";

export async function cacheGetJson<T>(key: string): Promise<T | null> {
  const redis = getRedisClient();
  if (!redis?.isOpen) return null;
  try {
    const raw = await redis.get(key);
    if (raw == null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function cacheSetJson(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  const redis = getRedisClient();
  if (!redis?.isOpen || ttlSeconds <= 0) return;
  try {
    await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch {
    /* ignore cache write failures */
  }
}

export async function cacheDel(...keys: string[]): Promise<void> {
  const redis = getRedisClient();
  if (!redis?.isOpen || keys.length === 0) return;
  try {
    await redis.del(keys);
  } catch {
    /* ignore */
  }
}

/** Delete all keys matching a glob pattern. */
export async function cacheDelPattern(matchPattern: string): Promise<void> {
  const redis = getRedisClient();
  if (!redis?.isOpen) return;
  try {
    for await (const batch of redis.scanIterator({ MATCH: matchPattern, COUNT: 128 })) {
      if (batch.length > 0) await redis.del(batch);
    }
  } catch {
    /* ignore */
  }
}

/** Per-platform version requirements from DB (not per client version). */
export function appVersionPlatformConfigKey(platform: string): string {
  return `${redisNamespace()}:app_ver:cfg:${platform}`;
}

export async function invalidateAppVersionCache(platform?: string): Promise<void> {
  if (platform) {
    await cacheDel(appVersionPlatformConfigKey(platform));
    return;
  }
  await cacheDelPattern(`${redisNamespace()}:app_ver:*`);
}

export function authMeKey(userId: string): string {
  return `${redisNamespace()}:auth:me:${userId}`;
}

export function userActiveKey(userId: string): string {
  return `${redisNamespace()}:user:active:${userId}`;
}
