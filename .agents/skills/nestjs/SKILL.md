---
name: nestjs
description: |
  Official NestJS documentation and best practices for apps/api. Triggers on: NestJS,
  @nestjs/*, guards, pipes, interceptors, modules, providers, controllers, Passport,
  JWT auth, Swagger/OpenAPI, Prisma/TypeORM, configuration, validation, caching,
  websockets, microservices, monorepo webpack/SWC builds, and apps/api backend work.

  Use when user: builds or debugs the API app, adds Nest modules/endpoints, needs
  latest NestJS patterns, or asks how to implement auth, sync, config, or deployment.
metadata:
  upstream: https://github.com/nestjs/docs.nestjs.com/tree/master/content
  app: apps/api
---

# NestJS Skill

Official NestJS markdown guides are mirrored locally from [nestjs/docs.nestjs.com/content](https://github.com/nestjs/docs.nestjs.com/tree/master/content). **Read these files before implementing or advising on NestJS features** — do not rely on memorized APIs.

## How to use this skill

1. **Read** [.agents/skills/nestjs/SKILL.md](SKILL.md) (this file) for routing.
2. **Find the topic** in [docs-index.md](docs-index.md) or the table below.
3. **Open the matching guide** under `.agents/skills/nestjs/docs/` and follow it.
4. **Apply project conventions** from [apps/api/AGENTS.md](../../../apps/api/AGENTS.md):
   - Biome lint (not ESLint/Prettier)
   - Vitest (not Jest) for unit/e2e tests
   - Webpack + SWC monorepo build
   - `@munib-tracker/shared` workspace package
   - Global prefix `api/v1`, port `3001`

## Topic router

| Task | Read first |
|------|------------|
| New project / bootstrap | `docs/first-steps.md`, `docs/modules.md` |
| Controllers & routes | `docs/controllers.md`, `docs/techniques/versioning.md` |
| Services & DI | `docs/components.md`, `docs/fundamentals/dependency-injection.md`, `docs/fundamentals/provider-scopes.md` |
| DTO validation | `docs/techniques/validation.md`, `docs/pipes.md` |
| Environment config | `docs/techniques/configuration.md` |
| Auth / JWT / Passport | `docs/security/authentication.md`, `docs/recipes/passport.md` |
| CORS / Helmet / CSRF | `docs/security/cors.md`, `docs/security/helmet.md`, `docs/security/csrf.md` |
| Swagger / OpenAPI | `docs/openapi/introduction.md`, `docs/recipes/documentation.md` |
| Exception handling | `docs/exception-filters.md` |
| Guards & interceptors | `docs/guards.md`, `docs/interceptors.md` |
| Unit / e2e testing | `docs/fundamentals/unit-testing.md` |
| Monorepo / SWC / webpack | `docs/recipes/swc.md`, `docs/cli/workspaces.md` |
| Database (Prisma) | `docs/recipes/prisma.md` |
| Database (TypeORM) | `docs/recipes/sql-typeorm.md` |
| Health checks | `docs/recipes/terminus.md` |
| Deployment | `docs/deployment.md`, `docs/faq/serverless.md` |
| Request lifecycle debug | `docs/faq/request-lifecycle.md` |
| Rate limiting | `docs/security/rate-limiting.md` |
| File upload | `docs/techniques/file-upload.md` |
| Queues / background jobs | `docs/techniques/queues.md` |
| Caching | `docs/techniques/caching.md` |
| WebSockets | `docs/websockets/gateways.md` |
| Microservices | `docs/microservices/basics.md` |

Full file list: [docs-index.md](docs-index.md).

## Munib Tracker API context

Our API (`apps/api`) currently has:

| Module | Status | Next doc to read when extending |
|--------|--------|--------------------------------|
| `health` | Live probe | `docs/recipes/terminus.md` for richer checks |
| `auth` | In-memory stub | `docs/security/authentication.md`, `docs/recipes/passport.md` |
| `sync` | In-memory LWW | `docs/recipes/prisma.md` or `docs/recipes/sql-typeorm.md` for persistence |

Phase 8 in [docs/TODO.md](../../../docs/TODO.md): Google/Apple/Facebook OAuth, guest mode, cloud sync.

## Doc format notes

Mirrored guides use NestJS site markup:

- `@@filename(path)` / `@@switch` — multi-file code tabs; pick the TypeScript variant
- `> info **Hint**` — callout boxes
- Internal links like `/cli/overview` map to `docs/cli/overview.md`

Online equivalent: `https://docs.nestjs.com/<path-without-md>` (e.g. `docs/security/authentication.md` → https://docs.nestjs.com/security/authentication).

## Refresh upstream docs

Re-sync when NestJS releases new features or docs change:

```bash
node .agents/skills/nestjs/scripts/sync-docs.js
```

This sparse-clones [nestjs/docs.nestjs.com](https://github.com/nestjs/docs.nestjs.com), copies `content/` into `docs/`, and updates `docs/SOURCE.md` + `docs-index.md`.

## Priority rules

1. **Official mirrored docs** override general knowledge for NestJS-specific APIs.
2. **apps/api/AGENTS.md** overrides generic NestJS lint/test tooling choices.
3. **Monorepo**: prefer `docs/recipes/swc.md` webpack pattern already used in `apps/api/webpack.config.js`.
4. **Security**: always read `docs/security/` guides before shipping auth endpoints.
