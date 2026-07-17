# Deep links & App Links

Munib Tracker uses a **custom URL scheme** (`munib-tracker://`) for widgets, Siri/Assistant shortcuts, app-icon quick actions, and Google OAuth redirects. **HTTPS App Links** on the product web origin (`my.munibtracker.app`) handle Apple OAuth return on Android (and iOS OAuth fallback). The same product-web paths are shareable on web today (`https://my.munibtracker.app/…`).

**Related:** [OAUTH_SETUP.md](./OAUTH_SETUP.md) · [NATIVE_SURFACES.md](./NATIVE_SURFACES.md)

---

## Identifiers

| Value | Default | Where |
|-------|---------|-------|
| Custom scheme | `munib-tracker` | `apps/app/app.json` → `expo.scheme` |
| iOS bundle ID | `app.munibtracker` | `app.json` → `ios.bundleIdentifier` |
| Android package | `app.munibtracker` | `app.json` → `android.package` |
| Product web origin | `https://my.munibtracker.app` | `EXPO_PUBLIC_APP_URL` |
| Marketing site | `https://munibtracker.app` | `EXPO_PUBLIC_SITE_URL` |

Canonical URL builders: `apps/app/src/lib/app-links.ts` — `buildAppUrl()`, `buildHttpsAppUrl()`, `resolveAppLink()`, typed `appLink.*` helpers, and `DEEP_LINK_PATHS`.

---

## Building URLs (send users from anywhere)

Expo Router treats the path after `munib-tracker://` as an in-app route (leading slash optional). **Any** Expo Router path works; the catalog below is the supported surface for campaigns, notifications, widgets, and docs.

```ts
import { appLink, buildAppUrl, buildHttpsAppUrl, resolveAppLink } from "@/lib/app-links";

buildAppUrl("/quran");                    // munib-tracker://quran
buildHttpsAppUrl("/quran");               // https://my.munibtracker.app/quran
resolveAppLink("/tracker");               // { path, schemeUrl, httpsUrl }

appLink.quranSurah(2, { ayah: 255 });     // …/quran/2?ayah=255
appLink.quranPage(255);                   // …/quran/page/255
appLink.hadithCollection("riyad", { q: "Muslim 591" });
appLink.duaDetail("morning-1");
appLink.zikrCategory("after_prayer");
appLink.markCurrent();                    // special action bridge
appLink.openReview("manual");             // review funnel bridge
```

Prefer `appLink.*` / `resolveAppLink` over hand-rolled strings so scheme and HTTPS stay aligned.

---

## Shareable destinations

Static paths live in `DEEP_LINK_PATHS` (asserted against `QUICK_ACTION_ROUTES` in tests). Examples:

### Tabs

| Path | Scheme example |
|------|----------------|
| `/` | `munib-tracker://` |
| `/tracker` | `munib-tracker://tracker` |
| `/library` | `munib-tracker://library` |
| `/settings` | `munib-tracker://settings` |

### Worship & tools

| Path | Notes |
|------|-------|
| `/schedule`, `/qibla`, `/location` | Prayer times / direction |
| `/qaza`, `/qaza/history`, `/qaza/calculator`, `/qaza/planner`, `/qaza/roza` | Missed prayers & fasts |
| `/tasbeeh/free` | Free counter |
| `/ramadan`, `/tahajjud`, `/journal`, `/hayd`, `/sick` | Modes & logs |
| `/calendar`, `/calendar/converter`, `/events`, `/statistics`, `/achievements` | Review & date tools |
| `/search`, `/notifications`, `/profile`, `/bookmarks` | Hub screens |

### Qur'an, hadith, dua, zikr

