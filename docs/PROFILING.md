# Munib Tracker — Profiling & optimization

> **Purpose:** Profile of `apps/app` + actionable performance backlog (updated **2026-07-12**). **Active tasks:** [`BACKLOG.md`](./BACKLOG.md#performance).
>
> **Apps covered:** `apps/app` (iOS / Android / Web). Marketing site and API are out of scope.
>
> **Verdict (read this first):**  
> - **Native (iOS/Android): further React.lazy / per-route code-splitting is not required.** Metro already ships one Hermes-friendly JS graph; Expo’s production async routes still do **not** split native bundles. Keep the single-load app shell. Optimize **payload and startup work**, not screen module wrappers.  
> - **Web: async routes + graph trims landed (2026-07-12).** Export now emits **~458 JS chunks**; home critical path is **~19 MB raw / ~3.4 MB gzip** (down from a single ~62 MB / ~12 MB gzip entry on 2026-07-09). Lab Lighthouse: mobile `/` **39** / desktop **62** (was 27 / 44). Remaining debt is mostly `__common` (~15 MB / ~2.5 MB gzip) — shared runtime + Nawawi + content still pulled by multi-route modules. Continue trimming search corpora / content deep-imports; Qur’an ayah JSON and Riyad are off the critical path.

---

## 1. How this profile was run

| Method | What it measures | Limits |
|--------|------------------|--------|
| Filesystem sizes | Routes, `src/`, `assets/data`, shared content | Disk ≠ parse cost |
| `apps/app/dist` web static export (**2026-07-12**) | JS chunk count / size / gzip | Regenerated after asyncRoutes + graph fixes |
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

### 2.2 Web production export (`apps/app/dist`) — 2026-07-12

| Artifact | Size |
|----------|-----:|
| JS files under `dist/_expo/static/js/web/` | **~458** chunks (asyncRoutes working) |
| Home critical path (sum of scripts in `index.html`) | **~19.0 MB** raw / **~3.4 MB** gzip -9 |
| `__common-*.js` (shared) | **~15.5 MB** raw / **~2.53 MB** gzip |
| Largest route/`index` chunk | **~4.0 MB** raw / **~0.98 MB** gzip |
| Riyad JSON | **own async chunk** (~4.1 MB raw / ~0.64 MB gzip) — **not** required to paint home |
| Color picker | **own async chunk** (~535 KB) — absent from `__common` |
| Locale catalogs (`ar`, `ur`, …) | **own async chunks** (~500–580 KB each) |

**Historical baselines (do not confuse with current):**

| Date | Shape | Critical / main |
|------|-------|-----------------|
| 2026-07-07 | ~1 fat `index-*.js` | ~21.5 MB / ~4.2 MB gzip |
| 2026-07-09 | ~1 fat entry still | ~62 MB / ~12 MB gzip |
| 2026-07-12 (pre graph trim, async on) | 456 chunks; fat `__common` | ~24 MB / ~4.2 MB gzip critical |
| **2026-07-12 (after graph trim)** | 458 chunks | **~19 MB / ~3.4 MB gzip critical** |

**`__common` probes (2026-07-12 after):** `assets/data/quran/arabic` **absent**; `reanimated-color-picker` **absent**; Riyad full JSON **absent** (id strings only); still present: `DUA_ITEMS`, `NAMES_OF_ALLAH`, Nawawi40, Scheherazade asset refs.

**Interpretation:** First paint no longer downloads the whole app as one file, but home still parses a large shared chunk. Next wins: keep search corpora / names out of modules shared by ≥2 routes, and shrink `__common` toward the §7 budgets.

### 2.3 Content already deferred vs eager

| Payload | Mechanism | Startup impact |
|---------|-----------|----------------|
| Qur’an per-surah / page JSON | `quran-loader` `require()` maps; home uses `quran-meta` + dynamic `import("@/lib/quran")` for cards/search | **Good for home** — ayah JSON out of `__common`; still heavy when Qur’an routes load |
| QCF V2 page fonts | Download + cache (`qcf-font-cache.ts`) | **Good** — not blocking splash |
| Remote hadith / extra Qur’an editions | CDN + cache APIs | **Good** |
| Riyad as-Salihin | `import()` via `ensureBundledCollection` (`hadith-bundled.ts`) | **Good** — own async chunk; Nawawi stays sync for home/search |
| Content barrel | Progress stores + excused picker use **deep** `@munib-tracker/shared/content/*`; search corpora `import()` | **Improved** — full barrel no longer on Auth→blob path; duas/names can still land in `__common` if shared |
| i18n locales | `en` static; others `import()` in `i18n/index.ts` | **Good** |
| Arabic / Bengali fonts | Root loads Bengali + **active** Arabic face only; full Arabic set on Settings → Fonts; no Google Fonts CSS in `+html.tsx` | **Good** |
| `reanimated-color-picker` | `React.lazy` from `settings/appearance` | **Good** — own chunk |

Search (`src/lib/search.ts`) lazy-builds Fuse indexes, uses `quran-meta` for surah names, and **`ensureAyahFuse()`** dynamic-imports `@/lib/quran` for ayah full-text — keep that pattern.

### 2.5 Chrome Lighthouse (lab, local static export)

Served with `npx serve apps/app/dist -l 4173`. Reports under `apps/app/.lighthouse/`.

**Before graph trim (asyncRoutes on, ~24 MB / ~4.2 MB gzip critical):**

| Page | Form | Score | FCP | LCP | TBT | SI | TTI |
|------|------|------:|-----|-----|-----|-----|-----|
| `/` | mobile | 27 | 12.5 s | 36.6 s | 2.3 s | 13.2 s | 36.7 s |
| `/tracker` | mobile | 26 | 12.5 s | 36.4 s | 3.0 s | 13.8 s | 36.5 s |
| `/` | desktop | 44 | 0.6 s | 6.3 s | 590 ms | 3.2 s | 6.3 s |
| `/tracker` | desktop | 44 | 0.5 s | 6.6 s | 620 ms | 3.1 s | 6.6 s |

**After graph trim (~19 MB / ~3.4 MB gzip critical):**

| Page | Form | Score | FCP | LCP | TBT | SI | TTI |
|------|------|------:|-----|-----|-----|-----|-----|
| `/` | mobile | 39 | 0.9 s | 27.6 s | 2.0 s | 9.2 s | 27.9 s |
| `/tracker` | mobile | 40 | 0.9 s | 26.6 s | 1.5 s | 10.0 s | 26.7 s |
| `/` | desktop | 62 | 0.2 s | 4.7 s | 260 ms | 2.4 s | 4.9 s |
| `/tracker` | desktop | 58 | 0.2 s | 4.6 s | 320 ms | 2.6 s | 4.6 s |

CLS was **0** on all before/after runs. Mobile FCP improved dramatically (~12.5 s → ~0.9 s); LCP/TBT still dominated by parsing `__common`.

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

### 3.2 Payload / startup optimizations — status (2026-07-12)

| Item | Status |
|------|--------|
| 1. Stop eager multi‑MB hadith JSON (Riyad) | **Done** — `import()` + `ensureBundledCollection` |
| 2. Split web JS by route (`asyncRoutes`) | **Done** |
| 3. Locale-on-demand (`en` + active) | **Done** |
| 4. Defer settings-only heavy UI / fonts | **Done** — lazy color picker; active Arabic face + Settings → Fonts; no Google Fonts CSS in `+html` |
| 5. Measure cold start (device + web lab) | **Partial** — web Lighthouse lab done (§2.5); device cold-start + release AAB still open |

**Next:** keep DUA/NAMES/search corpora out of modules shared into `__common`; optional Metro treemap (P2.4).

---

## 4. Optimization backlog (TODO)

Priority: **P0** = clear measured pain · **P1** = solid ROI · **P2** = polish / measure-first.

### P0 — Web first-load & JS graph

- [x] **P0.1 Enable Expo Router async routes on web**  
  - Config: `["expo-router", { "asyncRoutes": { "web": true, "android": false, "ios": false } }]` in `app.json`.  
  - Re-run `pnpm --filter app build:web` and confirm **multiple** `dist/_expo/static/js/web/*.js` chunks, not one ~22 MB file.  
  - Acceptance: home HTML’s critical JS drops substantially; infrequently used trees (`learn-quran/*`, `jahannam/*`, deep settings) load on navigation.

- [x] **P0.2 Stop statically importing Riyad into the JS bundle**  
  - Nawawi40 eager; Riyad via **`import()`** + `ensureBundledCollection` (not `require()` — Metro still embeds `require` targets).  
  - Acceptance: Riyad is a **separate** `riyad-as-salihin-*.js` chunk; home critical path does not include the full JSON.

- [x] **P0.3 Re-export web & record a new size table**  
  - Done 2026-07-12 — see §2.2 (458 chunks; ~19 MB / ~3.4 MB gzip critical path).

### P1 — Startup work & secondary weight

- [x] **P1.1 Locale-on-demand i18n**  
  - Load `en` always; dynamically import the active locale JSON when language is selected or detected (all 23 catalogs).  
  - Keep `i18n-guard` / parity tests importing catalogs as needed for CI.  
  - Acceptance: cold start with English does not parse the other 22 locale JSON files.

- [x] **P1.2 Font strategy**  
  - Root deferred load: Bengali + **active** Arabic family only; Settings → Fonts registers full `ARABIC_FONT_FILES`.  
  - Removed render-blocking Google Fonts CSS from `+html.tsx` (bundled OFL Bengali).  

- [x] **P1.3 Lazy-load settings-only heavy UI**  
  - Color picker lazy; confirmed absent from `__common`. QR warmup + MiniPlayer / adhan bridge behind `IdleMount`.  

- [x] **P1.4 Narrow `@munib-tracker/shared/content` imports where cheap**  
  - Progress stores + excused picker deep-import; `blob-sync` dynamic from `sync-engine`; search corpora via `import()` + `preloadSearchCorpora`. Further barrel sweeps remain incremental.

- [ ] **P1.5 Android barcode / ML Kit assets**  
  - Debug APK packs ~0.86 MB ML Kit barcode TFLite under `assets/`. Confirm whether a dependency (e.g. scanner / auth / image pipeline) needs it; exclude if unused.  
  - Acceptance: release AAB asset dump has no barcode models unless a feature uses them.

### P2 — Measure & monitor

- [ ] **P2.1 Device cold start**  
  - Record time-to-interactive on a mid-tier Android + one iPhone for: cold kill → home interactive.  
  - Optional: add [EAS Observe](https://docs.expo.dev/eas/observe/get-started/) (`markInteractive`) for production percentiles.

- [ ] **P2.2 Release AAB / IPA size**  
  - Replace §2.4 debug numbers with Play **download size** and TestFlight build size.

- [x] **P2.3 Web Lighthouse / CrUX**  
  - Lab run 2026-07-12 against local `serve dist` (Chrome headless). See §2.5. Field CrUX still optional after deploy.

- [ ] **P2.4 Metro treemap (optional)**  
  - Generate a source-map explorer / Expo bundle visualizer on web export; attach top 20 modules to this doc.

- [ ] **P2.5 Avoid premature `React.lazy` on shared components**  
  - Explicit non-goal unless a treemap shows a single optional dependency &gt; ~200–300 KB gzip unique to one screen.

---

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

### Guide E — Re-measure checklist (copy into PR descriptions)

- [x] Web: main / critical path bytes + gzip + chunk count (2026-07-12 — §2.2)  
- [x] Web: Lighthouse TBT / LCP on `/` and `/tracker` (2026-07-12 — §2.5)  
- [ ] Native: cold start ms (same device, 3 runs avg)  
- [ ] Release AAB download size (not debug APK)  
- [x] Confirm Riyad / Qur’an ayah JSON not required to paint home  

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

| Surface | Stretch target | 2026-07-12 status |
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

## 9. Changelog

| Date | Note |
|------|------|
| 2026-07-12 | Fresh `build:web` + Chrome Lighthouse. AsyncRoutes → ~458 chunks. Graph fixes: Riyad `import()`, `quran-meta`, knowledge-card/search dynamic Qur’an, deep content imports, lazy blob-sync, font/IdleMount/Google Fonts trim. Critical path ~19 MB / ~3.4 MB gzip (was ~62 MB / ~12 MB on 07-09). P0.3 + P2.3 lab Lighthouse recorded. |
| 2026-07-08 | Initial profile from existing web `dist`, debug APK anatomy, asset/source inventory, and import-graph review. **Verdict: native route lazy-loading not required; web + eager multi‑MB JSON / locales / fonts are the real optimizations.** |
