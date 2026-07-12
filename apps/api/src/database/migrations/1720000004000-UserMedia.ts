import type { MigrationInterface, QueryRunner } from "typeorm";

export class UserMedia1720000004000 implements MigrationInterface {
  name = "UserMedia1720000004000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_media" (
        "id" uuid PRIMARY KEY,
        "userId" uuid NOT NULL,
        "mimeType" varchar(128) NOT NULL,
        "filename" varchar(255) NOT NULL,
        "sizeBytes" int NOT NULL,
        "storagePath" varchar(512) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_user_media_user" FOREIGN KEY ("userId")
          REFERENCES "users" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_user_media_user_created"
        ON "user_media" ("userId", "createdAt")
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_user_media_user_created"`);
    await queryRunner.query(`DROP TABLE "user_media"`);
  }
}
