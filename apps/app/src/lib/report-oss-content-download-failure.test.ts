import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import * as sentry from "@/lib/sentry";

import {
  classifyFetchError,
  clearOssContentFailureDedupe,
  httpStatusFromMessage,
  isConnectivityError,
  reportOssContentDownloadFailure,
} from "./report-oss-content-download-failure";

describe("report-oss-content-download-failure helpers", () => {
  beforeEach(() => {
    clearOssContentFailureDedupe();
  });

  it("parses HTTP status from fetchStaticJson messages", () => {
    expect(httpStatusFromMessage("HTTP 404 for https://cdn.example.com/x.json")).toBe(404);
    expect(httpStatusFromMessage("network down")).toBeUndefined();
  });

  it("classifies http vs network failures", () => {
    expect(classifyFetchError(new Error("HTTP 503 for https://cdn.example.com/x.json"))).toEqual({
      errorCode: "http_error",
      errorMessage: "HTTP 503 for https://cdn.example.com/x.json",
      httpStatus: 503,
    });
    expect(classifyFetchError(new Error("Failed to fetch"))).toMatchObject({
      errorCode: "network_error",
    });
  });

  // Verbatim messages from production Sentry issues (Nov 2026).
  it.each([
    'fetch failed: java.net.UnknownHostException: Unable to resolve host "cdn.jsdelivr.net": No address associated with hostname',
    'Unable to resolve host "everyayah.com": No address associated with hostname',
    "fetch failed: UnexpectedException: The Internet connection appears to be offline.",
    "Failed to fetch (cdn.jsdelivr.net)",
    "Load failed",
    "Network request failed",
  ])("treats %j as a connectivity failure", (message) => {
    expect(isConnectivityError(new Error(message))).toBe(true);
    expect(classifyFetchError(new Error(message)).errorCode).toBe("network_error");
  });

  it.each([
    "HTTP 404 for https://cdn.jsdelivr.net/gh/x/y@1/z.json",
    "Unable to download a file: response has status 416",
    "ERR_FILESYSTEM_CANNOT_DOWNLOAD: undefined reason",
    "Empty hadith collection payload for bukhari",
  ])("keeps %j reportable (not connectivity)", (message) => {
    expect(isConnectivityError(new Error(message))).toBe(false);
  });
});

describe("reportOssContentDownloadFailure → Sentry", () => {
  // jest.setup loads this module graph first, so spy on the live export
  // instead of `jest.mock` (which would not replace the already-bound module).
  const mockCapture = jest.fn();
  beforeEach(() => {
    clearOssContentFailureDedupe();
    mockCapture.mockClear();
    jest.spyOn(sentry, "captureAppException").mockImplementation(mockCapture);
  });

  const base = {
    contentKind: "hadith_collection" as const,
    contentKey: "hadith_collection:bukhari:en:eng-bukhari",
    sourceProvider: "fawazahmed0/hadith-api",
    sourceUrl: "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-bukhari.min.json",
  };

  it("does not send offline / DNS failures to Sentry", () => {
    const error = new Error('Unable to resolve host "cdn.jsdelivr.net"');
    reportOssContentDownloadFailure({
      ...base,
      errorCode: "network_error",
      errorMessage: error.message,
      error,
    });
    expect(mockCapture).not.toHaveBeenCalled();
  });

  it("sends real CDN failures grouped per provider + status", () => {
    const error = new Error(`HTTP 404 for ${base.sourceUrl}`);
    reportOssContentDownloadFailure({
      ...base,
      errorCode: "http_error",
      errorMessage: error.message,
      httpStatus: 404,
      error,
    });
    expect(mockCapture).toHaveBeenCalledTimes(1);
    expect(mockCapture.mock.calls[0]?.[1]).toMatchObject({
      fingerprint: [
        "oss-content-download",
        "hadith_collection",
        "fawazahmed0/hadith-api",
        "http_error",
        "404",
      ],
    });
  });
});
