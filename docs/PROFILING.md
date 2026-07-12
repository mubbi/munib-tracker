# Munib Tracker — Profiling & optimization

> **Purpose:** Performance profile of `apps/app` + playbooks. **Open tasks:** [`BACKLOG.md`](./BACKLOG.md#performance).
>
> **Apps covered:** `apps/app` (iOS / Android / Web). Marketing site and API are out of scope.
>
> **Verdict (read this first):**  
> - **Native (iOS/Android): further React.lazy / per-route code-splitting is not required.** Metro already ships one Hermes-friendly JS graph; Expo’s production async routes still do **not** split native bundles. Keep the single-load app shell. Optimize **payload and startup work**, not screen module wrappers.  
> - **Web (2026-07-12 pass 3 — thinner home shell):** Home `/` is a **hero + SEO shell**; below-fold cards live in `home-below-fold` (lazy chunk). `quran-store` uses `quran-meta.getPageForAyah` (no `quran-loader` on boot). SEO locale JSON packs load on demand. Idle root overlays (`MiniPlayer`, QR warmup, web adhan bridge) are `React.lazy`. Lab PSI mobile still ~**39** until `__common` RN/Expo runtime shrinks further; expect better TBT/parse on `/` after deploy.

---

## 1. How this profile was run

| Method | What it measures | Limits |
|--------|------------------|--------|
| Filesystem sizes | Routes, `src/`, `assets/data`, shared content | Disk ≠ parse cost |
| `apps/app/dist` web static export | JS chunk count / size / gzip | After asyncRoutes + graph trims |
| Gzip of home critical scripts | Transfer size on a warm CDN | Brotli may be slightly smaller in production hosting |
| String / payload probes inside `__common` | Confirms corpora in / out of shared chunk | Not a full Metro treemap |
| Chrome Lighthouse (local `serve dist`, Chrome headless) | LCP / TBT / FCP / SI on `/` and `/tracker` | Lab-only; not CrUX field data |
| Debug APK zip breakdown (`android/.../app-debug.apk`) | Native `.so`, dex, fonts, assets | **Debug + multi-ABI (incl. x86_64)** — **not** a Play Store AAB size |
| Source inspection | Import shapes (`hadith-bundled`, `quran-meta`, `search`, `_layout`) | Static analysis |

**Still open for wall-clock / store numbers:**

- Cold-start TTI / TTR on device (React Native Perf Monitor, Flipper, or [EAS Observe](https://docs.expo.dev/eas/observe/get-started/))
- Annotated Metro source map / treemap (optional P2.4)
- Release AAB per-ABI download size (`bundletool get-size total`)

---

## 2. Snapshot of measured results

### 2.1 App scale

| Metric | Value |
|--------|------:|
| Expo route files (`apps/app/src/app/**/*.tsx`) | **162** |
| Largest route families | `learn-quran` (20), `settings` (18), `jahannam` (10), `quran` / `last-day` (9) |
| `apps/app/src` total | **~5.2 MB** |
| Bundled religious data (`assets/data`) | **~12 MB** (Qur’an ~9.1 MB, Hadith ~2.4 MB) |
| All `apps/app/assets` | **~15 MB** |
| `@munib-tracker/shared` content (non-test `.ts`) | **~1.4 MB** under `packages/shared/src/content` |
| i18n JSON (**23** catalogs: `en` + 22 translations) | **~5+ MB** raw on disk; **locale-on-demand** via `import()` (only `en` + active locale at boot) |

### 2.2 Web production export (`apps/app/dist`) — 2026-07-12 pass 2

| Artifact | Size |
|----------|-----:|
| JS files under `dist/_expo/static/js/web/` | **~468** chunks (asyncRoutes working) |
| Home critical path (sum of scripts in `index.html`) | **~18.7 MB** raw / **~3.4 MB** gzip -9 |
| `__common-*.js` (shared) | **~15.1 MB** raw / **~2.44 MB** gzip |
| Largest route/`index` chunk | **~3.4 MB** raw |
| Riyad JSON | **own async chunk** (~4.1 MB raw / ~0.64 MB gzip) — **not** required to paint home |
| Duas corpus | **own async chunk** (~0.73 MB) |
| Color picker | **own async chunk** (~535 KB) — absent from `__common` |
| Locale catalogs (`ar`, `ur`, …) | **own async chunks** (~500–580 KB each) |

**`__common` probes (pass 2):** `NAMES` meanings **absent**; zikr `Subhan-Allah` **absent**; Nawawi English body **absent**; `search-guides` module **absent**; `ScheherazadeNew-Regular` TTF **absent**; Qur’an arabic / color picker / Riyad full JSON **absent**. Still present: some dua/guide string fragments shared across multi-route modules.

**Metro rule (critical):** never `require()` content/JSON from production modules — even behind `NODE_ENV === "test"`. Jest warms via `jest.setup.ts` setters (`__set*ForTests`). Guides live in `search-with-guides.ts`, loaded only from the search screen runner.

**Interpretation:** Corpora trims landed; `__common` is now mostly framework/runtime. Further LCP wins need either a smaller shared runtime or shipping less JS before first paint (e.g. thinner home route, partial hydration strategies).

### 2.3 Content already deferred vs eager

| Payload | Mechanism | Startup impact |
|---------|-----------|----------------|
| Qur’an per-surah / page JSON | `quran-loader` `require()` maps; home uses `quran-meta` + dynamic `import("@/lib/quran")` for cards/search | **Good for home** — ayah JSON out of `__common`; still heavy when Qur’an routes load |
| QCF V2 page fonts | Download + cache (`qcf-font-cache.ts`) | **Good** — not blocking splash |
| Remote hadith / extra Qur’an editions | CDN + cache APIs | **Good** |
| Riyad as-Salihin | `import()` via `ensureBundledCollection` (`hadith-bundled.ts`) | **Good** — own async chunk |
| Nawawi Forty | `import()` via `ensureBundledCollection` (same as Riyad) | **Good** — own async chunk; sync only after warm / Jest setters |
| Content corpora | Screens use `content-loaders` / `ensure*`; progress stores `await import()` topic lists in `load()`; no content barrel on home | **Improved** |
| Learn guides (search) | `search-with-guides.ts` — only pulled from search screen runner | **Good** — not in `__common` |
| i18n locales | `en` static; others `import()` in `i18n/index.ts` | **Good** |
| Arabic / Bengali fonts | Root: Bengali + optional active face via `import("@/lib/arabic-font-files")`; picker TTFs not in `__common` | **Good** |
| `reanimated-color-picker` | `React.lazy` from `settings/appearance` | **Good** — own chunk |

Search (`src/lib/search.ts`) lazy-builds Fuse indexes, uses `quran-meta` for surah names, and **`ensureAyahFuse()`** dynamic-imports `@/lib/quran` for ayah full-text — keep that pattern.

### 2.5 Chrome Lighthouse (lab, local static export)

Served with `npx serve apps/app/dist -l 4173`. Reports under `apps/app/.lighthouse/`.

**Lab scores (2026-07-12 pass 2, ~18.7 MB / ~3.4 MB gzip critical path):**

| Page | Form | Score | FCP | LCP | TBT | SI |
|------|------|------:|-----|-----|-----|-----|
| `/` | mobile | 38 | 0.9 s | 26.3 s | 1.9 s | 10.0 s |
| `/tracker` | mobile | 40 | 0.9 s | 25.9 s | 1.7 s | 8.3 s |
| `/` | desktop | 64 | 0.2 s | 4.3 s | 260 ms | 2.1 s |

CLS was **0**. Mobile LCP/TBT still dominated by parsing `__common` (~15 MB). Desktop improved vs pass 1 (~62 → **64**).

### 2.4 Android debug APK (directional only)

| Metric | Value |
|--------|------:|
| `app-debug.apk` | **~117 MB** |
| Native `lib/` (all ABIs in the fat debug APK) | **~80.7 MB** — dominated by `x86_64` emulator libs |
| Dex (sum of `classes*.dex`) | **~74 MB** uncompressed entries in the zip listing (debug / RN tooling heavy) |
| App `assets/` inside APK | **~0.9 MB** — mostly ML Kit barcode models (~0.86 MB), **not** the 12 MB Qur’an JSON tree |

**Do not use 117 MB as a store-listing number.** Release / Play App Bundle delivers **per-ABI** slices and ships Hermes bytecode differently. Re-measure with:

```bash
pnpm release:app:android   # or EAS production AAB
# then:
bundletool get-size total --apks=app.apks
```

**Native takeaway:** Install size is driven by **RN/Hermes/Reanimated/QuickCrypto/.so**, not by whether each of the 162 routes uses `React.lazy`. Route code-splitting will not shrink those native libraries.

---

## 3. Do we need more lazy loading?

### 3.1 Component / route `React.lazy` for its own sake — **No (native), Optional (web)**

| Platform | Recommendation |
|----------|----------------|
| **iOS / Android production** | **Skip.** Expo docs: async / split routes are **not** applied as production native bundle splits; suspense boundaries are disabled when bundling native production. Wrapping every screen in `React.lazy` adds complexity without a meaningful download win. |
| **Web production** | **`asyncRoutes.web: true` is on** (~458 chunks). Do **not** hand-wrap every screen in `React.lazy`. Further wins come from shrinking `__common` (what ≥2 routes share), not more route wrappers. |
| **UI atoms** (`PressableScale`, cards, rows) | **Do not lazy-load.** Cost is tiny; churn hurts DX. |

Official reference: [Async routes (Expo Router)](https://docs.expo.dev/router/web/async-routes/).

### 3.2 Payload / startup — already done

Web asyncRoutes, Riyad `import()`, locale-on-demand, deferred fonts/color picker, and deep content imports are in place. Remaining work is listed in §4 and [`BACKLOG.md`](./BACKLOG.md#performance).


---

## 4. Open optimization work

Full list also in [`BACKLOG.md`](./BACKLOG.md#performance).

| ID | Task | Notes |
|----|------|-------|
| P1.5 | Android barcode / ML Kit assets | Debug APK packs ~0.86 MB TFLite under `assets/`. Exclude from release AAB if unused. |
| P2.1 | Device cold start | Mid-tier Android + one iPhone; optional [EAS Observe](https://docs.expo.dev/eas/observe/get-started/) |
| P2.2 | Release AAB / IPA size | Replace §2.4 debug numbers with Play download size / TestFlight |
| P2.4 | Metro treemap (optional) | Source-map explorer; attach top modules here |
| — | Further `__common` trim | Keep DUA/NAMES/search corpora out of modules shared by ≥2 routes |

Non-goals: blanket `React.lazy` on shared components; native production `asyncRoutes` without Expo documenting native splits.

## 5. Guides — how to improve (playbooks)

### Guide A — Decide “lazy routes or not?” in 30 seconds

```
Is the pain web download / parse of a giant shared `__common` / index chunk?
   → YES: keep Riyad/Qur’an ayah JSON on `import()`; deep-import content; trim modules shared by ≥2 routes (see §2.2).
   → asyncRoutes is already on for web — more React.lazy wrappers won’t fix `__common`.

Is the pain native install size?
   → Almost never fixed by React.lazy. Check ABIs, .so, unused native modules.

Is the pain opening Qur’an / Hadith memory?
   → Keep / extend deferred loaders and CDN; don't put corpora in static imports of shared modules.
```

### Guide B — Turn on web async routes

1. In `apps/app` app config (`app.json` / `app.config.js`), set the Expo Router plugin `asyncRoutes` as in P0.1.  
2. Clear Metro: `pnpm --filter app dev:web:clear` or export with a clean cache.  
3. `pnpm --filter app build:web`.  
4. Compare `find dist/_expo/static/js/web -name '*.js' -exec ls -la {} \;`.  
5. Smoke-test deep links (`/quran`, `/learn-quran/...`, `/settings/appearance`) for Suspense flashes; add a small shared fallback if needed.  
6. Keep `asyncRoutes` **off for native production** until Expo documents native production splitting (still web-first as of SDK 57 docs).

### Guide C — Convert a fat JSON static import to deferred load

Pattern already used in `quran-loader.ts`:

```ts
// Avoid (eager — Metro embeds in the parent JS graph, even inside a function):
import riyad from "@/assets/data/hadith/riyad-as-salihin.json";
// Also avoid: require("…json") — still a static dependency of the module.

// Prefer (async chunk on web):
let cached: BundledHadithCollection | undefined;
export async function ensureRiyad() {
  cached ??= (await import("@/assets/data/hadith/riyad-as-salihin.json"))
    .default as BundledHadithCollection;
  return cached;
}
```

Call sites (`search.ts`, hadith screens, repositories) should go through `ensureBundledCollection` / async getters so Riyad is never a static `require` of a module that ends up in `__common`.

### Guide D — Locale splitting sketch

```ts
// Boot with English only
import en from "./en.json";

await i18n.init({ resources: { en: { translation: en } }, lng: "en", ... });

// When user picks Arabic:
const ar = (await import("./ar.json")).default;
i18n.addResourceBundle("ar", "translation", ar, true, true);
await i18n.changeLanguage("ar");
```

Preserve the existing i18n guard/parity tests (they can keep importing all locales). **Shipped** in `apps/app/src/i18n/index.ts`.

### Guide E — Re-measure checklist (after perf PRs)

- [ ] Web: critical path bytes + gzip + chunk count (§2.2)
- [ ] Web: Lighthouse TBT / LCP on `/` and `/tracker` (§2.5)
- [ ] Native: cold start ms (same device, 3 runs avg)
- [ ] Release AAB download size (not debug APK)
- [ ] Confirm Riyad / Qur’an ayah JSON not required to paint home

### Guide F — What **not** to do

- Do not wrap every UI primitive in `React.lazy` / `Suspense`.  
- Do not enable native production `asyncRoutes` expecting smaller IPA/APK JS without verifying Expo’s current native behavior.  
- Do not hand-edit generated `assets/data/**` or `quran-loader.ts` — change builders (`pnpm --filter app build:data`).  
- Do not use `require("…json")` for “lazy” web loads — Metro still embeds those as static deps of the parent module; use `import()`.  
- Do not stash “optimization” behind packing scripture into opaque formats; keep offline-first readable assets and defer **load**, don’t obfuscate.

---

## 6. Already in good shape (don’t “fix” blindly)

| Area | Why it’s OK |
|------|-------------|
| Qur’an lazy loaders + `quran-meta` | Per-surah `require` maps for readers; meta-only module for home/search/light paths |
| Search indexes | Lazy Fuse; `ensureAyahFuse()` dynamic-imports `@/lib/quran`; `preloadSearchCorpora()` |
| Remote corpora | Cache-first CDN for extras |
| Single native JS bundle | Matches Hermes / Expo production model |
| No per-component lazy | Correct default for this codebase size |
| Web async routes | Enabled; ~458 chunks |

---

## 7. Suggested acceptance targets

Lab baselines exist (§2.5). Stretch goals below are **not** CI gates yet — tighten after `__common` shrinks further and device/AAB numbers land.

| Surface | Stretch target | Current |
|---------|----------------|-------------------|
| Web entry JS (gzip) | **&lt; 1.5 MB** critical path (home), rest async | ~**3.4 MB** — in progress |
| Web entry JS (raw) | **&lt; 6 MB** critical path | ~**19 MB** — in progress |
| Home does not parse Riyad JSON | Required | **Met** (own async chunk) |
| Native cold start (mid Android) | Measure first; then no-regression / −10% | **Open** |
| Store download (arm64-v8a) | Track after first release AAB | **Open** |

---

## 8. Related docs

- [`FREE_OPEN_SOURCE_DATA.md`](./FREE_OPEN_SOURCE_DATA.md) — bundle vs CDN policy for religious data  
- [`DATA_INGESTION.md`](./DATA_INGESTION.md) — content pipeline  
- [`FEATURES.md`](./FEATURES.md) / [`BACKLOG.md`](./BACKLOG.md) — product scope (this file is performance-only)  
- [`README.md`](./README.md) — doc index
- Expo: [Async routes](https://docs.expo.dev/router/web/async-routes/), [Metro bundle splitting](https://docs.expo.dev/versions/v57.0.0/config/metro/#bundle-splitting), [EAS Observe](https://docs.expo.dev/eas/observe/get-started/)

---
