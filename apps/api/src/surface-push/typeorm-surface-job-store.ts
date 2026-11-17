import type {
  SurfaceJobRecord,
  SurfaceJobStore,
  SurfaceRegistrationRecord,
} from "@munib-tracker/surface-push-delivery";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, LessThan, LessThanOrEqual, Repository } from "typeorm";
import { SurfacePushJobEntity, SurfacePushRegistrationEntity } from "../database/entities";

@Injectable()
export class TypeOrmSurfaceJobStore implements SurfaceJobStore {
  constructor(
    @InjectRepository(SurfacePushJobEntity)
    private readonly jobRepository: Repository<SurfacePushJobEntity>,
    @InjectRepository(SurfacePushRegistrationEntity)
    private readonly registrationRepository: Repository<SurfacePushRegistrationEntity>,
  ) {}

  async claimJob(jobId: string): Promise<boolean> {
    const result = await this.jobRepository
      .createQueryBuilder()
      .update(SurfacePushJobEntity)
      .set({ status: "processing", updatedAt: () => "CURRENT_TIMESTAMP" })
      .where("id = :jobId AND status = :status", { jobId, status: "pending" })
      .execute();
    return (result.affected ?? 0) > 0;
  }

  async getJobWithRegistration(jobId: string): Promise<SurfaceJobRecord | null> {
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: { registration: true },
    });
    if (!job?.registration) return null;
    return this.toRecord(job);
  }

  async saveJob(job: SurfaceJobRecord): Promise<void> {
    await this.jobRepository.update(
      { id: job.id },
      {
        status: job.status,
        attempts: job.attempts,
        lastError: job.lastError,
        deliveredAt: job.deliveredAt,
        qstashMessageId: job.qstashMessageId ?? undefined,
      },
    );
  }

  async saveRegistration(registration: SurfaceRegistrationRecord): Promise<void> {
    await this.registrationRepository.save({
      id: registration.id,
      channel: registration.channel,
      target: registration.target,
      status: registration.status,
      expiresAt: registration.expiresAt,
      lastPushAt: registration.lastPushAt,
    });
  }

  async cancelPendingForRegistration(registrationId: number, reason: string): Promise<string[]> {
    const pending = await this.jobRepository.find({
      where: { registrationId, status: "pending" },
    });
    const messageIds = pending
      .map((job) => job.qstashMessageId)
      .filter((id): id is string => Boolean(id));
    if (pending.length > 0) {
      await this.jobRepository
        .createQueryBuilder()
        .update(SurfacePushJobEntity)
        .set({ status: "cancelled", lastError: reason })
        .where("registrationId = :registrationId AND status = :status", {
          registrationId,
          status: "pending",
        })
        .execute();
    }
    return messageIds;
  }

  async recoverExpiredLeases(leaseMs: number, now: Date = new Date()): Promise<void> {
    const cutoff = new Date(now.getTime() - leaseMs);
    await this.jobRepository
      .createQueryBuilder()
      .update(SurfacePushJobEntity)
      .set({ status: "pending" })
      .where("status = :status AND updatedAt <= :cutoff", {
        status: "processing",
        cutoff,
      })
      .execute();
  }

  async listDuePendingJobIds(limit: number, now: Date = new Date()): Promise<string[]> {
    const rows = await this.jobRepository.find({
      where: { status: "pending", executeAt: LessThanOrEqual(now) },
      order: { executeAt: "ASC" },
      take: limit,
      select: { id: true },
    });
    return rows.map((row) => row.id);
  }

  async hasNewerDueJob(
    job: Pick<SurfaceJobRecord, "id" | "registrationId" | "executeAt">,
    now: Date,
  ): Promise<boolean> {
    const count = await this.jobRepository
      .createQueryBuilder("job")
      .where("job.registrationId = :registrationId", { registrationId: job.registrationId })
      .andWhere("job.id != :id", { id: job.id })
      .andWhere("job.executeAt > :executeAt", { executeAt: job.executeAt })
      .andWhere("job.executeAt <= :now", { now })
      .andWhere("job.status IN (:...statuses)", {
        statuses: ["pending", "processing", "delivered"],
      })
      .getCount();
    return count > 0;
  }

  async expireRegistrations(now: Date): Promise<number[]> {
    const expired = await this.registrationRepository.find({
      where: { status: "active", expiresAt: LessThanOrEqual(now) },
      select: { id: true },
    });
    if (expired.length === 0) return [];
    const ids = expired.map((row) => row.id);
    await this.registrationRepository.update({ id: In(ids) }, { status: "expired" });
    return ids;
  }

  async deleteOldInactiveRegistrations(cutoff: Date): Promise<number> {
    // Ended / invalid / expired rows still hold a push token or Web Push
    // endpoint + keys; purge them after retention (jobs cascade).
    const result = await this.registrationRepository.delete({
      status: In(["ended", "invalid", "expired"]),
      updatedAt: LessThan(cutoff),
    });
    return result.affected ?? 0;
  }

  async deleteOldJobs(cutoff: Date): Promise<number> {
    const result = await this.jobRepository
      .createQueryBuilder()
      .delete()
      .from(SurfacePushJobEntity)
      .where("status IN (:...statuses) AND updatedAt <= :cutoff", {
        statuses: ["delivered", "failed", "cancelled"],
        cutoff,
      })
      .execute();
    return result.affected ?? 0;
  }

  private toRecord(job: SurfacePushJobEntity): SurfaceJobRecord {
    const registration = job.registration;
    return {
      id: job.id,
      registrationId: job.registrationId,
      channel: job.channel,
      phase: job.phase,
      executeAt: job.executeAt,
      staleAt: job.staleAt ?? null,
      payloadJson: job.payloadJson,
      status: job.status,
      attempts: job.attempts,
      lastError: job.lastError ?? null,
      deliveredAt: job.deliveredAt ?? null,
      qstashMessageId: job.qstashMessageId,
      registration: {
        id: registration.id,
        channel: registration.channel,
        target: registration.target,
        status: registration.status,
        expiresAt: registration.expiresAt ?? null,
        lastPushAt: registration.lastPushAt,
      },
    };
  }
}
