import { BadRequestException } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import type { EnvironmentVariables } from "../config/env.schema";
import { NodeEnvironment } from "../config/env.schema";
import { buildConfig } from "../test-support/oauth";
import { assertOAuthReturnUrlAllowed, assertRedirectUriAllowed } from "./oauth-redirect-allowlist";

type Env = Partial<EnvironmentVariables>;

const DEV: Env = { NODE_ENV: NodeEnvironment.Development };
const PROD: Env = { NODE_ENV: NodeEnvironment.Production };
const APP_ALLOWLIST = "https://app.example/callback,https://app.example/other";

describe("assertRedirectUriAllowed", () => {
  it.each<[string, Env, string, string]>([
    ["a blank redirect URI", DEV, "  ", "redirectUri is required"],
    [
      "production without an allowlist",
      PROD,
      "https://example.com/callback",
      "OAUTH_REDIRECT_URI_ALLOWLIST",
    ],
    [
      "a URI not on the allowlist",
      { ...DEV, OAUTH_REDIRECT_URI_ALLOWLIST: APP_ALLOWLIST },
      "https://evil.example/callback",
      "Invalid redirect URI",
    ],
  ])("rejects %s", (_label, env, uri, message) => {
    const assert = () => assertRedirectUriAllowed(buildConfig(env), uri);
    expect(assert).toThrow(BadRequestException);
    expect(assert).toThrow(message);
  });

  it.each<[string, Env, string]>([
    ["any URI in development without an allowlist", DEV, "https://any.example/oauth"],
    [
      "a trimmed URI on the allowlist",
      { ...PROD, OAUTH_REDIRECT_URI_ALLOWLIST: APP_ALLOWLIST },
      " https://app.example/other ",
    ],
  ])("allows %s", (_label, env, uri) => {
    expect(() => assertRedirectUriAllowed(buildConfig(env), uri)).not.toThrow();
  });
});

describe("assertOAuthReturnUrlAllowed", () => {
  const appleAllowlist: Env = { OAUTH_REDIRECT_URI_ALLOWLIST: "https://app.example/oauth/apple" };

  it.each<[string, Env, string, string]>([
    ["a blank return URL", DEV, "  ", "returnUrl is required"],
    ["an unparseable URL", DEV, "not-a-url", "Invalid return URL"],
    ["http in production", PROD, "http://localhost/login", "Invalid return URL"],
    // No https entry to pin the origin: any https URL would be an open redirect.
    [
      "https in production without an allowlist",
      PROD,
      "https://evil.example/",
      "Invalid return URL",
    ],
    [
      "production with only custom-scheme entries",
      { ...PROD, OAUTH_REDIRECT_URI_ALLOWLIST: "munibtracker://oauth" },
      "https://evil.example/",
      "Invalid return URL",
    ],
    [
      "an origin not on the allowlist",
      appleAllowlist,
      "https://other.example/login",
      "Invalid return URL",
    ],
    [
      "an origin matching only a malformed entry",
      { OAUTH_REDIRECT_URI_ALLOWLIST: "https://[bad-host" },
      "https://evil.example/x",
      "Invalid return URL",
    ],
  ])("rejects %s", (_label, env, url, message) => {
    expect(() => assertOAuthReturnUrlAllowed(buildConfig(env), url)).toThrow(message);
  });

  it.each<[string, Env, string]>([
    ["https in development without an allowlist", DEV, "https://app.example/login"],
    [
      "https in production on an allowlisted origin",
      { ...PROD, ...appleAllowlist },
      "https://app.example/login",
    ],
    [
      "an origin matching an https allowlist entry",
      appleAllowlist,
      "https://app.example/dashboard?tab=login",
    ],
    [
      "a match after skipping a malformed entry",
      { OAUTH_REDIRECT_URI_ALLOWLIST: "https://[bad-host, https://app.example/cb" },
      "https://app.example/x",
    ],
  ])("accepts %s", (_label, env, url) => {
    expect(() => assertOAuthReturnUrlAllowed(buildConfig(env), url)).not.toThrow();
  });
});
