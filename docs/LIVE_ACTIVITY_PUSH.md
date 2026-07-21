# Live Activity remote push (ActivityKit)

Ops + architecture for closed-app Salah phase updates (Mark → after-Salah adhkar → upcoming). Product UI / native surfaces: [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md). Production env checklist: [`PRODUCTION.md`](./PRODUCTION.md).

## Goal

Local JS `setTimeout` / `Activity.update` do **not** run reliably when the iOS app is suspended or killed. ActivityKit **APNs** pushes (`apns-push-type: liveactivity`) apply precomputed content-state at each phase boundary.

## Architecture (current)

```
iOS ActivityKit (pushType: .token)
  → onPushToken + widget snapshot schedule
  → PUT /api/v1/live-activities  (JWT; Nest on Vercel)
  → Postgres: live_activity_push_tokens + live_activity_push_jobs
       ├─ preferred: Upstash QStash notBefore → POST …/internal/deliver
       └─ always:   cron → POST …/internal/dispatch-due
  → @munib-tracker/live-activity-delivery (APNs HTTP/2 + atomic claim)
  → device Live Activity UI updates
```

| Piece | Role |
|-------|------|
| App `src/lib/live-activity/` | Start/update/end; build schedule; register token; lifecycle ended/dismissed |
| Nest `apps/api/src/live-activities/` | Auth, upsert, QStash schedule/verify, TypeORM store adapter |
| `@munib-tracker/live-activity-delivery` | Framework-agnostic APNs client, token crypto, claim/deliver/dispatch |
| Postgres | Source of truth for tokens + pending jobs (migration `1720000010000-LiveActivityPush`) |
| QStash | Optional exact-time wake-ups (`notBefore`) |
| Cron | Required safety net + sole path when QStash is unset/exhausted |

**Do not** route ActivityKit tokens through Expo Push / admin broadcast fan-out — different protocol.

## What to configure now

### 1. APNs (required for any remote update)

On the **API** Vercel project (`apps/api/.env.example`):

| Var | Notes |
|-----|--------|
| `APNS_TEAM_ID` | Apple Developer Team ID |
| `APNS_KEY_ID` | Key ID of an **APNs** Auth Key (`.p8`) — prefer dedicated, not Sign in with Apple |
| `APNS_PRIVATE_KEY` | PEM on one line with literal `\n` |
| `APNS_BUNDLE_ID` | Default `app.munibtracker` → topic `{bundle}.push-type.liveactivity` |

### 2. Encryption (recommended)

| Var | Notes |
|-----|--------|
| `ACTIVITYKIT_TOKEN_ENCRYPTION_KEY` | Optional 32-byte key, base64. If unset, derived from `JWT_SECRET` |

### 3. Scheduler — pick one or both

**Recommended:** QStash **and** cron. Cron alone is fine early; QStash alone is **not** — free-tier/outage leaves jobs stuck without a drain.

#### QStash (optional, preferred timing)

| Var | Notes |
|-----|--------|
| `API_PUBLIC_URL` | Public API origin, no trailing slash (e.g. `https://api.munibtracker.app`) |
| `QSTASH_TOKEN` | Upstash token |
| `QSTASH_CURRENT_SIGNING_KEY` | For `POST …/internal/deliver` JWT verify |
| `QSTASH_NEXT_SIGNING_KEY` | Next signing key (rotation) |

Callback URL (published by the API):  
`{API_PUBLIC_URL}/api/v1/live-activities/internal/deliver`

#### Cron fallback (keep even with QStash)

| Var | Notes |
|-----|--------|
| `LIVE_ACTIVITY_CRON_SECRET` | Bearer secret for dispatch |

