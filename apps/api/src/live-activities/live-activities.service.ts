import { randomUUID } from "node:crypto";
import {
  ACTIVITY_LIFETIME_MS,
  deliverLiveActivityJob,
  dispatchDueLiveActivityJobs,
  encryptActivityKitToken,
  hashActivityKitToken,
  LiveActivityDeliveryError,
  MAX_CONTENT_STATE_BYTES,
  resolveActivityKitEncryptionKey,
} from "@munib-tracker/live-activity-delivery";
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";
import type { EnvironmentVariables } from "../config/env.schema";
import { LiveActivityPushJobEntity, LiveActivityPushTokenEntity } from "../database/entities";
import { ApnsLiveActivityService } from "./apns-live-activity.service";
import type {
  LiveActivityDispatchResponseDto,
  LiveActivityLifecycleDto,
  LiveActivityRegistrationResponseDto,
  UpsertLiveActivityDto,
} from "./dto/live-activity.dto";
import { LiveActivityQStashService } from "./live-activity-qstash.service";
import { TypeOrmLiveActivityJobStore } from "./typeorm-live-activity-job-store";

@Injectable()
export class LiveActivitiesService {
  constructor(
    @InjectRepository(LiveActivityPushTokenEntity)
    private readonly tokenRepository: Repository<LiveActivityPushTokenEntity>,
    @InjectRepository(LiveActivityPushJobEntity)
    private readonly jobRepository: Repository<LiveActivityPushJobEntity>,
    private readonly authService: AuthService,
    private readonly apns: ApnsLiveActivityService,
    private readonly qstash: LiveActivityQStashService,
    private readonly store: TypeOrmLiveActivityJobStore,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  async upsert(
    accessToken: string,
    dto: UpsertLiveActivityDto,
  ): Promise<LiveActivityRegistrationResponseDto> {
    const user = await this.authService.getCurrentUser(accessToken);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ACTIVITY_LIFETIME_MS);
    // Accept overdue catch-up flips for up to the after-Salah window (30 min).
    // Clients re-queue the latest due boundary with its original executeAt so a
    // cancel/recreate race cannot leave ActivityKit stuck on afterSalah.
    const overdueGraceMs = 30 * 60_000;
    const updates = dto.updates
      .map((update) => ({
        ...update,
        executeDate: new Date(update.executeAt),
        staleDate: update.staleAt ? new Date(update.staleAt) : null,
        contentStateJson: this.validateContentState(update.contentState),
      }))
      .filter((update) => update.executeDate.getTime() >= now.getTime() - overdueGraceMs)
      .sort((a, b) => a.executeDate.getTime() - b.executeDate.getTime());

    if (updates.length === 0) throw new BadRequestException("No future Live Activity updates");
    if (updates.some((update) => update.executeDate > expiresAt)) {
      throw new BadRequestException("Live Activity updates cannot exceed ActivityKit lifetime");
    }

    const existing = await this.tokenRepository.findOne({ where: { activityId: dto.activityId } });
    if (existing && existing.userId !== user.userId) {
      throw new ForbiddenException("Live Activity belongs to another account");
    }

    // Deliver already-due pending jobs before wiping them. Otherwise a sync that
    // lands just after a phase boundary deletes the overdue row and cancels
    // QStash before APNs ever updates the lock screen.
    if (existing) {
      const duePending = await this.jobRepository
        .createQueryBuilder("job")
        .where("job.activityTokenId = :id", { id: existing.id })
        .andWhere("job.status = :status", { status: "pending" })
        .andWhere("job.executeAt <= :now", { now })
        .orderBy("job.executeAt", "ASC")
        .getMany();
      for (const job of duePending) {
        try {
          await this.deliver(job.id);
        } catch {
          // Best-effort; the replacement schedule below still includes catch-up.
        }
      }
    }

    const oldMessageIds = existing
      ? (
          await this.jobRepository.find({
            where: { activityTokenId: existing.id, status: "pending" },
          })
        )
          .map((job) => job.qstashMessageId)
          .filter((id): id is string => Boolean(id))
      : [];

    let activity =
      existing ??
      this.tokenRepository.create({
        activityId: dto.activityId,
        userId: user.userId,
      });
    const tokenHash = hashActivityKitToken(dto.pushToken);
    // ActivityKit may reuse a push token across restarts; clear older rows that
    // still hold the same hash so the unique index does not reject the upsert.
    await this.tokenRepository
      .createQueryBuilder()
      .delete()
      .where("tokenHash = :tokenHash", { tokenHash })
      .andWhere(existing ? "id != :id" : "1=1", existing ? { id: existing.id } : {})
      .execute();

    activity.tokenHash = tokenHash;
    activity.tokenCiphertext = encryptActivityKitToken(dto.pushToken, this.encryptionKey());
    activity.apnsEnvironment = dto.environment;
    activity.status = "active";
    activity.expiresAt = expiresAt;
    activity = await this.tokenRepository.save(activity);

    await this.jobRepository.delete({ activityTokenId: activity.id });
    await this.qstash.cancel(oldMessageIds);

    const jobs = await this.jobRepository.save(
      updates.map((update) =>
        this.jobRepository.create({
          id: randomUUID(),
          activityTokenId: activity.id,
          phase: update.phase,
          executeAt: update.executeDate,
          staleAt: update.staleDate,
          contentStateJson: update.contentStateJson,
          status: "pending",
        }),
      ),
    );

    await Promise.all(
      jobs.map(async (job) => {
        try {
          // Overdue catch-up jobs use a past executeAt; ask QStash to run ASAP.
          const fireAt = job.executeAt.getTime() < Date.now() ? new Date() : job.executeAt;
          job.qstashMessageId = await this.qstash.schedule(job.id, fireAt);
          if (job.qstashMessageId) await this.jobRepository.save(job);
        } catch (error) {
          // Durable DB + the minute cron remain the fallback if QStash is down.
          job.lastError = this.errorMessage(error);
          await this.jobRepository.save(job);
        }
      }),
    );

    return {
      activityId: activity.activityId,
      expiresAt: expiresAt.toISOString(),
      scheduled: jobs.length,
    };
  }

