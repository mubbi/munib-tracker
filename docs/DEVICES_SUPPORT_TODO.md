# Device & platform support

Reference for which devices Munib Tracker supports today, which are out of scope, and what work is needed to expand coverage.

Related docs:

- [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md) — widgets, Live Activities, Siri/Assistant, Apple Watch, Wear OS
- [`STORE_ASSETS.md`](./STORE_ASSETS.md) — App Store / Play Console screenshot sizes (phone, tablet, iPad)
- [`apps/app/AGENTS.md`](../apps/app/AGENTS.md) — Expo product app conventions

---

## Summary

| Category | Supported | Not supported |
|----------|-----------|---------------|
| **Full app** | iPhone, Android phone, iPad, Android tablet (phone UI), web/PWA | tvOS, Android TV, visionOS, CarPlay, Android Auto, native desktop |
| **Companion surfaces** | iOS/Android widgets, iOS Live Activities, Siri, Google Assistant, Apple Watch, Wear OS tile | — |
| **Build requirement** | EAS dev/production build for native surfaces (not Expo Go) | — |

---

## Supported today

### Full app (primary experience)

| Platform | Status | Notes |
|----------|--------|-------|
| **iPhone (iOS)** | ✅ | Main Expo / React Native app (`apps/app`) |
| **Android phones** | ✅ | Same codebase as iOS |
| **iPad (iOS tablet)** | ✅ | `"supportsTablet": true` in `apps/app/app.json` |
| **Android tablets** | ✅ (as phone app) | No separate tablet APK; Play listing includes tablet screenshots (`apps/app/store-assets/`) |
| **Web / PWA** | ✅ | Static export — `pnpm --filter app web`, `build:web` |

**Orientation:** portrait-only everywhere (`orientation: "portrait"` in `app.json`, PWA manifest).

**Tablet UX:** There is no dedicated native tablet layout (no iPad split view, no Android large-screen rail). Native tablets run the phone UI scaled up. **Web** adapts at wide widths — side navigation rail at ≥768px (`src/hooks/use-web-tab-layout.ts`, `src/components/app-tabs.web.tsx`).

### Companion / extension surfaces

These ship with **EAS dev or production builds** — not Expo Go, not web.

| Surface | Platform | What it does | Code / config |
|---------|----------|--------------|---------------|
| Home & lock-screen widgets | iOS WidgetKit, Android App Widgets | Next prayer, schedule, progress | `targets/munib-tracker-widgets/`, `plugins/homeScreenSurfaces.cjs`, `react-native-android-widget` |
| Live Activities | iOS 17+ | Lock screen / Dynamic Island countdown | `targets/munib-tracker-widgets/PrayerLiveActivity.swift`, `modules/munib-live-activity/` |
| Siri / Shortcuts | iOS | Mark Salah, open routes | `targets/munib-tracker-intents/` |
| Google Assistant / App Actions | Android | Voice mark Salah | `plugins/withExternalCommands.cjs` |
| Apple Watch app | watchOS 10+ | Schedule + mark Salah | `targets/munib-tracker-watch/` |
| Wear OS tile | Wear OS (API 30+) | Next prayer tile; tap marks on phone | `plugins/withWearOs.cjs`, `modules/munib-wear/` |

Watch and Wear are **companions tied to the phone app** — they read the shared widget snapshot and enqueue mark commands; they are not standalone full clients.

**App Group (iOS):** `group.com.munibtracker.widgets`

Build wiring lives in `apps/app/app.config.js` (`@bacons/apple-targets`, `withWearOs.cjs`, `withExternalCommands.cjs`, etc.).

---

## Not supported

| Platform | Status | Notes |
|----------|--------|-------|
| **Apple TV (tvOS)** | ❌ | No tvOS target or manifest |
| **Android TV / Fire TV** | ❌ | No `android.hardware.type.television` feature |
| **Apple Vision Pro (visionOS)** | ❌ | No visionOS target |
| **Apple CarPlay / Android Auto** | ❌ | No automotive entitlements or templates |
| **macOS / Windows / Linux native** | ❌ | Use web/PWA instead |
| **Dedicated Chromebook app** | ❌ | Android APK may run on some Chromebooks; web is the intended path |
| **Foldables / dual-screen** | ❌ | No foldable- or hinge-aware layouts |

Also not in repo: App Clip, Mac Catalyst, Android TV Leanback, automotive SDKs.

---

## Minimum OS versions

| Target | Min version | Source |
|--------|-------------|--------|
| Main iOS app | Expo SDK 57 default (~iOS 15+) | Expo prebuild |
| Widgets, Live Activity, Siri intents | **iOS 17.0** | `targets/munib-tracker-*/expo-target.config.js` |
| Apple Watch | **watchOS 10.0** | `targets/munib-tracker-watch/expo-target.config.js` |
| Wear OS module | **API 30** (Android 11+) | `plugins/withWearOs.cjs` |
| Main Android app | Expo SDK 57 default (~API 24+) | Expo prebuild |

Native surfaces require `EXPO_APPLE_TEAM_ID` for iOS extensions. See [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md) for build commands.

---

## Roadmap / TODO

Action items if expanding device support. Check off as shipped.

