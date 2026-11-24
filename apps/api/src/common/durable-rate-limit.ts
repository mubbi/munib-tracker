/**
 * Fixed-window rate limiting with optional Redis (durable across instances)
 * and an in-memory fallback for local/dev when REDIS_URL is unset or Redis is down.
 */

import { HttpException, HttpStatus } from "@nestjs/common";
import { redisNamespace } from "../redis/cacheKeys";
import { getRedisClient } from "../redis/redisClient";

type Bucket = { count: number; resetAt: number };

const memoryBuckets = new Map<string, Bucket>();

/**
 * Sweep expired in-memory buckets once the map grows past this many keys. Keys
 * are per IP / user, so without a sweep a long-lived instance on the memory
 * fallback would keep every client it ever saw.
 */
export const MEMORY_SWEEP_THRESHOLD = 10_000;

export type RateLimitOptions = {
  /** Unique key, e.g. `content-report:user-123`. */
  key: string;
  limit: number;
  windowMs: number;
};

function sweepExpiredBuckets(now: number): void {
  for (const [key, bucket] of memoryBuckets) {
    if (now >= bucket.resetAt) memoryBuckets.delete(key);
  }
}

function memoryHit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (memoryBuckets.size >= MEMORY_SWEEP_THRESHOLD) sweepExpiredBuckets(now);
  const bucket = memoryBuckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  bucket.count += 1;
  return bucket.count > limit;
}

async function redisHit(key: string, limit: number, windowMs: number): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis?.isOpen) {
    throw new Error("Redis unavailable");
  }
  const ttlSeconds = Math.max(1, Math.ceil(windowMs / 1000));
  const namespaced = `${redisNamespace()}:rl:${key}`;
  const rawCount = await redis.incr(namespaced);
  const count = typeof rawCount === "number" ? rawCount : Number(rawCount);
  if (count === 1) {
    await redis.expire(namespaced, ttlSeconds);
    return count > limit;
  }
  const limited = count > limit;
  // INCR + EXPIRE are two round trips: if the instance died between them the
  // key has no TTL and would lock this identity out forever. Self-heal when a
  // caller is refused (cheap — only on the over-quota path).
  if (limited && (await redis.ttl(namespaced)) === -1) {
    await redis.expire(namespaced, ttlSeconds);
  }
  return limited;
}

/**
 * Returns `true` when the caller should be rate-limited (over quota).
 * Falls back to memory if Redis is unset or the Redis call fails.
 */
export async function isRateLimited(options: RateLimitOptions): Promise<boolean> {
  const { key, limit, windowMs } = options;
  if (!getRedisClient()?.isOpen) {
    return memoryHit(key, limit, windowMs);
  }
  try {
    return await redisHit(key, limit, windowMs);
  } catch {
    // Fail open to memory so a Redis outage does not block all requests.
    return memoryHit(key, limit, windowMs);
  }
}

/**
 * Throws `429 Too Many Requests` with `message` when the caller is over quota.
 * Use from services so every limiter answers the same way.
 */
export async function assertWithinRateLimit(
  options: RateLimitOptions,
  message = "Too many attempts",
): Promise<void> {
  if (await isRateLimited(options)) {
    throw new HttpException(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}

/** Test helper — clears in-memory buckets between suites. */
export function resetMemoryRateLimits(): void {
  memoryBuckets.clear();
}
