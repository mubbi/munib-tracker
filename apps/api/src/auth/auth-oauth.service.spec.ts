import { UnauthorizedException } from "@nestjs/common";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { EnvironmentVariables } from "../config/env.schema";
import { buildSession } from "../test-support/fixtures/session";
import { buildAuthUser } from "../test-support/fixtures/user";
import { buildRequest, buildResponse, type RequestOverrides } from "../test-support/http";
import { buildConfig } from "../test-support/oauth";
import { APPLE_OAUTH_SESSION_COOKIE } from "./apple-oauth-session-cookie";
import type { AuthService } from "./auth.service";
import {
  ACCESS_TOKEN_COOKIE,
  openAuthCookieValue,
  REFRESH_TOKEN_COOKIE,
  sealAuthCookieValue,
} from "./auth-cookies";
import { AuthOAuthService } from "./auth-oauth.service";
import { isAuthOAuthRateLimited } from "./auth-rate-limit";
import { AuthProvider } from "./dto/auth.dto";
import { GoogleAccessTokenAudienceError, verifyGoogleAccessToken } from "./google-access-token";
import type { OAuthProviderService } from "./oauth-provider.service";

vi.mock("./auth-rate-limit", () => ({ isAuthOAuthRateLimited: vi.fn() }));

vi.mock("./google-access-token", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./google-access-token")>();
  return { ...actual, verifyGoogleAccessToken: vi.fn() };
});

const SESSION = buildSession();
const USER = buildAuthUser();
const APPLE_PROFILE = { providerAccountId: "apple-1", email: "a@b.c" };
const CODE_DTO = { code: "c", redirectUri: "https://app.example/cb", codeVerifier: "v" };
const APPLE_SESSION_COOKIE = JSON.stringify({
  codeVerifier: "verifier",
  redirectUri: "https://api.example/cb",
  returnUrl: "https://app.example/login?x=1",
});

function setup(env: Partial<EnvironmentVariables> = {}) {
  const authService = {
    completeOAuthFromProfile: vi.fn().mockResolvedValue(SESSION),
    completeOAuth: vi.fn().mockResolvedValue(SESSION),
    getCurrentUser: vi.fn().mockResolvedValue(USER),
  };
  const oauthProvider = { exchange: vi.fn().mockResolvedValue({ ...APPLE_PROFILE }) };
  const service = new AuthOAuthService(
    authService as unknown as AuthService,
    oauthProvider as unknown as OAuthProviderService,
    buildConfig(env),
  );
  return { service, authService, oauthProvider, res: buildResponse() };
}

function appleCallbackRequest(body: Record<string, unknown>) {
  return buildRequest({ body, cookies: { [APPLE_OAUTH_SESSION_COOKIE]: APPLE_SESSION_COOKIE } });
}

