# Munib Tracker — New Features TODO

> **Purpose:** The **active roadmap** for Munib Tracker — product enhancements beyond the shipped MVP baseline in [`docs/TODO.md`](./TODO.md) (whose Phases 0–12 are all `done`). Each item is written as a **complete, self-contained flow**: problem → key files → numbered implementation steps → acceptance criteria, all grounded in real symbols so an AI agent (or developer) can execute it without re-discovering the codebase.
>
> **How to use:** Pick an item, read its **Flow** top-to-bottom, and follow the numbered steps. Every step names a real file/symbol (verified against the source — see **Verified codebase facts** below). Honor the **Implementation rules** and finish on the **Lint / test gates**. When in doubt about the shipped architecture, the project memory covers each subsystem (data layer, content library, weather/location/times, retention/personalization, i18n, search, SEO).
>
> **Last reviewed:** 2026-07-08  
> **Apps:** `apps/app` (Expo SDK 57) · `apps/marketing-web` (Next.js 16) · `apps/api` (NestJS 11)  
> **Agent guides:** [`AGENTS.md`](../AGENTS.md), [`apps/app/AGENTS.md`](../apps/app/AGENTS.md), [`apps/marketing-web/AGENTS.md`](../apps/marketing-web/AGENTS.md), [`apps/api/AGENTS.md`](../apps/api/AGENTS.md)

---

## Status at a glance (updated 2026-07-08)

**Every software-achievable item is shipped.** All P0 (8), all P1 (24), and all P2 that don't need a native module or an external dataset are `done`, greenfield, en/ar/ur, with gates green (shared 100 + app 315 tests, full-repo Biome clean, app/shared/api `check-types` clean). The only open items are blocked on a new native dependency or a bundled dataset — see ⛔ below.

Legend: ✅ done · ⛔ blocked (needs a native dep or an external dataset — deliberately not fabricated).

