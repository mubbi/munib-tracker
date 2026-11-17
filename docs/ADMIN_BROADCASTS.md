# Admin broadcasts & in-app notifications

How Munib Tracker sends **ops announcements** from the admin console to signed-in product users (Expo + web).

## End-to-end flow

```
Admin UI (/notifications, /notifications/new)
  → writes admin_broadcasts (+ optional schedule: immediate | fixed_utc | user_local)
  → cron-job.org → /api/cron/process-broadcasts
      Authorization: Bearer $ADMIN_CRON_SECRET
    or manual "process" → POST /api/broadcasts/:id/process (admin session)
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

| Table                  | Purpose                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `admin_broadcasts`     | pending / scheduled / processing / completed / failed / cancelled; cursor (`cursor_user_id`) is **user UUID text** |
| `in_app_notifications` | Per-user inbox (`kind`, title, body, route data, read/click timestamps, …)                                         |
| `push_tokens`          | Expo / web push endpoints per user                                                                                 |
| `admin_users`          | Allowlisted operators (`enabled` flag)                                                                             |
| `admin_sessions`       | Admin cookie sessions                                                                                              |
| `admin_audit_log`      | Admin action audit                                                                                                 |
| `canned_replies`       | Support reply templates (Playbooks / feedback)                                                                     |
| `cron_runs`            | Cron execution history (shown on the Notifications overview)                                                       |

## Nest product API (`apps/api`)

Prefix: `/api/v1/notifications`. VAPID public key is unauthenticated; all other routes need a product JWT (linked accounts for push).

| Method  | Path                    | Role                                        |
| ------- | ----------------------- | ------------------------------------------- |
| `GET`   | `/vapid-public-key`     | Public; returns `VAPID_PUBLIC_KEY` when set |
| `PUT`   | `/push-token`           | Register / refresh Expo or web push token   |
| `GET`   | `/in-app`               | Paginated inbox                             |
| `GET`   | `/in-app/unread-count`  | Unread count                                |
| `POST`  | `/in-app/mark-all-read` | Mark all read                               |
| `PATCH` | `/in-app/:id/read`      | Mark one read                               |
| `POST`  | `/in-app/:id/engage`    | Open/click engagement (broadcast counters)  |

The admin console does **not** compose broadcasts through these routes — it writes `admin_broadcasts` via Drizzle and runs fan-out in admin Route Handlers / cron.

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

| Path                           | Auth                                       | Purpose                                                              |
| ------------------------------ | ------------------------------------------ | -------------------------------------------------------------------- |
| `/api/cron/process-broadcasts` | `Authorization: Bearer $ADMIN_CRON_SECRET` | Drain due `admin_broadcasts`, fan-out inbox + push (`GET` or `POST`) |

Catalog entry: `apps/admin/lib/admin-cron-buckets.ts` (`process-broadcasts` only; `GET /api/cron` lists buckets). When `REDIS_URL` is set, a Redis leader lock (`lib/redis/redisCronLock.ts`) stops overlapping hits from double-processing; without Redis every hit runs (fail-open). Each run that holds the lock writes one `cron_runs` row (`ok` / `error`, duration, error) via `lib/cron/recordCronRun.ts`, shown on the Notifications overview; lock-skipped hits aren't logged.

## Env

**Admin** (`apps/admin/.env.example`): `DATABASE_URL`, `ADMIN_SESSION_SECRET`, Google OAuth, `API_URL`, `ADMIN_CRON_SECRET`, matching VAPID public + private keys to send Web Push, optional `VAPID_SUBJECT` (`mailto:` / `https://`; defaults to `mailto:` the official support email), optional `REDIS_URL` / `REDIS_TLS` / `REDIS_KEY_PREFIX` for the cron lock.

**API**: optional `VAPID_PUBLIC_KEY` so web clients can call `GET /api/v1/notifications/vapid-public-key`.

## Related

- [`ADMIN.md`](./ADMIN.md) — console overview
- [`PRODUCTION.md`](./PRODUCTION.md) — production env + deploy
