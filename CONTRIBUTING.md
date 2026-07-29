# Contributing to Munib Tracker

Thank you for helping improve Munib Tracker. This monorepo powers the Expo product app (phone + TV), NestJS API, Next.js marketing site, and admin ops console.

By contributing, you agree that your contributions are licensed under the same terms as the project: **PolyForm Noncommercial License 1.0.0** plus the attribution requirements in [`NOTICE`](NOTICE).

## Code of conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

- Bug fixes and UI polish
- Tests and documentation
- Translations / i18n (see [`docs/I18N_GUIDE.md`](docs/I18N_GUIDE.md))
- Content accuracy reports (Qur'an, hadith, duas) — use the [content accuracy](.github/ISSUE_TEMPLATE/content_accuracy.yml) issue template
- Features that fit the product direction in [`docs/BACKLOG.md`](docs/BACKLOG.md)

### Good first issues

Look for issues labeled `good first issue` or `help wanted`.

## Before you start

1. Search [existing issues](https://github.com/mubbi/munib-tracker/issues) to avoid duplicates.
2. For larger changes, open an issue first so maintainers can align on scope.
3. Read the agent/contributor guides for the area you touch:
   - [`AGENTS.md`](AGENTS.md) — monorepo conventions
   - [`apps/app/AGENTS.md`](apps/app/AGENTS.md) — Expo app (phone + Apple TV / Android TV), i18n, search
   - [`apps/api/AGENTS.md`](apps/api/AGENTS.md) — NestJS API
   - [`apps/marketing-web/AGENTS.md`](apps/marketing-web/AGENTS.md) — marketing site
   - [`apps/admin/AGENTS.md`](apps/admin/AGENTS.md) — ops / admin console
   - [`docs/TV.md`](docs/TV.md) — TV prebuild (`EXPO_TV=1`)

## Development setup

**Prerequisites:** Node.js ≥ 20.9 (CI uses Node 22), pnpm 9.15 (`corepack enable`).

```bash
pnpm install          # always from repo root
pnpm check:quick      # lint + typecheck (fast)
pnpm check:ci         # full CI profile locally
```

### Run individual apps

| App | Command | Notes |
|-----|---------|--------|
| Product (Expo) | `pnpm dev:app` | Guest/offline works without API keys |
| Marketing | `pnpm dev:marketing-web` | http://localhost:3000 |
| Admin | `pnpm dev:admin` | http://localhost:3002 — copy `apps/admin/.env.example` → `.env.local` |
| API | `pnpm dev:api` | Needs `apps/api/.env` from `.env.example` |
| Apple TV / Android TV | `pnpm prebuild:app:tv` then `pnpm dev:app:tv:ios` / `tv:android` | See [`docs/TV.md`](docs/TV.md) |
| Screenshot studio | `pnpm dev:screenshot-studio` | http://localhost:3010 — store framing ([`docs/STORE_ASSETS.md`](docs/STORE_ASSETS.md)) |

Copy env templates only — never commit real secrets:

- `apps/app/.env.example` → `apps/app/.env`
- `apps/api/.env.example` → `apps/api/.env`
- `apps/admin/.env.example` → `apps/admin/.env.local`

Native iOS/Android builds need Xcode / Android Studio and local signing config (see `apps/app/ios-keys/README.md`). Most UI contributions can use Expo web or a simulator without release signing.

## Commit messages (Conventional Commits)

We use [Conventional Commits](https://www.conventionalcommits.org/) enforced by **commitlint** on the Husky `commit-msg` hook.

**Preferred:** interactive Commitizen prompt:

```bash
pnpm commit
```

Or write the message yourself — it must pass commitlint:

```bash
git commit -m "feat(app): add white days calendar reminder"
```

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

| Type | Use for |
|------|---------|
| `feat` | New user-facing capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting / lint (no behavior change) |
| `refactor` | Code change that is not a fix or feature |
| `perf` | Performance improvement |
| `test` | Tests only |
| `build` | Build system or dependencies |
| `ci` | CI / GitHub Actions |
| `chore` | Maintenance that does not fit above |
| `revert` | Revert a previous commit |

**Optional scopes** (monorepo): `app`, `api`, `admin`, `marketing`, `shared`, `db`, `theme`, `ci`, `deps`, `docs`, `i18n`, `release`, `tv`, `screenshots`.

Examples:

- `feat(api): rotate refresh tokens on use`
- `fix(marketing): correct open-source FAQ wording`
- `docs: explain conventional commits in CONTRIBUTING`
- `chore(deps): bump expo sdk patch`

Breaking changes: add `!` after the type/scope (`feat(api)!: …`) and/or a `BREAKING CHANGE:` footer.

### Releases

Versions are cut by [Release Please](https://github.com/googleapis/release-please-action)
from Conventional Commits on `main`:

| Commit | SemVer |
|--------|--------|
| `fix:` | patch |
| `feat:` | minor |
| type with `!` or `BREAKING CHANGE:` | major |

Release Please attributes bumps by **files under each app path**
(`apps/app`, `apps/api`, `apps/admin`, `apps/marketing-web`). A change only under
`packages/*` does not bump an app — touch the consumer app in the same PR when a
shared change should ship a release.

Full guide (tags, Release PRs, product build numbers): [`docs/RELEASES.md`](docs/RELEASES.md).

## Project rules that block PRs

1. **No hardcoded user-facing strings** in the product app — use i18n (`apps/app/src/i18n/en.json`).
2. **Never hand-edit generated content** (`apps/app/assets/data/*`, generated shared content). Change the builder under `apps/app/scripts/build-data/` and run `pnpm --filter app build:data`.
3. **Religious text** must come from vetted open datasets — never invent or AI-generate scripture bodies.
4. **Theme colors** in the product app come from `useTheme()` — no hardcoded palette values.
5. **Fuzzy search** goes through `apps/app/src/lib/search.ts` (Fuse.js) — see `.agents/skills/fuse-js/SKILL.md`.

## Pull request checklist

- [ ] Commit messages follow Conventional Commits (`pnpm commit` or see CONTRIBUTING)
- [ ] `pnpm check:quick` passes (or `pnpm check:ci` for larger changes)
- [ ] Tests added/updated when behavior changes
- [ ] i18n keys added for new product UI strings (Phase 1: `en` + `ar`/`ur` when touching those locales)
- [ ] No secrets, keystores, `.p8`, `.cer`, or real `.env` files
- [ ] PR description explains *why* and links the related issue
- [ ] Attribution / license notices left intact
- [ ] No sponsorship / funding / donation solicitations

## Reporting security issues

Do **not** open a public issue for vulnerabilities. See [SECURITY.md](SECURITY.md).

## No sponsorship, funding, or donations

Munib Tracker does **not** currently accept sponsorship, funding, or donations.
Do **not** send money to anyone claiming to collect funds on behalf of this project.
There is no official payment or Sponsors link. Help by contributing code, docs,
translations, or careful content corrections instead — see above.

## License reminder

This project is **source-available and free for non-commercial use**. You may use, modify, and redistribute it for personal and educational purposes. You may **not** sell it or sell customized versions. Redistributions must credit Munib Tracker and link to [https://munibtracker.app](https://munibtracker.app). See [`LICENSE`](LICENSE) and [`NOTICE`](NOTICE).
