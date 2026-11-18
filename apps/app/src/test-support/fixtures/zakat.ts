import type { ZakatCalculatorState } from "@/hooks/use-zakat-calculator";
import type { ZakatResult } from "@/lib/zakat";

/** A zakat result with nothing due (override fields to exercise due states). */
export function buildZakatResult(overrides: Partial<ZakatResult> = {}): ZakatResult {
  return {
    netWealth: 0,
    meetsNisab: false,
    due: 0,
    wealthDue: 0,
    agricultureDue: 0,
    livestockAnimals: {
      sheep: 0,
      cattleTabi: 0,
      cattleMusinnah: 0,
      camelSheep: 0,
      camelBintMakhad: 0,
      camelBintLabun: 0,
      camelHiqqah: 0,
      camelJadhah: 0,
    },
    livestockCashEstimate: 0,
    totalDue: 0,
    ...overrides,
  };
}

/**
 * Full `useZakatCalculator()` state in USD with live market data loaded, a gold
 * weight entry and every setter as a `jest.fn()`. `money` renders `$<n>`.
 */
export function buildZakatCalculatorState(
  overrides: Partial<ZakatCalculatorState> = {},
): ZakatCalculatorState {
  const state = {
    currencyCode: "USD",
    setCurrencyCode: jest.fn(),
    numberFormat: "comma_dot",
    setNumberFormat: jest.fn(),
    currency: { code: "USD", symbol: "$", name: "US Dollar" },
    values: { cash: "100" },
    setField: jest.fn(),
    nisab: "",
    setNisab: jest.fn(),
    nisabManual: false,
    setNisabManual: jest.fn(),
    goldWeight: "10",
    setGoldWeight: jest.fn(),
    goldUnit: "g",
    setGoldUnit: jest.fn(),
    goldKarat: 22,
    setGoldKarat: jest.fn(),
    goldPrice: "80",
    setGoldPrice: jest.fn(),
    silverWeight: "",
    setSilverWeight: jest.fn(),
    silverUnit: "g",
    setSilverUnit: jest.fn(),
    silverPurity: 925,
    setSilverPurity: jest.fn(),
    silverPrice: "",
    setSilverPrice: jest.fn(),
    nisabGoldPrice: "80",
    setNisabGoldPrice: jest.fn(),
    nisabSilverPrice: "1",
    setNisabSilverPrice: jest.fn(),
    goldFromWeight: 733,
    silverFromWeight: 0,
    goldNisab: 7000,
    silverNisab: 600,
    suggestedNisab: 600,
    effectiveNisab: 600,
    sheepCount: "",
    setSheepCount: jest.fn(),
    cattleCount: "",
    setCattleCount: jest.fn(),
    camelCount: "",
    setCamelCount: jest.fn(),
    sheepValue: "",
    setSheepValue: jest.fn(),
    cattleValue: "",
    setCattleValue: jest.fn(),
    camelValue: "",
    setCamelValue: jest.fn(),
    harvestValue: "",
    setHarvestValue: jest.fn(),
    irrigation: "natural",
    setIrrigation: jest.fn(),
    result: buildZakatResult(),
    money: (n: number) => `$${n}`,
    hasInput: true,
    pricesManual: false,
    applyLivePrices: jest.fn(),
    resetForm: jest.fn(),
    market: {
      data: {
        goldPerGram: 80,
        silverPerGram: 1,
        fxDate: "2026-11-01",
        metals: { attribution: "MetalsAPI" },
      },
      isLoading: false,
      isFetching: false,
      isError: false,
    },
    hydrated: true,
  };
  return { ...state, ...overrides } as unknown as ZakatCalculatorState;
}
