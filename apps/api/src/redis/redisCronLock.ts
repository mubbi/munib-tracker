import { redisNamespace } from "./cacheKeys";
import { getRedisClient } from "./redisClient";

/**
 * Try to acquire an exclusive lock for a cron job window.
 * Returns true if this instance should run the job (lock acquired or Redis unavailable).
 * Returns false if another instance holds the lock for this bucket.
 */
export async function tryAcquireCronLock(
  jobName: string,
  timeBucket: string,
  ttlMs: number,
): Promise<boolean> {
  const redis = getRedisClient();
  if (!redis?.isOpen) {
    return true;
  }
  const key = `${redisNamespace()}:cron:lock:${jobName}:${timeBucket}`;
  try {
    const ok = await redis.set(key, "1", { PX: ttlMs, NX: true });
    return ok === "OK";
  } catch {
    return true;
  }
}
