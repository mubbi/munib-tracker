import type { MigrationInterface, QueryRunner } from "typeorm";

export class DeletedAccounts1720000009000 implements MigrationInterface {
  name = "DeletedAccounts1720000009000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "deleted_accounts" (
        "id" SERIAL PRIMARY KEY,
        "formerUserId" uuid NOT NULL,
        "primaryReason" varchar(64) NOT NULL,
        "details" text,
        "accountCreatedAt" TIMESTAMP,
        "deletedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_deleted_accounts_deletedAt"
        ON "deleted_accounts" ("deletedAt")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_deleted_accounts_primaryReason"
        ON "deleted_accounts" ("primaryReason")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_deleted_accounts_formerUserId"
        ON "deleted_accounts" ("formerUserId")
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_deleted_accounts_formerUserId"`);
    await queryRunner.query(`DROP INDEX "IDX_deleted_accounts_primaryReason"`);
    await queryRunner.query(`DROP INDEX "IDX_deleted_accounts_deletedAt"`);
    await queryRunner.query(`DROP TABLE "deleted_accounts"`);
  }
}
