# Munib Tracker — Agent Guide

This is a **pnpm + Turborepo** monorepo for Munib Tracker (salah, dhikr, qadha).

## Apps

| App | Path | Role | Dev command |
|-----|------|------|-------------|
| **Product** | `apps/app` | Expo SDK 57 — iOS, Android, Web (single codebase) | `pnpm dev:app` |
| **Marketing** | `apps/marketing-web` | Next.js 16 landing site (port 3000) | `pnpm dev:marketing-web` |
| **Admin** | `apps/admin` | Next.js ops console (port 3002) — users, reports, broadcasts, platform | `pnpm dev:admin` |
| **API** | `apps/api` | NestJS 11 — cloud sync, auth, backend services (port 3001) | `pnpm dev:api` |

Deploy web surfaces to Vercel (four projects): see [`docs/PRODUCTION.md`](docs/PRODUCTION.md). Admin ops: [`docs/ADMIN.md`](docs/ADMIN.md).

**OAuth (Google / Apple / Facebook):** platform flows, env names, and console setup live in [`docs/OAUTH_SETUP.md`](docs/OAUTH_SETUP.md). App Links for Apple on Android: [`docs/DEEP_LINKS.md`](docs/DEEP_LINKS.md).

**Important:** `apps/marketing-web` (port 3000), `apps/api` (port 3001), `apps/admin` (port 3002), and `apps/app web` (Expo, ~8081) are different apps.

## Shared packages

Import via workspace package names:

- `@munib-tracker/shared` — domain types, constants, validators, admin broadcast contracts
- `@munib-tracker/db` — Drizzle schema mirror for the admin console (DDL owned by API TypeORM migrations)
- `@munib-tracker/theme` — design tokens, `resolveTheme()`, accent palette
- `@munib-tracker/typescript-config` — shared TS configs
- `@munib-tracker/vitest-config` — Vitest presets
- `@munib-tracker/api-contract` — OpenAPI spec exported from `apps/api`
- `@munib-tracker/api-client` — Orval-generated fetch + TanStack Query SDK

## Conventions

- **Lint/format:** Biome at repo root (`pnpm lint`, `pnpm format-and-lint:fix`)
- **Tests:** Vitest (marketing-web, packages) + Jest (apps/app). No Playwright/Maestro **E2E in CI** — Maestro is used only for store screenshot capture (`pnpm screenshots:*`, [`docs/STORE_ASSETS.md`](docs/STORE_ASSETS.md)).
- **Product theme:** All screens use `useTheme()` from `apps/app/src/providers/theme-provider.tsx` — no hardcoded colors.
- **Marketing styling:** Tailwind CSS v4.3 with `@source` scanning monorepo packages in `globals.css`.
- **Fuzzy search:** Fuse.js v7 in `apps/app` — canonical module `apps/app/src/lib/search.ts`. See [apps/app/AGENTS.md](apps/app/AGENTS.md) and `.agents/skills/fuse-js/SKILL.md`.

## Per-app agent files

- [apps/app/AGENTS.md](apps/app/AGENTS.md) — Expo product app
- [apps/marketing-web/AGENTS.md](apps/marketing-web/AGENTS.md) — Next.js marketing site
- [apps/admin/AGENTS.md](apps/admin/AGENTS.md) — Ops / admin console
- [apps/api/AGENTS.md](apps/api/AGENTS.md) — NestJS API server

## Common commands

```bash
pnpm install              # always from repo root
pnpm generate:api         # export OpenAPI + generate typed client (Orval)
pnpm dev                  # all dev servers (turbo)
pnpm dev:admin            # admin console only (port 3002)
pnpm build:admin          # production build for apps/admin
pnpm check:ci             # same as CI + pre-push: lint → types → test → build → OpenAPI drift
pnpm check:quick          # fast local smoke: lint + typecheck (not a git hook)
# Husky: pre-commit = Biome --write --staged + restage; pre-push = pnpm check:ci
pnpm turbo run lint check-types test
pnpm test:coverage          # unit tests + HTML/Clover reports under */coverage/ (gitignored)
pnpm test:coverage:open     # open coverage HTML in the browser (optional: app api shared …)
pnpm --filter app ios     # Expo iOS dev build
pnpm --filter app android # Expo Android dev build
pnpm --filter app web     # Expo web
pnpm --filter app build:data  # regenerate bundled content (adhkar/duas/names/Qur'an/hadith)
# Seed allowlisted admin (needs DATABASE_URL): node apps/admin/scripts/seed-admin.mjs you@example.com

# Native (Expo prebuild / local release — requires apps/app/.env)
pnpm prebuild:app:android   # expo prebuild + version sync
pnpm prebuild:app:ios
pnpm cleanbuild:app:android # prebuild --clean + version sync
pnpm cleanbuild:app:ios
pnpm doctor:app             # expo doctor
pnpm dev:app:android:doctor # adb/emulator connectivity repair
pnpm dev:app:android:signs  # Gradle signingReport
pnpm dev:app:ios:signs      # Xcode signing settings (macOS)
pnpm release:app:android          # local signed AAB (Gradle)
pnpm release:app:android:upload   # upload AAB to Play internal testing
pnpm release:app:ios              # local signed IPA (xcodebuild, macOS)
pnpm release:app:ios:upload       # upload IPA to App Store Connect
```

