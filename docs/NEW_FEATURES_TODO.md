# Munib Tracker — New Features TODO

> **Purpose:** Backlog of product enhancements beyond the shipped baseline in [`docs/TODO.md`](./TODO.md). Each item includes priority, requirements, key file paths, and acceptance criteria aligned with monorepo conventions.
>
> **Last reviewed:** 2026-07-04  
> **Apps:** `apps/app` (Expo SDK 57) · `apps/marketing-web` (Next.js 16) · `apps/api` (NestJS 11)  
> **Agent guides:** [`AGENTS.md`](../AGENTS.md), [`apps/app/AGENTS.md`](../apps/app/AGENTS.md), [`apps/api/AGENTS.md`](../apps/api/AGENTS.md)

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
- **State:** Zustand-style stores via `createStore` (`apps/app/src/stores/create-store.ts`); persist via repositories in `apps/app/src/db/`.
- **New persisted data:** add keys to `apps/app/src/db/keys.ts`, repository in `apps/app/src/db/repositories/`, export from `apps/app/src/db/index.ts`, register in `resetDatabase()`.
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

### NF-0.1 — Prayer calculation method picker

| | |
|---|---|
| **Priority** | P0 |
| **Scope** | `app` |
| **Status** | `partial` |
| **Problem** | `locationStore.setMethod()` and `StoredLocation.method` exist; defaults to `MuslimWorldLeague` in `lib/prayer-times.ts`. No user-facing control. |
| **Key files** | `app/location/index.tsx`, `stores/location-store.ts`, `lib/prayer-times.ts`, `lib/location.ts` |
| **Requirements** | Segmented control or picker listing `CalculationMethodKey` values from `adhan`. Persist via `LocationRepository.update`. Reschedule notifications after change. Show current method on Location card. |
| **Guide** | Mirror `settings/time-format.tsx` (`SegmentedControl`). After save: `rescheduleAll(preferencesStore.getState().prefs, locationStore.getState().location)`. |
| **AC** | Changing method updates hero times, tracker schedule, and scheduled reminders; persists across restart; strings in en/ar/ur. |

### NF-0.2 — Asr madhab picker (Shafi / Hanafi)

| | |
|---|---|
| **Priority** | P0 |
| **Scope** | `app` |
| **Status** | `partial` |
| **Problem** | `locationStore.setMadhab()` exists; tested in `lib/prayer-times.test.ts` but no UI. |
| **Key files** | Same as NF-0.1 |
| **Requirements** | Two-option control (Shafi / Hanafi). Scholar-neutral copy. Reschedule notifications on change. |
| **AC** | Asr time shifts correctly (Hanafi later than Shafi); persisted; i18n complete. |

### NF-0.3 — Manual sync + sync status UI

| | |
|---|---|
| **Priority** | P0 |
| **Scope** | `app` |
| **Status** | `partial` |
| **Problem** | `syncNow()` in `auth-provider.tsx` runs on sign-in and app foreground only. No user feedback or manual trigger. |
| **Key files** | `app/profile/index.tsx`, `providers/auth-provider.tsx`, `sync/sync-engine.ts`, `db/keys.ts` (`syncMetadata`) |
| **Requirements** | Profile row: last synced time (from `DB_KEYS.syncMetadata.lastSyncedAt`), "Sync now" button, loading/error states. Expose `syncNow` from `useAuth()`. Guest shows sign-in CTA only. |
| **AC** | Signed-in user can force sync; timestamp updates on success; errors show toast, no crash offline. |

### NF-0.4 — Expand cloud sync entities

| | |
|---|---|
| **Priority** | P0 |
| **Scope** | `multi` |
| **Status** | `partial` |
| **Depends on** | NF-0.3 |
| **Problem** | `buildSyncRecords()` syncs prayer logs, zikr, qaza, preferences, zikr favorites only. Not synced: Qur'an bookmarks, hadith bookmarks, dua favorites, custom tasbeeh, quran last-read, achievements. |
| **Key files** | `sync/records.ts`, `sync/sync-engine.ts`, `apps/api/src/sync/`, `packages/shared/src/types/` |
| **Requirements** | Add sync entities + DTOs in API OpenAPI spec. Client repositories: `applyRemote*` with last-write-wins on `updatedAt`. Regenerate client: `pnpm generate:api`. |
| **Guide** | Follow existing `favorites` entity pattern in `sync/records.ts`. Read `docs/TODO.md` Phase 8 sync section. |
| **AC** | Bookmarks and dua favorites round-trip across two devices; tombstones respected; tests in `sync-engine.test.ts`. |

### NF-0.5 — Adhan at prayer notification time

| | |
|---|---|
| **Priority** | P0 |
| **Scope** | `app` |
| **Status** | `partial` |
| **Problem** | `lib/adhan-audio.ts` supports preview in settings only. Scheduled reminders in `build-reminders.ts` are silent text nudges. |
| **Key files** | `lib/adhan-audio.ts`, `lib/notifications/build-reminders.ts`, `notifications/scheduler.ts`, `settings/notifications.tsx` |
| **Requirements** | New pref: `playAdhanOnPrayer` (per prayer or global). Attach bundled sound to obligatory prayer notifications where platform allows. Respect silent mode / web limitations (document in i18n). |
| **Guide** | Read `assets/audio/adhan/README.md`. Test on dev build (not Expo Go) for custom notification sounds. |
| **AC** | Optional adhan sound fires at prayer reminder on iOS/Android dev build; web shows limitation note; master toggle disables all. |

