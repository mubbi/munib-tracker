import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Baseline schema for the Munib Tracker API (Postgres).
 *
 * Mirrors the `users`, `auth_sessions`, and `sync_records` entities. Generate
 * follow-up migrations with `pnpm --filter api migration:generate` after entity
 * changes rather than editing this file.
 */
export class InitialSchema1720000000000 implements MigrationInterface {
  name = "InitialSchema1720000000000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY,
        "accountType" varchar(16) NOT NULL,
        "provider" varchar(32),
        "email" varchar(320),
        "displayName" varchar(120),
        "deviceId" varchar(128),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "auth_sessions" (
        "id" uuid PRIMARY KEY,
        "userId" uuid NOT NULL,
        "refreshToken" varchar(64) NOT NULL,
        "refreshExpiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_auth_sessions_refreshToken" UNIQUE ("refreshToken"),
        CONSTRAINT "FK_auth_sessions_user" FOREIGN KEY ("userId")
          REFERENCES "users" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "sync_records" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" uuid NOT NULL,
        "entity" varchar(64) NOT NULL,
        "recordId" varchar(128) NOT NULL,
        "data" text NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL,
        "deletedAt" TIMESTAMP,
        CONSTRAINT "UQ_sync_records_user_entity_record"
          UNIQUE ("userId", "entity", "recordId")
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "sync_records"`);
    await queryRunner.query(`DROP TABLE "auth_sessions"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
