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
  learn: "/learn",
  download: "/download",
  contact: "/contact",
  press: "/press",
  about: "/about",
  faq: "/faq",
  credits: "/credits",
  privacy: "/privacy",
  terms: "/terms",
} as const;

export type SitePath = (typeof SITE_PATHS)[keyof typeof SITE_PATHS];

export const NAV_LINKS = [
  { href: SITE_PATHS.features, label: "Features" },
  { href: SITE_PATHS.learn, label: "Learn" },
  { href: SITE_PATHS.download, label: "Download" },
  { href: SITE_PATHS.about, label: "About" },
  { href: SITE_PATHS.faq, label: "FAQ" },
  { href: SITE_PATHS.contact, label: "Contact" },
] as const;

/** Grouped links for the multi-column footer. */
export const FOOTER_GROUPS = [
  {
    heading: "Product",
    links: [
      { href: SITE_PATHS.features, label: "Features" },
      { href: SITE_PATHS.download, label: "Download" },
      { href: PRODUCT_APP_URL, label: "Open web app", external: true },
    ],
  },
  {
    heading: "Learn",
    links: [
      { href: SITE_PATHS.learn, label: "Learning library" },
      { href: SITE_PATHS.faq, label: "FAQ" },
      { href: SITE_PATHS.credits, label: "Content sources" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: SITE_PATHS.about, label: "About" },
      { href: SITE_PATHS.contact, label: "Contact" },
      { href: SITE_PATHS.press, label: "Press kit" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: SITE_PATHS.privacy, label: "Privacy" },
      { href: SITE_PATHS.terms, label: "Terms" },
      { href: SITE_PATHS.credits, label: "Credits" },
    ],
  },
] as const;

/** Backwards-compatible flat link list. */
export const FOOTER_LINKS = [...NAV_LINKS, { href: SITE_PATHS.press, label: "Press kit" }] as const;
