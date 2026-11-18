import { fireEvent, screen } from "@testing-library/react-native";

import { ZakatSummaryBar } from "@/components/zakat/zakat-summary-bar";
import { buildZakatResult } from "@/test-support/fixtures/zakat";
import { setMockLiquidGlass } from "@/test-support/mocks/glass-surface";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/components/ui/glass-surface", () =>
  require("@/test-support/mocks/glass-surface").glassSurfaceWithComponentMock(),
);

type Props = Parameters<typeof ZakatSummaryBar>[0];

async function renderBar(overrides: Partial<Props> = {}) {
  const props: Props = {
    result: buildZakatResult({ netWealth: 1000, meetsNisab: true, totalDue: 25 }),
    money: (n: number) => `$${n}`,
    hasInput: true,
    effectiveNisab: 600,
    currencyCode: "USD",
    resetForm: jest.fn(),
    onHeightChange: jest.fn(),
    ...overrides,
  };
  await renderWithTheme(<ZakatSummaryBar {...props} />);
  return props;
}

describe("ZakatSummaryBar", () => {
  afterEach(() => setMockLiquidGlass(false));

  it.each([
    ["meets nisab", {}, "Net $1000 · Nisab $600"],
    [
      "other dues only",
      { result: buildZakatResult({ netWealth: 100, totalDue: 5 }) },
      "Net $100 · crops / livestock due",
    ],
    [
      "below nisab",
      { result: buildZakatResult({ netWealth: 100 }) },
      "Net $100 · below nisab $600",
    ],
    [
      "below an unset nisab",
      { result: buildZakatResult({ netWealth: 100 }), effectiveNisab: 0 },
      "Net $100 · below nisab —",
    ],
    ["no input", { hasInput: false }, "Enter your wealth below — totals stay visible in the bar."],
  ])("summarises when %s", async (_label, overrides, text) => {
    await renderBar(overrides as Partial<Props>);
    expect(screen.getByText(text)).toBeTruthy();
  });

  it("shows the total due", async () => {
    await renderBar();
    expect(screen.getByText("$25")).toBeTruthy();
  });

  it("reports its height", async () => {
    const props = await renderBar();
    await fireEvent(screen.getAllByRole("text")[0], "layout", {
      nativeEvent: { layout: { height: 72 } },
    });
    expect(props.onHeightChange).toHaveBeenCalledWith(72);
  });

  it("clears the form after confirmation", async () => {
    const props = await renderBar();
    await fireEvent.press(screen.getByLabelText("Reset zakat calculator form"));
    await fireEvent.press(screen.getByText("Reset form"));
    expect(props.resetForm).toHaveBeenCalled();
  });

  it("disables the reset button without input", async () => {
    const props = await renderBar({ hasInput: false });
    await fireEvent.press(screen.getByLabelText("Reset zakat calculator form"));
    expect(screen.queryByText("Reset calculator?")).toBeNull();
    expect(props.resetForm).not.toHaveBeenCalled();
  });

  it("renders over liquid glass", async () => {
    setMockLiquidGlass(true);
    await renderBar();
    expect(screen.getByText("$25")).toBeTruthy();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("still shows the due amount on an opaque bar", async () => {
      await renderBar();
      expect(screen.getByText("$25")).toBeTruthy();
    });
  });
});
