# Deep links & App Links

Munib Tracker uses a **custom URL scheme** (`munib-tracker://`) for widgets, Siri/Assistant shortcuts, app-icon quick actions, and Google OAuth redirects. **HTTPS App Links** on the product web origin (`my.munibtracker.app`) handle Apple OAuth return on Android (and iOS OAuth fallback). The same product-web paths are shareable on web today (`https://my.munibtracker.app/…`).

**Related:** [OAUTH_SETUP.md](./OAUTH_SETUP.md) · [NATIVE_SURFACES.md](./NATIVE_SURFACES.md)

---

## Identifiers

| Value              | Default                                                          | Where                                                   |
| ------------------ | ---------------------------------------------------------------- | ------------------------------------------------------- |
| Custom scheme      | `munib-tracker`                                                  | `apps/app/app.json` → `expo.scheme`                     |
| iOS bundle ID      | `app.munibtracker`                                               | `app.json` → `ios.bundleIdentifier`                     |
| Android package    | `app.munibtracker`                                               | `app.json` → `android.package`                          |
| App Store ID       | `6787222180`                                                     | App Store Connect numeric ID                            |
| App Store URL      | `https://apps.apple.com/app/id6787222180`                        | `OFFICIAL_IOS_APP_STORE_URL` in `@munib-tracker/shared` |
| Play Store URL     | `https://play.google.com/store/apps/details?id=app.munibtracker` | `OFFICIAL_ANDROID_PLAY_STORE_URL`                       |
| Product web origin | `https://my.munibtracker.app`                                    | `EXPO_PUBLIC_APP_URL`                                   |
| Marketing site     | `https://munibtracker.app`                                       | `EXPO_PUBLIC_SITE_URL`                                  |

Canonical URL builders: `apps/app/src/lib/app-links.ts` — `buildAppUrl()`, `buildHttpsAppUrl()`, `resolveAppLink()`, typed `appLink.*` helpers, and `DEEP_LINK_PATHS`.

---

## Building URLs (send users from anywhere)

Expo Router treats the path after `munib-tracker://` as an in-app route (leading slash optional). **Any** Expo Router path works; the catalog below is the supported surface for campaigns, notifications, widgets, and docs.

```ts
import { appLink, buildAppUrl, buildHttpsAppUrl, resolveAppLink } from "@/lib/app-links";

buildAppUrl("/quran"); // munib-tracker://quran
buildHttpsAppUrl("/quran"); // https://my.munibtracker.app/quran
resolveAppLink("/tracker"); // { path, schemeUrl, httpsUrl }

appLink.quranSurah(2, { ayah: 255 }); // …/quran/2?ayah=255
appLink.quranPage(255); // …/quran/page/255
appLink.hadithCollection("riyad", { q: "Muslim 591" });
appLink.duaDetail("morning-1");
appLink.zikrCategory("after_prayer");
appLink.markCurrent(); // special action bridge
appLink.openReview(); // store write-review page (D76)
```

Prefer `appLink.*` / `resolveAppLink` over hand-rolled strings so scheme and HTTPS stay aligned.

---

## Shareable destinations

Static paths live in `DEEP_LINK_PATHS` (asserted against `QUICK_ACTION_ROUTES` in tests). Examples:

### Tabs

| Path        | Scheme example             |
| ----------- | -------------------------- |
| `/`         | `munib-tracker://`         |
| `/tracker`  | `munib-tracker://tracker`  |
| `/library`  | `munib-tracker://library`  |
| `/settings` | `munib-tracker://settings` |

### Worship & tools

