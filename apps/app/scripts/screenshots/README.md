# Native screenshot capture

Automated **native** Android/iOS screenshots for Munib Tracker — all tabs, library routes, settings, modals, across **every Expo AppLocale** and **light / dark**.

Part of the store-assets pipeline — see [`docs/STORE_ASSETS.md`](../../../../docs/STORE_ASSETS.md) for the full flow into `tools/screenshot-studio`.

## Prerequisites

| Tool | Android | iOS |
|------|---------|-----|
| App build | Built by `screenshots:android` (release + embedded JS, temporarily debuggable) | `screenshots:ios` builds Release simulator app (embedded JS, no Metro) |
| Emulator / Simulator | Android SDK + AVD | Xcode Simulator |
| Automation | [Maestro CLI](https://maestro.mobile.dev) | Maestro CLI |
| Storage seed | Host `sqlite3` + `adb` base64 push into `RKStorage` | Host `sqlite3` + `xcrun simctl` |

> **Android note:** Do **not** rely on Expo Dev Client + Metro for captures. The capture script builds/installs a self-contained APK so the app launches without a bundler.
>
> **iOS note:** Requires macOS. Navigation/batching matches Android (`lib/run-maestro-batches.mjs`).

## Locales

Native capture defaults to **all AppLocales** from `packages/shared/src/i18n/app-locale.ts` (currently 23). Override with `LOCALES=…`.

Marketing screenshot-studio decks stay on the subset in `packages/store-screenshots/spec.json` (typically `en`, `ar`, `ur`) via `STUDIO_LOCALES`.

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
LOCALES=en,ar,ur THEMES=dark SCENES=home,tracker,qaza pnpm screenshots:android
LOCALES=all THEMES=all pnpm screenshots:android          # every AppLocale × light/dark
GROUPS=tabs,learn pnpm screenshots:ios
SCENE_BATCH=5 SKIP_EMULATOR=1 SKIP_BUILD=1 pnpm screenshots:android
VALIDATE_ONLY=1 pnpm screenshots:android
```

## Output layout

```
apps/app/store-assets/captures-native/
  android/<locale>/<theme>/<scene>.png
  ios/<locale>/<theme>/<scene>.png
```

After each **dark** capture for a **studio locale**, marketing scenes are copied to `store-assets/captures/<platform>/<locale>/` (`STUDIO_ALIASES` in `lib/config.mjs`):

| Studio file | Scene id |
|-------------|----------|
| `home.jpg` | `home` |
| `tracker.jpg` | `tracker`, `tracker-status-sheet` |
| `qaza.jpg` | `qaza` |
| `zikr.jpg` | `zikr` |
| `quran.jpg` | `quran` |
| `qibla.jpg` | `qibla` |
| `names-of-allah.jpg` | `names-of-allah` |
| `tasbeeh.jpg` | `tasbeeh` |

Android and iOS write to separate folders (`captures/android/…` vs `captures/ios/…`) so one platform never overwrites the other.

Then run `pnpm sync:screenshot-captures` from the repo root.

## How it works

1. **Demo data** — `lib/demo-data.mjs` seeds AsyncStorage with real repository/store shapes per locale/theme.
2. **Storage injection** — Android: warm-launch → host `sqlite3` merge → base64 push; iOS: host `sqlite3` on simulator container.
3. **Navigation** — Maestro deep-links (tabs + routes), optional ready markers, `waitForAnimationToEnd`, `takeScreenshot`. Batched via `lib/run-maestro-batches.mjs` so one failure does not abort the matrix.
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
| `capture-android.mjs` / `capture-ios.mjs` | Orchestrators (same batching / filters) |
| `validate.mjs` | CI-safe validation |
| `lib/app-locales.mjs` | Loads AppLocale + studio locale lists |
| `lib/scenes.mjs` | Scene catalog |
| `lib/demo-data.mjs` | AsyncStorage demo seed |
| `lib/db-keys.mjs` | Mirror of `src/db/keys.ts` + theme keys |
| `lib/maestro.mjs` | YAML flow generator |
| `lib/run-maestro-batches.mjs` | Shared Android/iOS Maestro batch runner |
| `lib/build-screenshot-apk.mjs` | Self-contained Android APK (no Metro) |
| `lib/inject-storage-*.mjs` | Platform storage injection |
| `lib/i18n.mjs` | Localized labels (all AppLocale catalogs) |
| `lib/config.mjs` | App IDs, timing, `LOCALES`, `STUDIO_ALIASES` |

## Adding a scene

1. Add entry to `lib/scenes.mjs` (id, type, route/tab, waitMs, group)
2. If needed for marketing decks, add to `STUDIO_ALIASES` in `lib/config.mjs` and `packages/store-screenshots/spec.json`
3. Run `pnpm screenshots:validate`

## Related

- [`docs/STORE_ASSETS.md`](../../../../docs/STORE_ASSETS.md) — full pipeline
- `tools/screenshot-studio/` — marketing frames from raw captures
- `.agents/skills/screenshot-studio/SKILL.md` — agent workflow
