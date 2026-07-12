import { randomUUID } from "node:crypto";
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, In, Repository } from "typeorm";
import { AttachmentStorageService } from "../common/attachment-storage.service";
import type { EnvironmentVariables } from "../config/env.schema";
import {
  AuthSessionEntity,
  ContentReportAttachmentEntity,
  ContentReportEntity,
  SyncRecordEntity,
  UserEntity,
  UserMediaEntity,
} from "../database/entities";
import {
  isAuthGuestRateLimited,
  isAuthOAuthRateLimited,
  isAuthRefreshRateLimited,
} from "./auth-rate-limit";
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

/** Client-supplied device ids must be high-entropy; reject empty / trivial values. */
const MIN_DEVICE_ID_LENGTH = 16;

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
    private readonly dataSource: DataSource,
    private readonly attachmentStorage: AttachmentStorageService,
  ) {}

  async createGuestSession(
    dto: GuestSessionDto,
    clientIp = "unknown",
  ): Promise<AuthSessionResponseDto> {
    const deviceId = dto.deviceId?.trim() || undefined;
    if (deviceId != null && deviceId.length < MIN_DEVICE_ID_LENGTH) {
      throw new BadRequestException("deviceId is too short");
    }

    const rateKey = deviceId ? `device:${deviceId}` : `ip:${clientIp}`;
    if (await isAuthGuestRateLimited(rateKey)) {
      throw new HttpException("Too many guest session requests", HttpStatus.TOO_MANY_REQUESTS);
    }

    if (deviceId) {
      const existingUser = await this.usersRepository.findOne({
        where: { deviceId, accountType: "guest" },
      });

      if (existingUser) {
        return this.issueSession(existingUser);
      }
    }

    // Always server-mint the user id — never use client deviceId as primary key.
    const user = await this.usersRepository.save(
      this.usersRepository.create({
        id: randomUUID(),
        accountType: "guest",
        deviceId: deviceId ?? null,
      }),
    );

    return this.issueSession(user);
  }

  async completeOAuth(
    provider: AuthProvider,
    dto: OAuthCallbackDto,
    clientIp = "unknown",
  ): Promise<AuthSessionResponseDto> {
    if (await isAuthOAuthRateLimited(`ip:${clientIp}`)) {
      throw new HttpException("Too many OAuth attempts", HttpStatus.TOO_MANY_REQUESTS);
    }
    const profile = await this.oauthProvider.exchange(provider, dto);
    if (dto.displayName?.trim()) {
      profile.displayName = dto.displayName.trim();
    }
    return this.completeOAuthFromProfile(provider, profile);
  }

  /** Upsert provider user + issue session (used by dedicated Google/Apple routes). */
  async completeOAuthFromProfile(
    provider: AuthProvider,
    profile: OAuthProfile,
  ): Promise<AuthSessionResponseDto> {
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
    if (dto.displayName?.trim()) {
      profile.displayName = dto.displayName.trim();
    }

    // If this provider identity already belongs to another user, linking would
    // hijack/collide with it. Reject rather than silently overwrite — the caller
    // must sign in to that existing account instead.
    const existing = await this.usersRepository.findOne({
      where: { provider: dto.provider, providerAccountId: profile.providerAccountId },
    });
    if (existing && existing.id !== user.id) {
      throw new ConflictException("This account is already linked to another user");
    }

    user.accountType = "user";
    user.provider = dto.provider;
    user.providerAccountId = profile.providerAccountId;
    user.email = profile.email ?? user.email ?? null;
    user.displayName = profile.displayName ?? user.displayName ?? null;
    await this.usersRepository.save(user);

    // Invalidate every existing session for the upgraded user, then issue a fresh one.
    await this.sessionsRepository.delete({ userId: user.id });
    return this.issueSession(user);
  }

  async refreshSession(
    refreshToken: string,
    clientIp = "unknown",
  ): Promise<AuthSessionResponseDto> {
    if (await isAuthRefreshRateLimited(`ip:${clientIp}`)) {
      throw new HttpException("Too many refresh attempts", HttpStatus.TOO_MANY_REQUESTS);
    }
    const now = new Date();
    const nextToken = randomUUID();
    const nextExpiry = this.refreshExpiry();

    // Atomically claim-and-rotate: a single conditional UPDATE guarded on the
    // presented token still being valid. Two concurrent requests with the same
    // token race on this row; exactly one flips it, the loser sees affected === 0
    // and is treated as a replay. This closes the read-modify-write window.
    const result = await this.sessionsRepository
      .createQueryBuilder()
      .update(AuthSessionEntity)
      .set({ refreshToken: nextToken, refreshExpiresAt: nextExpiry })
      .where("refreshToken = :refreshToken", { refreshToken })
      .andWhere("refreshExpiresAt > :now", { now })
      .execute();

    if (!result.affected) {
      // Either an unknown/rotated-out token (replay) or an expired one. In both
      // cases the presented secret is dead; if a matching-but-expired session
      // lingers, delete it so a stale row can't be probed again.
      await this.sessionsRepository.delete({ refreshToken });
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const session = await this.sessionsRepository.findOne({
      where: { refreshToken: nextToken },
      relations: { user: true },
    });
    if (!session?.user) {
      throw new UnauthorizedException("Invalid refresh token");
    }

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

  /**
   * Permanently deletes the authenticated user's account and every trace of their
   * data: synced records, sessions across all devices, and content reports. Each
   * table is cleared explicitly inside one transaction rather than relying on
   * `ON DELETE CASCADE` — `sync_records` has only a plain `userId` column (no FK),
   * and the SQLite test driver doesn't enforce foreign keys, so a cascade would
   * leave orphans there. Attachment files are unlinked from disk afterwards, off
   * the transaction's hot path, so a missing file can't reverse a committed wipe.
   */
  async deleteAccount(accessToken: string): Promise<void> {
    const { user } = await this.getSessionByAccessToken(accessToken);
    const userId = user.id;

    const reportIds = (
      await this.dataSource
        .getRepository(ContentReportEntity)
        .find({ where: { userId }, select: { id: true } })
    ).map((report) => report.id);

    const attachmentPaths = reportIds.length
      ? (
          await this.dataSource
            .getRepository(ContentReportAttachmentEntity)
            .find({ where: { reportId: In(reportIds) }, select: { storagePath: true } })
        ).map((attachment) => attachment.storagePath)
      : [];

    const userMedia = await this.dataSource
      .getRepository(UserMediaEntity)
      .find({ where: { userId }, select: { id: true, storagePath: true } });
    const userMediaPaths = userMedia.map((media) => media.storagePath);

    await this.dataSource.transaction(async (manager) => {
      if (reportIds.length) {
        await manager.delete(ContentReportAttachmentEntity, { reportId: In(reportIds) });
      }
      await manager.delete(ContentReportEntity, { userId });
      if (userMedia.length) {
        await manager.delete(UserMediaEntity, { userId });
      }
      await manager.delete(SyncRecordEntity, { userId });
      await manager.delete(AuthSessionEntity, { userId });
      await manager.delete(UserEntity, { id: userId });
    });

    await Promise.all(
      [...attachmentPaths, ...userMediaPaths].map((path) => this.attachmentStorage.remove(path)),
    );
  }

  private async upsertProviderUser(
    provider: AuthProvider,
    profile: OAuthProfile,
  ): Promise<UserEntity> {
    // The provider's stable subject id is the authoritative identity key. Email
    // is non-authoritative metadata (mutable, and not unique across providers).
    const existing = await this.usersRepository.findOne({
      where: { provider, providerAccountId: profile.providerAccountId },
    });
    if (existing) {
      existing.email = profile.email ?? existing.email ?? null;
      existing.displayName = profile.displayName ?? existing.displayName ?? null;
      return this.usersRepository.save(existing);
    }

    return this.usersRepository.save(
      this.usersRepository.create({
        id: randomUUID(),
        accountType: "user",
        provider,
        providerAccountId: profile.providerAccountId,
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
