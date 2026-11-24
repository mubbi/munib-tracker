import { calculateMirath, type MirathInput } from "@munib-tracker/shared/mirath";
import { screen } from "@testing-library/react-native";

import { renderWithTheme } from "@/test-support/render";

import { MirathResultView } from "./mirath-results";

const male = (heirs: MirathInput["heirs"], estate: MirathInput["estate"]): MirathInput => ({
  school: "hanafi",
  deceased: { gender: "male" },
  heirs,
  estate,
});
const usd = (gross: number, debts = 0) => ({
  gross,
  funeral: 0,
  debts,
  bequests: 0,
  currency: "USD",
});

describe("MirathResultView", () => {
  it("explains debts above the estate instead of showing every heir 0", async () => {
    const result = calculateMirath(male({ son: 2 }, usd(100, 150)));
    await renderWithTheme(<MirathResultView result={result} school="hanafi" currency="USD" />);
    expect(screen.getByText(/more than the estate/i)).toBeTruthy();
    expect(screen.queryByText(/each\)/)).toBeNull();
  });

  it("shows a per-head range when the cents don't divide evenly", async () => {
    // Four wives share ⅛ of 100 = 12.50 → 3.12–3.13 each (not 4 × 3.12).
    const result = calculateMirath(male({ wife: 4, son: 1 }, usd(100)));
    await renderWithTheme(<MirathResultView result={result} school="hanafi" currency="USD" />);
    expect(screen.getByText(/3\.12.*3\.13 each/)).toBeTruthy();
    expect(screen.queryByText(/more than the estate/i)).toBeNull();
  });

  it("shows the residuary base (3 sons → base 3) with no corrected line", async () => {
    const result = calculateMirath(male({ son: 3 }, undefined));
    await renderWithTheme(<MirathResultView result={result} school="hanafi" />);
    expect(screen.getByText("Base 3")).toBeTruthy();
    expect(screen.queryByText(/Corrected base/)).toBeNull();
  });
});
