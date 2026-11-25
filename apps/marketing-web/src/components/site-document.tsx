import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { ReactNode } from "react";
import { FONT_VARIABLES, LOCALE_FONT_STYLE } from "@/app/fonts";
import { Analytics } from "@/components/analytics";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { SiteBackground } from "@/components/day-arc/site-background";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";
import { LOCALE_META } from "@/i18n/locales";
import type { Locale } from "@/i18n/routing";
import { type Messages, pickClientMessages } from "@/messages";
import "@/app/globals.css";

/**
 * The full HTML document — `<html lang dir>`, fonts, header, footer and the
 * client-side translation provider. Shared by the `[locale]` root layout and
 * `app/global-not-found.tsx` (which renders outside any layout).
 */
export async function SiteDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  const { hreflang, dir } = LOCALE_META[locale];
  const messages = (await getMessages({ locale })) as Messages;
  return (
    <html
      lang={hreflang}
      dir={dir}
      suppressHydrationWarning
      className={`${FONT_VARIABLES} h-full antialiased`}
      style={LOCALE_FONT_STYLE[locale]}
    >
      {/* biome-ignore lint/style/noHeadElement: this is the root layout's document, shared with global-not-found */}
      <head>
        <JsonLd />
      </head>
      <body className="day-arc-scope relative isolate flex min-h-full flex-col bg-[#07141f] text-foreground">
        {/* Only the namespaces client islands need are serialized (see CLIENT_NAMESPACES). */}
        <NextIntlClientProvider locale={locale} messages={pickClientMessages(messages)}>
          <SiteBackground />
          <SkipLink />
          <Analytics />
          <SiteHeader />
          <main id="main-content" className="flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
          <CookieConsentBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
