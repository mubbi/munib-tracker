import { getLocalDateString } from "@munib-tracker/shared/utils";
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import { useFocusEffect } from "expo-router";
import { useEffect } from "react";

import AchievementsScreen from "@/app/achievements";
import CoachScreen from "@/app/coach";
import JournalScreen from "@/app/journal";
import StatisticsScreen from "@/app/statistics";
import { PrayerRepository } from "@/db";
import { khushuStore } from "@/stores/khushu-store";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";
import { renderWithProviders } from "@/test-support/render";
import {
  loadTrackerStore,
  resetTrackerStore,
  restoreTrackerStore,
  seedTrackerStore,
} from "@/test-support/store";

jest.mock("@/providers/toast-provider", () => ({
  ...jest.requireActual("@/providers/toast-provider"),
  ...require("@/test-support/mocks/toast-provider").toastProviderMock,
}));

jest.mock("@/hooks/use-coach-report", () => ({
  useCoachReport: () => ({ window: {}, report: null, context: null }),
}));

const mockPush = jest.fn();
jest.mock("expo-router", () => {
  const actual = jest.requireActual("@/test-support/mocks/expo-router");
  return {
    ...actual.expoRouterMock,
    useRouter: () => ({
      push: mockPush,
      back: jest.fn(),
      replace: jest.fn(),
      canGoBack: () => false,
      canDismiss: () => false,
    }),
    useFocusEffect: jest.fn(),
  };
});

beforeEach(async () => {
  mockPush.mockClear();
  resetToastMock();
  await resetTrackerStore();
  khushuStore.setState({ items: [], isReady: true });
  jest.mocked(useFocusEffect).mockImplementation((callback) => {
    useEffect(callback, [callback]);
  });
});

afterEach(() => {
  jest.mocked(useFocusEffect).mockReset();
  jest.restoreAllMocks();
});

describe("Statistics load failure (B-76)", () => {
  it("renders a RetryCard instead of a skeleton forever, and Retry refetches", async () => {
    const getAll = jest
      .spyOn(PrayerRepository, "getAll")
      .mockRejectedValueOnce(new Error("storage unavailable"));

    await renderWithProviders(<StatisticsScreen />);
    await waitFor(
      () => expect(screen.getByText("Couldn't load your statistics. Try again.")).toBeTruthy(),
      {
        timeout: 15_000,
      },
    );

    const callsBeforeRetry = getAll.mock.calls.length;
    getAll.mockResolvedValue([]);
    await act(async () => {
      fireEvent.press(screen.getByText("Try again"));
    });
    await waitFor(() => expect(getAll.mock.calls.length).toBeGreaterThan(callsBeforeRetry), {
      timeout: 15_000,
    });
    await waitFor(() => expect(screen.queryByText("Try again")).toBeNull(), { timeout: 15_000 });
  });
});

describe("Achievements first run (B-84)", () => {
  it("leads with the intro for a new user, not a zeroed hero", async () => {
    await renderWithProviders(<AchievementsScreen />);
    await waitFor(() => expect(screen.getByText("Your journey starts today")).toBeTruthy(), {
      timeout: 15_000,
    });
    expect(screen.queryByText("Devotion level progress")).toBeNull();
  });
});

describe("Achievements refresh errors (B-84)", () => {
  afterEach(() => restoreTrackerStore());

  it("shows an error toast when the refresh fails instead of swallowing it", async () => {
    await seedTrackerStore({ refresh: jest.fn().mockRejectedValue(new Error("nope")) });
    await renderWithProviders(<AchievementsScreen />);
    await waitFor(
      () =>
        expect(mockToast.error).toHaveBeenCalledWith(
          "Couldn't refresh your progress. Showing what we have.",
        ),
      { timeout: 15_000 },
    );
  });
});

describe("Coach loading (G-24)", () => {
  it("shows skeleton cards rather than grey text while the report builds", async () => {
    await renderWithProviders(<CoachScreen />);
    // The skeleton carries the spoken loading label; no bare loading line.
    expect(screen.getByLabelText("Looking over your week…")).toBeTruthy();
  });
});

describe("Journal first step (B-80)", () => {
  it("routes the empty state's action to the tracker when nothing is completed", async () => {
    await renderWithProviders(<JournalScreen />);
    await waitFor(() => expect(screen.getByText("No reflections yet")).toBeTruthy());
    fireEvent.press(screen.getByText("Open tracker"));
    expect(mockPush).toHaveBeenCalledWith("/tracker");
  });

  it("offers today's completed Salah, a radiogroup rating with nothing preselected", async () => {
    await PrayerRepository.setStatus("fajr", getLocalDateString(), "completed");
    await loadTrackerStore();
    await renderWithProviders(<JournalScreen />);
    await waitFor(() => expect(screen.getByLabelText("Reflect on Fajr")).toBeTruthy(), {
      timeout: 15_000,
    });
    fireEvent.press(screen.getByLabelText("Reflect on Fajr"));

    const group = await screen.findByLabelText("Khushu (presence)");
    expect(group.props.accessibilityRole).toBe("radiogroup");
    const stars = screen.getAllByRole("radio", { name: /^\d, / });
    expect(stars).toHaveLength(5);
    for (const star of stars) expect(star.props.accessibilityState?.selected).toBe(false);
    expect(screen.getByText("Choose how present you were")).toBeTruthy();
  });

  it("deletes with Undo and restores the entry", async () => {
    const today = getLocalDateString();
    await act(async () => {
      await khushuStore.getState().save({ date: today, prayerId: "fajr", rating: 4, note: "calm" });
    });
    await renderWithProviders(<JournalScreen />);
    await waitFor(() => expect(screen.getByText("calm")).toBeTruthy());

    await act(async () => {
      fireEvent.press(screen.getByLabelText("Delete reflection"));
    });
    await waitFor(() => expect(screen.queryByText("calm")).toBeNull());
    const options = mockToast.show.mock.calls.at(-1)?.[1];
    expect(options?.action?.label).toBe("Undo");
    await act(async () => {
      options?.action?.onPress();
    });
    await waitFor(() => expect(screen.getByText("calm")).toBeTruthy());
  });
});
