import { describe, expect, it } from "vitest";
import {
  buildLocalizedAndroidPlayStoreUrl,
  buildLocalizedIosAppStoreUrl,
  OFFICIAL_ANDROID_PACKAGE,
  OFFICIAL_ANDROID_PLAY_STORE_URL,
  OFFICIAL_IOS_APP_STORE_ID,
  OFFICIAL_IOS_APP_STORE_URL,
  OFFICIAL_IOS_BUNDLE_IDENTIFIER,
} from "./site";

describe("store listing URLs", () => {
  it("uses Play package and App Store numeric ID", () => {
    expect(OFFICIAL_ANDROID_PACKAGE).toBe("app.munibtracker");
    expect(OFFICIAL_IOS_BUNDLE_IDENTIFIER).toBe("app.munibtracker");
    expect(OFFICIAL_IOS_APP_STORE_ID).toBe("6787222180");
    expect(OFFICIAL_ANDROID_PLAY_STORE_URL).toBe(
      "https://play.google.com/store/apps/details?id=app.munibtracker",
    );
    expect(OFFICIAL_IOS_APP_STORE_URL).toBe("https://apps.apple.com/app/id6787222180");
  });

  it("localizes storefront hints", () => {
    expect(buildLocalizedIosAppStoreUrl("en")).toBe(OFFICIAL_IOS_APP_STORE_URL);
    expect(buildLocalizedIosAppStoreUrl("ar")).toBe("https://apps.apple.com/sa/app/id6787222180");
    expect(buildLocalizedIosAppStoreUrl("ur")).toBe("https://apps.apple.com/pk/app/id6787222180");
    expect(buildLocalizedAndroidPlayStoreUrl("ar")).toContain("hl=ar");
    expect(buildLocalizedAndroidPlayStoreUrl("ur")).toContain("hl=ur");
  });
});
