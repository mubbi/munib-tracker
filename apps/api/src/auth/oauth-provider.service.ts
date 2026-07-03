import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createRemoteJWKSet, importPKCS8, jwtVerify, SignJWT } from "jose";
import type { EnvironmentVariables } from "../config/env.schema";
import type { AuthProvider, OAuthCallbackDto } from "./dto/auth.dto";

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

@Injectable()
export class OAuthProviderService {
  /** Apple's public signing keys, cached and rotated by `jose`. */
  private readonly appleJwks = createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys"));

  constructor(private readonly configService: ConfigService<EnvironmentVariables, true>) {}

  /**
   * Resolves the key used to verify Apple id_tokens. Overridable in tests so we
   * can verify locally-signed tokens without reaching Apple's JWKS endpoint.
   */
  protected appleKeyResolver(): Parameters<typeof jwtVerify>[1] {
    return this.appleJwks;
  }

  async exchange(provider: AuthProvider, dto: OAuthCallbackDto): Promise<OAuthProfile> {
    if (!dto.code?.trim() && !dto.idToken?.trim()) {
      throw new BadRequestException("An OAuth code or id_token is required");
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

  private async exchangeGoogle(dto: OAuthCallbackDto): Promise<OAuthProfile> {
    const clientId = this.requireCredential("GOOGLE_CLIENT_ID", "google");

    // Native flows hand us an id_token directly — validate it with Google's
    // tokeninfo endpoint (server-side signature + claim validation, no crypto deps).
    if (dto.idToken?.trim()) {
      const claims = await this.fetchJson<GoogleTokenInfo>(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(dto.idToken)}`,
      );
      if (claims.aud !== clientId) {
        throw new UnauthorizedException("Google id_token audience mismatch");
      }
      return {
        providerAccountId: claims.sub,
        email: claims.email,
        displayName: claims.name,
      };
    }

    const clientSecret = this.requireCredential("GOOGLE_CLIENT_SECRET", "google");
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
    const tokens = await this.fetchJson<FacebookTokenResponse>(tokenUrl.toString());

    const profileUrl = new URL("https://graph.facebook.com/me");
    profileUrl.searchParams.set("fields", "id,name,email");
    profileUrl.searchParams.set("access_token", tokens.access_token);
    const profile = await this.fetchJson<FacebookProfile>(profileUrl.toString());
    return {
      providerAccountId: profile.id,
      email: profile.email,
      displayName: profile.name,
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
    const raw = this.requireCredential("APPLE_CLIENT_ID", "apple");
    return raw
      .split(/[\s,]+/)
      .map((value) => value.trim())
      .filter(Boolean);
  }

  private async createAppleClientSecret(): Promise<string> {
    const teamId = this.requireCredential("APPLE_TEAM_ID", "apple");
    const keyId = this.requireCredential("APPLE_KEY_ID", "apple");
    const rawKey = this.requireCredential("APPLE_PRIVATE_KEY", "apple");
    const servicesId = this.appleServicesId();

    const pem = rawKey.replace(/\\n/g, "\n");
    const key = await importPKCS8(pem, "ES256");
    const now = Math.floor(Date.now() / 1000);
    return (
      new SignJWT({})
        .setProtectedHeader({ alg: "ES256", kid: keyId })
        .setIssuer(teamId)
        .setAudience(APPLE_ISSUER)
        .setSubject(servicesId)
        .setIssuedAt(now)
        // Mint a fresh secret per exchange; Apple allows up to 6 months, we keep it short.
        .setExpirationTime(now + 300)
        .sign(key)
    );
  }

  /** Services ID used as the OAuth `client_id` for web/Android Apple sign-in. */
  private appleServicesId(): string {
    const explicit = this.env("APPLE_SERVICES_ID");
    if (explicit) return String(explicit);
    // Fall back to the first configured audience (single-app setups reuse one id).
    return this.appleAudiences()[0];
  }

  private async exchangeAppleAuthorizationCode(params: {
    code: string;
    redirectUri: string;
    codeVerifier?: string;
  }): Promise<AppleTokenResponse> {
    const clientSecret = await this.createAppleClientSecret();
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
   * Cryptographically verifies an Apple identity token against Apple's JWKS
   * (signature, issuer, audience, and expiry).
   */
  private async verifyAppleIdToken(idToken: string): Promise<OAuthProfile> {
    let claims: AppleIdTokenClaims;
    try {
      const verified = await jwtVerify(idToken, this.appleKeyResolver(), {
        issuer: APPLE_ISSUER,
        audience: this.appleAudiences(),
      });
      claims = verified.payload as AppleIdTokenClaims;
    } catch (error) {
      throw new UnauthorizedException(
        `Invalid Apple identity token: ${error instanceof Error ? error.message : "verification failed"}`,
      );
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

interface GoogleTokenResponse {
  access_token: string;
  id_token?: string;
}
interface GoogleTokenInfo {
  sub: string;
  aud: string;
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
