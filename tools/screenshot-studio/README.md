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

In the editor pick a device (**iPhone → iPad → Android Phone → Android 7"/10" tablets → Feature Graphic**) and click **Export bundle** for each (or, with the editor running, `pnpm export:screenshot-studio` exports every deck headlessly via Playwright). PNGs stream to `exports/` via the dev-only `/api/export` route. Then:

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

| Device               | Size(s)               |
| -------------------- | --------------------- |
| iPhone 6.9"          | 1320×2868             |
| iPhone 6.5"          | 1242×2688             |
| iPad 13"             | 2064×2752             |
| Android phone        | 1080×1920             |
| Android 7" tablet    | 1200×1920 / 1920×1200 |
| Android 10" tablet   | 1600×2560 / 2560×1600 |
| Play feature graphic | 1024×500              |

## What's inside

- **Connected canvas editor** — drag elements across screen boundaries; export as split crops in Connected mode.
- **Device frames** — iPhone (PNG mockup), iPad, Android phone/tablet, feature graphic.
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
