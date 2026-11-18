import { fireEvent, screen } from "@testing-library/react-native";

import { ZakatCalculator } from "@/components/zakat/zakat-calculator";
import type { ZakatCalculatorState } from "@/hooks/use-zakat-calculator";
import { buildZakatCalculatorState, buildZakatResult } from "@/test-support/fixtures/zakat";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

type Props = Parameters<typeof ZakatCalculator>[0];

async function renderCalc(overrides: Partial<Props> = {}) {
  const state = buildZakatCalculatorState(overrides as Partial<ZakatCalculatorState>);
  await renderWithTheme(<ZakatCalculator {...state} {...overrides} />);
  return state;
}

const fullLivestock = buildZakatResult({
  livestockAnimals: {
    sheep: 1,
    cattleTabi: 1,
    cattleMusinnah: 1,
    camelSheep: 0,
    camelBintMakhad: 1,
    camelBintLabun: 1,
    camelHiqqah: 1,
    camelJadhah: 1,
  },
  livestockCashEstimate: 250,
  agricultureDue: 45,
});

describe("ZakatCalculator", () => {
  describe("with live market data", () => {
    it.each([
      "US Dollar",
      "22,000.03",
      "$80",
      "MetalsAPI · FX 2026-11-01",
      "Nisab and metal prices are prefilled from live rates.",
      "Adds $733 to wealth",
      "Gold nisab (~87.5 g): $7000",
      "Using lower threshold: $600",
      "Ushr 10% when watered naturally without costly irrigation.",
    ])("shows %s", async (text) => {
      await renderCalc();
      expect(screen.getByText(text)).toBeTruthy();
    });

    it("tags both weight calculators as live", async () => {
      await renderCalc();
      expect(screen.getAllByText("Live")).toHaveLength(2);
    });

    it("refreshes live prices", async () => {
      const state = await renderCalc();
      await fireEvent.press(screen.getByLabelText("Refresh live market prices"));
      expect(state.applyLivePrices).toHaveBeenCalled();
    });
  });

  it.each([
    ["Cash & savings", "1234", "cash", "1,234"],
    ["Immediate debts due", "5", "debts", "5"],
    ["Immediate living expenses", "6", "livingExpenses", "6"],
  ])("formats %s edits into setField", async (label, typed, key, formatted) => {
    const state = await renderCalc();
    await fireEvent.changeText(screen.getByLabelText(label), typed);
    expect(state.setField).toHaveBeenCalledWith(key, formatted);
  });

  it.each([
    ["Price/g (24k)", "setGoldPrice"],
    ["Price/g (fine)", "setSilverPrice"],
    ["Sheep / goats (heads)", "setSheepCount"],
    ["Harvest market value", "setHarvestValue"],
  ] as const)("forwards %s edits", async (label, setter) => {
    const state = await renderCalc();
    await fireEvent.changeText(screen.getByLabelText(label), "70");
    expect(state[setter]).toHaveBeenCalledWith("70");
  });

  it.each([
    [0, "setGoldWeight"],
    [1, "setSilverWeight"],
  ] as const)("forwards weight input %i", async (index, setter) => {
    const state = await renderCalc();
    await fireEvent.changeText(screen.getAllByLabelText("Weight")[index], "12.5");
    expect(state[setter]).toHaveBeenCalledWith("12.5");
  });

  it.each([
    ["Irrigated (5%)", "setIrrigation", "irrigated"],
    ["18k", "setGoldKarat", 18],
    ["999", "setSilverPurity", 999],
  ] as const)("selects the %s chip", async (label, setter, value) => {
    const state = await renderCalc();
    await fireEvent.press(screen.getByText(label));
    expect(state[setter]).toHaveBeenCalledWith(value);
  });

  it("selects a gold weight unit", async () => {
    const state = await renderCalc();
    await fireEvent.press(screen.getAllByText("Tola")[0]);
    expect(state.setGoldUnit).toHaveBeenCalledWith("tola");
  });

  it("edits optional livestock cash values", async () => {
    const state = await renderCalc();
    await fireEvent.press(screen.getByText("Optional cash values (per head)"));
    await fireEvent.changeText(screen.getByLabelText("Value per sheep/goat"), "100");
    expect(state.setSheepValue).toHaveBeenCalledWith("100");
  });

  it("prefills the override with the suggested nisab and marks manual edits", async () => {
    const state = await renderCalc();
    await fireEvent.press(screen.getByText("Manual nisab override"));
    const input = screen.getByLabelText("Nisab value (override)");
    expect(input.props.value).toBe("600");
    await fireEvent.changeText(input, "700");
    expect(state.setNisabManual).toHaveBeenCalledWith(true);
    expect(state.setNisab).toHaveBeenCalledWith("700");
  });

  it("selects a currency from the picker sheet", async () => {
    const state = await renderCalc();
    await fireEvent.press(screen.getByLabelText("Change zakat currency"));
    expect(screen.getByText("Select currency")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("sheet-close"));
    expect(screen.queryByText("Select currency")).toBeNull();
    expect(state.setCurrencyCode).not.toHaveBeenCalled();
  });

  it("opens and closes the number format sheet", async () => {
    await renderCalc();
    await fireEvent.press(screen.getByLabelText("Change number format"));
    expect(screen.getByText(/Choose how amounts are grouped/)).toBeTruthy();
    await fireEvent.press(screen.getByTestId("sheet-close"));
    expect(screen.queryByText(/Choose how amounts are grouped/)).toBeNull();
  });

  it("opens the Learn more sheet for a section", async () => {
    await renderCalc();
    await fireEvent.press(screen.getAllByText("Learn more")[0]);
    expect(screen.getByTestId("sheet")).toBeTruthy();
    await fireEvent.press(screen.getByTestId("sheet-close"));
    expect(screen.queryByTestId("sheet")).toBeNull();
  });

  it("delegates currency picker state when controlled", async () => {
    const onCurrencyPickerOpenChange = jest.fn();
    await renderCalc({ currencyPickerOpen: true, onCurrencyPickerOpenChange });
    await fireEvent.press(screen.getByTestId("sheet-close"));
    expect(onCurrencyPickerOpenChange).toHaveBeenCalledWith(false);
  });

  it("delegates number format picker state when controlled", async () => {
    const onNumberFormatPickerOpenChange = jest.fn();
    await renderCalc({ numberFormatPickerOpen: false, onNumberFormatPickerOpenChange });
    await fireEvent.press(screen.getByLabelText("Change number format"));
    expect(onNumberFormatPickerOpenChange).toHaveBeenCalledWith(true);
  });

  describe("with manual prices and dues", () => {
    const overrides = {
      pricesManual: true,
      currency: { code: "AED", glyph: "AED", name: "Dirham" },
      nisabManual: true,
      nisab: "123",
      goldNisab: 0,
      silverNisab: 500,
      irrigation: "irrigated",
      numberFormat: "dot_comma",
      result: fullLivestock,
    } as Partial<Props>;

    it("resets to live prices", async () => {
      const state = await renderCalc(overrides);
      await fireEvent.press(screen.getByLabelText("Reset to live gold and silver prices"));
      expect(state.applyLivePrices).toHaveBeenCalled();
    });

    it.each([
      "1 sheep/goat",
      "1 tabi' (1-year cattle)",
      "1 jadhah (4-year camel)",
      "Cash estimate: $250",
      "Ushr due: $45",
      "22.000,03",
    ])("shows %s", async (text) => {
      await renderCalc(overrides);
      expect(screen.getByText(text)).toBeTruthy();
    });

    it("drops the live badges and the lower-threshold hint", async () => {
      await renderCalc(overrides);
      expect(screen.queryAllByText("Live")).toHaveLength(0);
      expect(screen.queryByText(/Using lower threshold/)).toBeNull();
    });
  });

  it.each([
    [{ isLoading: true, isFetching: false, isError: false }, "Fetching live prices…"],
    [
      { isLoading: false, isFetching: false, isError: true },
      "Could not load live prices. Enter gold and silver prices manually.",
    ],
  ])("shows market status %#", async (status, text) => {
    await renderCalc({
      currency: undefined,
      goldNisab: 0,
      silverNisab: 0,
      suggestedNisab: 0,
      market: { data: undefined, ...status },
    } as Partial<Props>);
    expect(screen.getByText(text)).toBeTruthy();
    expect(screen.queryByText(/Gold nisab/)).toBeNull();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("steps livestock counts with the remote", async () => {
      const state = await renderCalc();
      await fireEvent.press(screen.getByLabelText("Increase Sheep / goats (heads)"));
      expect(state.setSheepCount).toHaveBeenCalledWith("1");
    });
  });
});
