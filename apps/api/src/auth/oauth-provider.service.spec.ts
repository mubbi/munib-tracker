import type { ConfigService } from "@nestjs/config";
import { generateKeyPair, type JWTVerifyGetKey, type KeyLike, SignJWT } from "jose";
import { describe, expect, it } from "vitest";
import type { EnvironmentVariables } from "../config/env.schema";
import { AuthProvider } from "./dto/auth.dto";
import { OAuthProviderService } from "./oauth-provider.service";

/**
 * Test double that verifies Apple id_tokens against a locally generated public
 * key instead of Apple's live JWKS endpoint (offline, deterministic).
 */
class TestOAuthProviderService extends OAuthProviderService {
  constructor(
    config: ConfigService<EnvironmentVariables, true>,
    private readonly verifyKey: KeyLike,
  ) {
    super(config);
  }

  protected override appleKeyResolver(): Parameters<typeof import("jose").jwtVerify>[1] {
    return this.verifyKey as unknown as JWTVerifyGetKey;
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

async function makeAppleService(env: Partial<EnvironmentVariables> = {}) {
  const { privateKey, publicKey } = await generateKeyPair("ES256");
  const service = new TestOAuthProviderService(makeConfig(env), publicKey);
  return { service, privateKey };
}

/** Signs an ES256 id_token that mimics an Apple identity token. */
async function signAppleToken(
  privateKey: KeyLike,
  claims: { aud: string; sub: string; email?: string; expiresIn?: number },
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const builder = new SignJWT(claims.email ? { email: claims.email } : {})
    .setProtectedHeader({ alg: "ES256" })
    .setIssuer("https://appleid.apple.com")
    .setAudience(claims.aud)
    .setSubject(claims.sub)
    .setIssuedAt(now)
    .setExpirationTime(now + (claims.expiresIn ?? 3600));
  return builder.sign(privateKey);
}

describe("OAuthProviderService", () => {
  it("requires a code or id_token", async () => {
    const service = makeService({ GOOGLE_CLIENT_ID: "gid" });
    await expect(service.exchange(AuthProvider.Google, {})).rejects.toThrow(
      "code or id_token is required",
    );
  });

  it("rejects a provider that is not configured", async () => {
    const service = makeService();
    await expect(service.exchange(AuthProvider.Google, { code: "abc" })).rejects.toThrow(
      "google sign-in is not configured",
    );
  });

  it("validates and accepts an Apple identity token", async () => {
    const { service, privateKey } = await makeAppleService({
      APPLE_CLIENT_ID: "app.munib.tracker",
    });
    const idToken = await signAppleToken(privateKey, {
      aud: "app.munib.tracker",
      sub: "apple-user-1",
      email: "user@privaterelay.appleid.com",
    });

    const profile = await service.exchange(AuthProvider.Apple, { idToken });
    expect(profile.providerAccountId).toBe("apple-user-1");
    expect(profile.email).toBe("user@privaterelay.appleid.com");
  });

  it("accepts an id_token whose audience matches one of several configured ids", async () => {
    const { service, privateKey } = await makeAppleService({
      APPLE_CLIENT_ID: "com.munibtracker.app, com.munibtracker.web",
    });
    const idToken = await signAppleToken(privateKey, {
      aud: "com.munibtracker.web",
      sub: "apple-user-2",
    });

    const profile = await service.exchange(AuthProvider.Apple, { idToken });
    expect(profile.providerAccountId).toBe("apple-user-2");
  });

  it("rejects an Apple token with a mismatched audience", async () => {
    const { service, privateKey } = await makeAppleService({
      APPLE_CLIENT_ID: "app.munib.tracker",
    });
    const idToken = await signAppleToken(privateKey, {
      aud: "some.other.app",
      sub: "apple-user-1",
    });

    await expect(service.exchange(AuthProvider.Apple, { idToken })).rejects.toThrow(
      "Invalid Apple identity token",
    );
  });

  it("rejects an expired Apple token", async () => {
    const { service, privateKey } = await makeAppleService({
      APPLE_CLIENT_ID: "app.munib.tracker",
    });
    const idToken = await signAppleToken(privateKey, {
      aud: "app.munib.tracker",
      sub: "apple-user-1",
      expiresIn: -10,
    });

    await expect(service.exchange(AuthProvider.Apple, { idToken })).rejects.toThrow(
      "Invalid Apple identity token",
    );
  });

  it("requires an id_token or code for Apple", async () => {
    const service = makeService({ APPLE_CLIENT_ID: "app.munib.tracker" });
    await expect(service.exchange(AuthProvider.Apple, {})).rejects.toThrow(
      "code or id_token is required",
    );
  });
});