### DS-1 — Native tablet & large-screen polish (low effort)

**Goal:** Better UX on iPad and Android tablets without a new store category.

- [ ] Add responsive breakpoints on native (reuse web side-rail pattern at ≥768px where appropriate)
- [ ] Audit key screens on iPad simulator and Play tablet form factors (Qur'an reader, tracker, settings)
- [ ] Consider optional landscape for reading-heavy screens (Qur'an, hadith) while keeping global default portrait
- [ ] Document tablet QA in release checklist

**Files to touch:** layout hooks (`use-web-tab-layout.ts` pattern for native), `ScreenLayout`, tab chrome, Qur'an reader.

---

### DS-2 — Apple Watch / Wear OS (built — maintenance & QA)

**Goal:** Keep companion surfaces reliable across releases.

- [ ] Verify EAS build includes watch target + Wear module after each native dependency change
- [ ] Manual QA matrix from [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md) (schedule sync, mark on phone, location-denied state)
- [ ] Store listing copy mentions watch/tile support where relevant

**Already shipped:** NF-2.14 (`targets/munib-tracker-watch`, `withWearOs.cjs`). See [`NEW_FEATURES_TODO.md`](./NEW_FEATURES_TODO.md).

---

### DS-3 — Apple TV / Android TV (new target — high effort)

**Goal:** Glanceable prayer times on living-room devices.

- [ ] Product decision: read-only schedule vs full tracker
- [ ] **tvOS:** New `@bacons/apple-targets` target (`type: "tv"`) or native tvOS app; 10-foot UI (focus navigation, D-pad)
- [ ] **Android TV:** New module with `android.hardware.type.television`; Leanback or Compose for TV
- [ ] Separate Play / App Store TV listing or TV-optimized flavor
- [ ] No qibla compass / location assumptions without remote-friendly flows

**Not started.** Phone screens do not translate without a full UI rewrite.

---

### DS-4 — visionOS / Vision Pro (new target — high effort)

**Goal:** Optional spatial or “Designed for iPad” experience on Vision Pro.

- [ ] Evaluate “Designed for iPad” on Vision Pro vs dedicated visionOS target
- [ ] Full spatial app would need SwiftUI / visionOS-specific work beyond current Expo stack

**Not started.**

---

### DS-5 — CarPlay / Android Auto (new entitlement — medium/high effort)

**Goal:** Glanceable prayer times while driving (templates only — no custom full-screen UI).

- [ ] **CarPlay:** CarPlay entitlement, template-based UI, category approval from Apple
- [ ] **Android Auto:** Android for Cars App Library; template constraints
- [ ] Scope: prayer schedule + next prayer; defer qibla / tasbeeh / full Qur'an reader

**Not started.**

---

### DS-6 — Desktop native (alternative: web)

**Goal:** Desktop users can install and use Munib Tracker.

- [ ] **Recommended:** Promote web PWA install (`build:web`, `src/components/pwa/`)
- [ ] **Optional iOS:** Mac Catalyst (add macOS destination in Xcode)
- [ ] **Optional cross-platform:** Tauri/Electron wrapping web export — only if PWA is insufficient

**Web already supported.** No native desktop target today.

---

### DS-7 — Chromebook

**Goal:** Good experience on Chrome OS.

- [ ] Promote web/PWA as primary Chromebook path
- [ ] Optional: Android large-screen optimizations (resizeable activities) for Play on Chrome OS

**Not started** beyond default Android/web behavior.

---

### DS-8 — Foldables / dual-screen

**Goal:** Layout adapts across hinge / dual-pane.

- [ ] Detect fold posture (Android WindowManager Jetpack, iOS multi-window where applicable)
- [ ] Two-pane layouts for tracker + detail on unfolded devices

**Not started.**

---

## Quick reference: what to do by goal

| If you want… | Start here |
|--------------|------------|
| Better iPad / Android tablet UX | **DS-1** — responsive native layouts |
| Watch / Wear working in production | **DS-2** — EAS build + [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md) QA |
| TV apps | **DS-3** — new native TV targets + 10-foot UI |
| Vision Pro | **DS-4** — visionOS or iPad compatibility mode |
| In-car glanceable times | **DS-5** — CarPlay / Android Auto templates |
| Desktop install | **DS-6** — web PWA (already available) |
| Chromebook | **DS-7** — web PWA first |
| Foldables | **DS-8** — hinge-aware layouts |

---

## Config reference

Key files that define current device behavior:

| File | Role |
|------|------|
| `apps/app/app.json` | `supportsTablet`, `orientation`, iOS/Android identifiers |
| `apps/app/app.config.js` | Plugins: apple-targets, Wear OS, widgets, external commands |
| `apps/app/targets/munib-tracker-watch/` | Apple Watch companion |
| `apps/app/targets/munib-tracker-widgets/` | WidgetKit + Live Activity |
| `apps/app/targets/munib-tracker-intents/` | Siri App Intents |
| `apps/app/plugins/withWearOs.cjs` | Wear OS tile scaffold |
| `docs/NATIVE_SURFACES.md` | Architecture and manual QA matrix |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-07-09 | Initial device support inventory and roadmap (DS-1 … DS-8) |