## Content & data

Religious content (Qur'an, hadith, adhkar, duas, 99 Names, audio) is **sourced from open datasets, never hand-written**, and generated into `apps/app/assets/data/` (+ a `manifest.json` credits registry) by the pipeline in `apps/app/scripts/build-data/`. Bundled JSON is offline-first; extra Qur'an editions and full hadith collections are fetched cache-first from CDNs (`apps/app/src/api/{quran,hadith}-remote.ts`). Never edit generated content files (`packages/shared/src/content/*` for adhkar/duas, `apps/app/assets/data/*`, `apps/app/src/lib/quran-loader.ts`) by hand — change the builder and re-run `build:data`. Web first-load / chunk rules: [`docs/PROFILING.md`](docs/PROFILING.md) (use `quran-meta` / dynamic `import()` so multi‑MB JSON stays out of `__common`).

## Docs

Planning + reference lives in [`docs/`](docs/) — start at [`docs/README.md`](docs/README.md):

| Doc | Role |
|-----|------|
| [`BACKLOG.md`](docs/BACKLOG.md) | Open work (product, i18n, perf, devices, content) |
| [`FEATURES.md`](docs/FEATURES.md) | Shipped NF-* feature catalog |
| [`I18N_GUIDE.md`](docs/I18N_GUIDE.md) | 23-locale i18n ops, scripture rules |
| [`OAUTH_SETUP.md`](docs/OAUTH_SETUP.md) | Google / Apple / Facebook sign-in (native + web) |
| [`DEEP_LINKS.md`](docs/DEEP_LINKS.md) | Custom scheme + HTTPS App Links (incl. Apple OAuth) |
| [`PRODUCTION.md`](docs/PRODUCTION.md) | Vercel deploys + production env (incl. OAuth + admin) |
| [`ADMIN.md`](docs/ADMIN.md) | Ops console (modules, roles, seed, branding) |
| [`ADMIN_BROADCASTS.md`](docs/ADMIN_BROADCASTS.md) | In-app / push broadcasts from admin → product |
| [`DATA_INGESTION.md`](docs/DATA_INGESTION.md) + [`FREE_OPEN_SOURCE_DATA.md`](docs/FREE_OPEN_SOURCE_DATA.md) | Content pipeline & OSS sources |
| [`PROFILING.md`](docs/PROFILING.md) | Web/native perf profile + remaining `__common` work |
| [`NATIVE_SURFACES.md`](docs/NATIVE_SURFACES.md) | Widgets, Live Activities, Siri, Watch, Wear |
| [`DEVICES.md`](docs/DEVICES.md) | Platform support matrix |
| [`STORE_ASSETS.md`](docs/STORE_ASSETS.md) | App Store / Play screenshots (Maestro) |
| [`IOS_APP_COPY.md`](docs/IOS_APP_COPY.md) · [`ANDROID_APP_COPY.md`](docs/ANDROID_APP_COPY.md) | Store listing copy |

## AI skills (installed via `pnpm dlx skills add`)

- `vercel/turborepo` — monorepo patterns
- `expo/skills` — Expo / React Native
- `vercel/next.js` — Next.js 16 best practices
- `.agents/skills/nestjs` — official NestJS markdown guides (mirrored from [nestjs/docs.nestjs.com](https://github.com/nestjs/docs.nestjs.com/tree/master/content))
- `.agents/skills/fuse-js` — Fuse.js fuzzy search (from [krisk/Fuse/docs](https://github.com/krisk/Fuse/tree/main/docs)); use for all search bars and `apps/app/src/lib/search.ts`
