# Translations status

Last updated: **2026-07-09**. **23 app locales** live (`en` + 22 translations). Operational workflows: [`I18N_GUIDE.md`](I18N_GUIDE.md).

## Summary

| Phase | Locales | UI catalog | Learn overlays | Scripture UI | Status |
|-------|---------|------------|----------------|--------------|--------|
| 1 | `en`, `ar`, `ur` | Human-reviewed | Complete | Full | **Shipped** |
| 2 | `id`, `tr`, `bn`, `ms`, `fa` | Key parity + polish | 12 modules each | `bn`/`id`/`ms` partial+ | **Shipped** |
| 3 | `fr`, `ha`, `sw`, `ru`, `az`, `ps` | Key parity + polish | Native overlays | `fr`/`ru` hadith remote | **Shipped** |
| 4 | `so`, `uz`, `kk`, `ku`, `bs`, `sq`, `ky`, `tg`, `tk` | Key parity + polish | Native overlays | English fallback | **Shipped** |

**CI:** App i18n **152/152** tests · Shared overlay coverage ≥90% · SEO **22×114** routes · ICU plural audit for `ar`/`ru`/`bn`.

## Recent work (2026-07)

| Area | Done |
|------|------|
| **Bengali Hisnul** | ThelightHub `dua-api` (~128/270 duas) in `build-adhkar.mjs`; manifest adhkar v7 |
| **Hadith OSS** | Remote editions for `ur`, `id`, `tr`, `bn`, `fr`, `ru` via fawazahmed0; `resolveHadithTranslation()` + per-locale cache |
| **ICU plurals** | `plural-audit.test.ts`; `_few`/`_many` filled for `ru`; `ar`/`bn` audited |
| **Web hreflang** | Locale-prefixed URLs (`/ar/…`), distinct hreflang tags, static HTML copies, router bootstrap |
| **Russian UI** | Runglish removed (`fix-runglish` + `catalog-overrides/ru.json`); high-traffic screens in natural Russian |
| **UI polish** | **731** curated patches via `ui-polish-patches.json` across 19 locales |
| **Garbled locales** | `az`, `ps`, `so`, `uz`, `tg` — corruption reset to clean English (native UI polish backlog) |

## Architecture (quick reference)

- **UI:** `apps/app/src/i18n/{locale}.json` → `t()` / `i18n.t`
- **Registry:** `packages/shared/src/i18n/locale-registry.ts` (single source for flags, BCP-47, RTL, Qur'an edition, scripture flags)
- **Learn:** English in `packages/shared/src/content/*.ts` + `content/i18n/*.{locale}.ts`
- **Scripture:** `apps/app/src/lib/translation-locale.ts` + `build-data` pipeline
- **Hadith:** `packages/shared/src/i18n/hadith-editions.ts` + `apps/app/src/api/hadith-remote.ts`

See [`I18N_GUIDE.md`](I18N_GUIDE.md) for full architecture, scripts, and checklists.

## UI catalogs

| Files | Notes |
|-------|-------|
| `en.json` | Source of truth (~97 namespaces, ~3,600 keys) |
| `ar.json`, `ur.json` | Phase 1 — human-reviewed; Latin-leakage guard |
| Phase 2–4 (20 files) | Key parity with `en.json`; quality varies |

**Intentional English-identical values:** brands (`Munib Tracker`), store names, Arabic brand dua, format hints, Islamic loanwords (`Salah`, `Qaza`, `Ramadan`), reciter/mosque names.

**New keys workflow:** `merge-missing-keys.mjs` → translate or add to `ui-polish-patches.json` → `apply-ui-polish.mjs` → `pnpm --filter app test -- i18n`.

## Learn content overlays

`packages/shared/src/content/i18n/` — all 22 non-English locales, 12 modules each. `coverage.test.ts` enforces ≥90% non-English string fill vs English base (not native-language QA).

## Scripture / build-data

| Content | Locales with bundled / remote translations | Source |
|---------|---------------------------------------------|--------|
| **Qur'an** | All 23 (22 + `tk` → `tr-diyanet`) | fawazahmed0 / bundled editions |
| **Dua/zikr** | `bn` (ThelightHub dua-api), `id` (fitrahive subset), Qur'anic backfill for 20 locales | `build-adhkar.mjs` |
| **Hadith (remote)** | `ur`, `id`, `tr`, `bn`, `fr`, `ru`; `ar` → Arabic field; highlights bundled English | fawazahmed0 + `hadith-remote.ts` |
| **99 Names** | `id`, `ms`, `fr`, `ur`, `bn` | gist, islamic-json, KabDeveloper, asmaul-husna-api |

`scriptureSupported: true` in registry: **`en`, `ar`, `ur`, `bn`, `id`, `ms`, `fr`**.

**Not available without new OSS:** Full Hisnul for `ur`/`tr`/`fr`/etc. — runtime English fallback via `resolveTranslationField()`; do not AI-generate.

After pipeline changes:

```bash
pnpm --filter app build:data
```

## Maintenance scripts

```bash
# UI catalogs (apps/app/scripts/i18n/)
node apps/app/scripts/i18n/merge-missing-keys.mjs
node apps/app/scripts/i18n/apply-ui-polish.mjs [loc...]
node apps/app/scripts/i18n/fix-runglish-catalog.mjs ru
node apps/app/scripts/i18n/audit-en-identical.mjs
node apps/app/scripts/i18n/apply-seo-translations.mjs all

# Tests
pnpm --filter app test -- i18n
pnpm --filter @munib-tracker/shared test

# Scripture
pnpm --filter app build:data
```

Full script table: [`I18N_GUIDE.md`](I18N_GUIDE.md#maintenance-scripts-appsappscriptsi18n).

## Backlog

| Area | Status | Next steps |
|------|--------|------------|
| **UI — Phase 3/4 garbled locales** | Clean English fallback | Expand `ui-polish-patches.json` for `az`, `ps`, `so`, `uz`, `tg` high-traffic namespaces |
| **UI — loanwords** | Many locales keep `Salah`, `Adhkar`, etc. | Optional native labels where Muslims expect local terms |
| **Russian long-form** | ~392 keys still English in overrides | Translate educational prose in `catalog-overrides/ru.json` or directly in `ru.json` |
| **Bengali duas** | ~128/270 matched | Prefix/normalization in `build-adhkar.mjs` |
| **Full Hisnul** | No OSS for `ur`/`tr`/`fr` | Research only — no AI; English fallback until sourced |
| **Learn overlays** | Coverage ✓ | Literary human review |
| **Bundle size** | 23 Qur'an editions bundled | Profile APK/IPA; phased download if needed |
| **QA** | — | Per-locale device pass; optional translator style guide |
