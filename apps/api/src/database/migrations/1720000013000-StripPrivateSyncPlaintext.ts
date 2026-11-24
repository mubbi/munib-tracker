import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * D46 (2026-11-24): removes plaintext that must now sync only through the E2E
 * vault, from rows written before the change. `sync_records.data` is a JSON
 * string (`simple-json`), so it is cast to `jsonb`, edited, and stored back.
 *
 * - `preferences`: drops `activeExcusedReason` (the hayd / illness period).
 * - `prayer_logs`: drops the per-day `excusedReason` (`isExcused` stays).
 * - `khushu_journal`: deletes the rows (the journal now syncs as `vault_khushu`).
 * - `location`: rounds the coordinates to 2 decimals (~1 km).
 *
 * Irreversible by design: `down` can't restore deleted plaintext.
 */
export class StripPrivateSyncPlaintext1720000013000 implements MigrationInterface {
  name = "StripPrivateSyncPlaintext1720000013000";

  static readonly STATEMENTS = [
    `UPDATE "sync_records"
       SET "data" = ("data"::jsonb - 'activeExcusedReason')::text
     WHERE "entity" = 'preferences' AND "data"::jsonb ? 'activeExcusedReason'`,
    `UPDATE "sync_records"
       SET "data" = ("data"::jsonb - 'excusedReason')::text
     WHERE "entity" = 'prayer_logs' AND "data"::jsonb ? 'excusedReason'`,
    `DELETE FROM "sync_records" WHERE "entity" = 'khushu_journal'`,
    `UPDATE "sync_records"
       SET "data" = jsonb_set(
             jsonb_set(
               "data"::jsonb,
               '{value,latitude}',
               to_jsonb(round(("data"::jsonb #>> '{value,latitude}')::numeric, 2))
             ),
             '{value,longitude}',
             to_jsonb(round(("data"::jsonb #>> '{value,longitude}')::numeric, 2))
           )::text
     WHERE "entity" = 'location'
       AND jsonb_typeof("data"::jsonb #> '{value,latitude}') = 'number'
       AND jsonb_typeof("data"::jsonb #> '{value,longitude}') = 'number'`,
  ] as const;

  async up(queryRunner: QueryRunner): Promise<void> {
    for (const statement of StripPrivateSyncPlaintext1720000013000.STATEMENTS) {
      await queryRunner.query(statement);
    }
  }

  async down(): Promise<void> {
    // Nothing to restore: the removed plaintext is intentionally gone.
  }
}
