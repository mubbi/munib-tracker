# Munib Tracker — Documentation index

Central map of project docs. **Active backlog** lives in [`BACKLOG.md`](./BACKLOG.md). **Shipped product features** are catalogued in [`FEATURES.md`](./FEATURES.md).

---

## Start here

| Doc | Use when you need… |
|-----|-------------------|
| [`BACKLOG.md`](./BACKLOG.md) | What is **still open** (product, i18n, performance, devices, content) |
| [`FEATURES.md`](./FEATURES.md) | What is **already shipped** (NF-* index + key routes/files) |
| [`../AGENTS.md`](../AGENTS.md) | Monorepo commands, conventions, agent rules |

---

## Guides (reference — not TODO lists)

| Topic | Doc |
|-------|-----|
| **Internationalization** (23 locales, scripts, SEO, scripture rules) | [`I18N_GUIDE.md`](./I18N_GUIDE.md) |
| **Content pipeline** (build-data, bundled assets, offline-first) | [`DATA_INGESTION.md`](./DATA_INGESTION.md) |
| **Data sources & licenses** (OSS Qur'an, hadith, adhkar, audio) | [`FREE_OPEN_SOURCE_DATA.md`](./FREE_OPEN_SOURCE_DATA.md) |
| **Native surfaces** (widgets, Live Activities, Siri, Watch, Wear) | [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md) |
| **Device & platform support** | [`DEVICES.md`](./DEVICES.md) |
| **Performance profiling & optimization** | [`PROFILING.md`](./PROFILING.md) |
| **App Store / Play screenshots** | [`STORE_ASSETS.md`](./STORE_ASSETS.md) |
| **iOS App Store listing copy** (23 app locales + 7 ASO) | [`IOS_APP_COPY.md`](./IOS_APP_COPY.md) |
| **Google Play short description** (23 app locales + 7 ASO) | [`ANDROID_APP_COPY.md`](./ANDROID_APP_COPY.md) |
| **Deep links & App Links** (scheme, widgets, OAuth) | [`DEEP_LINKS.md`](./DEEP_LINKS.md) |
| **OAuth setup** (Google & Apple sign-in) | [`OAUTH_SETUP.md`](./OAUTH_SETUP.md) |
| **Production / Vercel** (marketing, API, Expo web) | [`PRODUCTION.md`](./PRODUCTION.md) |

Per-app agent guides: [`apps/app/AGENTS.md`](../apps/app/AGENTS.md) · [`apps/api/AGENTS.md`](../apps/api/AGENTS.md) · [`apps/marketing-web/AGENTS.md`](../apps/marketing-web/AGENTS.md)

---

## Archive (historical — do not use as active backlog)

| Doc | Why kept |
|-----|----------|
| [`archive/TODO.md`](./archive/TODO.md) | Original phased PRD (Phases 0–12, all `done`) |
| [`archive/NEW_FEATURES_TODO.md`](./archive/NEW_FEATURES_TODO.md) | Full NF-* implementation flows (reference for agents) |

---

## Doc maintenance

- Mark work **done** in [`FEATURES.md`](./FEATURES.md); remove from [`BACKLOG.md`](./BACKLOG.md).
- Operational how-tos belong in **guides** (`I18N_GUIDE`, `DATA_INGESTION`, etc.), not in backlog files.
- Last docs review: **2026-07-09**.
