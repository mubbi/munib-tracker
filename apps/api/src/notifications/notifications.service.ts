import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, IsNull, Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";
import type { EnvironmentVariables } from "../config/env.schema";
import { InAppNotificationEntity, PushTokenEntity } from "../database/entities";
import type {
  EngageInAppNotificationDto,
  InAppNotificationDto,
  InAppNotificationListResponseDto,
  PushTokenResponseDto,
  UnreadCountResponseDto,
  UpsertPushTokenDto,
  VapidPublicKeyResponseDto,
} from "./dto/notifications.dto";

const IN_APP_LIST_LIMIT = 100;

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(InAppNotificationEntity)
    private readonly inAppRepository: Repository<InAppNotificationEntity>,
    @InjectRepository(PushTokenEntity)
    private readonly pushTokenRepository: Repository<PushTokenEntity>,
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly dataSource: DataSource,
  ) {}

  getVapidPublicKey(): VapidPublicKeyResponseDto {
    const publicKey = this.configService.get("VAPID_PUBLIC_KEY", { infer: true }) ?? null;
    return { publicKey: publicKey?.trim() ? publicKey.trim() : null };
  }

  async upsertPushToken(
    accessToken: string,
    dto: UpsertPushTokenDto,
  ): Promise<PushTokenResponseDto> {
    const user = await this.requireAuthenticatedUser(accessToken);
    const deviceId = dto.deviceId?.trim() || null;

    let row: PushTokenEntity | null = null;
    if (deviceId) {
      row = await this.pushTokenRepository.findOne({
        where: { userId: user.userId, deviceId },
      });
    }
    if (!row) {
      row = await this.pushTokenRepository.findOne({
        where: { userId: user.userId, token: dto.token },
      });
    }

    if (row) {
      row.token = dto.token;
      row.deviceId = deviceId;
      row.platform = dto.platform;
      row.locale = dto.locale ?? null;
      row.clientPlatform = dto.clientPlatform ?? null;
      row = await this.pushTokenRepository.save(row);
    } else {
      row = await this.pushTokenRepository.save(
        this.pushTokenRepository.create({
          userId: user.userId,
          token: dto.token,
          deviceId,
          platform: dto.platform,
          locale: dto.locale ?? null,
          clientPlatform: dto.clientPlatform ?? null,
        }),
      );
    }

    return {
      id: row.id,
      token: row.token,
      platform: row.platform,
      deviceId: row.deviceId ?? null,
      locale: row.locale ?? null,
      clientPlatform: row.clientPlatform ?? null,
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async listInApp(accessToken: string): Promise<InAppNotificationListResponseDto> {
    const user = await this.requireLinkedUser(accessToken);
    const rows = await this.inAppRepository.find({
      where: { userId: user.userId },
      order: { createdAt: "DESC", id: "DESC" },
      take: IN_APP_LIST_LIMIT,
    });
    return { items: rows.map((row) => this.toInAppDto(row)) };
  }

  async unreadCount(accessToken: string): Promise<UnreadCountResponseDto> {
    const user = await this.requireLinkedUser(accessToken);
    const count = await this.inAppRepository.count({
      where: { userId: user.userId, readAt: IsNull() },
    });
    return { count };
  }

  async markRead(accessToken: string, id: number): Promise<InAppNotificationDto> {
    const user = await this.requireLinkedUser(accessToken);
    const row = await this.findOwned(user.userId, id);
    if (row.readAt == null) {
      row.readAt = new Date();
      await this.inAppRepository.save(row);
    }
    return this.toInAppDto(row);
  }

  async markAllRead(accessToken: string): Promise<UnreadCountResponseDto> {
    const user = await this.requireLinkedUser(accessToken);
    await this.inAppRepository.update(
      { userId: user.userId, readAt: IsNull() },
      { readAt: new Date() },
    );
    return { count: 0 };
  }

  async engage(
    accessToken: string,
    id: number,
    dto: EngageInAppNotificationDto,
  ): Promise<InAppNotificationDto> {
    const user = await this.requireLinkedUser(accessToken);
    const row = await this.findOwned(user.userId, id);
    const now = new Date();

    if (dto.action === "open") {
      if (row.readAt == null) {
        row.readAt = now;
      }
      if (row.broadcastId != null) {
        await this.incrementBroadcastCounter(row.broadcastId, "opened_count");
      }
    } else {
      if (row.clickedAt == null) {
        row.clickedAt = now;
      }
      if (row.readAt == null) {
        row.readAt = now;
      }
      if (row.broadcastId != null) {
        await this.incrementBroadcastCounter(row.broadcastId, "clicked_count");
      }
    }

    await this.inAppRepository.save(row);
    return this.toInAppDto(row);
  }

  private async incrementBroadcastCounter(
    broadcastId: number,
    column: "opened_count" | "clicked_count",
  ): Promise<void> {
    const driver = this.dataSource.options.type;
    const placeholder = driver === "postgres" ? "$1" : "?";
    await this.dataSource.query(
      `UPDATE admin_broadcasts SET "${column}" = COALESCE("${column}", 0) + 1 WHERE id = ${placeholder}`,
      [broadcastId],
    );
  }

  private async findOwned(userId: string, id: number): Promise<InAppNotificationEntity> {
    const row = await this.inAppRepository.findOne({ where: { id, userId } });
    if (!row) {
      throw new NotFoundException("Notification not found");
    }
    return row;
  }

  private async requireAuthenticatedUser(accessToken: string) {
    if (!accessToken) {
      throw new UnauthorizedException("Missing bearer token");
    }
    return this.authService.getCurrentUser(accessToken);
  }

  private async requireLinkedUser(accessToken: string) {
    if (!accessToken) {
      throw new UnauthorizedException("Missing bearer token");
    }

    const user = await this.authService.getCurrentUser(accessToken);

    if (user.accountType === "guest") {
      throw new ForbiddenException({
        message: "In-app notifications require a linked account",
        code: "GUEST_NOT_ALLOWED",
      });
    }

    return user;
  }

  private toInAppDto(row: InAppNotificationEntity): InAppNotificationDto {
    return {
      id: row.id,
      kind: row.kind,
      title: row.title,
      body: row.body,
      subtitle: row.subtitle ?? null,
      routeData: row.routeData ?? null,
      dedupeKey: row.dedupeKey ?? null,
      broadcastId: row.broadcastId ?? null,
      readAt: row.readAt?.toISOString() ?? null,
      clickedAt: row.clickedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