  async lifecycle(
    accessToken: string,
    activityId: string,
    dto: LiveActivityLifecycleDto,
  ): Promise<void> {
    const user = await this.authService.getCurrentUser(accessToken);
    const activity = await this.tokenRepository.findOne({ where: { activityId } });
    if (!activity) return;
    if (activity.userId !== user.userId) throw new ForbiddenException();
    activity.status = "ended";
    await this.tokenRepository.save(activity);
    const messageIds = await this.store.cancelPendingForActivity(
      activity.id,
      `Activity ${dto.state}`,
    );
    await this.qstash.cancel(messageIds);
  }

  async deliver(jobId: string): Promise<void> {
    try {
      await deliverLiveActivityJob({
        store: this.store,
        apns: this.apns.getClient(),
        encryptionKey: this.encryptionKey(),
        jobId,
        cancelScheduledMessages: (messageIds: string[]) => this.qstash.cancel(messageIds),
      });
    } catch (error: unknown) {
      this.rethrowAsHttp(error);
    }
  }

  async dispatchDue(): Promise<LiveActivityDispatchResponseDto> {
    return dispatchDueLiveActivityJobs({
      store: this.store,
      apns: this.apns.getClient(),
      encryptionKey: this.encryptionKey(),
      cancelScheduledMessages: (messageIds: string[]) => this.qstash.cancel(messageIds),
    });
  }

  private validateContentState(value: Record<string, unknown>): string {
    const json = JSON.stringify(value);
    if (Buffer.byteLength(json) > MAX_CONTENT_STATE_BYTES) {
      throw new BadRequestException("Live Activity content state exceeds APNs payload budget");
    }
    for (const key of ["prayerId", "prayerName", "phase", "actionLabel", "actionDeepLink"]) {
      if (typeof value[key] !== "string") {
        throw new BadRequestException(`Live Activity content state is missing ${key}`);
      }
    }
    for (const key of ["targetTimeMs", "minutesUntil", "progressPercent"]) {
      if (typeof value[key] !== "number" || !Number.isFinite(value[key])) {
        throw new BadRequestException(`Live Activity content state has invalid ${key}`);
      }
    }
    if (
      !(value.actionDeepLink as string).startsWith("munib-tracker://") ||
      (typeof value.deepLink === "string" && !value.deepLink.startsWith("munib-tracker://"))
    ) {
      throw new BadRequestException("Live Activity links must use the app scheme");
    }
    return json;
  }

  private encryptionKey(): Buffer {
    try {
      return resolveActivityKitEncryptionKey({
        encryptionKeyBase64: this.config.get("ACTIVITYKIT_TOKEN_ENCRYPTION_KEY", { infer: true }),
        jwtSecret: this.config.get("JWT_SECRET", { infer: true }),
      });
    } catch (error: unknown) {
      if (error instanceof LiveActivityDeliveryError) {
        throw new ServiceUnavailableException(error.message);
      }
      throw error;
    }
  }

  private rethrowAsHttp(error: unknown): never {
    if (error instanceof LiveActivityDeliveryError) {
      if (error.code === "NOT_FOUND") throw new NotFoundException(error.message);
      if (error.code === "TOO_EARLY" || error.code === "TRANSIENT_APNS" || error.retryable) {
        throw new ServiceUnavailableException(error.message);
      }
      throw new ServiceUnavailableException(error.message);
    }
    throw error;
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message.slice(0, 1_000) : "Unknown error";
  }
}
