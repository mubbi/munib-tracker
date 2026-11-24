# Native surfaces (widgets, Live Activities, voice, watch)

Native home-screen widgets, Live Activities, Siri/Assistant shortcuts, Apple Watch,
and Wear OS companion surfaces share the **`appSurfaces`** architecture.

**TV note:** Apple TV / Android TV run the **full Expo app** (not companions). When
`EXPO_TV=1`, phone-only plugins (widgets, Watch, Wear, App Intents, quick actions)
are omitted — see [`TV.md`](./TV.md).

## Architecture

| Layer                  | Path                                                                                           | Role                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Quick actions registry | `src/lib/appSurfaces/quickActions/`                                                            | Icon long-press shortcuts (NF-1.30)                                  |
| Intent registry        | `src/lib/appSurfaces/intents/registry.ts`                                                      | Siri / Assistant phrase catalog (NF-2.15)                            |
| Widget snapshot        | `src/lib/appSurfaces/widgets/buildWidgetSnapshot.ts`                                           | Localized schedule + status JSON                                     |
| Shared storage         | `src/lib/appSurfaces/widgets/snapshotStorage.ts`                                               | AsyncStorage + iOS App Group                                         |
| External commands      | `src/lib/external-commands/`                                                                   | Mark-prayed queue + JS executor                                      |
| Native command module  | `modules/munib-external-commands/`                                                             | App Group queue, WatchConnectivity snapshot push, Wear snapshot push |
| Wear listener          | `modules/munib-wear/`                                                                          | Wear OS message → command queue                                      |
| iOS WidgetKit          | `targets/munib-tracker-widgets/`                                                               | Home + lock-screen widgets + Live Activity UI                        |
| iOS App Intents        | `targets/munib-tracker-intents/`                                                               | Siri background mark + navigation (NF-2.15)                          |
| Apple Watch            | `targets/munib-tracker-watch/`                                                                 | SwiftUI schedule + mark (NF-2.14)                                    |
| Watch complications    | `targets/munib-tracker-watch-widgets/`                                                         | WidgetKit face complications (NF-2.14)                               |
| Live Activity control  | `modules/munib-live-activity/`                                                                 | ActivityKit start/update/end                                         |
| Config plugins         | `plugins/homeScreenSurfaces.cjs`, `withExternalCommands.cjs`, `withWearOs.cjs`                 | Native project wiring                                                |
| Salah focus lock       | `modules/munib-focus-lock/` + `targets/munib-tracker-focus-*`                                  | NF-3.13 hard block (see below)                                       |
| Nearby join (BLE)      | `modules/munib-nearby/`                                                                        | NF-3.25 circle invites between nearby phones (see below)             |
| Hooks                  | `use-app-quick-actions.ts`, `use-widget-snapshot-sync.ts`, `use-external-command-processor.ts` | Sync + drain loops                                                   |

**App Group:** `group.app.munibtracker.widgets`

| Key                   | Purpose                                                    |
| --------------------- | ---------------------------------------------------------- |
| `widget_snapshot_v1`  | Widget / watch read model                                  |
| `pending_commands_v1` | Siri / watch / wear / assistant / **widget** mark commands |

## Widgets (NF-1.18)

| Widget             | iOS families                                    | Android cell                | Shows                                                               |
| ------------------ | ----------------------------------------------- | --------------------------- | ------------------------------------------------------------------- |
| **Next Salah**     | small, medium, lock-screen accessory            | 4×2                         | Next Salah name, time, live countdown                               |
| **Schedule**       | small, medium, large, lock-screen               | 4×4                         | Today's five obligatory times (status dots + labels)                |
| **Progress**       | small, medium, lock-screen circular/rectangular | 2×2                         | Fard progress (e.g. 3/5) + bar + Mark                               |
| **Salah streak**   | small, medium, lock-screen                      | 2×2                         | Current obligatory streak                                           |
| **Qaza**           | small, medium, lock-screen                      | 4×2                         | Remaining debt + today's make-up progress                           |
| **Ramadan**        | small, medium, lock-screen                      | 4×2                         | Suhoor / iftar + live countdown                                     |
| **Khatm**          | small, medium, lock-screen                      | 4×2                         | Reading-plan % and today's quota                                    |
| **Daily hadith**   | small, medium, large, lock-screen               | 4×2                         | Today's Nawawi hadith (localized meaning)                           |
| **Islamic date**   | small, medium, lock-screen                      | 2×2                         | Hijri + Gregorian                                                   |
| **Qibla**          | small, medium, lock-screen                      | 2×2                         | Static bearing toward the Kaaba                                     |
| **Tasbeeh glance** | small, lock-screen accessory                    | 2×2                         | Today's custom tasbeeh count/target (most recently updated counter) |
| **Jumu'ah**        | small, medium, lock-screen                      | 4×2 (default) / 2×2 (small) | Friday checklist progress on Fridays, else countdown in days        |

