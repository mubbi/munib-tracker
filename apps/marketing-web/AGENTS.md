<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Marketing site (`apps/marketing-web`)

Next.js 16 landing site (port **3000**). Full setup notes: [`README.md`](./README.md).

## Product copy

Feature pillars and home highlights come from `@munib-tracker/shared/constants` (`APP_FEATURE_PILLARS`, `APP_HOME_FEATURES`). When product features ship or backlog items land, update those constants — do not hardcode divergent marketing claims in page components.

Store badges and download CTAs use `OFFICIAL_IOS_APP_STORE_URL` / `OFFICIAL_ANDROID_PLAY_STORE_URL` from the same package (App Store ID `6787222180`, Play package `app.munibtracker`).

Shipped catalog: [`docs/FEATURES.md`](../../docs/FEATURES.md) · open work: [`docs/BACKLOG.md`](../../docs/BACKLOG.md).

## Analytics & consent

Optional GA4 (`NEXT_PUBLIC_GA_MEASUREMENT_ID`). Consent Mode v2 defaults deny storage; `CookieConsentBanner` updates consent and persists preferences in `localStorage` (footer can reopen prefs). Details in [`README.md`](./README.md) and the privacy page.
