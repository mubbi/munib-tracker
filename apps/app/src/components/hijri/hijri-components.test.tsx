import type { HijriAdjustment } from "@munib-tracker/shared/types";
import { act, fireEvent, screen } from "@testing-library/react-native";

import { HijriBasisMovedCard } from "@/components/hijri/hijri-basis-moved-card";
import { HijriCorrectionsList } from "@/components/hijri/hijri-corrections-list";
import { HijriMonthStartSheet } from "@/components/hijri/hijri-month-start-sheet";
import { HijriOffsetStepper } from "@/components/hijri/hijri-offset-stepper";
import { PreferencesRepository } from "@/db";
import { setHijriObserver } from "@/lib/hijri";
import {
  clearHijriMonthStarts,
  keepHijriCorrectionsForCurrentPlace,
  setHijriMonthStart,
  setHijriOffsetDays,
} from "@/lib/hijri-adjustment-actions";
import { preferencesStore } from "@/stores/preferences-store";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);
jest.mock("@/lib/hijri-adjustment-actions", () => ({
  setHijriOffsetDays: jest.fn(async () => {}),
  setHijriMonthStart: jest.fn(async () => {}),
  clearHijriMonthStarts: jest.fn(async () => {}),
  keepHijriCorrectionsForCurrentPlace: jest.fn(async () => {}),
}));

const UPDATED_AT = "2026-11-23T00:00:00.000Z";

async function setAdjustment(hijriAdjustment: HijriAdjustment | undefined) {
  await act(async () => {
    // Persisted too: the theme provider's one-time appearance migration
    // re-reads the stored blob, and isReady skips its load().
    const prefs = await PreferencesRepository.update({ hijriAdjustment });
    preferencesStore.setState({ isReady: true, prefs: { ...prefs, hijriAdjustment } });
  });
}

beforeEach(async () => {
  jest.clearAllMocks();
  setHijriObserver(null);
  await setAdjustment(undefined);
});

describe("HijriMonthStartSheet", () => {
  it("offers only the starts that keep Sha'ban 29 or 30 days for Ramadan 1445", async () => {
    await renderWithTheme(
      <HijriMonthStartSheet visible year={1445} month={9} onClose={jest.fn()} />,
    );
    // Umm al-Qura: 1 Ramadan 1445 = 11 March 2024; Sha'ban had 29 days, so
    // 10 March (28-day Sha'ban) and 13 March (31-day Sha'ban) are not offered.
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(2);
    expect(screen.getByText("Prediction: Umm al-Qura")).toBeTruthy();
    await fireEvent.press(radios[1]);
    expect(setHijriMonthStart).toHaveBeenCalledWith(1445, 9, "2024-03-12");
  });

  it("labels months outside the Umm al-Qura table as the tabular calendar", async () => {
    // Even with a sighting observer: sighting only covers the table range.
    setHijriObserver({ latitude: 24.86, longitude: 67.01 });
    await renderWithTheme(
      <HijriMonthStartSheet visible year={1601} month={3} onClose={jest.fn()} />,
    );
    expect(screen.getByText("Prediction: Tabular (arithmetical) calendar")).toBeTruthy();
    expect(screen.queryByText(/Crescent visibility/)).toBeNull();
    expect(screen.queryByText("Prediction: Umm al-Qura")).toBeNull();
  });

  it("offers clearing an existing correction", async () => {
    await setAdjustment({
      offsetDays: 0,
      monthStarts: { "1445-09": "2024-03-12" },
      updatedAt: UPDATED_AT,
    });
    await renderWithTheme(
      <HijriMonthStartSheet visible year={1445} month={9} onClose={jest.fn()} />,
    );
    const selected = screen
      .getAllByRole("radio")
      .filter((r) => r.props.accessibilityState?.selected);
    expect(selected).toHaveLength(1);
    await fireEvent.press(screen.getByText("Clear this month's correction"));
    expect(setHijriMonthStart).toHaveBeenCalledWith(1445, 9, null);
  });
});

describe("HijriOffsetStepper", () => {
  it("shows a live preview and steps the offset", async () => {
    await renderWithTheme(<HijriOffsetStepper />);
    expect(screen.getByText(/^Today: /)).toBeTruthy();
    expect(screen.getByText("As predicted")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText(/increase/i));
    expect(setHijriOffsetDays).toHaveBeenCalledWith(1);
  });
});

describe("HijriCorrectionsList", () => {
  it("lists corrections and removes one", async () => {
    await setAdjustment({
      offsetDays: 0,
      monthStarts: { "1445-09": "2024-03-12" },
      updatedAt: UPDATED_AT,
    });
    await renderWithTheme(<HijriCorrectionsList />);
    expect(screen.getByText("Ramadan 1445 AH")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Remove the correction for Ramadan 1445 AH"));
    expect(setHijriMonthStart).toHaveBeenCalledWith(1445, 9, null);
  });

  it("shows an empty state", async () => {
    await renderWithTheme(<HijriCorrectionsList />);
    expect(screen.getByText("No month corrections yet.")).toBeTruthy();
  });
});

describe("HijriBasisMovedCard", () => {
  const made: HijriAdjustment = {
    offsetDays: 0,
    monthStarts: { "1445-09": "2024-03-12" },
    basis: "sighting:32,74",
    basisPlace: "Lahore",
    updatedAt: UPDATED_AT,
  };

  it("asks to keep or clear after a move, never clearing silently", async () => {
    await setAdjustment(made);
    await renderWithTheme(<HijriBasisMovedCard />);
    expect(
      screen.getByText("Your Hijri corrections were made for Lahore. Keep or clear?"),
    ).toBeTruthy();
    await fireEvent.press(screen.getByText("Keep"));
    expect(keepHijriCorrectionsForCurrentPlace).toHaveBeenCalled();
    await fireEvent.press(screen.getByText("Clear"));
    expect(clearHijriMonthStarts).toHaveBeenCalled();
  });

  it("stays hidden while the basis matches", async () => {
    await setAdjustment({ ...made, basis: "umalqura" });
    await renderWithTheme(<HijriBasisMovedCard />);
    expect(screen.queryByText(/Keep or clear/)).toBeNull();
  });
});
