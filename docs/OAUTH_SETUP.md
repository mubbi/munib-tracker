# OAuth setup (Google & Apple)

Guide for **Sign in with Google** and **Sign in with Apple** on **web**, **iOS**, and **Android** for Munib Tracker. Use this for first-time console setup, production env configuration, and debugging.

**Related:** [`apps/app/.env.example`](../apps/app/.env.example) · [`apps/api/.env.example`](../apps/api/.env.example) · [DEEP_LINKS.md](./DEEP_LINKS.md) · [`apps/api/AGENTS.md`](../apps/api/AGENTS.md)

---

## How sign-in works in this repo

The Expo app uses **`expo-auth-session`** with **PKCE** (authorization code flow) and redirect scheme **`munib-tracker`** (`apps/app/app.json`). The NestJS API exchanges the code (or validates an `idToken`) and issues JWT access + refresh tokens.

| Platform | Google | Apple |
|----------|--------|-------|
| **Web** | PKCE code → `POST /auth/oauth/google` | PKCE code → `POST /auth/oauth/apple` (needs Services ID + API `.p8`) |
| **iOS** | PKCE code → `POST /auth/oauth/google` | PKCE code → `POST /auth/oauth/apple` (Services ID redirect today; native `expo-apple-authentication` is a future enhancement) |
| **Android** | PKCE code → `POST /auth/oauth/google` | PKCE code → `POST /auth/oauth/apple` (Services ID; prefer HTTPS App Link when configured) |

**Guest mode** works without any OAuth configuration — full offline functionality, optional sign-in for cloud sync.

**Facebook** is implemented on the API (`POST /auth/oauth/facebook`) but **not wired** in the app UI yet (`use-social-auth.ts` throws for unsupported providers).

---

## Identifier cheat sheet (do not mix these up)

| Value | Example | Where it lives | Used for |
|-------|---------|----------------|----------|
| **iOS bundle ID** (App ID) | `app.munibtracker` | App Store Connect, Apple **App ID**, `app.json` | Native iOS app, Apple JWT `aud`, Google **iOS** OAuth client |
| **Android package** | `app.munibtracker` | Play Console, `app.json` | Google **Android** OAuth client + SHA-1 |
| **Apple Team ID** | *(your 10-char ID)* | Apple Developer → Membership | `APPLE_TEAM_ID` on API |
| **Apple Services ID** | `com.munibtracker.web` | Apple → Identifiers → **Services IDs** (must differ from bundle ID) | `APPLE_SERVICES_ID`, `EXPO_PUBLIC_APPLE_SERVICES_ID`, web/Android Apple OAuth |
| **Google client IDs** | `….apps.googleusercontent.com` | Google Cloud → Credentials (three clients) | Per-platform `EXPO_PUBLIC_GOOGLE_CLIENT_ID_*` + `GOOGLE_CLIENT_ID` on API |

Apple will **reject** using `app.munibtracker` as both App ID and Services ID — use a suffix for Services ID (e.g. `.web`).

---

## Google Cloud Console

Create **one project** (can share the Google account with Play Console).

### 1. OAuth consent screen

- Scopes: `openid`, `profile`, `email`.
- **Testing** → add test users until ready for production.
- Publish to **Production** when launching publicly.

### 2. Three OAuth clients

| Client type | Purpose | Goes in |
|-------------|---------|---------|
| **Web application** | Expo web (`my.munibtracker.app`) | `EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB`, `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` on API |
| **iOS** | iPhone/iPad app | `EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS` |
| **Android** | Android app | `EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID` |

**Android OAuth (one SHA-1 per client ID)** — Google allows only **one SHA-1 per Android OAuth client**. Create **separate** Android clients for debug vs Play signing (same package `app.munibtracker`):

| OAuth client | SHA-1 source | When to use |
|--------------|--------------|-------------|
| **Debug** | `~/.android/debug.keystore` | Local `pnpm --filter app android` |
| **Play** | Play Console **App signing** certificate | Internal test, production installs from Play |
| **Upload** (optional) | Release keystore | Sideloaded signed release APK without Play |

Put the **web** client ID in `GOOGLE_CLIENT_ID` on the API (used for code exchange and `id_token` audience validation).

**Web client** needs:

