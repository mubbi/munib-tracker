# Pamphlets (`tools/pamphlets`)

Print-ready **A4** advertisement / pamphlet concepts for Munib Tracker. Plain static HTML + CSS — no framework, no build step. Lives **outside the pnpm workspace** (own `package.json` + `package-lock.json`; install with npm).

## Layout

| Path                                            | Contents                                                                                                          |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `01-the-return.html` … `05-never-too-late.html` | One concept per file (one A4 page each)                                                                           |
| `base.css`                                      | Shared page size, brand tokens, typography (Google Fonts: Inter, Plus Jakarta Sans, Amiri)                        |
| `assets/`                                       | Logo + light/dark app screenshots                                                                                 |
| `qr/`                                           | Generated QR SVGs (`appstore` / `play` / `web`, each in `-ink` and `-black` variants)                             |
| `scripts/make-qr.mjs`                           | Regenerates `qr/` from the official store / site URLs (keep in sync with `packages/shared/src/constants/site.ts`) |
| `scripts/render.mjs`                            | Exports each concept to PDF + PNG via headless Chrome                                                             |

## Usage

```bash
cd tools/pamphlets
npm install
npm run qr                         # rewrite qr/*.svg
npm run render                     # all concepts → dist/<name>.pdf + dist/<name>.png
npm run render -- 03-never-lose-count   # specific concept(s), by file name without .html
```

Preview a concept by opening its HTML file in a browser.

Output goes to `tools/pamphlets/dist/` (gitignored): an A4 PDF with backgrounds and no margins, plus a 3× (~288 dpi) PNG preview.

`render.mjs` uses `puppeteer-core` with your installed Chrome: it checks `CHROME_PATH` (or `PUPPETEER_EXECUTABLE_PATH`), then the standard Chrome/Chromium install paths on macOS, Linux and Windows.
