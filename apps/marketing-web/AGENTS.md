<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Marketing site (`apps/marketing-web`)

Next.js 16.4 landing site (port **3000**; `cacheComponents` + `partialPrefetching` on). Full setup notes: [`README.md`](./README.md). Animations are **CSS only — no animation library** (framer-motion was removed 2026-11-27: it shipped ~60 KB to every page and server-rendered the hero copy at `opacity:0`, the LCP element, until hydration). `ui/motion.tsx` (`Reveal`, `Stagger`) and `hero-motion.tsx` are server components emitting classes from `globals.css`: `.hero-rise` animates transform only (never hide above-the-fold content), `.scroll-reveal` uses scroll-driven `animation-timeline: view()` and is simply visible where unsupported; reduced motion disables both. Small effects use plain browser APIs (`Counter`: IntersectionObserver + rAF; `Magnetic`: pointer events + CSS transition). Don't enable `experimental.inlineCss` — measured worse (mobile Lighthouse 85 → 72). Sections, the hero and the footer are **server components**: keep client code to small islands (`TrackedLink` / `TrackedButton` for click analytics, the header, cookie card, back-to-top) so page copy never ships in the client bundle. Images: `preload` (not the deprecated `priority`) only on the above-the-fold LCP image.

## i18n (next-intl)

