# Performance (official summary)

Source: [performance.md](https://github.com/krisk/Fuse/blob/main/docs/performance.md)

## Indexing factors

- List size
- Number of keys (each indexed separately)
- Value length

Pre-build for large datasets:

```js
const index = Fuse.createIndex(keys, list)
const fuse = new Fuse(list, options, index)
```

## Search factors

- List size (linear)
- Query length (Bitap O(n × m), 32-char pattern cap)
- Threshold (lower = faster pruning)
- Token search (one Bitap pass per term)
- Extended search operators (per-operator cost)

## Benchmarks (3 keys: title, body, tags)

| List size | Index | With token search |
|-----------|-------|-------------------|
| 1,000 | ~3 ms | ~17 ms |
| 10,000 | ~28 ms | ~182 ms |
| 50,000 | ~147 ms | ~963 ms |
| 100,000 | ~299 ms | ~2,061 ms |

String-only lists are ~25 ms for 100k items.

## Tips

- Use `limit` for top-N
- Index fewer keys if memory matters
- v7.4.0+: ~30% faster object indexing, ~60% faster string lists
