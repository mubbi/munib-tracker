import { randomUUID } from "node:crypto";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { EnvironmentVariables } from "../config/env.schema";
import { AuthSessionEntity, UserEntity } from "../database/entities";
import type {
  AuthProvider,
  AuthSessionResponseDto,
  AuthUserResponseDto,
  GuestSessionDto,
  LinkAccountDto,
  OAuthCallbackDto,
} from "./dto/auth.dto";
import { type OAuthProfile, OAuthProviderService } from "./oauth-provider.service";
import { TokenService } from "./token.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(AuthSessionEntity)
    private readonly sessionsRepository: Repository<AuthSessionEntity>,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly tokenService: TokenService,
    private readonly oauthProvider: OAuthProviderService,
  ) {}

  async createGuestSession(dto: GuestSessionDto): Promise<AuthSessionResponseDto> {
    if (dto.deviceId) {
      const existingUser = await this.usersRepository.findOne({
        where: { deviceId: dto.deviceId, accountType: "guest" },
      });

      if (existingUser) {
        return this.issueSession(existingUser);
      }
    }

    const user = await this.usersRepository.save(
      this.usersRepository.create({
        id: dto.deviceId ?? randomUUID(),
        accountType: "guest",
        deviceId: dto.deviceId ?? null,
      }),
    );

    return this.issueSession(user);
  }

  async completeOAuth(
    provider: AuthProvider,
    dto: OAuthCallbackDto,
  ): Promise<AuthSessionResponseDto> {
    const profile = await this.oauthProvider.exchange(provider, dto);
    const user = await this.upsertProviderUser(provider, profile);
    return this.issueSession(user);
  }

  async linkGuestAccount(
    accessToken: string,
    dto: LinkAccountDto,
  ): Promise<AuthSessionResponseDto> {
    const { user } = await this.getSessionByAccessToken(accessToken);

    if (user.accountType !== "guest") {
      throw new BadRequestException("Only guest accounts can be linked");
    }

    const profile = await this.oauthProvider.exchange(dto.provider, dto);

    user.accountType = "user";
    user.provider = dto.provider;
    user.email = profile.email ?? user.email ?? null;
    user.displayName = profile.displayName ?? user.displayName ?? null;
    await this.usersRepository.save(user);

    // Invalidate every existing session for the upgraded user, then issue a fresh one.
    await this.sessionsRepository.delete({ userId: user.id });
    return this.issueSession(user);
  }

  async refreshSession(refreshToken: string): Promise<AuthSessionResponseDto> {
    const session = await this.sessionsRepository.findOne({
      where: { refreshToken },
      relations: { user: true },
    });

    if (!session?.user) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    if (session.refreshExpiresAt.getTime() < Date.now()) {
      await this.sessionsRepository.delete({ id: session.id });
      throw new UnauthorizedException("Refresh token has expired");
    }

    // Rotate the refresh secret so a stolen token can't be replayed after use.
    session.refreshToken = randomUUID();
    session.refreshExpiresAt = this.refreshExpiry();
    await this.sessionsRepository.save(session);

    const access = this.tokenService.signAccessToken(session.user.id, session.id);
    return this.toSessionResponse(session, session.user, access);
  }

  async getCurrentUser(accessToken: string): Promise<AuthUserResponseDto> {
    const { user } = await this.getSessionByAccessToken(accessToken);
    return this.toUserResponse(user);
  }

  async revokeSession(accessToken: string): Promise<void> {
    const { session } = await this.getSessionByAccessToken(accessToken);
    await this.sessionsRepository.delete({ id: session.id });
  }

  private async upsertProviderUser(
    provider: AuthProvider,
    profile: OAuthProfile,
  ): Promise<UserEntity> {
    if (profile.email) {
      const existing = await this.usersRepository.findOne({
        where: { provider, email: profile.email },
      });
      if (existing) {
        existing.displayName = profile.displayName ?? existing.displayName ?? null;
        return this.usersRepository.save(existing);
      }
    }

    return this.usersRepository.save(
      this.usersRepository.create({
        id: randomUUID(),
        accountType: "user",
        provider,
        email: profile.email ?? null,
        displayName: profile.displayName ?? null,
      }),
    );
  }

  private async issueSession(user: UserEntity): Promise<AuthSessionResponseDto> {
    const session = await this.sessionsRepository.save(
      this.sessionsRepository.create({
        id: randomUUID(),
        userId: user.id,
        user,
        refreshToken: randomUUID(),
        refreshExpiresAt: this.refreshExpiry(),
      }),
    );

    const access = this.tokenService.signAccessToken(user.id, session.id);
    return this.toSessionResponse(session, user, access);
  }

  private async getSessionByAccessToken(accessToken: string) {
    const claims = this.tokenService.verifyAccessToken(accessToken);
    const session = await this.sessionsRepository.findOne({
      where: { id: claims.sid },
      relations: { user: true },
    });

    // A missing session means it was revoked (logout / relink) — reject even a
    // still-unexpired JWT.
    if (!session?.user || session.userId !== claims.sub) {
      throw new UnauthorizedException("Invalid or expired session");
    }

    return { session, user: session.user };
  }

  private refreshExpiry(): Date {
    const days = this.configService.get("JWT_REFRESH_TTL_DAYS", { infer: true });
    return new Date(Date.now() + days * 86_400_000);
  }

  private toSessionResponse(
    session: AuthSessionEntity,
    user: UserEntity,
    access: { token: string; expiresIn: number },
  ): AuthSessionResponseDto {
    return {
      accessToken: access.token,
      accessTokenExpiresIn: access.expiresIn,
      refreshToken: session.refreshToken,
      accountType: user.accountType,
      userId: user.id,
      provider: user.provider as AuthProvider | undefined,
    };
  }

  private toUserResponse(user: UserEntity): AuthUserResponseDto {
    return {
      userId: user.id,
      accountType: user.accountType,
      provider: user.provider as AuthProvider | undefined,
      email: user.email ?? undefined,
      displayName: user.displayName ?? undefined,
    };
  }
}
