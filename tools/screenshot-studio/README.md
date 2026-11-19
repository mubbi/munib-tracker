# App Store Screenshots — Munib Tracker

A Next.js + ShadCN editor for generating App Store and Google Play marketing screenshots at the exact device sizes required by each store.

> **Standalone on purpose** — installed with `npm` inside `tools/screenshot-studio`, not part of the pnpm workspace (do not add to `pnpm-workspace.yaml`). Shared locales, capture filenames and slide names live in `packages/store-screenshots/spec.json` (read by the scripts here); canvas/export sizes are mirrored in `src/lib/constants.ts`.

End-to-end pipeline (native capture → studio → store PNGs): [`docs/STORE_ASSETS.md`](../../docs/STORE_ASSETS.md).

## Munib Tracker workflow

### Step 0 — Raw captures (automated or manual)

**Recommended:** native Maestro scripts seed demo data and screenshot all app screens, then copy eight marketing scenes (light and dark) into `apps/app/store-assets/captures/<android|ios>/<locale>/<theme>/`:

```bash
pnpm screenshots:validate          # CI-safe check
pnpm screenshots:android           # or pnpm screenshots:ios (macOS)
```

**Manual alternative:** run the app on simulator/emulator, set locale + theme, save JPEGs under `apps/app/store-assets/captures/<android|ios>/<locale>/<theme>/`.

### Step 1 — Seed, sync, edit, export

```bash
cd tools/screenshot-studio
npm install                              # first time only
pnpm seed:screenshot-studio              # from repo root — decks + en/ar/ur copy
pnpm sync:screenshot-captures            # copies captures (STUDIO_THEME, default light) → public/screenshots/app/<platform>/<locale>/
pnpm dev:screenshot-studio               # editor on http://localhost:3010
```

In the editor pick a device (**iOS:** iPhone · iPhone Duo · iPad · Apple Watch Ultra · Apple TV · Product Page Header (16:9 / wide) · Search Results (16:9 / 3:2); **Android:** Phone · 7"/10" tablets · Wear OS · Android TV · Android TV Banner · Feature Graphic) and click **Export bundle** for each (or, with the editor running, `pnpm export:screenshot-studio` exports every deck headlessly via Playwright). PNGs stream to `exports/` via the dev-only `/api/export` route. Then:

```bash
pnpm distribute:screenshot-exports       # copies into apps/app/store-assets per store layout
```

### Root shortcuts (from repo root)

| Command                                             | Action                                                |
| --------------------------------------------------- | ----------------------------------------------------- |
| `pnpm screenshots:validate`                         | Validate Maestro capture scripts                      |
| `pnpm screenshots:android` / `pnpm screenshots:ios` | Native full-matrix capture                            |
| `pnpm seed:screenshot-studio`                       | Regenerate `app-store-screenshots.json`               |
| `pnpm sync:screenshot-captures`                     | Copy `captures/` → studio `public/`                   |
| `pnpm dev:screenshot-studio`                        | Start editor (:3010)                                  |
| `pnpm export:screenshot-studio`                     | Headless export of all decks (editor must be running) |
| `pnpm sync:screenshot-brand-assets`                 | Refresh `public/app-icon.png` / `munib-logo.png`      |
| `pnpm distribute:screenshot-exports`                | Copy `exports/` → `store-assets/`                     |

Project specifics:

- **Theme** `munib-tracker` (`src/lib/constants.ts`) mirrors the marketing site: `#060a09` base, emerald accents, deep-green inverted slides, Plus Jakarta Sans.
- **Headline emphasis** — `**word**` in any headline/label renders as the site's emerald gradient (`.hl-em` in `globals.css`).
- **Copy source of truth** — all locale labels/headlines live in `scripts/seed-project.mjs`; edit there and re-seed rather than typing into the editor for bulk changes.
- **Screenshot paths** use `{locale}` (e.g. `/screenshots/app/ios/{locale}/home.jpg`); the editor and export substitute the active locale.
- **Locales** — `en`, `ar`, `ur` (marketing subset from `spec.json`; the product app ships 24). Tablet decks can be exported English-only by temporarily setting `locales: ["en"]` in `app-store-screenshots.json`.

## Capture inputs

The sync script loads the `STUDIO_THEME` folder (default `light`, from `spec.json` → `studioTheme`; override with `STUDIO_THEME=dark`) and accepts **`.jpg`, `.jpeg`, or `.png`** (native Maestro output is PNG copied with `.jpg` deck paths).

| File                 | Scene                    | Native capture source (`STUDIO_ALIASES`) |
| -------------------- | ------------------------ | ---------------------------------------- |
| `home.jpg`           | Home / prayer-times hero | `home`                                   |
| `tracker.jpg`        | Salah tracker            | `tracker` / `tracker-status-sheet`       |
| `qaza.jpg`           | Qaza planner             | `qaza`                                   |
| `zikr.jpg`           | Adhkar / zikr            | `zikr`                                   |
| `quran.jpg`          | Qur'an reader            | `quran`                                  |
| `qibla.jpg`          | Qibla compass            | `qibla`                                  |
| `names-of-allah.jpg` | 99 Names                 | `names-of-allah`                         |
| `tasbeeh.jpg`        | Tasbeeh counter          | `tasbeeh`                                |

