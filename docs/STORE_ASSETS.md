# Store assets & screenshot automation

End-to-end workflow for Munib Tracker **App Store Connect** and **Google Play Console** marketing assets: native device captures → designed frames → store-resolution exports.

## Pipeline overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. Native capture (Maestro + emulator/simulator)                        │
│    pnpm screenshots:android | pnpm screenshots:ios                      │
│    → store-assets/captures-native/{android|ios}/<locale>/<theme>/*.png   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ studio-locale captures → STUDIO_ALIASES copy
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. Studio inputs (per platform × locale)                                │
│    → store-assets/captures/{android|ios}/<locale>/<theme>/{home,…}.jpg │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ pnpm sync:screenshot-captures
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. Screenshot Studio editor (Next.js, port 3010)                      │
│    pnpm dev:screenshot-studio → export bundles (UI or export:…)         │
│    iPhone/iPad decks ← captures/ios · Android decks ← captures/android  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ pnpm distribute:screenshot-exports
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 4. Final store PNGs                                                     │
│    store-assets/ios/screenshots/…  store-assets/android/screenshots/…   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Quick reference

| Step                                                                | Command                                                               | Output                                                                   |
| ------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Validate capture scripts (CI-safe)                                  | `pnpm screenshots:validate`                                           | —                                                                        |
| Native full matrix                                                  | `pnpm screenshots:android` / `pnpm screenshots:ios`                   | `captures-native/`                                                       |
| Native iPad Pro 13-inch (2064×2752)                                 | `pnpm screenshots:ipad`                                               | `captures-native/ipad/` + `captures/ipad/`                               |
| Apple Watch (Ultra 3)                                               | `pnpm screenshots:watch`                                              | `captures-native/watch/` + `ios/screenshots/watch-ultra-3/`              |
| iPhone Duo (native, one run per posture)                            | `DUO_SCREEN=inner\|outer pnpm screenshots:duo`                        | `captures-native/ios-duo/` + `ios/screenshots/iphone-duo/<slot>/`        |
| Apple TV / Android TV (validate)                                    | `pnpm screenshots:tvos` / `screenshots:android-tv` / `screenshots:tv` | No PNGs unless `RUN_CAPTURE=1` → `apple-tv-1080p/` / `android-tv-1080p/` |
| Seed studio decks + copy                                            | `pnpm seed:screenshot-studio`                                         | `tools/screenshot-studio/app-store-screenshots.json`                     |
| Sync Munib logo/icon into studio                                    | `pnpm sync:screenshot-brand-assets`                                   | `tools/screenshot-studio/public/app-icon.png`                            |
| Sync captures into editor                                           | `pnpm sync:screenshot-captures`                                       | `tools/screenshot-studio/public/screenshots/app/`                        |
| Open editor                                                         | `pnpm dev:screenshot-studio`                                          | http://localhost:3010                                                    |
| Headless export (optional; editor must be running, uses Playwright) | `pnpm export:screenshot-studio`                                       | `tools/screenshot-studio/exports/`                                       |
| Copy exports to store layout                                        | `pnpm distribute:screenshot-exports`                                  | `store-assets/ios/`, `android/`                                          |

## Native capture (`apps/app/scripts/screenshots/`)

Automates **all product screens** on real emulators/simulators using [Maestro](https://maestro.mobile.dev) (phone) or `simctl` (watch).

- **Locales:** every Expo `AppLocale` from `packages/shared/src/i18n/app-locale.ts` (override with `LOCALES=…`)
- **Themes:** `light`, `dark`
- **Scenes:** 53 routes/tabs/modals (see `lib/scenes.mjs`)
- **Demo data:** AsyncStorage pre-seed skips onboarding and fills prayer logs, qaza debt, bookmarks, achievements, Makkah location, etc.
- **Platforms:** Android + iOS share the same Maestro batching (`lib/run-maestro-batches.mjs`); iOS requires macOS.
- **Apple Watch:** `pnpm screenshots:watch` — not Maestro. Seeds `widget_snapshot_v1` into the watch App Group, captures Ultra 3 (422×514). Apple scales that set to smaller watches; upload one size consistently across localizations.
- **iPhone Duo:** `pnpm screenshots:duo` — not Maestro (its screenshot only reads the inner display, and nothing scripts the hinge). See [iPhone Duo](#iphone-duo) below.
- **Apple TV / Android TV:** `pnpm screenshots:tvos` / `screenshots:android-tv` — **validate-only by default**. Set `RUN_CAPTURE=1` when submitting TV store SKUs (`EXPO_TV=1` build + TV sim/emulator). Not Maestro; not CI.

### Home-screen widgets (store / picker)

Phone widget gallery shots are **manual** (or OS screenshot tools): Maestro cannot open the iOS/Android widget picker reliably.

1. Seed demo data with builders in `apps/app/scripts/screenshots/lib/widget-scenes.mjs` (same shape as Watch snapshots).
2. On iOS, write `widget_snapshot_v1` into App Group `group.app.munibtracker.widgets` (reuse `inject-watch-snapshot.mjs` patterns on the phone simulator if needed), place Next Salah + Schedule, capture the home screen.
3. On Android, open the app once so snapshot sync + `setWidgetPreview` run, place widgets, capture.
4. Picker marketing assets: regenerate unique PNGs with `apps/app/scripts/generate-android-surface-assets.py` → `assets/images/widget-previews/` (wired via `homeScreenSurfaces.cjs`). Android also ships `previewLayout` (`widget_preview_glance`) for scalable previews on API 31+.

See also [`docs/NATIVE_SURFACES.md`](NATIVE_SURFACES.md) for content budgets, Mark action, and dual-theme behavior.

```bash
pnpm screenshots:validate                              # structure + syntax only
LOCALES=en,ar,ur THEMES=dark SCENES=home,tracker pnpm screenshots:android
LOCALES=all THEMES=all pnpm screenshots:android        # every AppLocale × light/dark
GROUPS=tabs,learn SKIP_SIMULATOR=1 SKIP_BUILD=1 pnpm screenshots:ios
SCENES=schedule,morning,location-denied pnpm screenshots:watch
pnpm screenshots:tvos                                  # TV validate only
pnpm screenshots:android-tv
RUN_CAPTURE=1 LOCALES=en THEMES=dark pnpm screenshots:tvos   # opt-in PNG write
```

**Prerequisites:** dev build on device, Maestro CLI (phone only), Android AVD or Xcode Simulator (iOS/macOS), `adb` / `xcrun simctl`. Watch needs a paired iPhone + Ultra 3 simulator. TV needs `EXPO_TV=1` Leanback/tvOS build + Apple TV sim or Android TV AVD.

Full detail: [`apps/app/scripts/screenshots/README.md`](../apps/app/scripts/screenshots/README.md).

### iPhone Duo

App Store Connect has four iPhone Duo slots — one per display × orientation. All four are **native simulator captures** (`capture-duo.mjs`); the studio's iPhone Duo deck only crams phone captures into a foldable frame and distributes to `iphone-duo-studio/` so it never overwrites them.

| Posture (set in DeviceHub) | `DUO_SCREEN` | Captured size | Store folder                    |
| -------------------------- | ------------ | ------------- | ------------------------------- |
| Unfolded, portrait         | `inner`      | 2007×2853     | `iphone-duo/portrait/`          |
| Unfolded, landscape        | `inner`      | 2853×2007     | `iphone-duo/landscape/`         |
| Folded, portrait           | `outer`      | 1398×2034     | `iphone-duo/portrait-compact/`  |
| Folded, landscape          | `outer`      | 2034×1398     | `iphone-duo/landscape-compact/` |

1. **Runtime:** the Duo needs Xcode 27.1+ and its own iOS build (`iPhone19,4`; `xcrun simctl runtime list` shows it beside the generic iOS 27.x build). `xcodebuild -downloadPlatform iOS` installs the generic build first — if Device Hub still hides the Duo, download the Duo build by its version (`-buildVersion <build>`), then `xcrun simctl create "iPhone Duo" com.apple.CoreSimulator.SimDeviceType.iPhone-Duo com.apple.CoreSimulator.SimRuntime.iOS-27-2-iPhone19-4`.
2. **Posture:** neither `simctl` nor Maestro can fold or rotate the Duo — set it in Xcode's **DeviceHub** before each run.
3. **Run** once per posture (the first run builds + installs the Release app; add `SKIP_BUILD=1` after):

```bash
DUO_SCREEN=inner pnpm screenshots:duo                 # unfolded (portrait, then landscape)
DUO_SCREEN=outer SKIP_BUILD=1 pnpm screenshots:duo    # folded (portrait, then landscape)
```

The slot comes from the captured size, so a mismatched posture fails instead of filing shots in the wrong folder. Slides follow the iPhone deck (`01-home` … `07-more`); the status bar is overridden to 9:41 / full battery (the app's own clock and hero still follow the real time — capture in daylight for a day-time hero).

**Check the first shot of each locale.** The outer screen's camera cutout sometimes renders as a solid black dot in the frame right after launch (seen on `01-home` only). Look at the corner by the system rail, and re-run that one scene if it is there — e.g. `LOCALES=ar SCENES=home DUO_SCREEN=outer SKIP_BUILD=1 pnpm screenshots:duo`.

### Wear OS tiles (manual)

Not scripted. Needs the **phone** prebuild (the `:wear` module only exists there) and the `Wear_OS_Large_Round_API_34` AVD (454×454).

1. `cd apps/app/android && ./gradlew :wear:assembleDebug`, then `adb install -r wear/build/outputs/apk/debug/wear-debug.apk`.
2. Add both tiles: `adb shell am broadcast -a com.google.android.wearable.app.DEBUG_SURFACE --es operation add-tile --ecn component app.munibtracker/expo.modules.munibwear.<MunibWearTileService|MunibWearTasbeehTileService>`.
3. From the watch face, swipe right→left (`adb shell input swipe 420 227 40 227`) to reach each tile; tap the Tasbeeh count a few times so it is not `0 / 33`.
4. `adb exec-out screencap -p` → `captures-native/wear-os/en/01-salah-tile.png` / `02-tasbeeh-tile.png`, then `pnpm sync:screenshot-captures` and export the **Wear OS** deck.

### Studio alias mapping

After each capture run (light **and** dark) for a **studio locale** (`packages/store-screenshots/spec.json` → `locales`, currently en/ar/ur), key scenes are copied into `store-assets/captures/<platform>/<locale>/<theme>/` for the marketing editor (`lib/config.mjs` → `STUDIO_ALIASES`). `sync:screenshot-captures` loads the `STUDIO_THEME` folder (default `light`, from `spec.json` → `studioTheme`; override with `STUDIO_THEME=dark`):

| Studio file          | Source scene                        |
| -------------------- | ----------------------------------- |
| `home.jpg`           | `home`                              |
| `tracker.jpg`        | `tracker` or `tracker-status-sheet` |
| `qaza.jpg`           | `qaza`                              |
| `zikr.jpg`           | `zikr`                              |
| `quran.jpg`          | `quran`                             |
| `qibla.jpg`          | `qibla`                             |
| `names-of-allah.jpg` | `names-of-allah`                    |
| `tasbeeh.jpg`        | `tasbeeh`                           |

Native Maestro output is PNG; files land with `.jpg` names for deck compatibility. `sync-app-screenshots.mjs` accepts `.jpg`, `.jpeg`, or `.png` sources (and still falls back to the legacy flat `<locale>/` path without a theme folder). iOS and Android stay in separate trees so captures never overwrite across platforms.

## Screenshot Studio (`tools/screenshot-studio/`)

Standalone **Next.js** editor (npm, not pnpm workspace) that composes headlines + device frames at exact store dimensions.

```bash
cd tools/screenshot-studio && npm install   # first time
pnpm seed:screenshot-studio
pnpm sync:screenshot-captures
pnpm dev:screenshot-studio
# Export each device tab in the UI, then:
pnpm distribute:screenshot-exports
```

- **Copy source of truth:** `tools/screenshot-studio/scripts/seed-project.mjs` (en/ar/ur)
- **Theme:** `munib-tracker` — charcoal + emerald, Plus Jakarta Sans
- **Headline emphasis:** `**word**` → emerald gradient

Full detail: [`tools/screenshot-studio/README.md`](../tools/screenshot-studio/README.md).

## Output layout (`apps/app/store-assets/`)

| Path                                        | Purpose                                                                                                                                                                                                              |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `captures-native/`                          | Full native matrix (platform × locale × theme × scene) + `watch/en/`                                                                                                                                                 |
| `captures/<android\|ios>/<locale>/<theme>/` | Studio input images per platform × locale × theme                                                                                                                                                                    |
| `ios/screenshots/`                          | App Store PNGs (`6.9-inch/`, `6.5-inch/`, `6.3-inch/`, `iphone-duo/` native + `iphone-duo-studio/`, `13-inch/` iPad, `watch-ultra-3/` native + `apple-watch/` studio, `apple-tv-1080p/` native + `apple-tv/` studio) |
| `ios/product-page/`                         | Product page creative assets: `header/<WxH>/<locale>.png`, `search-results/<WxH>/<locale>.png`                                                                                                                       |
| `android/screenshots/`                      | Play Store PNGs (`phone/`, `tablet-7-inch/`, `tablet-10-inch/` portrait/landscape, `wear-os/`, `android-tv-1080p/` native + `android-tv/` studio)                                                                    |
| `android/feature-graphic/`                  | Play feature graphic 1024×500 (`<locale>.png`)                                                                                                                                                                       |
| `android/tv-banner/`                        | Play Android TV banner 1280×720 (`<locale>.png`)                                                                                                                                                                     |

Marketing slide order (`spec.json` → `slideScenes`): `01-home`, `02-salah`, `03-qaza`, `04-library`, `05-qibla`, `06-names`, `07-more`.

Full detail: [`apps/app/store-assets/README.md`](../apps/app/store-assets/README.md).

## Store screenshot status

What is in `store-assets/` today and what still needs capturing before the next submission. Update this table whenever a set is refreshed.

_Last reviewed: 2026-11-26 for App Store slots (simulators on iOS / tvOS / watchOS 27.2); Google Play rows as of 2026-11-19._

**App Store**

| Slot                                 | Size(s)                                       | Source                                  | Status                                                                                  |
| ------------------------------------ | --------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------- |
| iPhone 6.9"                          | 1320×2868                                     | Studio ← `captures/ios`                 | ✅ 2026-11-26 — iPhone 17 Pro, iOS 27.2 captures                                        |
| iPhone 6.5"                          | 1242×2688                                     | Studio ← `captures/ios`                 | ✅ 2026-11-26                                                                           |
| iPhone 6.3"                          | 1206×2622                                     | Studio ← `captures/ios`                 | ✅ 2026-11-26                                                                           |
| iPhone Duo (4 slots)                 | 2007×2853 · 2853×2007 · 1398×2034 · 2034×1398 | Native `screenshots:duo`                | ✅ 2026-11-19 — all 4 slots × en/ar/ur, reviewed                                        |
| iPad 13"                             | 2064×2752                                     | Studio ← `captures/ipad` (native)       | ✅ 2026-11-26 — native iPad Pro 13-inch captures (`pnpm screenshots:ipad`)              |
| Apple Watch Ultra 3                  | 422×514                                       | Native `screenshots:watch`              | ✅ 2026-11-26 — redesigned paged UI (watchOS sim keeps the real clock)                  |
| Apple Watch (studio deck)            | 422×514 · 410×502                             | Studio                                  | ✅ 2026-11-19 — full-bleed, English UI in every locale (watch strings are English-only) |
| Apple TV 1080p                       | 1920×1080                                     | Native `RUN_CAPTURE=1 screenshots:tvos` | ✅ 2026-11-26 — light theme                                                             |
| Apple TV (studio deck)               | 3840×2160 · 1920×1080                         | Studio                                  | ✅ 2026-11-19 — ar/ur headlines over English TV captures (TV capture is en-only)        |
| Product page header / search results | 5244×2950 · 3840×1646 · 3840×2560 · 1920×1280 | Studio ← `captures/ios`                 | ✅ 2026-11-19                                                                           |

**Google Play**

| Slot                     | Size(s)                                      | Source                                        | Status                                                                      |
| ------------------------ | -------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------- |
| Phone                    | 1080×1920                                    | Studio ← `captures/android`                   | ✅ 2026-11-19 — Phone_API_35 (Android 15) captures, en/ar/ur, reviewed      |
| 7" / 10" tablet          | 1200×1920 · 1600×2560 (portrait + landscape) | Studio ← `captures/android` (phone)           | ✅ 2026-11-19 — phone captures in a tablet frame (no native tablet capture) |
| Feature graphic          | 1024×500                                     | Studio                                        | ✅ 2026-11-19                                                               |
| Wear OS                  | 1024×1024 (1:1)                              | Studio ← `captures-native/wear-os`            | ✅ 2026-11-19 — Next Salah + Tasbeeh tiles, English UI in every locale      |
| Android TV 1080p         | 1920×1080                                    | Native `RUN_CAPTURE=1 screenshots:android-tv` | ✅ In git                                                                   |
| Android TV (studio deck) | 1920×1080                                    | Studio                                        | ✅ 2026-11-19 — ar/ur headlines over English TV captures                    |
| Android TV banner        | 1280×720                                     | Studio                                        | ✅ 2026-11-19 (`android/tv-banner/`)                                        |

**Known capture caveats** (all devices):

- **Captures span midnight:** the hero clock and Hijri date are live, so a long run can show different dates per locale (the 2026-11-19 iPhone set: en/ar 18 Nov, ur 19 Nov).
- **Qibla** shows "No compass sensor detected" and **0 km** — simulators have no magnetometer and the demo location is Makkah itself. Consider a demo city elsewhere for marketing shots.
- **App clock / hero** follow the host's real time (only the status bar is overridden) — night captures get the night hero. Capture in daylight for the day-time look.
- **Android status bar:** `capture-android.mjs` puts SystemUI in demo mode (9:41, full battery, wifi only — the emulator keeps a "3G" label on mobile, so it is hidden) and turns heads-up notifications off for the run, so in-app reminders ("Achievement unlocked") do not cover a shot.
- **Wear OS Next Salah tile** reads the phone's snapshot over the Wearable Data Layer; an unpaired emulator shows the fallback (**Munib Tracker / Mark Salah**). Pair a phone emulator to capture the next-prayer state.
- **iPhone Duo status bar:** glyph colour in the Duo's vertical bar does not follow each screen's `StatusBar` style (dark clock on the night home hero in light theme — `iphone-duo/portrait/*/01-home`). iPhone 17 Pro on iOS 27.2 is fine. Open app issue — see [`BACKLOG.md`](./BACKLOG.md).

## Marketing website (`apps/marketing-web`)

The marketing site shows the **raw native captures** (not the studio frames) inside its own device frames, in the visitor's language. After a capture run, refresh them:

```bash
pnpm --filter marketing-web sync:screenshots
```

This converts `store-assets/captures-native/{ios,android,ipad,android-tablet,android-tv,watch,wear-os}/<locale>/<theme>/*.png` to WebP under `apps/marketing-web/public/screenshots/<device>/<locale>/<theme>/<scene>.webp` (iPhone light + dark, other devices dark) and regenerates `src/lib/screenshot-manifest.generated.ts`. Devices without a locale (Apple Watch, Wear OS) fall back to English.

## Apple TV / Android TV assets

Living-room builds use the same product binary (`EXPO_TV=1`) — see [`TV.md`](./TV.md).

| Asset                        | Size                         | Path                                            | Wired via                                          |
| ---------------------------- | ---------------------------- | ----------------------------------------------- | -------------------------------------------------- |
| Android TV banner (Leanback) | 320×180                      | `apps/app/assets/images/tv/android-banner.png`  | `@react-native-tvos/config-tv` → `androidTVBanner` |
| Android TV icon              | 512×512                      | `apps/app/assets/images/tv/android-icon.png`    | `androidTVIcon`                                    |
| Apple TV icon                | 1280×768 / 400×240 / 800×480 | `apps/app/assets/images/tv/tvos-icon-*.png`     | `appleTVImages.icon*`                              |
| Apple TV Top Shelf           | 1920×720 (+2x, wide, wide2x) | `apps/app/assets/images/tv/tvos-topshelf-*.png` | `appleTVImages.topShelf*`                          |
| Fire TV background           | 1920×1080                    | `…/tv/firetv-background-1920x1080.png`          | **Amazon console only** (not APK)                  |
| Fire TV icons                | 1280×720, 512, 114           | `…/tv/firetv-icon-*.png`                        | **Amazon console only**                            |

```bash
pnpm generate:app:brand-assets   # Leanback + Apple TV + Fire TV console PNGs (overwrites)
```

**Screenshots:** Pipeline prepared in `capture-tvos.mjs` / `capture-android-tv.mjs`. Default and `pnpm screenshots:validate` are structure-only. Opt in with `RUN_CAPTURE=1` when submitting TV SKUs. Fire TV listing screenshots reuse `android-tv-1080p`; banner/icons upload from `firetv-*` in Amazon Appstore Details.

## Shared spec (`packages/store-screenshots/`)

Single source for locales, capture filenames, canvas/export sizes, and slide scene names. Consumed by screenshot-studio constants and sync scripts.

## AI skills

| Skill                                                                                       | Use when                                              |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [`.agents/skills/screenshot-studio/SKILL.md`](../.agents/skills/screenshot-studio/SKILL.md) | Store frames, copy updates, export/distribute         |
| [`.agents/skills/expo-deployment/`](../.agents/skills/expo-deployment/)                     | Submitting to App Store / Play after assets are ready |

## Adding a new marketing slide

1. Add capture filename to `packages/store-screenshots/spec.json` → `captureFiles`
2. Add scene + optional `STUDIO_ALIASES` entry in `apps/app/scripts/screenshots/lib/`
3. Update `seed-project.mjs` deck copy and screenshot paths
4. Run `pnpm screenshots:validate` and re-seed studio

## Do not commit

- `tools/screenshot-studio/exports/` (gitignored — regenerate via editor)
- `tools/screenshot-studio/node_modules/`
- `apps/app/.screenshots-work/` (Maestro temp flows)

`captures-native/` may be large — commit only when refreshing marketing assets intentionally.
