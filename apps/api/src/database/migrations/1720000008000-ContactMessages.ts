import type { MigrationInterface, QueryRunner } from "typeorm";

export class ContactMessages1720000008000 implements MigrationInterface {
  name = "ContactMessages1720000008000";

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "contact_messages" (
        "id" uuid PRIMARY KEY,
        "name" varchar(100) NOT NULL,
        "email" varchar(254) NOT NULL,
        "message" text NOT NULL,
        "status" varchar(32) NOT NULL DEFAULT 'new',
        "adminNotes" text,
        "ipAddress" varchar(64),
        "userAgent" varchar(512),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_contact_messages_email_created"
        ON "contact_messages" ("email", "createdAt")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_contact_messages_status_created"
        ON "contact_messages" ("status", "createdAt")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_contact_messages_created"
        ON "contact_messages" ("createdAt")
    `);

    // HardenSupabaseRls event trigger forces RLS on new public tables; enable
    // explicitly so fresh installs without that trigger still deny-by-default.
    await queryRunner.query(`
      DO $rls$
      BEGIN
        IF to_regclass('public.contact_messages') IS NOT NULL THEN
          EXECUTE 'ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY';
          EXECUTE 'ALTER TABLE public.contact_messages FORCE ROW LEVEL SECURITY';
        END IF;
      END
      $rls$;
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_contact_messages_created"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_contact_messages_status_created"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_contact_messages_email_created"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "contact_messages"`);
  }
}
