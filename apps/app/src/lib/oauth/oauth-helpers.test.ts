import {
  buildGoogleNativeRedirectUri,
  googleClientIdToReversedScheme,
} from "@/lib/auth/oauth-config";
import { parseAppleOAuthReturnUrl, parseOAuthReturnUrl } from "@/lib/oauth/parse-oauth-return-url";

describe("googleClientIdToReversedScheme", () => {
  it("reverses a standard Google client id", () => {
    expect(googleClientIdToReversedScheme("123-abc.apps.googleusercontent.com")).toBe(
      "com.googleusercontent.apps.123-abc",
    );
  });

  it("returns null for invalid ids", () => {
    expect(googleClientIdToReversedScheme("not-a-client")).toBeNull();
  });
});

describe("buildGoogleNativeRedirectUri", () => {
  it("uses a single colon (not ://)", () => {
    expect(buildGoogleNativeRedirectUri("com.googleusercontent.apps.123")).toBe(
      "com.googleusercontent.apps.123:/oauthredirect",
    );
  });
});

describe("parseOAuthReturnUrl", () => {
  it("parses code from query", () => {
    expect(parseOAuthReturnUrl("munib-tracker:/oauthredirect?code=abc&state=s1")).toEqual({
      code: "abc",
      state: "s1",
    });
  });
});

describe("parseAppleOAuthReturnUrl", () => {
  it("only accepts /oauth/apple paths", () => {
    expect(
      parseAppleOAuthReturnUrl("https://my.munibtracker.app/oauth/apple?code=c1&state=s"),
    ).toEqual({ code: "c1", state: "s" });
    expect(parseAppleOAuthReturnUrl("https://my.munibtracker.app/other?code=c1")).toBeNull();
  });
});
