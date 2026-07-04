# Expo Product App (`apps/app`)

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

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
