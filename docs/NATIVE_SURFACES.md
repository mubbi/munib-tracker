# Native surfaces (widgets, Live Activities, voice, watch)

Native home-screen widgets, Live Activities, Siri/Assistant shortcuts, Apple Watch,
and Wear OS companion surfaces share the **`appSurfaces`** architecture.

## Architecture

| Layer | Path | Role |
|-------|------|------|
| Quick actions registry | `src/lib/appSurfaces/quickActions/` | Icon long-press shortcuts (NF-1.30) |
| Intent registry | `src/lib/appSurfaces/intents/registry.ts` | Siri / Assistant phrase catalog (NF-2.15) |
| Widget snapshot | `src/lib/appSurfaces/widgets/buildWidgetSnapshot.ts` | Localized schedule + status JSON |
| Shared storage | `src/lib/appSurfaces/widgets/snapshotStorage.ts` | AsyncStorage + iOS App Group |
| External commands | `src/lib/external-commands/` | Mark-prayed queue + JS executor |
| Native command module | `modules/munib-external-commands/` | App Group queue, WatchConnectivity snapshot push, Wear snapshot push |
| Wear listener | `modules/munib-wear/` | Wear OS message → command queue |
| iOS WidgetKit | `targets/munib-tracker-widgets/` | Home + lock-screen widgets + Live Activity UI |
| iOS App Intents | `targets/munib-tracker-intents/` | Siri background mark + navigation (NF-2.15) |
| Apple Watch | `targets/munib-tracker-watch/` | SwiftUI schedule + mark (NF-2.14) |
| Watch complications | `targets/munib-tracker-watch-widgets/` | WidgetKit face complications (NF-2.14) |
| Live Activity control | `modules/munib-live-activity/` | ActivityKit start/update/end |
| Config plugins | `plugins/homeScreenSurfaces.cjs`, `withExternalCommands.cjs`, `withWearOs.cjs` | Native project wiring |
| Hooks | `use-app-quick-actions.ts`, `use-widget-snapshot-sync.ts`, `use-external-command-processor.ts` | Sync + drain loops |

**App Group:** `group.app.munibtracker.widgets`

| Key | Purpose |
|-----|---------|
| `widget_snapshot_v1` | Widget / watch read model |
| `pending_commands_v1` | Siri / watch / wear / assistant / **widget** mark commands |

## Widgets (NF-1.18)

| Widget | iOS families | Android cell | Shows |
|--------|-------------|--------------|-------|
| **Next Salah** | small, medium, lock-screen accessory | 4×2 | Next Salah name, time, live countdown |
| **Schedule** | small, medium, large, lock-screen | 4×4 | Today's five obligatory times (status dots + labels) |
| **Progress** | small, medium, lock-screen circular/rectangular | 2×2 | Fard progress (e.g. 3/5) + bar + Mark |
| **Salah streak** | small, medium, lock-screen | 2×2 | Current obligatory streak |
| **Qaza** | small, medium, lock-screen | 4×2 | Remaining debt + today's make-up progress |
| **Ramadan** | small, medium, lock-screen | 4×2 | Suhoor / iftar + live countdown |
| **Khatm** | small, medium, lock-screen | 4×2 | Reading-plan % and today's quota |
| **Daily hadith** | small, medium, large, lock-screen | 4×2 | Today's Nawawi hadith (localized meaning) |
| **Islamic date** | small, medium, lock-screen | 2×2 | Hijri + Gregorian |
| **Qibla** | small, medium, lock-screen | 2×2 | Static bearing toward the Kaaba |
| **Tasbeeh glance** | small, lock-screen accessory | 2×2 | Today's custom tasbeeh count/target (most recently updated counter) |
| **Jumu'ah** | small, medium, lock-screen | 4×2 (default) / 2×2 (small) | Friday checklist progress on Fridays, else countdown in days |

### Content budgets (Apple HIG / Android sizing)

