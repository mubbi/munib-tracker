# Munib Tracker — Profiling & optimization

> **Purpose:** 2026-07-08 profile of `apps/app` + actionable performance backlog. **Active tasks:** [`BACKLOG.md`](./BACKLOG.md#performance).
>
> **Apps covered:** `apps/app` (iOS / Android / Web). Marketing site and API are out of scope.
>
> **Verdict (read this first):**  
> - **Native (iOS/Android): further React.lazy / per-route code-splitting is not required.** Metro already ships one Hermes-friendly JS graph; Expo’s production async routes still do **not** split native bundles. Keep the single-load app shell. Optimize **payload and startup work**, not screen module wrappers.  
> - **Web: further optimization *is* warranted.** Production export currently emits **one ~22.5 MB JS chunk** (~4.2 MB gzip). That is the main performance debt. Prefer Expo Router `asyncRoutes` (web), deferred content imports, and locale/font trimming over hand-wrapping every component in `React.lazy`.

---

## 1. How this profile was run

| Method | What it measures | Limits |
|--------|------------------|--------|
| Filesystem sizes | Routes, `src/`, `assets/data`, shared content | Disk ≠ parse cost |
| Existing `apps/app/dist` (web static export, dated ~2026-07-07) | JS chunk count / size / gzip | Not regenerated in this session; treat sizes as directional until you re-export |
| Gzip of main web chunk | Transfer size on a warm CDN | Brotli may be slightly smaller in production hosting |
| String / payload probes inside web JS | Confirms hadith / duas / i18n / heavy libs are in the entry graph | Not a full Metro treemap |
| Debug APK zip breakdown (`android/.../app-debug.apk`) | Native `.so`, dex, fonts, assets | **Debug + multi-ABI (incl. x86_64)** — **not** a Play Store AAB size |
| Source inspection | Import shapes (`hadith.ts`, `i18n/index.ts`, `_layout.tsx`, Qur’an loaders) | Static analysis |

**Not run in this pass** (follow-ups if you need wall-clock numbers):

- Cold-start TTI / TTR on device (React Native Perf Monitor, Flipper, or [EAS Observe](https://docs.expo.dev/eas/observe/get-started/))
- Fresh `pnpm --filter app build:web` + annotated Metro source map / treemap
- Release AAB per-ABI download size (`bundletool get-size total`)
- Chrome Lighthouse / Web Vitals on the hosted PWA

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
| i18n JSON (`en` + `ar` + `ur`) | **~660 KB** raw |

### 2.2 Web production export (`apps/app/dist`)

| Artifact | Size |
|----------|-----:|
| `dist/` total | **~60 MB** (HTML for many routes + assets + one huge JS) |
| Main JS | `dist/_expo/static/js/web/index-*.js` → **22,495,095 bytes (~21.5 MB)** |
| Same file, gzip -9 | **~4.23 MB** |
| Other JS chunks | Tiny (~62 KB + ExtensionStorage); **effectively no route-level split** |
| `dist/assets` | **~6.4 MB** (many `.ttf` from Google-font packages + icons + adhan) |

**Markers confirmed inside the main JS graph:** Fuse, adhan, reanimated, react-native-svg, QR helpers, `reanimated-color-picker`, Material Symbols / Scheherazade names, `DUA_ITEMS` / `NAMES_OF_ALLAH` / guide topic tables, Nawawi/Riyad hadith titles, Qur’an loader factory strings (`assets/data/quran/arabic`), and all three i18n catalogs (loaded from `src/i18n/index.ts`).

**Interpretation:** Web first paint pays for **almost the entire app** before any navigation. Gzip helps transfer (~4 MB) but **parse/compile of ~22 MB of JS** on mid-tier phones is still expensive.

### 2.3 Content already deferred vs eager

| Payload | Mechanism | Startup impact |
|---------|-----------|----------------|
| Qur’an per-surah / page JSON (~9.1 MB on disk) | Deferred `require()` maps in `src/lib/quran-loader.ts` | **Good** — evaluated when a surah/page is opened; assets stay packable without parsing everything at boot |
| QCF V2 page fonts | Download + cache (`qcf-font-cache.ts`) | **Good** — not blocking splash |
| Remote hadith / extra Qur’an editions | CDN + cache APIs | **Good** |
| Riyad as-Salihin JSON (**~2.2 MB**) + Nawawi40 | **Static `import` in `src/lib/hadith.ts`** | **Bad for JS size / parse** — pulled into the JS graph whenever hadith/search touch the module |
| Entire `@munib-tracker/shared/content` barrel | **52 app files** import `@munib-tracker/shared/content` (no deep subpaths) | **Moderate** — large TS content modules end up in one graph early via guides + search |
| All 3 i18n locales | Static import in `src/i18n/index.ts` | **Moderate** — ~660 KB JSON always loaded |
| 4 Arabic TTFs via `useFonts(ARABIC_FONT_FILES)` in root `_layout.tsx` | Blocks render until fonts resolve | **Startup gate** — correct for offline Arabic, but all four register before first frame |
| `reanimated-color-picker` | Imported from appearance settings UI | Ends up in main graph today (seen in web JS) |

Search (`src/lib/search.ts`) already **lazy-builds Fuse indexes** and defers the heavy Qur’an ayah index — keep that pattern.

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
| **Web production** | **Yes — use Expo’s mechanism**, not ad-hoc wrappers on every component. Enable Router **`asyncRoutes` for web** so unused learning/settings routes are separate chunks. |
| **UI atoms** (`PressableScale`, cards, rows) | **Do not lazy-load.** Cost is tiny; churn hurts DX. |

Official reference: [Async routes (Expo Router)](https://docs.expo.dev/router/web/async-routes/).

### 3.2 Payload / startup optimizations — **Yes, prioritized**

These beat “lazy every component” for Munib:

1. Stop **eager JS-inlining** of multi‑MB hadith JSON.  
2. Split the **web** JS graph by route (`asyncRoutes`).  
3. Load **only the active locale** (plus English fallback) at boot.  
4. Defer **settings-only** heavy widgets (color picker, optional fonts).  
5. Measure real **cold start** before and after (device + web).

---

## 4. Optimization backlog (TODO)

Priority: **P0** = clear measured pain · **P1** = solid ROI · **P2** = polish / measure-first.

### P0 — Web first-load & JS graph

- [ ] **P0.1 Enable Expo Router async routes on web**  
  - Config (app config plugin): `["expo-router", { "asyncRoutes": { "web": true, "android": false, "ios": false } }]` (or `"development"` for native dev only if you want faster Metro).  
  - Re-run `pnpm --filter app build:web` and confirm **multiple** `dist/_expo/static/js/web/*.js` chunks, not one ~22 MB file.  
  - Acceptance: home HTML’s critical JS drops substantially; infrequently used trees (`learn-quran/*`, `jahannam/*`, deep settings) load on navigation.

- [ ] **P0.2 Stop statically importing Riyad into the JS bundle**  
  - Today: `src/lib/hadith.ts` does `import riyad from "@/assets/data/hadith/riyad-as-salihin.json"` (~2.2 MB raw).  
  - Prefer the same pattern as Qur’an: `() => require(...)` / async asset read **on first open of that collection or search index**, and keep Nawawi40 eager if you need it for daily hadith / knowledge cards.  
  - Acceptance: Riyad english samples no longer sit in the **entry** chunk; first open of Riyad may show a short loading state.

- [ ] **P0.3 Re-export web & record a new size table**  
  - After P0.1–P0.2, paste new main-chunk / gzip / chunk-count numbers into §2.2 (replace the 2026-07-07 baseline).

### P1 — Startup work & secondary weight

- [ ] **P1.1 Locale-on-demand i18n**  
  - Load `en` always; dynamically import `ar.json` / `ur.json` when language is selected or detected.  
  - Keep `i18n-guard` tests importing all three for parity.  
  - Acceptance: cold start with English does not parse ~480 KB of ur+ar JSON.

- [ ] **P1.2 Font strategy**  
  - Root `useFonts(ARABIC_FONT_FILES)` registers Amiri + Scheherazade + Noto Naskh + QPC Hafs before UI.  
  - Options: (a) load **default + currently selected** family first, defer the other picker fonts until Settings → Fonts; (b) ensure web does not also duplicate full `@expo-google-fonts/*` weight ranges if bundled OFL files already cover UI (audit why `dist/assets` still contains many Google-font TTFs ~several MB).  
  - Acceptance: splash / first frame no longer waits on unused typefaces.

- [ ] **P1.3 Lazy-load settings-only heavy UI**  
  - Dynamic-import `InlineCustomColorPicker` / `reanimated-color-picker` from `settings/appearance`.  
  - Same idea for QR / share stacks if not needed on home.  
  - Acceptance: color-picker module absent from home entry chunk (web treemap / source-map).

- [ ] **P1.4 Narrow `@munib-tracker/shared/content` imports where cheap**  
  - Prefer `import { X } from "@munib-tracker/shared/content/duas"` (or package exports) once export map supports it, so Metro can drope unused guide corpora from some entry paths.  
  - Do **not** block features on a full content-pack rewrite; do this incrementally with search / home first.

- [ ] **P1.5 Android barcode / ML Kit assets**  
  - Debug APK packs ~0.86 MB ML Kit barcode TFLite under `assets/`. Confirm whether a dependency (e.g. scanner / auth / image pipeline) needs it; exclude if unused.  
  - Acceptance: release AAB asset dump has no barcode models unless a feature uses them.

### P2 — Measure & monitor

- [ ] **P2.1 Device cold start**  
  - Record time-to-interactive on a mid-tier Android + one iPhone for: cold kill → home interactive.  
  - Optional: add [EAS Observe](https://docs.expo.dev/eas/observe/get-started/) (`markInteractive`) for production percentiles.

- [ ] **P2.2 Release AAB / IPA size**  
  - Replace §2.4 debug numbers with Play **download size** and TestFlight build size.

- [ ] **P2.3 Web Lighthouse / CrUX**  
  - LCP, TBT, JS boot cost on `/` and `/tracker` after async routes.

- [ ] **P2.4 Metro treemap (optional)**  
  - Generate a source-map explorer / Expo bundle visualizer on web export; attach top 20 modules to this doc.

- [ ] **P2.5 Avoid premature `React.lazy` on shared components**  
  - Explicit non-goal unless a treemap shows a single optional dependency &gt; ~200–300 KB gzip unique to one screen.

---

## 5. Guides — how to improve (playbooks)

### Guide A — Decide “lazy routes or not?” in 30 seconds

```
Is the pain web download / parse of a giant index-*.js?
  → YES: enable asyncRoutes for web + defer multi‑MB JSON imports.
  → NO: profile startup CPU / fonts / sync instead.

Is the pain native install size?
  → Almost never fixed by React.lazy. Check ABIs, .so, unused native modules.

Is the pain opening Qur’an / Hadith memory?
  → Keep / extend deferred require() and CDN; don't put corpora in static imports.
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
// Avoid (eager — Metro embeds in JS graph):
import riyad from "@/assets/data/hadith/riyad-as-salihin.json";

// Prefer (evaluate on first use):
const loadRiyad = () => require("@/assets/data/hadith/riyad-as-salihin.json");

let cached: BundledHadithCollection | undefined;
export function getRiyad() {
  cached ??= loadRiyad() as BundledHadithCollection;
  return cached;
}
```

Call sites (`search.ts`, hadith screens, repositories) should go through getters so the require does not run at module top-level during app boot.

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

Preserve the existing i18n guard/parity tests (they can keep importing all locales).

### Guide E — Re-measure checklist (copy into PR descriptions)

- [ ] Web: main chunk bytes + gzip + chunk count  
- [ ] Web: Lighthouse TBT / LCP on home  
- [ ] Native: cold start ms (same device, 3 runs avg)  
- [ ] Release AAB download size (not debug APK)  
- [ ] Confirm Riyad / full shared content not required to paint home  

### Guide F — What **not** to do

- Do not wrap every UI primitive in `React.lazy` / `Suspense`.  
- Do not enable native production `asyncRoutes` expecting smaller IPA/APK JS without verifying Expo’s current native behavior.  
- Do not hand-edit generated `assets/data/**` or `quran-loader.ts` — change builders (`pnpm --filter app build:data`).  
- Do not stash “optimization” behind packing scripture into opaque formats; keep offline-first readable assets and defer **load**, don’t obfuscate.

---

## 6. Already in good shape (don’t “fix” blindly)

| Area | Why it’s OK |
|------|-------------|
| Qur’an lazy loaders | Per-surah/page `require` factories |
| Search indexes | Lazy + deferred ayah index |
| Remote corpora | Cache-first CDN for extras |
| Single native JS bundle | Matches Hermes / Expo production model |
| No per-component lazy | Correct default for this codebase size |

---

## 7. Suggested acceptance targets (after P0/P1)

These are **goals**, not CI gates yet — set hard budgets once P2.1–P2.3 baselines exist.

| Surface | Stretch target |
|---------|----------------|
| Web entry JS (gzip) | **&lt; 1.5 MB** critical path (home), rest async |
| Web entry JS (raw) | **&lt; 6 MB** critical path |
| Home does not parse Riyad JSON | Required |
| Native cold start (mid Android) | Measure first; aim “no regression” then ≤ previous −10% if fonts/i18n deferred |
| Store download (arm64-v8a) | Track after first release AAB; optimize native deps only with evidence |

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
| 2026-07-08 | Initial profile from existing web `dist`, debug APK anatomy, asset/source inventory, and import-graph review. **Verdict: native route lazy-loading not required; web + eager multi‑MB JSON / locales / fonts are the real optimizations.** |
