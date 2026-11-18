import { describe, expect, it, vi } from "vitest";
import { buildResponse } from "../test-support/http";
import { AppVersionController } from "./app-version.controller";
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

function setup() {
  const service = {
    clearAppVersionCache: vi.fn().mockResolvedValue(undefined),
    getAppVersionMeta: vi.fn().mockResolvedValue(META),
  };
  const res = buildResponse();
  const controller = new AppVersionController(service as unknown as AppVersionService);
  const getMeta = (query: VersionMetaQueryDto) => controller.getVersionMeta(query, res);
  return { service, res, getMeta };
}

describe("AppVersionController", () => {
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

  it("ignores other refresh values", async () => {
    const { service, getMeta } = setup();
    await getMeta({ version: "1.0.0", refresh: "yes" });
    expect(service.clearAppVersionCache).not.toHaveBeenCalled();
  });
});
