# Getting Started (official summary)

Source: [getting-started.md](https://github.com/krisk/Fuse/blob/main/docs/getting-started.md)

## Install

```sh
pnpm add fuse.js
```

## Import

```js
import Fuse from 'fuse.js'           // full build (default)
import Fuse from 'fuse.js/basic'     // fuzzy only
import Fuse from 'fuse.js/min'       // minified full
```

## Quick start

```js
const fuse = new Fuse(books, { keys: ['title', 'author'] })
const results = fuse.search('jon')
```

Score `0` = perfect match; `1` = complete mismatch.

## Builds

| Build | Gzip | Features |
|-------|------|----------|
| Full | ~8.6 kB | Fuzzy + extended + logical + token |
| Basic | ~6.8 kB | Fuzzy only |

Register plugins on basic build:

```js
import Fuse from 'fuse.js/basic'
import { ExtendedSearch } from 'fuse.js'
Fuse.use(ExtendedSearch)
```
