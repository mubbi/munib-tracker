# Deep links & App Links

Munib Tracker uses a **custom URL scheme** (`munib-tracker://`) for widgets, Siri/Assistant shortcuts, app-icon quick actions, and OAuth redirects. **HTTPS App Links** on the product web origin (`my.munibtracker.app`) are planned for shareable web URLs and Android Apple Sign In — not wired in `app.json` yet.

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
| `munib-tracker://oauthredirect` | Apple OAuth return (web/Android); fallback when Google reversed scheme unavailable |
| `com.googleusercontent.apps.{client-id}:/oauthredirect` | Google OAuth return on native (reversed Android/iOS client ID) |

Configured in `apps/app/src/lib/auth/oauth-config.ts` (`OAUTH_REDIRECT_PATH = "oauthredirect"`).

### In-app reference links

Content modules (Jannah/Jahannam journeys, battles, aqeedah, etc.) use **Expo Router paths** (`/quran`, `/hadith`, …) — not custom-scheme URLs. `apps/app/src/lib/reference-link.ts` parses Qur'an `reference` strings into router targets.

---

## HTTPS App Links (planned)

When enabled on `my.munibtracker.app`, host verification files at:

| File | URL |
|------|-----|
| Apple App Site Association | `https://my.munibtracker.app/.well-known/apple-app-site-association` |
| Digital Asset Links | `https://my.munibtracker.app/.well-known/assetlinks.json` |

**Not yet in repo.** To add (mirror Expense Trail / Expo web deploy pattern):

1. Add `associatedDomains` (`applinks:my.munibtracker.app`) and Android `intentFilters` in `app.json` / config plugin.
2. Generate `.well-known` at web build time (team ID, package, SHA-256 fingerprints).
3. Centralize allowed paths in a JSON manifest (e.g. `config/appLinkPaths.json`).
4. Add locale-prefixed web redirect routes under `apps/app/app/` for shareable URLs.

**Env for verification (web deploy):**

| Variable | Purpose |
|----------|---------|
| `EXPO_APPLE_TEAM_ID` | AASA `appID` prefix |
| `ANDROID_APP_LINK_SHA256_FINGERPRINTS` | Play App Signing + debug SHA-256 (comma-separated) |
| `EXPO_PUBLIC_APP_IDENTIFIER` | iOS bundle ID (`app.munibtracker`) |
| `EXPO_PUBLIC_ANDROID_PACKAGE` | Android package (`app.munibtracker`) |

**SHA-256 sources:**

- Play Console → App → **App integrity** → App signing key certificate
- Local debug: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android`
- Release signing report: `pnpm dev:app:android:signs`

After deploy, verify:

```bash
curl -sI https://my.munibtracker.app/.well-known/apple-app-site-association
```

[Google Asset Links tool](https://developers.google.com/digital-asset-links/tools/generator)

**Apple OAuth on Android** requires an **HTTPS** return URL on the Services ID (not `munib-tracker://`). See [OAUTH_SETUP.md](./OAUTH_SETUP.md).

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
| Quick actions | `apps/app/src/lib/appSurfaces/quickActions/` |
| Voice intents | `apps/app/src/lib/appSurfaces/intents/registry.ts` |
| External command queue | `apps/app/src/lib/external-commands/` |
| Widget snapshot + deep links | `apps/app/src/lib/appSurfaces/widgets/` |
| Expo config | `apps/app/app.json`, `apps/app/app.config.js` |
| Native surfaces overview | [`NATIVE_SURFACES.md`](./NATIVE_SURFACES.md) |
