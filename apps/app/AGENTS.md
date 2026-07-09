# Expo Product App (`apps/app`)

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Internationalization & Islamic terminology (READ BEFORE ADDING ANY SCREEN, COMPONENT, OR CONTENT)

The app ships **23 locales** (`en` + 22 translations). Phase 1 (`en`, `ar`, `ur`) is human-reviewed; Phase 2–4 have key parity with English. Full guide: [`docs/I18N_GUIDE.md`](../../docs/I18N_GUIDE.md) · backlog: [`docs/BACKLOG.md`](../../docs/BACKLOG.md).

Every new feature or content update MUST follow these rules. They are enforced by `src/i18n/i18n-guard.test.ts` and `plural-audit.test.ts` (runs in `pnpm test` / CI). Run locally after any UI or catalog change:

```
pnpm --filter app test -- i18n
```

**1. No hardcoded user-facing strings.** Every visible string — `<Text>` children, titles/eyebrows/subtitles, button labels, placeholders, `accessibilityLabel`/`accessibilityHint`, `Alert`/toast/notification text, empty states, validation messages — comes from `t("namespace.key")`. The single source of truth is `src/i18n/en.json`, organized by feature namespace. Author **English first**, then run `node scripts/i18n/merge-missing-keys.mjs` and translate (or add to `scripts/i18n/ui-polish-patches.json` + `apply-ui-polish.mjs`). For Phase 1, add **Urdu and Arabic** for the same keys. Do NOT hardcode English as a fallback in `t(key, "English default", …)` and skip the key.

**2. Standardized Islamic terminology — use ONLY the left-hand spelling in English source copy** (never the alternatives). The guard rejects the banned spellings:

| Use (canonical) | Never write |
|---|---|
| **Salah** (the ritual prayer, in labels/stats/reminders) | Prayer/Prayers *as a bare label*, Namaz, Salat* |
| **Zikr** (singular); **Adhkar** (plural) | Dhikr |
| **Adhan** | Azan |
| **Qaza** | Qada, Qadha |
| **Fasting** (English); روزہ / الصيام in ur/ar | Roza (in English) |
| **Tasbeeh** | Tasbih |
| **Dua** | Du'a |
| **Masjid** | Mosque |

*Also: Fajr, Dhuhr, Asr, Maghrib, Isha, Witr, Tahajjud, Sunnah, Nafl, Wudu, Ghusl, Ramadan, Jumu'ah — spelled consistently.* The one nuance: **"Salah"** is for discrete labels; natural "prayer(s)" is allowed *only* mid-sentence in long educational prose under `prayerInfo.*` (and proper compounds like "Salat al-Wusta"). Everywhere else a bare "Prayer" label must be "Salah".

**3. Translation quality.** Phase 1 (`ar`, `ur`): fully translated UI — no English words left inside (the guard flags 4+-letter Latin except allowlisted proper nouns). Phase 2–4: key parity required; prefer native labels via `ui-polish-patches.json`. Keep the exact same `{{interpolation}}` variables as English. For `ar`, `ru`, `bn`, include all CLDR plural suffixes (`plural-audit.test.ts`). Never leave a value empty. **Religious text bodies** must come from OSS datasets via `src/lib/translation-locale.ts` — never AI-generated in JSON catalogs. When you rewrite English, re-translate Phase 1 `ur`/`ar` too.

**4. RTL.** `ar`, `ur`, `fa`, `ps`, and `ku` are RTL (`RTL_LOCALES` in `src/lib/i18n/rtl-locale.ts`). Layout is flexbox and auto-flips, so: use **logical** style props (`marginStart`/`paddingEnd`/`borderStartWidth`) never physical (`marginLeft`/`left`); for direction-encoding glyphs use the helpers in **`src/lib/rtl.ts`** (`chevronForward`, `chevronBack`, `chevronBackward`, `arrowForward`) — never hardcode `chevron.right`/`arrow.left`. Concept icons (clock, calendar, mosque, moon, qibla turn-arrows) must NOT mirror. `textAlign:"right"` is correct only when paired with `writingDirection:"rtl"` (Arabic content); UI-chrome that must flip uses `I18nManager.isRTL ? "left" : "right"`. Language + layout direction are owned by `changeAppLocale` in `src/i18n/index.ts`, called from `preferences-store` hydration and `setLocale` — never apply RTL from init or a reactive provider effect.

