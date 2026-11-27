import { __setQuranModuleForReciteTests, loadAyahArabic } from "./ayah-text";

afterEach(() => __setQuranModuleForReciteTests(undefined));

describe("loadAyahArabic", () => {
  it("reads the bundled ayah text", async () => {
    __setQuranModuleForReciteTests({
      getSurahAyahs: (surah: number) =>
        [{ surah, ayah: 1, arabic: "قُلْ" }] as ReturnType<
          typeof import("@/lib/quran").getSurahAyahs
        >,
    });
    await expect(loadAyahArabic(112, 1)).resolves.toBe("قُلْ");
    await expect(loadAyahArabic(112, 9)).resolves.toBe("");
  });

  it("never throws when the text cannot load", async () => {
    __setQuranModuleForReciteTests({
      getSurahAyahs: () => {
        throw new Error("missing chunk");
      },
    });
    await expect(loadAyahArabic(1, 1)).resolves.toBe("");
  });
});
