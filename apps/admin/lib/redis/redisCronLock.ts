/**
 * Optional Redis connection for admin cron leader locks.
 * When REDIS_URL is unset, locks are skipped (fail-open — every instance may run).
 *
 * Same URL rules as the API: keep the console scheme (`redis://` or `rediss://`).
 * Optional `REDIS_TLS=true|false` overrides the scheme.
 */

import {
  normalizeRedisUrl,
  parseRedisTlsEnvFlag,
} from "@munib-tracker/shared/utils/normalize-redis-url";
import { createClient, type RedisClientType } from "redis";

const REDIS_CONNECT_TIMEOUT_MS = 10_000;

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
    let c: RedisClientType | null = null;
    try {
      const url = process.env.REDIS_URL?.trim();
      if (!url) return;
      const forceTls = parseRedisTlsEnvFlag(process.env.REDIS_TLS);
      c = createClient({
        url: normalizeRedisUrl(url, { forceTls }),
        socket: {
          connectTimeout: REDIS_CONNECT_TIMEOUT_MS,
          reconnectStrategy: false,
        },
      });
      c.on("error", () => {
        /* callers treat Redis as unavailable */
      });
      await Promise.race([
        c.connect(),
        new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error(`Redis connect timed out after ${REDIS_CONNECT_TIMEOUT_MS}ms`));
          }, REDIS_CONNECT_TIMEOUT_MS + 500);
        }),
      ]);
      client = c;
    } catch {
      if (c) {
        try {
          c.removeAllListeners();
          await c.disconnect().catch(() => undefined);
        } catch {
          // ignore
        }
      }
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
