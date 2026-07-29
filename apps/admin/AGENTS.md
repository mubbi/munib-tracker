# Admin app — agent guide

Ops console at `apps/admin` (`@munib-tracker/admin`). Full product docs: [`docs/ADMIN.md`](../../docs/ADMIN.md), broadcasts: [`docs/ADMIN_BROADCASTS.md`](../../docs/ADMIN_BROADCASTS.md).

## Stack

- **Next.js 16** App Router, port **3002** (`app/`, `lib/`, `components/` — no `src/`)
- **Drizzle** through `@munib-tracker/db` — same Postgres as Nest; **no Nest admin CRUD**
- **Custom Google OAuth** + jose-signed cookie `mt_admin_session` (`ADMIN_SESSION_SECRET`)
- **Allowlist** `admin_users` with `enabled`; roles: `super_admin` | `support` | `ops` | `content` | `analytics`
- **Nav / RBAC:** `lib/permissions.ts`
- **Sign-in gate:** `components/ui/admin-sign-in-gate.tsx` — Google UI only after `?iAmAdmin=1` or `iAmAdmin()` in console
- **Local bypass:** `ADMIN_DEV_BYPASS_AUTH=1` + `NODE_ENV=development` + no `VERCEL` → synthetic super_admin via `isLocalAuthBypassEnabled()` (never on preview/prod)

## Do

- Prefer existing patterns under `app/(dashboard)/` and `lib/`
- Mirror schema changes: TypeORM migration in `apps/api` **then** Drizzle in `packages/db`
- Use `APP_NAME` / `APP_TAGLINE` from `@munib-tracker/shared/constants/branding` and CSS variables in `app/globals.css`
- Keep sidebar modules Munib-only (see `NAV_ITEMS` in `lib/permissions.ts`)
- OSS CDN download failures: `/oss-failures` (module 13) — read-only ops list from `oss_content_download_failures`
- Marketing contact inbox: `/contact-messages` (module 14) — triage + admin notes on `contact_messages`
- Broadcast fan-out: `BROADCAST_USER_BATCH_SIZE` from `@munib-tracker/shared/admin-broadcasts`; product user ids are **UUIDs**
- Platform health: Nest `GET /api/v1/health` (via `API_URL`) — includes Redis snapshot when `REDIS_URL` is set on the API
- Optional `REDIS_URL` / `REDIS_KEY_PREFIX` (same Redis as API) for broadcast cron leader locks
- Migrations status: TypeORM `migrations` table (not `__drizzle_migrations`)

## Don’t

- Don’t add expense / RevenueCat / BYOS / ticket-catalog leftovers
- Don’t invent Nest admin endpoints for console CRUD — write via Drizzle
- Don’t assume integer product user ids
- Don’t introduce Auth.js / NextAuth — keep the custom OAuth + session helpers in `lib/auth/`
- Don’t add non-Munib cron buckets — only `process-broadcasts` in `lib/admin-cron-buckets.ts`

## Seed

```bash
node apps/admin/scripts/seed-admin.mjs you@example.com [role]
```

Loads `apps/admin/.env.local` or API `DATABASE_*`.

## Cron

External `ADMIN_CRON_SECRET` bearer against `/api/cron/process-broadcasts` (see playbooks + [`docs/ADMIN_BROADCASTS.md`](../../docs/ADMIN_BROADCASTS.md)). Log runs to `cron_run_log`.

## Branding

Emerald `#10b981`, gold `#e6c065`, cream `#F5F0E6` / dark `#152921`. Assets in `public/`.
