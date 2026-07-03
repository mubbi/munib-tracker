import { APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { Lora, Spline_Sans } from "next/font/google";
import { Analytics } from "@/components/analytics";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";
import { SITE_URL } from "@/lib/site";
import { MarketingApiProvider } from "@/providers/api-provider";
import "./globals.css";

const splineSans = Spline_Sans({
  variable: "--font-spline",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-iowan",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_TAGLINE,
  keywords: [
    "Muslim prayer tracker",
    "Islamic habit app",
    "salah tracker",
    "dhikr counter",
    "qadha planner",
    "Quran offline",
    "hadith app",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_TAGLINE,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: APP_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_TAGLINE,
    images: ["/opengraph-image"],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${splineSans.variable} ${lora.variable} h-full antialiased`}>
      <head>
        <JsonLd />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <SkipLink />
        <Analytics />
        <MarketingApiProvider>
          <SiteHeader />
          <main id="main-content" className="flex flex-1 flex-col">
            {children}
          </main>
        </MarketingApiProvider>
        <Footer />
      </body>
    </html>
  );
}
