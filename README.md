# Munib (مُنيب) Tracker

Track Your Journey Back to Allah.

## Monorepo structure

This is a **pnpm + Turborepo** monorepo:

| App / package | Path | Purpose |
|---------------|------|---------|
| **Product app** | `apps/app` | Expo SDK 57 — iOS, Android, Web (single codebase) |
| **Marketing site** | `apps/marketing-web` | Next.js 16 landing site (port 3000) |
| **API server** | `apps/api` | NestJS 11 — auth + cloud sync (port 3001) |
| **Admin console** | `apps/admin` | Next.js ops console (port 3002) — users, reports, broadcasts |
| `@munib-tracker/shared` | `packages/shared` | Domain types, constants, validators, content, achievements |
| `@munib-tracker/db` | `packages/db` | Drizzle schema mirror for admin (DDL owned by API TypeORM migrations) |
| `@munib-tracker/theme` | `packages/theme` | Design tokens, accent palette, `resolveTheme()` |
| `@munib-tracker/api-contract` | `packages/api-contract` | OpenAPI spec exported from the API |
| `@munib-tracker/api-client` | `packages/api-client` | Orval-generated fetch + TanStack Query SDK |
| `@munib-tracker/typescript-config` | `packages/typescript-config` | Shared TS configs |
| `@munib-tracker/vitest-config` | `packages/vitest-config` | Vitest presets |

**Note:** `apps/marketing-web` (port 3000), `apps/api` (port 3001), `apps/admin` (port 3002), and `apps/app` web (Expo, ~8081) are different apps.

## Prerequisites

- Node.js ≥ 20.9
- pnpm 9 (`corepack enable`)
- For native dev: Xcode (iOS) and/or Android Studio (Android)

## Getting started

```bash
pnpm install          # always from repo root
pnpm dev              # all dev servers (turbo)
pnpm dev:app          # Expo product app
pnpm dev:marketing-web # Next.js marketing site (:3000)
```

## Product app (`apps/app`)

Universal Expo app for salah, dhikr, qadha, and Islamic content — offline-first and cross-platform.

