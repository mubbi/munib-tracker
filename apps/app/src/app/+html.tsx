import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

import {
  PWA_APPLE_TOUCH_ICON,
  PWA_ICON_PATHS,
  PWA_SHORT_NAME,
  PWA_THEME_COLOR,
} from "@/config/pwa";
import { SEO_AUTHOR } from "@/config/seo";
import { LOCALE_PATH_BOOT_SCRIPT } from "@/lib/locale-path";
import { siteGraphSchema } from "@/lib/seo/structured-data";

/**
 * Web document shell rendered around every statically-exported route.
 *
 * Holds only site-wide invariants: charset/viewport, PWA manifest + icons,
 * theme color, resource hints, and the Organization / WebSite /
 * SoftwareApplication JSON-LD graph. Per-page metadata (title, description,
 * canonical, Open Graph, Twitter, hreflang, page-level structured data) is
 * emitted by <Seo> into <head> via expo-router/head — intentionally NOT
 * duplicated here.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* App identity */}
        <meta name="application-name" content={PWA_SHORT_NAME} />
        <meta name="author" content={SEO_AUTHOR.name} />
        <meta name="format-detection" content="telephone=no" />

        {/* PWA / manifest + icons */}
        <link rel="manifest" href="/manifest.json" type="application/manifest+json" />
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content={PWA_THEME_COLOR} media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content={PWA_THEME_COLOR} media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content={PWA_THEME_COLOR} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={PWA_SHORT_NAME} />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" sizes="180x180" href={PWA_APPLE_TOUCH_ICON} />
        <link rel="apple-touch-icon" href={PWA_ICON_PATHS.appleTouchRoot} />
        <link rel="icon" href={PWA_ICON_PATHS.faviconIco} sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href={PWA_ICON_PATHS.favicon} />
        <link rel="icon" type="image/png" sizes="192x192" href={PWA_ICON_PATHS.any192} />
        <link rel="icon" type="image/png" sizes="512x512" href={PWA_ICON_PATHS.any512} />
        <link rel="shortcut icon" href={PWA_ICON_PATHS.faviconIco} />

        {/* Resource hints — speed up first content/audio/weather fetches (LCP/FCP). */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://everyayah.com" />
        <link rel="dns-prefetch" href="https://download.quranicaudio.com" />
        <link rel="dns-prefetch" href="https://api.open-meteo.com" />
        <link rel="dns-prefetch" href="https://geocoding-api.open-meteo.com" />

        {/* Bengali UI: bundled OFL face via expo-font (see bengali-fonts.ts).
            Do not inject render-blocking Google Fonts CSS on every page. */}
        <style
          // biome-ignore lint/security/noDangerouslySetInnerHtml: document-level CSS variable for Bengali script
          dangerouslySetInnerHTML={{
            __html: `:root { --font-bengali: 'NotoSansBengali', 'Noto Sans Bengali', system-ui, sans-serif; }`,
          }}
        />

        {/* Locale-prefixed entry URLs: strip prefix for expo-router, persist locale. */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: must run before the app bundle
          dangerouslySetInnerHTML={{ __html: LOCALE_PATH_BOOT_SCRIPT }}
        />

        {/* Site-wide structured data (Organization + WebSite + SoftwareApplication). */}
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires inline script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraphSchema()) }}
        />

        <ScrollViewStyleReset />
        <style
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Expo Router +html.tsx pattern for base document styles
          dangerouslySetInnerHTML={{
            __html: `
              html {
                height: 100%;
                height: 100dvh;
              }
              body,
              #root {
                height: 100%;
                min-height: 0;
                margin: 0;
                overflow: hidden;
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
