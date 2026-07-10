# Munib Tracker — Agent Guide

This is a **pnpm + Turborepo** monorepo for Munib Tracker (salah, dhikr, qadha).

## Apps

| App | Path | Role | Dev command |
|-----|------|------|-------------|
| **Product** | `apps/app` | Expo SDK 57 — iOS, Android, Web (single codebase) | `pnpm dev:app` |
| **Marketing** | `apps/marketing-web` | Next.js 16 landing site (port 3000) | `pnpm dev:marketing-web` |
| **API** | `apps/api` | NestJS 11 — cloud sync, auth, backend services (port 3001) | `pnpm dev:api` |

Deploy web surfaces to Vercel (three projects): see [`docs/PRODUCTION.md`](docs/PRODUCTION.md).

**Important:** `apps/marketing-web` (port 3000), `apps/api` (port 3001), and `apps/app web` (Expo, ~8081) are different apps.

## Shared packages

Import via workspace package names:

- `@munib-tracker/shared` — domain types, constants, validators
- `@munib-tracker/theme` — design tokens, `resolveTheme()`, accent palette
- `@munib-tracker/typescript-config` — shared TS configs
- `@munib-tracker/vitest-config` — Vitest presets
- `@munib-tracker/api-contract` — OpenAPI spec exported from `apps/api`
- `@munib-tracker/api-client` — Orval-generated fetch + TanStack Query SDK

## Conventions

- **Lint/format:** Biome at repo root (`pnpm lint`, `pnpm format-and-lint:fix`)
- **Tests:** Vitest (marketing-web, packages) + Jest (apps/app). No Playwright or Maestro.
- **Product theme:** All screens use `useTheme()` from `apps/app/src/providers/theme-provider.tsx` — no hardcoded colors.
- **Marketing styling:** Tailwind CSS v4.3 with `@source` scanning monorepo packages in `globals.css`.
- **Fuzzy search:** Fuse.js v7 in `apps/app` — canonical module `apps/app/src/lib/search.ts`. See [apps/app/AGENTS.md](apps/app/AGENTS.md) and `.agents/skills/fuse-js/SKILL.md`.

## Per-app agent files

- [apps/app/AGENTS.md](apps/app/AGENTS.md) — Expo product app
- [apps/marketing-web/AGENTS.md](apps/marketing-web/AGENTS.md) — Next.js marketing site
- [apps/api/AGENTS.md](apps/api/AGENTS.md) — NestJS API server

## Common commands

```bash
pnpm install              # always from repo root
pnpm generate:api         # export OpenAPI + generate typed client (Orval)
pnpm dev                  # all dev servers (turbo)
pnpm check:ci             # CI profile: typecheck + lint + test + build
pnpm check:quick          # fast pre-commit: lint + typecheck
pnpm turbo run lint check-types test
pnpm --filter app ios     # Expo iOS dev build
pnpm --filter app android # Expo Android dev build
pnpm --filter app web     # Expo web
pnpm --filter app build:data  # regenerate bundled content (adhkar/duas/names/Qur'an/hadith)

# Native (Expo prebuild / local release — requires apps/app/.env)
pnpm prebuild:app:android   # expo prebuild + version sync
pnpm prebuild:app:ios
pnpm cleanbuild:app:android # prebuild --clean + version sync
pnpm cleanbuild:app:ios
pnpm doctor:app             # expo doctor
pnpm dev:app:android:doctor # adb/emulator connectivity repair
pnpm dev:app:android:signs  # Gradle signingReport
pnpm dev:app:ios:signs      # Xcode signing settings (macOS)
pnpm release:app:android    # local signed AAB (Gradle)
pnpm release:app:ios        # local signed IPA (xcodebuild, macOS)
```

## Content & data

Religious content (Qur'an, hadith, adhkar, duas, 99 Names, audio) is **sourced from open datasets, never hand-written**, and generated into `apps/app/assets/data/` (+ a `manifest.json` credits registry) by the pipeline in `apps/app/scripts/build-data/`. Bundled JSON is offline-first; extra Qur'an editions and full hadith collections are fetched cache-first from CDNs (`apps/app/src/api/{quran,hadith}-remote.ts`). Never edit generated content files (`packages/shared/src/content/*` for adhkar/duas, `apps/app/assets/data/*`, `apps/app/src/lib/quran-loader.ts`) by hand — change the builder and re-run `build:data`.

## Docs

Planning + reference lives in [`docs/`](docs/) — start at [`docs/README.md`](docs/README.md):

| Doc | Role |
|-----|------|
| [`BACKLOG.md`](docs/BACKLOG.md) | Active open work (product, i18n, perf, devices) |
| [`FEATURES.md`](docs/FEATURES.md) | Shipped NF-* feature catalog |
| [`I18N_GUIDE.md`](docs/I18N_GUIDE.md) | 23-locale i18n ops, status, scripture rules |
| [`DATA_INGESTION.md`](docs/DATA_INGESTION.md) + [`FREE_OPEN_SOURCE_DATA.md`](docs/FREE_OPEN_SOURCE_DATA.md) | Content pipeline & OSS sources |
| [`PROFILING.md`](docs/PROFILING.md) | Bundle / startup optimization backlog |
| [`NATIVE_SURFACES.md`](docs/NATIVE_SURFACES.md) | Widgets, Live Activities, Siri, Watch, Wear |

Historical PRD and NF flows: [`docs/archive/`](docs/archive/).

## AI skills (installed via `pnpm dlx skills add`)

- `vercel/turborepo` — monorepo patterns
- `expo/skills` — Expo / React Native
- `vercel/next.js` — Next.js 16 best practices
- `.agents/skills/nestjs` — official NestJS markdown guides (mirrored from [nestjs/docs.nestjs.com](https://github.com/nestjs/docs.nestjs.com/tree/master/content))
- `.agents/skills/fuse-js` — Fuse.js fuzzy search (from [krisk/Fuse/docs](https://github.com/krisk/Fuse/tree/main/docs)); use for all search bars and `apps/app/src/lib/search.ts`