| ID | Feature | Status | Note |
|----|---------|--------|------|
| NF-0.1 | Calc-method picker | ✅ | Location screen Sheet + reschedule |
| NF-0.2 | Asr madhab picker | ✅ | |
| NF-0.3 | Manual sync + status UI | ✅ | `syncNow()` outcome + `readSyncMetadata()` |
| NF-0.4 | Expanded sync entities | ✅ | 7 blob-LWW entities (achievements pure-derived, not synced) |
| NF-0.5 | Adhan-at-prayer notification | ✅ | Pref + Android channel + iOS sound; verified on EAS dev build |
| NF-0.6 | Juz browser | ✅ | `/quran/juz` |
| NF-0.7 | Durood/Name search + favorites | ✅ | `createFavoritesStore` factory |
| NF-0.8 | Bulk prayer import | ✅ | `parsePrayerImport` + `/settings/import` |
| NF-1.1 | Ramadan mode | ✅ | `lib/ramadan.ts`, fasting store, `/ramadan` |
| NF-1.2 | Hayd / excused mode | ✅ | streak freezes across excused days |
| NF-1.3 | Travel guide (Qasr/Jam') | ✅ | `/travel` |
| NF-1.4 | Sick / unable mode | ✅ | day-excused via `ExcusedDayPicker` |
| NF-1.5 | Jama' flag | ✅ | PrayerLog `isJama` + toggle |
| NF-1.6 | Weekly worship report | ✅ | `buildWeeklyReport`, in-app once/week |
| NF-1.7 | Per-prayer reminder offsets | ✅ | `/settings/reminder-offsets` |
| NF-1.8 | Khatm / reading plan | ✅ | `lib/khatm.ts` + `/quran/khatm` |
| NF-1.9 | Hifz tracker (lite) | ✅ | `/quran/hifz` |
| NF-1.10 | Tafsir on-demand | ✅ | remote edition via existing pipeline |
| NF-1.11 | Mushaf page view | ⛔ | needs the 604-page boundary dataset (build-data) |
| NF-1.12 | More translations & reciters | ✅ | expanded + documented in `FREE_OPEN_SOURCE_DATA.md` |
| NF-1.13 | Side-by-side translations | ✅ | `secondaryTranslationId` pref |
| NF-1.14 | Offline download manager | ✅ | `/settings/offline-data` |
| NF-1.15 | Qaza history log | ✅ | `/qaza/history` |
| NF-1.16 | Smart planner suggestions | ✅ | `suggestDailyQazaTargets` |
| NF-1.17 | Unified debt dashboard | ✅ | prayer + roza in `QazaSummaryCard` |
| NF-1.18 | Native home-screen widgets | ✅ | WidgetKit + Android App Widget via EAS; `lib/widget-data.ts` + `docs/NATIVE_WIDGETS.md` |
| NF-1.19 | Live Activities (iOS) | ✅ | `modules/munib-live-activity` + ActivityKit; verified on EAS dev build |
| NF-1.20 | Local backup export/import | ✅ | `lib/backup.ts` + `/settings/backup` |
| NF-1.21 | Customizable home modules | ✅ | `hiddenHomeModules` + `/settings/home` |
| NF-1.22 | Library tab (4th tab) | ✅ | `lib/library-menu.ts` |
| NF-1.23 | Customizable quick actions | ✅ | `quickActionOrder` |
| NF-1.24 | Daily content notification | ✅ | opens `/hadith/daily` |
| NF-1.25 | Friday reminders | ✅ | Jumu'ah nudge |
| NF-1.26 | Adhan style picker | ✅ | picker + pref + bundled adhan styles |
| NF-1.29 | Accessibility audit | ✅ | reduced-motion app-wide, labelled controls |
| NF-1.30 | App-icon quick actions | ✅ | `expo-quick-actions`; verified on iOS + Android dev builds |
| NF-1.31 | Arabic font family picker | ✅ | resolver + picker + OFL fonts in `assets/fonts/` |
| NF-1.32 | In-context reading font size | ✅ | `ReadingFontControls`, `readingOverrides` |
| NF-1.33 | Salah guide | ✅ | `content/salah-guide.ts` + `/salah-guide` |
| NF-2.1 | Islamic events calendar | ✅ | `lib/islamic-events.ts` + `/events` |
| NF-2.2 | Zakat / sadaqah tracker | ✅ | `lib/zakat.ts` + `/zakat` |
| NF-2.3 | Hajj & Umrah checklist | ✅ | `content/hajj-guide.ts` + `/hajj` |
| NF-2.4 | Seerah timeline | ✅ | `content/seerah.ts` + `/seerah` |
| NF-2.7 | Word-by-word Qur'an | ⛔ | needs the large word-by-word dataset |
| NF-2.8 | Hadith sharh / explanation | ⛔ | needs bundled/linked explanation data |
| NF-2.9 | Narrator chain display | ⛔ | needs isnad data on `HadithItem` |
| NF-2.10 | Daily hadith series | ✅ | `lib/daily-hadith.ts` + `/hadith/daily` |
| NF-2.11 | Custom adhkar builder | ✅ | `custom-adhkar-store` + `/adhkar-builder` |
| NF-2.12 | Prayer journal / khushu rating | ✅ | `khushu-store` + `/journal` |
| NF-2.13 | Tahajjud dedicated streak | ✅ | `computePrayerStreak` + `/tahajjud` |
| NF-2.14 | Apple Watch / Wear OS | ✅ | `targets/munib-tracker-watch` + `modules/munib-wear` + Wear tile via `withWearOs.cjs` |
| NF-2.15 | Siri / Assistant shortcuts | ✅ | `targets/munib-tracker-intents` + `external-commands` + `withExternalCommands.cjs` |
| NF-2.17 | App lock (PIN / biometrics) | ⛔ | needs `expo-local-authentication` (new native dep) |
| NF-2.19 | Sync conflict resolution UI | ✅ | SyncMetadata outcome + profile merge summary |
| NF-2.20 | Prayer time manual offset | ✅ | `/settings/prayer-tuning`, per-prayer minutes |
| NF-2.21 | High-latitude rule override | ✅ | `/settings/prayer-tuning`, `PrayerCalcExtras` |
| NF-2.23 | Seasonal themes | ✅ | `lib/seasonal-themes.ts` (Ramadan/Hajj accents) |
| NF-2.24 | In-app feature tours | ✅ | `lib/feature-tours.ts` + `/tour` |

_Removed earlier (not implemented, out of scope): NF-1.27, NF-1.28, NF-2.5, NF-2.6, NF-2.16, NF-2.18, NF-2.22, NF-2.25, NF-2.26._

---

## Document conventions

| Field | Meaning |
|-------|---------|
| **ID** | Stable task identifier (e.g. `NF-1.1`). Reference in commits/PRs. |
| **Priority** | `P0` (gap in shipped feature) · `P1` (should do) · `P2` (may do) |
| **Scope** | `app` · `api` · `shared` · `marketing` · `multi` |
| **Depends on** | Task IDs that must be done first. |
| **Status** | `todo` · `partial` · `done` |
| **AC** | Acceptance criteria — all must pass before marking complete. |

**Implementation rules (all tasks):**

- Read Expo SDK 57 docs before native work: https://docs.expo.dev/versions/v57.0.0/
- **Theming:** use `useTheme()` / `useThemeTokens()` — no hardcoded colors (`apps/app/src/providers/theme-provider.tsx`).
- **Domain:** types, constants, validators → `@munib-tracker/shared` (`packages/shared/src/`).
- **Design tokens:** `@munib-tracker/theme`; app layout/spacing → `apps/app/src/constants/theme.ts`.
- **Screens:** Expo Router file routes under `apps/app/src/app/`; reuse `ScreenLayout`, `Card`, `Stagger`, `SectionHeader`.
- **State:** zero-dep `useSyncExternalStore` stores via `createStore` (`apps/app/src/stores/create-store.ts`, Zustand-like but no dependency); persist via repositories in `apps/app/src/db/`. Action hooks return a stable singleton — don't subscribe to them.
- **New persisted data:** add a key to `apps/app/src/db/keys.ts` (`DB_KEYS`), a repository in `apps/app/src/db/repositories/` (use `readJSON`/`writeJSON`/`withKeyLock`), export it from `apps/app/src/db/index.ts`, **and register the key in `resetDatabase()`** so account deletion clears it.
- **i18n:** add strings to `apps/app/src/i18n/{en,ar,ur}.json` for every user-facing label.
- **Search:** extend `apps/app/src/lib/search.ts` — do not add standalone `new Fuse()` in screens (see [`apps/app/AGENTS.md`](../apps/app/AGENTS.md) and `.agents/skills/fuse-js/SKILL.md`).
- **Audio:** reuse `useAudioPlayerContext()` from `apps/app/src/providers/audio-player-provider.tsx` — build `AudioTrack[]`, call `play()`.
- **Notifications:** extend `apps/app/src/lib/notifications/build-reminders.ts` + `apps/app/src/notifications/scheduler.ts`; reschedule via `rescheduleAll()` after pref changes.
- **Prayer times:** `adhan` library via `apps/app/src/lib/prayer-times.ts`; location in `apps/app/src/lib/location.ts` + `location-store.ts`.
- **API / sync:** NestJS in `apps/api/src/`; OpenAPI → `pnpm generate:api`; client sync in `apps/app/src/sync/`; read [`.agents/skills/nestjs/SKILL.md`](../.agents/skills/nestjs/SKILL.md) before backend work.
- **Lint / test gates:** `pnpm format-and-lint:fix` · `pnpm --filter app check-types` · `pnpm --filter app test` · `pnpm --filter api test` (when API touched).

**Useful skills by area:**

| Area | Skill |
|------|-------|
| Expo UI, Router, native tabs | `.agents/skills/building-native-ui/SKILL.md` |
| Notifications, widgets | `.agents/skills/expo/skills` (SDK 57 docs) |
| Fuzzy search | `.agents/skills/fuse-js/SKILL.md` |
| Network / React Query | `.agents/skills/native-data-fetching/SKILL.md` |
| NestJS sync/API | `.agents/skills/nestjs/SKILL.md` |
| EAS build / widgets | `.agents/skills/expo-deployment/SKILL.md` |
| Content ingestion | [`docs/DATA_INGESTION_TODO.md`](./DATA_INGESTION_TODO.md), [`docs/FREE_OPEN_SOURCE_DATA.md`](./FREE_OPEN_SOURCE_DATA.md) |

---

## Verified codebase facts (build on these — don't re-discover)

Confirmed by reading the source (2026-07-05). Reuse these exact symbols in the flows below.

**Stores & actions (hooks):**
- Preferences — `usePreferences()` → `UserPreferences`; `usePreferencesActions()` → `update(patch)`, `setNotificationPrefs(patch)`, `setPrayerAlert(prayerId, enabled)`. Persisted via `PreferencesRepository`.
- Location — `useLocation()` → `StoredLocation`; `useLocationActions()` → `requestDeviceLocation()`, `setManualLocation(place)`, `setMethod(key)`, `setMadhab(key)`; `useLocationStatus()`. Persisted via `LocationRepository` (`setMethod`/`setMadhab` already exist and persist — they just have **no UI**).
- Auth — `useAuth()` → `{ user, isAuthenticated, isGuest, syncNow(), signOut() }`. **`syncNow()` already exists on the context** (runs on sign-in + foreground); it is simply not surfaced in the UI. Account deletion calls `resetDatabase()` in `profile/index.tsx`.

**Types (all in `packages/shared/src/types/`):**
- `NotificationPreferences` = `{ masterEnabled, prayer, sunnahPrayer, qaza, morningZikr, eveningZikr, beforePrayer, afterPrayer, beforeSleep, afterAzan, achievements }` — all default **off** (`masterEnabled: false`).
- `UserPreferences` also carries `prayerAlerts?: Partial<Record<PrayerId, boolean>>` (per-prayer overrides), `fontPrefs`, `weatherPrefs`, `timeFormat`, `bedtime`, `customAccent`, `audioSpeed/Volume`, `updatedAt`.
- `FontPreferences` = `{ global, arabic, translation, transliteration, titles: FontScopePrefs, color? }`, where `FontScopePrefs = { family?: string; size?: number }`. **`fontPrefs.arabic.family` already exists in the type but has no UI and is not read anywhere.**
- `PrayerLogSource = "manual" | "bulk_import" | "sync"` (`types/prayer.ts`).
- `CalculationMethodKey = keyof typeof CalculationMethod` (adhan), `MadhabKey = "shafi" | "hanafi"`, `DEFAULT_CALCULATION_METHOD = "MuslimWorldLeague"`, `DEFAULT_MADHAB = "shafi"` (all in `lib/prayer-times.ts`).

**Cloud sync — actual entities** (`sync/records.ts` `buildSyncRecords()` + API `SYNC_ENTITIES` in `apps/api/src/sync/dto/sync.dto.ts`): `prayer_logs`, `zikr_progress`, **`qaza_entries`** (not "qaza_counter"), `preferences`, `favorites` (zikr favorites only). `LocalSnapshot` is the client input; LWW on `updatedAt` + tombstones (`TombstoneRepository`). `DB_KEYS.syncMetadata` holds `lastSyncedAt`/`lastPushedAt`.

**Notifications:** `lib/notifications/build-reminders.ts` `buildReminders(prefs, location)` already schedules from **real computed `adhan` times** (`computePrayerTimes`/`prayerReminderTime`/`witrTime`), 7 days ahead; `notifications/scheduler.ts` `rescheduleAll(prefs, location)` is called from `settings/notifications.tsx` after every toggle. `PRAYER_TIME_HINTS` (`lib/prayer-ui.ts`) is **UI-only**, never used for scheduling. `lib/adhan-audio.ts` bundles one clip (`ADHAN_STYLES = [{ id: "default" }]`, `adhanTrack()`); preview-only today.

**Qur'an:** `JUZ_STARTS` (30 juz start `surah:ayah`) + a per-ayah `juz` field exist in `lib/quran.ts`, but `juzForAyah()` is **module-private** — export a helper/`JUZ_STARTS` to build a Juz index. `quran/[surah].tsx` still uses **hardcoded** `fontSize: 26` (arabic) / `24` (bismillah) — not wired to `fontPrefs`. `reading-card.tsx` DOES read `fontPrefs.arabic.size` / `fontPrefs.translation.size`.

**Reusable UI primitives** (`components/ui/`): `SegmentedControl<T>` (`options=[{id,label}] value onChange` — used in `settings/fonts.tsx`; good for 2–4 options, not long lists), `Sheet` (`variant: "center" | "bottom"`), `NavRow`, `SectionHeader`, `Stepper`, `IconButton` (≥44pt), `Card`, `Stagger`, `ScreenLayout`, `AppHeader` (all `onBack`-aware). Settings rows: `ToggleRow` + `SettingsRow` live in `components/settings/settings-rows.tsx` (not in `ui/`). `ConfirmDialog` for destructive actions. Arabic OFL fonts live in `assets/fonts/` (NF-1.31).

---

## Current baseline (already shipped)

Use [`packages/shared/src/constants/features.ts`](../packages/shared/src/constants/features.ts) (`APP_FEATURE_PILLARS`) as the marketing/product source of truth.

### Navigation & shell

| Screen / area | Route(s) | Key files |
|---------------|----------|-----------|
| Tabs (Home, Tracker, Settings) | `(tabs)/index`, `(tabs)/tracker`, `(tabs)/settings` | `components/app-tabs.tsx`, `components/app-tabs.web.tsx` |
| Onboarding | `(onboarding)/intro` | `app/(onboarding)/intro.tsx` |
| Auth | `(auth)/login`, `profile` | `providers/auth-provider.tsx`, `components/auth/social-login-buttons.tsx` |

### Worship tracking

| Feature | Route(s) | Key files |
|---------|----------|-----------|
| Salah tracker (5 fard + Witr sunnah mu'akkadah + 5 sunnah) | `(tabs)/tracker`, `calendar/[date]` | `stores/tracker-store.ts`, `components/prayer-status-sheet.tsx`, `db/repositories/prayer-repository.ts` |
| Per-prayer virtues & references (sheet) | tracker rows, schedule | `lib/prayer-info.ts`, `components/prayer-info-sheet.tsx` — **not** a full salah/how-to guide |
| Qaza (counters, calculator, planner, roza) | `qaza/*` | `stores/tracker-store.ts`, `db/repositories/qaza-repository.ts`, `components/qaza-*` |
| Dhikr (7 categories, favorites, counters) | `zikr/*` | `packages/shared/src/content/zikr.ts`, `stores/preferences-store.ts` |
| Tasbeeh (free + custom) | `tasbeeh/*` | `stores/custom-tasbeeh-store.ts`, `components/tasbeeh/*` |
| Calendar (Gregorian + Hijri) | `calendar/*` | `lib/calendar.ts`, `lib/hijri.ts` |
| Achievements & Noor | `achievements`, home cards | `packages/shared/src/achievements/`, `lib/achievements-persistence.ts` |
| Statistics | `statistics` | `components/charts/bar-chart.tsx`, `components/statistics/metrics.tsx` |

### Content library

| Feature | Route(s) | Key files |
|---------|----------|-----------|
| Qur'an reader | `quran/*` | `lib/quran.ts`, `stores/quran-store.ts`, `api/quran-remote.ts` |
| Hadith | `hadith/*` | `lib/hadith.ts`, `api/hadith-remote.ts`, `db/repositories/hadith-repository.ts` |
| Duas & duroods | `dua/*`, `duroods` | `packages/shared/src/content/duas.ts`, `stores/dua-favorites-store.ts` |
| 99 Names | `names-of-allah` | `packages/shared/src/content/names.ts`, `lib/audio-tracks.ts` |
| Universal search | `search` | `lib/search.ts`, `lib/search-history.ts` |
| Bookmarks hub | `bookmarks` | `app/bookmarks/index.tsx` |

### Times, location & platform

| Feature | Route(s) | Key files |
|---------|----------|-----------|
| Prayer times hero | `(tabs)/index` | `hooks/use-home-hero.ts`, `components/prayer-times-hero.tsx`, `lib/sky.ts`, `lib/moon.ts` |
| Qibla compass | `qibla` | `lib/qibla-guidance.ts`, `app/qibla/index.tsx` |
| Location picker | `location` | `lib/location.ts`, `stores/location-store.ts` |
| Weather | settings + hero | `stores/weather-store.ts`, `lib/weather/*` |
| Notifications | `settings/notifications`, `notifications` | `lib/notifications/build-reminders.ts`, `providers/in-app-notifications-provider.tsx` |
| Personalization | `settings/*` | `stores/preferences-store.ts`, `settings/appearance.tsx` |
| Cloud sync (partial) | auth-triggered | `sync/sync-engine.ts`, `sync/records.ts`, `providers/auth-provider.tsx` |

### Retention surfaces

| Feature | Key files |
|---------|-----------|
| Continue where you left off | `stores/continue-store.ts`, `lib/continue-activity.ts`, `components/continue-card.tsx` |
| Knowledge flash card | `hooks/use-knowledge-card.ts`, `lib/knowledge-card-data.ts`, `components/knowledge-flash-card.tsx` |
| iOS PWA install banner | `components/pwa/ios-pwa-install-banner.tsx` |

---

## Partial implementations (P0 — finish what exists)

These are **backend/store-ready but missing UI or incomplete sync**. Highest ROI.

> **✅ All P0 items (NF-0.1 – NF-0.8) shipped 2026-07-05.** Method/madhab pickers, manual-sync UI, expanded sync entities (dua/durood/name favorites, Qur'an bookmarks + last-read, hadith bookmarks, custom tasbeeh — achievements intentionally excluded as pure-derived state), adhan-on-prayer notification option, Juz browser, durood/name search + favorites, and bulk prayer import are all implemented with en/ar/ur strings and passing `check-types` + tests. NF-0.5 adhan OS sound verified on EAS dev build (pref, scheduling payload, Android channel, iOS content-sound, web-gating).

### NF-0.1 — Prayer calculation method picker

| | |
|---|---|
| **Priority** | P0 |
| **Scope** | `app` |
| **Status** | `done` |
| **Problem** | `useLocationActions().setMethod()` and `StoredLocation.method` exist and persist; defaults to `DEFAULT_CALCULATION_METHOD` in `lib/prayer-times.ts`. No user-facing control, so users in regions using ISNA/Karachi/Egypt/Umm-al-Qura get wrong times. |
| **Key files** | `app/location/index.tsx` (Location card is at the top), `lib/prayer-times.ts` (`CalculationMethodKey`, `DEFAULT_CALCULATION_METHOD`), `stores/location-store.ts`, `notifications/scheduler.ts` (`rescheduleAll`) |

**Flow:**

1. In `lib/prayer-times.ts` export a label map `CALCULATION_METHOD_LABELS: Record<CalculationMethodKey, string>` (adhan's methods: `MuslimWorldLeague`, `Egyptian`, `Karachi`, `UmmAlQura`, `Dubai`, `MoonsightingCommittee`, `NorthAmerica`, `Kuwait`, `Qatar`, `Singapore`, `Tehran`, `Turkey`, `Other`) plus a short regional hint per method.
2. Because there are ~13 methods, use a **`Sheet` (`variant: "bottom"`) picker**, not `SegmentedControl`: on the location screen add a `NavRow` "Calculation method" showing the current method's label; tapping it opens a Sheet listing the methods as `PressableScale` rows with a checkmark on the active one (mirror the `Choices` sub-component in `settings/time-format.tsx`).
3. On select: `await useLocationActions().setMethod(key)` then close the sheet.
4. Reschedule reminders after save: `await rescheduleAll(usePreferences.getState?.() ?? preferencesStore.getState().prefs, locationStore.getState().location)` (import `rescheduleAll` from `@/notifications/scheduler`).
5. Add i18n keys `location.method`, `location.methodHint`, and one label per method under `location.methods.*` in `en/ar/ur`.
6. Gates: `pnpm --filter app check-types` · `pnpm --filter app test` · `pnpm format-and-lint:fix`.

| **AC** | Location screen shows current method + a picker; changing it re-derives the home hero times (`use-home-hero`), the tracker schedule (`buildDailySchedule`), and reschedules notifications; persists across restart; all method labels exist in en/ar/ur; `check-types` green. |

### NF-0.2 — Asr madhab picker (Shafi / Hanafi)

| | |
|---|---|
| **Priority** | P0 |
| **Scope** | `app` |
| **Status** | `done` |
| **Problem** | `useLocationActions().setMadhab()` exists and persists (`MadhabKey = "shafi" \| "hanafi"`, tested in `lib/prayer-times.test.ts`); no UI. Hanafi users see the wrong (earlier) Asr. |
| **Key files** | Same as NF-0.1. Ships together with NF-0.1 on the Location screen. |

**Flow:**

1. On the Location screen, below the method picker, add a **`SegmentedControl<MadhabKey>`** with two options — `{ id: "shafi", label: t("location.madhabShafi") }`, `{ id: "hanafi", label: t("location.madhabHanafi") }` — `value={location.madhab}` (mirror the size control in `settings/fonts.tsx`).
2. `onChange={(key) => { await useLocationActions().setMadhab(key); await rescheduleAll(preferencesStore.getState().prefs, locationStore.getState().location); }}`.
3. Copy must be scholar-neutral (e.g. "Asr calculation" with a one-line "Hanafi uses a later Asr" hint) — no fatwa language.
4. i18n keys `location.madhab`, `location.madhabShafi`, `location.madhabHanafi`, `location.madhabHint` in en/ar/ur.

| **AC** | Toggling Hanafi shifts Asr later everywhere (hero, tracker schedule, reminders); persists; scholar-neutral copy; en/ar/ur complete; `check-types` green. |

### NF-0.3 — Manual sync + sync status UI

| | |
|---|---|
| **Priority** | P0 |
| **Scope** | `app` |
| **Status** | `done` |
| **Problem** | `syncNow()` runs silently on sign-in + foreground. **It is already on `useAuth()`** but there's no manual trigger, no last-synced time, and no success/error feedback — users can't tell if their data is backed up. |
| **Key files** | `app/profile/index.tsx`, `providers/auth-provider.tsx` (`syncNow` already exported), `sync/sync-engine.ts`, `db/keys.ts` (`DB_KEYS.syncMetadata`), `providers/toast-provider.tsx` |

**Flow:**

1. Add a small `read`/`write` helper (or reuse the sync-engine's) to read `DB_KEYS.syncMetadata` → `{ lastSyncedAt, lastPushedAt }`. Expose it as a tiny `useSyncMetadata()` hook or read on mount into local state.
2. In `profile/index.tsx`, for a **signed-in** user (`isAuthenticated && !isGuest`), add a `Card` "Cloud sync" with: a `NavRow`/row showing "Last synced {relative time}" (reuse the relative-time formatter from `continue-card.tsx`) and a `Button` "Sync now".
3. `onPress`: set a local `isSyncing` flag → `try { await syncNow(); toast.success(t("sync.done")); } catch { toast.error(t("sync.failed")); } finally { setIsSyncing(false); refresh last-synced }`. Disable the button + show a spinner while syncing.
4. For **guest** users, show the existing sign-in CTA instead (no sync controls).
5. Offline: `syncNow()` must reject cleanly (no crash) → caught by step 3 → toast only.
6. i18n `sync.title`, `sync.lastSynced`, `sync.now`, `sync.done`, `sync.failed`, `sync.never` in en/ar/ur.

| **AC** | Signed-in user can tap "Sync now"; button shows loading then updates the timestamp on success; failure/offline shows a toast and never crashes; guests see only the sign-in CTA; en/ar/ur complete. |

### NF-0.4 — Expand cloud sync entities

| | |
|---|---|
| **Priority** | P0 |
| **Scope** | `multi` |
| **Status** | `done` |
| **Depends on** | NF-0.3 |
| **Problem** | Sync covers only `prayer_logs`, `zikr_progress`, `qaza_entries`, `preferences`, `favorites` (zikr favorites). **Not** synced: dua favorites, Qur'an bookmarks + last-read, hadith bookmarks, custom tasbeeh, achievements. A user who switches devices loses these. |
| **Key files** | `apps/api/src/sync/dto/sync.dto.ts` (`SYNC_ENTITIES`), `sync/records.ts` (`LocalSnapshot` + `buildSyncRecords`), `sync/sync-engine.ts` (`applyRemoteRecords`), the relevant repositories, `packages/shared/src/types/` |

**Flow (per new entity — do dua favorites first as the reference):**

1. **API:** add the entity id to `SYNC_ENTITIES` in `apps/api/src/sync/dto/sync.dto.ts` (e.g. `"dua_favorites"`). The server stores an opaque JSONB payload per entity, so no new server logic — just the enum + a Swagger example.
2. Regenerate the client contract: `pnpm generate:api` (updates `packages/api-contract/openapi.json` + `@munib-tracker/api-client`).
3. **Client push:** extend `LocalSnapshot` and `buildSyncRecords()` in `sync/records.ts` to emit a `SyncRecordDto` for the entity (mirror the `favorites` record — a single blob `{ ids, order }` with an `updatedAt`, or one record per row with per-row `updatedAt` for bookmarks/custom tasbeeh).
4. **Client pull:** handle the entity in `applyRemoteRecords()` (`sync-engine.ts`) with **last-write-wins on `updatedAt`**; each source repo needs an `applyRemote*` method (mirror the existing repo LWW methods). Ensure the store carries `updatedAt` and honors **tombstones** for deletions.
5. Feed the snapshot from the right store/repo (`dua-favorites-store`, `quran-store`/`QuranRepository`, `hadith-repository`, `custom-tasbeeh-store`, achievements persistence).
6. **Tests:** add a round-trip + LWW + tombstone case to `sync/sync-engine.test.ts` per entity.
7. Gates include `pnpm --filter api test` (API DTO changed) + `pnpm --filter app test`.

| **AC** | Each new entity round-trips across two devices with LWW on `updatedAt`; deletions propagate via tombstones; guest still gets 403; `sync-engine.test.ts` covers each; `pnpm generate:api` committed. |

### NF-0.5 — Adhan at prayer notification time

| | |
|---|---|
| **Priority** | P0 |
| **Scope** | `app` |
| **Status** | `done` |
| **Problem** | `lib/adhan-audio.ts` bundles the clip for **settings preview only** (`ADHAN_STYLES`, `adhanTrack()`). Scheduled prayer reminders (`build-reminders.ts`) are silent text nudges — there is no option to play the adhan at prayer time. |
| **Key files** | `packages/shared/src/types/preferences.ts` (`NotificationPreferences`), `constants/index.ts` (defaults), `app.json` (`expo-notifications` sound registration), `lib/notifications/build-reminders.ts`, `notifications/scheduler.ts`, `settings/notifications.tsx`, `assets/audio/adhan/README.md` |

**Flow:**

1. **Register the sound** for a real OS notification tone: add the adhan file to the `expo-notifications` plugin `sounds` array in `app.json` (per `assets/audio/adhan/README.md`). Custom notification sounds require a **dev/EAS build + prebuild** — they do NOT work in Expo Go or on web.
2. **Pref:** add `playAdhanOnPrayer: boolean` to `NotificationPreferences` + default `false` in `constants/index.ts` (extend the `parity.test.ts`-style shape tests if any).
3. **Toggle:** add a `ToggleRow` in `settings/notifications.tsx` under the prayer section, gated/disabled when `platform === "web"` (show a "not available on web" subtitle). Persist via `setNotificationPrefs({ playAdhanOnPrayer })` and call `rescheduleAll(...)` after.
4. **Schedule:** in `build-reminders.ts`, when the pref is on and the reminder is an **obligatory** prayer, attach the registered sound to that reminder's payload (`sound: "adhan.wav"`/style id) so `scheduler.ts` passes it to `expo-notifications`; leave sunnah/zikr reminders silent.
5. Respect the master toggle + per-prayer alert overrides (`prayerAlerts`) — an off prayer never plays.
6. i18n `notif.playAdhan`, `notif.playAdhanHint`, `notif.adhanWebUnavailable` in en/ar/ur.
7. Test the reminder payload in `build-reminders.test.ts` (sound attached only for obligatory + pref on); QA the actual sound on an iOS/Android dev build.

| **AC** | With the pref on (dev build), obligatory prayer reminders play the adhan; sunnah/zikr stay silent; web shows the limitation note and the toggle is disabled; master toggle + per-prayer off suppress it; `build-reminders.test.ts` covers the payload. |

### NF-0.6 — Juz browser (metadata exists)

| | |
|---|---|
| **Priority** | P0 |
| **Scope** | `app` |
| **Status** | `done` |
| **Problem** | `JUZ_STARTS` (30 `[surah, ayah]` starts) and a per-ayah `juz` field already exist in `lib/quran.ts`, but `juzForAyah()` is **module-private** and there is no Juz index screen. |
| **Key files** | `lib/quran.ts` (`JUZ_STARTS`), `app/quran/[surah].tsx` (already reads an `?ayah=` param → scrolls + highlights via `useScrollToActive`), new `app/quran/juz.tsx`, `app/quran/index.tsx` (add entry point), `stores/quran-store.ts` (reading progress) |

**Flow:**

1. In `lib/quran.ts`, `export` a small accessor: `getJuzList(): { juz: number; surah: number; ayah: number; surahName: string }[]` derived from `JUZ_STARTS` + `getSurahMeta()` (and export `juzForAyah` if a screen needs the reverse lookup).
2. Create `app/quran/juz.tsx` (`ScreenLayout` + `onBack` + `Stagger`): a `FlatList`/list of 30 `NavRow`s — "Juz N" + starting "SurahName · s:a".
3. Row `onPress` → `router.push({ pathname: "/quran/[surah]", params: { surah, ayah } })` (the reader already deep-links to & highlights the ayah).
4. Add discovery: a "Browse by Juz" `NavRow`/segment at the top of `quran/index.tsx` (and optionally a home quick action).
5. **Optional progress:** if `quran-store` reading progress exists per surah, show a subtle "% read" per juz (compute from `furthestAyah` across the juz's surah span); skip if not cheap.
6. i18n `quran.juz`, `quran.juzN` (`"Juz {{n}}"`), `quran.browseByJuz` in en/ar/ur.

| **AC** | All 30 juz render with correct start surah:ayah; tapping opens the reader scrolled to that ayah; entry point visible from `quran/index`; themed + RTL + en/ar/ur; `check-types` green. |

### NF-0.7 — Duroods & Names: search + favorites

| | |
|---|---|
| **Priority** | P0 |
| **Scope** | `app`, `shared` |
| **Status** | `done` |
| **Problem** | Universal `/search` indexes duroods/names, but the `duroods` and `names-of-allah` list screens have no in-screen search bar and no favorites (dua/zikr both have both). |
| **Key files** | `app/duroods/index.tsx`, `app/names-of-allah/index.tsx`, `lib/search.ts`, `stores/dua-favorites-store.ts` (pattern to copy), `app/bookmarks/index.tsx`, `apps/app/AGENTS.md` (Fuse rules) |

**Flow:**

1. **Search:** add `createDuroodSearch(items)` and `createNameSearch(items)` (or a generic `createFuzzyIndex(items, fields)`) in `lib/search.ts` per the existing `createDuaSearch`/`createZikrSearch` pattern — `normalize()` the indexed fields, project defaults (`threshold: 0.2`, weighted keys). **Do not** add a raw `new Fuse()` in the screen.
2. Wire an in-screen search bar on each list screen, memoizing the index per list; filter the rendered `FlatList` by the query.
3. **Favorites:** create `stores/durood-favorites-store.ts` and `stores/name-favorites-store.ts` mirroring `dua-favorites-store.ts` (ordered id array, `useEnsure*Loaded()`, graceful stale-id filter). Add `DB_KEYS.duroodFavorites`/`nameFavorites`, register in `resetDatabase()`.
4. Add a favorite (star) toggle to each list row + a favorites screen (`app/duroods/favorites.tsx`, `app/names-of-allah/favorites.tsx`) mirroring `dua/favorites.tsx`.
5. **Bookmarks hub:** add "Saved duroods" / "Saved names" rows to `app/bookmarks/index.tsx` "Saved" section with counts.
6. When NF-0.4 ships, add these to sync.
7. i18n additions under `duroods.*` / `names.*`; tests: extend `lib/search.test.ts` for the new helpers; a favorites persistence test.

| **AC** | Both screens have working fuzzy search; favoriting a durood/name persists across restart and appears in the Bookmarks hub; Fuse helpers live in `search.ts` (no inline `new Fuse()`); `search.test.ts` updated; en/ar/ur complete. |

### NF-0.8 — Bulk historical prayer import

| | |
|---|---|
| **Priority** | P0 |
| **Scope** | `app`, `shared` |
| **Status** | `done` |
| **Problem** | `PrayerLogSource` already includes `"bulk_import"` and `prayer-repository` can create logs, but there's no import UI — users migrating from another app or backfilling history must tap every day by hand. |
| **Key files** | `packages/shared/src/types/prayer.ts` (`PrayerLogSource`), new `packages/shared/src/utils/import.ts` (parser + validator), `db/repositories/prayer-repository.ts`, new `app/settings/import.tsx`, `app/settings/index` (row), `stores/tracker-store.ts` |

**Flow:**

1. **Format + parser (shared):** define a documented import shape (JSON array of `{ date: YYYY-MM-DD, prayerId, status }`, and/or CSV). Add `parsePrayerImport(text): { rows: PrayerLog[]; errors: ImportError[] }` in `packages/shared/src/utils/import.ts` (pure, unit-tested) — validate date format, known `prayerId`/`status`, no future dates, dedupe per (date, prayerId).
2. **Input without a new native dep:** the screen accepts **pasted** JSON/CSV in a `TextInput` (works iOS/Android/Web, honors [[no-new-native-deps]]). Optionally, gate a file picker behind `Platform.OS === "web"` using a plain `<input type="file">` (no native module); only add `expo-document-picker` if the user explicitly accepts a rebuild.
3. **Preview:** parse on submit → show a summary Card ("X valid rows, Y errors, date range …") + the first N errors before committing. Nothing is written until the user confirms.
4. **Commit:** write rows via `prayer-repository` with `source: "bulk_import"`, then reload the tracker store. Per `docs/TODO.md` P5.2, bulk-import rows must not spawn history audit noise.
5. **Qaza option:** optionally offer to update qaza counters from the imported misses, behind a **scholar disclaimer** (reuse the calculator's disclaimer string).
6. i18n `import.*` namespace; add `app/settings/import.tsx` row under Settings.
7. Tests: `packages/shared/src/utils/import.test.ts` (valid/invalid/dupe/future-date); a feature test for the preview→commit path.

| **AC** | Pasting a valid file previews counts + errors, then commits logs with `source: "bulk_import"`; a malformed file is rejected with a clear per-row error and writes nothing; optional qaza update shows the disclaimer; parser unit-tested; en/ar/ur complete; no forced native rebuild. |

---

## Should do (P1 — high impact)

### Prayer & worship

| ID | Feature | Scope | Key touchpoints | AC summary |
|----|---------|-------|-----------------|------------|
| NF-1.1 | **Ramadan mode** | app, shared | `(tabs)/index`, `lib/prayer-times.ts`, new `lib/ramadan.ts`, prefs | Suhoor/iftar times, fasting day tracker, themed home, optional taraweeh log |
| NF-1.2 | **Hayd / excused period mode** | app, shared | `tracker-store`, `preferences-store`, streak logic in `shared/utils` | Pause obligatory tracking + qaza prompts; streak frozen fairly; clear UI badge |
| NF-1.3 | **Travel mode (Qasr / Jam')** | app, shared | new guide screen + optional tracker simplification | Educational content + optional 2-rakah tracking; no fatwa engine required |
| NF-1.4 | **Sick / unable to pray mode** | app | `prayer-status-sheet`, calendar day | Mark day excused with note; excluded from missed/qaza auto-add |
| NF-1.5 | **Jama' (congregation) flag** | app, shared | `PrayerLog` type extension, `prayer-tracker-row` | Optional toggle on completed salah; stats column |
| NF-1.6 | **Weekly worship report** | app | `statistics`, in-app notification | Push/in-app summary: perfect days, qaza cleared, zikr totals |
| NF-1.7 | **Per-prayer reminder offsets** | app, shared | `NotificationPreferences`, `build-reminders.ts` | User sets minutes before/after per prayer; reschedule on save |
| NF-1.33 | **Salah guide** | app, shared | See **NF-1.33** below | Offline wudu + step-by-step salah + rakats per prayer; extends existing prayer info |

### Qur'an & learning

| ID | Feature | Scope | Key touchpoints | AC summary |
|----|---------|-------|-----------------|------------|
| NF-1.8 | **Khatm / reading plan** | app, shared | new store + `quran-store`, home card | 30/60/90-day plans; daily ayah/page target; progress ring |
| NF-1.9 | **Hifz tracker (lite)** | app | `quran-store`, surah reader ayah actions | Mark ayahs memorized / needs review; list by surah |
| NF-1.10 | **Tafsir on-demand** | app, api | extend `api/quran-remote.ts`, cache repo | Remote tafsir editions; cache-first like translations |
| NF-1.11 | **Mushaf page view** | app | new reader mode in `quran/[surah].tsx` | Optional 604-page layout; page jump |
| NF-1.12 | **More translations & reciters** | app, scripts | `scripts/build-data/`, `lib/quran-audio.ts` | Expand `REMOTE_EDITIONS` / `RECITERS`; document in `FREE_OPEN_SOURCE_DATA.md` |
| NF-1.13 | **Side-by-side translations** | app | surah reader layout | Two editions visible; prefs for primary/secondary |
| NF-1.14 | **Offline download manager** | app | settings screen for cached editions/audio | List cached remote Qur'an/hadith; clear cache; size display |

### Qaza & accountability

| ID | Feature | Scope | Key touchpoints | AC summary |
|----|---------|-------|-----------------|------------|
| NF-1.15 | **Qaza history log** | app | `qaza-repository`, `qaza/index.tsx` | Timeline of performed qaza with dates |
| NF-1.16 | **Smart planner suggestions** | app, shared | `qaza/planner.tsx`, `shared/utils/qaza.ts` | Auto-suggest daily targets from debt + user capacity |
| NF-1.17 | **Unified debt dashboard** | app | home `QazaSummaryCard`, roza + prayer | Single "remaining" view; Ramadan-aware copy |

### Platform & retention

| ID | Feature | Scope | Key touchpoints | AC summary |
|----|---------|-------|-----------------|------------|
| NF-1.18 | **Native home-screen widgets (iOS + Android)** | app | See **NF-1.18** below | WidgetKit + Android App Widgets; next prayer, countdown, today progress |
| NF-1.19 | **Live Activities (iOS)** | app | native module or Expo plugin | Lock-screen next-prayer countdown |
| NF-1.20 | **Local backup export/import** | app | new settings flow, JSON schema in `shared` | Export all `DB_KEYS` data; import with validation; no account required |
| NF-1.21 | **Customizable home modules** | app, shared | `(tabs)/index.tsx`, prefs | Reorder/hide cards: goal, qaza, schedule, knowledge |
| NF-1.22 | **Library tab (4th tab)** | app | `components/app-tabs.tsx`, move routes | Qur'an / Hadith / Duas / Zikr entry; reduces 16-tile grid clutter |
| NF-1.23 | **Customizable quick actions** | app, shared | home `quickActions`, prefs | User pins 4–8 shortcuts |
| NF-1.30 | **App icon quick actions (long-press)** | app | See **NF-1.30** below | iOS Home Screen Quick Actions + Android static shortcuts; deep-link into app |

### Notifications & content

| ID | Feature | Scope | Key touchpoints | AC summary |
|----|---------|-------|-----------------|------------|
| NF-1.24 | **Daily ayah / hadith notification** | app | `knowledge-card-data.ts`, `build-reminders.ts` | Opt-in daily content push |
| NF-1.25 | **Friday reminders** | app | extend knowledge Friday entries | Jumu'ah + Surah Al-Kahf nudge |
| NF-1.26 | **Adhan style picker** | app | `lib/adhan-audio.ts`, settings | Multiple bundled adhan MP3s if assets added |

### Reading & typography

| ID | Feature | Scope | Key touchpoints | AC summary |
|----|---------|-------|-----------------|------------|
| NF-1.31 | **Arabic font family picker** | app, shared | See **NF-1.31** below | User selects Arabic typeface in Settings; applied app-wide to all Arabic script |
| NF-1.32 | **In-context reading font size override** | app, shared | See **NF-1.32** below | Per-screen A+/A− (or slider) on every dua/zikr/surah/hadith view; optional persist per content type |

### Accessibility

| ID | Feature | Scope | Key touchpoints | AC summary |
|----|---------|-------|-----------------|------------|
| NF-1.29 | **Accessibility audit** | app | VoiceOver / TalkBack on tracker, qibla, tasbeeh | Meaningful labels; reduced motion respected (`useReducedMotion`) |

---

## Platform & typography (detailed requirements)

### NF-1.18 — Native home-screen widgets (iOS + Android)

| | |
|---|---|
| **Priority** | P1 |
| **Scope** | `app` (native targets only; web N/A) |
| **Status** | `done` — WidgetKit + Android App Widget via EAS; `lib/widget-data.ts` + `docs/NATIVE_WIDGETS.md` |
| **Problem** | Users expect glanceable next-prayer info on the home screen without opening the app. Current app has no WidgetKit or Android widget extension. |
| **Platforms** | **iOS:** WidgetKit (small + medium widgets; optional lock-screen accessory on iOS 16+). **Android:** App Widget (`AppWidgetProvider`) via Expo config plugin or dev-client native module. |
| **Key files** | `app.config.ts` / `app.json`, new `widgets/` native target or Expo widgets module, `hooks/use-home-hero.ts`, `lib/prayer-times.ts`, `stores/location-store.ts`, `stores/tracker-store.ts` |
| **Widget content (minimum)** | Next prayer name + time; countdown to next prayer; optional: today’s salah progress (e.g. 3/6), Hijri date, location label (truncated). |
| **Widget content (medium / large)** | Above plus today’s schedule list (Fajr→Isha), qaza daily target progress, or streak — pick one layout for v1. |
| **Data freshness** | Widgets must read from shared app group / `SharedPreferences` (or Expo widget data API) updated when: app foregrounds, location changes, prayer crossed, tracker updated. Schedule timeline reload at each prayer boundary (mirror `use-home-hero` day-crossing logic). |
| **Requirements** | 1) At least **one small** and **one medium** widget on both iOS and Android. 2) Tapping widget opens app to Home or Tracker via deep link (`munib-tracker://` or Expo Router path). 3) Respect user theme (light/dark) where platform supports widget appearance. 4) Graceful empty state when location denied (show “Set location” CTA deep link). 5) No network required for prayer times (use on-device `adhan` + cached location). |
| **Guide** | Read `.agents/skills/expo-deployment/SKILL.md` and Expo SDK 57 widget docs before adding native targets. Requires **dev client / EAS build** — widgets do not work in Expo Go. Prefer shared Swift/Kotlin helpers that duplicate minimal prayer-time math or pass precomputed JSON from JS on app launch. |
| **AC** | Widget renders correct next prayer on iOS simulator + Android emulator with manual location; updates within 1 minute of prayer boundary in test; tap navigates to app; `pnpm --filter app check-types` still green; document widget setup in `apps/app/README.md` or AGENTS.md addendum. |

### NF-1.30 — App icon quick actions (long-press)

| | |
|---|---|
| **Priority** | P1 |
| **Scope** | `app` (native iOS + Android; web N/A) |
| **Status** | `done` — `expo-quick-actions` plugin + `(tabs)/_layout.tsx` `useQuickActionRouting()` + `setItems([...])` with localized titles; verified on iOS + Android dev builds |
| **Problem** | Power users cannot jump to common tasks from the home-screen app icon long-press menu. |
| **Platforms** | **iOS:** `UIApplicationShortcutItem` / Home Screen Quick Actions (static shortcuts declared at build time; dynamic optional in v2). **Android:** static `<shortcut>` entries in `AndroidManifest.xml` via Expo config plugin (`expo-quick-actions` or custom plugin). |
| **Key files** | `app.config.ts`, `app/_layout.tsx` (handle cold-start shortcut intent), Expo Router deep links, `lib/continue-activity.ts` patterns for route targets |
| **Default shortcuts (v1)** | Suggested set (i18n titles/subtitles): **Open Tracker** → `/tracker`; **Mark checklist** → `/tracker`; **Qibla** → `/qibla`; **Tasbeeh** → `/tasbeeh/free`; **Next prayer** → `/` (home hero). Max 4 on iOS; Android allows more but keep parity at 4. |
| **Requirements** | 1) Shortcuts visible after long-pressing the app icon on home screen (not in-app only). 2) Cold start and warm start both route correctly via Expo Router. 3) Shortcut labels respect app locale where OS allows (fallback English). 4) Icons use SF Symbols mapping on iOS / Material on Android. 5) Optional v2: user-customizable shortcuts in Settings (persist in `UserPreferences`). |
| **Guide** | Use typed deep links already supported by Expo Router. Handle shortcut payload in root layout `useEffect` + `Linking.getInitialURL()`. Test cold launch from shortcut on physical device — simulators sometimes skip Quick Actions. |
| **AC** | All four default shortcuts open the correct screen from killed state on iOS + Android dev builds; no duplicate navigation stack loops; accessibility labels on shortcut actions. |

