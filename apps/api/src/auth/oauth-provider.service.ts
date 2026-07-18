import {
  createHmac,
  createPrivateKey,
  createPublicKey,
  sign as cryptoSign,
  verify as cryptoVerify,
  type JsonWebKey,
} from "node:crypto";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { EnvironmentVariables } from "../config/env.schema";
import type { AuthProvider, OAuthCallbackDto } from "./dto/auth.dto";
import { GoogleAccessTokenAudienceError, verifyGoogleAccessToken } from "./google-access-token";

/** Normalised identity returned by every provider exchange. */
export interface OAuthProfile {
  providerAccountId: string;
  email?: string;
  displayName?: string;
}

/**
 * Exchanges provider credentials (an authorization `code` or a native `idToken`)
 * for a verified user profile. Real HTTP is used for Google and Facebook; Apple
 * id_tokens are validated by claims (see the note on `verifyAppleIdToken`).
 *
 * The service is intentionally isolated from `AuthService` so tests can override
 * it without hitting the network.
 */
const APPLE_ISSUER = "https://appleid.apple.com";
const APPLE_TOKEN_URL = "https://appleid.apple.com/auth/token";
const APPLE_JWKS_URL = "https://appleid.apple.com/auth/keys";
const GOOGLE_ISSUERS = new Set(["https://accounts.google.com", "accounts.google.com"]);
const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
/** Cache provider JWKS briefly so we don't refetch on every sign-in. */
const JWKS_TTL_MS = 60 * 60 * 1000;

@Injectable()
export class OAuthProviderService {
  private appleJwksCache: { keys: JsonWebKey[]; fetchedAt: number } | null = null;
  private googleJwksCache: { keys: JsonWebKey[]; fetchedAt: number } | null = null;

  constructor(private readonly configService: ConfigService<EnvironmentVariables, true>) {}

  /**
   * Fetches Apple's JSON Web Key Set (RSA public keys) used to verify id_token
   * signatures. Overridable in tests so we can verify locally-signed tokens
   * without reaching Apple's JWKS endpoint.
   */
  protected async fetchAppleJwks(): Promise<JsonWebKey[]> {
    const now = Date.now();
    if (this.appleJwksCache && now - this.appleJwksCache.fetchedAt < JWKS_TTL_MS) {
      return this.appleJwksCache.keys;
    }
    const jwks = await this.fetchJson<{ keys: JsonWebKey[] }>(APPLE_JWKS_URL);
    this.appleJwksCache = { keys: jwks.keys, fetchedAt: now };
    return jwks.keys;
  }

  /**
   * Fetches Google's JSON Web Key Set (RSA public keys) used to verify id_token
   * signatures. Overridable in tests so we can verify locally-signed tokens
   * without reaching Google's JWKS endpoint.
   */
  protected async fetchGoogleJwks(): Promise<JsonWebKey[]> {
    const now = Date.now();
    if (this.googleJwksCache && now - this.googleJwksCache.fetchedAt < JWKS_TTL_MS) {
      return this.googleJwksCache.keys;
    }
    const jwks = await this.fetchJson<{ keys: JsonWebKey[] }>(GOOGLE_JWKS_URL);
    this.googleJwksCache = { keys: jwks.keys, fetchedAt: now };
    return jwks.keys;
  }

  async exchange(provider: AuthProvider, dto: OAuthCallbackDto): Promise<OAuthProfile> {
    if (!dto.code?.trim() && !dto.idToken?.trim() && !dto.accessToken?.trim()) {
      throw new BadRequestException("An OAuth code, id_token, or access_token is required");
    }

    switch (provider) {
      case "google":
        return this.exchangeGoogle(dto);
      case "facebook":
        return this.exchangeFacebook(dto);
      case "apple":
        return this.exchangeApple(dto);
      default:
        throw new BadRequestException(`Unsupported provider: ${provider}`);
    }
  }

  private env<K extends keyof EnvironmentVariables>(key: K): EnvironmentVariables[K] | undefined {
    return this.configService.get(key, { infer: true });
  }

  private requireCredential<K extends keyof EnvironmentVariables>(
    key: K,
    provider: string,
  ): string {
    const value = this.env(key);
    if (!value) {
      throw new BadRequestException(`${provider} sign-in is not configured on the server yet`);
    }
    return String(value);
  }

  // --- Google -------------------------------------------------------------

  /**
   * Allowed Google id_token audiences (comma/space separated). Include the Web
   * client id plus iOS/Android client ids so native Sign-In tokens validate.
   */
  private googleAudiences(): string[] {
    const raw = this.requireCredential("GOOGLE_OAUTH_CLIENT_IDS", "google");
    return raw
      .split(/[\s,]+/)
      .map((value) => value.trim())
      .filter(Boolean);
  }

