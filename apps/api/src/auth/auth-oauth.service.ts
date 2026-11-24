import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UnsupportedMediaTypeException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request, Response } from "express";
import { clientIp } from "../common/client-ip";
import type { EnvironmentVariables } from "../config/env.schema";
import {
  clearAppleOAuthSessionCookie,
  readAppleOAuthSessionCookie,
  setAppleOAuthSessionCookie,
} from "./apple-oauth-session-cookie";
import { AuthService } from "./auth.service";
import {
  clearAccessTokenCookie,
  clearRefreshTokenCookie,
  isWebAuthClient,
  readRefreshTokenFromRequest,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "./auth-cookies";
import { isAuthOAuthRateLimited } from "./auth-rate-limit";
import type {
  AuthAppleBodyDto,
  AuthAppleOauthBodyDto,
  AuthAppleOauthSessionBodyDto,
  AuthGoogleBodyDto,
  AuthGoogleOauthBodyDto,
  AuthSessionResponseDto,
  AuthUserResponseDto,
  WebAuthSessionResponseDto,
} from "./dto/auth.dto";
import { AuthProvider } from "./dto/auth.dto";
import { GoogleAccessTokenAudienceError, verifyGoogleAccessToken } from "./google-access-token";
import { OAuthProviderService } from "./oauth-provider.service";
import { assertOAuthReturnUrlAllowed, assertRedirectUriAllowed } from "./oauth-redirect-allowlist";
import { resolveAccessToken as resolveAccessTokenFromRequest } from "./resolve-access-token";

@Injectable()
export class AuthOAuthService {
  constructor(
    private readonly authService: AuthService,
    private readonly oauthProvider: OAuthProviderService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  async issueSessionResponse(
    req: Request,
    res: Response,
    session: AuthSessionResponseDto,
    user: AuthUserResponseDto,
    /**
     * Force the cookie response. Set when the presented credential itself came
     * from the HttpOnly refresh cookie: a token the browser was never allowed to
     * read must not come back in a JSON body just because a header was omitted.
     */
    cookieSession = false,
  ): Promise<AuthSessionResponseDto | WebAuthSessionResponseDto> {
    if (cookieSession || isWebAuthClient(req)) {
      setRefreshTokenCookie(res, session.refreshToken);
      setAccessTokenCookie(res, session.accessToken);
      return { user };
    }
    return session;
  }

  async completeGoogleNative(
    req: Request,
    res: Response,
    dto: AuthGoogleBodyDto,
  ): Promise<AuthSessionResponseDto | WebAuthSessionResponseDto> {
    await this.assertOAuthRateLimit(req);
    let info: Awaited<ReturnType<typeof verifyGoogleAccessToken>>;
    try {
      info = await verifyGoogleAccessToken(this.configService, dto.accessToken);
    } catch (error) {
      if (error instanceof GoogleAccessTokenAudienceError) {
        throw new UnauthorizedException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : "Google sign-in is not configured on the server",
      );
    }
    if (!info?.sub) {
      throw new UnauthorizedException("Invalid Google token");
    }
    const session = await this.authService.completeOAuthFromProfile(AuthProvider.Google, {
      providerAccountId: info.sub,
      email: info.email,
      displayName: info.name,
    });
    const user = await this.authService.getCurrentUser(session.accessToken);
    return this.issueSessionResponse(req, res, session, user);
  }

  async completeGoogleOauth(
    req: Request,
    res: Response,
    dto: AuthGoogleOauthBodyDto,
  ): Promise<AuthSessionResponseDto | WebAuthSessionResponseDto> {
    await this.assertOAuthRateLimit(req);
    assertRedirectUriAllowed(this.configService, dto.redirectUri);
    const session = await this.authService.completeOAuth(
      AuthProvider.Google,
      {
        code: dto.code,
        redirectUri: dto.redirectUri,
        codeVerifier: dto.codeVerifier,
      },
      clientIp(req),
    );
    const user = await this.authService.getCurrentUser(session.accessToken);
    return this.issueSessionResponse(req, res, session, user);
  }

  async completeAppleNative(
    req: Request,
    res: Response,
    dto: AuthAppleBodyDto,
  ): Promise<AuthSessionResponseDto | WebAuthSessionResponseDto> {
    await this.assertOAuthRateLimit(req);
    const profile = await this.oauthProvider.exchange(AuthProvider.Apple, {
      idToken: dto.identityToken,
    });
    if (dto.displayName?.trim()) {
      profile.displayName = dto.displayName.trim();
    }
    const session = await this.authService.completeOAuthFromProfile(AuthProvider.Apple, profile);
    const user = await this.authService.getCurrentUser(session.accessToken);
    return this.issueSessionResponse(req, res, session, user);
  }

  async completeAppleOauth(
    req: Request,
    res: Response,
    dto: AuthAppleOauthBodyDto,
  ): Promise<AuthSessionResponseDto | WebAuthSessionResponseDto> {
    await this.assertOAuthRateLimit(req);
    assertRedirectUriAllowed(this.configService, dto.redirectUri);
    const profile = await this.oauthProvider.exchange(AuthProvider.Apple, {
      code: dto.code,
      redirectUri: dto.redirectUri,
      codeVerifier: dto.codeVerifier,
    });
    if (dto.displayName?.trim()) {
      profile.displayName = dto.displayName.trim();
    }
    const session = await this.authService.completeOAuthFromProfile(AuthProvider.Apple, profile);
    const user = await this.authService.getCurrentUser(session.accessToken);
    return this.issueSessionResponse(req, res, session, user);
  }

  startAppleOauthSession(req: Request, res: Response, dto: AuthAppleOauthSessionBodyDto): void {
    // Only the app's credentialed `fetch` (JSON, CORS-preflighted) may plant this
    // cookie. A cross-site HTML form can POST urlencoded bodies without a
    // preflight, and would otherwise seed the victim's browser with an
    // attacker-chosen PKCE verifier for a login-CSRF via the form_post callback.
    if (!isJsonContentType(req)) {
      throw new UnsupportedMediaTypeException("Content-Type must be application/json");
    }
    assertRedirectUriAllowed(this.configService, dto.redirectUri);
    assertOAuthReturnUrlAllowed(this.configService, dto.returnUrl);
    setAppleOAuthSessionCookie(res, {
      codeVerifier: dto.codeVerifier.trim(),
      redirectUri: dto.redirectUri.trim(),
      returnUrl: dto.returnUrl.trim(),
    });
  }

  async completeAppleOauthCallback(req: Request, res: Response): Promise<void> {
    await this.assertOAuthRateLimit(req);
    const code = typeof req.body?.code === "string" ? req.body.code.trim() : "";
    if (!code) {
      throw new BadRequestException("Missing authorization code");
    }
    const sessionCookie = readAppleOAuthSessionCookie(req);
    if (!sessionCookie) {
      throw new BadRequestException("Apple sign-in session expired. Try again.");
    }
    clearAppleOAuthSessionCookie(res);
    // Re-check both URLs: the allowlist may have changed since the cookie was
    // set, and the return URL is where the browser is redirected below.
    assertRedirectUriAllowed(this.configService, sessionCookie.redirectUri);
    assertOAuthReturnUrlAllowed(this.configService, sessionCookie.returnUrl);

    const profile = await this.oauthProvider.exchange(AuthProvider.Apple, {
      code,
      redirectUri: sessionCookie.redirectUri,
      codeVerifier: sessionCookie.codeVerifier,
    });
    // Apple may POST a JSON `user` string with name on first authorization.
    const appleUserRaw = typeof req.body?.user === "string" ? req.body.user : undefined;
    if (appleUserRaw) {
      try {
        const parsed = JSON.parse(appleUserRaw) as {
          name?: { firstName?: string; lastName?: string };
        };
        const parts = [parsed.name?.firstName, parsed.name?.lastName]
          .map((p) => p?.trim())
          .filter(Boolean);
        if (parts.length) {
          profile.displayName = parts.join(" ");
        }
      } catch {
        // ignore malformed Apple user payload
      }
    }

    const session = await this.authService.completeOAuthFromProfile(AuthProvider.Apple, profile);
    setRefreshTokenCookie(res, session.refreshToken);
    setAccessTokenCookie(res, session.accessToken);

    const returnUrl = new URL(sessionCookie.returnUrl);
    returnUrl.searchParams.set("apple_oauth", "success");
    res.redirect(302, returnUrl.toString());
  }

  resolveAccessToken(req: Request, authorization?: string): string {
    return resolveAccessTokenFromRequest(req, authorization);
  }

  /** `true` when the request carries a valid sealed `mt_refresh_token` cookie. */
  usesRefreshCookie(req: Request): boolean {
    return readRefreshTokenFromRequest(req) !== null;
  }

  /** Best-effort revoke of the session behind the refresh cookie (logout). */
  async revokeCookieRefreshSession(req: Request): Promise<void> {
    const token = readRefreshTokenFromRequest(req);
    if (!token) return;
    try {
      await this.authService.revokeSessionByRefreshToken(token);
    } catch {
      // Logout must still clear cookies; the session expires on its own.
    }
  }

  resolveRefreshToken(req: Request, bodyToken?: string): string {
    const fromCookie = readRefreshTokenFromRequest(req);
    const fromBody = bodyToken?.trim();
    const token = fromCookie ?? (fromBody || null);
    if (!token) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
    return token;
  }

  clearAuthCookies(res: Response): void {
    clearAccessTokenCookie(res);
    clearRefreshTokenCookie(res);
  }

  private async assertOAuthRateLimit(req: Request): Promise<void> {
    if (await isAuthOAuthRateLimited(`ip:${clientIp(req)}`)) {
      throw new HttpException("Too many OAuth attempts", HttpStatus.TOO_MANY_REQUESTS);
    }
  }
}

function isJsonContentType(req: Request): boolean {
  const raw = req.headers?.["content-type"];
  const mediaType = (typeof raw === "string" ? raw : "").split(";")[0]?.trim().toLowerCase();
  return mediaType === "application/json";
}
