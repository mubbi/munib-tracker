import {
  buildLocalizedAndroidPlayStoreUrl,
  buildLocalizedIosAppStoreUrl,
} from "@munib-tracker/shared/constants";
import type { FeatureIconKey } from "@/content/types";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import type footerMessages from "@/messages/en/footer.json";
import type navMessages from "@/messages/en/nav.json";

/**
 * Canonical marketing-site origin. Override per environment with
 * `NEXT_PUBLIC_SITE_URL` (e.g. a preview deployment). No trailing slash.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://munibtracker.app").replace(
  /\/$/,
  "",
);

/** Product app (Expo web) URL for "Open app" / PWA demo CTAs. */
export const PRODUCT_APP_URL = (
  process.env.NEXT_PUBLIC_PRODUCT_APP_URL ?? "https://my.munibtracker.app"
).replace(/\/$/, "");

/**
 * Product web app URL in the visitor's language. The app serves English
 * unprefixed and other languages under `/{locale}` (its boot script switches
 * the UI language — `apps/app/src/lib/locale-path.ts`).
 */
export function productAppUrl(locale: Locale, path = "/"): string {
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const tail = path === "/" ? "" : path;
  return `${PRODUCT_APP_URL}${prefix}${tail}` || PRODUCT_APP_URL;
}

/**
 * Product web app link with campaign tags, so visits from the marketing site
 * are attributable in the app's analytics: `utm_campaign` is where the link
 * sits (e.g. `feature_hero`), `utm_content` the feature or page it promotes.
 * On phones with the app installed, `my.munibtracker.app` universal / App
 * Links open the app itself.
 */
export function webAppUrl(
  locale: Locale,
  path = "/",
  campaign?: { placement: string; content?: string },
): string {
  const url = productAppUrl(locale, path);
  if (!campaign) return url;
  // `https://my.munibtracker.app?…` → `https://my.munibtracker.app/?…`
  const base = /^https?:\/\/[^/]+$/.test(url) ? `${url}/` : url;
  const params = new URLSearchParams({
    utm_source: "munibtracker.app",
    utm_medium: "referral",
    utm_campaign: campaign.placement,
    ...(campaign.content ? { utm_content: campaign.content } : {}),
  });
  return `${base}${base.includes("?") ? "&" : "?"}${params.toString()}`;
}

/** Deep link into the product app's Qur'an reader, focused on one ayah. */
export function appQuranAyahUrl(surah: number, ayah: number, locale: Locale): string {
  return `${productAppUrl(locale, `/quran/${surah}`)}?ayah=${ayah}`;
}

/** Where a store link sits (`placement`) and what it promotes (`content`, e.g. a feature slug). */
export type StoreCampaign = { placement: string; content?: string };

/**
 * App Store Connect provider token (App Analytics → Campaigns). When set,
 * App Store links carry `pt` + `ct` so page views and downloads are reported
 * per campaign. Public by design (it appears in every campaign link).
 */
const APPLE_PROVIDER_TOKEN = (process.env.NEXT_PUBLIC_APPLE_PROVIDER_TOKEN ?? "").trim();

/** Apple campaign names allow up to 40 characters. */
function appleCampaignName({ placement, content }: StoreCampaign): string {
  return (content ? `${placement}-${content}` : placement).slice(0, 40);
}

function withParams(url: string, params: Record<string, string>): string {
  return `${url}${url.includes("?") ? "&" : "?"}${new URLSearchParams(params).toString()}`;
}

/**
 * App Store / Google Play listings in the visitor's language — the same
 * storefront hints the app uses (shared `buildLocalized*StoreUrl`: Arabic →
 * Saudi storefront / `hl=ar`, Urdu → Pakistan storefront / `hl=ur`).
 *
 * With a `campaign`, installs become attributable in the stores themselves
 * (the app has no analytics of its own):
 * - Google Play: the install `referrer` carries UTM tags, reported in Play
 *   Console → Store listing acquisition (`utm_campaign` = placement,
 *   `utm_content` = feature).
 * - App Store: `pt` + `ct` campaign tokens, reported in App Store Connect →
 *   App Analytics → Sources → Campaigns (only when the provider token is set).
 */
