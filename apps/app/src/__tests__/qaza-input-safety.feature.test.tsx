import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import DateConverterScreen from "@/app/calendar/converter";
import QazaCalculatorScreen from "@/app/qaza/calculator";
import QazaRozaScreen from "@/app/qaza/roza";
import { ToastHost } from "@/providers/toast-provider";
import { buildQazaCounter } from "@/test-support/fixtures/qaza";
import { resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithProviders } from "@/test-support/render";
import { restoreTrackerStore, seedTrackerStore } from "@/test-support/store";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

beforeEach(() => {
  jest.clearAllMocks();
  resetExpoRouterMock();
});
afterEach(restoreTrackerStore);

describe("Qaza fasts — Undo survives sync (B-08)", () => {
  const STALE = "2026-01-01T00:00:00.000Z";

  async function renderRoza() {
    const performRoza = jest.fn(async () => {});
    const setRoza = jest.fn(async () => {});
    await seedTrackerStore({
      isReady: true,
      roza: { remaining: 5, completed: 2, estimatedMissed: 0, updatedAt: STALE },
      performRoza,
      setRoza,
    } as never);
    await renderWithProviders(
      <>
        <QazaRozaScreen />
        <ToastHost />
      </>,
    );
    return { performRoza, setRoza };
  }

  it("restores the snapshot without its old updatedAt, so the write is stamped fresh", async () => {
    const { performRoza, setRoza } = await renderRoza();

    await fireEvent.press(screen.getByText("Log a make-up fast"));
    await waitFor(() => expect(performRoza).toHaveBeenCalledTimes(1));
    await fireEvent.press(await screen.findByText("Undo"));

    expect(setRoza).toHaveBeenCalledWith({ remaining: 5, completed: 2, estimatedMissed: 0 });
  });

  it("steps from the edit sheet without carrying the stale timestamp", async () => {
    const { setRoza } = await renderRoza();

    await fireEvent.press(screen.getByLabelText("Edit remaining fast count"));
    await fireEvent.press(screen.getAllByLabelText(/^Increase/)[0] as never);

    expect(setRoza).toHaveBeenCalledWith({ remaining: 6, completed: 2, estimatedMissed: 0 });
  });

  it("keeps an out-of-range years estimate as typed and adds nothing (B-03)", async () => {
    await renderRoza();

    await fireEvent.changeText(screen.getByLabelText("Years of missed Ramadan fasts"), "150");

    expect(screen.getByLabelText("Years of missed Ramadan fasts").props.value).toBe("150");
    expect(screen.getByText("Enter a number from 0 to 99")).toBeTruthy();
    const add = screen.getByRole("button", { name: "Add to remaining" });
    expect(add.props.accessibilityState?.disabled).toBe(true);
  });
});

describe("Qaza calculator — typed values reach validation (B-03, B-06)", () => {
  async function renderCalculator() {
    const setQazaCounters = jest.fn(async () => {});
    await seedTrackerStore({
      isReady: true,
      qazaCounters: [
        buildQazaCounter({ prayerId: "fajr", remaining: 10, completed: 1 }),
        buildQazaCounter({ prayerId: "dhuhr", remaining: 5, completed: 0 }),
      ],
      setQazaCounters,
    });
    await renderWithProviders(<QazaCalculatorScreen />);
    return { setQazaCounters };
  }

  const type = (label: string, value: string) =>
    fireEvent.changeText(screen.getByLabelText(label), value);
  const apply = () => screen.getByRole("button", { name: "Apply to my counters" });

  it("reports a puberty age above the field limit instead of computing with 30", async () => {
    await renderCalculator();

    await type("Current age", "32");
    await type("Age at puberty", "35");

    expect(screen.getByLabelText("Age at puberty").props.value).toBe("35");
    expect(screen.getByText("Age at puberty cannot be later than your current age.")).toBeTruthy();
    expect(apply().props.accessibilityState?.disabled).toBe(true);
  });

  it("blocks Apply when a field is out of range even if the formula accepts it", async () => {
    await renderCalculator();

    await type("Current age", "150");

    expect(screen.getByText("Enter 120 or less")).toBeTruthy();
    expect(apply().props.accessibilityState?.disabled).toBe(true);
  });

  it("validates exempt days above a year instead of clamping them to 365", async () => {
    await renderCalculator();

    await type("Current age", "30");
    await type("Exempt days / year (optional)", "400");

    expect(screen.getByText(/Exempt days \(400\) cannot exceed/)).toBeTruthy();
    expect(apply().props.accessibilityState?.disabled).toBe(true);
  });

  it("uses a typed puberty age of 0 instead of falling back to 15", async () => {
    await renderCalculator();

    await type("Current age", "20");
    await type("Age at puberty", "0");

    // The hint counts from the typed 0, not the default 15 (which would say 5).
    expect(screen.getByText(/obligated for about 20 years/)).toBeTruthy();
  });

  it("states the real total in the confirm: the estimate for each of the six counters", async () => {
    await renderCalculator();

    await type("Current age", "16");
    await fireEvent.press(apply());

    // 1 lunar year ≈ 354 days, written to each of the 6 counters (fard + Witr).
    const dialog = await screen.findByText(/each fard Salah and Witr/);
    expect(dialog).toBeTruthy();
    expect(screen.getByText(/from 15 to 2,124/)).toBeTruthy();
  });
});

describe("Date converter", () => {
  it("rejects a year above 9999 instead of converting a clamped year", async () => {
    await renderWithProviders(<DateConverterScreen />);

    await fireEvent.changeText(screen.getByLabelText("Year"), "12000");

    expect(screen.getByLabelText("Year").props.value).toBe("12,000");
    expect(screen.getByText("Enter a valid year")).toBeTruthy();
  });
});
