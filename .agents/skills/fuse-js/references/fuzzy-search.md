# Fuzzy Search (official summary)

Source: [fuzzy-search.md](https://github.com/krisk/Fuse/blob/main/docs/fuzzy-search.md)

Fuse.js uses a modified Bitap algorithm for approximate string matching — typos, transpositions, missing characters.

## Scoring

- Fuzziness score: `0` = perfect, `1` = mismatch
- Combined with key weight and field-length norm for final relevance score
- Enable with `includeScore: true`

## Key options

| Option | Default | Notes |
|--------|---------|-------|
| `threshold` | `0.6` | Match cutoff. Lower = stricter. |
| `location` | `0` | Expected pattern position. |
| `distance` | `100` | Penalty window. Effective max offset ≈ `threshold × distance`. |
| `ignoreLocation` | `false` | `true` = match anywhere without position penalty. |
| `isCaseSensitive` | `false` | |
| `ignoreDiacritics` | `false` | `é` matches `e` when true. |
| `findAllMatches` | `false` | Keep searching after perfect match (highlighting). |
| `minMatchCharLength` | `1` | Skip short matches. |
| `ignoreFieldNorm` | `false` | Disable shorter-field boost. |
| `fieldNormWeight` | `1` | Strength of field-length norm. |

## Pattern limit

Bitap pattern length is capped at **32 characters per search term**. For longer multi-word queries, use token search (`useTokenSearch: true`).
