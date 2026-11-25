# Device & platform support

Supported devices and minimum OS versions. Open expansion work: [`BACKLOG.md`](./BACKLOG.md#device-platforms).

Related: [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md) · [`TV.md`](./TV.md) · [`STORE_ASSETS.md`](./STORE_ASSETS.md) · [`apps/app/AGENTS.md`](../apps/app/AGENTS.md)

---

## Summary

| Category               | Supported                                                                                                     | Not supported            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------ |
| **Full app**           | iPhone, Android phone, iPad, Android tablet (adaptive wide layouts), web/PWA, **Apple TV (tvOS), Android TV** | visionOS, native desktop |
| **Companion surfaces** | iOS/Android widgets, iOS Live Activities, Siri, Google Assistant, Apple Watch, Wear OS tile                   | —                        |
| **Build requirement**  | EAS dev/production build for native surfaces (not Expo Go); TV needs `EXPO_TV=1` prebuild                     | —                        |

---

## Supported today

### Full app

| Platform                                | Status | Notes                                                                                                                                                                                                                                                               |
| --------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **iPhone (iOS)**                        | ✅     | Main Expo / React Native app (`apps/app`)                                                                                                                                                                                                                           |
| **Android phones**                      | ✅     | Same codebase as iOS                                                                                                                                                                                                                                                |
| **iPad (iOS tablet)**                   | ✅     | `"supportsTablet": true`; side rail at ≥768px window width; list–detail on Qur'an & Tracker at ≥900px                                                                                                                                                               |
| **Android tablets**                     | ✅     | Same adaptive width breakpoints as iPad (not device-type checks)                                                                                                                                                                                                    |
| **iPhone Duo (folding iPhone, iOS 27)** | ✅     | System `NativeTabs` at every width (iOS places the tab bar / vertical rail); horizontal safe-area insets; two-page mushaf spread when unfolded in landscape; tasbeeh tabletop tap pad (hinge `halfOpen`). See [Foldables](#foldables-iphone-duo--android-foldables) |
| **Android foldables**                   | ✅     | Width-based layouts (side rail ≥768px, list–detail ≥900px), mushaf spread, tasbeeh tabletop pad via `expo-hinge` (Android 11+)                                                                                                                                      |
| **Web / PWA**                           | ✅     | Static export — `pnpm --filter app web`, `build:web`; install + offline per browser: [`PWA.md`](PWA.md)                                                                                                                                                             |
| **Apple TV (tvOS)**                     | ✅     | Full Expo app via `react-native-tvos` + `EXPO_TV=1` — see [`TV.md`](./TV.md)                                                                                                                                                                                        |
| **Android TV / Fire TV**                | ✅     | Same TV build (Leanback); Fire TV uses standard Android TV APK                                                                                                                                                                                                      |

**Orientation:** unlocked (`orientation: "default"` in `app.json`) so phones, tablets, and foldables can rotate — required for Google Play large-screen guidance (Android 16 ignores portrait locks on ≥600dp anyway). Layouts adapt by window width (below). TV builds remain landscape-friendly via `@react-native-tvos/config-tv`. The PWA manifest uses `orientation: "any"` too (tablets, Chromebooks).

**Android Play optimization:** Release AABs enable R8 minify + resource shrinking (`expo-build-properties`) and `android.r8.optimizedResourceShrinking=true`. Expo SDK 58 builds with Gradle 9.4 / AGP 9.2 (the template still sets `android.builtInKotlin=false` until AGP 10); local Android modules use `expo-module-gradle-plugin`, which handles both Kotlin modes. Play’s edge-to-edge deprecated-API report may still list React Native `StatusBarModule` / Material until upstream removes those calls; app themes no longer set `statusBarColor` / `navigationBarColor`.

### Foldables (iPhone Duo / Android foldables)

Layout follows **window size**, never the device model; the hinge only drives interactions (Apple's guidance).

| Concern           | Implementation                                                                                                                                                                                                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation chrome | iPhone (incl. Duo): always `NativeTabs` with `preferredPlacement="automatic"`, so iOS 27 chooses bottom bar vs vertical rail — the custom rail never stacks beside it ([`app-tabs.tsx`](../apps/app/src/components/app-tabs.tsx)). iPad / Android / web / TV keep the width rule. |
| Bottom padding    | No tab-bar padding when `useVerticalBarEdgeIOS()` reports a side rail ([`use-content-bottom-inset.tsx`](../apps/app/src/hooks/use-content-bottom-inset.tsx)).                                                                                                                     |
| Side insets       | `horizontalSafeAreaPadding()` in [`rtl.ts`](../apps/app/src/lib/rtl.ts) maps physical left/right insets to start/end padding (RTL-safe) on every `ScreenLayout` and the home tab.                                                                                                 |
| Immersive reading | Reading fullscreen sets `verticalBarBehaviorIOS="disabled"` so the page gets the full width.                                                                                                                                                                                      |
| Qur'an            | Mushaf layout shows two facing pages (odd page on the physical right) on landscape windows ≥900px; page turns step a spread; folding remounts the pager on the same page.                                                                                                         |
| Tasbeeh           | Tabletop posture (`useHingePosture() === "halfOpen"`, [`hinge.ts`](../apps/app/src/lib/platform/hinge.ts)) adds a full-width tap pad on the lower half ([`tasbeeh-counter.tsx`](../apps/app/src/components/tasbeeh/tasbeeh-counter.tsx)); not on TV.                              |
| Hinge API         | `expo-hinge` (iOS 27.1+, Android 11+); `null` on web, TV, and devices without a hinge. Excluded from TV builds (Metro stub `src/lib/tv-stubs/expo-hinge.ts`).                                                                                                                     |

Duo displays, measured in the Xcode 27.2 simulator (iOS 27.2 `iPhone19,4` runtime, 2026-11-19). Pixel sizes are the framebuffers `simctl io` reports; point sizes assume @3x, which matches the breakpoints observed in the app (list–detail ≥900 pt only appears unfolded in landscape; the ≥1024 pt home dashboard never does):

| Display          | Posture   | Pixels    | Points (@3x) | Layout seen                                              |
| ---------------- | --------- | --------- | ------------ | -------------------------------------------------------- |
| Inner (unfolded) | portrait  | 2007×2853 | 669×951      | Phone layout, bottom tab bar                             |
| Inner (unfolded) | landscape | 2853×2007 | 951×669      | List–detail (Tracker schedule, Qur'an detail), side rail |
| Outer (folded)   | portrait  | 1398×2034 | 466×678      | Phone layout, vertical system rail on the right edge     |
| Outer (folded)   | landscape | 2034×1398 | 678×466      | Phone layout, vertical system rail                       |

The vertical system rail is a physical **right** inset in both LTR and RTL; `horizontalSafeAreaInsets()` maps it to the logical end/start side (the floating `AppHeader` applies it itself because it spans the screen's padding box).

**Tablet / TV UX:** Native and web adapt by **window width**: side rail at ≥768px ([`use-large-screen-layout.ts`](../apps/app/src/hooks/use-large-screen-layout.ts), [`app-tabs-wide.tsx`](../apps/app/src/components/app-tabs-wide.tsx)); Qur'an and Tracker use list–detail at ≥900px. **TV always uses the side rail** and 10-foot focus chrome.

**Large-screen web (desktop / tablet browser):**

| Width  | Chrome / layout                                                                                                                                                                                                                                                                                                                                                                       |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| < 768  | Phone layout + floating bottom tab bar                                                                                                                                                                                                                                                                                                                                                |
| ≥ 768  | Persistent global side rail beside **every** page ([`web-global-rail.tsx`](../apps/app/src/components/web/web-global-rail.tsx), mounted in [`app-stack.tsx`](../apps/app/src/components/app-stack.tsx)) — compact 88px (icon + label); active section from the URL ([`nav-section.ts`](../apps/app/src/lib/web/nav-section.ts)). Bottom sheets cap at 640px and center. Grids go 2-up |
| ≥ 1024 | Content column 1120px (Learn prose 880px); AppHeader row aligned to the column                                                                                                                                                                                                                                                                                                        |
| ≥ 1200 | 3-column grids; dashboards/readers add side asides                                                                                                                                                                                                                                                                                                                                    |
| ≥ 1280 | Rail expands to 248px with brand + labels                                                                                                                                                                                                                                                                                                                                             |
| ≥ 1600 | Content column 1320px; 4-column grids                                                                                                                                                                                                                                                                                                                                                 |

Use [`ResponsiveGrid` / `useResponsiveColumns`](../apps/app/src/components/ui/responsive-grid.tsx) for card grids. Desktop affordances are automatic: hover tint + pointer cursor on every `PressableScale`, a theme-coloured `:focus-visible` ring for keyboard users ([`+html.tsx`](../apps/app/src/app/+html.tsx)), and `/` or Ctrl/⌘+K to open search ([`web-keyboard-shortcuts.tsx`](../apps/app/src/components/web/web-keyboard-shortcuts.tsx)). First-run / auth routes (`/intro`, `/login`, `/oauth*`) stay chromeless.

Reusable large-screen helpers: Learn split + topic aside + timeline ([`learn-guide/learn-wide-layout.tsx`](../apps/app/src/components/learn-guide/learn-wide-layout.tsx), `learn-topic-aside.tsx`, `learn-timeline.tsx`), module hub two-pane / container-width grids ([`jannah/hub-layout.tsx`](../apps/app/src/components/jannah/hub-layout.tsx)), settings form caps / columns ([`settings/settings-layout.tsx`](../apps/app/src/components/settings/settings-layout.tsx)), calendar day side panel ([`calendar-day-panel.tsx`](../apps/app/src/components/calendar-day-panel.tsx)). Web keyboard shortcuts inside a screen use `useWebScreenKeyHandler` ([`use-web-key-handler.ts`](../apps/app/src/hooks/use-web-key-handler.ts)) — active only while that route is focused, never while typing. Desktop shortcuts: readers ←/→ (surah, Mushaf page, hadith book, 99 Names), Space play/pause or count (tasbeeh), quizzes 1–4 + Enter, calendar arrows / Home / PageUp/Down, flash cards A–D/1–4.

### Companion / extension surfaces

Ship with **EAS dev or production builds** — not Expo Go, not web.

| Surface                           | Platform                           | What it does                                                                                                                                                                                                                                                                | Code / config                                                                                                                                    |
| --------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Home & lock-screen widgets        | iOS WidgetKit, Android App Widgets | Next prayer, schedule, progress                                                                                                                                                                                                                                             | `targets/munib-tracker-widgets/`, `plugins/homeScreenSurfaces.cjs`, `react-native-android-widget`                                                |
| Live Activities                   | iOS 17+                            | Lock screen / Dynamic Island; phase windows + ActivityKit remote push when configured                                                                                                                                                                                       | `targets/munib-tracker-widgets/PrayerLiveActivity.swift`, `modules/munib-live-activity/`; ops [`LIVE_ACTIVITY_PUSH.md`](./LIVE_ACTIVITY_PUSH.md) |
| Siri / Shortcuts                  | iOS                                | Mark Salah, open routes                                                                                                                                                                                                                                                     | `targets/munib-tracker-intents/`                                                                                                                 |
| Google Assistant / App Actions    | Android                            | Voice mark Salah                                                                                                                                                                                                                                                            | `plugins/withExternalCommands.cjs`                                                                                                               |
| Apple Watch app                   | watchOS 10+                        | Now / Today / Tasbeeh / Overview pages; marks a begun Salah (queued via `transferUserInfo` when the phone is unreachable); after-Salah tasbeeh sequence, Double Tap counting (watchOS 11)                                                                                   | `targets/munib-tracker-watch/`                                                                                                                   |
| Apple Watch complications         | watchOS 10+                        | Next Salah / schedule / progress / streak / Qaza / Ramadan / Islamic date / Tasbeeh on face; advance at each Adhan without a phone push                                                                                                                                     | `targets/munib-tracker-watch-widgets/`                                                                                                           |
| Wear OS app, tiles, complications | Wear OS (API 30+)                  | App (Next Salah + Today + rotary tasbeeh), Next Salah / Today / Tasbeeh tiles, Next Salah + progress complications; marks sync as Data Layer items. Play **Wear OS** track (`pnpm release:app:wear`) under the phone's application ID (required by the Wearable Data Layer) | `plugins/withWearOs.cjs`, `modules/munib-wear/`                                                                                                  |

Watch and Wear are **companions tied to the phone app** — they read the shared widget snapshot and enqueue mark commands; they are not standalone full clients.

**App Group (iOS):** `group.app.munibtracker.widgets`

Build wiring: `apps/app/app.config.js` (`@bacons/apple-targets`, `withWearOs.cjs`, `withExternalCommands.cjs`, etc.). TV omits phone-only plugins when `EXPO_TV=1`.

---

## Not supported

| Platform                           | Notes              |
| ---------------------------------- | ------------------ |
| **Apple Vision Pro (visionOS)**    | No visionOS target |
| **macOS / Windows / Linux native** | Use web/PWA        |

Also not in repo: App Clip, Mac Catalyst. TV Leanback wiring is via `@react-native-tvos/config-tv` when `EXPO_TV=1` — see [`TV.md`](./TV.md).

---

## Minimum OS versions

| Target                               | Min version                              | Source                                                                                      |
| ------------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| Main iOS app                         | Expo SDK 58 minimum (iOS 16.4+)          | Expo prebuild                                                                               |
| Widgets, Live Activity, Siri intents | **iOS 17.0**                             | `targets/munib-tracker-*/expo-target.config.js`                                             |
| Apple Watch                          | **watchOS 10.0**                         | `targets/munib-tracker-watch/expo-target.config.js`, `targets/munib-tracker-watch-widgets/` |
| Wear OS module                       | **API 30** (Android 11+)                 | `plugins/withWearOs.cjs`                                                                    |
| Main Android app                     | Expo SDK 58 minimum (Android 7, API 24+) | Expo prebuild                                                                               |
| Apple TV                             | **tvOS 17+**                             | Expo TV / Xcode tvOS SDK                                                                    |
| Android TV                           | **API 31+** (TV system image)            | Android Studio TV emulator                                                                  |

Native surfaces require `EXPO_APPLE_TEAM_ID` for iOS extensions. See [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md).

---

## Config reference

| File                                            | Role                                                                                |
| ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| `apps/app/app.json`                             | `supportsTablet`, `orientation`, iOS/Android identifiers                            |
| `apps/app/app.config.js`                        | Plugins: apple-targets, Wear OS, widgets, external commands; TV gates via `EXPO_TV` |
| `apps/app/targets/munib-tracker-watch/`         | Apple Watch companion                                                               |
| `apps/app/targets/munib-tracker-watch-widgets/` | Apple Watch face complications (WidgetKit)                                          |
| `apps/app/targets/munib-tracker-widgets/`       | WidgetKit + Live Activity                                                           |
| `apps/app/targets/munib-tracker-intents/`       | Siri App Intents                                                                    |
| `apps/app/plugins/withWearOs.cjs`               | Wear OS tile scaffold                                                               |
| `docs/NATIVE_SURFACES.md`                       | Architecture and manual QA matrix                                                   |
| `docs/TV.md`                                    | Apple TV / Android TV prebuild, EAS, degradations                                   |
