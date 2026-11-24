import type { JsonWebKey, KeyObject } from "node:crypto";
import {
  createHmac,
  sign as cryptoSign,
  verify as cryptoVerify,
  generateKeyPairSync,
} from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { EnvironmentVariables } from "../config/env.schema";
import { NodeEnvironment } from "../config/env.schema";
import { jsonResponse } from "../test-support/fetch";
import { buildConfig, stubFetchRoutes } from "../test-support/oauth";
import { AuthProvider, type OAuthCallbackDto } from "./dto/auth.dto";
import { OAuthProviderService } from "./oauth-provider.service";

const APPLE_ISSUER = "https://appleid.apple.com";
const APPLE_AUD = "app.id";
const GOOGLE_AUD = "web-client";

/** RSA key pair plus its public JWK, as a provider would publish it. */
function buildSigningKey(kid: string) {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const jwk = { ...publicKey.export({ format: "jwk" }), kid, alg: "RS256", use: "sig" };
  return { kid, privateKey, jwk: jwk as JsonWebKey };
}

// Generated once: RSA key generation dominates the runtime of this file.
const APPLE_KEY = buildSigningKey("test-apple-key");
const GOOGLE_KEY = buildSigningKey("test-google-key");
const ROGUE_KEY = buildSigningKey("test-apple-key").privateKey;
const APPLE_P8 = generateKeyPairSync("ec", { namedCurve: "P-256" });

function signJwt(key: KeyObject, header: object, payload: object): string {
  const encode = (part: object) => Buffer.from(JSON.stringify(part)).toString("base64url");
  const signingInput = `${encode(header)}.${encode(payload)}`;
  const signature = cryptoSign("RSA-SHA256", Buffer.from(signingInput), key);
  return `${signingInput}.${signature.toString("base64url")}`;
}

const inOneHour = () => Math.floor(Date.now() / 1000) + 3600;

function appleIdToken(claims: object = {}, header: object = {}, key = APPLE_KEY.privateKey) {
  return signJwt(
    key,
    { alg: "RS256", kid: APPLE_KEY.kid, ...header },
    { iss: APPLE_ISSUER, aud: APPLE_AUD, sub: "apple-user", exp: inOneHour(), ...claims },
  );
}

function googleIdToken(claims: object = {}, header: object = {}, key = GOOGLE_KEY.privateKey) {
  return signJwt(
    key,
    { alg: "RS256", kid: GOOGLE_KEY.kid, ...header },
    {
      iss: "https://accounts.google.com",
      aud: GOOGLE_AUD,
      sub: "google-user",
      exp: inOneHour(),
      ...claims,
    },
  );
}

/** Serves the locally generated JWKS instead of Apple's / Google's endpoints. */
class LocalJwksOAuthProviderService extends OAuthProviderService {
  protected override async fetchAppleJwks(): Promise<JsonWebKey[]> {
    return [APPLE_KEY.jwk];
  }

  protected override async fetchGoogleJwks(): Promise<JsonWebKey[]> {
    return [GOOGLE_KEY.jwk];
  }
}

function setup(env: Partial<EnvironmentVariables> = {}, { liveJwks = false } = {}) {
  const config = buildConfig(env);
  return liveJwks ? new OAuthProviderService(config) : new LocalJwksOAuthProviderService(config);
}

const GOOGLE_ENV = { GOOGLE_OAUTH_CLIENT_IDS: GOOGLE_AUD };
const GOOGLE_CODE_ENV = { ...GOOGLE_ENV, GOOGLE_OAUTH_WEB_CLIENT_SECRET: "web-secret" };
const APPLE_ENV = { APPLE_CLIENT_IDS: APPLE_AUD };
const APPLE_CODE_ENV = {
  APPLE_CLIENT_IDS: `${APPLE_AUD}, web.services.id`,
  APPLE_TEAM_ID: "TEAM123",
  APPLE_KEY_ID: "KEY123",
  // Env files often store the .p8 with escaped newlines.
  APPLE_PRIVATE_KEY: APPLE_P8.privateKey
    .export({ format: "pem", type: "pkcs8" })
    .toString()
    .replace(/\n/g, "\\n"),
};
const FACEBOOK_ENV = { FACEBOOK_APP_ID: "fb-app-id", FACEBOOK_APP_SECRET: "fb-app-secret" };
const FACEBOOK_ROUTES = {
  "/oauth/access_token": { access_token: "fb-access-token" },
  "graph.facebook.com/me": { id: "fb-user-123", name: "FB User", email: "fb@example.com" },
};

