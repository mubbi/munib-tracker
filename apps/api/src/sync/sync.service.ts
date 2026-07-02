import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { parseISO } from "date-fns";
import { Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";
import { SyncRecordEntity } from "../database/entities";
import type {
  SyncPullResponseDto,
  SyncPushDto,
  SyncPushResponseDto,
  SyncRecordDto,
} from "./dto/sync.dto";

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
      where: { userId: user.userId },
      order: { updatedAt: "ASC" },
    });

    const changes = records
      .filter((record) => !sinceDate || record.updatedAt > sinceDate)
      .map((record) => this.toDto(record));

    return {
      changes,
      serverTime: new Date().toISOString(),
    };
  }

  async push(accessToken: string, dto: SyncPushDto): Promise<SyncPushResponseDto> {
    const user = await this.requireSyncedUser(accessToken);
    const conflicts: SyncRecordDto[] = [];

    for (const change of dto.changes) {
      const existing = await this.syncRecordsRepository.findOne({
        where: {
          userId: user.userId,
          entity: change.entity,
          recordId: change.id,
        },
      });

      if (existing && existing.updatedAt > parseISO(change.updatedAt)) {
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
          updatedAt: parseISO(change.updatedAt),
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
