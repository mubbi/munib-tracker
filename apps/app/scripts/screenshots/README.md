# Native screenshot capture

Automated **native** Android/iOS screenshots for Munib Tracker — all tabs, library routes, settings, modals, in **en / ar / ur** and **light / dark**.

Part of the store-assets pipeline — see [`docs/STORE_ASSETS.md`](../../../../docs/STORE_ASSETS.md) for the full flow into `tools/screenshot-studio`.

## Prerequisites

| Tool | Android | iOS |
|------|---------|-----|
| Dev build | `pnpm --filter app android` | `pnpm --filter app ios` (macOS) |
| Emulator | Android SDK + AVD (`pnpm dev:app:android:emulator`) | Xcode Simulator |
| Automation | [Maestro CLI](https://maestro.mobile.dev) | Maestro CLI |
| Storage seed | `adb` + on-device `sqlite3` | Host `sqlite3` + `xcrun simctl` |

## Commands

```bash
# Validate scripts (no emulator — safe on CI)
pnpm screenshots:validate

# Full capture (long-running — not for CI)
pnpm screenshots:android
pnpm screenshots:ios   # macOS only
```

Filter matrix:

```bash
LOCALES=en,ar THEMES=dark SCENES=home,tracker,qaza pnpm screenshots:android
GROUPS=tabs,learn pnpm screenshots:ios
VALIDATE_ONLY=1 pnpm screenshots:android   # dry validation inside capture script
SKIP_EMULATOR=1 SKIP_BUILD=1 pnpm screenshots:android   # reuse running device + installed build
```

## Output layout

```
apps/app/store-assets/captures-native/
  android/<locale>/<theme>/<scene>.png
  ios/<locale>/<theme>/<scene>.png
```

After each **dark** capture run, seven marketing scenes are copied to `store-assets/captures/<locale>/` for screenshot-studio (`STUDIO_ALIASES` in `lib/config.mjs`):

| Studio file | Scene id |
|-------------|----------|
| `home.jpg` | `home` |
| `tracker.jpg` | `tracker`, `tracker-status-sheet` |
| `qaza.jpg` | `qaza` |
| `zikr.jpg` | `zikr` |
| `quran.jpg` | `quran` |
| `settings-privacy.jpg` | `settings-offline-data` |
| `settings-sync.jpg` | `settings-backup` |

Then run `pnpm sync:screenshot-captures` from the repo root.

## How it works

1. **Demo data** — `lib/demo-data.mjs` builds realistic AsyncStorage (prayer logs, qaza debt, bookmarks, achievements, onboarding complete, tours dismissed, Makkah location, etc.) per locale/theme.
2. **Storage injection** — Android: `adb shell run-as … sqlite3`; iOS: host `sqlite3` on simulator container.
3. **Navigation** — Maestro flows (`lib/maestro.mjs`) deep-link to routes, tap tabs, open modals (prayer status sheet), wait for animations (`waitForAnimationToEnd` + scene-specific delays), then `takeScreenshot`.
4. **Scenes** — `lib/scenes.mjs` lists **53** screens across tabs, track, read, supplicate, learn, more, and settings.

## Scene groups

| Group | Examples |
|-------|----------|
| `tabs` | home, tracker, library, settings |
| `track` | qaza, statistics, ramadan, tasbeeh, tracker-status-sheet |
| `read` | quran, hadith, bookmarks |
| `supplicate` | dua, zikr, duroods, names-of-allah |
| `learn` | salah-guide, jannah, learn-quran, seerah |
| `more` | calendar, qibla, search, profile |
| `settings` | appearance, language, backup, offline-data |

## Module map

| File | Role |
|------|------|
| `capture-android.mjs` / `capture-ios.mjs` | Orchestrators |
| `validate.mjs` | CI-safe validation |
| `lib/scenes.mjs` | Scene catalog + wait/interact steps |
| `lib/demo-data.mjs` | AsyncStorage demo seed |
| `lib/maestro.mjs` | YAML flow generator |
| `lib/inject-storage-*.mjs` | Platform storage injection |
| `lib/i18n.mjs` | Localized Maestro tap labels |
| `lib/config.mjs` | App IDs, timing, `STUDIO_ALIASES` |

## Adding a scene

1. Add entry to `lib/scenes.mjs` (id, type, route/tab, waitMs, group)
2. If needed for marketing decks, add to `STUDIO_ALIASES` in `lib/config.mjs` and `packages/store-screenshots/spec.json`
3. Run `pnpm screenshots:validate`

## Related

- [`docs/STORE_ASSETS.md`](../../../../docs/STORE_ASSETS.md) — full pipeline
- `tools/screenshot-studio/` — marketing frames from raw captures
- `.agents/skills/screenshot-studio/SKILL.md` — agent workflow
