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
| Salah tracker (6 obligatory + Witr + 5 sunnah) | `(tabs)/tracker`, `calendar/[date]` | `stores/tracker-store.ts`, `components/prayer-status-sheet.tsx`, `db/repositories/prayer-repository.ts` |
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
| NF-1.18 | **Home screen widgets** | app | Expo widgets / `expo-widgets` when available | Next prayer + countdown + today progress |
| NF-1.19 | **Live Activities (iOS)** | app | native module or Expo plugin | Lock-screen next-prayer countdown |
| NF-1.20 | **Local backup export/import** | app | new settings flow, JSON schema in `shared` | Export all `DB_KEYS` data; import with validation; no account required |
| NF-1.21 | **Customizable home modules** | app, shared | `(tabs)/index.tsx`, prefs | Reorder/hide cards: goal, qaza, schedule, knowledge |
| NF-1.22 | **Library tab (4th tab)** | app | `components/app-tabs.tsx`, move routes | Qur'an / Hadith / Duas / Zikr entry; reduces 16-tile grid clutter |
| NF-1.23 | **Customizable quick actions** | app, shared | home `quickActions`, prefs | User pins 4–8 shortcuts |

### Notifications & content

| ID | Feature | Scope | Key touchpoints | AC summary |
|----|---------|-------|-----------------|------------|
| NF-1.24 | **Daily ayah / hadith notification** | app | `knowledge-card-data.ts`, `build-reminders.ts` | Opt-in daily content push |
| NF-1.25 | **Friday reminders** | app | extend knowledge Friday entries | Jumu'ah + Surah Al-Kahf nudge |
| NF-1.26 | **Adhan style picker** | app | `lib/adhan-audio.ts`, settings | Multiple bundled adhan MP3s if assets added |

### Accessibility

| ID | Feature | Scope | Key touchpoints | AC summary |
|----|---------|-------|-----------------|------------|
| NF-1.29 | **Accessibility audit** | app | VoiceOver / TalkBack on tracker, qibla, tasbeeh | Meaningful labels; reduced motion respected (`useReducedMotion`) |

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
4. NF-1.18 or NF-1.19 — Widgets / Live Activity (platform pick)

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

### Phase D — Inclusivity & travel

1. NF-1.2 — Hayd mode  
2. NF-1.3, NF-1.4 — Travel / sick modes  

### Phase E — Platform polish

1. NF-1.20 — Local backup  
2. NF-1.21, NF-1.22 — Home customization + Library tab  
3. NF-1.29 — Accessibility audit  

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
