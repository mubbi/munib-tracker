import type { MigrationInterface, QueryRunner } from "typeorm";

export class AppFeedback1720000003000 implements MigrationInterface {
  name = "AppFeedback1720000003000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "reviewReactivationLastWindowKey" varchar(32)
    `);

    await queryRunner.query(`
      CREATE TABLE "app_feedback" (
        "id" uuid PRIMARY KEY,
        "userId" uuid NOT NULL,
        "deviceId" varchar(128) NOT NULL,
        "rating" int NOT NULL,
        "message" text,
        "source" varchar(64) NOT NULL,
        "triggerId" varchar(64),
        "appVersion" varchar(32) NOT NULL,
        "platform" varchar(16) NOT NULL,
        "locale" varchar(16),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_app_feedback_user" FOREIGN KEY ("userId")
          REFERENCES "users" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_app_feedback_user_created"
        ON "app_feedback" ("userId", "createdAt")
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_app_feedback_user_created"`);
    await queryRunner.query(`DROP TABLE "app_feedback"`);
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "reviewReactivationLastWindowKey"
    `);
  }
}
