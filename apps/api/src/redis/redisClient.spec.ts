import { Logger } from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from "vitest";

const createClient = vi.fn();

vi.mock("redis", () => ({
  createClient: (...args: unknown[]) => createClient(...args),
}));

const REDIS_URL = "redis://cache.example:6379";
const T0 = "2026-01-01T00:00:00.000Z";

/** Stand-in for the node-redis client returned by `createClient()`. */
type NodeRedisDouble = {
  isOpen: boolean;
  handlers: Record<string, (...args: unknown[]) => void>;
  on: Mock;
  connect: Mock;
  quit: Mock;
  destroy: Mock;
  removeAllListeners: Mock;
};

function buildNodeRedisClient(connect?: () => Promise<unknown>): NodeRedisDouble {
  const client: NodeRedisDouble = {
    isOpen: false,
    handlers: {},
    on: vi.fn((event: string, handler: (...args: unknown[]) => void) => {
      client.handlers[event] = handler;
    }),
    connect: vi.fn(async () => {
      if (connect) return connect();
      client.isOpen = true;
    }),
    quit: vi.fn(async () => {
      client.isOpen = false;
    }),
    destroy: vi.fn(),
    removeAllListeners: vi.fn(),
  };
  return client;
}

const failingClient = (error: unknown = new Error("ECONNREFUSED")) =>
  buildNodeRedisClient(async () => {
    throw error;
  });

type SetupOptions = {
  env?: Record<string, string | undefined>;
  clients?: NodeRedisDouble[];
};

/** Fresh module state per test: env, queued `createClient` results, then a dynamic import. */
async function setup({ env = {}, clients = [] }: SetupOptions = {}) {
  const merged = { NODE_ENV: "production", REDIS_URL, REDIS_TLS: undefined, ...env };
  for (const [key, value] of Object.entries(merged)) vi.stubEnv(key, value);
  for (const client of clients) createClient.mockReturnValueOnce(client);
  vi.resetModules();
  const redis = await import("./redisClient.js");
  /** Reads the module's client without triggering the background reconnect. */
  const currentClient = () => {
    vi.stubEnv("NODE_ENV", "test");
    const client = redis.getRedisClient();
    vi.stubEnv("NODE_ENV", merged.NODE_ENV);
    return client;
  };
  return { redis, currentClient };
}

