# Internationalization guide (Munib Tracker)

Reference for **24 app locales** (`en` + 23 translations): architecture, workflows, and scripture rules.

---

## Status summary

| Phase | Locales                                              | UI catalog          | Learn overlays        | Scripture                          | Status      |
| ----- | ---------------------------------------------------- | ------------------- | --------------------- | ---------------------------------- | ----------- |
| 1     | `en`, `ar`, `ur`                                     | Human-reviewed      | Complete (24 modules) | Full                               | **Shipped** |
| 2     | `id`, `tr`, `bn`, `ms`, `fa`                         | Key parity + polish | 24 modules each       | `bn`/`id`/`ms` partial+            | **Shipped** |
| 3     | `fr`, `ha`, `sw`, `ru`, `az`, `ps`                   | Key parity + polish | Native overlays       | `fr`/`ru` hadith remote            | **Shipped** |
| 4     | `so`, `uz`, `kk`, `ku`, `bs`, `sq`, `ky`, `tg`, `tk` | Key parity + polish | Native overlays       | English fallback                   | **Shipped** |
| 5     | `hi`                                                 | Key parity + polish | Native overlays       | Qur'an OSS; dua/hadith EN fallback | **Shipped** |

**CI:** App i18n Jest suite (`pnpm --filter app test -- i18n`) · Shared overlay coverage ≥90% · SEO **23×133** routes (non-`en` locale packs × `seo-routes.data.json`) · ICU plural audit for `ar`/`ru`/`bn`.

**RTL:** `ar`, `ur`, `fa`, `ps`, `ku` — `apps/app/src/lib/i18n/rtl-locale.ts`.

**Scripture bundled (`scriptureSupported: true`):** `en`, `ar`, `ur`, `bn`, `id`, `ms`, `fr`.

---

## Architecture

| Layer                  | Location                                                                              | Runtime API                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Locale registry**    | `packages/shared/src/i18n/locale-registry.ts`                                         | `LOCALE_REGISTRY`, `getLocaleDefinition()`                                           |
| **UI catalogs**        | `apps/app/src/i18n/{locale}.json`                                                     | `t("namespace.key")` via `react-i18next`                                             |
| **Learn overlays**     | `packages/shared/src/content/i18n/*.{locale}.ts`                                      | `localizeLearnContent()` in `packages/shared/src/content/i18n/localize.ts`           |
| **Scripture resolver** | `apps/app/src/lib/translation-locale.ts`                                              | `resolveTranslationField()`, `resolveHadithTranslation()`, `resolveQuranEditionId()` |
| **Hadith edition map** | `packages/shared/src/i18n/hadith-editions.ts`                                         | fawazahmed0 prefixes per locale                                                      |
| **Web SEO / hreflang** | `apps/app/src/lib/locale-path.ts`, `src/config/seo.ts`, `scripts/inject-seo-head.mjs` | Locale-prefixed URLs (`/ar/…`, `/ur/…`; `en` unprefixed)                             |
| **Build pipeline**     | `apps/app/scripts/build-data/`                                                        | `pnpm --filter app build:data`                                                       |

**Learn overlay modules (24):** `aqeedah`, `battles`, `eid-guide`, `fidyah-guide`, `friday-guide`, `hajj`, `islamic-finance`, `islamic-history`, `jahannam`, `janazah-guide`, `jannah`, `last-day`, `laylat-al-qadr`, `learn-dua`, `new-muslim`, `prophets`, `prophets-genealogy`, `quran-guide`, `ruqyah`, `sahaba`, `salah-guide`, `seerah`, `taharah`, `white-days-guide`.

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

The catalogs in `apps/app/src/i18n/{locale}.json` are the **only source of truth**. To translate a change:

1. Write a one-off patch `apps/app/scripts/i18n/<change>-i18n.json` — `{ "<locale>": { "dot.path.key": "value" } }` for `en` plus all 23 locales (array items use their index, e.g. `sick.obligations.1`).
2. Apply it:

   ```bash
   node apps/app/scripts/i18n/apply-patch-i18n.mjs [locale...]
   ```

   `en` is patched first; every other catalog is then pruned to `en`'s keys (plus CLDR plural variants), and D45 scripture keys stay English-only.
3. **Delete the patch file in the same change.** Keeping applied patches around let stale values re-apply on the next run (2026-11-24 cleanup removed ~160 of them after verifying the catalogs were byte-identical without them).

Phase 1 (`ar`, `ur`) must pass the Latin-leakage guard; every locale must pass the corruption guard.

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

| Locale | Extra suffixes (when probed)              |
| ------ | ----------------------------------------- |
| `ar`   | `_zero`, `_two`, `_few`, `_many`          |
| `ru`   | `_few`, `_many`                           |
| `bn`   | `_one`, `_other` (audit ensures coverage) |

Enforced by `apps/app/src/i18n/plural-audit.test.ts`.

---

## Fixing bad auto-translations

Fix the value with a patch file (above). `fix-placeholders.mjs` repairs broken `{{interpolation}}` tokens in bulk; `audit-en-identical.mjs` lists values still identical to English.

**Do not** hand-translate Qur'an, hadith, or dua _body text_ in JSON catalogs — only UI chrome.

---

## Scripture & build-data

