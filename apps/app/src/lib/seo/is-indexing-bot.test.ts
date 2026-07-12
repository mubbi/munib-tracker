import { Platform } from "react-native";

import { isIndexingBot } from "@/lib/seo/is-indexing-bot";

describe("isIndexingBot", () => {
  const originalOS = Platform.OS;

  beforeEach(() => {
    Platform.OS = "web";
  });

  afterEach(() => {
    Platform.OS = originalOS;
  });

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
    Platform.OS = "ios";
    expect(
      isIndexingBot("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"),
    ).toBe(false);
  });
});