| Path / template | Example |
|-----------------|---------|
| `/quran` | Index |
| `/quran/{surah}?ayah={n}` | `munib-tracker://quran/2?ayah=255` |
| `/quran/page/{page}` | Mushaf page 1–604 |
| `/quran/juz`, `/quran/pages`, `/quran/khatm`, `/quran/hifz`, `/quran/search`, `/quran/bookmarks` | Hubs |
| `/hadith`, `/hadith/{collection}?q=…` | Collection + optional search seed |
| `/hadith/daily`, `/hadith/bookmarks` | Daily + saved |
| `/dua`, `/dua/{category}`, `/dua/detail/{id}` | Duas |
| `/zikr`, `/zikr/{category}`, `/zikr/detail/{id}` | Adhkar |
| `/duroods`, `/names-of-allah`, `/adhkar-builder` | Supplication tools |

### Learning hubs

`/salah-guide`, `/learn-quran`, `/learn-dua`, `/jannah`, `/jahannam`, `/last-day`, `/battles`, `/prophets`, `/aqeedah`, `/taharah`, `/travel`, `/hajj`, `/seerah`, `/zakat`, `/sahaba`, `/history`, `/laylat-al-qadr`, `/eid`, `/ruqyah`, `/new-muslim`, `/finance`, `/flash-cards`

### Settings (common)

`/settings/appearance`, `/language`, `/notifications`, `/home`, `/fonts`, `/offline-data`, `/backup`, `/app-lock`, `/reminder-offsets`, `/prayer-tuning`, `/voice-shortcuts`, `/about`

### Special action bridges

| Path | Behavior |
|------|----------|
| `/mark-current` | Enqueues mark-current obligatory, then opens tracker (`mark-current.tsx`) |
| `/open-review?triggerId=…` | Opens review funnel (`ReviewDeepLinkBridge`) — not an Expo route file |

In-app content modules also use Expo Router paths (`/quran`, `/hadith`, …). `apps/app/src/lib/reference-link.ts` parses Qur'an `reference` strings into router targets.

---

## Custom scheme: `munib-tracker://`

### App-icon quick actions (NF-1.30)

Registered from `apps/app/src/lib/appSurfaces/quickActions/registry.ts` via `expo-quick-actions`:

| Quick action id | Deep link | Screen |
|-----------------|-----------|--------|
| `tracker` | `munib-tracker://tracker` | Salah checklist |
| `qibla` | `munib-tracker://qibla` | Qibla compass |
| `tasbeeh` | `munib-tracker://tasbeeh/free` | Tasbeeh counter |
| `qaza` | `munib-tracker://qaza` | Qaza dashboard |
| `quran` | `munib-tracker://quran` | Qur'an index |

Cold start / long-press routing: `useAppQuickActions()` → `expo-quick-actions/router`.

### Siri & Assistant navigation intents (NF-2.15)

From `apps/app/src/lib/appSurfaces/intents/registry.ts` (same routes as quick actions where applicable):

| Intent | Deep link | Notes |
|--------|-----------|-------|
| Open checklist | `munib-tracker://tracker` | Foreground |
| Open Qibla | `munib-tracker://qibla` | Foreground |
| Open Tasbeeh | `munib-tracker://tasbeeh/free` | Foreground |
| Mark my Salah | *(no URL)* / `munib-tracker://mark-current` | Background enqueue, or deep-link screen |

Native hard-codes match in `targets/munib-tracker-intents/MunibAppIntents.swift`.

### Home-screen widgets (NF-1.18)

Widget taps use `munib-tracker://` routes baked into the WidgetKit snapshot (`targets/munib-tracker-widgets/PrayerWidgets.swift`). Typical targets:

| Widget | Default tap target |
|--------|-------------------|
| Next prayer | `munib-tracker://` or section-specific `deepLink` from snapshot |
| Schedule | `munib-tracker://` |
| Progress | `munib-tracker://tracker` |

Snapshot builder: `apps/app/src/lib/appSurfaces/widgets/buildWidgetSnapshot.ts`.

### OAuth redirects

| Path | Purpose |
|------|---------|
| `munib-tracker:/oauth2redirect` / `oauth2redirect` route | Google OAuth resume when Custom Tabs dismiss |
| `com.googleusercontent.apps.{client-id}:/oauth2redirect` | Google OAuth return on native (reversed Android/iOS client ID) |
| `https://my.munibtracker.app/oauth/apple` | Apple OAuth App Link return (Android / iOS OAuth fallback) |
| `https://api.munibtracker.app/api/v1/auth/apple/oauth/callback` | Apple web `form_post` callback (API) |

