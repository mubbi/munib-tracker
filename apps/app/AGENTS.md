# Expo Product App (`apps/app`)

Read the exact versioned docs at https://docs.expo.dev/versions/v58.0.0/ before writing any code.

Stack: Expo `~58.1.0` on `react-native-tvos@0.88.1-0`, React 19.3, TypeScript 6 (`@typescript/typescript6`), Jest 30 + `@testing-library/react-native` 14 (`await render(...)` / `await act(...)`). Node `>=24.15` (`.nvmrc` 24), pnpm 12.

## SDK 58 / RN 0.88 conventions

- **Dev server heap:** `dev`, `web`, `start:*` and `build:web` run Expo CLI via `scripts/metro-node-heap.cjs` (`--max-old-space-size=6144`, override `METRO_NODE_HEAP_MB`). Add new Metro/export scripts through the wrapper, not bare `expo start`/`expo export`.
- **File system:** class-based `expo-file-system` (`File` / `Directory` / `Paths`) only — no `expo-file-system/legacy`. Use `src/lib/native-file-store.ts` (`documentDirectoryUri()`, `cacheDirectoryUri()`, `downloadToUri()`) so on-disk paths stay compatible with caches written by older builds.
- **Idle work:** `InteractionManager` is gone — defer heavy work with `runWhenIdle()` (`src/lib/run-when-idle.ts`).
- **Safe area:** use `useAppSafeAreaInsets()` (`src/hooks/use-app-safe-area-insets.ts`; web reads CSS `env(safe-area-inset-*)`), not `useSafeAreaInsets` directly.
- **Errors:** `app-stack.tsx` / `app-tabs.tsx` pass `unstable_screenErrorBoundary={ScreenErrorBoundary}` (`src/components/navigation/screen-error-boundary.tsx`) — one failing screen gets a retry, not the global fallback.
- **Web `<head>`:** every route file exports `generateMetadata = routeMetadata("<route template>")` (`src/lib/seo/route-metadata.ts`, data in `src/config/seo-routes.data.json`); `<Head>` tags no longer reach the static export. New routes must add it.
- **Foldables:** `useHingePosture()` (`src/lib/platform/hinge.ts`, `expo-hinge`, stubbed on TV) drives interactions only (e.g. tabletop tasbeeh); layout still follows window size.
- **Remote JSON / fonts:** fetch CDN scripture via `src/lib/static-json-fetch.ts` — jsDelivr `gh/` URLs auto-retry on `raw.githubusercontent.com` (`qcf-font-cache.ts` uses the same mirror list for Qur'an page fonts); failures report through `report-oss-content-download-failure.ts` (connectivity errors stay out of Sentry). Never add a single-host CDN fetch.
- **iOS ONNX:** `plugins/withOnnxruntimeSymbolIsolation.cjs` runs `scripts/isolate-onnxruntime-symbol.cjs` after `pod install` so `onnxruntime-react-native` and the TajweedFormer shim don't share `OrtGetApiBase` (pnpm patch `patches/onnxruntime-react-native@1.24.3.patch`). Keep both if you touch ORT versions.
- **iOS QuranLabCore:** TajweedFormer SDK 4 ships a dynamic `QuranLabCore.xcframework` that React Native's `spm_dependency` links but never embeds — `modules/munib-tajweedformer/app.plugin.js` adds an "Embed Quran Lab Frameworks" phase to the app target. Without it every launch dies in dyld ("Library not loaded: @rpath/QuranLabCore.framework"). Check `MunibTracker.app/Frameworks/` after any SDK bump.
- **iOS watch privacy manifest:** `plugins/withWatchPrivacyManifestDedup.cjs` stops RN's CocoaPods privacy aggregation from also copying the app's `PrivacyInfo.xcprivacy` into the watchOS app (duplicate-output archive failure).

### Web (React Native Web) pitfalls

- `role="button"` / every pressable renders as a real `<button>` — never nest a pressable inside another (invalid HTML, broken clicks). Draw the inner action as a sibling or overlay.
- RN Web rejects the Yoga `direction` style — use `writingDirection` (mapped to CSS `direction`).
- `BackHandler` is native/TV only (no-op on web); web Escape/back keys go through `useWebScreenKeyHandler` (`src/hooks/use-web-key-handler.ts`).

### Expo internals we depend on (re-check on every SDK bump)

None of these are public APIs; most fail silently when Expo moves a file.

- `metro.config.js` aliases `expo-router` `build/views/SuspenseFallback.js` and `expo-notifications` `build/PushTokenManager.js` (web shim) — `assertInternalAliasTarget()` throws at Metro start-up if either moves.
- `src/lib/navigation-theme.ts` deep-imports `DarkTheme` / `DefaultTheme` from `expo-router/build/react-navigation/...` (build error if moved).
- `scripts/ensure-expo-env.mjs` (run by `check-types`) generates typed routes via `expo-router/internal/testing`, `@expo/router-server/build/typed-routes/generate` and `expo-router/_ctx-shared`.
- `scripts/prepare-web-export-env.cjs` + `scripts/patch-web-export-app-manifest.cjs` mirror `babel-preset-expo` manifest handling for the web export — re-validate against a fresh `build:web`.

## Apple TV / Android TV

Full product app on TV via `react-native-tvos` (`npm:react-native-tvos@0.88.1-0`) and `@react-native-tvos/config-tv`. Set `EXPO_TV=1` for TV prebuild; omit phone-only plugins (widgets, Watch, Wear, App Intents, quick actions). Guide: [`docs/TV.md`](../../docs/TV.md). Use `isTV()` from `src/lib/platform/is-tv.ts` for runtime gates — never crash on unsupported modules.

```
pnpm prebuild:app:tv
pnpm cleanbuild:app:tv:android   # alias
pnpm dev:app:tv:android
pnpm dev:app:tv:ios

# Local release (after TV prebuild)
pnpm release:app:android-tv
pnpm release:app:android-tv:upload
pnpm release:app:tvos              # macOS
pnpm release:app:tvos:upload

# EAS
pnpm build:app:android:tv
pnpm build:app:ios:tv
```

Phone ↔ TV always needs a **clean** prebuild. Release scripts refuse the wrong native tree. Full guide: [`docs/TV.md`](../../docs/TV.md).

## Auth (guest + social)

Guest-first sessions with optional Google / Apple / Facebook sign-in for cloud sync. Canonical ops guide: [`docs/OAUTH_SETUP.md`](../../docs/OAUTH_SETUP.md) · App Links: [`docs/DEEP_LINKS.md`](../../docs/DEEP_LINKS.md).

| Platform    | Google                                                 | Apple                                                        | Facebook                                     |
| ----------- | ------------------------------------------------------ | ------------------------------------------------------------ | -------------------------------------------- |
| **iOS**     | On-device PKCE → `POST /auth/google` `{ accessToken }` | Native `expo-apple-authentication` → `POST /auth/apple`      | PKCE → `POST /auth/oauth/facebook`           |
| **Android** | Same as iOS                                            | Services ID PKCE → HTTPS App Link → `POST /auth/apple/oauth` | Same as iOS                                  |
| **Web**     | PKCE → `POST /auth/google/oauth` (HttpOnly cookies)    | Apple `form_post` via API callback → cookies                 | PKCE → `POST /auth/oauth/facebook` (cookies) |

Key files: `src/hooks/use-social-auth.ts`, `src/lib/auth/oauth-config.ts`, `src/lib/auth/appleAuth.ios.ts`, `src/providers/auth-provider.tsx`, `src/auth/session-store.ts`. Social buttons only render when the matching `EXPO_PUBLIC_*` client env is set.

## Admin broadcasts (product side)

Ops announcements arrive as in-app notifications with kind **`admin_announcement`**. Client: `src/lib/notifications-api.ts` (push-token `PUT` + inbox sync against `/api/v1/notifications/*`). Contracts and limits: `@munib-tracker/shared/admin-broadcasts`. Ops console docs: [`docs/ADMIN_BROADCASTS.md`](../../docs/ADMIN_BROADCASTS.md) (do not build admin UI in this app).

## Live Activity (iOS) + ongoing notification (Android)

Widget snapshot sync drives `src/lib/live-activity/` (start/update/end, phase schedule, ActivityKit token registration). Native surfaces overview: [`docs/NATIVE_SURFACES.md`](../../docs/NATIVE_SURFACES.md). Remote push ops (API APNs, QStash, cron, future Fly worker): [`docs/LIVE_ACTIVITY_PUSH.md`](../../docs/LIVE_ACTIVITY_PUSH.md). Web + Android Expo surface phases: [`docs/WEB_PUSH.md`](../../docs/WEB_PUSH.md).

## Settings registry

Every user-facing persisted option is declared once in `src/lib/settings/` — one def file per group in `defs/` (list its persisted `fields`), group/sub-screen metadata in `groups.ts` (e.g. the notification sub-screens are `subgroups` there). Hub, search, deep links, reset and TV/web filtering all read the registry. Read and write through `useSetting(id)` (or the `lib/settings` shortcut helpers) — screens and components must not call store setters directly. Enforced by `single-write.test.ts` and `registry.coverage.test.ts` (every preference field is owned by a def or listed in `internal-fields.ts`).

## Private data (E2E vault)

- Encrypted per-feature documents live in `src/lib/vault` — feature code imports only the barrel and uses `createVaultStore<T>(docId)`. The server stores ciphertext only (`apps/api/src/sync/dto/vault-payload.validator.ts`); a new doc = a `DB_KEYS.vault*` key, a row in `vault-docs.ts`, and `vault_<id>` in the API's `SYNC_ENTITIES` + `VAULT_DOC_ENTITIES`.
- **D46 private mirrors** (`src/lib/private-sync/`): private data that keeps a plaintext local store (excused periods, khushu) syncs **only** through a vault document — never add it to plaintext sync. Register new mirrors in `PRIVATE_VAULT_MIRRORS`.

## Tests

Jest 30 + RNTL 14. Shared helpers, mocks and fixtures live in `src/test-support/` (read its `README.md` before writing a helper). `jest.setup.ts` installs a network guard (`src/test-support/no-network.ts`): any real `fetch`/socket fails the test, so mock the boundary (`mockFetch` / `mockFetchByUrl`, the `api-client` mock, or `jest.mock` the loader).

## Internationalization & Islamic terminology (READ BEFORE ADDING ANY SCREEN, COMPONENT, OR CONTENT)

The app ships **24 locales** (`en` + 23 translations). Phase 1 (`en`, `ar`, `ur`) is human-reviewed; Phase 2–5 have key parity with English. Full guide: [`docs/I18N_GUIDE.md`](../../docs/I18N_GUIDE.md).

Every new feature or content update MUST follow these rules. They are enforced by `src/i18n/i18n-guard.test.ts` and `plural-audit.test.ts` (runs in `pnpm test` / CI). Run locally after any UI or catalog change:

```
pnpm --filter app test -- i18n
```

**1. No hardcoded user-facing strings.** Every visible string — `<Text>` children, titles/eyebrows/subtitles, button labels, placeholders, `accessibilityLabel`/`accessibilityHint`, `Alert`/toast/notification text, empty states, validation messages — comes from `t("namespace.key")`. The single source of truth is `src/i18n/en.json`, organized by feature namespace. Author **English first**, then translate every locale: write a one-off `scripts/i18n/<change>-i18n.json` patch (`{ "<locale>": { "dot.path.key": "value" } }`), run `node scripts/i18n/apply-patch-i18n.mjs`, and **delete the patch file in the same change** — the catalogs in `src/i18n/*.json` are the only source of truth, so old patches can never re-apply stale values. For Phase 1, add **Urdu and Arabic** for the same keys. Do NOT hardcode English as a fallback in `t(key, "English default", …)` and skip the key.

**2. Standardized Islamic terminology — use ONLY the left-hand spelling in English source copy** (never the alternatives). The guard rejects the banned spellings:

| Use (canonical)                                          | Never write                                     |
| -------------------------------------------------------- | ----------------------------------------------- |
| **Salah** (the ritual prayer, in labels/stats/reminders) | Prayer/Prayers _as a bare label_, Namaz, Salat* |
| **Zikr** (singular); **Adhkar** (plural)                 | Dhikr                                           |
| **Adhan**                                                | Azan                                            |
| **Qaza**                                                 | Qada, Qadha                                     |
| **Fasting** (English); روزہ / الصيام in ur/ar            | Roza (in English)                               |
| **Tasbeeh**                                              | Tasbih                                          |
| **Dua**                                                  | Du'a                                            |
| **Masjid**                                               | Mosque                                          |
| **rakah** / **rakahs**                                   | rak'ah, rakat, rakats, rakaat                   |
| **Tarawih**                                              | Taraweeh                                        |

_Also: Fajr, Dhuhr, Asr, Maghrib, Isha, Witr, Tahajjud, Sunnah, Nafl, Wudu, Ghusl, Ramadan, Jumu'ah, Qur'an — spelled consistently._ The one nuance: **"Salah"** is for discrete labels; natural "prayer(s)" is allowed _only_ mid-sentence in long educational prose under `prayerInfo.*` (and proper compounds like "Salat al-Wusta"). Everywhere else a bare "Prayer" label must be "Salah".

**3. Translation quality.** Phase 1 (`ar`, `ur`): fully translated UI — no English words left inside (the guard flags 4+-letter Latin except allowlisted proper nouns). Phase 2–5: key parity required, with native labels (no English left in place). Keep the exact same `{{interpolation}}` variables as English. For `ar`, `ru`, `bn`, include all CLDR plural suffixes (`plural-audit.test.ts`). Never leave a value empty. **Religious text bodies** must come from OSS datasets via `src/lib/translation-locale.ts` — never AI-generated in JSON catalogs. When you rewrite English, re-translate Phase 1 `ur`/`ar` too.

**4. RTL.** `ar`, `ur`, `fa`, `ps`, and `ku` are RTL (`RTL_LOCALES` in `src/lib/i18n/rtl-locale.ts`). Layout is flexbox and auto-flips, so: use **logical** style props (`marginStart`/`paddingEnd`/`borderStartWidth`) never physical (`marginLeft`/`left`); for direction-encoding glyphs use the helpers in **`src/lib/rtl.ts`** (`chevronForward`, `chevronBack`, `chevronBackward`, `arrowForward`) — never hardcode `chevron.right`/`arrow.left`. Concept icons (clock, calendar, mosque, moon, qibla turn-arrows) must NOT mirror. `textAlign:"right"` is correct only when paired with `writingDirection:"rtl"` (Arabic content); UI-chrome that must flip uses `I18nManager.isRTL ? "left" : "right"`. Language + layout direction are owned by `changeAppLocale` in `src/i18n/index.ts`, called from `preferences-store` hydration and `setLocale` — never apply RTL from init or a reactive provider effect.

**5. Non-component code** (notifications, widgets, lib) uses the global singleton `import i18n from "@/i18n"` → `i18n.t(...)`, not the `useTranslation` hook.

**6. Scripture vs UI language.** `locale` drives UI catalogs; `translationLocale` drives dua/zikr/Qur'an/hadith meaning. Hadith remote translations: `ur`, `id`, `tr`, `bn`, `fr`, `ru` (`packages/shared/src/i18n/hadith-editions.ts`).

**7. D45 — scripture meaning excerpts.** Learn-content `excerpt` / `translation` fields and catalog keys matched by `isScriptureMeaningCatalogKey()` are English-only (never in overlays or non-`en` catalogs). Render them through `useScriptureMeaning` / `<ScriptureMeaning>` / `ReligiousTextStack quranRef` so a non-English UI gets the dataset Qur'an translation or the labelled English. Details: `docs/I18N_GUIDE.md` → "D45".

If a check's allowlist needs a genuinely new proper noun or Latin-legit key, extend the `LATIN_OK_*` / `BANNED_TERMS` constants at the top of `i18n-guard.test.ts` (with a comment) — don't weaken the check.

## Fuzzy search (Fuse.js)

All search bars and content filtering use **[Fuse.js v7](https://github.com/krisk/Fuse/tree/main/docs)** (`fuse.js@^7.5.0`, full build). Read `.agents/skills/fuse-js/SKILL.md` before implementing or changing search.

### Canonical module

`src/lib/search.ts` — universal offline search across Qur'an, hadith, duas, adhkar, duroods, the 99 names, and Learn guides (single `learn` tab via `search-guides.ts` / `searchLightWithGuides` in `search-with-guides.ts`). Shared Fuse plumbing (`normalize`, `tokenize`, `makeFuse`, `fuseSearch`, `createFuzzyIndex`, defaults) lives in `src/lib/search-fuse.ts` and is re-exported from `search.ts`.

| Export                                                                 | Purpose                                                                                             |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `searchLight()`                                                        | Instant results (all sources except Qur'an ayah full-text)                                          |
| `preloadSearchCorpora()`                                               | Warm dua/zikr/names/duroods async chunks (call from search screens on mount)                        |
| `ensureAyahFuse()` / `searchQuranAyahs()`                              | Heavy ayah index — `ensureAyahFuse` dynamic-imports `@/lib/quran`; run off the interaction thread   |
| `searchAll()`                                                          | Synchronous full search (tests / non-interactive callers)                                           |
| `normalize()` / `tokenize()`                                           | Diacritic-insensitive, Arabic-aware text folding                                                    |
| `createFuzzyIndex(items, fields)`                                      | Reusable `FuzzyIndex` for a screen-local list (project defaults + `normalize()`) — memoize per list |
| `createHadithSearch(items)`                                            | `FuzzyIndex<HadithItem>` for an in-collection hadith search bar                                     |
| `createDuaSearch(items)`                                               | `FuzzyIndex<DuaItem>` for an in-category dua search bar                                             |
| `createZikrSearch(items)`                                              | `FuzzyIndex<ZikrItem>` for an in-category zikr search bar                                           |
| `createDuroodSearch` / `createNameSearch` / `createCustomAdhkarSearch` | `FuzzyIndex` for the duroods, 99 Names and adhkar-builder lists                                     |
| `searchDuaList(query, limit?)`                                         | Ranked `DuaItem[]` for the duas index filter                                                        |
| `searchZikrList(query, limit?)`                                        | Ranked `ZikrItem[]` for the zikr index filter                                                       |
| `searchSurahList(query, opts?)`                                        | Ranked `Surah[]` for the Qur'an index filter; `opts` = `limit` or `{ revelation }`                  |

Search bars wired to these: home `src/app/search.tsx` (universal, incl. `ensureAyahFuse` → `searchQuranAyahs`), `quran/index.tsx` + practice passage picker (→ `searchSurahList`), `hadith/[collection].tsx` (→ `createHadithSearch`), `dua/index.tsx` + `dua/[category].tsx` (→ `searchDuaList` / `createDuaSearch`), `zikr/index.tsx` + `zikr/[category].tsx` (→ `searchZikrList` / `createZikrSearch`), `duroods/`, `names-of-allah/`, `adhkar-builder/` (→ `create*Search`). `quran/search.tsx` is a verse-detector search (`src/lib/quran-verse-detector.ts`), not Fuse.

### Rules for agents

1. **Extend `search.ts`** for new corpora or cross-content search — do not add standalone `new Fuse()` in screens.
2. **Pre-normalize** indexed fields with `normalize()` before passing to Fuse (Arabic harakat, Latin accents, transliteration joiners).
3. **Reuse project defaults:** `threshold: 0.2`, `ignoreLocation: true`, `minMatchCharLength: 2`, `useExtendedSearch: true`, weighted keys (title/name highest). (`0.2` was tuned down from `0.3` to drop false positives on short fields like surah names while keeping typo tolerance.)
4. **Multi-word queries:** join normalized tokens with spaces (extended-search AND) or consider `useTokenSearch: true` for new indexes — see the skill for trade-offs.
5. **Performance:** lazy-build indexes (defer with `runWhenIdle()`); call `preloadSearchCorpora()` on search screens; use `ensureAyahFuse()` before `searchQuranAyahs`; use `limit` for UI caps. For surah **meta** only, import `@/lib/quran-meta` — never pull `@/lib/quran` (ayah JSON loaders) into home/shared graphs. Riyad hadith: `ensureBundledCollection` / `import()`, never `require()` of the JSON. Web bundle details: [`docs/PROFILING.md`](../../docs/PROFILING.md). `FuseWorker` only if a corpus exceeds ~10k items and profiling shows jank.
6. **Tests:** `src/lib/search.test.ts` — run with `pnpm --filter app test -- search`.

### Per-screen search bars

Screen-local filters (e.g. a single list) use `createFuzzyIndex(items, fields)` (memoized) so they share the project defaults; no inline `new Fuse()`. Prefer extracting shared helpers into `search.ts` when a second screen needs the same corpus.
