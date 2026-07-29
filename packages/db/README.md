# `@munib-tracker/db`

Drizzle ORM schemas for the **admin console** (`apps/admin`). Same Postgres database as Nest (`apps/api`).

## Ownership

| Concern | Owner |
|---------|--------|
| **DDL / migrations** | TypeORM in `apps/api/src/database/migrations/` |
| **Admin queries** | Drizzle schemas in this package |

When you change columns: add/update a TypeORM migration first, then mirror the table in `src/schema/`.

## Layout

- `src/schema/` — table definitions (`users`, `admin_*`, `broadcast_jobs`, `in_app_notifications`, `push_tokens`, content reports, feedback, contact messages, sync, media, versions, …)
- `src/pg/createDb.ts` — `pg` pool + Drizzle client
- `src/index.ts` — package exports

## Usage

```ts
import { createDb } from "@munib-tracker/db/pg/createDb";
import { usersTable } from "@munib-tracker/db/schema";
```

Product camelCase columns vs `admin_*` / broadcast snake_case — follow existing schema files; do not invent a second naming style.

## Docs

- [`docs/ADMIN.md`](../../docs/ADMIN.md)
- [`docs/ADMIN_BROADCASTS.md`](../../docs/ADMIN_BROADCASTS.md)
- [`apps/admin/AGENTS.md`](../../apps/admin/AGENTS.md)
