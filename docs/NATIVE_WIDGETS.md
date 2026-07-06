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

## Build requirements

Widgets and icon shortcuts require an **EAS dev/production build** — they do not work
in Expo Go or on web.

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