Configured in `apps/app/src/lib/auth/oauth-config.ts`. App Links / associated domains are declared in `apps/app/app.json` (`ios.associatedDomains`, `android.intentFilters`).

---

## HTTPS App Links

`app.json` already declares:

- iOS `associatedDomains`: `applinks:my.munibtracker.app`
- Android `intentFilters` for `https://my.munibtracker.app/oauth/apple`
- `usesAppleSignIn` + `expo-apple-authentication` plugin

Apple OAuth on Android (and iOS OAuth fallback) returns to **`https://my.munibtracker.app/oauth/apple`** — handled by `apps/app/src/app/oauth/apple.tsx`. Apple rejects custom URI schemes as Services ID return URLs.

**Native App Links beyond OAuth** are not store-verified yet (Android filter is OAuth-only). Shareable `https://my.munibtracker.app/{path}` URLs still open the **web** product app; use `munib-tracker://` for reliable native cold-start until `.well-known` host verification lands (see backlog).

Host verification files are generated into `apps/app/public/.well-known/` by `scripts/generate-well-known.mjs` (runs as part of `build:web`):

| File | URL |
|------|-----|
| Apple App Site Association | `https://my.munibtracker.app/.well-known/apple-app-site-association` |
| Digital Asset Links | `https://my.munibtracker.app/.well-known/assetlinks.json` |

**Deploy env for production verification:**

| Variable | Purpose |
|----------|---------|
| `EXPO_APPLE_TEAM_ID` | AASA `appID` prefix (required for real iOS verification; placeholder `TEAMID` if unset) |
| `ANDROID_APP_LINK_SHA256_FINGERPRINTS` | Play App Signing + debug SHA-256 (comma-separated; falls back to bundled fingerprint) |
| `EXPO_PUBLIC_APP_IDENTIFIER` | iOS bundle ID (`app.munibtracker`) |
| `EXPO_PUBLIC_ANDROID_PACKAGE` | Android package (`app.munibtracker`) |
| `EXPO_PUBLIC_WEB_APP_ORIGIN` | Product web origin used for Apple redirect URIs (falls back to `EXPO_PUBLIC_APP_URL`) |

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

## Push notifications

Local and web push use **structured route data** (screen/tab/focus fields), not URL schemes — see `apps/app/src/lib/notifications/`. Paths should match catalog destinations (e.g. `/tracker`, `/zikr/after_prayer`).

---

## Pin lock deferral

Deep links, quick actions, and external commands are blocked until PIN/biometric lock state is loaded and unlocked. See `apps/app/src/features/pin-lock/lib/pin-lock-defer-actions.ts`.

---

## Related code

| Area | Path |
|------|------|
| Scheme + URL builders + catalog | `apps/app/src/lib/app-links.ts` |
| Catalog / builder tests | `apps/app/src/lib/app-links.test.ts` |
| OAuth redirect URIs | `apps/app/src/lib/auth/oauth-config.ts` |
| Apple OAuth App Link route | `apps/app/src/app/oauth/apple.tsx` |
| Google OAuth resume route | `apps/app/src/app/oauth2redirect.tsx` |
| Mark-current bridge | `apps/app/src/app/mark-current.tsx` |
| Review bridge | `apps/app/src/features/reviews/components/ReviewDeepLinkBridge.tsx` |
| Quick actions | `apps/app/src/lib/appSurfaces/quickActions/` |
| Voice intents | `apps/app/src/lib/appSurfaces/intents/registry.ts` |
| External command queue | `apps/app/src/lib/external-commands/` |
| Widget snapshot + deep links | `apps/app/src/lib/appSurfaces/widgets/` |
| Expo config | `apps/app/app.json` |
| Native surfaces overview | [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md) |
