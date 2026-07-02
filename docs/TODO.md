# Munib Tracker — Phased Product Requirements (PRD)

> **Purpose:** Executable roadmap for building Munib Tracker. Each phase has ordered tasks with file paths, types, packages, and acceptance criteria so an AI agent (or developer) can implement without guessing.
>
> **Last reviewed:** 2026-07-03  
> **Apps:** `apps/app` (Expo SDK 57) · `apps/marketing-web` (Next.js 16) · `apps/api` (NestJS 11)  
> **Agent guides:** [`AGENTS.md`](../AGENTS.md), [`apps/app/AGENTS.md`](../apps/app/AGENTS.md), [`apps/marketing-web/AGENTS.md`](../apps/marketing-web/AGENTS.md), [`apps/api/AGENTS.md`](../apps/api/AGENTS.md)

---

## Document conventions

| Field | Meaning |
|-------|---------|
| **ID** | Stable task identifier (e.g. `P2.1`). Reference in commits/PRs. |
| **Depends on** | Task IDs that must be done first. |
| **Status** | `done` · `partial` · `todo` (as of last review) |
| **AC** | Acceptance criteria — all must pass before marking complete. |

**Implementation rules (all phases):**

- Use `useTheme()` from `apps/app/src/providers/theme-provider.tsx` — no hardcoded colors.
- Put domain types, constants, and validators in `@munib-tracker/shared`.
- Put design tokens in `@munib-tracker/theme`; app-specific layout in `apps/app/src/constants/theme.ts`.
- Lint/format with Biome; add tests (Jest in `apps/app`, Vitest in `apps/api`, `apps/marketing-web`, and packages).
- Read Expo SDK 57 docs before adding native modules: https://docs.expo.dev/versions/v57.0.0/
- **API:** NestJS modules in `apps/api/src/`; export OpenAPI → `@munib-tracker/api-contract` → Orval SDK in `@munib-tracker/api-client` (`pnpm generate:api`). Read [`.agents/skills/nestjs/SKILL.md`](../.agents/skills/nestjs/SKILL.md) before backend work.
- **Client API usage:** wrap apps with `ApiQueryProvider` from `@munib-tracker/api-client/provider`; prefer generated hooks over hand-rolled fetch.

---

## Monorepo layout

| App / package | Path | Role | Dev command |
|---------------|------|------|-------------|
| **Product** | `apps/app` | Expo SDK 57 — iOS, Android, Web | `pnpm dev:app` |
| **Marketing** | `apps/marketing-web` | Next.js 16 landing site (port 3000) | `pnpm dev:marketing-web` |
| **API** | `apps/api` | NestJS 11 — auth, cloud sync (port 3001) | `pnpm dev:api` |
| `@munib-tracker/shared` | `packages/shared` | Domain types, constants, validators | — |
| `@munib-tracker/theme` | `packages/theme` | Design tokens, `resolveTheme()`, accents | — |
| `@munib-tracker/api-contract` | `packages/api-contract` | OpenAPI spec exported from API | — |
| `@munib-tracker/api-client` | `packages/api-client` | Orval-generated fetch + TanStack Query SDK | — |
| `@munib-tracker/typescript-config` | `packages/typescript-config` | Shared TS configs (incl. `nestjs.json`) | — |
| `@munib-tracker/vitest-config` | `packages/vitest-config` | Vitest presets | — |

**Ports:** marketing-web `3000` · API `3001` · Expo web `~8081` — three separate apps.

---

## Current baseline (already implemented)

### Product app (`apps/app`)

| Area | Status | Key files |
|------|--------|-----------|
| Tab navigation (Home, Tracker, Settings) | `done` | `apps/app/src/app/{index,tracker,settings}.tsx`, `components/app-tabs*.tsx` |
| Theme: light/dark/system + 5 accent presets | `done` | `packages/theme/`, `providers/theme-provider.tsx` |
| Splash + animated overlay | `done` | `apps/app/src/app/_layout.tsx` |
| Reusable UI (StatCard, TrackerRow, SectionHeader) | `done` | `apps/app/src/components/ui/` |
| TanStack Query provider (API client shell) | `partial` | `apps/app/src/providers/api-provider.tsx` — wired, no hooks used yet |
| Static Home/Tracker UI (hardcoded zeros) | `partial` | `index.tsx`, `tracker.tsx` |
| Local DB, stores, auth UI, sync client | `todo` | — |

### Marketing site (`apps/marketing-web`)

| Area | Status | Key files |
|------|--------|-----------|
| Landing page (Hero, Features, CTA) | `done` | `src/app/page.tsx`, `src/components/{hero,features,cta-button}.tsx` |
| Layout, metadata, footer | `done` | `src/app/layout.tsx`, `src/components/footer.tsx` |
| `robots.ts` / `sitemap.ts` | `partial` | Placeholder domain `munib-tracker.example.com` |
| TanStack Query provider (API client shell) | `partial` | `src/providers/api-provider.tsx` — wired, unused |
| About, privacy, terms pages | `todo` | — |

### API server (`apps/api`)

| Area | Status | Key files |
|------|--------|-----------|
| NestJS 11 scaffold (Webpack + SWC, global prefix `api/v1`) | `done` | `src/main.ts`, `nest-cli.json`, `webpack.config.js` |
| Config + env validation | `done` | `src/config/`, `.env.example` |
| Health probe | `done` | `GET /api/v1/health` — `src/health/` |
| TypeORM database (Postgres prod / SQLite in-memory tests) | `done` | `src/database/` — `UserEntity`, `AuthSessionEntity`, `SyncRecordEntity` |
| Guest auth (create/resume by `deviceId`) | `done` | `POST /api/v1/auth/guest` — `src/auth/` |
| OAuth + account linking | `partial` | `POST /api/v1/auth/oauth/:provider`, `POST /api/v1/auth/link` — stub token exchange; needs real provider integration |
| Session management (`me`, `logout`) | `done` | `GET /api/v1/auth/me`, `POST /api/v1/auth/logout` |
| Cloud sync pull/push (last-write-wins, guest blocked) | `done` | `GET /api/v1/sync/pull`, `POST /api/v1/sync/push` — `src/sync/` |
| OpenAPI at `/docs` + export script | `partial` | `src/main.ts`, `scripts/export-openapi.ts` — run `pnpm generate:api` to commit spec |
| JWT / refresh-token rotation | `todo` | Tokens are UUIDs today; `JWT_SECRET` unused |
| Unit + e2e tests | `partial` | `src/**/*.spec.ts`, `test/app.e2e-spec.ts` |

