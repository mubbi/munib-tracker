# Store assets & screenshot automation

End-to-end workflow for Munib Tracker **App Store Connect** and **Google Play Console** marketing assets: native device captures → designed frames → store-resolution exports.

## Pipeline overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. Native capture (Maestro + emulator/simulator)                        │
│    pnpm screenshots:android | pnpm screenshots:ios                      │
│    → store-assets/captures-native/{android|ios}/<locale>/<theme>/*.png   │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ dark captures → STUDIO_ALIASES copy
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. Studio inputs (7 JPEG filenames per locale)                          │
│    → store-assets/captures/<locale>/{home,tracker,qaza,…}.jpg           │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ pnpm sync:screenshot-captures
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. Screenshot Studio editor (Next.js, port 3010)                      │
│    pnpm dev:screenshot-studio → export bundles                          │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ pnpm distribute:screenshot-exports
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 4. Final store PNGs                                                     │
│    store-assets/ios/screenshots/…  store-assets/android/screenshots/…   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Quick reference

| Step | Command | Output |
|------|---------|--------|
| Validate capture scripts (CI-safe) | `pnpm screenshots:validate` | — |
| Native full matrix | `pnpm screenshots:android` / `pnpm screenshots:ios` | `captures-native/` |
| Seed studio decks + copy | `pnpm seed:screenshot-studio` | `tools/screenshot-studio/app-store-screenshots.json` |
| Sync Munib logo/icon into studio | `pnpm sync:screenshot-brand-assets` | `tools/screenshot-studio/public/app-icon.png` |
| Sync captures into editor | `pnpm sync:screenshot-captures` | `tools/screenshot-studio/public/screenshots/app/` |
| Open editor | `pnpm dev:screenshot-studio` | http://localhost:3010 |
| Copy exports to store layout | `pnpm distribute:screenshot-exports` | `store-assets/ios/`, `android/` |

## Native capture (`apps/app/scripts/screenshots/`)

Automates **all product screens** on real emulators/simulators using [Maestro](https://maestro.mobile.dev).

- **Locales:** `en`, `ar`, `ur`
- **Themes:** `light`, `dark`
- **Scenes:** 53 routes/tabs/modals (see `lib/scenes.mjs`)
- **Demo data:** AsyncStorage pre-seed skips onboarding and fills prayer logs, qaza debt, bookmarks, achievements, Makkah location, etc.

```bash
pnpm screenshots:validate                              # structure + syntax only
LOCALES=en THEMES=dark SCENES=home,tracker pnpm screenshots:android
GROUPS=tabs,learn SKIP_EMULATOR=1 SKIP_BUILD=1 pnpm screenshots:ios
```

**Prerequisites:** dev build on device, Maestro CLI, Android AVD or Xcode Simulator (iOS/macOS), `adb` / `xcrun simctl`.

Full detail: [`apps/app/scripts/screenshots/README.md`](../apps/app/scripts/screenshots/README.md).

### Studio alias mapping

After each dark capture run, key scenes are copied into `store-assets/captures/<locale>/` for the marketing editor (`lib/config.mjs` → `STUDIO_ALIASES`):

| Studio file | Source scene |
|-------------|--------------|
| `home.jpg` | `home` |
| `tracker.jpg` | `tracker` or `tracker-status-sheet` |
| `qaza.jpg` | `qaza` |
| `zikr.jpg` | `zikr` |
| `quran.jpg` | `quran` |
| `settings-privacy.jpg` | `settings-offline-data` |
| `settings-sync.jpg` | `settings-backup` |

Native Maestro output is PNG; files land with `.jpg` names for deck compatibility. `sync-app-screenshots.mjs` accepts `.jpg`, `.jpeg`, or `.png` sources.

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

| Path | Purpose |
|------|---------|
| `captures-native/` | Full native matrix (platform × locale × theme × scene) |
| `captures/<locale>/` | Seven studio input images per locale |
| `ios/screenshots/` | App Store PNGs (6.9", 6.5", iPad 13") |
| `android/screenshots/` | Play Store PNGs (phone, 7", 10" portrait/landscape) |
| `android/feature-graphic/` | Play feature graphic 1024×500 |

Marketing slide order: `01-home`, `02-salah`, `03-qaza`, `04-library`, `05-privacy`, `06-offline`, `07-more`.

Full detail: [`apps/app/store-assets/README.md`](../apps/app/store-assets/README.md).

## Shared spec (`packages/store-screenshots/`)

Single source for locales, capture filenames, canvas/export sizes, and slide scene names. Consumed by screenshot-studio constants and sync scripts.

## AI skills

| Skill | Use when |
|-------|----------|
| [`.agents/skills/screenshot-studio/SKILL.md`](../.agents/skills/screenshot-studio/SKILL.md) | Store frames, copy updates, export/distribute |
| [`.agents/skills/expo-deployment/`](../.agents/skills/expo-deployment/) | Submitting to App Store / Play after assets are ready |

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
