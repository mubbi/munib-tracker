import { NotFoundException, ServiceUnavailableException } from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildFakeRedis, type FakeRedis } from "../test-support/redis";
import { MasjidsService, OSM_ATTRIBUTION_LINES } from "./masjids.service";
import { FRESH_TTL_MS, masjidCellKey, resetMasjidMemoryCache, STALE_MAX_MS } from "./masjids-cache";
import {
  CLIENT_UPSTREAM_PER_MINUTE,
  resetMasjidRateLimits,
  UNVERIFIED_DETAIL_PER_CLIENT_DAY,
  UPSTREAM_PER_MINUTE,
} from "./masjids-rate-limit";
import type { OverpassClient } from "./overpass.client";
import type { TimetableSource } from "./timetable-source";

const getRedisClient = vi.fn();

vi.mock("../redis/redisClient", () => ({
  getRedisClient: () => getRedisClient(),
}));

/** Overpass fixture: one complete masjid, one bare way, one non-masjid. */
const OVERPASS_FIXTURE = {
  elements: [
    {
      type: "node",
      id: 1,
      lat: 51.5,
      lon: -0.12,
      tags: {
        amenity: "place_of_worship",
        religion: "muslim",
        name: "East Masjid",
        service_times: "Fr 13:00",
      },
    },
    { type: "way", id: 2, center: { lat: 51.51, lon: -0.11 }, tags: { building: "mosque" } },
    { type: "node", id: 3, lat: 51.5, lon: -0.1, tags: { amenity: "cafe" } },
  ],
};

function setup(options: { redis?: FakeRedis | null; sources?: TimetableSource[] } = {}) {
  const store = new Map<string, string>();
  const redis =
    options.redis === null
      ? null
      : (options.redis ??
        buildFakeRedis({
          get: vi.fn(async (key: string) => store.get(key) ?? null),
          set: vi.fn(async (key: string, value: string, opts?: { NX?: boolean }) => {
            if (opts?.NX && store.has(key)) return null;
            store.set(key, value);
            return "OK";
          }),
          del: vi.fn(async (keys: string | string[]) => {
            for (const k of Array.isArray(keys) ? keys : [keys]) store.delete(k);
            return 1;
          }),
          incr: vi.fn(async () => 1),
        }));
  getRedisClient.mockReturnValue(redis);
  const query = vi.fn().mockResolvedValue(OVERPASS_FIXTURE);
  const service = new MasjidsService({ query } as unknown as OverpassClient, options.sources ?? []);
  return { service, query, store, redis };
}

function seed(store: Map<string, string>, key: string, ageMs: number, value: unknown) {
  store.set(key, JSON.stringify({ fetchedAt: new Date(Date.now() - ageMs).toISOString(), value }));
}

