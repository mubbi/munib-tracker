import { usePathname } from "expo-router";
// The vendored Helmet is the SAME instance Expo's static renderer collects into
// the exported <head> (via `Head.Provider`), so tags rendered here land in the
// static HTML. We use it directly instead of `expo-router/head`'s `Head`, whose
// `useIsFocused()` gate returns false during static export and drops all tags.
import { Helmet } from "expo-router/vendor/react-helmet-async/lib";
import { useMemo } from "react";

import {
  absoluteUrl,
  formatTitle,
  HREFLANG_BY_LOCALE,
  localizedUrl,
  OG_LOCALE_BY_LOCALE,
  SEO_APP,
  SEO_AUTHOR,
  SEO_DEFAULT_KEYWORDS,
  SEO_DEFAULT_LOCALE,
  SEO_LOCALES,
  SEO_OG_IMAGE,
  SEO_TWITTER,
  type SeoLocale,
} from "@/config/seo";
import { getRouteSeo, normalizePath } from "@/config/seo-routes";
import { type BreadcrumbEntry, breadcrumbSchema } from "@/lib/seo/structured-data";

export type SeoProps = {
  /** Canonical route path (e.g. `/quran`). Falls back to the current pathname. */
  path?: string;
  /** Page title (brand suffix is appended automatically unless `isHome`). */
  title?: string;
  /** ~150–160 char meta description, written for humans. */
  description?: string;
  /** Extra keywords merged with the shared baseline. */
  keywords?: readonly string[];
  /** Social image path or absolute URL. Defaults to the app icon. */
  image?: string;
  imageAlt?: string;
  /** `false` emits `noindex` — use for utility, private, or thin pages. */
  index?: boolean;
  /** `false` emits `nofollow`. */
  follow?: boolean;
  /** Open Graph object type. */
  type?: "website" | "article";
  /** Home page uses the brand title verbatim (no ` · Munib Tracker` suffix). */
  isHome?: boolean;
  /** Breadcrumb trail → BreadcrumbList JSON-LD. */
  breadcrumbs?: readonly BreadcrumbEntry[];
  /** Additional Schema.org JSON-LD node(s) for this page. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** Primary content language of the page (defaults to `en`). */
  locale?: SeoLocale;
};

/**
 * Per-route SEO / social / structured-data head tags.
 *
 * Renders into the document `<head>` via `expo-router/head` so every statically
 * exported page ships unique, crawlable metadata for search engines and AI
 * answer engines. Values resolve in priority order:
 *   explicit prop → route registry (`seo-routes.ts`) → global defaults.
 *
 * Site-wide invariants (charset, viewport, icons, theme-color, the Organization
 * / WebSite / SoftwareApplication graph) live in `app/+html.tsx` and are
 * intentionally NOT repeated here to avoid duplicate tags.
 */