### NF-1.31 — Arabic font family selection

| | |
|---|---|
| **Priority** | P1 |
| **Scope** | `app`, `shared` |
| **Status** | `done` |
| **Problem** | `FontScopePrefs.family` exists on `fontPrefs.arabic` (`packages/shared/src/types/preferences.ts`) but `settings/fonts.tsx` only exposes **size** presets (S/M/L). Arabic renders via `ThemedText type="arabic"` without a user-chosen typeface. |
| **Key files** | `app/settings/fonts.tsx`, `components/themed-text.tsx`, `components/content/reading-card.tsx`, `app/quran/[surah].tsx`, `app/hadith/[collection].tsx`, `constants/theme.ts` (`Fonts`), bundled font assets under `apps/app/assets/fonts/` |
| **Requirements** | 1) Settings screen: picker listing **bundled** Arabic-capable fonts (minimum: system default, Amiri or Scheherazade, Noto Naskh Arabic — all bundled via `expo-font`, no runtime download). 2) Persist selection to `fontPrefs.arabic.family`. 3) Apply globally wherever Arabic script appears: Qur'an ayahs, hadith Arabic, duas/zikr/durood `ReadingCard`, 99 Names, tasbeeh Arabic labels, knowledge flash card Arabic. 4) Live preview on Fonts screen (reuse existing preview card). 5) Sync Arabic family via preferences sync entity when NF-0.4 ships. |
| **Guide** | Licensed OFL font files live in `apps/app/assets/fonts/` and load via `expo-font` in `app/_layout.tsx`. `settings/fonts.tsx` uses `SegmentedControl` for sizes plus a family picker. `lib/reading-typography.ts` maps `fontPrefs.arabic.family` → `fontFamily`, consumed by `ThemedText` + reading surfaces. RTL `writingDirection` unchanged. |
| **AC** | Changing Arabic font in Settings updates Qur'an reader + ReadingCard + hadith list without restart; persists across app relaunch; en/ar/ur strings for font names; web falls back to CSS webfont or system stack. |