export function storeUrls(
  locale: Locale,
  campaign?: StoreCampaign,
): { ios: string; android: string } {
  const ios = buildLocalizedIosAppStoreUrl(locale);
  const android = buildLocalizedAndroidPlayStoreUrl(locale);
  if (!campaign) return { ios, android };
  const referrer = new URLSearchParams({
    utm_source: "munibtracker.app",
    utm_medium: "referral",
    utm_campaign: campaign.placement,
    ...(campaign.content ? { utm_content: campaign.content } : {}),
  }).toString();
  return {
    ios: APPLE_PROVIDER_TOKEN
      ? withParams(ios, { pt: APPLE_PROVIDER_TOKEN, ct: appleCampaignName(campaign), mt: "8" })
      : ios,
    android: withParams(android, { referrer }),
  };
}

export const SITE_PATHS = {
  home: "/",
  features: "/features",
  howItWorks: "/how-it-works",
  why: "/why-munib-tracker",
  audiences: "/for",
  compare: "/compare",
  resources: "/resources",
  learn: "/learn",
  download: "/download",
  contact: "/contact",
  press: "/press",
  about: "/about",
  faq: "/faq",
  credits: "/credits",
  contributors: "/contributors",
  openSource: "/open-source",
  privacy: "/privacy",
  terms: "/terms",
} as const;

/** Public GitHub repository for contribute CTAs. */
export const GITHUB_REPO_URL = "https://github.com/mubbi/munib-tracker" as const;

/*
 * Header and footer navigation. The structure (ids, hrefs) lives here; the
 * copy lives in the `nav` (header) and `footer` catalogs, keyed by these ids,
 * so the client header ships no copy beyond the `nav` namespace.
 * `content/content.test.ts` keeps these hrefs in sync with the content registries.
 */
type NavMessages = typeof navMessages;
type FooterMessages = typeof footerMessages;

/** Key under `nav.items` (`label` + `hint`). */
export type NavItemId = keyof NavMessages["items"];
/** Key under `nav.columns`. */
export type NavColumnId = keyof NavMessages["columns"];
/** Key under `nav.menus` (`label` + `viewAll`). */
export type NavMenuId = keyof NavMessages["menus"];
/** Key under `nav.featured` (`eyebrow`, `label`, `hint`). */
export type NavFeaturedId = keyof NavMessages["featured"];
/** Key under `nav.links`. */
export type NavLinkId = keyof NavMessages["links"];
/** Key under `footer.groups`. */
export type FooterGroupId = keyof FooterMessages["groups"];
/** Key under `footer.links`. */
export type FooterLinkId = keyof FooterMessages["links"];

export type NavItem = {
  id: NavItemId;
  href: string;
  /**
   * Icon for compact rows (label + icon, no hint). Menus whose items all have
   * an icon render compactly; others show each item's hint.
   */
  icon?: FeatureIconKey;
};
export type NavColumn = { id: NavColumnId; items: readonly NavItem[] };
export type NavMenu = {
  id: NavMenuId;
  /** Landing page for the whole menu. */
  href: string;
  columns: readonly NavColumn[];
  /** Optional highlighted link (a card beside short menus, a strip under wide ones). */
  feature?: { id: NavFeaturedId; href: string };
};

