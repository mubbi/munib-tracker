# OAuth setup (Google, Apple & Facebook)

Guide for **Sign in with Google**, **Sign in with Apple**, and **Sign in with Facebook** on **web**, **iOS**, and **Android** for Munib Tracker. Use this for first-time console setup, production env configuration, and debugging.

**Related:** [`apps/app/.env.example`](../apps/app/.env.example) · [`apps/api/.env.example`](../apps/api/.env.example) · [DEEP_LINKS.md](./DEEP_LINKS.md) · [`apps/api/AGENTS.md`](../apps/api/AGENTS.md) · [ADMIN.md](./ADMIN.md) (ops console Google OAuth — separate clients)

---

## How sign-in works in this repo

The Expo app uses **`expo-auth-session`** with **PKCE** (and **`expo-apple-authentication`** on iOS). The NestJS API validates tokens / exchanges codes and issues JWT access + refresh tokens. On **web**, Google/Apple sessions use **HttpOnly cookies** (`mt_access_token`, `mt_refresh_token`) when the client sends `x-munib-tracker-client: web`.

**Web popups:** Google/Facebook open a browser popup that redirects back to the product origin with `?code=&state=`. `WebBrowser.maybeCompleteAuthSession()` (via `apps/app/src/lib/auth/auth-session-bootstrap.ts`, same pattern as Expense Trail) must run on that page — otherwise the popup stays open and the opener never receives the auth result.

