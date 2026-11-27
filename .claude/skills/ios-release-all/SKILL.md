---

name: ios-release-all
description: Build and upload signed App Store IPAs for both Apple form factors (iPhone with the embedded Watch app, and Apple TV) in one go — bumps EXPO_IOS_APP_BUILD_NUMBER / EXPO_TVOS_APP_BUILD_NUMBER, then clean-prebuilds → releases → uploads one device at a time. IPAs stay in their default export folders (nothing copied to the repo root). macOS only. Use when asked to "bump the build number and build/release/upload iOS", "release iPhone + Apple TV", or cut a local Apple release.
---

# Apple release — iPhone (+ Watch) + Apple TV: build → upload

One command does everything (macOS + Xcode):

```bash
pnpm release:app:ios:all                  # ios → tvos: bump, prebuild, release, UPLOAD
pnpm release:app:ios:all --dry-run        # show the plan only (works on Windows too)
pnpm release:app:ios:all --no-upload      # build the IPAs only
pnpm release:app:ios:all --only tvos      # subset: ios,tvos (order is kept)
pnpm release:app:ios:all --start 10       # override the next build number (each counter)
```

Script: `apps/app/scripts/ios-release-all.js`. It shares its runner with the Android one (`apps/app/scripts/lib/release-all.cjs`).

## What it does

| Device | Build counter / version (apps/app/.env)                | Prebuild (clean)           | Release                 | IPA (default location)                     | Upload                         |
| ------ | ------------------------------------------------------ | -------------------------- | ----------------------- | ------------------------------------------ | ------------------------------ |
| `ios`  | `EXPO_IOS_APP_BUILD_NUMBER` / `EXPO_IOS_APP_VERSION`   | `pnpm cleanbuild:app:ios`  | `pnpm release:app:ios`  | `apps/app/ios/app-store-export/*.ipa`      | `pnpm release:app:ios:upload`  |
| `tvos` | `EXPO_TVOS_APP_BUILD_NUMBER` / `EXPO_TVOS_APP_VERSION` | `pnpm prebuild:app:tv:ios` | `pnpm release:app:tvos` | `apps/app/ios/app-store-export-tvos/*.ipa` | `pnpm release:app:tvos:upload` |

- **IPAs:** they stay where the release scripts put them, and the upload scripts pick them up from there automatically. Nothing is copied to the repo root (unlike Android's AABs).
- **Watch:** the watchOS app (`targets/munib-tracker-watch`) is embedded in the iPhone app, so it ships inside the iPhone IPA. There is no separate watch build.
- **Build numbers:** iPhone and Apple TV have their own counters, each +1 per run (unlike Android's shared versionCode).
- **Sequencing:** strictly one device at a time: prebuild → release → upload, then the next device. Each upload must finish before the next clean prebuild, because that prebuild wipes `ios/` (export folder included).
- **Upload needs** `apps/app/ios-keys/app-store-connect.env` + the `.p8` API key (`node apps/app/scripts/setup-ios-app-store-connect.js`). Processing in App Store Connect / TestFlight takes a while after the upload succeeds.

## Running it as an agent

1. Check the platform. On Windows/Linux, only `--dry-run` works: show the plan and tell the user to run the command on a Mac.
2. Run `--dry-run` first and tell the user the build numbers and that each build will be uploaded.
3. Start the real run **in the background**, with output redirected to a log in the scratchpad (archives are slow).
4. On failure, read the log tail and fix the problem.
   - If the build failed: resume with `--only <remaining>` (plus `--start <next unused build number>` if needed).
   - If the build succeeded but the upload failed: re-run just `pnpm release:app:ios:upload` (or `release:app:tvos:upload`) **before** any other prebuild. The IPA is still in its export folder.
5. Report the upload results and the final build numbers in `.env`.

Android equivalent: `/android-release-all` (`pnpm release:app:android:all`).
