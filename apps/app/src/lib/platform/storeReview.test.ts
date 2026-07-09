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

describe("storeReview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAvailableAsync.mockResolvedValue(true);
    mockRequestReview.mockResolvedValue(undefined);
    mockDetectWebPwaBrowserMatrix.mockReturnValue(null);
    const rn = jest.requireMock<{ Platform: { OS: string } }>("react-native");
    rn.Platform.OS = "ios";
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
    const rn = jest.requireMock<{ Platform: { OS: string } }>("react-native");
    rn.Platform.OS = "web";
    expect(await isStoreReviewAvailable()).toBe(false);
    expect(await requestStoreReviewIfAvailable()).toBe(false);
  });

  it("opens the App Store listing on web iOS", async () => {
    const rn = jest.requireMock<{ Platform: { OS: string } }>("react-native");
    rn.Platform.OS = "web";
    mockDetectWebPwaBrowserMatrix.mockReturnValue({ isIosWebKit: true, isAndroid: false });

    expect(resolveReviewStoreListingTarget()).toBe("ios");
    const ok = await openReviewStoreListing({ locale: "en" });
    expect(ok).toBe(true);
    expect(mockOpenURL).toHaveBeenCalledWith(expect.stringContaining("munibtracker.app/download"));
  });

  it("opens store listing URLs directly", async () => {
    const url = resolveReviewStoreListingUrl("android", "en");
    expect(url).toContain("play.google.com");
    await openReviewStoreListingUrl(url);
    expect(mockOpenURL).toHaveBeenCalledWith(url);
  });
});
