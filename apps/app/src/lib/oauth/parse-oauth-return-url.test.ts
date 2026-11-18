import { parseAppleOAuthReturnUrl, parseOAuthReturnUrl } from "./parse-oauth-return-url";

describe("parseOAuthReturnUrl", () => {
  it.each([
    ["munib-tracker:/oauth2redirect?code=abc&state=s", { code: "abc", state: "s" }],
    ["my.munibtracker.app/oauth?code=abc", { code: "abc", state: null }],
    ["https://x.app/cb#code=h1&state=hs", { code: "h1", state: "hs" }],
  ])("parses %s", (url, expected) => {
    expect(parseOAuthReturnUrl(url)).toEqual(expected);
  });

  it.each(["", "   ", "https://x.app/cb?error=denied", "https://x.app/cb#token=1", "http://[bad"])(
    "returns null for %p",
    (url) => {
      expect(parseOAuthReturnUrl(url)).toBeNull();
    },
  );
});

describe("parseAppleOAuthReturnUrl", () => {
  it.each([
    "https://my.munibtracker.app/oauth/apple?code=a",
    "https://my.munibtracker.app/oauth/apple/?code=a",
    "my.munibtracker.app/en/oauth/apple?code=a",
  ])("accepts %s", (url) => {
    expect(parseAppleOAuthReturnUrl(url)).toEqual({ code: "a", state: null });
  });

  it.each([
    "https://my.munibtracker.app/oauth/google?code=a",
    "https://my.munibtracker.app/oauth/apple",
  ])("rejects %s", (url) => {
    expect(parseAppleOAuthReturnUrl(url)).toBeNull();
  });
});