### NF-1.32 — In-context reading font size override

| | |
|---|---|
| **Priority** | P1 |
| **Scope** | `app`, `shared` |
| **Status** | `done` (`ReadingFontControls` A−/A+ + `readingOverrides`; Qur'an reader un-hardcoded, `ReadingCard` uses the resolver) |
| **Depends on** | NF-1.31 (shared typography helper recommended) |
| **Problem** | Global S/M/L sizes in Settings (`settings/fonts.tsx`) are coarse and not on-hand while reading. `reading-card.tsx` already honors `fontPrefs` sizes, but the Qur'an surah reader (`quran/[surah].tsx`) still uses **hardcoded `fontSize: 26` (arabic) / `24` (bismillah)** — not wired to `fontPrefs` at all — and there is no on-screen A−/A+ control anywhere. |
| **Surfaces (all required)** | **Qur'an:** `app/quran/[surah].tsx` (Arabic, transliteration, translation). **Hadith:** `app/hadith/[collection].tsx`, `app/hadith/bookmarks.tsx`. **Duas:** `app/dua/detail/[id].tsx`, `app/dua/[category].tsx` list previews if Arabic shown. **Zikr:** `app/zikr/detail/[id].tsx`, `app/zikr/[category].tsx`. **Shared:** `components/content/reading-card.tsx` (dua, zikr, durood). **Also:** `app/duroods/index.tsx`, `app/names-of-allah/index.tsx` wherever Arabic + translation render. |
| **UX** | Compact control in screen header or floating toolbar: **A− / A+** buttons (or single “Text size” sheet with slider). Adjust **Arabic**, **transliteration**, and **translation** together by default; optional expand to adjust scopes independently. Show current step label (e.g. “Large +2”). |
| **Persistence model** | **Session override** applies immediately on the active screen. **Optional persist:** save delta per content type (`quran` \| `hadith` \| `dua_zikr`) in `fontPrefs.readingOverrides?: Record<ReadingSurface, { arabicDelta?, textDelta? }>` so returning to Qur'an remembers last in-context size without changing global Settings. “Reset to default” clears override for current surface. |
| **Key files** | New `hooks/use-reading-typography.ts` or `lib/reading-typography.ts`; extend `FontPreferences` in `packages/shared/src/types/preferences.ts`; `components/reading-font-controls.tsx` reusable toolbar; wire into `ScreenLayout` optional slot or per-screen header |
| **Requirements** | 1) Controls visible on every listed surface without cluttering small phones (collapse to one icon opening sheet). 2) Minimum/maximum font bounds (e.g. 14–48 Arabic, 12–28 translation) to prevent layout break. 3) Respects `useReducedMotion` — no animating font size aggressively. 4) Global Settings sizes remain the baseline; in-context control applies **delta** on top. 5) Fix Qur'an reader to use shared typography helper instead of hardcoded sizes. |
| **Guide** | Centralize resolved sizes: `resolveReadingFontSizes(scope, fontPrefs) → { arabic, transliteration, translation }`. `ReadingCard` and surah/hadith rows consume this hook. Add unit tests for delta clamping in `lib/reading-typography.test.ts`. |
| **AC** | User can enlarge Arabic on an open surah, navigate away, return — persisted per `quran` override if enabled; A+/A− works offline; hadith collection with 1000+ items does not re-render entire list on each tap (memo row props); VoiceOver announces “Increase text size” / “Decrease text size”. |

