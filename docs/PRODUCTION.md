# Production

Canonical URLs live in [`packages/shared/src/constants/site.ts`](../packages/shared/src/constants/site.ts). Local dev uses your own hosts (API, Expo web, marketing).

| Role | Production URL | Env |
|------|----------------|-----|
| Marketing (`apps/marketing-web`) | `https://munibtracker.app` | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PRODUCT_APP_URL`, `DATABASE_URL` (contact form), optional `NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| API (`apps/api`) | `https://api.munibtracker.app` | `CORS_ORIGINS`, `DATABASE_*`, `JWT_SECRET`, OAuth secrets (see below) |
| Expo web (`apps/app`) | `https://my.munibtracker.app` | `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_APP_URL` / `EXPO_PUBLIC_WEB_APP_ORIGIN`, `EXPO_PUBLIC_SITE_URL`, OAuth client IDs |
| Admin (`apps/admin`) | `https://admin.munibtracker.app` | `DATABASE_URL`, `ADMIN_SESSION_SECRET`, Google admin OAuth, `ADMIN_CRON_SECRET`, VAPID (see [ADMIN.md](./ADMIN.md)) |

## CORS

Production API: comma-separated `CORS_ORIGINS`, e.g.

`https://munibtracker.app,https://www.munibtracker.app,https://my.munibtracker.app`

Include `www` only if you serve it. Origins must match the browser’s exact scheme + host (no trailing path).

**Credentialed CORS is required for web Google/Apple auth** — the API sets HttpOnly cookies (`mt_access_token`, `mt_refresh_token`) and the Expo web client sends `credentials: "include"` with `x-munib-tracker-client: web`. Do not use a reflected/wildcard origin in production.

The admin console uses its **own** Google OAuth cookie (`mt_admin_session`) and talks to Postgres directly — it does **not** need to be listed in `CORS_ORIGINS` for product auth.

## OAuth (Google / Apple / Facebook)

Canonical setup: [`OAUTH_SETUP.md`](./OAUTH_SETUP.md). Deep links / App Links: [`DEEP_LINKS.md`](./DEEP_LINKS.md).

### API project (Vercel `apps/api`)

| Variable | Notes |
|----------|-------|
| `GOOGLE_OAUTH_CLIENT_IDS` | Comma-separated Web + iOS + Android client IDs |
| `GOOGLE_OAUTH_WEB_CLIENT_ID` | Optional; defaults to first audience |
| `GOOGLE_OAUTH_WEB_CLIENT_SECRET` | Web client secret only |
| `OAUTH_REDIRECT_URI_ALLOWLIST` | Web origins, App Link return URLs, Google reversed schemes, Apple API callback |
| `APPLE_CLIENT_IDS` | Bundle ID + Services ID |
| `APPLE_SERVICES_ID` / `APPLE_TEAM_ID` / `APPLE_KEY_ID` / `APPLE_PRIVATE_KEY` | Web/Android Apple code exchange |
| `FACEBOOK_APP_ID` / `FACEBOOK_APP_SECRET` | Optional Facebook Login |
| `CORS_ORIGINS` | Must include `https://my.munibtracker.app` |

### Expo web project (Vercel `apps/app`)

