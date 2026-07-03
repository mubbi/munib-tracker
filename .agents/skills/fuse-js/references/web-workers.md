# Web Workers (official summary)

Source: [web-workers.md](https://github.com/krisk/Fuse/blob/main/docs/web-workers.md)

`FuseWorker` shards the dataset across Web Workers for parallel search.

```js
import { FuseWorker } from 'fuse.js/worker'

const fuse = new FuseWorker(docs, { keys: ['title'], threshold: 0.4 })
const results = await fuse.search('javascript')
fuse.terminate()
```

## When to use

| Size | Recommendation |
|------|----------------|
| < 5k | `Fuse` |
| 5k–10k | Either |
| 10k+ | `FuseWorker` |

## API differences from `Fuse`

| | Fuse | FuseWorker |
|---|------|------------|
| `search()` | sync `FuseResult[]` | `Promise<FuseResult[]>` |
| UI blocking | yes | no |
| `remove()` | yes | use `setCollection()` |
| `useTokenSearch` | yes | **no** (shard stats differ) |
| Custom `sortFn` / `getFn` | yes | throws at construction |
| Cleanup | none | call `terminate()` |

## Worker URL

Auto-resolved by default. If bundler fails:

```js
import workerUrl from 'fuse.js/worker-script'
new FuseWorker(docs, options, { workerUrl })
```

Not available in Node — browser Web Workers only.
