# Web Push + Surface Push (Salah phases)

Ops guide for scheduled Salah phase notifications on the Expo web PWA and
shared QStash/cron delivery used by Android Expo Push Live Update corrections.
Product UI / native surfaces: [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md).
ActivityKit (iOS) remains separate — [`LIVE_ACTIVITY_PUSH.md`](./LIVE_ACTIVITY_PUSH.md).

## Goal

Browser timers do **not** fire when the tab is closed. Web Push delivers
precomputed phase notifications (`upcoming` → `markSalah` → `afterSalah`) for
~48 hours after the user taps **Track this Salah**. Android uses the same job
table with an `expo` channel for killed-app corrections; local AlarmManager remains
authoritative on device.

## Architecture

```
Track this Salah (guest or linked)
  → Web: PushSubscription JSON  /  Android: Expo push token
  → PUT /api/v1/surface-push
  → Postgres: surface_push_registrations + surface_push_jobs
       ├─ preferred: Upstash QStash notBefore → POST …/surface-push/internal/deliver
       └─ always:   cron → POST …/surface-push/internal/dispatch-due
  → @munib-tracker/surface-push-delivery (web-push | Expo Push)
  → Service worker showNotification  /  Android OngoingSalahNotification
```

**Do not** mix ActivityKit APNs tokens into `surface_push_*` tables.

## Configure

| Var                        | Where                                            | Notes                                                      |
| -------------------------- | ------------------------------------------------ | ---------------------------------------------------------- |
| `VAPID_PUBLIC_KEY`         | API, admin, app (`EXPO_PUBLIC_VAPID_PUBLIC_KEY`) | Same key everywhere                                        |
| `VAPID_PRIVATE_KEY`        | API + admin                                      | Required to send                                           |
| `VAPID_SUBJECT`            | API + admin (optional)                           | `mailto:` or `https:`; defaults to `mailto:` support email |
| `API_PUBLIC_URL`           | API                                              | QStash callbacks                                           |
| `QSTASH_*`                 | API                                              | Shared with Live Activity                                  |
| `SURFACE_PUSH_CRON_SECRET` | API                                              | Cron drain                                                 |

Cron every 1–5 minutes:

```http
POST https://api.munibtracker.app/api/v1/surface-push/internal/dispatch-due
Authorization: Bearer $SURFACE_PUSH_CRON_SECRET
```

The same tick also drives the weekly family digest (D40, Friday 18:00 UTC; see
[`CIRCLES.md`](./CIRCLES.md)) — without this cron no digest is sent.

## Client

- Permission + subscribe: `registerWebPushSubscriptionWithApi` (user gesture)
- Schedule upsert on Track: `registerSurfacePushSchedule`
- Stop / logout: lifecycle + `unsubscribeWebPushSubscription`
- Service worker: `apps/app/public/expo-service-worker.js` (tag-replace, same-origin routes)
- iOS/iPadOS: installed Home Screen PWA required (16.4+)

## API

| Method   | Path                                         | Auth                 |
| -------- | -------------------------------------------- | -------------------- |
| `PUT`    | `/api/v1/surface-push`                       | JWT (guest + linked) |
| `PUT`    | `/api/v1/surface-push/:id/lifecycle`         | JWT                  |
| `DELETE` | `/api/v1/surface-push/:id`                   | JWT                  |
| `POST`   | `/api/v1/surface-push/internal/deliver`      | QStash signature     |
| `POST`   | `/api/v1/surface-push/internal/dispatch-due` | Cron bearer          |

Migration: `1720000011000-SurfacePush`. Regenerate client: `pnpm generate:api`.

## Limits

- Replaceable notifications — not a Live Activity / Dynamic Island.
- 48h client-precomputed horizon; reopen the app to refresh.
- 404/410 Web Push and Expo `DeviceNotRegistered` responses invalidate the registration.
- Registration dedupes updates by `dedupeKey` (last write wins). Delivery mirrors Live Activity: an in-flight / too-early job or a transient provider failure returns **503** (QStash retries with backoff), a deleted/terminal job is a no-op 200, and an older job is cancelled when a newer phase is already due or delivered.
- Web Push is sent with `urgency: high` and a TTL capped at the phase `staleAt`; a web job that is already stale is cancelled rather than shown late. Expo payloads (silent corrections) are not stale-capped.
- Cron also expires registrations past `expiresAt` (cancelling their jobs) and deletes ended/invalid/expired registrations after 7 days.
- The client persists the last registration id, so Stop / sign-out after a restart still ends server jobs. Android ignores data pushes whose `sessionId` is not the active, undismissed tracking session.
- Admin broadcasts prune `push_tokens` rows reported dead (Expo `DeviceNotRegistered`, Web Push 404/410); registering a token on a new account removes it from other accounts.

## Visible product pushes (circle events, D33)

`@munib-tracker/surface-push-delivery` also exports a typed **visible** path —
`createExpoVisiblePushSender()` (batched, 100 per request, `channelId: "default"`) and
`createWebVisiblePushSender(config)` (same VAPID keys; payload `{ title, body, data, tag }` read by
the service worker's `push` handler, tap → `data.url`). The silent `SurfaceSender` above stays
Salah-phase only. Circle khatm / dua events use it via `CirclePushService` against the
`push_tokens` registry — see [`CIRCLES.md`](./CIRCLES.md#realtime--push-d33).
