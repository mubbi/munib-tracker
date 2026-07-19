# Data ingestion guide — Munib Tracker

> **Audience:** Developers and agents working on the **build-data pipeline** and bundled religious content.
>
> Architecture and operations for the content pipeline (already shipping). Open data work: [`BACKLOG.md`](./BACKLOG.md#content-pipeline).
>
> **Companion docs:** [`FREE_OPEN_SOURCE_DATA.md`](./FREE_OPEN_SOURCE_DATA.md) · [`FEATURES.md`](./FEATURES.md)

---

## 0. How to extend the pipeline

1. **Read Expo SDK 57 docs** before runtime changes — especially `expo-audio`.
2. **Regenerate bundled data** after script changes: `pnpm --filter app build:data`.
3. Run gates: `pnpm --filter app check-types`, `pnpm format-and-lint:fix`, `pnpm --filter app test`.
4. **Do not add native dependencies** for content ingestion.
5. **Never alter Arabic text** byte-for-byte in source datasets.

### 0.1 Existing platform pieces (reuse — do not rebuild)


- **Audio already exists.** `src/providers/audio-player-provider.tsx` exports `AudioPlayerProvider`
  (mounted in `src/app/_layout.tsx`) and `useAudioPlayerContext()` built on **`expo-audio`**. It
  gives you `play(tracks: AudioTrack[], startIndex?)`, `toggle`, `seekTo`, `next`, `previous`,
  `setRate`, `stop`, plus `current`, `queue`, `isPlaying`, `position`, `duration`, `rate`. It
  **auto-advances** on track end (`didJustFinish → next`) and already **persists/loads
  `audioSpeed`** from preferences. `AudioTrack = { id, title, subtitle?, uri }`.
  `AUDIO_SPEEDS = [0.5, 1, 1.5, 2]`. A global **`MiniPlayer`** (`src/components/audio/mini-player.tsx`)
  is already rendered in the root layout. → **Do NOT create a new audio hook.** Build `AudioTrack[]`
  and call `play()`.
- **react-query is already configured.** `packages/api-client/src/provider.tsx` mounts a
  `QueryClient` (`staleTime: 30_000, retry: 1`) via `AppApiProvider` at the top of the tree. There is
  **no persistence plugin** → for offline reuse of fetched editions you must cache to AsyncStorage
  yourself (see §8.2). Use `useQuery` directly; per-query set `staleTime: Infinity` +
  `networkMode: "offlineFirst"` for scripture.
- **Assets live at `apps/app/assets/`** (currently `assets/images/`, `assets/expo.icon/`). tsconfig
  maps `@/assets/* → ./assets/*`. → Put generated data at **`apps/app/assets/data/…`** and reference
  it as `@/assets/data/…`. (Not `src/assets/`.)
- **Content types already have `audioUri?`** (`NameOfAllah`, `DuaItem`, `DurudItem`, and `ZikrItem`).
  → You only need to **populate** it, plus add the few *new* optional fields in §6.
- **Store pattern:** `src/stores/create-store.ts` (`createStore`/`useStore`, `useSyncExternalStore`).
  Mirror `preferences-store.ts` exactly for any new store.
- **Repo pattern:** `src/db/store.ts` (`readJSON`/`writeJSON`/`removeKey`/`KeyedCollection`),
  `src/db/keys.ts` (`DB_KEYS`), `src/db/index.ts` exports repos + `createId()` (use it for bookmark
  ids) + `initDatabase()`/`resetDatabase()`. Add new keys to `DB_KEYS`, register new keys in
  `resetDatabase()`, and add repos to the `src/db/index.ts` export list.
- **Content accessor pattern:** `src/lib/zikr.ts` (`zikrByCategory`, `zikrCategories`) reads
  `ZIKR_ITEMS` directly from `@munib-tracker/shared/content`. Duas/Names screens import content
  directly (no `lib/dua.ts`/`lib/names.ts` exist). Mirror `lib/zikr.ts` for `lib/quran.ts` /
  `lib/hadith.ts`.
- **Home surfaces features** via the `quickActions: QuickActionItem[]` array in
  `src/app/(tabs)/index.tsx` (`router.push("/zikr")`, etc.). Add Qur'an + Hadith entries there.
- **i18n:** `src/i18n/{locale}.json` for **23 locales** (see [`docs/I18N_GUIDE.md`](../../docs/I18N_GUIDE.md)). Existing namespaces include `actions`, `zikr`, `zikrCat`,
  `dua`, `duaCat`, `duroods`, `names`, and a shared `reading` (`{ reference: "Reference: {{ref}}" }`).
  Add `actions.quran`, `actions.hadith`, and `quran`/`hadith`/`credits` namespaces in **all three**
  locales. Reuse `reading.reference`.
- **Expo experiments ON:** `typedRoutes: true` (routes are type-checked — new `app/quran/*` &
  `app/hadith/*` files auto-generate route types on `expo start`) and `reactCompiler: true` (don't
  fight the compiler with manual memo hacks).
- **Package manager:** **pnpm 9 workspace + Turborepo.** Commands: `pnpm --filter app <script>`.

---

## 1. Delivery decisions

| # | Decision | Delivery | Source (no-key) |
|---|---|---|---|
| D1 | **Qur'an Arabic (Uthmani/Ḥafṣ) + English transliteration + 2 public-domain translations (Pickthall, Yusuf Ali) + 1 Urdu (Jalandhry)** | **Bundled JSON assets**, lazy per-surah | `risan/quran-json` via jsDelivr CDN (build-time fetch) |
| D2 | **Extra Qur'an translations (Saheeh International, Clear Qur'an/Khattab) + tafsir** | **Live CDN, on-demand**, cached (react-query + AsyncStorage) | Translations: `fawazahmed0/quran-api` jsDelivr. Tafsir: `spa5k/tafsir_api` (multi-lang) + fawaz Siraj |
| D3 | **Qur'an recitation audio (Arabic, per-ayah)** | **Streamed** from CDN, optional per-surah download later | `everyayah.com` predictable URLs |
| D4 | **Qur'an English audio-translation** | **Streamed**, per-surah | `QuranicAudio.com` (Ibrahim Walk / Saheeh Intl) |
| D5 | **Hadith — curated highlights (40 Nawawi, Riyad as-Salihin)** | **Bundled JSON**, offline | `AhmedBaset/hadith-json` (build-time; license policy §12) |
| D6 | **Hadith — full six-books browse/search** | **Live CDN, on-demand**, cached | `fawazahmed0/hadith-api` jsDelivr (no key) |
| D7 | **Duas + Adhkar → full Hisnul Muslim** | **Bundled** (`packages/shared` via `build-adhkar.mjs`) — **270** duas | `sheikhhanif/Hisnul_Muslim_Database` + related OSS |
| D8 | **Names of Allah → complete 99** | **Bundled** (`names.ts` via `build-names.mjs`) | standard Asma-ul-Husna (from fawazahmed0 / muslimKit) |
| D9 | **Dua/Adhkar/99-Names audio** | **Streamed** | Internet Archive (Hisnul Muslim audio, Asma-ul-Husna) |
| D10 | **Prayer times / Qibla** | **On-device calc (unchanged)** | `adhan` (installed) + `expo-location` |
| D11 | **Adhan call audio (for notifications)** | **Bundled baseline MP3** + remote CDN styles; expand local set | `assets/audio/adhan/` + Kiwifu/adhan-mp3 |
| D12 | **Integrity, not encryption** | SHA-256 per data file in a manifest; **no encryption of scripture** | `expo-crypto` (installed) |

