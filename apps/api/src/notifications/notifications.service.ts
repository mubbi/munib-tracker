import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, IsNull, Not, Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";
import { isRateLimited } from "../common/durable-rate-limit";
import type { EnvironmentVariables } from "../config/env.schema";
import { InAppNotificationEntity, PushTokenEntity } from "../database/entities";
import { parseWebPushSubscriptionTarget } from "../surface-push/web-push-endpoint";
import type {
  EngageInAppNotificationDto,
  InAppNotificationDto,
  InAppNotificationListResponseDto,
  PushTokenResponseDto,
  RemovePushTokenDto,
  RemovePushTokenResponseDto,
  UnreadCountResponseDto,
  UpsertPushTokenDto,
  VapidPublicKeyResponseDto,
} from "./dto/notifications.dto";

const IN_APP_LIST_LIMIT = 100;
/** How long a recorded open suppresses re-counting the same inbox row. */
const OPEN_DEDUPE_WINDOW_MS = 90 * 86_400_000;

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
    // A web token is a Web Push subscription whose endpoint the broadcast /
    // circle senders POST to: only well-formed subscriptions on a known push
    // service are accepted, so a client can't point server requests at
    // internal hosts (SSRF).
    if (dto.platform === "web" && !parseWebPushSubscriptionTarget(dto.token)) {
      throw new BadRequestException("Invalid Web Push subscription");
    }
    const deviceId = dto.deviceId?.trim() || null;

    // A push token / Web Push endpoint identifies one device. After sign-out or
    // an account switch, drop it from every other account so the previous
    // user's broadcasts stop landing on this device.
    await this.pushTokenRepository.delete({ token: dto.token, userId: Not(user.userId) });

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

  /**
   * Sign-out: removes this device's push token(s) from the caller's account so
   * the account's broadcasts and circle pushes stop reaching the device before
   * the session is revoked. Only the caller's own rows are touched.
   */
  async removePushToken(
    accessToken: string,
    dto: RemovePushTokenDto,
  ): Promise<RemovePushTokenResponseDto> {
    const user = await this.requireAuthenticatedUser(accessToken);
    const deviceId = dto.deviceId?.trim();
    const token = dto.token?.trim();
    if (!deviceId && !token) {
      throw new BadRequestException("deviceId or token is required");
    }
    let removed = 0;
    if (deviceId) {
      removed +=
        (await this.pushTokenRepository.delete({ userId: user.userId, deviceId })).affected ?? 0;
    }
    if (token) {
      removed +=
        (await this.pushTokenRepository.delete({ userId: user.userId, token })).affected ?? 0;
    }
    return { removed };
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

    // Broadcast counters are per-recipient engagement, not per request: a
    // client replaying `engage` must not inflate them. A click counts once per
    // inbox row (first `clickedAt`). An open can't key off `readAt` (the app
    // marks the row read before reporting the open), so it is deduped per row
    // through the shared limiter.
    if (dto.action === "open") {
      if (row.readAt == null) {
        row.readAt = now;
      }
      if (row.broadcastId != null && (await this.isFirstOpen(user.userId, row.id))) {
        await this.incrementBroadcastCounter(row.broadcastId, "opened_count");
      }
    } else {
      const firstClick = row.clickedAt == null;
      if (firstClick) {
        row.clickedAt = now;
      }
      if (row.readAt == null) {
        row.readAt = now;
      }
      if (row.broadcastId != null && firstClick) {
        await this.incrementBroadcastCounter(row.broadcastId, "clicked_count");
      }
    }

    await this.inAppRepository.save(row);
    return this.toInAppDto(row);
  }

  private async isFirstOpen(userId: string, notificationId: number): Promise<boolean> {
    return !(await isRateLimited({
      key: `notifications:open:${userId}:${notificationId}`,
      limit: 1,
      windowMs: OPEN_DEDUPE_WINDOW_MS,
    }));
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
