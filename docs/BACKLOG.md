# Active backlog

Open work only. Shipped features: [`FEATURES.md`](./FEATURES.md). Guides: [`README.md`](./README.md).

---

## Product — data-blocked

All software-achievable NF items are shipped. These need **OSS datasets** before implementation (do not AI-generate):

| ID | Feature | Blocker | When unblocked |
|----|---------|---------|----------------|
| NF-2.8 | Hadith sharh / explanation | Bundled or linked explanation corpus | Extend `HadithItem` + `build-hadith` |
| NF-2.9 | Full isnad chain | Structured `isnad[]` on `HadithItem` | Baseline `narrator` string already shown in UI |

---

## Internationalization

Guide: [`I18N_GUIDE.md`](./I18N_GUIDE.md)

| Priority | Task | How |
|----------|------|-----|
| P1 | Native UI for `az`, `ps`, `so`, `uz`, `tg` high-traffic screens | Fix mangled auto-translate strings; expand `ui-polish-patches.json`. Corrupted catalogs fall back to English via `fix-runglish-catalog.mjs`. |
| P2 | Full Hisnul for `ur`/`tr`/`fr` | Source OSS corpus; extend `build-adhkar.mjs` — no AI |
| P3 | Bengali dua coverage (~128/270 → higher) | Improve prefix matching in `build-adhkar.mjs` |
| P4 | Literary review of learn overlays | Human pass on `packages/shared/src/content/i18n/` |
| P5 | Per-locale device QA | Language picker, RTL, fonts, notifications, widgets |

---

## Performance

Profile + playbooks: [`PROFILING.md`](./PROFILING.md)

| Priority | Task |
|----------|------|
| P1 | Android barcode / ML Kit assets — confirm unused; exclude from release AAB if so |
| P2 | Device cold-start baseline (mid Android + one iPhone) |
| P2 | Release AAB/IPA size (replace debug APK numbers) |
| P2 | Further `__common` trim (RN/Expo runtime; remaining shared fragments) |
| P2 | Optional Metro treemap / source-map explorer |
| — | ~~Thinner home shell~~ — shipped: lazy `home-below-fold`, deferred store loads, SEO locale `import()`, lazy moon sheet / idle root overlays |

---

## Auth / App Links ops

Guides: [`OAUTH_SETUP.md`](./OAUTH_SETUP.md) · [`DEEP_LINKS.md`](./DEEP_LINKS.md) · [`PRODUCTION.md`](./PRODUCTION.md)

| Priority | Task |
|----------|------|
| P1 | Serve `.well-known/apple-app-site-association` + `assetlinks.json` from `my.munibtracker.app` at web build (`app.json` App Links + Apple OAuth route shipped; host verification files still needed) |
| P2 | Fill production OAuth secrets (`GOOGLE_OAUTH_*`, `APPLE_*`, `OAUTH_REDIRECT_URI_ALLOWLIST`) per environment |

---

## Device platforms

Support matrix: [`DEVICES.md`](./DEVICES.md)

| ID | Goal | Status |
|----|------|--------|
| DS-1 | Native tablet / large-screen polish | Not started |
| DS-2 | Watch / Wear maintenance QA | Built — release QA each native bump |
| DS-3 | Apple TV / Android TV | Not started |
| DS-4 | visionOS | Not started |
| DS-5 | CarPlay / Android Auto | Not started |
| DS-6 | Desktop native (PWA preferred) | Web shipped |
| DS-7 | Chromebook | Not started |
| DS-8 | Foldables / dual-screen | Not started |

---

## Content pipeline

See [`FREE_OPEN_SOURCE_DATA.md`](./FREE_OPEN_SOURCE_DATA.md) and [`DATA_INGESTION.md`](./DATA_INGESTION.md).

| Item | Notes |
|------|-------|
| Bundled adhan-call MP3 (full set) | Infra exists; expand `assets/audio/adhan/` |
| Per-item content `audioUri` | Types wired; populate from OSS where available |
