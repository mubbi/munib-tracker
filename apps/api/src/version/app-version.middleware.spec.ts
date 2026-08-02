import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppVersionHeadersMiddleware } from "./app-version.middleware";
import type { AppVersionService } from "./app-version.service";
import {
  APP_VERSION_REQUEST_HEADERS,
  APP_VERSION_RESPONSE_HEADERS,
} from "./lib/app-version-response-headers";

function mockResponse() {
  const headers = new Map<string, string>();
  return {
    setHeader: vi.fn((name: string, value: string) => {
      headers.set(name, value);
    }),
    headers,
  } as unknown as Response & { setHeader: ReturnType<typeof vi.fn>; headers: Map<string, string> };
}

describe("AppVersionHeadersMiddleware", () => {
  let getAppVersionMeta: ReturnType<typeof vi.fn>;
  let middleware: AppVersionHeadersMiddleware;
  let next: NextFunction;

  beforeEach(() => {
    getAppVersionMeta = vi.fn();
    middleware = new AppVersionHeadersMiddleware({
      getAppVersionMeta,
    } as unknown as AppVersionService);
    next = vi.fn();
  });

  it("skips when X-App-Version header is missing", async () => {
    const req = { headers: {} } as Request;
    const res = mockResponse();

    await middleware.use(req, res, next);

    expect(getAppVersionMeta).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
  });

  it("sets response headers when version header is present", async () => {
    getAppVersionMeta.mockResolvedValue({
      updateRequired: "none",
      latestVersion: "1.2.0",
      minSoftVersion: "1.1.0",
      minHardVersion: "1.0.0",
    });

    const req = {
      headers: {
        [APP_VERSION_REQUEST_HEADERS.version]: "1.2.0",
        [APP_VERSION_REQUEST_HEADERS.platform]: "ios",
      },
    } as unknown as Request;
    const res = mockResponse();

    await middleware.use(req, res, next);

    expect(getAppVersionMeta).toHaveBeenCalledWith("ios", "1.2.0");
    expect(res.headers.get(APP_VERSION_RESPONSE_HEADERS.latestVersion)).toBe("1.2.0");
    expect(next).toHaveBeenCalledOnce();
  });

  it("continues the request when version service throws", async () => {
    getAppVersionMeta.mockRejectedValue(new Error("db down"));

    const req = {
      headers: {
        [APP_VERSION_REQUEST_HEADERS.version]: "1.0.0",
      },
    } as unknown as Request;
    const res = mockResponse();

    await middleware.use(req, res, next);

    expect(res.setHeader).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
  });
});