| Variable | Notes |
|----------|-------|
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB` | Web OAuth client |
| `EXPO_PUBLIC_APPLE_SERVICES_ID` | Services ID (matches API) |
| `EXPO_PUBLIC_WEB_APP_ORIGIN` | Prefer this for OAuth redirects (falls back to `EXPO_PUBLIC_APP_URL`) |
| `EXPO_PUBLIC_FACEBOOK_APP_ID` | Optional |

Native iOS/Android builds also need the per-platform Google client IDs and (for Apple on Android) App Links verification.
## Vercel (four projects)

Link the **same repo** to **four projects** with root directories `apps/marketing-web`, `apps/api`, `apps/app`, and `apps/admin`. Each `vercel.json` installs from the monorepo root via `cd ../.. && pnpm install --frozen-lockfile`.

Git auto-deploy is off (`git.deploymentEnabled: false`) — deploy with the Vercel CLI or dashboard Promote.

| Project | Root | Build | Output |
|---------|------|-------|--------|
| Marketing | `apps/marketing-web` | `turbo run build --filter=marketing-web` | Next.js `.next` (Vercel default) |
| API | `apps/api` | `pnpm --filter api migration:run` then `turbo build --filter=api` | Serverless handler `api/index.js` → `dist/vercel-handler.js` (rewrites → `/api`) |
| Web app | `apps/app` | `turbo run build:web --filter=app` | `apps/app/dist` |
| Admin | `apps/admin` | `turbo run build --filter=@munib-tracker/admin` | Next.js `.next` (`X-Robots-Tag: noindex`) |

### Super-admin console

- Domain: `admin.munibtracker.app`
- Ops guide: [`ADMIN.md`](./ADMIN.md) · broadcasts: [`ADMIN_BROADCASTS.md`](./ADMIN_BROADCASTS.md)
- After API migrations create `admin_*` tables, seed the first operator:
  `node apps/admin/scripts/seed-admin.mjs you@example.com`
- Google OAuth **web** client (separate from product OAuth) — redirect URI:
  `https://admin.munibtracker.app/api/auth/callback/google`
- Required env (see `apps/admin/.env.example`): `DATABASE_URL`, `ADMIN_URL`, `ADMIN_SESSION_SECRET` (≥32 chars), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `API_URL`
- Cron (cron-job.org every 15 min): `GET|POST https://admin.munibtracker.app/api/cron/process-broadcasts` with `Authorization: Bearer $ADMIN_CRON_SECRET`
- Web Push: set the same VAPID pair on admin (`VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY`); set `VAPID_PUBLIC_KEY` on the API so `GET /api/v1/notifications/vapid-public-key` works for the PWA

Web export uses Expo Router **`asyncRoutes` (web only)** and ships ~458 JS chunks. Home critical-path size / Lighthouse lab scores: [`PROFILING.md`](./PROFILING.md). After deploy, optional CrUX/field Web Vitals remain open.

Set env vars per project from `apps/*/.env.example`.

### Create / link projects

