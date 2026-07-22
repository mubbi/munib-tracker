# Device & platform support

Supported devices and minimum OS versions. Open expansion work: [`BACKLOG.md`](./BACKLOG.md#device-platforms).

Related: [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md) · [`TV.md`](./TV.md) · [`STORE_ASSETS.md`](./STORE_ASSETS.md) · [`apps/app/AGENTS.md`](../apps/app/AGENTS.md)

---

## Summary

| Category | Supported | Not supported |
|----------|-----------|---------------|
| **Full app** | iPhone, Android phone, iPad, Android tablet (adaptive wide layouts), web/PWA, **Apple TV (tvOS), Android TV** | visionOS, native desktop |
| **Companion surfaces** | iOS/Android widgets, iOS Live Activities, Siri, Google Assistant, Apple Watch, Wear OS tile | — |
| **Build requirement** | EAS dev/production build for native surfaces (not Expo Go); TV needs `EXPO_TV=1` prebuild | — |

---

## Supported today

### Full app

| Platform | Status | Notes |
|----------|--------|-------|
| **iPhone (iOS)** | ✅ | Main Expo / React Native app (`apps/app`) |
| **Android phones** | ✅ | Same codebase as iOS |
| **iPad (iOS tablet)** | ✅ | `"supportsTablet": true`; side rail at ≥768px window width; list–detail on Qur'an & Tracker at ≥900px |
| **Android tablets** | ✅ | Same adaptive width breakpoints as iPad (not device-type checks) |
| **Web / PWA** | ✅ | Static export — `pnpm --filter app web`, `build:web` |
| **Apple TV (tvOS)** | ✅ | Full Expo app via `react-native-tvos` + `EXPO_TV=1` — see [`TV.md`](./TV.md) |
| **Android TV / Fire TV** | ✅ | Same TV build (Leanback); Fire TV uses standard Android TV APK |

**Orientation:** portrait-only on phone (`orientation: "portrait"` in `app.json`); TV builds are landscape-friendly via `@react-native-tvos/config-tv`.

**Tablet / TV UX:** Native and web adapt by **window width**: side rail at ≥768px ([`use-large-screen-layout.ts`](../apps/app/src/hooks/use-large-screen-layout.ts), [`app-tabs-wide.tsx`](../apps/app/src/components/app-tabs-wide.tsx)); Qur'an and Tracker use list–detail at ≥900px. **TV always uses the side rail** and 10-foot focus chrome.

### Companion / extension surfaces

Ship with **EAS dev or production builds** — not Expo Go, not web.

| Surface | Platform | What it does | Code / config |
|---------|----------|--------------|---------------|
| Home & lock-screen widgets | iOS WidgetKit, Android App Widgets | Next prayer, schedule, progress | `targets/munib-tracker-widgets/`, `plugins/homeScreenSurfaces.cjs`, `react-native-android-widget` |
| Live Activities | iOS 17+ | Lock screen / Dynamic Island; phase windows + ActivityKit remote push when configured | `targets/munib-tracker-widgets/PrayerLiveActivity.swift`, `modules/munib-live-activity/`; ops [`LIVE_ACTIVITY_PUSH.md`](./LIVE_ACTIVITY_PUSH.md) |
| Siri / Shortcuts | iOS | Mark Salah, open routes | `targets/munib-tracker-intents/` |
| Google Assistant / App Actions | Android | Voice mark Salah | `plugins/withExternalCommands.cjs` |
| Apple Watch app | watchOS 10+ | Schedule + mark Salah | `targets/munib-tracker-watch/` |
| Apple Watch complications | watchOS 10+ | Next Salah / schedule / progress on face | `targets/munib-tracker-watch-widgets/` |
| Wear OS tile | Wear OS (API 30+) | Next prayer tile; tap marks on phone | `plugins/withWearOs.cjs`, `modules/munib-wear/` |

Watch and Wear are **companions tied to the phone app** — they read the shared widget snapshot and enqueue mark commands; they are not standalone full clients.

**App Group (iOS):** `group.app.munibtracker.widgets`

Build wiring: `apps/app/app.config.js` (`@bacons/apple-targets`, `withWearOs.cjs`, `withExternalCommands.cjs`, etc.). TV omits phone-only plugins when `EXPO_TV=1`.

---

## Not supported

| Platform | Notes |
|----------|-------|
| **Apple Vision Pro (visionOS)** | No visionOS target |
| **macOS / Windows / Linux native** | Use web/PWA |

Also not in repo: App Clip, Mac Catalyst. TV Leanback wiring is via `@react-native-tvos/config-tv` when `EXPO_TV=1` — see [`TV.md`](./TV.md).

---

## Minimum OS versions

| Target | Min version | Source |
|--------|-------------|--------|
| Main iOS app | Expo SDK 57 default (~iOS 15+) | Expo prebuild |
| Widgets, Live Activity, Siri intents | **iOS 17.0** | `targets/munib-tracker-*/expo-target.config.js` |
| Apple Watch | **watchOS 10.0** | `targets/munib-tracker-watch/expo-target.config.js`, `targets/munib-tracker-watch-widgets/` |
| Wear OS module | **API 30** (Android 11+) | `plugins/withWearOs.cjs` |
| Main Android app | Expo SDK 57 default (~API 24+) | Expo prebuild |
| Apple TV | **tvOS 17+** | Expo TV / Xcode tvOS SDK |
| Android TV | **API 31+** (TV system image) | Android Studio TV emulator |

Native surfaces require `EXPO_APPLE_TEAM_ID` for iOS extensions. See [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md).

---

## Config reference

| File | Role |
|------|------|
| `apps/app/app.json` | `supportsTablet`, `orientation`, iOS/Android identifiers |
| `apps/app/app.config.js` | Plugins: apple-targets, Wear OS, widgets, external commands; TV gates via `EXPO_TV` |
| `apps/app/targets/munib-tracker-watch/` | Apple Watch companion |
| `apps/app/targets/munib-tracker-watch-widgets/` | Apple Watch face complications (WidgetKit) |
| `apps/app/targets/munib-tracker-widgets/` | WidgetKit + Live Activity |
| `apps/app/targets/munib-tracker-intents/` | Siri App Intents |
| `apps/app/plugins/withWearOs.cjs` | Wear OS tile scaffold |
| `docs/NATIVE_SURFACES.md` | Architecture and manual QA matrix |
| `docs/TV.md` | Apple TV / Android TV prebuild, EAS, degradations |
