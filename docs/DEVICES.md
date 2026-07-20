# Device & platform support

Supported devices and minimum OS versions. Open expansion work: [`BACKLOG.md`](./BACKLOG.md#device-platforms).

Related: [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md) · [`STORE_ASSETS.md`](./STORE_ASSETS.md) · [`apps/app/AGENTS.md`](../apps/app/AGENTS.md)

---

## Summary

| Category | Supported | Not supported |
|----------|-----------|---------------|
| **Full app** | iPhone, Android phone, iPad, Android tablet (adaptive wide layouts), web/PWA | tvOS, Android TV, visionOS, CarPlay, Android Auto, native desktop |
| **Companion surfaces** | iOS/Android widgets, iOS Live Activities, Siri, Google Assistant, Apple Watch, Wear OS tile | — |
| **Build requirement** | EAS dev/production build for native surfaces (not Expo Go) | — |

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

**Orientation:** portrait-only (`orientation: "portrait"` in `app.json`, PWA manifest).

**Tablet UX:** Native and web adapt by **window width**: side rail at ≥768px ([`use-large-screen-layout.ts`](../apps/app/src/hooks/use-large-screen-layout.ts), [`app-tabs-wide.tsx`](../apps/app/src/components/app-tabs-wide.tsx)); Qur'an and Tracker use list–detail at ≥900px.

### Companion / extension surfaces

Ship with **EAS dev or production builds** — not Expo Go, not web.

| Surface | Platform | What it does | Code / config |
|---------|----------|--------------|---------------|
| Home & lock-screen widgets | iOS WidgetKit, Android App Widgets | Next prayer, schedule, progress | `targets/munib-tracker-widgets/`, `plugins/homeScreenSurfaces.cjs`, `react-native-android-widget` |
| Live Activities | iOS 17+ | Lock screen / Dynamic Island countdown | `targets/munib-tracker-widgets/PrayerLiveActivity.swift`, `modules/munib-live-activity/` |
| Siri / Shortcuts | iOS | Mark Salah, open routes | `targets/munib-tracker-intents/` |
| Google Assistant / App Actions | Android | Voice mark Salah | `plugins/withExternalCommands.cjs` |
| Apple Watch app | watchOS 10+ | Schedule + mark Salah | `targets/munib-tracker-watch/` |
| Apple Watch complications | watchOS 10+ | Next Salah / schedule / progress on face | `targets/munib-tracker-watch-widgets/` |
| Wear OS tile | Wear OS (API 30+) | Next prayer tile; tap marks on phone | `plugins/withWearOs.cjs`, `modules/munib-wear/` |

Watch and Wear are **companions tied to the phone app** — they read the shared widget snapshot and enqueue mark commands; they are not standalone full clients.

**App Group (iOS):** `group.app.munibtracker.widgets`

Build wiring: `apps/app/app.config.js` (`@bacons/apple-targets`, `withWearOs.cjs`, `withExternalCommands.cjs`, etc.).

---

## Not supported

| Platform | Notes |
|----------|-------|
| **Apple TV (tvOS)** | No tvOS target |
| **Android TV / Fire TV** | No television feature |
| **Apple Vision Pro (visionOS)** | No visionOS target |
| **CarPlay / Android Auto** | No automotive entitlements |
| **macOS / Windows / Linux native** | Use web/PWA |
| **Dedicated Chromebook app** | Web/PWA preferred; Android APK may run |
| **Foldables / dual-screen** | No hinge-aware layouts |

Also not in repo: App Clip, Mac Catalyst, Android TV Leanback, automotive SDKs.

---

## Minimum OS versions

| Target | Min version | Source |
|--------|-------------|--------|
| Main iOS app | Expo SDK 57 default (~iOS 15+) | Expo prebuild |
| Widgets, Live Activity, Siri intents | **iOS 17.0** | `targets/munib-tracker-*/expo-target.config.js` |
| Apple Watch | **watchOS 10.0** | `targets/munib-tracker-watch/expo-target.config.js`, `targets/munib-tracker-watch-widgets/` |
| Wear OS module | **API 30** (Android 11+) | `plugins/withWearOs.cjs` |
| Main Android app | Expo SDK 57 default (~API 24+) | Expo prebuild |

Native surfaces require `EXPO_APPLE_TEAM_ID` for iOS extensions. See [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md).

---

## Config reference

| File | Role |
|------|------|
| `apps/app/app.json` | `supportsTablet`, `orientation`, iOS/Android identifiers |
| `apps/app/app.config.js` | Plugins: apple-targets, Wear OS, widgets, external commands |
| `apps/app/targets/munib-tracker-watch/` | Apple Watch companion |
| `apps/app/targets/munib-tracker-watch-widgets/` | Apple Watch face complications (WidgetKit) |
| `apps/app/targets/munib-tracker-widgets/` | WidgetKit + Live Activity |
| `apps/app/targets/munib-tracker-intents/` | Siri App Intents |
| `apps/app/plugins/withWearOs.cjs` | Wear OS tile scaffold |
| `docs/NATIVE_SURFACES.md` | Architecture and manual QA matrix |
