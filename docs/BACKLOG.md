# Active backlog

Open work only. Shipped features: [`FEATURES.md`](./FEATURES.md). Guides: [`README.md`](./README.md).

---

## Product

Open lifestyle / worship features (not yet shipped). Shipped catalog: [`FEATURES.md`](./FEATURES.md).

| ID      | Feature              | Notes                                                                   |
| ------- | -------------------- | ----------------------------------------------------------------------- |
| NF-2.16 | Nearby masjid finder | Maps + Friday times — common competitor feature; keep optional / opt-in |

---

## Product — data-blocked

These need **OSS datasets** before implementation (do not AI-generate). Currently none open —
NF-2.8 / NF-2.9 shipped in [`FEATURES.md`](./FEATURES.md).

---

## Performance

Profile + playbooks: [`PROFILING.md`](./PROFILING.md)

| Priority | Task                                                                                                                                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| P1       | Android barcode / ML Kit assets — confirm unused; exclude from release AAB if so                                                            |
| —        | ~~Thinner home shell~~ — shipped: lazy `home-below-fold`, deferred store loads, SEO locale `import()`, lazy moon sheet / idle root overlays |

---

## Device platforms

Support matrix: [`DEVICES.md`](./DEVICES.md)

| ID   | Goal                                   | Status                                                                                                                                                                                 |
| ---- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DS-1 | Native tablet / large-screen polish    | Shipped — window-width side rail (≥768) + Qur'an/Tracker list–detail (≥900); foldables: facing mushaf pages when unfolded, tabletop tasbeeh via `lib/platform/hinge.ts` (`expo-hinge`) |
| DS-2 | Watch / Wear maintenance QA            | Built — include face complications (circular/corner/inline/rectangular) each native bump                                                                                               |
| DS-3 | Apple TV / Android TV                  | Shipped — full app via `react-native-tvos` + `EXPO_TV=1` ([`TV.md`](./TV.md))                                                                                                          |
| DS-4 | visionOS                               | Not started                                                                                                                                                                            |
| DS-6 | Desktop native (PWA preferred)         | Web shipped                                                                                                                                                                            |
| DS-9 | Live Activity delivery worker (Fly.io) | Deferred — QStash + cron is current; add when prayer-time backlog needs a long-running poller ([`LIVE_ACTIVITY_PUSH.md`](./LIVE_ACTIVITY_PUSH.md#future-flyio-worker-when-required))   |

---

## Expo SDK 58 follow-ups

Upgrade shipped in PR #71 (`b349d54a`); these checks were still open when it merged.

| Item                 | Notes                                                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| On-device QA matrix  | Cache migration, recitation capture, audio focus, quick-action cold start, Precise Adhan under Doze, AsyncStorage downgrade                            |
| Device-only surfaces | Release (R8) builds, Wear OS app, widgets, Android Live Updates and OAuth not yet verified on device                                                   |
| Mac builds           | `cleanbuild:app:ios` / `cleanbuild:app:tv`, Xcode build of app + local modules + targets, iOS and tvOS archives, `@bacons/apple-targets` 5 check       |
| iPhone Duo           | Vertical-bar status glyphs ignore per-screen `StatusBar` style on iOS 27.2 (dark clock on the night home hero) — sizes in [`DEVICES.md`](./DEVICES.md) |
| Store screenshots    | Pending sets (Play phone/tablet refresh, Wear OS, Android TV banner) — status table in [`STORE_ASSETS.md`](./STORE_ASSETS.md#store-screenshot-status)  |
| Store version codes  | Set from Play Console / App Store Connect before the next upload ([`RELEASES.md`](./RELEASES.md))                                                      |
| TypeORM 1 migrations | Run Postgres migrations against a throwaway DB before the first API deploy                                                                             |
| TV in version API    | Add a TV platform to the app-version API                                                                                                               |
| SDK 58 experiments   | Not trialled: granular web chunking, `LocaleProvider`, `activityEnabled`, `expo-location/next`, variable fonts, `requireConfirmation`                  |

---

## Content pipeline

See [`FREE_OPEN_SOURCE_DATA.md`](./FREE_OPEN_SOURCE_DATA.md) and [`DATA_INGESTION.md`](./DATA_INGESTION.md).

| Item                                    | Notes                                                                                                                   |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Bundled adhan-call MP3 (full local set) | Baseline `adhan.mp3` + remote CDN styles shipped (`lib/adhan-audio.ts`); expand local files under `assets/audio/adhan/` |
| Per-item content `audioUri`             | Types wired; populate from OSS where available (play UI stays hidden until real URLs)                                   |