  /** Web client id used for the authorization-code exchange (holds the secret). */
  private googleWebClientId(): string {
    const dedicated = this.env("GOOGLE_OAUTH_WEB_CLIENT_ID")?.trim();
    if (dedicated) return dedicated;
    const audiences = this.googleAudiences();
    return audiences[0] ?? "";
  }

  private async exchangeGoogle(dto: OAuthCallbackDto): Promise<OAuthProfile> {
    // Native flows may hand us an id_token directly — verify RS256 signature and claims.
    if (dto.idToken?.trim()) {
      return this.verifyGoogleIdToken(dto.idToken);
    }

    // Native Google: on-device PKCE exchange yields an access token verified via tokeninfo.
    if (dto.accessToken?.trim()) {
      let info: Awaited<ReturnType<typeof verifyGoogleAccessToken>>;
      try {
        info = await verifyGoogleAccessToken(this.configService, dto.accessToken);
      } catch (error) {
        if (error instanceof GoogleAccessTokenAudienceError) {
          throw new UnauthorizedException(error.message);
        }
        throw error;
      }
      if (!info?.sub) {
        throw new UnauthorizedException("Invalid Google access token");
      }
      return {
        providerAccountId: info.sub,
        email: info.email,
        displayName: info.name,
      };
    }

    const clientId = this.googleWebClientId();
    const clientSecret = this.requireCredential("GOOGLE_OAUTH_WEB_CLIENT_SECRET", "google");
    const tokens = await this.postForm<GoogleTokenResponse>("https://oauth2.googleapis.com/token", {
      code: dto.code ?? "",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: dto.redirectUri ?? "",
      grant_type: "authorization_code",
      ...(dto.codeVerifier ? { code_verifier: dto.codeVerifier } : {}),
    });

    const profile = await this.fetchJson<GoogleUserInfo>(
      "https://openidconnect.googleapis.com/v1/userinfo",
      { Authorization: `Bearer ${tokens.access_token}` },
    );
    return {
      providerAccountId: profile.sub,
      email: profile.email,
      displayName: profile.name,
    };
  }

  // --- Facebook -----------------------------------------------------------

  private async exchangeFacebook(dto: OAuthCallbackDto): Promise<OAuthProfile> {
    const appId = this.requireCredential("FACEBOOK_APP_ID", "facebook");
    const appSecret = this.requireCredential("FACEBOOK_APP_SECRET", "facebook");

    const tokenUrl = new URL("https://graph.facebook.com/v18.0/oauth/access_token");
    tokenUrl.searchParams.set("client_id", appId);
    tokenUrl.searchParams.set("client_secret", appSecret);
    tokenUrl.searchParams.set("redirect_uri", dto.redirectUri ?? "");
    tokenUrl.searchParams.set("code", dto.code ?? "");
    if (dto.codeVerifier?.trim()) {
      tokenUrl.searchParams.set("code_verifier", dto.codeVerifier.trim());
    }
    const tokens = await this.fetchJson<FacebookTokenResponse>(tokenUrl.toString());

    // Prove server-side possession of the app secret so a leaked access token
    // alone can't query the Graph API on our behalf (Facebook's appsecret_proof).
    const appSecretProof = createHmac("sha256", appSecret)
      .update(tokens.access_token)
      .digest("hex");

    const profileUrl = new URL("https://graph.facebook.com/me");
    profileUrl.searchParams.set("fields", "id,name,email");
    profileUrl.searchParams.set("access_token", tokens.access_token);
    profileUrl.searchParams.set("appsecret_proof", appSecretProof);
    const profile = await this.fetchJson<FacebookProfile>(profileUrl.toString());
    // Identity is keyed off the stable provider `id`, never the (unverified) email.
    return {
      providerAccountId: profile.id,
      email: profile.email,
      displayName: profile.name,
    };
  }

