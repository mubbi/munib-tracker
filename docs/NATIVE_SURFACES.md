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
| `pending_commands_v1` | Siri / watch / wear / assistant mark commands |

## Widgets (NF-1.18)

| Widget | iOS families | Android cell | Shows |
|--------|-------------|--------------|-------|
| **Next prayer** | small, medium, lock-screen accessory | 4×2 | Next prayer name, time, countdown |
| **Schedule** | small, medium, large, lock-screen | 4×4 | Today's five obligatory times |
| **Progress** | small, lock-screen circular/rectangular | 2×2 | Fard progress (e.g. 3/5) |

## Live Activities (NF-1.19)

Opt-in iOS lock-screen + Dynamic Island countdown. Toggle in **Settings → Notifications → Live Activity**.

| Layer | Path |
|-------|------|
| Shared attributes | `modules/munib-live-activity/ios/PrayerActivityAttributes.swift` **and** `targets/munib-tracker-widgets/PrayerActivityAttributes.swift` (byte-for-byte identical) |
| Native control | `modules/munib-live-activity/ios/MunibLiveActivityModule.swift` |
| SwiftUI UI | `targets/munib-tracker-widgets/PrayerLiveActivity.swift` |
| JS bridge | `src/lib/live-activity/` — `syncLiveActivity()` after each widget snapshot write |
| Preference | `UserPreferences.liveActivityEnabled` (default off) |

**Flow:** snapshot refresh → `syncLiveActivity()` starts/updates/ends activity. `staleDate` = next prayer; views use `Text(timerInterval:)` for ticking countdown.

**Presentations (Apple HIG):** Lock Screen + StandBy (`isActivityFullscreen`) show next salah, meta, countdown, and today’s progress bar; Dynamic Island covers compact (glyph + timer), minimal (circular countdown), and expanded (leading/trailing/center/bottom + progress). Accent `keylineTint` ties the island to the app palette.

**Requirements:** iOS **17.0+** (widget / Live Activity target `deploymentTarget`); `NSSupportsLiveActivities: true`; EAS dev/production build (not Expo Go). ActivityKit itself supports 16.2+, but Munib’s extension targets **17.0**.

**Attributes duplication:** ActivityKit matches by attributes type + Codable shape in both main app and widget extension — change both files together.

## Siri & Assistant (NF-2.15)

| Intent | Behavior |
|--------|----------|
| Mark my Salah | Background — enqueues `mark-current-obligatory`, no UI |
| Open checklist / Qibla / Tasbeeh | Foreground — opens `munib-tracker://` route |

- iOS: `targets/munib-tracker-intents/MunibAppIntents.swift` (`openAppWhenRun: false` for mark)
- Android: `plugins/withExternalCommands.cjs` → App Actions (`OPEN_APP_FEATURE` + inventory) + broadcast receiver + launcher shortcut (`android.app.shortcuts` → `@xml/shortcuts` → `munib-tracker://mark-current`)
- Android broadcast actions (must match Kotlin + manifest): `app.munibtracker.action.MARK_CURRENT` / `MARK_PRAYER`
- JS drain: `ExternalCommandProcessor` in root `_layout.tsx` (respects pin lock deferral); Android also emits `onCommandsAvailable` when the shared queue is written (Assistant, Wear, or JS enqueue)
- Help: **Settings → Siri & voice shortcuts** (iOS) / **Google Assistant & voice shortcuts** (Android)

**Play Console (App Actions uploads):** set Privacy policy to `https://munibtracker.app/privacy`, then **Setup → Advanced settings → App Actions → accept Terms of Service**.

**Force-quit limitation:** if the app process is killed, Siri/Assistant still enqueue the command; it applies on next launch or foreground.

## Apple Watch (NF-2.14)

### Companion app

- Target: `targets/munib-tracker-watch/` (`type: "watch"`, watchOS 10+)
- Reads `widget_snapshot_v1` from App Group (same schema as WidgetKit)
- Marks via App Group command queue + WatchConnectivity nudge to phone
- Requires paired iPhone with Munib Tracker installed
- Phone pushes `widget_snapshot_v1` over WatchConnectivity (`updateApplicationContext` + complication userInfo) so the face stays fresh
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
- Timeline reloads at next Salah boundary (and ~15 min pre-Adhan when the wait is longer)
- Always-On: dimmed luminance reduces countdown / location; location uses `privacySensitive`
- Deep links match snapshot section URLs (same as phone widgets)

**Design notes (Apple HIG):** complications show dynamic Salah data on raise-wrist — the companion list is for marking. Prefer WidgetKit over ClockKit (`watchOS 9+`).
## Wear OS (NF-2.14)

- Phone pushes snapshot via Wearable Data Layer (`pushWearSnapshot` in `munib-external-commands`)
- `plugins/withWearOs.cjs` scaffolds `android/wear/` tile module on prebuild
- Tile tap uses a LoadAction clickable (`mark_current`); the tile re-requests and sends `/munib/mark_current` to the phone (not on tile-add)
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
| Live Activity | Countdown ticks; toggle off ends activity |
| Icon shortcuts | Long-press opens route from killed state |
| Siri mark | Background mark without UI; excused day dialog; pin lock defer |
| Assistant mark | Background enqueue on Android |
| Apple Watch | Schedule from snapshot; row tap marks on phone; face complications show next/progress |
| Watch face edit | Next Salah / Schedule / Progress appear in complication picker for circular, corner, inline, rectangular |
| Wear tile | Shows next prayer after phone sync; tap marks on phone |

## Related

- Shipped features: [`FEATURES.md`](./FEATURES.md) NF-1.18 / NF-1.19 / NF-2.14 / NF-2.15
- Device support: [`DEVICES.md`](./DEVICES.md)
- Doc index: [`README.md`](./README.md)
