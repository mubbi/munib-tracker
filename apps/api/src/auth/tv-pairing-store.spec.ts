import { afterEach, describe, expect, it, vi } from "vitest";
import { getRedisClient } from "../redis/redisClient";
import { buildFakeRedis, type FakeRedis } from "../test-support/redis";
import {
  deleteTvPairing,
  formatTvPairingCode,
  generateTvPairingCode,
  loadTvPairing,
  normalizeTvPairingCode,
  resetTvPairingMemory,
  saveTvPairing,
  TV_PAIRING_TTL_MS,
} from "./tv-pairing-store";

vi.mock("../redis/redisClient", () => ({ getRedisClient: vi.fn() }));

const PENDING = { status: "pending" as const, createdAt: 5 };

/** Memory-only store by default; pass a fake client to mirror records to Redis. */
function setup(redis: FakeRedis | null = null): void {
  resetTvPairingMemory();
  vi.mocked(getRedisClient).mockReturnValue(redis as never);
}

describe("tv-pairing-store", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("codes", () => {
    it("generates unambiguous 8-character codes", () => {
      const code = generateTvPairingCode();
      expect(code).toMatch(/^[A-HJ-NP-Z2-9]{8}$/);
    });

    it.each([
      ["ab-cd 12-34", "ABCD1234"],
      [" xy_z ", "XYZ"],
    ])("normalizes %j to %j", (raw, normalized) => {
      expect(normalizeTvPairingCode(raw)).toBe(normalized);
    });

    it.each([
      ["abcd1234", "ABCD-1234"],
      ["ab-c", "ABC"],
    ])("formats %j as %j", (raw, formatted) => {
      expect(formatTvPairingCode(raw)).toBe(formatted);
    });
  });

  describe("memory store", () => {
    it("round-trips a record by normalized code", async () => {
      setup();
      await saveTvPairing("ABCD2345", PENDING);
      await expect(loadTvPairing("abcd-2345")).resolves.toEqual(PENDING);
    });

    it("forgets a deleted record", async () => {
      setup();
      await saveTvPairing("ABCD2345", PENDING);
      await deleteTvPairing("ABCD2345");
      await expect(loadTvPairing("ABCD2345")).resolves.toBeNull();
    });

    it("returns null for a blank code", async () => {
      setup();
      await expect(loadTvPairing(" -- ")).resolves.toBeNull();
    });

    it("keeps records for ten minutes by default", () => {
      expect(TV_PAIRING_TTL_MS).toBe(10 * 60 * 1000);
    });

    it("expires a record whose TTL lapses between prune and read", async () => {
      setup();
      const now = vi.spyOn(Date, "now").mockReturnValue(1_000_000);
      await saveTvPairing("OLDC2345", PENDING, 1_000);
      now.mockReturnValueOnce(1_000_500).mockReturnValueOnce(1_002_000);
      await expect(loadTvPairing("OLDC2345")).resolves.toBeNull();
    });

    it("prunes stale records on the next save", async () => {
      setup();
      const now = vi.spyOn(Date, "now").mockReturnValue(1_000_000);
      await saveTvPairing("STAL2345", PENDING, 10);
      now.mockReturnValue(2_000_000);
      await saveTvPairing("NEWC2345", PENDING);
      await expect(loadTvPairing("STAL2345")).resolves.toBeNull();
    });
  });

  describe("Redis mirror", () => {
    it("writes records under a namespaced key with a TTL in seconds", async () => {
      const redis = buildFakeRedis();
      setup(redis);
      await saveTvPairing("ABCD2345", PENDING, 1_500);
      expect(redis.set).toHaveBeenCalledWith(
        expect.stringMatching(/^mt:.+:tv-pair:ABCD2345$/),
        JSON.stringify(PENDING),
        { EX: 2 },
      );
    });

    it("never writes a TTL below one second", async () => {
      const redis = buildFakeRedis();
      setup(redis);
      await saveTvPairing("ABCD2345", PENDING, 1);
      expect(redis.set).toHaveBeenCalledWith(expect.any(String), expect.any(String), { EX: 1 });
    });

    it("prefers the Redis copy on read", async () => {
      setup(
        buildFakeRedis({
          get: vi.fn().mockResolvedValue(JSON.stringify({ ...PENDING, createdAt: 99 })),
        }),
      );
      await expect(loadTvPairing("abcd-2345")).resolves.toEqual({ ...PENDING, createdAt: 99 });
    });

    it("deletes the namespaced Redis key", async () => {
      const redis = buildFakeRedis();
      setup(redis);
      await deleteTvPairing("abcd-2345");
      expect(redis.del).toHaveBeenCalledWith(expect.stringMatching(/:tv-pair:ABCD2345$/));
    });

    it.each([
      ["misses", { get: vi.fn().mockResolvedValue("") }],
      ["fails reads", { get: vi.fn().mockRejectedValue(new Error("down")) }],
      ["fails writes", { set: vi.fn().mockRejectedValue(new Error("down")) }],
    ])("falls back to memory when Redis %s", async (_label, overrides) => {
      setup(buildFakeRedis(overrides));
      await saveTvPairing("MEMO2345", PENDING);
      await expect(loadTvPairing("MEMO2345")).resolves.toEqual(PENDING);
    });

    it("still forgets the record when the Redis delete fails", async () => {
      setup(buildFakeRedis({ del: vi.fn().mockRejectedValue(new Error("down")) }));
      await saveTvPairing("MEMO2345", PENDING);
      await deleteTvPairing("MEMO2345");
      await expect(loadTvPairing("MEMO2345")).resolves.toBeNull();
    });

    it("skips a client that is not open", async () => {
      const redis = buildFakeRedis({ isOpen: false });
      setup(redis);
      await saveTvPairing("SHUT2345", PENDING);
      await loadTvPairing("SHUT2345");
      await deleteTvPairing("SHUT2345");
      expect(redis.set).not.toHaveBeenCalled();
      expect(redis.get).not.toHaveBeenCalled();
      expect(redis.del).not.toHaveBeenCalled();
    });
  });
});
