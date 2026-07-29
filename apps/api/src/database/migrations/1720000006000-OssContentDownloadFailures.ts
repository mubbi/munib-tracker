import type { MigrationInterface, QueryRunner } from "typeorm";

export class OssContentDownloadFailures1720000006000 implements MigrationInterface {
  name = "OssContentDownloadFailures1720000006000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "oss_content_download_failures" (
        "id" uuid PRIMARY KEY,
        "userId" uuid NOT NULL,
        "contentKind" varchar(64) NOT NULL,
        "contentKey" varchar(256) NOT NULL,
        "sourceProvider" varchar(128) NOT NULL,
        "sourceUrl" text NOT NULL,
        "contentMeta" text NOT NULL,
        "errorCode" varchar(64) NOT NULL,
        "errorMessage" text NOT NULL,
        "httpStatus" int,
        "appVersion" varchar(32) NOT NULL,
        "platform" varchar(16) NOT NULL,
        "locale" varchar(16),
        "translationLocale" varchar(16),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_oss_content_download_failures_user" FOREIGN KEY ("userId")
          REFERENCES "users" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_oss_failures_kind_created"
        ON "oss_content_download_failures" ("contentKind", "createdAt")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_oss_failures_key_created"
        ON "oss_content_download_failures" ("contentKey", "createdAt")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_oss_failures_provider_created"
        ON "oss_content_download_failures" ("sourceProvider", "createdAt")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_oss_failures_created"
        ON "oss_content_download_failures" ("createdAt")
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_oss_failures_created"`);
    await queryRunner.query(`DROP INDEX "IDX_oss_failures_provider_created"`);
    await queryRunner.query(`DROP INDEX "IDX_oss_failures_key_created"`);
    await queryRunner.query(`DROP INDEX "IDX_oss_failures_kind_created"`);
    await queryRunner.query(`DROP TABLE "oss_content_download_failures"`);
  }
}
