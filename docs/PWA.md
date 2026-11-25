# Web app / PWA

The Expo web export (`apps/app`, `my.munibtracker.app`) is an installable,
offline-capable PWA. This page is the source of truth for how it installs and
caches in each browser. Push notifications: [`WEB_PUSH.md`](WEB_PUSH.md).

## Install paths per browser

Detected once in `apps/app/src/lib/notifications/browser-capabilities.ts`
(`WebPwaInstallMethod`, from Bowser + navigator hints). The home screen install
banner (`components/pwa/ios-pwa-install-banner.tsx` → `install-prompt-banner.tsx`)
and the notification permission banner both read it.

| Browser                                                                             | `installMethod`      | What the user sees                                                 |
| ----------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------ |
| Chrome, Edge, Brave, Samsung Internet, Opera (desktop + Android) — any Blink engine | `prompt`             | "Install" button → browser dialog (deferred `beforeinstallprompt`) |
| iPhone / iPad Safari                                                                | `ios_safari_share`   | Share → Add to Home Screen steps                                   |
| iOS 16.4+ Chrome, Edge, Firefox                                                     | `ios_browser_share`  | Same steps, done inside that browser (no Safari hand-off)          |
| Other iOS shells, in-app web views, iOS < 16.4                                      | `ios_open_in_safari` | "Copy link for Safari" + steps                                     |
| Safari 17+ on macOS                                                                 | `mac_add_to_dock`    | File → Add to Dock steps                                           |
| Firefox (and other non-Blink) on Android                                            | `browser_menu`       | Browser menu → Install / Add to Home screen steps                  |
| Desktop Firefox, Safari < 17, installed app                                         | `none`               | No banner                                                          |

Banners never show inside the installed app and stay dismissed once closed
(`pwa_install_prompt_dismissed_v1`, `pwa_ios_install_banner_dismissed_v1`).

## Manifest

Single source: `apps/app/src/config/pwa.ts` (`pwaWebManifest`).
`scripts/sync-pwa-manifest.mjs` writes `public/manifest.json` and mirrors the
literal by hand; `src/config/pwa.test.ts` fails on any drift and enforces the
vendor rules:

- Chrome / Edge install criteria: `name`/`short_name`, 192 + 512 `any` icons,
  `start_url`, `display: standalone`, `prefer_related_applications: false`.
- Maskable icons (`icon-{192,512}-maskable.png`) are separate files with the logo
  inside the 40 %-radius safe zone — never the full-bleed `any` icon.
- Richer install dialog: `narrow` (540×1200) and `wide` (1280×800) screenshots,
  one aspect ratio per form factor, ≤ 2.3:1, 320–3840 px, ≤ 8 total. Desktop
  Chrome / Edge only show the richer dialog with a `wide` screenshot.
- `launch_handler: { client_mode: ["navigate-existing", "auto"] }` — shortcuts and
  links reuse the open app window.
- Shortcuts: Mark Salah (`/tracker`), Qibla, Tasbeeh.

Images come from `python apps/app/scripts/generate-pwa-assets.py` (Pillow): the
maskable icons, the shortcut glyphs, narrow shots from
`store-assets/captures/android/en/light`, wide shots from the English 10-inch
tablet landscape store set.

Not used on purpose: `edge_side_panel` (Microsoft is deprecating the Edge
sidebar), `display_override: window-controls-overlay` (the UI doesn't draw a
title-bar area), `apple-touch-startup-image` (one PNG per device size — iOS shows
the background colour instead).

`+html.tsx` keeps the iOS tags (`apple-touch-icon` wins over manifest icons on
iOS, `apple-mobile-web-app-*`) and light / dark `theme-color` metas for first
paint; `syncDocumentThemeColor()` (theme provider) then points every
`theme-color` at the in-app theme, so the toolbar / title bar follows a
user-chosen theme that differs from the OS.

## Service worker and offline

`apps/app/public/expo-service-worker.js`, registered at `/` by `WebPwaBootstrap`
on every web launch.

