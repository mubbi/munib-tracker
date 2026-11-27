import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockIsAvailableAsync = jest.fn<() => Promise<boolean>>();
const mockRequestReview = jest.fn<() => Promise<void>>();
const mockOpenURL = jest.fn<(url: string) => Promise<void>>().mockResolvedValue(undefined);
const mockIsTV = jest.fn(() => false);
const mockDetectWebPwaBrowserMatrix = jest.fn<
  () => { isIosWebKit: boolean; isAndroid: boolean } | null
>(() => null);

jest.mock("react-native", () => ({
  Linking: {
    openURL: (...args: unknown[]) => mockOpenURL(...(args as [string])),
  },
  Platform: { OS: "ios" },
}));

jest.mock("expo-store-review", () => ({
  isAvailableAsync: () => mockIsAvailableAsync(),
  requestReview: () => mockRequestReview(),
}));

jest.mock("@/lib/notifications/platform", () => ({
  isExpoGo: () => false,
}));

jest.mock("@/lib/platform/is-tv", () => ({
  isTV: () => mockIsTV(),
}));

jest.mock("@/lib/notifications/browser-capabilities", () => ({
  detectWebPwaBrowserMatrix: () => mockDetectWebPwaBrowserMatrix(),
}));

import {
  canOpenStoreWriteReview,
  isStoreReviewAvailable,
  openStoreWriteReview,
  requestNativeStoreReview,
  resolveReviewStoreListingTarget,
  resolveWriteReviewUrls,
} from "@/lib/platform/storeReview";
import { usePlatformSwitch } from "@/test-support/platform";

describe("storeReview", () => {
  // `react-native` is mocked wholesale (for `Linking`); setPlatform patches that mock's Platform.
  const onPlatform = usePlatformSwitch();

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsAvailableAsync.mockResolvedValue(true);
    mockRequestReview.mockResolvedValue(undefined);
    mockOpenURL.mockResolvedValue(undefined);
    mockIsTV.mockReturnValue(false);
    mockDetectWebPwaBrowserMatrix.mockReturnValue(null);
  });

  describe("requestNativeStoreReview", () => {
    it("hands the request to the OS when available", async () => {
      expect(await requestNativeStoreReview()).toBe(true);
      expect(mockRequestReview).toHaveBeenCalledTimes(1);
    });

    it("does nothing when the OS review API is unavailable (e.g. TestFlight)", async () => {
      mockIsAvailableAsync.mockResolvedValue(false);
      expect(await requestNativeStoreReview()).toBe(false);
      expect(mockRequestReview).not.toHaveBeenCalled();
    });

    it("is never available on web or TV", async () => {
      onPlatform({ OS: "web" });
      expect(await isStoreReviewAvailable()).toBe(false);
      onPlatform({ OS: "android" });
      mockIsTV.mockReturnValue(true);
      expect(await isStoreReviewAvailable()).toBe(false);
      expect(await requestNativeStoreReview()).toBe(false);
      expect(mockRequestReview).not.toHaveBeenCalled();
    });

    it("swallows OS errors and never falls back to a store link", async () => {
      mockRequestReview.mockRejectedValue(new Error("ERR_STORE_REVIEW_FAILED"));
      expect(await requestNativeStoreReview()).toBe(false);
      expect(mockOpenURL).not.toHaveBeenCalled();
    });
  });

  describe("openStoreWriteReview", () => {
    it("opens the App Store review sheet on iOS without the StoreKit prompt", async () => {
      expect(await openStoreWriteReview({ locale: "en" })).toBe(true);
      expect(mockOpenURL).toHaveBeenCalledWith(
        "https://apps.apple.com/app/id6787222180?action=write-review",
      );
      expect(mockRequestReview).not.toHaveBeenCalled();
    });

    it("opens the Play Store app on Android", async () => {
      onPlatform({ OS: "android" });
      expect(await openStoreWriteReview()).toBe(true);
      expect(mockOpenURL).toHaveBeenCalledTimes(1);
      expect(mockOpenURL).toHaveBeenCalledWith("market://details?id=app.munibtracker");
      expect(mockRequestReview).not.toHaveBeenCalled();
    });

    it("falls back to the web listing when the Play Store app can't open", async () => {
      onPlatform({ OS: "android" });
      mockOpenURL.mockRejectedValueOnce(new Error("no activity"));
      expect(await openStoreWriteReview({ locale: "ar" })).toBe(true);
      expect(mockOpenURL).toHaveBeenLastCalledWith(
        "https://play.google.com/store/apps/details?id=app.munibtracker&hl=ar&showAllReviews=true",
      );
    });

    it("resolves false when every URL fails", async () => {
      mockOpenURL.mockRejectedValue(new Error("blocked"));
      expect(await openStoreWriteReview()).toBe(false);
    });

    it("resolves false on desktop web (no single store)", async () => {
      onPlatform({ OS: "web" });
      expect(resolveReviewStoreListingTarget()).toBe("both");
      expect(await openStoreWriteReview()).toBe(false);
      expect(mockOpenURL).not.toHaveBeenCalled();
    });
  });

  it("picks the store from the web browser", () => {
    onPlatform({ OS: "web" });
    mockDetectWebPwaBrowserMatrix.mockReturnValue({ isIosWebKit: true, isAndroid: false });
    expect(resolveReviewStoreListingTarget()).toBe("ios");
    mockDetectWebPwaBrowserMatrix.mockReturnValue({ isIosWebKit: false, isAndroid: true });
    expect(resolveReviewStoreListingTarget()).toBe("android");
    // Web can't take `market://` — only the https listing.
    expect(resolveWriteReviewUrls("android", "en")).toEqual([
      "https://play.google.com/store/apps/details?id=app.munibtracker&hl=en&showAllReviews=true",
    ]);
  });

  it("offers the Rate row only on phone / tablet store builds", () => {
    expect(canOpenStoreWriteReview()).toBe(true);
    mockIsTV.mockReturnValue(true);
    expect(canOpenStoreWriteReview()).toBe(false);
    mockIsTV.mockReturnValue(false);
    onPlatform({ OS: "web" });
    expect(canOpenStoreWriteReview()).toBe(false);
  });
});
