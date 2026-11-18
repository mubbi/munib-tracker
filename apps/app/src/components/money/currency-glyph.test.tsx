import { CurrencyGlyph } from "@/components/money/currency-glyph";
import { renderWithTheme } from "@/test-support/render";

describe("CurrencyGlyph", () => {
  it.each(["AED", "SAR"] as const)("draws the %s symbol scaled to the font size", async (glyph) => {
    const { toJSON } = await renderWithTheme(
      <CurrencyGlyph glyph={glyph} size={20} color="#ff0000" />,
    );
    expect(JSON.stringify(toJSON())).toContain("RNSVGPath");
  });
});