### Shared packages

| Area | Status | Key files |
|------|--------|-----------|
| Theme tokens + `resolveTheme()` + tests | `done` | `packages/theme/src/` |
| Domain stubs | `partial` | `packages/shared/src/{types,constants,validators}/` |
| API client mutator + Query provider | `partial` | `packages/api-client/src/{mutator,provider,datetime}.ts` |
| Orval codegen pipeline | `partial` | `packages/api-client/orval.config.ts` — `src/generated/**` created by `pnpm generate:api` |
| OpenAPI contract artifact | `todo` | `packages/api-contract/openapi.json` not committed yet |
| Vitest + TS configs | `done` | `packages/vitest-config/`, `packages/typescript-config/` |

**Product gaps (unchanged):** data persistence, client auth, sync engine, notifications, content — Phases 1+.

**Existing shared types** (`packages/shared/src/types/index.ts`):

- `TrackerCategory`, `TrackerEntry`, `DailySummary` — minimal; expand in Phase 1.

---

## Phase dependency graph

```mermaid
flowchart TD
  P0[Phase 0: Product Foundation] --> P1[Phase 1: Data Layer]
  P0A[Phase 0.5: API Foundation] --> P8[Phase 8: Auth and Sync]
  P1 --> P8
  P1 --> P2[Phase 2: Prayer Tracking]
  P1 --> P3[Phase 3: Zikr and Tasbeeh]
  P1 --> P4[Phase 4: Qaza Management]
  P2 --> P5[Phase 5: Calendar History Stats]
  P3 --> P5
  P4 --> P5
  P3 --> P6[Phase 6: Content Libraries]
  P6 --> P7[Phase 7: Settings and i18n]
  P7 --> P9[Phase 9: Notifications]
  P2 --> P10[Phase 10: Onboarding and Achievements]
  P5 --> P10
  P8 --> P9
  P8 --> P11[Phase 11: Profile and About]
  P6 --> P12[Phase 12: Qibla and Utilities]
  P10 --> P13[Phase 13: Post-MVP]
```

---

# Phase 0 — Product foundation (complete)

Shell, navigation, and theme for `apps/app`. No further work unless regressions appear.

| ID | Task | Status |
|----|------|--------|
| P0.1 | Expo Router tabs: Home, Tracker, Settings | `done` |
| P0.2 | `ThemeProvider` + accent persistence (AsyncStorage) | `done` |
| P0.3 | Splash screen + `expo-splash-screen` | `done` |
| P0.4 | Shared UI components (`StatCard`, `TrackerRow`, `ScreenLayout`) | `done` |

---

# Phase 0.5 — Monorepo & API foundation

**Goal:** Backend (`apps/api`), API contract/codegen, and marketing site shell. Can proceed in parallel with Phase 1.

## 0.5.1 Marketing landing site

| | |
|---|---|
| **ID** | P0.5.1 |
| **Depends on** | — |
| **Status** | `done` |
| **App** | `apps/marketing-web` |

**AC:**

- [x] Next.js 16 landing with Hero, Features, CTA (`src/app/page.tsx`)
- [x] Tailwind v4 + `@munib-tracker/theme` tokens
- [x] Vitest feature tests (`src/app/page.feature.test.tsx`)
- [ ] Replace placeholder domain in `robots.ts` / `sitemap.ts` before launch
- [ ] About / privacy / terms pages (stretch — link from app P11.2)

---

## 0.5.2 NestJS API scaffold

| | |
|---|---|
| **ID** | P0.5.2 |
| **Depends on** | — |
| **Status** | `done` |
| **App** | `apps/api` |
| **Files** | `src/main.ts`, `src/app.module.ts`, `nest-cli.json`, `webpack.config.js`, `.swcrc` |

**AC:**

- [x] Global prefix `api/v1`, Helmet, CORS, `ValidationPipe`
- [x] Swagger UI at `/docs`
- [x] Env validation (`src/config/env.schema.ts`, `.env.example`)
- [x] Vitest unit tests + e2e (`test/app.e2e-spec.ts`)
- [x] `pnpm dev:api` via Turborepo

---

## 0.5.3 Database layer (TypeORM)

| | |
|---|---|
| **ID** | P0.5.3 |
| **Depends on** | P0.5.2 |
| **Status** | `done` |
| **Files** | `apps/api/src/database/` |

**Entities:** `users`, `auth_sessions`, `sync_records` (JSONB payload + tombstones).

**AC:**

- [x] Postgres for local dev (`DATABASE_TYPE=postgres` in `.env.example`)
- [x] SQLite in-memory for tests (`DATABASE_TYPE=sqlite`)
- [ ] Production migrations (TypeORM `synchronize: false` + migration files) — before deploy

---

## 0.5.4 OpenAPI contract & typed client

| | |
|---|---|
| **ID** | P0.5.4 |
| **Depends on** | P0.5.2 |
| **Status** | `partial` |
| **Files** | `apps/api/scripts/export-openapi.ts`, `packages/api-contract/`, `packages/api-client/` |

**Pipeline:** `apps/api` openapi task → `packages/api-contract/openapi.json` → Orval → `packages/api-client/src/generated/**`

**AC:**

- [x] Turbo `openapi` + `generate` tasks in root `turbo.json`
- [x] `pnpm generate:api` script at repo root
- [x] Fetch mutator + `ApiQueryProvider` (`packages/api-client/src/`)
- [x] `AppApiProvider` in `apps/app` and `apps/marketing-web`
- [ ] Commit generated `openapi.json` + `src/generated/**` (or CI step that runs before typecheck)
- [ ] `setApiBaseUrl()` wired per environment (Expo `EXPO_PUBLIC_API_URL`, Next.js `NEXT_PUBLIC_API_URL`)

---

## 0.5.5 Health & guest auth API

| | |
|---|---|
| **ID** | P0.5.5 |
| **Depends on** | P0.5.3 |
| **Status** | `done` |
| **Files** | `apps/api/src/health/`, `apps/api/src/auth/` |

**Endpoints:**

| Method | Path | Status |
|--------|------|--------|
| `GET` | `/api/v1/health` | `done` |
| `POST` | `/api/v1/auth/guest` | `done` |
| `GET` | `/api/v1/auth/me` | `done` |
| `POST` | `/api/v1/auth/logout` | `done` |

