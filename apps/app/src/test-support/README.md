# test-support

Shared Jest utilities for `apps/app`. Excluded from coverage (`jest.config.js`, `codecov.yml`) and from `tsc` (like test files).
Import each module **by path** — there is deliberately no barrel, so a lib test that needs `mockFetch` doesn't load the provider tree.

**Before writing a helper, mock or data literal, search this folder.** Anything a second test file needs belongs here.

## Rendering & environment

| Module                                     | Use it for                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `render`                                   | `renderWithTheme(ui)` (default for components), `renderHookWithTheme(hook)`, `renderWithProviders(ui)` (full app providers — feature tests only), `ThemeWrapper`                                                                                                                                                                                                                                                                                            |
| `platform`                                 | `usePlatform({ OS: "web", isTV: true })` per `describe`, or `setPlatform(...)` → restore fn. Also patches `Platform.select` and `isTV()` — never assign `Platform.OS` or mock `@/lib/platform/is-tv`. `loadOnPlatform(overrides, () => require("./mod"))` for modules that read `Platform.OS` at import time. `const onPlatform = usePlatformSwitch()` when each `it` picks (or changes) its own platform — don't mix with `usePlatform` in one `describe`. |
| `isolate`                                  | `isolateWithSharedReact(() => require("./mod"))` — fresh registry (module-level state) that still shares React with `renderHook`                                                                                                                                                                                                                                                                                                                            |
| `browser`                                  | `useBrowser({ userAgent, standalone, notification, serviceWorker, pushManager })` / `installBrowser(...)`, UA constants, `createMemoryStorage()`                                                                                                                                                                                                                                                                                                            |
| `web-cache`                                | `installWebCache()` / `fakeCacheResponse()` — Cache Storage + blob URLs                                                                                                                                                                                                                                                                                                                                                                                     |
| `fetch`                                    | `mockFetch(fakeResponse(body, { status }), new Error("offline"))` (replies in order, last repeats); `mockFetchByUrl({ "fragment": reply })` for parallel calls                                                                                                                                                                                                                                                                                              |
| `app-state` · `animation-frames` · `async` | `captureAppStateListener()` · `captureAnimationFrames()` · `deferred()` (manually resolved promise)                                                                                                                                                                                                                                                                                                                                                         |
| `reanimated`                               | `captureAnimatedStyles()` (evaluate `useAnimatedStyle` worklets on demand), `installKeyframeStub()`                                                                                                                                                                                                                                                                                                                                                         |
| `fiber` · `queries` · `style` · `dates`    | `pressableProps` / `ancestorProps` · `queryHostsByType/Role` · `flattenStyle` · `firstDateWhere`                                                                                                                                                                                                                                                                                                                                                            |

## State seeding

| Module                     | Use it for                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `store`                    | `resetTrackerStore()` / `loadTrackerStore()` / `seedTrackerStore()` / `restoreTrackerStore()`                 |
| `preferences`              | `await setPreferences({ timeFormat: "24" })` / `resetPreferences()` — always `await` (RNTL 14 `act` is async) |
| `khatm-store` · `pin-lock` | `seedKhatm()` · `pressPinDigits()` / `pressPinBackspace()` / `requestModalClose()`                            |

## Contract suites (one spec, many stores)

| Module                 | Use it for                                                                    |
| ---------------------- | ----------------------------------------------------------------------------- |
| `topic-progress-store` | `describeTopicProgressStore(...)` — the identical Learn topic-progress stores |
| `favorites-store`      | `describeFavoritesBindings(...)` — dua / durood / names favorites             |
| `learn-guide`          | `describeSectionedGuide(...)`, `describeLessonProgress(...)`                  |

## Module mocks (`mocks/*`)

Wire with `jest.mock("<module>", () => require("@/test-support/mocks/<file>").<name>Mock)`; each exports `mock*` handles and a `reset*Mock()` for `beforeEach`.

`expo-router` (`mockRouter`, `setMockSearchParams`, `setMockPathname`, `mockRouterCanDismiss`, `MockRedirect`) · `expo-router-ui` · `sheet` · `auth-provider` · `toast-provider` · `audio-player-provider` · `app-version-provider` · `app-update-actions` · `blur-target-provider` · `glass-surface` · `expo-glass-effect` · `expo-blur` · `expo-audio` · `expo-constants` · `expo-localization` (`setMockDeviceLocales`) · `expo-native-modules` (`installNativeModules`, `loadWithNativeModules`, `loadOnPlatformWithNativeModules`) · `native-file-store` · `safe-secure-store` · `notifications-platform` · `recitation-models` · `api-client` (`mockApiFetch`) · `tanstack-query` (`queryOptionsOf`) · `content-i18n` · `tracker-store` · `use-quran-ayah-range` · `use-window-dimensions` (`setMockWindowSize`) · `web-key-handler` (`pressWebKey`) · `gesture-handler` · `haptics` · `reanimated` (runs worklets eagerly) · `attachment-thumb` · `brand-qr-code` · `guide-topic-footer` · `stub-component`

## Fixtures (`fixtures/<domain>`)

Typed builders — `buildX(overrides: Partial<X> = {}): X` — typed with the app's real types:
app-version · audio · auth · continue · daily-summary · hadith · in-app-notifications · jannah · khatm · learn-guide · location · notifications · prayer · preferences · qaza · quran · quran-companion · salah-phase · weather · widgets · zakat · zikr

## Conventions

- **Fixtures:** one file per domain. Builders return a valid default and accept overrides.
- **Mocks:** a `jest.mock` factory used by 2+ test files belongs in `mocks/<module>`, exported as `<name>Mock`. Single-use mocks stay inline.
- **Shape of a test file:** arrange via one local `setup(overrides)` / `renderX(props)` helper → act → assert behaviour (text, a11y labels, callbacks, state). One behaviour per `it`; `it.each` for input tables. No snapshot or "renders without crashing" tests.
- Reset shared state in `beforeEach` (`reset*Mock`, store resets); restore real timers in `afterEach`.

## Gotchas

- **`jest.setup.ts` preloads** `@/i18n`, `preferences-store`, `safe-secure-store`, `resolve-app-version`, `@/lib/i18n/rtl` and the `static-json-fetch` graph. A per-file `jest.mock()` of _their_ dependencies never takes effect — spy on the real export, or load the subject in `isolateWithSharedReact` / `loadOnPlatform`.
- **Dynamic `import()` works in tests**: `scripts/babel/jest-dynamic-import.cjs` (Babel `env.test` only) rewrites it to `require`, so `jest.mock()` applies to lazily imported modules as well.
- `process.env.EXPO_OS` is inlined by `babel-preset-expo` at transform time (`"ios"` under Jest) — `setPlatform` cannot change branches keyed on it.
