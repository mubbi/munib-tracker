import { APP_NAME, OFFICIAL_IOS_APP_STORE_ID } from "@munib-tracker/shared/constants";
import type { Metadata, Viewport } from "next";
import { locale as rootLocale } from "next/root-params";
import { getTranslations } from "next-intl/server";
import { SiteDocument } from "@/components/site-document";
import { isLocale, LOCALE_META } from "@/i18n/locales";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

/** Every locale is prerendered; unknown values never reach here (see `src/proxy.ts`). */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

async function currentLocale(): Promise<Locale> {
  const value = await rootLocale();
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await currentLocale();
  const t = await getTranslations({ locale, namespace: "metadata" });
  const description = t("description");
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("defaultTitle", { appName: APP_NAME }),
      template: `%s | ${APP_NAME}`,
    },
    description,
    applicationName: APP_NAME,
    openGraph: {
      type: "website",
      locale: LOCALE_META[locale].ogLocale,
      url: SITE_URL,
      siteName: APP_NAME,
      title: APP_NAME,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: APP_NAME,
      description,
    },
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon.png", sizes: "48x48", type: "image/png" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: "/favicon.ico",
    },
    appleWebApp: {
      capable: true,
      title: APP_NAME,
      statusBarStyle: "black-translucent",
    },
    other: {
      "apple-itunes-app": `app-id=${OFFICIAL_IOS_APP_STORE_ID}`,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#07141f",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SiteDocument locale={await currentLocale()}>{children}</SiteDocument>;
}
