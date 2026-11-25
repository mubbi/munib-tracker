# Marketing-site i18n (`next-intl`)

The site is published per locale under `app/[locale]/`. Every URL carries its
locale — `/en/features`, `/ar/features`, `/ur/features` — so each language has
one canonical, crawlable URL. A URL without a locale (including `/`) is
permanently (308) redirected to its English page in `next.config.ts`; there is
no Accept-Language detection and no locale cookie. English is the source
language and the fallback for untranslated strings and pages. Published: English, Arabic
and Urdu (both right-to-left). Translation rules for translators:
[`src/content/i18n/README.md`](../content/i18n/README.md).

## Pieces

| File                           | Role                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| `i18n/routing.ts`              | next-intl routing (`localePrefix: "always"`); locale list in `i18n/config.ts`      |
| `i18n/locales.ts`              | `LOCALE_META` (native name, `dir`, `og:locale`, hreflang), path helpers            |
| `i18n/request.ts`              | Per-request config; locale from `next/root-params` (keeps pages static)            |
| `i18n/navigation.ts`           | Locale-aware `Link`, `usePathname`, `useRouter`, `redirect`, `getPathname`         |
| `messages/<locale>/*.json`     | Catalogs, one file per namespace; `messages/<locale>/index.ts` aggregates them     |
| `messages/index.ts`            | `loadMessages()` (English fallback merge), `CLIENT_NAMESPACES`                     |
| `content/localized.ts`         | Long-form content translations (`ContentTranslations`, `localizeEntries`)          |
| `components/site-document.tsx` | `<html lang dir>` + header/footer + `NextIntlClientProvider` (layout + global 404) |
| `src/proxy.ts`                 | next-intl middleware + real 404s for unknown content slugs                         |

Links that leave the site follow the visitor's language too: `storeUrls(locale)`
(App Store / Google Play storefront hints shared with the app) and
`productAppUrl(locale, path)` (the web app's `/ar`, `/ur` routes) in `lib/site.ts`.

## Writing copy

- **No raw user-visible text in components or pages.** Visible text, `alt`,
  `aria-label`, `title`, `<title>`/metadata, OG image text and JSON-LD prose
  all come from the catalog. Brand/product names that are never translated
  (`APP_NAME`, "App Store", "Google Play", "GitHub") come in as ICU params or stay
  as constants. Arabic scripture (Qur'an/hadith text) is content, not UI — leave
  it in its data module.
- **Server components** (default): `const t = useTranslations("ns")` in a
  non-async component; `const t = await getTranslations("ns")` in an async page,
  `generateMetadata`, or route. Need the locale? `useLocale()` / `await getLocale()`.
- **Client components**: `useTranslations` works only for namespaces in
  `CLIENT_NAMESPACES` (those are serialized to the browser). Prefer translating
  on the server and passing strings as props to a client island.
- **Interpolation / plurals**: ICU syntax — `"{count, plural, one {# dua} other {# duas}}"`,
  `"Explore {appName}"`. Never build sentences by concatenating translated fragments.
- **Inline markup**: `t.rich("key", { strong: (c) => <strong>{c}</strong>, link: (c) => <Link href="/x">{c}</Link> })`
  with `"Read <link>the guide</link>"` in the catalog. Keep hrefs out of the
  catalog unless they differ per locale.
- **Lists of items** (cards, steps, FAQ): keep the structural data (ids, hrefs,
  icons, colors) in code and key the copy by a stable id:
  `items.map(({ id, icon }) => t(\`steps.${id}.title\`))`. Use `t.raw("key")` only
  for plain string arrays.
- **Metadata**: `export async function generateMetadata() { const t = await getTranslations("ns");
  return pageMetadata({ locale: await getLocale(), path, title: t("meta.title"), description: t("meta.description") }); }`
- **Links**: import `Link` from `@/i18n/navigation`, never `next/link`. External
  URLs pass through unchanged.
- **Long-form content** (`src/content/**`) stays typed TS data. Read it through
  the locale-aware getters (`getFeaturePages(locale)`, `getFeature(slug, locale)`,
  `getComparePages`, `getAudiencePages`, `getArticles`, `getCategories`,
  `getFeatureInventory`) so translated entries are picked up when they exist.
  UI labels _around_ the content (section headings, "Related guides", button
  text) belong in the `templates` catalog.

## Tests

Components that call `useTranslations` render with `renderWithIntl()` from
`@/test-support/intl` (full English catalog). Async components that call
`getTranslations` can't be rendered by Testing Library — keep those to pages.

## Adding a language

1. Add the code to `LOCALES` (`i18n/routing.ts`) and its `LOCALE_META` entry.
2. Copy `messages/en/` to `messages/<code>/`, translate, and register the loader
   in `messages/index.ts` (`LOADERS`). Missing keys fall back to English.
3. Optionally translate content pages and register them in each registry's
   `TRANSLATIONS` map. Follow `content/resources/ARTICLE_BRIEF.md` (Arabic is
   copied verbatim, citations unchanged).
4. RTL locales (`dir: "rtl"`) get `<html dir="rtl">`. Components use logical
   Tailwind utilities (`ms-*`, `ps-*`, `start-*`, `text-start`, `border-s`) and
   flip directional icons with `rtl:-scale-x-100`. Arabic-script text uses Noto
   Naskh Arabic (chained after Inter/Jakarta in `globals.css`), with
   letter-spacing reset and taller heading leading for `ar`/`ur`.
5. Social cards: `next/og` can't shape Arabic script, so RTL locales render the
   English card text (`ogLocale()` in `lib/og.tsx`); alt text is translated.

## Tests that guard translations

- `src/i18n/i18n.test.ts` — every locale's catalog has exactly the English keys
  and keeps every ICU argument, rich-text tag and inline link.
- `src/content/translations.test.ts` — translated content mirrors the English
  structure (slugs, hrefs, dates, verbatim Arabic, link targets) with unique
  SEO titles and primary keywords per locale.

The language picker, sitemap and hreflang alternates pick up new locales
automatically.
