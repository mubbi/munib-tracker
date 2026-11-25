import { OFFICIAL_IOS_APP_STORE_ID } from "@munib-tracker/shared/constants";
import { ScrollViewStyleReset, useServerDocumentContext } from "expo-router/html";
import type { PropsWithChildren } from "react";

import {
  PWA_APPLE_TOUCH_ICON,
  PWA_ICON_PATHS,
  PWA_SHORT_NAME,
  PWA_THEME_COLOR,
  PWA_THEME_COLOR_DARK,
  PWA_THEME_COLOR_LIGHT,
} from "@/config/pwa";
import { BOOT_THEME_CSS, BOOT_THEME_SCRIPT } from "@/lib/boot/cold-start";
import { LOCALE_PATH_BOOT_SCRIPT } from "@/lib/locale-path";
import { siteGraphSchema } from "@/lib/seo/structured-data";
import { FOCUS_RING_CSS, THEME_CSS_VARIABLES_DEFAULTS } from "@/styles/theme-css-variables";

/**
 * Web document shell rendered around every statically-exported route.
 *
 * Holds only site-wide invariants: charset/viewport, PWA manifest + icons,
 * theme color, resource hints, and the Organization / WebSite /
 * SoftwareApplication JSON-LD graph. Per-page metadata comes from each route's
 * `generateMetadata` (rendered through `headNodes` below) and
 * scripts/inject-seo-head.mjs after export — intentionally NOT duplicated here.
 *
 * Expo Router SDK 58: `useServerDocumentContext()` supplies the generated
 * `<html>`/`<body>` attributes, the per-route `headNodes` (metadata, styles,
 * fonts) and the `bodyNodes` (hydration bundles — without them the page never
 * becomes interactive). The boot scripts stay ahead of `headNodes` so they run
 * before any bundle.
 */
export default function Root({ children }: PropsWithChildren) {
  const { htmlAttributes, bodyAttributes, headNodes, bodyNodes } = useServerDocumentContext();
  return (
    <html lang="en" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* App identity */}
        <meta name="application-name" content={PWA_SHORT_NAME} />
        <meta name="format-detection" content="telephone=no" />

        {/* PWA / manifest + icons */}
        <link rel="manifest" href="/manifest.json" type="application/manifest+json" />
        <meta name="color-scheme" content="light dark" />
        <meta
          name="theme-color"
          content={PWA_THEME_COLOR_LIGHT}
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content={PWA_THEME_COLOR_DARK}
          media="(prefers-color-scheme: dark)"
        />
        <meta name="theme-color" content={PWA_THEME_COLOR} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={PWA_SHORT_NAME} />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-itunes-app" content={`app-id=${OFFICIAL_IOS_APP_STORE_ID}`} />
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

        {/* Bengali / Devanagari UI: bundled OFL faces via expo-font.
            Do not inject render-blocking Google Fonts CSS on every page. */}
        <style
          // biome-ignore lint/security/noDangerouslySetInnerHtml: document-level CSS variables for Indic scripts
          dangerouslySetInnerHTML={{
            __html: `:root { --font-bengali: 'NotoSansBengali', 'Noto Sans Bengali', system-ui, sans-serif; --font-devanagari: 'NotoSansDevanagari', 'Noto Sans Devanagari', system-ui, sans-serif; }`,
          }}
        />

        {/* Locale-prefixed entry URLs: strip prefix for expo-router, persist locale. */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: must run before the app bundle
          dangerouslySetInnerHTML={{ __html: LOCALE_PATH_BOOT_SCRIPT }}
        />

        {/* Boot background before any script: light, or dark when the OS prefers
            dark (D-UX2 default) — the fallback when storage/script is blocked. */}
        <style
          // biome-ignore lint/security/noDangerouslySetInnerHtml: must paint before the app bundle
          dangerouslySetInnerHTML={{ __html: BOOT_THEME_CSS }}
        />

        {/* Paint boot background from stored color mode before the JS bundle. */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: must run before the app bundle
          dangerouslySetInnerHTML={{ __html: BOOT_THEME_SCRIPT }}
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
              /* Safe areas for the installed PWA (viewport-fit=cover). From Expo
                 SDK 58 the router no longer measures web insets, so
                 useAppSafeAreaInsets() (web) reads these variables. */
              :root {
                --munib-safe-top: env(safe-area-inset-top, 0px);
                --munib-safe-right: env(safe-area-inset-right, 0px);
                --munib-safe-bottom: env(safe-area-inset-bottom, 0px);
                --munib-safe-left: env(safe-area-inset-left, 0px);
              }
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
              /* Slimmer desktop scrollbars that follow the color scheme. */
              @media (hover: hover) and (pointer: fine) {
                * {
                  scrollbar-width: thin;
                }
              }
            `,
          }}
        />
        {/* Theme variables (default palette until MunibThemeProvider writes the
            user's) + the ONE keyboard focus ring: 2px ring, 2px offset,
            background halo, forced-colors aware, never reshapes the element. */}
        <style
          // biome-ignore lint/security/noDangerouslySetInnerHtml: document-level focus ring + theme variables
          dangerouslySetInnerHTML={{ __html: `${THEME_CSS_VARIABLES_DEFAULTS}${FOCUS_RING_CSS}` }}
        />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
