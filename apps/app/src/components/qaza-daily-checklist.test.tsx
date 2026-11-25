import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { QazaDailyChecklist } from "@/components/qaza-daily-checklist";
import { QazaRepository } from "@/db";
import { trackReviewInteraction } from "@/features/reviews/lib/reviewEngagementBridge";
import { ToastHost } from "@/providers/toast-provider";
import {
  buildQazaCounter,
  buildQazaDailyProgress,
  buildQazaSchedule,
} from "@/test-support/fixtures/qaza";
import { usePlatform } from "@/test-support/platform";
import { renderWithProviders } from "@/test-support/render";
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
  it("summarises today's Qaza progress", async () => {
    await seed();
    await renderWithProviders(<QazaDailyChecklist />);

    expect(screen.getByText("1 of 3 Qaza today")).toBeTruthy();
    expect(screen.getByText("1 / 2 today")).toBeTruthy();
  });

  it("only lists prayers with a daily target", async () => {
    await seed();
    await renderWithProviders(<QazaDailyChecklist />);

    expect(screen.getByText("Asr")).toBeTruthy();
    expect(screen.queryByText("Dhuhr")).toBeNull();
  });

  it.each([
    ["Mark Fajr Qaza performed", false],
    ["Undo one Fajr Qaza performed today", false],
    ["Mark Asr Qaza performed", true],
    ["Undo one Asr Qaza performed today", true],
  ])("%s disabled=%s", async (label, disabled) => {
    await seed();
    await renderWithProviders(<QazaDailyChecklist />);

    expect(isDisabled(label)).toBe(disabled);
  });

  it("disables marking once the target is met", async () => {
    await seed({ fajr: 2 });
    await renderWithProviders(<QazaDailyChecklist />);

    expect(isDisabled("Mark Fajr Qaza performed")).toBe(true);
  });

  it("logs a make-up in one tap and offers Undo", async () => {
    await seed();
    await renderWithProviders(
      <>
        <QazaDailyChecklist />
        <ToastHost />
      </>,
    );

    await fireEvent.press(button("Mark Fajr Qaza performed"));

    expect(performQaza).toHaveBeenCalledTimes(1);
    expect(performQaza).toHaveBeenCalledWith("fajr");
    expect(trackReviewInteraction).toHaveBeenCalledWith("mark_qaza");
    expect(screen.queryByText("Confirm")).toBeNull();
    await fireEvent.press(await screen.findByText("Undo"));
    expect(undoQaza).toHaveBeenCalledWith("fajr");
  });

  it("takes a make-up back without a dialog and offers Undo", async () => {
    await seed();
    await renderWithProviders(
      <>
        <QazaDailyChecklist />
        <ToastHost />
      </>,
    );

    await fireEvent.press(button("Undo one Fajr Qaza performed today"));

    expect(undoQaza).toHaveBeenCalledWith("fajr");
    expect(screen.queryByText("Confirm")).toBeNull();
    await fireEvent.press(await screen.findByText("Undo"));
    expect(performQaza).toHaveBeenCalledWith("fajr");
  });

  it("renders nothing without a daily plan", async () => {
    await seedTrackerStore({ qazaSchedule: buildQazaSchedule({ targets: {} }) });
    await renderWithProviders(<QazaDailyChecklist />);

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
    await renderWithProviders(<QazaDailyChecklist date="2020-01-01" />);

    expect(await screen.findByText("3 of 3 Qaza today")).toBeTruthy();
    expect(isDisabled("Undo one Fajr Qaza performed today")).toBe(true);
  });

  it("renders nothing when no Qaza was made up that day", async () => {
    await seed({});
    jest.spyOn(QazaRepository, "getDailyProgress").mockResolvedValue(buildQazaDailyProgress());
    await renderWithProviders(<QazaDailyChecklist date="2020-01-01" />);

    await waitFor(() => expect(QazaRepository.getDailyProgress).toHaveBeenCalledWith("2020-01-01"));
    expect(screen.toJSON()).toBeNull();
  });
});

describe("QazaDailyChecklist on TV", () => {
  usePlatform({ isTV: true });

  it("keeps the actions reachable in the two-column grid", async () => {
    await seed();
    await renderWithProviders(<QazaDailyChecklist />);

    expect(button("Mark Fajr Qaza performed")).toBeTruthy();
  });
});
