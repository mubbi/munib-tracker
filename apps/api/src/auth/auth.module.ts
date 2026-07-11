import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import type { EnvironmentVariables } from "../config/env.schema";
import { AuthSessionEntity, UserEntity } from "../database/entities";
import { AuthController } from "./auth.controller";
import { AuthOAuthService } from "./auth-oauth.service";
import { AuthService } from "./auth.service";
import { OAuthProviderService } from "./oauth-provider.service";
import { TokenService } from "./token.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AuthSessionEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
        secret: configService.get("JWT_SECRET", { infer: true }),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthOAuthService, TokenService, OAuthProviderService],
  exports: [AuthService],
})
export class AuthModule {}
