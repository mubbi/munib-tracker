# @munib-tracker/store-screenshots

Shared **App Store / Play Store** screenshot spec for Munib Tracker — locales, raw capture filenames, canvas dimensions, export sizes, and marketing slide naming.

Consumed by (all read **`spec.json`**; nothing imports the TS entry today):

- `tools/screenshot-studio/scripts/` — `seed-project`, `sync-app-screenshots`, `distribute-exports` (the editor's `src/lib/constants.ts` mirrors the canvas/export sizes rather than importing them)
- `apps/app/scripts/screenshots/` — studio locales (`lib/app-locales.mjs`) for native capture alias mapping
- `apps/app/store-assets/` — final asset layout

Full workflow: [`docs/STORE_ASSETS.md`](../../docs/STORE_ASSETS.md).

## Locales

`en`, `ar`, `ur` — the marketing subset of the product app's 24 `AppLocale`s (native capture still covers every locale).

## Raw capture files (`captureFiles`)

Eight inputs per platform × locale × theme under `apps/app/store-assets/captures/<android|ios>/<locale>/<theme>/` (`studioTheme`, default `light`, is what the studio syncs):

`home`, `tracker`, `qaza`, `zikr`, `quran`, `qibla`, `names-of-allah`, `tasbeeh`

Marketing slides (`slideScenes`): `01-home`, `02-salah`, `03-qaza`, `04-library`, `05-qibla`, `06-names`, `07-more`.

`src/index.ts` re-exports `spec.json` values (locales, `CAPTURE_FILES`, `SLIDE_SCENES`, watch/TV scenes, `STORE_ASSETS_ROOT`, `STUDIO_THEME`) typed, so edit `spec.json` only; canvas/export sizes live in TS.

Native Maestro scripts map app scenes → these filenames via `STUDIO_ALIASES` in `apps/app/scripts/screenshots/lib/config.mjs`.

## Export sizes (`EXPORT_SIZES`)

| Device kind               | Resolutions                                        |
| ------------------------- | -------------------------------------------------- |
| `iphone`                  | 1320×2868 (6.9"), 1242×2688 (6.5")                 |
| `ipad`                    | 2064×2752 (13")                                    |
| `android`                 | 1080×1920                                          |
| `android-7`               | 1200×1920 portrait; 1920×1200 landscape            |
| `android-10`              | 1600×2560 portrait; 2560×1600 landscape            |
| `feature-graphic`         | 1024×500                                           |
| `watch`                   | 422×514 (Ultra 3; Apple scales to smaller watches) |
| `apple-tv` / `android-tv` | 1920×1080 (living-room store screenshots)          |

### Apple Watch

`pnpm screenshots:watch` captures raw watch UI (no Screenshot Studio frames) into `apps/app/store-assets/ios/screenshots/watch-ultra-3/en/`. Upload that single size in App Store Connect — Apple scales down. Watch UI is English-only today.

### Apple TV / Android TV / Fire TV

`pnpm screenshots:tvos` / `screenshots:android-tv` validate by default. With `RUN_CAPTURE=1`, PNGs land under `apple-tv-1080p/` and `android-tv-1080p/`. Amazon Fire TV banner/icons are `FIRE_TV_CONSOLE_ASSETS` paths under `apps/app/assets/images/tv/firetv-*` (generate via brand-assets script; upload in Amazon console — not packaged in the Leanback APK).

## Files

| File           | Role                                                                      |
| -------------- | ------------------------------------------------------------------------- |
| `spec.json`    | Source of truth for Node scripts (sync, seed, distribute, native capture) |
| `src/index.ts` | Typed exports for TypeScript consumers                                    |

When adding a capture or slide, update **both** `spec.json` and `src/index.ts`, then re-seed screenshot-studio and update native capture aliases if applicable.
