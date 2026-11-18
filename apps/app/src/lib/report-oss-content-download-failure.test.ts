import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { SessionStore } from "@/auth/session-store";
import * as appPlatform from "@/lib/app/resolve-app-platform";
import * as ossApi from "@/lib/oss-content-failure-api";
import * as sentry from "@/lib/sentry";
import { buildGuestSession } from "@/test-support/fixtures/auth";

import {
  classifyFetchError,
  clearOssContentFailureDedupe,
  flushPendingOssContentFailures,
  httpStatusFromMessage,
  isConnectivityError,
  type ReportOssContentFailureInput,
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
    // Safari's "Load failed" must not match inside "download failed".
    "OSS download failed: quran_audio:alafasy:1",
    "Recitation download failed (checksum mismatch)",
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

  it("sends a failure without an error message (synthesised fallback) to Sentry", () => {
    reportOssContentDownloadFailure({ ...base, errorCode: "download_failed", errorMessage: "" });
    expect(mockCapture).toHaveBeenCalledTimes(1);
    expect(mockCapture.mock.calls[0]?.[0]).toEqual(
      new Error(`OSS download failed: ${base.contentKey}`),
    );
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

describe("classifyFetchError edge cases", () => {
  it.each([
    [new Error("Unexpected token < in JSON"), { errorCode: "parse_error" }],
    [new Error("device offline"), { errorCode: "network_error" }],
    [new Error("ERR_FILESYSTEM_CANNOT_DOWNLOAD"), { errorCode: "download_failed" }],
    ["HTTP 500 for x", { errorCode: "http_error", httpStatus: 500 }],
    [undefined, { errorCode: "download_failed", errorMessage: "Unknown error" }],
  ])("classifies %p", (error, expected) => {
    expect(classifyFetchError(error)).toMatchObject(expected);
  });

  it.each([
    [null, false],
    [undefined, false],
    ["Network request failed", true],
    [Object.assign(new Error("x"), { name: "AbortError" }), true],
  ])("isConnectivityError(%p) → %p", (error, expected) => {
    expect(isConnectivityError(error)).toBe(expected);
  });
});

describe("reportOssContentDownloadFailure delivery", () => {
  const submit = jest.fn<typeof ossApi.submitOssContentDownloadFailure>();
  const getSession = jest.fn<typeof SessionStore.get>();
  const capture = jest.fn();

  /** Let the fire-and-forget delivery task settle. */
  const settle = () => new Promise((resolve) => setImmediate(resolve));

  function buildInput(overrides: Partial<ReportOssContentFailureInput> = {}) {
    return {
      contentKind: "quran_translation",
      contentKey: "quran_translation:fr:1",
      sourceProvider: "fawazahmed0/quran-api",
      sourceUrl: "https://cdn.example/fr/1.json",
      errorCode: "http_error",
      errorMessage: "HTTP 404 for https://cdn.example/fr/1.json",
      httpStatus: 404,
      ...overrides,
    } as ReportOssContentFailureInput;
  }

  beforeEach(() => {
    clearOssContentFailureDedupe();
    submit.mockReset().mockResolvedValue(undefined);
    getSession.mockReset().mockResolvedValue(buildGuestSession());
    capture.mockReset();
    jest.spyOn(ossApi, "submitOssContentDownloadFailure").mockImplementation(submit);
    jest.spyOn(SessionStore, "get").mockImplementation(getSession);
    jest.spyOn(sentry, "captureAppException").mockImplementation(capture);
  });

  afterEach(() => jest.restoreAllMocks());

  it("posts the failure with the session token and current prefs", async () => {
    reportOssContentDownloadFailure(buildInput({ contentKey: "k".repeat(300) }));
    await settle();
    expect(submit).toHaveBeenCalledWith(
      "access-guest",
      expect.objectContaining({
        contentKind: "quran_translation",
        contentKey: "k".repeat(256),
        contentMeta: {},
        httpStatus: 404,
        platform: "ios",
        locale: expect.any(String),
      }),
    );
  });

  it("reports the same content + error only once per dedupe window", async () => {
    reportOssContentDownloadFailure(buildInput());
    reportOssContentDownloadFailure(buildInput());
    reportOssContentDownloadFailure(buildInput({ errorCode: "parse_error" }));
    await settle();
    expect(submit).toHaveBeenCalledTimes(2);
  });

  it("reports again once the dedupe window has passed", async () => {
    const now = jest.spyOn(Date, "now").mockReturnValue(1_000_000);
    reportOssContentDownloadFailure(buildInput());
    now.mockReturnValue(1_000_000 + 16 * 60 * 1000);
    reportOssContentDownloadFailure(buildInput());
    await settle();
    expect(submit).toHaveBeenCalledTimes(2);
  });

  it("captures an Error synthesized from the message when given a non-Error", () => {
    reportOssContentDownloadFailure(buildInput({ error: "boom", errorMessage: "Bad payload" }));
    expect(capture).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Bad payload" }),
      expect.anything(),
    );
  });

  it("skips Sentry when only the message describes a connectivity failure", () => {
    reportOssContentDownloadFailure(
      buildInput({ error: new Error("wrapped"), errorMessage: "Network request failed" }),
    );
    expect(capture).not.toHaveBeenCalled();
  });

  it("swallows API failures", async () => {
    submit.mockRejectedValueOnce(new Error("500"));
    reportOssContentDownloadFailure(buildInput());
    await expect(settle()).resolves.toBeUndefined();
  });

  it("does nothing on an unsupported platform", async () => {
    jest.spyOn(appPlatform, "resolveAppPlatform").mockReturnValue("tv" as never);
    reportOssContentDownloadFailure(buildInput());
    await settle();
    expect(capture).not.toHaveBeenCalled();
    expect(getSession).not.toHaveBeenCalled();
  });

  describe("without a session", () => {
    beforeEach(() => getSession.mockResolvedValue(null));

    it("queues failures and posts them once a session exists", async () => {
      reportOssContentDownloadFailure(buildInput());
      await settle();
      expect(submit).not.toHaveBeenCalled();

      getSession.mockResolvedValue(buildGuestSession());
      flushPendingOssContentFailures();
      await settle();
      expect(submit).toHaveBeenCalledTimes(1);
    });

    it("re-queues on flush while there is still no session", async () => {
      reportOssContentDownloadFailure(buildInput());
      await settle();
      flushPendingOssContentFailures();
      await settle();

      getSession.mockResolvedValue(buildGuestSession());
      flushPendingOssContentFailures();
      await settle();
      expect(submit).toHaveBeenCalledTimes(1);
    });

    it("caps the pending queue at 20 failures", async () => {
      for (let i = 0; i < 25; i++)
        reportOssContentDownloadFailure(buildInput({ contentKey: `k${i}` }));
      await settle();
      getSession.mockResolvedValue(buildGuestSession());
      flushPendingOssContentFailures();
      await settle();
      expect(submit).toHaveBeenCalledTimes(20);
    });

    it("drops queued failures on an unsupported platform and swallows flush errors", async () => {
      reportOssContentDownloadFailure(buildInput({ contentKey: "a" }));
      reportOssContentDownloadFailure(buildInput({ contentKey: "b" }));
      await settle();
      const platform = jest.spyOn(appPlatform, "resolveAppPlatform");
      platform.mockReturnValueOnce("tv" as never);
      getSession.mockRejectedValueOnce(new Error("keychain"));
      flushPendingOssContentFailures();
      await settle();
      expect(submit).not.toHaveBeenCalled();
    });
  });

  it("flush is a no-op with nothing pending", () => {
    flushPendingOssContentFailures();
    expect(getSession).not.toHaveBeenCalled();
  });
});
