# Shipped product features

Stable IDs (`NF-*`) for features beyond the MVP baseline. Open work: [`BACKLOG.md`](./BACKLOG.md).

---

## Trust & sync (P0)

| ID | Feature | Key touchpoints |
|----|---------|-------------------|
| NF-0.1 | Prayer calculation method picker | `app/location`, `lib/prayer-times.ts`, `rescheduleAll` |
| NF-0.2 | Asr madhab picker (Shafi / Hanafi) | Location screen `SegmentedControl` |
| NF-0.3 | Manual sync + status UI | `profile/index.tsx`, `syncNow()`, `readSyncMetadata()` |
| NF-0.4 | Expanded cloud sync entities | Typed record sync + **28** blob-LWW entities in `sync/blob-sync.ts`; API whitelist `SYNC_ENTITIES` (**40** total) in `apps/api` — includes location/calc settings, reading-text visibility, hadith reading prefs, zakat draft, tours, and appearance via the preferences blob |
| NF-0.5 | Adhan at prayer notification | `playAdhanOnPrayer`, `build-reminders.ts`, Android channel |
| NF-0.6 | Juz browser | `/quran/juz`, `getJuzList()` |
| NF-0.7 | Durood & Names search + favorites | `createFavoritesStore`, in-screen Fuse search |
| NF-0.8 | Bulk prayer import | `parsePrayerImport`, `/settings/import` |

---

## Worship & seasons (P1)

| ID | Feature | Key touchpoints |
|----|---------|-------------------|
| NF-1.1 | Ramadan mode | `lib/ramadan.ts`, `/ramadan`, fasting store |
| NF-1.2 | Hayd / excused period | Streak freeze, excused-day UI |
| NF-1.3 | Travel guide (Qasr / Jam') | `/travel` |
| NF-1.4 | Sick / unable mode | `ExcusedDayPicker`, calendar |
| NF-1.5 | Jama' flag | `PrayerLog.isJama` |
| NF-1.6 | Weekly worship report | `buildWeeklyReport` |
| NF-1.7 | Per-prayer reminder offsets | `/settings/reminder-offsets` |
| NF-1.33 | Salah guide | `content/salah-guide.ts`, `/salah-guide` |

---

## Qur'an & learning (P1)

| ID | Feature | Key touchpoints |
|----|---------|-------------------|
| NF-1.8 | Khatm / reading plan | `lib/khatm.ts`, `/quran/khatm`; home card + Today's Goal badge when plan active; tracker checklist + glance ring |
| NF-1.9 | Hifz tracker (lite) | `/quran/hifz` |
| NF-1.10 | Tafsir on-demand (spa5k multi-lang + Siraj; language/author picker; ayah icon sheet) | `api/quran-tafsir.ts`, `quran-tafsir-registry`, `TafsirPickerSheet`, `TafsirAyahSheet` |
| NF-1.11 | Mushaf / 604-page view | `build-mushaf-layout.mjs`, `/quran/pages`, `/quran/page/[page]`, `qcf-font-cache.ts` |
| NF-1.12 | More translations & reciters | `scripts/build-data/`, `REMOTE_EDITIONS` |
| NF-1.13 | Side-by-side translations | `secondaryTranslationId` |
| NF-1.14 | Offline download manager | `/settings/offline-data` |
| NF-1.35 | Immersive Qur'an reading (web fullscreen + iOS/Android system bars) | `use-reading-fullscreen`, `reading-toolbar`, `screen-layout` |

---

## Qaza & accountability (P1)

| ID | Feature | Key touchpoints |
|----|---------|-------------------|
| NF-1.15 | Qaza history log | `/qaza/history` |
| NF-1.16 | Smart planner suggestions | `suggestDailyQazaTargets` |
| NF-1.17 | Unified debt dashboard | `QazaSummaryCard` (prayer + roza) |

---

## Platform & retention (P1)

| ID | Feature | Key touchpoints |
|----|---------|-------------------|
| NF-1.18 | Native home-screen widgets (HIG budgets, live countdown, Mark, dual theme, localized picker, previews) — incl. Tasbeeh glance (small) and Jumu'ah nudge (checklist progress or countdown) | `appSurfaces/widgets`, [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md) |
| NF-1.19 | Live Activities (iOS) + ongoing countdown notification (Android); phase windows (Mark → after-Salah → upcoming); ActivityKit remote push for closed-app updates; one-shot discovery banner in Settings → Notifications when supported and still off | `modules/munib-live-activity`, ActivityKit, `lib/live-activity`, `@munib-tracker/live-activity-delivery`, `lib/ongoing-notification`, `components/notifications/live-activity-discovery-banner.tsx`; ops: [`LIVE_ACTIVITY_PUSH.md`](./LIVE_ACTIVITY_PUSH.md) |
| NF-1.20 | Local backup export/import | `lib/backup.ts`, `/settings/backup` |
| NF-1.21 | Customizable home modules | `hiddenHomeModules`, `/settings/home` |
| NF-1.22 | Library tab (4th tab) | `lib/library-menu.ts` |
| NF-1.23 | Customizable quick actions | `quickActionOrder` |
| NF-1.24 | Daily content notification | `/hadith/daily` |
| NF-1.25 | Friday reminders | Jumu'ah + Kahf nudge at 11:00; hour of acceptance at Asr + mid Asr→Maghrib (`build-reminders.ts`, Today's Goal banner) |
| NF-1.26 | Adhan style picker | `lib/adhan-audio.ts`, bundled MP3s |
| NF-1.29 | Accessibility audit | Reduced motion, labelled controls |
| NF-1.30 | App icon quick actions | `expo-quick-actions`, `(tabs)/_layout.tsx` |
| NF-1.31 | Arabic font family picker | `lib/reading-typography.ts`, `assets/fonts/` |
| NF-1.32 | In-context reading font size | `ReadingFontControls`, `readingOverrides` |
| NF-1.34 | Ops admin broadcasts (in-app + push) | kind `admin_announcement`; `notifications-api.ts`; console [`ADMIN_BROADCASTS.md`](./ADMIN_BROADCASTS.md) |

