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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(AuthSessionEntity)
    private readonly sessionsRepository: Repository<AuthSessionEntity>,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  async createGuestSession(dto: GuestSessionDto): Promise<AuthSessionResponseDto> {
    if (dto.deviceId) {
      const existingUser = await this.usersRepository.findOne({
        where: { deviceId: dto.deviceId, accountType: "guest" },
      });

      if (existingUser) {
        const existingSession = await this.sessionsRepository.findOne({
          where: { userId: existingUser.id },
          order: { createdAt: "DESC" },
        });

        if (existingSession) {
          return this.toSessionResponse(existingSession, existingUser);
        }
      }
    }

    const user = await this.usersRepository.save(
      this.usersRepository.create({
        id: dto.deviceId ?? randomUUID(),
        accountType: "guest",
        deviceId: dto.deviceId ?? null,
      }),
    );

    const session = await this.createSession(user);
    return this.toSessionResponse(session, user);
  }

  async completeOAuth(
    provider: AuthProvider,
    dto: OAuthCallbackDto,
  ): Promise<AuthSessionResponseDto> {
    this.assertProviderConfigured(provider);

    if (!dto.code.trim()) {
      throw new BadRequestException("OAuth code is required");
    }

    const user = await this.usersRepository.save(
      this.usersRepository.create({
        id: randomUUID(),
        accountType: "user",
        provider,
        email: `${provider}-user@example.com`,
        displayName: `${provider} user`,
      }),
    );

    const session = await this.createSession(user);
    return this.toSessionResponse(session, user);
  }

  async linkGuestAccount(
    accessToken: string,
    dto: LinkAccountDto,
  ): Promise<AuthSessionResponseDto> {
    const { session, user } = await this.getSessionByAccessToken(accessToken);

    if (user.accountType !== "guest") {
      throw new BadRequestException("Only guest accounts can be linked");
    }

    this.assertProviderConfigured(dto.provider);

    user.accountType = "user";
    user.provider = dto.provider;
    user.email = `${dto.provider}-user@example.com`;
    user.displayName = `${dto.provider} user`;
    await this.usersRepository.save(user);

    await this.sessionsRepository.delete({ id: session.id });

    const upgradedSession = await this.createSession(user);
    return this.toSessionResponse(upgradedSession, user);
  }

  async getCurrentUser(accessToken: string): Promise<AuthUserResponseDto> {
    const { user } = await this.getSessionByAccessToken(accessToken);
    return this.toUserResponse(user);
  }

  async revokeSession(accessToken: string): Promise<void> {
    const { session } = await this.getSessionByAccessToken(accessToken);
    await this.sessionsRepository.delete({ id: session.id });
  }

  private async createSession(user: UserEntity): Promise<AuthSessionEntity> {
    return this.sessionsRepository.save(
      this.sessionsRepository.create({
        id: randomUUID(),
        userId: user.id,
        user,
        accessToken: randomUUID(),
        refreshToken: randomUUID(),
      }),
    );
  }

  private async getSessionByAccessToken(accessToken: string) {
    const session = await this.sessionsRepository.findOne({
      where: { accessToken },
      relations: { user: true },
    });

    if (!session?.user) {
      throw new UnauthorizedException("Invalid or expired session");
    }

    return { session, user: session.user };
  }

  private assertProviderConfigured(provider: AuthProvider): void {
    const envKey = {
      google: "GOOGLE_CLIENT_ID",
      apple: "APPLE_CLIENT_ID",
      facebook: "FACEBOOK_APP_ID",
    }[provider] as keyof EnvironmentVariables;

    const configured = this.configService.get(envKey, { infer: true });

    if (!configured) {
      throw new BadRequestException(`${provider} sign-in is not configured on the server yet`);
    }
  }

  private toSessionResponse(session: AuthSessionEntity, user: UserEntity): AuthSessionResponseDto {
    return {
      accessToken: session.accessToken,
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
