import type {
  LiveActivityJobRecord,
  LiveActivityJobStore,
  LiveActivityTokenRecord,
} from "@munib-tracker/live-activity-delivery";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, LessThanOrEqual, Repository } from "typeorm";
import { LiveActivityPushJobEntity, LiveActivityPushTokenEntity } from "../database/entities";

/**
 * TypeORM adapter for shared Live Activity delivery. A future Fly worker can
 * implement the same {@link LiveActivityJobStore} with Drizzle/pg.
 */
@Injectable()
export class TypeOrmLiveActivityJobStore implements LiveActivityJobStore {
  constructor(
    @InjectRepository(LiveActivityPushTokenEntity)
    private readonly tokenRepository: Repository<LiveActivityPushTokenEntity>,
    @InjectRepository(LiveActivityPushJobEntity)
    private readonly jobRepository: Repository<LiveActivityPushJobEntity>,
  ) {}

  async claimJob(jobId: string): Promise<boolean> {
    const claimed = await this.jobRepository.update(
      { id: jobId, status: "pending" },
      { status: "processing" },
    );
    return Boolean(claimed.affected);
  }

  async getJobWithToken(jobId: string): Promise<LiveActivityJobRecord | null> {
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: { activityToken: true },
    });
    if (!job) return null;
    return this.toJobRecord(job);
  }

  async saveJob(job: LiveActivityJobRecord): Promise<void> {
    // Targeted update — avoid TypeORM `.save()` wiping columns not on the DTO
    // (e.g. `phase`) when Nest and a future Fly worker share this adapter shape.
    await this.jobRepository.update(
      { id: job.id },
      {
        status: job.status,
        attempts: job.attempts,
        lastError: job.lastError,
        deliveredAt: job.deliveredAt,
        executeAt: job.executeAt,
        staleAt: job.staleAt,
        contentStateJson: job.contentStateJson,
        qstashMessageId: job.qstashMessageId,
      },
    );
  }

  async saveToken(token: LiveActivityTokenRecord): Promise<void> {
    await this.tokenRepository.update(
      { id: token.id },
      {
        status: token.status,
        expiresAt: token.expiresAt,
        lastPushAt: token.lastPushAt,
        tokenCiphertext: token.tokenCiphertext,
        apnsEnvironment: token.apnsEnvironment,
      },
    );
  }

  async cancelPendingForActivity(activityTokenId: number, reason: string): Promise<string[]> {
    const pending = await this.jobRepository.find({
      where: { activityTokenId, status: "pending" },
    });
    await this.jobRepository.update(
      { activityTokenId, status: "pending" },
      { status: "cancelled", lastError: reason },
    );
    return pending.map((job) => job.qstashMessageId).filter((id): id is string => Boolean(id));
  }

  async recoverExpiredLeases(leaseMs: number, now = new Date()): Promise<void> {
    await this.jobRepository.update(
      {
        status: "processing",
        updatedAt: LessThan(new Date(now.getTime() - leaseMs)),
      },
      { status: "pending", lastError: "Recovered expired processing lease" },
    );
  }

  async listDuePendingJobIds(limit: number, now = new Date()): Promise<string[]> {
    const due = await this.jobRepository.find({
      where: { status: "pending", executeAt: LessThanOrEqual(now) },
      order: { executeAt: "ASC" },
      take: limit,
      select: { id: true },
    });
    return due.map((job) => job.id);
  }

  async expireActiveTokens(now = new Date()): Promise<number[]> {
    const expired = await this.tokenRepository.find({
      where: { status: "active", expiresAt: LessThanOrEqual(now) },
    });
    for (const activity of expired) {
      activity.status = "expired";
      await this.tokenRepository.save(activity);
    }
    return expired.map((activity) => activity.id);
  }

  async deleteOldExpiredTokens(cutoff: Date): Promise<number> {
    const result = await this.tokenRepository.delete({
      status: "expired",
      updatedAt: LessThan(cutoff),
    });
    return result.affected ?? 0;
  }

  private toJobRecord(job: LiveActivityPushJobEntity): LiveActivityJobRecord {
    return {
      id: job.id,
      activityTokenId: job.activityTokenId,
      executeAt: job.executeAt,
      staleAt: job.staleAt ?? null,
      contentStateJson: job.contentStateJson,
      status: job.status,
      attempts: job.attempts,
      lastError: job.lastError ?? null,
      deliveredAt: job.deliveredAt ?? null,
      qstashMessageId: job.qstashMessageId ?? null,
      activityToken: {
        id: job.activityToken.id,
        tokenCiphertext: job.activityToken.tokenCiphertext,
        apnsEnvironment: job.activityToken.apnsEnvironment,
        status: job.activityToken.status,
        expiresAt: job.activityToken.expiresAt,
        lastPushAt: job.activityToken.lastPushAt ?? null,
      },
    };
  }
}
