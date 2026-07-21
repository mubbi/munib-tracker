import { detectWebPwaBrowserMatrixFromUserAgent } from "@/lib/notifications/browser-capabilities";

const IOS_CHROME_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1";

const IOS_SAFARI_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

const DESKTOP_CHROME_WINDOWS_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const DESKTOP_EDGE_WINDOWS_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0";

const ANDROID_CHROME_UA =
  "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

const DESKTOP_FIREFOX_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0";

describe("browser-capabilities (Bowser tiers)", () => {
  it("classifies desktop Windows Chrome as chromium_full (never iOS)", () => {
    const matrix = detectWebPwaBrowserMatrixFromUserAgent(DESKTOP_CHROME_WINDOWS_UA);
    expect(matrix.tier).toBe("chromium_full");
    expect(matrix.isIosWebKit).toBe(false);
    expect(matrix.needsSafariForInstall).toBe(false);
  });

  it("classifies desktop Windows Edge and Android Chrome as chromium_full", () => {
    expect(detectWebPwaBrowserMatrixFromUserAgent(DESKTOP_EDGE_WINDOWS_UA).tier).toBe(
      "chromium_full",
    );
    expect(detectWebPwaBrowserMatrixFromUserAgent(ANDROID_CHROME_UA).tier).toBe("chromium_full");
  });

  it("classifies iOS Chrome and Safari as the same WebKit tab tier", () => {
    const chrome = detectWebPwaBrowserMatrixFromUserAgent(IOS_CHROME_UA);
    const safari = detectWebPwaBrowserMatrixFromUserAgent(IOS_SAFARI_UA);
    expect(chrome.tier).toBe("ios_webkit_tab");
    expect(safari.tier).toBe("ios_webkit_tab");
    expect(chrome.needsSafariForInstall).toBe(true);
    expect(safari.needsSafariForInstall).toBe(false);
  });

  it("classifies desktop Firefox as chromium_full (Web Push capable)", () => {
    expect(detectWebPwaBrowserMatrixFromUserAgent(DESKTOP_FIREFOX_UA).tier).toBe("chromium_full");
  });
});