export function Seo(props: SeoProps) {
  const pathname = usePathname();
  const resolvedPath = normalizePath(props.path ?? pathname ?? "/");
  const registry = getRouteSeo(resolvedPath);

  // Emit head tags only for the screen whose canonical path matches the URL
  // being rendered. This replaces `Head`'s focus gate with a deterministic
  // check that works identically in static export and on the client: when
  // several screens are mounted (tabs, stack history), exactly one matches the
  // active URL, so exactly one set of tags is contributed. Fail open if the
  // pathname is unavailable.
  const isActiveRoute = pathname == null ? true : resolvedPath === normalizePath(pathname);

  const isHome = props.isHome ?? resolvedPath === "/";
  const rawTitle = props.title ?? registry?.title;
  const title = formatTitle(rawTitle, { isHome });
  const description = props.description ?? registry?.description ?? SEO_APP.description;
  const canonical = absoluteUrl(resolvedPath);
  const locale = props.locale ?? SEO_DEFAULT_LOCALE;

  const index = props.index ?? registry?.index ?? true;
  const follow = props.follow ?? true;
  const ogType = props.type ?? "website";

  const imagePath = props.image ?? registry?.image ?? SEO_OG_IMAGE.url;
  const imageUrl = absoluteUrl(imagePath);
  const imageAlt = props.imageAlt ?? registry?.imageAlt ?? SEO_OG_IMAGE.alt;

  const keywords = useMemo(() => {
    const merged = new Set<string>([
      ...(props.keywords ?? []),
      ...(registry?.keywords ?? []),
      ...SEO_DEFAULT_KEYWORDS,
    ]);
    return Array.from(merged).join(", ");
  }, [props.keywords, registry?.keywords]);

  const robots = useMemo(() => {
    const directives = [index ? "index" : "noindex", follow ? "follow" : "nofollow"];
    if (index) {
      directives.push("max-image-preview:large", "max-snippet:-1", "max-video-preview:-1");
    }
    return directives.join(", ");
  }, [index, follow]);

  const jsonLdBlocks = useMemo(() => {
    const blocks: Record<string, unknown>[] = [];
    if (props.breadcrumbs?.length) blocks.push(breadcrumbSchema(props.breadcrumbs));
    if (Array.isArray(props.jsonLd)) blocks.push(...props.jsonLd);
    else if (props.jsonLd) blocks.push(props.jsonLd);
    return blocks;
  }, [props.breadcrumbs, props.jsonLd]);

  const ogLocale = OG_LOCALE_BY_LOCALE[locale];
  const alternateLocales = SEO_LOCALES.filter((l) => l !== locale);

  if (!isActiveRoute) return null;

  // hreflang alternates are only meaningful once locales resolve to distinct
  // URLs. Today the app is one static build (language switches client-side), so
  // `localizedUrl` is identity and we emit none — this auto-activates the day
  // locale-prefixed routing lands, with no change to callers.
  const localeUrls = SEO_LOCALES.map((l) => localizedUrl(resolvedPath, l));
  const hasDistinctLocaleUrls = new Set(localeUrls).size > 1;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={SEO_AUTHOR.name} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <link rel="canonical" href={canonical} />

      {/* hreflang alternates — only when locales resolve to distinct URLs. */}
      {hasDistinctLocaleUrls
        ? SEO_LOCALES.map((l) => (
            <link
              key={`hreflang-${l}`}
              rel="alternate"
              hrefLang={HREFLANG_BY_LOCALE[l]}
              href={localizedUrl(resolvedPath, l)}
            />
          ))
        : null}
      {hasDistinctLocaleUrls ? (
        <link
          rel="alternate"
          hrefLang="x-default"
          href={localizedUrl(resolvedPath, SEO_DEFAULT_LOCALE)}
        />
      ) : null}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SEO_APP.name} />
      <meta property="og:title" content={rawTitle ?? title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:image:width" content={String(SEO_OG_IMAGE.width)} />
      <meta property="og:image:height" content={String(SEO_OG_IMAGE.height)} />
      <meta property="og:locale" content={ogLocale} />
      {alternateLocales.map((l) => (
        <meta key={`og-alt-${l}`} property="og:locale:alternate" content={OG_LOCALE_BY_LOCALE[l]} />
      ))}

      {/* Twitter / X */}
      <meta name="twitter:card" content={SEO_TWITTER.card} />
      <meta name="twitter:title" content={rawTitle ?? title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />
      {SEO_TWITTER.site ? <meta name="twitter:site" content={SEO_TWITTER.site} /> : null}
      {SEO_TWITTER.creator ? <meta name="twitter:creator" content={SEO_TWITTER.creator} /> : null}

      {/* Structured data */}
      {jsonLdBlocks.map((block, i) => (
        <script
          // biome-ignore lint/suspicious/noArrayIndexKey: static, never-reordered JSON-LD list
          key={`ld-${i}`}
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be an inline script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </Helmet>
  );
}
