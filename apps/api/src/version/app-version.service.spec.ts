import { Logger } from "@nestjs/common";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AppVersionEntity } from "../database/entities";
import { asRepository, buildMockRepository } from "../test-support/repositories";
import {
  APP_VERSION_CONFIG_CACHE_TTL_MS,
  type AppPlatform,
  AppVersionService,
  normalizePlatform,
  resolveUpdateRequired,
} from "./app-version.service";

const cacheGetJson = vi.fn();
const cacheSetJson = vi.fn();
const invalidateAppVersionCache = vi.fn();

vi.mock("../redis/redisJsonCache", () => ({
  appVersionPlatformConfigKey: (platform: string) => `mt:test:app_ver:cfg:${platform}`,
  cacheGetJson: (...args: unknown[]) => cacheGetJson(...args),
  cacheSetJson: (...args: unknown[]) => cacheSetJson(...args),
  invalidateAppVersionCache: (...args: unknown[]) => invalidateAppVersionCache(...args),
}));

const REDIS_TTL_SEC = APP_VERSION_CONFIG_CACHE_TTL_MS / 1000;

function buildVersionRow(overrides: Partial<AppVersionEntity> = {}): AppVersionEntity {
  return {
    platform: "ios",
    latestVersion: "2.0.0",
    minSoftVersion: "1.5.0",
    minHardVersion: "1.0.0",
    message: "New stuff",
    storeUrl: "https://apps.apple.com/app/id1",
    ...overrides,
  } as AppVersionEntity;
}

describe("resolveUpdateRequired", () => {
  it.each([
    ["meets every threshold", "1.2.0", "1.2.0", "1.1.0", "1.0.0", "none"],
    ["is below latest only", "1.1.0", "1.2.0", "1.0.0", "1.0.0", "soft"],
    ["is below min soft", "1.0.5", "1.2.0", "1.1.0", "1.0.0", "soft"],
    ["is below min hard", "0.9.0", "1.2.0", "1.1.0", "1.0.0", "hard"],
    ["is below both (hard wins)", "0.5.0", "2.0.0", "1.5.0", "1.0.0", "hard"],
  ])("client that %s → %s", (_label, client, latest, soft, hard, expected) => {
    expect(resolveUpdateRequired(client, latest, soft, hard).updateRequired).toBe(expected);
  });

  it("echoes thresholds and defaults message/storeUrl to null", () => {
    expect(resolveUpdateRequired("1.2.0", "1.2.0", "1.1.0", "1.0.0")).toEqual({
      updateRequired: "none",
      latestVersion: "1.2.0",
      minSoftVersion: "1.1.0",
      minHardVersion: "1.0.0",
      message: null,
      storeUrl: null,
    });
  });

  it("passes message and storeUrl through", () => {
    expect(resolveUpdateRequired("1.0.0", "1.0.0", "1.0.0", "1.0.0", "m", "u")).toMatchObject({
      message: "m",
      storeUrl: "u",
    });
  });
});

describe("normalizePlatform", () => {
  it.each([
    [undefined, "web"],
    ["", "web"],
    [42 as unknown as string, "web"],
    [" iOS ", "ios"],
    ["iPhone", "ios"],
    ["ipad", "ios"],
    ["Android", "android"],
    ["windows", "web"],
  ])("%j → %s", (input, expected) => {
    expect(normalizePlatform(input)).toBe(expected);
  });
});

