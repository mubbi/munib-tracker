import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { parseISO } from "date-fns";
import { MoreThan, Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";
import { SyncRecordEntity } from "../database/entities";
import type {
  SyncPullResponseDto,
  SyncPushDto,
  SyncPushResponseDto,
  SyncRecordDto,
} from "./dto/sync.dto";

/** Reject client timestamps more than this far in the future (clock skew). */
const MAX_FUTURE_SKEW_MS = 5 * 60 * 1000;

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(SyncRecordEntity)
    private readonly syncRecordsRepository: Repository<SyncRecordEntity>,
    private readonly authService: AuthService,
  ) {}

  async pull(accessToken: string, since?: string): Promise<SyncPullResponseDto> {
    const user = await this.requireSyncedUser(accessToken);
    const sinceDate = since ? parseISO(since) : null;

    const records = await this.syncRecordsRepository.find({
      where: sinceDate
        ? { userId: user.userId, updatedAt: MoreThan(sinceDate) }
        : { userId: user.userId },
      order: { updatedAt: "ASC" },
    });

    return {
      changes: records.map((record) => this.toDto(record)),
      serverTime: new Date().toISOString(),
    };
  }

  async push(accessToken: string, dto: SyncPushDto): Promise<SyncPushResponseDto> {
    const user = await this.requireSyncedUser(accessToken);
    const conflicts: SyncRecordDto[] = [];
    const now = Date.now();

    for (const change of dto.changes) {
      if (change.entity === "data_reset") {
        throw new BadRequestException("data_reset is server-managed");
      }
      const clientUpdatedAt = parseISO(change.updatedAt);
      if (Number.isNaN(clientUpdatedAt.getTime())) {
        continue;
      }
      // Clamp far-future client clocks so they cannot permanently win LWW.
      const updatedAt =
        clientUpdatedAt.getTime() > now + MAX_FUTURE_SKEW_MS ? new Date(now) : clientUpdatedAt;

      const existing = await this.syncRecordsRepository.findOne({
        where: {
          userId: user.userId,
          entity: change.entity,
          recordId: change.id,
        },
      });

      if (existing && existing.updatedAt > updatedAt) {
        conflicts.push(this.toDto(existing));
        continue;
      }

      await this.syncRecordsRepository.save(
        this.syncRecordsRepository.create({
          id: existing?.id,
          userId: user.userId,
          entity: change.entity,
          recordId: change.id,
          data: change.data,
          updatedAt,
          deletedAt: change.deletedAt ? parseISO(change.deletedAt) : null,
        }),
      );
    }

    return {
      accepted: dto.changes.length - conflicts.length,
      conflicts,
      serverTime: new Date().toISOString(),
    };
  }

  private async requireSyncedUser(accessToken: string) {
    const user = await this.authService.getCurrentUser(accessToken);

    if (user.accountType === "guest") {
      throw new ForbiddenException("Cloud sync is disabled for guest accounts");
    }

    return user;
  }

  private toDto(record: SyncRecordEntity): SyncRecordDto {
    return {
      entity: record.entity as SyncRecordDto["entity"],
      id: record.recordId,
      data: record.data,
      updatedAt: record.updatedAt.toISOString(),
      deletedAt: record.deletedAt?.toISOString(),
    };
  }
}
