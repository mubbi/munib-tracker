import {
  buildLocalizedAndroidPlayStoreUrl,
  buildLocalizedIosAppStoreUrl,
} from "@munib-tracker/shared/constants";
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

/** Deep link into the product app's Qur'an reader, focused on one ayah. */
export function appQuranAyahUrl(surah: number, ayah: number, locale: Locale): string {
  return `${productAppUrl(locale, `/quran/${surah}`)}?ayah=${ayah}`;
}

/**
 * App Store / Google Play listings in the visitor's language — the same
 * storefront hints the app uses (shared `buildLocalized*StoreUrl`: Arabic →
 * Saudi storefront / `hl=ar`, Urdu → Pakistan storefront / `hl=ur`).
 */
export function storeUrls(locale: Locale): { ios: string; android: string } {
  return {
    ios: buildLocalizedIosAppStoreUrl(locale),
    android: buildLocalizedAndroidPlayStoreUrl(locale),
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

export type NavItem = { id: NavItemId; href: string };
export type NavColumn = { id: NavColumnId; items: readonly NavItem[] };
export type NavMenu = {
  id: NavMenuId;
  /** Landing page for the whole menu. */
  href: string;
  columns: readonly NavColumn[];
  /** Optional highlighted card in the panel. */
  feature?: { id: NavFeaturedId; href: string };
};

/** Header mega-menus. */
export const NAV_MENUS: readonly NavMenu[] = [
  {
    id: "features",
    href: SITE_PATHS.features,
    columns: [
      {
        id: "trackWorship",
        items: [
          { id: "salahTracker", href: "/features/salah-tracker" },
          { id: "qazaTracker", href: "/features/qaza-salah-tracker" },
          { id: "salahFocusLock", href: "/features/salah-focus-lock" },
          { id: "fastingTracker", href: "/features/fasting-tracker" },
          { id: "zikrTracker", href: "/features/zikr-tracker" },
          { id: "dailyHabits", href: "/features/daily-islamic-habits" },
          { id: "worshipProgress", href: "/features/worship-progress" },
        ],
      },
      {
        id: "quranHadith",
        items: [
          { id: "quranReader", href: "/features/quran" },
          { id: "quranPractice", href: "/features/quran-practice" },
          { id: "learnQuran", href: "/features/learn-quran" },
          { id: "hadithLibrary", href: "/features/hadith" },
          { id: "learningLibrary", href: SITE_PATHS.learn },
        ],
      },
      {
        id: "everydayFamily",
        items: [
          { id: "prayerTimesQibla", href: "/features/prayer-times-qibla" },
          { id: "masjidFinder", href: "/features/masjid-finder" },
          { id: "myMadhhab", href: "/features/my-madhhab" },
          { id: "umrahMode", href: "/features/umrah-mode" },
          { id: "widgetsAndDevices", href: "/features/widgets-and-devices" },
          { id: "familyAndFriends", href: "/features/family-and-friends" },
          { id: "privateReflection", href: "/features/private-reflection" },
          { id: "willAndInheritance", href: "/features/islamic-will-and-inheritance" },
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
          { id: "habitGuides", href: "/resources/islamic-habits" },
        ],
      },
      {
        id: "help",
        items: [
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
