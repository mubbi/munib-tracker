import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsISO8601,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

/**
 * Upper bound on records accepted in a single push. Each change is processed in
 * a sequential read-then-write loop, so an unbounded array lets one request pin
 * the event loop and issue thousands of queries (CWE-770). The client already
 * batches in chunks well under this ceiling.
 */
export const MAX_SYNC_PUSH_CHANGES = 500;

export const SYNC_ENTITIES = [
  // Server-managed reset marker. Clients pull this to clear stale local data on
  // every signed-in device; SyncService rejects client pushes for this entity.
  "data_reset",
  "prayer_logs",
  "zikr_progress",
  "qaza_entries",
  "preferences",
  "favorites",
  "dua_favorites",
  "durood_favorites",
  "name_favorites",
  "quran_bookmarks",
  "quran_last_read",
  "hadith_bookmarks",
  "custom_tasbeeh",
  // Blob-synced userData (see apps/app/src/sync/blob-sync.ts). The server stores
  // every entity generically keyed by (userId, entity, recordId); this list is
  // the authoritative whitelist enforced by `@IsIn` below.
  "fasting",
  "khatm",
  "hifz",
  "custom_adhkar",
  "khushu_journal",
  "hajj_checklist",
  "umrah_checklist",
  "friday_checklist",
  "white_days_checklist",
  "jannah_intentions",
  "jahannam_intentions",
  "salah_guide_progress",
  "battles_progress",
  "quran_guide_progress",
  "taharah_progress",
  "prophets_progress",
  "aqeedah_progress",
  "last_day_progress",
  "learn_dua_progress",
  "quran_prefs",
  "hadith_prefs",
  "quran_reading_progress",
  "qaza_schedule",
  "qaza_daily_progress",
  "qaza_daily_plans",
  // Portable settings previously device-local (location calc + place, reading
  // text toggles, zakat draft, feature-tour dismissals).
  "location",
  "reading_text_visibility",
  "zakat_calculator",
  "fidyah_calculator",
  "sadaqah_goals",
  "tours_seen",
] as const;

export type SyncEntity = (typeof SYNC_ENTITIES)[number];

export class SyncPullQueryDto {
  @ApiPropertyOptional({
    description: "ISO timestamp — return changes updated after this moment",
    example: "2026-01-01T00:00:00.000Z",
  })
  @IsOptional()
  @IsISO8601()
  since?: string;
}

export class SyncRecordDto {
  @ApiProperty({ enum: SYNC_ENTITIES })
  @IsString()
  @IsNotEmpty()
  @IsIn(SYNC_ENTITIES)
  entity!: SyncEntity;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ type: "object", additionalProperties: true })
  @IsObject()
  data!: Record<string, unknown>;

  @ApiProperty()
  @IsISO8601()
  updatedAt!: string;

  @ApiPropertyOptional({ description: "Set when the record was deleted on another device" })
  @IsOptional()
  @IsISO8601()
  deletedAt?: string;
}

export class SyncPushDto {
  @ApiProperty({ type: [SyncRecordDto], maxItems: MAX_SYNC_PUSH_CHANGES })
  @IsArray()
  @ArrayMaxSize(MAX_SYNC_PUSH_CHANGES)
  @ValidateNested({ each: true })
  @Type(() => SyncRecordDto)
  changes!: SyncRecordDto[];
}

export class SyncPullResponseDto {
  @ApiProperty({ type: [SyncRecordDto] })
  changes!: SyncRecordDto[];

  @ApiProperty()
  serverTime!: string;
}

export class SyncPushResponseDto {
  @ApiProperty()
  accepted!: number;

  @ApiProperty({ type: [SyncRecordDto] })
  conflicts!: SyncRecordDto[];

  @ApiProperty()
  serverTime!: string;
}