Schedule (e.g. [cron-job.org](https://cron-job.org)) every **1–5 minutes**:

```http
POST https://api.munibtracker.app/api/v1/live-activities/internal/dispatch-due
Authorization: Bearer $LIVE_ACTIVITY_CRON_SECRET
```

Each run processes up to **50** due `pending` jobs (`DELIVERY_BATCH_SIZE`), recovers expired `processing` leases, and cleans expired tokens. It does **not** fan out to all users — only jobs with `executeAt <= now`.

### 4. Client / native

- Ship an iOS build with `pushType: .token` (`modules/munib-live-activity`)
- User must enable Live Activity in Settings → Notifications
- Registration is best-effort (needs session + token event + snapshot)

### 5. Migrate DB

API Vercel build already runs `pnpm --filter api migration:run`. Tables: `live_activity_push_tokens`, `live_activity_push_jobs` (Drizzle mirror in `packages/db`).

## API surface

| Method | Path | Auth |
|--------|------|------|
| `PUT` | `/api/v1/live-activities` | Bearer JWT — upsert token + schedule updates |
| `PUT` | `/api/v1/live-activities/:activityId/lifecycle` | Bearer JWT — ended/dismissed → cancel jobs |
| `POST` | `/api/v1/live-activities/internal/deliver` | QStash signature (`upstash-signature` + raw body) |
| `POST` | `/api/v1/live-activities/internal/dispatch-due` | `Authorization: Bearer $LIVE_ACTIVITY_CRON_SECRET` |

Regenerate client after OpenAPI changes: `pnpm generate:api`.

## Operational notes

- **Phase windows:** ~15 min Mark Salah → ~30 min after-Salah → upcoming (see `LIVE_ACTIVITY_*_WINDOW_MS` in app + docs in NATIVE_SURFACES).
- **Idempotency:** deliver claims `pending` → `processing` atomically so QStash + cron + a future worker cannot double-send the same job.
- **QStash free tier exhaust / schedule errors:** job stays `pending` in Postgres; cron drains it (slightly later).
- **BadDeviceToken / 410:** token marked `invalid`; remaining jobs cancelled.
- **ActivityKit lifetime:** ~8h; schedules are capped; expired rows cleaned after retention.
- **Scale:** prayer-time spikes create many *due* jobs, not “all users.” If backlog grows (latency ≫ cron interval), raise frequency/batch or add a worker (below) — not BullMQ by default.

## Checklist (ship remote push)

- [ ] APNs vars on API
- [ ] `LIVE_ACTIVITY_CRON_SECRET` + cron every 1–5 min
- [ ] (Optional) QStash vars + `API_PUBLIC_URL`
- [ ] Migration applied
- [ ] iOS build with ActivityKit push token path
- [ ] Smoke: enable LA → background/kill app → phase boundary updates via push

---

## Future: Fly.io worker (when required)

**When to add:** measured backlog under prayer-time spikes (due jobs not draining within acceptable latency), or you want a long-running poller independent of Vercel function timeouts. **Not required** while QStash + cron keep up.

**Do not add Redis/BullMQ** unless you need multi-job-type delayed queues beyond “DB + poll.” The shared package already supports Postgres-poll delivery.

### Target shape

```
Nest (Vercel): registration + optional QStash publish
Postgres (Supabase): jobs source of truth
Fly Machine: loop dispatchDueLiveActivityJobs (or call internal dispatch with secret)
APNs ← @munib-tracker/live-activity-delivery
```

Optional Redis (redis.io / Upstash Redis) only if you later add BullMQ for other workloads.

### Implementation sketch

1. New app or script (e.g. `apps/live-activity-worker`) depending on `@munib-tracker/live-activity-delivery` (+ Drizzle/`pg` or reuse TypeORM).
2. Implement `LiveActivityJobStore` against Supabase (same tables). Prefer atomic claim (`UPDATE … WHERE status = 'pending'` or `FOR UPDATE SKIP LOCKED`).
3. Env on Fly (same secrets as API):

   | Var | Purpose |
   |-----|---------|
   | `DATABASE_URL` | Supabase session/pooler URL suitable for a long-lived process |
   | `APNS_*` | Same as API |
   | `ACTIVITYKIT_TOKEN_ENCRYPTION_KEY` or `JWT_SECRET` | Must match API so ciphertext decrypts |
   | Optional | Drop or stop publishing QStash once worker is primary; keep cron briefly as backup |

4. Worker loop:

```ts
import {
  ApnsLiveActivityClient,
  dispatchDueLiveActivityJobs,
  resolveActivityKitEncryptionKey,
} from "@munib-tracker/live-activity-delivery";

const apns = ApnsLiveActivityClient.fromEnv(process.env);
const encryptionKey = resolveActivityKitEncryptionKey({
  encryptionKeyBase64: process.env.ACTIVITYKIT_TOKEN_ENCRYPTION_KEY,
  jwtSecret: process.env.JWT_SECRET!,
});

for (;;) {
  await dispatchDueLiveActivityJobs({ store, apns, encryptionKey });
  await sleep(5_000); // or wake on NOTIFY / shorter when backlog > 0
}
```

5. Fly deploy: smallest always-on shared Machine (~$2–6/mo typical; no lasting free always-on for new orgs). Worker usually needs **no** public IPv4.
6. Cutover: run worker + cron together → confirm drain → disable QStash scheduling if unused → optionally retire cron once worker is trusted.
7. Nest stays on Vercel for HTTP; do **not** host the poller inside the serverless Nest process.

### Cost / ops reminder

| Host | Always-on worker |
|------|------------------|
| Fly.io | Usage-based; small shared VM ~$2–6/mo |
| Render | Background workers start ~Starter (~$7/mo); no free worker tier |

Package reference: [`packages/live-activity-delivery/README.md`](../packages/live-activity-delivery/README.md).
