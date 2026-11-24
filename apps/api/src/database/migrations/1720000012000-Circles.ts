import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Circles backend (NF-3.16 family, NF-3.17 partner, NF-3.18 group khatm — D1).
 * Mirrored in Drizzle at `packages/db/src/schema/circles.ts`. See `docs/CIRCLES.md`.
 */
export class Circles1720000012000 implements MigrationInterface {
  name = "Circles1720000012000";

  private static readonly TABLES = [
    "circles",
    "circle_members",
    "circle_invites",
    "child_profiles",
    "daily_signals",
    "group_khatms",
    "khatm_parts",
    "circle_nudges",
  ] as const;

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "circles" (
        "id" uuid PRIMARY KEY,
        "type" varchar(16) NOT NULL CHECK ("type" IN ('family', 'partner', 'khatm_group')),
        "name" varchar(60),
        "ownerId" uuid REFERENCES "users"("id") ON DELETE SET NULL,
        "settings" jsonb NOT NULL DEFAULT '{}'::jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP
      )
    `);
    await queryRunner.query(`CREATE INDEX "circles_owner_idx" ON "circles" ("ownerId")`);

    await queryRunner.query(`
      CREATE TABLE "circle_members" (
        "circleId" uuid NOT NULL REFERENCES "circles"("id") ON DELETE CASCADE,
        "memberId" uuid NOT NULL,
        "memberKind" varchar(8) NOT NULL CHECK ("memberKind" IN ('user', 'child')),
        "role" varchar(8) NOT NULL
          CHECK ("role" IN ('owner', 'admin', 'parent', 'member', 'child')),
        "displayName" varchar(32),
        "shareScope" jsonb NOT NULL DEFAULT '{}'::jsonb,
        "joinedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "leftAt" TIMESTAMP,
        PRIMARY KEY ("circleId", "memberId"),
        CHECK (("memberKind" = 'child') = ("role" = 'child'))
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "circle_members_member_idx" ON "circle_members" ("memberId")`,
    );

    await queryRunner.query(`
      CREATE TABLE "circle_invites" (
        "id" uuid PRIMARY KEY,
        "circleId" uuid NOT NULL REFERENCES "circles"("id") ON DELETE CASCADE,
        "codeHash" varchar(64) NOT NULL,
        "role" varchar(8) NOT NULL CHECK ("role" IN ('admin', 'parent', 'member')),
        "maxUses" integer NOT NULL CHECK ("maxUses" > 0),
        "uses" integer NOT NULL DEFAULT 0 CHECK ("uses" >= 0 AND "uses" <= "maxUses"),
        "expiresAt" TIMESTAMP NOT NULL,
        "createdBy" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "revokedAt" TIMESTAMP
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "circle_invites_code_unique" ON "circle_invites" ("codeHash")`,
    );
    await queryRunner.query(
      `CREATE INDEX "circle_invites_circle_idx" ON "circle_invites" ("circleId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "circle_invites_creator_idx" ON "circle_invites" ("createdBy", "createdAt")`,
    );

    await queryRunner.query(`
      CREATE TABLE "child_profiles" (
        "id" uuid PRIMARY KEY,
        "circleId" uuid NOT NULL REFERENCES "circles"("id") ON DELETE CASCADE,
        "createdBy" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "nickname" varchar(24) NOT NULL,
        "birthYear" integer NOT NULL CHECK ("birthYear" BETWEEN 1990 AND 2200),
        "avatar" varchar(32),
        "reward" jsonb,
        "graduationUnlocked" boolean NOT NULL DEFAULT false,
        "consentedAt" TIMESTAMP NOT NULL,
        "consentPolicyVersion" varchar(32) NOT NULL,
        "consentTransferredAt" TIMESTAMP,
        "linkTokenHash" varchar(64),
        "linkTokenExpiresAt" TIMESTAMP,
        "deviceTokenHash" varchar(64),
        "linkedDeviceAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "child_profiles_circle_idx" ON "child_profiles" ("circleId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "child_profiles_creator_idx" ON "child_profiles" ("createdBy")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "child_profiles_device_token_unique" ON "child_profiles" ("deviceTokenHash")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "child_profiles_link_token_unique" ON "child_profiles" ("linkTokenHash")`,
    );

    await queryRunner.query(`
      CREATE TABLE "daily_signals" (
        "circleId" uuid NOT NULL REFERENCES "circles"("id") ON DELETE CASCADE,
        "memberId" uuid NOT NULL,
        "date" varchar(10) NOT NULL,
        "kind" varchar(16) NOT NULL CHECK ("kind" IN ('fard_status', 'rest_day', 'goal_done')),
        "value" jsonb NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        PRIMARY KEY ("circleId", "memberId", "date", "kind")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "daily_signals_circle_date_idx" ON "daily_signals" ("circleId", "date")`,
    );

    await queryRunner.query(`
      CREATE TABLE "group_khatms" (
        "id" uuid PRIMARY KEY,
        "circleId" uuid NOT NULL REFERENCES "circles"("id") ON DELETE CASCADE,
        "title" varchar(80) NOT NULL,
        "intention" varchar(280),
        "unit" varchar(8) NOT NULL CHECK ("unit" IN ('juz', 'hizb', 'surah')),
        "partCount" integer NOT NULL CHECK ("partCount" IN (30, 60, 114)),
        "assignmentMode" varchar(16) NOT NULL DEFAULT 'self_pick'
          CHECK ("assignmentMode" IN ('self_pick', 'round_robin', 'creator_assigns')),
        "deadline" varchar(10),
        "round" integer NOT NULL DEFAULT 1 CHECK ("round" >= 1),
        "status" varchar(12) NOT NULL DEFAULT 'active' CHECK ("status" IN ('active', 'completed')),
        "createdBy" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "completedAt" TIMESTAMP
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "group_khatms_circle_idx" ON "group_khatms" ("circleId")`,
    );

    await queryRunner.query(`
      CREATE TABLE "khatm_parts" (
        "khatmId" uuid NOT NULL REFERENCES "group_khatms"("id") ON DELETE CASCADE,
        "partNo" integer NOT NULL CHECK ("partNo" >= 1 AND "partNo" <= 114),
        "assigneeMemberId" uuid,
        "status" varchar(8) NOT NULL DEFAULT 'open'
          CHECK ("status" IN ('open', 'assigned', 'reading', 'done')),
        "dealt" boolean NOT NULL DEFAULT false,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        PRIMARY KEY ("khatmId", "partNo"),
        CHECK (("status" = 'open') = ("assigneeMemberId" IS NULL) OR "status" = 'done')
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "khatm_parts_assignee_idx" ON "khatm_parts" ("assigneeMemberId")`,
    );

    await queryRunner.query(`
      CREATE TABLE "circle_nudges" (
        "id" uuid PRIMARY KEY,
        "circleId" uuid NOT NULL REFERENCES "circles"("id") ON DELETE CASCADE,
        "fromMember" uuid NOT NULL,
        "toMember" uuid NOT NULL,
        "kind" varchar(16) NOT NULL CHECK ("kind" IN ('dua', 'reminder')),
        "day" varchar(10) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CHECK ("fromMember" <> "toMember")
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "circle_nudges_pair_kind_day_unique" ON "circle_nudges" ("circleId", "fromMember", "toMember", "kind", "day")`,
    );
    await queryRunner.query(
      `CREATE INDEX "circle_nudges_to_idx" ON "circle_nudges" ("toMember", "createdAt")`,
    );

    // Deny-by-default on Supabase's Data API, same as every other app table.
    for (const table of Circles1720000012000.TABLES) {
      await queryRunner.query(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY`);
      await queryRunner.query(`ALTER TABLE "${table}" FORCE ROW LEVEL SECURITY`);
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    for (const table of [...Circles1720000012000.TABLES].reverse()) {
      await queryRunner.query(`DROP TABLE IF EXISTS "${table}"`);
    }
  }
}
