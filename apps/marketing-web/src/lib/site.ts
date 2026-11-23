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

/** Google Analytics 4 measurement ID (e.g. G-XXXXXXXX). Empty env disables GA. */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID === ""
    ? null
    : process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || null;

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

export type SitePath = (typeof SITE_PATHS)[keyof typeof SITE_PATHS];

export type NavItem = { href: string; label: string; hint?: string };
export type NavColumn = { heading: string; items: readonly NavItem[] };
export type NavMenu = {
  id: string;
  label: string;
  /** Landing page for the whole menu. */
  href: string;
  /** Label for the link to `href`. */
  viewAllLabel: string;
  columns: readonly NavColumn[];
  /** Optional highlighted card in the panel. */
  feature?: NavItem & { eyebrow: string };
};

/**
 * Header mega-menus. Kept as plain literals (not derived from `src/content`)
 * so the client header doesn't ship page copy; `content/content.test.ts` keeps
 * these hrefs in sync with the content registries.
 */
export const NAV_MENUS: readonly NavMenu[] = [
  {
    id: "features",
    label: "Features",
    href: SITE_PATHS.features,
    viewAllLabel: "View all features",
    columns: [
      {
        heading: "Track your worship",
        items: [
          {
            href: "/features/salah-tracker",
            label: "Salah tracker",
            hint: "Log the five daily Salah",
          },
          {
            href: "/features/qaza-salah-tracker",
            label: "Qaza tracker",
            hint: "Make up missed Salah at your pace",
          },
          {
            href: "/features/salah-focus-lock",
            label: "Salah focus lock",
            hint: "Block distracting apps at Salah time",
          },
          {
            href: "/features/zikr-tracker",
            label: "Zikr & tasbeeh",
            hint: "Daily adhkar and a tasbeeh counter",
          },
          {
            href: "/features/daily-islamic-habits",
            label: "Daily habits",
            hint: "Today's Goal, reminders and checklists",
          },
          {
            href: "/features/worship-progress",
            label: "Worship progress",
            hint: "Statistics, streaks and Noor levels",
          },
        ],
      },
      {
        heading: "Qur'an and hadith",
        items: [
          {
            href: "/features/quran",
            label: "Qur'an reader",
            hint: "Read, listen and reflect offline",
          },
          {
            href: "/features/quran-practice",
            label: "Qur'an practice (AI)",
            hint: "Recite and it follows along",
          },
          {
            href: "/features/learn-quran",
            label: "Learn the Qur'an",
            hint: "From the letters to tajweed",
          },
          {
            href: "/features/hadith",
            label: "Hadith library",
            hint: "Collections, explanation and audio",
          },
          {
            href: SITE_PATHS.learn,
            label: "Learning library",
            hint: "Aqeedah, seerah and fiqh guides",
          },
        ],
      },
      {
        heading: "Everyday and family",
        items: [
          {
            href: "/features/prayer-times-qibla",
            label: "Salah times & Qibla",
            hint: "Accurate times, Adhan and compass",
          },
          {
            href: "/features/masjid-finder",
            label: "Masjid finder",
            hint: "Nearby masjids and your home masjid",
          },
          {
            href: "/features/widgets-and-devices",
            label: "Widgets, watch & TV",
            hint: "iPhone, Android, web, watch and TV",
          },
          {
            href: "/features/family-and-friends",
            label: "Family & friends",
            hint: "Kids mode, partners and group khatm",
          },
          {
            href: "/features/islamic-will-and-inheritance",
            label: "Will & inheritance",
            hint: "Mirath, wasiyyah and debts",
          },
        ],
      },
    ],
    feature: {
      eyebrow: "New",
      href: "/features/quran-practice",
      label: "Qur'an practice with on-device AI",
      hint: "Recite and a private listener follows you word by word.",
    },
  },
  {
    id: "solutions",
    label: "Who it's for",
    href: SITE_PATHS.audiences,
    viewAllLabel: "See everyone it's for",
    columns: [
      {
        heading: "Who it's for",
        items: [
          {
            href: "/for/beginners",
            label: "Returning to Salah",
            hint: "Rebuild the habit without guilt",
          },
          {
            href: "/for/new-muslims",
            label: "New Muslims",
            hint: "Learn Salah and the basics, step by step",
          },
          {
            href: "/for/quran-learners",
            label: "Qur'an learners",
            hint: "Read, recite, memorize and revise",
          },
          { href: "/for/families", label: "Families", hint: "Learn the Qur'an and Salah at home" },
        ],
      },
      {
        heading: "Get to know the app",
        items: [
          {
            href: SITE_PATHS.howItWorks,
            label: "How it works",
            hint: "Set up your routine in a minute",
          },
          { href: SITE_PATHS.why, label: "Why Munib Tracker", hint: "Private, ad-free, authentic" },
        ],
      },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    href: SITE_PATHS.resources,
    viewAllLabel: "Browse all guides",
    columns: [
      {
        heading: "Guides",
        items: [
          {
            href: "/resources/salah",
            label: "Salah",
            hint: "Consistency, Qaza and missed prayers",
          },
          {
            href: "/resources/zikr",
            label: "Zikr & adhkar",
            hint: "Daily routine, morning and evening",
          },
          {
            href: "/resources/quran-learning",
            label: "Qur'an learning",
            hint: "Read, recite and memorize",
          },
          {
            href: "/resources/islamic-habits",
            label: "Islamic habits",
            hint: "Stay consistent in worship",
          },
        ],
      },
      {
        heading: "Help",
        items: [
          { href: SITE_PATHS.faq, label: "FAQ", hint: "Privacy, platforms and content" },
          {
            href: SITE_PATHS.credits,
            label: "Content sources",
            hint: "Where our content comes from",
          },
          {
            href: SITE_PATHS.contact,
            label: "Contact & support",
            hint: "Questions, feedback and corrections",
          },
        ],
      },
    ],
    feature: {
      eyebrow: "Popular guide",
      href: "/resources/salah/what-is-qaza-salah",
      label: "What is Qaza Salah?",
      hint: "How making up missed Salah works, and where scholars differ.",
    },
  },
];

/** Plain top-level links shown beside the menus. */
export const NAV_LINKS = [
  { href: SITE_PATHS.compare, label: "Compare" },
  { href: SITE_PATHS.about, label: "About" },
] as const;

/** Grouped links for the multi-column footer. */
export const FOOTER_GROUPS = [
  {
    heading: "Features",
    links: [
      { href: "/features/salah-tracker", label: "Salah tracker" },
      { href: "/features/qaza-salah-tracker", label: "Qaza tracker" },
      { href: "/features/zikr-tracker", label: "Zikr & tasbeeh" },
      { href: "/features/quran", label: "Qur'an reader" },
      { href: "/features/quran-practice", label: "Qur'an practice" },
      { href: "/features/learn-quran", label: "Learn the Qur'an" },
      { href: "/features/prayer-times-qibla", label: "Salah times & Qibla" },
      { href: "/features/masjid-finder", label: "Masjid finder" },
      { href: "/features/salah-focus-lock", label: "Salah focus lock" },
      { href: "/features/hadith", label: "Hadith library" },
      { href: "/features/family-and-friends", label: "Family & friends" },
      { href: "/features/islamic-will-and-inheritance", label: "Will & inheritance" },
      { href: SITE_PATHS.features, label: "All features" },
    ],
  },
  {
    heading: "Who it's for",
    links: [
      { href: "/for/beginners", label: "Returning to Salah" },
      { href: "/for/new-muslims", label: "New Muslims" },
      { href: "/for/quran-learners", label: "Qur'an learners" },
      { href: "/for/families", label: "Families" },
      { href: SITE_PATHS.howItWorks, label: "How it works" },
      { href: SITE_PATHS.why, label: "Why Munib Tracker" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: SITE_PATHS.resources, label: "All guides" },
      { href: "/resources/salah", label: "Salah guides" },
      { href: "/resources/quran-learning", label: "Qur'an learning" },
      { href: SITE_PATHS.learn, label: "Learning library" },
      { href: SITE_PATHS.faq, label: "FAQ" },
      { href: SITE_PATHS.credits, label: "Content sources" },
    ],
  },
  {
    heading: "Compare",
    links: [
      { href: "/compare/best-salah-tracker-apps", label: "Salah tracker apps" },
      { href: "/compare/munib-tracker-vs-muslim-pro", label: "vs Muslim Pro" },
      { href: "/compare/munib-tracker-vs-islam360", label: "vs Islam360" },
      { href: "/compare/munib-tracker-vs-tarteel", label: "vs Tarteel" },
      { href: "/compare/munib-tracker-vs-pillars", label: "vs Pillars" },
      { href: SITE_PATHS.compare, label: "All comparisons" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: SITE_PATHS.about, label: "About" },
      { href: SITE_PATHS.download, label: "Download" },
      { href: SITE_PATHS.openSource, label: "Open source" },
      { href: SITE_PATHS.contributors, label: "Contributors" },
      { href: SITE_PATHS.contact, label: "Contact" },
      { href: SITE_PATHS.press, label: "Press kit" },
      { href: SITE_PATHS.privacy, label: "Privacy" },
      { href: SITE_PATHS.terms, label: "Terms" },
      { href: GITHUB_REPO_URL, label: "GitHub", external: true },
    ],
  },
] as const;