### Content budgets (Apple HIG / Android sizing)

| Size                           | Budget                                                         |
| ------------------------------ | -------------------------------------------------------------- |
| Small / 2×2                    | One hero metric + one secondary line; no footer/CTA chrome     |
| Medium / 4×2                   | Hero + 1–2 supporting facts (following Salah, suhoor+iftar)    |
| Large / 4×4                    | Full schedule (5 rows) or denser hadith; optional `updatedAgo` |
| Accessory circular             | Gauge + short label                                            |
| Accessory rectangular / inline | Line + detail only                                             |

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

| Layer             | Path                                                                                                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shared attributes | `modules/munib-live-activity/ios/PrayerActivityAttributes.swift` **and** `targets/munib-tracker-widgets/PrayerActivityAttributes.swift` (byte-for-byte identical) |
| Native control    | `modules/munib-live-activity/ios/MunibLiveActivityModule.swift`                                                                                                   |
| SwiftUI UI        | `targets/munib-tracker-widgets/PrayerLiveActivity.swift`                                                                                                          |
| JS bridge         | `src/lib/live-activity/` — `syncLiveActivity()` after each widget snapshot write                                                                                  |
| Preference        | `UserPreferences.liveActivityEnabled` (default off)                                                                                                               |

**Flow:** snapshot refresh → `syncLiveActivity()` starts/updates/ends activity. Upcoming `staleDate` is ~2 minutes after adhan (not the countdown end) so the banner does not go stale at 00:00 before the QStash/APNs mark-Salah push; views use `Text(timerInterval:)` for ticking countdown while in the **upcoming** phase.

**Phase windows:** for ~15 minutes after the current Salah begins, the activity shows that Salah with **Mark Salah**; once marked (or after 15 minutes) through ~30 minutes it offers **after-Salah adhkar**; after 30 minutes it returns to the **upcoming Salah** countdown + Prepare. Qibla remains available on the expanded presentation.

**Remote updates (ActivityKit push):** activities start with `pushType: .token`. The app registers the per-activity APNs token + precomputed content-state updates at each phase boundary via `PUT /api/v1/live-activities`. Delivery uses APNs HTTP/2 through `@munib-tracker/live-activity-delivery`, scheduled with **Upstash QStash** (`notBefore`) and/or cron `POST …/internal/dispatch-due`. Full ops (env, cron, QStash free-tier fallback, future Fly.io worker): [`LIVE_ACTIVITY_PUSH.md`](./LIVE_ACTIVITY_PUSH.md). Local `Activity.update` still runs while the app is foregrounded.

**Presentations (Apple HIG):** Lock Screen + StandBy (`isActivityFullscreen`) show the active phase (upcoming countdown, Mark Salah, or after-Salah adhkar) plus today’s progress; Dynamic Island covers compact / minimal / expanded layouts. Accent `keylineTint` ties the island to the app palette.

**Requirements:** iOS **17.0+** (widget / Live Activity target `deploymentTarget`); `NSSupportsLiveActivities: true`; EAS dev/production build (not Expo Go). ActivityKit itself supports 16.2+, but Munib’s extension targets **17.0**.

**Attributes duplication:** ActivityKit matches by attributes type + Codable shape in both main app and widget extension — change both files together.

**Discovery banner (NF-1.19):** one-shot coach mark above the toggle in **Settings → Notifications** when the platform supports the live countdown (iOS Live Activity or Android ongoing notification) and the preference is still off. Uses `toursStore` with a dedicated id (`liveActivityDiscovery`, distinct from the `/tour` carousel ids) so it dismisses permanently once turned on or closed — `components/notifications/live-activity-discovery-banner.tsx`.

