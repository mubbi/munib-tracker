import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Adds the authoritative OAuth identity key to `users`.
 *
 * OAuth account matching must key off the provider's stable subject id
 * (`providerAccountId`), not the mutable/non-unique email. The partial unique
 * index enforces one row per (provider, providerAccountId) while allowing many
 * guest rows where the column is NULL.
 *
 * SQLite test runs use `synchronize` and never execute this migration; it exists
 * for Postgres.
 */
export class AddUserProviderAccountId1720000001000 implements MigrationInterface {
  name = "AddUserProviderAccountId1720000001000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" ADD COLUMN "providerAccountId" varchar(255)
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_users_provider_account"
        ON "users" ("provider", "providerAccountId")
        WHERE "providerAccountId" IS NOT NULL
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "UQ_users_provider_account"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "providerAccountId"`);
  }
}
