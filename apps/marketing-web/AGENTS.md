<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Marketing site (`apps/marketing-web`)

Next.js 16.4 landing site (port **3000**; `cacheComponents` + `partialPrefetching` on). Full setup notes: [`README.md`](./README.md). Animations: framer-motion via `src/components/ui/motion.tsx` — use `delayChildren: stagger()`, not the deprecated `staggerChildren`.

## Content architecture (pages are data)

Long-form pages are typed data in `src/content/` rendered by shared templates in `src/components/templates/`. Add a page by adding one entry — never a bespoke page component.

| Kind                            | Data                                                          | Route                          | Template                |
| ------------------------------- | ------------------------------------------------------------- | ------------------------------ | ----------------------- |
| Feature landing pages           | `content/features/<slug>.ts` + `features/index.ts`            | `/features/[slug]`             | `feature-template.tsx`  |
| Comparisons (versus + roundups) | `content/compare/*.ts` (Munib values in `compare/shared.ts`)  | `/compare/[slug]`              | `compare-template.tsx`  |
| Audience / use-case pages       | `content/audiences.ts`                                        | `/for/[slug]`                  | `audience-template.tsx` |
| Educational articles            | `content/resources/articles/<slug>.ts` + `resources/index.ts` | `/resources/[category]/[slug]` | `article-template.tsx`  |

- Types and the inline markup (`[label](/path)`, `**bold**` only) are documented in `content/types.ts`; rendered by `components/content/rich-text.tsx` and `blocks.tsx`.
- **Every new slug must also be added to `content/routes.ts`** (lean lists used by `src/proxy.ts` to return real 404s for unknown slugs under Partial Prerendering). `content/content.test.ts` fails if they drift, if any internal link is broken, if SEO titles/descriptions repeat, or if two pages target the same primary keyword (`keywords[0]`).
- Header mega-menus and footer groups are literals in `lib/site.ts` (`NAV_MENUS`, `FOOTER_GROUPS`) so the client header ships no page copy; the same test checks their hrefs.
- Article rules (citations, Arabic copied verbatim from the bundled Tanzil text / sunnah.com, no rulings, verified app facts only): `content/resources/ARTICLE_BRIEF.md`.
- Comparison rules: official sources only, `unverified` instead of guesses, list `sources`, update `VERIFIED_ON` when re-checked.
- **Feature inventory:** `content/munib-features.ts` lists every shipped feature (verified against [`docs/FEATURES.md`](../../docs/FEATURES.md) and the app code); NF ids use `nf()` (shipped) or `soon()` (`status: "planned"`, for an item from [`docs/BACKLOG.md`](../../docs/BACKLOG.md) that is being built). It renders as "Everything in Munib Tracker" on each comparison and "On the roadmap" on `/features` (hidden while nothing is planned). Comparison cells for NF features come from `MUNIB_NF` in `compare/shared.ts`, which follows the inventory status — a planned item renders "Coming soon" and must never be shown as available; only Munib cells may use `planned` (tested). **When a feature ships:** flip it to `nf()` in the inventory and add it to the relevant feature page.
- Screenshots: only real captures (`public/screenshots/*.webp`, registry `lib/screenshots.ts`). Illustrations must be labelled as such (see `PracticePreview`).
- Counts in copy (adhkar, duas, translations…) must match the app data; shared counts live in `@munib-tracker/shared/constants` (`features.ts`).

## SEO

- `lib/seo.ts` `pageMetadata()` for every page: self-canonical, `en` + `x-default` hreflang (site is English-only), OG/Twitter (route `opengraph-image` files override the default card; `lib/og.tsx` renders them).
- `lib/structured-data.ts`: Organization + WebSite sitewide (`components/json-ld.tsx`), SoftwareApplication on `/` and `/features`, BreadcrumbList via `<Breadcrumbs>`, Article on guides, ItemList on hubs, FAQPage **only** on `/faq`. Never add ratings/reviews.
- `app/sitemap.ts` is generated from the registries with each entry's `updated` date; redirects for alternate URLs live in `next.config.ts`.
- FAQs render with the zero-JS `<FaqList>` (`<details>`) so answers are in the HTML.

## Product copy

Store badges and download CTAs use `OFFICIAL_IOS_APP_STORE_URL` / `OFFICIAL_ANDROID_PLAY_STORE_URL` from `@munib-tracker/shared/constants` (App Store ID `6787222180`, Play package `app.munibtracker`). Use the app's terminology (Salah, Zikr/Adhkar, Qaza, Adhan, Tasbeeh, Dua, Masjid). Never add testimonials or reviews that aren't real.

Shipped catalog: [`docs/FEATURES.md`](../../docs/FEATURES.md) · open work: [`docs/BACKLOG.md`](../../docs/BACKLOG.md).

## Analytics & consent

Optional GA4 (`NEXT_PUBLIC_GA_MEASUREMENT_ID`). Consent Mode v2 defaults deny storage; `CookieConsentBanner` updates consent and persists preferences in `localStorage` (footer can reopen prefs). Details in [`README.md`](./README.md) and the privacy page.
