# Internationalization guide (Munib Tracker)

Operational reference for **23 app locales** (`en` + 22 translations). For coverage tables and backlog, see [`TRANSLATIONS_STATUS.md`](TRANSLATIONS_STATUS.md). For the original quality bar and religious-text rules, see [`TRANSLATIONS_TODO.md`](TRANSLATIONS_TODO.md).

---

## Architecture

| Layer | Location | Runtime API |
|-------|----------|-------------|
| **Locale registry** | `packages/shared/src/i18n/locale-registry.ts` | `LOCALE_REGISTRY`, `getLocaleDefinition()` |
| **UI catalogs** | `apps/app/src/i18n/{locale}.json` | `t("namespace.key")` via `react-i18next` |
| **Learn overlays** | `packages/shared/src/content/i18n/*.{locale}.ts` | `localizeLearnContent()` in `packages/shared/src/content/i18n/localize.ts` |
| **Scripture resolver** | `apps/app/src/lib/translation-locale.ts` | `resolveTranslationField()`, `resolveHadithTranslation()`, `resolveQuranEditionId()` |
| **Hadith edition map** | `packages/shared/src/i18n/hadith-editions.ts` | fawazahmed0 prefixes per locale |
| **Web SEO / hreflang** | `apps/app/src/lib/locale-path.ts`, `src/config/seo.ts`, `scripts/inject-seo-head.mjs` | Locale-prefixed URLs (`/ar/…`, `/ur/…`; `en` unprefixed) |
| **Build pipeline** | `apps/app/scripts/build-data/` | `pnpm --filter app build:data` |

**Two language prefs** (Settings → Language):

