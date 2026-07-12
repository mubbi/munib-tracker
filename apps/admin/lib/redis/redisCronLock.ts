/**
 * Optional Redis connection for admin cron leader locks.
 * When REDIS_URL is unset, locks are skipped (fail-open — every instance may run).
 */

import { createClient, type RedisClientType } from "redis";

let client: RedisClientType | null = null;
let connectInFlight: Promise<void> | null = null;

function isRedisConfigured(): boolean {
  const url = process.env.REDIS_URL?.trim();
  return typeof url === "string" && url.length > 0;
}

function redisNamespace(): string {
  const segment = process.env.REDIS_KEY_PREFIX?.trim() || process.env.NODE_ENV || "development";
  return `mt:${segment}`;
}

async function getRedisClient(): Promise<RedisClientType | null> {
  if (!isRedisConfigured() || process.env.NODE_ENV === "test") return null;
  if (client?.isOpen) return client;
  if (connectInFlight) {
    await connectInFlight;
    return client?.isOpen ? client : null;
  }
  connectInFlight = (async () => {
    try {
      const url = process.env.REDIS_URL?.trim();
      if (!url) return;
      const c = createClient({ url });
      c.on("error", () => {
        /* callers treat Redis as unavailable */
      });
      await c.connect();
      client = c;
    } catch {
      client = null;
    } finally {
      connectInFlight = null;
    }
  })();
  await connectInFlight;
  return client?.isOpen ? client : null;
}

/**
 * Try to acquire an exclusive lock for a cron job window.
 * Returns true if this instance should run (lock acquired or Redis unavailable).
 */
export async function tryAcquireCronLock(
  jobName: string,
  timeBucket: string,
  ttlMs: number,
): Promise<boolean> {
  const redis = await getRedisClient();
  if (!redis?.isOpen) return true;
  const key = `${redisNamespace()}:cron:lock:${jobName}:${timeBucket}`;
  try {
    const ok = await redis.set(key, "1", { PX: ttlMs, NX: true });
    return ok === "OK";
  } catch {
    return true;
  }
}