| Size | Budget |
|------|--------|
| Small / 2×2 | One hero metric + one secondary line; no footer/CTA chrome |
| Medium / 4×2 | Hero + 1–2 supporting facts (following Salah, suhoor+iftar) |
| Large / 4×4 | Full schedule (5 rows) or denser hadith; optional `updatedAgo` |
| Accessory circular | Gauge + short label |
| Accessory rectangular / inline | Line + detail only |

### Snapshot & relevance

- **Single data path:** JS `buildWidgetSnapshot` → `widget_snapshot_v1` (AsyncStorage + iOS App Group).
- **Location denial** only blanks location-dependent sections (next / schedule / ramadan / qibla). Streak, qaza, progress, khatm, hadith, and Hijri stay filled.
- **Live countdown (iOS):** `Text(timerInterval:)` on Next Salah and Ramadan so minutes tick between timeline reloads.
- **Timeline:** denser `WidgetReloadSchedule` entries in the last ~30 minutes before Adhan; Android uses `requestWidgetUpdate` on sync + `updatePeriodMillis` fallback.
- **Freshness:** `updatedAgoLabel` is recomputed at render (`RelativeDateTimeFormatter` on iOS; `formatUpdatedAgo` on Android) so it does not freeze at write time.
- **Mark current Salah:** iOS `MarkCurrentSalahWidgetIntent` → App Group `pending_commands_v1`; Android Mark chip → `munib-tracker://mark-current` (same queue). Source tag: `widget`.
- **Tasbeeh glance (NF-1.18):** reads the most recently updated custom tasbeeh counter (`useTasbeehUpdatedToday`) if it was touched today; blank state opens `/tasbeeh/free`. No target set → shows the raw count with no progress bar.
- **Jumu'ah (NF-1.18):** on Fridays shows `fridayChecklistStore` progress (`completed/total`) for the local day; other days show a countdown in days to the next Jumu'ah, matching the Ramadan widget's dual-mode pattern.
- **Privacy:** location strings use `.privacySensitive()` on iOS (header summaries + next/qibla location lines).
- **Theme:** accent from the app. When Appearance is **System**, Android emits true light+dark RemoteViews trees and iOS adapts chrome via `@Environment(\.colorScheme)`. Forced light/dark uses the snapshot theme for both slots.
- **Picker copy:** iOS `Localizable.xcstrings` (en/ar/ur); Android `widget_gallery_strings.xml` via `plugins/withAndroidWidgetGallery.cjs` from `widgets.gallery.*`.
- **Previews:** unique PNGs under `assets/images/widget-previews/`; Android `previewLayout` + Android 15 `setWidgetPreview` (rate-limited); iOS placeholder + `#Preview`.

Snapshot fields are fully localized via the app `locale` (and hadith meaning via `translationLocale`). RTL locales set `isRtl` so WidgetKit / Android text align correctly.

**Native rebuild required** after Swift / Expo plugin / preview asset changes (`pnpm prebuild:app:ios` / `prebuild:app:android`).


## Live Activities (NF-1.19)

Opt-in iOS lock-screen + Dynamic Island countdown. Toggle in **Settings → Notifications → Live Activity**.

| Layer | Path |
|-------|------|
| Shared attributes | `modules/munib-live-activity/ios/PrayerActivityAttributes.swift` **and** `targets/munib-tracker-widgets/PrayerActivityAttributes.swift` (byte-for-byte identical) |
| Native control | `modules/munib-live-activity/ios/MunibLiveActivityModule.swift` |
| SwiftUI UI | `targets/munib-tracker-widgets/PrayerLiveActivity.swift` |
| JS bridge | `src/lib/live-activity/` — `syncLiveActivity()` after each widget snapshot write |
| Preference | `UserPreferences.liveActivityEnabled` (default off) |

**Flow:** snapshot refresh → `syncLiveActivity()` starts/updates/ends activity. `staleDate` = next phase boundary / next prayer; views use `Text(timerInterval:)` for ticking countdown while in the **upcoming** phase.

**Phase windows:** for ~15 minutes after the current Salah begins, the activity shows that Salah with **Mark Salah**; once marked (or after 15 minutes) through ~30 minutes it offers **after-Salah adhkar**; after 30 minutes it returns to the **upcoming Salah** countdown + Prepare. Qibla remains available on the expanded presentation.