/** Header mega-menus. */
export const NAV_MENUS: readonly NavMenu[] = [
  {
    // Curated: the most searched and most used features, six per column so the
    // panel fits a laptop screen. Every feature is on /features ("View all").
    id: "features",
    href: SITE_PATHS.features,
    columns: [
      {
        id: "trackWorship",
        items: [
          { id: "salahTracker", href: "/features/salah-tracker", icon: "salah" },
          { id: "qazaTracker", href: "/features/qaza-salah-tracker", icon: "qaza" },
          { id: "zikrTracker", href: "/features/zikr-tracker", icon: "zikr" },
          { id: "tasbeehCounter", href: "/features/tasbeeh-counter", icon: "tasbeeh" },
          { id: "ramadanTracker", href: "/features/ramadan-tracker", icon: "ramadan" },
          { id: "worshipProgress", href: "/features/worship-progress", icon: "progress" },
        ],
      },
      {
        id: "quranHadith",
        items: [
          { id: "quranReader", href: "/features/quran", icon: "quran" },
          { id: "quranPractice", href: "/features/quran-practice", icon: "practice" },
          { id: "hifzTracker", href: "/features/hifz-tracker", icon: "hifz" },
          { id: "learnQuran", href: "/features/learn-quran", icon: "learn" },
          { id: "hadithLibrary", href: "/features/hadith", icon: "hadith" },
          { id: "duasHisnulMuslim", href: "/features/duas-hisnul-muslim", icon: "dua" },
        ],
      },
      {
        id: "timesTools",
        items: [
          { id: "prayerTimesQibla", href: "/features/prayer-times-qibla", icon: "times" },
          { id: "qiblaFinder", href: "/features/qibla-finder", icon: "qibla" },
          { id: "masjidFinder", href: "/features/masjid-finder", icon: "masjid" },
          { id: "hijriCalendar", href: "/features/hijri-calendar", icon: "calendar" },
          { id: "zakatCalculator", href: "/features/zakat-calculator", icon: "zakat" },
          { id: "salahFocusLock", href: "/features/salah-focus-lock", icon: "focus" },
        ],
      },
      {
        id: "familyLife",
        items: [
          { id: "kidsMode", href: "/features/kids-mode", icon: "kids" },
          { id: "familyAndFriends", href: "/features/family-and-friends", icon: "family" },
          { id: "widgetsAndDevices", href: "/features/widgets-and-devices", icon: "devices" },
          { id: "umrahMode", href: "/features/umrah-mode", icon: "umrah" },
          { id: "privateReflection", href: "/features/private-reflection", icon: "reflection" },
          {
            id: "willAndInheritance",
            href: "/features/islamic-will-and-inheritance",
            icon: "will",
          },
        ],
      },
    ],
    feature: { id: "quranPractice", href: "/features/quran-practice" },
  },
  {
    id: "solutions",
    href: SITE_PATHS.audiences,
    columns: [
      {
        id: "whoFor",
        items: [
          { id: "returningToSalah", href: "/for/beginners" },
          { id: "newMuslims", href: "/for/new-muslims" },
          { id: "quranLearners", href: "/for/quran-learners" },
          { id: "families", href: "/for/families" },
        ],
      },
      {
        id: "getToKnow",
        items: [
          { id: "howItWorks", href: SITE_PATHS.howItWorks },
          { id: "whyApp", href: SITE_PATHS.why },
        ],
      },
    ],
  },
  {
    id: "resources",
    href: SITE_PATHS.resources,
    columns: [
      {
        id: "guides",
        items: [
          { id: "salahGuides", href: "/resources/salah" },
          { id: "zikrGuides", href: "/resources/zikr" },
          { id: "quranLearningGuides", href: "/resources/quran-learning" },
          { id: "ramadanGuides", href: "/resources/ramadan-fasting" },
          { id: "zakatHajjGuides", href: "/resources/zakat-hajj" },
          { id: "habitGuides", href: "/resources/islamic-habits" },
        ],
      },
      {
        id: "help",
        items: [
          { id: "learningLibrary", href: SITE_PATHS.learn },
          { id: "faq", href: SITE_PATHS.faq },
          { id: "contentSources", href: SITE_PATHS.credits },
          { id: "contact", href: SITE_PATHS.contact },
        ],
      },
    ],
    feature: { id: "qazaGuide", href: "/resources/salah/what-is-qaza-salah" },
  },
];

/** Plain top-level links shown beside the menus. */
export const NAV_LINKS: readonly { id: NavLinkId; href: string }[] = [
  { id: "compare", href: SITE_PATHS.compare },
  { id: "about", href: SITE_PATHS.about },
];

