import { Linking } from "react-native";

import { installBrowser } from "@/test-support/browser";
import { buildAppVersionMeta } from "@/test-support/fixtures/app-version";
import { mockExpoConstants, resetExpoConstantsMock } from "@/test-support/mocks/expo-constants";
import { usePlatform } from "@/test-support/platform";

import {
  isWebPlatform,
  performAppUpdate,
  reloadWebWithCacheBust,
  resolveStoreUrl,
} from "./app-update-actions";

jest.mock("expo-constants", () => require("@/test-support/mocks/expo-constants").expoConstantsMock);

const mockMarkDismissed = jest.fn();
jest.mock("@/lib/app/app-update-dismiss", () => ({
  markWebSoftUpdateDismissedSync: (version: string) => mockMarkDismissed(version),
}));

let openURL: jest.SpyInstance;
beforeEach(() => {
  resetExpoConstantsMock();
  mockMarkDismissed.mockClear();
  openURL = jest.spyOn(Linking, "openURL").mockResolvedValue(true);
  openURL.mockClear();
});

describe("resolveStoreUrl", () => {
  it.each([
    "https://apps.apple.com/app/id1",
    "https://play.google.com/store/apps/details?id=x",
    "https://testflight.apple.com/join/abc",
  ])("trusts the server store URL %s", (storeUrl) => {
    expect(resolveStoreUrl(buildAppVersionMeta({ storeUrl }))).toBe(storeUrl);
  });

  it.each(["http://apps.apple.com/x", "https://evil.example/x", "not a url"])(
    "falls back from the untrusted URL %s to the App Store on iOS",
    (storeUrl) => {
      expect(resolveStoreUrl(buildAppVersionMeta({ storeUrl }), "ar")).toMatch(
        /^https:\/\/apps\.apple\.com\//,
      );
    },
  );

  describe("on Android", () => {
    usePlatform({ OS: "android" });

    it("uses the Play Store when the package is configured", () => {
      mockExpoConstants.expoConfig = { android: { package: "app.munib" } };
      expect(resolveStoreUrl(buildAppVersionMeta())).toMatch(/play\.google\.com/);
    });

    it("returns null without a package", () => {
      expect(resolveStoreUrl(buildAppVersionMeta())).toBeNull();
    });
  });
});

describe("performAppUpdate", () => {
  it("opens the store on native", () => {
    performAppUpdate(buildAppVersionMeta(), { locale: "en" });
    expect(openURL).toHaveBeenCalledWith(expect.stringMatching(/apps\.apple\.com/));
  });

  it("swallows store open failures", async () => {
    openURL.mockRejectedValueOnce(new Error("no store"));
    expect(() => performAppUpdate(buildAppVersionMeta())).not.toThrow();
    await Promise.resolve();
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });
    let location: { href: string; assign: jest.Mock; reload: jest.Mock };
    let restore: () => void = () => {};

    beforeEach(() => {
      location = { href: "https://app.example/settings?x=1", assign: jest.fn(), reload: jest.fn() };
      restore = installBrowser({ window: { location } });
    });
    afterEach(() => restore());

    it("marks a soft update dismissed and reloads with a cache-buster", () => {
      performAppUpdate(buildAppVersionMeta({ latestVersion: "1.2.0" }));
      expect(mockMarkDismissed).toHaveBeenCalledWith("1.2.0");
      expect(location.assign).toHaveBeenCalledWith(expect.stringMatching(/\?x=1&_cb=\d+$/));
    });

    it("does not mark hard updates dismissed", () => {
      performAppUpdate(buildAppVersionMeta({ updateRequired: "hard" }), { isHard: true });
      expect(mockMarkDismissed).not.toHaveBeenCalled();
      expect(location.assign).toHaveBeenCalled();
    });

    it("falls back to a plain reload for an unparsable URL", () => {
      location.href = "::bad::";
      reloadWebWithCacheBust();
      expect(location.reload).toHaveBeenCalled();
    });

    it("reports the web platform", () => {
      expect(isWebPlatform()).toBe(true);
    });
  });
});

it("reports native platforms as not web", () => {
  expect(isWebPlatform()).toBe(false);
});
