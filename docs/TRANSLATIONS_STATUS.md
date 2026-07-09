# Translations status

Last updated: 2026-07-09. **23 app locales** (`en` + 22 translations) — UI catalogs shipped; CI green.

## Summary

| Phase | Locales | UI catalog | Learn overlays | Status |
|-------|---------|------------|----------------|--------|
| 1 | `en`, `ar`, `ur` | Complete (human-reviewed) | `ar`/`ur` complete | **Shipped** |
| 2 | `id`, `tr`, `bn`, `ms`, `fa` | Complete (key parity) | All modules present; native quality varies | **Shipped** |
| 3 | `fr`, `ha`, `sw`, `ru`, `az`, `ps` | Complete | Native overlays | **Shipped** |
| 4 | `so`, `uz`, `kk`, `ku`, `bs`, `sq`, `ky`, `tg`, `tk` | Complete | Native overlays | **Shipped** |

**CI:** App i18n 149/149 · Shared overlay coverage 2432/2432 · SEO locale JSON 22×114 routes.

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
| `id.json` … `tk.json` (20 files) | Phase 2–4 — Composer-translated; key parity with `en.json` |

New `en.json` keys: run `merge-missing-keys.mjs` (copies English fallback), then translate manually.

## Learn content overlays

See overlay files under `packages/shared/src/content/i18n/` — all 22 non-English locales have 12 modules each; `coverage.test.ts` enforces ≥90% non-English string fill vs the English base (not native-language QA).

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
```

**Learn overlays (`packages/shared/scripts/`):**

```bash
node packages/shared/scripts/clone-overlay-seed.mjs --restore-all  # rebuild overlay TS from seeds
node packages/shared/scripts/fix-overlay-quotes.mjs <file.ts>      # escape quotes in overlay TS
```

## Remaining backlog (optional / dataset-dependent)

Nothing blocks shipping. What is left is polish and content sourcing:

| Area | Status | What's left |
|------|--------|-------------|
| **UI catalogs** | Key parity ✓, CI green | ~1,305 strings still English-identical repo-wide (Islamic loanwords, brands, `{{placeholders}}`, place names). Worst: `ha` (141), `ku` (124), `bs` (115). Expand `ui-polish-patches.json` if you want more native labels. |
| **Learn overlays** | 12 modules × 22 locales, coverage ✓ | Literary review only — no structural gaps. |
| **Qur'an** | **22 locale-default editions bundled offline** (`quran-edition-defs.json` → `build-quran.mjs`) | `tk` uses Turkish Diyanet (`tr-diyanet`) — no Turkmen edition in fawazahmed0. `ar-tafsir-muyassar` stays remote (full-edition slug unavailable on CDN). |
| **Dua / zikr / names** | **`bn`** (Hisnul CSV), **`id`** (fitrahive + names gist), **`ms`** (names: islamic-json); Qur'anic duas get per-locale ayah text from bundled mushaf | Full Hisnul corpus for locales beyond `bn`/`id` needs new approved dataset columns — cannot AI-generate. `scriptureSupported: true` only for `en`, `ar`, `bn`, `id`, `ms`. |
| **Static web SEO** | Done | `inject-seo-head.mjs` + `hreflang` sitemap. Optional: run web export with `SEO_LOCALE=ar` etc. for locale-primary HTML shells. |
| **Bengali font** | **Done** — `NotoSansBengali-Regular.ttf` in `assets/fonts/`, registered in `_layout.tsx` | — |
| **QA / docs** | — | Per-locale device pass; translator style guide not written. |
