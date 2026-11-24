import { describe, expect, it, vi } from "vitest";
import { buildSession } from "../test-support/fixtures/session";
import { buildAuthUser } from "../test-support/fixtures/user";
import {
  buildRequest,
  buildResponse,
  type RequestOverrides,
  TEST_ACCESS_TOKEN,
  TEST_BEARER,
} from "../test-support/http";
import { AuthController } from "./auth.controller";
import type { AuthService } from "./auth.service";
import type { AuthOAuthService } from "./auth-oauth.service";
import { AccountClosureReason, AuthProvider } from "./dto/auth.dto";

const SESSION = buildSession();
const USER = buildAuthUser();
const CLIENT_IP = "203.0.113.7";
const CODE_DTO = { code: "c", redirectUri: "https://app.example/cb", codeVerifier: "v" };
const WEB_RESPONSE = { user: USER };

function setup() {
  const authService = {
    createGuestSession: vi.fn().mockResolvedValue(SESSION),
    createTvPairing: vi.fn().mockResolvedValue({ code: "ABCD2345" }),
    pollTvPairing: vi.fn().mockResolvedValue({ status: "pending" }),
    claimTvPairing: vi.fn().mockResolvedValue(undefined),
    completeOAuth: vi.fn().mockResolvedValue(SESSION),
    refreshSession: vi.fn().mockResolvedValue(SESSION),
    getCurrentUser: vi.fn().mockResolvedValue(USER),
    linkGuestAccount: vi.fn().mockResolvedValue(SESSION),
    revokeSession: vi.fn().mockResolvedValue(undefined),
    resetAppData: vi.fn().mockResolvedValue(undefined),
    deleteAccount: vi.fn().mockResolvedValue(undefined),
  };
  const oauth = {
    resolveAccessToken: vi.fn().mockReturnValue(TEST_ACCESS_TOKEN),
    resolveRefreshToken: vi.fn().mockReturnValue(SESSION.refreshToken),
    issueSessionResponse: vi.fn().mockResolvedValue(WEB_RESPONSE),
    completeGoogleNative: vi.fn().mockResolvedValue(SESSION),
    completeGoogleOauth: vi.fn().mockResolvedValue(SESSION),
    completeAppleNative: vi.fn().mockResolvedValue(SESSION),
    completeAppleOauth: vi.fn().mockResolvedValue(SESSION),
    startAppleOauthSession: vi.fn(),
    completeAppleOauthCallback: vi.fn().mockResolvedValue(undefined),
    clearAuthCookies: vi.fn(),
  };
  const controller = new AuthController(
    authService as unknown as AuthService,
    oauth as unknown as AuthOAuthService,
  );
  return {
    controller,
    authService,
    oauth,
    req: buildRequest({ ip: CLIENT_IP }),
    res: buildResponse(),
  };
}