The **admin console** (`apps/admin`) is a different app: its own Google OAuth web client, cookie `mt_admin_session`, and allowlist table `admin_users`. Do not reuse product `GOOGLE_OAUTH_*` / `EXPO_PUBLIC_GOOGLE_*` for admin — see [Admin Google OAuth](#admin-google-oauth-ops-console) below.

| Platform | Google | Apple | Facebook |
|----------|--------|-------|----------|
| **Web** | PKCE code → `POST /auth/google/oauth` (API holds web secret) | `form_post` → API callback → cookies | PKCE → `POST /auth/oauth/facebook` |
| **iOS** | On-device code exchange → `POST /auth/google` `{ accessToken }` | Native sheet → `POST /auth/apple` `{ identityToken }` | PKCE → `POST /auth/oauth/facebook` |
| **Android** | Same as iOS | Services ID PKCE → HTTPS App Link → `POST /auth/apple/oauth` | PKCE → `POST /auth/oauth/facebook` |

**Guest mode** works without any OAuth configuration — full offline functionality, optional sign-in for cloud sync.

Social buttons only render for providers that have client env configured (`EXPO_PUBLIC_GOOGLE_CLIENT_ID*`, `EXPO_PUBLIC_APPLE_SERVICES_ID` or native Apple, `EXPO_PUBLIC_FACEBOOK_APP_ID`).

---

## Identifier cheat sheet (do not mix these up)

| Value | Example | Where it lives | Used for |
|-------|---------|----------------|----------|
| **iOS bundle ID** (App ID) | `app.munibtracker` | App Store Connect, Apple **App ID**, `app.json`, `EXPO_PUBLIC_APP_IDENTIFIER` | Native iOS app, Apple JWT `aud`, Google **iOS** OAuth client |
| **Android package** | `app.munibtracker` | Play Console, `app.json` | Google **Android** OAuth client + SHA-1 |
| **Apple Team ID** | *(your 10-char ID)* | Apple Developer → Membership | `APPLE_TEAM_ID` on API |
| **Apple Services ID** | `com.munibtracker.web` | Apple → Identifiers → **Services IDs** (must differ from bundle ID) | `APPLE_SERVICES_ID`, `EXPO_PUBLIC_APPLE_SERVICES_ID`, web/Android Apple OAuth |
| **Google client IDs** | `….apps.googleusercontent.com` | Google Cloud → Credentials (three clients) | Per-platform `EXPO_PUBLIC_GOOGLE_CLIENT_ID_*` + `GOOGLE_OAUTH_CLIENT_IDS` on API |

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
| **Web application** | Expo web (`my.munibtracker.app`) | `EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB`, `GOOGLE_OAUTH_WEB_CLIENT_ID` + `GOOGLE_OAUTH_WEB_CLIENT_SECRET` on API |
| **iOS** | iPhone/iPad app | `EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS` |
| **Android** | Android app | `EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID` |

**Android OAuth (one SHA-1 per client ID)** — Google allows only **one SHA-1 per Android OAuth client**. Create **separate** Android clients for debug vs Play signing (same package `app.munibtracker`).

Put **all** platform client IDs in `GOOGLE_OAUTH_CLIENT_IDS` on the API as a comma-separated list so native access-token `azp`/`aud` validate. Optionally set `GOOGLE_OAUTH_WEB_CLIENT_ID` to the web client used for the secret exchange (defaults to the first `GOOGLE_OAUTH_CLIENT_IDS` entry).

**Web client** needs:

- **Authorized JavaScript origins:** e.g. `https://my.munibtracker.app`, `http://localhost:8081` (dev).
- **Authorized redirect URIs:** match [Expo redirect patterns](https://docs.expo.dev/guides/authentication/#redirect-uri-patterns) for dev and production web origins.

**Never** put the Google **client secret** in the Expo app — API only.

### 3. Native redirect URI (Custom URI scheme)

On native, `getGoogleRedirectUri()` uses:

```
com.googleusercontent.apps.{android-or-ios-client-id}:/oauth2redirect
```

Enable **Custom URI scheme** on each **Android** OAuth client. The app exchanges the code **on device**, then POSTs the access token to `/auth/google` (the web secret is never involved on native).

Authorized redirect URI shape (must match exactly):

```
com.googleusercontent.apps.{android-or-ios-client-id}:/oauth2redirect
```

`app.config.js` registers the reversed iOS scheme (`CFBundleURLTypes`) and Android intent filter for that path when `EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS` / `_ANDROID` are set — re-run prebuild after changing client IDs.

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
  - **Return URLs (https only):**  
    `https://my.munibtracker.app/oauth/apple` (**required for Android** App Links)  
    `https://api.munibtracker.app/api/v1/auth/apple/oauth/callback` (**web form_post**)  
    **Do not** register `munib-tracker://` — Apple rejects custom URI schemes as web redirect URLs.

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

## Facebook Developer

1. Create an app at [developers.facebook.com](https://developers.facebook.com/) → **Facebook Login**.
2. Add **Valid OAuth Redirect URIs** matching `getFacebookRedirectUri()` (web origin or `munib-tracker:/oauth2redirect`).
3. Copy the **App ID** to `EXPO_PUBLIC_FACEBOOK_APP_ID` (app) and `FACEBOOK_APP_ID` (API).
4. Copy the **App Secret** to `FACEBOOK_APP_SECRET` on the API only — never ship it in the Expo bundle.
5. The Facebook button appears only when `EXPO_PUBLIC_FACEBOOK_APP_ID` is set.

---

## Environment variables

`EXPO_PUBLIC_*` values are **embedded at build time** — rebuild native apps and web after changes.

### App (`apps/app/.env`)

| Variable | Required | Notes |
|----------|----------|-------|
| `EXPO_PUBLIC_API_URL` | Yes (prod) | API base including `/api/v1`, e.g. `https://api.munibtracker.app/api/v1` |
| `EXPO_PUBLIC_SITE_URL` | Recommended | Marketing site for Privacy/Terms links |
| `EXPO_PUBLIC_APP_URL` / `EXPO_PUBLIC_WEB_APP_ORIGIN` | Web / App Links | Product web origin (`https://my.munibtracker.app`) |
| `EXPO_PUBLIC_APP_IDENTIFIER` | iOS Apple | Bundle ID (`app.munibtracker`) |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB` | Web Google | Web OAuth client ID |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS` | iOS Google | iOS OAuth client ID |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID` | Android Google | Android OAuth client ID |
| `EXPO_PUBLIC_GOOGLE_CLIENT_ID` | Fallback | Used if platform override unset |
| `EXPO_PUBLIC_APPLE_SERVICES_ID` | Web/Android Apple | Same string as `APPLE_SERVICES_ID` on API |
| `EXPO_PUBLIC_FACEBOOK_APP_ID` | Facebook | Same as `FACEBOOK_APP_ID` on API |

### API (`apps/api/.env`)

| Variable | Required when | Notes |
|----------|---------------|-------|
| `GOOGLE_OAUTH_CLIENT_IDS` | Production Google | Comma/space-separated audiences (Web + iOS + Android client ids) |
| `GOOGLE_OAUTH_WEB_CLIENT_ID` | Optional | Web client for code exchange; defaults to first `GOOGLE_OAUTH_CLIENT_IDS` |
| `GOOGLE_OAUTH_WEB_CLIENT_SECRET` | Production Google (web) | Web client secret only |
| `OAUTH_REDIRECT_URI_ALLOWLIST` | Production code exchange | Web origins, App Links, Google schemes, Apple API callback |
| `APPLE_CLIENT_IDS` | Production Apple | Comma/space-separated audiences, e.g. `app.munibtracker,com.munibtracker.web` |
| `APPLE_CLIENT_ID` | Legacy | Single audience if `APPLE_CLIENT_IDS` unset |
| `APPLE_SERVICES_ID` | Web/Android Apple OAuth | Services ID identifier |
| `APPLE_TEAM_ID` / `APPLE_KEY_ID` / `APPLE_PRIVATE_KEY` | Web/Android Apple OAuth | `.p8` trio |
| `CORS_ORIGINS` | Production | Include product web + marketing origins (credentialed CORS) |
| `FACEBOOK_APP_ID` / `FACEBOOK_APP_SECRET` | Facebook | App ID matches Expo; secret API-only |

**`APPLE_PRIVATE_KEY` format** (one line; code replaces `\n` with newlines):

```env
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n<base64 body>\n-----END PRIVATE KEY-----
```

### Production example (replace client IDs)

```env
# apps/app/.env
EXPO_PUBLIC_API_URL=https://api.munibtracker.app/api/v1
EXPO_PUBLIC_SITE_URL=https://munibtracker.app
EXPO_PUBLIC_WEB_APP_ORIGIN=https://my.munibtracker.app
EXPO_PUBLIC_APP_IDENTIFIER=app.munibtracker
EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB=<web-client-id>.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS=<ios-client-id>.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID=<android-client-id>.apps.googleusercontent.com
EXPO_PUBLIC_APPLE_SERVICES_ID=com.munibtracker.web

# apps/api/.env
GOOGLE_OAUTH_CLIENT_IDS=<web>,<ios>,<android>
GOOGLE_OAUTH_WEB_CLIENT_ID=<web-client-id>.apps.googleusercontent.com
GOOGLE_OAUTH_WEB_CLIENT_SECRET=<web-secret>
OAUTH_REDIRECT_URI_ALLOWLIST=https://my.munibtracker.app,https://my.munibtracker.app/oauth/apple,https://api.munibtracker.app/api/v1/auth/apple/oauth/callback,com.googleusercontent.apps.<android>:/oauth2redirect,com.googleusercontent.apps.<ios>:/oauth2redirect
APPLE_CLIENT_IDS=app.munibtracker,com.munibtracker.web
APPLE_SERVICES_ID=com.munibtracker.web
APPLE_TEAM_ID=<team-id>
APPLE_KEY_ID=<key-id>
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
CORS_ORIGINS=https://my.munibtracker.app,https://munibtracker.app,http://localhost:8081
```

---

## Auth API routes (Google / Apple)

| Method | Path | Client |
|--------|------|--------|
| `POST` | `/auth/google` | Native — `{ accessToken }` |
| `POST` | `/auth/google/oauth` | Web — `{ code, redirectUri, codeVerifier }` |
| `POST` | `/auth/apple` | iOS native — `{ identityToken, displayName? }` |
| `POST` | `/auth/apple/oauth` | Android — `{ code, redirectUri, codeVerifier }` |
| `POST` | `/auth/apple/oauth/session` | Web — store PKCE cookie before Apple authorize |
| `POST` | `/auth/apple/oauth/callback` | Apple `form_post` → set cookies → 302 |
| `POST` | `/auth/oauth/facebook` | Facebook PKCE (unchanged) |

Web responses omit tokens from the JSON body (cookies only + `{ user }`). Native responses return the full `AuthSessionResponseDto`.

---

## Minimum config by what you ship

| Ship | App env | API env |
|------|---------|---------|
| **iOS only** — Google + Apple | `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS`, `EXPO_PUBLIC_APP_IDENTIFIER` | `GOOGLE_OAUTH_CLIENT_IDS` (iOS + web ids), `APPLE_CLIENT_IDS` (bundle id) |
| **Android only** — Google | `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID` | `GOOGLE_OAUTH_CLIENT_IDS` |
| **Android** — Google + Apple | Above + `EXPO_PUBLIC_APPLE_SERVICES_ID`, `EXPO_PUBLIC_WEB_APP_ORIGIN` | Above + `APPLE_CLIENT_IDS` (bundle + Services ID), Apple `.p8` trio, allowlist |
| **Web** — Google + Apple | Google web ID + `EXPO_PUBLIC_APPLE_SERVICES_ID`, `EXPO_PUBLIC_WEB_APP_ORIGIN` | Google web trio + all four `APPLE_*` OAuth vars + `OAUTH_REDIRECT_URI_ALLOWLIST` |
| **All platforms** | Full app table above | Full API table above |

---

## Native Android release notes

Release AAB: `pnpm release:app:android`. Only **`apps/app/.env`** is loaded for release bundles — `EXPO_PUBLIC_*` values are inlined at bundle time; rebuild after `.env` changes.

SHA-1 for Google Android OAuth clients: `pnpm dev:app:android:signs` (see root `AGENTS.md`).

---

## Code map

| Layer | Path |
|-------|------|
| App OAuth orchestration | `apps/app/src/hooks/use-social-auth.ts` |
| Redirect URIs / client IDs | `apps/app/src/lib/auth/oauth-config.ts` |
| Native Apple | `apps/app/src/lib/auth/appleAuth.ios.ts` |
| PKCE pending + Google on-device exchange | `apps/app/src/lib/oauth/` |
| Session store (cookie marker on web) | `apps/app/src/auth/session-store.ts` |
| Auth provider | `apps/app/src/providers/auth-provider.tsx` |
| API routes | `apps/api/src/auth/auth.controller.ts` |
| Cookie + form_post helpers | `apps/api/src/auth/auth-cookies.ts`, `apple-oauth-session-cookie.ts`, `auth-oauth.service.ts` |
| Provider exchange | `apps/api/src/auth/oauth-provider.service.ts`, `google-access-token.ts` |
| Env schema | `apps/api/src/config/env.schema.ts` |

---

## Admin Google OAuth (ops console)

Separate from product sign-in. Full ops guide: [`ADMIN.md`](./ADMIN.md).

| Item | Value |
|------|-------|
| App | `apps/admin` → https://admin.munibtracker.app |
| Env | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` in `apps/admin/.env.local` (not `GOOGLE_OAUTH_*`) |
| Redirect URI | `${ADMIN_URL}/api/auth/callback/google` (prod: `https://admin.munibtracker.app/api/auth/callback/google`) |
| Access | Email must be in `admin_users` with `enabled = true` |
| Session cookie | `mt_admin_session` (`ADMIN_SESSION_SECRET`) |
| Sign-in reveal | `?iAmAdmin=1` or `iAmAdmin()` in the browser console |

Create a dedicated Google Cloud **Web** OAuth client for the admin origin (or add the redirect URI to an existing web client used only for ops). Seed operators with `node apps/admin/scripts/seed-admin.mjs you@example.com`.

---

## Troubleshooting

| Symptom | Check |
|---------|-------|
| Google works on web, fails on native | Native must use on-device exchange + `/auth/google`; do not send native codes to `/auth/google/oauth` |
| Google access token rejected | `GOOGLE_OAUTH_CLIENT_IDS` must include the platform client that minted the token |
| Apple fails with audience mismatch | `APPLE_CLIENT_IDS` must include bundle ID **and** Services ID |
| Apple Android never returns | HTTPS App Link `https://my.munibtracker.app/oauth/apple` + Digital Asset Links (see [DEEP_LINKS.md](./DEEP_LINKS.md)) |
| Web Apple form_post loses session | `mt_apple_oauth` cookie needs SameSite=None in prod; CORS credentials + allowlist |
| Web session lost on reload | Cookie path/domain; `credentials: 'include'`; `CORS_ORIGINS` includes the web origin |
| Web Google/Facebook popup shows `?code=` but main tab stays on “signing in” | Missing `WebBrowser.maybeCompleteAuthSession()` on the redirect page (`auth-session-bootstrap.ts` must load from app entry / AuthProvider) |
| Social buttons missing | Empty `EXPO_PUBLIC_*` client IDs — buttons are hidden until configured |
| Env renamed from older Munib installs | Old `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `APPLE_CLIENT_ID` → new sample names in the tables above |
| Admin Google sign-in rejected | Email not in `admin_users` or `enabled = false`; wrong redirect URI; using product OAuth client IDs on admin |