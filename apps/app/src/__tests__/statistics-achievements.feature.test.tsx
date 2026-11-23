import { getLocalDateString } from "@munib-tracker/shared/utils";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { useFocusEffect } from "expo-router";
import { useEffect } from "react";

import AchievementsScreen from "@/app/achievements";
import StatisticsScreen from "@/app/statistics";
import { PrayerRepository, QazaRepository } from "@/db";
import { renderWithProviders } from "@/test-support/render";
import { resetTrackerStore } from "@/test-support/store";

const FARD = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;

beforeEach(async () => {
  await resetTrackerStore();
  // The global mock makes useFocusEffect a no-op; run focus callbacks as effects
  // so the screens load their data like a focused route would.
  jest.mocked(useFocusEffect).mockImplementation((callback) => {
    useEffect(callback, [callback]);
  });
});

afterEach(() => {
  jest.mocked(useFocusEffect).mockReset();
});

describe("Statistics screen", () => {
  it("shows the empty state before anything is tracked", async () => {
    await renderWithProviders(<StatisticsScreen />);
    await waitFor(() => expect(screen.getByText("No statistics yet")).toBeTruthy(), {
      timeout: 15_000,
    });
  });

  it("summarises tracked salah per period and per salah", async () => {
    const today = getLocalDateString();
    for (const prayer of FARD) await PrayerRepository.setStatus(prayer, today, "completed");
    await PrayerRepository.setStatus("fajr", today, "missed");
    await QazaRepository.setCounter("fajr", 10, 5);

    await renderWithProviders(<StatisticsScreen />);

    await waitFor(() => expect(screen.getByText("By salah")).toBeTruthy(), { timeout: 15_000 });
    // Today: 4 of 5 on time → the period average and the status breakdown.
    expect(screen.getByText("Avg 80% on time")).toBeTruthy();
    expect(screen.getByText("Status breakdown")).toBeTruthy();
    // Per-salah: Fajr was missed, Dhuhr prayed.
    expect(screen.getByText("0 on time · 0 late · 1 missed")).toBeTruthy();
    expect(screen.getAllByText("1 on time · 0 late · 0 missed")).toHaveLength(4);
    // Lifetime qaza card.
    expect(screen.getByText("Qaza & fasting debt")).toBeTruthy();
    expect(screen.getByText("5 of 15 made up")).toBeTruthy();

    // The year view swaps the chart to months.
    fireEvent.press(screen.getByText("Year"));
    await waitFor(() => expect(screen.getByText("This year")).toBeTruthy());
  });
});

describe("Achievements screen", () => {
  it("shows tracks with the next target and keeps earned milestones grouped", async () => {
    const today = getLocalDateString();
    for (const prayer of FARD) await PrayerRepository.setStatus(prayer, today, "completed");

    await renderWithProviders(<AchievementsScreen />);

    await waitFor(() => expect(screen.getByText("Progress tracks")).toBeTruthy(), {
      timeout: 15_000,
    });
    // 5 salah → Salah track at level 2 ("Steady Start"), next up level 3.
    expect(screen.getAllByText("Steady Start").length).toBeGreaterThan(0);
    expect(screen.getByText("Next: Daily Worshipper")).toBeTruthy();
    expect(screen.getByText("Where your Noor comes from")).toBeTruthy();
    expect(screen.getByText("Milestones reached")).toBeTruthy();
  });
});
