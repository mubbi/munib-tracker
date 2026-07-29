import { Platform } from "react-native";

import {
  buildGoogleNativeRedirectUri,
  googleClientIdToReversedScheme,
  isAppleConfigured,
  isGoogleConfigured,
  resolveGoogleClientId,
} from "@/lib/auth/oauth-config";
import { OAUTH_RESUME_FALLBACK_HREF, sanitizeOAuthReturnTo } from "@/lib/oauth/oauth-return-to";
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
      "com.googleusercontent.apps.123:/oauth2redirect",
    );
  });
});

describe("parseOAuthReturnUrl", () => {
  it("parses code from query", () => {
    expect(parseOAuthReturnUrl("munib-tracker:/oauth2redirect?code=abc&state=s1")).toEqual({
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

describe("sanitizeOAuthReturnTo", () => {
  it("keeps safe in-app paths", () => {
    expect(sanitizeOAuthReturnTo("/profile")).toBe("/profile");
    expect(sanitizeOAuthReturnTo("/login")).toBe("/login");
    expect(sanitizeOAuthReturnTo("/(auth)/login")).toBe("/(auth)/login");
  });

  it("rejects external or malformed values", () => {
    expect(sanitizeOAuthReturnTo("https://evil.example")).toBe(OAUTH_RESUME_FALLBACK_HREF);
    expect(sanitizeOAuthReturnTo("//evil.example")).toBe(OAUTH_RESUME_FALLBACK_HREF);
    expect(sanitizeOAuthReturnTo("profile")).toBe(OAUTH_RESUME_FALLBACK_HREF);
    expect(sanitizeOAuthReturnTo(null)).toBe(OAUTH_RESUME_FALLBACK_HREF);
    expect(sanitizeOAuthReturnTo(undefined)).toBe(OAUTH_RESUME_FALLBACK_HREF);
  });
});

describe("OAuth provider visibility config", () => {
  const originalOS = Platform.OS;
  const envKeys = [
    "EXPO_PUBLIC_GOOGLE_CLIENT_ID",
    "EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB",
    "EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS",
    "EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID",
    "EXPO_PUBLIC_APPLE_SERVICES_ID",
  ] as const;
  const savedEnv: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const key of envKeys) {
      savedEnv[key] = process.env[key];
      delete process.env[key];
    }
  });

  afterEach(() => {
    Platform.OS = originalOS;
    for (const key of envKeys) {
      const value = savedEnv[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  it("resolves Google client ids per platform with shared fallback", () => {
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID = "fallback.apps.googleusercontent.com";
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB = "web.apps.googleusercontent.com";
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS = "ios.apps.googleusercontent.com";
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID = "android.apps.googleusercontent.com";

    Platform.OS = "web";
    expect(resolveGoogleClientId()).toBe("web.apps.googleusercontent.com");
    expect(isGoogleConfigured()).toBe(true);

    Platform.OS = "ios";
    expect(resolveGoogleClientId()).toBe("ios.apps.googleusercontent.com");
    expect(isGoogleConfigured()).toBe(true);

    Platform.OS = "android";
    expect(resolveGoogleClientId()).toBe("android.apps.googleusercontent.com");
    expect(isGoogleConfigured()).toBe(true);
  });

  it("shows Apple on web and Android when Services ID is set", () => {
    process.env.EXPO_PUBLIC_APPLE_SERVICES_ID = "com.munibtracker.web";

    for (const os of ["web", "android", "ios"] as const) {
      Platform.OS = os;
      expect(isAppleConfigured(false)).toBe(true);
    }
  });

  it("hides Apple on web/Android without Services ID, allows native iOS", () => {
    Platform.OS = "web";
    expect(isAppleConfigured(false)).toBe(false);

    Platform.OS = "android";
    expect(isAppleConfigured(false)).toBe(false);

    Platform.OS = "ios";
    expect(isAppleConfigured(false)).toBe(false);
    expect(isAppleConfigured(true)).toBe(true);
  });
});