**AC:**

- [x] Guest session create/resume by `deviceId`
- [x] Bearer token auth on protected routes
- [ ] JWT access tokens (replace UUID tokens) — P8.0.1
- [ ] Refresh token endpoint — P8.0.1

---

## 0.5.6 Sync API (server-side)

| | |
|---|---|
| **ID** | P0.5.6 |
| **Depends on** | P0.5.5 |
| **Status** | `done` |
| **Files** | `apps/api/src/sync/` |

**Endpoints:** `GET /api/v1/sync/pull?since=`, `POST /api/v1/sync/push`

**Strategy:** last-write-wins on `updatedAt`; returns `conflicts` array on push.

**AC:**

- [x] Guest accounts receive `403` on sync routes
- [x] Entity types: `prayer_log`, `zikr_progress`, `qaza_counter`, `user_preferences`, `favorite_zikr`
- [x] Unit tests for guest block + push conflict path
- [ ] E2e tests for full pull/push round-trip

---

# Phase 1 — Data layer and domain model

**Goal:** Offline-first persistence and a rich domain model. All tracking features depend on this.

## 1.1 Expand shared domain types

| | |
|---|---|
| **ID** | P1.1 |
| **Depends on** | P0 |
| **Status** | `todo` |
| **Files** | `packages/shared/src/types/*.ts`, re-export from `packages/shared/src/index.ts` |

**Add types:**

```ts
// Prayer
export type ObligatoryPrayer = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha" | "witr";
export type SunnahPrayer =
  | "tahajjud" | "ishraq" | "duha" | "tahiyyatul_masjid" | "hajat_istikhara";
export type PrayerStatus = "pending" | "completed" | "missed" | "delayed" | "qaza";

export interface PrayerLog {
  id: string;
  prayerId: ObligatoryPrayer | SunnahPrayer;
  date: string; // ISO date YYYY-MM-DD (user's local calendar day)
  status: PrayerStatus;
  notes?: string;
  updatedAt: string; // ISO datetime
  source: "manual" | "bulk_import" | "sync";
}

// Zikr
export type ZikrCategoryId =
  | "morning" | "evening" | "before_prayer" | "after_prayer"
  | "after_azan" | "before_sleep" | "anytime";

export interface ZikrItem {
  id: string;
  categoryId: ZikrCategoryId;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  virtues?: string;
  reference?: string;
  audioUri?: string;
  targetCount?: number; // daily target if applicable
}

export interface ZikrProgress {
  id: string;
  zikrId: string;
  date: string;
  count: number;
  target: number;
  completed: boolean;
}

// Qaza
export interface QazaCounter {
  prayerId: ObligatoryPrayer;
  remaining: number;
  completed: number;
}

export interface QazaDailyPlan {
  date: string;
  targets: Partial<Record<ObligatoryPrayer, number>>;
}

export interface QazaRozaCounter {
  remaining: number;
  completed: number;
  estimatedMissed?: number;
}

// User prefs (local; subset synced when logged in)
export interface UserPreferences {
  locale: "en" | "ar" | "ur";
  translationLocale: "en" | "ar" | "ur";
  bedtime?: string; // HH:mm
  notificationPrefs: NotificationPreferences;
  fontPrefs: FontPreferences;
  favoriteZikrIds: string[];
  favoriteZikrOrder: string[];
}

export interface DailySummary {
  date: string;
  salahCompleted: number;
  salahTotal: number;
  zikrCompleted: number;
  zikrTotal: number;
  qazaRemaining: number;
  qazaCompletedToday: number;
  streakDays: number;
}
```

**AC:**

- [ ] All types exported from `@munib-tracker/shared`
- [ ] Vitest type-level or runtime validator tests for key unions
- [ ] `PRAYER_NAMES` extended to include Witr; add `SUNNAH_PRAYER_NAMES` constant

---

## 1.2 Local database (SQLite)

| | |
|---|---|
| **ID** | P1.2 |
| **Depends on** | P1.1 |
| **Status** | `todo` |
| **Package** | `expo-sqlite` (~SDK 57 compatible) |
| **Files** | `apps/app/src/db/schema.ts`, `apps/app/src/db/migrations.ts`, `apps/app/src/db/client.ts` |

**Schema tables:**

| Table | Purpose |
|-------|---------|
| `prayer_logs` | One row per prayer × date (or per log entry) |
| `zikr_progress` | Daily counts per zikr |
| `qaza_counters` | Per-prayer remaining/completed |
| `qaza_daily_plans` | Serialized daily targets |
| `qaza_roza` | Fasting qaza counters |
| `user_preferences` | JSON blob or normalized columns |
| `sync_metadata` | `lastSyncedAt`, `pendingChanges` queue |

**AC:**

- [ ] DB initializes on first launch; migrations are versioned
- [ ] CRUD repositories: `PrayerRepository`, `ZikrRepository`, `QazaRepository`, `PreferencesRepository`
- [ ] Unit tests with in-memory SQLite or mocked driver
- [ ] Works offline with no network

---

## 1.3 App state layer

| | |
|---|---|
| **ID** | P1.3 |
| **Depends on** | P1.2 |
| **Status** | `todo` |
| **Package** | `zustand` (or React Context if keeping deps minimal — prefer zustand for scale) |
| **Files** | `apps/app/src/stores/tracker-store.ts`, `apps/app/src/stores/preferences-store.ts`, `apps/app/src/providers/app-providers.tsx` |

**Store responsibilities:**

- Load today's `DailySummary` from DB
- Optimistic updates on prayer toggle / zikr increment
- Expose selectors: `useTodayPrayers()`, `useQazaSummary()`, `useStreak()`

**AC:**

- [ ] `AppProviders` wraps root layout (theme + stores)
- [ ] Home and Tracker read from store — remove all hardcoded stats
- [ ] Jest tests for store actions and selectors

---

## 1.4 Date and streak utilities

| | |
|---|---|
| **ID** | P1.4 |
| **Depends on** | P1.1 |
| **Status** | `todo` |
| **Files** | `packages/shared/src/utils/streak.ts`, `packages/shared/src/utils/date.ts` |

**Functions:**

- `getLocalDateString(date?: Date): string` — user's timezone
- `computeStreak(prayerLogs: PrayerLog[], obligatoryOnly?: boolean): number`
- `buildDailySummary(...)` — aggregate for dashboard

**AC:**

