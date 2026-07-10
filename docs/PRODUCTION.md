# Production

Canonical URLs live in [`packages/shared/src/constants/site.ts`](../packages/shared/src/constants/site.ts). Local dev uses your own hosts (API, Expo web, marketing).

| Role | Production URL | Env |
|------|----------------|-----|
| Marketing (`apps/marketing-web`) | `https://munibtracker.app` | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PRODUCT_APP_URL` |
| API (`apps/api`) | `https://api.munibtracker.app` | `CORS_ORIGINS`, `DATABASE_*`, `JWT_SECRET`, OAuth secrets |
| Expo web (`apps/app`) | `https://my.munibtracker.app` | `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_APP_URL`, `EXPO_PUBLIC_SITE_URL` |

## CORS

Production API: comma-separated `CORS_ORIGINS`, e.g.

`https://munibtracker.app,https://www.munibtracker.app,https://my.munibtracker.app`

Include `www` only if you serve it. Origins must match the browser’s exact scheme + host (no trailing path).

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
- Content-report file uploads use local disk by default (`REPORT_ATTACHMENTS_DIR`) — use object storage before relying on attachments in serverless.

### Expo web on Vercel

```bash
pnpm --filter app run build:web   # → apps/app/dist
```

Production client env (baked at build time):

| Variable | Example |
|----------|---------|
| `EXPO_PUBLIC_API_URL` | `https://api.munibtracker.app/api/v1` |
| `EXPO_PUBLIC_APP_URL` | `https://my.munibtracker.app` |
| `EXPO_PUBLIC_SITE_URL` | `https://munibtracker.app` |

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
