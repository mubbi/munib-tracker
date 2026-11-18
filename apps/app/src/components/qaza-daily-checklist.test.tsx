import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { QazaDailyChecklist } from "@/components/qaza-daily-checklist";
import { QazaRepository } from "@/db";
import { trackReviewInteraction } from "@/features/reviews/lib/reviewEngagementBridge";
import {
  buildQazaCounter,
  buildQazaDailyProgress,
  buildQazaSchedule,
} from "@/test-support/fixtures/qaza";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { restoreTrackerStore, seedTrackerStore } from "@/test-support/store";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/features/reviews/lib/reviewEngagementBridge", () => ({
  trackReviewInteraction: jest.fn(),
}));

const performQaza = jest.fn(async () => {});
const undoQaza = jest.fn(async () => {});

/** Fajr: 1 of 2 done today (8 left); Asr: 0 of 1 with nothing owed. */
const seed = (progress = { fajr: 1 }) =>
  seedTrackerStore({
    qazaSchedule: buildQazaSchedule({ targets: { fajr: 2, asr: 1, dhuhr: 0 } }),
    qazaDailyProgress: buildQazaDailyProgress({ completed: progress }),
    qazaCounters: [
      buildQazaCounter({ prayerId: "fajr", remaining: 8, completed: 3 }),
      buildQazaCounter({ prayerId: "asr", remaining: 0, completed: 0 }),
    ],
    performQaza,
    undoQaza,
  });

const button = (label: string) => screen.getByLabelText(label);
const isDisabled = (label: string) => button(label).props.accessibilityState.disabled;

beforeEach(() => jest.clearAllMocks());
afterEach(restoreTrackerStore);

describe("QazaDailyChecklist today", () => {
  it("summarises today's qaza progress", async () => {
    await seed();
    await renderWithTheme(<QazaDailyChecklist />);

    expect(screen.getByText("1 of 3 qaza today")).toBeTruthy();
    expect(screen.getByText("1 / 2 today")).toBeTruthy();
  });

  it("only lists prayers with a daily target", async () => {
    await seed();
    await renderWithTheme(<QazaDailyChecklist />);

    expect(screen.getByText("Asr")).toBeTruthy();
    expect(screen.queryByText("Dhuhr")).toBeNull();
  });

  it.each([
    ["Mark Fajr qaza performed", false],
    ["Undo one Fajr qaza performed today", false],
    ["Mark Asr qaza performed", true],
    ["Undo one Asr qaza performed today", true],
  ])("%s disabled=%s", async (label, disabled) => {
    await seed();
    await renderWithTheme(<QazaDailyChecklist />);

    expect(isDisabled(label)).toBe(disabled);
  });

  it("disables marking once the target is met", async () => {
    await seed({ fajr: 2 });
    await renderWithTheme(<QazaDailyChecklist />);

    expect(isDisabled("Mark Fajr qaza performed")).toBe(true);
  });

  it("confirms before marking a qaza performed", async () => {
    await seed();
    await renderWithTheme(<QazaDailyChecklist />);

    await fireEvent.press(button("Mark Fajr qaza performed"));
    expect(screen.getByText("Record one Fajr qaza as made up?")).toBeTruthy();
    await fireEvent.press(screen.getByText("Confirm"));

    expect(performQaza).toHaveBeenCalledWith("fajr");
    expect(trackReviewInteraction).toHaveBeenCalledWith("mark_qaza");
  });

  it("confirms before undoing a performed qaza", async () => {
    await seed();
    await renderWithTheme(<QazaDailyChecklist />);

    await fireEvent.press(button("Undo one Fajr qaza performed today"));
    expect(screen.getByText("Undo qaza performed?")).toBeTruthy();
    await fireEvent.press(screen.getByText("Confirm"));

    expect(undoQaza).toHaveBeenCalledWith("fajr");
  });

  it("does nothing when the confirmation is cancelled", async () => {
    await seed();
    await renderWithTheme(<QazaDailyChecklist />);

    await fireEvent.press(button("Mark Fajr qaza performed"));
    await fireEvent.press(screen.getByText("Cancel"));

    expect(performQaza).not.toHaveBeenCalled();
    expect(screen.queryByTestId("sheet")).toBeNull();
  });

  it("renders nothing without a daily plan", async () => {
    await seedTrackerStore({ qazaSchedule: buildQazaSchedule({ targets: {} }) });
    await renderWithTheme(<QazaDailyChecklist />);

    expect(screen.toJSON()).toBeNull();
  });
});

describe("QazaDailyChecklist for a past day", () => {
  it("shows that day's stored progress read-only", async () => {
    await seed();
    jest
      .spyOn(QazaRepository, "getDailyProgress")
      .mockResolvedValue(
        buildQazaDailyProgress({ date: "2020-01-01", completed: { fajr: 2, asr: 1 } }),
      );
    await renderWithTheme(<QazaDailyChecklist date="2020-01-01" />);

    expect(await screen.findByText("3 of 3 qaza today")).toBeTruthy();
    expect(isDisabled("Undo one Fajr qaza performed today")).toBe(true);
  });

  it("renders nothing when no qaza was made up that day", async () => {
    await seed({});
    jest.spyOn(QazaRepository, "getDailyProgress").mockResolvedValue(buildQazaDailyProgress());
    await renderWithTheme(<QazaDailyChecklist date="2020-01-01" />);

    await waitFor(() => expect(QazaRepository.getDailyProgress).toHaveBeenCalledWith("2020-01-01"));
    expect(screen.toJSON()).toBeNull();
  });
});

describe("QazaDailyChecklist on TV", () => {
  usePlatform({ isTV: true });

  it("keeps the actions reachable in the two-column grid", async () => {
    await seed();
    await renderWithTheme(<QazaDailyChecklist />);

    expect(button("Mark Fajr qaza performed")).toBeTruthy();
  });
});