- **Authorized JavaScript origins:** e.g. `https://my.munibtracker.app`, `http://localhost:8081` (dev).
- **Authorized redirect URIs:** match [Expo redirect patterns](https://docs.expo.dev/guides/authentication/#redirect-uri-patterns) for dev and production web origins.

**Never** put the Google **client secret** in the Expo app — API only.

### 3. Native redirect URI (Custom URI scheme)

On native, `getGoogleRedirectUri()` (`apps/app/src/lib/auth/oauth-config.ts`) uses:

```
com.googleusercontent.apps.{android-or-ios-client-id}:/oauthredirect
```

Enable **Custom URI scheme** on each **Android** OAuth client ([Google native-app docs](https://developers.google.com/identity/protocols/oauth2/native-app#redirect-uri_custom-scheme)).

---

## Apple Developer

### 1. App ID (bundle ID)

- Identifier: `app.munibtracker`.
- Enable **Sign in with Apple** → **Enable as a primary App ID**.
- Enable **Push Notifications** if using push.
- App Group `group.app.munibtracker.widgets` for widgets (see [NATIVE_SURFACES.md](./NATIVE_SURFACES.md)).

### 2. Services ID (web / Android Apple OAuth)

- Create under **Identifiers → Services IDs** (not the same as App ID).
- Identifier example: `com.munibtracker.web` → `APPLE_SERVICES_ID` / `EXPO_PUBLIC_APPLE_SERVICES_ID`.
- **Sign in with Apple → Configure:**
  - **Primary App ID:** `app.munibtracker`.
  - **Domains:** `my.munibtracker.app` (host only, no `https://`).
  - **Return URLs (https only):** e.g.  
    `https://my.munibtracker.app/oauth/apple` (**required for Android** when using App Links)  
    `https://my.munibtracker.app` (web fallback)  
    **Do not** register `munib-tracker://` — Apple rejects custom URI schemes as web redirect URLs.

Until HTTPS App Links ship, native Apple uses `munib-tracker:/oauthredirect` in the app request; ensure the Services ID return URLs match what you actually register once App Links are live.

### 3. Key (.p8) for API token exchange

**Keys** → **+** → **Sign in with Apple** → download **AuthKey_*.p8** once.

| Apple field | API env |
|-------------|---------|
| Team ID | `APPLE_TEAM_ID` |
| Key ID | `APPLE_KEY_ID` |
| `.p8` contents | `APPLE_PRIVATE_KEY` (single line with `\n`) |

### 4. App Store rule

If you offer **Google** sign-in on **iOS**, you must also offer **Sign in with Apple**.

---

## Environment variables

`EXPO_PUBLIC_*` values are **embedded at build time** — rebuild native apps and web after changes.

### App (`apps/app/.env`)

| Variable | Required | Notes |
|----------|----------|-------|
| `EXPO_PUBLIC_API_URL` | Yes (prod) | API base including `/api/v1`, e.g. `https://api.munibtracker.app/api/v1` |
| `EXPO_PUBLIC_SITE_URL` | Recommended | Marketing site for Privacy/Terms links (`https://munibtracker.app`) |
| `EXPO_PUBLIC_APP_URL` | Web builds | Product web canonical origin (`https://my.munibtracker.app`) |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB` | Web Google | Web OAuth client ID |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS` | iOS Google | iOS OAuth client ID |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID` | Android Google | Android OAuth client ID |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID` | Fallback | Used if platform override unset |
| `EXPO_PUBLIC_APPLE_SERVICES_ID` | Web/Android Apple | Same string as `APPLE_SERVICES_ID` on API |

### API (`apps/api/.env`)

| Variable | Required when | Notes |
|----------|---------------|-------|
| `GOOGLE_CLIENT_ID` | Production Google | **Web** OAuth client ID (also validates native `id_token` audience) |
| `GOOGLE_CLIENT_SECRET` | Production Google | Web client secret only |
| `APPLE_CLIENT_ID` | Production Apple | Comma/space-separated audiences, e.g. `app.munibtracker,com.munibtracker.web` |
| `APPLE_SERVICES_ID` | Web/Android Apple OAuth | Services ID identifier |
| `APPLE_TEAM_ID` | Web/Android Apple OAuth | Team ID (10 chars) |
| `APPLE_KEY_ID` | Web/Android Apple OAuth | From Keys page |
| `APPLE_PRIVATE_KEY` | Web/Android Apple OAuth | PEM on **one** `.env` line (see below) |
| `CORS_ORIGINS` | Production | Include product web + marketing origins |
| `FACEBOOK_APP_ID` / `FACEBOOK_APP_SECRET` | Facebook (future) | API only; app UI not wired |

**`APPLE_PRIVATE_KEY` format** (one line; code replaces `\n` with newlines):

```env
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n<base64 body>\n-----END PRIVATE KEY-----
```

### Production example (replace client IDs)

```env
# apps/app/.env
EXPO_PUBLIC_API_URL=https://api.munibtracker.app/api/v1
EXPO_PUBLIC_SITE_URL=https://munibtracker.app
EXPO_PUBLIC_APP_URL=https://my.munibtracker.app
EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB=<web-client-id>.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS=<ios-client-id>.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID=<android-client-id>.apps.googleusercontent.com
EXPO_PUBLIC_APPLE_SERVICES_ID=com.munibtracker.web

# apps/api/.env
GOOGLE_CLIENT_ID=<web-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<web-secret>
APPLE_CLIENT_ID=app.munibtracker,com.munibtracker.web
APPLE_SERVICES_ID=com.munibtracker.web
APPLE_TEAM_ID=<team-id>
APPLE_KEY_ID=<key-id>
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
CORS_ORIGINS=https://my.munibtracker.app,https://munibtracker.app,http://localhost:8081
```

---

## Minimum config by what you ship

| Ship | App env | API env |
|------|---------|---------|
| **iOS only** — Google + Apple | `EXPO_PUBLIC_API_URL`, `GOOGLE_CLIENT_ID_IOS`, `APPLE_SERVICES_ID` | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `APPLE_CLIENT_ID` (bundle + Services ID), Apple `.p8` trio |
| **Android only** — Google | `EXPO_PUBLIC_API_URL`, `GOOGLE_CLIENT_ID_ANDROID` | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| **Web** — Google + Apple | All platform Google IDs + `APPLE_SERVICES_ID`, `EXPO_PUBLIC_APP_URL` | Google web trio + all four `APPLE_*` OAuth vars |
| **All platforms** | Full app table above | Full API table above |

---

## Native Android release build notes

Release AAB: `pnpm release:app:android` (runs `apps/app/scripts/android-release.js`).

**Env file:** only **`apps/app/.env`** is loaded for release bundles. `EXPO_PUBLIC_*` values are inlined at bundle time — rebuild after `.env` changes.

See root `AGENTS.md` for `prebuild:app:android`, signing, and `pnpm dev:app:android:signs` (SHA-1 for Google OAuth).

---

## Verification checklist

After configuring consoles and `.env`:

1. Restart API (`pnpm dev:api` or redeploy).
2. Rebuild clients if `EXPO_PUBLIC_*` changed.
3. Test **guest mode** (no sign-in) still works offline.
4. Test each platform: Google sign-in, Apple sign-in, sign out, session persists after restart.
5. Test cloud sync pull/push after linking a guest account.

---

## Android policy errors (custom URI scheme)

Munib uses **manual** redirect URIs in `oauth-config.ts` — do **not** use bare `scheme://oauth2redirect` (double-slash forms Google rejects).

| Platform | Google `redirect_uri` | Notes |
|----------|----------------------|--------|
| **Android** | `com.googleusercontent.apps.{id}:/oauthredirect` | Reversed **Android** client ID |
| **iOS** | `com.googleusercontent.apps.{id}:/oauthredirect` | From `EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS` |
| **Web** | Expo origin (HTTPS) | Web OAuth client in Google Cloud |

**Fix checklist:**

1. Google Cloud → **Android** OAuth client → **Advanced settings** → enable **Custom URI scheme**.
2. Confirm SHA-1 matches installed APK (debug vs Play signing).
3. Use a **development build** or Play install — **not** Expo Go (`exp://` redirects are rejected).
4. Add your Google account as a **Test user** while consent screen is in Testing.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|----------------|-----|
| `redirect_uri_mismatch` (Google) | Redirect URI not registered | Add exact URI to **Web** client; native uses Android/iOS clients + SHA-1 |
| `DEVELOPER_ERROR` / `invalid_client` (Google Android) | Wrong SHA-1 or package | Match OAuth client SHA-1 to installed APK; run `pnpm dev:app:android:signs` |
| Google `400 invalid_request` on Android | Custom URI scheme disabled | Enable on Android OAuth client; rebuild app |
| Google sign-in works locally, fails in production API | `GOOGLE_CLIENT_ID` / secret | Ensure API uses **web** client ID + secret for code exchange |
| Apple fails with audience mismatch | `APPLE_CLIENT_ID` incomplete | Include bundle ID **and** Services ID |
| `Apple OAuth is not configured` | Incomplete Apple OAuth env | Fill `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_SERVICES_ID`, `APPLE_PRIVATE_KEY` |
| Apple `Invalid web redirect url` | Custom scheme sent to Apple | Register `https://my.munibtracker.app/oauth/apple` on Services ID; enable App Links |
| CORS error on web sign-in | `CORS_ORIGINS` | Add exact `my.munibtracker.app` origin |
| Web returns HTML instead of JSON | `EXPO_PUBLIC_API_URL` | Point to API host with `/api/v1`, not marketing site |
| Play short description rejected | Ranking-style words | Avoid `first`, `best`, `#1` in short description — see [ANDROID_APP_COPY.md](./ANDROID_APP_COPY.md) |
| `facebook sign-in is not available` | App UI not wired | Expected — only Google/Apple buttons ship today |

---

## API routes (reference)

| Route | Body | When |
|-------|------|------|
| `POST /auth/guest` | `{ deviceId }` | First launch / resume guest |
| `POST /auth/oauth/google` | `{ code, redirectUri, codeVerifier }` or `{ idToken }` | Google sign-in |
| `POST /auth/oauth/apple` | `{ code, redirectUri, codeVerifier }` or `{ idToken }` | Apple sign-in |
| `POST /auth/oauth/facebook` | `{ code }` or `{ accessToken }` | API ready; app UI pending |
| `POST /auth/link` | `{ provider, code, … }` | Guest links provider |
| `POST /auth/refresh` | `{ refreshToken }` | Rotate session |
| `POST /auth/logout` | — | Revoke refresh token |

Implementation: `apps/api/src/auth/auth.controller.ts`, `oauth-provider.service.ts`, `apps/app/src/hooks/use-social-auth.ts`, `apps/app/src/providers/auth-provider.tsx`.
