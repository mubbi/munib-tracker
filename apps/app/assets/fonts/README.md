# Bundled fonts

Drop bundled font files here (NF-1.31 Arabic typeface picker).

## Arabic typefaces

The Arabic-font picker in **Settings → Fonts** (`ARABIC_FONT_OPTIONS` in
`src/lib/reading-typography.ts`) offers these families. `System default` always
works; the others are loaded at startup from `@expo-google-fonts/*` packages
(see `src/lib/arabic-fonts.ts` and `src/app/_layout.tsx`).

| Picker option | `fontFamily` | Package |
|---------------|--------------|---------|
| Amiri | `Amiri` | `@expo-google-fonts/amiri` |
| Scheherazade | `ScheherazadeNew` | `@expo-google-fonts/scheherazade-new` |
| Noto Naskh Arabic | `NotoNaskhArabic` | `@expo-google-fonts/noto-naskh-arabic` |

## Registering the fonts

Fonts are registered once in `src/app/_layout.tsx` via `expo-font` `useFonts`
and the map exported from `src/lib/arabic-fonts.ts`. The `fontFamily` keys must
match the `fontFamily` values in `ARABIC_FONT_OPTIONS`.
