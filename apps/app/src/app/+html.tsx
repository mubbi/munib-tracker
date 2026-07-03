import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

import {
  PWA_APPLE_TOUCH_ICON,
  PWA_DESCRIPTION,
  PWA_ICON_PATHS,
  PWA_SHORT_NAME,
  PWA_THEME_COLOR,
} from "@/config/pwa";

/**
 * Web document shell: PWA manifest/meta tags and viewport-fit for safe areas.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" type="application/manifest+json" />
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content={PWA_THEME_COLOR} media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content={PWA_THEME_COLOR} media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content={PWA_THEME_COLOR} />
        <meta name="description" content={PWA_DESCRIPTION} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content={PWA_SHORT_NAME} />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" sizes="180x180" href={PWA_APPLE_TOUCH_ICON} />
        <link rel="apple-touch-icon" href={PWA_ICON_PATHS.appleTouchRoot} />
        <link rel="icon" type="image/png" sizes="192x192" href={PWA_ICON_PATHS.any192} />
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
