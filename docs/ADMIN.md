# Admin Console

Ops console for Munib Tracker at **`admin.munibtracker.app`** (`apps/admin`, Next.js 16 App Router, port **3002**).

## Architecture

| Layer | Role |
|-------|------|
| **`apps/admin`** | UI + Route Handlers. Talks to Postgres via **Drizzle** (`@munib-tracker/db`). Does **not** call Nest for admin CRUD. |
| **`packages/db`** | Drizzle schemas mirroring Munib tables (`users`, content reports, feedback, sync, media, …) plus admin / broadcast / push tables. |
| **`apps/api`** | TypeORM owns DDL (migrations). Product APIs for the Expo app, including `/api/v1/notifications/*` for inbox + push-token registration. |
| **`@munib-tracker/shared`** | Broadcast contracts (`admin-broadcasts.ts`), branding, `OFFICIAL_ADMIN_ORIGIN`. |

Shared Postgres. Schema changes: TypeORM migration in `apps/api` first, then mirror columns in `packages/db` Drizzle schemas. On Supabase, use the Session pooler `DATABASE_URL`; RLS is forced by API migration `HardenSupabaseRls` (privileged DB role only — never the publishable anon key).

## Modules (sidebar)

Defined in `apps/admin/lib/permissions.ts`:

| # | Module | Path | Purpose |
|---|--------|------|---------|
| 1 | Dashboard | `/dashboard` | KPIs, alerts, activity |
| 2 | Users | `/users` | Search, detail, soft-delete / restore |
| 3 | Content reports | `/reports` | Triage Qur’an / Hadith / Names / Adhkar / Duas reports |
| 4 | App feedback | `/feedback` | Reviews / NPS + canned replies |
| 14 | Contact messages | `/contact-messages` | Marketing-site contact form inbox + admin notes |
| 13 | OSS download failures | `/oss-failures` | On-demand CDN failures (Qur’an editions, hadith, QCF fonts, audio) |
| 5 | App versions | `/versions` | Force-update / soft-update rows (`app_versions`) |
| 6 | Notifications | `/notifications` | Compose & send in-app + push broadcasts |
| 7 | User media | `/media` | Custom-adhkar attachments |
| 8 | Sync & devices | `/sync` | Cloud sync health / stuck users |
| 9 | Auth & abuse | `/auth-abuse` | Failed OAuth / rate-limit signals |
| 10 | Platform | `/platform` | API health (`GET /api/v1/health`), TypeORM migrations, cron run log |
| 11 | Administration | `/administration` | Admin users, roles, sessions, audit, settings |
| 12 | Playbooks | `/playbooks` | Ops runbooks + canned reply templates |

Munib-only — no expense, subscription, BYOS, or ticket-catalog surfaces.

## Auth & roles

1. **Custom Google OAuth** (not Auth.js) — email must exist in `admin_users` with `enabled = true`.
2. Session cookie: **`mt_admin_session`** (HttpOnly, signed with `ADMIN_SESSION_SECRET`).
3. Sign-in gate: Google button stays hidden until `?iAmAdmin=1` is in the URL (or `iAmAdmin()` in the browser console). See `AdminSignInGate`.
4. Roles: `super_admin` | `support` | `ops` | `content` | `analytics` — nav + actions gated in `apps/admin/lib/permissions.ts`.

Bootstrap an allowlisted admin (after API migrations have created `admin_users`):

```bash
# From repo root; loads apps/admin/.env.local or apps/api DATABASE_*
node apps/admin/scripts/seed-admin.mjs you@example.com
# optional role (default super_admin):
node apps/admin/scripts/seed-admin.mjs you@example.com ops
```

## Local development

```bash
pnpm install
# Ensure Postgres is up and API migrations have run (pnpm --filter api migration:run)
cp apps/admin/.env.example apps/admin/.env.local   # DATABASE_URL, ADMIN_SESSION_SECRET, Google OAuth
pnpm dev:admin   # http://localhost:3002
```

With `ADMIN_DEV_BYPASS_AUTH=1` (default in `.env.example`), local `next dev` skips Google login and uses a synthetic **super_admin** session (`local-dev@localhost`). Open http://localhost:3002/dashboard directly.

This bypass is **hard-disabled** when `NODE_ENV !== "development"` or `VERCEL` is set — Vercel preview and production always require real OAuth.

To exercise real Google sign-in locally: set `ADMIN_DEV_BYPASS_AUTH=0`, seed an allowlisted admin, then open `/login?iAmAdmin=1`.

```bash
node apps/admin/scripts/seed-admin.mjs you@example.com
```

Env reference: `apps/admin/.env.example` (`DATABASE_URL`, `ADMIN_URL`, `ADMIN_SESSION_SECRET`, `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`, `API_URL`, optional `ADMIN_DEV_BYPASS_AUTH`, VAPID + `ADMIN_CRON_SECRET`).

## Branding

Emerald (`#10b981`) + gold (`#e6c065`), cream light / deep green dark surfaces, Inter + Plus Jakarta Sans. Logos in `apps/admin/public/`. Product name / tagline from `@munib-tracker/shared/constants/branding` (`APP_NAME`, `APP_TAGLINE`).

## Related docs

- [`ADMIN_BROADCASTS.md`](./ADMIN_BROADCASTS.md) — fan-out, Expo Push, Web Push, product inbox
- [`PRODUCTION.md`](./PRODUCTION.md) — Vercel (fourth project), env vars, cron
- [`apps/admin/AGENTS.md`](../apps/admin/AGENTS.md) — agent conventions
- [`apps/admin/README.md`](../apps/admin/README.md) — quick start
- [`packages/db/README.md`](../packages/db/README.md) — Drizzle mirror package
