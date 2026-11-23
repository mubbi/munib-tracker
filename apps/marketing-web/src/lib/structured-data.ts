import {
  APP_AUTHOR,
  APP_AUTHOR_URL,
  APP_NAME,
  APP_TAGLINE,
  OFFICIAL_ANDROID_PLAY_STORE_URL,
  OFFICIAL_IOS_APP_STORE_URL,
} from "@munib-tracker/shared/constants";
import type { FaqItem } from "@/content/types";
import { PROJECT_LICENSE_URL } from "@/lib/open-source";
import { absoluteUrl } from "@/lib/seo";
import { GITHUB_REPO_URL, PRODUCT_APP_URL, SITE_URL } from "@/lib/site";

/**
 * schema.org builders. Rules we follow (Google Search Central):
 * - Describe only what is visible on the page.
 * - No aggregateRating / review — we have no first-party review data and
 *   never invent ratings.
 * - FAQPage only on the dedicated /faq page (FAQ rich results are limited to
 *   authoritative government/health sites; markup elsewhere adds nothing).
 */

type Json = Record<string, unknown>;

/** Site description for schema.org (kept here so the app's shared copy is untouched). */
const SITE_DESCRIPTION =
  "Munib Tracker is a free Islamic app with no ads: track your Salah, make up Qaza, keep daily Zikr, read and practise the Qur'an, and learn your deen, on phone, web, watch and TV.";

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

export function websiteSchema(): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: APP_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function softwareApplicationSchema(featureList?: readonly string[]): Json {
  return {
    "@type": "SoftwareApplication",
    "@id": SOFTWARE_ID,
    name: APP_NAME,
    description: SITE_DESCRIPTION,
    slogan: APP_TAGLINE,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS, Android, Web, tvOS, Android TV, watchOS, Wear OS",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
    url: SITE_URL,
    downloadUrl: [OFFICIAL_IOS_APP_STORE_URL, OFFICIAL_ANDROID_PLAY_STORE_URL],
    installUrl: [OFFICIAL_IOS_APP_STORE_URL, OFFICIAL_ANDROID_PLAY_STORE_URL, PRODUCT_APP_URL],
    screenshot: absoluteUrl("/screenshots/home.webp"),
    publisher: { "@id": ORGANIZATION_ID },
    codeRepository: GITHUB_REPO_URL,
    license: PROJECT_LICENSE_URL,
    inLanguage: APP_LOCALES,
    ...(featureList?.length ? { featureList: [...featureList] } : {}),
  };
}

export type Crumb = { name: string; href: string };

export function breadcrumbSchema(crumbs: readonly Crumb[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  };
}

export function articleSchema(a: {
  path: string;
  headline: string;
  description: string;
  published: string;
  modified: string;
  section: string;
  keywords: readonly string[];
  wordCount: number;
}): Json {
  return {
    "@type": "Article",
    "@id": `${absoluteUrl(a.path)}#article`,
    mainEntityOfPage: absoluteUrl(a.path),
    headline: a.headline,
    description: a.description,
    datePublished: a.published,
    dateModified: a.modified,
    articleSection: a.section,
    keywords: a.keywords.join(", "),
    wordCount: a.wordCount,
    inLanguage: "en",
    image: absoluteUrl(`${a.path}/opengraph-image`),
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

export function webPageSchema(p: { path: string; name: string; description: string }): Json {
  return {
    "@type": "WebPage",
    "@id": absoluteUrl(p.path),
    url: absoluteUrl(p.path),
    name: p.name,
    description: p.description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": SOFTWARE_ID },
  };
}

export function itemListSchema(items: readonly { name: string; href: string }[]): Json {
  return {
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.href),
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

/** Wraps nodes in a single `@graph` document. */
export function graph(...nodes: Json[]): Json {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/** Removes the inline `[label](href)` / `**bold**` markup for plain-text fields. */
export function stripMarkup(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");
}
