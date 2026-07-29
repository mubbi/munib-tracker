import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthOAuthService } from "./auth-oauth.service";
import {
  AuthAppleBodyDto,
  AuthAppleOauthBodyDto,
  AuthAppleOauthSessionBodyDto,
  AuthGoogleBodyDto,
  AuthGoogleOauthBodyDto,
  AuthProvider,
  AuthSessionResponseDto,
  AuthUserResponseDto,
  DeleteAccountDto,
  type GuestSessionDto,
  type LinkAccountDto,
  type OAuthCallbackDto,
  type RefreshTokenDto,
  ResetAppDataDto,
  TvPairingClaimBodyDto,
  TvPairingCreateResponseDto,
  TvPairingStatusResponseDto,
  WebAuthSessionResponseDto,
} from "./dto/auth.dto";

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

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authOAuthService: AuthOAuthService,
  ) {}

  @Post("guest")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create or resume a guest session" })
  @ApiCreatedResponse({ type: AuthSessionResponseDto })
  createGuestSession(
    @Body() dto: GuestSessionDto,
    @Req() req: Request,
  ): Promise<AuthSessionResponseDto> {
    return this.authService.createGuestSession(dto, clientIp(req));
  }

  @Post("tv/pairing")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Create a TV companion pairing code",
    description:
      "The TV displays a QR / short code. The phone opens the claim URL, signs in, and posts the code.",
  })
  @ApiCreatedResponse({ type: TvPairingCreateResponseDto })
  createTvPairing(@Req() req: Request): Promise<TvPairingCreateResponseDto> {
    return this.authService.createTvPairing(clientIp(req));
  }

  @Get("tv/pairing/:code")
  @ApiOperation({ summary: "Poll TV companion pairing status (TV client)" })
  @ApiParam({ name: "code", description: "Pairing code from POST /auth/tv/pairing" })
  @ApiOkResponse({ type: TvPairingStatusResponseDto })
  pollTvPairing(
    @Param("code") code: string,
    @Req() req: Request,
  ): Promise<TvPairingStatusResponseDto> {
    return this.authService.pollTvPairing(code, clientIp(req));
  }

  @Post("tv/pairing/claim")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Claim a TV pairing from a signed-in phone",
    description:
      "Requires a linked (non-guest) account. Issues a fresh session for the TV to poll.",
  })
  @ApiNoContentResponse({ description: "Pairing claimed; TV can poll for the session" })
  async claimTvPairing(
    @Headers("authorization") authorization: string | undefined,
    @Body() dto: TvPairingClaimBodyDto,
    @Req() req: Request,
  ): Promise<void> {
    const accessToken = this.authOAuthService.resolveAccessToken(req, authorization);
    await this.authService.claimTvPairing(accessToken, dto.code, clientIp(req));
  }

  @Post("google")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Complete Google sign-in with a native OAuth access token" })
  @ApiCreatedResponse({ type: AuthSessionResponseDto })
  @ApiOkResponse({ type: WebAuthSessionResponseDto })
  completeGoogle(
    @Body() dto: AuthGoogleBodyDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authOAuthService.completeGoogleNative(req, res, dto);
  }

  @Post("google/oauth")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Complete Google sign-in via authorization-code + PKCE (web)" })
  @ApiCreatedResponse({ type: AuthSessionResponseDto })
  @ApiOkResponse({ type: WebAuthSessionResponseDto })
  completeGoogleOauth(
    @Body() dto: AuthGoogleOauthBodyDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authOAuthService.completeGoogleOauth(req, res, dto);
  }

  @Post("apple")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Complete Apple sign-in with a native identity token" })
  @ApiCreatedResponse({ type: AuthSessionResponseDto })
  @ApiOkResponse({ type: WebAuthSessionResponseDto })
  completeApple(
    @Body() dto: AuthAppleBodyDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authOAuthService.completeAppleNative(req, res, dto);
  }

  @Post("apple/oauth")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Complete Apple sign-in via authorization-code + PKCE" })
  @ApiCreatedResponse({ type: AuthSessionResponseDto })
  @ApiOkResponse({ type: WebAuthSessionResponseDto })
  completeAppleOauth(
    @Body() dto: AuthAppleOauthBodyDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authOAuthService.completeAppleOauth(req, res, dto);
  }

  @Post("apple/oauth/session")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Store Apple web OAuth PKCE session cookie before form_post" })
  @ApiNoContentResponse()
  startAppleOauthSession(
    @Body() dto: AuthAppleOauthSessionBodyDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): void {
    this.authOAuthService.startAppleOauthSession(req, res, dto);
  }

  @Post("apple/oauth/callback")
  @ApiOperation({ summary: "Apple form_post callback — exchanges code and redirects to returnUrl" })
  async appleOauthCallback(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.authOAuthService.completeAppleOauthCallback(req, res);
  }

  @Post("oauth/:provider")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Complete OAuth sign-in (Facebook, or legacy Google/Apple code/idToken path)",
  })
  @ApiParam({ name: "provider", enum: AuthProvider })
  @ApiCreatedResponse({ type: AuthSessionResponseDto })
  completeOAuth(
    @Param("provider") provider: AuthProvider,
    @Body() dto: OAuthCallbackDto,
    @Req() req: Request,
  ): Promise<AuthSessionResponseDto> {
    return this.authService.completeOAuth(provider, dto, clientIp(req));
  }

  @Post("refresh")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Rotate the refresh token and issue a new access token" })
  @ApiCreatedResponse({ type: AuthSessionResponseDto })
  @ApiOkResponse({ type: WebAuthSessionResponseDto })
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = this.authOAuthService.resolveRefreshToken(req, dto.refreshToken);
    const session = await this.authService.refreshSession(refreshToken, clientIp(req));
    const user = await this.authService.getCurrentUser(session.accessToken);
    return this.authOAuthService.issueSessionResponse(req, res, session, user);
  }

  @Post("link")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Upgrade a guest account by linking an OAuth provider" })
  @ApiOkResponse({ type: AuthSessionResponseDto })
  @ApiOkResponse({ type: WebAuthSessionResponseDto })
  async linkAccount(
    @Headers("authorization") authorization: string | undefined,
    @Body() dto: LinkAccountDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = this.authOAuthService.resolveAccessToken(req, authorization);
    const session = await this.authService.linkGuestAccount(accessToken, dto);
    const user = await this.authService.getCurrentUser(session.accessToken);
    return this.authOAuthService.issueSessionResponse(req, res, session, user);
  }

  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get the current authenticated user" })
  @ApiOkResponse({ type: AuthUserResponseDto })
  getCurrentUser(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
  ): Promise<AuthUserResponseDto> {
    const accessToken = this.authOAuthService.resolveAccessToken(req, authorization);
    return this.authService.getCurrentUser(accessToken);
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Revoke the current session" })
  async logout(
    @Headers("authorization") authorization: string | undefined,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const accessToken = this.authOAuthService.resolveAccessToken(req, authorization);
    await this.authService.revokeSession(accessToken);
    this.authOAuthService.clearAuthCookies(res);
  }

  @Post("reset-app-data")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Reset app data without deleting the account",
    description:
      'Clears synced app data and user media while preserving the account, OAuth identity, push tokens, and sessions. Body confirmation must be the literal "RESET".',
  })
  @ApiNoContentResponse({ description: "App data reset; account and session preserved" })
  async resetAppData(
    @Headers("authorization") authorization: string | undefined,
    @Body() dto: ResetAppDataDto,
    @Req() req: Request,
  ): Promise<void> {
    const accessToken = this.authOAuthService.resolveAccessToken(req, authorization);
    await this.authService.resetAppData(accessToken, dto, clientIp(req));
  }

  @Post("delete-account")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Close account and remove user data",
    description:
      'Irreversible closure: wipes app data, revokes sessions, clears OAuth identity, and tombstones the email. Body must include confirmation set to the literal "DELETE", a primaryReason code, and optional details (max 500 characters).',
  })
  @ApiNoContentResponse({ description: "Account closed and data removed" })
  async deleteAccount(
    @Headers("authorization") authorization: string | undefined,
    @Body() dto: DeleteAccountDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const accessToken = this.authOAuthService.resolveAccessToken(req, authorization);
    await this.authService.deleteAccount(accessToken, dto, clientIp(req));
    this.authOAuthService.clearAuthCookies(res);
  }
}
