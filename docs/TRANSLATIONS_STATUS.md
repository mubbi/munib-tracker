# Translations status

Last updated: 2026-07-09. **23 app locales** (`en` + 22 translations) — UI catalogs shipped; CI green.

## Summary

| Phase | Locales | UI catalog | Learn overlays | Status |
|-------|---------|------------|----------------|--------|
| 1 | `en`, `ar`, `ur` | Complete (human-reviewed) | `ar`/`ur` complete | **Shipped** |
| 2 | `id`, `tr`, `bn`, `ms`, `fa` | Complete (key parity) | All modules present; native quality varies | **Shipped** |
| 3 | `fr`, `ha`, `sw`, `ru`, `az`, `ps` | Complete | Native overlays | **Shipped** |
| 4 | `so`, `uz`, `kk`, `ku`, `bs`, `sq`, `ky`, `tg`, `tk` | Complete | Native overlays | **Shipped** |

**CI:** App i18n 149/149 · Shared overlay coverage 2400+/2400 · SEO locale JSON 22×114 routes.

## Architecture

- **UI strings:** `apps/app/src/i18n/{locale}.json` → `t()` / `i18n.t`
- **Learn modules:** English in `packages/shared/src/content/*.ts` + overlays in `packages/shared/src/content/i18n/*.{locale}.ts`
- **Scripture:** `apps/app/src/lib/translation-locale.ts` + `build-data` pipeline
- **Registry:** `packages/shared/src/i18n/locale-registry.ts`

## UI catalogs

| Files | Notes |
|-------|-------|
| `en.json` | Source of truth (~97 namespaces) |
| `ar.json`, `ur.json` | Phase 1 — human-reviewed Arabic/Urdu |
| `id.json` … `tk.json` (20 files) | Phase 2–4 — key parity with `en.json`; ~1,200 English-identical strings remain (loanwords, brands, placeholders) |

New `en.json` keys: run `merge-missing-keys.mjs` (copies English fallback), then translate manually or add to `ui-polish-patches.json`.

## Learn content overlays

See overlay files under `packages/shared/src/content/i18n/` — all 22 non-English locales have 12 modules each; `coverage.test.ts` enforces ≥90% non-English string fill vs the English base (not native-language QA).

## Scripture / build-data

| Content | Locales with bundled translations | Source |
|---------|-----------------------------------|--------|
| **Qur'an** | All 23 locales (22 translations + `tk` → `tr-diyanet`) | `quran-edition-defs.json` → fawazahmed0 (23 bundled editions incl. `ar-tafsir-siraj`) |
| **Dua/zikr** | `en`, `bn` (Hisnul CSV — **bn column empty upstream**), `id` (fitrahive subset), + Qur'anic duas for 20 locales via bundled mushaf | `build-adhkar.mjs` |
| **99 Names** | `id`, `ms`, `fr`, `ur`, `bn` | gist, islamic-json, KabDeveloper, asmaul-husna-api-coral |

`scriptureSupported: true` in locale registry: **`en`, `ar`, `ur`, `bn`, `id`, `ms`, `fr`**.

## Maintenance scripts

**App UI (`apps/app/scripts/i18n/`):**

```bash
node apps/app/scripts/i18n/merge-missing-keys.mjs       # sync new en keys → all locales
node apps/app/scripts/i18n/fix-placeholders.mjs         # repair corrupted {{interpolation}} tokens
node apps/app/scripts/i18n/sanitize-corrupted-catalog.mjs <loc>  # strip bad auto-translate strings
node apps/app/scripts/i18n/generate-flags.mjs           # create missing flag SVGs
node apps/app/scripts/i18n/apply-ui-polish.mjs [loc...]  # apply ui-polish-patches.json
node apps/app/scripts/i18n/generate-seo-locale-files.mjs  # scaffold seo-routes-locale/*.json from en
node apps/app/scripts/i18n/apply-seo-translations.mjs all # merge seo-translations/*.mjs → locale JSON
pnpm --filter app test -- i18n                          # parity + guard + duplicate-key
pnpm --filter @munib-tracker/shared test                # overlay coverage
pnpm --filter app build:data                              # regenerate scripture assets
```

**Learn overlays (`packages/shared/scripts/`):**

```bash
node packages/shared/scripts/clone-overlay-seed.mjs --restore-all  # rebuild overlay TS from seeds
node packages/shared/scripts/fix-overlay-quotes.mjs <file.ts>      # escape quotes in overlay TS
```

## Remaining backlog (optional)

| Area | Status | What's left |
|------|--------|-------------|
| **UI catalogs** | ~1,200 English-identical strings (down from ~1,340) | Mostly loanwords (`Salah`, `Qaza`, `Ramadan`), brands, `{{placeholders}}`, mosque/reciter names. Expand `ui-polish-patches.json` for more native labels. |
| **Learn overlays** | Coverage ✓ | Literary review only. |
| **Full Hisnul duas** | Only `en` + partial `id` + Qur'anic ayah backfill | No open OSS corpus with `ur`/`tr`/`fr`/etc. columns — needs contributor datasets; cannot AI-generate. |
| **Hisnul Bengali column** | CSV column exists but **empty upstream** | Find a Bengali Hisnul source or contributor PR to sheikhhanif repo. |
| **Bundle size** | 23 Qur'an editions bundled | Profile APK/IPA; consider phased download if size is a concern. |
| **QA** | — | Per-locale device pass; translator style guide optional. |
