import {
  buildLocalizedAndroidPlayStoreUrl,
  buildLocalizedIosAppStoreUrl,
  buildMarketingSiteUrl,
  OFFICIAL_APP_WEB_ORIGIN,
} from "@munib-tracker/shared/constants";
import { renderHook } from "@testing-library/react-native";

import i18n from "@/i18n";
import { installBrowser } from "@/test-support/browser";
import { setPlatform } from "@/test-support/platform";

import { useLocalizedSiteUrls } from "./use-localized-site-urls";

const originalAppUrl = process.env.EXPO_PUBLIC_APP_URL;
const restores: Array<() => void> = [];

async function urls() {
  const { result } = await renderHook(() => useLocalizedSiteUrls());
  return result.current;
}

afterEach(() => {
  while (restores.length) restores.pop()?.();
  if (originalAppUrl === undefined) delete process.env.EXPO_PUBLIC_APP_URL;
  else process.env.EXPO_PUBLIC_APP_URL = originalAppUrl;
});

describe("useLocalizedSiteUrls", () => {
  beforeEach(() => {
    delete process.env.EXPO_PUBLIC_APP_URL;
  });

  it("builds store and marketing URLs for the app language", async () => {
    const locale = i18n.language;
    expect(await urls()).toEqual({
      locale,
      marketingHomeUrl: buildMarketingSiteUrl(locale),
      webAppUrl: OFFICIAL_APP_WEB_ORIGIN,
      iosAppStoreUrl: buildLocalizedIosAppStoreUrl(locale),
      androidPlayStoreUrl: buildLocalizedAndroidPlayStoreUrl(locale),
    });
  });

  it("prefers the configured app URL without a trailing slash", async () => {
    process.env.EXPO_PUBLIC_APP_URL = " https://staging.example/ ";
    expect((await urls()).webAppUrl).toBe("https://staging.example");
  });

  it("uses the current origin on web", async () => {
    restores.push(setPlatform({ OS: "web" }));
    restores.push(installBrowser({ window: { location: { origin: "http://localhost:8081/" } } }));
    expect((await urls()).webAppUrl).toBe("http://localhost:8081");
  });

  it("falls back to the official origin on web without a location", async () => {
    restores.push(setPlatform({ OS: "web" }));
    restores.push(installBrowser({ window: { location: undefined } }));
    expect((await urls()).webAppUrl).toBe(OFFICIAL_APP_WEB_ORIGIN);
  });
});
