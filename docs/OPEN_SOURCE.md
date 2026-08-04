# Open-source readiness (maintainer checklist)

This repo is prepared for public source-available release under
**PolyForm Noncommercial 1.0.0** + [`NOTICE`](../NOTICE) attribution.

## License choice (why PolyForm NC)

Requirements were: free to use, modify, and redistribute; **not** for sale or
commercial customization-for-sale; mandatory credit + link to
[https://munibtracker.app](https://munibtracker.app).

| Option | Fit |
|--------|-----|
| **PolyForm Noncommercial 1.0.0** (chosen) | Written for software; clear non-commercial grant; supports `Required Notice:` lines for marketing-site attribution |
| CC BY-NC 4.0 | Similar intent, but aimed at creative works rather than code |
| MIT / Apache-2.0 | Allow commercial sale — does **not** match requirements |
| AGPL / GPL | Strong copyleft, but still allow commercial use |

This is **source-available / non-commercial**, not OSI “Open Source.” Prefer that
wording in marketing copy.

## No sponsorship / funding / donations

Munib Tracker **does not currently accept** sponsorship, funding, or donations.
There is **no** `.github/FUNDING.yml`, GitHub Sponsors button, or official payment
link. Do not enable Sponsors or add funding platforms until this policy changes.
Warn users: **do not send money** to anyone claiming to collect funds on behalf of
Munib Tracker. See [`SUPPORT.md`](../SUPPORT.md).

## Manual GitHub settings (do after going public)

- [ ] Repository → **Settings → General**: public; add topics; set homepage to `https://munibtracker.app`
- [ ] **Settings → Code security**: enable Dependabot alerts, Dependabot security updates, secret scanning, push protection
- [ ] **Settings → Code security**: enable private vulnerability reporting (pairs with `SECURITY.md`)
- [ ] **Settings → Branches**: protect `main` — require PR, require status check `Type-check, lint, test, build, OpenAPI drift`, dismiss stale reviews
- [ ] **Settings → Actions**: allow GitHub Actions; restrict secrets from forks
- [ ] **Settings → Actions → General**: enable **Allow GitHub Actions to create and approve pull requests** (required for [Release Please](https://github.com/googleapis/release-please-action))
- [ ] **Settings → Secrets and variables → Actions**: add `RELEASE_PLEASE_TOKEN` (PAT or GitHub App token that can open PRs and create releases — so CI runs on Release Please PRs; plain `GITHUB_TOKEN` does not re-trigger workflows)
- [ ] Confirm Issues are enabled; optionally enable Discussions
- [ ] Confirm **Sponsors / funding** stays disabled (no `FUNDING.yml`)
- [ ] Rotate any credentials that were ever committed (see below)
- [ ] After bootstrap: merge a Release Please PR and verify tags (`app-v…`, `api-v…`, …) + per-app `CHANGELOG.md` — see [`RELEASES.md`](./RELEASES.md)

## Secret hygiene (completed in-repo)

- Root and app `.gitignore` ignore `.env`, keystores, `.p8`, Firebase plist/json, and signing dirs
- `apps/app/ios-keys/app-store-connect.env`, `ExportOptions.plist`, `ExportOptions.tvos.plist`,
  and `tvos-signing/*.cer` were **removed from git tracking** (templates / README remain).
  If this repo was ever pushed while those files were tracked, **rotate** the App Store
  Connect API issuer / keys in Apple Developer.
- Env templates committed: `apps/app/.env.example`, `apps/api/.env.example`,
  `apps/admin/.env.example` (copy to `.env` / `.env.local` locally — never commit real secrets)

## Automations shipped in `.github/`

- CI (`workflows/ci.yml`) — `pnpm check:ci` (lint, types, test, build, OpenAPI drift)
- Release Please (`workflows/release-please.yml`) — per-app semver Release PRs, tags, and changelogs ([`RELEASES.md`](./RELEASES.md); official action: [googleapis/release-please-action](https://github.com/googleapis/release-please-action))
- PR labeler (`workflows/labeler.yml` + `labeler.yml`)
- CodeQL (`workflows/codeql.yml`)
- Issue / PR templates
- `CODEOWNERS`
- Husky: `pre-commit` (Biome), `commit-msg` (commitlint / Conventional Commits), `pre-push` (`pnpm check:ci`)
- Commitizen: `pnpm commit` (interactive conventional commits)

Root Release Please config: `release-please-config.json`, `.release-please-manifest.json`.
Maintainers merge Release PRs to cut tags (`app-v…`, `api-v…`, `admin-v…`, `marketing-web-v…`).

Create these labels in the GitHub UI (or via `gh label create`) so the labeler can apply them:
`app`, `api`, `marketing`, `admin`, `packages`, `docs`, `ci`, `bug`, `enhancement`, `content`, `triage`, `good first issue`, `help wanted`.

## Monorepo surfaces (for reviewers)

| Surface | Path | Notes |
|---------|------|--------|
| Product | `apps/app` | Expo SDK 57 — iOS, Android, Web, Apple TV / Android TV |
| Marketing | `apps/marketing-web` | Next.js 16 (port 3000) |
| Admin | `apps/admin` | Next.js ops console (port 3002) |
| API | `apps/api` | NestJS 11 (port 3001) |
| Packages | `packages/*` | shared, db, theme, api-client/contract, live-activity-delivery, surface-push-delivery, store-screenshots, … |
| Screenshot studio | `tools/screenshot-studio` | Outside workspace; port 3010 |
