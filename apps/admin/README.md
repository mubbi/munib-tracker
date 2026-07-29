# `@munib-tracker/admin`

Next.js 16 App Router ops console for Munib Tracker.

| | |
|--|--|
| **URL (prod)** | https://admin.munibtracker.app |
| **Dev** | `pnpm dev:admin` → http://localhost:3002 |
| **Package** | `@munib-tracker/admin` |
| **Data** | Drizzle via `@munib-tracker/db` (same Postgres as Nest) |

## Quick start

```bash
# From monorepo root
cp apps/admin/.env.example apps/admin/.env.local
# Set DATABASE_URL (same as apps/api). ADMIN_DEV_BYPASS_AUTH=1 skips Google login locally.

pnpm dev:admin
```

Open http://localhost:3002/dashboard (local bypass acts as super_admin). For real OAuth: set `ADMIN_DEV_BYPASS_AUTH=0`, seed an admin, then `/login?iAmAdmin=1`.

## Docs

- [docs/ADMIN.md](../../docs/ADMIN.md) — modules, roles, architecture
- [docs/ADMIN_BROADCASTS.md](../../docs/ADMIN_BROADCASTS.md) — broadcasts & product inbox
- [docs/PRODUCTION.md](../../docs/PRODUCTION.md) — Vercel deploy
- [AGENTS.md](./AGENTS.md) — conventions for agents

## Scripts

| Script | Command |
|--------|---------|
| Dev | `pnpm dev:admin` or `pnpm --filter @munib-tracker/admin dev` |
| Build | `pnpm build:admin` |
| Seed admin | `node apps/admin/scripts/seed-admin.mjs email@example.com [role]` |
| DB smoke | `pnpm --filter @munib-tracker/admin test:db` |
| Lint / types | `pnpm --filter @munib-tracker/admin lint` / `check-types` |
