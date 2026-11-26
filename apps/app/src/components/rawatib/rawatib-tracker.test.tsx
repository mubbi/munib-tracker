import type { RawatibConfig, RawatibDayTimes } from "@munib-tracker/shared/utils";
import { resolveRawatibConfig } from "@munib-tracker/shared/utils";
import { fireEvent, screen, within } from "@testing-library/react-native";

import {
  TrackerDayChecklist,
  type TrackerDayChecklistProps,
} from "@/components/tracker-day-checklist";
import { startRawatib } from "@/lib/rawatib";
import { trackerStore } from "@/stores/tracker-store";
import { buildPrayerTimes } from "@/test-support/fixtures/prayer";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

/** A plain day: Fajr 05:00, sunrise 06:30, Dhuhr 12:30, Asr 15:45, Maghrib 18:10, Isha 19:40. */
const at = (hhmm: string, day = "2026-03-10") => new Date(`${day}T${hhmm}:00Z`);
const TIMES: RawatibDayTimes = {
  fajr: at("05:00"),
  sunrise: at("06:30"),
  dhuhr: at("12:30"),
  asr: at("15:45"),
  maghrib: at("18:10"),
  isha: at("19:40"),
  nextFajr: at("04:58", "2026-03-11"),
};

const mockState: {
  config: RawatibConfig;
  times: RawatibDayTimes | null;
  now: Date;
} = {
  config: resolveRawatibConfig({ madhhab: "hanafi" }),
  times: null,
  now: at("13:00"),
};

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/components/qaza-daily-checklist", () => ({ QazaDailyChecklist: () => null }));
jest.mock("@/components/khatm-daily-checklist", () => ({ KhatmDailyChecklist: () => null }));
jest.mock("@/components/friday-tracker-section", () => ({ FridayTrackerSection: () => null }));
jest.mock("@/components/white-days-tracker-section", () => ({
  WhiteDaysTrackerSection: () => null,
}));
jest.mock("@/components/excused-day-picker", () => ({ ExcusedDayPicker: () => null }));
jest.mock("@/components/fiqh/madhhab-note", () => ({ MadhhabNote: () => null }));
jest.mock("@/lib/rawatib-nudge", () => ({ requestRawatibNudgeReschedule: jest.fn() }));
jest.mock("@/hooks/use-now", () => ({ useNow: () => mockState.now }));
jest.mock("@/hooks/use-rawatib", () => ({
  ...jest.requireActual("@/hooks/use-rawatib"),
  useRawatibConfig: () => mockState.config,
}));
jest.mock("@/lib/rawatib", () => ({
  ...jest.requireActual("@/lib/rawatib"),
  rawatibDayTimes: () => mockState.times,
  startRawatib: jest.fn(async () => undefined),
  updateRawatibPreferences: jest.fn(async () => undefined),
}));

const DATE = "2026-03-10";

const renderChecklist = (props: Partial<TrackerDayChecklistProps> = {}) =>
  renderWithTheme(
    <TrackerDayChecklist
      date={DATE}
      isToday
      status={{}}
      notes={{}}
      jama={{}}
      zikrCounts={{}}
      prayerTimes={buildPrayerTimes()}
      onPrayerPress={jest.fn()}
      onPrayerQuickSelect={jest.fn()}
      {...props}
    />,
  );

let setRawatib: jest.SpyInstance;

beforeEach(() => {
  resetExpoRouterMock();
  mockState.config = resolveRawatibConfig({ madhhab: "hanafi" });
  mockState.times = null;
  mockState.now = at("13:00");
  setRawatib = jest
    .spyOn(trackerStore.getState(), "setRawatibOnDate")
    .mockImplementation(async () => undefined);
});

afterEach(() => {
  setRawatib.mockRestore();
  jest.mocked(startRawatib).mockClear();
});

