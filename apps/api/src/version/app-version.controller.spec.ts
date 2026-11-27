import { afterEach, describe, expect, it, vi } from "vitest";
import { resetMemoryRateLimits } from "../common/durable-rate-limit";
import { buildRequest, buildResponse } from "../test-support/http";
import { AppVersionController, VERSION_REFRESH_RATE_LIMIT } from "./app-version.controller";
import type { AppVersionService } from "./app-version.service";
import type { VersionMetaQueryDto, VersionMetaResponseDto } from "./dto/version.dto";

const META: VersionMetaResponseDto = {
  updateRequired: "none",
  latestVersion: "1.0.0",
  minSoftVersion: "1.0.0",
  minHardVersion: "1.0.0",
  message: null,
  storeUrl: null,
};

function setup(ip = "192.0.2.10") {
  const service = {
    clearAppVersionCache: vi.fn().mockResolvedValue(undefined),
    getAppVersionMeta: vi.fn().mockResolvedValue(META),
  };
  const res = buildResponse();
  const controller = new AppVersionController(service as unknown as AppVersionService);
  const req = buildRequest({ ip });
  const getMeta = (query: VersionMetaQueryDto) => controller.getVersionMeta(query, res, req);
  return { service, res, getMeta };
}

describe("AppVersionController", () => {
  afterEach(() => {
    resetMemoryRateLimits();
  });

  it("returns the service meta", async () => {
    const { getMeta } = setup();
    await expect(getMeta({ version: "1.0.0" })).resolves.toBe(META);
  });

  it.each([
    [{ version: " 1.2.3 ", platform: "iPhone" }, "ios", "1.2.3"],
    [{ version: "1.0.0" }, "web", "1.0.0"],
  ])("looks up %j as (%s, %s)", async (query, platform, version) => {
    const { service, getMeta } = setup();
    await getMeta(query);
    expect(service.getAppVersionMeta).toHaveBeenCalledWith(platform, version);
  });

  it("marks the response private and uncacheable", async () => {
    const { res, getMeta } = setup();
    await getMeta({ version: "1.0.0" });
    expect(res.headers.get("cache-control")).toBe("private, no-cache");
  });

  it.each([
    ["1", "Android", "android"],
    ["true", "Android", "android"],
    ["true", undefined, undefined],
  ])("refresh=%s with platform %j clears %j", async (refresh, platform, cleared) => {
    const { service, getMeta } = setup();
    await getMeta({ version: "1.0.0", platform, refresh });
    expect(service.clearAppVersionCache).toHaveBeenCalledWith(cleared);
  });

  it("caps unauthenticated cache invalidations per IP and still answers", async () => {
    const { service, getMeta } = setup("192.0.2.77");
    for (let i = 0; i < VERSION_REFRESH_RATE_LIMIT.limit + 3; i++) {
      await expect(getMeta({ version: "1.0.0", refresh: "1" })).resolves.toBe(META);
    }
    expect(service.clearAppVersionCache).toHaveBeenCalledTimes(VERSION_REFRESH_RATE_LIMIT.limit);
    // Another client keeps its own budget.
    const other = setup("192.0.2.78");
    await other.getMeta({ version: "1.0.0", refresh: "1" });
    expect(other.service.clearAppVersionCache).toHaveBeenCalledTimes(1);
  });

  it("ignores other refresh values", async () => {
    const { service, getMeta } = setup();
    await getMeta({ version: "1.0.0", refresh: "yes" });
    expect(service.clearAppVersionCache).not.toHaveBeenCalled();
  });
});