**Android Live Updates (Android 16):** Explicit **Track this Salah** on the Tracker starts a promoted ongoing notification with `ProgressStyle` segments (upcoming → Mark → after-Salah), status-chip text, and Stop/Unpin. Ambient sticky countdown still uses `liveActivityEnabled`. Multi-boundary `AlarmManager` flips phases while killed; Expo data corrections use `surface_push_*` + QStash ([`WEB_PUSH.md`](./WEB_PUSH.md)). Requires AndroidX Core ≥1.17 and `POST_PROMOTED_NOTIFICATIONS`. Pre-36 devices keep the Standard chronometer notification.

**Android ongoing countdown:** `lib/ongoing-notification/` + `OngoingSalahNotification.kt`; same preference gates ambient mode; Track session gates promotion.

## Siri & Assistant (NF-2.15)

| Intent                                                             | Behavior                                                            |
| ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| Mark my Salah                                                      | Background — enqueues `mark-current-obligatory`, no UI              |
| Mark a Salah (parameterized `SalahOption` AppEnum)                 | Background — enqueues `mark-prayer` for Fajr/Dhuhr/Asr/Maghrib/Isha |
| Open checklist / Qibla / Tasbeeh / Qur'an / Ramadan / Khatm / Qaza | Foreground — opens `munib-tracker://` route                         |

- iOS: `targets/munib-tracker-intents/_shared/MunibAppIntents.swift` — compiled into **both** the main app target and the `MunibTrackerIntents` App Intents extension (Apple requires the `AppShortcutsProvider` + its intents in the main app target; extension-only intents fail in Shortcuts with "internal error"). Foreground (`openAppWhenRun: true`) intents and the provider are app-only via the `MUNIB_INTENTS_EXTENSION` compile condition (`plugins/withAppIntentsExtensionDefine.cjs`); background mark intents also run in the extension so Siri doesn't launch the app.
- Queue writes post a Darwin notification (`app.munibtracker.commands.changed`) → `MunibExternalCommandsModule` emits `onCommandsAvailable` → a running app instance drains immediately (Siri, widget button, watch marks apply without waiting for the next foreground).
- Android: `plugins/withExternalCommands.cjs` → App Actions (`OPEN_APP_FEATURE` + inventory) + broadcast receiver + launcher shortcut (`android.app.shortcuts` → `@xml/shortcuts` → `munib-tracker://mark-current`)
- Android broadcast actions (must match Kotlin + manifest): `app.munibtracker.action.MARK_CURRENT` / `MARK_PRAYER`
- JS drain: `ExternalCommandProcessor` in root `_layout.tsx` (respects pin lock deferral); Android also emits `onCommandsAvailable` when the shared queue is written (Assistant, Wear, or JS enqueue)
- Help: **Settings → Siri & voice shortcuts** (iOS) / **Google Assistant & voice shortcuts** (Android)

**Play Console (App Actions uploads):** set Privacy policy to `https://munibtracker.app/privacy`, then **Setup → Advanced settings → App Actions → accept Terms of Service**.

**Force-quit limitation:** if the app process is killed, Siri/Assistant/widget/Wear marks still enqueue into `pending_commands_v1` (Apple Watch marks wait in the system `transferUserInfo` queue and are enqueued once the phone app runs); the drain (`ExternalCommandProcessor`) only runs once the app is relaunched or foregrounded, so the visible mark (checklist tick, streak, widget refresh) is delayed until then — the queued command itself is never lost. Surfaced to users in **Settings → Siri & voice shortcuts** (`externalCommands.siriHint` / `assistantHint`).

**Mark my Salah (quick action / deep link):** only completes the _current window_ obligatory Salah (never cascades to the next pending). Icon quick-action cold-start is handled once per launch so remounts cannot re-open `/mark-current` and mark again. Duplicate `mark-current-obligatory` entries in one drain pass are coalesced.

## Apple Watch (NF-2.14)

### Companion app

