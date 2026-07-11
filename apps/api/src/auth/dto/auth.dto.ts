import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export enum AuthProvider {
  Google = "google",
  Apple = "apple",
  Facebook = "facebook",
}

export class GuestSessionDto {
  @ApiPropertyOptional({
    description: "Optional stable device id to reuse guest sessions",
    example: "device-abc-123",
  })
  @IsOptional()
  @IsString()
  // Bounded to the storage column (varchar(128)) so oversized input is a clean
  // 400 rather than a DB write error. The device id is a bearer credential for
  // the guest account, so the client must generate it as a high-entropy random
  // value (the app uses `dev_<uuid>`); the server never mints a weak one.
  @MaxLength(128)
  deviceId?: string;
}

export class OAuthCallbackDto {
  @ApiPropertyOptional({ description: "Authorization code from the OAuth provider" })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({
    description: "OpenID Connect id_token from a native sign-in (Apple, Google native)",
  })
  @IsOptional()
  @IsString()
  idToken?: string;

  @ApiPropertyOptional({
    description: "Google OAuth access token from on-device PKCE exchange (native Google)",
  })
  @IsOptional()
  @IsString()
  accessToken?: string;

  @ApiPropertyOptional({ description: "PKCE code verifier when using auth code + PKCE" })
  @IsOptional()
  @IsString()
  codeVerifier?: string;

  @ApiPropertyOptional({ description: "Redirect URI used in the OAuth request" })
  @IsOptional()
  @IsString()
  redirectUri?: string;

  @ApiPropertyOptional({ description: "Display name from Apple native credential (first sign-in)" })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  displayName?: string;
}

export class AuthGoogleBodyDto {
  @ApiProperty({ description: "Google OAuth access token from on-device PKCE exchange" })
  @IsString()
  @IsNotEmpty()
  accessToken!: string;
}

export class AuthGoogleOauthBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  redirectUri!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  codeVerifier!: string;
}

export class AuthAppleBodyDto {
  @ApiProperty({ description: "Apple identity token (JWT) from native Sign in with Apple" })
  @IsString()
  @IsNotEmpty()
  identityToken!: string;

  @ApiPropertyOptional({ description: "Given + family name from Apple (first authorization only)" })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  displayName?: string;
}

export class AuthAppleOauthBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  redirectUri!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  codeVerifier!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(256)
  displayName?: string;
}

export class AuthAppleOauthSessionBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  codeVerifier!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  redirectUri!: string;

  @ApiProperty({ description: "Web origin URL to redirect after Apple form_post callback" })
  @IsString()
  @IsNotEmpty()
  returnUrl!: string;
}

export class LinkAccountDto {
  @ApiProperty({ enum: AuthProvider })
  @IsEnum(AuthProvider)
  provider!: AuthProvider;

  @ApiPropertyOptional({ description: "Authorization code from the OAuth provider" })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({
    description: "OpenID Connect id_token from a native sign-in (Apple, Google native)",
  })
  @IsOptional()
  @IsString()
  idToken?: string;

  @ApiPropertyOptional({
    description: "Google OAuth access token from on-device PKCE exchange",
  })
  @IsOptional()
  @IsString()
  accessToken?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  codeVerifier?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  redirectUri?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(256)
  displayName?: string;
}

export class RefreshTokenDto {
  @ApiPropertyOptional({
    description: "Opaque refresh token; optional for web clients that send mt_refresh_token cookie",
  })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}

export class AuthSessionResponseDto {
  @ApiProperty({ description: "Short-lived signed JWT access token" })
  accessToken!: string;

  @ApiProperty({ description: "Seconds until the access token expires" })
  accessTokenExpiresIn!: number;

  @ApiProperty({ description: "Opaque refresh token; rotates on every refresh" })
  refreshToken!: string;

  @ApiProperty({ enum: ["guest", "user"] })
  accountType!: "guest" | "user";

  @ApiProperty()
  userId!: string;

  @ApiPropertyOptional({ enum: AuthProvider })
  provider?: AuthProvider;
}

export class AuthUserResponseDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty({ enum: ["guest", "user"] })
  accountType!: "guest" | "user";

  @ApiPropertyOptional({ enum: AuthProvider })
  provider?: AuthProvider;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  displayName?: string;
}

export class WebAuthSessionResponseDto {
  @ApiProperty({ type: AuthUserResponseDto })
  user!: AuthUserResponseDto;
}
