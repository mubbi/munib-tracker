---
description: Generate App Store and Google Play marketing screenshots for Munib Tracker — native Maestro capture, screenshot-studio frames, localized copy, export at store resolutions, distribute to apps/app/store-assets. Use when creating store assets, refreshing app captures, updating screenshot copy, exporting new locales, or preparing App Store Connect / Play Console listings.
---

# Store assets & screenshot automation (Munib Tracker)

Two-stage pipeline:

1. **Native capture** — Maestro scripts drive Android/iOS emulators, seed demo data, screenshot every screen × locale × theme.
2. **Screenshot Studio** — Next.js editor composes headlines + device frames at exact store resolutions.

Canonical overview: [`docs/STORE_ASSETS.md`](../../docs/STORE_ASSETS.md).

## When to use

- User asks for store screenshots, Play feature graphic, or App Store marketing frames
- Refreshing raw app captures after UI changes
- Updating localized screenshot **copy** (en / ar / ur)
- Regenerating exports after new captures
- Adding a new slide or device deck
- Validating capture script structure (`pnpm screenshots:validate`)

## Architecture

| Piece | Path |
|-------|------|
| Native capture (Maestro) | `apps/app/scripts/screenshots/` |
| Editor (Next.js, standalone npm) | `tools/screenshot-studio/` |
| Shared sizes & scene names | `packages/store-screenshots/` |
| Full native matrix | `apps/app/store-assets/captures-native/{android\|ios}/<locale>/<theme>/` |
| Studio inputs (8 files/locale/platform) | `apps/app/store-assets/captures/{android\|ios}/<locale>/` |
| Final PNG outputs | `apps/app/store-assets/ios/…`, `android/…` |
| Project state (git-tracked) | `tools/screenshot-studio/app-store-screenshots.json` |

The studio is **not** in the pnpm workspace. Run `npm install` inside `tools/screenshot-studio`.

## Full workflow

### Phase A — Native captures (optional but recommended)

Automates realistic screenshots with pre-seeded demo data. Requires Maestro CLI + dev build + emulator.

```bash
pnpm screenshots:validate                    # CI-safe structure check
pnpm screenshots:android                     # or screenshots:ios (macOS)
pnpm sync:screenshot-captures              # after dark aliases land in captures/
```

**Filter env vars:** `LOCALES`, `THEMES`, `SCENES`, `GROUPS`, `SKIP_EMULATOR` / `SKIP_SIMULATOR`, `SKIP_BUILD`, `VALIDATE_ONLY`, `SCENE_BATCH`.

**Locales:** defaults to every Expo `AppLocale` (from `packages/shared/src/i18n/app-locale.ts`). Marketing studio decks use the subset in `packages/store-screenshots/spec.json` (en/ar/ur).

**Scene groups:** `tabs`, `track`, `read`, `supplicate`, `learn`, `more`, `settings` (53 scenes in `lib/scenes.mjs`).

Android and iOS share Maestro batching (`lib/run-maestro-batches.mjs`). iOS requires macOS.

After a dark capture run, `STUDIO_ALIASES` copies key scenes into `captures/<platform>/<locale>/` as the studio JPEG filenames (`home.jpg`, `tracker.jpg`, …). See `apps/app/scripts/screenshots/lib/config.mjs`. Android and iOS use separate folders.

Manual capture is still valid: place JPEGs/PNGs under `captures/<android|ios>/<locale>/` yourself (dark theme, native resolution).

### Phase B — Studio frames & export

```bash
cd tools/screenshot-studio
npm install                    # once
pnpm sync:screenshot-brand-assets  # Munib icon + logo from apps/app/assets/images/
pnpm seed:screenshot-studio    # from repo root — refresh decks + en/ar/ur copy
pnpm sync:screenshot-captures  # copies captures → public/screenshots/app/
pnpm dev:screenshot-studio     # http://localhost:3010
# Export each device tab → writes tools/screenshot-studio/exports/
pnpm distribute:screenshot-exports
```

If `sync-app-screenshots.mjs` reports missing files, run native capture or add images under `apps/app/store-assets/captures/<android|ios>/<locale>/`.

**Brand assets:** `public/app-icon.png` must be the Munib Tracker app icon (not a placeholder from another project). Refresh with `pnpm sync:screenshot-brand-assets` or `pnpm generate:app:brand-assets` (also runs at end of `pnpm seed:screenshot-studio`).

Required capture files (see `packages/store-screenshots/spec.json`):

- `home.jpg`, `tracker.jpg`, `qaza.jpg`, `zikr.jpg`, `quran.jpg`, `settings-privacy.jpg`, `settings-sync.jpg`

### Copy changes

Edit **`tools/screenshot-studio/scripts/seed-project.mjs`** (not the JSON by hand for bulk locale work), then re-run `pnpm seed:screenshot-studio`.

Copy rules:

- One idea per slide; 3–5 words per line; use `\n` for line breaks
- One `**emphasis**` phrase per headline (renders as emerald gradient)
- Use canonical Islamic terms in English: **Salah**, **Zikr**, **Qaza** (not Namaz/Dhikr/Qadha in marketing English)

### Export in the editor

1. Select device tab: iPhone → Android Phone → iPad → tablets → Feature Graphic
2. Switch locale to verify ar/ur RTL headlines
3. **Export bundle** for each device (writes to `exports/`, not a browser zip)
4. Run `pnpm distribute:screenshot-exports`

For **tablet-only English** sets: temporarily set `"locales": ["en"]` in `app-store-screenshots.json`, export, then re-seed to restore all locales.

## Device export sizes

From `@munib-tracker/store-screenshots`:

| Device | Export |
|--------|--------|
| iPhone | 1320×2868 (6.9"), 1242×2688 (6.5") |
| iPad | 2064×2752 (13") |
| Android phone | 1080×1920 |
| Android 7" | 1200×1920 portrait, 1920×1200 landscape |
| Android 10" | 1600×2560 portrait, 2560×1600 landscape |
| Feature graphic | 1024×500 |

## Theme

Studio theme id: **`munib-tracker`** — charcoal `#060a09`, inverted slides `#0d4235`, accent `#34d399`, Plus Jakarta Sans. Matches `apps/marketing-web` globals.

## Adding a new screen to captures

1. Add scene to `apps/app/scripts/screenshots/lib/scenes.mjs` (route, waitMs, group, optional interact steps)
2. If needed for marketing decks, add to `STUDIO_ALIASES` in `lib/config.mjs` and `captureFiles` in `packages/store-screenshots/spec.json`
3. Update `seed-project.mjs` deck paths
4. Run `pnpm screenshots:validate`

## Do not

- Add `tools/screenshot-studio` to `pnpm-workspace.yaml` (standalone npm project)
- Hand-edit generated PNGs in `store-assets` — regenerate via the studio
- Commit `tools/screenshot-studio/exports/` or `node_modules/` (gitignored)
- Run full `screenshots:android`/`ios` in CI (long-running; use `screenshots:validate` instead)

## Related

- [`docs/STORE_ASSETS.md`](../../docs/STORE_ASSETS.md) — pipeline diagram + command table
- `apps/app/scripts/screenshots/README.md` — Maestro capture details
- `tools/screenshot-studio/README.md` — editor details
- `apps/app/store-assets/README.md` — output layout
- `.agents/skills/expo-deployment/` — store submission after assets are ready