- [ ] Vitest coverage for streak edge cases (missed day resets, same-day multiple updates)
- [ ] Used by dashboard (Phase 2)

---

# Phase 2 — Prayer tracking (MVP)

**Goal:** Track obligatory and sunnah prayers with statuses; drive dashboard from real data.

## 2.1 Daily prayer tracker screen

| | |
|---|---|
| **ID** | P2.1 |
| **Depends on** | P1.3 |
| **Status** | `todo` |
| **Route** | `apps/app/src/app/tracker/prayers.tsx` (or extend `tracker.tsx` with sections) |

**Obligatory prayers:** Fajr, Dhuhr, Asr, Maghrib, Isha, Witr.

**Sunnah / optional prayers:** Tahajjud, Ishraq, Duha, Tahiyyatul Masjid, Salatul Hajat & Istikhara.

**Per-prayer actions:**

| Status | Behavior |
|--------|----------|
| Completed | Mark done for today |
| Missed | Increment qaza counter (Phase 4 hook) |
| Delayed | Flag only; still due today |
| Qaza | Mark as qaza performed today |
| Notes | Optional text field (modal or inline) |

**UI:** Reuse `TrackerRow`; add status picker (sheet or segmented control). Use `useTheme()` colors for status chips.

**AC:**

- [ ] All obligatory prayers listed with current status for today
- [ ] Sunnah prayers in collapsible section
- [ ] Status persists across app restart
- [ ] Changing to `missed` creates/updates qaza counter (delegate to P4.1)
- [ ] Feature test: toggle Fajr completed → dashboard updates

---

## 2.2 Dashboard — today's progress

| | |
|---|---|
| **ID** | P2.2 |
| **Depends on** | P2.1, P1.4 |
| **Status** | `todo` |
| **File** | `apps/app/src/app/index.tsx` |

**Display:**

- Completed / remaining obligatory prayers today
- Today's zikr count (placeholder `0/N` until Phase 3)
- Streak calendar snippet (mini heatmap or week row — full calendar in P5)
- Qaza summary cards (placeholder until Phase 4)

**AC:**

- [ ] `StatCard` values from `DailySummary`, not literals
- [ ] Pull-to-refresh recalculates summary
- [ ] Empty state for first-time user

---

## 2.3 Prayer notes

| | |
|---|---|
| **ID** | P2.3 |
| **Depends on** | P2.1 |
| **Status** | `todo` |
| **Files** | `apps/app/src/components/prayer-notes-modal.tsx` |

**AC:**

- [ ] Optional notes per prayer per day; max 500 chars
- [ ] Notes visible in history detail (P5)

---

# Phase 3 — Zikr and Tasbeeh (MVP)

**Goal:** Seed zikr library, daily progress, favorites, and tasbeeh counter.

## 3.1 Zikr content seed

| | |
|---|---|
| **ID** | P3.1 |
| **Depends on** | P1.1 |
| **Status** | `todo` |
| **Files** | `packages/shared/src/content/zikr/*.json` or `assets/content/zikr.json` bundled in app |

**Categories:**

- Morning Adhkar, Evening Adhkar, Before Prayer, After Prayer, After Azan, Before Sleep, Anytime Zikr, View All

**Each item fields:** title, arabic, transliteration, translation, virtues, reference, audioUri (optional), targetCount.

**AC:**

- [ ] At least 3 items per category for MVP (expand later)
- [ ] Import script or static JSON loaded at startup into DB or memory
- [ ] Content version field for future updates

---

## 3.2 Zikr library UI

| | |
|---|---|
| **ID** | P3.2 |
| **Depends on** | P3.1, P1.3 |
| **Status** | `todo` |
| **Routes** | `apps/app/src/app/zikr/index.tsx`, `apps/app/src/app/zikr/[category].tsx`, `apps/app/src/app/zikr/[id].tsx` |

**Detail screen:** Arabic, transliteration, translation, virtues, reference, favorite toggle, share, "Open in Tasbeeh" CTA.

**AC:**

- [ ] Category list matches PRD categories
- [ ] RTL layout for Arabic text
- [ ] Share uses `expo-sharing` or `Share` API with formatted text

---

## 3.3 Favorite zikrs

| | |
|---|---|
| **ID** | P3.3 |
| **Depends on** | P3.2, P1.2 |
| **Status** | `todo` |
| **Files** | `apps/app/src/app/zikr/favorites.tsx` |

**Guest and logged-in users** can add, remove, reorder favorites (stored locally; sync in P8).

**AC:**

- [ ] Drag-to-reorder (e.g. `react-native-draggable-flatlist` or manual up/down)
- [ ] Favorites section on zikr home

---

## 3.4 Daily zikr progress

| | |
|---|---|
| **ID** | P3.4 |
| **Depends on** | P3.2, P1.3 |
| **Status** | `todo` |
| **Integration** | Tracker tab + dashboard |

**Per category today:** completed count, remaining count (from targets).

**AC:**

- [ ] Progress survives restart
- [ ] Dashboard zikr stat reflects real totals

---

## 3.5 Tasbeeh counter

| | |
|---|---|
| **ID** | P3.5 |
| **Depends on** | P3.2 |
| **Status** | `todo` |
| **Route** | `apps/app/src/app/tasbeeh/[zikrId].tsx`, `apps/app/src/app/tasbeeh/free.tsx` |
| **Packages** | `expo-haptics`, `expo-av` (optional sound) |

**Modes:** 33, 99, 100, unlimited, custom count.

**Controls:** tap anywhere, +, −, reset.

**Feedback:** haptic, sound, disable both in settings.

**Themes (counter styles):** Traditional, Simple, Minimal, Large Buttons.

**Backgrounds:** Makkah, Madinah, Islamic patterns, zikr text overlay, solid colors (from theme).

**Open Tasbeeh mode:** Free counter for custom dhikr text (no library item).

**AC:**

- [ ] Counter persists session count; optional daily progress per zikr
- [ ] Reaches target → visual completion state
- [ ] Works on iOS, Android, Web (haptics no-op on web)

---

# Phase 4 — Qaza management

**Goal:** Counters, lifetime calculator, daily planner, and roza tracking.

## 4.1 Per-prayer qaza counters

| | |
|---|---|
| **ID** | P4.1 |
| **Depends on** | P1.2, P2.1 |
| **Status** | `todo` |
| **Route** | `apps/app/src/app/qaza/index.tsx` |

