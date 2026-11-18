import { screen } from "@testing-library/react-native";

import { MoneyText } from "@/components/money/money-text";
import { renderWithTheme } from "@/test-support/render";

describe("MoneyText", () => {
  it("renders plain amounts as text", async () => {
    await renderWithTheme(<MoneyText accessibilityLabel="Total">$12</MoneyText>);
    expect(screen.getByText("$12")).toBeTruthy();
    expect(screen.getByLabelText("Total")).toBeTruthy();
  });

  it("swaps a SAR symbol for the vector glyph and keeps surrounding text", async () => {
    const { toJSON } = await renderWithTheme(
      <MoneyText style={{ fontSize: 20, color: "#123456", marginTop: 4 }} accessibilityLabel="Due">
        {"ر.س1,234.56"}
      </MoneyText>,
    );
    expect(screen.getByText("1,234.56")).toBeTruthy();
    expect(JSON.stringify(toJSON())).toContain("RNSVGPath");
    expect(screen.getByLabelText("Due")).toBeTruthy();
  });

  it("renders text before the glyph and defaults the size", async () => {
    await renderWithTheme(<MoneyText>{"≈ د.إ"}</MoneyText>);
    expect(screen.getByText("≈ ")).toBeTruthy();
  });
});
