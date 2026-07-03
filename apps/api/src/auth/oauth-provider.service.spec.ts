import type { ConfigService } from "@nestjs/config";
import { describe, expect, it } from "vitest";
import type { EnvironmentVariables } from "../config/env.schema";
import { AuthProvider } from "./dto/auth.dto";
import { OAuthProviderService } from "./oauth-provider.service";

function makeService(env: Partial<EnvironmentVariables> = {}): OAuthProviderService {
  const config = {
    get: (key: keyof EnvironmentVariables) => env[key],
  } as unknown as ConfigService<EnvironmentVariables, true>;
  return new OAuthProviderService(config);
}

/** Builds an unsigned JWT with the given payload (Apple path validates claims only). */
function makeIdToken(payload: Record<string, unknown>): string {
  const encode = (obj: unknown) => Buffer.from(JSON.stringify(obj)).toString("base64url");
  return `${encode({ alg: "none" })}.${encode(payload)}.`;
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
    const service = makeService({ APPLE_CLIENT_ID: "app.munib.tracker" });
    const idToken = makeIdToken({
      iss: "https://appleid.apple.com",
      aud: "app.munib.tracker",
      sub: "apple-user-1",
      email: "user@privaterelay.appleid.com",
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    const profile = await service.exchange(AuthProvider.Apple, { idToken });
    expect(profile.providerAccountId).toBe("apple-user-1");
    expect(profile.email).toBe("user@privaterelay.appleid.com");
  });

  it("rejects an Apple token with a mismatched audience", async () => {
    const service = makeService({ APPLE_CLIENT_ID: "app.munib.tracker" });
    const idToken = makeIdToken({
      iss: "https://appleid.apple.com",
      aud: "some.other.app",
      sub: "apple-user-1",
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    await expect(service.exchange(AuthProvider.Apple, { idToken })).rejects.toThrow(
      "audience mismatch",
    );
  });

  it("rejects an expired Apple token", async () => {
    const service = makeService({ APPLE_CLIENT_ID: "app.munib.tracker" });
    const idToken = makeIdToken({
      iss: "https://appleid.apple.com",
      aud: "app.munib.tracker",
      sub: "apple-user-1",
      exp: Math.floor(Date.now() / 1000) - 10,
    });

    await expect(service.exchange(AuthProvider.Apple, { idToken })).rejects.toThrow("expired");
  });
});