  /**
   * Cryptographically verifies a Google identity token: RSA (RS256) signature
   * against Google's JWKS, plus issuer, audience, and expiry claims.
   */
  private async verifyGoogleIdToken(idToken: string): Promise<OAuthProfile> {
    const audiences = this.googleAudiences();
    const parts = idToken.split(".");
    if (parts.length !== 3) {
      throw new UnauthorizedException("Malformed Google identity token");
    }
    const [encodedHeader, encodedPayload, encodedSignature] = parts as [string, string, string];

    let header: { kid?: string; alg?: string };
    let claims: GoogleIdTokenClaims;
    try {
      header = JSON.parse(Buffer.from(encodedHeader, "base64url").toString("utf8"));
      claims = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    } catch {
      throw new UnauthorizedException("Malformed Google identity token");
    }

    if (header.alg !== "RS256") {
      throw new UnauthorizedException("Unsupported Google identity token algorithm");
    }

    const jwk = (await this.fetchGoogleJwks()).find(
      (key) => (key as { kid?: string }).kid === header.kid,
    );
    if (!jwk) {
      throw new UnauthorizedException("Google signing key not found for token");
    }

    const publicKey = createPublicKey({ key: jwk, format: "jwk" });
    const signatureValid = cryptoVerify(
      "RSA-SHA256",
      Buffer.from(`${encodedHeader}.${encodedPayload}`),
      publicKey,
      Buffer.from(encodedSignature, "base64url"),
    );
    if (!signatureValid) {
      throw new UnauthorizedException("Invalid Google identity token signature");
    }

    if (!claims.iss || !GOOGLE_ISSUERS.has(claims.iss)) {
      throw new UnauthorizedException("Google id_token issuer mismatch");
    }
    const tokenAudiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (!tokenAudiences.some((aud) => audiences.includes(aud))) {
      throw new UnauthorizedException("Google id_token audience mismatch");
    }
    if (typeof claims.exp === "number" && claims.exp * 1000 < Date.now()) {
      throw new UnauthorizedException("Google id_token has expired");
    }
    if (!claims.sub) {
      throw new UnauthorizedException("Google identity token is missing a subject");
    }

    return {
      providerAccountId: claims.sub,
      email: claims.email,
      displayName: claims.name,
    };
  }

  // --- Apple --------------------------------------------------------------

  /**
   * Native iOS sends an `idToken` directly (Sign in with Apple). Web and Android
   * use the OAuth code flow: the app hands us an authorization `code`, which we
   * exchange for an `id_token` using a short-lived ES256 client secret signed
   * with the Apple `.p8` key (the app can never hold that secret).
   */
  private async exchangeApple(dto: OAuthCallbackDto): Promise<OAuthProfile> {
    const idToken = dto.idToken?.trim();
    if (idToken) {
      return this.verifyAppleIdToken(idToken);
    }

    const code = dto.code?.trim();
    if (!code) {
      throw new BadRequestException(
        "Apple sign-in requires an identity token or an authorization code",
      );
    }

    const tokens = await this.exchangeAppleAuthorizationCode({
      code,
      redirectUri: dto.redirectUri ?? "",
      codeVerifier: dto.codeVerifier,
    });
    if (!tokens.id_token) {
      const detail = tokens.error_description || tokens.error || "no id_token returned";
      throw new UnauthorizedException(`Apple code exchange failed: ${detail}`);
    }
    return this.verifyAppleIdToken(tokens.id_token);
  }

  /** Comma/space separated allowed audiences (iOS bundle id + web Services ID). */
  private appleAudiences(): string[] {
    const list = this.env("APPLE_CLIENT_IDS")?.trim();
    const legacy = this.env("APPLE_CLIENT_ID")?.trim();
    const raw = list || legacy;
    if (!raw) {
      throw new BadRequestException("apple sign-in is not configured on the server yet");
    }
    return raw
      .split(/[\s,]+/)
      .map((value) => value.trim())
      .filter(Boolean);
  }

  private createAppleClientSecret(): string {
    const teamId = this.requireCredential("APPLE_TEAM_ID", "apple");
    const keyId = this.requireCredential("APPLE_KEY_ID", "apple");
    const rawKey = this.requireCredential("APPLE_PRIVATE_KEY", "apple");
    const servicesId = this.appleServicesId();

    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "ES256", kid: keyId, typ: "JWT" };
    const payload = {
      iss: teamId,
      iat: now,
      // Mint a fresh secret per exchange; Apple allows up to 6 months, we keep it short.
      exp: now + 300,
      aud: APPLE_ISSUER,
      sub: servicesId,
    };