| Command | Description |
|---------|-------------|
| `pnpm --filter app dev` | Expo dev server — pick platform in CLI |
| `pnpm --filter app ios` | Build + launch iOS simulator (dev build) |
| `pnpm --filter app android` | Build + launch Android emulator (dev build) |
| `pnpm --filter app web` | Product app in browser (~8081) |
| `pnpm --filter app build:data` | Regenerate bundled content (adhkar, duas, names, Qur'an, hadith highlights) |

**Platform:**
- Expo SDK 57 with React Compiler, typed routes, `expo-dev-client`
- Offline-first persistence on AsyncStorage (`src/db/` repositories + a zero-dep `useSyncExternalStore` store), no SQLite
- Centralized `ThemeProvider` — light/dark/system + preset & custom-hex accents (persisted)
- Full i18n (**23 locales**: English + 22 translations; RTL for Arabic, Urdu, Persian, Pashto, Kurdish); motion + a11y (WCAG AA contrast, ≥44pt targets) design system

**Worship & tracking:**
- Prayer tracker (5 fard + Witr + sunnah) with statuses, notes, streaks
- Qaza suite — counters, lifetime calculator, daily planner, and roza (fasting) tracking
- Dhikr library + favorites, tasbeeh counter (library-driven, free, and custom)
- Activity calendar (Gregorian + Hijri), day detail, statistics, achievements ("Noor" devotion levels)

**Content library (offline, sourced from open datasets):**
- Qur'an reader (translations, transliteration, audio, bookmarks, search)
- Hadith collections, full Hisnul Muslim duas, duroods, and the 99 Names
- Universal fuzzy search (Fuse.js) across every content source

**Times, location & platform:**
- On-device prayer times (`adhan`) + live location, Hijri date, sky/moon hero, weather effects
- Qibla compass, opt-in local notifications/reminders, guest-first auth with optional cloud sync

## Marketing site (`apps/marketing-web`)

Next.js 16 marketing landing page with Tailwind CSS v4.3.

| Command | Description |
|---------|-------------|
| `pnpm --filter marketing-web dev` | Dev server on port 3000 |
| `pnpm --filter marketing-web build` | Production build |

**Features:**
- `cacheComponents: true`, Metadata API, `sitemap.ts`, `robots.ts`
- Server Components by default; Tailwind v4 `@source` scans monorepo packages

## API server (`apps/api`)

NestJS 11 backend for authentication and cloud sync (port 3001, base path `/api/v1`).

| Command | Description |
|---------|-------------|
| `pnpm --filter api dev` | Dev server on port 3001 (Swagger UI at `/docs`) |
| `pnpm --filter api test` | Unit tests · `test:e2e` for end-to-end |
| `pnpm generate:api` | Export OpenAPI → regenerate the typed `@munib-tracker/api-client` |

**Features:**
- TypeORM persistence — PostgreSQL in prod, in-memory SQLite for tests; migrations under `src/database/migrations/`
- Guest sessions + OAuth (Google/Apple/Facebook), signed JWT access tokens with refresh-token rotation
- Cloud sync (`/sync/pull`, `/sync/push`) — last-write-wins, guest-blocked

## Shared packages

Import workspace packages by name:

```ts
import { APP_NAME, TRACKER_CATEGORIES } from "@munib-tracker/shared/constants";
import { resolveTheme } from "@munib-tracker/theme/resolve";
```

## Tooling

| Tool | Usage |
|------|-------|
| **Biome** | Lint + format (`pnpm lint`, `pnpm format-and-lint:fix`) |
| **Turborepo** | Task orchestration (`pnpm turbo run build lint check-types test`) |
| **Husky** | pre-commit: Biome autofix staged files + restage; pre-push: `pnpm check:ci` (matches GitHub Actions) |
| **Vitest** | marketing-web + package tests |
| **Jest** | apps/app unit + feature tests |

## Testing

```bash
pnpm test                              # all tests via turbo
pnpm --filter marketing-web test       # Vitest
pnpm --filter app test                 # Jest + Testing Library RN
```

Unit + feature tests only — no Playwright or Maestro **E2E in CI**. Maestro drives store screenshot capture (`pnpm screenshots:*`; see [`docs/STORE_ASSETS.md`](docs/STORE_ASSETS.md)).

## AI agent context

- Root: [`AGENTS.md`](AGENTS.md) — monorepo conventions
- Product: [`apps/app/AGENTS.md`](apps/app/AGENTS.md) — Expo app + Fuse.js search rules
- Marketing: [`apps/marketing-web/AGENTS.md`](apps/marketing-web/AGENTS.md)
- Admin: [`apps/admin/AGENTS.md`](apps/admin/AGENTS.md)
- API: [`apps/api/AGENTS.md`](apps/api/AGENTS.md) — NestJS backend
- Planning: [`docs/`](docs) — [`BACKLOG.md`](docs/BACKLOG.md), [`FEATURES.md`](docs/FEATURES.md), and topic guides ([`docs/README.md`](docs/README.md))

Official skills installed: `vercel/turborepo`, `expo/skills`, `vercel/next.js`, plus `.agents/skills/{nestjs,fuse-js}`.

## Share with the community

Please consider sharing a post about Munib Tracker and the value it provides. It really does help!

[![Tweet](https://img.shields.io/badge/Twitter-1DA1F2?logo=twitter&logoColor=white)](https://twitter.com/intent/tweet?text=Check%20out%20this%20GitHub%20repo%20for%20Munib%20Tracker!&url=https%3A%2F%2Fgithub.com%2Fmubbi%2Fmunib-tracker)
[![Share on Reddit](https://img.shields.io/badge/Reddit-FF4500?logo=reddit&logoColor=white)](https://reddit.com/submit?title=Munib%20Tracker%20Repo&url=https%3A%2F%2Fgithub.com%2Fmubbi%2Fmunib-tracker)
[![Share on LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fgithub.com%2Fmubbi%2Fmunib-tracker)
[![Share on Facebook](https://img.shields.io/badge/Facebook-1877F2?logo=facebook&logoColor=white)](https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fgithub.com%2Fmubbi%2Fmunib-tracker)
[![Discuss on Hacker News](https://img.shields.io/badge/Hacker%20News-FF6600?logo=ycombinator&logoColor=white)](https://news.ycombinator.com/submitlink?u=https%3A%2F%2Fgithub.com%2Fmubbi%2Fmunib-tracker&t=Munib%20Tracker%20Repo)
[![Share on Dev.to](https://img.shields.io/badge/Dev.to-0A0A0A?logo=dev.to&logoColor=white)](https://dev.to/new)

---

![GitHub stars](https://img.shields.io/github/stars/mubbi/munib-tracker)
![GitHub forks](https://img.shields.io/github/forks/mubbi/munib-tracker)
![GitHub license](https://img.shields.io/github/license/mubbi/munib-tracker)

## License

This project is open source under the [Creative Commons BY-NC 4.0 License](https://creativecommons.org/licenses/by-nc/4.0/).

Free for personal and educational use. Not allowed for commercial use. Please credit this project with a backlink if you use any part of the code.

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
