---

name: android-release-all
description: Build signed Play AABs for all three Android form factors (phone, Wear OS, Android TV) in one go — bumps EXPO_ANDROID_VERSION_CODE per device, prebuilds + releases one at a time, and drops <device>-<versionCode>-<versionName>.aab in the repo root. Use when asked to "bump the version code and build/release Android", "make the mobile/wear/tv aab files", or cut a local Android release.
---

# Android release — phone + Wear + TV

One command does everything:

```bash
pnpm release:app:android:all              # mobile → wearos → tv, versionCode = current+1, +2, +3
pnpm release:app:android:all --dry-run    # show the plan (codes + file names) only
pnpm release:app:android:all --only tv    # subset: any of mobile,wearos,tv (order is kept)
pnpm release:app:android:all --start 40   # override the first versionCode
```

Script: `apps/app/scripts/android-release-all.js` (shared runner `apps/app/scripts/lib/release-all.cjs`, also used by `/ios-release-all`).

## What it does

| Device   | versionName key (apps/app/.env) | Prebuild                                 | Release                       | Root output               |
| -------- | ------------------------------- | ---------------------------------------- | ----------------------------- | ------------------------- |
| `mobile` | `EXPO_ANDROID_APP_VERSION`      | `pnpm cleanbuild:app:android`            | `pnpm release:app:android`    | `mobile-<code>-<ver>.aab` |
| `wearos` | `EXPO_ANDROID_APP_VERSION`      | none (reuses the phone tree's `:wear`)\* | `pnpm release:app:wear`       | `wearos-<code>-<ver>.aab` |
| `tv`     | `EXPO_ANDROID_TV_APP_VERSION`   | `pnpm prebuild:app:tv:android` (clean)   | `pnpm release:app:android-tv` | `tv-<code>-<ver>.aab`     |

\* When Wear runs without mobile in the same invocation, the script clean-prebuilds the phone tree first.

- Phone, Wear and TV share Play package `app.munibtracker` → one `EXPO_ANDROID_VERSION_CODE` counter, +1 per device. The script rewrites it in `apps/app/.env` right before each device's build, so after a full run `.env` holds the TV code.
- Phases are strictly sequential, because a clean prebuild wipes `apps/app/android/`. Before each prebuild it runs `adb kill-server` + `gradlew --stop` to avoid EBUSY.
- Root `/*.aab` is gitignored. The script **does not upload**. Uploads stay explicit (`pnpm release:app:{android,wear,android-tv}:upload`) and only happen when the user asks.

## Running it as an agent

1. `pnpm release:app:android:all --dry-run` and tell the user the planned file names.
2. Make sure no emulators are running (they starve the build), then start the real run **in the background** with output redirected to a log in the scratchpad. On this Windows box a full run takes ~1.5–2 h (phone ≈ 50 min, wear ≈ 10 min, TV ≈ 30 min).
3. On failure: read the log tail, fix, then resume with `--only <remaining devices> --start <next unused code>`. Gaps in versionCodes are fine on Play; reused codes are not.
4. Report the root `.aab` paths and sizes, plus the final `EXPO_ANDROID_VERSION_CODE`.

Windows env notes (ANDROID_HOME, CMake 3.31, EBUSY on `android/`): see the `android-emulator-testing` project memory and `docs/RELEASES.md`.