**Why these specific no-key sources:** `sunnah.com` and `Quran.Foundation` require a
manually-requested API key/registration → they would **block a one-pass automated build**. They are
recorded in `FREE_OPEN_SOURCE_DATA.md` as the future "authoritative upgrade path", but are **out of
scope** here. All D1–D12 sources work with **no key**.

**Runtime failure telemetry:** On-demand CDN failures (D2/D3/D4/D6/D9/D11 + QCF fonts) are reported
from the Expo app to Sentry and `POST /api/v1/oss-content-failures`, then reviewed in admin
[`/oss-failures`](./ADMIN.md) so broken upstream mirrors can be swapped without waiting on user
content reports.

---

## 2. Non-negotiable constraints

1. **No new native deps.** Use only what's in `apps/app/package.json`. Several pieces are already
   **wired**, not just installed: `expo-audio` (via `AudioPlayerProvider`/`useAudioPlayerContext()`),
   `@tanstack/react-query` (via `AppApiProvider`), `expo-crypto`, `expo-constants`, `expo-web-browser`,
   `@react-native-async-storage/async-storage`, `react-i18next`, `adhan`, `expo-location`. Metro's
   default config already resolves `.json` imports — **no `metro.config.js` change needed** for
   bundled JSON. Do **not** add `expo-sqlite`, WatermelonDB, Realm, `expo-av`, or `zustand`
   (a custom `createStore` is used).
2. **Offline-first.** Qur'an Arabic/translit/2 PD translations, all adhkar/duas/names, and hadith
   highlights **must work with the network off**. APIs (D2, D6) are enrichment only — every screen
   must render usefully offline.