### NF-1.33 — Salah guide (wudu, steps, rakats)

| | |
|---|---|
| **Priority** | P1 |
| **Scope** | `app`, `shared` |
| **Status** | `done` — `content/salah-guide.ts` (+ types), `/salah-guide` index + `[topic]`, `SALAH_GUIDE_TOPICS`/`PRAYER_RAKATS` |
| **Problem** | The app tracks salah but does not teach it. `PrayerInfoSheet` (`lib/prayer-info.ts`) only shows curated **Qur'an/hadith references** per prayer — no wudu steps, no posture sequence, no rakats breakdown. New Muslims and refreshers need an offline, in-app guide. |
| **Relationship to existing** | **Extend, don’t duplicate:** keep `PRAYER_INFO` refs; salah guide links into them from each prayer’s detail page. `PrayerInfoButton` on tracker rows may open guide section or show “Learn more” link alongside current sheet. |
| **Key files** | New `packages/shared/src/content/salah-guide.ts` (+ types in `packages/shared/src/types/salah-guide.ts`); `app/salah-guide/index.tsx`, `app/salah-guide/[topic].tsx`, optional `app/salah-guide/prayer/[prayerId].tsx`; `lib/prayer-info.ts`, `components/prayer-info-sheet.tsx`, `(tabs)/index.tsx` quick action, `(tabs)/tracker.tsx` entry |
| **Content modules (v1, bundled offline)** | 1) **Overview** — pillars of salah, prerequisites, intention (niyyah). 2) **Wudu** — ordered steps with short descriptions; optional illustration placeholders (SVG or SF Symbol / Material icons only — no new native deps). 3) **How to pray** — standing → takbir → recitation → ruku → sujud → tashahhud → salam (generic fard flow); note variations briefly (e.g. Fajr 2 rakats). 4) **Rakats reference table** — per `PrayerId` + schedule markers: fard count, common sunnah before/after (aligned with app’s `OBLIGATORY_PRAYERS` / `SUNNAH_PRAYERS` in `@munib-tracker/shared/constants`). 5) **Per-prayer detail** — timing window (link to schedule), rakats summary, virtues, **`PRAYER_INFO` references** with deep links to Qur'an/hadith readers. 6) **Common questions** — qasr/jam’ pointer (→ NF-1.3 when shipped), missing a prayer → tracker/qaza, witr after isha. |
| **Content rules** | Scholar-neutral, concise, no madhab debates in v1 — add disclaimer (“Consult a qualified teacher for your situation”). Store copy in `@munib-tracker/shared/content` with i18n keys in app JSON for UI chrome; body text may start English-only in shared with ar/ur follow-up, or use keyed strings from day one (preferred). **Do not alter Arabic Qur'an/hadith text** — link out to readers. Bump `SALAH_GUIDE_CONTENT_VERSION` when content changes. |
| **Navigation & discovery** | Home quick action **Salah guide** → `/salah-guide`. Tracker header link or info affordance. Optional Settings row under About/Learn. Include in universal search via `search.ts` (`SearchCategory` `salah_guide` or extend `searchLight`). NF-1.30 app shortcut optional: **How to pray** → `/salah-guide`. |
| **UX** | `ScreenLayout` + `Stagger` + `Card` sections; collapsible steps for wudu/salah; progress checkmarks optional (local-only, `DB_KEYS` `salah_guide_progress` — v2). Use `ReadingCard` styling for any quoted duas in guide. NF-1.32 reading controls apply to guide text surfaces. |
| **Guide** | Mirror content pattern from `packages/shared/src/content/zikr.ts` / `duas.ts`. Accessor `lib/salah-guide.ts` in app. No network. Update `APP_FEATURE_PILLARS` (`packages/shared/src/constants/features.ts`) when shipped. |
| **AC** | All v1 modules reachable offline; per-prayer page deep-links to at least one existing Qur'an or hadith ref; en (required) + ar + ur for UI labels; tracker `PrayerInfoButton` still works; new guide does not regress prayer tracking; content version test in shared; `pnpm --filter app test` passes. |

