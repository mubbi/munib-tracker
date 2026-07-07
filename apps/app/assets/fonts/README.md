# Bundled fonts

Arabic typefaces for the app are bundled here as OFL-licensed `.ttf` files
(offline-first — no `@expo-google-fonts/*` runtime or network dependency).

## Arabic typefaces

The Arabic-font picker in **Settings → Fonts** (`ARABIC_FONT_OPTIONS` in
`src/lib/reading-typography.ts`) offers these families. `System default` always
works; the others are the bundled files below, registered at startup.

| Picker option     | `fontFamily`      | File                          | License                       | Source (`google/fonts`)      |
| ----------------- | ----------------- | ----------------------------- | ----------------------------- | ---------------------------- |
| Amiri             | `Amiri`           | `Amiri-Regular.ttf`           | `Amiri-OFL.txt`               | `ofl/amiri`                  |
| Scheherazade      | `ScheherazadeNew` | `ScheherazadeNew-Regular.ttf` | `ScheherazadeNew-OFL.txt`     | `ofl/scheherazadenew`        |
| Noto Naskh Arabic | `NotoNaskhArabic` | `NotoNaskhArabic-Regular.ttf` | `NotoNaskhArabic-OFL.txt`     | `ofl/notonaskharabic`        |
| QPC Hafs (mushaf) | `QPC_Hafs`        | `qpc-hafs.ttf`                | King Fahd Complex             | Uthmanic Hafs                |

All four ship under the SIL Open Font License (OFL 1.1); the `*-OFL.txt` files in
this folder are the required license copies.

## Registering the fonts

Fonts are registered once in `src/app/_layout.tsx` via `expo-font` `useFonts`
and the `ARABIC_FONT_FILES` map exported from `src/lib/arabic-fonts.ts`, which
`require()`s each `.ttf` in this folder. The map's keys are the `fontFamily`
values consumed by `ARABIC_FONT_OPTIONS`.

## Adding / updating a font

1. Drop the OFL `.ttf` (and its `OFL.txt`, renamed `<Family>-OFL.txt`) into this
   folder.
2. Add a `require()` + entry to `ARABIC_FONT_FILES` in `src/lib/arabic-fonts.ts`.
3. Add a matching option to `ARABIC_FONT_OPTIONS` in
   `src/lib/reading-typography.ts` (with a tuned `lineHeightRatio`) and its
   `fonts.arabicFamily.*` label in `src/i18n/{en,ur,ar}.json`.
