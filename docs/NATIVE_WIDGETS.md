# Native widgets & Live Activities (NF-1.18 / NF-1.19)

Native home-screen widgets and app-icon quick actions are implemented following the
[`smart-expense-tracker`](../../smart-expense-tracker) `appSurfaces` architecture.

## Architecture

| Layer | Path | Role |
|-------|------|------|
| Quick actions registry | `src/lib/appSurfaces/quickActions/` | Declarative shortcut list + `syncAppQuickActions()` |
| Widget snapshot | `src/lib/appSurfaces/widgets/buildWidgetSnapshot.ts` | Builds JSON from `buildWidgetPayload()` + tracker/schedule |
| Shared storage | `src/lib/appSurfaces/widgets/snapshotStorage.ts` | AsyncStorage + iOS App Group via `@bacons/apple-targets` |
| Android renderers | `src/lib/appSurfaces/widgets/renderers/` | `react-native-android-widget` JSX (HIG-sized cells) |
| iOS WidgetKit | `targets/munib-tracker-widgets/` | SwiftUI widgets reading the same JSON |
| iOS Live Activity | `targets/munib-tracker-widgets/PrayerLiveActivity.swift` | Lock-screen + Dynamic Island next-prayer countdown (NF-1.19) |
| Live Activity control | `modules/munib-live-activity/` | Local Expo module (ActivityKit) — start/update/end from JS |
| Live Activity JS bridge | `src/lib/live-activity/` | `syncLiveActivity()`, snapshot → `LiveActivityState` |
| Config plugin | `plugins/homeScreenSurfaces.cjs` | Widget cell sizes, preview images, Android shortcut icons |
| Hooks | `src/hooks/use-app-quick-actions.ts`, `use-widget-snapshot-sync.ts` | Registered from `(tabs)/_layout.tsx` |

## Widgets

| Widget | iOS families | Android cell | Shows |
|--------|-------------|--------------|-------|
| **Next prayer** | small, medium, lock-screen accessory | 4×2 (250×110 dp) | Next prayer name, time, countdown, Hijri date |
| **Schedule** | small, medium, large, lock-screen | 4×4 (250×250 dp) | Today's five obligatory prayer times |
| **Progress** | small, lock-screen circular/rectangular | 2×2 (110×110 dp) | Today's fard progress (e.g. 3/5) |

Timeline reload: iOS reloads at the next prayer boundary (from `minutesUntil`); Android
refreshes when the app syncs the snapshot (foreground, tracker update, location change).

## Quick actions

iOS shows the first **4** shortcuts (Apple limit); Android shows all **5**:

1. Checklist → `/tracker`
2. Qibla → `/qibla`
3. Tasbeeh → `/tasbeeh/free`
4. Qaza → `/qaza`
5. Qur'an → `/quran` (Android only)

Android adaptive shortcut icons live in `assets/images/quick-actions/` (108×108 px
foreground PNGs). Regenerate with:

```bash
python apps/app/scripts/generate-android-surface-assets.py
```

## Live Activities (NF-1.19)

An opt-in iOS **Live Activity** shows a self-updating next-prayer countdown on the
lock screen and in the Dynamic Island. It reuses the same on-device prayer math as
the widgets — no network, no second source of truth.

| Layer | Path |
|-------|------|
| Shared attributes | `modules/munib-live-activity/ios/PrayerActivityAttributes.swift` **and** `targets/munib-tracker-widgets/PrayerActivityAttributes.swift` (kept byte-for-byte identical) |
| Native control module | `modules/munib-live-activity/ios/MunibLiveActivityModule.swift` (`Name("MunibLiveActivity")`) |
| SwiftUI presentation | `targets/munib-tracker-widgets/PrayerLiveActivity.swift`, registered in `index.swift` |
| JS bridge | `src/lib/live-activity/{native,state,index}.ts` |
| Wiring | `use-widget-snapshot-sync.ts` calls `syncLiveActivity()` after each snapshot write |
| Preference | `UserPreferences.liveActivityEnabled` (default off); toggle in `settings/notifications.tsx` |

**How it flows:** the user enables it in **Settings → Notifications → Live Activity**
(iOS only, shown when `ActivityAuthorizationInfo().areActivitiesEnabled`). On every
snapshot refresh, `syncLiveActivity()` starts the activity if enabled and absent,
updates it if running, and ends it when the toggle is off. The activity's `staleDate`
is the next-prayer instant, and the lock-screen/Dynamic-Island views use
`Text(timerInterval:)` so the countdown ticks without app involvement.

**Attributes duplication:** ActivityKit matches a running activity to the widget
extension's `ActivityConfiguration` by the attributes type name + Codable shape.
The struct is therefore defined **identically in both** the control module (main app
binary) and the widget extension. If you change one, change the other.

**Requirements:** iOS **16.2+**; `NSSupportsLiveActivities: true` in the main app
`Info.plist` (set via `app.json` → `ios.infoPlist`); an EAS dev/production build
(no Expo Go, no web, no Android).

## Build requirements

Widgets, Live Activities, and icon shortcuts require an **EAS dev/production build** —
they do not work in Expo Go or on web.

```bash
pnpm install
pnpm --filter app prebuild
pnpm --filter app ios   # or android
```

Set `EXPO_APPLE_TEAM_ID` for iOS widget extensions. App Group:
`group.com.munibtracker.widgets`.

## Verification (manual, on device)

- Add each widget on iOS simulator + Android emulator with a manual location.
- Widget shows the correct next prayer; updates after a prayer boundary or app foreground.
- Long-press app icon → shortcuts open the correct screen from a killed state.
- Location denied → widget shows “Set location” CTA deep-linking to `/location`.
