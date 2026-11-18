import { describe, expect, it, vi } from "vitest";
import { buildRequest, buildResponse } from "../test-support/http";
import { AppVersionHeadersMiddleware } from "./app-version.middleware";
import type { AppVersionService } from "./app-version.service";
import {
  APP_VERSION_REQUEST_HEADERS,
  APP_VERSION_RESPONSE_HEADERS,
} from "./lib/app-version-response-headers";

const META = {
  updateRequired: "none" as const,
  latestVersion: "1.2.0",
  minSoftVersion: "1.1.0",
  minHardVersion: "1.0.0",
};

function setup(headers: Record<string, string> = {}) {
  const getAppVersionMeta = vi.fn().mockResolvedValue(META);
  const middleware = new AppVersionHeadersMiddleware({
    getAppVersionMeta,
  } as unknown as AppVersionService);
  const res = buildResponse();
  const next = vi.fn();
  const run = () => middleware.use(buildRequest({ headers }), res, next);
  return { getAppVersionMeta, res, next, run };
}

const withVersion = (version: string, platform?: string) => ({
  [APP_VERSION_REQUEST_HEADERS.version]: version,
  ...(platform ? { [APP_VERSION_REQUEST_HEADERS.platform]: platform } : {}),
});

describe("AppVersionHeadersMiddleware", () => {
  it.each([
    ["missing", {}],
    ["blank", withVersion("   ")],
  ])("skips the lookup when X-App-Version is %s", async (_label, headers) => {
    const { getAppVersionMeta, run } = setup(headers);
    await run();
    expect(getAppVersionMeta).not.toHaveBeenCalled();
  });

  it("looks up the normalized platform and trimmed version", async () => {
    const { getAppVersionMeta, run } = setup(withVersion(" 1.2.0 ", "iOS"));
    await run();
    expect(getAppVersionMeta).toHaveBeenCalledWith("ios", "1.2.0");
  });

  it("sets the version response headers", async () => {
    const { res, run } = setup(withVersion("1.2.0", "ios"));
    await run();
    expect(res.headers.get(APP_VERSION_RESPONSE_HEADERS.latestVersion)).toBe("1.2.0");
  });

  it("sets no headers when the version service throws", async () => {
    const { getAppVersionMeta, res, run } = setup(withVersion("1.0.0"));
    getAppVersionMeta.mockRejectedValue(new Error("db down"));
    await run();
    expect(res.setHeader).not.toHaveBeenCalled();
  });

  it.each([
    ["no version header", {}, false],
    ["a successful lookup", withVersion("1.0.0"), false],
    ["a failing lookup", withVersion("1.0.0"), true],
  ])("always calls next() once after %s", async (_label, headers, fails) => {
    const { getAppVersionMeta, next, run } = setup(headers);
    if (fails) getAppVersionMeta.mockRejectedValue(new Error("db down"));
    await run();
    expect(next).toHaveBeenCalledOnce();
  });
});
