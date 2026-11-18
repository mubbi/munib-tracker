import { mockSecureStore, resetSafeSecureStoreMock } from "@/test-support/mocks/safe-secure-store";

import {
  type AppleOAuthPendingSession,
  clearAppleOAuthPendingSession,
  clearGoogleOAuthPendingSession,
  type GoogleOAuthPendingSession,
  loadAppleOAuthPendingSession,
  loadGoogleOAuthPendingSession,
  saveAppleOAuthPendingSession,
  saveGoogleOAuthPendingSession,
} from "./oauth-pending";

jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);

const GOOGLE_KEY = "munib.oauth.google.pending";
const APPLE_KEY = "munib.oauth.apple.pending";

const google: GoogleOAuthPendingSession = {
  codeVerifier: "verifier",
  redirectUri: "com.googleusercontent.apps.x:/oauth2redirect",
  clientId: "x.apps.googleusercontent.com",
  state: "s1",
  returnTo: "/settings",
};
const apple: AppleOAuthPendingSession = {
  codeVerifier: "verifier",
  redirectUri: "https://my.munibtracker.app/oauth/apple",
  state: "s2",
};

beforeEach(resetSafeSecureStoreMock);

describe("Google pending session", () => {
  it("round-trips and clears", async () => {
    await saveGoogleOAuthPendingSession(google);
    expect(await loadGoogleOAuthPendingSession()).toEqual(google);
    await clearGoogleOAuthPendingSession();
    expect(await loadGoogleOAuthPendingSession()).toBeNull();
  });

  it.each([
    ["corrupt JSON", "{bad"],
    ["a non-object", "42"],
    ["a missing clientId", JSON.stringify({ ...google, clientId: undefined })],
    ["a non-string returnTo", JSON.stringify({ ...google, returnTo: 5 })],
  ])("rejects %s", async (_label, raw) => {
    mockSecureStore.set(GOOGLE_KEY, raw);
    expect(await loadGoogleOAuthPendingSession()).toBeNull();
  });
});

describe("Apple pending session", () => {
  it("round-trips and clears", async () => {
    await saveAppleOAuthPendingSession(apple);
    expect(await loadAppleOAuthPendingSession()).toEqual(apple);
    await clearAppleOAuthPendingSession();
    expect(mockSecureStore.has(APPLE_KEY)).toBe(false);
  });

  it.each([
    ["null", "null"],
    ["a missing state", JSON.stringify({ ...apple, state: undefined })],
  ])("rejects %s", async (_label, raw) => {
    mockSecureStore.set(APPLE_KEY, raw);
    expect(await loadAppleOAuthPendingSession()).toBeNull();
  });
});
