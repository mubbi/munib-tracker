# Native widgets & Live Activities (NF-1.18 / NF-1.19)

The **data layer is done and unit-tested** in JS: `apps/app/src/lib/widget-data.ts`
(`buildWidgetPayload`) computes the next-prayer / countdown / Hijri / progress
payload entirely on-device from the `adhan` engine + stored location — the same
source the in-app hero uses, so the widget can never disagree with the app.

The **native rendering targets require an EAS dev/production build** (they do not
work in Expo Go or on the web) and native code that must be compiled + iterated on
a device. They are intentionally not committed here — writing uncompilable
Swift/Kotlin blind would be worse than a clear hand-off. Steps:

## 1. Bridge the payload to a shared container

JS can't write to a widget's storage directly. Add (or use) a small native module /
`expo-apple-targets` config that exposes an App Group (iOS) and
`SharedPreferences`/`DataStore` (Android). On app launch, foreground, location
change, prayer boundary, and tracker update, call `buildWidgetPayload(...)` and
write the JSON to that shared container. Reuse the day-crossing logic in
`hooks/use-home-hero.ts` for the refresh triggers.

## 2. iOS — WidgetKit

- Add a Widget Extension target (e.g. via `@bacons/apple-targets` /
  `expo-apple-targets`) sharing the App Group.
- Small + medium widgets: next prayer name + time, countdown; medium adds today's
  schedule or `progress`.
- Timeline: reload at each prayer boundary (read `nextPrayerTime`).
- Deep link on tap: `munib-tracker://` → Expo Router path (`/`, `/tracker`).
- Optional iOS 16+ lock-screen accessory + **Live Activity** (ActivityKit) for the
  next-prayer countdown — start/stop from JS via the same native module.

## 3. Android — App Widget

- `AppWidgetProvider` + `RemoteViews`, reading the same JSON from
  `SharedPreferences`. Match the iOS data schema.

## 4. Empty / permission states

- Location denied → "Set location" CTA deep-linking to `/location`.
- No network is required (on-device `adhan` + cached location).

## Verification (manual, on a build)

- iOS simulator + Android emulator with a manual location.
- Widget shows the correct next prayer; updates within ~1 min of a prayer boundary.
- Tapping the widget opens the app to the right screen from a killed state.
