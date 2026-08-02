import type { Response } from "express";
import { describe, expect, it, vi } from "vitest";
import {
  APP_VERSION_RESPONSE_HEADERS,
  setAppVersionResponseHeaders,
} from "./app-version-response-headers";

function mockResponse() {
  const headers = new Map<string, string>();
  const res = {
    setHeader: vi.fn((name: string, value: string) => {
      headers.set(name, value);
    }),
    headers,
  };
  return res as unknown as Response & {
    setHeader: ReturnType<typeof vi.fn>;
    headers: Map<string, string>;
  };
}

describe("setAppVersionResponseHeaders", () => {
  it("sets required version headers", () => {
    const res = mockResponse();

    setAppVersionResponseHeaders(res, {
      updateRequired: "soft",
      latestVersion: "1.2.0",
      minSoftVersion: "1.1.0",
      minHardVersion: "1.0.0",
    });

    expect(res.headers.get(APP_VERSION_RESPONSE_HEADERS.updateRequired)).toBe("soft");
    expect(res.headers.get(APP_VERSION_RESPONSE_HEADERS.latestVersion)).toBe("1.2.0");
    expect(res.headers.get(APP_VERSION_RESPONSE_HEADERS.minSoftVersion)).toBe("1.1.0");
    expect(res.headers.get(APP_VERSION_RESPONSE_HEADERS.minHardVersion)).toBe("1.0.0");
    expect(res.headers.has(APP_VERSION_RESPONSE_HEADERS.message)).toBe(false);
    expect(res.headers.has(APP_VERSION_RESPONSE_HEADERS.storeUrl)).toBe(false);
  });

  it("sets optional message and storeUrl when present", () => {
    const res = mockResponse();

    setAppVersionResponseHeaders(res, {
      updateRequired: "hard",
      latestVersion: "2.0.0",
      minSoftVersion: "1.5.0",
      minHardVersion: "1.0.0",
      message: "Please update",
      storeUrl: "https://apps.apple.com/app/id123",
    });

    expect(res.headers.get(APP_VERSION_RESPONSE_HEADERS.message)).toBe("Please update");
    expect(res.headers.get(APP_VERSION_RESPONSE_HEADERS.storeUrl)).toBe(
      "https://apps.apple.com/app/id123",
    );
  });
});