- Target: `targets/munib-tracker-watch/` (`type: "watch"`, watchOS 10+)
- Reads `widget_snapshot_v1` from App Group (same schema as WidgetKit)
- Marks reach the phone over WatchConnectivity only (the watch's App Group is on the watch): `sendMessage` when the phone is reachable, falling back to queued `transferUserInfo` when it isn't (or the live send fails). The phone bridge (`MunibExternalCommandsModule`) handles both `didReceiveMessage` variants and `didReceiveUserInfo`, enqueueing into `pending_commands_v1`
- Requires paired iPhone with Munib Tracker installed
- Phone pushes `widget_snapshot_v1` over WatchConnectivity (`updateApplicationContext` + complication userInfo) so the face stays fresh
- **Tasbeeh (watch-local):** `WatchTasbeehView.swift` — a NavigationLink from the root list opens a self-contained `@State` counter (33 / 99 / 100 / unlimited via segmented picker). Tap or Digital Crown rotation (`digitalCrownRotation`) increments; haptics (`WKInterfaceDevice.current().play`) on tap/target-reached/reset. **No ExternalCommand, no WatchConnectivity** — purely local to the watch, independent of the phone counter.

### Face complications (WidgetKit)

- Target: `targets/munib-tracker-watch-widgets/` (`type: "watch-widget"`) — embedded into the watch app at prebuild
- Same App Group snapshot as phone widgets / Watch app
- Families: **circular**, **corner** (`accessoryCorner` + `widgetLabel` gauge), **inline**, **rectangular** (Smart Stack–eligible)
- Complications:
  | Kind                     | Families                              | Glance                                    |
  | ------------------------ | ------------------------------------- | ----------------------------------------- |
  | Next Salah               | circular, corner, inline, rectangular | Name, time, countdown / urgency gauge     |
  | Schedule                 | rectangular, inline                   | Next 2–3 obligatory times + status        |
  | Progress                 | circular, corner, inline, rectangular | Closed ring for fard `n/5`                |
  | Salah streak             | circular, corner, inline, rectangular | Flame glyph + current streak days         |
  | Qaza                     | circular, corner, inline, rectangular | Remaining debt + today's make-up gauge    |
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
- **Application ID:** the Wear app uses the phone's `app.munibtracker` (namespace `app.munibtracker.wear`) and the same signing key — the Wearable Data Layer only connects apps that share both. (Before Expo SDK 58 it generated `app.munibtracker.wear`, which could never reach the phone.) Version code: the shared `EXPO_ANDROID_VERSION_CODE` in `apps/app/.env` (one counter for phone, TV and Wear — bump it before every Play upload).
- **Release:** `pnpm release:app:wear` (Gradle `:wear:bundleRelease`, phone prebuild) → `pnpm release:app:wear:upload` (Play `wear:internal` track). Enable the Wear OS form factor in Play Console first.

## Salah focus lock (NF-3.13)

Blocks the apps the user chose during a window around each Salah until they mark it prayed or the window ends (D4). Settings: **Devices & integrations › Salah focus** (`devices.focusLock`, opens `/focus-lock`); the shield's confirm alert is **Reminders › Salah & adhan** (`notifications.salah.focusLockConfirm` → `notificationPrefs.focusLock`).

| Layer                 | Path                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Pure planner + rules  | `src/lib/focus-lock/` — `plan.ts` (windows, skips, merges), `state.ts` (unlock rules), `allowlist.ts`, `prefs.ts`        |
| Store glue            | `src/lib/focus-lock/controller.ts`, `inputs.ts` (adhan from `prayer-times.ts`, iqamah from `lib/masjid`)                 |
| JS ↔ native contract  | `src/lib/focus-lock/native.ts` (`requireOptionalNativeModule("MunibFocusLock")`, soft no-op elsewhere)                   |
| Host + UI             | `components/focus-lock/focus-lock-host.tsx` (root layout), soft prompt, tracker chip; routes `app/focus-lock/*`          |
| Native module         | `modules/munib-focus-lock/` — `ios/` (FamilyControls, DeviceActivity, BGAppRefreshTask) + `android/` (Kotlin)            |
| iOS extensions        | `targets/munib-tracker-focus-monitor` / `-shield` / `-action` (DeviceActivityMonitor, ShieldConfiguration, ShieldAction) |
| Config plugin         | `modules/munib-focus-lock/app.plugin.js` (entitlement, App Group, BGTask id; Android permissions + launcher `<queries>`) |
| Device-local JS state | `DB_KEYS.focusLockDevice` (`deviceLocal`): setup done, app count, ended windows, emergency-unlock log                    |

**D17 build flag.** Apple granted the Family Controls **Distribution** entitlement on 2026-11-24, so the iOS hard block is compiled in **by default**. Setting `EXPO_PUBLIC_FOCUS_LOCK_HARD_IOS=0` builds the soft-prompt fallback: then `app.config.js` excludes `targets/munib-tracker-focus-*` from `@bacons/apple-targets` (`match: "!(munib-tracker-focus-*)"`), the plugin adds no entitlement, the JS never loads the module, and iOS ships the soft in-app prompt. Android always ships the hard block. Web, TV and visionOS get the soft prompt only (TV: hidden; the module is in `TV_EXCLUDED_PACKAGES`).

**iOS flow.** `requestAuthorization(for: .individual)` → `FamilyActivityPicker` (selection stored encoded in the App Group, never synced) → `setPlan` writes the plan JSON to the App Group and calls `DeviceActivityCenter.startMonitoring` once per window (≤ 12, two days). Windows shorter than DeviceActivity's 15-minute minimum are scheduled padded with `warningTime` = padding, so `intervalWillEndWarning` marks the real end. The monitor applies `ManagedSettingsStore(named: "munib.focus").shield` at `intervalDidStart` and clears it at the end (unless another window is running). The shield's primary button posts a local "Tap to confirm your Salah" notification (`data.route = /mark-current`) because a shield can't open the app; gentle mode also lifts the shield on that one tap (D39: Apple's shield has no press-and-hold, so iOS doesn't use the 10 s hold). The secondary button is the counted emergency unlock. A `BGAppRefreshTask` (`app.munibtracker.focuslock.refresh`) re-arms from the cached plan.

**Android flow.** `setExactAndAllowWhileIdle` alarms at each window start/end → `FocusLockReceiver` → `FocusLockService` (foreground, `specialUse`, low-priority ongoing notification) polls `UsageStatsManager.queryEvents` for `ACTIVITY_RESUMED` every 750 ms → full-screen `TYPE_APPLICATION_OVERLAY` over a blocked app ("I've prayed" deep link, 10 s hold in gentle mode, emergency unlock). Never blocked: our app, default dialer / SMS / launcher, Settings, telephony and emergency packages (`FocusLockAllowlist.kt` = `allowlist.ts`). `BOOT_COMPLETED`, package replace, time / timezone and exact-alarm permission changes re-arm from the plan cached in SharedPreferences. No Accessibility API, no `QUERY_ALL_PACKAGES`.

**Marking the Salah anywhere** (tracker, widget, Siri, Watch → tracker store) ends the running window: the host calls `endWindowNow(id)`. Excused periods (`activeExcusedReason` + `pauseWhileExcused`) and quiet dates plan no windows. **Weekdays only** skips the user's own weekend days (D37, `schedule.weekendDays`, 0 = Sunday … 6 = Saturday); unset, they default from the region (`lib/focus-lock/weekend.ts`: stored country, else the location's / device's timezone — e.g. Friday + Saturday in Saudi Arabia, Friday in Iran, Saturday + Sunday elsewhere). On Fridays the **Jumu'ah window** replaces Dhuhr with its own length (D38, `jumuahDurationMin`, default 60, 5–120) from the home masjid's Jumu'ah time when known, else the Dhuhr adhan. Both are resolved in JS: the native side only receives concrete windows, so its payload is unchanged. Emergency unlocks are logged on the device only and shown as a neutral weekly count.

### Focus lock — verify before release (real devices / Mac)

| Area                | Check                                                                                                                                                                                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mac build (flag on) | `pnpm cleanbuild:app:ios` generates the three targets; app + module + extensions compile and sign with the Family Controls (Distribution) entitlement; `EXPO_PUBLIC_FOCUS_LOCK_HARD_IOS=0` builds with no FamilyControls entitlement                       |
| iOS authorization   | Screen Time prompt; denied / revoked in Settings → JS reports `denied`; picker presents, Done saves, count matches                                                                                                                                         |
| DeviceActivity      | Shield appears at window start with the app closed; 20-min window clears at the real end (padded schedule + `warningTime`); 1-min test window; ≤ 12 schedules accepted (find the real monitored-activity limit); DST day; reboot                           |
| Shield UI / actions | Title/body/colours from the plan in light + dark + RTL locales; "I've prayed" posts the confirm notification and tapping it marks via `/mark-current`; gentle unlock lifts the shield on one tap (D39); emergency count decrements and resets the next day |
| Background refresh  | `BGAppRefreshTask` registers (no launch crash when the plist id is absent) and re-arms after a few days without opening the app                                                                                                                            |
| Android permissions | Usage access, overlay, exact alarm, notifications, battery screens open on Android 10–16; status refreshes on return                                                                                                                                       |
| Android service     | Exact alarm starts the specialUse FGS from the background on Android 12–16 (FGS-start exemption); overlay shows over a blocked app within ~1 s and hides on Home/our app; stops at window end; Doze; reboot re-arms                                        |
| OEM battery killers | Xiaomi (MIUI/HyperOS), Samsung (One UI), Huawei/Honor: windows still start after hours idle once unrestricted; note any OEM autostart toggle needed                                                                                                        |
| Never-block         | Phone, SMS, emergency dialer, default launcher, Settings and Munib Tracker are never covered (incl. third-party default dialer / SMS)                                                                                                                      |
| Mark anywhere       | Marking from the tracker, widget, Siri / App Intent, Watch and Wear ends the active window on both platforms                                                                                                                                               |
| Soft prompt         | Web + iOS (flag off): prompt shows during a window, "Not now" hides it for that window, marking ends it                                                                                                                                                    |

## Nearby join (NF-3.25)

Circle invites between phones standing next to each other, over Bluetooth LE (D41–D44; backend
and flow in [`CIRCLES.md`](./CIRCLES.md#nearby-join-nf-325-d41d44)). Phone builds only: the module
is excluded from TV autolinking (`plugins/tvExcludedPackages.cjs`) and its config plugin is in
`phoneOnlyPlugins`; on web, TV, Expo Go or a phone without BLE `isNearbyAvailable()` is false and
the UI shows only "Code & QR".

| Piece                | Where                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| Native module        | `modules/munib-nearby/` — `ios/MunibNearbyModule.swift` (CoreBluetooth), `android/…/NearbyRadio.kt` |
| Config plugin        | `modules/munib-nearby/app.plugin.js` (+ snapshot test `app.plugin.test.js`)                         |
| JS ↔ native contract | `src/lib/nearby/native.ts` (`requireOptionalNativeModule("MunibNearby")`, no-op elsewhere)          |
| Permissions          | `src/lib/nearby/permissions.ts` (in-app rationale first, then the OS prompt)                        |
| Flows                | `src/lib/nearby/machine.ts` (pure reducers), `use-nearby-host.ts`, `use-nearby-join.ts`             |
| UI                   | `src/components/circles/nearby/` (host panel, join sheet, match code, "Code & QR" / "Nearby" tabs)  |

**Payload.** One 128-bit service UUID = app prefix `9a3c5e71-2b84-4f06` (bytes 0–7) + the opaque
8-byte nearby-session id (bytes 8–15). With the flags that is 21 of the 31 legacy advertising bytes,
so it fits the primary packet on both platforms and doesn't depend on scan responses, a local name
(Android can't set one per advert) or service data (iOS can't advertise it). Nothing personal is
advertised; the id expires with the 10-minute session.

**iOS (CoreBluetooth).** `CBPeripheralManager.startAdvertising([CBAdvertisementDataServiceUUIDsKey:
[uuid]])` — no local name, no GATT service, no connections. `CBCentralManager.scanForPeripherals(
withServices: nil, AllowDuplicates: true)` while the Join sheet is open: the session id lives in
the UUID, so a fixed-UUID filter isn't possible; scanning with `nil` is allowed in the foreground
only, and duplicates let the list drop phones that walked away (events throttled to 1 per beacon
per second). Managers are created lazily so the system prompt appears only after the rationale
(`CBManager.authorization` is read without creating one). `NSBluetoothAlwaysUsageDescription` only;
**no `bluetooth-central` / `bluetooth-peripheral` background modes** — `UIApplication.
didEnterBackgroundNotification` stops both roles (Apple: foreground-only apps stop advertising and
scanning in the background anyway). Lifecycle uses the SDK 58 `didCreate` / `willDestroy` overrides.

**Android.** `BluetoothLeAdvertiser`: `ADVERTISE_MODE_BALANCED`, `TX_POWER_MEDIUM` (room scale),
non-connectable, no device name / TX power, `setTimeout(0)` with our own 10-minute timer (the
platform caps the built-in timeout at 3 minutes); needs `isMultipleAdvertisementSupported`.
`BluetoothLeScanner`: `SCAN_MODE_LOW_LATENCY` (foreground, short, user-initiated), legacy adverts,
`ScanFilter` on the service UUID **with a prefix mask** (hardware-offloaded where supported; the
callback re-checks the prefix). Permissions: Android 12+ `BLUETOOTH_SCAN`
(`usesPermissionFlags="neverForLocation"`) and `BLUETOOTH_ADVERTISE`; Android ≤ 11 legacy
`BLUETOOTH` / `BLUETOOTH_ADMIN` (`maxSdkVersion=30`) and, to scan, `ACCESS_FINE_LOCATION` (already
declared by expo-location — the plugin never touches location permissions) with location services
on. `<uses-feature android.hardware.bluetooth_le required="false">` keeps the app installable without
BLE. No `BLUETOOTH_CONNECT`: the Bluetooth-off state links to the system Bluetooth settings rather
than the enable-request intent. A `ACTION_STATE_CHANGED` receiver and `OnActivityEntersBackground`
stop both roles.

**When it runs.** Advertising: only between **Make visible** and Stop / leaving the screen (blur or
unmount) / app background / Bluetooth off / 10 minutes — and the server session ends at the same
moment. Scanning: only while the Join nearby sheet is open and the app is in the foreground (resumes
when the user returns), stopping once a request is sent, and after 10 minutes at most.

### Nearby join — verify on real devices

Simulators and emulators can't advertise or scan BLE; everything below needs two (or three) real
phones and a dev / production build (`pnpm prebuild:app:ios|android` — new native module).

| Area                    | Check                                                                                                                                                                                                                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Discovery matrix        | iOS host → iOS joiner, iOS → Android, Android → iOS, Android → Android: the circle appears within ~2–5 s at 0.5–3 m; it disappears ≤ 10 s after the host taps Stop or leaves the screen                                                                                       |
| Android versions / OEMs | Android 8–11 (location permission + location services on), 12–16 (`BLUETOOTH_SCAN` with `neverForLocation` still returns our adverts), at least one Samsung, Xiaomi and Pixel; a phone without peripheral mode shows "Nearby isn't available" for the host but can still join |
| Scan filter             | On chipsets that ignore the UUID mask, results still arrive (software prefix check) and unrelated beacons never show                                                                                                                                                          |
| Permissions — iOS       | Rationale shows before the system prompt; Allow → advertising starts; Don't Allow → "Bluetooth is off for Munib Tracker" + Open Settings; toggling Bluetooth for the app in Settings and returning works; usage string reads correctly                                        |
| Permissions — Android   | "Nearby devices" prompt on 12+; deny once → "permission needed" + Try again re-prompts; "Don't ask again" → Open Settings; Android ≤ 11 location prompt + "Location services are off" → Location settings                                                                     |
| Bluetooth off / on      | Off before starting → blocked state (Control Center hint on iOS, Bluetooth settings on Android); turning it off mid-session stops advertising / scanning with the matching message; on again + Try again recovers                                                             |
| Background              | Host: Home / app switcher stops advertising within a second and ends the session (joiner sees it vanish; a pending request reads "ended"); joiner: scanning pauses and resumes on return; no Bluetooth activity in the background (iOS Settings › Privacy shows no use)       |
| Timeout                 | Host stops after 10 min ("Stopped after 10 minutes to save battery"); joiner scan stops after 10 min ("Search again")                                                                                                                                                         |
| Match code + approval   | Both screens show the same 4 digits; a second host nearby shows different digits; "They don't match" returns to the list; Accept joins (member list updates, joiner lands on the circle); Decline shows "declined"; nothing joins without Accept                              |
| Scope / roles           | Group khatm (guest joiner allowed), family adult member, family parent (owner only, single-use — second Accept fails), partner (cap 5 enforced on Accept), child-device link (child phone without account → kids shell, parent revoke still works)                            |
| Battery                 | 10 min advertising and 10 min scanning each cost < ~1 % battery on a mid-range phone; no wake locks left after Stop (Android `dumpsys bluetooth_manager` shows no active advertiser / scanner)                                                                                |
| Accessibility / RTL     | VoiceOver / TalkBack read the digits one by one ("Match code 0 4 7 2"), request rows and buttons; Arabic / Urdu layout mirrors except the digits (always left-to-right); Dynamic Type / font scale up to 200 % keeps buttons usable                                           |
| Web / TV                | Web, PWA, Apple TV and Android TV show only Code & QR (no Nearby tab, no Join nearby button); TV prebuild contains no Bluetooth permission or usage string                                                                                                                    |

## iOS scene life cycle (Expo SDK 58)

Expo SDK 58 builds against the iOS 27 SDK, which requires the UIKit scene life cycle. Prebuild generates `SceneDelegate.swift` (`ExpoAppSceneDelegate`) and `UIApplicationSceneManifest`; Expo forwards URL opens, user activities (universal links, Handoff), quick actions and foreground/background events to `ExpoAppDelegate` subscribers.

- **Quick actions:** `expo-quick-actions@6.0.2` only read cold-start shortcuts from `launchOptions`, which is empty under scenes. `patches/expo-quick-actions@6.0.2.patch` also records a shortcut forwarded through `performActionFor` before JS reads the `initial` constant, so cold-start shortcuts still route.
- **Local modules** don't touch `AppDelegate`, `UIScreen.main` or `keyWindow`; external commands travel through the App Group queue + Darwin notification, so they are unaffected.
- **Lifecycle hooks:** local Swift modules use the `didCreate` / `willDestroy` / `didStartListening(event:)` / `didStopListening(event:)` overrides (the `OnCreate` / `OnStartObserving`… DSL components are deprecated in SDK 58).
- **QA:** cold and warm start from every widget family, the Live Activity / Dynamic Island, each App Intent, quick actions, universal links and OAuth redirects — each must arrive exactly once.

## Build requirements

All native surfaces require an **EAS dev/production build** — not Expo Go or web.

```bash
pnpm install
pnpm --filter app prebuild
pnpm --filter app ios   # or android
```

Set `EXPO_APPLE_TEAM_ID` for iOS extensions. App Group: `group.app.munibtracker.widgets`.

## Manual QA matrix

| Surface                         | Check                                                                                                                                                                                                                       |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Widgets                         | Next prayer correct; tap opens app; location-denied CTA                                                                                                                                                                     |
| Tasbeeh glance widget           | Shows today's most recently updated counter; blank state opens `/tasbeeh/free` when nothing logged today                                                                                                                    |
| Jumu'ah widget                  | Checklist progress on Friday; day countdown other days; tap opens `/friday`                                                                                                                                                 |
| Live Activity                   | Phase UI (upcoming / Mark / after-Salah); Prepare or Mark or adhkar deep link; toggle off ends activity; closed-app phase changes via ActivityKit push when configured ([`LIVE_ACTIVITY_PUSH.md`](./LIVE_ACTIVITY_PUSH.md)) |
| Live Activity discovery banner  | Shows once when supported + toggle off; Turn on enables + dismisses; X dismisses without enabling; never reappears after either                                                                                             |
| Android ongoing / Live Update   | Ambient sticky when toggle on; Track this Salah promotes ProgressStyle + chip on API 36+; multi-boundary alarms; Stop/Unpin persists dismissal; Expo surface-push correction                                                |
| Web Push phases                 | Track this Salah schedules ~48h replaceable phase notifications via VAPID + QStash ([`WEB_PUSH.md`](./WEB_PUSH.md))                                                                                                         |
| Device QA (Android Live Update) | API 24–35 sticky fallback; API 36 ProgressStyle; API 36.1 chip/lock; notifications/promoted disabled; process killed; offline boundaries; Expo Push delayed; at least one Samsung OEM                                       |
| Device QA (Web Push)            | Closed-browser Chromium / Firefox / macOS Safari / Android Chrome / installed iOS PWA 16.4+                                                                                                                                 |
| Prayer-time notification        | Mark prayed + Snooze (10 min) on fard prayer-time reminders only                                                                                                                                                            |
| Icon shortcuts                  | Long-press opens route from killed state                                                                                                                                                                                    |
| Siri mark                       | Background mark without UI; excused day dialog; pin lock defer                                                                                                                                                              |
| Assistant mark                  | Background enqueue on Android                                                                                                                                                                                               |
| Apple Watch                     | Schedule from snapshot; row tap marks on phone; face complications show next/progress                                                                                                                                       |
| Watch Tasbeeh                   | Tap and Digital Crown both increment; haptic on tap/target-reached/reset; mode switch resets count; no phone interaction                                                                                                    |
| Watch face edit                 | Next Salah / Schedule / Progress / Salah streak / Qaza / Suhoor & Iftar appear in complication picker for circular, corner, inline, rectangular                                                                             |
| Wear tile                       | Shows next prayer after phone sync; tap marks on phone                                                                                                                                                                      |
| Wear Tasbeeh tile               | Second tile; tap increments locally; Reset row zeroes count; survives phone being unreachable                                                                                                                               |

## Related

- Shipped features: [`FEATURES.md`](./FEATURES.md) NF-1.18 / NF-1.19 / NF-2.14 / NF-2.15
- Device support: [`DEVICES.md`](./DEVICES.md)
- Doc index: [`README.md`](./README.md)
