# Bundled fonts

Arabic typefaces for the app are bundled here as OFL-licensed `.ttf` files
(offline-first — no `@expo-google-fonts/*` runtime or network dependency).

## Arabic typefaces

The Arabic-font picker in **Settings → Fonts** (`ARABIC_FONT_OPTIONS` in
`src/lib/reading-typography.ts`) offers these families. `System default` always
works; the others are the bundled files below, loaded on demand (see below).

| Picker option        | `fontFamily`         | File                             | License                      | Source (`google/fonts`)  |
| -------------------- | -------------------- | -------------------------------- | ---------------------------- | ------------------------ |
| Amiri                | `Amiri`              | `Amiri-Regular.ttf`              | `Amiri-OFL.txt`              | `ofl/amiri`              |
| Scheherazade         | `ScheherazadeNew`    | `ScheherazadeNew-Regular.ttf`    | `ScheherazadeNew-OFL.txt`    | `ofl/scheherazadenew`    |
| Noto Naskh Arabic    | `NotoNaskhArabic`    | `NotoNaskhArabic-Regular.ttf`    | `NotoNaskhArabic-OFL.txt`    | `ofl/notonaskharabic`    |
| QPC Hafs (mushaf)    | `QPC_Hafs`           | `qpc-hafs.ttf`                   | King Fahd Complex            | Uthmanic Hafs            |
| Noto Sans Bengali    | `NotoSansBengali`    | `NotoSansBengali-Regular.ttf`    | `NotoSansBengali-OFL.txt`    | `ofl/notosansbengali`    |
| Noto Sans Devanagari | `NotoSansDevanagari` | `NotoSansDevanagari-Regular.ttf` | `NotoSansDevanagari-OFL.txt` | `ofl/notosansdevanagari` |

Amiri, Scheherazade, Noto Naskh Arabic and the two Indic families ship under the SIL Open Font
License (OFL 1.1); the `*-OFL.txt` files in this folder are the required license copies. QPC Hafs is
the King Fahd Complex Uthmanic Hafs font (bundled for mushaf mode; not OFL).

## QCF V2 per-page mushaf fonts (not bundled)

Mushaf layout mode uses **604 page-specific** QCF V2 fonts (~350 KB each) plus one
shared **QCF2BSML** basmala font (~300 KB). They are **not** shipped in the app
binary. Each font is downloaded on first view and cached locally via
`src/lib/qcf-font-cache.ts` (cleared from Settings → Offline data → Mushaf page
fonts). Source: [nuqayah/qpc-fonts](https://github.com/nuqayah/qpc-fonts).

## Registering the fonts

Fonts are **not** loaded at startup. `useDeferredReadingFonts()` in `src/app/_layout.tsx`
waits for preferences to hydrate, then `Font.loadAsync()`s only what is needed: the selected
Arabic family from `ARABIC_FONT_FILES` (`src/lib/arabic-font-files.ts`, dynamically imported so
the TTFs stay out of the root bundle graph), and `BENGALI_FONT_FILES` / `DEVANAGARI_FONT_FILES`
(`src/lib/bengali-fonts.ts`, `src/lib/devanagari-fonts.ts`) only for `bn` / `hi`. Each map
`require()`s its `.ttf` from this folder. (`src/lib/arabic-fonts.ts` holds the QCF V2 CDN helpers.)
Indic scripts use `resolveTranslationFontFamily()` in
`src/lib/reading-typography.ts` when the user's locale script is Bengali or Devanagari.

## Adding / updating a font

1. Drop the OFL `.ttf` (and its `OFL.txt`, renamed `<Family>-OFL.txt`) into this
   folder.
2. Add a `require()` + entry to `ARABIC_FONT_FILES` in `src/lib/arabic-font-files.ts` (key = `fontFamily`).
3. Add a matching option to `ARABIC_FONT_OPTIONS` in
   `src/lib/reading-typography.ts` (with a tuned `lineHeightRatio`) and its
   `fonts.arabicFamily.*` label in every `src/i18n/<locale>.json` (24 locales).
