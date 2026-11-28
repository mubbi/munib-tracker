import {
  OFFICIAL_ANDROID_PLAY_STORE_URL,
  OFFICIAL_IOS_APP_STORE_URL,
} from "@munib-tracker/shared/constants";

import { APP_HTTPS_ORIGIN } from "@/lib/app-links";
import { pathFromInstallReferrer } from "@/lib/deferred-invite";
import {
  androidIntentUrl,
  detectMobileWebOs,
  IOS_APP_OPEN_TIMEOUT_MS,
  type OpenInAppEnv,
  openInNativeApp,
  playStoreUrlWithLink,
} from "@/lib/open-in-app";

const ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Mobile Safari/537.36";
const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1";
const MAC_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15";

describe("detectMobileWebOs", () => {
  it("finds Android and iOS, including iPadOS's desktop UA", () => {
    expect(detectMobileWebOs({ userAgent: ANDROID_UA })).toBe("android");
    expect(detectMobileWebOs({ userAgent: IPHONE_UA })).toBe("ios");
    expect(detectMobileWebOs({ userAgent: MAC_UA, platform: "MacIntel", maxTouchPoints: 5 })).toBe(
      "ios",
    );
  });

  it("leaves desktop browsers alone", () => {
    expect(detectMobileWebOs({ userAgent: MAC_UA, platform: "MacIntel", maxTouchPoints: 0 })).toBe(
      null,
    );
    expect(detectMobileWebOs({ userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" })).toBe(
      null,
    );
  });
});

describe("androidIntentUrl", () => {
  it("targets our package via the app scheme and falls back to the given URL", () => {
    const url = androidIntentUrl("/circle/join/ABCDEFGH23", OFFICIAL_ANDROID_PLAY_STORE_URL);
    expect(url).toBe(
      "intent://circle/join/ABCDEFGH23#Intent;scheme=munib-tracker;package=app.munibtracker;" +
        `S.browser_fallback_url=${encodeURIComponent(OFFICIAL_ANDROID_PLAY_STORE_URL)};end`,
    );
  });

  it("keeps the query string", () => {
    expect(androidIntentUrl("/tv-pair?code=AB12", "https://x.test")).toMatch(
      /^intent:\/\/tv-pair\?code=AB12#Intent;/,
    );
  });
});

function fakeEnv() {
  const navigate = jest.fn();
  const copyText = jest.fn();
  let hideListener: (() => void) | null = null;
  let timer: (() => void) | null = null;
  let hidden = false;
  const env: OpenInAppEnv = {
    navigate,
    copyText,
    isHidden: () => hidden,
    onHide: (listener) => {
      hideListener = listener;
      return () => {
        hideListener = null;
      };
    },
    setTimer: (fn, ms) => {
      expect(ms).toBe(IOS_APP_OPEN_TIMEOUT_MS);
      timer = fn;
      return 1;
    },
    clearTimer: () => {
      timer = null;
    },
  };
  return {
    env,
    navigate,
    copyText,
    appOpened: () => {
      hidden = true;
      hideListener?.();
    },
    elapse: () => timer?.(),
  };
}

describe("openInNativeApp", () => {
  it("Android: one intent hand-off whose Play fallback carries the link", () => {
    const { env, navigate, copyText } = fakeEnv();
    openInNativeApp("/kids/link?token=mtl_abc", "android", env);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate.mock.calls[0][0]).toBe(
      androidIntentUrl(
        "/kids/link?token=mtl_abc",
        playStoreUrlWithLink("/kids/link?token=mtl_abc"),
      ),
    );
    expect(copyText).not.toHaveBeenCalled();
  });

  it("puts the path in the Play referrer the installed app reads back", () => {
    const url = playStoreUrlWithLink("/circle/join/ABCDEFGH23");
    expect(url.startsWith(`${OFFICIAL_ANDROID_PLAY_STORE_URL}&referrer=`)).toBe(true);
    // Play hands the app the decoded `referrer` value.
    const referrer = decodeURIComponent(url.split("&referrer=")[1]);
    expect(pathFromInstallReferrer(referrer)).toBe("/circle/join/ABCDEFGH23");
  });

  it("iOS: copies the link, opens the app scheme and stays put once the app takes over", () => {
    const { env, navigate, copyText, appOpened, elapse } = fakeEnv();
    openInNativeApp("/circle/join/ABCDEFGH23", "ios", env);
    expect(copyText).toHaveBeenCalledWith(`${APP_HTTPS_ORIGIN}/circle/join/ABCDEFGH23`);
    expect(navigate).toHaveBeenCalledWith("munib-tracker://circle/join/ABCDEFGH23");
    appOpened();
    elapse();
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it("iOS: goes to the App Store when nothing opened", () => {
    const { env, navigate, elapse } = fakeEnv();
    openInNativeApp("/circle/join/ABCDEFGH23", "ios", env);
    elapse();
    expect(navigate).toHaveBeenLastCalledWith(OFFICIAL_IOS_APP_STORE_URL);
  });
});
