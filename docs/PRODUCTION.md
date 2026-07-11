# Production

Canonical URLs live in [`packages/shared/src/constants/site.ts`](../packages/shared/src/constants/site.ts). Local dev uses your own hosts (API, Expo web, marketing).

| Role | Production URL | Env |
|------|----------------|-----|
| Marketing (`apps/marketing-web`) | `https://munibtracker.app` | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PRODUCT_APP_URL` |
| API (`apps/api`) | `https://api.munibtracker.app` | `CORS_ORIGINS`, `DATABASE_*`, `JWT_SECRET`, OAuth secrets (see below) |
| Expo web (`apps/app`) | `https://my.munibtracker.app` | `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_APP_URL` / `EXPO_PUBLIC_WEB_APP_ORIGIN`, `EXPO_PUBLIC_SITE_URL`, OAuth client IDs |

## CORS

Production API: comma-separated `CORS_ORIGINS`, e.g.

`https://munibtracker.app,https://www.munibtracker.app,https://my.munibtracker.app`

Include `www` only if you serve it. Origins must match the browser’s exact scheme + host (no trailing path).

**Credentialed CORS is required for web Google/Apple auth** — the API sets HttpOnly cookies (`mt_access_token`, `mt_refresh_token`) and the Expo web client sends `credentials: "include"` with `x-munib-tracker-client: web`. Do not use a reflected/wildcard origin in production.

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
## Vercel (three projects)

Link the **same repo** to **three projects** with root directories `apps/marketing-web`, `apps/api`, and `apps/app`. Each `vercel.json` installs from the monorepo root via `cd ../.. && pnpm install --frozen-lockfile`.

Git auto-deploy is off (`git.deploymentEnabled: false`) — deploy with the Vercel CLI or dashboard Promote, matching the Expense Trail pattern.

| Project | Root | Build | Output |
|---------|------|-------|--------|
| Marketing | `apps/marketing-web` | `turbo run build --filter=marketing-web` | Next.js `.next` (Vercel default) |
| API | `apps/api` | `pnpm --filter api migration:run` then `turbo build --filter=api` | Serverless handler `api/index.ts` (rewrites → `/api`) |
| Web app | `apps/app` | `turbo run build:web --filter=app` | `apps/app/dist` |

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
```

In each Vercel project settings, confirm **Root Directory** matches the table above. Custom domains: add in Vercel; point DNS (often CNAME to `cname.vercel-dns.com` for subdomains).

### API on Vercel

- NestJS boots once per cold start via `api/index.ts` (`serverless-http` + Express adapter).
- Build runs TypeORM migrations (`migration:run`) before `nest build`.
- Set production `DATABASE_*`, `JWT_SECRET` (≥32 chars), and `CORS_ORIGINS` on the API project.
- OAuth: set `GOOGLE_OAUTH_*`, `APPLE_*`, and `OAUTH_REDIRECT_URI_ALLOWLIST` as in [OAUTH_SETUP.md](./OAUTH_SETUP.md) before enabling social sign-in.
- Content-report attachments: set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and
  `CLOUDINARY_API_SECRET` so uploads survive serverless cold starts. Optional
  `CLOUDINARY_FOLDER` (default `munib-tracker/reports`). Local disk
  (`REPORT_ATTACHMENTS_DIR`) is for development only.
- Rate limits (content reports, app feedback, auth): set `UPSTASH_REDIS_REST_URL` +
  `UPSTASH_REDIS_REST_TOKEN` for durable limits across instances; otherwise in-memory fallback.
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

## Verify after deploy

```bash
curl -sS https://api.munibtracker.app/api/v1/health
curl -sI https://my.munibtracker.app/
curl -sI https://munibtracker.app/
```

Deep-link well-known files (when shipped): see [DEEP_LINKS.md](./DEEP_LINKS.md).
