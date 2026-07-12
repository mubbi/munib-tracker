# Munib Tracker — Documentation

| Doc | Use when you need… |
|-----|-------------------|
| [`BACKLOG.md`](./BACKLOG.md) | Open work (product, i18n, performance, devices, content) |
| [`FEATURES.md`](./FEATURES.md) | Shipped product features (NF-* catalog) |
| [`../AGENTS.md`](../AGENTS.md) | Monorepo commands, conventions, agent rules |

## Guides

| Topic | Doc |
|-------|-----|
| Internationalization (23 locales) | [`I18N_GUIDE.md`](./I18N_GUIDE.md) |
| Content pipeline | [`DATA_INGESTION.md`](./DATA_INGESTION.md) |
| Data sources & licenses | [`FREE_OPEN_SOURCE_DATA.md`](./FREE_OPEN_SOURCE_DATA.md) |
| Native surfaces (widgets, Live Activities, Watch, Wear) | [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md) |
| Device & platform support | [`DEVICES.md`](./DEVICES.md) |
| Performance profiling | [`PROFILING.md`](./PROFILING.md) |
| App Store / Play screenshots | [`STORE_ASSETS.md`](./STORE_ASSETS.md) |
| iOS App Store listing copy | [`IOS_APP_COPY.md`](./IOS_APP_COPY.md) |
| Google Play short description | [`ANDROID_APP_COPY.md`](./ANDROID_APP_COPY.md) |
| Deep links & App Links | [`DEEP_LINKS.md`](./DEEP_LINKS.md) |
| OAuth (Google / Apple / Facebook) | [`OAUTH_SETUP.md`](./OAUTH_SETUP.md) |
| Production / Vercel | [`PRODUCTION.md`](./PRODUCTION.md) |
| Ops / admin console (`admin.munibtracker.app`) | [`ADMIN.md`](./ADMIN.md) |
| Admin → product broadcasts (inbox + push) | [`ADMIN_BROADCASTS.md`](./ADMIN_BROADCASTS.md) |

Per-app guides: [`apps/app/AGENTS.md`](../apps/app/AGENTS.md) · [`apps/api/AGENTS.md`](../apps/api/AGENTS.md) · [`apps/admin/AGENTS.md`](../apps/admin/AGENTS.md) · [`apps/marketing-web/AGENTS.md`](../apps/marketing-web/AGENTS.md) · [`packages/db/README.md`](../packages/db/README.md)

## Doc maintenance

- Open work → [`BACKLOG.md`](./BACKLOG.md). Shipped features → [`FEATURES.md`](./FEATURES.md).
- How-tos belong in guides, not the backlog.
- After web perf changes: re-run `pnpm --filter app build:web`, update [`PROFILING.md`](./PROFILING.md), sync open items in [`BACKLOG.md`](./BACKLOG.md).
