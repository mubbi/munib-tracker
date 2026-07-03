import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

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

  @ApiPropertyOptional({ description: "PKCE code verifier when using auth code + PKCE" })
  @IsOptional()
  @IsString()
  codeVerifier?: string;

  @ApiPropertyOptional({ description: "Redirect URI used in the OAuth request" })
  @IsOptional()
  @IsString()
  redirectUri?: string;
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  codeVerifier?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  redirectUri?: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: "The opaque refresh token issued with the session" })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
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