From the repo (with [Vercel CLI](https://vercel.com/docs/cli) logged in):

```bash
# Marketing — root directory apps/marketing-web
cd apps/marketing-web && vercel link

# API — root directory apps/api
cd apps/api && vercel link

# Expo web PWA — root directory apps/app
cd apps/app && vercel link

# Admin console — root directory apps/admin
cd apps/admin && vercel link
```

In each Vercel project settings, confirm **Root Directory** matches the table above. Custom domains: add in Vercel; point DNS (often CNAME to `cname.vercel-dns.com` for subdomains).

### API on Vercel

- NestJS boots once per cold start via `api/index.js` → webpack `dist/vercel-handler.js` (`serverless-http` + Express adapter); `vercel.json` rewrites all paths to `/api`.
- `vercel.json` sets `"framework": null` so Vercel does **not** use NestJS zero-config (that builder leaves `@munib-tracker/shared` as `.ts` requires Node cannot load). Webpack allowlists `@munib-tracker/*` so those sources are inlined into `dist/vercel-handler.js`.
- Runtime is pinned to **Node 22.x** (`engines` in `apps/api/package.json`) — avoid Node 24 on Vercel (native optional deps like `dtrace-provider` from the monorepo lockfile fail to compile).
- Build runs TypeORM migrations (`migration:run`) before `nest build`.
- Set production Postgres as **`DATABASE_URL`** on the API project (same Supabase Session pooler URI as admin — name it `DATABASE_URL`, not `POSTGRES_URL`). Build-time migrations need this available to **Production** builds. Optional `DATABASE_MIGRATE_URL` if runtime uses the transaction pooler (`:6543`); otherwise migrate auto-upgrades `:6543` → `:5432`. Discrete `DATABASE_HOST` / `USER` / … remain a local fallback only.
- **Supabase Postgres:** prefer the **Session** pooler (port `5432`) for Nest/TypeORM and admin. TLS is auto-enabled for Supabase hosts; admin/marketing use `@munib-tracker/db` which strips invalid `supa*` query params and pins the bundled Supabase CA when needed. Migration `HardenSupabaseRls` enables forced RLS on all app tables and revokes Data API grants from `anon` / `authenticated` / `service_role` — Nest and admin keep working because they connect as the privileged DB role (`BYPASSRLS`). Do **not** put the Supabase publishable (`anon`) key in any Munib app; optionally turn off unused Data API exposure in the Supabase dashboard.
- OAuth: set `GOOGLE_OAUTH_*`, `APPLE_*`, and `OAUTH_REDIRECT_URI_ALLOWLIST` as in [OAUTH_SETUP.md](./OAUTH_SETUP.md) before enabling social sign-in.
- Content-report + custom-adhkar image attachments: set `CLOUDINARY_CLOUD_NAME`,
  `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` so uploads survive serverless
  cold starts. Optional `CLOUDINARY_FOLDER` (default `munib-tracker/reports`) and
  `CLOUDINARY_USER_MEDIA_FOLDER` (default `munib-tracker/custom-adhkar`; authenticated
  delivery). Local disk (`REPORT_ATTACHMENTS_DIR` / `USER_MEDIA_DIR`) is for
  development only.
- Rate limits (content reports, app feedback, auth) and short-lived caches (app
  version meta): set `REDIS_URL` (and optional `REDIS_KEY_PREFIX`) for durable
  limits across instances; otherwise in-memory fallback. Monitor via
  `GET /api/v1/health` → `redis` (`configured`, `connected`, …).
  Upstash works with its TCP URL (`rediss://…`).
- Optional `VAPID_PUBLIC_KEY` for Web Push subscription bootstrap (admin holds the private key).

### Redis (optional, multi-instance)

When **`REDIS_URL`** is set (`apps/api/.env.example`, same value on admin when used):

- Shared **rate limits** across API replicas
- Short-lived **JSON caches** (app version meta on the API)
- **Cron leader election** on admin broadcast processing (`process-broadcasts`)

When unset, apps degrade gracefully: in-memory rate limits per process, no Redis
caches, cron may run on every overlapping trigger.

Optional **`REDIS_KEY_PREFIX`** namespaces keys as `mt:{prefix}:…` (defaults to `NODE_ENV`).

Marketing contact form submissions are stored in Postgres (`contact_messages`); rate limit is
**2 messages per email per 24 hours** (enforced in `apps/marketing-web` against the DB). Set
`DATABASE_URL` on the marketing-web Vercel project (same DB as API/admin).

### Admin on Vercel

- Project root `apps/admin` — see `vercel.json` (`noindex` headers, `ADMIN_URL` defaulted to production).
- Set production `DATABASE_URL` (same Postgres as API), session + Google admin OAuth, `API_URL=https://api.munibtracker.app`, `ADMIN_CRON_SECRET`, and VAPID keys.
- Admin does not need to be in API `CORS_ORIGINS` (direct DB access + its own cookie).

### Expo web on Vercel

```bash
pnpm --filter app run build:web   # → apps/app/dist
```

Production client env (baked at build time):

| Variable | Example |
|----------|---------|
| `EXPO_PUBLIC_API_URL` | `https://api.munibtracker.app/api/v1` |
| `EXPO_PUBLIC_APP_URL` | `https://my.munibtracker.app` |
| `EXPO_PUBLIC_WEB_APP_ORIGIN` | `https://my.munibtracker.app` (OAuth / App Links; falls back to `APP_URL`) |
| `EXPO_PUBLIC_SITE_URL` | `https://munibtracker.app` |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB` | Web OAuth client ID |
| `EXPO_PUBLIC_APPLE_SERVICES_ID` | Apple Services ID |

### Marketing on Vercel

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | `https://munibtracker.app` |
| `NEXT_PUBLIC_PRODUCT_APP_URL` | `https://my.munibtracker.app` |
| `NEXT_PUBLIC_API_URL` | `https://api.munibtracker.app/api/v1` (if the site calls the API) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXX` (optional GA4; empty disables). Enable Google Privacy & Messaging for the cookie consent popup |

## Verify after deploy

```bash
curl -sS https://api.munibtracker.app/api/v1/health
curl -sI https://my.munibtracker.app/
curl -sI https://munibtracker.app/
curl -sI https://admin.munibtracker.app/
```

Deep-link well-known files (when shipped): see [DEEP_LINKS.md](./DEEP_LINKS.md).