describe("MasjidsService", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("REDIS_KEY_PREFIX", "spec");
    resetMasjidMemoryCache();
    resetMasjidRateLimits();
    getRedisClient.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("fetches a cold cell once and caches it per cell", async () => {
    const { service, query, store } = setup();
    const first = await service.list("gcpvj");
    expect(first.stale).toBe(false);
    expect(first.attribution).toEqual([...OSM_ATTRIBUTION_LINES]);
    expect(first.attribution[0]).toContain("OpenStreetMap contributors");
    expect(first.masjids.map((m) => m.osmId)).toEqual(["1", "2"]);
    expect(first.masjids[0]?.jumuah).toEqual(["13:00"]);
    expect(store.has(masjidCellKey("gcpvj"))).toBe(true);

    await service.list("gcpvj");
    expect(query).toHaveBeenCalledTimes(1);
    // A different cell is a different cache entry.
    await service.list("gcpvm");
    expect(query).toHaveBeenCalledTimes(2);
  });

  it("queries a bounding box (cell + neighbours), never a point", async () => {
    const { service, query } = setup();
    await service.list("gcpvj");
    const ql = String(query.mock.calls[0]?.[0]);
    expect(ql).toMatch(/\(-?\d+\.\d{6},-?\d+\.\d{6},-?\d+\.\d{6},-?\d+\.\d{6}\)/);
    expect(ql).not.toContain("around:");
  });

  it("de-duplicates concurrent cold misses for one cell", async () => {
    const { service, query } = setup();
    await Promise.all([service.list("gcpvj"), service.list("gcpvj"), service.list("gcpvj")]);
    expect(query).toHaveBeenCalledTimes(1);
  });

  it("serves fresh cache without calling Overpass", async () => {
    const { service, query, store } = setup();
    seed(store, masjidCellKey("gcpvj"), 1000, [{ osmType: "node", osmId: "9", lat: 1, lon: 1 }]);
    const result = await service.list("gcpvj");
    expect(query).not.toHaveBeenCalled();
    expect(result).toMatchObject({ stale: false, masjids: [{ osmId: "9" }] });
  });

  it("refreshes an expired entry", async () => {
    const { service, query, store } = setup();
    seed(store, masjidCellKey("gcpvj"), FRESH_TTL_MS + 1000, []);
    const result = await service.list("gcpvj");
    expect(query).toHaveBeenCalledTimes(1);
    expect(result.masjids).toHaveLength(2);
  });

  it("serves stale data (≤ 30 days) when Overpass fails", async () => {
    const { service, query, store } = setup();
    seed(store, masjidCellKey("gcpvj"), FRESH_TTL_MS + 1000, [
      { osmType: "node", osmId: "9", lat: 1, lon: 1 },
    ]);
    query.mockRejectedValueOnce(new Error("503"));
    const result = await service.list("gcpvj");
    expect(result).toMatchObject({ stale: true, masjids: [{ osmId: "9" }] });
  });

  it("returns an empty stale list when the cache is older than 30 days and Overpass fails", async () => {
    const { service, query, store } = setup();
    seed(store, masjidCellKey("gcpvj"), STALE_MAX_MS + 1000, [
      { osmType: "node", osmId: "9", lat: 1, lon: 1 },
    ]);
    query.mockRejectedValueOnce(new Error("timeout"));
    await expect(service.list("gcpvj")).resolves.toMatchObject({ masjids: [], stale: true });
  });

  it("works without Redis via the in-memory cache", async () => {
    const { service, query } = setup({ redis: null });
    await service.list("gcpvj");
    await service.list("gcpvj");
    expect(query).toHaveBeenCalledTimes(1);
  });

  it("does not log the requested cell", async () => {
    const { service, query } = setup();
    const warn = vi.spyOn(
      (service as unknown as { logger: { warn: (m: string) => void } }).logger,
      "warn",
    );
    query.mockRejectedValueOnce(new Error("boom"));
    await service.list("gcpvj");
    expect(warn).toHaveBeenCalled();
    for (const call of warn.mock.calls) expect(String(call[0])).not.toContain("gcpvj");
  });

  it("serves stale data while another instance holds the cold-miss lock", async () => {
    vi.useFakeTimers();
    try {
      const { service, query, store } = setup();
      seed(store, masjidCellKey("gcpvj"), FRESH_TTL_MS + 1000, [
        { osmType: "node", osmId: "9", lat: 1, lon: 1 },
      ]);
      store.set(`${masjidCellKey("gcpvj")}:lock`, "1");
      const pending = service.list("gcpvj");
      await vi.runAllTimersAsync();
      await expect(pending).resolves.toMatchObject({ stale: true, masjids: [{ osmId: "9" }] });
      expect(query).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  describe("detail", () => {
    it("returns public fields with attribution and no timetable when no source is cleared", async () => {
      const { service, query } = setup();
      query.mockResolvedValueOnce({ elements: [OVERPASS_FIXTURE.elements[0]] });
      const detail = await service.detail("node", "1");
      expect(detail).toMatchObject({ osmId: "1", name: "East Masjid", stale: false });
      expect(detail.timetable).toBeUndefined();
      expect(detail.attribution).toEqual([...OSM_ATTRIBUTION_LINES]);
      expect(String(query.mock.calls[0]?.[0])).toContain("node(1);");
    });

    it("404s for an element that is not a masjid", async () => {
      const { service, query } = setup();
      query.mockResolvedValueOnce({ elements: [OVERPASS_FIXTURE.elements[2]] });
      await expect(service.detail("node", "3")).rejects.toBeInstanceOf(NotFoundException);
    });

    it("503s when upstream fails and nothing is cached", async () => {
      const { service, query } = setup();
      query.mockRejectedValueOnce(new Error("down"));
      await expect(service.detail("node", "1")).rejects.toBeInstanceOf(ServiceUnavailableException);
    });

    it("attaches a licence-cleared source's timetable with its attribution", async () => {
      const source: TimetableSource = {
        id: "fake",
        name: "Fake feed",
        licence: "CC0",
        attribution: "Times: Fake feed (CC0)",
        homepage: "https://example.org",
        fetch: vi.fn().mockResolvedValue({
          daily: { fajr: "05:30" },
          source: { id: "fake", attribution: "Fake feed", fetchedAt: "2026-11-23T00:00:00Z" },
        }),
      };
      const { service, query } = setup({ sources: [source] });
      query.mockResolvedValueOnce({ elements: [OVERPASS_FIXTURE.elements[0]] });
      const detail = await service.detail("node", "1");
      expect(detail.timetable?.daily).toEqual({ fajr: "05:30" });
      expect(detail.attribution).toContain("Times: Fake feed (CC0)");
    });
  });

  describe("upstream fairness (M10)", () => {
    const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";
    const cells = Array.from(
      { length: 80 },
      (_, i) => `gc${BASE32[i % 32]}${BASE32[Math.floor(i / 32)]}j`,
    );

    it("gives one client only its share of cold misses, then cache-only answers", async () => {
      const { service, query } = setup({ redis: null });
      for (let i = 0; i < CLIENT_UPSTREAM_PER_MINUTE; i += 1) {
        await expect(service.list(cells[i] as string, "198.51.100.1")).resolves.toMatchObject({
          stale: false,
        });
      }
      await expect(
        service.list(cells[CLIENT_UPSTREAM_PER_MINUTE] as string, "198.51.100.1"),
      ).resolves.toEqual(expect.objectContaining({ masjids: [], stale: true }));
      expect(query).toHaveBeenCalledTimes(CLIENT_UPSTREAM_PER_MINUTE);
      // Cached cells still answer for that client.
      await expect(service.list(cells[0] as string, "198.51.100.1")).resolves.toMatchObject({
        stale: false,
      });
    });

    it("never charges the shared budget for a client that is over its share", async () => {
      const { service, query } = setup({ redis: null });
      let next = 0;
      for (let i = 0; i < CLIENT_UPSTREAM_PER_MINUTE + 30; i += 1) {
        await service.list(cells[next++ % cells.length] as string, "198.51.100.1");
      }
      // Everyone else still has the rest of this minute's global budget.
      const others = UPSTREAM_PER_MINUTE - CLIENT_UPSTREAM_PER_MINUTE;
      const before = query.mock.calls.length;
      for (let i = 0; i < others; i += 1) {
        const client = `198.51.100.${10 + Math.floor(i / CLIENT_UPSTREAM_PER_MINUTE)}`;
        const result = await service.list(cells[(next + i) % cells.length] as string, client);
        expect(result.stale).toBe(false);
      }
      expect(query.mock.calls.length - before).toBe(others);
    });

    /** Detail lookups spread over minutes (the per-minute shares are not under test). */
    async function minuteApart<T>(run: () => Promise<T>): Promise<T> {
      vi.setSystemTime(Date.now() + 61_000);
      return run();
    }

    afterEach(() => {
      vi.useRealTimers();
    });

    it("charges detail lookups for ids no cell listed to a small budget, and caches misses", async () => {
      vi.useFakeTimers({ toFake: ["Date"] });
      const { service, query } = setup({ redis: null });
      query.mockResolvedValue({ elements: [] });
      for (let i = 1; i <= UNVERIFIED_DETAIL_PER_CLIENT_DAY; i += 1) {
        await expect(
          minuteApart(() => service.detail("node", String(1000 + i), "198.51.100.2")),
        ).rejects.toBeInstanceOf(NotFoundException);
      }
      // Cached negative: no second upstream call for the same id.
      await expect(service.detail("node", "1001", "198.51.100.2")).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(query).toHaveBeenCalledTimes(UNVERIFIED_DETAIL_PER_CLIENT_DAY);
      // Over the unverified allowance: nothing cached ⇒ 503, Overpass untouched.
      await expect(
        minuteApart(() => service.detail("node", "999999", "198.51.100.2")),
      ).rejects.toBeInstanceOf(ServiceUnavailableException);
      expect(query).toHaveBeenCalledTimes(UNVERIFIED_DETAIL_PER_CLIENT_DAY);
    });

    it("lets a client open masjids its cached cells listed after the unverified allowance", async () => {
      vi.useFakeTimers({ toFake: ["Date"] });
      const { service, query } = setup({ redis: null });
      await service.list("gcpvj", "198.51.100.3");
      query.mockResolvedValue({ elements: [] });
      for (let i = 1; i <= UNVERIFIED_DETAIL_PER_CLIENT_DAY; i += 1) {
        await minuteApart(() => service.detail("node", String(2000 + i), "198.51.100.3")).catch(
          () => undefined,
        );
      }
      query.mockResolvedValueOnce({ elements: [OVERPASS_FIXTURE.elements[0]] });
      await expect(
        minuteApart(() => service.detail("node", "1", "198.51.100.3")),
      ).resolves.toMatchObject({
        osmId: "1",
        stale: false,
      });
    });
  });
});
