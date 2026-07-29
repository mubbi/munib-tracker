import type { MigrationInterface, QueryRunner } from "typeorm";

/** Expo + Web Push registrations and durable phase jobs (Android Live Updates / PWA). */
export class SurfacePush1720000011000 implements MigrationInterface {
  name = "SurfacePush1720000011000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "surface_push_registrations" (
        "id" SERIAL PRIMARY KEY,
        "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "channel" varchar(16) NOT NULL,
        "targetHash" varchar(64) NOT NULL,
        "target" text NOT NULL,
        "sessionId" varchar(128),
        "deviceId" varchar(128),
        "status" varchar(16) NOT NULL DEFAULT 'active',
        "expiresAt" TIMESTAMP,
        "lastPushAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "surface_push_registrations_target_unique" ON "surface_push_registrations" ("targetHash")`,
    );
    await queryRunner.query(
      `CREATE INDEX "surface_push_registrations_user_idx" ON "surface_push_registrations" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "surface_push_registrations_session_idx" ON "surface_push_registrations" ("sessionId")`,
    );

    await queryRunner.query(`
      CREATE TABLE "surface_push_jobs" (
        "id" uuid PRIMARY KEY,
        "registrationId" integer NOT NULL REFERENCES "surface_push_registrations"("id") ON DELETE CASCADE,
        "channel" varchar(16) NOT NULL,
        "phase" varchar(32) NOT NULL,
        "dedupeKey" varchar(160) NOT NULL,
        "executeAt" TIMESTAMP NOT NULL,
        "staleAt" TIMESTAMP,
        "payloadJson" text NOT NULL,
        "status" varchar(16) NOT NULL DEFAULT 'pending',
        "qstashMessageId" text,
        "attempts" integer NOT NULL DEFAULT 0,
        "lastError" text,
        "deliveredAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "surface_push_jobs_due_idx" ON "surface_push_jobs" ("status", "executeAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "surface_push_jobs_registration_idx" ON "surface_push_jobs" ("registrationId")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "surface_push_jobs_dedupe_unique" ON "surface_push_jobs" ("registrationId", "dedupeKey")`,
    );

    for (const table of ["surface_push_registrations", "surface_push_jobs"]) {
      await queryRunner.query(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY`);
      await queryRunner.query(`ALTER TABLE "${table}" FORCE ROW LEVEL SECURITY`);
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "surface_push_jobs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "surface_push_registrations"`);
  }
}