describe("Rawatib inside the Salah cards (NF-3.1)", () => {
  it("renders a Sunnah row inside each of the five Salah cards, in prayer order", async () => {
    mockState.config = resolveRawatibConfig({
      madhhab: "hanafi",
      rawatib: { enabled: true, extras: ["asr_before"] },
    });
    await renderChecklist();

    for (const [fard, ids] of [
      ["fajr", ["fajr_before"]],
      ["dhuhr", ["dhuhr_before", "dhuhr_after"]],
      ["asr", ["asr_before"]],
      ["maghrib", ["maghrib_after"]],
      ["isha", ["isha_after"]],
    ] as const) {
      const card = within(screen.getByTestId(`prayer-sunnah-${fard}`));
      expect(card.getByText("Sunnah")).toBeTruthy();
      for (const id of ids) expect(card.getByTestId(`rawatib-chip-${id}`)).toBeTruthy();
    }
    // The old detached header card and its long hint are gone.
    expect(screen.queryByText(/Tap a chip under each Salah/)).toBeNull();
    expect(screen.queryByText("Show all of today's rawatib")).toBeNull();
  });

  it("leaves a fard without rawatib (Asr, no extras) without a Sunnah row", async () => {
    await renderChecklist();
    expect(screen.queryByTestId("prayer-sunnah-asr")).toBeNull();
    expect(screen.getByTestId("prayer-sunnah-isha")).toBeTruthy();
  });

  it("logs a rawatib from its chip", async () => {
    await renderChecklist();
    await fireEvent.press(screen.getByTestId("rawatib-chip-dhuhr_after"));

    expect(setRawatib).toHaveBeenCalledWith(DATE, "dhuhr_after", true, {
      rakahs: 2,
      late: false,
    });
    expect(screen.getByTestId("rawatib-chip-dhuhr_after").props.accessibilityState).toMatchObject({
      checked: true,
    });
  });

  it("logs the chosen 2 or 4 rakahs for the Sunnah before Dhuhr", async () => {
    await renderChecklist();
    await fireEvent.press(screen.getByTestId("rawatib-rakahs-dhuhr_before"));
    await fireEvent.press(screen.getByRole("radio", { name: "2 rakahs" }));

    expect(setRawatib).toHaveBeenCalledWith(DATE, "dhuhr_before", true, {
      rakahs: 2,
      late: false,
    });
  });

  it("shows the day's progress in a slim footer that opens the hub", async () => {
    await renderChecklist({ status: { fajr_before: "completed", dhuhr_after: "completed" } });
    const summary = screen.getByTestId("rawatib-summary");

    expect(summary.props.accessibilityLabel).toBe(
      "Sunnah rawatib, 4 / 12 rakahs. Evidence & settings",
    );
    await fireEvent.press(summary);
    expect(mockRouter.push).toHaveBeenCalledWith("/rawatib");
  });

  it("asks the first-run question inline, once, instead of the chips", async () => {
    mockState.config = resolveRawatibConfig({});
    await renderChecklist();

    expect(screen.getByTestId("rawatib-first-run")).toBeTruthy();
    expect(screen.queryByTestId("rawatib-summary")).toBeNull();
    expect(screen.queryByTestId("prayer-sunnah-fajr")).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "12 rakahs" }));
    expect(startRawatib).toHaveBeenCalledWith(12);
  });

  it("shows every row of today, muting the ones not due yet", async () => {
    mockState.times = TIMES;
    await renderChecklist();

    // 13:00 — Fajr's window has passed, Dhuhr's is open, Maghrib's and Isha's are ahead.
    const hint = (id: string) => screen.getByTestId(`rawatib-chip-${id}`).props.accessibilityHint;
    expect(screen.getByTestId("rawatib-chip-fajr_before")).toBeTruthy();
    expect(hint("dhuhr_after")).toBe("Usually prayed after the fard — you can still log it");
    expect(hint("maghrib_after")).toMatch(/^Not due yet/);
    expect(hint("isha_after")).toMatch(/^Not due yet/);
    expect(hint("fajr_before")).toBeUndefined();

    await fireEvent.press(screen.getByTestId("rawatib-chip-isha_after"));
    expect(setRawatib).toHaveBeenCalledWith(DATE, "isha_after", true, expect.anything());
  });

  it("marks the rows travel makes optional inline and explains it in the footer", async () => {
    await renderChecklist({ excusedReason: "travel" });

    expect(within(screen.getByTestId("prayer-sunnah-dhuhr")).getByText("· Optional")).toBeTruthy();
    expect(within(screen.getByTestId("prayer-sunnah-fajr")).queryByText("· Optional")).toBeNull();
    expect(screen.getByTestId("rawatib-summary").props.accessibilityLabel).toMatch(
      /the Sunnah before Fajr is kept/,
    );
  });

  it("hides the rawatib on a hayd day", async () => {
    await renderChecklist({ excusedReason: "hayd" });
    expect(screen.queryByTestId("prayer-sunnah-fajr")).toBeNull();
    expect(screen.queryByTestId("rawatib-summary")).toBeNull();
  });

  it("keeps the chips on a calendar day (no future muting)", async () => {
    mockState.times = TIMES;
    await renderChecklist({ isToday: false, onPrayerQuickSelect: undefined });

    expect(screen.getByTestId("rawatib-chip-isha_after").props.accessibilityHint).not.toMatch(
      /Not due yet/,
    );
    await fireEvent.press(screen.getByTestId("rawatib-chip-fajr_before"));
    expect(setRawatib).toHaveBeenCalledWith(DATE, "fajr_before", true, {
      rakahs: 2,
      late: undefined,
    });
  });
});

describe("Rawatib chips on TV", () => {
  usePlatform({ isTV: true });

  it("puts the chips after the fard row in D-pad order, with the 2 or 4 button instead of long-press", async () => {
    await renderChecklist();
    const order = screen
      .getAllByRole(/^(button|checkbox)$/)
      .map((node) => node.props.testID as string | undefined)
      .filter((id): id is string => id != null);
    const index = (id: string) => {
      const found = order.indexOf(id);
      expect(found).toBeGreaterThanOrEqual(0);
      return found;
    };

    expect(index("prayer-mark-dhuhr")).toBeLessThan(index("rawatib-chip-dhuhr_before"));
    expect(index("rawatib-chip-dhuhr_before")).toBeLessThan(index("rawatib-rakahs-dhuhr_before"));
    expect(index("rawatib-rakahs-dhuhr_before")).toBeLessThan(index("rawatib-chip-dhuhr_after"));
    expect(index("rawatib-chip-dhuhr_after")).toBeLessThan(index("prayer-mark-asr"));
    expect(index("prayer-mark-isha")).toBeLessThan(index("rawatib-chip-isha_after"));
    expect(index("rawatib-chip-isha_after")).toBeLessThan(index("rawatib-summary"));
    expect(screen.getByTestId("rawatib-chip-dhuhr_before").props.onLongPress).toBeUndefined();
  });
});
