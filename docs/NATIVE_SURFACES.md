# Native surfaces (widgets, Live Activities, voice, watch)

Native home-screen widgets, Live Activities, Siri/Assistant shortcuts, Apple Watch,
and Wear OS companion surfaces share the **`appSurfaces`** architecture documented
originally in this file for widgets (NF-1.18 / NF-1.19).

## Architecture

| Layer | Path | Role |
|-------|------|------|
| Quick actions registry | `src/lib/appSurfaces/quickActions/` | Icon long-press shortcuts (NF-1.30) |
| Intent registry | `src/lib/appSurfaces/intents/registry.ts` | Siri / Assistant phrase catalog (NF-2.15) |
| Widget snapshot | `src/lib/appSurfaces/widgets/buildWidgetSnapshot.ts` | Localized schedule + status JSON |
| Shared storage | `src/lib/appSurfaces/widgets/snapshotStorage.ts` | AsyncStorage + iOS App Group |
| External commands | `src/lib/external-commands/` | Mark-prayed queue + JS executor |
| Native command module | `modules/munib-external-commands/` | App Group queue, WatchConnectivity, Wear snapshot push |
| Wear listener | `modules/munib-wear/` | Wear OS message → command queue |
| iOS WidgetKit | `targets/munib-tracker-widgets/` | Home + lock-screen widgets + Live Activity UI |
| iOS App Intents | `targets/munib-tracker-intents/` | Siri background mark + navigation (NF-2.15) |
| Apple Watch | `targets/munib-tracker-watch/` | SwiftUI schedule + mark (NF-2.14) |
| Live Activity control | `modules/munib-live-activity/` | ActivityKit start/update/end |
| Config plugins | `plugins/homeScreenSurfaces.cjs`, `withExternalCommands.cjs`, `withWearOs.cjs` | Native project wiring |
| Hooks | `use-app-quick-actions.ts`, `use-widget-snapshot-sync.ts`, `use-external-command-processor.ts` | Sync + drain loops |

**App Group:** `group.com.munibtracker.widgets`

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
See `src/lib/live-activity/` and `PrayerLiveActivity.swift`.

## Siri & Assistant (NF-2.15)

| Intent | Behavior |
|--------|----------|
| Mark my Salah | Background — enqueues `mark-current-obligatory`, no UI |
| Open checklist / Qibla / Tasbeeh | Foreground — opens `munib-tracker://` route |

- iOS: `targets/munib-tracker-intents/MunibAppIntents.swift` (`openAppWhenRun: false` for mark)
- Android: `plugins/withExternalCommands.cjs` → App Actions + broadcast receiver
- JS drain: `ExternalCommandProcessor` in root `_layout.tsx` (respects pin lock deferral)
- Help: **Settings → Siri & voice shortcuts**

**Force-quit limitation:** if the app process is killed, Siri still enqueues the command; it applies on next launch or foreground.

## Apple Watch (NF-2.14)

- Target: `targets/munib-tracker-watch/` (`type: "watch"`)
- Reads `widget_snapshot_v1` from App Group (same schema as WidgetKit)
- Marks via App Group command queue + WatchConnectivity nudge to phone
- Requires paired iPhone with Munib Tracker installed

## Wear OS (NF-2.14)

- Phone pushes snapshot via Wearable Data Layer (`pushWearSnapshot` in `munib-external-commands`)
- `plugins/withWearOs.cjs` scaffolds `android/wear/` tile module on prebuild
- Tile tap sends `/munib/mark_current` message → `munib-wear` listener enqueues command
- Requires Google Play Services + paired watch

## Build requirements

All native surfaces require an **EAS dev/production build** — not Expo Go or web.

```bash
pnpm install
pnpm --filter app prebuild
pnpm --filter app ios   # or android
```

Set `EXPO_APPLE_TEAM_ID` for iOS extensions. App Group: `group.com.munibtracker.widgets`.

## Manual QA matrix

| Surface | Check |
|---------|-------|
| Widgets | Next prayer correct; tap opens app; location-denied CTA |
| Live Activity | Countdown ticks; toggle off ends activity |
| Icon shortcuts | Long-press opens route from killed state |
| Siri mark | Background mark without UI; excused day dialog; pin lock defer |
| Assistant mark | Background enqueue on Android |
| Apple Watch | Schedule from snapshot; row tap marks on phone |
| Wear tile | Shows next prayer after phone sync; tap marks on phone |

## Related

- Widget-only historical notes: [`NATIVE_WIDGETS.md`](./NATIVE_WIDGETS.md) (superseded by this doc for new work)
- Roadmap: [`NEW_FEATURES_TODO.md`](./NEW_FEATURES_TODO.md) NF-2.14 / NF-2.15
