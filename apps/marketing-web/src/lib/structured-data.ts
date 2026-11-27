import {
  APP_AUTHOR,
  APP_AUTHOR_URL,
  APP_NAME,
  OFFICIAL_ANDROID_PLAY_STORE_URL,
  OFFICIAL_IOS_APP_STORE_URL,
} from "@munib-tracker/shared/constants";
import type { FaqItem } from "@/content/types";
import { LOCALE_META } from "@/i18n/locales";
import type { Locale } from "@/i18n/routing";
import { PROJECT_LICENSE_URL } from "@/lib/open-source";
import { capture } from "@/lib/screenshots";
import { absoluteUrl, localizedUrl } from "@/lib/seo";
import { GITHUB_REPO_URL, productAppUrl, SITE_URL, storeUrls } from "@/lib/site";

/**
 * schema.org builders. Rules we follow (Google Search Central):
 * - Describe only what is visible on the page.
 * - No aggregateRating / review — we have no first-party review data and
 *   never invent ratings.
 * - FAQPage wherever a page shows visible Q&A (/faq, feature, audience,
 *   comparison and guide pages). Google limits FAQ rich results to
 *   authoritative government/health sites, but answer engines and AI
 *   assistants still read the markup, and every answer is on the page itself.
 *
 * Builders take the page's `locale`: URLs point at that locale's pages and
 * `inLanguage` is its BCP 47 tag. Prose (descriptions, names) is passed in
 * already translated (the `structuredData` catalog or the page's own copy).
 */

type Json = Record<string, unknown>;

/** schema.org `inLanguage` for a page in `locale`. */
function inLanguage(locale: Locale): string {
  return LOCALE_META[locale].hreflang;
}

/** The app's 24 interface locales (packages/shared/src/i18n/locale-registry.ts). */
const APP_LOCALES = [
  "en",
  "ar",
  "ur",
  "id",
  "tr",
  "bn",
  "ms",
  "fa",
  "fr",
  "ha",
  "sw",
  "ru",
  "az",
  "ps",
  "so",
  "uz",
  "kk",
  "ku",
  "bs",
  "sq",
  "ky",
  "tg",
  "tk",
  "hi",
];

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_ID = `${SITE_URL}/#software`;

export function organizationSchema(): Json {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: APP_NAME,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: absoluteUrl("/icon-512.png"), width: 512, height: 512 },
    founder: { "@type": "Person", name: APP_AUTHOR, url: APP_AUTHOR_URL },
    sameAs: [GITHUB_REPO_URL, OFFICIAL_IOS_APP_STORE_URL, OFFICIAL_ANDROID_PLAY_STORE_URL],
  };
}

export function websiteSchema({
  locale,
  description,
}: {
  locale: Locale;
  /** Translated site description (`structuredData.siteDescription`). */
  description: string;
}): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: localizedUrl("/", locale),
    name: APP_NAME,
    description,
    inLanguage: inLanguage(locale),
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function softwareApplicationSchema({
  locale,
  description,
  slogan,
  featureList,
}: {
  locale: Locale;
  /** Translated app description (`structuredData.siteDescription`). */
  description: string;
  /** Translated tagline (`metadata.tagline`). */
  slogan: string;
  /** Translated feature names. */
  featureList?: readonly string[];
}): Json {
  return {
    "@type": "SoftwareApplication",
    "@id": SOFTWARE_ID,
    name: APP_NAME,
    description,
    slogan,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS, Android, Web, tvOS, Android TV, watchOS, Wear OS",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
    url: localizedUrl("/", locale),
    // Store listings and the web app in the page's language.
    downloadUrl: [storeUrls(locale).ios, storeUrls(locale).android],
    installUrl: [storeUrls(locale).ios, storeUrls(locale).android, productAppUrl(locale)],
    // The app home screen, in the page language.
    screenshot: absoluteUrl(capture("iphone", "home", locale).src),
    publisher: { "@id": ORGANIZATION_ID },
    codeRepository: GITHUB_REPO_URL,
    license: PROJECT_LICENSE_URL,
    // The app's own interface languages, not the page's.
    inLanguage: APP_LOCALES,
    ...(featureList?.length ? { featureList: [...featureList] } : {}),
  };
}

export type Crumb = { name: string; href: string };

/** `crumbs` hrefs are unprefixed paths; they are emitted as `locale` URLs. */
export function breadcrumbSchema(crumbs: readonly Crumb[], locale: Locale): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: localizedUrl(c.href, locale),
    })),
  };
}

export function articleSchema(a: {
  locale: Locale;
  /** Unprefixed path of the article. */
  path: string;
  headline: string;
  description: string;
  published: string;
  modified: string;
  section: string;
  keywords: readonly string[];
  wordCount: number;
}): Json {
  const url = localizedUrl(a.path, a.locale);
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    headline: a.headline,
    description: a.description,
    datePublished: a.published,
    dateModified: a.modified,
    articleSection: a.section,
    keywords: a.keywords.join(", "),
    wordCount: a.wordCount,
    inLanguage: inLanguage(a.locale),
    image: localizedUrl(`${a.path}/opengraph-image`, a.locale),
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

export function webPageSchema(p: {
  locale: Locale;
  /** Unprefixed path of the page. */
  path: string;
  name: string;
  description: string;
  /** ISO date of the last substantive edit (a content page's `updated`). */
  modified?: string;
}): Json {
  const url = localizedUrl(p.path, p.locale);
  return {
    "@type": "WebPage",
    "@id": url,
    url,
    name: p.name,
    description: p.description,
    ...(p.modified ? { dateModified: p.modified } : {}),
    inLanguage: inLanguage(p.locale),
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": SOFTWARE_ID },
  };
}

/** `items` hrefs are unprefixed paths; they are emitted as `locale` URLs. */
export function itemListSchema(
  items: readonly { name: string; href: string }[],
  locale: Locale,
): Json {
  return {
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: localizedUrl(item.href, locale),
    })),
  };
}

export function faqPageSchema(items: readonly FaqItem[]): Json {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: stripMarkup(item.answer) },
    })),
  };
}

/** FAQPage for a page's visible FAQ, or nothing when it has none (spread into `graph`). */
export function faqNodes(items: readonly FaqItem[] | undefined): Json[] {
  return items?.length ? [faqPageSchema(items)] : [];
}

/** Wraps nodes in a single `@graph` document. */
export function graph(...nodes: Json[]): Json {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/** Removes the inline `[label](href)` / `**bold**` markup for plain-text fields. */
export function stripMarkup(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");
}
