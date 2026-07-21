import { createHash, randomUUID } from "node:crypto";
import {
  createExpoPushSender,
  createWebPushSender,
  deliverSurfaceJob,
  dispatchDueSurfaceJobs,
  isValidExpoPushToken,
  isValidWebPushSubscription,
  MAX_PAYLOAD_BYTES,
  SurfaceDeliveryError,
  type SurfaceSender,
} from "@munib-tracker/surface-push-delivery";
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";
import type { EnvironmentVariables } from "../config/env.schema";
import { SurfacePushJobEntity, SurfacePushRegistrationEntity } from "../database/entities";
import type {
  SurfacePushDispatchResponseDto,
  SurfacePushLifecycleDto,
  SurfacePushRegistrationResponseDto,
  UpsertSurfacePushDto,
} from "./dto/surface-push.dto";
import { SurfacePushQStashService } from "./surface-push-qstash.service";
import { TypeOrmSurfaceJobStore } from "./typeorm-surface-job-store";

@Injectable()
export class SurfacePushService {
  constructor(
    @InjectRepository(SurfacePushRegistrationEntity)
    private readonly registrationRepository: Repository<SurfacePushRegistrationEntity>,
    @InjectRepository(SurfacePushJobEntity)
    private readonly jobRepository: Repository<SurfacePushJobEntity>,
    private readonly authService: AuthService,
    private readonly qstash: SurfacePushQStashService,
    private readonly store: TypeOrmSurfaceJobStore,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  async upsert(
    accessToken: string,
    dto: UpsertSurfacePushDto,
  ): Promise<SurfacePushRegistrationResponseDto> {
    const user = await this.requireAnyUser(accessToken);
    const now = new Date();
    const target = this.normalizeTarget(dto.channel, dto.target);
    const targetHash = hashTarget(target);

    const updates = dto.updates
      .map((update) => ({
        ...update,
        executeDate: new Date(update.executeAt),
        staleDate: update.staleAt ? new Date(update.staleAt) : null,
        payloadJson: this.validatePayload(update.payload),
      }))
      .filter((update) => update.executeDate.getTime() >= now.getTime() - 30_000)
      .sort((a, b) => a.executeDate.getTime() - b.executeDate.getTime());

    if (updates.length === 0) {
      throw new BadRequestException("No future surface push updates");
    }

    let registration = await this.registrationRepository.findOne({ where: { targetHash } });
    if (registration && registration.userId !== user.userId) {
      // Authenticated reassignment: transfer the endpoint/token to the current user.
      registration.userId = user.userId;
    }

    const oldMessageIds = registration
      ? (
          await this.jobRepository.find({
            where: { registrationId: registration.id, status: "pending" },
          })
        )
          .map((job) => job.qstashMessageId)
          .filter((id): id is string => Boolean(id))
      : [];

    registration =
      registration ??
      this.registrationRepository.create({
        userId: user.userId,
        targetHash,
      });
    registration.userId = user.userId;
    registration.channel = dto.channel;
    registration.targetHash = targetHash;
    registration.target = target;
    registration.sessionId = dto.sessionId ?? null;
    registration.deviceId = dto.deviceId ?? null;
    registration.status = "active";
    registration.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;
    registration = await this.registrationRepository.save(registration);

    await this.jobRepository.delete({ registrationId: registration.id });
    await this.qstash.cancel(oldMessageIds);

    const registrationId = registration.id;
    const jobs = await this.jobRepository.save(
      updates.map((update) =>
        this.jobRepository.create({
          id: randomUUID(),
          registrationId,
          channel: dto.channel,
          phase: update.phase,
          dedupeKey: update.dedupeKey,
          executeAt: update.executeDate,
          staleAt: update.staleDate,
          payloadJson: update.payloadJson,
          status: "pending",
        }),
      ),
    );

    await Promise.all(
      jobs.map(async (job) => {
        try {
          job.qstashMessageId = await this.qstash.schedule(job.id, job.executeAt);
          if (job.qstashMessageId) await this.jobRepository.save(job);
        } catch (error) {
          job.lastError = error instanceof Error ? error.message : String(error);
          await this.jobRepository.save(job);
        }
      }),
    );

    return {
      registrationId: registration.id,
      channel: registration.channel,
      scheduled: jobs.length,
      sessionId: registration.sessionId ?? null,
    };
  }

  async lifecycle(
    accessToken: string,
    registrationId: number,
    dto: SurfacePushLifecycleDto,
  ): Promise<void> {
    const user = await this.requireAnyUser(accessToken);
    const registration = await this.registrationRepository.findOne({
      where: { id: registrationId },
    });
    if (!registration) return;
    if (registration.userId !== user.userId) throw new ForbiddenException();
    registration.status = "ended";
    await this.registrationRepository.save(registration);
    const messageIds = await this.store.cancelPendingForRegistration(
      registration.id,
      `Surface ${dto.state}`,
    );
    await this.qstash.cancel(messageIds);
  }

  async deleteRegistration(accessToken: string, registrationId: number): Promise<void> {
    const user = await this.requireAnyUser(accessToken);
    const registration = await this.registrationRepository.findOne({
      where: { id: registrationId },
    });
    if (!registration) return;
    if (registration.userId !== user.userId) throw new ForbiddenException();
    const messageIds = await this.store.cancelPendingForRegistration(
      registration.id,
      "Registration deleted",
    );
    await this.qstash.cancel(messageIds);
    await this.registrationRepository.delete({ id: registrationId });
  }

  async deliver(jobId: string): Promise<void> {
    try {
      await deliverSurfaceJob({
        store: this.store,
        senders: this.senders(),
        jobId,
        cancelScheduledMessages: (messageIds) => this.qstash.cancel(messageIds),
      });
    } catch (error: unknown) {
      this.rethrowAsHttp(error);
    }
  }

  async dispatchDue(): Promise<SurfacePushDispatchResponseDto> {
    return dispatchDueSurfaceJobs({
      store: this.store,
      senders: this.senders(),
      cancelScheduledMessages: (messageIds) => this.qstash.cancel(messageIds),
    });
  }

  private senders(): Partial<Record<"expo" | "web_push", SurfaceSender>> {
    const senders: Partial<Record<"expo" | "web_push", SurfaceSender>> = {
      expo: createExpoPushSender(),
    };
    const publicKey = this.config.get("VAPID_PUBLIC_KEY", { infer: true })?.trim();
    const privateKey = this.config.get("VAPID_PRIVATE_KEY", { infer: true })?.trim();
    const subject =
      this.config.get("VAPID_SUBJECT", { infer: true })?.trim() ||
      "mailto:support@munibtracker.app";
    if (publicKey && privateKey) {
      senders.web_push = createWebPushSender({ publicKey, privateKey, subject });
    }

    return senders;
  }

  private normalizeTarget(channel: "expo" | "web_push", raw: string): string {
    if (channel === "expo") {
      const token = raw.trim();
      if (!isValidExpoPushToken(token)) {
        throw new BadRequestException("A valid Expo push token is required");
      }
      return token;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new BadRequestException("Web Push target must be subscription JSON");
    }
    if (!isValidWebPushSubscription(parsed)) {
      throw new BadRequestException("Invalid Web Push subscription");
    }
    return JSON.stringify({
      endpoint: parsed.endpoint,
      expirationTime: parsed.expirationTime ?? null,
      keys: { p256dh: parsed.keys.p256dh, auth: parsed.keys.auth },
    });
  }

  private validatePayload(value: Record<string, unknown>): string {
    const json = JSON.stringify(value);
    if (Buffer.byteLength(json) > MAX_PAYLOAD_BYTES) {
      throw new BadRequestException("Surface push payload exceeds size budget");
    }
    return json;
  }

  private async requireAnyUser(accessToken: string) {
    if (!accessToken) throw new UnauthorizedException("Missing bearer token");
    return this.authService.getCurrentUser(accessToken);
  }

  private rethrowAsHttp(error: unknown): never {
    if (error instanceof SurfaceDeliveryError) {
      if (error.code === "TOO_EARLY") throw new BadRequestException(error.message);
      if (error.code === "NOT_FOUND") throw new BadRequestException(error.message);
      if (error.retryable) throw new BadRequestException(error.message);
    }
    throw error;
  }
}

function hashTarget(target: string): string {
  return createHash("sha256").update(target).digest("hex");
}
