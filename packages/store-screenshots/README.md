# @munib-tracker/store-screenshots

Shared **App Store / Play Store** screenshot spec for Munib Tracker — locales, raw capture filenames, canvas dimensions, export sizes, and marketing slide naming.

Consumed by:

- `tools/screenshot-studio/` — editor constants and sync scripts
- `apps/app/scripts/screenshots/` — native capture studio alias mapping
- `apps/app/store-assets/` — final asset layout

Full workflow: [`docs/STORE_ASSETS.md`](../../docs/STORE_ASSETS.md).

## Locales

`en`, `ar`, `ur` — matches the product app (`AppLocale`).

## Raw capture files (`CAPTURE_FILES`)

Seven inputs per platform × locale under `apps/app/store-assets/captures/<android|ios>/<locale>/`:

| File | Marketing slide |
|------|-----------------|
| `home` | 01-home |
| `tracker` | 02-salah |
| `qaza` | 03-qaza |
| `zikr` | 04-library (primary) |
| `quran` | 04-library (secondary) |
| `settings-privacy` | 05-privacy |
| `settings-sync` | 06-offline |

Slide `07-more` reuses deck layout without a dedicated capture file.

Native Maestro scripts map app scenes → these filenames via `STUDIO_ALIASES` in `apps/app/scripts/screenshots/lib/config.mjs`.

## Export sizes (`EXPORT_SIZES`)

| Device kind | Resolutions |
|-------------|-------------|
| `iphone` | 1320×2868 (6.9"), 1242×2688 (6.5") |
| `ipad` | 2064×2752 (13") |
| `android` | 1080×1920 |
| `android-7` | 1200×1920 portrait; 1920×1200 landscape |
| `android-10` | 1600×2560 portrait; 2560×1600 landscape |
| `feature-graphic` | 1024×500 |
| `watch` | 422×514 (Ultra 3; Apple scales to smaller watches) |
| `apple-tv` / `android-tv` | 1920×1080 (living-room store screenshots) |

### Apple Watch

`pnpm screenshots:watch` captures raw watch UI (no Screenshot Studio frames) into `apps/app/store-assets/ios/screenshots/watch-ultra-3/en/`. Upload that single size in App Store Connect — Apple scales down. Watch UI is English-only today.

### Apple TV / Android TV / Fire TV

`pnpm screenshots:tvos` / `screenshots:android-tv` validate by default. With `RUN_CAPTURE=1`, PNGs land under `apple-tv-1080p/` and `android-tv-1080p/`. Amazon Fire TV banner/icons are `FIRE_TV_CONSOLE_ASSETS` paths under `apps/app/assets/images/tv/firetv-*` (generate via brand-assets script; upload in Amazon console — not packaged in the Leanback APK).

## Files

| File | Role |
|------|------|
| `spec.json` | JSON mirror for Node scripts (sync, seed) |
| `src/index.ts` | Typed exports for TypeScript consumers |

When adding a capture or slide, update **both** `spec.json` and `src/index.ts`, then re-seed screenshot-studio and update native capture aliases if applicable.
