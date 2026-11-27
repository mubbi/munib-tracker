/**
 * The two ayahs that describe a person as munib (one who turns back to Allah),
 * cited on the About page. Copied verbatim by script from the app's bundled
 * Tanzil Uthmani text (apps/app/assets/data/quran/arabic/<sss>.json) and the
 * bundled Pickthall (…/translation/en-pickthall/<sss>.json) and Fateh Muhammad
 * Jalandhry (…/translation/ur-jalandhry/<sss>.json) translations — never
 * hand-typed. Arabic pages show the Arabic alone. `munib-ayahs.test.ts` re-checks them against those files.
 */
export const MUNIB_AYAHS = [
  {
    surah: 11,
    ayah: 75,
    arabic: "إِنَّ إِبۡرَٰهِيمَ لَحَلِيمٌ أَوَّـٰهٞ مُّنِيبٞ",
    translation: "Lo! Abraham was mild, imploring, penitent",
    translationUr: "بےشک ابراہیم بڑے تحمل والے، نرم دل اور رجوع کرنے والے تھے",
  },
  {
    surah: 50,
    ayah: 33,
    arabic: "مَّنۡ خَشِيَ ٱلرَّحۡمَٰنَ بِٱلۡغَيۡبِ وَجَآءَ بِقَلۡبٖ مُّنِيبٍ",
    translation: "Who feareth the Beneficent in secret and cometh with a contrite heart",
    translationUr: "جو خدا سے بن دیکھے ڈرتا ہے اور رجوع لانے والا دل لے کر آیا",
  },
] as const;

/** The meaning shown beside the Arabic in `locale` (none in Arabic). */
export function munibAyahTranslation(
  ayah: (typeof MUNIB_AYAHS)[number],
  locale: string,
): string | undefined {
  if (locale === "ar") return undefined;
  return locale === "ur" ? ayah.translationUr : ayah.translation;
}
