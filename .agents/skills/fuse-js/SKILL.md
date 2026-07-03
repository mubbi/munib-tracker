---
name: fuse-js
description: Fuzzy search with Fuse.js v7. Use when implementing or debugging search bars, autocomplete, content filtering, ranking, typo tolerance, or the universal search in apps/app. Covers fuzzy search, token search, extended search, logical queries, performance, and Web Workers.
version: 1.0.0
license: MIT
---

# Fuse.js — Fuzzy Search

**Use this skill for ANY fuzzy search work in Munib Tracker** — home screen search, per-screen search bars, ranking, typo tolerance, and search performance.

Official docs (source of truth): [github.com/krisk/Fuse/tree/main/docs](https://github.com/krisk/Fuse/tree/main/docs)

Installed version: `fuse.js@^7.4.2` in `apps/app` (full build — includes token + extended + logical search).

## When to Use

- Adding or changing a search bar in the Expo product app
- Debugging relevance, false positives, or missed matches
- Indexing new offline content corpora (duas, hadith, Qur'an, etc.)
- Choosing between `Fuse`, `FuseWorker`, token search, or extended search
- Benchmarking search latency on large datasets

## Munib Tracker conventions

**Canonical implementation:** `apps/app/src/lib/search.ts`

- All universal / cross-content search goes through this module — do **not** scatter ad-hoc `new Fuse()` calls across screens.
- Screen-local search bars (e.g. Qur'an surah list) should reuse helpers from `search.ts` or follow the same `makeFuse` / `fuseSearch` patterns.
- **Pre-normalize** searchable text with `normalize()` before indexing. Fuse's `ignoreDiacritics` only handles Latin accents; our Arabic harakat folding, alef variants, and transliteration joiner removal live in `normalize()`.
- **Lazy indexes:** small corpora index on first use; the Qur'an ayah full-text index is built once and deferred off the interaction thread (`InteractionManager` in `search.tsx`).
- **UI layering:** `searchLight()` returns instant results; `searchQuranAyahs()` runs after for the heavy ayah pass. Keep this split for responsive typing.
- **Tests:** add cases to `apps/app/src/lib/search.test.ts` for new corpora or matching edge cases.

### Project defaults (do not change casually)

| Option | Value | Why |
|--------|-------|-----|
| `threshold` | `0.2` | Tolerates real typos without noisy matches; tuned down from `0.3` to drop false positives on short fields (surah names). Official default `0.6` is too permissive |
| `ignoreLocation` | `true` | Matches can appear anywhere in long translation/body fields |
| `minMatchCharLength` | `2` | Drops single-char noise; aligns with `tokenize()` minimum |
| `includeScore` | `true` | Enables relevance-ranked results |
| `useExtendedSearch` | `true` | Multi-word queries use whitespace AND (each term fuzzy-matched) |
| Key weights | title/name highest | Title matches outrank body text |

Query pattern: `fusePattern()` → normalized tokens joined by spaces → `fuse.search(pattern)`.

## Quick start

```js
import Fuse from 'fuse.js'

const fuse = new Fuse(items, {
  keys: ['title', 'author'],
  threshold: 0.3,
  ignoreLocation: true,
})

const results = fuse.search('jon')
// [{ item: { title: "Old Man's War", ... }, refIndex: 0, score: 0.12 }]
```

Scores: `0` = perfect match, `1` = complete mismatch.

### Builds

| Build | Import | Includes |
|-------|--------|----------|
| **Full** (default) | `import Fuse from 'fuse.js'` | Fuzzy + extended + logical + token search |
| **Basic** | `import Fuse from 'fuse.js/basic'` | Fuzzy only (~2 kB smaller) |

We use the **full build**. Do not switch to basic unless bundle size is proven critical.

## Fuzzy search (Bitap algorithm)

Fuse uses a modified [Bitap algorithm](https://en.wikipedia.org/wiki/Bitap_algorithm) — approximate string matching with typo tolerance. Pattern length is capped at **32 characters per search term**.

### Controlling fuzziness

| Option | Default | Effect |
|--------|---------|--------|
| `threshold` | `0.6` | Cutoff for fuzziness. `0` = exact; `1` = match anything. We use `0.2`. |
| `location` | `0` | Expected match position; distant matches are penalized. |
| `distance` | `100` | Max offset from `location` before exclusion. Effective window ≈ `threshold × distance`. |
| `ignoreLocation` | `false` | When `true`, position doesn't affect score. **We set `true`** for long text fields. |

> With defaults (`threshold: 0.6`, `distance: 100`), only the first ~60 characters are effectively searched. For long fields, use `ignoreLocation: true` or increase `distance`.

### Other useful options

- `isCaseSensitive` — default `false`
- `ignoreDiacritics` — default `false`; we handle diacritics in `normalize()` instead
- `findAllMatches` — continue after perfect match (useful for highlighting)
- `minMatchCharLength` — ignore matches shorter than N chars
- `ignoreFieldNorm` / `fieldNormWeight` — control whether shorter fields rank higher

### Key weights

```js
keys: [
  { name: 'title', weight: 5 },
  { name: 'body', weight: 1 },
]
```

Higher weight = more influence on final ranking. Weights are normalized internally.

## Token search (`useTokenSearch`)

Designed for **search bars** with multi-word natural queries.

```js
const fuse = new Fuse(docs, {
  useTokenSearch: true,
  keys: ['title', 'description'],
  threshold: 0.3,
})

fuse.search('javascrpt paterns') // each word fuzzy-matched independently
```

### When to prefer token search

- Multi-word queries (`"react state management"`)
- Queries longer than 32 chars (default fuzzy treats the whole query as one pattern)
- Document search across titles + body

### `tokenMatch`

| Value | Behavior |
|-------|----------|
| `'any'` (default) | OR — record matches if **any** query word matches (ranked search) |
| `'all'` | AND — record must match **every** word somewhere across all fields |

Words are matched across all fields of a record, not per-field.

### Custom tokenizer

Default: `/[\p{L}\p{M}\p{N}_]+/gu` (unicode-aware).

Override for tokens with internal punctuation (`node.js`, `c++`) or CJK word segmentation via `Intl.Segmenter`. Function tokenizers are **not** supported by `FuseWorker`.

> **Munib note:** We currently use `useExtendedSearch` with whitespace-AND instead of `useTokenSearch`. Both suit search bars. Prefer `useTokenSearch` for new corpora unless you need extended operators; keep consistency within `search.ts`.

## Extended search (`useExtendedSearch`)

Unix-like operators for precise control. Enable with `useExtendedSearch: true`.

| Token | Match type |
|-------|-----------|
| `jscript` | fuzzy-match |
| `=scheme` | exact-match |
| `'python` | include-match (substring) |
| `!ruby` | inverse — does not include |
| `^java` | prefix-exact-match |
| `!.go$` | inverse suffix |
| `.js$` | suffix-exact-match |

- **Whitespace** = AND (all terms must match)
- **Pipe** `|` = OR

```js
fuse.search("'Man 'Old | Artist$")
```

Use double quotes for phrases: `="scheme language"`.

## Logical search

Pass an expression object instead of a string:

```js
fuse.search({
  $and: [
    { title: 'old war' },
    { $or: [{ title: '^lock' }, { title: '!arts' }] },
  ],
})
```

Pairs with extended search when `useExtendedSearch: true`. Use `$path` / `$val` for keys containing literal dots.

## Performance

### Indexing cost

`new Fuse(list, options)` walks every item. Scales with list size, key count, and value length.

| List size | Index (3 keys) | With token search |
|-----------|----------------|-------------------|
| 1,000 | ~3 ms | ~17 ms |
| 10,000 | ~28 ms | ~182 ms |
| 50,000 | ~147 ms | ~963 ms |
| 100,000 | ~299 ms | ~2,061 ms |

**Pre-built index** for large datasets on load:

```js
const index = Fuse.createIndex(keys, list)
const fuse = new Fuse(list, options, index)
```

### Search cost

- Linear in indexed entries
- Bitap is O(n × m); 32-char pattern cap bounds m
- Lower `threshold` prunes candidates earlier (can be faster)
- Token search runs one Bitap pass per query term
- Use `limit` for top-N results (heap-based selection)

### Munib corpus sizes

Our bundled corpora are small (hundreds to low thousands per index). The Qur'an ayah index (~6,236 items) is the largest — lazy build + defer off interaction thread is sufficient. **Do not** add `FuseWorker` unless a corpus exceeds ~10k items and profiling shows UI jank.

## Web Workers (`FuseWorker`)

For 10k+ items where synchronous search freezes the UI:

```js
import { FuseWorker } from 'fuse.js/worker'

const fuse = new FuseWorker(docs, { keys: ['title'], threshold: 0.4 })
const results = await fuse.search('javascript')
fuse.terminate() // always clean up
```

| Dataset | Recommendation |
|---------|----------------|
| < 5k | `Fuse` (simpler, no worker overhead) |
| 5k–10k | Either — benchmark |
| 10k+ | `FuseWorker` |

**Limitations:** `search()` returns a `Promise`; no `useTokenSearch`, custom `sortFn`, or `getFn`; use `setCollection()` instead of `remove()`. Not available in Node/React Native workers without a Web Worker polyfill — stick with `Fuse` + `InteractionManager` in Expo.

## Dynamic collection updates

```js
fuse.add({ title: 'New Book' })
fuse.remove((doc) => doc.title === 'Old Book')
```

Token search maintains an inverted index on add/remove.

## Checklist for new search features

1. Extend `search.ts` — add field defs, lazy index getter, and `fuseSearch` wrapper.
2. Pre-normalize all indexed fields with `normalize()`.
3. Set `ignoreLocation: true` for any long-text key.
4. Weight title/primary identifiers higher than body/reference fields.
5. Debounce UI input (~180 ms in `search.tsx`); use `useMemo` for search results.
6. Defer heavy index builds with `InteractionManager.runAfterInteractions`.
7. Add tests in `search.test.ts` for normalization edge cases and at least one match per corpus.
8. Run `pnpm --filter app test -- search` before shipping.

## References

Condensed from official docs in `references/`:

- [getting-started.md](references/getting-started.md)
- [fuzzy-search.md](references/fuzzy-search.md)
- [token-search.md](references/token-search.md)
- [extended-search.md](references/extended-search.md)
- [logical-search.md](references/logical-search.md)
- [performance.md](references/performance.md)
- [web-workers.md](references/web-workers.md)
