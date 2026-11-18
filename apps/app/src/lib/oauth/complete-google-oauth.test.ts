import * as AuthSession from "expo-auth-session";

import {
  exchangeGoogleCodeAndClearPending,
  exchangeGoogleCodeForAccessToken,
  GOOGLE_DISCOVERY,
} from "./complete-google-oauth";
import { clearGoogleAuthorizationCodeExchangeGuard } from "./google-oauth-exchange-guard";
import type { GoogleOAuthPendingSession } from "./oauth-pending";

jest.mock("expo-auth-session", () => ({ exchangeCodeAsync: jest.fn() }));
const mockClearPending = jest.fn(async () => undefined);
jest.mock("@/lib/oauth/oauth-pending", () => ({
  clearGoogleOAuthPendingSession: () => mockClearPending(),
}));

const exchangeCodeAsync = jest.mocked(AuthSession.exchangeCodeAsync);
const SESSION: GoogleOAuthPendingSession = {
  codeVerifier: "verifier",
  redirectUri: "com.googleusercontent.apps.x:/oauth2redirect",
  clientId: "x.apps.googleusercontent.com",
  state: "s",
};

beforeEach(() => {
  clearGoogleAuthorizationCodeExchangeGuard();
  exchangeCodeAsync.mockReset();
  mockClearPending.mockClear();
});

describe("exchangeGoogleCodeForAccessToken", () => {
  it("exchanges with PKCE against Google's token endpoint", async () => {
    exchangeCodeAsync.mockResolvedValue({ accessToken: " tok " } as never);
    expect(await exchangeGoogleCodeForAccessToken(SESSION, "code")).toBe("tok");
    expect(exchangeCodeAsync).toHaveBeenCalledWith(
      {
        clientId: SESSION.clientId,
        redirectUri: SESSION.redirectUri,
        code: "code",
        extraParams: { code_verifier: "verifier" },
      },
      GOOGLE_DISCOVERY,
    );
  });

  it.each([{ accessToken: "  " }, null])(
    "rejects a response without a token (%p)",
    async (response) => {
      exchangeCodeAsync.mockResolvedValue(response as never);
      await expect(exchangeGoogleCodeForAccessToken(SESSION, "code")).rejects.toThrow(
        "did not return an access token",
      );
    },
  );
});

describe("exchangeGoogleCodeAndClearPending", () => {
  it("returns the token and clears the pending session", async () => {
    exchangeCodeAsync.mockResolvedValue({ accessToken: "tok" } as never);
    expect(await exchangeGoogleCodeAndClearPending(SESSION, "code-a")).toBe("tok");
    expect(mockClearPending).toHaveBeenCalled();
  });

  it("returns null for an already-exchanged code", async () => {
    exchangeCodeAsync.mockResolvedValue({ accessToken: "tok" } as never);
    await exchangeGoogleCodeAndClearPending(SESSION, "code-b");
    expect(await exchangeGoogleCodeAndClearPending(SESSION, "code-b")).toBeNull();
    expect(exchangeCodeAsync).toHaveBeenCalledTimes(1);
  });

  it("clears the pending session even when the exchange fails", async () => {
    exchangeCodeAsync.mockRejectedValue(new Error("invalid_grant"));
    await expect(exchangeGoogleCodeAndClearPending(SESSION, "code-c")).rejects.toThrow(
      "invalid_grant",
    );
    expect(mockClearPending).toHaveBeenCalled();
  });
});
