import { afterEach, describe, expect, it, vi } from "vitest";
import type { EnvironmentVariables } from "../config/env.schema";
import { NodeEnvironment } from "../config/env.schema";
import { jsonResponse } from "../test-support/fetch";
import { buildConfig, stubFetchRoutes } from "../test-support/oauth";
import { GoogleAccessTokenAudienceError, verifyGoogleAccessToken } from "./google-access-token";

const CLIENT_ID = "allowed.apps.googleusercontent.com";
const ALLOWED = { GOOGLE_OAUTH_CLIENT_IDS: CLIENT_ID };

function setup(
  env: Partial<EnvironmentVariables>,
  tokenInfo: Response | object,
  userInfo: Response | object = {},
) {
  const fetchMock = stubFetchRoutes({ tokeninfo: tokenInfo, userinfo: userInfo });
  return {
    fetchMock,
    verify: (token = "ya29.token") => verifyGoogleAccessToken(buildConfig(env), token),
  };
}

describe("verifyGoogleAccessToken", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns null for a blank token without calling Google", async () => {
    const { fetchMock, verify } = setup(ALLOWED, {});
    await expect(verify("  ")).resolves.toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts the trimmed token in the tokeninfo form body", async () => {
    const { fetchMock, verify } = setup({}, { sub: "u" });
    await verify(" tok ");
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://oauth2.googleapis.com/tokeninfo");
    expect(String(init.body)).toBe("access_token=tok");
  });

  it.each([
    ["a non-ok tokeninfo response", jsonResponse({ sub: "u" }, 400)],
    ["a tokeninfo error payload", { error: "invalid_token", sub: "u" }],
    ["a tokeninfo payload without sub", { aud: CLIENT_ID }],
  ])("returns null for %s", async (_label, tokenInfo) => {
    const { verify } = setup(ALLOWED, tokenInfo);
    await expect(verify()).resolves.toBeNull();
  });

  it("returns the userinfo profile when azp matches", async () => {
    const { verify } = setup(
      ALLOWED,
      { sub: "user-1", azp: CLIENT_ID, email: "a@b.com", email_verified: "true" },
      { sub: "user-1", email: "a@b.com", email_verified: true, name: "Ada" },
    );
    await expect(verify()).resolves.toEqual({
      sub: "user-1",
      email: "a@b.com",
      name: "Ada",
      picture: undefined,
    });
  });

  it.each([
    ["an azp outside the allowlist", { sub: "u", azp: "other-client" }, "other-client"],
    ["no azp/aud", { sub: "u" }, undefined],
  ])("throws an audience error for %s", async (_label, tokenInfo, clientId) => {
    const { verify } = setup(ALLOWED, tokenInfo);
    const error = await verify().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(GoogleAccessTokenAudienceError);
    expect(error).toMatchObject({ clientId });
  });

  it("explains a missing azp/aud in the audience error message", async () => {
    const { verify } = setup(ALLOWED, { sub: "u" });
    await expect(verify()).rejects.toThrow("missing azp/aud");
  });

  it("requires client ids in production", async () => {
    const { verify } = setup({ NODE_ENV: NodeEnvironment.Production }, { sub: "u" });
    await expect(verify()).rejects.toThrow("required in production");
  });

  it("falls back to GOOGLE_OAUTH_WEB_CLIENT_ID and the aud claim", async () => {
    const { verify } = setup(
      { NODE_ENV: NodeEnvironment.Production, GOOGLE_OAUTH_WEB_CLIENT_ID: " web-id " },
      { sub: "u", aud: " web-id " },
    );
    await expect(verify()).resolves.toMatchObject({ sub: "u" });
  });

  it("falls back to tokeninfo fields when userinfo fails", async () => {
    const { verify } = setup(
      ALLOWED,
      {
        sub: "u",
        azp: CLIENT_ID,
        email: "Tok@Example.com",
        email_verified: true,
        name: "Token Name",
        picture: "https://img/token.png",
      },
      jsonResponse({}, 401),
    );
    await expect(verify()).resolves.toEqual({
      sub: "u",
      email: "tok@example.com",
      name: "Token Name",
      picture: "https://img/token.png",
    });
  });

  it("ignores a userinfo error payload", async () => {
    const { verify } = setup(
      ALLOWED,
      { sub: "u", azp: CLIENT_ID, name: "Fallback" },
      { error: "insufficient_scope", name: "Ignored" },
    );
    await expect(verify()).resolves.toMatchObject({ name: "Fallback" });
  });

  it("drops unverified emails and blank names, and trims pictures (no allowlist in dev)", async () => {
    const { verify } = setup(
      {},
      { sub: "u", email: "x@y.z", email_verified: "false" },
      { name: "  ", picture: " https://img/p.png ", email: "x@y.z" },
    );
    await expect(verify()).resolves.toEqual({
      sub: "u",
      email: undefined,
      name: undefined,
      picture: "https://img/p.png",
    });
  });
});
