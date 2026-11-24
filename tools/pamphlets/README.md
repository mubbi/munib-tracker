# Pamphlets (`tools/pamphlets`)

Print-ready **A4** advertisement / pamphlet concepts for Munib Tracker. Plain static HTML + CSS — no framework, no build step. Lives **outside the pnpm workspace** (own `package.json` + `package-lock.json`; install with npm).

## Layout

| Path                                            | Contents                                                                                                 |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `01-the-return.html` … `05-never-too-late.html` | One concept per file (one A4 page each)                                                                  |
| `base.css`                                      | Shared page size, safe area, print type scale, brand tokens, store badge / devices / privacy / CTA copy  |
| `assets/`                                       | Logo, light/dark app screenshots, and the store-badge marks (`badge-apple.svg`, `badge-google-play.svg`) |
| `qr/`                                           | Generated QR SVGs (`appstore-ink` / `play-ink` / `web-ink`, brand ink on transparent)                    |
| `scripts/make-qr.mjs`                           | Regenerates `qr/`, reading the official URLs from `packages/shared/src/constants/site.ts`                |
| `scripts/render.mjs`                            | Exports each concept to PDF + PNG via headless Chrome, with a print preflight                            |

## Usage

```bash
cd tools/pamphlets
npm install
npm run qr                         # rewrite qr/*.svg
npm run render                     # all concepts → dist/<name>.pdf + dist/<name>.png
npm run render -- 03-never-lose-count   # specific concept(s), by file name without .html
```

`npm run render` picks up every numbered `NN-*.html` file, so a new concept only needs the next number.

Preview a concept by opening its HTML file in a browser.

Output goes to `tools/pamphlets/dist/` (gitignored): an A4 PDF with backgrounds and no margins, plus a 3× (~288 dpi) PNG preview.

`render.mjs` uses `puppeteer-core` with your installed Chrome: it checks `CHROME_PATH` (or `PUPPETEER_EXECUTABLE_PATH`), then the standard Chrome/Chromium install paths on macOS, Linux and Windows, and finally Microsoft Edge on Windows.

## Print rules

- **Trim:** A4, 210 × 297 mm, no bleed. Backgrounds run to the trim edge. If a print shop asks for bleed (usually 3 mm), extend the edge colours in their artwork setup or ask them to scale to fit; nothing important sits near the edge.
- **Safe area:** all text, QR codes and badges stay at least **15 mm** (`--safe`) inside the trim.
- **Type:** nothing below **9 pt** (`--fs-min`, 12 px); running copy is about 10 pt (`--fs-body`) and intros 12 pt (`--fs-lead`). The only exception is the "Download on the / Get it on" line inside a store badge, which mirrors the official badge artwork.
- **QR codes:** printed at about 22 mm with a white quiet zone; they point at `OFFICIAL_IOS_APP_STORE_URL`, `OFFICIAL_ANDROID_PLAY_STORE_URL` and `OFFICIAL_SITE_ORIGIN`.
- **Preflight:** `render.mjs` warns (`! name: …`) about text under 9 pt, text, QR codes or badges outside the safe area, and web fonts that failed to load. Fix every warning before sending a file to print.

## Content rules

- Feature claims and counts come from `packages/shared/src/constants/features.ts`, `apps/marketing-web/src/content/munib-features.ts` and the "Verified Munib Tracker facts" in `apps/marketing-web/src/content/resources/ARTICLE_BRIEF.md`. Don't claim anything that isn't there (for example, there is no hadith audio). No ratings, reviews or testimonials.
- Use the app's terms: Salah, Zikr, Qaza, Tasbeeh, Masjid.
- Arabic is copied verbatim from bundled sources, never typed: Qur'an text from `apps/app/assets/data/quran/arabic/*.json` (translations from the bundled `translation/` editions, credited), and UI Arabic such as مُنيب or the tagline from `apps/app/src/i18n/ar.json`.
- The brand wordmark مُنيب uses Noto Naskh Arabic (`.ar-brand`); Qur'an text uses Amiri (`.ar`).
