# Munib Tracker — Marketing site (`apps/marketing-web`)

**Next.js 16** landing site (port **3000**) with Tailwind CSS v4. Server Components by default, `cacheComponents: true`, Metadata API, `sitemap.ts` + `robots.ts`.

> Part of the [Munib Tracker monorepo](../../README.md). Run commands from the **repo root** with pnpm workspace filters. This is a **different app** from `apps/app`'s Expo web export (~8081) and from `apps/api` (3001).
>
> ⚠️ This is **not** the Next.js in your training data — it has breaking changes. Read the relevant guide in `node_modules/next/dist/docs/` before writing code (see [`AGENTS.md`](AGENTS.md)).

## Develop

```bash
pnpm install                              # from repo root
pnpm --filter marketing-web dev           # dev server on http://localhost:3000
pnpm --filter marketing-web build         # production build
pnpm --filter marketing-web test          # Vitest + Testing Library
pnpm --filter marketing-web check-types
```

## Notes

- Styling: Tailwind v4 with `@source` scanning the monorepo packages in `globals.css`; design tokens come from `@munib-tracker/theme`.
- Canonical origin via `NEXT_PUBLIC_SITE_URL` (default `https://munibtracker.app`) in `src/lib/site.ts`, consumed by metadata / `robots.ts` / `sitemap.ts` / footer.
- Feature copy is driven by `APP_FEATURE_PILLARS` from `@munib-tracker/shared/constants` (consumed by `feature-grid.tsx` / `feature-pillars.tsx`) — keep it in sync when app features ship.
- Pages: landing (`src/app/page.tsx`) plus `about`, `features`, `faq`, `credits`, `download`, `press`, `contact`, `privacy`, `terms` (legal pages use the shared `content-page.tsx`).
