/**
 * The two ayahs that describe a person as munib (one who turns back to Allah),
 * cited on the About page. Copied verbatim by script from the app's bundled
 * Tanzil Uthmani text (apps/app/assets/data/quran/arabic/<sss>.json) and the
 * bundled Pickthall translation (…/translation/en-pickthall/<sss>.json) —
 * never hand-typed. `munib-ayahs.test.ts` re-checks them against those files.
 */
export const MUNIB_AYAHS = [
  {
    surah: 11,
    ayah: 75,
    arabic: "إِنَّ إِبۡرَٰهِيمَ لَحَلِيمٌ أَوَّـٰهٞ مُّنِيبٞ",
    translation: "Lo! Abraham was mild, imploring, penitent",
  },
  {
    surah: 50,
    ayah: 33,
    arabic: "مَّنۡ خَشِيَ ٱلرَّحۡمَٰنَ بِٱلۡغَيۡبِ وَجَآءَ بِقَلۡبٖ مُّنِيبٍ",
    translation: "Who feareth the Beneficent in secret and cometh with a contrite heart",
  },
] as const;
