# Token Search (official summary)

Source: [token-search.md](https://github.com/krisk/Fuse/blob/main/docs/token-search.md)

Splits multi-word queries into terms, fuzzy-matches each with Bitap, ranks with BM25-style IDF weighting.

## Enable

```js
const fuse = new Fuse(docs, {
  useTokenSearch: true,
  keys: ['title', 'author', 'description'],
})
```

## How it works

1. **Tokenization** — unicode-aware regex `/[\p{L}\p{M}\p{N}_]+/gu` by default
2. **Per-term fuzzy match** — each term uses Bitap with `ignoreLocation: true`
3. **IDF weighting** — rare terms score higher: `idf = log(1 + (fieldCount - docFreq + 0.5) / (docFreq + 0.5))`
4. **Score combination** — additive with IDF, normalized to 0–1

## Behaviors

- Partial match: 2 of 3 terms still returns, ranked lower
- Word order independent
- Typo tolerance per term
- Long queries: one Bitap search per word (no 32-char cap issue)

## `tokenMatch`

- `'any'` (default): OR — match any word (ranked search)
- `'all'`: AND — every word must appear somewhere in the record (filtering)

## Custom tokenizer

Regex (must have `g` flag):

```js
tokenize: /[\w.+-]+/g
```

Function (CJK via `Intl.Segmenter`):

```js
tokenize: (text) =>
  Array.from(segmenter.segment(text), (s) => s.isWordLike ? s.segment : null).filter(Boolean)
```

Function tokenizers are not supported by `FuseWorker`.

## Performance overhead

Index creation ~2.5–5.5× vs plain fuzzy; search ~1.2–1.8×. Available in **full build only**.
