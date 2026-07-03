# Munib (مُنيب) Tracker

Track Your Journey Back to Allah.

## Monorepo structure

This is a **pnpm + Turborepo** monorepo:

| App / package | Path | Purpose |
|---------------|------|---------|
| **Product app** | `apps/app` | Expo SDK 57 — iOS, Android, Web (single codebase) |
| **Marketing site** | `apps/marketing-web` | Next.js 16 landing site (port 3000) |
| `@munib-tracker/shared` | `packages/shared` | Domain types, constants, validators |
| `@munib-tracker/theme` | `packages/theme` | Design tokens, accent palette, `resolveTheme()` |
| `@munib-tracker/typescript-config` | `packages/typescript-config` | Shared TS configs |
| `@munib-tracker/vitest-config` | `packages/vitest-config` | Vitest presets |

**Note:** `apps/marketing-web` (port 3000) and `apps/app web` (Expo, ~8081) are different apps.

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

Universal Expo app for salah, dhikr, and qadha tracking.

| Command | Description |
|---------|-------------|
| `pnpm --filter app dev` | Expo dev server — pick platform in CLI |
| `pnpm --filter app ios` | Build + launch iOS simulator (dev build) |
| `pnpm --filter app android` | Build + launch Android emulator (dev build) |
| `pnpm --filter app web` | Product app in browser (~8081) |

**Features:**
- Expo SDK 57 with React Compiler, typed routes, `expo-dev-client`
- Centralized `ThemeProvider` — light/dark/system + accent colors (persisted via AsyncStorage)
- Settings screen with appearance and accent pickers
- Home, Tracker, and Settings tabs using `useTheme()` throughout

## Marketing site (`apps/marketing-web`)

Next.js 16 marketing landing page with Tailwind CSS v4.3.

| Command | Description |
|---------|-------------|
| `pnpm --filter marketing-web dev` | Dev server on port 3000 |
| `pnpm --filter marketing-web build` | Production build |

**Features:**
- `cacheComponents: true`, Metadata API, `sitemap.ts`, `robots.ts`
- Server Components by default; Tailwind v4 `@source` scans monorepo packages

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
| **Husky** | pre-commit: Biome staged checks; pre-push: types + tests |
| **Vitest** | marketing-web + package tests |
| **Jest** | apps/app unit + feature tests |

## Testing

```bash
pnpm test                              # all tests via turbo
pnpm --filter marketing-web test       # Vitest
pnpm --filter app test                 # Jest + Testing Library RN
```

Unit + feature tests only — no Playwright or Maestro E2E.

## AI agent context

- Root: [`AGENTS.md`](AGENTS.md) — monorepo conventions
- Product: [`apps/app/AGENTS.md`](apps/app/AGENTS.md)
- Marketing: [`apps/marketing-web/AGENTS.md`](apps/marketing-web/AGENTS.md)

Official skills installed: `vercel/turborepo`, `expo/skills`, `vercel/next.js`

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