**Remote updates (ActivityKit push):** activities start with `pushType: .token`. The app registers the per-activity APNs token + precomputed content-state updates at each phase boundary via `PUT /api/v1/live-activities`. Delivery uses APNs HTTP/2 through `@munib-tracker/live-activity-delivery`, scheduled with **Upstash QStash** (`notBefore`) and/or cron `POST …/internal/dispatch-due`. Full ops (env, cron, QStash free-tier fallback, future Fly.io worker): [`LIVE_ACTIVITY_PUSH.md`](./LIVE_ACTIVITY_PUSH.md). Local `Activity.update` still runs while the app is foregrounded.

**Presentations (Apple HIG):** Lock Screen + StandBy (`isActivityFullscreen`) show the active phase (upcoming countdown, Mark Salah, or after-Salah adhkar) plus today’s progress; Dynamic Island covers compact / minimal / expanded layouts. Accent `keylineTint` ties the island to the app palette.

**Requirements:** iOS **17.0+** (widget / Live Activity target `deploymentTarget`); `NSSupportsLiveActivities: true`; EAS dev/production build (not Expo Go). ActivityKit itself supports 16.2+, but Munib’s extension targets **17.0**.

**Attributes duplication:** ActivityKit matches by attributes type + Codable shape in both main app and widget extension — change both files together.

**Discovery banner (NF-1.19):** one-shot coach mark above the toggle in **Settings → Notifications** when the platform supports the live countdown (iOS Live Activity or Android ongoing notification) and the preference is still off. Uses `toursStore` with a dedicated id (`liveActivityDiscovery`, distinct from the `/tour` carousel ids) so it dismisses permanently once turned on or closed — `components/notifications/live-activity-discovery-banner.tsx`.

**Android Live Updates (Android 16):** Explicit **Track this Salah** on the Tracker starts a promoted ongoing notification with `ProgressStyle` segments (upcoming → Mark → after-Salah), status-chip text, and Stop/Unpin. Ambient sticky countdown still uses `liveActivityEnabled`. Multi-boundary `AlarmManager` flips phases while killed; Expo data corrections use `surface_push_*` + QStash ([`WEB_PUSH.md`](./WEB_PUSH.md)). Requires AndroidX Core ≥1.17 and `POST_PROMOTED_NOTIFICATIONS`. Pre-36 devices keep the Standard chronometer notification.

**Android ongoing countdown:** `lib/ongoing-notification/` + `OngoingSalahNotification.kt`; same preference gates ambient mode; Track session gates promotion.

## Siri & Assistant (NF-2.15)

| Intent | Behavior |
|--------|----------|
| Mark my Salah | Background — enqueues `mark-current-obligatory`, no UI |
| Mark a Salah (parameterized `SalahOption` AppEnum) | Background — enqueues `mark-prayer` for Fajr/Dhuhr/Asr/Maghrib/Isha |
| Open checklist / Qibla / Tasbeeh / Qur'an / Ramadan / Khatm / Qaza | Foreground — opens `munib-tracker://` route |

- iOS: `targets/munib-tracker-intents/_shared/MunibAppIntents.swift` — compiled into **both** the main app target and the `MunibTrackerIntents` App Intents extension (Apple requires the `AppShortcutsProvider` + its intents in the main app target; extension-only intents fail in Shortcuts with "internal error"). Foreground (`openAppWhenRun: true`) intents and the provider are app-only via the `MUNIB_INTENTS_EXTENSION` compile condition (`plugins/withAppIntentsExtensionDefine.cjs`); background mark intents also run in the extension so Siri doesn't launch the app.
- Queue writes post a Darwin notification (`app.munibtracker.commands.changed`) → `MunibExternalCommandsModule` emits `onCommandsAvailable` → a running app instance drains immediately (Siri, widget button, watch marks apply without waiting for the next foreground).
- Android: `plugins/withExternalCommands.cjs` → App Actions (`OPEN_APP_FEATURE` + inventory) + broadcast receiver + launcher shortcut (`android.app.shortcuts` → `@xml/shortcuts` → `munib-tracker://mark-current`)
- Android broadcast actions (must match Kotlin + manifest): `app.munibtracker.action.MARK_CURRENT` / `MARK_PRAYER`
- JS drain: `ExternalCommandProcessor` in root `_layout.tsx` (respects pin lock deferral); Android also emits `onCommandsAvailable` when the shared queue is written (Assistant, Wear, or JS enqueue)
- Help: **Settings → Siri & voice shortcuts** (iOS) / **Google Assistant & voice shortcuts** (Android)