describe("AuthOAuthService", () => {
  beforeEach(() => {
    vi.mocked(isAuthOAuthRateLimited).mockReset().mockResolvedValue(false);
    vi.mocked(verifyGoogleAccessToken).mockReset();
  });

  describe("issueSessionResponse", () => {
    it("returns the raw session to native clients without cookies", async () => {
      const { service, res } = setup();
      await expect(service.issueSessionResponse(buildRequest(), res, SESSION, USER)).resolves.toBe(
        SESSION,
      );
      expect(res.cookie).not.toHaveBeenCalled();
    });

    it("returns only the user to web clients", async () => {
      const { service, res } = setup();
      const req = buildRequest({ headers: { "x-munib-tracker-client": " Web " } });
      await expect(service.issueSessionResponse(req, res, SESSION, USER)).resolves.toEqual({
        user: USER,
      });
    });

    it("writes sealed refresh and access cookies for web clients", async () => {
      const { service, res } = setup();
      const req = buildRequest({ headers: { "x-munib-tracker-client": "web" } });
      await service.issueSessionResponse(req, res, SESSION, USER);
      const written = res.cookie.mock.calls.map(([name, value]) => [
        name,
        openAuthCookieValue(value),
      ]);
      expect(written).toEqual([
        [REFRESH_TOKEN_COOKIE, SESSION.refreshToken],
        [ACCESS_TOKEN_COOKIE, SESSION.accessToken],
      ]);
    });
  });

  describe("OAuth rate limit", () => {
    it("responds 429 when the client is over quota", async () => {
      const { service, res } = setup();
      vi.mocked(isAuthOAuthRateLimited).mockResolvedValueOnce(true);
      await expect(
        service.completeGoogleNative(buildRequest(), res, { accessToken: "tok" }),
      ).rejects.toMatchObject({ status: 429 });
    });

    it.each<[string, RequestOverrides, string]>([
      [
        "nearest proxy hop (a spoofed first hop is ignored)",
        { headers: { "x-forwarded-for": " 9.9.9.9 , 10.0.0.1" } },
        "10.0.0.1",
      ],
      ["single edge hop", { headers: { "x-forwarded-for": ",10.0.0.1" } }, "10.0.0.1"],
      ["array header", { headers: { "x-forwarded-for": ["8.8.8.8, 10.0.0.2"] } }, "10.0.0.2"],
      ["blank-only array header", { headers: { "x-forwarded-for": [" , "] } }, "unknown"],
      ["socket ip", { headers: { "x-forwarded-for": "   " }, ip: " 7.7.7.7 " }, "7.7.7.7"],
      ["blank socket ip", { headers: { "x-forwarded-for": [] as string[] }, ip: "  " }, "unknown"],
      ["no ip at all", {}, "unknown"],
    ])("keys the limit and exchange by the %s", async (_label, overrides, ip) => {
      const { service, authService, res } = setup();
      await service.completeGoogleOauth(buildRequest(overrides), res, CODE_DTO);
      expect(isAuthOAuthRateLimited).toHaveBeenCalledWith(`ip:${ip}`);
      expect(authService.completeOAuth).toHaveBeenCalledWith(AuthProvider.Google, CODE_DTO, ip);
    });
  });

  describe("completeGoogleNative", () => {
    it("completes sign-in from a verified access token", async () => {
      const { service, authService, res } = setup();
      vi.mocked(verifyGoogleAccessToken).mockResolvedValue({
        sub: "g-sub",
        email: "g@example.com",
        name: "G User",
      });
      await expect(
        service.completeGoogleNative(buildRequest(), res, { accessToken: "tok" }),
      ).resolves.toBe(SESSION);
      expect(authService.completeOAuthFromProfile).toHaveBeenCalledWith(AuthProvider.Google, {
        providerAccountId: "g-sub",
        email: "g@example.com",
        displayName: "G User",
      });
    });

    it.each([
      ["an audience mismatch", new GoogleAccessTokenAudienceError("other"), 401, "audience"],
      ["a configuration error", new Error("missing client ids"), 400, "missing client ids"],
      ["a non-Error failure", "boom", 400, "Google sign-in is not configured on the server"],
    ])("maps %s to HTTP %i", async (_label, failure, status, message) => {
      const { service, res } = setup();
      vi.mocked(verifyGoogleAccessToken).mockRejectedValue(failure);
      await expect(
        service.completeGoogleNative(buildRequest(), res, { accessToken: "tok" }),
      ).rejects.toMatchObject({ status, message: expect.stringContaining(message) });
    });

    it("rejects tokens that tokeninfo did not accept", async () => {
      const { service, res } = setup();
      vi.mocked(verifyGoogleAccessToken).mockResolvedValue(null);
      await expect(
        service.completeGoogleNative(buildRequest(), res, { accessToken: "tok" }),
      ).rejects.toThrow("Invalid Google token");
    });
  });

  describe("completeGoogleOauth", () => {
    it("rejects redirect URIs outside the allowlist", async () => {
      const { service, authService, res } = setup({
        OAUTH_REDIRECT_URI_ALLOWLIST: "https://app.example/cb",
      });
      await expect(
        service.completeGoogleOauth(buildRequest(), res, {
          ...CODE_DTO,
          redirectUri: "https://evil.example/cb",
        }),
      ).rejects.toThrow("Invalid redirect URI");
      expect(authService.completeOAuth).not.toHaveBeenCalled();
    });
  });

  describe("completeAppleNative", () => {
    it("exchanges the identity token with Apple", async () => {
      const { service, oauthProvider, res } = setup();
      await service.completeAppleNative(buildRequest(), res, { identityToken: "id-token" });
      expect(oauthProvider.exchange).toHaveBeenCalledWith(AuthProvider.Apple, {
        idToken: "id-token",
      });
    });

    it.each([
      ["  Jane Doe ", { ...APPLE_PROFILE, displayName: "Jane Doe" }],
      ["   ", APPLE_PROFILE],
      [undefined, APPLE_PROFILE],
    ])("applies display name %j to the profile", async (displayName, profile) => {
      const { service, authService, res } = setup();
      await service.completeAppleNative(buildRequest(), res, {
        identityToken: "id-token",
        displayName,
      });
      expect(authService.completeOAuthFromProfile).toHaveBeenCalledWith(
        AuthProvider.Apple,
        profile,
      );
    });
  });

  describe("completeAppleOauth", () => {
    it("exchanges the authorization code with PKCE", async () => {
      const { service, oauthProvider, res } = setup();
      await service.completeAppleOauth(buildRequest(), res, CODE_DTO);
      expect(oauthProvider.exchange).toHaveBeenCalledWith(AuthProvider.Apple, CODE_DTO);
    });

    it.each([
      ["Ali", { ...APPLE_PROFILE, displayName: "Ali" }],
      [undefined, APPLE_PROFILE],
    ])("applies display name %j to the profile", async (displayName, profile) => {
      const { service, authService, res } = setup();
      await service.completeAppleOauth(buildRequest(), res, { ...CODE_DTO, displayName });
      expect(authService.completeOAuthFromProfile).toHaveBeenCalledWith(
        AuthProvider.Apple,
        profile,
      );
    });
  });

  describe("startAppleOauthSession", () => {
    it("stores a trimmed PKCE session cookie", () => {
      const { service, res } = setup();
      service.startAppleOauthSession(buildRequest(), res, {
        codeVerifier: " v ",
        redirectUri: " https://api.example/cb ",
        returnUrl: " https://app.example/login ",
      });
      expect(res.cookie).toHaveBeenCalledWith(
        APPLE_OAUTH_SESSION_COOKIE,
        JSON.stringify({
          codeVerifier: "v",
          redirectUri: "https://api.example/cb",
          returnUrl: "https://app.example/login",
        }),
        expect.any(Object),
      );
    });

    it("rejects a return URL outside the allowlist", () => {
      const { service, res } = setup({ OAUTH_REDIRECT_URI_ALLOWLIST: "https://app.example/cb" });
      expect(() =>
        service.startAppleOauthSession(buildRequest(), res, {
          codeVerifier: "v",
          redirectUri: "https://app.example/cb",
          returnUrl: "https://evil.example/login",
        }),
      ).toThrow("Invalid return URL");
    });
  });

  describe("completeAppleOauthCallback", () => {
    it.each([
      ["a blank code", { code: "  " }],
      ["a non-string code", { code: 42 }],
      ["no body", undefined],
    ])("requires an authorization code (%s)", async (_label, body) => {
      const { service, res } = setup();
      await expect(service.completeAppleOauthCallback(buildRequest({ body }), res)).rejects.toThrow(
        "Missing authorization code",
      );
    });

    it("rejects a missing PKCE session cookie", async () => {
      const { service, res } = setup();
      await expect(
        service.completeAppleOauthCallback(buildRequest({ body: { code: "c" } }), res),
      ).rejects.toThrow("Apple sign-in session expired");
    });

    it("clears the session cookie and exchanges the code with its PKCE values", async () => {
      const { service, oauthProvider, res } = setup();
      await service.completeAppleOauthCallback(appleCallbackRequest({ code: " c " }), res);
      expect(res.clearCookie).toHaveBeenCalledWith(APPLE_OAUTH_SESSION_COOKIE, expect.any(Object));
      expect(oauthProvider.exchange).toHaveBeenCalledWith(AuthProvider.Apple, {
        code: "c",
        redirectUri: "https://api.example/cb",
        codeVerifier: "verifier",
      });
    });

    it("sets auth cookies and redirects to the return URL", async () => {
      const { service, res } = setup();
      await service.completeAppleOauthCallback(appleCallbackRequest({ code: "c" }), res);
      expect(res.cookie.mock.calls.map(([name]) => name)).toEqual([
        REFRESH_TOKEN_COOKIE,
        ACCESS_TOKEN_COOKIE,
      ]);
      expect(res.redirect).toHaveBeenCalledWith(
        302,
        "https://app.example/login?x=1&apple_oauth=success",
      );
    });

    it.each([
      [
        "a first-authorization name",
        JSON.stringify({ name: { firstName: " Fatima ", lastName: "Khan" } }),
        { ...APPLE_PROFILE, displayName: "Fatima Khan" },
      ],
      ["malformed JSON", "{not-json", APPLE_PROFILE],
      ["a blank name", JSON.stringify({ name: { firstName: " " } }), APPLE_PROFILE],
      ["no name", JSON.stringify({}), APPLE_PROFILE],
      ["a non-string user field", { name: "x" }, APPLE_PROFILE],
    ])("derives the profile from an Apple user payload with %s", async (_label, user, profile) => {
      const { service, authService, res } = setup();
      await service.completeAppleOauthCallback(appleCallbackRequest({ code: "c", user }), res);
      expect(authService.completeOAuthFromProfile).toHaveBeenCalledWith(
        AuthProvider.Apple,
        profile,
      );
    });
  });

  describe("resolveAccessToken", () => {
    it("reads the bearer header", () => {
      const { service } = setup();
      expect(service.resolveAccessToken(buildRequest(), "Bearer abc")).toBe("abc");
    });
  });

  describe("resolveRefreshToken", () => {
    it("prefers the sealed refresh cookie over the body token", () => {
      const { service } = setup();
      const req = buildRequest({
        cookies: { [REFRESH_TOKEN_COOKIE]: sealAuthCookieValue("from-cookie") },
      });
      expect(service.resolveRefreshToken(req, "from-body")).toBe("from-cookie");
    });

    it("falls back to a trimmed body token", () => {
      const { service } = setup();
      expect(service.resolveRefreshToken(buildRequest(), "  from-body ")).toBe("from-body");
    });

    it.each([["   "], [undefined]])("rejects when there is no token (body %j)", (body) => {
      const { service } = setup();
      expect(() => service.resolveRefreshToken(buildRequest(), body)).toThrow(
        UnauthorizedException,
      );
    });
  });

  describe("clearAuthCookies", () => {
    it("clears the access and refresh cookies", () => {
      const { service, res } = setup();
      service.clearAuthCookies(res);
      expect(res.clearCookie.mock.calls.map(([name]) => name)).toEqual([
        ACCESS_TOKEN_COOKIE,
        REFRESH_TOKEN_COOKIE,
      ]);
    });
  });
});
