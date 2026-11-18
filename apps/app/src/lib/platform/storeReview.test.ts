import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockIsAvailableAsync = jest.fn<() => Promise<boolean>>();
const mockRequestReview = jest.fn<() => Promise<void>>();
const mockOpenURL = jest.fn<(url: string) => Promise<void>>().mockResolvedValue(undefined);
const mockDetectWebPwaBrowserMatrix = jest.fn<
  () => { isIosWebKit: boolean; isAndroid: boolean } | null
>(() => null);

jest.mock("react-native", () => ({
  Linking: {
    openURL: (...args: unknown[]) => mockOpenURL(...args),
  },
  Platform: { OS: "ios" },
}));

jest.mock("expo-store-review", () => ({
  isAvailableAsync: (...args: unknown[]) => mockIsAvailableAsync(...args),
  requestReview: (...args: unknown[]) => mockRequestReview(...args),
}));

jest.mock("@/lib/notifications/platform", () => ({
  isExpoGo: () => false,
}));

jest.mock("@/lib/notifications/browser-capabilities", () => ({
  detectWebPwaBrowserMatrix: (...args: unknown[]) => mockDetectWebPwaBrowserMatrix(...args),
}));

import {
  isStoreReviewAvailable,
  openReviewStoreListing,
  openReviewStoreListingUrl,
  requestStoreReviewIfAvailable,
  resolveReviewStoreListingTarget,
  resolveReviewStoreListingUrl,
} from "@/lib/platform/storeReview";
import { usePlatformSwitch } from "@/test-support/platform";

describe("storeReview", () => {
  // `react-native` is mocked wholesale (for `Linking`); setPlatform patches that mock's Platform.
  const onPlatform = usePlatformSwitch();

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAvailableAsync.mockResolvedValue(true);
    mockRequestReview.mockResolvedValue(undefined);
    mockDetectWebPwaBrowserMatrix.mockReturnValue(null);
  });

  it("requests review when available on native", async () => {
    const ok = await requestStoreReviewIfAvailable();
    expect(ok).toBe(true);
    expect(mockRequestReview).toHaveBeenCalledTimes(1);
  });

  it("returns false when store review API is unavailable", async () => {
    mockIsAvailableAsync.mockResolvedValue(false);
    const ok = await requestStoreReviewIfAvailable();
    expect(ok).toBe(false);
    expect(mockRequestReview).not.toHaveBeenCalled();
  });

  it("returns false on web for native review API", async () => {
    onPlatform({ OS: "web" });
    expect(await isStoreReviewAvailable()).toBe(false);
    expect(await requestStoreReviewIfAvailable()).toBe(false);
  });

  it("opens the App Store listing on web iOS", async () => {
    onPlatform({ OS: "web" });
    mockDetectWebPwaBrowserMatrix.mockReturnValue({ isIosWebKit: true, isAndroid: false });

    expect(resolveReviewStoreListingTarget()).toBe("ios");
    const ok = await openReviewStoreListing({ locale: "en" });
    expect(ok).toBe(true);
    expect(mockOpenURL).toHaveBeenCalledWith(expect.stringContaining("apps.apple.com"));
    expect(mockOpenURL).toHaveBeenCalledWith(expect.stringContaining("id6787222180"));
  });

  it("opens store listing URLs directly", async () => {
    const url = resolveReviewStoreListingUrl("android", "en");
    expect(url).toContain("play.google.com");
    await openReviewStoreListingUrl(url);
    expect(mockOpenURL).toHaveBeenCalledWith(url);
  });

  it("treats a throwing availability check as unavailable", async () => {
    mockIsAvailableAsync.mockRejectedValue(new Error("native"));
    expect(await isStoreReviewAvailable()).toBe(false);
  });

  it("returns false when the review request throws", async () => {
    mockRequestReview.mockRejectedValue(new Error("native"));
    expect(await requestStoreReviewIfAvailable()).toBe(false);
  });

  it("uses the in-app review sheet on native when it works", async () => {
    expect(await openReviewStoreListing()).toBe(true);
    expect(mockOpenURL).not.toHaveBeenCalled();
  });

  it("falls back to the store listing when the native sheet is unavailable", async () => {
    onPlatform({ OS: "android" });
    mockIsAvailableAsync.mockResolvedValue(false);
    expect(resolveReviewStoreListingTarget()).toBe("android");
    expect(await openReviewStoreListing()).toBe(true);
    expect(mockOpenURL).toHaveBeenCalledWith(expect.stringContaining("play.google.com"));
  });

  it.each([
    [{ isIosWebKit: false, isAndroid: true }, "android"],
    [{ isIosWebKit: false, isAndroid: false }, "both"],
    [null, "both"],
  ])("resolves the web target for %o as %s", (matrix, target) => {
    onPlatform({ OS: "web" });
    mockDetectWebPwaBrowserMatrix.mockReturnValue(matrix);
    expect(resolveReviewStoreListingTarget()).toBe(target);
  });

  it("does not open anything for an unknown web platform", async () => {
    onPlatform({ OS: "web" });
    expect(await openReviewStoreListing()).toBe(false);
    expect(mockOpenURL).not.toHaveBeenCalled();
  });

  it("reports a failed URL open", async () => {
    mockOpenURL.mockRejectedValueOnce(new Error("no handler"));
    expect(await openReviewStoreListingUrl("https://x")).toBe(false);
  });
});
