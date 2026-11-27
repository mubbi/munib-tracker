import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Right to erasure (2026-11-26): accounts closed before this release kept the
 * original email inside their tombstone (`deleted_<token>_<email>`). Replace
 * the suffix with `closed`, keeping the random `deleted_<token>_` prefix so the
 * row still reads as closed and the unique email index never collides.
 *
 * `'deleted_' + 32 hex + '_'` is 41 characters. Irreversible by design.
 */
export class EraseClosedAccountEmails1720000014000 implements MigrationInterface {
  name = "EraseClosedAccountEmails1720000014000";

  static readonly STATEMENT = `UPDATE "users"
       SET "email" = substring("email" from 1 for 41) || 'closed'
     WHERE "email" ~* '^deleted_[a-f0-9]{32}_'
       AND "email" <> substring("email" from 1 for 41) || 'closed'`;

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(EraseClosedAccountEmails1720000014000.STATEMENT);
  }

  async down(): Promise<void> {
    // Nothing to restore: the erased emails are intentionally gone.
  }
}