**Prayers:** Fajr, Dhuhr, Asr, Maghrib, Isha, Witr.

**Display:** remaining, completed; manual +/- adjustments.

**AC:**

- [ ] Marking prayer `missed` auto-increments remaining
- [ ] Marking qaza performed decrements remaining, increments completed
- [ ] Manual adjustment with confirmation dialog

---

## 4.2 Qaza calculator (Qaza-e-Umri)

| | |
|---|---|
| **ID** | P4.2 |
| **Depends on** | P4.1 |
| **Status** | `todo` |
| **Route** | `apps/app/src/app/qaza/calculator.tsx` |

**Inputs:** age, puberty age, years prayed consistently, optional adjustments.

**Outputs:** total missed estimate, remaining after completed qaza.

**AC:**

- [ ] Formula documented in code comments and `packages/shared` util
- [ ] User can apply result to counters (with confirm)
- [ ] Disclaimer UI — estimate only, consult scholar

---

## 4.3 Qaza planner

| | |
|---|---|
| **ID** | P4.3 |
| **Depends on** | P4.1 |
| **Status** | `todo` |
| **Route** | `apps/app/src/app/qaza/planner.tsx` |

**Schedule daily targets per prayer** (e.g. 2 Fajr, 2 Dhuhr, …, remaining Isha).

**Display:** daily target, remaining target, estimated completion date.

**AC:**

- [ ] Editing plan recalculates ETA
- [ ] Dashboard qaza card shows daily target + ETA
- [ ] Optional link to qaza reminder (P9)

---

## 4.4 Qaza roza (fasting)

| | |
|---|---|
| **ID** | P4.4 |
| **Depends on** | P1.2 |
| **Status** | `todo` |
| **Route** | `apps/app/src/app/qaza/roza.tsx` |

**Track:** total missed, completed, remaining fasts.

**Calculator:** estimate missed Ramadan fasts → apply to counter.

**AC:**

- [ ] Separate from prayer qaza counters
- [ ] Shown in statistics (P5)

---

# Phase 5 — Calendar, history, and statistics

**Goal:** Unified calendar/history views, adjustments, and charts. Merges original "Prayer History" and "Prayer Calendar" specs.

## 5.1 Activity calendar

| | |
|---|---|
| **ID** | P5.1 |
| **Depends on** | P2.1, P3.4, P4.1 |
| **Status** | `todo` |
| **Route** | `apps/app/src/app/calendar/index.tsx` |
| **Package** | `react-native-calendars` or custom FlashList month grid |

**Views:** daily, weekly, monthly, yearly.

**Day indicators:** completed prayers, missed, qaza performed, zikr completion level.

**AC:**

- [ ] Tap day → day detail sheet
- [ ] Streak calendar on dashboard links here
- [ ] Theme-aware day colors

---

## 5.2 History detail and adjustments

| | |
|---|---|
| **ID** | P5.2 |
| **Depends on** | P5.1 |
| **Status** | `todo` |
| **Route** | `apps/app/src/app/calendar/[date].tsx` |

**Allow:** +/- adjustments, counter updates for past days.

**Rule:** No history row creation for `bulk_import` source (flag only; used in P8).

**AC:**

- [ ] Audit trail: `updatedAt` on changes
- [ ] Cannot create future-dated logs beyond today

---

## 5.3 Statistics and charts

| | |
|---|---|
| **ID** | P5.3 |
| **Depends on** | P5.1 |
| **Status** | `todo` |
| **Route** | `apps/app/src/app/statistics/index.tsx` |
| **Package** | `victory-native` or `react-native-gifted-charts` (evaluate bundle size) |

**Totals:**

| Domain | Metrics |
|--------|---------|
| Prayer | completed, missed |
| Qaza | remaining, completed |
| Roza | remaining, completed |
| Zikr | per category completed / remaining |

**Charts:** daily, weekly, monthly, yearly toggles.

**AC:**

- [ ] Data matches DB aggregates
- [ ] Accessible labels and theme colors
- [ ] Web renders charts (or graceful fallback table)

---

# Phase 6 — Content libraries and audio

**Goal:** 99 Names, Duroods, Dua library, and one global audio player.

## 6.1 Global audio player

| | |
|---|---|
| **ID** | P6.1 |
| **Depends on** | — |
| **Status** | `todo` |
| **Package** | `expo-audio` or `expo-av` (SDK 57) |
| **Files** | `apps/app/src/providers/audio-player-provider.tsx`, `apps/app/src/components/audio/mini-player.tsx` |

**Controls:** play, pause, seek, previous, next, speed (0.5×, 1×, 1.5×, 2×).

**Sources:** zikr, dua, Quran verses, Names of Allah, duroods.

**AC:**

- [ ] Single player instance; mini-player persists across navigation
- [ ] Background audio on iOS/Android where permitted
- [ ] Speed persists in preferences

---

## 6.2 Names of Allah (99)

| | |
|---|---|
| **ID** | P6.2 |
| **Depends on** | P6.1, P3.1 |
| **Status** | `todo` |
| **Route** | `apps/app/src/app/names-of-allah/index.tsx` |
| **Content** | `packages/shared/src/content/names-of-allah.json` |

**Per name:** arabic, translation, transliteration, audio.

**Actions:** play individual, play all (queue in global player).

**AC:**

- [ ] List + detail views
- [ ] Play all builds playlist in audio provider

---

## 6.3 Duroods / Salawat library

| | |
|---|---|
| **ID** | P6.3 |
| **Depends on** | P6.1 |
| **Status** | `todo` |
| **Route** | `apps/app/src/app/duroods/` |

**Fields:** title, arabic, audio, transliteration, translation, virtues, references.

**AC:**

- [ ] Same detail pattern as zikr library
- [ ] Share support

---

## 6.4 Dua library

| | |
|---|---|
| **ID** | P6.4 |
| **Depends on** | P6.1 |
| **Status** | `todo` |
| **Route** | `apps/app/src/app/dua/` |

**Categories:** Sunnah Duas, Quranic Duas, Daily Duas, View All.

**Fields:** same as duroods.

**AC:**

- [ ] Category navigation consistent with zikr library
- [ ] Favorites optional stretch (reuse P3.3 pattern)

---

# Phase 7 — Settings and personalization

**Goal:** Notifications prefs UI, bedtime, fonts, language, custom accent (extend existing settings).

## 7.1 Settings navigation structure

