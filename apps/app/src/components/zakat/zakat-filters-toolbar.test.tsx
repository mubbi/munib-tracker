import { fireEvent, screen } from "@testing-library/react-native";

import { ZakatFiltersToolbar } from "@/components/zakat/zakat-filters-toolbar";
import { buildZakatCalculatorState, buildZakatResult } from "@/test-support/fixtures/zakat";
import { setMockLiquidGlass } from "@/test-support/mocks/glass-surface";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/glass-surface", () =>
  require("@/test-support/mocks/glass-surface").glassSurfaceWithComponentMock(),
);

type Props = Parameters<typeof ZakatFiltersToolbar>[0];

async function renderToolbar(overrides: Partial<Props> = {}) {
  const state = buildZakatCalculatorState({
    result: buildZakatResult({ totalDue: 25 }),
  });
  const props: Props = {
    ...state,
    visible: true,
    onOpenCurrency: jest.fn(),
    onOpenNumberFormat: jest.fn(),
    ...overrides,
  };
  await renderWithTheme(<ZakatFiltersToolbar {...props} />);
  return props;
}

describe("ZakatFiltersToolbar", () => {
  afterEach(() => setMockLiquidGlass(false));

  it.each(["Gold/g $80", "Silver/g $1", "Nisab $600", "Due $25"])(
    "shows the %s chip",
    async (label) => {
      await renderToolbar();
      expect(screen.getByLabelText(label)).toBeTruthy();
    },
  );

  it("shows the selected currency and number format", async () => {
    await renderToolbar();
    expect(screen.getByText("USD")).toBeTruthy();
    expect(screen.getByText("1,000.00")).toBeTruthy();
  });

  it("opens the currency picker", async () => {
    const props = await renderToolbar();
    await fireEvent.press(screen.getByLabelText("Change zakat currency"));
    expect(props.onOpenCurrency).toHaveBeenCalled();
  });

  it("opens the number format picker", async () => {
    const props = await renderToolbar();
    await fireEvent.press(screen.getByLabelText("Change number format"));
    expect(props.onOpenNumberFormat).toHaveBeenCalled();
  });

  it("refreshes live prices", async () => {
    const props = await renderToolbar();
    await fireEvent.press(screen.getByLabelText("Refresh live market prices"));
    expect(props.applyLivePrices).toHaveBeenCalled();
  });

  it("offers to restore live prices after manual edits", async () => {
    await renderToolbar({ pricesManual: true });
    expect(screen.getByLabelText("Reset to live gold and silver prices")).toBeTruthy();
    expect(screen.getByText("Use live prices again")).toBeTruthy();
  });

  it("hides market, nisab and due chips when there is no data", async () => {
    await renderToolbar({
      market: { data: undefined, isLoading: true, isFetching: false, isError: false },
      effectiveNisab: 0,
      hasInput: false,
      currency: { code: "AED", symbol: "د.إ", name: "UAE Dirham", glyph: "AED" },
      numberFormat: "space_comma",
      visible: false,
    } as Partial<Props>);
    expect(screen.queryByLabelText(/^Gold\/g/)).toBeNull();
    expect(screen.queryByLabelText(/^Nisab/)).toBeNull();
    expect(screen.queryByLabelText(/^Due/)).toBeNull();
    expect(screen.getByText("1 000,00")).toBeTruthy();
  });

  it("shows a zero due chip when nothing is due", async () => {
    setMockLiquidGlass(true);
    await renderToolbar({ result: buildZakatResult() });
    expect(screen.getByLabelText("Due $0")).toBeTruthy();
  });
});