3. **Arabic is immutable.** Copy Arabic verbatim (Uthmani diacritics, tashkeel, symbols). Never
   normalize, transliterate-in-place, strip marks, or "fix" it. Store as UTF-8, no BOM.
4. **AsyncStorage = user data only.** Bundled content is read directly from JS/JSON (mirror the
   existing `ZIKR_ITEMS` pattern). Only bookmarks / last-read / progress / preferences go to
   AsyncStorage, via the existing repository pattern.
5. **Attribution required.** Ship a Credits screen (§11) and keep a `license`+`attribution`+`sourceUrl`
   field in every dataset manifest. Tanzil-derived data must credit + link tanzil.net.
6. **Match existing conventions.** Screens use `ScreenLayout`/`Card`/`Stagger`/`EmptyState` from
   `@/components`, i18n via `useTranslation()` + keys in `src/i18n/{en,ar,ur}.json`, content
   accessors in `src/lib/*`, repos in `src/db/repositories/*`. RTL: Arabic and Urdu must render RTL.
7. After pipeline changes: `pnpm --filter app check-types`, lint, and tests must pass; smoke Qur'an/Hadith offline.

---

## 3. Final source URLs (all no-key, build-time or runtime)

```
# Qur'an core (bundled at build time)  — CC BY-SA 4.0, credit tanzil.net + risan
QURAN_JSON_CDN = https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist
  /chapters/index.json                       # surah metadata list
  /chapters/en/{1..114}.json                 # per-surah with verses (ar/translit/translation)
  # editions available: arabic (uthmani), transliteration, en, ur, ... (see repo)

# Qur'an extra translations & tafsir (runtime, on-demand)  — Unlicense (public domain) for fawaz
QURAN_FAWAZ_CDN = https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions
  /{editionId}/{surah}.json                  # e.g. eng-saheehinternational, eng-mustafakhattb...
  # edition catalogue: https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions.json

# Multi-language ayah tafsir (runtime, on-demand) — spa5k/tafsir_api (per-resource licenses via QUL/quran.com)
QURAN_TAFSIR_CDN = https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir
  /editions.json
  /{slug}/{surah}.json                       # { ayahs: [{ ayah, surah, text }, ...] }
  /{slug}/{surah}/{ayah}.json                # { surah, ayah, text }
  # App registry: packages/shared/src/i18n/quran-tafsir-defs.json
  # Fetcher: apps/app/src/api/quran-tafsir.ts (cache keys prefixed `tafsir:`)

# Qur'an audio (runtime stream, per-ayah)  — free
EVERYAYAH_CDN = https://everyayah.com/data/{reciterDir}/{SSSAAA}.mp3
  # SSSAAA = zero-padded surah(3)+ayah(3), e.g. 001001.mp3
  # reciterDir examples: Alafasy_128kbps, Abdul_Basit_Murattal_192kbps, Husary_128kbps

# Qur'an English audio-translation (runtime stream, per-surah)  — free, credit Saheeh Intl
QURANICAUDIO = https://download.quranicaudio.com/quran/  # discover surah paths at build time

# Hadith highlights (bundled) + full (runtime)
HADITH_JSON_REPO   = https://cdn.jsdelivr.net/gh/AhmedBaset/hadith-json@main/db   # highlights build-time
HADITH_FAWAZ_CDN   = https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1         # runtime, no key
  /editions.json ; /editions/{editionId}.min.json

# Adhkar / Duas / 99 Names (bundled static content)
HISN_MUSLIM_JSON   = https://cdn.jsdelivr.net/gh/wafaaelmaandy/Hisn-Muslim-Json@master   # Arabic+English
ADHKAR_MORNING_EVE = https://cdn.jsdelivr.net/gh/Seen-Arabic/Morning-And-Evening-Adhkar-DB@main
ASMA_UL_HUSNA      = fawazahmed0 / muslimKit 99-names JSON

# Audio for adhkar / names / adhan-call (runtime stream / small bundled)
HISN_AUDIO   = https://archive.org/details/HisnulMuslimAudio_201510
ASMA_AUDIO   = https://archive.org/details/AsmaUlHusna99NamesofALLAH_201808
NAWAWI_AUDIO = https://archive.org/details/40Hadith_Nawawi
```

> At build time the pipeline (§5) **downloads once, normalizes, and writes local JSON** into the
> app. Runtime CDNs (D2/D6) are fetched lazily and cached. Pin the exact versions/tags above so the
> build is reproducible.

---

## 4. File tree