| | |
|---|---|
| **ID** | P7.1 |
| **Depends on** | P0.2 |
| **Status** | `partial` |
| **File** | `apps/app/src/app/settings.tsx` → split into `settings/_layout.tsx` + sections |

**Sections:** Appearance (existing), Notifications, Bedtime, Fonts, Language, About (link P11).

**AC:**

- [ ] Settings index with navigable rows
- [ ] Appearance section keeps current theme/accent behavior

---

## 7.2 Notification preferences (UI only until P9)

| | |
|---|---|
| **ID** | P7.2 |
| **Depends on** | P7.1, P1.2 |
| **Status** | `todo` |
| **Route** | `apps/app/src/app/settings/notifications.tsx` |

**Toggles:** prayer, qaza, morning/evening zikr, before/after prayer, before sleep, after azan, achievements.

**AC:**

- [ ] Toggles persist to `UserPreferences`
- [ ] Master enable/disable switch

---

## 7.3 Bedtime

| | |
|---|---|
| **ID** | P7.3 |
| **Depends on** | P7.1 |
| **Status** | `todo` |
| **Route** | `apps/app/src/app/settings/bedtime.tsx` |
| **Package** | `@react-native-community/datetimepicker` or `@expo/ui` picker |

**Used by:** before-sleep adhkar reminder (P9).

**AC:**

- [ ] Time picker stores `HH:mm` in preferences
- [ ] Sensible default (e.g. 22:30)

---

## 7.4 Font customization

| | |
|---|---|
| **ID** | P7.4 |
| **Depends on** | P7.1 |
| **Status** | `todo` |
| **Route** | `apps/app/src/app/settings/fonts.tsx` |
| **Packages** | `expo-font` + bundled Arabic fonts (e.g. Amiri, Scheherazade) |

**Scopes:** global, Arabic, translation, transliteration, titles — each font family + size (+ global color).

**AC:**

- [ ] Live preview on sample zikr/dua text
- [ ] Preferences apply across library screens
- [ ] Font loading with fallback

---

## 7.5 Internationalization (i18n)

| | |
|---|---|
| **ID** | P7.5 |
| **Depends on** | P7.1 |
| **Status** | `todo` |
| **Packages** | `expo-localization`, `i18next`, `react-i18next` |
| **Files** | `apps/app/src/i18n/{en,ar,ur}.json`, `apps/app/src/i18n/index.ts` |

**Languages:** English, Arabic, Urdu.

**Separate:** app UI language vs translation language for religious text.

**AC:**

- [ ] RTL layout when Arabic UI selected
- [ ] All user-facing strings use `t()` — no hardcoded English in new screens
- [ ] Language change without restart (hot reload acceptable in dev)

---

## 7.6 Custom accent color picker

| | |
|---|---|
| **ID** | P7.6 |
| **Depends on** | P0.2 |
| **Status** | `todo` |
| **Files** | `packages/theme/src/accents.ts`, settings appearance screen |

**Extend:** presets (existing 5) + custom hex picker.

**AC:**

- [ ] Custom color persists and passes through `resolveTheme()`
- [ ] Contrast validation for text on accent background

---

# Phase 8 — Authentication and cloud sync

**Goal:** Google, Apple, Facebook login; guest mode; end-to-end sync between `apps/app` and `apps/api`.

> **Decision (resolved):** Custom **NestJS API** at `apps/api` — not Supabase/Firebase. Server foundation is Phase 0.5; this phase completes OAuth, client wiring, and the app-side sync engine.

## 8.0 Server auth hardening

| | |
|---|---|
| **ID** | P8.0.1 |
| **Depends on** | P0.5.5 |
| **Status** | `todo` |
| **App** | `apps/api` |
| **Files** | `apps/api/src/auth/auth.service.ts`, `apps/api/src/auth/strategies/` (new) |

**Work:**

- Replace UUID bearer tokens with signed JWTs (`@nestjs/jwt` + `JWT_SECRET`)
- `POST /api/v1/auth/refresh` — rotate refresh tokens
- Real OAuth code exchange for Google, Apple, Facebook (not stub emails)
- Passport strategies or provider-specific SDKs

**AC:**

- [ ] OAuth returns real user email/name from provider
- [ ] Expired access token → 401; refresh flow works
- [ ] Provider env vars documented in `.env.example`
- [ ] E2e tests for OAuth mock + link guest flow

---

## 8.1 Client auth provider

| | |
|---|---|
| **ID** | P8.1 |
| **Depends on** | P1.2, P0.5.4, P0.5.5 |
| **Status** | `todo` |
| **Packages** | `expo-auth-session`, `expo-apple-authentication`, `@react-native-google-signin/google-signin` (or Expo AuthSession for all) |
| **Files** | `apps/app/src/providers/auth-provider.tsx`, `apps/app/src/app/(auth)/login.tsx` |

**Integrate with API:**

- `POST /api/v1/auth/guest` on first launch (pass `expo-device` id)
- `POST /api/v1/auth/oauth/:provider` after native OAuth
- `POST /api/v1/auth/link` when guest upgrades
- Use generated hooks from `@munib-tracker/api-client` where available

**AC:**

- [ ] Google, Apple, Facebook sign-in on iOS/Android (Facebook web-only ok on Expo web)
- [ ] Continue as Guest — calls API guest endpoint, stores tokens locally
- [ ] Auth state persists; secure token storage (`expo-secure-store`)
- [ ] `Authorization: Bearer` header set on API client mutator

---

## 8.2 Guest mode (client)

| | |
|---|---|
| **ID** | P8.2 |
| **Depends on** | P8.1 |
| **Status** | `todo` |

**Behavior:** Full offline features; no cloud sync (server returns 403); data local until account linked.

**AC:**

- [ ] Guest flag in auth context (`accountType === "guest"`)
- [ ] Upgrade path: link account without losing local data (merge strategy — push local SQLite to server after link)

---

## 8.3 Cloud sync (client engine)

| | |
|---|---|
| **ID** | P8.3 |
| **Depends on** | P8.1, P1.2, P0.5.6 |
| **Status** | `todo` |
| **Files** | `apps/app/src/sync/sync-engine.ts` |

**Sync entities:** `prayer_logs`, `zikr_progress`, `qaza_*`, `preferences`, `favorites` — map to API entity types in `sync.dto.ts`.

**Strategy:** last-write-wins with `updatedAt` + tombstones; queue offline changes in `sync_metadata` table (P1.2).

