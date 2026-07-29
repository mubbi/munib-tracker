import type { MigrationInterface, QueryRunner } from "typeorm";

export class AppVersions1720000003000 implements MigrationInterface {
  name = "AppVersions1720000003000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "app_versions" (
        "platform" varchar(16) PRIMARY KEY,
        "latestVersion" varchar(32) NOT NULL,
        "minSoftVersion" varchar(32) NOT NULL,
        "minHardVersion" varchar(32) NOT NULL,
        "message" text,
        "storeUrl" varchar(512),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      INSERT INTO "app_versions" (
        "platform", "latestVersion", "minSoftVersion", "minHardVersion", "message", "storeUrl"
      ) VALUES
        ('web', '1.0.0', '1.0.0', '1.0.0', NULL, NULL),
        ('ios', '1.0.0', '1.0.0', '1.0.0', NULL, NULL),
        ('android', '1.0.0', '1.0.0', '1.0.0', NULL, NULL)
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "app_versions"`);
  }
}
