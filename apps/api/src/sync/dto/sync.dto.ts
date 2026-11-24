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
  "hajj_checklist",
  "umrah_checklist",
  "friday_checklist",
  // NF-3.11 the user's private iqamah times per masjid (own devices only, never shared).
  "home_masjid_times",
  // NF-3.5 daily Sunnah habits; NF-3.3 Dhul-Hijjah mode (per Hijri year).
  "sunnah_habits",
  "dhul_hijjah",
  "voluntary_fasting",
  // NF-3.14 weekly coach: shown insight ids, micro-goals + outcomes, dismiss/snooze (no raw data).
  "coach_history",
  // D40 daily Qur'an reading log (date → seconds/ayahs/pages; counts only).
  "quran_reading_log",
  // NF-3.4 Umrah mode sessions (live guided companion).
  "umrah_sessions",
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
  // Portable settings previously device-local (location calc + place, zakat
  // draft, feature-tour dismissals).
  "location",
  "zakat_calculator",
  "fidyah_calculator",
  "sadaqah_goals",
  "tours_seen",
  // Qur'an practice (recitation companion): prefs, session history, revision ladder.
  "quran_companion_prefs",
  "quran_practice_sessions",
  "quran_memorization",
  // NF-3.15 tajweed coaching: drill counts, spacing and the last plan (no audio).
  "tajweed_coaching",
  // NF-3.21 personal ayah notes/highlights (D15: normal sync, not the vault).
  // `data.value` is shape-checked + capped at ~1 MB per record (isValidQuranNotesRecord).
  "quran_notes",
  // E2E-encrypted vault (plan §4.2, D2) — ciphertext only, opt-in per device.
  // `data.value` is shape-checked + capped at 256 KB per record (isValidVaultPayload)
  // and never logged.
  "vault_keyring",
  "vault_muhasabah",
  "vault_debts",
  "vault_wasiyyah",
  "vault_relatives",
  // D46: the excused period (hayd / nifas / illness / travel) and the khushu
  // journal sync only through the vault, never as plaintext.
  "vault_excused",
  "vault_khushu",
] as const;

export type SyncEntity = (typeof SYNC_ENTITIES)[number];

/**
 * Retired entities that app builds still in the wild may push. They pass
 * validation (so `@IsIn` doesn't 400 an old client's whole batch) but are not in
 * the OpenAPI enum: SyncService stores nothing for them, drops any old row on
 * push and never returns one on pull.
 *
 * - `khushu_journal` (D46): the journal syncs only as `vault_khushu`.
 * - `reading_text_visibility` (D13): the pair lives in `preferences.readingDisplay`.
 * - `white_days_checklist` (NF-3.2): White Days fasts live in `voluntary_fasting`.
 */
export const RETIRED_SYNC_ENTITIES = [
  "khushu_journal",
  "reading_text_visibility",
  "white_days_checklist",
] as const;

export type RetiredSyncEntity = (typeof RETIRED_SYNC_ENTITIES)[number];

export function isRetiredSyncEntity(entity: unknown): entity is RetiredSyncEntity {
  return (RETIRED_SYNC_ENTITIES as readonly unknown[]).includes(entity);
}

const ACCEPTED_SYNC_ENTITIES: readonly string[] = [...SYNC_ENTITIES, ...RETIRED_SYNC_ENTITIES];

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
  // The contract lists live entities only; retired ones are still accepted on push.
  @ApiProperty({ enum: SYNC_ENTITIES })
  @IsString()
  @IsNotEmpty()
  @IsIn(ACCEPTED_SYNC_ENTITIES)
  entity!: SyncEntity | RetiredSyncEntity;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ type: "object", additionalProperties: true })
  // Vault / quran_notes payloads are shape- and size-checked per record in
  // SyncService.push (an invalid one is skipped, never stored), not here: a
  // DTO-level check would reject the whole batch and stall every entity (H2).
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
