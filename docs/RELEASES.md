# Releases (Release Please)

Munib Tracker versions its four deployable apps independently with
[googleapis/release-please-action](https://github.com/googleapis/release-please-action)
**v4** in **manifest** mode. Config lives at the repo root:

| File                                                                              | Role                                                 |
| --------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [`release-please-config.json`](../release-please-config.json)                     | Per-package release types, components, `extra-files` |
| [`.release-please-manifest.json`](../.release-please-manifest.json)               | Last released semver per package path                |
| [`.github/workflows/release-please.yml`](../.github/workflows/release-please.yml) | Runs on push to `main`                               |

Companion schema / `extra-files` docs:
[googleapis/release-please](https://github.com/googleapis/release-please)
([customizing](https://github.com/googleapis/release-please/blob/main/docs/customizing.md)).

## Packages and tags

| Path                 | Release type                                    | Tag example            | Changelog                                                               |
| -------------------- | ----------------------------------------------- | ---------------------- | ----------------------------------------------------------------------- |
| `apps/app`           | `node` (+ `app.json` `expo.version` extra-file) | `app-v1.2.3`           | [`apps/app/CHANGELOG.md`](../apps/app/CHANGELOG.md)                     |
| `apps/api`           | `node`                                          | `api-v0.1.0`           | [`apps/api/CHANGELOG.md`](../apps/api/CHANGELOG.md)                     |
| `apps/admin`         | `node`                                          | `admin-v0.1.0`         | [`apps/admin/CHANGELOG.md`](../apps/admin/CHANGELOG.md)                 |
| `apps/marketing-web` | `node`                                          | `marketing-web-v0.1.4` | [`apps/marketing-web/CHANGELOG.md`](../apps/marketing-web/CHANGELOG.md) |

Internal workspace packages (`packages/*`) and `tools/screenshot-studio` are **not**
Release Please packages. The monorepo root is not versioned as a release artifact.

`include-component-in-tag` and `separate-pull-requests` are enabled so each app
gets its own Release PR and tag prefix.

### Concurrent Release PRs (manifest conflicts)

Every Release PR updates the shared [`.release-please-manifest.json`](../.release-please-manifest.json).
With `separate-pull-requests`, merging one app’s Release PR can leave the others
conflicted on that file ([release-please#1870](https://github.com/googleapis/release-please/issues/1870)).

Mitigations in this repo:

1. **Filler keys** (`apps/<name>+FILLER`) sit between real package entries so
   adjacent version bumps are less likely to conflict (same pattern as
   [google-cloud-ruby](https://github.com/googleapis/google-cloud-ruby/blob/main/.release-please-manifest.json)).
   Do not add fillers to `release-please-config.json` `packages`.
2. **Heal jobs** in [`.github/workflows/release-please.yml`](../.github/workflows/release-please.yml):
   on every push to `main` (and on `workflow_dispatch`), close non-mergeable
   Release PRs, delete their head branches, and re-run Release Please so it
   opens fresh PRs from `main`.
   Heal only closes PRs GitHub reports as `CONFLICTING` (not `UNKNOWN`,
   which is common for a few seconds after a push to `main`).

If a Release PR is stuck conflicting: open **Actions → release-please → Run
workflow**. Prefer merging one Release PR at a time and waiting for the heal
pass before merging the next.

## How it works

1. Conventional commits land on `main` under an app path.
2. The Release Please workflow opens or updates a **Release PR** for that app
   (version bump + changelog).
3. When you merge the Release PR, Release Please creates the Git tag and a
   GitHub Release.
4. If sibling Release PRs conflict on the manifest, the heal jobs rebase them.

Do not continuously tag every merge yourself — merge the Release PR when you
are ready to cut that app’s release.

### Conventional Commits → semver

| Prefix                                  | SemVer bump |
| --------------------------------------- | ----------- |
| `fix:`                                  | patch       |
| `feat:`                                 | minor       |
| `feat!:` / `fix!:` / `BREAKING CHANGE:` | major       |

Scopes (`feat(app):`, `fix(api):`) help humans; Release Please primarily
attributes commits by **files changed under each package path**.

### Shared packages caveat

A change only under `packages/shared` (or other `packages/*`) does **not**
auto-bump `apps/app` or `apps/api`. When a shared change should cut a consumer
release, include a commit that touches that app path (or land the shared change
in the same PR as an app file touch).

## Product app marketing semver vs build numbers

The product app uses **one marketing semver** across phone, TV, Wear OS, and web.
Release Please (`node` type) updates `package.json`, `app.json` `expo.version`
(a `json` extra-file), and the `.env.example` marketing keys via
`x-release-please-version` markers.

The app used the `expo` release type until the Expo SDK 58 upgrade. That type also
wrote `ios.buildNumber` and an SDK-derived `android.versionCode` (e.g. `570010201`)
into `app.json` on every release — values `app.config.js` always overrode. It was
replaced so `.env` is the only source of build integers. The release-please workflow
still reformats `app.json` with Biome on pending app Release PRs after each run.

| Owned by Release Please                                                     | Owned by you, in `apps/app/.env`                           |
| --------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `package.json` / `app.json` `expo.version`                                  | `EXPO_ANDROID_VERSION_CODE` (phone)                        |
| `EXPO_*_APP_VERSION` / `EXPO_PUBLIC_APP_VERSION` defaults in `.env.example` | `EXPO_ANDROID_TV_VERSION_CODE` (Android TV)                |
| `apps/app/CHANGELOG.md`                                                     | `EXPO_WEAR_VERSION_CODE` (Wear OS)                         |
|                                                                             | `EXPO_IOS_APP_BUILD_NUMBER` / `EXPO_TVOS_APP_BUILD_NUMBER` |

### Build integers: `.env` is the single source of truth

- `eas.json` uses `cli.appVersionSource: "local"` with no `autoIncrement`, so EAS
  builds use exactly the codes `app.config.js` reads from the environment.
- Phone, Android TV, and Wear OS share Play package `app.munibtracker`: every
  version code must be unique and higher than any code already uploaded, across
  all three form factors. See [`TV.md`](./TV.md).
- **Bump before every store upload.** Set the code above the highest one in Play
  Console / App Store Connect. (Before SDK 58, EAS kept its own remote counter, so
  check the stores the first time.)
- Release scripts (`pnpm release:app:*`, uploads) and EAS `production*` builds
  **fail** when a code is missing instead of falling back to `1`
  (`scripts/lib/platform-versions.cjs`).
- EAS builds don't see your local `.env`. Before `pnpm build:app:*`, set the same
  variables in the EAS project environment (`eas env:create --environment production
  --name EXPO_ANDROID_VERSION_CODE --value <code> --force`, and likewise for the others).

After merging an `app-v*` Release PR, copy the new marketing semver from
`.env.example` into local `apps/app/.env` / EAS environment before the next store
upload, then bump the build integers.

## Deploy relationship

Vercel (marketing, API, admin, Expo web) and EAS/local store pipelines are **not**
gated on Release Please tags in v1. Tags and per-app changelogs are the published
version source of truth; wire `apps/app--release_created` (and siblings) into
deploy jobs later if desired. See [`PRODUCTION.md`](./PRODUCTION.md).

## Maintainer bootstrap checklist

1. **Settings → Actions → General**: enable **Allow GitHub Actions to create and
   approve pull requests** (required by
   [release-please-action](https://github.com/googleapis/release-please-action)).
2. Create a fine-grained or classic PAT (or GitHub App installation token) that
   can open PRs and create releases. Store it as Actions secret
   **`RELEASE_PLEASE_TOKEN`**.
   - Plain `GITHUB_TOKEN` can open PRs, but events from that token do **not**
     re-trigger workflows — CI would not run on Release Please PRs.
3. Protect `main` as usual; maintainers merge Release PRs after CI is green.
4. Land a conventional commit under an app path → wait for the Release PR →
   merge → verify tag (`app-v…` / `api-v…` / …) + changelog + GitHub Release.
5. For product store ships: sync marketing semver into `.env` / EAS; bump
   version codes / build numbers independently.
