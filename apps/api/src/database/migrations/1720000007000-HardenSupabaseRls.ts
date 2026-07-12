import type { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Lock down Supabase (and any Postgres) so the public Data API cannot read/write
 * Munib tables.
 *
 * Munib never uses PostgREST / the publishable (`anon`) key for DB access — Nest
 * (TypeORM) and admin (Drizzle) connect with the privileged DB role, which has
 * `BYPASSRLS`. This migration:
 *
 * 1. Enables + forces RLS on every app table (deny-by-default; no policies).
 * 2. Revokes table/sequence/function grants from `PUBLIC`, and from Supabase
 *    roles `anon` / `authenticated` / `service_role` when they exist.
 * 3. Stops default privileges from re-granting those roles on future objects
 *    created by the migration role.
 * 4. Installs an event trigger so new `public` tables get RLS forced automatically.
 *
 * Safe on plain local Postgres: missing Supabase roles are skipped.
 */
export class HardenSupabaseRls1720000007000 implements MigrationInterface {
  name = "HardenSupabaseRls1720000007000";

  /** All application tables owned by TypeORM migrations (public schema). */
  private static readonly APP_TABLES = [
    "users",
    "auth_sessions",
    "sync_records",
    "content_reports",
    "content_report_attachments",
    "user_media",
    "app_versions",
    "app_feedback",
    "oss_content_download_failures",
    "admin_users",
    "admin_sessions",
    "admin_audit_log",
    "cron_runs",
    "canned_replies",
    "admin_broadcasts",
    "in_app_notifications",
    "push_tokens",
    // TypeORM migrations bookkeeping (also in public on Postgres).
    "migrations",
  ] as const;

  async up(queryRunner: QueryRunner): Promise<void> {
    for (const table of HardenSupabaseRls1720000007000.APP_TABLES) {
      await queryRunner.query(`
        DO $rls$
        BEGIN
          IF to_regclass('public.${table}') IS NOT NULL THEN
            EXECUTE 'ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY';
            EXECUTE 'ALTER TABLE public.${table} FORCE ROW LEVEL SECURITY';
          END IF;
        END
        $rls$;
      `);
    }

    // PUBLIC always exists; Supabase API roles may not on local Postgres.
    await queryRunner.query(`
      DO $revoke$
      DECLARE
        r text;
        roles text[] := ARRAY['anon', 'authenticated', 'service_role'];
      BEGIN
        REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
        REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;
        REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;

        FOREACH r IN ARRAY roles LOOP
          IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r) THEN
            EXECUTE format('REVOKE ALL ON ALL TABLES IN SCHEMA public FROM %I', r);
            EXECUTE format('REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM %I', r);
            EXECUTE format('REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM %I', r);
            EXECUTE format('REVOKE USAGE ON SCHEMA public FROM %I', r);
          END IF;
        END LOOP;
      END
      $revoke$;
    `);

    await queryRunner.query(`
      DO $defaults$
      DECLARE
        r text;
        roles text[] := ARRAY['anon', 'authenticated', 'service_role'];
        owner_role text := current_user;
      BEGIN
        EXECUTE format(
          'ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL ON TABLES FROM PUBLIC',
          owner_role
        );
        EXECUTE format(
          'ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL ON SEQUENCES FROM PUBLIC',
          owner_role
        );
        EXECUTE format(
          'ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM PUBLIC',
          owner_role
        );

        FOREACH r IN ARRAY roles LOOP
          IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r) THEN
            EXECUTE format(
              'ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL ON TABLES FROM %I',
              owner_role,
              r
            );
            EXECUTE format(
              'ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL ON SEQUENCES FROM %I',
              owner_role,
              r
            );
            EXECUTE format(
              'ALTER DEFAULT PRIVILEGES FOR ROLE %I IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM %I',
              owner_role,
              r
            );
          END IF;
        END LOOP;
      END
      $defaults$;
    `);

    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS munib_security`);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION munib_security.enable_rls_on_new_public_table()
      RETURNS event_trigger
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        obj record;
      BEGIN
        FOR obj IN
          SELECT *
          FROM pg_event_trigger_ddl_commands()
          WHERE command_tag = 'CREATE TABLE'
            AND object_type = 'table'
            AND schema_name = 'public'
        LOOP
          EXECUTE format('ALTER TABLE %s ENABLE ROW LEVEL SECURITY', obj.object_identity);
          EXECUTE format('ALTER TABLE %s FORCE ROW LEVEL SECURITY', obj.object_identity);
        END LOOP;
      END
      $fn$;
    `);

    await queryRunner.query(`
      DO $trig$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_event_trigger WHERE evtname = 'munib_force_rls_on_create_table'
        ) THEN
          CREATE EVENT TRIGGER munib_force_rls_on_create_table
            ON ddl_command_end
            WHEN TAG IN ('CREATE TABLE')
            EXECUTE FUNCTION munib_security.enable_rls_on_new_public_table();
        END IF;
      END
      $trig$;
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $trig$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM pg_event_trigger WHERE evtname = 'munib_force_rls_on_create_table'
        ) THEN
          DROP EVENT TRIGGER munib_force_rls_on_create_table;
        END IF;
      END
      $trig$;
    `);

    await queryRunner.query(
      `DROP FUNCTION IF EXISTS munib_security.enable_rls_on_new_public_table()`,
    );
    await queryRunner.query(`DROP SCHEMA IF EXISTS munib_security CASCADE`);

    for (const table of HardenSupabaseRls1720000007000.APP_TABLES) {
      await queryRunner.query(`
        DO $rls$
        BEGIN
          IF to_regclass('public.${table}') IS NOT NULL THEN
            EXECUTE 'ALTER TABLE public.${table} NO FORCE ROW LEVEL SECURITY';
            EXECUTE 'ALTER TABLE public.${table} DISABLE ROW LEVEL SECURITY';
          END IF;
        END
        $rls$;
      `);
    }

    // Do not re-grant anon/authenticated — leaving them revoked is safer on revert.
  }
}