| Requests                                                                     | Strategy                                                                              | Cache                                      |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------ |
| Core routes' HTML + their bundles, manifest, icons                           | Precached at install                                                                  | `munib-shell-<build>`                      |
| Page navigations                                                             | Network-first (navigation preload) → this page's last copy → app shell → offline page | `munib-pages-v1` (60)                      |
| `/_expo/static/*`, content-hashed files                                      | Cache-first (immutable)                                                               | `munib-static-v1` (400)                    |
| Other `/assets/*`, `/manifest.json`, favicons                                | Stale-while-revalidate                                                                | `munib-runtime-v1` (80)                    |
| Recitation / adhan audio (CDN hosts, any `.mp3`)                             | Cache-first, Range → 206 slicing                                                      | `munib-audio-v1` (Settings → Offline data) |
| Cross-origin API / CDN JSON, `/recitation-models/`, `/ort/`, `/.well-known/` | Untouched (network)                                                                   | —                                          |

The static export has no server-rendered body, so any cached route HTML (or the
root shell) boots the client router on the requested URL offline.

**Build step:** `build:web` ends with `scripts/generate-sw-precache.mjs`. It
precaches the HTML of `SHELL_ROUTES` (`/`, `/tracker`, `/qibla`,
`/tasbeeh/free`, `/library`, `/settings`, `/zikr`, `/dua`, `/quran`) plus the
`/_expo/static/` entry bundles of **every** exported page, so any route,
including one never visited, launches offline from the root shell. It injects
`PRECACHE_URLS` + a content-hash `BUILD_ID` into `dist/expo-service-worker.js`.
A changed build means changed SW bytes, so browsers install the update;
`activate` drops older shell caches. Under `expo start` both stay empty
(runtime caches only). Precache ≈ 305 URLs / 25 MB uncompressed, fetched 8 at a
time. Almost all of it is the shared bundles the first page load already
fetched. Lazy data chunks (Qur'an / hadith JSON) are cached as they are opened.

Updates take over immediately (`skipWaiting` + `clients.claim`). Pages are
network-first, so a running tab keeps its old bundles. Hashed chunks of older
builds stay in `munib-static-v1`.

**Storage:** inside the installed app `requestPersistentStorage()` calls
`navigator.storage.persist()`. Tracker data lives in browser storage, which
WebKit clears after 7 days without use unless the site runs as a Home Screen app,
and which any browser may evict under pressure. It is never requested from a tab
(Firefox would show a prompt).

**Headers** (`apps/app/vercel.json`): `/_expo/static/*` is
`max-age=31536000, immutable`. `/expo-service-worker.js` and `/manifest.json`
always revalidate, and the manifest is served as `application/manifest+json`.

## Verify

- Unit: `pnpm --filter app test -- pwa service-worker browser-capabilities install-prompt`.
  `src/lib/pwa/service-worker.test.ts` runs the real worker in a `vm` sandbox
  (install / activate / navigation fallback / cache-first / notification clicks)
  and the precache script against a temporary export.
- Browser: `pnpm --filter app build:web`, serve `dist/` (clean URLs) on
  `localhost`, then in Chrome / Edge DevTools → Application check Manifest
  (no errors, installable), Service workers (activated, navigation preload) and
  Cache storage (`munib-shell-*`), and reload offline.
- Real devices still matter for iOS Share → Add to Home Screen, macOS Add to
  Dock and Firefox for Android — no automated coverage for those UIs.

## Sources

- web.dev — [install criteria](https://web.dev/articles/install-criteria),
  [richer install UI](https://web.dev/articles/web-apps/richer-install-ui),
  [maskable icons](https://web.dev/articles/maskable-icon),
  [service worker lifecycle](https://web.dev/articles/service-worker-lifecycle)
- Chrome — [launch handler](https://developer.chrome.com/docs/web-platform/launch-handler)
- Microsoft Edge — [PWAs overview](https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/),
  [sidebar (deprecated)](https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/sidebar)
- WebKit — [Web Push for web apps on iOS / iPadOS (16.4)](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/),
  [Safari 17 (Add to Dock)](https://webkit.org/blog/14445/webkit-features-in-safari-17-0/),
  [storage policy](https://webkit.org/blog/14403/updates-to-storage-policy/),
  [tracking prevention (7-day cap)](https://webkit.org/tracking-prevention/)
- MDN — [making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable),
  [web app manifest](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)
