import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildFakeRedis } from "../test-support/redis";
import {
  entryAgeMs,
  FRESH_TTL_MS,
  isFresh,
  isKnownMasjidRef,
  isUsableStale,
  masjidCellKey,
  masjidKnownRefKey,
  readEntry,
  rememberMasjidRefs,
  resetMasjidMemoryCache,
  STALE_MAX_MS,
  tryLock,
  unlock,
  writeEntry,
} from "./masjids-cache";

const getRedisClient = vi.fn();
vi.mock("../redis/redisClient", () => ({
  getRedisClient: () => getRedisClient(),
}));

const NOW = Date.parse("2026-11-26T12:00:00Z");

describe("masjids cache", () => {
  beforeEach(() => {
    resetMasjidMemoryCache();
    getRedisClient.mockReturnValue(null);
  });
  afterEach(() => {
    getRedisClient.mockReset();
  });

  describe("freshness", () => {
    it("treats an unparseable fetch time as infinitely old", () => {
      const entry = { fetchedAt: "not a date", value: 1 };
      expect(entryAgeMs(entry, NOW)).toBe(Number.POSITIVE_INFINITY);
      expect(isFresh(entry, NOW)).toBe(false);
      expect(isUsableStale(entry, NOW)).toBe(false);
    });

    it("is fresh for 7 days and usable-stale for 30", () => {
      const at = (ageMs: number) => ({ fetchedAt: new Date(NOW - ageMs).toISOString(), value: 1 });
      expect(isFresh(at(FRESH_TTL_MS - 1), NOW)).toBe(true);
      expect(isFresh(at(FRESH_TTL_MS), NOW)).toBe(false);
      expect(isUsableStale(at(STALE_MAX_MS - 1), NOW)).toBe(true);
      expect(isUsableStale(at(STALE_MAX_MS), NOW)).toBe(false);
      expect(isFresh(null, NOW)).toBe(false);
    });
  });

  describe("entries without Redis (in-memory fallback)", () => {
    it("round-trips through memory and evicts the oldest entry past 500", async () => {
      await writeEntry(masjidCellKey("first"), { n: 0 }, NOW);
      for (let i = 1; i < 500; i += 1) await writeEntry(masjidCellKey(`c${i}`), { n: i }, NOW);
      expect(await readEntry(masjidCellKey("first"))).toMatchObject({ value: { n: 0 } });

      // Rewriting an existing key never evicts.
      await writeEntry(masjidCellKey("c1"), { n: 1 }, NOW);
      expect(await readEntry(masjidCellKey("first"))).not.toBeNull();

      await writeEntry(masjidCellKey("overflow"), { n: 500 }, NOW);
      expect(await readEntry(masjidCellKey("first"))).toBeNull();
      expect(await readEntry(masjidCellKey("overflow"))).toEqual({
        fetchedAt: new Date(NOW).toISOString(),
        value: { n: 500 },
      });
    });

    it("prefers a Redis copy, ignoring Redis values that aren't cache entries", async () => {
      const key = masjidCellKey("k");
      await writeEntry(key, "memory", NOW);
      const redis = buildFakeRedis();
      getRedisClient.mockReturnValue(redis);

      redis.get.mockResolvedValueOnce(JSON.stringify({ fetchedAt: "2026-01-01", value: "redis" }));
      expect((await readEntry(key))?.value).toBe("redis");
      redis.get.mockResolvedValueOnce(JSON.stringify({ value: "no timestamp" }));
      expect((await readEntry(key))?.value).toBe("memory");
    });
  });

  describe("cold-miss lock", () => {
    it("always fetches without an open Redis", async () => {
      expect(await tryLock("k")).toBe(true);
      getRedisClient.mockReturnValue(buildFakeRedis({ isOpen: false }));
      expect(await tryLock("k")).toBe(true);
      await expect(unlock("k")).resolves.toBeUndefined();
    });

    it("takes an NX lock with a TTL, and yields when another instance holds it", async () => {
      const redis = buildFakeRedis();
      getRedisClient.mockReturnValue(redis);
      expect(await tryLock("cell")).toBe(true);
      expect(redis.set).toHaveBeenCalledWith("cell:lock", "1", { PX: 30_000, NX: true });
      redis.set.mockResolvedValueOnce(null);
      expect(await tryLock("cell")).toBe(false);
      await unlock("cell");
      expect(redis.del).toHaveBeenCalledWith("cell:lock");
    });

    it("fails open when Redis errors (the lock expires on its own)", async () => {
      const redis = buildFakeRedis({
        set: vi.fn().mockRejectedValue(new Error("down")),
        del: vi.fn().mockRejectedValue(new Error("down")),
      });
      getRedisClient.mockReturnValue(redis);
      expect(await tryLock("cell")).toBe(true);
      await expect(unlock("cell")).resolves.toBeUndefined();
    });
  });

  describe("known masjid refs (M10)", () => {
    const ref = { osmType: "node", osmId: "42" };

    it("remembers listed refs in memory until they go stale", async () => {
      await rememberMasjidRefs([ref], NOW);
      expect(await isKnownMasjidRef("node", "42", NOW)).toBe(true);
      expect(await isKnownMasjidRef("node", "42", NOW + STALE_MAX_MS)).toBe(false);
      expect(await isKnownMasjidRef("way", "42", NOW)).toBe(false);
    });

    it("keeps at most 20,000 refs in memory, dropping the oldest", async () => {
      const refs = Array.from({ length: 20_001 }, (_, i) => ({ osmType: "node", osmId: `${i}` }));
      await rememberMasjidRefs(refs, NOW);
      expect(await isKnownMasjidRef("node", "0", NOW)).toBe(false);
      expect(await isKnownMasjidRef("node", "1", NOW)).toBe(true);
      expect(await isKnownMasjidRef("node", "20000", NOW)).toBe(true);
    });

    it("shares refs through Redis with the stale TTL, and degrades when Redis errors", async () => {
      const redis = buildFakeRedis();
      getRedisClient.mockReturnValue(redis);
      await rememberMasjidRefs([ref], NOW);
      expect(redis.set).toHaveBeenCalledWith(masjidKnownRefKey("node", "42"), "1", {
        EX: STALE_MAX_MS / 1000,
      });

      // Another instance's ref: only Redis knows it.
      redis.get.mockResolvedValueOnce("1");
      expect(await isKnownMasjidRef("way", "7", NOW)).toBe(true);
      redis.get.mockResolvedValueOnce(null);
      expect(await isKnownMasjidRef("way", "8", NOW)).toBe(false);
      redis.get.mockRejectedValueOnce(new Error("down"));
      expect(await isKnownMasjidRef("way", "9", NOW)).toBe(false);

      redis.set.mockRejectedValueOnce(new Error("down"));
      await expect(rememberMasjidRefs([{ osmType: "way", osmId: "1" }], NOW)).resolves.toBe(
        undefined,
      );
      // The memory copy still answers on this instance.
      expect(await isKnownMasjidRef("way", "1", NOW)).toBe(true);
    });
  });
});