**Play Console (App Actions uploads):** set Privacy policy to `https://munibtracker.app/privacy`, then **Setup → Advanced settings → App Actions → accept Terms of Service**.

**Force-quit limitation:** if the app process is killed, Siri/Assistant/widget/watch/Wear marks still enqueue into `pending_commands_v1`; the drain (`ExternalCommandProcessor`) only runs once the app is relaunched or foregrounded, so the visible mark (checklist tick, streak, widget refresh) is delayed until then — the queued command itself is never lost. Surfaced to users in **Settings → Siri & voice shortcuts** (`externalCommands.siriHint` / `assistantHint`).

**Mark my Salah (quick action / deep link):** only completes the *current window* obligatory Salah (never cascades to the next pending). Icon quick-action cold-start is handled once per launch so remounts cannot re-open `/mark-current` and mark again. Duplicate `mark-current-obligatory` entries in one drain pass are coalesced.

## Apple Watch (NF-2.14)

### Companion app

- Target: `targets/munib-tracker-watch/` (`type: "watch"`, watchOS 10+)
- Reads `widget_snapshot_v1` from App Group (same schema as WidgetKit)
- Marks via App Group command queue + WatchConnectivity nudge to phone
- Requires paired iPhone with Munib Tracker installed
- Phone pushes `widget_snapshot_v1` over WatchConnectivity (`updateApplicationContext` + complication userInfo) so the face stays fresh
- **Tasbeeh (watch-local):** `WatchTasbeehView.swift` — a NavigationLink from the root list opens a self-contained `@State` counter (33 / 99 / 100 / unlimited via segmented picker). Tap or Digital Crown rotation (`digitalCrownRotation`) increments; haptics (`WKInterfaceDevice.current().play`) on tap/target-reached/reset. **No ExternalCommand, no WatchConnectivity** — purely local to the watch, independent of the phone counter.
### Face complications (WidgetKit)

- Target: `targets/munib-tracker-watch-widgets/` (`type: "watch-widget"`) — embedded into the watch app at prebuild
- Same App Group snapshot as phone widgets / Watch app
- Families: **circular**, **corner** (`accessoryCorner` + `widgetLabel` gauge), **inline**, **rectangular** (Smart Stack–eligible)
- Complications:
  | Kind | Families | Glance |
  |------|----------|--------|
  | Next Salah | circular, corner, inline, rectangular | Name, time, countdown / urgency gauge |
  | Schedule | rectangular, inline | Next 2–3 obligatory times + status |
  | Progress | circular, corner, inline, rectangular | Closed ring for fard `n/5` |
  | Salah streak | circular, corner, inline, rectangular | Flame glyph + current streak days |
  | Qaza | circular, corner, inline, rectangular | Remaining debt + today's make-up gauge |
  | Suhoor & Iftar (Ramadan) | circular, corner, inline, rectangular | Suhoor/iftar times + live countdown gauge |
- Timeline reloads at next Salah boundary (and ~15 min pre-Adhan when the wait is longer)
- Always-On: dimmed luminance reduces countdown / location; location uses `privacySensitive`
- Deep links match snapshot section URLs (same as phone widgets): streak → `munib-tracker://statistics`, qaza → `munib-tracker://qaza`, ramadan → `munib-tracker://ramadan`
- Streak/Qaza read `WidgetSnapshotPayload.streak` / `.qaza` (unaffected by location denial); Ramadan follows the same location-denied + `isRamadan` gating as the phone widget

