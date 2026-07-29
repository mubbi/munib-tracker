# Extended Search (official summary)

Source: [extended-search.md](https://github.com/krisk/Fuse/blob/main/docs/extended-search.md)

Enable with `useExtendedSearch: true`.

## Operators

| Token | Type |
|-------|------|
| `jscript` | fuzzy-match |
| `=scheme` | exact-match |
| `'python` | include-match |
| `!ruby` | inverse (exclude) |
| `^java` | prefix |
| `!^earlang` | inverse prefix |
| `.js$` | suffix |
| `!.go$` | inverse suffix |

## Combining

- Whitespace = **AND**
- Pipe `|` = **OR**
- Double quotes for phrases: `="scheme language"`

## With logical search

```js
fuse.search({
  $and: [
    { title: '^Old' },
    { author: "'Scalzi" },
  ],
})
```

Available in full build; register with `Fuse.use(ExtendedSearch)` on basic build.