```bash
pnpm --filter app build:data
```

| Content             | Bundled / remote                             | Source                                                                           |
| ------------------- | -------------------------------------------- | -------------------------------------------------------------------------------- |
| **Qur'an**          | All 24 locales                               | `quran-edition-defs.json` → fawazahmed0                                          |
| **Dua/zikr**        | `bn`, `id`, Qur'anic backfill for 20 locales | `build-adhkar.mjs`                                                               |
| **Hadith (remote)** | `ur`, `id`, `tr`, `bn`, `fr`, `ru`           | `hadith-remote.ts`                                                               |
| **99 Names**        | `id`, `ms`, `fr`, `ur`, `bn`                 | Multiple OSS APIs — see [`FREE_OPEN_SOURCE_DATA.md`](./FREE_OPEN_SOURCE_DATA.md) |

Hisnul meanings for `ur`, `tr`, `fr`, and similar locales fall back to English when no OSS translation is wired.

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

| Piece                                                 | Path                                                                                                              |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Route metadata (English)                              | `apps/app/src/config/seo-routes.data.json`                                                                        |
| Static `<head>` per route (SDK 58 `generateMetadata`) | `apps/app/src/lib/seo/route-metadata.ts` — every route file exports `generateMetadata = routeMetadata("<route>")` |
| Per-locale SEO copy                                   | `apps/app/scripts/i18n/seo-translations/{locale}.mjs`                                                             |
| Generated locale JSON                                 | `apps/app/src/config/seo-routes-locale/*.json`                                                                    |
| hreflang + canonical                                  | `apps/app/src/components/seo/seo.tsx`                                                                             |

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
5. Add learn overlays for all **24** modules (see `packages/shared/src/content/i18n/`).
6. Wire Qur'an edition in registry if fawazahmed0 has one.
7. If hadith translation exists, add to `hadith-editions.ts`.
8. Run full i18n + shared tests; device QA for script/font/RTL.

---

## Maintenance scripts (`apps/app/scripts/i18n/`)

| Script                          | Purpose                                                                          |
| ------------------------------- | -------------------------------------------------------------------------------- |
| `apply-patch-i18n.mjs`          | Apply a one-off `*-i18n.json` patch, prune orphans (delete the patch afterwards) |
| `merge-missing-keys.mjs`        | Sync new `en.json` keys → all locales                                            |
| `fix-placeholders.mjs`          | Repair corrupted `{{…}}` tokens                                                  |
| `audit-en-identical.mjs`        | Count English-identical values per locale                                        |
| `generate-flags.mjs`            | Scaffold missing flag assets                                                     |
| `generate-seo-locale-files.mjs` | Scaffold SEO locale JSON                                                         |
| `apply-seo-translations.mjs`    | Merge SEO marketing copy                                                         |

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

### D45 — scripture meaning in Learn guides and catalogs (locked 2026-11-24)

Ayah / hadith / dua **meaning excerpts** come only from dataset translations; otherwise the English meaning is
shown with an **"English meaning"** label (`scriptureMeaning.englishLabel`). Structure:

- **Single source:** `packages/shared/src/i18n/scripture-meaning.ts` — `SCRIPTURE_MEANING_CONTENT_KEYS`
  (`excerpt`, `translation` in Learn content) and `isScriptureMeaningCatalogKey()` (catalog keys such as
  `*.quran.N.excerpt`, `*.hadith.N.excerpt`, `*.localRefExcerpt`, `qazaPlan.consistencyHadith`, `tahajjud.virtueBody`,
  `dhulHijjah.virtue`, `onboarding.brandDuaTranslation`).
- **Overlays never carry those fields.** `localizeContent()` ignores them (English source wins); the overlay coverage
  test excludes them and fails if an overlay contains one.
- **Catalogs:** those keys live in `en.json` only. `apply-patch-i18n.mjs` / `merge-missing-keys.mjs` never write them
  to other locales; `parity.test.ts` exempts them from parity and fails if a locale carries one. i18next falls back to
  English.
- **Rendering:** `useScriptureMeaning(english, quranRef?)` (`apps/app/src/hooks/use-scripture-meaning.ts`) — a Qur'an
  ref of ≤ 5 ayahs shows the user's translation edition (bundled or remote, cache-first); everything else, or offline,
  shows the English + `<EnglishMeaningLabel />`. Use `<ScriptureMeaning>` (render prop) or `ReligiousTextStack`
  (`quranRef` prop) — never print `ref.excerpt` / `translation` directly.
- **Quotes inside prose** (overlay body text): copy the dataset wording verbatim (Qur'an edition of the locale;
  hadith editions for `ur id tr bn fr ru`); with no dataset keep the English quote followed by the locale's
  "(English meaning)".

### Catalog hygiene

- **Orphan keys** (removed/renamed in `en`, bracket paths like `a[0].b`) are pruned by `apply-patch-i18n.mjs` on
  every run (array elements are kept so indices stay stable); `parity.test.ts` fails on any orphan.
- `locale-repair-*` patches apply **last**; `locale-repair-zz-*` (English source fixes, D45/D46 copy) after the
  per-locale repairs.

---

## CI commands

```bash
pnpm --filter app test -- i18n
pnpm --filter @munib-tracker/shared test
pnpm check:quick
```
