/**
 * Optional Redis connection for rate limiting, cron locks, and JSON caches.
 * When REDIS_URL is unset, all callers treat Redis as disabled (graceful degrade).
 *
 * Redis Cloud (`*.db.redis.io`): use the scheme from the console —
 * `redis://` when TLS is off, `rediss://` when TLS is on. Optional `REDIS_TLS=true|false`
 * overrides the scheme. Never assume TLS; forcing it against a plaintext endpoint
 * times out with SSL "wrong version number".
 */

import {
  normalizeRedisUrl,
  parseRedisTlsEnvFlag,
} from "@munib-tracker/shared/utils/normalize-redis-url";
import { Logger } from "@nestjs/common";
import { createClient } from "redis";

const logger = new Logger("Redis");

/** Fail fast on unreachable Redis so Vercel cold starts never hang for minutes. */
const REDIS_CONNECT_TIMEOUT_MS = 10_000;

/** RESP2 keeps GET/INCR as string|null / number (avoids RESP3 `string | {}` under Vercel tsc). */
function createAppRedisClient(url: string) {
  const forceTls = parseRedisTlsEnvFlag(process.env.REDIS_TLS);
  const normalized = normalizeRedisUrl(url, { forceTls });
  if (normalized !== url.trim()) {
    logger.log(
      `[Redis] REDIS_TLS=${String(forceTls)} adjusted URL scheme → ${
        normalized.startsWith("rediss:") ? "rediss" : "redis"
      }`,
    );
  }
  return createClient({
    url: normalized,
    RESP: 2,
    socket: {
      connectTimeout: REDIS_CONNECT_TIMEOUT_MS,
      // Serverless: fail fast on first connect; getRedisClient() retries later.
      reconnectStrategy: false,
    },
  });
}

type AppRedisClient = ReturnType<typeof createAppRedisClient>;

let client: AppRedisClient | null = null;
let connectInFlight: Promise<void> | null = null;
let lastConnectAttemptAtMs = 0;
let lastConnectedAtMs = 0;
let lastErrorAtMs = 0;
let connectAttempts = 0;
const REDIS_RETRY_COOLDOWN_MS = 10_000;

/** Snapshot for /health and structured logs (no secrets). */
export interface RedisHealthSnapshot {
  configured: boolean;
  connected: boolean;
  connectAttempts: number;
  lastConnectAttemptAt: string | null;
  lastConnectAttemptAgeMs: number | null;
  lastConnectedAt: string | null;
  lastErrorAt: string | null;
}

function isoOrNull(epochMs: number): string | null {
  return epochMs > 0 ? new Date(epochMs).toISOString() : null;
}

export function getRedisHealth(): RedisHealthSnapshot {
  const configured = isRedisConfigured();
  const connected = !!client?.isOpen;
  const now = Date.now();
  return {
    configured,
    connected,
    connectAttempts,
    lastConnectAttemptAt: isoOrNull(lastConnectAttemptAtMs),
    lastConnectAttemptAgeMs:
      lastConnectAttemptAtMs > 0 ? Math.max(0, now - lastConnectAttemptAtMs) : null,
    lastConnectedAt: isoOrNull(lastConnectedAtMs),
    lastErrorAt: isoOrNull(lastErrorAtMs),
  };
}

function logRedisTelemetry(event: "connected" | "disconnected"): void {
  logger.log(`[Redis] ${event} ${JSON.stringify(getRedisHealth())}`);
}

export function isRedisConfigured(): boolean {
  const url = process.env.REDIS_URL?.trim();
  return typeof url === "string" && url.length > 0;
}

/** Connected client, or null if Redis disabled or connection failed. */
export function getRedisClient(): AppRedisClient | null {
  // Best-effort background reconnect so callers can eventually leverage Redis
  // after transient startup/network failures without requiring process restart.
  const now = Date.now();
  if (
    process.env.NODE_ENV !== "test" &&
    isRedisConfigured() &&
    !client?.isOpen &&
    now - lastConnectAttemptAtMs >= REDIS_RETRY_COOLDOWN_MS
  ) {
    void connectRedisIfConfigured();
  }
  return client;
}

/**
 * Connect if REDIS_URL is set. Safe to call multiple times. Does not throw —
 * logs and leaves Redis disabled on failure (API keeps running).
 */
export async function connectRedisIfConfigured(): Promise<void> {
  if (process.env.NODE_ENV === "test") {
    return;
  }
  if (!isRedisConfigured()) {
    return;
  }
  if (client?.isOpen) {
    return;
  }
  if (connectInFlight) {
    return connectInFlight;
  }
  lastConnectAttemptAtMs = Date.now();
  connectAttempts += 1;
  connectInFlight = (async () => {
    let c: AppRedisClient | null = null;
    try {
      const url = process.env.REDIS_URL?.trim();
      if (!url) return;
      c = createAppRedisClient(url);
      c.on("error", (err) => {
        lastErrorAtMs = Date.now();
        logger.error(`[Redis] client error: ${err instanceof Error ? err.message : String(err)}`);
      });
      c.on("end", () => {
        if (client === c) {
          client = null;
        }
        logRedisTelemetry("disconnected");
      });
      // Belt-and-suspenders: node-redis socket timeout + hard Promise race so a
      // misconfigured REDIS_URL cannot stall Nest boot on Vercel (504 @ 300s).
      await Promise.race([
        c.connect(),
        new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error(`Redis connect timed out after ${REDIS_CONNECT_TIMEOUT_MS}ms`));
          }, REDIS_CONNECT_TIMEOUT_MS + 500);
        }),
      ]);
      client = c;
      lastConnectedAtMs = Date.now();
      logRedisTelemetry("connected");
    } catch (err) {
      lastErrorAtMs = Date.now();
      client = null;
      if (c) {
        try {
          c.removeAllListeners();
          await c.disconnect().catch(() => undefined);
        } catch {
          // Ignore cleanup errors after a failed connect.
        }
      }
      logger.error(
        `[Redis] failed to connect — continuing without Redis: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    } finally {
      connectInFlight = null;
    }
  })();
  return connectInFlight;
}

export async function closeRedis(): Promise<void> {
  if (!client?.isOpen) {
    client = null;
    return;
  }
  try {
    await client.quit();
    logger.log("[Redis] connection closed");
  } catch (err) {
    logger.error(`[Redis] quit failed: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    client = null;
  }
}
