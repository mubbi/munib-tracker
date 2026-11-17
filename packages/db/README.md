# `@munib-tracker/db`

Drizzle ORM (`drizzle-orm` ^0.45) schemas for the **admin console** (`apps/admin`) and the marketing contact form (`apps/marketing-web` → `contact_messages`). Same Postgres database as Nest (`apps/api`).

## Ownership

| Concern              | Owner                                          |
| -------------------- | ---------------------------------------------- |
| **DDL / migrations** | TypeORM in `apps/api/src/database/migrations/` |
| **Admin queries**    | Drizzle schemas in this package                |

When you change columns: add/update a TypeORM migration first, then mirror the table in `src/schema/`.

## Layout

- `src/schema/` — table definitions (`users`, `admin_*`, `admin_broadcasts`, `cron_runs`, `canned_replies`, `in_app_notifications`, `push_tokens`, `live_activity_push_*`, `surface_push_*`, content reports, feedback, contact messages, OSS download failures, sync, media, versions, auth sessions, deleted accounts, …)
- `src/pg/createDb.ts` — `pg` pool + Drizzle client
- `src/pg/preparePgConnection.ts` — URL sanitising + SSL (Supabase CA, pooler detection); exported as `@munib-tracker/db/pg/preparePgConnection`
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
