import { WEB_COOKIE_SESSION_TOKEN } from "@munib-tracker/api-client";

import { fakeResponse, mockFetch } from "@/test-support/fetch";
import { buildAuthSessionDto, buildAuthUser } from "@/test-support/fixtures/auth";

import {
  authApple,
  authAppleOauth,
  authAppleOauthSession,
  authGoogle,
  authGoogleOauth,
  claimTvPairing,
  completeOAuth,
  createTvPairing,
  deleteAccount,
  getCurrentUser,
  linkAccount,
  logout,
  normalizeAuthSessionResponse,
  pollTvPairing,
  refreshSession,
  requestGuestSession,
  resetAppData,
  syncPull,
  syncPush,
} from "./endpoints";

/** The last request `fetch` received, reduced to what the endpoint controls. */
function lastRequest(fetchMock: jest.Mock) {
  const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
  const headers = init.headers as Record<string, string>;
  return {
    path: new URL(url).pathname.replace(/^\/api\/v1/, "") + new URL(url).search,
    method: init.method,
    body: init.body ? JSON.parse(init.body as string) : undefined,
    authorization: headers.Authorization,
  };
}

describe("normalizeAuthSessionResponse", () => {
  it("passes a native JWT session through", () => {
    const session = buildAuthSessionDto();
    expect(normalizeAuthSessionResponse(session)).toBe(session);
  });

  it("maps a web cookie { user } body onto the cookie-session marker", () => {
    const user = buildAuthUser({ userId: "w1" });
    expect(normalizeAuthSessionResponse({ user })).toEqual({
      accessToken: WEB_COOKIE_SESSION_TOKEN,
      accessTokenExpiresIn: 0,
      refreshToken: WEB_COOKIE_SESSION_TOKEN,
      accountType: "user",
      userId: "w1",
      provider: "google",
    });
  });
});

describe("unauthenticated auth endpoints", () => {
  it.each([
    [
      "requestGuestSession",
      () => requestGuestSession("dev-1"),
      "/auth/guest",
      { deviceId: "dev-1" },
    ],
    [
      "completeOAuth",
      () => completeOAuth("facebook", { code: "c", codeVerifier: "v" }),
      "/auth/oauth/facebook",
      { code: "c", codeVerifier: "v" },
    ],
    ["authGoogle", () => authGoogle("g-token"), "/auth/google", { accessToken: "g-token" }],
    [
      "authGoogleOauth",
      () => authGoogleOauth({ code: "c", redirectUri: "r", codeVerifier: "v" }),
      "/auth/google/oauth",
      { code: "c", redirectUri: "r", codeVerifier: "v" },
    ],
    [
      "authApple",
      () => authApple({ identityToken: "id", displayName: "A" }),
      "/auth/apple",
      { identityToken: "id", displayName: "A" },
    ],
    [
      "authAppleOauth",
      () => authAppleOauth({ code: "c", redirectUri: "r", codeVerifier: "v" }),
      "/auth/apple/oauth",
      { code: "c", redirectUri: "r", codeVerifier: "v" },
    ],
    ["createTvPairing", () => createTvPairing(), "/auth/tv/pairing", undefined],
  ])("%s POSTs to %s", async (_name, call, path, body) => {
    const fetchMock = mockFetch(fakeResponse(buildAuthSessionDto()));
    await call();
    expect(lastRequest(fetchMock)).toEqual({
      path,
      method: "POST",
      body,
      authorization: undefined,
    });
  });

  it("normalises a web cookie OAuth response", async () => {
    mockFetch(fakeResponse({ user: buildAuthUser() }));
    await expect(authGoogle("t")).resolves.toMatchObject({ accessToken: WEB_COOKIE_SESSION_TOKEN });
  });

  it("authAppleOauthSession stores the PKCE session and returns nothing", async () => {
    const fetchMock = mockFetch(fakeResponse(null, { status: 204 }));
    await expect(
      authAppleOauthSession({ codeVerifier: "v", redirectUri: "r", returnUrl: "/x" }),
    ).resolves.toBeUndefined();
    expect(lastRequest(fetchMock).path).toBe("/auth/apple/oauth/session");
  });

  it("pollTvPairing GETs the escaped code", async () => {
    const fetchMock = mockFetch(fakeResponse({ status: "pending" }));
    await expect(pollTvPairing("AB/12")).resolves.toEqual({ status: "pending" });
    expect(lastRequest(fetchMock)).toMatchObject({
      path: "/auth/tv/pairing/AB%2F12",
      method: "GET",
    });
  });

  it("surfaces API errors with their message", async () => {
    mockFetch(fakeResponse({ message: "Nope" }, { status: 400 }));
    await expect(requestGuestSession("d")).rejects.toThrow("Nope");
  });
});

describe("refreshSession", () => {
  it("sends the refresh token for native sessions", async () => {
    const fetchMock = mockFetch(fakeResponse(buildAuthSessionDto()));
    await refreshSession("r1");
    expect(lastRequest(fetchMock)).toMatchObject({
      path: "/auth/refresh",
      body: { refreshToken: "r1" },
    });
  });

  it("sends an empty body for web cookie sessions", async () => {
    const fetchMock = mockFetch(fakeResponse({ user: buildAuthUser() }));
    await refreshSession(WEB_COOKIE_SESSION_TOKEN);
    expect(lastRequest(fetchMock).body).toEqual({});
  });
});

describe("authenticated endpoints", () => {
  it.each([
    [
      "linkAccount",
      () => linkAccount("tok", "apple", { identityToken: "i" }),
      "/auth/link",
      "POST",
      { provider: "apple", identityToken: "i" },
    ],
    ["getCurrentUser", () => getCurrentUser("tok"), "/auth/me", "GET", undefined],
    ["logout", () => logout("tok"), "/auth/logout", "POST", undefined],
    [
      "deleteAccount",
      () => deleteAccount("tok", { confirmation: "DELETE", primaryReason: "other" }),
      "/auth/delete-account",
      "POST",
      { confirmation: "DELETE", primaryReason: "other" },
    ],
    [
      "resetAppData",
      () => resetAppData("tok"),
      "/auth/reset-app-data",
      "POST",
      { confirmation: "RESET" },
    ],
    [
      "claimTvPairing",
      () => claimTvPairing("tok", "ABC"),
      "/auth/tv/pairing/claim",
      "POST",
      { code: "ABC" },
    ],
    ["syncPull (full)", () => syncPull("tok"), "/sync/pull", "GET", undefined],
    [
      "syncPull (delta)",
      () => syncPull("tok", "2026-07-01T00:00:00.000Z"),
      "/sync/pull?since=2026-07-01T00%3A00%3A00.000Z",
      "GET",
      undefined,
    ],
    ["syncPush", () => syncPush("tok", []), "/sync/push", "POST", { changes: [] }],
  ])("%s calls %s with a bearer token", async (_name, call, path, method, body) => {
    const fetchMock = mockFetch(fakeResponse(buildAuthSessionDto()));
    await call();
    expect(lastRequest(fetchMock)).toEqual({ path, method, body, authorization: "Bearer tok" });
  });

  it("omits the bearer header for web cookie sessions", async () => {
    const fetchMock = mockFetch(fakeResponse(buildAuthUser()));
    await getCurrentUser(WEB_COOKIE_SESSION_TOKEN);
    expect(lastRequest(fetchMock).authorization).toBeUndefined();
  });
});
