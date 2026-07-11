import type { JsonWebKey, KeyObject } from "node:crypto";
import { createHmac, sign as cryptoSign, generateKeyPairSync } from "node:crypto";
import type { ConfigService } from "@nestjs/config";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { EnvironmentVariables } from "../config/env.schema";
import { AuthProvider } from "./dto/auth.dto";
import { OAuthProviderService } from "./oauth-provider.service";

const TEST_APPLE_KID = "test-apple-key";
const TEST_GOOGLE_KID = "test-google-key";

/**
 * Test double that verifies provider id_tokens against locally generated RSA keys
 * instead of live JWKS endpoints (offline, deterministic).
 */
class TestOAuthProviderService extends OAuthProviderService {
  constructor(
    config: ConfigService<EnvironmentVariables, true>,
    private readonly appleJwks: JsonWebKey[] = [],
    private readonly googleJwks: JsonWebKey[] = [],
  ) {
    super(config);
  }

  protected override async fetchAppleJwks(): Promise<JsonWebKey[]> {
    return this.appleJwks;
  }

  protected override async fetchGoogleJwks(): Promise<JsonWebKey[]> {
    return this.googleJwks;
  }
}

function makeConfig(env: Partial<EnvironmentVariables> = {}) {
  return {
    get: (key: keyof EnvironmentVariables) => env[key],
  } as unknown as ConfigService<EnvironmentVariables, true>;
}

function makeService(env: Partial<EnvironmentVariables> = {}): OAuthProviderService {
  return new OAuthProviderService(makeConfig(env));
}

function base64Url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

/** Signs an RS256 id_token that mimics an Apple identity token. */
function signAppleToken(
  privateKey: KeyObject,
  claims: { aud: string; sub: string; email?: string; expiresIn?: number },
): string {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", kid: TEST_APPLE_KID, typ: "JWT" };
  const payload = {
    iss: "https://appleid.apple.com",
    aud: claims.aud,
    sub: claims.sub,
    iat: now,
    exp: now + (claims.expiresIn ?? 3600),
    ...(claims.email ? { email: claims.email } : {}),
  };
  const signingInput = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}`;
  const signature = cryptoSign("RSA-SHA256", Buffer.from(signingInput), privateKey);
  return `${signingInput}.${signature.toString("base64url")}`;
}

/** Signs an RS256 id_token that mimics a Google identity token. */
function signGoogleToken(
  privateKey: KeyObject,
  claims: {
    aud: string;
    sub: string;
    email?: string;
    name?: string;
    expiresIn?: number;
    iss?: string;
  },
): string {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", kid: TEST_GOOGLE_KID, typ: "JWT" };
  const payload = {
    iss: claims.iss ?? "https://accounts.google.com",
    aud: claims.aud,
    sub: claims.sub,
    iat: now,
    exp: now + (claims.expiresIn ?? 3600),
    ...(claims.email ? { email: claims.email } : {}),
    ...(claims.name ? { name: claims.name } : {}),
  };
  const signingInput = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}`;
  const signature = cryptoSign("RSA-SHA256", Buffer.from(signingInput), privateKey);
  return `${signingInput}.${signature.toString("base64url")}`;
}

function makeProviderJwks(kid: string) {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const jwk = publicKey.export({ format: "jwk" }) as JsonWebKey & { kid?: string };
  jwk.kid = kid;
  jwk.alg = "RS256";
  jwk.use = "sig";
  return { privateKey, jwk };
}

function makeAppleService(env: Partial<EnvironmentVariables> = {}) {
  const { privateKey, jwk } = makeProviderJwks(TEST_APPLE_KID);
  const service = new TestOAuthProviderService(makeConfig(env), [jwk]);
  return { service, privateKey };
}

function makeGoogleService(env: Partial<EnvironmentVariables> = {}) {
  const { privateKey, jwk } = makeProviderJwks(TEST_GOOGLE_KID);
  const service = new TestOAuthProviderService(makeConfig(env), [], [jwk]);
  return { service, privateKey };
}

