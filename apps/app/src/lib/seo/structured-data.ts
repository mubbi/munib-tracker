import {
  APP_DESCRIPTION,
  APP_NAME,
  APP_TAGLINE,
  OFFICIAL_ANDROID_PLAY_STORE_URL,
  OFFICIAL_IOS_APP_STORE_URL,
} from "@munib-tracker/shared/constants";

import {
  absoluteUrl,
  MARKETING_ORIGIN,
  SEO_AUTHOR,
  SEO_LOCALES,
  SEO_OG_IMAGE,
  SEO_ORIGIN,
} from "@/config/seo";

/**
 * Schema.org JSON-LD builders.
 *
 * Structured data is the highest-leverage signal for AI answer engines and rich
 * results — it states entities, relationships, and page purpose in a
 * machine-readable form. Builders return plain objects; `<Seo jsonLd={...}>`
 * (and `+html.tsx` for the site-wide graph) serialize them into
 * `<script type="application/ld+json">` tags.
 *
 * `@id` values are stable, absolute, and fragment-based so nodes can reference
 * each other across a page (e.g. a WebPage `isPartOf` the WebSite).
 */

type JsonLd = Record<string, unknown>;

const WEBSITE_ID = `${SEO_ORIGIN}/#website`;
const ORGANIZATION_ID = `${SEO_ORIGIN}/#organization`;
const SOFTWARE_ID = `${SEO_ORIGIN}/#software`;

/** Absolute URL of the default social image, for ImageObject nodes. */
const ogImageUrl = absoluteUrl(SEO_OG_IMAGE.url);

/** Organization / publisher behind the app. Referenced as publisher elsewhere. */
export function organizationSchema(): JsonLd {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: APP_NAME,
    url: SEO_ORIGIN,
    description: APP_DESCRIPTION,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/assets/images/icon-512.png"),
      width: 512,
      height: 512,
    },
    founder: {
      "@type": "Person",
      name: SEO_AUTHOR.name,
      url: SEO_AUTHOR.url,
    },
    sameAs: [MARKETING_ORIGIN, SEO_AUTHOR.url, "https://github.com/mubbi/munib-tracker"],
  };
}

/** WebSite node with a SearchAction wired to the in-app universal search. */
export function websiteSchema(): JsonLd {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SEO_ORIGIN,
    name: APP_NAME,
    description: APP_DESCRIPTION,
    inLanguage: [...SEO_LOCALES],
    publisher: { "@id": ORGANIZATION_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SEO_ORIGIN}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** SoftwareApplication / WebApplication describing the product itself. */
export function softwareApplicationSchema(): JsonLd {
  return {
    "@type": ["SoftwareApplication", "WebApplication"],
    "@id": SOFTWARE_ID,
    name: APP_NAME,
    description: APP_DESCRIPTION,
    slogan: APP_TAGLINE,
    url: SEO_ORIGIN,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "iOS, Android, Web",
    browserRequirements: "Requires JavaScript. Works offline once installed.",
    inLanguage: [...SEO_LOCALES],
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": ORGANIZATION_ID },
    image: ogImageUrl,
    installUrl: [OFFICIAL_IOS_APP_STORE_URL, OFFICIAL_ANDROID_PLAY_STORE_URL, SEO_ORIGIN],
    sameAs: [OFFICIAL_IOS_APP_STORE_URL, OFFICIAL_ANDROID_PLAY_STORE_URL, MARKETING_ORIGIN],
    featureList: [
      "Salah tracking with streaks and calendar",
      "Qaza calculator, planner, and fasting tracking",
      "Zikr, tasbeeh, and daily adhkar",
      "Offline Qur'an, hadith, duas, and the 99 Names of Allah",
      "Prayer times, Hijri calendar, and qibla compass",
      "Universal offline search and gentle reminders",
    ],
  };
}

/** The site-wide graph injected once on every page (via `+html.tsx`). */
export function siteGraphSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationSchema(), websiteSchema(), softwareApplicationSchema()],
  };
}

export type BreadcrumbEntry = { name: string; path: string };

/** BreadcrumbList — clarifies site hierarchy for crawlers and AI. */
export function breadcrumbSchema(entries: readonly BreadcrumbEntry[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.path),
    })),
  };
}

/**
 * WebPage node tying a page to the site graph. `primary` marks the main entity
 * so AI engines know what the page is fundamentally *about*.
 */
export function webPageSchema(options: {
  path: string;
  name: string;
  description: string;
  type?: string;
  breadcrumbs?: readonly BreadcrumbEntry[];
  primaryImage?: string;
}): JsonLd {
  const url = absoluteUrl(options.path);
  const schema: JsonLd = {
    "@context": "https://schema.org",
    "@type": options.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: options.name,
    description: options.description,
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: options.primaryImage ? absoluteUrl(options.primaryImage) : ogImageUrl,
    },
  };
  if (options.breadcrumbs?.length) {
    schema.breadcrumb = {
      "@type": "BreadcrumbList",
      itemListElement: options.breadcrumbs.map((entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: entry.name,
        item: absoluteUrl(entry.path),
      })),
    };
  }
  return schema;
}

export type FaqEntry = { question: string; answer: string };

/** FAQPage — eligible for FAQ rich results and heavily used by AI answers. */
export function faqSchema(entries: readonly FaqEntry[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

/**
 * CollectionPage — for index/listing screens (Qur'an surahs, hadith
 * collections, dua/zikr categories). Optionally embeds an ItemList.
 */
export function collectionPageSchema(options: {
  path: string;
  name: string;
  description: string;
  items?: readonly BreadcrumbEntry[];
  breadcrumbs?: readonly BreadcrumbEntry[];
}): JsonLd {
  const schema = webPageSchema({ ...options, type: "CollectionPage" });
  if (options.items?.length) {
    schema.mainEntity = {
      "@type": "ItemList",
      numberOfItems: options.items.length,
      itemListElement: options.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    };
  }
  return schema;
}

/**
 * Article / CreativeWork for a single piece of religious content (a dua, a
 * zikr, a hadith). Keeps attribution honest via publisher + author.
 */
export function articleSchema(options: {
  path: string;
  headline: string;
  description: string;
  type?: string;
  inLanguage?: string;
  articleBody?: string;
  breadcrumbs?: readonly BreadcrumbEntry[];
}): JsonLd {
  const url = absoluteUrl(options.path);
  const schema: JsonLd = {
    "@context": "https://schema.org",
    "@type": options.type ?? "Article",
    "@id": `${url}#article`,
    headline: options.headline,
    description: options.description,
    url,
    inLanguage: options.inLanguage ?? "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORGANIZATION_ID },
    isAccessibleForFree: true,
  };
  if (options.articleBody) schema.articleBody = options.articleBody;
  if (options.breadcrumbs?.length) {
    schema.breadcrumb = breadcrumbSchema(options.breadcrumbs);
  }
  return schema;
}
