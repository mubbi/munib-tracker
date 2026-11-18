import { screen } from "@testing-library/react-native";

import { SurahBanner } from "@/components/quran/surah-banner";
import { renderWithTheme } from "@/test-support/render";

type Props = Parameters<typeof SurahBanner>[0];

async function renderBanner(overrides: Partial<Props> = {}) {
  await renderWithTheme(<SurahBanner nameArabic="ٱلْفَاتِحَة" {...overrides} />);
}

describe("SurahBanner", () => {
  it("shows the Arabic surah name", async () => {
    await renderBanner();
    expect(screen.getByText("ٱلْفَاتِحَة")).toBeTruthy();
  });

  it.each([
    [
      { nameEnglish: "The Opening", revelationPlace: "makkah", ayahCount: 7 },
      "The Opening  ·  Makki  ·  7 ayahs",
    ],
    [{ revelationPlace: "madinah" }, "Madani"],
    [{ ayahCount: 286 }, "286 ayahs"],
  ] as const)("builds the sub-line from %j", async (overrides, subLine) => {
    await renderBanner(overrides);
    expect(screen.getByText(subLine)).toBeTruthy();
  });

  it("omits the sub-line when nothing is provided", async () => {
    await renderBanner();
    expect(screen.queryByText(/ayahs|Makki|Madani/)).toBeNull();
  });
});