Pages live under `app/[locale]/` — every URL carries its locale (`/en/features`, `/ar/features`, `/ur/features`; Arabic and Urdu are RTL). Any URL without a locale (including `/`) 308-redirects to `/en/…` (`next.config.ts`; no language detection, no locale cookie). Store badges and web-app links use `storeUrls(locale)` / `productAppUrl(locale)` from `lib/site.ts`. Every English string change needs its `ar` + `ur` counterpart — the catalog parity tests fail otherwise; translated content pages mirror the English structure (`content/translations.test.ts`, rules in `src/content/i18n/README.md`). **No raw user-visible text in components or pages** — visible text, `alt`, `aria-label`, metadata, OG text and JSON-LD prose come from `src/messages/<locale>/<namespace>.json` via `useTranslations` / `getTranslations`. Use `Link` / `usePathname` from `@/i18n/navigation`, never `next/link`. Client components only get the namespaces in `CLIENT_NAMESPACES` (`src/messages/index.ts`). Long-form content stays typed data in `src/content/` and is read through the locale-aware getters (`getFeature(slug, locale)` …). Tests render with `renderWithIntl` (`src/test-support/intl.tsx`). Full guide: [`src/i18n/README.md`](./src/i18n/README.md).

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
  - **The Features menu is curated, not exhaustive:** at most 6 links per column (tested), each with its page's `icon` and `navLabel`; every feature is reachable from `/features` ("View all features"). Menus whose items all have icons render compact rows (icon + label, featured link as a strip under the columns); others show each item's hint with the featured card beside them. Panels cap at the viewport height and scroll inside. Check a new menu item at 1024 px and in `ar`/`ur` before adding it.
  - Comparison tables keep their column headers in view with a sticky header bar (`templates/synced-scroll.tsx` mirrors the body's horizontal scroll onto it); both tables share fixed column widths (`<colgroup>` + `table-fixed`).
- Article rules (citations, Arabic copied verbatim from the bundled Tanzil text / sunnah.com, no rulings, verified app facts only): `content/resources/ARTICLE_BRIEF.md`.
- Comparison rules: official sources only, `unverified` instead of guesses, list `sources`, update `VERIFIED_ON` when re-checked.
- **Feature inventory:** `content/munib-features.ts` lists every shipped feature (verified against [`docs/FEATURES.md`](../../docs/FEATURES.md) and the app code); NF ids use `nf()` (shipped) or `soon()` (`status: "planned"`, for an item from [`docs/BACKLOG.md`](../../docs/BACKLOG.md) that is being built). It renders as "Everything in Munib Tracker" on each comparison and "On the roadmap" on `/features` (hidden while nothing is planned). Comparison cells for NF features come from `MUNIB_NF` in `compare/shared.ts`, which follows the inventory status — a planned item renders "Coming soon" and must never be shown as available; only Munib cells may use `planned` (tested). **When a feature ships:** flip it to `nf()` in the inventory and add it to the relevant feature page.
- Screenshots: only real captures, per device × locale — `pnpm --filter marketing-web sync:screenshots` copies `apps/app/store-assets/captures-native/**` to `public/screenshots/<device>/<locale>/<theme>/<scene>.webp` and regenerates `lib/screenshot-manifest.generated.ts`. Use `useScreenshot(key, { device })` / `useCapture(device, scene)` from `lib/screenshots.ts` (page locale, English fallback) and render with `<DeviceScreen>` (`components/content/device-screen.tsx`: iPhone, Android, iPad, Android tablet, TV, Apple Watch, Wear OS frames); content slots take an optional `device`. Never hardcode `/screenshots/...` paths. Illustrations must be labelled as such (see `PracticePreview`).
- Counts in copy (adhkar, duas, translations…) must match the app data; shared counts live in `@munib-tracker/shared/constants` (`features.ts`; the dua count is `DUA_COUNT` in `content-counts.ts`, pinned to the data by a test).

## SEO

- `lib/seo.ts` `pageMetadata({ locale, … })` for every page: self-canonical in the page's locale, hreflang for every published locale + `x-default` (English), OG/Twitter (route `opengraph-image` files override the default card; `lib/og.tsx` renders them).
- `lib/structured-data.ts`: Organization + WebSite sitewide (`components/json-ld.tsx`), SoftwareApplication on `/` and `/features`, BreadcrumbList via `<Breadcrumbs>`, Article on guides, ItemList on hubs, FAQPage on `/faq` and on every content page with visible FAQs (`faqNodes`; the answers must be on the page). Never add ratings/reviews.
- `app/sitemap.ts` is generated from the registries with each entry's `updated` date; redirects for alternate URLs live in `next.config.ts`. Bump a page's `updated` when its content changes — `pnpm indexnow:marketing` (after `vercel deploy --prod`; see `docs/PRODUCTION.md`) submits pages whose `<lastmod>` changed to IndexNow (Bing / ChatGPT search). Its key file lives in `public/`; don't delete it.
- Store links: pass a campaign (`storeUrls(locale, { placement, content })`) so installs are attributable in Play Console (install `referrer` UTMs) and App Store Connect (`pt`/`ct`, when `NEXT_PUBLIC_APPLE_PROVIDER_TOKEN` is set). Structured data keeps the untagged URLs.
- `/llms.txt` and `/llms-full.txt` ([llmstxt.org](https://llmstxt.org)) are route handlers built by `lib/llms.ts` from the same registries and English catalogs: an index of every page, and their full text as Markdown. New registry pages appear automatically; a new static page needs an entry in `ABOUT_PAGES` / `OPTIONAL_PAGES`. `lib/llms.test.ts` checks the spec structure and every link.
- FAQs render with the zero-JS `<FaqList>` (`<details>`) so answers are in the HTML.

## Product copy

Store badges and download CTAs use `OFFICIAL_IOS_APP_STORE_URL` / `OFFICIAL_ANDROID_PLAY_STORE_URL` from `@munib-tracker/shared/constants` (App Store ID `6787222180`, Play package `app.munibtracker`). Use the app's terminology (Salah, Zikr/Adhkar, Qaza, Adhan, Tasbeeh, Dua, Masjid). Never add testimonials or reviews that aren't real.

Shipped catalog: [`docs/FEATURES.md`](../../docs/FEATURES.md) · open work: [`docs/BACKLOG.md`](../../docs/BACKLOG.md).

## Analytics & consent

Optional GA4 (`NEXT_PUBLIC_GA_MEASUREMENT_ID`). Consent Mode v2 defaults deny storage; `CookieConsentBanner` updates consent and persists preferences in `localStorage` (footer can reopen prefs). Details in [`README.md`](./README.md) and the privacy page.

Events (all in `lib/analytics.ts`; add new ones there, never call `gtag` directly):

| Event                                                                                                                 | Params                                                                                                                                                                                   | Fired by                                                   |
| --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `page_view`                                                                                                           | `page_path`; every event also carries `content_group` (home, feature, features_hub, comparison, guide, audience, …) and `page_language` set per page (`contentGroup()` in `lib/gtag.ts`) | route changes                                              |
| `download_click`                                                                                                      | `platform` (ios / android / web), `placement`, `feature` (feature slug, when on a feature page or guide tie-in)                                                                          | store badges, "Try it free in your browser", web-app links |
| `cta_click`                                                                                                           | `cta`, `placement`                                                                                                                                                                       | `TrackedButton` / `TrackedLink` CTAs                       |
| `section_nav`                                                                                                         | `section`, `page`                                                                                                                                                                        | header / drawer link clicks                                |
| `menu_open`                                                                                                           | `menu`, `device` (desktop after 0.5 s open; `drawer` on mobile)                                                                                                                          | header                                                     |
| `language_switch`                                                                                                     | `from_language`, `to_language`                                                                                                                                                           | locale switcher                                            |
| `scroll_depth`                                                                                                        | `percent` (25 / 50 / 75 / 90, once per page view)                                                                                                                                        | `GoogleAnalyticsPageViews`                                 |
| `faq_toggle`, `select_content`, `outbound_click`, `file_download`, `contact_form_submit` / `_error`, `cookie_consent` | see `lib/analytics.ts`                                                                                                                                                                   | —                                                          |

Register `placement`, `feature`, `platform`, `menu`, `percent` and `page_language` as event-scoped custom dimensions in GA4 (Admin → Custom definitions) to use them in reports; `content_group` is built in. Mark `download_click` as a key event.

**Web app links:** every feature page offers "Try it free in your browser", deep-linked to that feature's screen (`content/web-app.ts`, a map over every feature slug; `null` = phone-only, e.g. the focus lock). Links come from `webAppUrl()` in `lib/site.ts`, which adds `utm_source=munibtracker.app`, `utm_campaign=<placement>`, `utm_content=<feature>`. `content/web-app.test.ts` checks each path has a screen in `apps/app/src/app/`.