export type FooterLink =
  | { id: FooterLinkId; href: string; external?: never }
  /** Off-site link labelled with a brand name that is never translated. */
  | { brand: string; href: string; external: true };

export type FooterGroup = { id: FooterGroupId; links: readonly FooterLink[] };

/** Grouped links for the multi-column footer. */
export const FOOTER_GROUPS: readonly FooterGroup[] = [
  {
    id: "features",
    links: [
      { id: "salahTracker", href: "/features/salah-tracker" },
      { id: "qazaTracker", href: "/features/qaza-salah-tracker" },
      { id: "zikrTracker", href: "/features/zikr-tracker" },
      { id: "quranReader", href: "/features/quran" },
      { id: "quranPractice", href: "/features/quran-practice" },
      { id: "learnQuran", href: "/features/learn-quran" },
      { id: "prayerTimesQibla", href: "/features/prayer-times-qibla" },
      { id: "masjidFinder", href: "/features/masjid-finder" },
      { id: "salahFocusLock", href: "/features/salah-focus-lock" },
      { id: "hadithLibrary", href: "/features/hadith" },
      { id: "familyAndFriends", href: "/features/family-and-friends" },
      { id: "willAndInheritance", href: "/features/islamic-will-and-inheritance" },
      { id: "myMadhhab", href: "/features/my-madhhab" },
      { id: "fastingTracker", href: "/features/fasting-tracker" },
      { id: "umrahMode", href: "/features/umrah-mode" },
      { id: "privateReflection", href: "/features/private-reflection" },
      { id: "allFeatures", href: SITE_PATHS.features },
    ],
  },
  {
    id: "audiences",
    links: [
      { id: "returningToSalah", href: "/for/beginners" },
      { id: "newMuslims", href: "/for/new-muslims" },
      { id: "quranLearners", href: "/for/quran-learners" },
      { id: "families", href: "/for/families" },
      { id: "howItWorks", href: SITE_PATHS.howItWorks },
      { id: "whyApp", href: SITE_PATHS.why },
    ],
  },
  {
    id: "resources",
    links: [
      { id: "allGuides", href: SITE_PATHS.resources },
      { id: "salahGuides", href: "/resources/salah" },
      { id: "quranLearning", href: "/resources/quran-learning" },
      { id: "ramadanGuides", href: "/resources/ramadan-fasting" },
      { id: "zakatHajjGuides", href: "/resources/zakat-hajj" },
      { id: "learningLibrary", href: SITE_PATHS.learn },
      { id: "faq", href: SITE_PATHS.faq },
      { id: "contentSources", href: SITE_PATHS.credits },
    ],
  },
  {
    id: "compare",
    links: [
      { id: "salahTrackerApps", href: "/compare/best-salah-tracker-apps" },
      { id: "vsMuslimPro", href: "/compare/munib-tracker-vs-muslim-pro" },
      { id: "vsIslam360", href: "/compare/munib-tracker-vs-islam360" },
      { id: "vsTarteel", href: "/compare/munib-tracker-vs-tarteel" },
      { id: "vsPillars", href: "/compare/munib-tracker-vs-pillars" },
      { id: "muslimProAlternatives", href: "/compare/muslim-pro-alternatives" },
      { id: "quranMemorizationApps", href: "/compare/best-quran-memorization-apps" },
      { id: "freeIslamicApps", href: "/compare/best-free-islamic-apps" },
      { id: "allComparisons", href: SITE_PATHS.compare },
    ],
  },
  {
    id: "company",
    links: [
      { id: "about", href: SITE_PATHS.about },
      { id: "download", href: SITE_PATHS.download },
      { id: "openSource", href: SITE_PATHS.openSource },
      { id: "contributors", href: SITE_PATHS.contributors },
      { id: "contact", href: SITE_PATHS.contact },
      { id: "pressKit", href: SITE_PATHS.press },
      { id: "privacy", href: SITE_PATHS.privacy },
      { id: "terms", href: SITE_PATHS.terms },
      { brand: "GitHub", href: GITHUB_REPO_URL, external: true },
    ],
  },
];