### NF-0.6 — Juz browser (metadata exists)

| | |
|---|---|
| **Priority** | P0 |
| **Scope** | `app` |
| **Status** | `partial` |
| **Problem** | `juzForAyah()` in `lib/quran.ts`; ayahs carry `juz` field. No Juz index screen. |
| **Key files** | `lib/quran.ts`, new route `app/quran/juz.tsx` or section in `quran/index.tsx` |
| **Requirements** | 30-juz list with starting surah:ayah; tap opens `quran/[surah]?ayah=`. Optional progress (% ayahs read) from `quran-store`. |
| **AC** | All 30 juz navigate correctly; last-read progress shown if available; themed + i18n. |

### NF-0.7 — Duroods & Names: search + favorites

| | |
|---|---|
| **Priority** | P0 |
| **Scope** | `app`, `shared` |
| **Status** | `partial` |
| **Problem** | Universal search indexes duroods/names via `search.ts`, but list screens lack local search/favorites. |
| **Key files** | `app/duroods/index.tsx`, `app/names-of-allah/index.tsx`, `lib/search.ts`, `stores/preferences-store.ts` or dedicated stores |
| **Requirements** | Extend search helpers if needed (`createDuroodSearch`, etc.). Favorites pattern mirrors dua/zikr. Bookmarks hub optional new section. |
| **Guide** | Follow `dua/favorites.tsx` and `searchDuaList` pattern in `apps/app/AGENTS.md`. |
| **AC** | Favorite durood/name persists; appears in bookmarks hub or dedicated list; Fuse tests updated. |

### NF-0.8 — Bulk historical prayer import

| | |
|---|---|
| **Priority** | P0 |
| **Scope** | `app`, `shared` |
| **Status** | `partial` |
| **Problem** | `PrayerLogSource` includes `bulk_import` but no import UI. |
| **Key files** | `packages/shared/src/types/prayer.ts`, `db/repositories/prayer-repository.ts`, new `app/settings/import.tsx` or qaza calculator flow |
| **Requirements** | CSV/JSON import with validation; preview before commit; scholar disclaimer for qaza estimates. |
| **AC** | Import creates logs with `source: "bulk_import"`; qaza counters optionally updated; botched file rejected with clear error. |

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
| **Status** | `todo` |
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
| **Status** | `todo` |
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
| **Status** | `partial` |
| **Problem** | `FontScopePrefs.family` exists on `fontPrefs.arabic` (`packages/shared/src/types/preferences.ts`) but `settings/fonts.tsx` only exposes **size** presets (S/M/L). Arabic renders via `ThemedText type="arabic"` without a user-chosen typeface. |
| **Key files** | `app/settings/fonts.tsx`, `components/themed-text.tsx`, `components/content/reading-card.tsx`, `app/quran/[surah].tsx`, `app/hadith/[collection].tsx`, `constants/theme.ts` (`Fonts`), bundled font assets under `apps/app/assets/fonts/` |
| **Requirements** | 1) Settings screen: picker listing **bundled** Arabic-capable fonts (minimum: system default, Amiri or Scheherazade, Noto Naskh Arabic — all bundled via `expo-font`, no runtime download). 2) Persist selection to `fontPrefs.arabic.family`. 3) Apply globally wherever Arabic script appears: Qur'an ayahs, hadith Arabic, duas/zikr/durood `ReadingCard`, 99 Names, tasbeeh Arabic labels, knowledge flash card Arabic. 4) Live preview on Fonts screen (reuse existing preview card). 5) Sync Arabic family via preferences sync entity when NF-0.4 ships. |
| **Guide** | Load fonts with `expo-font` in `app/_layout.tsx` before first Arabic render. Map family id → `fontFamily` in a single helper e.g. `lib/reading-typography.ts` consumed by `ThemedText` and reading surfaces — avoid duplicating font resolution per screen. RTL `writingDirection` unchanged. |
| **AC** | Changing Arabic font in Settings updates Qur'an reader + ReadingCard + hadith list without restart; persists across app relaunch; en/ar/ur strings for font names; web falls back to CSS webfont or system stack. |

### NF-1.32 — In-context reading font size override

| | |
|---|---|
| **Priority** | P1 |
| **Scope** | `app`, `shared` |
| **Status** | `todo` |
| **Depends on** | NF-1.31 (shared typography helper recommended) |
| **Problem** | Global S/M/L sizes in Settings (`settings/fonts.tsx`) are coarse. Users reading a long surah or hadith need **on-the-spot** text sizing without leaving the screen. Qur'an surah reader (`quran/[surah].tsx`) still uses hardcoded `fontSize: 26` in styles — not wired to `fontPrefs` today. |
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
| **Status** | `todo` |
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
| NF-2.14 | Apple Watch / Wear OS | Quick mark-prayed |
| NF-2.15 | Siri / Assistant shortcuts | Deep links to tracker actions |

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

1. Add entity to OpenAPI sync schema in `apps/api/src/sync/`.
2. Run `pnpm generate:api`.
3. Extend `LocalSnapshot` + `buildSyncRecords()` in `sync/records.ts`.
4. Handle entity in `applyRemoteRecords()` in `sync-engine.ts`.
5. Add tests to `sync/sync-engine.test.ts`.
6. Surface sync status per NF-0.3.

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