---

## May do (P2 — longer horizon)

### Islamic lifestyle modules

| ID | Feature | Notes |
|----|---------|-------|
| NF-2.1 | Islamic events calendar | Ramadan/Eid/Ashura/White Days; `lib/hijri.ts` + Umm al-Qura helpers |
| NF-2.2 | Zakat / sadaqah tracker | Calculator + donation log; no payment SDK initially |
| NF-2.3 | Hajj & Umrah checklist | Content-heavy; static guides in `@munib-tracker/shared/content` |
| NF-2.4 | Seerah timeline | Serialized content; optional audio |

### Advanced content

| ID | Feature | Notes |
|----|---------|-------|
| NF-2.7 | Word-by-word Qur'an | Large dataset; new reader mode |
| NF-2.8 | Hadith sharh / explanation links | External or bundled summaries |
| NF-2.9 | Narrator chain display | Extend `HadithItem` if data available |
| NF-2.10 | Daily hadith series | Curated push + in-app archive |
| NF-2.11 | Custom adhkar builder | User-authored text; local-only first |

### Tracker depth

| ID | Feature | Notes |
|----|---------|-------|
| NF-2.12 | Prayer journal / khushu rating | Optional reflection after salah |
| NF-2.13 | Tahajjud dedicated streak | Filter `tahajjud` in stats |
| NF-2.14 | Apple Watch / Wear OS | ✅ `targets/munib-tracker-watch` + Wear OS tile; mark via command queue |
| NF-2.15 | Siri / Assistant shortcuts | ✅ App Intents + Android App Actions; background mark-prayed |

