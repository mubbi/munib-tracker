import { stripPrivateSyncData } from "@munib-tracker/shared/validators/private-sync";
import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { parseISO } from "date-fns";
import { In, MoreThan, Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";
import { SyncRecordEntity } from "../database/entities";
import { sanitizePreferencesSyncData } from "./dto/preferences.dto";
import { isValidQuranNotesRecord } from "./dto/quran-notes-payload.validator";
import {
  isRetiredSyncEntity,
  type SyncPullResponseDto,
  type SyncPushDto,
  type SyncPushResponseDto,
  type SyncRecordDto,
} from "./dto/sync.dto";
import { isValidVaultPayload } from "./dto/vault-payload.validator";

/** Reject client timestamps more than this far in the future (clock skew). */
const MAX_FUTURE_SKEW_MS = 5 * 60 * 1000;

/**
 * Identity of a sync row within one user's data. Entities are
 * `@IsIn(SYNC_ENTITIES)` ids, which never contain ":".
 */
function recordKey(entity: string, recordId: string): string {
  return `${entity}:${recordId}`;
}

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
      // Rows of a retired entity are never returned (old rows linger until a
      // push of that entity drops them, or the D46 migration for khushu_journal).
      changes: records
        .filter((record) => !isRetiredSyncEntity(record.entity))
        .map((record) => this.toDto(record)),
      serverTime: new Date().toISOString(),
    };
  }

  async push(accessToken: string, dto: SyncPushDto): Promise<SyncPushResponseDto> {
    const user = await this.requireSyncedUser(accessToken);
    const conflicts: SyncRecordDto[] = [];
    const now = Date.now();
    // One read for the whole batch instead of a findOne per change (≤ 500).
    const stored = await this.loadStored(
      user.userId,
      dto.changes.filter((change) => !isRetiredSyncEntity(change.entity)),
    );
    const droppedRetired = new Set<string>();

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
      // A retired entity (RETIRED_SYNC_ENTITIES) from an old client is accepted
      // but never stored, and the user's old rows of it are dropped (once per batch).
      if (isRetiredSyncEntity(change.entity)) {
        if (!droppedRetired.has(change.entity)) {
          droppedRetired.add(change.entity);
          await this.syncRecordsRepository.delete({ userId: user.userId, entity: change.entity });
        }
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

      const key = recordKey(change.entity, change.id);
      const existing = stored.get(key);

      if (existing && existing.updatedAt > updatedAt) {
        conflicts.push(this.toDto(existing));
        continue;
      }

      const saved = await this.syncRecordsRepository.save(
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
      // A later change to the same record in this batch compares against this write.
      stored.set(key, saved);
    }

    return {
      accepted: dto.changes.length - conflicts.length,
      conflicts,
      serverTime: new Date().toISOString(),
    };
  }

  /** Stored rows this batch touches, keyed by {@link recordKey}. */
  private async loadStored(
    userId: string,
    changes: SyncRecordDto[],
  ): Promise<Map<string, SyncRecordEntity>> {
    const stored = new Map<string, SyncRecordEntity>();
    if (!changes.length) return stored;
    const rows = await this.syncRecordsRepository.find({
      where: {
        userId,
        entity: In([...new Set(changes.map((change) => change.entity))]),
        recordId: In([...new Set(changes.map((change) => change.id))]),
      },
    });
    for (const row of rows) stored.set(recordKey(row.entity, row.recordId), row);
    return stored;
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
