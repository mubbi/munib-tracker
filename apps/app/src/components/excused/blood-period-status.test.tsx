import type { ExcusedReason, MadhhabId, ObligatoryPrayer } from "@munib-tracker/shared/types";
import { addDays } from "@munib-tracker/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, screen } from "@testing-library/react-native";

import { BloodPeriodStatus } from "@/components/excused/blood-period-status";
import { PrayerRepository, PreferencesRepository } from "@/db";
import { toursStore } from "@/stores/tours-store";
import { buildPrayerLog } from "@/test-support/fixtures/prayer";
import { resetPreferences, setPreferences } from "@/test-support/preferences";
import { renderWithTheme } from "@/test-support/render";
import { restoreTrackerStore, seedTrackerStore } from "@/test-support/store";

const FARD: ObligatoryPrayer[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
const setDayExcused = jest.fn(async () => {});
const setQazaCounters = jest.fn(async () => {});

async function seedPeriod(start: string, days: number, reason: ExcusedReason) {
  for (let i = 0; i < days; i++) {
    for (const prayerId of FARD) {
      await PrayerRepository.upsertLog(
        buildPrayerLog({
          prayerId,
          date: addDays(start, i),
          status: "pending",
          isExcused: true,
          excusedReason: reason,
        }),
      );
    }
  }
}

async function setup(opts: {
  madhhab: MadhhabId | null;
  today: string;
  active: ExcusedReason | null;
}) {
  // The theme provider reloads preferences from storage on mount — persist them too.
  await PreferencesRepository.update({ madhhab: opts.madhhab });
  await setPreferences({ madhhab: opts.madhhab });
  await seedTrackerStore({
    date: opts.today,
    excusedReason: opts.active,
    qazaCounters: [{ prayerId: "fajr", remaining: 3, completed: 1 }],
    setDayExcused,
    setQazaCounters,
  });
  await renderWithTheme(<BloodPeriodStatus />);
}

beforeEach(async () => {
  await AsyncStorage.clear();
  toursStore.setState({ seen: [], isReady: true });
  setDayExcused.mockClear();
  setQazaCounters.mockClear();
});
afterEach(async () => {
  restoreTrackerStore();
  await resetPreferences();
});

describe("BloodPeriodStatus", () => {
  it("Hanafi: day counter against a 10-day maximum", async () => {
    await seedPeriod("2026-11-01", 6, "hayd");
    await setup({ madhhab: "hanafi", today: "2026-11-06", active: "hayd" });
    expect(await screen.findByText("Day 6 of a maximum of 10 (Hanafi)")).toBeTruthy();
  });

  it("Shafi'i: 15-day maximum; nifas uses 60", async () => {
    await seedPeriod("2026-11-01", 6, "nifas");
    await setup({ madhhab: "shafii", today: "2026-11-06", active: "nifas" });
    expect(await screen.findByText("Day 6 of a maximum of 60 (Shafi'i)")).toBeTruthy();
  });

  it("all views: shows the schools' range, never one school's maximum", async () => {
    await seedPeriod("2026-11-01", 6, "hayd");
    await setup({ madhhab: null, today: "2026-11-06", active: "hayd" });
    expect(await screen.findByText("Day 6 · the schools' maximum is 10–15 days")).toBeTruthy();
  });

  it("Hanafi day 11: istihada prompt with a Resume button (no automatic change)", async () => {
    await seedPeriod("2026-11-01", 11, "hayd");
    await setup({ madhhab: "hanafi", today: "2026-11-11", active: "hayd" });
    expect(await screen.findByText(/is istihada in your school/)).toBeTruthy();
    expect(setDayExcused).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByText("Resume salah"));
    expect(setDayExcused).toHaveBeenCalledWith(null);
  });

  it("Hanafi short period: 'Add 10 to qaza' adds per salah only on tap", async () => {
    await seedPeriod("2026-11-01", 2, "hayd");
    await setup({ madhhab: "hanafi", today: "2026-11-05", active: null });
    expect(await screen.findByText(/may not count as hayd/)).toBeTruthy();
    expect(setQazaCounters).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByText("Add 10 to qaza"));
    expect(setQazaCounters).toHaveBeenCalledWith({
      fajr: { remaining: 5, completed: 1 },
      dhuhr: { remaining: 2, completed: 0 },
      asr: { remaining: 2, completed: 0 },
      maghrib: { remaining: 2, completed: 0 },
      isha: { remaining: 2, completed: 0 },
    });
    expect(toursStore.getState().seen).toContain("hayd-short-period:2026-11-01:2026-11-02");
  });

  it("Shafi'i: a 2-day period gets no short-period prompt", async () => {
    await seedPeriod("2026-11-01", 2, "hayd");
    await setup({ madhhab: "shafii", today: "2026-11-05", active: null });
    await act(async () => {});
    expect(screen.queryByText(/may not count as hayd/)).toBeNull();
  });

  it("a dismissed short-period prompt stays hidden", async () => {
    await toursStore.getState().markSeen("hayd-short-period:2026-11-01:2026-11-02");
    await seedPeriod("2026-11-01", 2, "hayd");
    await setup({ madhhab: "hanafi", today: "2026-11-05", active: null });
    await act(async () => {});
    expect(screen.queryByText(/may not count as hayd/)).toBeNull();
  });
});
