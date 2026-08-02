import { BadRequestException } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import { describe, expect, it } from "vitest";
import type { EnvironmentVariables } from "../config/env.schema";
import { NodeEnvironment } from "../config/env.schema";
import { assertOAuthReturnUrlAllowed, assertRedirectUriAllowed } from "./oauth-redirect-allowlist";

function makeConfig(env: Partial<EnvironmentVariables> = {}) {
  return {
    get: (key: keyof EnvironmentVariables) => env[key],
  } as unknown as ConfigService<EnvironmentVariables, true>;
}

describe("assertRedirectUriAllowed", () => {
  it("rejects empty redirectUri", () => {
    expect(() =>
      assertRedirectUriAllowed(makeConfig({ NODE_ENV: NodeEnvironment.Development }), "  "),
    ).toThrow(BadRequestException);
    expect(() =>
      assertRedirectUriAllowed(makeConfig({ NODE_ENV: NodeEnvironment.Development }), "  "),
    ).toThrow(/redirectUri is required/);
  });

  it("requires allowlist in production when unset", () => {
    expect(() =>
      assertRedirectUriAllowed(
        makeConfig({ NODE_ENV: NodeEnvironment.Production }),
        "https://example.com/callback",
      ),
    ).toThrow(/OAUTH_REDIRECT_URI_ALLOWLIST/);
  });

  it("allows any URI in non-production when allowlist is empty", () => {
    expect(() =>
      assertRedirectUriAllowed(
        makeConfig({ NODE_ENV: NodeEnvironment.Development }),
        "https://any.example/oauth",
      ),
    ).not.toThrow();
  });

  it("rejects URIs not on the allowlist", () => {
    expect(() =>
      assertRedirectUriAllowed(
        makeConfig({
          NODE_ENV: NodeEnvironment.Development,
          OAUTH_REDIRECT_URI_ALLOWLIST: "https://app.example/callback",
        }),
        "https://evil.example/callback",
      ),
    ).toThrow(/Invalid redirect URI/);
  });

  it("allows URIs on the allowlist", () => {
    expect(() =>
      assertRedirectUriAllowed(
        makeConfig({
          NODE_ENV: NodeEnvironment.Production,
          OAUTH_REDIRECT_URI_ALLOWLIST: "https://app.example/callback,https://app.example/other",
        }),
        "https://app.example/callback",
      ),
    ).not.toThrow();
  });
});

describe("assertOAuthReturnUrlAllowed", () => {
  it("rejects empty returnUrl", () => {
    expect(() =>
      assertOAuthReturnUrlAllowed(makeConfig({ NODE_ENV: NodeEnvironment.Development }), "  "),
    ).toThrow(/returnUrl is required/);
  });

  it("rejects invalid URL strings", () => {
    expect(() =>
      assertOAuthReturnUrlAllowed(
        makeConfig({ NODE_ENV: NodeEnvironment.Development }),
        "not-a-url",
      ),
    ).toThrow(/Invalid return URL/);
  });

  it("rejects http return URLs in production", () => {
    expect(() =>
      assertOAuthReturnUrlAllowed(
        makeConfig({ NODE_ENV: NodeEnvironment.Production }),
        "http://localhost/login",
      ),
    ).toThrow(/Invalid return URL/);
  });

  it("accepts https return URLs in production when allowlist is empty", () => {
    expect(() =>
      assertOAuthReturnUrlAllowed(
        makeConfig({ NODE_ENV: NodeEnvironment.Production }),
        "https://app.example/login",
      ),
    ).not.toThrow();
  });

  it("accepts return URLs whose origin matches an https allowlist entry", () => {
    expect(() =>
      assertOAuthReturnUrlAllowed(
        makeConfig({
          OAUTH_REDIRECT_URI_ALLOWLIST: "https://app.example/oauth/apple",
        }),
        "https://app.example/dashboard?tab=login",
      ),
    ).not.toThrow();
  });

  it("rejects return URLs whose origin does not match allowlist", () => {
    expect(() =>
      assertOAuthReturnUrlAllowed(
        makeConfig({
          OAUTH_REDIRECT_URI_ALLOWLIST: "https://app.example/oauth/apple",
        }),
        "https://other.example/login",
      ),
    ).toThrow(/Invalid return URL/);
  });
});
