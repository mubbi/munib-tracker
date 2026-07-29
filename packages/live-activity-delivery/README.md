# `@munib-tracker/live-activity-delivery`

Framework-agnostic ActivityKit push delivery shared by the Nest API today and a
future Fly.io (or similar) worker.

**Full ops guide:** [`docs/LIVE_ACTIVITY_PUSH.md`](../../docs/LIVE_ACTIVITY_PUSH.md)
(current QStash + cron setup, env checklist, when/how to add a Fly worker).

## What it owns

- APNs HTTP/2 `liveactivity` client (`ApnsLiveActivityClient`)
- ActivityKit token encrypt/decrypt helpers
- Atomic job claim + deliver + due-batch dispatch (`LiveActivityJobStore`,
  `deliverLiveActivityJob`, `dispatchDueLiveActivityJobs`)
- Shared constants (`DELIVERY_BATCH_SIZE`, leases, lifetime)

## What stays in `apps/api`

- Nest controllers, auth, QStash verify/schedule
- TypeORM entity mapping (`TypeOrmLiveActivityJobStore`)
- Registration / lifecycle upserts

## Current delivery path

1. App registers token + precomputed phase updates → Postgres jobs
2. Optional QStash `notBefore` → `POST /live-activities/internal/deliver`
3. Cron (always keep) → `POST /live-activities/internal/dispatch-due`
4. Both paths call into this package for claim + APNs

## Future Fly worker

When cron/QStash cannot drain prayer-time spikes in time:

1. Implement `LiveActivityJobStore` against Supabase (same tables)
2. `ApnsLiveActivityClient.fromEnv(process.env)` + matching encryption key
3. Loop `dispatchDueLiveActivityJobs({ store, apns, encryptionKey })`

No Redis/BullMQ required for the DB-poll path. Nest registration stays on Vercel.
Details and cutover steps: [`docs/LIVE_ACTIVITY_PUSH.md`](../../docs/LIVE_ACTIVITY_PUSH.md#future-flyio-worker-when-required).
