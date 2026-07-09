# Active backlog

Consolidated open work across product, i18n, performance, devices, and content. **Shipped features** are in [`FEATURES.md`](./FEATURES.md). **How-to guides** are linked from [`README.md`](./README.md).

**Last updated:** 2026-07-09

---

## Product — data-blocked only

All software-achievable NF items are shipped. These need **OSS datasets** before implementation (do not AI-generate):

| ID | Feature | Blocker | When unblocked, start at |
|----|---------|---------|--------------------------|
| NF-2.7 | Word-by-word Qur'an | Large per-word dataset (QUL / quran.com) | [`FREE_OPEN_SOURCE_DATA.md`](./FREE_OPEN_SOURCE_DATA.md), new reader mode |
| NF-2.8 | Hadith sharh / explanation | Bundled or linked explanation corpus | Extend `HadithItem` + `build-hadith` |
| NF-2.9 | Full isnad chain | Structured `isnad[]` on `HadithItem` | Baseline `narrator` string already shown in UI |

Implementation flows for shipped NF items: [`archive/NEW_FEATURES_TODO.md`](./archive/NEW_FEATURES_TODO.md).

---

## Internationalization

Full ops guide: [`I18N_GUIDE.md`](./I18N_GUIDE.md)

| Priority | Task | How |
|----------|------|-----|
| P1 | Native UI for `az`, `ps`, `so`, `uz`, `tg` high-traffic screens | Expand `ui-polish-patches.json` |
| P2 | Full Hisnul for `ur`/`tr`/`fr` | Source OSS corpus; extend `build-adhkar.mjs` — no AI |
| P3 | Bengali dua coverage (~128/270 → higher) | Improve prefix matching in `build-adhkar.mjs` |
| P4 | Literary review of learn overlays | Human pass on `packages/shared/src/content/i18n/` |
| P5 | Bundle size (23 Qur'an editions) | Profile APK/IPA; phased download if needed |
| P6 | Per-locale device QA | Language picker, RTL, fonts, notifications, widgets |

**CI:** App i18n 152/152 tests · Shared overlay coverage ≥90% · 731 UI polish patches across 19 locales.

---

## Performance

Full profile + playbooks: [`PROFILING.md`](./PROFILING.md)

**Verdict:** Native route lazy-loading not required; **web ~22.5 MB single JS chunk** is the main debt.

| Priority | Task |
|----------|------|
| **P0** | Enable Expo Router `asyncRoutes` on web; defer Riyad hadith JSON import; re-measure |
| **P1** | Locale-on-demand i18n; trim root fonts; lazy settings UI; narrow `@munib-tracker/shared/content` imports; ML Kit audit |
| **P2** | Cold-start baseline; release AAB/IPA size; Lighthouse; Metro treemap |

---

## Device platforms

Full inventory: [`DEVICES.md`](./DEVICES.md)

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

## Content pipeline — deferred

See [`FREE_OPEN_SOURCE_DATA.md`](./FREE_OPEN_SOURCE_DATA.md) and [`DATA_INGESTION.md`](./DATA_INGESTION.md).

| Item | Notes |
|------|-------|
| Bundled adhan-call MP3 (full set) | Infra exists; expand `assets/audio/adhan/` |
| Per-item content `audioUri` | Types wired; populate from OSS where available |

---

## Historical MVP (complete)

Phases 0–12 in [`archive/TODO.md`](./archive/TODO.md) — all `done`. Do not add new tasks there.
