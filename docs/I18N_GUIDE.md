# Internationalization guide (Munib Tracker)

Reference for **23 app locales** (`en` + 22 translations): architecture, workflows, and scripture rules.

**Open work:** [`BACKLOG.md`](./BACKLOG.md#internationalization)

---

## Status summary

| Phase | Locales | UI catalog | Learn overlays | Scripture | Status |
|-------|---------|------------|----------------|-----------|--------|
| 1 | `en`, `ar`, `ur` | Human-reviewed | Complete | Full | **Shipped** |
| 2 | `id`, `tr`, `bn`, `ms`, `fa` | Key parity + polish | 12 modules each | `bn`/`id`/`ms` partial+ | **Shipped** |
| 3 | `fr`, `ha`, `sw`, `ru`, `az`, `ps` | Key parity + polish | Native overlays | `fr`/`ru` hadith remote | **Shipped** |
| 4 | `so`, `uz`, `kk`, `ku`, `bs`, `sq`, `ky`, `tg`, `tk` | Key parity + polish | Native overlays | English fallback | **Shipped** |

**CI:** App i18n **152/152** tests · Shared overlay coverage ≥90% · SEO **22×114** routes · ICU plural audit for `ar`/`ru`/`bn` · **731** UI polish patches across 19 locales.

**RTL:** `ar`, `ur`, `fa`, `ps`, `ku` — `apps/app/src/lib/i18n/rtl-locale.ts`.

**Scripture bundled (`scriptureSupported: true`):** `en`, `ar`, `ur`, `bn`, `id`, `ms`, `fr`.

**Needs native polish (currently English fallback):** `az`, `ps`, `so`, `uz`, `tg` — see backlog P1.

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

## Adding or changing UI strings

### 1. Author English first

Add keys to `apps/app/src/i18n/en.json` under the correct namespace. Follow Islamic terminology in [`apps/app/AGENTS.md`](../apps/app/AGENTS.md) (Salah not Prayer, Zikr not Dhikr, etc.).

### 2. Sync all locale files

```bash
node apps/app/scripts/i18n/merge-missing-keys.mjs
```

### 3. Translate

**Phase 1 (`ar`, `ur`):** Edit `{locale}.json` directly — must pass Latin-leakage guard.

**Phase 2–4:** Prefer curated patches in `apps/app/scripts/i18n/ui-polish-patches.json`, then:

```bash
node apps/app/scripts/i18n/apply-ui-polish.mjs [locale...]
```

### 4. Verify

```bash
pnpm --filter app test -- i18n
```

### 5. Audit English-identical strings (optional)

```bash
node apps/app/scripts/i18n/audit-en-identical.mjs [locale...]
```

Intentional English-identical values: brands, store names, Arabic brand dua, Islamic loanwords (`Salah`, `Qaza`, `Ramadan`).

---

## ICU plurals

English uses `_one` / `_other`. Locales with richer CLDR categories need extra suffixes:

| Locale | Extra suffixes (when probed) |
|--------|----------------------------|
| `ar` | `_zero`, `_two`, `_few`, `_many` |
| `ru` | `_few`, `_many` |
| `bn` | `_one`, `_other` (audit ensures coverage) |

Enforced by `apps/app/src/i18n/plural-audit.test.ts`.

---

## Fixing bad auto-translations

| Script | When to use |
|--------|-------------|
| `sanitize-corrupted-catalog.mjs <loc>` | Values contain `MYMEMORY WARNING` |
| `fix-runglish-catalog.mjs <loc>` | Mixed-script / Runglish — uses `catalog-overrides/{loc}.json` |
| `fix-placeholders.mjs` | Broken `{{interpolation}}` |

**Do not** hand-translate Qur'an, hadith, or dua *body text* in JSON catalogs — only UI chrome.

---

## Scripture & build-data

```bash
pnpm --filter app build:data
```

| Content | Bundled / remote | Source |
|---------|------------------|--------|
| **Qur'an** | All 23 locales | `quran-edition-defs.json` → fawazahmed0 |
| **Dua/zikr** | `bn`, `id`, Qur'anic backfill for 20 locales | `build-adhkar.mjs` |
| **Hadith (remote)** | `ur`, `id`, `tr`, `bn`, `fr`, `ru` | `hadith-remote.ts` |
| **99 Names** | `id`, `ms`, `fr`, `ur`, `bn` | Multiple OSS APIs — see [`FREE_OPEN_SOURCE_DATA.md`](./FREE_OPEN_SOURCE_DATA.md) |

**Blocked without new OSS:** Full Hisnul for `ur`, `tr`, `fr`, etc. — English fallback at runtime.

---

## Learn module overlays

English base: `packages/shared/src/content/*.ts`. Per-locale: `packages/shared/src/content/i18n/*.{locale}.ts`.

```bash
node packages/shared/scripts/clone-overlay-seed.mjs --restore-all
pnpm --filter @munib-tracker/shared test   # coverage.test.ts ≥90%
```

Literary QA is manual; coverage test only checks string presence vs English.

---

## Web SEO & hreflang

| Piece | Path |
|-------|------|
| Route metadata (English) | `apps/app/src/config/seo-routes.data.json` |
| Per-locale SEO copy | `apps/app/scripts/i18n/seo-translations/{locale}.mjs` |
| Generated locale JSON | `apps/app/src/config/seo-routes-locale/*.json` |
| hreflang + canonical | `apps/app/src/components/seo/seo.tsx` |

```bash
node apps/app/scripts/i18n/generate-seo-locale-files.mjs
node apps/app/scripts/i18n/apply-seo-translations.mjs all
```

---

## Adding a new locale (checklist)

1. Add entry to `packages/shared/src/i18n/locale-registry.ts` and `app-locale.ts`.
2. Create `apps/app/src/i18n/{code}.json` via `merge-missing-keys.mjs`.
3. Add flag SVG under `apps/app/assets/flags/` (`generate-flags.mjs`).
4. Add SEO overlay + run apply-seo-translations.
5. Add learn overlays for all 12 modules.
6. Wire Qur'an edition in registry if fawazahmed0 has one.
7. If hadith translation exists, add to `hadith-editions.ts`.
8. Run full i18n + shared tests; device QA for script/font/RTL.

---

## Maintenance scripts (`apps/app/scripts/i18n/`)

| Script | Purpose |
|--------|---------|
| `merge-missing-keys.mjs` | Sync new `en.json` keys → all locales |
| `fix-placeholders.mjs` | Repair corrupted `{{…}}` tokens |
| `sanitize-corrupted-catalog.mjs` | Strip MyMemory rate-limit strings |
| `fix-runglish-catalog.mjs` | Repair garbled auto-translate |
| `apply-ui-polish.mjs` | Apply `ui-polish-patches.json` |
| `audit-en-identical.mjs` | Count English-identical values per locale |
| `generate-flags.mjs` | Scaffold missing flag assets |
| `generate-seo-locale-files.mjs` | Scaffold SEO locale JSON |
| `apply-seo-translations.mjs` | Merge SEO marketing copy |

---

## Islamic terminology (UI copy)

Do **not** over-translate core terms. Use wording natural to Muslims in each language. Canonical English spellings: **Salah**, **Zikr** / **Adhkar**, **Adhan**, **Qaza**, **Dua**, **Tasbeeh**, **rakah(s)**, **Tarawih**, prayer names (Fajr, Dhuhr, …), **Ramadan**, **Jumu'ah**, etc. See [`apps/app/AGENTS.md`](../apps/app/AGENTS.md) banned-term list.

Tone: respectful, warm, concise — never robotic or literal word-for-word where an established Islamic term exists.

Preserve every `{{placeholder}}` and ICU plural suffix exactly across locales.

---

## Critical rule — scripture translations

Religious texts **must never** be translated manually, paraphrased, rewritten, or generated by AI.

**Always reuse** open-source datasets integrated via `build-data` and `translation-locale.ts`:

- Qur'an translations · Hadith translations · Dua/zikr/adhkar · Prophetic supplications

**Never:** create new verse/hadith/dua translations · paraphrase · simplify · use LLM output for scripture.

**If a locale has no OSS translation:** do not fabricate — leave English fallback and report the gap in [`BACKLOG.md`](./BACKLOG.md).

**UI chrome** (buttons, settings, notifications, tracker labels) may be translated normally.

Enforced in code comments (`translation-locale.ts`) and `i18n-guard.test.ts` for English source terminology.

---

## CI commands

```bash
pnpm --filter app test -- i18n
pnpm --filter @munib-tracker/shared test
pnpm check:quick
```