| Path                                                                          | Notes                                        |
| ----------------------------------------------------------------------------- | -------------------------------------------- |
| `/schedule`, `/qibla`, `/location`                                            | Prayer times / direction                     |
| `/qaza`, `/qaza/history`, `/qaza/calculator`, `/qaza/planner`, `/qaza/roza`   | Missed prayers & fasts                       |
| `/tasbeeh/free`                                                               | Free counter                                 |
| `/ramadan`, `/tahajjud`, `/journal`, `/hayd`, `/sick`                         | Modes & logs                                 |
| `/calendar`, `/calendar/converter`, `/events`, `/statistics`, `/achievements` | Review & date tools                          |
| `/search`, `/notifications`, `/profile`, `/bookmarks`                         | Hub screens                                  |
| `/login`, `/tv-pair`                                                          | Auth; TV companion claim (`/tv-pair?code=…`) |

### Qur'an, hadith, dua, zikr

| Path / template                                                                                  | Example                                                                                                                                |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `/quran`                                                                                         | Index                                                                                                                                  |
| `/quran/{surah}?ayah={n}`                                                                        | `munib-tracker://quran/2?ayah=255`                                                                                                     |
| `/quran/page/{page}`                                                                             | Mushaf page 1–604                                                                                                                      |
| `/quran/juz`, `/quran/pages`, `/quran/khatm`, `/quran/hifz`, `/quran/search`, `/quran/bookmarks` | Hubs                                                                                                                                   |
| `/quran/practice`, `/quran/revision`, `/settings/quran-practice`                                 | Qur'an practice hub, revision queue, practice settings (hidden on TV)                                                                  |
| `/quran/practice/session?surah=&from=&to=&mode=`                                                 | One practice passage (validated on entry; invalid params land on the hub). `/quran/practice/summary` opened cold redirects to the hub. |
| `/hadith`, `/hadith/{collection}?q=…`                                                            | Collection + optional search seed                                                                                                      |
| `/hadith/daily`, `/hadith/bookmarks`                                                             | Daily + saved                                                                                                                          |
| `/dua`, `/dua/{category}`, `/dua/detail/{id}`                                                    | Duas                                                                                                                                   |
| `/zikr`, `/zikr/{category}`, `/zikr/detail/{id}`                                                 | Adhkar                                                                                                                                 |
| `/duroods`, `/names-of-allah`, `/adhkar-builder`                                                 | Supplication tools                                                                                                                     |

### Learning hubs

`/salah-guide`, `/learn-quran`, `/learn-dua`, `/jannah`, `/jahannam`, `/last-day`, `/last-third-night`, `/battles`, `/prophets`, `/aqeedah`, `/taharah`, `/travel`, `/hajj`, `/seerah`, `/zakat`, `/sahaba`, `/history`, `/laylat-al-qadr`, `/eid`, `/friday`, `/white-days`, `/ruqyah`, `/new-muslim`, `/finance`, `/flash-cards`

### Settings (common)

`/settings/appearance`, `/language`, `/notifications`, `/home`, `/fonts`, `/offline-data`, `/backup`, `/app-lock`, `/reminder-offsets`, `/prayer-tuning`, `/voice-shortcuts`, `/about`

### Special action bridges

| Path            | Behavior                                                                           |
| --------------- | ---------------------------------------------------------------------------------- |
| `/mark-current` | Enqueues mark-current obligatory, then opens tracker (`mark-current.tsx`)          |
| `/open-review`  | Opens the store write-review page (`ReviewDeepLinkBridge`, D76) — not a route file |

In-app content modules also use Expo Router paths (`/quran`, `/hadith`, …). `apps/app/src/lib/reference-link.ts` parses Qur'an `reference` strings into router targets.

---

## Custom scheme: `munib-tracker://`

### App-icon quick actions (NF-1.30)

Registered from `apps/app/src/lib/appSurfaces/quickActions/registry.ts` via `expo-quick-actions`:

