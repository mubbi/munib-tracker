# Munib Tracker — Documentation

## Status & planning

| Doc                                        | Use when you need…                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------------------------- |
| [`FEATURES.md`](./FEATURES.md)             | Shipped product features (NF-* catalog, incl. the NF-3.x wave and its fallbacks)      |
| [`BACKLOG.md`](./BACKLOG.md)               | Open work: owner actions, device QA, translations review, engineering follow-ups      |
| [`DECISIONS.md`](./DECISIONS.md)           | Locked product decisions D1–D51, standing rules for new features, notification budget |
| [`proofs/`](./proofs/)                     | Proof-backed review logs (D11) — sources for every religious claim, per feature       |
| [`ARTICLE.md`](./ARTICLE.md)               | Medium-style product story (features, platforms, open release)                        |
| [`OPEN_SOURCE.md`](./OPEN_SOURCE.md)       | Source-available release checklist (PolyForm NC)                                      |
| [`RELEASES.md`](./RELEASES.md)             | Semver / Release Please (per-app tags, changelogs, build numbers)                     |
| [`../AGENTS.md`](../AGENTS.md)             | Monorepo commands, conventions, agent rules                                           |
| [`../CONTRIBUTING.md`](../CONTRIBUTING.md) | Contributor setup, Conventional Commits (`pnpm commit`), PR checklist                 |
| [`../SECURITY.md`](../SECURITY.md)         | Vulnerability reporting                                                               |

## Guides

| Topic                                                                           | Doc                                                      |
| ------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Internationalization (24 locales, D45 scripture rules)                          | [`I18N_GUIDE.md`](./I18N_GUIDE.md)                       |
| Content pipeline (how: build-data, types, guardrails)                           | [`DATA_INGESTION.md`](./DATA_INGESTION.md)               |
| Data sources & licenses (what and why)                                          | [`FREE_OPEN_SOURCE_DATA.md`](./FREE_OPEN_SOURCE_DATA.md) |
| User data inventory (storage, sync, backup, reset, server)                      | [`DATA_INVENTORY.md`](./DATA_INVENTORY.md)               |
| Circles backend (family, partner, group khatm, nearby join)                     | [`CIRCLES.md`](./CIRCLES.md)                             |
| Native surfaces (widgets, Live Activities, Watch, Wear, focus lock, nearby BLE) | [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md)             |
| Salah focus lock store filings                                                  | [`FOCUS_LOCK_FILINGS.md`](./FOCUS_LOCK_FILINGS.md)       |
| Live Activity remote push (QStash, cron, future Fly worker)                     | [`LIVE_ACTIVITY_PUSH.md`](./LIVE_ACTIVITY_PUSH.md)       |
| Web Push + Android Expo surface phases                                          | [`WEB_PUSH.md`](./WEB_PUSH.md)                           |
| Device & platform support                                                       | [`DEVICES.md`](./DEVICES.md)                             |
| Apple TV / Android TV                                                           | [`TV.md`](./TV.md)                                       |
| Performance profiling                                                           | [`PROFILING.md`](./PROFILING.md)                         |
| App Store / Play screenshots                                                    | [`STORE_ASSETS.md`](./STORE_ASSETS.md)                   |
| iOS App Store listing copy                                                      | [`IOS_APP_COPY.md`](./IOS_APP_COPY.md)                   |
| Google Play short description                                                   | [`ANDROID_APP_COPY.md`](./ANDROID_APP_COPY.md)           |
| Deep links & App Links (incl. circle invites)                                   | [`DEEP_LINKS.md`](./DEEP_LINKS.md)                       |
| OAuth (Google / Apple / Facebook)                                               | [`OAUTH_SETUP.md`](./OAUTH_SETUP.md)                     |
| Production / Vercel                                                             | [`PRODUCTION.md`](./PRODUCTION.md)                       |
| Releases / semver (Release Please)                                              | [`RELEASES.md`](./RELEASES.md)                           |
| Ops / admin console (`admin.munibtracker.app`)                                  | [`ADMIN.md`](./ADMIN.md)                                 |
| Admin → product broadcasts (inbox + push)                                       | [`ADMIN_BROADCASTS.md`](./ADMIN_BROADCASTS.md)           |

Per-app guides: [`apps/app/AGENTS.md`](../apps/app/AGENTS.md) · [`apps/api/AGENTS.md`](../apps/api/AGENTS.md) · [`apps/admin/AGENTS.md`](../apps/admin/AGENTS.md) · [`apps/marketing-web/AGENTS.md`](../apps/marketing-web/AGENTS.md) · [`packages/db/README.md`](../packages/db/README.md) · [`packages/live-activity-delivery/README.md`](../packages/live-activity-delivery/README.md) · [`packages/surface-push-delivery/README.md`](../packages/surface-push-delivery/README.md) · [`packages/store-screenshots/README.md`](../packages/store-screenshots/README.md) · [`tools/screenshot-studio/README.md`](../tools/screenshot-studio/README.md) · [`tools/pamphlets/README.md`](../tools/pamphlets/README.md)

## Doc maintenance

- Open work → [`BACKLOG.md`](./BACKLOG.md). Shipped features → [`FEATURES.md`](./FEATURES.md). A new
  locked decision → the next D-number in [`DECISIONS.md`](./DECISIONS.md).
- A religious feature ships only with a complete proof log in [`proofs/`](./proofs/) (D11).
- New storage, sync entity or server table → update [`DATA_INVENTORY.md`](./DATA_INVENTORY.md).
- How-tos belong in guides, not the backlog. Large one-off plans are retired into git history once
  shipped; keep only decisions and open items.
- After web perf changes: re-run `pnpm --filter app build:web`, update [`PROFILING.md`](./PROFILING.md), sync open items in [`BACKLOG.md`](./BACKLOG.md).