describe("AppVersionService", () => {
  /** Fresh service with the module-level memory cache cleared. */
  async function setup(row: AppVersionEntity | null = buildVersionRow()) {
    const repo = buildMockRepository({ findOne: vi.fn().mockResolvedValue(row) });
    const service = new AppVersionService(asRepository<AppVersionEntity>(repo));
    await service.clearAppVersionCache();
    invalidateAppVersionCache.mockClear();
    return { repo, service };
  }

  beforeEach(() => {
    cacheGetJson.mockReset().mockResolvedValue(null);
    cacheSetJson.mockReset().mockResolvedValue(undefined);
    invalidateAppVersionCache.mockReset().mockResolvedValue(undefined);
    vi.spyOn(Logger.prototype, "warn").mockImplementation(() => undefined);
    vi.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("resolves the update policy from the platform row", async () => {
    const { service } = await setup();
    await expect(service.getAppVersionMeta("ios", "1.2.0")).resolves.toEqual({
      updateRequired: "soft",
      latestVersion: "2.0.0",
      minSoftVersion: "1.5.0",
      minHardVersion: "1.0.0",
      message: "New stuff",
      storeUrl: "https://apps.apple.com/app/id1",
    });
  });

  it("looks the row up by platform", async () => {
    const { repo, service } = await setup();
    await service.getAppVersionMeta("ios", "1.2.0");
    expect(repo.findOne).toHaveBeenCalledWith({ where: { platform: "ios" } });
  });

  it("writes the loaded config to Redis", async () => {
    const { service } = await setup();
    await service.getAppVersionMeta("ios", "1.2.0");
    expect(cacheSetJson).toHaveBeenCalledWith(
      "mt:test:app_ver:cfg:ios",
      { config: expect.objectContaining({ latestVersion: "2.0.0" }) },
      REDIS_TTL_SEC,
    );
  });

  it("serves repeat lookups from memory", async () => {
    const { repo, service } = await setup();
    await service.getAppVersionMeta("ios", "2.0.0");
    await service.getAppVersionMeta("ios", "0.1.0");
    expect(repo.findOne).toHaveBeenCalledTimes(1);
    expect(cacheGetJson).toHaveBeenCalledTimes(1);
  });

  it("normalizes missing message/storeUrl to null", async () => {
    const { service } = await setup(
      buildVersionRow({ message: undefined, storeUrl: undefined } as Partial<AppVersionEntity>),
    );
    await expect(service.getAppVersionMeta("ios", "2.0.0")).resolves.toMatchObject({
      message: null,
      storeUrl: null,
    });
  });

  it("uses client-version defaults when no row exists", async () => {
    const { service } = await setup(null);
    await expect(service.getAppVersionMeta("android", "3.1.4")).resolves.toEqual({
      updateRequired: "none",
      latestVersion: "3.1.4",
      minSoftVersion: "3.1.4",
      minHardVersion: "3.1.4",
      message: null,
      storeUrl: null,
    });
  });

  it("caches the missing-row result and warns", async () => {
    const { service } = await setup(null);
    await service.getAppVersionMeta("android", "3.1.4");
    expect(cacheSetJson).toHaveBeenCalledWith(
      "mt:test:app_ver:cfg:android",
      { config: null },
      REDIS_TTL_SEC,
    );
    expect(Logger.prototype.warn).toHaveBeenCalledWith(
      expect.stringContaining('No app_versions row for platform "android"'),
    );
  });

  it.each([
    ["a cached null", { config: null }, "none"],
    [
      "a cached config",
      {
        config: {
          latestVersion: "5.0.0",
          minSoftVersion: "4.0.0",
          minHardVersion: "3.0.0",
          message: null,
          storeUrl: null,
        },
      },
      "hard",
    ],
  ])("serves %s from Redis without the DB", async (_label, cached, expected) => {
    const { repo, service } = await setup();
    cacheGetJson.mockResolvedValueOnce(cached);
    const meta = await service.getAppVersionMeta("android", "2.0.0");
    expect(meta.updateRequired).toBe(expected);
    expect(repo.findOne).not.toHaveBeenCalled();
  });

  it("ignores malformed Redis payloads", async () => {
    const { repo, service } = await setup();
    cacheGetJson.mockResolvedValueOnce("garbage");
    await service.getAppVersionMeta("ios", "2.0.0");
    expect(repo.findOne).toHaveBeenCalledTimes(1);
  });

  it("returns defaults and logs when the DB lookup fails", async () => {
    const { repo, service } = await setup();
    const err = new Error("db down");
    repo.findOne.mockRejectedValue(err);

    await expect(service.getAppVersionMeta("web", "1.4.0")).resolves.toMatchObject({
      updateRequired: "none",
      latestVersion: "1.4.0",
    });
    expect(Logger.prototype.error).toHaveBeenCalledWith("Failed to load app_versions for web", err);
  });

  it("re-reads after the memory TTL expires", async () => {
    const { repo, service } = await setup();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    await service.getAppVersionMeta("ios", "2.0.0");

    vi.setSystemTime(Date.now() + APP_VERSION_CONFIG_CACHE_TTL_MS + 1);
    await service.getAppVersionMeta("ios", "2.0.0");

    expect(repo.findOne).toHaveBeenCalledTimes(2);
  });

  it("evicts the oldest memory entry once 20 platforms are cached", async () => {
    const { repo, service } = await setup();
    const platforms = Array.from({ length: 21 }, (_, i) => `p${i}` as AppPlatform);
    for (const platform of platforms) await service.getAppVersionMeta(platform, "2.0.0");

    await service.getAppVersionMeta(platforms[20] as AppPlatform, "2.0.0");
    expect(repo.findOne).toHaveBeenCalledTimes(21);
    await service.getAppVersionMeta(platforms[0] as AppPlatform, "2.0.0");
    expect(repo.findOne).toHaveBeenCalledTimes(22);
  });

  describe("clearAppVersionCache", () => {
    it("clears and invalidates one platform", async () => {
      const { repo, service } = await setup();
      await service.getAppVersionMeta("ios", "2.0.0");
      await service.getAppVersionMeta("android", "2.0.0");

      await service.clearAppVersionCache("ios");
      await service.getAppVersionMeta("ios", "2.0.0");
      await service.getAppVersionMeta("android", "2.0.0");

      expect(invalidateAppVersionCache).toHaveBeenCalledWith("ios");
      expect(repo.findOne).toHaveBeenCalledTimes(3);
    });

    it("clears and invalidates every platform", async () => {
      const { repo, service } = await setup();
      await service.getAppVersionMeta("ios", "2.0.0");
      await service.getAppVersionMeta("android", "2.0.0");

      await service.clearAppVersionCache();
      await service.getAppVersionMeta("ios", "2.0.0");
      await service.getAppVersionMeta("android", "2.0.0");

      expect(invalidateAppVersionCache).toHaveBeenCalledWith(undefined);
      expect(repo.findOne).toHaveBeenCalledTimes(4);
    });
  });
});
