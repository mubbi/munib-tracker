# Logical Search (official summary)

Source: [logical-search.md](https://github.com/krisk/Fuse/blob/main/docs/logical-search.md)

Pass expression objects to `search()` instead of strings.

## Operators

```js
// AND — all clauses must match
fuse.search({ $and: [{ author: 'abc' }, { title: 'xyz' }] })

// OR — any clause matches
fuse.search({ $or: [{ author: 'abc' }, { author: 'def' }] })
```

## Nesting

`$and` and `$or` nest arbitrarily. Short-circuit evaluation applies.

## Dotted keys

For literal dots in key names (not nested paths):

```js
fuse.search({
  $and: [
    { $path: ['author', 'first.name'], $val: 'jon' },
    { $path: ['author', 'last.name'], $val: 'scazi' },
  ],
})
```

## With extended search

When `useExtendedSearch: true`, string values in logical expressions are parsed as extended search patterns.
