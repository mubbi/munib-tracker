# Munib Tracker — Product app (`apps/app`)

Universal **Expo SDK 57** app (iOS · Android · Web from one codebase) for salah, dhikr, qadha, and Islamic content. Offline-first, guest-first.

> Part of the [Munib Tracker monorepo](../../README.md). Always run commands from the **repo root** with pnpm workspace filters. Read [`AGENTS.md`](AGENTS.md) before writing code (it mandates the Expo SDK 57 docs + the Fuse.js search rules).

## Develop

```bash
pnpm install                   # from repo root (pnpm 9 workspace)
pnpm --filter app dev          # Expo dev server — pick a platform in the CLI
pnpm --filter app ios          # iOS simulator (dev build)
pnpm --filter app android      # Android emulator (dev build)
pnpm --filter app web          # web (~8081)
```

This uses `expo-dev-client` (not Expo Go) — native modules (`expo-audio`, `expo-notifications`, `expo-location`, `expo-haptics`, …) need a dev build.

## Gates

```bash
pnpm --filter app check-types
pnpm --filter app test         # Jest + Testing Library RN
pnpm format-and-lint:fix       # Biome (repo root)
```

## Content data

Bundled religious content lives under [`assets/data/`](assets/data) and is **generated** — never hand-edit it (or `src/lib/quran-loader.ts`). Regenerate with:

```bash
pnpm --filter app build:data   # adhkar, duas, 99 Names, Qur'an, hadith highlights + manifest.json
```

Content is sourced from open datasets, never hand-written. See [`docs/DATA_INGESTION_TODO.md`](../../docs/DATA_INGESTION_TODO.md) and [`docs/FREE_OPEN_SOURCE_DATA.md`](../../docs/FREE_OPEN_SOURCE_DATA.md).

## Architecture at a glance

- **Routing:** Expo Router (typed routes), root `Stack` + `(tabs)` group under `src/app/`.
- **Persistence:** AsyncStorage behind `src/db/` repositories (`KeyedCollection` + `DB_KEYS`), no SQLite.
- **State:** zero-dep `useSyncExternalStore` stores in `src/stores/` (`tracker-store` is the reactive hub).
- **Theme/i18n:** `ThemeProvider` (light/dark + preset & custom-hex accents) and `react-i18next` (**23 locales**, RTL for `ar`/`ur`/`fa`/`ps`/`ku`). See [`docs/I18N_GUIDE.md`](../../docs/I18N_GUIDE.md).
- **Search:** one Fuse.js engine in `src/lib/search.ts` — extend it, don't scatter `new Fuse()` (see [`AGENTS.md`](AGENTS.md)).
- **Content library / times / sync:** see the project memory + [`docs/`](../../docs).