/** Form body posted to the first fetch call. */
function postedForm(fetchMock: ReturnType<typeof stubFetchRoutes>): URLSearchParams {
  return new URLSearchParams(String(fetchMock.mock.calls[0]?.[1]?.body));
}

describe("OAuthProviderService", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("exchange guards", () => {
    it.each<[string, Partial<EnvironmentVariables>, AuthProvider, OAuthCallbackDto, string]>([
      [
        "no credential",
        GOOGLE_ENV,
        AuthProvider.Google,
        {},
        "code, id_token, or access_token is required",
      ],
      [
        "an unsupported provider",
        {},
        "twitter" as AuthProvider,
        { code: "c" },
        "Unsupported provider: twitter",
      ],
      [
        "unconfigured Google",
        {},
        AuthProvider.Google,
        { code: "c" },
        "google sign-in is not configured",
      ],
      [
        "unconfigured Facebook",
        {},
        AuthProvider.Facebook,
        { code: "c" },
        "facebook sign-in is not configured",
      ],
      [
        "unconfigured Apple audiences",
        {},
        AuthProvider.Apple,
        { idToken: "a.b.c" },
        "apple sign-in is not configured",
      ],
      [
        "Apple without a code or id_token",
        APPLE_ENV,
        AuthProvider.Apple,
        { accessToken: "x" },
        "requires an identity token or an authorization code",
      ],
      [
        "Apple code without signing credentials",
        APPLE_ENV,
        AuthProvider.Apple,
        { code: "c" },
        "apple sign-in is not configured",
      ],
      [
        "Apple code without a derivable Services ID",
        { ...APPLE_CODE_ENV, APPLE_CLIENT_IDS: " , " },
        AuthProvider.Apple,
        { code: "c" },
        "apple sign-in is not configured",
      ],
    ])("rejects %s", async (_label, env, provider, dto, message) => {
      await expect(setup(env).exchange(provider, dto)).rejects.toThrow(message);
    });

    it("rejects a provider profile without an account id", async () => {
      stubFetchRoutes({ ...FACEBOOK_ROUTES, "graph.facebook.com/me": { id: "  " } });
      await expect(
        setup(FACEBOOK_ENV).exchange(AuthProvider.Facebook, { code: "c" }),
      ).rejects.toThrow("facebook did not return an account id");
    });
  });

  describe("Facebook", () => {
    it("keys the identity off the Graph profile id", async () => {
      stubFetchRoutes(FACEBOOK_ROUTES);
      await expect(
        setup(FACEBOOK_ENV).exchange(AuthProvider.Facebook, { code: "fb-code" }),
      ).resolves.toEqual({
        providerAccountId: "fb-user-123",
        email: "fb@example.com",
        displayName: "FB User",
      });
    });

    it("signs the Graph /me call with appsecret_proof", async () => {
      const fetchMock = stubFetchRoutes(FACEBOOK_ROUTES);
      await setup(FACEBOOK_ENV).exchange(AuthProvider.Facebook, { code: "fb-code" });
      const meUrl = new URL(String(fetchMock.mock.calls[1]?.[0]));
      const expected = createHmac("sha256", "fb-app-secret")
        .update("fb-access-token")
        .digest("hex");
      expect(meUrl.searchParams.get("appsecret_proof")).toBe(expected);
    });

    it("forwards a trimmed PKCE verifier to the token endpoint", async () => {
      const fetchMock = stubFetchRoutes(FACEBOOK_ROUTES);
      await setup(FACEBOOK_ENV).exchange(AuthProvider.Facebook, {
        code: "c",
        codeVerifier: " pkce ",
      });
      const tokenUrl = new URL(String(fetchMock.mock.calls[0]?.[0]));
      expect(tokenUrl.searchParams.get("code_verifier")).toBe("pkce");
    });
  });

  describe("Google id_token", () => {
    it("returns the verified profile", async () => {
      const idToken = googleIdToken({
        email: "user@example.com",
        email_verified: true,
        name: "Google User",
      });
      await expect(setup(GOOGLE_ENV).exchange(AuthProvider.Google, { idToken })).resolves.toEqual({
        providerAccountId: "google-user",
        email: "user@example.com",
        displayName: "Google User",
      });
    });

    it.each([
      ["email_verified false", { email_verified: false }],
      ["no email_verified claim", {}],
    ])("drops an unverified email (%s)", async (_label, claims) => {
      const idToken = googleIdToken({ email: "victim@example.com", ...claims });
      await expect(
        setup(GOOGLE_ENV).exchange(AuthProvider.Google, { idToken }),
      ).resolves.toMatchObject({ providerAccountId: "google-user", email: undefined });
    });

    it.each([
      ["one of several configured audiences", `${GOOGLE_AUD}, ios-client`, "ios-client"],
      ["an audience array", GOOGLE_AUD, ["other", GOOGLE_AUD]],
    ])("accepts %s", async (_label, configured, aud) => {
      const idToken = googleIdToken({ aud });
      await expect(
        setup({ GOOGLE_OAUTH_CLIENT_IDS: configured }).exchange(AuthProvider.Google, { idToken }),
      ).resolves.toMatchObject({ providerAccountId: "google-user" });
    });

    it("accepts the bare accounts.google.com issuer", async () => {
      const idToken = googleIdToken({ iss: "accounts.google.com" });
      await expect(
        setup(GOOGLE_ENV).exchange(AuthProvider.Google, { idToken }),
      ).resolves.toMatchObject({ providerAccountId: "google-user" });
    });

    it.each([
      ["the wrong number of segments", () => "a.b", "Malformed Google identity token"],
      ["undecodable JSON", () => "e30.!!!.sig", "Malformed Google identity token"],
      [
        "a non-RS256 algorithm",
        () => googleIdToken({}, { alg: "HS256" }),
        "Unsupported Google identity token algorithm",
      ],
      [
        "an unknown key id",
        () => googleIdToken({}, { kid: "rotated" }),
        "Google signing key not found",
      ],
      [
        "a forged signature",
        () => googleIdToken({}, {}, ROGUE_KEY),
        "Invalid Google identity token signature",
      ],
      ["a foreign issuer", () => googleIdToken({ iss: "https://evil.example" }), "issuer mismatch"],
      ["no issuer", () => googleIdToken({ iss: undefined }), "issuer mismatch"],
      ["a mismatched audience", () => googleIdToken({ aud: "other-client" }), "audience mismatch"],
      ["an expired exp", () => googleIdToken({ exp: 1 }), "Google id_token has expired"],
      ["no exp", () => googleIdToken({ exp: undefined }), "Google id_token has expired"],
      ["no subject", () => googleIdToken({ sub: undefined }), "missing a subject"],
    ])("rejects a token with %s", async (_label, token, message) => {
      await expect(
        setup(GOOGLE_ENV).exchange(AuthProvider.Google, { idToken: token() }),
      ).rejects.toThrow(message);
    });
  });

  describe("Google access token", () => {
    it("returns the tokeninfo profile", async () => {
      stubFetchRoutes({
        tokeninfo: { sub: "g-1", aud: GOOGLE_AUD, email: "A@B.C", email_verified: true },
      });
      await expect(
        setup(GOOGLE_ENV).exchange(AuthProvider.Google, { accessToken: "tok" }),
      ).resolves.toEqual({ providerAccountId: "g-1", email: "a@b.c", displayName: undefined });
    });

    it("maps an audience mismatch to 401", async () => {
      stubFetchRoutes({ tokeninfo: { sub: "g-1", aud: "other" } });
      await expect(
        setup(GOOGLE_ENV).exchange(AuthProvider.Google, { accessToken: "tok" }),
      ).rejects.toMatchObject({ status: 401, message: expect.stringContaining("audience") });
    });

    it("rethrows configuration errors", async () => {
      stubFetchRoutes({ tokeninfo: { sub: "g-1", aud: GOOGLE_AUD } });
      await expect(
        setup({ NODE_ENV: NodeEnvironment.Production }).exchange(AuthProvider.Google, {
          accessToken: "tok",
        }),
      ).rejects.toThrow("required in production");
    });

    it("rejects a token tokeninfo does not accept", async () => {
      stubFetchRoutes({ tokeninfo: jsonResponse({}, 400) });
      await expect(
        setup(GOOGLE_ENV).exchange(AuthProvider.Google, { accessToken: "tok" }),
      ).rejects.toThrow("Invalid Google access token");
    });
  });

  describe("Google authorization code", () => {
    const GOOGLE_CODE_ROUTES = {
      "oauth2.googleapis.com/token": { access_token: "atok" },
      userinfo: { sub: "g-2", email: "a@b.c", email_verified: true, name: "A" },
    };

    it("returns the OpenID userinfo profile", async () => {
      stubFetchRoutes(GOOGLE_CODE_ROUTES);
      await expect(
        setup(GOOGLE_CODE_ENV).exchange(AuthProvider.Google, { code: "c" }),
      ).resolves.toEqual({ providerAccountId: "g-2", email: "a@b.c", displayName: "A" });
    });

    it.each([
      [
        "GOOGLE_OAUTH_WEB_CLIENT_ID",
        { GOOGLE_OAUTH_WEB_CLIENT_ID: "dedicated-web" },
        "dedicated-web",
      ],
      ["the first configured audience", { GOOGLE_OAUTH_CLIENT_IDS: "first second" }, "first"],
      ["an empty id when no audience parses", { GOOGLE_OAUTH_CLIENT_IDS: " , " }, ""],
    ])("uses %s as the client_id", async (_label, env, clientId) => {
      const fetchMock = stubFetchRoutes(GOOGLE_CODE_ROUTES);
      await setup({ ...GOOGLE_CODE_ENV, ...env }).exchange(AuthProvider.Google, { code: "c" });
      expect(postedForm(fetchMock).get("client_id")).toBe(clientId);
    });

    it.each([
      ["includes", "verifier", "verifier"],
      ["omits", undefined, null],
    ])("%s the PKCE code_verifier", async (_label, codeVerifier, posted) => {
      const fetchMock = stubFetchRoutes(GOOGLE_CODE_ROUTES);
      await setup(GOOGLE_CODE_ENV).exchange(AuthProvider.Google, { code: "c", codeVerifier });
      expect(postedForm(fetchMock).get("code_verifier")).toBe(posted);
    });

    it.each([
      [
        "error_description",
        jsonResponse({ error: "invalid_grant", error_description: "Bad code" }, 400),
        "Bad code",
      ],
      ["a string error", jsonResponse({ error: "invalid_grant" }, 400), "invalid_grant"],
      [
        "an error object",
        jsonResponse({ error: { message: "Nested failure" } }, 400),
        "Nested failure",
      ],
      [
        "an error object without message",
        jsonResponse({ error: { code: 1 } }, 400),
        "provider responded with 400",
      ],
      ["a non-object error", jsonResponse({ error: 42 }), "provider responded with 200"],
      ["a non-ok status", jsonResponse({}, 503), "provider responded with 503"],
      ["a non-JSON body", new Response("<html>", { status: 502 }), "provider responded with 502"],
    ])("reports a token endpoint failure with %s", async (_label, response, detail) => {
      stubFetchRoutes({ "oauth2.googleapis.com/token": response });
      await expect(
        setup(GOOGLE_CODE_ENV).exchange(AuthProvider.Google, { code: "c" }),
      ).rejects.toThrow(`OAuth exchange failed: ${detail}`);
    });
  });

  describe("Apple id_token", () => {
    it("returns the verified profile with the email local part as name", async () => {
      const idToken = appleIdToken({ email: "user@privaterelay.appleid.com" });
      await expect(setup(APPLE_ENV).exchange(AuthProvider.Apple, { idToken })).resolves.toEqual({
        providerAccountId: "apple-user",
        email: "user@privaterelay.appleid.com",
        displayName: "user",
      });
    });

    it.each<[string, Partial<EnvironmentVariables>, string | string[]]>([
      [
        "one of several configured audiences",
        { APPLE_CLIENT_IDS: `${APPLE_AUD}, com.web` },
        "com.web",
      ],
      ["the legacy APPLE_CLIENT_ID", { APPLE_CLIENT_ID: "legacy.id" }, "legacy.id"],
      ["an audience array", APPLE_ENV, ["other", APPLE_AUD]],
    ])("accepts %s", async (_label, env, aud) => {
      const idToken = appleIdToken({ aud });
      await expect(setup(env).exchange(AuthProvider.Apple, { idToken })).resolves.toMatchObject({
        providerAccountId: "apple-user",
      });
    });

    it("returns no display name without an email", async () => {
      const idToken = appleIdToken();
      await expect(
        setup(APPLE_ENV).exchange(AuthProvider.Apple, { idToken }),
      ).resolves.toMatchObject({ providerAccountId: "apple-user", displayName: undefined });
    });

    it.each([
      ["the wrong number of segments", () => "a.b.c.d", "Malformed Apple identity token"],
      ["undecodable JSON", () => "!!!.e30.sig", "Malformed Apple identity token"],
      [
        "an unknown key id",
        () => appleIdToken({}, { kid: "rotated" }),
        "Apple signing key not found",
      ],
      [
        "a forged signature",
        () => appleIdToken({}, {}, ROGUE_KEY),
        "Invalid Apple identity token signature",
      ],
      ["a foreign issuer", () => appleIdToken({ iss: "https://evil.example" }), "issuer mismatch"],
      ["a mismatched audience", () => appleIdToken({ aud: "some.other.app" }), "audience mismatch"],
      ["an expired exp", () => appleIdToken({ exp: 1 }), "Apple id_token has expired"],
      ["no exp", () => appleIdToken({ exp: undefined }), "Apple id_token has expired"],
      [
        "a non-RS256 algorithm",
        () => appleIdToken({}, { alg: "none" }),
        "Unsupported Apple identity token algorithm",
      ],
      ["no subject", () => appleIdToken({ sub: "" }), "missing a subject"],
    ])("rejects a token with %s", async (_label, token, message) => {
      await expect(
        setup(APPLE_ENV).exchange(AuthProvider.Apple, { idToken: token() }),
      ).rejects.toThrow(message);
    });
  });

  describe("Apple authorization code", () => {
    const APPLE_TOKEN_URL = "appleid.apple.com/auth/token";

    it("verifies the id_token returned by the code exchange", async () => {
      stubFetchRoutes({ [APPLE_TOKEN_URL]: { id_token: appleIdToken({ sub: "apple-web" }) } });
      await expect(
        setup(APPLE_CODE_ENV).exchange(AuthProvider.Apple, { code: "c" }),
      ).resolves.toMatchObject({ providerAccountId: "apple-web" });
    });

    it("posts the trimmed code, redirect URI and PKCE verifier", async () => {
      const fetchMock = stubFetchRoutes({ [APPLE_TOKEN_URL]: { id_token: appleIdToken() } });
      await setup(APPLE_CODE_ENV).exchange(AuthProvider.Apple, {
        code: " code ",
        redirectUri: "https://api.example/cb",
        codeVerifier: "pkce",
      });
      const form = postedForm(fetchMock);
      expect(form.get("code")).toBe("code");
      expect(form.get("redirect_uri")).toBe("https://api.example/cb");
      expect(form.get("code_verifier")).toBe("pkce");
    });

    it("omits an absent PKCE verifier", async () => {
      const fetchMock = stubFetchRoutes({ [APPLE_TOKEN_URL]: { id_token: appleIdToken() } });
      await setup(APPLE_CODE_ENV).exchange(AuthProvider.Apple, { code: "c" });
      expect(postedForm(fetchMock).has("code_verifier")).toBe(false);
    });

    it.each([
      ["APPLE_SERVICES_ID", { APPLE_SERVICES_ID: "web.services.id" }, "web.services.id"],
      ["the first audience", {}, APPLE_AUD],
    ])("uses %s as the client_id", async (_label, env, clientId) => {
      const fetchMock = stubFetchRoutes({ [APPLE_TOKEN_URL]: { id_token: appleIdToken() } });
      await setup({ ...APPLE_CODE_ENV, ...env }).exchange(AuthProvider.Apple, { code: "c" });
      expect(postedForm(fetchMock).get("client_id")).toBe(clientId);
    });

    it("authenticates with an ES256 client secret signed by the .p8 key", async () => {
      const fetchMock = stubFetchRoutes({ [APPLE_TOKEN_URL]: { id_token: appleIdToken() } });
      await setup(APPLE_CODE_ENV).exchange(AuthProvider.Apple, { code: "c" });

      const [header, payload, signature] = String(postedForm(fetchMock).get("client_secret")).split(
        ".",
      ) as [string, string, string];
      const decode = (part: string) => JSON.parse(Buffer.from(part, "base64url").toString());

      expect(decode(header)).toEqual({ alg: "ES256", kid: "KEY123", typ: "JWT" });
      expect(decode(payload)).toMatchObject({ iss: "TEAM123", aud: APPLE_ISSUER, sub: APPLE_AUD });
      expect(
        cryptoVerify(
          "sha256",
          Buffer.from(`${header}.${payload}`),
          { key: APPLE_P8.publicKey, dsaEncoding: "ieee-p1363" },
          Buffer.from(signature, "base64url"),
        ),
      ).toBe(true);
    });

    it.each([
      [{ error_description: "Code expired" }, "Code expired"],
      [{ access_token: "only" }, "no id_token returned"],
    ])("reports a code exchange without an id_token (%j)", async (body, detail) => {
      stubFetchRoutes({ [APPLE_TOKEN_URL]: body });
      await expect(
        setup(APPLE_CODE_ENV).exchange(AuthProvider.Apple, { code: "c" }),
      ).rejects.toThrow(`Apple code exchange failed: ${detail}`);
    });
  });

  describe("provider JWKS", () => {
    const JWKS_ROUTES = {
      "appleid.apple.com/auth/keys": { keys: [APPLE_KEY.jwk] },
      "googleapis.com/oauth2/v3/certs": { keys: [GOOGLE_KEY.jwk] },
    };

    it("verifies tokens against the fetched key sets", async () => {
      stubFetchRoutes(JWKS_ROUTES);
      const service = setup({ ...APPLE_ENV, ...GOOGLE_ENV }, { liveJwks: true });
      await expect(
        service.exchange(AuthProvider.Apple, { idToken: appleIdToken() }),
      ).resolves.toMatchObject({ providerAccountId: "apple-user" });
      await expect(
        service.exchange(AuthProvider.Google, { idToken: googleIdToken() }),
      ).resolves.toMatchObject({ providerAccountId: "google-user" });
    });

    it("caches each key set between sign-ins", async () => {
      const fetchMock = stubFetchRoutes(JWKS_ROUTES);
      const service = setup({ ...APPLE_ENV, ...GOOGLE_ENV }, { liveJwks: true });
      for (let i = 0; i < 2; i++) {
        await service.exchange(AuthProvider.Apple, { idToken: appleIdToken() });
        await service.exchange(AuthProvider.Google, { idToken: googleIdToken() });
      }
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });
});