```
apps/app/
  scripts/build-data/                 # Node build pipeline (runs on a dev machine / CI, not device)
    index.mjs                         # entrypoint: `node scripts/build-data/index.mjs`
    fetch.mjs                         # cached HTTP GET helper (writes to .cache/)
    build-quran.mjs                   # D1 → assets/data/quran/*
    build-hadith-highlights.mjs       # D5 → assets/data/hadith/*
    build-adhkar.mjs                  # D7 → packages/shared/src/content/*
    build-names.mjs                   # D8 → packages/shared/src/content/names.ts
    manifest.mjs                      # writes assets/data/manifest.json (versions + sha256 + license)
    schemas.mjs                       # zod-free JS validators (114 surahs / 6236 ayahs, etc.)
  assets/data/                        # NOTE: apps/app/assets/ (root), referenced as @/assets/data/*
    manifest.json
    quran/
      meta.json                       # surah list + juz/page/hizb index
      arabic/001.json … 114.json      # { "1": "…", "2": "…" }  (Uthmani)
      translit/001.json … 114.json
      translation/en-pickthall/001.json … 114.json
      translation/en-yusufali/001.json … 114.json
      translation/ur-jalandhry/001.json … 114.json
    hadith/
      nawawi40.json
      riyad-as-salihin.json           # or per-book files if large
  assets/audio/adhan/                 # bundled adhan-call MP3(s) — small
  src/
    lib/
      quran.ts                        # bundled-surah loader + selectors (mirror lib/zikr.ts)
      quran-loader.ts                 # GENERATED require-map: surah -> () => json (literal requires)
      quran-audio.ts                  # everyayah/quranicaudio → AudioTrack[] builders
      hadith.ts                       # highlights loader
      audio-tracks.ts                 # dua/name/adhan → AudioTrack[] builders
    api/
      quran-remote.ts                 # D2: fawazahmed0 CDN fetchers (plain fetch inside queryFns)
      hadith-remote.ts                # D6: fawazahmed0 hadith CDN fetchers
    hooks/
      use-quran.ts                    # surah/ayah useQuery hooks (cache-first, offlineFirst)
      use-hadith.ts
      # NO use-audio.ts — reuse the existing useAudioPlayerContext() (see §0.1)
    db/repositories/
      quran-repository.ts             # bookmarks, lastRead, reading progress  (AsyncStorage)
      quran-cache-repository.ts       # offline cache of fetched D2 editions (AsyncStorage)
      hadith-repository.ts            # bookmarks (+ offline cache of fetched D6 books)
    stores/
      quran-store.ts                  # reader state (current surah/ayah, reciter, translation ids)
    app/
      quran/
        index.tsx                     # surah list
        [surah].tsx                   # ayah-by-ayah reader (ar + translit + translation + audio)
        search.tsx                    # verse search (uses D2 search or local)
        bookmarks.tsx
      hadith/
        index.tsx                     # collections list
        [collection].tsx             # books/chapters
        [collection]/[book].tsx       # hadith list  (or nested route per expo-router convention)
      credits.tsx                     # data sources & licenses (§11)
packages/shared/src/
  types/
    quran.ts                          # Surah, Ayah, AyahEdition types (§6)
    hadith.ts                         # HadithItem, HadithCollection types (§6)
  content/
    duas.ts                           # full Hisnul Muslim (270) — regenerate via build-adhkar.mjs
    zikr.ts                           # expanded adhkar — regenerate via build-adhkar.mjs
    duroods.ts                        # regenerate via build-adhkar.mjs
    names.ts                          # all 99 — regenerate via build-names.mjs
    hadith-highlights.ts (optional if not using assets/)
    index.ts       (export new)
```

