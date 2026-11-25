import { getLocalDateString } from "@munib-tracker/shared/utils";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { useFocusEffect } from "expo-router";
import { useEffect } from "react";

import AchievementsScreen from "@/app/achievements";
import StatisticsScreen from "@/app/statistics";
import { PrayerRepository, QazaRepository } from "@/db";
import { QuranPracticeRepository } from "@/db/repositories/quran-practice-repository";
import { buildPracticeSummary } from "@/test-support/fixtures/quran-companion";
import { setPlatform } from "@/test-support/platform";
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

  it("summarises tracked Salah per period and per Salah", async () => {
    const today = getLocalDateString();
    for (const prayer of FARD) await PrayerRepository.setStatus(prayer, today, "completed");
    await PrayerRepository.setStatus("fajr", today, "missed");
    await QazaRepository.setCounter("fajr", 10, 5);

    await renderWithProviders(<StatisticsScreen />);

    await waitFor(() => expect(screen.getByText("By Salah")).toBeTruthy(), { timeout: 15_000 });
    // Today: 4 of 5 on time → the period average and the status breakdown.
    expect(screen.getByText("Avg 80% on time")).toBeTruthy();
    expect(screen.getByText("Status breakdown")).toBeTruthy();
    // Per-salah: Fajr was missed, Dhuhr prayed.
    expect(screen.getByText("0 on time · 0 late · 1 missed")).toBeTruthy();
    expect(screen.getAllByText("1 on time · 0 late · 0 missed")).toHaveLength(4);
    // Lifetime qaza card.
    expect(screen.getByText("Qaza and fasts to make up")).toBeTruthy();
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

  it("shows the Recitation track and its Noor from practice history (D71)", async () => {
    await QuranPracticeRepository.add(
      buildPracticeSummary({ id: "p1", heardAyahs: [1, 2, 3, 4, 5, 6, 7] }),
    );

    await renderWithProviders(<AchievementsScreen />);

    await waitFor(() => expect(screen.getByText("Progress tracks")).toBeTruthy(), {
      timeout: 15_000,
    });
    expect(screen.getAllByText("Recitation").length).toBeGreaterThan(0);
    expect(screen.getAllByText("First recitation").length).toBeGreaterThan(0);
    expect(screen.getByText("Next: A week of revision")).toBeTruthy();
    expect(screen.getByText("Personal — never compared with anyone")).toBeTruthy();
    // 1 session × 5 + 7 ayahs × 1 in the Noor breakdown.
    expect(screen.getByText(/Ayahs recited · 7 × 1/)).toBeTruthy();
    expect(screen.getByText(/Recitation sessions · 1 × 5/)).toBeTruthy();
  });

  it("shows no Recitation card on TV, where practice is unavailable", async () => {
    const restore = setPlatform({ isTV: true });
    try {
      await QuranPracticeRepository.add(buildPracticeSummary({ id: "p1", heardAyahs: [1, 2] }));
      await renderWithProviders(<AchievementsScreen />);
      await waitFor(() => expect(screen.getByText("Progress tracks")).toBeTruthy(), {
        timeout: 15_000,
      });
      expect(screen.queryByText("Recitation")).toBeNull();
      expect(screen.queryByText(/Ayahs recited/)).toBeNull();
    } finally {
      restore();
    }
  });
});