| Quick action id      | Deep link                      | Screen                                                |
| -------------------- | ------------------------------ | ----------------------------------------------------- |
| `mark-current`       | `munib-tracker://mark-current` | Mark current Salah bridge                             |
| `tracker`            | `munib-tracker://tracker`      | Salah checklist                                       |
| `qibla`              | `munib-tracker://qibla`        | Qibla compass                                         |
| `tasbeeh`            | `munib-tracker://tasbeeh/free` | Tasbeeh counter                                       |
| `qaza`               | `munib-tracker://qaza`         | Qaza dashboard                                        |
| `quran`              | `munib-tracker://quran`        | Qur'an index                                          |
| `ramadan` (seasonal) | `munib-tracker://ramadan`      | Swaps into the `tasbeeh` slot while Ramadan is active |

Only the first 4 active entries are shown (`IOS_QUICK_ACTION_LIMIT` / `ANDROID_QUICK_ACTION_LIMIT` in `appSurfaces/config.ts`). Cold start / long-press routing: `useAppQuickActions()` → `expo-quick-actions/router`. Under the iOS scene life cycle (Expo SDK 58), cold-start shortcuts rely on `patches/expo-quick-actions@6.0.2.patch` — see [NATIVE_SURFACES.md](./NATIVE_SURFACES.md#ios-scene-life-cycle-expo-sdk-58).

### Siri & Assistant navigation intents (NF-2.15)

From `apps/app/src/lib/appSurfaces/intents/registry.ts` (same routes as quick actions where applicable):

| Intent                               | Deep link                                                       | Notes                                   |
| ------------------------------------ | --------------------------------------------------------------- | --------------------------------------- |
| Open checklist                       | `munib-tracker://tracker`                                       | Foreground                              |
| Open Qibla                           | `munib-tracker://qibla`                                         | Foreground                              |
| Open Tasbeeh                         | `munib-tracker://tasbeeh/free`                                  | Foreground                              |
| Open Ramadan / Khatm / Qaza / Qur'an | `munib-tracker://ramadan`, `…/quran/khatm`, `…/qaza`, `…/quran` | Foreground                              |
| Mark my Salah                        | _(no URL)_ / `munib-tracker://mark-current`                     | Background enqueue, or deep-link screen |
| Mark a Salah (Fajr…Isha)             | _(no URL)_                                                      | Background enqueue (`mark-prayer`)      |

Native hard-codes match in `targets/munib-tracker-intents/_shared/MunibAppIntents.swift`.

### Home-screen widgets (NF-1.18)

Widget taps use `munib-tracker://` routes baked into the WidgetKit snapshot (`targets/munib-tracker-widgets/PrayerWidgets.swift`). Typical targets:

| Widget              | Default tap target                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| Next Salah          | `munib-tracker://`                                                                             |
| Schedule / Progress | `munib-tracker://tracker`                                                                      |
| Salah streak        | `munib-tracker://statistics`                                                                   |
| Qaza                | `munib-tracker://qaza`                                                                         |
| Ramadan             | `munib-tracker://ramadan`                                                                      |
| Khatm               | `munib-tracker://quran/khatm`                                                                  |
| Daily hadith        | `munib-tracker://hadith/daily`                                                                 |
| Islamic date        | `munib-tracker://calendar`                                                                     |
| Qibla               | `munib-tracker://qibla`                                                                        |
| Tasbeeh glance      | `munib-tracker://tasbeeh/free`                                                                 |
| Jumu'ah             | `munib-tracker://tracker?focus=…` (Friday checklist) on Fridays, else `munib-tracker://friday` |

**Mark current Salah (in-widget action):**

| Platform | Mechanism                                                                                     |
| -------- | --------------------------------------------------------------------------------------------- |
| iOS      | `MarkCurrentSalahWidgetIntent` → App Group `pending_commands_v1` (`source: "widget"`), no URL |
| Android  | Secondary Mark chip → `munib-tracker://mark-current` → `mark-current.tsx` enqueue             |

When location is denied, taps on location-dependent widgets open `munib-tracker://location` (Mark on Progress still works).
Snapshot builder: `apps/app/src/lib/appSurfaces/widgets/buildWidgetSnapshot.ts`.

### OAuth redirects

| Path                                                            | Purpose                                                        |
| --------------------------------------------------------------- | -------------------------------------------------------------- |
| `munib-tracker:/oauth2redirect` / `oauth2redirect` route        | Google OAuth resume when Custom Tabs dismiss                   |
| `com.googleusercontent.apps.{client-id}:/oauth2redirect`        | Google OAuth return on native (reversed Android/iOS client ID) |
| `https://my.munibtracker.app/oauth/apple`                       | Apple OAuth App Link return (Android / iOS OAuth fallback)     |
| `https://api.munibtracker.app/api/v1/auth/apple/oauth/callback` | Apple web `form_post` callback (API)                           |

Configured in `apps/app/src/lib/auth/oauth-config.ts`. App Links / associated domains are declared in `apps/app/app.json` (`ios.associatedDomains`, `android.intentFilters`).

---

## HTTPS App Links

`app.json` already declares:

- iOS `associatedDomains`: `applinks:my.munibtracker.app`
- Android `intentFilters` for `https://my.munibtracker.app/oauth/apple`
- `usesAppleSignIn` + `expo-apple-authentication` plugin

Apple OAuth on Android (and iOS OAuth fallback) returns to **`https://my.munibtracker.app/oauth/apple`** — handled by `apps/app/src/app/oauth/apple.tsx`. Apple rejects custom URI schemes as Services ID return URLs.

**Native App Links** cover the Apple OAuth return plus the shared / QR paths (`/circle/join`, `/kids/link`, `/tv-pair` — see [App first, browser second](#app-first-browser-second-every-shared--qr-link)). Every other `https://my.munibtracker.app/{path}` URL opens the **web** product app; use `munib-tracker://` for native cold-start there.

Host verification files are generated into `apps/app/public/.well-known/` by `scripts/generate-well-known.mjs` (runs as part of `build:web`):

| File                       | URL                                                                  |
| -------------------------- | -------------------------------------------------------------------- |
| Apple App Site Association | `https://my.munibtracker.app/.well-known/apple-app-site-association` |
| Digital Asset Links        | `https://my.munibtracker.app/.well-known/assetlinks.json`            |

**Deploy env for production verification:**

| Variable                               | Purpose                                                                                                                                                                                                                                                              |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EXPO_APPLE_TEAM_ID`                   | AASA `appID` prefix (required for real iOS verification; placeholder `TEAMID` if unset)                                                                                                                                                                              |
| `ANDROID_APP_LINK_SHA256_FINGERPRINTS` | Play App Signing + debug SHA-256 (comma-separated). **Required for Play Store installs** — the generator always includes the upload cert, but Play re-signs with the App Signing key. Without that fingerprint, `autoVerify` App Links fail for production installs. |
| `EXPO_PUBLIC_APP_IDENTIFIER`           | iOS bundle ID (`app.munibtracker`)                                                                                                                                                                                                                                   |
| `EXPO_PUBLIC_ANDROID_PACKAGE`          | Android package (`app.munibtracker`)                                                                                                                                                                                                                                 |
| `EXPO_PUBLIC_WEB_APP_ORIGIN`           | Product web origin used for Apple redirect URIs (falls back to `EXPO_PUBLIC_APP_URL`)                                                                                                                                                                                |

**SHA-256 sources:**

- Play Console → App → **App integrity** → App signing key certificate
- Local debug: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android`
- Release signing report: `pnpm dev:app:android:signs`

After deploy, verify:

```bash
curl -sI https://my.munibtracker.app/.well-known/apple-app-site-association
```

[Google Asset Links tool](https://developers.google.com/digital-asset-links/tools/generator)

Full OAuth console setup: [OAUTH_SETUP.md](./OAUTH_SETUP.md).

---

## Circle invites & child-device links (NF-3.16–3.18, D36)

| Path                           | Opens                                                                                                                                                                                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/circle/join/<CODE>`          | Invite landing: preview + join. `CODE` is the 10-char base32 invite code (`ABCDE-FGH23` display grouping; dashes/spaces/case are ignored). Built with `appLink.circleJoin(code)` / `circleJoinPath()` (`@munib-tracker/shared/circles`). |
| `/kids/link?token=mtl_…`       | Child device: redeems the parent's one-time QR token (5-minute TTL) for a scoped child session. Built with `appLink.kidsLink(token)`.                                                                                                    |
| `/circles`, `/family`, `/kids` | Circles hub, parent view, kids mode.                                                                                                                                                                                                     |

- **HTTPS is the shared form** (`https://my.munibtracker.app/circle/join/<CODE>`). Devices with the app open it through App Links / Universal Links (Android `intentFilters` `pathPrefix` `/circle/join` + `/kids/link` in `app.json`; AASA paths `/circle/join/*`, `/kids/link`, `/kids/link/*` from `scripts/generate-well-known.mjs`). Without the app it opens the **Expo web join screen** — guests can join a group khatm on the web; family and partner circles ask to sign in. There is no marketing-site landing page.
- `munib-tracker://circle/join/<CODE>` also works (the app's custom scheme is `munib-tracker://`, not `munib://`).

### App first, browser second (every shared / QR link)

All shared and QR links — circle + group-khatm invites (`/circle/join/<CODE>`), the child-device QR (`/kids/link?token=…`) and the TV sign-in QR (`/tv-pair?code=…`) — are listed once in `APP_FIRST_SHARE_PATH_PREFIXES` (`apps/app/src/lib/app-links.ts`). `NATIVE_APP_LINK_PATH_PREFIXES` (those + `/oauth/apple`) must match the Android `intentFilters` in `app.json` and `AASA_PATHS` in `scripts/generate-well-known.mjs`; `app-links.test.ts` fails when they drift. Adding a new shareable link = add its prefix to all three.

1. **App installed, link verified** → the OS opens the app directly (Universal Links / App Links) — from Messages, WhatsApp, Mail, the camera's QR scanner, etc.
2. **Link lands in a phone browser anyway** (in-app browsers such as Instagram/Facebook, a typed or pasted URL, failed Android verification) → the web screen shows `OpenInAppBanner` (`src/components/app-links/`): **Open in the app** hands the same path over — Android via an `intent://…;package=app.munibtracker;S.browser_fallback_url=<Play listing>` URL, iOS via `munib-tracker://…` with an App Store fallback when the page is still visible after 1.6 s (`src/lib/open-in-app.ts`). **Continue in the browser** hides it. Desktop browsers and an installed PWA never see it.
3. **No app** → the web flow works as before (guests can join a group khatm on the web).
4. **Installed from that link** (deferred deep link) → the first launch opens the same invite (`src/lib/deferred-invite.ts`, `DeferredInviteHost` in the root overlays):
   - **Android:** the banner's Play fallback is `…details?id=app.munibtracker&referrer=mt_link%3D<path>`; on first launch `expo-application` `getInstallReferrerAsync()` returns it, and the app opens the path.
   - **iOS:** no install referrer exists, so the banner copies the HTTPS link before handing off. On first launch the app only checks _whether_ the clipboard has content (`hasUrlAsync` / `hasStringAsync` — no paste prompt) and shows a "Came from an invite?" sheet with the system **Paste** control (`ClipboardPasteButton`, no permission prompt; iOS < 16 falls back to a button that reads on tap).
   - Guards: one check per install (`DB_KEYS.deferredInviteChecked`), only before onboarding is complete, only within 24 h of install, skipped when the app was cold-started from a real link. Only `APP_FIRST_SHARE_PATH_PREFIXES` paths are ever opened (`restorableSharePath`). The invite defers onboarding like an App Link (`deferredOnboardingStore`).
   - Not on web or TV (`expo-clipboard` is in `TV_EXCLUDED_PACKAGES` with a Metro stub; `expo-application` stays linked because `expo-auth-session` needs it).

`/kids/link` does not auto-redeem its one-time token in a phone browser (it would spend the token before the app could use it); the child taps **Open in the app** or the link button.

**Production checklist** (owner — the code alone doesn't make the OS hand links to the app):

- Redeploy the product web (`apps/app`, manual Vercel deploy) after any change to `AASA_PATHS`, then check `curl -s https://my.munibtracker.app/.well-known/apple-app-site-association` lists every path above. iOS caches AASA via Apple's CDN — new paths can take a day to reach devices.
- Set `ANDROID_APP_LINK_SHA256_FINGERPRINTS` on that Vercel project to the **Play App Signing** SHA-256 (Play Console → App integrity). Without it, Play Store installs never verify, and Android opens every shared link in the browser (step 2 still rescues it).
- Ship a native build with the updated `app.json` intent filters (new paths need a new store build).
- Both routes are `index: false` in the SEO registry.

---

## Push notifications

Local and web push use **structured route data** (screen/tab/focus fields), not URL schemes — see `apps/app/src/lib/notifications/`. Paths should match catalog destinations (e.g. `/tracker`, `/zikr/after_prayer`).

---

## First-time users (deferred onboarding)

Onboarding only starts when a not-yet-onboarded user **lands on Home (`/`)**. Opening any other link (Circle / family / group-khatm invite, a Qur'an or hadith page, a calculator, a quick action…) goes straight to that page. Onboarding is then deferred for the rest of the session, including Home.

- Every titled screen (`ScreenLayout`) shows a warning-toned bar under the title bar — **"Your setup is pending — Complete it for a better, more personalized experience. Complete setup ›"** (the whole bar is one tap target); Home shows a matching callout. Both stay until onboarding is complete.
- **Complete setup** opens `/setup?next=back`; finishing (or Back from its first step) returns to the page the user was on.
- Session-only: the next launch that lands on Home starts onboarding again. Web crawlers never see the bar, and TV relies on the Home callout.

Code: `apps/app/src/lib/onboarding/deferred-onboarding.ts` (gate decision used by `AppStack` + `AppProviders`), `apps/app/src/components/onboarding/pending-onboarding-notice.tsx` (bar + Home callout).

---

## Pin lock deferral

Deep links, quick actions, and external commands are blocked until PIN/biometric lock state is loaded and unlocked. See `apps/app/src/features/pin-lock/lib/pin-lock-defer-actions.ts`.

---

## Related code

| Area                            | Path                                                                |
| ------------------------------- | ------------------------------------------------------------------- |
| Scheme + URL builders + catalog | `apps/app/src/lib/app-links.ts`                                     |
| Catalog / builder tests         | `apps/app/src/lib/app-links.test.ts`                                |
| OAuth redirect URIs             | `apps/app/src/lib/auth/oauth-config.ts`                             |
| Apple OAuth App Link route      | `apps/app/src/app/oauth/apple.tsx`                                  |
| Google OAuth resume route       | `apps/app/src/app/oauth2redirect.tsx`                               |
| Mark-current bridge             | `apps/app/src/app/mark-current.tsx`                                 |
| Review bridge                   | `apps/app/src/features/reviews/components/ReviewDeepLinkBridge.tsx` |
| Quick actions                   | `apps/app/src/lib/appSurfaces/quickActions/`                        |
| Voice intents                   | `apps/app/src/lib/appSurfaces/intents/registry.ts`                  |
| External command queue          | `apps/app/src/lib/external-commands/`                               |
| Widget snapshot + deep links    | `apps/app/src/lib/appSurfaces/widgets/`                             |
| Expo config                     | `apps/app/app.json`                                                 |
| Native surfaces overview        | [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md)                        |
