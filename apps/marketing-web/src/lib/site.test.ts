import {
  OFFICIAL_ANDROID_PLAY_STORE_URL,
  OFFICIAL_IOS_APP_STORE_ID,
} from "@munib-tracker/shared/constants";
import { describe, expect, it } from "vitest";
import { appQuranAyahUrl, PRODUCT_APP_URL, productAppUrl, storeUrls } from "@/lib/site";

describe("locale-aware app links", () => {
  it("opens the product web app in the visitor's language", () => {
    expect(productAppUrl("en")).toBe(PRODUCT_APP_URL);
    expect(productAppUrl("ar")).toBe(`${PRODUCT_APP_URL}/ar`);
    expect(productAppUrl("ur", "/quran/practice")).toBe(`${PRODUCT_APP_URL}/ur/quran/practice`);
    expect(appQuranAyahUrl(50, 33, "ur")).toBe(`${PRODUCT_APP_URL}/ur/quran/50?ayah=33`);
    expect(appQuranAyahUrl(11, 75, "en")).toBe(`${PRODUCT_APP_URL}/quran/11?ayah=75`);
  });

  it("uses the app's storefront hints for the store listings", () => {
    expect(storeUrls("ar")).toEqual({
      ios: `https://apps.apple.com/sa/app/id${OFFICIAL_IOS_APP_STORE_ID}`,
      android: `${OFFICIAL_ANDROID_PLAY_STORE_URL}&hl=ar`,
    });
    expect(storeUrls("ur").android).toBe(`${OFFICIAL_ANDROID_PLAY_STORE_URL}&hl=ur`);
    expect(storeUrls("en").ios).toBe(`https://apps.apple.com/app/id${OFFICIAL_IOS_APP_STORE_ID}`);
  });

  it("tags Google Play links with an install referrer for store attribution", () => {
    const { android } = storeUrls("ar", { placement: "feature_hero", content: "qibla-finder" });
    const url = new URL(android);
    expect(url.searchParams.get("id")).toBe("app.munibtracker");
    expect(url.searchParams.get("hl")).toBe("ar");
    expect(url.searchParams.get("referrer")).toBe(
      "utm_source=munibtracker.app&utm_medium=referral&utm_campaign=feature_hero&utm_content=qibla-finder",
    );
  });

  it("leaves App Store links untagged until a provider token is configured", () => {
    // NEXT_PUBLIC_APPLE_PROVIDER_TOKEN is unset in tests: Apple ignores `ct` without `pt`.
    expect(storeUrls("en", { placement: "download" }).ios).toBe(
      `https://apps.apple.com/app/id${OFFICIAL_IOS_APP_STORE_ID}`,
    );
  });
});
