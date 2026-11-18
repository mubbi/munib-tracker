import * as AppleAuthentication from "expo-apple-authentication";
import * as WebBrowser from "expo-web-browser";

import { ACCOUNT_CLOSURE_CONFIRMATION, ACCOUNT_CLOSURE_REASONS } from "./account-closure-reasons";
import * as appleIos from "./appleAuth.ios";
import * as appleFallback from "./appleAuth.ts";

jest.mock("expo-apple-authentication", () => ({
  isAvailableAsync: jest.fn(async () => true),
  signInAsync: jest.fn(async () => ({
    identityToken: "jwt",
    fullName: { givenName: "Amina", familyName: null },
    email: "a@example.com",
    user: "u",
  })),
  AppleAuthenticationScope: { FULL_NAME: 0, EMAIL: 1 },
}));
jest.mock("expo-web-browser", () => ({ maybeCompleteAuthSession: jest.fn() }));

describe("account closure reasons", () => {
  it("lists the API's reason codes and confirmation word", () => {
    expect(ACCOUNT_CLOSURE_REASONS).toContain("privacy_concerns");
    expect(ACCOUNT_CLOSURE_REASONS.at(-1)).toBe("other");
    expect(ACCOUNT_CLOSURE_CONFIRMATION).toBe("DELETE");
  });
});

describe("native Sign in with Apple (iOS)", () => {
  it("reports availability from the native module", async () => {
    expect(await appleIos.isAppleAuthAvailable()).toBe(true);
  });

  it("requests name + email and returns the credential subset", async () => {
    expect(await appleIos.signInWithAppleNative()).toEqual({
      identityToken: "jwt",
      fullName: { givenName: "Amina", familyName: null },
      email: "a@example.com",
    });
    expect(AppleAuthentication.signInAsync).toHaveBeenCalledWith({ requestedScopes: [0, 1] });
  });
});

describe("native Sign in with Apple (other platforms)", () => {
  it("is unavailable and refuses to sign in", async () => {
    expect(await appleFallback.isAppleAuthAvailable()).toBe(false);
    await expect(appleFallback.signInWithAppleNative()).rejects.toThrow("only available on iOS");
  });
});

describe("auth-session bootstrap", () => {
  it("completes a pending web auth popup on import", () => {
    jest.isolateModules(() => {
      require("./auth-session-bootstrap");
    });
    expect(WebBrowser.maybeCompleteAuthSession).toHaveBeenCalled();
  });

  it("swallows errors outside a popup", () => {
    jest.mocked(WebBrowser.maybeCompleteAuthSession).mockImplementationOnce(() => {
      throw new Error("no popup");
    });
    expect(() =>
      jest.isolateModules(() => {
        require("./auth-session-bootstrap");
      }),
    ).not.toThrow();
  });
});
