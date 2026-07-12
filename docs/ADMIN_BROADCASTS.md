# Admin broadcasts & in-app notifications

How Munib Tracker sends **ops announcements** from the admin console to signed-in product users (Expo + web).

## End-to-end flow

```
Admin UI (/notifications, /notifications/new)
  → writes broadcast_jobs (+ optional schedule)
  → cron-job.org (or manual) → /api/cron/process-broadcasts
      Authorization: Bearer $ADMIN_CRON_SECRET
  → batches users (BROADCAST_USER_BATCH_SIZE = 200)
  → inserts in_app_notifications rows
  → Expo Push API (native) + Web Push (VAPID)
Product app
  → PUT /api/v1/notifications/push-token
  → GET /api/v1/notifications/in-app
  → kind: admin_announcement
```

## Tables (Postgres)

Owned by TypeORM migration `1720000005000-AdminAndNotifications` in `apps/api`; mirrored in `@munib-tracker/db`:

| Table | Purpose |
|-------|---------|
| `broadcast_jobs` | pending / scheduled / processing / completed / failed / cancelled; cursor is **user UUID text** |
| `in_app_notifications` | Per-user inbox (`kind`, title, body, route data, read/click timestamps, …) |
| `push_tokens` | Expo / web push endpoints per user |
| `admin_users` | Allowlisted operators (`enabled` flag) |
| `admin_sessions` | Admin cookie sessions |
| `admin_audit_log` | Admin action audit |
| `admin_settings` | Key/value ops settings |
| `cron_run_log` | Cron execution history (Platform + Notifications) |

## Nest product API (`apps/api`)

Prefix: `/api/v1/notifications`. VAPID public key is unauthenticated; all other routes need a product JWT (linked accounts for push).

| Method | Path | Role |
|--------|------|------|
| `GET` | `/vapid-public-key` | Public; returns `VAPID_PUBLIC_KEY` when set |
| `PUT` | `/push-token` | Register / refresh Expo or web push token |
| `GET` | `/in-app` | Paginated inbox |
| `GET` | `/in-app/unread-count` | Unread count |
| `POST` | `/in-app/mark-all-read` | Mark all read |
| `PATCH` | `/in-app/:id/read` | Mark one read |
| `POST` | `/in-app/:id/engage` | Open/click engagement (broadcast counters) |

The admin console does **not** compose broadcasts through these routes — it writes `broadcast_jobs` via Drizzle and runs fan-out in admin Route Handlers / cron.

## Shared contracts

`packages/shared/src/admin-broadcasts.ts` (import `@munib-tracker/shared/admin-broadcasts`):

- `BROADCAST_USER_BATCH_SIZE` — `200`
- Audiences, categories, platforms, schedule modes, status enums, title/body limits
- External URL allowlist helpers for deep links

Official admin origin: `OFFICIAL_ADMIN_ORIGIN` in `packages/shared/src/constants/site.ts` (`https://admin.munibtracker.app`).

## Expo app

- Notification kind: **`admin_announcement`**
- Client helpers: `apps/app/src/lib/notifications-api.ts`
- Inbox sync + push-token registration on signed-in sessions
- Copy under the notifications namespace in `apps/app/src/i18n/*.json`

## Cron

External scheduler (e.g. cron-job.org every 15 minutes) — not configured in `apps/admin/vercel.json`:

| Path | Auth | Purpose |
|------|------|---------|
| `/api/cron/process-broadcasts` | `Authorization: Bearer $ADMIN_CRON_SECRET` | Drain `broadcast_jobs`, fan-out inbox + push |

Catalog entry: `apps/admin/lib/admin-cron-buckets.ts` (`process-broadcasts` only). Runs land in `cron_run_log` (Platform / Notifications overview).

## Env

**Admin** (`apps/admin/.env.example`): `DATABASE_URL`, `ADMIN_SESSION_SECRET`, Google OAuth, `API_URL`, `ADMIN_CRON_SECRET`, matching VAPID public + private keys to send Web Push.

**API**: optional `VAPID_PUBLIC_KEY` so web clients can call `GET /api/v1/notifications/vapid-public-key`.

## Related

- [`ADMIN.md`](./ADMIN.md) — console overview
- [`PRODUCTION.md`](./PRODUCTION.md) — production env + deploy
