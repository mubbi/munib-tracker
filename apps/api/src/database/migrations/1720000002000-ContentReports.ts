import type { MigrationInterface, QueryRunner } from "typeorm";

export class ContentReports1720000002000 implements MigrationInterface {
  name = "ContentReports1720000002000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "content_reports" (
        "id" uuid PRIMARY KEY,
        "userId" uuid NOT NULL,
        "status" varchar(32) NOT NULL,
        "issueType" varchar(64) NOT NULL,
        "description" text NOT NULL,
        "suggestedCorrection" text,
        "userReference" text,
        "content" text NOT NULL,
        "appVersion" varchar(32),
        "platform" varchar(16),
        "adminNotes" text,
        "resolvedAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_content_reports_user" FOREIGN KEY ("userId")
          REFERENCES "users" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_content_reports_user_created"
        ON "content_reports" ("userId", "createdAt")
    `);

    await queryRunner.query(`
      CREATE TABLE "content_report_attachments" (
        "id" uuid PRIMARY KEY,
        "reportId" uuid NOT NULL,
        "mimeType" varchar(128) NOT NULL,
        "filename" varchar(255) NOT NULL,
        "sizeBytes" int NOT NULL,
        "storagePath" varchar(512) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_content_report_attachments_report" FOREIGN KEY ("reportId")
          REFERENCES "content_reports" ("id") ON DELETE CASCADE
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "content_report_attachments"`);
    await queryRunner.query(`DROP INDEX "IDX_content_reports_user_created"`);
    await queryRunner.query(`DROP TABLE "content_reports"`);
  }
}