Path: `apps/app/store-assets/captures/<android|ios>/<locale>/<theme>/<name>.jpg` (or `.png`; a legacy flat `<locale>/<name>` path is still accepted)

Full native matrix (all screens × locales × themes): `apps/app/store-assets/captures-native/` — see [`apps/app/scripts/screenshots/README.md`](../../apps/app/scripts/screenshots/README.md).

## Export sizes

Defined in `src/lib/constants.ts` (kept in step with `packages/store-screenshots/src/index.ts`):

| Device                       | Size(s)                                                 |
| ---------------------------- | ------------------------------------------------------- |
| iPhone 6.9"                  | 1320×2868                                               |
| iPhone 6.5"                  | 1242×2688                                               |
| iPhone 6.3" (medium display) | 1206×2622                                               |
| iPhone Duo                   | 2007×2853, 1398×2034 / landscape 2853×2007, 2034×1398   |
| iPad 13"                     | 2064×2752                                               |
| Apple Watch Ultra 4          | 422×514, 410×502                                        |
| Apple TV                     | 3840×2160, 1920×1080                                    |
| Product page header          | 5244×2950 (16:9 deck) · 3840×1646 (wide deck)           |
| Search results asset         | 5244×2950 (16:9 deck) · 3840×2560, 1920×1280 (3:2 deck) |
| Android phone                | 1080×1920                                               |
| Android 7" tablet            | 1200×1920 / 1920×1200                                   |
| Android 10" tablet           | 1600×2560 / 2560×1600                                   |
| Wear OS                      | 1024×1024 (1:1)                                         |
| Android TV                   | 1920×1080                                               |
| Android TV banner            | 1280×720                                                |
| Play feature graphic         | 1024×500                                                |

Every size of a device shares its canvas aspect ratio — store slots whose accepted sizes differ in aspect (header 16:9 vs wide, search results 16:9 vs 3:2) are separate decks. Sizes within ~1% are scaled; larger drift (iPhone Duo compact) is centre-cropped, never stretched.

**Layouts for the newer surfaces:** watch / Wear OS decks default to **Full-bleed screenshot** (raw app UI, no frame or caption — what both stores expect). TV decks mix framed marketing slides with full-bleed. Header / search-results decks default to **Split (landscape)** and can also use **Brand banner**; the Android TV banner is brand-banner only (icon + name + tagline).

**Watch / TV inputs:** `pnpm sync:screenshot-captures` also copies native `watch-ultra-3/`, `apple-tv-1080p/` and `android-tv-1080p/` PNGs into `public/screenshots/app/<apple-watch|apple-tv|android-tv>/<locale>/` when they exist (missing TV locales fall back to `en`). Wear OS tile captures (454×454, from the Wear emulator — see `docs/STORE_ASSETS.md`) live in `apps/app/store-assets/captures-native/wear-os/en/` and sync into the Wear OS deck.

Headless export of a subset: `EXPORT_DEVICES=apple-watch,apple-tv pnpm export:screenshot-studio`.

## What's inside

- **Connected canvas editor** — drag elements across screen boundaries; export as split crops in Connected mode.
- **Device frames** — iPhone (PNG mockup), iPhone Duo (foldable), iPad, Android phone/tablet, Apple Watch, round Wear OS watch, TV, plus brand banner and frameless full-bleed.
- **Auto-save** — persisted to **`app-store-screenshots.json`** (git-tracked) + `localStorage` cache.
- **Multi-device decks** — iOS and Android slide decks side by side.
- **Bulk export** — all required resolutions via `html-to-image`.

## Customizing

| Where                           | What                                                           |
| ------------------------------- | -------------------------------------------------------------- |
| `packages/store-screenshots/`   | Locales, capture filenames, export scene names, canvas spec    |
| `src/lib/constants.ts`          | Canvas dimensions, export sizes, themes                        |
| `app-store-screenshots.json`    | Slide copy, screenshots, transforms (generated by seed script) |
| `scripts/seed-project.mjs`      | Localized marketing copy for all decks                         |
| `apps/app/scripts/screenshots/` | Native Maestro capture + demo data seed                        |

## AI skill

See `.agents/skills/screenshot-studio/SKILL.md` for agent workflows (capture → seed → sync → export → distribute).

## Notes

- `mockup.png` is the iPhone bezel overlay; replacing it requires re-measuring `PHONE_SCREEN` in `constants.ts`.
- **Brand assets** — `public/app-icon.png` and `public/munib-logo.png` are synced from `apps/app/assets/images/` (source: repo-root `munib-logo.png` via `pnpm generate:app:brand-assets`). Refresh with `pnpm sync:screenshot-brand-assets` or automatically when running `pnpm seed:screenshot-studio`.
- Reset via the toolbar clears in-memory state; delete `app-store-screenshots.json` to wipe disk state.
