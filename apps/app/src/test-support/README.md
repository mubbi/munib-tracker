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
| `fiber` · `queries` · `style` · `dates`    | `pressableProps` / `ancestorProps` · `queryHostsByType/Role` / `parentOf(node, levels)` · `flattenStyle` · `firstDateWhere`                                                                                                                                                                                                                                                                                                                                 |
| `mock-calls` · `assert`                    | `lastProps(MockedComponent)` / `lastCallArgs(fn)` (throws if never called) · `defined(value, what)` — use these instead of `!` (Biome `noNonNullAssertion`)                                                                                                                                                                                                                                                                                                 |

**Theme tokens.** There is no hand-written theme fixture: `renderWithTheme` / `renderHookWithTheme` mount the real `MunibThemeProvider`, so `useTheme()` / `useThemeTokens()` return the real `computeThemeTokens()` output (`accentOnSoft`, `focusRing`, `status.X.onSoft`, `status.danger.fill` / `.onFill`, `switchTrackOff`, `inputSurfaceError`, `hover`, `scrimStrong`, `onScrim`, …) and new tokens reach every suite automatically. Need dark mode in one suite? Spread the actual hook result (`{ ...actual.useThemeTokens(), tokens: { ...tokens, isDark: true } }`) — never stub a partial tokens object. Outside React, call `computeThemeTokens(resolveTheme(scheme, scheme, accentId), scheme)`.

## State seeding

| Module                     | Use it for                                                                                                                          |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `store`                    | `resetTrackerStore()` / `loadTrackerStore()` / `seedTrackerStore()` / `restoreTrackerStore()`                                       |
| `preferences`              | `await setPreferences({ timeFormat: "24" })` / `resetPreferences()` — always `await` (RNTL 14 `act` is async)                       |
| `storage`                  | `await storedKeysUnder(DB_KEYS.quranEditionCache)` — AsyncStorage keys under a `DB_KEYS` root (assert a cache did / didn't persist) |
| `khatm-store` · `pin-lock` | `seedKhatm()` · `pressPinDigits()` / `pressPinBackspace()` / `requestModalClose()`                                                  |

## Contract suites (one spec, many stores)

| Module                 | Use it for                                                                    |
| ---------------------- | ----------------------------------------------------------------------------- |
| `topic-progress-store` | `describeTopicProgressStore(...)` — the identical Learn topic-progress stores |
| `favorites-store`      | `describeFavoritesBindings(...)` — dua / durood / names favorites             |
| `learn-guide`          | `describeSectionedGuide(...)`, `describeLessonProgress(...)`                  |

## Module mocks (`mocks/*`)

Wire with `jest.mock("<module>", () => require("@/test-support/mocks/<file>").<name>Mock)`; each exports `mock*` handles and a `reset*Mock()` for `beforeEach`.

`expo-router` (`mockRouter`, `setMockSearchParams`, `setMockPathname`, `mockRouterCanDismiss`, `MockRedirect`) · `expo-router-ui` · `sheet` · `auth-provider` · `toast-provider` · `audio-player-provider` · `app-version-provider` · `app-update-actions` · `blur-target-provider` · `glass-surface` · `expo-glass-effect` · `expo-blur` · `expo-audio` (installed globally by `jest.setup.ts` — only mock it yourself to fake playback) · `expo-constants` · `expo-localization` (`setMockDeviceLocales`) · `expo-native-modules` (`installNativeModules`, `loadWithNativeModules`, `loadOnPlatformWithNativeModules`) · `native-file-store` · `safe-secure-store` · `notifications-platform` · `notifications-scheduler` (no-op `rescheduleAll` / `listScheduled`) · `reminder-reschedule` (`requestReminderReschedule`) · `recitation-models` · `api-client` (`mockApiFetch`) · `tanstack-query` (`queryOptionsOf`) · `content-i18n` · `tracker-store` · `use-quran-ayah-range` · `use-window-dimensions` (`setMockWindowSize`) · `web-key-handler` (`pressWebKey`) · `gesture-handler` · `haptics` · `reanimated` (runs worklets eagerly) · `attachment-thumb` · `brand-qr-code` · `guide-topic-footer` · `stub-component` · `vault` / `vault-file-store`

## Fixtures (`fixtures/<domain>`)

Typed builders — `buildX(overrides: Partial<X> = {}): X` — typed with the app's real types:
app-version · audio · auth · continue · daily-summary · hadith · in-app-notifications · jannah · khatm · learn-guide · location · notifications · prayer · preferences · qaza · quran · quran-companion · salah-phase · weather · widgets · zakat · zikr

## Conventions

- **Fixtures:** one file per domain. Builders return a valid default and accept overrides.
- **Mocks:** a `jest.mock` factory used by 2+ test files belongs in `mocks/<module>`, exported as `<name>Mock`. Single-use mocks stay inline.
- **Shape of a test file:** arrange via one local `setup(overrides)` / `renderX(props)` helper → act → assert behaviour (text, a11y labels, callbacks, state). One behaviour per `it`; `it.each` for input tables. No snapshot or "renders without crashing" tests.
- Reset shared state in `beforeEach` (`reset*Mock`, store resets); restore real timers in `afterEach`.

## Gotchas

- **`jest.setup.ts` preloads** `@/i18n` and `@/stores/preferences-store` with their import graphs (`@/db`, `safe-secure-store`, `@/lib/i18n/rtl`, haptics …). A per-file `jest.mock()` of _their_ dependencies never takes effect — spy on the real export, or load the subject in `isolateWithSharedReact` / `loadOnPlatform`.
- **Content caches are warmed lazily**: `@/lib/search`, `zikr`, `knowledge-card`, `hadith-bundled`, `content-loaders` and `run-search-light-with-guides` are wrapped in setup mock factories that return the real module with its bundled corpus injected on first `require`. Suites that never touch content skip that load; your own `jest.mock()` of one of them still wins. Inside `jest.isolateModules` Jest hands back the outer (warmed) instance — `jest.requireActual()` it for a cold copy. Don't rely on a module being loaded "because setup loaded it": mock what the subject imports.
- **No network, ever** (`no-network.ts`, installed by `jest.setup.ts`): the default `global.fetch` rejects with `[no-network] …`, `WebSocket` / `XMLHttpRequest` / `EventSource` throw, Node sockets refuse non-loopback hosts and local DB/cache ports, and any attempt — even one product code swallowed — fails the test that made it, with the first app frame in the message. Mock the boundary (`mockFetch` / `mockFetchByUrl`, `mocks/api-client`, `jest.mock` the loader). `TEST_ALLOW_NETWORK=1` disables it for opt-in local evals only.
- **Dynamic `import()` works in tests**: `scripts/babel/jest-dynamic-import.cjs` (Babel `env.test` only) rewrites it to `require`, so `jest.mock()` applies to lazily imported modules as well.
- `process.env.EXPO_OS` is inlined by `babel-preset-expo` at transform time (`"ios"` under Jest) — `setPlatform` cannot change branches keyed on it.