### Product & power user

| ID | Feature | Notes |
|----|---------|-------|
| NF-2.17 | App lock (PIN / biometrics) | `expo-local-authentication` |
| NF-2.19 | Sync conflict resolution UI | When LWW ambiguous |
| NF-2.20 | Prayer time manual offset | Masjid ±N minutes per prayer |
| NF-2.21 | High-latitude rule override | Beyond `HighLatitudeRule.recommended` |
| NF-2.23 | Seasonal themes | Ramadan/Hajj accent presets |
| NF-2.24 | In-app feature tours | Beyond `(onboarding)/intro` |

---

## Suggested roadmap (phased)

### Phase A — Trust & daily habit (2–4 weeks)

1. NF-0.1, NF-0.2 — Prayer method + madhab UI  
2. NF-0.3, NF-0.4 — Sync status + expanded entities  
3. NF-0.5 — Adhan notification option  
4. NF-1.18, NF-1.30 — Native widgets + app icon quick actions (iOS + Android dev builds)

**Exit gate:** `pnpm turbo run lint check-types test` green; manual test on iOS + Android dev builds.

### Phase B — Ramadan & seasons (before next Ramadan)

1. NF-1.1 — Ramadan mode  
2. NF-2.1 — Islamic events (minimal)  
3. NF-1.24, NF-1.25 — Daily content + Friday notifications  
4. NF-1.17 — Unified debt dashboard polish

### Phase C — Qur'an depth

1. NF-0.6 — Juz browser  
2. NF-1.8 — Khatm planner  
3. NF-1.9 — Hifz lite  
4. NF-1.10 — Tafsir on-demand  

### Phase D — Inclusivity, travel & worship education

1. NF-1.2 — Hayd mode  
2. NF-1.3, NF-1.4 — Travel / sick modes  
3. NF-1.33 — Salah guide (wudu, steps, rakats)  

### Phase E — Platform polish

1. NF-1.20 — Local backup  
2. NF-1.21, NF-1.22 — Home customization + Library tab  
3. NF-1.31, NF-1.32 — Arabic font family + in-context reading size controls  
4. NF-1.29 — Accessibility audit  

---

## Implementation guides (by subsystem)

### Adding a new screen

1. Create route: `apps/app/src/app/<feature>/index.tsx` (or `[param].tsx`).
2. Wrap in `ScreenLayout` with `onBack` for stack screens.
3. Use `Stagger` for entrance animation; `Card` + `SectionHeader` for sections.
4. Register navigation from home `quickActions` in `(tabs)/index.tsx` and/or settings row.
5. Add i18n keys under a dedicated namespace in `en.json`, `ar.json`, `ur.json`.

### Adding persisted state

1. Define types in `packages/shared/src/types/`.
2. Add `DB_KEYS` entry in `apps/app/src/db/keys.ts`.
3. Create `apps/app/src/db/repositories/<name>-repository.ts` using `readJSON`/`writeJSON`/`withKeyLock`.
4. Create store in `apps/app/src/stores/<name>-store.ts` mirroring `preferences-store.ts`.
5. Load in `providers/app-providers.tsx` or feature `useEnsure*Loaded` hook.
6. Add repository tests in `repositories.test.ts` or dedicated `*.test.ts`.
7. Include key in `resetDatabase()` for account deletion flow (`profile/index.tsx`).

### Extending sync

Current entities: `prayer_logs`, `zikr_progress`, `qaza_entries`, `preferences`, `favorites`.

1. Add the entity id to `SYNC_ENTITIES` in `apps/api/src/sync/dto/sync.dto.ts` (payload is opaque JSONB — no new server logic).
2. Run `pnpm generate:api` (regenerates `packages/api-contract/openapi.json` + `@munib-tracker/api-client`).
3. Extend `LocalSnapshot` + `buildSyncRecords()` in `sync/records.ts` (mirror the `favorites` record).
4. Handle the entity in `applyRemoteRecords()` in `sync-engine.ts` with LWW on `updatedAt`; add an `applyRemote*` method + `updatedAt` + tombstone support to its repo/store.
5. Add round-trip + LWW + tombstone tests to `sync/sync-engine.test.ts`.
6. Surface sync status per NF-0.3. Gate: also run `pnpm --filter api test`.

### Extending notifications

1. Add toggle to `NotificationPreferences` in `packages/shared/src/types/preferences.ts` + defaults in `constants/index.ts`.
2. Wire toggle in `settings/notifications.tsx`.
3. Emit reminders in `lib/notifications/build-reminders.ts`.
4. Add tests in `lib/notifications/build-reminders.test.ts`.
5. Call `rescheduleAll()` after pref change.

### Extending search

1. Read `.agents/skills/fuse-js/SKILL.md`.
2. Add corpus to `lib/search.ts` with `normalize()` on indexed fields.
3. For universal search: extend `SearchCategory`, `searchLight()`, and `app/search.tsx` filters.
4. For screen-local: add `searchXList()` or `createXSearch()` per `apps/app/AGENTS.md`.
5. Update `lib/search.test.ts` and `__tests__/search.feature.test.tsx` if UX-critical.

### Adding remote content editions

1. Follow `api/quran-remote.ts` / `api/hadith-remote.ts` cache-first pattern.
2. Persist via `QuranCacheRepository` / `HadithRepository` + `DB_KEYS` cache entries.
3. Document sources in `docs/FREE_OPEN_SOURCE_DATA.md`.
4. For bundled content: use `apps/app/scripts/build-data/` pipeline per `DATA_INGESTION_TODO.md`.

