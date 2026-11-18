import { fireEvent, screen } from "@testing-library/react-native";

import { ZakatResultHero } from "@/components/zakat/zakat-result-hero";
import { buildZakatResult } from "@/test-support/fixtures/zakat";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

type Props = Parameters<typeof ZakatResultHero>[0];

const dueResult = buildZakatResult({
  netWealth: 10000,
  meetsNisab: true,
  wealthDue: 250,
  agricultureDue: 40,
  livestockCashEstimate: 30,
  totalDue: 320,
});

async function renderHero(overrides: Partial<Props> = {}) {
  const props: Props = {
    result: dueResult,
    money: (n: number) => `$${n}`,
    hasInput: true,
    effectiveNisab: 600,
    goldNisab: 7000,
    silverNisab: 600,
    suggestedNisab: 600,
    currencyCode: "USD",
    ...overrides,
  };
  await renderWithTheme(<ZakatResultHero {...props} />);
  return props;
}

describe("ZakatResultHero", () => {
  it.each([
    "$320",
    "$10000",
    "Wealth zakat (2.5%): $250",
    "Crops (ushr): $40",
    "Livestock (cash estimate): $30",
    "Estimated zakat due",
    "Gold $7000",
    "Silver $600",
  ])("shows %s when zakat is due", async (text) => {
    await renderHero();
    expect(screen.getByText(text)).toBeTruthy();
  });

  it("reminds about the lunar year when nisab is met", async () => {
    await renderHero();
    expect(screen.getByText(/full lunar year/)).toBeTruthy();
  });

  it("shows the empty hint without input", async () => {
    await renderHero({ hasInput: false });
    expect(screen.getByText("—")).toBeTruthy();
    expect(screen.getByText(/Enter your wealth below/)).toBeTruthy();
    expect(screen.queryByText("Gold $7000")).toBeNull();
  });

  it("explains other dues when wealth is below nisab", async () => {
    await renderHero({
      result: buildZakatResult({ agricultureDue: 10, totalDue: 10 }),
      effectiveNisab: 0,
      goldNisab: 0,
    });
    expect(screen.getByText("Crops / livestock due (wealth below nisab)")).toBeTruthy();
    expect(screen.queryByText(/Wealth zakat/)).toBeNull();
  });

  it("says nothing is due below nisab", async () => {
    await renderHero({ result: buildZakatResult(), silverNisab: 0, suggestedNisab: 7000 });
    expect(screen.getByText(/Below nisab — no wealth zakat/)).toBeTruthy();
    expect(screen.queryByText("Silver $600")).toBeNull();
  });

  it("confirms before resetting", async () => {
    const onReset = jest.fn();
    await renderHero({ onReset });
    await fireEvent.press(screen.getByText("Reset form"));
    expect(screen.getByText("Reset calculator?")).toBeTruthy();
    await fireEvent.press(screen.getAllByText("Reset form")[1]);
    expect(onReset).toHaveBeenCalled();
  });

  it("closes the reset dialog without resetting", async () => {
    const onReset = jest.fn();
    await renderHero({ onReset });
    await fireEvent.press(screen.getByText("Reset form"));
    await fireEvent.press(screen.getByText("Cancel"));
    expect(onReset).not.toHaveBeenCalled();
    expect(screen.queryByText("Reset calculator?")).toBeNull();
  });
});
