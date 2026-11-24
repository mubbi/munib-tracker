import {
  isDeprecatedPlaintextEntity,
  stripPrivateSyncData,
} from "@munib-tracker/shared/validators/private-sync";
import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { parseISO } from "date-fns";
import { MoreThan, Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";
import { SyncRecordEntity } from "../database/entities";
import { sanitizePreferencesSyncData } from "./dto/preferences.dto";
import { isValidQuranNotesRecord } from "./dto/quran-notes-payload.validator";
import type {
  SyncPullResponseDto,
  SyncPushDto,
  SyncPushResponseDto,
  SyncRecordDto,
} from "./dto/sync.dto";
import { isValidVaultPayload } from "./dto/vault-payload.validator";

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
      // D46: rows of a retired plaintext entity are never returned (the
      // migration deletes them; this covers rows written before it ran).
      changes: records
        .filter((record) => !isDeprecatedPlaintextEntity(record.entity))
        .map((record) => this.toDto(record)),
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
      // Per-record payload guard (H2): a malformed or oversized vault / ayah-notes
      // record is skipped and never stored. It doesn't fail the batch, so one bad
      // blob can't stall every other entity's sync. Payloads are never logged.
      // D46: a retired plaintext entity (khushu journal → `vault_khushu`) from an
      // old client is accepted but never stored, and any old copy is removed.
      if (isDeprecatedPlaintextEntity(change.entity)) {
        await this.syncRecordsRepository.delete({ userId: user.userId, entity: change.entity });
        continue;
      }
      if (
        !isValidVaultPayload(change.entity, change.data) ||
        !isValidQuranNotesRecord(change.entity, change.data)
      ) {
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
          data: this.storableData(change.entity, change.data),
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

  /**
   * What is persisted for a pushed record: preferences are sanitized, and the
   * D46 private fields (excused reasons, exact coordinates) are stripped so an
   * old client can't store them in plaintext.
   */
  private storableData(entity: string, data: Record<string, unknown>): Record<string, unknown> {
    const clean = entity === "preferences" ? sanitizePreferencesSyncData(data) : data;
    return stripPrivateSyncData(entity, clean);
  }

  private toDto(record: SyncRecordEntity): SyncRecordDto {
    return {
      entity: record.entity as SyncRecordDto["entity"],
      id: record.recordId,
      // Defense in depth for rows stored before D46 (the migration strips them).
      data: stripPrivateSyncData(record.entity, record.data),
      updatedAt: record.updatedAt.toISOString(),
      deletedAt: record.deletedAt?.toISOString(),
    };
  }
}
