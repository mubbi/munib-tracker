import type { ConfigService } from "@nestjs/config";
import { describe, expect, it, vi } from "vitest";
import type { EnvironmentVariables } from "../config/env.schema";
import { NodeEnvironment } from "../config/env.schema";
import { verifyGoogleAccessToken } from "./google-access-token";
import { assertOAuthReturnUrlAllowed, assertRedirectUriAllowed } from "./oauth-redirect-allowlist";

function makeConfig(env: Partial<EnvironmentVariables> = {}) {
  return {
    get: (key: keyof EnvironmentVariables) => env[key],
  } as unknown as ConfigService<EnvironmentVariables, true>;
}

describe("assertRedirectUriAllowed", () => {
  it("allows any URI when allowlist is empty in development", () => {
    expect(() =>
      assertRedirectUriAllowed(
        makeConfig({ NODE_ENV: NodeEnvironment.Development }),
        "https://example.com",
      ),
    ).not.toThrow();
  });

  it("rejects URIs not on the allowlist", () => {
    expect(() =>
      assertRedirectUriAllowed(
        makeConfig({
          NODE_ENV: NodeEnvironment.Development,
          OAUTH_REDIRECT_URI_ALLOWLIST: "https://my.munibtracker.app",
        }),
        "https://evil.example",
      ),
    ).toThrow(/Invalid redirect URI/);
  });

  it("requires allowlist in production", () => {
    expect(() =>
      assertRedirectUriAllowed(makeConfig({ NODE_ENV: NodeEnvironment.Production }), "https://x"),
    ).toThrow(/OAUTH_REDIRECT_URI_ALLOWLIST/);
  });
});

describe("assertOAuthReturnUrlAllowed", () => {
  it("accepts return URLs whose origin matches an https allowlist entry", () => {
    expect(() =>
      assertOAuthReturnUrlAllowed(
        makeConfig({
          OAUTH_REDIRECT_URI_ALLOWLIST: "https://my.munibtracker.app/oauth/apple",
        }),
        "https://my.munibtracker.app/login",
      ),
    ).not.toThrow();
  });
});

describe("verifyGoogleAccessToken", () => {
  it("returns null for empty tokens", async () => {
    await expect(verifyGoogleAccessToken(makeConfig(), "  ")).resolves.toBeNull();
  });

  it("rejects tokens whose azp is not in GOOGLE_OAUTH_CLIENT_IDS", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        sub: "user-1",
        azp: "other-client.apps.googleusercontent.com",
        email: "a@b.com",
        email_verified: "true",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      verifyGoogleAccessToken(
        makeConfig({
          GOOGLE_OAUTH_CLIENT_IDS: "allowed.apps.googleusercontent.com",
        }),
        "ya29.token",
      ),
    ).resolves.toBeNull();

    vi.unstubAllGlobals();
  });

  it("returns profile when azp matches", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          sub: "user-1",
          azp: "allowed.apps.googleusercontent.com",
          email: "a@b.com",
          email_verified: "true",
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          sub: "user-1",
          email: "a@b.com",
          email_verified: true,
          name: "Ada",
        }),
      });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      verifyGoogleAccessToken(
        makeConfig({
          GOOGLE_OAUTH_CLIENT_IDS: "allowed.apps.googleusercontent.com",
        }),
        "ya29.token",
      ),
    ).resolves.toEqual({
      sub: "user-1",
      email: "a@b.com",
      name: "Ada",
      picture: undefined,
    });

    vi.unstubAllGlobals();
  });
});