**Design notes (Apple HIG):** complications show dynamic Salah data on raise-wrist — the companion list is for marking. Prefer WidgetKit over ClockKit (`watchOS 9+`).
## Wear OS (NF-2.14)

- Phone pushes snapshot via Wearable Data Layer (`pushWearSnapshot` in `munib-external-commands`)
- `plugins/withWearOs.cjs` scaffolds `android/wear/` tile module on prebuild
- **Next Salah tile** (`MunibWearTileService`): tap uses a LoadAction clickable (`mark_current`); the tile re-requests and sends `/munib/mark_current` to the phone (not on tile-add)
- **Tasbeeh tile** (`MunibWearTasbeehTileService`): second, independent tile — a watch-local dhikr counter stored in `SharedPreferences` (`munib_wear_tasbeeh`). Tap increments (capped at target when set); a Reset row zeroes the count. **Never talks to the phone** — no Data Layer / message client calls.
- Phone `MunibWearListenerService` broadcasts `app.munibtracker.action.MARK_CURRENT` with `source=wear` → shared command queue + JS drain
- Requires Google Play Services + paired watch

## Build requirements

All native surfaces require an **EAS dev/production build** — not Expo Go or web.

```bash
pnpm install
pnpm --filter app prebuild
pnpm --filter app ios   # or android
```

Set `EXPO_APPLE_TEAM_ID` for iOS extensions. App Group: `group.app.munibtracker.widgets`.

## Manual QA matrix

| Surface | Check |
|---------|-------|
| Widgets | Next prayer correct; tap opens app; location-denied CTA |
| Tasbeeh glance widget | Shows today's most recently updated counter; blank state opens `/tasbeeh/free` when nothing logged today |
| Jumu'ah widget | Checklist progress on Friday; day countdown other days; tap opens `/friday` |
| Live Activity | Phase UI (upcoming / Mark / after-Salah); Prepare or Mark or adhkar deep link; toggle off ends activity; closed-app phase changes via ActivityKit push when configured ([`LIVE_ACTIVITY_PUSH.md`](./LIVE_ACTIVITY_PUSH.md)) |
| Live Activity discovery banner | Shows once when supported + toggle off; Turn on enables + dismisses; X dismisses without enabling; never reappears after either |
| Android ongoing / Live Update | Ambient sticky when toggle on; Track this Salah promotes ProgressStyle + chip on API 36+; multi-boundary alarms; Stop/Unpin persists dismissal; Expo surface-push correction |
| Web Push phases | Track this Salah schedules ~48h replaceable phase notifications via VAPID + QStash ([`WEB_PUSH.md`](./WEB_PUSH.md)) |
| Device QA (Android Live Update) | API 24–35 sticky fallback; API 36 ProgressStyle; API 36.1 chip/lock; notifications/promoted disabled; process killed; offline boundaries; Expo Push delayed; at least one Samsung OEM |
| Device QA (Web Push) | Closed-browser Chromium / Firefox / macOS Safari / Android Chrome / installed iOS PWA 16.4+ |
| Prayer-time notification | Mark prayed + Snooze (10 min) on fard prayer-time reminders only |
| Icon shortcuts | Long-press opens route from killed state |
| Siri mark | Background mark without UI; excused day dialog; pin lock defer |
| Assistant mark | Background enqueue on Android |
| Apple Watch | Schedule from snapshot; row tap marks on phone; face complications show next/progress |
| Watch Tasbeeh | Tap and Digital Crown both increment; haptic on tap/target-reached/reset; mode switch resets count; no phone interaction |
| Watch face edit | Next Salah / Schedule / Progress / Salah streak / Qaza / Suhoor & Iftar appear in complication picker for circular, corner, inline, rectangular |
| Wear tile | Shows next prayer after phone sync; tap marks on phone |
| Wear Tasbeeh tile | Second tile; tap increments locally; Reset row zeroes count; survives phone being unreachable |

## Related

- Shipped features: [`FEATURES.md`](./FEATURES.md) NF-1.18 / NF-1.19 / NF-2.14 / NF-2.15
- Device support: [`DEVICES.md`](./DEVICES.md)
- Doc index: [`README.md`](./README.md)