    const signingInput = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}`;
    const privateKey = createPrivateKey(rawKey.replace(/\\n/g, "\n"));
    // JWT ES256 requires the raw R||S signature (IEEE P1363), not ASN.1/DER.
    const signature = cryptoSign("sha256", Buffer.from(signingInput), {
      key: privateKey,
      dsaEncoding: "ieee-p1363",
    });
    return `${signingInput}.${signature.toString("base64url")}`;
  }

  /** Services ID used as the OAuth `client_id` for web/Android Apple sign-in. */
  private appleServicesId(): string {
    const explicit = this.env("APPLE_SERVICES_ID");
    if (explicit) return String(explicit);
    // Fall back to the first configured audience (single-app setups reuse one id).
    const [first] = this.appleAudiences();
    if (!first) {
      throw new BadRequestException("apple sign-in is not configured on the server yet");
    }
    return first;
  }

  private async exchangeAppleAuthorizationCode(params: {
    code: string;
    redirectUri: string;
    codeVerifier?: string;
  }): Promise<AppleTokenResponse> {
    const clientSecret = this.createAppleClientSecret();
    return this.postForm<AppleTokenResponse>(APPLE_TOKEN_URL, {
      client_id: this.appleServicesId(),
      client_secret: clientSecret,
      code: params.code,
      grant_type: "authorization_code",
      redirect_uri: params.redirectUri,
      ...(params.codeVerifier ? { code_verifier: params.codeVerifier } : {}),
    });
  }

  /**
   * Cryptographically verifies an Apple identity token: RSA (RS256) signature
   * against Apple's JWKS, plus issuer, audience, and expiry claims.
   */
  private async verifyAppleIdToken(idToken: string): Promise<OAuthProfile> {
    const audiences = this.appleAudiences();
    const parts = idToken.split(".");
    if (parts.length !== 3) {
      throw new UnauthorizedException("Malformed Apple identity token");
    }
    const [encodedHeader, encodedPayload, encodedSignature] = parts as [string, string, string];

    let header: { kid?: string; alg?: string };
    let claims: AppleIdTokenClaims;
    try {
      header = JSON.parse(Buffer.from(encodedHeader, "base64url").toString("utf8"));
      claims = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    } catch {
      throw new UnauthorizedException("Malformed Apple identity token");
    }

    const jwk = (await this.fetchAppleJwks()).find(
      (key) => (key as { kid?: string }).kid === header.kid,
    );
    if (!jwk) {
      throw new UnauthorizedException("Apple signing key not found for token");
    }

    const publicKey = createPublicKey({ key: jwk, format: "jwk" });
    const signatureValid = cryptoVerify(
      "RSA-SHA256",
      Buffer.from(`${encodedHeader}.${encodedPayload}`),
      publicKey,
      Buffer.from(encodedSignature, "base64url"),
    );
    if (!signatureValid) {
      throw new UnauthorizedException("Invalid Apple identity token signature");
    }

    if (claims.iss !== APPLE_ISSUER) {
      throw new UnauthorizedException("Apple id_token issuer mismatch");
    }
    const tokenAudiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (!tokenAudiences.some((aud) => audiences.includes(aud))) {
      throw new UnauthorizedException("Apple id_token audience mismatch");
    }
    if (typeof claims.exp === "number" && claims.exp * 1000 < Date.now()) {
      throw new UnauthorizedException("Apple id_token has expired");
    }
    if (!claims.sub) {
      throw new UnauthorizedException("Apple identity token is missing a subject");
    }

    return {
      providerAccountId: claims.sub,
      email: claims.email,
      displayName: claims.email?.split("@")[0],
    };
  }

  // --- HTTP helpers -------------------------------------------------------

  private async postForm<T>(url: string, form: Record<string, string>): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(form).toString(),
    });
    return this.parse<T>(response);
  }

  private async fetchJson<T>(url: string, headers?: Record<string, string>): Promise<T> {
    const response = await fetch(url, { headers });
    return this.parse<T>(response);
  }

  private async parse<T>(response: Response): Promise<T> {
    const body = (await response.json().catch(() => undefined)) as
      | (T & { error?: unknown; error_description?: string })
      | undefined;
    if (!response.ok || !body || body.error) {
      const detail =
        (body && (body.error_description || asMessage(body.error))) ??
        `provider responded with ${response.status}`;
      throw new UnauthorizedException(`OAuth exchange failed: ${detail}`);
    }
    return body;
  }
}

function asMessage(error: unknown): string | undefined {
  if (!error) return undefined;
  if (typeof error === "string") return error;
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return undefined;
}

function base64UrlEncode(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

interface GoogleTokenResponse {
  access_token: string;
  id_token?: string;
}
interface GoogleIdTokenClaims {
  iss: string;
  aud: string | string[];
  sub: string;
  exp?: number;
  email?: string;
  name?: string;
}
interface GoogleUserInfo {
  sub: string;
  email?: string;
  name?: string;
}
interface FacebookTokenResponse {
  access_token: string;
}
interface FacebookProfile {
  id: string;
  name?: string;
  email?: string;
}
interface AppleTokenResponse {
  access_token?: string;
  id_token?: string;
  refresh_token?: string;
  error?: string;
  error_description?: string;
}
interface AppleIdTokenClaims {
  iss: string;
  aud: string | string[];
  sub: string;
  exp?: number;
  email?: string;
}