describe("AuthController", () => {
  it.each<[string, RequestOverrides, string]>([
    [
      "nearest proxy hop (not the spoofable first one)",
      { headers: { "x-forwarded-for": "1.1.1.1, 2.2.2.2" } },
      "2.2.2.2",
    ],
    ["non-blank last hop", { headers: { "x-forwarded-for": "2.2.2.2, " } }, "2.2.2.2"],
    ["array header", { headers: { "x-forwarded-for": ["3.3.3.3,4.4.4.4"] } }, "4.4.4.4"],
    ["blank-only header", { headers: { "x-forwarded-for": [" , "] } }, "unknown"],
    ["socket ip", { headers: { "x-forwarded-for": [] as string[] }, ip: " 5.5.5.5 " }, "5.5.5.5"],
    ["blank socket ip", { ip: "  " }, "unknown"],
    ["no ip at all", {}, "unknown"],
  ])("rate-limits guest creation by the %s", async (_label, overrides, ip) => {
    const { controller, authService } = setup();
    await controller.createGuestSession({ deviceId: "d" }, buildRequest(overrides));
    expect(authService.createGuestSession).toHaveBeenCalledWith({ deviceId: "d" }, ip);
  });

  it("can't dodge the guest limit by rotating a spoofed first X-Forwarded-For hop", async () => {
    const { controller, authService } = setup();
    for (const spoof of ["203.0.113.1", "203.0.113.2"]) {
      await controller.createGuestSession(
        {},
        buildRequest({ headers: { "x-forwarded-for": `${spoof}, 10.0.0.7` } }),
      );
    }
    expect(authService.createGuestSession.mock.calls.map(([, ip]) => ip)).toEqual([
      "10.0.0.7",
      "10.0.0.7",
    ]);
  });

  it("creates a TV pairing", async () => {
    const { controller, authService, req } = setup();
    await expect(controller.createTvPairing(req)).resolves.toEqual({ code: "ABCD2345" });
    expect(authService.createTvPairing).toHaveBeenCalledWith(CLIENT_IP);
  });

  it("polls a TV pairing", async () => {
    const { controller, authService, req } = setup();
    await expect(controller.pollTvPairing("abcd-2345", req)).resolves.toEqual({
      status: "pending",
    });
    expect(authService.pollTvPairing).toHaveBeenCalledWith("abcd-2345", CLIENT_IP);
  });

  it("claims a TV pairing with the caller's access token", async () => {
    const { controller, authService, oauth, req } = setup();
    await controller.claimTvPairing(TEST_BEARER, { code: "ABCD2345" }, req);
    expect(oauth.resolveAccessToken).toHaveBeenCalledWith(req, TEST_BEARER);
    expect(authService.claimTvPairing).toHaveBeenCalledWith(
      TEST_ACCESS_TOKEN,
      "ABCD2345",
      CLIENT_IP,
    );
  });

  it("completes native Google sign-in", async () => {
    const { controller, oauth, req, res } = setup();
    await expect(controller.completeGoogle({ accessToken: "t" }, req, res)).resolves.toBe(SESSION);
    expect(oauth.completeGoogleNative).toHaveBeenCalledWith(req, res, { accessToken: "t" });
  });

  it("completes Google authorization-code sign-in", async () => {
    const { controller, oauth, req, res } = setup();
    await expect(controller.completeGoogleOauth(CODE_DTO, req, res)).resolves.toBe(SESSION);
    expect(oauth.completeGoogleOauth).toHaveBeenCalledWith(req, res, CODE_DTO);
  });

  it("completes native Apple sign-in", async () => {
    const { controller, oauth, req, res } = setup();
    await expect(controller.completeApple({ identityToken: "id" }, req, res)).resolves.toBe(
      SESSION,
    );
    expect(oauth.completeAppleNative).toHaveBeenCalledWith(req, res, { identityToken: "id" });
  });

  it("completes Apple authorization-code sign-in", async () => {
    const { controller, oauth, req, res } = setup();
    await expect(controller.completeAppleOauth(CODE_DTO, req, res)).resolves.toBe(SESSION);
    expect(oauth.completeAppleOauth).toHaveBeenCalledWith(req, res, CODE_DTO);
  });

  it("starts an Apple web OAuth session", () => {
    const { controller, oauth, req, res } = setup();
    const dto = { codeVerifier: "v", redirectUri: "https://x/cb", returnUrl: "https://x" };
    controller.startAppleOauthSession(dto, req, res);
    expect(oauth.startAppleOauthSession).toHaveBeenCalledWith(req, res, dto);
  });

  it("handles the Apple form_post callback", async () => {
    const { controller, oauth, req, res } = setup();
    await controller.appleOauthCallback(req, res);
    expect(oauth.completeAppleOauthCallback).toHaveBeenCalledWith(req, res);
  });

  it("completes generic OAuth with the client ip", async () => {
    const { controller, authService, req } = setup();
    await expect(controller.completeOAuth(AuthProvider.Facebook, { code: "c" }, req)).resolves.toBe(
      SESSION,
    );
    expect(authService.completeOAuth).toHaveBeenCalledWith(
      AuthProvider.Facebook,
      { code: "c" },
      CLIENT_IP,
    );
  });

  it("rotates the refresh token and issues a client-appropriate response", async () => {
    const { controller, authService, oauth, req, res } = setup();
    await expect(controller.refresh({ refreshToken: "body" }, req, res)).resolves.toBe(
      WEB_RESPONSE,
    );
    expect(oauth.resolveRefreshToken).toHaveBeenCalledWith(req, "body");
    expect(authService.refreshSession).toHaveBeenCalledWith(SESSION.refreshToken, CLIENT_IP);
    expect(oauth.issueSessionResponse).toHaveBeenCalledWith(req, res, SESSION, USER);
  });

  it("links a guest account and issues a client-appropriate response", async () => {
    const { controller, authService, oauth, req, res } = setup();
    const dto = { provider: AuthProvider.Google, code: "c" };
    await expect(controller.linkAccount(TEST_BEARER, dto, req, res)).resolves.toBe(WEB_RESPONSE);
    expect(authService.linkGuestAccount).toHaveBeenCalledWith(TEST_ACCESS_TOKEN, dto);
    expect(oauth.issueSessionResponse).toHaveBeenCalledWith(req, res, SESSION, USER);
  });

  it("returns the current user", async () => {
    const { controller, authService, req } = setup();
    await expect(controller.getCurrentUser(TEST_BEARER, req)).resolves.toBe(USER);
    expect(authService.getCurrentUser).toHaveBeenCalledWith(TEST_ACCESS_TOKEN);
  });

  it("logs out by revoking the session and clearing cookies", async () => {
    const { controller, authService, oauth, req, res } = setup();
    await controller.logout(TEST_BEARER, req, res);
    expect(authService.revokeSession).toHaveBeenCalledWith(TEST_ACCESS_TOKEN);
    expect(oauth.clearAuthCookies).toHaveBeenCalledWith(res);
  });

  it("resets app data", async () => {
    const { controller, authService, req } = setup();
    await controller.resetAppData(TEST_BEARER, { confirmation: "RESET" }, req);
    expect(authService.resetAppData).toHaveBeenCalledWith(
      TEST_ACCESS_TOKEN,
      { confirmation: "RESET" },
      CLIENT_IP,
    );
  });

  it("deletes the account and clears cookies", async () => {
    const { controller, authService, oauth, req, res } = setup();
    const dto = { confirmation: "DELETE" as const, primaryReason: AccountClosureReason.Other };
    await controller.deleteAccount(TEST_BEARER, dto, req, res);
    expect(authService.deleteAccount).toHaveBeenCalledWith(TEST_ACCESS_TOKEN, dto, CLIENT_IP);
    expect(oauth.clearAuthCookies).toHaveBeenCalledWith(res);
  });
});