**Decision on bundled-JSON loading:** use a **generated static require-map** (`quran-loader.ts` in
`src/lib/`) mapping `surahNumber → () => require('../../assets/data/quran/arabic/001.json')` (use a
**relative** path from `src/lib/` — `require()` does not resolve the `@/` alias under Metro). Metro
bundles these and evaluates lazily on first access; results cache in a module-level `Map`. Pure JS,
needs **no `expo-asset`**, and works on iOS/Android/Web. Do **not** dynamically build require paths
from variables (Metro can't resolve those) — the loader must list explicit `require()` calls, which
is why it is **generated** by the build script.

**Web graph caveat:** statically importing `quran-loader` / `@/lib/quran` pulls **all** require-map
JSON into that module’s chunk (often `__common`). Home, light search, and reference helpers must use
`@/lib/quran-meta` or `await import("@/lib/quran")` instead — see [`PROFILING.md`](./PROFILING.md).

---

## 5. Build pipeline requirements (`scripts/build-data/`)

A Node **ESM** pipeline, run with `node apps/app/scripts/build-data/index.mjs` (add an npm script
`"build:data"`). Requirements:

1. **Fetch with cache.** `fetch.mjs` GETs a URL, stores raw response under
   `apps/app/scripts/build-data/.cache/` (gitignored), and reuses cache on re-run → **idempotent &
   offline-repeatable** after first run. Use global `fetch` (Node ≥18).
2. **Normalize to the §6 schemas.** Map source fields → target fields exactly. Emit one JSON file per
   surah / per hadith set. Keys are stringified ayah/hadith numbers. UTF-8, no BOM, `\n` newlines.
3. **Preserve Arabic byte-for-byte.** No `.normalize()`, no regex stripping of diacritics.
4. **Validate before writing** (`schemas.mjs`): exactly **114 surahs**, **6236 ayahs total**, every
   ayah has non-empty `arabic`; each translation edition aligns 1:1 by (surah, ayah); each hadith has
   a `reference`; flag missing hadith `grade` into `gaps.json` (don't fail the build for missing
   grades, do fail for missing Arabic or wrong counts).
5. **Manifest.** `manifest.json` = `{ generatedAtNote, datasets: [{ id, kind, version, files:
   [{path, sha256, bytes}], license, attribution, sourceUrl }] }`. Compute SHA-256 with Node
   `crypto`. (Runtime integrity check is optional; the manifest is primarily a build artifact +
   powers the Credits screen.)
6. **Content files.** `build-adhkar.mjs` / `build-names.mjs` **regenerate the TS content files** in
   `packages/shared/src/content/` (as typed `const X: T[] = [...]` exports) and **bump the
   `*_CONTENT_VERSION`** constant. Keep them valid TS that passes biome + tsc.
7. **Determinism.** Stable sort order; no timestamps/random in output (so re-runs diff cleanly).
   `Date.now()`/random are forbidden in committed output.
8. **Do not run on device.** This pipeline is dev/CI only; its output (JSON + TS) is committed.

> The agent should **run the pipeline, commit its generated output**, and verify counts. If a source
> URL is unreachable, fall back to the next source listed for that dataset in §3 and note it.

---

## 6. Type definitions (`packages/shared/src/types/`)

Add and export from `packages/shared/src/types/index.ts`. Mirror existing style (string-literal
unions, `readonly`-friendly, no classes).

```ts
// quran.ts
export type RevelationPlace = "makkah" | "madinah";

export interface Surah {
  number: number;                 // 1..114
  nameArabic: string;             // ٱلْفَاتِحَة
  nameEnglish: string;            // "The Opening"
  nameTransliteration: string;    // "Al-Fatihah"
  revelationPlace: RevelationPlace;
  ayahCount: number;
  bismillahPre: boolean;          // false only for At-Tawbah (9)
}

export interface Ayah {
  surah: number;
  ayah: number;                   // 1-based within surah
  global: number;                 // 1..6236
  arabic: string;                 // Uthmani, verbatim
  juz: number; hizb: number; page: number; // Madinah mushaf
  sajda: boolean;
}

export type QuranEditionKind = "translation" | "transliteration" | "tafsir";
export interface QuranEdition {
  id: string;                     // "en-pickthall", "en-saheehinternational", ...
  kind: QuranEditionKind;
  language: string;               // "en" | "ur" | "ar"
  name: string;                   // "Pickthall"
  bundled: boolean;               // true = offline asset, false = fetched via D2
  direction: "ltr" | "rtl";
}
export interface AyahText { surah: number; ayah: number; editionId: string; text: string; }

// hadith.ts
export interface HadithCollection {
  id: string;                     // "nawawi40", "riyad_assalihin", "bukhari", ...
  nameEnglish: string; nameArabic: string;
  bundled: boolean;               // true for highlights
  bookCount?: number;
}
export interface HadithItem {
  id: string;                     // stable: `${collection}:${number}`
  collection: string;
  book?: string; chapterId?: string; number: string;
  arabic: string; english: string;
  narrator?: string;
  grade?: string;                 // "sahih" | "hasan" | ... (may be absent → show "ungraded")
  gradedBy?: string;
  reference: string;              // human-readable, e.g. "Sahih al-Bukhari 1"
}
```

Extend existing content types **without breaking them** (all additions optional). Note
`audioUri?: string` **already exists** on `ZikrItem`/`DuaItem`/`DurudItem`/`NameOfAllah` in
`packages/shared/src/types/{zikr,content}.ts` — you only **populate** it. **Add** optional
`chapter?: string` and `orderInChapter?: number` to `DuaItem`/`ZikrItem` so Hisnul Muslim chapter
structure survives, and optional `meaning?: string` to `NameOfAllah`. Do not make any existing field
required.

---

## 7. Content expansion — Duas, Adhkar, Duroods, 99 Names (D7, D8)

**Phase 1 is shipped** — full Hisnul corpus (**270** duas), expanded adhkar/duroods, and all **99**
Names. Re-run builders when sources or locale overlays change; do not AI-author religious text.

- Regenerate `packages/shared/src/content/{duas,zikr,duroods,names}.ts` from the §3 sources via
  `build-adhkar.mjs` / `build-names.mjs`.
- **Adhkar/Duas:** map to existing `ZikrItem` / `DuaItem` shapes. Keep each item's
  `arabic, transliteration, translation, virtues?, reference, targetCount?, categoryId, audioUri?`.
  Preserve category mapping to the app's existing `ZikrCategoryId`
  (`morning|evening|before_prayer|after_prayer|after_azan|before_sleep|anytime`) and
  `DuaCategoryId` (`sunnah|quranic|daily`). Hisnul Muslim chapters that don't map cleanly → put in
  `anytime` (adhkar) or `daily`/`sunnah` (duas) and set `chapter`.
- **Every item must keep a `reference`** (Hisnul Muslim cites Qur'an/Hadith). Do not drop it.
- **99 Names:** `names.ts` holds all 99 with `id, arabic, transliteration, translation, meaning?,
  audioUri?`.
- **Bump** `ZIKR_CONTENT_VERSION`, `DUA_CONTENT_VERSION`, `DUROOD_CONTENT_VERSION`,
  `NAMES_CONTENT_VERSION` when regenerating.
- **No AsyncStorage change** — these are read directly by `src/lib/*` (mirror `zikrByCategory`).
- Existing tests `content.test.ts` / `zikr.test.ts` must still pass; assert names length === 99 and
  every dua has a non-empty `reference`.

Open follow-ups (locale overlays, Bengali coverage, per-item `audioUri`): [`BACKLOG.md`](./BACKLOG.md).

Acceptance: Zikr/Dua/Names screens show the full sets with **no UI code change** after regenerate.

---

## 8. Qur'an feature (D1–D4)

### 8.1 Data access (`quran-meta` + `quran.ts` + generated `quran-loader.ts`)
- **`src/lib/quran-meta.ts`:** `getSurahMeta()`, juz/page helpers from `meta.json` / pages index — safe for home and light search (no ayah JSON).
- **`src/lib/quran.ts`:** `getSurahAyahs(n)`, editions, mushaf pages via the generated require-map (lazy + LRU). Prefer route-local import or `await import("@/lib/quran")` on web so the map stays out of `__common` ([`PROFILING.md`](./PROFILING.md)).
- `getBundledEdition(editionId, surah): Record<number,string>` for translit + PD translations.
- Selectors are synchronous for bundled data once loaded (offline, instant).

### 8.2 Remote enrichment (`src/api/quran-remote.ts` + `src/hooks/use-quran.ts`)
- `use-quran.ts` exposes `useQuery` hooks (the `QueryClient` already exists via `AppApiProvider` —
  **do not add a provider**). `queryFn`s do a plain `fetch` of `QURAN_FAWAZ_CDN` for D2 editions
  (Saheeh Intl, Khattab, tafsir). Per-query options: `staleTime: Infinity` (scripture is immutable),
  `networkMode: "offlineFirst"`.
- **Offline reuse (there is NO react-query persister configured):** the `queryFn` must be
  **cache-first** — read `quran-cache-repository` (AsyncStorage) first; on a cache miss, fetch, then
  write the edition-surah JSON back to the cache. So any translation opened once works offline
  afterward. For editions never downloaded while offline, surface a soft "connect to download this
  translation" state and fall back to a bundled edition.

### 8.3 Audio — reuse the existing player (`src/lib/quran-audio.ts` only)
- **Do NOT create an audio hook or touch `expo-audio` directly.** Use `useAudioPlayerContext()` from
  `src/providers/audio-player-provider.tsx` (see §0.1). `audioSpeed`, auto-advance, and the global
  `MiniPlayer` are already handled.
- `quran-audio.ts` builds `AudioTrack[]` (`{ id, title, subtitle?, uri }`):
  - `ayahTracks(reciterDir, surah, ayahs)` → one track per ayah via everyayah `SSSAAA.mp3` (D3).
    `title` = surah name, `subtitle` = `Ayah {n}`, `id` = `${surah}:${ayah}`.
  - `surahTranslationTrack(surah)` → QuranicAudio per-surah English (D4).
- **Continuous recitation:** call `play(ayahTracks(...), startIndex)` — the provider auto-advances
  ayah→ayah on finish. **Highlight the current ayah** by matching `useAudioPlayerContext().current?.id`
  (or `queue[index]`) to the rendered ayah id. Reciter dir comes from `quran-store`/prefs.

### 8.4 Screens (`src/app/quran/`)
- `index.tsx`: surah list (number, Arabic name, English name, ayah count, Makki/Madani, revelation).
  Search/filter by name or number.
- `[surah].tsx`: reader — per ayah: Arabic (large, RTL), transliteration (toggle), selected
  translation(s) (toggle), ayah number badge, play button, bookmark toggle, share. Sticky header
  with surah name + reciter/translation pickers. Restore `lastRead` on open; persist on scroll.
- `search.tsx`: verse search (D2 search endpoint or local scan over bundled translation text).
- `bookmarks.tsx`: list from `quran-repository`. Use `createId()` from `@/db` for bookmark ids.
- Use existing UI primitives: `ScreenLayout`, `Card`, `Stagger`, `EmptyState`, `ThemedText` from
  `@/components`. Match the Zikr screens' structure (`src/app/zikr/*`).
- **Navigation:** add a `QuickActionItem` for Qur'an to the `quickActions` array in
  `src/app/(tabs)/index.tsx`: `{ id: "quran", label: t("actions.quran"), icon: {...}, onPress: () =>
  router.push("/quran") }` (typedRoutes will pick up the new route). Add i18n keys (§9 + §0.1).

### 8.5 User data (`src/db/repositories/quran-repository.ts` + `stores/quran-store.ts`)
- New `DB_KEYS`: `quranBookmarks`, `quranLastRead`, `quranReadingProgress`, `quranPrefs`, plus
  `quranEditionCache` (for §8.2). Register all of these in `resetDatabase()` in `src/db/index.ts`.
- `quranPrefs`: `{ preferredTranslationIds: string[]; preferredReciterDir: string;
  showTransliteration: boolean; script?: "uthmani" }`.
- Repo methods mirror existing repos (`readJSON`/`writeJSON`, `KeyedCollection` for bookmarks). Export
  new repos from `src/db/index.ts`.
- `quran-store.ts` mirrors `preferences-store.ts` exactly (uses `createStore`/`useStore` from
  `src/stores/create-store.ts` — **not** the `zustand` package). Expose hooks (`useQuranPrefs`,
  `useLastRead`, `useQuranActions`) and load in `AppProviders` alongside the other stores.

---

## 9. Hadith feature (D5, D6)

- **Bundled highlights** (`assets/data/hadith/nawawi40.json`, `riyad-as-salihin.json`) via
  `src/lib/hadith.ts` — offline, always available.
- **Full collections** via `src/api/hadith-remote.ts` (fawazahmed0 CDN, D6) + `use-hadith.ts`
  (`useQuery`, `networkMode: "offlineFirst"`). **Cache-first like §8.2** — opened books are written to
  AsyncStorage via `hadith-repository` so they re-read offline.
- **Every hadith renders its `reference` and `grade`** (show "ungraded" when absent — never imply
  authenticity that isn't in the data).
- Screens (`src/app/hadith/`): collections list → book/chapter → hadith list (Arabic RTL + English +
  reference + grade badge + bookmark), built with `ScreenLayout`/`Card`/`EmptyState`. Search within a
  collection. Follow expo-router nesting; keep routes valid for `typedRoutes`.
- `src/db/repositories/hadith-repository.ts`: bookmarks (`createId()` ids) + book cache. New
  `DB_KEYS.hadithBookmarks`, `DB_KEYS.hadithBookCache`; register both in `resetDatabase()`.
- Nawawi highlights get audio (D9) via Internet Archive; full corpus has no per-hadith audio — hide
  the audio control when no `audioUri`.

---

## 10. Audio integration (all types, D3/D4/D9/D11)

- **Reuse the existing player** (`useAudioPlayerContext()` — §0.1). There is **no new audio hook and
  no direct `expo-audio` use**. The provider already does play/pause/seek/rate/queue/auto-advance and
  renders the global `MiniPlayer`.
- Build `AudioTrack[]` in `src/lib/quran-audio.ts` (Qur'an, §8.3) and `src/lib/audio-tracks.ts`
  (dua/adhkar/name/adhan). A tap → `play(tracks, startIndex)`.
- **Transliteration has no separate audio** — reuse the item's Arabic recitation URL for its track.
- Adhkar/Dua/Name items: show the play button only when the item resolves an `audioUri`. A `ZikrRow`
  / dua row play button calls `play([{ id, title, uri }])`.
- Adhan-call audio (D11): baseline bundled `adhan.mp3` plus remote CDN styles in `lib/adhan-audio.ts`
  (notification sound + style picker shipped), learn phrase clips under `assets/audio/adhan/phrases/`
  (Wikimedia CC BY-SA), and Medina follow-along cues. Expand additional local MP3s under
  `apps/app/assets/audio/adhan/` when adding offline styles. Do not autoplay in-app without user
  action.
- **Never bundle Qur'an/hadith audio** — stream. Optional "download surah for offline" is out of scope
  unless trivial.
- **Optional (needs native rebuild, not a new dep):** for lock-screen / background Qur'an playback,
  add the `expo-audio` config plugin to `app.json` plugins with background playback enabled and
  re-prebuild. Skip unless explicitly wanted — foreground playback already works.

---

## 11. Credits / attribution screen (`src/app/credits.tsx`)

- Render from `@/assets/data/manifest.json` (import the JSON) + a static list for the content
  datasets: each row = dataset name, license, attribution text, tappable source URL (open with
  `expo-web-browser`, already installed). Build with `ScreenLayout`/`Card`.
- Must include the Tanzil credit + link (CC BY), risan CC BY-SA, fawazahmed0 (public domain),
  Saheeh Intl credit, sunnah.com/AhmedBaset note, Hisnul Muslim, Internet Archive audio.
- Link it from the Settings tab (`src/app/(tabs)/settings.tsx`) via `router.push("/credits")` with a
  new `credits.*` i18n label. Add the `credits` route file so `typedRoutes` recognizes it.

---

## 12. Licensing guardrails (enforce during build)

- **Bundle only license-safe text:** Arabic (Tanzil/risan, CC), transliteration (Tanzil/risan, CC),
  Pickthall/Yusuf Ali/Jalandhry (public domain). ✅
- **Do NOT bundle** Saheeh International or Khattab "Clear Qur'an" text — fetch at runtime (D2) and
  render verbatim with credit. (They're free-to-use but copyrighted.)
- **`AhmedBaset/hadith-json` licensing (resolved policy):** The GitHub repo has **no
  explicit license** (scraped from sunnah.com). Munib's policy is therefore:
  1. **Ship only classical highlight sets** (40 Nawawi / Riyad as-Salihin) that are
     themselves public-domain / classical corpora, attributed to sunnah.com in the
     Credits screen and `assets/data/manifest.json`.
  2. **Do not** bundle the full ~50k hadith corpus from that repo.
  3. Full-collection browse uses the **runtime CDN** path (D6), not AhmedBaset.
  4. The manifest `note` field documents this constraint for auditors (`TODO(license)`
     marker = "confirm rights before expanding beyond highlights"). Until the
     upstream adds a clear license, treat any expansion of that source as blocked.
- **No encryption** of any scripture/text (D12). Integrity = SHA-256 in the manifest only.

---

## 13. Gotchas / guardrails

- **Metro + dynamic requires:** `require(variable)` fails. The surah require-map **must** be
  generated with literal paths (that's why `quran-loader.ts` is code-generated by `build-quran.mjs`). On **web**,
  avoid statically importing that map from modules shared into `__common` — use `quran-meta` /
  dynamic `import("@/lib/quran")` ([`PROFILING.md`](./PROFILING.md)).
- **Bundle size:** bundling Arabic + translit + 3 translations ≈ a few MB of JSON in the JS bundle —
  acceptable. If it noticeably hurts startup, move PD translations to the same runtime-cache path as
  D2 (keep Arabic + translit bundled). Don't prematurely optimize.
- **RTL:** wrap Arabic/Urdu in views with `writingDirection: "rtl"` / `textAlign: "right"`; test with
  device LTR locale (RTL must be per-text, not app-global, since UI stays LTR for en).
- **Audio is already built — reuse it.** Do **not** import `expo-audio` or write a new player/hook.
  Use `useAudioPlayerContext()` (`play`/`toggle`/`next`/`setRate`/`current`/`queue`); it already
  handles rate, auto-advance, and the global `MiniPlayer`. Your only job is to produce `AudioTrack[]`.
- **react-query is already provided** (`AppApiProvider` → `QueryClient`, `staleTime 30s / retry 1`,
  **no persister**). Don't add a provider. Per-query set `staleTime: Infinity` +
  `networkMode: "offlineFirst"`, and make `queryFn`s **cache-first over AsyncStorage** (§8.2) so
  fetched editions/books work offline afterward.
- **Don't seed bundled content into AsyncStorage** — it's read directly (matches current app). Only
  user data is persisted. The `*_CONTENT_VERSION` bumps are for consumers/tests, not a re-seed step.
- **Never fail silently on data gaps:** write `gaps.json`, and where a field is missing at runtime
  (e.g. hadith grade, name meaning), render an explicit neutral state — don't fabricate.
- **Memory constraint** ([`no-new-native-deps`]): if any task seems to need `expo-sqlite` or another
  native module, STOP and report — do not add it.

---