**API calls:** generated `sync` hooks → `GET /api/v1/sync/pull`, `POST /api/v1/sync/push`.

**AC:**

- [ ] Sync on app foreground and after login
- [ ] Handle `conflicts` array from push response
- [ ] Guest mode never calls sync
- [ ] Integration test: local change → push → pull on second device mock

---

# Phase 9 — Reminders and notifications

**Goal:** Local notifications; push when logged in. **Login required** for push per original PRD.

## 9.1 Notification infrastructure

| | |
|---|---|
| **ID** | P9.1 |
| **Depends on** | P7.2, P8.1 |
| **Status** | `todo` |
| **Package** | `expo-notifications` |
| **Files** | `apps/app/src/notifications/scheduler.ts`, `apps/app/src/notifications/handlers.ts` |

**AC:**

- [ ] Permission request flow with settings deep link
- [ ] Android channels per category
- [ ] In-app notification center screen (replace hardcoded bell badge)

---

## 9.2 Prayer and azan reminders

| | |
|---|---|
| **ID** | P9.2 |
| **Depends on** | P9.1 |
| **Status** | `todo` |
| **Package** | `adhan` or `adhan-extended` for prayer times (optional Phase 9b) |

**Types:** prayer reminder, missed prayer reminder, post-azan adhkar reminder.

**AC:**

- [ ] Respect notification toggles (P7.2)
- [ ] Snooze action (stretch)

---

## 9.3 Qaza and zikr reminders

| | |
|---|---|
| **ID** | P9.3 |
| **Depends on** | P9.1, P4.3, P7.3 |
| **Status** | `todo` |

**Qaza:** scheduled qaza reminder, missed qaza reminder.

**Zikr:** morning, evening, before/after prayer, before sleep (uses bedtime), missed zikr.

**AC:**

- [ ] Zikr reminders tied to category targets
- [ ] Qaza planner can set daily reminder time

---

# Phase 10 — Onboarding and achievements

## 10.1 Onboarding flow

| | |
|---|---|
| **ID** | P10.1 |
| **Depends on** | P8.2 |
| **Status** | `todo` |
| **Routes** | `apps/app/src/app/(onboarding)/splash.tsx`, `intro.tsx`, `permissions.tsx` |

**Splash:** app logo + loading animation (enhance existing `_layout.tsx` splash).

**Intro slides:** prayer tracking, qaza, zikr, tasbeeh, reminders, achievements.

**AC:**

- [ ] Shown once (`hasCompletedOnboarding` in preferences)
- [ ] Skip option
- [ ] Guest vs login choice at end (links P8)

---

## 10.2 Achievements system

| | |
|---|---|
| **ID** | P10.2 |
| **Depends on** | P5.3, P1.4 |
| **Status** | `todo` |
| **Files** | `packages/shared/src/achievements/definitions.ts`, `apps/app/src/app/achievements/index.tsx` |

**Periods:** daily, weekly, monthly, yearly.

**Types:** prayer completion, zikr completion, qaza milestones, streaks, consistency, special badges.

**AC:**

- [ ] Badge unlock on criteria met; persisted
- [ ] Social share image/card (`expo-sharing`)
- [ ] Optional achievement notification (P9)

---

# Phase 11 — Profile and about

## 11.1 Profile screen

| | |
|---|---|
| **ID** | P11.1 |
| **Depends on** | P8.1 |
| **Status** | `todo` |
| **Route** | `apps/app/src/app/profile/index.tsx` |

**Fields:** avatar, first/last/full name, email, auth provider.

**AC:**

- [ ] Avatar pick from gallery (`expo-image-picker`)
- [ ] Edit name; email read-only from provider
- [ ] Sign out / delete account actions

---

## 11.2 About screen

| | |
|---|---|
| **ID** | P11.2 |
| **Depends on** | P7.1 |
| **Status** | `todo` |
| **Route** | `apps/app/src/app/settings/about.tsx` |

**Content:** author, collaborators, contributors, duas for author/collaborators/marhumeen, content authenticity statement, app version (`expo-constants`), privacy policy, terms of service (links or markdown).

**AC:**

- [ ] Version matches `app.json`
- [ ] External links open in `expo-web-browser`

---

# Phase 12 — Qibla direction

| | |
|---|---|
| **ID** | P12.1 |
| **Depends on** | — |
| **Status** | `todo` |
| **Route** | `apps/app/src/app/qibla/index.tsx` |
| **Packages** | `expo-location`, `expo-sensors` (magnetometer), `adhan` for qibla bearing |

**Features:** compass UI, qibla direction arrow, distance to Kaaba, calibration instructions.

**AC:**

- [ ] Location permission flow
- [ ] Compass smoothing and north calibration help
- [ ] Web fallback: map or manual city picker

---

# Phase 13 — Post-MVP / future

**Do not start until Phases 1–12 are stable.**

| ID | Feature | Notes |
|----|---------|-------|
| P13.1 | Wear OS / Apple Watch | Companion app or Expo native module |
| P13.2 | Home screen widgets | `expo-widgets` when stable |
| P13.3 | Home screen quick actions | Deep links into tracker/tasbeeh |
| P13.4 | Cloud backup export | JSON/encrypted backup beyond sync |
| P13.5 | Ramadan mode | Special UI, fasting integration |
| P13.6 | Hajj & Umrah mode | Manasik checklists |
| P13.7 | Quran reading tracker | Separate module |
| P13.8 | Charity tracker | Sadaqah logs |
| P13.9 | Habit streaks (general) | Beyond worship |
| P13.10 | Munib AI assistant | LLM + Islamic guardrails |
| P13.11 | Smart recommendations | Based on missed worship patterns |

---

## Cross-cutting requirements

### Offline-first

| Requirement | Implementation |
|-------------|----------------|
| All tracking works offline | SQLite primary store (P1.2) |
| Content bundled | JSON in `packages/shared` or app assets |
| Sync when online | P8.3 client engine → `apps/api` sync routes (P0.5.6) |
| Audio offline | Download/cache optional stretch |

### Theming and accessibility

- All screens use `useTheme()` and `@munib-tracker/theme` tokens.
- Support dynamic type / font scaling where RN allows.
- Minimum touch target 44×44 pt.

### Testing expectations per phase

