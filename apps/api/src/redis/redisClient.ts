/**
 * Optional Redis connection for rate limiting, cron locks, and JSON caches.
 * When REDIS_URL is unset, all callers treat Redis as disabled (graceful degrade).
 */

import { Logger } from "@nestjs/common";
import { createClient, type RedisClientType } from "redis";

const logger = new Logger("Redis");

let client: RedisClientType | null = null;
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
export function getRedisClient(): RedisClientType | null {
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
    try {
      const url = process.env.REDIS_URL?.trim();
      if (!url) return;
      const c = createClient({ url });
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
      await c.connect();
      client = c;
      lastConnectedAtMs = Date.now();
      logRedisTelemetry("connected");
    } catch (err) {
      lastErrorAtMs = Date.now();
      client = null;
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
