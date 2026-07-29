import type { MigrationInterface, QueryRunner } from "typeorm";

/** ActivityKit per-activity tokens and durable scheduled content-state updates. */
export class LiveActivityPush1720000010000 implements MigrationInterface {
  name = "LiveActivityPush1720000010000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "live_activity_push_tokens" (
        "id" SERIAL PRIMARY KEY,
        "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "activityId" varchar(128) NOT NULL,
        "tokenHash" varchar(64) NOT NULL,
        "tokenCiphertext" text NOT NULL,
        "apnsEnvironment" varchar(16) NOT NULL,
        "status" varchar(16) NOT NULL DEFAULT 'active',
        "expiresAt" TIMESTAMP NOT NULL,
        "lastPushAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "live_activity_push_tokens_activity_unique" ON "live_activity_push_tokens" ("activityId")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "live_activity_push_tokens_hash_unique" ON "live_activity_push_tokens" ("tokenHash")`,
    );
    await queryRunner.query(
      `CREATE INDEX "live_activity_push_tokens_user_idx" ON "live_activity_push_tokens" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "live_activity_push_tokens_expires_idx" ON "live_activity_push_tokens" ("status", "expiresAt")`,
    );

    await queryRunner.query(`
      CREATE TABLE "live_activity_push_jobs" (
        "id" uuid PRIMARY KEY,
        "activityTokenId" integer NOT NULL REFERENCES "live_activity_push_tokens"("id") ON DELETE CASCADE,
        "phase" varchar(32) NOT NULL,
        "executeAt" TIMESTAMP NOT NULL,
        "staleAt" TIMESTAMP,
        "contentStateJson" text NOT NULL,
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
      `CREATE INDEX "live_activity_push_jobs_due_idx" ON "live_activity_push_jobs" ("status", "executeAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "live_activity_push_jobs_activity_idx" ON "live_activity_push_jobs" ("activityTokenId")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "live_activity_push_jobs_phase_unique" ON "live_activity_push_jobs" ("activityTokenId", "phase", "executeAt")`,
    );

    for (const table of ["live_activity_push_tokens", "live_activity_push_jobs"]) {
      await queryRunner.query(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY`);
      await queryRunner.query(`ALTER TABLE "${table}" FORCE ROW LEVEL SECURITY`);
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "live_activity_push_jobs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "live_activity_push_tokens"`);
  }
}
