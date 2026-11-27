const mockSources = {
  quran: jest.fn(),
  fasting: jest.fn(),
  habits: jest.fn(),
  dhulHijjah: jest.fn(),
  rawatib: jest.fn(),
  iqamah: jest.fn(),
  muhasabah: jest.fn(),
  familyTies: jest.fn(),
  coach: jest.fn(),
  vault: jest.fn(),
};
const mockCapture = jest.fn();
const mockTracker = {
  qazaCounters: [{ remaining: 0 }],
  roza: { remaining: 0 },
};

jest.mock("@/lib/quran-companion/reminder-options", () => ({
  quranRevisionReminderOptions: () => mockSources.quran(),
}));
jest.mock("@/lib/voluntary-fasting/reminder-options", () => ({
  voluntaryFastingReminderOptions: () => mockSources.fasting(),
}));
jest.mock("@/lib/notifications/sunnah-habits-reminder-options", () => ({
  sunnahHabitsReminderOptions: () => mockSources.habits(),
}));
jest.mock("@/lib/notifications/dhul-hijjah-reminder-options", () => ({
  dhulHijjahReminderOptions: () => mockSources.dhulHijjah(),
}));
jest.mock("@/lib/rawatib-nudge", () => ({ rawatibNudgeOptions: () => mockSources.rawatib() }));
jest.mock("@/lib/masjid/iqamah-reminder-options", () => ({
  iqamahReminderOptions: () => mockSources.iqamah(),
}));
jest.mock("@/lib/muhasabah/reminder-options", () => ({
  muhasabahReminderOptions: () => mockSources.muhasabah(),
}));
jest.mock("@/lib/family-ties/reminder-options", () => ({
  familyTiesReminderOptions: () => mockSources.familyTies(),
}));
jest.mock("@/lib/coach/reminder-options", () => ({
  coachReminderOptions: () => mockSources.coach(),
}));
jest.mock("@/lib/notifications/vault-reminder-options", () => ({
  vaultReminderOptions: () => mockSources.vault(),
}));
jest.mock("@/lib/sentry", () => ({
  captureAppException: (...args: unknown[]) => mockCapture(...args),
}));
jest.mock("@/stores/tracker-store", () => ({
  trackerStore: { getState: () => mockTracker },
}));

import { collectReminderOptions } from "./reminder-options";

beforeEach(() => {
  mockCapture.mockReset();
  for (const source of Object.values(mockSources)) {
    source.mockReset();
    source.mockResolvedValue({});
  }
  mockTracker.qazaCounters = [{ remaining: 0 }];
  mockTracker.roza = { remaining: 0 };
});

describe("collectReminderOptions", () => {
  it("merges every feature's inputs with the Qaza debt flag", async () => {
    mockTracker.qazaCounters = [{ remaining: 3 }];
    mockSources.quran.mockResolvedValue({ revisionReminderEnabled: true });
    mockSources.muhasabah.mockResolvedValue({ time: "bedtime", reviewedDates: [] });
    mockSources.vault.mockResolvedValue({ debtDueDates: ["2026-07-04"] });

    await expect(collectReminderOptions()).resolves.toMatchObject({
      hasQazaDebt: true,
      revisionReminderEnabled: true,
      muhasabah: { time: "bedtime", reviewedDates: [] },
      debtDueDates: ["2026-07-04"],
    });
  });

  it("builds without a feature whose input fails, and reports it", async () => {
    const error = new Error("storage");
    mockSources.habits.mockRejectedValue(error);
    mockSources.coach.mockResolvedValue({ coach: { hasRecentActivity: true } });

    const options = await collectReminderOptions();

    expect(options).toMatchObject({ hasQazaDebt: false, coach: { hasRecentActivity: true } });
    expect(options).not.toHaveProperty("sunnahHabits");
    expect(mockCapture).toHaveBeenCalledWith(
      error,
      expect.objectContaining({ tags: expect.objectContaining({ source: "sunnahHabits" }) }),
    );
  });
});