### Adding API endpoints

1. Read `apps/api/AGENTS.md` and `.agents/skills/nestjs/SKILL.md`.
2. Module under `apps/api/src/<module>/`.
3. Swagger decorators on all DTOs/controllers.
4. `pnpm generate:api` → use `@munib-tracker/api-client` in app.
5. Vitest e2e in `apps/api/test/`.

### Marketing site updates

When a P1 feature ships, update:

- `packages/shared/src/constants/features.ts` (`APP_FEATURE_PILLARS`, `APP_HOME_FEATURES`)
- `apps/marketing-web` feature sections if visible on landing page

### Native widgets & app icon shortcuts

1. Read `.agents/skills/expo-deployment/SKILL.md` — widgets and shortcuts require **EAS dev/production builds**, not Expo Go.
2. **iOS widgets:** WidgetKit extension + App Group for shared prayer-time JSON; update timeline on app foreground and at prayer boundaries.
3. **Android widgets:** `RemoteViews` widget + `SharedPreferences` or equivalent; match iOS data schema where possible.
4. **Quick actions:** declare static shortcuts in `app.config.ts` (Expo plugin or config mod); handle launch URL in `app/_layout.tsx` before initial route resolves.
5. Deep-link targets must exist as Expo Router paths (`/tracker`, `/qibla`, `/tasbeeh/free`, `/`).
6. Manual QA checklist: cold start from each shortcut; widget tap; widget refresh after location change.

### Reading typography (Arabic family + in-context size)

1. Extend `FontPreferences` in `packages/shared/src/types/preferences.ts` if adding `readingOverrides` per NF-1.32.
2. Bundle Arabic fonts via `expo-font` in root layout; register in `lib/reading-typography.ts`.
3. Wire `fontPrefs.arabic.family` in `components/themed-text.tsx` for `type="arabic"`.
4. Add `components/reading-font-controls.tsx`; pass into `ScreenLayout` via optional `headerAccessory` or screen-local header row.
5. Migrate hardcoded Qur'an ayah styles in `quran/[surah].tsx` to shared resolver.
6. Ensure `ReadingCard`, hadith rows, and names list use the same hook — one implementation, all surfaces.
7. Tests: `lib/reading-typography.test.ts` for clamp/delta math; snapshot optional for `ReadingCard` sizes.

### Salah guide content

1. Define types in `packages/shared/src/types/salah-guide.ts` (`SalahGuideTopic`, `SalahGuideStep`, `PrayerRakatSummary`, etc.).
2. Add bundled content in `packages/shared/src/content/salah-guide.ts` with `SALAH_GUIDE_CONTENT_VERSION`.
3. Export from `packages/shared/src/content/index.ts`; add accessor `apps/app/src/lib/salah-guide.ts`.
4. Routes under `apps/app/src/app/salah-guide/` — hub + topic screens; reuse `PRAYER_INFO` from `lib/prayer-info.ts` on per-prayer pages.
5. Wire discovery: home `quickActions`, tracker header, optional `search.ts` category.
6. i18n: `salahGuide.*` namespace in en/ar/ur; scholar disclaimer string reused on calculator/qaza screens.
7. Tests: shared content shape test; feature test navigating hub → wudu → back.

---

## UX observations to preserve

**Strengths (do not regress):**

- Offline-first + guest-first (`profile`, no forced sign-in)
- Fuse universal search (`search.tsx`)
- Deep qaza tooling (`qaza/calculator`, `qaza/planner`, `qaza/roza`)
- Continue card + knowledge flash card (passive re-engagement)
- Gentle, opt-in notifications (all categories off by default)

**Friction to address in P1:**

- Only 3 tabs; 16 home quick actions hurt discoverability → NF-1.22, NF-1.23
- Prayer settings live in code but not UI → NF-0.1, NF-0.2
- Sync narrower than user expects for bookmarks → NF-0.4

---

## Related documents

| Document | Purpose |
|----------|---------|
| [`docs/TODO.md`](./TODO.md) | Original phased PRD (baseline + Phase 8 sync) |
| [`docs/DATA_INGESTION_TODO.md`](./DATA_INGESTION_TODO.md) | Content pipeline (Qur'an, hadith, audio) |
| [`docs/FREE_OPEN_SOURCE_DATA.md`](./FREE_OPEN_SOURCE_DATA.md) | Approved data sources |
| [`AGENTS.md`](../AGENTS.md) | Monorepo conventions |
| [`apps/app/AGENTS.md`](../apps/app/AGENTS.md) | Expo app + Fuse.js rules |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-07-04 | Initial backlog from product review of shipped `apps/app` features |
| 2026-07-04 | Removed NF-1.27, NF-1.28, NF-2.5, NF-2.6, NF-2.16, NF-2.18, NF-2.22, NF-2.25, NF-2.26 |
| 2026-07-04 | Added NF-1.18 (native widgets), NF-1.30 (app icon quick actions), NF-1.31 (Arabic font family), NF-1.32 (in-context reading font size) with detailed requirements |
| 2026-07-04 | Added NF-1.33 Salah guide (wudu, step-by-step salah, rakats); noted partial baseline via `PrayerInfoSheet` |
| 2026-07-05 | Rewrote every P0 item as a numbered end-to-end **Flow** + complete AC; added **Verified codebase facts**; corrected drift against source (sync entity `qaza_entries` not `qaza_counter`; `syncNow` already on the auth context; `juzForAyah` is module-private; `assets/fonts/` does not exist yet; reminders already use real computed `adhan` times; full `NotificationPreferences`/`FontPreferences` shapes); fixed "Zustand" → zero-dep `createStore` wording |
| 2026-07-05 | **Shipped all P0 items (NF-0.1 – NF-0.8).** Greenfield build: favorites now share a `createFavoritesStore` factory; sync gained 5 blob-LWW entities (dua/durood/name favorites, quran bookmarks + last-read, hadith bookmarks, custom tasbeeh); adhan notification option added a `prayerAdhan` channel + `playAdhanOnPrayer` pref; new `parsePrayerImport` shared util + import screen; Juz browser + durood/name in-screen search & favorites. All gates green (app/shared/api check-types, biome, 251 app + 74 shared + 36 api tests). |
| 2026-07-06 | **Shipped 13 P1 items:** NF-1.31 Arabic font family + NF-1.32 in-context text size (`lib/reading-typography.ts`, `ReadingFontControls`, Qur'an reader un-hardcoded); NF-1.1 Ramadan mode (`lib/ramadan.ts`, fasting store, `/ramadan`, home card); NF-1.2 Hayd + NF-1.4 Sick + NF-1.5 Jama' (PrayerLog flags, `computeStreak` freezes across excused days); NF-1.15 qaza history + NF-1.16 planner suggestions; NF-1.24 daily + NF-1.25 Friday notifications; NF-1.6 weekly report; NF-1.20 local backup; NF-1.7 per-prayer reminder offsets. All greenfield, en/ar/ur, gates green (264 app + 80 shared tests, biome + all check-types clean). Remaining P1 (travel/khatm/hifz/tafsir/mushaf/editions/side-by-side/offline-mgr/debt-dashboard/home-modules/library-tab/quick-actions/adhan-styles/a11y/salah-guide), native (widgets/live-activities/shortcuts), and all P2 still open. |
| 2026-07-06 | **Shipped remaining P1 + all achievable P2.** P1: travel guide, khatm planner, hifz lite, tafsir on-demand, expanded reciters/editions, side-by-side translations, offline-data manager, unified debt dashboard, home customization + quick-action order, 4th Library tab, adhan-style picker, salah guide, native app-shortcuts. **P2 software (all en/ar/ur, gates green):** NF-2.1 Islamic events, NF-2.2 zakat, NF-2.11 custom adhkar, NF-2.13 Tahajjud streak (`computePrayerStreak`/`longestPrayerStreak` in shared streak.ts + `/tahajjud`), NF-2.23 seasonal themes (`lib/seasonal-themes.ts`, Ramadan/Hajj accent presets in Appearance), NF-2.12 khushu journal (`/journal` + `khushu-store`), NF-2.20 masjid offset + NF-2.21 high-latitude rule (`/settings/prayer-tuning`, `PrayerCalcExtras` on the adhan compute path), NF-2.10 daily hadith series (`lib/daily-hadith.ts` + `/hadith/daily`), NF-2.3 Hajj & Umrah checklist (`content/hajj-guide.ts` + `/hajj`), NF-2.4 Seerah timeline (`content/seerah.ts` + `/seerah`), NF-2.19 sync conflict UI (SyncMetadata outcome fields + profile merge summary), NF-2.24 in-app feature tours (`/tour` + `tours-store`). Final gates: shared 100 + app 315 tests green, full-repo biome clean, app+shared check-types clean. **Still open — blocked on data, not fabricated:** NF-2.7 word-by-word, NF-2.8/2.9 hadith sharh/narrators, NF-1.11 604-page mushaf. |
| 2026-07-08 | **NF-2.14 / NF-2.15 shipped:** Apple Watch (`targets/munib-tracker-watch`), Wear OS tile (`withWearOs.cjs`, `modules/munib-wear`), Siri App Intents + Android App Actions (`targets/munib-tracker-intents`, `withExternalCommands.cjs`), shared `external-commands` + `modules/munib-external-commands`, Settings → Siri & voice shortcuts, `docs/NATIVE_SURFACES.md`. |