describe("OAuthProviderService", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends appsecret_proof and keys Facebook identity off the provider id", async () => {
    const service = makeService({
      FACEBOOK_APP_ID: "fb-app-id",
      FACEBOOK_APP_SECRET: "fb-app-secret",
    });

    const accessToken = "fb-access-token";
    const requestedUrls: string[] = [];
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      requestedUrls.push(url);
      if (url.includes("/oauth/access_token")) {
        return new Response(JSON.stringify({ access_token: accessToken }), { status: 200 });
      }
      // Graph /me call.
      return new Response(
        JSON.stringify({ id: "fb-user-123", name: "FB User", email: "fb@example.com" }),
        { status: 200 },
      );
    });

    const profile = await service.exchange(AuthProvider.Facebook, { code: "fb-code" });

    expect(profile.providerAccountId).toBe("fb-user-123");
    expect(profile.displayName).toBe("FB User");

    const meUrl = requestedUrls.find((url) => url.includes("graph.facebook.com/me"));
    expect(meUrl).toBeDefined();
    const proof = new URL(meUrl as string).searchParams.get("appsecret_proof");
    const expectedProof = createHmac("sha256", "fb-app-secret").update(accessToken).digest("hex");
    expect(proof).toBe(expectedProof);
  });

  it("requires a code, id_token, or access_token", async () => {
    const service = makeService({ GOOGLE_OAUTH_CLIENT_IDS: "gid" });
    await expect(service.exchange(AuthProvider.Google, {})).rejects.toThrow(
      "code, id_token, or access_token is required",
    );
  });

  it("rejects a provider that is not configured", async () => {
    const service = makeService();
    await expect(service.exchange(AuthProvider.Google, { code: "abc" })).rejects.toThrow(
      "google sign-in is not configured",
    );
  });

  it("validates and accepts an Apple identity token", async () => {
    const { service, privateKey } = makeAppleService({ APPLE_CLIENT_IDS: "app.munib.tracker" });
    const idToken = signAppleToken(privateKey, {
      aud: "app.munib.tracker",
      sub: "apple-user-1",
      email: "user@privaterelay.appleid.com",
    });

    const profile = await service.exchange(AuthProvider.Apple, { idToken });
    expect(profile.providerAccountId).toBe("apple-user-1");
    expect(profile.email).toBe("user@privaterelay.appleid.com");
  });

  it("accepts an id_token whose audience matches one of several configured ids", async () => {
    const { service, privateKey } = makeAppleService({
      APPLE_CLIENT_IDS: "app.munibtracker, com.munibtracker.web",
    });
    const idToken = signAppleToken(privateKey, {
      aud: "com.munibtracker.web",
      sub: "apple-user-2",
    });

    const profile = await service.exchange(AuthProvider.Apple, { idToken });
    expect(profile.providerAccountId).toBe("apple-user-2");
  });

  it("rejects an Apple token with a mismatched audience", async () => {
    const { service, privateKey } = makeAppleService({ APPLE_CLIENT_IDS: "app.munib.tracker" });
    const idToken = signAppleToken(privateKey, {
      aud: "some.other.app",
      sub: "apple-user-1",
    });

    await expect(service.exchange(AuthProvider.Apple, { idToken })).rejects.toThrow(
      "audience mismatch",
    );
  });

  it("rejects an expired Apple token", async () => {
    const { service, privateKey } = makeAppleService({ APPLE_CLIENT_IDS: "app.munib.tracker" });
    const idToken = signAppleToken(privateKey, {
      aud: "app.munib.tracker",
      sub: "apple-user-1",
      expiresIn: -10,
    });

    await expect(service.exchange(AuthProvider.Apple, { idToken })).rejects.toThrow("expired");
  });

  it("rejects an Apple token signed by an unknown key", async () => {
    const { service } = makeAppleService({ APPLE_CLIENT_IDS: "app.munib.tracker" });
    // Sign with a different key than the one exposed via the JWKS.
    const { privateKey: rogueKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
    const forged = signAppleToken(rogueKey, { aud: "app.munib.tracker", sub: "apple-user-1" });

    await expect(service.exchange(AuthProvider.Apple, { idToken: forged })).rejects.toThrow(
      "Invalid Apple identity token signature",
    );
  });

  it("validates and accepts a Google identity token", async () => {
    const { service, privateKey } = makeGoogleService({
      GOOGLE_OAUTH_CLIENT_IDS: "web-client.apps.googleusercontent.com",
    });
    const idToken = signGoogleToken(privateKey, {
      aud: "web-client.apps.googleusercontent.com",
      sub: "google-user-1",
      email: "user@example.com",
      name: "Google User",
    });

    const profile = await service.exchange(AuthProvider.Google, { idToken });
    expect(profile.providerAccountId).toBe("google-user-1");
    expect(profile.email).toBe("user@example.com");
    expect(profile.displayName).toBe("Google User");
  });

  it("accepts a Google id_token whose audience matches one of several configured ids", async () => {
    const { service, privateKey } = makeGoogleService({
      GOOGLE_OAUTH_CLIENT_IDS:
        "web-client.apps.googleusercontent.com, ios-client.apps.googleusercontent.com",
    });
    const idToken = signGoogleToken(privateKey, {
      aud: "ios-client.apps.googleusercontent.com",
      sub: "google-user-1",
      email: "user@example.com",
    });

    const profile = await service.exchange(AuthProvider.Google, { idToken });
    expect(profile.providerAccountId).toBe("google-user-1");
    expect(profile.email).toBe("user@example.com");
  });

  it("rejects a Google id_token with a mismatched audience", async () => {
    const { service, privateKey } = makeGoogleService({
      GOOGLE_OAUTH_CLIENT_IDS: "web-client.apps.googleusercontent.com",
    });
    const idToken = signGoogleToken(privateKey, {
      aud: "other-client.apps.googleusercontent.com",
      sub: "google-user-1",
    });

    await expect(service.exchange(AuthProvider.Google, { idToken })).rejects.toThrow(
      "audience mismatch",
    );
  });

  it("rejects an expired Google id_token", async () => {
    const { service, privateKey } = makeGoogleService({
      GOOGLE_OAUTH_CLIENT_IDS: "web-client.apps.googleusercontent.com",
    });
    const idToken = signGoogleToken(privateKey, {
      aud: "web-client.apps.googleusercontent.com",
      sub: "google-user-1",
      expiresIn: -10,
    });

    await expect(service.exchange(AuthProvider.Google, { idToken })).rejects.toThrow("expired");
  });

  it("uses GOOGLE_OAUTH_WEB_CLIENT_ID for the authorization-code exchange", async () => {
    const service = makeService({
      GOOGLE_OAUTH_CLIENT_IDS:
        "web-client.apps.googleusercontent.com, ios-client.apps.googleusercontent.com",
      GOOGLE_OAUTH_WEB_CLIENT_ID: "web-client.apps.googleusercontent.com",
      GOOGLE_OAUTH_WEB_CLIENT_SECRET: "web-secret",
    });

    const postedBodies: string[] = [];
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const url = String(input);
      if (url.includes("oauth2.googleapis.com/token")) {
        postedBodies.push(String(init?.body ?? ""));
        return new Response(JSON.stringify({ access_token: "atok" }), { status: 200 });
      }
      return new Response(JSON.stringify({ sub: "g-1", email: "a@b.c", name: "A" }), {
        status: 200,
      });
    });

    await service.exchange(AuthProvider.Google, {
      code: "auth-code",
      redirectUri: "https://example.com/oauth",
      codeVerifier: "verifier",
    });

    expect(postedBodies[0]).toContain("client_id=web-client.apps.googleusercontent.com");
  });
});
