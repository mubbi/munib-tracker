import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import {
  AuthProvider,
  AuthSessionResponseDto,
  AuthUserResponseDto,
  type GuestSessionDto,
  type LinkAccountDto,
  type OAuthCallbackDto,
  type RefreshTokenDto,
} from "./dto/auth.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("guest")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create or resume a guest session" })
  @ApiCreatedResponse({ type: AuthSessionResponseDto })
  createGuestSession(@Body() dto: GuestSessionDto): Promise<AuthSessionResponseDto> {
    return this.authService.createGuestSession(dto);
  }

  @Post("oauth/:provider")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Complete OAuth sign-in for Google, Apple, or Facebook" })
  @ApiParam({ name: "provider", enum: AuthProvider })
  @ApiCreatedResponse({ type: AuthSessionResponseDto })
  completeOAuth(
    @Param("provider") provider: AuthProvider,
    @Body() dto: OAuthCallbackDto,
  ): Promise<AuthSessionResponseDto> {
    return this.authService.completeOAuth(provider, dto);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Rotate the refresh token and issue a new access token" })
  @ApiCreatedResponse({ type: AuthSessionResponseDto })
  refresh(@Body() dto: RefreshTokenDto): Promise<AuthSessionResponseDto> {
    return this.authService.refreshSession(dto.refreshToken);
  }

  @Post("link")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Upgrade a guest account by linking an OAuth provider" })
  @ApiOkResponse({ type: AuthSessionResponseDto })
  linkAccount(
    @Headers("authorization") authorization: string | undefined,
    @Body() dto: LinkAccountDto,
  ): Promise<AuthSessionResponseDto> {
    return this.authService.linkGuestAccount(this.extractBearerToken(authorization), dto);
  }

  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get the current authenticated user" })
  @ApiOkResponse({ type: AuthUserResponseDto })
  getCurrentUser(
    @Headers("authorization") authorization: string | undefined,
  ): Promise<AuthUserResponseDto> {
    return this.authService.getCurrentUser(this.extractBearerToken(authorization));
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Revoke the current session" })
  logout(@Headers("authorization") authorization: string | undefined): Promise<void> {
    return this.authService.revokeSession(this.extractBearerToken(authorization));
  }

  private extractBearerToken(authorization?: string): string {
    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }

    return authorization.slice("Bearer ".length).trim();
  }
}
