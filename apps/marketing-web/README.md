# Munib Tracker — Marketing site (`apps/marketing-web`)

**Next.js 16.4** landing site (port **3000**) with React 19.3 and Tailwind CSS v4.3. Server Components by default, `cacheComponents: true`, `partialPrefetching: true` (`next.config.ts`), Metadata API, `sitemap.ts` + `robots.ts`, `opengraph-image.tsx`.

> Part of the [Munib Tracker monorepo](../../README.md). Run commands from the **repo root** with pnpm workspace filters. This is a **different app** from `apps/app`'s Expo web export (~8081) and from `apps/api` (3001).
>
> ⚠️ This is **not** the Next.js in your training data — it has breaking changes. Read the relevant guide in `node_modules/next/dist/docs/` before writing code (see [`AGENTS.md`](AGENTS.md)).

## Develop

```bash
pnpm install                              # from repo root
pnpm --filter marketing-web dev           # dev server on http://localhost:3000
pnpm --filter marketing-web build         # production build
pnpm --filter marketing-web test          # Vitest + Testing Library (vitest.config.mts)
pnpm --filter marketing-web check-types
```

## Notes

- i18n: [next-intl](https://next-intl.dev) with routes under `src/app/[locale]/` — every URL carries its locale (`/en/…`, `/ar/…`, `/ur/…`; Arabic and Urdu right-to-left); unprefixed URLs permanently redirect to English. UI copy lives in `src/messages/<locale>/<namespace>.json`; long-form pages stay typed data in `src/content/` with per-locale overlays. Language picker in the header, mobile drawer and footer. See [`src/i18n/README.md`](src/i18n/README.md).
- Styling: Tailwind v4 with `@source` scanning `src/` and `packages/theme/src` in `globals.css`; site tokens live in the `@theme` block there (class-based `.dark` variant).
- Motion: `framer-motion` wrappers in `src/components/ui/motion.tsx`; stagger uses `delayChildren: stagger()` (the deprecated `staggerChildren` is not used).
- Canonical origin via `NEXT_PUBLIC_SITE_URL` (default `https://munibtracker.app`) in `src/lib/site.ts`, consumed by metadata / `robots.ts` / `sitemap.ts` / footer. "Open app" CTAs use `NEXT_PUBLIC_PRODUCT_APP_URL` (default `https://my.munibtracker.app`).
- Feature copy is driven by `APP_FEATURE_PILLARS` / `APP_HOME_FEATURES` from `@munib-tracker/shared/constants` (consumed by `feature-grid.tsx` / `feature-pillars.tsx`) — keep it in sync when app features ship.
- Store badges link to App Store (`id6787222180`) and Google Play (`app.munibtracker`) via `OFFICIAL_*_STORE_URL` in `@munib-tracker/shared`.
- Pages: landing (`src/app/[locale]/page.tsx`) plus `about`, `features`, `faq`, `credits`, `download`, `press`, `contact`, `learn`, `open-source`, `contributors`, `privacy`, `terms` (all subpages use the shared `content-page.tsx`). `contributors` lists human GitHub contributors via `src/lib/github-contributors.ts` (cached with `cacheLife` / `cacheTag`).
- Contact form: `POST /api/contact` stores rows in Postgres `contact_messages` via Drizzle (`@munib-tracker/db`; requires `DATABASE_URL`). Rate limit: 2 submissions per email per 24h. Admins triage at `/contact-messages`.
- Analytics: optional GA4 via `NEXT_PUBLIC_GA_MEASUREMENT_ID` (`src/components/analytics.tsx`, `src/lib/gtag.ts`, `src/lib/analytics.ts`). Consent Mode v2 defaults deny storage; the first-party cookie banner (`CookieConsentBanner`) calls `gtag('consent','update')` when visitors accept or decline analytics. Preferences are stored in `localStorage` and can be reopened from the footer. Set the env to empty to disable GA.
