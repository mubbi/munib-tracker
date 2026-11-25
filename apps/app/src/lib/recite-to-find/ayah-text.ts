/**
 * Bundled Uthmani text for a found ayah (never typed scripture). `@/lib/quran`
 * is loaded on demand so the search screens' first load stays light.
 */

type QuranModule = Pick<typeof import("@/lib/quran"), "getSurahAyahs">;

let quranModuleForTests: QuranModule | undefined;

/** Jest-only: inject the Qur'an module so dynamic `import()` is not needed in tests. */
export function __setQuranModuleForReciteTests(mod: QuranModule | undefined): void {
  quranModuleForTests = mod;
}

async function quranModule(): Promise<QuranModule> {
  return quranModuleForTests ?? import("@/lib/quran");
}

/** Arabic of `surah:ayah` from the bundled mushaf text, or "" when unknown. */
export async function loadAyahArabic(surah: number, ayah: number): Promise<string> {
  try {
    const { getSurahAyahs } = await quranModule();
    return getSurahAyahs(surah).find((a) => a.ayah === ayah)?.arabic ?? "";
  } catch {
    return "";
  }
}