**5. Non-component code** (notifications, widgets, lib) uses the global singleton `import i18n from "@/i18n"` → `i18n.t(...)`, not the `useTranslation` hook.

**6. Scripture vs UI language.** `locale` drives UI catalogs; `translationLocale` drives dua/zikr/Qur'an/hadith meaning. Hadith remote translations: `ur`, `id`, `tr`, `bn`, `fr`, `ru` (`packages/shared/src/i18n/hadith-editions.ts`).

If a check's allowlist needs a genuinely new proper noun or Latin-legit key, extend the `LATIN_OK_*` / `BANNED_TERMS` constants at the top of `i18n-guard.test.ts` (with a comment) — don't weaken the check.

## Fuzzy search (Fuse.js)

All search bars and content filtering use **[Fuse.js v7](https://github.com/krisk/Fuse/tree/main/docs)** (`fuse.js@^7.4.2`, full build). Read `.agents/skills/fuse-js/SKILL.md` before implementing or changing search.

### Canonical module

`src/lib/search.ts` — universal offline search across Qur'an, hadith, duas, adhkar, duroods, and the 99 names.

| Export | Purpose |
|--------|---------|
| `searchLight()` | Instant results (all sources except Qur'an ayah full-text) |
| `searchQuranAyahs()` | Heavy ayah index — defer off interaction thread |
| `searchAll()` | Synchronous full search (tests / non-interactive callers) |
| `normalize()` / `tokenize()` | Diacritic-insensitive, Arabic-aware text folding |
| `createFuzzyIndex(items, fields)` | Reusable `FuzzyIndex` for a screen-local list (project defaults + `normalize()`) — memoize per list |
| `createHadithSearch(items)` | `FuzzyIndex<HadithItem>` for an in-collection hadith search bar |
| `createDuaSearch(items)` | `FuzzyIndex<DuaItem>` for an in-category dua search bar |
| `createZikrSearch(items)` | `FuzzyIndex<ZikrItem>` for an in-category zikr search bar |
| `searchDuaList(query, limit?)` | Ranked `DuaItem[]` for the duas index filter |
| `searchZikrList(query, limit?)` | Ranked `ZikrItem[]` for the zikr index filter |
| `searchSurahList(query, limit?)` | Ranked `Surah[]` for the Qur'an index filter (reuses the cached surah index) |

Search bars wired to these: home `src/app/search.tsx` (universal), `quran/index.tsx` (surah filter → `searchSurahList`), `quran/search.tsx` (ayah full-text → `searchQuranAyahs`), `hadith/[collection].tsx` (in-collection → `createHadithSearch`), `dua/index.tsx` + `dua/[category].tsx` (→ `searchDuaList` / `createDuaSearch`), `zikr/index.tsx` + `zikr/[category].tsx` (→ `searchZikrList` / `createZikrSearch`).

### Rules for agents

1. **Extend `search.ts`** for new corpora or cross-content search — do not add standalone `new Fuse()` in screens.
2. **Pre-normalize** indexed fields with `normalize()` before passing to Fuse (Arabic harakat, Latin accents, transliteration joiners).
3. **Reuse project defaults:** `threshold: 0.2`, `ignoreLocation: true`, `minMatchCharLength: 2`, `useExtendedSearch: true`, weighted keys (title/name highest). (`0.2` was tuned down from `0.3` to drop false positives on short fields like surah names while keeping typo tolerance.)
4. **Multi-word queries:** join normalized tokens with spaces (extended-search AND) or consider `useTokenSearch: true` for new indexes — see the skill for trade-offs.
5. **Performance:** lazy-build indexes; defer the Qur'an ayah index; use `limit` for UI caps. `FuseWorker` only if a corpus exceeds ~10k items and profiling shows jank.
6. **Tests:** `src/lib/search.test.ts` — run with `pnpm --filter app test -- search`.

### Per-screen search bars

Screen-local filters (e.g. a single list) may use Fuse inline but must follow the same `makeFuse` / `fuseSearch` patterns and defaults from `search.ts`. Prefer extracting shared helpers into `search.ts` when a second screen needs the same corpus.
