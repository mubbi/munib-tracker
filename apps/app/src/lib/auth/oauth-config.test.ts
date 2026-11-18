import * as AuthSession from "expo-auth-session";

import { installBrowser } from "@/test-support/browser";
import { usePlatform } from "@/test-support/platform";

import {
  getAppIdentifier,
  getAppleOAuthReturnUrl,
  getAppleRedirectUri,
  getFacebookAppId,
  getFacebookRedirectUri,
  getGoogleRedirectUri,
  getWebAppOrigin,
  isFacebookConfigured,
  resolveGoogleClientId,
} from "./oauth-config";

jest.mock("expo-auth-session", () => ({
  makeRedirectUri: jest.fn(() => "https://my.munibtracker.app"),
}));

const ENV_KEYS = [
  "EXPO_PUBLIC_GOOGLE_CLIENT_ID",
  "EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS",
  "EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID",
  "EXPO_PUBLIC_APP_IDENTIFIER",
  "EXPO_PUBLIC_WEB_APP_ORIGIN",
  "EXPO_PUBLIC_APP_URL",
  "EXPO_PUBLIC_FACEBOOK_APP_ID",
] as const;
const saved = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));

function setEnv(values: Partial<Record<(typeof ENV_KEYS)[number], string>>) {
  Object.assign(process.env, values);
}

beforeEach(() => {
  for (const key of ENV_KEYS) delete process.env[key];
});
afterEach(() => {
  for (const key of ENV_KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
});

describe("env-derived settings", () => {
  it("falls back to the shared Google client id", () => {
    setEnv({ EXPO_PUBLIC_GOOGLE_CLIENT_ID: " shared " });
    expect(resolveGoogleClientId()).toBe("shared");
  });

  it.each([
    [{}, "app.munibtracker"],
    [{ EXPO_PUBLIC_APP_IDENTIFIER: " com.example " }, "com.example"],
  ])("app identifier with %o is %s", (env, expected) => {
    setEnv(env);
    expect(getAppIdentifier()).toBe(expected);
  });

  it.each([
    [{}, "https://my.munibtracker.app"],
    [{ EXPO_PUBLIC_APP_URL: "https://app.example/" }, "https://app.example"],
    [
      { EXPO_PUBLIC_WEB_APP_ORIGIN: "https://web.example", EXPO_PUBLIC_APP_URL: "https://x" },
      "https://web.example",
    ],
  ])("web origin with %o is %s", (env, expected) => {
    setEnv(env);
    expect(getWebAppOrigin()).toBe(expected);
  });

  it("detects Facebook configuration", () => {
    expect(isFacebookConfigured()).toBe(false);
    setEnv({ EXPO_PUBLIC_FACEBOOK_APP_ID: "123" });
    expect(getFacebookAppId()).toBe("123");
    expect(isFacebookConfigured()).toBe(true);
  });
});

describe("native redirect URIs", () => {
  it("uses the reversed Google client id scheme", () => {
    setEnv({ EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS: "123-abc.apps.googleusercontent.com" });
    expect(getGoogleRedirectUri()).toBe("com.googleusercontent.apps.123-abc:/oauth2redirect");
  });

  it("falls back to the app scheme without a valid Google client id", () => {
    expect(getGoogleRedirectUri()).toBe("munib-tracker:/oauth2redirect");
  });

  it("uses the HTTPS App Link for Apple", () => {
    setEnv({ EXPO_PUBLIC_WEB_APP_ORIGIN: "https://web.example" });
    expect(getAppleRedirectUri()).toBe("https://web.example/oauth/apple");
  });

  it("uses the app scheme for Facebook", () => {
    expect(getFacebookRedirectUri()).toBe("munib-tracker:/oauth2redirect");
  });

  it("returns the web origin as the Apple return URL without a browser location", () => {
    expect(getAppleOAuthReturnUrl()).toBe("https://my.munibtracker.app");
  });
});

describe("web redirect URIs", () => {
  usePlatform({ OS: "web" });

  it("uses the app origin for Google and Facebook", () => {
    expect(getGoogleRedirectUri()).toBe("https://my.munibtracker.app");
    expect(getFacebookRedirectUri()).toBe("https://my.munibtracker.app");
    expect(AuthSession.makeRedirectUri).toHaveBeenCalledWith({ scheme: "munib-tracker" });
  });

  it("uses the API form_post callback for Apple", () => {
    expect(getAppleRedirectUri()).toMatch(/\/auth\/apple\/oauth\/callback$/);
  });

  it("returns to the current page after Apple sign-in", () => {
    const restore = installBrowser({
      window: {
        location: {
          origin: "https://my.munibtracker.app",
          pathname: "",
          search: "?a=1",
          hash: "#x",
        },
      },
    });
    try {
      expect(getAppleOAuthReturnUrl()).toBe("https://my.munibtracker.app/?a=1#x");
    } finally {
      restore();
    }
  });
});
