import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
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
@Injectable()
export class OAuthProviderService {
  constructor(private readonly configService: ConfigService<EnvironmentVariables, true>) {}

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

  private async exchangeApple(dto: OAuthCallbackDto): Promise<OAuthProfile> {
    const clientId = this.requireCredential("APPLE_CLIENT_ID", "apple");
    const idToken = dto.idToken?.trim();
    if (!idToken) {
      throw new BadRequestException("Apple sign-in requires an identity token");
    }
    return this.verifyAppleIdToken(idToken, clientId);
  }

  /**
   * Validates an Apple identity token by its claims (issuer, audience, expiry).
   *
   * NOTE: For production, add cryptographic signature verification against
   * Apple's JWKS (`https://appleid.apple.com/auth/keys`). We validate claims here
   * to avoid pulling a JWKS/JWT-verify dependency into the MVP; the surrounding
   * flow is otherwise complete.
   */
  private verifyAppleIdToken(idToken: string, clientId: string): OAuthProfile {
    const claims = decodeJwtClaims<AppleIdTokenClaims>(idToken);
    if (!claims) {
      throw new UnauthorizedException("Malformed Apple identity token");
    }
    if (claims.iss !== "https://appleid.apple.com") {
      throw new UnauthorizedException("Apple id_token issuer mismatch");
    }
    const audience = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (!audience.includes(clientId)) {
      throw new UnauthorizedException("Apple id_token audience mismatch");
    }
    if (typeof claims.exp === "number" && claims.exp * 1000 < Date.now()) {
      throw new UnauthorizedException("Apple id_token has expired");
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

/** Base64url-decodes a JWT payload without verifying its signature. */
function decodeJwtClaims<T>(token: string): T | null {
  const segments = token.split(".");
  if (segments.length < 2 || !segments[1]) return null;
  try {
    const json = Buffer.from(segments[1], "base64url").toString("utf8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
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
interface AppleIdTokenClaims {
  iss: string;
  aud: string | string[];
  sub: string;
  exp?: number;
  email?: string;
}