describe("redisClient", () => {
  beforeEach(() => {
    createClient.mockReset();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(T0));
    vi.spyOn(Logger.prototype, "log").mockImplementation(() => undefined);
    vi.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("isRedisConfigured", () => {
    it.each([
      [undefined, false],
      ["   ", false],
      [REDIS_URL, true],
    ])("REDIS_URL=%j → %s", async (url, expected) => {
      const { redis } = await setup({ env: { REDIS_URL: url } });
      expect(redis.isRedisConfigured()).toBe(expected);
    });
  });

  describe("getRedisHealth", () => {
    it("reports an empty snapshot before any connection attempt", async () => {
      const { redis } = await setup({ env: { REDIS_URL: undefined } });
      expect(redis.getRedisHealth()).toEqual({
        configured: false,
        connected: false,
        connectAttempts: 0,
        lastConnectAttemptAt: null,
        lastConnectAttemptAgeMs: null,
        lastConnectedAt: null,
        lastErrorAt: null,
      });
    });

    it("reports telemetry after a successful connect", async () => {
      const { redis } = await setup({ clients: [buildNodeRedisClient()] });
      await redis.connectRedisIfConfigured();
      vi.setSystemTime(new Date("2026-01-01T00:00:05.000Z"));

      expect(redis.getRedisHealth()).toEqual({
        configured: true,
        connected: true,
        connectAttempts: 1,
        lastConnectAttemptAt: T0,
        lastConnectAttemptAgeMs: 5_000,
        lastConnectedAt: T0,
        lastErrorAt: null,
      });
    });
  });

  describe("connectRedisIfConfigured", () => {
    it.each([
      ["NODE_ENV=test", { NODE_ENV: "test" }],
      ["REDIS_URL unset", { REDIS_URL: undefined }],
    ])("is a no-op when %s", async (_label, env) => {
      const { redis, currentClient } = await setup({ env });
      await redis.connectRedisIfConfigured();
      expect(createClient).not.toHaveBeenCalled();
      expect(currentClient()).toBeNull();
    });

    it("creates a RESP2 client with fail-fast socket options from the trimmed URL", async () => {
      const { redis } = await setup({
        env: { REDIS_URL: ` ${REDIS_URL} ` },
        clients: [buildNodeRedisClient()],
      });
      await redis.connectRedisIfConfigured();
      expect(createClient).toHaveBeenCalledWith({
        url: REDIS_URL,
        RESP: 2,
        socket: { connectTimeout: 10_000, reconnectStrategy: false },
      });
    });

    it("exposes the connected client", async () => {
      const client = buildNodeRedisClient();
      const { redis, currentClient } = await setup({ clients: [client] });
      await redis.connectRedisIfConfigured();
      expect(currentClient()).toBe(client);
    });

    it("does not reconnect while the client is open", async () => {
      const { redis } = await setup({ clients: [buildNodeRedisClient()] });
      await redis.connectRedisIfConfigured();
      await redis.connectRedisIfConfigured();
      expect(createClient).toHaveBeenCalledTimes(1);
    });

    it("shares one in-flight connect between concurrent callers", async () => {
      let release: () => void = () => undefined;
      const client = buildNodeRedisClient(
        () =>
          new Promise<void>((resolve) => {
            release = () => {
              client.isOpen = true;
              resolve();
            };
          }),
      );
      const { redis } = await setup({ clients: [client] });

      const first = redis.connectRedisIfConfigured();
      const second = redis.connectRedisIfConfigured();
      release();
      await Promise.all([first, second]);

      expect(createClient).toHaveBeenCalledTimes(1);
    });

    it.each([
      ["true", REDIS_URL, "rediss://cache.example:6379", "rediss"],
      ["false", "rediss://cache.example:6379", REDIS_URL, "redis"],
    ])("REDIS_TLS=%s rewrites the scheme and logs it", async (tls, url, expectedUrl, scheme) => {
      const { redis } = await setup({
        env: { REDIS_TLS: tls, REDIS_URL: url },
        clients: [buildNodeRedisClient()],
      });
      await redis.connectRedisIfConfigured();
      expect(createClient.mock.calls[0]?.[0]).toMatchObject({ url: expectedUrl });
      expect(Logger.prototype.log).toHaveBeenCalledWith(
        expect.stringContaining(`adjusted URL scheme → ${scheme}`),
      );
    });

    it.each([
      [new Error("socket reset"), "socket reset"],
      ["plain failure", "plain failure"],
    ])("logs client error events (%s) and records the time", async (error, message) => {
      const client = buildNodeRedisClient();
      const { redis } = await setup({ clients: [client] });
      await redis.connectRedisIfConfigured();

      client.handlers.error?.(error);

      expect(Logger.prototype.error).toHaveBeenCalledWith(`[Redis] client error: ${message}`);
      expect(redis.getRedisHealth().lastErrorAt).toBe(T0);
    });

    it("drops the client when it emits end", async () => {
      const client = buildNodeRedisClient();
      const { redis, currentClient } = await setup({ clients: [client] });
      await redis.connectRedisIfConfigured();

      client.handlers.end?.();

      expect(currentClient()).toBeNull();
      expect(Logger.prototype.log).toHaveBeenCalledWith(
        expect.stringContaining("[Redis] disconnected"),
      );
    });

    it("ignores end events from a stale client", async () => {
      const stale = failingClient();
      const fresh = buildNodeRedisClient();
      const { redis, currentClient } = await setup({ clients: [stale, fresh] });
      await redis.connectRedisIfConfigured();
      await redis.connectRedisIfConfigured();

      stale.handlers.end?.();

      expect(currentClient()).toBe(fresh);
    });

    it("cleans up a client whose connect fails", async () => {
      const client = failingClient();
      const { redis } = await setup({ clients: [client] });
      await redis.connectRedisIfConfigured();
      expect(client.removeAllListeners).toHaveBeenCalled();
      expect(client.destroy).toHaveBeenCalled();
    });

    it.each([
      [new Error("ECONNREFUSED"), "ECONNREFUSED"],
      ["boom", "boom"],
    ])("logs connect failure %s and continues without Redis", async (error, message) => {
      const { redis } = await setup({ clients: [failingClient(error)] });
      await expect(redis.connectRedisIfConfigured()).resolves.toBeUndefined();
      expect(Logger.prototype.error).toHaveBeenCalledWith(
        `[Redis] failed to connect — continuing without Redis: ${message}`,
      );
      expect(redis.getRedisHealth()).toMatchObject({ connected: false, lastErrorAt: T0 });
    });

    it("swallows errors thrown while cleaning up a failed client", async () => {
      const client = failingClient();
      client.destroy.mockImplementation(() => {
        throw new Error("destroy failed");
      });
      const { redis } = await setup({ clients: [client] });
      await expect(redis.connectRedisIfConfigured()).resolves.toBeUndefined();
    });

    it("survives createClient throwing", async () => {
      createClient.mockImplementationOnce(() => {
        throw new Error("bad url");
      });
      const { redis, currentClient } = await setup();
      await expect(redis.connectRedisIfConfigured()).resolves.toBeUndefined();
      expect(currentClient()).toBeNull();
    });

    it("times out a connect that never settles", async () => {
      const client = buildNodeRedisClient(() => new Promise(() => undefined));
      const { redis } = await setup({ clients: [client] });

      const pending = redis.connectRedisIfConfigured();
      await vi.advanceTimersByTimeAsync(10_500);
      await pending;

      expect(Logger.prototype.error).toHaveBeenCalledWith(
        expect.stringContaining("Redis connect timed out after 10000ms"),
      );
    });
  });

  describe("getRedisClient", () => {
    async function setupDown() {
      createClient.mockImplementation(() => failingClient());
      return setup();
    }

    it("starts a background connect outside tests", async () => {
      const { redis } = await setupDown();
      expect(redis.getRedisClient()).toBeNull();
      await vi.advanceTimersByTimeAsync(0);
      expect(createClient).toHaveBeenCalledTimes(1);
    });

    it.each([
      [5_000, 1],
      [11_000, 2],
    ])("after %ims the reconnect count is %i (10s cooldown)", async (elapsedMs, attempts) => {
      const { redis } = await setupDown();
      redis.getRedisClient();
      await vi.advanceTimersByTimeAsync(0);

      vi.setSystemTime(new Date(Date.parse(T0) + elapsedMs));
      redis.getRedisClient();
      await vi.advanceTimersByTimeAsync(0);

      expect(createClient).toHaveBeenCalledTimes(attempts);
    });

    it("does not connect when Redis is not configured", async () => {
      const { redis } = await setup({ env: { REDIS_URL: undefined } });
      expect(redis.getRedisClient()).toBeNull();
      expect(createClient).not.toHaveBeenCalled();
    });
  });

  describe("closeRedis", () => {
    it("is a no-op when no client is open", async () => {
      const { redis, currentClient } = await setup();
      await redis.closeRedis();
      expect(currentClient()).toBeNull();
    });

    it("quits an open client and forgets it", async () => {
      const client = buildNodeRedisClient();
      const { redis, currentClient } = await setup({ clients: [client] });
      await redis.connectRedisIfConfigured();

      await redis.closeRedis();

      expect(client.quit).toHaveBeenCalled();
      expect(Logger.prototype.log).toHaveBeenCalledWith("[Redis] connection closed");
      expect(currentClient()).toBeNull();
    });

    it.each([
      [new Error("quit boom"), "quit boom"],
      ["raw", "raw"],
    ])("logs quit failure %s and still forgets the client", async (error, message) => {
      const client = buildNodeRedisClient();
      client.quit.mockRejectedValueOnce(error);
      const { redis, currentClient } = await setup({ clients: [client] });
      await redis.connectRedisIfConfigured();

      await redis.closeRedis();

      expect(Logger.prototype.error).toHaveBeenCalledWith(`[Redis] quit failed: ${message}`);
      expect(currentClient()).toBeNull();
    });
  });
});
