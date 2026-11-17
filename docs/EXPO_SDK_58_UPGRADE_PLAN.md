# Expo SDK 57 → 58 Upgrade Plan

Status: **planned, decisions locked, not started**. Written 2026-11-17 against `develop`; revised the same day after a second review ([section 13](#13-review-record)) and after the scope decisions in [section 0](#0-locked-decisions).

This plan covers the Expo SDK 58 upgrade of `apps/app`, the dependency refresh for the whole monorepo, adoption of new SDK 58 features, and iPhone Duo (folding iPhone) support.

Sources:

- [SDK 58 changelog](https://expo.dev/changelog/sdk-58) (published 2026-10-15) and the [SDK 58 version table](https://docs.expo.dev/versions/v58.0.0/)
- [Expo Router SDK 57 → 58 migration guide](https://docs.expo.dev/router/migrate/sdk-57-to-58/) and the [`expo-router` changelog](https://github.com/expo/expo/blob/main/packages/expo-router/CHANGELOG.md) (58.0.0 – 58.0.26)
- Per-package changelogs under [`expo/expo/packages`](https://github.com/expo/expo/tree/main/packages) for every Expo package the app installs
- [Native project upgrade diff 57 → 58](https://docs.expo.dev/bare/upgrade/?fromSdk=57&toSdk=58), [iOS scene life cycle](https://expo.fyi/ios-scene-lifecycle), [upgrade troubleshooting](https://expo.fyi/troubleshooting-sdk-upgrades)
- React Native [0.87](https://reactnative.dev/blog/2026/08/11/react-native-0.87) and [0.88](https://reactnative.dev/blog/2026/10/19/react-native-0.88) release posts, [Strict TypeScript API](https://reactnative.dev/docs/strict-typescript-api)
- Release notes for gesture-handler 3, Reanimated 4.7, Worklets 0.13, screens 4.27–4.30, webview, pager-view, view-shot, `@sentry/react-native`, `react-native-tvos`, `expo-speech-recognition`
- SDK 58 docs for [`expo-hinge`](https://docs.expo.dev/versions/v58.0.0/sdk/hinge/), [`ArrangementView`](https://docs.expo.dev/versions/v58.0.0/sdk/ui/swift-ui/arrangementview/), [safe areas](https://docs.expo.dev/develop/user-interface/safe-areas/), [`expo-screen-orientation`](https://docs.expo.dev/versions/v58.0.0/sdk/screen-orientation/)
- `expo@58.0.25/bundledNativeModules.json` and the npm registry (versions read 2026-11-17)

Version numbers are a snapshot. Re-run `pnpm outdated -r` and `npx expo install --check` on the day the work starts.

## 0. Locked decisions

Decided with the project owner on 2026-11-17. Where a later section reads otherwise, these win.

| # | Topic | Decision | Where it applies |
|---|---|---|---|
| D1 | Scope | Upgrade every package, framework, and library in the monorepo, including the backend and web-app majors | 4.3 is in scope, not a follow-up |
| D2 | Version rule | npm `latest` stable everywhere, **even above Expo SDK 58's pins**. No `next`, `beta`, `rc`, or `canary` tags | 4.1, 4.2 |
| D3 | Deprecated code | Remove all deprecated code in the codebase, not only what SDK 58 breaks, and do every optional migration | 5.9 |
| D4 | Experimental features | Trial them in this upgrade; keep only those that meet their bar | 8.2 |
| D5 | TV | TV ships in the same release. If TV breaks on SDK 58, it is fixed before anything ships | 6.6 is a release gate |
| D6 | iPhone Duo | All of section 7 ships in the SDK 58 release | Phase 5 is a release gate |
| D7 | Wear OS | Ship it properly: AGP 9 fixes, release build, Play Wear OS track | 6.7 |
| D8 | Exact Adhan | Android exact alarms behind an opt-in "Precise Adhan timing" setting | 8.1 |
| D9 | Version codes | Local `.env` is the single source of truth | 10.1 |
| D10 | SEO | `generateMetadata()` on every route, with `inject-seo-head.mjs` kept as a safety net | 5.2 |
| D11 | CI | No CI changes. Verification gates run locally | 9.1 |
| D12 | Quick actions | If `expo-quick-actions` breaks under the scene life cycle, extend the pnpm patch and offer the fix upstream | 6.1 |
| D13 | Hardware | A local Mac with Xcode 27.1 is available for iOS, tvOS, watchOS, and iPhone Duo | 2 |

## 1. What SDK 58 changes for this app

| Area | Change | Impact here |
|---|---|---|
| Runtime | React Native 0.86 → **0.88.1**, React 19.2.3 → **19.3.0**, Hermes and Metro 0.87 | The breaking changes are in RN 0.87; 0.88 adds none |
| Toolchain | Node **^22.13**; Gradle **9.4.1**; **AGP 9.2.1** (AGP 8 support dropped); Kotlin Gradle plugin **2.2.21**; `compileSdk` **37**, `targetSdk` 36; minimum iOS **16.4**, Android 7; Xcode **26.4+** | Local Android modules and the generated Wear app use build patterns AGP 9 rejects (section 6.3) |
| iOS | Built for the **iOS 27 SDK**; UIKit **scene life cycle** is required; iPhone apps are **resizable** | Clean prebuild regenerates `SceneDelegate.swift`. Quick actions, deep links, widgets, and intents need re-testing |
| iPhone Duo | New `expo-hinge`, `ArrangementView`, native tabs sidebar placement, vertical-bar status APIs | New work, section 7 |
| Expo Router | Navigation core rewritten; static web uses a streaming renderer; web safe-area insets return zero | **Highest risk.** The app depends on four `expo-router` internal paths (section 5.1) |
| TypeScript | RN **Strict TypeScript API** is the default | About 100 ref-type sites, not only `useRef` |
| Expo Modules | `expo-modules-core` API removals and deprecations on both platforms | Three local modules to check (section 6.4) |
| Android | Prebuilt `expo-modules-core`, R8 on by default with the `-optimize` ProGuard file | R8 and the `-optimize` file are already in use |
| Expo Go | Supports only SDK 58 once released | No impact. The app uses development builds |

macOS is not supported in SDK 58. The app does not target it.

## 2. Preconditions

1. **Mac toolchain (available, D13).** The local Mac with Xcode 27.1 covers the iOS 27 SDK, Device Hub, the iPhone Duo simulator, tvOS, and watchOS. SDK 58's own minimum is Xcode 26.4; `expo-hinge` and `ArrangementView` need Xcode 27.1 and iOS 27.1.
2. **Symlink checkout.** `modules/munib-external-commands/ios/ExternalCommandQueue.swift` is a git symlink into `targets/_shared/`. On a Windows checkout it is a 51-byte text file and will not compile. Build iOS only from a checkout with symlinks enabled.
3. **Clean tree.** `develop` currently has a large uncommitted change set. Commit or stash it, tag `pre-sdk-58`, and work on `chore/expo-sdk-58`.
4. **Baseline.** Record before changing anything: `pnpm check:ci` result, web export size, one exported page's `<head>` (taken before `inject-seo-head.mjs` runs), Android release AAB size, and cold-start time on the reference Android phone and the 1 GB TV emulator.
5. **Node.** SDK 58 supports 22.13+, 24.3+, or 26+. Per D1, standardise local, CI `node-version`, `engines.node`, Vercel, and EAS on one LTS line: Node 26 if both the Vercel and EAS build images offer it, otherwise 24 (local is 24.21 today). `@types/node` follows that major.
6. **EAS.** `eas-cli` 16 → 27 and `eas.json` `cli.version` to `>= 27.0.0`. `eas.json` pins no build image; confirm the default image for SDK 58 has the Xcode version each profile needs.
7. **Stale build output.** Delete `android/`, `ios/`, `node_modules`, and `modules/*/android/build/` before the first SDK 58 build. Run `expo start --clear` afterwards.
8. **Release notes.** Read each major's migration guide before its bump. Not read yet: pnpm 12, TypeScript 7, NestJS 12, TypeORM 1, Vitest 5, Zod 4, `i18next` 25–27, `react-i18next` 16–18, `framer-motion` 13–14, `web-push` 4, Jest 30, AsyncStorage 3, pager-view 10, gesture-handler 3.4–3.5.

## 3. Phases

Each phase ends green on `pnpm check:ci` and is its own PR, except where noted.

| Phase | Scope | Exit check |
|---|---|---|
| 0 | Preconditions, baseline, branch. Code guards from 9.1 (fatal typed routes, Metro alias assertions) | Baseline recorded; local gates pass on SDK 57 |
| 1 | Non-Expo monorepo majors (4.3), one PR per group | `pnpm check:ci`; API migration dry-run passes |
| 2 | Core SDK bump, then every package to npm `latest` (4.1, 4.2), patches (4.4) | `expo-doctor` clean apart from the documented above-pin packages; AsyncStorage gate passes |
| 3 | JavaScript breaking changes (5.1–5.8) and the deprecation sweep (5.9) | Typecheck, Jest, web export with correct `<head>`; deprecation list empty |
| 4 | Native: build tooling, plugins, modules, targets, TV, Wear OS (section 6) | Phone, TV, and Wear builds; widgets, Watch, Live Activity, quick actions work |
| 5 | iPhone Duo (section 7) | Duo simulator pass |
| 6 | Precise Adhan (8.1), new features and experiment trials (8, 8.2) | Per item |
| 7 | QA, docs, release (sections 9–11) | Store builds submitted |

Phases 2–4 cannot ship separately; merge them to `develop` together. Per D5–D7, the release also waits for TV and Wear (phase 4) and iPhone Duo (phase 5). Phase 6 trials that miss their bar are dropped, not deferred.

## 4. Dependencies

### 4.1 Rule for `apps/app`

Per D2, every package goes to its npm `latest` stable version, including packages that Expo SDK 58 pins lower.

1. Run `npx expo install expo@^58.0.0 --fix` and `npx expo-doctor@latest` first, so the SDK baseline is consistent.
2. Then move each package whose npm `latest` is above the SDK pin, one commit per package with its tests. Each one has a gate in 4.2.
3. Add every above-pin package to `expo.install.exclude` in `apps/app/package.json`, so later `expo install --fix` runs don't pull it back down and `expo-doctor` stops flagging it. The reason for each lives in the 4.2 table, since `package.json` can't hold comments.
4. `latest` means the npm `latest` dist-tag. `next`, `beta`, `rc`, and `canary` are out, which excludes react-native-screens 5, react-native-webview 17, and `@tilawa/core` 1.0.

For Expo's own packages the pin and npm `latest` are the same today.

### 4.2 `apps/app` version map

**Expo packages** move to the SDK 58 line through `expo install --fix`:

| Package | Now | Target |
|---|---|---|
| `expo` | ~57.0.8 | ~58.0.25 |
| `expo-router` | ~57.0.8 | ~58.0.31 |
| `@expo/ui` | ~57.0.7 | ~58.0.28 |
| `@expo/metro-runtime` | ~57.0.7 | ~58.0.17 |
| `babel-preset-expo` | ~57.0.4 | ~58.0.25 |
| `expo-dev-client` | ~57.0.9 | ~58.0.20 |
| `jest-expo` | ~57.0.2 | ~58.0.14 |
| `expo-notifications` | ~57.0.7 | ~58.1.9 |
| `expo-location` | ~57.0.6 | ~58.0.22 |
| `expo-audio` | ~57.0.3 | ~58.0.12 |
| `expo-file-system` | ~57.0.1 | ~58.0.13 |
| `expo-speech-recognition` | ~56.0.1 | 58.0.1 (community package on the SDK version line) |
| all other `expo-*` | ~57.0.x | SDK 58 pin |

Two dependency-declaration fixes to make in the same PR:

- **`expo-secure-store` is imported but not declared.** `src/lib/storage/safe-secure-store.ts` imports it; it resolves only because 57.0.1 is hoisted. Add it with `npx expo install expo-secure-store` (~58.0.3). In 58, iOS `keychainAccessible` is applied when overwriting an existing item, and `deleteItemAsync` rejects when the keychain refuses; check both against the App Lock code.
- **`@expo/dom-webview` is declared but never imported**, and there are no `"use dom"` files. It is a peer of `expo`; keep it only if `expo-doctor` asks for it.

**React Native core and SDK-pinned community packages:**

"Above pin" rows go in `expo.install.exclude` (4.1).

| Package | Now | SDK 58 pin | Target (npm `latest`) | Notes |
|---|---|---|---|---|
| `react`, `react-dom`, `react-test-renderer` | 19.2.3 | 19.3.0 | 19.3.1 | Above pin (patch). Update the three `overrides` in `pnpm-workspace.yaml`; admin and marketing-web move too |
| `react-native` (`npm:react-native-tvos`) | 0.86.0-2 | 0.88.1 | `npm:react-native-tvos@0.88.1-0` | Do **not** take `0.88.101-tv.0`; it is an experimental pre-release marked not for production. See open question 4 |
| `@react-native/jest-preset` | ^0.86.0 | ^0.88.1 | 0.88.1 | Required peer of `jest-expo@58` |
| `@types/react` | ~19.2.2 | — | 19.3.0 | |
| `react-native-web` | ~0.21.0 | ~0.21.4 | 0.21.4 | |
| `react-native-reanimated` | 4.5.0 | 4.7.1 | 4.7.1 | 4.6 does not support RN 0.88. Behaviour changes in 5.6 |
| `react-native-worklets` | 0.10.0 | 0.13.0 | 0.13.1 | Above pin (patch) |
| `react-native-gesture-handler` | ~2.32.0 | ~3.3.0 | 3.5.0 | **Above pin, major.** See 5.6 |
| `react-native-screens` | 4.26.2 | ~4.30.1 | 4.30.1 | 5.0 is beta and excluded |
| `react-native-safe-area-context` | ~5.7.0 | ~5.11.1 | 5.11.1 | 5.8.1+ is required for the Strict TypeScript API |
| `react-native-svg` | 15.15.4 | 15.16.0 | 15.16.1 | Above pin (patch) |
| `react-native-webview` | 13.16.1 | 14.0.1 | 14.0.1 | **Major.** 14 raises the Android minimum to API 24 (the app's minimum, Android 7) and removes legacy file-upload paths. 1 file (`attachments/pdf-preview.tsx`). 17.x is on the `next` tag and excluded |
| `react-native-pager-view` | ^8.0.3 | 9.0.7 | 10.0.3 | **Above pin, two majors.** 10 makes `PagerView` a function component and drops deprecated Android event and package APIs. Check every ref method used in `quran/pager-view.tsx`, and update the TV stub |
| `react-native-view-shot` | ^5.1.1 | 6.1.1 | 6.2.1 | **Above pin, major.** `html2canvas-pro` becomes an optional peer for web, and web share capture relies on it (`lib/share/shareViewSnapshot.ts`); only `html2canvas` 1.4.1 is installed today, so add `html2canvas-pro`. 6.2 makes iOS `useRenderInContext` scale to `width`/`height` instead of cropping. Re-test share cards on iOS and web |
| `@react-native-async-storage/async-storage` | 2.2.0 | 2.2.0 | 3.1.1 | **Above pin, major, holds all user data.** Gate before merging: a test that seeds a store written by 2.2.0 with every `DB_KEYS` key, upgrades, and reads it back unchanged on iOS, Android, and web. Also a downgrade test (3.x data read by 2.2.0) for the rollback in section 10. If either fails, stop and raise it |
| `@sentry/react-native` | ^8.18.0 | ~8.28.0 | 8.35.0 | Above pin. 8.33.0 adds Expo Router 58 support to `expoRouterIntegration`, and 8.35.0 restores touch breadcrumbs on RN 0.88 |

**Not SDK-pinned — take npm latest, then verify against RN 0.88:**

| Package | Now | Latest | Notes |
|---|---|---|---|
| `@bacons/apple-targets` | ^4.0.7 | 5.0.0 | **Major, with no published release notes.** Diff the npm tarballs before bumping (section 6.5) |
| `react-native-android-widget` | ^0.20.3 | 0.26.0 | Patched, and two plugins patch its generated XML (section 6.2) |
| `@react-native-tvos/config-tv` | ^0.1.5 | 0.1.7 | |
| `expo-quick-actions` | ^6.0.2 | 6.0.2 | No SDK 58 release. Known scene life cycle risk (section 6.1) |
| `react-native-quick-crypto` | ^1.1.5 | 1.1.9 | |
| `reanimated-color-picker` | ^5.1.1 | 5.1.4 | |
| `onnxruntime-react-native` | 1.24.3 | 1.24.3 | No new release. Must build on AGP 9 / Kotlin 2.2 / `compileSdk` 37 |
| `onnxruntime-web` | 1.24.3 | 1.31.1 | Take 1.31.1 (D2). Native has no release past 1.24.3, so web and native runtimes will differ. Gate: run the recitation-practice model on fixed audio fixtures under 1.24.3 and 1.31.1 and compare outputs; raise it if they differ beyond tolerance. Update `copy-ort-wasm.mjs` if the wasm file names changed |
| `@tilawa/core` | 0.4.0 | 0.4.0 | Patched. `1.0.0-rc.0` is excluded (D2) |
| `@quran-lab/tajweedformer` | 3.1.6 | 3.1.6 | The Android module pins the AAR at `3.1.5`; move it to 3.1.6 if that version is on Maven |
| `@tanstack/react-query` | ^5.90.2 | 5.107.1 | |
| `i18next` | ^24.2.0 | 27.1.3 | **Major ×3.** 402 files touch i18n. Bump alone and run the i18n guard tests |
| `react-i18next` | ^15.4.0 | 18.0.2 | **Major ×3.** Bump together with `i18next` |
| `fuse.js` | ^7.4.2 | 7.5.0 | Run `pnpm --filter app test -- search` |
| `adhan` | ^4.4.3 | 4.4.6 | Run the prayer-time tests and compare a known date |
| `bowser` | ^2.14.1 | 2.15.0 | |
| `jest` / `@types/jest` | ^29.7.0 / ^29.5.14 | 30.5.2 / 30.0.0 | `jest-expo@58` accepts 29 or 30 and bundles `jest-environment-jsdom@30`. Move to 30 |
| `eas-cli` | ^16.28.0 | 27.10.0 | |
| `googleapis` | ^173.0.0 | 190.0.0 | Upload scripts only |
| `typescript` | ~6.0.3 | 7.0.2 | Including `apps/app` (D1), in phase 3. If `expo/tsconfig.base` or typed routes fail on 7, fix them or raise it; do not silently stay on 6 |

### 4.3 Rest of the monorepo

In scope per D1. Do these in Phase 1, before the SDK bump, so failures are attributable. One PR per group.

| Group | Packages (now → latest) | Risk |
|---|---|---|
| Tooling | `@biomejs/biome` ^2.0.0 → 2.6.8; `turbo` ^2.5.4 → 2.11.11; `@commitlint/*` → 21.2.4; `tsx` → 4.23.15; `cross-env` 7 → 10.1.0 | Low. `release-please.yml` runs a pinned `@biomejs/biome@2.5.2`; keep it equal to the root version |
| pnpm | 11.26.0 → 12.21.0 (`packageManager`, CI `pnpm/action-setup`) | **Major.** The workspace relies on `nodeLinker: hoisted`, `patchedDependencies`, `allowBuilds`, and `overrides`. Own PR |
| TypeScript | ^6.0.0 → 7.0.2 across all workspaces | **Major.** API, admin, marketing-web, and packages here; `apps/app` follows in phase 3 (4.2) |
| Next.js apps | `next` 16.3.4 → 16.4.6; `tailwindcss` + `@tailwindcss/postcss` 4.3.0 → 4.3.5; `lucide-react` → 1.73.0; `framer-motion` ^12 → 14.14.0 (**major ×2**); `zod` ^3 → 4.6.7 (**major**, admin); `jose` → 6.2.17; `tailwind-merge` → 3.7.0; `jsdom` 26 → 31; `@vitejs/plugin-react` 4 → 6; `@testing-library/react` → 16.3.3 | Medium |
| Test | `vitest` + `@vitest/coverage-v8` ^4.1.11 → 5.1.0 (**major**); remove the two `vitest` overrides pinned to 4.1.11 | Medium |
| API | `@nestjs/*` 11 → 12; `typeorm` ^0.3.31 → 1.1.3 (**major**); `express` → 5.3.0; `helmet` → 8.3.0; `class-validator` 0.14 → 0.15.1; `better-sqlite3` 12 → 13.2.0; `pg` → 8.23.1; `redis` → 6.3.1; `@upstash/qstash` → 2.12.2; `cloudinary` → 2.11.0; `supertest` → 7.3.2; `@swc/core` → 1.16.22; `unplugin-swc` 1 → 2 | **High.** TypeORM owns the production DDL. Do NestJS first, then TypeORM in its own PR with a migration dry-run against a production snapshot. Remove the `typeorm@<0.3.31` override afterwards. Re-sync `.agents/skills/nestjs` |
| Shared | `orval` ^8.30.0 → 8.48.0 (then `pnpm generate:api`); `drizzle-orm` → 0.45.4; `date-fns` → 4.4.0; `web-push` ^3.6.7 → 4.0.0 (**major**); `@types/node` ^20 → the Node LTS major chosen in section 2 | Medium |

`tools/screenshot-studio` is outside the workspace and out of scope.

### 4.4 Patches

All 15 `patchedDependencies` entries are keyed to exact versions and stop applying when the version changes. For each: check whether upstream fixed it, then drop it or re-create it with `pnpm patch`.

**Two patches are probably not taking effect today.** Confirm before porting them, because porting a no-op is wasted work and dropping a needed one is a regression.

| Patch | Touches | Finding and action |
|---|---|---|
| `expo-location@57.0.6` | `LocationModule.kt` + `LocationSubscribers` JS | The package ships a prebuilt AAR and is not in `autolinking.android.buildFromSource`, so the **Kotlin half is likely never compiled**. Only the JS half applies. Decide: add `expo-location` to `buildFromSource`, or drop the Kotlin half. Then re-check against 58.0.22 |
| `react-native-tvos@0.86.0-2` | `ReactAndroid/.../ReactViewManager.kt` | React Native is consumed prebuilt from Maven; nothing builds it from source, so this patch **likely never applied**. Find what it was meant to fix and whether the symptom exists today |
| `expo-router@57.0.8` | `build/react-navigation/stack/views/Stack/Card.js` | Replaces `InteractionManager.create/clearInteractionHandle`, which RN removed. The JS stack is rewritten in 58; expect to drop it |
| `expo-file-system@57.0.1`, `expo-image-picker@57.0.6` | `AndroidManifest.xml` | Manifest-only; both are in `buildFromSource`. In 58 the image-picker crop activity is renamed `ExpoCropImageActivity`; re-check the patch target |
| `expo-navigation-bar@57.0.2` | `NavigationBar.android` | 58.0.2 restores style and visibility on unmount, which may be what the patch does |
| `react-native-reanimated@4.5.0` | `NativeProxy.kt` | Re-evaluate against 4.7.1, and confirm Reanimated is built from source |
| `react-native-screens@4.26.2` | `gamma/helpers/ImageLoader.kt` | The tab icon loader. 4.29 reworked tab icons; re-evaluate |
| `react-native-svg@15.15.4` | `VirtualView.java` | Re-evaluate against 15.16.0 |
| `react-native-android-widget@0.20.3` | `RNWidgetImageProvider.java` | Re-evaluate against 0.26.0 |
| `expo-quick-actions`, `onnxruntime-react-native`, `@tilawa/core`, `brace-expansion`, `image-size` | — | Versions unchanged; patches keep applying. Rebuild and test |

Before re-creating any native patch, check whether the SDK 58 package ships a prebuilt AAR or XCFramework. If it does, the patch needs a `buildFromSource` entry to have any effect.

Also review every `overrides` entry and remove those whose vulnerable range no longer appears in the lockfile.

## 5. JavaScript breaking changes found in this codebase

Audit results come from a search of `apps/app` on 2026-11-17. "Not used" means no matches.

### 5.1 Couplings to `expo-router` and Expo internals

These are the most likely silent failures. None is a public API, and three of the four fail without an error.

| Coupling | Where | Failure mode in 58 | Action |
|---|---|---|---|
| Metro alias of `./views/SuspenseFallback` inside `expo-router` | `metro.config.js:244-251` → `route-suspense-fallback.tsx` | If the internal file moves, the alias stops matching and the custom loader vanishes silently. Separately, 58 dispatches navigation inside React transitions, so `SuspenseFallback` **no longer renders for navigation-triggered suspense** at all | Decide whether the custom loader still has a role (first load only). If yes, keep the alias and add a build-time assertion that the target path exists. If no, delete the alias and the component |
| Deep import of `expo-router/build/react-navigation/native/theming/{DarkTheme,DefaultTheme}` | `src/lib/navigation-theme.ts:2-3` | Build error if the path moves | Import `DarkTheme` / `DefaultTheme` from the public `expo-router` entry, and check the `ThemeProvider` value shape (`dark`, `colors`, `fonts`) |
| `Helmet` from `expo-router/vendor/react-helmet-async/lib` | `src/components/seo/seo.tsx:6`; virtual mock in `jest.setup.ts:187-193` | Tags missing from static HTML (section 5.2) | Section 5.2. Fix the stale comment at `jest.setup.ts:185` |
| Typed-routes generation through `expo-router/internal/testing`, `@expo/router-server/build/typed-routes/generate`, `expo-router/_ctx-shared` | `scripts/ensure-expo-env.mjs:26-30`, run by `check-types` | Errors are swallowed when a `router.d.ts` already exists, so the `Href` type (155 imports) goes stale while CI stays green | Make failure fatal. Prefer a supported generator if one exists in 58 |
| Metro alias of `./PushTokenManager` inside `expo-notifications/build/` | `metro.config.js:237-243` → web shim | Web push registration breaks silently if the file moves | Re-check the path in 58.1.x; add the same build-time assertion |
| `AudioModule.AudioStream` constructor and the `"audioStreamBuffer"` event, reached by cast | `src/lib/quran-companion/.../capture.native.ts:80-101` | Recitation capture breaks if internals change | Move to the public `AudioStream` API, which 58 extends with `startFileRecordingAsync` |
| `RESTRICTED_MANIFEST_FIELDS` copied from `babel-preset-expo`; bundles assumed to contain `process.env.APP_MANIFEST` under `dist/_expo/static/js/web` | `scripts/prepare-web-export-env.cjs`, `scripts/patch-web-export-app-manifest.cjs` | Web export manifest patch silently does nothing | Re-validate both against a 58 export |

### 5.2 Static web metadata

`<Seo>` relies on the static renderer collecting Helmet tags. In SDK 58, static output without React Server Components uses the streaming renderer and Head-rendered tags are **not** in the initial HTML.

1. After the bump, export and diff one page's `<head>` against the baseline, before `inject-seo-head.mjs` runs.
2. Move per-route metadata to `generateMetadata()` (typed `Metadata` from `expo-router/server`). Add one helper, for example `createRouteMetadata(path)` in `src/lib/seo/`, that builds the result from the existing registry, so each route file exports a one-liner. For static rendering the first argument is `undefined` and the second holds route params.
3. Metadata comes from the matched route, not layouts. Add a test that fails when a route in the SEO registry has no `generateMetadata`.
4. Keep `<Seo>` only for client-side updates after a locale change, on the public `expo-router/head`.
5. Keep `scripts/inject-seo-head.mjs` as a safety net (D10). Change it to add a tag only when the exported page lacks it, so nothing is duplicated, and to log every tag it adds. Any page that needs the script is missing a `generateMetadata`; fix the route.
6. Three dynamic routes have no `generateStaticParams`: `calendar/[date]`, `tasbeeh/[zikrId]`, `tasbeeh/custom/[id]`. Confirm how the 58 exporter treats them.
7. `useSitemap` no longer returns `isInitial`, and generated query strings encode differently (spaces as `+`, `~` as `%7E`). Re-check `scripts/generate-seo-files.mjs` and canonical URLs.

### 5.3 Root HTML (`src/app/+html.tsx`)

- Call `useServerDocumentContext()` from `expo-router/html`. Spread `htmlAttributes` and `bodyAttributes`, render `headNodes` in `<head>` and `bodyNodes` after `children`. Without `bodyNodes` the page does not hydrate.
- Keep the two boot scripts ahead of `headNodes` so they still run first.
- Merge the hardcoded `lang="en"` with `htmlAttributes` rather than overriding.
- Navigation hooks no longer work in this file. It uses none; `pathname` and `params` arrive as props.

### 5.4 Web safe areas

Under Expo Router on web, `useSafeAreaInsets()` returns zeros and `SafeAreaView` adds nothing. 20 files call `useSafeAreaInsets`, and there is no `env(safe-area-inset-*)` anywhere, while `+html.tsx` sets `viewport-fit=cover`. Installed PWAs on notched iPhones would lose their padding.

- Define the four inset variables in a `<style>` in `+html.tsx` (CSS imports are not supported there).
- Add one `useAppSafeAreaInsets()` hook: the web build reads those variables, native re-exports `useSafeAreaInsets`. Replace the 20 call sites.
- Do not add a second `SafeAreaProvider`.

### 5.5 Router API and behaviour

| Item | State here | Action |
|---|---|---|
| `expo-router/unstable-native-tabs` | `src/components/app-tabs.tsx` | Deprecated since 58.0.1. Import from `expo-router/native-tabs`. Re-check every prop in use: `minimizeBehavior`, `indicatorColor`, `rippleColor`, `labelVisibilityMode`, `iconColor`, `labelStyle`, `disableAutomaticContentInsets`, `Trigger.Icon` with `drawable` |
| Tabs show only declared screens | `(tabs)/` has exactly `index`, `tracker`, `library`, `settings`. Native and wide tabs declare those four. **`app-tabs.web.tsx` names its first trigger `"home"`** | Verify the web trigger name against the unified tabs implementation; rename to `index` if the route is not found |
| `expo-router/ui` tabs (`Tabs`, `TabList`, `TabSlot`, `TabTrigger`) | `app-tabs-wide.tsx`, `app-tabs.web.tsx` | Rewritten on the standard navigator. `TabList` now pads by left/right safe-area insets (58.0.25); check the custom rail and bottom bar for double padding. Tab routers now handle `PUSH` instead of coercing it to `NAVIGATE` |
| `useSegments()` workaround | `use-tab-screen.ts` handles native tabs omitting the group segment | Re-test; remove if fixed |
| `Stack.Protected` | `app-stack.tsx` guards `(tabs)` and also renders `<Redirect href="/intro">`; `OnboardingGate` renders a third redirect | A failed guard now redirects instead of unregistering the route. Add `redirectTo="/intro"`, then test for redirect loops and double navigation across the three paths |
| Router hooks outside the navigator | `OnboardingGate`, `LocalePathBootstrap`, `TvRemoteBridge`, `WebNavigationFocusManager`, `WebGlobalRail`, `ExternalCommandProcessor`, `ReviewDeepLinkBridge` are siblings of `<Stack>` | `useNavigation` now throws outside a navigator. These use `useRouter`, `usePathname`, `useSegments`, and `<Redirect>`; confirm each still works there |
| `unstable_settings.anchor` | No layout exports `unstable_settings` | From 58.0.26 a group no longer uses the route named like the group as its anchor. Two callers pass `withAnchor: true` (`use-app-quick-actions.ts:53`, `open-notification-route.ts:18`). Export `unstable_settings = { anchor: "index" }` from `(tabs)/_layout.tsx` and test cold-start notification and quick-action back behaviour |
| `router.canDismiss()` as the back test | `goBackOrReplace` in `lib/navigation.ts` (219 call sites) and the TV Back ladder in `tv-remote-bridge.tsx`, which depends on `BackHandler` listener order | Re-validate on the new core. Consider the new `useCanGoBack()` |
| `useNavigationContainerRef().addListener("state")` | `web-navigation-focus.tsx:13-17` | `onStateChange` is removed; the ref's `state` event is the documented replacement. Verify it still fires |
| `useIsFocused` from `expo-router` | `use-web-key-handler.ts` | Verify the export |
| `router.setParams` | `quran/practice/session.tsx:291` | Verify |
| `presentation: "modal"` | `(auth)/login` only | The experimental web modal is removed. Check how login presents on web. 58.0.25 warns when a modal route is the first screen in a stack; check a cold deep link to `/login` |
| `asyncRoutes` | Explicit: web `true`, native `false` | Matches the new default. Remove the duplicate `extra.router.asyncRoutes` if nothing reads it. `@expo/metro-config` 58.0.12 adds experimental granular bundle splitting for web async routes; evaluate against [`PROFILING.md`](./PROFILING.md) |
| `web.output` | `"static"`, no API routes | No change. Do not add the removed `unstable_useServer*` flags |
| Ancestor params no longer copied into child routes | Deep flows under `quran`, `hadith/[collection]`, `dua/[category]`, `calendar/[date]` | Spot-check |
| `__expo_*` launch params | — | Stripped before the app sees the URL in dev builds. No action |
| RTL navigation direction | Owned by `changeAppLocale` and `I18nManager` | 58 adds `LocaleProvider` for runtime navigation direction. Trialled in 8.2 |
| iOS 26 header appearance | Root stack sets `headerShown: false`; no other screen options exist | No action |
| `useNavigation`, `navigation.dispatch`, `initialRouteName`, `redirect` / `initialParams` on Screen, `freezeOnBlur`, `navigationKey`, `beforeRemove`, `usePreventRemove`, `withLayoutContext`, `@react-navigation/*`, module-level `router`, `Link` beyond one plain use | Not used | None |

### 5.6 React Native 0.87 / 0.88 and animation libraries

| Item | State here | Action |
|---|---|---|
| Strict TypeScript API: component names are no longer ref types | About 100 sites: `useRef<View \| ScrollView \| FlatList \| TextInput>` in 27 files, plus `forwardRef<View>`, `RefObject<View \| …>`, `useState<View \| null>`, and `nextFocusRight` typed as `View` | Use the `*Instance` types (`ViewInstance`, `ScrollViewInstance`, …) or `React.ComponentRef<typeof View>`. Do not use the `react-native-legacy-deep-imports` opt-out |
| Casts | `scroll as unknown as View` before `.measure()` in `use-scroll-to-active.ts`; `TVEventHandler` and `TVFocusGuideView` reached through `require("react-native")` | Re-type |
| `expo-blur` and `expo-glass-effect` ref types | `blurTarget` and `BlurTargetView` refs are typed `ComponentRef<typeof View>` in 58; `GlassView` `tintColor` is `ColorValue` | Fix in `glass-surface.tsx`, `sheet.tsx`, `screen-layout.tsx`, `blur-target-provider.tsx` |
| `Appearance.setColorScheme('unspecified')` | `theme-provider.tsx:81` | Change to `'auto'`. `useColorScheme()` no longer returns `'unspecified'`; check that branch |
| `experimental_backgroundImage` | `src/lib/gradient.ts:18` | 0.88 stabilises the unprefixed background properties and deprecates the `experimental_` ones. Check whether `backgroundImage` is now the stable name and migrate |
| `Modal statusBarTranslucent` | All 5 modals (`ui/sheet.tsx`, image gallery, two PIN modals) | Check the prop still exists and behaves under edge-to-edge |
| `InteractionManager` removed | Comments only; code uses `run-when-idle.ts` and the `requestIdleCallback` polyfill | Check whether the polyfill is still needed |
| Android default `User-Agent` now includes app name and version | API and CDN requests | Check server-side user-agent parsing (`bowser`, admin reports) |
| Polyfills | `expo` drops its `AbortSignal.timeout` / `AbortSignal.any` polyfills and switches `TextDecoder` to Hermes | Not referenced directly. `jest.setup.ts` overrides global `fetch` to work around Expo's fetch getter; re-test |
| Reanimated 4.7 | 48 files | The new layout-animations engine is the default; re-test `Keyframe`, `FadeIn*`/`FadeOut`, and `stagger-entrances`. `measure` on an unmounted ref returns `null`. `runOnJS` is used in 5 files; move to `scheduleOnRN` from `react-native-worklets` and update the hand-written Reanimated stub in `jest.setup.ts:40-79` |
| Gesture Handler 3 | `GestureHandlerRootView` in the root layout; `Gesture.Pinch/Pan/Tap()` with `GestureDetector` in the image gallery and the genealogy tree map | v3 is built around hooks (`usePanGesture`, `useSimultaneousGestures`, …) with renamed callbacks (`onStart` → `onActivate`, `onEnd` → `onDeactivate`). Migrate both files to the hook API (D3) and replace any `Legacy*` export |
| Screens 4.27–4.30 | Native tabs | `backTitleVisible` default is `true`; iOS 26.1+ tabs use the `UITab` API. Visual check of tabs and the login modal |
| Metro 0.87 | `metro.config.js`: custom in-memory cache store, worker cap, narrowed `watchFolders`, extended `blockList`, `resolveRequest` overrides, service-worker middleware | Re-test the Windows EMFILE workarounds and drop those no longer needed. `clearMetroDiskCache` keys on cache directory names; re-check. Babel transforms now key on `BABEL_ENV` |
| `Touchable*`, `ImageBackground`, core `Animated`, `UIManager`, `NativeModules`, `Dimensions`, `react-native/Libraries/*`, `InputAccessoryView`, `*Static` types | Not used | None |

### 5.7 Expo packages

| Package | Change in 58 | State here and action |
|---|---|---|
| `expo-file-system` | `File.write()`, `FileHandle.readBytes()` and `writeBytes()` are async. `File.md5`, `InfoOptions.md5`, `FileInfo.md5` are deprecated for `File.digest()` | New API in `lib/share/shareViewSnapshot.ts`; check its `write` call. `expo-file-system/legacy` is used in 5 files (`audio-cache`, `qcf-font-cache`, `pdf-preview-source`, `open-attachment-externally`, `model-store.native`) and mocked in `jest.setup.ts:137`. The 58 changelog does not deprecate or remove the legacy entry; migrate anyway, one module per commit. `model-store.native.ts` verifies downloads with legacy `md5`; move to `File.digest()` |
| `expo-notifications` | Foreground notifications show by default. A handler that does not answer in 3 s no longer drops the notification. New plugin option `enableRemoteNotifications`. Android FCM `dataString` no longer overrides derived data | `scheduler.ts:191` sets a handler returning banner/list/sound/badge; confirm it covers every case. The app uses remote push, so leave `enableRemoteNotifications` at its default. Re-test `getLastNotificationResponseAsync` / `clearLastNotificationResponseAsync` (`notification-provider.tsx:269`) and `registerTaskAsync` (`surface-push/background-task.ts`). Check the surface-push payload does not rely on `dataString` |
| `expo-location` | iOS: top-level `scope` and `accuracy` are removed from foreground-permission responses; use the values under `ios`. `motionUsagePermission: false` excludes CoreMotion | `lib/location.ts` and `app/qibla` call the permission APIs; no `.scope` read was found. Qibla uses `watchHeadingAsync`; no heading changes are listed, but re-test accuracy |
| `expo-task-manager` | Android package renamed `expo.modules.taskManager` → `expo.modules.taskmanager` | Check ProGuard keep rules and any reference to the old name |
| `expo-audio` | Recorder duration limit excludes paused time. iOS activates the session once and keeps it active. Android pauses on headphone/Bluetooth disconnect and does not start playback when audio focus is denied | Re-test background Qur'an playback, the Adhan, interruption handling (`interruptionMode: "doNotMix"`; new `doNotMixPersistent`), lock-screen controls, and recitation recording |
| `expo-font` | iOS `getLoadedFonts()` reports only the alias. Web uses the CSS Font Loading API; `FontResource.testString` removed | Not called directly. Re-test the deferred Arabic / Bengali / Devanagari loader in `_layout.tsx` and the QCF page-font cache on web |
| `expo-linking` | `parse()` no longer double-decodes query values | Used in 4 files; re-test OAuth callback parsing with encoded values |
| `expo-localization` | iOS no longer forces RTL from the device locale | RTL is owned by `changeAppLocale`. Regression-test `ar` and `ur` cold start on iOS |
| `expo-constants` | App config and `.env` load in the build's mode: Debug uses development, everything else production | Only `.env` and `.env.example` exist, loaded by `loadAppEnv`. Confirm a release build still reads `.env` |
| `expo-secure-store` | See 4.2 | |
| `expo-image-picker` | Android crop activity renamed; iOS video path needs photo-library read access first | Re-test custom adhkar attachments |
| `expo-speech-recognition` | `download_canceled` status renamed `download_scheduled`; Android `audiostart` reports `uri: null` when not persisting | Not referenced in source. Update the TV stub |
| `@expo/ui` | iOS `<Host>` top-aligns; unset `spacing` is `nil` | One file uses `MenuView` from `@expo/ui/community/menu`. Visual check |
| `expo-web-browser`, `expo-apple-authentication`, `expo-store-review`, `expo-sharing` | Now resolve their window from the foreground scene | Behaviour check only: OAuth, Sign in with Apple, review prompt, share sheet |
| `expo-status-bar` | New `verticalBarBehaviorIOS` prop and `useVerticalBarEdgeIOS()` | Used in section 7 |
| `NODE_ENV` forced by the CLI | Four scripts set `production` | Compatible |
| Fingerprint preset `balanced`; `expo login` in browser; `expo-sqlite`, `expo-media-library`, `expo-screen-orientation`, `expo-updates` | Not used | None |

### 5.8 Jest

- `jest-expo@58` aligns Babel options across platforms and replaces its own `react-test-renderer` dependency with `test-renderer`. The app's tests import `react-test-renderer` directly through `src/test-support/render.tsx`; keep it as a direct dev dependency at 19.3.x.
- RN 0.88 deprecates `react-native/Libraries/Core/InitializeCore` in favour of `react-native/setup-env`. No setup file imports it today.
- The `expo-router` mock in `jest.setup.ts:171-182` covers only `useRouter`, `useFocusEffect`, `usePathname`, and `useSegments`. Add `useLocalSearchParams`, `Redirect`, `useIsFocused`, `useNavigationContainerRef`, `setParams`, and `navigate`, so tests fail on real breakage rather than on a thin mock.
- Update the mocks for `expo-file-system/legacy`, `expo-notifications`, `expo-location`, and the Reanimated stub as the code under them changes.

### 5.9 Deprecation sweep

Per D3, this upgrade removes all deprecated code, not only what breaks. Run the sweep after phase 2, so deprecations are judged against the new versions.

How to find them:

1. **TypeScript, every workspace.** A one-off script using the TypeScript language service's suggestion diagnostics (codes 6385 and 6387, "is deprecated") over all source files. It catches `@deprecated` APIs from every dependency, such as `expo-router/unstable-native-tabs`, `withLayoutContext`, `File.md5`, and `NativeArrayBuffer`. Save the list in the PR.
2. **Runtime.** Run each app through its main flows and collect deprecation warnings from Metro, LogBox, and the browser console.
3. **Android.** Build once with `org.gradle.warning.mode=all` (the hygiene plugin sets `none`), and record Gradle, AGP, and Kotlin deprecations.
4. **iOS.** Build the app, local modules, and targets with Xcode 27.1 and record deprecation warnings.
5. **Backend and web apps.** Same TypeScript pass for NestJS 12, TypeORM 1, Next 16.4, and Zod 4.

Already known:

| Item | Section |
|---|---|
| `expo-file-system/legacy` in 5 modules; `File.md5` | 5.7 |
| `runOnJS` → `scheduleOnRN`; gesture builders → hooks | 5.6 |
| `expo-router/unstable-native-tabs` | 5.5 |
| Internal `expo-router`, `expo-notifications`, `expo-audio` paths | 5.1 |
| `experimental_backgroundImage`; `Appearance.setColorScheme('unspecified')`; the `requestIdleCallback` polyfill if RN now provides it | 5.6 |
| `OnStartObserving` / `OnStopObserving` in the Live Activity module; `static var` intent metadata; podspec deployment targets | 6.4 |
| `kotlin-android`, `compileSdkVersion`, `lintOptions`, `kotlin-stdlib-jdk7` in local Android modules and the Wear app | 6.3 |
| `openAppWhenRun`; `WCSession` complication calls | 6.5 |

Exit check: the TypeScript deprecation list is empty for first-party code, or each remaining entry has a written reason, for example that no replacement exists yet.

## 6. Native projects

### 6.1 iOS scene life cycle

Prebuild generates `SceneDelegate.swift` (a subclass of `ExpoAppSceneDelegate`) and `UIApplicationSceneManifest`. The template `AppDelegate` no longer creates the window or overrides `application(_:open:options:)` and `application(_:continue:restorationHandler:)`; Expo forwards those events to `ExpoAppDelegate` overrides and `ExpoAppDelegateSubscriber`s.

No local module or target uses `UIScreen.main`, `keyWindow`, `connectedScenes`, `rootViewController`, or an app-delegate subscriber. External commands reach JS through an App Group queue plus a Darwin notification and `WCSession`, so they do not depend on the app delegate. The remaining risks are in dependencies and entry points:

| Surface | Check |
|---|---|
| `expo-quick-actions@6.0.2` | Its iOS code reads `launchOptions[.shortcutItem]` and implements `application(_:performActionFor:)`. Expo says it forwards quick actions under the scene life cycle; verify cold and warm starts. If either fails, extend the existing pnpm patch to read the shortcut item from the scene's connection options and `windowScene(_:performActionFor:)`, and open an upstream PR (D12) |
| Widget and Live Activity links | `.widgetURL(...)` and `Link(destination:)` open `munib-tracker://` URLs. Test cold and warm starts from every widget family, the Live Activity, and the Dynamic Island |
| App Intents | Intents use `openAppWhenRun`. Test each intent from Shortcuts and Siri |
| Universal links and OAuth | `applinks:my.munibtracker.app`, the reversed Google scheme, and the product scheme. Each must arrive exactly once; a duplicate means two dispatchers |
| `modules/munib-live-activity` | Start, update, end, and push-token registration |
| `@sentry/react-native` | App-start span and foreground/background breadcrumbs. No Sentry release notes mention the scene life cycle |
| `expo-notifications` | Tap-to-open from a terminated app |
| `@react-native-tvos/config-tv` | It string-replaces tokens in `SplashScreen.storyboard` and rewrites `platform :ios` in the Podfile. Confirm both still match the 58 template and that tvOS gets a scene delegate |

### 6.2 Config plugins and scripts that patch generated files

These edit generated native files by string or regex. A template change makes most of them fail silently. Diff the SDK 57 and 58 generated projects first, then re-validate every anchor. Convert silent no-ops into thrown errors while there.

| File | Anchor | Fails how |
|---|---|---|
| `plugins/withAndroidReleaseSigning.cjs` | `buildTypes { … release { … } }`, `signingConfigs` blocks matched with exact 4-space indentation, `signingConfig signingConfigs.debug` | Silently, if the template changes indentation or moves to `=` assignment syntax |
| `scripts/lib/sync-android-versions.cjs` | `versionName "…"`, `versionCode <n>` | **Aborts the release** under `strict: true` |
| `plugins/withExternalCommands.cjs:275-286` | First `dependencies {` in `app/build.gradle` | Injects into the wrong block if another appears earlier |
| `scripts/screenshots/lib/build-screenshot-apk.mjs` | `minifyEnabled enableMinifyInReleaseBuilds` | Silently. It also sets `minifyEnabled false` while `shrinkResources` stays true, which AGP rejects; fix regardless |
| `plugins/with-android-build-hygiene.js` | ProGuard file rewrite (already a no-op); a `subprojects {}` block keyed on the `org.jetbrains.kotlin.android` plugin id; `styles.xml` item stripping; debug-manifest `tools:replace` stripping | The Kotlin block goes dormant under AGP 9 built-in Kotlin. It also sets `org.gradle.warning.mode=none`, which hides AGP 9 deprecations; remove that during the upgrade |
| `plugins/withTvExpoModuleExcludes.cjs` | `expoAutolinking.useExpoModules()` in `settings.gradle`; first `use_expo_modules!` in the Podfile | Android throws; iOS is silent |
| `plugins/withTvNilSafeFabricComponents.cjs` + `scripts/nil-safe-fabric-third-party-components.cjs` | `react_native_post_install(` in the Podfile; three hardcoded paths to `RCTThirdPartyComponentsProvider.mm`; a regex over its `thirdPartyComponents` dictionary | Podfile patch is silent; the script **throws and fails the Xcode build** if the generated block changes. Check whether RN 0.88 already skips nil classes and this can be deleted |
| `scripts/ios-native.js` | Global regexes over `MARKETING_VERSION`, `CURRENT_PROJECT_VERSION`, Info.plist keys; a codegen sentinel at `ios/build/generated/ios/ReactCodegen/react/renderer/components/rnscreens/States.cpp`; `react-native/scripts/generate-codegen-artifacts.js` | Release scripts regenerate codegen needlessly or fail if the layout moved |
| `plugins/withAndroidLockScreenWidgets.cjs`, `withAndroidWidgetGallery.cjs` | Literals `android:widgetCategory="home_screen"` and `android:initialLayout="@layout/rn_widget"` in XML generated by `react-native-android-widget` | Silently, when that package moves 0.20 → 0.26 |
| `plugins/withAppIntentsExtensionDefine.cjs` | Deep import `@bacons/apple-targets/build/with-bacons-xcode` | Build error if apple-targets 5 moves it |
| `scripts/prebuild-ios.js` | Re-adds trailing newlines to apple-targets `Contents.json` files | Harmless if unneeded |

`scripts/lib/tv-native-project.cjs` detects TV trees by `SDKROOT = appletvos`, `TVOS_DEPLOYMENT_TARGET`, and Leanback manifest entries; re-check after prebuild. Release scripts hardcode Gradle tasks (`:app:bundleRelease`) and output paths; confirm under Gradle 9.4.

### 6.3 Android build tooling

SDK 58 moves to Gradle 9.4.1 and AGP 9.2.1, and its Gradle plugins drop AGP 8 support. The template sets `android.builtInKotlin=false` and `android.newDsl=false` as temporary opt-outs that AGP 10 removes.

| Item | State here | Action |
|---|---|---|
| Local Android modules | `munib-external-commands`, `munib-tajweedformer`, `munib-wear` use `apply plugin: 'kotlin-android'`, `compileSdkVersion` / `targetSdkVersion` in a library `defaultConfig`, `lintOptions`, and `kotlin-stdlib-jdk7` with a `2.0.21` fallback read from `rootProject.ext.kotlinVersion` | Move all three to `expo-module-gradle-plugin`, which supplies SDK levels and Kotlin. Remove the deprecated blocks and the stdlib artifact. The template no longer pins Kotlin, so `rootProject.ext.kotlinVersion` may be unset |
| Fallback SDK levels | 36 in two modules, **35 in `munib-wear`** | Removed by the change above |
| Generated Wear app | `plugins/withWearOs.cjs` writes `android/wear/build.gradle` applying `org.jetbrains.kotlin.android`, with `compileSdk 36`, `targetSdk 36` | Update for AGP 9 and `compileSdk` 37 |
| Namespace clash | The Wear app and `modules/munib-wear` both use `expo.modules.munibwear` | Give the Wear app its own namespace |
| Wear app release | `android-release.js` runs only `:app:bundleRelease` | Ships per D7; see 6.7 |
| `ndkVersion` | Pinned to `27.1.12297006` through `expo-build-properties`; 58 enforces `ndkVersion` for library projects | Try removing the pin first. Keep it only if ONNX or the tajweedformer AAR needs it |
| R8 | Already on with the `-optimize` file. `android.r8.optimizedResourceShrinking=true` is set by `native-script-utils.cjs` with an "AGP 8.12" comment | Check that property under AGP 9. Re-test `getIdentifier` lookups in `AndroidWidgetPreviewPublisher.kt` and `OngoingSalahNotification.kt`, which are safe only while the resources are referenced elsewhere |
| Windows Gradle limits | `-Xmx3072m`, `parallel=false`, `workers.max=2` in `native-script-utils.cjs` | May be too tight for AGP 9 with Kotlin 2.2. Raise if builds run out of memory |
| `buildFromSource` | `expo-file-system`, `expo-image-picker` | Keep while their patches remain; add `expo-location` if its Kotlin patch is kept. `expo-modules-core` itself is prebuilt |
| Debug permission | `expo` requests `ACCESS_LOCAL_NETWORK` in debug builds on Android 17 | Expected prompt; no action |
| `predictiveBackGestureEnabled` | `false`. `targetSdk` stays 36 in SDK 58 | Leave. Enabling it is a separate task |
| `with-android-tab-drawables.js` | Copies vector drawables for native tabs | Re-test against screens 4.30 |

### 6.4 Local Expo modules: `expo-modules-core` API

| Change in 58 | State here |
|---|---|
| Android: `AppContext.hostingRuntimeContext` and `AppContext.errorManager` removed; `ArrayBuffer` is a concrete class | Not used. Modules use `appContext.reactContext`, which remains |
| iOS: `EXUtilities.screenScale` removed | Not used |
| iOS: `JavaScriptValue` is non-copyable and cannot be a `Function` argument or result | Not used |
| iOS: `Exception.message` is overridable; subclasses that declare `message` must mark it `override` | `MunibTajweedformerModule.swift:6-18` subclasses `Exception` and overrides `code` and `reason`. Compile-check |
| iOS: `OnStartObserving` / `OnStopObserving` (and `OnCreate` / `OnDestroy`) are deprecated for `didStartListening` / `didStopListening` / `didCreate` / `willDestroy` | `MunibLiveActivityModule.swift` uses `OnStartObserving` / `OnStopObserving`. Migrate |
| `@ExpoModule`-annotated iOS classes auto-register | Optional. No action |

Also:

- **Deployment targets.** Minimum iOS is 16.4. `MunibTajweedformer.podspec` declares `15.1` with a comment naming SDK 57; raise it and fix the comment. The other two declare 16.2; raise to 16.4.
- **Swift version.** No podspec sets `swift_version`. Set it explicitly so a toolchain default change cannot move the modules to Swift 6 language mode.
- **Swift 6 readiness.** `MunibLiveActivityModule.swift` has a non-Sendable singleton with mutable state touched from `Task`s. `MunibAppIntents.swift` (compiled into the main app) and `targets/_shared/WidgetDesign.swift` use mutable `static var` for intent metadata; change these to `static let`.
- `MunibTajweedformer` uses React Native's `spm_dependency` and raises if it is missing. Verify with prebuilt React Native and `expo-modules-core`.
- `PrayerActivityAttributes.swift` exists in two places that must stay identical.

### 6.5 Apple targets

| Target | Type | Deployment target |
|---|---|---|
| `munib-tracker-widgets` | `widget` | iOS 17.0 |
| `munib-tracker-intents` | `app-intent` | iOS 17.0 |
| `munib-tracker-watch` | `watch` | watchOS 10.0 |
| `munib-tracker-watch-widgets` | `watch-widget` | watchOS 10.0 |

- `@bacons/apple-targets` 4 → 5 has no published release notes. Diff the two npm tarballs, paying attention to `build/with-bacons-xcode` (deep-imported by `withAppIntentsExtensionDefine.cjs`), the Podfile loader, and the hardcoded `SWIFT_VERSION: "5.0"`. Its README requires CocoaPods 1.16.2.
- That plugin must stay ahead of `@bacons/apple-targets` in the plugin order.
- The `appExtensions` block in `app.json` must still match the four targets.
- Confirm Xcode 27 still accepts watchOS 10.0 and iOS 17.0 as minimums.
- `openAppWhenRun` and the `WCSession` complication calls are older APIs; note any deprecation warnings from the iOS 27 SDK.

### 6.6 TV

TV is a release gate (D5): anything that breaks on TV is fixed in this upgrade, not skipped.

- `react-native-tvos@0.88.1-0` with `@react-native-tvos/config-tv@0.1.7`. Its `TVOS_DEPLOYMENT_TARGET` default is 15.1; check it against the SDK 58 minimum.
- **Exclusion lists have drifted.** `withTvExpoModuleExcludes.cjs` lists 5 Expo modules; `TV_EXCLUDED` in `react-native.config.js` lists 19. On Android, `react-native.config.js` does not stop Expo modules from linking, so `munib-wear` (an exported `WearableListenerService`) and `munib-external-commands` link into Android TV builds. Derive both lists from one source and add those two modules.
- In 58, autolinking respects explicit per-platform `null` overrides in `react-native.config.js` and skips pods without a tvOS platform. Some of the custom exclusion code may now be unnecessary; test before deleting.
- Add `expo-hinge` to the exclusions and TV stubs.
- The 19 stubs in `src/lib/tv-stubs/` mirror real module APIs. Update the ones whose APIs change: `expo-notifications`, `expo-location`, `expo-speech-recognition`, `react-native-pager-view`, `react-native-webview`. The `expo-symbols` tvOS shim also needs a check, since the package went stable.
- Run clean TV prebuilds for both platforms and re-measure cold-start memory on the 1 GB Leanback AVD.

### 6.7 Wear OS (D7)

The tile is listed as shipped (NF-2.14) and appears in the Android store copy, but `android-release.js` builds only `:app`. Make it a real release artefact:

1. Fix the generated module for AGP 9 and `compileSdk` 37, with its own namespace (6.3).
2. The Wearable Data Layer pairs only apps with the **same application ID and signing key** as the phone app. Confirm `withWearOs.cjs` sets `applicationId "app.munibtracker"`, and extend `withAndroidReleaseSigning.cjs` to sign `:wear` with the release keystore.
3. Give it its own version code, `EXPO_WEAR_VERSION_CODE` in `.env` (10.1), read by the generated `build.gradle` instead of the hardcoded `1`.
4. Add a `--wear` flag to `android-release.js` (building `:wear:bundleRelease`) and to `android-upload.js` (Play **Wear OS** track), mirroring `--tv`. Add root `release:app:wear` scripts and list them in `AGENTS.md`.
5. Keep the Wear module out of TV builds (6.6).
6. Play Console: enable the Wear OS form factor and add Wear screenshots. The screenshot config has no Wear OS device yet; add one.
7. QA on a Wear OS emulator paired with the phone emulator: the tile shows the next Salah, and a tap marks it on the phone.

## 7. iPhone Duo support

Per D6, everything in this section ships with the SDK 58 release.

Verified facts: on iPhone Duo, iOS moves most bars and controls into a **vertical rail on the left or right edge**; apps must respond to window-size changes when folded or in split view on the inner display; `expo-hinge` reports hinge angle and status on iOS 27.1+ and Android 11+ foldables; Apple recommends hinge state for interactions and effects, **not** layout; `ArrangementView` (iOS and tvOS 27.1+) arranges a primary and a secondary view side by side or overlaid.

Not verified: the Duo's point dimensions for either display. Measure them in the Device Hub simulator before choosing breakpoints.

### 7.1 Principles

1. **Layout follows window width, effects follow the hinge.** `use-large-screen-layout.ts` already drives chrome from `useWindowDimensions()` (`SIDE_RAIL_BREAKPOINT` 768, `LIST_DETAIL_BREAKPOINT` 900). Keep that as the single layout source. Never branch on device model.
2. **Folding and unfolding must not lose state.** The window resizes in place: no remount, no scroll reset, no audio interruption.
3. **One navigation chrome at a time.** The system rail and the custom side rail must never both show.
4. **Android foldables get the same treatment** through the same code.

### 7.2 APIs to build on

| API | Use |
|---|---|
| `NativeTabs` `preferredPlacement` (sidebar or tab bar), 58.0.26 | Let the system place the tab rail on Duo-class windows |
| `NativeTabs.Trigger` `prominent` (iOS 27+) | Optional emphasis for the primary tab |
| `useVerticalBarEdgeIOS()`, `verticalBarBehaviorIOS`, `StatusBar.setVerticalBarBehaviorIOS()` from `expo-status-bar` | Know which edge holds the rail; control it on immersive screens such as the Qur'an reader |
| `react-native-safe-area-context` 5.11 `left` / `right` insets | Keep content clear of the rail |
| `expo-hinge`: `useHinge()`, `getHinge()`, `isAvailable()`, `addHingeListener()`; `useAnimatedHinge()` from `expo-hinge/reanimated` | Hinge-driven effects. `Hinge = { angle, status }`, angle in degrees (0 closed, 180 flat), status `closed` / `partiallyOpen` / `fullyOpen` / `unknown`. Returns `null` without a hinge or below the OS minimum; `isAvailable()` is always false on web |
| `ArrangementView` with `arrangementViewStyle('split' \| 'overlay')`, `splitArrangementLayoutSize`, `overlayArrangementEdge` | Native two-pane container. Below iOS 27.1 the children render with no container |

### 7.3 Foundation work

| Task | Detail |
|---|---|
| Measure | Record outer and inner window sizes (portrait, landscape, split view) and insets on the Duo simulator. Add them to [`DEVICES.md`](./DEVICES.md) |
| Breakpoints | Decide from the measurements where the inner display falls. If it lands just under 768, add a named `foldable` tier rather than lowering the tablet values |
| Navigation chrome | `app-tabs.tsx` switches to the custom `WideAppTabs` rail at 768. On Duo-class iOS 27 windows keep `NativeTabs` with sidebar placement; keep `WideAppTabs` for iPad, Android tablets, and TV. Verify `minimizeBehavior` and the four `disableAutomaticContentInsets` triggers against a vertical rail, because `useContentBottomInset()` assumes a bottom bar |
| Horizontal insets | Apply `left` / `right` insets in `screen-layout.tsx` and every full-bleed surface (hero, mini-player, sheets, toasts, reading toolbar). Audit the 20 inset call sites for code that reads only `top` and `bottom` |
| RTL | The rail edge and insets must be right in `ar`, `ur`, `fa`, `ps`, `ku`. Logical style props only |
| Resizable windows | iOS 27 makes iPhone apps resizable; `requireFullScreen` and orientation locks are unreliable. `orientation: "default"` and `supportsTablet: true` are already correct. Audit the 72 files using `useWindowDimensions` for values cached in refs, module scope, or `useMemo([])`, and the three `measureInWindow` callers (mini-player, practice word row, tasbeeh dock) for stale coordinates after a resize |
| Continuity | Fold and unfold on each key screen and check scroll position, Qur'an page and ayah, tasbeeh count, playback, open sheets, input focus, in-progress forms |
| Hinge module | `npx expo install expo-hinge` (no config plugin; needs a native rebuild). Wrap it in `src/lib/platform/hinge.ts` exposing `useHingePosture()`, returning `null` when unavailable. Normalise Android, which never reports `closed` and reports `unknown` when the window does not span the fold; use an angle threshold there |

### 7.4 Screen-level UX

| Screen | Unfolded | Half-open |
|---|---|---|
| Home | Hero and prayer times in one column, daily cards in the other | — |
| Qur'an reader | Two-page mushaf spread with the gutter on the fold. Translation mode: Arabic and translation side by side. Hide the vertical bar in reading fullscreen | Page above the fold, playback and navigation below |
| Hadith, Dua, Zikr, Learn | List–detail using the existing `isListDetail` layouts | — |
| Tasbeeh | Counter beside history and targets | Count on the upper half, full-width tap surface on the lower half |
| Qibla | Compass beside location and accuracy details | No hinge layout while the compass is active. Folding changes how the device is held, so re-check heading accuracy in each posture |
| Tracker and statistics | Day checklist beside the weekly chart | — |
| Sheets and modals | Keep the 640 width cap; centre them and avoid straddling the fold. Pickers, share sheets, and document pickers now anchor as popovers on regular-width displays; check each | — |
| Onboarding and login | Centre with a max width | — |

Half-open layouts are driven by window size, with `ArrangementView` where a native container fits. The hinge angle drives only transitions and effects, for example a parallax on the home hero. Respect reduced motion through `use-hydration-safe-reduced-motion`.

Start `ArrangementView` on one screen (tasbeeh) and extend only if it beats the flex layout on the device. The React Native flex layout stays the default path.

All new strings go through `en.json` and the pipeline in [`I18N_GUIDE.md`](./I18N_GUIDE.md). All colours come from `useTheme()`.

### 7.5 Store and test assets

- Add Duo captures to `@munib-tracker/store-screenshots` and the Maestro flows once App Store Connect publishes the required sizes. See [`STORE_ASSETS.md`](./STORE_ASSETS.md).
- `scripts/screenshots/lib/config.mjs` hardcodes `iPhone 17 Pro`, `Pixel_7_Pro_API_34`, `Apple Watch Ultra 3 (49mm)`, and `Apple TV 4K (3rd generation)`. Xcode 27's Device Hub replaces Simulator.app; confirm the capture scripts still find and boot these devices, and add the Duo.

## 8. New features to adopt

| Feature | Decision | Notes |
|---|---|---|
| Stable native tabs; `preferredPlacement`; `useCanGoBack()` | **Adopt** | Sections 5.5 and 7 |
| Screen error boundaries | **Adopt** | `unstable_settings.screenErrorBoundary` on the root stack, wired to `ErrorFallback` and Sentry, so one failing screen does not take down the app |
| `activityEnabled` / `NavigationAwareActivity` | **Trial (D4)** | 8.2 |
| `expo-notifications` `delivery: 'alarmClock'`, with `getExactAlarmPermissionsAsync` / `requestExactAlarmPermissionsAsync` | **Adopt, opt-in (D8)** | 8.1. Also adopt `threadIdentifier` grouping (now on Android) and `largeIcon` |
| `expo-audio` playlists on the lock screen; `seekForwardIntervalSeconds` / `seekBackwardIntervalSeconds`; public `AudioStream` | **Adopt** | Replaces custom queue code in `audio-lock-screen.ts` and the private-API capture path |
| `File.digest()`, `File.preview()` | **Adopt** | Section 5.7. `preview()` may replace code in `open-attachment-externally.ts` and `pdf-preview-source.ts` |
| `expo-image` `transition.skipOnCacheHit`, `svgVariables` | **Adopt** | Removes fade flicker on cached images |
| `expo-font` variable fonts; RN `fontVariationSettings` | **Trial (D4)** | 8.2 |
| `expo-location/next`; iOS temporary full accuracy | **Trial (D4)** | 8.2 |
| `expo-secure-store` `requireConfirmation` (Android) | **Trial (D4)** | 8.2 |
| Live Activity `staleDate` | **Adopt** | The Live Activity is a custom module; add an equivalent so an expired countdown greys out |
| `LocaleProvider` | **Trial (D4)** | 8.2 |
| Granular web bundle splitting; Noxcturnal transformer | **Trial (D4)** | 8.2 |
| `expo-device-hub` | **Adopt (dev only)** | Dev tools plugin for Xcode 27 |
| `expo-widgets`, `expo-app-intents` | **Defer** | Widgets and intents work through native targets today. `expo-app-intents` is alpha |
| `expo-observe`, PostHog, Expo Modules 2.0 annotations, SwiftPM | **Skip** | Sentry covers monitoring; Modules 2.0 is beta; SwiftPM is not production-ready and CocoaPods remains the default |

### 8.1 Precise Adhan timing (D8)

- **Setting.** Settings → Notifications → "Precise Adhan timing". Android only and off by default; hidden on iOS, web, and TV.
- **Turning it on.** Call `getExactAlarmPermissionsAsync()`. If it is not granted, explain why, then call `requestExactAlarmPermissionsAsync()`. If the user declines, leave the setting off.
- **When on.** Adhan `DATE` and `DAILY` triggers use `delivery: 'alarmClock'`; other reminders keep the current scheduling. Android shows an alarm icon in the status bar for alarm-clock alarms, so say so in the setting's description.
- **Revocation.** Re-check the permission when the app returns to the foreground. If it was revoked in system settings, fall back to normal scheduling and turn the setting off.
- **Store.** Confirm which permission `expo-notifications` adds to the manifest (`SCHEDULE_EXACT_ALARM` or `USE_EXACT_ALARM`), and complete the Play Console exact-alarm declaration before upload.
- **Plumbing.** New strings in `en.json` with `ur` and `ar` (I18N rules: Adhan, Salah). Store the flag in the preferences store. Add the two new functions to the `expo-notifications` TV stub and Jest mock.
- **Tests.** Scheduler unit tests for both modes. Manual check under forced Doze (`adb shell dumpsys deviceidle force-idle`).

### 8.2 Experiment trials (D4)

Each trial runs on its own branch or behind a flag, measured against the phase 0 baseline. Keep it only if it meets its bar; otherwise drop it and record the result here.

| Feature | Keep if |
|---|---|
| `LocaleProvider` | Switching `ar` ↔ `en` flips navigation direction without a reload on iOS, Android, web, and TV |
| Granular web bundle splitting | First-load JS on `/` and `/quran` drops, with no extra request waterfall on route change |
| Noxcturnal transformer | It actually activates alongside the Sentry Metro wrapper and React Compiler, cold bundling is faster, and web export plus Jest still pass |
| `activityEnabled` / `NavigationAwareActivity` | Memory on the 1 GB TV AVD drops, and tab state is preserved |
| `expo-location/next` | It covers what the `expo-location` patch does, so the patch can be deleted |
| Variable fonts | Smaller font payload with identical rendering of Arabic, Bengali, and Devanagari samples |
| `expo-secure-store` `requireConfirmation` | App Lock still works on Android devices with and without biometrics |

## 9. Verification

### 9.1 Local release gates (D11)

CI stays as it is: lint, typecheck, tests, `turbo build`, and OpenAPI drift on Ubuntu, also run by the pre-push hook. It does not export the web app, run prebuild, or compile native code, so these gates run locally before each phase merges:

```bash
pnpm build:app:web             # then inspect <head> on 5 sample pages
pnpm cleanbuild:app:android    # config plugins + phone native project
pnpm cleanbuild:app:ios
pnpm cleanbuild:app:tv
```

Then compile: Android release builds for phone, TV, and Wear, and iOS and tvOS archives on the Mac.

These guards are code, not CI jobs, and go in during phase 0 so `pnpm check:ci` still catches them:

1. Fatal typed-routes generation in `ensure-expo-env.mjs`, so `check-types` fails when routes can't be generated.
2. Build-time assertions for the two Metro aliases (5.1).
3. A Jest test that every route in the SEO registry exports `generateMetadata` (5.2).

Accepted risk: a regression in web export, a config-plugin anchor, or native compilation is caught only when someone runs these gates.

### 9.2 Automated, every phase

```bash
pnpm check:ci
pnpm --filter app test -- i18n
pnpm --filter app test -- search
pnpm doctor:app
```

### 9.3 Manual matrix

Record results in the PR.

| Target | Checks |
|---|---|
| iOS 27 iPhone | Cold start, onboarding redirects, four tabs, background Qur'an audio and interruptions, notifications (foreground, background, terminated), quick actions, deep links, OAuth ×3, widgets, Live Activity, intents, Watch sync, App Lock, share sheet, attachments, RTL (`ar`, `ur`) |
| iOS 26 and iOS 16.4 | Same smoke set. Hinge and `ArrangementView` code degrade to nothing |
| iPhone Duo simulator | Section 7: folded, unfolded, half-open, split view, both orientations, RTL |
| iPad | Rail, list–detail, resizable window, Stage Manager, popover anchoring |
| Android phone, release build with R8 | Same smoke set plus widgets, lock-screen widgets, widget gallery previews, ongoing notification, Wear, recitation practice (ONNX), tajweedformer, App Actions |
| Android foldable emulator | Hinge wrapper, fold/unfold continuity |
| Android TV and Apple TV | Cold start, D-pad navigation and Back ladder, pairing, playback, memory on the 1 GB AVD, no phone-only permissions in the manifest |
| Web | Export; `<head>` on five routes against the baseline; Lighthouse SEO; PWA install on iOS Safari (safe areas); service worker and offline audio; web push; share-card capture; rail at 768 and above; bundle sizes against [`PROFILING.md`](./PROFILING.md) |

Compare cold start, AAB size, and web bundle size with the baseline. Investigate any regression above 10%.

## 10. Rollout and rollback

1. Merge phases 1–4 to `develop`, then run EAS `preview` builds for phone and TV on both platforms.
2. TestFlight and Play internal testing for at least one week. Watch Sentry for scene life cycle, navigation, and R8 errors.
3. Deploy web to a Vercel preview first. Confirm crawled HTML with a URL inspection before promoting.
4. Production order: web, Android staged rollout, iOS phased release, TV.
5. Rollback: there are no OTA updates, so rollback means halting the staged rollout and shipping the previous build from the `pre-sdk-58` tag, with new version codes. AsyncStorage moves to 3.x (D2), so a downgrade is data-safe only if the downgrade test in 4.2 passed. If it did not, rollback is not an option and problems are fixed forward. Do not make any other storage-format change in this release.

### 10.1 Version codes (D9)

Local `.env` is the single source of truth.

- Set `eas.json` `cli.appVersionSource` to `"local"` and remove `autoIncrement` from the `production` profile, so EAS uses the codes `app.config.js` reads from `.env`.
- Delete `versionCode: 570010201` from `app.json`; it is never used. The Release Please `expo` release type rewrites `app.json`; check whether it writes `versionCode` back, and if so configure it not to.
- **Before the first SDK 58 upload**, look up the highest code already in Play Console for phone, TV, and Wear (EAS may have incremented past `.env`'s `22`), and set `EXPO_ANDROID_VERSION_CODE`, `EXPO_ANDROID_TV_VERSION_CODE`, and the new `EXPO_WEAR_VERSION_CODE` above them. Do the same for iOS and tvOS build numbers in App Store Connect. Play rejects a reused or lower code.
- In `scripts/lib/platform-versions.cjs`, make the fallback `"1"` an error for release builds, so a missing variable fails locally instead of at upload.
- Document the bump procedure in [`RELEASES.md`](./RELEASES.md) and add the new variable to `.env.example`.

## 11. Documentation to update

- [`AGENTS.md`](../AGENTS.md) and the root `README.md`: Expo SDK 57 → 58.
- [`apps/app/AGENTS.md`](../apps/app/AGENTS.md) and `apps/app/README.md`: docs link `v57.0.0` → `v58.0.0`; `react-native-tvos@0.86.0-2` → `0.88.1-0`.
- [`TV.md`](./TV.md), [`DEVICES.md`](./DEVICES.md) (add iPhone Duo and measurements), [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md) (scene life cycle), [`PROFILING.md`](./PROFILING.md) (new baselines), [`STORE_ASSETS.md`](./STORE_ASSETS.md) (Duo sizes), [`PRODUCTION.md`](./PRODUCTION.md) (Node and EAS versions), [`DATA_INGESTION.md`](./DATA_INGESTION.md), [`OPEN_SOURCE.md`](./OPEN_SOURCE.md), [`README.md`](./README.md).
- Code comments naming SDK 57 or RN 0.86: `jest.setup.ts:185`, `plugins/with-android-build-hygiene.js:60`, `src/lib/gradient.ts:6`, `src/lib/request-idle-callback-polyfill.ts:2`, `MunibTajweedformer.podspec`.
- Agent skills: update `expo/skills`, including `expo-upgrade`.

## 12. Open questions

| # | Question | Needed by |
|---|---|---|
| 1 | Does `expo-router/vendor/react-helmet-async` still exist in 58, and what does static export emit for `<Seo>` unchanged? | Phase 3 |
| 2 | Do the `Gesture.*` builders still exist in gesture-handler 3.3? | Phase 3 |
| 3 | Were the `expo-location` Kotlin patch and the `react-native-tvos` patch ever effective, and what were they for? | Phase 2 |
| 4 | The SDK 58 version table lists "React Native TV 0.87-stable", while `react-native-tvos@0.88.1-0` is published. Phone and TV share one React Native package, so the plan uses 0.88.1-0 and fixes TV against it (D5). Confirm with a clean TV prebuild early in phase 2 | Phase 2 |
| 5 | Does `expo-quick-actions@6.0.2` deliver cold-start actions under the scene life cycle? Its README lists 6.1.0 for SDK 57, but npm `latest` is 6.0.2 | Phase 4 |
| 6 | Does `onnxruntime-react-native@1.24.3` build on AGP 9.2.1, Kotlin 2.2, and `compileSdk` 37? | Phase 4 |
| 7 | What changed in `@bacons/apple-targets` 5.0.0? | Phase 4 |
| 8 | Does TypeScript 7 work with `expo/tsconfig.base` and typed routes? | Phase 3 |
| 9 | iPhone Duo window sizes and insets; which breakpoint tier the inner display lands in | Phase 5 |
| 10 | Which exact-alarm permission does `expo-notifications` add, and what does Play Console require for it? | Phase 6 |
| 11 | Does AsyncStorage 3 read 2.2 data unchanged, and can 2.2 read data written by 3? | Phase 2 |
| 12 | Do the Vercel and EAS build images offer Node 26? | Phase 0 |
| 13 | What is the highest version code and build number already in each store? | Phase 7 |

All open questions are facts to establish during the work. The decisions are in section 0.

## 13. Review record

Second review, 2026-11-17. The first version was checked against the sources listed at the top and three codebase audits (app source and CI; plugins, modules, targets, and scripts; dependency manifests).

Corrections to the first version:

- Xcode: SDK 58 needs 26.4+, not 27.1. Xcode 27.1 is required only for the iOS 27 SDK features and iPhone Duo.
- `targetSdk` stays 36; only `compileSdk` moves to 37.
- The custom `SuspenseFallback` is wired through a Metro alias, not a layout export.
- `navigation-theme.ts` deep-imports `expo-router` build paths; the first version said no React Navigation internals were used.
- `presentation: "modal"` is used by one route; two other matches were unrelated component props.
- Strict TypeScript scope is about 100 sites, not 27 files.
- `expo-secure-store` is in use (and undeclared); it was listed as something to evaluate.
- `@sentry/react-native` must go above the SDK pin, to 8.35.0 or later.
- The `versionCode` question is answered: the `57…` value is dead config.
- The `expo-router` patch purpose is known.

Added: internal-API couplings (5.1), CI gaps (9.1), string-patching plugins and scripts (6.2), AGP 9 build tooling (6.3), `expo-modules-core` API changes and Swift readiness (6.4), apple-targets detail (6.5), TV exclusion drift (6.6), per-package behaviour changes (5.7), Jest (5.8), the native tabs and status-bar APIs for iPhone Duo (7.2), and the two patches that likely never applied (4.4).

Third pass, 2026-11-17: the scope decisions D1–D13 were locked with the project owner (section 0). The plan was updated to match: latest versions above Expo's pins with per-package gates (4.1, 4.2), the deprecation sweep (5.9), the Wear OS release (6.7), Precise Adhan (8.1), experiment trials (8.2), local gates instead of CI changes (9.1), and `.env` version codes (10.1).

Limits of this review:

- Nothing was installed or built. Every "verify" item is unconfirmed until the bump runs.
- The Expo monorepo's root changelog has no SDK 58 section yet; per-package changelogs were used instead.
- Release notes were not read for pnpm 12, TypeScript 7, NestJS 12, TypeORM 1, Vitest 5, Zod 4, `i18next` 25–27, `react-i18next` 16–18, `framer-motion` 13–14, `web-push` 4, or Jest 30.
- `@bacons/apple-targets` 5.0.0 and `expo-quick-actions` publish no release notes for the versions involved.
- Usage counts come from text search, not from a typecheck against SDK 58.
