import { describe, expect, it } from "vitest";
import { buildResponse } from "../../test-support/http";
import type { VersionMetaResponseDto } from "../dto/version.dto";
import {
  APP_VERSION_CORS_EXPOSED_HEADERS,
  APP_VERSION_RESPONSE_HEADERS,
  setAppVersionResponseHeaders,
} from "./app-version-response-headers";

const BASE_META: VersionMetaResponseDto = {
  updateRequired: "soft",
  latestVersion: "1.2.0",
  minSoftVersion: "1.1.0",
  minHardVersion: "1.0.0",
};

function setup(meta: Partial<VersionMetaResponseDto> = {}) {
  const res = buildResponse();
  setAppVersionResponseHeaders(res, { ...BASE_META, ...meta });
  return res.headers;
}

describe("setAppVersionResponseHeaders", () => {
  it.each([
    [APP_VERSION_RESPONSE_HEADERS.updateRequired, "soft"],
    [APP_VERSION_RESPONSE_HEADERS.latestVersion, "1.2.0"],
    [APP_VERSION_RESPONSE_HEADERS.minSoftVersion, "1.1.0"],
    [APP_VERSION_RESPONSE_HEADERS.minHardVersion, "1.0.0"],
  ])("sets %s", (header, value) => {
    expect(setup().get(header)).toBe(value);
  });

  it.each([APP_VERSION_RESPONSE_HEADERS.message, APP_VERSION_RESPONSE_HEADERS.storeUrl])(
    "omits %s when absent",
    (header) => {
      expect(setup({ message: null, storeUrl: null }).has(header)).toBe(false);
    },
  );

  it.each([
    [APP_VERSION_RESPONSE_HEADERS.message, "Please update"],
    [APP_VERSION_RESPONSE_HEADERS.storeUrl, "https://apps.apple.com/app/id123"],
  ])("sets %s when present", (header, value) => {
    const headers = setup({
      message: "Please update",
      storeUrl: "https://apps.apple.com/app/id123",
    });
    expect(headers.get(header)).toBe(value);
  });
});

describe("APP_VERSION_CORS_EXPOSED_HEADERS", () => {
  it("exposes every response header", () => {
    expect(APP_VERSION_CORS_EXPOSED_HEADERS).toEqual(Object.values(APP_VERSION_RESPONSE_HEADERS));
  });
});
