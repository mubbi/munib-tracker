import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request, Response } from "express";
import type { EnvironmentVariables } from "../config/env.schema";
import {
  clearAccessTokenCookie,
  clearRefreshTokenCookie,
  isWebAuthClient,
  readAccessTokenFromRequest,
  readRefreshTokenFromRequest,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "./auth-cookies";
import { isAuthOAuthRateLimited } from "./auth-rate-limit";
import { AuthService } from "./auth.service";
import {
  clearAppleOAuthSessionCookie,
  readAppleOAuthSessionCookie,
  setAppleOAuthSessionCookie,
} from "./apple-oauth-session-cookie";
import { AuthProvider } from "./dto/auth.dto";
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
import { verifyGoogleAccessToken } from "./google-access-token";
import {
  assertOAuthReturnUrlAllowed,
  assertRedirectUriAllowed,
} from "./oauth-redirect-allowlist";
import { OAuthProviderService } from "./oauth-provider.service";

function clientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return forwarded[0].split(",")[0]?.trim() || "unknown";
  }
  return req.ip?.trim() || "unknown";
}

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
  ): Promise<AuthSessionResponseDto | WebAuthSessionResponseDto> {
    if (isWebAuthClient(req)) {
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
    assertRedirectUriAllowed(this.configService, dto.redirectUri);
    assertOAuthReturnUrlAllowed(this.configService, dto.returnUrl);
    setAppleOAuthSessionCookie(res, {
      codeVerifier: dto.codeVerifier.trim(),
      redirectUri: dto.redirectUri.trim(),
      returnUrl: dto.returnUrl.trim(),
    });
  }

  async completeAppleOauthCallback(req: Request, res: Response): Promise<void> {
    const code = typeof req.body?.code === "string" ? req.body.code.trim() : "";
    if (!code) {
      throw new BadRequestException("Missing authorization code");
    }
    const sessionCookie = readAppleOAuthSessionCookie(req);
    if (!sessionCookie) {
      throw new BadRequestException("Apple sign-in session expired. Try again.");
    }
    clearAppleOAuthSessionCookie(res);
    assertRedirectUriAllowed(this.configService, sessionCookie.redirectUri);

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
    if (authorization?.startsWith("Bearer ")) {
      const bearer = authorization.slice("Bearer ".length).trim();
      if (bearer) return bearer;
    }
    const fromCookie = readAccessTokenFromRequest(req);
    if (fromCookie) return fromCookie;
    throw new UnauthorizedException("Missing bearer token");
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
