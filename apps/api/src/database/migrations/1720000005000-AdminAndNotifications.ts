import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Admin console + broadcast notifications tables.
 * Product user FKs use UUID (Munib users.id). Admin tables use serial ints.
 */
export class AdminAndNotifications1720000005000 implements MigrationInterface {
  name = "AdminAndNotifications1720000005000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "admin_users" (
        "id" SERIAL PRIMARY KEY,
        "email" text NOT NULL UNIQUE,
        "role" text NOT NULL,
        "enabled" boolean NOT NULL DEFAULT true,
        "created_by_admin_id" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(`CREATE INDEX "admin_users_email_idx" ON "admin_users" ("email")`);
    await queryRunner.query(`CREATE INDEX "admin_users_role_idx" ON "admin_users" ("role")`);

    await queryRunner.query(`
      CREATE TABLE "admin_sessions" (
        "id" SERIAL PRIMARY KEY,
        "admin_user_id" integer NOT NULL REFERENCES "admin_users"("id") ON DELETE CASCADE,
        "token_hash" text NOT NULL UNIQUE,
        "ip_address" text,
        "user_agent" text,
        "expires_at" TIMESTAMP NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "last_used_at" TIMESTAMP
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "admin_sessions_admin_user_id_idx" ON "admin_sessions" ("admin_user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "admin_sessions_expires_at_idx" ON "admin_sessions" ("expires_at")`,
    );

    await queryRunner.query(`
      CREATE TABLE "admin_audit_log" (
        "id" SERIAL PRIMARY KEY,
        "admin_user_id" integer REFERENCES "admin_users"("id") ON DELETE SET NULL,
        "admin_email" text NOT NULL,
        "admin_role" text NOT NULL,
        "action" text NOT NULL,
        "target_type" text,
        "target_id" text,
        "metadata" jsonb,
        "ip_address" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "admin_audit_log_created_at_idx" ON "admin_audit_log" ("created_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "admin_audit_log_action_idx" ON "admin_audit_log" ("action")`,
    );
    await queryRunner.query(
      `CREATE INDEX "admin_audit_log_admin_email_idx" ON "admin_audit_log" ("admin_email")`,
    );

    await queryRunner.query(`
      CREATE TABLE "cron_runs" (
        "id" SERIAL PRIMARY KEY,
        "bucket_id" text NOT NULL,
        "status" text NOT NULL,
        "job_ids" jsonb DEFAULT '[]',
        "duration_ms" integer,
        "error_message" text,
        "started_at" TIMESTAMP NOT NULL DEFAULT now(),
        "finished_at" TIMESTAMP
      )
    `);
    await queryRunner.query(`CREATE INDEX "cron_runs_bucket_id_idx" ON "cron_runs" ("bucket_id")`);
    await queryRunner.query(
      `CREATE INDEX "cron_runs_started_at_idx" ON "cron_runs" ("started_at")`,
    );

    await queryRunner.query(`
      CREATE TABLE "canned_replies" (
        "id" SERIAL PRIMARY KEY,
        "slug" text NOT NULL UNIQUE,
        "title" text NOT NULL,
        "body" text NOT NULL,
        "tags" jsonb DEFAULT '[]',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "admin_broadcasts" (
        "id" SERIAL PRIMARY KEY,
        "status" text NOT NULL DEFAULT 'pending',
        "category" text NOT NULL,
        "audience" text NOT NULL,
        "title" text NOT NULL,
        "body" text NOT NULL,
        "subtitle" text,
        "route_data" jsonb,
        "filters" jsonb NOT NULL DEFAULT '{}',
        "schedule_mode" text NOT NULL DEFAULT 'immediate',
        "scheduled_at" TIMESTAMP,
        "scheduled_wall_clock" jsonb,
        "link_type" text NOT NULL DEFAULT 'none',
        "external_url" text,
        "send_in_app" boolean NOT NULL DEFAULT true,
        "send_push" boolean NOT NULL DEFAULT true,
        "dedupe_key_prefix" text NOT NULL,
        "cursor_user_id" text NOT NULL DEFAULT '',
        "total_users" integer,
        "users_processed" integer NOT NULL DEFAULT 0,
        "in_app_sent" integer NOT NULL DEFAULT 0,
        "push_expo_sent" integer NOT NULL DEFAULT 0,
        "push_web_sent" integer NOT NULL DEFAULT 0,
        "push_failed" integer NOT NULL DEFAULT 0,
        "opened_count" integer NOT NULL DEFAULT 0,
        "clicked_count" integer NOT NULL DEFAULT 0,
        "error_message" text,
        "created_by_admin_id" integer REFERENCES "admin_users"("id") ON DELETE SET NULL,
        "created_by_email" text NOT NULL,
        "started_at" TIMESTAMP,
        "completed_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "admin_broadcasts_status_idx" ON "admin_broadcasts" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "admin_broadcasts_created_at_idx" ON "admin_broadcasts" ("created_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "admin_broadcasts_schedule_mode_idx" ON "admin_broadcasts" ("schedule_mode", "status")`,
    );

    await queryRunner.query(`
      CREATE TABLE "in_app_notifications" (
        "id" SERIAL PRIMARY KEY,
        "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "kind" text NOT NULL,
        "title" text NOT NULL,
        "body" text NOT NULL,
        "subtitle" text,
        "routeData" jsonb,
        "dedupeKey" text,
        "broadcastId" integer,
        "readAt" TIMESTAMP,
        "clickedAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "in_app_notifications_userId_idx" ON "in_app_notifications" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "in_app_notifications_user_read_idx" ON "in_app_notifications" ("userId", "readAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "in_app_notifications_broadcastId_idx" ON "in_app_notifications" ("broadcastId")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "in_app_notifications_user_dedupe" ON "in_app_notifications" ("userId", "dedupeKey")`,
    );

    await queryRunner.query(`
      CREATE TABLE "push_tokens" (
        "id" SERIAL PRIMARY KEY,
        "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "token" text NOT NULL,
        "deviceId" text,
        "platform" text NOT NULL DEFAULT 'expo',
        "locale" text,
        "clientPlatform" text,
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now()
      )
    `);
    await queryRunner.query(`CREATE INDEX "push_tokens_userId_idx" ON "push_tokens" ("userId")`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "push_tokens_user_device" ON "push_tokens" ("userId", "deviceId")`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "push_tokens"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "in_app_notifications"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "admin_broadcasts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "canned_replies"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cron_runs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "admin_audit_log"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "admin_sessions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "admin_users"`);
  }
}
