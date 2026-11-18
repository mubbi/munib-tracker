import type { HadithIsnadLink } from "@munib-tracker/shared/types";
import { screen } from "@testing-library/react-native";

import { HadithIsnadChain } from "@/components/hadith/hadith-isnad-chain";
import { renderWithTheme } from "@/test-support/render";

const isnad: HadithIsnadLink[] = [
  { order: 2, nameArabic: "عمر", nameEnglish: "Umar", role: "companion" },
  { order: 3, nameArabic: "النبي", nameEnglish: "The Prophet ﷺ", role: "prophet" },
  { order: 1, nameArabic: "علقمة" },
];

describe("HadithIsnadChain", () => {
  it("renders nothing for an empty chain", async () => {
    await renderWithTheme(<HadithIsnadChain isnad={[]} />);
    expect(screen.queryByLabelText("Isnad")).toBeNull();
  });

  it("orders the chain and prefers English names", async () => {
    await renderWithTheme(<HadithIsnadChain isnad={isnad} />);
    const names = screen.getAllByText(/Umar|Prophet|علقمة/).map((node) => node.props.children);
    expect(names).toEqual(["علقمة", "Umar", "The Prophet ﷺ"]);
  });

  it("shows Arabic names when preferred", async () => {
    await renderWithTheme(<HadithIsnadChain isnad={isnad} preferArabic />);
    expect(screen.getByText("عمر")).toBeTruthy();
    expect(screen.queryByText("Umar")).toBeNull();
  });
});