| Layer | Tool | Location |
|-------|------|----------|
| Shared utils | Vitest | `packages/shared/**/*.test.ts` |
| Theme | Vitest | `packages/theme/**/*.test.ts` |
| API services | Vitest + supertest | `apps/api/src/**/*.spec.ts`, `apps/api/test/*.ts` |
| Marketing site | Vitest + RTL | `apps/marketing-web/src/**/*.test.tsx` |
| API client | Vitest (after codegen) | `packages/api-client/**/*.test.ts` |
| Stores / features | Jest + RNL | `apps/app/src/**/*.test.tsx` |

### Suggested tab / navigation evolution

Current tabs: **Home**, **Tracker**, **Settings**.

Recommended as features land:

| Tab | Contents |
|-----|----------|
| Home | Dashboard (P2.2) |
| Tracker | Prayers, Zikr, Qaza sections or sub-tabs |
| Explore | Zikr/Dua/Duroods/Names libraries |
| Calendar | P5.1 (or stack from Home) |
| Settings | P7.1 |

Use `expo-router` groups: `(tabs)`, `(auth)`, `(onboarding)`.

---

## Execution order (quick reference)

| Order | Phase | Theme |
|-------|-------|-------|
| — | **Phase 0** | Product shell (done) |
| — | **Phase 0.5** | API + marketing + codegen (mostly done) |
| 1 | **Phase 1** | Data layer — blocks product features |
| 2 | **Phase 2** | Prayer tracking MVP |
| 3 | **Phase 3** | Zikr + Tasbeeh |
| 4 | **Phase 4** | Qaza management |
| 5 | **Phase 5** | Calendar + statistics |
| 6 | **Phase 6** | Content libraries + audio |
| 7 | **Phase 7** | Settings, i18n, fonts |
| 8 | **Phase 8** | Client auth + sync (server stub done in 0.5) |
| 9 | **Phase 9** | Notifications |
| 10 | **Phase 10** | Onboarding + achievements |
| 11 | **Phase 11** | Profile + about |
| 12 | **Phase 12** | Qibla |
| 13 | **Phase 13** | Post-MVP |

**Parallel work:** Phase 0.5 (API) and Phase 1 (local data) can proceed simultaneously. Phase 8 client work needs both P1.2 and P0.5.4+.

---

## Open decisions (resolve before implementation)

| # | Decision | Options | Status | Blocks |
|---|----------|---------|--------|--------|
| D1 | Backend for auth/sync | ~~Supabase · Firebase~~ · **NestJS (`apps/api`)** | **Resolved** | P8.0.1, P8.1 |
| D2 | Prayer times source | Manual only · `adhan` + location · API | Open | P9.2 |
| D3 | State management | Zustand · Redux Toolkit · Context | Open | P1.3 |
| D4 | Chart library | victory-native · gifted-charts · WebView | Open | P5.3 |
| D5 | Content authoring | JSON in repo · CMS later | Open | P3.1, P6 |
| D6 | API URL per environment | Expo public env · build-time config · dev proxy | Open | P0.5.4 |

---

## Appendix A — Route map (target)

```
apps/app/src/app/
├── _layout.tsx
├── (tabs)/
│   ├── index.tsx              # Home dashboard
│   ├── tracker.tsx            # Tracker hub
│   ├── explore.tsx            # Libraries hub (optional)
│   └── settings.tsx
├── (auth)/
│   └── login.tsx
├── (onboarding)/
│   └── intro.tsx
├── tracker/
│   └── prayers.tsx
├── zikr/
│   ├── index.tsx
│   ├── [category].tsx
│   ├── [id].tsx
│   └── favorites.tsx
├── tasbeeh/
│   ├── [zikrId].tsx
│   └── free.tsx
├── qaza/
│   ├── index.tsx
│   ├── calculator.tsx
│   ├── planner.tsx
│   └── roza.tsx
├── calendar/
│   ├── index.tsx
│   └── [date].tsx
├── statistics/
│   └── index.tsx
├── names-of-allah/
│   └── index.tsx
├── duroods/
├── dua/
├── qibla/
│   └── index.tsx
├── achievements/
│   └── index.tsx
├── profile/
│   └── index.tsx
└── settings/
    ├── notifications.tsx
    ├── bedtime.tsx
    ├── fonts.tsx
    └── about.tsx
```

---

## Appendix B — Package checklist (install as needed)

| Package | Phase | App | Purpose |
|---------|-------|-----|---------|
| `expo-sqlite` | P1 | app | Local DB |
| `zustand` | P1 | app | State |
| `expo-haptics` | P3 | app | Tasbeeh feedback |
| `expo-av` / `expo-audio` | P6 | app | Playback |
| `expo-localization`, `i18next` | P7 | app | i18n |
| `expo-auth-session`, `expo-apple-authentication` | P8 | app | OAuth |
| `expo-secure-store` | P8 | app | Tokens |
| `expo-notifications` | P9 | app | Reminders |
| `expo-location`, `expo-sensors` | P12 | app | Qibla |
| `adhan` | P9/P12 | app | Prayer times / qibla |
| `react-native-calendars` | P5 | app | Calendar UI |
| `expo-image-picker` | P11 | app | Avatar |
| `expo-sharing` | P3/P10 | app | Share |
| `@nestjs/jwt`, `@nestjs/passport` | P8.0.1 | api | JWT auth |
| `passport-google-oauth20`, etc. | P8.0.1 | api | OAuth strategies |
| `orval` | P0.5.4 | api-client | Codegen (devDep, installed) |
| `@tanstack/react-query` | P0.5.4 | app, marketing-web | API hooks (installed) |

Install from repo root: `pnpm --filter <app> add <package>`

---

## Appendix C — API route map (`apps/api`)

Base URL: `http://localhost:3001/api/v1` (dev). OpenAPI: `http://localhost:3001/docs`.

| Method | Path | Auth | Status | Module |
|--------|------|------|--------|--------|
| `GET` | `/health` | — | `done` | health |
| `POST` | `/auth/guest` | — | `done` | auth |
| `POST` | `/auth/oauth/:provider` | — | `partial` | auth |
| `POST` | `/auth/link` | Bearer | `partial` | auth |
| `GET` | `/auth/me` | Bearer | `done` | auth |
| `POST` | `/auth/logout` | Bearer | `done` | auth |
| `POST` | `/auth/refresh` | — | `todo` | auth |
| `GET` | `/sync/pull` | Bearer (non-guest) | `done` | sync |
| `POST` | `/sync/push` | Bearer (non-guest) | `done` | sync |

Regenerate client after API changes: `pnpm generate:api`

---

*End of phased PRD.*