---

## Lifestyle & tracker depth (P2)

| ID | Feature | Key touchpoints |
|----|---------|-------------------|
| NF-2.1 | Islamic events calendar | `lib/islamic-events.ts`, `/events` |
| NF-2.2 | Zakat calculator (+ edu) | `lib/zakat.ts`, `/zakat` — sadaqah goals/log is open (`NF-2.18`) |
| NF-2.3 | Hajj & Umrah learn + separate checklists | `content/hajj-guide.ts`, `hajj-checklist.ts`, `umrah-checklist.ts`, `/hajj`, `/hajj/checklist`, `/umrah/checklist` |
| NF-2.4 | Seerah timeline | `content/seerah.ts`, `/seerah` |
| NF-2.27 | Sahaba directory | `content/sahaba.ts`, `/sahaba` |
| NF-2.28 | Early Islamic history | `content/islamic-history.ts`, `/history` |
| NF-2.29 | Laylat al-Qadr guide | `content/laylat-al-qadr.ts`, `/laylat-al-qadr` |
| NF-2.30 | Eid guide | `content/eid-guide.ts`, `/eid` |
| NF-2.31 | Ruqyah guide | `content/ruqyah.ts`, `/ruqyah` |
| NF-2.32 | New Muslim guide | `content/new-muslim.ts`, `/new-muslim` |
| NF-2.33 | Islamic finance (edu) | `content/islamic-finance.ts`, `/finance` |
| NF-2.34 | Hijri ↔ Gregorian converter | `lib/hijri.ts`, `/calendar/converter` |
| NF-2.35 | Friday / Jumu'ah learn hub & checklist | `content/friday-guide.ts`, `/friday`, Today's Goal Friday + hour-of-acceptance banners, `friday_checklist` sync |
| NF-2.7 | Word-by-word + tajweed reader | `api/quran-words.ts`, `api/quran-tajweed.ts`, ayah reader toggles |
| NF-2.10 | Daily hadith series | `lib/daily-hadith.ts`, `/hadith/daily` |
| NF-2.11 | Custom adhkar builder | `custom-adhkar-store`, `/adhkar-builder` (optional private images via `/user-media`; dictate Arabic/transliteration/meaning via `expo-speech-recognition` — requires a native dev/production build) |
| NF-2.12 | Prayer journal / khushu | `khushu-store`, `/journal` |
| NF-2.13 | Tahajjud streak | `computePrayerStreak`, `/tahajjud` |
| NF-2.14 | Apple Watch / Wear OS | `targets/munib-tracker-watch`, `targets/munib-tracker-watch-widgets`, `modules/munib-wear` |
| NF-2.15 | Siri / Assistant shortcuts | `targets/munib-tracker-intents`, `external-commands` |
| NF-2.17 | App lock (PIN / biometrics) | `features/pin-lock`, `/settings/app-lock` |
| NF-2.19 | Sync conflict resolution UI | SyncMetadata outcome, profile merge |
| NF-2.20 | Prayer time manual offset | `/settings/prayer-tuning` |
| NF-2.21 | High-latitude rule override | `PrayerCalcExtras` |
| NF-2.23 | Seasonal themes | `lib/seasonal-themes.ts` |
| NF-2.24 | In-app feature tours | `lib/feature-tours.ts`, `/tour` |

---

## Marketing source of truth

Product pillars for landing copy: `packages/shared/src/constants/features.ts` (`APP_FEATURE_PILLARS`, `APP_HOME_FEATURES`).

---

## Out of scope

NF-1.27, NF-1.28, NF-2.22, NF-2.25, NF-2.26 — reserved / not implemented.

Open product (see [`BACKLOG.md`](./BACKLOG.md)): NF-2.5, NF-2.6, NF-2.16, NF-2.18, NF-2.36.

Data-blocked (see [`BACKLOG.md`](./BACKLOG.md)): NF-2.8, NF-2.9.