- **`locale`** — app UI language (`*.json` catalog).
- **`translationLocale`** — meaning of bundled Arabic scripture (dua/zikr/Qur'an/hadith). Falls back to English when no OSS translation exists — never AI-generated.

---

## Locales (phases)

| Phase | Locales | UI quality expectation |
|-------|---------|------------------------|
| 1 | `en`, `ar`, `ur` | Human-reviewed; `i18n-guard` enforces no Latin leakage in `ar`/`ur` |
| 2 | `id`, `tr`, `bn`, `ms`, `fa` | Key parity; native polish for high-traffic screens |
| 3 | `fr`, `ha`, `sw`, `ru`, `az`, `ps` | Key parity; `ru` Runglish cleaned (2026-07-09) |
| 4 | `so`, `uz`, `kk`, `ku`, `bs`, `sq`, `ky`, `tg`, `tk` | Key parity; some catalogs use clean English fallback where auto-translate was garbled |

**RTL:** `ar`, `ur`, `fa`, `ps`, `ku` — see `apps/app/src/lib/i18n/rtl-locale.ts`.

**Scripture bundled (`scriptureSupported: true`):** `en`, `ar`, `ur`, `bn`, `id`, `ms`, `fr`.

---

## Adding or changing UI strings

### 1. Author English first

Add keys to `apps/app/src/i18n/en.json` under the correct namespace. Follow Islamic terminology in [`apps/app/AGENTS.md`](../apps/app/AGENTS.md) (Salah not Prayer, Zikr not Dhikr, etc.).

### 2. Sync all locale files

```bash
node apps/app/scripts/i18n/merge-missing-keys.mjs
```

Copies missing keys from `en.json` into every other locale (English fallback until translated).

### 3. Translate

**Phase 1 (`ar`, `ur`):** Edit `{locale}.json` directly — must pass Latin-leakage guard.

**Phase 2–4:** Prefer curated patches in `apps/app/scripts/i18n/ui-polish-patches.json`, then:

```bash
node apps/app/scripts/i18n/apply-ui-polish.mjs [locale...]
```

For bulk native labels, add `{ "locale.key": "Native text" }` entries to `ui-polish-patches.json` (preserve `{{variables}}` exactly).

### 4. Verify

```bash
pnpm --filter app test -- i18n
```

Tests: key parity, duplicate keys, terminology in English source, interpolation match, Phase-1 Latin leakage, ICU plurals (`ar`, `ru`, `bn`).

### 5. Audit English-identical strings (optional)

```bash
node apps/app/scripts/i18n/audit-en-identical.mjs [locale...]
```

Many identical values are intentional (brands, `Munib Tracker`, `App Store`, Arabic dua text, loanwords like Salah/Ramadan).

---

## ICU plurals

English uses `_one` / `_other`. Locales with richer CLDR categories need extra suffixes:

| Locale | Extra suffixes (when probed) |
|--------|----------------------------|
| `ar` | `_zero`, `_two`, `_few`, `_many` |
| `ru` | `_few`, `_many` |
| `bn` | `_one`, `_other` (audit ensures coverage) |

Enforced by `apps/app/src/i18n/plural-audit.test.ts`. When adding a new plural stem in `en.json`, add all required suffixes for `ar`, `ru`, and `bn`.

---

## Fixing bad auto-translations

Two repair paths:

| Script | When to use |
|--------|-------------|
| `sanitize-corrupted-catalog.mjs <loc>` | Values contain `MYMEMORY WARNING` — resets to English |
| `fix-runglish-catalog.mjs <loc>` | Mixed-script / Runglish corruption (`pryer`, `Trcker`, etc.) — uses `catalog-overrides/{loc}.json` if present, else English |

```bash
node apps/app/scripts/i18n/fix-placeholders.mjs      # broken {{interpolation}}
node apps/app/scripts/i18n/sanitize-corrupted-catalog.mjs az
node apps/app/scripts/i18n/fix-runglish-catalog.mjs ru   # uses catalog-overrides/ru.json
```

**Do not** hand-translate Qur'an, hadith, or dua *body text* in JSON catalogs — only UI chrome.

---

## Scripture & build-data

Regenerate bundled content after changing `apps/app/scripts/build-data/`:

```bash
pnpm --filter app build:data
# or partial: node apps/app/scripts/build-data/index.mjs adhkar
```

| Content | Bundled translations | Source |
|---------|---------------------|--------|
| **Qur'an** | All 23 locales | `quran-edition-defs.json` → fawazahmed0 |
| **Dua/zikr/durood** | `bn` (~128/270 via API match), `id` (fitrahive subset), Qur'anic duas for 20 locales | `build-adhkar.mjs` |
| **Hadith (remote)** | `ur`, `id`, `tr`, `bn`, `fr`, `ru` | `hadith-remote.ts` + fawazahmed0 editions |
| **99 Names** | `id`, `ms`, `fr`, `ur`, `bn` | Multiple OSS APIs (see `FREE_OPEN_SOURCE_DATA.md`) |

**Runtime resolution:** `resolveTranslationField()` for dua/zikr; `useHadithTranslation()` / `resolveHadithTranslation()` for hadith; cache key includes `translationLocale`.

**Blocked without new OSS data:** Full Hisnul for `ur`, `tr`, `fr`, `ms`, `fa`, etc. — English fallback at runtime. Do not AI-generate scripture.

---

## Learn module overlays

English base: `packages/shared/src/content/*.ts`. Per-locale overlays: `packages/shared/src/content/i18n/*.{locale}.ts`.

```bash
node packages/shared/scripts/clone-overlay-seed.mjs --restore-all
node packages/shared/scripts/fix-overlay-quotes.mjs <file.ts>
pnpm --filter @munib-tracker/shared test   # coverage.test.ts ≥90% non-English fill
```

Literary QA is manual; coverage test only checks string presence vs English.

---

## Web SEO & hreflang

| Piece | Path |
|-------|------|
| Route metadata (English base) | `apps/app/src/config/seo-routes.data.json` |
| Per-locale SEO copy | `apps/app/scripts/i18n/seo-translations/{locale}.mjs` |
| Generated locale JSON | `apps/app/src/config/seo-routes-locale/*.json` |
| hreflang + canonical | `apps/app/src/components/seo/seo.tsx`, `src/config/seo.ts` |
| Locale-prefixed paths | `apps/app/src/lib/locale-path.ts` |
| Static export copies | `apps/app/scripts/inject-seo-head.mjs` |
| Client boot (strip prefix) | `apps/app/src/app/+html.tsx`, `locale-path-bootstrap.tsx` |

```bash
node apps/app/scripts/i18n/generate-seo-locale-files.mjs
node apps/app/scripts/i18n/apply-seo-translations.mjs all
```

---

## Adding a new locale (checklist)

1. Add entry to `packages/shared/src/i18n/locale-registry.ts` and `app-locale.ts`.
2. Create `apps/app/src/i18n/{code}.json` via `merge-missing-keys.mjs`.
3. Add flag SVG under `apps/app/assets/flags/` (`generate-flags.mjs`).
4. Add SEO overlay `seo-translations/{code}.mjs` + run apply-seo-translations.
5. Add learn overlays for all 12 modules (or seed + translate).
6. Wire Qur'an edition in registry if fawazahmed0 has one.
7. If hadith translation exists on fawazahmed0, add to `hadith-editions.ts`.
8. Run full i18n + shared tests; device QA for script/font/RTL.

---

## Maintenance scripts (`apps/app/scripts/i18n/`)

| Script | Purpose |
|--------|---------|
| `merge-missing-keys.mjs` | Sync new `en.json` keys → all locales |
| `fix-placeholders.mjs` | Repair corrupted `{{…}}` tokens |
| `sanitize-corrupted-catalog.mjs` | Strip MyMemory rate-limit strings |
| `fix-runglish-catalog.mjs` | Repair garbled auto-translate (optional `catalog-overrides/`) |
| `apply-ui-polish.mjs` | Apply `ui-polish-patches.json` |
| `audit-en-identical.mjs` | Count English-identical values per locale |
| `generate-flags.mjs` | Scaffold missing flag assets |
| `generate-seo-locale-files.mjs` | Scaffold SEO locale JSON from English |
| `apply-seo-translations.mjs` | Merge SEO marketing copy |

---

## Recommended next work

| Priority | Task | How |
|----------|------|-----|
| P1 | Native UI for `az`, `ps`, `so`, `uz`, `tg` high-traffic screens | Expand `ui-polish-patches.json`; avoid re-running bad auto-translate |
| P2 | Full Hisnul for `ur`/`tr`/`fr` | Source OSS corpus first; extend `build-adhkar.mjs` — no AI |
| P3 | Bengali dua coverage (~128/270 → higher) | Improve Arabic prefix matching in `build-adhkar.mjs` |
| P4 | Literary review of learn overlays | Human pass on `packages/shared/src/content/i18n/` |
| P5 | Bundle size | Profile 23 Qur'an editions; consider phased download |
| P6 | Per-locale device QA | Language picker, RTL, fonts, notifications, widgets |

---

## CI commands

```bash
pnpm --filter app test -- i18n              # parity, guard, plurals, duplicates
pnpm --filter @munib-tracker/shared test    # overlay coverage
pnpm check:quick                            # lint + typecheck (repo root)
```
