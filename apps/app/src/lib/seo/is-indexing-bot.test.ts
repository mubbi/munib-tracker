import { isIndexingBot } from "@/lib/seo/is-indexing-bot";
import { DESKTOP_CHROME_UA, installBrowser } from "@/test-support/browser";
import { usePlatform, usePlatformSwitch } from "@/test-support/platform";

describe("isIndexingBot", () => {
  const onPlatform = usePlatformSwitch();

  beforeEach(() => onPlatform({ OS: "web" }));

  it("detects Lighthouse and major crawlers", () => {
    expect(
      isIndexingBot(
        "Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 Chrome/119.0.0.0 Mobile Safari/537.36 Chrome-Lighthouse",
      ),
    ).toBe(true);
    expect(
      isIndexingBot("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"),
    ).toBe(true);
    expect(
      isIndexingBot("Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"),
    ).toBe(true);
  });

  it("does not treat normal browsers as bots", () => {
    expect(
      isIndexingBot(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      ),
    ).toBe(false);
    expect(isIndexingBot("")).toBe(false);
  });

  it("is always false on native", () => {
    onPlatform({ OS: "ios" });
    expect(
      isIndexingBot("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"),
    ).toBe(false);
  });
});

describe("isIndexingBot default user agent", () => {
  usePlatform({ OS: "web" });

  it.each([
    ["Mozilla/5.0 (compatible; GPTBot/1.0)", true],
    [DESKTOP_CHROME_UA, false],
  ])("reads navigator.userAgent %s → %p", (userAgent, expected) => {
    const restore = installBrowser({ userAgent });
    try {
      expect(isIndexingBot()).toBe(expected);
    } finally {
      restore();
    }
  });
});
