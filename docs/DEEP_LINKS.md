# Deep links & App Links

Munib Tracker uses a **custom URL scheme** (`munib-tracker://`) for widgets, Siri/Assistant shortcuts, app-icon quick actions, and Google OAuth redirects. **HTTPS App Links** on the product web origin (`my.munibtracker.app`) handle Apple OAuth return on Android (and iOS OAuth fallback).

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

Canonical URL builder: `apps/app/src/lib/app-links.ts` (`buildAppUrl()`).

---

## Custom scheme: `munib-tracker://`

Expo Router treats the path after `://` as an in-app route (leading slash optional).

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
| Mark my Salah | *(no URL)* | Background — enqueues `mark-current-obligatory` via App Group |

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
| `munib-tracker:/oauthredirect` / `oauth2redirect` route | Google OAuth resume when Custom Tabs dismiss |
| `com.googleusercontent.apps.{client-id}:/oauthredirect` | Google OAuth return on native (reversed Android/iOS client ID) |
| `https://my.munibtracker.app/oauth/apple` | Apple OAuth App Link return (Android / iOS OAuth fallback) |
| `https://api.munibtracker.app/api/v1/auth/apple/oauth/callback` | Apple web `form_post` callback (API) |

Configured in `apps/app/src/lib/auth/oauth-config.ts`. App Links / associated domains are declared in `apps/app/app.json` (`ios.associatedDomains`, `android.intentFilters`).

### In-app reference links

Content modules (Jannah/Jahannam journeys, battles, aqeedah, etc.) use **Expo Router paths** (`/quran`, `/hadith`, …) — not custom-scheme URLs. `apps/app/src/lib/reference-link.ts` parses Qur'an `reference` strings into router targets.

---

## HTTPS App Links

`app.json` already declares:

- iOS `associatedDomains`: `applinks:my.munibtracker.app`
- Android `intentFilters` for `https://my.munibtracker.app/oauth/apple`
- `usesAppleSignIn` + `expo-apple-authentication` plugin

Apple OAuth on Android (and iOS OAuth fallback) returns to **`https://my.munibtracker.app/oauth/apple`** — handled by `apps/app/src/app/oauth/apple.tsx`. Apple rejects custom URI schemes as Services ID return URLs.

Host verification files still need to be served from the product web origin at build/deploy time:

| File | URL |
|------|-----|
| Apple App Site Association | `https://my.munibtracker.app/.well-known/apple-app-site-association` |
| Digital Asset Links | `https://my.munibtracker.app/.well-known/assetlinks.json` |

**Still to wire for store-grade verification** (mirror Expense Trail / Expo web deploy pattern):

1. Generate `.well-known` at web build time (team ID, package, SHA-256 fingerprints).
2. Centralize allowed App Link paths in a JSON manifest if you add more HTTPS routes.
3. Optional locale-prefixed web redirect routes for shareable non-OAuth URLs.

**Env for verification (web deploy):**

| Variable | Purpose |
|----------|---------|
| `EXPO_APPLE_TEAM_ID` | AASA `appID` prefix |
| `ANDROID_APP_LINK_SHA256_FINGERPRINTS` | Play App Signing + debug SHA-256 (comma-separated) |
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

Local and web push use **structured route data** (screen/tab/focus fields), not URL schemes — see `apps/app/src/lib/notifications/`.

---

## Pin lock deferral

Deep links, quick actions, and external commands are blocked until PIN/biometric lock state is loaded and unlocked. See `apps/app/src/features/pin-lock/lib/pin-lock-defer-actions.ts`.

---

## Related code

| Area | Path |
|------|------|
| Scheme + URL builder | `apps/app/src/lib/app-links.ts` |
| OAuth redirect URIs | `apps/app/src/lib/auth/oauth-config.ts` |
| Apple OAuth App Link route | `apps/app/src/app/oauth/apple.tsx` |
| Google OAuth resume route | `apps/app/src/app/oauth2redirect.tsx` |
| Quick actions | `apps/app/src/lib/appSurfaces/quickActions/` |
| Voice intents | `apps/app/src/lib/appSurfaces/intents/registry.ts` |
| External command queue | `apps/app/src/lib/external-commands/` |
| Widget snapshot + deep links | `apps/app/src/lib/appSurfaces/widgets/` |
| Expo config | `apps/app/app.json` |
| Native surfaces overview | [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md) |
